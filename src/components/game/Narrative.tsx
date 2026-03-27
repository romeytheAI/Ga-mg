import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocationStore } from '../../store/locationStore';
import { useGameStore } from '../../store/gameStore';
import { generateLateGameContent } from '../../services/aiPipeline';

export const Narrative: React.FC = () => {
  const gameState = useGameStore();
  const location = useLocationStore((state) => state.getLocation(gameState.locationId));
  const [desc, setDesc] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      if (typeof location.description === 'function') {
        setDesc(location.description());
      } else {
        setDesc(location.description);
      }
    }
  }, [gameState.locationId, location, gameState.time]);

  // Reset AI content when location changes or time advances significantly
  useEffect(() => {
     setAiContent(null);
  }, [gameState.locationId, gameState.time.hour, gameState.time.day]);

  // Trigger Late Game AI Fetch when the state changes and no content exists
  useEffect(() => {
    if (gameState.isLateGame && !aiContent && !aiLoading) {
      const fetchAI = async () => {
         setAiLoading(true);
         try {
            // Send the entire game state to the pipeline
            const content = await generateLateGameContent(gameState);
            setAiContent(content);
         } catch (error) {
            console.error("Pipeline entirely failed:", error);
         } finally {
            setAiLoading(false);
         }
      };

      fetchAI();
    }
  }, [gameState.isLateGame, gameState.locationId, gameState.time.hour, aiContent, aiLoading]); // Trigger fetch when aiContent is cleared

  return (
    <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 pb-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState.locationId + gameState.time.hour} // Animate on hour changes too
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="prose prose-invert prose-lg max-w-none font-serif leading-relaxed text-slate-300"
        >
          {gameState.isLateGame && (
             <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded mb-6 text-purple-200">
               <span className="font-bold uppercase tracking-wider text-sm mb-2 block animate-pulse">The Blight Looms... (Late Game Enabled)</span>
               The familiar structures of Tamriel feel distorted. Reality warps around your high corruption...
             </div>
          )}

          <h1 className="text-4xl font-bold text-amber-500 mb-6 border-b border-slate-800 pb-4 tracking-tight drop-shadow-md">
            {location?.name || 'Unknown Location'}
          </h1>

          <div className="text-lg space-y-4 whitespace-pre-line tracking-wide">
             {desc}
          </div>

          {/* Render AI Generated Content below deterministic content */}
          {gameState.isLateGame && (
            <div className="mt-8 pt-8 border-t border-purple-900/50 relative">
               {aiLoading ? (
                 <div className="flex items-center gap-3 text-purple-400 italic">
                    <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping"></div>
                    The Daedric Princes are whispering your fate... (Generating Uncensored Context)
                 </div>
               ) : (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-purple-100 italic font-light leading-loose text-xl bg-gradient-to-br from-purple-950/30 to-black/50 p-6 rounded-lg border border-purple-500/20 shadow-2xl"
                  >
                   {aiContent}
                 </motion.div>
               )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
