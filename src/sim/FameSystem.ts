/**
 * FameSystem — DoL-style reputation/fame tracking.
 * Multiple fame types affect NPC behavior and encounter frequency.
 * Fame slowly decays over time (people forget).
 * Pure functions; no side effects, no UI imports.
 */
import { FameRecord, FameType, SimNpc, NpcTrait } from './types';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Create a default fame record for a new NPC. */
export function defaultFame(): FameRecord {
  return {
    social: 0,
    crime: 0,
    wealth_fame: 0,
    combat_fame: 0,
    infamy: 0,
  };
}

// ── Fame gain from activities ──────────────────────────────────────────────

const ACTIVITY_FAME_MAP: Partial<Record<string, Partial<FameRecord>>> = {
  trading: { social: 0.3, wealth_fame: 0.5 },
  working: { social: 0.2 },
  socializing: { social: 0.5 },
  hostile: { combat_fame: 1.0, infamy: 0.5 },
  fleeing: { infamy: 0.2 },
};

// ── Job fame modifiers ──────────────────────────────────────────────────────

const JOB_FAME_MAP: Record<string, Partial<FameRecord>> = {
  guard: { combat_fame: 0.3, social: 0.2 },
  thief: { crime: 0.5, infamy: 0.3 },
  merchant: { wealth_fame: 0.4, social: 0.3 },
  innkeeper: { social: 0.5 },
  healer: { social: 0.4 },
  scholar: { social: 0.3 },
  laborer: { social: 0.1 },
  farmer: { social: 0.1 },
  none: {},
};

// ── Fame decay ──────────────────────────────────────────────────────────────
const FAME_DECAY_PER_DAY = 0.3; // fame points lost per day

/**
 * Apply passive fame decay. Called once per day transition.
 * Fame drifts toward zero as people forget.
 */
export function decayFame(fame: FameRecord): FameRecord {
  return {
    social: Math.max(0, fame.social - FAME_DECAY_PER_DAY),
    crime: Math.max(0, fame.crime - FAME_DECAY_PER_DAY * 0.5), // crime decays slower
    wealth_fame: Math.max(0, fame.wealth_fame - FAME_DECAY_PER_DAY * 0.7),
    combat_fame: Math.max(0, fame.combat_fame - FAME_DECAY_PER_DAY * 0.6),
    infamy: Math.max(0, fame.infamy - FAME_DECAY_PER_DAY * 0.4), // infamy decays slowest
  };
}

/**
 * Gain fame from an activity during a tick.
 * Modified by traits and current job.
 */
export function gainFameFromActivity(
  npc: SimNpc,
  activity: string,
  hours: number
): FameRecord {
  let fame = { ...npc.fame };

  // Activity-based fame
  const activityFame = ACTIVITY_FAME_MAP[activity];
  if (activityFame) {
    for (const [key, val] of Object.entries(activityFame) as [FameType, number][]) {
      fame[key] = clamp(fame[key] + val * hours, 0, 100);
    }
  }

  // Job-based passive fame (when working)
  if (activity === 'working') {
    const jobFame = JOB_FAME_MAP[npc.job];
    if (jobFame) {
      for (const [key, val] of Object.entries(jobFame) as [FameType, number][]) {
        fame[key] = clamp(fame[key] + val * hours * 0.5, 0, 100);
      }
    }
  }

  // Trait modifiers
  for (const trait of npc.traits) {
    if (trait === 'aggressive') {
      fame.combat_fame = clamp(fame.combat_fame + 0.1 * hours, 0, 100);
      fame.infamy = clamp(fame.infamy + 0.1 * hours, 0, 100);
    }
    if (trait === 'generous') {
      fame.social = clamp(fame.social + 0.15 * hours, 0, 100);
    }
    if (trait === 'greedy') {
      fame.wealth_fame = clamp(fame.wealth_fame + 0.1 * hours, 0, 100);
    }
    if (trait === 'flirtatious') {
      fame.social = clamp(fame.social + 0.1 * hours, 0, 100);
    }
  }

  return fame;
}

/** Add fame of a specific type directly. */
export function addFame(fame: FameRecord, type: FameType, amount: number): FameRecord {
  return { ...fame, [type]: clamp(fame[type] + amount, 0, 100) };
}

/** Get total fame (sum of all positive fame types). */
export function totalFame(fame: FameRecord): number {
  return fame.social + fame.wealth_fame + fame.combat_fame;
}

/** Get total notoriety (crime + infamy). */
export function totalNotoriety(fame: FameRecord): number {
  return fame.crime + fame.infamy;
}

/** Get a label describing NPC fame level. */
export function fameLabel(fame: FameRecord): string {
  const total = totalFame(fame);
  if (total >= 200) return 'Legendary';
  if (total >= 120) return 'Famous';
  if (total >= 60) return 'Well-Known';
  if (total >= 20) return 'Recognized';
  return 'Unknown';
}

/** Get a label describing NPC notoriety. */
export function notorietyLabel(fame: FameRecord): string {
  const total = totalNotoriety(fame);
  if (total >= 150) return 'Most Wanted';
  if (total >= 100) return 'Notorious';
  if (total >= 50) return 'Suspect';
  if (total >= 15) return 'Shady';
  return 'Clean';
}

// ── Helpers ────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
