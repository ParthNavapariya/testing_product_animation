import * as THREE from 'three';

/**
 * 3D Model Generators for All Products in the Architectural & Industrial Hardware Showcase
 * Matches the style and products shown in the reference video (NIMKRO style showcase) + exact reference L-Bracket:
 * 1. HK-LB90: Galvanized Metal L-Bracket with Hex Bolt (Exact Uploaded Reference)
 * 2. HK-KB10: Knurled Brass Architectural Knob / Glass Standoff (Exploded view from video 00:00)
 * 3. HK-PH80: Rose Gold Architectural Pull Handle with Glass Mounts (From video 00:05)
 * 4. HK-BH45: Butterfly Wing Architectural Handle Set (From video 00:06)
 * 5. HK-FP60: Fluted Profile Edge Pulls in Matte Black & Champagne Gold (From video 00:11)
 * 6. HK-RG90: Gusset-Reinforced Structural Angle Bracket
 */

// Procedural Knurl Texture for Brass Knob
function createKnurlTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#8080ff'; // Flat normal
  ctx.fillRect(0, 0, 256, 256);

  const step = 8;
  ctx.strokeStyle = 'rgba(160, 160, 255, 0.8)';
  ctx.lineWidth = 1.5;

  for (let i = -256; i < 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i + 256, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 4);
  return texture;
}

const knurlNormal = createKnurlTexture();

// -------------------------------------------------------------
// Materials Factory for Showcase
// -------------------------------------------------------------
export function createShowcaseMaterials(envMap) {
  // 1. Galvanized Zinc (Reference Bracket)
  const zincCanvas = document.createElement('canvas');
  zincCanvas.width = 512;
  zincCanvas.height = 512;
  const zCtx = zincCanvas.getContext('2d');
  zCtx.fillStyle = '#cfd6d3';
  zCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 4 + Math.random() * 14;
    const tone = 210 + Math.floor(Math.random() * 40);
    zCtx.fillStyle = `rgba(${tone}, ${tone}, ${tone}, 0.5)`;
    zCtx.beginPath();
    zCtx.arc(x, y, r, 0, Math.PI * 2);
    zCtx.fill();
  }
  const zincTexture = new THREE.CanvasTexture(zincCanvas);
  zincTexture.wrapS = THREE.RepeatWrapping;
  zincTexture.wrapT = THREE.RepeatWrapping;
  zincTexture.repeat.set(2, 2);

  const zincSteel = new THREE.MeshPhysicalMaterial({
    map: zincTexture,
    roughness: 0.35,
    metalness: 0.95,
    color: 0xf1f3f0,
    envMap,
    envMapIntensity: 1.4,
    clearcoat: 0.2
  });

  // 2. Machined Bolt Steel
  const boltSteel = new THREE.MeshPhysicalMaterial({
    roughness: 0.25,
    metalness: 0.96,
    color: 0xd8ded9,
    envMap,
    envMapIntensity: 1.5,
    clearcoat: 0.3
  });

  // 3. Luxury Brushed Brass / Gold (From Video 00:00)
  const brushedBrass = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37, // Rich warm brass gold
    roughness: 0.28,
    metalness: 0.92,
    envMap,
    envMapIntensity: 1.6,
    clearcoat: 0.25
  });

  // Knurled Brass Material
  const knurledBrass = new THREE.MeshPhysicalMaterial({
    color: 0xdeb841,
    roughness: 0.38,
    metalness: 0.94,
    normalMap: knurlNormal,
    normalScale: new THREE.Vector2(0.8, 0.8),
    envMap,
    envMapIntensity: 1.5
  });

  // 4. Luxury Rose Gold (From Video 00:05, 00:07, 00:11)
  const roseGold = new THREE.MeshPhysicalMaterial({
    color: 0xb76e79, // Authentic warm rose gold
    roughness: 0.22,
    metalness: 0.95,
    envMap,
    envMapIntensity: 1.8,
    clearcoat: 0.35
  });

  // 5. Anodized Matte Black (From Video 00:11)
  const matteBlack = new THREE.MeshPhysicalMaterial({
    color: 0x1f2226,
    roughness: 0.42,
    metalness: 0.75,
    envMap,
    envMapIntensity: 0.9
  });

  // 6. Hardened Dark Washer / Gasket Material
  const darkWasher = new THREE.MeshPhysicalMaterial({
    color: 0x22252a,
    roughness: 0.5,
    metalness: 0.7,
    envMap
  });

  // 7. Architectural Clear Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    envMap
  });

  return {
    zincSteel,
    boltSteel,
    brushedBrass,
    knurledBrass,
    roseGold,
    matteBlack,
    darkWasher,
    glassMat
  };
}

