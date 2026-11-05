import * as THREE from 'three';

/**
 * 3D Model Generators for HK Enterprise Product Range
 * 1. HK-LB90-ZINC: Exact reference product (90° bend, 4 holes 2x2, Grade 8.8 hex bolt)
 * 2. HK-RG90-GUSSET: Gusset/rib reinforced structural 90° angle bracket
 * 3. HK-SL90-SLOTTED: Adjustable slotted precision angle bracket
 * 4. HK-TP40-FLAT: Heavy-duty 4-hole flat structural tie plate
 */

// Helper to create beveled hex bolt assembly
function createHexBoltAssembly(materials, options = {}) {
  const {
    hexRadius = 0.86,
    hexHeight = 0.58,
    shankRadius = 0.48,
    shankLength = 2.8,
    washerRadiusOut = 0.92,
    washerThickness = 0.12,
    boltRestY = 0.14,
    bottomWasherRestY = -0.36,
    nutRestY = -0.92
  } = options;

  const boltGroup = new THREE.Group();
  boltGroup.name = 'Hex_Bolt';

  // 6-sided hex head
  const hexHeadGeom = new THREE.CylinderGeometry(hexRadius, hexRadius, hexHeight, 6);
  hexHeadGeom.computeVertexNormals();
  const hexHeadMesh = new THREE.Mesh(hexHeadGeom, materials.boltMaterial);
  hexHeadMesh.castShadow = true;
  hexHeadMesh.position.set(0, hexHeight / 2, 0);
  boltGroup.add(hexHeadMesh);

  // Chamfer crown
  const hexCrownGeom = new THREE.CylinderGeometry(hexRadius * 0.88, hexRadius, 0.07, 6);
  const hexCrownMesh = new THREE.Mesh(hexCrownGeom, materials.boltMaterial);
  hexCrownMesh.position.set(0, hexHeight + 0.035, 0);
  boltGroup.add(hexCrownMesh);

  // Radial torque dashes & grade ring
  const markMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a928e,
    roughness: 0.45,
    metalness: 0.9
  });
  for (let m = 0; m < 3; m++) {
    const markGeom = new THREE.BoxGeometry(0.06, 0.02, 0.32);
    const markMesh = new THREE.Mesh(markGeom, markMaterial);
    markMesh.rotation.y = (m * Math.PI) / 3;
    markMesh.position.set(0, hexHeight + 0.07, 0);
    boltGroup.add(markMesh);
  }
  const stampRingGeom = new THREE.RingGeometry(0.2, 0.26, 24);
  const stampRingMesh = new THREE.Mesh(stampRingGeom, markMaterial);
  stampRingMesh.rotation.x = -Math.PI / 2;
  stampRingMesh.position.set(0, hexHeight + 0.071, 0);
  boltGroup.add(stampRingMesh);

  // Shank
  const shankGeom = new THREE.CylinderGeometry(shankRadius, shankRadius, shankLength, 32);
  shankGeom.computeVertexNormals();
  const shankMesh = new THREE.Mesh(shankGeom, materials.boltMaterial);
  shankMesh.castShadow = true;
  shankMesh.position.set(0, -shankLength / 2, 0);
  boltGroup.add(shankMesh);

  // Threads
  const threadCount = 16;
  const threadPitch = shankLength / threadCount;
  for (let t = 0; t < threadCount; t++) {
    const threadGeom = new THREE.TorusGeometry(shankRadius + 0.018, 0.02, 8, 24);
    const threadMesh = new THREE.Mesh(threadGeom, materials.boltMaterial);
    threadMesh.rotation.x = Math.PI / 2;
    threadMesh.position.set(0, -0.4 - t * threadPitch, 0);
    boltGroup.add(threadMesh);
  }

  boltGroup.position.set(0, boltRestY, 0);

  // Top washer
  const washerShape = new THREE.Shape();
  washerShape.absarc(0, 0, washerRadiusOut, 0, Math.PI * 2, false);
  const washerHole = new THREE.Path();
  washerHole.absarc(0, 0, shankRadius + 0.04, 0, Math.PI * 2, true);
  washerShape.holes.push(washerHole);

  const washerGeom = new THREE.ExtrudeGeometry(washerShape, {
    depth: washerThickness,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.02,
    bevelThickness: 0.02
  });
  washerGeom.computeVertexNormals();

  const topWasherMesh = new THREE.Mesh(washerGeom, materials.washerMaterial);
  topWasherMesh.rotation.x = Math.PI / 2;
  topWasherMesh.position.set(0, washerThickness, 0);
  topWasherMesh.castShadow = true;

  // Bottom washer
  const bottomWasherMesh = new THREE.Mesh(washerGeom, materials.nutMaterial);
  bottomWasherMesh.rotation.x = Math.PI / 2;
  bottomWasherMesh.position.set(0, bottomWasherRestY, 0);
  bottomWasherMesh.castShadow = true;

  // Bottom nut
  const nutHeight = 0.68;
  const nutGeom = new THREE.CylinderGeometry(hexRadius, hexRadius, nutHeight, 6);
  nutGeom.computeVertexNormals();
  const nutMesh = new THREE.Mesh(nutGeom, materials.nutMaterial);
  nutMesh.castShadow = true;
  nutMesh.position.set(0, nutRestY, 0);

  return {
    boltGroup,
    topWasherMesh,
    bottomWasherMesh,
    nutMesh,
    hexHeadMesh,
    shankMesh,
    boltRestY,
    bottomWasherRestY,
    nutRestY
  };
}

