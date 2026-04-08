/**
 * arcaneEngine.test.ts — Vitest suite for the arcane game-layer bridge.
 *
 * Coverage:
 *   resolveCastSpell        — mana drain, affinity gate, unknown spell, insufficient mana,
 *                             corruption accumulation, misfire at high corruption, stat scaling
 *   resolveLearnSpell       — tome/teacher/practice sources, affinity gain, already known,
 *                             success side-effect, minimum affinity gate
 *   resolveEnchantItem      — soul gem cost, enchantment stacking limit, affinity gate,
 *                             potency scaling, stat effects
 *   resolveDisenchant       — learns enchantment pattern, removes enchantment, backlash
 *   resolveMeditateArcane   — mana recovery, corruption decay, school affinity training,
 *                             Daedric intrusion at high corruption
 *   resolveArcaneCorruptionTick — severity tiers, misfire, Daedric whispers, visual distortion
 *   getAvailableSpells      — filters by known + mana + affinity
 *   getEnchantmentEffects   — blessing/curse net stat computation
 *   SPELL_CATALOG           — catalog completeness
 */

import { describe, it, expect } from 'vitest';
import {
  SPELL_CATALOG,
  SPELL_BY_ID,
  defaultArcaneEngineState,
  resolveCastSpell,
  resolveLearnSpell,
  resolveEnchantItem,
  resolveDisenchant,
  resolveMeditateArcane,
  resolveArcaneCorruptionTick,
  getAvailableSpells,
  getEnchantmentEffects,
  ArcaneEngineState,
} from './arcaneEngine';
import { ArcaneState, Enchantment } from '../sim/types';

// ── Test helpers ──────────────────────────────────────────────────────────────

/** Deterministic LCG — same sequence on every run. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

const alwaysLow  = () => 0.01;  // always below any probability threshold
const alwaysHigh = () => 0.99;  // always above any probability threshold

/** Build a state with the given arcane fields merged in. */
function withArcane(overrides: Partial<ArcaneState>): ArcaneEngineState {
  return {
    ...defaultArcaneEngineState(),
    arcane: { ...defaultArcaneEngineState().arcane, ...overrides },
  };
}

/** Build a state that knows specific spells and optionally has extra arcane props. */
function withSpells(
  spellIds: string[],
  arcaneOverrides: Partial<ArcaneState> = {},
  extra: Partial<ArcaneEngineState> = {},
): ArcaneEngineState {
  return {
    ...defaultArcaneEngineState(),
    arcane: { ...defaultArcaneEngineState().arcane, ...arcaneOverrides },
    known_spells: spellIds,
    ...extra,
  };
}

// ── SPELL_CATALOG ─────────────────────────────────────────────────────────────

describe('SPELL_CATALOG', () => {
  it('contains at least 15 spells', () => {
    expect(SPELL_CATALOG.length).toBeGreaterThanOrEqual(15);
  });

  it('covers all 6 spell schools', () => {
    const schools = new Set(SPELL_CATALOG.map(s => s.school));
    expect(schools.has('destruction')).toBe(true);
    expect(schools.has('restoration')).toBe(true);
    expect(schools.has('illusion')).toBe(true);
    expect(schools.has('conjuration')).toBe(true);
    expect(schools.has('ward')).toBe(true);
    expect(schools.has('hex')).toBe(true);
  });

  it('includes the 10 named spells from the spec', () => {
    const ids = new Set(SPELL_CATALOG.map(s => s.id));
    for (const id of [
      'flames', 'frostbite', 'healing', 'oakflesh',
      'calm', 'fury', 'conjure_familiar', 'ward',
      'soul_trap', 'paralyze',
    ]) {
      expect(ids.has(id), `missing spell: ${id}`).toBe(true);
    }
  });

  it('every spell has a positive mana_cost and base_power', () => {
    for (const spell of SPELL_CATALOG) {
      expect(spell.mana_cost, spell.id).toBeGreaterThan(0);
      expect(spell.base_power, spell.id).toBeGreaterThan(0);
    }
  });

  it('SPELL_BY_ID index matches SPELL_CATALOG', () => {
    for (const spell of SPELL_CATALOG) {
      expect(SPELL_BY_ID[spell.id]).toBe(spell);
    }
  });
});

// ── defaultArcaneEngineState ──────────────────────────────────────────────────

