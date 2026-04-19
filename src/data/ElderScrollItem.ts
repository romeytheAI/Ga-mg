/**
 * ElderScrollItem — logic for reading an Elder Scroll.
 * High-risk, ultimate knowledge mechanic.
 */
import { GameState } from '../types';

/**
 * Resolve the act of reading an Elder Scroll.
 */
export function readElderScroll(state: GameState): { newState: GameState, log: string } {
  const nextState = { ...state };
  
  // 1. Ultimate Knowledge (Discover All)
  // In a full build, this would populate discovered_locations, npcs, etc.
  
  // 2. The Price (Permanent Status Effects)
  const roll = Math.random();
  let effectLog = "";

  if (roll < 0.3) {
    // Blindness
    nextState.player.afflictions.push('permanently_blind');
    effectLog = "The stars themselves sear your retinas. The world goes black, replaced by the eternal afterimage of the prophecy.";
  } else if (roll < 0.6) {
    // Insanity
    nextState.player.stats.hallucination = 100;
    effectLog = "Your mind fractures under the weight of infinite possibility. The whispers will never stop.";
  } else {
    // Successful reading
    effectLog = "For one brief moment, you see the threads of time. The past and future are yours to command.";
  }

  return {
    newState: nextState,
    log: effectLog
  };
}
