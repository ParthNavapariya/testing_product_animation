import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { createProductMaterials } from './materials.js';
import { createAnnotationManager } from './annotations.js';
import { soundFX } from './audio.js';
import { PRODUCTS_CATALOG } from './products/productsCatalog.js';

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------------------------------
// Scene, Camera, Renderer Setup
// -------------------------------------------------------------
const canvasContainer = document.getElementById('webgl-canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c0f14);
scene.fog = new THREE.FogExp2(0x0c0f14, 0.035);

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 3.2, 11.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
canvasContainer.appendChild(renderer.domElement);

// Orbit Controls (Active during interactive mode)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxDistance = 22;
controls.minDistance = 3.5;
controls.maxPolarAngle = Math.PI / 2 + 0.15;
controls.enabled = false;

// -------------------------------------------------------------
// Materials & Studio Setup
// -------------------------------------------------------------
const materials = createProductMaterials(renderer);
scene.environment = materials.envMap;

// Ground Contact Shadow Disc
const shadowCanvas = document.createElement('canvas');
shadowCanvas.width = 512;
shadowCanvas.height = 512;
const sCtx = shadowCanvas.getContext('2d');
const sGrad = sCtx.createRadialGradient(256, 256, 10, 256, 256, 250);
sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
sGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
sGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
sCtx.fillStyle = sGrad;
sCtx.fillRect(0, 0, 512, 512);

const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 16),
  new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  })
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = -2.35;
scene.add(shadowPlane);

// Industrial Studio Pedestal
const platformGeom = new THREE.CylinderGeometry(7.5, 7.8, 0.35, 64);
const platformMat = new THREE.MeshStandardMaterial({
  color: 0x141820,
  roughness: 0.7,
  metalness: 0.2
});
const platform = new THREE.Mesh(platformGeom, platformMat);
platform.position.y = -2.55;
platform.receiveShadow = true;
scene.add(platform);

const rimRingGeom = new THREE.TorusGeometry(7.52, 0.035, 16, 100);
const rimRingMat = new THREE.MeshBasicMaterial({
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.35
});
const rimRing = new THREE.Mesh(rimRingGeom, rimRingMat);
rimRing.rotation.x = Math.PI / 2;
rimRing.position.y = -2.37;
scene.add(rimRing);

// -------------------------------------------------------------
// Studio Lighting Rig
// -------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfffdf6, 3.2);
keyLight.position.set(6, 9, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 30;
keyLight.shadow.bias = -0.0005;
keyLight.shadow.radius = 2.5;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xd6e8ff, 1.8);
fillLight.position.set(-8, 5, 4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 3.8);
rimLight.position.set(0, 7, -9);
scene.add(rimLight);

const underLight = new THREE.DirectionalLight(0xedd6b4, 0.9);
underLight.position.set(0, -6, 4);
scene.add(underLight);

// -------------------------------------------------------------
// Annotations Manager
// -------------------------------------------------------------
const annotationManager = createAnnotationManager(camera, document.body);

// -------------------------------------------------------------
// Multi-Product System Manager
// -------------------------------------------------------------
let currentProductIndex = 0;
let currentProductData = PRODUCTS_CATALOG[0];
let activeBracketModel = null;
let currentMaterialMode = 'pbr';

// Instantiate initial product
function instantiateProduct(index) {
  const prod = PRODUCTS_CATALOG[index];
  currentProductIndex = index;
  currentProductData = prod;

  if (activeBracketModel) {
    scene.remove(activeBracketModel.group);
  }

  activeBracketModel = prod.createModel(materials);
  activeBracketModel.setMaterialMode(currentMaterialMode);
  scene.add(activeBracketModel.group);

  // Load annotations
  annotationManager.loadAnnotations(prod.annotations, activeBracketModel);

  // Update DOM UI
  updateProductDOM(prod);
}

