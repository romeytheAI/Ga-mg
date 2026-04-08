/**
 * memoryEngine.ts — game-layer bridge for the memory / recall system.
 *
 * Wraps MemorySystem (pure sim) and maps results to player/NPC state.
 * All functions are pure (injectable turn/rng) for deterministic testing.
 *
 * Elder Scrolls flavor:
 *   - Hermaeus Mora forbidden knowledge memories (cannot be safely forgotten)
 *   - Sheogorath memory corruption (scrambles recollections)
 *   - Soul Cairn memory drain (soul gem proximity erodes self)
 *
 * @see src/sim/MemorySystem.ts  — underlying weight/decay engine
 * @see src/sim/types.ts         — MemoryEntry, SimNpc
 */

import {
  addMemory,
  decayMemories,
  recallAbout,
  sentimentScore,
  lastNegativeMemory,
  memoryContextString,
} from '../sim/MemorySystem';
import { MemoryEntry } from '../sim/types';
import { GameState } from '../types';

// ── Types ──────────────────────────────────────────────────────────────────────

/** Portable memory bag — usable for player or NPC perspective. */
export interface MemoryBag {
  memories: MemoryEntry[];
  willpower: number;   // 0-100
  trauma: number;      // 0-100
  turn: number;
}

export interface MemoryRecordResult {
  memories: MemoryEntry[];
  narrative: string;
  /** True when the memory contains Hermaeus Mora forbidden knowledge. */
  isForbidden: boolean;
}

export interface FlashbackResult {
  triggered: boolean;
  memory: MemoryEntry | null;
  willpower_cost: number;
  trauma_spike: number;
  narrative: string;
}

export interface MemoryFadeResult {
  memories: MemoryEntry[];
  faded_count: number;
  narrative: string | null;
}

export type AmnesiaCause = 'skooma' | 'head_trauma' | 'magic' | 'soul_cairn' | 'sheogorath';

export interface AmnesiaResult {
  memories: MemoryEntry[];
  memories_lost: number;
  trauma_change: number;
  narrative: string;
}

export interface NpcRememberResult {
  has_memory: boolean;
  sentiment: number;          // -1 to 1
  last_event: string | null;
  relationship_modifier: number; // -20 to 20 affection delta
  narrative: string;
}

export interface MemorySummary {
  total_memories: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  most_vivid: MemoryEntry | null;
  dominant_sentiment: 'positive' | 'negative' | 'neutral';
  context_string: string;
  trauma_keywords: string[];
}

// ── Internal helpers ───────────────────────────────────────────────────────────

const FORBIDDEN_KEYWORDS = [
  'hermaeus', 'mora', 'apocrypha', 'black book', 'oghma infinium',
  'forbidden knowledge', 'daedric secret', 'elder scroll vision',
];

function isHermaeusKnowledge(event: string): boolean {
  const lower = event.toLowerCase();
  return FORBIDDEN_KEYWORDS.some(k => lower.includes(k));
}

// ── State extraction ───────────────────────────────────────────────────────────

/**
 * Extract a MemoryBag from the player slice of GameState.
 * Converts the narrative memory_graph (string[]) into weighted MemoryEntry objects.
 */
export function playerMemoryBag(state: GameState): MemoryBag {
  const entries: MemoryEntry[] = state.memory_graph.map((text, i) => ({
    turn: i,
    event: text,
    sentiment: 'neutral' as const,
    subject_id: null,
    weight: Math.max(0.1, 1 - i * 0.04), // older entries have lower weight
  }));

  return {
    memories: entries,
    willpower: state.player.stats.willpower,
    trauma: state.player.stats.trauma,
    turn: state.world.turn_count,
  };
}

// ── recordMemory ───────────────────────────────────────────────────────────────

/**
 * Add a memory to a MemoryBag with optional importance boost.
 *
 * @param bag        - Current memory state
 * @param event      - Narrative description of the event
 * @param sentiment  - Emotional valence
 * @param subjectId  - Entity ID that caused the event (null = environmental)
 * @param importance - Weight multiplier (>1 = more vivid; Hermaeus memories pinned to 0.99)
 */
