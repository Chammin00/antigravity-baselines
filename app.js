/**
 * ⚡ Antigravity Baseline Observatory Engine (app.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  let registryData = null;

  try {
    const res = await fetch('habits_registry.json');
    if (res.ok) {
      registryData = await res.json();
    }
  } catch (err) {
    console.warn('Direct fetch failed, falling back to embedded state:', err);
  }

  // If fetch failed or local file:// restrictions apply, render default state
  if (!registryData) {
    registryData = {
      version: "1.0.0",
      total_requests_analyzed: 1041,
      automated_baselines_count: 8,
      active_baselines: [
        {
          id: "how_i_learn_centralized_hall",
          title: "How I Learn: CramExam High-Yield Synthesis & 3D Memory Palace",
          description: "Standardizes exam preparation via CramExam (@cramexam) methodology: high-yield visual cheat sheets, domain-weighted mastery tracking, instant-feedback active recall, and 3D exhibition corridor biomechanical traversal.",
          frequency_count: 28,
          percentage: 3.39,
          status: "Active & Enforced",
          enforced_rule: "Enforce HOW_I_LEARN_BASELINE.md across all study simulators, exam drills, and terminal practice tools with dual-layer telemetry and 3D traversal.",
          sample_triggers: [
            "baseline for how i learn/ this page a great example on how i want to learn https://www.youtube.com/@cramexam",
            "create a 3d studio similar to my gaming highlight studio but it will compose of all the training material i have on each picture where i will traverse to each subject. Above the picture will share my stats regarding that subject and deeper stats per subject. This will be a centralized learning hall.",
            "lets improve this app by adding study tools. in my project directory look for comptia... build ultimate tutor"
          ]
        },
        {
          id: "youtube_gaming_automation",
          title: "Autonomous YouTube Gaming & Shorts Pipeline",
          description: "Continuous scanning of Xbox Game DVR captures, power weapon audio layering, mobile safe-zone scaling, and quota uploads.",
          frequency_count: 319,
          percentage: 30.64,
          status: "Active & Enforced",
          enforced_rule: "Execute autonomous YouTube gaming upload cycles with sub-60 character CTR titles, Yu Yu Hakusho quote pairing, and 0-5s retention validation.",
          sample_triggers: [
            "Run the autonomous YouTube gaming uploads cycle...",
            "upload to youtube under max daily upload quota...",
            "layer Eustace's evil laugh on power weapon pickups..."
          ]
        },
        {
          id: "game_studio_modding",
          title: "Game Studio Engine & ROM Modding",
          description: "Unreal Engine 5.8, Unity 6, Godot 4 automation, live PIE control, and binary ROM header/IPS modding.",
          frequency_count: 98,
          percentage: 9.41,
          status: "Active & Enforced",
          enforced_rule: "Integrate Game Studio and Game Capture MCP tools directly for real-time engine telemetry and gameplay recording.",
          sample_triggers: [
            "Find switch emulators and games search github...",
            "launches but unable to grab keys. USe github and google...",
            "game review to be uploaded on Youtube..."
          ]
        },
        {
          id: "linux_rhel_certifications",
          title: "Red Hat (RHCSA/OpenShift) & Automation Scripting",
          description: "Strict RHEL 8/9 administration, OpenShift container orchestration (DO180/DO280/DO380), and CompTIA exam drills.",
          frequency_count: 45,
          percentage: 4.32,
          status: "Active & Enforced",
          enforced_rule: "Apply strict Bash `set -euo pipefail` and modern PowerShell PascalCase cmdlets with [CmdletBinding()] and object streaming.",
          sample_triggers: [
            "RHCSA mock exam drills and container configuration...",
            "OpenShift DO180, DO280 and DO380 automation...",
            "Script practice and pair programming..."
          ]
        },
        {
          id: "high_gloss_cosmic_ui",
          title: "High-Gloss Lacquer & Motionless Cosmic UI Baseline",
          description: "Physical material optics with Navy/Camel gold tokens, stationary 4K backdrop, and MCP Telemetry HUD on all web apps.",
          frequency_count: 28,
          percentage: 2.69,
          status: "Active & Enforced",
          enforced_rule: "Always include high-gloss-lacquer.css/.js, cosmic-background.js, and mcp-baseline.js. Never use animated canvas screensavers.",
          sample_triggers: [
            "Create a custom GUI of my favorite apps...",
            "use our baseline to create this webpage also incorporate mcp...",
            "give us a space background with planets as the projects..."
          ]
        },
        {
          id: "local_ai_ollama_sync",
          title: "Local LLM Orchestration & Skills Sync",
          description: "Compiling Antigravity skills into local Ollama Modelfiles and structured knowledge bases for sub-millisecond local inference.",
          frequency_count: 18,
          percentage: 1.73,
          status: "Active & Enforced",
          enforced_rule: "Automate local skills synchronization to Ollama Modelfiles with zero cloud-leakage of private workspace code.",
          sample_triggers: [
            "Scan for any newly installed or updated Antigravity skills...",
            "update the skills knowledge base and compile Modelfiles...",
            "Ollama studio local AI workbench..."
          ]
        },
        {
          id: "e_commerce_deal_scrapers",
          title: "Global Deals & Hardware Scrapers",
          description: "Scanning daily price drops for PC hardware (SSDs, handheld accessories) comparing mainstream brands with Chinese counterparts, plus Steam & Xbox discounts.",
          frequency_count: 14,
          percentage: 1.35,
          status: "Active & Enforced",
          enforced_rule: "Provide structured side-by-side comparison tables including price, real-world value, endurance metrics, and clear buying recommendations.",
          sample_triggers: [
            "Scan the web for top daily deals on consumer electronics...",
            "compare reputable Chinese counterparts (Netac, KingSpec)...",
            "Search the web for the latest discounts across Steam and Xbox..."
          ]
        },
        {
          id: "anti_slop_craftsmanship",
          title: "Anti-Slop Craftsmanship & Verification",
          description: "Zero emoji asset flips, pure premium gameplay, WCAG AAA contrast, tactile kinesthetics, and mandatory pre-completion test verification.",
          frequency_count: 10,
          percentage: 0.96,
          status: "Active & Enforced",
          enforced_rule: "Zero tolerance for OS emojis as game assets, zero purple prose, zero ad wrappers. Always run and verify functional code before declaring task complete.",
          sample_triggers: [
            "no board displayed remember to fully test before completing...",
            "Lets test and implement this in production...",
            "Zero Slop Compliance audit and automated cleansing..."
          ]
        },
        {
          id: "cybersecurity_audits",
          title: "Cybersecurity & Data Privacy Shield",
          description: "Continuous host hygiene auditing, unquoted path detection, Defender definitions, and data broker opt-out automation.",
          frequency_count: 3,
          percentage: 0.29,
          status: "Active & Enforced",
          enforced_rule: "Execute non-intrusive security posture diagnostics and export structured JSON audit metrics.",
          sample_triggers: [
            "Sentinel PC Security Guard & Auditor web dashboard...",
            "Data broker opt-out deletion request automation...",
            "Host hardening indicators and privilege escalation audit..."
          ]
        },
        {
          id: "visual_to_code_reconstruction",
          title: "Visual-to-Code UI Reconstruction (Tailwind/React Clean-Room Clone)",
          description: "Reconstructs clean, semantic Tailwind CSS and React components purely from visual appearance ('Write a clean Tailwind/React component that looks exactly like this'), completely bypassing bloated or obfuscated underlying HTML/CSS DOM structures.",
          frequency_count: 5,
          percentage: 0.44,
          status: "Active & Enforced",
          enforced_rule: "When cloning, reverse-engineering, or recreating any UI or desktop/web application, enforce the Visual-to-Code Clean-Room Directive ('Write a clean Tailwind/React component that looks exactly like this'): reconstruct modular React components and utility-first Tailwind CSS purely from visual hierarchy, spatial grid, and surface optics, bypassing the target's underlying HTML/CSS DOM completely while binding live MCP telemetry.",
          sample_triggers: [
            "Write a clean Tailwind/React component that looks exactly like this...",
            "The AI reconstructs the code from visual appearance alone, bypassing your underlying HTML/CSS completely...",
            "lets test by copying the xbox app and use mcp..."
          ]
        },
        {
          id: "multi_agent_godot_blender_workflow",
          title: "Multi-Agent Design & Development Workflows (Mobile App & Godot 4 + Blender Game Baseline)",
          description: "Orchestrates 3-agent Mobile App Design (Product, UI/UX, Tech Architect) and 3-agent Video Game Design (Game Director, Content & Art, Systems & Gameplay) workflows with UX/Feasibility quality gates, enforcing Godot 4 + headless Blender (bpy -> .glb) as the baseline game stack whenever scope matches.",
          frequency_count: 5,
          percentage: 0.61,
          status: "Active & Enforced",
          enforced_rule: "Enforce the Multi-Agent Design & Development Workflows: (1) Mobile App Design (Product Agent -> UI/UX Agent [UX Review Gate] -> Tech Architect Agent [Cross-Platform Feasibility Gate] -> App Spec & Prototype Delivery), and (2) Video Game Design (Game Director Agent -> Content & Art Agent [Concept Art & Mechanics Gate + Blender bpy 3D .glb rigging/animation pipeline] -> Systems & Gameplay Agent [Godot 4 Engine & Physics Rules + Resource/Platform Feasibility Gate] -> GDD, Asset List & Playable Godot 4 Build). Default to Godot 4 + Blender whenever game development matches scope.",
          sample_triggers: [
            "add additional workflow to baseline lets use godot and blender when the game development matches the scope as a baseline",
            "Can we make a 3d motion game of this? And keep this one too (Godot 4.7 + Blender 5.1 .glb pipeline)",
            "MULTI-AGENT WORKFLOWS FOR DESIGN & DEVELOPMENT (Mobile App & Video Game Design)"
          ]
        }
      ],
      top_recurring_habits: [
        { count: 248, first_line: "Run the autonomous YouTube gaming uploads cycle (sentinel_daemon)" },
        { count: 46, first_line: "Continuous workflow validation ('proceed' confirmation)" },
        { count: 11, first_line: "Search Steam & Xbox Store discounts and all-time low price drops" },
        { count: 11, first_line: "Scan consumer electronics & SSD deals (Samsung vs Netac/KingSpec)" },
        { count: 10, first_line: "Inspect workspace projects, health state, and master action matrix" },
        { count: 9, first_line: "Scan and synchronize newly installed skills to local Ollama AI" }
      ]
    };
  }

  // Populate KPIs
  const totalPromptsEl = document.getElementById('stat-total-prompts');
  if (totalPromptsEl) totalPromptsEl.textContent = (registryData.total_requests_analyzed || 1041).toLocaleString();
  const baselinesCountEl = document.getElementById('stat-baselines-count');
  if (baselinesCountEl) baselinesCountEl.textContent = registryData.active_baselines.length;
  
  const topHabit = registryData.active_baselines[0];
  if (topHabit) {
    const topHabitEl = document.getElementById('stat-top-habit');
    const topCountEl = document.getElementById('stat-top-count');
    if (topHabitEl) topHabitEl.textContent = topHabit.title.split('&')[0];
    if (topCountEl) topCountEl.textContent = `${topHabit.frequency_count} requests (${topHabit.percentage}%)`;
  }

  const grid = document.getElementById('baselines-grid');
  const searchInput = document.getElementById('global-search-input') || document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';

  function renderBaselines() {
    if (!grid) return;
    grid.innerHTML = '';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = registryData.active_baselines.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(query) ||
                            b.description.toLowerCase().includes(query) ||
                            b.enforced_rule.toLowerCase().includes(query);
      const matchesCategory = (currentFilter === 'all') || (b.id.includes(currentFilter));
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 glass-panel rounded-2xl p-8">
          <p class="text-base font-semibold text-slate-200">No baselines matched your filter</p>
          <p class="text-xs text-slate-400 mt-1">Try refining your search terms or selecting "All Baselines"</p>
        </div>
      `;
      return;
    }

    filtered.forEach(b => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-5 rounded-xl border border-[rgba(197,160,89,0.2)] metric-card hover:border-[#C5A059] flex flex-col justify-between group cursor-pointer transition-all';
      
      card.addEventListener('click', () => {
        if (window.AntigravityEnterprise) {
          window.AntigravityEnterprise.openInspector({
            title: b.title,
            category: `${b.status} • ${b.frequency_count} Requests (${b.percentage}%)`,
            role: b.enforced_rule,
            specs: [
              ["Frequency Count", `${b.frequency_count} requests`],
              ["Workspace Share", `${b.percentage}% of prompts`],
              ["Status", b.status],
              ["Scope", "Universal Workspace Rule (AGENTS.md)"]
            ]
          });
          const triggersEl = document.getElementById('insp-triggers');
          if (triggersEl && b.sample_triggers) {
            triggersEl.innerHTML = b.sample_triggers.map(t => `<div class="mb-1 text-slate-300 font-mono text-xs">▶ ${t}</div>`).join('');
          }
        }
      });
      
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-[#0E1D3A] text-[#DFBA73] border border-[#C5A059]/30">
              ⚡ ${b.status}
            </span>
            <span class="text-xs font-bold text-[#C5A059] font-mono">
              ${b.frequency_count} Prompts (${b.percentage}%)
            </span>
          </div>

          <h3 class="text-base font-bold text-white group-hover:text-[#DFBA73] transition-colors mb-1.5 flex items-center justify-between">
            <span>${b.title}</span>
            <span class="text-xs text-slate-500 group-hover:text-[#DFBA73]">⛶</span>
          </h3>

          <p class="text-xs text-[#E2E8F0] leading-relaxed mb-3">
            ${b.description}
          </p>

          <div class="w-full bg-[#050B18] rounded-full h-1.5 mb-3 overflow-hidden border border-white/5">
            <div class="meter-fill h-full rounded-full" style="width: ${Math.max(b.percentage * 2.5, 8)}%"></div>
          </div>

          <div class="mb-3">
            <div class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Enforced Rule:</div>
            <div class="rule-box p-2.5 rounded-lg text-xs text-slate-100 border-l-2 border-[#C5A059] leading-relaxed">
              ${b.enforced_rule}
            </div>
          </div>
        </div>

        <div>
          <div class="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Sample Triggers Learned:</div>
          <ul class="space-y-1 text-xs text-slate-300">
            ${b.sample_triggers.slice(0, 2).map(t => `
              <li class="flex items-start gap-1.5">
                <span class="text-[#C5A059] text-[10px] mt-0.5">▶</span>
                <span class="italic text-slate-300 font-mono text-[11px] truncate">${t}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Populate Habits List
  const habitsList = document.getElementById('habits-list');
  if (habitsList && registryData.top_recurring_habits) {
    habitsList.innerHTML = registryData.top_recurring_habits.map((h, i) => `
      <div class="p-3.5 rounded-xl bg-[#0B162C]/80 border border-white/10 hover:border-[#C5A059]/40 flex items-center justify-between gap-4 transition-all">
        <div class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-[#0E1D3A] text-[#DFBA73] text-xs font-mono flex items-center justify-center border border-[#C5A059]/30">
            ${i + 1}
          </span>
          <span class="text-xs text-slate-200 font-medium">
            ${h.first_line}
          </span>
        </div>
        <span class="text-xs font-mono font-bold text-[#C5A059] px-2.5 py-1 rounded-md bg-[#050B18] border border-[#C5A059]/20 whitespace-nowrap">
          ${h.count}x
        </span>
      </div>
    `).join('');
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', renderBaselines);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-[#C5A059]', 'text-[#050B18]', 'font-bold'));
      filterBtns.forEach(b => b.classList.add('bg-white/5', 'text-slate-300'));
      btn.classList.add('bg-[#C5A059]', 'text-[#050B18]', 'font-bold');
      btn.classList.remove('bg-white/5', 'text-slate-300');
      currentFilter = btn.dataset.filter;
      renderBaselines();
    });
  });

  // MCP HUD Toggle Button
  const mcpHudBtn = document.getElementById('open-mcp-hud-btn');
  if (mcpHudBtn && window.AntigravityMCP) {
    mcpHudBtn.addEventListener('click', () => {
      window.AntigravityMCP.toggleHUD();
    });
  }

  // Initial render
  renderBaselines();
});