// Update DOM elements when product switches
function updateProductDOM(prod) {
  // 1. Hero
  const badgeLive = document.getElementById('hero-badge-live');
  const badgeSub = document.getElementById('hero-badge-sub');
  if (badgeLive) {
    badgeLive.innerHTML = `<span class="badge-glow"></span> ${prod.badge}`;
    badgeLive.className = `hero-badge ${prod.badgeClass || ''}`;
  }
  if (badgeSub) badgeSub.innerText = prod.series;

  const titleProd = document.getElementById('hero-title-product');
  if (titleProd) titleProd.innerText = prod.name.replace('HK Enterprise', '').trim();

  const heroDesc = document.getElementById('hero-desc-live');
  if (heroDesc) heroDesc.innerText = prod.heroDesc;

  // Specs
  const specAngleVal = document.getElementById('spec-angle-val');
  const specAngleKey = document.getElementById('spec-angle-key');
  if (specAngleVal) specAngleVal.innerText = prod.specs.angle;
  if (specAngleKey) specAngleKey.innerText = prod.specs.angleLabel;

  const specHolesVal = document.getElementById('spec-holes-val');
  const specHolesKey = document.getElementById('spec-holes-key');
  if (specHolesVal) specHolesVal.innerText = prod.specs.holes;
  if (specHolesKey) specHolesKey.innerText = prod.specs.holesLabel;

  const specGaugeVal = document.getElementById('spec-gauge-val');
  const specGaugeKey = document.getElementById('spec-gauge-key');
  if (specGaugeVal) specGaugeVal.innerHTML = `${prod.specs.gauge.replace('mm', '')}<small>mm</small>`;
  if (specGaugeKey) specGaugeKey.innerText = prod.specs.gaugeLabel;

  const specFastenerVal = document.getElementById('spec-fastener-val');
  const specFastenerKey = document.getElementById('spec-fastener-key');
  if (specFastenerVal) specFastenerVal.innerText = prod.specs.fastener;
  if (specFastenerKey) specFastenerKey.innerText = prod.specs.fastenerLabel;

  // 2. Features Checklist
  const featureList = document.getElementById('feature-checklist-live');
  if (featureList) {
    featureList.innerHTML = prod.features.map(f => `
      <li>
        <div class="check-icon">✓</div>
        <div>
          <strong>${f.title}</strong>
          <p>${f.desc}</p>
        </div>
      </li>
    `).join('');
  }

  // 3. Exploded Grid
  const explodedGrid = document.getElementById('exploded-grid-live');
  if (explodedGrid) {
    explodedGrid.innerHTML = prod.explodedParts.map(p => `
      <div class="callout-card">
        <span class="callout-num">${p.num}</span>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `).join('');
  }

  // 4. Metric Dashboard
  const metricDashboard = document.getElementById('metric-dashboard-live');
  if (metricDashboard) {
    metricDashboard.innerHTML = prod.metrics.map(m => `
      <div class="metric-row">
        <div class="metric-info">
          <span class="metric-label">${m.label}</span>
          <span class="metric-bar-val">${m.val}</span>
        </div>
        <div class="metric-bar-track">
          <div class="metric-bar-fill" style="width: ${m.pct};"></div>
        </div>
      </div>
    `).join('');
  }

  // 5. Active labels in docks & tabs
  const dockLabel = document.getElementById('dock-active-product');
  if (dockLabel) dockLabel.innerText = prod.id.toUpperCase();

  // Highlight active tabs
  document.querySelectorAll('.nav-product-tab').forEach((tab, idx) => {
    tab.classList.toggle('active', idx === currentProductIndex);
  });
  document.querySelectorAll('.catalog-card').forEach((card, idx) => {
    card.classList.toggle('active', idx === currentProductIndex);
  });
}

// Smooth 3D Product Switch Transition
function switchProduct(index) {
  if (index === currentProductIndex || index < 0 || index >= PRODUCTS_CATALOG.length) return;
  soundFX.playClick();

  const oldModel = activeBracketModel;
  
  // Transition out old model with scale & subtle spin
  gsap.to(oldModel.group.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 0.32,
    ease: 'back.in(1.4)',
    onComplete: () => {
      instantiateProduct(index);

      // Transition in new model with spring bounce
      activeBracketModel.group.scale.set(0, 0, 0);
      gsap.to(activeBracketModel.group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.55,
        ease: 'back.out(1.5)'
      });

      // Reset explode slider
      const slider = document.getElementById('explode-slider');
      const valDisplay = document.getElementById('explode-val');
      if (slider) slider.value = 0;
      if (valDisplay) valDisplay.innerText = '0%';
    }
  });
}

