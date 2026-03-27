/**
 * SVG-to-glTF 2.0 converter for the DoL character sprite.
 *
 * Converts the 2D SVG body geometry (viewBox 0 0 100 225) into a valid
 * glTF 2.0 JSON document with:
 *   - Flat quad/triangle meshes for each body part (head, torso, arms, legs)
 *   - Materials derived from skin / clothing colors
 *   - A skeleton node hierarchy for potential rigging
 *   - All buffers embedded as base64 data URIs (self-contained .gltf)
 *
 * The coordinate convention maps SVG (x-right, y-down) to glTF (x-right,
 * y-up, z-out). Y is flipped and the model is centred at origin.
 */

import { BodyGeom, SpriteState } from '../components/dol/sprite/utils';

/* ── helpers ─────────────────────────────────────────────────────────── */

/** Parse "#rrggbb" → [r,g,b,1] in 0-1 range */
function hexToRgba(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b, 1.0];
}

/** Convert SVG coord → glTF coord.  SVG: (x right, y down), glTF: (x right, y up, z=0). */
function svgToGl(sx: number, sy: number, viewW = 100, viewH = 225): [number, number, number] {
  const scale = 1 / viewH; // normalise so model height ≈ 1 unit
  const x = (sx - viewW / 2) * scale;
  const y = (viewH / 2 - sy) * scale; // flip Y
  return [x, y, 0];
}

/** Build a flat quad (2 triangles) from 4 SVG corner points (clockwise). */
function quadFromCorners(
  topLeft: [number, number],
  topRight: [number, number],
  bottomRight: [number, number],
  bottomLeft: [number, number],
): { positions: number[]; indices: number[] } {
  const [ax, ay, az] = svgToGl(topLeft[0], topLeft[1]);
  const [bx, by, bz] = svgToGl(topRight[0], topRight[1]);
  const [cx, cy, cz] = svgToGl(bottomRight[0], bottomRight[1]);
  const [dx, dy, dz] = svgToGl(bottomLeft[0], bottomLeft[1]);
  return {
    positions: [ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz],
    indices: [0, 1, 2, 0, 2, 3],
  };
}

/** Build an ellipse-ish mesh from SVG center + radii (subdivided into triangles). */
function ellipseMesh(
  scx: number,
  scy: number,
  rx: number,
  ry: number,
  segments = 16,
): { positions: number[]; indices: number[] } {
  const positions: number[] = [];
  const indices: number[] = [];
  // centre vertex
  const [ox, oy, oz] = svgToGl(scx, scy);
  positions.push(ox, oy, oz);

  for (let i = 0; i < segments; i++) {
    const a = (2 * Math.PI * i) / segments;
    const [px, py, pz] = svgToGl(scx + Math.cos(a) * rx, scy + Math.sin(a) * ry);
    positions.push(px, py, pz);
    const next = i === segments - 1 ? 1 : i + 2;
    indices.push(0, i + 1, next);
  }
  return { positions, indices };
}

/* ── main body-part mesh builders ────────────────────────────────────── */

interface MeshData {
  name: string;
  positions: Float32Array;
  indices: Uint16Array;
  color: [number, number, number, number];
}

function buildHeadMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  const m = ellipseMesh(s.cx, s.headCY, geom.headRX, geom.headRY, 24);
  return {
    name: 'Head',
    positions: new Float32Array(m.positions),
    indices: new Uint16Array(m.indices),
    color: hexToRgba(skinHex),
  };
}

function buildNeckMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  const nw = geom.headRX * 0.45;
  const q = quadFromCorners(
    [s.cx - nw, s.neckTopY],
    [s.cx + nw, s.neckTopY],
    [s.cx + nw * 1.1, s.neckBotY],
    [s.cx - nw * 1.1, s.neckBotY],
  );
  return {
    name: 'Neck',
    positions: new Float32Array(q.positions),
    indices: new Uint16Array(q.indices),
    color: hexToRgba(skinHex),
  };
}

