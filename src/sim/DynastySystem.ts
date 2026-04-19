/**
 * DynastySystem — handles aging, succession, and the locket of possession.
 * Pure logic for the multi-generational simulation core.
 */
import { GameState } from '../types';
import { SimNpc } from './types';

/**
 * Handle character transition upon death or retirement.
 * Returns the state as the new 'controlled' character.
 */
export function resolveSuccession(state: GameState, targetNpcId?: string): GameState {
  const d = state.player.dynasty;
  
  // 1. Identify the Heir
  let heirId = targetNpcId;
  if (!heirId) {
    if (d.succession_law === 'primogeniture') {
      heirId = d.lineage.find(l => l.relationship === 'child' && l.status === 'alive')?.id;
    } else if (d.is_locket_possessed) {
      // In locket mode, any mind can be taken
      heirId = d.lineage[0]?.id; // Placeholder logic
    }
  }

  if (!heirId) {
    console.log("GAME OVER: No heir found.");
    return state;
  }

  // 2. Transition State (The "Mantle" shift)
  const nextState = { ...state };
  
  // Carry over prestige and locket state
  nextState.player.dynasty.prestige += 100;
  
  // Note: Full character reset would normally happen here,
  // mapping the target NPC's stats/cosmetics to the player object.
  
  return nextState;
}

/**
 * Tick aging consequences.
 */
export function tickAging(state: GameState, hours: number): number {
  const currentAgeDays = state.player.age_days;
  const nextAgeDays = currentAgeDays + (hours / 24);
  
  // Check for physical decay milestones
  const ageYears = Math.floor(nextAgeDays / 365);
  
  if (ageYears > 60 && Math.random() < 0.001) {
    // Chance of chronic pain or stamina reduction
  }

  return nextAgeDays;
}

/**
 * Apply socioeconomic starting modifiers.
 */
export function applyBackground(state: GameState): GameState {
  const nextState = { ...state };
  const soc = state.player.origin_config.socioeconomic;

  switch (soc) {
    case 'noble':
      nextState.player.gold += 500;
      nextState.player.fame += 50;
      break;
    case 'destitute':
      nextState.player.gold = 0;
      nextState.player.stats.health -= 10;
      break;
  }

  return nextState;
}
