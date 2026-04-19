import * as THREE from 'three';

/**
 * AnimationLibrary — high-end skeletal keyframes for Aetherius.
 * Defined in a format that can be converted to THREE.AnimationClip.
 */

export interface AnimationKeyframe {
  time: number;
  translation?: [number, number, number];
  rotation?: [number, number, number, number]; // Quaternion [x,y,z,w]
  scale?: [number, number, number];
}

export interface BoneAnimation {
  boneName: string;
  keyframes: AnimationKeyframe[];
}

export interface AetheriusAnimation {
  name: string;
  duration: number;
  bones: BoneAnimation[];
}

export const ANIMATION_LIBRARY: Record<string, AetheriusAnimation> = {
  idle: {
    name: 'idle',
    duration: 4,
    bones: [
      {
        boneName: 'Bone_Chest',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 2, rotation: [0.02, 0, 0, 0.999] }, // Slight breathing
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Head',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 1.5, rotation: [0.01, 0.02, 0, 0.999] }, // Subtle tilt
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      }
    ]
  },
  spellcast: {
    name: 'spellcast',
    duration: 2,
    bones: [
      {
        boneName: 'Bone_Arm_L',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.5, rotation: [0.3, 0.5, 0, 0.8] }, // Raise arm
          { time: 1.5, rotation: [0.3, 0.5, 0, 0.8] },
          { time: 2, rotation: [0, 0, 0, 1] },
        ]
      }
    ]
  }
};

/**
 * Convert AetheriusAnimation to THREE.AnimationClip.
 */
export function convertToAnimationClip(anim: AetheriusAnimation): THREE.AnimationClip {
  const tracks: THREE.KeyframeTrack[] = [];

  for (const bone of anim.bones) {
    if (bone.keyframes.some(k => k.rotation)) {
      const times = bone.keyframes.map(k => k.time);
      const values = bone.keyframes.flatMap(k => k.rotation || [0, 0, 0, 1]);
      tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.boneName}.quaternion`, times, values));
    }
  }

  return new THREE.AnimationClip(anim.name, anim.duration, tracks);
}
