import { describe, it, expect } from 'vitest';
import { computePlayerAllure, getEncounterModifier, getSocialAllureBonus, allureSummary } from './allureEngine';
import { initialState } from '../state/initialState';
import { GameState } from '../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeState(overrides: Partial<GameState['player']['stats']> = {}): GameState {
  return {
    ...initialState,
    player: {
      ...initialState.player,
      stats: { ...initialState.player.stats, ...overrides },
    },
  };
}

function stateWithFame(fame: Partial<GameState['player']['fame_record']>): GameState {
  return {
    ...initialState,
    player: {
      ...initialState.player,
      fame_record: { ...initialState.player.fame_record, ...fame },
    },
  };
}

// ── computePlayerAllure ───────────────────────────────────────────────────────

describe('computePlayerAllure', () => {
  it('returns PlayerAllureState with all fields', () => {
    const result = computePlayerAllure(initialState);
    expect(typeof result.base_allure).toBe('number');
    expect(typeof result.effective_allure).toBe('number');
    expect(typeof result.noticeability).toBe('number');
    expect(typeof result.intimidation).toBe('number');
  });

  it('all fields are clamped 0–100', () => {
    const result = computePlayerAllure(initialState);
    for (const key of ['base_allure', 'effective_allure', 'noticeability', 'intimidation'] as const) {
      expect(result[key]).toBeGreaterThanOrEqual(0);
      expect(result[key]).toBeLessThanOrEqual(100);
    }
  });

  it('high allure stat increases effective_allure', () => {
    const low = makeState({ allure: 10 });
    const high = makeState({ allure: 90 });
    const resultLow = computePlayerAllure(low);
    const resultHigh = computePlayerAllure(high);
    expect(resultHigh.effective_allure).toBeGreaterThan(resultLow.effective_allure);
  });

  it('high infamy increases noticeability', () => {
    const base = stateWithFame({ infamy: 0 });
    const notorious = stateWithFame({ infamy: 80 });
    const resultBase = computePlayerAllure(base);
    const resultNotorious = computePlayerAllure(notorious);
    expect(resultNotorious.noticeability).toBeGreaterThan(resultBase.noticeability);
  });

  it('high corruption subtly increases allure', () => {
    const low = makeState({ corruption: 5 });
    const high = makeState({ corruption: 90 });
    const resultLow = computePlayerAllure(low);
    const resultHigh = computePlayerAllure(high);
    expect(resultHigh.effective_allure).toBeGreaterThan(resultLow.effective_allure);
  });
});

// ── getEncounterModifier ──────────────────────────────────────────────────────

describe('getEncounterModifier', () => {
  it('returns a number', () => {
    expect(typeof getEncounterModifier(initialState)).toBe('number');
  });

  it('is bounded approximately between -0.2 and 0.3', () => {
    const mod = getEncounterModifier(initialState);
    expect(mod).toBeGreaterThanOrEqual(-0.25);
    expect(mod).toBeLessThanOrEqual(0.35);
  });

  it('high allure increases modifier vs low allure', () => {
    const low = { ...initialState, player: { ...initialState.player, allure_state: { base_allure: 10, effective_allure: 10, noticeability: 10, intimidation: 5 } } };
    const high = { ...initialState, player: { ...initialState.player, allure_state: { base_allure: 90, effective_allure: 90, noticeability: 80, intimidation: 5 } } };
    expect(getEncounterModifier(high)).toBeGreaterThan(getEncounterModifier(low));
  });
});

// ── getSocialAllureBonus ──────────────────────────────────────────────────────

describe('getSocialAllureBonus', () => {
  it('returns a number', () => {
    expect(typeof getSocialAllureBonus(initialState)).toBe('number');
  });

  it('is bounded -10 to 20', () => {
    const bonus = getSocialAllureBonus(initialState);
    expect(bonus).toBeGreaterThanOrEqual(-10);
    expect(bonus).toBeLessThanOrEqual(20);
  });
});

// ── allureSummary ─────────────────────────────────────────────────────────────

describe('allureSummary', () => {
  it('returns all expected fields', () => {
    const s = allureSummary(initialState);
    expect(typeof s.allure_label).toBe('string');
    expect(typeof s.noticeability_label).toBe('string');
    expect(typeof s.intimidation_label).toBe('string');
    expect(typeof s.encounter_modifier).toBe('number');
    expect(typeof s.social_bonus).toBe('number');
  });

  it('allure_label is "Average" for default 50 allure', () => {
    const state = makeState({ allure: 50 });
    const result = computePlayerAllure(state);
    const s = allureSummary({ ...state, player: { ...state.player, allure_state: result } });
    expect(s.allure_label).toBe('Average');
  });

  it('returns "Non-threatening" or "Somewhat Threatening" for default intimidation', () => {
    const s = allureSummary(initialState);
    expect(['Non-threatening', 'Somewhat Threatening']).toContain(s.intimidation_label);
  });
});
