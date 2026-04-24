import { describe, it, expect, vi } from 'vitest';
import {
  npcToParticipant,
  createCombatEncounter,
  resolveCombatTurn,
  simulateFullCombat,
  changeStance,
  selectAIStance
} from './CombatSystem';
import { CombatParticipant } from './types';

describe('CombatSystem', () => {
  const mockAttacker: CombatParticipant = {
    id: 'npc1',
    health: 100,
    stamina: 100,
    stance: 'aggressive',
    combat_skill: 50,
    athletics: 50,
  };

  const mockDefender: CombatParticipant = {
    id: 'npc2',
    health: 100,
    stamina: 100,
    stance: 'defensive',
    combat_skill: 50,
    athletics: 50,
  };

  describe('npcToParticipant', () => {
    it('creates a participant from a SimNpc', () => {
      const npc: any = {
        id: 'testNpc',
        stats: { health: 80, stamina: 90 },
        skills: { combat: 40, athletics: 60 }
      };
      const participant = npcToParticipant(npc);
      expect(participant.id).toBe('testNpc');
      expect(participant.health).toBe(80);
      expect(participant.stamina).toBe(90);
      expect(participant.stance).toBe('neutral');
      expect(participant.combat_skill).toBe(40);
      expect(participant.athletics).toBe(60);
    });
  });

  describe('createCombatEncounter', () => {
    it('initializes a combat encounter correctly', () => {
      const encounter = createCombatEncounter('a1', 'd1');
      expect(encounter.attacker_id).toBe('a1');
      expect(encounter.defender_id).toBe('d1');
      expect(encounter.turn_count).toBe(0);
      expect(encounter.resolved).toBe(false);
      expect(encounter.outcome).toBe('ongoing');
    });
  });

  describe('resolveCombatTurn', () => {
    it('returns unchanged if encounter already resolved', () => {
      const encounter = createCombatEncounter('a1', 'd1');
      encounter.resolved = true;
      const res = resolveCombatTurn(mockAttacker, mockDefender, encounter);
      expect(res.encounter.turn_count).toBe(0);
    });

    it('processes a turn where attacker hits and defender counters', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(1); // Force max rolls

      try {
        const encounter = createCombatEncounter(mockAttacker.id, mockDefender.id);
        const res = resolveCombatTurn(mockAttacker, mockDefender, encounter);

        expect(res.encounter.turn_count).toBe(1);
        expect(res.attacker.stamina).toBeLessThan(mockAttacker.stamina);
        expect(res.defender.stamina).toBeLessThan(mockDefender.stamina);
      } finally {
        Math.random = originalRandom;
      }
    });

    it('processes evasive escape success', () => {
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn().mockImplementation(() => {
        callCount++;
        // We need escapeChance roll > catchChance roll.
        // First two rolls are attack and defend. Next two are escape and catch.
        if (callCount === 5) return 1; // High escape roll
        if (callCount === 6) return 0; // Low catch roll
        return 0.5; // Average rolls for attack/defend
      });

      try {
        const encounter = createCombatEncounter(mockAttacker.id, mockDefender.id);
        const evasiveDefender = { ...mockDefender, stance: 'evasive' as const };
        const res = resolveCombatTurn(mockAttacker, evasiveDefender, encounter);

        expect(res.encounter.resolved).toBe(true);
        expect(res.encounter.outcome).toBe('defender_escaped');
      } finally {
        Math.random = originalRandom;
      }
    });

    it('processes evasive escape failure', () => {
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 5) return 0; // Low escape roll
        if (callCount === 6) return 1; // High catch roll
        return 0.5;
      });

      try {
        const encounter = createCombatEncounter(mockAttacker.id, mockDefender.id);
        const evasiveDefender = { ...mockDefender, stance: 'evasive' as const };
        const res = resolveCombatTurn(mockAttacker, evasiveDefender, encounter);

        expect(res.encounter.resolved).toBe(false);
        expect(res.defender.stamina).toBeLessThan(mockDefender.stamina);
      } finally {
        Math.random = originalRandom;
      }
    });

    it('ends combat when defender health reaches 0', () => {
      const weakDefender = { ...mockDefender, health: 1, stance: 'neutral' as const };
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(1); // Force max attack

      try {
        const encounter = createCombatEncounter(mockAttacker.id, weakDefender.id);
        const res = resolveCombatTurn(mockAttacker, weakDefender, encounter);
        expect(res.encounter.resolved).toBe(true);
        expect(res.encounter.outcome).toBe('attacker_wins');
      } finally {
        Math.random = originalRandom;
      }
    });

    it('ends combat when attacker health reaches 0 from counter', () => {
      const weakAttacker = { ...mockAttacker, health: 1 };
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn().mockImplementation(() => {
        callCount++;
        // attacker roll, defender block, defender counter roll, attacker block
        if (callCount === 1) return 0; // Attacker misses
        if (callCount === 3) return 1; // Defender counters hard
        return 0; // Blocks fail
      });

      try {
        const encounter = createCombatEncounter(weakAttacker.id, mockDefender.id);
        const res = resolveCombatTurn(weakAttacker, mockDefender, encounter);
        expect(res.encounter.resolved).toBe(true);
        expect(res.encounter.outcome).toBe('defender_wins');
      } finally {
        Math.random = originalRandom;
      }
    });

    it('stalemates when both run out of stamina', () => {
      const tiredAttacker = { ...mockAttacker, stamina: 5 };
      const tiredDefender = { ...mockDefender, stamina: 5 };
      const encounter = createCombatEncounter(tiredAttacker.id, tiredDefender.id);
      const res = resolveCombatTurn(tiredAttacker, tiredDefender, encounter);
      expect(res.encounter.resolved).toBe(true);
      expect(res.encounter.outcome).toBe('defender_wins');
    });
  });

  describe('simulateFullCombat', () => {
    it('simulates combat to completion', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(0.5);

      try {
        const res = simulateFullCombat(mockAttacker, mockDefender, 50);
        expect(res.encounter.resolved).toBe(true);
        // eventually someone runs out of health or stamina
      } finally {
        Math.random = originalRandom;
      }
    });

    it('handles stalemate limit gracefully', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(0.5);

      try {
        // High health and stamina, so 1 turn won't finish it
        const tankAttacker = { ...mockAttacker, health: 1000, stamina: 1000 };
        const tankDefender = { ...mockDefender, health: 1000, stamina: 1000 };
        const res = simulateFullCombat(tankAttacker, tankDefender, 1);
        expect(res.encounter.resolved).toBe(true);
        expect(res.encounter.outcome).toBe('defender_wins');
      } finally {
        Math.random = originalRandom;
      }
    });
  });

  describe('changeStance', () => {
    it('changes participant stance', () => {
      const updated = changeStance(mockAttacker, 'submissive');
      expect(updated.stance).toBe('submissive');
    });
  });

  describe('selectAIStance', () => {
    it('returns evasive if health is low', () => {
      expect(selectAIStance({ ...mockAttacker, health: 10 })).toBe('evasive');
    });

    it('returns defensive if stamina is low', () => {
      expect(selectAIStance({ ...mockAttacker, health: 50, stamina: 10 })).toBe('defensive');
    });

    it('returns aggressive if health and stamina are high', () => {
      expect(selectAIStance({ ...mockAttacker, health: 80, stamina: 80 })).toBe('aggressive');
    });

    it('returns neutral otherwise', () => {
      expect(selectAIStance({ ...mockAttacker, health: 40, stamina: 40 })).toBe('neutral');
    });
  });
});
