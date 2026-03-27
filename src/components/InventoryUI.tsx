import React, { useState } from 'react';
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
      <div className="flex border-b border-stone-300 dark:border-stone-700 mb-6">
        <button
          className={`py-2 px-4 font-bold ${activeTab === 'equipment' ? 'border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500'}`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment
        </button>
        <button
          className={`py-2 px-4 font-bold ${activeTab === 'inventory' ? 'border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500'}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory ({inventory.length})
        </button>
      </div>

      {activeTab === 'equipment' && (
        <div className="space-y-4 max-w-md">
          {layers.map((layer) => {
            const item = clothing[layer];
            return (
              <div key={layer} className="border border-stone-300 dark:border-stone-700 rounded p-4 flex justify-between items-center bg-stone-100 dark:bg-stone-900">
                <div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">{layer.replace('_', ' ')}</div>
                  {item ? (
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-sm">Integrity: {item.integrity}/{item.maxIntegrity}</div>
                    </div>
                  ) : (
                    <div className="italic text-stone-500">Empty</div>
                  )}
                </div>
                {item && (
                  <button
                    onClick={() => handleRemove(layer)}
                    className="px-3 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.length === 0 ? (
            <div className="text-stone-500 italic p-4">Your inventory is empty.</div>
          ) : (
            inventory.map((item: InventoryItem) => (
              <div key={item.id} className="border border-stone-300 dark:border-stone-700 rounded p-4 bg-stone-100 dark:bg-stone-900">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-lg">{item.name}</div>
                  <span className="text-xs uppercase bg-stone-200 dark:bg-stone-800 px-2 py-1 rounded">
                    {item.type}
                  </span>
                </div>
                <div className="text-sm mb-4">{item.description}</div>

                <button
                  onClick={() => handleEquip(item.id)}
                  className="w-full py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded font-bold transition-colors"
                >
                  {item.type === 'clothing' ? 'Equip' : 'Use'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
