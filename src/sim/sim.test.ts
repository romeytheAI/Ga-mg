import { describe, it, expect } from 'vitest';
import { decayNeeds, needUrgency, mostUrgentNeed, hasNeedCrisis, applyActivityEffect, computeHappinessDelta } from './NeedsSystem';
import { selectBestAction } from './UtilityAI';
import { addMemory, decayMemories, sentimentScore, memoryContextString } from './MemorySystem';
import { getRelationship, applyInteraction, applyFear, relationshipLabel } from './RelationshipSystem';
import { initEconomy, produceGoods, updatePrices, getPrice, collectWage } from './EconomySystem';
import { advanceTime, timeOfDayLabel, isDay, buildDefaultSchedule, scheduledActivity } from './TimeSystem';
import { generateNpc, generateWorldLocations, generateStartingWorld, generateRandomEvent } from './ProceduralGen';
import { tickSimulation } from './SimulationEngine';
import { defaultSkills, improveSkill, trainSkillsFromActivity, skillLevelLabel, overallCompetence } from './SkillsSystem';
import { defaultCorruptionState, tickCorruptionState, applyStress, applyTrauma, applyCorruption, corruptionLabel, hasBreakdown, isWillBroken } from './CorruptionSystem';
import { defaultFame, decayFame, gainFameFromActivity, addFame, totalFame, totalNotoriety, fameLabel, notorietyLabel } from './FameSystem';
import { defaultClothingLoadout, emptyClothingLoadout, damageClothing, createClothingItem, applyWear, totalConcealment, isExposed, coldExposureStress, clothingStateLabel } from './ClothingSystem';
import { npcToParticipant, createCombatEncounter, resolveCombatTurn, simulateFullCombat, changeStance, selectAIStance } from './CombatSystem';
import { mentalFortitude, canResist, stressFromNeeds, decisionQuality, applyDefeatConsequences, applyVictoryConsequences } from './WillpowerSystem';
import { shouldTravel, encounterChance, dangerLabel, getNpcsAtLocation } from './LocationSystem';
import { defaultRomanceState, calculateCompatibility, calculateAttraction, applyRomanticInteraction, evaluateRomanceProgression, tickRomance, wantsRomanticInteraction, romanceStageLabel, romanceUtilityScore } from './RomanceSystem';
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
    skills: defaultSkills(),
    corruption_state: defaultCorruptionState(),
    fame: defaultFame(),
    clothing: defaultClothingLoadout(),
    memory: [],
    relationships: [],
    current_state: 'idle',
    location_id: 'town',
    target_location_id: null,
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
    active_combats: [],
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
    const rel = { target_id: 'x', affection: 0, trust: 0, fear: 80, familiarity: 0, last_interaction: 0, romance: null };
    expect(relationshipLabel(rel)).toBe('Terrified');
  });

  it('relationshipLabel returns Devoted for high affection + trust', () => {
    const rel = { target_id: 'x', affection: 80, trust: 60, fear: 0, familiarity: 50, last_interaction: 0, romance: null };
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

  it('tickSimulation updates NPC skills over many ticks', () => {
    const npc = makeNpc();
    let world = makeWorld({ npcs: [npc] });
    for (let i = 0; i < 50; i++) {
      world = tickSimulation(world);
    }
    // Some skill should have increased from activity
    const totalSkill = Object.values(world.npcs[0].skills).reduce((a, b) => a + b, 0);
    expect(totalSkill).toBeGreaterThan(0);
  });

  it('tickSimulation maintains active_combats array', () => {
    const world = makeWorld();
    const next = tickSimulation(world);
    expect(Array.isArray(next.active_combats)).toBe(true);
  });
});

// ── SkillsSystem ─────────────────────────────────────────────────────────────

