/**
 * 🎪 Wobbly Playroom 3D - Scene Architecture & Physics Attractions
 * 
 * Inspired by Wobbly Life:
 * - High-Gloss Lacquer playroom foam & parquet floor with specular reflections
 * - 10/10 PBR Lighting Rig (warm daylight key with soft PCF shadows, colorful rim spots)
 * - Articulated Jellybean Wobbly Avatar with floppy noodle limbs, tracking googly eyes, and interchangeable hats
 * - 7 Signature Wobbly Life Playroom Attractions:
 *   1. Super Bouncy Trampoline (spring launch up to 18m!)
 *   2. Giant Colorful Ball Pit (45+ dynamic rolling physics balls)
 *   3. Mega Spiral Swirly Slide (with climbable padded stairs)
 *   4. Bowling Alley & Knockdown Pins (with strike scatter physics)
 *   5. Drivable Wobbly Bumper Kart (mount, drive, drift & honk)
 *   6. Spinning Playground Carousel & Tilting Seesaw
 *   7. 12 Grabbable Physics Toys (Rubber Ducks, Giant Dice, Beach Balls, Pizza Boxes)
 * - Confetti, star bursts, and dust puff particle systems
 */

class WobblyPlayroomScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Player Avatar Mesh & Limbs
    this.avatarMesh = null;
    this.avatarRoot = null;
    this.avatarHead = null;
    this.eyeL = null;
    this.eyeR = null;
    this.pupilL = null;
    this.pupilR = null;
    this.leftArm = null;
    this.rightArm = null;
    this.leftLeg = null;
    this.rightLeg = null;
    this.heldItemPivot = null;
    this.hatGroup = null;
    this.activeHatType = 'propeller';
    this.propellerBlade = null;

    // Physics Attractions & Meshes
    this.trampolineMesh = null;
    this.trampolineSpring = null;
    this.ballPitBalls = [];
    this.bowlingPins = [];
    this.bowlingBall = null;
    this.grabbableToys = [];
    this.wobblyKart = null;
    this.carouselGroup = null;
    this.seesawPlank = null;
    this.deliveryTargetMesh = null;

    // Particle Systems
    this.confettiParticles = null;
    this.dustPuffs = [];
    this.starBursts = [];

    // Camera settings
    this.viewMode = '3rd'; // '3rd' or '1st'
    this.targetFov = 52;

    this.init();
  }

  init() {
    // 1. Scene & Atmosphere Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1128);
    this.scene.fog = new THREE.FogExp2(0x0a1128, 0.014);

    // 2. Camera Setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 200);
    this.camera.position.set(0, 4.5, 12);
    this.cameraTarget = new THREE.Vector3(0, 1.5, 0);
    this.camera.lookAt(this.cameraTarget);

    // 3. WebGL Renderer with Physically Correct Lighting & Tone Mapping
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

    // 4. Build Environment Layers
    this.buildLightingRig();
    this.buildPlayroomArchitecture();
    this.buildTrampolineAttraction();
    this.buildBallPitAttraction();
    this.buildMegaSpiralSlide();
    this.buildBowlingAlley();
    this.buildWobblyKart();
    this.buildSpinningCarousel();
    this.buildSeesaw();
    this.buildGrabbableToys();
    this.buildDeliveryDropzone();
    this.buildWobblyCharacterAvatar();
    this.buildConfettiSystem();

    window.addEventListener('resize', () => this.onResize());
  }

  /* =========================================================================
     1. PBR LIGHTING RIG & FESTIVE AMBIENCE
     ========================================================================= */
  buildLightingRig() {
    // A. Warm Sky Hemisphere Light (Sky Blue over Soft Buttercream bounce)
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0xfef08a, 0.65);
    hemiLight.position.set(0, 40, 0);
    this.scene.add(hemiLight);

    // B. Key Sunshine Studio Directional Light with soft PCF shadow maps
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.5);
    keyLight.position.set(18, 32, 16);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 5;
    keyLight.shadow.camera.far = 70;
    keyLight.shadow.camera.left = -28;
    keyLight.shadow.camera.right = 28;
    keyLight.shadow.camera.top = 28;
    keyLight.shadow.camera.bottom = -28;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    // C. Fill Light for soft specular contrast
    const fillLight = new THREE.DirectionalLight(0xec4899, 0.4);
    fillLight.position.set(-20, 24, -15);
    this.scene.add(fillLight);

    // D. Attraction Neon Accent Point Lights
    const attractions = [
      { color: 0x10b981, pos: [-14, 2.5, -8], name: 'Trampoline Light' }, // Emerald
      { color: 0xf43f5e, pos: [14, 2.5, -8], name: 'Ball Pit Light' },     // Pink
      { color: 0xfbbf24, pos: [-16, 4.0, 10], name: 'Slide Light' },      // Amber
      { color: 0xa855f7, pos: [16, 2.5, 10], name: 'Bowling Light' },     // Purple
      { color: 0x06b6d4, pos: [0, 3.0, -14], name: 'Carousel Light' }     // Cyan
    ];

    attractions.forEach((a) => {
      const pLight = new THREE.PointLight(a.color, 1.8, 16);
      pLight.position.set(...a.pos);
      this.scene.add(pLight);
    });

    // E. Overhead Softbox Light Fixtures
    const softboxGeom = new THREE.BoxGeometry(6, 0.2, 2);
    const softboxMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });

    [-12, 0, 12].forEach((x) => {
      const box = new THREE.Mesh(softboxGeom, softboxMat);
      box.position.set(x, 14, 0);
      this.scene.add(box);
    });
  }

  /* =========================================================================
     2. PLAYROOM ARCHITECTURE & HIGH-GLOSS LACQUER FLOOR
     ========================================================================= */
  buildPlayroomArchitecture() {
    // 1. High-Gloss Foam/Parquet Lacquer Floor
    const floorGeo = new THREE.PlaneGeometry(54, 44);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.16,
      metalness: 0.72,
      envMapIntensity: 1.4
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Playful Checkerboard Floor Accent Rugs
    const rugColors = [0x38bdf8, 0xf472b6, 0x34d399, 0xfbbf24, 0xa78bfa];
    for (let x = -20; x <= 20; x += 8) {
      for (let z = -14; z <= 14; z += 8) {
        const tileColor = rugColors[Math.abs((x * 7 + z * 13)) % rugColors.length];
        const tileMat = new THREE.MeshStandardMaterial({
          color: tileColor,
          roughness: 0.35,
          metalness: 0.2
        });
        const tile = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.04, 6.8), tileMat);
        tile.position.set(x, 0.02, z);
        tile.receiveShadow = true;
        this.scene.add(tile);
      }
    }

    // 2. Playroom Foam Perimeter Walls (Pastel Mint, Sky Blue & Sunshine Amber)
    const wallMatMint = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.65 });
    const wallMatSky = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.65 });
    const wallMatAmber = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(54, 12, 1), wallMatMint);
    backWall.position.set(0, 6, -22);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Front Wall (with opening)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(54, 12, 1), wallMatSky);
    frontWall.position.set(0, 6, 22);
    frontWall.receiveShadow = true;
    this.scene.add(frontWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 12, 44), wallMatAmber);
    leftWall.position.set(-27, 6, 0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 12, 44), wallMatSky);
    rightWall.position.set(27, 6, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // 3. Mezzanine Observation Balcony
    const balconyGeo = new THREE.BoxGeometry(54, 0.8, 6);
    const balconyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
    const balcony = new THREE.Mesh(balconyGeo, balconyMat);
    balcony.position.set(0, 7.5, -19);
    balcony.receiveShadow = true;
    this.scene.add(balcony);

    // Balcony Railing with Candy Pillars
    for (let x = -26; x <= 26; x += 2.5) {
      const railPillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
      );
      railPillar.position.set(x, 8.6, -16.2);
      this.scene.add(railPillar);
    }

    const handrail = new THREE.Mesh(
      new THREE.BoxGeometry(53, 0.1, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
    );
    handrail.position.set(0, 9.3, -16.2);
    this.scene.add(handrail);

    // 4. Large Luminous Playroom Neon Banner Overhead
    this.buildNeonHeaderSign();

    // 5. Party Pennant Bunting Garland
    this.buildPennantBunting();
  }

  buildNeonHeaderSign() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect(10, 10, 1004, 236, 40);
    ctx.fill();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 64px -apple-system, sans-serif';
    ctx.fillText('🎪 WOBBLY LIFE PLAYROOM 🎪', 512, 105);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('★ SUPER BOUNCE SANDBOX & TOY COURIER ★', 512, 180);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;

    const signMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 4), signMat);
    signMesh.position.set(0, 10.5, -21.4);
    this.scene.add(signMesh);
  }

  buildPennantBunting() {
    const garlandColors = [0xef4444, 0xf59e0b, 0x10b981, 0x06b6d4, 0x8b5cf6, 0xec4899];
    const pCount = 28;
    for (let i = 0; i < pCount; i++) {
      const u = i / (pCount - 1);
      const x = -24 + u * 48;
      const sag = Math.sin(u * Math.PI) * 2.2;
      const y = 11.2 - sag;

      const triShape = new THREE.Shape();
      triShape.moveTo(-0.5, 0);
      triShape.lineTo(0.5, 0);
      triShape.lineTo(0, -0.9);
      triShape.closePath();

      const triGeo = new THREE.ShapeGeometry(triShape);
      const triMat = new THREE.MeshStandardMaterial({
        color: garlandColors[i % garlandColors.length],
        side: THREE.DoubleSide,
        roughness: 0.4
      });
      const pennant = new THREE.Mesh(triGeo, triMat);
      pennant.position.set(x, y, 0);
      pennant.rotation.z = Math.sin(i * 0.8) * 0.15;
      this.scene.add(pennant);
    }
  }

  /* =========================================================================
     3. ATTRACTION 1: THE SUPER BOUNCY TRAMPOLINE
     ========================================================================= */
  buildTrampolineAttraction() {
    const group = new THREE.Group();
    group.position.set(-14, 0, -8);

    // Frame ring
    const frameGeo = new THREE.TorusGeometry(3.2, 0.18, 16, 32);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.rotation.x = Math.PI / 2;
    frame.position.y = 0.95;
    group.add(frame);

    // Trampoline Mat (High-Bounce spring surface)
    const matGeo = new THREE.CylinderGeometry(3.0, 3.0, 0.08, 32);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0x047857,
      emissiveIntensity: 0.4
    });
    this.trampolineMesh = new THREE.Mesh(matGeo, matMat);
    this.trampolineMesh.position.y = 0.95;
    this.trampolineMesh.castShadow = true;
    this.trampolineMesh.receiveShadow = true;
    group.add(this.trampolineMesh);

    // Spring coils around the base
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.95, 8),
        frameMat
      );
      const lx = Math.cos(angle) * 3.1;
      const lz = Math.sin(angle) * 3.1;
      leg.position.set(lx, 0.47, lz);
      group.add(leg);
    }

    // Overhead Trampoline Sign
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#065f46';
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.fill();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillText('🚀 MEGA TRAMPOLINE', 256, 74);
    const signTex = new THREE.CanvasTexture(canvas);
    signTex.encoding = THREE.sRGBEncoding;

    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), new THREE.MeshBasicMaterial({ map: signTex, transparent: true }));
    sign.position.set(0, 3.6, -2.8);
    group.add(sign);

    this.scene.add(group);
  }

  /* =========================================================================
     4. ATTRACTION 2: THE GIANT COLORFUL BALL PIT
     ========================================================================= */
  buildBallPitAttraction() {
    const group = new THREE.Group();
    group.position.set(14, 0, -8);

    // Ball Pit Basin Foam Border
    const basinMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5, metalness: 0.1 });
    
    // Four walls of the pit
    const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.9, 0.4), basinMat);
    wallNorth.position.set(0, 0.45, -3.2);
    group.add(wallNorth);

    const wallSouth = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.9, 0.4), basinMat);
    wallSouth.position.set(0, 0.45, 3.2);
    group.add(wallSouth);

    const wallWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 6.8), basinMat);
    wallWest.position.set(-3.3, 0.45, 0);
    group.add(wallWest);

    const wallEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 6.8), basinMat);
    wallEast.position.set(3.3, 0.45, 0);
    group.add(wallEast);

    // Foam floor inside pit
    const pitFloor = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.1, 6.2),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8 })
    );
    pitFloor.position.set(0, 0.05, 0);
    group.add(pitFloor);

    // 48 Dynamic Physics Spheres inside Ball Pit!
    const ballColors = [0xef4444, 0x3b82f6, 0x10b981, 0xfbbf24, 0xa855f7, 0x06b6d4, 0xf43f5e];
    const ballGeo = new THREE.SphereGeometry(0.32, 12, 12);

    for (let i = 0; i < 48; i++) {
      const bColor = ballColors[i % ballColors.length];
      const bMat = new THREE.MeshStandardMaterial({
        color: bColor,
        roughness: 0.25,
        metalness: 0.4
      });
      const ball = new THREE.Mesh(ballGeo, bMat);
      
      const rx = (Math.random() - 0.5) * 5.4;
      const rz = (Math.random() - 0.5) * 5.2;
      const ry = 0.35 + Math.random() * 0.4;

      ball.position.set(rx, ry, rz);
      ball.castShadow = true;
      ball.receiveShadow = true;

      // Physics velocity & origin
      ball.userData = {
        basePos: new THREE.Vector3(rx + 14, ry, rz - 8),
        velocity: new THREE.Vector3(0, 0, 0),
        angularVel: new THREE.Vector3(0, 0, 0)
      };

      group.add(ball);
      this.ballPitBalls.push(ball);
    }

    // Overhead Sign
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#831843';
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillText('🔴 COLOR BALL PIT 🔵', 256, 74);
    const signTex = new THREE.CanvasTexture(canvas);
    signTex.encoding = THREE.sRGBEncoding;

    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.8), new THREE.MeshBasicMaterial({ map: signTex, transparent: true }));
    sign.position.set(0, 3.2, -3.2);
    group.add(sign);

    this.scene.add(group);
  }

  /* =========================================================================
     5. ATTRACTION 3: THE MEGA SPIRAL SWIRLY SLIDE
     ========================================================================= */
  buildMegaSpiralSlide() {
    const group = new THREE.Group();
    group.position.set(-18, 0, 10);

    // Tower Structure & Platform (Height 5.5m)
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.5 });
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.4, 16), towerMat);
    platform.position.y = 5.5;
    group.add(platform);

    // Support Pillars
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.5, 8), towerMat);
      col.position.set(Math.cos(a) * 1.8, 2.75, Math.sin(a) * 1.8);
      group.add(col);
    }

    // Padded Climbing Stairs to Platform
    const stairMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const numSteps = 14;
    for (let s = 0; s < numSteps; s++) {
      const u = s / numSteps;
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 0.5), stairMat);
      step.position.set(0, u * 5.3 + 0.15, 3.2 - s * 0.45);
      group.add(step);
    }

    // Helical Spiral Chute (Constructed via procedural curved tube segments)
    const curvePoints = [];
    const turns = 1.8;
    const height = 5.2;
    for (let t = 0; t <= 36; t++) {
      const pct = t / 36;
      const angle = pct * Math.PI * 2 * turns;
      const r = 2.4 - pct * 0.4;
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const py = (1 - pct) * height + 0.4;
      curvePoints.push(new THREE.Vector3(px, py, pz));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const chuteGeo = new THREE.TubeGeometry(curve, 48, 0.65, 12, false);
    const chuteMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      metalness: 0.4,
      side: THREE.DoubleSide
    });
    const chute = new THREE.Mesh(chuteGeo, chuteMat);
    chute.castShadow = true;
    group.add(chute);

    // Slide Exit Landing Foam Pad
    const landingPad = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.18, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.8 })
    );
    landingPad.position.set(2.4, 0.09, 0);
    group.add(landingPad);

    this.scene.add(group);
  }

  /* =========================================================================
     6. ATTRACTION 4: THE BOWLING ALLEY & KNOCKDOWN PINS
     ========================================================================= */
  buildBowlingAlley() {
    const group = new THREE.Group();
    group.position.set(16, 0, 10);

    // Polished Maple Wood Bowling Lane
    const laneMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.15,
      metalness: 0.35
    });
    const lane = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 12.0), laneMat);
    lane.position.set(0, 0.06, 0);
    lane.receiveShadow = true;
    group.add(lane);

    // Gutters
    const gutterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const gL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 12.0), gutterMat);
    gL.position.set(-2.0, 0.04, 0);
    group.add(gL);

    const gR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 12.0), gutterMat);
    gR.position.set(2.0, 0.04, 0);
    group.add(gR);

    // 6 Bowling Pins arranged in triangle at end of lane (Z = -4.5)
    const pinGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.55, 10);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2 });
    const redStripeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });

    const pinPositions = [
      { x: 0, z: -4.8 },
      { x: -0.3, z: -4.3 },
      { x: 0.3, z: -4.3 },
      { x: -0.6, z: -3.8 },
      { x: 0, z: -3.8 },
      { x: 0.6, z: -3.8 }
    ];

    pinPositions.forEach((pos, idx) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(pos.x, 0.35, pos.z);

      const pinBody = new THREE.Mesh(pinGeo, pinMat);
      pinBody.castShadow = true;
      pinGroup.add(pinBody);

      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.08, 10), redStripeMat);
      stripe.position.y = 0.12;
      pinGroup.add(stripe);

      pinGroup.userData = {
        basePos: new THREE.Vector3(pos.x + 16, 0.35, pos.z + 10),
        isKnocked: false,
        knockRot: new THREE.Vector3(0, 0, 0)
      };

      group.add(pinGroup);
      this.bowlingPins.push(pinGroup);
    });

    // 1 Bowling Ball on lane
    const bBallMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.15, metalness: 0.85 });
    this.bowlingBall = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), bBallMat);
    this.bowlingBall.position.set(0, 0.42, 3.5);
    this.bowlingBall.castShadow = true;
    this.bowlingBall.userData = {
      velocity: new THREE.Vector3(0, 0, 0),
      isRolling: false
    };
    group.add(this.bowlingBall);

    this.scene.add(group);
  }

  /* =========================================================================
     7. ATTRACTION 5: DRIVABLE WOBBLY BUMPER KART
     ========================================================================= */
  buildWobblyKart() {
    this.wobblyKart = new THREE.Group();
    this.wobblyKart.position.set(0, 0.35, 6);

    // Chassis / Body (Cherry Red with Yellow Racing Stripe)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 2.4), bodyMat);
    body.position.y = 0.3;
    body.castShadow = true;
    this.wobblyKart.add(body);

    // Racing Stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.46, 2.42),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
    );
    stripe.position.y = 0.3;
    this.wobblyKart.add(stripe);

    // Rubber Bumper Ring around Kart
    const bumper = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.16, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    );
    bumper.rotation.x = Math.PI / 2;
    bumper.scale.set(0.75, 1.15, 1.0);
    bumper.position.y = 0.22;
    this.wobblyKart.add(bumper);

    // Seat
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.55, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
    );
    seat.position.set(0, 0.58, 0.2);
    this.wobblyKart.add(seat);

    // Steering Wheel
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(0, 0.75, -0.4);
    wheelGroup.rotation.x = -0.45;
    const steeringWheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.04, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 })
    );
    wheelGroup.add(steeringWheel);
    this.wobblyKart.add(wheelGroup);

    // 4 Rubber Wheels with Silver Hubcaps
    this.kartWheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 16);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });

    const wheelPositions = [
      { x: -0.9, y: 0.15, z: -0.85 },
      { x: 0.9, y: 0.15, z: -0.85 },
      { x: -0.9, y: 0.15, z: 0.85 },
      { x: 0.9, y: 0.15, z: 0.85 }
    ];

    wheelPositions.forEach((wp) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wp.x, wp.y, wp.z);

      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 12), hubMat);
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);

      this.wobblyKart.add(wGroup);
      this.kartWheels.push(wGroup);
    });

    // Dual Headlights
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.2 });
    [-0.5, 0.5].forEach((hx) => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12), headlightMat);
      hl.rotation.x = Math.PI / 2;
      hl.position.set(hx, 0.38, -1.22);
      this.wobblyKart.add(hl);
    });

    // Kart Physics State
    this.wobblyKart.userData = {
      isDriven: false,
      speed: 0,
      turnAngle: 0,
      heading: 0,
      driftFactor: 0
    };

    this.scene.add(this.wobblyKart);
  }

  /* =========================================================================
     8. ATTRACTION 6: SPINNING PLAYGROUND CAROUSEL & SEESAW
     ========================================================================= */
  buildSpinningCarousel() {
    this.carouselGroup = new THREE.Group();
    this.carouselGroup.position.set(0, 0, -14);

    // Center Axis Column
    const axis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 1.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 })
    );
    axis.position.y = 0.8;
    this.carouselGroup.add(axis);

    // Rotating Circular Platform
    const platGeo = new THREE.CylinderGeometry(3.4, 3.4, 0.14, 24);
    const platMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.5 });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.position.y = 0.25;
    platform.receiveShadow = true;
    this.carouselGroup.add(platform);

    // Outer Safety Handles
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.05, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
      );
      handle.position.set(Math.cos(ang) * 2.2, 0.85, Math.sin(ang) * 2.2);
      handle.rotation.y = ang;
      this.carouselGroup.add(handle);
    }

    this.scene.add(this.carouselGroup);
  }

  buildSeesaw() {
    const group = new THREE.Group();
    group.position.set(-6, 0, 14);

    // Center Fulcrum Triangular Pivot
    const fulcrum = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 0.75, 4),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
    );
    fulcrum.position.y = 0.38;
    fulcrum.rotation.y = Math.PI / 4;
    group.add(fulcrum);

    // Seesaw Wooden Plank
    this.seesawPlank = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.12, 5.4),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
    );
    this.seesawPlank.position.y = 0.78;
    this.seesawPlank.castShadow = true;
    group.add(this.seesawPlank);

    // Handles & End Seats
    [-2.4, 2.4].forEach((sz) => {
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.08, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
      );
      seat.position.set(0, 0.1, sz);
      this.seesawPlank.add(seat);
    });

    this.scene.add(group);
  }

  /* =========================================================================
     9. ATTRACTION 7: 12 GRABBABLE PHYSICS TOYS
     ========================================================================= */
  buildGrabbableToys() {
    const toySpecs = [
      { id: 'duck1', name: 'Giant Rubber Duck', type: 'duck', pos: [3, 0.35, 2] },
      { id: 'duck2', name: 'Squeaky Duck', type: 'duck', pos: [-4, 0.35, -3] },
      { id: 'dice1', name: 'Giant D6 Dice', type: 'dice', pos: [-2, 0.4, 1] },
      { id: 'dice2', name: 'Neon Lucky Die', type: 'dice', pos: [6, 0.4, -2] },
      { id: 'ball1', name: 'Beach Ball', type: 'beachball', pos: [1, 0.45, -4] },
      { id: 'ball2', name: 'Rainbow Ball', type: 'beachball', pos: [-5, 0.45, 4] },
      { id: 'pizza1', name: 'Wobbly Pizza Box', type: 'pizza', pos: [8, 0.25, 4] },
      { id: 'pizza2', name: 'Extra Cheese Box', type: 'pizza', pos: [-8, 0.25, -2] },
      { id: 'parcel1', name: 'Toy Courier Package', type: 'parcel', pos: [0, 0.3, 0] },
      { id: 'parcel2', name: 'Priority Gift Box', type: 'parcel', pos: [4, 0.3, 5] },
      { id: 'milk1', name: 'Giant Milk Carton', type: 'milk', pos: [-7, 0.45, 6] },
      { id: 'bone1', name: 'Rubber Chew Bone', type: 'bone', pos: [2, 0.25, 7] }
    ];

    toySpecs.forEach((spec) => {
      const toy = this.createToyMesh(spec);
      toy.position.set(...spec.pos);
      toy.castShadow = true;
      toy.receiveShadow = true;
      toy.userData = {
        id: spec.id,
        name: spec.name,
        type: spec.type,
        isHeld: false,
        velocity: new THREE.Vector3(0, 0, 0),
        angularVel: new THREE.Vector3(0, 0, 0)
      };

      this.scene.add(toy);
      this.grabbableToys.push(toy);
    });
  }

  createToyMesh(spec) {
    const group = new THREE.Group();

    if (spec.type === 'duck') {
      // Rubber Duck
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.1 });
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
      
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), yellowMat);
      body.scale.set(1.0, 0.85, 1.2);
      group.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), yellowMat);
      head.position.set(0, 0.32, 0.22);
      group.add(head);

      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 8), orangeMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.3, 0.42);
      group.add(beak);

      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      [-0.1, 0.1].forEach((ex) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeMat);
        eye.position.set(ex, 0.38, 0.36);
        group.add(eye);
      });
    } else if (spec.type === 'dice') {
      // D6 Dice
      const diceMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
      const dice = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), diceMat);
      group.add(dice);

      // Black dots
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), dotMat);
      dot.position.set(0, 0, 0.28);
      group.add(dot);
    } else if (spec.type === 'beachball') {
      // Colorful Beachball
      const ballMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.3 });
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), ballMat);
      group.add(ball);

      const bandMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.2 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 8, 24), bandMat);
      group.add(band);
    } else if (spec.type === 'pizza') {
      // Pizza Box
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.7), boxMat);
      group.add(box);

      const labelMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), labelMat);
      label.rotation.x = -Math.PI / 2;
      label.position.y = 0.075;
      group.add(label);
    } else if (spec.type === 'parcel') {
      // Delivery Gift Parcel
      const parcelMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
      const parcel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), parcelMat);
      group.add(parcel);

      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
      const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.52, 0.12), ribbonMat);
      const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.62), ribbonMat);
      group.add(ribbon1);
      group.add(ribbon2);
    } else {
      // Milk Carton / Generic
      const cartonMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.5 });
      const carton = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.4), cartonMat);
      group.add(carton);
    }

    return group;
  }

  /* =========================================================================
     10. DELIVERY MINI-JOB DROPZONE
     ========================================================================= */
  buildDeliveryDropzone() {
    const group = new THREE.Group();
    group.position.set(0, 0.02, 16);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.8, 32),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);

    const targetCenter = new THREE.Mesh(
      new THREE.CircleGeometry(1.35, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
    );
    targetCenter.rotation.x = -Math.PI / 2;
    group.add(targetCenter);

    // Floating Target Beacon
    const beaconGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.5 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 1.6;
    group.add(beacon);

    this.deliveryTargetMesh = group;
    this.scene.add(group);
  }

  /* =========================================================================
     11. ARTICULATED WOBBLY JELLYBEAN AVATAR (Noodle Limbs & Googly Eyes)
     ========================================================================= */
  buildWobblyCharacterAvatar() {
    this.avatarMesh = new THREE.Group();
    this.avatarMesh.position.set(0, 0, 10);

    // Squash & Stretch Root Pivot
    this.avatarRoot = new THREE.Group();
    this.avatarMesh.add(this.avatarRoot);

    // Jellybean Rubbery Yellow Body Material
    const wobblyYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.15
    });

    // 1. Torso: Curvy Jellybean Cylinder with rounded caps
    this.avatarTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.82, 16), wobblyYellow);
    this.avatarTorso.position.y = 0.95;
    this.avatarTorso.castShadow = true;
    this.avatarRoot.add(this.avatarTorso);

    // 2. Goofy Head with Big Cheeks
    this.avatarHead = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), wobblyYellow);
    this.avatarHead.position.y = 1.48;
    this.avatarHead.castShadow = true;
    this.avatarRoot.add(this.avatarHead);

    // 3. Oversized Googly Eyes (Physical Sclera + Tracking 3D Pupils!)
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

    const eyeGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const pupilGeo = new THREE.SphereGeometry(0.065, 8, 8);

    // Left Eye
    this.eyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    this.eyeL.position.set(-0.14, 1.54, 0.28);
    this.avatarRoot.add(this.eyeL);

    this.pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    this.pupilL.position.set(-0.14, 1.54, 0.39);
    this.avatarRoot.add(this.pupilL);

    // Right Eye
    this.eyeR = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    this.eyeR.position.set(0.14, 1.54, 0.28);
    this.avatarRoot.add(this.eyeR);

    this.pupilR = new THREE.Mesh(pupilGeo, pupilMat);
    this.pupilR.position.set(0.14, 1.54, 0.39);
    this.avatarRoot.add(this.pupilR);

    // Goofy Wobbly Smile
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.16, 1.34, 0.34),
      new THREE.Vector3(0, 1.25, 0.36),
      new THREE.Vector3(0.16, 1.34, 0.34)
    );
    const smileGeo = new THREE.TubeGeometry(smileCurve, 12, 0.025, 8, false);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    this.avatarRoot.add(smile);

    // 4. Floppy Noodle Arms
    const noodleMat = wobblyYellow;
    const armGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.65, 10);

    // Left Noodle Arm
    this.leftArm = new THREE.Group();
    const lArmMesh = new THREE.Mesh(armGeo, noodleMat);
    lArmMesh.position.y = -0.32;
    lArmMesh.castShadow = true;
    this.leftArm.add(lArmMesh);
    this.leftArm.position.set(-0.44, 1.25, 0);
    this.avatarRoot.add(this.leftArm);

    // Right Noodle Arm
    this.rightArm = new THREE.Group();
    const rArmMesh = new THREE.Mesh(armGeo, noodleMat);
    rArmMesh.position.y = -0.32;
    rArmMesh.castShadow = true;
    this.rightArm.add(rArmMesh);
    this.rightArm.position.set(0.44, 1.25, 0);
    this.avatarRoot.add(this.rightArm);

    // Held Item Attachment Pivot (Overhead/Front carrying stance)
    this.heldItemPivot = new THREE.Group();
    this.heldItemPivot.position.set(0, 1.45, 0.55);
    this.avatarRoot.add(this.heldItemPivot);

    // 5. Noodle Legs & Squeaky Sneakers
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.52, 10);
    const sneakerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });

    // Left Leg
    this.leftLeg = new THREE.Group();
    const lLegMesh = new THREE.Mesh(legGeo, noodleMat);
    lLegMesh.position.y = -0.26;
    lLegMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);

    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.34), sneakerMat);
    lShoe.position.set(0, -0.52, 0.06);
    this.leftLeg.add(lShoe);

    this.leftLeg.position.set(-0.18, 0.54, 0);
    this.avatarRoot.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    const rLegMesh = new THREE.Mesh(legGeo, noodleMat);
    rLegMesh.position.y = -0.26;
    rLegMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);

    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.34), sneakerMat);
    rShoe.position.set(0, -0.52, 0.06);
    this.rightLeg.add(rShoe);

    this.rightLeg.position.set(0.18, 0.54, 0);
    this.avatarRoot.add(this.rightLeg);

    // 6. Hat Closet Attachment Point
    this.hatGroup = new THREE.Group();
    this.hatGroup.position.set(0, 1.82, 0);
    this.avatarRoot.add(this.hatGroup);
    this.setHat('propeller');

    // 7. Overhead Level Billboard
    const nameMat = new THREE.MeshBasicMaterial({
      map: this.createRpgNameplateTexture(),
      transparent: true,
      side: THREE.DoubleSide
    });
    this.nameplateMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.44), nameMat);
    this.nameplateMesh.position.set(0, 2.3, 0);
    this.avatarRoot.add(this.nameplateMesh);

    this.scene.add(this.avatarMesh);
  }

  createRpgNameplateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect(10, 10, 492, 120, 24);
    ctx.fill();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 34px -apple-system, sans-serif';
    ctx.fillText('★ WOBBLY GUY ★', 256, 58);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('FLOP FACTOR: 100% // READY', 256, 102);

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  setHat(hatType) {
    this.activeHatType = hatType;
    while (this.hatGroup.children.length > 0) {
      this.hatGroup.remove(this.hatGroup.children[0]);
    }

    if (hatType === 'propeller') {
      // Propeller Beanie
      const capMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 });
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
      cap.rotation.x = Math.PI;
      cap.position.y = -0.15;
      this.hatGroup.add(cap);

      // Rod
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 })
      );
      rod.position.y = 0.12;
      this.hatGroup.add(rod);

      // Spinning Blade
      this.propellerBlade = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.02, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xef4444 })
      );
      this.propellerBlade.position.y = 0.24;
      this.hatGroup.add(this.propellerBlade);
    } else if (hatType === 'chef') {
      // Tall Chef Toque
      const chefMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.2, 12), chefMat);
      base.position.y = 0;
      this.hatGroup.add(base);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.45, 12), chefMat);
      crown.position.y = 0.32;
      this.hatGroup.add(crown);
    } else if (hatType === 'crown') {
      // Royal Golden Crown
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.28, 6), crownMat);
      crown.position.y = 0.14;
      this.hatGroup.add(crown);
    } else if (hatType === 'cone') {
      // Red Party Cone
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 });
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.65, 12), coneMat);
      cone.position.y = 0.32;
      this.hatGroup.add(cone);
    }
  }

  /* =========================================================================
     12. PARTICLES: CONFETTI & DUST PUFFS
     ========================================================================= */
  buildConfettiSystem() {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0xfacc15),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xf43f5e),
      new THREE.Color(0x34d399),
      new THREE.Color(0xa855f7)
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.confettiParticles = new THREE.Points(geo, mat);
    this.scene.add(this.confettiParticles);
  }

  spawnDustPuff(x, z, scale = 1.0) {
    const puffGeo = new THREE.RingGeometry(0.06, 0.24 * scale, 16);
    const puffMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const puff = new THREE.Mesh(puffGeo, puffMat);
    puff.rotation.x = -Math.PI / 2;
    puff.position.set(x, 0.02, z);
    this.scene.add(puff);

    this.dustPuffs.push({
      mesh: puff,
      life: 1.0,
      decay: 2.8,
      grow: 2.0 * scale
    });
  }

  spawnCoinStars(x, y, z) {
    for (let i = 0; i < 12; i++) {
      const starGeo = new THREE.SphereGeometry(0.14, 6, 6);
      const starMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(x, y, z);
      this.scene.add(star);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8.0,
        Math.random() * 6.0 + 3.0,
        (Math.random() - 0.5) * 8.0
      );

      this.starBursts.push({
        mesh: star,
        velocity: vel,
        life: 1.0,
        decay: 1.6
      });
    }
  }

  updateParticles(dt) {
    // 1. Dust Puffs
    for (let i = this.dustPuffs.length - 1; i >= 0; i--) {
      const p = this.dustPuffs[i];
      p.life -= p.decay * dt;
      p.mesh.scale.addScalar(p.grow * dt);
      p.mesh.material.opacity = p.life * 0.8;

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.dustPuffs.splice(i, 1);
      }
    }

    // 2. Star Bursts
    for (let i = this.starBursts.length - 1; i >= 0; i--) {
      const s = this.starBursts[i];
      s.life -= s.decay * dt;
      s.velocity.y -= 14.0 * dt;
      s.mesh.position.addScaledVector(s.velocity, dt);
      s.mesh.scale.setScalar(Math.max(0.01, s.life));

      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        s.mesh.material.dispose();
        this.starBursts.splice(i, 1);
      }
    }

    // 3. Floating Confetti Motes
    if (this.confettiParticles) {
      const pos = this.confettiParticles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= dt * 0.85;
        if (pos[i] < 0.1) pos[i] = 13.5;
      }
      this.confettiParticles.geometry.attributes.position.needsUpdate = true;
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

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 1. Rotate Propeller Hat Blade if equipped
    if (this.propellerBlade) {
      this.propellerBlade.rotation.y += dt * 14.0;
    }

    // 2. Rotate Carousel
    if (this.carouselGroup) {
      this.carouselGroup.rotation.y += dt * 0.45;
    }

    // 3. Gently Wobble Delivery Beacon Ring
    if (this.deliveryTargetMesh) {
      this.deliveryTargetMesh.children[0].scale.setScalar(1.0 + Math.sin(time * 3.5) * 0.08);
    }

    // 4. Update Particle Systems
    this.updateParticles(dt);

    this.renderer.render(this.scene, this.camera);
  }
}

window.WobblyPlayroomScene = WobblyPlayroomScene;
