/**
 * jobEngine.ts — game-layer bridge for the player job / economy system.
 *
 * Sits between EconomySystem (pure sim) and the game reducers. All functions
 * are pure (injectable RNG) and fully testable without DOM or React.
 *
 * @see src/sim/EconomySystem.ts — underlying wage / production engine
 * @see src/reducers/gameReducer.ts — TAKE_JOB, QUIT_JOB, WORK_SHIFT
 */

import { GameState, JobType } from '../types';
import { collectWage } from '../sim/EconomySystem';

// ── Display metadata ──────────────────────────────────────────────────────────

export const JOB_LABELS: Record<JobType, string> = {
  laborer:   'Labourer',
  merchant:  'Merchant',
  guard:     'Town Guard',
  healer:    'Healer\'s Assistant',
  scholar:   'Scholar',
  thief:     'Thief',
  farmer:    'Farm Hand',
  innkeeper: 'Innkeeper\'s Help',
  none:      'Unemployed',
};

export const JOB_DESCRIPTIONS: Record<JobType, string> = {
  laborer:   'Haul lumber, lay stones, and dig ditches. Honest, back-breaking work.',
  merchant:  'Buy low, sell high. Manage stalls and negotiate with customers.',
  guard:     'Patrol the town walls and keep the peace — authority and a measure of danger.',
  healer:    'Mix poultices, tend wounds, and assist the town healer.',
  scholar:   'Transcribe texts and catalogue the library\'s ever-growing collection.',
  thief:     'Lift purses and slip away before anyone notices. High risk, high reward.',
  farmer:    'Tend crops, feed animals, and endure the seasons.',
  innkeeper: 'Serve ale, clean tables, and keep rowdy patrons in line.',
  none:      'No current employment.',
};

// ── Risk levels ───────────────────────────────────────────────────────────────

export type JobRisk = 'safe' | 'moderate' | 'dangerous';

const JOB_RISK: Record<JobType, JobRisk> = {
  laborer:   'safe',
  merchant:  'moderate',
  guard:     'moderate',
  healer:    'safe',
  scholar:   'safe',
  thief:     'dangerous',
  farmer:    'safe',
  innkeeper: 'safe',
  none:      'safe',
};

export function jobRiskLevel(job: JobType): JobRisk {
  return JOB_RISK[job];
}

// ── Skill gains per shift ─────────────────────────────────────────────────────

/** Skills that improve after completing one work shift. Values are 0–5 XP. */
const JOB_SKILL_GAINS: Record<JobType, Partial<GameState['player']['skills']>> = {
  laborer:   { athletics: 3, housekeeping: 1 },
  merchant:  { skulduggery: 1, seduction: 1 },
  guard:     { athletics: 2 },
  healer:    { tending: 4, cooking: 1 },
  scholar:   { school_grades: 3 },
  thief:     { skulduggery: 4, athletics: 1 },
  farmer:    { foraging: 3, tending: 1 },
  innkeeper: { cooking: 2, housekeeping: 2 },
  none:      {},
};

// ── Stat costs per shift ──────────────────────────────────────────────────────

/** Stat changes applied after a work shift (negative = drain). */
const JOB_STAT_COSTS: Record<JobType, Partial<Record<keyof GameState['player']['stats'], number>>> = {
  laborer:   { stamina: -20, stress: 5 },
  merchant:  { stamina: -8, stress: 3 },
  guard:     { stamina: -12, stress: 8 },
  healer:    { stamina: -6, stress: 5 },
  scholar:   { stamina: -4, stress: 2 },
  thief:     { stamina: -10, stress: 15 },
  farmer:    { stamina: -18, stress: 3 },
  innkeeper: { stamina: -10, stress: 6 },
  none:      {},
};

// ── Minimum skill requirements ────────────────────────────────────────────────

const JOB_REQUIREMENTS: Record<JobType, Partial<GameState['player']['skills']>> = {
  laborer:   {},
  merchant:  {},
  guard:     { athletics: 20 },
  healer:    { tending: 15 },
  scholar:   { school_grades: 40 },
  thief:     { skulduggery: 20 },
  farmer:    {},
  innkeeper: { cooking: 10 },
  none:      {},
};

// ── Availability ──────────────────────────────────────────────────────────────

/**
 * Returns all job types the player meets the skill requirements for.
 * 'none' is always included (unemployed option).
 */
export function getAvailableJobs(state: GameState): JobType[] {
  const skills = state.player.skills;
  return (Object.keys(JOB_REQUIREMENTS) as JobType[]).filter(job => {
    if (job === 'none') return true;
    const reqs = JOB_REQUIREMENTS[job];
    return (Object.entries(reqs) as [keyof typeof skills, number][]).every(
      ([skill, min]) => (skills[skill] ?? 0) >= min
    );
  });
}

