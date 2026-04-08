/**
 * pregnancyEngine.ts — standalone fertility, pregnancy, birth, and lactation engine.
 *
 * Operates entirely on GameState.player.biology and GameState.player.stats.
 * No dependency on a sim system file — built from scratch to match Elder Scrolls lore.
 *
 * ── Fertility mechanics ──────────────────────────────────────────────────────
 * Standard 28-day cycle:
 *   Days 1–4    Menstruation    (fertility low, ~0.05)
 *   Days 5–11   Follicular      (fertility building, ~0.1–0.4)
 *   Days 12–16  Ovulation       (peak fertility, ~0.6–1.0)
 *   Days 17–28  Luteal          (declining fertility, ~0.05–0.5)
 *
 * Khajiit: fertility tied to lunar cycle (peaks at full moon, ~day 14).
 * Argonians: egg-layers; lower baseline fertility, modified by Hist presence.
 * heat_rut_active: true during peak fertility days (12–16).
 *
 * ── Pregnancy mechanics ──────────────────────────────────────────────────────
 * Stored as Incubation entries:  type = 'pregnancy:partnerId:offspringRace'
 * Total gestation: 270 days (9 months)
 *   Trimester 1: days 1–89
 *   Trimester 2: days 90–179
 *   Trimester 3: days 180–270
 *
 * ── Elder Scrolls hybrid rules ───────────────────────────────────────────────
 * Human × Human  → mother's race
 * Human × Elf    → mother's race (TES lore: Man/Mer mix = Man)
 * Elf × Elf      → mother's race
 * Khajiit mother → Khajiit child
 * Argonian mother → Argonian child
 * Beast-father × non-beast mother → mother's race
 */

import { GameState, Incubation } from '../types';

// ── Constants ─────────────────────────────────────────────────────────────────

const PREGNANCY_PREFIX        = 'pregnancy:';
const PREGNANCY_TOTAL_DAYS    = 270;
const CYCLE_LENGTH            = 28;
const PEAK_FERTILITY_START    = 12;
const PEAK_FERTILITY_END      = 16;
const BASE_CONCEPTION_CHANCE  = 0.15; // 15% per encounter at peak fertility

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

type RaceCategory = 'human' | 'elf' | 'khajiit' | 'argonian' | 'orc' | 'other';

function getRaceCategory(race: string): RaceCategory {
  const lower = race.toLowerCase();
  if (['imperial', 'nord', 'breton', 'redguard'].includes(lower)) return 'human';
  if (['altmer', 'bosmer', 'dunmer', 'falmer'].includes(lower)) return 'elf';
  if (lower === 'orc' || lower === 'orsimer') return 'orc';
  if (lower === 'khajiit') return 'khajiit';
  if (lower === 'argonian') return 'argonian';
  return 'other';
}

/**
 * Determine the offspring's race from parent races, following TES lore.
 *
 * Rules:
 *   - Khajiit mother     → Khajiit
 *   - Argonian mother    → Argonian
 *   - Beast father, non-beast mother → mother's race
 *   - Human or Elf cross → mother's race (Mer + Man = Man in TES)
 */
export function determineOffspringRace(motherRace: string, fatherRace: string): string {
  const motherCat = getRaceCategory(motherRace);
  const fatherCat = getRaceCategory(fatherRace);

  // Beastfolk mother → beastfolk child (dominant genetics)
  if (motherCat === 'khajiit') return 'Khajiit';
  if (motherCat === 'argonian') return 'Argonian';

  // Beast father + non-beast mother → mother's race
  if (fatherCat === 'khajiit' || fatherCat === 'argonian') return motherRace;

  // All other combinations (human×human, human×elf, elf×elf, orc×any)
  // TES lore: offspring follows mother's race
  return motherRace;
}

/**
 * Compute fertility value (0–1) for a given cycle day and race.
 */
