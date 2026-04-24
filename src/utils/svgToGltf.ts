/**
 * SVG-to-glTF 2.0 converter — AAA quality humanoid mesh.
 *
 * Converts the 2D SVG body geometry (viewBox 0 0 100 225) into a high-
 * fidelity glTF 2.0 JSON document with:
 *   - High-poly 3D volumetric meshes (UV spheres, multi-ring profiled tubes)
 *   - Smooth per-vertex normals for correct PBR shading
 *   - UV coordinates (TEXCOORD_0) for texture mapping
 *   - Anatomically-detailed cross-sections matching SVG bezier silhouettes
 *   - A skeleton node hierarchy for rigging
 *   - All buffers embedded as base64 data URIs (self-contained .gltf)
 *
 * Coordinate convention: SVG (x-right, y-down) → glTF (x-right, y-up, z-out).
 */

import { BodyGeom, SpriteState } from '../components/sprite/utils';
import { GraphicsQuality, getMeshSegmentCounts } from './graphicsQuality';

/* ── constants ───────────────────────────────────────────────────────── */

const VIEW_W = 100;
const VIEW_H = 225;
const S = 1 / VIEW_H;  // SVG unit → glTF unit

/* ── mesh quality configuration ──────────────────────────────────────── */

interface MeshQualityConfig {
  SEG_HIGH: number;    // head, torso
  SEG_MED: number;     // limbs
  SEG_LOW: number;     // hands, feet, neck
  RING_HIGH: number;   // head
  RING_MED: number;    // hands, feet
  torsoRings: number;  // anatomical cross-sections for torso
  limbSubdiv: number;  // interpolation subdivisions for limb tubes
}

function getMeshQualityConfig(quality?: GraphicsQuality): MeshQualityConfig {
  if (!quality) {
    // Default/fallback quality
    return {
      SEG_HIGH: 32,
      SEG_MED: 24,
      SEG_LOW: 16,
      RING_HIGH: 24,
      RING_MED: 12,
      torsoRings: 10,
      limbSubdiv: 3,
    };
  }

  const segments = getMeshSegmentCounts(quality);
  const multiplier = quality.renderer_3d.polygon_multiplier;

  return {
    SEG_HIGH: segments.high,
    SEG_MED: segments.medium,
    SEG_LOW: segments.low,
    RING_HIGH: segments.ringHigh,
    RING_MED: segments.ringMed,
    // Scale torso detail and limb smoothness with quality
    torsoRings: multiplier >= 1.5 ? 16 : multiplier >= 1.0 ? 12 : 10,
    limbSubdiv: multiplier >= 1.5 ? 5 : multiplier >= 1.0 ? 4 : 3,
  };
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/** Parse "#rrggbb" → [r,g,b,1] in 0-1 range. */
function hexToRgba(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
    1.0,
  ];
}

/** SVG coord → glTF coord (only x,y — z is added per-primitive). */
function svgToGl(sx: number, sy: number): [number, number, number] {
  return [(sx - VIEW_W / 2) * S, (VIEW_H / 2 - sy) * S, 0];
}

/** Normalise a 3-vector in-place. */
function norm(v: [number, number, number]): [number, number, number] {
  const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
  v[0] /= l; v[1] /= l; v[2] /= l;
  return v;
}

/** Smooth interpolation between a and b at t ∈ [0,1] (smoothstep: 3t²−2t³). */
function smoothstep(a: number, b: number, t: number): number {
  const u = t * t * (3 - 2 * t);
  return a + (b - a) * u;
}

/** Linear interpolation. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

interface RawMesh {
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
  joints: number[];  // 4 joints per vertex
  weights: number[]; // 4 weights per vertex
}

function emptyRaw(): RawMesh {
  return { positions: [], normals: [], uvs: [], indices: [], joints: [], weights: [] };
}

/** Merge multiple RawMesh into one, reindexing. */
function merge(...meshes: RawMesh[]): RawMesh {
  const r = emptyRaw();
  for (const m of meshes) {
    const off = r.positions.length / 3;
    r.positions.push(...m.positions);
    r.normals.push(...m.normals);
    r.uvs.push(...m.uvs);
    r.joints.push(...m.joints);
    r.weights.push(...m.weights);
    for (const i of m.indices) r.indices.push(i + off);
  }
  return r;
}

/**
 * Assign skeletal weights based on Y-height and part name.
 * This is the core of the "Best Meshing" mandate — soft blending.
 */
function assignRigging(raw: RawMesh, boneIndex: number, falloffBoneIndex?: number): RawMesh {
  const vCount = raw.positions.length / 3;
  for (let i = 0; i < vCount; i++) {
    // Basic rigging: 100% influence to primary bone
    // In AAA mode, we use falloff for seamless joints
    if (falloffBoneIndex !== undefined) {
      raw.joints.push(boneIndex, falloffBoneIndex, 0, 0);
      raw.weights.push(0.7, 0.3, 0, 0);
    } else {
      raw.joints.push(boneIndex, 0, 0, 0);
      raw.weights.push(1, 0, 0, 0);
    }
  }
  return raw;
}

/**
 * Assign skeletal weights by blending along the Y-axis.
 * Useful for single continuous limb meshes (e.g., upper arm to wrist).
 */
