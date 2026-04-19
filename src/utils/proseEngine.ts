import { GameState } from '../types';
import { getDynamicDialogue } from '../data/RegionalDialoguePool';
import { identifyNPC } from '../sim/DiscoverySystem';
import { NPCS } from '../data/npcs';

/**
 * Procedural Prose Engine (Local Fallback)
 * Provides instant, lore-accurate narrative based on state.
 */
export function generateLocalProse(state: GameState, actionText: string): string {
  const { world, player } = state;
  const loc = world.current_location;
  
  // 1. Regional Ambience
  const baseNarrative = getDynamicDialogue(loc.atmosphere || 'Riften');
  
  // 2. Action Contextualization
  let actionFeedback = "";
  if (actionText.toLowerCase().includes("observe")) {
    actionFeedback = "Your senses sharpen as you scan the environment.";
  } else if (actionText.toLowerCase().includes("wait")) {
    actionFeedback = "Time slips past as you linger in the shadows.";
  } else if (actionText.toLowerCase().includes("pray")) {
    actionFeedback = "The silence of the divine is your only companion.";
  }

  // 3. NPC Presence
  let npcInsight = "";
  const nearbyNpcs = loc.npcs || [];
  if (nearbyNpcs.length > 0) {
    const primaryNpcId = nearbyNpcs[0];
    const name = identifyNPC(state, primaryNpcId, NPCS[primaryNpcId]?.name || "a hooded figure");
    npcInsight = `You sense the watchful gaze of ${name} nearby.`;
  }

  return `${actionFeedback} ${baseNarrative} ${npcInsight}`.trim();
}
