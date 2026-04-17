import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GameState } from '../../types';
import { LOCATIONS } from '../../data/locations';
import { getAllNpcCurrentLocations } from '../../utils/scheduleEngine';
import { NPCS } from '../../data/npcs';

interface MapModalProps {
  state: GameState;
  dispatch?: React.Dispatch<any>;
  handleAction?: (actionName: string, actionType: string) => void;
  onClose?: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ state, dispatch, handleAction, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (dispatch) {
      dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_map', value: false } });
    }
  };

  // Compute NPC locations from schedule engine
  const npcLocations = React.useMemo(
    () => getAllNpcCurrentLocations(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.world.hour, state.world.week_day, state.world.day]
  );

  // Group NPCs by location id
  const npcsByLocation = React.useMemo<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    for (const [npcId, locId] of Object.entries(npcLocations)) {
      if (!map[locId]) map[locId] = [];
      map[locId].push(npcId);
    }
    return map;
  }, [npcLocations]);

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
            className="absolute w-1 h-1 bg-blue-500 rounded-full blur-[1px]"
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
        <button onClick={handleClose} className="absolute top-6 right-6 text-white/40 hover:text-white" aria-label="Close modal">
              <X className="w-6 h-6" /></button>
        <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Cartography of Tamriel</h2>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 aspect-video bg-white/[0.02] border border-white/10 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/map/1000/600')] bg-cover grayscale" />
            
            {/* Render Locations */}
            {Object.values(LOCATIONS).map((loc: any) => {
              const isCurrent = state.world.current_location.id === loc.id;
              const npcsHere = npcsByLocation[loc.id] ?? [];
              return (
                <motion.button 
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  key={loc.id}
                  onClick={() => {
                    if (!isCurrent) {
                      handleAction?.(`Travel to ${loc.name}`, "travel");
                      handleClose();
                    }
                  }}
                  className={`absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2 z-10 group ${!isCurrent ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full border border-black ${isCurrent ? 'bg-red-500 animate-pulse' : 'bg-white/60 group-hover:bg-white transition-colors'}`} />
                    {/* NPC count badge */}
                    {npcsHere.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-sky-500 text-[6px] font-bold text-white flex items-center justify-center leading-none">
                        {npcsHere.length}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] tracking-widest uppercase whitespace-nowrap bg-black/80 px-2 py-1 rounded-sm border ${isCurrent ? 'text-red-400 border-red-900/50' : 'text-white/60 border-white/10 group-hover:text-white group-hover:border-white/30'} transition-all`}>
                    {loc.name}
                  </span>
                  {/* NPC name tooltip on hover */}
                  {npcsHere.length > 0 && (
                    <div className="hidden group-hover:flex flex-col gap-0.5 bg-black/90 border border-sky-900/50 px-2 py-1 rounded-sm absolute top-full mt-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none min-w-max">
                      {npcsHere.slice(0, 5).map(npcId => {
                        const npcName = NPCS[npcId]?.name ?? npcId;
                        return (
                          <span key={npcId} className="text-[8px] text-sky-300/80 uppercase tracking-widest">
                            {npcName}
                          </span>
                        );
                      })}
                      {npcsHere.length > 5 && (
                        <span className="text-[8px] text-white/30 uppercase tracking-widest">+{npcsHere.length - 5} more</span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}

            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/[0.03]" />
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">World State</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-1">Weather</span>
                <span className="text-sm text-white/80 font-serif">{state.world.weather}</span>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-1">Local Tension</span>
                <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-orange-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${state.world.local_tension * 100}%` }} 
                  />
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-1">Active Events</span>
                <div className="flex flex-col gap-2 mt-2">
                  {state.world.active_world_events.length > 0 ? state.world.active_world_events.map(e => (
                    <span key={e} className="text-[10px] text-white/60 border-l border-white/20 pl-2">{e}</span>
                  )) : <span className="text-[10px] text-white/20 italic">No significant events</span>}
                </div>
              </div>
              {/* NPC Location Summary */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <span className="text-[10px] uppercase text-white/30 block mb-2">NPCs Present Nearby</span>
                {(() => {
                  const currentLocId = state.world.current_location.id;
                  const here = npcsByLocation[currentLocId] ?? [];
                  if (here.length === 0) {
                    return <span className="text-[10px] text-white/20 italic">No one nearby</span>;
                  }
                  return (
                    <div className="flex flex-col gap-1">
                      {here.map(npcId => (
                        <span key={npcId} className="text-[10px] text-sky-300/70 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60 inline-block shrink-0" />
                          {NPCS[npcId]?.name ?? npcId}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
