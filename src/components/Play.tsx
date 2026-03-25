import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { locations } from '../content/locations';
import { shops } from '../content/shops';
import { LocationUI } from './LocationUI';
import { VitalsUI } from './VitalsUI';
import { TimeWeatherUI } from './TimeWeatherUI';
import { EncounterUI } from './EncounterUI';
import { InventoryUI } from './InventoryUI';
import { ShopUI } from './ShopUI';

export const Play: React.FC = () => {
  const { phase, locationId, activeShopId, closeShop } = useGameStore();
  const [activeTab, setActiveTab] = useState<'main' | 'inventory'>('main');

  const location = locations.find(l => l.id === locationId);

  if (!location) {
    return <div className="p-4 text-red-500">Error: Location {locationId} not found.</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-serif">
      {/* Header / Top Bar */}
      <div className="flex justify-between items-center p-2 bg-stone-200 dark:bg-stone-800 border-b border-stone-300 dark:border-stone-700">
        <TimeWeatherUI />

        <div className="flex space-x-2">
           <button
             onClick={() => setActiveTab('main')}
             className={`px-3 py-1 rounded ${activeTab === 'main' ? 'bg-stone-300 dark:bg-stone-700 font-bold' : 'hover:bg-stone-300 dark:hover:bg-stone-700'}`}
           >
             Actions
           </button>
           <button
             onClick={() => setActiveTab('inventory')}
             className={`px-3 py-1 rounded ${activeTab === 'inventory' ? 'bg-stone-300 dark:bg-stone-700 font-bold' : 'hover:bg-stone-300 dark:hover:bg-stone-700'}`}
           >
             Inventory
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Sidebar - Stats & Vitals */}
        <div className="w-64 flex-shrink-0 p-4 overflow-y-auto border-r border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950">
          <VitalsUI />
        </div>

        {/* Center/Right - Location/Actions/Encounters */}
        <div className="flex-1 p-4 overflow-y-auto">
          {phase === 'encounter' ? (
             <EncounterUI />
          ) : phase === 'shop' && activeShopId && shops[activeShopId] ? (
             <ShopUI
               shopName={shops[activeShopId].name}
               items={shops[activeShopId].items}
               onClose={closeShop}
             />
          ) : (
             activeTab === 'main' ? (
                <LocationUI location={location} />
             ) : (
                <InventoryUI />
             )
          )}
        </div>
      </div>
    </div>
  );
};
