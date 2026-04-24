import { describe, it, expect } from 'vitest';
import {
  getRelationship,
  upsertRelationship,
  applyInteraction,
  applyFear,
  decayRelationship,
  syncFromMemory,
  relationshipLabel
} from './RelationshipSystem';
import { Relationship, SimNpc, MemoryEntry } from './types';

describe('RelationshipSystem', () => {
  const baseRel: Relationship = {
    target_id: 'targetA',
    affection: 0,
    trust: 0,
    fear: 0,
    familiarity: 0,
    last_interaction: 0,
    romance: null,
  };

  describe('getRelationship', () => {
    it('returns existing relationship if found', () => {
      const npc = { relationships: [baseRel] } as any as SimNpc;
      expect(getRelationship(npc, 'targetA')).toBe(baseRel);
    });

    it('returns a new neutral relationship if not found', () => {
      const npc = { relationships: [] } as any as SimNpc;
      const rel = getRelationship(npc, 'targetB');
      expect(rel.target_id).toBe('targetB');
      expect(rel.affection).toBe(0);
      expect(rel.trust).toBe(0);
      expect(rel.fear).toBe(0);
    });
  });

  describe('upsertRelationship', () => {
    it('updates an existing relationship', () => {
      const list = [baseRel];
      const updated: Relationship = { ...baseRel, affection: 50 };
      const nextList = upsertRelationship(list, updated);
      expect(nextList.length).toBe(1);
      expect(nextList[0].affection).toBe(50);
    });

    it('adds a new relationship if not existing', () => {
      const list = [baseRel];
      const newRel: Relationship = { ...baseRel, target_id: 'targetB' };
      const nextList = upsertRelationship(list, newRel);
      expect(nextList.length).toBe(2);
    });

    it('prunes the oldest if cap is reached', () => {
      const list: Relationship[] = Array.from({ length: 20 }, (_, i) => ({
        ...baseRel,
        target_id: `target${i}`
      }));
      const newRel: Relationship = { ...baseRel, target_id: 'targetNew' };
      const nextList = upsertRelationship(list, newRel);
      expect(nextList.length).toBe(20);
      expect(nextList[19].target_id).toBe('targetNew');
    });
  });

  describe('applyInteraction', () => {
    it('handles positive outcome', () => {
      const res = applyInteraction(baseRel, 'positive', 10);
      expect(res.affection).toBe(4.8);
      expect(res.trust).toBe(3.2);
      expect(res.familiarity).toBe(5);
      expect(res.last_interaction).toBe(10);
    });

    it('handles negative outcome', () => {
      const res = applyInteraction(baseRel, 'negative', 10);
      expect(res.affection).toBeCloseTo(-7.2);
      expect(res.trust).toBeCloseTo(-4.8);
    });

    it('handles neutral outcome', () => {
      const res = applyInteraction(baseRel, 'neutral', 10);
      expect(res.affection).toBe(0.6);
      expect(res.trust).toBe(0.4);
    });
  });

  describe('applyFear', () => {
    it('increases fear and decreases affection and trust', () => {
      const res = applyFear(baseRel, 20);
      expect(res.fear).toBe(20);
      expect(res.affection).toBe(-6);
      expect(res.trust).toBe(-10);
    });
  });

  describe('decayRelationship', () => {
    it('decays stats towards 0 over time', () => {
      const rel: Relationship = { ...baseRel, affection: 100, trust: 100, fear: 100 };
      const res = decayRelationship(rel, 10); // 10 turns => forgetting = 0.2
      // affection lerp: 100 to 0 by 0.2 * 0.1 = 0.02 => 98
      expect(res.affection).toBeCloseTo(98);
      // trust lerp: 100 to 0 by 0.2 * 0.05 = 0.01 => 99
      expect(res.trust).toBeCloseTo(99);
      // fear lerp: 100 to 0 by 0.2 * 0.15 = 0.03 => 97
      expect(res.fear).toBeCloseTo(97);
    });
  });

  describe('syncFromMemory', () => {
    it('syncs relationship with memory sentiment', () => {
      const memories: MemoryEntry[] = [
        {
          turn: 1,
          event: 'combat',
          subject_id: 'targetA',
          sentiment: 'positive',
          weight: 1.0
        }
      ];
      const res = syncFromMemory(baseRel, memories, 'targetA');
      // memScore > 0 => influence > 0
      expect(res.affection).toBeGreaterThan(0);
      expect(res.trust).toBeGreaterThan(0);
    });

    it('does nothing if no sentiment', () => {
      const res = syncFromMemory(baseRel, [], 'targetA');
      expect(res).toEqual(baseRel);
    });
  });

  describe('relationshipLabel', () => {
    it('returns Terrified', () => expect(relationshipLabel({ ...baseRel, fear: 61 })).toBe('Terrified'));
    it('returns Devoted', () => expect(relationshipLabel({ ...baseRel, affection: 71, trust: 51 })).toBe('Devoted'));
    it('returns Friendly', () => expect(relationshipLabel({ ...baseRel, affection: 41 })).toBe('Friendly'));
    it('returns Acquaintance', () => expect(relationshipLabel({ ...baseRel, affection: 11 })).toBe('Acquaintance'));
    it('returns Nemesis', () => expect(relationshipLabel({ ...baseRel, affection: -71 })).toBe('Nemesis'));
    it('returns Hostile', () => expect(relationshipLabel({ ...baseRel, affection: -41 })).toBe('Hostile'));
    it('returns Unfriendly', () => expect(relationshipLabel({ ...baseRel, affection: -11 })).toBe('Unfriendly'));
    it('returns Neutral', () => expect(relationshipLabel({ ...baseRel, affection: 0 })).toBe('Neutral'));
  });
});