// -------------------------------------------------------------
// 1. HK-LB90-ZINC: Exact Uploaded Reference Product
// -------------------------------------------------------------
export function createReferenceLBracket(materials) {
  const masterGroup = new THREE.Group();
  masterGroup.name = 'HK_LB90_Zinc_Assembly';

  const width = 4.8;
  const vertHeight = 4.4;
  const horizLength = 4.4;
  const thickness = 0.32;
  const innerRadius = 0.28;
  const outerRadius = innerRadius + thickness;
  const cornerRadius = 0.22;
  const hw = width / 2;

  // Vertical Flange with 4 Holes
  const vertShape = new THREE.Shape();
  vertShape.moveTo(-hw + cornerRadius, 0);
  vertShape.lineTo(hw - cornerRadius, 0);
  vertShape.quadraticCurveTo(hw, 0, hw, cornerRadius);
  vertShape.lineTo(hw, vertHeight - cornerRadius);
  vertShape.quadraticCurveTo(hw, vertHeight, hw - cornerRadius, vertHeight);
  vertShape.lineTo(-hw + cornerRadius, vertHeight);
  vertShape.quadraticCurveTo(-hw, vertHeight, -hw, vertHeight - cornerRadius);
  vertShape.lineTo(-hw, cornerRadius);
  vertShape.quadraticCurveTo(-hw, 0, -hw + cornerRadius, 0);

  const holeRadius = 0.34;
  const holeSpacingX = 1.35;
  const holeYUpper = 3.35;
  const holeYLower = 1.25;

  const holeLocations = [
    { x: -holeSpacingX, y: holeYUpper },
    { x:  holeSpacingX, y: holeYUpper },
    { x: -holeSpacingX, y: holeYLower },
    { x:  holeSpacingX, y: holeYLower }
  ];

  holeLocations.forEach(loc => {
    const holePath = new THREE.Path();
    holePath.absarc(loc.x, loc.y, holeRadius, 0, Math.PI * 2, true);
    vertShape.holes.push(holePath);
  });

  const vertGeom = new THREE.ExtrudeGeometry(vertShape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.035,
    bevelThickness: 0.035
  });
  vertGeom.computeVertexNormals();

  const vertMesh = new THREE.Mesh(vertGeom, materials.bracketMaterial);
  vertMesh.castShadow = true;
  vertMesh.receiveShadow = true;
  vertMesh.position.set(0, innerRadius, -thickness);

  // Stamped chamfer rings
  holeLocations.forEach(loc => {
    const ringGeom = new THREE.RingGeometry(holeRadius, holeRadius + 0.18, 32);
    const ringMesh = new THREE.Mesh(ringGeom, materials.bracketMaterial);
    ringMesh.position.set(loc.x, loc.y, thickness + 0.038);
    vertMesh.add(ringMesh);
  });

  // Horizontal Flange with central bolt port
  const horizShape = new THREE.Shape();
  horizShape.moveTo(-hw + cornerRadius, 0);
  horizShape.lineTo(hw - cornerRadius, 0);
  horizShape.quadraticCurveTo(hw, 0, hw, cornerRadius);
  horizShape.lineTo(hw, horizLength - cornerRadius);
  horizShape.quadraticCurveTo(hw, horizLength, hw - cornerRadius, horizLength);
  horizShape.lineTo(-hw + cornerRadius, horizLength);
  horizShape.quadraticCurveTo(-hw, horizLength, -hw, horizLength - cornerRadius);
  horizShape.lineTo(-hw, cornerRadius);
  horizShape.quadraticCurveTo(-hw, 0, -hw + cornerRadius, 0);

  const boltHoleRadius = 0.52;
  const boltHoleCenterZ = 2.15;
  const boltHolePath = new THREE.Path();
  boltHolePath.absarc(0, boltHoleCenterZ, boltHoleRadius, 0, Math.PI * 2, true);
  horizShape.holes.push(boltHolePath);

  const horizGeom = new THREE.ExtrudeGeometry(horizShape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.035,
    bevelThickness: 0.035
  });
  horizGeom.computeVertexNormals();

  const horizMesh = new THREE.Mesh(horizGeom, materials.bracketMaterial);
  horizMesh.castShadow = true;
  horizMesh.receiveShadow = true;
  horizMesh.rotation.x = Math.PI / 2;
  horizMesh.position.set(0, 0, innerRadius);

  // 90° Parametric Bend
  const bendSteps = 24;
  const bendWidthSteps = 16;
  const bendGeom = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= bendSteps; i++) {
    const t = i / bendSteps;
    const angle = Math.PI + t * (Math.PI / 2);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const y = innerRadius + outerRadius * sinA;
    const z = innerRadius + outerRadius * cosA;

    for (let j = 0; j <= bendWidthSteps; j++) {
      const u = j / bendWidthSteps;
      const x = -hw + u * width;
      positions.push(x, y, z);
      normals.push(0, sinA, cosA);
      uvs.push(u, t);
    }
  }

  const rowLength = bendWidthSteps + 1;
  for (let i = 0; i < bendSteps; i++) {
    for (let j = 0; j < bendWidthSteps; j++) {
      const a = i * rowLength + j;
      const b = (i + 1) * rowLength + j;
      const c = (i + 1) * rowLength + (j + 1);
      const d = i * rowLength + (j + 1);
      indices.push(a, b, d, b, c, d);
    }
  }

  // Inner bend
  const innerOffset = positions.length / 3;
  for (let i = 0; i <= bendSteps; i++) {
    const t = i / bendSteps;
    const angle = Math.PI + t * (Math.PI / 2);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const y = innerRadius + innerRadius * sinA;
    const z = innerRadius + innerRadius * cosA;

    for (let j = 0; j <= bendWidthSteps; j++) {
      const u = j / bendWidthSteps;
      const x = -hw + u * width;
      positions.push(x, y, z);
      normals.push(0, -sinA, -cosA);
      uvs.push(u, t);
    }
  }

  for (let i = 0; i < bendSteps; i++) {
    for (let j = 0; j < bendWidthSteps; j++) {
      const a = innerOffset + i * rowLength + j;
      const b = innerOffset + (i + 1) * rowLength + j;
      const c = innerOffset + (i + 1) * rowLength + (j + 1);
      const d = innerOffset + i * rowLength + (j + 1);
      indices.push(a, d, b, b, d, c);
    }
  }

  bendGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  bendGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  bendGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  bendGeom.setIndex(indices);
  bendGeom.computeVertexNormals();

  const bendMesh = new THREE.Mesh(bendGeom, materials.bracketMaterial);
  bendMesh.castShadow = true;

  const bracketBody = new THREE.Group();
  bracketBody.add(vertMesh, horizMesh, bendMesh);
  masterGroup.add(bracketBody);

  // Fastener Assembly
  const fastener = createHexBoltAssembly(materials, {
    boltRestY: 0.14,
    bottomWasherRestY: -thickness - 0.04,
    nutRestY: -thickness - 0.76
  });

  const fastenerGroup = new THREE.Group();
  fastenerGroup.position.set(0, 0, innerRadius + boltHoleCenterZ);
  fastenerGroup.add(fastener.topWasherMesh, fastener.boltGroup, fastener.bottomWasherMesh, fastener.nutMesh);
  masterGroup.add(fastenerGroup);

  masterGroup.position.set(0, -vertHeight * 0.28, -horizLength * 0.25);

  function setExplodedProgress(t) {
    const ease = 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    fastener.boltGroup.position.y = fastener.boltRestY + ease * 4.2;
    fastener.boltGroup.rotation.y = ease * Math.PI * 0.75;
    fastener.topWasherMesh.position.y = 0.12 + ease * 1.8;
    fastener.bottomWasherMesh.position.y = fastener.bottomWasherRestY - ease * 1.6;
    fastener.nutMesh.position.y = fastener.nutRestY - ease * 3.8;
    fastener.nutMesh.rotation.y = -ease * Math.PI * 0.8;
    bracketBody.position.y = ease * 0.3;
  }

  function setMaterialMode(mode) {
    const isWire = mode === 'wireframe';
    const mat = isWire ? materials.wireframeMaterial : materials.bracketMaterial;
    vertMesh.material = mat;
    horizMesh.material = mat;
    bendMesh.material = mat;
    fastener.hexHeadMesh.material = isWire ? materials.wireframeMaterial : materials.boltMaterial;
    fastener.topWasherMesh.material = isWire ? materials.wireframeMaterial : materials.washerMaterial;
    fastener.nutMesh.material = isWire ? materials.wireframeMaterial : materials.nutMaterial;
  }

  return {
    group: masterGroup,
    bracketBody,
    boltGroup: fastener.boltGroup,
    nutMesh: fastener.nutMesh,
    setExplodedProgress,
    setMaterialMode
  };
}