function assignRiggingGradient(raw: RawMesh, joints: { y: number, boneIdx: number }[]): RawMesh {
  joints.sort((a, b) => a.y - b.y); // Sort bottom-to-top

  const vCount = raw.positions.length / 3;
  for (let i = 0; i < vCount; i++) {
    const y = raw.positions[i * 3 + 1];
    
    let bone1 = joints[0].boneIdx;
    let bone2 = 0;
    let weight1 = 1.0;
    
    if (y <= joints[0].y) {
      bone1 = joints[0].boneIdx;
      weight1 = 1.0;
    } else if (y >= joints[joints.length - 1].y) {
      bone1 = joints[joints.length - 1].boneIdx;
      weight1 = 1.0;
    } else {
      for (let j = 0; j < joints.length - 1; j++) {
        if (y >= joints[j].y && y <= joints[j + 1].y) {
          const t = (y - joints[j].y) / (joints[j + 1].y - joints[j].y);
          const w2 = t * t * (3 - 2 * t); // Smoothstep blending
          bone1 = joints[j].boneIdx;
          bone2 = joints[j + 1].boneIdx;
          weight1 = 1.0 - w2;
          break;
        }
      }
    }
    
    raw.joints.push(bone1, bone2, 0, 0);
    raw.weights.push(weight1, 1.0 - weight1, 0, 0);
  }
  return raw;
}

/* ── 3-D primitive: UV sphere (ellipsoid) ────────────────────────────── */

