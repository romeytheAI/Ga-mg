import React from 'react';
import { useGameStore, GameActionState } from '../store/gameStore';

export const LocationUI: React.FC<{ location: any }> = ({ location }) => {
  const { advanceTime, addLog, modifyStat, startEncounter } = useGameStore();

  const handleAction = (action: any) => {
    if (action.timeCost) {
      advanceTime(action.timeCost);
    }

    // Execute action logic
    action.execute(useGameStore.getState());
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{location.name}</h2>
      <p className="mb-6">{location.description}</p>

      <div className="space-y-2">
        {location.actions.map((action: any, index: number) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="block w-full text-left p-3 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          >
            <div className="font-bold">{action.label}</div>
            {action.timeCost > 0 && (
              <div className="text-sm text-stone-500 dark:text-stone-400">Takes {action.timeCost} minutes</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
