/**
 * factionEngine — game-layer bridge for FactionSystem and CrimeSystem.
 *
 * Translates between the full GameState world model and the pure sim-layer
 * FactionSystem / CrimeSystem functions. Used by the reducer and UI layer.
 *
 * All functions are pure; no side-effects or async calls.
 */
import {
  FactionEntry,
  FactionId,
  FactionStanding,
  CriminalRecord,
  CrimeType,
  GuardAlertLevel,
} from '../sim/types';
import {
  defaultFactions,
  getFactionStanding,
  applyRepDelta,
  applyMultiRepDelta,
  computeRivalDeltas,
  meetsStanding,
  getFactionRep,
  merchantPriceMultiplier,
  driftFactions,
  dissolveFaction,
} from '../sim/FactionSystem';
import {
  defaultCriminalRecord,
  defaultGuardState,
  commitCrime,
  discoverCrime,
  payBounty,
  serveSentence,
  calculateSentence,
  escalateGuardAlert,
  tickGuardPursuit,
  guardStandDown,
  escapeChance,
  isWanted,
  wantedLabel,
  guardAlertLabel,
  getActiveCrimes,
  totalBounty,
} from '../sim/CrimeSystem';

// ── Re-export everything so callers import from one place ─────────────────

export {
  defaultFactions,
  getFactionStanding,
  applyRepDelta,
  applyMultiRepDelta,
  computeRivalDeltas,
  meetsStanding,
  getFactionRep,
  merchantPriceMultiplier,
  driftFactions,
  dissolveFaction,
  defaultCriminalRecord,
  defaultGuardState,
  commitCrime,
  discoverCrime,
  payBounty,
  serveSentence,
  calculateSentence,
  escalateGuardAlert,
  tickGuardPursuit,
  guardStandDown,
  escapeChance,
  isWanted,
  wantedLabel,
  guardAlertLabel,
  getActiveCrimes,
  totalBounty,
};

// ── Faction rep delta with rival spillover ─────────────────────────────────

/**
 * Apply a faction rep change WITH automatic rival spillover.
 * This is the preferred function for all rep-modifying game events.
 *
 * @param factions  Current faction array
 * @param factionId Faction being affected
 * @param delta     Change to apply (positive or negative)
 * @returns Updated faction array
 */
export function applyRepWithRivalSpillover(
  factions: FactionEntry[],
  factionId: FactionId,
  delta: number,
): FactionEntry[] {
  let result = applyRepDelta(factions, factionId, delta);
  const rivals = computeRivalDeltas(factionId, delta);
  result = applyMultiRepDelta(result, rivals);
  return result;
}

// ── Faction access gate helpers ────────────────────────────────────────────

/**
 * Check whether the player can access a faction-gated service/area.
 * Returns true if the faction is active and the player's standing ≥ required.
 */
export function canAccessFactionService(
  factions: FactionEntry[],
  factionId: FactionId,
  requiredStanding: FactionStanding,
): boolean {
  return meetsStanding(factions, factionId, requiredStanding);
}

/**
 * Build a summary of all faction standings for UI display.
 * Returns array sorted by reputation descending.
 */
export function buildFactionSummary(factions: FactionEntry[]): Array<{
  id: FactionId;
  name: string;
  reputation: number;
  standing: FactionStanding;
  is_active: boolean;
}> {
  return [...factions]
    .sort((a, b) => b.reputation - a.reputation)
    .map(f => ({
      id: f.id,
      name: f.name,
      reputation: f.reputation,
      standing: getFactionStanding(f.reputation),
      is_active: f.is_active,
    }));
}

// ── Crime event helpers ────────────────────────────────────────────────────

/**
 * Record a crime and return both updated criminal record and faction rep impact.
 * Witnessed crimes against town_guard reduce town_guard rep; crimes for
 * thieves_guild actually improve that faction's rep slightly.
 */
export function processCrimeEvent(
  record: CriminalRecord,
  factions: FactionEntry[],
  type: CrimeType,
  factionId: FactionId,
  turn: number,
  witnessed: boolean,
): { record: CriminalRecord; factions: FactionEntry[] } {
  const updatedRecord = commitCrime(record, type, factionId, turn, witnessed);

  // Rep impact: witnessed crimes hurt standing with the victim faction
  let updatedFactions = factions;
  if (witnessed) {
    const repPenalty = -Math.ceil(updatedRecord.crimes.at(-1)!.severity / 10);
    updatedFactions = applyRepWithRivalSpillover(factions, factionId, repPenalty);
  }

  return { record: updatedRecord, factions: updatedFactions };
}

/**
 * Process paying bounty: remove crimes from record AND restore some faction rep.
 */
export function processPayBounty(
  record: CriminalRecord,
  factions: FactionEntry[],
  factionId: FactionId,
): { record: CriminalRecord; factions: FactionEntry[]; gold_paid: number } {
  const { record: newRecord, gold_paid } = payBounty(record, factionId);

  // Paying bounty partially restores rep (up to +15)
  const repRestored = Math.min(15, Math.ceil(gold_paid / 10));
  const updatedFactions = applyRepDelta(factions, factionId, repRestored);

  return { record: newRecord, factions: updatedFactions, gold_paid };
}

/**
 * Process serving a sentence: clears crimes AND restores more rep than paying.
 */
export function processServeSentence(
  record: CriminalRecord,
  factions: FactionEntry[],
  factionId: FactionId,
): { record: CriminalRecord; factions: FactionEntry[] } {
  const newRecord = serveSentence(record, factionId);

  // Serving time restores more rep than paying (up to +25)
  const updatedFactions = applyRepDelta(factions, factionId, 25);

  return { record: newRecord, factions: updatedFactions };
}

// ── Guard response helpers ─────────────────────────────────────────────────

/**
 * Determine whether a guard NPC should engage based on wanted status and
 * current alert level.
 */
export function guardShouldEngage(
  record: CriminalRecord,
  guardFactionId: FactionId,
): boolean {
  if (!isWanted(record, guardFactionId)) return false;
  return totalBounty(record) > 0;
}

/**
 * Build player wanted status display for HUD.
 */
export function buildWantedStatus(
  record: CriminalRecord,
): {
  label: string;
  total_bounty: number;
  wanted_by: FactionId[];
  crimes_count: number;
} {
  return {
    label: wantedLabel(record),
    total_bounty: record.total_bounty,
    wanted_by: record.wanted_by,
    crimes_count: record.crimes.filter(c => !c.cleared).length,
  };
}

// ── Type re-exports ────────────────────────────────────────────────────────

export type {
  FactionEntry,
  FactionId,
  FactionStanding,
  CriminalRecord,
  CrimeType,
  GuardAlertLevel,
};
