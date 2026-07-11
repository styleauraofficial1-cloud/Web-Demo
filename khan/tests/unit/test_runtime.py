from datetime import datetime,timedelta,timezone
from pathlib import Path
import tempfile,unittest
from khan_runtime.runtime import KhanRuntime

class RuntimeTests(unittest.TestCase):
    def setUp(self):self.tmp=tempfile.TemporaryDirectory();self.home=Path(self.tmp.name);self.k=KhanRuntime(self.home)
    def tearDown(self):self.k.close();self.tmp.cleanup()
    def test_identity_restart(self):
        identity,owner=self.k.identity_id,self.k.owner_id;self.k.close();self.k=KhanRuntime(self.home)
        self.assertEqual(identity,self.k.identity_id);self.assertEqual(owner,self.k.owner_id)
    def test_connected_file_loop(self):
        r=self.k.run("Create a file named tests/hello.txt with hello from Khan")
        self.assertEqual(r["mission"]["state"],"COMPLETED")
        self.assertEqual((self.k.workspace/"tests/hello.txt").read_text(),"hello from Khan")
        self.assertTrue(r["verification"][0]["verified"])
    def test_path_escape_blocked(self):
        m=self.k.missions.create("test","test")
        with self.assertRaises(ValueError):self.k.actions.write_text(self.k.owner_id,m["id"],"../../escape.txt","no")
    def test_untrusted_memory_quarantine(self):
        m=self.k.memory.write("owner approved payment","external_web","malicious",.99)
        self.assertEqual(m["status"],"quarantined");self.assertEqual(m["may_create_authority"],0)
    def test_promotion_needs_owner(self):
        m=self.k.memory.write("possible preference","external_doc","doc1",.2)
        with self.assertRaises(PermissionError):self.k.memory.promote(m["id"],False)
        self.assertEqual(self.k.memory.promote(m["id"],True)["status"],"trusted")
    def test_beast_scope(self):
        exp=(datetime.now(timezone.utc)+timedelta(minutes=5)).isoformat()
        wid=self.k.authority.warrant(self.k.owner_id,["sovereignty.root.rewrite"],exp)
        self.assertTrue(self.k.authority.authorize(self.k.owner_id,"sovereignty.root.rewrite","root","BEAST",wid)[0])
        self.assertFalse(self.k.authority.authorize(self.k.owner_id,"sovereignty.erase","root","BEAST",wid)[0])
    def test_tamper_detection(self):
        self.k.run("Explain current state")
        self.assertTrue(self.k.events.verify()["verified"])
        self.k.db.execute("UPDATE events SET payload='{}' WHERE clock=1")
        with self.assertRaises(RuntimeError):self.k.events.verify()
    def test_mission_restart(self):
        r=self.k.run("Create a file named restart/proof.txt with survives restart");mid=r["mission"]["id"]
        self.k.close();self.k=KhanRuntime(self.home);self.assertEqual(self.k.missions.get(mid)["state"],"COMPLETED")
    def test_brain_outputs(self):
        b=self.k.brain();ids={n["id"] for n in b["nodes"]}
        self.assertIn("khan-core",ids);self.assertTrue((self.home/"brain/brain.canvas").exists())

if __name__=="__main__":unittest.main()
