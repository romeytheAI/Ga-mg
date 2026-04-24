import { describe, it, expect } from 'vitest';
import { convertSvgToGltf, SvgToGltfOptions } from './svgToGltf';
import { BodyGeom, SpriteState } from '../components/sprite/utils';

/**
 * Minimal BodyGeom and SpriteState for a female human at default proportions.
 */
function makeTestFixture(): SvgToGltfOptions {
  const geom: BodyGeom = {
    heightScale: 1.0,
    headRX: 10.5,
    headRY: 12.5,
    shoulderHW: 17,
    waistHW: 11,
    hipHW: 21,
    bustR: 5,
    bustY: 67,
    upperArmW: 4.5,
    forearmW: 4.0,
    handW: 7.5,
    handH: 7,
    shoulderOutset: 1,
    elbowOutset: 3,
    wristOutset: 5,
    thighW: 11,
    calfW: 8,
    footW: 11,
    footH: 6.5,
    legSpread: 12.6,
    showPecs: false,
    jawW: 0,
    bustSize: 2,
    showAdamsApple: false,
    showBodyHair: false,
    showMuscleDef: false,
    navelY: 88,
  };

  const spriteState: SpriteState = {
    cx: 50, headCY: 21, neckTopY: 30, neckBotY: 40, shldY: 41, waistY: 98, hipTopY: 104, crotchY: 120,
    kneeY: 160, ankleY: 196, footBotY: 206, shLX: 30, shRX: 70, elLX: 25, elRX: 75, elY: 81,
    wrLX: 20, wrRX: 80, wrY: 109, handCY: 115, legLX: 40, legRX: 60, isDigi: false,
    digiKneeY: 142, digiAnkleY: 184
  };

  return { geom, spriteState, skinColor: '#f4d5b0', gender: 'female' };
}

// Helper: get vertex count for a named mesh
function meshVertCount(gltf: any, name: string): number {
  const mesh = gltf.meshes.find((m: any) => m.name === name);
  if (!mesh) return 0;
  const posAccIdx = mesh.primitives[0].attributes.POSITION;
  return gltf.accessors[posAccIdx].count;
}

describe('svgToGltf', () => {
  it('produces valid glTF 2.0 JSON', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.asset).toBeDefined();
    expect(gltf.asset.version).toBe('2.0');
    expect(gltf.asset.generator).toContain('Aetherius Rig Engine');
  });

  it('contains exactly 10 meshes (head, neck, torso, 2 arms, 2 legs, 2 breasts, genitals)', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.meshes).toHaveLength(10);
    const names = gltf.meshes.map((m: { name: string }) => m.name);
    expect(names).toContain('Head');
    expect(names).toContain('Neck');
    expect(names).toContain('Torso');
    expect(names).toContain('Arm_left');
    expect(names).toContain('Arm_right');
    expect(names).toContain('Leg_left');
    expect(names).toContain('Leg_right');
    expect(names).toContain('Breast_L');
    expect(names).toContain('Breast_R');
    expect(names).toContain('Genitals_Female');
  });

  it('contains skeleton bone nodes', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    const nodeNames = gltf.nodes.map((n: { name: string }) => n.name);
    expect(nodeNames).toContain('Armature');
    expect(nodeNames).toContain('Bone_Hips');
    expect(nodeNames).toContain('Bone_Spine');
    expect(nodeNames).toContain('Bone_Chest');
    expect(nodeNames).toContain('Bone_Head');
    expect(nodeNames).toContain('Bone_Arm_L');
    expect(nodeNames).toContain('Bone_Arm_R');
    expect(nodeNames).toContain('Bone_Leg_L');
    expect(nodeNames).toContain('Bone_Leg_R');
  });

  it('has 10 materials with skin color', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.materials).toHaveLength(10);
    for (const mat of gltf.materials) {
      expect(mat.pbrMetallicRoughness.baseColorFactor).toHaveLength(4);
    }
  });

  it('meshes include NORMAL and JOINTS_0 attributes', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    for (const mesh of gltf.meshes) {
      for (const prim of mesh.primitives) {
        expect(prim.attributes.NORMAL).toBeDefined();
        expect(prim.attributes.JOINTS_0).toBeDefined();
        expect(prim.attributes.WEIGHTS_0).toBeDefined();
      }
    }
  });
});
