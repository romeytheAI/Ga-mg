import React from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { GameState } from '../../types';

interface MemoriesModalProps {
  state: GameState;
  onClose: () => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({ state, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full max-h-[80vh] flex flex-col relative shadow-2xl z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
         aria-label="Close modal">
              <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3 shrink-0">
          <BookOpen className="w-5 h-5 text-white/50" />
          Memory Graph
        </h2>
        
        <div className="overflow-y-auto pr-4 space-y-6 scrollbar-hide flex-1">
          {state.memory_graph.length === 0 ? (
            <p className="text-white/40 italic text-sm">The void is empty...</p>
          ) : (
            state.memory_graph.map((mem, i) => (
              <div key={i} className="border-l border-white/10 pl-4 py-1 relative">
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-white/20" />
                <span className="text-[10px] tracking-widest uppercase text-white/30 block mb-2">Fragment {i + 1}</span>
                <p className="text-sm text-white/70 leading-relaxed font-serif">{mem}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
