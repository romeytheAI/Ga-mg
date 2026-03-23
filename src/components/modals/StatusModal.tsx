import React from 'react';
import { motion } from 'framer-motion';
import { X, User } from 'lucide-react';
import { GameState } from '../../types';

interface StatusModalProps {
  state: GameState;
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ state, onClose }) => {
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
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-md w-full relative shadow-2xl z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
          <User className="w-5 h-5 text-white/50" />
          Physiological Matrix
        </h2>
        
        <div className="space-y-4">
          {Object.entries(state.player.stats).map(([stat, value]) => (
            <div key={stat} className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-white/50">{stat}</span>
              <div className="flex-1 mx-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat === 'trauma' || stat === 'lust' || stat === 'corruption' ? 'bg-red-900/50' : 'bg-white/20'}`} 
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs font-mono text-white/70 w-8 text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4">Inventory & Encumbrance</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest uppercase text-white/40">Weight</span>
            <span className="text-[10px] font-mono text-white/60">{state.player.inventory.length * 2} / 50 lbs</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${state.player.inventory.length * 2 > 40 ? 'bg-red-500' : 'bg-white/40'}`} 
              style={{ width: `${Math.min(100, (state.player.inventory.length * 2 / 50) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4">Current Equipment</h3>
          <p className="text-sm text-white/80 font-serif italic">{state.player.inventory.filter(i => i.is_equipped).map(i => i.name).join(', ') || 'Naked'}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-white/40">Integrity</span>
            <span className="text-[10px] font-mono text-white/60">{Math.round(state.player.inventory.filter(i => i.is_equipped).reduce((acc, i) => acc + (i.integrity || 0), 0) / (state.player.inventory.filter(i => i.is_equipped).length || 1))}%</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