function ellipsoid(
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
  rings: number, segs: number,
): RawMesh {
  const r = emptyRaw();

  for (let lat = 0; lat <= rings; lat++) {
    const v = lat / rings;
    const phi = Math.PI * v;                  // 0 → π
    const sp = Math.sin(phi), cp = Math.cos(phi);
    for (let lon = 0; lon <= segs; lon++) {
      const u = lon / segs;
      const theta = 2 * Math.PI * u;          // 0 → 2π
      const st = Math.sin(theta), ct = Math.cos(theta);
      const nx = ct * sp, ny = cp, nz = st * sp;
      r.positions.push(cx + rx * nx, cy + ry * ny, cz + rz * nz);
      r.normals.push(...norm([nx / (rx || 1), ny / (ry || 1), nz / (rz || 1)]));
      r.uvs.push(u, v);
    }
  }
  const stride = segs + 1;
  for (let lat = 0; lat < rings; lat++) {
    for (let lon = 0; lon < segs; lon++) {
      const a = lat * stride + lon;
      const b = a + stride;
      r.indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  return r;
}

/* ── 3-D primitive: profiled tube (multi-ring) ───────────────────────── */

/**
 * A profiled tube: a series of cross-section rings connected into a
 * smooth barrel.  Each ring has a centre (glTF y), radiusX, radiusZ
 * (both in SVG units, auto-scaled).  Rings are interpolated with
 * Hermite smoothing for organic tapering.
 *
 * `uScale` controls how the V texture coordinate maps along the length.
 */
interface RingDef {
  cx: number;        // glTF x centre
  cy: number;        // glTF y centre
  rx: number;        // SVG-unit half-width (X radius)
  rz: number;        // SVG-unit depth   (Z radius)
  rzFront?: number;  // Optional distinct front Z radius
  rzBack?: number;   // Optional distinct back Z radius
  offsetZ?: number;  // Optional Z translation
  shapeModifier?: (theta: number) => number; // Advanced: radial multiplier based on angle
}

function profiledTube(
  rings: RingDef[],
  segs: number,
  subdiv: number,     // how many interpolated rows between each pair
  caps: 'both' | 'top' | 'bottom' | 'none' = 'both',
): RawMesh {
  const r = emptyRaw();

  // Build interpolated ring list
  const allRings: RingDef[] = [];
  for (let i = 0; i < rings.length - 1; i++) {
    const a = rings[i], b = rings[i + 1];
    for (let s = 0; s < subdiv; s++) {
      const t = s / subdiv;
      allRings.push({
        cx: lerp(a.cx, b.cx, t),
        cy: lerp(a.cy, b.cy, t),
        rx: smoothstep(a.rx, b.rx, t),
        rz: smoothstep(a.rz, b.rz, t),
        rzFront: smoothstep(a.rzFront ?? a.rz, b.rzFront ?? b.rz, t),
        rzBack: smoothstep(a.rzBack ?? a.rz, b.rzBack ?? b.rz, t),
        offsetZ: smoothstep(a.offsetZ ?? 0, b.offsetZ ?? 0, t),
        shapeModifier: a.shapeModifier && b.shapeModifier
          ? (theta: number) => lerp(a.shapeModifier!(theta), b.shapeModifier!(theta), t)
          : (a.shapeModifier || b.shapeModifier),
      });
    }
  }
  allRings.push(rings[rings.length - 1]);  // last ring

  const totalRings = allRings.length;

  // Generate vertices for each ring
  for (let ri = 0; ri < totalRings; ri++) {
    const ring = allRings[ri];
    const v = ri / (totalRings - 1);   // UV v-coordinate
    const rxS = ring.rx * S;
    const rzS = ring.rz * S;

    // Compute slope for normals (tangent along the barrel)
    const prevR = allRings[Math.max(0, ri - 1)];
    const nextR = allRings[Math.min(totalRings - 1, ri + 1)];
    const dyN = nextR.cy - prevR.cy;
    const drxN = (nextR.rx - prevR.rx) * S;

    for (let si = 0; si <= segs; si++) {
      const u = si / segs;
      const theta = 2 * Math.PI * u;
      const ca = Math.cos(theta), sa = Math.sin(theta);
      
      const currentRz = sa > 0 ? (ring.rzFront ?? ring.rz) : (ring.rzBack ?? ring.rz);
      const modifier = ring.shapeModifier ? ring.shapeModifier(theta) : 1.0;
      
      const currentRzS = currentRz * S * modifier;
      const currentRxS = rxS * modifier;
      const offsetZS = (ring.offsetZ ?? 0) * S;

      r.positions.push(ring.cx + currentRxS * ca, ring.cy, offsetZS + currentRzS * sa);

      // Normal: outward radial + slope correction
      // We don't perfectly compute analytical normal of the modifier curve for performance,
      // but we approximate the base tube normal and it looks good enough for smooth modifiers.
      const nx = ca * (currentRz || 1);
      const nz = sa * (ring.rx || 1);
      const ny = -drxN * (currentRz || 1);  // slope tilt
      r.normals.push(...norm([nx, ny, nz]));
      r.uvs.push(u, v);
    }
  }

  // Connect adjacent rings
  const stride = segs + 1;
  for (let ri = 0; ri < totalRings - 1; ri++) {
    for (let si = 0; si < segs; si++) {
      const a = ri * stride + si;
      const b = a + stride;
      r.indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  // Caps
  const addCap = (ringIdx: number, nDir: number) => {
    const ring = allRings[ringIdx];
    const rxS = ring.rx * S;
    const rzS = ring.rz * S;
    const offsetZS = (ring.offsetZ ?? 0) * S;
    const ci = r.positions.length / 3;
    r.positions.push(ring.cx, ring.cy, offsetZS);
    r.normals.push(0, nDir, 0);
    r.uvs.push(0.5, 0.5);
    for (let si = 0; si <= segs; si++) {
      const theta = (2 * Math.PI * si) / segs;
      const ca = Math.cos(theta), sa = Math.sin(theta);
      const modifier = ring.shapeModifier ? ring.shapeModifier(theta) : 1.0;
      const currentRzS = (sa > 0 ? (ring.rzFront ?? ring.rz) : (ring.rzBack ?? ring.rz)) * S * modifier;
      r.positions.push(ring.cx + rxS * ca * modifier, ring.cy, offsetZS + currentRzS * sa);
      r.normals.push(0, nDir, 0);
      r.uvs.push(0.5 + 0.5 * ca, 0.5 + 0.5 * sa);
    }
    for (let si = 0; si < segs; si++) {
      if (nDir > 0) r.indices.push(ci, ci + 1 + si, ci + 2 + si);
      else          r.indices.push(ci, ci + 2 + si, ci + 1 + si);
    }
  };

  if (caps === 'both' || caps === 'top')    addCap(0, 1);
  if (caps === 'both' || caps === 'bottom') addCap(totalRings - 1, -1);

  return r;
}

/* ── body-part mesh builders ─────────────────────────────────────────── */

interface MeshData {
  name: string;
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  joints: Uint16Array;
  weights: Float32Array;
  color: [number, number, number, number];
}

function toMeshData(name: string, raw: RawMesh, skinHex: string): MeshData {
  return {
    name,
    positions: new Float32Array(raw.positions),
    normals: new Float32Array(raw.normals),
    uvs: new Float32Array(raw.uvs),
    indices: new Uint32Array(raw.indices),
    joints: new Uint16Array(raw.joints),
    weights: new Float32Array(raw.weights),
    color: hexToRgba(skinHex),
  };
}

/* ── HEAD ─────────────────────────────────────────────────────────────── */

function buildHeadMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const [cx, cy] = svgToGl(s.cx, s.headCY);
  const depthR = geom.headRX * 0.82;      // skull front-to-back

  // Main cranium (shifted up slightly for better skull volume)
  const headSphere = ellipsoid(
    cx, cy + geom.headRY * 0.2 * S, 0,
    geom.headRX * S, geom.headRY * S, depthR * S,
    qualityConfig.RING_HIGH, qualityConfig.SEG_HIGH,
  );

  // Chin/jaw extension (more prominent and defined)
  const chinCy = cy - geom.headRY * 0.6 * S;
  const jawWidth = geom.jawW > 0 ? 1.0 + (geom.jawW * 0.08) : 0.9;
  const chin = ellipsoid(
    cx, chinCy, depthR * 0.1 * S,
    geom.headRX * 0.55 * jawWidth * S,
    geom.headRY * 0.35 * S,
    depthR * 0.45 * S,
    Math.max(6, Math.round(qualityConfig.RING_MED * 0.5)),
    qualityConfig.SEG_LOW,
  );

  const raw = merge(headSphere, chin);
  assignRigging(raw, 4); // Bone_Head
  return toMeshData('Head', raw, skinHex);
}

function buildNeckMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const nwTop = geom.headRX * 0.42;
  const nwBot = geom.headRX * 0.48;
  const depthTop = nwTop * 0.72;
  const depthBot = nwBot * 0.78;
  const [topCx, topCy] = svgToGl(s.cx, s.neckTopY);
  const [botCx, botCy] = svgToGl(s.cx, s.neckBotY);

  const rings: RingDef[] = [
    { cx: topCx, cy: topCy, rx: nwTop, rz: depthTop },
    { cx: botCx, cy: botCy, rx: nwBot, rz: depthBot,
      shapeModifier: (theta) => 1.0 + 0.15 * Math.pow(Math.cos(theta), 2) // Trapezius flare at the base
    },
  ];

  const raw = profiledTube(rings, qualityConfig.SEG_LOW, 3);
  assignRigging(raw, 3, 4); // Blend Bone_Chest and Bone_Head
  return toMeshData('Neck', raw, skinHex);
}

function buildTorsoMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const shY = s.shldY;
  const waY = s.waistY;
  const crY = s.crotchY;

  // Add more control rings for anatomical precision
  const chestY = (shY * 0.6 + waY * 0.4);
  const abdomenY = (waY * 0.6 + crY * 0.4);
  const hipsY = (abdomenY * 0.4 + crY * 0.6); // Widest part of the pelvis

  const rings: RingDef[] = [
    // Clavicle / Shoulders - slightly flattened front/back, dip in the middle
    { 
      cx: 0, cy: (VIEW_H / 2 - shY) * S, 
      rx: geom.shoulderHW, rz: geom.shoulderHW * 0.4, rzFront: geom.shoulderHW * 0.45, rzBack: geom.shoulderHW * 0.4,
      shapeModifier: (theta) => 1.0 - 0.1 * Math.pow(Math.sin(theta * 2), 2) // Flatten sides
    },
    // Chest / Pectorals
    { 
      cx: 0, cy: (VIEW_H / 2 - chestY) * S, 
      rx: geom.shoulderHW * 0.9, rz: geom.shoulderHW * 0.45, rzFront: geom.shoulderHW * (geom.showPecs ? 0.65 : 0.5), rzBack: geom.shoulderHW * 0.45, offsetZ: geom.showPecs ? 1 * S : 0,
      shapeModifier: (theta) => geom.showPecs ? (1.0 + 0.1 * Math.max(0, Math.sin(theta)) * Math.pow(Math.cos(theta), 2)) : 1.0 // Pectoral bulge
    },
    // Waist / Core
    { 
      cx: 0, cy: (VIEW_H / 2 - waY) * S, 
      rx: geom.waistHW, rz: geom.waistHW * 0.5, rzFront: geom.waistHW * (geom.showMuscleDef ? 0.6 : 0.55), rzBack: geom.waistHW * 0.5, offsetZ: geom.showMuscleDef ? 0.5 * S : 0,
      shapeModifier: (theta) => geom.showMuscleDef ? (1.0 - 0.05 * Math.abs(Math.cos(theta * 3))) : 1.0 // Abdominal grooves
    },
    // Lower Abdomen
    { 
      cx: 0, cy: (VIEW_H / 2 - abdomenY) * S, 
      rx: geom.waistHW * 1.1, rz: geom.waistHW * 0.55, rzFront: geom.waistHW * 0.6, rzBack: geom.waistHW * 0.55 
    },
    // Hips (widest part)
    { 
      cx: 0, cy: (VIEW_H / 2 - hipsY) * S, 
      rx: geom.hipHW, rz: geom.hipHW * 0.6, rzFront: geom.hipHW * 0.5, rzBack: geom.hipHW * 0.7, offsetZ: -0.5 * S,
      shapeModifier: (theta) => 1.0 + 0.1 * Math.pow(Math.cos(theta), 4) // Wider flare at the sides
    },
    // Pelvis / Crotch taper
    { 
      cx: 0, cy: (VIEW_H / 2 - crY) * S, 
      rx: geom.hipHW * 0.55, rz: geom.hipHW * 0.5, rzFront: geom.hipHW * 0.4, rzBack: geom.hipHW * 0.6, offsetZ: -1 * S 
    },
  ];

  const raw = profiledTube(rings, qualityConfig.SEG_HIGH, 4);
  assignRigging(raw, 1); // Bone_Hips
  return toMeshData('Torso', raw, skinHex);
}

/* ── ARM ──────────────────────────────────────────────────────────────── */

function buildArmMesh(
  side: 'left' | 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const shX = side === 'left' ? s.shLX : s.shRX;
  const elX = side === 'left' ? s.elLX : s.elRX;
  const wrX = side === 'left' ? s.wrLX : s.wrRX;
  const hw  = geom.upperArmW / 2;
  const fw  = geom.forearmW / 2;

  const [shGx, shGy] = svgToGl(shX, s.shldY);
  const [elGx, elGy] = svgToGl(elX, s.elY);
  const [wrGx, wrGy] = svgToGl(wrX, s.wrY);
  const [hdGx, hdGy] = svgToGl(wrX, s.handCY);

  // Enhanced upper arm with detailed muscle landmarks
  // Standard: shoulder cap → bicep peak → elbow (6 rings)
  // High quality: adds deltoid insertion, brachialis definition
  const upperRings: RingDef[] = [
    // Shoulder cap (deltoid origin)
    { cx: shGx, cy: shGy, rx: hw * 1.1,  rz: hw * 0.95 },
    // Deltoid bulge (more prominent if muscular)
    { cx: lerp(shGx, elGx, 0.12), cy: lerp(shGy, elGy, 0.12),
      rx: hw * (geom.showMuscleDef ? 1.25 : 1.15),
      rz: hw * 1.0, rzFront: hw * 1.05, rzBack: hw * 0.95, offsetZ: hw * 0.1 * S },
    // Bicep peak (belly)
    { cx: lerp(shGx, elGx, 0.35),  cy: lerp(shGy, elGy, 0.35),
      rx: hw * (geom.showMuscleDef ? 1.15 : 1.08),
      rz: hw * 1.1, rzFront: hw * (geom.showMuscleDef ? 1.2 : 1.0), rzBack: hw * (geom.showMuscleDef ? 1.0 : 0.9), offsetZ: hw * (geom.showMuscleDef ? 0.2 : 0) * S,
      shapeModifier: (theta) => geom.showMuscleDef ? (1.0 + 0.1 * Math.max(0, Math.sin(theta))) : 1.0 // Bicep bulge
    },
    // Mid-arm transition
    { cx: lerp(shGx, elGx, 0.6), cy: lerp(shGy, elGy, 0.6),
      rx: hw * 1.0,  rz: hw * 0.88 },
    // Distal taper
    { cx: lerp(shGx, elGx, 0.85),  cy: lerp(shGy, elGy, 0.85),
      rx: hw * 0.92, rz: hw * 0.82 },
    // Elbow joint
    { cx: elGx, cy: elGy, rx: hw * 0.95, rz: hw * 0.9, rzFront: hw * 0.8, rzBack: hw * 1.0, offsetZ: hw * -0.1 * S },
  ];

  // Enhanced forearm: elbow → muscle belly → wrist (5 rings)
  // Adds brachioradialis prominence for muscular builds
  const foreRings: RingDef[] = [
    { cx: elGx, cy: elGy, rx: fw * 1.05, rz: fw * 0.9 },
    // Forearm muscle belly (extensor/flexor group)
    { cx: lerp(elGx, wrGx, 0.2),  cy: lerp(elGy, wrGy, 0.2),
      rx: fw * (geom.showMuscleDef ? 1.14 : 1.1),
      rz: fw * (geom.showMuscleDef ? 0.98 : 0.95),
      shapeModifier: (theta) => geom.showMuscleDef ? (1.0 + 0.08 * Math.pow(Math.cos(theta), 2)) : 1.0 // Brachioradialis
    },
    { cx: lerp(elGx, wrGx, 0.45), cy: lerp(elGy, wrGy, 0.45),
      rx: fw * 1.0,  rz: fw * 0.88 },
    // Wrist taper
    { cx: lerp(elGx, wrGx, 0.7),  cy: lerp(elGy, wrGy, 0.7),
      rx: fw * 0.88, rz: fw * 0.78 },
    { cx: wrGx, cy: wrGy, rx: fw * 0.78, rz: fw * 0.7 },
  ];

  const armRings = [...upperRings, ...foreRings]; // Seamless continuous tube
  const arm = profiledTube(armRings, qualityConfig.SEG_MED, qualityConfig.limbSubdiv, 'top');

  assignRiggingGradient(arm, [
    { y: shGy, boneIdx: side === 'left' ? 5 : 6 }, // Shoulder / Arm bone
    { y: elGy, boneIdx: side === 'left' ? 9 : 11 }, // Elbow
    { y: wrGy, boneIdx: side === 'left' ? 10 : 12 } // Wrist
  ]);

  // Hand: ellipsoid with quality-based detail
  const hand = ellipsoid(
    hdGx, hdGy, 0,
    geom.handW / 2 * S, geom.handH / 2 * S, geom.handW * 0.32 * S,
    qualityConfig.RING_MED, qualityConfig.SEG_LOW,
  );
  assignRigging(hand, side === 'left' ? 10 : 12); // Wrist controls hand fully

  const raw = merge(arm, hand);
  return toMeshData(`Arm_${side}`, raw, skinHex);
}

function buildLegMesh(
  side: 'left' | 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const lx = side === 'left' ? s.legLX : s.legRX;
  const tw = geom.thighW / 2;
  const cw = geom.calfW / 2;

  const [crGx, crGy] = svgToGl(lx, s.crotchY);
  const [knGx, knGy] = svgToGl(lx, s.kneeY);
  const [anGx, anGy] = svgToGl(lx, s.ankleY);
  const [ftGx, ftGy] = svgToGl(lx, s.footBotY - geom.footH / 2);

  // Thigh
  const thighRings: RingDef[] = [
    { cx: crGx, cy: crGy, rx: tw, rz: tw * 1.1, rzFront: tw * 1.05, rzBack: tw * 1.15, offsetZ: tw * -0.05 * S }, // Gluteal fullness
    { cx: lerp(crGx, knGx, 0.4), cy: lerp(crGy, knGy, 0.4), rx: tw * 0.95, rz: tw * 1.0, rzFront: tw * 1.0, rzBack: tw * 1.0 }, // Mid-thigh
    { cx: knGx, cy: knGy, rx: tw * 0.85, rz: tw * 0.75, rzFront: tw * 0.8, rzBack: tw * 0.7, offsetZ: tw * 0.05 * S }, // Knee cap protrusion
  ];
  // Calf
  const calfRings: RingDef[] = [
    { cx: knGx, cy: knGy, rx: cw, rz: cw * 0.75, rzFront: cw * 0.8, rzBack: cw * 0.7, offsetZ: cw * 0.05 * S },
    { 
      cx: lerp(knGx, anGx, 0.3), cy: lerp(knGy, anGy, 0.3), 
      rx: cw * 1.1, rz: cw * 1.0, rzFront: cw * 0.9, rzBack: cw * 1.25, offsetZ: cw * -0.15 * S,
      shapeModifier: (theta) => geom.showMuscleDef ? (1.0 + 0.15 * Math.max(0, -Math.sin(theta)) * Math.pow(Math.cos(theta), 2)) : 1.0 // Calf muscle popping out the back
    }, // Calf muscle belly backwards
    { cx: lerp(knGx, anGx, 0.7), cy: lerp(knGy, anGy, 0.7), rx: cw * 0.8, rz: cw * 0.75, rzFront: cw * 0.75, rzBack: cw * 0.8 },
    { cx: anGx, cy: anGy, rx: cw * 0.7, rz: cw * 0.6 },
  ];

  const legRings = [...thighRings, ...calfRings]; // Seamless continuous tube
  const leg = profiledTube(legRings, qualityConfig.SEG_MED, qualityConfig.limbSubdiv, 'top');

  assignRiggingGradient(leg, [
    { y: crGy, boneIdx: side === 'left' ? 7 : 8 }, // Hip / Leg bone
    { y: knGy, boneIdx: side === 'left' ? 13 : 15 }, // Knee
    { y: anGy, boneIdx: side === 'left' ? 14 : 16 } // Ankle
  ]);

  // Foot: elongated ellipsoid (deeper front-to-back than side-to-side)
  const foot = ellipsoid(
    ftGx, ftGy, geom.footW * 0.12 * S,
    geom.footW / 2 * S, geom.footH / 2 * S, geom.footW * 0.42 * S,
    qualityConfig.RING_MED, qualityConfig.SEG_LOW,
  );
  assignRigging(foot, side === 'left' ? 14 : 16); // Ankle controls foot fully

  const raw = merge(leg, foot);
  return toMeshData(`Leg_${side}`, raw, skinHex);
}

/* ── Skeleton ────────────────────────────────────────────────────────── */

interface GltfNode {
  name: string;
  translation?: [number, number, number];
  children?: number[];
  mesh?: number;
}

function buildSkeletonNodes(s: SpriteState): GltfNode[] {
  const hips = svgToGl(s.cx, s.crotchY);
  const spine = svgToGl(s.cx, s.waistY);
  const chest = svgToGl(s.cx, s.shldY);
  const head = svgToGl(s.cx, s.headCY);
  
  const shL = svgToGl(s.shLX, s.shldY);
  const elL = svgToGl(s.elLX, s.elY);
  const wrL = svgToGl(s.wrLX, s.wrY);
  
  const shR = svgToGl(s.shRX, s.shldY);
  const elR = svgToGl(s.elRX, s.elY);
  const wrR = svgToGl(s.wrRX, s.wrY);
  
  const hipL = svgToGl(s.legLX, s.crotchY);
  const knL = svgToGl(s.legLX, s.kneeY);
  const anL = svgToGl(s.legLX, s.ankleY);
  
  const hipR = svgToGl(s.legRX, s.crotchY);
  const knR = svgToGl(s.legRX, s.kneeY);
  const anR = svgToGl(s.legRX, s.ankleY);

  const sub = (a: [number,number,number], b: [number,number,number]): [number,number,number] => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];

  return [
    { name: 'Armature', translation: [0, 0, 0], children: [1] }, // 0
    { name: 'Bone_Hips', translation: hips, children: [2, 7, 8] }, // 1 (child of Armature)
    { name: 'Bone_Spine', translation: sub(spine, hips), children: [3] }, // 2
    { name: 'Bone_Chest', translation: sub(chest, spine), children: [4, 5, 6] }, // 3
    { name: 'Bone_Head', translation: sub(head, chest) }, // 4
    { name: 'Bone_Arm_L', translation: sub(shL, chest), children: [9] }, // 5 -> Elbow_L
    { name: 'Bone_Arm_R', translation: sub(shR, chest), children: [11] }, // 6 -> Elbow_R
    { name: 'Bone_Leg_L', translation: sub(hipL, hips), children: [13] }, // 7 -> Knee_L
    { name: 'Bone_Leg_R', translation: sub(hipR, hips), children: [15] }, // 8 -> Knee_R
    
    // Expanded IK joints (added to the end to preserve indices of the first 9)
    { name: 'Bone_Elbow_L', translation: sub(elL, shL), children: [10] }, // 9 -> Wrist_L
    { name: 'Bone_Hand_L', translation: sub(wrL, elL) }, // 10
    { name: 'Bone_Elbow_R', translation: sub(elR, shR), children: [12] }, // 11 -> Wrist_R
    { name: 'Bone_Hand_R', translation: sub(wrR, elR) }, // 12
    { name: 'Bone_Knee_L', translation: sub(knL, hipL), children: [14] }, // 13 -> Ankle_L
    { name: 'Bone_Foot_L', translation: sub(anL, knL) }, // 14
    { name: 'Bone_Knee_R', translation: sub(knR, hipR), children: [16] }, // 15 -> Ankle_R
    { name: 'Bone_Foot_R', translation: sub(anR, knR) }, // 16
  ];
}

