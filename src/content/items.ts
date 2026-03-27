import { InventoryItem, GameActionState } from '../store/gameStore';

export const items = {
  // Consumables
  bread: (): InventoryItem => ({
    id: 'bread_' + Date.now(),
    name: 'Loaf of Bread',
    description: 'A stale but filling loaf of bread. Restores 20 Health and 50 Fatigue.',
    type: 'consumable',
    effect: (game: GameActionState) => {
      game.modifyStat('health', 20);
      game.modifyStat('fatigue', 50);
    }
  }),
  saltrice_porridge: (): InventoryItem => ({
    id: 'porridge_' + Date.now(),
    name: 'Saltrice Porridge',
    description: 'Warm and comforting. Reduces Stress by 200, restores 30 Fatigue.',
    type: 'consumable',
    effect: (game: GameActionState) => {
      game.modifyStat('stress', -200);
      game.modifyStat('fatigue', 30);
    }
  }),
  skooma: (): InventoryItem => ({
    id: 'skooma_' + Date.now(),
    name: 'Bottle of Skooma',
    description: 'A highly illegal, highly addictive narcotic. Restores all Fatigue immediately, but increases Hallucination and Arousal massively.',
    type: 'consumable',
    effect: (game: GameActionState) => {
      game.setStat('fatigue', game.stats.maxFatigue);
      game.modifyStat('hallucination', 5000);
      game.modifyStat('arousal', 3000);
      game.addLog("You feel intensely energetic, but the world is starting to spin.", 'bad');
    }
  }),

  // Clothing
  common_shirt: (): InventoryItem => ({
    id: 'common_shirt_' + Date.now(),
    name: 'Common Shirt',
    description: 'A basic linen shirt.',
    type: 'clothing',
    clothingData: {
      id: 'common_shirt',
      name: 'Common Shirt',
      layer: 'upper',
      maxIntegrity: 100,
      exposure: 0,
      description: 'A basic linen shirt.'
    }
  }),
  common_pants: (): InventoryItem => ({
    id: 'common_pants_' + Date.now(),
    name: 'Common Pants',
    description: 'Sturdy brown trousers.',
    type: 'clothing',
    clothingData: {
      id: 'common_pants',
      name: 'Common Pants',
      layer: 'lower',
      maxIntegrity: 100,
      exposure: 0,
      description: 'Sturdy brown trousers.'
    }
  })
};
