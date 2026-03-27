import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

export const EncounterUI: React.FC = () => {
  const { activeEncounter, endEncounter, stats } = useGameStore();

  if (!activeEncounter) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900/80 p-6 rounded-xl shadow-2xl border border-red-900/50 max-w-2xl mx-auto backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold font-serif mb-2 text-red-500 tracking-tight drop-shadow-md">
        Encounter: {activeEncounter.name}
      </h2>
      <div className="mb-4 flex space-x-4 text-sm text-slate-500">
        <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 font-mono">Turn: {activeEncounter.turn}</span>
        {activeEncounter.enemyHealth !== undefined && (
           <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 font-mono">Enemy HP: {activeEncounter.enemyHealth}</span>
        )}
        {activeEncounter.enemyLust !== undefined && (
           <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 font-mono">Enemy Lust: {activeEncounter.enemyLust}</span>
        )}
      </div>

      {activeEncounter.image && (
        <div className="mb-6 rounded-lg overflow-hidden border border-slate-800">
          <img src={activeEncounter.image} alt={activeEncounter.name} className="w-full h-auto" />
        </div>
      )}

      <p className="mb-8 text-lg text-slate-300 font-serif leading-relaxed tracking-wide">{activeEncounter.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeEncounter.choices.map((choice, idx) => {
          const isAvailable = !choice.statReq || (stats[choice.statReq.stat] as number) >= choice.statReq.min;

          return (
            <motion.button
              key={idx}
              onClick={() => {
                if (isAvailable) {
                  choice.onChoose(useGameStore.getState());
                }
              }}
              disabled={!isAvailable}
              whileHover={isAvailable ? { scale: 1.02 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              className={`p-4 text-left rounded-lg shadow transition-all ${
                isAvailable
                  ? 'bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700 hover:border-amber-600'
                  : 'bg-slate-800/50 opacity-40 cursor-not-allowed border border-dashed border-slate-700'
              }`}
            >
              <div className={`font-bold text-lg ${isAvailable ? 'text-amber-500' : 'text-slate-500'}`}>{choice.label}</div>
              <div className="text-sm mt-1 text-slate-400">{choice.description}</div>

              {!isAvailable && choice.statReq && (
                <div className="text-xs text-red-500 mt-2 font-bold uppercase tracking-wider">
                  Requires {choice.statReq.stat}: {choice.statReq.min}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Optional fallback escape if things break */}
      <div className="mt-8 text-right">
        <button
          onClick={() => endEncounter("You fled the encounter in a panic.")}
          className="text-xs text-slate-600 hover:text-red-500 transition-colors"
        >
          [Debug: Force End]
        </button>
      </div>
    </motion.div>
  );
};
