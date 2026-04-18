/**
 * FactionSystem — faction reputation management for the simulation.
 *
 * Reputation scores range from -100 (nemesis) to 100 (exalted).
 * Each faction has independent standing that affects dialogue, prices,
 * quest access, and guard behavior.
 *
 * Pure functions; no side effects, no UI imports.
 */
import { FactionEntry, FactionId, FactionStanding } from './types';

// ── Default faction roster ─────────────────────────────────────────────────

export function defaultFactions(): FactionEntry[] {
  return [
    { id: 'town_guard',       name: 'Town Guard',       reputation: 0,  power: 70, is_active: true },
    { id: 'thieves_guild',    name: "Thieves' Guild",   reputation: 0,  power: 50, is_active: true },
    { id: 'merchants_guild',  name: "Merchants' Guild", reputation: 0,  power: 60, is_active: true },
    { id: 'church',           name: 'The Church',       reputation: 0,  power: 55, is_active: true },
    { id: 'nobility',         name: 'Nobility',         reputation: 0,  power: 65, is_active: true },
    { id: 'underground',      name: 'The Underground',  reputation: 0,  power: 40, is_active: true },
    { id: 'academia',         name: 'Academia',         reputation: 0,  power: 45, is_active: true },
    { id: 'wilderness_folk',  name: 'Wilderness Folk',  reputation: 0,  power: 30, is_active: true },
  ];
}

// ── Standing tier ──────────────────────────────────────────────────────────

/**
 * Convert a reputation score (-100 to 100) to a human-readable standing tier.
 */
export function getFactionStanding(reputation: number): FactionStanding {
  if (reputation >= 80)  return 'exalted';
  if (reputation >= 50)  return 'honored';
  if (reputation >= 20)  return 'friendly';
  if (reputation > -20)  return 'neutral';
  if (reputation > -50)  return 'unfriendly';
  if (reputation > -80)  return 'hostile';
  return 'nemesis';
}

// ── Reputation modification ────────────────────────────────────────────────

/**
 * Apply a reputation delta to a single faction. Clamps to [-100, 100].
 */
export function applyRepDelta(
  factions: FactionEntry[],
  factionId: FactionId,
  delta: number,
): FactionEntry[] {
  return factions.map(f => {
    if (f.id !== factionId) return f;
    const newRep = Math.max(-100, Math.min(100, f.reputation + delta));
    return { ...f, reputation: newRep };
  });
}

/**
 * Apply a reputation delta to multiple factions simultaneously.
 */
export function applyMultiRepDelta(
  factions: FactionEntry[],
  deltas: Partial<Record<FactionId, number>>,
): FactionEntry[] {
  let result = factions;
  for (const [id, delta] of Object.entries(deltas) as [FactionId, number][]) {
    if (delta !== undefined) {
      result = applyRepDelta(result, id, delta);
    }
  }
  return result;
}

// ── Rival faction effect ────────────────────────────────────────────────────

/**
 * Rival pairs: gaining rep with one loses rep with the other.
 * Returns additional deltas to apply to rivals.
 */
const RIVAL_PAIRS: Array<[FactionId, FactionId, number]> = [
  // [factionA, factionB, spillover_fraction]
  ['town_guard',      'thieves_guild',   0.5],
  ['town_guard',      'underground',     0.4],
  ['church',          'underground',     0.3],
  ['merchants_guild', 'thieves_guild',   0.3],
  ['nobility',        'underground',     0.4],
];

/**
 * Compute rival spillover deltas when reputation with a faction changes.
 * Returns a map of additional deltas to apply.
 */
export function computeRivalDeltas(
  factionId: FactionId,
  delta: number,
): Partial<Record<FactionId, number>> {
  const result: Partial<Record<FactionId, number>> = {};
  for (const [a, b, fraction] of RIVAL_PAIRS) {
    if (a === factionId) {
      result[b] = -(delta * fraction);
    } else if (b === factionId) {
      result[a] = -(delta * fraction);
    }
  }
  return result;
}

// ── Access gates ───────────────────────────────────────────────────────────

/**
 * Check whether current standing meets the required minimum for an interaction.
 * e.g. requiresStanding(factions, 'thieves_guild', 'friendly') returns true
 * only when the guild rep >= 20.
 */
export function meetsStanding(
  factions: FactionEntry[],
  factionId: FactionId,
  required: FactionStanding,
): boolean {
  const faction = factions.find(f => f.id === factionId);
  if (!faction || !faction.is_active) return false;
  const current = getFactionStanding(faction.reputation);
  const order: FactionStanding[] = ['nemesis', 'hostile', 'unfriendly', 'neutral', 'friendly', 'honored', 'exalted'];
  return order.indexOf(current) >= order.indexOf(required);
}

/**
 * Get the reputation score for a faction, or 0 if not found.
 */
export function getFactionRep(factions: FactionEntry[], factionId: FactionId): number {
  return factions.find(f => f.id === factionId)?.reputation ?? 0;
}

// ── Price modifier ─────────────────────────────────────────────────────────

/**
 * Compute a merchant price multiplier based on merchant guild standing.
 * Exalted: 10% discount; Nemesis: 30% markup.
 */
export function merchantPriceMultiplier(factions: FactionEntry[]): number {
  const rep = getFactionRep(factions, 'merchants_guild');
  // Linear interpolation: rep 100 → 0.90, rep 0 → 1.00, rep -100 → 1.30
  if (rep >= 0) return 1.0 - rep * 0.001;
  return 1.0 + Math.abs(rep) * 0.003;
}

// ── Passive faction drift ──────────────────────────────────────────────────

const FACTION_DRIFT_PER_DAY = 0.5; // reputation slowly returns toward 0

/**
 * Apply daily passive drift: extreme reputations decay toward neutral over time.
 * Absolute rep values > 20 drift toward 0 by FACTION_DRIFT_PER_DAY per day.
 */
export function driftFactions(factions: FactionEntry[]): FactionEntry[] {
  return factions.map(f => {
    if (Math.abs(f.reputation) <= 20) return f; // neutral band is stable
    const drift = f.reputation > 0 ? -FACTION_DRIFT_PER_DAY : FACTION_DRIFT_PER_DAY;
    return { ...f, reputation: f.reputation + drift };
  });
}

// ── Faction power change ────────────────────────────────────────────────────

/**
 * Modify a faction's power (0-100). Power affects encounter weight and
 * the consequences of standing changes.
 */
export function setFactionPower(
  factions: FactionEntry[],
  factionId: FactionId,
  power: number,
): FactionEntry[] {
  return factions.map(f =>
    f.id === factionId ? { ...f, power: Math.max(0, Math.min(100, power)) } : f,
  );
}

/**
 * Dissolve a faction (mark inactive). Removes their law enforcement and
 * quest hooks from the world.
 */
export function dissolveFaction(factions: FactionEntry[], factionId: FactionId): FactionEntry[] {
  return factions.map(f => (f.id === factionId ? { ...f, is_active: false } : f));
}
