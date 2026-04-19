/**
 * DiscoverySystem — handles player knowledge, ignorance, and identification.
 * Ensures character only knows what they have encountered or been taught.
 */
import { GameState, Item } from '../types';

/**
 * Filter an item's display name based on player knowledge and roguelike ID status.
 */
export function identifyItem(state: GameState, item: Item): string {
  const idStatus = item.identification || 'unidentified';
  const bucStatus = item.buc_status || 'uncursed';

  if (idStatus === 'identified' || state.player.knowledge.discovered_items.includes(item.id)) {
    const bucPrefix = idStatus === 'identified' ? `[${bucStatus.toUpperCase()}] ` : "";
    return `${bucPrefix}${item.name}`;
  }
  
  if (idStatus === 'familiar') {
    return `Strange ${item.type}`;
  }

  return "Unknown Item";
}

/**
 * Filter a location's display name based on player knowledge.
 */
export function identifyLocation(state: GameState, locationId: string, originalName: string): string {
  if (state.player.knowledge.discovered_locations.includes(locationId)) {
    return originalName;
  }
  return "Uncharted Territory";
}

/**
 * Filter an NPC's display name based on player knowledge.
 */
export function identifyNPC(state: GameState, npcId: string, originalName: string): string {
  if (state.player.knowledge.discovered_npcs.includes(npcId)) {
    return originalName;
  }
  return "Stranger";
}

/**
 * Filters narrative text based on the character's ignorance.
 * If sexual_awareness is low, complex or lewd acts are replaced with innocent confusion.
 */
export function filterNarrativeByIgnorance(state: GameState, text: string): string {
  const awareness = state.player.knowledge.sexual_awareness;
  
  if (awareness >= 50) return text; // Fully aware

  // Procedural masking for low awareness
  let filtered = text;
  const masks: Record<string, string> = {
    'orgasm': 'strange overwhelming feeling',
    'sex': 'wrestling or playing',
    'lust': 'funny stomach ache',
    'seduction': 'being very friendly',
    'rape': 'mean person trying to grab you',
    'prostitution': 'helping strangers for gold',
  };

  if (awareness < 10) {
    Object.entries(masks).forEach(([word, mask]) => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, mask);
    });
  }

  return filtered;
}

/**
 * Process a "Forceful Exposure" to a concept or entity.
 * If intensity is high (e.g. 50+), ignorance is shattered instantly.
 * If intensity is low, awareness grows slowly.
 */
export function processExposure(state: GameState, intensity: number): GameState {
  const currentAwareness = state.player.knowledge.sexual_awareness;
  
  // If intensity is very high (trauma or force), shatter ignorance
  let gain = intensity * 0.5;
  if (intensity > 60) {
    gain += 20; // Shatter bonus
  }

  return gainAwareness(state, gain);
}

/**
 * Learn about a cultural taboo or increase sexual awareness.
 */
export function gainAwareness(state: GameState, amount: number, tabooId?: string): GameState {
  const k = { ...state.player.knowledge };
  k.sexual_awareness = Math.min(100, k.sexual_awareness + amount);
  
  if (tabooId && !k.discovered_taboos.includes(tabooId)) {
    k.discovered_taboos = [...k.discovered_taboos, tabooId];
  }

  return {
    ...state,
    player: {
      ...state.player,
      knowledge: k
    }
  };
}

/**
 * Mark an entity as discovered.
 */
export function discoverEntity(state: GameState, type: 'location' | 'item' | 'npc' | 'lore' | 'spell', id: string): GameState {
  const k = { ...state.player.knowledge };
  
  switch (type) {
    case 'location':
      if (!k.discovered_locations.includes(id)) k.discovered_locations = [...k.discovered_locations, id];
      break;
    case 'item':
      if (!k.discovered_items.includes(id)) k.discovered_items = [...k.discovered_items, id];
      break;
    case 'npc':
      if (!k.discovered_npcs.includes(id)) k.discovered_npcs = [...k.discovered_npcs, id];
      break;
    case 'lore':
      if (!k.discovered_lore.includes(id)) k.discovered_lore = [...k.discovered_lore, id];
      break;
    case 'spell':
      if (!k.unlocked_spells.includes(id)) k.unlocked_spells = [...k.unlocked_spells, id];
      break;
  }

  return {
    ...state,
    player: {
      ...state.player,
      knowledge: k
    }
  };
}