// ── Work shift resolver ───────────────────────────────────────────────────────

export interface WorkShiftResult {
  gold_earned: number;
  skill_deltas: Partial<GameState['player']['skills']>;
  stat_deltas: Partial<Record<keyof GameState['player']['stats'], number>>;
  narrative: string;
  /** Set when the shift triggers a feat unlock */
  feat_id?: string;
  /** Whether a crime was committed this shift (thief job) */
  crime_committed?: boolean;
}

const SHIFT_NARRATIVES: Record<JobType, string[]> = {
  laborer: [
    "You haul timber until your back aches, earning a few coins for honest work.",
    "Muscles burning, you lay stones in the cold morning air and collect your pay.",
    "Another shift of grueling labour, but the coins feel heavier tonight.",
  ],
  merchant: [
    "You haggle with a wary customer and close the deal just before dusk.",
    "Trade is slow today, but you manage a modest profit through careful negotiation.",
    "You sell off the last of the stock with a smile that hides your exhaustion.",
  ],
  guard: [
    "You walk the walls under grey skies, hand on your blade, eyes scanning the shadows.",
    "A tense patrol — a thief spotted but lost. You return to the barracks for pay.",
    "Nothing happened today, and somehow that feels worse. You pocket your coin.",
  ],
  healer: [
    "You change bandages and grind herbs until your fingers are stained green.",
    "A difficult patient, but they leave healthier. The healer presses coins into your palm.",
    "You work steadily through the queue of the sick and limping.",
  ],
  scholar: [
    "You transcribe a chapter of ancient lore by candlelight.",
    "The ink smears, but the scribe master seems pleased. A coin for your troubles.",
    "Hours of silent copy work, but you learn something in the margins.",
  ],
  thief: [
    "Fingers light as shadow, you relieve a noble of his coin purse.",
    "A risky lift from the market crowd. Your heart hammers as you slip away.",
    "You ghost through the back alleys and come out richer and more nervous.",
  ],
  farmer: [
    "Mud up to your knees, you finish the planting by late afternoon.",
    "The harvest rows are endless, but so are the copper pieces at day's end.",
    "Sun-burned and sore, you trade your sweat for a modest day's wage.",
  ],
  innkeeper: [
    "You haul kegs, wipe tables, and smile through a hundred insults. Worth it.",
    "The evening rush is brutal, but the tips soften the blow.",
    "You keep the peace between two quarrelsome drunks and earn a bonus from the innkeeper.",
  ],
  none: [
    "You spend the day idle.",
  ],
};

/**
 * Resolve a single work shift for the player's current job.
 *
 * @param state - Full game state
 * @param job   - Job to perform (defaults to state.player.player_job)
 * @param rng   - Injectable random function (defaults to Math.random)
 */
export function resolveWorkShift(
  state: GameState,
  job: JobType = state.player.player_job,
  rng: () => number = Math.random,
): WorkShiftResult {
  const baseGold = collectWage(job);

  // Apply a small skill modifier: each 10 points of the primary skill adds +1 gold
  const primarySkillBonus = computeSkillBonus(state.player.skills, job);
  const gold_earned = Math.max(0, baseGold + primarySkillBonus + Math.floor(rng() * 3));

  const skill_deltas = { ...JOB_SKILL_GAINS[job] };
  const stat_deltas = { ...JOB_STAT_COSTS[job] };

  // Pick a random narrative line
  const lines = SHIFT_NARRATIVES[job];
  const narrative = lines[Math.floor(rng() * lines.length)];

  // First-ever gold earned → unlock feat
  const feat_id = state.player.gold === 0 && gold_earned > 0 ? 'feat_first_job' : undefined;

  // Thief always commits a crime
  const crime_committed = job === 'thief';

  return { gold_earned, skill_deltas, stat_deltas, narrative, feat_id, crime_committed };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeSkillBonus(
  skills: GameState['player']['skills'],
  job: JobType,
): number {
  const primary: Partial<Record<JobType, keyof GameState['player']['skills']>> = {
    laborer:   'athletics',
    merchant:  'skulduggery',
    guard:     'athletics',
    healer:    'tending',
    scholar:   'school_grades',
    thief:     'skulduggery',
    farmer:    'foraging',
    innkeeper: 'cooking',
  };
  const key = primary[job];
  if (!key) return 0;
  return Math.floor((skills[key] ?? 0) / 10);
}
