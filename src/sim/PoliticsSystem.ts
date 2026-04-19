/**
 * PoliticsSystem — handles faction hierarchies, power struggles, and territory.
 * Pure functions for the SimWorld.
 */
import { SimWorld, FactionHierarchy, FactionId } from './types';

/**
 * Tick political relations and internal hierarchies.
 */
export function tickPolitics(world: SimWorld): SimWorld {
  const hierarchies = { ...world.faction_hierarchies };

  Object.keys(hierarchies).forEach(fid => {
    const factionId = fid as FactionId;
    const h = { ...hierarchies[factionId] };

    // 1. Leadership Check
    // If leader is dead or missing, promote a lieutenant
    if (!h.leader_id && h.lieutenants.length > 0) {
      h.leader_id = h.lieutenants[0];
      h.lieutenants = h.lieutenants.slice(1);
    }

    // 2. Power Projection
    // Factions with high power might expand territory
    const factionEntry = world.factions.find(f => f.id === factionId);
    if (factionEntry && factionEntry.power > 90 && Math.random() < 0.05) {
      // Logic for claiming adjacent location would go here
    }

    hierarchies[factionId] = h;
  });

  return { ...world, faction_hierarchies: hierarchies };
}

/**
 * Promotes an NPC within a faction hierarchy.
 */
export function promoteNpc(world: SimWorld, factionId: FactionId, npcId: string): FactionHierarchy {
  const h = { ...world.faction_hierarchies[factionId] };
  if (h.members.includes(npcId) && !h.lieutenants.includes(npcId)) {
    h.members = h.members.filter(m => m !== npcId);
    h.lieutenants.push(npcId);
    h.ranks[npcId] = "Lieutenant";
  }
  return h;
}
