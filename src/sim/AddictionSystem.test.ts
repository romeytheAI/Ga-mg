import { describe, it, expect } from 'vitest';
import {
  defaultAddictionState,
  useSubstance,
  tickAddiction,
  withdrawalStress,
  withdrawalStaminaDrain,
  dependencyLabel,
  withdrawalLabel
} from './AddictionSystem';

describe('AddictionSystem', () => {
  it('should initialize default state', () => {
    const state = defaultAddictionState();
    expect(state.addictions.length).toBe(0);
    expect(state.overall_dependency).toBe(0);
  });

  describe('useSubstance', () => {
    it('should add a new substance and calculate effects', () => {
      const state = defaultAddictionState();
      const result = useSubstance(state, 'moonsugar', 1);

      expect(result.stress_relief).toBe(25);
      expect(result.energy_boost).toBe(10);
      expect(result.corruption_risk).toBe(5);

      const entry = result.addiction_state.addictions[0];
      expect(entry.substance).toBe('moonsugar');
      expect(entry.dependency).toBe(6);
      expect(entry.tolerance).toBe(2);
      expect(entry.total_uses).toBe(1);
    });

    it('should reduce effectiveness with tolerance', () => {
      let state = defaultAddictionState();
      // Use multiple times to build tolerance
      for (let i = 0; i < 10; i++) {
        state = useSubstance(state, 'moonsugar', i).addiction_state;
      }

      const result = useSubstance(state, 'moonsugar', 10);
      const tolerance = state.addictions[0].tolerance;
      const expectedFactor = 1 - (tolerance / 150);

      expect(result.stress_relief).toBeCloseTo(25 * expectedFactor);
      expect(result.energy_boost).toBeCloseTo(10 * expectedFactor);
    });
  });

  describe('tickAddiction', () => {
    it('should increase withdrawal if dependency is high and enough time passed', () => {
      const state = defaultAddictionState();
      let usedState = useSubstance(state, 'skooma', 1).addiction_state;
      // skooma dependency = 10, let's use it twice to get 20
      usedState = useSubstance(usedState, 'skooma', 2).addiction_state; // dependency = 20

      // Tick past withdrawal onset (24 turns)
      const nextState = tickAddiction(usedState, 30, 1);
      const entry = nextState.addictions[0];
      expect(entry.withdrawal).toBeGreaterThan(0);
    });

    it('should naturally recover from dependency and tolerance if very long time passed', () => {
      const state = defaultAddictionState();
      let usedState = useSubstance(state, 'skooma', 1).addiction_state;

      // Tick way past onset * 3 (24 * 3 = 72 turns)
      const nextState = tickAddiction(usedState, 100, 10);
      const entry = nextState.addictions[0];

      // 10 dependency originally - (0.1 * 10) = 9
      expect(entry.dependency).toBe(9);
      // 2 tolerance originally - (0.05 * 10) = 1.5
      expect(entry.tolerance).toBe(1.5);
    });

    it('should reduce withdrawal if dependency is very low', () => {
      const state = defaultAddictionState();
      let usedState = useSubstance(state, 'alcohol', 1).addiction_state;
      // alcohol dependency = 3
      // artificially set withdrawal
      usedState.addictions[0].withdrawal = 10;

      const nextState = tickAddiction(usedState, 30, 1);
      const entry = nextState.addictions[0];

      // 10 - (1 * 1) = 9
      expect(entry.withdrawal).toBe(9);
    });

    it('should prune clean entries', () => {
      const state = defaultAddictionState();
      let usedState = useSubstance(state, 'alcohol', 1).addiction_state;
      // alcohol dependency = 3

      const nextState = tickAddiction(usedState, 100, 40);
      // dependency drops by 0.1 * 40 = 4, so it goes to 0
      // withdrawal goes to 0
      expect(nextState.addictions.length).toBe(0);
    });
  });

  describe('withdrawal effects', () => {
    it('should calculate stress from withdrawal', () => {
      const state = defaultAddictionState();
      state.addictions.push({
        substance: 'skooma', dependency: 20, tolerance: 0, withdrawal: 50, last_use_turn: 0, total_uses: 1
      });
      expect(withdrawalStress(state)).toBe(15); // 50 * 0.3
      expect(withdrawalStaminaDrain(state)).toBe(5); // 50 * 0.1
    });

    it('should cap stress at 50', () => {
      const state = defaultAddictionState();
      state.addictions.push({
        substance: 'skooma', dependency: 20, tolerance: 0, withdrawal: 100, last_use_turn: 0, total_uses: 1
      });
      state.addictions.push({
        substance: 'moonsugar', dependency: 20, tolerance: 0, withdrawal: 100, last_use_turn: 0, total_uses: 1
      });
      expect(withdrawalStress(state)).toBe(50); // 200 * 0.3 = 60 capped to 50
    });
  });

  describe('labels', () => {
    it('returns correct dependency labels', () => {
      expect(dependencyLabel(90)).toBe('Crippling');
      expect(dependencyLabel(70)).toBe('Severe');
      expect(dependencyLabel(50)).toBe('Moderate');
      expect(dependencyLabel(30)).toBe('Mild');
      expect(dependencyLabel(10)).toBe('Slight');
      expect(dependencyLabel(0)).toBe('Clean');
    });

    it('returns correct withdrawal labels', () => {
      expect(withdrawalLabel(90)).toBe('Agonizing');
      expect(withdrawalLabel(70)).toBe('Severe');
      expect(withdrawalLabel(50)).toBe('Painful');
      expect(withdrawalLabel(30)).toBe('Uncomfortable');
      expect(withdrawalLabel(10)).toBe('Mild');
      expect(withdrawalLabel(0)).toBe('None');
    });
  });
});
