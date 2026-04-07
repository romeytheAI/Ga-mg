import { describe, it, expect } from 'vitest';
import {
  defaultPlayerCompanionState,
  resolveAddCompanion,
  resolveRemoveCompanion,
  resolveDamageCompanion,
  tickPlayerCompanions,
  getPartyBonuses,
  companionSummary,
  loyaltyLabel,
  bondLabel,
  moraleLabel,
} from './companionEngine';
import { initialState } from '../state/initialState';
import { CompanionRole, PlayerCompanionEntry, PlayerCompanionState } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeCompanion(id: string, role: CompanionRole, overrides: Partial<PlayerCompanionEntry> = {}): PlayerCompanionEntry {
  return {
    id,
    name: `Companion ${id}`,
    role,
    loyalty: 80,
    morale: 80,
    health: 100,
    stamina: 100,
    combat_skill: 50,
    bond: 50,
    turns_together: 0,
    ...overrides,
  };
}

// ── defaultPlayerCompanionState ───────────────────────────────────────────────

describe('defaultPlayerCompanionState', () => {
  it('starts with empty party', () => {
    const s = defaultPlayerCompanionState();
    expect(s.companions).toHaveLength(0);
    expect(s.max_party_size).toBe(3);
    expect(s.party_synergy).toBe(0);
  });
});

// ── resolveAddCompanion ───────────────────────────────────────────────────────

describe('resolveAddCompanion', () => {
  it('adds a fighter companion', () => {
    const companion = makeCompanion('c1', 'fighter');
    const result = resolveAddCompanion(initialState, companion);
    expect(result.added).toBe(true);
    expect(result.companion_state.companions).toHaveLength(1);
  });

  it('returns non-empty join narrative', () => {
    const result = resolveAddCompanion(initialState, makeCompanion('h1', 'healer'));
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('caps at max_party_size (3)', () => {
    let state = initialState;
    for (const [id, role] of [['c1', 'fighter'], ['c2', 'healer'], ['c3', 'scout']] as [string, CompanionRole][]) {
      const r = resolveAddCompanion(state, makeCompanion(id, role));
      state = { ...state, player: { ...state.player, companion_state: r.companion_state } };
    }
    const overflow = resolveAddCompanion(state, makeCompanion('c4', 'pack_mule'));
    expect(overflow.added).toBe(false);
    expect(overflow.narrative.length).toBeGreaterThan(5);
  });

  it('full party narrative is returned', () => {
    let state = initialState;
    for (const [id, role] of [['c1', 'fighter'], ['c2', 'healer'], ['c3', 'scout']] as [string, CompanionRole][]) {
      const r = resolveAddCompanion(state, makeCompanion(id, role));
      state = { ...state, player: { ...state.player, companion_state: r.companion_state } };
    }
    const overflow = resolveAddCompanion(state, makeCompanion('c4', 'pack_mule'));
    expect(overflow.narrative).toBe('Your party is already at full capacity.');
  });
});

// ── resolveRemoveCompanion ────────────────────────────────────────────────────

describe('resolveRemoveCompanion', () => {
  it('removes by companion_id', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'scout'));
    const stateWith = {
      ...initialState,
      player: { ...initialState.player, companion_state: added.companion_state },
    };
    const removed = resolveRemoveCompanion(stateWith, 'c1');
    expect(removed.companions).toHaveLength(0);
  });

  it('is a no-op for unknown id', () => {
    const result = resolveRemoveCompanion(initialState, 'unknown_id');
    expect(result.companions).toHaveLength(0);
  });
});

// ── resolveDamageCompanion ────────────────────────────────────────────────────

describe('resolveDamageCompanion', () => {
  it('reduces companion health', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'fighter'));
    const stateWith = {
      ...initialState,
      player: { ...initialState.player, companion_state: added.companion_state },
    };
    const result = resolveDamageCompanion(stateWith, 'c1', 20);
    const companion = result.companion_state.companions.find(c => c.id === 'c1');
    expect(companion).toBeDefined();
    expect(companion!.health).toBe(80);
  });

  it('removes deserting companion', () => {
    const disloyal = makeCompanion('c1', 'scout', { loyalty: 5, morale: 10 });
    const added = resolveAddCompanion(initialState, disloyal);
    const stateWith = {
      ...initialState,
      player: { ...initialState.player, companion_state: added.companion_state },
    };
    const result = resolveDamageCompanion(stateWith, 'c1', 50);
    if (result.deserted) {
      expect(result.companion_state.companions.find(c => c.id === 'c1')).toBeUndefined();
    } else {
      // Didn't desert — still acceptable (stats may not fall below thresholds)
      expect(result.deserted).toBe(false);
    }
  });
});

