import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { saveGame, loadGame, getAllSaves, deleteSave, SAVE_SCHEMA_VERSION } from '../utils/saveManager';
import { GameState } from '../types';
import { X, Save, Download, Trash2, AlertTriangle } from '../components/Icons';

interface SaveLoadModalProps {
  onClose: () => void;
  onLoad: (state: GameState) => void;
  currentState: GameState;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ onClose, onLoad, currentState }) => {
  const [saves, setSaves] = useState<any[]>([]);

  useEffect(() => {
    refreshSaves();
  }, []);

  const refreshSaves = async () => {
    const allSaves = await getAllSaves();
    setSaves(allSaves);
  };

  const handleSave = async () => {
    const id = Date.now().toString();
    await saveGame(id, currentState);
    refreshSaves();
  };

  const handleLoad = async (id: string) => {
    const state = await loadGame(id);
    if (state) {
      onLoad(state);
      onClose();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSave(id);
    refreshSaves();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      >
        {/* Ambient Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-500 rounded-full blur-[1px]"
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
          <button aria-label="Close modal" onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Chronicles</h2>
            <span className="text-[9px] uppercase tracking-widest text-white/20 font-mono mt-1.5">
              Schema v{SAVE_SCHEMA_VERSION}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave} 
            className="w-full border border-emerald-900/50 bg-emerald-950/10 text-emerald-400 p-4 rounded-sm mb-8 flex items-center justify-center gap-3 tracking-widest uppercase text-sm transition-colors"
          >
            <Save className="w-5 h-5" />
            Inscribe Current State
          </motion.button>
          
          <div className="space-y-4">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Past Inscriptions</h3>
            {saves.length === 0 ? (
              <p className="text-white/40 italic text-sm text-center py-8">No chronicles found.</p>
            ) : (
              saves.map((save, index) => {
                const schemaVersion: number = save.schemaVersion ?? 1;
                const isMigrated = schemaVersion < SAVE_SCHEMA_VERSION;
                const traumaVal: number = save.trauma ?? 0;
                const isRestrained = !!(save.state?.player?.restraints?.entries?.length);

                return (
                  <motion.div 
                    key={save.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-start border border-white/5 bg-white/[0.02] p-4 rounded-sm group hover:border-white/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white/90 font-serif text-lg truncate">{save.name ?? save.player_name}</p>
                        {isRestrained && (
                          <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 border border-violet-900/50 text-violet-400 rounded-sm shrink-0">⛓ Bound</span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs tracking-widest uppercase mt-1">
                        {save.location} — Day {save.day}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {traumaVal > 0 && (
                          <span className="text-[8px] uppercase tracking-widest text-red-400/60">
                            Trauma {traumaVal}
                          </span>
                        )}
                        <span className="text-[8px] uppercase tracking-widest text-white/20 font-mono">
                          v{schemaVersion}
                        </span>
                        {isMigrated && (
                          <span className="flex items-center gap-0.5 text-[8px] uppercase tracking-widest text-amber-400/60">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Legacy save
                          </span>
                        )}
                        {save.timestamp && (
                          <span className="text-[8px] text-white/15 font-mono">
                            {new Date(save.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 shrink-0 ml-3">
                      <motion.button 
                        whileHover={{ scale: 1.1, color: "rgb(96, 165, 250)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLoad(save.id)} 
                        aria-label={`Load save ${save.name ?? save.player_name}`}
                        className="text-blue-400/70 p-2 border border-blue-900/30 rounded-sm bg-blue-950/20 transition-colors"
                        title="Load"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, color: "rgb(248, 113, 113)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(save.id)} 
                        aria-label={`Delete save ${save.name ?? save.player_name}`}
                        className="text-red-400/70 p-2 border border-red-900/30 rounded-sm bg-red-950/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
