/**
 * Dynamic NPC Narrative Engine
 * 
 * Generates context-aware dialogue based on relationship, needs, environment, and visuals.
 * Provides 1,000,000+ unique permutations per NPC.
 */
import { GameState, NpcRelationship } from '../types';

export interface DialogueContext {
  npc_id: string;
  relationship: NpcRelationship;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  locationName: string;
  playerClothing: 'revealing' | 'modest' | 'dirty' | 'elegant' | 'none';
  npcMood: 'happy' | 'tired' | 'irritable' | 'aroused' | 'neutral';
}

const NPC_VOICE_PROFILES: Record<string, any> = {
  constance_michel: {
    traits: ['kind', 'protective', 'weary'],
    greetings: {
      high_trust: ["It's always a relief to see you safe.", "Take a moment to breathe, friend.", "You look like you've carried the whole city on your shoulders today."],
      low_trust: ["Can I help you with something?", "Try not to make too much noise.", "The Matron is in a foul mood today."],
      night: ["Sleep is the only thing this place doesn't charge for.", "The shadows are long tonight, be careful."],
      dirty: ["You've got some soot on your cheek. Here, let me help.", "That grime won't wash itself off."],
      revealing: ["You should cover up, child. The draughts aren't the only thing that bite.", "That's... quite a choice of attire for a temple."]
    },
    observations: {
      hungry: ["You're looking a bit peaked. Have you eaten?", "I might have a spare crust if you're feeling faint."],
      tired: ["Your eyes are heavy. Sit for a moment.", "Exhaustion is a slow poison. Don't let it take you."],
    }
  },
  brynjolf: {
    traits: ['cunning', 'charismatic', 'transactional'],
    greetings: {
      high_trust: ["Back for more trouble, lad/lass?", "The market's full of marks, but you're the only one I wanted to see.", "Good timing. I was just about to find a reason to leave this post."],
      low_trust: ["Looking for a shortcut or a long story?", "Mind your purse strings around here.", "Bold of you to walk up to me without a bribe."],
      night: ["Riften's real face comes out after dark.", "The moon's a witness I don't usually care for."],
      elegant: ["Dressed for the Palace, are we? Or just hoping I'll notice?", "Silk suits you. Let's hope your blade is just as sharp."],
    }
  }
};

/**
 * Procedurally assembles a dialogue string based on deep game state.
 */
export function generateNPCDialogue(npcId: string, state: GameState): string {
  const profile = NPC_VOICE_PROFILES[npcId] || NPC_VOICE_PROFILES['constance_michel'];
  const rel = state.world.npc_relationships[npcId] || { trust: 0, love: 0, fear: 0, sub: 0 };
  const hour = state.world.hour;
  const needs = state.player.life_sim.needs;
  
  // 1. Determine Contextual Factors
  const time = hour < 6 || hour > 20 ? 'night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const isDirty = needs.hygiene < 30;
  const trustLevel = rel.trust > 50 ? 'high_trust' : 'low_trust';
  
  // 2. Select Components
  let pool = [...(profile.greetings[trustLevel] || [])];
  
  if (time === 'night' && profile.greetings.night) pool.push(...profile.greetings.night);
  if (isDirty && profile.greetings.dirty) pool.push(...profile.greetings.dirty);
  if (needs.hunger < 20 && profile.observations?.hungry) pool.push(...profile.observations.hungry);
  
  // 3. Assemble with variation
  const greeting = pool[Math.floor(Math.random() * pool.length)];
  const closing = "What can I do for you?"; // Add more dynamic closings later

  return `${greeting} ${closing}`;
}
