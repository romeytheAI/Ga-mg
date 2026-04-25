/**
 * LocationSystem — DoL-style NPC movement between locations.
 * NPCs travel between locations based on schedules and needs.
 * Location danger determines encounter probability.
 * Pure functions; no side effects, no UI imports.
 */
import { SimNpc, SimWorld, SimLocation } from './types';
import { scheduledLocation } from './TimeSystem';

// ── Movement constants ──────────────────────────────────────────────────────
const BASE_TRAVEL_HOURS = 1; // base time to travel between adjacent locations

/**
 * Determine if an NPC should start travelling to a new location.
 * Returns the target location id, or null if no movement needed.
 */
export function shouldTravel(npc: SimNpc, world: SimWorld): string | null {
  // Already travelling
  if (npc.current_state === 'travelling') return null;

  // Check scheduled location for this hour
  const targetLocId = scheduledLocation(npc.schedule, world.hour);
  if (targetLocId !== npc.location_id) {
    // Verify location exists
    const targetLoc = world.locations.find(l => l.id === targetLocId);
    if (targetLoc) return targetLocId;
  }

  return null;
}

/**
 * Start an NPC travelling to a target location.
 * Returns updated NPC with travelling state set.
 */
export function startTravel(npc: SimNpc, targetLocationId: string): SimNpc {
  return {
    ...npc,
    current_state: 'travelling',
    target_location_id: targetLocationId,
  };
}

/**
 * Complete travel: move NPC to their target location.
 * Returns updated NPC and world (updates location npcs_present).
 */
export function completeTravel(npc: SimNpc, world: SimWorld): { npc: SimNpc; world: SimWorld } {
  if (!npc.target_location_id) {
    return { npc, world };
  }

  const oldLocId = npc.location_id;
  const newLocId = npc.target_location_id;

  // Update NPC
  const updatedNpc: SimNpc = {
    ...npc,
    location_id: newLocId,
    target_location_id: null,
    current_state: 'idle',
  };

  // Update location NPC lists
  const updatedLocations = world.locations.map(loc => {
    if (loc.id === oldLocId) {
      return { ...loc, npcs_present: loc.npcs_present.filter(id => id !== npc.id) };
    }
    if (loc.id === newLocId) {
      return { ...loc, npcs_present: [...loc.npcs_present, npc.id] };
    }
    return loc;
  });

  return {
    npc: updatedNpc,
    world: { ...world, locations: updatedLocations },
  };
}

/**
 * Calculate encounter chance based on location danger, time, and NPC fame.
 * Returns probability 0-1 of an encounter occurring.
 */
export function encounterChance(
  location: SimLocation,
  hour: number,
  fame_infamy: number
): number {
  let chance = location.danger;

  // Night multiplier: more dangerous at night
  if (hour >= 21 || hour < 5) {
    chance *= 1.5;
  }

  // Fame/infamy increases encounter chance (more well-known = more targeted)
  chance += (fame_infamy / 100) * 0.15;

  return Math.min(1, Math.max(0, chance));
}

/**
 * Check if a random encounter triggers for an NPC at their location.
 * Returns true if an encounter should be started.
 */
export function checkForEncounter(npc: SimNpc, world: SimWorld): boolean {
  const location = world.locations.find(l => l.id === npc.location_id);
  if (!location) return false;

  // No encounters while sleeping or at home
  if (npc.current_state === 'sleeping') return false;
  if (location.type === 'home') return false;

  const chance = encounterChance(location, world.hour, npc.fame.infamy);
  return Math.random() < chance * 0.1; // scale down per-tick
}

/**
 * Get NPCs present at a specific location.
 */
export function getNpcsAtLocation(world: SimWorld, locationId: string): SimNpc[] {
  return world.npcs.filter(npc => npc.location_id === locationId);
}

/**
 * Find the nearest location of a given type from an NPC's current position.
 */
export function findNearestLocation(
  world: SimWorld,
  fromLocationId: string,
  targetType: SimLocation['type']
): SimLocation | null {
  const from = world.locations.find(l => l.id === fromLocationId);
  if (!from) return null;

  let nearest: SimLocation | null = null;
  let nearestDist = Infinity;

  for (const loc of world.locations) {
    if (loc.type !== targetType || loc.id === fromLocationId) continue;
    const dist = Math.sqrt((loc.x - from.x) ** 2 + (loc.y - from.y) ** 2);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = loc;
    }
  }

  return nearest;
}

/** Get travel time in hours between two locations. */
export function travelTime(from: SimLocation, to: SimLocation): number {
  const dist = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  // Normalize: 100 units max distance ≈ 3 hours max travel
  return Math.max(BASE_TRAVEL_HOURS, Math.round(dist / 35));
}

/** Get a label for location safety. */
export function dangerLabel(danger: number): string {
  if (danger >= 0.8) return 'Extremely Dangerous';
  if (danger >= 0.6) return 'Dangerous';
  if (danger >= 0.4) return 'Risky';
  if (danger >= 0.2) return 'Somewhat Safe';
  return 'Safe';
}
