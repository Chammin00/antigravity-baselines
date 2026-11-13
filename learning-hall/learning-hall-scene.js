/**
 * 🏛️ Centralized Learning Hall: 3D Exhibition Corridor & First-Person Walking Engine
 * Built on Three.js (r128) with 1K PBR Poly Haven textures & Floating Holographic Stats Banners.
 * Inspired by the 10/10 ApexPulse Gaming Studio architecture.
 */

class LearningHallScene {
  constructor(canvasContainerId, subjects, callbacks = {}) {
    this.container = document.getElementById(canvasContainerId);
    this.subjects = subjects || [];
    this.onWalkStart = callbacks.onWalkStart || (() => {});
    this.onWalkProgress = callbacks.onWalkProgress || (() => {});
    this.onFootstep = callbacks.onFootstep || (() => {});
    this.onArrive = callbacks.onArrive || (() => {});
    this.onSubjectSelect = callbacks.onSubjectSelect || (() => {});
    this.onViewModeChange = callbacks.onViewModeChange || (() => {});

    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();

    this.activeSubjectId = 1;
    this.interactiveMeshes = [];
    this.hologramMeshes = [];
    this.sunbeamMeshes = [];
    this.dustParticles = null;

    // 🎮 RPG Manual Movement & Dynamic Kinematics State
    const s1 = this.subjects[0];
    this.viewMode = '3rd'; // '3rd' or '1st'
    this.playerPos = new THREE.Vector3(s1 ? s1.standPos.x : 0, 0, s1 ? s1.standPos.z : 14.0);
    this.playerVelocity = new THREE.Vector3(0, 0, 0);
    this.playerRotation = 0; // Radians, 0 faces -Z down gallery
    this.bankAngle = 0;

    // Speed tiers
    this.walkSpeed = 4.8;
    this.sprintSpeed = 8.4;
    this.turnSpeed = 2.8;
    this.accel = 26.0;
    this.friction = 0.82;
    this.isRunning = false;

    // Jump & Vertical Arc
    this.isGrounded = true;
    this.jumpForce = 5.4;
    this.gravity = 16.0;
    this.verticalVelocity = 0;
    this.squashStretchY = 1.0;

    // Animation & Secondary Motion
    this.walkAnimTime = 0;
    this.idleTime = 0;
    this.targetFov = 50;
    this.closestSubject = null;

    // Input Keys
    this.keys = {
      w: false, s: false, a: false, d: false,
      Shift: false, e: false, ' ': false,
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
    };

    // Camera state
    this.camPos = new THREE.Vector3();
    this.camLook = new THREE.Vector3();
    this.camRoll = 0;

    // Choreographed Walk State Machine
    this.walkState = null;
    this.mouseX = 0;
    this.mouseY = 0;

    // RPG Footsteps & Dust Puffs Pool
    this.lastFootstepTime = 0;
    this.footStepInterval = 0.36;
    this.dustPuffs = [];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060913);
    this.scene.fog = new THREE.FogExp2(0x060913, 0.024);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 90);

    const s1 = this.subjects[0];
    this.camPos.set(s1.standPos.x, s1.standPos.y, s1.standPos.z);
    this.camLook.set(s1.lookPos.x, s1.lookPos.y, s1.lookPos.z);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.buildArchitecture();
    this.setupLighting();
    this.buildFramedPaintings();
    this.buildFloatingHologramBanners();
    this.buildArchedWindows();
    this.buildGalleryDecorations();
    this.buildDustParticles();
    this.buildScholarAvatar();
    this.buildRpgProximityBubble();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.container.addEventListener('click', (e) => this.onCanvasClick(e));
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    this.animate();
  }

  loadTiledPBR(path, repeatX, repeatY, isColor = false) {
    const tex = this.textureLoader.load(
      path,
      undefined,
      undefined,
      () => {
        // Fallback procedural canvas if texture loading is restricted
        return this.createFallbackTexture(isColor);
      }
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    if (isColor) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createFallbackTexture(isColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = isColor ? '#1a2233' : '#808080';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = isColor ? '#2d3748' : '#a0aec0';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 248);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  buildArchitecture() {
    const hallWidth = 7.4;
    const hallHeight = 4.4;

    // Dynamically calculate corridor bounds from all subjects
    let minZ = -16.0;
    let maxZ = 12.0;
    if (this.subjects && this.subjects.length > 0) {
      this.subjects.forEach((s) => {
        if (s.position && typeof s.position.z === 'number') {
          if (s.position.z < minZ) minZ = s.position.z;
          if (s.position.z > maxZ) maxZ = s.position.z;
        }
      });
    }

    const startZ = Math.max(18.0, maxZ + 6.0);
    const endZ = Math.min(-18.0, minZ - 6.0);
    const hallLength = startZ - endZ;
    const centerZ = (startZ + endZ) / 2.0;
    this.corridorBounds = { startZ, endZ, centerZ, hallLength };

    // 1. Floor: 1K Herringbone Parquet PBR
    const repeatV = Math.max(20, Math.round(hallLength / 2));
    const floorDiff = this.loadTiledPBR('assets/textures/herringbone_parquet_diff_1k.jpg', 4, repeatV, true);
    const floorNor = this.loadTiledPBR('assets/textures/herringbone_parquet_nor_1k.jpg', 4, repeatV, false);
    const floorRough = this.loadTiledPBR('assets/textures/herringbone_parquet_rough_1k.jpg', 4, repeatV, false);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorDiff,
      normalMap: floorNor,
      roughnessMap: floorRough,
      roughness: 0.52,
      metalness: 0.1
    });
    const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallLength), floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, centerZ);
    floorMesh.receiveShadow = true;
    this.scene.add(floorMesh);

    // Center Carpet Runner (Navy & Gold Enterprise Aisle)
    const runnerMat = new THREE.MeshStandardMaterial({
      color: 0x0a1224,
      roughness: 0.88,
      metalness: 0.05
    });
    const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.6, hallLength - 4), runnerMat);
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.004, centerZ);
    runner.receiveShadow = true;
    this.scene.add(runner);

    // Brushed Brass Trim on Carpet Edges
    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.85,
      roughness: 0.25
    });
    [-0.81, 0.81].forEach((rx) => {
      const trim = new THREE.Mesh(new THREE.PlaneGeometry(0.035, hallLength - 4), brassTrimMat);
      trim.rotation.x = -Math.PI / 2;
      trim.position.set(rx, 0.005, centerZ);
      this.scene.add(trim);
    });

    // 2. Walls: 1K Painted Plaster Wall PBR
    const wallRepeatU = Math.max(10, Math.round(hallLength / 4));
    const wallDiff = this.loadTiledPBR('assets/textures/painted_plaster_wall_diff_1k.jpg', wallRepeatU, 2, true);
    const wallNor = this.loadTiledPBR('assets/textures/painted_plaster_wall_nor_1k.jpg', wallRepeatU, 2, false);
    const wallRough = this.loadTiledPBR('assets/textures/painted_plaster_wall_rough_1k.jpg', wallRepeatU, 2, false);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x181e2b,
      map: wallDiff,
      normalMap: wallNor,
      roughnessMap: wallRough,
      roughness: 0.82,
      metalness: 0.05
    });

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(hallLength, hallHeight), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-hallWidth / 2, hallHeight / 2, centerZ);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(hallLength, hallHeight), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(hallWidth / 2, hallHeight / 2, centerZ);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // End Wall
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallHeight), wallMat);
    endWall.position.set(0, hallHeight / 2, endZ);
    endWall.receiveShadow = true;
    this.scene.add(endWall);

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallHeight), wallMat);
    backWall.rotation.y = Math.PI;
    backWall.position.set(0, hallHeight / 2, startZ);
    this.scene.add(backWall);

    // 3. Ceiling with Architectural Coffers
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x0b101d,
      roughness: 0.9,
      metalness: 0.1
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallLength), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, hallHeight, centerZ);
    this.scene.add(ceiling);

    // Ceiling Beams (Walnut & Gold)
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x1a1512,
      roughness: 0.6,
      metalness: 0.2
    });
    for (let z = endZ + 2.0; z <= startZ - 2.0; z += 4.0) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(hallWidth, 0.22, 0.32), beamMat);
      beam.position.set(0, hallHeight - 0.11, z);
      this.scene.add(beam);
    }
  }

  setupLighting() {
    // Ambient light (Dark celestial baseline)
    const ambientLight = new THREE.AmbientLight(0x24324f, 0.85);
    this.scene.add(ambientLight);

    // Main corridor directional moonlight
    const dirLight = new THREE.DirectionalLight(0xa5c4f5, 1.1);
    dirLight.position.set(4, 7, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 35;
    dirLight.shadow.camera.left = -12;
    dirLight.shadow.camera.right = 12;
    dirLight.shadow.camera.top = 12;
    dirLight.shadow.camera.bottom = -12;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Soft warm secondary fill light
    const fillLight = new THREE.DirectionalLight(0xffecd1, 0.45);
    fillLight.position.set(-5, 6, -6);
    this.scene.add(fillLight);
  }

  buildFramedPaintings() {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1f1a14,
      metalness: 0.4,
      roughness: 0.45
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.88,
      roughness: 0.25
    });

    this.subjects.forEach((subj) => {
      const isEndWall = subj.wall === 'end';
      const pWidth = isEndWall ? 3.4 : 2.5;
      const pHeight = isEndWall ? 2.1 : 1.55;

      const group = new THREE.Group();
      group.position.set(subj.position.x, subj.position.y, subj.position.z);

      if (subj.wall === 'left') {
        group.rotation.y = Math.PI / 2;
      } else if (subj.wall === 'right') {
        group.rotation.y = -Math.PI / 2;
      }

      // Outer Frame
      const outerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(pWidth + 0.26, pHeight + 0.26, 0.08),
        frameMat
      );
      outerFrame.castShadow = true;
      group.add(outerFrame);

      // Gold Bevel Inset
      const innerGold = new THREE.Mesh(
        new THREE.BoxGeometry(pWidth + 0.08, pHeight + 0.08, 0.09),
        goldTrimMat
      );
      group.add(innerGold);

      // Painting Canvas Artwork (Rendered procedurally per subject)
      const canvasTex = this.createSubjectCanvasTexture(subj);
      const canvasMat = new THREE.MeshStandardMaterial({
        map: canvasTex,
        roughness: 0.45,
        metalness: 0.15,
        emissive: new THREE.Color(subj.accentHex),
        emissiveIntensity: 0.12
      });

      const canvasMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(pWidth, pHeight),
        canvasMat
      );
      canvasMesh.position.z = 0.051;
      canvasMesh.userData = { subjectId: subj.id, type: 'painting' };
      group.add(canvasMesh);
      this.interactiveMeshes.push(canvasMesh);

      // Overhead Picture Gallery Spotlight
      const picSpot = new THREE.SpotLight(0xfff7e6, 2.2, 5.5, Math.PI / 4, 0.35, 1.2);
      picSpot.position.set(0, (pHeight / 2) + 0.45, 0.65);
      picSpot.target = canvasMesh;
      group.add(picSpot);

      // Brass Museum Placard Below Painting
      const placardMat = new THREE.MeshStandardMaterial({
        color: 0xc5a059,
        metalness: 0.85,
        roughness: 0.28
      });
      const placard = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.28, 0.02),
        placardMat
      );
      placard.position.set(0, -(pHeight / 2) - 0.24, 0.03);
      group.add(placard);

      // Placard Text Canvas
      const placardTex = this.createPlacardTexture(subj);
      const placardCanvasMat = new THREE.MeshBasicMaterial({
        map: placardTex,
        transparent: true
      });
      const placardPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.16, 0.25),
        placardCanvasMat
      );
      placardPlane.position.set(0, -(pHeight / 2) - 0.24, 0.045);
      placardPlane.userData = { subjectId: subj.id, type: 'placard' };
      group.add(placardPlane);
      this.interactiveMeshes.push(placardPlane);

      this.scene.add(group);
    });
  }

  /**
   * 🌟 FLOATING 3D HOLOGRAPHIC STATS BANNERS ABOVE EACH PICTURE
   * Renders floating holographic glass HUD cards displaying live mastery %,
   * exam readiness index, questions mastered, and status grade!
   */
  buildFloatingHologramBanners() {
    this.subjects.forEach((subj) => {
      const isEndWall = subj.wall === 'end';
      const bannerWidth = isEndWall ? 3.6 : 2.7;
      const bannerHeight = 0.82;

      const group = new THREE.Group();
      // Position floating ~0.85m above the picture frame
      const floatY = subj.position.y + (isEndWall ? 1.45 : 1.25);
      group.position.set(subj.position.x, floatY, subj.position.z);

      if (subj.wall === 'left') {
        group.rotation.y = Math.PI / 2;
      } else if (subj.wall === 'right') {
        group.rotation.y = -Math.PI / 2;
      }

      // 1. Holographic Texture Canvas
      const holoTex = this.createHologramStatsTexture(subj);
      const holoMat = new THREE.MeshStandardMaterial({
        map: holoTex,
        transparent: true,
        opacity: 0.94,
        roughness: 0.2,
        metalness: 0.3,
        emissive: new THREE.Color(subj.accentHex),
        emissiveIntensity: 0.28,
        side: THREE.DoubleSide
      });

      const holoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(bannerWidth, bannerHeight),
        holoMat
      );
      holoPlane.position.z = 0.06;
      holoPlane.userData = { subjectId: subj.id, type: 'hologram' };
      group.add(holoPlane);
      this.interactiveMeshes.push(holoPlane);

      // 2. Holographic Glass Border Mesh
      const edgeGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(bannerWidth + 0.04, bannerHeight + 0.04));
      const edgeMat = new THREE.LineBasicMaterial({
        color: subj.accentHex,
        linewidth: 2,
        transparent: true,
        opacity: 0.85
      });
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeMesh.position.z = 0.065;
      group.add(edgeMesh);

      // 3. Subtle floating mount struts
      const strutMat = new THREE.MeshStandardMaterial({
        color: 0xc5a059,
        metalness: 0.85,
        roughness: 0.3
      });
      [-0.9, 0.9].forEach((sx) => {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38), strutMat);
        strut.position.set(sx, -0.44, 0.04);
        group.add(strut);
      });

      group.userData = {
        baseY: floatY,
        seed: subj.id * 1.5,
        hologramMesh: holoPlane
      };

      this.hologramMeshes.push(group);
      this.scene.add(group);
    });
  }

  createSubjectCanvasTexture(subj) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
    bgGrad.addColorStop(0, subj.palette[0] || '#0d131f');
    bgGrad.addColorStop(0.5, subj.palette[1] || '#152033');
    bgGrad.addColorStop(1, subj.palette[2] || '#1d2c44');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 640);

    // Subtle Architectural Cyber Grid Lines
    ctx.strokeStyle = `${subj.accentCss}22`;
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y <= 640; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Glowing Accent Corner Accents
    ctx.strokeStyle = subj.accentCss;
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 960, 576);

    // Roman Numeral & Subject Code Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.font = '900 180px "SF Pro Display", -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(subj.roman, 950, 220);

    // Subject Code Pill Badge
    ctx.fillStyle = `${subj.accentCss}33`;
    ctx.strokeStyle = subj.accentCss;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(64, 64, 180, 52, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(subj.code, 154, 98);

    // Category
    ctx.fillStyle = subj.accentCss;
    ctx.font = '600 20px "SF Pro Display", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(subj.category.toUpperCase(), 265, 96);

    // Main Subject Title (Split into 2 lines if needed)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "SF Pro Display", -apple-system, sans-serif';
    const words = subj.title.split(' ');
    let line1 = '';
    let line2 = '';
    words.forEach((w) => {
      if ((line1 + w).length < 24) {
        line1 += `${w} `;
      } else {
        line2 += `${w} `;
      }
    });
    ctx.fillText(line1.trim(), 64, 210);
    if (line2.trim()) {
      ctx.fillText(line2.trim(), 64, 265);
    }

    // Subtitle / Scope
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "SF Pro Text", sans-serif';
    ctx.fillText(subj.subtitle, 64, 320);

    // Live Metrics Visual Gauge
    const barY = 440;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(64, barY, 896, 26, 13);
    ctx.fill();

    const fillWidth = Math.round((896 * subj.readiness) / 100);
    const barGrad = ctx.createLinearGradient(64, barY, 64 + fillWidth, barY);
    barGrad.addColorStop(0, '#c5a059');
    barGrad.addColorStop(1, subj.accentCss);
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(64, barY, fillWidth, 26, 13);
    ctx.fill();

    // Metric Badges Footer
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText(`${subj.readiness}% READINESS`, 64, 420);

    ctx.textAlign = 'right';
    ctx.fillStyle = subj.accentCss;
    ctx.fillText(subj.grade, 960, 420);

    // Detail pills
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillText(`● Qs Mastered: ${subj.stats.questionsMastered}/${subj.stats.totalQuestions}`, 64, 520);
    ctx.fillText(`● PBQs Cleared: ${subj.stats.pbqsCompleted}/${subj.stats.totalPbqs}`, 420, 520);
    ctx.fillText(`● Study Time: ${subj.stats.hoursInvested}`, 740, 520);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /**
   * 📊 Procedural Holographic Canvas for Floating Stats Billboard
   */
  createHologramStatsTexture(subj) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Translucent High-Gloss Card
    const cardGrad = ctx.createLinearGradient(0, 0, 1024, 320);
    cardGrad.addColorStop(0, 'rgba(6, 15, 30, 0.94)');
    cardGrad.addColorStop(1, 'rgba(10, 24, 48, 0.94)');
    ctx.fillStyle = cardGrad;
    ctx.beginPath();
    ctx.roundRect(16, 16, 992, 288, 20);
    ctx.fill();

    // Border Glow
    ctx.strokeStyle = subj.accentCss;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Top Header: Subject Code & Roman Station Indicator
    ctx.fillStyle = subj.accentCss;
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`★ STATION ${subj.roman} // [${subj.code}]`, 40, 60);

    // Grade Badge
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(subj.grade, 984, 60);

    // Large Animated Readiness Metric
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px "JetBrains Mono", monospace';
    ctx.fillText(`${subj.readiness}%`, 40, 145);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 24px "SF Pro Display", sans-serif';
    ctx.fillText('EXAM READINESS INDEX', 220, 115);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px "SF Pro Text", sans-serif';
    ctx.fillText(
      `${subj.stats.questionsMastered} Questions Mastered  •  ${subj.stats.pbqsCompleted} PBQs  •  Avg: ${subj.stats.avgScore}`,
      220,
      145
    );

    // Progress Bar
    const barX = 40;
    const barY = 175;
    const barW = 944;
    const barH = 14;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 7);
    ctx.fill();

    const fillW = Math.round((barW * subj.readiness) / 100);
    ctx.fillStyle = subj.accentCss;
    ctx.beginPath();
    ctx.roundRect(barX, barY, fillW, barH, 7);
    ctx.fill();

    // Weak-Spot Telemetry Alert
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('⚡ WEAK SPOT TRIAGE:', 40, 235);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '18px "SF Pro Text", sans-serif';
    const weakText = subj.weakSpot.length > 68 ? `${subj.weakSpot.slice(0, 65)}...` : subj.weakSpot;
    ctx.fillText(weakText, 255, 235);

    // Action Hint
    ctx.textAlign = 'right';
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('[CLICK OR PRESS SPACE TO AUDIT] →', 984, 275);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createPlacardTexture(subj) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 112;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#110d08';
    ctx.fillRect(0, 0, 512, 112);

    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 26px "Cinzel", serif, Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`EXHIBIT ${subj.roman} • ${subj.code}`, 256, 42);

    ctx.fillStyle = '#dfba73';
    ctx.font = '18px "SF Pro Display", sans-serif';
    const shortTitle = subj.title.length > 34 ? `${subj.title.slice(0, 32)}...` : subj.title;
    ctx.fillText(shortTitle, 256, 80);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  buildArchedWindows() {
    // Monumental Galaxy/Volcano Exterior Vista
    const vistaTex = this.textureLoader.load(
      'assets/textures/earth_galaxy_volcano_bridge_vista.jpg',
      undefined,
      undefined,
      () => this.createFallbackTexture(true)
    );
    vistaTex.encoding = THREE.sRGBEncoding;

    const vistaMat = new THREE.MeshBasicMaterial({
      map: vistaTex,
      side: THREE.DoubleSide
    });

    const startZ = this.corridorBounds ? this.corridorBounds.startZ : 18.0;
    const endZ = this.corridorBounds ? this.corridorBounds.endZ : -18.0;

    // Vista cylinders / panoramic backdrop placed outside the far end
    const vistaGeo = new THREE.CylinderGeometry(28, 28, 18, 32, 1, true, -Math.PI / 2, Math.PI);
    const vistaMesh = new THREE.Mesh(vistaGeo, vistaMat);
    vistaMesh.position.set(0, 4.0, endZ + 14.0);
    this.scene.add(vistaMesh);

    // Arched Windows along Right & Left Wall upper clerestory
    const windowMat = new THREE.MeshPhysicalMaterial({
      color: 0x88bbff,
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });

    const mullionMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.85,
      roughness: 0.3
    });

    for (let wz = Math.round(startZ - 6.0); wz >= Math.round(endZ + 6.0); wz -= 8.0) {
      // Left and Right window cutouts
      [-3.7, 3.7].forEach((wx) => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 1.2), mullionMat);
        frame.position.set(wx, 3.2, wz);
        this.scene.add(frame);

        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 1.05), windowMat);
        glass.position.set(wx, 3.2, wz);
        this.scene.add(glass);
      });
    }
  }

  buildGalleryDecorations() {
    const startZ = this.corridorBounds ? this.corridorBounds.startZ : 18.0;
    const endZ = this.corridorBounds ? this.corridorBounds.endZ : -18.0;

    // Museum Benches down the hallway
    const benchWoodMat = new THREE.MeshStandardMaterial({
      color: 0x1a120b,
      roughness: 0.5,
      metalness: 0.15
    });
    const benchCushionMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.05
    });

    for (let bz = Math.round(startZ - 10.0); bz >= Math.round(endZ + 10.0); bz -= 16.0) {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(0, 0, bz);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 2.4), benchCushionMat);
      seat.position.y = 0.45;
      seat.castShadow = true;
      benchGroup.add(seat);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 2.2), benchWoodMat);
      base.position.y = 0.2;
      base.castShadow = true;
      benchGroup.add(base);

      this.scene.add(benchGroup);
    }
  }

  buildDustParticles() {
    const particleCount = 450;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6.8;
      positions[i + 1] = Math.random() * 4.2;
      positions[i + 2] = (Math.random() - 0.5) * 36.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xdfba73,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(geo, mat);
    this.scene.add(this.dustParticles);
  }

  /**
   * 🚶 CHOREOGRAPHED 3-PHASE FIRST-PERSON HUMAN WALK
   * Traverses smoothly between subjects along the center carpet aisle
   * with natural vertical head-bob, lateral stride sway, and synchronized footstep triggers.
   */
  walkToSubject(targetSubjectId) {
    if (this.walkState) return; // Walk already in progress

    const targetSubj = this.subjects.find((s) => s.id === targetSubjectId);
    if (!targetSubj) return;

    const fromSubj = this.subjects.find((s) => s.id === this.activeSubjectId) || this.subjects[0];
    if (fromSubj.id === targetSubj.id && this.camPos.distanceTo(targetSubj.standPos) < 0.2) {
      this.onSubjectSelect(targetSubj);
      return;
    }

    this.onWalkStart(fromSubj, targetSubj);

    const startPos = this.camera.position.clone();
    const startLook = this.camLook.clone();

    // Calculate corridor distance along Z axis
    const corridorDist = Math.abs(targetSubj.standPos.z - startPos.z);
    const phase1Dur = 0.55; // Step back onto center runner & face corridor
    const phase2Dur = Math.max(1.6, Math.min(3.2, corridorDist * 0.22)); // Human stride down aisle
    const phase3Dur = 0.65; // Turn to painting & focus
    const totalDur = phase1Dur + phase2Dur + phase3Dur;

    // Total footsteps based on walk duration (~1 footstep every 0.38s)
    const totalSteps = Math.max(4, Math.round(phase2Dur / 0.38));

    // Stride direction along hallway
    const walkDirectionZ = targetSubj.standPos.z < startPos.z ? -1 : 1;
    const aisleX = 0.0;

    this.walkState = {
      fromSubj,
      targetSubj,
      startPos,
      startLook,
      phase1Dur,
      phase2Dur,
      phase3Dur,
      totalDur,
      totalSteps,
      walkDirectionZ,
      aisleX,
      elapsed: 0,
      lastStepIndex: -1
    };
  }

  updateWalk(dt) {
    if (!this.walkState) return;

    const ws = this.walkState;
    ws.elapsed += dt;

    const totalPct = Math.min(1.0, ws.elapsed / ws.totalDur);
    this.onWalkProgress(totalPct);

    if (ws.elapsed <= ws.phase1Dur) {
      // Phase 1: Step back onto center carpet runner & align gaze down the hallway
      const u = this.smoothstep(ws.elapsed / ws.phase1Dur);

      this.camPos.x = THREE.MathUtils.lerp(ws.startPos.x, ws.aisleX, u);
      this.camPos.y = THREE.MathUtils.lerp(ws.startPos.y, 1.72, u);
      this.camPos.z = ws.startPos.z;

      const targetLookZ = ws.startPos.z + ws.walkDirectionZ * 6.0;
      this.camLook.x = THREE.MathUtils.lerp(ws.startLook.x, ws.aisleX, u);
      this.camLook.y = THREE.MathUtils.lerp(ws.startLook.y, 1.72, u);
      this.camLook.z = THREE.MathUtils.lerp(ws.startLook.z, targetLookZ, u);

      if (ws.lastStepIndex < 0 && u > 0.4) {
        ws.lastStepIndex = 0;
        this.onFootstep(0);
      }
    } else if (ws.elapsed <= ws.phase1Dur + ws.phase2Dur) {
      // Phase 2: Biomechanical stride down the center aisle with head-bob
      const walkTime = ws.elapsed - ws.phase1Dur;
      const u = this.smoothstep(walkTime / ws.phase2Dur);

      const targetZ = ws.targetSubj.standPos.z;
      this.camPos.x = ws.aisleX;
      this.camPos.z = THREE.MathUtils.lerp(ws.startPos.z, targetZ, u);

      // Biomechanical Head-Bob & Stride Sway
      const strideFreq = Math.PI * 2 * (ws.totalSteps / 2);
      const verticalBob = Math.sin(u * strideFreq * 2) * 0.038;
      const lateralSway = Math.cos(u * strideFreq) * 0.024;

      this.camPos.y = 1.72 + verticalBob;
      this.camPos.x = ws.aisleX + lateralSway;

      // Look straight ahead towards destination station
      this.camLook.x = ws.aisleX;
      this.camLook.y = 1.72 + verticalBob * 0.6;
      this.camLook.z = this.camPos.z + ws.walkDirectionZ * 6.0;

      // Trigger footstep sound at each stride contact
      const currentStepIdx = Math.floor(u * ws.totalSteps) + 1;
      if (currentStepIdx > ws.lastStepIndex && currentStepIdx <= ws.totalSteps) {
        ws.lastStepIndex = currentStepIdx;
        this.onFootstep(currentStepIdx);
      }
    } else if (ws.elapsed < ws.totalDur) {
      // Phase 3: Pivot smoothly to face the painting and step into viewing stance
      const turnTime = ws.elapsed - ws.phase1Dur - ws.phase2Dur;
      const u = this.smoothstep(turnTime / ws.phase3Dur);

      this.camPos.x = THREE.MathUtils.lerp(ws.aisleX, ws.targetSubj.standPos.x, u);
      this.camPos.y = THREE.MathUtils.lerp(1.72, ws.targetSubj.standPos.y, u);
      this.camPos.z = THREE.MathUtils.lerp(ws.camPos.z, ws.targetSubj.standPos.z, u);

      this.camLook.x = THREE.MathUtils.lerp(ws.camLook.x, ws.targetSubj.lookPos.x, u);
      this.camLook.y = THREE.MathUtils.lerp(ws.camLook.y, ws.targetSubj.lookPos.y, u);
      this.camLook.z = THREE.MathUtils.lerp(ws.camLook.z, ws.targetSubj.lookPos.z, u);

      if (ws.lastStepIndex <= ws.totalSteps && u > 0.45) {
        ws.lastStepIndex = ws.totalSteps + 1;
        this.onFootstep(ws.lastStepIndex);
      }
    } else {
      // Arrived at destination exhibit
      const arrivedSubj = ws.targetSubj;
      this.walkState = null;
      this.activeSubjectId = arrivedSubj.id;

      this.camPos.copy(arrivedSubj.standPos);
      this.camLook.copy(arrivedSubj.lookPos);
      this.playerPos.set(arrivedSubj.standPos.x, 0, arrivedSubj.standPos.z);
      const lookDeltaX = arrivedSubj.lookPos.x - arrivedSubj.standPos.x;
      const lookDeltaZ = arrivedSubj.lookPos.z - arrivedSubj.standPos.z;
      this.playerRotation = Math.atan2(-lookDeltaX, -lookDeltaZ);
      this.camera.position.copy(this.camPos);
      this.camera.lookAt(this.camLook);

      this.onArrive(arrivedSubj);
      this.onSubjectSelect(arrivedSubj);
    }

    if (this.walkState) {
      this.playerPos.set(this.camPos.x, 0, this.camPos.z);
      this.camera.position.copy(this.camPos);
      this.camera.lookAt(this.camLook);
    }
  }

  smoothstep(t) {
    const clamped = Math.max(0, Math.min(1, t));
    return clamped * clamped * (3 - 2 * clamped);
  }

  onMouseMove(e) {
    if (this.walkState) return;
    const rect = this.container.getBoundingClientRect();
    this.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  onCanvasClick(e) {
    const rect = this.container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.interactiveMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const subjId = hit.userData.subjectId;
      if (subjId) {
        if (subjId === this.activeSubjectId) {
          // Open deeper stats console if already standing here
          const subj = this.subjects.find((s) => s.id === subjId);
          this.onSubjectSelect(subj, true);
        } else {
          // Traverse to this subject
          this.walkToSubject(subjId);
        }
      }
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /* =========================================================================
     🎮 RPG MANUAL MOVEMENT & ARTICULATED SCHOLAR AVATAR SYSTEM
     ========================================================================= */

  buildScholarAvatar() {
    this.avatarMesh = new THREE.Group();
    this.avatarMesh.position.copy(this.playerPos);

    this.avatarRoot = new THREE.Group();
    this.avatarMesh.add(this.avatarRoot);

    // 1. Torso: Scholar Midnight Navy Jacket with Gold Trim (#0d1b38 / #c5a059)
    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x0d1b38,
      roughness: 0.65,
      metalness: 0.25
    });
    this.torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.21, 0.62, 12), jacketMat);
    this.torsoMesh.position.y = 0.86;
    this.torsoMesh.castShadow = true;
    this.avatarRoot.add(this.torsoMesh);

    // Academy Gold Crest on chest
    const crestMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      roughness: 0.2,
      metalness: 0.85,
      emissive: 0xc5a059,
      emissiveIntensity: 0.35
    });
    const crest = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 12), crestMat);
    crest.rotation.x = Math.PI / 2;
    crest.position.set(0, 0.94, 0.22);
    this.avatarRoot.add(crest);

    // 2. Scholar Satchel / Courier Bookbag with Secondary Physics
    this.satchelGroup = new THREE.Group();
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.75,
      metalness: 0.1
    });
    const satchelBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.14), leatherMat);
    satchelBody.position.set(0.12, 0.82, -0.22);
    satchelBody.rotation.z = -0.12;
    satchelBody.castShadow = true;
    this.satchelGroup.add(satchelBody);

    const goldBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), crestMat);
    goldBuckle.position.set(0.12, 0.82, -0.29);
    this.satchelGroup.add(goldBuckle);
    this.avatarRoot.add(this.satchelGroup);

    // 3. Head & Augmented Visor
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd38d,
      roughness: 0.55
    });
    this.avatarHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    this.avatarHead.position.y = 1.32;
    this.avatarHead.castShadow = true;
    this.avatarRoot.add(this.avatarHead);

    // Scholar hair / academy cap
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x09142b,
      roughness: 0.4
    });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 12), capMat);
    cap.position.set(0, 1.45, 0);
    this.avatarRoot.add(cap);

    // Augmented Cyber/Optic Visor Glass
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.88
    });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.07, 0.1), visorMat);
    visor.position.set(0, 1.34, 0.14);
    this.avatarRoot.add(visor);

    // 4. Limbs
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8
    });
    const limbGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.52, 10);

    // Left Leg
    this.leftLeg = new THREE.Group();
    const lLegMesh = new THREE.Mesh(limbGeo, pantsMat);
    lLegMesh.position.y = -0.26;
    lLegMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);
    this.leftLeg.position.set(-0.11, 0.54, 0);
    this.avatarRoot.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    const rLegMesh = new THREE.Mesh(limbGeo, pantsMat);
    rLegMesh.position.y = -0.26;
    rLegMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);
    this.rightLeg.position.set(0.11, 0.54, 0);
    this.avatarRoot.add(this.rightLeg);

    // Left Arm
    this.leftArm = new THREE.Group();
    const lArmMesh = new THREE.Mesh(limbGeo, jacketMat);
    lArmMesh.position.y = -0.24;
    lArmMesh.castShadow = true;
    this.leftArm.add(lArmMesh);
    this.leftArm.position.set(-0.29, 1.1, 0);
    this.avatarRoot.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Group();
    const rArmMesh = new THREE.Mesh(limbGeo, jacketMat);
    rArmMesh.position.y = -0.24;
    rArmMesh.castShadow = true;
    this.rightArm.add(rArmMesh);
    this.rightArm.position.set(0.29, 1.1, 0);
    this.avatarRoot.add(this.rightArm);

    // 5. Overhead RPG Nameplate Billboard
    const nameMat = new THREE.MeshBasicMaterial({
      map: this.createRpgNameplateTexture(),
      transparent: true,
      side: THREE.DoubleSide
    });
    this.nameplateMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.38), nameMat);
    this.nameplateMesh.position.set(0, 1.84, 0);
    this.avatarRoot.add(this.nameplateMesh);

    this.scene.add(this.avatarMesh);
    this.avatarMesh.visible = (this.viewMode === '3rd');
  }

  createRpgNameplateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(5, 11, 24, 0.88)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 130, 24);
    ctx.fill();

    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#dfba73';
    ctx.font = '900 32px monospace';
    ctx.fillText('★ LEVEL 99 SCHOLAR ★', 256, 62);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('CRAMEXAM CENTRAL PALACE', 256, 108);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  buildRpgProximityBubble() {
    this.promptGroup = new THREE.Group();
    this.promptGroup.position.set(0, 0, 0);
    this.promptGroup.visible = false;
    this.promptGroup.scale.set(0.001, 0.001, 0.001);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(197, 160, 89, 0.95)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 32);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#050b18';
    ctx.font = '900 34px -apple-system, sans-serif';
    ctx.fillText('📊 PRESS [E] TO INSPECT', 256, 75);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('SPACE = JUMP • SHIFT = RUN', 256, 120);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;

    const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
    this.promptMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.48), planeMat);
    this.promptGroup.add(this.promptMesh);

    this.scene.add(this.promptGroup);
  }

  spawnDustPuff(x, z, scale = 1.0) {
    const puffGeo = new THREE.RingGeometry(0.05, 0.16 * scale, 16);
    const puffMat = new THREE.MeshBasicMaterial({
      color: 0xdfba73,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const puff = new THREE.Mesh(puffGeo, puffMat);
    puff.rotation.x = -Math.PI / 2;
    puff.position.set(x, 0.006, z);
    this.scene.add(puff);

    this.dustPuffs.push({
      mesh: puff,
      life: 1.0,
      decay: 2.8,
      grow: 1.8 * scale
    });
  }

  updateDustPuffs(delta) {
    for (let i = this.dustPuffs.length - 1; i >= 0; i--) {
      const p = this.dustPuffs[i];
      p.life -= p.decay * delta;
      p.mesh.scale.addScalar(p.grow * delta);
      p.mesh.material.opacity = p.life * 0.7;

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.dustPuffs.splice(i, 1);
      }
    }
  }

  setViewMode(mode) {
    if (mode !== '1st' && mode !== '3rd') return;
    this.viewMode = mode;
    if (this.avatarMesh) {
      this.avatarMesh.visible = (this.viewMode === '3rd');
    }
    this.onViewModeChange(this.viewMode);
  }

  toggleViewMode() {
    this.setViewMode(this.viewMode === '3rd' ? '1st' : '3rd');
  }

  triggerJump() {
    if (!this.isGrounded || this.walkState) return;
    this.isGrounded = false;
    this.verticalVelocity = this.jumpForce;
    this.squashStretchY = 1.25; // Stretch upwards on launch
    this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.2);

    // Trigger footstep or chime callback
    this.onFootstep(-1);

    // Tactile button bounce effect
    const jumpBtn = document.getElementById('rpg-jump-btn');
    if (jumpBtn) {
      jumpBtn.classList.add('scale-90', 'ring-2', 'ring-[#c5a059]');
      setTimeout(() => {
        jumpBtn.classList.remove('scale-90', 'ring-2', 'ring-[#c5a059]');
      }, 180);
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
    const btn = document.getElementById('rpg-run-btn');
    const icon = document.getElementById('rpg-run-icon');
    const label = document.getElementById('rpg-run-label');
    if (!btn) return;
    const active = this.isRunning || this.keys.Shift;
    if (active) {
      btn.classList.add('bg-[#c5a059]/30', 'border-[#c5a059]', 'text-[#dfba73]', 'shadow-[#c5a059]/30');
      btn.classList.remove('bg-white/5', 'text-slate-200');
      if (icon) icon.textContent = '🏃';
      if (label) label.textContent = 'RUNNING';
    } else {
      btn.classList.remove('bg-[#c5a059]/30', 'border-[#c5a059]', 'text-[#dfba73]', 'shadow-[#c5a059]/30');
      btn.classList.add('bg-white/5', 'text-slate-200');
      if (icon) icon.textContent = '⚡';
      if (label) label.textContent = 'RUN [Shift]';
    }
  }

  updateManualMovement(delta) {
    if (this.walkState) return;

    let moveZ = 0;
    let turn = 0;

    if (this.keys.w || this.keys.ArrowUp) moveZ -= 1;
    if (this.keys.s || this.keys.ArrowDown) moveZ += 1;
    if (this.keys.a || this.keys.ArrowLeft) turn += 1;
    if (this.keys.d || this.keys.ArrowRight) turn -= 1;

    // Check sprint modifier
    const isSprinting = (this.keys.Shift || this.isRunning) && moveZ !== 0;
    const currentMaxSpeed = isSprinting ? this.sprintSpeed : this.walkSpeed;
    this.targetFov = isSprinting ? 58 : 50;

    // 1. Steering & Banking Lean
    if (turn !== 0) {
      this.playerRotation += turn * this.turnSpeed * delta;
      const targetBank = -turn * 0.12 * (isSprinting ? 1.5 : 1.0);
      this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, targetBank, 0.15);
    } else {
      this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, 0, 0.15);
    }

    // 2. Velocity Kinematics & Inertia
    if (moveZ !== 0) {
      const forwardX = -Math.sin(this.playerRotation) * (-moveZ) * currentMaxSpeed;
      const forwardZ = -Math.cos(this.playerRotation) * (-moveZ) * currentMaxSpeed;

      this.playerVelocity.x = THREE.MathUtils.lerp(this.playerVelocity.x, forwardX, this.accel * delta);
      this.playerVelocity.z = THREE.MathUtils.lerp(this.playerVelocity.z, forwardZ, this.accel * delta);
    } else {
      this.playerVelocity.x *= this.friction;
      this.playerVelocity.z *= this.friction;
    }

    // 3. Jump Physics & Vertical Arc
    if (!this.isGrounded) {
      this.verticalVelocity -= this.gravity * delta;
      this.playerPos.y += this.verticalVelocity * delta;

      if (this.playerPos.y <= 0) {
        this.playerPos.y = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
        this.squashStretchY = 0.82; // Impact squash
        this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.4);
        this.onFootstep(0);
      }
    } else {
      this.squashStretchY = THREE.MathUtils.lerp(this.squashStretchY, 1.0, 0.22);
    }

    // Boundary clamping (keep inside hall)
    const nextX = this.playerPos.x + this.playerVelocity.x * delta;
    const nextZ = this.playerPos.z + this.playerVelocity.z * delta;

    if (Math.abs(nextX) < 2.9) this.playerPos.x = nextX;
    if (nextZ > -38.0 && nextZ < 18.0) this.playerPos.z = nextZ;

    // 4. Character Animation Cycles
    const speedMagnitude = Math.sqrt(this.playerVelocity.x * this.playerVelocity.x + this.playerVelocity.z * this.playerVelocity.z);
    const isMoving = speedMagnitude > 0.4;

    if (isMoving) {
      this.idleTime = 0;
      const animRate = isSprinting ? 18 : 12;
      this.walkAnimTime += delta * animRate;

      const swing = Math.sin(this.walkAnimTime) * (isSprinting ? 0.65 : 0.45);
      if (this.leftLeg) this.leftLeg.rotation.x = swing;
      if (this.rightLeg) this.rightLeg.rotation.x = -swing;
      if (this.leftArm) this.leftArm.rotation.x = -swing * 0.85;
      if (this.rightArm) this.rightArm.rotation.x = swing * 0.85;

      if (this.satchelGroup) {
        this.satchelGroup.rotation.x = Math.sin(this.walkAnimTime * 2) * (isSprinting ? 0.15 : 0.08);
      }

      const now = this.clock.getElapsedTime();
      const currentInterval = isSprinting ? 0.24 : this.footStepInterval;
      if (now - this.lastFootstepTime > currentInterval) {
        this.lastFootstepTime = now;
        const stepIdx = Math.floor(now * 3) % 8;
        this.onFootstep(stepIdx);
        this.spawnDustPuff(this.playerPos.x, this.playerPos.z, isSprinting ? 1.2 : 0.7);
      }
    } else {
      this.idleTime += delta;
      const breathe = Math.sin(this.idleTime * 2.8) * 0.02;
      if (this.torsoMesh) this.torsoMesh.position.y = 0.86 + breathe;
      if (this.avatarHead) this.avatarHead.position.y = 1.32 + breathe * 1.2;

      if (this.leftLeg) this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 0.2);
      if (this.rightLeg) this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 0.2);
      if (this.leftArm) this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, 0.2);
      if (this.rightArm) this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, 0.2);
      if (this.satchelGroup) this.satchelGroup.rotation.x = THREE.MathUtils.lerp(this.satchelGroup.rotation.x, 0, 0.2);
    }

    if (!this.isGrounded) {
      if (this.leftLeg) this.leftLeg.rotation.x = -0.4;
      if (this.rightLeg) this.rightLeg.rotation.x = 0.4;
      if (this.leftArm) this.leftArm.rotation.x = 0.6;
      if (this.rightArm) this.rightArm.rotation.x = 0.6;
    }

    this.updateProximityBubble();
  }

  updateProximityBubble() {
    let nearest = null;
    let nearestDist = 3.4;

    this.subjects.forEach((s) => {
      const dist = this.playerPos.distanceTo(new THREE.Vector3(s.standPos.x, 0, s.standPos.z));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = s;
      }
    });

    this.closestSubject = nearest;

    if (nearest && this.promptGroup) {
      this.promptGroup.visible = true;
      this.promptGroup.position.set(nearest.standPos.x, 1.2, nearest.standPos.z);
      this.promptGroup.lookAt(this.camera.position);
      this.promptGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);

      // Notify HUD if active subject changed
      if (nearest.id !== this.activeSubjectId) {
        this.activeSubjectId = nearest.id;
        this.onSubjectSelect(nearest);
      }
    } else if (this.promptGroup) {
      this.promptGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.25);
      if (this.promptGroup.scale.x < 0.05) this.promptGroup.visible = false;
    }
  }

  updateCamera(delta) {
    if (this.avatarMesh) {
      this.avatarMesh.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);
      this.avatarMesh.rotation.y = this.playerRotation;
      this.avatarMesh.rotation.z = this.bankAngle;
      this.avatarRoot.scale.set(1.0 / Math.sqrt(this.squashStretchY), this.squashStretchY, 1.0 / Math.sqrt(this.squashStretchY));

      if (this.nameplateMesh) {
        this.nameplateMesh.lookAt(this.camera.position);
      }
    }

    if (this.viewMode === '1st') {
      const eyeHeight = 1.68;
      let bob = 0;
      if (this.keys.w || this.keys.s) {
        bob = Math.sin(this.walkAnimTime * 2) * 0.04;
      }
      this.camera.position.set(this.playerPos.x, this.playerPos.y + eyeHeight + bob, this.playerPos.z);

      const lookDist = 5.0;
      const lookX = this.playerPos.x - Math.sin(this.playerRotation) * lookDist;
      const lookZ = this.playerPos.z - Math.cos(this.playerRotation) * lookDist;
      this.camera.lookAt(lookX, this.playerPos.y + eyeHeight + bob * 0.5, lookZ);
    } else {
      // 3rd Person RPG Spring-Arm Follow Camera
      const offsetDist = 2.85;
      const offsetHeight = 1.88;
      const targetCamX = this.playerPos.x + Math.sin(this.playerRotation) * offsetDist;
      const targetCamZ = this.playerPos.z + Math.cos(this.playerRotation) * offsetDist;
      const targetCamY = this.playerPos.y + offsetHeight;

      this.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.16);
      this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.15, this.playerPos.z);
    }

    if (Math.abs(this.camera.fov - this.targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, 0.1);
      this.camera.updateProjectionMatrix();
    }
  }

  onKeyDown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // View toggles
    if (e.key === 'v' || e.key === 'V') {
      this.toggleViewMode();
      return;
    }
    if (e.key === '1') {
      this.setViewMode('1st');
      return;
    }
    if (e.key === '3') {
      this.setViewMode('3rd');
      return;
    }

    // RPG Jump
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      this.triggerJump();
      return;
    }

    // RPG Interact Key 'E'
    if (e.key === 'e' || e.key === 'E') {
      const target = this.closestSubject || this.subjects.find((s) => s.id === this.activeSubjectId);
      if (target) this.onSubjectSelect(target, true);
      return;
    }

    // Movement keys & sprint modifier
    if (e.key === 'Shift') {
      this.keys.Shift = true;
      this.updateRunButtonUI();
      return;
    }

    if (this.keys.hasOwnProperty(e.key)) {
      this.keys[e.key] = true;
      // If manual movement started during scripted walk, hand control back to player
      if (this.walkState) {
        this.walkState = null;
      }
    }
  }

  onKeyUp(e) {
    if (e.key === 'Shift') {
      this.keys.Shift = false;
      this.updateRunButtonUI();
      return;
    }
    if (this.keys.hasOwnProperty(e.key)) {
      this.keys[e.key] = false;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 1. Update RPG dust puffs
    this.updateDustPuffs(dt);

    // 2. Update movement (scripted walk vs manual RPG kinematics)
    if (this.walkState) {
      this.updateWalk(dt);
      if (this.avatarMesh) {
        this.avatarMesh.position.set(this.camPos.x, 0, this.camPos.z);
        this.avatarMesh.visible = (this.viewMode === '3rd');
      }
    } else {
      this.updateManualMovement(dt);
      this.updateCamera(dt);
    }

    // 3. Animate Floating Holographic Stats Banners
    this.hologramMeshes.forEach((holo) => {
      const { baseY, seed } = holo.userData;
      holo.position.y = baseY + Math.sin(time * 1.8 + seed) * 0.035;
    });

    // 4. Animate Dust Motes
    if (this.dustParticles) {
      const positions = this.dustParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.0006;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

if (typeof window !== 'undefined') {
  window.LearningHallScene = LearningHallScene;
}
