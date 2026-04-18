/**
 * fameEngine.ts — game-layer bridge for the player fame / prestige system.
 *
 * Sits between FameSystem (pure sim) and the game reducers. All functions
 * are pure (no DOM or React imports) and fully testable.
 *
 * @see src/sim/FameSystem.ts — underlying fame decay / gain engine
 * @see src/reducers/gameReducer.ts — GAIN_FAME, ADVANCE_TIME
 */

import { GameState, PlayerFameRecord } from '../types';
import { addFame, decayFame, fameLabel, notorietyLabel, totalFame, totalNotoriety } from '../sim/FameSystem';
import { FameType } from '../sim/types';
import { JobType } from '../types';

// ── Job-based passive fame per work shift ────────────────────────────────────

const JOB_SHIFT_FAME: Partial<Record<JobType, Partial<PlayerFameRecord>>> = {
  guard:     { combat_fame: 0.8, social: 0.4 },
  thief:     { crime: 1.2,       infamy: 0.6 },
  merchant:  { wealth_fame: 1.0, social: 0.5 },
  innkeeper: { social: 1.2 },
  healer:    { social: 0.9 },
  scholar:   { social: 0.5 },
  laborer:   { social: 0.2 },
  farmer:    { social: 0.2 },
  none:      {},
};

// ── Fame gain narratives ─────────────────────────────────────────────────────

const FAME_GAIN_NARRATIVES: Record<FameType, string[]> = {
  social:      [
    'Word of your deeds spreads through the hold.',
    'People nod in recognition as you pass.',
    'Your reputation among the locals grows.',
  ],
  crime:       [
    'Whispers follow you through the market.',
    'A guardsman glances your way with narrowed eyes.',
    'Your criminal record circulates on wanted posters.',
  ],
  wealth_fame: [
    'Your merchant dealings attract attention.',
    'Traders speak of your shrewd business acumen.',
    'Your name carries weight in coin-counting circles.',
  ],
  combat_fame: [
    'Travellers exchange tales of your fighting prowess.',
    'Your name is spoken with respect at the forge.',
    'Veterans raise a cup in your honour.',
  ],
  infamy:      [
    'A dark reputation clings to you like smoke.',
    'People step aside as you approach.',
    'Infamy precedes you into every room.',
  ],
};

// ── Core functions ────────────────────────────────────────────────────────────

function toSimFameRecord(fame: PlayerFameRecord) {
  return { ...fame };
}

function fromSimFameRecord(sim: PlayerFameRecord): PlayerFameRecord {
  return {
    social:      clamp(sim.social, 0, 100),
    crime:       clamp(sim.crime, 0, 100),
    wealth_fame: clamp(sim.wealth_fame, 0, 100),
    combat_fame: clamp(sim.combat_fame, 0, 100),
    infamy:      clamp(sim.infamy, 0, 100),
  };
}

/**
 * Increase player fame of a specific type.
 * Returns the updated fame record and a narrative snippet.
 */
export function resolveGainFame(
  state: GameState,
  fameType: FameType,
  amount: number,
  rng: () => number = Math.random
): { fame_record: PlayerFameRecord; narrative: string } {
  const simFame = toSimFameRecord(state.player.fame_record);
  const updated = addFame(simFame, fameType, amount);
  const lines = FAME_GAIN_NARRATIVES[fameType];
  const narrative = lines[Math.floor(rng() * lines.length)];
  return { fame_record: fromSimFameRecord(updated), narrative };
}

/**
 * Apply per-shift fame boost for the player's current job.
 * Returns updated fame record.
 */
export function applyJobShiftFame(state: GameState): PlayerFameRecord {
  const job = state.player.player_job;
  const bonus = JOB_SHIFT_FAME[job] ?? {};
  let fame = { ...state.player.fame_record };
  for (const [key, val] of Object.entries(bonus) as [FameType, number][]) {
    fame[key] = clamp(fame[key] + val, 0, 100);
  }
  return fame;
}

/**
 * Apply daily fame decay (called on ADVANCE_TIME day transitions).
 * Returns updated fame record.
 */
export function tickPlayerFame(state: GameState, days: number): PlayerFameRecord {
  let simFame = toSimFameRecord(state.player.fame_record);
  for (let i = 0; i < days; i++) {
    simFame = decayFame(simFame);
  }
  return fromSimFameRecord(simFame);
}

/** Returns the player's job-based per-shift fame bonus (for display in UI). */
export function getJobFameBonus(job: JobType): Partial<PlayerFameRecord> {
  return JOB_SHIFT_FAME[job] ?? {};
}

// ── Summary / UI helpers ─────────────────────────────────────────────────────

export interface FameSummary {
  social: number;
  crime: number;
  wealth_fame: number;
  combat_fame: number;
  infamy: number;
  total_fame: number;
  total_notoriety: number;
  fame_label: string;
  notoriety_label: string;
}

/** Structured summary for StatsModal display. */
export function fameSummary(fame: PlayerFameRecord): FameSummary {
  const sim = toSimFameRecord(fame);
  return {
    social:           fame.social,
    crime:            fame.crime,
    wealth_fame:      fame.wealth_fame,
    combat_fame:      fame.combat_fame,
    infamy:           fame.infamy,
    total_fame:       totalFame(sim),
    total_notoriety:  totalNotoriety(sim),
    fame_label:       fameLabel(sim),
    notoriety_label:  notorietyLabel(sim),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
