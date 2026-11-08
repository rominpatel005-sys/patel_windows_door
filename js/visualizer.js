/**
 * PATEL WINDOW & DOOR - Interactive Architectural 3D & 2D Visualizer Engine
 * Real-time WebGL 3D modeler with animated opening kinematics & 2D CAD elevation drafts
 */

(function () {
  'use strict';

  // Application State
  const state = {
    system: 'door',      // door, window (casement), conservatory
    category: 'door',   // door, window, conservatory
    material: 'aluminum',
    color: 'black',
    glass: 'double_lowe',
    widthFt: 12,
    heightFt: 8,
    gridStyle: 'none',
    viewMode: '3d',
    isOpen: false,
    openProgress: 0.0,
    targetOpenProgress: 0.0,
    camPreset: 'iso'
  };

  // Color Palettes for 2D & 3D
  const colorPalettes = {
    black:          { frame: '#101B3D', border: '#323742', handle: '#D6B36A', glassFill: 'rgba(91, 155, 213, 0.12)' },
    bronze:         { frame: '#3a2d24', border: '#5a4638', handle: '#EDD28E', glassFill: 'rgba(212, 175, 55, 0.12)' },
    charcoal:       { frame: '#152046', border: '#4a5568', handle: '#cbd5e1', glassFill: 'rgba(91, 155, 213, 0.10)' },
    white:          { frame: '#e2e8f0', border: '#cbd5e1', handle: '#1e293b', glassFill: 'rgba(203, 213, 225, 0.15)' },
    natural_oak:    { frame: '#6e4726', border: '#8b5a2b', handle: '#1c1c1c', glassFill: 'rgba(245, 222, 179, 0.12)' },
    // Full 27 Colour Range
    dark_blue:      { frame: '#1a2340', border: '#2a3560', handle: '#D6B36A', glassFill: 'rgba(56,100,200,0.12)' },
    ivory:          { frame: '#f5f0e8', border: '#d8d0c0', handle: '#3a3020', glassFill: 'rgba(220,215,200,0.15)' },
    light_grey:     { frame: '#b0b0b0', border: '#909090', handle: '#2a2a2a', glassFill: 'rgba(180,180,180,0.12)' },
    dark_grey:      { frame: '#6e6e6e', border: '#4e4e4e', handle: '#c0c0c0', glassFill: 'rgba(120,120,120,0.12)' },
    white_foil:     { frame: '#e8e8e8', border: '#c8c8c8', handle: '#2a2a2a', glassFill: 'rgba(220,220,220,0.15)' },
    anthracite_matte:{ frame: '#3a3a38', border: '#525250', handle: '#D6B36A', glassFill: 'rgba(80,80,76,0.12)' },
    irish_oak:      { frame: '#8b5e3c', border: '#a07050', handle: '#1c1c1c', glassFill: 'rgba(180,140,90,0.12)' },
    white_plain:    { frame: '#f0f0f0', border: '#d0d0d0', handle: '#1e293b', glassFill: 'rgba(220,220,220,0.15)' },
    basalt:         { frame: '#3c3c3c', border: '#585858', handle: '#c0c0c0', glassFill: 'rgba(80,80,80,0.12)' },
    dark_red:       { frame: '#7a1a1a', border: '#a02828', handle: '#f0d0d0', glassFill: 'rgba(160,60,60,0.12)' },
    winchester:     { frame: '#9e7c5c', border: '#b89070', handle: '#1c1c1c', glassFill: 'rgba(190,160,120,0.12)' },
    mahogany:       { frame: '#5c3318', border: '#7a4a28', handle: '#c8a060', glassFill: 'rgba(140,80,40,0.12)' },
    burgundy:       { frame: '#6b1f1f', border: '#8a3030', handle: '#f0d0c0', glassFill: 'rgba(150,50,50,0.12)' },
    cream_foil:     { frame: '#e8dfc8', border: '#c8c0a8', handle: '#3a3020', glassFill: 'rgba(220,210,185,0.15)' },
    anthracite_grained:{ frame: '#4a4a4a', border: '#606060', handle: '#D6B36A', glassFill: 'rgba(90,90,88,0.12)' },
    golden_oak:     { frame: '#c8a832', border: '#a88820', handle: '#1c1c1c', glassFill: 'rgba(220,180,60,0.12)' },
    dark_green:     { frame: '#1e3a1e', border: '#2a502a', handle: '#c8c8c8', glassFill: 'rgba(40,100,40,0.12)' },
    swamp_oak:      { frame: '#a07840', border: '#b89058', handle: '#1c1c1c', glassFill: 'rgba(190,150,80,0.12)' },
    oregon:         { frame: '#c8a060', border: '#a88040', handle: '#1c1c1c', glassFill: 'rgba(210,170,100,0.12)' },
    black_foil:     { frame: '#101B3D', border: '#303030', handle: '#D6B36A', glassFill: 'rgba(40,40,40,0.12)' },
    agate_grey:     { frame: '#9ea0a0', border: '#808080', handle: '#2a2a2a', glassFill: 'rgba(160,162,162,0.12)' },
    cedarwood:      { frame: '#a0784a', border: '#886030', handle: '#1c1c1c', glassFill: 'rgba(190,140,80,0.12)' },
    rustic_oak:     { frame: '#7a5838', border: '#5a3818', handle: '#c8b090', glassFill: 'rgba(160,110,70,0.12)' },
    sapeli:         { frame: '#5c3c28', border: '#3c2010', handle: '#c8a080', glassFill: 'rgba(130,80,50,0.12)' },
    anteak:         { frame: '#8c6840', border: '#6c4820', handle: '#1c1c1c', glassFill: 'rgba(170,130,80,0.12)' },
  };

  const threePalettes = {
    black:          { frame: 0x15181d, border: 0x2e3541, handle: 0xc97b3a, roughness: 0.32, metalness: 0.70 },
    bronze:         { frame: 0x382a20, border: 0x5a4638, handle: 0xe8a87c, roughness: 0.30, metalness: 0.75 },
    charcoal:       { frame: 0x262e3a, border: 0x3d495b, handle: 0xd1d5db, roughness: 0.35, metalness: 0.62 },
    white:          { frame: 0xedf1f5, border: 0xcdd5df, handle: 0x1f2937, roughness: 0.42, metalness: 0.18 },
    natural_oak:    { frame: 0x724621, border: 0x8a5528, handle: 0x1e2229, roughness: 0.75, metalness: 0.05 },
    // Full 27 Colour Range — Three.js hex
    dark_blue:      { frame: 0x1a2340, border: 0x2a3560, handle: 0xc97b3a, roughness: 0.30, metalness: 0.60 },
    ivory:          { frame: 0xf5f0e8, border: 0xd8d0c0, handle: 0x3a3020, roughness: 0.50, metalness: 0.10 },
    light_grey:     { frame: 0xb0b0b0, border: 0x909090, handle: 0x2a2a2a, roughness: 0.40, metalness: 0.30 },
    dark_grey:      { frame: 0x6e6e6e, border: 0x4e4e4e, handle: 0xc0c0c0, roughness: 0.35, metalness: 0.45 },
    white_foil:     { frame: 0xe8e8e8, border: 0xc8c8c8, handle: 0x2a2a2a, roughness: 0.45, metalness: 0.15 },
    anthracite_matte:{ frame: 0x3a3a38, border: 0x525250, handle: 0xc97b3a, roughness: 0.60, metalness: 0.20 },
    irish_oak:      { frame: 0x8b5e3c, border: 0xa07050, handle: 0x1c1c1c, roughness: 0.80, metalness: 0.05 },
    white_plain:    { frame: 0xf0f0f0, border: 0xd0d0d0, handle: 0x1e293b, roughness: 0.45, metalness: 0.15 },
    basalt:         { frame: 0x3c3c3c, border: 0x585858, handle: 0xc0c0c0, roughness: 0.50, metalness: 0.35 },
    dark_red:       { frame: 0x7a1a1a, border: 0xa02828, handle: 0xf0d0d0, roughness: 0.40, metalness: 0.25 },
    winchester:     { frame: 0x9e7c5c, border: 0xb89070, handle: 0x1c1c1c, roughness: 0.75, metalness: 0.05 },
    mahogany:       { frame: 0x5c3318, border: 0x7a4a28, handle: 0xc8a060, roughness: 0.80, metalness: 0.05 },
    burgundy:       { frame: 0x6b1f1f, border: 0x8a3030, handle: 0xf0d0c0, roughness: 0.42, metalness: 0.22 },
    cream_foil:     { frame: 0xe8dfc8, border: 0xc8c0a8, handle: 0x3a3020, roughness: 0.48, metalness: 0.12 },
    anthracite_grained:{ frame: 0x4a4a4a, border: 0x606060, handle: 0xc97b3a, roughness: 0.65, metalness: 0.18 },
    golden_oak:     { frame: 0xc8a832, border: 0xa88820, handle: 0x1c1c1c, roughness: 0.78, metalness: 0.05 },
    dark_green:     { frame: 0x1e3a1e, border: 0x2a502a, handle: 0xc8c8c8, roughness: 0.42, metalness: 0.28 },
    swamp_oak:      { frame: 0xa07840, border: 0xb89058, handle: 0x1c1c1c, roughness: 0.78, metalness: 0.05 },
    oregon:         { frame: 0xc8a060, border: 0xa88040, handle: 0x1c1c1c, roughness: 0.76, metalness: 0.05 },
    black_foil:     { frame: 0x1a1a1a, border: 0x303030, handle: 0xc97b3a, roughness: 0.55, metalness: 0.15 },
    agate_grey:     { frame: 0x9ea0a0, border: 0x808080, handle: 0x2a2a2a, roughness: 0.38, metalness: 0.35 },
    cedarwood:      { frame: 0xa0784a, border: 0x886030, handle: 0x1c1c1c, roughness: 0.80, metalness: 0.05 },
    rustic_oak:     { frame: 0x7a5838, border: 0x5a3818, handle: 0xc8b090, roughness: 0.82, metalness: 0.04 },
    sapeli:         { frame: 0x5c3c28, border: 0x3c2010, handle: 0xc8a080, roughness: 0.82, metalness: 0.04 },
    anteak:         { frame: 0x8c6840, border: 0x6c4820, handle: 0x1c1c1c, roughness: 0.80, metalness: 0.05 },
  };

  const glassSpecs = {
    double_lowe: { color: 0x84d2eb, opacity: 0.30, roughness: 0.06, transmission: 0.82 },
    triple_glaze: { color: 0x5bbacc, opacity: 0.42, roughness: 0.08, transmission: 0.70 },
    hurricane_impact: { color: 0x5689a3, opacity: 0.36, roughness: 0.05, transmission: 0.75 }
  };

  // DOM Elements
  const stage3dEl = document.getElementById('visualizer3dStage');
  const stageOverlayEl = document.getElementById('stage3dOverlay');
  const svgEl = document.getElementById('doorWindowSvg');
  const view3dTab = document.getElementById('view3dTab');
  const view2dTab = document.getElementById('view2dTab');
  const doorMotionBtn = document.getElementById('doorMotionBtn');
  const doorMotionBtnLabel = document.getElementById('doorMotionBtnLabel');
  const resetCamBtn = document.getElementById('resetCamBtn');
  const widthRange = document.getElementById('widthRange');
  const heightRange = document.getElementById('heightRange');
  const widthValDisplay = document.getElementById('widthVal');
  const heightValDisplay = document.getElementById('heightVal');
  const dimTagWidth = document.getElementById('dimTagWidth');
  const dimTagHeight = document.getElementById('dimTagHeight');
  const systemTagDisplay = document.getElementById('systemTagDisplay');
  const glassTagDisplay = document.getElementById('glassTagDisplay');

  // Three.js Instances
  let scene, camera, renderer, controls;
  let doorRootGroup = null;
  let animatedKinematics = [];
  let isSceneInit = false;
  let targetCamPos = null;
  let targetCamLookAt = null;

  // Initialize
  function init() {
    bindUIEvents();
    initThreeScene();
    render();
  }

  // Bind Event Listeners
  function bindUIEvents() {
    // 3D vs 2D Tabs
    if (view3dTab && view2dTab) {
      view3dTab.addEventListener('click', () => switchViewMode('3d'));
      view2dTab.addEventListener('click', () => switchViewMode('2d'));
    }

    // Door Open / Close Action Button
    if (doorMotionBtn) {
      doorMotionBtn.addEventListener('click', () => {
        state.isOpen = !state.isOpen;
        state.targetOpenProgress = state.isOpen ? 1.0 : 0.0;
        if (state.isOpen) {
          doorMotionBtn.classList.add('is-open');
          if (doorMotionBtnLabel) doorMotionBtnLabel.textContent = 'Close System (3D)';
        } else {
          doorMotionBtn.classList.remove('is-open');
          if (doorMotionBtnLabel) doorMotionBtnLabel.textContent = 'Open System (3D)';
        }
      });
    }

    // Camera Angle Presets
    document.querySelectorAll('[data-cam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-cam]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const angle = btn.getAttribute('data-cam');
        state.camPreset = angle;
        setCameraPreset(angle);
      });
    });

    // Reset Camera
    if (resetCamBtn) {
      resetCamBtn.addEventListener('click', () => {
        setCameraPreset(state.camPreset || 'iso');
      });
    }

    // System / Category selector pills (Door, Window, Conservatory)
    document.querySelectorAll('[data-system]').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('[data-system]').forEach((p) => p.classList.remove('active'));
        el.classList.add('active');
        const cat = el.getAttribute('data-category') || el.getAttribute('data-system');
        state.category = cat;
        // Map category to 3D system
        if (cat === 'door') {
          state.system = 'bifold';
        } else if (cat === 'window') {
          state.system = 'casement';
        } else if (cat === 'conservatory') {
          state.system = 'conservatory';
        } else {
          state.system = el.getAttribute('data-system');
        }
        // Reset open state
        state.isOpen = false;
        state.openProgress = 0.0;
        state.targetOpenProgress = 0.0;
        if (doorMotionBtn) {
          doorMotionBtn.classList.remove('is-open');
          if (doorMotionBtnLabel) doorMotionBtnLabel.textContent = 'Open System (3D)';
        }
        render();
      });
    });

    // Material selector pills
    document.querySelectorAll('[data-material]').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('[data-material]').forEach((p) => p.classList.remove('active'));
        el.classList.add('active');
        state.material = el.getAttribute('data-material');
        render();
      });
    });

    // Color Swatches (original 5)
    document.querySelectorAll('.color-swatch').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('active'));
        el.classList.add('active');
        state.color = el.getAttribute('data-color');
        render();
      });
    });

    // Full Colour Range — 27 swatches (.colour-swatch with data-colour-key)
    document.querySelectorAll('.colour-swatch').forEach((el) => {
      el.addEventListener('click', () => {
        // Remove active from both swatch types
        document.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('active'));
        document.querySelectorAll('.colour-swatch').forEach((s) => s.classList.remove('colour-active'));
        el.classList.add('colour-active');
        const colourKey = el.getAttribute('data-colour-key');
        if (colourKey) {
          state.color = colourKey;
          render();
        }
      });
    });

    // Glass selector pills
    document.querySelectorAll('[data-glass]').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('[data-glass]').forEach((g) => g.classList.remove('active'));
        el.classList.add('active');
        state.glass = el.getAttribute('data-glass');
        render();
      });
    });

    // Grid selector pills
    document.querySelectorAll('[data-grid]').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('[data-grid]').forEach((g) => g.classList.remove('active'));
        el.classList.add('active');
        state.gridStyle = el.getAttribute('data-grid');
        render();
      });
    });

    // Dimensions
    if (widthRange) {
      widthRange.addEventListener('input', (e) => {
        state.widthFt = parseFloat(e.target.value);
        if (widthValDisplay) widthValDisplay.textContent = state.widthFt + ' ft';
        render();
      });
    }

    if (heightRange) {
      heightRange.addEventListener('input', (e) => {
        state.heightFt = parseFloat(e.target.value);
        if (heightValDisplay) heightValDisplay.textContent = state.heightFt + ' ft';
        render();
      });
    }

    // Quick Quote Bridge
    const applyToQuoteBtn = document.getElementById('applyVisualizerToQuoteBtn');
    if (applyToQuoteBtn) {
      applyToQuoteBtn.addEventListener('click', () => {
        const modal = document.getElementById('quoteModal');
        const notesField = document.getElementById('quoteNotes');
        const systemSelect = document.getElementById('quoteSystem');

        if (systemSelect) {
          systemSelect.value = state.system;
        }

        if (notesField) {
          notesField.value = `Configured System: ${state.system.toUpperCase()} | Material: ${state.material.toUpperCase()} | Color: ${state.color.toUpperCase()} | Dimensions: ${state.widthFt}ft W x ${state.heightFt}ft H | Glass: ${state.glass.toUpperCase()} | Muntins: ${state.gridStyle.toUpperCase()}`;
        }

        if (modal) {
          modal.classList.add('open');
        }
      });
    }
  }

  // Switch between 3D interactive and 2D CAD
  function switchViewMode(mode) {
    state.viewMode = mode;
    if (mode === '3d') {
      if (view3dTab) view3dTab.classList.add('active');
      if (view2dTab) view2dTab.classList.remove('active');
      if (stage3dEl) stage3dEl.style.display = 'block';
      if (stageOverlayEl) stageOverlayEl.style.display = 'flex';
      if (svgEl) svgEl.style.display = 'none';
      onResize3D();
    } else {
      if (view2dTab) view2dTab.classList.add('active');
      if (view3dTab) view3dTab.classList.remove('active');
      if (stage3dEl) stage3dEl.style.display = 'none';
      if (stageOverlayEl) stageOverlayEl.style.display = 'none';
      if (svgEl) svgEl.style.display = 'block';
      renderSvgElevation();
    }
  }

  // =========================================================================
  // THREE.JS 3D ENGINE INITIALIZATION
  // =========================================================================
  function initThreeScene() {
    if (!stage3dEl || typeof THREE === 'undefined') return;

    // 1. Scene & Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a10, 0.025);

    // 2. Camera
    const rect = stage3dEl.getBoundingClientRect();
    const w = rect.width || stage3dEl.clientWidth || 600;
    const h = rect.height || stage3dEl.clientHeight || 440;
    camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    stage3dEl.appendChild(renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 + 0.03; // Don't dip below showroom floor
      controls.minDistance = 3.5;
      controls.maxDistance = 24;
      controls.enablePan = true;
    }

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Sun / Key Light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.45);
    keyLight.position.set(7, 12, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -4;
    scene.add(keyLight);

    // Architectural Cyan Rim Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // Warm Floor Bounce Light
    const bounceLight = new THREE.DirectionalLight(0xd4af37, 0.35);
    bounceLight.position.set(0, -4, 4);
    scene.add(bounceLight);

    // Point light for metallic hardware glint
    const glintLight = new THREE.PointLight(0xffffff, 0.45, 15);
    glintLight.position.set(0, 3, 4);
    scene.add(glintLight);

    // 6. Luxury Dark Studio Showroom Floor
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0A1230,
      roughness: 0.55,
      metalness: 0.25
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Architectural Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0x1e293b, 0x101726);
    grid.position.y = 0;
    scene.add(grid);

    // 7. Responsive Resizer
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => onResize3D());
      ro.observe(stage3dEl);
    }
    window.addEventListener('resize', onResize3D);

    isSceneInit = true;

    // Start 3D Animation Loop
    animate();
  }

  function onResize3D() {
    if (!renderer || !camera || !stage3dEl) return;
    const w = stage3dEl.clientWidth;
    const h = stage3dEl.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smoothly ease openProgress towards target
    if (Math.abs(state.openProgress - state.targetOpenProgress) > 0.001) {
      state.openProgress += (state.targetOpenProgress - state.openProgress) * 0.09;
      // Trigger kinematic update
      for (let i = 0; i < animatedKinematics.length; i++) {
        animatedKinematics[i](state.openProgress);
      }
    } else if (state.openProgress !== state.targetOpenProgress) {
      state.openProgress = state.targetOpenProgress;
      for (let i = 0; i < animatedKinematics.length; i++) {
        animatedKinematics[i](state.openProgress);
      }
    }

    // Smooth camera transition if active
    if (targetCamPos && camera) {
      camera.position.lerp(targetCamPos, 0.08);
      if (camera.position.distanceTo(targetCamPos) < 0.05) {
        targetCamPos = null;
      }
    }
    if (targetCamLookAt && controls) {
      controls.target.lerp(targetCamLookAt, 0.08);
      if (controls.target.distanceTo(targetCamLookAt) < 0.02) {
        targetCamLookAt = null;
      }
    }

    if (controls) controls.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Set Camera Presets
  function setCameraPreset(preset) {
    if (!camera || !controls) return;
    const s = 0.38;
    const w = state.widthFt * s;
    const h = state.heightFt * s;
    const targetY = h * 0.5;

    targetCamLookAt = new THREE.Vector3(0, targetY, 0);

    if (preset === 'front') {
      const dist = Math.max(w * 1.35, h * 1.55, 6.2);
      targetCamPos = new THREE.Vector3(0, targetY, dist);
    } else if (preset === 'side') {
      const distSide = Math.max(w * 0.85, 4.5);
      targetCamPos = new THREE.Vector3(distSide, targetY + 0.4, 2.5);
    } else {
      // Perspective / Iso (default)
      const distZ = Math.max(w * 1.05, h * 1.25, 5.8);
      targetCamPos = new THREE.Vector3(w * 0.45, targetY + h * 0.25 + 0.3, distZ);
    }
  }

  // =========================================================================
  // 3D PROCEDURAL ARCHITECTURAL MODEL BUILDER
  // =========================================================================
  function build3DModel() {
    if (!scene) return;

    // Dispose old model cleanly
    if (doorRootGroup) {
      scene.remove(doorRootGroup);
      doorRootGroup.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      doorRootGroup = null;
    }

    animatedKinematics = [];

    // Architectural Dimensions & Scale
    const s = 0.38; // 1 ft = 0.38 Three.js units
    const width = state.widthFt * s;
    const height = state.heightFt * s;
    const frameDepth = 0.22;
    const frameThick = 0.075;
    const sashThick = 0.06;
    const sashDepth = 0.11;

    doorRootGroup = new THREE.Group();
    doorRootGroup.position.set(0, 0, 0);

    // Materials Setup
    const palette = threePalettes[state.color] || threePalettes.black;
    const glassSpec = glassSpecs[state.glass] || glassSpecs.double_lowe;

    // Master Frame Material
    let frameMaterial;
    if (state.material === 'wood_clad') {
      frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x754823,
        roughness: 0.72,
        metalness: 0.05
      });
    } else if (state.material === 'upvc') {
      frameMaterial = new THREE.MeshStandardMaterial({
        color: palette.frame,
        roughness: 0.40,
        metalness: 0.08
      });
    } else {
      // Thermally Broken Aluminum
      frameMaterial = new THREE.MeshStandardMaterial({
        color: palette.frame,
        roughness: palette.roughness,
        metalness: palette.metalness
      });
    }

    const sashMaterial = frameMaterial.clone();

    // Architectural Low-E Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: glassSpec.color,
      transparent: true,
      opacity: glassSpec.opacity,
      roughness: glassSpec.roughness,
      metalness: 0.1,
      transmission: glassSpec.transmission,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      depthWrite: false
    });

    // Hardware Metal Material (Handles & Locks)
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: palette.handle,
      roughness: 0.22,
      metalness: 0.90
    });

    // Stainless / Bronze Track Material
    const trackMaterial = new THREE.MeshStandardMaterial({
      color: 0x333b47,
      roughness: 0.28,
      metalness: 0.85
    });

    // --- 1. Master Outer Structural Frame ---
    const halfW = width / 2;
    const halfH = height / 2;
    const sillH = frameThick * 0.7;

    // Top Header Track
    const headerGeo = new THREE.BoxGeometry(width, frameThick, frameDepth);
    const headerMesh = new THREE.Mesh(headerGeo, frameMaterial);
    headerMesh.position.set(0, height - frameThick / 2, 0);
    headerMesh.castShadow = true;
    headerMesh.receiveShadow = true;
    doorRootGroup.add(headerMesh);

    // Bottom Floor Sill (Embedded Threshold)
    const sillGeo = new THREE.BoxGeometry(width, sillH, frameDepth);
    const sillMesh = new THREE.Mesh(sillGeo, frameMaterial);
    sillMesh.position.set(0, sillH / 2, 0);
    sillMesh.castShadow = true;
    sillMesh.receiveShadow = true;
    doorRootGroup.add(sillMesh);

    // Precision Metallic Runner Track on Sill
    const trackGeo = new THREE.BoxGeometry(width - frameThick * 2, 0.015, frameDepth * 0.65);
    const trackMesh = new THREE.Mesh(trackGeo, trackMaterial);
    trackMesh.position.set(0, sillH + 0.008, 0);
    trackMesh.receiveShadow = true;
    doorRootGroup.add(trackMesh);

    // Left Jamb
    const jambH = height - frameThick - sillH;
    const jambGeo = new THREE.BoxGeometry(frameThick, jambH, frameDepth);
    const leftJamb = new THREE.Mesh(jambGeo, frameMaterial);
    leftJamb.position.set(-halfW + frameThick / 2, sillH + jambH / 2, 0);
    leftJamb.castShadow = true;
    leftJamb.receiveShadow = true;
    doorRootGroup.add(leftJamb);

    // Right Jamb
    const rightJamb = new THREE.Mesh(jambGeo, frameMaterial);
    rightJamb.position.set(halfW - frameThick / 2, sillH + jambH / 2, 0);
    rightJamb.castShadow = true;
    rightJamb.receiveShadow = true;
    doorRootGroup.add(rightJamb);

    // --- 2. Panels, Sashes & Kinematics Engine ---
    const innerW = width - frameThick * 2;
    const innerH = height - frameThick - sillH;
    const innerStartY = sillH;

    // Reusable function to build single sash mesh
    function buildSash(panelW, panelH, handleConfig) {
      const sashGroup = new THREE.Group();
      const st = sashThick;
      const sd = sashDepth;

      // Outer Sash Frame Box parts
      // Left stile
      const lStileGeo = new THREE.BoxGeometry(st, panelH, sd);
      const lStile = new THREE.Mesh(lStileGeo, sashMaterial);
      lStile.position.set(st / 2, panelH / 2, 0);
      lStile.castShadow = true;
      lStile.receiveShadow = true;
      sashGroup.add(lStile);

      // Right stile
      const rStileGeo = new THREE.BoxGeometry(st, panelH, sd);
      const rStile = new THREE.Mesh(rStileGeo, sashMaterial);
      rStile.position.set(panelW - st / 2, panelH / 2, 0);
      rStile.castShadow = true;
      rStile.receiveShadow = true;
      sashGroup.add(rStile);

      // Top rail
      const railW = panelW - st * 2;
      const tRailGeo = new THREE.BoxGeometry(railW, st, sd);
      const tRail = new THREE.Mesh(tRailGeo, sashMaterial);
      tRail.position.set(panelW / 2, panelH - st / 2, 0);
      tRail.castShadow = true;
      tRail.receiveShadow = true;
      sashGroup.add(tRail);

      // Bottom rail (slightly taller architectural profile)
      const bRailH = st * 1.35;
      const bRailGeo = new THREE.BoxGeometry(railW, bRailH, sd);
      const bRail = new THREE.Mesh(bRailGeo, sashMaterial);
      bRail.position.set(panelW / 2, bRailH / 2, 0);
      bRail.castShadow = true;
      bRail.receiveShadow = true;
      sashGroup.add(bRail);

      // Glass Pane
      const glassW = panelW - st * 2;
      const glassH = panelH - st - bRailH;
      const glassGeo = new THREE.BoxGeometry(glassW, glassH, 0.016);
      const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
      glassMesh.position.set(panelW / 2, bRailH + glassH / 2, 0);
      glassMesh.castShadow = false;
      glassMesh.receiveShadow = true;
      sashGroup.add(glassMesh);

      // Muntins / Grids
      if (state.gridStyle === 'colonial') {
        const gridBarMat = sashMaterial;
        const barSize = 0.022;
        // 1 Vertical bar
        const vBarGeo = new THREE.BoxGeometry(barSize, glassH, sd * 0.45);
        const vBar = new THREE.Mesh(vBarGeo, gridBarMat);
        vBar.position.set(panelW / 2, bRailH + glassH / 2, 0);
        vBar.castShadow = true;
        sashGroup.add(vBar);

        // 2 Horizontal bars
        for (let r = 1; r <= 2; r++) {
          const hBarGeo = new THREE.BoxGeometry(glassW, barSize, sd * 0.45);
          const hBar = new THREE.Mesh(hBarGeo, gridBarMat);
          hBar.position.set(panelW / 2, bRailH + (glassH / 3) * r, 0);
          hBar.castShadow = true;
          sashGroup.add(hBar);
        }
      } else if (state.gridStyle === 'prairie') {
        const gridBarMat = sashMaterial;
        const barSize = 0.018;
        const offset = 0.14;
        if (glassW > offset * 2.5 && glassH > offset * 2.5) {
          // Perimeter border lines
          const pVLeft = new THREE.Mesh(new THREE.BoxGeometry(barSize, glassH, sd * 0.4), gridBarMat);
          pVLeft.position.set(st + offset, bRailH + glassH / 2, 0);
          const pVRight = new THREE.Mesh(new THREE.BoxGeometry(barSize, glassH, sd * 0.4), gridBarMat);
          pVRight.position.set(panelW - st - offset, bRailH + glassH / 2, 0);

          const pHBottom = new THREE.Mesh(new THREE.BoxGeometry(glassW, barSize, sd * 0.4), gridBarMat);
          pHBottom.position.set(panelW / 2, bRailH + offset, 0);
          const pHTop = new THREE.Mesh(new THREE.BoxGeometry(glassW, barSize, sd * 0.4), gridBarMat);
          pHTop.position.set(panelW / 2, bRailH + glassH - offset, 0);

          sashGroup.add(pVLeft, pVRight, pHBottom, pHTop);
        }
      }

      // Hardware Handles
      if (handleConfig) {
        if (handleConfig.type === 'pivot_monumental') {
          // Grand 6ft vertical architectural pull bar
          const handleH = Math.min(panelH * 0.65, 2.2);
          const handleBarGeo = new THREE.BoxGeometry(0.024, handleH, 0.035);
          const handleBar = new THREE.Mesh(handleBarGeo, handleMaterial);
          const hX = handleConfig.side === 'left' ? st + 0.12 : panelW - st - 0.12;
          const hY = panelH * 0.5;
          handleBar.position.set(hX, hY, sd / 2 + 0.045);
          handleBar.castShadow = true;

          // Standoff mount pins
          const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.045, 16), handleMaterial);
          pin1.rotation.x = Math.PI / 2;
          pin1.position.set(hX, hY + handleH * 0.4, sd / 2 + 0.022);

          const pin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.045, 16), handleMaterial);
          pin2.rotation.x = Math.PI / 2;
          pin2.position.set(hX, hY - handleH * 0.4, sd / 2 + 0.022);

          sashGroup.add(handleBar, pin1, pin2);
        } else if (handleConfig.type === 'lever') {
          // Sleek modern lever handle with backplate
          const hX = handleConfig.side === 'left' ? st + 0.04 : panelW - st - 0.04;
          const hY = panelH * 0.48;

          const plate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.008), handleMaterial);
          plate.position.set(hX, hY, sd / 2 + 0.004);

          const lever = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.016, 0.016), handleMaterial);
          const leverDir = handleConfig.side === 'left' ? 1 : -1;
          lever.position.set(hX + (0.045 * leverDir), hY + 0.02, sd / 2 + 0.03);

          sashGroup.add(plate, lever);
        }
      }

      return sashGroup;
    }

    // =========================================================
    // SYSTEM-SPECIFIC ARCHITECTURAL CONFIGURATIONS
    // =========================================================
    const sys = state.system;
    const cat = state.category || 'door';

    // Category → system mapping for 3D rendering
    const renderSys = cat === 'door' ? 'bifold'
                    : cat === 'window' ? 'casement'
                    : cat === 'conservatory' ? 'conservatory'
                    : sys;

    if (renderSys === 'bifold') {
      // BI-FOLD ACCORDION PANELS
      const panelCount = state.widthFt >= 16 ? 5 : state.widthFt >= 10 ? 4 : 3;
      const panelW = innerW / panelCount;
      const panelH = innerH;

      if (panelCount === 4) {
        // Bi-parting: 2 panels fold to left, 2 panels fold to right
        // Left Pair
        const leftHinge = new THREE.Group();
        leftHinge.position.set(-halfW + frameThick, innerStartY, 0);

        const p0 = buildSash(panelW, panelH, null);
        leftHinge.add(p0);

        const subHingeLeft = new THREE.Group();
        subHingeLeft.position.set(panelW, 0, 0);
        const p1 = buildSash(panelW, panelH, { type: 'lever', side: 'right' });
        subHingeLeft.add(p1);
        leftHinge.add(subHingeLeft);

        doorRootGroup.add(leftHinge);

        // Right Pair
        const rightHinge = new THREE.Group();
        rightHinge.position.set(halfW - frameThick, innerStartY, 0);

        const p3Group = new THREE.Group();
        p3Group.position.set(-panelW, 0, 0);
        const p3 = buildSash(panelW, panelH, null);
        p3Group.add(p3);
        rightHinge.add(p3Group);

        const subHingeRight = new THREE.Group();
        subHingeRight.position.set(-panelW, 0, 0);
        const p2 = buildSash(panelW, panelH, { type: 'lever', side: 'left' });
        p2.position.set(-panelW, 0, 0);
        subHingeRight.add(p2);
        p3Group.add(subHingeRight);

        doorRootGroup.add(rightHinge);

        // Kinematic Accordion Folding
        animatedKinematics.push((t) => {
          const maxFold = 1.25; // radians (~72 deg)
          leftHinge.rotation.y = t * maxFold;
          subHingeLeft.rotation.y = -t * (maxFold * 2);

          rightHinge.rotation.y = -t * maxFold;
          subHingeRight.rotation.y = t * (maxFold * 2);
        });

      } else {
        // 3 or 5 panels: Folding towards the left
        const leftHinge = new THREE.Group();
        leftHinge.position.set(-halfW + frameThick, innerStartY, 0);

        const p0 = buildSash(panelW, panelH, null);
        leftHinge.add(p0);

        const sub1 = new THREE.Group();
        sub1.position.set(panelW, 0, 0);
        const p1 = buildSash(panelW, panelH, null);
        sub1.add(p1);
        leftHinge.add(sub1);

        const sub2 = new THREE.Group();
        sub2.position.set(panelW, 0, 0);
        const p2 = buildSash(panelW, panelH, { type: 'lever', side: 'right' });
        sub2.add(p2);
        sub1.add(sub2);

        doorRootGroup.add(leftHinge);

        animatedKinematics.push((t) => {
          const fold = t * 1.25;
          leftHinge.rotation.y = fold;
          sub1.rotation.y = -fold * 2;
          sub2.rotation.y = fold * 1.5;
        });
      }

    } else if (sys === 'sliding') {
      // HORIZON MINIMALIST MULTI-TRACK SLIDING WALL
      const panelCount = state.widthFt >= 14 ? 4 : 3;
      const panelW = (innerW / panelCount) * 1.05; // slight overlap
      const panelH = innerH;
      const slidingPanels = [];

      for (let i = 0; i < panelCount; i++) {
        const isLead = i === 0;
        const handleCfg = isLead ? { type: 'lever', side: 'left' } : null;
        const sash = buildSash(panelW, panelH, handleCfg);

        // Stagger along Z for multi-track alignment
        const zOffset = (i - (panelCount - 1) / 2) * (sashDepth * 0.45);
        const defaultX = -halfW + frameThick + i * (innerW / panelCount);

        sash.position.set(defaultX, innerStartY, zOffset);
        doorRootGroup.add(sash);

        slidingPanels.push({ mesh: sash, defaultX, index: i });
      }

      // Slider Kinematics: Panels telescope and stack behind the stationary end panel
      animatedKinematics.push((t) => {
        const stackTargetX = halfW - frameThick - panelW;
        for (let i = 0; i < slidingPanels.length - 1; i++) {
          const p = slidingPanels[i];
          const travel = (stackTargetX - p.defaultX) * 0.92;
          p.mesh.position.x = p.defaultX + travel * t;
        }
      });

    } else if (sys === 'pivot') {
      // APEX GRAND ARCHITECTURAL PIVOT ENTRY DOOR
      const panelW = innerW;
      const panelH = innerH;
      const pivotOffset = Math.min(panelW * 0.22, 0.45); // 22% offset from jamb

      const pivotAxisGroup = new THREE.Group();
      pivotAxisGroup.position.set(-halfW + frameThick + pivotOffset, innerStartY, 0);

      const doorLeaf = buildSash(panelW, panelH, { type: 'pivot_monumental', side: 'right' });
      doorLeaf.position.set(-pivotOffset, 0, 0);
      pivotAxisGroup.add(doorLeaf);

      // Floor & Ceiling Precision Pivot Stainless Hardware
      const pivotPlateGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.035, 24);
      const floorPivot = new THREE.Mesh(pivotPlateGeo, handleMaterial);
      floorPivot.position.set(0, 0.015, 0);
      pivotAxisGroup.add(floorPivot);

      const ceilPivot = new THREE.Mesh(pivotPlateGeo, handleMaterial);
      ceilPivot.position.set(0, panelH - 0.015, 0);
      pivotAxisGroup.add(ceilPivot);

      doorRootGroup.add(pivotAxisGroup);

      // Pivot kinematics: Rotates around vertical offset axis
      animatedKinematics.push((t) => {
        pivotAxisGroup.rotation.y = t * 1.35; // ~78 degrees
      });

    } else if (sys === 'casement') {
      // NORDIC SLIM CASEMENT WINDOW
      const panelCount = state.widthFt >= 10 ? 3 : 2;
      const panelW = innerW / panelCount;
      const panelH = innerH;

      // Left Sash (swings out left)
      const leftHinge = new THREE.Group();
      leftHinge.position.set(-halfW + frameThick, innerStartY, 0);
      const leftSash = buildSash(panelW, panelH, { type: 'lever', side: 'right' });
      leftHinge.add(leftSash);
      doorRootGroup.add(leftHinge);

      // Right Sash (swings out right)
      const rightHinge = new THREE.Group();
      rightHinge.position.set(halfW - frameThick, innerStartY, 0);
      const rightSash = buildSash(panelW, panelH, { type: 'lever', side: 'left' });
      rightSash.position.set(-panelW, 0, 0);
      rightHinge.add(rightSash);
      doorRootGroup.add(rightHinge);

      if (panelCount === 3) {
        // Center fixed architectural pane
        const centerSash = buildSash(panelW, panelH, null);
        centerSash.position.set(-halfW + frameThick + panelW, innerStartY, 0);
        doorRootGroup.add(centerSash);
      }

      animatedKinematics.push((t) => {
        leftHinge.rotation.y = -t * 1.15; // swings outward
        rightHinge.rotation.y = t * 1.15;
      });

    } else if (sys === 'tilt_turn') {
      // EURO-TECH DUAL TILT & TURN WINDOW
      const panelCount = state.widthFt >= 10 ? 3 : 2;
      const panelW = innerW / panelCount;
      const panelH = innerH;

      // Active Tilt-Turn Sash (tilts inwards at top)
      const tiltHinge = new THREE.Group();
      tiltHinge.position.set(-halfW + frameThick, innerStartY, 0);
      const tiltSash = buildSash(panelW, panelH, { type: 'lever', side: 'right' });
      tiltHinge.add(tiltSash);
      doorRootGroup.add(tiltHinge);

      // Second Sash
      const s2 = buildSash(panelW, panelH, { type: 'lever', side: 'left' });
      s2.position.set(halfW - frameThick - panelW, innerStartY, 0);
      doorRootGroup.add(s2);

      if (panelCount === 3) {
        const centerSash = buildSash(panelW, panelH, null);
        centerSash.position.set(-halfW + frameThick + panelW, innerStartY, 0);
        doorRootGroup.add(centerSash);
      }

      // Tilt mode: Rotates around bottom horizontal axis inward
      animatedKinematics.push((t) => {
        tiltHinge.rotation.x = -t * 0.28; // ~16 deg inward ventilation tilt
      });

    } else if (renderSys === 'conservatory' || sys === 'conservatory') {
      // CONSERVATORY & ROOFING — Wide glazed structure with roof
      const panelCount = state.widthFt >= 14 ? 5 : 4;
      const panelW = innerW / panelCount;
      const panelH = innerH;
      const roofH = innerH * 0.4;

      // Side wall panels (glazed)
      for (let i = 0; i < panelCount; i++) {
        const pX = -halfW + frameThick + i * panelW;
        const sash = buildSash(panelW, panelH, null);
        sash.position.set(pX, innerStartY, 0);
        doorRootGroup.add(sash);
      }

      // Roof lantern ridge — sloping roof geometry
      const roofGeom = new THREE.ConeGeometry(halfW * 0.9, roofH, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: threePal.frame,
        roughness: threePal.roughness + 0.1,
        metalness: threePal.metalness,
        transparent: true,
        opacity: 0.75
      });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(0, innerStartY + panelH + roofH / 2, 0);
      doorRootGroup.add(roof);

      // No kinematic animation for conservatory
      animatedKinematics.push(() => {});
    }

    scene.add(doorRootGroup);

    // Apply current open progress immediately
    for (let i = 0; i < animatedKinematics.length; i++) {
      animatedKinematics[i](state.openProgress);
    }

    // Set initial camera view centered to window
    setCameraPreset(state.camPreset || 'iso');
  }

  // =========================================================================
  // MAIN RENDER CONTROLLER
  // =========================================================================
  function render() {
    updateLabels();
    if (state.viewMode === '3d') {
      build3DModel();
    } else {
      renderSvgElevation();
    }
  }

  function updateLabels() {
    if (dimTagWidth) dimTagWidth.textContent = `${state.widthFt} ft (${Math.round(state.widthFt * 304.8)} mm)`;
    if (dimTagHeight) dimTagHeight.textContent = `${state.heightFt} ft (${Math.round(state.heightFt * 304.8)} mm)`;
    if (systemTagDisplay) {
      const labelMap = { door: 'DOOR', window: 'WINDOW', conservatory: 'CONSERVATORIES & ROOFING' };
      systemTagDisplay.textContent = labelMap[state.category] || state.system.replace('_', ' ').toUpperCase();
    }
    if (glassTagDisplay) glassTagDisplay.textContent = state.glass.replace('_', ' ').toUpperCase();
  }

  // =========================================================================
  // 2D CAD SVG ELEVATION RENDERER (Preserved for 2D CAD Mode)
  // =========================================================================
  function renderSvgElevation() {
    if (!svgEl) return;

    const col = colorPalettes[state.color] || colorPalettes.black;
    const viewW = 600;
    const viewH = 360;
    const pad = 30;

    const ratio = state.widthFt / state.heightFt;
    let frameW, frameH;

    if (ratio > 1.6) {
      frameW = viewW - pad * 2;
      frameH = frameW / ratio;
      if (frameH > viewH - pad * 2) {
        frameH = viewH - pad * 2;
        frameW = frameH * ratio;
      }
    } else {
      frameH = viewH - pad * 2;
      frameW = frameH * ratio;
      if (frameW > viewW - pad * 2) {
        frameW = viewW - pad * 2;
        frameH = frameW / ratio;
      }
    }

    const frameX = (viewW - frameW) / 2;
    const frameY = (viewH - frameH) / 2;
    const frameThickness = 10;

    let panelSvg = '';
    const innerX = frameX + frameThickness;
    const innerY = frameY + frameThickness;
    const innerW = frameW - frameThickness * 2;
    const innerH = frameH - frameThickness * 2;

    let panelCount = 1;
    if (state.system === 'bifold' || state.category === 'door') {
      panelCount = state.widthFt >= 16 ? 5 : state.widthFt >= 10 ? 4 : 3;
    } else if (state.system === 'sliding') {
      panelCount = state.widthFt >= 14 ? 4 : 3;
    } else if (state.system === 'casement' || state.system === 'tilt_turn' || state.category === 'window') {
      panelCount = state.widthFt >= 10 ? 3 : 2;
    } else if (state.system === 'pivot') {
      panelCount = 1;
    } else if (state.system === 'conservatory' || state.category === 'conservatory') {
      panelCount = state.widthFt >= 14 ? 5 : 4; // Conservatory wide glazing
    }

    const panelW = innerW / panelCount;

    for (let i = 0; i < panelCount; i++) {
      const pX = innerX + i * panelW;
      const pW = panelW;
      const sashMargin = 3;
      const glassX = pX + sashMargin + 5;
      const glassY = innerY + sashMargin + 5;
      const glassW = pW - (sashMargin + 5) * 2;
      const glassH = innerH - (sashMargin + 5) * 2;

      panelSvg += `
        <rect x="${pX + sashMargin}" y="${innerY + sashMargin}" width="${pW - sashMargin * 2}" height="${innerH - sashMargin * 2}" 
              fill="${col.frame}" stroke="${col.border}" stroke-width="1.5" rx="2" />
      `;

      panelSvg += `
        <rect x="${glassX}" y="${glassY}" width="${glassW}" height="${glassH}" 
              fill="${col.glassFill}" stroke="rgba(255,255,255,0.15)" stroke-width="0.8" />
        <line x1="${glassX + 15}" y1="${glassY + 15}" x2="${glassX + glassW * 0.4}" y2="${glassY + glassH * 0.5}" 
              stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round" />
        <line x1="${glassX + 25}" y1="${glassY + 15}" x2="${glassX + glassW * 0.4 + 10}" y2="${glassY + glassH * 0.5}" 
              stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-linecap="round" />
      `;

      if (state.gridStyle === 'colonial') {
        const gridCols = 2;
        const gridRows = 3;
        for (let c = 1; c < gridCols; c++) {
          const gx = glassX + (glassW / gridCols) * c;
          panelSvg += `<line x1="${gx}" y1="${glassY}" x2="${gx}" y2="${glassY + glassH}" stroke="${col.border}" stroke-width="2"/>`;
        }
        for (let r = 1; r < gridRows; r++) {
          const gy = glassY + (glassH / gridRows) * r;
          panelSvg += `<line x1="${glassX}" y1="${gy}" x2="${glassX + glassW}" y2="${gy}" stroke="${col.border}" stroke-width="2"/>`;
        }
      } else if (state.gridStyle === 'prairie') {
        const offset = 18;
        panelSvg += `
          <line x1="${glassX + offset}" y1="${glassY}" x2="${glassX + offset}" y2="${glassY + glassH}" stroke="${col.border}" stroke-width="1.5"/>
          <line x1="${glassX + glassW - offset}" y1="${glassY}" x2="${glassX + glassW - offset}" y2="${glassY + glassH}" stroke="${col.border}" stroke-width="1.5"/>
          <line x1="${glassX}" y1="${glassY + offset}" x2="${glassX + glassW}" y2="${glassY + offset}" stroke="${col.border}" stroke-width="1.5"/>
          <line x1="${glassX}" y1="${glassY + glassH - offset}" x2="${glassX + glassW}" y2="${glassY + glassH - offset}" stroke="${col.border}" stroke-width="1.5"/>
        `;
      }

      if (state.system === 'pivot') {
        const handleX = pX + pW - 25;
        const handleY = innerY + innerH * 0.2;
        const handleH = innerH * 0.6;
        panelSvg += `
          <rect x="${handleX}" y="${handleY}" width="5" height="${handleH}" fill="${col.handle}" rx="2" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"/>
          <circle cx="${pX + 35}" cy="${innerY + 12}" r="4" fill="${col.handle}"/>
          <circle cx="${pX + 35}" cy="${innerY + innerH - 12}" r="4" fill="${col.handle}"/>
        `;
      } else if (state.system === 'bifold' || state.system === 'sliding') {
        if (i === panelCount - 1 || i === 0) {
          const hX = i === 0 ? pX + pW - 14 : pX + 10;
          const hY = innerY + innerH * 0.5 - 12;
          panelSvg += `
            <rect x="${hX}" y="${hY}" width="4" height="24" fill="${col.handle}" rx="1"/>
          `;
        }
      } else {
        const hX = pX + pW - 12;
        const hY = innerY + innerH * 0.5 - 8;
        panelSvg += `
          <rect x="${hX}" y="${hY}" width="3" height="16" fill="${col.handle}" rx="1"/>
        `;
      }
    }

    const svgContent = `
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
        <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${col.frame}"/>
          <stop offset="100%" stop-color="${col.border}"/>
        </linearGradient>
      </defs>

      <line x1="10" y1="${frameY + frameH + 8}" x2="${viewW - 10}" y2="${frameY + frameH + 8}" stroke="#273449" stroke-width="2" stroke-dasharray="4 4"/>

      <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" 
            fill="url(#frameGrad)" stroke="${col.border}" stroke-width="2" rx="4" filter="url(#shadow)"/>

      ${panelSvg}

      <line x1="${frameX}" y1="${frameY - 14}" x2="${frameX + frameW}" y2="${frameY - 14}" stroke="#64748b" stroke-width="1.2"/>
      <line x1="${frameX}" y1="${frameY - 20}" x2="${frameX}" y2="${frameY - 8}" stroke="#64748b" stroke-width="1.2"/>
      <line x1="${frameX + frameW}" y1="${frameY - 20}" x2="${frameX + frameW}" y2="${frameY - 8}" stroke="#64748b" stroke-width="1.2"/>
      <text x="${frameX + frameW / 2}" y="${frameY - 18}" fill="#94a3b8" font-family="'Space Grotesk', monospace" font-size="11" text-anchor="middle">
        ${state.widthFt}' (${Math.round(state.widthFt * 304.8)}mm)
      </text>

      <line x1="${frameX - 14}" y1="${frameY}" x2="${frameX - 14}" y2="${frameY + frameH}" stroke="#64748b" stroke-width="1.2"/>
      <line x1="${frameX - 20}" y1="${frameY}" x2="${frameX - 8}" y2="${frameY}" stroke="#64748b" stroke-width="1.2"/>
      <line x1="${frameX - 20}" y1="${frameY + frameH}" x2="${frameX - 8}" y2="${frameY + frameH}" stroke="#64748b" stroke-width="1.2"/>
      <text x="${frameX - 22}" y="${frameY + frameH / 2 + 4}" fill="#94a3b8" font-family="'Space Grotesk', monospace" font-size="11" text-anchor="end">
        ${state.heightFt}'
      </text>
    `;

    svgEl.innerHTML = svgContent;
  }

  // Self start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
