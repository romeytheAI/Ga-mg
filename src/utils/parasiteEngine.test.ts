import { describe, it, expect } from 'vitest';
import {
  defaultPlayerParasiteState,
  resolveAttachParasite,
  resolveRemoveParasite,
  resolvePurgeAllParasites,
  tickPlayerParasites,
  getParasiteEffects,
  parasiteSummary,
  infestationLabel,
  symbiosisLabel,
} from './parasiteEngine';
import { initialState } from '../state/initialState';
import { ParasiteSpecies, PlayerParasiteState } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function withParasite(species: ParasiteSpecies, maturity: number, symbiosis = 0): PlayerParasiteState {
  return {
    parasites: [{
      species,
      maturity,
      symbiosis,
      health_drain: 0.5,
      stamina_drain: 0.3,
      corruption_buff: 0.2,
      turn_acquired: 0,
    }],
    infestation_level: (maturity / 100) * 0.2,
    symbiotic_benefits: 0,
  };
}

// ── defaultPlayerParasiteState ────────────────────────────────────────────────

describe('defaultPlayerParasiteState', () => {
  it('starts clean', () => {
    const s = defaultPlayerParasiteState();
    expect(s.parasites).toHaveLength(0);
    expect(s.infestation_level).toBe(0);
  });
});

// ── resolveAttachParasite ─────────────────────────────────────────────────────

describe('resolveAttachParasite', () => {
  it('attaches a cinder_tick', () => {
    const result = resolveAttachParasite(initialState, 'cinder_tick', 1);
    expect(result.attached).toBe(true);
    expect(result.parasite_state.parasites).toHaveLength(1);
    expect(result.parasite_state.parasites[0].species).toBe('cinder_tick');
  });

  it('returns non-empty narrative', () => {
    const result = resolveAttachParasite(initialState, 'ancestor_moth', 1);
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('caps at 5 parasites', () => {
    let state = initialState;
    for (const species of ['kwama_larva', 'cinder_tick', 'chaurus_larva', 'ancestor_moth', 'bone_grub'] as ParasiteSpecies[]) {
      const r = resolveAttachParasite(state, species, 1);
      state = { ...state, player: { ...state.player, parasite_state: r.parasite_state } };
    }
    const overflow = resolveAttachParasite(state, 'kwama_larva', 2);
    expect(overflow.attached).toBe(false);
    expect(overflow.narrative.length).toBeGreaterThan(5);
  });
});

// ── resolveRemoveParasite ─────────────────────────────────────────────────────

describe('resolveRemoveParasite', () => {
  it('removes by index', () => {
    const stateWithParasite = {
      ...initialState,
      player: { ...initialState.player, parasite_state: withParasite('kwama_larva', 50) },
    };
    const removed = resolveRemoveParasite(stateWithParasite, 0);
    expect(removed.parasites).toHaveLength(0);
  });
});

// ── resolvePurgeAllParasites ──────────────────────────────────────────────────

describe('resolvePurgeAllParasites', () => {
  it('clears all parasites', () => {
    const clean = resolvePurgeAllParasites();
    expect(clean.parasites).toHaveLength(0);
    expect(clean.infestation_level).toBe(0);
  });
});

// ── tickPlayerParasites ───────────────────────────────────────────────────────

describe('tickPlayerParasites', () => {
  it('grows parasite maturity over time', () => {
    const state = withParasite('cinder_tick', 0);
    const after = tickPlayerParasites(state, 24);
    expect(after.parasites[0].maturity).toBeGreaterThan(0);
  });

  it('develops symbiosis at high maturity', () => {
    const state = withParasite('ancestor_moth', 80); // ancestor_moth has highest symbiosis_chance
    const after = tickPlayerParasites(state, 100);
    expect(after.parasites[0].symbiosis).toBeGreaterThan(0);
  });

  it('no-op for empty state', () => {
    const after = tickPlayerParasites(defaultPlayerParasiteState(), 24);
    expect(after.parasites).toHaveLength(0);
  });
});

// ── getParasiteEffects ────────────────────────────────────────────────────────

describe('getParasiteEffects', () => {
  it('returns zero effects when clean', () => {
    const effects = getParasiteEffects(defaultPlayerParasiteState());
    expect(effects.health_per_hour).toBe(0);
    expect(effects.is_infested).toBe(false);
  });

  it('returns positive drain when infested', () => {
    const state = withParasite('bone_grub', 80);
    const effects = getParasiteEffects(state);
    expect(effects.health_per_hour).toBeGreaterThan(0);
    expect(effects.is_infested).toBe(true);
  });

  it('returns symbiotic regen when symbiosis > 60', () => {
    const state = withParasite('ancestor_moth', 80, 80);
    const effects = getParasiteEffects(state);
    expect(effects.symbiotic_regen_per_hour).toBeGreaterThan(0);
  });
});

// ── parasiteSummary ───────────────────────────────────────────────────────────

describe('parasiteSummary', () => {
  it('clean summary', () => {
    const summary = parasiteSummary(defaultPlayerParasiteState());
    expect(summary.is_infested).toBe(false);
    expect(summary.parasite_count).toBe(0);
    expect(summary.infestation_label).toBe('Clean');
  });

  it('infested summary lists parasite', () => {
    const state = withParasite('chaurus_larva', 60);
    const summary = parasiteSummary(state);
    expect(summary.is_infested).toBe(true);
    expect(summary.parasite_count).toBe(1);
    expect(summary.entries[0].species).toBe('chaurus_larva');
    expect(summary.entries[0].symbiosis_label).toBe('Hostile');
  });
});

// ── Labels ────────────────────────────────────────────────────────────────────

describe('infestationLabel', () => {
  it('returns Clean at 0', () => expect(infestationLabel(0)).toBe('Clean'));
  it('returns Overrun at >= 80', () => expect(infestationLabel(90)).toBe('Overrun'));
});

describe('symbiosisLabel', () => {
  it('returns Hostile at 0', () => expect(symbiosisLabel(0)).toBe('Hostile'));
  it('returns Mutualistic at >= 80', () => expect(symbiosisLabel(85)).toBe('Mutualistic'));
});
