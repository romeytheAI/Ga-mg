/**
 * willpowerEngine.ts — game-layer bridge for willpower, stress, and trauma mechanics.
 *
 * Wraps WillpowerSystem and CorruptionSystem (pure sim) and maps to GameState player stats.
 * All functions are pure with injectable rng for deterministic testing.
 *
 * Mental state tiers (willpower-based):
 *   unshakeable  85–100
 *   resolute     61–85
 *   steady       31–60
 *   strained     11–30
 *   breaking      0–10  (or stress >80 & control <20)
 *
 * @see src/sim/WillpowerSystem.ts — activity willpower effects, fortitude, resistance checks
 * @see src/sim/CorruptionSystem.ts — stress/trauma/recovery functions
 */

import { GameState } from '../../core/types';
import { CorruptionState } from '../../features/simulation/systems/types';
import {
  canResist,
  mentalFortitude,
  decisionQuality,
} from '../sim/WillpowerSystem';
import {
  applyStress,
  applyTrauma,
  restoreWillpower,
  isWillBroken,
  hasBreakdown,
  stressLabel,
} from '../sim/CorruptionSystem';

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Extract CorruptionState from GameState player stats. */
function toCorruptionState(state: GameState): CorruptionState {
  return {
    corruption:  state.player.stats.corruption,
    purity:      state.player.stats.purity,
    willpower:   state.player.stats.willpower,
    stress:      state.player.stats.stress,
    trauma:      state.player.stats.trauma,
    control:     state.player.stats.control,
    submission:  state.player.psych_profile.submission_index,
  };
}

/** Write CorruptionState fields back into GameState. */
function applyCorruptionState(state: GameState, cs: CorruptionState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      stats: {
        ...state.player.stats,
        willpower:  cs.willpower,
        stress:     cs.stress,
        trauma:     cs.trauma,
        control:    cs.control,
        corruption: cs.corruption,
        purity:     cs.purity,
      },
      psych_profile: {
        ...state.player.psych_profile,
        submission_index: cs.submission,
      },
    },
  };
}

// ── Public Types ──────────────────────────────────────────────────────────────

export type WillpowerTier = 'breaking''| 'strained''| 'steady''| 'resolute''| 'unshakeable';

export interface WillpowerChallengeResult {
  /** Whether the character successfully resisted. */
  success: boolean;
  /** Mental fortitude score used for the check. */
  fortitude: number;
  /** Narrative description of the outcome. */
  narrative: string;
  /** Updated GameState (stress added on failure). */
  state: GameState;
}

export interface StressEventResult {
  /** Whether a mental breakdown was triggered (stress >90 & control <10). */
  breakdown: boolean;
  /** Whether willpower is effectively broken (willpower <5 & stress >70). */
  willBroken: boolean;
  narrative: string;
  state: GameState;
}

export interface MentalRecoveryResult {
  /** Willpower points restored. */
  recovered: number;
  /** Stress points reduced. */
  stressReduced: number;
  narrative: string;
  state: GameState;
}

export interface TraumaEventResult {
  /** Actual severity applied (after willpower mitigation). */
  severity_applied: number;
  narrative: string;
  state: GameState;
}

export interface ControlLossResult {
  narrative: string;
  /** Additional consequences that fired from the control loss. */
  consequences: string[];
  state: GameState;
}

export interface WillpowerStatus {
  tier: WillpowerTier;
  willpower: number;
  stress: number;
  trauma: number;
  control: number;
  /** Combined fortitude score (0-100). */
  fortitude: number;
  /** Decision quality multiplier (0.3-1.0). */
  decisionQuality: number;
  isWillBroken: boolean;
  hasBreakdown: boolean;
  stressLabel: string;
  description: string;
}

// ── Narrative Tables ──────────────────────────────────────────────────────────

const CHALLENGE_SUCCESS: Record<string, string[]> = {
  temptation: [
    "You clench your jaw and look away. The temptation passes.",
    "Your hands tremble, but your resolve holds firm.",
    "The darkness whispers, but you do not listen.",
  ],
  pain: [
    "You breathe through the pain. It cannot break you.",
    "Your vision blurs, but you remain standing.",
    "Pain is a teacher. You refuse to be its student today.",
  ],
  corruption: [
    "The corrupting influence slides off your mind like water off oiled leather.",
    "You feel the pull toward darkness — and step back from the edge.",
    "Your soul shines bright enough to repel the shadow.",
  ],
  default: [
    "You hold yourself together through sheer willpower.",
    "The challenge tests you, but does not break you.",
  ],
};

const CHALLENGE_FAILURE: Record<string, string[]> = {
  temptation: [
    "You cannot resist. The temptation overwhelms you.",
    "Your willpower crumbles under the weight of desire.",
    "You surrender to it. The shame comes later.",
  ],
  pain: [
    "The pain is too great. You collapse.",
    "Your resistance shatters. Pain wins this round.",
    "You scream, and in screaming, lose control.",
  ],
  corruption: [
    "The darkness seeps into your soul. You feel something shift.",
    "Your defenses fail. The corruption takes root.",
    "A piece of your purity breaks away and does not return.",
  ],
  default: [
    "You fail. The pressure is too great.",
    "Your willpower gives way under the strain.",
  ],
};

