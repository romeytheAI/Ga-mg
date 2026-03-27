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

import { BodyGeom, SpriteState } from '../components/dol/sprite/utils';

/* ── constants ───────────────────────────────────────────────────────── */

const VIEW_W = 100;
const VIEW_H = 225;
const S = 1 / VIEW_H;  // SVG unit → glTF unit

// Radial segment counts
const SEG_HIGH  = 32;   // head, torso
const SEG_MED   = 24;   // limbs
const SEG_LOW   = 16;   // hands, feet, neck

// Latitude rings for ellipsoids
const RING_HIGH = 24;   // head
const RING_MED  = 12;   // hands, feet

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

/** Hermite interpolation between a and b at t ∈ [0,1]. */
function smoothstep(a: number, b: number, t: number): number {
  const u = t * t * (3 - 2 * t);  // smooth hermite
  return a + (b - a) * u;
}

/** Linear interpolation. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ── raw mesh type ───────────────────────────────────────────────────── */

interface RawMesh {
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

function emptyRaw(): RawMesh {
  return { positions: [], normals: [], uvs: [], indices: [] };
}

/** Merge multiple RawMesh into one, reindexing. */
function merge(...meshes: RawMesh[]): RawMesh {
  const r = emptyRaw();
  for (const m of meshes) {
    const off = r.positions.length / 3;
    r.positions.push(...m.positions);
    r.normals.push(...m.normals);
    r.uvs.push(...m.uvs);
    for (const i of m.indices) r.indices.push(i + off);
  }
  return r;
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

      r.positions.push(ring.cx + rxS * ca, ring.cy, rzS * sa);

      // Normal: outward radial + slope correction
      const nx = ca * (ring.rz || 1);
      const nz = sa * (ring.rx || 1);
      const ny = -drxN * (ring.rz || 1);  // slope tilt
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
    const ci = r.positions.length / 3;
    r.positions.push(ring.cx, ring.cy, 0);
    r.normals.push(0, nDir, 0);
    r.uvs.push(0.5, 0.5);
    for (let si = 0; si <= segs; si++) {
      const theta = (2 * Math.PI * si) / segs;
      r.positions.push(ring.cx + rxS * Math.cos(theta), ring.cy, rzS * Math.sin(theta));
      r.normals.push(0, nDir, 0);
      r.uvs.push(0.5 + 0.5 * Math.cos(theta), 0.5 + 0.5 * Math.sin(theta));
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
  color: [number, number, number, number];
}

function toMeshData(name: string, raw: RawMesh, skinHex: string): MeshData {
  return {
    name,
    positions: new Float32Array(raw.positions),
    normals: new Float32Array(raw.normals),
    uvs: new Float32Array(raw.uvs),
    indices: new Uint32Array(raw.indices),
    color: hexToRgba(skinHex),
  };
}

/* ── HEAD ─────────────────────────────────────────────────────────────── */

function buildHeadMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  const [cx, cy] = svgToGl(s.cx, s.headCY);
  const depthR = geom.headRX * 0.82;      // skull front-to-back
  const headSphere = ellipsoid(
    cx, cy, 0,
    geom.headRX * S, geom.headRY * S, depthR * S,
    RING_HIGH, SEG_HIGH,
  );

  // Chin extension: a small ellipsoid fused at the bottom
  const chinCy = cy - geom.headRY * 0.92 * S;
  const chin = ellipsoid(
    cx, chinCy, 0,
    geom.headRX * 0.55 * S, geom.headRY * 0.18 * S, depthR * 0.5 * S,
    6, SEG_LOW,
  );

  return toMeshData('Head', merge(headSphere, chin), skinHex);
}

/* ── NECK ─────────────────────────────────────────────────────────────── */

function buildNeckMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  const nwTop = geom.headRX * 0.42;
  const nwBot = geom.headRX * 0.48;
  const depthTop = nwTop * 0.72;
  const depthBot = nwBot * 0.78;
  const [topCx, topCy] = svgToGl(s.cx, s.neckTopY);
  const [botCx, botCy] = svgToGl(s.cx, s.neckBotY);

