import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, User, Shield, Star, Globe } from 'lucide-react';

interface CharacterConfig {
  name: string;
  race: string;
  gender: string;
  birthsign: string;
  origin: string;
  mode: string;
  scenario?: string;
  ironman: boolean;
  sandbox: boolean;
  streamer: boolean;
  hardcore: boolean;
  offline: boolean;
  websockets: boolean;
  seed: string;
}

interface CharacterCreationProps {
  baseConfig: Omit<CharacterConfig, 'name' | 'race' | 'gender' | 'birthsign' | 'origin'>;
  onComplete: (config: CharacterConfig) => void;
  onBack: () => void;
}

const RACES = [
  { id: 'Human', label: 'Human', desc: 'Adaptable and resourceful. Balanced stats, fast skill growth.', statBonuses: { willpower: 5, stamina: 5 } },
  { id: 'Elf', label: 'Elf', desc: 'Graceful and long-lived. High allure and willpower, fragile body.', statBonuses: { allure: 15, willpower: 15, health: -10 } },
  { id: 'Nord', label: 'Nord', desc: 'Hardy and strong. High health and stamina, slow skill growth.', statBonuses: { health: 20, stamina: 20, willpower: -10 } },
  { id: 'Khajiit', label: 'Khajiit', desc: 'Nimble and perceptive. Skulduggery bonus, high purity loss resistance.', statBonuses: { control: 10, allure: 5 } },
  { id: 'Argonian', label: 'Argonian', desc: 'Resilient and amphibious. Disease resistant, swimming mastery.', statBonuses: { health: 10, stamina: 10 } },
  { id: 'Dunmer', label: 'Dark Elf', desc: 'Cunning and touched by shadow. Arcane affinity, high corruption tolerance.', statBonuses: { willpower: 10, allure: 10, purity: -15 } },
  { id: 'Breton', label: 'Breton', desc: 'Magically gifted. Spell resistance, fast willpower recovery.', statBonuses: { willpower: 20, health: -5 } },
  { id: 'Redguard', label: 'Redguard', desc: 'Fierce and disciplined. Athletics and combat mastery.', statBonuses: { stamina: 15, health: 10, willpower: -5 } },
];

const BIRTHSIGNS = [
  { id: 'The Thief', label: 'The Thief', desc: 'Born under luck. +10 skulduggery, +5 seduction. Lower encounter rate.' },
  { id: 'The Warrior', label: 'The Warrior', desc: 'Born for battle. +15 stamina, +10 athletics. Higher damage in encounters.' },
  { id: 'The Mage', label: 'The Mage', desc: 'Born of arcane blood. +15 willpower, unlocks first spell slot.' },
  { id: 'The Shadow', label: 'The Shadow', desc: 'Born in darkness. Stealth advantage, lower NPC suspicion.' },
  { id: 'The Lady', label: 'The Lady', desc: 'Born of beauty. +15 allure, +10 seduction. NPCs start friendlier.' },
  { id: 'The Lover', label: 'The Lover', desc: 'Born of desire. Lust mechanics amplified — pleasure and peril entwined.' },
  { id: 'The Tower', label: 'The Tower', desc: 'Born of isolation. +20 control, lower trauma accumulation.' },
  { id: 'The Serpent', label: 'The Serpent', desc: 'Born of venom. Parasite immunity, poison resistance, dark reputation.' },
];

const ORIGINS = [
  { id: 'Orphan', label: 'Street Orphan', desc: 'Nothing to your name. High skulduggery, starts at The Orphanage with Matron Grelod.' },
  { id: 'Escaped Slave', label: 'Escaped Slave', desc: 'Branded and hunted. High trauma (40), zero gold. Inquisition faction hostile.' },
  { id: "Noble's Bastard", label: "Noble's Bastard", desc: 'Illegitimate heir. Starting gold (50), high allure but wanted by the noble house.' },
  { id: 'Wanderer', label: 'Wanderer', desc: 'Arrived from afar. No reputation, neutral factions. Balanced starting stats.' },
  { id: 'Former Acolyte', label: 'Former Acolyte', desc: 'Cast out from a cult. Arcane knowledge, high purity but psychological fragility.' },
  { id: 'Disgraced Guard', label: 'Disgraced Guard', desc: 'Stripped of rank. High athletics, justice system hostility. Starts with iron sword.' },
];

const GENDERS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'nonbinary', label: 'Non-Binary' },
];

