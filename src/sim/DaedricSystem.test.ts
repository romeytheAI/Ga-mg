import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tickDaedricPower, getDaedricBleed } from './DaedricSystem';
import { SimWorld, DaedricInfluence, DaedricRealm, DaedricPrinceId } from './types';

function createMockWorld(influence: Record<string, DaedricInfluence>, realms: DaedricRealm[]): SimWorld {
  return {
    global_events: [],
    civilization: {
      daedric_influence: influence,
      realms,
      governments: [
        { id: 'gov1', stability: 100, corruption_level: 10, treasury: 1000 }
      ],
      supply_chains: {
        nodes: [],
        routes: [
          { id: 'route1', efficiency: 1.0, from_node: 'a', to_node: 'b', resource: 'iron', danger: 0 }
        ]
      },
      knowledge: {
        global_known_facts: [],
        individual_knowledge: {
          'npc1': [{ fact_id: 'fact1', confidence: 1.0 }]
        }
      }
    }
  } as unknown as SimWorld;
}

describe('DaedricSystem', () => {
  const originalMathRandom = Math.random;

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  describe('tickDaedricPower', () => {
    it('increases power based on worship and curses', () => {
      const world = createMockWorld({
        'molag_bal': {
          prince_id: 'molag_bal' as DaedricPrinceId,
          power_level: 50,
          current_intent: 'domination',
          worship_base: 1000, // +10
          active_curses: ['c1', 'c2'], // +1
          manifested_avatars: []
        }
      }, []);
      
      const nextWorld = tickDaedricPower(world);
      expect(nextWorld.civilization.daedric_influence['molag_bal'].power_level).toBe(61);
    });

    it('caps power at 100', () => {
      const world = createMockWorld({
        'molag_bal': {
          prince_id: 'molag_bal' as DaedricPrinceId,
          power_level: 95,
          current_intent: 'domination',
          worship_base: 1000,
          active_curses: [],
          manifested_avatars: []
        }
      }, []);
      
      const nextWorld = tickDaedricPower(world);
      expect(nextWorld.civilization.daedric_influence['molag_bal'].power_level).toBe(100);
    });

    it('alters physics_stability for realms', () => {
      const world = createMockWorld({
        'molag_bal': {
          prince_id: 'molag_bal' as DaedricPrinceId,
          power_level: 50,
          current_intent: 'destruction',
          worship_base: 0,
          active_curses: [],
          manifested_avatars: []
        },
        'azura': {
          prince_id: 'azura' as DaedricPrinceId,
          power_level: 50,
          current_intent: 'domination',
          worship_base: 0,
          active_curses: [],
          manifested_avatars: []
        }
      }, [
        { id: '1', name: 'mb', corruption_type: 'none', prince_id: 'molag_bal' as DaedricPrinceId, physics_stability: 50, connected_locations: [] },
        { id: '2', name: 'az', corruption_type: 'none', prince_id: 'azura' as DaedricPrinceId, physics_stability: 50, connected_locations: [] }
      ]);
      
      const nextWorld = tickDaedricPower(world);
      // Molag Bal intent is destruction => -1
      expect(nextWorld.civilization.realms[0].physics_stability).toBe(49);
      // Azura intent is NOT destruction => +0.5
      expect(nextWorld.civilization.realms[1].physics_stability).toBe(50.5);
    });

    describe('applyGodlikeWill', () => {
      beforeEach(() => {
        Math.random = () => 0.05; // Force trigger (0.05 < 0.1)
      });

      it('applies domination intent', () => {
        const world = createMockWorld({
          'molag_bal': {
            prince_id: 'molag_bal' as DaedricPrinceId,
            power_level: 95,
            current_intent: 'domination',
            worship_base: 0,
            active_curses: [],
            manifested_avatars: []
          }
        }, []);
        
        const nextWorld = tickDaedricPower(world);
        const gov = nextWorld.civilization.governments[0];
        expect(gov.stability).toBe(70);
        expect(gov.corruption_level).toBe(30);
        expect(nextWorld.global_events).toContain('MOLAG_BAL has sparked a wave of defiance across the world.');
      });

      it('applies destruction intent', () => {
        const world = createMockWorld({
          'mehrunes_dagon': {
            prince_id: 'mehrunes_dagon' as DaedricPrinceId,
            power_level: 95,
            current_intent: 'destruction',
            worship_base: 0,
            active_curses: [],
            manifested_avatars: []
          }
        }, []);
        
        const nextWorld = tickDaedricPower(world);
        const route = nextWorld.civilization.supply_chains.routes[0];
        expect(route.efficiency).toBe(0.5);
        expect(nextWorld.global_events).toContain('The sky bleeds as mehrunes_dagon touches the foundations of reality.');
      });

      it('applies corruption intent', () => {
        const world = createMockWorld({
          'mephala': {
            prince_id: 'mephala' as DaedricPrinceId,
            power_level: 95,
            current_intent: 'corruption',
            worship_base: 0,
            active_curses: [],
            manifested_avatars: []
          }
        }, []);
        
        const nextWorld = tickDaedricPower(world);
        const knowledge = nextWorld.civilization.knowledge.individual_knowledge['npc1'][0];
        expect(knowledge.confidence).toBe(0.5);
      });

      it('applies revelry intent', () => {
        const world = createMockWorld({
          'sanguine': {
            prince_id: 'sanguine' as DaedricPrinceId,
            power_level: 95,
            current_intent: 'revelry',
            worship_base: 0,
            active_curses: [],
            manifested_avatars: []
          }
        }, []);
        
        const nextWorld = tickDaedricPower(world);
        const gov = nextWorld.civilization.governments[0];
        expect(gov.treasury).toBe(2000); // 1000 + 1000
        expect(gov.stability).toBe(80); // 100 * 0.8
      });
    });
  });

  describe('getDaedricBleed', () => {
    it('returns the realm if location is connected', () => {
      const realm: DaedricRealm = { id: 'r1', name: 'mb', corruption_type: 'none', prince_id: 'molag_bal' as DaedricPrinceId, physics_stability: 50, connected_locations: ['loc1'] };
      const world = createMockWorld({}, [realm]);
      
      const bleed = getDaedricBleed(world, 'loc1');
      expect(bleed).toBe(realm);
    });

    it('returns undefined if location is not connected', () => {
      const realm: DaedricRealm = { id: 'r1', name: 'mb', corruption_type: 'none', prince_id: 'molag_bal' as DaedricPrinceId, physics_stability: 50, connected_locations: ['loc1'] };
      const world = createMockWorld({}, [realm]);
      
      const bleed = getDaedricBleed(world, 'loc2');
      expect(bleed).toBeUndefined();
    });
  });
});
