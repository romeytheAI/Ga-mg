import { describe, it, expect } from 'vitest';
import { tickBiology, attemptConception } from '../../src/sim/BiologySystem';
import { initialState } from '../../src/state/initialState';

describe('BiologySystem', () => {
  it('should progress fertility cycle correctly', () => {
    let state = { ...initialState };
    state.player.biology.cycle_day = 14; // Near ovulation
    
    const nextBio = tickBiology(state, 24); // Pass 1 day
    expect(nextBio.cycle_day).toBe(15);
    expect(nextBio.fertility_cycle).toBe('ovulatory');
  });

  it('should progress incubations', () => {
    let state = { ...initialState };
    state.player.biology.incubations = [{
      type: 'Humanoid',
      progress: 0,
      days_remaining: 10
    }];
    
    const nextBio = tickBiology(state, 24); // Pass 1 day
    expect(nextBio.incubations[0].days_remaining).toBe(9);
    expect(nextBio.incubations[0].progress).toBeGreaterThan(0);
  });
  it('should decrease lactation over time', () => {
    let state = { ...initialState };
    state.player.biology.lactation_level = 10;
    
    const nextBio = tickBiology(state, 24); // Pass 1 day
    expect(nextBio.lactation_level).toBe(9.5); // 10 - 0.5 * 1
  });

  it('should decrease parasite duration and remove them when finished', () => {
    let state = { ...initialState };
    state.player.biology.parasites = [{
      type: 'Tentacle',
      days_left: 1
    }] as any;
    
    const nextBio = tickBiology(state, 24); // Pass 1 day
    expect(nextBio.parasites.length).toBe(0); // Removed because days_left goes to 0
  });

  it('should test different fertility cycle phases', () => {
    let state = { ...initialState };
    state.player.biology.cycle_day = 1;
    const bio1 = tickBiology(state, 0); // 1, menstrual
    expect(bio1.fertility_cycle).toBe('menstrual');
    expect(bio1.fertility).toBe(0.01);

    state.player.biology.cycle_day = 6;
    const bio2 = tickBiology(state, 0); // 6, follicular
    expect(bio2.fertility_cycle).toBe('follicular');
    expect(bio2.fertility).toBe(0.1);

    state.player.biology.cycle_day = 20;
    const bio3 = tickBiology(state, 0); // 20, luteal
    expect(bio3.fertility_cycle).toBe('luteal');
    expect(bio3.fertility).toBe(0.1);
  });

  describe('attemptConception', () => {
    it('returns an Incubation if successful', () => {
      const originalRandom = Math.random;
      Math.random = () => 0.05; // 5% chance, less than chance
      
      try {
        let state = { ...initialState };
        state.player.biology.fertility = 0.5;
        const result = attemptConception(state, 1.0); // chance = 0.5 * 1.0 = 0.5
        
        expect(result).not.toBeNull();
        expect(result?.type).toBe('Humanoid');
        expect(result?.days_remaining).toBe(28);
      } finally {
        Math.random = originalRandom;
      }
    });

    it('returns null if unsuccessful', () => {
      const originalRandom = Math.random;
      Math.random = () => 0.95; // 95% chance, greater than chance
      
      try {
        let state = { ...initialState };
        state.player.biology.fertility = 0.5;
        const result = attemptConception(state, 1.0); // chance = 0.5 * 1.0 = 0.5
        
        expect(result).toBeNull();
      } finally {
        Math.random = originalRandom;
      }
    });
  });
});
