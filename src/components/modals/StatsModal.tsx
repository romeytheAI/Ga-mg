import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GameState, StatKey } from '../../types';
import { CharacterModel } from '../CharacterModel';

interface StatsModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

export const StatsModal: React.FC<StatsModalProps> = ({ state, dispatch }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-500 rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              x: [null, Math.random() * 100 - 50],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
      >
        <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_stats', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
        <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Character Essence</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <CharacterModel anatomy={state.player.anatomy} isPlayer={true} />
          <div className="space-y-6">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Vitals</h3>
            {['health', 'stamina', 'willpower', 'purity'].map((key) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-white/60">{key}</span>
                  <span className="text-white/90">{Math.round(state.player.stats[key as StatKey])}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${(state.player.stats[key as StatKey] / (state.player.stats[`max_${key}` as StatKey] || 100)) * 100}%` }}
                    className={`h-full ${key === 'health' ? 'bg-red-500' : key === 'stamina' ? 'bg-green-500' : key === 'willpower' ? 'bg-blue-500' : 'bg-white'}`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Corruption & Desire</h3>
            {['lust', 'arousal', 'corruption', 'trauma', 'stress', 'pain'].map((key) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-white/60">{key}</span>
                  <span className="text-white/90">{Math.round(state.player.stats[key as StatKey])}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${state.player.stats[key as StatKey]}%` }}
                    className={`h-full ${key === 'lust' || key === 'arousal' ? 'bg-pink-500' : key === 'corruption' ? 'bg-purple-600' : 'bg-orange-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-2 space-y-6 mt-4 pt-6 border-t border-white/10">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Biological Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-1">Fertility Cycle</span>
                <span className="text-sm text-white/80 font-serif">{state.player.biology.fertility_cycle}</span>
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-pink-500/50" style={{ width: `${state.player.biology.fertility * 100}%` }} />
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-1">Fluids</span>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/40">Lactation</span>
                    <span className="text-white/80">{state.player.biology.lactation_level}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/80" style={{ width: `${state.player.biology.lactation_level}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-2">Active Conditions</span>
                <div className="flex flex-wrap gap-2">
                  {state.player.status_effects.map((effect, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-white/60 rounded-sm">{effect}</span>
                  ))}
                  {state.player.status_effects.length === 0 && <span className="text-[10px] text-white/20 italic">No active effects</span>}
                </div>
                
                {state.player.biology.parasites.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase text-white/40 block mb-1">Parasites</span>
                    <div className="flex flex-wrap gap-1">
                      {state.player.biology.parasites.map((p, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-sm">{p.type}</span>
                      ))}
                    </div>
                  </div>
                )}
                {state.player.biology.incubations.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase text-white/40 block mb-1">Incubations</span>
                    <div className="flex flex-wrap gap-1">
                      {state.player.biology.incubations.map((inc, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-purple-900/20 border border-purple-500/30 text-purple-400 rounded-sm">{inc.type} ({inc.progress}%)</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