  const rings: RingDef[] = [
    { cx: topCx, cy: topCy, rx: nwTop, rz: depthTop },
    { cx: lerp(topCx, botCx, 0.3), cy: lerp(topCy, botCy, 0.3), rx: lerp(nwTop, nwBot, 0.25), rz: lerp(depthTop, depthBot, 0.25) },
    { cx: lerp(topCx, botCx, 0.6), cy: lerp(topCy, botCy, 0.6), rx: lerp(nwTop, nwBot, 0.55), rz: lerp(depthTop, depthBot, 0.55) },
    { cx: botCx, cy: botCy, rx: nwBot, rz: depthBot },
  ];

  return toMeshData('Neck', profiledTube(rings, SEG_LOW, 3), skinHex);
}

/* ── TORSO ────────────────────────────────────────────────────────────── */

function buildTorsoMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  // 10 anatomical cross-sections matching the SVG bezier silhouette
  // shoulder → upper chest → mid chest → lower chest → waist → upper hip → hip → lower hip → upper crotch → crotch
  const shY = s.shldY;
  const waY = s.waistY;
  const hiY = s.hipTopY;
  const crY = s.crotchY;

  const rings: RingDef[] = [
    // Shoulder line
    { cx: 0, cy: (VIEW_H / 2 - shY) * S, rx: geom.shoulderHW, rz: geom.shoulderHW * 0.48 },
    // Upper chest (slight inward taper from shoulders)
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.12)) * S, rx: geom.shoulderHW * 0.96, rz: geom.shoulderHW * 0.47 },
    // Mid chest (pec area)
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.25)) * S, rx: geom.shoulderHW * 0.92, rz: geom.shoulderHW * 0.46 },
    // Lower chest (ribcage)
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.45)) * S, rx: lerp(geom.shoulderHW, geom.waistHW, 0.3) * 0.95, rz: lerp(geom.shoulderHW * 0.46, geom.waistHW * 0.52, 0.3) },
    // Upper waist
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.7)) * S, rx: lerp(geom.shoulderHW, geom.waistHW, 0.65), rz: lerp(geom.shoulderHW * 0.45, geom.waistHW * 0.54, 0.65) },
    // Waist (narrowest point)
    { cx: 0, cy: (VIEW_H / 2 - waY) * S, rx: geom.waistHW, rz: geom.waistHW * 0.55 },
    // Upper hip (flare out)
    { cx: 0, cy: (VIEW_H / 2 - lerp(waY, hiY, 0.4)) * S, rx: lerp(geom.waistHW, geom.hipHW, 0.35), rz: lerp(geom.waistHW * 0.55, geom.hipHW * 0.44, 0.35) },
    // Hip crest (widest point)
    { cx: 0, cy: (VIEW_H / 2 - hiY) * S, rx: geom.hipHW, rz: geom.hipHW * 0.44 },
    // Lower hip → crotch transition
    { cx: 0, cy: (VIEW_H / 2 - lerp(hiY, crY, 0.4)) * S, rx: lerp(geom.hipHW, geom.hipHW * 0.55, 0.4), rz: lerp(geom.hipHW * 0.44, geom.hipHW * 0.38, 0.4) },
    // Crotch
    { cx: 0, cy: (VIEW_H / 2 - crY) * S, rx: geom.hipHW * 0.55, rz: geom.hipHW * 0.36 },
  ];

  return toMeshData('Torso', profiledTube(rings, SEG_HIGH, 4), skinHex);
}

/* ── ARM ──────────────────────────────────────────────────────────────── */