// -------------------------------------------------------------
// 2. HK-RG90-GUSSET: Heavy Gusset/Rib Reinforced 90° Bracket
// -------------------------------------------------------------
export function createGussetReinforcedBracket(materials) {
  const masterGroup = new THREE.Group();
  masterGroup.name = 'HK_RG90_Gusset_Assembly';

  const width = 5.2;
  const vertHeight = 4.8;
  const horizLength = 4.8;
  const thickness = 0.35;
  const innerRadius = 0.3;
  const hw = width / 2;

  // Vertical plate with 4 outer holes
  const vertShape = new THREE.Shape();
  vertShape.moveTo(-hw, 0);
  vertShape.lineTo(hw, 0);
  vertShape.lineTo(hw, vertHeight);
  vertShape.lineTo(-hw, vertHeight);
  vertShape.closePath();

  const holeR = 0.32;
  const holes = [
    [-1.6, 3.8], [1.6, 3.8],
    [-1.6, 1.6], [1.6, 1.6]
  ];
  holes.forEach(([hx, hy]) => {
    const p = new THREE.Path();
    p.absarc(hx, hy, holeR, 0, Math.PI * 2, true);
    vertShape.holes.push(p);
  });

  const vertMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(vertShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.bracketMaterial
  );
  vertMesh.position.set(0, innerRadius, -thickness);
  vertMesh.castShadow = true;

  // Horizontal plate with 2 bolt slots
  const horizShape = new THREE.Shape();
  horizShape.moveTo(-hw, 0);
  horizShape.lineTo(hw, 0);
  horizShape.lineTo(hw, horizLength);
  horizShape.lineTo(-hw, horizLength);
  horizShape.closePath();

  const boltHolePath1 = new THREE.Path();
  boltHolePath1.absarc(-1.2, 2.4, 0.48, 0, Math.PI * 2, true);
  const boltHolePath2 = new THREE.Path();
  boltHolePath2.absarc(1.2, 2.4, 0.48, 0, Math.PI * 2, true);
  horizShape.holes.push(boltHolePath1, boltHolePath2);

  const horizMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(horizShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.bracketMaterial
  );
  horizMesh.rotation.x = Math.PI / 2;
  horizMesh.position.set(0, 0, innerRadius);
  horizMesh.castShadow = true;

  // Central Stiffening Gusset Web (Triangular rib)
  const gussetShape = new THREE.Shape();
  gussetShape.moveTo(0, innerRadius + 0.1);
  gussetShape.lineTo(0, vertHeight * 0.75);
  gussetShape.lineTo(horizLength * 0.75, innerRadius + 0.1);
  gussetShape.closePath();

  const gussetGeom = new THREE.ExtrudeGeometry(gussetShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSize: 0.02,
    bevelThickness: 0.02
  });
  const gussetMesh = new THREE.Mesh(gussetGeom, materials.bracketMaterial);
  gussetMesh.position.set(-0.14, 0, 0);
  gussetMesh.castShadow = true;

  const bracketBody = new THREE.Group();
  bracketBody.add(vertMesh, horizMesh, gussetMesh);
  masterGroup.add(bracketBody);

  // Dual Fasteners on left & right
  const fast1 = createHexBoltAssembly(materials, { boltRestY: 0.14, bottomWasherRestY: -thickness - 0.04, nutRestY: -thickness - 0.76 });
  const fast2 = createHexBoltAssembly(materials, { boltRestY: 0.14, bottomWasherRestY: -thickness - 0.04, nutRestY: -thickness - 0.76 });

  const fGroup1 = new THREE.Group();
  fGroup1.position.set(-1.2, 0, innerRadius + 2.4);
  fGroup1.add(fast1.topWasherMesh, fast1.boltGroup, fast1.bottomWasherMesh, fast1.nutMesh);

  const fGroup2 = new THREE.Group();
  fGroup2.position.set(1.2, 0, innerRadius + 2.4);
  fGroup2.add(fast2.topWasherMesh, fast2.boltGroup, fast2.bottomWasherMesh, fast2.nutMesh);

  masterGroup.add(fGroup1, fGroup2);
  masterGroup.position.set(0, -vertHeight * 0.28, -horizLength * 0.25);

  function setExplodedProgress(t) {
    const ease = 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    [fast1, fast2].forEach(f => {
      f.boltGroup.position.y = f.boltRestY + ease * 4.2;
      f.boltGroup.rotation.y = ease * Math.PI * 0.75;
      f.topWasherMesh.position.y = 0.12 + ease * 1.8;
      f.bottomWasherMesh.position.y = f.bottomWasherRestY - ease * 1.6;
      f.nutMesh.position.y = f.nutRestY - ease * 3.8;
      f.nutMesh.rotation.y = -ease * Math.PI * 0.8;
    });
    bracketBody.position.y = ease * 0.3;
  }

  function setMaterialMode(mode) {
    const isWire = mode === 'wireframe';
    const mat = isWire ? materials.wireframeMaterial : materials.bracketMaterial;
    vertMesh.material = mat;
    horizMesh.material = mat;
    gussetMesh.material = mat;
    [fast1, fast2].forEach(f => {
      f.hexHeadMesh.material = isWire ? materials.wireframeMaterial : materials.boltMaterial;
      f.topWasherMesh.material = isWire ? materials.wireframeMaterial : materials.washerMaterial;
      f.nutMesh.material = isWire ? materials.wireframeMaterial : materials.nutMaterial;
    });
  }

  return {
    group: masterGroup,
    bracketBody,
    boltGroup: fast1.boltGroup,
    nutMesh: fast1.nutMesh,
    setExplodedProgress,
    setMaterialMode
  };
}

