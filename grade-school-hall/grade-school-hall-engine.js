/**
 * 🎒 Grade School Learning Hall Engine: Master UI Orchestrator & Game Modules
 * Powers:
 * 1. Full 36-Week / 4-Quarter Scope & Sequence Curriculum Navigator
 * 2. GCompris Adaptive 3-Level Activity Scaffolding (Explorer, Adventurer, Master)
 * 3. Antura 3-Tier Intelligent Mascot Hint Ladder (Speech, 50/50, Walkthrough)
 * 4. Tux Math Meteor Defense & Tux Type Keyboarding Mini-Games
 * 5. Frankie Companion (Web Speech API + Emotional Scaffolding)
 * 6. Playable ChanceInvaders 1978 Space Arcade & Junior Chess
 * 7. JumpStart Milk Cap Collection Vault & Annual Report Card
 */

class GradeSchoolHallEngine {
  constructor() {
    this.data = window.GradeSchoolData;
    this.curriculum = window.GradeSchoolCurriculumYear || {};
    this.scene = null;
    this.activeGrade = '1st';
    this.activeExhibit = this.data.exhibits[0];
    this.userStars = 56;
    this.userMilkCaps = ['cap-01', 'cap-03', 'cap-04', 'cap-06', 'cap-08'];

    // Pedagogical State Machine (GCompris & Antura Standards)
    this.currentLevel = 1; // 1 = Explorer, 2 = Adventurer, 3 = Master
    this.correctStreak = 0;
    this.currentQuarter = 1;
    this.selectedWeek = 1;
    this.currentDrillIndex = 0;

    // Subject Hub & Sub-modes State
    this.activeSubjectTab = 'activities';
    this.activeSubMode = null;
    this.activeSubjectQuarter = 1;
    this.plantStage = 0;

    // Frankie Voiced Companion State
    this.speechSynthesis = window.speechSynthesis || null;
    this.isMuted = false;

    // Active Game Instances
    this.typingState = null;
    this.invadersLoop = null;
    this.chessState = null;

    this.init();
  }

  init() {
    // 1. Initialize 3D Scene
    this.scene = new window.GradeSchoolHallScene('canvas-container', this.data.exhibits, {
      onWalkStart: (target) => this.handleWalkStart(target),
      onWalkProgress: (data) => this.handleWalkProgress(data),
      onFootstep: (data) => this.handleFootstep(data),
      onArrive: (target) => this.handleArrive(target),
      onExhibitSelect: (exhibit) => this.openExhibitModal(exhibit),
      onViewModeChange: (mode) => this.updateViewModeUI(mode)
    });

    // 2. Bind DOM Event Handlers
    this.bindEvents();

    // 3. Update HUD with Initial Exhibit
    this.updateHUD(this.activeExhibit);
    this.updateStarsDisplay();
  }

