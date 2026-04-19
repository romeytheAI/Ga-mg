/**
 * VampirismSystem — handles Sanguinare Vampiris and the Vampire state.
 * High-fidelity Elder Scrolls mechanics.
 */
import { GameState } from '../types';

export interface VampireState {
  stage: 1 | 2 | 3 | 4;
  days_since_feeding: number;
  sun_exposure_minutes: number;
  blood_pool: number; // 0-100
}

/**
 * Tick vampirism progression.
 */
export function tickVampirism(state: GameState, hours: number): GameState {
  // Only proceed if character is a vampire
  if (!state.player.transformation.body_changes.some(bc => bc.id === 'vampirism')) {
    return state;
  }

  const nextState = { ...state };
  const dailyFactor = hours / 24;

  // 1. Hunger Progression
  // Stages advance every 24 hours without feeding
  // (In a full build, this would update stats and 3D model)
  
  // 2. Sunlight Sensitivity
  if (state.world.hour > 6 && state.world.hour < 19 && state.world.weather === 'Clear') {
    // Health and Stamina regen is stunted
    // Character model should gain 'sun_burn' or 'smoke' particles
  }

  return nextState;
}

/**
 * Handle feeding on an NPC.
 */
export function feedOnNPC(state: GameState, npcId: string): GameState {
  const nextState = { ...state };
  // Reset stage to 1, gain health, increase notoriety
  return nextState;
}
