/**
 * companionEngine.ts — game-layer bridge for the companion / party system.
 *
 * Wraps CompanionSystem (pure sim) and maps to PlayerCompanionState.
 * All functions are pure for deterministic testing.
 *
 * @see src/sim/CompanionSystem.ts — underlying companion engine
 * @see src/reducers/gameReducer.ts — ADD_COMPANION, REMOVE_COMPANION, DAMAGE_COMPANION
 */

import { GameState, PlayerCompanionState, PlayerCompanionEntry, CompanionRole } from '../types';
import {
  defaultCompanionState,
  addCompanion as simAdd,
  removeCompanion as simRemove,
  tickCompanions,
  partyCombatBonus,
  partyHealRate,
  partyScoutRange,
  partyCarryCapacity,
  damageCompanion,
  checkDesertion,
  loyaltyLabel,
  bondLabel,
  moraleLabel,
} from '../sim/CompanionSystem';
import { CompanionState, CompanionEntry } from '../sim/types';

// ── Type bridge ───────────────────────────────────────────────────────────────

function toSim(state: PlayerCompanionState): CompanionState {
  return state as unknown as CompanionState;
}

function fromSim(state: CompanionState): PlayerCompanionState {
  return state as unknown as PlayerCompanionState;
}

function entryToSim(entry: PlayerCompanionEntry): CompanionEntry {
  return entry as unknown as CompanionEntry;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export function defaultPlayerCompanionState(): PlayerCompanionState {
  return fromSim(defaultCompanionState());
}

// ── Add companion ─────────────────────────────────────────────────────────────

export interface AddCompanionResult {
  companion_state: PlayerCompanionState;
  added: boolean;
  narrative: string;
}

const ROLE_JOIN_NARRATIVES: Record<CompanionRole, string> = {
  fighter:   "A blade-worn warrior falls into step beside you. You feel safer already.",
  healer:    "A healer joins your party, satchel of herbs across their shoulder.",
  scout:     "A sharp-eyed scout slips out of the shadows to join your cause.",
  pack_mule: "A stoic pack mule plods into your retinue, carrying more than it lets on.",
  familiar:  "A strange creature bonds itself to you, its eyes gleaming with arcane light.",
};

const PARTY_FULL_NARRATIVE = "Your party is already at full capacity.";

export function resolveAddCompanion(
  state: GameState,
  companion: PlayerCompanionEntry,
): AddCompanionResult {
  const simBefore = toSim(state.player.companion_state);
  const simAfter = simAdd(simBefore, entryToSim(companion));
  const added = simAfter.companions.length > simBefore.companions.length;
  return {
    companion_state: fromSim(simAfter),
    added,
    narrative: added ? ROLE_JOIN_NARRATIVES[companion.role] : PARTY_FULL_NARRATIVE,
  };
}

export function resolveRemoveCompanion(
  state: GameState,
  companionId: string,
): PlayerCompanionState {
  return fromSim(simRemove(toSim(state.player.companion_state), companionId));
}

export function resolveDamageCompanion(
  state: GameState,
  companionId: string,
  damage: number,
): { companion_state: PlayerCompanionState; deserted: boolean } {
  const simAfter = damageCompanion(toSim(state.player.companion_state), companionId, damage);
  const damagedEntry = simAfter.companions.find(c => c.id === companionId);
  const deserted = damagedEntry ? checkDesertion(damagedEntry) : false;
  // Auto-remove if deserted
  const finalState = deserted
    ? simRemove(simAfter, companionId)
    : simAfter;
  return { companion_state: fromSim(finalState), deserted };
}

// ── Tick (used by ADVANCE_TIME) ───────────────────────────────────────────────

export function tickPlayerCompanions(
  companion_state: PlayerCompanionState,
  hours: number,
): PlayerCompanionState {
  return fromSim(tickCompanions(toSim(companion_state), hours));
}

// ── Party bonuses ─────────────────────────────────────────────────────────────

export interface PartyBonuses {
  combat_bonus: number;
  heal_rate_per_hour: number;
  scout_range: number;
  carry_capacity: number;
}

export function getPartyBonuses(companion_state: PlayerCompanionState): PartyBonuses {
  const sim = toSim(companion_state);
  return {
    combat_bonus:        partyCombatBonus(sim),
    heal_rate_per_hour:  partyHealRate(sim) / 24,
    scout_range:         partyScoutRange(sim),
    carry_capacity:      partyCarryCapacity(sim),
  };
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface CompanionSummary {
  companion_count: number;
  max_party_size: number;
  party_synergy: number;
  combat_bonus: number;
  entries: Array<{
    id: string;
    name: string;
    role: CompanionRole;
    health: number;
    loyalty_label: string;
    bond_label: string;
    morale_label: string;
  }>;
}

export function companionSummary(companion_state: PlayerCompanionState): CompanionSummary {
  const sim = toSim(companion_state);
  const entries = companion_state.companions.map(c => ({
    id: c.id,
    name: c.name,
    role: c.role as CompanionRole,
    health: c.health,
    loyalty_label: loyaltyLabel(c.loyalty),
    bond_label: bondLabel(c.bond),
    morale_label: moraleLabel(c.morale),
  }));

  return {
    companion_count: companion_state.companions.length,
    max_party_size: companion_state.max_party_size,
    party_synergy: companion_state.party_synergy,
    combat_bonus: partyCombatBonus(sim),
    entries,
  };
}

// Re-export labels for UI
export { loyaltyLabel, bondLabel, moraleLabel };
