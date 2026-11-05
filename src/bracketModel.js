import * as THREE from 'three';

/**
 * Procedural 3D Model of HK Enterprise Galvanized Metal L-Bracket with Hex Bolt Assembly
 * Exact match to user uploaded design reference:
 * - 90-degree bend with realistic sheet metal curvature and thickness
 * - 4 countersunk/stamped mounting holes on the vertical flange in 2x2 grid
 * - Horizontal flange with central fastener port
 * - Heavy-duty Grade 8.8 Hex Bolt with top chamfer, washer, threaded shank, and lock nut
 * - Exploded view separation axes
 */

export function createBracketModel(materials) {
  const masterGroup = new THREE.Group();
  masterGroup.name = 'HK_Enterprise_Bracket_Assembly';

  // Dimensions (scaled: 1 unit = 10mm)
  const width = 4.8;        // 48mm wide
  const vertHeight = 4.4;   // 44mm vertical flange height
  const horizLength = 4.4;  // 44mm horizontal flange length
  const thickness = 0.32;   // 3.2mm heavy gauge steel
  const innerRadius = 0.28; // 2.8mm inner bend radius
  const outerRadius = innerRadius + thickness; // 6.0mm outer bend radius
  const cornerRadius = 0.22;// Rounded sheet corners
  const hw = width / 2;

  // -------------------------------------------------------------
  // 1. VERTICAL FLANGE (with 4 mounting holes in 2x2 grid)
  // -------------------------------------------------------------
  const vertShape = new THREE.Shape();

  // Outer rectangle with rounded top corners
  vertShape.moveTo(-hw + cornerRadius, 0);
  vertShape.lineTo(hw - cornerRadius, 0);
  vertShape.quadraticCurveTo(hw, 0, hw, cornerRadius);
  vertShape.lineTo(hw, vertHeight - cornerRadius);
  vertShape.quadraticCurveTo(hw, vertHeight, hw - cornerRadius, vertHeight);
  vertShape.lineTo(-hw + cornerRadius, vertHeight);
  vertShape.quadraticCurveTo(-hw, vertHeight, -hw, vertHeight - cornerRadius);
  vertShape.lineTo(-hw, cornerRadius);
  vertShape.quadraticCurveTo(-hw, 0, -hw + cornerRadius, 0);

  // 4 Mounting Holes (2x2 layout matching reference photo)
  const holeRadius = 0.34;   // 6.8mm diameter mounting holes
  const holeSpacingX = 1.35; // ±13.5mm from center
  const holeYUpper = 3.35;   // Upper row
  const holeYLower = 1.25;   // Lower row near bend

  const holeLocations = [
    { x: -holeSpacingX, y: holeYUpper, name: 'Hole_Top_Left' },
    { x: holeSpacingX, y: holeYUpper, name: 'Hole_Top_Right' },
    { x: -holeSpacingX, y: holeYLower, name: 'Hole_Bottom_Left' },
    { x: holeSpacingX, y: holeYLower, name: 'Hole_Bottom_Right' },
  ];

  holeLocations.forEach(loc => {
    const holePath = new THREE.Path();
    holePath.absarc(loc.x, loc.y, holeRadius, 0, Math.PI * 2, true);
    vertShape.holes.push(holePath);
  });

  const vertExtrudeSettings = {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035
  };

  const vertGeom = new THREE.ExtrudeGeometry(vertShape, vertExtrudeSettings);
  vertGeom.computeVertexNormals();

  const vertMesh = new THREE.Mesh(vertGeom, materials.bracketMaterial);
  vertMesh.castShadow = true;
  vertMesh.receiveShadow = true;
  // Position so its bottom meets the bend at Y = innerRadius, outer surface at Z = -thickness, inner surface at Z = 0
  vertMesh.position.set(0, innerRadius, -thickness);

  // Add stamped/countersunk beveled rings around the 4 holes
  const countersunkGroup = new THREE.Group();
  holeLocations.forEach(loc => {
    // Front beveled ring
    const ringGeom = new THREE.RingGeometry(holeRadius, holeRadius + 0.18, 32);
    const ringMesh = new THREE.Mesh(ringGeom, materials.bracketMaterial);
    ringMesh.position.set(loc.x, loc.y, thickness + 0.038);
    countersunkGroup.add(ringMesh);

    // Subtle inner bevel slope
    const bevelConeGeom = new THREE.CylinderGeometry(holeRadius + 0.12, holeRadius, 0.07, 32, 1, true);
    const bevelConeMesh = new THREE.Mesh(bevelConeGeom, materials.bracketMaterial);
    bevelConeMesh.rotation.x = Math.PI / 2;
    bevelConeMesh.position.set(loc.x, loc.y, thickness);
    countersunkGroup.add(bevelConeMesh);
  });
  vertMesh.add(countersunkGroup);

  // -------------------------------------------------------------
  // 2. HORIZONTAL FLANGE (with central bolt port)
  // -------------------------------------------------------------
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

  // Central bolt hole (Ø 10.5mm for M10 bolt)
  const boltHoleRadius = 0.52;
  const boltHoleCenterZ = 2.15;
  const boltHolePath = new THREE.Path();
  boltHolePath.absarc(0, boltHoleCenterZ, boltHoleRadius, 0, Math.PI * 2, true);
  horizShape.holes.push(boltHolePath);

  const horizExtrudeSettings = {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035
  };

  const horizGeom = new THREE.ExtrudeGeometry(horizShape, horizExtrudeSettings);
  horizGeom.computeVertexNormals();

  const horizMesh = new THREE.Mesh(horizGeom, materials.bracketMaterial);
  horizMesh.castShadow = true;
  horizMesh.receiveShadow = true;
  // Rotate horizontal plate 90 degrees around X
  horizMesh.rotation.x = Math.PI / 2;
  horizMesh.position.set(0, 0, innerRadius);

  // -------------------------------------------------------------
  // 3. 90-DEGREE CURVED BEND (Precision Parametric Shell)
  // -------------------------------------------------------------
  const bendSteps = 24;
  const bendWidthSteps = 16;
  const bendGeom = new THREE.BufferGeometry();

  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Outer curved surface
  for (let i = 0; i <= bendSteps; i++) {
    const t = i / bendSteps;
    const angle = Math.PI + t * (Math.PI / 2);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const y = innerRadius + outerRadius * sinA;
    const z = innerRadius + outerRadius * cosA;

    const ny = sinA;
    const nz = cosA;

    for (let j = 0; j <= bendWidthSteps; j++) {
      const u = j / bendWidthSteps;
      const x = -hw + u * width;

      positions.push(x, y, z);
      normals.push(0, ny, nz);
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

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Inner curved surface
  const innerOffset = positions.length / 3;
  for (let i = 0; i <= bendSteps; i++) {
    const t = i / bendSteps;
    const angle = Math.PI + t * (Math.PI / 2);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const y = innerRadius + innerRadius * sinA;
    const z = innerRadius + innerRadius * cosA;

    const ny = -sinA;
    const nz = -cosA;

    for (let j = 0; j <= bendWidthSteps; j++) {
      const u = j / bendWidthSteps;
      const x = -hw + u * width;

      positions.push(x, y, z);
      normals.push(0, ny, nz);
      uvs.push(u, t);
    }
  }

  for (let i = 0; i < bendSteps; i++) {
    for (let j = 0; j < bendWidthSteps; j++) {
      const a = innerOffset + i * rowLength + j;
      const b = innerOffset + (i + 1) * rowLength + j;
      const c = innerOffset + (i + 1) * rowLength + (j + 1);
      const d = innerOffset + i * rowLength + (j + 1);

      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Side end caps
  const leftStart = positions.length / 3;
  for (let i = 0; i <= bendSteps; i++) {
    const t = i / bendSteps;
    const angle = Math.PI + t * (Math.PI / 2);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    positions.push(-hw, innerRadius + innerRadius * sinA, innerRadius + innerRadius * cosA);
    normals.push(-1, 0, 0);
    uvs.push(0, t);

    positions.push(-hw, innerRadius + outerRadius * sinA, innerRadius + outerRadius * cosA);
    normals.push(-1, 0, 0);
    uvs.push(1, t);
  }

  for (let i = 0; i < bendSteps; i++) {
    const a = leftStart + i * 2;
    const b = leftStart + i * 2 + 1;
    const c = leftStart + (i + 1) * 2 + 1;
    const d = leftStart + (i + 1) * 2;

    indices.push(a, b, d);
    indices.push(b, c, d);
  }

  const rightStart = positions.length / 3;
  for (let i = 0; i <= bendSteps; i++) {
    const t = i / bendSteps;
    const angle = Math.PI + t * (Math.PI / 2);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    positions.push(hw, innerRadius + innerRadius * sinA, innerRadius + innerRadius * cosA);
    normals.push(1, 0, 0);
    uvs.push(0, t);

    positions.push(hw, innerRadius + outerRadius * sinA, innerRadius + outerRadius * cosA);
    normals.push(1, 0, 0);
    uvs.push(1, t);
  }

  for (let i = 0; i < bendSteps; i++) {
    const a = rightStart + i * 2;
    const b = rightStart + i * 2 + 1;
    const c = rightStart + (i + 1) * 2 + 1;
    const d = rightStart + (i + 1) * 2;

    indices.push(a, d, b);
    indices.push(b, d, c);
  }

  bendGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  bendGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  bendGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  bendGeom.setIndex(indices);
  bendGeom.computeVertexNormals();

  const bendMesh = new THREE.Mesh(bendGeom, materials.bracketMaterial);
  bendMesh.castShadow = true;
  bendMesh.receiveShadow = true;

  // Bracket Body Group
  const bracketBody = new THREE.Group();
  bracketBody.name = 'Bracket_Sheet_Metal_Body';
  bracketBody.add(vertMesh);
  bracketBody.add(horizMesh);
  bracketBody.add(bendMesh);

  // Subtle stamped crease line along inner fold
  const creaseGeom = new THREE.CylinderGeometry(0.035, 0.035, width - 0.1, 16);
  const creaseMesh = new THREE.Mesh(creaseGeom, materials.bracketMaterial);
  creaseMesh.rotation.z = Math.PI / 2;
  creaseMesh.position.set(0, innerRadius + 0.015, innerRadius + 0.015);
  bracketBody.add(creaseMesh);

  masterGroup.add(bracketBody);

  // -------------------------------------------------------------
  // 4. FASTENER ASSEMBLY (Hex Bolt, Washers, Nut)
  // -------------------------------------------------------------
  const boltWorldX = 0;
  const boltWorldZ = innerRadius + boltHoleCenterZ;
  const bracketTopY = 0;

  const fastenerGroup = new THREE.Group();
  fastenerGroup.name = 'Fastener_Assembly';
  fastenerGroup.position.set(boltWorldX, 0, boltWorldZ);

  // A. Top Washer (Dark hardened retention washer as in reference photo)
  const washerRadiusOut = 0.92;
  const washerRadiusIn = boltHoleRadius;
  const washerThickness = 0.12;

  const washerShape = new THREE.Shape();
  washerShape.absarc(0, 0, washerRadiusOut, 0, Math.PI * 2, false);
  const washerHole = new THREE.Path();
  washerHole.absarc(0, 0, washerRadiusIn, 0, Math.PI * 2, true);
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
  topWasherMesh.position.set(0, bracketTopY + washerThickness, 0);
  topWasherMesh.castShadow = true;
  topWasherMesh.receiveShadow = true;
  fastenerGroup.add(topWasherMesh);

  // B. Grade 8.8 Hex Bolt (Hex head + chamfer + shank + threads)
  const boltGroup = new THREE.Group();
  boltGroup.name = 'Hex_Bolt_Grade_8_8';

  const hexRadius = 0.86;
  const hexHeight = 0.58;

  const hexHeadGeom = new THREE.CylinderGeometry(hexRadius, hexRadius, hexHeight, 6);
  hexHeadGeom.computeVertexNormals();
  const hexHeadMesh = new THREE.Mesh(hexHeadGeom, materials.boltMaterial);
  hexHeadMesh.castShadow = true;
  hexHeadMesh.receiveShadow = true;
  hexHeadMesh.position.set(0, hexHeight / 2, 0);
  boltGroup.add(hexHeadMesh);

  const hexCrownGeom = new THREE.CylinderGeometry(hexRadius * 0.88, hexRadius, 0.07, 6);
  const hexCrownMesh = new THREE.Mesh(hexCrownGeom, materials.boltMaterial);
  hexCrownMesh.position.set(0, hexHeight + 0.035, 0);
  boltGroup.add(hexCrownMesh);

  const headMarkingsGroup = new THREE.Group();
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
    headMarkingsGroup.add(markMesh);
  }
  const stampRingGeom = new THREE.RingGeometry(0.2, 0.26, 24);
  const stampRingMesh = new THREE.Mesh(stampRingGeom, markMaterial);
  stampRingMesh.rotation.x = -Math.PI / 2;
  stampRingMesh.position.set(0, hexHeight + 0.071, 0);
  headMarkingsGroup.add(stampRingMesh);
  boltGroup.add(headMarkingsGroup);

  // Bolt Threaded Shank
  const shankRadius = 0.48;
  const shankLength = 2.8;
  const shankGeom = new THREE.CylinderGeometry(shankRadius, shankRadius, shankLength, 32);
  shankGeom.computeVertexNormals();
  const shankMesh = new THREE.Mesh(shankGeom, materials.boltMaterial);
  shankMesh.castShadow = true;
  shankMesh.position.set(0, -shankLength / 2, 0);
  boltGroup.add(shankMesh);

  const threadCount = 18;
  const threadPitch = shankLength / threadCount;
  for (let t = 0; t < threadCount; t++) {
    const threadGeom = new THREE.TorusGeometry(shankRadius + 0.018, 0.02, 8, 24);
    const threadMesh = new THREE.Mesh(threadGeom, materials.boltMaterial);
    threadMesh.rotation.x = Math.PI / 2;
    threadMesh.position.set(0, -0.4 - t * threadPitch, 0);
    boltGroup.add(threadMesh);
  }

  const boltRestY = bracketTopY + washerThickness + 0.02;
  boltGroup.position.set(0, boltRestY, 0);
  fastenerGroup.add(boltGroup);

  // C. Bottom Washer
  const bottomWasherMesh = new THREE.Mesh(washerGeom, materials.nutMaterial);
  bottomWasherMesh.rotation.x = Math.PI / 2;
  const bottomWasherRestY = -thickness - 0.04;
  bottomWasherMesh.position.set(0, bottomWasherRestY, 0);
  bottomWasherMesh.castShadow = true;
  fastenerGroup.add(bottomWasherMesh);

  // D. Bottom Hex Nut
  const nutHeight = 0.68;
  const nutGeom = new THREE.CylinderGeometry(hexRadius, hexRadius, nutHeight, 6);
  nutGeom.computeVertexNormals();
  const nutMesh = new THREE.Mesh(nutGeom, materials.nutMaterial);
  nutMesh.castShadow = true;
  nutMesh.receiveShadow = true;
  const nutRestY = bottomWasherRestY - washerThickness - nutHeight / 2 - 0.02;
  nutMesh.position.set(0, nutRestY, 0);
  fastenerGroup.add(nutMesh);

  masterGroup.add(fastenerGroup);

  // Center the assembly pivot point around the center of mass
  masterGroup.position.set(0, -vertHeight * 0.28, -horizLength * 0.25);

  // Exploded View Controller Function
  function setExplodedProgress(t) {
    const clamped = Math.max(0, Math.min(1, t));
    const ease = 1 - Math.pow(1 - clamped, 3);

    boltGroup.position.y = boltRestY + ease * 4.2;
    boltGroup.rotation.y = ease * Math.PI * 0.75;

    topWasherMesh.position.y = bracketTopY + washerThickness + ease * 1.8;

    bottomWasherMesh.position.y = bottomWasherRestY - ease * 1.6;

    nutMesh.position.y = nutRestY - ease * 3.8;
    nutMesh.rotation.y = -ease * Math.PI * 0.8;

    bracketBody.position.y = ease * 0.3;
    bracketBody.rotation.x = ease * -0.08;
  }

  // Material Toggle Mode
  function setMaterialMode(mode) {
    const isWireframe = mode === 'wireframe';
    vertMesh.material = isWireframe ? materials.wireframeMaterial : materials.bracketMaterial;
    horizMesh.material = isWireframe ? materials.wireframeMaterial : materials.bracketMaterial;
    bendMesh.material = isWireframe ? materials.wireframeMaterial : materials.bracketMaterial;
    hexHeadMesh.material = isWireframe ? materials.wireframeMaterial : materials.boltMaterial;
    topWasherMesh.material = isWireframe ? materials.wireframeMaterial : materials.washerMaterial;
    shankMesh.material = isWireframe ? materials.wireframeMaterial : materials.boltMaterial;
    nutMesh.material = isWireframe ? materials.wireframeMaterial : materials.nutMaterial;
  }

  return {
    group: masterGroup,
    bracketBody,
    fastenerGroup,
    boltGroup,
    topWasherMesh,
    bottomWasherMesh,
    nutMesh,
    setExplodedProgress,
    setMaterialMode,
    holeLocations,
    dimensions: {
      width: 48,
      height: 44,
      length: 44,
      thickness: 3.2,
      holeDiameter: 6.8,
      boltDiameter: 10
    }
  };
}
