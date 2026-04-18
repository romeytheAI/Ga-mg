/**
 * WillpowerSystem — DoL-style willpower/stress/trauma/control mechanics.
 * These mental stats affect decision-making, encounter outcomes, and NPC behavior.
 * Interconnects with CorruptionSystem, CombatSystem, and NeedsSystem.
 * Pure functions; no side effects, no UI imports.
 */
import { CorruptionState, SimNpc, NpcNeeds } from './types';

// ── Willpower drain from activities ──────────────────────────────────────────

const ACTIVITY_WILLPOWER_EFFECTS: Partial<Record<string, number>> = {
  working: -0.5,       // mild willpower drain from work
  socializing: 0.3,    // social contact restores some willpower
  sleeping: 1.5,       // sleep restores willpower
  eating: 0.2,         // eating restores minor willpower
  hostile: -2.0,       // combat heavily drains willpower
  fleeing: -1.5,       // fleeing is stressful
  idle: 0.5,           // rest restores minor willpower
  exercising: -0.3,    // exercise mildly drains willpower
  trading: -0.2,       // trading mildly drains willpower
  studying: -0.8,      // studying drains willpower
};

/**
 * Apply willpower changes from an activity during a tick.
 * Returns updated corruption state.
 */
export function applyActivityWillpower(
  state: CorruptionState,
  activity: string,
  hours: number
): CorruptionState {
  const effect = ACTIVITY_WILLPOWER_EFFECTS[activity] ?? 0;
  return {
    ...state,
    willpower: clamp(state.willpower + effect * hours, 0, 100),
  };
}

/**
 * Calculate mental fortitude: combined measure of willpower + control - stress.
 * Used to determine resistance to negative events.
 * Returns 0-100 score.
 */
export function mentalFortitude(state: CorruptionState): number {
  const raw = (state.willpower + state.control) / 2 - state.stress * 0.3 - state.trauma * 0.2;
  return clamp(raw, 0, 100);
}

/**
 * Check if an NPC can resist a temptation or threat.
 * difficulty: 0-100, where 100 is nearly impossible to resist.
 */
export function canResist(state: CorruptionState, difficulty: number): boolean {
  const fortitude = mentalFortitude(state);
  // Corruption reduces resistance
  const effectiveFortitude = fortitude * (1 - state.corruption / 200);
  return effectiveFortitude > difficulty;
}

/**
 * Apply stress from unmet needs. Called when needs are critically low.
 * Low hunger/energy cause stress; low social causes loneliness stress.
 */
export function stressFromNeeds(state: CorruptionState, needs: NpcNeeds): CorruptionState {
  let stress = state.stress;
  let willpower = state.willpower;

  // Hunger stress
  if (needs.hunger < 20) {
    stress = clamp(stress + (20 - needs.hunger) * 0.05, 0, 100);
  }

  // Energy stress (exhaustion)
  if (needs.energy < 15) {
    stress = clamp(stress + (15 - needs.energy) * 0.08, 0, 100);
    willpower = clamp(willpower - 0.1, 0, 100);
  }

  // Social stress (loneliness)
  if (needs.social < 20) {
    stress = clamp(stress + (20 - needs.social) * 0.03, 0, 100);
  }

  // Happiness deficit
  if (needs.happiness < 20) {
    willpower = clamp(willpower - 0.2, 0, 100);
  }

  return { ...state, stress, willpower };
}

/**
 * Determine the NPC's behavioral modifier based on their mental state.
 * Returns a multiplier affecting decision-making quality.
 * Low fortitude = poorer decisions, more impulsive behavior.
 */
export function decisionQuality(state: CorruptionState): number {
  const fortitude = mentalFortitude(state);
  // 0.3 to 1.0 range: broken NPCs make 30% quality decisions
  return 0.3 + (fortitude / 100) * 0.7;
}

/**
 * Apply consequences of losing a fight to the NPC's mental state.
 */
export function applyDefeatConsequences(state: CorruptionState): CorruptionState {
  return {
    ...state,
    stress: clamp(state.stress + 15, 0, 100),
    trauma: clamp(state.trauma + 5, 0, 100),
    willpower: clamp(state.willpower - 10, 0, 100),
    control: clamp(state.control - 5, 0, 100),
    submission: clamp(state.submission + 3, 0, 100),
  };
}

/**
 * Apply consequences of winning a fight to the NPC's mental state.
 */
export function applyVictoryConsequences(state: CorruptionState): CorruptionState {
  return {
    ...state,
    willpower: clamp(state.willpower + 5, 0, 100),
    control: clamp(state.control + 3, 0, 100),
    stress: clamp(state.stress - 5, 0, 100),
  };
}

/**
 * Apply consequences of escaping a fight to the NPC's mental state.
 */
export function applyEscapeConsequences(state: CorruptionState): CorruptionState {
  return {
    ...state,
    stress: clamp(state.stress + 8, 0, 100),
    willpower: clamp(state.willpower - 3, 0, 100),
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
