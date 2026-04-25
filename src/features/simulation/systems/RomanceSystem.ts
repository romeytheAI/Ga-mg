/**
 * RomanceSystem — DoL-style romance, attraction, courtship, and intimacy.
 * Romance progresses through stages: attracted → flirting → courting → dating → committed.
 * Attraction is influenced by traits, familiarity, and seduction skill.
 * Pure functions; no side effects, no UI imports.
 */
import { RomanceState, RomanceStage, Relationship, SimNpc, NpcTrait } from './types';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Create a default (no romance) state. */
export function defaultRomanceState(): RomanceState {
  return {
    stage: 'none',
    attraction: 0,
    intimacy: 0,
    passion: 0,
    jealousy: 0,
    compatibility: 50,
    dates_count: 0,
    rejection_count: 0,
    last_date_turn: 0,
  };
}

// ── Trait compatibility ──────────────────────────────────────────────────────

/** Pairs of traits that increase compatibility. */
const COMPATIBLE_PAIRS: [NpcTrait, NpcTrait][] = [
  ['brave','loyal'],
  ['generous','loyal'],
  ['flirtatious','flirtatious'],
  ['curious','brave'],
  ['passive','aggressive'],   / opposites attract
  ['reserved','flirtatious'], / opposites attract
];

/** Pairs of traits that decrease compatibility. */
const INCOMPATIBLE_PAIRS: [NpcTrait, NpcTrait][] = [
  ['greedy','generous'],
  ['treacherous','loyal'],
  ['paranoid','flirtatious'],
  ['aggressive','aggressive'], / too much conflict
  ['cowardly','brave'],
];

/**
 * Calculate trait-based compatibility between two NPCs (0-100).
 */
export function calculateCompatibility(traitsA: NpcTrait[], traitsB: NpcTrait[]): number {
  let score = 50; // neutral baseline

  for (const [a, b] of COMPATIBLE_PAIRS) {
    if (
      (traitsA.includes(a) && traitsB.includes(b)) ||
      (traitsA.includes(b) && traitsB.includes(a))
    ) {
      score += 10;
    }
  }

  for (const [a, b] of INCOMPATIBLE_PAIRS) {
    if (
      (traitsA.includes(a) && traitsB.includes(b)) ||
      (traitsA.includes(b) && traitsB.includes(a))
    ) {
      score -= 12;
    }
  }

  return clamp(score, 0, 100);
}

// ── Attraction ─────────────────────────────────────────────────────────────

/**
 * Calculate initial attraction between two NPCs.
 * Based on compatibility, seduction skill, and relationship warmth.
 */
export function calculateAttraction(
  npcA: SimNpc,
  npcB: SimNpc,
  rel: Relationship
): number {
  let attraction = 0;

  // Compatibility contributes baseline attraction
  const compat = calculateCompatibility(npcA.traits, npcB.traits);
  attraction += compat * 0.3;

  // Familiarity breeds attraction (up to a point)
  attraction += Math.min(rel.familiarity, 60) * 0.2;

  // Affection feeds attraction
  if (rel.affection > 0) {
    attraction += rel.affection * 0.15;
  }

  // Seduction skill of initiator
  attraction += npcA.skills.seduction * 0.1;

  // Flirtatious trait boosts attraction
  if (npcA.traits.includes('flirtatious')) attraction += 8;
  if (npcB.traits.includes('flirtatious')) attraction += 5;

  // Reserved trait dampens attraction
  if (npcB.traits.includes('reserved')) attraction -= 10;

  // Fear suppresses attraction
  attraction -= rel.fear * 0.3;

  return clamp(attraction, 0, 100);
}

// ── Romance progression ──────────────────────────────────────────────────────

/** Thresholds for stage transitions. */
const STAGE_THRESHOLDS: Record<RomanceStage, { attraction: number; intimacy: number; familiarity: number }> = {
  none: { attraction: 0, intimacy: 0, familiarity: 0 },
  attracted: { attraction: 20, intimacy: 0, familiarity: 10 },
  flirting: { attraction: 35, intimacy: 10, familiarity: 20 },
  courting: { attraction: 50, intimacy: 25, familiarity: 35 },
  dating: { attraction: 55, intimacy: 40, familiarity: 50 },
  committed: { attraction: 60, intimacy: 65, familiarity: 70 },
  rejected: { attraction: 0, intimacy: 0, familiarity: 0 },
  broken_up: { attraction: 0, intimacy: 0, familiarity: 0 },
};

/**
 * Evaluate if a romance should progress to the next stage.
 * Returns updated romance state with potential stage change.
 */
export function evaluateRomanceProgression(
  romance: RomanceState,
  rel: Relationship
): RomanceState {
  if (romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return romance;
  }

  const stages: RomanceStage[] = ['none','attracted','flirting','courting','dating','committed'];
  const currentIdx = stages.indexOf(romance.stage);
  if (currentIdx < 0 || currentIdx >= stages.length - 1) return romance;

  const nextStage = stages[currentIdx + 1];
  const threshold = STAGE_THRESHOLDS[nextStage];

  if (
    romance.attraction >= threshold.attraction &&
    romance.intimacy >= threshold.intimacy &&
    rel.familiarity >= threshold.familiarity
  ) {
    return { ...romance, stage: nextStage };
  }

  return romance;
}

