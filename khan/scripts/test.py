from pathlib import Path
import sys,unittest
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"packages/python-khan-sdk"))
suite=unittest.defaultTestLoader.discover(str(ROOT/"tests/unit"),pattern="test_*.py")
result=unittest.TextTestRunner(verbosity=2).run(suite)
raise SystemExit(0 if result.wasSuccessful() else 1)
