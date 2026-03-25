import React from 'react';
import { useLocationStore } from '../../store/locationStore';
import { useGameStore } from '../../store/gameStore';

export const ActionMenu: React.FC = () => {
  const { locationId, advanceTime } = useGameStore();
  const location = useLocationStore((state) => state.getLocation(locationId));

  if (!location) {
    return <div className="p-4 text-red-500 font-bold border-l-4 border-red-500 bg-red-950/20">Location data not found for {locationId}</div>;
  }

  const handleAction = (action: any) => {
    // 1. Execute logic
    action.onExecute();
    // 2. Advance time based on action cost
    if (action.timeCost > 0) {
      advanceTime(action.timeCost);
    }
  };

  const handleExit = (exit: any) => {
    // 1. Move
    useGameStore.getState().setLocation(exit.id);
    // 2. Advance time based on distance cost
    if (exit.timeCost > 0) {
      advanceTime(exit.timeCost);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-12 mb-20 bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-2">Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {location.actions.map((action, idx) => {
            if (action.conditions && !action.conditions()) return null;

            return (
              <button
                key={`action-${idx}`}
                onClick={() => handleAction(action)}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-500 px-4 py-3 rounded text-left transition-all group flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              >
                <span className="font-semibold text-amber-500 group-hover:text-amber-400">{action.label}</span>
                <span className="text-xs text-slate-400 mt-1 line-clamp-2">{action.description}</span>
                <span className="text-xs font-mono text-slate-500 mt-2 bg-slate-900 px-2 py-0.5 rounded-full self-end border border-slate-700">Cost: {action.timeCost}m</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-2">Travel</h3>
        <div className="flex flex-wrap gap-3">
          {location.exits.map((exit, idx) => (
            <button
              key={`exit-${idx}`}
              onClick={() => handleExit(exit)}
              className="bg-slate-950 hover:bg-slate-800 border-b-2 border-slate-700 hover:border-amber-600 px-5 py-2 rounded text-sm font-medium transition-all text-slate-300 hover:text-white flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Go to {exit.label}
              <span className="text-xs text-slate-500 bg-slate-900 px-1.5 rounded">{exit.timeCost}m</span>
            </button>
          ))}
          {location.exits.length === 0 && (
            <span className="text-slate-500 italic text-sm py-2">No visible exits.</span>
          )}
        </div>
      </div>
    </div>
  );
};