// -------------------------------------------------------------
// 3. HK-SL90-SLOTTED: Adjustable Slotted Precision Angle Bracket
// -------------------------------------------------------------
export function createSlottedBracket(materials) {
  const masterGroup = new THREE.Group();
  masterGroup.name = 'HK_SL90_Slotted_Assembly';

  const width = 4.6;
  const vertHeight = 4.4;
  const horizLength = 5.2; // Longer slotted flange
  const thickness = 0.32;
  const innerRadius = 0.28;
  const hw = width / 2;

  // Vertical plate with 2 round holes
  const vertShape = new THREE.Shape();
  vertShape.moveTo(-hw, 0);
  vertShape.lineTo(hw, 0);
  vertShape.lineTo(hw, vertHeight);
  vertShape.lineTo(-hw, vertHeight);
  vertShape.closePath();

  [[-1.2, 2.6], [1.2, 2.6]].forEach(([hx, hy]) => {
    const p = new THREE.Path();
    p.absarc(hx, hy, 0.34, 0, Math.PI * 2, true);
    vertShape.holes.push(p);
  });

  const vertMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(vertShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.bracketMaterial
  );
  vertMesh.position.set(0, innerRadius, -thickness);
  vertMesh.castShadow = true;

  // Horizontal plate with elongated oval adjustment slot
  const horizShape = new THREE.Shape();
  horizShape.moveTo(-hw, 0);
  horizShape.lineTo(hw, 0);
  horizShape.lineTo(hw, horizLength);
  horizShape.lineTo(-hw, horizLength);
  horizShape.closePath();

  // Elongated Slot (capsule)
  const slotW = 0.52;
  const slotZ1 = 1.4;
  const slotZ2 = 3.6;
  const slotPath = new THREE.Path();
  slotPath.moveTo(-slotW, slotZ1);
  slotPath.lineTo(-slotW, slotZ2);
  slotPath.absarc(0, slotZ2, slotW, Math.PI, 0, true);
  slotPath.lineTo(slotW, slotZ1);
  slotPath.absarc(0, slotZ1, slotW, 0, Math.PI, true);
  horizShape.holes.push(slotPath);

  const horizMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(horizShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }),
    materials.bracketMaterial
  );
  horizMesh.rotation.x = Math.PI / 2;
  horizMesh.position.set(0, 0, innerRadius);
  horizMesh.castShadow = true;

  const bracketBody = new THREE.Group();
  bracketBody.add(vertMesh, horizMesh);
  masterGroup.add(bracketBody);

  // Adjustable Carriage / Hex Fastener
  const fastener = createHexBoltAssembly(materials, {
    washerRadiusOut: 1.05, // Wide washer to span the slot
    boltRestY: 0.14,
    bottomWasherRestY: -thickness - 0.04,
    nutRestY: -thickness - 0.76
  });

  const fastenerGroup = new THREE.Group();
  fastenerGroup.position.set(0, 0, innerRadius + 2.5);
  fastenerGroup.add(fastener.topWasherMesh, fastener.boltGroup, fastener.bottomWasherMesh, fastener.nutMesh);
  masterGroup.add(fastenerGroup);

  masterGroup.position.set(0, -vertHeight * 0.28, -horizLength * 0.25);

  function setExplodedProgress(t) {
    const ease = 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    fastener.boltGroup.position.y = fastener.boltRestY + ease * 4.2;
    fastener.boltGroup.rotation.y = ease * Math.PI * 0.75;
    fastener.topWasherMesh.position.y = 0.12 + ease * 1.8;
    fastener.bottomWasherMesh.position.y = fastener.bottomWasherRestY - ease * 1.6;
    fastener.nutMesh.position.y = fastener.nutRestY - ease * 3.8;
    bracketBody.position.y = ease * 0.3;
  }

  function setMaterialMode(mode) {
    const isWire = mode === 'wireframe';
    const mat = isWire ? materials.wireframeMaterial : materials.bracketMaterial;
    vertMesh.material = mat;
    horizMesh.material = mat;
    fastener.hexHeadMesh.material = isWire ? materials.wireframeMaterial : materials.boltMaterial;
    fastener.topWasherMesh.material = isWire ? materials.wireframeMaterial : materials.washerMaterial;
    fastener.nutMesh.material = isWire ? materials.wireframeMaterial : materials.nutMaterial;
  }

  return {
    group: masterGroup,
    bracketBody,
    boltGroup: fastener.boltGroup,
    nutMesh: fastener.nutMesh,
    setExplodedProgress,
    setMaterialMode
  };
}

