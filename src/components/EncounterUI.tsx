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
    <div className="flex flex-col gap-4 p-5 border border-[#d4af37]/30 bg-black/60 backdrop-blur-sm rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.05)]">
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-3">
        <h3 className="text-xl font-serif text-[#d4af37] drop-shadow-md">{encounter.enemy_name}</h3>
        <span className="text-[10px] uppercase tracking-widest text-[#d4af37]/60">Turn {encounter.turn}</span>
      </div>
      
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60 w-12 font-serif">Health</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-sm overflow-hidden border border-[#d4af37]/20">
            <div className="h-full bg-red-800 shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ width: `${(encounter.enemy_health / encounter.enemy_max_health) * 100}%` }} />
          </div>
          <span className="text-red-400/80 w-12 text-right font-mono">{encounter.enemy_health}/{encounter.enemy_max_health}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60 w-12 font-serif">Lust</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-sm overflow-hidden border border-[#d4af37]/20">
            <div className="h-full bg-purple-800 shadow-[0_0_8px_rgba(147,51,234,0.5)]" style={{ width: `${(encounter.enemy_lust / encounter.enemy_max_lust) * 100}%` }} />
          </div>
          <span className="text-purple-400/80 w-12 text-right font-mono">{encounter.enemy_lust}/{encounter.enemy_max_lust}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60 w-12 font-serif">Anger</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-sm overflow-hidden border border-[#d4af37]/20">
            <div className="h-full bg-orange-800 shadow-[0_0_8px_rgba(234,88,12,0.5)]" style={{ width: `${(encounter.enemy_anger / encounter.enemy_max_anger) * 100}%` }} />
          </div>
          <span className="text-orange-400/80 w-12 text-right font-mono">{encounter.enemy_anger}/{encounter.enemy_max_anger}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button 
          onClick={() => onAction("Struggle and fight back", "aggressive")}
          className="p-3 border border-red-900/40 bg-gradient-to-b from-red-950/20 to-black hover:from-red-900/40 hover:border-red-500/50 text-red-200/80 text-xs uppercase tracking-widest transition-all"
        >
          Struggle
        </button>
        <button 
          onClick={() => onAction("Submit and endure", "submissive")}
          className="p-3 border border-purple-900/40 bg-gradient-to-b from-purple-950/20 to-black hover:from-purple-900/40 hover:border-purple-500/50 text-purple-200/80 text-xs uppercase tracking-widest transition-all"
        >
          Submit
        </button>
        <button 
          onClick={() => onAction("Attempt to seduce", "social")}
          className="p-3 border border-pink-900/40 bg-gradient-to-b from-pink-950/20 to-black hover:from-pink-900/40 hover:border-pink-500/50 text-pink-200/80 text-xs uppercase tracking-widest transition-all"
        >
          Seduce
        </button>
        <button 
          onClick={() => onAction("Try to escape", "flee")}
          className="p-3 border border-blue-900/40 bg-gradient-to-b from-blue-950/20 to-black hover:from-blue-900/40 hover:border-blue-500/50 text-blue-200/80 text-xs uppercase tracking-widest transition-all"
        >
          Escape
        </button>
      </div>
    </div>
  );
};
