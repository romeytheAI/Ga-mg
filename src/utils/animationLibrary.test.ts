import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { convertToAnimationClip, AetheriusAnimation } from './animationLibrary';

describe('animationLibrary', () => {
  it('converts an AetheriusAnimation with rotations into a THREE.AnimationClip', () => {
    const mockAnim: AetheriusAnimation = {
      name: 'test_anim',
      duration: 2.0,
      bones: [
        {
          boneName: 'Bone_Chest',
          keyframes: [
            { time: 0, rotation: [0, 0, 0, 1] },
            { time: 1, rotation: [0, 1, 0, 0] },
            { time: 2, rotation: [0, 0, 0, 1] },
          ]
        }
      ]
    };

    const clip = convertToAnimationClip(mockAnim);

    expect(clip).toBeInstanceOf(THREE.AnimationClip);
    expect(clip.name).toBe('test_anim');
    expect(clip.duration).toBe(2.0);
    expect(clip.tracks.length).toBe(1);

    const track = clip.tracks[0];
    expect(track.name).toBe('Bone_Chest.quaternion');
    expect(track.times).toEqual(new Float32Array([0, 1, 2]));
    expect(Array.from(track.values)).toEqual([
      0, 0, 0, 1,
      0, 1, 0, 0,
      0, 0, 0, 1
    ]);
  });

  it('handles animations with translation and scale', () => {
    const mockAnim: AetheriusAnimation = {
      name: 'test_transform',
      duration: 1.0,
      bones: [
        {
          boneName: 'Bone_Root',
          keyframes: [
            { time: 0, translation: [0, 0, 0], scale: [1, 1, 1] },
            { time: 1, translation: [0, 10, 0], scale: [2, 2, 2] },
          ]
        }
      ]
    };

    const clip = convertToAnimationClip(mockAnim);

    expect(clip.tracks.length).toBe(2);
    
    const posTrack = clip.tracks.find(t => t.name === 'Bone_Root.position');
    expect(posTrack).toBeDefined();
    expect(Array.from(posTrack!.values)).toEqual([0, 0, 0, 0, 10, 0]);

    const scaleTrack = clip.tracks.find(t => t.name === 'Bone_Root.scale');
    expect(scaleTrack).toBeDefined();
    expect(Array.from(scaleTrack!.values)).toEqual([1, 1, 1, 2, 2, 2]);
  });
});
