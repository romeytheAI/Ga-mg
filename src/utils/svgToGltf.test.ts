import { describe, it, expect } from 'vitest';
import { convertSvgToGltf, SvgToGltfOptions } from './svgToGltf';
import { BodyGeom, SpriteState } from '../components/dol/sprite/utils';

/**
 * Minimal BodyGeom and SpriteState for a female human at default proportions.
 * Mirrors the values DoLCharacterSprite would compute.
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

  const cx = 50;
  const headCY = 21;
  const neckTopY = headCY + geom.headRY;
  const neckBotY = neckTopY + 9;
  const shldY = neckBotY + 1;
  const waistY = 98;
  const hipTopY = 104;
  const crotchY = 120;
  const kneeY = 160;
  const ankleY = 196;
  const footBotY = 206;

  const spriteState: SpriteState = {
    cx, headCY, neckTopY, neckBotY, shldY, waistY, hipTopY, crotchY,
    kneeY, ankleY, footBotY,
    shLX: cx - geom.shoulderHW - geom.shoulderOutset,
    shRX: cx + geom.shoulderHW + geom.shoulderOutset,
    elLX: cx - geom.shoulderHW - geom.elbowOutset,
    elRX: cx + geom.shoulderHW + geom.elbowOutset,
    elY: shldY + 40,
    wrLX: cx - geom.shoulderHW - geom.wristOutset,
    wrRX: cx + geom.shoulderHW + geom.wristOutset,
    wrY: shldY + 40 + 28,
    handCY: shldY + 40 + 28 + geom.handH / 2,
    legLX: cx - geom.legSpread,
    legRX: cx + geom.legSpread,
    isDigi: false,
    digiKneeY: kneeY - 18,
    digiAnkleY: ankleY - 12,
  };

  return { geom, spriteState, skinColor: '#f4d5b0' };
}

describe('svgToGltf', () => {
  it('produces valid glTF 2.0 JSON', () => {
    const opts = makeTestFixture();
    const json = convertSvgToGltf(opts);
    const gltf = JSON.parse(json);

    expect(gltf.asset).toBeDefined();
    expect(gltf.asset.version).toBe('2.0');
    expect(gltf.asset.generator).toContain('SVG-to-glTF');
  });

  it('contains exactly 7 meshes (head, neck, torso, 2 arms, 2 legs)', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.meshes).toHaveLength(7);

    const names = gltf.meshes.map((m: { name: string }) => m.name);
    expect(names).toContain('Head');
    expect(names).toContain('Neck');
    expect(names).toContain('Torso');
    expect(names).toContain('Arm_left');
    expect(names).toContain('Arm_right');
    expect(names).toContain('Leg_left');
    expect(names).toContain('Leg_right');
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

  it('has 7 materials with skin color', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.materials).toHaveLength(7);
    // All materials should have baseColorFactor
    for (const mat of gltf.materials) {
      expect(mat.pbrMetallicRoughness.baseColorFactor).toHaveLength(4);
      expect(mat.pbrMetallicRoughness.metallicFactor).toBe(0);
    }
  });

  it('has embedded data-URI buffers (self-contained)', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.buffers.length).toBeGreaterThan(0);
    for (const buf of gltf.buffers) {
      expect(buf.uri).toMatch(/^data:application\/octet-stream;base64,/);
      expect(buf.byteLength).toBeGreaterThan(0);
    }
  });

  it('has one scene with root children', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    expect(gltf.scenes).toHaveLength(1);
    expect(gltf.scenes[0].nodes.length).toBeGreaterThan(0);
  });

  it('all position accessors have valid min/max bounds', () => {
    const gltf = JSON.parse(convertSvgToGltf(makeTestFixture()));
    for (const acc of gltf.accessors) {
      if (acc.type === 'VEC3') {
        expect(acc.min).toHaveLength(3);
        expect(acc.max).toHaveLength(3);
        for (let i = 0; i < 3; i++) {
          expect(acc.min[i]).toBeLessThanOrEqual(acc.max[i]);
        }
      }
    }
  });
});
