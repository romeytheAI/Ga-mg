/**
 * TransformationSystem — body modification and ascension paths.
 *
 * NPCs and players can undergo transformations that alter stats,
 * appearance, and unlock ascension paths based on accumulated changes.
 */
import { TransformationState, BodyChange, AscensionPath, CorruptionState, NpcTrait } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultTransformationState(): TransformationState {
  return {
    ascension: 'none',
    ascension_progress: 0,
    body_changes: [],
    mutation_resistance: 50,
  };
}

// ── Body Changes ─────────────────────────────────────────────────────────

export function addBodyChange(
  state: TransformationState,
  change: BodyChange
): TransformationState {
  const resistance = state.mutation_resistance;
  // Higher resistance = chance to reject non-permanent changes
  if (!change.permanent && Math.random() * 100 < resistance) {
    return state; // resisted
  }
  return {
    ...state,
    body_changes: [...state.body_changes, change],
    mutation_resistance: clamp(resistance - 2, 0, 100),
  };
}

export function removeBodyChange(
  state: TransformationState,
  changeId: string
): TransformationState {
  return {
    ...state,
    body_changes: state.body_changes.filter(c => c.id !== changeId),
  };
}

/** Purge all non-permanent changes (e.g. healing/purification). */
export function purgeTemporaryChanges(state: TransformationState): TransformationState {
  return {
    ...state,
    body_changes: state.body_changes.filter(c => c.permanent),
    mutation_resistance: clamp(state.mutation_resistance + 10, 0, 100),
  };
}

// ── Stat Effects ─────────────────────────────────────────────────────────

/** Compute net stat bonuses/penalties from all body changes. */
export function transformationStatEffects(
  state: TransformationState
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const change of state.body_changes) {
    for (const [stat, val] of Object.entries(change.stat_effects)) {
      result[stat] = (result[stat] ?? 0) + (val ?? 0);
    }
  }
  return result;
}

// ── Ascension ────────────────────────────────────────────────────────────

const ASCENSION_THRESHOLDS: Record<AscensionPath, { corruption: [number, number]; purity: [number, number]; changes_min: number }> = {
  none: { corruption: [0, 100], purity: [0, 100], changes_min: 0 },
  divine_spark:      { corruption: [0, 15], purity: [80, 100], changes_min: 0 },
  daedric_champion:  { corruption: [80, 100], purity: [0, 20], changes_min: 5 },
  hist_devoted:      { corruption: [60, 100], purity: [0, 40], changes_min: 8 },
  hircine_chosen:    { corruption: [30, 70], purity: [20, 60], changes_min: 4 },
  arcane_conduit:    { corruption: [20, 60], purity: [40, 80], changes_min: 3 },
};

/** Evaluate which ascension path an NPC qualifies for. */
export function evaluateAscension(
  state: TransformationState,
  corruption: CorruptionState
): AscensionPath {
  const changesCount = state.body_changes.length;
  for (const [path, req] of Object.entries(ASCENSION_THRESHOLDS) as [AscensionPath, typeof ASCENSION_THRESHOLDS[AscensionPath]][]) {
    if (path === 'none') continue;
    if (
      corruption.corruption >= req.corruption[0] &&
      corruption.corruption <= req.corruption[1] &&
      corruption.purity >= req.purity[0] &&
      corruption.purity <= req.purity[1] &&
      changesCount >= req.changes_min
    ) {
      return path;
    }
  }
  return 'none';
}

/** Tick ascension progress toward the qualifying path. */
export function tickAscension(
  state: TransformationState,
  corruption: CorruptionState,
  hours: number
): TransformationState {
  const qualifyingPath = evaluateAscension(state, corruption);
  if (qualifyingPath === 'none') {
    // Regress if no longer qualifying
    return {
      ...state,
      ascension_progress: clamp(state.ascension_progress - 0.5 * hours, 0, 100),
      ascension: state.ascension_progress <= 0 ? 'none' : state.ascension,
    };
  }
  const rate = 0.3 * hours;
  const newProgress = clamp(state.ascension_progress + rate, 0, 100);
  return {
    ...state,
    ascension: qualifyingPath,
    ascension_progress: newProgress,
  };
}

// ── Labels ───────────────────────────────────────────────────────────────

export function ascensionLabel(path: AscensionPath): string {
  const labels: Record<AscensionPath, string> = {
    none: 'Unascended',
    divine_spark:     'Divine Spark',
    daedric_champion: 'Daedric Champion',
    hist_devoted:     'Hist-Devoted',
    hircine_chosen:   'Hircine\'s Chosen',
    arcane_conduit:   'Arcane Conduit',
  };
  return labels[path];
}

export function mutationResistanceLabel(resistance: number): string {
  if (resistance >= 80) return 'Highly Resistant';
  if (resistance >= 60) return 'Resistant';
  if (resistance >= 40) return 'Moderate';
  if (resistance >= 20) return 'Susceptible';
  return 'Highly Susceptible';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
