/**
 * MemorySystem — NPC memory storage, retrieval, and decay.
 * Pure functions; no side effects, no UI imports.
 */
import { MemoryEntry, SimNpc } from './types';

const MAX_MEMORIES = 50;
const MEMORY_DECAY_PER_TURN = 0.01; // weight reduction per turn

/** Record a new memory for an NPC. Oldest memory is pruned when limit is hit. */
export function addMemory(
  npc: SimNpc,
  event: string,
  sentiment: MemoryEntry['sentiment'],
  subject_id: string | null,
  turn: number
): MemoryEntry[] {
  const entry: MemoryEntry = {
    turn,
    event,
    sentiment,
    subject_id,
    weight: 1.0,
  };

  const updated = [entry, ...npc.memory].slice(0, MAX_MEMORIES);
  return updated;
}

/** Decay all memory weights. Memories at weight ≤ 0.05 are pruned. */
export function decayMemories(memories: MemoryEntry[]): MemoryEntry[] {
  return memories
    .map(m => ({ ...m, weight: m.weight - MEMORY_DECAY_PER_TURN }))
    .filter(m => m.weight > 0.05);
}

/** Retrieve memories related to a specific subject. */
export function recallAbout(memories: MemoryEntry[], subject_id: string): MemoryEntry[] {
  return memories.filter(m => m.subject_id === subject_id);
}

/**
 * Compute a sentiment score for a subject (-1 to 1).
 * Weighted by memory recency (weight).
 */
export function sentimentScore(memories: MemoryEntry[], subject_id: string): number {
  const relevant = recallAbout(memories, subject_id);
  if (relevant.length === 0) return 0;

  let totalWeight = 0;
  let weightedScore = 0;

  for (const m of relevant) {
    const val = m.sentiment === 'positive' ? 1 : m.sentiment === 'negative' ? -1 : 0;
    weightedScore += val * m.weight;
    totalWeight += m.weight;
  }

  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

/** Get the most recent significant negative memory (for dialogue context). */
export function lastNegativeMemory(memories: MemoryEntry[]): MemoryEntry | null {
  return memories.find(m => m.sentiment === 'negative') ?? null;
}

/** Get a summary string of the NPC's memories for AI prompt injection. */
export function memoryContextString(memories: MemoryEntry[], maxEntries = 5): string {
  return memories
    .slice(0, maxEntries)
    .map(m => `[${m.sentiment}] ${m.event} (${Math.round(m.weight * 100)}% vivid)`)
    .join('; ');
}
