import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Shield, Users, Swords, Star, GitBranch } from 'lucide-react';
import { GameState } from '../../types';
import { NPCS } from '../../data/npcs';
import { computeMilestone, MILESTONE_ORDER } from '../../utils/relationshipEngine';

interface SocialModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

const RELATIONSHIP_LABEL = (val: number) => {
  if (val >= 80) return { text: 'Beloved', color: 'text-pink-400' };
  if (val >= 50) return { text: 'Friendly', color: 'text-emerald-400' };
  if (val >= 20) return { text: 'Warm', color: 'text-green-400' };
  if (val >= 0) return { text: 'Neutral', color: 'text-white/50' };
  if (val >= -30) return { text: 'Wary', color: 'text-amber-400' };
  if (val >= -60) return { text: 'Hostile', color: 'text-orange-500' };
  return { text: 'Despised', color: 'text-red-500' };
};

const RELATIONSHIP_BAR_COLOR = (val: number) => {
  if (val >= 50) return 'bg-emerald-500';
  if (val >= 20) return 'bg-green-600';
  if (val >= 0) return 'bg-white/30';
  if (val >= -30) return 'bg-amber-500';
  return 'bg-red-600';
};

const MILESTONE_COLOR: Record<string, string> = {
  stranger:     'text-white/30 border-white/10',
  acquaintance: 'text-sky-400/70 border-sky-900/40',
  friend:       'text-green-400/80 border-green-900/40',
  close:        'text-emerald-400 border-emerald-800/50',
  lover:        'text-pink-400 border-pink-900/50',
  bonded:       'text-rose-400 border-rose-800/60',
};

const MILESTONE_LABEL: Record<string, string> = {
  stranger:     'Stranger',
  acquaintance: 'Acquaintance',
  friend:       'Friend',
  close:        'Close',
  lover:        'Lover',
  bonded:       'Bonded',
};

/** Visual progress through milestone tiers: 0–5 index */
function milestoneProgress(milestone: string): number {
  return MILESTONE_ORDER.indexOf(milestone as any);
}

