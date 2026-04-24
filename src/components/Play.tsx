import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { locations } from '../content/locations';
import { shops } from '../content/shops';
import { LocationUI } from './LocationUI';
import { EncounterUI } from './EncounterUI';
import { InventoryUI } from './InventoryUI';
import { ShopUI } from './ShopUI';

export const Play: React.FC = () => {
  const { phase, locationId, activeShopId, closeShop } = useGameStore();
  const [activeTab, setActiveTab] = useState<'main' | 'inventory'>('main');

  const location = locations.find(l => l.id === locationId);

  if (!location) {
    return <div className="p-4 text-red-500 font-bold border-l-4 border-red-500 bg-red-950/20">Error: Location {locationId} not found.</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 mb-6 flex-shrink-0">
        <button
          onClick={() => setActiveTab('main')}
          className={`px-4 py-2 rounded-t text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'main'
              ? 'bg-slate-800 text-amber-500 border border-slate-700 border-b-transparent'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          Actions
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-t text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'inventory'
              ? 'bg-slate-800 text-amber-500 border border-slate-700 border-b-transparent'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          Inventory
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <AnimatePresence mode="wait">
          {phase === 'encounter' ? (
            <motion.div
              key="encounter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <EncounterUI />
            </motion.div>
          ) : phase === 'shop' && activeShopId && shops[activeShopId] ? (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ShopUI
                shopName={shops[activeShopId].name}
                items={shops[activeShopId].items}
                onClose={closeShop}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'main' ? (
                <LocationUI location={location} />
              ) : (
                <InventoryUI />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
