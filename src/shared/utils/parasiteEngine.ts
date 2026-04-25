/**
 * parasiteEngine.ts — game-layer bridge for the parasite / infestation system.
 *
 * Wraps ParasiteSystem (pure sim) and maps to PlayerParasiteState.
 * All functions are pure for deterministic testing.
 *
 * @see src/sim/ParasiteSystem.ts — underlying parasite engine
 * @see src/reducers/gameReducer.ts — ATTACH_PARASITE, REMOVE_PARASITE
 */

import { GameState, PlayerParasiteState, PlayerParasiteEntry, ParasiteSpecies } from '../../core/types';
import {
  defaultParasiteState,
  attachParasite as simAttach,
  removeParasite as simRemove,
  purgeAllParasites,
  tickParasite,
  totalHealthDrain,
  totalStaminaDrain,
  totalCorruptionBuff,
  symbioticHealthRegen,
  infestationLabel,
  symbiosisLabel,
} from '../sim/ParasiteSystem';
import { ParasiteState } from '../../features/simulation/systems/types';

// ── Type bridge ───────────────────────────────────────────────────────────────

function toSim(state: PlayerParasiteState): ParasiteState {
  return state as unknown as ParasiteState;
}

function fromSim(state: ParasiteState): PlayerParasiteState {
  return state as unknown as PlayerParasiteState;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export function defaultPlayerParasiteState(): PlayerParasiteState {
  return fromSim(defaultParasiteState());
}

// ── Attach ────────────────────────────────────────────────────────────────────

export interface AttachParasiteResult {
  parasite_state: PlayerParasiteState;
  attached: boolean;
  narrative: string;
}

const ATTACH_NARRATIVES: Record<ParasiteSpecies, string> = {
  kwama_larva:   "A Kwama larva wriggles beneath your skin — you feel your thoughts begin to fray at the edges.",
  cinder_tick:   "The cinder tick latches on before you notice, hot mandibles pressing deep into your skin.",
  chaurus_larva: "The chaurus larva burrows in with a cold precision that chills your blood and dims your will.",
  ancestor_moth: "Ancestor moth dust settles softly into your lungs. Your dreams will no longer be entirely your own.",
  bone_grub:     "You feel the bone grub nestle between your joints — a deep, grinding wrongness that won't leave.",
};

const FULL_NARRATIVE = "Your body is already carrying too many passengers. This one finds no purchase.";

export function resolveAttachParasite(
  state: GameState,
  species: ParasiteSpecies,
  turn: number,
): AttachParasiteResult {
  const simBefore = toSim(state.player.parasite_state);
  const simAfter = simAttach(simBefore, species as any, turn);
  const attached = simAfter.parasites.length > simBefore.parasites.length;
  return {
    parasite_state: fromSim(simAfter),
    attached,
    narrative: attached ? ATTACH_NARRATIVES[species] : FULL_NARRATIVE,
  };
}

export function resolveRemoveParasite(
  state: GameState,
  index: number,
): PlayerParasiteState {
  return fromSim(simRemove(toSim(state.player.parasite_state), index));
}

export function resolvePurgeAllParasites(): PlayerParasiteState {
  return fromSim(purgeAllParasites({ parasites: [], infestation_level: 0, symbiotic_benefits: 0 }));
}

// ── Tick (used by ADVANCE_TIME) ───────────────────────────────────────────────

export function tickPlayerParasites(
  parasite_state: PlayerParasiteState,
  hours: number,
): PlayerParasiteState {
  return fromSim(tickParasite(toSim(parasite_state), hours));
}

// ── Per-hour drain effects ────────────────────────────────────────────────────

export interface ParasiteEffects {
  health_per_hour: number;
  stamina_per_hour: number;
  corruption_per_hour: number;
  symbiotic_regen_per_hour: number;
  is_infested: boolean;
}

export function getParasiteEffects(parasite_state: PlayerParasiteState): ParasiteEffects {
  const sim = toSim(parasite_state);
  return {
    health_per_hour:           totalHealthDrain(sim) // 24,
    stamina_per_hour:          totalStaminaDrain(sim) // 24,
    corruption_per_hour:       totalCorruptionBuff(sim) // 24,
    symbiotic_regen_per_hour:  symbioticHealthRegen(sim) // 24,
    is_infested: parasite_state.parasites.length > 0,
  };
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface ParasiteSummary {
  is_infested: boolean;
  infestation_label: string;
  infestation_level: number;
  symbiotic_benefits: number;
  parasite_count: number;
  entries: Array<{
    species: ParasiteSpecies;
    maturity: number;
    symbiosis_label: string;
    symbiosis: number;
  }>;
}

export function parasiteSummary(parasite_state: PlayerParasiteState): ParasiteSummary {
  const entries = parasite_state.parasites.map(p => ({
    species: p.species as ParasiteSpecies,
    maturity: p.maturity,
    symbiosis_label: symbiosisLabel(p.symbiosis),
    symbiosis: p.symbiosis,
  }));

  return {
    is_infested: entries.length > 0,
    infestation_label: infestationLabel(parasite_state.infestation_level),
    infestation_level: parasite_state.infestation_level,
    symbiotic_benefits: parasite_state.symbiotic_benefits,
    parasite_count: entries.length,
    entries,
  };
}

// Re-export labels for UI
export { infestationLabel, symbiosisLabel };
