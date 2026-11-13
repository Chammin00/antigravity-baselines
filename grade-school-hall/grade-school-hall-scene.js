/**
 * 🎒 Grade School Learning Hall: 3D Exhibition Corridor & RPG Character Controller
 * Built on Three.js (r128) with 1K PBR Poly Haven textures, Floating Holographic Stats Banners,
 * Articulated 3D Student Character Avatar, Dual 1st/3rd Person Camera Modes,
 * and an authentic, juicy RPG Movement Engine (Inertia, Sprint, Jump, Turn Banking,
 * Dust Puffs, Overhead Level/Nameplate, and Proximity Zelda/RPG Speech Bubbles).
 * Conforms to CHILDREN_LEARNING_BASELINE.md and HOW_I_LEARN_BASELINE.md.
 */

class GradeSchoolHallScene {
  constructor(canvasContainerId, exhibits, callbacks = {}) {
    this.container = document.getElementById(canvasContainerId);
    this.exhibits = exhibits || [];
    this.onWalkStart = callbacks.onWalkStart || (() => {});
    this.onWalkProgress = callbacks.onWalkProgress || (() => {});
    this.onFootstep = callbacks.onFootstep || (() => {});
    this.onArrive = callbacks.onArrive || (() => {});
    this.onExhibitSelect = callbacks.onExhibitSelect || (() => {});
    this.onViewModeChange = callbacks.onViewModeChange || (() => {});

    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();

    this.activeExhibitId = 1;
    this.interactiveMeshes = [];
    this.hologramMeshes = [];
    this.dustParticles = null;

    // View Mode: '1st' (Eye-Level Traversal) or '3rd' (RPG Third-Person Student Avatar Follow)
    this.viewMode = '3rd'; // Default to 3rd Person for immediate RPG visual feedback

    // -------------------------------------------------------------
    // 🎮 RPG CHARACTER PHYSICS & KINEMATICS STATE
    // -------------------------------------------------------------
    this.playerPos = new THREE.Vector3(0, 0, 14.0);
    this.playerVelocity = new THREE.Vector3(0, 0, 0);
    this.playerRotation = 0; // Radians, 0 faces -Z (down corridor)
    this.bankAngle = 0; // Lean into turns

    // Speed tiers
    this.walkSpeed = 4.2;
    this.sprintSpeed = 7.6;
    this.turnSpeed = 2.8;
    this.accel = 26.0;
    this.friction = 0.82;
    this.isRunning = false; // On-screen Run toggle or active state

    // Jump & Vertical Arc
    this.isGrounded = true;
    this.jumpForce = 5.4;
    this.gravity = 16.0;
    this.verticalVelocity = 0;
    this.squashStretchY = 1.0;

    // Wobbly Life Physics Sandbox & Toys
    this.isFlopped = false;
    this.flopTimer = 0;
    this.heldToy = null;
    this.toys = [];
    this.trampolineMat = null;
    this.trampolineBounceAnim = 0;

    // Animation & Secondary Motion
    this.walkAnimTime = 0;
    this.idleTime = 0;
    this.backpackWobble = 0;
    this.targetFov = 52;
    this.closestExhibit = null;

    // Input Keys
    this.keys = {
      w: false, s: false, a: false, d: false,
      Shift: false, e: false, ' ': false,
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
    };

    // Choreographed Walk State Machine
    this.walkState = null;

    // Audio & Footsteps
    this.audioContext = null;
    this.lastFootstepTime = 0;
    this.footStepInterval = 0.36;

    // RPG Dust Puffs Pool
    this.dustPuffs = [];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070c18);
    this.scene.fog = new THREE.FogExp2(0x070c18, 0.022);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 95);

    const initialExhibit = this.exhibits[0];
    if (initialExhibit && initialExhibit.standPos) {
      this.playerPos.set(initialExhibit.standPos.x, 0, initialExhibit.standPos.z);
    } else {
      this.playerPos.set(0, 0, 12.0);
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.buildArchitecture();
    this.setupLighting();
    this.buildFramedExhibits();
    this.buildFloatingHolograms();
    this.buildArchedWindows();
    this.buildClassroomProps();
    this.buildWobblySandboxElements();
    this.buildStudentAvatar();
    this.buildDustParticles();
    this.buildRpgProximityBubble();
    this.initProceduralAudio();

    this.updateCameraInstant();

    // Event listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    this.container.addEventListener('click', (e) => this.onCanvasClick(e));

    this.animate();
  }

  loadTiledPBR(path, repeatX, repeatY, isColor = false) {
    const tex = this.textureLoader.load(
      path,
      undefined,
      undefined,
      () => this.createFallbackTexture(isColor)
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
    ctx.fillStyle = isColor ? '#1c2538' : '#808080';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = isColor ? '#2d3b58' : '#a0aec0';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 248);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  buildArchitecture() {
    const hallWidth = 7.6;
    const academicLength = 36.0;
    const gamingLength = 22.0;
    const totalLength = academicLength + gamingLength; // 58.0m total world
    const hallHeight = 4.6;

    // =========================================================================
    // 1. MAIN ACADEMIC HALL (z: +20.0 to -16.0)
    // =========================================================================
    const floorDiff = this.loadTiledPBR('assets/textures/herringbone_parquet_diff_1k.jpg', 4, 18, true);
    const floorNor = this.loadTiledPBR('assets/textures/herringbone_parquet_nor_1k.jpg', 4, 18, false);
    const floorRough = this.loadTiledPBR('assets/textures/herringbone_parquet_rough_1k.jpg', 4, 18, false);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorDiff,
      normalMap: floorNor,
      roughnessMap: floorRough,
      roughness: 0.48,
      metalness: 0.12
    });
    const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, academicLength), floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 2.0);
    floorMesh.receiveShadow = true;
    this.scene.add(floorMesh);

    // Schoolhouse Emerald & Gold Center Aisle Carpet Runner
    const runnerMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.85,
      metalness: 0.08
    });
    const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.8, academicLength - 2), runnerMat);
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.005, 2.0);
    runner.receiveShadow = true;
    this.scene.add(runner);

    // Warm Gold Brass Trim along Runner Borders
    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25
    });
    [-0.91, 0.91].forEach((rx) => {
      const trim = new THREE.Mesh(new THREE.PlaneGeometry(0.04, academicLength - 2), brassTrimMat);
      trim.rotation.x = -Math.PI / 2;
      trim.position.set(rx, 0.006, 2.0);
      this.scene.add(trim);
    });

    // 2. Academic Walls
    const wallDiff = this.loadTiledPBR('assets/textures/painted_plaster_wall_diff_1k.jpg', 9, 2, true);
    const wallNor = this.loadTiledPBR('assets/textures/painted_plaster_wall_nor_1k.jpg', 9, 2, false);
    const wallRough = this.loadTiledPBR('assets/textures/painted_plaster_wall_rough_1k.jpg', 9, 2, false);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1b2336,
      map: wallDiff,
      normalMap: wallNor,
      roughnessMap: wallRough,
      roughness: 0.8,
      metalness: 0.04
    });

    // Left Academic Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(academicLength, hallHeight), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-hallWidth / 2, hallHeight / 2, 2.0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right Academic Wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(academicLength, hallHeight), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(hallWidth / 2, hallHeight / 2, 2.0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Back Academic Entrance Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallHeight), wallMat);
    backWall.rotation.y = Math.PI;
    backWall.position.set(0, hallHeight / 2, 20.0);
    this.scene.add(backWall);

    // Academic Ceiling
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.9,
      metalness: 0.05
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, academicLength), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, hallHeight, 2.0);
    this.scene.add(ceiling);

    // Beams in Academic Hall
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x2b1d12,
      roughness: 0.65,
      metalness: 0.15
    });
    for (let z = -14.0; z <= 18.0; z += 4.0) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(hallWidth, 0.24, 0.36), beamMat);
      beam.position.set(0, hallHeight - 0.12, z);
      this.scene.add(beam);
    }

    // =========================================================================
    // 🚪 GRAND ILLUMINATED ARCHWAY: ENTRANCE TO GAMING HALL (z: -16.0)
    // =========================================================================
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, -16.0);

    const archPillarMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.2
    });
    const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const neonPurpleMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });

    // Left and Right Arch Pillars
    [-2.8, 2.8].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.48, hallHeight, 0.48), archPillarMat);
      pillar.position.set(px, hallHeight / 2, 0);
      archGroup.add(pillar);

      const neonStrip = new THREE.Mesh(new THREE.BoxGeometry(0.08, hallHeight - 0.2, 0.5), neonCyanMat);
      neonStrip.position.set(px, hallHeight / 2, 0);
      archGroup.add(neonStrip);
    });

    // Arch Overhead Header Beam
    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.6, 0.48), archPillarMat);
    archBeam.position.set(0, hallHeight - 0.3, 0);
    archGroup.add(archBeam);

    // Illuminated Neon Marquee Sign: "🕹️ ARCADE GAMING HALL 🕹️"
    const marqueeCanvas = document.createElement('canvas');
    marqueeCanvas.width = 1024;
    marqueeCanvas.height = 180;
    const mctx = marqueeCanvas.getContext('2d');
    mctx.fillStyle = '#0a0a14';
    mctx.fillRect(0, 0, 1024, 180);
    mctx.strokeStyle = '#38bdf8';
    mctx.lineWidth = 6;
    mctx.strokeRect(6, 6, 1012, 168);

    mctx.textAlign = 'center';
    mctx.fillStyle = '#fde68a';
    mctx.font = '900 48px -apple-system, sans-serif';
    mctx.fillText('🕹️ ARCADE & GAMING HALL 🕹️', 512, 85);
    mctx.fillStyle = '#38bdf8';
    mctx.font = 'bold 26px monospace';
    mctx.fillText('CHANCENVADERS • TYPING ACADEMY • JUNIOR CHESS • MILK CAPS', 512, 138);

    const marqueeTex = new THREE.CanvasTexture(marqueeCanvas);
    marqueeTex.encoding = THREE.sRGBEncoding;

    const marqueePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 1.0),
      new THREE.MeshBasicMaterial({ map: marqueeTex, side: THREE.DoubleSide })
    );
    marqueePlane.position.set(0, hallHeight - 0.3, -0.26);
    marqueePlane.rotation.y = Math.PI;
    archGroup.add(marqueePlane);

    const marqueePlaneFront = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 1.0),
      new THREE.MeshBasicMaterial({ map: marqueeTex, side: THREE.DoubleSide })
    );
    marqueePlaneFront.position.set(0, hallHeight - 0.3, 0.26);
    archGroup.add(marqueePlaneFront);

    this.scene.add(archGroup);

    // =========================================================================
    // 🕹️ 2. DEDICATED GAMING HALL WING (z: -16.0 to -38.0)
    // =========================================================================
    const arcadeFloorMat = new THREE.MeshStandardMaterial({
      color: 0x09071c, // Deep cosmic arcade violet
      roughness: 0.3,
      metalness: 0.4
    });
    const arcadeFloor = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, gamingLength), arcadeFloorMat);
    arcadeFloor.rotation.x = -Math.PI / 2;
    arcadeFloor.position.set(0, 0, -27.0);
    arcadeFloor.receiveShadow = true;
    this.scene.add(arcadeFloor);

    // Glowing Neon Synthwave Grid Runners in Gaming Hall
    const neonRunnerMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.75
    });
    const arcadeRunner = new THREE.Mesh(new THREE.PlaneGeometry(2.2, gamingLength - 2), neonRunnerMat);
    arcadeRunner.rotation.x = -Math.PI / 2;
    arcadeRunner.position.set(0, 0.005, -27.0);
    this.scene.add(arcadeRunner);

    // Neon Cyber Trim along Arcade Floor
    const cyanTrimMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    [-1.12, 1.12].forEach((cx) => {
      const trim = new THREE.Mesh(new THREE.PlaneGeometry(0.06, gamingLength - 2), cyanTrimMat);
      trim.rotation.x = -Math.PI / 2;
      trim.position.set(cx, 0.007, -27.0);
      this.scene.add(trim);
    });

    // Gaming Hall Walls (Arcade Dark Indigo)
    const arcadeWallMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c1e,
      roughness: 0.7,
      metalness: 0.1
    });

    // Left Arcade Wall
    const leftArcadeWall = new THREE.Mesh(new THREE.PlaneGeometry(gamingLength, hallHeight), arcadeWallMat);
    leftArcadeWall.rotation.y = Math.PI / 2;
    leftArcadeWall.position.set(-hallWidth / 2, hallHeight / 2, -27.0);
    leftArcadeWall.receiveShadow = true;
    this.scene.add(leftArcadeWall);

    // Right Arcade Wall
    const rightArcadeWall = new THREE.Mesh(new THREE.PlaneGeometry(gamingLength, hallHeight), arcadeWallMat);
    rightArcadeWall.rotation.y = -Math.PI / 2;
    rightArcadeWall.position.set(hallWidth / 2, hallHeight / 2, -27.0);
    rightArcadeWall.receiveShadow = true;
    this.scene.add(rightArcadeWall);

    // End Wall of Gaming Hall (Back wall of arcade)
    const arcadeEndWall = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallHeight), arcadeWallMat);
    arcadeEndWall.position.set(0, hallHeight / 2, -38.0);
    arcadeEndWall.receiveShadow = true;
    this.scene.add(arcadeEndWall);

    // Arcade Ceiling
    const arcadeCeiling = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, gamingLength), ceilingMat);
    arcadeCeiling.rotation.x = Math.PI / 2;
    arcadeCeiling.position.set(0, hallHeight, -27.0);
    this.scene.add(arcadeCeiling);

    // Glowing Neon Arcade Wall Sconces
    for (let z = -20.0; z >= -36.0; z -= 6.0) {
      [-hallWidth / 2 + 0.05, hallWidth / 2 - 0.05].forEach((sx, idx) => {
        const sconce = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.8, 0.2),
          idx === 0 ? neonPurpleMat : neonCyanMat
        );
        sconce.position.set(sx, 2.6, z);
        this.scene.add(sconce);

        const sconceLight = new THREE.PointLight(idx === 0 ? 0xa855f7 : 0x06b6d4, 1.2, 5.0);
        sconceLight.position.set(sx < 0 ? sx + 0.3 : sx - 0.3, 2.6, z);
        this.scene.add(sconceLight);
      });
    }
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x28385e, 0.9);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d6, 1.25);
    sunLight.position.set(5, 8, 9);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -14;
    sunLight.shadow.camera.right = 14;
    sunLight.shadow.camera.top = 14;
    sunLight.shadow.camera.bottom = -14;
    sunLight.shadow.bias = -0.0004;
    this.scene.add(sunLight);

    const bounceLight = new THREE.DirectionalLight(0xa5cbf5, 0.45);
    bounceLight.position.set(-5, 6, -6);
    this.scene.add(bounceLight);
  }

  /**
   * 🎨 Builds the Framed Exhibit Paintings & Arcade Cabinets
   */
  buildFramedExhibits() {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x24180d,
      metalness: 0.3,
      roughness: 0.5
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.88,
      roughness: 0.22
    });

    this.exhibits.forEach((exhibit) => {
      const isEndWall = exhibit.wall === 'end';
      const pWidth = isEndWall ? 3.2 : 2.5;
      const pHeight = isEndWall ? 1.9 : 1.55;

      const group = new THREE.Group();
      group.position.set(exhibit.position.x, exhibit.position.y, exhibit.position.z);

      if (exhibit.wall === 'left') {
        group.rotation.y = Math.PI / 2;
      } else if (exhibit.wall === 'right') {
        group.rotation.y = -Math.PI / 2;
      }

      // Outer Frame
      const outerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(pWidth + 0.24, pHeight + 0.24, 0.08),
        frameMat
      );
      outerFrame.castShadow = true;
      group.add(outerFrame);

      // Gold Inset Bevel
      const innerGold = new THREE.Mesh(
        new THREE.BoxGeometry(pWidth + 0.08, pHeight + 0.08, 0.09),
        goldTrimMat
      );
      group.add(innerGold);

      // Painting Canvas Artwork
      const canvasTex = this.createExhibitCanvasTexture(exhibit);
      const canvasMat = new THREE.MeshStandardMaterial({
        map: canvasTex,
        roughness: 0.42,
        metalness: 0.12,
        emissive: new THREE.Color(exhibit.accentHex),
        emissiveIntensity: 0.14
      });

      const canvasMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(pWidth, pHeight),
        canvasMat
      );
      canvasMesh.position.z = 0.052;
      canvasMesh.userData = { exhibitId: exhibit.id, type: 'exhibit' };
      group.add(canvasMesh);
      this.interactiveMeshes.push(canvasMesh);

      // Overhead Spotlight
      const spotLight = new THREE.SpotLight(0xfff8eb, 2.4, 5.5, Math.PI / 4, 0.35, 1.2);
      spotLight.position.set(0, (pHeight / 2) + 0.45, 0.65);
      spotLight.target = canvasMesh;
      group.add(spotLight);

      // Brass Museum Placard Below Painting
      const placardMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.28
      });
      const placard = new THREE.Mesh(
        new THREE.BoxGeometry(1.24, 0.28, 0.02),
        placardMat
      );
      placard.position.set(0, -(pHeight / 2) - 0.24, 0.03);
      group.add(placard);

      // Placard Text Canvas
      const placardTex = this.createPlacardTexture(exhibit);
      const placardCanvasMat = new THREE.MeshBasicMaterial({
        map: placardTex,
        transparent: true
      });
      const placardPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.25),
        placardCanvasMat
      );
      placardPlane.position.set(0, -(pHeight / 2) - 0.24, 0.045);
      placardPlane.userData = { exhibitId: exhibit.id, type: 'placard' };
      group.add(placardPlane);
      this.interactiveMeshes.push(placardPlane);

      // Stand Indicator on Floor (Circular Glowing Target)
      if (exhibit.standPos) {
        const ringGeo = new THREE.RingGeometry(0.45, 0.55, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: exhibit.accentHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI / 2;
        ringMesh.position.set(exhibit.standPos.x, 0.008, exhibit.standPos.z);
        ringMesh.userData = { exhibitId: exhibit.id, type: 'floor_target' };
        this.scene.add(ringMesh);
        this.interactiveMeshes.push(ringMesh);
      }

      this.scene.add(group);
    });
  }

  /**
   * 🌟 FLOATING 3D HOLOGRAPHIC STATS BANNERS ABOVE EACH PICTURE
   */
  buildFloatingHolograms() {
    this.exhibits.forEach((exhibit) => {
      const isEndWall = exhibit.wall === 'end';
      const bannerWidth = isEndWall ? 3.4 : 2.7;
      const bannerHeight = 0.82;

      const group = new THREE.Group();
      const floatY = exhibit.position.y + (isEndWall ? 1.4 : 1.25);
      group.position.set(exhibit.position.x, floatY, exhibit.position.z);

      if (exhibit.wall === 'left') {
        group.rotation.y = Math.PI / 2;
      } else if (exhibit.wall === 'right') {
        group.rotation.y = -Math.PI / 2;
      }

      const holoTex = this.createHologramTexture(exhibit);
      const holoMat = new THREE.MeshStandardMaterial({
        map: holoTex,
        transparent: true,
        opacity: 0.95,
        roughness: 0.2,
        metalness: 0.35,
        emissive: new THREE.Color(exhibit.accentHex),
        emissiveIntensity: 0.28,
        side: THREE.DoubleSide
      });

      const holoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(bannerWidth, bannerHeight),
        holoMat
      );
      holoPlane.position.z = 0.06;
      holoPlane.userData = { exhibitId: exhibit.id, type: 'hologram' };
      group.add(holoPlane);
      this.interactiveMeshes.push(holoPlane);

      const rodMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2
      });
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, bannerWidth + 0.15, 16),
        rodMat
      );
      rod.rotation.z = Math.PI / 2;
      rod.position.y = bannerHeight / 2 + 0.02;
      group.add(rod);

      this.hologramMeshes.push({ group, baseFloatY: floatY });
      this.scene.add(group);
    });
  }

  buildArchedWindows() {
    const vistaTex = this.loadTiledPBR('assets/textures/courtyard_sunset_vista_2k.jpg', 1, 1, true);

    const winZPositions = [8.0, 0.0, -8.0];
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.5,
      metalness: 0.4
    });

    winZPositions.forEach((z) => {
      [-3.78, 3.78].forEach((x) => {
        const isLeft = x < 0;
        const winGroup = new THREE.Group();
        winGroup.position.set(x, 2.5, z);
        winGroup.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;

        const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.6, 0.08), frameMat);
        winGroup.add(winFrame);

        const vistaMat = new THREE.MeshBasicMaterial({
          map: vistaTex,
          side: THREE.DoubleSide
        });
        const vistaMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.88, 2.48), vistaMat);
        vistaMesh.position.z = 0.045;
        winGroup.add(vistaMesh);

        const beamMat = new THREE.MeshBasicMaterial({
          color: 0xfff6dc,
          transparent: true,
          opacity: 0.07,
          side: THREE.DoubleSide
        });
        const beamMesh = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.0, 16, 1, true), beamMat);
        beamMesh.rotation.x = Math.PI / 2;
        beamMesh.position.set(0, -0.6, 1.8);
        winGroup.add(beamMesh);

        this.scene.add(winGroup);
      });
    });
  }

  buildClassroomProps() {
    const clockGroup = new THREE.Group();
    clockGroup.position.set(0, 3.4, 19.8);
    clockGroup.rotation.y = Math.PI;

    const clockRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.06, 32),
      new THREE.MeshStandardMaterial({ color: 0x2b1d12, metalness: 0.3, roughness: 0.4 })
    );
    clockRim.rotation.x = Math.PI / 2;
    clockGroup.add(clockRim);

    const clockFaceTex = this.createClockFaceTexture();
    const clockFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.44, 32),
      new THREE.MeshBasicMaterial({ map: clockFaceTex })
    );
    clockFace.position.z = 0.035;
    clockGroup.add(clockFace);
    this.scene.add(clockGroup);

    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0, 16.5);

    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e150f, roughness: 0.5, metalness: 0.2 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.9, 24), pedestalMat);
    pedestal.position.y = 0.45;
    globeGroup.add(pedestal);

    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25
    });
    this.globeSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), globeMat);
    this.globeSphere.position.y = 1.2;
    globeGroup.add(this.globeSphere);

    const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
    const globeRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 16, 32), ringMat);
    globeRing.position.y = 1.2;
    globeRing.rotation.x = Math.PI / 4;
    globeGroup.add(globeRing);

    this.scene.add(globeGroup);
  }

  /**
   * 🎪 WOBBLY LIFE PHYSICS SANDBOX & PLAYROOM ELEMENTS
   * Interactive super-bouncy trampoline, mini ball pit, grabbable physics toys,
   * and glowing portal into the standalone 3D Wobbly Playroom.
   */
  buildWobblySandboxElements() {
    const sandboxGroup = new THREE.Group();

    // 1. Super-Bouncy Trampoline (x: 0, z: -34.5)
    const trampGroup = new THREE.Group();
    trampGroup.position.set(0, 0, -34.5);

    const trampFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });
    const frameMesh = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 16, 32), trampFrameMat);
    frameMesh.rotation.x = Math.PI / 2;
    frameMesh.position.y = 0.24;
    trampGroup.add(frameMesh);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.24, 12),
        trampFrameMat
      );
      leg.position.set(Math.cos(angle) * 1.25, 0.12, Math.sin(angle) * 1.25);
      trampGroup.add(leg);
    }

    const padMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      metalness: 0.1
    });
    const padMesh = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.28, 32), padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.position.y = 0.25;
    trampGroup.add(padMesh);

    const matMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.2
    });
    this.trampolineMat = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.96, 0.04, 32), matMat);
    this.trampolineMat.position.y = 0.23;
    this.trampolineMat.userData = { type: 'trampoline' };
    trampGroup.add(this.trampolineMat);
    this.interactiveMeshes.push(this.trampolineMat);

    const trampCanvas = document.createElement('canvas');
    trampCanvas.width = 512;
    trampCanvas.height = 120;
    const tctx = trampCanvas.getContext('2d');
    tctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
    tctx.beginPath();
    tctx.roundRect(8, 8, 496, 104, 20);
    tctx.fill();
    tctx.strokeStyle = '#06b6d4';
    tctx.lineWidth = 3;
    tctx.stroke();
    tctx.textAlign = 'center';
    tctx.fillStyle = '#fde68a';
    tctx.font = '900 24px monospace';
    tctx.fillText('🎪 SUPER TRAMPOLINE', 256, 48);
    tctx.fillStyle = '#38bdf8';
    tctx.font = 'bold 18px monospace';
    tctx.fillText('18.5m SPRING LAUNCH • STEP ON!', 256, 84);
    const trampTex = new THREE.CanvasTexture(trampCanvas);
    const trampBanner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.38),
      new THREE.MeshBasicMaterial({ map: trampTex, transparent: true, side: THREE.DoubleSide })
    );
    trampBanner.position.set(0, 1.6, 0);
    trampGroup.add(trampBanner);
    sandboxGroup.add(trampGroup);

    // 2. Mini Ball Pit (x: 1.9, z: -35.8)
    const ballPitGroup = new THREE.Group();
    ballPitGroup.position.set(1.9, 0, -35.8);

    const pitBorderMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.5,
      metalness: 0.1
    });
    const pitBack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.36, 0.1), pitBorderMat);
    pitBack.position.set(0, 0.18, -0.65);
    ballPitGroup.add(pitBack);
    const pitFront = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.36, 0.1), pitBorderMat);
    pitFront.position.set(0, 0.18, 0.65);
    ballPitGroup.add(pitFront);
    const pitLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 1.4), pitBorderMat);
    pitLeft.position.set(-0.8, 0.18, 0);
    ballPitGroup.add(pitLeft);
    const pitRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 1.4), pitBorderMat);
    pitRight.position.set(0.8, 0.18, 0);
    ballPitGroup.add(pitRight);

    const pitFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.8 })
    );
    pitFloor.rotation.x = -Math.PI / 2;
    pitFloor.position.y = 0.02;
    ballPitGroup.add(pitFloor);

    const ballColors = [0xef4444, 0xf59e0b, 0x10b981, 0x06b6d4, 0x8b5cf6, 0xec4899];
    for (let i = 0; i < 24; i++) {
      const bColor = ballColors[i % ballColors.length];
      const ballMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.25, metalness: 0.1 })
      );
      const bx = (Math.random() - 0.5) * 1.2;
      const bz = (Math.random() - 0.5) * 1.0;
      const by = 0.1 + Math.random() * 0.15;
      ballMesh.position.set(bx, by, bz);
      ballPitGroup.add(ballMesh);
    }

    const pitCanvas = document.createElement('canvas');
    pitCanvas.width = 256;
    pitCanvas.height = 80;
    const pctx = pitCanvas.getContext('2d');
    pctx.fillStyle = 'rgba(7, 14, 28, 0.85)';
    pctx.beginPath();
    pctx.roundRect(4, 4, 248, 72, 16);
    pctx.fill();
    pctx.strokeStyle = '#ec4899';
    pctx.lineWidth = 2;
    pctx.stroke();
    pctx.textAlign = 'center';
    pctx.fillStyle = '#f472b6';
    pctx.font = '900 18px monospace';
    pctx.fillText('🤹 MINI BALL PIT', 128, 46);
    const pitTex = new THREE.CanvasTexture(pitCanvas);
    const pitBanner = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.28),
      new THREE.MeshBasicMaterial({ map: pitTex, transparent: true, side: THREE.DoubleSide })
    );
    pitBanner.position.set(0, 0.9, 0);
    ballPitGroup.add(pitBanner);
    sandboxGroup.add(ballPitGroup);

    // 3. Interactive Grabbable Toys Display Table (x: -1.9, z: -34.5)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(-1.9, 0, -34.5);
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.4, roughness: 0.3 })
    );
    tableTop.position.y = 0.42;
    tableGroup.add(tableTop);
    const tableLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 8), trampFrameMat);
    tableLeg1.position.set(-0.65, 0.21, -0.25);
    tableGroup.add(tableLeg1);
    const tableLeg2 = tableLeg1.clone();
    tableLeg2.position.set(0.65, 0.21, -0.25);
    tableGroup.add(tableLeg2);
    const tableLeg3 = tableLeg1.clone();
    tableLeg3.position.set(-0.65, 0.21, 0.25);
    tableGroup.add(tableLeg3);
    const tableLeg4 = tableLeg1.clone();
    tableLeg4.position.set(0.65, 0.21, 0.25);
    tableGroup.add(tableLeg4);
    sandboxGroup.add(tableGroup);

    const toyCanvas = document.createElement('canvas');
    toyCanvas.width = 384;
    toyCanvas.height = 80;
    const tyctx = toyCanvas.getContext('2d');
    tyctx.fillStyle = 'rgba(7, 14, 28, 0.85)';
    tyctx.beginPath();
    tyctx.roundRect(4, 4, 376, 72, 16);
    tyctx.fill();
    tyctx.strokeStyle = '#f59e0b';
    tyctx.lineWidth = 2;
    tyctx.stroke();
    tyctx.textAlign = 'center';
    tyctx.fillStyle = '#fde68a';
    tyctx.font = '900 18px monospace';
    tyctx.fillText('🧸 INTERACTIVE TOYS [G]', 192, 46);
    const toyTex = new THREE.CanvasTexture(toyCanvas);
    const toyBanner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.25),
      new THREE.MeshBasicMaterial({ map: toyTex, transparent: true, side: THREE.DoubleSide })
    );
    toyBanner.position.set(-1.9, 0.95, -34.5);
    sandboxGroup.add(toyBanner);

    // Toy 1: Rubber Duck
    const duckMesh = new THREE.Group();
    const duckMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const duckBody = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), duckMat);
    duckBody.scale.set(1, 0.85, 1.25);
    duckMesh.add(duckBody);
    const duckHead = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), duckMat);
    duckHead.position.set(0, 0.08, 0.06);
    duckMesh.add(duckHead);
    const beakMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
    );
    beakMesh.rotation.x = Math.PI / 2;
    beakMesh.position.set(0, 0.07, 0.15);
    duckMesh.add(beakMesh);
    duckMesh.position.set(-2.3, 0.55, -34.5);
    duckMesh.userData = { isToy: true, name: 'Rubber Duck', toyType: 'duck' };
    this.scene.add(duckMesh);
    this.interactiveMeshes.push(duckMesh);
    this.toys.push({ mesh: duckMesh, type: 'duck', radius: 0.12, velocity: new THREE.Vector3(0, 0, 0), isHeld: false });

    // Toy 2: Delivery Pizza Box
    const pizzaMesh = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.32), boxMat);
    pizzaMesh.add(boxMesh);
    const pizzaLabel = document.createElement('canvas');
    pizzaLabel.width = 128;
    pizzaLabel.height = 128;
    const plctx = pizzaLabel.getContext('2d');
    plctx.fillStyle = '#ef4444';
    plctx.fillRect(0, 0, 128, 128);
    plctx.fillStyle = '#ffffff';
    plctx.font = 'bold 20px sans-serif';
    plctx.textAlign = 'center';
    plctx.fillText('🍕 PIZZA', 64, 64);
    const plTex = new THREE.CanvasTexture(pizzaLabel);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.24),
      new THREE.MeshBasicMaterial({ map: plTex })
    );
    labelMesh.rotation.x = -Math.PI / 2;
    labelMesh.position.y = 0.032;
    pizzaMesh.add(labelMesh);
    pizzaMesh.position.set(-1.9, 0.49, -34.5);
    pizzaMesh.userData = { isToy: true, name: 'Pizza Box', toyType: 'pizza' };
    this.scene.add(pizzaMesh);
    this.interactiveMeshes.push(pizzaMesh);
    this.toys.push({ mesh: pizzaMesh, type: 'pizza', radius: 0.16, velocity: new THREE.Vector3(0, 0, 0), isHeld: false });

    // Toy 3: Lucky Giant D6 Die
    const dieMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    dieMesh.position.set(-1.5, 0.56, -34.5);
    dieMesh.userData = { isToy: true, name: 'Lucky Die', toyType: 'die' };
    this.scene.add(dieMesh);
    this.interactiveMeshes.push(dieMesh);
    this.toys.push({ mesh: dieMesh, type: 'die', radius: 0.12, velocity: new THREE.Vector3(0, 0, 0), isHeld: false });

    // 4. Portal to Standalone 3D Wobbly Playroom (z: -37.8, x: 0)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, -37.8);
    const portalRing = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.95, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      })
    );
    portalRing.rotation.x = -Math.PI / 2;
    portalRing.position.y = 0.012;
    portalRing.userData = { type: 'wobbly_portal' };
    portalGroup.add(portalRing);
    this.interactiveMeshes.push(portalRing);

    const pArchMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const pLeftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16), pArchMat);
    pLeftPillar.position.set(-1.2, 1.6, 0);
    portalGroup.add(pLeftPillar);
    const pRightPillar = pLeftPillar.clone();
    pRightPillar.position.set(1.2, 1.6, 0);
    portalGroup.add(pRightPillar);
    const pBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 16), pArchMat);
    pBeam.rotation.z = Math.PI / 2;
    pBeam.position.set(0, 3.2, 0);
    portalGroup.add(pBeam);

    const pMarqueeCanvas = document.createElement('canvas');
    pMarqueeCanvas.width = 1024;
    pMarqueeCanvas.height = 200;
    const pmctx = pMarqueeCanvas.getContext('2d');
    pmctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    pmctx.beginPath();
    pmctx.roundRect(10, 10, 1004, 180, 24);
    pmctx.fill();
    pmctx.strokeStyle = '#f97316';
    pmctx.lineWidth = 4;
    pmctx.stroke();
    pmctx.textAlign = 'center';
    pmctx.fillStyle = '#fed7aa';
    pmctx.font = '900 42px monospace';
    pmctx.fillText('🎪 3D WOBBLY LIFE PLAYROOM PORTAL', 512, 75);
    pmctx.fillStyle = '#38bdf8';
    pmctx.font = 'bold 24px monospace';
    pmctx.fillText('STEP ONTO LAUNCH PAD OR CLICK TO ENTER FULL PLAYROOM', 512, 130);
    const pMarqueeTex = new THREE.CanvasTexture(pMarqueeCanvas);
    const pMarqueePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 0.55),
      new THREE.MeshBasicMaterial({ map: pMarqueeTex, side: THREE.DoubleSide })
    );
    pMarqueePlane.position.set(0, 2.5, 0);
    pMarqueePlane.userData = { type: 'wobbly_portal' };
    portalGroup.add(pMarqueePlane);
    this.interactiveMeshes.push(pMarqueePlane);

    sandboxGroup.add(portalGroup);
    this.scene.add(sandboxGroup);
  }

  triggerTrampolineBounce() {
    this.isGrounded = false;
    this.verticalVelocity = 11.2;
    this.squashStretchY = 1.45;
    this.trampolineBounceAnim = 1.0;
    this.playChime(880, 'triangle', 0.28);
    this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 2.0);
  }

  triggerFlop() {
    if (this.isFlopped) return;
    this.isFlopped = true;
    this.flopTimer = 1.4;
    this.verticalVelocity = 3.6;
    this.isGrounded = false;
    this.playChime(180, 'sawtooth', 0.2);
    this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.5);

    if (this.heldToy) {
      this.dropHeldToy();
    }

    const flopBtn = document.getElementById('rpg-flop-btn');
    if (flopBtn) {
      flopBtn.classList.add('scale-90', 'ring-2', 'ring-purple-400');
      setTimeout(() => flopBtn.classList.remove('scale-90', 'ring-2', 'ring-purple-400'), 300);
    }
  }

  grabNearestToy() {
    if (this.heldToy) {
      this.dropHeldToy();
      return;
    }

    let nearestToy = null;
    let nearestDist = 2.4;
    this.toys.forEach(toy => {
      if (toy.isHeld) return;
      const d = this.playerPos.distanceTo(toy.mesh.position);
      if (d < nearestDist) {
        nearestDist = d;
        nearestToy = toy;
      }
    });

    if (nearestToy) {
      nearestToy.isHeld = true;
      nearestToy.velocity.set(0, 0, 0);
      if (this.heldItemPivot) {
        this.heldItemPivot.add(nearestToy.mesh);
        nearestToy.mesh.position.set(0, 0, 0);
        nearestToy.mesh.rotation.set(0, 0, 0);
      }
      this.heldToy = nearestToy;
      this.playChime(523.25, 'sine', 0.15);
      this.updateGrabButtonUI();
    } else {
      this.playChime(220, 'sine', 0.08);
    }
  }

  dropHeldToy() {
    if (!this.heldToy) return;
    const toy = this.heldToy;
    this.scene.attach(toy.mesh);
    const forwardX = -Math.sin(this.playerRotation);
    const forwardZ = -Math.cos(this.playerRotation);
    toy.mesh.position.set(
      this.playerPos.x + forwardX * 0.6,
      0.4,
      this.playerPos.z + forwardZ * 0.6
    );
    toy.velocity.set(forwardX * 2.0, 1.5, forwardZ * 2.0);
    toy.isHeld = false;
    this.heldToy = null;
    this.playChime(392, 'sine', 0.12);
    this.updateGrabButtonUI();
  }

  throwHeldToy() {
    if (!this.heldToy) return;
    const toy = this.heldToy;
    this.scene.attach(toy.mesh);
    const forwardX = -Math.sin(this.playerRotation);
    const forwardZ = -Math.cos(this.playerRotation);
    toy.mesh.position.set(
      this.playerPos.x + forwardX * 0.5,
      0.9,
      this.playerPos.z + forwardZ * 0.5
    );
    toy.velocity.set(forwardX * 9.5, 4.8, forwardZ * 9.5);
    toy.isHeld = false;
    this.heldToy = null;
    this.playChime(659.25, 'triangle', 0.18);
    this.updateGrabButtonUI();
  }

  updateGrabButtonUI() {
    const label = document.getElementById('rpg-grab-label');
    const btn = document.getElementById('rpg-grab-btn');
    if (!label || !btn) return;
    if (this.heldToy) {
      label.textContent = `THROW [F] (${this.heldToy.type.toUpperCase()})`;
      btn.classList.add('ring-2', 'ring-amber-300');
    } else {
      label.textContent = 'GRAB [G]';
      btn.classList.remove('ring-2', 'ring-amber-300');
    }
  }

  updateToys(delta) {
    if (this.trampolineBounceAnim > 0) {
      this.trampolineBounceAnim = Math.max(0, this.trampolineBounceAnim - delta * 4);
      if (this.trampolineMat) {
        this.trampolineMat.position.y = 0.23 - Math.sin(this.trampolineBounceAnim * Math.PI) * 0.08;
      }
    }

    this.toys.forEach(toy => {
      if (toy.isHeld) return;
      if (!toy.velocity) return;

      toy.velocity.y -= 14.0 * delta;
      toy.mesh.position.x += toy.velocity.x * delta;
      toy.mesh.position.y += toy.velocity.y * delta;
      toy.mesh.position.z += toy.velocity.z * delta;

      toy.velocity.x *= 0.94;
      toy.velocity.z *= 0.94;

      const floorY = toy.radius || 0.15;
      if (toy.mesh.position.y <= floorY) {
        toy.mesh.position.y = floorY;
        if (Math.abs(toy.velocity.y) > 0.6) {
          toy.velocity.y = -toy.velocity.y * 0.52;
          this.playChime(320, 'sine', 0.06);
        } else {
          toy.velocity.y = 0;
        }
      }

      if (Math.abs(toy.mesh.position.x) > 3.4) {
        toy.mesh.position.x = Math.sign(toy.mesh.position.x) * 3.4;
        toy.velocity.x = -toy.velocity.x * 0.6;
      }
      if (toy.mesh.position.z < -37.5) {
        toy.mesh.position.z = -37.5;
        toy.velocity.z = -toy.velocity.z * 0.6;
      } else if (toy.mesh.position.z > 18.0) {
        toy.mesh.position.z = 18.0;
        toy.velocity.z = -toy.velocity.z * 0.6;
      }
    });
  }

  /**
   * 🏃 3D STUDENT CHARACTER AVATAR WITH RPG ENHANCEMENTS
   * Articulated avatar with squash/stretch root, secondary backpack physics,
   * animated limbs, and overhead RPG Level/Nameplate billboard!
   */
  buildStudentAvatar() {
    this.avatarMesh = new THREE.Group();
    this.avatarMesh.position.copy(this.playerPos);

    // Root squash & stretch pivot
    this.avatarRoot = new THREE.Group();
    this.avatarMesh.add(this.avatarRoot);

    // 1. Torso / School Jacket (Navy with Gold Trim)
    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.7,
      metalness: 0.1
    });
    this.torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.26), jacketMat);
    this.torsoMesh.position.y = 0.82;
    this.torsoMesh.castShadow = true;
    this.avatarRoot.add(this.torsoMesh);

    // School Crest on Jacket Chest
    const crestMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const crest = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), crestMat);
    crest.position.set(0.12, 0.88, 0.135);
    this.avatarRoot.add(crest);

    // 2. Student Backpack with RPG Inertia Wobble
    const packMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Vibrant red school backpack
      roughness: 0.75,
      metalness: 0.1
    });
    this.backpackGroup = new THREE.Group();
    this.backpackGroup.position.set(0, 0.82, -0.13);
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 0.18), packMat);
    backpack.position.z = -0.09;
    backpack.castShadow = true;
    this.backpackGroup.add(backpack);
    this.avatarRoot.add(this.backpackGroup);

    const strapMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    [-0.14, 0.14].forEach((sx) => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.04), strapMat);
      strap.position.set(sx, 0.82, 0.13);
      this.avatarRoot.add(strap);
    });

    // 3. Head & School Cap
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.6,
      metalness: 0.05
    });
    this.avatarHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), skinMat);
    this.avatarHead.position.y = 1.25;
    this.avatarHead.castShadow = true;
    this.avatarRoot.add(this.avatarHead);

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.6
    });
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
    cap.position.set(0, 1.28, 0);
    this.avatarRoot.add(cap);

    const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.14), capMat);
    capVisor.position.set(0, 1.26, 0.22);
    capVisor.rotation.x = 0.15;
    this.avatarRoot.add(capVisor);

    // 4. Limbs: Arms & Walking Legs (Articulated for Walking Kinematics)
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.8
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.5
    });

    // Left Leg Group
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.12, 0.56, 0);
    const lLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.14), pantsMat);
    lLegMesh.position.y = -0.22;
    lLegMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.22), shoeMat);
    lShoe.position.set(0, -0.42, 0.04);
    this.leftLeg.add(lShoe);
    this.avatarRoot.add(this.leftLeg);

    // Right Leg Group
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.12, 0.56, 0);
    const rLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.14), pantsMat);
    rLegMesh.position.y = -0.22;
    rLegMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.22), shoeMat);
    rShoe.position.set(0, -0.42, 0.04);
    this.rightLeg.add(rShoe);
    this.avatarRoot.add(this.rightLeg);

    // Left Arm Group
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.28, 1.02, 0);
    const lArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.12), jacketMat);
    lArmMesh.position.y = -0.21;
    this.leftArm.add(lArmMesh);
    this.avatarRoot.add(this.leftArm);

    // Right Arm Group
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.28, 1.02, 0);
    const rArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.12), jacketMat);
    rArmMesh.position.y = -0.21;
    this.rightArm.add(rArmMesh);
    this.avatarRoot.add(this.rightArm);

    // 5. 🏷️ OVERHEAD RPG LEVEL & NAMEPLATE BILLBOARD
    const nameTex = this.createRpgNameplateTexture();
    const nameMat = new THREE.MeshBasicMaterial({
      map: nameTex,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.nameplateMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.36), nameMat);
    this.nameplateMesh.position.set(0, 1.76, 0);
    this.avatarRoot.add(this.nameplateMesh);

    // 6. Held Item Pivot for Grabbing & Carrying Toys (Wobbly Life Mechanics)
    this.heldItemPivot = new THREE.Group();
    this.heldItemPivot.position.set(0, 0.85, 0.38);
    this.avatarRoot.add(this.heldItemPivot);

    this.scene.add(this.avatarMesh);

    // Initial visibility according to active view mode
    this.avatarMesh.visible = (this.viewMode === '3rd');
  }

  createRpgNameplateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // High-gloss pill background
    ctx.fillStyle = 'rgba(7, 14, 28, 0.9)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 28);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Level Chip
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(24, 26, 120, 40, 12);
    ctx.fill();

    ctx.fillStyle = '#070c18';
    ctx.font = '900 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LV. 1', 84, 55);

    // Title / Class
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px -apple-system, sans-serif';
    ctx.fillText('Junior Scholar 🎒', 160, 56);

    // Mini HP / Stamina Experience Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(24, 86, 464, 18, 9);
    ctx.fill();

    const xpGrad = ctx.createLinearGradient(24, 0, 400, 0);
    xpGrad.addColorStop(0, '#10b981');
    xpGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = xpGrad;
    ctx.beginPath();
    ctx.roundRect(24, 86, 360, 18, 9);
    ctx.fill();

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('⭐ 56 EXP', 484, 134);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /**
   * 💬 ZELDA / RPG PROXIMITY INTERACTION BUBBLE
   * Pops up with spring kinematics when near any exhibit!
   */
  buildRpgProximityBubble() {
    this.promptGroup = new THREE.Group();
    this.promptGroup.position.set(0, 0, 0);
    this.promptGroup.visible = false;
    this.promptGroup.scale.set(0.001, 0.001, 0.001);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(245, 158, 11, 0.95)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 32);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#070c18';
    ctx.font = '900 34px -apple-system, sans-serif';
    ctx.fillText('💬 PRESS [E] TO TALK', 256, 75);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('OR PRESS SPACE TO PRACTICE', 256, 120);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;

    const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
    this.promptMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.48), planeMat);
    this.promptGroup.add(this.promptMesh);

    this.scene.add(this.promptGroup);
  }

  /**
   * 💨 RPG FOOTSTEP DUST PUFF GENERATOR
   */
  spawnDustPuff(x, z, scale = 1.0) {
    const puffGeo = new THREE.RingGeometry(0.05, 0.16 * scale, 16);
    const puffMat = new THREE.MeshBasicMaterial({
      color: 0xfde68a,
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

  buildDustParticles() {
    const pCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 1] = Math.random() * 4.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 38.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  /**
   * 🎶 Procedural Web Audio API Sound Synthesizer
   */
  initProceduralAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio not initialized:", e);
    }
  }

  playChime(freq = 587.33, type = 'triangle', duration = 0.22) {
    if (!this.audioContext) return;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0.22, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  playFootstepSfx(isLeft, isSprinting = false) {
    const pitch = isSprinting ? (isLeft ? 230 : 260) : (isLeft ? 196 : 220);
    this.playChime(pitch, 'sine', isSprinting ? 0.06 : 0.08);
    this.onFootstep({ isLeft });
  }

  /**
   * 📷 DUAL CAMERA MODE CONTROLLER
   */
  setViewMode(mode) {
    if (mode !== '1st' && mode !== '3rd') return;
    this.viewMode = mode;
    this.avatarMesh.visible = (this.viewMode === '3rd');
    this.updateCameraInstant();
    this.onViewModeChange(this.viewMode);
  }

  toggleViewMode() {
    this.setViewMode(this.viewMode === '1st' ? '3rd' : '1st');
  }

  updateCameraInstant() {
    if (this.viewMode === '1st') {
      this.camera.position.set(this.playerPos.x, 1.35, this.playerPos.z);
      const lookZ = this.playerPos.z - Math.cos(this.playerRotation) * 4.0;
      const lookX = this.playerPos.x - Math.sin(this.playerRotation) * 4.0;
      this.camera.lookAt(lookX, 1.35, lookZ);
    } else {
      const offsetDist = 2.8;
      const offsetHeight = 1.85;
      const camX = this.playerPos.x + Math.sin(this.playerRotation) * offsetDist;
      const camZ = this.playerPos.z + Math.cos(this.playerRotation) * offsetDist;
      this.camera.position.set(camX, offsetHeight, camZ);
      this.camera.lookAt(this.playerPos.x, 1.15, this.playerPos.z);
    }
  }

  /**
   * 🚶 CHOREOGRAPHED FIRST/THIRD PERSON WALK TO EXHIBIT
   */
  walkToExhibit(targetExhibitId, autoOpen = false) {
    if (this.walkState) return;

    const target = this.exhibits.find(e => e.id === Number(targetExhibitId));
    if (!target) return;

    const startPos = this.playerPos.clone();
    const endPos = new THREE.Vector3(target.standPos.x, 0, target.standPos.z);
    const startRot = this.playerRotation;

    const dx = target.lookPos.x - target.standPos.x;
    const dz = target.lookPos.z - target.standPos.z;
    const endRot = Math.atan2(-dx, -dz);

    const distance = startPos.distanceTo(endPos);
    const duration = Math.max(1.4, Math.min(3.8, distance * 0.24));

    this.walkState = {
      targetId: target.id,
      targetExhibit: target,
      autoOpen,
      startPos,
      endPos,
      startRot,
      endRot,
      startTime: this.clock.getElapsedTime(),
      duration,
      lastStep: 0
    };

    this.onWalkStart(target);
  }

  updateChoreographedWalk(now) {
    if (!this.walkState) return;
    const ws = this.walkState;
    const elapsed = now - ws.startTime;
    let t = Math.min(1.0, elapsed / ws.duration);

    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    this.playerPos.lerpVectors(ws.startPos, ws.endPos, ease);
    this.playerRotation = THREE.MathUtils.lerp(ws.startRot, ws.endRot, ease);

    this.walkAnimTime += 0.16;
    const swing = Math.sin(this.walkAnimTime * 8) * 0.45;
    this.leftLeg.rotation.x = swing;
    this.rightLeg.rotation.x = -swing;
    this.leftArm.rotation.x = -swing * 0.8;
    this.rightArm.rotation.x = swing * 0.8;

    const stepCount = Math.floor(elapsed / this.footStepInterval);
    if (stepCount > ws.lastStep) {
      ws.lastStep = stepCount;
      this.playFootstepSfx(stepCount % 2 === 0);
      this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 0.8);
    }

    this.onWalkProgress({ progress: t, target: ws.targetExhibit });

    if (t >= 1.0) {
      this.activeExhibitId = ws.targetId;
      const arrivedExhibit = ws.targetExhibit;
      const shouldAutoOpen = ws.autoOpen;
      this.walkState = null;

      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;

      if (arrivedExhibit) {
        this.onArrive(arrivedExhibit);
        if (shouldAutoOpen) {
          this.onExhibitSelect(arrivedExhibit);
        }
      }
    }
  }

  walkToGamingHall() {
    this.walkToTargetPosition(new THREE.Vector3(0, 0, -24.0), Math.PI);
  }

  walkToAcademicHall() {
    this.walkToTargetPosition(new THREE.Vector3(0, 0, 8.0), 0);
  }

  walkToTargetPosition(endPos, endRot = 0) {
    if (this.walkState) return;
    const startPos = this.playerPos.clone();
    const startRot = this.playerRotation;
    const distance = startPos.distanceTo(endPos);
    const duration = Math.max(1.2, Math.min(3.5, distance * 0.18));

    this.walkState = {
      targetId: null,
      targetExhibit: null,
      startPos,
      endPos,
      startRot,
      endRot,
      startTime: this.clock.getElapsedTime(),
      duration,
      lastStep: 0
    };
  }

  /**
   * 🎮 RPG MANUAL MOVEMENT CONTROLLER (Inertia, Sprint, Jump, Turn Lean)
   */
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
    this.targetFov = isSprinting ? 58 : 52; // RPG speed sensation FOV expansion

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
      // Friction drag when stopping
      this.playerVelocity.x *= this.friction;
      this.playerVelocity.z *= this.friction;
    }

    // 3. Jump & Trampoline Physics & Vertical Arc
    // Check Trampoline collision at (x: 0, z: -34.5)
    const distToTramp = Math.hypot(this.playerPos.x - 0, this.playerPos.z - (-34.5));
    if (distToTramp < 1.15 && this.playerPos.y <= 0.35 && this.verticalVelocity <= 1.0) {
      this.triggerTrampolineBounce();
    }

    if (!this.isGrounded) {
      this.verticalVelocity -= this.gravity * delta;
      this.playerPos.y += this.verticalVelocity * delta;

      if (this.playerPos.y <= 0) {
        // Landing Impact!
        this.playerPos.y = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
        this.squashStretchY = 0.82; // Squash on impact
        this.playChime(196, 'sine', 0.1);
        this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.4);
      }
    } else {
      // Elastic rebound from squash
      this.squashStretchY = THREE.MathUtils.lerp(this.squashStretchY, 1.0, 0.22);
    }

    // Update Sandbox Loose Toys
    this.updateToys(delta);

    // Apply horizontal position with hall boundaries (extended to z: -37.8 for portal)
    const nextX = this.playerPos.x + this.playerVelocity.x * delta;
    const nextZ = this.playerPos.z + this.playerVelocity.z * delta;

    if (Math.abs(nextX) < 2.9) this.playerPos.x = nextX;
    if (nextZ > -37.8 && nextZ < 18.5) this.playerPos.z = nextZ;

    // 4. Character Animation Cycles
    if (this.isFlopped) {
      this.flopTimer -= delta;
      this.avatarRoot.rotation.z = THREE.MathUtils.lerp(this.avatarRoot.rotation.z, Math.PI / 2, 0.25);
      this.avatarRoot.rotation.x = Math.sin((1.4 - this.flopTimer) * 12) * 0.2;
      this.avatarRoot.position.y = -0.45;
      if (this.flopTimer <= 0) {
        this.isFlopped = false;
        this.avatarRoot.rotation.z = 0;
        this.avatarRoot.rotation.x = 0;
        this.avatarRoot.position.y = 0;
        this.squashStretchY = 1.25;
        this.playChime(587.33, 'triangle', 0.18);
        this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.2);
      }
    } else {
      this.avatarRoot.position.y = 0;
      this.avatarRoot.rotation.z = this.bankAngle;
      this.avatarRoot.rotation.x = 0;
    }

    const speedMagnitude = Math.sqrt(this.playerVelocity.x * this.playerVelocity.x + this.playerVelocity.z * this.playerVelocity.z);
    const isMoving = speedMagnitude > 0.4 && !this.isFlopped;

    if (isMoving) {
      this.idleTime = 0;
      const animRate = isSprinting ? 18 : 12;
      this.walkAnimTime += delta * animRate;

      const swing = Math.sin(this.walkAnimTime) * (isSprinting ? 0.65 : 0.45);
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.85;
      this.rightArm.rotation.x = swing * 0.85;

      // Backpack secondary bounce
      this.backpackWobble = Math.sin(this.walkAnimTime * 2) * (isSprinting ? 0.15 : 0.08);
      if (this.backpackGroup) this.backpackGroup.rotation.x = this.backpackWobble;

      // Footstep cadence & dust puffs
      const now = this.clock.getElapsedTime();
      const currentInterval = isSprinting ? 0.24 : this.footStepInterval;
      if (now - this.lastFootstepTime > currentInterval) {
        this.lastFootstepTime = now;
        const isLeft = Math.sin(this.walkAnimTime) > 0;
        this.playFootstepSfx(isLeft, isSprinting);
        this.spawnDustPuff(this.playerPos.x, this.playerPos.z, isSprinting ? 1.2 : 0.7);
      }
    } else if (!this.isFlopped) {
      // Idle Breathing & Relaxation
      this.idleTime += delta;
      const breathe = Math.sin(this.idleTime * 2.8) * 0.02;
      this.torsoMesh.position.y = 0.82 + breathe;
      this.avatarHead.position.y = 1.25 + breathe * 1.2;

      // Smoothly return limbs to rest
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 0.2);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 0.2);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, 0.2);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, 0.2);
      if (this.backpackGroup) this.backpackGroup.rotation.x = THREE.MathUtils.lerp(this.backpackGroup.rotation.x, 0, 0.2);
    }

    // Midair leg tuck pose
    if (!this.isGrounded && !this.isFlopped) {
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = 0.4;
      this.leftArm.rotation.x = 0.6;
      this.rightArm.rotation.x = 0.6;
    }

    // Hands forward pose when holding toys
    if (this.heldToy && !this.isFlopped) {
      this.leftArm.rotation.x = -0.7;
      this.rightArm.rotation.x = -0.7;
    }

    // 5. Update Proximity Zelda / RPG Speech Bubble
    this.updateProximityBubble();
  }

  triggerJump() {
    if (!this.isGrounded || this.walkState) return;
    this.isGrounded = false;
    this.verticalVelocity = this.jumpForce;
    this.squashStretchY = 1.25; // Stretch upwards on launch
    this.playChime(659.25, 'triangle', 0.18); // Cheerful spring jump sound
    this.spawnDustPuff(this.playerPos.x, this.playerPos.z, 1.2);

    // Tactile button bounce effect if on screen
    const jumpBtn = document.getElementById('rpg-jump-btn');
    if (jumpBtn) {
      jumpBtn.classList.add('scale-90', 'ring-2', 'ring-cyan-400');
      setTimeout(() => {
        jumpBtn.classList.remove('scale-90', 'ring-2', 'ring-cyan-400');
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
      btn.classList.add('bg-amber-500/30', 'border-amber-400', 'text-amber-300', 'shadow-amber-500/30');
      btn.classList.remove('bg-white/5', 'text-slate-200');
      if (icon) icon.textContent = '🏃';
      if (label) label.textContent = 'RUNNING';
    } else {
      btn.classList.remove('bg-amber-500/30', 'border-amber-400', 'text-amber-300', 'shadow-amber-500/30');
      btn.classList.add('bg-white/5', 'text-slate-200');
      if (icon) icon.textContent = '⚡';
      if (label) label.textContent = 'RUN [Shift]';
    }
  }

  updateProximityBubble() {
    let nearest = null;
    let nearestDist = 3.2;

    this.exhibits.forEach((ex) => {
      const dist = this.playerPos.distanceTo(new THREE.Vector3(ex.standPos.x, 0, ex.standPos.z));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = ex;
      }
    });

    this.closestExhibit = nearest;

    if (nearest && this.promptGroup) {
      this.promptGroup.visible = true;
      const bubbleY = nearest.position.y - 0.7;
      this.promptGroup.position.set(nearest.standPos.x, bubbleY, nearest.standPos.z);
      this.promptGroup.lookAt(this.camera.position);

      // Spring scaling pop-up
      this.promptGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
    } else if (this.promptGroup) {
      this.promptGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.25);
      if (this.promptGroup.scale.x < 0.05) this.promptGroup.visible = false;
    }
  }

  updateCamera(delta) {
    // 1. Position Avatar Mesh with Banking Tilt and Squash/Stretch
    if (this.avatarMesh) {
      this.avatarMesh.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);
      this.avatarMesh.rotation.y = this.playerRotation;
      this.avatarMesh.rotation.z = this.bankAngle; // Lean into turns!
      this.avatarRoot.scale.set(1.0 / Math.sqrt(this.squashStretchY), this.squashStretchY, 1.0 / Math.sqrt(this.squashStretchY));

      // Billboard Nameplate to face active camera
      if (this.nameplateMesh) {
        this.nameplateMesh.lookAt(this.camera.position);
      }
    }

    // 2. Smooth RPG Camera Follow
    if (this.viewMode === '1st') {
      const eyeHeight = 1.35;
      let bob = 0;
      if (this.keys.w || this.keys.s || this.walkState) {
        bob = Math.sin(this.walkAnimTime * 2) * 0.04;
      }
      this.camera.position.set(this.playerPos.x, this.playerPos.y + eyeHeight + bob, this.playerPos.z);

      const lookDist = 4.0;
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

    // 3. Dynamic RPG Field of View Lerp (Wide on Sprint)
    if (Math.abs(this.camera.fov - this.targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, 0.1);
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * 🖼️ Canvas Artwork Renderers for Subjects & Arcade Cabinets
   */
  createExhibitCanvasTexture(exhibit) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
    bgGrad.addColorStop(0, '#0a1020');
    bgGrad.addColorStop(0.5, '#111b33');
    bgGrad.addColorStop(1, '#080d1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = exhibit.themeColor;
    ctx.fillRect(0, 0, 1024, 28);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 48, 964, 560);

    ctx.font = 'bold 96px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(exhibit.icon, 512, 180);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 24px monospace';
    ctx.fillText(`EXHIBIT ${exhibit.roman} • [${exhibit.code}]`, 512, 285);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(exhibit.title, 512, 345);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px -apple-system, sans-serif';
    ctx.fillText(exhibit.subtitle, 512, 400);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(240, 445, 544, 46, 23);
    ctx.fill();
    ctx.strokeStyle = exhibit.themeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`KEY FOCUS: ${exhibit.focusTopic}`, 512, 474);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 18px -apple-system, sans-serif';
    ctx.fillText(`"${exhibit.frankieQuote}"`, 512, 545);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createPlacardTexture(exhibit) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 110;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 512, 110);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 102);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 22px monospace';
    ctx.fillText(`${exhibit.roman}. ${exhibit.title.toUpperCase()}`, 256, 42);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(`READINESS: ${exhibit.readinessPct}% • ${exhibit.gradeStatus}`, 256, 80);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createHologramTexture(exhibit) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 310;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(6, 14, 28, 0.88)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 1004, 290, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 28px monospace';
    ctx.fillText(`✦ ${exhibit.code}`, 48, 65);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`[${exhibit.gradeStatus}]`, 260, 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillText(exhibit.title, 48, 120);

    const barX = 48;
    const barY = 150;
    const barW = 928;
    const barH = 24;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 12);
    ctx.fill();

    const fillW = (barW * exhibit.readinessPct) / 100;
    const fillGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
    fillGrad.addColorStop(0, exhibit.themeColor);
    fillGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = fillGrad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, fillW, barH, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px monospace';
    ctx.fillText(`MASTERY SCORE: ${exhibit.readinessPct}%`, 48, 225);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(exhibit.type === 'game' ? '🎮 PRESS [E] TO PLAY' : '🚀 PRESS [E] TO PRACTICE', 976, 225);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px monospace';
    if (exhibit.quickFacts && exhibit.quickFacts[0]) {
      ctx.fillText(`★ ${exhibit.quickFacts[0].label}: ${exhibit.quickFacts[0].value}`, 48, 270);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createClockFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((num, i) => {
      const angle = (i * 30 - 60) * (Math.PI / 180);
      const nx = 128 + Math.cos(angle) * 92;
      const ny = 128 + Math.sin(angle) * 92;
      ctx.fillText(num.toString(), nx, ny);
    });

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(85, 75);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(170, 60);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 🖱️ Canvas Click Raycaster Interaction
   */
  onCanvasClick(event) {
    if (this.walkState) return;

    const rect = this.container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.interactiveMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;

      // 🎪 Wobbly Life Portal traversal
      if (hit.userData.type === 'wobbly_portal') {
        window.location.href = '../wobbly-playroom/index.html';
        return;
      }

      // 🧸 Grab toy if clicked directly
      if (hit.userData.isToy) {
        this.grabNearestToy();
        return;
      }

      const exhibitId = hit.userData.exhibitId;
      if (exhibitId) {
        if (this.activeExhibitId === exhibitId) {
          const ex = this.exhibits.find(e => e.id === exhibitId);
          if (ex) this.onExhibitSelect(ex);
        } else {
          this.walkToExhibit(exhibitId, true);
        }
      }
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
      // If close to an exhibit and standing still, allow Space to interact; otherwise execute RPG Jump!
      const isMoving = this.keys.w || this.keys.s || this.keys.a || this.keys.d;
      if (this.closestExhibit && !isMoving) {
        this.onExhibitSelect(this.closestExhibit);
      } else {
        this.triggerJump();
      }
      return;
    }

    // RPG Interact Key 'E'
    if (e.key === 'e' || e.key === 'E') {
      const target = this.closestExhibit || this.exhibits.find(ex => ex.id === this.activeExhibitId);
      if (target) this.onExhibitSelect(target);
      return;
    }

    // 🎪 Wobbly Life Physics: Grab Toy [G]
    if (e.key === 'g' || e.key === 'G') {
      this.grabNearestToy();
      return;
    }

    // 🎪 Wobbly Life Physics: Throw Held Toy [F]
    if (e.key === 'f' || e.key === 'F') {
      this.throwHeldToy();
      return;
    }

    // 🎪 Wobbly Life Physics: Ragdoll Flop & Tumble [R]
    if (e.key === 'r' || e.key === 'R') {
      this.triggerFlop();
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

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const now = this.clock.getElapsedTime();

    // 1. Update movement & RPG physics
    if (this.walkState) {
      this.updateChoreographedWalk(now);
    } else {
      this.updateManualMovement(delta);
    }

    // 2. Update camera position & follow dampening
    this.updateCamera(delta);

    // 3. Update RPG Dust Puffs
    this.updateDustPuffs(delta);

    // 4. Gentle floating bobbing for 3D holographic banners
    this.hologramMeshes.forEach((item, index) => {
      const bob = Math.sin(now * 2.2 + index * 0.8) * 0.04;
      item.group.position.y = item.baseFloatY + bob;
    });

    // 5. Spin classroom decorative globe
    if (this.globeSphere) {
      this.globeSphere.rotation.y += delta * 0.4;
    }

    // 6. Dust particle drift
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= delta * 0.08;
        if (pos[i] < 0) pos[i] = 4.2;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.GradeSchoolHallScene = GradeSchoolHallScene;