export function recordMemory(
  bag: MemoryBag,
  event: string,
  sentiment: MemoryEntry['sentiment'],
  subjectId: string | null = null,
  importance: number = 1.0,
): MemoryRecordResult {
  const isForbidden = isHermaeusKnowledge(event);

  // addMemory expects a SimNpc proxy with a .memory array
  const proxy = { memory: bag.memories } as import('../sim/types').SimNpc;
  const updated = addMemory(proxy, event, sentiment, subjectId, bag.turn);

  // Apply importance to the freshly prepended entry (index 0)
  const clamped = Math.max(0.1, Math.min(2.0, importance));
  const boosted: MemoryEntry[] = updated.map((m, i) =>
    i === 0 ? { ...m, weight: Math.min(1, m.weight * clamped) } : m
  );

  // Hermaeus Mora: forbidden knowledge pinned at near-max weight, never fully fades
  const final = isForbidden
    ? boosted.map((m, i) => (i === 0 ? { ...m, weight: 0.99 } : m))
    : boosted;

  const narratives: Record<MemoryEntry['sentiment'], string[]> = {
    positive: [
      'You commit this moment to memory.',
      'A warm recollection takes hold.',
      'This will stay with you.',
    ],
    negative: [
      'The memory burns itself into your mind.',
      'You cannot easily forget this.',
      'The event scars you inwardly.',
    ],
    neutral: [
      'You file this away for later.',
      'A distant mental note.',
      'You take stock of what occurred.',
    ],
  };

  const narrative = isForbidden
    ? `Hermaeus Mora's forbidden knowledge brands itself into your soul. You cannot unknow this.`
    : narratives[sentiment][Math.floor(Math.random() * narratives[sentiment].length)];

  return { memories: final, narrative, isForbidden };
}

// ── recallMemories ─────────────────────────────────────────────────────────────

/**
 * Retrieve relevant memories by keyword or subject match.
 * Returns up to `limit` entries, sorted by relevance × weight descending.
 */
export function recallMemories(
  bag: MemoryBag,
  query: string,
  limit: number = 5,
): MemoryEntry[] {
  if (bag.memories.length === 0) return [];

  const lower = query.toLowerCase();
  const tokens = lower.split(/\s+/).filter(t => t.length > 2);

  const scored = bag.memories.map(m => {
    let score = m.weight;
    const eventLower = m.event.toLowerCase();

    for (const token of tokens) {
      if (eventLower.includes(token)) score += 0.3;
    }
    if (m.subject_id && m.subject_id.toLowerCase().includes(lower)) score += 0.5;

    return { m, score };
  });

  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.m);
}

// ── resolveMemoryFade ──────────────────────────────────────────────────────────

/**
 * Tick-based memory decay.
 * - Vivid memories (weight > 0.8) fade at ⅓ the normal rate.
 * - Hermaeus Mora memories cannot decay below 0.9.
 */
export function resolveMemoryFade(bag: MemoryBag): MemoryFadeResult {
  const DECAY_BASE = 0.01;
  const before = bag.memories.length;

  const updated = bag.memories
    .map(m => {
      if (isHermaeusKnowledge(m.event)) {
        return { ...m, weight: Math.max(0.9, m.weight - DECAY_BASE * 0.1) };
      }
      const rate = m.weight > 0.8 ? DECAY_BASE / 3 : DECAY_BASE;
      return { ...m, weight: m.weight - rate };
    })
    .filter(m => m.weight > 0.05);

  const faded_count = before - updated.length;
  const narrative =
    faded_count > 0
      ? `${faded_count} old ${faded_count === 1 ? 'memory has' : 'memories have'} faded with time.`
      : null;

  return { memories: updated, faded_count, narrative };
}

// ── resolveFlashback ──────────────────────────────────────────────────────────

/**
 * Trauma-triggered flashback to a negative memory.
 * Willpower check determines severity.
 * Sheogorath's influence (10% chance) scrambles the vision.
 */
