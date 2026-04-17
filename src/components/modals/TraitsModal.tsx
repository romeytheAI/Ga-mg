import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { GameState } from '../../types';

interface TraitsModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

export const TraitsModal: React.FC<TraitsModalProps> = ({ state, dispatch }) => {
  const traits = state.player.traits;
  const attitudes = state.player.attitudes;
  const lewdity = state.player.lewdity_stats;
  const insecurity = state.player.insecurity;
  const virginities = state.player.virginities;
  const sexualSkills = state.player.sexual_skills;
  const sensitivity = state.player.sensitivity;

  const ATTITUDE_COLORS = {
    defiant: 'text-red-400 border-red-500/30 bg-red-950/20',
    submissive: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
    neutral: 'text-white/50 border-white/10 bg-white/[0.02]',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full blur-[1px]"
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
        <button
          aria-label="Close Traits"
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_traits', value: false } })}
          className="absolute top-6 right-6 text-white/40 hover:text-white"
         aria-label="Close modal">
              <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Character Profile</h2>
        </div>

        {/* Attitudes */}
        <div className="mb-6">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">Attitudes</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['sexual', 'crime', 'labour'] as const).map(type => (
              <div key={type} className={`p-3 rounded-sm border ${ATTITUDE_COLORS[attitudes[type]]}`}>
                <span className="text-[8px] uppercase tracking-widest block mb-1 opacity-60">{type}</span>
                <span className="text-sm font-serif capitalize">{attitudes[type]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lewdity Stats */}
        <div className="mb-6">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">Lewdity</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(lewdity).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-white/50">{key}</span>
                  <span className="text-white/70">{Math.round(val)}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      key === 'exhibitionism' ? 'bg-pink-600' :
                      key === 'promiscuity' ? 'bg-rose-600' :
                      key === 'deviancy' ? 'bg-purple-600' :
                      'bg-red-700'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sexual Skills */}
        <div className="mb-6">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">Sexual Skills</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(sexualSkills).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-white/50">{key}</span>
                  <span className="text-white/70">{Math.round(val)}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitivity */}
        <div className="mb-6">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">Sensitivity</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(sensitivity).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-white/50">{key}</span>
                  <span className="text-white/70">{Math.round(val)}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-rose-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Virginities */}
        <div className="mb-6">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">Virginities</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(virginities).map(([key, val]) => (
              <div
                key={key}
                className={`p-2 rounded-sm border text-[10px] ${
                  val === null
                    ? 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400/70'
                    : 'border-red-500/20 bg-red-950/10 text-red-400/70'
                }`}
              >
                <span className="uppercase tracking-widest block">{key.replace('_', ' ')}</span>
                <span className="text-[9px] opacity-70">{val === null ? '✓ Intact' : val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insecurity */}
        <div className="mb-6">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">Insecurity</h3>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(insecurity).map(([key, val]) => (
              <div key={key} className="text-center">
                <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">{key}</span>
                <span className={`text-sm font-mono ${val > 60 ? 'text-red-400' : val > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {Math.round(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Traits */}
        <div>
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3">
            Active Traits {traits.length > 0 && <span className="text-white/20">({traits.length})</span>}
          </h3>
          {traits.length === 0 ? (
            <p className="text-[10px] text-white/20 italic">No active traits.</p>
          ) : (
            <div className="space-y-2">
              {traits.map(trait => (
                <div
                  key={trait.id}
                  className="p-3 bg-violet-950/20 border border-violet-500/20 rounded-sm flex items-start justify-between"
                >
                  <div>
                    <span className="text-sm font-serif text-violet-300">{trait.name}</span>
                    <p className="text-[10px] text-white/40 mt-0.5">{trait.description}</p>
                    {Object.keys(trait.effects).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(trait.effects).map(([stat, val]) => (
                          <span
                            key={stat}
                            className={`text-[8px] px-1.5 py-0.5 rounded-sm border ${
                              (val as number) > 0
                                ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10'
                                : 'text-red-400 border-red-500/20 bg-red-950/10'
                            }`}
                          >
                            {stat} {(val as number) > 0 ? '+' : ''}{val as number}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    aria-label={`Remove trait ${trait.name}`}
                    onClick={() => dispatch({ type: 'REMOVE_TRAIT', payload: trait.id })}
                    className="text-white/20 hover:text-red-400 transition-colors shrink-0 ml-2"
                    title={`Remove trait ${trait.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
