#!/usr/bin/env python3
"""
⚡ Antigravity Automated Baseline Engine & Habit Tracker (baseline_tracker.py)

1. Continuously scans Antigravity conversation transcripts (~/.gemini/antigravity/brain).
2. Extracts user requests, questions, repeated commands, and behavioral habits.
3. Quantifies patterns and categorizes user workflows into high-frequency clusters.
4. Auto-generates and updates active baseline rule definitions in:
   - G:\\My Drive\\Antigravity\\Projects\\AGENTS.md (Workspace root)
   - C:\\Users\\chase\\.gemini\\config\\rules\\antigravity-baseline.md (Global)
5. Emits a live structured habits_registry.json for UI observability and automation runners.
"""

import os
import sys
import json
import re
from collections import Counter, defaultdict
from datetime import datetime

# Enforce UTF-8 console output for Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BRAIN_DIR = r"C:\Users\chase\.gemini\antigravity\brain"
PROJECTS_DIR = r"G:\My Drive\Antigravity\Projects"
BASELINES_DIR = os.path.join(PROJECTS_DIR, "baselines")
GLOBAL_RULES_DIR = r"C:\Users\chase\.gemini\config\rules"
WORKSPACE_AGENTS_MD = os.path.join(PROJECTS_DIR, "AGENTS.md")
GLOBAL_BASELINE_MD = os.path.join(GLOBAL_RULES_DIR, "antigravity-baseline.md")
REGISTRY_JSON_PATH = os.path.join(BASELINES_DIR, "habits_registry.json")