function buildArmMesh(
  side: 'left' | 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
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

  // Upper arm: shoulder → deltoid → bicep peak → mid → elbow
  const upperRings: RingDef[] = [
    { cx: shGx, cy: shGy, rx: hw * 1.1,  rz: hw * 0.95 },  // shoulder cap
    { cx: lerp(shGx, elGx, 0.12), cy: lerp(shGy, elGy, 0.12), rx: hw * 1.15, rz: hw * 0.98 },  // deltoid
    { cx: lerp(shGx, elGx, 0.3),  cy: lerp(shGy, elGy, 0.3),  rx: hw * 1.08, rz: hw * 0.92 },  // bicep
    { cx: lerp(shGx, elGx, 0.55), cy: lerp(shGy, elGy, 0.55), rx: hw * 1.0,  rz: hw * 0.88 },  // mid
    { cx: lerp(shGx, elGx, 0.8),  cy: lerp(shGy, elGy, 0.8),  rx: hw * 0.92, rz: hw * 0.82 },  // taper to elbow
    { cx: elGx, cy: elGy, rx: hw * 0.9,  rz: hw * 0.78 },   // elbow
  ];

  // Forearm: elbow → belly → taper → wrist
  const foreRings: RingDef[] = [
    { cx: elGx, cy: elGy, rx: fw * 1.05, rz: fw * 0.9 },
    { cx: lerp(elGx, wrGx, 0.2),  cy: lerp(elGy, wrGy, 0.2),  rx: fw * 1.1,  rz: fw * 0.95 },  // forearm belly
    { cx: lerp(elGx, wrGx, 0.45), cy: lerp(elGy, wrGy, 0.45), rx: fw * 1.0,  rz: fw * 0.88 },
    { cx: lerp(elGx, wrGx, 0.7),  cy: lerp(elGy, wrGy, 0.7),  rx: fw * 0.88, rz: fw * 0.78 },  // taper
    { cx: wrGx, cy: wrGy, rx: fw * 0.78, rz: fw * 0.7 },   // wrist
  ];

  const upper = profiledTube(upperRings, SEG_MED, 3, 'top');
  const fore  = profiledTube(foreRings, SEG_MED, 3, 'none');

  // Hand: high-res ellipsoid
  const hand = ellipsoid(
    hdGx, hdGy, 0,
    geom.handW / 2 * S, geom.handH / 2 * S, geom.handW * 0.32 * S,
    RING_MED, SEG_LOW,
  );

  return toMeshData(`Arm_${side}`, merge(upper, fore, hand), skinHex);
}

/* ── LEG ──────────────────────────────────────────────────────────────── */