export const SocialModal: React.FC<SocialModalProps> = ({ state, dispatch }) => {
  const [tab, setTab] = React.useState<'npcs' | 'companions' | 'reputation'>('npcs');

  const knownNpcs = Object.values(NPCS);
  const companions = state.player.companions;
  const fame = state.player.fame;
  const notoriety = state.player.notoriety;
  const npcRelationships = state.world.npc_relationships;

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
            className="absolute w-1 h-1 bg-pink-400 rounded-full blur-[1px]"
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
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-4xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
      >
        <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_social', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white" aria-label="Close modal">
              <X className="w-6 h-6" /></button>

        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Users className="w-5 h-5 text-pink-400" />
          <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Social</h2>
        </div>

        {/* Tab bar */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('npcs')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border rounded-sm transition-colors ${tab === 'npcs' ? 'border-pink-500/50 bg-pink-950/20 text-pink-400' : 'border-white/10 text-white/40 hover:text-white/60'}`}
          >
            <Heart className="w-3.5 h-3.5" /> Relationships
          </button>
          <button
            onClick={() => setTab('companions')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border rounded-sm transition-colors ${tab === 'companions' ? 'border-blue-500/50 bg-blue-950/20 text-blue-400' : 'border-white/10 text-white/40 hover:text-white/60'}`}
          >
            <Swords className="w-3.5 h-3.5" /> Companions
          </button>
          <button
            onClick={() => setTab('reputation')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border rounded-sm transition-colors ${tab === 'reputation' ? 'border-amber-500/50 bg-amber-950/20 text-amber-400' : 'border-white/10 text-white/40 hover:text-white/60'}`}
          >
            <Star className="w-3.5 h-3.5" /> Reputation
          </button>
        </div>

        {/* NPC Relationships */}
        {tab === 'npcs' && (
          <div className="space-y-3">
            {knownNpcs.map((npc: any, index: number) => {
              const rel = npc.relationship ?? 0;
              const label = RELATIONSHIP_LABEL(rel);
              const barPct = ((rel + 100) / 200) * 100; // -100..+100 → 0..100%

              // Depth data from world.npc_relationships
              const depth = npcRelationships[npc.id];
              const milestone = depth
                ? computeMilestone({ trust: depth.trust, love: depth.love })
                : 'stranger';
              const milestoneIdx = milestoneProgress(milestone);
              const milClr = MILESTONE_COLOR[milestone] || MILESTONE_COLOR.stranger;

              return (
                <motion.div
                  key={npc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="p-4 border border-white/5 bg-white/[0.02] rounded-sm"
                >
                  {/* Header row */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-serif text-white/90">{npc.name}</h3>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">{npc.race}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${milClr}`}>
                        {MILESTONE_LABEL[milestone]}
                      </span>
                      <span className={`text-[10px] uppercase tracking-widest ${label.color}`}>{label.text}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/40 mb-3 line-clamp-2">{npc.description}</p>

                  {/* Affection bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] text-red-400/60 uppercase w-10 shrink-0">Hostile</span>
                    <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/10" />
                      <motion.div
                        className={`h-full rounded-full ${RELATIONSHIP_BAR_COLOR(rel)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                    <span className="text-[8px] text-pink-400/60 uppercase w-10 shrink-0 text-right">Beloved</span>
                  </div>

                  {/* Milestone progression pip row */}
                  <div className="flex items-center gap-1 mb-3">
                    <GitBranch className="w-2.5 h-2.5 text-white/20 shrink-0 mr-1" />
                    {MILESTONE_ORDER.map((m, i) => (
                      <div
                        key={m}
                        title={MILESTONE_LABEL[m]}
                        className={`h-1.5 flex-1 rounded-full transition-all ${i <= milestoneIdx ? 'bg-pink-500/60' : 'bg-white/[0.05]'}`}
                      />
                    ))}
                  </div>

                  {/* Depth stats — only for NPCs with tracked relationships */}
                  {depth && (
                    <div className="grid grid-cols-5 gap-1.5 mt-2">
                      {[
                        { label: 'Trust', value: depth.trust, color: 'bg-sky-500' },
                        { label: 'Love',  value: depth.love,  color: 'bg-pink-500' },
                        { label: 'Fear',  value: depth.fear,  color: 'bg-amber-500' },
                        { label: 'Dom',   value: depth.dom,   color: 'bg-violet-500' },
                        { label: 'Sub',   value: depth.sub,   color: 'bg-rose-500' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                          <span className="text-[7px] uppercase text-white/25 tracking-widest">{label}</span>
                          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                          </div>
                          <span className="text-[7px] font-mono text-white/30">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interaction summary */}
                  {depth && (
                    <div className="flex gap-3 mt-2 pt-2 border-t border-white/5">
                      <span className="text-[8px] text-white/25 uppercase tracking-widest">
                        {depth.interaction_count} interaction{depth.interaction_count !== 1 ? 's' : ''}
                      </span>
                      {depth.last_interaction_day > 0 && (
                        <span className="text-[8px] text-white/25 uppercase tracking-widest">
                          Last: Day {depth.last_interaction_day}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Companions */}
        {tab === 'companions' && (
          <div className="space-y-3">
            {companions.active_party.length === 0 && companions.roster.length === 0 ? (
              <p className="text-white/40 italic text-sm text-center py-8">You have no companions yet. Build relationships to recruit allies.</p>
            ) : (
              <>
                {companions.active_party.length > 0 && (
                  <>
                    <h4 className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Active Party</h4>
                    {companions.active_party.map((comp, index) => (
                      <motion.div
                        key={comp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="p-4 border border-blue-900/30 bg-blue-950/10 rounded-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-serif text-white/90">{comp.name}</h3>
                          <span className="text-[10px] uppercase tracking-widest text-blue-400/60">{comp.type}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3 h-3 text-pink-400/60" />
                            <span className="text-[10px] text-white/50">Affection</span>
                            <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${comp.affection}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-amber-400/60" />
                            <span className="text-[10px] text-white/50">Fear</span>
                            <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${comp.fear}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-white/50">HP</span>
                            <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 rounded-full" style={{ width: `${comp.stats.health}%` }} />
                            </div>
                          </div>
                        </div>
                        {comp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {comp.tags.map(tag => (
                              <span key={tag} className="text-[7px] uppercase px-1.5 py-0.5 border border-white/10 text-white/30 rounded-sm">{tag}</span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </>
                )}
                {companions.roster.length > 0 && (
                  <>
                    <h4 className="text-[10px] uppercase tracking-widest text-white/30 mt-4 mb-2">Available Roster</h4>
                    {companions.roster.map((comp, index) => (
                      <motion.div
                        key={comp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="p-3 border border-white/5 bg-white/[0.02] rounded-sm flex justify-between items-center"
                      >
                        <div>
                          <span className="text-sm font-serif text-white/70">{comp.name}</span>
                          <span className="text-[10px] text-white/30 ml-2 uppercase">{comp.type}</span>
                        </div>
                        <Heart className="w-3 h-3 text-pink-400/40" />
                      </motion.div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Reputation */}
        {tab === 'reputation' && (
          <div className="space-y-6">
            <div className="p-4 border border-white/5 bg-white/[0.02] rounded-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-serif text-white/80 uppercase tracking-widest">Fame</h3>
                <span className="text-sm font-mono text-white/60">{fame}</span>
              </div>
              <p className="text-[10px] text-white/40 mb-3">How widely known and admired you are. Fame opens doors and attracts attention — both good and bad.</p>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${fame}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-white/20 uppercase">Unknown</span>
                <span className="text-[8px] text-white/20 uppercase">Legend</span>
              </div>
            </div>

            <div className="p-4 border border-white/5 bg-white/[0.02] rounded-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-serif text-white/80 uppercase tracking-widest">Notoriety</h3>
                <span className="text-sm font-mono text-white/60">{notoriety}</span>
              </div>
              <p className="text-[10px] text-white/40 mb-3">Your dark reputation. High notoriety makes guards suspicious, but earns respect in the underworld.</p>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${notoriety}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-white/20 uppercase">Invisible</span>
                <span className="text-[8px] text-white/20 uppercase">Infamous</span>
              </div>
            </div>

            {/* Psychology summary */}
            <div className="p-4 border border-white/5 bg-white/[0.02] rounded-sm">
              <h3 className="text-sm font-serif text-white/80 uppercase tracking-widest mb-4">Psychological Profile</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Submission', value: state.player.psych_profile.submission_index, color: 'bg-violet-600' },
                  { label: 'Cruelty', value: state.player.psych_profile.cruelty_index, color: 'bg-red-700' },
                  { label: 'Exhibitionism', value: state.player.psych_profile.exhibitionism, color: 'bg-pink-600' },
                  { label: 'Promiscuity', value: state.player.psych_profile.promiscuity, color: 'bg-rose-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-white/30 w-24 shrink-0">{label}</span>
                    <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                    </div>
                    <span className="text-[8px] font-mono text-white/30 w-6 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
