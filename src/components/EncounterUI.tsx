import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, ActiveEncounter } from '../types';

interface EncounterUIProps {
  encounter: ActiveEncounter;
  playerStats: GameState['player']['stats'];
  onAction: (action: string, intent: string) => void;
}

export const EncounterUI: React.FC<EncounterUIProps> = ({ encounter, playerStats, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4 p-4 border border-red-900/50 bg-red-950/10 rounded-sm relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 200,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center border-b border-red-900/30 pb-2 relative z-10">
        <h3 className="text-lg font-serif text-red-400">{encounter.enemy_name}</h3>
        <span className="text-[10px] uppercase tracking-widest text-red-500/50">Turn {encounter.turn}</span>
      </div>
      
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 w-12">Health</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(encounter.enemy_health / encounter.enemy_max_health) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="absolute left-0 top-0 bottom-0 bg-red-500" 
            />
          </div>
          <span className="text-red-400 w-12 text-right">{encounter.enemy_health}/{encounter.enemy_max_health}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 w-12">Lust</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(encounter.enemy_lust / encounter.enemy_max_lust) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="absolute left-0 top-0 bottom-0 bg-pink-500" 
            />
          </div>
          <span className="text-pink-400 w-12 text-right">{encounter.enemy_lust}/{encounter.enemy_max_lust}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 w-12">Anger</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(encounter.enemy_anger / encounter.enemy_max_anger) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="absolute left-0 top-0 bottom-0 bg-orange-500" 
            />
          </div>
          <span className="text-orange-400 w-12 text-right">{encounter.enemy_anger}/{encounter.enemy_max_anger}</span>
        </div>
      </div>

      {/* Combat Log */}
      {encounter.log && encounter.log.length > 0 && (
        <div className="mt-2 h-24 overflow-y-auto bg-black/40 border border-white/5 p-2 rounded-sm text-xs font-mono relative z-10 flex flex-col-reverse">
          <AnimatePresence initial={false}>
            {encounter.log.slice().reverse().map((entry, index) => (
              <motion.div
                key={`${encounter.turn}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`mb-1 ${index === 0 ? 'text-white' : 'text-white/40'}`}
              >
                &gt; {entry}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(127, 29, 29, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Struggle and fight back", "aggressive")}
          className="p-3 border border-red-900/50 bg-red-950/20 text-red-200 text-xs uppercase tracking-widest transition-colors"
        >
          Struggle
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(88, 28, 135, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Submit and endure", "submissive")}
          className="p-3 border border-purple-900/50 bg-purple-950/20 text-purple-200 text-xs uppercase tracking-widest transition-colors"
        >
          Submit
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(131, 24, 67, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Attempt to seduce", "social")}
          className="p-3 border border-pink-900/50 bg-pink-950/20 text-pink-200 text-xs uppercase tracking-widest transition-colors"
        >
          Seduce
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 58, 138, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Try to escape", "flee")}
          className="p-3 border border-blue-900/50 bg-blue-950/20 text-blue-200 text-xs uppercase tracking-widest transition-colors"
        >
          Escape
        </motion.button>
      </div>
    </motion.div>
  );
};
