import React from 'react';
import { motion } from 'framer-motion';
import { GameState, ActiveEncounter } from '../App';

interface EncounterUIProps {
  encounter: ActiveEncounter;
  playerStats: GameState['player']['stats'];
  onAction: (action: string, intent: string) => void;
}

export const EncounterUI: React.FC<EncounterUIProps> = ({ encounter, playerStats, onAction }) => {
  return (
    <div className="flex flex-col gap-4 p-4 border border-red-900/50 bg-red-950/10 rounded-sm">
      <div className="flex justify-between items-center border-b border-red-900/30 pb-2">
        <h3 className="text-lg font-serif text-red-400">{encounter.enemy_name}</h3>
        <span className="text-[10px] uppercase tracking-widest text-red-500/50">Turn {encounter.turn}</span>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Health</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-red-500" style={{ width: `${(encounter.enemy_health / encounter.enemy_max_health) * 100}%` }} />
          </div>
          <span className="text-red-400">{encounter.enemy_health}/{encounter.enemy_max_health}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Lust</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-pink-500" style={{ width: `${(encounter.enemy_lust / encounter.enemy_max_lust) * 100}%` }} />
          </div>
          <span className="text-pink-400">{encounter.enemy_lust}/{encounter.enemy_max_lust}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Anger</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-orange-500" style={{ width: `${(encounter.enemy_anger / encounter.enemy_max_anger) * 100}%` }} />
          </div>
          <span className="text-orange-400">{encounter.enemy_anger}/{encounter.enemy_max_anger}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button 
          onClick={() => onAction("Struggle and fight back", "aggressive")}
          className="p-3 border border-red-900/50 bg-red-950/20 hover:bg-red-900/40 text-red-200 text-xs uppercase tracking-widest transition-colors"
        >
          Struggle
        </button>
        <button 
          onClick={() => onAction("Submit and endure", "submissive")}
          className="p-3 border border-purple-900/50 bg-purple-950/20 hover:bg-purple-900/40 text-purple-200 text-xs uppercase tracking-widest transition-colors"
        >
          Submit
        </button>
        <button 
          onClick={() => onAction("Attempt to seduce", "social")}
          className="p-3 border border-pink-900/50 bg-pink-950/20 hover:bg-pink-900/40 text-pink-200 text-xs uppercase tracking-widest transition-colors"
        >
          Seduce
        </button>
        <button 
          onClick={() => onAction("Try to escape", "flee")}
          className="p-3 border border-blue-900/50 bg-blue-950/20 hover:bg-blue-900/40 text-blue-200 text-xs uppercase tracking-widest transition-colors"
        >
          Escape
        </button>
      </div>
    </div>
  );
};
