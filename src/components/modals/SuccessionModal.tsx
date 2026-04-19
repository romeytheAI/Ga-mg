import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Skull, ArrowRight, UserPlus } from 'lucide-react';
import { GameState } from '../../types';

interface SuccessionModalProps {
  state: GameState;
  onConfirm: () => void;
}

export const SuccessionModal: React.FC<SuccessionModalProps> = ({ state, onConfirm }) => {
  const d = state.player.dynasty;
  const heir = d.lineage.find(l => l.relationship === 'child' && l.status === 'alive');
  const isLocket = d.is_locket_possessed;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full space-y-8"
      >
        <div className="relative inline-block">
          {isLocket ? (
            <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
              <Skull className="w-10 h-10 text-red-400/60" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-serif text-white/90 tracking-tighter uppercase">
            {isLocket ? "Vessel Expired" : "The End of an Era"}
          </h2>
          <p className="text-white/40 font-serif italic text-lg leading-relaxed">
            {isLocket 
              ? "The physical frame has failed, but the locket remains. Your consciousness seeks a new mind to inhabit."
              : `The tale of ${state.player.identity.name} has concluded. The annals of ${d.house_name} will record their deeds.`}
          </p>
        </div>

        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-sm">
          <div className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4 font-bold">The Next Chapter</div>
          {heir || isLocket ? (
            <div className="space-y-4">
              <div className="text-2xl font-serif text-sky-300">
                {isLocket ? "Seeking New Host..." : heir?.name}
              </div>
              <div className="text-[10px] tracking-widest uppercase text-white/50">
                {isLocket ? "Inherit Memories & Locket" : `Heir to ${d.house_name}`}
              </div>
            </div>
          ) : (
            <div className="text-red-400 uppercase tracking-widest text-xs">Lineage Severed. No Heir found.</div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="group relative px-12 py-4 bg-white text-black font-bold text-xs tracking-[0.3em] uppercase rounded-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          <span className="relative z-10 flex items-center gap-3">
            {isLocket ? "Inhabit New Vessel" : "Continue Lineage"} <ArrowRight className="w-4 h-4" />
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
