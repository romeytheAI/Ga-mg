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
import { defaultTransformationState, addBodyChange, removeBodyChange, purgeTemporaryChanges, transformationStatEffects, evaluateAscension, tickAscension, ascensionLabel, mutationResistanceLabel } from './TransformationSystem';
import { defaultAddictionState, useSubstance, tickAddiction, withdrawalStress, withdrawalStaminaDrain, dependencyLabel, withdrawalLabel } from './AddictionSystem';
import { defaultDiseaseState, contractDisease, treatDisease, tickDisease, diseaseHealthDrain, diseaseStaminaDrain, contagionChance, diseaseSeverityLabel, overallHealthLabel } from './DiseaseSystem';
import { defaultArcaneState, addEnchantment, removeEnchantment, enchantmentStatEffects, spendMana, tickArcane, improveAffinity, getAffinity, manaLabel, arcaneCorruptionLabel, affinityLabel } from './ArcaneSystem';
import { defaultParasiteState, attachParasite, removeParasite, purgeAllParasites, tickParasite, totalHealthDrain, totalStaminaDrain, totalCorruptionBuff, symbioticHealthRegen, infestationLabel, symbiosisLabel } from './ParasiteSystem';
import { defaultCompanionState, addCompanion, removeCompanion, tickCompanions, partyCombatBonus, partyHealRate, partyScoutRange, partyCarryCapacity, damageCompanion, checkDesertion, loyaltyLabel, bondLabel, moraleLabel } from './CompanionSystem';
import { defaultAllureState, computeAllure, allureEncounterModifier, intimidationDefense, socialAllureBonus, allureLabel, noticeabilityLabel, intimidationLabel } from './AllureSystem';
import { defaultRestraintState, applyRestraint, removeRestraint, freeAll, attemptEscape, tickRestraints, restraintStress, isRestrained, canMove, canAct, restraintLabel, escapeProgressLabel } from './RestraintSystem';
import { SimNpc, SimWorld, CompanionEntry, RestraintEntry } from './types';
import { defaultFactions, getFactionStanding, applyRepDelta, computeRivalDeltas, applyMultiRepDelta, meetsStanding, getFactionRep, merchantPriceMultiplier, driftFactions, dissolveFaction } from './FactionSystem';
import { defaultCriminalRecord, defaultGuardState, commitCrime, discoverCrime, payBounty, serveSentence, calculateSentence, escalateGuardAlert, tickGuardPursuit, guardStandDown, escapeChance, getActiveCrimes, isWanted, totalBounty, wantedLabel, guardAlertLabel } from './CrimeSystem';

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
    transformation: defaultTransformationState(),
    addiction_state: defaultAddictionState(),
    disease_state: defaultDiseaseState(),
    arcane_state: defaultArcaneState(),
    parasite_state: defaultParasiteState(),
    companion_state: defaultCompanionState(),
    allure_state: defaultAllureState(),
    restraint_state: defaultRestraintState(),
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
    factions: defaultFactions(),
    criminal_records: {},
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

// ── TransformationSystem ─────────────────────────────────────────────────────

describe('TransformationSystem', () => {
  it('defaultTransformationState returns correct defaults', () => {
    const state = defaultTransformationState();
    expect(state.ascension).toBe('none');
    expect(state.ascension_progress).toBe(0);
    expect(state.body_changes).toHaveLength(0);
    expect(state.mutation_resistance).toBe(50);
  });

  it('addBodyChange appends a change', () => {
    const state = defaultTransformationState();
    const change = { id: 'c1', type: 'cosmetic' as const, description: 'Glowing eyes', turn_acquired: 1, permanent: true, stat_effects: { allure: 5 } };
    const updated = addBodyChange(state, change);
    expect(updated.body_changes.length).toBeGreaterThanOrEqual(1);
  });

  it('removeBodyChange removes by id', () => {
    const state = defaultTransformationState();
    const change = { id: 'c1', type: 'cosmetic' as const, description: 'Glowing eyes', turn_acquired: 1, permanent: true, stat_effects: {} };
    const withChange = { ...state, body_changes: [change] };
    const removed = removeBodyChange(withChange, 'c1');
    expect(removed.body_changes).toHaveLength(0);
  });

  it('purgeTemporaryChanges removes non-permanent changes', () => {
    const state = {
      ...defaultTransformationState(),
      body_changes: [
        { id: 'c1', type: 'cosmetic' as const, description: 'Temp', turn_acquired: 1, permanent: false, stat_effects: {} },
        { id: 'c2', type: 'structural' as const, description: 'Perm', turn_acquired: 1, permanent: true, stat_effects: {} },
      ],
    };
    const purged = purgeTemporaryChanges(state);
    expect(purged.body_changes).toHaveLength(1);
    expect(purged.body_changes[0].id).toBe('c2');
  });

  it('transformationStatEffects computes net bonuses', () => {
    const state = {
      ...defaultTransformationState(),
      body_changes: [
        { id: 'c1', type: 'cosmetic' as const, description: 'A', turn_acquired: 1, permanent: true, stat_effects: { health: 5, allure: 3 } },
        { id: 'c2', type: 'cosmetic' as const, description: 'B', turn_acquired: 2, permanent: true, stat_effects: { health: -2, corruption: 10 } },
      ],
    };
    const effects = transformationStatEffects(state);
    expect(effects['health']).toBe(3);
    expect(effects['allure']).toBe(3);
    expect(effects['corruption']).toBe(10);
  });

  it('evaluateAscension returns pure_soul for high purity low corruption', () => {
    const state = defaultTransformationState();
    const corruption = { ...defaultCorruptionState(), corruption: 5, purity: 90 };
    expect(evaluateAscension(state, corruption)).toBe('pure_soul');
  });

  it('evaluateAscension returns none when no path qualifies', () => {
    const state = defaultTransformationState();
    const corruption = { ...defaultCorruptionState(), corruption: 50, purity: 50 };
    expect(evaluateAscension(state, corruption)).toBe('none');
  });

  it('tickAscension progresses toward qualifying path', () => {
    const state = defaultTransformationState();
    const corruption = { ...defaultCorruptionState(), corruption: 5, purity: 90 };
    const ticked = tickAscension(state, corruption, 1);
    expect(ticked.ascension_progress).toBeGreaterThan(0);
    expect(ticked.ascension).toBe('pure_soul');
  });

  it('ascensionLabel returns readable labels', () => {
    expect(ascensionLabel('none')).toBe('Unascended');
    expect(ascensionLabel('void_lord')).toBe('Void Lord');
  });

  it('mutationResistanceLabel returns labels based on resistance', () => {
    expect(mutationResistanceLabel(90)).toBe('Highly Resistant');
    expect(mutationResistanceLabel(10)).toBe('Highly Susceptible');
  });
});