describe('SkillsSystem', () => {
  it('defaultSkills returns all skills at 0', () => {
    const skills = defaultSkills();
    for (const val of Object.values(skills)) {
      expect(val).toBe(0);
    }
  });

  it('improveSkill increases a skill value', () => {
    const skills = defaultSkills();
    const improved = improveSkill(skills, 'athletics', 10);
    expect(improved.athletics).toBe(10);
  });

  it('improveSkill clamps at 100', () => {
    const skills = { ...defaultSkills(), athletics: 95 };
    const improved = improveSkill(skills, 'athletics', 20);
    expect(improved.athletics).toBe(100);
  });

  it('trainSkillsFromActivity improves relevant skills for working', () => {
    const npc = makeNpc({ current_state: 'working' });
    const trained = trainSkillsFromActivity(npc, 'working', 2);
    expect(trained.housekeeping).toBeGreaterThan(0);
  });

  it('trainSkillsFromActivity improves athletics for exercising', () => {
    const npc = makeNpc();
    const trained = trainSkillsFromActivity(npc, 'exercising', 2);
    expect(trained.athletics).toBeGreaterThan(0);
  });

  it('skillLevelLabel returns correct labels', () => {
    expect(skillLevelLabel(0)).toBe('Untrained');
    expect(skillLevelLabel(50)).toBe('Skilled');
    expect(skillLevelLabel(95)).toBe('Master');
  });

  it('overallCompetence returns average of all skills', () => {
    const skills = { ...defaultSkills(), athletics: 50, combat: 50 };
    const comp = overallCompetence(skills);
    expect(comp).toBeCloseTo(100 / 7, 1); // 100 across 7 skills
  });
});

// ── CorruptionSystem ─────────────────────────────────────────────────────────

describe('CorruptionSystem', () => {
  it('defaultCorruptionState returns valid defaults', () => {
    const state = defaultCorruptionState();
    expect(state.corruption).toBe(0);
    expect(state.purity).toBe(100);
    expect(state.willpower).toBe(70);
  });

  it('tickCorruptionState reduces stress passively', () => {
    const npc = makeNpc({
      corruption_state: { ...defaultCorruptionState(), stress: 50 },
    });
    const ticked = tickCorruptionState(npc, 1);
    expect(ticked.stress).toBeLessThan(50);
  });

  it('applyStress increases stress', () => {
    const state = defaultCorruptionState();
    const stressed = applyStress(state, 20);
    expect(stressed.stress).toBeGreaterThan(state.stress);
  });

  it('applyTrauma increases trauma and stress', () => {
    const state = defaultCorruptionState();
    const traumatized = applyTrauma(state, 15);
    expect(traumatized.trauma).toBeGreaterThan(0);
    expect(traumatized.stress).toBeGreaterThan(state.stress);
  });

  it('applyCorruption increases corruption and reduces purity', () => {
    const state = defaultCorruptionState();
    const corrupted = applyCorruption(state, 20);
    expect(corrupted.corruption).toBeGreaterThan(0);
    expect(corrupted.purity).toBeLessThan(100);
  });

  it('corruptionLabel returns correct labels', () => {
    expect(corruptionLabel(0)).toBe('Pure');
    expect(corruptionLabel(50)).toBe('Corrupted');
    expect(corruptionLabel(95)).toBe('Utterly Corrupt');
  });

  it('hasBreakdown detects high stress + low control', () => {
    const state = { ...defaultCorruptionState(), stress: 95, control: 5 };
    expect(hasBreakdown(state)).toBe(true);
  });

  it('isWillBroken detects broken will', () => {
    const state = { ...defaultCorruptionState(), willpower: 2, stress: 80 };
    expect(isWillBroken(state)).toBe(true);
  });
});

// ── FameSystem ───────────────────────────────────────────────────────────────

describe('FameSystem', () => {
  it('defaultFame returns all fame at 0', () => {
    const fame = defaultFame();
    for (const val of Object.values(fame)) {
      expect(val).toBe(0);
    }
  });

  it('addFame increases a specific fame type', () => {
    const fame = defaultFame();
    const updated = addFame(fame, 'social', 15);
    expect(updated.social).toBe(15);
  });

  it('decayFame reduces fame values', () => {
    const fame = { ...defaultFame(), social: 10, crime: 10 };
    const decayed = decayFame(fame);
    expect(decayed.social).toBeLessThan(10);
    expect(decayed.crime).toBeLessThan(10);
  });

  it('gainFameFromActivity increases fame for socializing', () => {
    const npc = makeNpc();
    const fame = gainFameFromActivity(npc, 'socializing', 1);
    expect(fame.social).toBeGreaterThan(0);
  });

  it('totalFame sums positive fame types', () => {
    const fame = { ...defaultFame(), social: 30, wealth_fame: 20, combat_fame: 10 };
    expect(totalFame(fame)).toBe(60);
  });

  it('totalNotoriety sums crime + infamy', () => {
    const fame = { ...defaultFame(), crime: 40, infamy: 30 };
    expect(totalNotoriety(fame)).toBe(70);
  });

  it('fameLabel returns correct labels', () => {
    expect(fameLabel(defaultFame())).toBe('Unknown');
    expect(fameLabel({ ...defaultFame(), social: 80, wealth_fame: 50, combat_fame: 20 })).toBe('Famous');
  });

  it('notorietyLabel returns correct labels', () => {
    expect(notorietyLabel(defaultFame())).toBe('Clean');
    expect(notorietyLabel({ ...defaultFame(), crime: 60, infamy: 50 })).toBe('Notorious');
  });
});

