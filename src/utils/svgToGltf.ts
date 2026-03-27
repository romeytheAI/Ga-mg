/**
 * SVG-to-glTF 2.0 converter for the DoL character sprite.
 *
 * Converts the 2D SVG body geometry (viewBox 0 0 100 225) into a valid
 * glTF 2.0 JSON document with:
 *   - 3D volumetric meshes for each body part (ellipsoids, tapered cylinders)
 *   - Materials derived from skin / clothing colors
 *   - A skeleton node hierarchy for potential rigging
 *   - Vertex normals for proper shading
 *   - All buffers embedded as base64 data URIs (self-contained .gltf)
 *
 * The coordinate convention maps SVG (x-right, y-down) to glTF (x-right,
 * y-up, z-out). Y is flipped and the model is centred at origin.
 */

import { BodyGeom, SpriteState } from '../components/dol/sprite/utils';

/* ── helpers ─────────────────────────────────────────────────────────── */

const S = 1 / 225; // scale factor: 1 SVG unit → 1/225 glTF units

/** Parse "#rrggbb" → [r,g,b,1] in 0-1 range */
function hexToRgba(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b, 1.0];
}

/** Convert SVG coord → glTF coord.  SVG: (x right, y down), glTF: (x right, y up, z forward). */
function svgToGl(sx: number, sy: number, viewW = 100, viewH = 225): [number, number, number] {
  const x = (sx - viewW / 2) * S;
  const y = (viewH / 2 - sy) * S; // flip Y
  return [x, y, 0];
}

/** Normalise a 3-vector in-place and return it. */
function normalise(v: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
  v[0] /= len; v[1] /= len; v[2] /= len;
  return v;
}

/* ── 3-D primitive builders ──────────────────────────────────────────── */

interface RawMesh { positions: number[]; normals: number[]; indices: number[] }

/**
 * UV-sphere (ellipsoid).  Centre is at glTF (cx, cy, cz); radii are in
 * glTF units.  `rings` latitude rings, `segs` longitude segments.
 */
function ellipsoidMesh(
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
  rings = 10, segs = 16,
): RawMesh {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];

  for (let r = 0; r <= rings; r++) {
    const phi = (Math.PI * r) / rings;          // 0 … π  (pole-to-pole)
    const sp = Math.sin(phi), cp = Math.cos(phi);
    for (let s = 0; s <= segs; s++) {
      const theta = (2 * Math.PI * s) / segs;   // 0 … 2π
      const st = Math.sin(theta), ct = Math.cos(theta);
      const nx = ct * sp, ny = cp, nz = st * sp;
      pos.push(cx + rx * nx, cy + ry * ny, cz + rz * nz);
      const n = normalise([nx / rx, ny / ry, nz / rz]);
      nor.push(...n);
    }
  }
  const stride = segs + 1;
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segs; s++) {
      const a = r * stride + s;
      const b = a + stride;
      idx.push(a, b, a + 1,  a + 1, b, b + 1);
    }
  }
  return { positions: pos, normals: nor, indices: idx };
}

/**
 * Tapered cylinder / truncated cone between two ring centres.
 * Each centre is specified in glTF coords.  Depth is along Z.
 * `rTop`/`rBot` are the SVG-space half-widths (auto-scaled).
 * Returns capped cylinder with smooth normals on the barrel.
 */
function taperedCylinderMesh(
  topCx: number, topCy: number, rTop: number, depthTop: number,
  botCx: number, botCy: number, rBot: number, depthBot: number,
  segs = 12,
): RawMesh {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];

  const rtS = rTop * S;
  const rbS = rBot * S;
  const dtS = depthTop * S;
  const dbS = depthBot * S;

  // Barrel: two rings
  for (let i = 0; i <= segs; i++) {
    const a = (2 * Math.PI * i) / segs;
    const ca = Math.cos(a), sa = Math.sin(a);
    // top ring
    pos.push(topCx + rtS * ca, topCy, dtS * sa);
    // bottom ring
    pos.push(botCx + rbS * ca, botCy, dbS * sa);

    // Smooth normal: average direction outward
    const n = normalise([ca, 0, sa]);
    nor.push(...n, ...n);
  }

  const stride = 2; // top,bot alternating
  for (let i = 0; i < segs; i++) {
    const t0 = i * stride, b0 = t0 + 1;
    const t1 = (i + 1) * stride, b1 = t1 + 1;
    idx.push(t0, b0, t1,  t1, b0, b1);
  }

  // Top cap
  const topCenter = pos.length / 3;
  pos.push(topCx, topCy, 0);
  nor.push(0, 1, 0);
  for (let i = 0; i <= segs; i++) {
    const a = (2 * Math.PI * i) / segs;
    pos.push(topCx + rtS * Math.cos(a), topCy, dtS * Math.sin(a));
    nor.push(0, 1, 0);
  }
  for (let i = 0; i < segs; i++) {
    idx.push(topCenter, topCenter + 1 + i, topCenter + 2 + i);
  }

  // Bottom cap
  const botCenter = pos.length / 3;
  pos.push(botCx, botCy, 0);
  nor.push(0, -1, 0);
  for (let i = 0; i <= segs; i++) {
    const a = (2 * Math.PI * i) / segs;
    pos.push(botCx + rbS * Math.cos(a), botCy, dbS * Math.sin(a));
    nor.push(0, -1, 0);
  }
  for (let i = 0; i < segs; i++) {
    idx.push(botCenter, botCenter + 2 + i, botCenter + 1 + i); // reversed winding
  }

  return { positions: pos, normals: nor, indices: idx };
}

