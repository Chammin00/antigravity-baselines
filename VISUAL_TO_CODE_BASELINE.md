# ⚡ Visual-to-Code UI Reconstruction Baseline (Tailwind / React Clean-Room Clone)

> **Core Directive**: `"Write a clean Tailwind/React component that looks exactly like this."`
> **Architectural Principle**: Reconstruct the code from **visual appearance alone**, bypassing the target's underlying HTML/CSS DOM tree completely.

---

## 1. Why Clean-Room Visual Reconstruction?

Modern web and desktop applications (Electron, WinUI/React Native Windows, obfuscated Webpack/Next.js bundles) often ship deeply nested `<div>` soup, hashed CSS-in-JS class names (`.css-1x9a8b2`), inline virtualized offsets, and legacy layout hacks. Scraping or copying their raw DOM produces brittle, unmaintainable code.

By feeding a visual capture (via **Puppeteer MCP** screenshot or **Game Capture MCP** frame grab) directly into the Visual-to-Code Reconstruction pipeline with the directive:

```text
"Write a clean Tailwind/React component that looks exactly like this."
```

The AI acts as a **Clean-Room Principal Frontend Architect**:
1. **Zero DOM Contamination**: Completely ignores the target's underlying HTML tags, class names, and stylesheet debt.
2. **Visual Token Extraction**: Measures spatial rhythm, grid columns, flexbox alignment, surface luminance layers (`#090d16`, `#0d1117`, `#161b22`), border hairlines (`1px solid #30363d`), and accent wavelengths (e.g., Xbox Nexus Emerald `#107C10` / `#22C55E` + Primer Gold `#DFBA73`).
3. **Semantic React 18 Decomposition**: Breaks the visual canvas into reusable, strongly-typed functional components (`<TopCommandBar />`, `<LeftLibraryRail />`, `<HeroSpotlightBanner />`, `<GamePassCarousel />`, `<McpTelemetryInspector />`) with clean `useState`, `useMemo`, and `useEffect` hooks.
4. **Anti-Slop Craftsmanship**: Replaces low-res raster icons or emojis with crisp $2\text{px}$-stroke inline SVGs and hand-crafted vector/watercolor artwork, wrapped in the $100\text{vw} \times 100\text{vh}$ Enterprise Fullscreen Layout.

---

## 2. Automated 4-Stage MCP Reconstruction Pipeline

```
┌────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Visual Capture & Telemetry Acquisition (MCP)                      │
│ • Puppeteer MCP (`puppeteer_navigate`, `puppeteer_screenshot`)             │
│ • Game Capture MCP (`xbox_get_status`, `list_recent_captures`, `gpu`)      │
│ • Game Studio MCP (`gamestudio_list_projects`, `unity_get_status`)         │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: Visual Optical Decomposition (Bypassing Underlying HTML/CSS)      │
│ • Extract 100vw x 100vh spatial zones (Left Rail, Header, Canvas, Dock)    │
│ • Sample color tokens, specular top highlights, and typography hierarchy   │
│ • Identify interactive states (hover elevation, active pills, badges)      │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: Clean-Room Tailwind CSS + React 18 Synthesis                      │
│ • Prompt: "Write a clean Tailwind/React component that looks like this"    │
│ • Zero legacy DOM carryover; 100% utility-first Tailwind + React hooks     │
│ • Handcrafted dual-tone SVGs + Hand-Drawn/Watercolor cover illustrations   │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: Live MCP Data Binding & Pre-Completion Verification               │
│ • Bind real GPU, Xbox DVR clips, and Game Studio projects into state       │
│ • Verify zero console/runtime errors in headless browser before completion │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Enforced Production Standards

1. **Full-Screen Enterprise Shell ($100\text{vw} \times 100\text{vh}$)**:
   - Collapsible `280px` -> `64px` navigation sidebar (`Ctrl+B`).
   - Sticky `52px` global command header with live search (`Ctrl+K`) and MCP HUD trigger.
   - Multi-dock inspector (`Left` / `Center Modal` / `Right Dock`) for deep-dive component & telemetry inspection.
2. **Clean-Room Code Inspector Toggle**:
   - Every Visual-to-Code reconstructed application must include an interactive **"Clean-Room JSX / Tailwind Code View"** allowing instant inspection and one-click copy of the reconstructed React components alongside the live rendered UI.
3. **Live MCP Bridge**:
   - Connect `mcp-baseline.js` and local `mcp-telemetry.json` so the reconstructed interface displays real-time system metrics (e.g., NVIDIA RTX 4080 telemetry, Xbox Game Bar captures, Unity/Unreal project launchers).
