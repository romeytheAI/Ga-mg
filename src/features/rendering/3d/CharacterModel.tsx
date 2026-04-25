import React from 'react';
import { motion } from 'motion/react';
import { Anatomy } from '../core/types';

interface CharacterModelProps {
  anatomy: Anatomy;
  isPlayer: boolean;
}

export const CharacterModel: React.FC<CharacterModelProps> = ({ anatomy, isPlayer }) => {
  // Derive visual style from anatomy
  const isTall = parseInt(anatomy.height) > 180;
  const isMuscular = anatomy.build === 'muscular';
  const skinColor = anatomy.skin === 'pale''? 'bg-stone-200'': anatomy.skin === 'dark''? 'bg-stone-800'': 'bg-stone-500';

  return (
    <div className="relative w-48 h-64 perspective-1000">
      <motion.div
        className={`absolute inset-0 ${isPlayer ? 'border-blue-500'': 'border-red-500'} border-2 rounded-sm overflow-hidden`}
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
        <div className={`absolute top-1/3 left-1/6 w-2/3 h-1/2 ${skinColor} ${isMuscular ? 'rounded-lg'': 'rounded-md'}`} />
        
        {/* Details */}
        <div className="absolute inset-0 p-4 text-white/80 text-[10px] font-mono bg-black/40 backdrop-blur-sm">
          <h4 className="uppercase tracking-widest mb-2 font-bold">{anatomy.visage}</h4>
          <p>Height: {anatomy.height}</p>
          <p>Build: {anatomy.build}</p>
        </div>
      </motion.div>
    </div>
  );
};
