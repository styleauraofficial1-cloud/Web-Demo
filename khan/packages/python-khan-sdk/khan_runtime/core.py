from __future__ import annotations
from datetime import datetime, timezone
from pathlib import Path
import hashlib, hmac, json, os, secrets, sqlite3
from typing import Any

def now() -> str:
    return datetime.now(timezone.utc).isoformat()

def canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def uid(prefix: str) -> str:
    return f"{prefix}_{secrets.token_hex(10)}"

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

class Database:
    SCHEMA = """
    PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS identity(id TEXT PRIMARY KEY, created_at TEXT, constitution_hash TEXT);
    CREATE TABLE IF NOT EXISTS principals(id TEXT PRIMARY KEY, name TEXT, is_owner INTEGER, authenticated INTEGER);
    CREATE TABLE IF NOT EXISTS grants(id TEXT PRIMARY KEY, principal_id TEXT, action TEXT, resource TEXT, revoked INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS warrants(id TEXT PRIMARY KEY, principal_id TEXT, scope TEXT, expires_at TEXT, revoked INTEGER DEFAULT 0, signature TEXT);
    CREATE TABLE IF NOT EXISTS events(
      clock INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE, identity_id TEXT, principal_id TEXT,
      type TEXT, mission_id TEXT, wall_time TEXT, payload TEXT, prev_hash TEXT, event_hash TEXT, signature TEXT
    );
    CREATE TABLE IF NOT EXISTS missions(
      id TEXT PRIMARY KEY, request TEXT, purpose TEXT, state TEXT, plan TEXT, result TEXT, created_at TEXT, updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS memories(
      id TEXT PRIMARY KEY, content TEXT, source_type TEXT, source_ref TEXT, trust REAL,
      privacy TEXT, status TEXT, may_create_authority INTEGER DEFAULT 0, mission_id TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS evidence(
      id TEXT PRIMARY KEY, sha256 TEXT UNIQUE, media_type TEXT, path TEXT, size INTEGER, metadata TEXT, created_at TEXT
    );
    """
    def __init__(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("PRAGMA synchronous=FULL")
        self.conn.executescript(self.SCHEMA)
        self.conn.commit()
    def execute(self, sql: str, args: tuple = ()):
        cur = self.conn.execute(sql, args); self.conn.commit(); return cur
    def one(self, sql: str, args: tuple = ()):
        return self.conn.execute(sql, args).fetchone()
    def all(self, sql: str, args: tuple = ()):
        return self.conn.execute(sql, args).fetchall()
    def close(self): self.conn.close()

class Authority:
    NORMAL = {
      "mission.create","mission.update","mission.read","memory.write","memory.read","memory.promote",
      "action.file.write","action.file.read","brain.read","events.read","evidence.read"
    }
    def __init__(self, db: Database, key: bytes):
        self.db, self.key = db, key
    def owner(self, name="Owner") -> str:
        row=self.db.one("SELECT id FROM principals WHERE is_owner=1")
        if row: return row["id"]
        pid=uid("principal")
        self.db.execute("INSERT INTO principals VALUES(?,?,1,1)",(pid,name))
        for action in self.NORMAL:
            self.db.execute("INSERT INTO grants VALUES(?,?,?,?,0)",(uid("grant"),pid,action,"*"))
        return pid
    def authorize(self, pid: str, action: str, resource: str, mode="KHAN", warrant_id=None):
        p=self.db.one("SELECT * FROM principals WHERE id=?",(pid,))
        if not p or not p["authenticated"]: return False,"Unauthenticated principal"
        if mode=="BEAST":
            row=self.db.one("SELECT * FROM warrants WHERE id=? AND principal_id=? AND revoked=0",(warrant_id,pid))
            if not row: return False,"Beast Warrant missing"
            expires=datetime.fromisoformat(row["expires_at"])
            scope=json.loads(row["scope"])
            return (p["is_owner"] and expires>datetime.now(timezone.utc) and action in scope), "Scoped Beast Warrant"
        row=self.db.one("SELECT id FROM grants WHERE principal_id=? AND action=? AND revoked=0",(pid,action))
        return (bool(row), "Scoped Khan Mode grant" if row else "No matching grant")
    def warrant(self,pid: str,scope:list[str],expires_at:str)->str:
        p=self.db.one("SELECT * FROM principals WHERE id=?",(pid,))
        if not p or not p["is_owner"]: raise PermissionError("Only owner can issue Beast Warrant")
        wid=uid("warrant"); payload=canonical({"id":wid,"principal":pid,"scope":sorted(scope),"expires":expires_at})
        sig=hmac.new(self.key,payload.encode(),hashlib.sha256).hexdigest()
        self.db.execute("INSERT INTO warrants VALUES(?,?,?,?,0,?)",(wid,pid,canonical(sorted(scope)),expires_at,sig))
        return wid

class EventFabric:
    def __init__(self,db:Database,identity_id:str,key:bytes):
        self.db,self.identity_id,self.key=db,identity_id,key
    def append(self,principal_id:str,event_type:str,mission_id=None,payload=None):
        last=self.db.one("SELECT event_hash FROM events ORDER BY clock DESC LIMIT 1")
        prev=last["event_hash"] if last else "GENESIS"
        eid=uid("event"); body={"id":eid,"identity_id":self.identity_id,"principal_id":principal_id,
          "type":event_type,"mission_id":mission_id,"wall_time":now(),"payload":payload or {},"prev_hash":prev}
        event_hash=digest(canonical(body).encode())
        sig=hmac.new(self.key,event_hash.encode(),hashlib.sha256).hexdigest()
        self.db.execute("INSERT INTO events(id,identity_id,principal_id,type,mission_id,wall_time,payload,prev_hash,event_hash,signature) VALUES(?,?,?,?,?,?,?,?,?,?)",
          (eid,self.identity_id,principal_id,event_type,mission_id,body["wall_time"],canonical(body["payload"]),prev,event_hash,sig))
        return {**body,"event_hash":event_hash,"signature":sig}
    def verify(self):
        expected="GENESIS"; count=0
        for r in self.db.all("SELECT * FROM events ORDER BY clock"):
            body={"id":r["id"],"identity_id":r["identity_id"],"principal_id":r["principal_id"],"type":r["type"],
              "mission_id":r["mission_id"],"wall_time":r["wall_time"],"payload":json.loads(r["payload"]),"prev_hash":r["prev_hash"]}
            if r["prev_hash"]!=expected: raise RuntimeError("Broken causal chain")
            observed=digest(canonical(body).encode())
            expected_sig=hmac.new(self.key,observed.encode(),hashlib.sha256).hexdigest()
            if observed!=r["event_hash"] or not hmac.compare_digest(expected_sig,r["signature"]):
                raise RuntimeError("Event tampering detected")
            expected=observed; count+=1
        return {"verified":True,"event_count":count,"head_hash":expected}

class Evidence:
    def __init__(self,db:Database,root:Path):
        self.db,self.root=db,root; root.mkdir(parents=True,exist_ok=True)
    def put(self,data:bytes,media_type="application/octet-stream",metadata=None):
        sha=digest(data); old=self.db.one("SELECT * FROM evidence WHERE sha256=?",(sha,))
        if old:return dict(old)
        eid=uid("evidence"); path=self.root/sha[:2]/sha; path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(data)
        self.db.execute("INSERT INTO evidence VALUES(?,?,?,?,?,?,?)",(eid,sha,media_type,str(path),len(data),canonical(metadata or {}),now()))
        return dict(self.db.one("SELECT * FROM evidence WHERE id=?",(eid,)))
    def verify(self,eid:str):
        r=self.db.one("SELECT * FROM evidence WHERE id=?",(eid,))
        if not r:return {"verified":False,"reason":"missing record"}
        p=Path(r["path"])
        return {"verified":p.exists() and digest(p.read_bytes())==r["sha256"],"sha256":r["sha256"]}

class Missions:
    transitions={"CREATED":{"INTERPRETED","FAILED"},"INTERPRETED":{"PLANNED","FAILED"},"PLANNED":{"EXECUTING","FAILED"},
      "EXECUTING":{"VERIFYING","FAILED"},"VERIFYING":{"COMPLETED","FAILED"},"COMPLETED":set(),"FAILED":{"EXECUTING"}}
    def __init__(self,db:Database,events:EventFabric,pid:str): self.db,self.events,self.pid=db,events,pid
    def create(self,request,purpose):
        mid=uid("mission"); t=now()
        self.db.execute("INSERT INTO missions VALUES(?,?,?,?,?,?,?,?)",(mid,request,purpose,"CREATED","[]","{}",t,t))
        self.events.append(self.pid,"mission.created",mid,{"state":"CREATED"}); return self.get(mid)
    def get(self,mid):
        r=self.db.one("SELECT * FROM missions WHERE id=?",(mid,))
        if not r:raise KeyError(mid)
        d=dict(r); d["plan"]=json.loads(d["plan"]); d["result"]=json.loads(d["result"]); return d
    def list(self): return [self.get(r["id"]) for r in self.db.all("SELECT id FROM missions ORDER BY created_at DESC")]
    def move(self,mid,state,plan=None,result=None):
        m=self.get(mid)
        if state not in self.transitions[m["state"]]: raise RuntimeError(f"Invalid transition {m['state']}->{state}")
        self.db.execute("UPDATE missions SET state=?,plan=?,result=?,updated_at=? WHERE id=?",
          (state,canonical(plan if plan is not None else m["plan"]),canonical(result if result is not None else m["result"]),now(),mid))
        self.events.append(self.pid,f"mission.{state.lower()}",mid,{"from":m["state"],"to":state})
        return self.get(mid)

class Memory:
    trusted={"authenticated_owner","verified_system","verified_artifact"}
    def __init__(self,db:Database,events:EventFabric,pid:str): self.db,self.events,self.pid=db,events,pid
    def write(self,content,source_type,source_ref,trust,mission_id=None,privacy="owner_private"):
        status="trusted" if source_type in self.trusted and trust>=.75 else "quarantined"; mid=uid("memory")
        self.db.execute("INSERT INTO memories VALUES(?,?,?,?,?,?,?,?,?,?)",
          (mid,content,source_type,source_ref,float(trust),privacy,status,0,mission_id,now()))
        self.events.append(self.pid,"memory.written",mission_id,{"memory_id":mid,"status":status,"may_create_authority":False})
        return dict(self.db.one("SELECT * FROM memories WHERE id=?",(mid,)))
    def promote(self,mid,owner_authorized=False):
        if not owner_authorized: raise PermissionError("Owner authorization required")
        self.db.execute("UPDATE memories SET status='trusted' WHERE id=?",(mid,))
        return dict(self.db.one("SELECT * FROM memories WHERE id=?",(mid,)))
    def search(self,q):
        return [dict(r) for r in self.db.all("SELECT * FROM memories WHERE status='trusted' AND content LIKE ? ORDER BY trust DESC",(f"%{q}%",))]

class Actions:
    def __init__(self,workspace:Path,authority:Authority,events:EventFabric,evidence:Evidence):
        self.workspace,self.authority,self.events,self.evidence=workspace,authority,events,evidence
        workspace.mkdir(parents=True,exist_ok=True)
    def path(self,relative):
        root=self.workspace.resolve(); p=(self.workspace/relative).resolve()
        if p!=root and root not in p.parents: raise ValueError("Path escapes authorized workspace")
        return p
    def write_text(self,pid,mission_id,relative,content):
        allowed,reason=self.authority.authorize(pid,"action.file.write",f"workspace:{relative}")
        if not allowed: raise PermissionError(reason)
        p=self.path(relative); p.parent.mkdir(parents=True,exist_ok=True)
        previous=p.read_bytes() if p.exists() else None
        checkpoint=self.evidence.put(previous,metadata={"kind":"checkpoint"}) if previous is not None else None
        self.events.append(pid,"action.prepared",mission_id,{"path":relative,"checkpoint":checkpoint["id"] if checkpoint else None})
        try:
            data=content.encode(); temp=p.with_suffix(p.suffix+".khan-tmp"); temp.write_bytes(data); temp.replace(p)
            if p.read_bytes()!=data: raise RuntimeError("Independent verification failed")
            artifact=self.evidence.put(data,"text/plain",{"kind":"verified_artifact","path":relative})
            self.events.append(pid,"action.committed",mission_id,{"path":relative,"sha256":artifact["sha256"],"evidence_id":artifact["id"]})
            return {"status":"committed","path":str(p),"sha256":artifact["sha256"],"evidence_id":artifact["id"]}
        except Exception:
            if previous is None:p.unlink(missing_ok=True)
            else:p.write_bytes(previous)
            self.events.append(pid,"action.rolled_back",mission_id,{"path":relative})
            raise
