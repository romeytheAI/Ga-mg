/**
 * ClothingDestructionSystem — handles high-fidelity degradation and staining.
 * Pure logic for the visual simulation core.
 */
import { GameState } from '../types';
import { ClothingDamage, ClothingSlot } from './types';

/**
 * Apply damage and stains to clothing based on events.
 */
export function damageClothing(state: GameState, slot: ClothingSlot, amount: number, stain?: 'blood' | 'semen' | 'mud' | 'sweat'): ClothingDamage[] {
  const currentDamage = [...state.player.clothing_damage];
  let entry = currentDamage.find(d => d.slot === slot);

  if (!entry) {
    const newEntry: ClothingDamage = {
      slot,
      tear_size: 0,
      stains: [],
      repair_difficulty: 10
    };
    currentDamage.push(newEntry);
    entry = newEntry;
  }

  if (entry) {
    entry.tear_size = Math.min(100, entry.tear_size + amount);
    if (stain && !entry.stains.includes(stain)) {
      entry.stains.push(stain);
      entry.repair_difficulty += 5;
    }
  }

  return currentDamage;
}

/**
 * Tick passive staining (e.g. sweat from activity).
 */
export function tickClothingVisuals(state: GameState, hours: number): ClothingDamage[] {
  const currentDamage = [...state.player.clothing_damage];
  const intent = state.world.last_intent;
  
  if (intent === 'work' && hours > 1) {
    return damageClothing(state, 'chest', 0, 'sweat');
  }

  return currentDamage;
}
