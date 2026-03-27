import React from 'react';
import { useGameStore, ClothingLayer } from '../store/gameStore';
import { SvgPlayerModel } from './model/SvgBodyLayers';

export const AnimationWindow: React.FC = () => {
  const { stats, clothing, xrayMode, toggleXray } = useGameStore();

  // Calculate total exposure
  let exposedValue = 0;
  const layers: ClothingLayer[] = ['over', 'upper', 'lower', 'under_upper', 'under_lower'];
  layers.forEach(layer => {
     if (!clothing[layer]) {
        exposedValue += 20; // Base exposure per missing layer
     } else {
        // If clothing is damaged, it exposes more
        const damagePercent = 1 - (clothing[layer]!.integrity / clothing[layer]!.maxIntegrity);
        exposedValue += damagePercent * 10;
     }
  });

  const isNaked = exposedValue > 60; // Just a rough heuristic for MVP
  const isCorrupted = stats.corruption > 1000;

  return (
    <div className="w-full aspect-square bg-stone-300 dark:bg-stone-800 rounded-lg overflow-hidden border-4 border-stone-400 dark:border-stone-700 relative flex flex-col">
       {/* Background based on corruption/hallucination */}
       <div
         className="absolute inset-0 opacity-50 transition-colors duration-1000"
         style={{
           backgroundColor: stats.hallucination > 0 ? '#ec4899' : (isCorrupted ? '#4f46e5' : 'transparent'),
           mixBlendMode: 'overlay'
         }}
       />

       {/* Full Body SVG Layer System */}
       <div className="flex-1 relative z-10 p-2">
          <SvgPlayerModel stats={stats} clothing={clothing} xrayMode={xrayMode} />
       </div>

       {/* UI Feedback Overlay */}
       <div className="relative z-20 bg-stone-200/90 dark:bg-stone-900/90 border-t border-stone-400 dark:border-stone-700 p-2 text-center text-xs backdrop-blur-sm flex justify-between px-4">
          <span className="font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
             {isNaked ? 'Exposed' : 'Clothed'}
          </span>
          <span className="font-mono text-stone-600 dark:text-stone-300 font-bold">
            Integrity: {Math.floor(100 - exposedValue)}%
          </span>
       </div>


       {/* X-Ray Toggle Button */}
       <button
         onClick={toggleXray}
         className={`absolute top-2 left-2 z-40 px-2 py-1 text-xs font-bold rounded border transition-all ${
            xrayMode
              ? 'bg-pink-500/80 text-white border-pink-300 shadow-[0_0_10px_#ec4899]'
              : 'bg-stone-800/50 text-stone-400 border-stone-600 hover:bg-stone-700/50'
         }`}
       >
         X-RAY
       </button>

       {/* Corner Status Indicators */}

       {stats.hallucination > 0 && (
         <div className="absolute top-2 right-2 text-pink-500 animate-pulse text-2xl z-30 pointer-events-none">✨</div>
       )}
       {isCorrupted && (
         <div className="absolute bottom-10 left-2 text-indigo-500 animate-pulse text-2xl z-30 pointer-events-none">👁️</div>
       )}
    </div>
  );
};