// -------------------------------------------------------------
// 1. HK-LB90: Metal L-Bracket with Hex Bolt (Exact Reference)
// -------------------------------------------------------------
export function createProductLB90(materials) {
  const group = new THREE.Group();

  const width = 4.2;
  const vertH = 3.8;
  const horizL = 3.8;
  const thickness = 0.28;
  const innerR = 0.24;
  const hw = width / 2;

  // Vertical Plate with 4 Holes (2x2)
  const vertShape = new THREE.Shape();
  vertShape.moveTo(-hw + 0.2, 0);
  vertShape.lineTo(hw - 0.2, 0);
  vertShape.quadraticCurveTo(hw, 0, hw, 0.2);
  vertShape.lineTo(hw, vertH - 0.2);
  vertShape.quadraticCurveTo(hw, vertH, hw - 0.2, vertH);
  vertShape.lineTo(-hw + 0.2, vertH);
  vertShape.quadraticCurveTo(-hw, vertH, -hw, vertH - 0.2);
  vertShape.lineTo(-hw, 0.2);
  vertShape.quadraticCurveTo(-hw, 0, -hw + 0.2, 0);

  const holeR = 0.3;
  const holes = [
    [-1.2, 2.8], [1.2, 2.8],
    [-1.2, 1.1], [1.2, 1.1]
  ];
  holes.forEach(([hx, hy]) => {
    const p = new THREE.Path();
    p.absarc(hx, hy, holeR, 0, Math.PI * 2, true);
    vertShape.holes.push(p);
  });

  const vertMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(vertShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.zincSteel
  );
  vertMesh.position.set(0, innerR, -thickness);
  vertMesh.castShadow = true;

  // Stamped bevel rings for holes
  holes.forEach(([hx, hy]) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(holeR, holeR + 0.15, 24), materials.zincSteel);
    ring.position.set(hx, hy, thickness + 0.035);
    vertMesh.add(ring);
  });

  // Horizontal Plate with Center Hole
  const horizShape = new THREE.Shape();
  horizShape.moveTo(-hw + 0.2, 0);
  horizShape.lineTo(hw - 0.2, 0);
  horizShape.quadraticCurveTo(hw, 0, hw, 0.2);
  horizShape.lineTo(hw, horizL - 0.2);
  horizShape.quadraticCurveTo(hw, horizL, hw - 0.2, horizL);
  horizShape.lineTo(-hw + 0.2, horizL);
  horizShape.quadraticCurveTo(-hw, horizL, -hw, horizL - 0.2);
  horizShape.lineTo(-hw, 0.2);
  horizShape.quadraticCurveTo(-hw, 0, -hw + 0.2, 0);

  const boltHole = new THREE.Path();
  boltHole.absarc(0, 1.9, 0.48, 0, Math.PI * 2, true);
  horizShape.holes.push(boltHole);

  const horizMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(horizShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.zincSteel
  );
  horizMesh.rotation.x = Math.PI / 2;
  horizMesh.position.set(0, 0, innerR);
  horizMesh.castShadow = true;

  // 90° Curved Bend
  const bendGeom = new THREE.CylinderGeometry(innerR + thickness, innerR + thickness, width - 0.1, 24, 1, false, Math.PI, Math.PI / 2);
  const bendMesh = new THREE.Mesh(bendGeom, materials.zincSteel);
  bendMesh.rotation.z = Math.PI / 2;
  bendMesh.position.set(0, innerR, innerR);

  const bracketBody = new THREE.Group();
  bracketBody.add(vertMesh, horizMesh, bendMesh);
  group.add(bracketBody);

  // Hex Bolt Assembly
  const boltGroup = new THREE.Group();
  const hexRadius = 0.75;
  const hexH = 0.52;

  const hexHead = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius, hexRadius, hexH, 6), materials.boltSteel);
  hexHead.castShadow = true;
  hexHead.position.set(0, hexH / 2, 0);
  boltGroup.add(hexHead);

  const hexCrown = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius * 0.88, hexRadius, 0.06, 6), materials.boltSteel);
  hexCrown.position.set(0, hexH + 0.03, 0);
  boltGroup.add(hexCrown);

  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 2.4, 24), materials.boltSteel);
  shank.position.set(0, -1.2, 0);
  boltGroup.add(shank);

  // Top washer
  const topWasher = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.1, 32),
    materials.darkWasher
  );
  topWasher.position.set(0, 0.06, 0);

  // Bottom washer & nut
  const bottomWasher = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.1, 32),
    materials.boltSteel
  );
  bottomWasher.position.set(0, -thickness - 0.06, 0);

  const bottomNut = new THREE.Mesh(
    new THREE.CylinderGeometry(hexRadius, hexRadius, 0.6, 6),
    materials.boltSteel
  );
  bottomNut.position.set(0, -thickness - 0.48, 0);

  const fastenerGroup = new THREE.Group();
  fastenerGroup.position.set(0, 0, innerR + 1.9);
  fastenerGroup.add(topWasher, boltGroup, bottomWasher, bottomNut);
  group.add(fastenerGroup);

  group.position.set(0, -1.0, -0.9);

  return {
    group,
    update: (time) => {
      // Smooth continuous turntable spin
      group.rotation.y = time * 0.45;

      // Exploded loop animation (periodic cycle)
      const cycle = (Math.sin(time * 1.5) + 1) / 2; // 0 to 1
      const ease = Math.pow(cycle, 2);

      boltGroup.position.y = 0.12 + ease * 2.8;
      boltGroup.rotation.y = ease * Math.PI * 0.5;
      topWasher.position.y = 0.06 + ease * 1.2;
      bottomWasher.position.y = -thickness - 0.06 - ease * 1.1;
      bottomNut.position.y = -thickness - 0.48 - ease * 2.4;
      bottomNut.rotation.y = -ease * Math.PI * 0.5;
      bracketBody.position.y = ease * 0.2;
    }
  };
}

