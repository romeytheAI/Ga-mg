import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Wind, Shield, Flame, Droplets, Sun, Moon, Zap, Coffee, Users, Star } from 'lucide-react';
import { GameState, StatKey, Incubation } from '../types';
import { DoLCharacterSprite } from './DoLCharacterSprite';

const GltfExportButton = React.lazy(() => import('./GltfExportButton').then(m => ({ default: m.GltfExportButton })));
const GltfViewer3D = React.lazy(() => import('./GltfViewer3D').then(m => ({ default: m.GltfViewer3D })));

interface DoLStatsSidebarProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  onOpenStats: () => void;
  onOpenInventory: () => void;
}

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon?: React.ReactNode;
  pulseLow?: boolean;
  pulseHigh?: boolean;
  invert?: boolean; // for stats where high = bad (like trauma, corruption)
}

const StatBar: React.FC<StatBarProps> = ({
  label, value, max = 100, color, icon, pulseLow, pulseHigh, invert
}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isLow = pulseLow && pct < 25;
  const isHigh = pulseHigh && pct > 75;
  const pulse = isLow || isHigh;

  return (
    <div className="flex items-center gap-1.5 group">
      {icon && (
        <div className={`w-3.5 h-3.5 shrink-0 ${pulse ? 'animate-pulse' : ''} text-white/40`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className={`text-[9px] tracking-widest uppercase ${pulse ? 'text-white/80' : 'text-white/40'} truncate`}>
            {label}
          </span>
          <span className={`text-[9px] font-mono ml-1 shrink-0 ${pulse ? 'text-white/90 font-bold' : 'text-white/50'}`}>
            {Math.round(value)}{max !== 100 ? `/${max}` : ''}
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 mt-3 mb-1.5">
    <span className="text-[8px] tracking-[0.25em] uppercase text-white/25 whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-white/[0.06]" />
  </div>
);

const SKILL_COLOR: Record<string, string> = {
  seduction: 'bg-pink-600',
  athletics: 'bg-green-600',
  skulduggery: 'bg-gray-500',
  swimming: 'bg-cyan-600',
  dancing: 'bg-purple-500',
  housekeeping: 'bg-amber-700',
  lore_mastery: 'bg-blue-600',
  tending: 'bg-lime-600',
  cooking: 'bg-orange-600',
  foraging: 'bg-emerald-700',
};

/** Sprite with inline X-Ray toggle button */
const SpriteWithXRay: React.FC<{ state: GameState }> = ({ state }) => {
  const [xrayOn, setXrayOn] = useState(false);
  const [view3D, setView3D] = useState(false);
  return (
    <div className="relative">
      {view3D ? (
        <React.Suspense fallback={<div className="text-white/20 text-xs text-center p-4">Loading 3D…</div>}>
        <GltfViewer3D
          state={state}
          height="225px"
          combatAnimation={state.ui.combat_animation}
        />
        </React.Suspense>
      ) : (
        <DoLCharacterSprite state={state} compact={false} showXRay={xrayOn} />
      )}
      <button
        onClick={() => setXrayOn(!xrayOn)}
        className={`absolute top-1 left-1 text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border transition-all ${
          xrayOn
            ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
            : 'bg-black/40 border-white/10 text-white/40 hover:text-white/70 hover:border-white/25'
        }`}
      >
        X-RAY
      </button>
      <div className="absolute top-1 right-1 flex gap-1">
        <button
          onClick={() => setView3D(!view3D)}
          className={`text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border transition-all ${
            view3D
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
              : 'bg-black/40 border-white/10 text-white/40 hover:text-white/70 hover:border-white/25'
          }`}
          title="Toggle high-fidelity 3D view"
        >
          3D
        </button>
        <React.Suspense fallback={null}><GltfExportButton state={state} /></React.Suspense>
      </div>
    </div>
  );
};

export const DoLStatsSidebar: React.FC<DoLStatsSidebarProps> = React.memo(({
  state, dispatch, onOpenStats, onOpenInventory
}) => {
  const { stats, skills, life_sim, clothing, biology, psych_profile, temperature, bailey_payment, lewdity_stats, attitudes } = state.player;

  // Clothing slot integrity summary
  const clothingSlots = ['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'] as const;
  const equippedClothing = clothingSlots.map(slot => ({ slot, item: clothing[slot] })).filter(({ item }) => item !== null);
  const hasExposure = !clothing.chest || !clothing.underwear;

  // Time formatting
  const hour = state.world.hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const timeStr = `${displayHour}:00 ${ampm}`;
  const isNight = hour < 6 || hour >= 21;

  return (
    <div className="w-52 shrink-0 border-r border-white/[0.06] bg-[#080808] flex flex-col overflow-y-auto scrollbar-hide z-20">
      
      {/* Character Identity Header */}
      <div
        className="p-3 border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={onOpenStats}
      >
        <div className="text-xs font-serif text-white/80 truncate">{state.player.identity.name}</div>
        <div className="text-[9px] text-white/35 uppercase tracking-widest">
          {state.player.identity.race} · {Math.floor(state.player.age_days / 365)}y
        </div>
      </div>

      {/* Character Sprite with X-Ray toggle */}
      <div className="relative flex justify-center py-3 border-b border-white/[0.06] bg-black/30">
        <SpriteWithXRay state={state} />
      </div>

      {/* Location / Time / Weather */}
      <div className="px-3 py-2 border-b border-white/[0.06] bg-black/20">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-white/50 truncate max-w-[110px]">
            {state.world.current_location.name}
          </span>
          <span className={`text-[9px] font-mono ${isNight ? 'text-indigo-400/80' : 'text-amber-400/80'}`}>
            {timeStr}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[8px] text-white/25 uppercase tracking-widest">Day {state.world.day}</span>
          <span className="text-[8px] text-white/35">{state.world.weather}</span>
        </div>
        {/* Season badge */}
        {state.sim_world && (
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
              state.sim_world.season === 'spring' ? 'text-green-400/60 border-green-900/30 bg-green-950/10' :
              state.sim_world.season === 'summer' ? 'text-amber-400/60 border-amber-900/30 bg-amber-950/10' :
              state.sim_world.season === 'autumn' ? 'text-orange-400/60 border-orange-900/30 bg-orange-950/10' :
              'text-cyan-400/60 border-cyan-900/30 bg-cyan-950/10'
            }`}>
              {state.sim_world.season}
            </span>
            {/* Danger level in sidebar */}
            <span className={`text-[7px] uppercase tracking-widest ${
              state.world.current_location.danger > 60 ? 'text-red-400/70' :
              state.world.current_location.danger > 30 ? 'text-amber-400/50' :
              'text-emerald-400/40'
            }`}>
              {state.world.current_location.danger > 60 ? '☠ Dangerous' :
               state.world.current_location.danger > 30 ? '⚠ Risky' : '✓ Safe'}
            </span>
          </div>
        )}
        {/* Low needs warnings in sidebar */}
        {(life_sim.needs.hunger <= 20 || life_sim.needs.thirst <= 15 || life_sim.needs.energy <= 20) && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {life_sim.needs.hunger <= 20 && (
              <span className="text-[7px] uppercase tracking-widest px-1 py-0.5 rounded-sm border border-amber-700/40 bg-amber-950/20 text-amber-400/80 animate-pulse">Starving</span>
            )}
            {life_sim.needs.thirst <= 15 && (
              <span className="text-[7px] uppercase tracking-widest px-1 py-0.5 rounded-sm border border-cyan-700/40 bg-cyan-950/20 text-cyan-400/80 animate-pulse">Dehydrated</span>
            )}
            {life_sim.needs.energy <= 20 && (
              <span className="text-[7px] uppercase tracking-widest px-1 py-0.5 rounded-sm border border-yellow-700/40 bg-yellow-950/20 text-yellow-400/80 animate-pulse">Exhausted</span>
            )}
          </div>
        )}
      </div>

      {/* Stats panels */}
      <div className="flex-1 px-3 py-2 space-y-0.5">

        <SectionHeader label="Vitals" />
        <StatBar
          label="Health" value={stats.health} max={stats.max_health}
          color="bg-red-600" icon={<Heart className="w-3 h-3" />}
          pulseLow
        />
        <StatBar
          label="Stamina" value={stats.stamina} max={stats.max_stamina}
          color="bg-emerald-600" icon={<Wind className="w-3 h-3" />}
          pulseLow
        />
        <StatBar
          label="Willpower" value={stats.willpower} max={stats.max_willpower}
          color="bg-blue-600" icon={<Shield className="w-3 h-3" />}
          pulseLow
        />

        <SectionHeader label="Mind & Spirit" />
        <StatBar
          label="Purity" value={stats.purity}
          color="bg-white/70"
          pulseLow
        />
        <StatBar
          label="Corruption" value={stats.corruption}
          color="bg-purple-700" icon={<Moon className="w-3 h-3" />}
          invert pulseHigh
        />
        <StatBar
          label="Trauma" value={stats.trauma}
          color="bg-orange-700" 
          invert pulseHigh
        />
        <StatBar
          label="Stress" value={stats.stress}
          color="bg-yellow-700"
          invert pulseHigh
        />
        {stats.hallucination > 0 && (
          <StatBar
            label="Hallucination" value={stats.hallucination}
            color="bg-fuchsia-800"
            invert pulseHigh
          />
        )}
        {stats.pain > 0 && (
          <StatBar
            label="Pain" value={stats.pain}
            color="bg-red-800"
            invert pulseHigh
          />
        )}

        <SectionHeader label="Desire" />
        <StatBar
          label="Lust" value={stats.lust}
          color="bg-pink-600" icon={<Flame className="w-3 h-3" />}
          pulseHigh
        />
        <StatBar
          label="Arousal" value={stats.arousal}
          color="bg-rose-700"
          pulseHigh
        />
        <StatBar
          label="Allure" value={stats.allure}
          color="bg-fuchsia-600" icon={<Star className="w-3 h-3" />}
        />

        {/* Needs / Life Sim */}
        <SectionHeader label="Needs" />
        <StatBar
          label="Hunger" value={life_sim.needs.hunger}
          color="bg-amber-600" icon={<Coffee className="w-3 h-3" />}
          pulseLow
        />
        <StatBar
          label="Thirst" value={life_sim.needs.thirst}
          color="bg-cyan-700" icon={<Droplets className="w-3 h-3" />}
          pulseLow
        />
        <StatBar
          label="Energy" value={life_sim.needs.energy}
          color="bg-yellow-500" icon={<Zap className="w-3 h-3" />}
          pulseLow
        />
        <StatBar
          label="Hygiene" value={stats.hygiene}
          color="bg-teal-600" icon={<Sun className="w-3 h-3" />}
          pulseLow
        />
        <StatBar
          label="Social" value={life_sim.needs.social}
          color="bg-indigo-600" icon={<Users className="w-3 h-3" />}
          pulseLow
        />

        {/* Psychology */}
        <SectionHeader label="Psychology" />
        <StatBar
          label="Submission" value={psych_profile.submission_index}
          color="bg-violet-700"
        />
        <StatBar
          label="Exhibitionism" value={psych_profile.exhibitionism}
          color="bg-pink-700"
        />
        <StatBar
          label="Control" value={stats.control}
          color="bg-sky-600"
          pulseLow
        />

        {/* Temperature */}
        <SectionHeader label="Temperature" />
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[8px] uppercase tracking-wider text-white/35 w-12 shrink-0">Body</span>
          <span className={`text-[9px] capitalize font-mono ${
            temperature.body_temp === 'freezing' ? 'text-cyan-300 animate-pulse' :
            temperature.body_temp === 'cold' ? 'text-cyan-400' :
            temperature.body_temp === 'chilly' ? 'text-blue-400' :
            temperature.body_temp === 'comfortable' ? 'text-emerald-400' :
            temperature.body_temp === 'warm' ? 'text-amber-400' :
            temperature.body_temp === 'hot' ? 'text-orange-400' :
            'text-red-400 animate-pulse'
          }`}>{temperature.body_temp}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[8px] uppercase tracking-wider text-white/35 w-12 shrink-0">Warmth</span>
          <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-orange-500" initial={{ width: 0 }} animate={{ width: `${temperature.clothing_warmth}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[8px] font-mono text-white/30 w-5 text-right shrink-0">{temperature.clothing_warmth}</span>
        </div>

        {/* Lewdity */}
        {(lewdity_stats.exhibitionism > 0 || lewdity_stats.promiscuity > 0 || lewdity_stats.deviancy > 0 || lewdity_stats.masochism > 0) && (
          <>
            <SectionHeader label="Lewdity" />
            {lewdity_stats.exhibitionism > 0 && (
              <StatBar label="Exhib." value={lewdity_stats.exhibitionism} color="bg-pink-600" />
            )}
            {lewdity_stats.promiscuity > 0 && (
              <StatBar label="Promisc." value={lewdity_stats.promiscuity} color="bg-rose-600" />
            )}
            {lewdity_stats.deviancy > 0 && (
              <StatBar label="Deviancy" value={lewdity_stats.deviancy} color="bg-purple-600" />
            )}
            {lewdity_stats.masochism > 0 && (
              <StatBar label="Masochism" value={lewdity_stats.masochism} color="bg-red-700" />
            )}
          </>
        )}

        {/* Attitudes */}
        <SectionHeader label="Attitudes" />
        {(['sexual', 'crime', 'labour'] as const).map(type => (
          <div key={type} className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[8px] uppercase tracking-wider text-white/35 w-12 shrink-0">{type}</span>
            <span className={`text-[9px] capitalize font-mono ${
              attitudes[type] === 'defiant' ? 'text-red-400' :
              attitudes[type] === 'submissive' ? 'text-purple-400' :
              'text-white/50'
            }`}>{attitudes[type]}</span>
          </div>
        ))}

        {/* Bailey Payment */}
        {bailey_payment.debt > 0 && (
          <>
            <SectionHeader label="Bailey's Debt" />
            <div className="p-2 bg-red-950/20 border border-red-900/30 rounded-sm mb-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-red-400/70 uppercase tracking-widest">Owed</span>
                <span className="text-red-400 font-mono">{bailey_payment.debt}g</span>
              </div>
              {bailey_payment.missed_payments > 0 && (
                <div className="flex justify-between text-[8px] mt-0.5">
                  <span className="text-red-400/50">Missed</span>
                  <span className="text-red-400/70 font-mono">{bailey_payment.missed_payments}×</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Gold & Reputation */}
        <SectionHeader label="Standing" />
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[8px] uppercase tracking-wider text-amber-400/50 w-12 shrink-0">Gold</span>
          <span className="text-sm font-mono text-amber-400">{state.player.gold}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[8px] uppercase tracking-wider text-white/35 w-12 shrink-0">Fame</span>
          <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-amber-500" initial={{ width: 0 }} animate={{ width: `${state.player.fame}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[8px] font-mono text-white/30 w-5 text-right shrink-0">{state.player.fame}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[8px] uppercase tracking-wider text-white/35 w-12 shrink-0">Infamy</span>
          <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-red-700" initial={{ width: 0 }} animate={{ width: `${state.player.notoriety}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[8px] font-mono text-white/30 w-5 text-right shrink-0">{state.player.notoriety}</span>
        </div>

        {/* Skills */}
        <SectionHeader label="Skills" />
        {Object.entries(skills).map(([skill, levelRaw]) => {
          const level = Number(levelRaw) || 0;
          return (
            <div key={skill} className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[8px] uppercase tracking-wider text-white/35 w-16 truncate shrink-0">{skill.replace('_', ' ')}</span>
              <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${SKILL_COLOR[skill] || 'bg-white/40'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, level)}%` }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                />
              </div>
              <span className="text-[8px] font-mono text-white/30 w-5 text-right shrink-0">{level}</span>
            </div>
          );
        })}

        {/* Clothing Integrity */}
        {equippedClothing.length > 0 && (
          <>
            <SectionHeader label="Clothing" />
            {equippedClothing.map(({ slot, item }) => {
              if (!item) return null;
              const integ = item.integrity ?? 100;
              const maxInteg = item.max_integrity ?? 100;
              const pct = (integ / maxInteg) * 100;
              const dmgColor = pct > 60 ? 'bg-white/50' : pct > 30 ? 'bg-amber-500' : 'bg-red-600';
              return (
                <div key={slot} className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-white/30 w-12 truncate shrink-0">{slot}</span>
                  <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${dmgColor} ${pct < 20 ? 'animate-pulse' : ''}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className={`text-[8px] font-mono w-6 text-right shrink-0 ${pct < 20 ? 'text-red-400' : 'text-white/30'}`}>
                    {Math.round(integ)}
                  </span>
                </div>
              );
            })}
            {hasExposure && (
              <div className="mt-1 text-[8px] text-red-400/80 uppercase tracking-widest animate-pulse text-center">
                ⚠ Exposed
              </div>
            )}
          </>
        )}

        {/* Biology */}
        {(biology.parasites.length > 0 || biology.incubations.length > 0 || biology.heat_rut_active) && (
          <>
            <SectionHeader label="Biology" />
            {biology.heat_rut_active && (
              <div className="text-[8px] text-pink-400/80 uppercase tracking-widest animate-pulse text-center mb-1">
                ♥ Heat Active
              </div>
            )}
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[8px] uppercase text-white/30 w-12 shrink-0">Cycle</span>
              <span className="text-[8px] text-white/60 truncate">{biology.fertility_cycle}</span>
            </div>
            {biology.parasites.map((p, i) => (
              <div key={i} className="text-[8px] text-red-400/70 flex items-center gap-1 ml-1">
                <span>⊕</span>
                <span className="truncate">{p.type}</span>
              </div>
            ))}
            {biology.incubations.map((inc: Incubation, i: number) => (
              <div key={`inc-${inc.type}-${i}`} className="text-[8px] text-purple-400/70 flex items-center gap-1 ml-1">
                <span>◎</span>
                <span className="truncate">{inc.type} ({inc.progress}%)</span>
              </div>
            ))}
          </>
        )}

        {/* Active Status Effects */}
        {state.player.afflictions.length > 0 && (
          <>
            <SectionHeader label="Afflictions" />
            <div className="flex flex-wrap gap-1 mb-2">
              {state.player.afflictions.map((aff, i) => (
                <span key={i} className="text-[7px] uppercase tracking-wide px-1.5 py-0.5 bg-red-950/40 border border-red-900/30 text-red-400/70 rounded-sm">
                  {aff}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Quests count */}
        {state.player.quests && state.player.quests.filter(q => q.status === 'active').length > 0 && (
          <>
            <SectionHeader label="Quests" />
            <div className="space-y-1 mb-2">
              {state.player.quests.filter(q => q.status === 'active').slice(0, 3).map(q => (
                <div key={q.id} className="text-[8px] text-amber-400/70 flex items-start gap-1">
                  <span className="shrink-0 mt-0.5">▸</span>
                  <span className="truncate">{q.title}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Footer quick buttons */}
      <div className="p-2 border-t border-white/[0.06] grid grid-cols-4 gap-1">
        <button
          onClick={onOpenStats}
          className="py-1.5 text-[7px] uppercase tracking-widest text-white/40 hover:text-white/80 border border-white/[0.06] hover:border-white/20 rounded-sm transition-colors bg-white/[0.01] hover:bg-white/[0.04]"
        >
          Stats
        </button>
        <button
          onClick={onOpenInventory}
          className="py-1.5 text-[7px] uppercase tracking-widest text-white/40 hover:text-white/80 border border-white/[0.06] hover:border-white/20 rounded-sm transition-colors bg-white/[0.01] hover:bg-white/[0.04]"
        >
          Items
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_shop', value: true } })}
          className="py-1.5 text-[7px] uppercase tracking-widest text-amber-400/50 hover:text-amber-400 border border-white/[0.06] hover:border-amber-900/40 rounded-sm transition-colors bg-white/[0.01] hover:bg-amber-950/20"
        >
          Shop
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_wardrobe', value: true } })}
          className="py-1.5 text-[7px] uppercase tracking-widest text-indigo-400/50 hover:text-indigo-400 border border-white/[0.06] hover:border-indigo-900/40 rounded-sm transition-colors bg-white/[0.01] hover:bg-indigo-950/20"
        >
          Wardrobe
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_social', value: true } })}
          className="py-1.5 text-[7px] uppercase tracking-widest text-pink-400/50 hover:text-pink-400 border border-white/[0.06] hover:border-pink-900/40 rounded-sm transition-colors bg-white/[0.01] hover:bg-pink-950/20"
        >
          Social
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_map', value: true } })}
          className="py-1.5 text-[7px] uppercase tracking-widest text-white/40 hover:text-white/80 border border-white/[0.06] hover:border-white/20 rounded-sm transition-colors bg-white/[0.01] hover:bg-white/[0.04]"
        >
          Map
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_feats', value: true } })}
          className="py-1.5 text-[7px] uppercase tracking-widest text-amber-400/50 hover:text-amber-400 border border-white/[0.06] hover:border-amber-900/40 rounded-sm transition-colors bg-white/[0.01] hover:bg-amber-950/20"
        >
          Feats
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_traits', value: true } })}
          className="py-1.5 text-[7px] uppercase tracking-widest text-violet-400/50 hover:text-violet-400 border border-white/[0.06] hover:border-violet-900/40 rounded-sm transition-colors bg-white/[0.01] hover:bg-violet-950/20"
        >
          Traits
        </button>
      </div>
    </div>
  );
});
