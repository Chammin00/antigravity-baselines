/**
 * 🎪 Wobbly Playroom 3D - Interactive Engine, Ragdoll Kinematics & Audio Synthesizer
 * 
 * Features:
 * - Wobbly Jellybean Ragdoll Kinematics (noodle limbs, rubbery spine sway, googly eyes tracking)
 * - Super Bouncy Trampoline Physics (18.5m vertical spring leap!)
 * - Dynamic Ball Pit scattering physics with 48 rolling spheres
 * - Swirly Slide spiral descent kinematics
 * - Bowling Pin scatter & strike detection
 * - Drivable Wobbly Kart (driving physics, wheel rotation, drifting & horn)
 * - Toy Grab & Throw physics system (12 toys with ballistic trajectories)
 * - Wobbly Ragdoll Flop & Tumble recovery state machine
 * - Wobbly Pizza / Toy Courier Mini-Job with coin economy & timer
 * - Procedural Web Audio API sound synthesizer
 */

class WobblyPlayroomEngine {
  constructor(sceneInstance) {
    this.scene = sceneInstance;
    this.camera = sceneInstance.camera;

    // Movement & RPG State
    this.playerPos = new THREE.Vector3(0, 0, 10);
    this.playerVelocity = new THREE.Vector3(0, 0, 0);
    this.playerRotation = 0; // Radians, 0 faces -Z into playroom
    this.bankAngle = 0;
    this.wobbleAngleX = 0;
    this.wobbleAngleZ = 0;

    // Speed tiers
    this.walkSpeed = 5.6;
    this.sprintSpeed = 9.8;
    this.turnSpeed = 3.2;
    this.accel = 26.0;
    this.friction = 0.82;
    this.isRunning = false;

    // Jump & Vertical Arc
    this.isGrounded = true;
    this.jumpForce = 5.8;
    this.gravity = 16.0;
    this.verticalVelocity = 0;
    this.squashStretchY = 1.0;

    // Ragdoll Flop State
    this.isFlopped = false;
    this.flopTimer = 0;

    // Sliding State
    this.isSliding = false;
    this.slideProgress = 0;

    // Vehicle / Kart State
    this.isDrivingKart = false;
    this.kartSpeed = 0;
    this.kartHeading = 0;

    // Toy Grab & Throw State
    this.heldToy = null;
    this.closestToy = null;

    // Mini-Job Delivery Economy
    this.wobblyCoins = 250;
    this.deliveryActive = false;
    this.deliveryTimeRemaining = 35;
    this.activeDeliveryTarget = new THREE.Vector3(0, 0, 16);

    // Animation & Secondary Motion
    this.walkAnimTime = 0;
    this.idleTime = 0;
    this.targetFov = 52;
    this.lastFootstepTime = 0;

    // Input Keys
    this.keys = {
      w: false, s: false, a: false, d: false,
      Shift: false, e: false, ' ': false,
      g: false, f: false, r: false, h: false, v: false,
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
    };

    // Web Audio Synthesizer
    this.audioCtx = null;
    this.isAudioMuted = false;

    this.init();
  }

  init() {
    this.initAudioSynthesizer();
    this.initKeyboardControls();
    this.initActionButtons();
    this.initHatSelector();
    this.updateCoinsHUD();
  }