// -------------------------------------------------------------
// 2. HK-KB10: Knurled Brass Architectural Knob / Glass Fitting (From Video 00:00)
// -------------------------------------------------------------
export function createProductKB10(materials) {
  const group = new THREE.Group();

  // Part 1: Top Knurled Brass Cap (Diameter ~36mm)
  const capRadius = 1.35;
  const capHeight = 1.1;
  const capGeom = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 48);
  const capMesh = new THREE.Mesh(capGeom, materials.knurledBrass);
  capMesh.castShadow = true;

  // Cap top beveled rim
  const topBevel = new THREE.Mesh(
    new THREE.CylinderGeometry(capRadius * 0.94, capRadius, 0.12, 48),
    materials.brushedBrass
  );
  topBevel.position.y = capHeight / 2 + 0.06;

  // Cap bottom stem
  const capStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.95, 0.4, 32),
    materials.brushedBrass
  );
  capStem.position.y = -capHeight / 2 - 0.2;

  const topKnobGroup = new THREE.Group();
  topKnobGroup.add(capMesh, topBevel, capStem);
  group.add(topKnobGroup);

  // Part 2: Dark Cushion Washer (Rubber / silicone isolation ring)
  const cushionWasher = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.14, 36),
    materials.darkWasher
  );
  group.add(cushionWasher);

  // Part 3: Middle Clear Glass Mounting Disc (Representing the door glass panel)
  const glassPanel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.18, 48),
    materials.glassMat
  );
  group.add(glassPanel);

  // Part 4: Second Cushion Washer
  const lowerWasher = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.14, 36),
    materials.darkWasher
  );
  group.add(lowerWasher);

  // Part 5: Lower Brass Base Flange / Threaded Standoff
  const baseFlange = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.25, 0.9, 48),
    materials.brushedBrass
  );
  baseFlange.castShadow = true;

  const baseBottomLip = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.42, 0.2, 48),
    materials.brushedBrass
  );
  baseBottomLip.position.y = -0.45;

  const baseGroup = new THREE.Group();
  baseGroup.add(baseFlange, baseBottomLip);
  group.add(baseGroup);

  group.position.set(0, -0.2, 0);

  return {
    group,
    update: (time) => {
      // 360 Turntable rotation
      group.rotation.y = time * 0.45;

      // Exploded loop animation matching video (cap rises, washers float, base drops)
      const cycle = (Math.sin(time * 1.6) + 1) / 2;
      const ease = Math.pow(cycle, 1.8);

      topKnobGroup.position.y = 0.95 + ease * 2.2;
      cushionWasher.position.y = 0.18 + ease * 1.0;
      glassPanel.position.y = 0;
      lowerWasher.position.y = -0.18 - ease * 0.8;
      baseGroup.position.y = -0.85 - ease * 1.8;
    }
  };
}

