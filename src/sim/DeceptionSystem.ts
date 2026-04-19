/**
 * DeceptionSystem — handles lying, detection, and social correction.
 * Pure logic for the social simulation core.
 */
import { SimWorld, ActiveDeception, SimNpc, FactionId } from './types';
import { GameState } from '../types';

/**
 * Tick deceptions to check for accidental or social discovery.
 */
export function tickDeceptions(world: SimWorld): { world: SimWorld, corrections: string[] } {
  const deceptions = [...world.civilization.active_deceptions];
  const logs: string[] = [];
  
  // 1. Social Correction Loop
  // If the target is at a location with an NPC who knows the truth
  const survivors: ActiveDeception[] = [];

  deceptions.forEach(lie => {
    let corrected = false;
    
    // Check if third parties at the same location reveal the truth
    const loc = world.locations.find(l => l.npcs_present.includes(lie.target_id) || lie.target_id === 'player');
    if (loc) {
      loc.npcs_present.forEach(npcId => {
        if (npcId === lie.source_id) return;
        
        const npc = world.npcs.find(n => n.id === npcId);
        if (!npc) return;

        // Social factors: If NPC likes the player and knows the lie leveraged ignorance
        const knowsTruth = true; // Placeholder for knowledge check
        const likesTarget = true; // Placeholder for relationship check
        
        if (knowsTruth && likesTarget && Math.random() < 0.3) {
          logs.push(`${npc.name} overhears and corrects the lie: "${lie.lied_fact}" is actually "${lie.subject_fact}".`);
          corrected = true;
        }
      });
    }

    if (!corrected) survivors.push(lie);
  });

  return {
    world: {
      ...world,
      civilization: {
        ...world.civilization,
        active_deceptions: survivors
      }
    },
    corrections: logs
  };
}

/**
 * Player attempts to lie to an NPC.
 */
export function playerLie(state: GameState, npcId: string, truth: string, lie: string): ActiveDeception {
  const skulduggery = state.player.skills.skulduggery;
  return {
    id: `lie_${Date.now()}`,
    source_id: 'player',
    target_id: npcId,
    subject_fact: truth,
    lied_fact: lie,
    leveraged_ignorance: 'none',
    detection_threshold: 100 - skulduggery, // higher skill = lower chance to be caught
    turn_started: state.world.turn_count
  };
}
