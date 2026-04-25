/**
 * CrimeSystem — crime recording, bounty accumulation, and guard response logic.
 *
 * Crimes are committed against a faction's legal authority. Witnessed crimes
 * generate bounty and trigger guard alert escalation. Players can pay fines,
 * serve jail time, or attempt to escape pursuit.
 *
 * Pure functions; no side effects, no UI imports.
 */
import {
  CriminalRecord,
  CrimeRecord,
  CrimeType,
  FactionId,
  GuardAlertLevel,
  GuardState,
} from './types';

// ── Defaults ──────────────────────────────────────────────────────────────────

export function defaultCriminalRecord(): CriminalRecord {
  return {
    crimes: [],
    total_bounty: 0,
    wanted_by: [],
    guard_state: null,
  };
}

export function defaultGuardState(factionId: FactionId): GuardState {
  return {
    alert_level: 'unaware',
    target_id: null,
    pursuit_stamina: 100,
    last_crime_seen: null,
    faction_id: factionId,
  };
}

// ── Crime severity table ────────────────────────────────────────────────────

const CRIME_SEVERITY: Record<CrimeType, number> = {
  theft:        30,
  assault:      55,
  murder:       90,
  trespassing:  20,
  contraband:   45,
  vandalism:    25,
  bribery:      40,
  espionage:    70,
};

const CRIME_BASE_BOUNTY: Record<CrimeType, number> = {
  theft:        20,
  assault:      50,
  murder:      200,
  trespassing:  10,
  contraband:   40,
  vandalism:    15,
  bribery:      35,
  espionage:    80,
};

// ── Commit a crime ─────────────────────────────────────────────────────────

/**
 * Record a new crime committed by an entity.
 * Witnessed crimes add to bounty immediately; unwitnessed crimes can still
 * be discovered later.
 */
export function commitCrime(
  record: CriminalRecord,
  type: CrimeType,
  factionId: FactionId,
  turn: number,
  witnessed: boolean,
): CriminalRecord {
  const severity = CRIME_SEVERITY[type];
  const bountyValue = witnessed ? CRIME_BASE_BOUNTY[type] : 0;

  const crime: CrimeRecord = {
    type,
    turn,
    severity,
    faction_id: factionId,
    witnessed,
    bounty_value: bountyValue,
    cleared: false,
  };

  const newCrimes = [...record.crimes, crime];
  const newBounty = record.total_bounty + bountyValue;

  const wantedBy = witnessed && !record.wanted_by.includes(factionId)
    ? [...record.wanted_by, factionId]
    : record.wanted_by;

  return {
    ...record,
    crimes: newCrimes,
    total_bounty: newBounty,
    wanted_by: wantedBy,
  };
}

// ── Witness discovery ──────────────────────────────────────────────────────

/**
 * A previously unwitnessed crime is discovered (e.g., body found, tip-off).
 * Upgrades the crime record and adds bounty.
 */
export function discoverCrime(
  record: CriminalRecord,
  crimeIndex: number,
): CriminalRecord {
  const crime = record.crimes[crimeIndex];
  if (!crime || crime.witnessed || crime.cleared) return record;

  const additionalBounty = CRIME_BASE_BOUNTY[crime.type];
  const updatedCrime: CrimeRecord = {
    ...crime,
    witnessed: true,
    bounty_value: additionalBounty,
  };

  const newCrimes = record.crimes.map((c, i) => (i === crimeIndex ? updatedCrime : c));
  const wantedBy = !record.wanted_by.includes(crime.faction_id)
    ? [...record.wanted_by, crime.faction_id]
    : record.wanted_by;

  return {
    ...record,
    crimes: newCrimes,
    total_bounty: record.total_bounty + additionalBounty,
    wanted_by: wantedBy,
  };
}

// ── Bounty operations ──────────────────────────────────────────────────────

/**
 * Pay off bounty for a specific faction.
 * Returns updated record and the gold amount paid.
 */
export function payBounty(
  record: CriminalRecord,
  factionId: FactionId,
): { record: CriminalRecord; gold_paid: number } {
  const factionBounty = record.crimes
    .filter(c => c.faction_id === factionId && c.witnessed && !c.cleared)
    .reduce((sum, c) => sum + c.bounty_value, 0);

  const newCrimes = record.crimes.map(c =>
    c.faction_id === factionId && c.witnessed && !c.cleared ? { ...c, cleared: true } : c,
  );

  const remaining = newCrimes.filter(c => !c.cleared);
  const newBounty = remaining.reduce((sum, c) => sum + c.bounty_value, 0);
  const newWantedBy = record.wanted_by.filter(id => id !== factionId);

  return {
    record: {
      ...record,
      crimes: newCrimes,
      total_bounty: newBounty,
      wanted_by: newWantedBy,
    },
    gold_paid: factionBounty,
  };
}

/**
 * Serve jail time: clears all crimes for the given faction.
 */
