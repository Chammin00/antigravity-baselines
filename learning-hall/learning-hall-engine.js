/**
 * ⚡ Centralized Learning Hall: Audio & Interactive Studio Engine
 * Orchestrates footstep audio, procedural Web Audio telemetry chimes,
 * CramExam active recall quizzes, deep domain diagnostics, and keyboard navigation.
 */

class LearningHallEngine {
  constructor(subjects, hallScene) {
    this.subjects = subjects || [];
    this.hallScene = hallScene;
    this.activeSubject = this.subjects[0];
    this.currentQuizIndex = 0;
    this.quizAnswersState = {};
    this.audioMuted = false;

    // Web Audio Context for procedural cues
    this.audioCtx = null;

    // Footstep audio pool
    this.footstepPool = [];
    this.footstepCursor = 0;
    this.initAudio();

    this.populateSubjectDropdown();
    this.bindEvents();
    this.renderSubjectStationHUD(this.activeSubject);
  }

  populateSubjectDropdown() {
    const selector = document.getElementById('subject-select');
    if (!selector) return;
    selector.innerHTML = this.subjects
      .map((s) => `<option value="${s.id}">${s.roman}. ${s.title} (${s.code})</option>`)
      .join('');
    if (this.activeSubject) selector.value = this.activeSubject.id;

    const sub = document.getElementById('header-subject-count');
    if (sub) {
      sub.textContent = `${this.subjects.length} Exhibits • Memory Palace Traversal • 1K PBR Parquet`;
    }
  }

