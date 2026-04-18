/**
 * diseaseEngine.ts — game-layer bridge for the disease / infection system.
 *
 * Wraps DiseaseSystem (pure sim) and maps to PlayerDiseaseState.
 * All functions are pure for deterministic testing.
 *
 * @see src/sim/DiseaseSystem.ts — underlying disease engine
 * @see src/reducers/gameReducer.ts — CONTRACT_DISEASE, TREAT_DISEASE
 */

import { GameState, PlayerDiseaseState, PlayerDiseaseEntry, DiseaseType } from '../types';
import {
  defaultDiseaseState,
  contractDisease as simContract,
  treatDisease as simTreat,
  tickDisease,
  diseaseHealthDrain,
  diseaseStaminaDrain,
  diseaseSeverityLabel,
  overallHealthLabel,
} from '../sim/DiseaseSystem';
import { DiseaseState } from '../sim/types';

// ── Type bridge ───────────────────────────────────────────────────────────────

function toSim(state: PlayerDiseaseState): DiseaseState {
  return state as unknown as DiseaseState;
}

function fromSim(state: DiseaseState): PlayerDiseaseState {
  return state as unknown as PlayerDiseaseState;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export function defaultPlayerDiseaseState(): PlayerDiseaseState {
  return fromSim(defaultDiseaseState());
}

// ── Contract ──────────────────────────────────────────────────────────────────

export interface ContractDiseaseResult {
  disease_state: PlayerDiseaseState;
  /** True when player successfully contracted the disease */
  contracted: boolean;
  narrative: string;
}

const CONTRACT_NARRATIVES: Record<DiseaseType, string> = {
  ataxia:              "Your hands tremble. Writing, lockpicking, anything precise — suddenly difficult.",
  rattles:             "An unpleasant warmth spreads from the wound. Your limbs feel heavy and shivering.",
  brain_rot:           "The world blurs at the edges. Your thoughts scatter like startled birds. Magicka feels distant.",
  sanguinare_vampiris: "Your veins burn with a cold fire. The sun suddenly feels unwelcoming. The Volkihar's curse is in your blood.",
  blight:              "The blight-stench clings to your skin long after you leave the ash wastes. Your vision dims.",
  bone_break_fever:    "A deep ache radiates through your bones. Every step sends a lance of pain up your legs.",
};

const IMMUNE_NARRATIVE = "Your body shrugs off the exposure. You feel a brief flush, then nothing.";

/**
 * Attempt to contract a disease.
 *
 * @param state   - Full game state
 * @param disease - Disease to attempt contracting
 * @param turn    - Current game turn
 * @param rng     - Injectable random
 */
export function resolveContractDisease(
  state: GameState,
  disease: DiseaseType,
  turn: number,
  rng: () => number = Math.random,
): ContractDiseaseResult {
  const simBefore = toSim(state.player.disease_state);

  // Inject rng by temporarily substituting Math.random (restored in finally)
  const origRandom = Math.random;
  let simAfter: ReturnType<typeof simContract>;
  try {
    (Math as any).random = rng;
    simAfter = simContract(simBefore, disease as any, turn);
  } finally {
    (Math as any).random = origRandom;
  }

  const contracted = simAfter.active_diseases.length > simBefore.active_diseases.length;
  return {
    disease_state: fromSim(simAfter),
    contracted,
    narrative: contracted ? CONTRACT_NARRATIVES[disease] : IMMUNE_NARRATIVE,
  };
}

// ── Treat ─────────────────────────────────────────────────────────────────────

export function resolveTreatDisease(
  state: GameState,
  disease: DiseaseType,
): PlayerDiseaseState {
  return fromSim(simTreat(toSim(state.player.disease_state), disease as any));
}

// ── Tick (used by ADVANCE_TIME) ───────────────────────────────────────────────

export function tickPlayerDiseases(
  disease_state: PlayerDiseaseState,
  hours: number,
): PlayerDiseaseState {
  return fromSim(tickDisease(toSim(disease_state), hours));
}

// ── Per-hour drain effects ────────────────────────────────────────────────────

export interface DiseaseEffects {
  health_per_hour: number;
  stamina_per_hour: number;
  is_sick: boolean;
}

export function getDiseaseEffects(disease_state: PlayerDiseaseState): DiseaseEffects {
  const sim = toSim(disease_state);
  const dailyHealth  = diseaseHealthDrain(sim);
  const dailyStamina = diseaseStaminaDrain(sim);
  return {
    health_per_hour:  dailyHealth  / 24,
    stamina_per_hour: dailyStamina / 24,
    is_sick: disease_state.active_diseases.length > 0,
  };
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface DiseaseSummary {
  is_sick: boolean;
  overall_label: string;
  active_count: number;
  entries: Array<{
    disease: DiseaseType;
    severity_label: string;
    severity: number;
    treated: boolean;
  }>;
}

export function diseaseSummary(disease_state: PlayerDiseaseState): DiseaseSummary {
  const entries = disease_state.active_diseases.map(d => ({
    disease: d.disease as DiseaseType,
    severity_label: diseaseSeverityLabel(d.severity),
    severity: d.severity,
    treated: d.treated,
  }));

  return {
    is_sick: entries.length > 0,
    overall_label: overallHealthLabel(disease_state.overall_health_penalty),
    active_count: entries.length,
    entries,
  };
}

// Re-export labels for UI
export { diseaseSeverityLabel, overallHealthLabel };
