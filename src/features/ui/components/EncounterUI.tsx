import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterModel } from './CharacterModel';
import { GameState, ActiveEncounter, PlayerRestraints, RestraintSlot } from '../../../core/types';

const GltfViewer3D = React.lazy(() => import('./GltfViewer3D').then(m => ({ default: m.GltfViewer3D })));

interface EncounterUIProps {
  encounter: ActiveEncounter;
  playerStats: GameState['player']['stats'];
  onAction: (action: string, intent: string, targetedPart?: string) => void;
  /** Full game state — enables the high-fidelity 3D internal viewer and restraint display. */
  state?: GameState;
}

const RESTRAINT_SLOT_LABEL: Record<RestraintSlot, string> = {
  wrists: 'Wrists',
  ankles: 'Ankles',
  neck:   'Neck',
  waist:  'Waist',
  mouth:  'Mouth',
};

const RESTRAINT_SLOT_ICON: Record<RestraintSlot, string> = {
  wrists: '🫱',
  ankles: '🦶',
  neck:   '🔒',
  waist:  '⚙',
  mouth:  '🔇',
};

function RestraintPanel({ restraints }: { restraints: PlayerRestraints }) {
  const movPct = Math.round(restraints.movement_penalty * 100);
  const actPct = Math.round(restraints.action_penalty * 100);
  const escapePct = restraints.escape_progress;

  return (
    <div className="border border-violet-900/50 bg-violet-950/20 rounded-sm p-3 relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] uppercase tracking-widest text-violet-400 font-semibold">⛓ Restrained</span>
        {movPct > 0 && (
          <span className="text-[8px] text-amber-400/70 uppercase tracking-widest">
            −{movPct}% movement
          </span>
        )}
        {actPct > 0 && (
          <span className="text-[8px] text-red-400/70 uppercase tracking-widest">
            −{actPct}% actions
          </span>
        )}
      </div>

      {/* Slot badges */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {restraints.entries.map(entry => (
          <span
            key={entry.slot}
            title={`${entry.name} — Strength: ${entry.strength}/100, Comfort: ${entry.comfort}/100`}
            className="flex items-center gap-1 text-[8px] uppercase tracking-widest px-1.5 py-0.5 border border-violet-900/50 bg-violet-950/30 text-violet-300 rounded-sm"
          >
            <span>{RESTRAINT_SLOT_ICON[entry.slot]}</span>
            {RESTRAINT_SLOT_LABEL[entry.slot]}
          </span>
        ))}
      </div>

      {/* Escape progress */}
      {escapePct > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-widest text-white/30 shrink-0">Escape</span>
          <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-violet-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${escapePct}%` }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
            />
          </div>
          <span className="text-[8px] font-mono text-violet-300/60 w-7 text-right">{escapePct}%</span>
        </div>
      )}
    </div>
  );
}

export const EncounterUI: React.FC<EncounterUIProps> = ({ encounter, playerStats, onAction, state }) => {
  const [targetedPart, setTargetedPart] = React.useState<string | null>(null);
  const [show3D, setShow3D] = React.useState(false);
  const bodyParts = ['head','torso','arms','legs'];

  const restraints = state?.player.restraints ?? null;
  // Action penalty reduces effectiveness — penalise struggle/resist visually
  const actPenalty = restraints?.action_penalty ?? 0;
  // Movement penalty reduces escape/flee viability
  const movPenalty = restraints?.movement_penalty ?? 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4 p-4 border border-red-900/50 bg-red-950/10 rounded-sm relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 200,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center border-b border-red-900/30 pb-2 relative z-10">
        <h3 className="text-lg font-serif text-red-400">{encounter.enemy_name}</h3>
        <span className="text-[10px] uppercase tracking-widest text-red-500/50">Turn {encounter.turn}</span>
      </div>
      <div className="flex justify-center my-4 relative z-10">
        {state && show3D ? (
          <div className="w-full">
            <React.Suspense fallback={<div className="text-white/20 text-xs text-center p-4">Loading 3D…</div>}>
            <GltfViewer3D
              state={state}
              height="280px"
              combatAnimation={state.ui.combat_animation}
            />
            </React.Suspense>
          </div>
        ) : (
          <CharacterModel anatomy={encounter.anatomy} isPlayer={false} />
        )}
      </div>
      {/* 3D / 2D toggle */}
      <div className="flex justify-end -mt-2 mb-1 relative z-10">
        <button
          onClick={() => setShow3D(!show3D)}
          className={`text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border transition-all ${
            show3D
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
              : 'bg-black/40 border-white/10 text-white/40 hover:text-white/70'
          }`}
        >
          {show3D ? '3D'': '2D'}
        </button>
      </div>

      {/* ── Restraint Status (Milestone 8) ── */}
      {restraints && restraints.entries.length > 0 && (
        <RestraintPanel restraints={restraints} />
      )}

      {/* Target Selection */}
      <div className="flex gap-2 relative z-10">
        {bodyParts.map(part => (
          <button
            key={part}
            onClick={() => setTargetedPart(part === targetedPart ? null : part)}
            className={`text-[9px] uppercase tracking-widest p-1 border ${part === targetedPart ? 'bg-red-900 text-white'': 'border-red-900/30 text-red-500/50'}`}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Debuffs */}
      {encounter.debuffs && encounter.debuffs.length > 0 && (
        <div className="flex gap-2 relative z-10">
          {encounter.debuffs.map((debuff, i) => (
            <span key={i} className="text-[9px] uppercase tracking-widest p-1 border border-blue-900/50 bg-blue-950/20 text-blue-200">
              {debuff.type} ({debuff.duration})
            </span>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 w-12">Health</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(encounter.enemy_health / encounter.enemy_max_health) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="absolute left-0 top-0 bottom-0 bg-red-500" 
            />
          </div>
          <span className="text-red-400 w-12 text-right">{encounter.enemy_health}/{encounter.enemy_max_health}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 w-12">Lust</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(encounter.enemy_lust / encounter.enemy_max_lust) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="absolute left-0 top-0 bottom-0 bg-pink-500" 
            />
          </div>
          <span className="text-pink-400 w-12 text-right">{encounter.enemy_lust}/{encounter.enemy_max_lust}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50 w-12">Anger</span>
          <div className="flex-1 mx-4 h-1.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(encounter.enemy_anger / encounter.enemy_max_anger) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="absolute left-0 top-0 bottom-0 bg-orange-500" 
            />
          </div>
          <span className="text-orange-400 w-12 text-right">{encounter.enemy_anger}/{encounter.enemy_max_anger}</span>
        </div>
      </div>

      {/* Combat Log */}
      {encounter.log && encounter.log.length > 0 && (
        <div className="mt-2 h-24 overflow-y-auto bg-black/40 border border-white/5 p-2 rounded-sm text-xs font-mono relative z-10 flex flex-col-reverse">
          <AnimatePresence initial={false}>
            {encounter.log.slice().reverse().map((entry, index) => (
              <motion.div
                key={`${encounter.turn}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`mb-1 ${index === 0 ? 'text-white'': 'text-white/40'}`}
              >
                &gt; {entry}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
        {/* Struggle — dimmed when heavily restrained (action penalty) */}
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(127, 29, 29, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Struggle and fight back", "aggressive", targetedPart || undefined)}
          className={`p-3 border border-red-900/50 bg-red-950/20 text-red-200 text-xs uppercase tracking-widest transition-colors ${actPenalty >= 0.75 ? 'opacity-40'': actPenalty >= 0.5 ? 'opacity-70'': ''}`}
        >
          Struggle{actPenalty >= 0.5 ? ''⬇'': ''}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(88, 28, 135, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Submit and endure", "submissive", targetedPart || undefined)}
          className="p-3 border border-purple-900/50 bg-purple-950/20 text-purple-200 text-xs uppercase tracking-widest transition-colors"
        >
          Submit
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(131, 24, 67, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Attempt to seduce", "social", targetedPart || undefined)}
          className="p-3 border border-pink-900/50 bg-pink-950/20 text-pink-200 text-xs uppercase tracking-widest transition-colors"
        >
          Seduce
        </motion.button>
        {/* Escape — dimmed when movement is restricted */}
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 58, 138, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Try to escape", "flee", targetedPart || undefined)}
          className={`p-3 border border-blue-900/50 bg-blue-950/20 text-blue-200 text-xs uppercase tracking-widest transition-colors ${movPenalty >= 0.75 ? 'opacity-40'': movPenalty >= 0.5 ? 'opacity-70'': ''}`}
        >
          Escape{movPenalty >= 0.5 ? ''⬇'': ''}
        </motion.button>
        {/* Resist — dimmed when heavily restrained */}
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(160, 40, 40, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Resist with all your strength", "resist", targetedPart || undefined)}
          className={`p-3 border border-red-800/50 bg-red-900/20 text-red-300 text-xs uppercase tracking-widest transition-colors ${actPenalty >= 0.5 ? 'opacity-70'': ''}`}
        >
          Resist{actPenalty >= 0.5 ? ''⬇'': ''}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(120, 60, 20, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Endure and wait for an opening", "endure", targetedPart || undefined)}
          className="p-3 border border-amber-900/50 bg-amber-950/20 text-amber-200 text-xs uppercase tracking-widest transition-colors"
        >
          Endure
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(180, 40, 80, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction("Cry out for help", "cry_out", targetedPart || undefined)}
          className={`p-3 border border-rose-800/50 bg-rose-950/20 text-rose-200 text-xs uppercase tracking-widest col-span-2 transition-colors ${restraints?.entries.some(e => e.slot === 'mouth') ? 'opacity-40 line-through'': ''}`}
        >
          Cry Out{restraints?.entries.some(e => e.slot === 'mouth') ? ''(gagged)'': ''}
        </motion.button>
      </div>
    </motion.div>
  );
};