const RECOVERY_NARRATIVES: Record<string, string[]> = {
  sleep: [
    "You sleep deeply, and the worries of waking life recede.",
    "Dreams carry you away from the pain. Morning finds you steadier.",
    "Unconsciousness is mercy. You wake less burdened.",
  ],
  meditation: [
    "In stillness, the storms of the mind grow quiet.",
    "You breathe in and out. The silence heals.",
    "Each breath releases something you have been holding too tightly.",
  ],
  prayer: [
    "You kneel before the shrine and let your burdens be heard.",
    "The Divines listen. The weight lightens.",
    "Whether the gods hear or not, the act of prayer itself restores something.",
  ],
  companion: [
    "The warmth of their presence soothes the ache in your mind.",
    "You are not alone. That truth restores you.",
    "They sit with you without speaking. It is enough.",
  ],
  substance: [
    "The substance floods your veins with artificial calm.",
    "For a moment, the pain recedes behind a comfortable haze.",
    "The relief is real, even if it is borrowed. You will pay it back later.",
  ],
};

const TRAUMA_NARRATIVES: string[] = [
  "The experience leaves a mark on your soul that will not soon fade.",
  "Something inside you cracks — not breaks, but cracks.",
  "You will remember this. The memory will cost you.",
  "Trauma etches itself into your nervous system. You flinch at shadows now.",
  "The psychic wound is invisible, but no less real for it.",
];

const CONTROL_LOSS_NARRATIVES: string[] = [
  "Your willpower collapses entirely. You act on instinct alone.",
  "The last thread of self-control snaps. What happens next is not entirely your fault.",
  "Empty of resistance, your body moves without your permission.",
  "You lose yourself for a while. The self you find afterward is slightly different.",
  "There is nothing left to resist with. You are a leaf in a storm.",
];

// ── Engine Functions ──────────────────────────────────────────────────────────

/**
 * Test willpower against a difficulty threshold.
 *
 * @param state      Full game state.
 * @param difficulty 0–100. 100 = nearly impossible to resist.
 * @param source     Narrative category: 'temptation''| 'pain''| 'corruption''| string.
 * @param rng        Injectable random source (defaults to Math.random).
 *
 * On failure, stress is added proportional to the difficulty gap.
 */
export function resolveWillpowerChallenge(
  state: GameState,
  difficulty: number,
  source: string,
  rng: () => number = Math.random,
): WillpowerChallengeResult {
  const cs = toCorruptionState(state);
  const fortitude = mentalFortitude(cs);
  const success = canResist(cs, difficulty);

  const pool = success
    ? (CHALLENGE_SUCCESS[source] ?? CHALLENGE_SUCCESS.default)
    : (CHALLENGE_FAILURE[source] ?? CHALLENGE_FAILURE.default);
  const narrative = pool[Math.floor(rng() * pool.length)];

  // Failure adds stress proportional to the difficulty gap
  let nextState = state;
  if (!success) {
    const effectiveFortitude = fortitude * (1 - cs.corruption / 200);
    const gap = difficulty - effectiveFortitude;
    const stressGain = clamp(gap * 0.3, 1, 20);
    const updated = applyStress(cs, stressGain);
    nextState = applyCorruptionState(state, updated);
  }

  return { success, fortitude, narrative, state: nextState };
}

/**
 * Apply psychological stress from an event.
 *
 * High severity can push the character into breakdown (stress >90, control <10)
 * or shatter willpower entirely (willpower <5, stress >70).
 *
 * @param state    Full game state.
 * @param severity 0–100 stress magnitude.
 * @param source   Human-readable event label for narrative.
 * @param rng      Injectable random source.
 */
export function resolveStressEvent(
  state: GameState,
  severity: number,
  source: string,
  rng: () => number = Math.random,
): StressEventResult {
  const cs = toCorruptionState(state);
  const updated = applyStress(cs, severity);
  const willBroken = isWillBroken(updated);
  const breakdown = hasBreakdown(updated);

  let narrative: string;
  if (breakdown) {
    narrative = "Your mind cannot bear any more. You break down completely.";
  } else if (willBroken) {
    narrative = "Your willpower is shattered. You are wide open and unable to resist anything.";
  } else if (severity > 15) {
    narrative = `The ${source} weighs on you heavily. Stress coils around your mind like a vice.`;
  } else {
    narrative = `The ${source} unsettles you. Stress rises.`;
  }

  return {
    breakdown,
    willBroken,
    narrative,
    state: applyCorruptionState(state, updated),
  };
}

/**
 * Recover willpower and reduce stress via a chosen method.
 *
 * Methods and their approximate recovery values:
 *   sleep      — will +15, stress -20 (best overall)
 *   meditation — will +10, stress -15
 *   prayer     — will +8,  stress -12
 *   companion  — will +12, stress -18
 *   substance  — will +5,  stress -25 (fast stress relief, low will gain; addiction risk separate)
 *
 * @param state  Full game state.
 * @param method Recovery method.
 * @param rng    Injectable random source.
 */
