import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Activity, Heart, Shield, Flame, Droplets, Sun, Moon, Zap, 
  Coffee, Users, Star, DollarSign, Briefcase, Baby, Sparkles,
  BrainCircuit, Scale, AlertCircle, Clock, Calendar, Smile, BookOpen,
  Castle, Award, Thermometer, User, Zap as EnergyIcon
} from 'lucide-react';
import { GameState } from '../../types';
import { getTamrielDate } from '../../utils/scheduleEngine';

interface LifeSimDashboardModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

const TabButton: React.FC<{ active: boolean; label: string; icon: React.ReactNode; onClick: () => void }> = ({ active, label, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all duration-500 relative ${
      active 
        ? 'border-sky-400 text-sky-300 bg-sky-500/5' 
        : 'border-transparent text-white/20 hover:text-white/60 hover:bg-white/[0.01]'
    }`}
  >
    {active && <motion.div layoutId="tab-glow" className="absolute inset-0 bg-sky-500/5 blur-xl pointer-events-none" />}
    <span className={`${active ? 'scale-110' : 'scale-100'} transition-transform duration-500`}>{icon}</span>
    <span className="text-[10px] tracking-[0.25em] uppercase font-black">{label}</span>
  </button>
);

const ProgressBar: React.FC<{ label: string; value: number; max?: number; color: string; icon?: React.ReactNode; subtitle?: string }> = ({ label, value, max = 100, color, icon, subtitle }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="aaa-panel p-5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
      <div className="flex justify-between items-baseline mb-3">
        <div className="flex items-center gap-3">
          {icon && <span className="text-white/20 group-hover:text-white/50 transition-colors">{icon}</span>}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-bold group-hover:text-white/70 transition-colors">{label}</div>
            {subtitle && <div className="text-[8px] tracking-[0.2em] uppercase text-white/20">{subtitle}</div>}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-white/60 tracking-widest">{Math.round(value)}{max !== 100 ? `/${max}` : ''}</span>
          <span className="text-[7px] text-white/10 uppercase tracking-tighter">Current Flux</span>
        </div>
      </div>
      <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full ${color} relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string | number; subvalue?: string; icon: React.ReactNode; color: string }> = ({ label, value, subvalue, icon, color }) => (
  <div className="aaa-panel p-6 bg-white/[0.02] hover:border-white/20 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150 transform translate-x-1/4 -translate-y-1/4">
       {icon}
    </div>
    <div className="relative z-10 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-black/60 border border-white/5 ${color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div>
        <div className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-1 font-black">{label}</div>
        <div className="text-xl font-serif text-white/90 group-hover:text-sky-300 transition-colors truncate">{value}</div>
        {subvalue && <div className="text-[8px] text-white/20 mt-1 uppercase tracking-[0.2em]">{subvalue}</div>}
      </div>
    </div>
  </div>
);

const SectionHeader: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
  <div className="flex items-center gap-3 mt-6 mb-4">
    {icon && <span className="text-white/30">{icon}</span>}
    <span className="text-[9px] tracking-[0.5em] uppercase text-white/20 font-black whitespace-nowrap">{label}</span>
    <div className="flex-1 h-[1px] bg-white/[0.05]" />
  </div>
);

export const LifeSimDashboardModal: React.FC<LifeSimDashboardModalProps> = ({ state, dispatch }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'biology' | 'economy' | 'psychology' | 'knowledge' | 'dynasty'>('overview');
  
  const { player, world } = state;
  const { life_sim, stats, biology, bailey_payment, psych_profile, lewdity_stats, mantling } = player;

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      {mantling && (
        <div className="p-8 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-transparent border border-purple-500/30 rounded-sm relative overflow-hidden group/mantle">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.1),transparent)]" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-serif text-purple-200 tracking-[0.2em] uppercase group-hover/mantle:text-sky-300 transition-colors">The Mantle of {mantling.target_god.toUpperCase()}</h3>
                <p className="text-[11px] text-purple-300/40 uppercase tracking-[0.3em] mt-2 italic font-light italic">The resonance of divinity vibrates through your physical coil...</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] block mb-1">Divine Sync</span>
                <span className="text-3xl font-mono text-purple-400 font-black tracking-tighter">{Math.round(mantling.synchronicity)}%</span>
              </div>
            </div>
            <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-purple-500/20 shadow-2xl">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${mantling.synchronicity}%` }}
                className="h-full bg-gradient-to-r from-purple-600 via-sky-500 to-purple-400 relative"
              >
                 <div className="absolute inset-0 bg-white/20 blur-sm animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {(() => {
          const { dayName, monthName, dayOfMonth } = getTamrielDate(world.day, world.week_day);
          return (
            <MetricCard 
              label="Temporal Vector" 
              value={`${dayName}, ${dayOfMonth}`} 
              subvalue={`${monthName} • Cycle ${state.sim_world?.season || 'Spring'}`} 
              icon={<Calendar className="w-5 h-5" />} 
              color="text-sky-400" 
            />
          );
        })()}
        <MetricCard label="Chronos" value={`${world.hour}:00`} subvalue="Tamrielic Standard" icon={<Clock className="w-5 h-5" />} color="text-amber-500" />
        <MetricCard label="Wealth" value={`${player.gold} Septims`} subvalue="Liquid Capital" icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" />
        <MetricCard label="Activity" value={life_sim.schedule.current_activity} subvalue={`Uptime: ${Math.floor(life_sim.daily_stats.consecutive_awake_hours)}h`} icon={<Activity className="w-5 h-5" />} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <SectionHeader label="Physiological State" icon={<Heart className="w-3 h-3" />} />
          <ProgressBar label="Integrity" value={stats.health} color="bg-gradient-to-r from-red-900 to-red-600" subtitle="Structural health of the physical vessel" />
          <ProgressBar label="Kinetics" value={stats.stamina} max={stats.max_stamina} color="bg-gradient-to-r from-emerald-900 to-emerald-600" subtitle="Anaerobic threshold and exertion potential" />
          <ProgressBar label="Cognition" value={stats.willpower} color="bg-gradient-to-r from-blue-900 to-blue-600" subtitle="Mental fortitude and arcane grounding" />
        </div>
        <div className="space-y-4">
          <SectionHeader label="Entropic Needs" icon={<EnergyIcon className="w-3 h-3" />} />
          <ProgressBar label="Fuel" value={life_sim.needs.hunger} color="bg-amber-600" icon={<Coffee className="w-4 h-4" />} />
          <ProgressBar label="Hydration" value={life_sim.needs.thirst} color="bg-blue-500" icon={<Droplets className="w-4 h-4" />} />
          <ProgressBar label="Potential" value={life_sim.needs.energy} color="bg-yellow-500" icon={<Zap className="w-4 h-4" />} />
          <ProgressBar label="Hygiene" value={life_sim.needs.hygiene} color="bg-teal-500" icon={<Sun className="w-4 h-4" />} />
        </div>
      </div>
    </motion.div>
  );

  const renderBiology = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard label="Fertility State" value={biology.fertility_cycle} subvalue={`Ovarian Phase: Day ${biology.cycle_day}`} icon={<Moon className="w-5 h-5" />} color="text-pink-400" />
        <MetricCard label="Potential" value={`${Math.round(biology.fertility * 100)}%`} subvalue="Conception Probability" icon={<Baby className="w-5 h-5" />} color="text-rose-400" />
        <MetricCard label="Lactation" value={`${Math.round(biology.lactation_level)}%`} subvalue="Mammary Flux" icon={<Droplets className="w-5 h-5" />} color="text-sky-300" />
      </div>
    </motion.div>
  );

  const renderEconomy = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard label="Vocation" value={player.player_job === 'none' ? 'Unemployed' : player.player_job} icon={<Briefcase className="w-5 h-5" />} color="text-amber-700" />
        <MetricCard label="Obligation" value={`${bailey_payment.debt} Septims`} subvalue={`${bailey_payment.weekly_amount}g/week due`} icon={<AlertCircle className="w-5 h-5" />} color="text-red-600" />
        <MetricCard label="Fame Index" value={player.fame} subvalue="Social Standing" icon={<Award className="w-5 h-5" />} color="text-sky-500" />
      </div>
    </motion.div>
  );

  const renderPsychology = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aaa-panel p-8 bg-white/[0.01] space-y-6">
          <SectionHeader label="Behavioral Vectors" icon={<BrainCircuit className="w-4 h-4" />} />
          <ProgressBar label="Submission" value={psych_profile.submission_index} color="bg-violet-600" subtitle="Innate tendency to yield to authority" />
          <ProgressBar label="Exhibitionism" value={lewdity_stats.exhibitionism} color="bg-pink-600" subtitle="Comfort level with public vulnerability" />
        </div>
      </div>
    </motion.div>
  );

  const renderKnowledge = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aaa-panel p-8 bg-white/[0.01]">
          <SectionHeader label="Cartographic Data" icon={<BookOpen className="w-4 h-4" />} />
          <div className="flex justify-between items-center p-6 bg-black/40 rounded-sm border border-white/5">
             <span className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Nodes Visited</span>
             <span className="text-4xl font-serif text-sky-400 font-black">{player.knowledge.discovered_locations.length}</span>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
             <SectionHeader label="Aetherial Insight" />
             <ProgressBar label="Enlightenment" value={player.knowledge.enlightenment} color="bg-gradient-to-r from-amber-700 to-amber-400" />
             <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] mt-4 text-center">Literacy Level: <span className="text-white/60">{player.knowledge.literacy_level}</span></p>
          </div>
        </div>
        <div className="aaa-panel p-8 bg-white/[0.01] flex flex-col items-center justify-center gap-4">
          <SectionHeader label="Arcane Repository" icon={<Castle className="w-4 h-4" />} />
          <div className="w-32 h-32 rounded-full border-2 border-white/5 flex flex-col items-center justify-center relative">
             <div className="absolute inset-0 bg-sky-500/5 blur-3xl rounded-full" />
             <span className="text-5xl font-serif text-white/90 relative z-10">{player.knowledge.library_size}</span>
          </div>
          <span className="text-[11px] text-white/20 uppercase tracking-[0.5em] font-black">Codex Volumes</span>
        </div>
      </div>
    </motion.div>
  );

  const renderDynasty = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard label="House Name" value={player.dynasty.house_name} icon={<Castle className="w-5 h-5" />} color="text-amber-500" />
        <MetricCard label="Prestige" value={player.dynasty.prestige} subvalue="Generational Glory" icon={<Award className="w-5 h-5" />} color="text-sky-400" />
        <MetricCard label="Vessels" value={player.dynasty.lineage.length} subvalue="Biological Legacy" icon={<Users className="w-5 h-5" />} color="text-purple-400" />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-12"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
        className="bg-[#030303] border border-white/10 rounded-sm w-full max-w-7xl max-h-[92vh] flex flex-col relative shadow-[0_0_150px_rgba(0,0,0,1)] z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between p-8 border-b border-white/[0.06] bg-black/40">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full border border-sky-500/30 flex items-center justify-center text-sky-400 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
               <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-white/90 tracking-[0.2em] uppercase">Mundus Synthesis</h2>
              <span className="text-[10px] text-sky-400/60 tracking-[0.4em] uppercase block mt-2 font-black">Subsystem Data Interface // v5.1</span>
            </div>
          </div>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_life_sim_dashboard', value: false } })} 
            className="w-12 h-12 flex items-center justify-center rounded-sm bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all duration-500 border border-white/5 hover:border-red-500/40" aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-white/[0.04] px-8 bg-black/20 overflow-x-auto scrollbar-hide">
          <TabButton active={activeTab === 'overview'} label="Overview" icon={<Activity className="w-4 h-4" />} onClick={() => setActiveTab('overview')} />
          <TabButton active={activeTab === 'biology'} label="Biology" icon={<Droplets className="w-4 h-4" />} onClick={() => setActiveTab('biology')} />
          <TabButton active={activeTab === 'economy'} label="Civilization" icon={<DollarSign className="w-4 h-4" />} onClick={() => setActiveTab('economy')} />
          <TabButton active={activeTab === 'psychology'} label="Mind" icon={<BrainCircuit className="w-4 h-4" />} onClick={() => setActiveTab('psychology')} />
          <TabButton active={activeTab === 'knowledge'} label="Codex" icon={<BookOpen className="w-4 h-4" />} onClick={() => setActiveTab('knowledge')} />
          <TabButton active={activeTab === 'dynasty'} label="Dynasty" icon={<Castle className="w-4 h-4" />} onClick={() => setActiveTab('dynasty')} />
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.02),transparent)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'biology' && renderBiology()}
              {activeTab === 'economy' && renderEconomy()}
              {activeTab === 'psychology' && renderPsychology()}
              {activeTab === 'knowledge' && renderKnowledge()}
              {activeTab === 'dynasty' && renderDynasty()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/[0.04] bg-black/60 flex justify-between items-center px-8">
           <div className="flex gap-6 opacity-30">
              <div className="flex items-center gap-2 text-[8px] tracking-[0.2em] uppercase font-bold"><Activity className="w-2.5 h-2.5" /> Simulation Nominal</div>
              <div className="flex items-center gap-2 text-[8px] tracking-[0.2em] uppercase font-bold"><Zap className="w-2.5 h-2.5" /> High Fidelity Mode</div>
           </div>
           <div className="text-[8px] tracking-[0.3em] uppercase text-white/10 font-black">Interface-System-Liaison-001</div>
        </div>
      </motion.div>
    </motion.div>
  );
};
