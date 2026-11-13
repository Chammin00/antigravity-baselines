# 🏛️ Master 3D Studio Design System (10/10 Visual Appeal Baseline)

> **Document Version**: `1.0.0`  
> **Target Scope**: All 3D Showrooms, Virtual Studios, and WebGL Applications across the Antigravity Ecosystem  
> **Research Provenance**: Synthesized from top GitHub 3D Showrooms (*threejs-virtual-gallery*, *Wretched-Lab-Nfs-Unbound*, *3d-virtual-store*, *linkwalk*), Google Cloud/Primer Material Guidelines, and the High-Gloss Lacquer Material Specification.

---

## 1. Executive Summary & Design Weakness Elimination

Creating a **10 out of 10** visual appeal in 3D WebGL environments requires overcoming common design weaknesses:
- ❌ **The Flat & Lifeless Weakness**: Ambient light set to `1.0` with no directional contrast or shadows, making everything look like cheap plastic.
- ❌ **The Empty Void Weakness**: Objects floating in a pitch-black box with no architectural framing, floor specular, or spatial context.
- ❌ **The Emoji / Asset-Flip Slop Weakness**: Low-resolution textures, raw unicode emojis on billboards, or mismatched neon colors.
- ❌ **The Static Diorama Weakness**: Zero particle motes, motionless scenes, and rigid camera angles with no cinematic movement.

### The 10/10 Visual Formula
To achieve a **10/10 visual rating**, every 3D Studio must balance **Six Foundational Pillars**:

```
                       ┌─────────────────────────────────────┐
                       │  10/10 VISUAL APPEAL MASTER ENGINE  │
                       └──────────────────┬──────────────────┘
                                          │
    ┌───────────────┬───────────────┬─────┴─────────┬───────────────┬───────────────┐
    ▼               ▼               ▼               ▼               ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  PBR Studio  ││ Specular PBR ││ Architectural││ Dynamic 3D   ││ Cinematic    ││ Anti-Slop    │
│ Lighting Rig ││ Materiality  ││ Megastructure││ Centerpieces ││ Director Cam ││ Glassmorphic │
│ (3-Point PBR)││(Gloss Floor) ││ (Curved LED) ││ (Holo Pods)  ││ (WASD + LERP)││ HUD & MCP HUD│
└──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

---

## 2. Pillar I: The PBR Studio Lighting Rig

Never use a single ambient light. A 10/10 studio utilizes a **Photographic 4-Layer Light Hierarchy**:

| Light Source | Type | Color & Temp | Intensity | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Key Studio Light** | `DirectionalLight` | Daylight White (`#F8FAFC`, 5600K) | `1.4` - `1.8` | Primary sculpting light from top-left ($x: 20, y: 35, z: 20$) with soft PCF shadow maps ($2048 \times 2048$). |
| **Warm Architectural Fill** | `HemisphereLight` | Primer Gold (`#DFBA73`) over Deep Obsidian (`#090A0F`) | `0.6` | Simulates global bounce light; prevents deep shadows from crushing to pure black. |
| **Podium Rim / Accent Spots** | `PointLight` | Cyber Cyan (`#00F3FF`) / Nexus Emerald (`#10B981`) / Crimson (`#FF3366`) | `2.0` - `3.5` | Placed at the base of each interactive pedestal with distance falloff ($12\text{m}$) for radiant uplighting. |
| **Overhead Lightbox Fixtures** | Emissive Meshes | Pure White / Pale Amber (`emissiveIntensity: 0.9`) | N/A | Visible architectural rectangular softboxes hung along the ceiling rafters to provide specular reflection targets on the glossy floor. |

---

## 3. Pillar II: High-Gloss Lacquer Surface Materiality

Surfaces in a studio define its luxury perception. Floors and walls are not simple diffuse planes:

### 1. Obsidian Lacquer Showroom Floor
```javascript
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x090a12,
  roughness: 0.12,          // Crisp specular reflection highlights
  metalness: 0.88,          // Deep metallic sheen
  envMapIntensity: 1.5,
});
```
- **Grid Subdivisions**: Delicate 1-meter beveled floor seams rendered via procedural normal maps or subtle geometric grid overlays (`color: 0x1f293d`, `opacity: 0.45`).
- **Wall & Pillar Materiality**: Dark brushed titanium panels (`roughness: 0.42`, `metalness: 0.75`) lined with vertical recessed LED light channels.

---

## 4. Pillar III: Spatial Layout & Megastructure Architecture

The studio layout is built on an expansive $100\text{m} \times 60\text{m}$ rectangular showroom floor:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             BACK CURVED PANORAMIC LED WALL                       │
│                         (Live Project Telemetry, Engine Stats)                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│     [ PODIUM 2 ]               [ PODIUM 1: CENTERSTAGE ]           [ PODIUM 3 ]  │
│    UNREAL ENGINE 5              SHADOW BLADE: CRIMSON               UNITY 6      │
│   (Nanite Monolith)              (Katana & Torii Gate)          (Polyhedral Gem) │
│                                                                                  │
│                                                                                  │
│     [ PODIUM 4 ]                      [ PODIUM 5 ]                 [ PODIUM 6 ]  │
│        GODOT 4                      RETRO ROM VAULT               AUDIO & SFX    │
│    (Robotic Gear)                 (N64 Golden Dais)              (Synth Ring)    │
│                                                                                  │
│                                                                                  │
│─────────────────────────── [ MEZZANINE RUNWAY & BALCONY ] ────────────────────────│
│                       OBSERVATION DECK & FLYING DRONE ORIGIN                     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

