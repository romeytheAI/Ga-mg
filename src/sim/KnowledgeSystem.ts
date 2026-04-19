/**
 * KnowledgeSystem — handles information propagation, gossip, and shared facts.
 * Pure functions for the SimWorld.
 */
import { SimWorld, KnowledgeFact, FactionId } from './types';

/**
 * Propagate knowledge based on NPC proximity and shared factions.
 */
export function tickKnowledge(world: SimWorld): SimWorld {
  const k = { ...world.civilization.knowledge };
  const individualK = { ...k.individual_knowledge };
  
  // 1. Gossip Propagation
  // NPCs at the same location have a chance to share facts
  world.locations.forEach(loc => {
    const presenters = loc.npcs_present;
    if (presenters.length < 2) return;

    presenters.forEach(idA => {
      presenters.forEach(idB => {
        if (idA === idB) return;
        // Chance to share an individual fact
        const factsA = individualK[idA] || [];
        if (factsA.length > 0 && Math.random() < 0.1) {
          const randomFact = factsA[Math.floor(Math.random() * factsA.length)];
          // idB learns the fact with slightly reduced confidence
          individualK[idB] = [...(individualK[idB] || []), { ...randomFact, confidence: randomFact.confidence * 0.9, turn_acquired: world.turn }];
        }
      });
    });
  });

  return {
    ...world,
    civilization: {
      ...world.civilization,
      knowledge: {
        ...k,
        individual_knowledge: individualK
      }
    }
  };
}

/**
 * Elevate an individual fact to faction-wide knowledge.
 */
export function reportToFaction(world: SimWorld, npcId: string, factionId: FactionId, fact: KnowledgeFact): SimWorld {
  const factionK = { ...world.civilization.knowledge.faction_knowledge };
  factionK[factionId] = [...(factionK[factionId] || []), { ...fact, confidence: 1.0, turn_acquired: world.turn }];

  return {
    ...world,
    civilization: {
      ...world.civilization,
      knowledge: {
        ...world.civilization.knowledge,
        faction_knowledge: factionK
      }
    }
  };
}
