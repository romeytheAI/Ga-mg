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

const HOURS_PER_TICK = 1;
const EVENT_CHANCE_PER_DAY = 0.15; // 15% chance of a world event per day

// ── Main tick ─────────────────────────────────────────────────────────────

/**
 * Advance the simulation by one tick (HOURS_PER_TICK hours).
 * Returns the updated world state.
 */
export function tickSimulation(world: SimWorld): SimWorld {
  let w = advanceTime(world, HOURS_PER_TICK);

  // Random world event (once per day threshold)
  if (w.day !== world.day && Math.random() < EVENT_CHANCE_PER_DAY) {
    const event = generateRandomEvent(w.day);
    w = { ...w, global_events: [...w.global_events.slice(-9), event] };
  }

  // Economy tick: update prices and rebalance demand
  let economy = balanceDemand(w.economy);
  economy = updatePrices(economy);

  // NPC ticks
  const updatedNpcs = w.npcs.map(npc => tickNpc(npc, w, economy));

  return {
    ...w,
    economy,
    npcs: updatedNpcs,
    turn: w.turn + 1,
  };
}

// ── Per-NPC tick ──────────────────────────────────────────────────────────

function tickNpc(npc: SimNpc, world: SimWorld, economy: typeof world.economy): SimNpc {
  // 1. Memory decay
  const memory = decayMemories(npc.memory);

  // 2. Relationship decay (against the player character)
  const relationships = npc.relationships.map(rel => {
    const turnsSince = world.turn - rel.last_interaction;
    const decayed = decayRelationship(rel, turnsSince);
    return syncFromMemory(decayed, memory, rel.target_id);
  });

  // 3. Needs decay
  let needs = decayNeeds({ ...npc, memory, relationships }, HOURS_PER_TICK);

  // 4. Utility AI: decide action (honour schedule when need is not critical)
  const scheduledState = scheduledActivity(npc.schedule, world.hour);
  const aiAction = selectBestAction({ ...npc, needs }, world.hour);

  // Schedule takes priority unless there's a critical need override
  const currentState = aiAction.target_state === 'eating'
    || aiAction.target_state === 'sleeping'
    || aiAction.target_state === 'fleeing'
    ? aiAction.target_state
    : scheduledState;

  // 5. Apply activity effects to needs
  const activityNeeds = applyActivityEffect(
    needs,
    currentState as 'eating' | 'sleeping' | 'socializing' | 'working' | 'trading' | 'idle',
    HOURS_PER_TICK
  );

  // 6. Happiness from need balance
  const happinessDelta = computeHappinessDelta(activityNeeds);
  needs = {
    ...activityNeeds,
    happiness: Math.max(0, Math.min(100, activityNeeds.happiness + happinessDelta)),
  };

  // 7. Economy: earn wage if working, pay for food if eating
  let stats = { ...npc.stats };
  if (currentState === 'working') {
    const wages = collectWage(npc.job);
    stats = { ...stats, gold: stats.gold + wages };
    economy = produceGoods(economy, npc.job);
  }

  // 8. Social: record interaction memory if socialising
  let updatedMemory = memory;
  if (currentState === 'socializing' && Math.random() < 0.3) {
    updatedMemory = addMemory(
      { ...npc, memory },
      'Had a pleasant conversation with a local.',
      'positive',
      null,
      world.turn
    );
  }

  return {
    ...npc,
    needs,
    memory: updatedMemory,
    relationships,
    current_state: currentState,
    stats,
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

const HORDE_API = 'https://stablehorde.net/api/v2';

async function submitHordeJob(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch(`${HORDE_API}/generate/text/async`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey || '0000000000',
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
    headers: { 'apikey': apiKey || '0000000000' },
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
