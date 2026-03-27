import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore, PlayableRace, Background, ClothingLayer, ClothingItem, Gender } from '../../store/gameStore';
import { Shield, Coins, Brain, Flame, Skull } from 'lucide-react';

const RACES: { id: PlayableRace; desc: string; mods: any }[] = [
  { id: 'Altmer', desc: 'High Elves. High magicka, but fragile.', mods: { maxMagicka: 150, maxHealth: 80, magicka: 150, health: 80 } },
  { id: 'Argonian', desc: 'Reptilian natives of Black Marsh. Resistant to disease and fatigue.', mods: { maxFatigue: 150, fatigue: 150, corruption: -500 } },
  { id: 'Bosmer', desc: 'Wood Elves. Agile and stealthy.', mods: { maxFatigue: 120, fatigue: 120 } },
  { id: 'Breton', desc: 'Human-Elf hybrids. Resistant to magic.', mods: { maxMagicka: 120, magicka: 120, maxHealth: 90, health: 90 } },
  { id: 'Dunmer', desc: 'Dark Elves. Resilient and adaptable.', mods: { maxHealth: 110, health: 110, maxMagicka: 110, magicka: 110 } },
  { id: 'Imperial', desc: 'Natives of Cyrodiil. Natural diplomats.', mods: { maxFatigue: 110, fatigue: 110, septims: 50 } }, // Start with more money
  { id: 'Khajiit', desc: 'Feline humanoids. Quick and stealthy.', mods: { maxFatigue: 130, fatigue: 130 } },
  { id: 'Nord', desc: 'Tall, hardy humans of Skyrim. Strong and tough.', mods: { maxHealth: 130, health: 130 } },
  { id: 'Orc', desc: 'Orsimer. Formidable warriors.', mods: { maxHealth: 140, health: 140, maxMagicka: 30, magicka: 30 } },
  { id: 'Redguard', desc: 'Naturally talented warriors from Hammerfell.', mods: { maxFatigue: 140, fatigue: 140, maxHealth: 120, health: 120 } }
];

const BACKGROUNDS: { id: Background; desc: string; mods: any; clothing: Record<ClothingLayer, ClothingItem | null> }[] = [
  {
    id: 'Prisoner',
    desc: 'You start with nothing but the rags on your back and a heavy burden.',
    mods: { septims: 0, stress: 1000, trauma: 500 },
    clothing: {
      over: null,
      upper: { id: 'prisoner_shirt', name: 'Rough Sackcloth', layer: 'upper', integrity: 50, maxIntegrity: 100, exposure: 40, description: 'Itchy and degrading.' },
      lower: { id: 'prisoner_pants', name: 'Torn Pants', layer: 'lower', integrity: 50, maxIntegrity: 100, exposure: 40, description: 'Barely covering you.' },
      under_upper: null,
      under_lower: null
    }
  },
  {
    id: 'Orphan',
    desc: 'Raised on the streets. You know how to survive, but carry trauma.',
    mods: { septims: 10, stress: 500, trauma: 1500, maxStress: 12000 },
    clothing: {
      over: null,
      upper: { id: 'orphan_shirt', name: 'Oversized Shirt', layer: 'upper', integrity: 70, maxIntegrity: 100, exposure: 20, description: 'Smells of the alleyways.' },
      lower: { id: 'orphan_pants', name: 'Patched Pants', layer: 'lower', integrity: 80, maxIntegrity: 100, exposure: 10, description: 'Patched many times.' },
      under_upper: null,
      under_lower: null
    }
  },
  {
    id: 'Mage Apprentice',
    desc: 'Kicked out of the Guild. You have some savings and decent robes.',
    mods: { septims: 100, maxMagicka: 50, magicka: 50 }, // Bonus magicka
    clothing: {
      over: { id: 'apprentice_robe', name: 'Apprentice Robes', layer: 'over', integrity: 100, maxIntegrity: 100, exposure: 0, description: 'Standard guild issue.' },
      upper: null,
      lower: null,
      under_upper: { id: 'linen_wrap', name: 'Linen Bindings', layer: 'under_upper', integrity: 100, maxIntegrity: 100, exposure: 10, description: 'Comfortable linen.' },
      under_lower: { id: 'linen_undergarment', name: 'Linen Undergarment', layer: 'under_lower', integrity: 100, maxIntegrity: 100, exposure: 10, description: 'Basic linen.' }
    }
  },
  {
    id: 'Street Thief',
    desc: 'Always looking over your shoulder. High stress, but well-equipped.',
    mods: { septims: 150, stress: 2000, maxFatigue: 20, fatigue: 20 },
    clothing: {
      over: null,
      upper: { id: 'leather_jerkin', name: 'Leather Jerkin', layer: 'upper', integrity: 100, maxIntegrity: 150, exposure: 10, description: 'Tough boiled leather.' },
      lower: { id: 'leather_pants', name: 'Leather Pants', layer: 'lower', integrity: 100, maxIntegrity: 150, exposure: 10, description: 'Quiet and sturdy.' },
      under_upper: null,
      under_lower: null
    }
  }
];

