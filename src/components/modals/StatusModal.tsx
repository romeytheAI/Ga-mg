import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Skull, Bug, Users } from 'lucide-react';
import { GameState } from '../../types';
import { diseaseSummary, diseaseSeverityLabel } from '../../utils/diseaseEngine';
import { parasiteSummary } from '../../utils/parasiteEngine';
import { companionSummary } from '../../utils/companionEngine';

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
          aria-label="Close Physiological Matrix"
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

        {/* ── Milestone 10: Disease panel ─────────────────────────────────── */}
        {(() => {
          const ds = diseaseSummary(state.player.disease_state);
          return (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4 flex items-center gap-2">
                <Skull className="w-3 h-3" /> Health Status
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase text-white/40">Overall</span>
                <span className={`text-[11px] font-serif ${ds.is_sick ? 'text-red-400/90' : 'text-green-400/70'}`}>{ds.overall_label}</span>
              </div>
              {ds.is_sick ? (
                <div className="space-y-2">
                  {ds.entries.map(entry => (
                    <div key={entry.disease} className="p-2 bg-red-950/20 border border-red-900/20 rounded-sm">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-red-300/80 capitalize">{entry.disease.replace('_', ' ')}</span>
                        <span className={`${entry.treated ? 'text-green-400/60' : 'text-red-400/60'}`}>
                          {entry.severity_label}{entry.treated ? ' · Treated' : ''}
                        </span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-700/60" style={{ width: `${entry.severity}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">No active infections</p>
              )}
            </div>
          );
        })()}

        {/* ── Milestone 10: Parasite panel ────────────────────────────────── */}
        {(() => {
          const ps = parasiteSummary(state.player.parasite_state);
          return (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4 flex items-center gap-2">
                <Bug className="w-3 h-3" /> Infestation
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase text-white/40">Level</span>
                <span className={`text-[11px] font-serif ${ps.is_infested ? 'text-amber-400/80' : 'text-green-400/70'}`}>{ps.infestation_label}</span>
              </div>
              {ps.is_infested ? (
                <div className="space-y-2">
                  {ps.entries.map((entry, i) => (
                    <div key={i} className="p-2 bg-amber-950/20 border border-amber-900/20 rounded-sm">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-amber-300/80 capitalize">{entry.species.replace('_', ' ')}</span>
                        <span className="text-amber-400/50">{entry.symbiosis_label} · {Math.round(entry.maturity)}% maturity</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${entry.symbiosis > 60 ? 'bg-green-600/50' : 'bg-amber-700/60'}`} style={{ width: `${entry.maturity}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">No parasites detected</p>
              )}
            </div>
          );
        })()}

        {/* ── Milestone 10: Companion panel ───────────────────────────────── */}
        {(() => {
          const cs = companionSummary(state.player.companion_state);
          return (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Party ({cs.companion_count}/{cs.max_party_size})
              </h3>
              {cs.companion_count === 0 ? (
                <p className="text-[10px] text-white/20 italic">Travelling alone</p>
              ) : (
                <div className="space-y-2">
                  {cs.entries.map(c => (
                    <div key={c.id} className="p-2 bg-white/[0.02] border border-white/5 rounded-sm">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-white/70">{c.name}</span>
                        <span className="text-white/40 capitalize">{c.role}</span>
                      </div>
                      <div className="flex gap-4 text-[9px] text-white/40">
                        <span>{c.loyalty_label}</span>
                        <span>{c.bond_label}</span>
                        <span>{c.morale_label}</span>
                        <span className={c.health < 30 ? 'text-red-400/70' : 'text-white/40'}>{Math.round(c.health)}% hp</span>
                      </div>
                    </div>
                  ))}
                  {cs.combat_bonus > 0 && (
                    <div className="text-[9px] text-indigo-400/60 mt-1">⚔ Party combat bonus: +{Math.round(cs.combat_bonus)}</div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </motion.div>
    </motion.div>
  );
};