// Render product switchers in Navbar and Catalog Bar
function initProductSwitchers() {
  const navTabs = document.getElementById('nav-product-tabs');
  const catalogWrap = document.getElementById('catalog-items-wrap');

  if (navTabs) {
    navTabs.innerHTML = PRODUCTS_CATALOG.map((prod, idx) => `
      <button class="nav-product-tab ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <span class="tab-badge">${prod.specs.angle}</span>
        <span class="tab-name">${prod.name.split(' ')[0]}</span>
      </button>
    `).join('');

    navTabs.querySelectorAll('.nav-product-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        switchProduct(idx);
      });
    });
  }

  if (catalogWrap) {
    catalogWrap.innerHTML = PRODUCTS_CATALOG.map((prod, idx) => `
      <div class="catalog-card ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="card-top">
          <span class="card-series">${prod.series.split('•')[0]}</span>
          <span class="card-badge">${prod.badge}</span>
        </div>
        <h4 class="card-title">${prod.name}</h4>
        <span class="card-tagline">${prod.tagline}</span>
      </div>
    `).join('');

    catalogWrap.querySelectorAll('.catalog-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        switchProduct(idx);
      });
    });
  }

  // Keyboard Navigation: Left & Right arrow keys switch products!
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const nextIdx = (currentProductIndex + 1) % PRODUCTS_CATALOG.length;
      switchProduct(nextIdx);
    } else if (e.key === 'ArrowLeft') {
      const prevIdx = (currentProductIndex - 1 + PRODUCTS_CATALOG.length) % PRODUCTS_CATALOG.length;
      switchProduct(prevIdx);
    }
  });
}

// -------------------------------------------------------------
// GSAP Cinematic Camera & ScrollTrigger Timeline
// -------------------------------------------------------------
let isInteractiveMode = false;
let autoRotateActive = true;

const state = {
  camX: 0,
  camY: 3.2,
  camZ: 11.5,
  targetX: 0,
  targetY: 0.2,
  targetZ: 0,
  bracketRotX: 0.25,
  bracketRotY: -0.65,
  bracketRotZ: 0,
  explodedProgress: 0
};

const mainTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '#scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.2,
    onUpdate: (self) => {
      if (self.progress < 0.88) {
        if (isInteractiveMode) {
          isInteractiveMode = false;
          controls.enabled = false;
          document.getElementById('studio-hint')?.classList.remove('active');
        }
      } else {
        if (!isInteractiveMode) {
          isInteractiveMode = true;
          controls.enabled = true;
          controls.target.set(0, 0.2, 0);
          document.getElementById('studio-hint')?.classList.add('active');
        }
      }
    }
  }
});

// Scene 1 -> 2: Precision Zoom on Surface Finish & Mounting Geometry
mainTimeline.to(state, {
  camX: 1.8,
  camY: 1.6,
  camZ: 5.6,
  targetX: 0.2,
  targetY: 1.2,
  targetZ: -0.2,
  bracketRotX: 0.12,
  bracketRotY: -0.28,
  bracketRotZ: 0.05,
  duration: 2,
  ease: 'power2.inOut',
  onUpdate: () => annotationManager.setVisible(false)
}, 'scene-zoom');

// Scene 2 -> 3: Exploded View Separation & Hotspots
mainTimeline.to(state, {
  camX: -4.8,
  camY: 4.2,
  camZ: 8.8,
  targetX: 0,
  targetY: 0.4,
  targetZ: 0,
  bracketRotX: 0.35,
  bracketRotY: 0.75,
  bracketRotZ: -0.08,
  explodedProgress: 1.0,
  duration: 3,
  ease: 'power2.inOut',
  onStart: () => soundFX.playExplode(),
  onUpdate: () => {
    if (activeBracketModel) activeBracketModel.setExplodedProgress(state.explodedProgress);
    annotationManager.setVisible(true);
  }
}, 'scene-explode');

