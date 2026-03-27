import React from 'react';
import { useGameStore } from '../store/gameStore';

export const EncounterUI: React.FC = () => {
  const { activeEncounter, endEncounter, stats } = useGameStore();

  if (!activeEncounter) return null;

  return (
    <div className="bg-stone-200 dark:bg-stone-800 p-6 rounded-lg shadow-lg border border-stone-300 dark:border-stone-700 max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-2 text-red-600 dark:text-red-400">Encounter: {activeEncounter.name}</h2>
      <div className="mb-4 flex space-x-4 text-sm text-stone-500 dark:text-stone-400">
        <span>Turn: {activeEncounter.turn}</span>
        {activeEncounter.enemyHealth !== undefined && (
           <span>Enemy Health: {activeEncounter.enemyHealth}</span>
        )}
        {activeEncounter.enemyLust !== undefined && (
           <span>Enemy Lust: {activeEncounter.enemyLust}</span>
        )}
      </div>

      {activeEncounter.image && (
        <div className="mb-6 rounded overflow-hidden">
          <img src={activeEncounter.image} alt={activeEncounter.name} className="w-full h-auto" />
        </div>
      )}

      <p className="mb-8 text-lg">{activeEncounter.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeEncounter.choices.map((choice, idx) => {
          const isAvailable = !choice.statReq || (stats[choice.statReq.stat] as number) >= choice.statReq.min;

          return (
            <button
              key={idx}
              onClick={() => {
                if (isAvailable) {
                  choice.onChoose(useGameStore.getState());
                }
              }}
              disabled={!isAvailable}
              className={`p-4 text-left rounded shadow transition-transform ${
                isAvailable
                  ? 'bg-stone-100 dark:bg-stone-900 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-stone-300 dark:border-stone-700'
                  : 'bg-stone-300 dark:bg-stone-700 opacity-50 cursor-not-allowed border-dashed border-stone-400 dark:border-stone-600'
              }`}
            >
              <div className="font-bold text-lg">{choice.label}</div>
              <div className="text-sm mt-1">{choice.description}</div>

              {!isAvailable && choice.statReq && (
                <div className="text-xs text-red-500 mt-2 font-bold uppercase">
                  Requires {choice.statReq.stat}: {choice.statReq.min}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Optional fallback escape if things break */}
      <div className="mt-8 text-right">
        <button
          onClick={() => endEncounter("You fled the encounter in a panic.")}
          className="text-xs text-stone-500 hover:text-red-500"
        >
          [Debug: Force End]
        </button>
      </div>
    </div>
  );
};
