import { describe, it, expect } from 'vitest';
import { tickCivilization, getActiveLaws } from './CivilizationSystem';
import { SimWorld, GovernmentState, FactionId } from './types';

function createMockWorld(governments: GovernmentState[], faction_hierarchies: Record<FactionId, any> = {} as any): SimWorld {
  return {
    faction_hierarchies,
    civilization: {
      governments,
      supply_chains: { nodes: [], routes: [] },
      knowledge: { global_known_facts: [], individual_knowledge: {} },
      daedric_influence: {},
      realms: [],
      active_deceptions: []
    }
  } as unknown as SimWorld;
}

describe('CivilizationSystem', () => {
  describe('tickCivilization', () => {
    it('increases treasury based on stability and tax rate', () => {
      const gov: GovernmentState = {
        faction_id: 'town_guard',
        capital_id: 'loc1',
        stability: 100,
        treasury: 1000,
        policies: [
          { id: 'tax1', tax_rate: 0.1 } as any,
          { id: 'tax2', tax_rate: 0.05 } as any
        ],
        corruption_level: 0
      };

      const world = createMockWorld([gov]);
      const nextWorld = tickCivilization(world);

      const nextGov = nextWorld.civilization.governments[0];
      // base tax rate (0.05) + 0.1 + 0.05 = 0.2 total
      // taxIncome = 100 * 0.2 * (100 / 100) = 20
      expect(nextGov.treasury).toBe(1020);
    });

    it('drifts stability towards baseline (70) adjusted by corruption and treasury', () => {
      const gov: GovernmentState = {
        faction_id: 'town_guard',
        capital_id: 'loc1',
        stability: 50,
        treasury: 2000, // treasuryBonus = min(20, 2) = 2
        policies: [],
        corruption_level: 10 // corruptionPenalty = 10 * 0.2 = 2
      };

      const world = createMockWorld([gov]);
      const nextWorld = tickCivilization(world);

      const nextGov = nextWorld.civilization.governments[0];
      // targetStability = 70 - 2 + 2 = 70
      expect(nextGov.stability).toBeCloseTo(51, 0);
    });

    it('enacts martial law if stability is very low', () => {
      const gov: GovernmentState = {
        faction_id: 'town_guard',
        capital_id: 'loc1',
        stability: 30, // < 40 triggers martial law
        treasury: 1000,
        policies: [],
        corruption_level: 0
      };

      const world = createMockWorld([gov]);
      const nextWorld = tickCivilization(world);

      const nextGov = nextWorld.civilization.governments[0];
      expect(nextGov.policies.length).toBe(1);
      expect(nextGov.policies[0].id).toBe('martial_law');
    });

    it('does not enact martial law if already active', () => {
      const gov: GovernmentState = {
        faction_id: 'town_guard',
        capital_id: 'loc1',
        stability: 30,
        treasury: 1000,
        policies: [{ id: 'martial_law' } as any],
        corruption_level: 0
      };

      const world = createMockWorld([gov]);
      const nextWorld = tickCivilization(world);

      const nextGov = nextWorld.civilization.governments[0];
      expect(nextGov.policies.length).toBe(1); // Still 1
    });
  });

  describe('getActiveLaws', () => {
    it('returns policies for the government controlling the location', () => {
      const gov: GovernmentState = {
        faction_id: 'nobility',
        capital_id: 'loc1',
        stability: 100,
        treasury: 1000,
        policies: [{ id: 'law1' } as any],
        corruption_level: 0
      };

      const world = createMockWorld([gov], {
        'nobility': { territories: ['loc1', 'loc2'] }
      } as any);

      const laws = getActiveLaws(world, 'loc2');
      expect(laws.length).toBe(1);
      expect(laws[0].id).toBe('law1');
    });

    it('returns empty array if location has no governing faction', () => {
      const gov: GovernmentState = {
        faction_id: 'nobility',
        capital_id: 'loc1',
        stability: 100,
        treasury: 1000,
        policies: [{ id: 'law1' } as any],
        corruption_level: 0
      };

      const world = createMockWorld([gov], {
        'nobility': { territories: ['loc1', 'loc2'] }
      } as any);

      const laws = getActiveLaws(world, 'loc3');
      expect(laws.length).toBe(0);
    });
  });
});
