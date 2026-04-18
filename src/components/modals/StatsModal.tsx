import React from 'react';
import { motion } from 'motion/react';
import { X, Briefcase, Zap, Star } from '../../components/Icons';
import { GameState, StatKey } from '../../types';
import { CharacterModel } from '../CharacterModel';
import { JOB_LABELS, jobRiskLevel } from '../../utils/jobEngine';
import { addictionSummary, substanceLabel } from '../../utils/addictionEngine';
import { transformationSummary, ascensionLabel, mutationResistanceLabel } from '../../utils/transformationEngine';
import { fameSummary } from '../../utils/fameEngine';
import { allureSummary } from '../../utils/allureEngine';

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
        <button aria-label="Close Stats" onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_stats', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
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

          {/* Body Fluids */}
          <div className="col-span-2 space-y-4 mt-4 pt-6 border-t border-white/10">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Body Fluids</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(state.player.body_fluids).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-[10px] tracking-widest uppercase">
                    <span className="text-white/40">{key.replace('_', ' ')}</span>
                    <span className="text-white/70">{Math.round(val)}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        key === 'arousal_wetness' ? 'bg-pink-500/70' :
                        key === 'tears' ? 'bg-cyan-400/70' :
                        key === 'sweat' ? 'bg-amber-500/70' :
                        key === 'milk' ? 'bg-white/70' :
                        'bg-blue-400/70'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="col-span-2 space-y-4 mt-4 pt-6 border-t border-white/10">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Temperature</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm text-center">
                <span className="text-[9px] uppercase text-white/30 block mb-1">Ambient</span>
                <span className="text-sm text-white/80 font-mono">{state.player.temperature.ambient_temp}°</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm text-center">
                <span className="text-[9px] uppercase text-white/30 block mb-1">Warmth</span>
                <span className="text-sm text-white/80 font-mono">{state.player.temperature.clothing_warmth}</span>
              </div>
              <div className={`p-3 rounded-sm text-center border ${
                state.player.temperature.body_temp === 'freezing' ? 'bg-cyan-950/30 border-cyan-500/30' :
                state.player.temperature.body_temp === 'cold' ? 'bg-blue-950/20 border-blue-500/20' :
                state.player.temperature.body_temp === 'comfortable' ? 'bg-emerald-950/20 border-emerald-500/20' :
                state.player.temperature.body_temp === 'overheating' ? 'bg-red-950/30 border-red-500/30' :
                'bg-white/[0.02] border-white/5'
              }`}>
                <span className="text-[9px] uppercase text-white/30 block mb-1">Body</span>
                <span className={`text-sm font-serif capitalize ${
                  state.player.temperature.body_temp === 'freezing' ? 'text-cyan-300' :
                  state.player.temperature.body_temp === 'cold' ? 'text-blue-300' :
                  state.player.temperature.body_temp === 'comfortable' ? 'text-emerald-300' :
                  state.player.temperature.body_temp === 'overheating' ? 'text-red-300' :
                  'text-white/70'
                }`}>{state.player.temperature.body_temp}</span>
              </div>
            </div>
          </div>

          {/* Bailey Payment */}
          {state.player.bailey_payment.debt > 0 && (
            <div className="col-span-2 space-y-4 mt-4 pt-6 border-t border-white/10">
              <h3 className="text-xs tracking-widest uppercase text-red-400/60 mb-2">Bailey&apos;s Debt</h3>
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-sm">
                <div className="flex justify-between text-[11px]">
                  <span className="text-red-400/70 uppercase tracking-widest">Total Owed</span>
                  <span className="text-red-400 font-mono font-bold">{state.player.bailey_payment.debt} gold</span>
                </div>
                <div className="flex justify-between text-[10px] mt-2">
                  <span className="text-white/40">Weekly Rate</span>
                  <span className="text-white/60 font-mono">{state.player.bailey_payment.weekly_amount}g</span>
                </div>
                <div className="flex justify-between text-[10px] mt-1">
                  <span className="text-white/40">Missed Payments</span>
                  <span className="text-red-400/70 font-mono">{state.player.bailey_payment.missed_payments}</span>
                </div>
                <div className="flex justify-between text-[10px] mt-1">
                  <span className="text-white/40">Punishment Level</span>
                  <span className={`font-mono ${
                    state.player.bailey_payment.punishment_level >= 3 ? 'text-red-400' :
                    state.player.bailey_payment.punishment_level >= 2 ? 'text-orange-400' :
                    state.player.bailey_payment.punishment_level >= 1 ? 'text-amber-400' :
                    'text-white/50'
                  }`}>
                    {['None', 'Scolding', 'Beating', 'Sold'][state.player.bailey_payment.punishment_level]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Milestone 9: Employment & Addiction ─────────────────────── */}
          <div className="col-span-2 space-y-4 mt-4 pt-6 border-t border-white/10">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2 flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Employment &amp; Substances
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Current job */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[9px] uppercase text-white/30 block mb-1">Current Job</span>
                <span className="text-sm text-white/80 font-serif capitalize">
                  {JOB_LABELS[state.player.player_job]}
                </span>
                <span className={`text-[9px] mt-1 block ${
                  jobRiskLevel(state.player.player_job) === 'dangerous' ? 'text-red-400/70' :
                  jobRiskLevel(state.player.player_job) === 'moderate'  ? 'text-amber-400/70' :
                  'text-green-400/70'
                }`}>
                  {jobRiskLevel(state.player.player_job) !== 'safe' ? `⚠ ${jobRiskLevel(state.player.player_job)}` : '✓ safe'}
                </span>
              </div>
              {/* Overall addiction */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[9px] uppercase text-white/30 block mb-1">Dependency</span>
                {(() => {
                  const summary = addictionSummary(state.player.addiction_state);
                  return summary.substance_count === 0 ? (
                    <span className="text-sm text-green-400/70 font-serif">Clean</span>
                  ) : (
                    <>
                      <span className={`text-sm font-serif ${summary.overall_label === 'Crippling' ? 'text-red-400' : summary.overall_label === 'Severe' ? 'text-orange-400' : 'text-amber-400'}`}>
                        {summary.overall_label}
                      </span>
                      <span className="text-[9px] text-white/40 block">{summary.substance_count} substance{summary.substance_count > 1 ? 's' : ''}</span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Addiction detail rows */}
            {(() => {
              const summary = addictionSummary(state.player.addiction_state);
              if (summary.substance_count === 0) return null;
              return (
                <div className="space-y-2">
                  {summary.entries.map(entry => (
                    <div key={entry.substance} className="p-2 bg-white/[0.02] border border-white/5 rounded-sm">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-white/60">{substanceLabel(entry.substance)}</span>
                        <span className={entry.withdrawal > 20 ? 'text-red-400/80' : 'text-white/40'}>{entry.withdrawal_label !== 'None' ? `Withdrawing: ${entry.withdrawal_label}` : entry.label}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600/60" style={{ width: `${entry.dependency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* ── Milestone 10: Transformation / Ascension ────────────────── */}
          {(() => {
            const tSummary = transformationSummary(state.player.transformation);
            return (
              <div className="col-span-2 space-y-4 mt-4 pt-6 border-t border-white/10">
                <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Transformation
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                    <span className="text-[9px] uppercase text-white/30 block mb-1">Ascension Path</span>
                    <span className={`text-sm font-serif ${tSummary.ascension_path !== 'none' ? 'text-violet-300' : 'text-white/50'}`}>
                      {tSummary.ascension_label}
                    </span>
                    {tSummary.ascension_path !== 'none' && (
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-violet-500/60" style={{ width: `${tSummary.ascension_progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                    <span className="text-[9px] uppercase text-white/30 block mb-1">Mutation Resistance</span>
                    <span className="text-sm text-white/70 font-serif">{tSummary.mutation_resistance_label}</span>
                    <span className="text-[9px] text-white/30 block mt-1">{tSummary.body_change_count} change{tSummary.body_change_count !== 1 ? 's' : ''} ({tSummary.permanent_change_count} permanent)</span>
                  </div>
                </div>
                {state.player.transformation.body_changes.length > 0 && (
                  <div className="space-y-1">
                    {state.player.transformation.body_changes.map(change => (
                      <div key={change.id} className="flex items-center justify-between text-[10px] px-2 py-1 bg-white/[0.02] border border-white/5 rounded-sm">
                        <span className="text-white/60">{change.description}</span>
                        <span className={`text-[9px] ${change.permanent ? 'text-violet-400/60' : 'text-white/30'}`}>
                          {change.type}{change.permanent ? ' · permanent' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Milestone 11: Fame & Allure ──────────────────────────────── */}
          {(() => {
            const fs = fameSummary(state.player.fame_record);
            const as_ = allureSummary(state);
            const fameCategories = [
              { key: 'social',      label: 'Social',      value: fs.social,      color: 'bg-sky-500' },
              { key: 'wealth_fame', label: 'Wealth',      value: fs.wealth_fame, color: 'bg-amber-500' },
              { key: 'combat_fame', label: 'Combat',      value: fs.combat_fame, color: 'bg-red-500' },
              { key: 'crime',       label: 'Crime',       value: fs.crime,       color: 'bg-orange-500' },
              { key: 'infamy',      label: 'Infamy',      value: fs.infamy,      color: 'bg-rose-700' },
            ] as const;
            return (
              <div className="bg-white/[0.03] border border-white/10 rounded p-3 space-y-3">
                <div className="flex items-center gap-2 text-amber-300/80 text-[10px] uppercase tracking-widest font-semibold">
                  <Star className="w-3 h-3" /> Fame &amp; Allure
                </div>

                {/* Fame breakdown */}
                <div className="space-y-1">
                  {fameCategories.map(({ key, label, value, color }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-[9px] text-white/40 w-14">{label}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                      </div>
                      <span className="text-[9px] text-white/40 w-6 text-right">{Math.round(value)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 text-[9px]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300/80">{fs.fame_label}</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-700/20 text-rose-400/80">{fs.notoriety_label}</span>
                </div>

                {/* Allure panel */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white/[0.02] border border-white/5 rounded-sm">
                    <span className="text-[9px] uppercase text-white/30 block mb-1">Allure</span>
                    <span className="text-sm text-white/70 font-serif">{as_.allure_label}</span>
                    <span className="text-[9px] text-white/30 block mt-0.5">{Math.round(as_.effective_allure)}/100</span>
                  </div>
                  <div className="p-2 bg-white/[0.02] border border-white/5 rounded-sm">
                    <span className="text-[9px] uppercase text-white/30 block mb-1">Presence</span>
                    <span className="text-sm text-white/70 font-serif">{as_.noticeability_label}</span>
                    <span className="text-[9px] text-white/30 block mt-0.5">{as_.intimidation_label}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </motion.div>
  );
};
