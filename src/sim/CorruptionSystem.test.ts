import { describe, it, expect } from 'vitest';
import { 
  defaultCorruptionState, 
  tickCorruptionState, 
  applyStress, 
  applyTrauma, 
  applyCorruption, 
  restoreWillpower,
  corruptionLabel,
  stressLabel,
  hasBreakdown,
  isWillBroken
} from './CorruptionSystem';
import { SimNpc } from './types';

describe('CorruptionSystem', () => {
  describe('defaultCorruptionState', () => {
    it('returns a default corruption state', () => {
      const state = defaultCorruptionState();
      expect(state.corruption).toBe(0);
      expect(state.purity).toBe(100);
      expect(state.willpower).toBe(70);
    });
  });

  describe('tickCorruptionState', () => {
    it('applies passive decay and recovery', () => {
      const npc = {
        traits: [],
        current_state: 'idle',
        corruption_state: {
          corruption: 0,
          purity: 100,
          willpower: 50,
          stress: 50,
          trauma: 50,
          control: 50,
          submission: 0
        }
      } as unknown as SimNpc;
      
      const nextState = tickCorruptionState(npc, 1);
      
      // stress decay: 50 - 0.5 * 1 * 1.5 = 49.25
      expect(nextState.stress).toBeCloseTo(49.25);
      
      // trauma decay: 50 - 0.02 * 1 = 49.98
      expect(nextState.trauma).toBeCloseTo(49.98);
      
      // willpower recovery: 0.2 * 1 * (1 - 50/200) = 0.15
      expect(nextState.willpower).toBeCloseTo(50.15);
      
      // control recovery: 0.3 * 1 * (1 - 50/200) = 0.225
      expect(nextState.control).toBeCloseTo(50.225);
    });

    it('erodes purity if corruption is high', () => {
      const npc = {
        traits: [],
        current_state: 'working',
        corruption_state: {
          corruption: 50,
          purity: 100,
          willpower: 50,
          stress: 0,
          trauma: 0,
          control: 50,
          submission: 0
        }
      } as unknown as SimNpc;
      
      const nextState = tickCorruptionState(npc, 1);
      // purityLoss = (50 / 100) * 0.1 * 1 = 0.05
      expect(nextState.purity).toBeCloseTo(99.95);
    });

    it('applies trait modifiers', () => {
      const npc = {
        traits: ['brave', 'paranoid'],
        current_state: 'idle',
        corruption_state: defaultCorruptionState()
      } as unknown as SimNpc;
      
      const nextState = tickCorruptionState(npc, 1);
      
      // brave adds willpower (+0.03) and control (+0.02)
      // paranoid adds stress (+0.04) and trauma (+0.01)
      expect(nextState.willpower).toBeCloseTo(70.22075); // baseline 70 + passive 0.19075 + 0.03
      expect(nextState.trauma).toBeCloseTo(0.01);
    });
  });

  describe('applyStress', () => {
    it('applies stress reduced by willpower', () => {
      const state = defaultCorruptionState();
      state.willpower = 100; // 100 / 200 = 0.5 reduction
      const nextState = applyStress(state, 20);
      
      // reduced = 20 * 0.5 = 10
      expect(nextState.stress).toBeCloseTo(20); // 10 + 10
      expect(nextState.control).toBeCloseTo(77); // 80 - 10 * 0.3
    });
  });

  describe('applyTrauma', () => {
    it('applies trauma reduced by willpower', () => {
      const state = defaultCorruptionState();
      state.willpower = 100; // 100 / 300 = 1/3 reduction
      const nextState = applyTrauma(state, 30);
      
      // reduced = 30 * (2/3) = 20
      expect(nextState.trauma).toBeCloseTo(20); // 0 + 20
      expect(nextState.stress).toBeCloseTo(20); // 10 + 20 * 0.5
      expect(nextState.willpower).toBeCloseTo(96); // 100 - 20 * 0.2
    });
  });

  describe('applyCorruption', () => {
    it('applies corruption reduced by purity', () => {
      const state = defaultCorruptionState();
      state.purity = 100; // 100 / 200 = 0.5 resistance
      const nextState = applyCorruption(state, 20);
      
      // reduced = 20 * 0.5 = 10
      expect(nextState.corruption).toBeCloseTo(10); // 0 + 10
      expect(nextState.purity).toBeCloseTo(95); // 100 - 10 * 0.5
    });
  });

  describe('restoreWillpower', () => {
    it('increases willpower within bounds', () => {
      const state = defaultCorruptionState();
      state.willpower = 50;
      const nextState = restoreWillpower(state, 20);
      expect(nextState.willpower).toBe(70);
      
      const maxState = restoreWillpower(state, 100);
      expect(maxState.willpower).toBe(100);
    });
  });

  describe('labels and states', () => {
    it('returns correct corruption label', () => {
      expect(corruptionLabel(95)).toBe('Utterly Corrupt');
      expect(corruptionLabel(75)).toBe('Deeply Corrupt');
      expect(corruptionLabel(55)).toBe('Corrupted');
      expect(corruptionLabel(35)).toBe('Tainted');
      expect(corruptionLabel(15)).toBe('Slightly Tainted');
      expect(corruptionLabel(5)).toBe('Pure');
    });

    it('returns correct stress label', () => {
      expect(stressLabel(85)).toBe('Breaking');
      expect(stressLabel(65)).toBe('Overwhelmed');
      expect(stressLabel(45)).toBe('Anxious');
      expect(stressLabel(25)).toBe('Uneasy');
      expect(stressLabel(5)).toBe('Calm');
    });

    it('identifies breakdown', () => {
      const state = defaultCorruptionState();
      state.stress = 95;
      state.control = 5;
      expect(hasBreakdown(state)).toBe(true);
    });

    it('identifies broken will', () => {
      const state = defaultCorruptionState();
      state.willpower = 0;
      state.stress = 80;
      expect(isWillBroken(state)).toBe(true);
    });
  });
});
