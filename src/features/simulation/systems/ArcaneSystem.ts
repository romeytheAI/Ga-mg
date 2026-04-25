/**
 * ArcaneSystem — magic, enchantments, blessings, curses, and mana.
 *
 * NPCs can acquire enchantments (blessings or curses) that modify their stats.
 * Mana regenerates over time and fuels spell usage.
 * Overuse of magic risks arcane corruption.
 */
import { ArcaneState, Enchantment, SpellSchool, EnchantmentType } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultArcaneState(): ArcaneState {
  return {
    mana: 50,
    mana_regen: 2,
    spell_affinity: {},
    enchantments: [],
    arcane_corruption: 0,
  };
}

// ── Enchantments ─────────────────────────────────────────────────────────

export function addEnchantment(state: ArcaneState, enchantment: Enchantment): ArcaneState {
  // Cap at 8 active enchantments
  if (state.enchantments.length >= 8) {
    return state;
  }
  return {
    ...state,
    enchantments: [...state.enchantments, enchantment],
  };
}

export function removeEnchantment(state: ArcaneState, enchantmentId: string): ArcaneState {
  return {
    ...state,
    enchantments: state.enchantments.filter(e => e.id !== enchantmentId),
  };
}

/** Compute net stat effects from all active enchantments. */
export function enchantmentStatEffects(state: ArcaneState): Record<string, number> {
  const result: Record<string, number> = {};
  for (const ench of state.enchantments) {
    const sign = ench.type === 'blessing''? 1 : -1;
    for (const [stat, val] of Object.entries(ench.stat_effects)) {
      result[stat] = (result[stat] ?? 0) + (val ?? 0) * sign;
    }
  }
  return result;
}

// ── Mana ─────────────────────────────────────────────────────────────────

export function spendMana(state: ArcaneState, cost: number): ArcaneState | null {
  if (state.mana < cost) return null; // insufficient mana
  return {
    ...state,
    mana: clamp(state.mana - cost, 0, 100),
    arcane_corruption: clamp(state.arcane_corruption + cost * 0.05, 0, 100),
  };
}

// ── Tick ──────────────────────────────────────────────────────────────────

export function tickArcane(state: ArcaneState, hours: number): ArcaneState {
  // 1. Regenerate mana
  let mana = clamp(state.mana + state.mana_regen * hours, 0, 100);

  // 2. Decay arcane corruption slowly
  let arcaneCorruption = clamp(state.arcane_corruption - 0.1 * hours, 0, 100);

  // 3. Tick enchantment durations
  const enchantments = state.enchantments
    .map(e => ({
      ...e,
      duration_remaining: e.duration_remaining === -1 ? -1 : e.duration_remaining - hours,
    }))
    .filter(e => e.duration_remaining === -1 || e.duration_remaining > 0);

  // 4. Active curses drain mana
  const curseDrain = enchantments.filter(e => e.type === 'curse').length * 0.5 * hours;
  mana = clamp(mana - curseDrain, 0, 100);

  return {
    ...state,
    mana,
    arcane_corruption: arcaneCorruption,
    enchantments,
  };
}

// ── Spell Affinity ───────────────────────────────────────────────────────

export function improveAffinity(state: ArcaneState, school: SpellSchool, amount: number): ArcaneState {
  const current = state.spell_affinity[school] ?? 0;
  return {
    ...state,
    spell_affinity: {
      ...state.spell_affinity,
      [school]: clamp(current + amount, 0, 100),
    },
  };
}

export function getAffinity(state: ArcaneState, school: SpellSchool): number {
  return state.spell_affinity[school] ?? 0;
}

// ── Labels ───────────────────────────────────────────────────────────────

export function manaLabel(mana: number): string {
  if (mana >= 80) return 'Overflowing';
  if (mana >= 60) return 'Charged';
  if (mana >= 40) return 'Moderate';
  if (mana >= 20) return 'Low';
  if (mana > 0) return 'Depleted';
  return 'Empty';
}

export function arcaneCorruptionLabel(corruption: number): string {
  if (corruption >= 80) return 'Dangerously Unstable';
  if (corruption >= 60) return 'Volatile';
  if (corruption >= 40) return 'Flickering';
  if (corruption >= 20) return 'Slight Distortion';
  return 'Stable';
}

export function affinityLabel(affinity: number): string {
  if (affinity >= 80) return 'Master';
  if (affinity >= 60) return 'Adept';
  if (affinity >= 40) return 'Practitioner';
  if (affinity >= 20) return 'Apprentice';
  if (affinity > 0) return 'Novice';
  return 'Untrained';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
