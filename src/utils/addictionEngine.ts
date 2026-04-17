/**
 * addictionEngine.ts — game-layer bridge for the substance / addiction system.
 *
 * Wraps AddictionSystem (pure sim) and maps results to player state deltas.
 * All functions are pure (injectable turn counter) for deterministic testing.
 *
 * @see src/sim/AddictionSystem.ts — underlying tolerance / withdrawal engine
 * @see src/reducers/gameReducer.ts — USE_SUBSTANCE, ADVANCE_TIME integration
 */

import { GameState, PlayerAddictionState, SubstanceType, AddictionEntry } from '../types';
import {
  useSubstance as simUseSubstance,
  tickAddiction,
  withdrawalStress,
  withdrawalStaminaDrain,
  dependencyLabel,
  withdrawalLabel,
} from '../sim/AddictionSystem';

// ── Type bridge ───────────────────────────────────────────────────────────────

type SimLike = { addictions: any[]; overall_dependency: number };

/** Convert PlayerAddictionState (types.ts) to sim-compatible object. */
function toSimState(state: PlayerAddictionState): SimLike {
  return {
    addictions: state.addictions,
    overall_dependency: state.overall_dependency,
  };
}

/** Convert sim result back to PlayerAddictionState. */
function fromSimState(state: SimLike): PlayerAddictionState {
  return {
    addictions: state.addictions as AddictionEntry[],
    overall_dependency: state.overall_dependency,
  };
}

// ── Display metadata ──────────────────────────────────────────────────────────

export const SUBSTANCE_LABELS: Record<SubstanceType, string> = {
  alcohol:           'Mead / Ale',
  moonsugar:         'Moon Sugar',
  skooma:            'Skooma',
  bloodwine:         'Blood Wine',
  sleeping_tree_sap: 'Sleeping Tree Sap',
  void_salts:        'Void Salts',
};

export const SUBSTANCE_RARITY: Record<SubstanceType, 'common' | 'uncommon' | 'rare' | 'legendary'> = {
  alcohol:           'common',
  moonsugar:         'uncommon',
  skooma:            'uncommon',
  bloodwine:         'rare',
  sleeping_tree_sap: 'rare',
  void_salts:        'legendary',
};