function buildTorsoMesh(geom: BodyGeom, s: SpriteState, skinHex: string): MeshData {
  // Simplified torso: shoulder → waist → hip → crotch as a tapered polygon
  const pts: [number, number][] = [
    [s.cx - geom.shoulderHW, s.shldY],          // 0 top-left
    [s.cx + geom.shoulderHW, s.shldY],          // 1 top-right
    [s.cx + geom.waistHW, s.waistY],            // 2 waist-right
    [s.cx + geom.hipHW, s.hipTopY],             // 3 hip-right
    [s.cx + geom.hipHW * 0.5, s.crotchY],       // 4 crotch-right
    [s.cx - geom.hipHW * 0.5, s.crotchY],       // 5 crotch-left
    [s.cx - geom.hipHW, s.hipTopY],             // 6 hip-left
    [s.cx - geom.waistHW, s.waistY],            // 7 waist-left
  ];

  const positions: number[] = [];
  for (const [px, py] of pts) {
    const [gx, gy, gz] = svgToGl(px, py);
    positions.push(gx, gy, gz);
  }

  // Fan triangulation from vertex 0
  const indices: number[] = [];
  for (let i = 1; i < pts.length - 1; i++) {
    indices.push(0, i, i + 1);
  }

  return {
    name: 'Torso',
    positions: new Float32Array(positions),
    indices: new Uint16Array(indices),
    color: hexToRgba(skinHex),
  };
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

  // Upper arm quad
  const upper = quadFromCorners(
    [shX - hw, s.shldY],
    [shX + hw, s.shldY],
    [elX + hw * 0.9, s.elY],
    [elX - hw * 0.9, s.elY],
  );
  // Forearm quad
  const fore = quadFromCorners(
    [elX - fw, s.elY],
    [elX + fw, s.elY],
    [wrX + fw * 0.8, s.wrY],
    [wrX - fw * 0.8, s.wrY],
  );
  // Hand ellipse
  const hand = ellipseMesh(wrX, s.handCY, geom.handW / 2, geom.handH / 2, 12);

  // Merge
  const allPos: number[] = [...upper.positions, ...fore.positions, ...hand.positions];
  const upperLen = upper.positions.length / 3;
  const foreLen  = fore.positions.length / 3;
  const allIdx: number[] = [
    ...upper.indices,
    ...fore.indices.map(i => i + upperLen),
    ...hand.indices.map(i => i + upperLen + foreLen),
  ];

  return {
    name: `Arm_${side}`,
    positions: new Float32Array(allPos),
    indices: new Uint16Array(allIdx),
    color: hexToRgba(skinHex),
  };
}

function buildLegMesh(
  side: 'left' | 'right',
  geom: BodyGeom,
  s: SpriteState,
  skinHex: string,
): MeshData {
  const lx  = side === 'left' ? s.legLX : s.legRX;
  const tw  = geom.thighW / 2;
  const cw  = geom.calfW / 2;

  // Thigh quad
  const thigh = quadFromCorners(
    [lx - tw, s.crotchY],
    [lx + tw, s.crotchY],
    [lx + tw * 0.85, s.kneeY],
    [lx - tw * 0.85, s.kneeY],
  );
  // Calf quad
  const calf = quadFromCorners(
    [lx - cw, s.kneeY],
    [lx + cw, s.kneeY],
    [lx + cw * 0.7, s.ankleY],
    [lx - cw * 0.7, s.ankleY],
  );
  // Foot ellipse
  const foot = ellipseMesh(lx, s.footBotY - geom.footH / 2, geom.footW / 2, geom.footH / 2, 12);

  const allPos: number[] = [...thigh.positions, ...calf.positions, ...foot.positions];
  const thighLen = thigh.positions.length / 3;
  const calfLen  = calf.positions.length / 3;
  const allIdx: number[] = [
    ...thigh.indices,
    ...calf.indices.map(i => i + thighLen),
    ...foot.indices.map(i => i + thighLen + calfLen),
  ];

  return {
    name: `Leg_${side}`,
    positions: new Float32Array(allPos),
    indices: new Uint16Array(allIdx),
    color: hexToRgba(skinHex),
  };
}