export function computeFertility(cycleDay: number, race: string): number {
  const cat = getRaceCategory(race);

  if (cat === 'khajiit') {
    // Khajiit: peaks at full moon (day 14 of 28-day cycle)
    const lunarDay = ((cycleDay - 1) % CYCLE_LENGTH) + 1;
    const distFromFull = Math.abs(lunarDay - 14);
    return clamp(1.0 - distFromFull * 0.07, 0.05, 1.0);
  }

  if (cat === 'argonian') {
    // Argonians: egg-layers, lower fertility, modest peak
    const inPeak = cycleDay >= PEAK_FERTILITY_START && cycleDay <= PEAK_FERTILITY_END;
    return inPeak ? 0.4 : 0.1;
  }

  // Standard humanoid fertility curve
  if (cycleDay >= PEAK_FERTILITY_START && cycleDay <= PEAK_FERTILITY_END) {
    const distFromPeak = Math.abs(cycleDay - 14);
    return clamp(1.0 - distFromPeak * 0.15, 0.6, 1.0);
  }
  if (cycleDay < PEAK_FERTILITY_START) {
    return clamp((cycleDay / PEAK_FERTILITY_START) * 0.4, 0.05, 0.4);
  }
  // Post-peak decline
  const daysAfterPeak = cycleDay - PEAK_FERTILITY_END;
  return clamp(0.5 - daysAfterPeak * 0.05, 0.05, 0.5);
}

function getFertilityCycleLabel(cycleDay: number): string {
  if (cycleDay <= 4) return 'Menstruation';
  if (cycleDay <= 11) return 'Follicular';
  if (cycleDay <= 16) return 'Ovulation';
  return 'Luteal';
}

function findPregnancy(state: GameState): Incubation | null {
  return state.player.biology.incubations.find(i =>
    i.type.startsWith(PREGNANCY_PREFIX),
  ) ?? null;
}

function parsePregnancyType(type: string): { partnerId: string; offspringRace: string } {
  const parts = type.split(':');
  return {
    partnerId:    parts[1] ?? 'unknown',
    offspringRace: parts[2] ?? 'Human',
  };
}

function getTrimester(daysElapsed: number): Trimester {
  if (daysElapsed < 90) return 1;
  if (daysElapsed < 180) return 2;
  return 3;
}

// ── Public Types ──────────────────────────────────────────────────────────────

export type Trimester = 1 | 2 | 3;

export type PregnancyComplicationType =
  | 'morning_sickness'
  | 'premature_labor'
  | 'exhaustion_crisis'
  | 'daedric_influence'
  | 'miscarriage_risk'
  | 'twin_discovery';

export interface FertilityTickResult {
  cycle_day:       number;
  heat_rut_active: boolean;
  fertility:       number;
  fertility_cycle: string;
  state: GameState;
}

export interface ConceptionCheckResult {
  conceived:      boolean;
  partner_id:     string;
  offspring_race: string;
  narrative:      string;
  state: GameState;
}

export interface PregnancyTickResult {
  trimester:     Trimester | null;
  days_remaining: number | null;
  stat_effects:  Partial<Record<string, number>>;
  narrative:     string | null;
  state: GameState;
}

export interface BirthEventResult {
  success:        boolean;
  offspring_race: string;
  complications:  string[];
  narrative:      string;
  state: GameState;
}

export interface LactationTickResult {
  lactation_level: number;
  narrative:       string | null;
  state: GameState;
}

export interface PregnancyStatus {
  pregnant:        boolean;
  trimester:       Trimester | null;
  days_elapsed:    number;
  days_remaining:  number | null;
  due_day:         number | null;
  offspring_race:  string | null;
  complications:   string[];
  fertility:       number;
  fertility_cycle: string;
  cycle_day:       number;
  heat_rut_active: boolean;
  lactation_level: number;
}

export interface PregnancyComplicationResult {
  complication: PregnancyComplicationType;
  resolved:     boolean;
  stat_effects: Partial<Record<string, number>>;
  narrative:    string;
  state: GameState;
}

// ── Engine Functions ──────────────────────────────────────────────────────────

/**
 * Advance the fertility cycle by one day.
 *
 * Increments cycle_day (wraps at 28), recomputes fertility and cycle label,
 * and toggles heat_rut_active for peak days (12–16).
 *
 * @param state Full game state.
 */
export function resolveFertilityTick(state: GameState): FertilityTickResult {
  const bio  = state.player.biology;
  const race = state.player.identity.race;

  const cycleDay       = (bio.cycle_day % CYCLE_LENGTH) + 1;
  const fertility      = computeFertility(cycleDay, race);
  const fertilityCycle = getFertilityCycleLabel(cycleDay);
  const heat_rut_active = cycleDay >= PEAK_FERTILITY_START && cycleDay <= PEAK_FERTILITY_END;

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      biology: {
        ...bio,
        cycle_day:       cycleDay,
        fertility,
        fertility_cycle: fertilityCycle,
        heat_rut_active,
      },
    },
  };

  return { cycle_day: cycleDay, heat_rut_active, fertility, fertility_cycle: fertilityCycle, state: nextState };
}

