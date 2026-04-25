import { describe, expect, it } from 'vitest';
import { initialState } from '../../core/state/initialState';
import {
  resolveCorruptionGain,
  resolvePurificationAttempt,
  resolveCorruptionMilestone,
  resolveCorruptionVision,
  getCorruptionEffects,
  resolveSubmissionEvent,
  getCorruptionTier,
  CorruptionTier,
} from './corruptionEngine';
import { GameState } from '../../core/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeState(overrides: Partial<GameState['player']['stats']> = {}): GameState {
  const state = structuredClone(initialState);
  Object.assign(state.player.stats, overrides);
  return state;
}

const RNG_LOW  = () => 0.01;
const RNG_HIGH = () => 0.99;

// ── getCorruptionTier ─────────────────────────────────────────────────────────

describe('getCorruptionTier', () => {
  it('returns "pure" for 0', () => {
    expect(getCorruptionTier(0)).toBe<CorruptionTier>('pure');
  });

  it('returns "pure" for 19', () => {
    expect(getCorruptionTier(19)).toBe<CorruptionTier>('pure');
  });

  it('returns "tainted" for 20', () => {
    expect(getCorruptionTier(20)).toBe<CorruptionTier>('tainted');
  });

  it('returns "tainted" for 39', () => {
    expect(getCorruptionTier(39)).toBe<CorruptionTier>('tainted');
  });

  it('returns "corrupted" for 40', () => {
    expect(getCorruptionTier(40)).toBe<CorruptionTier>('corrupted');
  });

  it('returns "fallen" for 60', () => {
    expect(getCorruptionTier(60)).toBe<CorruptionTier>('fallen');
  });

  it('returns "abyssal" for 80', () => {
    expect(getCorruptionTier(80)).toBe<CorruptionTier>('abyssal');
  });

  it('returns "abyssal" for 100', () => {
    expect(getCorruptionTier(100)).toBe<CorruptionTier>('abyssal');
  });
});

// ── resolveCorruptionGain ─────────────────────────────────────────────────────

