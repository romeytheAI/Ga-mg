import React from 'react';
import { useGameStore, ClothingLayer } from '../store/gameStore';

export const AnimationWindow: React.FC = () => {
  const { stats, clothing } = useGameStore();

  // Basic logic to determine visual state based on stats
  const isBlushing = stats.arousal > stats.maxArousal * 0.5;
  const isCrying = stats.trauma > stats.maxTrauma * 0.5;
  const isSweating = stats.fatigue < stats.maxFatigue * 0.3 || stats.stress > stats.maxStress * 0.7;

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
    <div className="w-full aspect-square bg-stone-300 dark:bg-stone-800 rounded-lg overflow-hidden border-4 border-stone-400 dark:border-stone-700 relative flex items-center justify-center">
       {/* Placeholder for actual sprites. Using text/CSS for MVP visual feedback */}

       {/* Background based on corruption/hallucination */}
       <div
         className="absolute inset-0 opacity-50 transition-colors duration-1000"
         style={{
           backgroundColor: stats.hallucination > 0 ? '#ec4899' : (isCorrupted ? '#4f46e5' : 'transparent'),
           mixBlendMode: 'overlay'
         }}
       />

       {/* Character Silhouette */}
       <div className="relative z-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-stone-400 dark:bg-stone-600 mb-4 relative shadow-inner">
             {/* Expressions */}
             <div className="absolute inset-0 flex items-center justify-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-stone-800 dark:bg-stone-200" />
                <div className="w-3 h-3 rounded-full bg-stone-800 dark:bg-stone-200" />
             </div>
             {isBlushing && (
                <div className="absolute top-14 w-full flex justify-center space-x-6 opacity-70">
                   <div className="w-4 h-2 bg-pink-500 rounded-full blur-[2px]" />
                   <div className="w-4 h-2 bg-pink-500 rounded-full blur-[2px]" />
                </div>
             )}
             {isCrying && (
                <div className="absolute top-12 w-full flex justify-center space-x-8 opacity-80">
                   <div className="w-1 h-3 bg-blue-400 rounded-full" />
                   <div className="w-1 h-3 bg-blue-400 rounded-full" />
                </div>
             )}
             {isSweating && (
                <div className="absolute top-4 right-4 w-2 h-3 bg-cyan-300 rounded-b-full opacity-70" />
             )}
          </div>

          {/* Body/Clothing State Text Representation */}
          <div className="font-bold uppercase tracking-widest text-sm text-stone-500 dark:text-stone-400">
             {isNaked ? 'Exposed' : 'Clothed'}
          </div>

          <div className="mt-2 text-xs font-mono bg-stone-200 dark:bg-stone-900 px-2 py-1 rounded">
            Integrity: {Math.floor(100 - exposedValue)}%
          </div>
       </div>

       {/* Corner Status Indicators */}
       {stats.hallucination > 0 && (
         <div className="absolute top-2 right-2 text-pink-500 animate-pulse text-2xl">✨</div>
       )}
       {isCorrupted && (
         <div className="absolute bottom-2 left-2 text-indigo-500 animate-pulse text-2xl">👁️</div>
       )}
    </div>
  );
};