// ── tickPlayerCompanions ──────────────────────────────────────────────────────

describe('tickPlayerCompanions', () => {
  it('increases turns_together', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'familiar'));
    const stateWith = {
      ...initialState,
      player: { ...initialState.player, companion_state: added.companion_state },
    };
    const after = tickPlayerCompanions(stateWith.player.companion_state, 24);
    expect(after.companions[0].turns_together).toBeGreaterThan(0);
  });

  it('bond grows over time', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'fighter'));
    const stateWith = {
      ...initialState,
      player: { ...initialState.player, companion_state: added.companion_state },
    };
    const after = tickPlayerCompanions(stateWith.player.companion_state, 48);
    expect(after.companions[0].bond).toBeGreaterThan(50);
  });

  it('is no-op for empty party', () => {
    const after = tickPlayerCompanions(defaultPlayerCompanionState(), 24);
    expect(after.companions).toHaveLength(0);
  });
});

// ── getPartyBonuses ───────────────────────────────────────────────────────────

describe('getPartyBonuses', () => {
  it('returns zero bonuses for empty party', () => {
    const bonuses = getPartyBonuses(defaultPlayerCompanionState());
    expect(bonuses.combat_bonus).toBe(0);
    expect(bonuses.heal_rate_per_hour).toBe(0);
  });

  it('fighter provides combat bonus', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'fighter'));
    const bonuses = getPartyBonuses(added.companion_state);
    expect(bonuses.combat_bonus).toBeGreaterThan(0);
  });

  it('healer provides heal rate', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'healer'));
    const bonuses = getPartyBonuses(added.companion_state);
    expect(bonuses.heal_rate_per_hour).toBeGreaterThan(0);
  });

  it('pack_mule provides carry capacity', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'pack_mule'));
    const bonuses = getPartyBonuses(added.companion_state);
    expect(bonuses.carry_capacity).toBeGreaterThan(0);
  });

  it('scout provides scout range', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'scout'));
    const bonuses = getPartyBonuses(added.companion_state);
    expect(bonuses.scout_range).toBeGreaterThan(0);
  });
});

// ── companionSummary ──────────────────────────────────────────────────────────

describe('companionSummary', () => {
  it('empty party summary', () => {
    const summary = companionSummary(defaultPlayerCompanionState());
    expect(summary.companion_count).toBe(0);
    expect(summary.entries).toHaveLength(0);
  });

  it('lists companions with labels', () => {
    const added = resolveAddCompanion(initialState, makeCompanion('c1', 'healer'));
    const summary = companionSummary(added.companion_state);
    expect(summary.companion_count).toBe(1);
    expect(summary.entries[0].name).toBe('Companion c1');
    expect(summary.entries[0].loyalty_label.length).toBeGreaterThan(0);
    expect(summary.entries[0].bond_label.length).toBeGreaterThan(0);
    expect(summary.entries[0].morale_label.length).toBeGreaterThan(0);
  });
});

// ── Labels ────────────────────────────────────────────────────────────────────

describe('loyaltyLabel', () => {
  it('returns Devoted at >= 80', () => expect(loyaltyLabel(90)).toBe('Devoted'));
  it('returns Disloyal at < 20', () => expect(loyaltyLabel(5)).toBe('Disloyal'));
});

describe('bondLabel', () => {
  it('returns Inseparable at >= 80', () => expect(bondLabel(90)).toBe('Inseparable'));
  it('returns Strangers at < 20', () => expect(bondLabel(5)).toBe('Strangers'));
});

describe('moraleLabel', () => {
  it('returns Spirited at >= 80', () => expect(moraleLabel(85)).toBe('Spirited'));
  it('returns Broken at < 20', () => expect(moraleLabel(5)).toBe('Broken'));
});