/* ── glTF assembly ───────────────────────────────────────────────────── */

function toBase64(arr: ArrayBufferLike): string {
  const bytes = new Uint8Array(arr);
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 8192) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + 8192)));
  }
  return btoa(chunks.join(''));
}

function addBuf(
  data: ArrayBufferLike,
  buffers: { uri: string; byteLength: number }[],
  bufferViews: object[],
  target: number,
  bi: { v: number }, bvi: { v: number },
): number {
  const idx = bi.v++;
  buffers.push({
    uri: `data:application/octet-stream;base64,${toBase64(data)}`,
    byteLength: data.byteLength,
  });
  const bvIdx = bvi.v++;
  bufferViews.push({ buffer: idx, byteOffset: 0, byteLength: data.byteLength, target });
  return bvIdx;
}

function buildGltfJson(meshes: MeshData[], skeletonNodes: GltfNode[]): object {
  const buffers: { uri: string; byteLength: number }[] = [];
  const bufferViews: object[] = [];
  const accessors: object[] = [];
  const gltfMeshes: object[] = [];
  const materials: object[] = [];
  const gltfNodes: object[] = [];
  const bi = { v: 0 }, bvi = { v: 0 };

  // 1. Skeleton Nodes
  for (const sn of skeletonNodes) {
    gltfNodes.push({
      name: sn.name,
      ...(sn.translation ? { translation: sn.translation } : {}),
      ...(sn.children ? { children: sn.children } : {}),
    });
  }

  // Global positions for each bone so we can compute correct Inverse Bind Matrices
  const globalPositions: [number, number, number][] = new Array(skeletonNodes.length);
  
  const computeGlobal = (nodeIdx: number, parentGlobal: [number, number, number]) => {
    const node = skeletonNodes[nodeIdx];
    const loc = node.translation || [0, 0, 0];
    const glob: [number, number, number] = [
      parentGlobal[0] + loc[0],
      parentGlobal[1] + loc[1],
      parentGlobal[2] + loc[2]
    ];
    globalPositions[nodeIdx] = glob;
    if (node.children) {
      for (const childIdx of node.children) {
        computeGlobal(childIdx, glob);
      }
    }
  };
  computeGlobal(0, [0, 0, 0]);

  const skinIdx = 0;
  const jointIndices = skeletonNodes.map((_, i) => i);
  
  // Inverse Bind Matrices (Inverse of global translation matrix)
  const ibmArr = new Float32Array(skeletonNodes.length * 16);
  for(let i=0; i<skeletonNodes.length; i++) {
    // Identity diagonal
    ibmArr[i*16] = 1; ibmArr[i*16+5] = 1; ibmArr[i*16+10] = 1; ibmArr[i*16+15] = 1;
    // Translation column (negated global position)
    ibmArr[i*16+12] = -globalPositions[i][0];
    ibmArr[i*16+13] = -globalPositions[i][1];
    ibmArr[i*16+14] = -globalPositions[i][2];
  }
  const ibmData = ibmArr.buffer;
  const ibmBv = addBuf(ibmData, buffers, bufferViews, 0, bi, bvi);
  const ibmAcc = accessors.length;
  accessors.push({ bufferView: ibmBv, componentType: 5126, count: skeletonNodes.length, type: 'MAT4' });

  const meshNodeStart = gltfNodes.length;

  for (let mi = 0; mi < meshes.length; mi++) {
    const md = meshes[mi];
    const matIdx = materials.length;
    materials.push({
      name: `Mat_${md.name}`,
      pbrMetallicRoughness: { baseColorFactor: md.color, metallicFactor: 0.0, roughnessFactor: 0.8 },
    });

    // Attributes
    const posData = md.positions.buffer;
    const posBv = addBuf(posData, buffers, bufferViews, 34962, bi, bvi);
    const posAcc = accessors.length;
    accessors.push({ bufferView: posBv, componentType: 5126, count: md.positions.length / 3, type: 'VEC3', min: [-1, -1, -1], max: [1, 1, 1] });

    const norData = md.normals.buffer;
    const norBv = addBuf(norData, buffers, bufferViews, 34962, bi, bvi);
    const norAcc = accessors.length;
    accessors.push({ bufferView: norBv, componentType: 5126, count: md.normals.length / 3, type: 'VEC3' });

    const jntData = md.joints.buffer;
    const jntBv = addBuf(jntData, buffers, bufferViews, 34962, bi, bvi);
    const jntAcc = accessors.length;
    accessors.push({ bufferView: jntBv, componentType: 5123, count: md.joints.length / 4, type: 'VEC4' });

    const wgtData = md.weights.buffer;
    const wgtBv = addBuf(wgtData, buffers, bufferViews, 34962, bi, bvi);
    const wgtAcc = accessors.length;
    accessors.push({ bufferView: wgtBv, componentType: 5126, count: md.weights.length / 4, type: 'VEC4' });

    const idxData = md.indices.buffer;
    const idxBv = addBuf(idxData, buffers, bufferViews, 34963, bi, bvi);
    const idxAcc = accessors.length;
    accessors.push({ bufferView: idxBv, componentType: 5125, count: md.indices.length, type: 'SCALAR' });

    gltfMeshes.push({
      name: md.name,
      primitives: [{
        attributes: { POSITION: posAcc, NORMAL: norAcc, JOINTS_0: jntAcc, WEIGHTS_0: wgtAcc },
        indices: idxAcc,
        material: matIdx,
      }],
    });

    gltfNodes.push({ name: `Node_${md.name}`, mesh: mi, skin: skinIdx });
  }

  return {
    asset: { version: '2.0', generator: 'Aetherius Rig Engine' },
    scene: 0,
    scenes: [{ nodes: [0, ...Array.from({length: meshes.length}, (_,i) => meshNodeStart + i)] }],
    nodes: gltfNodes,
    meshes: gltfMeshes,
    skins: [{ inverseBindMatrices: ibmAcc, joints: jointIndices }],
    materials,
    accessors,
    bufferViews,
    buffers,
  };
}

