/**
 * CraftingSystem — high-fidelity enchanting and production logic.
 * Pure logic for the production simulation core.
 */
import { GameState, Item } from '../types';

/**
 * Enchant an item using a filled soul gem.
 */
export function enchantItem(
  state: GameState, 
  itemId: string, 
  soulGemId: string, 
  effectType: 'fortify_health' | 'fortify_stamina' | 'magicka_regen' | 'allure_boost'
): { success: boolean, newState: GameState, log: string } {
  const inventory = [...state.player.inventory];
  const itemIdx = inventory.findIndex(i => i.id === itemId);
  
  const arcane = { ...state.player.arcane };
  const gemIdx = arcane.soul_gems.findIndex(g => g.id === soulGemId && g.filled);

  if (itemIdx === -1) return { success: false, newState: state, log: "Item not found in inventory." };
  if (gemIdx === -1) return { success: false, newState: state, log: "No filled soul gem found." };

  const item = { ...inventory[itemIdx] };
  const gem = arcane.soul_gems[gemIdx];

  // 1. Calculate Magnitude based on gem size and skill
  const sizeMults: Record<string, number> = { petty: 1, lesser: 2, common: 3, greater: 5, grand: 8, black: 10 };
  const basePower = sizeMults[gem.size] || 1;
  const skillBonus = state.player.skills.lore_mastery / 20;
  const magnitude = Math.round(basePower * (1 + skillBonus));

  // 2. Apply Effect
  item.name = `${effectType.replace('_', ' ')} ${item.name}`;
  item.description += ` | Magnitude: ${magnitude}`;
  
  if (!item.stats) item.stats = {};
  switch (effectType) {
    case 'fortify_health': item.stats.health = (item.stats.health || 0) + magnitude; break;
    case 'fortify_stamina': item.stats.stamina = (item.stats.stamina || 0) + magnitude; break;
    case 'magicka_regen': item.special_effect = "Regenerates Magicka faster."; break;
    case 'allure_boost': item.stats.allure = (item.stats.allure || 0) + magnitude; break;
  }

  // 3. Consume Gem
  arcane.soul_gems.splice(gemIdx, 1);
  inventory[itemIdx] = item;

  const nextState = {
    ...state,
    player: {
      ...state.player,
      inventory,
      arcane
    }
  };

  return { success: true, newState: nextState, log: `You bind the ${gem.soul_type} soul into the ${item.name}.` };
}

/**
 * Standard crafting logic.
 */
export function craftItem(state: GameState, recipeId: string): { success: boolean, newState: GameState, log: string } {
  const newItem: Item = {
    id: `crafted_${Date.now()}`,
    name: "Crafted Alchemical Tonic",
    type: 'consumable',
    rarity: 'common',
    description: "A precisely blended restorative brew.",
    value: 15,
    weight: 0.1,
    is_equipped: false,
    buc_status: 'uncursed',
    identification: 'identified'
  };

  return {
    success: true,
    newState: {
      ...state,
      player: {
        ...state.player,
        inventory: [...state.player.inventory, newItem]
      }
    },
    log: `You successfully brewed: ${newItem.name}`
  };
}
