import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore, InventoryItem, ClothingLayer } from '../store/gameStore';

export const InventoryUI: React.FC = () => {
  const { inventory, clothing, useItem, equipClothing, removeClothing } = useGameStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'equipment'>('equipment');

  const layers: ClothingLayer[] = ['over', 'upper', 'lower', 'under_upper', 'under_lower'];

  const handleEquip = (itemId: string) => {
    useItem(itemId);
  };

  const handleRemove = (layer: ClothingLayer) => {
    removeClothing(layer);
  };

  return (
    <div>
      <div className="flex border-b border-slate-800 mb-6 gap-1">
        <button
          className={`py-2 px-4 font-bold text-sm uppercase tracking-wider transition-all rounded-t ${
            activeTab === 'equipment'
              ? 'bg-slate-800 text-amber-500 border border-slate-700 border-b-transparent'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment
        </button>
        <button
          className={`py-2 px-4 font-bold text-sm uppercase tracking-wider transition-all rounded-t ${
            activeTab === 'inventory'
              ? 'bg-slate-800 text-amber-500 border border-slate-700 border-b-transparent'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory ({inventory.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'equipment' && (
          <motion.div
            key="equipment"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 max-w-md"
          >
            {layers.map((layer) => {
              const item = clothing[layer];
              return (
                <div key={layer} className="border border-slate-800 rounded-lg p-4 flex justify-between items-center bg-slate-900/60 backdrop-blur-sm">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">{layer.replace('_', ' ')}</div>
                    {item ? (
                      <div>
                        <div className="font-bold text-lg text-slate-200">{item.name}</div>
                        <div className={`text-sm font-mono ${
                          item.integrity < 20 ? 'text-red-400' :
                          item.integrity < 50 ? 'text-orange-400' : 'text-slate-400'
                        }`}>
                          Integrity: {item.integrity}/{item.maxIntegrity}
                        </div>
                      </div>
                    ) : (
                      <div className="italic text-slate-600">Empty</div>
                    )}
                  </div>
                  {item && (
                    <button
                      onClick={() => handleRemove(layer)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-700 rounded text-sm text-slate-300 hover:text-red-400 transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {inventory.length === 0 ? (
              <div className="text-slate-600 italic p-4 col-span-2">Your inventory is empty.</div>
            ) : (
              inventory.map((item: InventoryItem) => (
                <div key={item.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-lg text-slate-200">{item.name}</div>
                    <span className="text-xs uppercase bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700 font-mono">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-sm mb-4 text-slate-400">{item.description}</div>

                  <button
                    onClick={() => handleEquip(item.id)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-600 rounded font-bold text-amber-500 hover:text-amber-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                  >
                    {item.type === 'clothing' ? 'Equip' : 'Use'}
                  </button>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
