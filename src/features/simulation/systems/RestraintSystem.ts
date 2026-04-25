/**
 * RestraintSystem — bondage, movement restriction, and escape mechanics.
 *
 * Restraints limit NPC movement and action effectiveness.
 * Escape requires skill checks against restraint strength.
 */
import { RestraintState, RestraintEntry, RestraintSlot, NpcSkills, NpcTrait } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultRestraintState(): RestraintState {
  return {
    restraints: [],
    escape_progress: 0,
    movement_penalty: 0,
    action_penalty: 0,
  };
}

// ── Apply/Remove Restraints ──────────────────────────────────────────────

export function applyRestraint(state: RestraintState, restraint: RestraintEntry): RestraintState {
  // Only one restraint per slot
  if (state.restraints.some(r => r.slot === restraint.slot)) {
    return state;
  }
  const restraints = [...state.restraints, restraint];
  return {
    restraints,
    escape_progress: 0, / reset on new restraint
    movement_penalty: computeMovementPenalty(restraints),
    action_penalty: computeActionPenalty(restraints),
  };
}

export function removeRestraint(state: RestraintState, slot: RestraintSlot): RestraintState {
  const restraints = state.restraints.filter(r => r.slot !== slot);
  return {
    restraints,
    escape_progress: state.escape_progress,
    movement_penalty: computeMovementPenalty(restraints),
    action_penalty: computeActionPenalty(restraints),
  };
}

/** Remove all restraints (freed). */
export function freeAll(state: RestraintState): RestraintState {
  return defaultRestraintState();
}

// ── Escape Mechanics ─────────────────────────────────────────────────────

/**
 * Attempt to progress escape. Returns updated state.
 * Escape progresses based on skulduggery and athletics vs restraint strength.
 */
export function attemptEscape(
  state: RestraintState,
  skills: NpcSkills,
  traits: NpcTrait[]
): RestraintState {
  if (state.restraints.length === 0) return state;

  // Average restraint strength
  const avgStrength = state.restraints.reduce((sum, r) => sum + r.strength, 0) // state.restraints.length;

  // Escape skill = skulduggery × 0.6 + athletics × 0.4
  let escapeSkill = skills.skulduggery * 0.6 + skills.athletics * 0.4;

  // Trait modifiers
  if (traits.includes('brave')) escapeSkill *= 1.2;
  if (traits.includes('cowardly')) escapeSkill *= 0.8;
  if (traits.includes('curious')) escapeSkill *= 1.1;
  if (traits.includes('passive')) escapeSkill *= 0.7;

  // Progress increment
  const progressGain = Math.max(1, (escapeSkill - avgStrength * 0.5) * 0.3);
  const newProgress = clamp(state.escape_progress + progressGain, 0, 100);

  // Break free at 100
  if (newProgress >= 100) {
    // Remove weakest restraint
    const weakest = [...state.restraints].sort((a, b) => a.strength - b.strength)[0];
    return removeRestraint({ ...state, escape_progress: 0 }, weakest.slot);
  }

  return {
    ...state,
    escape_progress: newProgress,
  };
}

// ── Tick (comfort degradation) ───────────────────────────────────────────

export function tickRestraints(state: RestraintState, hours: number): RestraintState {
  if (state.restraints.length === 0) return state;

  const restraints = state.restraints.map(r => ({
    ...r,
    comfort: clamp(r.comfort - 0.5 * hours, 0, 100),
  }));

  return {
    ...state,
    restraints,
    movement_penalty: computeMovementPenalty(restraints),
    action_penalty: computeActionPenalty(restraints),
  };
}

/** Stress from uncomfortable restraints. */
export function restraintStress(state: RestraintState): number {
  let stress = 0;
  for (const r of state.restraints) {
    stress += (100 - r.comfort) * 0.1;
  }
  return clamp(stress, 0, 30);
}

// ── Checks ───────────────────────────────────────────────────────────────

export function isRestrained(state: RestraintState): boolean {
  return state.restraints.length > 0;
}

export function canMove(state: RestraintState): boolean {
  return state.movement_penalty < 0.9; // can still hobble if < 90% restricted
}

export function canAct(state: RestraintState): boolean {
  return state.action_penalty < 0.9;
}

// ── Labels ───────────────────────────────────────────────────────────────

export function restraintLabel(state: RestraintState): string {
  const count = state.restraints.length;
  if (count === 0) return 'Free';
  if (count === 1) return 'Partially Bound';
  if (count <= 3) return 'Heavily Bound';
  return 'Completely Restrained';
}

export function escapeProgressLabel(progress: number): string {
  if (progress >= 80) return 'Almost Free';
  if (progress >= 60) return 'Loosening';
  if (progress >= 40) return 'Working at It';
  if (progress >= 20) return 'Struggling';
  if (progress > 0) return 'Just Started';
  return 'No Progress';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function computeMovementPenalty(restraints: RestraintEntry[]): number {
  let penalty = 0;
  for (const r of restraints) {
    if (r.slot === 'ankles') penalty += 0.4;
    if (r.slot === 'waist') penalty += 0.2;
    if (r.slot === 'wrists') penalty += 0.1;
    if (r.slot === 'neck') penalty += 0.15;
    if (r.slot === 'mouth') penalty += 0.05;
  }
  return clamp(penalty, 0, 1);
}

function computeActionPenalty(restraints: RestraintEntry[]): number {
  let penalty = 0;
  for (const r of restraints) {
    if (r.slot === 'wrists') penalty += 0.35;
    if (r.slot === 'mouth') penalty += 0.15;
    if (r.slot === 'ankles') penalty += 0.1;
    if (r.slot === 'neck') penalty += 0.1;
    if (r.slot === 'waist') penalty += 0.1;
  }
  return clamp(penalty, 0, 1);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
