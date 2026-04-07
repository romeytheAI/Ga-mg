/**
 * transformationEngine.ts — game-layer bridge for body transformation and ascension.
 *
 * Wraps TransformationSystem (pure sim) and maps to PlayerTransformation state.
 * All functions are pure with injectable rng for deterministic testing.
 *
 * @see src/sim/TransformationSystem.ts — underlying transformation engine
 * @see src/reducers/gameReducer.ts — ADD_BODY_CHANGE
 */

import { GameState, PlayerTransformation, PlayerBodyChange, AscensionPath } from '../types';
import {
  defaultTransformationState,
  addBodyChange,
  removeBodyChange,
  purgeTemporaryChanges,
  transformationStatEffects,
  evaluateAscension,
  tickAscension,
  ascensionLabel,
  mutationResistanceLabel,
} from '../sim/TransformationSystem';
import { TransformationState, BodyChange, CorruptionState } from '../sim/types';

// ── Type bridge ───────────────────────────────────────────────────────────────

function toSim(state: PlayerTransformation): TransformationState {
  return state as unknown as TransformationState;
}

function fromSim(state: TransformationState): PlayerTransformation {
  return state as unknown as PlayerTransformation;
}

/** Build a sim CorruptionState from player stats for ascension evaluation. */
function toCorruptionState(state: GameState): CorruptionState {
  return {
    stress: state.player.stats.stress,
    corruption: state.player.stats.corruption,
    trauma: state.player.stats.trauma,
    willpower: state.player.stats.willpower,
    purity: state.player.stats.purity,
    control: 100 - state.player.psych_profile.submission_index, // inverse of submission
    submission: state.player.psych_profile.submission_index,
  };
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export function defaultPlayerTransformation(): PlayerTransformation {
  return fromSim(defaultTransformationState());
}

// ── Body change ───────────────────────────────────────────────────────────────

export interface AddBodyChangeResult {
  transformation: PlayerTransformation;
  /** True when the change was resisted by mutation_resistance */
  resisted: boolean;
  narrative: string;
}

const CHANGE_NARRATIVES: Record<PlayerBodyChange['type'], string[]> = {
  cosmetic: [
    "A subtle shift crosses your reflection — something has changed.",
    "Your skin prickles as the alteration takes hold.",
    "It is a small thing. But it is permanent.",
  ],
  structural: [
    "Your bones ache as they reshape themselves over several days.",
    "Something deep inside you shifts — bone, sinew, form.",
    "The change is more fundamental than you expected.",
  ],
  supernatural: [
    "Reality itself seems to bend around you as the transformation unfolds.",
    "You feel the essence of what you are rewriting itself.",
    "Something otherworldly has left a mark on your soul as much as your body.",
  ],
};

/**
 * Attempt to apply a body change to the player.
 *
 * @param state     - Full game state
 * @param change    - Body change to apply
 * @param rng       - Injectable random (defaults to Math.random)
 */
export function resolveAddBodyChange(
  state: GameState,
  change: PlayerBodyChange,
  rng: () => number = Math.random,
): AddBodyChangeResult {
  const simBefore = toSim(state.player.transformation);
  const simChange = change as unknown as BodyChange;

  // Inject rng by temporarily substituting Math.random (restored in finally)
  const origRandom = Math.random;
  let simAfter: ReturnType<typeof addBodyChange>;
  try {
    (Math as any).random = rng;
    simAfter = addBodyChange(simBefore, simChange);
  } finally {
    (Math as any).random = origRandom;
  }

  const resisted = simAfter.body_changes.length === simBefore.body_changes.length;
  const lines = CHANGE_NARRATIVES[change.type];
  const narrative = resisted
    ? "Your body resists the change. Nothing happens."
    : lines[Math.floor(rng() * lines.length)];

  return { transformation: fromSim(simAfter), resisted, narrative };
}

export function resolveRemoveBodyChange(
  state: GameState,
  changeId: string,
): PlayerTransformation {
  return fromSim(removeBodyChange(toSim(state.player.transformation), changeId));
}

export function resolvePurgeTemporaryChanges(
  state: GameState,
): PlayerTransformation {
  return fromSim(purgeTemporaryChanges(toSim(state.player.transformation)));
}

// ── Stat effects ──────────────────────────────────────────────────────────────

export function getTransformationStatEffects(
  transformation: PlayerTransformation,
): Record<string, number> {
  return transformationStatEffects(toSim(transformation));
}

// ── Ascension ─────────────────────────────────────────────────────────────────

export function evaluatePlayerAscension(state: GameState): AscensionPath {
  return evaluateAscension(toSim(state.player.transformation), toCorruptionState(state)) as AscensionPath;
}

// ── Tick (used by ADVANCE_TIME) ───────────────────────────────────────────────

export function tickPlayerTransformation(
  state: GameState,
  hours: number,
): PlayerTransformation {
  return fromSim(tickAscension(toSim(state.player.transformation), toCorruptionState(state), hours));
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface TransformationSummary {
  ascension_path: AscensionPath;
  ascension_label: string;
  ascension_progress: number;
  mutation_resistance_label: string;
  body_change_count: number;
  permanent_change_count: number;
  stat_effects: Record<string, number>;
}

export function transformationSummary(transformation: PlayerTransformation): TransformationSummary {
  const sim = toSim(transformation);
  return {
    ascension_path: transformation.ascension,
    ascension_label: ascensionLabel(transformation.ascension as any),
    ascension_progress: transformation.ascension_progress,
    mutation_resistance_label: mutationResistanceLabel(transformation.mutation_resistance),
    body_change_count: transformation.body_changes.length,
    permanent_change_count: transformation.body_changes.filter(c => c.permanent).length,
    stat_effects: transformationStatEffects(sim),
  };
}

// Re-export labels for UI
export { ascensionLabel, mutationResistanceLabel };
