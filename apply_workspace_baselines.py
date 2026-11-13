#!/usr/bin/env python3
"""
⚡ Antigravity Workspace Baseline Applicator (apply_workspace_baselines.py)

Applies the complete Antigravity Baseline standard across ALL projects in
G:\\My Drive\\Antigravity\\Projects:
1. Discovers all web/UI projects (root and nested entrypoints like wwwroot, dashboard, static).
2. Deploys the 6 core baseline assets:
   - high-gloss-lacquer.css
   - high-gloss-lacquer.js
   - cosmic-background.js
   - cosmic_cityscape.jpg
   - mcp-baseline.js
   - mcp-registry.json
3. Safely verifies and injects baseline tags into all HTML entrypoints (<head>).
4. Verifies Python and Scripting baselines (.gitignore, UTF-8 compatibility).
5. Updates Sync-StillCosmicAndLacquer.ps1 with 100% workspace coverage targets.
"""

import os
import sys
import shutil
import re

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PROJECTS_ROOT = r"G:\My Drive\Antigravity\Projects"
DEPLOY_DIR = os.path.join(PROJECTS_ROOT, "deploy")
SYNC_SCRIPT = os.path.join(DEPLOY_DIR, "Sync-StillCosmicAndLacquer.ps1")

BASELINE_FILES = [
    "high-gloss-lacquer.css",
    "high-gloss-lacquer.js",
    "cosmic-background.js",
    "cosmic_cityscape.jpg",
    "mcp-baseline.js",
    "mcp-registry.json",
    "aws-enterprise-baseline.css",
    "aws-enterprise-baseline.js",
    "children-learning-baseline.css",
    "children-learning-baseline.js"
]

def get_projects():
    """List all project directories excluding cache/internal dirs."""
    projects = []
    for d in sorted(os.listdir(PROJECTS_ROOT)):
        path = os.path.join(PROJECTS_ROOT, d)
        if os.path.isdir(path) and not d.startswith(".") and d not in ["New folder", "New folder (3)", "New folder (4)", "deploy"]:
            projects.append(d)
    return projects

def find_web_targets(project_name):
    """Find directories within a project that host HTML entrypoints."""
    p_path = os.path.join(PROJECTS_ROOT, project_name)
    targets = []

    # Check root
    root_files = [f for f in os.listdir(p_path) if os.path.isfile(os.path.join(p_path, f))]
    if any(f.lower().endswith(".html") for f in root_files):
        targets.append(p_path)

    # Check standard subdirectories
    subdirs_to_check = ["wwwroot", "dashboard", "static", os.path.join("extension", "popup")]
    for sub in subdirs_to_check:
        sub_path = os.path.join(p_path, sub)
        if os.path.isdir(sub_path):
            sub_files = [f for f in os.listdir(sub_path) if os.path.isfile(os.path.join(sub_path, f))]
            if any(f.lower().endswith(".html") for f in sub_files):
                if sub_path not in targets:
                    targets.append(sub_path)

    return targets

def copy_baseline_assets(target_dir):
    """Copy all baseline files to the target directory."""
    copied = 0
    for file_name in BASELINE_FILES:
        src = os.path.join(DEPLOY_DIR, file_name)
        dst = os.path.join(target_dir, file_name)
        if os.path.exists(src):
            try:
                shutil.copy2(src, dst)
                copied += 1
            except Exception as e:
                print(f"    [!] Failed to copy {file_name} to {target_dir}: {e}")
    return copied

