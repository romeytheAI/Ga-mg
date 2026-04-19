import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Wind, Shield, Flame, Droplets, Sun, Moon, Zap, 
  Coffee, Users, Star, Smile, Activity, Castle, Award, 
  Eye, Thermometer, Box, Sparkles, Clock, Coins, Map as MapIcon,
  BrainCircuit
} from 'lucide-react';
import { GameState, StatKey, Incubation } from '../types';
import { DoLCharacterSprite } from './DoLCharacterSprite';
import { getTamrielDate } from '../utils/scheduleEngine';

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
  pulse?: boolean;
  pulseLow?: boolean;
  pulseHigh?: boolean;
  invert?: boolean; 
}

const StatBar: React.FC<StatBarProps> = ({
  label, value, max = 100, color, icon, pulse: forcedPulse, pulseLow, pulseHigh, invert
}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isLow = pulseLow && pct < 25;
  const isHigh = pulseHigh && pct > 75;
  const pulse = forcedPulse || isLow || isHigh;

  return (
    <div className="flex items-center gap-1.5 group py-0.5">
      {icon && (
        <div className={`w-3.5 h-3.5 shrink-0 transition-colors ${pulse ? 'text-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/20 group-hover:text-white/40'}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className={`text-[8px] tracking-[0.2em] uppercase transition-colors ${pulse ? 'text-white font-bold' : 'text-white/30 group-hover:text-white/50'} truncate`}>
            {label}
          </span>
          <span className={`text-[8px] font-mono ml-1 shrink-0 ${pulse ? 'text-white font-bold' : 'text-white/40'}`}>
            {Math.round(value)}
          </span>
        </div>
        <div className="stat-bar-container">
          <motion.div
            className={`h-full ${color} ${pulse ? 'animate-pulse brightness-125 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'circOut' }}
          />
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
  <div className="flex items-center gap-2 mt-4 mb-2 px-1">
    {icon && <span className="text-white/20">{icon}</span>}
    <span className="text-[7px] tracking-[0.4em] uppercase text-white/20 font-black whitespace-nowrap">{label}</span>
    <div className="flex-1 h-[1px] bg-white/[0.04]" />
  </div>
);

const SpriteWithXRay: React.FC<{ state: GameState }> = ({ state }) => {
  const [xrayOn, setXrayOn] = useState(false);
  const [view3D, setView3D] = useState(false);
  return (
    <div className="relative group/sprite">
      <div className="absolute inset-0 bg-sky-500/5 blur-3xl rounded-full opacity-0 group-hover/sprite:opacity-100 transition-opacity duration-1000" />
      {view3D ? (
        <React.Suspense fallback={<div className="text-white/10 text-[8px] tracking-widest text-center p-8 uppercase">Initializing 3D Matrix…</div>}>
        <GltfViewer3D
          state={state}
          height="240px"
          combatAnimation={state.ui.combat_animation}
        />
        </React.Suspense>
      ) : (
        <div className="p-4">
          <DoLCharacterSprite state={state} compact={false} showXRay={xrayOn} />
        </div>
      )}
      
      <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover/sprite:opacity-100 transition-opacity">
        <button
          onClick={() => setXrayOn(!xrayOn)}
          className={`text-[7px] tracking-widest uppercase px-2 py-1 rounded-sm border transition-all ${
            xrayOn ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300' : 'bg-black/60 border-white/10 text-white/40'
          }`}
        >
          X-RAY
        </button>
        <button
          onClick={() => setView3D(!view3D)}
          className={`text-[7px] tracking-widest uppercase px-2 py-1 rounded-sm border transition-all ${
            view3D ? 'bg-amber-500/20 border-amber-400/50 text-amber-300' : 'bg-black/60 border-white/10 text-white/40'
          }`}
        >
          {view3D ? "2D" : "3D"}
        </button>
      </div>
    </div>
  );
};

export const DoLStatsSidebar: React.FC<DoLStatsSidebarProps> = React.memo(({
  state, dispatch, onOpenStats, onOpenInventory
}) => {
  const { stats, skills, life_sim, clothing, biology, psych_profile, temperature, bailey_payment, lewdity_stats, attitudes } = state.player;

  const clothingSlots = ['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'] as const;
  const equippedClothing = clothingSlots.map(slot => ({ slot, item: clothing[slot] })).filter(({ item }) => item !== null);
  const hasExposure = !clothing.chest || !clothing.underwear;

  const { dayName, monthName, dayOfMonth } = getTamrielDate(state.world.day, state.world.week_day);

  return (
    <div className="w-56 shrink-0 border-r border-white/[0.06] bg-[#050505] flex flex-col overflow-y-auto scrollbar-hide z-20 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
      
      {/* Identity Core */}
      <div
        className="p-6 border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.02] transition-all group"
        onClick={onOpenStats}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-serif text-white/90 group-hover:text-sky-300 transition-colors">{state.player.identity.name}</div>
            <div className="text-[8px] text-white/20 uppercase tracking-[0.2em]">
              {state.player.identity.race} · Level {state.player.level}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Manifestation */}
      <div className="relative border-b border-white/[0.06] bg-black/40">
        <SpriteWithXRay state={state} />
      </div>

      {/* Vitals Matrix */}
      <div className="px-5 py-4 space-y-1">
        <SectionHeader label="Chronicle" icon={<Clock className="w-2.5 h-2.5" />} />
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/80 font-serif tracking-widest">{dayName}</span>
            <span className="text-[7px] text-white/30 uppercase tracking-[0.2em]">{dayOfMonth} {monthName}</span>
          </div>
          <div className="text-right">
             <span className="text-xs font-mono text-sky-400/80">{state.world.hour}:00</span>
             <div className="text-[7px] text-white/20 uppercase tracking-widest">{state.world.weather}</div>
          </div>
        </div>

        <SectionHeader label="Life Vitals" icon={<Activity className="w-2.5 h-2.5" />} />
        <StatBar label="Health" value={stats.health} color="bg-gradient-to-r from-red-900 to-red-600" icon={<Heart className="w-3 h-3" />} pulseLow />
        <StatBar label="Stamina" value={stats.stamina} max={stats.max_stamina} color="bg-gradient-to-r from-emerald-900 to-emerald-600" icon={<Wind className="w-3 h-3" />} pulseLow />
        <StatBar label="Willpower" value={stats.willpower} max={stats.max_willpower} color="bg-gradient-to-r from-blue-900 to-blue-600" icon={<Shield className="w-3 h-3" />} pulseLow />

        <SectionHeader label="Psychology" icon={<BrainCircuit className="w-2.5 h-2.5" />} />
        <StatBar label="Purity" value={stats.purity} color="bg-white/60" pulseLow />
        <StatBar label="Corruption" value={stats.corruption} color="bg-purple-900/80" invert pulseHigh />
        <StatBar label="Trauma" value={stats.trauma} color="bg-orange-800/80" invert pulseHigh />
        <StatBar label="Stress" value={stats.stress} color="bg-yellow-700/80" invert pulseHigh />
        <StatBar label="Devotion" value={stats.devotion} color="bg-sky-800" pulse={stats.devotion > 80} />

        <SectionHeader label="Needs" icon={<Zap className="w-2.5 h-2.5" />} />
        <StatBar label="Hunger" value={life_sim.needs.hunger} color="bg-amber-700" icon={<Coffee className="w-3 h-3" />} pulseLow />
        <StatBar label="Thirst" value={life_sim.needs.thirst} color="bg-sky-700" icon={<Droplets className="w-3 h-3" />} pulseLow />
        <StatBar label="Energy" value={life_sim.needs.energy} color="bg-yellow-500" icon={<Zap className="w-3 h-3" />} pulseLow />
        <StatBar label="Hygiene" value={life_sim.needs.hygiene} color="bg-teal-600" icon={<Sun className="w-3 h-3" />} pulseLow />

        <SectionHeader label="Assets" icon={<Box className="w-2.5 h-2.5" />} />
        <div className="flex items-center justify-between p-3 aaa-panel bg-amber-500/[0.03] border-amber-500/10 mb-2">
           <div className="flex items-center gap-2">
             <Coins className="w-3.5 h-3.5 text-amber-500/60" />
             <span className="text-[10px] text-amber-500/80 font-mono tracking-widest">{state.player.gold}G</span>
           </div>
           <button onClick={onOpenInventory} className="text-[7px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">Open Pack</button>
        </div>
      </div>

      {/* Quick Nav Deck */}
      <div className="mt-auto p-4 border-t border-white/[0.06] grid grid-cols-2 gap-1.5 bg-black/40">
        {[
          { label: 'Map', icon: <MapIcon className="w-3 h-3" />, action: 'show_map' },
          { label: 'Dash', icon: <Activity className="w-3 h-3" />, action: 'show_life_sim_dashboard' },
          { label: 'Social', icon: <Users className="w-3 h-3" />, action: 'show_social' },
          { label: 'Traits', icon: <Star className="w-3 h-3" />, action: 'show_traits' },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: btn.action as any, value: true } })}
            className="py-2 flex items-center justify-center gap-2 aaa-button-ghost rounded-sm group"
          >
            <span className="group-hover:text-sky-400 transition-colors">{btn.icon}</span>
            <span className="text-[7px] tracking-widest uppercase font-bold">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