// ── ClothingSystem ───────────────────────────────────────────────────────────

describe('ClothingSystem', () => {
  it('defaultClothingLoadout provides basic clothing', () => {
    const loadout = defaultClothingLoadout();
    expect(loadout.chest).not.toBeNull();
    expect(loadout.legs).not.toBeNull();
    expect(loadout.head).toBeNull(); // no hat by default
  });

  it('damageClothing reduces integrity', () => {
    const item = createClothingItem('test', 'Test', 'chest');
    const damaged = damageClothing(item, 30);
    expect(damaged).not.toBeNull();
    expect(damaged!.integrity).toBe(70);
  });

  it('damageClothing returns null when destroyed', () => {
    const item = createClothingItem('test', 'Test', 'chest');
    const destroyed = damageClothing(item, 150);
    expect(destroyed).toBeNull();
  });

  it('applyWear degrades clothing during hostile activity', () => {
    const loadout = defaultClothingLoadout();
    const worn = applyWear(loadout, 'hostile', 1);
    if (worn.chest) {
      expect(worn.chest.integrity).toBeLessThan(100);
    }
  });

  it('totalConcealment returns value between 0-1', () => {
    const loadout = defaultClothingLoadout();
    const concealment = totalConcealment(loadout);
    expect(concealment).toBeGreaterThan(0);
    expect(concealment).toBeLessThanOrEqual(1);
  });

  it('isExposed returns true for empty loadout', () => {
    expect(isExposed(emptyClothingLoadout())).toBe(true);
  });

  it('isExposed returns false for default loadout', () => {
    expect(isExposed(defaultClothingLoadout())).toBe(false);
  });

  it('coldExposureStress returns 0 for warm weather', () => {
    expect(coldExposureStress(defaultClothingLoadout(), 'Sunny')).toBe(0);
  });

  it('coldExposureStress returns positive for cold weather with empty loadout', () => {
    expect(coldExposureStress(emptyClothingLoadout(), 'Blizzard')).toBeGreaterThan(0);
  });

  it('clothingStateLabel returns correct labels', () => {
    expect(clothingStateLabel(emptyClothingLoadout())).toBe('Naked');
    expect(clothingStateLabel(defaultClothingLoadout())).toBe('Partially Dressed');
  });
});

// ── CombatSystem ─────────────────────────────────────────────────────────────

describe('CombatSystem', () => {
  it('npcToParticipant creates valid participant', () => {
    const npc = makeNpc();
    const participant = npcToParticipant(npc);
    expect(participant.id).toBe('npc_test');
    expect(participant.health).toBe(100);
  });

  it('createCombatEncounter creates an ongoing encounter', () => {
    const encounter = createCombatEncounter('a', 'b');
    expect(encounter.resolved).toBe(false);
    expect(encounter.outcome).toBe('ongoing');
    expect(encounter.turn_count).toBe(0);
  });

  it('resolveCombatTurn increments turn count', () => {
    const atk = npcToParticipant(makeNpc({ id: 'atk', skills: { ...defaultSkills(), combat: 50 } }));
    const def = npcToParticipant(makeNpc({ id: 'def', skills: { ...defaultSkills(), combat: 30 } }));
    const encounter = createCombatEncounter('atk', 'def');
    const result = resolveCombatTurn(atk, def, encounter);
    expect(result.encounter.turn_count).toBe(1);
  });

  it('simulateFullCombat resolves within max turns', () => {
    const atk = npcToParticipant(makeNpc({ id: 'atk', skills: { ...defaultSkills(), combat: 60 } }));
    const def = npcToParticipant(makeNpc({ id: 'def', skills: { ...defaultSkills(), combat: 20 } }));
    const result = simulateFullCombat(atk, def, 30);
    expect(result.encounter.resolved).toBe(true);
    expect(['attacker_wins', 'defender_wins', 'defender_escaped']).toContain(result.encounter.outcome);
  });

  it('changeStance updates participant stance', () => {
    const p = npcToParticipant(makeNpc());
    const updated = changeStance(p, 'aggressive');
    expect(updated.stance).toBe('aggressive');
  });

  it('selectAIStance returns evasive when health is low', () => {
    const p = { ...npcToParticipant(makeNpc()), health: 10 };
    expect(selectAIStance(p)).toBe('evasive');
  });

  it('selectAIStance returns defensive when stamina is low', () => {
    const p = { ...npcToParticipant(makeNpc()), health: 50, stamina: 10 };
    expect(selectAIStance(p)).toBe('defensive');
  });
});

