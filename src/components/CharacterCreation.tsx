import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, Shield, Scroll, Crown, Dna } from 'lucide-react';
import { GameState } from '../types';

interface CharacterCreationProps {
  onComplete: (characterData: Partial<GameState['player']>) => void;
  onCancel: () => void;
}

const RACES = ['Human', 'Elf', 'Dark Elf', 'Orc', 'Khajiit', 'Argonian', 'Breton', 'Redguard'];
const GENDERS = ['Female', 'Male', 'Non-Binary'];
const ORIGINS = ['Orphan', 'Street Urchin', 'Fallen Noble', 'Apprentice'];
const BIRTHSIGNS = ['The Thief', 'The Warrior', 'The Mage', 'The Lover', 'The Shadow', 'The Steed'];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: 'Vael',
    gender: 'Female',
    race: 'Human',
    origin: 'Orphan',
    birthsign: 'The Thief',
    hairColor: 'Black',
    eyeColor: 'Blue',
    skinTone: 'Fair',
    hairLength: 'Shoulder-length'
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onCancel();
  };

  const handleFinish = () => {
    const playerUpdate: Partial<GameState['player']> = {
      identity: {
        name: formData.name,
        race: formData.race,
        birthsign: formData.birthsign,
        origin: formData.origin,
        gender: formData.gender.toLowerCase()
      },
      cosmetics: {
        hair_length: formData.hairLength,
        eye_color: formData.eyeColor,
        skin_tone: formData.skinTone,
        tattoos: [],
        piercings: [],
        posture: "cautious",
        scars: [],
        voice_pitch: "medium",
        scent: "dust",
        literacy: formData.origin !== 'Orphan' && formData.origin !== 'Street Urchin', // Basic logic
        dominant_hand: "right",
        resting_hr: 75,
        blushing: true,
        body_mods: [],
        true_name: formData.name
      },
      // Adjust stats based on origin/race if needed
      stats: {
        // We can't easily access the full stats object here without importing initialState
        // So we will just pass what we have and let the parent merge it
        // Or we could modify specific stats here
      } as any
    };
    onComplete(playerUpdate);
  };

  const steps = [
    { title: 'Identity', icon: <User /> },
    { title: 'Background', icon: <Scroll /> },
    { title: 'Appearance', icon: <Sparkles /> }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white font-serif">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-black/80 border border-white/10 p-8 rounded-lg backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl tracking-widest uppercase">Character Creation</h2>
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${i === step ? 'bg-white' : 'bg-white/20'}`} 
              />
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-3 focus:border-white/40 outline-none transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Gender</label>
                  <div className="grid grid-cols-1 gap-2">
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData({...formData, gender: g})}
                        className={`p-3 text-left border transition-all ${formData.gender === g ? 'bg-white/10 border-white/40' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Race</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto scrollbar-thin">
                    {RACES.map(r => (
                      <button
                        key={r}
                        onClick={() => setFormData({...formData, race: r})}
                        className={`p-2 text-xs text-left border transition-all ${formData.race === r ? 'bg-white/10 border-white/40' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Origin</label>
                  <div className="flex flex-col gap-2">
                    {ORIGINS.map(o => (
                      <button
                        key={o}
                        onClick={() => setFormData({...formData, origin: o})}
                        className={`p-3 text-left border transition-all ${formData.origin === o ? 'bg-white/10 border-white/40' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                      >
                        <span className="block text-sm uppercase tracking-wider">{o}</span>
                        <span className="text-xs text-white/40">
                          {o === 'Orphan' && 'Balanced stats. High trauma.'}
                          {o === 'Street Urchin' && '+Stealth, +Survival. Low Wealth.'}
                          {o === 'Fallen Noble' && '+Charisma, +Literacy. -Survival.'}
                          {o === 'Apprentice' && '+Intelligence, +Magic. -Strength.'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Birthsign</label>
                  <div className="flex flex-col gap-2">
                    {BIRTHSIGNS.map(b => (
                      <button
                        key={b}
                        onClick={() => setFormData({...formData, birthsign: b})}
                        className={`p-2 text-sm text-left border transition-all ${formData.birthsign === b ? 'bg-white/10 border-white/40' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Hair Color</label>
                  <select 
                    value={formData.hairColor}
                    onChange={(e) => setFormData({...formData, hairColor: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-2 focus:border-white/40 outline-none"
                  >
                    {['Black', 'Brown', 'Blonde', 'Red', 'White', 'Silver', 'Blue', 'Green'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Eye Color</label>
                  <select 
                    value={formData.eyeColor}
                    onChange={(e) => setFormData({...formData, eyeColor: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-2 focus:border-white/40 outline-none"
                  >
                    {['Blue', 'Green', 'Brown', 'Hazel', 'Grey', 'Violet', 'Red', 'Black'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Skin Tone</label>
                  <select 
                    value={formData.skinTone}
                    onChange={(e) => setFormData({...formData, skinTone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-2 focus:border-white/40 outline-none"
                  >
                    {['Pale', 'Fair', 'Medium', 'Olive', 'Tan', 'Dark', 'Ebony', 'Grey', 'Green'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60">Hair Length</label>
                  <select 
                    value={formData.hairLength}
                    onChange={(e) => setFormData({...formData, hairLength: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-2 focus:border-white/40 outline-none"
                  >
                    {['Bald', 'Buzzcut', 'Short', 'Chin-length', 'Shoulder-length', 'Long', 'Waist-length', 'Floor-length'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
               </div>

               <div className="mt-8 p-4 bg-white/5 border border-white/10">
                 <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">Summary</h3>
                 <p className="text-sm leading-relaxed text-white/80">
                   You are <span className="text-white font-bold">{formData.name}</span>, a <span className="text-white">{formData.gender} {formData.race}</span> {formData.origin.toLowerCase()}. 
                   Born under the sign of <span className="text-white">{formData.birthsign}</span>, you find yourself at the Town Orphanage...
                 </p>
               </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={handleBack}
            className="px-6 py-2 border border-white/10 hover:bg-white/5 text-sm uppercase tracking-widest transition-colors"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <button 
            onClick={handleNext}
            className="px-8 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-sm uppercase tracking-widest transition-colors"
          >
            {step === 2 ? 'Begin Journey' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
