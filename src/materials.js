import * as THREE from 'three';

/**
 * Procedural PBR Material Generator for HK Enterprise Galvanized Metal & Grade 8.8 Fasteners
 */

// Generate Zinc Galvanized texture with authentic crystalline spangle pattern
export function createGalvanizedZincTextures() {
  const size = 1024;
  
  // 1. Diffuse / Albedo Map
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d');

  // Base metallic tone (pale warm zinc silver)
  ctx.fillStyle = '#cfd6d3';
  ctx.fillRect(0, 0, size, size);

  // Voronoi-like crystalline zinc spangles (hot-dip galvanization flakes)
  const numSpangles = 1400;
  for (let i = 0; i < numSpangles; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 6 + Math.random() * 24;
    const sides = 4 + Math.floor(Math.random() * 4);
    
    // Slight color variation between silvery zinc, champagne warm zinc, and pewter
    const tone = 205 + Math.floor(Math.random() * 45);
    const warmTint = Math.random() * 12;
    const r = Math.min(255, tone + warmTint);
    const g = Math.min(255, tone + warmTint * 0.8);
    const b = Math.min(255, tone - warmTint * 0.5);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.45 + Math.random() * 0.45})`;
    ctx.beginPath();
    for (let s = 0; s < sides; s++) {
      const angle = (s / sides) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = radius * (0.65 + Math.random() * 0.45);
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Spangle edge feathering/crystal borders
    ctx.strokeStyle = `rgba(160, 170, 168, 0.25)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Micro-brushed rolling streaks (subtle industrial cold-roll direction)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let j = 0; j < 3000; j++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 20 + Math.random() * 80;
    ctx.fillRect(x, y, len, 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let j = 0; j < 2000; j++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 15 + Math.random() * 50;
    ctx.fillRect(x, y, len, 1);
  }

  const albedoTexture = new THREE.CanvasTexture(albedoCanvas);
  albedoTexture.wrapS = THREE.RepeatWrapping;
  albedoTexture.wrapT = THREE.RepeatWrapping;
  albedoTexture.repeat.set(2, 2);

  // 2. Normal Map (surface micro-bump + spangle facets)
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const nCtx = normalCanvas.getContext('2d');
  
  // Flat normal base (128, 128, 255)
  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  // Add micro faceted angles for spangles
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 5 + Math.random() * 18;
    const nx = 128 + (Math.random() - 0.5) * 36;
    const ny = 128 + (Math.random() - 0.5) * 36;
    nCtx.fillStyle = `rgba(${nx}, ${ny}, 245, 0.25)`;
    nCtx.beginPath();
    nCtx.arc(x, y, r, 0, Math.PI * 2);
    nCtx.fill();
  }

  // Brushed directional scratch normal lines
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 10 + Math.random() * 40;
    const sign = Math.random() > 0.5 ? 140 : 116;
    nCtx.fillStyle = `rgba(128, ${sign}, 255, 0.15)`;
    nCtx.fillRect(x, y, len, 1);
  }

  const normalTexture = new THREE.CanvasTexture(normalCanvas);
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(2, 2);

  // 3. Roughness Map (crystal anisotropy)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  rCtx.fillStyle = 'rgb(90, 90, 90)'; // Base roughness ~0.35
  rCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 8 + Math.random() * 20;
    const roughVal = 60 + Math.floor(Math.random() * 85); // 0.24 to 0.55
    rCtx.fillStyle = `rgba(${roughVal}, ${roughVal}, ${roughVal}, 0.5)`;
    rCtx.beginPath();
    rCtx.arc(x, y, r, 0, Math.PI * 2);
    rCtx.fill();
  }

  const roughnessTexture = new THREE.CanvasTexture(roughCanvas);
  roughnessTexture.wrapS = THREE.RepeatWrapping;
  roughnessTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.repeat.set(2, 2);

  return { albedoTexture, normalTexture, roughnessTexture };
}