// -------------------------------------------------------------
// 3. HK-PH80: Rose Gold Architectural Pull Handle (From Video 00:05)
// -------------------------------------------------------------
export function createProductPH80(materials) {
  const group = new THREE.Group();

  // Cylindrical Main Bar (Angled 45 degrees as in video)
  const barRadius = 0.32;
  const barLength = 6.8;
  const barGeom = new THREE.CylinderGeometry(barRadius, barRadius, barLength, 32);
  const barMesh = new THREE.Mesh(barGeom, materials.roseGold);
  barMesh.castShadow = true;

  // Standoff 1 (Upper mount)
  const post1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.44, 1.2, 24),
    materials.brushedBrass
  );
  post1.rotation.z = Math.PI / 2;
  post1.position.set(-0.6, 1.8, 0);

  // Standoff 2 (Lower mount)
  const post2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.44, 1.2, 24),
    materials.brushedBrass
  );
  post2.rotation.z = Math.PI / 2;
  post2.position.set(-0.6, -1.8, 0);

  // Glass mounting plates
  const glassDisc1 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 24), materials.glassMat);
  glassDisc1.rotation.z = Math.PI / 2;
  glassDisc1.position.set(-1.2, 1.8, 0);

  const glassDisc2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 24), materials.glassMat);
  glassDisc2.rotation.z = Math.PI / 2;
  glassDisc2.position.set(-1.2, -1.8, 0);

  // Decorative spiraling ribbon around the handle (just like video 00:05!)
  const ribbonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.9, -3.2, 0.4),
    new THREE.Vector3(0.6, -1.8, 0.6),
    new THREE.Vector3(-0.7, 0.0, -0.6),
    new THREE.Vector3(0.8, 1.8, 0.5),
    new THREE.Vector3(-0.6, 3.2, -0.4)
  ]);
  const ribbonGeom = new THREE.TubeGeometry(ribbonCurve, 64, 0.06, 8, false);
  const ribbonMesh = new THREE.Mesh(ribbonGeom, materials.roseGold);

  group.add(barMesh, post1, post2, glassDisc1, glassDisc2, ribbonMesh);

  // Tilt handle diagonally for presentation
  group.rotation.z = Math.PI / 5;
  group.rotation.x = 0.2;

  return {
    group,
    update: (time) => {
      group.rotation.y = time * 0.4;
      // Gentle floating bob
      group.position.y = Math.sin(time * 1.8) * 0.15;
    }
  };
}

