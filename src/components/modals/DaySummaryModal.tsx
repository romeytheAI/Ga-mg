import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Activity, Zap, Coffee, Droplets, Sun, Users, Smile } from 'lucide-react';
import { GameState } from '../../types';

interface DaySummaryModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

const StatSummary: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="flex items-center justify-between p-3 rounded-sm border border-white/5 bg-white/[0.02]">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] tracking-widest uppercase text-white/40">{label}</span>
    </div>
    <span className="text-lg font-mono text-white/80">{value}</span>
  </div>
);

const NeedBar: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-baseline">
      <div className="flex items-center gap-1.5">
        <span className="text-white/40">{icon}</span>
        <span className="text-[9px] tracking-widest uppercase text-white/40">{label}</span>
      </div>
      <span className="text-[9px] font-mono text-white/60">{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({ state, dispatch }) => {
  const dailyStats = state.player.life_sim.daily_stats;
  const needs = state.player.life_sim.needs;
  
  const reflection = (() => {
    if (needs.happiness < 30) return "A heavy, shadow-filled day. Every step felt like a climb.";
    if (needs.energy < 20) return "You are pushed to the brink of collapse. Rest is no longer optional.";
    if (dailyStats.interactions_count > 5) return "The threads of fate connected you with many today.";
    if (dailyStats.calories_burned > 2000) return "A day of exertion and sweat. Your body aches with progress.";
    return "Another cycle passes in the land of Aetherius.";
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-md w-full relative shadow-2xl overflow-hidden z-10"
      >
        <button
          aria-label="Close Day Summary"
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_day_summary', value: false } })}
          className="absolute top-6 right-6 text-white/40 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Calendar className="w-6 h-6 text-sky-400" />
          <div>
            <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Day {state.world.day - 1} Concluded</h2>
            <span className="text-[10px] text-white/40 tracking-widest uppercase">The Weaver's Accounting</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <StatSummary 
            label="Calories Expended" 
            value={`${Math.round(dailyStats.calories_burned)} kcal`} 
            icon={<Activity className="w-4 h-4" />} 
            color="text-amber-500"
          />
          <StatSummary 
            label="Social Interactions" 
            value={dailyStats.interactions_count} 
            icon={<Users className="w-4 h-4" />} 
            color="text-indigo-400"
          />
          <StatSummary 
            label="Awake Duration" 
            value={`${Math.floor(dailyStats.consecutive_awake_hours)}h`} 
            icon={<Zap className="w-4 h-4" />} 
            color="text-yellow-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
          <NeedBar label="Hunger" value={needs.hunger} color="bg-amber-600" icon={<Coffee className="w-3 h-3" />} />
          <NeedBar label="Thirst" value={needs.thirst} color="bg-cyan-600" icon={<Droplets className="w-3 h-3" />} />
          <NeedBar label="Energy" value={needs.energy} color="bg-yellow-500" icon={<Zap className="w-3 h-3" />} />
          <NeedBar label="Hygiene" value={needs.hygiene} color="bg-teal-600" icon={<Sun className="w-3 h-3" />} />
          <NeedBar label="Social" value={needs.social} color="bg-indigo-600" icon={<Users className="w-3 h-3" />} />
          <NeedBar label="Happiness" value={needs.happiness} color="bg-green-600" icon={<Smile className="w-3 h-3" />} />
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/5 italic text-center">
          <p className="text-[11px] text-white/60 font-serif leading-relaxed">
            "{reflection}"
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_day_summary', value: false } })}
          className="w-full mt-8 py-3 bg-sky-900/40 hover:bg-sky-800/60 border border-sky-500/30 transition-all rounded-sm text-[10px] tracking-[0.3em] uppercase text-sky-200"
        >
          Acknowledge
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
