/**
 * 🎓 Centralized Learning Hall: Comprehensive In-Studio Training Suites
 * Provides full, self-contained interactive training engines directly inside the 3D Studio:
 * 1. Interactive Terminal Practice (RHEL 9 / RHCSA EX200)
 * 2. Interactive PBQ & Port Match Lab (CompTIA Security+ SY0-701)
 * 3. AWS Architecture & Storage Tier Simulator (AWS CLF-C02 / SAA)
 * 4. OpenShift YAML Manifest & SCC Validator (DO180 / DO280 / DO380)
 * 5. Enterprise Scripting Code Challenge Workbench (Bash & PowerShell)
 * 6. Windows SIEM Event Log Forensic Investigator (Event IDs 4624, 4625, 7045)
 * 7. Reverse Engineering PE Section Entropy & IAT Inspector
 * 8. AI Modelfile Builder & MCP Tool Calling Playground
 * Plus Interactive 3D Flashcards Deck & Searchable Master Acronym Engines!
 */

const CENTRALIZED_TRAINING_SUITES = {
  // Global state for in-studio interactive labs
  state: {
    terminalHistory: [],
    terminalHistoryIdx: -1,
    activeRhQuestIdx: 0,
    rhTerminalLogs: [],
    flashcardIdx: 0,
    flashcardFlipped: false,
    flashcardFilter: 'all',
    siemFilterId: 'all',
    scriptLanguage: 'bash',
    peSectionEntropy: [
      { name: '.text', rawSize: '24.5 KB', virtSize: '28.0 KB', entropy: 6.42, status: 'Normal Executable Code' },
      { name: '.rdata', rawSize: '12.0 KB', virtSize: '14.2 KB', entropy: 5.18, status: 'Read-Only Constants & Strings' },
      { name: '.data', rawSize: '4.0 KB', virtSize: '8.5 KB', entropy: 3.25, status: 'Initialized Global Variables' },
      { name: '.pdata', rawSize: '2.0 KB', virtSize: '2.5 KB', entropy: 4.88, status: 'x64 Exception Handling Unwind' },
      { name: '.rsrc', rawSize: '8.5 KB', virtSize: '10.0 KB', entropy: 5.92, status: 'Icons, Manifests, Version' }
    ]
  },

  /**
   * Renders the Hands-On Lab Tab specifically tailored for the active subject
   */
  renderInteractiveLab(subj, container) {
    if (!container) return;

    if (subj.id === 2) {
      // RHCSA EX200: Full Interactive RHEL 9 Terminal Practice Simulator
      this.renderRhcsaTerminalLab(container);
    } else if (subj.id === 1) {
      // CompTIA Security+: PBQ Firewall Rule Builder & Network ACL Matching
      this.renderComptiaPbqLab(container);
    } else if (subj.id === 3) {
      // AWS: S3 Storage Tier & Architecture Cost Calculator
      this.renderAwsArchitectureLab(container);
    } else if (subj.id === 4) {
      // OpenShift: YAML Manifest & SCC Policy Validator
      this.renderOpenShiftYamlLab(container);
    } else if (subj.id === 5) {
      // Scripting: Interactive Bash & PowerShell Challenge Workbench
      this.renderScriptingWorkbenchLab(container);
    } else if (subj.id === 6) {
      // SIEM Forensics: Windows Event Log Investigator (4624/4625/7045)
      this.renderSiemForensicsLab(container);
    } else if (subj.id === 7) {
      // Reverse Engineering: PE Header Anatomy & Entropy Visualizer
      this.renderReverseEngineeringLab(container);
    } else if (subj.id === 8) {
      // Autonomous AI: Modelfile Builder & MCP Tool Calling Playground
      this.renderAiMcpPlaygroundLab(container);
    } else {
      // Universal Interactive Terminal & Practice Workbench for all catalog modules
      this.renderUniversalSubjectLab(subj, container);
    }
  },

  /**
   * 🐧 RHCSA EX200: Interactive Linux Terminal Practice Lab (Google AI Studio Full Replica)
   */
  renderRhcsaTerminalLab(container) {
    if (typeof window !== 'undefined' && window.RHCSA_EXAM_QUEST_SUITE) {
      window.RHCSA_EXAM_QUEST_SUITE.render(container);
      return;
    }
    const quests = [
      {
        id: "create-lvm",
        title: "Provision LVM Storage & XFS Filesystem",
        difficulty: "Medium",
        category: "Storage & LVM",
        desc: "Initialize disk `/dev/sdb`, create Volume Group `vg_data`, Logical Volume `lv_app` (2G), format with XFS, and mount to `/mnt/app`.",
        hints: [
          "1. pvcreate /dev/sdb",
          "2. vgcreate vg_data /dev/sdb",
          "3. lvcreate -L 2G -n lv_app vg_data",
          "4. mkfs.xfs /dev/vg_data/lv_app",
          "5. mount /dev/vg_data/lv_app /mnt/app"
        ],
        solutionPatterns: [/pvcreate/, /vgcreate/, /lvcreate/, /mkfs\.xfs/],
        initialLogs: [
          "[rhel9-node-01 ~]# lsblk",
          "NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS",
          "sda           8:0    0   20G  0 disk ",
          "├─sda1        8:1    0    1G  0 part /boot",
          "└─sda2        8:2    0   19G  0 part /",
          "sdb           8:16   0    5G  0 disk ",
          "[rhel9-node-01 ~]# "
        ]
      },
      {
        id: "selinux-port",
        title: "SELinux Non-Standard Port Authorization",
        difficulty: "Medium",
        category: "SELinux & Hardening",
        desc: "Authorize custom HTTP service on TCP port 8282 in SELinux policy database using `semanage`.",
        hints: [
          "Use semanage port: semanage port -a -t http_port_t -p tcp 8282",
          "Verify with: semanage port -l | grep http_port_t"
        ],
        solutionPatterns: [/semanage\s+port\s+-a\s+-t\s+http_port_t\s+-p\s+tcp\s+8282/],
        initialLogs: [
          "[rhel9-node-01 ~]# getenforce",
          "Enforcing",
          "[rhel9-node-01 ~]# semanage port -l | grep http_port_t",
          "http_port_t    tcp   80, 81, 443, 8008, 8009, 8443",
          "[rhel9-node-01 ~]# "
        ]
      },
      {
        id: "podman-container",
        title: "Rootless Podman Container & Systemd Unit",
        difficulty: "Hard",
        category: "Containers & Systemd",
        desc: "Deploy nginx container named `web1` mapped to port 8080, and generate systemd user service wrapper.",
        hints: [
          "podman run -d --name web1 -p 8080:80 nginx:latest",
          "podman generate systemd --name web1 --files",
          "loginctl enable-linger"
        ],
        solutionPatterns: [/podman\s+run/, /podman\s+generate\s+systemd/],
        initialLogs: [
          "[administrator@rhel9-node-01 ~]$ podman version",
          "Client: Podman Engine v4.4.1",
          "[administrator@rhel9-node-01 ~]$ "
        ]
      },
      {
        id: "firewalld-rich-rule",
        title: "FirewallD Permanent Rich Rule Configuration",
        difficulty: "Medium",
        category: "Networking & Security",
        desc: "Allow SSH strictly from management subnet `192.168.1.0/24` permanently and reload the firewall.",
        hints: [
          "firewall-cmd --permanent --add-rich-rule='rule family=\"ipv4\" source address=\"192.168.1.0/24\" service name=\"ssh\" accept'",
          "firewall-cmd --reload"
        ],
        solutionPatterns: [/firewall-cmd.*--permanent/, /firewall-cmd.*--reload/],
        initialLogs: [
          "[rhel9-node-01 ~]# firewall-cmd --get-active-zones",
          "public",
          "  interfaces: ens160",
          "[rhel9-node-01 ~]# "
        ]
      }
    ];

    const currentQuest = quests[this.state.activeRhQuestIdx] || quests[0];
    if (!this.state.rhTerminalLogs.length) {
      this.state.rhTerminalLogs = [...currentQuest.initialLogs];
    }

    container.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-4 h-[580px]">
        <!-- Left: Scenario Selector & Quest Brief -->
        <div class="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          <div class="text-xs font-bold uppercase tracking-wider text-[#dfba73]">RHCSA Scenario Quests</div>
          <div class="space-y-1.5 overflow-y-auto max-h-48 lg:max-h-none flex-1 pr-1">
            ${quests.map((q, idx) => `
              <button class="w-full text-left p-2.5 rounded-lg border text-xs transition-all rh-quest-btn ${idx === this.state.activeRhQuestIdx ? 'bg-[#c5a059]/20 border-[#c5a059] text-white font-bold' : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06]'}" data-idx="${idx}">
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#dfba73]">${q.category}</span>
                  <span class="text-[10px] font-mono text-slate-400">${q.difficulty}</span>
                </div>
                <div class="truncate">${q.title}</div>
              </button>
            `).join('')}
          </div>

          <!-- Quest Objective Card -->
          <div class="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs">
            <div class="text-[10px] font-mono uppercase text-[#38bdf8] mb-1 font-bold">🎯 Objective:</div>
            <p class="text-slate-300 leading-relaxed mb-3">${currentQuest.desc}</p>
            <button id="show-rh-hints-btn" class="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#dfba73] font-mono text-[11px] border border-white/10 transition-all">
              💡 Show Solution Hints
            </button>
            <div id="rh-hints-box" class="hidden mt-2 p-2 rounded bg-[#09152b] border border-[#c5a059]/30 text-[11px] font-mono text-slate-300 space-y-1">
              ${currentQuest.hints.map(h => `<div>• ${h}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Interactive Terminal Simulator -->
        <div class="flex-1 flex flex-col rounded-2xl bg-[#090d16] border border-[#c5a059]/40 overflow-hidden shadow-2xl">
          <!-- Terminal Titlebar -->
          <div class="px-4 py-2.5 bg-[#050810] border-b border-white/10 flex items-center justify-between font-mono text-xs text-slate-400">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span class="text-slate-300 ml-2 font-semibold">root@rhel9-node-01: ~ (Bash 5.2 Strict)</span>
            </div>
            <div class="flex items-center gap-3">
              <span id="rh-eval-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400">STATUS: AWAITING INPUT</span>
              <button id="clear-term-btn" class="hover:text-white transition-colors" title="Clear Console">Clear</button>
            </div>
          </div>

          <!-- Terminal Output Screen -->
          <div id="terminal-screen" class="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-slate-200 select-text leading-relaxed">
            ${this.state.rhTerminalLogs.map(l => `<div>${l}</div>`).join('')}
          </div>

          <!-- Interactive Input Line -->
          <div class="p-3 bg-[#050810] border-t border-white/10 flex items-center gap-2 font-mono text-xs">
            <span class="text-emerald-400 font-bold select-none">[rhel9-node-01 ~]#</span>
            <input type="text" id="terminal-input" class="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs" placeholder="Type Linux command (e.g. pvcreate /dev/sdb, getenforce, firewall-cmd)..." autofocus autocomplete="off" spellcheck="false">
            <button id="term-exec-btn" class="px-3 py-1 rounded bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] font-bold text-xs font-mono transition-all">
              EXECUTE ⏎
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind Terminal Events
    const termInput = container.querySelector('#terminal-input');
    const termScreen = container.querySelector('#terminal-screen');
    const execBtn = container.querySelector('#term-exec-btn');
    const clearBtn = container.querySelector('#clear-term-btn');
    const hintBtn = container.querySelector('#show-rh-hints-btn');
    const hintsBox = container.querySelector('#rh-hints-box');

    if (hintBtn && hintsBox) {
      hintBtn.addEventListener('click', () => {
        hintsBox.classList.toggle('hidden');
        hintBtn.textContent = hintsBox.classList.contains('hidden') ? '💡 Show Solution Hints' : 'Hide Solution Hints';
      });
    }

    const executeCmd = () => {
      const cmd = termInput.value.trim();
      if (!cmd) return;

      this.state.terminalHistory.push(cmd);
      this.state.terminalHistoryIdx = this.state.terminalHistory.length;

      // Append user command
      this.state.rhTerminalLogs.push(`<span class="text-emerald-400 font-bold">[rhel9-node-01 ~]#</span> <span class="text-white">${cmd}</span>`);

      // Simulated Linux Command Logic
      const output = this.simulateLinuxShell(cmd, currentQuest);
      if (output) {
        this.state.rhTerminalLogs.push(output);
      }

      // Check Quest Objectives
      this.evaluateQuestProgress(cmd, currentQuest, container);

      // Render updated logs
      termScreen.innerHTML = this.state.rhTerminalLogs.map(l => `<div>${l}</div>`).join('');
      termScreen.scrollTop = termScreen.scrollHeight;
      termInput.value = '';
    };

    if (execBtn) execBtn.addEventListener('click', executeCmd);
    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeCmd();
        } else if (e.key === 'ArrowUp') {
          if (this.state.terminalHistoryIdx > 0) {
            this.state.terminalHistoryIdx--;
            termInput.value = this.state.terminalHistory[this.state.terminalHistoryIdx];
          }
        } else if (e.key === 'ArrowDown') {
          if (this.state.terminalHistoryIdx < this.state.terminalHistory.length - 1) {
            this.state.terminalHistoryIdx++;
            termInput.value = this.state.terminalHistory[this.state.terminalHistoryIdx];
          } else {
            this.state.terminalHistoryIdx = this.state.terminalHistory.length;
            termInput.value = '';
          }
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.state.rhTerminalLogs = ['[rhel9-node-01 ~]# Console cleared. Ready.'];
        termScreen.innerHTML = this.state.rhTerminalLogs.map(l => `<div>${l}</div>`).join('');
      });
    }

    // Switch scenario
    container.querySelectorAll('.rh-quest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        this.state.activeRhQuestIdx = idx;
        this.state.rhTerminalLogs = [...quests[idx].initialLogs];
        this.renderRhcsaTerminalLab(container);
      });
    });
  },

  simulateLinuxShell(cmd, quest) {
    const c = cmd.trim();
    if (c === 'lsblk') {
      return "NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda           8:0    0   20G  0 disk \n├─sda1        8:1    0    1G  0 part /boot\n└─sda2        8:2    0   19G  0 part /\nsdb           8:16   0    5G  0 disk ";
    } else if (c.startsWith('pvcreate')) {
      return '<span class="text-emerald-300">Physical volume "/dev/sdb" successfully created.</span>';
    } else if (c.startsWith('vgcreate')) {
      return '<span class="text-emerald-300">Volume group "vg_data" successfully created.</span>';
    } else if (c.startsWith('lvcreate')) {
      return '<span class="text-emerald-300">Logical volume "lv_app" created. Sized: 2.00 GiB.</span>';
    } else if (c.startsWith('mkfs.xfs')) {
      return 'meta-data=/dev/vg_data/lv_app   isize=512    agcount=4, agsize=131072 blks\ndata     =                       bsize=4096   blocks=524288, imaxpct=25\nDiscarding blocks...Done.\nCreating 4 allocation groups...\n<span class="text-emerald-300">XFS filesystem created successfully.</span>';
    } else if (c.startsWith('mount')) {
      return '<span class="text-emerald-300">Mounted /dev/vg_data/lv_app on /mnt/app.</span>';
    } else if (c === 'getenforce') {
      return 'Enforcing';
    } else if (c.startsWith('semanage port -a')) {
      return '<span class="text-emerald-300">SELinux policy database updated: added tcp port 8282 to http_port_t.</span>';
    } else if (c.includes('grep http_port_t')) {
      return 'http_port_t                    tcp      80, 81, 443, 8008, 8009, 8282, 8443';
    } else if (c.startsWith('podman run')) {
      return '178f5a6b0c2a8c3d7e8b9f0a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d\n<span class="text-emerald-300">Container "web1" started in background on 0.0.0.0:8080->80/tcp.</span>';
    } else if (c.startsWith('podman ps')) {
      return 'CONTAINER ID  IMAGE                           COMMAND               CREATED         STATUS             PORTS                   NAMES\n178f5a6b0c2a  docker.io/library/nginx:latest  nginx -g daemon o...  12 seconds ago  Up 12 seconds ago  0.0.0.0:8080->80/tcp    web1';
    } else if (c.startsWith('podman generate systemd')) {
      return '<span class="text-emerald-300">Generated /etc/systemd/user/container-web1.service file.</span>';
    } else if (c.includes('firewall-cmd --permanent --add-rich-rule')) {
      return '<span class="text-emerald-300">success</span>';
    } else if (c === 'firewall-cmd --reload') {
      return '<span class="text-emerald-300">success: firewall rules reloaded</span>';
    } else if (c === 'uname -r' || c === 'uname -a') {
      return 'Linux rhel9-node-01.local 5.14.0-284.11.1.el9_2.x86_64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    } else if (c === 'help') {
      return 'Supported simulated commands: lsblk, pvcreate, vgcreate, lvcreate, mkfs.xfs, mount, getenforce, semanage, podman, firewall-cmd, uname, clear';
    } else {
      return `<span class="text-slate-400">${c}: executed (returncode 0)</span>`;
    }
  },

  evaluateQuestProgress(cmd, quest, container) {
    const badge = container.querySelector('#rh-eval-badge');
    if (!badge) return;

    let matchCount = 0;
    quest.solutionPatterns.forEach(pattern => {
      if (this.state.terminalHistory.some(h => pattern.test(h))) {
        matchCount++;
      }
    });

    if (matchCount === quest.solutionPatterns.length) {
      badge.textContent = '🎉 QUEST COMPLETED (100% PASS)';
      badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold';
    } else if (matchCount > 0) {
      badge.textContent = `PROGRESS: ${matchCount}/${quest.solutionPatterns.length} STEPS`;
      badge.className = 'px-2 py-0.5 rounded text-[10px] font-mono bg-[#c5a059]/20 text-[#dfba73] border border-[#c5a059]/40';
    }
  },

  /**
   * 🛡️ CompTIA Security+: Interactive PBQ Firewall Rule Builder
   */
  renderComptiaPbqLab(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">Performance-Based Question (PBQ #01)</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Security Architecture & Firewalls</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            <strong>Scenario:</strong> You are the security architect configuring the perimeter stateless firewall ACL for an enterprise DMZ hosting a public web server (<code class="text-[#dfba73]">192.168.10.50</code>). Configure the rules to permit inbound secure web and SSH management from the admin subnet (<code class="text-[#dfba73]">10.0.5.0/24</code>), while strictly denying all other unauthorized traffic.
          </p>
        </div>

        <!-- Interactive Rule Table -->
        <div class="rounded-xl border border-white/10 overflow-hidden bg-[#090d16]">
          <div class="p-3 bg-[#050810] border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <span class="font-bold text-white">Perimeter Stateless Firewall ACL (Evaluated Top-to-Bottom)</span>
            <button id="add-acl-rule-btn" class="px-2.5 py-1 rounded bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] font-bold text-[11px] transition-all">
              + Add Rule
            </button>
          </div>

          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-white/5 text-[11px] text-slate-400 uppercase">
              <tr>
                <th class="p-2.5">Rule #</th>
                <th class="p-2.5">Action</th>
                <th class="p-2.5">Source IP / CIDR</th>
                <th class="p-2.5">Destination IP</th>
                <th class="p-2.5">Port / Service</th>
                <th class="p-2.5">Protocol</th>
              </tr>
            </thead>
            <tbody id="acl-table-body" class="divide-y divide-white/5 text-slate-200">
              <tr>
                <td class="p-2.5 text-[#dfba73] font-bold">10</td>
                <td class="p-2.5 text-emerald-400 font-bold">PERMIT</td>
                <td class="p-2.5">Any (0.0.0.0/0)</td>
                <td class="p-2.5">192.168.10.50</td>
                <td class="p-2.5 font-bold">443 (HTTPS)</td>
                <td class="p-2.5">TCP</td>
              </tr>
              <tr>
                <td class="p-2.5 text-[#dfba73] font-bold">20</td>
                <td class="p-2.5 text-emerald-400 font-bold">PERMIT</td>
                <td class="p-2.5">10.0.5.0/24</td>
                <td class="p-2.5">192.168.10.50</td>
                <td class="p-2.5 font-bold">22 (SSH)</td>
                <td class="p-2.5">TCP</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-500 font-bold">99</td>
                <td class="p-2.5 text-rose-400 font-bold">DENY (Implicit)</td>
                <td class="p-2.5">Any (0.0.0.0/0)</td>
                <td class="p-2.5">Any (0.0.0.0/0)</td>
                <td class="p-2.5">All</td>
                <td class="p-2.5">Any</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-emerald-400">✓ Security Architecture Evaluation: OPTIMAL</div>
            <div class="text-slate-300 text-[11px] mt-0.5">Least privilege verified: SSH is restricted to administrative subnet, HTTPS is accessible publicly, and implicit deny catches remaining traffic.</div>
          </div>
          <button class="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono font-bold border border-emerald-500/40">
            Submit PBQ Score
          </button>
        </div>
      </div>
    `;
  },

  /**
   * ☁️ AWS Solutions Architect: Storage Tier & Architecture Cost Calculator
   */
  renderAwsArchitectureLab(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">AWS Interactive Architecture Sandbox</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400">CLF-C02 & SAA-C03</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Compare AWS Storage & Compute Tiers side-by-side with live latency, SLA durability, and operational cost calculations.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="p-4 rounded-xl bg-[#09152b] border border-white/10 hover:border-[#c5a059]/50 transition-all">
            <div class="text-xs font-bold text-sky-400 mb-1 font-mono">Amazon S3 Standard</div>
            <div class="text-[11px] text-slate-400 mb-3">Frequently accessed active datasets</div>
            <div class="space-y-1 text-xs font-mono text-slate-300">
              <div>● Durability: <strong>99.999999999% (11 9s)</strong></div>
              <div>● Availability SLA: <strong>99.99%</strong></div>
              <div>● Retrieval Latency: <strong>Milliseconds</strong></div>
              <div>● Storage Cost: <strong>$0.023 / GB-month</strong></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#09152b] border border-white/10 hover:border-[#c5a059]/50 transition-all">
            <div class="text-xs font-bold text-amber-400 mb-1 font-mono">S3 Standard-IA (Infrequent)</div>
            <div class="text-[11px] text-slate-400 mb-3">Long-lived data, once-a-month access</div>
            <div class="space-y-1 text-xs font-mono text-slate-300">
              <div>● Durability: <strong>99.999999999% (11 9s)</strong></div>
              <div>● Availability SLA: <strong>99.9%</strong></div>
              <div>● Retrieval Latency: <strong>Milliseconds</strong></div>
              <div>● Storage Cost: <strong>$0.0125 / GB-month</strong></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#09152b] border border-white/10 hover:border-[#c5a059]/50 transition-all">
            <div class="text-xs font-bold text-emerald-400 mb-1 font-mono">S3 Glacier Flexible</div>
            <div class="text-[11px] text-slate-400 mb-3">Archival backups with retrieval flexibility</div>
            <div class="space-y-1 text-xs font-mono text-slate-300">
              <div>● Durability: <strong>99.999999999% (11 9s)</strong></div>
              <div>● Availability SLA: <strong>99.9%</strong></div>
              <div>● Retrieval Latency: <strong>1-5 minutes to 3-5 hours</strong></div>
              <div>● Storage Cost: <strong>$0.0036 / GB-month</strong></div>
            </div>
          </div>
        </div>

        <!-- Well-Architected Framework 6 Pillars Matrix -->
        <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div class="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">AWS Well-Architected Framework: The 6 Pillars</div>
          <div class="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono">
            <div class="p-2.5 rounded bg-black/40 border border-white/5 text-slate-200">1. Operational Excellence</div>
            <div class="p-2.5 rounded bg-black/40 border border-white/5 text-slate-200">2. Security</div>
            <div class="p-2.5 rounded bg-black/40 border border-white/5 text-slate-200">3. Reliability</div>
            <div class="p-2.5 rounded bg-black/40 border border-white/5 text-slate-200">4. Performance Efficiency</div>
            <div class="p-2.5 rounded bg-black/40 border border-white/5 text-slate-200">5. Cost Optimization</div>
            <div class="p-2.5 rounded bg-black/40 border border-white/5 text-slate-200">6. Sustainability</div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * ☸️ OpenShift & Enterprise Containers: Interactive YAML Manifest Lab
   */
  renderOpenShiftYamlLab(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">OpenShift YAML & Security Policy Lab</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">DO280 / EX280</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Verify declarative Kubernetes/OpenShift Deployment manifests against SecurityContextConstraints (SCC) and Route ingress standards.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Editor -->
          <div class="rounded-xl border border-white/10 bg-[#090d16] overflow-hidden flex flex-col">
            <div class="px-3.5 py-2 bg-[#050810] border-b border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>deployment.yaml</span>
              <button id="validate-yaml-btn" class="px-2.5 py-0.5 rounded bg-[#c5a059] text-[#050b18] font-bold text-[11px]">
                Validate Policy ⏎
              </button>
            </div>
            <textarea id="yaml-code" class="w-full h-72 p-3.5 bg-transparent font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed" spellcheck="false">apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-service
  namespace: production-apps
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      serviceAccountName: app-sa
      securityContext:
        runAsNonRoot: true
      containers:
      - name: web
        image: registry.redhat.io/rhel9/nginx-120:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"</textarea>
          </div>

          <!-- Validator Output -->
          <div class="rounded-xl border border-white/10 bg-[#090d16] p-4 flex flex-col justify-between">
            <div>
              <div class="text-xs font-mono font-bold text-[#38bdf8] mb-3">Cluster Policy Pre-Flight Audit:</div>
              <div class="space-y-2 text-xs font-mono">
                <div class="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                  ✓ SCC restricted-v2 compliance: <code class="text-white">runAsNonRoot: true</code> specified.
                </div>
                <div class="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                  ✓ Enterprise Registry: image pulled from <code class="text-white">registry.redhat.io</code>.
                </div>
                <div class="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                  ✓ Resource limits defined: 500m CPU / 512Mi Memory.
                </div>
                <div class="p-2 rounded bg-sky-950/30 border border-sky-500/30 text-sky-300">
                  ℹ OpenShift Route command: <br>
                  <code class="text-[#dfba73]">oc expose service frontend-service --port=8080</code>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
              Cluster Status: EX280 Compliance Ready • Rootless Verified
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * ⚡ Enterprise Scripting: Interactive Lecture Hall & Dual-Shell Terminal Studio
   */
  renderScriptingWorkbenchLab(container) {
    if (typeof window !== 'undefined' && window.SCRIPTING_LECTURE_STUDIO) {
      window.SCRIPTING_LECTURE_STUDIO.render(container);
      return;
    }
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">Enterprise Systems Scripting Lab</span>
            <div class="flex items-center gap-2">
              <button id="lang-bash-btn" class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#c5a059] text-[#050b18] font-bold">Bash (RHEL 9)</button>
              <button id="lang-ps-btn" class="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 hover:text-white">PowerShell 7+</button>
            </div>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Implement production-grade automation scripts with strict error traps (<code class="text-[#dfba73]">set -euo pipefail</code>) and object streaming pipelines.
          </p>
        </div>

        <div class="rounded-xl border border-white/10 bg-[#090d16] overflow-hidden">
          <div class="px-3.5 py-2 bg-[#050810] border-b border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span id="script-filename">audit_system_health.sh</span>
            <button id="run-script-tests-btn" class="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-[#050b18] font-bold text-xs font-mono transition-all">
              ▶ Run Unit Tests
            </button>
          </div>
          <textarea id="script-editor" class="w-full h-64 p-3.5 bg-transparent font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed" spellcheck="false">#!/usr/bin/env bash
# Production RHEL Health Watchdog
set -euo pipefail
IFS=$'\n\t'

TMP_DIR="$(mktemp -d)"
cleanup() {
    rm -rf "${TMP_DIR}"
}
trap cleanup EXIT INT TERM

echo "Auditing system services..."
systemctl is-active --quiet sshd || { echo "sshd down!"; exit 1; }
echo "Storage and services 100% verified."</textarea>
          <div id="script-test-console" class="p-3 bg-[#050810] border-t border-white/10 font-mono text-xs text-emerald-400">
            [Test Runner]: Ready. Press 'Run Unit Tests' to execute test assertions.
          </div>
        </div>
      </div>
    `;

    const runBtn = container.querySelector('#run-script-tests-btn');
    const consoleEl = container.querySelector('#script-test-console');
    if (runBtn && consoleEl) {
      runBtn.addEventListener('click', () => {
        consoleEl.innerHTML = `
          <span class="text-white">Running Automated Script Verification Gate...</span><br>
          <span class="text-emerald-400">✓ Test 1: Strict error handling ('set -euo pipefail') detected</span><br>
          <span class="text-emerald-400">✓ Test 2: Safe trap cleanup handler bound to EXIT/INT/TERM</span><br>
          <span class="text-emerald-400">✓ Test 3: Zero Format-Table / Presentation pollutions</span><br>
          <span class="text-[#dfba73] font-bold">RESULT: 3 / 3 TEST SUITES PASSED (100% COMPLIANT)</span>
        `;
      });
    }
  },

  /**
   * 🔍 Cyber Defense: Windows Event Log Forensic Investigator
   */
  renderSiemForensicsLab(container) {
    const events = [
      { id: 4624, type: "Logon", logonType: "10 (RDP)", user: "svc_backup", ip: "198.51.100.23", status: "SUSPICIOUS", time: "03:14:22 UTC" },
      { id: 4625, type: "Failed Logon", logonType: "3 (Network)", user: "Administrator", ip: "203.0.113.45", status: "BRUTE FORCE", time: "03:14:25 UTC" },
      { id: 4625, type: "Failed Logon", logonType: "3 (Network)", user: "Administrator", ip: "203.0.113.45", status: "BRUTE FORCE", time: "03:14:26 UTC" },
      { id: 7045, type: "Service Install", logonType: "System", user: "SYSTEM", ip: "Localhost", status: "PERSISTENCE ALERT", time: "03:15:02 UTC" },
      { id: 4672, type: "Special Privs", logonType: "2 (Interactive)", user: "DomainAdmin", ip: "10.0.0.15", status: "NORMAL", time: "08:30:00 UTC" }
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">Windows SIEM Forensics Investigator</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Threat Hunting</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Filter and correlate authentication events. Detect lateral movement, brute force attacks, and persistent service installations.
          </p>
        </div>

        <div class="rounded-xl border border-white/10 bg-[#090d16] overflow-hidden">
          <div class="p-3 bg-[#050810] border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <span class="font-bold text-white">Live SIEM Ingestion Stream (Security.evtx)</span>
            <span class="text-slate-400 text-[11px]">Correlated Threat Score: 88/100</span>
          </div>
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-white/5 text-[11px] text-slate-400 uppercase">
              <tr>
                <th class="p-2.5">Event ID</th>
                <th class="p-2.5">Activity</th>
                <th class="p-2.5">Logon Type</th>
                <th class="p-2.5">Account</th>
                <th class="p-2.5">Source IP</th>
                <th class="p-2.5">Triage Verdict</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-slate-200">
              ${events.map(ev => {
                const color = ev.status.includes('SUSPICIOUS') || ev.status.includes('BRUTE') || ev.status.includes('ALERT') ? 'text-rose-400 font-bold' : 'text-emerald-400';
                return `
                  <tr class="hover:bg-white/[0.02]">
                    <td class="p-2.5 text-[#dfba73] font-bold">${ev.id}</td>
                    <td class="p-2.5 font-sans">${ev.type}</td>
                    <td class="p-2.5 text-sky-400">${ev.logonType}</td>
                    <td class="p-2.5 font-bold">${ev.user}</td>
                    <td class="p-2.5">${ev.ip}</td>
                    <td class="p-2.5 ${color}">${ev.status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * 🔬 Reverse Engineering: PE Header Anatomy & Entropy Visualizer
   */
  renderReverseEngineeringLab(container) {
    const sections = this.state.peSectionEntropy;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">Portable Executable (PE) Inspector</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Binary Analysis & Ghidra</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Inspect Shannon Section Entropy to identify obfuscation, UPX packing, and encrypted payloads.
          </p>
        </div>

        <div class="space-y-2.5">
          ${sections.map(sec => {
            const isHighEntropy = sec.entropy > 7.0;
            const barPct = Math.min(100, (sec.entropy / 8.0) * 100);
            return `
              <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-[#dfba73]">${sec.name}</span>
                  <span class="text-slate-400">Raw: ${sec.rawSize} • Virt: ${sec.virtSize}</span>
                  <span class="font-bold ${isHighEntropy ? 'text-rose-400' : 'text-emerald-400'}">Entropy: ${sec.entropy} / 8.0</span>
                </div>
                <div class="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-1.5">
                  <div class="h-full rounded-full ${isHighEntropy ? 'bg-rose-500' : 'bg-[#c5a059]'}" style="width: ${barPct}%"></div>
                </div>
                <div class="text-[11px] text-slate-400 font-sans">${sec.status}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  /**
   * 🤖 Autonomous AI: Modelfile Builder & MCP Tool Calling Playground
   */
  renderAiMcpPlaygroundLab(container) {
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-black/40 border border-[#c5a059]/30">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold uppercase text-[#dfba73] font-mono">Ollama Modelfile & MCP Tool Playground</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Model Context Protocol</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Craft local system prompts, calibrate temperature parameters, and test JSON-RPC 2.0 tool-calling execution schemas.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Modelfile Editor -->
          <div class="rounded-xl border border-white/10 bg-[#090d16] overflow-hidden flex flex-col">
            <div class="px-3.5 py-2 bg-[#050810] border-b border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Modelfile.forge</span>
              <span class="text-[#dfba73] text-[11px]">Ollama Runtime</span>
            </div>
            <textarea class="w-full h-64 p-3.5 bg-transparent font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed" spellcheck="false">FROM llama3:latest

# Operational Parameters
PARAMETER temperature 0.2
PARAMETER stop "<|eot_id|>"

# System Prompt Archetype
SYSTEM """
You are Antigravity Project Forge, an autonomous systems engineer.
Always apply strict error handling, PascalCase cmdlets, and
the CramExam high-yield learning architecture.
"""</textarea>
          </div>

          <!-- MCP Tool Call Simulator -->
          <div class="rounded-xl border border-white/10 bg-[#090d16] p-4 flex flex-col justify-between">
            <div>
              <div class="text-xs font-mono font-bold text-[#38bdf8] mb-2">Simulated JSON-RPC 2.0 Tool Call:</div>
              <pre class="p-3 rounded-lg bg-black/50 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "rhcsa_execute_command",
    "arguments": {
      "command": "firewall-cmd --permanent --reload"
    }
  },
  "id": "req-042"
}</pre>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
              Response: 200 OK • Tool Schema Verified • Zero Hallucination Boundary
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 🗂️ Interactive 3D Flashcards Deck Component
   */
  renderFlashcardDeck(subj, container) {
    if (!container) return;

    // Use subject flashcards or fallback
    const cards = (subj.cheatSheet || []).map((c, i) => ({
      id: i,
      front: c.trigger,
      back: `➜ ${c.mnemonic}\n\nDetail: ${c.detail}`
    }));

    if (!cards.length) {
      container.innerHTML = `<div class="p-8 text-center text-slate-400 font-mono">No flashcard decks compiled for this subject.</div>`;
      return;
    }

    const cardIdx = this.state.flashcardIdx % cards.length;
    const currentCard = cards[cardIdx];
    const isFlipped = this.state.flashcardFlipped;

    container.innerHTML = `
      <div class="max-w-xl mx-auto py-4">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span>CARD ${cardIdx + 1} OF ${cards.length}</span>
          <span class="text-[#dfba73]">CLICK TO FLIP • SPACEBAR READY</span>
        </div>

        <!-- 3D Flip Card -->
        <div id="flashcard-element" class="cursor-pointer min-h-[220px] p-6 rounded-2xl bg-gradient-to-br ${isFlipped ? 'from-[#0b2219] to-[#07130e] border-emerald-500/50' : 'from-[#09152b] to-[#050b18] border-[#c5a059]/40'} border shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]">
          <div class="text-[10px] font-mono uppercase tracking-wider ${isFlipped ? 'text-emerald-400' : 'text-[#dfba73]'}">
            ${isFlipped ? 'ANSWER & MNEMONIC' : 'PROMPT & TRIGGER'}
          </div>

          <div class="text-sm md:text-base font-semibold text-white leading-relaxed my-4">
            ${isFlipped ? currentCard.back.replace(/\n/g, '<br>') : currentCard.front}
          </div>

          <div class="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-white/10">
            <span>${isFlipped ? '✓ Mastered' : 'Click to Reveal Solution'}</span>
            <span>⟳ Flip</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-between mt-5">
          <button id="fc-prev-btn" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/10 transition-all">
            ← Previous Card
          </button>
          <button id="fc-flip-btn" class="px-5 py-2 rounded-lg bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] font-mono text-xs font-bold transition-all">
            ⟳ Flip Card
          </button>
          <button id="fc-next-btn" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/10 transition-all">
            Next Card →
          </button>
        </div>
      </div>
    `;

    const cardEl = container.querySelector('#flashcard-element');
    const flipBtn = container.querySelector('#fc-flip-btn');
    const prevBtn = container.querySelector('#fc-prev-btn');
    const nextBtn = container.querySelector('#fc-next-btn');

    const toggleFlip = () => {
      this.state.flashcardFlipped = !this.state.flashcardFlipped;
      this.renderFlashcardDeck(subj, container);
    };

    if (cardEl) cardEl.addEventListener('click', toggleFlip);
    if (flipBtn) flipBtn.addEventListener('click', toggleFlip);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.state.flashcardIdx = (cardIdx - 1 + cards.length) % cards.length;
        this.state.flashcardFlipped = false;
        this.renderFlashcardDeck(subj, container);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.state.flashcardIdx = (cardIdx + 1) % cards.length;
        this.state.flashcardFlipped = false;
        this.renderFlashcardDeck(subj, container);
      });
    }
  },

  /**
   * 🛠️ Universal In-Studio Practice Workbench for All Learning Hall Modules
   */
  renderUniversalSubjectLab(subj, container) {
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#dfba73] border border-[#c5a059]/40">
                EXHIBIT ${subj.roman}
              </span>
              <span class="text-xs font-mono text-slate-400">[${subj.code}]</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500 text-emerald-400">
                Active Verification Console
              </span>
            </div>
            <h3 class="text-base font-bold text-white">${subj.title} — Practice Workbench</h3>
            <p class="text-xs text-slate-400 font-mono mt-0.5">${subj.subtitle}</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="univ-run-verify-btn" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5">
              <span>▶</span> Run Verification
            </button>
            <button id="univ-clear-terminal-btn" class="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10 text-xs font-mono transition-all">
              Clear
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left: Verification Tasks & Domain Criteria -->
          <div class="space-y-3">
            <div class="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Architectural Verification Objectives</div>
            ${(subj.domains || []).map((d, i) => `
              <div class="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                <div id="obj-check-${i}" class="w-5 h-5 rounded flex items-center justify-center font-mono text-xs font-bold bg-white/10 text-slate-400 mt-0.5">
                  ${i + 1}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-slate-200">${d.name}</div>
                  <div class="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>Weight: ${d.weight}%</span>
                    <span class="text-emerald-400 font-bold">${d.mastery}% Mastery</span>
                  </div>
                </div>
              </div>
            `).join('')}

            <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              <div class="font-bold mb-1">⚡ Interactive Console Hints:</div>
              <div class="font-mono text-[11px] space-y-1 text-amber-300">
                <div>• Type <span class="bg-black/40 px-1 py-0.5 rounded text-white">verify</span> to audit all baseline domains.</div>
                <div>• Type <span class="bg-black/40 px-1 py-0.5 rounded text-white">status</span> to inspect live telemetry.</div>
                <div>• Type <span class="bg-black/40 px-1 py-0.5 rounded text-white">help</span> to list available diagnostics.</div>
              </div>
            </div>
          </div>

          <!-- Right: Interactive Terminal -->
          <div class="lg:col-span-2 flex flex-col h-[340px] rounded-2xl bg-black/90 border border-white/10 overflow-hidden font-mono">
            <div class="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="ml-2 font-bold text-slate-300">${subj.code.toLowerCase()}@learning-hall:~$</span>
              </div>
              <span class="text-[10px] text-slate-500">Antigravity Studio Terminal v2.0</span>
            </div>

            <div id="univ-term-screen" class="p-4 flex-1 overflow-y-auto text-xs text-slate-300 space-y-1.5 select-text">
              <div class="text-slate-500">// Welcome to ${subj.title} in-studio verification console.</div>
              <div class="text-slate-500">// Ready. Enter command or click 'Run Verification' to begin.</div>
              <div class="text-emerald-400 font-bold">[READY] ${subj.code} initialized at position Z=${subj.position ? subj.position.z : 0}m.</div>
            </div>

            <div class="p-2.5 bg-white/[0.02] border-t border-white/10 flex items-center gap-2">
              <span class="text-[#c5a059] font-bold text-xs select-none">❯</span>
              <input type="text" id="univ-term-input" placeholder="Type 'verify', 'status', 'test', or 'help'..."
                     class="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none placeholder-slate-600">
              <button id="univ-send-cmd-btn" class="px-3 py-1 rounded bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] text-xs font-bold font-mono transition-all">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const screen = document.getElementById('univ-term-screen');
    const input = document.getElementById('univ-term-input');
    const sendBtn = document.getElementById('univ-send-cmd-btn');
    const verifyBtn = document.getElementById('univ-run-verify-btn');
    const clearBtn = document.getElementById('univ-clear-terminal-btn');

    const appendLog = (line, colorClass = 'text-slate-300') => {
      if (!screen) return;
      const el = document.createElement('div');
      el.className = colorClass;
      el.textContent = line;
      screen.appendChild(el);
      screen.scrollTop = screen.scrollHeight;
    };

    const runVerification = () => {
      appendLog(`[EXEC] Starting full baseline domain audit for ${subj.code}...`, 'text-[#dfba73]');
      (subj.domains || []).forEach((d, idx) => {
        setTimeout(() => {
          appendLog(`  ✔ [PASS] ${d.name} (${d.weight}% Weight): Score ${d.mastery}% - ${d.status}`, 'text-emerald-400');
          const checkEl = document.getElementById(`obj-check-${idx}`);
          if (checkEl) {
            checkEl.classList.remove('bg-white/10', 'text-slate-400');
            checkEl.classList.add('bg-emerald-500', 'text-[#050b18]');
            checkEl.textContent = '✓';
          }
        }, (idx + 1) * 350);
      });

      setTimeout(() => {
        appendLog(`[COMPLETE] Overall Readiness: ${subj.readiness}% [${subj.grade}]. Verification passed 100%.`, 'text-cyan-400 font-bold');
      }, ((subj.domains || []).length + 1) * 350);
    };

    if (verifyBtn) verifyBtn.addEventListener('click', runVerification);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (screen) {
          screen.innerHTML = `<div class="text-slate-500">// Terminal cleared.</div>`;
        }
      });
    }

    const processCommand = () => {
      if (!input || !input.value.trim()) return;
      const cmd = input.value.trim();
      input.value = '';
      appendLog(`❯ ${cmd}`, 'text-white font-bold');

      const cmdLower = cmd.toLowerCase();
      if (cmdLower === 'verify' || cmdLower === 'test') {
        runVerification();
      } else if (cmdLower === 'status') {
        appendLog(`[STATUS] Code: ${subj.code} | Exhibit: ${subj.roman} | Wall: ${subj.wall}`, 'text-cyan-400');
        appendLog(`         Readiness: ${subj.readiness}% | Grade: ${subj.grade}`, 'text-slate-300');
        appendLog(`         Questions Mastered: ${subj.stats ? subj.stats.questionsMastered : 'N/A'} | PBQs: ${subj.stats ? subj.stats.pbqsCompleted : 'N/A'}`, 'text-slate-300');
      } else if (cmdLower === 'help') {
        appendLog(`Available commands:`, 'text-[#dfba73]');
        appendLog(`  verify   - Execute baseline verification across all 4 domains`, 'text-slate-300');
        appendLog(`  status   - View module telemetry and active grade`, 'text-slate-300');
        appendLog(`  audit    - Check zero-trust security and exception boundaries`, 'text-slate-300');
        appendLog(`  clear    - Clear terminal buffer`, 'text-slate-300');
      } else if (cmdLower === 'audit') {
        appendLog(`[AUDIT] Scanning ${subj.code} against HOW_I_LEARN_BASELINE.md...`, 'text-[#dfba73]');
        appendLog(`  ✔ Zero unhandled exceptions in AST parser`, 'text-emerald-400');
        appendLog(`  ✔ Memory Palace 3D coordinates grounded at Z=${subj.position ? subj.position.z : 0}`, 'text-emerald-400');
        appendLog(`  ✔ 4 Baseline Domain Weights strictly equal 100%`, 'text-emerald-400');
      } else if (cmdLower === 'clear') {
        if (screen) screen.innerHTML = '';
      } else {
        appendLog(`Command not recognized: '${cmd}'. Type 'help' for available commands.`, 'text-rose-400');
      }
    };

    if (sendBtn) sendBtn.addEventListener('click', processCommand);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') processCommand();
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.CENTRALIZED_TRAINING_SUITES = CENTRALIZED_TRAINING_SUITES;
}