// ── WillpowerSystem ──────────────────────────────────────────────────────────

describe('WillpowerSystem', () => {
  it('mentalFortitude returns high value for healthy state', () => {
    const state = defaultCorruptionState();
    const fort = mentalFortitude(state);
    expect(fort).toBeGreaterThan(50);
  });

  it('mentalFortitude returns low value for stressed/traumatized state', () => {
    const state = { ...defaultCorruptionState(), stress: 90, trauma: 80, willpower: 10, control: 10 };
    const fort = mentalFortitude(state);
    expect(fort).toBeLessThan(20);
  });

  it('canResist returns true for easy checks with strong will', () => {
    const state = defaultCorruptionState();
    expect(canResist(state, 10)).toBe(true);
  });

  it('canResist returns false for hard checks with broken will', () => {
    const state = { ...defaultCorruptionState(), willpower: 5, control: 5, stress: 90 };
    expect(canResist(state, 50)).toBe(false);
  });

  it('stressFromNeeds increases stress when hunger is low', () => {
    const state = defaultCorruptionState();
    const needs = { hunger: 5, energy: 80, social: 80, happiness: 80, wealth: 50 };
    const updated = stressFromNeeds(state, needs);
    expect(updated.stress).toBeGreaterThan(state.stress);
  });

  it('decisionQuality returns higher value for healthy state', () => {
    const healthy = defaultCorruptionState();
    const broken = { ...defaultCorruptionState(), stress: 90, willpower: 5, control: 5, trauma: 80 };
    expect(decisionQuality(healthy)).toBeGreaterThan(decisionQuality(broken));
  });

  it('applyDefeatConsequences increases trauma and stress', () => {
    const state = defaultCorruptionState();
    const defeated = applyDefeatConsequences(state);
    expect(defeated.trauma).toBeGreaterThan(state.trauma);
    expect(defeated.stress).toBeGreaterThan(state.stress);
  });

  it('applyVictoryConsequences improves willpower', () => {
    const state = { ...defaultCorruptionState(), willpower: 50 };
    const victorious = applyVictoryConsequences(state);
    expect(victorious.willpower).toBeGreaterThan(50);
  });
});

// ── LocationSystem ───────────────────────────────────────────────────────────

describe('LocationSystem', () => {
  it('encounterChance is higher for dangerous locations', () => {
    const safeLoc = { id: 'safe', name: 'Safe', type: 'home' as const, x: 0, y: 0, danger: 0.05, prosperity: 0.5, npcs_present: [] };
    const dangerLoc = { id: 'danger', name: 'Danger', type: 'dungeon' as const, x: 0, y: 0, danger: 0.8, prosperity: 0.1, npcs_present: [] };
    expect(encounterChance(dangerLoc, 12, 0)).toBeGreaterThan(encounterChance(safeLoc, 12, 0));
  });

  it('encounterChance is higher at night', () => {
    const loc = { id: 'test', name: 'Test', type: 'town' as const, x: 0, y: 0, danger: 0.3, prosperity: 0.5, npcs_present: [] };
    expect(encounterChance(loc, 23, 0)).toBeGreaterThan(encounterChance(loc, 12, 0));
  });

  it('encounterChance increases with infamy', () => {
    const loc = { id: 'test', name: 'Test', type: 'town' as const, x: 0, y: 0, danger: 0.3, prosperity: 0.5, npcs_present: [] };
    expect(encounterChance(loc, 12, 80)).toBeGreaterThan(encounterChance(loc, 12, 0));
  });

  it('dangerLabel returns correct labels', () => {
    expect(dangerLabel(0.1)).toBe('Safe');
    expect(dangerLabel(0.5)).toBe('Risky');
    expect(dangerLabel(0.9)).toBe('Extremely Dangerous');
  });

  it('getNpcsAtLocation filters by location', () => {
    const world = makeWorld({
      npcs: [
        makeNpc({ id: 'a', location_id: 'town' }),
        makeNpc({ id: 'b', location_id: 'market' }),
        makeNpc({ id: 'c', location_id: 'town' }),
      ],
    });
    const atTown = getNpcsAtLocation(world, 'town');
    expect(atTown.length).toBe(2);
  });
});

