import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Lock, Unlock } from 'lucide-react';
import { GameState } from '../../types';

interface FeatsModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

export const FeatsModal: React.FC<FeatsModalProps> = ({ state, dispatch }) => {
  const feats = state.player.feats;
  const unlockedCount = feats.filter(f => f.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
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
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
      >
        <button aria-label="Close Feats"
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_feats', value: false } })}
          className="absolute top-6 right-6 text-white/40 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Feats</h2>
            <span className="text-[10px] text-white/40 tracking-widest uppercase">
              {unlockedCount} / {feats.length} Unlocked
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / feats.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {feats.map(feat => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-sm border transition-all ${
                feat.unlocked
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-white/[0.02] border-white/[0.06] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${feat.unlocked ? 'text-amber-400' : 'text-white/20'}`}>
                  {feat.unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-serif ${feat.unlocked ? 'text-amber-300' : 'text-white/40'}`}>
                      {feat.name}
                    </span>
                    {feat.unlocked && feat.unlocked_on_day !== undefined && (
                      <span className="text-[8px] text-amber-500/50 tracking-widest uppercase shrink-0 ml-2">
                        Day {feat.unlocked_on_day}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] mt-1 ${feat.unlocked ? 'text-white/50' : 'text-white/25'}`}>
                    {feat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