const STEPS = ['Identity', 'Race', 'Birthsign', 'Origin', 'Confirm'];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ baseConfig, onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('Human');
  const [birthsign, setBirthsign] = useState('The Thief');
  const [origin, setOrigin] = useState('Orphan');

  const selectedRace = RACES.find(r => r.id === race)!;
  const selectedBirthsign = BIRTHSIGNS.find(b => b.id === birthsign)!;
  const selectedOrigin = ORIGINS.find(o => o.id === origin)!;

  const canNext = () => {
    if (step === 0) return name.trim().length >= 2;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) onBack();
    else setStep(s => s - 1);
  };

  const handleComplete = () => {
    onComplete({
      ...baseConfig,
      name: name.trim() || 'Vael',
      race,
      gender,
      birthsign,
      origin,
    });
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-serif">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(80,40,20,0.3)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto p-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i === step ? 'text-white' : i < step ? 'text-white/50' : 'text-white/20'}`}>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all ${
                  i === step ? 'border-white bg-white/10' : i < step ? 'border-white/40 bg-white/10' : 'border-white/20'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-[10px] tracking-widest uppercase hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-8 ${i < step ? 'bg-white/40' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0 — Identity */}
          {step === 0 && (
            <motion.div key="identity" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8">
              <div className="text-center">
                <User className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <h2 className="text-2xl tracking-widest uppercase text-white/90 mb-2">Who are you?</h2>
                <p className="text-white/40 text-sm tracking-wide">Give yourself a name. The world will remember it.</p>
              </div>
              <div>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && canNext() && handleNext()}
                  placeholder="Enter your name..."
                  maxLength={24}
                  className="w-full bg-black/60 border border-white/20 focus:border-white/50 p-4 text-center text-xl text-white tracking-widest focus:outline-none transition-colors"
                />
              </div>
              <div className="flex justify-center gap-4">
                {GENDERS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`px-6 py-2 border text-sm tracking-widest uppercase transition-all ${
                      gender === g.id ? 'border-white bg-white/10 text-white' : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/60'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Race */}
          {step === 1 && (
            <motion.div key="race" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center">
                <Globe className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <h2 className="text-2xl tracking-widest uppercase text-white/90 mb-2">Your Blood</h2>
                <p className="text-white/40 text-sm tracking-wide">Race shapes your body and how the world sees you.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto scrollbar-hide pr-1">
                {RACES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRace(r.id)}
                    className={`p-3 border text-left transition-all ${
                      race === r.id ? 'border-white/60 bg-white/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm tracking-widest uppercase text-white/80 mb-1">{r.label}</div>
                    <div className="text-[11px] text-white/40 leading-snug">{r.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Birthsign */}
          {step === 2 && (
            <motion.div key="birthsign" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center">
                <Star className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <h2 className="text-2xl tracking-widest uppercase text-white/90 mb-2">Your Stars</h2>
                <p className="text-white/40 text-sm tracking-wide">The constellation you were born under shapes your fate.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto scrollbar-hide pr-1">
                {BIRTHSIGNS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBirthsign(b.id)}
                    className={`p-3 border text-left transition-all ${
                      birthsign === b.id ? 'border-white/60 bg-white/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm tracking-widest uppercase text-white/80 mb-1">{b.label}</div>
                    <div className="text-[11px] text-white/40 leading-snug">{b.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Origin */}
          {step === 3 && (
            <motion.div key="origin" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <h2 className="text-2xl tracking-widest uppercase text-white/90 mb-2">Your Past</h2>
                <p className="text-white/40 text-sm tracking-wide">Where you come from determines where you start.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto scrollbar-hide pr-1">
                {ORIGINS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setOrigin(o.id)}
                    className={`p-3 border text-left transition-all ${
                      origin === o.id ? 'border-white/60 bg-white/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm tracking-widest uppercase text-white/80 mb-1">{o.label}</div>
                    <div className="text-[11px] text-white/40 leading-snug">{o.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Confirm */}
          {step === 4 && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <h2 className="text-2xl tracking-widest uppercase text-white/90 mb-2">Your Fate is Set</h2>
              </div>
              <div className="bg-black/50 border border-white/10 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <span className="text-white/30 tracking-widest uppercase text-[10px] block mb-1">Name</span>
                    <span className="text-white/90 tracking-wider">{name}</span>
                  </div>
                  <div>
                    <span className="text-white/30 tracking-widest uppercase text-[10px] block mb-1">Gender</span>
                    <span className="text-white/90 tracking-wider capitalize">{gender}</span>
                  </div>
                  <div>
                    <span className="text-white/30 tracking-widest uppercase text-[10px] block mb-1">Race</span>
                    <span className="text-white/90 tracking-wider">{selectedRace.label}</span>
                  </div>
                  <div>
                    <span className="text-white/30 tracking-widest uppercase text-[10px] block mb-1">Birthsign</span>
                    <span className="text-white/90 tracking-wider">{selectedBirthsign.label}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/30 tracking-widest uppercase text-[10px] block mb-1">Origin</span>
                    <span className="text-white/90 tracking-wider">{selectedOrigin.label}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <span className="text-white/30 tracking-widest uppercase text-[10px] block mb-2">Stat Bonuses</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedRace.statBonuses).map(([k, v]) => (
                      <span key={k} className={`text-[10px] px-2 py-0.5 border ${v > 0 ? 'border-green-500/30 text-green-400/80' : 'border-red-500/30 text-red-400/80'}`}>
                        {k} {v > 0 ? '+' : ''}{v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {baseConfig.ironman && (
                <div className="text-center text-xs text-red-400/70 tracking-widest uppercase">
                  ⚠ Ironman Mode — this character dies once
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white/50 hover:text-white hover:border-white/40 tracking-widest uppercase text-xs transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? 'Back' : 'Previous'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-2 px-8 py-3 border border-white/40 text-white/80 hover:text-white hover:border-white/70 hover:bg-white/5 tracking-widest uppercase text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-10 py-3 border border-white/60 bg-white/10 text-white hover:bg-white/20 tracking-widest uppercase text-xs transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Begin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
