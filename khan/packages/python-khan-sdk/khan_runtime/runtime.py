from __future__ import annotations
from pathlib import Path
import hashlib, json, os, re, secrets
from .core import Database, Authority, EventFabric, Evidence, Missions, Memory, Actions, canonical, digest, now, uid

CONSTITUTION="One Khan. Owner authority. Models propose. Deterministic gates authorize. Reality verifies."

class KhanRuntime:
    def __init__(self,home):
        self.home=Path(home); self.home.mkdir(parents=True,exist_ok=True)
        self.private=self.home/"private"; self.private.mkdir(exist_ok=True)
        self.workspace=self.home/"workspace"; self.workspace.mkdir(exist_ok=True)
        self.key=self._secret("root.bin"); self.owner_token=self._token()
        self.db=Database(self.home/"khan.db")
        row=self.db.one("SELECT id FROM identity")
        if row:self.identity_id=row["id"]
        else:
            self.identity_id=uid("khan")
            self.db.execute("INSERT INTO identity VALUES(?,?,?)",(self.identity_id,now(),digest(CONSTITUTION.encode())))
        self.authority=Authority(self.db,self.key); self.owner_id=self.authority.owner(os.getenv("KHAN_OWNER_NAME","Owner"))
        self.events=EventFabric(self.db,self.identity_id,hashlib.sha256(self.key+b"events").digest())
        self.evidence=Evidence(self.db,self.home/"evidence"); self.missions=Missions(self.db,self.events,self.owner_id)
        self.memory=Memory(self.db,self.events,self.owner_id); self.actions=Actions(self.workspace,self.authority,self.events,self.evidence)
    def _secret(self,name):
        p=self.private/name
        if p.exists():return p.read_bytes()
        b=secrets.token_bytes(32);p.write_bytes(b);return b
    def _token(self):
        p=self.private/"owner_token.txt"
        if p.exists():return p.read_text().strip()
        t=secrets.token_urlsafe(28);p.write_text(t);return t
    def compile(self,request):
        patterns=[
          re.compile(r"(?:create|write|make)\s+(?:a\s+)?file(?:\s+named|\s+called)?\s+(?P<path>[\w./\\ -]+\.[A-Za-z0-9]+)\s+(?:with|containing)\s+(?P<content>.+)",re.I|re.S),
          re.compile(r"(?:create|write)\s+(?P<path>[\w./\\ -]+\.[A-Za-z0-9]+)\s*:\s*(?P<content>.+)",re.I|re.S)]
        for pat in patterns:
            m=pat.search(request.strip())
            if m:return {"purpose":f"Create and independently verify {m.group('path').strip()}.",
              "action":{"type":"write_text","path":m.group("path").strip().replace("\\","/"),"content":m.group("content").strip().strip('"')},
              "unknowns":[]}
        return {"purpose":"Produce a bounded evidence-backed response.","action":None,
          "unknowns":["No deterministic real-world action was identified by the reference compiler."]}
    def brain(self):
        nodes=[
          {"id":"khan-core","name":"Khan Continuity Core","maturity":"prototype","trust":"stable_spine"},
          {"id":"sovereignty-root","name":"Sovereignty Root","maturity":"prototype","trust":"trusted_kernel"},
          {"id":"causal-event-fabric","name":"Causal Event Fabric","maturity":"prototype","trust":"trusted_kernel"},
          {"id":"mission-runtime","name":"Mission Runtime","maturity":"prototype","trust":"stable_spine"},
          {"id":"memory-runtime","name":"Memory Runtime","maturity":"prototype","trust":"stable_spine"},
          {"id":"action-runtime","name":"Transactional Action Runtime","maturity":"prototype","trust":"trusted_kernel"},
          {"id":"windows-node","name":"Windows Body","maturity":"conceptual","trust":"device"},
          {"id":"frontier-lab","name":"Frontier Organ Laboratory","maturity":"conceptual","trust":"quarantined_frontier"}]
        for m in self.missions.list():nodes.append({"id":m["id"],"name":m["purpose"],"maturity":"runtime","trust":"mission","state":m["state"]})
        edges=[
          {"id":"e1","source":"sovereignty-root","target":"action-runtime","type":"authorizes","authority_transfer":False},
          {"id":"e2","source":"mission-runtime","target":"causal-event-fabric","type":"stores","authority_transfer":False},
          {"id":"e3","source":"action-runtime","target":"windows-node","type":"acts_on","authority_transfer":False},
          {"id":"e4","source":"memory-runtime","target":"khan-core","type":"informs","authority_transfer":False}]
        graph={"version":"0.1","generated_at":now(),"root":"khan-core","nodes":nodes,"edges":edges}
        out=self.home/"brain";out.mkdir(exist_ok=True)
        (out/"brain.json").write_text(json.dumps(graph,indent=2))
        canvas_nodes=[{"id":n["id"],"type":"text","text":f"# {n['name']}\n\nMaturity: {n['maturity']}\nTrust: {n['trust']}",
          "x":(i%4)*380,"y":(i//4)*260,"width":320,"height":180} for i,n in enumerate(nodes)]
        canvas_edges=[{"id":e["id"],"fromNode":e["source"],"toNode":e["target"],"label":e["type"]} for e in edges]
        (out/"brain.canvas").write_text(json.dumps({"nodes":canvas_nodes,"edges":canvas_edges},indent=2))
        return graph
    def run(self,request):
        intent=self.compile(request);m=self.missions.create(request,intent["purpose"])
        self.missions.move(m["id"],"INTERPRETED")
        plan={"strategy":"deterministic_action_and_verification" if intent["action"] else "bounded_local_response",
          "steps":["authorize","execute","observe","verify","record","learn"],"external_cost_usd":0}
        self.missions.move(m["id"],"PLANNED",plan=plan);self.missions.move(m["id"],"EXECUTING")
        if intent["action"]:
            a=intent["action"]; result={"kind":"file","action":self.actions.write_text(self.owner_id,m["id"],a["path"],a["content"])}
            evidence_ids=[result["action"]["evidence_id"]]
        else:
            text=f"Reference Khan received: {request}. A frontier model is not configured, so no unverified claim was made."
            ev=self.evidence.put(text.encode(),"text/plain",{"kind":"bounded_response","mission_id":m["id"]})
            result={"kind":"response","text":text}; evidence_ids=[ev["id"]]
        self.missions.move(m["id"],"VERIFYING",result=result)
        verification=[self.evidence.verify(e) for e in evidence_ids]
        if not all(v["verified"] for v in verification):
            self.missions.move(m["id"],"FAILED",result={"error":"verification failed"});raise RuntimeError("verification failed")
        completed=self.missions.move(m["id"],"COMPLETED",result={**result,"verification":verification})
        memory=self.memory.write(f"Verified mission {m['id']} completed: {intent['purpose']}","verified_system",f"mission:{m['id']}",.95,m["id"])
        graph=self.brain()
        return {"mission":completed,"intent":intent,"plan":plan,"result":result,"verification":verification,"memory":memory,
          "brain":{"nodes":len(graph["nodes"]),"edges":len(graph["edges"])}}
    def status(self):
        return {"identity_id":self.identity_id,"owner_id":self.owner_id,"mode":"KHAN",
          "missions":len(self.missions.list()),"events":self.events.verify()["event_count"],
          "memories":self.db.one("SELECT COUNT(*) c FROM memories WHERE status!='deleted'")["c"],
          "integrity":self.events.verify()}
    def verify_all(self):
        rows=self.db.all("SELECT id FROM evidence")
        evidence={r["id"]:self.evidence.verify(r["id"]) for r in rows}
        chain=self.events.verify(); graph=self.brain()
        return {"verified":chain["verified"] and all(v["verified"] for v in evidence.values()),
          "event_chain":chain,"evidence":evidence,"brain":{"nodes":len(graph["nodes"]),"edges":len(graph["edges"])}}
    def close(self):self.db.close()
