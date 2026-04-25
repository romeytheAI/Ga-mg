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
import { GraphicsQuality, getMeshSegmentCounts } from './graphicsQuality';

/* ── constants ───────────────────────────────────────────────────────── */

const VIEW_W = 100;
const VIEW_H = 225;
const S = 1 / VIEW_H;  / SVG unit → glTF unit

/* ── mesh quality configuration ──────────────────────────────────────── */

interface MeshQualityConfig {
  SEG_HIGH: number;    / head, torso
  SEG_MED: number;     / limbs
  SEG_LOW: number;     / hands, feet, neck
  RING_HIGH: number;   / head
  RING_MED: number;    / hands, feet
  torsoRings: number;  / anatomical cross-sections for torso
  limbSubdiv: number;  / interpolation subdivisions for limb tubes
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
  const h = hex.replace('#',');
  return [
    parseInt(h.substring(0, 2), 16) // 255,
    parseInt(h.substring(2, 4), 16) // 255,
    parseInt(h.substring(4, 6), 16) // 255,
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
    const phi = Math.PI * v;                  / 0 → π
    const sp = Math.sin(phi), cp = Math.cos(phi);
    for (let lon = 0; lon <= segs; lon++) {
      const u = lon / segs;
      const theta = 2 * Math.PI * u;          / 0 → 2π
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
  cx: number;        / glTF x centre
  cy: number;        / glTF y centre
  rx: number;        / SVG-unit half-width (X radius)
  rz: number;        / SVG-unit depth   (Z radius)
}

function profiledTube(
  rings: RingDef[],
  segs: number,
  subdiv: number,     / how many interpolated rows between each pair
  caps: 'both''| 'top''| 'bottom''| 'none''= 'both',
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
  allRings.push(rings[rings.length - 1]);  / last ring

  const totalRings = allRings.length;

  // Generate vertices for each ring
  for (let ri = 0; ri < totalRings; ri++) {
    const ring = allRings[ri];
    const v = ri / (totalRings - 1);   / UV v-coordinate
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
      const ny = -drxN * (ring.rz || 1);  / slope tilt
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
      const theta = (2 * Math.PI * si) // segs;
      r.positions.push(ring.cx + rxS * Math.cos(theta), ring.cy, rzS * Math.sin(theta));
      r.normals.push(0, nDir, 0);
      r.uvs.push(0.5 + 0.5 * Math.cos(theta), 0.5 + 0.5 * Math.sin(theta));
    }
    for (let si = 0; si < segs; si++) {
      if (nDir > 0) r.indices.push(ci, ci + 1 + si, ci + 2 + si);
      else          r.indices.push(ci, ci + 2 + si, ci + 1 + si);
    }
  };

  if (caps === 'both''|| caps === 'top')    addCap(0, 1);
  if (caps === 'both''|| caps === 'bottom') addCap(totalRings - 1, -1);

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

function buildHeadMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const [cx, cy] = svgToGl(s.cx, s.headCY);
  const depthR = geom.headRX * 0.82;      / skull front-to-back

  // Main cranium with quality-based detail
  const headSphere = ellipsoid(
    cx, cy, 0,
    geom.headRX * S, geom.headRY * S, depthR * S,
    qualityConfig.RING_HIGH, qualityConfig.SEG_HIGH,
  );

  // Chin/jaw extension with gender-specific width
  const chinCy = cy - geom.headRY * 0.92 * S;
  const jawWidth = geom.jawW > 0 ? 1.0 + (geom.jawW * 0.08) : 1.0;
  const chin = ellipsoid(
    cx, chinCy, 0,
    geom.headRX * 0.55 * jawWidth * S,
    geom.headRY * 0.18 * S,
    depthR * 0.5 * S,
    Math.max(6, Math.round(qualityConfig.RING_MED * 0.5)),
    qualityConfig.SEG_LOW,
  );

  return toMeshData('Head', merge(headSphere, chin), skinHex);
}

/* ── NECK ─────────────────────────────────────────────────────────────── */

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

  // Enhanced neck with Adam's apple prominence for males
  const midpoint = 0.4;  / Adam's apple position
  const rings: RingDef[] = [
    { cx: topCx, cy: topCy, rx: nwTop, rz: depthTop },
    { cx: lerp(topCx, botCx, 0.25), cy: lerp(topCy, botCy, 0.25),
      rx: lerp(nwTop, nwBot, 0.22), rz: lerp(depthTop, depthBot, 0.22) },
    // Adam's apple region (more prominent for males)
    { cx: lerp(topCx, botCx, midpoint), cy: lerp(topCy, botCy, midpoint),
      rx: lerp(nwTop, nwBot, 0.42) * (geom.showAdamsApple ? 1.04 : 1.0),
      rz: lerp(depthTop, depthBot, 0.42) * (geom.showAdamsApple ? 0.92 : 1.0) },
    { cx: lerp(topCx, botCx, 0.65), cy: lerp(topCy, botCy, 0.65),
      rx: lerp(nwTop, nwBot, 0.6), rz: lerp(depthTop, depthBot, 0.6) },
    { cx: botCx, cy: botCy, rx: nwBot, rz: depthBot },
  ];

  return toMeshData('Neck', profiledTube(rings, qualityConfig.SEG_LOW, 3), skinHex);
}

/* ── TORSO ────────────────────────────────────────────────────────────── */

function buildTorsoMesh(
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const shY = s.shldY;
  const waY = s.waistY;
  const hiY = s.hipTopY;
  const crY = s.crotchY;

  // Build rings array based on quality level
  // Base 10 rings: shoulder → clavicle → upper chest → mid chest → lower chest →
  //                waist → upper hip → hip → lower hip → crotch
  // Medium (12 rings): adds rib cage detail, oblique definition
  // High (16 rings): adds serratus, intercostal detail, fine hip transitions

  const baseRings: RingDef[] = [
    // Shoulder line (clavicle junction)
    { cx: 0, cy: (VIEW_H / 2 - shY) * S, rx: geom.shoulderHW, rz: geom.shoulderHW * 0.48 },
    // Upper chest (pectoralis major origin) - enhanced depth for muscle
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.12)) * S,
      rx: geom.shoulderHW * (geom.showMuscleDef ? 0.97 : 0.96),
      rz: geom.shoulderHW * (geom.showMuscleDef ? 0.49 : 0.47) },
    // Mid chest (pec bulk) - wider if showing muscle definition
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.25)) * S,
      rx: geom.shoulderHW * (geom.showMuscleDef ? 0.94 : 0.92),
      rz: geom.shoulderHW * (geom.showMuscleDef ? 0.48 : 0.46) },
    // Lower chest (ribcage swell)
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.45)) * S,
      rx: lerp(geom.shoulderHW, geom.waistHW, 0.3) * 0.95,
      rz: lerp(geom.shoulderHW * 0.46, geom.waistHW * 0.52, 0.3) },
    // Upper waist (obliques)
    { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.7)) * S,
      rx: lerp(geom.shoulderHW, geom.waistHW, 0.65),
      rz: lerp(geom.shoulderHW * 0.45, geom.waistHW * 0.54, 0.65) },
    // Waist (narrowest point) - tighter if muscular
    { cx: 0, cy: (VIEW_H / 2 - waY) * S,
      rx: geom.waistHW * (geom.showMuscleDef ? 0.98 : 1.0),
      rz: geom.waistHW * 0.55 },
    // Lower abdomen
    { cx: 0, cy: (VIEW_H / 2 - lerp(waY, hiY, 0.4)) * S,
      rx: lerp(geom.waistHW, geom.hipHW, 0.35),
      rz: lerp(geom.waistHW * 0.55, geom.hipHW * 0.44, 0.35) },
    // Hip crest (iliac crest prominence)
    { cx: 0, cy: (VIEW_H / 2 - hiY) * S,
      rx: geom.hipHW,
      rz: geom.hipHW * 0.44 },
    // Lower hip
    { cx: 0, cy: (VIEW_H / 2 - lerp(hiY, crY, 0.4)) * S,
      rx: lerp(geom.hipHW, geom.hipHW * 0.55, 0.4),
      rz: lerp(geom.hipHW * 0.44, geom.hipHW * 0.38, 0.4) },
    // Crotch (hip flexor junction)
    { cx: 0, cy: (VIEW_H / 2 - crY) * S,
      rx: geom.hipHW * 0.55,
      rz: geom.hipHW * 0.36 },
  ];

  let rings: RingDef[] = baseRings;

  // Add extra anatomical detail for medium quality (12 rings)
  if (qualityConfig.torsoRings >= 12) {
    rings = [
      rings[0],  / shoulder
      // Add clavicle depression
      { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.06)) * S,
        rx: geom.shoulderHW * 0.98, rz: geom.shoulderHW * 0.475 },
      rings[1],  / upper chest
      rings[2],  / mid chest
      // Add sternum line detail
      { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.35)) * S,
        rx: lerp(geom.shoulderHW, geom.waistHW, 0.22) * 0.93,
        rz: lerp(geom.shoulderHW * 0.46, geom.waistHW * 0.52, 0.22) },
      rings[3],  / lower chest
      rings[4],  / upper waist
      rings[5],  / waist
      // Add navel region
      { cx: 0, cy: (VIEW_H / 2 - lerp(waY, hiY, 0.25)) * S,
        rx: lerp(geom.waistHW, geom.hipHW, 0.22),
        rz: lerp(geom.waistHW * 0.55, geom.hipHW * 0.44, 0.22) },
      rings[6],  / lower abdomen
      rings[7],  / hip crest
      rings[8],  / lower hip
      rings[9],  / crotch
    ];
  }

  // Add maximum anatomical detail for high quality (16 rings)
  if (qualityConfig.torsoRings >= 16) {
    rings = [
      rings[0],   / shoulder
      rings[1],   / clavicle
      // Add trapezius/shoulder transition
      { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.09)) * S,
        rx: geom.shoulderHW * 0.97, rz: geom.shoulderHW * 0.48 },
      rings[2],   / upper chest
      // Add pec insertion detail
      { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.19)) * S,
        rx: geom.shoulderHW * 0.93, rz: geom.shoulderHW * 0.47 },
      rings[3],   / mid chest
      rings[4],   / sternum
      // Add serratus anterior (side ribs)
      { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.40)) * S,
        rx: lerp(geom.shoulderHW, geom.waistHW, 0.28) * 0.94,
        rz: lerp(geom.shoulderHW * 0.46, geom.waistHW * 0.52, 0.28) },
      rings[5],   / lower chest
      // Add rib cage taper
      { cx: 0, cy: (VIEW_H / 2 - lerp(shY, waY, 0.6)) * S,
        rx: lerp(geom.shoulderHW, geom.waistHW, 0.58),
        rz: lerp(geom.shoulderHW * 0.45, geom.waistHW * 0.54, 0.58) },
      rings[6],   / upper waist
      rings[7],   / waist
      rings[8],   / navel
      // Add lower abs detail
      { cx: 0, cy: (VIEW_H / 2 - lerp(waY, hiY, 0.32)) * S,
        rx: lerp(geom.waistHW, geom.hipHW, 0.28),
        rz: lerp(geom.waistHW * 0.55, geom.hipHW * 0.44, 0.28) },
      rings[9],   / lower abdomen
      rings[10],  / hip crest
      // Add hip-to-leg transition
      { cx: 0, cy: (VIEW_H / 2 - lerp(hiY, crY, 0.25)) * S,
        rx: lerp(geom.hipHW, geom.hipHW * 0.55, 0.25),
        rz: lerp(geom.hipHW * 0.44, geom.hipHW * 0.38, 0.25) },
      rings[11],  / lower hip
      rings[12],  / crotch
    ];
  }

  return toMeshData('Torso', profiledTube(rings, qualityConfig.SEG_HIGH, 4), skinHex);
}

