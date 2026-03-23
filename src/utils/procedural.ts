import { Item } from '../types';

const ITEM_PREFIXES = ["Torn", "Soiled", "Fine", "Silken", "Blessed", "Cursed", "Gilded", "Sturdy", "Fragile", "Mystic", "Seductive", "Revealing"];
const ITEM_SUFFIXES = ["of the Maiden", "of the Harlot", "of Agony", "of Grace", "of the Wastes", "of the Goddess", "of the Demon", "of the Thief"];

export function generateProceduralItem(level: number, type?: Item['type']): Item {
  const types: Item['type'][] = ['weapon', 'armor', 'consumable', 'misc', 'clothing'];
  const selectedType = type || types[Math.floor(Math.random() * types.length)];
  const rarityRoll = Math.random() * 100;
  let rarity: Item['rarity'] = 'common';
  if (rarityRoll > 99) rarity = 'mythic';
  else if (rarityRoll > 95) rarity = 'legendary';
  else if (rarityRoll > 85) rarity = 'epic';
  else if (rarityRoll > 70) rarity = 'rare';
  else if (rarityRoll > 40) rarity = 'uncommon';

  const prefix = ITEM_PREFIXES[Math.floor(Math.random() * ITEM_PREFIXES.length)];
  const suffix = ITEM_SUFFIXES[Math.floor(Math.random() * ITEM_SUFFIXES.length)];
  
  let name = "";
  let slot: Item['slot'];
  
  if (selectedType === 'clothing') {
    const slots: Item['slot'][] = ['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'];
    slot = slots[Math.floor(Math.random() * slots.length)];
    const clothingNames = {
      head: "Hood", neck: "Choker", shoulders: "Shawl", chest: "Corset", 
      underwear: "Panties", legs: "Stockings", feet: "Heels", hands: "Gloves", waist: "Garter"
    };
    name = `${prefix} ${clothingNames[slot!]} ${suffix}`;
  } else if (selectedType === 'weapon') {
    const weapons = ["Dagger", "Whip", "Crop", "Staff", "Shiv"];
    name = `${prefix} ${weapons[Math.floor(Math.random() * weapons.length)]} ${suffix}`;
  } else if (selectedType === 'consumable') {
    const consumables = ["Potion", "Elixir", "Wine", "Bread", "Apple"];
    name = `${prefix} ${consumables[Math.floor(Math.random() * consumables.length)]}`;
  } else {
    name = `${prefix} Trinket ${suffix}`;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    type: selectedType,
    slot,
    rarity,
    description: `A ${rarity} ${selectedType} found in the world.`,
    value: Math.floor(level * 10 * (rarityRoll / 10)),
    weight: Math.random() * 5,
    integrity: 100,
    max_integrity: 100,
    stats: {
      allure: rarity === 'mythic' || rarity === 'legendary' ? 20 : (rarity === 'epic' ? 10 : 0),
      health: rarity === 'legendary' ? 50 : 0,
      lust: rarity === 'mythic' ? 15 : 0
    }
  };
}
