import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState } from '../types';
import { NarrativeLog } from './NarrativeLog';
import { 
  Heart, Zap, Droplets, Sun, Users, Smile, 
  Send, Sparkles, Sword, Book, Eye, Search
} from 'lucide-react';

interface NarrativePanelProps {
  state: GameState;
  handleAction: (text: string, intent?: string, id?: string) => void;
  customAction: string;
  setCustomAction: (val: string) => void;
  NarrativeLog: any; // Passed from App for consistency
}

// ⚡ Bolt: Wrapped NarrativePanel in React.memo to prevent unnecessary re-renders when other parts of the application update.
// A custom comparator function prevents re-renders when irrelevant properties of `state` change.
// To avoid fragile logic and runtime crashes, it uses shallow state checks.
export const NarrativePanel: React.FC<NarrativePanelProps> = React.memo(({
  state, handleAction, customAction, setCustomAction 
}) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.ui.currentLog]);

  const needs = state.player.life_sim.needs;

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full bg-black/10">
      
      {/* Narrative Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide relative" ref={logRef}>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        <NarrativeLog 
          logs={state.ui.currentLog} 
          trauma={state.player.stats.trauma} 
          accessibilityMode={state.ui.accessibility_mode} 
          state={state} 
        />
        
        {/* Dynamic Warning Banners */}
        <AnimatePresence>
          {(needs.hunger <= 20 || needs.thirst <= 20 || needs.energy <= 20) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-4 left-8 right-8 z-20"
            >
              <div className="aaa-panel bg-red-950/40 border-red-500/30 p-3 flex flex-col gap-1">
                {needs.hunger <= 20 && <div className="text-[8px] uppercase tracking-widest text-red-400 font-bold flex items-center gap-2"><Sparkles className="w-2.5 h-2.5" /> Your stomach growls with a hollow, painful void.</div>}
                {needs.thirst <= 20 && <div className="text-[8px] uppercase tracking-widest text-sky-400 font-bold flex items-center gap-2"><Droplets className="w-2.5 h-2.5" /> Your throat is parched, like the sands of Alik'r.</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Interaction Deck */}
      <div className="p-2.5 border-t border-white/[0.06] bg-black/40 backdrop-blur-3xl space-y-2 flex-shrink-0">
        
        {/* Choice Matrix */}
        <div className="grid grid-cols-2 gap-2">
          {state.ui.choices.slice(0, 4).map((choice) => (
            <motion.button
              key={choice.id}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(choice.label, choice.intent, choice.id)}
              className="aaa-button-ghost py-1.5 px-2.5 flex items-center justify-between group"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/60 group-hover:text-white/90 truncate mr-2">{choice.label}</span>
              <div className="w-1 h-1 rounded-full bg-sky-500/40 group-hover:bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all shrink-0" />
            </motion.button>
          ))}

          {/* Core Fixed Actions */}
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(56, 189, 248, 0.1)", boxShadow: "0 0 15px rgba(14,165,233,0.3)" }}
            onClick={() => handleAction("Observe surroundings", "neutral")}
            className="aaa-button bg-sky-950/20 border border-sky-500/20 text-sky-400/60 hover:text-sky-400 py-1.5 rounded-lg flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-widest uppercase font-bold">Observe</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(168, 85, 247, 0.1)", boxShadow: "0 0 15px rgba(168,85,247,0.3)" }}
            onClick={() => handleAction("Attend Academy class", "neutral")}
            className="aaa-button bg-purple-950/20 border border-purple-500/20 text-purple-400/60 hover:text-purple-400 py-1.5 rounded-lg flex items-center justify-center gap-2"
          >
            <Book className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-widest uppercase font-bold">Academy</span>
          </motion.button>
        </div>

        {/* Custom Input Deck */}
        <div className="relative group">
          <div className="absolute inset-0 bg-sky-500/5 rounded-lg blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <input 
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="DIRECTIVE TO FATE..."
              className="flex-1 bg-black/60 border border-white/10 p-2 pr-10 rounded-lg text-[11px] tracking-[0.3em] uppercase text-white/80 focus:outline-none focus:border-sky-500/50 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all font-mono"
              onKeyDown={(e) => e.key === 'Enter' && customAction && handleAction(customAction, 'custom')}
            />
            <button 
              aria-label="Send custom action"
              onClick={() => customAction && handleAction(customAction, 'custom')}
              className="absolute right-4 text-white/20 hover:text-sky-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interaction Hints */}
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[7px] tracking-[0.2em] uppercase">Shift + Enter for Ritual</span>
            </div>
          </div>
          <div className="text-[7px] tracking-[0.2em] uppercase text-white/20 font-bold">
            Sim_Engine_v4.2 // Stability: {state.sim_world ? "NOMINAL" : "DORMANT"}
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.customAction === nextProps.customAction &&
    prevProps.handleAction === nextProps.handleAction &&
    prevProps.setCustomAction === nextProps.setCustomAction &&
    (prevProps.state === nextProps.state || (
      prevProps.state != null && nextProps.state != null &&
      prevProps.state.ui === nextProps.state.ui &&
      prevProps.state.player.stats === nextProps.state.player.stats &&
      prevProps.state.player.life_sim === nextProps.state.player.life_sim &&
      prevProps.state.sim_world === nextProps.state.sim_world
    ))
  );
});