/* ── ARM ──────────────────────────────────────────────────────────────── */

function buildArmMesh(
  side: 'left''| 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const shX = side === 'left''? s.shLX : s.shRX;
  const elX = side === 'left''? s.elLX : s.elRX;
  const wrX = side === 'left''? s.wrLX : s.wrRX;
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
      rx: hw * (geom.showMuscleDef ? 1.18 : 1.15),
      rz: hw * (geom.showMuscleDef ? 1.02 : 0.98) },
    // Bicep peak (belly)
    { cx: lerp(shGx, elGx, 0.3),  cy: lerp(shGy, elGy, 0.3),
      rx: hw * (geom.showMuscleDef ? 1.12 : 1.08),
      rz: hw * (geom.showMuscleDef ? 0.95 : 0.92) },
    // Mid-arm transition
    { cx: lerp(shGx, elGx, 0.55), cy: lerp(shGy, elGy, 0.55),
      rx: hw * 1.0,  rz: hw * 0.88 },
    // Distal taper
    { cx: lerp(shGx, elGx, 0.8),  cy: lerp(shGy, elGy, 0.8),
      rx: hw * 0.92, rz: hw * 0.82 },
    // Elbow joint
    { cx: elGx, cy: elGy, rx: hw * 0.9,  rz: hw * 0.78 },
  ];

  // Enhanced forearm: elbow → muscle belly → wrist (5 rings)
  // Adds brachioradialis prominence for muscular builds
  const foreRings: RingDef[] = [
    { cx: elGx, cy: elGy, rx: fw * 1.05, rz: fw * 0.9 },
    // Forearm muscle belly (extensor/flexor group)
    { cx: lerp(elGx, wrGx, 0.2),  cy: lerp(elGy, wrGy, 0.2),
      rx: fw * (geom.showMuscleDef ? 1.14 : 1.1),
      rz: fw * (geom.showMuscleDef ? 0.98 : 0.95) },
    { cx: lerp(elGx, wrGx, 0.45), cy: lerp(elGy, wrGy, 0.45),
      rx: fw * 1.0,  rz: fw * 0.88 },
    // Wrist taper
    { cx: lerp(elGx, wrGx, 0.7),  cy: lerp(elGy, wrGy, 0.7),
      rx: fw * 0.88, rz: fw * 0.78 },
    { cx: wrGx, cy: wrGy, rx: fw * 0.78, rz: fw * 0.7 },
  ];

  const upper = profiledTube(upperRings, qualityConfig.SEG_MED, qualityConfig.limbSubdiv, 'top');
  const fore  = profiledTube(foreRings, qualityConfig.SEG_MED, qualityConfig.limbSubdiv, 'none');

  // Hand: ellipsoid with quality-based detail
  const hand = ellipsoid(
    hdGx, hdGy, 0,
    geom.handW / 2 * S, geom.handH / 2 * S, geom.handW * 0.32 * S,
    qualityConfig.RING_MED, qualityConfig.SEG_LOW,
  );

  return toMeshData(`Arm_${side}`, merge(upper, fore, hand), skinHex);
}