/**
 * Check whether conception occurs after a sexual encounter.
 *
 * Factors:
 *   - Current fertility (from cycle day + race)
 *   - heat_rut_active bonus (+15%)
 *   - sterility flag (auto-fail)
 *   - existing pregnancy (auto-fail)
 *   - pregnancy enabled setting
 *
 * @param state     Full game state.
 * @param partnerId Identifier of the partner (stored in incubation type string).
 * @param rng       Injectable random source.
 */
export function resolveConceptionCheck(
  state: GameState,
  partnerId: string,
  rng: () => number = Math.random,
): ConceptionCheckResult {
  const bio  = state.player.biology;
  const race = state.player.identity.race;

  const alreadyPregnant = findPregnancy(state) !== null;

  if (bio.sterility || alreadyPregnant || !state.ui.settings.enable_pregnancy) {
    return {
      conceived:      false,
      partner_id:     partnerId,
      offspring_race: '',
      narrative: alreadyPregnant
        ? "You are already carrying a child."
        : bio.sterility
          ? "Your body cannot conceive."
          : "Pregnancy is currently not possible.",
      state,
    };
  }

  const heatBonus       = bio.heat_rut_active ? 0.15 : 0;
  const conceptionChance = clamp(
    BASE_CONCEPTION_CHANCE * bio.fertility + heatBonus,
    0,
    0.85,
  );

  if (rng() >= conceptionChance) {
    return {
      conceived:      false,
      partner_id:     partnerId,
      offspring_race: '',
      narrative: "Nothing takes root.",
      state,
    };
  }

  // Offspring race via TES lore rules (partner race assumed 'Human' when unknown)
  const offspringRace   = determineOffspringRace(race, 'Human');
  const pregnancyType   = `${PREGNANCY_PREFIX}${partnerId}:${offspringRace}`;
  const newIncubation: Incubation = {
    type:           pregnancyType,
    progress:       0,
    days_remaining: PREGNANCY_TOTAL_DAYS,
  };

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      biology: {
        ...bio,
        incubations:     [...bio.incubations, newIncubation],
        heat_rut_active: false, // heat ends at conception
      },
    },
  };

  return {
    conceived:      true,
    partner_id:     partnerId,
    offspring_race: offspringRace,
    narrative:      `A spark of life takes hold within you. You carry a ${offspringRace} child.`,
    state:          nextState,
  };
}

/**
 * Advance pregnancy by one day. Applies trimester-based stat effects.
 *
 * Trimester effects:
 *   T1 — stamina -2/day, stress +1/day, weekly nausea narrative
 *   T2 — stamina -3/day, health +1/day (second trimester relief), quickening at day 90
 *   T3 — stamina -8/day, pain +2/day, stress +2/day, biweekly labor-approach narrative
 *
 * @param state Full game state.
 */
export function resolvePregnancyTick(state: GameState): PregnancyTickResult {
  const pregnancy = findPregnancy(state);
  if (!pregnancy) {
    return { trimester: null, days_remaining: null, stat_effects: {}, narrative: null, state };
  }

  const daysElapsed     = PREGNANCY_TOTAL_DAYS - pregnancy.days_remaining + 1;
  const newDaysRemaining = pregnancy.days_remaining - 1;
  const trimester        = getTrimester(daysElapsed);

  const stat_effects: Partial<Record<string, number>> = {};
  let narrative: string | null = null;

  if (trimester === 1) {
    stat_effects['stamina'] = -2;
    stat_effects['stress']  = 1;
    if (daysElapsed % 7 === 0) {
      narrative = "A wave of nausea washes over you. Morning sickness is relentless.";
    }
  } else if (trimester === 2) {
    stat_effects['stamina'] = -3;
    stat_effects['health']  = 1; // second trimester bloom
    if (daysElapsed === 90) {
      narrative = "You feel the first flutter of movement. Something alive stirs inside you.";
    }
  } else {
    stat_effects['stamina'] = -8;
    stat_effects['pain']    = 2;
    stat_effects['stress']  = 2;
    if (daysElapsed % 14 === 0) {
      narrative = "The weight is immense. Every step is an effort. The birth approaches.";
    }
  }

  // Update incubation progress
  const updatedIncubations = state.player.biology.incubations.map(i =>
    i.type === pregnancy.type
      ? {
          ...i,
          days_remaining: newDaysRemaining,
          progress: clamp((daysElapsed / PREGNANCY_TOTAL_DAYS) * 100, 0, 100),
        }
      : i,
  );

  // Apply stat effects to player stats
  const updatedStats = { ...state.player.stats };
  for (const [key, delta] of Object.entries(stat_effects)) {
    if (Object.prototype.hasOwnProperty.call(updatedStats, key)) {
      (updatedStats as Record<string, number>)[key] = clamp(
        ((updatedStats as Record<string, number>)[key] ?? 0) + delta,
        0,
        100,
      );
    }
  }

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      stats: updatedStats,
      biology: {
        ...state.player.biology,
        incubations: updatedIncubations,
      },
    },
  };

  return { trimester, days_remaining: newDaysRemaining, stat_effects, narrative, state: nextState };
}

