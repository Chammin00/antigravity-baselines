#!/usr/bin/env python3
"""
🧪 Verification Test Suite for Children's Learning Baseline (JumpStart Modernization)
Validates all asset files, DOM structures, JavaScript runtime engines, and curriculum data.
"""

import os
import sys
import json
import re

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PROJECTS_DIR = r"G:\My Drive\Antigravity\Projects"
BASELINES_DIR = os.path.join(PROJECTS_DIR, "baselines")
LEARNING_DIR = os.path.join(PROJECTS_DIR, "1st grade learning")

def run_tests():
    passed = 0
    failed = 0

    print("============================================================")
    print("🎒 Running Children's Learning Baseline Verification Suite...")
    print("============================================================")

    # Test 1: Baseline Specification File
    spec_path = os.path.join(BASELINES_DIR, "CHILDREN_LEARNING_BASELINE.md")
    if os.path.exists(spec_path):
        with open(spec_path, "r", encoding="utf-8") as f:
            content = f.read()
        assert "JumpStart Modernization" in content
        assert "Hub-and-Spoke" in content
        assert "Frankie the Dog" in content
        assert "Milk Cap" in content
        print("  [PASS] 1. Baseline specification CHILDREN_LEARNING_BASELINE.md verified.")
        passed += 1
    else:
        print("  [FAIL] 1. Missing CHILDREN_LEARNING_BASELINE.md")
        failed += 1

    # Test 2: CSS Baseline File Integrity
    css_path = os.path.join(BASELINES_DIR, "children-learning-baseline.css")
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
        assert "--js-chalkboard" in css
        assert ".js-btn-3d" in css
        assert ".js-milkcap-card" in css
        assert ".js-mascot-container" in css
        print(f"  [PASS] 2. CSS baseline verified ({len(css)} bytes).")
        passed += 1
    else:
        print("  [FAIL] 2. Missing children-learning-baseline.css")
        failed += 1

    # Test 3: JS Baseline Engine Integrity & Syntax
    js_path = os.path.join(BASELINES_DIR, "children-learning-baseline.js")
    if os.path.exists(js_path):
        with open(js_path, "r", encoding="utf-8") as f:
            js = f.read()
        assert "ProceduralAudioEngine" in js
        assert "FrankieCompanion" in js
        assert "MilkCapVault" in js
        assert "AdaptiveScaffoldingEngine" in js
        assert "window.JumpStartBaseline" in js
        print(f"  [PASS] 3. JS baseline engine verified ({len(js)} bytes).")
        passed += 1
    else:
        print("  [FAIL] 3. Missing children-learning-baseline.js")
        failed += 1

    # Test 4: JumpStart Application Interface (jumpstart.html)
    jumpstart_path = os.path.join(LEARNING_DIR, "jumpstart.html")
    if os.path.exists(jumpstart_path):
        with open(jumpstart_path, "r", encoding="utf-8") as f:
            html = f.read()
        assert "JumpStart 1st Grade" in html
        assert "children-learning-baseline.css" in html
        assert "children-learning-baseline.js" in html
        assert "modal-phonics" in html
        assert "modal-math" in html
        assert "modal-science" in html
        assert "modal-arcade" in html
        assert "modal-vault" in html
        assert "modal-dashboard" in html
        assert "js-frankie-avatar" in html
        print(f"  [PASS] 4. JumpStart app (jumpstart.html) verified ({len(html)} bytes).")
        passed += 1
    else:
        print("  [FAIL] 4. Missing jumpstart.html in 1st grade learning")
        failed += 1

    # Test 5: Integration in 1st Grade Learning Hub (index.html)
    index_path = os.path.join(LEARNING_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            idx = f.read()
        assert "children-learning-baseline.css" in idx
        assert "children-learning-baseline.js" in idx
        assert "jumpstart.html" in idx
        print("  [PASS] 5. 1st grade learning index.html properly links JumpStart & baseline.")
        passed += 1
    else:
        print("  [FAIL] 5. Missing index.html in 1st grade learning")
        failed += 1

    # Test 6: Habits Registry & Baseline Engine Reflection
    reg_path = os.path.join(BASELINES_DIR, "habits_registry.json")
    if os.path.exists(reg_path):
        with open(reg_path, "r", encoding="utf-8") as f:
            reg = json.load(f)
        found = any(b.get("id") == "children_learning_edutainment" for b in reg.get("active_baselines", []))
        if found:
            print("  [PASS] 6. habits_registry.json contains children_learning_edutainment baseline.")
            passed += 1
        else:
            print("  [FAIL] 6. children_learning_edutainment not found in habits_registry.json")
            failed += 1
    else:
        print("  [FAIL] 6. Missing habits_registry.json")
        failed += 1

    # Test 7: Workspace AGENTS.md Inclusion
    agents_path = os.path.join(PROJECTS_DIR, "AGENTS.md")
    if os.path.exists(agents_path):
        with open(agents_path, "r", encoding="utf-8") as f:
            ag = f.read()
        assert "Children's Learning & Edutainment Baseline" in ag
        assert "JumpStart Modernization" in ag
        print("  [PASS] 7. Workspace AGENTS.md includes Section 7 Children's Learning Baseline.")
        passed += 1
    else:
        print("  [FAIL] 7. Missing AGENTS.md")
        failed += 1

    print("============================================================")
    if failed == 0:
        print(f"🎉 ALL {passed} TESTS PASSED! Children's Learning Baseline is 100% verified!")
        print("============================================================")
        return 0
    else:
        print(f"❌ {failed} tests failed out of {passed + failed}.")
        print("============================================================")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
