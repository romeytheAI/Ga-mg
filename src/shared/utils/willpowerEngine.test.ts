import { describe, expect, it } from 'vitest';
import { initialState } from '../../core/state/initialState';
import {
  resolveWillpowerChallenge,
  resolveStressEvent,
  resolveMentalRecovery,
  resolveTraumaEvent,
  resolveControlLoss,
  getWillpowerStatus,
  WillpowerTier,
} from './willpowerEngine';
import { GameState } from '../../core/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeState(overrides: Partial<GameState['player']['stats']> = {}): GameState {
  const state = structuredClone(initialState);
  Object.assign(state.player.stats, overrides);
  return state;
}

const RNG_LOW  = () => 0.01;
const RNG_HIGH = () => 0.99;

// ── resolveWillpowerChallenge ─────────────────────────────────────────────────

describe('resolveWillpowerChallenge', () => {
  it('succeeds when willpower far exceeds difficulty', () => {
    const state = makeState({ willpower: 100, stress: 0, trauma: 0, control: 100, corruption: 0 });
    const result = resolveWillpowerChallenge(state, 10, 'temptation', RNG_LOW);
    expect(result.success).toBe(true);
  });

  it('fails when willpower is near zero against moderate difficulty', () => {
    const state = makeState({ willpower: 1, stress: 90, trauma: 80, control: 5, corruption: 80 });
    const result = resolveWillpowerChallenge(state, 50, 'temptation', RNG_LOW);
    expect(result.success).toBe(false);
  });

  it('adds stress on failure', () => {
    const state = makeState({ willpower: 1, stress: 10, trauma: 80, control: 5, corruption: 80 });
    const result = resolveWillpowerChallenge(state, 80, 'pain', RNG_LOW);
    expect(result.success).toBe(false);
    expect(result.state.player.stats.stress).toBeGreaterThan(10);
  });

  it('does NOT add stress on success', () => {
    const state = makeState({ willpower: 100, stress: 10, trauma: 0, control: 100, corruption: 0 });
    const result = resolveWillpowerChallenge(state, 5, 'corruption', RNG_LOW);
    expect(result.success).toBe(true);
    expect(result.state.player.stats.stress).toBe(10);
  });

  it('returns a string narrative', () => {
    const state = makeState({ willpower: 50, stress: 10, trauma: 0, control: 80, corruption: 0 });
    const result = resolveWillpowerChallenge(state, 20, 'temptation', RNG_LOW);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('uses unknown source without throwing', () => {
    const state = makeState({ willpower: 70, stress: 5, trauma: 0, control: 80, corruption: 0 });
    expect(() =>
      resolveWillpowerChallenge(state, 30, 'unknown_source', RNG_LOW),
    ).not.toThrow();
  });

  it('fortitude is returned and is a number in 0-100', () => {
    const state = makeState({ willpower: 70, stress: 20, trauma: 5, control: 80, corruption: 10 });
    const result = resolveWillpowerChallenge(state, 30, 'pain', RNG_LOW);
    expect(result.fortitude).toBeGreaterThanOrEqual(0);
    expect(result.fortitude).toBeLessThanOrEqual(100);
  });
});

// ── resolveStressEvent ────────────────────────────────────────────────────────

describe('resolveStressEvent', () => {
  it('increases stress stat', () => {
    const state = makeState({ stress: 20, willpower: 70, control: 80 });
    const result = resolveStressEvent(state, 15, 'combat', RNG_LOW);
    expect(result.state.player.stats.stress).toBeGreaterThan(20);
  });

  it('detects breakdown when stress>90 and control<10', () => {
    const state = makeState({ stress: 89, willpower: 3, control: 8 });
    const result = resolveStressEvent(state, 15, 'torture', RNG_LOW);
    expect(result.breakdown).toBe(true);
  });

  it('detects willBroken when willpower<5 and stress>70', () => {
    const state = makeState({ stress: 75, willpower: 3, control: 30 });
    const result = resolveStressEvent(state, 1, 'despair', RNG_LOW);
    expect(result.willBroken).toBe(true);
  });

  it('does not exceed stress cap of 100', () => {
    const state = makeState({ stress: 95, willpower: 10, control: 80 });
    const result = resolveStressEvent(state, 100, 'catastrophe', RNG_LOW);
    expect(result.state.player.stats.stress).toBeLessThanOrEqual(100);
  });

  it('returns narrative string', () => {
    const state = makeState({ stress: 20, willpower: 70, control: 80 });
    const result = resolveStressEvent(state, 5, 'mild_shock', RNG_LOW);
    expect(typeof result.narrative).toBe('string');
  });

  it('willpower mitigates stress gain (high willpower → less stress added)', () => {
    const stateHigh = makeState({ willpower: 100, stress: 10, control: 80 });
    const stateLow  = makeState({ willpower:   1, stress: 10, control: 80 });
    const resultHigh = resolveStressEvent(stateHigh, 20, 'test', RNG_LOW);
    const resultLow  = resolveStressEvent(stateLow,  20, 'test', RNG_LOW);
    expect(resultHigh.state.player.stats.stress).toBeLessThan(resultLow.state.player.stats.stress);
  });
});

// ── resolveMentalRecovery ─────────────────────────────────────────────────────

describe('resolveMentalRecovery', () => {
  it('sleep increases willpower', () => {
    const state = makeState({ willpower: 50, stress: 40, control: 60 });
    const result = resolveMentalRecovery(state, 'sleep', RNG_LOW);
    expect(result.state.player.stats.willpower).toBeGreaterThan(50);
  });

  it('sleep decreases stress', () => {
    const state = makeState({ willpower: 50, stress: 40, control: 60 });
    const result = resolveMentalRecovery(state, 'sleep', RNG_LOW);
    expect(result.state.player.stats.stress).toBeLessThan(40);
  });

  it('substance reduces stress more than prayer', () => {
    const state = makeState({ willpower: 50, stress: 60, control: 60 });
    const sub    = resolveMentalRecovery(state, 'substance',  RNG_LOW);
    const prayer = resolveMentalRecovery(state, 'prayer',     RNG_LOW);
    expect(sub.stressReduced).toBeGreaterThan(prayer.stressReduced);
  });

  it('sleep restores more willpower than substance', () => {
    const state = makeState({ willpower: 50, stress: 20, control: 60 });
    const sleep    = resolveMentalRecovery(state, 'sleep',    RNG_LOW);
    const substance = resolveMentalRecovery(state, 'substance', RNG_LOW);
    expect(sleep.recovered).toBeGreaterThan(substance.recovered);
  });

  it('willpower does not exceed 100', () => {
    const state = makeState({ willpower: 98, stress: 20, control: 80 });
    const result = resolveMentalRecovery(state, 'sleep', RNG_LOW);
    expect(result.state.player.stats.willpower).toBeLessThanOrEqual(100);
  });

  it('stress does not go below 0', () => {
    const state = makeState({ willpower: 50, stress: 5, control: 80 });
    const result = resolveMentalRecovery(state, 'sleep', RNG_LOW);
    expect(result.state.player.stats.stress).toBeGreaterThanOrEqual(0);
  });

  it('all five methods return a string narrative', () => {
    const methods = ['sleep','meditation','prayer','companion','substance'] as const;
    const state = makeState({ willpower: 50, stress: 30, control: 70 });
    for (const method of methods) {
      const result = resolveMentalRecovery(state, method, RNG_LOW);
      expect(typeof result.narrative).toBe('string');
      expect(result.narrative.length).toBeGreaterThan(0);
    }
  });
});

// ── resolveTraumaEvent ────────────────────────────────────────────────────────

describe('resolveTraumaEvent', () => {
  it('increases trauma stat', () => {
    const state = makeState({ trauma: 10, willpower: 70, stress: 20 });
    const result = resolveTraumaEvent(state, 20, RNG_LOW);
    expect(result.state.player.stats.trauma).toBeGreaterThan(10);
  });

  it('also increases stress (secondary effect)', () => {
    const state = makeState({ trauma: 10, willpower: 70, stress: 20 });
    const result = resolveTraumaEvent(state, 20, RNG_LOW);
    expect(result.state.player.stats.stress).toBeGreaterThan(20);
  });

  it('high willpower reduces trauma received', () => {
    const stateHigh = makeState({ willpower: 100, trauma: 10, stress: 10 });
    const stateLow  = makeState({ willpower:   1, trauma: 10, stress: 10 });
    const high = resolveTraumaEvent(stateHigh, 20, RNG_LOW);
    const low  = resolveTraumaEvent(stateLow,  20, RNG_LOW);
    expect(high.state.player.stats.trauma).toBeLessThan(low.state.player.stats.trauma);
  });

  it('trauma does not exceed 100', () => {
    const state = makeState({ trauma: 95, willpower: 1, stress: 80 });
    const result = resolveTraumaEvent(state, 100, RNG_LOW);
    expect(result.state.player.stats.trauma).toBeLessThanOrEqual(100);
  });

  it('returns severity_applied equal to input', () => {
    const state = makeState({ trauma: 10, willpower: 50, stress: 20 });
    const result = resolveTraumaEvent(state, 30, RNG_LOW);
    expect(result.severity_applied).toBe(30);
  });

  it('returns narrative string', () => {
    const state = makeState({ trauma: 5, willpower: 70, stress: 10 });
    const result = resolveTraumaEvent(state, 10, RNG_LOW);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── resolveControlLoss ────────────────────────────────────────────────────────

describe('resolveControlLoss', () => {
  it('reduces control', () => {
    const state = makeState({ control: 80, willpower: 1, stress: 50, corruption: 20, submission: 10 } as any);
    state.player.psych_profile.submission_index = 10;
    const result = resolveControlLoss(state, RNG_LOW);
    expect(result.state.player.stats.control).toBeLessThan(80);
  });

  it('increases submission', () => {
    const state = makeState({ control: 80, willpower: 1, stress: 50, corruption: 20 } as any);
    state.player.psych_profile.submission_index = 10;
    const result = resolveControlLoss(state, RNG_LOW);
    expect(result.state.player.psych_profile.submission_index).toBeGreaterThan(10);
  });

  it('adds corruption consequence when corruption > 40', () => {
    const state = makeState({ control: 80, willpower: 0, stress: 50, corruption: 60 } as any);
    const result = resolveControlLoss(state, RNG_LOW);
    expect(result.state.player.stats.corruption).toBeGreaterThan(60);
    expect(result.consequences.some(c => c.includes('corruption'))).toBe(true);
  });

  it('returns at least one consequence', () => {
    const state = makeState({ control: 80, willpower: 0, stress: 50, corruption: 10 } as any);
    const result = resolveControlLoss(state, RNG_LOW);
    expect(result.consequences.length).toBeGreaterThan(0);
  });

  it('narrative is a non-empty string', () => {
    const state = makeState({ control: 50, willpower: 0, stress: 40, corruption: 10 } as any);
    const result = resolveControlLoss(state, RNG_LOW);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── getWillpowerStatus ────────────────────────────────────────────────────────

describe('getWillpowerStatus', () => {
  it('returns "unshakeable" for very high willpower', () => {
    const state = makeState({ willpower: 90, stress: 5, trauma: 0, control: 90, corruption: 0 });
    expect(getWillpowerStatus(state).tier).toBe<WillpowerTier>('unshakeable');
  });

  it('returns "resolute" for willpower 70, low stress', () => {
    const state = makeState({ willpower: 70, stress: 10, trauma: 5, control: 80, corruption: 5 });
    expect(getWillpowerStatus(state).tier).toBe<WillpowerTier>('resolute');
  });

  it('returns "steady" for willpower 50', () => {
    const state = makeState({ willpower: 50, stress: 20, trauma: 10, control: 60, corruption: 10 });
    expect(getWillpowerStatus(state).tier).toBe<WillpowerTier>('steady');
  });

  it('returns "strained" for willpower 20', () => {
    const state = makeState({ willpower: 20, stress: 30, trauma: 15, control: 50, corruption: 20 });
    expect(getWillpowerStatus(state).tier).toBe<WillpowerTier>('strained');
  });

  it('returns "breaking" for willpower ≤ 10', () => {
    const state = makeState({ willpower: 5, stress: 50, trauma: 30, control: 40, corruption: 20 });
    expect(getWillpowerStatus(state).tier).toBe<WillpowerTier>('breaking');
  });

  it('returns "breaking" when stress>80 and control<20 even with moderate willpower', () => {
    const state = makeState({ willpower: 40, stress: 85, trauma: 10, control: 10, corruption: 10 });
    expect(getWillpowerStatus(state).tier).toBe<WillpowerTier>('breaking');
  });

  it('isWillBroken is true when willpower<5 and stress>70', () => {
    const state = makeState({ willpower: 3, stress: 80, trauma: 20, control: 30, corruption: 10 });
    expect(getWillpowerStatus(state).isWillBroken).toBe(true);
  });

  it('hasBreakdown is true when stress>90 and control<10', () => {
    const state = makeState({ willpower: 2, stress: 95, trauma: 30, control: 5, corruption: 10 });
    expect(getWillpowerStatus(state).hasBreakdown).toBe(true);
  });

  it('decisionQuality is between 0.3 and 1', () => {
    const state = makeState({ willpower: 60, stress: 20, trauma: 10, control: 70, corruption: 10 });
    const { decisionQuality } = getWillpowerStatus(state);
    expect(decisionQuality).toBeGreaterThanOrEqual(0.3);
    expect(decisionQuality).toBeLessThanOrEqual(1.0);
  });

  it('description is a non-empty string', () => {
    const state = makeState({ willpower: 60, stress: 20, trauma: 10, control: 70, corruption: 10 });
    const { description } = getWillpowerStatus(state);
    expect(typeof description).toBe('string');
    expect(description.length).toBeGreaterThan(0);
  });
});
