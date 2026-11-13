# ⚡ Antigravity Automated Baseline & Habit Engine

A self-learning, automated baseline tracking and enforcement system engineered for `G:\My Drive\Antigravity\Projects`.
It continuously scans conversation transcripts, quantifies recurring user habits and task questions, synthesizes machine-enforceable rules, and synchronizes baseline assets across all 62 projects in the workspace.

---

## 🏗️ Architecture & Continuous Learning Loop

```
  ┌─────────────────────────────────────────────────────────┐
  │ 1. Antigravity Brain Transcripts (~/.gemini/.../brain)  │
  │    (1,042+ User Requests & Task Patterns Analyzed)      │
  └───────────────────────────┬─────────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 2. baseline_tracker.py                                  │
  │    - Extracts user queries, commands, and requirements  │
  │    - Clusters into 8 weighted habit domains             │
  │    - Calculates frequency % and top repeated prompts    │
  │    - Emits habits_registry.json                         │
  └───────────────────────────┬─────────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 3. Automated Rule Synthesis & Injection                 │
  │    - Updates Projects/AGENTS.md (Workspace Root)        │
  │    - Updates ~/.gemini/config/rules/antigravity-baseline│
  │    - Rules are ALWAYS-ON; no prompting required         │
  └───────────────────────────┬─────────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 4. Asset Synchronization                                │
  │    - Sync-StillCosmicAndLacquer.ps1                     │
  │    - Distributes High-Gloss Lacquer, Cosmic Engine,     │
  │      and MCP HUD across 16 target project hubs          │
  └─────────────────────────────────────────────────────────┘
```

---

## 📊 Discovered User Habits & Active Baselines

Based on deep transcript analysis across **1,042 archived conversation prompts**:

| Baseline / Habit Domain | Frequency | Share | Key Automated Directive |
| :--- | :--- | :--- | :--- |
| **YouTube Gaming & Shorts Pipeline** | 319 requests | 30.6% | Automated Sentinel scans, Eustace evil laugh layering, safe-zone scaling, sub-60 char CTR titles, Yu Yu Hakusho quote pairing, 0-5s retention hook. |
| **Game Studio Engine & ROM Modding** | 98 requests | 9.4% | Direct MCP integration with Unreal Engine 5.8, Unity 6, Godot 4, and binary ROM header/IPS modding. |
| **Red Hat (RHCSA/OpenShift) & Linux** | 45 requests | 4.3% | Strict Bash `set -euo pipefail` and modern PowerShell PascalCase cmdlets with `[CmdletBinding()]` and object streaming. |
| **Enterprise Full-Screen & GitHub Primer UI** | 35 requests | 3.4% | Mandatory $100\text{vw} \times 100\text{vh}$ full-screen layout, collapsible 280px left sidebar, 52px global command bar (`Ctrl+K`), dockable 380px inspector, and strict 1px GitHub Primer borders (`#30363d`). Replaces inferior centered/cramped card setups. |
| **Anti-Slop Craftsmanship & Verification** | 18 requests | 1.7% | Zero emoji asset flips (clean dual-tone SVGs only), pure premium loops, WCAG AAA contrast, **hand-drawn & hand-colored object aesthetics** (NPR shaders/watercolor textures) to eliminate AI render slop, and **mandatory pre-completion test verification**. |
| **Interactive Simulators & Drill Engines** | 15 requests | 1.4% | Stateful packet journey tracing, real-time terminal log streaming, gamified fuzzy-eval practice engines, radial progress rings, and Web Speech API audio narration. Preserves distinct features (Xbox dashboard blades, Planetarium 3D engine). |
| **Cybersecurity & Data Privacy Shield** | 3 requests | 0.3% | Sentinel host hygiene auditing, unquoted paths, Defender definitions, and data broker opt-out deletion requests. |
| **Children's Learning & Edutainment** | 3 requests | 0.3% | Hub-and-spoke schoolhouse navigation, Frankie companion mascot (Web Speech), 100 collectible milk caps, adaptive difficulty scaffolding, procedural audio chimes, hand-drawn vector visuals, and COPPA-compliant offline analytics (JumpStart modernization). |
| **How I Learn: CramExam High-Yield Synthesis & 3D Memory Palace** | Active | Baseline | Modeled on Cram Exam (@cramexam): high-yield visual cheat sheets, domain-weighted objective mastery tracking, instant-feedback active recall, and 3D exhibition corridor biomechanical traversal across all training subjects. See [`HOW_I_LEARN_BASELINE.md`](HOW_I_LEARN_BASELINE.md) and [`learning-hall/`](learning-hall/). |
| **Visual-to-Code UI Reconstruction (Tailwind/React)** | Active | Baseline | `"Write a clean Tailwind/React component that looks exactly like this."` Reconstructs clean, modular React 18 + Tailwind CSS components from visual appearance alone, completely bypassing underlying HTML/CSS DOM trees and binding live MCP telemetry. |
| **Multi-Agent Design & Development Workflows (Mobile App & Godot 4 + Blender Game Baseline)** | Active | Baseline | Orchestrates 3-agent **Mobile App Design** (`Product Agent` -> `UI/UX Agent` [UX Review Gate] -> `Tech Architect Agent` [Cross-Platform Feasibility Gate]) and 3-agent **Video Game Design** (`Game Director Agent` -> `Content & Art Agent` [Concept Art & Mechanics Gate + headless Blender `bpy` `.glb` 3D character/rigging/animation pipeline] -> `Systems & Gameplay Agent` [Godot 4 Engine & Physics Rules + Resource/Platform Feasibility Gate]). Enforces **Godot 4 + Blender (`bpy`)** whenever game development scope matches. See [`MULTI_AGENT_WORKFLOWS_BASELINE.md`](MULTI_AGENT_WORKFLOWS_BASELINE.md). |

---

## 🚀 Quick Execution Commands

### 1. Run Baseline Automation Manually
```powershell
& "G:\My Drive\Antigravity\Projects\baselines\Invoke-BaselineAutomation.ps1"
```

### 2. Launch Interactive Baseline Observatory Dashboard
Open `index.html` in your browser:
```powershell
Start-Process "G:\My Drive\Antigravity\Projects\baselines\index.html"
```

### 3. Automated Background Cron
Configured in Antigravity to run daily at midnight (`0 0 * * *`), automatically updating baselines as you work.