export function resolveFlashback(
  bag: MemoryBag,
  rng: () => number = Math.random,
): FlashbackResult {
  const negatives = bag.memories.filter(m => m.sentiment === 'negative');

  if (negatives.length === 0) {
    return {
      triggered: false,
      memory: null,
      willpower_cost: 0,
      trauma_spike: 0,
      narrative: 'Your mind is still. No darkness rises tonight.',
    };
  }

  // Trigger chance: scales with trauma, reduced by willpower
  const triggerChance = (bag.trauma / 100) * (1 - bag.willpower / 200);
  if (rng() > triggerChance) {
    return {
      triggered: false,
      memory: null,
      willpower_cost: 0,
      trauma_spike: 0,
      narrative: 'A shadow passes but does not take hold.',
    };
  }

  // Pick the most vivid negative memory
  const target = negatives.reduce((best, m) => (m.weight > best.weight ? m : best));

  // Willpower check: pass = less damage
  const wpPassed = rng() * 100 < bag.willpower;
  const willpower_cost = wpPassed ? 2 : 8;
  const trauma_spike = wpPassed ? 1 : 5;

  // Sheogorath corruption: 10% chance of scrambled vision
  const sheoTouched = rng() < 0.1;

  let narrative: string;
  if (sheoTouched) {
    const scrambled = target.event.split(' ').reverse().join(' ');
    narrative = `The memory twists — Sheogorath's laughter echoes as the past bleeds into impossible shapes. "${scrambled}"`;
  } else if (!wpPassed) {
    narrative = `The flashback overwhelms you. ${target.event} — it crashes back with full force, leaving you trembling and cold.`;
  } else {
    narrative = `A ghost of memory surfaces: ${target.event}. You push it aside, but the effort costs you.`;
  }

  return { triggered: true, memory: target, willpower_cost, trauma_spike, narrative };
}

// ── resolveAmnesia ────────────────────────────────────────────────────────────

/**
 * Lose memories due to substance abuse, trauma, magic, or Daedric influence.
 *
 * @param bag      - Current memory state
 * @param severity - 0-100: 0 = no effect, 100 = near-total wipe
 * @param rng      - Injectable random function
 * @param cause    - Source of amnesia (affects which memories are lost first)
 */
export function resolveAmnesia(
  bag: MemoryBag,
  severity: number,
  rng: () => number = Math.random,
  cause: AmnesiaCause = 'magic',
): AmnesiaResult {
  const before = bag.memories.length;
  const normalizedSeverity = Math.max(0, Math.min(100, severity));

  const retainChance = (m: MemoryEntry): number => {
    // Hermaeus Mora forbidden knowledge: always retained
    if (isHermaeusKnowledge(m.event)) return 1.0;

    const base = 1 - normalizedSeverity / 100;

    switch (cause) {
      case 'soul_cairn':
        // Soul Cairn steals the most cherished memories first
        return Math.max(0, base - m.weight * 0.5);

      case 'skooma':
        // Skooma: random amnesia, recent memories more vulnerable
        return rng() > normalizedSeverity / 100 ? 1 : 0;

      case 'sheogorath':
        // Sheogorath: erases positive memories, preserves negative ones
        if (m.sentiment === 'positive') return Math.max(0, base - 0.3);
        return Math.min(1, base + 0.2);

      case 'head_trauma':
        // Head trauma: recent events (high turn) are lost first
        return rng() > normalizedSeverity / 150 ? 1 : 0;

      default: // magic
        return rng() > normalizedSeverity / 100 ? 1 : 0;
    }
  };

  const surviving = bag.memories.filter(m => rng() < retainChance(m));
  const lost = before - surviving.length;

  const causeNarratives: Record<AmnesiaCause, string[]> = {
    skooma: [
      "The skooma haze swallows chunks of your recent past. What happened last night?",
      "Gaps. Large, terrible gaps where memories should be. The skooma takes its toll.",
    ],
    head_trauma: [
      "Your skull rings with a dull ache. Some things — important things — have slipped away.",
      "You piece together fragments. Something happened. You cannot quite remember what.",
    ],
    magic: [
      "The spell's backlash scatters your recollections like ashes in the wind.",
      "A magical rupture tears through your memory palace, leaving gaping holes.",
    ],
    soul_cairn: [
      "The Soul Cairn takes its tithe — your fondest memories dissolve into dim grey nothing.",
      "Something precious drains away into the void. The Ideal Masters have claimed their share.",
    ],
    sheogorath: [
      "Sheogorath finds your memories amusing. He rearranges them. The good ones vanish first.",
      "Mad laughter — and then silence where your happiest thoughts once lived.",
    ],
  };

  const lines = causeNarratives[cause];
  const narrative =
    lost > 0
      ? lines[Math.floor(rng() * lines.length)]
      : 'Your mind holds. The memories remain, for now.';

  return {
    memories: surviving,
    memories_lost: lost,
    trauma_change: lost > 3 ? 5 : 0,
    narrative,
  };
}