// -------------------------------------------------------------
// 4. HK-BH45: Butterfly Architectural Handle Set (From Video 00:06 - 00:09)
// -------------------------------------------------------------
export function createProductBH45(materials) {
  const group = new THREE.Group();

  // Butterfly Wing Left Shape
  function createWingShape() {
    const s = new THREE.Shape();
    s.moveTo(0, -2.2);
    s.bezierCurveTo(1.2, -1.8, 1.8, -1.0, 1.8, -0.2);
    s.bezierCurveTo(1.2, 0.0, 0.8, 0.2, 1.8, 1.2);
    s.bezierCurveTo(1.8, 1.8, 1.2, 2.4, 0.2, 2.4);
    s.lineTo(0, 2.4);
    s.lineTo(0, -2.2);

    // Hollow inner cutout
    const hole = new THREE.Path();
    hole.moveTo(0.3, -1.7);
    hole.bezierCurveTo(0.9, -1.4, 1.3, -0.8, 1.3, -0.2);
    hole.bezierCurveTo(0.9, 0.0, 0.6, 0.2, 1.3, 0.9);
    hole.bezierCurveTo(1.3, 1.4, 0.9, 1.9, 0.3, 1.9);
    hole.closePath();
    s.holes.push(hole);

    return s;
  }

  const wingGeom = new THREE.ExtrudeGeometry(createWingShape(), {
    depth: 0.36,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.04,
    bevelThickness: 0.04
  });

  // Left Wing
  const leftWing = new THREE.Mesh(wingGeom, materials.roseGold);
  leftWing.castShadow = true;
  leftWing.position.set(-0.15, 0, 0);

  // Right Wing (Mirrored)
  const rightWing = new THREE.Mesh(wingGeom, materials.roseGold);
  rightWing.castShadow = true;
  rightWing.rotation.y = Math.PI;
  rightWing.position.set(0.15, 0, 0.36);

  // Glass / Door Joint Line in center
  const doorLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 6.5, 0.6),
    materials.matteBlack
  );
  doorLine.position.set(0, 0, -0.15);

  group.add(leftWing, rightWing, doorLine);

  return {
    group,
    update: (time) => {
      group.rotation.y = Math.sin(time * 0.8) * 0.35;
      group.position.y = Math.sin(time * 1.5) * 0.08;
    }
  };
}

// -------------------------------------------------------------
// 5. HK-FP60: Fluted Profile Edge Pulls (From Video 00:11 - 00:13)
// -------------------------------------------------------------
export function createProductFP60(materials) {
  const group = new THREE.Group();

  function createFlutedProfileShape() {
    const s = new THREE.Shape();
    // Angular L-profile handle
    s.moveTo(0, 0);
    s.lineTo(1.8, 0);
    s.lineTo(1.8, 0.3);
    s.lineTo(0.3, 0.3);
    s.lineTo(0.3, 3.2);
    s.lineTo(0, 3.2);
    s.closePath();
    return s;
  }

  const profileLength = 5.6;
  const extrudeSettings = {
    depth: profileLength,
    bevelEnabled: true,
    bevelSize: 0.02,
    bevelThickness: 0.02
  };

  // 1. Matte Black Handle (Left)
  const blackHandle = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createFlutedProfileShape(), extrudeSettings),
    materials.matteBlack
  );
  blackHandle.castShadow = true;
  blackHandle.position.set(-1.4, -1.6, -profileLength / 2);

  // Fluted groove ridges on the black handle
  for (let r = 0; r < 7; r++) {
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.03, profileLength - 0.2),
      materials.matteBlack
    );
    ridge.position.set(-1.25 + r * 0.2, -1.25, 0);
    group.add(ridge);
  }

  // 2. Brushed Rose Gold Handle (Right, standing adjacent)
  const roseHandle = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createFlutedProfileShape(), extrudeSettings),
    materials.roseGold
  );
  roseHandle.castShadow = true;
  roseHandle.position.set(0.6, -1.6, -profileLength / 2 + 0.5);

  // Fluted groove ridges on rose gold handle
  for (let r = 0; r < 7; r++) {
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.03, profileLength - 0.2),
      materials.roseGold
    );
    ridge.position.set(0.75 + r * 0.2, -1.25, 0.5);
    group.add(ridge);
  }

  group.add(blackHandle, roseHandle);
  group.rotation.x = 0.35;
  group.rotation.y = -0.55;

  return {
    group,
    update: (time) => {
      group.rotation.y = -0.55 + Math.sin(time * 0.7) * 0.3;
      group.position.y = Math.sin(time * 1.4) * 0.1;
    }
  };
}