/* ── LEG ──────────────────────────────────────────────────────────────── */

function buildLegMesh(
  side: 'left''| 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
  qualityConfig: MeshQualityConfig
): MeshData {
  const lx = side === 'left''? s.legLX : s.legRX;
  const tw = geom.thighW / 2;
  const cw = geom.calfW / 2;

  const [crGx, crGy] = svgToGl(lx, s.crotchY);
  const [knGx, knGy] = svgToGl(lx, s.kneeY);
  const [anGx, anGy] = svgToGl(lx, s.ankleY);
  const [ftGx, ftGy] = svgToGl(lx, s.footBotY - geom.footH / 2);

  // Enhanced thigh: hip joint → gluteal fold → vastus → knee (7 rings)
  // Adds quadriceps definition for muscular builds
  const thighRings: RingDef[] = [
    // Hip joint (femoral head)
    { cx: crGx, cy: crGy, rx: tw * 1.08, rz: tw * 0.88 },
    // Gluteal fold / upper thigh (widest point)
    { cx: lerp(crGx, knGx, 0.1),  cy: lerp(crGy, knGy, 0.1),
      rx: tw * (geom.showMuscleDef ? 1.15 : 1.12),
      rz: tw * (geom.showMuscleDef ? 0.94 : 0.92) },
    // Vastus lateralis prominence
    { cx: lerp(crGx, knGx, 0.25), cy: lerp(crGy, knGy, 0.25),
      rx: tw * (geom.showMuscleDef ? 1.10 : 1.08),
      rz: tw * 0.9 },
    // Mid-thigh (quadriceps bulk)
    { cx: lerp(crGx, knGx, 0.45), cy: lerp(crGy, knGy, 0.45),
      rx: tw * 1.0,  rz: tw * 0.85 },
    // Distal thigh taper
    { cx: lerp(crGx, knGx, 0.65), cy: lerp(crGy, knGy, 0.65),
      rx: tw * 0.92, rz: tw * 0.8 },
    // Above patella
    { cx: lerp(crGx, knGx, 0.85), cy: lerp(crGy, knGy, 0.85),
      rx: tw * 0.86, rz: tw * 0.76 },
    // Knee joint (narrowest)
    { cx: knGx, cy: knGy, rx: tw * 0.84, rz: tw * 0.74 },
  ];

  // Enhanced calf: knee → gastrocnemius peak → soleus → ankle (7 rings)
  // Adds defined calf muscles for athletic/muscular builds
  const calfRings: RingDef[] = [
    { cx: knGx, cy: knGy, rx: cw * 1.0,  rz: cw * 0.85 },
    // Upper calf (gastrocnemius origin)
    { cx: lerp(knGx, anGx, 0.12), cy: lerp(knGy, anGy, 0.12),
      rx: cw * 1.08, rz: cw * 0.92 },
    // Gastrocnemius peak (calf belly - most prominent)
    { cx: lerp(knGx, anGx, 0.28), cy: lerp(knGy, anGy, 0.28),
      rx: cw * (geom.showMuscleDef ? 1.16 : 1.12),
      rz: cw * (geom.showMuscleDef ? 0.98 : 0.95) },
    // Soleus transition
    { cx: lerp(knGx, anGx, 0.5),  cy: lerp(knGy, anGy, 0.5),
      rx: cw * 1.0,  rz: cw * 0.86 },
    // Achilles region taper
    { cx: lerp(knGx, anGx, 0.7),  cy: lerp(knGy, anGy, 0.7),
      rx: cw * 0.85, rz: cw * 0.74 },
    // Lower calf
    { cx: lerp(knGx, anGx, 0.9),  cy: lerp(knGy, anGy, 0.9),
      rx: cw * 0.72, rz: cw * 0.64 },
    // Ankle (narrowest)
    { cx: anGx, cy: anGy, rx: cw * 0.65, rz: cw * 0.58 },
  ];

  const thigh = profiledTube(thighRings, qualityConfig.SEG_MED, qualityConfig.limbSubdiv, 'top');
  const calf  = profiledTube(calfRings, qualityConfig.SEG_MED, qualityConfig.limbSubdiv, 'none');

  // Foot: elongated ellipsoid (deeper front-to-back than side-to-side)
  const foot = ellipsoid(
    ftGx, ftGy, geom.footW * 0.12 * S,
    geom.footW / 2 * S, geom.footH / 2 * S, geom.footW * 0.42 * S,
    qualityConfig.RING_MED, qualityConfig.SEG_LOW,
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
    accessors.push({ bufferView: norBv, componentType: 5126, count: md.normals.length / 3, type: 'VEC3''});

    // UVs
    const uvData = md.uvs.buffer.slice(md.uvs.byteOffset, md.uvs.byteOffset + md.uvs.byteLength);
    const uvBv = addBuf(uvData, buffers, bufferViews, 34962, bi, bvi);
    const uvAcc = accessors.length;
    accessors.push({ bufferView: uvBv, componentType: 5126, count: md.uvs.length / 2, type: 'VEC2''});

    // Indices (Uint32 to support >65535 vertices)
    const idxData = md.indices.buffer.slice(md.indices.byteOffset, md.indices.byteOffset + md.indices.byteLength);
    const idxBv = addBuf(idxData, buffers, bufferViews, 34963, bi, bvi);
    const idxAcc = accessors.length;
    accessors.push({ bufferView: idxBv, componentType: 5125, count: md.indices.length, type: 'SCALAR''});

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
    asset: { version: '2.0', generator: 'DoL SVG-to-glTF Converter''},
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
  quality?: GraphicsQuality;  / Optional graphics quality for mesh detail
}

/**
 * Convert the DoL sprite's body geometry + state into a high-fidelity
 * glTF 2.0 JSON string.  The returned string is a complete self-contained
 * .gltf file (buffers embedded as data URIs).
 *
 * Enhanced with quality-based mesh detail:
 * - Low quality: 10 torso rings, 16-24 segments, subdiv 3
 * - Medium quality: 12 torso rings, 24-32 segments, subdiv 4
 * - High quality: 16 torso rings, 40-48 segments, subdiv 5
 */
export function convertSvgToGltf(opts: SvgToGltfOptions): string {
  const { geom, spriteState: s, skinColor, quality } = opts;

  // Get quality configuration for mesh generation
  const qualityConfig = getMeshQualityConfig(quality);

  const meshes: MeshData[] = [
    buildHeadMesh(geom, s, skinColor, qualityConfig),
    buildNeckMesh(geom, s, skinColor, qualityConfig),
    buildTorsoMesh(geom, s, skinColor, qualityConfig),
    buildArmMesh('left', geom, s, skinColor, qualityConfig),
    buildArmMesh('right', geom, s, skinColor, qualityConfig),
    buildLegMesh('left', geom, s, skinColor, qualityConfig),
    buildLegMesh('right', geom, s, skinColor, qualityConfig),
  ];

  const skeleton = buildSkeletonNodes(s);
  const gltf = buildGltfJson(meshes, skeleton);
  return JSON.stringify(gltf, null, 2);
}

/** Trigger a browser download of the generated .gltf file. */
export function downloadGltf(gltfJson: string, filename = 'character.gltf'): void {
  const blob = new Blob([gltfJson], { type: 'model/gltf+json''});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