/* ── Skeleton bone nodes ─────────────────────────────────────────────── */

interface GltfNode {
  name: string;
  translation?: [number, number, number];
  children?: number[];
  mesh?: number;
}

function buildSkeletonNodes(s: SpriteState): GltfNode[] {
  // Build a node hierarchy that can serve as armature/skeleton.
  // Indices are stable so meshes can reference them.
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
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function buildGltfJson(meshes: MeshData[], skeletonNodes: GltfNode[]): object {
  const buffers: { uri: string; byteLength: number }[] = [];
  const bufferViews: object[] = [];
  const accessors: object[] = [];
  const gltfMeshes: object[] = [];
  const materials: object[] = [];
  const gltfNodes: object[] = [];

  let bufferIndex = 0;
  let bvIndex = 0;

  // Add skeleton nodes first
  for (const sn of skeletonNodes) {
    gltfNodes.push({
      name: sn.name,
      ...(sn.translation ? { translation: sn.translation } : {}),
      ...(sn.children ? { children: sn.children } : {}),
    });
  }

  // Mesh node start index
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
      doubleSided: true,
    });

    // Positions buffer
    const posBytes = md.positions.buffer.slice(
      md.positions.byteOffset,
      md.positions.byteOffset + md.positions.byteLength,
    );
    const posB64 = toBase64(posBytes);
    const posBufIdx = bufferIndex++;
    buffers.push({
      uri: `data:application/octet-stream;base64,${posB64}`,
      byteLength: posBytes.byteLength,
    });

    const posBvIdx = bvIndex++;
    bufferViews.push({
      buffer: posBufIdx,
      byteOffset: 0,
      byteLength: posBytes.byteLength,
      target: 34962, // ARRAY_BUFFER
    });

    // Compute bounds
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
      componentType: 5126, // FLOAT
      count: md.positions.length / 3,
      type: 'VEC3',
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    });

    // Indices buffer
    const idxBytes = md.indices.buffer.slice(
      md.indices.byteOffset,
      md.indices.byteOffset + md.indices.byteLength,
    );
    const idxB64 = toBase64(idxBytes);
    const idxBufIdx = bufferIndex++;
    buffers.push({
      uri: `data:application/octet-stream;base64,${idxB64}`,
      byteLength: idxBytes.byteLength,
    });

    const idxBvIdx = bvIndex++;
    bufferViews.push({
      buffer: idxBufIdx,
      byteOffset: 0,
      byteLength: idxBytes.byteLength,
      target: 34963, // ELEMENT_ARRAY_BUFFER
    });

    const idxAccIdx = accessors.length;
    accessors.push({
      bufferView: idxBvIdx,
      componentType: 5123, // UNSIGNED_SHORT
      count: md.indices.length,
      type: 'SCALAR',
    });

    // Mesh
    gltfMeshes.push({
      name: md.name,
      primitives: [
        {
          attributes: { POSITION: posAccIdx },
          indices: idxAccIdx,
          material: matIdx,
          mode: 4, // TRIANGLES
        },
      ],
    });

    // Mesh node
    gltfNodes.push({
      name: `Node_${md.name}`,
      mesh: mi,
    });
  }

  // Scene root children: armature root + all mesh nodes
  const sceneChildren = [0, ...Array.from({ length: meshes.length }, (_, i) => meshNodeStart + i)];

  return {
    asset: {
      version: '2.0',
      generator: 'Aetherius SVG-to-glTF Converter',
    },
    scene: 0,
    scenes: [
      {
        name: 'CharacterScene',
        nodes: sceneChildren,
      },
    ],
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