const PROVINCES: { name: string; id: string; desc: string; startNode: string }[] = [
  { name: 'Morrowind', id: 'morrowind', desc: 'The ash-covered lands of the Dunmer.', startNode: 'seyda_neen_docks' },
  { name: 'Skyrim', id: 'skyrim', desc: 'The freezing, mountainous home of the Nords.', startNode: 'solitude_docks' },
  { name: 'Cyrodiil', id: 'cyrodiil', desc: 'The heartland of the Empire.', startNode: 'imperial_city_prison' },
  { name: 'Black Marsh', id: 'black_marsh', desc: 'The poisonous swamps of the Argonians.', startNode: 'blackrose_prison' },
  { name: 'Elsweyr', id: 'elsweyr', desc: 'The arid deserts and jungles of the Khajiit.', startNode: 'senchal_slums' },
  { name: 'Valenwood', id: 'valenwood', desc: 'The walking, endless forests of the Bosmer.', startNode: 'falinesti_roots' },
  { name: 'Summerset Isles', id: 'summerset', desc: 'The pristine, arrogant home of the Altmer.', startNode: 'alinor_docks' },
  { name: 'Hammerfell', id: 'hammerfell', desc: 'The vast deserts and corsair coasts of the Redguards.', startNode: 'stros_mkai_port' },
  { name: 'High Rock', id: 'high_rock', desc: 'The mountainous, politically fractured home of the Bretons.', startNode: 'daggerfall_gates' }
];

export const CharacterCreation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<Gender>('Female');
  const [race, setRace] = useState<PlayableRace>('Imperial');
  const [bg, setBg] = useState<Background>('Prisoner');
  const [province, setProvince] = useState(PROVINCES[0]);

  const startGame = useGameStore((state) => state.startGame);

  const handleStart = () => {
    const selectedRace = RACES.find(r => r.id === race)!;
    const selectedBg = BACKGROUNDS.find(b => b.id === bg)!;

    // Merge modifiers
    const combinedMods = { ...selectedRace.mods };
    for (const [key, value] of Object.entries(selectedBg.mods)) {
       combinedMods[key] = (combinedMods[key] || 0) + (value as number);
    }

    startGame(
      gender,
      race,
      bg,
      province.startNode,
      combinedMods,
      selectedBg.clothing
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 justify-center items-center overflow-hidden selection:bg-amber-500/30">

      <div className="max-w-4xl w-full flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif font-bold text-amber-500 tracking-wider mb-4 drop-shadow-lg">
            A New Life
          </h1>
          <p className="text-slate-400 italic font-serif">"Stand up. There you go. You were dreaming."</p>
        </motion.div>

        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex relative min-h-[500px]">

           {/* Progress Sidebar */}
           <div className="w-1/4 bg-slate-950 p-6 border-r border-slate-800 flex flex-col gap-6">
              {[
                { s: 1, label: 'Heritage', icon: <Shield size={18} /> },
                { s: 2, label: 'Background', icon: <Brain size={18} /> },
                { s: 3, label: 'Destination', icon: <Flame size={18} /> }
              ].map((item) => (
                <div key={item.s} className={`flex items-center gap-3 transition-colors ${step >= item.s ? 'text-amber-500' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= item.s ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700'}`}>
                    {item.s < step ? <span className="text-sm font-bold">✓</span> : item.s}
                  </div>
                  <span className="font-semibold tracking-wider text-sm uppercase">{item.label}</span>
                </div>
              ))}
           </div>

           {/* Main Content Area */}
           <div className="w-3/4 p-8 relative flex flex-col">

              <AnimatePresence mode="wait">

                {/* STEP 1: RACE */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">

                    <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-4">Select Gender</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {['Female', 'Male'].map(g => (
                        <button
                          key={g}
                          onClick={() => setGender(g as Gender)}
                          className={`p-3 text-center rounded border transition-all ${gender === g ? 'bg-amber-900/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                        >
                          <div className="font-bold text-slate-200">{g}</div>
                        </button>
                      ))}
                    </div>

                    <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-4">Select Heritage</h2>
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-700">
                      {RACES.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setRace(r.id)}
                          className={`p-3 text-left rounded border transition-all ${race === r.id ? 'bg-amber-900/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                        >
                          <div className="font-bold text-slate-200 mb-1">{r.id}</div>
                          <div className="text-xs text-slate-500">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BACKGROUND */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                    <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-6">Select Background</h2>
                    <div className="flex flex-col gap-3">
                      {BACKGROUNDS.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setBg(b.id)}
                          className={`p-4 text-left rounded border transition-all ${bg === b.id ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                        >
                          <div className="font-bold text-slate-200 mb-1">{b.id}</div>
                          <div className="text-sm text-slate-400">{b.desc}</div>
                          {b.mods.stress && <div className="text-xs text-orange-500 mt-2 flex items-center gap-1"><Skull size={12}/> Starts with Stress/Trauma</div>}
                          {b.mods.septims > 0 && <div className="text-xs text-yellow-500 mt-1 flex items-center gap-1"><Coins size={12}/> Starts with {b.mods.septims} Septims</div>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: STARTING LOCATION */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                    <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-6">Select Destination</h2>
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-700">
                      {PROVINCES.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setProvince(p)}
                          className={`p-3 text-left rounded border transition-all ${province.id === p.id ? 'bg-emerald-900/30 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                        >
                          <div className="font-bold text-slate-200 mb-1">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Navigation Footer */}
              <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-end">
                {step > 1 ? (
                   <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                     Back
                   </button>
                ) : <div></div>}

                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="px-6 py-2 rounded bg-amber-600 hover:bg-amber-500 text-black font-bold transition-colors shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    Next
                  </button>
                ) : (
                  <button onClick={handleStart} className="px-8 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse hover:animate-none">
                    Awaken
                  </button>
                )}
              </div>

           </div>

        </div>
      </div>
    </div>
  );
};