  initAudio() {
    // Load real footstep OGG samples from assets
    for (let i = 1; i <= 8; i++) {
      const pad = String(i).padStart(2, '0');
      const audio = new Audio(`assets/footsteps/footstep_${pad}.ogg`);
      audio.preload = 'auto';
      audio.volume = 0.38;
      this.footstepPool.push(audio);
    }

    const unlockAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  playFootstep(stepIndex = 0) {
    if (this.audioMuted || !this.footstepPool.length) return;
    const idx = (stepIndex >= 0 ? stepIndex : this.footstepCursor++) % this.footstepPool.length;
    const base = this.footstepPool[idx];
    if (!base) return;

    try {
      const clone = base.cloneNode();
      clone.volume = 0.35 + (stepIndex % 2) * 0.08;
      clone.playbackRate = 0.95 + (stepIndex % 3) * 0.05;
      clone.play().catch(() => {});
    } catch (_) {}
  }

  /**
   * Procedural Web Audio Synthesis for telemetry chimes & drill feedback
   */
  playTelemetryChime(type = 'arrive') {
    if (this.audioMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (type === 'arrive') {
        // High-gloss arrival chord (Eb major 7: Eb5, G5, Bb5, D6)
        const freqs = [622.25, 783.99, 932.33, 1174.66];
        freqs.forEach((f, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.05);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.65);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.7);
        });
      } else if (type === 'correct') {
        // Bright affirmative two-tone chime
        [587.33, 880.0].forEach((f, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.08);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.5);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.55);
        });
      } else if (type === 'incorrect') {
        // Subtle low error thud
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(146.83, now);
        osc.frequency.exponentialRampToValueAtTime(98.0, now + 0.25);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'jump') {
        // High-energy spring chime
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.16);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      }
    } catch (_) {}
  }

  updateViewModeUI(mode) {
    const btn = document.getElementById('view-mode-toggle-btn');
    if (!btn) return;
    if (mode === '1st') {
      btn.innerHTML = `<span class="text-amber-400">🎥</span> <span class="font-bold">1st Person</span> <span class="text-[10px] text-slate-400 border border-white/10 px-1 rounded">V</span>`;
    } else {
      btn.innerHTML = `<span class="text-emerald-400">🏃</span> <span class="font-bold">3rd Person</span> <span class="text-[10px] text-slate-400 border border-white/10 px-1 rounded">V</span>`;
    }
  }

  bindEvents() {
    // Top Bar Select Dropdown
    const selector = document.getElementById('subject-select');
    if (selector) {
      selector.addEventListener('change', (e) => {
        const id = parseInt(e.target.value, 10);
        this.traverseTo(id);
      });
    }

    // Prev / Next Traverse Buttons
    const prevBtn = document.getElementById('prev-subject-btn');
    const nextBtn = document.getElementById('next-subject-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.traversePrev());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.traverseNext());
    }

    // RPG Action Buttons: RUN and JUMP
    const rpgRunBtn = document.getElementById('rpg-run-btn');
    if (rpgRunBtn) {
      rpgRunBtn.addEventListener('click', () => {
        if (this.hallScene) this.hallScene.toggleRun();
      });
    }

    const rpgJumpBtn = document.getElementById('rpg-jump-btn');
    if (rpgJumpBtn) {
      rpgJumpBtn.addEventListener('click', () => {
        if (this.hallScene) this.hallScene.triggerJump();
        this.playTelemetryChime('jump');
      });
    }

    // View Mode Toggle Button
    const viewBtn = document.getElementById('view-mode-toggle-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        if (this.hallScene) this.hallScene.toggleViewMode();
      });
    }

    // Quick-Launch Header Buttons for RHCSA Exam Quest & Scripting Lecture Studio
    const rhcsaQuickBtn = document.getElementById('launch-rhcsa-quest-btn');
    if (rhcsaQuickBtn) {
      rhcsaQuickBtn.addEventListener('click', () => {
        const rhSubj = this.subjects.find((s) => s.id === 2 || s.code === 'EX200') || this.activeSubject || {
          id: 2, roman: 'II', code: 'EX200', title: 'Red Hat Certified System Administrator (RHCSA 9)', subtitle: 'EX200 Hands-On Quest Studio', grade: 'A (READY)', readiness: 92, accentCss: '#ee0000', domains: [], cheatSheet: [], stats: {}
        };
        this.activeSubject = rhSubj;
        this.renderSubjectStationHUD(rhSubj);
        this.openDeepStatsModal();
        if (!this.isModalMaximized) this.toggleMaximizeModal();
        this.switchModalTab('rhcsa-quest');
      });
    }

    const scriptQuickBtn = document.getElementById('launch-scripting-lecture-btn');
    if (scriptQuickBtn) {
      scriptQuickBtn.addEventListener('click', () => {
        const scSubj = this.subjects.find((s) => s.id === 5 || s.code === 'SCRIPT-01') || this.activeSubject || {
          id: 5, roman: 'V', code: 'SCRIPT-01', title: 'Enterprise Systems & Automation Scripting', subtitle: 'RHEL 9 Bash 5.2 & Modern PowerShell 7.4', grade: 'A (READY)', readiness: 90, accentCss: '#38bdf8', domains: [], cheatSheet: [], stats: {}
        };
        this.activeSubject = scSubj;
        this.renderSubjectStationHUD(scSubj);
        this.openDeepStatsModal();
        if (!this.isModalMaximized) this.toggleMaximizeModal();
        this.switchModalTab('scripting-lecture');
      });
    }

    // Open Deeper Stats Modal Button
    const inspectBtn = document.getElementById('open-deep-stats-btn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => this.openDeepStatsModal());
    }

    // Close Modal Button
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDeepStatsModal());
    }

    // Maximize Modal Button
    const maxBtn = document.getElementById('maximize-modal-btn');
    if (maxBtn) {
      maxBtn.addEventListener('click', () => this.toggleMaximizeModal());
    }

    // Modal Backdrop Click
    const modalBackdrop = document.getElementById('deep-stats-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeDeepStatsModal();
        }
      });
    }

    // Audio Toggle
    const muteBtn = document.getElementById('audio-toggle-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.audioMuted = !this.audioMuted;
        muteBtn.innerHTML = this.audioMuted ? '🔇 Audio Muted' : '🔊 Audio On';
        muteBtn.classList.toggle('text-rose-400', this.audioMuted);
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        const modal = document.getElementById('deep-stats-modal');
        if (modal && !modal.classList.contains('hidden')) {
          e.preventDefault();
          this.closeDeepStatsModal();
        } else {
          // Trigger RPG Jump
          if (this.hallScene) this.hallScene.triggerJump();
          this.playTelemetryChime('jump');
        }
      } else if (e.key === 'e' || e.key === 'E') {
        this.openDeepStatsModal();
      } else if (e.code === 'Escape') {
        this.closeDeepStatsModal();
      } else if (e.key === 'f' || e.key === 'F') {
        const modal = document.getElementById('deep-stats-modal');
        if (modal && !modal.classList.contains('hidden')) {
          this.toggleMaximizeModal();
        }
      }
    });

    // Modal Tabs Navigation
    document.querySelectorAll('.modal-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        this.switchModalTab(tabTarget);
      });
    });

    // Global Search (Ctrl+K)
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          searchInput.focus();
        }
      });

      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value.toLowerCase().trim());
      });
    }
  }

  traverseTo(subjectId) {
    if (this.hallScene) {
      this.hallScene.walkToSubject(subjectId);
    }
  }

  traverseNext() {
    const curIdx = this.subjects.findIndex((s) => s.id === this.activeSubject.id);
    const nextIdx = (curIdx + 1) % this.subjects.length;
    this.traverseTo(this.subjects[nextIdx].id);
  }

  traversePrev() {
    const curIdx = this.subjects.findIndex((s) => s.id === this.activeSubject.id);
    const prevIdx = (curIdx - 1 + this.subjects.length) % this.subjects.length;
    this.traverseTo(this.subjects[prevIdx].id);
  }

  onWalkStarted(fromSubj, toSubj) {
    this.closeDeepStatsModal();
    const walkingHud = document.getElementById('walking-hud');
    if (walkingHud) {
      walkingHud.classList.remove('opacity-0', 'pointer-events-none');
      document.getElementById('walking-to-label').textContent = `${toSubj.roman}. ${toSubj.title}`;
    }
  }

  onWalkCompleted(arrivedSubj) {
    this.activeSubject = arrivedSubj;
    this.currentQuizIndex = 0;

    const walkingHud = document.getElementById('walking-hud');
    if (walkingHud) {
      walkingHud.classList.add('opacity-0', 'pointer-events-none');
    }

    this.playTelemetryChime('arrive');
    this.renderSubjectStationHUD(arrivedSubj);

    const selector = document.getElementById('subject-select');
    if (selector) selector.value = arrivedSubj.id;
  }

  renderSubjectStationHUD(subj) {
    // Update Station Display in the Bottom Controller HUD
    const titleEl = document.getElementById('hud-subject-title');
    const codeEl = document.getElementById('hud-subject-code');
    const romanEl = document.getElementById('hud-subject-roman');
    const badgeEl = document.getElementById('hud-subject-grade');
    const barEl = document.getElementById('hud-subject-readiness-bar');
    const pctEl = document.getElementById('hud-subject-readiness-pct');

    if (titleEl) titleEl.textContent = subj.title;
    if (codeEl) codeEl.textContent = subj.code;
    if (romanEl) romanEl.textContent = subj.roman;
    if (badgeEl) {
      badgeEl.textContent = subj.grade;
      badgeEl.style.borderColor = subj.accentCss;
      badgeEl.style.color = subj.accentCss;
    }
    if (barEl) {
      barEl.style.width = `${subj.readiness}%`;
      barEl.style.backgroundColor = subj.accentCss;
    }
    if (pctEl) pctEl.textContent = `${subj.readiness}%`;

    const weakEl = document.getElementById('hud-weak-spot');
    if (weakEl) weakEl.textContent = subj.weakSpot;
  }

  toggleMaximizeModal() {
    const card = document.getElementById('modal-card');
    const maxBtn = document.getElementById('maximize-modal-btn');
    if (!card) return;
    this.isModalMaximized = !this.isModalMaximized;
    if (this.isModalMaximized) {
      card.classList.remove('max-w-5xl', 'max-h-[92vh]', 'rounded-3xl');
      card.classList.add('w-screen', 'h-screen', 'max-w-none', 'max-h-none', 'rounded-none');
      if (maxBtn) maxBtn.innerHTML = '🗗';
    } else {
      card.classList.remove('w-screen', 'h-screen', 'max-w-none', 'max-h-none', 'rounded-none');
      card.classList.add('max-w-5xl', 'max-h-[92vh]', 'rounded-3xl');
      if (maxBtn) maxBtn.innerHTML = '⛶';
    }
  }

  openDeepStatsModal() {
    const modal = document.getElementById('deep-stats-modal');
    if (!modal) return;

    this.renderModalContent(this.activeSubject);
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  closeDeepStatsModal() {
    const modal = document.getElementById('deep-stats-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  switchModalTab(tabName) {
    document.querySelectorAll('.modal-tab-btn').forEach((btn) => {
      const isTarget = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('border-[#c5a059]', isTarget);
      btn.classList.toggle('text-[#dfba73]', isTarget);
      btn.classList.toggle('text-slate-400', !isTarget);
      btn.classList.toggle('border-transparent', !isTarget);
    });

    document.querySelectorAll('.modal-tab-content').forEach((panel) => {
      panel.classList.toggle('hidden', panel.id !== `tab-${tabName}`);
    });

    // Lazy load/refresh tab content if needed
    if (tabName === 'lab') {
      this.renderInteractiveLabTab(this.activeSubject);
    } else if (tabName === 'rhcsa-quest') {
      this.renderRhcsaQuestTab();
    } else if (tabName === 'scripting-lecture') {
      this.renderScriptingLectureTab();
    } else if (tabName === 'flashcards') {
      this.renderFlashcardsTab(this.activeSubject);
    }
  }

  renderRhcsaQuestTab() {
    const container = document.getElementById('tab-rhcsa-quest');
    if (!container) return;
    if (window.RHCSA_EXAM_QUEST_SUITE) {
      window.RHCSA_EXAM_QUEST_SUITE.render(container);
    }
  }

  renderScriptingLectureTab() {
    const container = document.getElementById('tab-scripting-lecture');
    if (!container) return;
    if (window.SCRIPTING_LECTURE_STUDIO) {
      window.SCRIPTING_LECTURE_STUDIO.render(container);
    }
  }

  renderModalContent(subj) {
    // Header Info
    document.getElementById('modal-subject-code').textContent = `[${subj.code}]`;
    document.getElementById('modal-subject-roman').textContent = `EXHIBIT ${subj.roman}`;
    document.getElementById('modal-subject-title').textContent = subj.title;
    document.getElementById('modal-subject-subtitle').textContent = subj.subtitle;

    const gradeBadge = document.getElementById('modal-grade-badge');
    if (gradeBadge) {
      gradeBadge.textContent = subj.grade;
      gradeBadge.style.borderColor = subj.accentCss;
      gradeBadge.style.color = subj.accentCss;
    }

    // Tab 1: Domain Radar & Stats
    this.renderDomainRadarTab(subj);

    // Tab 2: Cram Quiz (Active Recall)
    this.renderCramQuizTab(subj);

    // Tab 3: Interactive Hands-On Lab & Terminal Studio
    this.renderInteractiveLabTab(subj);

    // Tab 4: 3D Flashcards Deck
    this.renderFlashcardsTab(subj);

    // Tab 5: Master Study Guide & Ports
    this.renderCheatSheetTab(subj);

    // Tab 6: Backup Workspace Launchers
    this.renderLauncherTab(subj);
  }

  renderInteractiveLabTab(subj) {
    const container = document.getElementById('tab-lab');
    if (!container) return;
    if (window.CENTRALIZED_TRAINING_SUITES) {
      window.CENTRALIZED_TRAINING_SUITES.renderInteractiveLab(subj, container);
    } else {
      container.innerHTML = `<div class="p-6 text-slate-400">Loading interactive lab suite...</div>`;
    }
  }

  renderFlashcardsTab(subj) {
    const container = document.getElementById('tab-flashcards');
    if (!container) return;
    if (window.CENTRALIZED_TRAINING_SUITES) {
      window.CENTRALIZED_TRAINING_SUITES.renderFlashcardDeck(subj, container);
    } else {
      container.innerHTML = `<div class="p-6 text-slate-400">Loading flashcards deck...</div>`;
    }
  }

  renderDomainRadarTab(subj) {
    const container = document.getElementById('tab-domains');
    if (!container) return;

    let domainsHtml = subj.domains
      .map((d) => {
        const color = d.mastery >= 90 ? '#10b981' : d.mastery >= 80 ? '#38bdf8' : d.mastery >= 70 ? '#f59e0b' : '#f43f5e';
        return `
        <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="font-semibold text-slate-200">${d.name}</span>
            <div class="flex items-center gap-2">
              <span class="font-mono text-[11px] text-slate-400">Weight: ${d.weight}%</span>
              <span class="font-mono font-bold text-xs" style="color: ${color}">${d.mastery}%</span>
            </div>
          </div>
          <div class="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" style="width: ${d.mastery}%; background: ${color}"></div>
          </div>
        </div>
      `;
      })
      .join('');

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div class="p-4 rounded-xl bg-[#09152b] border border-[#c5a059]/30">
          <div class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Readiness Score</div>
          <div class="text-3xl font-black font-mono mt-1" style="color: ${subj.accentCss}">${subj.readiness}%</div>
          <div class="text-[10px] text-emerald-400 mt-1 font-mono">Passing Target: ${subj.stats.examPassingScore}</div>
        </div>
        <div class="p-4 rounded-xl bg-[#09152b] border border-white/10">
          <div class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Questions Mastered</div>
          <div class="text-3xl font-black font-mono text-white mt-1">${subj.stats.questionsMastered} <span class="text-sm font-normal text-slate-500">/ ${subj.stats.totalQuestions}</span></div>
          <div class="text-[10px] text-slate-400 mt-1 font-mono">Avg Accuracy: ${subj.stats.avgScore}</div>
        </div>
        <div class="p-4 rounded-xl bg-[#09152b] border border-white/10">
          <div class="text-[11px] font-mono uppercase tracking-wider text-slate-400">PBQs / Labs Cleared</div>
          <div class="text-3xl font-black font-mono text-white mt-1">${subj.stats.pbqsCompleted} <span class="text-sm font-normal text-slate-500">/ ${subj.stats.totalPbqs}</span></div>
          <div class="text-[10px] text-emerald-400 mt-1 font-mono">100% Practical Verification</div>
        </div>
        <div class="p-4 rounded-xl bg-[#09152b] border border-white/10">
          <div class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Study Time Invested</div>
          <div class="text-3xl font-black font-mono text-[#dfba73] mt-1">${subj.stats.hoursInvested}</div>
          <div class="text-[10px] text-slate-400 mt-1 font-mono">Flashcards: ${subj.stats.flashcardsReviewed} cards</div>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 mb-6 flex items-start gap-3">
        <div class="text-xl">⚡</div>
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-rose-400">Identified Weak-Spot Triage</div>
          <div class="text-sm text-slate-200 mt-0.5">${subj.weakSpot}</div>
          <div class="text-[11px] text-slate-400 mt-1">Focus your active recall drills and terminal lab exercises on this domain before scheduling examination.</div>
        </div>
      </div>

      <div class="mb-4">
        <div class="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">Official Examination Domain Breakdown</div>
        <div class="space-y-2.5">
          ${domainsHtml}
        </div>
      </div>
    `;
  }

  renderCramQuizTab(subj) {
    const container = document.getElementById('tab-quiz');
    if (!container) return;

    if (!subj.cramQuiz || subj.cramQuiz.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-slate-400">No active quiz questions compiled for this subject yet.</div>`;
      return;
    }

    const qIdx = this.currentQuizIndex % subj.cramQuiz.length;
    const q = subj.cramQuiz[qIdx];
    const userChoice = this.quizAnswersState[`${subj.id}_${qIdx}`];
    const isAnswered = typeof userChoice === 'number';

    let optionsHtml = q.options
      .map((opt, i) => {
        let btnClass = 'bg-white/[0.04] border-white/10 hover:border-[#c5a059]/60 hover:bg-white/[0.08] text-slate-200';
        let badge = `<span class="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-mono text-xs font-bold mr-3">${String.fromCharCode(65 + i)}</span>`;

        if (isAnswered) {
          if (i === q.correct) {
            btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
            badge = `<span class="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-mono text-xs font-bold mr-3">✓</span>`;
          } else if (i === userChoice) {
            btnClass = 'bg-rose-500/20 border-rose-500 text-rose-200';
            badge = `<span class="w-6 h-6 rounded-md bg-rose-500 text-white flex items-center justify-center font-mono text-xs font-bold mr-3">✕</span>`;
          } else {
            btnClass = 'opacity-50 bg-white/[0.02] border-white/5 text-slate-400';
          }
        }

        return `
        <button class="w-full text-left p-3.5 rounded-xl border ${btnClass} flex items-center transition-all quiz-option-btn" data-index="${i}" ${isAnswered ? 'disabled' : ''}>
          ${badge}
          <span class="text-xs font-medium leading-relaxed">${opt}</span>
        </button>
      `;
      })
      .join('');

    let feedbackHtml = '';
    if (isAnswered) {
      const isCorrect = userChoice === q.correct;
      feedbackHtml = `
        <div class="mt-6 p-4 rounded-xl ${isCorrect ? 'bg-emerald-950/30 border border-emerald-500/40' : 'bg-rose-950/30 border border-rose-500/40'} animate-fade-in">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-black font-mono ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">
              ${isCorrect ? '✓ CORRECT — EXCELLENT RECALL' : '✕ INCORRECT RATIONALE'}
            </span>
          </div>

          <div class="text-xs text-slate-200 leading-relaxed mb-3">
            <strong class="text-white">Explanation:</strong> ${q.explanation}
          </div>

          ${
            q.distractors && q.distractors.length
              ? `
            <div class="mb-3 text-[11px] text-slate-400 space-y-1 bg-black/30 p-3 rounded-lg border border-white/5">
              <div class="font-bold uppercase tracking-wider text-slate-300 mb-1">Why Distractors Fail:</div>
              ${q.distractors.map((d) => `<div>• ${d}</div>`).join('')}
            </div>
          `
              : ''
          }

          <div class="p-3 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs text-[#dfba73]">
            <strong>⚡ Cram Exam Tip:</strong> ${q.cramTip}
          </div>

          <div class="mt-4 flex justify-end">
            <button id="next-quiz-btn" class="px-4 py-2 rounded-lg bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] font-bold text-xs font-mono transition-all">
              ${qIdx + 1 < subj.cramQuiz.length ? 'Next Question →' : 'Restart Question Deck ↺'}
            </button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#dfba73] border border-[#c5a059]/40">
            QUESTION ${qIdx + 1} OF ${subj.cramQuiz.length}
          </span>
          <span class="text-xs text-slate-400">CramExam Active Recall Protocol</span>
        </div>
      </div>

      <div class="text-sm md:text-base font-semibold text-white mb-5 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
        ${q.question}
      </div>

      <div class="space-y-2.5">
        ${optionsHtml}
      </div>

      ${feedbackHtml}
    `;

    // Attach answer selection event
    container.querySelectorAll('.quiz-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.getAttribute('data-index'), 10);
        this.quizAnswersState[`${subj.id}_${qIdx}`] = chosen;

        if (chosen === q.correct) {
          this.playTelemetryChime('correct');
        } else {
          this.playTelemetryChime('incorrect');
        }

        this.renderCramQuizTab(subj);
      });
    });

    const nextBtn = document.getElementById('next-quiz-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentQuizIndex = (qIdx + 1) % subj.cramQuiz.length;
        this.renderCramQuizTab(subj);
      });
    }
  }

  renderCheatSheetTab(subj) {
    const container = document.getElementById('tab-cheatsheet');
    if (!container) return;

    let mnemonicHtml = subj.cheatSheet
      .map(
        (c) => `
      <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#c5a059]/30 transition-all">
        <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">When You See:</div>
        <div class="text-xs font-semibold text-rose-300 mb-2">"${c.trigger}"</div>
        <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Immediately Think:</div>
        <div class="text-xs font-bold text-emerald-300 mb-1">➜ ${c.mnemonic}</div>
        <div class="text-[11px] text-slate-400">${c.detail}</div>
      </div>
    `
      )
      .join('');

    let portsHtml = '';
    if (subj.ports && subj.ports.length) {
      portsHtml = `
        <div class="mt-6">
          <div class="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">Critical Port & Protocol Matrix</div>
          <div class="overflow-x-auto rounded-xl border border-white/10">
            <table class="w-full text-left text-xs">
              <thead class="bg-white/5 font-mono text-[11px] text-slate-400 uppercase">
                <tr>
                  <th class="p-2.5">Port</th>
                  <th class="p-2.5">Protocol</th>
                  <th class="p-2.5">Service</th>
                  <th class="p-2.5">RFC / Examination Context</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-slate-300 font-mono">
                ${subj.ports
                  .map(
                    (p) => `
                  <tr class="hover:bg-white/[0.02]">
                    <td class="p-2.5 font-bold text-[#dfba73]">${p.port}</td>
                    <td class="p-2.5 text-sky-400">${p.proto}</td>
                    <td class="p-2.5 text-white font-sans font-semibold">${p.name}</td>
                    <td class="p-2.5 text-[11px] text-slate-400 font-sans">${p.desc}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="mb-4">
        <div class="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">
          High-Yield Mnemonic Triggers ("If You See X, Think Y")
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${mnemonicHtml}
        </div>
      </div>
      ${portsHtml}
    `;
  }

  renderLauncherTab(subj) {
    const container = document.getElementById('tab-launcher');
    if (!container) return;

    container.innerHTML = `
      <div class="p-6 rounded-2xl bg-gradient-to-br from-[#0c1a33] to-[#071020] border border-[#c5a059]/40 text-center max-w-xl mx-auto my-4">
        <div class="w-12 h-12 rounded-xl bg-[#c5a059]/20 border border-[#c5a059] text-xl flex items-center justify-center mx-auto mb-3">
          🚀
        </div>
        <h3 class="text-base font-bold text-white mb-1">Backup Workspace Integration: ${subj.launch.name}</h3>
        <p class="text-xs text-emerald-400 mb-2 font-mono">✓ Fully Centralized In-Studio (Links available as backup)</p>
        <p class="text-xs text-slate-400 mb-4 leading-relaxed">
          All study materials, exam simulators, interactive terminal labs, and flashcards are already directly accessible right here in this 3D Learning Hall. Use these external paths if you wish to run standalone scripts or external CLI tools in your terminal.
        </p>

        <div class="p-3 rounded-lg bg-black/40 border border-white/10 text-left mb-3">
          <div class="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Backup Workspace Path</div>
          <div class="text-xs font-mono text-slate-300 break-all select-all">${subj.launch.path}</div>
        </div>

        <div class="p-3 rounded-lg bg-black/40 border border-white/10 text-left mb-6">
          <div class="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Backup PowerShell Command</div>
          <div class="text-xs font-mono text-[#dfba73] break-all select-all">${subj.launch.command}</div>
        </div>

        <div class="flex items-center justify-center gap-3">
          <button id="copy-cmd-btn" class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all flex items-center gap-2">
            📋 Copy Backup Command
          </button>
          <a href="${subj.launch.path}" target="_blank" class="px-5 py-2 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:from-[#dfba73] hover:to-[#c5a059] text-[#050b18] font-bold text-xs font-mono transition-all flex items-center gap-2">
            Launch Backup Link ➜
          </a>
        </div>
      </div>
    `;

    const copyBtn = document.getElementById('copy-cmd-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(subj.launch.command).then(() => {
          copyBtn.textContent = '✓ Copied to Clipboard!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copy Command';
          }, 2000);
        });
      });
    }
  }

  handleSearch(query) {
    if (!query) return;

    // Search subjects, codes, acronyms, cheat sheets
    const match = this.subjects.find((s) => {
      if (s.title.toLowerCase().includes(query)) return true;
      if (s.code.toLowerCase().includes(query)) return true;
      if (s.category.toLowerCase().includes(query)) return true;
      if (s.cheatSheet.some((c) => c.trigger.toLowerCase().includes(query) || c.mnemonic.toLowerCase().includes(query))) return true;
      if (s.ports && s.ports.some((p) => String(p.port) === query || p.name.toLowerCase().includes(query))) return true;
      return false;
    });

    if (match && match.id !== this.activeSubject.id) {
      this.traverseTo(match.id);
    }
  }
}

if (typeof window !== 'undefined') {
  window.LearningHallEngine = LearningHallEngine;
}
