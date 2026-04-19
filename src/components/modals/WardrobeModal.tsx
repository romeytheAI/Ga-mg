import React from 'react';
import { motion } from 'motion/react';
import { X, Shirt, Wrench, Coins } from 'lucide-react';
import { GameState, Item } from '../../types';

interface WardrobeModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

const SLOT_LABELS: Record<string, string> = {
  head: '🎩 Head',
  neck: '📿 Neck',
  shoulders: '🦺 Shoulders',
  chest: '👕 Chest',
  underwear: '🩲 Underwear',
  legs: '👖 Legs',
  feet: '👢 Feet',
  hands: '🧤 Hands',
  waist: '🪢 Waist',
};

const INTEGRITY_COLOR = (pct: number) =>
  pct > 60 ? 'bg-white/50' : pct > 30 ? 'bg-amber-500' : 'bg-red-600';

export const WardrobeModal: React.FC<WardrobeModalProps> = ({ state, dispatch }) => {
  const clothingSlots = ['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'] as const;

  const equippedBySlot: Record<string, Item | null> = {};
  for (const slot of clothingSlots) {
    equippedBySlot[slot] = state.player.clothing[slot];
  }

  const clothingState = state.player.clothing_state;
  const exposureScore = clothingState?.summary.exposure_score ?? 0;
  const indecentSlots = clothingState?.summary.indecent_slots ?? [];
  const warmth = clothingState?.summary.warmth ?? state.player.temperature.clothing_warmth;

  const unequippedClothing = state.player.inventory.filter(
    i => (i.type === 'clothing' || i.type === 'armor') && !i.is_equipped && i.slot
  );

  const repairCost = (item: Item) => Math.max(1, Math.ceil(((item.max_integrity ?? 100) - (item.integrity ?? 100)) * 0.1));

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
            className="absolute w-1 h-1 bg-indigo-400 rounded-full blur-[1px]"
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
        <button aria-label="Close Wardrobe" onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_wardrobe', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>

        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Shirt className="w-5 h-5 text-indigo-400" />
            <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Wardrobe</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest">
              <span className="text-white/60">Exposure</span>
              <span className={`font-mono ${exposureScore >= 60 ? 'text-red-300' : 'text-emerald-200'}`}>{Math.round(exposureScore)}%</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest">
              <span className="text-white/60">Warmth</span>
              <span className="font-mono text-amber-200">{Math.round(warmth)}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-900/40 px-3 py-1.5 rounded-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-mono">{state.player.gold}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Equipped slots */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Currently Wearing</h3>
            <div className="space-y-2">
              {clothingSlots.map(slot => {
                const item = equippedBySlot[slot];
                const integ = item ? (item.integrity ?? 100) : 0;
                const maxInteg = item ? (item.max_integrity ?? 100) : 100;
                const pct = (integ / maxInteg) * 100;
                const needsRepair = item && integ < maxInteg;
                const cost = item ? repairCost(item) : 0;

                return (
                  <div key={slot} className="p-3 border border-white/5 bg-white/[0.02] rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase text-white/30 tracking-widest">{SLOT_LABELS[slot] || slot}</span>
                      {item && (
                        <div className="flex items-center gap-2">
                          {needsRepair && state.player.gold >= cost && (
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => dispatch({ type: 'REPAIR_ITEM', payload: { itemId: item.id, cost } })}
                              className="flex items-center gap-1 text-[8px] border border-amber-500/30 bg-amber-950/20 text-amber-400 px-2 py-0.5 rounded-sm uppercase tracking-widest"
                              title={`Repair for ${cost} gold`}
                            >
                              <Wrench className="w-2.5 h-2.5" />{cost}g
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch({ type: 'UNEQUIP_ITEM', payload: { itemId: item.id } })}
                            className="text-[8px] border border-red-500/20 text-red-400/60 px-2 py-0.5 rounded-sm uppercase tracking-widest hover:bg-red-950/20"
                          >
                            Remove
                          </motion.button>
                        </div>
                      )}
                    </div>
                    {item ? (
                      <>
                        <span className="text-sm font-serif text-white/80">{item.name}</span>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${INTEGRITY_COLOR(pct)} ${pct < 20 ? 'animate-pulse' : ''}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                          <span className={`text-[8px] font-mono ${pct < 20 ? 'text-red-400' : 'text-white/30'}`}>{Math.round(integ)}%</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-white/15 italic">Empty</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available clothing */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Available Clothing</h3>
            {unequippedClothing.length === 0 ? (
              <p className="text-white/30 italic text-sm text-center py-8">No spare clothing in your backpack.</p>
            ) : (
              <div className="space-y-2">
                {unequippedClothing.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 border border-white/5 bg-white/[0.02] rounded-sm hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-serif text-white/80">{item.name}</span>
                        <span className="text-[8px] text-white/30 ml-2 uppercase">{item.slot}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch({ type: 'EQUIP_ITEM', payload: { itemId: item.id, slot: item.slot } })}
                        className="text-[10px] border border-blue-500/30 bg-blue-950/20 text-blue-400 px-3 py-1 rounded-sm uppercase tracking-widest hover:bg-blue-950/40 transition-colors"
                      >
                        Wear
                      </motion.button>
                    </div>
                    {item.integrity !== undefined && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${INTEGRITY_COLOR((item.integrity / (item.max_integrity ?? 100)) * 100)}`} style={{ width: `${(item.integrity / (item.max_integrity ?? 100)) * 100}%` }} />
                        </div>
                        <span className="text-[8px] font-mono text-white/30">{item.integrity}%</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Exposure warning */}
            {(exposureScore >= 50 || indecentSlots.length > 0) && (
              <div className="mt-4 p-3 border border-red-900/30 bg-red-950/20 rounded-sm">
                <p className="text-[10px] text-red-400/80 uppercase tracking-widest animate-pulse flex flex-col gap-1">
                  <span>⚠ You are indecently exposed. This draws attention and increases danger.</span>
                  {indecentSlots.length > 0 && (
                    <span className="text-white/50 normal-case">
                      Exposed: {indecentSlots.join(', ')}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
