/**
 * UtilityAI — selects the best action for an NPC using utility scoring.
 * Pure functions; no side effects, no UI imports.
 */
import { SimNpc, UtilityAction, NpcState, NpcNeeds } from './types';
import { needUrgency, hasNeedCrisis } from './NeedsSystem';

// ── Candidate action catalogue ─────────────────────────────────────────────

const ACTION_CATALOGUE: UtilityAction[] = [
  {
    id: 'eat',
    label: 'Find food',
    target_state: 'eating',
    need_satisfied: 'hunger',
    need_gain: 30,
    preconditions: {},
    energy_cost: 5,
  },
  {
    id: 'sleep',
    label: 'Sleep',
    target_state: 'sleeping',
    need_satisfied: 'energy',
    need_gain: 35,
    preconditions: {},
    energy_cost: 0,
  },
  {
    id: 'socialize',
    label: 'Seek company',
    target_state: 'socializing',
    need_satisfied: 'social',
    need_gain: 25,
    preconditions: { energy: 20 },
    energy_cost: 8,
  },
  {
    id: 'work',
    label: 'Work',
    target_state: 'working',
    need_satisfied: 'wealth',
    need_gain: 15,
    preconditions: { energy: 30, hunger: 20 },
    energy_cost: 15,
  },
  {
    id: 'trade',
    label: 'Trade goods',
    target_state: 'trading',
    need_satisfied: 'wealth',
    need_gain: 8,
    preconditions: { energy: 20 },
    energy_cost: 6,
  },
  {
    id: 'idle',
    label: 'Rest idly',
    target_state: 'idle',
    need_satisfied: null,
    need_gain: 0,
    preconditions: {},
    energy_cost: 0,
  },
  {
    id: 'flee',
    label: 'Flee danger',
    target_state: 'fleeing',
    need_satisfied: null,
    need_gain: 0,
    preconditions: {},
    energy_cost: 20,
  },
];

// ── Utility scoring ────────────────────────────────────────────────────────

/**
 * Score a single action for an NPC.
 * Returns 0 if preconditions are not met.
 */
function scoreAction(action: UtilityAction, npc: SimNpc): number {
  const needs = npc.needs;

  // Check preconditions
  for (const [key, minVal] of Object.entries(action.preconditions) as [keyof NpcNeeds, number][]) {
    if (needs[key] < minVal) return 0;
  }

  // Base score: urgency of the satisfied need × expected gain
  let score = 0;
  if (action.need_satisfied) {
    score = needUrgency(needs[action.need_satisfied]) * action.need_gain;
  }

  // Penalty for energy cost when energy is low
  if (action.energy_cost > 0) {
    score -= (action.energy_cost / 100) * needUrgency(needs.energy) * 20;
  }

  // Trait modifiers
  if (npc.traits.includes('greedy') && action.need_satisfied === 'wealth') score *= 1.4;
  if (npc.traits.includes('generous') && action.id === 'trade') score *= 1.2;
  if (npc.traits.includes('aggressive') && action.target_state === 'idle') score *= 0.5;
  if (npc.traits.includes('passive') && action.target_state === 'fleeing') score *= 1.3;
  if (npc.traits.includes('flirtatious') && action.id === 'socialize') score *= 1.5;
  if (npc.traits.includes('reserved') && action.id === 'socialize') score *= 0.4;

  // Relationship boost for socialising
  if (action.id === 'socialize' && npc.relationships.length > 0) {
    const bestAffection = Math.max(...npc.relationships.map(r => r.affection));
    if (bestAffection > 30) score *= 1.2;
  }

  return Math.max(0, score);
}

/**
 * Select the best action for an NPC given their current state and needs.
 * In a crisis (hunger/energy critical) we override with survival action.
 */
export function selectBestAction(npc: SimNpc, hour: number): UtilityAction {
  // Hard override: flee if hostile NPCs detected (simplified: just use health)
  if (npc.stats.health < 20) {
    return ACTION_CATALOGUE.find(a => a.id === 'flee')!;
  }

  // Survival override: critical hunger → eat; critical energy → sleep
  if (hasNeedCrisis(npc.needs)) {
    if (npc.needs.hunger < 15) return ACTION_CATALOGUE.find(a => a.id === 'eat')!;
    if (npc.needs.energy < 10) return ACTION_CATALOGUE.find(a => a.id === 'sleep')!;
  }

  // Schedule constraint: sleeping hours (22-06)
  if (hour >= 22 || hour < 6) {
    const sleepAction = ACTION_CATALOGUE.find(a => a.id === 'sleep')!;
    // Only force sleep if energy is reasonably low
    if (npc.needs.energy < 70) return sleepAction;
  }

  // Score all actions and pick the best
  let bestAction = ACTION_CATALOGUE.find(a => a.id === 'idle')!;
  let bestScore = -1;

  for (const action of ACTION_CATALOGUE) {
    const score = scoreAction(action, npc);
    if (score > bestScore) {
      bestScore = score;
      bestAction = action;
    }
  }

  return bestAction;
}

/**
 * Resolve the new NPC state and apply any immediate effects from the action.
 * Returns the next NpcState for the NPC.
 */
export function resolveAction(action: UtilityAction): NpcState {
  return action.target_state;
}
