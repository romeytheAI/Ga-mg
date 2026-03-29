import { Recipe } from '../types';
import { BASIC_ITEMS } from './items';

export const RECIPES: Record<string, Recipe> = {
  'recipe_mushroom_stew': {
    id: 'recipe_mushroom_stew',
    name: "Mushroom Stew",
    description: "A thick, earthy stew made from wild mushrooms and forest herbs simmered together. Nourishing and warming.",
    ingredients: [
      { item_id: 'wild_mushrooms', quantity: 2 },
      { item_id: 'forest_herbs', quantity: 1 },
    ],
    result: { item_id: 'mushroom_stew', quantity: 1 },
    cooking_skill_required: 5,
    time_hours: 1,
  },

  'recipe_herb_tea': {
    id: 'recipe_herb_tea',
    name: "Herb Tea",
    description: "Steep forest herbs in hot water for a calming, restorative brew.",
    ingredients: [
      { item_id: 'forest_herbs', quantity: 1 },
    ],
    result: { item_id: 'herb_tea', quantity: 1 },
    cooking_skill_required: 3,
    time_hours: 0.5,
  },

  'recipe_roasted_fish': {
    id: 'recipe_roasted_fish',
    name: "Roasted Fish",
    description: "Wrap fresh fish in wet leaves and roast slowly over firewood coals for a smoky, satisfying meal.",
    ingredients: [
      { item_id: 'fish', quantity: 1 },
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'roasted_fish', quantity: 1 },
    cooking_skill_required: 8,
    time_hours: 1,
  },

  'recipe_berry_jam': {
    id: 'recipe_berry_jam',
    name: "Berry Jam",
    description: "Mash wild berries and reduce them slowly over low heat into a sweet, thick preserve.",
    ingredients: [
      { item_id: 'wild_berries', quantity: 3 },
    ],
    result: { item_id: 'berry_jam', quantity: 1 },
    cooking_skill_required: 5,
    time_hours: 2,
  },

  'recipe_bread': {
    id: 'recipe_bread',
    name: "Freshly Baked Bread",
    description: "Simple wheat flour mixed with water, kneaded and baked over a fire into a small but filling loaf.",
    ingredients: [
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'bread', quantity: 1 },
    cooking_skill_required: 10,
    time_hours: 2,
  },

  'recipe_healing_salve': {
    id: 'recipe_healing_salve',
    name: "Healing Salve",
    description: "Grind forest herbs into a fine paste and bind with tree resin to create a thick green salve that soothes wounds.",
    ingredients: [
      { item_id: 'forest_herbs', quantity: 2 },
      { item_id: 'wild_mushrooms', quantity: 1 },
    ],
    result: { item_id: 'healing_salve', quantity: 1 },
    cooking_skill_required: 15,
    time_hours: 1,
  },

  'recipe_healing_potion': {
    id: 'recipe_healing_potion',
    name: "Healing Potion",
    description: "Further refine and distil healing salve until it becomes a concentrated liquid potion of remarkable potency.",
    ingredients: [
      { item_id: 'healing_salve', quantity: 2 },
      { item_id: 'rare_fungi', quantity: 1 },
    ],
    result: { item_id: 'healing_potion', quantity: 1 },
    cooking_skill_required: 30,
    time_hours: 3,
  },

  'recipe_venison_stew': {
    id: 'recipe_venison_stew',
    name: "Venison Stew",
    description: "A rich, slow-cooked stew of venison, herbs, and root vegetables — proper Nord fare.",
    ingredients: [
      { item_id: 'forest_herbs', quantity: 2 },
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'venison_stew', quantity: 1 },
    cooking_skill_required: 20,
    time_hours: 3,
  },

  'recipe_foraged_salad': {
    id: 'recipe_foraged_salad',
    name: "Foraged Salad",
    description: "A simple, fresh mix of wild greens, berries, and edible flowers — quick to prepare and surprisingly wholesome.",
    ingredients: [
      { item_id: 'wild_berries', quantity: 1 },
      { item_id: 'forest_herbs', quantity: 1 },
    ],
    result: { item_id: 'foraged_salad', quantity: 1 },
    cooking_skill_required: 1,
    time_hours: 0.25,
  },

  'recipe_heather_tea': {
    id: 'recipe_heather_tea',
    name: "Heather Tea",
    description: "Steep dried highland heather in boiling water. The floral infusion calms nerves and eases aching joints.",
    ingredients: [
      { item_id: 'heather', quantity: 2 },
    ],
    result: { item_id: 'herb_tea', quantity: 1 },
    cooking_skill_required: 3,
    time_hours: 0.5,
  },

  'recipe_fish_stew': {
    id: 'recipe_fish_stew',
    name: "Fish Stew",
    description: "Simmer fresh fish with foraged mushrooms in a simple broth over an open fire.",
    ingredients: [
      { item_id: 'fish', quantity: 1 },
      { item_id: 'wild_mushrooms', quantity: 1 },
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'mushroom_stew', quantity: 1 },
    cooking_skill_required: 12,
    time_hours: 1.5,
  },

  'recipe_berry_bread': {
    id: 'recipe_berry_bread',
    name: "Berry Bread",
    description: "Bake wild berries into a simple bread dough for a sweet, nutritious loaf.",
    ingredients: [
      { item_id: 'wild_berries', quantity: 2 },
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'bread', quantity: 1 },
    cooking_skill_required: 12,
    time_hours: 2,
  },

  'recipe_mushroom_toast': {
    id: 'recipe_mushroom_toast',
    name: "Mushroom Toast",
    description: "Quick and simple — slice wild mushrooms, season with herbs, and sear over hot coals on a bread slice.",
    ingredients: [
      { item_id: 'wild_mushrooms', quantity: 1 },
      { item_id: 'forest_herbs', quantity: 1 },
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'foraged_salad', quantity: 1 },
    cooking_skill_required: 6,
    time_hours: 0.5,
  },

  'recipe_herbal_poultice': {
    id: 'recipe_herbal_poultice',
    name: "Herbal Poultice",
    description: "A quick field dressing made from mashed herbs bound with a strip of cloth. Not as refined as a salve, but better than nothing.",
    ingredients: [
      { item_id: 'forest_herbs', quantity: 3 },
    ],
    result: { item_id: 'healing_salve', quantity: 1 },
    cooking_skill_required: 8,
    time_hours: 0.5,
  },

  'recipe_dried_berries': {
    id: 'recipe_dried_berries',
    name: "Dried Berry Mix",
    description: "Spread wild berries on a flat stone near the fire and dry them slowly for lightweight, long-lasting trail food.",
    ingredients: [
      { item_id: 'wild_berries', quantity: 2 },
      { item_id: 'firewood', quantity: 1 },
    ],
    result: { item_id: 'berry_jam', quantity: 1 },
    cooking_skill_required: 4,
    time_hours: 4,
  },
};

/** Recipes the player knows from the start */
export const STARTING_RECIPES: string[] = [
  'recipe_foraged_salad',
  'recipe_herb_tea',
];

/** Look up a recipe by id */
export function getRecipe(id: string): Recipe | undefined {
  return RECIPES[id];
}

/** Check if a player inventory satisfies a recipe's ingredients */
export function canCookRecipe(
  recipe: Recipe,
  inventory: { id: string; quantity?: number }[],
): boolean {
  for (const req of recipe.ingredients) {
    const held = inventory.filter(i => i.id === req.item_id).length;
    if (held < req.quantity) return false;
  }
  return true;
}

/** Build result item from BASIC_ITEMS catalogue */
export function buildResultItem(itemId: string) {
  const base = (BASIC_ITEMS as Record<string, any>)[itemId];
  if (!base) return null;
  return {
    ...base,
    id: `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  };
}