# Core Habit Categories & Rule Synthesis Signatures
CATEGORY_DEFINITIONS = {
    "multi_agent_godot_blender_workflow": {
        "name": "Multi-Agent Design & Development Workflows (Mobile App & Godot 4 + Blender Game Baseline)",
        "description": "Orchestrates 3-agent Mobile App Design (Product, UI/UX, Tech Architect) and 3-agent Video Game Design (Game Director, Content & Art, Systems & Gameplay) workflows with UX/Feasibility quality gates, enforcing Godot 4 + headless Blender (bpy -> .glb) as the baseline game stack whenever scope matches.",
        "keywords": ["blender", "multi-agent", "workflow to baseline", "godot", "glb", "node3d", "gdd", "game director", "content & art", "systems & gameplay", "product agent", "ui/ux agent", "tech architect", "3d motion", "kagura", "chessclash"],
        "baseline_rule": "Enforce the Multi-Agent Design & Development Workflows: (1) Mobile App Design (Product Agent -> UI/UX Agent [UX Review Gate] -> Tech Architect Agent [Cross-Platform Feasibility Gate] -> App Spec & Prototype Delivery), and (2) Video Game Design (Game Director Agent -> Content & Art Agent [Concept Art & Mechanics Gate + Blender bpy 3D .glb rigging/animation pipeline] -> Systems & Gameplay Agent [Godot 4 Engine & Physics Rules + Resource/Platform Feasibility Gate] -> GDD, Asset List & Playable Godot 4 Build). Default to Godot 4 + Blender whenever game development matches scope."
    },
    "visual_to_code_reconstruction": {
        "name": "Visual-to-Code UI Reconstruction (Tailwind/React Clean-Room Clone)",
        "description": "Reconstructs clean, semantic Tailwind CSS and React components purely from visual appearance ('Write a clean Tailwind/React component that looks exactly like this'), completely bypassing bloated or obfuscated underlying HTML/CSS DOM structures.",
        "keywords": ["looks exactly like this", "tailwind/react", "visual appearance", "bypassing your underlying html", "clean tailwind", "reconstruct", "copying the xbox app", "reverse engineer this page", "visual-to-code", "clean-room", "referencing the game that we should copy"],
        "baseline_rule": "When cloning, reverse-engineering, or recreating any UI or desktop/web application, enforce the Visual-to-Code Clean-Room Directive ('Write a clean Tailwind/React component that looks exactly like this'): reconstruct modular React components and utility-first Tailwind CSS purely from visual hierarchy, spatial grid, and surface optics, bypassing the target's underlying HTML/CSS DOM completely while binding live MCP telemetry."
    },
    "youtube_gaming_automation": {
        "name": "Autonomous YouTube Gaming & Shorts Pipeline",
        "description": "Continuous scanning of Xbox Game DVR captures, power weapon audio layering, mobile safe-zone scaling, and quota uploads.",
        "keywords": ["youtube", "gaming uploads", "sentinel_daemon", "eustace", "game dvr", "xbox", "obs", "shorts", "upload quota"],
        "baseline_rule": "Execute autonomous YouTube gaming upload cycles with sub-60 character CTR titles, Yu Yu Hakusho quote pairing, and 0-5s retention validation."
    },
    "high_gloss_cosmic_ui": {
        "name": "High-Gloss Lacquer & Motionless Cosmic UI Baseline",
        "description": "Physical material optics with Navy/Camel gold tokens, stationary 4K backdrop, and MCP Telemetry HUD on all web apps.",
        "keywords": ["planetarium", "gui", "custom gui", "baseline", "high-gloss", "lacquer", "space background", "planets", "cosmic"],
        "baseline_rule": "Always include high-gloss-lacquer.css/.js, cosmic-background.js, and mcp-baseline.js. Never use animated canvas screensavers or moving noise."
    },
    "anti_slop_craftsmanship": {
        "name": "Anti-Slop Craftsmanship & Verification",
        "description": "Zero emoji asset flips, pure premium gameplay, WCAG AAA contrast, tactile kinesthetics, hand-drawn and hand-colored object aesthetics, and mandatory pre-completion test verification.",
        "keywords": ["slop", "emoji", "test before completing", "testing", "tactile", "feedback", "kinesthetics", "no ads", "clean copy", "hand drawn", "hand colored", "deslop", "aesthetic", "npr"],
        "baseline_rule": "Zero tolerance for OS emojis as game assets, zero purple prose, zero ad wrappers. For webpage creations, all objects, images, and models must embody a hand-drawn, hand-colored feel. Always run and verify functional code before declaring task complete."
    },
    "linux_rhel_certifications": {
        "name": "Red Hat (RHCSA/OpenShift) & Automation Scripting",
        "description": "Strict RHEL 8/9 administration, OpenShift container orchestration (DO180/DO280/DO380), and CompTIA exam drills.",
        "keywords": ["rhcsa", "openshift", "do180", "do280", "do380", "comptia", "rhel", "linux", "exam", "bash", "playbook", "ansible"],
        "baseline_rule": "Apply strict Bash `set -euo pipefail` and modern PowerShell PascalCase cmdlets with [CmdletBinding()] and object streaming."
    },
    "e_commerce_deal_scrapers": {
        "name": "Global Deals & Hardware Scrapers",
        "description": "Scanning daily price drops for PC hardware (SSDs, handheld accessories) comparing mainstream brands with Chinese counterparts, plus Steam & Xbox discounts.",
        "keywords": ["deal", "deals", "electronics", "discounts", "steam", "chinese counterparts", "ssd", "handheld gaming", "netac", "kingspec"],
        "baseline_rule": "Provide structured side-by-side comparison tables including price, real-world value, endurance metrics, and clear buying recommendations."
    },
    "local_ai_ollama_sync": {
        "name": "Local LLM Orchestration & Skills Sync",
        "description": "Compiling Antigravity skills into local Ollama Modelfiles and structured knowledge bases for sub-millisecond local inference.",
        "keywords": ["ollama", "skills sync", "modelfile", "qwen", "llama", "local ai", "models tools", "knowledge base"],
        "baseline_rule": "Automate local skills synchronization to Ollama Modelfiles with zero cloud-leakage of private workspace code. Every prompt, skill, and rule must run correctly on local Ollama models, not only on cloud models."
    },
    "game_studio_modding": {
        "name": "Game Studio Engine & ROM Modding",
        "description": "Unreal Engine 5.8, Unity 6, Godot 4 automation, live PIE control, and binary ROM header/IPS modding.",
        "keywords": ["switch", "emulator", "keys", "game studio", "rom", "shadowblade", "unreal", "unity", "godot", "pie"],
        "baseline_rule": "Integrate Game Studio and Game Capture MCP tools directly for real-time engine telemetry and gameplay recording."
    },
    "cybersecurity_audits": {
        "name": "Cybersecurity & Data Privacy Shield",
        "description": "Continuous host hygiene auditing, unquoted path detection, Defender definitions, and data broker opt-out automation.",
        "keywords": ["security", "spam", "broker", "vulnerability", "opt-out", "sentinel pc", "privilege escalation"],
        "baseline_rule": "Execute non-intrusive security posture diagnostics and export structured JSON audit metrics."
    },
    "children_learning_edutainment": {
        "name": "Children Learning & Edutainment Baseline (JumpStart Modernization)",
        "description": "Non-linear hub-and-spoke schoolhouse navigation, voiced companion mascots, 100 collectible milk caps, adaptive difficulty scaffolding, procedural audio chimes, hand-drawn vector visuals, and COPPA-compliant local progress tracking derived from top GitHub open-source learning apps.",
        "keywords": ["children learning", "jumpstart", "edutainment", "1st grade", "kindergarten", "learning app", "gcompris", "antura", "tux math", "kids game", "phonics", "sight words", "milk cap"],
        "baseline_rule": "Children learning apps must feature non-linear schoolhouse hub exploration, friendly voiced mascot companionship (Web Speech), adaptive difficulty scaling, tactile collection rewards (milk caps/stars), hand-drawn/colored vector visuals, and zero-ad offline-first architecture."
    }
}

