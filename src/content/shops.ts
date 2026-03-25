import { items } from './items';
import { ShopItem } from '../components/ShopUI';

export const shops: Record<string, { name: string, items: ShopItem[] }> = {
  arrilles_tradehouse: {
    name: "Arrille's Tradehouse Wares",
    items: [
      { itemFactory: items.bread, price: 2 },
      { itemFactory: items.saltrice_porridge, price: 5 },
      { itemFactory: items.skooma, price: 100 },
      { itemFactory: items.common_shirt, price: 15 },
      { itemFactory: items.common_pants, price: 15 }
    ]
  }
};
