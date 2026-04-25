import { describe, expect, it } from 'vitest';
import { initialState } from '../../core/state/initialState';
import {
  resolveFertilityTick,
  resolveConceptionCheck,
  resolvePregnancyTick,
  resolveBirthEvent,
  resolveLactationTick,
  getPregnancyStatus,
  resolvePregnancyComplication,
  determineOffspringRace,
  computeFertility,
  Trimester,
} from './pregnancyEngine';
import { GameState, Incubation } from '../../core/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeState(
  overrides: Partial<GameState['player']['biology']> = {},
  statsOverrides: Partial<GameState['player']['stats']> = {},
  identityOverrides: Partial<GameState['player']['identity']> = {},
): GameState {
  const state = structuredClone(initialState);
  Object.assign(state.player.biology, overrides);
  Object.assign(state.player.stats, statsOverrides);
  Object.assign(state.player.identity, identityOverrides);
  return state;
}

function makePregnantState(
  daysRemaining: number = 200,
  offspringRace: string = 'Human',
): GameState {
  const state = makeState();
  const inc: Incubation = {
    type:           `pregnancy:partner1:${offspringRace}`,
    progress:       ((270 - daysRemaining) // 270) * 100,
    days_remaining: daysRemaining,
  };
  state.player.biology.incubations = [inc];
  return state;
}

const RNG_ALWAYS_CONCEIVE  = () => 0.001; // always below threshold → conceive
const RNG_NEVER_CONCEIVE   = () => 0.999; // always above threshold → no conception
const RNG_ALWAYS_COMPLICATE = () => 0.001;
const RNG_ALWAYS_RESOLVE    = () => 0.001;
const RNG_NEVER_RESOLVE     = () => 0.999;

// ── determineOffspringRace ────────────────────────────────────────────────────

describe('determineOffspringRace', () => {
  it('human × human = mother race', () => {
    expect(determineOffspringRace('Nord','Imperial')).toBe('Nord');
  });

  it('breton × altmer = mother race (Breton)', () => {
    expect(determineOffspringRace('Breton','Altmer')).toBe('Breton');
  });

  it('altmer × imperial = mother race (Altmer)', () => {
    expect(determineOffspringRace('Altmer','Imperial')).toBe('Altmer');
  });

  it('khajiit mother → khajiit child regardless of father', () => {
    expect(determineOffspringRace('Khajiit','Nord')).toBe('Khajiit');
    expect(determineOffspringRace('Khajiit','Argonian')).toBe('Khajiit');
  });

  it('argonian mother → argonian child regardless of father', () => {
    expect(determineOffspringRace('Argonian','Imperial')).toBe('Argonian');
  });

  it('khajiit father + nord mother = nord child', () => {
    expect(determineOffspringRace('Nord','Khajiit')).toBe('Nord');
  });

  it('argonian father + breton mother = breton child', () => {
    expect(determineOffspringRace('Breton','Argonian')).toBe('Breton');
  });
});

// ── computeFertility ──────────────────────────────────────────────────────────

describe('computeFertility', () => {
  it('peaks on day 14 for humans', () => {
    const day14 = computeFertility(14, 'Nord');
    const day1  = computeFertility(1,  'Nord');
    expect(day14).toBeGreaterThan(day1);
  });

  it('fertility on peak days (12-16) is above 0.5 for humans', () => {
    for (let d = 12; d <= 16; d++) {
      expect(computeFertility(d, 'Imperial')).toBeGreaterThan(0.5);
    }
  });

  it('fertility is lowest on day 1 for humans', () => {
    const day1  = computeFertility(1,  'Breton');
    const day14 = computeFertility(14, 'Breton');
    expect(day1).toBeLessThan(day14);
  });

  it('khajiit peaks around day 14 (full moon)', () => {
    const day14 = computeFertility(14, 'Khajiit');
    const day1  = computeFertility(1,  'Khajiit');
    expect(day14).toBeGreaterThan(day1);
  });

  it('argonian fertility is lower than human at peak', () => {
    const argPeak  = computeFertility(14, 'Argonian');
    const humPeak  = computeFertility(14, 'Nord');
    expect(argPeak).toBeLessThan(humPeak);
  });

  it('fertility is always 0-1', () => {
    for (let d = 1; d <= 28; d++) {
      const f = computeFertility(d, 'Nord');
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(1);
    }
  });
});

// ── resolveFertilityTick ──────────────────────────────────────────────────────

describe('resolveFertilityTick', () => {
  it('increments cycle_day by 1', () => {
    const state = makeState({ cycle_day: 5 });
    const result = resolveFertilityTick(state);
    expect(result.cycle_day).toBe(6);
  });

  it('wraps cycle_day from 28 back to 1', () => {
    const state = makeState({ cycle_day: 28 });
    const result = resolveFertilityTick(state);
    expect(result.cycle_day).toBe(1);
  });

  it('sets heat_rut_active true on day 12', () => {
    const state = makeState({ cycle_day: 11 }); // tick will bring to 12
    const result = resolveFertilityTick(state);
    expect(result.heat_rut_active).toBe(true);
  });

  it('sets heat_rut_active false on day 17', () => {
    const state = makeState({ cycle_day: 16 }); // tick → 17
    const result = resolveFertilityTick(state);
    expect(result.heat_rut_active).toBe(false);
  });

  it('updates fertility in the returned state', () => {
    const state = makeState({ cycle_day: 13 });
    const result = resolveFertilityTick(state);
    expect(result.state.player.biology.fertility).toBeGreaterThan(0.5);
  });

  it('returns a valid fertility_cycle label', () => {
    const state = makeState({ cycle_day: 10 });
    const result = resolveFertilityTick(state);
    expect(['Menstruation','Follicular','Ovulation','Luteal']).toContain(result.fertility_cycle);
  });
});

// ── resolveConceptionCheck ────────────────────────────────────────────────────

describe('resolveConceptionCheck', () => {
  it('conceives when RNG is very low (below threshold)', () => {
    const state = makeState(
      { cycle_day: 14, heat_rut_active: true, fertility: 1.0, sterility: false, incubations: [] },
      {},
    );
    state.ui.settings.enable_pregnancy = true;
    const result = resolveConceptionCheck(state, 'partner1', RNG_ALWAYS_CONCEIVE);
    expect(result.conceived).toBe(true);
  });

  it('does not conceive when RNG is very high (above threshold)', () => {
    const state = makeState(
      { cycle_day: 14, heat_rut_active: true, fertility: 1.0, sterility: false, incubations: [] },
    );
    state.ui.settings.enable_pregnancy = true;
    const result = resolveConceptionCheck(state, 'partner1', RNG_NEVER_CONCEIVE);
    expect(result.conceived).toBe(false);
  });

  it('does not conceive when sterility flag is set', () => {
    const state = makeState({ sterility: true, incubations: [] });
    const result = resolveConceptionCheck(state, 'partner1', RNG_ALWAYS_CONCEIVE);
    expect(result.conceived).toBe(false);
  });

  it('does not conceive when already pregnant', () => {
    const state = makePregnantState();
    state.ui.settings.enable_pregnancy = true;
    const result = resolveConceptionCheck(state, 'partner2', RNG_ALWAYS_CONCEIVE);
    expect(result.conceived).toBe(false);
  });

  it('does not conceive when pregnancy is disabled in settings', () => {
    const state = makeState({ incubations: [], sterility: false });
    state.ui.settings.enable_pregnancy = false;
    const result = resolveConceptionCheck(state, 'partner1', RNG_ALWAYS_CONCEIVE);
    expect(result.conceived).toBe(false);
  });

  it('adds incubation entry on successful conception', () => {
    const state = makeState(
      { cycle_day: 14, heat_rut_active: true, fertility: 1.0, sterility: false, incubations: [] },
    );
    state.ui.settings.enable_pregnancy = true;
    const result = resolveConceptionCheck(state, 'partnerX', RNG_ALWAYS_CONCEIVE);
    expect(result.conceived).toBe(true);
    const incubations = result.state.player.biology.incubations;
    expect(incubations.length).toBe(1);
    expect(incubations[0].type).toContain('pregnancy:partnerX');
  });

  it('heat bonus increases conception chance', () => {
    // Two states: identical except heat_rut_active
    // We test that the threshold with heat is higher (more likely to conceive)
    const withHeat    = makeState({ cycle_day: 14, heat_rut_active: true,  fertility: 0.5, sterility: false, incubations: [] });
    const withoutHeat = makeState({ cycle_day: 14, heat_rut_active: false, fertility: 0.5, sterility: false, incubations: [] });
    withHeat.ui.settings.enable_pregnancy    = true;
    withoutHeat.ui.settings.enable_pregnancy = true;

    // RNG at 0.1 — should conceive with heat but not without (rough test)
    const rng010 = () => 0.10;
    const heatResult    = resolveConceptionCheck(withHeat,    'p', rng010);
    const noHeatResult  = resolveConceptionCheck(withoutHeat, 'p', rng010);
    // heat threshold = 0.15*0.5 + 0.15 = 0.225 > 0.10 → conceive
    // no-heat threshold = 0.15*0.5 = 0.075 < 0.10 → no conceive
    expect(heatResult.conceived).toBe(true);
    expect(noHeatResult.conceived).toBe(false);
  });
});

// ── resolvePregnancyTick ──────────────────────────────────────────────────────

describe('resolvePregnancyTick', () => {
  it('returns null trimester when not pregnant', () => {
    const state = makeState({ incubations: [] });
    const result = resolvePregnancyTick(state);
    expect(result.trimester).toBeNull();
  });

  it('decrements days_remaining by 1', () => {
    const state = makePregnantState(200);
    const result = resolvePregnancyTick(state);
    expect(result.days_remaining).toBe(199);
  });

  it('returns trimester 1 in early pregnancy', () => {
    const state = makePregnantState(269); // day 1 of pregnancy
    const result = resolvePregnancyTick(state);
    expect(result.trimester).toBe<Trimester>(1);
  });

  it('returns trimester 2 at day 90', () => {
    const state = makePregnantState(270 - 90); // day 90
    const result = resolvePregnancyTick(state);
    expect(result.trimester).toBe<Trimester>(2);
  });

  it('returns trimester 3 at day 180', () => {
    const state = makePregnantState(270 - 180); // day 180
    const result = resolvePregnancyTick(state);
    expect(result.trimester).toBe<Trimester>(3);
  });

  it('T1 reduces stamina', () => {
    const state = makePregnantState(265);
    state.player.stats.stamina = 80;
    const result = resolvePregnancyTick(state);
    expect(result.state.player.stats.stamina).toBeLessThan(80);
  });

  it('T3 applies pain increase', () => {
    const state = makePregnantState(80); // day 190 = T3
    state.player.stats.pain = 10;
    const result = resolvePregnancyTick(state);
    expect(result.state.player.stats.pain).toBeGreaterThan(10);
  });
});

// ── resolveBirthEvent ─────────────────────────────────────────────────────────

describe('resolveBirthEvent', () => {
  it('returns success:false when not pregnant', () => {
    const state = makeState({ incubations: [] });
    const result = resolveBirthEvent(state, RNG_NEVER_CONCEIVE);
    expect(result.success).toBe(false);
  });

  it('returns success:true and removes pregnancy incubation', () => {
    const state = makePregnantState(5);
    const result = resolveBirthEvent(state, RNG_NEVER_COMPLICATE);
    expect(result.success).toBe(true);
    const remaining = result.state.player.biology.incubations.filter(i =>
      i.type.startsWith('pregnancy:'),
    );
    expect(remaining).toHaveLength(0);
  });

  it('returns the correct offspring race', () => {
    const state = makePregnantState(5, 'Nord');
    const result = resolveBirthEvent(state, RNG_NEVER_COMPLICATE);
    expect(result.offspring_race).toBe('Nord');
  });

  it('starts lactation after birth', () => {
    const state = makePregnantState(5);
    state.player.biology.lactation_level = 0;
    const result = resolveBirthEvent(state, RNG_NEVER_COMPLICATE);
    expect(result.state.player.biology.lactation_level).toBeGreaterThan(0);
  });

  it('sets post_partum_debuff after birth', () => {
    const state = makePregnantState(5);
    const result = resolveBirthEvent(state, RNG_NEVER_COMPLICATE);
    expect(result.state.player.biology.post_partum_debuff).toBe(30);
  });

  it('reduces stamina and health', () => {
    const state = makePregnantState(5);
    state.player.stats.stamina = 80;
    state.player.stats.health  = 80;
    const result = resolveBirthEvent(state, RNG_NEVER_COMPLICATE);
    expect(result.state.player.stats.stamina).toBeLessThan(80);
    expect(result.state.player.stats.health).toBeLessThan(80);
  });

  it('may include complications at low health + high stress', () => {
    const state = makePregnantState(5);
    state.player.stats.health = 10;
    state.player.stats.stress = 80;
    const result = resolveBirthEvent(state, RNG_ALWAYS_COMPLICATE);
    expect(result.complications.length).toBeGreaterThan(0);
  });

  it('returns a narrative string', () => {
    const state = makePregnantState(5);
    const result = resolveBirthEvent(state, RNG_NEVER_COMPLICATE);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── resolveLactationTick ──────────────────────────────────────────────────────

describe('resolveLactationTick', () => {
  it('returns 0 and null narrative when lactation is 0', () => {
    const state = makeState({ lactation_level: 0, post_partum_debuff: 0 });
    const result = resolveLactationTick(state);
    expect(result.lactation_level).toBe(0);
    expect(result.narrative).toBeNull();
  });

  it('increases lactation in early post-partum (debuff > 23)', () => {
    const state = makeState({ lactation_level: 20, post_partum_debuff: 28 });
    const result = resolveLactationTick(state);
    expect(result.lactation_level).toBeGreaterThan(20);
  });

  it('lactation declines when post_partum_debuff is 0', () => {
    const state = makeState({ lactation_level: 50, post_partum_debuff: 0 });
    const result = resolveLactationTick(state);
    expect(result.lactation_level).toBeLessThan(50);
  });

  it('lactation never exceeds 100', () => {
    const state = makeState({ lactation_level: 99, post_partum_debuff: 28 });
    const result = resolveLactationTick(state);
    expect(result.lactation_level).toBeLessThanOrEqual(100);
  });

  it('lactation never goes below 0', () => {
    const state = makeState({ lactation_level: 1, post_partum_debuff: 0 });
    const result = resolveLactationTick(state);
    expect(result.lactation_level).toBeGreaterThanOrEqual(0);
  });

  it('post_partum_debuff decrements each tick', () => {
    const state = makeState({ lactation_level: 50, post_partum_debuff: 10 });
    const result = resolveLactationTick(state);
    expect(result.state.player.biology.post_partum_debuff).toBe(9);
  });
});

// ── getPregnancyStatus ────────────────────────────────────────────────────────

describe('getPregnancyStatus', () => {
  it('returns pregnant:false when not pregnant', () => {
    const state = makeState({ incubations: [] });
    expect(getPregnancyStatus(state).pregnant).toBe(false);
  });

  it('returns pregnant:true when pregnancy incubation present', () => {
    const state = makePregnantState(200);
    expect(getPregnancyStatus(state).pregnant).toBe(true);
  });

  it('returns correct trimester', () => {
    const state = makePregnantState(270 - 120); // day 120 → T2
    const status = getPregnancyStatus(state);
    expect(status.trimester).toBe<Trimester>(2);
  });

  it('due_day is world.day + days_remaining', () => {
    const state = makePregnantState(100);
    state.world.day = 50;
    const status = getPregnancyStatus(state);
    expect(status.due_day).toBe(150);
  });

  it('offspring_race matches the incubation type', () => {
    const state = makePregnantState(100, 'Khajiit');
    const status = getPregnancyStatus(state);
    expect(status.offspring_race).toBe('Khajiit');
  });

  it('days_elapsed + days_remaining = PREGNANCY_TOTAL_DAYS', () => {
    const state = makePregnantState(180);
    const status = getPregnancyStatus(state);
    expect(status.days_elapsed + (status.days_remaining ?? 0)).toBe(270);
  });
});

// ── resolvePregnancyComplication ──────────────────────────────────────────────

describe('resolvePregnancyComplication', () => {
  it('morning_sickness reduces stamina', () => {
    const state = makeState({}, { stamina: 80 });
    state.player.biology.incubations = [{
      type: 'pregnancy:p1:Human', progress: 10, days_remaining: 240,
    }];
    const result = resolvePregnancyComplication(state, 'morning_sickness', RNG_ALWAYS_RESOLVE);
    expect(result.state.player.stats.stamina).toBeLessThan(80);
  });

  it('daedric_influence increases corruption', () => {
    const state = makeState({}, { corruption: 30 });
    const result = resolvePregnancyComplication(state, 'daedric_influence', RNG_ALWAYS_RESOLVE);
    expect(result.state.player.stats.corruption).toBeGreaterThan(30);
  });

  it('unresolved complication has extra health/stress penalties', () => {
    const state = makeState({}, { health: 70, stress: 20 });
    const resolved   = resolvePregnancyComplication(state, 'premature_labor', RNG_ALWAYS_RESOLVE);
    const unresolved = resolvePregnancyComplication(state, 'premature_labor', RNG_NEVER_RESOLVE);
    // Unresolved imposes bigger penalty on health/stress
    expect(unresolved.state.player.stats.health).toBeLessThanOrEqual(resolved.state.player.stats.health);
  });

  it('twin_discovery always resolves (chance 1.0)', () => {
    const state = makeState({}, { stress: 20, stamina: 80 });
    const result = resolvePregnancyComplication(state, 'twin_discovery', RNG_NEVER_RESOLVE);
    expect(result.resolved).toBe(true);
  });

  it('returns a non-empty narrative', () => {
    const state = makeState({}, { stress: 20, stamina: 80 });
    const result = resolvePregnancyComplication(state, 'exhaustion_crisis', RNG_ALWAYS_RESOLVE);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('stat values do not go below 0', () => {
    const state = makeState({}, { stamina: 2, health: 2, stress: 0 });
    const result = resolvePregnancyComplication(state, 'exhaustion_crisis', RNG_NEVER_RESOLVE);
    expect(result.state.player.stats.stamina).toBeGreaterThanOrEqual(0);
    expect(result.state.player.stats.health).toBeGreaterThanOrEqual(0);
  });

  it('all complication types work without throwing', () => {
    const types: Array<Parameters<typeof resolvePregnancyComplication>[1]> = [
      'morning_sickness','premature_labor','exhaustion_crisis',
      'daedric_influence','miscarriage_risk','twin_discovery',
    ];
    const state = makeState({}, { stamina: 80, health: 80, stress: 20, corruption: 20 });
    for (const type of types) {
      expect(() => resolvePregnancyComplication(state, type, RNG_ALWAYS_RESOLVE)).not.toThrow();
    }
  });
});

// ── Missing helper alias (used in birth test) ─────────────────────────────────
const RNG_NEVER_COMPLICATE = () => 0.999;
