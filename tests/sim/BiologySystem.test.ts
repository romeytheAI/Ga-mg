import { describe, it, expect } from 'vitest';
import { tickBiology } from '../../src/sim/BiologySystem';
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
});
