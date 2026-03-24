import { describe, it, expect } from 'vitest';
import { decayNeeds, needUrgency, mostUrgentNeed, hasNeedCrisis, applyActivityEffect, computeHappinessDelta } from './NeedsSystem';
import { selectBestAction } from './UtilityAI';
import { addMemory, decayMemories, sentimentScore, memoryContextString } from './MemorySystem';
import { getRelationship, applyInteraction, applyFear, relationshipLabel } from './RelationshipSystem';
import { initEconomy, produceGoods, updatePrices, getPrice, collectWage } from './EconomySystem';
import { advanceTime, timeOfDayLabel, isDay, buildDefaultSchedule, scheduledActivity } from './TimeSystem';
import { generateNpc, generateWorldLocations, generateStartingWorld, generateRandomEvent } from './ProceduralGen';
import { tickSimulation } from './SimulationEngine';
import { SimNpc, SimWorld } from './types';

// ── Fixture helpers ──────────────────────────────────────────────────────────

function makeNpc(overrides: Partial<SimNpc> = {}): SimNpc {
  return {
    id: 'npc_test',
    name: 'Test NPC',
    race: 'Human',
    gender: 'male',
    age: 30,
    job: 'merchant',
    traits: ['greedy'],
    needs: { hunger: 80, energy: 80, social: 80, happiness: 80, wealth: 50 },
    memory: [],
    relationships: [],
    current_state: 'idle',
    location_id: 'town',
    stats: { health: 100, stamina: 100, gold: 20 },
    schedule: buildDefaultSchedule('merchant'),
    dialogue_cache: {},
    ...overrides,
  };
}

function makeWorld(overrides: Partial<SimWorld> = {}): SimWorld {
  const { locations, npcs, economy } = generateStartingWorld(1);
  return {
    turn: 0,
    day: 1,
    hour: 9,
    weather: 'Sunny',
    season: 'spring',
    npcs: [],
    economy,
    global_events: [],
    locations,
    ...overrides,
  };
}

// ── NeedsSystem ──────────────────────────────────────────────────────────────

describe('NeedsSystem', () => {
  it('decayNeeds reduces hunger and energy over time', () => {
    const npc = makeNpc();
    const decayed = decayNeeds(npc, 2);
    expect(decayed.hunger).toBeLessThan(npc.needs.hunger);
    expect(decayed.energy).toBeLessThan(npc.needs.energy);
  });

  it('decayNeeds never goes below 0', () => {
    const npc = makeNpc({ needs: { hunger: 1, energy: 1, social: 1, happiness: 1, wealth: 1 } });
    const decayed = decayNeeds(npc, 100);
    for (const val of Object.values(decayed)) {
      expect(val).toBeGreaterThanOrEqual(0);
    }
  });

  it('needUrgency returns higher score for lower values', () => {
    expect(needUrgency(10)).toBeGreaterThan(needUrgency(90));
  });

  it('mostUrgentNeed picks the most depleted need', () => {
    const needs = { hunger: 5, energy: 80, social: 80, happiness: 80, wealth: 80 };
    expect(mostUrgentNeed(needs)).toBe('hunger');
  });

  it('hasNeedCrisis detects critical hunger', () => {
    const needs = { hunger: 5, energy: 80, social: 80, happiness: 80, wealth: 80 };
    expect(hasNeedCrisis(needs)).toBe(true);
  });

  it('applyActivityEffect increases hunger when eating', () => {
    const needs = { hunger: 40, energy: 80, social: 80, happiness: 80, wealth: 50 };
    const after = applyActivityEffect(needs, 'eating', 1);
    expect(after.hunger).toBeGreaterThan(needs.hunger);
  });

  it('computeHappinessDelta is positive when core needs are high', () => {
    const needs = { hunger: 90, energy: 90, social: 90, happiness: 50, wealth: 50 };
    expect(computeHappinessDelta(needs)).toBeGreaterThan(0);
  });
});

// ── UtilityAI ────────────────────────────────────────────────────────────────