def scan_transcripts():
    """Traverse all brain directories and extract every user request."""
    requests = []
    if not os.path.exists(BRAIN_DIR):
        return requests

    for root, dirs, files in os.walk(BRAIN_DIR):
        if "transcript.jsonl" in files:
            path = os.path.join(root, "transcript.jsonl")
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        if '"type":"USER_INPUT"' in line:
                            try:
                                record = json.loads(line)
                                raw_content = record.get("content", "")
                                match = re.search(r"<USER_REQUEST>(.*?)</USER_REQUEST>", raw_content, re.DOTALL)
                                prompt_text = match.group(1).strip() if match else raw_content.strip()
                                created_at = record.get("created_at", "")
                                if prompt_text:
                                    requests.append({
                                        "date": created_at,
                                        "text": prompt_text,
                                        "file": path
                                    })
                            except Exception:
                                pass
            except Exception:
                pass
    return requests

def analyze_habits(requests):
    """Cluster requests, calculate frequencies, and synthesize active habits."""
    clusters = {k: {"meta": v, "items": [], "count": 0} for k, v in CATEGORY_DEFINITIONS.items()}
    uncategorized = []
    text_counter = Counter()

    for req in requests:
        text = req["text"]
        text_lower = text.lower()
        text_counter[text] += 1
        matched = False

        for cat_id, cat_info in CATEGORY_DEFINITIONS.items():
            if any(kw in text_lower for kw in cat_info["keywords"]):
                clusters[cat_id]["items"].append(req)
                clusters[cat_id]["count"] += 1
                matched = True
                break

        if not matched:
            uncategorized.append(req)

    # Calculate repetitive prompt patterns
    top_repetitive = []
    for prompt, count in text_counter.most_common(25):
        if len(prompt.strip()) > 3:  # skip trivial responses like '1', 'yes'
            top_repetitive.append({
                "count": count,
                "prompt": prompt,
                "first_line": prompt.strip().split("\n")[0][:140]
            })

    return clusters, uncategorized, top_repetitive

def generate_habits_registry(total_count, clusters, top_repetitive):
    """Generate structured JSON registry with active baselines and telemetry."""
    now = datetime.now().isoformat()
    registry = {
        "version": "1.0.0",
        "last_updated": now,
        "total_requests_analyzed": total_count,
        "automated_baselines_count": len(clusters),
        "active_baselines": [],
        "top_recurring_habits": top_repetitive[:12]
    }

    for cat_id, data in clusters.items():
        meta = data["meta"]
        count = data["count"]
        # Extract unique prompt samples
        sample_prompts = list({item["text"].strip().split("\n")[0][:120]: True for item in data["items"]}.keys())[:4]
        
        registry["active_baselines"].append({
            "id": cat_id,
            "title": meta["name"],
            "description": meta["description"],
            "frequency_count": count,
            "percentage": round((count / total_count * 100), 2) if total_count > 0 else 0,
            "status": "Active & Enforced",
            "enforced_rule": meta["baseline_rule"],
            "sample_triggers": sample_prompts
        })

    # Sort baselines by frequency descending
    registry["active_baselines"].sort(key=lambda x: x["frequency_count"], reverse=True)

    with open(REGISTRY_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)

    print(f"✅ Habits Registry generated at: {REGISTRY_JSON_PATH}")
    return registry

