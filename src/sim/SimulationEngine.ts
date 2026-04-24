/**
 * SimulationEngine — master tick loop integrating all sim systems.
 *
 * Call `tickSimulation()` once per game turn (after the player acts).
 * Returns a new `SimWorld` — never mutates in place.
 *
 * AI Horde calls are dispatched to a queue and processed asynchronously;
 * the simulation loop NEVER awaits them.
 */
import { SimWorld, SimNpc, HordeRequest } from './types';
import { decayNeeds, applyActivityEffect, computeHappinessDelta } from './NeedsSystem';
import { selectBestAction, resolveAction } from './UtilityAI';
import { decayMemories, addMemory } from './MemorySystem';
import { getRelationship, upsertRelationship, applyInteraction, decayRelationship, syncFromMemory } from './RelationshipSystem';
import { produceGoods, collectWage, updatePrices, balanceDemand } from './EconomySystem';
import { advanceTime, scheduledActivity } from './TimeSystem';
import { generateRandomEvent } from './ProceduralGen';
import { trainSkillsFromActivity } from './SkillsSystem';
import { tickCorruptionState } from './CorruptionSystem';
import { gainFameFromActivity, decayFame } from './FameSystem';
import { applyWear, coldExposureStress, applyCombatDamage } from './ClothingSystem';
import { applyActivityWillpower, stressFromNeeds } from './WillpowerSystem';
import { shouldTravel, startTravel, completeTravel, checkForEncounter } from './LocationSystem';
import { tickRomance } from './RomanceSystem';
import { npcToParticipant, createCombatEncounter, resolveCombatTurn, selectAIStance } from './CombatSystem';
import { tickAddiction, withdrawalStress } from './AddictionSystem';
import { tickDisease, diseaseHealthDrain } from './DiseaseSystem';
import { tickArcane } from './ArcaneSystem';
import { tickParasite, totalCorruptionBuff } from './ParasiteSystem';
import { tickCompanions, partyHealRate } from './CompanionSystem';
import { computeAllure } from './AllureSystem';
import { tickRestraints, restraintStress } from './RestraintSystem';
import { tickAscension } from './TransformationSystem';
import { driftFactions } from './FactionSystem';
import { tickCivilization } from './CivilizationSystem';
import { tickPolitics } from './PoliticsSystem';
import { tickTrade } from './TradeSystem';
import { tickKnowledge } from './KnowledgeSystem';
import { tickDaedricPower } from './DaedricSystem';
import { tickDeceptions } from './DeceptionSystem';

const HOURS_PER_TICK = 1;
const EVENT_CHANCE_PER_DAY = 0.15; // 15% chance of a world event per day

// ── Main tick ─────────────────────────────────────────────────────────────

/**
 * Advance the simulation by one tick (HOURS_PER_TICK hours).
 * Returns the updated world state.
 */
export function tickSimulation(world: SimWorld): SimWorld {
  let w = advanceTime(world, HOURS_PER_TICK);
  const dayChanged = w.day !== world.day;

  // Random world event (once per day threshold)
  if (dayChanged && Math.random() < EVENT_CHANCE_PER_DAY) {
    const event = generateRandomEvent(w.day);
    w = { ...w, global_events: [...w.global_events.slice(-19), event] };
  }

  // Economy tick: update prices and rebalance demand
  let economy = balanceDemand(w.economy);
  economy = updatePrices(economy);

  // Faction daily drift (reputation slowly returns to neutral)
  const factions = dayChanged ? driftFactions(w.factions ?? []) : (w.factions ?? []);

  w = { ...w, economy, factions };

  // civilization simulation (Procedural & Emergent)
  w = tickCivilization(w);
  w = tickTrade(w);
  w = tickPolitics(w);
  w = tickKnowledge(w);
  w = tickDaedricPower(w);

  // Deception & Social Correction
  const deceptionResult = tickDeceptions(w);
  w = deceptionResult.world;
  if (deceptionResult.corrections.length > 0) {
    w.global_events.push(...deceptionResult.corrections);
  }

  // Resolve active combats
  let activeCombats = [...(w.active_combats ?? [])];
  const combatResults: Map<string, { health: number; stamina: number; won: boolean; escaped: boolean }> = new Map();
  activeCombats = activeCombats.map(combat => {
    if (combat.resolved) return combat;

    const atkNpc = w.npcs.find(n => n.id === combat.attacker_id);
    const defNpc = w.npcs.find(n => n.id === combat.defender_id);
    if (!atkNpc || !defNpc) return { ...combat, resolved: true, outcome: 'defender_wins' as const };

    let attacker = npcToParticipant(atkNpc);
    let defender = npcToParticipant(defNpc);
    attacker.stance = selectAIStance(attacker);
    defender.stance = selectAIStance(defender);

    const result = resolveCombatTurn(attacker, defender, combat);

    if (result.encounter.resolved) {
      combatResults.set(combat.attacker_id, {
        health: result.attacker.health,
        stamina: result.attacker.stamina,
        won: result.encounter.outcome === 'attacker_wins',
        escaped: false,
      });
      combatResults.set(combat.defender_id, {
        health: result.defender.health,
        stamina: result.defender.stamina,
        won: result.encounter.outcome === 'defender_wins',
        escaped: result.encounter.outcome === 'defender_escaped',
      });
    }

    return result.encounter;
  });

  // Remove resolved combats
  activeCombats = activeCombats.filter(c => !c.resolved);

  // NPC ticks
  let updatedWorld = { ...w, economy, active_combats: activeCombats };
  const updatedNpcs = w.npcs.map(npc => {
    const combatResult = combatResults.get(npc.id);
    return tickNpc(npc, updatedWorld, economy, dayChanged, combatResult);
  });

  // Check for new encounters
  const newCombats = [...activeCombats];
  for (const npc of updatedNpcs) {
    if (checkForEncounter(npc, updatedWorld)) {
      // Find a hostile NPC at the same location
      const hostileNpc = updatedNpcs.find(
        other => other.id !== npc.id
          && other.location_id === npc.location_id
          && other.traits.includes('aggressive')
          && !newCombats.some(c => c.attacker_id === other.id || c.defender_id === other.id)
      );
      if (hostileNpc) {
        newCombats.push(createCombatEncounter(hostileNpc.id, npc.id));
      }
    }
  }

  return {
    ...updatedWorld,
    npcs: updatedNpcs,
    turn: w.turn + 1,
    active_combats: newCombats,
    factions,
    criminal_records: w.criminal_records ?? {},
  };
}