def inject_baseline_html(html_file_path):
    """Ensure baseline CSS and JS assets are linked inside <head>."""
    try:
        with open(html_file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        modified = False
        lower_content = content.lower()

        tags_to_inject = []
        if "high-gloss-lacquer.css" not in lower_content:
            tags_to_inject.append('  <link rel="stylesheet" href="high-gloss-lacquer.css">')
        if "aws-enterprise-baseline.css" not in lower_content:
            tags_to_inject.append('  <link rel="stylesheet" href="aws-enterprise-baseline.css">')
        if "high-gloss-lacquer.js" not in lower_content:
            tags_to_inject.append('  <script src="high-gloss-lacquer.js"></script>')
        if "cosmic-background.js" not in lower_content:
            tags_to_inject.append('  <script src="cosmic-background.js"></script>')
        if "mcp-baseline.js" not in lower_content:
            tags_to_inject.append('  <script src="mcp-baseline.js"></script>')
        if "aws-enterprise-baseline.js" not in lower_content:
            tags_to_inject.append('  <script src="aws-enterprise-baseline.js"></script>')

        if tags_to_inject:
            injection_block = "\n  <!-- Antigravity Baseline Integration -->\n" + "\n".join(tags_to_inject) + "\n"
            if "</head>" in content:
                content = content.replace("</head>", injection_block + "</head>", 1)
                modified = True
            elif "</HEAD>" in content:
                content = content.replace("</HEAD>", injection_block + "</HEAD>", 1)
                modified = True

        if modified:
            with open(html_file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"    [!] Error modifying {html_file_path}: {e}")
        return False

def ensure_python_baseline(project_name):
    """Ensure standard .gitignore for Python projects."""
    p_path = os.path.join(PROJECTS_ROOT, project_name)
    py_files = [f for f in os.listdir(p_path) if f.endswith(".py")]
    if py_files or os.path.exists(os.path.join(p_path, "requirements.txt")):
        gitignore_path = os.path.join(p_path, ".gitignore")
        if not os.path.exists(gitignore_path):
            with open(gitignore_path, "w", encoding="utf-8") as f:
                f.write("__pycache__/\n*.py[cod]\n*$py.class\n.venv/\nenv/\nvenv/\n.pytest_cache/\n*.log\n.env\n")
            return True
    return False

def update_sync_script(all_targets):
    """Update Sync-StillCosmicAndLacquer.ps1 with all discovered web targets."""
    if not os.path.exists(SYNC_SCRIPT):
        return

    targets_formatted = ",\n".join([f"  '{t}'" for t in sorted(list(set(all_targets)))])
    
    new_script_content = f"""# Synchronize still cosmic background, clean matte system, and AWS enterprise baseline across all projects
$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) {{ $ScriptDir = $PSScriptRoot }}
Set-Location -Path $ScriptDir

$srcDir = 'G:\\My Drive\\Antigravity\\Projects\\deploy'
$files = @(
  'cosmic-background.js',
  'high-gloss-lacquer.css',
  'high-gloss-lacquer.js',
  'cosmic_cityscape.jpg',
  'mcp-baseline.js',
  'mcp-registry.json',
  'aws-enterprise-baseline.css',
  'aws-enterprise-baseline.js'
)

$targets = @(
{targets_formatted}
)

$updatedCount = 0

foreach ($target in $targets) {{
  if (Test-Path -LiteralPath $target) {{
    foreach ($file in $files) {{
      $srcFile = Join-Path $srcDir $file
      $destFile = Join-Path $target $file
      if (Test-Path -LiteralPath $srcFile) {{
        Copy-Item -LiteralPath $srcFile -Destination $destFile -Force
        $updatedCount++
      }}
    }}
    Write-Host "Synchronized $target successfully."
  }}
}}

Write-Host "Total files synchronized: $updatedCount"
"""
    with open(SYNC_SCRIPT, "w", encoding="utf-8") as f:
        f.write(new_script_content)
    print(f"✅ Updated {SYNC_SCRIPT} with {len(all_targets)} targets.")

def main():
    print("=" * 65)
    print("⚡ Antigravity Master Baseline Applicator Starting...")
    print("=" * 65)

    projects = get_projects()
    print(f"📁 Total Workspace Projects: {len(projects)}")

    all_web_targets = []
    total_assets_copied = 0
    total_html_updated = 0
    total_py_gitignores = 0

    for p in projects:
        p_path = os.path.join(PROJECTS_ROOT, p)
        web_targets = find_web_targets(p)

        if web_targets:
            for target in web_targets:
                all_web_targets.append(target)
                copied = copy_baseline_assets(target)
                total_assets_copied += copied

                # Inspect HTML files in this target
                for f in os.listdir(target):
                    if f.lower().endswith(".html"):
                        html_path = os.path.join(target, f)
                        if inject_baseline_html(html_path):
                            total_html_updated += 1
                            print(f"  [+] Injected baseline tags into: {p}/{f}")

        # Check Python baseline
        if ensure_python_baseline(p):
            total_py_gitignores += 1
            print(f"  [+] Added standard .gitignore to: {p}")

    print("\n--- BASELINE APPLICATION SUMMARY ---")
    print(f"• Total Web Target Hubs Synced: {len(all_web_targets)}")
    print(f"• Total Baseline Asset Files Deployed: {total_assets_copied}")
    print(f"• Total HTML Entrypoints Enhanced with Baseline Tags: {total_html_updated}")
    print(f"• Total Python Projects Hardened with .gitignore: {total_py_gitignores}")

    # Update deploy/Sync-StillCosmicAndLacquer.ps1
    update_sync_script(all_web_targets)

    print("\n🎉 Master Baseline Successfully Applied Across ALL Workspace Projects!")
    print("=" * 65)

if __name__ == "__main__":
    main()