describe('UtilityAI', () => {
  it('selectBestAction selects eating when hunger is critical', () => {
    const npc = makeNpc({ needs: { hunger: 5, energy: 80, social: 80, happiness: 80, wealth: 50 } });
    const action = selectBestAction(npc, 12);
    expect(action.target_state).toBe('eating');
  });

  it('selectBestAction selects sleeping when energy is critical', () => {
    const npc = makeNpc({ needs: { hunger: 80, energy: 5, social: 80, happiness: 80, wealth: 50 } });
    const action = selectBestAction(npc, 12);
    expect(action.target_state).toBe('sleeping');
  });

  it('selectBestAction selects flee when health is very low', () => {
    const npc = makeNpc({ stats: { health: 10, stamina: 100, gold: 20 } });
    const action = selectBestAction(npc, 12);
    expect(action.target_state).toBe('fleeing');
  });

  it('selectBestAction returns a valid action', () => {
    const npc = makeNpc();
    const action = selectBestAction(npc, 10);
    expect(action).toBeDefined();
    expect(action.id).toBeDefined();
  });
});

// ── MemorySystem ─────────────────────────────────────────────────────────────

describe('MemorySystem', () => {
  it('addMemory prepends a memory entry', () => {
    const npc = makeNpc();
    const memories = addMemory(npc, 'Met a stranger', 'neutral', null, 1);
    expect(memories.length).toBe(1);
    expect(memories[0].event).toBe('Met a stranger');
  });

  it('decayMemories reduces weight and prunes weak memories', () => {
    const npc = makeNpc();
    // Add a memory with very low weight that should be pruned
    const memories = [{ turn: 0, event: 'old', sentiment: 'neutral' as const, subject_id: null, weight: 0.06 }];
    const decayed = decayMemories(memories);
    expect(decayed.length).toBe(0); // 0.06 - 0.01 = 0.05, on the boundary
  });

  it('sentimentScore returns positive for positive memories', () => {
    const npc = makeNpc();
    const memories = addMemory(npc, 'Good trade', 'positive', 'npc_2', 1);
    const npcWithMem = { ...npc, memory: memories };
    const score = sentimentScore(npcWithMem.memory, 'npc_2');
    expect(score).toBeGreaterThan(0);
  });

  it('memoryContextString returns a non-empty string for non-empty memories', () => {
    const npc = makeNpc();
    const memories = addMemory(npc, 'Met a friend', 'positive', null, 1);
    const ctx = memoryContextString(memories);
    expect(ctx.length).toBeGreaterThan(0);
  });
});

// ── RelationshipSystem ───────────────────────────────────────────────────────

describe('RelationshipSystem', () => {
  it('getRelationship returns neutral for unknown target', () => {
    const npc = makeNpc();
    const rel = getRelationship(npc, 'player');
    expect(rel.affection).toBe(0);
    expect(rel.trust).toBe(0);
  });

  it('applyInteraction increases affection on positive outcome', () => {
    const npc = makeNpc();
    const rel = getRelationship(npc, 'player');
    const updated = applyInteraction(rel, 'positive', 1);
    expect(updated.affection).toBeGreaterThan(0);
    expect(updated.familiarity).toBeGreaterThan(0);
  });

  it('applyFear increases fear and reduces trust', () => {
    const npc = makeNpc();
    const rel = getRelationship(npc, 'player');
    const updated = applyFear(rel, 30);
    expect(updated.fear).toBeGreaterThan(0);
    expect(updated.trust).toBeLessThan(0);
  });

  it('relationshipLabel returns Terrified when fear is very high', () => {
    const rel = { target_id: 'x', affection: 0, trust: 0, fear: 80, familiarity: 0, last_interaction: 0 };
    expect(relationshipLabel(rel)).toBe('Terrified');
  });

  it('relationshipLabel returns Devoted for high affection + trust', () => {
    const rel = { target_id: 'x', affection: 80, trust: 60, fear: 0, familiarity: 50, last_interaction: 0 };
    expect(relationshipLabel(rel)).toBe('Devoted');
  });
});

// ── EconomySystem ────────────────────────────────────────────────────────────

describe('EconomySystem', () => {
  it('initEconomy creates a valid entry list', () => {
    const economy = initEconomy();
    expect(economy.length).toBeGreaterThan(0);
    economy.forEach(e => {
      expect(e.base_price).toBeGreaterThan(0);
      expect(e.current_price).toBeGreaterThan(0);
    });
  });

  it('updatePrices raises price when demand > supply', () => {
    const economy = initEconomy().map(e => ({ ...e, supply: 10, demand: 90 }));
    const updated = updatePrices(economy);
    updated.forEach(e => {
      expect(e.current_price).toBeGreaterThanOrEqual(e.base_price);
    });
  });

  it('getPrice returns current_price for known resource', () => {
    const economy = initEconomy();
    const price = getPrice(economy, 'bread');
    expect(price).toBeGreaterThan(0);
  });

  it('collectWage returns positive gold for non-none job', () => {
    expect(collectWage('merchant')).toBeGreaterThan(0);
    expect(collectWage('none')).toBe(0);
  });

  it('produceGoods increases supply for farmer producing grain', () => {
    const economy = initEconomy();
    const before = economy.find(e => e.resource === 'grain')!.supply;
    const after = produceGoods(economy, 'farmer').find(e => e.resource === 'grain')!.supply;
    expect(after).toBeGreaterThan(before);
  });
});