// ── Per-NPC tick ──────────────────────────────────────────────────────────

function tickNpc(
  npc: SimNpc,
  world: SimWorld,
  economy: typeof world.economy,
  dayChanged: boolean,
  combatResult?: { health: number; stamina: number; won: boolean; escaped: boolean }
): SimNpc {
  // 0. Apply combat results if any
  let stats = { ...npc.stats };
  let corruption_state = { ...npc.corruption_state };
  if (combatResult) {
    stats.health = combatResult.health;
    stats.stamina = combatResult.stamina;
    if (combatResult.won) {
      corruption_state.willpower = Math.min(100, corruption_state.willpower + 5);
      corruption_state.stress = Math.max(0, corruption_state.stress - 5);
    } else if (combatResult.escaped) {
      corruption_state.stress = Math.min(100, corruption_state.stress + 8);
    } else {
      corruption_state.stress = Math.min(100, corruption_state.stress + 15);
      corruption_state.trauma = Math.min(100, corruption_state.trauma + 5);
      corruption_state.submission = Math.min(100, corruption_state.submission + 3);
    }
  }

  // 1. Memory decay
  const memory = decayMemories(npc.memory);

  // 2. Relationship decay & romance tick
  const relationships = npc.relationships.map(rel => {
    const turnsSince = world.turn - rel.last_interaction;
    let decayed = decayRelationship(rel, turnsSince);
    decayed = syncFromMemory(decayed, memory, rel.target_id);

    // Tick romance if active
    if (decayed.romance) {
      decayed = { ...decayed, romance: tickRomance(decayed.romance, decayed, world.turn) };
    }

    return decayed;
  });

  // 3. Needs decay
  let needs = decayNeeds({ ...npc, memory, relationships }, HOURS_PER_TICK);

  // 4. Location movement
  let location_id = npc.location_id;
  let target_location_id = npc.target_location_id;
  let currentNpcState = npc.current_state;

  if (npc.current_state === 'travelling' && npc.target_location_id) {
    // Complete travel
    const travelResult = completeTravel(npc, world);
    location_id = travelResult.npc.location_id;
    target_location_id = null;
    currentNpcState = 'idle';
  } else {
    const travelTarget = shouldTravel(npc, world);
    if (travelTarget) {
      target_location_id = travelTarget;
      currentNpcState = 'travelling';
    }
  }

  // 5. Utility AI: decide action (honour schedule when need is not critical)
  const scheduledState = scheduledActivity(npc.schedule, world.hour);
  const npcForAI: SimNpc = { ...npc, needs, stats, corruption_state, location_id, relationships };
  const aiAction = selectBestAction(npcForAI, world.hour);

  // Schedule takes priority unless there's a critical need override or travelling
  if (currentNpcState !== 'travelling') {
    currentNpcState = aiAction.target_state === 'eating'
      || aiAction.target_state === 'sleeping'
      || aiAction.target_state === 'fleeing'
      ? aiAction.target_state
      : scheduledState;
  }

  // 6. Apply activity effects to needs
  const activityNeeds = applyActivityEffect(
    needs,
    currentNpcState as 'eating' | 'sleeping' | 'socializing' | 'working' | 'trading' | 'idle',
    HOURS_PER_TICK
  );

  // 7. Happiness from need balance
  const happinessDelta = computeHappinessDelta(activityNeeds);
  needs = {
    ...activityNeeds,
    happiness: Math.max(0, Math.min(100, activityNeeds.happiness + happinessDelta)),
  };

  // 8. Economy: earn wage if working, pay for food if eating
  if (currentNpcState === 'working') {
    const wages = collectWage(npc.job);
    stats = { ...stats, gold: stats.gold + wages };
    economy = produceGoods(economy, npc.job);
  }

  // 9. Social: record interaction memory if socialising
  let updatedMemory = memory;
  if (currentNpcState === 'socializing' && Math.random() < 0.3) {
    updatedMemory = addMemory(
      { ...npc, memory },
      'Had a pleasant conversation with a local.',
      'positive',
      null,
      world.turn
    );
  }

  // 10. Train skills from current activity
  const skills = trainSkillsFromActivity(
    { ...npc, skills: npc.skills },
    currentNpcState,
    HOURS_PER_TICK
  );

  // 11. Tick corruption/willpower/stress
  corruption_state = tickCorruptionState(
    { ...npc, corruption_state, current_state: currentNpcState } as SimNpc,
    HOURS_PER_TICK
  );

  // 12. Apply willpower effects from activity
  corruption_state = applyActivityWillpower(corruption_state, currentNpcState, HOURS_PER_TICK);

  // 13. Apply stress from unmet needs
  corruption_state = stressFromNeeds(corruption_state, needs);

  // 14. Gain fame from activity
  const fame = gainFameFromActivity(
    { ...npc, fame: npc.fame } as SimNpc,
    currentNpcState,
    HOURS_PER_TICK
  );

  // 15. Decay fame daily
  const finalFame = dayChanged ? decayFame(fame) : fame;

  // 16. Apply clothing wear from activity
  let clothing = applyWear(npc.clothing, currentNpcState, HOURS_PER_TICK);

  // 17. Apply cold exposure stress from weather
  const coldStress = coldExposureStress(clothing, world.weather);
  if (coldStress > 0) {
    corruption_state = {
      ...corruption_state,
      stress: Math.min(100, corruption_state.stress + coldStress),
    };
  }

  // 18. Apply combat clothing damage
  if (combatResult && !combatResult.won) {
    clothing = applyCombatDamage(clothing, 15);
  }

  // 19. Tick addiction (withdrawal & recovery)
  let addiction_state = tickAddiction(npc.addiction_state, world.turn, HOURS_PER_TICK);
  const addictionWithdrawalStress = withdrawalStress(addiction_state);
  if (addictionWithdrawalStress > 0) {
    corruption_state = { ...corruption_state, stress: Math.min(100, corruption_state.stress + addictionWithdrawalStress * 0.1) };
  }

  // 20. Tick diseases
  let disease_state = tickDisease(npc.disease_state, HOURS_PER_TICK);
  const diseaseHealthDrainAmount = diseaseHealthDrain(disease_state);
  if (diseaseHealthDrainAmount > 0) {
    stats = { ...stats, health: Math.max(0, stats.health - diseaseHealthDrainAmount * 0.1) };
  }

  // 21. Tick arcane (mana regen, enchantment durations)
  const arcane_state = tickArcane(npc.arcane_state, HOURS_PER_TICK);

  // 22. Tick parasites
  let parasite_state = tickParasite(npc.parasite_state, HOURS_PER_TICK);
  const parasiteCorruptionBuff = totalCorruptionBuff(parasite_state);
  if (parasiteCorruptionBuff > 0) {
    corruption_state = { ...corruption_state, corruption: Math.min(100, corruption_state.corruption + parasiteCorruptionBuff * 0.05) };
  }

  // 23. Tick companions
  const companion_state = tickCompanions(npc.companion_state, HOURS_PER_TICK);
  const healRate = partyHealRate(companion_state);
  if (healRate > 0) {
    stats = { ...stats, health: Math.min(100, stats.health + healRate * 0.1) };
  }

  // 24. Compute allure
  const allure_state = computeAllure(
    npc.allure_state.base_allure, clothing, finalFame, corruption_state, npc.traits
  );

  // 25. Tick restraints
  let restraint_state = tickRestraints(npc.restraint_state, HOURS_PER_TICK);
  const restraintStressAmount = restraintStress(restraint_state);
  if (restraintStressAmount > 0) {
    corruption_state = { ...corruption_state, stress: Math.min(100, corruption_state.stress + restraintStressAmount * 0.1) };
  }

  // 26. Tick transformation / ascension
  const transformation = tickAscension(npc.transformation, corruption_state, HOURS_PER_TICK);

  return {
    ...npc,
    needs,
    memory: updatedMemory,
    relationships,
    current_state: currentNpcState,
    location_id,
    target_location_id,
    stats,
    skills,
    corruption_state,
    fame: finalFame,
    clothing,
    transformation,
    addiction_state,
    disease_state,
    arcane_state,
    parasite_state,
    companion_state,
    allure_state,
    restraint_state,
  };
}