/**
 * Apply a romantic interaction between two NPCs.
 * Increases intimacy, passion, and potentially advances the romance.
 */
export function applyRomanticInteraction(
  romance: RomanceState,
  rel: Relationship,
  outcome: 'positive''| 'negative''| 'neutral',
  turn: number
): { romance: RomanceState; rel: Relationship } {
  let r = { ...romance };
  let updatedRel = { ...rel };

  if (outcome === 'positive') {
    r.intimacy = clamp(r.intimacy + 5, 0, 100);
    r.passion = clamp(r.passion + 3, 0, 100);
    r.attraction = clamp(r.attraction + 2, 0, 100);
    r.dates_count += 1;
    r.last_date_turn = turn;

    updatedRel.affection = clamp(updatedRel.affection + 5, -100, 100);
    updatedRel.trust = clamp(updatedRel.trust + 3, -100, 100);
  } else if (outcome === 'negative') {
    r.passion = clamp(r.passion - 5, 0, 100);
    r.intimacy = clamp(r.intimacy - 3, 0, 100);
    r.jealousy = clamp(r.jealousy + 5, 0, 100);
    r.rejection_count += 1;

    updatedRel.affection = clamp(updatedRel.affection - 3, -100, 100);
    updatedRel.trust = clamp(updatedRel.trust - 5, -100, 100);

    // Too many rejections → rejected stage
    if (r.rejection_count >= 3) {
      r.stage = 'rejected';
    }
  } else {
    r.intimacy = clamp(r.intimacy + 1, 0, 100);
    r.last_date_turn = turn;
  }

  // Check for stage progression
  r = evaluateRomanceProgression(r, updatedRel);

  updatedRel.romance = r;
  return { romance: r, rel: updatedRel };
}

// ── Passive romance tick ─────────────────────────────────────────────────────

/**
 * Passive romance effects per tick. Passion decays without interaction,
 * jealousy grows if neglected, intimacy decays slightly.
 */
export function tickRomance(romance: RomanceState, rel: Relationship, currentTurn: number): RomanceState {
  if (romance.stage === 'none''|| romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return romance;
  }

  let r = { ...romance };
  const turnsSinceDate = currentTurn - r.last_date_turn;

  // Passion decays without interaction
  if (turnsSinceDate > 10) {
    r.passion = clamp(r.passion - 0.3, 0, 100);
  }

  // Intimacy decays very slowly without interaction
  if (turnsSinceDate > 20) {
    r.intimacy = clamp(r.intimacy - 0.1, 0, 100);
  }

  // Jealousy grows if neglected for too long (in dating+ stages)
  if ((r.stage === 'dating''|| r.stage === 'committed') && turnsSinceDate > 30) {
    r.jealousy = clamp(r.jealousy + 0.2, 0, 100);
  }

  // Break up if relationship deteriorates
  if (r.stage === 'committed''|| r.stage === 'dating') {
    if (rel.affection < -20 || rel.trust < -30 || r.jealousy > 90) {
      r.stage = 'broken_up';
      r.passion = clamp(r.passion - 20, 0, 100);
    }
  }

  return r;
}

// ── Romance-driven behavior ──────────────────────────────────────────────────

/**
 * Check if an NPC would seek a romantic interaction this tick.
 * Based on romance stage, passion, and time since last date.
 */
export function wantsRomanticInteraction(romance: RomanceState, currentTurn: number): boolean {
  if (romance.stage === 'none''|| romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return false;
  }

  const turnsSinceDate = currentTurn - romance.last_date_turn;

  // Higher passion = more frequent desire for interaction
  const desireThreshold = 100 - romance.passion;
  return turnsSinceDate > Math.max(5, desireThreshold / 5);
}

/**
 * Calculate the "romance score" for utility AI: how much the NPC
 * values spending time with a romantic interest.
 */
export function romanceUtilityScore(romance: RomanceState, rel: Relationship): number {
  if (!romance || romance.stage === 'none''|| romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return 0;
  }

  let score = 0;
  score += romance.passion * 0.3;
  score += romance.attraction * 0.2;
  score += romance.intimacy * 0.1;
  score += Math.max(0, rel.affection) * 0.1;

  // Dating/committed NPCs value romance more
  if (romance.stage === 'dating') score *= 1.3;
  if (romance.stage === 'committed') score *= 1.5;

  return clamp(score, 0, 100);
}

/** Get a label describing the romance stage. */
export function romanceStageLabel(stage: RomanceStage): string {
  switch (stage) {
    case 'none': return 'No Interest';
    case 'attracted': return 'Attracted';
    case 'flirting': return 'Flirting';
    case 'courting': return 'Courting';
    case 'dating': return 'Dating';
    case 'committed': return 'Committed';
    case 'rejected': return 'Rejected';
    case 'broken_up': return 'Broken Up';
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