// Scene 3 -> 4: Reassembly & Structural Strength View
mainTimeline.to(state, {
  camX: 7.2,
  camY: 2.1,
  camZ: 6.8,
  targetX: 0,
  targetY: 0.2,
  targetZ: 0,
  bracketRotX: 0.15,
  bracketRotY: 2.8,
  bracketRotZ: 0,
  explodedProgress: 0.0,
  duration: 2.5,
  ease: 'power2.inOut',
  onStart: () => soundFX.playReassemble(),
  onUpdate: () => {
    if (activeBracketModel) activeBracketModel.setExplodedProgress(state.explodedProgress);
    annotationManager.setVisible(false);
  }
}, 'scene-strength');

// Scene 4 -> 5: Transition into Interactive 3D Studio
mainTimeline.to(state, {
  camX: 0,
  camY: 3.8,
  camZ: 10.5,
  targetX: 0,
  targetY: 0.2,
  targetZ: 0,
  bracketRotX: 0.25,
  bracketRotY: Math.PI * 2,
  bracketRotZ: 0,
  explodedProgress: 0.0,
  duration: 2,
  ease: 'power1.out',
  onUpdate: () => {
    if (activeBracketModel) activeBracketModel.setExplodedProgress(state.explodedProgress);
    annotationManager.setVisible(false);
  }
}, 'scene-studio');

// -------------------------------------------------------------
// Interactive Controls Dock
// -------------------------------------------------------------
const explodeSlider = document.getElementById('explode-slider');
const explodeValueDisplay = document.getElementById('explode-val');
if (explodeSlider) {
  explodeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (activeBracketModel) activeBracketModel.setExplodedProgress(val);
    if (explodeValueDisplay) explodeValueDisplay.innerText = `${Math.round(val * 100)}%`;
    soundFX.playClick();
  });
}

const btnToggleExplode = document.getElementById('btn-toggle-explode');
let isExplodedToggle = false;
if (btnToggleExplode) {
  btnToggleExplode.addEventListener('click', () => {
    soundFX.init();
    isExplodedToggle = !isExplodedToggle;
    const targetProgress = isExplodedToggle ? 1 : 0;
    
    if (isExplodedToggle) soundFX.playExplode();
    else soundFX.playReassemble();

    gsap.to(state, {
      explodedProgress: targetProgress,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        if (activeBracketModel) activeBracketModel.setExplodedProgress(state.explodedProgress);
        if (explodeSlider) explodeSlider.value = state.explodedProgress;
        if (explodeValueDisplay) explodeValueDisplay.innerText = `${Math.round(state.explodedProgress * 100)}%`;
      }
    });

    btnToggleExplode.classList.toggle('active', isExplodedToggle);
    btnToggleExplode.querySelector('span').innerText = isExplodedToggle ? 'Reassemble' : 'Explode View';
  });
}

const btnAutoRotate = document.getElementById('btn-auto-rotate');
if (btnAutoRotate) {
  btnAutoRotate.addEventListener('click', () => {
    soundFX.playClick();
    autoRotateActive = !autoRotateActive;
    btnAutoRotate.classList.toggle('active', autoRotateActive);
    btnAutoRotate.querySelector('span').innerText = autoRotateActive ? 'Pause Spin' : '360° Spin';
  });
}

const btnResetCam = document.getElementById('btn-reset-cam');
if (btnResetCam) {
  btnResetCam.addEventListener('click', () => {
    soundFX.playClick();
    gsap.to(camera.position, {
      x: 0,
      y: 3.2,
      z: 10.5,
      duration: 1.2,
      ease: 'power2.out'
    });
    controls.target.set(0, 0.2, 0);
  });
}

// Lighting Themes
const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    soundFX.playClick();
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyLightingTheme(btn.getAttribute('data-theme'));
  });
});