1. **Centerstage Dais (Podium 1)**: Elevated by $0.4\text{m}$ with rotating concentric brass trim rings and a volumetric vertical light shaft.
2. **Flanking Engine Bays (Podia 2 & 3)**: Dedicated stations for Unreal Engine 5 and Unity 6 with live editor status indicators.
3. **Foundation & Tools Bays (Podia 4, 5 & 6)**: Godot 4.7, the 19-Console ROM Modding Vault, and the Procedural Audio Synthesizer.
4. **Curved Panoramic Megascreen**: A 45-degree curved cylindrical display backdrop rendering real-time dynamic graphics generated via an in-memory HTML5 2D canvas texture.

---

## 5. Pillar IV: Cinematic Camera Choreography & Audio Synthesis

A 10/10 studio must never feel rigid:

### 1. Dual-Mode Navigation & RPG Movement Engine
- **Full RPG Style Movement**:
  - **Inertia & Steering**: Acceleration (`accel: 26.0 - 28.0`), friction drag (`friction: 0.82`), and turn banking lean (`bankAngle: -turn * 0.14`).
  - **Dual-Speed Kinematics**: Walking speed and Sprint/Run speed ($1.8\times - 2.0\times$ multiplier) with dynamic FOV kick ($50^\circ \to 58^\circ$).
  - **Vertical Jump & Gravity Arc**: `jumpForce: 5.4 - 7.2`, `gravity: 16.0 - 18.0`, squash & stretch ($1.25$ stretch on liftoff, $0.82$ squash on landing), procedural spring jump audio sweep, landing impact thud, and expanding floor dust puff particles.
  - **Articulated 3D Avatars**: Visible in 3rd-person view with articulated limbs, idle breathing motion, walk/run swing cycles, midair tuck poses, and overhead level/nameplate billboards.
  - **Tactile On-Screen Action Cluster**:
    - `[⚡ RUN (Shift)]`: High-gloss toggle/hold button with active neon indicator.
    - `[🚀 JUMP (Space)]`: Spring-action tactile button with vertical leap trigger.
    - `[🏃 3rd Person / 🎥 1st Person (V)]`: Instant seamless view mode switcher.
- **Cinematic Director Mode**: Quick-action number keys (`[1]`, `[2]`, `[3]`, `[4]`, `[5]`, `[6]`, `[7]`) that execute smooth camera interpolation (LERP) directly to dramatic framing angles for each studio pod. Seamlessly yields back to manual RPG movement whenever the user moves.

### 2. Physical & Spatial Sound Design
- Real-time procedural Web Audio API synthesizers:
  - **Ambient Studio Reactor Hum**: Soft $55\text{Hz}$ low-pass filtered drone creating spatial immersion.
  - **Plexiglass UI Clicks & Chirps**: High-resonance sine sweeps ($880\text{Hz} \to 1760\text{Hz}$) on hover and select.
  - **Pedestal Proximity Pulse**: Subtle harmonic resonance when walking within $4\text{m}$ of any showroom display.

---

## 6. Pillar V: Model Context Protocol (MCP) Live Binding

The 3D Studio is not just a static showcase—it is an **active command deck** connected directly to the Antigravity `game-studio` MCP Server:

- **Launch Engine Actions**:
  - `gamestudio_launch_hub`: Launch the master terminal hub.
  - `gamestudio_launch_shadow_blade`: Launch the martial arts WebGL/Unity combat engine.
  - `unity_launch_editor`: Open Unity 6 (`6000.4.7f1`).
  - `unreal_get_editor_status` / `unreal_execute_python`: Remote control Unreal Engine 5.
  - `godot_get_status` / `godot_launch_editor`: Launch Godot 4.7.2.
  - `rom_inspect_header`: Inspect ROM headers and checksums.
- **MCP Telemetry HUD (`Ctrl+M`)**: Embedded slide-out dashboard reporting active server states.
- **Visual Inspector (`Ctrl+E`)**: Click-to-inspect UI layer conforming to `MCP_WEB_APPS_BASELINE.md`.

---

## 7. Active 3D Studios Catalog

| Studio | Directory | Focus & Attractions | Physics & Features |
| :--- | :--- | :--- | :--- |
| **3D Wobbly Playroom** | [`wobbly-playroom`](file:///g:/My%20Drive/Antigravity/Projects/baselines/wobbly-playroom/index.html) | Wobbly Life Physics Sandbox | Ragdoll bean avatar, googly eyes, 18.5m trampoline, 48-ball pit, spiral slide, bowling alley, drivable bumper kart, toy grab/throw, pizza courier mini-job. |
| **3D Grade School Hall** | [`grade-school-hall`](file:///g:/My%20Drive/Antigravity/Projects/baselines/grade-school-hall/index.html) | 1st Grade Flagship Curriculum | 36-week syllabus, GCompris scaffolding, Antura hint ladder, typing & arcade cabinets, Frankie Milk Cap vault. |
| **3D Centralized Learning Hall** | [`learning-hall`](file:///g:/My%20Drive/Antigravity/Projects/baselines/learning-hall/index.html) | Enterprise IT & Certifications | 8 core certification exhibits, CompTIA PBQs, RHEL terminal simulator, flashcard decks, CramExam standards. |
| **3D Game Studio Showroom** | `game studio` | Engine Bays & Game Hub | Unity 6, UE5, Godot 4.7, ROM vault, Shadow Blade martial arts showcase, MCP action dispatchers. |

