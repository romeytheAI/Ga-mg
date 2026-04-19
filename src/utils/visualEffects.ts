import { GameState } from '../types';

/**
 * Returns dynamic CSS classes for global screen effects based on player state.
 */
export function getVisualEffectClasses(state: GameState): string {
  let classes = "";
  
  const { stats, player_job } = state.player;

  // 1. Hallucination Wobble
  if (stats.hallucination > 70) {
    classes += " animate-pulse-erratic ";
  } else if (stats.hallucination > 30) {
    classes += " animate-wobble-light ";
  }

  // 2. Health Desperation (Red pulse)
  if (stats.health < 20) {
    classes += " desperation-vignette ";
  }

  // 3. Stance/Intent Overlays
  if (state.world.last_intent === 'aggressive') {
    classes += " border-red-500/20 ";
  }

  return classes.trim();
}