/**
 * Extruded body cross-section: takes a series of SVG (x,y) profile points
 * and extrudes them along Z with a given depth factor to create a 3D volume.
 * The depth at each point can vary to create organic curvature.
 */
function extrudedBodyMesh(
  profile: { sx: number; sy: number; depth: number }[],
  segs = 12,
): RawMesh {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const viewW = 100, viewH = 225;

  // For each profile row, create a ring of vertices
  for (const pt of profile) {
    const cx = (pt.sx - viewW / 2) * S;
    const cy = (viewH / 2 - pt.sy) * S;
    const rz = pt.depth * S;
    for (let i = 0; i <= segs; i++) {
      const a = (Math.PI * i) / segs;   // 0 … π (half-circle, front to back)
      const sa = Math.sin(a), ca = Math.cos(a);
      pos.push(cx, cy, rz * ca);
      // Normal points outward along the half-circle
      nor.push(0, 0, ca > 0 ? 1 : ca < 0 ? -1 : 0);
    }
  }

  // Connect adjacent profile rings
  const stride = segs + 1;
  for (let r = 0; r < profile.length - 1; r++) {
    for (let i = 0; i < segs; i++) {
      const a = r * stride + i;
      const b = a + stride;
      idx.push(a, b, a + 1,  a + 1, b, b + 1);
    }
  }

  return { positions: pos, normals: nor, indices: idx };
}

/** Merge multiple RawMesh into one. */
function mergeRawMeshes(...meshes: RawMesh[]): RawMesh {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  for (const m of meshes) {
    const offset = pos.length / 3;
    pos.push(...m.positions);
    nor.push(...m.normals);
    idx.push(...m.indices.map(i => i + offset));
  }
  return { positions: pos, normals: nor, indices: idx };
}

/* ── main body-part mesh builders ────────────────────────────────────── */

interface MeshData {
  name: string;
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
  color: [number, number, number, number];
}

function toMeshData(name: string, raw: RawMesh, skinHex: string): MeshData {
  return {
    name,
    positions: new Float32Array(raw.positions),
    normals: new Float32Array(raw.normals),
    indices: new Uint16Array(raw.indices),
    color: hexToRgba(skinHex),
  };
}

function buildHeadMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  const [cx, cy] = svgToGl(s.cx, s.headCY);
  // Head depth ≈ 80% of width for a natural skull shape
  const depthR = geom.headRX * 0.8;
  const m = ellipsoidMesh(cx, cy, 0, geom.headRX * S, geom.headRY * S, depthR * S, 12, 20);
  return toMeshData('Head', m, skinHex);
}

function buildNeckMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  const nw = geom.headRX * 0.45;
  const [topCx, topCy] = svgToGl(s.cx, s.neckTopY);
  const [botCx, botCy] = svgToGl(s.cx, s.neckBotY);
  const depth = nw * 0.7; // neck depth
  const m = taperedCylinderMesh(topCx, topCy, nw, depth, botCx, botCy, nw * 1.1, depth * 1.1, 10);
  return toMeshData('Neck', m, skinHex);
}

function buildTorsoMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  // Build torso as an extruded cross-section through shoulder→waist→hip→crotch
  // Use left half-width; we mirror by creating full ring around Z axis
  const viewW = 100, viewH = 225;

  // Profile rows: each row has SVG center-x, SVG y, and SVG half-widths
  const rows: { y: number; hw: number; depth: number }[] = [
    { y: s.shldY,   hw: geom.shoulderHW, depth: geom.shoulderHW * 0.45 },
    { y: s.shldY + (s.waistY - s.shldY) * 0.33, hw: geom.shoulderHW * 0.92, depth: geom.shoulderHW * 0.42 },
    { y: s.shldY + (s.waistY - s.shldY) * 0.66, hw: (geom.shoulderHW + geom.waistHW) / 2, depth: (geom.shoulderHW * 0.45 + geom.waistHW * 0.5) / 2 },
    { y: s.waistY,  hw: geom.waistHW,    depth: geom.waistHW * 0.5 },
    { y: s.hipTopY, hw: geom.hipHW,       depth: geom.hipHW * 0.4 },
    { y: s.crotchY, hw: geom.hipHW * 0.5, depth: geom.hipHW * 0.35 },
  ];

  const segs = 12;
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];

  // Build rings around the torso cross-section
  for (const row of rows) {
    const cy = (viewH / 2 - row.y) * S;
    const rxS = row.hw * S;
    const rzS = row.depth * S;
    for (let i = 0; i <= segs; i++) {
      const a = (2 * Math.PI * i) / segs;
      const ca = Math.cos(a), sa = Math.sin(a);
      pos.push(rxS * ca, cy, rzS * sa);
      const n = normalise([ca / row.hw, 0, sa / row.depth]);
      nor.push(...n);
    }
  }

  // Connect adjacent rings
  const stride = segs + 1;
  for (let r = 0; r < rows.length - 1; r++) {
    for (let i = 0; i < segs; i++) {
      const a = r * stride + i;
      const b = a + stride;
      idx.push(a, b, a + 1,  a + 1, b, b + 1);
    }
  }

  // Top cap (shoulders)
  const topC = pos.length / 3;
  pos.push(0, (viewH / 2 - rows[0].y) * S, 0);
  nor.push(0, 1, 0);
  for (let i = 0; i <= segs; i++) {
    const a = (2 * Math.PI * i) / segs;
    pos.push(rows[0].hw * S * Math.cos(a), (viewH / 2 - rows[0].y) * S, rows[0].depth * S * Math.sin(a));
    nor.push(0, 1, 0);
  }
  for (let i = 0; i < segs; i++) {
    idx.push(topC, topC + 1 + i, topC + 2 + i);
  }

  // Bottom cap (crotch)
  const botR = rows[rows.length - 1];
  const botC = pos.length / 3;
  pos.push(0, (viewH / 2 - botR.y) * S, 0);
  nor.push(0, -1, 0);
  for (let i = 0; i <= segs; i++) {
    const a = (2 * Math.PI * i) / segs;
    pos.push(botR.hw * S * Math.cos(a), (viewH / 2 - botR.y) * S, botR.depth * S * Math.sin(a));
    nor.push(0, -1, 0);
  }
  for (let i = 0; i < segs; i++) {
    idx.push(botC, botC + 2 + i, botC + 1 + i);
  }

  return toMeshData('Torso', { positions: pos, normals: nor, indices: idx }, skinHex);
}

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

  // Upper arm: tapered cylinder
  const upper = taperedCylinderMesh(
    shGx, shGy, hw, hw * 0.85,
    elGx, elGy, hw * 0.9, hw * 0.75,
    8,
  );
  // Forearm: tapered cylinder
  const fore = taperedCylinderMesh(
    elGx, elGy, fw, fw * 0.85,
    wrGx, wrGy, fw * 0.8, fw * 0.7,
    8,
  );
  // Hand: small ellipsoid
  const hand = ellipsoidMesh(
    hdGx, hdGy, 0,
    geom.handW / 2 * S, geom.handH / 2 * S, geom.handW / 3 * S,
    6, 8,
  );

  return toMeshData(`Arm_${side}`, mergeRawMeshes(upper, fore, hand), skinHex);
}

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

  // Thigh: tapered cylinder
  const thigh = taperedCylinderMesh(
    crGx, crGy, tw, tw * 0.8,
    knGx, knGy, tw * 0.85, tw * 0.7,
    8,
  );
  // Calf: tapered cylinder
  const calf = taperedCylinderMesh(
    knGx, knGy, cw, cw * 0.8,
    anGx, anGy, cw * 0.7, cw * 0.6,
    8,
  );
  // Foot: elongated ellipsoid (longer front-to-back)
  const foot = ellipsoidMesh(
    ftGx, ftGy, geom.footW * 0.15 * S,  // foot offset forward slightly
    geom.footW / 2 * S, geom.footH / 2 * S, geom.footW * 0.4 * S,
    6, 8,
  );

  return toMeshData(`Leg_${side}`, mergeRawMeshes(thigh, calf, foot), skinHex);
}

/* ── Skeleton bone nodes ─────────────────────────────────────────────── */

interface GltfNode {
  name: string;
  translation?: [number, number, number];
  children?: number[];
  mesh?: number;
}