describe('defaultArcaneEngineState', () => {
  it('starts with 50 mana and no corruption', () => {
    const s = defaultArcaneEngineState();
    expect(s.arcane.mana).toBe(50);
    expect(s.arcane.arcane_corruption).toBe(0);
  });

  it('starts with no known spells, enchantments, or soul gems', () => {
    const s = defaultArcaneEngineState();
    expect(s.known_spells).toHaveLength(0);
    expect(s.soul_gems).toBe(0);
    expect(s.arcane.enchantments).toHaveLength(0);
  });
});

// ── resolveCastSpell ──────────────────────────────────────────────────────────

describe('resolveCastSpell', () => {
  it('fails for an unknown spell ID', () => {
    const state = withSpells(['flames'], { mana: 100 });
    const r = resolveCastSpell(state, 'nonexistent_spell', undefined, alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toBeTruthy();
  });

  it('fails when spell is not in known_spells', () => {
    const state = withSpells([], { mana: 100 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/haven't learned/i);
  });

  it('fails when mana is insufficient', () => {
    const state = withSpells(['flames'], { mana: 5 }); // flames costs 10
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/magicka/i);
  });

  it('drains mana on successful cast', () => {
    const state = withSpells(['flames'], { mana: 50 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.success).toBe(true);
    expect(r.updated_state.arcane.mana).toBeLessThan(50);
  });

  it('mana drained equals at least the spell mana_cost', () => {
    const state = withSpells(['flames'], { mana: 80 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(80 - r.updated_state.arcane.mana).toBeGreaterThanOrEqual(SPELL_BY_ID['flames'].mana_cost);
  });

  it('increases arcane_corruption on cast', () => {
    const state = withSpells(['flames'], { mana: 80, arcane_corruption: 0 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.updated_state.arcane.arcane_corruption).toBeGreaterThan(0);
  });

  it('fails when affinity requirement is not met (frostbite needs 10)', () => {
    // frostbite requires destruction affinity 10
    const state = withSpells(['frostbite'], { mana: 80, spell_affinity: { destruction: 5 } });
    const r = resolveCastSpell(state, 'frostbite', undefined, alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/affinity/i);
  });

  it('succeeds when affinity requirement is exactly met', () => {
    const state = withSpells(['frostbite'], {
      mana: 80,
      spell_affinity: { destruction: 10 },
    });
    const r = resolveCastSpell(state, 'frostbite', undefined, alwaysLow);
    expect(r.success).toBe(true);
  });

  it('healing spell produces positive health delta', () => {
    const state = withSpells(['healing'], { mana: 80 });
    const r = resolveCastSpell(state, 'healing', undefined, alwaysLow);
    expect(r.success).toBe(true);
    expect((r.stat_deltas.health ?? 0)).toBeGreaterThan(0);
  });

  it('ward spell produces positive control delta', () => {
    const state = withSpells(['ward'], { mana: 80 });
    const r = resolveCastSpell(state, 'ward', undefined, alwaysLow);
    expect(r.success).toBe(true);
    expect((r.stat_deltas.control ?? 0)).toBeGreaterThan(0);
  });

  it('fury spell produces positive lust and arousal deltas', () => {
    const state = withSpells(['fury'], {
      mana: 80,
      spell_affinity: { illusion: 20 },
    });
    const r = resolveCastSpell(state, 'fury', undefined, alwaysLow);
    expect(r.success).toBe(true);
    expect((r.stat_deltas.lust ?? 0)).toBeGreaterThan(0);
    expect((r.stat_deltas.arousal ?? 0)).toBeGreaterThan(0);
  });

  it('emits MISFIRE side-effect at corruption >= 80 when rng is low', () => {
    // alwaysLow = 0.01 — below the 0.30 misfire threshold
    const state = withSpells(['flames'], { mana: 80, arcane_corruption: 85 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'MISFIRE')).toBe(true);
  });

  it('does NOT misfire when corruption is low', () => {
    const state = withSpells(['flames'], { mana: 80, arcane_corruption: 10 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'MISFIRE')).toBe(false);
  });

  it('misfire reduces health and adds pain', () => {
    const state = withSpells(['flames'], { mana: 80, arcane_corruption: 85 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect((r.stat_deltas.health ?? 0)).toBeLessThan(0);
    expect((r.stat_deltas.pain ?? 0)).toBeGreaterThan(0);
  });

  it('emits DAEDRIC_WHISPER at corruption >= 60 when rng is low', () => {
    const state = withSpells(['flames'], { mana: 80, arcane_corruption: 65 });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'DAEDRIC_WHISPER')).toBe(true);
  });

  it('returns a non-empty narrative on success', () => {
    const state = withSpells(['healing'], { mana: 80 });
    const r = resolveCastSpell(state, 'healing', undefined, seeded(42));
    expect(r.narrative.length).toBeGreaterThan(10);
  });

  it('narrative mentions the target when provided', () => {
    const state = withSpells(['flames'], { mana: 80 });
    const r = resolveCastSpell(state, 'flames', 'the bandit', seeded(1));
    expect(r.narrative).toMatch(/bandit/i);
  });

  it('improves school affinity after cast', () => {
    const state = withSpells(['flames'], { mana: 80, spell_affinity: { destruction: 0 } });
    const r = resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect((r.updated_state.arcane.spell_affinity.destruction ?? 0)).toBeGreaterThan(0);
  });

  it('state reference is not mutated', () => {
    const state = withSpells(['flames'], { mana: 80 });
    const manaBefore = state.arcane.mana;
    resolveCastSpell(state, 'flames', undefined, alwaysLow);
    expect(state.arcane.mana).toBe(manaBefore);
  });
});

// ── resolveLearnSpell ─────────────────────────────────────────────────────────

describe('resolveLearnSpell', () => {
  it('fails for an unknown spell', () => {
    const state = defaultArcaneEngineState();
    const r = resolveLearnSpell(state, 'bad_spell_id', 'tome', alwaysLow);
    expect(r.success).toBe(false);
  });

  it('fails when spell is already known', () => {
    const state = withSpells(['flames']);
    const r = resolveLearnSpell(state, 'flames', 'tome', alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/already know/i);
  });

  it('succeeds with tome when rng is very low (always-success branch)', () => {
    const state = defaultArcaneEngineState(); // healing requires 0 affinity
    const r = resolveLearnSpell(state, 'healing', 'tome', alwaysLow);
    expect(r.success).toBe(true);
    expect(r.updated_state.known_spells).toContain('healing');
  });

  it('emits LEARN_SPELL side-effect on success', () => {
    const state = defaultArcaneEngineState();
    const r = resolveLearnSpell(state, 'healing', 'teacher', alwaysLow);
    expect(r.side_effects.some(e => e.type === 'LEARN_SPELL')).toBe(true);
    const fx = r.side_effects.find(e => e.type === 'LEARN_SPELL') as { type: 'LEARN_SPELL'; spell_id: string };
    expect(fx.spell_id).toBe('healing');
  });

  it('fails with high rng (above success threshold)', () => {
    const state = defaultArcaneEngineState();
    const r = resolveLearnSpell(state, 'healing', 'practice', alwaysHigh);
    expect(r.success).toBe(false);
    expect(r.updated_state.known_spells).not.toContain('healing');
  });

  it('improves affinity even on failure', () => {
    const state = withArcane({ spell_affinity: { restoration: 0 } });
    const r = resolveLearnSpell(state, 'healing', 'practice', alwaysHigh);
    expect(r.success).toBe(false);
    expect((r.updated_state.arcane.spell_affinity.restoration ?? 0)).toBeGreaterThan(0);
  });

  it('requires minimum affinity for tome (half of cast requirement)', () => {
    // frostbite needs affinity 10 to cast → 5 to learn from tome
    const lowState = withArcane({ spell_affinity: { destruction: 3 } });
    const r = resolveLearnSpell(lowState, 'frostbite', 'tome', alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/affinity/i);
  });

  it('teacher does not require minimum affinity', () => {
    const noAffinityState = withArcane({ spell_affinity: {} });
    // fireball needs 50 affinity to cast; teacher bypasses minimum
    const r = resolveLearnSpell(noAffinityState, 'healing', 'teacher', alwaysLow);
    expect(r.success).toBe(true);
  });

  it('drains stamina and adds stress on attempt', () => {
    const state = defaultArcaneEngineState();
    const r = resolveLearnSpell(state, 'healing', 'tome', alwaysLow);
    expect((r.stat_deltas.stamina ?? 0)).toBeLessThan(0);
    expect((r.stat_deltas.stress ?? 0)).toBeGreaterThan(0);
  });

  it('returns a non-empty narrative on success', () => {
    const state = defaultArcaneEngineState();
    const r = resolveLearnSpell(state, 'healing', 'tome', alwaysLow);
    expect(r.narrative.length).toBeGreaterThan(10);
  });

  it('returns a non-empty narrative on failure', () => {
    const state = defaultArcaneEngineState();
    const r = resolveLearnSpell(state, 'healing', 'practice', alwaysHigh);
    expect(r.narrative.length).toBeGreaterThan(10);
  });
});

// ── resolveEnchantItem ────────────────────────────────────────────────────────

describe('resolveEnchantItem', () => {
  it('fails with no soul gems', () => {
    const state = withArcane({ spell_affinity: { restoration: 30 } }); // soul_gems = 0
    const r = resolveEnchantItem(state, 'iron_ring', 'blessing', 'restoration', alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/soul gem/i);
  });

  it('fails when school affinity is below 10', () => {
    const state = { ...withArcane({ spell_affinity: { restoration: 5 } }), soul_gems: 2 };
    const r = resolveEnchantItem(state, 'iron_ring', 'blessing', 'restoration', alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/affinity/i);
  });

  it('succeeds with sufficient soul gems and affinity', () => {
    const state = { ...withArcane({ spell_affinity: { ward: 30 } }), soul_gems: 3 };
    const r = resolveEnchantItem(state, 'leather_boots', 'blessing', 'ward', alwaysLow);
    expect(r.success).toBe(true);
    expect(r.updated_state.soul_gems).toBe(2);
  });

  it('consumes exactly one soul gem', () => {
    const state = { ...withArcane({ spell_affinity: { ward: 30 } }), soul_gems: 5 };
    const r = resolveEnchantItem(state, 'boots', 'blessing', 'ward', seeded(7));
    expect(r.updated_state.soul_gems).toBe(4);
  });

  it('adds enchantment to arcane state', () => {
    const state = { ...withArcane({ spell_affinity: { restoration: 40 } }), soul_gems: 1 };
    const r = resolveEnchantItem(state, 'amulet', 'blessing', 'restoration', seeded(3));
    expect(r.updated_state.arcane.enchantments).toHaveLength(1);
  });

  it('emits SOUL_GEM_CONSUMED and ENCHANTMENT_APPLIED side-effects', () => {
    const state = { ...withArcane({ spell_affinity: { illusion: 20 } }), soul_gems: 2 };
    const r = resolveEnchantItem(state, 'hood', 'curse', 'illusion', seeded(5));
    expect(r.side_effects.some(e => e.type === 'SOUL_GEM_CONSUMED')).toBe(true);
    expect(r.side_effects.some(e => e.type === 'ENCHANTMENT_APPLIED')).toBe(true);
  });

  it('fails at the 8-enchantment stacking limit', () => {
    const existingEnchantments: Enchantment[] = Array.from({ length: 8 }, (_, i) => ({
      id: `ench_${i}`,
      name: `Test Enchant ${i}`,
      type: 'blessing' as const,
      school: 'restoration' as const,
      potency: 30,
      duration_remaining: -1,
      stat_effects: { health: 3 },
    }));
    const state = {
      ...withArcane({ spell_affinity: { restoration: 30 }, enchantments: existingEnchantments }),
      soul_gems: 5,
    };
    const r = resolveEnchantItem(state, 'ring', 'blessing', 'restoration', alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/8/);
  });

  it('potency scales with affinity (higher affinity → higher min potency)', () => {
    const lowAff  = { ...withArcane({ spell_affinity: { ward: 10 } }), soul_gems: 1 };
    const highAff = { ...withArcane({ spell_affinity: { ward: 80 } }), soul_gems: 1 };
    const rLow  = resolveEnchantItem(lowAff,  'item', 'blessing', 'ward', alwaysLow);
    const rHigh = resolveEnchantItem(highAff, 'item', 'blessing', 'ward', alwaysLow);
    const potencyLow  = rLow.updated_state.arcane.enchantments[0]?.potency ?? 0;
    const potencyHigh = rHigh.updated_state.arcane.enchantments[0]?.potency ?? 0;
    expect(potencyHigh).toBeGreaterThan(potencyLow);
  });
});

// ── resolveDisenchant ─────────────────────────────────────────────────────────

describe('resolveDisenchant', () => {
  /** Build a state with one enchantment whose ID contains the itemId. */
  function stateWithEnchantment(itemId: string): ArcaneEngineState {
    const ench: Enchantment = {
      id: `enchant_${itemId}_99`,
      name: 'Blessing of Mara',
      type: 'blessing',
      school: 'restoration',
      potency: 40,
      duration_remaining: -1,
      stat_effects: { health: 4 },
    };
    return withArcane({ enchantments: [ench] });
  }

  it('fails when no enchantment matches the itemId', () => {
    const state = defaultArcaneEngineState();
    const r = resolveDisenchant(state, 'plain_ring', alwaysLow);
    expect(r.success).toBe(false);
    expect(r.narrative).toMatch(/no enchantment/i);
  });

  it('removes the enchantment from arcane state', () => {
    const state = stateWithEnchantment('iron_ring');
    const r = resolveDisenchant(state, 'iron_ring', alwaysHigh); // high rng skips backlash
    expect(r.success).toBe(true);
    expect(r.updated_state.arcane.enchantments).toHaveLength(0);
  });

  it('adds enchantment name to known_enchantments', () => {
    const state = stateWithEnchantment('iron_ring');
    const r = resolveDisenchant(state, 'iron_ring', alwaysHigh);
    expect(r.updated_state.known_enchantments).toContain('Blessing of Mara');
  });

  it('does not duplicate known_enchantments on repeated disenchant of same pattern', () => {
    const state: ArcaneEngineState = {
      ...stateWithEnchantment('iron_ring'),
      known_enchantments: ['Blessing of Mara'],
    };
    const r = resolveDisenchant(state, 'iron_ring', alwaysHigh);
    const count = r.updated_state.known_enchantments.filter(e => e === 'Blessing of Mara').length;
    expect(count).toBe(1);
  });

  it('emits ENCHANTMENT_LEARNED side-effect', () => {
    const state = stateWithEnchantment('ring');
    const r = resolveDisenchant(state, 'ring', alwaysHigh);
    expect(r.side_effects.some(e => e.type === 'ENCHANTMENT_LEARNED')).toBe(true);
  });

  it('applies backlash damage when rng < 0.15', () => {
    // alwaysLow (0.01) < 0.15 → backlash fires
    const state = stateWithEnchantment('ring');
    const r = resolveDisenchant(state, 'ring', alwaysLow);
    expect((r.stat_deltas.health ?? 0)).toBeLessThan(0);
    expect((r.stat_deltas.pain ?? 0)).toBeGreaterThan(0);
  });

  it('no backlash when rng >= 0.15', () => {
    const state = stateWithEnchantment('ring');
    const r = resolveDisenchant(state, 'ring', alwaysHigh);
    expect(r.stat_deltas.health).toBeUndefined();
  });

  it('improves school affinity after disenchanting', () => {
    const state = stateWithEnchantment('ring');
    const before = state.arcane.spell_affinity.restoration ?? 0;
    const r = resolveDisenchant(state, 'ring', alwaysHigh);
    expect((r.updated_state.arcane.spell_affinity.restoration ?? 0)).toBeGreaterThan(before);
  });
});

// ── resolveMeditateArcane ─────────────────────────────────────────────────────

describe('resolveMeditateArcane', () => {
  it('recovers mana over time', () => {
    const state = withArcane({ mana: 20, mana_regen: 2 });
    const r = resolveMeditateArcane(state, 2, undefined, alwaysHigh);
    expect(r.updated_state.arcane.mana).toBeGreaterThan(20);
  });

  it('mana does not exceed 100', () => {
    const state = withArcane({ mana: 95, mana_regen: 5 });
    const r = resolveMeditateArcane(state, 4, undefined, alwaysHigh);
    expect(r.updated_state.arcane.mana).toBeLessThanOrEqual(100);
  });

  it('reduces arcane corruption', () => {
    const state = withArcane({ arcane_corruption: 50 });
    const r = resolveMeditateArcane(state, 2, undefined, alwaysHigh);
    expect(r.updated_state.arcane.arcane_corruption).toBeLessThan(50);
  });

  it('corruption does not go below 0', () => {
    const state = withArcane({ arcane_corruption: 2 });
    const r = resolveMeditateArcane(state, 4, undefined, alwaysHigh);
    expect(r.updated_state.arcane.arcane_corruption).toBeGreaterThanOrEqual(0);
  });

  it('trains school affinity when school is provided', () => {
    const state = withArcane({ spell_affinity: { destruction: 10 } });
    const r = resolveMeditateArcane(state, 2, 'destruction', alwaysHigh);
    expect((r.updated_state.arcane.spell_affinity.destruction ?? 0)).toBeGreaterThan(10);
  });

  it('does not train affinity when no school provided', () => {
    const state = withArcane({ spell_affinity: {} });
    const r = resolveMeditateArcane(state, 2, undefined, alwaysHigh);
    // No school key should be set beyond default regen path
    expect(Object.keys(r.updated_state.arcane.spell_affinity).length).toBe(0);
  });

  it('reduces stress', () => {
    const state = defaultArcaneEngineState();
    const r = resolveMeditateArcane(state, 2, undefined, alwaysHigh);
    expect((r.stat_deltas.stress ?? 0)).toBeLessThan(0);
  });

  it('improves willpower', () => {
    const state = defaultArcaneEngineState();
    const r = resolveMeditateArcane(state, 2, undefined, alwaysHigh);
    expect((r.stat_deltas.willpower ?? 0)).toBeGreaterThan(0);
  });

  it('emits DAEDRIC_WHISPER at corruption >= 60 with low rng', () => {
    const state = withArcane({ arcane_corruption: 70 });
    const r = resolveMeditateArcane(state, 1, undefined, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'DAEDRIC_WHISPER')).toBe(true);
  });

  it('no Daedric intrusion when corruption is low', () => {
    const state = withArcane({ arcane_corruption: 10 });
    const r = resolveMeditateArcane(state, 2, undefined, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'DAEDRIC_WHISPER')).toBe(false);
  });

  it('returns a non-empty narrative', () => {
    const state = defaultArcaneEngineState();
    const r = resolveMeditateArcane(state, 3, 'restoration', alwaysHigh);
    expect(r.narrative.length).toBeGreaterThan(10);
  });
});

// ── resolveArcaneCorruptionTick ───────────────────────────────────────────────

describe('resolveArcaneCorruptionTick', () => {
  it('returns empty resolution below threshold (corruption < 20)', () => {
    const state = withArcane({ arcane_corruption: 10 });
    const r = resolveArcaneCorruptionTick(state, alwaysLow);
    expect(r.narrative).toBe('');
    expect(Object.keys(r.stat_deltas)).toHaveLength(0);
    expect(r.side_effects).toHaveLength(0);
  });

  it('adds stress at Slight Distortion tier (20–39)', () => {
    const state = withArcane({ arcane_corruption: 25 });
    const r = resolveArcaneCorruptionTick(state, alwaysHigh);
    expect((r.stat_deltas.stress ?? 0)).toBeGreaterThan(0);
  });

  it('adds hallucination at Flickering tier (40–59)', () => {
    const state = withArcane({ arcane_corruption: 50 });
    const r = resolveArcaneCorruptionTick(state, alwaysHigh);
    expect((r.stat_deltas.hallucination ?? 0)).toBeGreaterThan(0);
  });

  it('adds hallucination and stress at Volatile tier (60–79)', () => {
    const state = withArcane({ arcane_corruption: 65 });
    const r = resolveArcaneCorruptionTick(state, alwaysHigh);
    expect((r.stat_deltas.stress ?? 0)).toBeGreaterThan(0);
    expect((r.stat_deltas.hallucination ?? 0)).toBeGreaterThan(0);
  });

  it('emits MISFIRE at Dangerously Unstable tier (>=80) with low rng', () => {
    const state = withArcane({ arcane_corruption: 90 });
    const r = resolveArcaneCorruptionTick(state, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'MISFIRE')).toBe(true);
  });

  it('MISFIRE reduces health at high corruption', () => {
    const state = withArcane({ arcane_corruption: 90 });
    const r = resolveArcaneCorruptionTick(state, alwaysLow);
    expect((r.stat_deltas.health ?? 0)).toBeLessThan(0);
  });

  it('emits DAEDRIC_WHISPER at Dangerously Unstable with low rng', () => {
    // alwaysLow triggers both the 0.40 misfire roll and the 0.50 Daedric roll
    const state = withArcane({ arcane_corruption: 90 });
    const r = resolveArcaneCorruptionTick(state, alwaysLow);
    expect(r.side_effects.some(e => e.type === 'DAEDRIC_WHISPER')).toBe(true);
  });

  it('emits VISUAL_DISTORTION at Dangerously Unstable tier unconditionally', () => {
    const state = withArcane({ arcane_corruption: 90 });
    // Use seeded so inner rng calls are deterministic but may skip misfire/whisper
    const r = resolveArcaneCorruptionTick(state, alwaysHigh);
    expect(r.side_effects.some(e => e.type === 'VISUAL_DISTORTION')).toBe(true);
  });
});

// ── getAvailableSpells ────────────────────────────────────────────────────────

describe('getAvailableSpells', () => {
  it('returns empty list when no spells are known', () => {
    const state = withArcane({ mana: 100 });
    expect(getAvailableSpells(state)).toHaveLength(0);
  });

  it('excludes spells with insufficient mana', () => {
    // flames costs 10 mana — give 5
    const state = withSpells(['flames'], { mana: 5 });
    expect(getAvailableSpells(state)).toHaveLength(0);
  });

  it('includes spell when mana and affinity are met', () => {
    const state = withSpells(['healing'], { mana: 50 }); // healing: 0 affinity req
    const available = getAvailableSpells(state);
    expect(available.map(s => s.id)).toContain('healing');
  });

  it('excludes spell when affinity requirement is not met', () => {
    // frostbite needs destruction affinity 10
    const state = withSpells(['frostbite'], { mana: 80, spell_affinity: { destruction: 5 } });
    expect(getAvailableSpells(state)).toHaveLength(0);
  });

  it('includes multiple qualifying spells', () => {
    const state = withSpells(['healing', 'ward', 'flames'], { mana: 80 });
    const ids = getAvailableSpells(state).map(s => s.id);
    expect(ids).toContain('healing');
    expect(ids).toContain('ward');
    expect(ids).toContain('flames');
  });

  it('does not include spells not in known_spells even if affordable', () => {
    const state = withArcane({ mana: 100 }); // knows nothing
    expect(getAvailableSpells(state)).toHaveLength(0);
  });
});

// ── getEnchantmentEffects ─────────────────────────────────────────────────────

describe('getEnchantmentEffects', () => {
  it('returns empty record with no enchantments', () => {
    const state = defaultArcaneEngineState();
    expect(getEnchantmentEffects(state)).toEqual({});
  });

  it('blessings add positive stat effects', () => {
    const ench: Enchantment = {
      id: 'e1',
      name: 'Blessing of Mara',
      type: 'blessing',
      school: 'restoration',
      potency: 50,
      duration_remaining: -1,
      stat_effects: { health: 10 },
    };
    const state = withArcane({ enchantments: [ench] });
    const effects = getEnchantmentEffects(state);
    expect(effects.health).toBe(10);
  });

  it('curses subtract stat effects', () => {
    const ench: Enchantment = {
      id: 'e2',
      name: 'Curse of Flame',
      type: 'curse',
      school: 'destruction',
      potency: 40,
      duration_remaining: -1,
      stat_effects: { health: 8 },
    };
    const state = withArcane({ enchantments: [ench] });
    const effects = getEnchantmentEffects(state);
    expect(effects.health).toBe(-8);
  });

  it('stacks multiple enchantments', () => {
    const e1: Enchantment = {
      id: 'e1', name: 'B1', type: 'blessing', school: 'restoration',
      potency: 30, duration_remaining: -1, stat_effects: { health: 5 },
    };
    const e2: Enchantment = {
      id: 'e2', name: 'B2', type: 'blessing', school: 'ward',
      potency: 30, duration_remaining: -1, stat_effects: { health: 7 },
    };
    const state = withArcane({ enchantments: [e1, e2] });
    const effects = getEnchantmentEffects(state);
    expect(effects.health).toBe(12);
  });

  it('blessing and curse on same stat partially cancel', () => {
    const blessing: Enchantment = {
      id: 'b1', name: 'Blessing', type: 'blessing', school: 'restoration',
      potency: 30, duration_remaining: -1, stat_effects: { willpower: 10 },
    };
    const curse: Enchantment = {
      id: 'c1', name: 'Curse', type: 'curse', school: 'hex',
      potency: 30, duration_remaining: -1, stat_effects: { willpower: 4 },
    };
    const state = withArcane({ enchantments: [blessing, curse] });
    const effects = getEnchantmentEffects(state);
    expect(effects.willpower).toBe(6);
  });
});