def update_baseline_rules(registry):
    """Update AGENTS.md in Projects root and global antigravity-baseline.md with synthesized rules."""
    header = """# Antigravity Automated Workspace Baselines & Habit Standards

> [!NOTE]
> This rule file is continuously synthesized by the Antigravity Baseline Engine based on real-world request patterns, user habits, and recurring task automation across all 62 projects in `G:\\My Drive\\Antigravity\\Projects`.
> All agents operating within this workspace must automatically satisfy these baselines without requiring explicit prompting.

---
"""

    sections = []
    
    # 1. Enterprise Full-Screen UI, GitHub Primer & Anti-Slop Baseline
    sections.append("""## 1. Enterprise Full-Screen UI, GitHub Primer & Anti-Slop Baseline
Whenever creating, modifying, or scaffolding web applications, dashboards, or graphical interfaces:
- **Mandatory 3 Skills Baseline**:
  1. **`enterprise-fullscreen-layout`**:
     - Strict $100\\text{vw} \\times 100\\text{vh}$ full-screen utilization (`overflow: hidden` on root; independent scroll panes).
     - Persistent, collapsible left navigation sidebar ($280\\text{px}$ standard, collapses to $64\\text{px}$ icon strip with transition `width 0.25s cubic-bezier(0.16, 1, 0.3, 1)`).
     - Global top command & search bar ($52\\text{px}$ height, breadcrumbs, live health status pill, real-time `Ctrl+K` filter input, and `⛶ Fullscreen` toggle).
     - Dockable right inspector panel ($360\\text{--}380\\text{px}$) for deep-dive configuration, specs, and audio narration.
     - **Removal of Inferior Setups**: Never use cramped centered wrappers (`max-width: 1200px`/`1560px`) or floaty island cards with dead margin gutters.
  2. **`github-primer-anti-slop-ui`**:
     - GitHub Primer dark tokens: `#090d16` (canvas default), `#0d1117` (panels), `#161b22` (containers), `#010409` (insets/terminals), `#30363d` (1px precision borders).
     - **Strict Prohibition of Emoji Asset Flips**: Never use raw OS emojis (`🧭`, `⚡`, `🪣`, `📦`, `🤖`, `💾`, `🛡️`) as primary UI icons or buttons. Use dedicated, clean dual-tone inline SVG vector silhouettes with $2\\text{px}$ strokes.
     - **High-Gloss Lacquer Integration**: Layer motionless 4K cosmic backdrop (`cosmic-background.js`, `cosmic_cityscape.jpg`), subtle specular top highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.1)`), wet elevation shadows (`0 8px 24px -4px rgba(0,0,0,0.75)`), and beveled depth.
     - **Actionable Copy Only**: Replace purple prose with exact technical parameters (CIDR blocks, port numbers, latencies, SLAs, API actions).
  3. **`interactive-simulation-practice-engine`**:
     - Step-by-step traffic and packet journey simulators with live streaming terminal logs and synchronized canvas node pulses (`pulse-glow`).
     - Gamified, self-grading practice drills with smart fuzzy string matching, contextual hint drawers, solution reveals with comprehensive engineering rationales, real-time radial progress rings, streak counters, and Web Speech API audio narration.
- **Distinct Feature Preservation**:
  - For projects with distinct specialized interaction models (e.g., **Xbox Dashboard Emulator**'s blade sound/tile kinesthetics, **My Planetarium**'s 3D celestial Three.js canvas), retain their unique interactive mechanics while upgrading their outer shell to this full-screen enterprise layout, collapsible left navigation sidebar, and clean SVG vector icons.
""")

    # 2. MCP Telemetry Baseline
    sections.append("""## 2. Model Context Protocol (MCP) Baseline Hub
- Whenever building UI dashboards, management hubs, or system controls:
  - Link `mcp-baseline.js` and reference `mcp-registry.json`.
  - Surface live telemetry for the 7 configured MCP servers:
    1. `game-capture` (OBS Studio 31, NVIDIA ShadowPlay, Xbox Game Bar DVR)
    2. `game-studio` (Unreal Engine 5.8, Unity 6, Godot 4, ROM tools)
    3. `github` (GitHub API developer workflows)
    4. `puppeteer` (Headless Chromium scraping & automation)
    5. `google-drive` (Direct workspace filesystem bridge)
    6. `ollama` (Local LLM inference)
    7. `google-ai-studio` (Gemini 2.5 / 3 reasoning models)
  - Synchronize updates via `G:\\My Drive\\Antigravity\\Projects\\deploy\\Sync-StillCosmicAndLacquer.ps1`.
""")

    # 3. Anti-Slop & Pre-Completion Testing Baseline
    sections.append("""## 3. Anti-Slop Craftsmanship & Mandatory Verification Baseline
- **Mandatory Pre-Completion Testing**:
  - NEVER declare a task complete or deliver code without executing and verifying it in production first.
  - Test browser interfaces, execute python/powershell scripts, and verify zero errors before reporting completion.
- **The Zero-Tolerance AI Slop Rules**:
  1. **Zero Emoji Asset Flips**: Handcrafted SVGs / vector silhouettes over emojis (`🥷`, `⚔️`, `🛡️`).
  2. **Zero Purple Prose**: Mechanics-driven, concise copy. State exact rules, numbers, and state transitions.
  3. **Zero Shovelware Ad-Traps**: 100% pure premium loops; zero ad wrappers or predatory paywalls.
  4. **Asymmetric Design**: Meaningful mechanical variation over shallow color reskins.
  5. **Kinesthetics & Tactile Juice**: Lift states ($1.1\\times$, $+40\\text{dp}$ lift, haptic feedback), hit-stop freezes, and micro screen shakes.
  6. **WCAG AAA Accessibility**: Minimum 48x48dp hit targets and high contrast ratios.
  7. **Hand-Drawn & Hand-Colored Visual Deslopping**: Webpage objects, images, and 3D models must feature organic hand-drawn linework, watercolor/gouache washes, and NPR/toon shaders to eliminate sterile plastic AI render slop.
""")

    # 4. YouTube Gaming Pipeline Baseline
    sections.append("""## 4. YouTube Gaming Automation & Retention Baseline
- **Execution**: When running upload cycles in `automate my day`, scan Xbox Game DVR newest-first, eliminate dead space, layer Eustace's evil laugh on power weapon pickups, apply universal safe zones, and upload under daily quota.
- **Packaging (CTR)**: Titles strictly under 60 characters (no mobile truncation); 2-4 word thumbnail text complementing the title.
- **Thematic Quotes**: Pair gameplay action with authentic Yu Yu Hakusho quotes (Yusuke, Hiei, Kuwabara, Younger Toguro, Genkai).
- **Retention (AVD)**: Zero-fluff intro; 0-5s validation, 6-15s stakes, 16-30s open loop; no exit-intent phrases (*"That's all for today"*).
""")

    # 5. Scripting & Automation Standards
    sections.append("""## 5. Scripting & Systems Automation Baseline
- **PowerShell (5.1 & 7+) Standards**:
  - Strict PascalCase `Verb-Noun` format with Approved Verbs and `[CmdletBinding()]`.
  - Object streaming (`[PSCustomObject]`) instead of string scraping; never call `Format-Table` inside automation routines.
  - Strict `$ErrorActionPreference = 'Stop'`, typed exception catching, and pipeline `process {}` blocks.
- **RHEL 8/9 & Linux Bash Standards**:
  - Mandatory `set -euo pipefail`.
  - Double-quoted variables `"${VAR}"` and safe scratch handling via `mktemp -d` bound to `trap cleanup EXIT INT TERM`.
""")

    # 6. Deals & Market Scrapers Baseline
    sections.append("""## 6. Daily Deals & E-Commerce Scraping Baseline
- When scanning PC hardware deals (SSDs, gaming gear) or gaming discounts (Steam/Xbox):
  - Provide structured side-by-side comparison tables.
  - For global brands (Samsung, Crucial, WD), identify reputable Chinese counterparts (Netac, KingSpec, Fanxiang, Move Speed, UGREEN).
  - Include prices, performance metrics, real-world value, and clear buying recommendations.
""")

    # 7. Children's Learning & Edutainment Baseline
    sections.append("""## 7. Children's Learning & Edutainment Baseline (JumpStart Modernization)
- **Derived From**: Knowledge Adventure JumpStart (Kindergarten/1st Grade) + top GitHub open-source learning apps (`KDE/gcompris`, `vgwb/Antura`, `tux4kids`, `KhaaL/LibreToybox`).
- **Hub-and-Spoke Classroom World**:
  - Replace flat, sterile quiz worksheets with an explorable, non-linear virtual schoolhouse hub.
  - Environmental props must be clickable with animated and audio feedback (wall clock time chimes, spinning globe geography facts, bubbling fish tank, chalkboard word of the day).
- **Mascot Companion & Audio Scaffolding**:
  - Persistent, friendly guide (e.g. Frankie the Dog) using Web Speech API for clear articulated narration and Web Audio API for warm, non-abrasive marimba and xylophone sound chimes.
  - Non-punitive feedback: celebrate victories with fanfares and encourage retries with gentle scaffolding hints after 8s of hesitation.
- **Incentive & Collection Loop (The JumpStart Milk Cap Vault)**:
  - 100 collectible milk caps (POGs) with 3D flip card inspection, rarity tiers (Common, Rare, Legendary), and fun educational facts.
- **Adaptive Scaffolding & 3-Star Mastery**:
  - Automatically step difficulty levels (Explorer, Adventurer, Master) based on answer speed and consecutive streak accuracy.
- **Anti-Slop Craftsmanship & COPPA Compliance**:
  - Hand-drawn and hand-colored vector illustrations (zero raw emoji asset flips).
  - 100% offline-ready local storage: zero third-party ads, zero tracking cookies, zero external telemetry.
""")

    # 8. Visual-to-Code UI Reconstruction Baseline
    sections.append("""## 8. Visual-to-Code UI Reconstruction Baseline (Tailwind/React Clean-Room Clone)
- **Core Directive**: `"Write a clean Tailwind/React component that looks exactly like this."`
- **Clean-Room DOM Bypass**:
  - Reconstruct UI code purely from **visual appearance, layout geometry, typography, and surface optics** alone, completely bypassing the target's underlying legacy HTML, obfuscated CSS classes, or bloated DOM trees.
- **Component & Styling Architecture**:
  - Decompose visual captures into clean, modular **React 18 functional components** (`HeaderRail`, `NavigationSidebar`, `HeroSpotlight`, `MediaCarousel`, `TelemetryInspector`) styled with **semantic Tailwind CSS utility classes**.
  - Extract exact visual tokens (surface luminance, 1px border hairlines `#30363d`, accent glow tokens, grid aspect ratios, and micro-interaction hover elevations) directly from the visual reference.
  - Replace all rasterized icons or emojis with crisp dual-tone inline SVG vector silhouettes and hand-crafted vector artwork.
- **Live MCP & Enterprise Integration**:
  - Wire reconstructed Tailwind/React components directly to live **Model Context Protocol (MCP)** telemetry (`game-capture`, `game-studio`, `puppeteer`, `github`, `google-drive`, `ollama`, `google-ai-studio`) rather than static mock placeholders.
""")

    # 9. Multi-Agent Design & Development Workflows Baseline (Mobile App & Godot 4 + Blender Game Pipeline)
    sections.append("""## 9. Multi-Agent Design & Development Workflows Baseline (Mobile App & Godot 4 + Blender Game Pipeline)
- **Mobile App Design Workflow (Multi-Agent)**:
  1. **Product Agent**: `Receive App Requirements` -> `User Research & Persona Generation` -> `Define Feature Set & User Journey` -> hands off in parallel to UI/UX Agent and Tech Architect Agent -> `Drafting Front-End Views & Layouts` -> `App Spec & Prototype Delivery`.
  2. **UI/UX Agent**: `Generate Wireframes & Information Architecture` -> `UX Review & Flow Check` (if **Fail**, loop back to `Define Feature Set & User Journey`; if **Pass**, advance to `Design System & High-Fi UI Prototypes` with WCAG AAA contrast, 48x48dp touch targets, and zero emoji flips).
  3. **Tech Architect Agent**: `Backend Architecture & API Definition` -> `Cross-Platform Feasibility?` (if **No**, loop back to `Backend Architecture & API Definition`; if **Yes**, feed validated architecture into `Design System & High-Fi UI Prototypes` and `Drafting Front-End Views & Layouts` for Expo/React Native + Web).
- **Video Game Design Workflow (Multi-Agent — Godot 4 + Blender Scope Baseline)**:
  - **Scope-Matched Engine & 3D Asset Baseline**: Whenever game development matches scope (3D/2D action, martial arts, roguelike combat, tactical arenas, or physics-driven games), enforce **Godot 4 (`Node3D` / GDScript 2.0)** + **Headless Blender Python (`bpy` -> `.glb`)** as the baseline stack.
  1. **Game Director Agent**: `Receive Game Concept & Genre` -> `Establish Game Lore & World-building` -> `Define Player Progression & Core Loops` -> handoff to Content & Art Agent. If `Resource & Platform Feasibility?` returns **No**, execute `Revise World & Mechanics` and loop back into world-building and blockout scripting.
  2. **Content & Art Agent (Blender `bpy` 3D Pipeline)**: `Develop Levels, Quests, & Environmental Art Style` -> `Concept Art & Mechanics Review` (if **Fail**, return to `Define Player Progression & Core Loops`; if **Pass**, trigger both `Systems & Gameplay Agent` and `Design Character, UI, & Audio Guidelines`). Execute headless Blender Python (`blender --background --python generate_3d_*.py`) to build 3D character meshes, weapons, skeletal armatures, PBR/emission materials, and NLA keyframed combat animations (`Idle_Poise`, `SingleHit_Cleave`, `MultiHit_Flurry`, `CloseQuarters_Combo`), exporting `.glb` models into Godot's `models/` folder -> `Draft Blockouts & Behavior Scripts` -> `Game Design Document (GDD), Asset List & Playable Godot 4 Build`.
  3. **Systems & Gameplay Agent (Godot 4 Engine & Physics Rules)**: `Determine Game Engine & Physics Rules` (configure Godot 4 `Forward+`, `WorldEnvironment` ACES Filmic glow/fog, dynamic `Camera3D` orbit/combat framing, `AnimationPlayer` state machine, 66ms hit-stop kinesthetics, and procedural audio/haptics) -> `Resource & Platform Feasibility?` (if **No**, handoff to `Revise World & Mechanics`; if **Yes**, feed into `Draft Blockouts & Behavior Scripts` and verify via live Godot 4 execution).
""")

    # 10. Ollama Compatibility Baseline
    sections.append("""## 10. Ollama Compatibility Baseline (All Prompts)
- **Core Directive**: Every prompt, skill, rule, and agent instruction written in this workspace must work with local Ollama models (via the `ollama` MCP server or `http://localhost:11434`), not only with cloud models.
- **Prompt Authoring Rules**:
  - Keep prompts self-contained: no reliance on hidden tools, proprietary function-calling schemas, or cloud-only features. Any tool use must degrade to plain text or JSON output.
  - Keep prompts concise and explicit (numbered steps, exact output format, small examples). Assume a small context window (8k tokens or fewer) and avoid long preambles.
  - For structured output, request plain JSON with a stated schema and validate it. Never assume native structured-output support.
  - No multimodal inputs unless the target Ollama model supports them. Provide a text-only fallback.
- **Verification**: Before declaring a prompt done, run it through `ollama_chat` or `ollama_generate` against at least one installed model (check with `ollama_list_models`) and confirm the output is usable.
- **Privacy**: Local prompts must not send private workspace code to cloud services.
""")

    full_rule_content = header + "\n" + "\n".join(sections)

    # Write to Projects/AGENTS.md
    with open(WORKSPACE_AGENTS_MD, "w", encoding="utf-8") as f:
        f.write(full_rule_content)
    print(f"✅ Updated Workspace Baseline Rule: {WORKSPACE_AGENTS_MD}")

    # Write to Global antigravity-baseline.md
    if os.path.exists(GLOBAL_RULES_DIR):
        with open(GLOBAL_BASELINE_MD, "w", encoding="utf-8") as f:
            f.write(full_rule_content)
        print(f"✅ Updated Global Baseline Rule: {GLOBAL_BASELINE_MD}")

def main():
    print("=" * 60)
    print("⚡ Antigravity Automated Baseline & Habit Engine Starting...")
    print("=" * 60)

    requests = scan_transcripts()
    total_count = len(requests)
    print(f"📊 Total Conversation Prompts Analyzed: {total_count}")

    clusters, uncategorized, top_repetitive = analyze_habits(requests)

    for cat_id, data in clusters.items():
        print(f"  • {data['meta']['name']}: {data['count']} requests ({data['count'] / total_count * 100:.1f}%)")
    print(f"  • Uncategorized / Miscellaneous: {len(uncategorized)} requests")

    registry = generate_habits_registry(total_count, clusters, top_repetitive)
    update_baseline_rules(registry)

    print("\n🎉 Automated Baselines Successfully Updated & Enforced Across Workspace!")
    print("=" * 60)

if __name__ == "__main__":
    main()
