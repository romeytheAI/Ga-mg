import React from 'react';
import { motion } from 'motion/react';
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl shadow-2xl max-w-2xl mx-auto backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
        <h2 className="text-2xl font-bold font-serif text-amber-500 tracking-tight">{shopName}</h2>
        <div className="text-yellow-400 font-bold flex items-center gap-1">
          <span className="text-sm text-slate-500 uppercase tracking-wider">Purse:</span>
          <span>{stats.septims} Septims</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((def, idx) => {
          const sampleItem = def.itemFactory();
          const canAfford = stats.septims >= def.price;

          return (
            <div key={idx} className="p-4 border border-slate-800 rounded-lg bg-slate-950/60 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="font-bold text-lg mb-1 flex justify-between">
                  <span className="text-slate-200">{sampleItem.name}</span>
                  <span className="text-yellow-400 font-mono">{def.price}s</span>
                </div>
                <div className="text-xs uppercase font-bold text-slate-500 mb-2 tracking-wider">{sampleItem.type}</div>
                <div className="text-sm mb-4 text-slate-400">{sampleItem.description}</div>
              </div>

              <motion.button
                onClick={() => handleBuy(def)}
                disabled={!canAfford}
                whileHover={canAfford ? { scale: 1.02 } : {}}
                whileTap={canAfford ? { scale: 0.98 } : {}}
                className={`w-full py-2 font-bold rounded transition-all ${
                  canAfford
                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-600 text-amber-500 hover:text-amber-400'
                    : 'bg-slate-800/50 opacity-40 cursor-not-allowed border border-slate-700 text-slate-600'
                }`}
              >
                Buy
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-right">
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-slate-800 text-slate-300 font-bold rounded border border-slate-700 hover:border-amber-600 hover:text-amber-400 transition-all"
        >
          Leave Shop
        </motion.button>
      </div>
    </motion.div>
  );
};