// -------------------------------------------------------------
// 4. HK-TP40-FLAT: Heavy-Duty 4-Hole Flat Mending Tie Plate
// -------------------------------------------------------------
export function createFlatTiePlate(materials) {
  const masterGroup = new THREE.Group();
  masterGroup.name = 'HK_TP40_Flat_Assembly';

  const width = 4.8;
  const length = 7.6;
  const thickness = 0.32;
  const hw = width / 2;
  const hl = length / 2;

  const plateShape = new THREE.Shape();
  plateShape.moveTo(-hw + 0.2, -hl);
  plateShape.lineTo(hw - 0.2, -hl);
  plateShape.quadraticCurveTo(hw, -hl, hw, -hl + 0.2);
  plateShape.lineTo(hw, hl - 0.2);
  plateShape.quadraticCurveTo(hw, hl, hw - 0.2, hl);
  plateShape.lineTo(-hw + 0.2, hl);
  plateShape.quadraticCurveTo(-hw, hl, -hw, hl - 0.2);
  plateShape.lineTo(-hw, -hl + 0.2);
  plateShape.quadraticCurveTo(-hw, -hl, -hw + 0.2, -hl);

  // 4 outer corner holes + 1 center bolt port
  const holeR = 0.34;
  const holes = [
    [-1.4, -2.4], [1.4, -2.4],
    [-1.4,  2.4], [1.4,  2.4]
  ];
  holes.forEach(([hx, hy]) => {
    const p = new THREE.Path();
    p.absarc(hx, hy, holeR, 0, Math.PI * 2, true);
    plateShape.holes.push(p);
  });

  // Center bolt hole
  const centerHole = new THREE.Path();
  centerHole.absarc(0, 0, 0.52, 0, Math.PI * 2, true);
  plateShape.holes.push(centerHole);

  const plateMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(plateShape, { depth: thickness, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035 }),
    materials.bracketMaterial
  );
  plateMesh.rotation.x = Math.PI / 2;
  plateMesh.position.set(0, 0, 0);
  plateMesh.castShadow = true;

  // Stamped bevel rings for the 4 anchor holes
  holes.forEach(([hx, hy]) => {
    const ringGeom = new THREE.RingGeometry(holeR, holeR + 0.16, 24);
    const ringMesh = new THREE.Mesh(ringGeom, materials.bracketMaterial);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(hx, 0.036, hy);
    plateMesh.add(ringMesh);
  });

  const bracketBody = new THREE.Group();
  bracketBody.add(plateMesh);
  masterGroup.add(bracketBody);

  // Central Fastener
  const fastener = createHexBoltAssembly(materials, {
    boltRestY: 0.14,
    bottomWasherRestY: -thickness - 0.04,
    nutRestY: -thickness - 0.76
  });

  const fastenerGroup = new THREE.Group();
  fastenerGroup.position.set(0, 0, 0);
  fastenerGroup.add(fastener.topWasherMesh, fastener.boltGroup, fastener.bottomWasherMesh, fastener.nutMesh);
  masterGroup.add(fastenerGroup);

  masterGroup.position.set(0, -0.6, 0);

  function setExplodedProgress(t) {
    const ease = 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    fastener.boltGroup.position.y = fastener.boltRestY + ease * 4.2;
    fastener.boltGroup.rotation.y = ease * Math.PI * 0.75;
    fastener.topWasherMesh.position.y = 0.12 + ease * 1.8;
    fastener.bottomWasherMesh.position.y = fastener.bottomWasherRestY - ease * 1.6;
    fastener.nutMesh.position.y = fastener.nutRestY - ease * 3.8;
    bracketBody.position.y = ease * 0.3;
  }

  function setMaterialMode(mode) {
    const isWire = mode === 'wireframe';
    const mat = isWire ? materials.wireframeMaterial : materials.bracketMaterial;
    plateMesh.material = mat;
    fastener.hexHeadMesh.material = isWire ? materials.wireframeMaterial : materials.boltMaterial;
    fastener.topWasherMesh.material = isWire ? materials.wireframeMaterial : materials.washerMaterial;
    fastener.nutMesh.material = isWire ? materials.wireframeMaterial : materials.nutMaterial;
  }

  return {
    group: masterGroup,
    bracketBody,
    boltGroup: fastener.boltGroup,
    nutMesh: fastener.nutMesh,
    setExplodedProgress,
    setMaterialMode
  };
}

