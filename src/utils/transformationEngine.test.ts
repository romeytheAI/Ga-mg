import { describe, it, expect } from 'vitest';
import {
  defaultPlayerTransformation,
  resolveAddBodyChange,
  resolveRemoveBodyChange,
  resolvePurgeTemporaryChanges,
  getTransformationStatEffects,
  evaluatePlayerAscension,
  tickPlayerTransformation,
  transformationSummary,
  ascensionLabel,
  mutationResistanceLabel,
} from './transformationEngine';
import { initialState } from '../state/initialState';
import { PlayerBodyChange, AscensionPath } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const cosmetic: PlayerBodyChange = {
  id: 'tattoo_1',
  type: 'cosmetic',
  description: 'A spiral tattoo on your wrist.',
  turn_acquired: 10,
  permanent: true,
  stat_effects: { allure: 5 },
};

const structural: PlayerBodyChange = {
  id: 'horns_1',
  type: 'structural',
  description: 'Small curved horns have grown from your temples.',
  turn_acquired: 20,
  permanent: true,
  stat_effects: { corruption: 10 },
};

const temporary: PlayerBodyChange = {
  id: 'glow_1',
  type: 'cosmetic',
  description: 'Your skin faintly glows.',
  turn_acquired: 5,
  permanent: false,
  stat_effects: {},
};

// ── defaultPlayerTransformation ───────────────────────────────────────────────

describe('defaultPlayerTransformation', () => {
  it('starts unascended with no changes', () => {
    const t = defaultPlayerTransformation();
    expect(t.ascension).toBe('none');
    expect(t.ascension_progress).toBe(0);
    expect(t.body_changes).toHaveLength(0);
    expect(t.mutation_resistance).toBe(50);
  });
});

// ── resolveAddBodyChange ──────────────────────────────────────────────────────

describe('resolveAddBodyChange', () => {
  it('adds a permanent change with low resistance rng', () => {
    // rng = 0.01 → passes resistance check (resistance < 50, rng*100 < resistance)
    // Actually for permanent changes, resistance check is skipped
    const result = resolveAddBodyChange(initialState, cosmetic, seeded(1));
    expect(result.transformation.body_changes).toHaveLength(1);
    expect(result.resisted).toBe(false);
    expect(result.narrative.length).toBeGreaterThan(5);
  });

  it('returns non-empty narrative on success', () => {
    const result = resolveAddBodyChange(initialState, structural, seeded(3));
    expect(result.narrative).not.toBe('Your body resists the change. Nothing happens.');
  });

  it('returns resisted narrative on low rng for non-permanent change', () => {
    // Math.random()*100 < resistance(50) → resist when rng=0.0 → 0 < 50 = true
    const result = resolveAddBodyChange(initialState, { ...temporary }, () => 0.0);
    expect(result.resisted).toBe(true);
    expect(result.narrative).toBe('Your body resists the change. Nothing happens.');
  });
});

// ── resolveRemoveBodyChange ───────────────────────────────────────────────────

describe('resolveRemoveBodyChange', () => {
  it('removes a change by id', () => {
    // First add, then remove
    const added = resolveAddBodyChange(initialState, cosmetic, seeded(1));
    const stateWithChange = {
      ...initialState,
      player: { ...initialState.player, transformation: added.transformation },
    };
    const removed = resolveRemoveBodyChange(stateWithChange, 'tattoo_1');
    expect(removed.body_changes).toHaveLength(0);
  });
});

// ── resolvePurgeTemporaryChanges ──────────────────────────────────────────────

describe('resolvePurgeTemporaryChanges', () => {
  it('removes non-permanent changes', () => {
    // Add a temporary change (force rng to pass resistance)
    const preState = {
      ...initialState,
      player: {
        ...initialState.player,
        transformation: {
          ...initialState.player.transformation,
          body_changes: [cosmetic, temporary],
        },
      },
    };
    const purged = resolvePurgeTemporaryChanges(preState);
    expect(purged.body_changes.every(c => c.permanent)).toBe(true);
  });

  it('keeps permanent changes after purge', () => {
    const preState = {
      ...initialState,
      player: {
        ...initialState.player,
        transformation: {
          ...initialState.player.transformation,
          body_changes: [cosmetic],
        },
      },
    };
    const purged = resolvePurgeTemporaryChanges(preState);
    expect(purged.body_changes).toHaveLength(1);
  });
});

