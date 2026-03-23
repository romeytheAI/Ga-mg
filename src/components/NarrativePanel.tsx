import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types';
import { EncounterUI } from './EncounterUI';

interface NarrativePanelProps {
  state: GameState;
  handleAction: (action: string, intent?: string, targetedPart?: string) => void;
  customAction: string;
  setCustomAction: (action: string) => void;
  NarrativeLog: React.FC<any>;
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({ state, handleAction, customAction, setCustomAction, NarrativeLog }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.ui.currentLog]);

  return (
    <div className="w-full max-w-lg border-l border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex flex-col relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
      
      {/* Log Area */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide" ref={logRef}>
        <NarrativeLog logs={state.ui.currentLog} trauma={state.player.stats.trauma} accessibilityMode={state.ui.accessibility_mode} />
        
        {/* Afflictions */}
        {state.player.afflictions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {state.player.afflictions.map((aff, i) => (
              <span key={i} className="px-3 py-1 bg-red-950/30 border border-red-900/30 text-red-400/80 text-[10px] tracking-widest uppercase rounded-sm">
                {aff}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="p-8 border-t border-white/5 bg-black/50 relative">
        <AnimatePresence>
          {state.ui.isPollingText ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md flex flex-col items-center justify-center z-10"
            >
              <div className="w-16 h-16 relative mb-6">
                <div className="absolute inset-0 border border-white/10 rounded-full" />
                <div className="absolute inset-0 border border-t-white/60 rounded-full animate-spin" />
                <div className="absolute inset-2 border border-white/5 rounded-full" />
                <div className="absolute inset-2 border border-b-white/40 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
              </div>
              <p className="tracking-[0.3em] uppercase text-[10px] text-white/50 animate-pulse">
                The Weaver Contemplates...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col gap-3 relative">
          {state.world.active_encounter ? (
            <EncounterUI 
              encounter={state.world.active_encounter} 
              playerStats={state.player.stats} 
              onAction={(action, intent, part) => handleAction(action, intent, part)} 
            />
          ) : (
            <>
              {state.world.current_location.danger > 80 && !state.ui.isPollingText && (
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  onAnimationComplete={() => handleAction("Struggle", "aggressive")}
                  className="absolute -top-4 left-0 h-1 bg-red-500/50"
                />
              )}
              {state.ui.choices.map(choice => (
                <motion.button 
                  whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}
                  key={choice.id}
                  onClick={() => handleAction(choice.label, choice.intent, choice.id)}
                  className={`group relative p-4 text-left border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all rounded-sm overflow-hidden flex justify-between items-center ${state.player.stats.health < 20 ? 'desperation-glow border-red-500/50' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <span className="text-[10px] tracking-widest uppercase text-white/30 w-24 shrink-0">[{choice.intent}]</span>
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{choice.label}</span>
                  </div>
                  {choice.successChance !== undefined && (
                    <div className="relative flex items-center gap-2">
                      <span className={`text-[10px] tracking-widest font-mono ${choice.successChance > 75 ? 'text-emerald-400/80' : choice.successChance > 40 ? 'text-yellow-400/80' : 'text-red-400/80'}`}>
                        {choice.successChance}%
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
              
              <div className="flex gap-2 mt-4 mb-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction("Scavenge the area for supplies", "work")}
                  className="flex-1 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all rounded-sm text-[10px] tracking-widest uppercase text-white/60 hover:text-white/90"
                >
                  Scavenge Area
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction("Rest and recover", "neutral")}
                  className="flex-1 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all rounded-sm text-[10px] tracking-widest uppercase text-white/60 hover:text-white/90"
                >
                  Rest & Recover
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction("Wait for an hour", "neutral")}
                  className="flex-1 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all rounded-sm text-[10px] tracking-widest uppercase text-white/60 hover:text-white/90"
                >
                  Wait 1 Hour
                </motion.button>
              </div>
            </>
          )}
          <form onSubmit={e => { e.preventDefault(); if(customAction.trim()) { handleAction(customAction); setCustomAction(''); } }} className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>
            <input 
              type="text" 
              value={customAction}
              onChange={e => setCustomAction(e.target.value)}
              placeholder="Forge your own path..."
              className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-4 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
