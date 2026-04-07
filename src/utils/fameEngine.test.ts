import { describe, it, expect } from 'vitest';
import { resolveGainFame, applyJobShiftFame, tickPlayerFame, getJobFameBonus, fameSummary } from './fameEngine';
import { initialState } from '../state/initialState';
import { GameState, PlayerFameRecord } from '../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function stateWithFame(fame: Partial<PlayerFameRecord>): GameState {
  return {
    ...initialState,
    player: {
      ...initialState.player,
      fame_record: { ...initialState.player.fame_record, ...fame },
    },
  };
}

const ZERO_FAME: PlayerFameRecord = { social: 0, crime: 0, wealth_fame: 0, combat_fame: 0, infamy: 0 };

// ── resolveGainFame ───────────────────────────────────────────────────────────

describe('resolveGainFame', () => {
  it('increases the named fame type', () => {
    const state = stateWithFame(ZERO_FAME);
    const { fame_record } = resolveGainFame(state, 'social', 10);
    expect(fame_record.social).toBe(10);
    expect(fame_record.crime).toBe(0);
  });

  it('clamps at 100', () => {
    const state = stateWithFame({ social: 95 });
    const { fame_record } = resolveGainFame(state, 'social', 20);
    expect(fame_record.social).toBe(100);
  });

  it('clamps at 0 (no negative fame)', () => {
    const state = stateWithFame(ZERO_FAME);
    const { fame_record } = resolveGainFame(state, 'infamy', 0);
    expect(fame_record.infamy).toBe(0);
  });

  it('returns a narrative string', () => {
    const state = stateWithFame(ZERO_FAME);
    const { narrative } = resolveGainFame(state, 'social', 5, () => 0);
    expect(typeof narrative).toBe('string');
    expect(narrative.length).toBeGreaterThan(0);
  });

  it('returns deterministic narrative with fixed rng', () => {
    const state = stateWithFame(ZERO_FAME);
    const { narrative: n1 } = resolveGainFame(state, 'crime', 5, () => 0);
    const { narrative: n2 } = resolveGainFame(state, 'crime', 5, () => 0);
    expect(n1).toBe(n2);
  });

  it('updates crime fame correctly', () => {
    const state = stateWithFame(ZERO_FAME);
    const { fame_record } = resolveGainFame(state, 'crime', 15);
    expect(fame_record.crime).toBe(15);
  });

  it('updates combat_fame correctly', () => {
    const state = stateWithFame(ZERO_FAME);
    const { fame_record } = resolveGainFame(state, 'combat_fame', 25);
    expect(fame_record.combat_fame).toBe(25);
  });

  it('does not affect other fame types', () => {
    const state = stateWithFame({ social: 10, wealth_fame: 20 });
    const { fame_record } = resolveGainFame(state, 'social', 5);
    expect(fame_record.wealth_fame).toBe(20);
    expect(fame_record.crime).toBe(0);
  });
});

// ── applyJobShiftFame ─────────────────────────────────────────────────────────

describe('applyJobShiftFame', () => {
  it('guard job increases social and combat_fame', () => {
    const state = { ...stateWithFame(ZERO_FAME), player: { ...stateWithFame(ZERO_FAME).player, player_job: 'guard' as const } };
    const updated = applyJobShiftFame(state);
    expect(updated.combat_fame).toBeGreaterThan(0);
    expect(updated.social).toBeGreaterThan(0);
  });

  it('thief job increases crime and infamy', () => {
    const state = { ...stateWithFame(ZERO_FAME), player: { ...stateWithFame(ZERO_FAME).player, player_job: 'thief' as const } };
    const updated = applyJobShiftFame(state);
    expect(updated.crime).toBeGreaterThan(0);
    expect(updated.infamy).toBeGreaterThan(0);
  });

  it('merchant increases wealth_fame and social', () => {
    const state = { ...stateWithFame(ZERO_FAME), player: { ...stateWithFame(ZERO_FAME).player, player_job: 'merchant' as const } };
    const updated = applyJobShiftFame(state);
    expect(updated.wealth_fame).toBeGreaterThan(0);
  });

  it('none job gives no fame bonus', () => {
    const state = stateWithFame(ZERO_FAME);
    const updated = applyJobShiftFame(state); // player_job defaults to 'none'
    expect(updated).toEqual(ZERO_FAME);
  });
});

// ── tickPlayerFame ────────────────────────────────────────────────────────────

describe('tickPlayerFame', () => {
  it('reduces social fame over days', () => {
    const state = stateWithFame({ social: 50 });
    const updated = tickPlayerFame(state, 1);
    expect(updated.social).toBeLessThan(50);
  });

  it('does not go below zero', () => {
    const state = stateWithFame({ social: 0.1 });
    const updated = tickPlayerFame(state, 5);
    expect(updated.social).toBeGreaterThanOrEqual(0);
  });

  it('infamy decays slower than social', () => {
    const state = stateWithFame({ social: 30, infamy: 30 });
    const updated = tickPlayerFame(state, 3);
    expect(updated.infamy).toBeGreaterThan(updated.social);
  });

  it('zero days causes no decay', () => {
    const state = stateWithFame({ social: 40, crime: 20 });
    const updated = tickPlayerFame(state, 0);
    expect(updated.social).toBe(40);
    expect(updated.crime).toBe(20);
  });
});

// ── getJobFameBonus ───────────────────────────────────────────────────────────

describe('getJobFameBonus', () => {
  it('returns non-empty object for guard', () => {
    const bonus = getJobFameBonus('guard');
    expect(Object.keys(bonus).length).toBeGreaterThan(0);
  });

  it('returns empty object for none', () => {
    const bonus = getJobFameBonus('none');
    expect(Object.keys(bonus).length).toBe(0);
  });
});

// ── fameSummary ───────────────────────────────────────────────────────────────

describe('fameSummary', () => {
  it('returns fame_label "Unknown" for zero fame', () => {
    const s = fameSummary(ZERO_FAME);
    expect(s.fame_label).toBe('Unknown');
  });

  it('returns "Clean" notoriety_label for zero crime/infamy', () => {
    const s = fameSummary(ZERO_FAME);
    expect(s.notoriety_label).toBe('Clean');
  });

  it('total_fame sums social + wealth + combat', () => {
    const fame: PlayerFameRecord = { social: 10, crime: 5, wealth_fame: 20, combat_fame: 15, infamy: 8 };
    const s = fameSummary(fame);
    expect(s.total_fame).toBe(45);
  });

  it('total_notoriety sums crime + infamy', () => {
    const fame: PlayerFameRecord = { social: 0, crime: 20, wealth_fame: 0, combat_fame: 0, infamy: 30 };
    const s = fameSummary(fame);
    expect(s.total_notoriety).toBe(50);
  });

  it('returns "Recognized" for moderate fame', () => {
    const fame: PlayerFameRecord = { social: 10, crime: 0, wealth_fame: 10, combat_fame: 5, infamy: 0 };
    const s = fameSummary(fame);
    expect(s.fame_label).toBe('Recognized');
  });
});