// Procedural Studio Environment Map for Realistic Metallic Reflections
export function createStudioEnvironment(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envCanvas = document.createElement('canvas');
  envCanvas.width = 1024;
  envCanvas.height = 512;
  const ctx = envCanvas.getContext('2d');

  // Studio backdrop gradient (dark slate industrial studio)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1c2128');
  grad.addColorStop(0.5, '#0d1117');
  grad.addColorStop(1, '#080a0d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Primary Studio Softbox (Top Right Keylight - crisp white)
  const keyGrad = ctx.createRadialGradient(720, 160, 10, 720, 160, 220);
  keyGrad.addColorStop(0, '#ffffff');
  keyGrad.addColorStop(0.2, '#f4f6fa');
  keyGrad.addColorStop(0.6, 'rgba(210, 225, 255, 0.45)');
  keyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = keyGrad;
  ctx.fillRect(450, 0, 550, 360);

  // Secondary Softbox (Left Fill - cool daylight cyan)
  const fillGrad = ctx.createRadialGradient(250, 220, 10, 250, 220, 200);
  fillGrad.addColorStop(0, '#eaf2ff');
  fillGrad.addColorStop(0.4, 'rgba(170, 205, 250, 0.35)');
  fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fillGrad;
  ctx.fillRect(50, 40, 400, 360);

  // Rim strip light (Top edge horizon)
  const rimGrad = ctx.createLinearGradient(0, 80, 0, 160);
  rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  rimGrad.addColorStop(0.5, 'rgba(255, 245, 230, 0.4)');
  rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 80, 1024, 80);

  // Ground bounce light (warm wooden tabletop bounce reflection)
  const floorGrad = ctx.createLinearGradient(0, 380, 0, 512);
  floorGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  floorGrad.addColorStop(0.5, 'rgba(150, 115, 80, 0.25)');
  floorGrad.addColorStop(1, 'rgba(90, 65, 45, 0.4)');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 380, 1024, 132);

  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
  pmremGenerator.dispose();
  envTexture.dispose();

  return envMap;
}

// Master PBR Materials Set
export function createProductMaterials(renderer) {
  const { albedoTexture, normalTexture, roughnessTexture } = createGalvanizedZincTextures();
  const envMap = createStudioEnvironment(renderer);

  // 1. Galvanized Steel L-Bracket Material (exact match to image)
  const bracketMaterial = new THREE.MeshPhysicalMaterial({
    map: albedoTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughnessMap: roughnessTexture,
    roughness: 0.36,
    metalness: 0.94,
    color: new THREE.Color(0xf1f3f0), // Pale champagne-zinc tone
    envMap: envMap,
    envMapIntensity: 1.45,
    clearcoat: 0.22,
    clearcoatRoughness: 0.28,
    reflectivity: 0.95
  });

  // 2. Hex Bolt Grade 8.8 Head Material (slightly smoother machined steel)
  const boltMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xdce0dc),
    roughness: 0.26,
    metalness: 0.96,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.25, 0.25),
    envMap: envMap,
    envMapIntensity: 1.6,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2
  });

  // 3. Darkened Washer & Retention Ring Material (as seen beneath the bolt in the photo)
  const washerMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x3a3d40), // Dark hardened spring/flat washer
    roughness: 0.45,
    metalness: 0.88,
    envMap: envMap,
    envMapIntensity: 0.9
  });

  // 4. Threaded Shank & Nut Material
  const nutMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xd0d5d2),
    roughness: 0.32,
    metalness: 0.95,
    envMap: envMap,
    envMapIntensity: 1.3
  });

  // 5. Wireframe / Blueprint Cyber Material for interactive inspection mode
  const wireframeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    wireframe: true,
    emissive: 0x0066aa,
    emissiveIntensity: 0.6
  });

  return {
    bracketMaterial,
    boltMaterial,
    washerMaterial,
    nutMaterial,
    wireframeMaterial,
    envMap
  };
}