// ── Horde AI queue helpers ───────────────────────────────────────────────

const MAX_RETRIES = 3;

/** Create a new AI Horde backstory request for an NPC. */
export function createBackstoryRequest(npc: SimNpc): HordeRequest {
  return {
    id: `horde_${npc.id}_backstory_${Date.now()}`,
    type: 'backstory',
    prompt: buildBackstoryPrompt(npc),
    subject_id: npc.id,
    status: 'queued',
    retries: 0,
  };
}

/** Create a dialogue request for an NPC given a context string. */
export function createDialogueRequest(npc: SimNpc, context: string): HordeRequest {
  return {
    id: `horde_${npc.id}_dialogue_${Date.now()}`,
    type: 'dialogue',
    prompt: buildDialoguePrompt(npc, context),
    subject_id: npc.id,
    status: 'queued',
    retries: 0,
  };
}

/** Create an event narrative request. */
export function createEventNarrativeRequest(event: string, world: SimWorld): HordeRequest {
  return {
    id: `horde_event_${Date.now()}`,
    type: 'event_narrative',
    prompt: `Describe this world event vividly in 2-3 sentences from the perspective of a local in ${world.npcs[0]?.location_id ?? 'a village'}:\n"${event}"`,
    subject_id: 'world',
    status: 'queued',
    retries: 0,
  };
}

