/**
 * World Event Engine
 * 
 * Manages triggering and applying effects of Elder Scrolls world events.
 */
import { GameState } from '../types';
import { ES_WORLD_EVENTS, WorldEvent } from '../data/esEvents';

/**
 * Check for newly triggered world events based on current game state.
 */
export function checkForNewEvents(state: GameState): WorldEvent[] {
  return ES_WORLD_EVENTS.filter(event => {
    // Skip if already active
    if (state.world.active_world_events.includes(event.id)) return false;

    // Check triggers (basic implementation)
    return event.triggers.some(trigger => {
      try {
        // Simple string eval for basic triggers
        if (trigger.includes('world.day % 30 === 0')) return state.world.day % 30 === 0;
        if (trigger.includes('world.day % 45 === 0')) return state.world.day % 45 === 0;
        if (trigger.includes('world.day % 60 === 0')) return state.world.day % 60 === 0;
        if (trigger.includes('world.day % 100 === 0')) return state.world.day % 100 === 0;
        if (trigger.includes('player.level >= 10')) return state.player.level >= 10;
        return false;
      } catch (e) {
        return false;
      }
    });
  });
}

/**
 * Apply permanent world state changes for an active event.
 */
export function applyEventWorldState(state: GameState, eventId: string): Record<string, any> {
  const event = ES_WORLD_EVENTS.find(e => e.id === eventId);
  if (!event) return {};
  return { ...event.world_state_changes };
}