/**
 * Resolve a birth event.
 *
 * Removes the pregnancy incubation, resets the fertility cycle,
 * sets post_partum_debuff (30 days), and starts lactation (level 20).
 * Complication chance is derived from health and stress stats.
 *
 * @param state Full game state.
 * @param rng   Injectable random source.
 */
export function resolveBirthEvent(
  state: GameState,
  rng: () => number = Math.random,
): BirthEventResult {
  const pregnancy = findPregnancy(state);
  if (!pregnancy) {
    return {
      success:        false,
      offspring_race: '',
      complications:  ['No active pregnancy'],
      narrative:      "There is no pregnancy to resolve.",
      state,
    };
  }

  const { offspringRace } = parsePregnancyType(pregnancy.type);
  const complications: string[] = [];

  // Complication chance based on health and stress
  const health = state.player.stats.health;
  const stress = state.player.stats.stress;
  const complicationChance = clamp(
    (100 - health) * 0.005 + stress * 0.003,
    0.02,
    0.25,
  );

  if (rng() < complicationChance) {
    complications.push('Difficult labor — extended recovery required');
  }
  if (state.player.stats.corruption > 60 && rng() < 0.2) {
    complications.push('Daedric taint detected in child');
  }

  const removedIncubations = state.player.biology.incubations.filter(
    i => i.type !== pregnancy.type,
  );

  const narrativeParts: string[] = [
    `After hours of labor, you bring a ${offspringRace} child into the world.`,
    "The child is small, and loud, and undeniably alive. You have never been so exhausted.",
    complications.length > 0
      ? `The birth was not without difficulty. ${complications.join('; ')}.`
      : "The birth goes as well as such things can.",
  ];

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      stats: {
        ...state.player.stats,
        stamina: clamp(state.player.stats.stamina - 30, 0, 100),
        health:  clamp(state.player.stats.health  - 15, 1, 100),
        stress:  clamp(state.player.stats.stress  + 10, 0, 100),
      },
      biology: {
        ...state.player.biology,
        incubations:      removedIncubations,
        post_partum_debuff: 30,
        lactation_level:  20,
        heat_rut_active:  false,
        cycle_day:        1,   // cycle resets after birth
        fertility_cycle:  'Menstruation',
        fertility:        0.05,
      },
    },
  };

  return {
    success:        true,
    offspring_race: offspringRace,
    complications,
    narrative:      narrativeParts.join(' '),
    state:          nextState,
  };
}

/**
 * Advance lactation by one day.
 *
 * Phases:
 *   post_partum_debuff > 23  — early peak: lactation rises +2/day (max 100)
 *   post_partum_debuff 1–23  — post-partum window: mild decline -0.5/day
 *   post_partum_debuff = 0   — gradual decline -1.5/day until dry
 *
 * @param state Full game state.
 */
export function resolveLactationTick(state: GameState): LactationTickResult {
  const bio = state.player.biology;
  let { lactation_level, post_partum_debuff } = bio;

  if (lactation_level <= 0) {
    return { lactation_level: 0, narrative: null, state };
  }

  let narrative: string | null = null;

  if (post_partum_debuff > 23) {
    // Early post-partum: milk comes in fully
    lactation_level = clamp(lactation_level + 2, 0, 100);
  } else if (post_partum_debuff > 0) {
    // Window phase: stable mild decline
    lactation_level = clamp(lactation_level - 0.5, 0, 100);
  } else {
    // Gradual drying
    lactation_level = clamp(lactation_level - 1.5, 0, 100);
    if (lactation_level < 5 && lactation_level > 0) {
      narrative = "Your milk is drying up. Lactation is nearly at an end.";
    }
    if (lactation_level <= 0) {
      narrative = "Lactation has ended.";
      lactation_level = 0;
    }
  }

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      biology: {
        ...bio,
        lactation_level,
        post_partum_debuff: clamp(post_partum_debuff - 1, 0, 30),
      },
    },
  };

  return { lactation_level, narrative, state: nextState };
}