// ── AddictionSystem ──────────────────────────────────────────────────────────

describe('AddictionSystem', () => {
  it('defaultAddictionState returns clean state', () => {
    const state = defaultAddictionState();
    expect(state.addictions).toHaveLength(0);
    expect(state.overall_dependency).toBe(0);
  });

  it('useSubstance creates a new addiction entry', () => {
    const state = defaultAddictionState();
    const result = useSubstance(state, 'alcohol', 1);
    expect(result.addiction_state.addictions).toHaveLength(1);
    expect(result.addiction_state.addictions[0].substance).toBe('alcohol');
    expect(result.stress_relief).toBeGreaterThan(0);
  });

  it('useSubstance increases dependency with repeated use', () => {
    let state = defaultAddictionState();
    state = useSubstance(state, 'skooma', 1).addiction_state;
    const dep1 = state.addictions[0].dependency;
    state = useSubstance(state, 'skooma', 2).addiction_state;
    expect(state.addictions[0].dependency).toBeGreaterThan(dep1);
  });

  it('tolerance reduces effectiveness', () => {
    let state = defaultAddictionState();
    const first = useSubstance(state, 'moonsugar', 1);
    // Manually set high tolerance
    state = { ...first.addiction_state, addictions: first.addiction_state.addictions.map(a => ({ ...a, tolerance: 80 })) };
    const second = useSubstance(state, 'moonsugar', 2);
    expect(second.stress_relief).toBeLessThan(first.stress_relief);
  });

  it('tickAddiction causes withdrawal after onset period', () => {
    let state = defaultAddictionState();
    state = useSubstance(state, 'skooma', 1).addiction_state;
    // Simulate time passing (30 turns past last use)
    state = { ...state, addictions: state.addictions.map(a => ({ ...a, dependency: 50, last_use_turn: 0 })) };
    const ticked = tickAddiction(state, 30, 1);
    expect(ticked.addictions[0].withdrawal).toBeGreaterThan(0);
  });

  it('withdrawalStress returns stress from active withdrawal', () => {
    const state = { ...defaultAddictionState(), addictions: [{ substance: 'alcohol' as const, dependency: 60, tolerance: 30, withdrawal: 50, last_use_turn: 0, total_uses: 10 }] };
    expect(withdrawalStress(state)).toBeGreaterThan(0);
  });

  it('withdrawalStaminaDrain returns drain from withdrawal', () => {
    const state = { ...defaultAddictionState(), addictions: [{ substance: 'alcohol' as const, dependency: 60, tolerance: 30, withdrawal: 50, last_use_turn: 0, total_uses: 10 }] };
    expect(withdrawalStaminaDrain(state)).toBeGreaterThan(0);
  });

  it('dependencyLabel returns correct labels', () => {
    expect(dependencyLabel(0)).toBe('Clean');
    expect(dependencyLabel(90)).toBe('Crippling');
    expect(dependencyLabel(50)).toBe('Moderate');
  });

  it('withdrawalLabel returns correct labels', () => {
    expect(withdrawalLabel(0)).toBe('None');
    expect(withdrawalLabel(90)).toBe('Agonizing');
  });
});

// ── DiseaseSystem ────────────────────────────────────────────────────────────

