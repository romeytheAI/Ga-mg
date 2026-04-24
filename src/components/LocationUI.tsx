import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

export const LocationUI: React.FC<{ location: any }> = ({ location }) => {
  const { advanceTime } = useGameStore();

  const handleAction = (action: any) => {
    if (action.timeCost) {
      advanceTime(action.timeCost);
    }

    // Execute action logic
    action.execute(useGameStore.getState());
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Location Header */}
      <div>
        <h1 className="text-3xl font-bold text-amber-500 font-serif mb-4 border-b border-slate-800 pb-3 tracking-tight drop-shadow-md">
          {location.name}
        </h1>
        <p className="text-lg text-slate-300 font-serif leading-relaxed tracking-wide">{location.description}</p>
      </div>

      {/* Actions */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {location.actions.map((action: any, index: number) => (
            <motion.button
              key={index}
              onClick={() => handleAction(action)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-500 px-4 py-3 rounded text-left transition-all group flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              <span className="font-semibold text-amber-500 group-hover:text-amber-400">{action.label}</span>
              {action.timeCost > 0 && (
                <span className="text-xs font-mono text-slate-500 mt-2 bg-slate-900 px-2 py-0.5 rounded-full self-end border border-slate-700">
                  Cost: {action.timeCost}m
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
