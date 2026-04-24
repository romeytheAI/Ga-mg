import { describe, it, expect } from 'vitest';
import {
  decayNeeds,
  needUrgency,
  mostUrgentNeed,
  hasNeedCrisis,
  computeHappinessDelta,
  applyActivityEffect,
  tickPlayerNeeds
} from './NeedsSystem';
import { NpcNeeds } from './types';

describe('NeedsSystem', () => {
  const baseNeeds: NpcNeeds = {
    hunger: 100,
    energy: 100,
    social: 100,
    happiness: 100,
    wealth: 50,
  };

  describe('decayNeeds', () => {
    it('decays needs correctly based on hours', () => {
      const npc: any = { needs: { ...baseNeeds }, traits: [] };
      const newNeeds = decayNeeds(npc, 2);
      expect(newNeeds.hunger).toBe(94); // 100 - (3 * 2)
      expect(newNeeds.energy).toBe(95); // 100 - (2.5 * 2)
      expect(newNeeds.social).toBe(97); // 100 - (1.5 * 2)
      expect(newNeeds.happiness).toBe(98.4); // 100 - (0.8 * 2)
      expect(newNeeds.wealth).toBe(50); // Wealth does not decay
    });

    it('applies trait modifiers to decay rates', () => {
      const npc: any = { needs: { ...baseNeeds }, traits: ['greedy', 'cowardly'] };
      const newNeeds = decayNeeds(npc, 1);
      // greedy: happiness 1.3
      // cowardly: energy 1.2
      expect(newNeeds.happiness).toBeCloseTo(98.96); // 100 - (0.8 * 1.3) = 98.96
      expect(newNeeds.energy).toBe(97); // 100 - (2.5 * 1.2) = 97
    });

    it('clamps needs between 0 and 100', () => {
      const lowNeeds: NpcNeeds = { hunger: 2, energy: 1, social: 1, happiness: 1, wealth: 50 };
      const npc: any = { needs: lowNeeds, traits: [] };
      const newNeeds = decayNeeds(npc, 5);
      expect(newNeeds.hunger).toBe(0);
      expect(newNeeds.energy).toBe(0);
    });
  });

  describe('needUrgency', () => {
    it('returns higher score for lower values', () => {
      expect(needUrgency(10)).toBe(0.81); // ((100-10)/100)^2 = 0.9^2 = 0.81
      expect(needUrgency(50)).toBe(0.25);
      expect(needUrgency(100)).toBe(0);
    });
  });

  describe('mostUrgentNeed', () => {
    it('identifies the most urgent core need', () => {
      const needs: NpcNeeds = { ...baseNeeds, hunger: 20, energy: 80, social: 10 };
      expect(mostUrgentNeed(needs)).toBe('social'); // 10 is lower than 20
    });
  });

  describe('hasNeedCrisis', () => {
    it('returns true if hunger is below 15', () => {
      expect(hasNeedCrisis({ ...baseNeeds, hunger: 14 })).toBe(true);
    });

    it('returns true if energy is below 10', () => {
      expect(hasNeedCrisis({ ...baseNeeds, energy: 9 })).toBe(true);
    });

    it('returns false if neither is critical', () => {
      expect(hasNeedCrisis({ ...baseNeeds, hunger: 20, energy: 20 })).toBe(false);
    });
  });

  describe('computeHappinessDelta', () => {
    it('returns positive delta for high core needs', () => {
      const needs = { hunger: 100, energy: 100, social: 100 } as NpcNeeds;
      expect(computeHappinessDelta(needs)).toBe(2); // (100 - 50) * 0.04 = 2
    });

    it('returns negative delta for low core needs', () => {
      const needs = { hunger: 10, energy: 10, social: 10 } as NpcNeeds;
      expect(computeHappinessDelta(needs)).toBe(-1.6); // (10 - 50) * 0.04 = -1.6
    });
  });

  describe('applyActivityEffect', () => {
    it('increases hunger and happiness for eating', () => {
      const needs = applyActivityEffect({ ...baseNeeds, hunger: 10, happiness: 50 }, 'eating', 1);
      expect(needs.hunger).toBe(40);
      expect(needs.happiness).toBe(55);
    });

    it('restores energy for sleeping', () => {
      const needs = applyActivityEffect({ ...baseNeeds, energy: 10 }, 'sleeping', 2);
      expect(needs.energy).toBe(80); // 10 + 70
    });

    it('decreases energy and increases wealth for working', () => {
      const needs = applyActivityEffect({ ...baseNeeds, energy: 50, wealth: 10 }, 'working', 2);
      expect(needs.energy).toBe(30); // 50 - 20
      expect(needs.wealth).toBe(40); // 10 + 30
    });

    it('clamps values at limits', () => {
      const needs = applyActivityEffect({ ...baseNeeds, energy: 10 }, 'working', 10);
      expect(needs.energy).toBe(0);
    });
  });

  describe('tickPlayerNeeds', () => {
    it('applies passive drain based on idle activity', () => {
      const state: any = {
        player: { life_sim: { needs: { hunger: 50, thirst: 50, energy: 50, hygiene: 50, social: 50, happiness: 50 }, schedule: { current_activity: 'idle' } } },
        world: { last_intent: 'neutral' }
      };
      const newNeeds = tickPlayerNeeds(state, 1);
      expect(newNeeds.hunger).toBe(47); // 50 - 3
      expect(newNeeds.thirst).toBe(46); // 50 - 4
      expect(newNeeds.energy).toBe(47.5); // 50 - 2.5
    });

    it('applies modifiers for working', () => {
      const state: any = {
        player: { life_sim: { needs: { hunger: 50, thirst: 50, energy: 50, hygiene: 50, social: 50, happiness: 50 }, schedule: { current_activity: 'working' } } },
        world: { last_intent: 'neutral' }
      };
      const newNeeds = tickPlayerNeeds(state, 1);
      expect(newNeeds.hunger).toBe(45); // 50 - (3 + 2)
      expect(newNeeds.energy).toBe(45); // 50 - (2.5 + 2.5)
      expect(newNeeds.hygiene).toBe(47); // 50 - (1.5 + 1.5)
    });

    it('restores energy when sleeping', () => {
      const state: any = {
        player: { life_sim: { needs: { energy: 10 }, schedule: { current_activity: 'sleeping' } } },
        world: { last_intent: 'neutral' }
      };
      const newNeeds = tickPlayerNeeds(state, 1);
      expect(newNeeds.energy).toBe(45); // 10 - (-35)
    });

    it('modifies drain based on intent when idle', () => {
      const state: any = {
        player: { life_sim: { needs: { hunger: 50, energy: 50 }, schedule: { current_activity: 'idle' } } },
        world: { last_intent: 'work' }
      };
      const newNeeds = tickPlayerNeeds(state, 1);
      expect(newNeeds.hunger).toBe(45.5); // 50 - (3 + 1.5)
      expect(newNeeds.energy).toBe(45.5); // 50 - (2.5 + 2)
    });

    it('modifies drain based on social intent when idle', () => {
      const state: any = {
        player: { life_sim: { needs: { social: 50 }, schedule: { current_activity: 'idle' } } },
        world: { last_intent: 'social' }
      };
      const newNeeds = tickPlayerNeeds(state, 1);
      expect(newNeeds.social).toBe(59); // 50 - (1 - 10) = 50 + 9 = 59
    });
  });
});
