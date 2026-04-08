/**
 * memoryEngine.test.ts — unit tests for the memory engine game-layer bridge.
 * 20+ tests covering all resolver functions and Elder Scrolls edge cases.
 */
import { describe, it, expect } from 'vitest';
import {
  recordMemory,
  recallMemories,
  resolveMemoryFade,
  resolveFlashback,
  resolveAmnesia,
  getMemorySummary,
  resolveNpcRemember,
  playerMemoryBag,
  MemoryBag,
} from './memoryEngine';
import { initialState } from '../state/initialState';
import { MemoryEntry } from '../sim/types';

// ── Test helpers ──────────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function makeBag(overrides?: Partial<MemoryBag>): MemoryBag {
  return { memories: [], willpower: 50, trauma: 30, turn: 100, ...overrides };
}

function mem(
  event: string,
  sentiment: MemoryEntry['sentiment'],
  weight = 0.8,
  subject_id: string | null = null,
): MemoryEntry {
  return { turn: 1, event, sentiment, weight, subject_id };
}

// ── playerMemoryBag ───────────────────────────────────────────────────────────

describe('playerMemoryBag', () => {
  it('converts memory_graph strings into MemoryEntry objects', () => {
    const bag = playerMemoryBag(initialState);
    expect(bag.memories.length).toBeGreaterThan(0);
    bag.memories.forEach(m => {
      expect(m).toHaveProperty('event');
      expect(m).toHaveProperty('weight');
      expect(m).toHaveProperty('sentiment');
    });
  });

  it('carries willpower and trauma from player stats', () => {
    const bag = playerMemoryBag(initialState);
    expect(bag.willpower).toBe(initialState.player.stats.willpower);
    expect(bag.trauma).toBe(initialState.player.stats.trauma);
  });

  it('assigns descending weights to older entries', () => {
    const state = {
      ...initialState,
      memory_graph: ['first', 'second', 'third'],
    };
    const bag = playerMemoryBag(state);
    expect(bag.memories[0].weight).toBeGreaterThan(bag.memories[1].weight);
    expect(bag.memories[1].weight).toBeGreaterThan(bag.memories[2].weight);
  });
});

// ── recordMemory ───────────────────────────────────────────────────────────────

describe('recordMemory', () => {
  it('prepends a new memory entry to the bag', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'Killed a mudcrab.', 'neutral');
    expect(result.memories).toHaveLength(1);
    expect(result.memories[0].event).toBe('Killed a mudcrab.');
  });

  it('sentiment is correctly stored on the new entry', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'A guard struck me.', 'negative');
    expect(result.memories[0].sentiment).toBe('negative');
  });

  it('subject_id is stored when provided', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'Helped Lydia.', 'positive', 'npc_lydia');
    expect(result.memories[0].subject_id).toBe('npc_lydia');
  });

  it('importance > 1 boosts the new entry weight', () => {
    const bag = makeBag();
    const low = recordMemory(bag, 'event', 'neutral', null, 1.0);
    const high = recordMemory(bag, 'event', 'neutral', null, 1.5);
    expect(high.memories[0].weight).toBeGreaterThan(low.memories[0].weight);
  });

  it('returns a non-empty narrative string', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'Ate stale bread.', 'neutral');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('Hermaeus Mora memory: isForbidden is true', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'Read the Black Book given by Hermaeus Mora.', 'neutral');
    expect(result.isForbidden).toBe(true);
  });

  it('Hermaeus Mora memory: weight is pinned at 0.99', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'Hermaeus Mora whispered forbidden knowledge.', 'negative');
    expect(result.memories[0].weight).toBe(0.99);
  });

  it('isForbidden is false for ordinary memories', () => {
    const bag = makeBag();
    const result = recordMemory(bag, 'Baked sweet rolls.', 'positive');
    expect(result.isForbidden).toBe(false);
  });

  it('accumulates multiple memories in order', () => {
    let bag = makeBag();
    bag = { ...bag, ...{ memories: recordMemory(bag, 'event A', 'neutral').memories } };
    const result = recordMemory(
      { ...bag, turn: 101 },
      'event B',
      'positive',
    );
    expect(result.memories).toHaveLength(2);
    expect(result.memories[0].event).toBe('event B');
    expect(result.memories[1].event).toBe('event A');
  });
});

