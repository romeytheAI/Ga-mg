import { describe, it, expect, vi } from 'vitest';
import { tickDeceptions, playerLie } from './DeceptionSystem';
import { SimWorld, ActiveDeception, SimNpc } from './types';

describe('DeceptionSystem', () => {
  describe('tickDeceptions', () => {
    it('survives if no one corrects the lie', () => {
      const lie: ActiveDeception = {
        id: 'lie1',
        source_id: 'player',
        target_id: 'npc1',
        subject_fact: 'A',
        lied_fact: 'B',
        leveraged_ignorance: 'none',
        detection_threshold: 50,
        turn_started: 1
      };

      const world = {
        civilization: {
          active_deceptions: [lie]
        },
        locations: [],
        npcs: []
      } as unknown as SimWorld;

      const res = tickDeceptions(world);
      expect(res.world.civilization.active_deceptions.length).toBe(1);
      expect(res.corrections.length).toBe(0);
    });

    it('corrects the lie if a third party overhears and corrects it', () => {
      const originalRandom = Math.random;
      Math.random = () => 0.1; // 0.1 < 0.3, triggers correction

      try {
        const lie: ActiveDeception = {
          id: 'lie1',
          source_id: 'player',
          target_id: 'npc1', // target is npc1
          subject_fact: 'Sky is blue',
          lied_fact: 'Sky is green',
          leveraged_ignorance: 'none',
          detection_threshold: 50,
          turn_started: 1
        };

        const world = {
          civilization: {
            active_deceptions: [lie]
          },
          locations: [
            { id: 'loc1', npcs_present: ['npc1', 'npc2'] }
          ],
          npcs: [
            { id: 'npc1', name: 'Bob' },
            { id: 'npc2', name: 'Alice' }
          ]
        } as unknown as SimWorld;

        const res = tickDeceptions(world);
        expect(res.world.civilization.active_deceptions.length).toBe(0); // Lie removed
        expect(res.corrections.length).toBe(2);
        expect(res.corrections[0]).toContain('Bob overhears and corrects the lie');
        expect(res.corrections[1]).toContain('Alice overhears and corrects the lie');
      } finally {
        Math.random = originalRandom;
      }
    });

    it('survives if a third party overhears but does not correct it due to RNG', () => {
      const originalRandom = Math.random;
      Math.random = () => 0.5; // 0.5 > 0.3, does not trigger correction

      try {
        const lie: ActiveDeception = {
          id: 'lie1',
          source_id: 'player',
          target_id: 'npc1',
          subject_fact: 'Sky is blue',
          lied_fact: 'Sky is green',
          leveraged_ignorance: 'none',
          detection_threshold: 50,
          turn_started: 1
        };

        const world = {
          civilization: {
            active_deceptions: [lie]
          },
          locations: [
            { id: 'loc1', npcs_present: ['npc1', 'npc2'] }
          ],
          npcs: [
            { id: 'npc1', name: 'Bob' },
            { id: 'npc2', name: 'Alice' }
          ]
        } as unknown as SimWorld;

        const res = tickDeceptions(world);
        expect(res.world.civilization.active_deceptions.length).toBe(1); // Lie survives
        expect(res.corrections.length).toBe(0);
      } finally {
        Math.random = originalRandom;
      }
    });
  });

  describe('playerLie', () => {
    it('creates an ActiveDeception with correct threshold', () => {
      const state = {
        player: {
          skills: {
            skulduggery: 80
          }
        },
        world: {
          turn_count: 5
        }
      } as any;

      const lie = playerLie(state, 'npc_target', 'Truth', 'Lie');
      expect(lie.source_id).toBe('player');
      expect(lie.target_id).toBe('npc_target');
      expect(lie.subject_fact).toBe('Truth');
      expect(lie.lied_fact).toBe('Lie');
      expect(lie.detection_threshold).toBe(20); // 100 - 80
      expect(lie.turn_started).toBe(5);
    });
  });
});
