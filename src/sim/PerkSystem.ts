/**
 * PerkSystem — handles SPECIAL attributes, perks, and mutations.
 * Fallout NV and CDDA inspired high-fidelity progression.
 */
import { GameState } from '../types';

export interface PerkDefinition {
  id: string;
  name: string;
  description: string;
  requirements: (state: GameState) => boolean;
  onAcquire: (state: GameState) => GameState;
}

export const PERK_REGISTRY: PerkDefinition[] = [
  {
    id: 'educated',
    name: 'Educated',
    description: 'You gain more skill points when studying or observing.',
    requirements: (s) => s.player.attributes.intelligence >= 4 && s.player.level >= 2,
    onAcquire: (s) => s // Handled in logic
  },
  {
    id: 'toughness',
    name: 'Toughness',
    description: 'Permanent +10 to Health and Stamina.',
    requirements: (s) => s.player.attributes.endurance >= 6,
    onAcquire: (s) => {
      const next = { ...s };
      next.player.stats.max_health += 10;
      next.player.stats.max_stamina += 10;
      return next;
    }
  },
  {
    id: 'animal_friend',
    name: 'Animal Friend',
    description: 'Hostile animals are less likely to attack.',
    requirements: (s) => s.player.attributes.charisma >= 6 && s.player.skills.foraging > 20,
    onAcquire: (s) => s
  }
];

/**
 * Handle XP gain and level up check.
 */
export function gainXP(state: GameState, amount: number): { newState: GameState, leveledUp: boolean } {
  const p = { ...state.player };
  p.xp += amount;
  let leveledUp = false;

  if (p.xp >= p.xp_to_next_level) {
    p.level += 1;
    p.perk_points += 1;
    p.xp -= p.xp_to_next_level;
    p.xp_to_next_level = Math.round(p.xp_to_next_level * 1.5);
    leveledUp = true;
  }

  return { newState: { ...state, player: p }, leveledUp };
}

/**
 * Calculate derived stats from attributes.
 */
export function getDerivedStats(state: GameState) {
  const attr = state.player.attributes;
  return {
    carry_weight: 50 + (attr.strength * 10),
    crit_chance: attr.luck * 2,
    xp_mult: 1 + (attr.intelligence * 0.05),
    stamina_regen: attr.endurance * 0.5
  };
}