function buildLegMesh(
  side: 'left' | 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
): MeshData {
  const lx = side === 'left' ? s.legLX : s.legRX;
  const tw = geom.thighW / 2;
  const cw = geom.calfW / 2;

  const [crGx, crGy] = svgToGl(lx, s.crotchY);
  const [knGx, knGy] = svgToGl(lx, s.kneeY);
  const [anGx, anGy] = svgToGl(lx, s.ankleY);
  const [ftGx, ftGy] = svgToGl(lx, s.footBotY - geom.footH / 2);

  // Thigh: hip joint → upper → mid → taper → knee
  const thighRings: RingDef[] = [
    { cx: crGx, cy: crGy, rx: tw * 1.08, rz: tw * 0.88 },     // hip joint
    { cx: lerp(crGx, knGx, 0.1),  cy: lerp(crGy, knGy, 0.1),  rx: tw * 1.12, rz: tw * 0.92 },   // upper thigh (widest)
    { cx: lerp(crGx, knGx, 0.25), cy: lerp(crGy, knGy, 0.25), rx: tw * 1.08, rz: tw * 0.9 },
    { cx: lerp(crGx, knGx, 0.45), cy: lerp(crGy, knGy, 0.45), rx: tw * 1.0,  rz: tw * 0.85 },   // mid thigh
    { cx: lerp(crGx, knGx, 0.65), cy: lerp(crGy, knGy, 0.65), rx: tw * 0.92, rz: tw * 0.8 },    // taper
    { cx: lerp(crGx, knGx, 0.85), cy: lerp(crGy, knGy, 0.85), rx: tw * 0.86, rz: tw * 0.76 },
    { cx: knGx, cy: knGy, rx: tw * 0.84, rz: tw * 0.74 },      // knee
  ];

  // Calf: knee → calf belly → taper → ankle
  const calfRings: RingDef[] = [
    { cx: knGx, cy: knGy, rx: cw * 1.0,  rz: cw * 0.85 },
    { cx: lerp(knGx, anGx, 0.12), cy: lerp(knGy, anGy, 0.12), rx: cw * 1.08, rz: cw * 0.92 },   // calf belly
    { cx: lerp(knGx, anGx, 0.28), cy: lerp(knGy, anGy, 0.28), rx: cw * 1.12, rz: cw * 0.95 },   // peak
    { cx: lerp(knGx, anGx, 0.5),  cy: lerp(knGy, anGy, 0.5),  rx: cw * 1.0,  rz: cw * 0.86 },
    { cx: lerp(knGx, anGx, 0.7),  cy: lerp(knGy, anGy, 0.7),  rx: cw * 0.85, rz: cw * 0.74 },
    { cx: lerp(knGx, anGx, 0.9),  cy: lerp(knGy, anGy, 0.9),  rx: cw * 0.72, rz: cw * 0.64 },
    { cx: anGx, cy: anGy, rx: cw * 0.65, rz: cw * 0.58 },     // ankle
  ];

  const thigh = profiledTube(thighRings, SEG_MED, 3, 'top');
  const calf  = profiledTube(calfRings, SEG_MED, 3, 'none');

  // Foot: elongated ellipsoid (front-to-back deeper than side-to-side)
  const foot = ellipsoid(
    ftGx, ftGy, geom.footW * 0.12 * S,
    geom.footW / 2 * S, geom.footH / 2 * S, geom.footW * 0.42 * S,
    RING_MED, SEG_LOW,
  );

  return toMeshData(`Leg_${side}`, merge(thigh, calf, foot), skinHex);
}

/* ── Skeleton ────────────────────────────────────────────────────────── */

interface GltfNode {
  name: string;
  translation?: [number, number, number];
  children?: number[];
  mesh?: number;
}

function buildSkeletonNodes(s: SpriteState): GltfNode[] {
  return [
    { name: 'Armature', translation: [0, 0, 0], children: [1] },
    { name: 'Bone_Hips', translation: svgToGl(s.cx, s.crotchY), children: [2, 7, 8] },
    { name: 'Bone_Spine', translation: svgToGl(s.cx, s.waistY), children: [3] },
    { name: 'Bone_Chest', translation: svgToGl(s.cx, s.shldY), children: [4, 5, 6] },
    { name: 'Bone_Head', translation: svgToGl(s.cx, s.headCY) },
    { name: 'Bone_Arm_L', translation: svgToGl(s.shLX, s.shldY) },
    { name: 'Bone_Arm_R', translation: svgToGl(s.shRX, s.shldY) },
    { name: 'Bone_Leg_L', translation: svgToGl(s.legLX, s.crotchY) },
    { name: 'Bone_Leg_R', translation: svgToGl(s.legRX, s.crotchY) },
  ];
}

/* ── glTF assembly ───────────────────────────────────────────────────── */

function toBase64(arr: ArrayBuffer): string {
  const bytes = new Uint8Array(arr);
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 8192) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + 8192)));
  }
  return btoa(chunks.join(''));
}