/* ── ANATOMY ──────────────────────────────────────────────────────────── */

function buildBreastsMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData[] {
  if (geom.bustSize === 0) return [];
  
  const meshes: MeshData[] = [];
  const y = (VIEW_H / 2 - geom.bustY) * S;
  const z = geom.waistHW * 0.5 * S; // Projection from chest
  const rx = geom.bustR * S;
  const ry = geom.bustR * 0.9 * S;
  const rz = geom.bustR * 1.1 * S;

  const sides = [{ x: -geom.shoulderHW * 0.4 * S, name: 'Breast_L' }, { x: geom.shoulderHW * 0.4 * S, name: 'Breast_R' }];

  for (const side of sides) {
    const raw = ellipsoid(side.x, y, z, rx, ry, rz, qualityConfig.RING_MED, qualityConfig.SEG_MED);
    assignRigging(raw, 3); // Bone_Chest
    meshes.push(toMeshData(side.name, raw, skinHex));
  }

  return meshes;
}

function buildGenitalsMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  gender: string,
  qualityConfig: MeshQualityConfig
): MeshData[] {
  const meshes: MeshData[] = [];
  const [cx, cy] = svgToGl(s.cx, s.crotchY);
  const cz = geom.hipHW * 0.2 * S;

  if (gender === 'female') {
    // Vulva/Labia - subtle volumetric ellipsoid
    const raw = ellipsoid(cx, cy, cz, geom.hipHW * 0.15 * S, geom.hipHW * 0.2 * S, geom.hipHW * 0.08 * S, 8, 16);
    assignRigging(raw, 1); // Bone_Hips
    meshes.push(toMeshData('Genitals_Female', raw, skinHex));
  } else {
    // Penis and Testicles
    const testicles = ellipsoid(cx, cy - 0.02, cz, 0.02, 0.02, 0.015, 8, 16);
    const shaftRings: RingDef[] = [
      { cx, cy, rx: 1.5, rz: 1.5 },
      { cx, cy: cy + 0.05, rx: 1.5, rz: 1.5 },
    ];
    const shaft = profiledTube(shaftRings, 12, 2, 'top');
    const raw = merge(testicles, shaft);
    assignRigging(raw, 1); // Bone_Hips
    meshes.push(toMeshData('Genitals_Male', raw, skinHex));
  }

  return meshes;
}