export function serveSentence(record: CriminalRecord, factionId: FactionId): CriminalRecord {
  const newCrimes = record.crimes.map(c =>
    c.faction_id === factionId ? { ...c, cleared: true } : c,
  );
  const remaining = newCrimes.filter(c => !c.cleared);
  const newBounty = remaining.reduce((sum, c) => sum + c.bounty_value, 0);
  const newWantedBy = record.wanted_by.filter(id => id !== factionId);

  return { ...record, crimes: newCrimes, total_bounty: newBounty, wanted_by: newWantedBy };
}

// ── Sentence calculation ──────────────────────────────────────────────────

/**
 * Calculate jail sentence in days for outstanding crimes against a faction.
 * Severity 0-100 maps to 0-10 days; murder always ≥ 5 days.
 */
export function calculateSentence(record: CriminalRecord, factionId: FactionId): number {
  const activeCrimes = record.crimes.filter(
    c => c.faction_id === factionId && c.witnessed && !c.cleared,
  );
  if (activeCrimes.length === 0) return 0;

  const totalSeverity = activeCrimes.reduce((sum, c) => sum + c.severity, 0);
  const days = Math.ceil(totalSeverity / 20); // 100 severity = 5 days
  const hasMurder = activeCrimes.some(c => c.type === 'murder');
  return hasMurder ? Math.max(5, days) : days;
}

// ── Guard alert state machine ──────────────────────────────────────────────

/**
 * Escalate guard alert level based on bounty tier and crime severity.
 */
export function escalateGuardAlert(
  guard: GuardState,
  targetBounty: number,
  crimeType: CrimeType | null,
): GuardState {
  let nextLevel: GuardAlertLevel = guard.alert_level;

  if (crimeType !== null) {
    const severity = CRIME_SEVERITY[crimeType];
    if (severity >= 80)       nextLevel = 'arresting';
    else if (severity >= 50)  nextLevel = 'pursuing';
    else if (severity >= 30)  nextLevel = 'alerted';
    else                      nextLevel = 'suspicious';
  }

  // Bounty tier escalation
  if (targetBounty >= 200 && nextLevel !== 'arresting') nextLevel = 'arresting';
  else if (targetBounty >= 80 && nextLevel === 'suspicious') nextLevel = 'alerted';

  return { ...guard, alert_level: nextLevel, last_crime_seen: crimeType };
}

/**
 * Advance guard pursuit stamina during active pursuit.
 * Returns updated guard state; at 0 stamina the guard gives up.
 */
export function tickGuardPursuit(guard: GuardState, targetId: string): GuardState {
  if (guard.alert_level !== 'pursuing''&& guard.alert_level !== 'arresting') return guard;

  const newStamina = Math.max(0, guard.pursuit_stamina - 10);
  const gaveUp = newStamina === 0;

  return {
    ...guard,
    target_id: gaveUp ? null : targetId,
    pursuit_stamina: newStamina,
    alert_level: gaveUp ? 'unaware'': guard.alert_level,
  };
}

/**
 * Reset guard to unaware state (successful escape, time passed).
 */
export function guardStandDown(guard: GuardState): GuardState {
  return {
    ...guard,
    alert_level: 'unaware',
    target_id: null,
    pursuit_stamina: 100,
    last_crime_seen: null,
  };
}

// ── Escape chance ─────────────────────────────────────────────────────────

/**
 * Compute flee/escape success probability (0-1).
 * Based on player athletics skill vs guard pursuit stamina.
 *
 * athleticsSkill: 0-100  (player)
 * guardPursuit:   0-100  (remaining stamina)
 */
export function escapeChance(athleticsSkill: number, guardPursuit: number): number {
  const base = 0.3 + athleticsSkill * 0.005;   / 0.30 – 0.80
  const penalty = guardPursuit * 0.003;          / 0.00 – 0.30
  return Math.max(0.05, Math.min(0.95, base - penalty));
}

// ── Crime history helpers ──────────────────────────────────────────────────

/**
 * Get all active (uncleared, witnessed) crimes for a faction.
 */
export function getActiveCrimes(record: CriminalRecord, factionId: FactionId): CrimeRecord[] {
  return record.crimes.filter(
    c => c.faction_id === factionId && c.witnessed && !c.cleared,
  );
}

/**
 * Is the entity currently wanted by a faction?
 */
export function isWanted(record: CriminalRecord, factionId: FactionId): boolean {
  return record.wanted_by.includes(factionId);
}

/**
 * Total bounty across all factions.
 */
export function totalBounty(record: CriminalRecord): number {
  return record.total_bounty;
}

/**
 * Human-readable wanted status label.
 */
export function wantedLabel(record: CriminalRecord): string {
  if (record.total_bounty === 0) return 'Clean';
  if (record.total_bounty < 50)  return 'Minor Offender';
  if (record.total_bounty < 150) return 'Wanted';
  if (record.total_bounty < 300) return 'Notorious Criminal';
  return 'Most Wanted';
}

/**
 * Human-readable guard alert label.
 */
export function guardAlertLabel(level: GuardAlertLevel): string {
  const labels: Record<GuardAlertLevel, string> = {
    unaware:   'Unaware',
    suspicious: 'Suspicious',
    alerted:   'Alerted',
    pursuing:  'Pursuing',
    arresting: 'Arresting',
  };
  return labels[level];
}
