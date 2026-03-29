/**
 * CompanionSystem — party management, companion AI, and bond mechanics.
 *
 * Companions travel with NPCs, providing combat bonuses, healing,
 * scouting advantages, and carrying capacity.
 */
import { CompanionState, CompanionEntry, CompanionRole } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultCompanionState(): CompanionState {
  return {
    companions: [],
    max_party_size: 3,
    party_synergy: 0,
  };
}

// ── Role Bonuses ─────────────────────────────────────────────────────────

const ROLE_BONUSES: Record<CompanionRole, { combat_bonus: number; heal_rate: number; scout_range: number; carry_capacity: number }> = {
  fighter:    { combat_bonus: 15, heal_rate: 0,  scout_range: 0,  carry_capacity: 5  },
  healer:     { combat_bonus: 0,  heal_rate: 3,  scout_range: 0,  carry_capacity: 3  },
  scout:      { combat_bonus: 5,  heal_rate: 0,  scout_range: 20, carry_capacity: 3  },
  pack_mule:  { combat_bonus: 0,  heal_rate: 0,  scout_range: 0,  carry_capacity: 30 },
  familiar:   { combat_bonus: 8,  heal_rate: 1,  scout_range: 10, carry_capacity: 0  },
};

// ── Add/Remove Companions ────────────────────────────────────────────────

export function addCompanion(state: CompanionState, companion: CompanionEntry): CompanionState {
  if (state.companions.length >= state.max_party_size) {
    return state; // party full
  }
  const companions = [...state.companions, companion];
  return {
    ...state,
    companions,
    party_synergy: computeSynergy(companions),
  };
}

export function removeCompanion(state: CompanionState, companionId: string): CompanionState {
  const companions = state.companions.filter(c => c.id !== companionId);
  return {
    ...state,
    companions,
    party_synergy: computeSynergy(companions),
  };
}

// ── Tick ──────────────────────────────────────────────────────────────────

export function tickCompanions(state: CompanionState, hours: number): CompanionState {
  const companions = state.companions.map(c => {
    // Bond grows slowly
    const bond = clamp(c.bond + 0.1 * hours, 0, 100);

    // Morale decays slightly if health is low
    let morale = c.morale;
    if (c.health < 30) {
      morale = clamp(morale - 0.5 * hours, 0, 100);
    } else {
      morale = clamp(morale + 0.1 * hours, 0, 100);
    }

    // Loyalty affected by bond and morale
    const loyaltyDelta = (bond > 50 ? 0.05 : -0.05) * hours;
    const loyalty = clamp(c.loyalty + loyaltyDelta, 0, 100);

    // Stamina regeneration
    const stamina = clamp(c.stamina + 2 * hours, 0, 100);

    return {
      ...c,
      bond,
      morale,
      loyalty,
      stamina,
      turns_together: c.turns_together + hours,
    };
  });

  return {
    ...state,
    companions,
    party_synergy: computeSynergy(companions),
  };
}

// ── Combat Bonuses ───────────────────────────────────────────────────────

export function partyCombatBonus(state: CompanionState): number {
  let bonus = 0;
  for (const c of state.companions) {
    if (c.health > 0 && c.morale > 20) {
      const roleBonus = ROLE_BONUSES[c.role].combat_bonus;
      const effectiveness = (c.loyalty / 100) * (c.morale / 100);
      bonus += roleBonus * effectiveness;
    }
  }
  return clamp(bonus + state.party_synergy * 0.1, 0, 50);
}

/** Total healing rate from healer companions per tick. */
export function partyHealRate(state: CompanionState): number {
  let rate = 0;
  for (const c of state.companions) {
    if (c.health > 0 && c.morale > 10) {
      rate += ROLE_BONUSES[c.role].heal_rate * (c.loyalty / 100);
    }
  }
  return clamp(rate, 0, 15);
}

/** Total scouting range bonus (reduces encounter surprise chance). */
export function partyScoutRange(state: CompanionState): number {
  let range = 0;
  for (const c of state.companions) {
    if (c.health > 0) {
      range += ROLE_BONUSES[c.role].scout_range;
    }
  }
  return range;
}

/** Total carry capacity bonus. */
export function partyCarryCapacity(state: CompanionState): number {
  let capacity = 0;
  for (const c of state.companions) {
    if (c.health > 0) {
      capacity += ROLE_BONUSES[c.role].carry_capacity;
    }
  }
  return capacity;
}

// ── Companion Damage ─────────────────────────────────────────────────────

export function damageCompanion(state: CompanionState, companionId: string, damage: number): CompanionState {
  const companions = state.companions.map(c =>
    c.id === companionId
      ? { ...c, health: clamp(c.health - damage, 0, 100), morale: clamp(c.morale - damage * 0.3, 0, 100) }
      : c
  );
  return { ...state, companions, party_synergy: computeSynergy(companions) };
}

/** Check if a companion deserts (loyalty < 10 AND morale < 20). */
export function checkDesertion(companion: CompanionEntry): boolean {
  return companion.loyalty < 10 && companion.morale < 20;
}

// ── Labels ───────────────────────────────────────────────────────────────

export function loyaltyLabel(loyalty: number): string {
  if (loyalty >= 80) return 'Devoted';
  if (loyalty >= 60) return 'Loyal';
  if (loyalty >= 40) return 'Reliable';
  if (loyalty >= 20) return 'Uncertain';
  return 'Disloyal';
}

export function bondLabel(bond: number): string {
  if (bond >= 80) return 'Inseparable';
  if (bond >= 60) return 'Close';
  if (bond >= 40) return 'Friendly';
  if (bond >= 20) return 'Familiar';
  return 'Strangers';
}

export function moraleLabel(morale: number): string {
  if (morale >= 80) return 'Spirited';
  if (morale >= 60) return 'Content';
  if (morale >= 40) return 'Neutral';
  if (morale >= 20) return 'Low';
  return 'Broken';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function computeSynergy(companions: CompanionEntry[]): number {
  if (companions.length <= 1) return 0;
  // Diverse roles create higher synergy
  const roles = new Set(companions.map(c => c.role));
  const diversityBonus = (roles.size / companions.length) * 50;
  const avgBond = companions.reduce((sum, c) => sum + c.bond, 0) / companions.length;
  return clamp(diversityBonus + avgBond * 0.3, 0, 100);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