describe('DiseaseSystem', () => {
  it('defaultDiseaseState returns healthy state', () => {
    const state = defaultDiseaseState();
    expect(state.active_diseases).toHaveLength(0);
    expect(state.overall_health_penalty).toBe(0);
  });

  it('contractDisease adds disease entry', () => {
    const state = defaultDiseaseState();
    const infected = contractDisease(state, 'ataxia', 1);
    expect(infected.active_diseases).toHaveLength(1);
    expect(infected.active_diseases[0].disease).toBe('ataxia');
    expect(infected.active_diseases[0].severity).toBe(5);
  });

  it('contractDisease does not duplicate existing disease', () => {
    let state = defaultDiseaseState();
    state = contractDisease(state, 'ataxia', 1);
    state = contractDisease(state, 'ataxia', 2);
    expect(state.active_diseases).toHaveLength(1);
  });

  it('treatDisease marks disease as treated', () => {
    let state = defaultDiseaseState();
    state = contractDisease(state, 'rattles', 1);
    state = treatDisease(state, 'rattles');
    expect(state.active_diseases[0].treated).toBe(true);
  });

  it('tickDisease progresses untreated diseases', () => {
    let state = defaultDiseaseState();
    state = contractDisease(state, 'brain_rot', 1);
    const ticked = tickDisease(state, 5);
    expect(ticked.active_diseases[0].severity).toBeGreaterThan(5);
  });

  it('tickDisease reduces severity of treated diseases', () => {
    let state = defaultDiseaseState();
    state = contractDisease(state, 'bone_break_fever', 1);
    state = { ...state, active_diseases: state.active_diseases.map(d => ({ ...d, severity: 40, treated: true })) };
    const ticked = tickDisease(state, 5);
    expect(ticked.active_diseases[0].severity).toBeLessThan(40);
  });

  it('tickDisease grants immunity after recovery', () => {
    let state = defaultDiseaseState();
    state = contractDisease(state, 'bone_break_fever', 1);
    state = { ...state, active_diseases: state.active_diseases.map(d => ({ ...d, severity: 1, treated: true })) };
    const ticked = tickDisease(state, 5);
    expect(ticked.active_diseases).toHaveLength(0);
    expect(ticked.immunities['bone_break_fever']).toBeGreaterThan(0);
  });

  it('diseaseHealthDrain returns drain proportional to severity', () => {
    let state = defaultDiseaseState();
    state = contractDisease(state, 'sanguinare_vampiris', 1);
    state = { ...state, active_diseases: state.active_diseases.map(d => ({ ...d, severity: 80 })) };
    expect(diseaseHealthDrain(state)).toBeGreaterThan(0);
  });

  it('diseaseSeverityLabel returns correct labels', () => {
    expect(diseaseSeverityLabel(0)).toBe('Healthy');
    expect(diseaseSeverityLabel(90)).toBe('Critical');
    expect(diseaseSeverityLabel(50)).toBe('Moderate');
  });

  it('overallHealthLabel returns correct labels', () => {
    expect(overallHealthLabel(0)).toBe('Healthy');
    expect(overallHealthLabel(60)).toBe('Gravely Ill');
  });
});

// ── ArcaneSystem ─────────────────────────────────────────────────────────────

describe('ArcaneSystem', () => {
  it('defaultArcaneState returns correct defaults', () => {
    const state = defaultArcaneState();
    expect(state.mana).toBe(50);
    expect(state.mana_regen).toBe(2);
    expect(state.enchantments).toHaveLength(0);
    expect(state.arcane_corruption).toBe(0);
  });

  it('addEnchantment adds an enchantment', () => {
    const state = defaultArcaneState();
    const ench = { id: 'e1', name: 'Blessing of Light', type: 'blessing' as const, school: 'restoration' as const, potency: 50, duration_remaining: 100, stat_effects: { health: 5 } };
    const updated = addEnchantment(state, ench);
    expect(updated.enchantments).toHaveLength(1);
  });

  it('addEnchantment caps at 8 enchantments', () => {
    let state = defaultArcaneState();
    for (let i = 0; i < 10; i++) {
      state = addEnchantment(state, { id: `e${i}`, name: `Ench ${i}`, type: 'blessing' as const, school: 'ward' as const, potency: 10, duration_remaining: 50, stat_effects: {} });
    }
    expect(state.enchantments).toHaveLength(8);
  });

  it('removeEnchantment removes by id', () => {
    let state = defaultArcaneState();
    const ench = { id: 'e1', name: 'Curse', type: 'curse' as const, school: 'hex' as const, potency: 30, duration_remaining: 50, stat_effects: {} };
    state = addEnchantment(state, ench);
    state = removeEnchantment(state, 'e1');
    expect(state.enchantments).toHaveLength(0);
  });

  it('enchantmentStatEffects computes blessings as positive, curses as negative', () => {
    const state = {
      ...defaultArcaneState(),
      enchantments: [
        { id: 'e1', name: 'B', type: 'blessing' as const, school: 'restoration' as const, potency: 50, duration_remaining: 100, stat_effects: { health: 10 } },
        { id: 'e2', name: 'C', type: 'curse' as const, school: 'hex' as const, potency: 30, duration_remaining: 50, stat_effects: { health: 5 } },
      ],
    };
    const effects = enchantmentStatEffects(state);
    expect(effects['health']).toBe(5); // 10 - 5 = 5
  });

  it('spendMana deducts mana and adds arcane corruption', () => {
    const state = { ...defaultArcaneState(), mana: 80 };
    const result = spendMana(state, 20);
    expect(result).not.toBeNull();
    expect(result!.mana).toBe(60);
    expect(result!.arcane_corruption).toBeGreaterThan(0);
  });

  it('spendMana returns null if insufficient mana', () => {
    const state = { ...defaultArcaneState(), mana: 10 };
    expect(spendMana(state, 50)).toBeNull();
  });

  it('tickArcane regenerates mana', () => {
    const state = { ...defaultArcaneState(), mana: 30 };
    const ticked = tickArcane(state, 5);
    expect(ticked.mana).toBeGreaterThan(30);
  });

  it('tickArcane removes expired enchantments', () => {
    const state = {
      ...defaultArcaneState(),
      enchantments: [
        { id: 'e1', name: 'Temp', type: 'blessing' as const, school: 'ward' as const, potency: 10, duration_remaining: 1, stat_effects: {} },
        { id: 'e2', name: 'Perm', type: 'blessing' as const, school: 'ward' as const, potency: 10, duration_remaining: -1, stat_effects: {} },
      ],
    };
    const ticked = tickArcane(state, 5);
    expect(ticked.enchantments).toHaveLength(1);
    expect(ticked.enchantments[0].id).toBe('e2');
  });

  it('improveAffinity increases school affinity', () => {
    const state = defaultArcaneState();
    const updated = improveAffinity(state, 'destruction', 15);
    expect(getAffinity(updated, 'destruction')).toBe(15);
  });

  it('manaLabel returns correct labels', () => {
    expect(manaLabel(90)).toBe('Overflowing');
    expect(manaLabel(0)).toBe('Empty');
    expect(manaLabel(50)).toBe('Moderate');
  });

  it('arcaneCorruptionLabel returns correct labels', () => {
    expect(arcaneCorruptionLabel(10)).toBe('Stable');
    expect(arcaneCorruptionLabel(90)).toBe('Dangerously Unstable');
  });

  it('affinityLabel returns correct labels', () => {
    expect(affinityLabel(0)).toBe('Untrained');
    expect(affinityLabel(90)).toBe('Master');
  });
});

