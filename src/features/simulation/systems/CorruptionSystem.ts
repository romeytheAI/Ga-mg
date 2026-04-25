/**
 * CorruptionSystem — DoL-style corruption/purity tracking.
 * Corruption increases from dangerous events and choices.
 * Purity erodes as corruption rises. Willpower resists corruption.
 * Stress and trauma affect control and decision-making.
 * Pure functions; no side effects, no UI imports.
 */
import { CorruptionState, SimNpc, NpcTrait } from './types';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Create a default corruption state for a new NPC. */
export function defaultCorruptionState(): CorruptionState {
  return {
    corruption: 0,
    purity: 100,
    willpower: 70,
    stress: 10,
    trauma: 0,
    control: 80,
    submission: 0,
  };
}

// ── Passive decay/recovery per tick ────────────────────────────────────────

const STRESS_DECAY_PER_HOUR = 0.5;       / stress slowly recovers
const WILLPOWER_RECOVERY_PER_HOUR = 0.2; // willpower slowly regenerates
const CONTROL_RECOVERY_PER_HOUR = 0.3;   / control recovers passively
const TRAUMA_DECAY_PER_HOUR = 0.02;      / trauma heals very slowly

// ── Trait modifiers ────────────────────────────────────────────────────────

const TRAIT_CORRUPTION_MODIFIERS: Partial<Record<NpcTrait, Partial<CorruptionState>>> = {
  brave: { willpower: 0.3, control: 0.2 },           / faster recovery
  cowardly: { stress: 0.3, submission: 0.1 },         / more stress gain
  aggressive: { control: -0.1 },                      / loses control easier
  passive: { submission: 0.2, stress: -0.2 },         / more submissive, less stress
  loyal: { willpower: 0.2, purity: 0.1 },             / stronger will
  treacherous: { corruption: 0.1, purity: -0.1 },     / corruption tendency
  paranoid: { stress: 0.4, trauma: 0.1 },             / more stress/trauma
  curious: { corruption: 0.05 },                      / slight corruption tendency
};

/**
 * Passive tick: decay stress, recover willpower/control, apply trait effects.
 * Called once per simulation tick.
 */
export function tickCorruptionState(npc: SimNpc, hours: number): CorruptionState {
  let state = { ...npc.corruption_state };

  // Passive stress recovery (better when sleeping or resting)
  const activity = npc.current_state;
  const stressRecoveryMultiplier = activity === 'sleeping''? 3.0 : activity === 'idle''? 1.5 : 1.0;
  state.stress = clamp(state.stress - STRESS_DECAY_PER_HOUR * hours * stressRecoveryMultiplier, 0, 100);

  // Passive willpower regeneration (impaired by high stress)
  const willRecovery = WILLPOWER_RECOVERY_PER_HOUR * hours * (1 - state.stress / 200);
  state.willpower = clamp(state.willpower + willRecovery, 0, 100);

  // Passive control recovery (impaired by trauma)
  const controlRecovery = CONTROL_RECOVERY_PER_HOUR * hours * (1 - state.trauma / 200);
  state.control = clamp(state.control + controlRecovery, 0, 100);

  // Passive trauma healing (very slow)
  state.trauma = clamp(state.trauma - TRAUMA_DECAY_PER_HOUR * hours, 0, 100);

  // Purity erosion: purity drifts down based on corruption level
  if (state.corruption > 10) {
    const purityLoss = (state.corruption / 100) * 0.1 * hours;
    state.purity = clamp(state.purity - purityLoss, 0, 100);
  }

  // Trait-based adjustments
  for (const trait of npc.traits) {
    const mod = TRAIT_CORRUPTION_MODIFIERS[trait];
    if (!mod) continue;
    if (mod.willpower) state.willpower = clamp(state.willpower + mod.willpower * hours * 0.1, 0, 100);
    if (mod.stress) state.stress = clamp(state.stress + mod.stress * hours * 0.1, 0, 100);
    if (mod.control) state.control = clamp(state.control + mod.control * hours * 0.1, 0, 100);
    if (mod.submission) state.submission = clamp(state.submission + mod.submission * hours * 0.1, 0, 100);
    if (mod.corruption) state.corruption = clamp(state.corruption + mod.corruption * hours * 0.1, 0, 100);
    if (mod.purity) state.purity = clamp(state.purity + mod.purity * hours * 0.1, 0, 100);
    if (mod.trauma) state.trauma = clamp(state.trauma + mod.trauma * hours * 0.1, 0, 100);
  }

  return state;
}

/** Apply a stressful event to the corruption state. */
export function applyStress(state: CorruptionState, amount: number): CorruptionState {
  const reduced = amount * (1 - state.willpower / 200); // willpower halves stress at max
  return {
    ...state,
    stress: clamp(state.stress + reduced, 0, 100),
    control: clamp(state.control - reduced * 0.3, 0, 100),
  };
}

/** Apply trauma from a traumatic event. Willpower resists some trauma. */
export function applyTrauma(state: CorruptionState, amount: number): CorruptionState {
  const reduced = amount * (1 - state.willpower / 300); // willpower mitigates 1/3
  return {
    ...state,
    trauma: clamp(state.trauma + reduced, 0, 100),
    stress: clamp(state.stress + reduced * 0.5, 0, 100),
    willpower: clamp(state.willpower - reduced * 0.2, 0, 100),
  };
}

/** Apply corruption gain from a corrupting event. Purity resists some corruption. */
export function applyCorruption(state: CorruptionState, amount: number): CorruptionState {
  const resistance = state.purity / 200; // purity halves corruption at max
  const reduced = amount * (1 - resistance);
  return {
    ...state,
    corruption: clamp(state.corruption + reduced, 0, 100),
    purity: clamp(state.purity - reduced * 0.5, 0, 100),
  };
}

/** Restore willpower through rest or positive activities. */
export function restoreWillpower(state: CorruptionState, amount: number): CorruptionState {
  return {
    ...state,
    willpower: clamp(state.willpower + amount, 0, 100),
  };
}

/** Get a label describing the NPC's corruption level. */
export function corruptionLabel(corruption: number): string {
  if (corruption >= 90) return 'Utterly Corrupt';
  if (corruption >= 70) return 'Deeply Corrupt';
  if (corruption >= 50) return 'Corrupted';
  if (corruption >= 30) return 'Tainted';
  if (corruption >= 10) return 'Slightly Tainted';
  return 'Pure';
}

/** Get a label describing the NPC's stress level. */
export function stressLabel(stress: number): string {
  if (stress >= 80) return 'Breaking';
  if (stress >= 60) return 'Overwhelmed';
  if (stress >= 40) return 'Anxious';
  if (stress >= 20) return 'Uneasy';
  return 'Calm';
}

/** Check if NPC has a mental breakdown (stress + trauma overwhelm control). */
export function hasBreakdown(state: CorruptionState): boolean {
  return state.stress > 90 && state.control < 10;
}

/** Check if NPC's willpower is broken (can't resist). */
export function isWillBroken(state: CorruptionState): boolean {
  return state.willpower < 5 && state.stress > 70;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