// ── RomanceSystem ────────────────────────────────────────────────────────────

describe('RomanceSystem', () => {
  it('defaultRomanceState returns stage none', () => {
    const state = defaultRomanceState();
    expect(state.stage).toBe('none');
    expect(state.attraction).toBe(0);
  });

  it('calculateCompatibility returns higher for compatible traits', () => {
    const compat = calculateCompatibility(['brave', 'loyal'], ['loyal', 'generous']);
    const incompat = calculateCompatibility(['treacherous'], ['loyal']);
    expect(compat).toBeGreaterThan(incompat);
  });

  it('calculateAttraction returns positive for friendly NPCs', () => {
    const npcA = makeNpc({ id: 'a', traits: ['flirtatious'], skills: { ...defaultSkills(), seduction: 40 } });
    const npcB = makeNpc({ id: 'b', traits: ['flirtatious'] });
    const rel = { target_id: 'b', affection: 30, trust: 20, fear: 0, familiarity: 40, last_interaction: 0, romance: null };
    const attraction = calculateAttraction(npcA, npcB, rel);
    expect(attraction).toBeGreaterThan(0);
  });

  it('applyRomanticInteraction increases intimacy on positive outcome', () => {
    const romance = { ...defaultRomanceState(), stage: 'flirting' as const, attraction: 40 };
    const rel = { target_id: 'b', affection: 30, trust: 20, fear: 0, familiarity: 40, last_interaction: 0, romance };
    const result = applyRomanticInteraction(romance, rel, 'positive', 10);
    expect(result.romance.intimacy).toBeGreaterThan(0);
    expect(result.romance.dates_count).toBe(1);
  });

  it('applyRomanticInteraction rejects after 3 negative interactions', () => {
    const romance = { ...defaultRomanceState(), stage: 'flirting' as const, attraction: 40, rejection_count: 2 };
    const rel = { target_id: 'b', affection: 10, trust: 10, fear: 0, familiarity: 30, last_interaction: 0, romance };
    const result = applyRomanticInteraction(romance, rel, 'negative', 10);
    expect(result.romance.stage).toBe('rejected');
  });

  it('evaluateRomanceProgression advances stage when thresholds met', () => {
    const romance = { ...defaultRomanceState(), stage: 'attracted' as const, attraction: 40, intimacy: 15 };
    const rel = { target_id: 'b', affection: 30, trust: 20, fear: 0, familiarity: 25, last_interaction: 0, romance };
    const advanced = evaluateRomanceProgression(romance, rel);
    expect(advanced.stage).toBe('flirting');
  });

  it('tickRomance decays passion without interaction', () => {
    const romance = { ...defaultRomanceState(), stage: 'dating' as const, passion: 50, last_date_turn: 0 };
    const rel = { target_id: 'b', affection: 30, trust: 20, fear: 0, familiarity: 50, last_interaction: 0, romance };
    const ticked = tickRomance(romance, rel, 50);
    expect(ticked.passion).toBeLessThan(50);
  });

  it('wantsRomanticInteraction returns false for none stage', () => {
    const romance = defaultRomanceState();
    expect(wantsRomanticInteraction(romance, 100)).toBe(false);
  });

  it('romanceStageLabel returns correct labels', () => {
    expect(romanceStageLabel('none')).toBe('No Interest');
    expect(romanceStageLabel('dating')).toBe('Dating');
    expect(romanceStageLabel('committed')).toBe('Committed');
  });

  it('romanceUtilityScore returns 0 for no romance', () => {
    const romance = defaultRomanceState();
    const rel = { target_id: 'b', affection: 0, trust: 0, fear: 0, familiarity: 0, last_interaction: 0, romance: null };
    expect(romanceUtilityScore(romance, rel)).toBe(0);
  });

  it('romanceUtilityScore returns positive for active romance', () => {
    const romance = { ...defaultRomanceState(), stage: 'dating' as const, passion: 60, attraction: 50, intimacy: 40 };
    const rel = { target_id: 'b', affection: 40, trust: 30, fear: 0, familiarity: 50, last_interaction: 0, romance };
    expect(romanceUtilityScore(romance, rel)).toBeGreaterThan(0);
  });
});