// -------------------------------------------------------------
// 6. HK-RG90: Gusset-Reinforced Structural Angle Bracket
// -------------------------------------------------------------
export function createProductRG90(materials) {
  const group = new THREE.Group();

  const width = 4.4;
  const vertH = 4.2;
  const horizL = 4.2;
  const thickness = 0.32;
  const innerR = 0.26;
  const hw = width / 2;

  const vertShape = new THREE.Shape();
  vertShape.moveTo(-hw, 0);
  vertShape.lineTo(hw, 0);
  vertShape.lineTo(hw, vertH);
  vertShape.lineTo(-hw, vertH);
  vertShape.closePath();

  [[-1.3, 3.2], [1.3, 3.2], [-1.3, 1.4], [1.3, 1.4]].forEach(([hx, hy]) => {
    const p = new THREE.Path();
    p.absarc(hx, hy, 0.32, 0, Math.PI * 2, true);
    vertShape.holes.push(p);
  });

  const vertMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(vertShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.zincSteel
  );
  vertMesh.position.set(0, innerR, -thickness);
  vertMesh.castShadow = true;

  const horizShape = new THREE.Shape();
  horizShape.moveTo(-hw, 0);
  horizShape.lineTo(hw, 0);
  horizShape.lineTo(hw, horizL);
  horizShape.lineTo(-hw, horizL);
  horizShape.closePath();

  [[-1.0, 2.1], [1.0, 2.1]].forEach(([hx, hz]) => {
    const p = new THREE.Path();
    p.absarc(hx, hz, 0.44, 0, Math.PI * 2, true);
    horizShape.holes.push(p);
  });

  const horizMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(horizShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.zincSteel
  );
  horizMesh.rotation.x = Math.PI / 2;
  horizMesh.position.set(0, 0, innerR);
  horizMesh.castShadow = true;

  // Stiffening Gusset Web
  const gussetShape = new THREE.Shape();
  gussetShape.moveTo(0, innerR);
  gussetShape.lineTo(0, vertH * 0.75);
  gussetShape.lineTo(horizL * 0.75, innerR);
  gussetShape.closePath();

  const gussetMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(gussetShape, { depth: 0.24, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }),
    materials.zincSteel
  );
  gussetMesh.position.set(-0.12, 0, 0);
  gussetMesh.castShadow = true;

  const bracketBody = new THREE.Group();
  bracketBody.add(vertMesh, horizMesh, gussetMesh);
  group.add(bracketBody);

  // Dual Bolts
  const bolt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.45, 6), materials.boltSteel);
  bolt1.position.set(-1.0, 0.35, innerR + 2.1);
  const bolt2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.45, 6), materials.boltSteel);
  bolt2.position.set(1.0, 0.35, innerR + 2.1);

  const bolts = new THREE.Group();
  bolts.add(bolt1, bolt2);
  group.add(bolts);

  group.position.set(0, -1.0, -0.9);

  return {
    group,
    update: (time) => {
      group.rotation.y = time * 0.45;
      const cycle = (Math.sin(time * 1.5) + 1) / 2;
      const ease = Math.pow(cycle, 2);
      bolts.position.y = ease * 2.2;
    }
  };
}

