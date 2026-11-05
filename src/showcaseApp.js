import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  createShowcaseMaterials,
  createProductLB90,
  createProductKB10,
  createProductPH80,
  createProductBH45,
  createProductFP60,
  createProductRG90
} from './models/showcaseModels.js';
import { soundFX } from './audio.js';

// Procedural Studio Environment Texture for Metallic Reflections
function createStudioEnv(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#2a2e36');
  grad.addColorStop(0.5, '#181b20');
  grad.addColorStop(1, '#0e1014');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Softbox highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(380, 70, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(210, 230, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(120, 110, 80, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  const envMap = pmrem.fromEquirectangular(texture).texture;
  pmrem.dispose();
  texture.dispose();
  return envMap;
}

// -------------------------------------------------------------
// Catalog Product Definitions
// -------------------------------------------------------------
const SHOWCASE_PRODUCTS = [
  {
    id: 'hk-lb90',
    category: 'brackets',
    name: 'HK-LB90 Precision Metal L-Bracket',
    series: 'INDUSTRIAL SPEC • REFERENCE MODEL',
    badge: 'EXACT SPECIMEN MATCH',
    badgeClass: 'badge-highlight',
    tagline: 'True 90° Cold-Bent Steel with Quad Countersunk Anchors & Grade 8.8 Bolt',
    desc: 'Exact physical replica of the uploaded reference photograph. Features 4 precision countersunk holes, 90° cold-formed curvature, crystalline zinc spangle passivation, and Grade 8.8 hex bolt with dark retention washer.',
    specs: [
      { key: 'Bend Angle', val: '90.0° Precision' },
      { key: 'Mounting Ports', val: '4x Countersunk (2x2)' },
      { key: 'Plate Gauge', val: '3.2mm Cold-Rolled Steel' },
      { key: 'Fastener Assembly', val: 'Grade 8.8 M10 Hex Bolt' }
    ],
    hasReferencePhoto: true,
    createModel: createProductLB90
  },
  {
    id: 'hk-kb10',
    category: 'knobs',
    name: 'HK-KB10 Knurled Brass Door Knob & Glass Fitting',
    series: 'ARCHITECTURAL SERIES • GLASS MOUNT',
    badge: 'KNURLED BRASS • EXPLODED',
    badgeClass: 'badge-gold',
    tagline: 'Precision Diamond-Knurled Brass with Deconstructable Glass Cushions',
    desc: 'Inspired by luxury architectural glass fittings (shown in reference video 00:00). Features a high-grip diamond knurled cap, dual anti-vibration rubber gaskets, clear tempered glass interface, and heavy threaded brass base.',
    specs: [
      { key: 'Material', val: 'Solid Forged Brass C3600' },
      { key: 'Surface Texture', val: 'Diamond Knurled & Brushed' },
      { key: 'Door Suitability', val: '8mm - 12mm Glass / Timber' },
      { key: 'Deconstruction', val: '4-Piece Threaded Standoff' }
    ],
    hasReferencePhoto: false,
    createModel: createProductKB10
  },
  {
    id: 'hk-ph80',
    category: 'handles',
    name: 'HK-PH80 Rose Gold Architectural Pull Handle',
    series: 'LUXURY RESIDENTIAL • ENTRY HANDLE',
    badge: 'MIRROR ROSE GOLD',
    badgeClass: 'badge-rose',
    tagline: 'Cylindrical Mirror Pull with Dual Brass Standoffs & Glass Mounting Discs',
    desc: 'Sleek cylindrical entry pull handle (shown in reference video 00:05). Finished in mirror PVD rose gold with contrasting brushed brass standoffs and clear glass protection flanges.',
    specs: [
      { key: 'Finish', val: 'PVD Mirror Rose Gold' },
      { key: 'Mounting Centers', val: '450 mm CTC' },
      { key: 'Standoffs', val: 'Dual Brushed Brass Plugs' },
      { key: 'Application', val: 'Frameless Glass & Wood Doors' }
    ],
    hasReferencePhoto: false,
    createModel: createProductPH80
  },
  {
    id: 'hk-bh45',
    category: 'handles',
    name: 'HK-BH45 Butterfly Wing Dual Door Handle Set',
    series: 'DESIGNER BESPOKE • CASEMENT & CABINET',
    badge: 'DUAL WING CONTOUR',
    badgeClass: 'badge-rose',
    tagline: 'Organic Curved Bow-Tie Contour Mounted on Central Frame Divider',
    desc: 'Signature butterfly wing handle pair (shown in reference video 00:06 - 00:09). Designed for double doors and luxury wardrobes with sculptural hollow contours in champagne rose gold.',
    specs: [
      { key: 'Profile', val: 'Sculptural Butterfly Wing' },
      { key: 'Pairing', val: 'Symmetrical Left & Right Set' },
      { key: 'Finish', val: 'Champagne Rose Gold PVD' },
      { key: 'Fastening', val: 'Concealed Rear Machine Screws' }
    ],
    hasReferencePhoto: false,
    createModel: createProductBH45
  },
  {
    id: 'hk-fp60',
    category: 'edge-pulls',
    name: 'HK-FP60 Fluted Profile Architectural Edge Pulls',
    series: 'MINIMALIST LINEAR • EDGE GRIP',
    badge: 'BLACK & ROSE GOLD',
    badgeClass: 'badge-dark',
    tagline: 'Extruded Fluted Longitudinal Ridges in Matte Black & Champagne Gold',
    desc: 'Modern linear edge pulls with micro-fluted grip ridges (shown in reference video 00:11 - 00:13). Showcases dual architectural finishes: deep anodized matte black and brushed warm rose gold.',
    specs: [
      { key: 'Material', val: 'Extruded Architectural Aluminum' },
      { key: 'Surface Grip', val: '7-Ridge Longitudinal Fluting' },
      { key: 'Dual Finishes', val: 'Matte Black & Rose Gold' },
      { key: 'Mounting', val: 'Flush Top-Edge Screw Retention' }
    ],
    hasReferencePhoto: false,
    createModel: createProductFP60
  },
  {
    id: 'hk-rg90',
    category: 'brackets',
    name: 'HK-RG90 Gusset-Reinforced Structural Angle',
    series: 'HEAVY INDUSTRIAL • HIGH LOAD',
    badge: 'SEISMIC GUSSET',
    badgeClass: 'badge-cyan',
    tagline: 'Triangular Stiffening Web with Dual M10 Bolt Clamping Ports',
    desc: 'High-load industrial angle bracket with an integrated cold-formed triangular gusset. Engineered to resist extreme moment flexure and seismic joint displacement.',
    specs: [
      { key: 'Reinforcement', val: 'Triangular Center Gusset' },
      { key: 'Plate Thickness', val: '3.5mm Heavy Carbon Steel' },
      { key: 'Fastener Channels', val: 'Dual M10 Hex Bolt Ports' },
      { key: 'Corrosion Shield', val: 'Hot-Dip Galvanized Zinc' }
    ],
    hasReferencePhoto: false,
    createModel: createProductRG90
  }
];

// -------------------------------------------------------------
// Interactive 3D Card Viewer Component
// -------------------------------------------------------------
class ProductCardViewer {
  constructor(container, productDef, sharedEnvMap) {
    this.container = container;
    this.productDef = productDef;
    this.sharedEnvMap = sharedEnvMap;
    this.isVisible = false;
    this.animTime = Math.random() * 10;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 380;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    this.camera.position.set(0, 1.8, 9.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(amb);

    const key = new THREE.DirectionalLight(0xfff8ee, 2.8);
    key.position.set(5, 8, 6);
    key.castShadow = true;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xd8e8ff, 1.4);
    fill.position.set(-6, 4, 3);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 3.2);
    rim.position.set(0, 6, -8);
    this.scene.add(rim);

    // Soft ground shadow
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18
    });
    const groundShadow = new THREE.Mesh(new THREE.CircleGeometry(3.5, 32), shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -2.2;
    this.scene.add(groundShadow);

    // Instantiate 3D Model
    const materials = createShowcaseMaterials(this.sharedEnvMap);
    this.modelInstance = this.productDef.createModel(materials);
    this.scene.add(this.modelInstance.group);

    // Mouse interactive drag to rotate on the card
    this.isDragging = false;
    this.prevMouseX = 0;
    this.userRotY = 0;

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      soundFX.playClick();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMouseX;
      this.prevMouseX = e.clientX;
      this.userRotY += deltaX * 0.012;
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Resize handling
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });
  }

  update(delta) {
    if (!this.isVisible) return;
    this.animTime += delta;

    // Update model internal animation (exploded separation & turntable)
    if (this.modelInstance && this.modelInstance.update) {
      this.modelInstance.update(this.animTime);
    }

    if (this.userRotY !== 0) {
      this.modelInstance.group.rotation.y += this.userRotY;
      this.userRotY *= 0.92; // Damping
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// -------------------------------------------------------------
// Initialize Multi-Product Showcase Page
// -------------------------------------------------------------
export function initShowcasePage() {
  const gridContainer = document.getElementById('products-grid');
  if (!gridContainer) return;

  // Render dummy WebGL renderer to create shared environment map
  const dummyCanvas = document.createElement('canvas');
  const dummyRenderer = new THREE.WebGLRenderer({ canvas: dummyCanvas });
  const sharedEnvMap = createStudioEnv(dummyRenderer);
  dummyRenderer.dispose();

  const cardViewers = [];

  // Generate Cards HTML
  gridContainer.innerHTML = SHOWCASE_PRODUCTS.map((prod, index) => `
    <article class="product-card" data-category="${prod.category}" data-id="${prod.id}">
      <div class="card-canvas-wrap" id="canvas-wrap-${prod.id}">
        <div class="card-badge-row">
          <span class="card-badge ${prod.badgeClass}">${prod.badge}</span>
          ${prod.hasReferencePhoto ? '<button class="card-compare-btn" data-id="' + prod.id + '">📷 Compare Photo</button>' : ''}
        </div>
        <div class="card-brand-pill">hkenterprise.com</div>
        <div class="card-hover-hint">DRAG TO ROTATE 360°</div>
      </div>

      <div class="card-content">
        <div class="card-header-group">
          <span class="card-series-tag">${prod.series}</span>
          <h3 class="card-title">${prod.name}</h3>
        </div>

        <p class="card-desc">${prod.desc}</p>

        <div class="card-specs-row">
          ${prod.specs.map(s => `
            <div class="card-spec-item">
              <span class="spec-label">${s.key}</span>
              <span class="spec-value">${s.val}</span>
            </div>
          `).join('')}
        </div>

        <div class="card-actions-row">
          <button class="btn-card-action primary btn-inspect" data-index="${index}">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Full 3D Inspector</span>
          </button>
          <button class="btn-card-action secondary btn-request-spec" data-name="${prod.name}">
            <span>Request CAD / Quote</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Mount 3D Viewers into each card
  SHOWCASE_PRODUCTS.forEach(prod => {
    const wrap = document.getElementById(`canvas-wrap-${prod.id}`);
    if (wrap) {
      const viewer = new ProductCardViewer(wrap, prod, sharedEnvMap);
      cardViewers.push(viewer);
    }
  });

  // IntersectionObserver to only render visible cards (Ensures 60 FPS!)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('data-id');
      const viewer = cardViewers.find(v => v.productDef.id === id);
      if (viewer) {
        viewer.isVisible = entry.isIntersecting;
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
  });

  // Master Render Loop for all cards
  const clock = new THREE.Clock();
  function animateAllCards() {
    requestAnimationFrame(animateAllCards);
    const delta = clock.getDelta();
    cardViewers.forEach(v => v.update(delta));
  }
  animateAllCards();

  // -------------------------------------------------------------
  // Filter Category Tabs
  // -------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      document.querySelectorAll('.product-card').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------
  // Scroll To Top Button (As seen in the reference video!)
  // -------------------------------------------------------------
  const btnScrollTop = document.getElementById('btn-scroll-top');
  if (btnScrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnScrollTop.classList.add('active');
      } else {
        btnScrollTop.classList.remove('active');
      }
    });

    btnScrollTop.addEventListener('click', () => {
      soundFX.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------
  // Photo Comparison Modal
  // -------------------------------------------------------------
  const compareModal = document.getElementById('compare-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  document.querySelectorAll('.card-compare-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      if (compareModal) compareModal.classList.add('active');
    });
  });

  const btnNavCompare = document.getElementById('btn-compare-photo');
  if (btnNavCompare && compareModal) {
    btnNavCompare.addEventListener('click', () => {
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

  // Quote Request Buttons
  document.querySelectorAll('.btn-request-spec').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playChime();
      const prodName = btn.getAttribute('data-name');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00f0ff', '#deb841', '#b76e79', '#ffffff']
      });
      alert(`Thank you for choosing ${prodName}! Our architectural specification team will send CAD drawings and bulk wholesale quotation.`);
    });
  });

  // Full-Screen Inspector Modal
  const inspectModal = document.getElementById('inspect-modal');
  const btnCloseInspect = document.getElementById('btn-close-inspect');
  const inspectCanvasWrap = document.getElementById('inspect-canvas-wrap');
  let inspectRenderer = null;
  let inspectScene = null;
  let inspectCamera = null;
  let inspectControls = null;
  let inspectModel = null;
  let inspectAnimId = null;

  document.querySelectorAll('.btn-inspect').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      const index = parseInt(btn.getAttribute('data-index'), 10);
      const prod = SHOWCASE_PRODUCTS[index];
      openInspector(prod);
    });
  });

  function openInspector(prod) {
    if (!inspectModal || !inspectCanvasWrap) return;

    document.getElementById('inspect-product-title').innerText = prod.name;
    document.getElementById('inspect-product-desc').innerText = prod.desc;

    inspectModal.classList.add('active');

    // Setup Inspector 3D Scene
    const w = inspectCanvasWrap.clientWidth || 600;
    const h = inspectCanvasWrap.clientHeight || 450;

    inspectCanvasWrap.innerHTML = '';

    inspectScene = new THREE.Scene();
    inspectScene.background = new THREE.Color(0x11151c);

    inspectCamera = new THREE.PerspectiveCamera(42, w / h, 0.1, 50);
    inspectCamera.position.set(0, 2.5, 9.5);

    inspectRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    inspectRenderer.setSize(w, h);
    inspectRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    inspectRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    inspectCanvasWrap.appendChild(inspectRenderer.domElement);

    inspectControls = new OrbitControls(inspectCamera, inspectRenderer.domElement);
    inspectControls.enableDamping = true;

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.0);
    inspectScene.add(amb);
    const key = new THREE.DirectionalLight(0xfff5ea, 3.2);
    key.position.set(6, 9, 6);
    inspectScene.add(key);
    const fill = new THREE.DirectionalLight(0xd8e8ff, 1.8);
    fill.position.set(-6, 5, 4);
    inspectScene.add(fill);

    const materials = createShowcaseMaterials(sharedEnvMap);
    inspectModel = prod.createModel(materials);
    inspectScene.add(inspectModel.group);

    const clock = new THREE.Clock();
    function runInspectLoop() {
      inspectAnimId = requestAnimationFrame(runInspectLoop);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      inspectControls.update();
      if (inspectModel.update) inspectModel.update(time);
      inspectRenderer.render(inspectScene, inspectCamera);
    }
    runInspectLoop();
  }

  function closeInspector() {
    if (inspectAnimId) cancelAnimationFrame(inspectAnimId);
    if (inspectRenderer) {
      inspectRenderer.dispose();
      inspectRenderer = null;
    }
    if (inspectModal) inspectModal.classList.remove('active');
  }

  if (btnCloseInspect) btnCloseInspect.addEventListener('click', closeInspector);
}

// Auto-run on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initShowcasePage);

