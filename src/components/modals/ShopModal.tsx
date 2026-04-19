import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { GameState, Item } from '../../types';
import { BASIC_ITEMS } from '../../data/items';
import { generateId } from '../../utils/crypto';

interface ShopModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

const SHOP_INVENTORY: { item: Item; markup: number }[] = [
  { item: BASIC_ITEMS.bread_crust, markup: 2 },
  { item: BASIC_ITEMS.blue_mountain_flower, markup: 1.5 },
  { item: BASIC_ITEMS.healing_poultice, markup: 1.5 },
  { item: BASIC_ITEMS.glowing_mushroom, markup: 2 },
  { item: BASIC_ITEMS.rusty_iron_dagger, markup: 1.5 },
  { item: BASIC_ITEMS.threadbare_tunic, markup: 2 },
];

export const ShopModal: React.FC<ShopModalProps> = ({ state, dispatch }) => {
  const [tab, setTab] = React.useState<'buy' | 'sell'>('buy');

  const sellableItems = state.player.inventory.filter(i => !i.is_equipped);

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
            className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
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
        <button aria-label="Close Shop" onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_shop', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
        
        {/* Gold display */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-serif text-white/90 tracking-widest uppercase">Merchant</h2>
          <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-900/40 px-4 py-2 rounded-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-mono text-lg">{state.player.gold}</span>
            <span className="text-amber-400/50 text-xs uppercase tracking-widest">gold</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('buy')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border rounded-sm transition-colors ${tab === 'buy' ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' : 'border-white/10 text-white/40 hover:text-white/60'}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Buy
          </button>
          <button
            onClick={() => setTab('sell')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border rounded-sm transition-colors ${tab === 'sell' ? 'border-red-500/50 bg-red-950/20 text-red-400' : 'border-white/10 text-white/40 hover:text-white/60'}`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Sell
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'buy' ? (
            <motion.div key="buy" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
              {SHOP_INVENTORY.map(({ item, markup }, index) => {
                const cost = Math.ceil(item.value * markup);
                const canAfford = state.player.gold >= cost;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] rounded-sm hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-serif text-white/90">{item.name}</span>
                        <span className={`text-[8px] px-1 border uppercase rounded-sm ${item.rarity === 'common' ? 'border-white/20 text-white/40' : item.rarity === 'uncommon' ? 'border-green-500 text-green-500' : 'border-purple-500 text-purple-500'}`}>{item.rarity}</span>
                      </div>
                      <p className="text-[10px] text-white/40 line-clamp-1">{item.description}</p>
                      {item.stats && (
                        <div className="flex gap-1 mt-1">
                          {Object.entries(item.stats).map(([stat, val]) => (
                            <span key={stat} className={`text-[7px] uppercase px-1 py-0.5 border rounded-sm ${(val as number) > 0 ? 'text-emerald-400 border-emerald-900/50' : 'text-red-400 border-red-900/50'}`}>
                              {stat}: {(val as number) > 0 ? '+' : ''}{val as number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400/70" />
                        <span className="text-sm font-mono text-amber-400">{cost}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch({ type: 'BUY_ITEM', payload: {
                          item: { ...item, id: generateId() },
                          cost
                        } })}
                        disabled={!canAfford}
                        className={`text-[10px] border px-4 py-1.5 uppercase tracking-widest rounded-sm transition-colors ${canAfford ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40' : 'border-white/10 text-white/20 cursor-not-allowed'}`}
                      >
                        Buy
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="sell" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              {sellableItems.length === 0 ? (
                <p className="text-white/40 italic text-sm text-center py-8">Nothing to sell.</p>
              ) : (
                sellableItems.map((item, index) => {
                  const sellPrice = Math.max(1, Math.floor((item.value || 1) * 0.5));
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] rounded-sm hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-serif text-white/90">{item.name}</span>
                          <span className={`text-[8px] px-1 border uppercase rounded-sm ${item.rarity === 'common' ? 'border-white/20 text-white/40' : 'border-purple-500 text-purple-500'}`}>{item.rarity}</span>
                        </div>
                        <p className="text-[10px] text-white/40 line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-400/70" />
                          <span className="text-sm font-mono text-amber-400">+{sellPrice}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => dispatch({ type: 'SELL_ITEM', payload: { itemId: item.id, price: sellPrice } })}
                          className="text-[10px] border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40 px-4 py-1.5 uppercase tracking-widest rounded-sm transition-colors"
                        >
                          Sell
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