describe('resolveCorruptionGain', () => {
  it('increases corruption stat', () => {
    const state = makeState({ corruption: 10, purity: 100 });
    const result = resolveCorruptionGain(state, 10, 'daedric_contact', RNG_LOW);
    expect(result.state.player.stats.corruption).toBeGreaterThan(10);
  });

  it('corruption_gained is positive', () => {
    const state = makeState({ corruption: 10, purity: 100 });
    const result = resolveCorruptionGain(state, 10, 'dark_ritual', RNG_LOW);
    expect(result.corruption_gained).toBeGreaterThan(0);
  });

  it('purity reduces corruption gain', () => {
    const stateHighPurity = makeState({ corruption: 10, purity: 100 });
    const stateLowPurity  = makeState({ corruption: 10, purity: 0   });
    const highResult = resolveCorruptionGain(stateHighPurity, 10, 'default', RNG_LOW);
    const lowResult  = resolveCorruptionGain(stateLowPurity,  10, 'default', RNG_LOW);
    expect(highResult.corruption_gained).toBeLessThan(lowResult.corruption_gained);
  });

  it('triggers milestone when crossing a tier boundary', () => {
    // corruption at 18 → gains enough to cross into 'tainted'
    const state = makeState({ corruption: 18, purity: 0 });
    const result = resolveCorruptionGain(state, 10, 'daedric_contact', RNG_LOW);
    expect(result.milestone_triggered).toBe(true);
  });

  it('does NOT trigger milestone when staying within same tier', () => {
    const state = makeState({ corruption: 5, purity: 100 });
    const result = resolveCorruptionGain(state, 2, 'default', RNG_LOW);
    expect(result.milestone_triggered).toBe(false);
  });

  it('corruption does not exceed 100', () => {
    const state = makeState({ corruption: 95, purity: 0 });
    const result = resolveCorruptionGain(state, 50, 'daedric_contact', RNG_LOW);
    expect(result.state.player.stats.corruption).toBeLessThanOrEqual(100);
  });

  it('returns correct new_tier', () => {
    const state = makeState({ corruption: 45, purity: 0 });
    const result = resolveCorruptionGain(state, 20, 'dark_ritual', RNG_LOW);
    expect(result.new_tier).toBe<CorruptionTier>('fallen');
  });

  it('returns a non-empty narrative', () => {
    const state = makeState({ corruption: 10, purity: 80 });
    const result = resolveCorruptionGain(state, 5, 'substance_abuse', RNG_LOW);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('unknown source uses default narrative without throwing', () => {
    const state = makeState({ corruption: 10, purity: 80 });
    expect(() =>
      resolveCorruptionGain(state, 5, 'unknown_source', RNG_LOW),
    ).not.toThrow();
  });
});

// ── resolvePurificationAttempt ────────────────────────────────────────────────

describe('resolvePurificationAttempt', () => {
  it('divine_blessing reduces corruption', () => {
    const state = makeState({ corruption: 30, purity: 50, willpower: 70 });
    const result = resolvePurificationAttempt(state, 'divine_blessing', RNG_LOW);
    expect(result.state.player.stats.corruption).toBeLessThan(30);
  });

  it('divine_blessing is the most powerful purification method', () => {
    const state = makeState({ corruption: 30, purity: 50, willpower: 70 });
    const divine     = resolvePurificationAttempt(state, 'divine_blessing', RNG_LOW);
    const pilgrimage = resolvePurificationAttempt(state, 'pilgrimage',      RNG_LOW);
    const temple     = resolvePurificationAttempt(state, 'temple',          RNG_LOW);
    const will       = resolvePurificationAttempt(state, 'willpower',       RNG_LOW);
    expect(divine.corruption_reduced).toBeGreaterThan(pilgrimage.corruption_reduced);
    expect(pilgrimage.corruption_reduced).toBeGreaterThan(temple.corruption_reduced);
    expect(temple.corruption_reduced).toBeGreaterThan(will.corruption_reduced);
  });

  it('willpower method scales with willpower stat', () => {
    const stateHigh = makeState({ corruption: 30, purity: 50, willpower: 100 });
    const stateLow  = makeState({ corruption: 30, purity: 50, willpower: 10  });
    const high = resolvePurificationAttempt(stateHigh, 'willpower', RNG_LOW);
    const low  = resolvePurificationAttempt(stateLow,  'willpower', RNG_LOW);
    expect(high.corruption_reduced).toBeGreaterThan(low.corruption_reduced);
  });

  it('high corruption (>60) resists purification', () => {
    const stateHigh = makeState({ corruption: 70, purity: 20, willpower: 70 });
    const stateLow  = makeState({ corruption: 30, purity: 60, willpower: 70 });
    const high = resolvePurificationAttempt(stateHigh, 'temple', RNG_LOW);
    const low  = resolvePurificationAttempt(stateLow,  'temple', RNG_LOW);
    expect(high.corruption_reduced).toBeLessThan(low.corruption_reduced);
  });

  it('corruption does not go below 0', () => {
    const state = makeState({ corruption: 2, purity: 80, willpower: 90 });
    const result = resolvePurificationAttempt(state, 'divine_blessing', RNG_LOW);
    expect(result.state.player.stats.corruption).toBeGreaterThanOrEqual(0);
  });

  it('returns success:true when meaningful reduction occurs', () => {
    const state = makeState({ corruption: 30, purity: 60, willpower: 80 });
    const result = resolvePurificationAttempt(state, 'divine_blessing', RNG_LOW);
    expect(result.success).toBe(true);
  });

  it('returns a narrative string', () => {
    const state = makeState({ corruption: 30, purity: 60, willpower: 70 });
    const result = resolvePurificationAttempt(state, 'pilgrimage', RNG_LOW);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── resolveCorruptionMilestone ────────────────────────────────────────────────

describe('resolveCorruptionMilestone', () => {
  it('pure tier has no powers or penalties', () => {
    const state = makeState({ corruption: 5 });
    const result = resolveCorruptionMilestone(state);
    expect(result.tier).toBe<CorruptionTier>('pure');
    expect(result.powers_unlocked).toHaveLength(0);
    expect(result.penalties).toHaveLength(0);
  });

  it('abyssal tier has the most powers and penalties', () => {
    const statePure    = makeState({ corruption: 5  });
    const stateAbyssal = makeState({ corruption: 90 });
    const pure    = resolveCorruptionMilestone(statePure);
    const abyssal = resolveCorruptionMilestone(stateAbyssal);
    expect(abyssal.powers_unlocked.length).toBeGreaterThan(pure.powers_unlocked.length);
    expect(abyssal.penalties.length).toBeGreaterThan(pure.penalties.length);
  });

  it('milestone returns correct tier for 40 corruption', () => {
    const state = makeState({ corruption: 40 });
    const result = resolveCorruptionMilestone(state);
    expect(result.tier).toBe<CorruptionTier>('corrupted');
  });

  it('narrative is a non-empty string', () => {
    const state = makeState({ corruption: 60 });
    const result = resolveCorruptionMilestone(state);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('does not mutate state', () => {
    const state = makeState({ corruption: 60 });
    const before = state.player.stats.corruption;
    resolveCorruptionMilestone(state);
    expect(state.player.stats.corruption).toBe(before);
  });
});

// ── resolveCorruptionVision ───────────────────────────────────────────────────

describe('resolveCorruptionVision', () => {
  it('returns a non-empty vision string', () => {
    const state = makeState({ corruption: 50, hallucination: 0, stress: 20 });
    const result = resolveCorruptionVision(state, RNG_LOW);
    expect(typeof result.vision).toBe('string');
    expect(result.vision.length).toBeGreaterThan(0);
  });

  it('returns a prince name', () => {
    const state = makeState({ corruption: 50, hallucination: 0, stress: 20 });
    const result = resolveCorruptionVision(state, RNG_LOW);
    expect(typeof result.prince).toBe('string');
    expect(result.prince.length).toBeGreaterThan(0);
  });

  it('increases hallucination at high corruption (>=60)', () => {
    const state = makeState({ corruption: 80, hallucination: 0, stress: 20, willpower: 60 });
    const result = resolveCorruptionVision(state, RNG_LOW);
    expect(result.state.player.stats.hallucination).toBeGreaterThan(0);
  });

  it('always increases stress', () => {
    const state = makeState({ corruption: 30, hallucination: 0, stress: 20, willpower: 60 });
    const result = resolveCorruptionVision(state, RNG_LOW);
    expect(result.state.player.stats.stress).toBeGreaterThanOrEqual(20);
  });

  it('Molag Bal appears at abyssal corruption', () => {
    // With low rng (0.01) and abyssal corruption, Molag Bal should be selected
    const state = makeState({ corruption: 90, hallucination: 0, stress: 10, willpower: 60 });
    const result = resolveCorruptionVision(state, RNG_LOW);
    // Molag Bal is first in the list for >=80 corruption, rng 0.01 → index 0
    expect(result.prince).toBe('Molag Bal');
  });
});

// ── getCorruptionEffects ──────────────────────────────────────────────────────

describe('getCorruptionEffects', () => {
  it('pure tier has no dark powers', () => {
    const state = makeState({ corruption: 0 });
    const effects = getCorruptionEffects(state);
    expect(effects.dark_powers).toHaveLength(0);
  });

  it('abyssal tier has dark powers', () => {
    const state = makeState({ corruption: 90 });
    const effects = getCorruptionEffects(state);
    expect(effects.dark_powers.length).toBeGreaterThan(0);
  });

  it('higher tiers have more appearance changes', () => {
    const statePure    = makeState({ corruption: 5  });
    const stateAbyssal = makeState({ corruption: 90 });
    const pure    = getCorruptionEffects(statePure);
    const abyssal = getCorruptionEffects(stateAbyssal);
    expect(abyssal.appearance_changes.length).toBeGreaterThan(pure.appearance_changes.length);
  });

  it('returns correct tier in result', () => {
    const state = makeState({ corruption: 65 });
    const effects = getCorruptionEffects(state);
    expect(effects.tier).toBe<CorruptionTier>('fallen');
  });

  it('does not throw for any valid corruption value', () => {
    for (const val of [0, 19, 20, 39, 40, 59, 60, 79, 80, 100]) {
      const state = makeState({ corruption: val });
      expect(() => getCorruptionEffects(state)).not.toThrow();
    }
  });
});

// ── resolveSubmissionEvent ────────────────────────────────────────────────────

describe('resolveSubmissionEvent', () => {
  it('increases submission stat', () => {
    const state = makeState({ willpower: 50, control: 70 });
    state.player.psych_profile.submission_index = 10;
    const result = resolveSubmissionEvent(state, 'Molag Bal', 20, RNG_LOW);
    expect(result.state.player.psych_profile.submission_index).toBeGreaterThan(10);
  });

  it('reduces control', () => {
    const state = makeState({ willpower: 50, control: 70 });
    state.player.psych_profile.submission_index = 10;
    const result = resolveSubmissionEvent(state, 'Harkon', 20, RNG_LOW);
    expect(result.state.player.stats.control).toBeLessThan(70);
  });

  it('high willpower reduces submission gain', () => {
    const stateHigh = makeState({ willpower: 100, control: 70 });
    const stateLow  = makeState({ willpower:   1, control: 70 });
    stateHigh.player.psych_profile.submission_index = 10;
    stateLow.player.psych_profile.submission_index  = 10;
    const high = resolveSubmissionEvent(stateHigh, 'enemy', 20, RNG_LOW);
    const low  = resolveSubmissionEvent(stateLow,  'enemy', 20, RNG_LOW);
    expect(high.submission_gained).toBeLessThan(low.submission_gained);
  });

  it('submission does not exceed 100', () => {
    const state = makeState({ willpower: 1, control: 70 });
    state.player.psych_profile.submission_index = 95;
    const result = resolveSubmissionEvent(state, 'overlord', 100, RNG_LOW);
    expect(result.state.player.psych_profile.submission_index).toBeLessThanOrEqual(100);
  });

  it('returns a non-empty narrative', () => {
    const state = makeState({ willpower: 50, control: 70 });
    const result = resolveSubmissionEvent(state, 'guard', 10, RNG_LOW);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('zero intensity produces no submission gain', () => {
    const state = makeState({ willpower: 50, control: 70 });
    state.player.psych_profile.submission_index = 10;
    const result = resolveSubmissionEvent(state, 'nobody', 0, RNG_LOW);
    expect(result.submission_gained).toBe(0);
  });
});