// ── getTransformationStatEffects ──────────────────────────────────────────────

describe('getTransformationStatEffects', () => {
  it('returns empty object for no changes', () => {
    const effects = getTransformationStatEffects(initialState.player.transformation);
    expect(Object.keys(effects)).toHaveLength(0);
  });

  it('sums stat effects across multiple changes', () => {
    const t = {
      ...initialState.player.transformation,
      body_changes: [cosmetic, structural],
    };
    const effects = getTransformationStatEffects(t);
    expect(effects.allure).toBe(5);
    expect(effects.corruption).toBe(10);
  });
});

// ── evaluatePlayerAscension ───────────────────────────────────────────────────

describe('evaluatePlayerAscension', () => {
  it('returns divine_spark for default state (purity 100, corruption 0)', () => {
    expect(evaluatePlayerAscension(initialState)).toBe('divine_spark');
  });

  it('returns divine_spark for high purity, low corruption', () => {
    const state = {
      ...initialState,
      player: {
        ...initialState.player,
        stats: { ...initialState.player.stats, purity: 90, corruption: 5 },
      },
    };
    expect(evaluatePlayerAscension(state)).toBe('divine_spark');
  });

  it('returns daedric_champion for high corruption, low purity, many changes', () => {
    const state = {
      ...initialState,
      player: {
        ...initialState.player,
        stats: { ...initialState.player.stats, corruption: 90, purity: 5 },
        transformation: {
          ...initialState.player.transformation,
          body_changes: Array.from({ length: 6 }, (_, i) => ({ ...structural, id: `c${i}` })),
        },
      },
    };
    expect(evaluatePlayerAscension(state)).toBe('daedric_champion');
  });
});

// ── tickPlayerTransformation ──────────────────────────────────────────────────

describe('tickPlayerTransformation', () => {
  it('increases ascension_progress when qualifying for divine_spark', () => {
    const state = {
      ...initialState,
      player: {
        ...initialState.player,
        stats: { ...initialState.player.stats, purity: 90, corruption: 5 },
        transformation: { ...initialState.player.transformation },
      },
    };
    const after = tickPlayerTransformation(state, 24);
    expect(after.ascension_progress).toBeGreaterThan(0);
  });

  it('does not error on no-qualifying state', () => {
    const after = tickPlayerTransformation(initialState, 8);
    expect(after).toBeDefined();
  });
});

// ── transformationSummary ─────────────────────────────────────────────────────

describe('transformationSummary', () => {
  it('returns unascended for default', () => {
    const summary = transformationSummary(initialState.player.transformation);
    expect(summary.ascension_path).toBe('none');
    expect(summary.ascension_label).toBe('Unascended');
    expect(summary.body_change_count).toBe(0);
    expect(summary.permanent_change_count).toBe(0);
  });

  it('counts permanent vs total changes correctly', () => {
    const t = {
      ...initialState.player.transformation,
      body_changes: [cosmetic, temporary],
    };
    const summary = transformationSummary(t);
    expect(summary.body_change_count).toBe(2);
    expect(summary.permanent_change_count).toBe(1);
  });
});

// ── Labels ────────────────────────────────────────────────────────────────────

describe('ascensionLabel', () => {
  it('labels all paths', () => {
    const paths: AscensionPath[] = ['none', 'divine_spark', 'daedric_champion', 'hist_devoted', 'hircine_chosen', 'arcane_conduit'];
    for (const p of paths) {
      expect(ascensionLabel(p as any).length).toBeGreaterThan(0);
    }
  });
});

describe('mutationResistanceLabel', () => {
  it('returns Highly Resistant at 80+', () => expect(mutationResistanceLabel(80)).toBe('Highly Resistant'));
  it('returns Highly Susceptible at <20', () => expect(mutationResistanceLabel(10)).toBe('Highly Susceptible'));
});