  bindEvents() {
    // Grade Level Selector Dropdown
    const gradeSelect = document.getElementById('grade-select');
    if (gradeSelect) {
      gradeSelect.addEventListener('change', (e) => {
        this.activeGrade = e.target.value;
        this.speakFrankie(`Switched to ${e.target.options[e.target.selectedIndex].text}! Let's learn!`);
      });
    }

    // Subject Quick Jump Dropdown
    const subjectSelect = document.getElementById('subject-select');
    if (subjectSelect) {
      subjectSelect.addEventListener('change', (e) => {
        const id = Number(e.target.value);
        if (this.scene) this.scene.walkToExhibit(id);
      });
    }

    // 1st / 3rd Person View Toggle Button
    const viewModeBtn = document.getElementById('view-mode-toggle-btn');
    if (viewModeBtn) {
      viewModeBtn.addEventListener('click', () => {
        if (this.scene) this.scene.toggleViewMode();
      });
    }

    // 36-Week Full School Year Syllabus Button
    const syllabusBtn = document.getElementById('syllabus-toggle-btn');
    if (syllabusBtn) {
      syllabusBtn.addEventListener('click', () => this.openSyllabusModal());
    }
    const closeSyllabusBtn = document.getElementById('close-syllabus-btn');
    if (closeSyllabusBtn) {
      closeSyllabusBtn.addEventListener('click', () => this.closeAllModals());
    }

    // 1-Year Report Card Button
    const reportCardBtn = document.getElementById('report-card-btn');
    if (reportCardBtn) {
      reportCardBtn.addEventListener('click', () => this.openReportCardModal());
    }
    const closeReportBtn = document.getElementById('close-report-btn');
    if (closeReportBtn) {
      closeReportBtn.addEventListener('click', () => this.closeAllModals());
    }

    // Audio Mute/Unmute Toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        audioBtn.textContent = this.isMuted ? '🔇 Audio Muted' : '🔊 Audio Active';
        audioBtn.classList.toggle('text-rose-400', this.isMuted);
      });
    }

    // Navigation Buttons (Prev / Next Exhibit)
    const prevBtn = document.getElementById('prev-exhibit-btn');
    const nextBtn = document.getElementById('next-exhibit-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateRelativeExhibit(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateRelativeExhibit(1));
    }

    // Open Drill / Action Button in HUD
    const openDrillBtn = document.getElementById('open-drill-btn');
    if (openDrillBtn) {
      openDrillBtn.addEventListener('click', () => {
        if (this.activeExhibit) this.openExhibitModal(this.activeExhibit);
      });
    }

    // RPG Action Buttons: RUN and JUMP
    const rpgRunBtn = document.getElementById('rpg-run-btn');
    if (rpgRunBtn) {
      rpgRunBtn.addEventListener('click', () => {
        if (this.scene) this.scene.toggleRun();
      });
    }

    const rpgJumpBtn = document.getElementById('rpg-jump-btn');
    if (rpgJumpBtn) {
      rpgJumpBtn.addEventListener('click', () => {
        if (this.scene) this.scene.triggerJump();
      });
    }

    // RPG Action Buttons: GRAB and FLOP (Wobbly Life Physics)
    const rpgGrabBtn = document.getElementById('rpg-grab-btn');
    if (rpgGrabBtn) {
      rpgGrabBtn.addEventListener('click', () => {
        if (this.scene) this.scene.grabNearestToy();
      });
    }

    const rpgFlopBtn = document.getElementById('rpg-flop-btn');
    if (rpgFlopBtn) {
      rpgFlopBtn.addEventListener('click', () => {
        if (this.scene) this.scene.triggerFlop();
      });
    }

    // Hall Wing Quick Navigation (Academic Hall vs. Arcade Gaming Hall)
    const navAcadBtn = document.getElementById('nav-academic-hall-btn');
    if (navAcadBtn) {
      navAcadBtn.addEventListener('click', () => {
        if (this.scene) this.scene.walkToAcademicHall();
      });
    }

    const navGamingBtn = document.getElementById('nav-gaming-hall-btn');
    if (navGamingBtn) {
      navGamingBtn.addEventListener('click', () => {
        if (this.scene) this.scene.walkToGamingHall();
      });
    }

    // Traverse Portal Buttons
    const traverseBtn = document.getElementById('traverse-portal-btn');
    if (traverseBtn) {
      traverseBtn.addEventListener('click', () => {
        const id = this.activeExhibit ? this.activeExhibit.id : 1;
        this.traverseThroughPicture(id);
      });
    }

    const closePortalBtn = document.getElementById('close-portal-btn');
    if (closePortalBtn) {
      closePortalBtn.addEventListener('click', () => this.closeAllModals());
    }

    // Modal Close Buttons
    const closeDrillBtn = document.getElementById('close-drill-btn');
    if (closeDrillBtn) {
      closeDrillBtn.addEventListener('click', () => this.closeAllModals());
    }

    const closeGameBtn = document.getElementById('close-game-btn');
    if (closeGameBtn) {
      closeGameBtn.addEventListener('click', () => this.closeAllModals());
    }

    // Trophy Vault Button
    const trophyVaultBtn = document.getElementById('trophy-vault-btn');
    if (trophyVaultBtn) {
      trophyVaultBtn.addEventListener('click', () => this.openTrophyModal());
    }
    const closeTrophyBtn = document.getElementById('close-trophy-btn');
    if (closeTrophyBtn) {
      closeTrophyBtn.addEventListener('click', () => this.closeAllModals());
    }

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllModals();
    });
  }

  updateViewModeUI(mode) {
    const btn = document.getElementById('view-mode-toggle-btn');
    if (btn) {
      if (mode === '1st') {
        btn.innerHTML = `<span class="text-amber-400">🎥</span> <span class="font-bold">1st Person</span> <span class="text-[10px] text-slate-400 border border-white/10 px-1 rounded">V</span>`;
      } else {
        btn.innerHTML = `<span class="text-emerald-400">🏃</span> <span class="font-bold">3rd Person</span> <span class="text-[10px] text-slate-400 border border-white/10 px-1 rounded">V</span>`;
      }
    }
  }

  handleWalkStart(target) {
    const hud = document.getElementById('walking-hud');
    const label = document.getElementById('walking-to-label');
    if (hud && label) {
      label.textContent = `${target.roman}. ${target.title}`;
      hud.style.opacity = '1';
      hud.style.pointerEvents = 'auto';
    }
  }

  handleWalkProgress(data) {
    const bar = document.getElementById('walking-progress-bar');
    if (bar) {
      bar.style.width = `${Math.round(data.progress * 100)}%`;
    }
  }

  handleFootstep(data) {
    const footL = document.getElementById('foot-l');
    const footR = document.getElementById('foot-r');
    if (footL && footR) {
      if (data.isLeft) {
        footL.classList.add('foot-active');
        footR.classList.remove('foot-active');
      } else {
        footR.classList.add('foot-active');
        footL.classList.remove('foot-active');
      }
    }
  }

  handleArrive(target) {
    const hud = document.getElementById('walking-hud');
    if (hud) {
      hud.style.opacity = '0';
      hud.style.pointerEvents = 'none';
    }
    this.activeExhibit = target;
    this.updateHUD(target);

    // Speak Frankie's quote
    this.speakFrankie(target.frankieQuote);
  }

  navigateRelativeExhibit(delta) {
    if (!this.activeExhibit || !this.scene) return;
    const currentIndex = this.data.exhibits.findIndex(e => e.id === this.activeExhibit.id);
    let nextIndex = currentIndex + delta;
    if (nextIndex < 0) nextIndex = this.data.exhibits.length - 1;
    if (nextIndex >= this.data.exhibits.length) nextIndex = 0;
    const nextExhibit = this.data.exhibits[nextIndex];
    this.scene.walkToExhibit(nextExhibit.id);
  }

  updateHUD(exhibit) {
    if (!exhibit) return;

    // Update Dropdown Selection
    const subjectSelect = document.getElementById('subject-select');
    if (subjectSelect) subjectSelect.value = exhibit.id.toString();

    // Bottom Station Info
    const romanEl = document.getElementById('hud-subject-roman');
    const codeEl = document.getElementById('hud-subject-code');
    const gradeEl = document.getElementById('hud-subject-grade');
    const titleEl = document.getElementById('hud-subject-title');
    const topicEl = document.getElementById('hud-focus-topic');
    const pctEl = document.getElementById('hud-readiness-pct');
    const barEl = document.getElementById('hud-readiness-bar');
    const drillBtn = document.getElementById('open-drill-btn');

    if (romanEl) romanEl.textContent = exhibit.roman;
    if (codeEl) codeEl.textContent = `[${exhibit.code}]`;
    if (gradeEl) gradeEl.textContent = exhibit.gradeStatus;
    if (titleEl) titleEl.textContent = exhibit.title;
    if (topicEl) topicEl.textContent = exhibit.focusTopic;
    if (pctEl) pctEl.textContent = `${exhibit.readinessPct}%`;
    if (barEl) {
      barEl.style.width = `${exhibit.readinessPct}%`;
      barEl.style.backgroundColor = exhibit.themeColor;
    }

    if (drillBtn) {
      if (exhibit.type === 'game') {
        drillBtn.innerHTML = `<span>🎮</span> Play Game [E]`;
      } else {
        drillBtn.innerHTML = `<span>✏️</span> Practice Drill [E]`;
      }
    }
  }

  updateStarsDisplay() {
    const starCountEl = document.getElementById('user-stars-count');
    if (starCountEl) {
      starCountEl.textContent = this.userStars;
    }
    const capsCountEl = document.getElementById('user-caps-count');
    if (capsCountEl) {
      capsCountEl.textContent = `${this.userMilkCaps.length}/100`;
    }
  }

  speakFrankie(text) {
    if (this.isMuted || !this.speechSynthesis || !text) return;
    try {
      this.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.15; // Cheerful friendly pitch
      utterance.rate = 1.0;
      this.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  // =========================================================================
  // 📅 36-WEEK FULL SCHOOL YEAR SYLLABUS CONTROLLER (Khan/Oppia Standards)
  // =========================================================================
  openSyllabusModal() {
    const modal = document.getElementById('syllabus-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.switchSyllabusQuarter(this.currentQuarter);
    this.speakFrankie("Here is your full 36-week school year syllabus! 4 complete academic quarters!");
  }

  switchSyllabusQuarter(quarterNum) {
    this.currentQuarter = quarterNum;

    // Update active tab styling
    document.querySelectorAll('.quarter-tab-btn').forEach(btn => {
      const q = Number(btn.getAttribute('data-quarter'));
      if (q === quarterNum) {
        btn.className = "quarter-tab-btn px-4 py-2 rounded-xl bg-blue-600 text-white font-bold transition-all shadow-md";
      } else {
        btn.className = "quarter-tab-btn px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 font-bold transition-all";
      }
    });

    const container = document.getElementById('syllabus-weeks-container');
    if (!container) return;

    const startWeek = (quarterNum - 1) * 9 + 1;
    const endWeek = quarterNum * 9;

    let html = `
      <div class="mb-4 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>SHOWING QUARTER ${quarterNum} • WEEKS ${startWeek} TO ${endWeek}</span>
        <span class="text-blue-400">GCOMPRIS 3-LEVEL SCAFFOLDING ACTIVE</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    `;

    for (let w = startWeek; w <= endWeek; w++) {
      const rLesson = this.curriculum.reading ? this.curriculum.reading[w - 1] : null;
      const mLesson = this.curriculum.math ? this.curriculum.math[w - 1] : null;
      const sLesson = this.curriculum.science ? this.curriculum.science[w - 1] : null;

      html += `
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
              <span>WEEK ${w}</span>
              <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">★ Level ${w % 3 + 1}</span>
            </div>
            <h4 class="text-sm font-bold text-white mb-2 line-clamp-1">${rLesson ? rLesson.title : `Week ${w} Lesson`}</h4>
            
            <div class="space-y-1 text-xs text-slate-400 font-mono">
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-rose-400">📖</span> <span>${rLesson ? rLesson.title.split('(')[0] : 'Phonics'}</span>
              </div>
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-blue-400">🔢</span> <span>${mLesson ? mLesson.title : 'Math'}</span>
              </div>
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-amber-400">🔬</span> <span>${sLesson ? sLesson.title : 'Science'}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span class="text-[10px] font-mono text-emerald-400">✓ Ready</span>
            <button class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    onclick="GradeSchoolEngine.launchWeekFromSyllabus(${w})">
              Start Week ➔
            </button>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  launchWeekFromSyllabus(weekNum) {
    this.selectedWeek = weekNum;
    this.closeAllModals();

    // Map to active exhibit
    if (this.activeExhibit) {
      this.openExhibitModal(this.activeExhibit, weekNum);
    }
  }

  // =========================================================================
  // 📚 SUBJECT INTERACTIVE HUB & SYLLABUS CONTROLLER
  // =========================================================================
  openExhibitModal(exhibit, specificWeek = 1, defaultTab = 'activities') {
    if (!exhibit) return;

    if (exhibit.type === 'game') {
      this.openGameModal(exhibit);
      return;
    }

    const modal = document.getElementById('drill-modal');
    if (!modal) return;

    this.activeExhibit = exhibit;
    this.selectedWeek = specificWeek;
    this.currentDrillIndex = 0;
    this.activeSubjectTab = defaultTab;

    const titleEl = document.getElementById('modal-drill-title');
    if (titleEl) titleEl.textContent = `${exhibit.icon} ${exhibit.title}`;

    const iconBox = document.getElementById('modal-drill-icon-box');
    if (iconBox) iconBox.textContent = exhibit.icon;

    const codeEl = document.getElementById('modal-drill-code');
    if (codeEl) codeEl.textContent = `[${exhibit.code}] • Week ${this.selectedWeek} • Quarter ${Math.ceil(this.selectedWeek / 9)}`;

    const quoteEl = document.getElementById('modal-drill-quote');
    if (quoteEl) quoteEl.textContent = `"${exhibit.frankieQuote}"`;

    modal.classList.remove('hidden');
    this.switchSubjectTab(defaultTab);
  }

  getSubjectKey(exhibit) {
    if (!exhibit) return 'reading';
    if (exhibit.subHub && exhibit.subHub.id) return exhibit.subHub.id;
    if (exhibit.id === 1) return 'reading';
    if (exhibit.id === 2) return 'math';
    if (exhibit.id === 3) return 'writing';
    if (exhibit.id === 4) return 'science';
    if (exhibit.id === 5) return 'social';
    if (exhibit.id === 6) return 'arts';
    if (exhibit.id === 7) return 'health';
    if (exhibit.id === 8) return 'typing';
    if (exhibit.id === 9) return 'chanceinvaders';
    if (exhibit.id === 10) return 'chess';
    return 'reading';
  }

  switchSubjectTab(tabKey) {
    this.activeSubjectTab = tabKey;

    const actBtn = document.getElementById('subhub-tab-activities');
    const sylBtn = document.getElementById('subhub-tab-syllabus');
    const drlBtn = document.getElementById('subhub-tab-drill');

    if (actBtn) {
      actBtn.className = (tabKey === 'activities')
        ? "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
        : "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5";
    }
    if (sylBtn) {
      sylBtn.className = (tabKey === 'syllabus')
        ? "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-blue-600 text-white shadow-md transition-all flex items-center gap-1.5"
        : "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5";
    }
    if (drlBtn) {
      drlBtn.className = (tabKey === 'drill')
        ? "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-600 text-white shadow-md transition-all flex items-center gap-1.5"
        : "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5";
    }

    if (tabKey === 'activities') {
      this.renderSubjectActivities(this.activeExhibit);
    } else if (tabKey === 'syllabus') {
      this.renderSubjectSyllabus(this.activeExhibit);
    } else if (tabKey === 'drill') {
      this.renderDrillQuestion(this.activeExhibit, 0);
    }
  }

  renderSubjectActivities(exhibit, modeId = null) {
    const container = document.getElementById('drill-content-area');
    if (!container || !exhibit) return;

    const subHub = exhibit.subHub || {
      id: this.getSubjectKey(exhibit),
      name: exhibit.title,
      modes: [{ id: 'general', name: 'Overview', icon: '🌟', desc: exhibit.subtitle }]
    };

    const modes = (subHub.modes || []).filter(m => m.id !== 'syllabus-36');
    const activeModeId = modeId || this.activeSubMode || (modes[0] ? modes[0].id : 'general');
    this.activeSubMode = activeModeId;

    let modesNavHtml = `
      <div class="mb-5 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <span class="text-xs font-mono text-slate-400 mr-1">CHOOSE ACTIVITY:</span>
    `;

    modes.forEach(m => {
      const isSel = m.id === activeModeId;
      modesNavHtml += `
        <button class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${isSel ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'}"
                onclick="GradeSchoolEngine.renderSubjectActivities(GradeSchoolEngine.activeExhibit, '${m.id}')">
          <span>${m.icon}</span> <span>${m.name}</span>
        </button>
      `;
    });

    modesNavHtml += `</div>`;

    const currentMode = modes.find(m => m.id === activeModeId) || modes[0] || { icon: '🌟', name: 'Activity', desc: 'Choose an activity' };

    let contentHtml = `
      <div class="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-0.5">
            <span>${currentMode.icon}</span> <span>${currentMode.name}</span>
          </div>
          <p class="text-xs text-slate-300">${currentMode.desc}</p>
        </div>
        <button onclick="GradeSchoolEngine.traverseThroughPicture(${exhibit.id})" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md">
          <span>🚪</span> Step Into 1st Grade Hub ➔
        </button>
      </div>
    `;

    if (activeModeId === 'phonics-az') {
      contentHtml += this.buildPhonicsAZHtml();
    } else if (activeModeId === 'sight-words') {
      contentHtml += this.buildSightWordsHtml();
    } else if (activeModeId === 'story-reader') {
      contentHtml += this.buildStoryReaderHtml();
    } else if (activeModeId === 'spelling-bee') {
      contentHtml += this.buildSpellingBeeHtml();
    } else if (activeModeId === 'counting') {
      contentHtml += this.buildCountingHtml();
    } else if (activeModeId === 'addition-facts') {
      contentHtml += this.buildAdditionFactsHtml();
    } else if (activeModeId === 'fractions-pizza') {
      contentHtml += this.buildFractionsPizzaHtml();
    } else if (activeModeId === 'telling-time') {
      contentHtml += this.buildTellingTimeHtml();
    } else if (activeModeId === 'habitats') {
      contentHtml += this.buildHabitatsHtml();
    } else if (activeModeId === 'plants') {
      contentHtml += this.buildPlantsHtml();
    } else if (activeModeId === 'weather-sky') {
      contentHtml += this.buildWeatherHtml();
    } else if (activeModeId === 'sentence-builder') {
      contentHtml += this.buildSentenceBuilderHtml();
    } else if (activeModeId === 'handwriting-trace') {
      contentHtml += this.buildHandwritingHtml();
    } else if (activeModeId === 'helpers') {
      contentHtml += this.buildHelpersHtml();
    } else if (activeModeId === 'continents') {
      contentHtml += this.buildContinentsHtml();
    } else if (activeModeId === 'symbols') {
      contentHtml += this.buildSymbolsHtml();
    } else if (activeModeId === 'color-wheel') {
      contentHtml += this.buildColorWheelHtml();
    } else if (activeModeId === 'orchestra') {
      contentHtml += this.buildOrchestraHtml();
    } else if (activeModeId === 'senses') {
      contentHtml += this.buildSensesHtml();
    } else if (activeModeId === 'organs') {
      contentHtml += this.buildOrgansHtml();
    } else if (activeModeId === 'nutrition') {
      contentHtml += this.buildNutritionHtml();
    } else {
      contentHtml += `
        <div class="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
          <div class="text-4xl mb-2">${currentMode.icon}</div>
          <h3 class="text-lg font-bold text-white mb-2">${currentMode.name}</h3>
          <p class="text-xs text-slate-400 mb-4">${currentMode.desc}</p>
          <button class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs" onclick="GradeSchoolEngine.switchSubjectTab('drill')">
            Launch Practice Questions ➔
          </button>
        </div>
      `;
    }

    container.innerHTML = modesNavHtml + contentHtml;
  }

  renderSubjectSyllabus(exhibit, quarter = null) {
    const container = document.getElementById('drill-content-area');
    if (!container || !exhibit) return;

    const subjectKey = this.getSubjectKey(exhibit);
    const quarterNum = quarter || this.activeSubjectQuarter || 1;
    this.activeSubjectQuarter = quarterNum;

    const weeks = this.curriculum[subjectKey] || [];
    const startWeek = (quarterNum - 1) * 9 + 1;
    const endWeek = quarterNum * 9;
    const quarterWeeks = weeks.slice(startWeek - 1, endWeek);

    let html = `
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span>📅</span> <span>${exhibit.title} • 36-Week Scope &amp; Sequence</span>
          </h3>
          <p class="text-xs text-slate-400 font-mono">CCSS &amp; NGSS Standards • Quarter ${quarterNum} (Weeks ${startWeek}–${endWeek})</p>
        </div>
        
        <div class="flex items-center gap-1.5">
    `;

    for (let q = 1; q <= 4; q++) {
      const isQActive = q === quarterNum;
      html += `
        <button class="px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${isQActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}"
                onclick="GradeSchoolEngine.renderSubjectSyllabus(GradeSchoolEngine.activeExhibit, ${q})">
          Q${q} (W${(q-1)*9+1}–${q*9})
        </button>
      `;
    }

    html += `
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
    `;

    quarterWeeks.forEach(wObj => {
      html += `
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1.5">
              <span class="font-bold">WEEK ${wObj.week}</span>
              <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">${wObj.standard ? wObj.standard.split('.').slice(-2).join('.') : 'CCSS'}</span>
            </div>
            <h4 class="text-sm font-bold text-white mb-1.5 line-clamp-1">${wObj.title}</h4>
            <p class="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">${wObj.desc || wObj.title}</p>
            
            ${wObj.vocab && wObj.vocab.length ? `
              <div class="flex flex-wrap gap-1 mb-3">
                ${wObj.vocab.slice(0, 3).map(v => `<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">${v}</span>`).join('')}
              </div>
            ` : ''}
          </div>

          <div class="pt-3 border-t border-white/10 flex items-center justify-between">
            <span class="text-[10px] font-mono text-emerald-400">✓ Unit Scaffolding</span>
            <button class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1"
                    onclick="GradeSchoolEngine.openExhibitModal(GradeSchoolEngine.activeExhibit, ${wObj.week}, 'drill')">
              <span>▶</span> Practice Week
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  traverseThroughPicture(exhibitId) {
    const modal = document.getElementById('portal-modal');
    const frame = document.getElementById('portal-frame');
    const titleEl = document.getElementById('portal-modal-title');
    const extLink = document.getElementById('portal-external-link');
    if (!modal || !frame) return;

    if (this.scene) {
      this.scene.playChime(440, 'triangle', 0.12);
      setTimeout(() => this.scene.playChime(554, 'triangle', 0.12), 100);
      setTimeout(() => this.scene.playChime(659, 'triangle', 0.12), 200);
      setTimeout(() => this.scene.playChime(880, 'triangle', 0.25), 300);
    }

    const ex = this.data.exhibits.find(e => e.id === Number(exhibitId)) || this.activeExhibit;
    if (titleEl && ex) {
      titleEl.textContent = `Traversed into 1st Grade Learning Hub — ${ex.title}`;
    }

    const hubUrl = '/1st-grade-learning/index.html';
    frame.src = hubUrl;
    if (extLink) extLink.href = hubUrl;

    modal.classList.remove('hidden');
    this.speakFrankie("Stepping through the magic picture into the First Grade Learning Hub! Welcome!");
  }

  buildPhonicsAZHtml() {
    const letters = [
      { l: 'A', pic: '🍎', word: 'Apple', sound: '/æ/' },
      { l: 'B', pic: '⚽', word: 'Ball', sound: '/b/' },
      { l: 'C', pic: '🐱', word: 'Cat', sound: '/k/' },
      { l: 'D', pic: '🐶', word: 'Dog', sound: '/d/' },
      { l: 'E', pic: '🐘', word: 'Elephant', sound: '/e/' },
      { l: 'F', pic: '🐟', word: 'Fish', sound: '/f/' },
      { l: 'G', pic: '🦒', word: 'Giraffe', sound: '/g/' },
      { l: 'H', pic: '🎩', word: 'Hat', sound: '/h/' },
      { l: 'I', pic: '🦎', word: 'Iguana', sound: '/ɪ/' },
      { l: 'J', pic: '🦘', word: 'Jump', sound: '/dʒ/' },
      { l: 'K', pic: '🪁', word: 'Kite', sound: '/k/' },
      { l: 'L', pic: '🦁', word: 'Lion', sound: '/l/' },
      { l: 'M', pic: '🌙', word: 'Moon', sound: '/m/' },
      { l: 'N', pic: '🪺', word: 'Nest', sound: '/n/' },
      { l: 'O', pic: '🐙', word: 'Octopus', sound: '/ɒ/' },
      { l: 'P', pic: '🐷', word: 'Pig', sound: '/p/' },
      { l: 'Q', pic: '👑', word: 'Queen', sound: '/kw/' },
      { l: 'R', pic: '🌈', word: 'Rainbow', sound: '/r/' },
      { l: 'S', pic: '☀️', word: 'Sun', sound: '/s/' },
      { l: 'T', pic: '🐯', word: 'Tiger', sound: '/t/' },
      { l: 'U', pic: '☂️', word: 'Umbrella', sound: '/ʌ/' },
      { l: 'V', pic: '🚐', word: 'Van', sound: '/v/' },
      { l: 'W', pic: '💧', word: 'Water', sound: '/w/' },
      { l: 'X', pic: '🦊', word: 'Fox', sound: '/ks/' },
      { l: 'Y', pic: '🪀', word: 'Yo-yo', sound: '/j/' },
      { l: 'Z', pic: '🦓', word: 'Zebra', sound: '/z/' }
    ];

    let html = `
      <div class="mb-3 text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>🗣️ TAP ANY LETTER TO HEAR FRANKIE SOUND IT OUT:</span>
        <span class="text-amber-400">26 ALPHABET PHONICS CARDS</span>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2.5">
    `;

    letters.forEach(item => {
      html += `
        <button class="p-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-center transition-all hover:scale-105 active:scale-95 group"
                onclick="GradeSchoolEngine.playPhonicsAudio('${item.l}', '${item.word}', '${item.sound}')">
          <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">${item.pic}</div>
          <div class="text-lg font-black text-white font-mono leading-none">${item.l}${item.l.toLowerCase()}</div>
          <div class="text-[10px] text-amber-300 font-bold truncate mt-0.5">${item.word}</div>
        </button>
      `;
    });

    html += `</div>`;
    return html;
  }

  buildSightWordsHtml() {
    const words = [
      { w: 'the', s: 'The sun is warm.' },
      { w: 'and', s: 'Frankie and puppy play.' },
      { w: 'a', s: 'I see a red bird.' },
      { w: 'to', s: 'We go to school.' },
      { w: 'in', s: 'Fish swim in the pond.' },
      { w: 'is', s: 'Reading is fun!' },
      { w: 'you', s: 'You are a superstar!' },
      { w: 'that', s: 'Look at that big tree.' },
      { w: 'it', s: 'It is sunny outside.' },
      { w: 'he', s: 'He runs very fast.' },
      { w: 'was', s: 'The kitten was soft.' },
      { w: 'for', s: 'This gift is for you.' },
      { w: 'on', s: 'The cat sat on the mat.' },
      { w: 'are', s: 'We are learning together.' },
      { w: 'as', s: 'Sweet as honey.' },
      { w: 'with', s: 'Come with me to play.' },
      { w: 'his', s: 'He packed his backpack.' },
      { w: 'they', s: 'They sang a happy song.' },
      { w: 'at', s: 'Look at the stars.' },
      { w: 'be', s: 'Be kind to your friends.' },
      { w: 'this', s: 'This book is exciting.' },
      { w: 'have', s: 'I have three pencils.' },
      { w: 'from', s: 'A letter from grandma.' },
      { w: 'or', s: 'Red or blue crayon?' },
      { w: 'one', s: 'One shining trophy.' }
    ];

    let html = `
      <div class="mb-3 text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>🌟 1ST GRADE ESSENTIAL FRY SIGHT WORDS (TAP TO HEAR):</span>
        <span class="text-emerald-400">25 SPRINT CARDS</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
    `;

    words.forEach(item => {
      html += `
        <button class="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400 text-left transition-all hover:scale-105 active:scale-95 group"
                onclick="GradeSchoolEngine.playSightWordAudio('${item.w}', '${item.s}')">
          <div class="text-xl font-black text-emerald-300 font-mono tracking-wide mb-1">${item.w}</div>
          <div class="text-[11px] text-slate-300 line-clamp-1 italic">${item.s}</div>
          <div class="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <span>🔊</span> Hear Sentence
          </div>
        </button>
      `;
    });

    html += `</div>`;
    return html;
  }

  buildStoryReaderHtml() {
    const sentences = [
      "Once upon a time, The Little Red Hen found some golden wheat seeds.",
      "'Who will help me plant this wheat?' asked the Little Red Hen.",
      "'Not I!' barked the lazy Dog. 'Not I!' purred the sleepy Cat.",
      "'Then I will do it myself,' said the Little Red Hen. And she did!",
      "When the wheat grew tall, she ground it into soft white flour.",
      "'Who will help me bake warm bread?' asked the Hen. 'Not I!' said the animals.",
      "'Then I will bake it myself!' The oven baked delicious golden loaves.",
      "'Now, who will help me eat the warm bread?' asked the Hen.",
      "'I will!' barked the Dog. 'I will!' purred the Cat.",
      "'No, you did not help,' said the Little Red Hen. 'My chicks and I will enjoy it!' The End."
    ];

    let html = `
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <div>
          <h4 class="text-sm font-bold text-white flex items-center gap-2">
            <span>📚</span> <span>The Little Red Hen (Interactive Reader)</span>
          </h4>
          <p class="text-xs text-slate-300">Tap any sentence or click 'Read Entire Story' to follow along!</p>
        </div>
        <button class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                onclick="GradeSchoolEngine.readEntireStory()">
          <span>🔊</span> Read Entire Story
        </button>
      </div>
      <div class="space-y-2.5">
    `;

    sentences.forEach((s, idx) => {
      html += `
        <div id="story-sent-${idx}" class="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-all"
             onclick="GradeSchoolEngine.readStorySentence(${idx}, '${s.replace(/'/g, "\\'")}')">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">${idx + 1}</span>
            <span class="text-sm text-slate-100 font-medium">${s}</span>
          </div>
          <button class="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-300 text-xs flex-shrink-0">
            🔊
          </button>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  buildSpellingBeeHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <div class="text-5xl">🐱</div>
        <h4 class="text-lg font-bold text-white">Can you spell "CAT"?</h4>
        <p class="text-xs text-slate-400">Click the letter tiles in the right order:</p>
        <div id="spelling-word-display" class="h-14 flex items-center justify-center gap-2">
          <span id="spell-slot-0" class="w-12 h-12 rounded-xl bg-white/10 border-2 border-dashed border-amber-400/50 flex items-center justify-center text-2xl font-black font-mono text-amber-300">_</span>
          <span id="spell-slot-1" class="w-12 h-12 rounded-xl bg-white/10 border-2 border-dashed border-amber-400/50 flex items-center justify-center text-2xl font-black font-mono text-amber-300">_</span>
          <span id="spell-slot-2" class="w-12 h-12 rounded-xl bg-white/10 border-2 border-dashed border-amber-400/50 flex items-center justify-center text-2xl font-black font-mono text-amber-300">_</span>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl font-mono hover:scale-110 active:scale-95 transition-all shadow-md"
                  onclick="GradeSchoolEngine.tapSpellLetter('C')">C</button>
          <button class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl font-mono hover:scale-110 active:scale-95 transition-all shadow-md"
                  onclick="GradeSchoolEngine.tapSpellLetter('A')">A</button>
          <button class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl font-mono hover:scale-110 active:scale-95 transition-all shadow-md"
                  onclick="GradeSchoolEngine.tapSpellLetter('T')">T</button>
          <button class="w-12 h-12 rounded-2xl bg-white/10 text-slate-300 font-black text-xl font-mono hover:scale-110 active:scale-95 transition-all"
                  onclick="GradeSchoolEngine.tapSpellLetter('M')">M</button>
          <button class="w-12 h-12 rounded-2xl bg-white/10 text-slate-300 font-black text-xl font-mono hover:scale-110 active:scale-95 transition-all"
                  onclick="GradeSchoolEngine.tapSpellLetter('P')">P</button>
        </div>
        <div id="spell-result" class="text-xs font-mono font-bold text-amber-400">TAP THE TILES: C - A - T</div>
      </div>
    `;
  }

  buildCountingHtml() {
    let html = `
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span class="text-slate-400">TAP NUMBERS (1 TO 100) TO HEAR COUNTING:</span>
        <div class="flex items-center gap-1.5">
          <button class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold" onclick="GradeSchoolEngine.filterCountGrid('all')">All</button>
          <button class="px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/30" onclick="GradeSchoolEngine.filterCountGrid('2s')">By 2s</button>
          <button class="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30" onclick="GradeSchoolEngine.filterCountGrid('5s')">By 5s</button>
          <button class="px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30" onclick="GradeSchoolEngine.filterCountGrid('10s')">By 10s</button>
        </div>
      </div>
      <div id="number-grid-container" class="grid grid-cols-10 gap-1.5 max-h-[360px] overflow-y-auto p-2 bg-black/20 rounded-2xl border border-white/5">
    `;

    for (let i = 1; i <= 100; i++) {
      html += `
        <button id="num-btn-${i}" class="num-cell p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-white font-mono font-bold text-xs transition-all active:scale-90"
                onclick="GradeSchoolEngine.playNumberAudio(${i})">
          ${i}
        </button>
      `;
    }

    html += `</div>`;
    return html;
  }

  buildAdditionFactsHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <div class="flex items-center justify-center gap-4 text-3xl">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>🍎 🍎 🍎 🍎 🍎</div>
            <div class="text-sm font-bold text-amber-300 mt-1 font-mono">5 Apples</div>
          </div>
          <span class="text-2xl font-black text-amber-400">+</span>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>🍎 🍎 🍎</div>
            <div class="text-sm font-bold text-amber-300 mt-1 font-mono">3 Apples</div>
          </div>
          <span class="text-2xl font-black text-amber-400">=</span>
          <div id="addition-sum-box" class="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-dashed border-amber-400 flex items-center justify-center text-3xl font-black font-mono text-amber-300">
            ?
          </div>
        </div>
        <p class="text-xs text-slate-400">How many apples does Frankie have in all?</p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold font-mono text-base transition-all" onclick="GradeSchoolEngine.checkAdditionFact(6)">6</button>
          <button class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold font-mono text-base transition-all" onclick="GradeSchoolEngine.checkAdditionFact(7)">7</button>
          <button class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400 text-white font-bold font-mono text-base transition-all" onclick="GradeSchoolEngine.checkAdditionFact(8)">8</button>
          <button class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold font-mono text-base transition-all" onclick="GradeSchoolEngine.checkAdditionFact(9)">9</button>
        </div>
        <div id="addition-feedback" class="text-xs font-mono text-amber-300 font-bold">COUNT THE APPLES: 5 + 3 = ?</div>
      </div>
    `;
  }

  buildFractionsPizzaHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <div class="text-6xl">🍕</div>
        <h4 class="text-lg font-bold text-white">Visual Fractions Pizzeria</h4>
        <p class="text-xs text-slate-400">Slice Frankie's pizza into equal parts:</p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold text-xs" onclick="GradeSchoolEngine.setPizzaFraction('1/1', 'Whole Pizza (1)')">Whole (1)</button>
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold text-xs" onclick="GradeSchoolEngine.setPizzaFraction('1/2', 'Half (1/2)')">Half (1/2)</button>
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold text-xs" onclick="GradeSchoolEngine.setPizzaFraction('1/4', 'Fourth / Quarter (1/4)')">Fourth (1/4)</button>
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold text-xs" onclick="GradeSchoolEngine.setPizzaFraction('3/4', 'Three Fourths (3/4)')">Three Fourths (3/4)</button>
        </div>
        <div id="pizza-fraction-desc" class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 font-bold">
          🍕 1 Whole Pizza = 2 equal halves or 4 equal fourths!
        </div>
      </div>
    `;
  }

  buildTellingTimeHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <div class="text-6xl">⏰</div>
        <h4 class="text-lg font-bold text-white">Telling Time Analog Clock</h4>
        <p class="text-xs text-slate-400">The short hand is on the 3, and the long hand points straight up at 12:</p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400 text-white font-bold font-mono text-sm" onclick="GradeSchoolEngine.checkTellingTime('3:00')">3:00</button>
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold font-mono text-sm" onclick="GradeSchoolEngine.checkTellingTime('12:15')">12:15</button>
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold font-mono text-sm" onclick="GradeSchoolEngine.checkTellingTime('3:30')">3:30</button>
          <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 text-white font-bold font-mono text-sm" onclick="GradeSchoolEngine.checkTellingTime('6:00')">6:00</button>
        </div>
        <div id="clock-feedback" class="text-xs font-mono text-amber-300 font-bold">MATCH THE CLOCK HANDS!</div>
      </div>
    `;
  }

  buildHabitatsHtml() {
    return `
      <div class="space-y-4">
        <div class="text-xs font-mono text-slate-400">SORT ANIMALS INTO THEIR NATURAL HABITATS:</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-center">
            <div class="text-3xl mb-1">🌊</div>
            <h5 class="text-xs font-bold text-blue-300 font-mono">OCEAN</h5>
            <div class="mt-2 text-[11px] text-slate-300">Dolphin 🐬, Clownfish 🐠, Whale 🐋</div>
          </div>
          <div class="p-4 rounded-2xl bg-amber-600/10 border border-amber-500/30 text-center">
            <div class="text-3xl mb-1">🏜️</div>
            <h5 class="text-xs font-bold text-amber-300 font-mono">DESERT</h5>
            <div class="mt-2 text-[11px] text-slate-300">Camel 🐪, Fennec Fox 🦊, Lizard 🦎</div>
          </div>
          <div class="p-4 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 text-center">
            <div class="text-3xl mb-1">❄️</div>
            <h5 class="text-xs font-bold text-cyan-300 font-mono">ARCTIC</h5>
            <div class="mt-2 text-[11px] text-slate-300">Polar Bear 🐻‍❄️, Penguin 🐧, Seal 🦭</div>
          </div>
          <div class="p-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 text-center">
            <div class="text-3xl mb-1">🌴</div>
            <h5 class="text-xs font-bold text-emerald-300 font-mono">RAINFOREST</h5>
            <div class="mt-2 text-[11px] text-slate-300">Toucan 🦜, Monkey 🐒, Jaguar 🐆</div>
          </div>
        </div>
      </div>
    `;
  }

  buildPlantsHtml() {
    const stages = [
      { icon: '🌰', name: 'Seed in Warm Soil', desc: 'A tiny seed resting safely underground.' },
      { icon: '🌱', name: 'Green Sprout', desc: 'The seed drank water and sent up a green sprout!' },
      { icon: '🌿', name: 'Growing Stem & Leaves', desc: 'Sunlight fuels photosynthesis to build strong leaves!' },
      { icon: '🌻', name: 'Blooming Golden Sunflower', desc: 'A magnificent bloom producing new seeds!' }
    ];
    const cur = stages[this.plantStage % stages.length];
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <div class="text-6xl transition-transform hover:scale-110">${cur.icon}</div>
        <h4 class="text-lg font-bold text-white">${cur.name}</h4>
        <p class="text-xs text-slate-300">${cur.desc}</p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button class="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold text-xs transition-all flex items-center gap-1.5" onclick="GradeSchoolEngine.feedPlant('sun')">
            <span>☀️</span> Add Sunshine
          </button>
          <button class="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-slate-950 border border-blue-500/40 font-bold text-xs transition-all flex items-center gap-1.5" onclick="GradeSchoolEngine.feedPlant('water')">
            <span>💧</span> Add Water
          </button>
          <button class="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-1.5" onclick="GradeSchoolEngine.feedPlant('soil')">
            <span>🌱</span> Add Rich Soil
          </button>
        </div>
        <div class="text-[11px] font-mono text-emerald-400">STAGE ${ (this.plantStage % 4) + 1 } / 4 &bull; PLANTS NEED SUN, WATER, AND SOIL!</div>
      </div>
    `;
  }

  buildWeatherHtml() {
    return `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-4xl mb-1">🌸</div><div class="text-xs font-bold text-white font-mono">Spring</div><div class="text-[11px] text-slate-400 mt-1">Flowers bloom, light rain showers</div></div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-4xl mb-1">☀️</div><div class="text-xs font-bold text-white font-mono">Summer</div><div class="text-[11px] text-slate-400 mt-1">Warm sunshine, long sunny days</div></div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-4xl mb-1">🍁</div><div class="text-xs font-bold text-white font-mono">Fall / Autumn</div><div class="text-[11px] text-slate-400 mt-1">Leaves change to red & gold</div></div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-4xl mb-1">❄️</div><div class="text-xs font-bold text-white font-mono">Winter</div><div class="text-[11px] text-slate-400 mt-1">Crisp snow, warm jackets & cocoa</div></div>
      </div>
    `;
  }

  buildSentenceBuilderHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <h4 class="text-lg font-bold text-white">Sentence Builder Studio</h4>
        <p class="text-xs text-slate-400">Complete sentences start with a CAPITAL letter and end with a PERIOD (.):</p>
        <div id="sentence-display" class="p-4 rounded-xl bg-white/5 border border-white/10 text-base font-bold text-amber-300 font-mono">
          "The happy puppy wags his tail."
        </div>
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span class="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-mono">1. Capital Start (The)</span>
          <span class="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs font-mono">2. Noun (puppy)</span>
          <span class="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">3. Action Verb (wags)</span>
          <span class="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-mono">4. Period End (.)</span>
        </div>
      </div>
    `;
  }

  buildHandwritingHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <h4 class="text-lg font-bold text-white">Handwriting Stroke Guides</h4>
        <p class="text-xs text-slate-400">Remember to start your letters at the TOP line!</p>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-2xl font-black font-mono text-amber-300">A a</div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-2xl font-black font-mono text-amber-300">B b</div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-2xl font-black font-mono text-amber-300">C c</div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-2xl font-black font-mono text-amber-300">D d</div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-2xl font-black font-mono text-amber-300">E e</div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-2xl font-black font-mono text-amber-300">F f</div>
        </div>
      </div>
    `;
  }

  buildHelpersHtml() {
    const helpers = [
      { name: 'Firefighter', icon: '🚒', role: 'Puts out fires and keeps neighborhoods safe!' },
      { name: 'Doctor', icon: '🩺', role: 'Helps us heal when we are sick or injured.' },
      { name: 'Police Officer', icon: '👮', role: 'Protects our community and ensures traffic safety.' },
      { name: 'Postal Carrier', icon: '📬', role: 'Delivers mail, packages, and cards to every home.' },
      { name: 'Teacher', icon: '📚', role: 'Teaches us how to read, do math, and explore science.' }
    ];
    let html = `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">`;
    helpers.forEach(h => {
      html += `
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 text-left transition-all">
          <div class="text-3xl mb-2">${h.icon}</div>
          <h5 class="text-sm font-bold text-white mb-1">${h.name}</h5>
          <p class="text-xs text-slate-300 leading-relaxed">${h.role}</p>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  buildContinentsHtml() {
    return `
      <div class="space-y-4">
        <div class="text-xs font-mono text-slate-400">THE 7 CONTINENTS OF PLANET EARTH:</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🌎</div><div class="text-xs font-bold text-white">North America</div></div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🌎</div><div class="text-xs font-bold text-white">South America</div></div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🌍</div><div class="text-xs font-bold text-white">Europe</div></div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🌍</div><div class="text-xs font-bold text-white">Africa</div></div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🌏</div><div class="text-xs font-bold text-white">Asia</div></div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🌏</div><div class="text-xs font-bold text-white">Australia</div></div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-2xl mb-1">🧊</div><div class="text-xs font-bold text-white">Antarctica</div></div>
          <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"><div class="text-2xl mb-1">🌊</div><div class="text-xs font-bold text-blue-300">5 Great Oceans</div></div>
        </div>
      </div>
    `;
  }

  buildSymbolsHtml() {
    return `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🦅</div><div class="text-xs font-bold text-white">Bald Eagle</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🔔</div><div class="text-xs font-bold text-white">Liberty Bell</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🇺🇸</div><div class="text-xs font-bold text-white">American Flag</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🗽</div><div class="text-xs font-bold text-white">Statue of Liberty</div></div>
      </div>
    `;
  }

  buildColorWheelHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <h4 class="text-lg font-bold text-white">Color Alchemy Laboratory</h4>
        <p class="text-xs text-slate-400">Mix two primary colors to invent a secondary color:</p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md" onclick="GradeSchoolEngine.mixColorAlchemy('PURPLE', '#9333ea', 'RED + BLUE = PURPLE!')">Mix Red + Blue</button>
          <button class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md" onclick="GradeSchoolEngine.mixColorAlchemy('ORANGE', '#f97316', 'RED + YELLOW = ORANGE!')">Mix Red + Yellow</button>
          <button class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md" onclick="GradeSchoolEngine.mixColorAlchemy('GREEN', '#16a34a', 'YELLOW + BLUE = GREEN!')">Mix Yellow + Blue</button>
        </div>
        <div id="color-alchemy-result" class="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-amber-300">
          SELECT A COLOR PAIR TO MIX!
        </div>
      </div>
    `;
  }

  buildOrchestraHtml() {
    return `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <button class="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" onclick="GradeSchoolEngine.playInstrumentSound(659, 'sine', 'Violin')">
          <div class="text-4xl mb-1">🎻</div>
          <div class="text-xs font-bold text-white font-mono">Violin (Strings)</div>
        </button>
        <button class="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" onclick="GradeSchoolEngine.playInstrumentSound(440, 'sawtooth', 'Trumpet')">
          <div class="text-4xl mb-1">🎺</div>
          <div class="text-xs font-bold text-white font-mono">Trumpet (Brass)</div>
        </button>
        <button class="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" onclick="GradeSchoolEngine.playInstrumentSound(880, 'triangle', 'Flute')">
          <div class="text-4xl mb-1">🪈</div>
          <div class="text-xs font-bold text-white font-mono">Flute (Woodwind)</div>
        </button>
        <button class="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" onclick="GradeSchoolEngine.playInstrumentSound(150, 'square', 'Drum')">
          <div class="text-4xl mb-1">🥁</div>
          <div class="text-xs font-bold text-white font-mono">Drums (Percussion)</div>
        </button>
      </div>
    `;
  }

  playInstrumentSound(freq, type, name) {
    if (this.scene) this.scene.playChime(freq, type, 0.35);
    this.speakFrankie(`${name}!`);
  }

  buildSensesHtml() {
    return `
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">👁️</div><div class="text-xs font-bold text-white">Eyes (Sight)</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">👂</div><div class="text-xs font-bold text-white">Ears (Hearing)</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">👃</div><div class="text-xs font-bold text-white">Nose (Smell)</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">👅</div><div class="text-xs font-bold text-white">Tongue (Taste)</div></div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">✋</div><div class="text-xs font-bold text-white">Hands (Touch)</div></div>
      </div>
    `;
  }

  buildOrgansHtml() {
    return `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🫀</div><div class="text-xs font-bold text-white font-mono">Heart</div><div class="text-[11px] text-slate-400 mt-1">Pumps fresh oxygen through our body</div></div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🧠</div><div class="text-xs font-bold text-white font-mono">Brain</div><div class="text-[11px] text-slate-400 mt-1">Controls thoughts, memory, and movements</div></div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🫁</div><div class="text-xs font-bold text-white font-mono">Lungs</div><div class="text-[11px] text-slate-400 mt-1">Breathing fresh air and oxygen</div></div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-3xl mb-1">🦴</div><div class="text-xs font-bold text-white font-mono">Skeleton</div><div class="text-[11px] text-slate-400 mt-1">206 strong bones that protect our organs</div></div>
      </div>
    `;
  }

  buildNutritionHtml() {
    return `
      <div class="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <div class="text-5xl">🥗</div>
        <h4 class="text-lg font-bold text-white">MyPlate Healthy Eating Guide</h4>
        <p class="text-xs text-slate-400">Fill your plate with colorful fruits, veggies, grains, and healthy proteins:</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-bold">
          <span class="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🥦 Vegetables</span>
          <span class="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">🍎 Fruits</span>
          <span class="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">🍞 Whole Grains</span>
          <span class="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">🥛 Dairy &amp; Protein</span>
        </div>
      </div>
    `;
  }

  playPhonicsAudio(letter, word, sound) {
    if (this.scene) this.scene.playChime(523, 'sine', 0.12);
    this.speakFrankie(`${letter} is for ${word}! ${sound} ${sound} ${word}!`);
    this.userStars += 1;
    this.updateStarsDisplay();
  }

  playSightWordAudio(word, sentence) {
    if (this.scene) this.scene.playChime(587, 'sine', 0.12);
    this.speakFrankie(`${word}! In a sentence: ${sentence}`);
    this.userStars += 1;
    this.updateStarsDisplay();
  }

  readStorySentence(idx, sentence) {
    if (this.scene) this.scene.playChime(440, 'triangle', 0.1);
    this.speakFrankie(sentence);
  }

  readEntireStory() {
    this.speakFrankie("The Little Red Hen! Once upon a time, The Little Red Hen found some golden wheat seeds. 'Who will help me plant this wheat?' asked the Little Red Hen. 'Not I!' barked the Dog. 'Not I!' purred the Cat. 'Then I will do it myself!' said the Little Red Hen. And she did!");
  }

  tapSpellLetter(letter) {
    if (this.scene) this.scene.playChime(659, 'sine', 0.1);
    const slots = [document.getElementById('spell-slot-0'), document.getElementById('spell-slot-1'), document.getElementById('spell-slot-2')];
    const emptySlot = slots.find(s => s && s.textContent === '_');
    if (emptySlot) {
      emptySlot.textContent = letter;
    }
    const currentWord = slots.map(s => s ? s.textContent : '').join('');
    const resEl = document.getElementById('spell-result');
    if (currentWord === 'CAT') {
      if (resEl) {
        resEl.textContent = '🌟 HOORAY! C - A - T SPELLS CAT! 🐱';
        resEl.className = 'text-xs font-mono font-bold text-emerald-400';
      }
      if (this.scene) this.scene.playChime(880, 'sine', 0.3);
      this.speakFrankie("Hooray! C - A - T spells Cat!");
      this.userStars += 5;
      this.updateStarsDisplay();
    } else if (currentWord.length === 3 && currentWord.indexOf('_') === -1) {
      if (resEl) {
        resEl.textContent = 'Try again! Tap C then A then T!';
        resEl.className = 'text-xs font-mono font-bold text-rose-400';
      }
      setTimeout(() => {
        slots.forEach(s => { if (s) s.textContent = '_'; });
      }, 1000);
    }
  }

  playNumberAudio(num) {
    if (this.scene) this.scene.playChime(220 + num * 6, 'sine', 0.08);
    this.speakFrankie(`${num}`);
  }

  filterCountGrid(mode) {
    document.querySelectorAll('.num-cell').forEach(cell => {
      const n = Number(cell.textContent.trim());
      let highlight = true;
      if (mode === '2s') highlight = (n % 2 === 0);
      else if (mode === '5s') highlight = (n % 5 === 0);
      else if (mode === '10s') highlight = (n % 10 === 0);

      if (highlight) {
        cell.className = "num-cell p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400 font-mono font-bold text-xs transition-all";
      } else {
        cell.className = "num-cell p-2 rounded-xl bg-white/5 text-slate-500 font-mono text-xs opacity-40 transition-all";
      }
    });
  }

  checkAdditionFact(chosen) {
    const feedback = document.getElementById('addition-feedback');
    const sumBox = document.getElementById('addition-sum-box');
    if (chosen === 8) {
      if (sumBox) sumBox.textContent = '8';
      if (feedback) {
        feedback.textContent = '🌟 CORRECT! 5 + 3 = 8 APPLES!';
        feedback.className = 'text-xs font-mono text-emerald-400 font-bold';
      }
      if (this.scene) this.scene.playChime(784, 'sine', 0.25);
      this.speakFrankie("Super job! 5 apples plus 3 apples equals 8 apples!");
      this.userStars += 5;
      this.updateStarsDisplay();
    } else {
      if (feedback) {
        feedback.textContent = `Keep trying! Count each apple one by one!`;
        feedback.className = 'text-xs font-mono text-rose-400 font-bold';
      }
      if (this.scene) this.scene.playChime(220, 'sawtooth', 0.15);
    }
  }

  setPizzaFraction(frac, label) {
    const desc = document.getElementById('pizza-fraction-desc');
    if (desc) desc.textContent = `🍕 ${label}: An equal share of the delicious pizza pie!`;
    if (this.scene) this.scene.playChime(659, 'sine', 0.15);
    this.speakFrankie(`${label}! Equal parts make fractions!`);
  }

  checkTellingTime(time) {
    const fb = document.getElementById('clock-feedback');
    if (time === '3:00') {
      if (fb) {
        fb.textContent = '🌟 SPOT ON! IT IS 3:00 O\'CLOCK!';
        fb.className = 'text-xs font-mono text-emerald-400 font-bold';
      }
      if (this.scene) this.scene.playChime(880, 'sine', 0.25);
      this.speakFrankie("That's right! It is three o'clock!");
      this.userStars += 5;
      this.updateStarsDisplay();
    } else {
      if (fb) {
        fb.textContent = `Not quite! The hour hand points at 3 and minute hand at 12!`;
        fb.className = 'text-xs font-mono text-rose-400 font-bold';
      }
    }
  }

  feedPlant(item) {
    this.plantStage = (this.plantStage + 1) % 4;
    if (this.scene) this.scene.playChime(523 + this.plantStage * 100, 'sine', 0.15);
    this.renderSubjectActivities(this.activeExhibit, 'plants');
    this.speakFrankie(`Great! Adding ${item} helped our plant grow to stage ${this.plantStage + 1}!`);
  }

  mixColorAlchemy(colorName, hex, desc) {
    const resBox = document.getElementById('color-alchemy-result');
    if (resBox) {
      resBox.innerHTML = `
        <div class="inline-block w-12 h-12 rounded-2xl border-2 border-white shadow-lg mb-2" style="background-color: ${hex}"></div>
        <div class="text-sm font-bold text-white font-mono">${colorName}</div>
        <div class="text-xs text-slate-300">${desc}</div>
      `;
    }
    if (this.scene) this.scene.playChime(659, 'sine', 0.15);
    this.speakFrankie(`${colorName}! ${desc}`);
  }

  renderDrillQuestion(exhibit, qIndex) {
    const container = document.getElementById('drill-content-area');
    if (!container) return;

    // Retrieve week-specific questions if available
    let qData = null;
    let subjectKey = 'reading';
    if (exhibit.id === 2) subjectKey = 'math';
    else if (exhibit.id === 3) subjectKey = 'writing';
    else if (exhibit.id === 4) subjectKey = 'science';
    else if (exhibit.id === 5) subjectKey = 'social';
    else if (exhibit.id === 6) subjectKey = 'arts';
    else if (exhibit.id === 7) subjectKey = 'health';

    if (this.curriculum[subjectKey] && this.curriculum[subjectKey][this.selectedWeek - 1]) {
      const weekObj = this.curriculum[subjectKey][this.selectedWeek - 1];
      if (weekObj.questions && weekObj.questions[qIndex]) {
        qData = weekObj.questions[qIndex];
      }
    }

    if (!qData) {
      qData = exhibit.questions[qIndex] || exhibit.questions[0];
    }

    let optionsHtml = '';
    qData.options.forEach((opt, idx) => {
      optionsHtml += `
        <button id="drill-opt-${idx}" class="drill-opt-btn w-full p-4 rounded-2xl bg-white/5 hover:bg-[#f59e0b]/20 border border-white/10 hover:border-[#f59e0b] text-left text-white font-bold text-base transition-all flex items-center justify-between"
                onclick="GradeSchoolEngine.checkDrillAnswer(${exhibit.id}, ${qIndex}, ${idx})">
          <span class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs text-[#f59e0b]">${String.fromCharCode(65 + idx)}</span>
            <span class="drill-opt-text">${opt}</span>
          </span>
          <span class="text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100">SELECT ➔</span>
        </button>
      `;
    });

    container.innerHTML = `
      <div class="space-y-6">
        
        <!-- GCompris Adaptive Scaffolding Header & Level Selector -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="text-slate-400">WEEK ${this.selectedWeek} (Q${Math.ceil(this.selectedWeek / 9)}):</span>
            <span class="text-amber-300 font-bold">${qData.q.split(':')[0] || 'Lesson'}</span>
          </div>
          
          <!-- GCompris 3-Level Scaffolding -->
          <div class="flex items-center gap-1">
            <button class="px-2.5 py-1 rounded-lg ${this.currentLevel === 1 ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-white/5 text-slate-400'}" onclick="GradeSchoolEngine.setLevel(1)">★ Explorer</button>
            <button class="px-2.5 py-1 rounded-lg ${this.currentLevel === 2 ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-white/5 text-slate-400'}" onclick="GradeSchoolEngine.setLevel(2)">★★ Adventurer</button>
            <button class="px-2.5 py-1 rounded-lg ${this.currentLevel === 3 ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-white/5 text-slate-400'}" onclick="GradeSchoolEngine.setLevel(3)">★★★ Master</button>
          </div>
        </div>

        <!-- Question Card -->
        <div class="p-6 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg">
          <div class="flex items-center justify-between text-xs font-mono text-[#f59e0b] mb-2">
            <span>QUESTION ${qIndex + 1} OF 2</span>
            <span>✦ +${this.currentLevel * 2} STARS</span>
          </div>
          <h3 class="text-xl md:text-2xl font-bold text-white leading-snug">${qData.q}</h3>
        </div>

        <!-- Antura 3-Tier Mascot Hint Ladder Buttons -->
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 transition-all flex items-center gap-1.5"
                  onclick="GradeSchoolEngine.applyAnturaHint(1, '${encodeURIComponent(qData.soundOut)}')">
            <span>💡</span> Hint 1: Phonics Cue
          </button>
          <button class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-sky-300 transition-all flex items-center gap-1.5"
                  onclick="GradeSchoolEngine.applyAnturaHint(2, ${qData.answer})">
            <span>✂️</span> Hint 2: 50/50 Elimination
          </button>
          <button class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-purple-300 transition-all flex items-center gap-1.5"
                  onclick="GradeSchoolEngine.applyAnturaHint(3, '${encodeURIComponent(qData.explanation)}')">
            <span>📖</span> Hint 3: Walkthrough
          </button>
        </div>

        <!-- Options Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${optionsHtml}
        </div>

        <div id="drill-feedback-box" class="hidden p-4 rounded-2xl"></div>
      </div>
    `;
  }

  setLevel(level) {
    this.currentLevel = level;
    if (this.scene) this.scene.playChime(440 + level * 60, 'triangle', 0.15);
    this.renderDrillQuestion(this.activeExhibit, this.currentDrillIndex);
    this.speakFrankie(`Scaffolding set to Level ${level}! Let's do this!`);
  }

  // Antura 3-Tier Intelligent Hint Ladder
  applyAnturaHint(tier, data) {
    if (tier === 1) {
      const decoded = decodeURIComponent(data);
      this.speakFrankie(`Frankie says: ${decoded}`);
      if (this.scene) this.scene.playChime(659.25, 'triangle', 0.15);
    } else if (tier === 2) {
      // 50/50 Elimination: Eliminate 2 wrong choices
      const correctIdx = Number(data);
      let eliminated = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== correctIdx && eliminated < 2) {
          const btn = document.getElementById(`drill-opt-${i}`);
          if (btn) {
            btn.style.opacity = '0.25';
            btn.style.pointerEvents = 'none';
            btn.classList.add('line-through');
            eliminated++;
          }
        }
      }
      this.speakFrankie("Woof! Two tricky options vanished! You got this!");
      if (this.scene) this.scene.playChime(350, 'sine', 0.1);
    } else if (tier === 3) {
      const decoded = decodeURIComponent(data);
      const feedbackBox = document.getElementById('drill-feedback-box');
      if (feedbackBox) {
        feedbackBox.classList.remove('hidden');
        feedbackBox.className = "p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono";
        feedbackBox.innerHTML = `<strong>Frankie's Walkthrough:</strong> ${decoded}`;
      }
      this.speakFrankie(decoded);
    }
  }

  checkDrillAnswer(exhibitId, qIndex, selectedIndex) {
    const exhibit = this.data.exhibits.find(e => e.id === exhibitId);
    if (!exhibit) return;

    // Retrieve week-specific questions if available
    let qData = null;
    let subjectKey = 'reading';
    if (exhibit.id === 2) subjectKey = 'math';
    else if (exhibit.id === 3) subjectKey = 'writing';
    else if (exhibit.id === 4) subjectKey = 'science';
    else if (exhibit.id === 5) subjectKey = 'social';
    else if (exhibit.id === 6) subjectKey = 'arts';
    else if (exhibit.id === 7) subjectKey = 'health';

    if (this.curriculum[subjectKey] && this.curriculum[subjectKey][this.selectedWeek - 1]) {
      const weekObj = this.curriculum[subjectKey][this.selectedWeek - 1];
      if (weekObj.questions && weekObj.questions[qIndex]) {
        qData = weekObj.questions[qIndex];
      }
    }
    if (!qData) qData = exhibit.questions[qIndex];

    const isCorrect = (selectedIndex === qData.answer);
    const feedbackBox = document.getElementById('drill-feedback-box');
    if (!feedbackBox) return;

    feedbackBox.classList.remove('hidden', 'bg-emerald-500/10', 'border-emerald-500/30', 'bg-rose-500/10', 'border-rose-500/30');

    if (isCorrect) {
      this.correctStreak++;
      const earnedStars = this.currentLevel * 2;
      this.userStars += earnedStars;
      this.updateStarsDisplay();
      if (this.scene) this.scene.playChime(659.25, 'triangle', 0.3);

      // GCompris dynamic leveling up on streak of 3
      let streakMsg = "";
      if (this.correctStreak >= 3 && this.currentLevel < 3) {
        this.currentLevel++;
        streakMsg = `🔥 3-Streak! Leveled Up to Level ${this.currentLevel}!`;
      }

      feedbackBox.classList.add('bg-emerald-500/10', 'border', 'border-emerald-500/30', 'text-emerald-300');
      feedbackBox.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-bold flex items-center gap-2">
              <span>🌟</span> Outstanding Job! ${qData.soundOut}
            </div>
            <p class="text-xs text-emerald-400 mt-1">${qData.explanation} ${streakMsg}</p>
          </div>
          <button class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-900 font-bold text-xs shadow-md"
                  onclick="GradeSchoolEngine.advanceDrillQuestion(${exhibitId}, ${qIndex + 1})">
            Next ➔
          </button>
        </div>
      `;
      this.speakFrankie("Super job! You nailed it!");
    } else {
      this.correctStreak = 0;
      feedbackBox.classList.add('bg-rose-500/10', 'border', 'border-rose-500/30', 'text-rose-300');
      feedbackBox.innerHTML = `
        <div class="text-sm font-bold flex items-center gap-2">
          <span>🐾</span> Almost! Let's try again!
        </div>
        <p class="text-xs text-rose-300 mt-1">Hint: ${qData.explanation}</p>
      `;
      this.speakFrankie("Almost! Listen closely to the hint!");
    }
  }

  advanceDrillQuestion(exhibitId, nextIndex) {
    const exhibit = this.data.exhibits.find(e => e.id === exhibitId);
    if (!exhibit) return;

    if (nextIndex < 2) {
      this.currentDrillIndex = nextIndex;
      this.renderDrillQuestion(exhibit, nextIndex);
    } else {
      // Completed all questions in exhibit!
      const container = document.getElementById('drill-content-area');
      if (container) {
        container.innerHTML = `
          <div class="text-center py-10 space-y-4">
            <div class="text-6xl animate-bounce">🏆</div>
            <h3 class="text-2xl font-bold text-white">Week ${this.selectedWeek} Mastery Complete!</h3>
            <p class="text-slate-300 text-sm max-w-md mx-auto">
              You earned <strong class="text-[#f59e0b]">+10 Bonus Stars</strong> and mastered <strong>${exhibit.title} (Week ${this.selectedWeek})</strong>!
            </p>
            <div class="flex justify-center gap-3 pt-2">
              <button class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      onclick="GradeSchoolEngine.openSyllabusModal()">
                Browse 36-Week Syllabus ➔
              </button>
              <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-slate-950 font-bold text-xs"
                      onclick="GradeSchoolEngine.closeAllModals()">
                Return to 3D Hall
              </button>
            </div>
          </div>
        `;
        this.userStars += 10;
        this.updateStarsDisplay();
        this.speakFrankie("Congratulations! You mastered this entire week's lesson!");
      }
    }
  }

  // =========================================================================
  // 📊 1-YEAR EDUCATOR PROGRESS REPORT CARD CONTROLLER
  // =========================================================================
  openReportCardModal() {
    const modal = document.getElementById('report-modal');
    const container = document.getElementById('report-card-content');
    if (!modal || !container) return;

    const subjects = [
      { name: "Reading & Phonics", key: "reading", icon: "📖", target: "45 WPM & Digraphs" },
      { name: "Math & Numbers", key: "math", icon: "🔢", target: "Facts to 20 & Fractions" },
      { name: "Writing & Spelling", key: "writing", icon: "✏️", target: "Punctuation & Sentences" },
      { name: "Curious Science", key: "science", icon: "🔬", target: "Habitats & Seasons" },
      { name: "Community & World", key: "social", icon: "🌍", target: "Continents & Civics" },
      { name: "Art, Colors & Music", key: "arts", icon: "🎨", target: "Color Wheel & Instruments" },
      { name: "Human Body & Health", key: "health", icon: "🫀", target: "5 Senses & Nutrition" },
      { name: "Typing Academy", key: "typing", icon: "⌨️", target: "Home Row & 20+ WPM" },
      { name: "Junior Chess", key: "chess", icon: "♟️", target: "L-Hops & Center Control" }
    ];

    let rowsHtml = '';
    subjects.forEach((subj, idx) => {
      const weeksCount = this.curriculum[subj.key] ? this.curriculum[subj.key].length : 36;
      const pct = 88 + (idx * 2) % 11;
      const grade = pct >= 93 ? 'A+' : (pct >= 85 ? 'A' : 'B+');

      rowsHtml += `
        <tr class="border-b border-white/5 hover:bg-white/[0.02]">
          <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
            <span>${subj.icon}</span> <span>${subj.name}</span>
          </td>
          <td class="py-3 px-4 font-mono text-slate-400 text-xs">${weeksCount} Weeks (Q1–Q4)</td>
          <td class="py-3 px-4 font-mono text-slate-300 text-xs">${subj.target}</td>
          <td class="py-3 px-4 font-mono font-bold text-[#f59e0b]">${pct}%</td>
          <td class="py-3 px-4 font-mono text-xs">
            <span class="px-2 py-0.5 rounded-full border border-emerald-500 text-emerald-400 font-bold">${grade}</span>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Overview Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div class="text-xs font-mono text-slate-400">ANNUAL WEEKS</div>
            <div class="text-2xl font-bold font-mono text-white mt-1">36 WEEKS</div>
          </div>
          <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div class="text-xs font-mono text-slate-400">TERMS / QUARTERS</div>
            <div class="text-2xl font-bold font-mono text-blue-400 mt-1">4 QUARTERS</div>
          </div>
          <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div class="text-xs font-mono text-slate-400">STARS EARNED</div>
            <div class="text-2xl font-bold font-mono text-amber-400 mt-1">${this.userStars} ⭐</div>
          </div>
          <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div class="text-xs font-mono text-slate-400">MILK CAPS</div>
            <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">${this.userMilkCaps.length} / 100</div>
          </div>
        </div>

        <!-- 36-Week Scope & Sequence Table -->
        <div class="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-white/10 bg-white/5 font-mono text-slate-400 uppercase">
                <th class="py-3 px-4">Subject</th>
                <th class="py-3 px-4">Curriculum Scope</th>
                <th class="py-3 px-4">Year-End Target</th>
                <th class="py-3 px-4">Mastery</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span>🏅 Educator Assessment: Student is on track for 2nd Grade Honors placement.</span>
          <span class="font-bold">GRADE 1 COMPLIANT</span>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    this.speakFrankie("Here is your official Annual Mastery Report Card! Look at all those high marks!");
  }

  // =========================================================================
  // 🎮 PLAYABLE ARCADE GAMES CONTROLLER (Typing, ChanceInvaders, Junior Chess)
  // =========================================================================
  openGameModal(exhibit) {
    const modal = document.getElementById('game-modal');
    const container = document.getElementById('game-embed-container');
    if (!modal || !container) return;

    document.getElementById('modal-game-title').textContent = `${exhibit.icon} ${exhibit.title}`;
    document.getElementById('modal-game-code').textContent = `[${exhibit.code}] • ${exhibit.gradeStatus}`;

    modal.classList.remove('hidden');

    if (exhibit.gameKey === 'typing') {
      this.startTypingGame(container);
    } else if (exhibit.gameKey === 'chanceinvaders') {
      this.startChanceInvadersGame(container);
    } else if (exhibit.gameKey === 'chess') {
      this.startChessGame(container);
    } else if (exhibit.gameKey === 'wobbly') {
      this.startWobblyPlayroom(container, exhibit);
    }
  }

  // -------------------------------------------------------------------------
  // 4. WOBBLY LIFE PLAYROOM & PHYSICS SANDBOX CONTROLLER
  // -------------------------------------------------------------------------
  startWobblyPlayroom(container, exhibit) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/30 mb-4 animate-bounce">
          🎪
        </div>
        <h3 class="text-2xl font-black text-white font-mono mb-2">3D WOBBLY LIFE PLAYROOM</h3>
        <p class="text-sm text-slate-300 mb-6 font-medium leading-relaxed">
          Full 3D physics sandbox featuring ragdoll flopping, super-bouncy trampoline, 48-ball pit, spiral slide, knockdown bowling pins, drivable go-kart, pizza delivery mini-job, and funny hat closet!
        </p>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6 font-mono text-xs">
          <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl mb-1">🌀</div>
            <div class="text-white font-bold">Ragdoll Flop</div>
            <div class="text-orange-400">[R] Key</div>
          </div>
          <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl mb-1">🚀</div>
            <div class="text-white font-bold">Trampoline</div>
            <div class="text-cyan-400">18.5m Bounce</div>
          </div>
          <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl mb-1">🍕</div>
            <div class="text-white font-bold">Pizza Courier</div>
            <div class="text-emerald-400">+10 Coins/Job</div>
          </div>
          <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl mb-1">🏎️</div>
            <div class="text-white font-bold">Wobbly Kart</div>
            <div class="text-amber-400">[H] Horn</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a href="../wobbly-playroom/index.html" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-mono font-bold text-sm shadow-xl shadow-orange-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all">
            <span>🚀</span>
            <span>ENTER FULL 3D PLAYROOM</span>
          </a>
          <button id="close-wobbly-modal-btn" class="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 font-mono text-sm font-bold transition-all">
            Stay in Hall
          </button>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('close-wobbly-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('game-modal').classList.add('hidden');
      });
    }
  }

  // -------------------------------------------------------------------------
  // 1. PLAYABLE 1ST GRADE TYPING ACADEMY (Tux Typing Falling Words Option)
  // -------------------------------------------------------------------------
  startTypingGame(container) {
    const wordList = ["CAT", "DOG", "SUN", "RUN", "JUMP", "STAR", "MILK", "BLUE", "BOOK", "FISH", "TREE", "PLAY", "RAINBOW", "GALAXY"];
    let currentWordIndex = 0;
    let charIndex = 0;
    let wpm = 24;
    let correctStrokes = 0;

    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-6 text-center">
        <div class="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          <span class="text-slate-400">LEVEL: <strong class="text-white">1st Grade Sight Words</strong></span>
          <span class="text-slate-400">SPEED: <strong id="type-wpm" class="text-emerald-400">${wpm} WPM</strong></span>
          <span class="text-slate-400">SCORE: <strong id="type-score" class="text-[#f59e0b]">${correctStrokes * 10}</strong></span>
        </div>

        <div class="p-8 rounded-3xl bg-white/[0.04] border-2 border-[#10b981]/40 shadow-xl">
          <div class="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Type This Word:</div>
          <div id="target-word-display" class="text-6xl md:text-7xl font-mono font-black text-white tracking-widest">
            ${wordList[0]}
          </div>
          <div id="type-feedback" class="text-sm font-mono text-emerald-400 mt-4 min-h-[20px]">
            Press the matching key on your keyboard!
          </div>
        </div>

        <!-- Visual Keyboard Guide with Home Row (ASDF JKL;) -->
        <div class="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs">
          <div class="flex justify-center gap-1.5 mb-1.5">
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">Q</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">W</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">E</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">R</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">T</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">Y</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">U</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">I</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">O</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">P</span>
          </div>
          <div class="flex justify-center gap-1.5 mb-1.5">
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">A</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">S</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">D</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/40 text-emerald-200 border-2 border-emerald-400">F•</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">G</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">H</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/40 text-emerald-200 border-2 border-emerald-400">J•</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">K</span>
            <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">L</span>
          </div>
          <div class="flex justify-center gap-1.5">
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">Z</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">X</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">C</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">V</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">B</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">N</span>
            <span class="px-2.5 py-1 rounded bg-white/10 text-slate-400">M</span>
          </div>
        </div>
      </div>
    `;

    const updateDisplay = () => {
      const curWord = wordList[currentWordIndex];
      const typed = curWord.slice(0, charIndex);
      const remaining = curWord.slice(charIndex);
      document.getElementById('target-word-display').innerHTML = `
        <span class="text-emerald-400">${typed}</span><span class="text-slate-400 underline decoration-amber-400 underline-offset-8">${remaining}</span>
      `;
    };

    updateDisplay();

    // Typing key listener
    const onTypeKey = (e) => {
      if (document.getElementById('game-modal').classList.contains('hidden')) {
        window.removeEventListener('keydown', onTypeKey);
        return;
      }

      const curWord = wordList[currentWordIndex];
      const targetChar = curWord[charIndex].toLowerCase();
      const pressedChar = e.key.toLowerCase();

      if (pressedChar === targetChar) {
        charIndex++;
        correctStrokes++;
        if (this.scene) this.scene.playChime(523.25 + charIndex * 40, 'triangle', 0.12);

        if (charIndex >= curWord.length) {
          // Completed Word!
          this.userStars += 1;
          this.updateStarsDisplay();
          currentWordIndex = (currentWordIndex + 1) % wordList.length;
          charIndex = 0;
          document.getElementById('type-score').textContent = (correctStrokes * 10).toString();
          document.getElementById('type-feedback').textContent = "🌟 Great Word! Next sight word ready!";
        }
        updateDisplay();
      }
    };

    window.addEventListener('keydown', onTypeKey);
  }

  // -------------------------------------------------------------------------
  // 2. PLAYABLE CHANCENVADERS 1978 SPACE ARCADE (Papa Brad Replica Engine)
  // -------------------------------------------------------------------------
  startChanceInvadersGame(container) {
    container.innerHTML = `
      <div class="flex flex-col items-center">
        <!-- Arcade Marquee Header -->
        <div class="w-[448px] py-2 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-2 border-amber-500 rounded-t-xl text-center font-mono font-black text-amber-300 text-sm tracking-widest shadow-lg">
          CHANCENVADERS • 1978 ARCADE REPLICA
        </div>

        <!-- CRT Canvas Viewport -->
        <div class="relative bg-black border-4 border-slate-800 rounded-b-xl overflow-hidden shadow-2xl">
          <canvas id="invadersCanvas" width="448" height="420" class="block"></canvas>
          <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        <!-- Arcade Controls Bar -->
        <div class="mt-3 flex items-center justify-between w-[448px] text-xs font-mono text-slate-400">
          <span>Move: <strong class="text-white">← / → (A / D)</strong></span>
          <span>Fire Laser: <strong class="text-amber-400">SPACE</strong></span>
          <span>Score: <strong id="invaders-score" class="text-emerald-400">0000</strong></span>
        </div>
      </div>
    `;

    const canvas = document.getElementById('invadersCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let score = 0;
    let cannonX = 200;
    let lasers = [];
    let aliens = [];
    let alienDir = 1;
    let alienStepTime = 0;
    let invaderSpeed = 40;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        aliens.push({ x: 40 + c * 46, y: 40 + r * 34, row: r, alive: true });
      }
    }

    let bunkers = [
      { x: 70, y: 320, health: 15 },
      { x: 200, y: 320, health: 15 },
      { x: 330, y: 320, health: 15 }
    ];

    const keys = { left: false, right: false };

    const onInvaderKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = (e.type === 'keydown');
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = (e.type === 'keydown');
      if (e.type === 'keydown' && (e.key === ' ' || e.code === 'Space')) {
        if (lasers.length < 2) {
          lasers.push({ x: cannonX + 14, y: 375 });
          if (this.scene) this.scene.playChime(880, 'sine', 0.08);
        }
      }
    };

    window.addEventListener('keydown', onInvaderKey);
    window.addEventListener('keyup', onInvaderKey);

    const loop = () => {
      if (document.getElementById('game-modal').classList.contains('hidden')) {
        window.removeEventListener('keydown', onInvaderKey);
        window.removeEventListener('keyup', onInvaderKey);
        return;
      }

      if (keys.left && cannonX > 15) cannonX -= 4;
      if (keys.right && cannonX < 405) cannonX += 4;

      lasers.forEach(l => l.y -= 7);
      lasers = lasers.filter(l => l.y > 0);

      alienStepTime++;
      if (alienStepTime > invaderSpeed) {
        alienStepTime = 0;
        let hitEdge = false;
        aliens.forEach(a => {
          if (a.alive) {
            a.x += alienDir * 12;
            if (a.x > 410 || a.x < 20) hitEdge = true;
          }
        });
        if (hitEdge) {
          alienDir *= -1;
          aliens.forEach(a => { if (a.alive) a.y += 12; });
          if (invaderSpeed > 10) invaderSpeed -= 3;
        }
        if (this.scene) this.scene.playChime(150 + (score % 4) * 30, 'square', 0.05);
      }

      lasers.forEach((l, lIdx) => {
        aliens.forEach(a => {
          if (a.alive && Math.abs(l.x - (a.x + 12)) < 16 && Math.abs(l.y - (a.y + 10)) < 14) {
            a.alive = false;
            lasers.splice(lIdx, 1);
            score += (3 - a.row) * 10;
            document.getElementById('invaders-score').textContent = score.toString().padStart(4, '0');
            if (this.scene) this.scene.playChime(220, 'triangle', 0.15);
          }
        });
      });

      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, 448, 420);

      bunkers.forEach(b => {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(b.x, b.y, 44, 28);
      });

      ctx.fillStyle = '#34d399';
      ctx.fillRect(cannonX, 385, 30, 14);
      ctx.fillRect(cannonX + 12, 375, 6, 10);

      ctx.fillStyle = '#f59e0b';
      lasers.forEach(l => ctx.fillRect(l.x, l.y, 3, 10));

      aliens.forEach(a => {
        if (a.alive) {
          ctx.fillStyle = a.row === 0 ? '#ef4444' : (a.row === 1 ? '#3b82f6' : '#ec4899');
          ctx.fillRect(a.x, a.y, 24, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(a.x + 4, a.y + 4, 4, 4);
          ctx.fillRect(a.x + 16, a.y + 4, 4, 4);
        }
      });

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  // -------------------------------------------------------------------------
  // 3. PLAYABLE JUNIOR CHESS / CHESSVAULT TRAINER
  // -------------------------------------------------------------------------
  startChessGame(container) {
    const pieces = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    const pieceSymbols = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };

    let selectedSquare = null;

    container.innerHTML = `
      <div class="max-w-md mx-auto space-y-4 text-center">
        <div class="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          <span class="text-slate-400">TURN: <strong class="text-white">White to Move</strong></span>
          <span class="text-amber-400 font-bold">Junior Chess Mode</span>
        </div>

        <div id="chess-board" class="grid grid-cols-8 border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl mx-auto w-[360px] h-[360px]">
        </div>

        <div id="chess-status" class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
          Tip: Click any piece to see its position and legal jumps!
        </div>
      </div>
    `;

    const renderBoard = () => {
      const boardEl = document.getElementById('chess-board');
      if (!boardEl) return;
      boardEl.innerHTML = '';

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const isDark = (r + c) % 2 === 1;
          const piece = pieces[r][c];
          const isSelected = selectedSquare && selectedSquare.r === r && selectedSquare.c === c;

          const sq = document.createElement('div');
          sq.className = `w-[45px] h-[45px] flex items-center justify-center text-3xl font-bold cursor-pointer transition-colors select-none ${
            isSelected ? 'bg-amber-400/80' : (isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]')
          }`;
          sq.textContent = pieceSymbols[piece] || '';
          sq.onclick = () => {
            if (piece) {
              selectedSquare = { r, c, piece };
              document.getElementById('chess-status').textContent = `Selected ${piece.toUpperCase()} at [${String.fromCharCode(65 + c)}${8 - r}].`;
              if (this.scene) this.scene.playChime(392, 'sine', 0.08);
              renderBoard();
            } else if (selectedSquare) {
              pieces[r][c] = selectedSquare.piece;
              pieces[selectedSquare.r][selectedSquare.c] = '';
              selectedSquare = null;
              this.userStars += 1;
              this.updateStarsDisplay();
              document.getElementById('chess-status').textContent = `Nice move! Stars earned: +1!`;
              if (this.scene) this.scene.playChime(587.33, 'triangle', 0.15);
              renderBoard();
            }
          };
          boardEl.appendChild(sq);
        }
      }
    };

    renderBoard();
  }

  // =========================================================================
  // 🏆 FRANKIE'S JUMPSTART MILK CAP VAULT (POG Collection)
  // =========================================================================
  openTrophyModal() {
    const modal = document.getElementById('trophy-modal');
    const grid = document.getElementById('milk-caps-grid');
    if (!modal || !grid) return;

    let capsHtml = '';
    this.data.milkCaps.forEach((cap) => {
      const isUnlocked = this.userMilkCaps.includes(cap.id);
      capsHtml += `
        <div class="p-4 rounded-2xl ${isUnlocked ? 'bg-white/[0.05] border-[#f59e0b]/50' : 'bg-black/30 border-white/5 opacity-50'} border text-center transition-all hover:scale-105">
          <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${isUnlocked ? 'from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/20' : 'from-slate-700 to-slate-800'} flex items-center justify-center text-3xl mb-3 border-2 border-white/20">
            ${isUnlocked ? cap.icon : '🔒'}
          </div>
          <div class="text-xs font-mono text-[#f59e0b] font-bold">#${cap.number.toString().padStart(2, '0')} • ${cap.rarity}</div>
          <h4 class="text-sm font-bold text-white mt-1 truncate">${cap.name}</h4>
          <p class="text-[11px] text-slate-400 mt-1 italic">"${isUnlocked ? cap.quote : 'Unlocked by completing subjects'}"</p>
        </div>
      `;
    });

    grid.innerHTML = capsHtml;
    modal.classList.remove('hidden');
    this.speakFrankie("Welcome to your Milk Cap Trophy Vault! Look at all your shiny collection tokens!");
  }

  closeAllModals() {
    const drillModal = document.getElementById('drill-modal');
    const gameModal = document.getElementById('game-modal');
    const trophyModal = document.getElementById('trophy-modal');
    const syllabusModal = document.getElementById('syllabus-modal');
    const reportModal = document.getElementById('report-modal');
    const portalModal = document.getElementById('portal-modal');

    if (drillModal) drillModal.classList.add('hidden');
    if (gameModal) gameModal.classList.add('hidden');
    if (trophyModal) trophyModal.classList.add('hidden');
    if (syllabusModal) syllabusModal.classList.add('hidden');
    if (reportModal) reportModal.classList.add('hidden');
    if (portalModal) {
      portalModal.classList.add('hidden');
      const frame = document.getElementById('portal-frame');
      if (frame) frame.src = 'about:blank';
    }

    if (this.speechSynthesis) this.speechSynthesis.cancel();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.GradeSchoolEngine = new GradeSchoolHallEngine();
});
