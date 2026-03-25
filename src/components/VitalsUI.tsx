import React from 'react';
import { useGameStore } from '../store/gameStore';
import { AnimationWindow } from './AnimationWindow';

export const VitalsUI: React.FC = () => {
  const stats = useGameStore((state) => state.stats);
  const log = useGameStore((state) => state.log);

  const StatBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="w-full h-2 bg-stone-300 dark:bg-stone-700 rounded overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex-shrink-0">
        <AnimationWindow />
      </div>

      <div className="mb-6 flex-shrink-0">
        <h3 className="text-xl font-bold border-b border-stone-300 dark:border-stone-700 mb-2 pb-1">Vitals</h3>
        <StatBar label="Health" value={stats.health} max={stats.maxHealth} color="bg-red-500" />
        <StatBar label="Magicka" value={stats.magicka} max={stats.maxMagicka} color="bg-blue-500" />
        <StatBar label="Fatigue" value={stats.fatigue} max={stats.maxFatigue} color="bg-green-500" />

        <div className="mt-4 pt-4 border-t border-stone-300 dark:border-stone-700">
          <StatBar label="Arousal" value={stats.arousal} max={stats.maxArousal} color="bg-pink-500" />
          <StatBar label="Stress" value={stats.stress} max={stats.maxStress} color="bg-orange-500" />
          <StatBar label="Trauma" value={stats.trauma} max={stats.maxTrauma} color="bg-purple-500" />
        </div>

        <div className="mt-4 pt-4 border-t border-stone-300 dark:border-stone-700">
           <div className="flex justify-between font-bold">
             <span>Septims:</span>
             <span className="text-yellow-500">{stats.septims}</span>
           </div>
           <div className="flex justify-between">
             <span>Corruption:</span>
             <span className="text-indigo-400">{stats.corruption}</span>
           </div>
        </div>
      </div>

      <div className="mt-auto flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-bold border-b border-stone-300 dark:border-stone-700 mb-2 pb-1 flex-shrink-0">Log</h3>
        <div className="space-y-1 text-sm overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-stone-400 dark:scrollbar-thumb-stone-600">
          {log.map((msg) => (
            <div key={msg.id} className={`
              ${msg.type === 'good' ? 'text-green-600 dark:text-green-400' : ''}
              ${msg.type === 'bad' ? 'text-red-600 dark:text-red-400' : ''}
              ${msg.type === 'combat' ? 'text-orange-600 dark:text-orange-400' : ''}
              ${msg.type === 'lewd' ? 'text-pink-600 dark:text-pink-400' : ''}
            `}>
              • {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