// ── ParasiteSystem ───────────────────────────────────────────────────────────

describe('ParasiteSystem', () => {
  it('defaultParasiteState returns clean state', () => {
    const state = defaultParasiteState();
    expect(state.parasites).toHaveLength(0);
    expect(state.infestation_level).toBe(0);
  });

  it('attachParasite adds a parasite', () => {
    const state = defaultParasiteState();
    const updated = attachParasite(state, 'blood_leech', 1);
    expect(updated.parasites).toHaveLength(1);
    expect(updated.parasites[0].species).toBe('blood_leech');
  });

  it('attachParasite caps at 5 parasites', () => {
    let state = defaultParasiteState();
    for (let i = 0; i < 7; i++) {
      state = attachParasite(state, 'brain_worm', i);
    }
    expect(state.parasites).toHaveLength(5);
  });

  it('removeParasite removes by index', () => {
    let state = defaultParasiteState();
    state = attachParasite(state, 'void_tick', 1);
    state = attachParasite(state, 'dream_moth', 2);
    state = removeParasite(state, 0);
    expect(state.parasites).toHaveLength(1);
    expect(state.parasites[0].species).toBe('dream_moth');
  });

  it('purgeAllParasites clears everything', () => {
    let state = defaultParasiteState();
    state = attachParasite(state, 'marrow_grub', 1);
    state = attachParasite(state, 'blood_leech', 2);
    const purged = purgeAllParasites(state);
    expect(purged.parasites).toHaveLength(0);
    expect(purged.infestation_level).toBe(0);
  });

  it('tickParasite increases maturity over time', () => {
    let state = defaultParasiteState();
    state = attachParasite(state, 'blood_leech', 1);
    const ticked = tickParasite(state, 10);
    expect(ticked.parasites[0].maturity).toBeGreaterThan(0);
  });

  it('totalHealthDrain returns drain from parasites', () => {
    let state = defaultParasiteState();
    state = attachParasite(state, 'marrow_grub', 1);
    state = { ...state, parasites: state.parasites.map(p => ({ ...p, maturity: 80, health_drain: 2 })) };
    expect(totalHealthDrain(state)).toBeGreaterThan(0);
  });

  it('totalCorruptionBuff returns corruption from parasites', () => {
    let state = defaultParasiteState();
    state = attachParasite(state, 'void_tick', 1);
    state = { ...state, parasites: state.parasites.map(p => ({ ...p, maturity: 80, corruption_buff: 0.5 })) };
    expect(totalCorruptionBuff(state)).toBeGreaterThan(0);
  });

  it('symbioticHealthRegen returns regen from symbiotic parasites', () => {
    let state = defaultParasiteState();
    state = attachParasite(state, 'dream_moth', 1);
    state = { ...state, parasites: state.parasites.map(p => ({ ...p, symbiosis: 80 })) };
    expect(symbioticHealthRegen(state)).toBeGreaterThan(0);
  });

  it('infestationLabel returns correct labels', () => {
    expect(infestationLabel(0)).toBe('Clean');
    expect(infestationLabel(90)).toBe('Overrun');
    expect(infestationLabel(50)).toBe('Infested');
  });

  it('symbiosisLabel returns correct labels', () => {
    expect(symbiosisLabel(0)).toBe('Hostile');
    expect(symbiosisLabel(90)).toBe('Mutualistic');
  });
});

// ── CompanionSystem ──────────────────────────────────────────────────────────

