/**
 * ParasiteSystem — parasite lifecycle, symbiosis, and corruption effects.
 *
 * Parasites attach to NPCs, drain health/stamina, and add corruption.
 * Over time, parasites can evolve toward symbiosis, providing benefits.
 */
import { ParasiteState, ParasiteEntry, ParasiteSpecies } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultParasiteState(): ParasiteState {
  return {
    parasites: [],
    infestation_level: 0,
    symbiotic_benefits: 0,
  };
}

// ── Species Properties ───────────────────────────────────────────────────

const PARASITE_PROPERTIES: Record<ParasiteSpecies, { growth_rate: number; base_health_drain: number; base_stamina_drain: number; base_corruption: number; symbiosis_chance: number }> = {
  brain_worm:   { growth_rate: 0.8, base_health_drain: 0.5, base_stamina_drain: 0.3, base_corruption: 0.4, symbiosis_chance: 0.15 },
  blood_leech:  { growth_rate: 1.2, base_health_drain: 1.0, base_stamina_drain: 0.5, base_corruption: 0.2, symbiosis_chance: 0.20 },
  void_tick:    { growth_rate: 0.5, base_health_drain: 0.3, base_stamina_drain: 0.2, base_corruption: 0.8, symbiosis_chance: 0.10 },
  dream_moth:   { growth_rate: 0.6, base_health_drain: 0.2, base_stamina_drain: 0.8, base_corruption: 0.3, symbiosis_chance: 0.25 },
  marrow_grub:  { growth_rate: 1.0, base_health_drain: 1.5, base_stamina_drain: 1.0, base_corruption: 0.5, symbiosis_chance: 0.05 },
};

// ── Attach Parasite ──────────────────────────────────────────────────────

export function attachParasite(
  state: ParasiteState,
  species: ParasiteSpecies,
  turn: number
): ParasiteState {
  // Max 5 parasites
  if (state.parasites.length >= 5) return state;

  const props = PARASITE_PROPERTIES[species];
  const entry: ParasiteEntry = {
    species,
    maturity: 0,
    symbiosis: 0,
    health_drain: props.base_health_drain,
    stamina_drain: props.base_stamina_drain,
    corruption_buff: props.base_corruption,
    turn_acquired: turn,
  };

  const parasites = [...state.parasites, entry];
  return {
    parasites,
    infestation_level: computeInfestation(parasites),
    symbiotic_benefits: computeSymbioticBenefits(parasites),
  };
}

// ── Remove Parasite ──────────────────────────────────────────────────────

export function removeParasite(state: ParasiteState, index: number): ParasiteState {
  const parasites = state.parasites.filter((_, i) => i !== index);
  return {
    parasites,
    infestation_level: computeInfestation(parasites),
    symbiotic_benefits: computeSymbioticBenefits(parasites),
  };
}

/** Remove all parasites (purge/cure). */
export function purgeAllParasites(state: ParasiteState): ParasiteState {
  return defaultParasiteState();
}

// ── Tick ──────────────────────────────────────────────────────────────────

export function tickParasite(state: ParasiteState, hours: number): ParasiteState {
  const parasites = state.parasites.map(entry => {
    const props = PARASITE_PROPERTIES[entry.species];

    // Growth
    const maturity = clamp(entry.maturity + props.growth_rate * hours, 0, 100);

    // Symbiosis evolves slowly at high maturity
    let symbiosis = entry.symbiosis;
    if (maturity > 50) {
      const chance = props.symbiosis_chance * hours * (maturity / 100);
      symbiosis = clamp(symbiosis + chance, 0, 100);
    }

    // Drain scales with maturity, reduced by symbiosis
    const drainFactor = (maturity / 100) * (1 - symbiosis / 200);
    const healthDrain = props.base_health_drain * drainFactor;
    const staminaDrain = props.base_stamina_drain * drainFactor;
    const corruptionBuff = props.base_corruption * (maturity / 100);

    return {
      ...entry,
      maturity,
      symbiosis,
      health_drain: healthDrain,
      stamina_drain: staminaDrain,
      corruption_buff: corruptionBuff,
    };
  });

  return {
    parasites,
    infestation_level: computeInfestation(parasites),
    symbiotic_benefits: computeSymbioticBenefits(parasites),
  };
}

// ── Effects ──────────────────────────────────────────────────────────────

export function totalHealthDrain(state: ParasiteState): number {
  return clamp(state.parasites.reduce((sum, p) => sum + p.health_drain, 0), 0, 20);
}

export function totalStaminaDrain(state: ParasiteState): number {
  return clamp(state.parasites.reduce((sum, p) => sum + p.stamina_drain, 0), 0, 20);
}

export function totalCorruptionBuff(state: ParasiteState): number {
  return clamp(state.parasites.reduce((sum, p) => sum + p.corruption_buff, 0), 0, 15);
}

/** Symbiotic parasites can provide stat bonuses. */
export function symbioticHealthRegen(state: ParasiteState): number {
  let regen = 0;
  for (const p of state.parasites) {
    if (p.symbiosis > 60) {
      regen += (p.symbiosis - 60) * 0.02;
    }
  }
  return clamp(regen, 0, 5);
}

// ── Labels ───────────────────────────────────────────────────────────────

export function infestationLabel(level: number): string {
  if (level >= 80) return 'Overrun';
  if (level >= 60) return 'Heavily Infested';
  if (level >= 40) return 'Infested';
  if (level >= 20) return 'Lightly Infested';
  if (level > 0) return 'Minor Presence';
  return 'Clean';
}

export function symbiosisLabel(symbiosis: number): string {
  if (symbiosis >= 80) return 'Mutualistic';
  if (symbiosis >= 60) return 'Cooperative';
  if (symbiosis >= 40) return 'Tolerant';
  if (symbiosis >= 20) return 'Uneasy';
  return 'Hostile';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function computeInfestation(parasites: ParasiteEntry[]): number {
  if (parasites.length === 0) return 0;
  const total = parasites.reduce((sum, p) => sum + p.maturity, 0);
  return clamp((total / parasites.length) * (parasites.length / 5), 0, 100);
}

function computeSymbioticBenefits(parasites: ParasiteEntry[]): number {
  if (parasites.length === 0) return 0;
  const symTotal = parasites.reduce((sum, p) => sum + Math.max(0, p.symbiosis - 40), 0);
  return clamp(symTotal / parasites.length, 0, 100);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
