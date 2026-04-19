import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { GameState } from '../../types';

interface DeveloperModeModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  onClose: () => void;
}

export const DeveloperModeModal: React.FC<DeveloperModeModalProps> = ({ state, dispatch, onClose }) => {
  const [developerJson, setDeveloperJson] = useState('');

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
            className="absolute w-1 h-1 bg-purple-500 rounded-full blur-[1px]"
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
        className="bg-[#0a0a0a] border border-purple-500/20 p-8 rounded-sm max-w-2xl w-full relative shadow-[0_0_50px_rgba(168,85,247,0.1)] z-10"
      >
        <button aria-label="Close Developer Mode"
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-serif text-purple-400 mb-2 flex items-center gap-3">
          <Settings className="w-5 h-5" />
          Developer Override
        </h2>
        <p className="text-xs text-white/40 mb-6">Inject raw JSON directly into the world state. Warning: May cause Dragon Breaks.</p>
        
        <textarea
          value={developerJson}
          onChange={e => setDeveloperJson(e.target.value)}
          placeholder='{ "world": { "current_location": { "name": "The Void" } } }'
          className="w-full h-64 bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-purple-500/40 transition-colors font-mono text-sm mb-6 resize-none"
        />

        <div className="flex gap-4">
          <button 
            onClick={() => {
              dispatch({ type: 'INJECT_DEVELOPER_JSON', payload: developerJson });
              onClose();
            }}
            className="flex-1 py-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm tracking-widest uppercase rounded-sm transition-colors border border-purple-500/20"
          >
            Inject State
          </button>
          <button 
            onClick={() => {
              setDeveloperJson(JSON.stringify(state, null, 2));
            }}
            className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white/60 text-sm tracking-widest uppercase rounded-sm transition-colors border border-white/10"
          >
            Dump Current
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