describe('CompanionSystem', () => {
  const makeCompanion = (overrides: Partial<CompanionEntry> = {}): CompanionEntry => ({
    id: 'comp_1',
    name: 'Wolf',
    role: 'fighter',
    loyalty: 60,
    morale: 70,
    health: 100,
    stamina: 80,
    combat_skill: 40,
    bond: 30,
    turns_together: 0,
    ...overrides,
  });

  it('defaultCompanionState returns empty party', () => {
    const state = defaultCompanionState();
    expect(state.companions).toHaveLength(0);
    expect(state.max_party_size).toBe(3);
  });

  it('addCompanion adds to party', () => {
    const state = defaultCompanionState();
    const updated = addCompanion(state, makeCompanion());
    expect(updated.companions).toHaveLength(1);
  });

  it('addCompanion respects max party size', () => {
    let state = defaultCompanionState();
    for (let i = 0; i < 5; i++) {
      state = addCompanion(state, makeCompanion({ id: `comp_${i}` }));
    }
    expect(state.companions).toHaveLength(3);
  });

  it('removeCompanion removes by id', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ id: 'a' }));
    state = addCompanion(state, makeCompanion({ id: 'b' }));
    state = removeCompanion(state, 'a');
    expect(state.companions).toHaveLength(1);
    expect(state.companions[0].id).toBe('b');
  });

  it('tickCompanions increases bond over time', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ bond: 20 }));
    const ticked = tickCompanions(state, 10);
    expect(ticked.companions[0].bond).toBeGreaterThan(20);
  });

  it('partyCombatBonus returns bonus from fighters', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ role: 'fighter', loyalty: 80, morale: 80, health: 100 }));
    expect(partyCombatBonus(state)).toBeGreaterThan(0);
  });

  it('partyHealRate returns healing from healers', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ role: 'healer', loyalty: 80, morale: 80, health: 100 }));
    expect(partyHealRate(state)).toBeGreaterThan(0);
  });

  it('partyScoutRange returns range from scouts', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ role: 'scout', health: 100 }));
    expect(partyScoutRange(state)).toBeGreaterThan(0);
  });

  it('partyCarryCapacity returns capacity from pack_mule', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ role: 'pack_mule', health: 100 }));
    expect(partyCarryCapacity(state)).toBeGreaterThan(0);
  });

  it('damageCompanion reduces health and morale', () => {
    let state = defaultCompanionState();
    state = addCompanion(state, makeCompanion({ id: 'a', health: 80, morale: 70 }));
    state = damageCompanion(state, 'a', 30);
    expect(state.companions[0].health).toBe(50);
    expect(state.companions[0].morale).toBeLessThan(70);
  });

  it('checkDesertion returns true when loyalty and morale are very low', () => {
    expect(checkDesertion(makeCompanion({ loyalty: 5, morale: 10 }))).toBe(true);
    expect(checkDesertion(makeCompanion({ loyalty: 50, morale: 60 }))).toBe(false);
  });

  it('loyaltyLabel returns correct labels', () => {
    expect(loyaltyLabel(90)).toBe('Devoted');
    expect(loyaltyLabel(5)).toBe('Disloyal');
  });

  it('bondLabel returns correct labels', () => {
    expect(bondLabel(90)).toBe('Inseparable');
    expect(bondLabel(5)).toBe('Strangers');
  });

  it('moraleLabel returns correct labels', () => {
    expect(moraleLabel(90)).toBe('Spirited');
    expect(moraleLabel(5)).toBe('Broken');
  });
});

// ── AllureSystem ─────────────────────────────────────────────────────────────

describe('AllureSystem', () => {
  it('defaultAllureState returns correct defaults', () => {
    const state = defaultAllureState();
    expect(state.base_allure).toBe(50);
    expect(state.effective_allure).toBe(50);
  });

  it('computeAllure increases with flirtatious trait', () => {
    const clothing = defaultClothingLoadout();
    const fame = defaultFame();
    const corruption = defaultCorruptionState();
    const base = computeAllure(50, clothing, fame, corruption, []);
    const flirty = computeAllure(50, clothing, fame, corruption, ['flirtatious']);
    expect(flirty.effective_allure).toBeGreaterThan(base.effective_allure);
  });

  it('computeAllure increases intimidation with aggressive trait', () => {
    const clothing = defaultClothingLoadout();
    const fame = defaultFame();
    const corruption = defaultCorruptionState();
    const base = computeAllure(50, clothing, fame, corruption, []);
    const aggressive = computeAllure(50, clothing, fame, corruption, ['aggressive']);
    expect(aggressive.intimidation).toBeGreaterThan(base.intimidation);
  });

  it('computeAllure increases noticeability with fame', () => {
    const clothing = defaultClothingLoadout();
    const fame = { ...defaultFame(), social: 80 };
    const corruption = defaultCorruptionState();
    const result = computeAllure(50, clothing, fame, corruption, []);
    expect(result.noticeability).toBeGreaterThan(0);
  });

  it('allureEncounterModifier returns 0 for low allure', () => {
    const state = { ...defaultAllureState(), effective_allure: 40, noticeability: 10 };
    expect(allureEncounterModifier(state)).toBeGreaterThanOrEqual(0);
    expect(allureEncounterModifier(state)).toBeLessThan(0.1);
  });

  it('intimidationDefense returns defense for high intimidation', () => {
    const state = { ...defaultAllureState(), intimidation: 80 };
    expect(intimidationDefense(state)).toBeGreaterThan(0);
  });

  it('socialAllureBonus returns bonus for high allure', () => {
    const state = { ...defaultAllureState(), effective_allure: 80 };
    expect(socialAllureBonus(state)).toBeGreaterThan(0);
  });

  it('socialAllureBonus returns negative for low allure', () => {
    const state = { ...defaultAllureState(), effective_allure: 20 };
    expect(socialAllureBonus(state)).toBeLessThan(0);
  });

  it('allureLabel returns correct labels', () => {
    expect(allureLabel(90)).toBe('Captivating');
    expect(allureLabel(10)).toBe('Unremarkable');
  });

  it('noticeabilityLabel returns correct labels', () => {
    expect(noticeabilityLabel(90)).toBe('Center of Attention');
    expect(noticeabilityLabel(5)).toBe('Invisible');
  });

  it('intimidationLabel returns correct labels', () => {
    expect(intimidationLabel(90)).toBe('Terrifying');
    expect(intimidationLabel(5)).toBe('Non-threatening');
  });
});

// ── RestraintSystem ──────────────────────────────────────────────────────────