// ── getMemorySummary ──────────────────────────────────────────────────────────

/**
 * Build a narrative summary of key memories for AI context injection.
 * Used to prime the AI Horde generation pipeline with relevant backstory.
 */
export function getMemorySummary(bag: MemoryBag, maxEntries = 5): MemorySummary {
  const { memories } = bag;

  const positive_count = memories.filter(m => m.sentiment === 'positive').length;
  const negative_count = memories.filter(m => m.sentiment === 'negative').length;
  const neutral_count  = memories.filter(m => m.sentiment === 'neutral').length;

  const most_vivid =
    memories.length > 0
      ? memories.reduce((best, m) => (m.weight > best.weight ? m : best))
      : null;

  const dominant_sentiment: MemorySummary['dominant_sentiment'] =
    positive_count > negative_count && positive_count > neutral_count
      ? 'positive'
      : negative_count > positive_count && negative_count > neutral_count
      ? 'negative'
      : 'neutral';

  const context_string = memoryContextString(memories, maxEntries);

  // Extract trauma keywords from high-weight negative memories
  const traumaWords = new Set<string>();
  memories
    .filter(m => m.sentiment === 'negative' && m.weight > 0.5)
    .forEach(m => {
      m.event
        .toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 4)
        .forEach(w => traumaWords.add(w));
    });

  return {
    total_memories: memories.length,
    positive_count,
    negative_count,
    neutral_count,
    most_vivid,
    dominant_sentiment,
    context_string,
    trauma_keywords: Array.from(traumaWords).slice(0, 10),
  };
}

// ── resolveNpcRemember ────────────────────────────────────────────────────────

/**
 * NPC recalls previous interactions with the player, affecting dialogue tone.
 * Looks up the NPC's sim-world memory for any entries with subject_id = 'player'.
 *
 * @param state - Full GameState (reads sim_world.npcs)
 * @param npcId - ID of the NPC whose memory is being queried
 */
export function resolveNpcRemember(
  state: GameState,
  npcId: string,
): NpcRememberResult {
  const npc = state.sim_world?.npcs.find(n => n.id === npcId);

  if (!npc) {
    return {
      has_memory: false,
      sentiment: 0,
      last_event: null,
      relationship_modifier: 0,
      narrative: 'This person does not seem to know you.',
    };
  }

  const playerMemories = recallAbout(npc.memory, 'player');

  if (playerMemories.length === 0) {
    return {
      has_memory: false,
      sentiment: 0,
      last_event: null,
      relationship_modifier: 0,
      narrative: `${npc.name} glances at you with no recognition.`,
    };
  }

  const score = sentimentScore(npc.memory, 'player');
  const lastNeg = lastNegativeMemory(playerMemories);
  const last_event = playerMemories[0]?.event ?? null;

  // Relationship modifier: -20 to 20 affection delta based on weighted sentiment
  const relationship_modifier = Math.round(score * 20);

  let narrative: string;
  if (score > 0.3) {
    narrative = `${npc.name}'s face softens — they remember you fondly. "${last_event}"`;
  } else if (score < -0.3) {
    const recall = lastNeg?.event ?? last_event;
    narrative = `${npc.name} stiffens. Their eyes carry the weight of what you did. "${recall}"`;
  } else {
    narrative = `${npc.name} regards you with measured recognition. You have history — complicated history.`;
  }

  return { has_memory: true, sentiment: score, last_event, relationship_modifier, narrative };
}