function applyLightingTheme(theme) {
  switch (theme) {
    case 'studio-dark':
      scene.background.setHex(0x0c0f14);
      scene.fog.color.setHex(0x0c0f14);
      keyLight.color.setHex(0xfffdf6);
      keyLight.intensity = 3.2;
      fillLight.color.setHex(0xd6e8ff);
      rimLight.color.setHex(0xffffff);
      currentMaterialMode = 'pbr';
      if (activeBracketModel) activeBracketModel.setMaterialMode('pbr');
      rimRingMat.color.setHex(0x00f0ff);
      break;

    case 'high-key':
      scene.background.setHex(0xe8ecef);
      scene.fog.color.setHex(0xe8ecef);
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 4.2;
      fillLight.color.setHex(0xf0f4f8);
      rimLight.color.setHex(0xd0e0ff);
      currentMaterialMode = 'pbr';
      if (activeBracketModel) activeBracketModel.setMaterialMode('pbr');
      rimRingMat.color.setHex(0x406080);
      break;

    case 'cyber-blueprint':
      scene.background.setHex(0x050a14);
      scene.fog.color.setHex(0x050a14);
      keyLight.color.setHex(0x00d8ff);
      keyLight.intensity = 2.8;
      fillLight.color.setHex(0x0055ff);
      rimLight.color.setHex(0x00ffff);
      currentMaterialMode = 'wireframe';
      if (activeBracketModel) activeBracketModel.setMaterialMode('wireframe');
      rimRingMat.color.setHex(0x00ffff);
      break;

    case 'warm-workshop':
      scene.background.setHex(0x18120c);
      scene.fog.color.setHex(0x18120c);
      keyLight.color.setHex(0xffcb85);
      keyLight.intensity = 3.8;
      fillLight.color.setHex(0xaa7040);
      rimLight.color.setHex(0xffddaa);
      currentMaterialMode = 'pbr';
      if (activeBracketModel) activeBracketModel.setMaterialMode('pbr');
      rimRingMat.color.setHex(0xffaa44);
      break;
  }
}

// Sound Toggle
const btnSound = document.getElementById('btn-sound-toggle');
if (btnSound) {
  btnSound.addEventListener('click', () => {
    const isMuted = !soundFX.toggle();
    btnSound.classList.toggle('muted', isMuted);
    btnSound.querySelector('.sound-label').innerText = isMuted ? 'Sound: OFF' : 'Sound: ON';
  });
}

// Reference Comparison Modal
const btnCompare = document.getElementById('btn-compare-photo');
const compareModal = document.getElementById('compare-modal');
const btnCloseModal = document.getElementById('btn-close-modal');

if (btnCompare && compareModal) {
  btnCompare.addEventListener('click', () => {
    soundFX.playClick();
    compareModal.classList.add('active');
  });
}
if (btnCloseModal && compareModal) {
  btnCloseModal.addEventListener('click', () => {
    soundFX.playClick();
    compareModal.classList.remove('active');
  });
}

// Quote CTA
const btnQuote = document.getElementById('btn-request-quote');
if (btnQuote) {
  btnQuote.addEventListener('click', () => {
    soundFX.playChime();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.8 },
      colors: ['#00f0ff', '#e0e6ed', '#ffb703', '#ffffff']
    });
    alert(`Thank you for selecting the ${currentProductData.name}! Our engineering team will supply the CAD drawings and bulk quote.`);
  });
}

// -------------------------------------------------------------
// Initialize App & Product Lineup
// -------------------------------------------------------------
instantiateProduct(0);
initProductSwitchers();

// -------------------------------------------------------------
// Render Loop
// -------------------------------------------------------------
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (activeBracketModel) {
    if (isInteractiveMode) {
      controls.update();
      if (autoRotateActive) {
        activeBracketModel.group.rotation.y += delta * 0.45;
      }
    } else {
      camera.position.set(state.camX, state.camY, state.camZ);
      camera.lookAt(state.targetX, state.targetY, state.targetZ);

      activeBracketModel.group.rotation.x = state.bracketRotX;
      activeBracketModel.group.rotation.y = state.bracketRotY;
      activeBracketModel.group.rotation.z = state.bracketRotZ;

      const time = clock.getElapsedTime();
      activeBracketModel.group.position.y = -1.2 + Math.sin(time * 1.5) * 0.08;

      const scrollProg = ScrollTrigger.isInViewport('#hero-section') ? 1 : 0;
      if (scrollProg && autoRotateActive) {
        state.bracketRotY += delta * 0.55;
      }
    }
  }

  annotationManager.update();
  renderer.render(scene, camera);
}

animate();

// -------------------------------------------------------------
// Responsive Window Resize Handler
// -------------------------------------------------------------
function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.fov = width < 768 ? 54 : 42;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);
handleResize();