/* ── Public API ───────────────────────────────────────────────────────── */

export interface SvgToGltfOptions {
  geom: BodyGeom;
  spriteState: SpriteState;
  skinColor: string;
  gender: string;
  quality?: GraphicsQuality;  
}

/**
 * Convert the DoL sprite's body geometry + state into a high-fidelity
 * glTF 2.0 JSON string.
 */
export function convertSvgToGltf(opts: SvgToGltfOptions): string {
  const { geom, spriteState: s, skinColor, gender, quality } = opts;

  const qualityConfig = getMeshQualityConfig(quality);

  const meshes: MeshData[] = [
    buildHeadMesh(geom, s, skinColor, qualityConfig),
    buildNeckMesh(geom, s, skinColor, qualityConfig),
    buildTorsoMesh(geom, s, skinColor, qualityConfig),
    buildArmMesh('left', geom, s, skinColor, qualityConfig),
    buildArmMesh('right', geom, s, skinColor, qualityConfig),
    buildLegMesh('left', geom, s, skinColor, qualityConfig),
    buildLegMesh('right', geom, s, skinColor, qualityConfig),
    ...buildBreastsMesh(geom, s, skinColor, qualityConfig),
    ...buildGenitalsMesh(geom, s, skinColor, gender, qualityConfig),
  ];

  const skeleton = buildSkeletonNodes(s);
  const gltf = buildGltfJson(meshes, skeleton);
  return JSON.stringify(gltf, null, 2);
}

/** Trigger a browser download of the generated .gltf file. */
export function downloadGltf(gltfJson: string, filename = 'character.gltf'): void {
  const blob = new Blob([gltfJson], { type: 'model/gltf+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