/**
 * Return a comprehensive summary of the current pregnancy and fertility state.
 *
 * Does not modify state — purely informational.
 *
 * @param state Full game state.
 */
export function getPregnancyStatus(state: GameState): PregnancyStatus {
  const bio      = state.player.biology;
  const pregnancy = findPregnancy(state);

  if (!pregnancy) {
    return {
      pregnant:        false,
      trimester:       null,
      days_elapsed:    0,
      days_remaining:  null,
      due_day:         null,
      offspring_race:  null,
      complications:   [],
      fertility:       bio.fertility,
      fertility_cycle: bio.fertility_cycle,
      cycle_day:       bio.cycle_day,
      heat_rut_active: bio.heat_rut_active,
      lactation_level: bio.lactation_level,
    };
  }

  const daysElapsed = PREGNANCY_TOTAL_DAYS - pregnancy.days_remaining;
  const trimester   = getTrimester(daysElapsed);
  const { offspringRace } = parsePregnancyType(pregnancy.type);

  return {
    pregnant:        true,
    trimester,
    days_elapsed:    daysElapsed,
    days_remaining:  pregnancy.days_remaining,
    due_day:         state.world.day + pregnancy.days_remaining,
    offspring_race:  offspringRace,
    complications:   [],
    fertility:       bio.fertility,
    fertility_cycle: bio.fertility_cycle,
    cycle_day:       bio.cycle_day,
    heat_rut_active: bio.heat_rut_active,
    lactation_level: bio.lactation_level,
  };
}

/**
 * Resolve a specific pregnancy complication.
 *
 * Each complication has a resolve_chance: if resolved the base stat effects apply;
 * if unresolved, extra health and stress penalties are added.
 *
 * @param state            Full game state.
 * @param complicationType Which complication to resolve.
 * @param rng              Injectable random source.
 */
export function resolvePregnancyComplication(
  state: GameState,
  complicationType: PregnancyComplicationType,
  rng: () => number = Math.random,
): PregnancyComplicationResult {
  type ComplicationConfig = {
    stat_effects: Partial<Record<string, number>>;
    narrative: string;
    resolve_chance: number;
  };

  const CONFIGS: Record<PregnancyComplicationType, ComplicationConfig> = {
    morning_sickness: {
      stat_effects:  { stamina: -5, stress: 3 },
      narrative:     "The nausea is overwhelming. You spend the morning hunched and miserable.",
      resolve_chance: 0.8,
    },
    premature_labor: {
      stat_effects:  { pain: 20, stamina: -20, health: -10 },
      narrative:     "Contractions begin too early. You need rest and care — now.",
      resolve_chance: 0.5,
    },
    exhaustion_crisis: {
      stat_effects:  { stamina: -25, willpower: -10, stress: 10 },
      narrative:     "The pregnancy has drained you to your limits. You can barely stand.",
      resolve_chance: 0.7,
    },
    daedric_influence: {
      stat_effects:  { corruption: 5, stress: 15, hallucination: 5 },
      narrative:     "Something dark stirs within you — not the child, but something else that rides with it. Daedric influence.",
      resolve_chance: 0.3,
    },
    miscarriage_risk: {
      stat_effects:  { pain: 10, stress: 20, health: -5 },
      narrative:     "Sharp cramps. Something may be wrong. You need rest immediately.",
      resolve_chance: 0.6,
    },
    twin_discovery: {
      stat_effects:  { stress: 5, stamina: -5 },
      narrative:     "Two heartbeats. You are carrying twins. Everything becomes twice as complicated.",
      resolve_chance: 1.0,
    },
  };

  const config = CONFIGS[complicationType];
  const resolved = rng() < config.resolve_chance;

  // Unresolved complications impose extra penalties
  const statEffects: Partial<Record<string, number>> = resolved
    ? { ...config.stat_effects }
    : {
        ...config.stat_effects,
        health: (config.stat_effects['health'] ?? 0) - 5,
        stress: (config.stat_effects['stress'] ?? 0) + 5,
      };

  // Apply stat effects to player stats
  const updatedStats = { ...state.player.stats };
  for (const [key, delta] of Object.entries(statEffects)) {
    if (Object.prototype.hasOwnProperty.call(updatedStats, key)) {
      (updatedStats as Record<string, number>)[key] = clamp(
        ((updatedStats as Record<string, number>)[key] ?? 0) + (delta ?? 0),
        0,
        100,
      );
    }
  }

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      stats: updatedStats,
    },
  };

  return {
    complication: complicationType,
    resolved,
    stat_effects: statEffects,
    narrative:    config.narrative,
    state:        nextState,
  };
}
