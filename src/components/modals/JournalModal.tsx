import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { GameState } from '../../types';

interface JournalModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

export const JournalModal: React.FC<JournalModalProps> = ({ state, dispatch }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-500 rounded-full blur-[1px]"
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
        <button aria-label="Close Journal" onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_quests', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
        <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Journal</h2>
        
        <div className="space-y-6">
          {(!state.player.quests || state.player.quests.length === 0) ? (
            <p className="text-white/40 italic text-sm text-center py-8">Your journal is empty.</p>
          ) : (
            state.player.quests.map((quest: any, index: number) => (
              <motion.div 
                key={quest.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-white/5 bg-white/[0.02] p-4 rounded-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif text-white/90">{quest.title}</h3>
                  <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm border ${quest.status === 'active' ? 'text-yellow-400 border-yellow-900/50 bg-yellow-900/20' : quest.status === 'completed' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-900/20' : 'text-red-400 border-red-900/50 bg-red-900/20'}`}>
                    {quest.status}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{quest.description}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
