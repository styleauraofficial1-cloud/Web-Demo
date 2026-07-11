from __future__ import annotations
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from http import HTTPStatus
from pathlib import Path
from urllib.parse import urlparse
import json
from .runtime import KhanRuntime

class Handler(SimpleHTTPRequestHandler):
    runtime: KhanRuntime
    gui: Path
    def __init__(self,*a,**kw): super().__init__(*a,directory=str(self.gui),**kw)
    def send_json(self,data,status=200):
        raw=json.dumps(data,indent=2,default=str).encode()
        self.send_response(status);self.send_header("Content-Type","application/json")
        self.send_header("Content-Length",str(len(raw)));self.send_header("Cache-Control","no-store")
        self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        path=urlparse(self.path).path
        if path=="/api/health": return self.send_json({"healthy":True,**self.runtime.status()})
        if path=="/api/brain": return self.send_json(self.runtime.brain())
        if path=="/api/missions": return self.send_json(self.runtime.missions.list())
        if path=="/api/events": return self.send_json([dict(r) for r in self.runtime.db.all("SELECT * FROM events ORDER BY clock DESC LIMIT 100")])
        return super().do_GET()
    def do_POST(self):
        if self.headers.get("X-Khan-Owner-Token","")!=self.runtime.owner_token:
            return self.send_json({"error":"Authenticated local owner token required"},HTTPStatus.UNAUTHORIZED)
        length=int(self.headers.get("Content-Length","0"))
        try:data=json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:return self.send_json({"error":"Invalid JSON"},HTTPStatus.BAD_REQUEST)
        try:
            if urlparse(self.path).path=="/api/missions/run":
                request=str(data.get("request","")).strip()
                if not request:raise ValueError("request is required")
                return self.send_json(self.runtime.run(request),HTTPStatus.CREATED)
            if urlparse(self.path).path=="/api/verify":return self.send_json(self.runtime.verify_all())
            return self.send_json({"error":"Not found"},HTTPStatus.NOT_FOUND)
        except Exception as e:return self.send_json({"error":type(e).__name__,"message":str(e)},HTTPStatus.INTERNAL_SERVER_ERROR)

def serve(runtime:KhanRuntime,gui:Path,host="127.0.0.1",port=8765):
    Handler.runtime=runtime;Handler.gui=gui
    server=ThreadingHTTPServer((host,port),Handler)
    print(f"Khan interface: http://{host}:{port}")
    print(f"Local owner token: {runtime.owner_token}")
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
