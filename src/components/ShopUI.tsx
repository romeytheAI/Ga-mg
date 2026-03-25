import React from 'react';
import { useGameStore, InventoryItem } from '../store/gameStore';

export type ShopItem = {
  itemFactory: () => InventoryItem;
  price: number;
};

interface ShopUIProps {
  shopName: string;
  items: ShopItem[];
  onClose: () => void;
}

export const ShopUI: React.FC<ShopUIProps> = ({ shopName, items, onClose }) => {
  const { stats, modifyStat, addItem, addLog } = useGameStore();

  const handleBuy = (itemDef: ShopItem) => {
    if (stats.septims >= itemDef.price) {
      modifyStat('septims', -itemDef.price);
      const newItem = itemDef.itemFactory();
      addItem(newItem);
      addLog(`You bought ${newItem.name} for ${itemDef.price} septims.`, 'good');
    } else {
      addLog("You don't have enough septims for that.", 'bad');
    }
  };

  return (
    <div className="bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 p-6 rounded shadow-lg max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-6 border-b border-stone-300 dark:border-stone-700 pb-2">
        <h2 className="text-2xl font-bold">{shopName}</h2>
        <div className="text-yellow-500 font-bold">Your Purse: {stats.septims} Septims</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((def, idx) => {
          const sampleItem = def.itemFactory();
          const canAfford = stats.septims >= def.price;

          return (
            <div key={idx} className="p-4 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950 flex flex-col justify-between">
              <div>
                <div className="font-bold text-lg mb-1 flex justify-between">
                  <span>{sampleItem.name}</span>
                  <span className="text-yellow-600 dark:text-yellow-400">{def.price}s</span>
                </div>
                <div className="text-xs uppercase font-bold text-stone-500 mb-2">{sampleItem.type}</div>
                <div className="text-sm mb-4">{sampleItem.description}</div>
              </div>

              <button
                onClick={() => handleBuy(def)}
                disabled={!canAfford}
                className={`w-full py-2 font-bold rounded transition-colors ${
                  canAfford
                    ? 'bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'bg-stone-200 dark:bg-stone-800 opacity-50 cursor-not-allowed text-stone-500'
                }`}
              >
                Buy
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-stone-700 text-stone-200 font-bold rounded hover:bg-stone-600 transition-colors"
        >
          Leave Shop
        </button>
      </div>
    </div>
  );
};