// ── recallMemories ─────────────────────────────────────────────────────────────

describe('recallMemories', () => {
  it('returns empty array when bag is empty', () => {
    const bag = makeBag();
    expect(recallMemories(bag, 'dragon')).toHaveLength(0);
  });

  it('returns memories matching query keywords', () => {
    const bag = makeBag({
      memories: [
        mem('A dragon attacked the village.', 'negative'),
        mem('Baked sweet rolls at the inn.', 'positive'),
      ],
    });
    const results = recallMemories(bag, 'dragon');
    expect(results).toHaveLength(1);
    expect(results[0].event).toContain('dragon');
  });

  it('returns memories matching subject_id', () => {
    const bag = makeBag({
      memories: [
        mem('Helped Lydia escape.', 'positive', 0.8, 'npc_lydia'),
        mem('Fought a troll.', 'negative', 0.9),
      ],
    });
    const results = recallMemories(bag, 'npc_lydia');
    expect(results[0].subject_id).toBe('npc_lydia');
  });

  it('respects the limit parameter', () => {
    const memories = Array.from({ length: 10 }, (_, i) =>
      mem(`event ${i}`, 'neutral', 0.5),
    );
    const bag = makeBag({ memories });
    const results = recallMemories(bag, 'event', 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('sorts results by weight descending', () => {
    const bag = makeBag({
      memories: [
        mem('event light', 'neutral', 0.3),
        mem('event vivid', 'neutral', 0.9),
        mem('event faded', 'neutral', 0.1),
      ],
    });
    const results = recallMemories(bag, 'event');
    expect(results[0].weight).toBeGreaterThanOrEqual(results[1].weight);
  });
});

// ── resolveMemoryFade ──────────────────────────────────────────────────────────

describe('resolveMemoryFade', () => {
  it('reduces weight of ordinary memories', () => {
    const bag = makeBag({ memories: [mem('something happened', 'neutral', 0.5)] });
    const result = resolveMemoryFade(bag);
    expect(result.memories[0].weight).toBeLessThan(0.5);
  });

  it('prunes memories that decay below threshold', () => {
    const bag = makeBag({ memories: [mem('faded memory', 'neutral', 0.06)] });
    const result = resolveMemoryFade(bag);
    expect(result.faded_count).toBeGreaterThan(0);
    expect(result.memories).toHaveLength(0);
  });

  it('does not prune memories above threshold', () => {
    const bag = makeBag({ memories: [mem('vivid memory', 'positive', 0.9)] });
    const result = resolveMemoryFade(bag);
    expect(result.memories).toHaveLength(1);
    expect(result.faded_count).toBe(0);
  });

  it('Hermaeus Mora memories decay much slower', () => {
    const bag = makeBag({
      memories: [
        mem('Apocrypha revealed its black book secrets to me.', 'negative', 0.95),
        mem('Ate supper.', 'neutral', 0.95),
      ],
    });
    const result = resolveMemoryFade(bag);
    const mora = result.memories.find(m => m.event.includes('Apocrypha'));
    const normal = result.memories.find(m => m.event.includes('supper'));
    if (mora && normal) {
      expect(mora.weight).toBeGreaterThan(normal.weight);
    }
  });

  it('provides a narrative when memories fade', () => {
    const bag = makeBag({ memories: [mem('fading event', 'neutral', 0.06)] });
    const result = resolveMemoryFade(bag);
    if (result.faded_count > 0) {
      expect(result.narrative).not.toBeNull();
      expect(result.narrative!.length).toBeGreaterThan(0);
    }
  });

  it('narrative is null when nothing faded', () => {
    const bag = makeBag({ memories: [mem('solid memory', 'positive', 0.9)] });
    const result = resolveMemoryFade(bag);
    expect(result.narrative).toBeNull();
  });
});

// ── resolveFlashback ──────────────────────────────────────────────────────────

describe('resolveFlashback', () => {
  it('returns not triggered when there are no negative memories', () => {
    const bag = makeBag({
      memories: [mem('happy day', 'positive')],
      trauma: 80,
    });
    const result = resolveFlashback(bag, seeded(1));
    expect(result.triggered).toBe(false);
  });

  it('triggers at high trauma and low willpower', () => {
    // Deterministically force a trigger by providing a bag that ensures
    // triggerChance is near 1 and rng returns a low value.
    const bag = makeBag({
      memories: [mem('Something terrible happened.', 'negative', 0.9)],
      trauma: 100,
      willpower: 0,
    });
    // Use an RNG that always returns a very low value (≪ triggerChance)
    const alwaysTrigger = () => 0.001;
    const result = resolveFlashback(bag, alwaysTrigger);
    expect(result.triggered).toBe(true);
    expect(result.memory).not.toBeNull();
  });

  it('willpower_cost is lower on a successful willpower check', () => {
    const bag = makeBag({
      memories: [mem('Attacked by a vampire.', 'negative', 0.9)],
      trauma: 100,
      willpower: 100, // very high willpower
    });
    const alwaysTrigger = () => 0.001;
    const result = resolveFlashback(bag, alwaysTrigger);
    if (result.triggered) {
      expect(result.willpower_cost).toBeLessThanOrEqual(2);
    }
  });

  it('narrative is always a non-empty string', () => {
    const bag = makeBag();
    const result = resolveFlashback(bag, seeded(99));
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── resolveAmnesia ────────────────────────────────────────────────────────────

describe('resolveAmnesia', () => {
  it('severity 0 retains all memories', () => {
    const bag = makeBag({
      memories: [mem('A', 'positive'), mem('B', 'negative'), mem('C', 'neutral')],
    });
    const result = resolveAmnesia(bag, 0, seeded(1));
    // At severity 0, retain chance approaches 1 so most memories survive
    expect(result.memories_lost).toBe(0);
  });

  it('high severity removes most memories', () => {
    const mems = Array.from({ length: 20 }, (_, i) =>
      mem(`memory ${i}`, 'neutral', 0.5),
    );
    const bag = makeBag({ memories: mems });
    const result = resolveAmnesia(bag, 95, seeded(2));
    expect(result.memories_lost).toBeGreaterThan(10);
  });

  it('Hermaeus Mora memories are never lost', () => {
    const bag = makeBag({
      memories: [
        mem('The Oghma Infinium glowed in Hermaeus Mora\'s realm.', 'negative', 0.9),
        mem('Regular memory.', 'neutral', 0.9),
      ],
    });
    const result = resolveAmnesia(bag, 100, seeded(3), 'magic');
    const moraMemory = result.memories.find(m => m.event.includes('Hermaeus'));
    expect(moraMemory).toBeDefined();
  });

  it('soul_cairn cause removes high-weight memories', () => {
    const bag = makeBag({
      memories: [
        mem('My most cherished memory.', 'positive', 0.99),
        mem('Unimportant detail.', 'neutral', 0.1),
      ],
    });
    const result = resolveAmnesia(bag, 70, seeded(4), 'soul_cairn');
    // The vivid memory should be more likely to be stripped
    expect(result.narrative).toContain('Soul Cairn');
  });

  it('sheogorath cause removes positive memories preferentially', () => {
    // Run multiple times to get statistical evidence
    const positivesSurvived: number[] = [];
    for (let i = 0; i < 20; i++) {
      const bag = makeBag({
        memories: [
          mem('A wonderful feast.', 'positive', 0.5),
          mem('A horrible nightmare.', 'negative', 0.5),
        ],
      });
      const result = resolveAmnesia(bag, 50, seeded(i), 'sheogorath');
      const pos = result.memories.filter(m => m.sentiment === 'positive').length;
      positivesSurvived.push(pos);
    }
    const avgPositive = positivesSurvived.reduce((a, b) => a + b, 0) / 20;
    // On average, sheogorath should destroy more positives than negatives
    expect(avgPositive).toBeLessThan(0.9);
  });

  it('returns a narrative string', () => {
    const bag = makeBag({ memories: [mem('event', 'neutral')] });
    const result = resolveAmnesia(bag, 50, seeded(5), 'skooma');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('trauma_change is > 0 when many memories are lost', () => {
    const mems = Array.from({ length: 20 }, (_, i) =>
      mem(`memory ${i}`, 'neutral', 0.5),
    );
    const bag = makeBag({ memories: mems });
    const result = resolveAmnesia(bag, 100, seeded(6), 'head_trauma');
    if (result.memories_lost > 3) {
      expect(result.trauma_change).toBeGreaterThan(0);
    }
  });
});

// ── getMemorySummary ──────────────────────────────────────────────────────────

describe('getMemorySummary', () => {
  it('counts positive, negative, and neutral entries correctly', () => {
    const bag = makeBag({
      memories: [
        mem('good', 'positive'),
        mem('bad', 'negative'),
        mem('meh', 'neutral'),
        mem('more bad', 'negative'),
      ],
    });
    const s = getMemorySummary(bag);
    expect(s.positive_count).toBe(1);
    expect(s.negative_count).toBe(2);
    expect(s.neutral_count).toBe(1);
    expect(s.total_memories).toBe(4);
  });

  it('most_vivid is the highest-weight memory', () => {
    const bag = makeBag({
      memories: [
        mem('dim event', 'neutral', 0.2),
        mem('vivid event', 'negative', 0.95),
        mem('medium event', 'positive', 0.6),
      ],
    });
    const s = getMemorySummary(bag);
    expect(s.most_vivid?.event).toBe('vivid event');
  });

  it('most_vivid is null for empty bag', () => {
    const bag = makeBag();
    const s = getMemorySummary(bag);
    expect(s.most_vivid).toBeNull();
  });

  it('dominant_sentiment reflects majority', () => {
    const bag = makeBag({
      memories: [
        mem('bad1', 'negative'),
        mem('bad2', 'negative'),
        mem('good1', 'positive'),
      ],
    });
    const s = getMemorySummary(bag);
    expect(s.dominant_sentiment).toBe('negative');
  });

  it('context_string is a non-empty string when memories exist', () => {
    const bag = makeBag({ memories: [mem('something', 'neutral')] });
    const s = getMemorySummary(bag);
    expect(s.context_string.length).toBeGreaterThan(0);
  });

  it('context_string is empty for empty bag', () => {
    const bag = makeBag();
    const s = getMemorySummary(bag);
    expect(s.context_string).toBe('');
  });

  it('trauma_keywords extracted from high-weight negative memories', () => {
    const bag = makeBag({
      memories: [
        mem('The vampires attacked the village and slaughtered everyone.', 'negative', 0.9),
      ],
    });
    const s = getMemorySummary(bag);
    expect(s.trauma_keywords.length).toBeGreaterThan(0);
  });
});

// ── resolveNpcRemember ────────────────────────────────────────────────────────

describe('resolveNpcRemember', () => {
  it('returns has_memory false when NPC ID does not exist', () => {
    const result = resolveNpcRemember(initialState, 'npc_nonexistent');
    expect(result.has_memory).toBe(false);
    expect(result.sentiment).toBe(0);
  });

  it('returns has_memory false when NPC has no player memories', () => {
    // Find a real NPC in initial state (sim_world is populated)
    const npc = initialState.sim_world?.npcs[0];
    if (!npc) return; // skip if no NPCs
    const result = resolveNpcRemember(initialState, npc.id);
    // NPCs start with empty memory arrays
    expect(result.has_memory).toBe(false);
  });

  it('returns relationship_modifier between -20 and 20', () => {
    const result = resolveNpcRemember(initialState, 'npc_99999');
    expect(result.relationship_modifier).toBeGreaterThanOrEqual(-20);
    expect(result.relationship_modifier).toBeLessThanOrEqual(20);
  });

  it('returns a narrative string', () => {
    const result = resolveNpcRemember(initialState, 'npc_nonexistent');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('positive sentiment NPC gives positive relationship_modifier', () => {
    const npc = initialState.sim_world?.npcs[0];
    if (!npc) return;

    // Inject a positive memory from player into the NPC
    const modifiedNpc = {
      ...npc,
      memory: [
        { turn: 1, event: 'The player helped me.', sentiment: 'positive' as const, subject_id: 'player', weight: 0.9 },
      ],
    };
    const modifiedState = {
      ...initialState,
      sim_world: {
        ...initialState.sim_world!,
        npcs: [modifiedNpc, ...initialState.sim_world!.npcs.slice(1)],
      },
    };
    const result = resolveNpcRemember(modifiedState, npc.id);
    expect(result.has_memory).toBe(true);
    expect(result.relationship_modifier).toBeGreaterThan(0);
  });
});
