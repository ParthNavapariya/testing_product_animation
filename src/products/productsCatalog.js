import {
  createReferenceLBracket,
  createGussetReinforcedBracket,
  createSlottedBracket,
  createFlatTiePlate
} from './models.js';

export const PRODUCTS_CATALOG = [
  {
    id: 'hk-lb90-zinc',
    name: 'HK-LB90 Precision Metal L-Bracket',
    series: 'HK-90 SERIES • REFERENCE DESIGN',
    badge: 'UPLOADED REFERENCE',
    badgeClass: 'highlight',
    tagline: 'True 90° Structural Angle with Quad Vertical Anchors & M10 Fastener',
    heroDesc: 'Precision cold-formed structural steel angle bracket engineered with 4-point countersunk vertical anchors and heavy-duty Grade 8.8 hex bolt assembly. Replicated 1:1 from the uploaded physical specimen.',
    hasReferencePhoto: true,
    photoUrl: '/assets/reference-bracket.jpg',
    specs: {
      angle: '90.0°',
      angleLabel: 'Cold-Bent Angle',
      holes: '4x Quad',
      holesLabel: 'Countersunk Ports',
      gauge: '3.2mm',
      gaugeLabel: 'Carbon Steel Plate',
      fastener: 'Grade 8.8',
      fastenerLabel: 'M10 Hex Bolt'
    },
    metrics: [
      { label: 'Yield Strength (Re)', val: '355 MPa', pct: '92%' },
      { label: 'Ultimate Tensile Load', val: '1,850 kgf', pct: '96%' },
      { label: 'Angular Bend Precision', val: '90.0° ± 0.15°', pct: '99%' },
      { label: 'Salt-Spray Corrosion Resistance', val: '480+ Hours (ASTM B117)', pct: '88%' }
    ],
    features: [
      {
        title: 'Hot-Dip Galvanized Passivation',
        desc: 'Micro-crystalline spangle pattern protects against oxidation and environmental exposure.'
      },
      {
        title: 'Reinforced Bend Proximity',
        desc: 'Lower anchor pair positioned directly above the fold line to eliminate shear displacement.'
      },
      {
        title: 'Smooth 2.8mm Inner Fillet',
        desc: 'Precision inner radius prevents micro-fracturing along the 90-degree bend spine.'
      }
    ],
    explodedParts: [
      { num: '01', title: 'Grade 8.8 Hex Bolt', desc: 'Forged steel with 6-point hex head, torque stampings, and M10 threaded shank.' },
      { num: '02', title: 'Hardened Top Washer', desc: 'High-friction dark retention washer distributing clamping force evenly.' },
      { num: '03', title: '90° Structural Angle Body', desc: 'Heavy-duty cold-formed body with 4x vertical mounting ports.' },
      { num: '04', title: 'Dual Locking Hex Nut', desc: 'Heavy-gauge zinc-coated hex nut engineered for cyclic load retention.' }
    ],
    annotations: [
      { id: 'bolt', title: 'Grade 8.8 Hex Fastener', subtitle: 'M10 Machined Bolt with top chamfer & radial torque stamps', category: 'FASTENER', offset: [0, 0.9, 0.8] },
      { id: 'anchors', title: 'Dual Upper Anchors', subtitle: 'Ø 6.8mm countersunk ports for flush masonry or timber studs', category: 'MOUNTING', offset: [1.35, 2.2, -0.2] },
      { id: 'fillet', title: 'Cold-Formed 90° Fillet', subtitle: 'Continuous seamless bend preserving grain structure', category: 'STRUCTURE', offset: [-1.8, 0.4, 0.4] },
      { id: 'finish', title: 'Galvanized Zinc Spangle', subtitle: 'ASTM B117 salt-spray resistant crystalline passivation layer', category: 'SURFACE', offset: [0, 1.8, 0.1] }
    ],
    createModel: createReferenceLBracket
  },
  {
    id: 'hk-rg90-gusset',
    name: 'HK-RG90 Gusset-Reinforced 90° Bracket',
    series: 'HK-MAX SERIES • HIGH LOAD',
    badge: 'HEAVY SHEAR',
    badgeClass: 'accent',
    tagline: 'Triangular Stiffening Web with Dual Bolt Locking Ports',
    heroDesc: 'Ultra-stiff angle bracket engineered for extreme bending loads and seismic joints. Features an integrated cold-welded central triangular web and dual M10 fastener channels.',
    hasReferencePhoto: false,
    specs: {
      angle: '90.0°',
      angleLabel: 'Gusseted Corner',
      holes: '4x Port',
      holesLabel: 'Perimeter Mounts',
      gauge: '3.5mm',
      gaugeLabel: 'Heavy-Duty Gauge',
      fastener: '2x M10',
      fastenerLabel: 'Dual Hex Fasteners'
    },
    metrics: [
      { label: 'Yield Strength (Re)', val: '420 MPa', pct: '98%' },
      { label: 'Ultimate Tensile Load', val: '2,850 kgf', pct: '99%' },
      { label: 'Angular Deflection Resistance', val: '< 0.05° @ Peak Load', pct: '98%' },
      { label: 'Salt-Spray Corrosion Resistance', val: '480+ Hours (ASTM B117)', pct: '88%' }
    ],
    features: [
      {
        title: 'Triangular Center Gusset',
        desc: 'Eliminates 90° leg deflection under extreme outward cantilevering and heavy seismic moment loads.'
      },
      {
        title: 'Dual Clamping Footprint',
        desc: 'Two parallel M10 bolt positions spread mechanical anchoring torque across a wider base.'
      },
      {
        title: 'Quad Perimeter Ports',
        desc: 'Corner-stabilized mounting holes prevent bracket twisting along timber or metal studs.'
      }
    ],
    explodedParts: [
      { num: '01', title: 'Dual Grade 8.8 Bolts', desc: 'Twin M10 high-tensile fasteners providing balanced symmetrical clamping.' },
      { num: '02', title: 'Hardened Spring Washers', desc: 'Even load distribution pads absorbing cyclic vibration.' },
      { num: '03', title: 'Gusseted Angle Plate', desc: 'Monolithic steel plate reinforced with high-frequency fillet web.' },
      { num: '04', title: 'Dual Heavy Nuts', desc: 'DIN 934 heavy hex nuts providing anti-loosening locking torque.' }
    ],
    annotations: [
      { id: 'gusset', title: 'Triangular Gusset Rib', subtitle: 'Stiffens angle against moment flexure and corner fatigue', category: 'REINFORCEMENT', offset: [0, 1.4, 1.2] },
      { id: 'dual-bolt', title: 'Dual M10 Fasteners', subtitle: 'Parallel bolt channels for high-torque beam anchorages', category: 'FASTENER', offset: [-1.2, 0.9, 0.8] },
      { id: 'flange', title: '3.5mm Cold-Rolled Plate', subtitle: 'High-yield structural carbon steel with zinc coating', category: 'MATERIAL', offset: [1.8, 1.8, -0.2] }
    ],
    createModel: createGussetReinforcedBracket
  },
  {
    id: 'hk-sl90-slotted',
    name: 'HK-SL90 Adjustable Slotted Angle Bracket',
    series: 'HK-FIT SERIES • SLOTTED ALIGNMENT',
    badge: 'ALIGNMENT PRO',
    badgeClass: 'cyan',
    tagline: 'Elongated Precision Slot for Micro-Adjustable Field Mounting',
    heroDesc: 'Engineered for field installations requiring precise axial alignment. Features an extended horizontal tongue with an elongated capsule slot to accommodate thermal expansion and framing offsets.',
    hasReferencePhoto: false,
    specs: {
      angle: '90.0°',
      angleLabel: 'Rigid Bent Angle',
      holes: '2x Round + 1x Slot',
      holesLabel: 'Hybrid Mounting',
      gauge: '3.2mm',
      gaugeLabel: 'High-Tensile Steel',
      fastener: 'M10 Wide',
      fastenerLabel: 'Carriage Washer Set'
    },
    metrics: [
      { label: 'Yield Strength (Re)', val: '345 MPa', pct: '90%' },
      { label: 'Axial Adjustment Range', val: '22 mm Travel', pct: '95%' },
      { label: 'Ultimate Tensile Load', val: '1,620 kgf', pct: '89%' },
      { label: 'Salt-Spray Corrosion Resistance', val: '480+ Hours (ASTM B117)', pct: '88%' }
    ],
    features: [
      {
        title: '22mm Elongated Slot',
        desc: 'Allows continuous axial adjustment before final torque specification is applied.'
      },
      {
        title: 'Oversized Retention Washer',
        desc: 'Broad flange washer bridges the slot completely to prevent local plate dishing.'
      },
      {
        title: 'Thermal Expansion Relief',
        desc: 'Accommodates building movement and seasonal expansion in steel/timber framing.'
      }
    ],
    explodedParts: [
      { num: '01', title: 'Carriage Hex Fastener', desc: 'Heavy M10 bolt with chamfered top for slotted channel installation.' },
      { num: '02', title: 'Oversized Seat Washer', desc: 'Heavy-diameter washer distributing clamping friction across slot edges.' },
      { num: '03', title: 'Slotted Angle Flange', desc: 'Precision laser-machined 22mm travel slot with rounded margins.' },
      { num: '04', title: 'Vibration-Resistant Nut', desc: 'High-torque retention nut locking the adjusted position firmly.' }
    ],
    annotations: [
      { id: 'slot', title: '22mm Travel Slot', subtitle: 'Smooth machined channel for fine-tuned leveling and framing alignment', category: 'ADJUSTMENT', offset: [0, 0.4, 1.6] },
      { id: 'washer', title: 'Oversized Seat Washer', subtitle: 'Extra-wide washer spanning slot width with zero dishing', category: 'HARDWARE', offset: [0, 0.9, 0.6] },
      { id: 'anchors', title: 'Dual Fixed Ports', subtitle: 'High-shear anchor points for fixed base attachment', category: 'MOUNTING', offset: [-1.2, 1.8, -0.2] }
    ],
    createModel: createSlottedBracket
  },
  {
    id: 'hk-tp40-flat',
    name: 'HK-TP40 Heavy 4-Hole Flat Mending Tie Plate',
    series: 'HK-TIE SERIES • FLAT JOINER',
    badge: 'STRUCTURAL TIE',
    badgeClass: 'gold',
    tagline: 'High-Shear Flush Joiner Plate for Splice & Truss Connections',
    heroDesc: 'Heavy-gauge flat steel tie plate for splicing butt joints, truss reinforcement, and post-to-beam stabilization. Features four corner countersunk ports and a central heavy anchoring bolt.',
    hasReferencePhoto: false,
    specs: {
      angle: '180° Flat',
      angleLabel: 'Planar Splice Plate',
      holes: '4x Corner + 1x Center',
      holesLabel: '5-Point Mounting',
      gauge: '3.2mm',
      gaugeLabel: 'Cold-Rolled Steel',
      fastener: 'Center M10',
      fastenerLabel: 'Primary Tie Bolt'
    },
    metrics: [
      { label: 'Yield Strength (Re)', val: '380 MPa', pct: '94%' },
      { label: 'Planar Shear Capacity', val: '2,200 kgf', pct: '97%' },
      { label: 'Flatness Tolerance', val: '< 0.08 mm Planar', pct: '99%' },
      { label: 'Salt-Spray Corrosion Resistance', val: '480+ Hours (ASTM B117)', pct: '88%' }
    ],
    features: [
      {
        title: 'Zero-Deflection Flat Profile',
        desc: 'Ensures completely flush timber and metal butt joints without projection interference.'
      },
      {
        title: '5-Point Multi-Vector Fastening',
        desc: 'Combines 4 perimeter screws with central heavy bolt for omni-directional stability.'
      },
      {
        title: 'Hot-Dip Galvanized Zinc Spangle',
        desc: 'Passivated metallic surface engineered for indoor framing and exterior exposures.'
      }
    ],
    explodedParts: [
      { num: '01', title: 'Central Tie Fastener', desc: 'M10 grade bolt clamping the structural joiner plate directly to the sub-frame.' },
      { num: '02', title: 'Friction Disk Washer', desc: 'Heavy washer maximizing surface friction across the planar plate.' },
      { num: '03', title: 'Flat Mending Plate', desc: '3.2mm heavy steel plate with rounded corners and countersunk holes.' },
      { num: '04', title: 'Lock Nut Assembly', desc: 'Vibration-tight nut anchoring through structural framing member.' }
    ],
    annotations: [
      { id: 'plate', title: 'Flat Structural Tie Plate', subtitle: '76mm × 48mm planar steel plate for truss and splicing joints', category: 'STRUCTURE', offset: [0, 0.2, 0] },
      { id: 'bolt', title: 'Center M10 Tie Bolt', subtitle: 'Heavy-duty central anchor with Grade 8.8 tensile rating', category: 'FASTENER', offset: [0, 0.9, 0] },
      { id: 'countersunk', title: 'Corner Anchor Ports', subtitle: '4 countersunk screw ports for flush timber or steel attachment', category: 'MOUNTING', offset: [1.4, 0.3, 2.4] }
    ],
    createModel: createFlatTiePlate
  }
];