describe('RestraintSystem', () => {
  const makeRestraint = (overrides: Partial<RestraintEntry> = {}): RestraintEntry => ({
    slot: 'wrists',
    name: 'Iron Shackles',
    strength: 60,
    comfort: 30,
    turn_applied: 1,
    ...overrides,
  });

  it('defaultRestraintState returns free state', () => {
    const state = defaultRestraintState();
    expect(state.restraints).toHaveLength(0);
    expect(isRestrained(state)).toBe(false);
  });

  it('applyRestraint adds restraint and computes penalties', () => {
    const state = defaultRestraintState();
    const updated = applyRestraint(state, makeRestraint({ slot: 'ankles' }));
    expect(updated.restraints).toHaveLength(1);
    expect(updated.movement_penalty).toBeGreaterThan(0);
    expect(isRestrained(updated)).toBe(true);
  });

  it('applyRestraint does not duplicate same slot', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists' }));
    state = applyRestraint(state, makeRestraint({ slot: 'wrists', name: 'Different' }));
    expect(state.restraints).toHaveLength(1);
  });

  it('removeRestraint removes by slot', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists' }));
    state = applyRestraint(state, makeRestraint({ slot: 'ankles' }));
    state = removeRestraint(state, 'wrists');
    expect(state.restraints).toHaveLength(1);
    expect(state.restraints[0].slot).toBe('ankles');
  });

  it('freeAll removes all restraints', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists' }));
    state = applyRestraint(state, makeRestraint({ slot: 'ankles' }));
    state = applyRestraint(state, makeRestraint({ slot: 'neck' }));
    const freed = freeAll(state);
    expect(freed.restraints).toHaveLength(0);
    expect(isRestrained(freed)).toBe(false);
  });

  it('attemptEscape progresses escape based on skills', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists', strength: 30 }));
    const skills = { ...defaultSkills(), skulduggery: 60, athletics: 40 };
    const updated = attemptEscape(state, skills, ['brave']);
    expect(updated.escape_progress).toBeGreaterThan(0);
  });

  it('tickRestraints degrades comfort', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists', comfort: 50 }));
    const ticked = tickRestraints(state, 10);
    expect(ticked.restraints[0].comfort).toBeLessThan(50);
  });

  it('restraintStress returns stress from uncomfortable restraints', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists', comfort: 10 }));
    expect(restraintStress(state)).toBeGreaterThan(0);
  });

  it('canMove returns false when ankles and waist are bound', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'ankles' }));
    state = applyRestraint(state, makeRestraint({ slot: 'waist' }));
    state = applyRestraint(state, makeRestraint({ slot: 'wrists' }));
    state = applyRestraint(state, makeRestraint({ slot: 'neck' }));
    state = applyRestraint(state, makeRestraint({ slot: 'mouth' }));
    expect(canMove(state)).toBe(false);
  });

  it('canAct returns true when action penalty is below threshold', () => {
    let state = defaultRestraintState();
    state = applyRestraint(state, makeRestraint({ slot: 'wrists' }));
    // Wrists alone give 0.35 action penalty — still can act
    expect(canAct(state)).toBe(true);
    expect(state.action_penalty).toBeGreaterThan(0);
  });

  it('restraintLabel returns correct labels', () => {
    expect(restraintLabel(defaultRestraintState())).toBe('Free');
    const bound = applyRestraint(defaultRestraintState(), makeRestraint());
    expect(restraintLabel(bound)).toBe('Partially Bound');
  });

  it('escapeProgressLabel returns correct labels', () => {
    expect(escapeProgressLabel(0)).toBe('No Progress');
    expect(escapeProgressLabel(90)).toBe('Almost Free');
  });
});

// ── FactionSystem ────────────────────────────────────────────────────────────

describe('FactionSystem', () => {
  it('defaultFactions returns 8 active factions', () => {
    const factions = defaultFactions();
    expect(factions).toHaveLength(8);
    expect(factions.every(f => f.is_active)).toBe(true);
    expect(factions.every(f => f.reputation === 0)).toBe(true);
  });

  it('getFactionStanding returns correct tiers', () => {
    expect(getFactionStanding(100)).toBe('exalted');
    expect(getFactionStanding(80)).toBe('exalted');
    expect(getFactionStanding(60)).toBe('honored');
    expect(getFactionStanding(30)).toBe('friendly');
    expect(getFactionStanding(0)).toBe('neutral');
    expect(getFactionStanding(-1)).toBe('neutral');
    expect(getFactionStanding(-25)).toBe('unfriendly');
    expect(getFactionStanding(-55)).toBe('hostile');
    expect(getFactionStanding(-100)).toBe('nemesis');
  });

  it('applyRepDelta modifies only the target faction', () => {
    const factions = defaultFactions();
    const updated = applyRepDelta(factions, 'town_guard', 30);
    const guard = updated.find(f => f.id === 'town_guard')!;
    const others = updated.filter(f => f.id !== 'town_guard');
    expect(guard.reputation).toBe(30);
    expect(others.every(f => f.reputation === 0)).toBe(true);
  });

  it('applyRepDelta clamps to [-100, 100]', () => {
    const factions = defaultFactions();
    const up = applyRepDelta(factions, 'church', 200);
    expect(up.find(f => f.id === 'church')!.reputation).toBe(100);
    const down = applyRepDelta(factions, 'church', -200);
    expect(down.find(f => f.id === 'church')!.reputation).toBe(-100);
  });

  it('applyMultiRepDelta applies deltas to multiple factions', () => {
    const factions = defaultFactions();
    const updated = applyMultiRepDelta(factions, {
      town_guard: 20,
      church: -10,
      academia: 5,
    });
    expect(updated.find(f => f.id === 'town_guard')!.reputation).toBe(20);
    expect(updated.find(f => f.id === 'church')!.reputation).toBe(-10);
    expect(updated.find(f => f.id === 'academia')!.reputation).toBe(5);
  });

  it('computeRivalDeltas returns negative spillover for rivals', () => {
    const deltas = computeRivalDeltas('town_guard', 20);
    expect(deltas['thieves_guild']).toBeLessThan(0);
    expect(deltas['underground']).toBeLessThan(0);
  });

  it('computeRivalDeltas works in reverse direction', () => {
    const deltas = computeRivalDeltas('thieves_guild', 30);
    expect(deltas['town_guard']).toBeLessThan(0);
  });

  it('meetsStanding returns true when above required tier', () => {
    const factions = applyRepDelta(defaultFactions(), 'merchants_guild', 60);
    expect(meetsStanding(factions, 'merchants_guild', 'honored')).toBe(true);
    expect(meetsStanding(factions, 'merchants_guild', 'exalted')).toBe(false);
  });

  it('meetsStanding returns false for inactive factions', () => {
    const factions = dissolveFaction(defaultFactions(), 'underground');
    expect(meetsStanding(factions, 'underground', 'neutral')).toBe(false);
  });

  it('getFactionRep returns 0 for unknown faction', () => {
    expect(getFactionRep(defaultFactions(), 'town_guard')).toBe(0);
  });

  it('merchantPriceMultiplier returns less than 1 with positive rep', () => {
    const factions = applyRepDelta(defaultFactions(), 'merchants_guild', 80);
    expect(merchantPriceMultiplier(factions)).toBeLessThan(1.0);
  });

  it('merchantPriceMultiplier returns greater than 1 with negative rep', () => {
    const factions = applyRepDelta(defaultFactions(), 'merchants_guild', -80);
    expect(merchantPriceMultiplier(factions)).toBeGreaterThan(1.0);
  });

  it('driftFactions moves extreme reps toward neutral', () => {
    const factions = applyRepDelta(defaultFactions(), 'nobility', 80);
    const drifted = driftFactions(factions);
    const nob = drifted.find(f => f.id === 'nobility')!;
    expect(nob.reputation).toBeLessThan(80);
  });

  it('driftFactions does not move neutral-band reputations', () => {
    const factions = applyRepDelta(defaultFactions(), 'church', 10);
    const drifted = driftFactions(factions);
    expect(drifted.find(f => f.id === 'church')!.reputation).toBe(10);
  });

  it('dissolveFaction marks faction inactive', () => {
    const factions = dissolveFaction(defaultFactions(), 'thieves_guild');
    expect(factions.find(f => f.id === 'thieves_guild')!.is_active).toBe(false);
    expect(factions.filter(f => f.is_active)).toHaveLength(7);
  });
});