// ── TimeSystem ───────────────────────────────────────────────────────────────

describe('TimeSystem', () => {
  it('advanceTime increases hour', () => {
    const world = makeWorld({ hour: 10 });
    const next = advanceTime(world, 3);
    expect(next.hour).toBe(13);
  });

  it('advanceTime rolls over midnight and increments day', () => {
    const world = makeWorld({ hour: 23, day: 1 });
    const next = advanceTime(world, 2);
    expect(next.day).toBe(2);
    expect(next.hour).toBe(1);
  });

  it('timeOfDayLabel returns correct label', () => {
    expect(timeOfDayLabel(9)).toBe('Morning');
    expect(timeOfDayLabel(22)).toBe('Night');
  });

  it('isDay returns true between 6 and 20', () => {
    expect(isDay(12)).toBe(true);
    expect(isDay(23)).toBe(false);
  });

  it('scheduledActivity returns sleeping during sleep hours', () => {
    const schedule = buildDefaultSchedule('merchant');
    expect(scheduledActivity(schedule, 2)).toBe('sleeping');
  });

  it('scheduledActivity returns working during work hours', () => {
    const schedule = buildDefaultSchedule('merchant');
    expect(scheduledActivity(schedule, 10)).toBe('working');
  });
});

// ── ProceduralGen ────────────────────────────────────────────────────────────

describe('ProceduralGen', () => {
  it('generateNpc returns a valid NPC with required fields', () => {
    const npc = generateNpc(42, 'loc_town_0');
    expect(npc.id).toBeDefined();
    expect(npc.name.length).toBeGreaterThan(2);
    expect(npc.traits.length).toBeGreaterThanOrEqual(2);
  });

  it('generateNpc is deterministic with the same seed', () => {
    expect(generateNpc(99, 'loc').name).toBe(generateNpc(99, 'loc').name);
  });

  it('generateWorldLocations returns at least 5 locations', () => {
    const locs = generateWorldLocations(1);
    expect(locs.length).toBeGreaterThanOrEqual(5);
  });

  it('generateStartingWorld returns npcs and economy', () => {
    const { npcs, economy, locations } = generateStartingWorld(7);
    expect(npcs.length).toBeGreaterThan(0);
    expect(economy.length).toBeGreaterThan(0);
    expect(locations.length).toBeGreaterThan(0);
  });

  it('generateRandomEvent returns a non-empty string', () => {
    expect(generateRandomEvent(1).length).toBeGreaterThan(0);
  });
});

// ── SimulationEngine ─────────────────────────────────────────────────────────

describe('SimulationEngine', () => {
  it('tickSimulation advances the turn counter', () => {
    const world = makeWorld({ turn: 0 });
    const next = tickSimulation(world);
    expect(next.turn).toBe(1);
  });

  it('tickSimulation advances the hour', () => {
    const world = makeWorld({ hour: 10 });
    const next = tickSimulation(world);
    expect(next.hour).toBe(11);
  });

  it('tickSimulation processes NPC needs without crashing', () => {
    const npc = makeNpc({ needs: { hunger: 50, energy: 50, social: 50, happiness: 50, wealth: 30 } });
    const world = makeWorld({ npcs: [npc] });
    const next = tickSimulation(world);
    expect(next.npcs.length).toBe(1);
    expect(next.npcs[0].needs).toBeDefined();
  });

  it('tickSimulation does not mutate the original world', () => {
    const world = makeWorld();
    const original = world.turn;
    tickSimulation(world);
    expect(world.turn).toBe(original);
  });

  it('tickSimulation NPC needs remain in valid range after many ticks', () => {
    const npc = makeNpc();
    let world = makeWorld({ npcs: [npc] });
    for (let i = 0; i < 50; i++) {
      world = tickSimulation(world);
    }
    world.npcs.forEach(n => {
      for (const val of Object.values(n.needs)) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }
    });
  });
});