export function substanceLabel(substance: SubstanceType): string {
  return SUBSTANCE_LABELS[substance];
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface AddictionSummary {
  /** Total number of active substances with dependency > 0 */
  substance_count: number;
  /** Overall dependency label */
  overall_label: string;
  /** Per-substance labels for active addictions */
  entries: Array<{
    substance: SubstanceType;
    label: string;
    dependency: number;
    withdrawal: number;
    withdrawal_label: string;
  }>;
}

export function addictionSummary(player_state: PlayerAddictionState): AddictionSummary {
  const entries = player_state.addictions
    .filter(a => a.dependency > 0 || a.withdrawal > 0)
    .map(a => ({
      substance: a.substance as SubstanceType,
      label: dependencyLabel(a.dependency),
      dependency: a.dependency,
      withdrawal: a.withdrawal,
      withdrawal_label: withdrawalLabel(a.withdrawal),
    }));

  return {
    substance_count: entries.length,
    overall_label: dependencyLabel(player_state.overall_dependency),
    entries,
  };
}

// ── Use substance ─────────────────────────────────────────────────────────────

export interface SubstanceUseResult {
  addiction_state: PlayerAddictionState;
  /** Stress reduction (positive value to subtract from current stress) */
  stress_relief: number;
  /** Stamina/energy boost (positive adds to stamina) */
  energy_boost: number;
  /** Corruption gain from this use */
  corruption_risk: number;
  /** Player-facing narrative */
  narrative: string;
  /** Whether this use builds a new dependency flag */
  new_addiction: boolean;
}

const USE_NARRATIVES: Record<SubstanceType, string[]> = {
  alcohol: [
    "The mead burns pleasantly down your throat, taking the edge off the day.",
    "Warmth spreads through your chest as the ale dulls your worries.",
    "Another cup. The world softens around the edges.",
  ],
  moonsugar: [
    "The sweetness floods your senses — the world sparkles unnaturally bright.",
    "Moon sugar on your tongue and suddenly nothing hurts quite so much.",
    "A brief, dangerous euphoria. Your thoughts hum with unearned confidence.",
  ],
  skooma: [
    "The skooma hits like a thunderclap and the world dissolves into bliss.",
    "You feel invincible. You know you aren't. You don't care.",
    "The rush surges — then fades, leaving you gasping for more.",
  ],
  bloodwine: [
    "The bloodwine coats your throat with iron and warmth, your pulse quickening.",
    "Dark vitality floods your veins. You feel powerful and slightly sick.",
    "The rich red liquid takes hold — your senses sharpen to a lethal edge.",
  ],
  sleeping_tree_sap: [
    "The Sleeping Tree's pull fades to a gnawing hollow behind your eyes.",
    "Without the sap, time moves too fast. Every sensation is too sharp, too real.",
    "You catch yourself staring at nothing, waiting for the soft oblivion that won't come.",
  ],
  void_salts: [
    "The void salts' absence leaves a cold void in your chest — literally.",
    "Reality feels too solid, too dull. You saw through the cracks. Now they're sealed.",
    "Your hands shake. The power is gone, and what remains is hollow and afraid.",
  ],
};

/**
 * Resolve using a substance once.
 *
 * @param state      - Full game state
 * @param substance  - Substance being consumed
 * @param turn       - Current game turn (world.turn_count)
 * @param rng        - Injectable random (defaults to Math.random)
 */
export function resolveSubstanceUse(
  state: GameState,
  substance: SubstanceType,
  turn: number,
  rng: () => number = Math.random,
): SubstanceUseResult {
  const simState = toSimState(state.player.addiction_state);
  const hadDependency = simState.addictions.some(
    a => a.substance === (substance as any) && a.dependency > 0
  );

  const result = simUseSubstance(simState, substance as any, turn);

  const lines = USE_NARRATIVES[substance];
  const narrative = lines[Math.floor(rng() * lines.length)];

  const newHasDependency = result.addiction_state.addictions.some(
    a => a.substance === (substance as any) && a.dependency > 0
  );

  return {
    addiction_state: fromSimState(result.addiction_state),
    stress_relief: result.stress_relief,
    energy_boost: result.energy_boost,
    corruption_risk: result.corruption_risk,
    narrative,
    new_addiction: !hadDependency && newHasDependency,
  };
}

// ── Withdrawal effects (used by ADVANCE_TIME) ─────────────────────────────────

export interface WithdrawalEffects {
  /** Stress added per hour of withdrawal */
  stress_per_hour: number;
  /** Stamina drained per hour of withdrawal */
  stamina_per_hour: number;
  /** True when at least one substance is in active withdrawal */
  in_withdrawal: boolean;
}

export function getWithdrawalEffects(player_state: PlayerAddictionState): WithdrawalEffects {
  const simState = toSimState(player_state);
  const stress_per_hour = withdrawalStress(simState) / 24;   // daily → per-hour
  const stamina_per_hour = withdrawalStaminaDrain(simState) / 24;
  const in_withdrawal = simState.addictions.some(a => a.withdrawal > 5);

  return { stress_per_hour, stamina_per_hour, in_withdrawal };
}

// ── Tick (called by ADVANCE_TIME) ─────────────────────────────────────────────

/**
 * Advance the addiction state by `hours` elapsed in-game hours.
 *
 * @param player_state - Current PlayerAddictionState
 * @param turn         - Current game turn (world.turn_count)
 * @param hours        - Hours elapsed since last tick
 */
export function tickPlayerAddictions(
  player_state: PlayerAddictionState,
  turn: number,
  hours: number,
): PlayerAddictionState {
  const simState = toSimState(player_state);
  return fromSimState(tickAddiction(simState, turn, hours));
}