// ── CrimeSystem ─────────────────────────────────────────────────────────────

describe('CrimeSystem', () => {
  it('defaultCriminalRecord starts clean', () => {
    const rec = defaultCriminalRecord();
    expect(rec.total_bounty).toBe(0);
    expect(rec.crimes).toHaveLength(0);
    expect(rec.wanted_by).toHaveLength(0);
    expect(rec.guard_state).toBeNull();
  });

  it('commitCrime adds crime and sets bounty when witnessed', () => {
    const rec = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 10, true);
    expect(rec.crimes).toHaveLength(1);
    expect(rec.total_bounty).toBeGreaterThan(0);
    expect(rec.wanted_by).toContain('town_guard');
  });

  it('commitCrime unwitnessed adds no bounty', () => {
    const rec = commitCrime(defaultCriminalRecord(), 'trespassing', 'nobility', 5, false);
    expect(rec.total_bounty).toBe(0);
    expect(rec.wanted_by).toHaveLength(0);
    expect(rec.crimes).toHaveLength(1);
  });

  it('murder has higher bounty than theft', () => {
    const murder = commitCrime(defaultCriminalRecord(), 'murder', 'town_guard', 1, true);
    const theft = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 1, true);
    expect(murder.total_bounty).toBeGreaterThan(theft.total_bounty);
  });

  it('discoverCrime upgrades unwitnessed crime to witnessed', () => {
    let rec = commitCrime(defaultCriminalRecord(), 'vandalism', 'town_guard', 3, false);
    expect(rec.total_bounty).toBe(0);
    rec = discoverCrime(rec, 0);
    expect(rec.total_bounty).toBeGreaterThan(0);
    expect(rec.wanted_by).toContain('town_guard');
  });

  it('payBounty clears crimes for a faction and deducts correct gold', () => {
    let rec = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 1, true);
    rec = commitCrime(rec, 'assault', 'town_guard', 2, true);
    const originalBounty = rec.total_bounty;
    const { record: paid, gold_paid } = payBounty(rec, 'town_guard');
    expect(gold_paid).toBe(originalBounty);
    expect(paid.total_bounty).toBe(0);
    expect(paid.wanted_by).not.toContain('town_guard');
  });

  it('payBounty does not affect other faction crimes', () => {
    let rec = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 1, true);
    rec = commitCrime(rec, 'espionage', 'nobility', 2, true);
    const { record: paid } = payBounty(rec, 'town_guard');
    expect(paid.wanted_by).toContain('nobility');
    expect(paid.total_bounty).toBeGreaterThan(0);
  });

  it('serveSentence clears all crimes for a faction', () => {
    let rec = commitCrime(defaultCriminalRecord(), 'assault', 'town_guard', 1, true);
    rec = commitCrime(rec, 'theft', 'town_guard', 2, true);
    const served = serveSentence(rec, 'town_guard');
    expect(served.total_bounty).toBe(0);
    expect(served.wanted_by).not.toContain('town_guard');
  });

  it('calculateSentence returns 0 when no active crimes', () => {
    expect(calculateSentence(defaultCriminalRecord(), 'town_guard')).toBe(0);
  });

  it('calculateSentence is higher for murder than trespassing', () => {
    const murder = commitCrime(defaultCriminalRecord(), 'murder', 'town_guard', 1, true);
    const trespass = commitCrime(defaultCriminalRecord(), 'trespassing', 'town_guard', 1, true);
    expect(calculateSentence(murder, 'town_guard')).toBeGreaterThan(calculateSentence(trespass, 'town_guard'));
  });

  it('murder always yields at least 5 day sentence', () => {
    const rec = commitCrime(defaultCriminalRecord(), 'murder', 'town_guard', 1, true);
    expect(calculateSentence(rec, 'town_guard')).toBeGreaterThanOrEqual(5);
  });

  it('escalateGuardAlert escalates to arresting for murder', () => {
    const guard = defaultGuardState('town_guard');
    const alerted = escalateGuardAlert(guard, 0, 'murder');
    expect(alerted.alert_level).toBe('arresting');
    expect(alerted.last_crime_seen).toBe('murder');
  });

  it('escalateGuardAlert escalates to pursuing for assault', () => {
    const guard = defaultGuardState('town_guard');
    const alerted = escalateGuardAlert(guard, 0, 'assault');
    expect(alerted.alert_level).toBe('pursuing');
  });

  it('escalateGuardAlert escalates to arresting for high bounty', () => {
    const guard = defaultGuardState('town_guard');
    const alerted = escalateGuardAlert(guard, 250, null);
    expect(alerted.alert_level).toBe('arresting');
  });

  it('tickGuardPursuit drains pursuit stamina', () => {
    const guard = { ...defaultGuardState('town_guard'), alert_level: 'pursuing' as const, target_id: 'player', pursuit_stamina: 30 };
    const ticked = tickGuardPursuit(guard, 'player');
    expect(ticked.pursuit_stamina).toBeLessThan(30);
  });

  it('tickGuardPursuit stands down at 0 stamina', () => {
    const guard = { ...defaultGuardState('town_guard'), alert_level: 'pursuing' as const, target_id: 'player', pursuit_stamina: 5 };
    const ticked = tickGuardPursuit(guard, 'player');
    expect(ticked.alert_level).toBe('unaware');
    expect(ticked.target_id).toBeNull();
  });

  it('guardStandDown resets guard to unaware', () => {
    const guard = { ...defaultGuardState('town_guard'), alert_level: 'pursuing' as const, target_id: 'player', pursuit_stamina: 50 };
    const reset = guardStandDown(guard);
    expect(reset.alert_level).toBe('unaware');
    expect(reset.pursuit_stamina).toBe(100);
    expect(reset.target_id).toBeNull();
  });

  it('escapeChance is higher with better athletics', () => {
    expect(escapeChance(80, 50)).toBeGreaterThan(escapeChance(20, 50));
  });

  it('escapeChance is lower against fresh guard', () => {
    expect(escapeChance(50, 10)).toBeGreaterThan(escapeChance(50, 90));
  });

  it('escapeChance is always within [0.05, 0.95]', () => {
    expect(escapeChance(0, 100)).toBeGreaterThanOrEqual(0.05);
    expect(escapeChance(100, 0)).toBeLessThanOrEqual(0.95);
  });

  it('getActiveCrimes returns only witnessed uncleared crimes for faction', () => {
    let rec = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 1, true);
    rec = commitCrime(rec, 'trespassing', 'nobility', 2, false);
    rec = commitCrime(rec, 'assault', 'town_guard', 3, true);
    const active = getActiveCrimes(rec, 'town_guard');
    expect(active).toHaveLength(2);
    expect(active.every(c => c.faction_id === 'town_guard')).toBe(true);
  });

  it('isWanted returns true after witnessed crime', () => {
    const rec = commitCrime(defaultCriminalRecord(), 'theft', 'thieves_guild', 1, true);
    expect(isWanted(rec, 'thieves_guild')).toBe(true);
    expect(isWanted(rec, 'town_guard')).toBe(false);
  });

  it('totalBounty matches sum of witnessed uncleared crimes', () => {
    let rec = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 1, true);
    rec = commitCrime(rec, 'assault', 'town_guard', 2, true);
    expect(totalBounty(rec)).toBe(rec.total_bounty);
  });

  it('wantedLabel returns correct tier labels', () => {
    expect(wantedLabel(defaultCriminalRecord())).toBe('Clean');
    let rec = commitCrime(defaultCriminalRecord(), 'theft', 'town_guard', 1, true);
    expect(wantedLabel(rec)).not.toBe('Clean');
    let rec2 = commitCrime(defaultCriminalRecord(), 'murder', 'town_guard', 1, true);
    rec2 = commitCrime(rec2, 'murder', 'town_guard', 2, true);
    expect(wantedLabel(rec2)).toBe('Most Wanted');
  });

  it('guardAlertLabel returns readable strings', () => {
    expect(guardAlertLabel('unaware')).toBe('Unaware');
    expect(guardAlertLabel('pursuing')).toBe('Pursuing');
    expect(guardAlertLabel('arresting')).toBe('Arresting');
  });

  it('tickSimulation preserves factions across turns', () => {
    const world = makeWorld({
      npcs: [],
      factions: applyRepDelta(defaultFactions(), 'town_guard', 50),
    });
    const next = tickSimulation(world);
    const guard = next.factions.find(f => f.id === 'town_guard')!;
    expect(guard).toBeDefined();
    expect(guard.reputation).toBe(50); // no drift in same day
  });

  it('tickSimulation applies daily faction drift on day change', () => {
    const world = makeWorld({
      npcs: [],
      hour: 23,
      factions: applyRepDelta(defaultFactions(), 'nobility', 80),
    });
    const next = tickSimulation(world);
    const nob = next.factions.find(f => f.id === 'nobility')!;
    expect(nob.reputation).toBeLessThan(80);
  });
});
