import { describe, it, expect } from 'vitest';
import {
  resolveSubstanceUse,
  getWithdrawalEffects,
  tickPlayerAddictions,
  addictionSummary,
  substanceLabel,
  SUBSTANCE_LABELS,
} from './addictionEngine';
import { initialState } from '../state/initialState';
import { PlayerAddictionState, SubstanceType } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const emptyAddiction: PlayerAddictionState = { addictions: [], overall_dependency: 0 };

function withAddiction(substance: SubstanceType, dependency: number, withdrawal: number): PlayerAddictionState {
  return {
    addictions: [
      {
        substance,
        dependency,
        tolerance: 20,
        withdrawal,
        last_use_turn: 0,
        total_uses: 5,
      },
    ],
    overall_dependency: dependency,
  };
}

// ── substanceLabel ────────────────────────────────────────────────────────────

describe('substanceLabel', () => {
  it('returns a non-empty label for every substance type', () => {
    const substances: SubstanceType[] = ['alcohol', 'moonsugar', 'skooma', 'bloodwine', 'dreamdust', 'void_essence'];
    for (const s of substances) {
      expect(substanceLabel(s).length).toBeGreaterThan(0);
    }
  });

  it('matches SUBSTANCE_LABELS record', () => {
    expect(substanceLabel('skooma')).toBe(SUBSTANCE_LABELS.skooma);
  });
});

// ── resolveSubstanceUse ───────────────────────────────────────────────────────

describe('resolveSubstanceUse', () => {
  it('reduces stress when using alcohol', () => {
    const result = resolveSubstanceUse(initialState, 'alcohol', 100, seeded(1));
    expect(result.stress_relief).toBeGreaterThan(0);
  });

  it('increases addiction_state dependency after use', () => {
    const result = resolveSubstanceUse(initialState, 'skooma', 1, seeded(2));
    const skooma = result.addiction_state.addictions.find(a => a.substance === 'skooma');
    expect(skooma).toBeDefined();
    expect(skooma!.dependency).toBeGreaterThan(0);
  });

  it('void_essence carries highest corruption_risk', () => {
    const voidResult = resolveSubstanceUse(initialState, 'void_essence', 1, seeded(3));
    const alcoResult = resolveSubstanceUse(initialState, 'alcohol',     1, seeded(3));
    expect(voidResult.corruption_risk).toBeGreaterThan(alcoResult.corruption_risk);
  });

  it('returns non-empty narrative', () => {
    const result = resolveSubstanceUse(initialState, 'dreamdust', 1, seeded(4));
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('new_addiction is true on first dependency > 0', () => {
    const result = resolveSubstanceUse(initialState, 'moonsugar', 1, seeded(5));
    expect(result.new_addiction).toBe(true);
  });

  it('new_addiction is false for already-tracked substance', () => {
    const state = {
      ...initialState,
      player: {
        ...initialState.player,
        addiction_state: withAddiction('moonsugar', 30, 0),
      },
    };
    const result = resolveSubstanceUse(state, 'moonsugar', 10, seeded(6));
    expect(result.new_addiction).toBe(false);
  });

  it('tolerance reduces effectiveness over repeated use', () => {
    // First use (low tolerance)
    const first = resolveSubstanceUse(initialState, 'alcohol', 1, seeded(7));
    // Build high tolerance state
    const highTol = {
      ...initialState,
      player: {
        ...initialState.player,
        addiction_state: {
          addictions: [{ substance: 'alcohol' as SubstanceType, dependency: 80, tolerance: 90, withdrawal: 0, last_use_turn: 0, total_uses: 100 }],
          overall_dependency: 80,
        },
      },
    };
    const tolerant = resolveSubstanceUse(highTol, 'alcohol', 200, seeded(7));
    expect(tolerant.stress_relief).toBeLessThan(first.stress_relief);
  });
});

// ── getWithdrawalEffects ──────────────────────────────────────────────────────

describe('getWithdrawalEffects', () => {
  it('returns zero effects for clean state', () => {
    const effects = getWithdrawalEffects(emptyAddiction);
    expect(effects.stress_per_hour).toBe(0);
    expect(effects.stamina_per_hour).toBe(0);
    expect(effects.in_withdrawal).toBe(false);
  });

  it('returns non-zero stress for active withdrawal', () => {
    const state = withAddiction('skooma', 80, 60);
    const effects = getWithdrawalEffects(state);
    expect(effects.stress_per_hour).toBeGreaterThan(0);
    expect(effects.in_withdrawal).toBe(true);
  });

  it('no withdrawal when substance used recently (withdrawal=0)', () => {
    const state = withAddiction('alcohol', 50, 0);
    const effects = getWithdrawalEffects(state);
    expect(effects.in_withdrawal).toBe(false);
  });
});

// ── tickPlayerAddictions ──────────────────────────────────────────────────────

describe('tickPlayerAddictions', () => {
  it('is a no-op for clean state', () => {
    const result = tickPlayerAddictions(emptyAddiction, 100, 24);
    expect(result.addictions).toHaveLength(0);
    expect(result.overall_dependency).toBe(0);
  });

  it('raises withdrawal when substance not used for many hours', () => {
    // last_use_turn = 0, current turn = 500 (well past withdrawal onset of 24)
    const state = withAddiction('skooma', 80, 0);
    const result = tickPlayerAddictions(state, 500, 24);
    const skooma = result.addictions.find(a => a.substance === 'skooma');
    expect(skooma!.withdrawal).toBeGreaterThan(0);
  });

  it('prunes clean entries (dependency ~0, withdrawal ~0)', () => {
    const almostClean: PlayerAddictionState = {
      addictions: [
        { substance: 'alcohol' as SubstanceType, dependency: 0.1, tolerance: 0, withdrawal: 0.1, last_use_turn: 0, total_uses: 1 },
      ],
      overall_dependency: 0.1,
    };
    // Tick long enough to prune
    const result = tickPlayerAddictions(almostClean, 10000, 720);
    expect(result.addictions).toHaveLength(0);
  });
});

// ── addictionSummary ──────────────────────────────────────────────────────────

describe('addictionSummary', () => {
  it('returns empty entries for clean state', () => {
    const summary = addictionSummary(emptyAddiction);
    expect(summary.substance_count).toBe(0);
    expect(summary.entries).toHaveLength(0);
    expect(summary.overall_label).toBe('Clean');
  });

  it('lists active addictions', () => {
    const state = withAddiction('bloodwine', 65, 40);
    const summary = addictionSummary(state);
    expect(summary.substance_count).toBe(1);
    expect(summary.entries[0].substance).toBe('bloodwine');
    expect(summary.entries[0].dependency).toBe(65);
    expect(summary.entries[0].withdrawal).toBe(40);
    expect(summary.entries[0].label).toBeTruthy();
  });

  it('overall_label reflects dependency', () => {
    const severe = withAddiction('skooma', 65, 0);   // 60–79 = 'Severe'
    expect(addictionSummary(severe).overall_label).toBe('Severe');
  });
});
