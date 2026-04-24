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
          { time: 2, rotation: [0.03, 0, 0, 0.9995] }, // Subtler deep breathing
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Spine',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 2, rotation: [0.015, 0, 0, 0.9999] }, // Spine curvature
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Hips',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1], translation: [0, 0, 0] },
          { time: 2, rotation: [0, 0, 0.02, 0.9998], translation: [0, -0.05, 0] }, // Weight shifting
          { time: 4, rotation: [0, 0, 0, 1], translation: [0, 0, 0] },
        ]
      },
      {
        boneName: 'Bone_Head',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 1.5, rotation: [0.02, 0.03, 0, 0.999] }, // Natural wandering gaze
          { time: 3.5, rotation: [-0.01, -0.02, 0, 0.999] },
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Arm_L',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 2, rotation: [0, 0, 0.05, 0.998] }, // Slight arm sway out
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Elbow_L',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 2, rotation: [0.05, 0, 0, 0.998] }, // Relaxed elbow
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Arm_R',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 2, rotation: [0, 0, -0.05, 0.998] },
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Elbow_R',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 2, rotation: [0.05, 0, 0, 0.998] }, // Relaxed elbow
          { time: 4, rotation: [0, 0, 0, 1] },
        ]
      }
    ]
  },
  walk: {
    name: 'walk',
    duration: 1.2,
    bones: [
      {
        boneName: 'Bone_Leg_L',
        keyframes: [
          { time: 0, rotation: [0.3, 0, 0, 0.95] }, // Forward
          { time: 0.6, rotation: [-0.2, 0, 0, 0.98] }, // Back
          { time: 1.2, rotation: [0.3, 0, 0, 0.95] },
        ]
      },
      {
        boneName: 'Bone_Knee_L',
        keyframes: [
          { time: 0, rotation: [0.1, 0, 0, 0.995] }, // Slightly bent when forward
          { time: 0.3, rotation: [0.4, 0, 0, 0.91] }, // Lift leg
          { time: 0.6, rotation: [0.05, 0, 0, 0.998] }, // Straight when back
          { time: 1.2, rotation: [0.1, 0, 0, 0.995] },
        ]
      },
      {
        boneName: 'Bone_Leg_R',
        keyframes: [
          { time: 0, rotation: [-0.2, 0, 0, 0.98] }, // Back
          { time: 0.6, rotation: [0.3, 0, 0, 0.95] }, // Forward
          { time: 1.2, rotation: [-0.2, 0, 0, 0.98] },
        ]
      },
      {
        boneName: 'Bone_Knee_R',
        keyframes: [
          { time: 0, rotation: [0.05, 0, 0, 0.998] }, // Straight when back
          { time: 0.6, rotation: [0.1, 0, 0, 0.995] }, // Slightly bent when forward
          { time: 0.9, rotation: [0.4, 0, 0, 0.91] }, // Lift leg
          { time: 1.2, rotation: [0.05, 0, 0, 0.998] },
        ]
      },
      {
        boneName: 'Bone_Arm_L',
        keyframes: [
          { time: 0, rotation: [-0.2, 0, 0, 0.98] }, // Back
          { time: 0.6, rotation: [0.2, 0, 0, 0.98] }, // Forward
          { time: 1.2, rotation: [-0.2, 0, 0, 0.98] },
        ]
      },
      {
        boneName: 'Bone_Elbow_L',
        keyframes: [
          { time: 0, rotation: [0.3, 0, 0, 0.95] }, // Bent when back
          { time: 0.6, rotation: [0.1, 0, 0, 0.995] }, // Straight when forward
          { time: 1.2, rotation: [0.3, 0, 0, 0.95] },
        ]
      },
      {
        boneName: 'Bone_Arm_R',
        keyframes: [
          { time: 0, rotation: [0.2, 0, 0, 0.98] }, // Forward
          { time: 0.6, rotation: [-0.2, 0, 0, 0.98] }, // Back
          { time: 1.2, rotation: [0.2, 0, 0, 0.98] },
        ]
      },
      {
        boneName: 'Bone_Elbow_R',
        keyframes: [
          { time: 0, rotation: [0.1, 0, 0, 0.995] }, // Straight when forward
          { time: 0.6, rotation: [0.3, 0, 0, 0.95] }, // Bent when back
          { time: 1.2, rotation: [0.1, 0, 0, 0.995] },
        ]
      },
      {
        boneName: 'Bone_Chest',
        keyframes: [
          { time: 0, rotation: [0, 0.05, 0, 0.998] }, // Sway
          { time: 0.6, rotation: [0, -0.05, 0, 0.998] },
          { time: 1.2, rotation: [0, 0.05, 0, 0.998] },
        ]
      }
    ]
  },
  combat_strike: {
    name: 'combat_strike',
    duration: 0.8,
    bones: [
      {
        boneName: 'Bone_Arm_R',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.2, rotation: [-0.4, 0.2, 0, 0.89] }, // Wind up
          { time: 0.4, rotation: [0.7, -0.2, 0, 0.69] }, // Strike forward
          { time: 0.8, rotation: [0, 0, 0, 1] }, // Return
        ]
      },
      {
        boneName: 'Bone_Chest',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.2, rotation: [0, 0.2, 0, 0.98] }, // Twist back
          { time: 0.4, rotation: [0, -0.3, 0, 0.95] }, // Thrust forward
          { time: 0.8, rotation: [0, 0, 0, 1] },
        ]
      }
    ]
  },
  combat_block: {
    name: 'combat_block',
    duration: 1.0,
    bones: [
      {
        boneName: 'Bone_Arm_L',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.2, rotation: [0.5, 0.5, 0, 0.7] }, // Raise arm to face
          { time: 0.8, rotation: [0.5, 0.5, 0, 0.7] }, // Hold
          { time: 1.0, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Chest',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.2, rotation: [0.1, 0, 0, 0.995] }, // Brace impact
          { time: 0.8, rotation: [0.1, 0, 0, 0.995] },
          { time: 1.0, rotation: [0, 0, 0, 1] },
        ]
      }
    ]
  },
  damaged: {
    name: 'damaged',
    duration: 0.6,
    bones: [
      {
        boneName: 'Bone_Chest',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.1, rotation: [-0.3, 0, 0, 0.95] }, // Flinch backwards
          { time: 0.3, rotation: [-0.1, 0, 0, 0.99] }, // Recover
          { time: 0.6, rotation: [0, 0, 0, 1] },
        ]
      },
      {
        boneName: 'Bone_Head',
        keyframes: [
          { time: 0, rotation: [0, 0, 0, 1] },
          { time: 0.1, rotation: [0.4, 0, 0, 0.91] }, // Head snaps back
          { time: 0.6, rotation: [0, 0, 0, 1] },
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
    const times = bone.keyframes.map(k => k.time);

    if (bone.keyframes.some(k => k.rotation)) {
      const values = bone.keyframes.flatMap(k => k.rotation || [0, 0, 0, 1]);
      tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.boneName}.quaternion`, times, values));
    }

    if (bone.keyframes.some(k => k.translation)) {
      const values = bone.keyframes.flatMap(k => k.translation || [0, 0, 0]);
      tracks.push(new THREE.VectorKeyframeTrack(`${bone.boneName}.position`, times, values));
    }

    if (bone.keyframes.some(k => k.scale)) {
      const values = bone.keyframes.flatMap(k => k.scale || [1, 1, 1]);
      tracks.push(new THREE.VectorKeyframeTrack(`${bone.boneName}.scale`, times, values));
    }
  }

  return new THREE.AnimationClip(anim.name, anim.duration, tracks);
}
