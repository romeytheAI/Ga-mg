/**
 * RelationshipSystem — dynamic NPC ↔ NPC (and NPC ↔ Player) relationships.
 * Pure functions; no side effects, no UI imports.
 */
import { Relationship, SimNpc } from './types';
import { sentimentScore } from './MemorySystem';

const MAX_RELATIONSHIPS = 20;

/** Find an existing relationship with a target, or return a new neutral one. */
export function getRelationship(npc: SimNpc, target_id: string): Relationship {
  return (
    npc.relationships.find(r => r.target_id === target_id) ?? {
      target_id,
      affection: 0,
      trust: 0,
      fear: 0,
      familiarity: 0,
      last_interaction: 0,
    }
  );
}

/** Upsert a relationship record in an NPC's relationship list. */
export function upsertRelationship(
  relationships: Relationship[],
  updated: Relationship
): Relationship[] {
  const idx = relationships.findIndex(r => r.target_id === updated.target_id);
  if (idx >= 0) {
    const next = [...relationships];
    next[idx] = updated;
    return next;
  }
  // Prune oldest if at cap
  const list = relationships.length >= MAX_RELATIONSHIPS
    ? relationships.slice(0, MAX_RELATIONSHIPS - 1)
    : relationships;
  return [...list, updated];
}

/** Apply the result of a social interaction to a relationship. */
export function applyInteraction(
  rel: Relationship,
  outcome: 'positive' | 'negative' | 'neutral',
  turn: number
): Relationship {
  const delta = outcome === 'positive' ? 8 : outcome === 'negative' ? -12 : 1;
  return {
    ...rel,
    affection: clamp(rel.affection + delta * 0.6, -100, 100),
    trust: clamp(rel.trust + delta * 0.4, -100, 100),
    familiarity: clamp(rel.familiarity + 5, 0, 100),
    last_interaction: turn,
  };
}

/** Apply fear from a hostile event. */
export function applyFear(rel: Relationship, amount: number): Relationship {
  return {
    ...rel,
    fear: clamp(rel.fear + amount, 0, 100),
    affection: clamp(rel.affection - amount * 0.3, -100, 100),
    trust: clamp(rel.trust - amount * 0.5, -100, 100),
  };
}

/** Decay relationship values toward neutral over time (passive forgetting). */
export function decayRelationship(rel: Relationship, turns_since: number): Relationship {
  const forgetting = Math.min(turns_since * 0.02, 1);
  return {
    ...rel,
    affection: lerp(rel.affection, 0, forgetting * 0.1),
    trust: lerp(rel.trust, 0, forgetting * 0.05),
    fear: lerp(rel.fear, 0, forgetting * 0.15),
  };
}

/**
 * Sync relationship scores with memory sentiment — memories reinforce the
 * relationship, creating a feedback loop between the two systems.
 */
export function syncFromMemory(
  rel: Relationship,
  memories: import('./types').MemoryEntry[],
  target_id: string
): Relationship {
  const memScore = sentimentScore(memories, target_id); // -1 to 1
  if (memScore === 0) return rel;

  const influence = memScore * 5; // ± 5 pts per tick when vivid memories exist
  return {
    ...rel,
    affection: clamp(rel.affection + influence * 0.6, -100, 100),
    trust: clamp(rel.trust + influence * 0.4, -100, 100),
  };
}

/** Classify the relationship quality into a human-readable label. */
export function relationshipLabel(rel: Relationship): string {
  if (rel.fear > 60) return 'Terrified';
  if (rel.affection > 70 && rel.trust > 50) return 'Devoted';
  if (rel.affection > 40) return 'Friendly';
  if (rel.affection > 10) return 'Acquaintance';
  if (rel.affection < -70) return 'Nemesis';
  if (rel.affection < -40) return 'Hostile';
  if (rel.affection < -10) return 'Unfriendly';
  return 'Neutral';
}

// ── Helpers ────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
