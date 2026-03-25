import React, { useState } from 'react';
import { useGameStore, PlayableRace, Background, ClothingLayer, ClothingItem } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

const races: PlayableRace[] = ['Altmer', 'Argonian', 'Bosmer', 'Breton', 'Dunmer', 'Imperial', 'Khajiit', 'Nord', 'Orc', 'Redguard'];
const backgrounds: Background[] = ['Prisoner', 'Orphan', 'Mage Apprentice', 'Street Thief'];

const initialClothingMap: Record<Background, Record<ClothingLayer, ClothingItem | null>> = {
  Prisoner: {
    over: null, upper: null, under_upper: null, under_lower: null,
    lower: { id: 'prison_pants', name: 'Rough Sackcloth Pants', layer: 'lower', integrity: 50, maxIntegrity: 50, exposure: 20, description: 'Itchy and terrible.' }
  },
  Orphan: {
    over: null, under_upper: null, under_lower: null,
    upper: { id: 'rags_top', name: 'Rags', layer: 'upper', integrity: 20, maxIntegrity: 20, exposure: 80, description: 'Barely hanging together.' },
    lower: { id: 'rags_bottom', name: 'Ragged Bottoms', layer: 'lower', integrity: 20, maxIntegrity: 20, exposure: 80, description: 'Drafty.' }
  },
  'Mage Apprentice': {
    over: null, under_upper: null, under_lower: null,
    upper: { id: 'apprentice_robes', name: 'Apprentice Robes', layer: 'upper', integrity: 100, maxIntegrity: 100, exposure: 0, description: 'Smells like ozone.' },
    lower: { id: 'apprentice_pants', name: 'Apprentice Pants', layer: 'lower', integrity: 100, maxIntegrity: 100, exposure: 0, description: 'Comfortable linen.' }
  },
  'Street Thief': {
    over: null, under_upper: null, under_lower: null,
    upper: { id: 'leather_tunic', name: 'Leather Tunic', layer: 'upper', integrity: 80, maxIntegrity: 80, exposure: 10, description: 'Good for hiding in shadows.' },
    lower: { id: 'leather_pants', name: 'Leather Pants', layer: 'lower', integrity: 80, maxIntegrity: 80, exposure: 10, description: 'Quiet and snug.' }
  }
};

const startingStatsMap: Record<Background, any> = {
  Prisoner: { health: 80, septims: 0, stress: 2000 },
  Orphan: { health: 70, septims: 5, trauma: 1000 },
  'Mage Apprentice': { magicka: 100, septims: 50, stress: 500 },
  'Street Thief': { fatigue: 120, septims: 100, arousal: 500 }
};

export const CharacterCreation: React.FC = () => {
  const startGame = useGameStore((state) => state.startGame);

  const [step, setStep] = useState(1);
  const [race, setRace] = useState<PlayableRace>('Imperial');
  const [background, setBackground] = useState<Background>('Prisoner');

  // Hardcoded for MVP, should be pulled from locations.ts later
  const startingLocationId = 'seyda_neen_docks';

  const handleStart = () => {
    startGame(
      race,
      background,
      startingLocationId,
      startingStatsMap[background],
      initialClothingMap[background]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100 font-serif p-4">
      <div className="max-w-xl w-full bg-stone-800 rounded-lg shadow-2xl overflow-hidden border border-stone-700">

        <div className="p-8 text-center border-b border-stone-700">
          <h1 className="text-3xl font-bold mb-2 text-stone-200">New Life</h1>
          <p className="text-stone-400 italic">"Stand up... there you go. You were dreaming."</p>
        </div>

        <div className="p-8 relative min-h-[400px]">
          <AnimatePresence mode="wait">

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold border-b border-stone-700 pb-2">Select Heritage</h2>
                <div className="grid grid-cols-2 gap-3">
                  {races.map(r => (
                    <button
                      key={r}
                      onClick={() => setRace(r)}
                      className={`p-3 rounded text-left transition-colors border ${
                        race === r
                          ? 'bg-stone-600 border-stone-400 font-bold'
                          : 'bg-stone-700 border-stone-700 hover:bg-stone-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-stone-200 text-stone-900 font-bold rounded hover:bg-stone-300 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold border-b border-stone-700 pb-2">Select Background</h2>
                <div className="space-y-3">
                  {backgrounds.map(b => (
                    <button
                      key={b}
                      onClick={() => setBackground(b)}
                      className={`w-full p-4 rounded text-left transition-colors border ${
                        background === b
                          ? 'bg-stone-600 border-stone-400 font-bold'
                          : 'bg-stone-700 border-stone-700 hover:bg-stone-600'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-stone-700 text-stone-200 font-bold rounded hover:bg-stone-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStart}
                    className="px-6 py-2 bg-red-800 text-white font-bold rounded hover:bg-red-700 transition-colors"
                  >
                    Awaken
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
