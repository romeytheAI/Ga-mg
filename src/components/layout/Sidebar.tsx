import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { StatBar } from '../ui/StatBar';
import { AnimationWindow } from '../AnimationWindow';
import { Clock, Shield, Coins, AlertTriangle, User } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { stats, time, clothing, isLateGame, log } = useGameStore();

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 h-screen p-4 flex flex-col gap-6 overflow-y-auto text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">

      {/* Character Model */}
      <div className="flex-shrink-0">
        <AnimationWindow />
      </div>

      {/* Identity & Bio */}
      <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-lg border border-slate-800 shadow-md">
         <div className="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">
            <User size={14} /> Identity
         </div>
         <div className="text-lg text-amber-500 font-serif font-bold">{stats.race}</div>
         <div className="text-xs text-slate-500 italic">{stats.background}</div>
      </div>

      {/* Time & Wealth */}
      <div className="flex flex-col gap-2 p-4 bg-slate-950 rounded-lg border border-slate-800 shadow-md">
        <div className="flex items-center justify-between text-lg font-bold text-amber-500 font-serif">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>Day {time.day}</span>
          </div>
          <span>{formatTime(time.hour, time.minute)}</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-400 font-semibold mt-2">
          <Coins size={16} />
          <span>{stats.septims} Septims</span>
        </div>
        {isLateGame && (
          <div className="mt-2 text-xs font-bold text-purple-400 uppercase tracking-widest animate-pulse flex items-center gap-1">
             <AlertTriangle size={14} className="text-purple-500" />
             The Blight Looms
          </div>
        )}
      </div>

      {/* Elder Scrolls Vitals */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 font-serif">Vitals</h3>
        <StatBar label="Health" value={stats.health} max={stats.maxHealth} color="bg-red-600" />
        <StatBar label="Magicka" value={stats.magicka} max={stats.maxMagicka} color="bg-blue-600" />
        <StatBar label="Fatigue" value={stats.fatigue} max={stats.maxFatigue} color="bg-green-600" />
      </div>

      {/* DoL Mechanics */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 font-serif">Conditions</h3>
        <StatBar label="Arousal" value={stats.arousal} max={stats.maxArousal} color="bg-pink-500" />
        <StatBar label="Stress" value={stats.stress} max={stats.maxStress} color="bg-orange-500" />
        <StatBar label="Trauma" value={stats.trauma} max={stats.maxTrauma} color="bg-red-900" />
        <StatBar label="Corruption" value={stats.corruption} max={10000} color="bg-purple-800" />
      </div>

      {/* Clothing */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 font-serif flex items-center gap-2">
          <Shield size={16} /> Attire
        </h3>
        {Object.entries(clothing).map(([layer, item]) => (
          item && (
            <div key={layer} className="bg-slate-950 p-3 rounded-md border border-slate-800 flex justify-between items-center group relative cursor-help">
              <span className="text-sm font-medium text-slate-300 capitalize truncate w-32">{item.name}</span>
              <span className={`text-xs font-bold ${
                item.integrity < 20 ? 'text-red-500 animate-pulse' :
                item.integrity < 50 ? 'text-orange-500' : 'text-slate-400'
              }`}>
                {item.integrity}%
              </span>

              {/* Tooltip */}
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-slate-800 text-xs p-2 rounded w-48 z-10 shadow-xl border border-slate-700 pointer-events-none">
                {item.description}
                <br/>
                <span className="text-slate-500">Integrity: {item.integrity}/{item.maxIntegrity}</span>
                <br/>
                <span className="text-slate-500">Exposure: {item.exposure}</span>
                <br/>
                <span className="text-slate-500 capitalize">Layer: {layer}</span>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Log */}
      <div className="flex flex-col gap-2 flex-1 min-h-0 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 font-serif flex-shrink-0">Log</h3>
        <div className="space-y-1 text-xs overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {log.map((msg) => (
            <div key={msg.id} className={`leading-relaxed ${
              msg.type === 'good' ? 'text-green-400' :
              msg.type === 'bad' ? 'text-red-400' :
              msg.type === 'combat' ? 'text-orange-400' :
              msg.type === 'lewd' ? 'text-pink-400' :
              'text-slate-500'
            }`}>
              • {msg.text}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
