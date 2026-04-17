import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GameState, Item } from '../../types';

interface InventoryModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  selectedItem: Item | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ state, dispatch, selectedItem, setSelectedItem }) => {
  return (
    <>
      <AnimatePresence>
        {state.ui.show_inventory && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-500 rounded-full blur-[1px]"
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
              <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_inventory', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white" aria-label="Close modal">
              <X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Possessions</h2>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Backpack</h3>
                  <div className="flex flex-col gap-2">
                    {state.player.inventory.map((item, index) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedItem(item)}
                        className={`p-3 border ${item.is_equipped ? 'border-white/40 bg-white/5' : 'border-white/10 bg-black'} rounded-sm transition-all hover:border-white/30 group relative flex flex-col cursor-pointer`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-serif text-white/90">{item.name}</span>
                            <span className={`text-[8px] px-1 border uppercase rounded-sm ${item.rarity === 'common' ? 'border-white/20 text-white/40' : item.rarity === 'mythic' ? 'border-red-500 text-red-500' : 'border-purple-500 text-purple-500'}`}>{item.rarity}</span>
                          </div>
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">{item.type} {item.slot ? `(${item.slot})` : ''}</span>
                        </div>
                        <p className="text-[10px] text-white/40 mb-2 line-clamp-1 group-hover:line-clamp-none transition-all">{item.description}</p>
                        
                        <div className="flex justify-between items-end mt-auto pt-2">
                          <div className="flex flex-wrap gap-1">
                            {item.stats && Object.entries(item.stats).map(([stat, val]) => (
                              <span key={stat} className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 border rounded-sm ${(val as number) > 0 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' : 'text-red-400 border-red-900/50 bg-red-950/30'}`}>
                                {stat}: {(val as number) > 0 ? '+' : ''}{val as number}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.integrity !== undefined && (
                              <div className="flex items-center gap-1 mr-2">
                                <span className="text-[8px] text-white/30 uppercase">INT</span>
                                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-white/40" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.integrity}%` }} 
                                  />
                                </div>
                              </div>
                            )}
                            {item.type === 'consumable' ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'USE_ITEM', payload: { itemId: item.id } }); }}
                                className="text-[10px] border border-emerald-500/30 bg-emerald-900/20 px-3 py-1 hover:bg-emerald-900/40 uppercase tracking-widest text-emerald-400 transition-colors"
                              >
                                Consume
                              </motion.button>
                            ) : ['weapon', 'armor', 'clothing'].includes(item.type) ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: item.is_equipped ? 'UNEQUIP_ITEM' : 'EQUIP_ITEM', payload: { itemId: item.id, slot: item.slot } }); }}
                                className={`text-[10px] border px-3 py-1 uppercase tracking-widest transition-colors ${item.is_equipped ? 'border-white/40 bg-white/10 hover:bg-white/20 text-white' : 'border-white/20 hover:bg-white/10 text-white/60'}`}
                              >
                                {item.is_equipped ? 'Unequip' : 'Equip'}
                              </motion.button>
                            ) : item.special_effect ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'INTERACT_ITEM', payload: { itemId: item.id } }); }}
                                className="text-[10px] border border-purple-500/30 bg-purple-900/20 px-3 py-1 hover:bg-purple-900/40 uppercase tracking-widest text-purple-400 transition-colors"
                              >
                                Interact
                              </motion.button>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Equipped Layers</h3>
                  <div className="space-y-2">
                    {['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'].map(slot => {
                      const equipped = state.player.inventory.find(i => i.slot === slot && i.is_equipped);
                      return (
                        <div 
                          key={slot} 
                          onClick={() => equipped && setSelectedItem(equipped)}
                          className={`flex justify-between items-center p-3 border border-white/5 bg-white/[0.02] rounded-sm transition-colors ${equipped ? 'cursor-pointer hover:bg-white/5' : ''}`}
                        >
                          <span className="text-[10px] uppercase text-white/30 tracking-tighter">{slot}</span>
                          <span className="text-xs text-white/70 font-serif">{equipped ? equipped.name : <span className="text-white/20 italic">Empty</span>}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-500 rounded-full blur-[1px]"
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-amber-900/30 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-white/40 hover:text-white" aria-label="Close modal">
              <X className="w-6 h-6" /></button>
              
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-serif text-amber-500/90 tracking-widest uppercase">{selectedItem.name}</h2>
                <span className={`text-[10px] px-2 py-1 border uppercase rounded-sm ${selectedItem.rarity === 'common' ? 'border-white/20 text-white/40' : selectedItem.rarity === 'mythic' ? 'border-red-500 text-red-500' : 'border-purple-500 text-purple-500'}`}>{selectedItem.rarity}</span>
              </div>
              
              <div className="space-y-6">
                <div className="text-sm text-white/60 italic border-l-2 border-white/10 pl-4 py-2">
                  {selectedItem.description}
                </div>
                
                {selectedItem.lore && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-white/80 font-serif leading-relaxed text-lg">
                      {selectedItem.lore}
                    </p>
                  </div>
                )}

                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedItem.stats).map(([stat, val]) => (
                      <span key={stat} className={`text-xs uppercase tracking-widest px-2 py-1 border rounded-sm ${(val as number) > 0 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' : 'text-red-400 border-red-900/50 bg-red-950/30'}`}>
                        {stat}: {(val as number) > 0 ? '+' : ''}{val as number}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Type: {selectedItem.type}</span>
                  {selectedItem.slot && <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Slot: {selectedItem.slot}</span>}
                  <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Weight: {selectedItem.weight}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Value: {selectedItem.value}</span>
                </div>

                <div className="flex gap-3 pt-6 border-t border-white/10">
                  {selectedItem.type === 'consumable' && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        dispatch({ type: 'USE_ITEM', payload: { itemId: selectedItem.id } });
                        setSelectedItem(null);
                      }}
                      className="flex-1 border border-emerald-900/50 bg-emerald-950/10 text-emerald-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                    >
                      Use
                    </motion.button>
                  )}

                  {selectedItem.type !== 'consumable' && selectedItem.special_effect && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(167, 139, 250, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        dispatch({ type: 'INTERACT_ITEM', payload: { itemId: selectedItem.id } });
                        setSelectedItem(null);
                      }}
                      className="flex-1 border border-purple-900/50 bg-purple-950/10 text-purple-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                    >
                      Interact
                    </motion.button>
                  )}
                  
                  {['weapon', 'armor', 'clothing'].includes(selectedItem.type) && selectedItem.slot && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (selectedItem.is_equipped) {
                          dispatch({ type: 'UNEQUIP_ITEM', payload: { itemId: selectedItem.id } });
                        } else {
                          dispatch({ type: 'EQUIP_ITEM', payload: { itemId: selectedItem.id, slot: selectedItem.slot } });
                        }
                        setSelectedItem(null);
                      }}
                      className="flex-1 border border-blue-900/50 bg-blue-950/10 text-blue-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                    >
                      {selectedItem.is_equipped ? 'Unequip' : 'Equip'}
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      dispatch({ type: 'DROP_ITEM', payload: { itemId: selectedItem.id } });
                      setSelectedItem(null);
                    }}
                    className="flex-1 border border-red-900/50 bg-red-950/10 text-red-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                  >
                    Drop
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
