from __future__ import annotations
from pathlib import Path
import argparse,json,os
from .runtime import KhanRuntime
from .api import serve

def main(argv=None):
    p=argparse.ArgumentParser(prog="khanctl");p.add_argument("--home",type=Path,default=Path(os.getenv("KHAN_HOME","runtime")))
    s=p.add_subparsers(dest="cmd",required=True)
    for name in ("init","demo","status","verify","brain","missions","token"):s.add_parser(name)
    r=s.add_parser("run");r.add_argument("request",nargs="+")
    v=s.add_parser("serve");v.add_argument("--host",default="127.0.0.1");v.add_argument("--port",type=int,default=8765)
    a=p.parse_args(argv);runtime=KhanRuntime(a.home)
    try:
        if a.cmd=="init":out=runtime.status()
        elif a.cmd=="demo":out=runtime.run("Create a file named demonstrations/first-khan-artifact.txt with Khan first verified connected nervous loop is alive.")
        elif a.cmd=="run":out=runtime.run(" ".join(a.request))
        elif a.cmd=="status":out=runtime.status()
        elif a.cmd=="verify":out=runtime.verify_all()
        elif a.cmd=="brain":out=runtime.brain()
        elif a.cmd=="missions":out=runtime.missions.list()
        elif a.cmd=="token":print(runtime.owner_token);return 0
        elif a.cmd=="serve":
            root=Path(__file__).resolve().parents[3]
            serve(runtime,root/"apps/khan-hologram/dist",a.host,a.port);return 0
        print(json.dumps(out,indent=2,default=str));return 0
    finally:
        if a.cmd!="serve":runtime.close()

if __name__=="__main__":raise SystemExit(main())