export function resolveMentalRecovery(
  state: GameState,
  method: 'sleep''| 'meditation''| 'prayer''| 'companion''| 'substance',
  rng: () => number = Math.random,
): MentalRecoveryResult {
  const cs = toCorruptionState(state);

  const RECOVERY_CONFIG: Record<typeof method, { will: number; stress: number }> = {
    sleep:      { will: 15, stress: 20 },
    meditation: { will: 10, stress: 15 },
    prayer:     { will: 8,  stress: 12 },
    companion:  { will: 12, stress: 18 },
    substance:  { will: 5,  stress: 25 },
  };

  const config = RECOVERY_CONFIG[method];
  let updated = restoreWillpower(cs, config.will);
  updated = { ...updated, stress: clamp(updated.stress - config.stress, 0, 100) };

  const pool = RECOVERY_NARRATIVES[method] ?? ["You recover somewhat."];
  const narrative = pool[Math.floor(rng() * pool.length)];

  return {
    recovered: config.will,
    stressReduced: config.stress,
    narrative,
    state: applyCorruptionState(state, updated),
  };
}

/**
 * Apply a traumatic experience. Trauma has lasting effects on willpower ceiling
 * and control (persists across rests).
 *
 * @param state    Full game state.
 * @param severity 0–100 trauma magnitude.
 * @param rng      Injectable random source.
 */
export function resolveTraumaEvent(
  state: GameState,
  severity: number,
  rng: () => number = Math.random,
): TraumaEventResult {
  const cs = toCorruptionState(state);
  const updated = applyTrauma(cs, severity);
  const narrative = TRAUMA_NARRATIVES[Math.floor(rng() * TRAUMA_NARRATIVES.length)];

  return {
    severity_applied: severity,
    narrative,
    state: applyCorruptionState(state, updated),
  };
}

/**
 * Consequence resolver for when willpower reaches 0.
 *
 * The character loses self-governance: control plummets, submission spikes,
 * and high corruption invites deeper corruption gain.
 *
 * @param state Full game state.
 * @param rng   Injectable random source.
 */
export function resolveControlLoss(
  state: GameState,
  rng: () => number = Math.random,
): ControlLossResult {
  const cs = toCorruptionState(state);
  const consequences: string[] = [];

  let updated: CorruptionState = {
    ...cs,
    control:    clamp(cs.control    - 20, 0, 100),
    submission: clamp(cs.submission + 15, 0, 100),
    stress:     clamp(cs.stress     + 10, 0, 100),
  };

  // High corruption takes advantage of the vulnerability
  if (cs.corruption > 40) {
    updated = { ...updated, corruption: clamp(updated.corruption + 5, 0, 100) };
    consequences.push("The corruption takes advantage of your weakness and seeps deeper.");
  }

  if (cs.stress > 70) {
    consequences.push(
      "Under this much stress, your mind retreats somewhere safe — and leaves your body behind.",
    );
  }

  consequences.push("Your sense of self frays at the edges.");

  const narrative = CONTROL_LOSS_NARRATIVES[Math.floor(rng() * CONTROL_LOSS_NARRATIVES.length)];

  return {
    narrative,
    consequences,
    state: applyCorruptionState(state, updated),
  };
}

/**
 * Summarise the character's current mental state.
 *
 * Tier thresholds:
 *   unshakeable  willpower > 85
 *   resolute     willpower 61–85
 *   steady       willpower 31–60
 *   strained     willpower 11–30
 *   breaking     willpower ≤10 OR (stress >80 AND control <20)
 */
export function getWillpowerStatus(state: GameState): WillpowerStatus {
  const cs = toCorruptionState(state);
  const fortitude = mentalFortitude(cs);
  const quality = decisionQuality(cs);

  let tier: WillpowerTier;
  let description: string;

  if (cs.willpower <= 10 || (cs.stress > 80 && cs.control < 20)) {
    tier = 'breaking';
    description =
      "Your mind is on the verge of collapse. You can barely hold yourself together.";
  } else if (cs.willpower <= 30 || cs.stress > 60) {
    tier = 'strained';
    description = "Stress and fatigue are wearing you down. Your resolve is thin.";
  } else if (cs.willpower <= 60) {
    tier = 'steady';
    description = "You are holding together well enough. Not strong, but not broken.";
  } else if (cs.willpower <= 85) {
    tier = 'resolute';
    description = "Your will is firm. You can face what comes with clear purpose.";
  } else {
    tier = 'unshakeable';
    description = "Your mind is like iron. Very little can shake your resolve.";
  }

  return {
    tier,
    willpower:      cs.willpower,
    stress:         cs.stress,
    trauma:         cs.trauma,
    control:        cs.control,
    fortitude,
    decisionQuality: quality,
    isWillBroken:   isWillBroken(cs),
    hasBreakdown:   hasBreakdown(cs),
    stressLabel:    stressLabel(cs.stress),
    description,
  };
}