  /* =========================================================================
     1. PROCEDURAL WEB AUDIO SYNTHESIZER (Web Audio API)
     ========================================================================= */
  initAudioSynthesizer() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  ensureAudioRunning() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSqueakFootstep() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // High goofy rubber shoe squeak!
    const baseFreq = 420 + Math.random() * 220;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 180, now + 0.05);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playSpringBoing() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.45);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playPopPickup() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playThrowWhoosh() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playFlopSquish() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playKartHorn() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    [349.23, 440.0].forEach((freq) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  playBowlingStrike() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.45);
    });
  }

  playCoinChime() {
    if (this.isAudioMuted || !this.audioCtx) return;
    this.ensureAudioRunning();

    const now = this.audioCtx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.38);
    });
  }

  /* =========================================================================
     2. INPUT & KEYBOARD CONTROLS
     ========================================================================= */
  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.ensureAudioRunning();
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.w = true; break;
        case 'KeyS': case 'ArrowDown': this.keys.s = true; break;
        case 'KeyA': case 'ArrowLeft': this.keys.a = true; break;
        case 'KeyD': case 'ArrowRight': this.keys.d = true; break;
        case 'ShiftLeft': case 'ShiftRight':
          this.keys.Shift = true;
          this.updateRunButtonUI();
          break;

        // RPG Jump
        case 'Space':
          e.preventDefault();
          this.triggerJump();
          break;

        // Vehicle Enter/Exit
        case 'KeyE':
          this.toggleKartDrive();
          break;

        // Grab Nearest Toy
        case 'KeyG':
          this.handleGrab();
          break;

        // Throw Carried Toy
        case 'KeyF':
          this.handleThrow();
          break;

        // Wobbly Flop / Ragdoll Tumble
        case 'KeyR':
          this.triggerFlop();
          break;

        // Kart Horn
        case 'KeyH':
          if (this.isDrivingKart) this.playKartHorn();
          break;

        // 3rd / 1st Person Camera
        case 'KeyV':
          this.toggleViewMode();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.w = false; break;
        case 'KeyS': case 'ArrowDown': this.keys.s = false; break;
        case 'KeyA': case 'ArrowLeft': this.keys.a = false; break;
        case 'KeyD': case 'ArrowRight': this.keys.d = false; break;
        case 'ShiftLeft': case 'ShiftRight':
          this.keys.Shift = false;
          this.updateRunButtonUI();
          break;
      }
    });
  }

  /* =========================================================================
     3. ON-SCREEN ACTION BUTTONS
     ========================================================================= */
  initActionButtons() {
    // 1. RUN Button
    const runBtn = document.getElementById('wobbly-run-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => this.toggleRun());
    }

    // 2. JUMP Button
    const jumpBtn = document.getElementById('wobbly-jump-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => this.triggerJump());
    }

    // 3. GRAB / THROW Button
    const grabBtn = document.getElementById('wobbly-grab-btn');
    if (grabBtn) {
      grabBtn.addEventListener('click', () => {
        if (this.heldToy) {
          this.handleThrow();
        } else {
          this.handleGrab();
        }
      });
    }

    // 4. FLOP / WOBBLE Button
    const flopBtn = document.getElementById('wobbly-flop-btn');
    if (flopBtn) {
      flopBtn.addEventListener('click', () => this.triggerFlop());
    }

    // 5. RIDE KART Button
    const kartBtn = document.getElementById('wobbly-kart-btn');
    if (kartBtn) {
      kartBtn.addEventListener('click', () => this.toggleKartDrive());
    }

    // 6. Camera View Toggle Button
    const viewBtn = document.getElementById('wobbly-view-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => this.toggleViewMode());
    }

    // 7. Audio Mute Toggle Button
    const audioBtn = document.getElementById('wobbly-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        this.isAudioMuted = !this.isAudioMuted;
        audioBtn.innerHTML = this.isAudioMuted ? '🔇 Audio Muted' : '🔊 Audio On';
        audioBtn.classList.toggle('text-rose-400', this.isAudioMuted);
      });
    }
  }

  initHatSelector() {
    const hatButtons = document.querySelectorAll('.hat-select-btn');
    hatButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hatType = btn.dataset.hat;
        if (this.scene) {
          this.scene.setHat(hatType);
          this.playPopPickup();
        }
        hatButtons.forEach((b) => b.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-500/20'));
        btn.classList.add('ring-2', 'ring-amber-400', 'bg-amber-500/20');
      });
    });
  }

  /* =========================================================================
     4. GAME MECHANICS & CONTROLS
     ========================================================================= */
  triggerJump() {
    if (!this.isGrounded || this.isFlopped || this.isDrivingKart) return;

    this.isGrounded = false;
    this.verticalVelocity = this.jumpForce;
    this.squashStretchY = 1.35; // Goofy stretch on launch
    this.playSpringBoing();
    this.scene.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.3);

    // Tactile button bounce
    const jumpBtn = document.getElementById('wobbly-jump-btn');
    if (jumpBtn) {
      jumpBtn.classList.add('scale-90', 'ring-2', 'ring-cyan-400');
      setTimeout(() => jumpBtn.classList.remove('scale-90', 'ring-2', 'ring-cyan-400'), 180);
    }
  }

  toggleRun() {
    this.isRunning = !this.isRunning;
    this.updateRunButtonUI();
    return this.isRunning;
  }

  setRunState(active) {
    this.isRunning = Boolean(active);
    this.updateRunButtonUI();
  }

  updateRunButtonUI() {
    const btn = document.getElementById('wobbly-run-btn');
    const icon = document.getElementById('wobbly-run-icon');
    const label = document.getElementById('wobbly-run-label');
    if (!btn) return;

    const active = this.isRunning || this.keys.Shift;
    if (active) {
      btn.classList.add('bg-amber-500/30', 'border-amber-400', 'text-amber-300', 'shadow-amber-500/30');
      btn.classList.remove('bg-white/5', 'text-slate-200');
      if (icon) icon.textContent = '🏃';
      if (label) label.textContent = 'WOBBLY SPRINT!';
    } else {
      btn.classList.remove('bg-amber-500/30', 'border-amber-400', 'text-amber-300', 'shadow-amber-500/30');
      btn.classList.add('bg-white/5', 'text-slate-200');
      if (icon) icon.textContent = '⚡';
      if (label) label.textContent = 'RUN [Shift]';
    }
  }

  triggerFlop() {
    if (this.isDrivingKart) return;
    this.isFlopped = true;
    this.flopTimer = 1.4;
    this.playFlopSquish();
    this.scene.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.5);
  }

  toggleKartDrive() {
    const kart = this.scene.wobblyKart;
    if (!kart) return;

    if (this.isDrivingKart) {
      // Dismount Kart
      this.isDrivingKart = false;
      this.playerPos.set(kart.position.x + 1.8, 0, kart.position.z);
      this.scene.avatarMesh.visible = (this.viewMode === '3rd');
      this.scene.avatarMesh.position.copy(this.playerPos);
      this.updateKartButtonUI(false);
      this.playPopPickup();
    } else {
      // Check proximity to kart
      const dist = this.playerPos.distanceTo(kart.position);
      if (dist < 2.8) {
        this.isDrivingKart = true;
        this.updateKartButtonUI(true);
        this.playKartHorn();
      }
    }
  }

  updateKartButtonUI(isDriving) {
    const btn = document.getElementById('wobbly-kart-btn');
    if (!btn) return;
    if (isDriving) {
      btn.classList.add('bg-rose-500/30', 'border-rose-400', 'text-rose-300');
      btn.classList.remove('bg-white/5', 'text-slate-200');
      btn.innerHTML = '<span>🚪</span> <span>EXIT KART [E]</span>';
    } else {
      btn.classList.remove('bg-rose-500/30', 'border-rose-400', 'text-rose-300');
      btn.classList.add('bg-white/5', 'text-slate-200');
      btn.innerHTML = '<span>🏎️</span> <span>RIDE KART [E]</span>';
    }
  }

  handleGrab() {
    if (this.heldToy || this.isDrivingKart) return;

    let nearest = null;
    let nearestDist = 2.4;

    this.scene.grabbableToys.forEach((toy) => {
      const dist = this.playerPos.distanceTo(toy.position);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = toy;
      }
    });

    if (nearest) {
      this.heldToy = nearest;
      this.heldToy.userData.isHeld = true;
      this.scene.heldItemPivot.add(this.heldToy);
      this.heldToy.position.set(0, 0, 0);
      this.heldToy.rotation.set(0, 0, 0);
      this.playPopPickup();

      // Check if toy is a delivery parcel or pizza box
      if (nearest.userData.type === 'pizza' || nearest.userData.type === 'parcel') {
        this.startDeliveryJob(nearest);
      }

      this.updateGrabButtonUI(true);
    }
  }

  handleThrow() {
    if (!this.heldToy) return;

    const toy = this.heldToy;
    this.scene.heldItemPivot.remove(toy);
    this.scene.scene.add(toy);

    // Ballistic throw trajectory
    toy.position.set(
      this.playerPos.x - Math.sin(this.playerRotation) * 0.8,
      this.playerPos.y + 1.4,
      this.playerPos.z - Math.cos(this.playerRotation) * 0.8
    );

    const throwSpeed = 14.0;
    toy.userData.velocity.set(
      -Math.sin(this.playerRotation) * throwSpeed,
      6.5,
      -Math.cos(this.playerRotation) * throwSpeed
    );
    toy.userData.angularVel.set(
      (Math.random() - 0.5) * 8.0,
      Math.random() * 6.0,
      (Math.random() - 0.5) * 8.0
    );
    toy.userData.isHeld = false;

    this.heldToy = null;
    this.playThrowWhoosh();
    this.updateGrabButtonUI(false);
  }

  updateGrabButtonUI(isHolding) {
    const btn = document.getElementById('wobbly-grab-btn');
    if (!btn) return;
    if (isHolding) {
      btn.classList.add('bg-emerald-500/30', 'border-emerald-400', 'text-emerald-300');
      btn.innerHTML = '<span>🎯</span> <span>THROW [F]</span>';
    } else {
      btn.classList.remove('bg-emerald-500/30', 'border-emerald-400', 'text-emerald-300');
      btn.innerHTML = '<span>🤹</span> <span>GRAB [G]</span>';
    }
  }

  startDeliveryJob(toy) {
    this.deliveryActive = true;
    this.deliveryTimeRemaining = 35;
    const hud = document.getElementById('delivery-hud');
    if (hud) hud.classList.remove('hidden');
    const desc = document.getElementById('delivery-desc');
    if (desc) desc.textContent = `Deliver the ${toy.userData.name} to the Golden Dropzone!`;
  }

  completeDeliveryJob() {
    this.deliveryActive = false;
    this.wobblyCoins += 100;
    this.updateCoinsHUD();

    const hud = document.getElementById('delivery-hud');
    if (hud) hud.classList.add('hidden');

    this.playCoinChime();
    this.scene.spawnCoinStars(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
  }

  updateCoinsHUD() {
    const el = document.getElementById('wobbly-coins-val');
    if (el) el.textContent = `$${this.wobblyCoins}`;
  }

  setViewMode(mode) {
    if (mode !== '1st' && mode !== '3rd') return;
    this.viewMode = mode;
    this.scene.viewMode = mode;
    if (this.scene.avatarMesh) {
      this.scene.avatarMesh.visible = (this.viewMode === '3rd' && !this.isDrivingKart);
    }
    const label = document.getElementById('wobbly-view-label');
    if (label) {
      label.textContent = this.viewMode === '3rd' ? '3rd Person' : '1st Person';
    }
  }

  toggleViewMode() {
    this.setViewMode(this.viewMode === '3rd' ? '1st' : '3rd');
  }

  /* =========================================================================
     5. MAIN PHYSICS & ANIMATION TICK
     ========================================================================= */
  update() {
    const dt = Math.min(this.scene.clock.getDelta(), 0.1);

    if (this.isDrivingKart) {
      this.updateKartPhysics(dt);
    } else if (this.isFlopped) {
      this.updateFlopPhysics(dt);
    } else {
      this.updateCharacterMovement(dt);
    }

    this.updateToyPhysics(dt);
    this.updateBallPitPhysics(dt);
    this.updateBowlingPhysics(dt);
    this.updateTrampolineCheck();
    this.updateDeliveryCheck(dt);
    this.updateCamera(dt);
  }

  updateCharacterMovement(dt) {
    let moveZ = 0;
    let turn = 0;

    if (this.keys.w || this.keys.ArrowUp) moveZ -= 1;
    if (this.keys.s || this.keys.ArrowDown) moveZ += 1;
    if (this.keys.a || this.keys.ArrowLeft) turn += 1;
    if (this.keys.d || this.keys.ArrowRight) turn -= 1;

    const isSprinting = (this.keys.Shift || this.isRunning) && moveZ !== 0;
    const currentMaxSpeed = isSprinting ? this.sprintSpeed : this.walkSpeed;
    this.targetFov = isSprinting ? 62 : 52;

    // 1. Steering & Turn Lean
    if (turn !== 0) {
      this.playerRotation += turn * this.turnSpeed * dt;
      const targetBank = -turn * 0.16 * (isSprinting ? 1.5 : 1.0);
      this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, targetBank, 0.16);
    } else {
      this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, 0, 0.16);
    }

    // 2. Velocity Kinematics & Inertia
    if (moveZ !== 0) {
      const forwardX = -Math.sin(this.playerRotation) * (-moveZ) * currentMaxSpeed;
      const forwardZ = -Math.cos(this.playerRotation) * (-moveZ) * currentMaxSpeed;

      this.playerVelocity.x = THREE.MathUtils.lerp(this.playerVelocity.x, forwardX, this.accel * dt);
      this.playerVelocity.z = THREE.MathUtils.lerp(this.playerVelocity.z, forwardZ, this.accel * dt);
    } else {
      this.playerVelocity.x *= this.friction;
      this.playerVelocity.z *= this.friction;
    }

    // 3. Jump Physics & Vertical Gravity Arc
    if (!this.isGrounded) {
      this.verticalVelocity -= this.gravity * dt;
      this.playerPos.y += this.verticalVelocity * dt;

      if (this.playerPos.y <= 0) {
        this.playerPos.y = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
        this.squashStretchY = 0.78; // Bouncy squash on impact
        this.scene.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.4);
        this.playSqueakFootstep();
      }
    } else {
      this.squashStretchY = THREE.MathUtils.lerp(this.squashStretchY, 1.0, 0.2);
    }

    // Apply Boundaries (Playroom perimeter: X: -25 to 25, Z: -20 to 20)
    const nextX = this.playerPos.x + this.playerVelocity.x * dt;
    const nextZ = this.playerPos.z + this.playerVelocity.z * dt;

    if (Math.abs(nextX) < 25.5) this.playerPos.x = nextX;
    if (Math.abs(nextZ) < 20.5) this.playerPos.z = nextZ;

    // 4. Wobbly Ragdoll Limb & Spine Physics
    const speedMag = Math.sqrt(this.playerVelocity.x * this.playerVelocity.x + this.playerVelocity.z * this.playerVelocity.z);
    const isMoving = speedMag > 0.4;

    if (isMoving) {
      this.idleTime = 0;
      const animRate = isSprinting ? 22 : 14;
      this.walkAnimTime += dt * animRate;

      // Rubbery noodle leg swing
      const swing = Math.sin(this.walkAnimTime) * (isSprinting ? 0.75 : 0.52);
      if (this.scene.leftLeg) this.scene.leftLeg.rotation.x = swing;
      if (this.scene.rightLeg) this.scene.rightLeg.rotation.x = -swing;

      // Noodle arm swing (wild flailing if sprinting or carrying)
      if (this.heldToy) {
        // Arms up holding item overhead
        if (this.scene.leftArm) this.scene.leftArm.rotation.x = 2.4;
        if (this.scene.rightArm) this.scene.rightArm.rotation.x = 2.4;
      } else {
        const armFlail = isSprinting ? 1.1 : 0.7;
        if (this.scene.leftArm) this.scene.leftArm.rotation.x = -swing * armFlail;
        if (this.scene.rightArm) this.scene.rightArm.rotation.x = swing * armFlail;
        if (this.scene.leftArm) this.scene.leftArm.rotation.z = Math.sin(this.walkAnimTime * 2) * 0.25;
        if (this.scene.rightArm) this.scene.rightArm.rotation.z = -Math.sin(this.walkAnimTime * 2) * 0.25;
      }

      // Procedural Wobbly Spine/Head Sway
      this.wobbleAngleX = Math.sin(this.walkAnimTime * 2) * (isSprinting ? 0.22 : 0.12);
      this.wobbleAngleZ = Math.cos(this.walkAnimTime) * (isSprinting ? 0.18 : 0.09);

      // Footstep audio cadence & dust
      const now = performance.now();
      const interval = isSprinting ? 220 : 340;
      if (now - this.lastFootstepTime > interval) {
        this.lastFootstepTime = now;
        this.playSqueakFootstep();
        this.scene.spawnDustPuff(this.playerPos.x, this.playerPos.z, isSprinting ? 1.2 : 0.7);
      }
    } else {
      this.idleTime += dt;
      const breathe = Math.sin(this.idleTime * 3.0) * 0.03;
      this.wobbleAngleX = THREE.MathUtils.lerp(this.wobbleAngleX, breathe, 0.15);
      this.wobbleAngleZ = THREE.MathUtils.lerp(this.wobbleAngleZ, 0, 0.15);

      if (this.scene.leftLeg) this.scene.leftLeg.rotation.x = THREE.MathUtils.lerp(this.scene.leftLeg.rotation.x, 0, 0.2);
      if (this.scene.rightLeg) this.scene.rightLeg.rotation.x = THREE.MathUtils.lerp(this.scene.rightLeg.rotation.x, 0, 0.2);

      if (this.heldToy) {
        if (this.scene.leftArm) this.scene.leftArm.rotation.x = 2.4;
        if (this.scene.rightArm) this.scene.rightArm.rotation.x = 2.4;
      } else {
        if (this.scene.leftArm) this.scene.leftArm.rotation.x = THREE.MathUtils.lerp(this.scene.leftArm.rotation.x, 0, 0.2);
        if (this.scene.rightArm) this.scene.rightArm.rotation.x = THREE.MathUtils.lerp(this.scene.rightArm.rotation.x, 0, 0.2);
      }
    }

    // Midair flail
    if (!this.isGrounded) {
      if (this.scene.leftLeg) this.scene.leftLeg.rotation.x = -0.5;
      if (this.scene.rightLeg) this.scene.rightLeg.rotation.x = 0.5;
      if (!this.heldToy) {
        if (this.scene.leftArm) this.scene.leftArm.rotation.x = 1.8;
        if (this.scene.rightArm) this.scene.rightArm.rotation.x = 1.8;
      }
    }

    // 5. Update Avatar Mesh
    if (this.scene.avatarMesh) {
      this.scene.avatarMesh.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);
      this.scene.avatarMesh.rotation.y = this.playerRotation;
      this.scene.avatarMesh.rotation.z = this.bankAngle + this.wobbleAngleZ;
      this.scene.avatarMesh.rotation.x = this.wobbleAngleX;

      if (this.scene.avatarRoot) {
        this.scene.avatarRoot.scale.set(
          1.0 / Math.sqrt(this.squashStretchY),
          this.squashStretchY,
          1.0 / Math.sqrt(this.squashStretchY)
        );
      }

      if (this.scene.nameplateMesh) {
        this.scene.nameplateMesh.lookAt(this.camera.position);
      }
    }

    // 6. Googly Eyes Tracking (Pupils physically look towards camera or motion)
    if (this.scene.pupilL && this.scene.pupilR) {
      const eyeWobble = Math.sin(this.walkAnimTime * 3) * 0.02;
      this.scene.pupilL.position.x = -0.14 + eyeWobble;
      this.scene.pupilR.position.x = 0.14 + eyeWobble;
    }
  }

  updateFlopPhysics(dt) {
    this.flopTimer -= dt;

    // Tumble and roll across floor
    this.playerPos.x += this.playerVelocity.x * dt * 0.6;
    this.playerPos.z += this.playerVelocity.z * dt * 0.6;
    this.playerVelocity.x *= 0.94;
    this.playerVelocity.z *= 0.94;

    if (this.scene.avatarMesh) {
      this.scene.avatarMesh.position.set(this.playerPos.x, 0.25, this.playerPos.z);
      this.scene.avatarMesh.rotation.z += dt * 6.0; // Rolling roll
      this.scene.avatarMesh.rotation.x = Math.PI / 2;
    }

    // Recover from flop
    if (this.flopTimer <= 0) {
      this.isFlopped = false;
      this.squashStretchY = 1.4; // Elastic rebound pop
      this.playSpringBoing();
      this.scene.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.3);
    }
  }

  updateKartPhysics(dt) {
    const kart = this.scene.wobblyKart;
    if (!kart) return;

    let steer = 0;
    let throttle = 0;

    if (this.keys.w || this.keys.ArrowUp) throttle += 1;
    if (this.keys.s || this.keys.ArrowDown) throttle -= 1;
    if (this.keys.a || this.keys.ArrowLeft) steer += 1;
    if (this.keys.d || this.keys.ArrowRight) steer -= 1;

    const maxSpeed = 16.0;
    const accel = 24.0;
    const drag = 0.94;

    // Steer
    if (steer !== 0 && Math.abs(kart.userData.speed) > 0.5) {
      kart.userData.heading += steer * 2.8 * dt * (kart.userData.speed > 0 ? 1 : -1);
      kart.rotation.y = kart.userData.heading;
    }

    // Throttle & Braking
    if (throttle !== 0) {
      kart.userData.speed += throttle * accel * dt;
      kart.userData.speed = Math.max(-maxSpeed * 0.5, Math.min(maxSpeed, kart.userData.speed));
    } else {
      kart.userData.speed *= drag;
    }

    // Apply Velocity
    const fX = -Math.sin(kart.userData.heading) * kart.userData.speed * dt;
    const fZ = -Math.cos(kart.userData.heading) * kart.userData.speed * dt;
    kart.position.x += fX;
    kart.position.z += fZ;

    // Boundaries clamping
    kart.position.x = Math.max(-25.0, Math.min(25.0, kart.position.x));
    kart.position.z = Math.max(-20.0, Math.min(20.0, kart.position.z));

    // Rotate Wheels
    if (this.scene.kartWheels) {
      const wheelRot = (kart.userData.speed / 0.3) * dt;
      this.scene.kartWheels.forEach((w) => {
        w.children[0].rotation.x += wheelRot;
      });
    }

    // Sync player position with kart
    this.playerPos.copy(kart.position);
    this.playerRotation = kart.userData.heading;
    if (this.scene.avatarMesh) {
      this.scene.avatarMesh.visible = false; // Player is inside kart
    }

    // Kart suspension wobble
    kart.rotation.z = THREE.MathUtils.lerp(kart.rotation.z, -steer * 0.12, 0.2);
  }

  updateToyPhysics(dt) {
    this.scene.grabbableToys.forEach((toy) => {
      if (toy.userData.isHeld) return;

      const v = toy.userData.velocity;
      const av = toy.userData.angularVel;

      // Apply Gravity
      v.y -= 16.0 * dt;

      toy.position.addScaledVector(v, dt);
      toy.rotation.x += av.x * dt;
      toy.rotation.y += av.y * dt;
      toy.rotation.z += av.z * dt;

      // Floor bounce collision
      const radius = 0.3;
      if (toy.position.y <= radius) {
        toy.position.y = radius;
        if (Math.abs(v.y) > 1.2) {
          v.y = -v.y * 0.55; // Bouncy restitution
          this.scene.spawnDustPuff(toy.position.x, toy.position.z, 0.6);
        } else {
          v.y = 0;
        }
        v.x *= 0.85;
        v.z *= 0.85;
        av.multiplyScalar(0.85);
      }

      // Walls clamping
      toy.position.x = Math.max(-25.5, Math.min(25.5, toy.position.x));
      toy.position.z = Math.max(-20.5, Math.min(20.5, toy.position.z));
    });
  }

  updateBallPitPhysics(dt) {
    const pitCenter = new THREE.Vector3(14, 0, -8);
    const playerDist = this.playerPos.distanceTo(pitCenter);

    this.scene.ballPitBalls.forEach((ball) => {
      const bPos = ball.position;
      const bVel = ball.userData.velocity;

      // Player kick impulse when moving through pit
      if (playerDist < 4.0) {
        const dToPlayer = this.playerPos.distanceTo(new THREE.Vector3(bPos.x + 14, bPos.y, bPos.z - 8));
        if (dToPlayer < 1.1) {
          const pushX = (bPos.x + 14 - this.playerPos.x) * 6.0;
          const pushZ = (bPos.z - 8 - this.playerPos.z) * 6.0;
          bVel.x += pushX;
          bVel.z += pushZ;
          bVel.y += 3.5;
        }
      }

      // Apply Ball Pit Gravity & Friction
      bVel.y -= 14.0 * dt;
      bPos.addScaledVector(bVel, dt);

      // Pit floor bounce
      if (bPos.y <= 0.32) {
        bPos.y = 0.32;
        bVel.y = -bVel.y * 0.45;
        bVel.x *= 0.88;
        bVel.z *= 0.88;
      }

      // Pit basin boundaries (-3.0 to 3.0)
      if (Math.abs(bPos.x) > 3.0) {
        bPos.x = Math.sign(bPos.x) * 3.0;
        bVel.x = -bVel.x * 0.5;
      }
      if (Math.abs(bPos.z) > 2.9) {
        bPos.z = Math.sign(bPos.z) * 2.9;
        bVel.z = -bVel.z * 0.5;
      }
    });
  }

  updateBowlingPhysics(dt) {
    const alleyCenter = new THREE.Vector3(16, 0, 10);
    const pDist = this.playerPos.distanceTo(alleyCenter);

    // Check player or thrown toy collision with pins
    this.scene.bowlingPins.forEach((pinGroup) => {
      if (pinGroup.userData.isKnocked) return;

      const pPos = pinGroup.userData.basePos;
      const dist = this.playerPos.distanceTo(pPos);

      // If player bumps or thrown toy hits pin
      let hit = dist < 0.95;
      if (!hit && this.scene.bowlingBall) {
        hit = this.scene.bowlingBall.position.distanceTo(pinGroup.position) < 0.65;
      }

      if (hit) {
        pinGroup.userData.isKnocked = true;
        pinGroup.rotation.x = Math.PI / 2;
        pinGroup.rotation.z = (Math.random() - 0.5) * 1.5;
        pinGroup.position.y = 0.15;
        this.playBowlingStrike();
        this.scene.spawnCoinStars(pPos.x, 1.2, pPos.z);
        this.wobblyCoins += 25;
        this.updateCoinsHUD();
      }
    });
  }

  updateTrampolineCheck() {
    const trampCenter = new THREE.Vector3(-14, 0, -8);
    const dist = this.playerPos.distanceTo(trampCenter);

    // If player lands on trampoline
    if (dist < 3.0 && this.playerPos.y <= 1.05 && this.verticalVelocity <= 0) {
      this.isGrounded = false;
      this.verticalVelocity = 18.5; // Super High Launch!
      this.squashStretchY = 1.5;
      this.playSpringBoing();
      this.scene.spawnCoinStars(trampCenter.x, 1.4, trampCenter.z);
    }
  }

  updateDeliveryCheck(dt) {
    if (!this.deliveryActive) return;

    this.deliveryTimeRemaining -= dt;
    const timerEl = document.getElementById('delivery-timer');
    if (timerEl) timerEl.textContent = `${Math.max(0, Math.ceil(this.deliveryTimeRemaining))}s`;

    if (this.deliveryTimeRemaining <= 0) {
      // Time's up
      this.deliveryActive = false;
      const hud = document.getElementById('delivery-hud');
      if (hud) hud.classList.add('hidden');
      return;
    }

    // Check if player carried package into dropzone
    if (this.heldToy && (this.heldToy.userData.type === 'pizza' || this.heldToy.userData.type === 'parcel')) {
      const targetDist = this.playerPos.distanceTo(this.activeDeliveryTarget);
      if (targetDist < 2.0) {
        // Complete Job!
        this.completeDeliveryJob();
      }
    }
  }

  updateCamera(dt) {
    if (this.viewMode === '1st') {
      const eyeHeight = 1.55;
      this.camera.position.set(this.playerPos.x, this.playerPos.y + eyeHeight, this.playerPos.z);
      const lookX = this.playerPos.x - Math.sin(this.playerRotation) * 5.0;
      const lookZ = this.playerPos.z - Math.cos(this.playerRotation) * 5.0;
      this.camera.lookAt(lookX, this.playerPos.y + eyeHeight, lookZ);
    } else {
      // 3rd Person Wobbly Spring-Arm Follow
      const offsetDist = this.isDrivingKart ? 5.8 : 3.8;
      const offsetHeight = this.isDrivingKart ? 3.2 : 2.2;

      const targetCamX = this.playerPos.x + Math.sin(this.playerRotation) * offsetDist;
      const targetCamZ = this.playerPos.z + Math.cos(this.playerRotation) * offsetDist;
      const targetCamY = this.playerPos.y + offsetHeight;

      this.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.16);
      this.scene.cameraTarget.set(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
      this.camera.lookAt(this.scene.cameraTarget);
    }

    // Dynamic FOV kick
    if (Math.abs(this.camera.fov - this.targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, 0.1);
      this.camera.updateProjectionMatrix();
    }
  }
}

window.WobblyPlayroomEngine = WobblyPlayroomEngine;
