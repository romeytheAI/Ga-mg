import React from 'react';
import { motion } from 'motion/react';
import { Anatomy, GameState } from '../types';

interface CharacterModelProps {
  anatomy: Anatomy;
  isPlayer: boolean;
  state?: GameState;
}

export const CharacterModel: React.FC<CharacterModelProps> = ({ anatomy, isPlayer, state }) => {
  // Derive visual style from anatomy
  const isTall = parseInt(anatomy.height) > 180;
  const isMuscular = anatomy.build === 'muscular';
  const skinColor = anatomy.skin === 'pale' ? 'bg-stone-200' : anatomy.skin === 'dark' ? 'bg-stone-800' : 'bg-stone-500';

  return (
    <div className="relative w-48 h-64 perspective-1000">
      <motion.div
        className={`absolute inset-0 ${isPlayer ? 'border-blue-500' : 'border-red-500'} border-2 rounded-sm overflow-hidden`}
        style={{
          transformStyle: 'preserve-3d',
          rotateY: 20,
          rotateX: 10,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Head */}
        <div className={`absolute top-4 left-1/4 w-1/2 h-1/4 ${skinColor} rounded-full`} />
        
        {/* Body */}
        <div className={`absolute top-1/3 left-1/6 w-2/3 h-1/2 ${skinColor} ${isMuscular ? 'rounded-lg' : 'rounded-md'}`} />
        
        {/* Details */}
        <div className="absolute inset-0 p-4 text-white/80 text-[10px] font-mono bg-black/40 backdrop-blur-sm">
          <h4 className="uppercase tracking-widest mb-2 font-bold">{anatomy.visage}</h4>
          <p>Height: {anatomy.height}</p>
          <p>Build: {anatomy.build}</p>
          
          {isPlayer && state && state.player.clothing_damage.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
              <h5 className="text-[8px] text-red-400 uppercase tracking-widest">Attire Condition</h5>
              {state.player.clothing_damage.map(d => (
                <div key={d.slot} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-[7px] uppercase">
                    <span className="text-white/40">{d.slot}</span>
                    <span className="text-red-300">{d.tear_size}% torn</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {d.stains.map(s => (
                      <span key={s} className="px-1 bg-black/60 border border-white/5 text-[6px] text-white/30 uppercase">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
