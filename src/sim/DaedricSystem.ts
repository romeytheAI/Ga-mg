/**
 * DaedricSystem — procedural divine power, intent, and reality warping.
 * Pure functions for the SimWorld.
 */
import { SimWorld, DaedricInfluence, DaedricPrinceId, DaedricRealm } from './types';

/**
 * Tick the Daedric influence and realm stability.
 */
export function tickDaedricPower(world: SimWorld): SimWorld {
  const civ = { ...world.civilization };
  const nextInfluence = { ...civ.daedric_influence };
  const nextRealms = civ.realms.map(r => ({ ...r }));

  Object.keys(nextInfluence).forEach(pid => {
    const princeId = pid as DaedricPrinceId;
    const influence = { ...nextInfluence[princeId] };

    // 1. Power Scaling Logic
    // Power grows based on worship and active curses
    const growth = (influence.worship_base * 0.01) + (influence.active_curses.length * 0.5);
    influence.power_level = Math.min(100, influence.power_level + growth);

    // 2. The "Procedural Cough" Effect (Peak Power)
    // If power is near 100, the Prince's intent causes dimension-wide emergent events
    if (influence.power_level > 90 && Math.random() < 0.1) {
      applyGodlikeWill(world, influence);
    }

    nextInfluence[princeId] = influence;
  });

  // 3. Realm Physics Stability
  nextRealms.forEach(realm => {
    const owner = nextInfluence[realm.prince_id];
    // High power maintains stability, but chaotic intent might warp it
    if (owner.current_intent === 'destruction') {
      realm.physics_stability = Math.max(10, realm.physics_stability - 1);
    } else {
      realm.physics_stability = Math.min(100, realm.physics_stability + 0.5);
    }
  });

  return {
    ...world,
    civilization: {
      ...civ,
      daedric_influence: nextInfluence,
      realms: nextRealms
    }
  };
}

/**
 * Emergent effects based on absolute divine intent.
 * This is the "Full Civilization" system scaling to godhood.
 */
function applyGodlikeWill(world: SimWorld, influence: DaedricInfluence) {
  const { current_intent, prince_id } = influence;
  
  console.log(`[DAEDRIC] ${prince_id} exerts godlike will with intent: ${current_intent}`);

  switch (current_intent) {
    case 'domination':
      // Accidentally trigger a revolution across a whole dimension
      // In code: mass loyalty flip or government destabilisation
      world.civilization.governments.forEach(gov => {
        gov.stability = Math.max(0, gov.stability - 30);
        gov.corruption_level = Math.min(100, gov.corruption_level + 20);
      });
      world.global_events.push(`${prince_id.toUpperCase()} has sparked a wave of defiance across the world.`);
      break;

    case 'destruction':
      // Mass decay of trade routes and infrastructure
      world.civilization.supply_chains.routes.forEach(route => {
        route.efficiency *= 0.5;
      });
      world.global_events.push(`The sky bleeds as ${prince_id} touches the foundations of reality.`);
      break;

    case 'corruption':
      // Information/Knowledge poisoning
      const k = world.civilization.knowledge;
      Object.keys(k.individual_knowledge).forEach(id => {
        k.individual_knowledge[id] = k.individual_knowledge[id].map(fact => ({
          ...fact,
          confidence: fact.confidence * 0.5 // Mass doubt/confusion
        }));
      });
      break;
      
    case 'revelry':
      // Economic boom but productivity collapse
      world.civilization.governments.forEach(gov => {
        gov.treasury += 1000;
        gov.stability *= 0.8;
      });
      break;
  }
}

/**
 * Helper to check if a location is currently under Daedric bleed-over.
 */
export function getDaedricBleed(world: SimWorld, locationId: string): DaedricRealm | undefined {
  return world.civilization.realms.find(r => r.connected_locations.includes(locationId));
}