function addBuf(
  data: ArrayBuffer,
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

  for (const sn of skeletonNodes) {
    gltfNodes.push({
      name: sn.name,
      ...(sn.translation ? { translation: sn.translation } : {}),
      ...(sn.children ? { children: sn.children } : {}),
    });
  }

  const meshNodeStart = gltfNodes.length;

  for (let mi = 0; mi < meshes.length; mi++) {
    const md = meshes[mi];
    const matIdx = materials.length;
    materials.push({
      name: `Mat_${md.name}`,
      pbrMetallicRoughness: { baseColorFactor: md.color, metallicFactor: 0.0, roughnessFactor: 0.8 },
    });

    // Positions
    const posData = md.positions.buffer.slice(md.positions.byteOffset, md.positions.byteOffset + md.positions.byteLength);
    const posBv = addBuf(posData, buffers, bufferViews, 34962, bi, bvi);
    let mnX = Infinity, mnY = Infinity, mnZ = Infinity;
    let mxX = -Infinity, mxY = -Infinity, mxZ = -Infinity;
    for (let i = 0; i < md.positions.length; i += 3) {
      mnX = Math.min(mnX, md.positions[i]);   mxX = Math.max(mxX, md.positions[i]);
      mnY = Math.min(mnY, md.positions[i+1]); mxY = Math.max(mxY, md.positions[i+1]);
      mnZ = Math.min(mnZ, md.positions[i+2]); mxZ = Math.max(mxZ, md.positions[i+2]);
    }
    const posAcc = accessors.length;
    accessors.push({ bufferView: posBv, componentType: 5126, count: md.positions.length / 3, type: 'VEC3', min: [mnX, mnY, mnZ], max: [mxX, mxY, mxZ] });

    // Normals
    const norData = md.normals.buffer.slice(md.normals.byteOffset, md.normals.byteOffset + md.normals.byteLength);
    const norBv = addBuf(norData, buffers, bufferViews, 34962, bi, bvi);
    const norAcc = accessors.length;
    accessors.push({ bufferView: norBv, componentType: 5126, count: md.normals.length / 3, type: 'VEC3' });

    // UVs
    const uvData = md.uvs.buffer.slice(md.uvs.byteOffset, md.uvs.byteOffset + md.uvs.byteLength);
    const uvBv = addBuf(uvData, buffers, bufferViews, 34962, bi, bvi);
    const uvAcc = accessors.length;
    accessors.push({ bufferView: uvBv, componentType: 5126, count: md.uvs.length / 2, type: 'VEC2' });

    // Indices (Uint32 to support >65535 vertices)
    const idxData = md.indices.buffer.slice(md.indices.byteOffset, md.indices.byteOffset + md.indices.byteLength);
    const idxBv = addBuf(idxData, buffers, bufferViews, 34963, bi, bvi);
    const idxAcc = accessors.length;
    accessors.push({ bufferView: idxBv, componentType: 5125, count: md.indices.length, type: 'SCALAR' });

    gltfMeshes.push({
      name: md.name,
      primitives: [{
        attributes: { POSITION: posAcc, NORMAL: norAcc, TEXCOORD_0: uvAcc },
        indices: idxAcc,
        material: matIdx,
        mode: 4,
      }],
    });

    gltfNodes.push({ name: `Node_${md.name}`, mesh: mi });
  }

  const sceneChildren = [0, ...Array.from({ length: meshes.length }, (_, i) => meshNodeStart + i)];

  return {
    asset: { version: '2.0', generator: 'DoL SVG-to-glTF Converter' },
    scene: 0,
    scenes: [{ name: 'CharacterScene', nodes: sceneChildren }],
    nodes: gltfNodes,
    meshes: gltfMeshes,
    materials,
    accessors,
    bufferViews,
    buffers,
  };
}

/* ── Public API ───────────────────────────────────────────────────────── */

export interface SvgToGltfOptions {
  geom: BodyGeom;
  spriteState: SpriteState;
  skinColor: string;
}

/**
 * Convert the DoL sprite's body geometry + state into a high-fidelity
 * glTF 2.0 JSON string.  The returned string is a complete self-contained
 * .gltf file (buffers embedded as data URIs).
 */
export function convertSvgToGltf(opts: SvgToGltfOptions): string {
  const { geom, spriteState: s, skinColor } = opts;

  const meshes: MeshData[] = [
    buildHeadMesh(geom, s, skinColor),
    buildNeckMesh(geom, s, skinColor),
    buildTorsoMesh(geom, s, skinColor),
    buildArmMesh('left', geom, s, skinColor),
    buildArmMesh('right', geom, s, skinColor),
    buildLegMesh('left', geom, s, skinColor),
    buildLegMesh('right', geom, s, skinColor),
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