function buildSkeletonNodes(s: SpriteState): GltfNode[] {
  return [
    // 0 - root
    { name: 'Armature', translation: [0, 0, 0], children: [1] },
    // 1 - hips
    { name: 'Bone_Hips', translation: svgToGl(s.cx, s.crotchY), children: [2, 7, 8] },
    // 2 - spine
    { name: 'Bone_Spine', translation: svgToGl(s.cx, s.waistY), children: [3] },
    // 3 - chest
    { name: 'Bone_Chest', translation: svgToGl(s.cx, s.shldY), children: [4, 5, 6] },
    // 4 - head
    { name: 'Bone_Head', translation: svgToGl(s.cx, s.headCY) },
    // 5 - left arm
    { name: 'Bone_Arm_L', translation: svgToGl(s.shLX, s.shldY) },
    // 6 - right arm
    { name: 'Bone_Arm_R', translation: svgToGl(s.shRX, s.shldY) },
    // 7 - left leg
    { name: 'Bone_Leg_L', translation: svgToGl(s.legLX, s.crotchY) },
    // 8 - right leg
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

function addBufferToGltf(
  data: ArrayBuffer,
  buffers: { uri: string; byteLength: number }[],
  bufferViews: object[],
  target: number,
  bufferIndex: { v: number },
  bvIndex: { v: number },
): number {
  const b64 = toBase64(data);
  const bi = bufferIndex.v++;
  buffers.push({ uri: `data:application/octet-stream;base64,${b64}`, byteLength: data.byteLength });
  const bvi = bvIndex.v++;
  bufferViews.push({ buffer: bi, byteOffset: 0, byteLength: data.byteLength, target });
  return bvi;
}

function buildGltfJson(meshes: MeshData[], skeletonNodes: GltfNode[]): object {
  const buffers: { uri: string; byteLength: number }[] = [];
  const bufferViews: object[] = [];
  const accessors: object[] = [];
  const gltfMeshes: object[] = [];
  const materials: object[] = [];
  const gltfNodes: object[] = [];

  const bufferIndex = { v: 0 };
  const bvIndex = { v: 0 };

  // Add skeleton nodes first
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

    // Material
    const matIdx = materials.length;
    materials.push({
      name: `Mat_${md.name}`,
      pbrMetallicRoughness: {
        baseColorFactor: md.color,
        metallicFactor: 0.0,
        roughnessFactor: 0.8,
      },
    });

    // Positions
    const posBytes = md.positions.buffer.slice(md.positions.byteOffset, md.positions.byteOffset + md.positions.byteLength);
    const posBvIdx = addBufferToGltf(posBytes, buffers, bufferViews, 34962, bufferIndex, bvIndex);

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < md.positions.length; i += 3) {
      minX = Math.min(minX, md.positions[i]);
      maxX = Math.max(maxX, md.positions[i]);
      minY = Math.min(minY, md.positions[i + 1]);
      maxY = Math.max(maxY, md.positions[i + 1]);
      minZ = Math.min(minZ, md.positions[i + 2]);
      maxZ = Math.max(maxZ, md.positions[i + 2]);
    }

    const posAccIdx = accessors.length;
    accessors.push({
      bufferView: posBvIdx,
      componentType: 5126,
      count: md.positions.length / 3,
      type: 'VEC3',
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    });

    // Normals
    const norBytes = md.normals.buffer.slice(md.normals.byteOffset, md.normals.byteOffset + md.normals.byteLength);
    const norBvIdx = addBufferToGltf(norBytes, buffers, bufferViews, 34962, bufferIndex, bvIndex);
    const norAccIdx = accessors.length;
    accessors.push({
      bufferView: norBvIdx,
      componentType: 5126,
      count: md.normals.length / 3,
      type: 'VEC3',
    });

    // Indices
    const idxBytes = md.indices.buffer.slice(md.indices.byteOffset, md.indices.byteOffset + md.indices.byteLength);
    const idxBvIdx = addBufferToGltf(idxBytes, buffers, bufferViews, 34963, bufferIndex, bvIndex);
    const idxAccIdx = accessors.length;
    accessors.push({
      bufferView: idxBvIdx,
      componentType: 5123,
      count: md.indices.length,
      type: 'SCALAR',
    });

    // Mesh
    gltfMeshes.push({
      name: md.name,
      primitives: [{
        attributes: { POSITION: posAccIdx, NORMAL: norAccIdx },
        indices: idxAccIdx,
        material: matIdx,
        mode: 4,
      }],
    });

    gltfNodes.push({ name: `Node_${md.name}`, mesh: mi });
  }

  const sceneChildren = [0, ...Array.from({ length: meshes.length }, (_, i) => meshNodeStart + i)];

  return {
    asset: {
      version: '2.0',
      generator: 'DoL SVG-to-glTF Converter',
    },
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
 * Convert the DoL sprite's body geometry + state into a glTF 2.0 JSON string.
 * The returned string is a complete self-contained .gltf file (buffers are
 * embedded as data URIs).
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