/**
 * Process one pending Horde request (async, non-blocking).
 * Returns the updated request. If done, stores result in cache.
 */
export async function processHordeRequest(
  request: HordeRequest,
  hordeApiKey: string,
  onResult: (req: HordeRequest) => void
): Promise<void> {
  if (request.status === 'done' || request.status === 'failed') return;
  if (request.retries >= MAX_RETRIES) {
    onResult({ ...request, status: 'failed' });
    return;
  }

  try {
    // Submit to AI Horde
    if (request.status === 'queued') {
      const jobId = await submitHordeJob(request.prompt, hordeApiKey);
      onResult({ ...request, status: 'pending', horde_job_id: jobId, retries: request.retries + 1 });
      return;
    }

    // Poll pending job
    if (request.status === 'pending' && request.horde_job_id) {
      const result = await pollHordeJob(request.horde_job_id, hordeApiKey);
      if (result !== null) {
        onResult({ ...request, status: 'done', result });
      }
      // else still processing — no state change, will be re-polled next tick
    }
  } catch (err) {
    console.warn('[Horde] Request error:', err);
    onResult({ ...request, retries: request.retries + 1 });
  }
}

// ── Horde API helpers (non-blocking) ─────────────────────────────────────

const HORDE_API = 'https://aihorde.net/api/v2';

async function submitHordeJob(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch(`${HORDE_API}/generate/text/async`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey || '0000000000',
      'Client-Agent': 'gitsa:1.0:unknown'
    },
    body: JSON.stringify({
      prompt,
      params: { max_length: 200, max_context_length: 1024 },
      models: ['koboldcpp/Llama-3-8B-Lexi-Uncensored_Q4_K_M'],
    }),
  });
  if (!resp.ok) throw new Error(`Horde submit failed: ${resp.status}`);
  const data = await resp.json();
  return data.id as string;
}

async function pollHordeJob(jobId: string, apiKey: string): Promise<string | null> {
  const resp = await fetch(`${HORDE_API}/generate/text/status/${jobId}`, {
    headers: { 
      'apikey': apiKey || '0000000000',
      'Client-Agent': 'gitsa:1.0:unknown'
    },
  });
  if (!resp.ok) throw new Error(`Horde poll failed: ${resp.status}`);
  const data = await resp.json();
  if (data.done && data.generations?.length > 0) {
    return data.generations[0].text as string;
  }
  return null; // still processing
}

// ── Prompt builders ────────────────────────────────────────────────────────

function buildBackstoryPrompt(npc: SimNpc): string {
  return (
    `Write a short (3-sentence) backstory for ${npc.name}, ` +
    `a ${npc.age}-year-old ${npc.race} ${npc.gender} who works as a ${npc.job}. ` +
    `Their personality traits are: ${npc.traits.join(', ')}. ` +
    `The setting is a gritty dark-fantasy world.`
  );
}

function buildDialoguePrompt(npc: SimNpc, context: string): string {
  return (
    `You are ${npc.name}, a ${npc.race} ${npc.job} with traits: ${npc.traits.join(', ')}. ` +
    `Context: ${context}. ` +
    `Respond in character in 1-2 sentences.`
  );
}
