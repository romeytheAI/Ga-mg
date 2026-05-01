import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Sparkles, Wand2, Star, Save, ArrowRight, ArrowLeft,
  Info, Heart, Zap, Coffee, Users, Smile, Palette, Scissors, Eye, X,
  Activity, Scale, BookOpen, Castle
} from 'lucide-react';
import { GameState } from '../../types';
import { ELDER_SCROLLS_RACES, resolveRace } from '../../data/races';
import { CharacterSprite2D } from '../CharacterSprite2D';

interface CharacterCreationModalProps {
  onComplete: (config: any) => void;
  onCancel: () => void;
}

const STEP_TITLES = [
  "Core Identity",
  "Arcane Heritage",
  "Physical Manifestation",
  "Attribute Potentials",
  "Mortal Background",
  "Divine Destiny"
];

export const CharacterCreationModal: React.FC<CharacterCreationModalProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  
  // Character State
  const [name, setName] = useState("Vael");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [race, setRace] = useState("Imperial");
  const [birthsign, setBirthsign] = useState("The Thief");

  // Attribute State
  const [attrPoints, setAttrPoints] = useState(5);
  const [attributes, setAttributes] = useState<Record<string, number>>({
    strength: 5, perception: 5, endurance: 5, charisma: 5, intelligence: 5, agility: 5, luck: 5
  });
  
  // Background State
  const [socioeconomic, setSocioeconomic] = useState<any>("peasant");
  const [startCondition, setStartCondition] = useState<any>("standard");
  const [ageCategory, setAgeCategory] = useState<any>("young");
  
  // Cosmetics State
  const [skinTone, setSkinTone] = useState("fair");
  const [hairColor, setHairColor] = useState("brown");
  const [hairLength, setHairLength] = useState("shaggy");
  const [eyeColor, setEyeColor] = useState("blue");

  const raceDef = useMemo(() => resolveRace(race), [race]);

  // Derived state for preview
  const previewState = useMemo(() => ({
    player: {
      identity: { name, race, gender },
      cosmetics: { 
        skin_tone: skinTone, 
        hair_color: hairColor, 
        hair_length: hairLength, 
        eye_color: eyeColor,
        tattoos: [], piercings: [], scars: []
      },
      biology: { lactation_level: 0, incubations: [], parasites: [] },
      body_fluids: { arousal_wetness: 0, sweat: 0, milk: 0 },
      stats: { health: 100, corruption: 0, purity: 100, arousal: 0 },
      life_sim: { needs: { hygiene: 100, energy: 100, hunger: 100, thirst: 100 } },
      afflictions: [],
      clothing: {
        chest: { id: 'preview-rags', name: 'Rags', type: 'clothing', slot: 'chest', is_equipped: true, integrity: 100, max_integrity: 100 }
      },
      clothing_damage: [],
      anatomy: { organs: {}, bones_integrity: {}, body_parts: {} },
      restraints: { entries: [] }
    },
    ui: {
      graphics_quality: {
        sprite_quality: {
          gradient_shading: true,
          cosmetic_details: true,
          muscle_detail_level: 1,
          fluid_effects: true,
          xray_overlay: false
        }
      },
      currentLog: [],
      combat_animation: '',
      targeted_part: 'none'
    },
    world: {
      active_encounter: null,
      last_intent: 'idle',
      weather: 'Clear'
    }
  } as any), [name, race, gender, skinTone, hairColor, hairLength, eyeColor]);

  const renderIdentity = () => (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Designation</label>
        <div className="relative group">
           <div className="absolute inset-0 bg-sky-500/5 blur-xl group-focus-within:bg-sky-500/10 transition-colors" />
           <input 
             type="text" 
             value={name} 
             onChange={e => setName(e.target.value)}
             className="w-full bg-black/60 border border-white/10 p-5 rounded-sm text-white focus:outline-none focus:border-sky-500/50 transition-all font-serif text-2xl tracking-widest relative z-10"
             placeholder="ENTER NAME..."
           />
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Sexual Dimorphism</label>
        <div className="grid grid-cols-2 gap-4">
          {['female', 'male'].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g as any)}
              className={`aaa-button p-6 border transition-all rounded-sm flex flex-col items-center gap-2 ${gender === g ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-white/5 bg-white/[0.02] text-white/20 hover:border-white/10'}`}
            >
              <User className={`w-6 h-6 ${gender === g ? 'text-sky-400' : 'text-white/10'}`} />
              <span className="text-[10px] tracking-[0.3em] uppercase font-black">{g}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHeritage = () => (
    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide">
      <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black mb-4 block">Ancestral Root</label>
      <div className="grid grid-cols-1 gap-3">
        {Object.values(ELDER_SCROLLS_RACES).map((r) => (
          <button
            key={r.name}
            onClick={() => setRace(r.name)}
            className={`p-6 border transition-all duration-500 rounded-sm text-left relative overflow-hidden group ${race === r.name ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_30px_rgba(14,165,233,0.1)]' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
          >
            {race === r.name && <motion.div layoutId="race-active" className="absolute inset-0 bg-sky-500/5 pointer-events-none" />}
            <div className="flex justify-between items-center relative z-10">
              <div>
                <span className={`text-sm font-serif tracking-[0.1em] uppercase ${race === r.name ? 'text-sky-300' : 'text-white/50 group-hover:text-white/80'}`}>{r.name}</span>
                <p className="text-[9px] text-white/20 mt-1 uppercase tracking-widest font-bold italic">{r.lore_tag}</p>
              </div>
              <div className="flex gap-2">
                 {Object.entries(r.racial_bonuses).map(([stat, val]) => (
                   <div key={stat} className="flex flex-col items-end">
                      <span className="text-[7px] text-white/20 uppercase font-black">{stat}</span>
                      <span className="text-[9px] text-emerald-400/80 font-mono">+{val}</span>
                   </div>
                 ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderVisuals = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Epidermal Tone</label>
          <div className="grid grid-cols-5 gap-3">
            {raceDef.skin_colors.map(color => (
              <button 
                key={color}
                onClick={() => setSkinTone(color)}
                style={{ backgroundColor: color }}
                className={`w-10 h-10 rounded-sm border-2 transition-all ${skinTone === color ? 'border-sky-400 scale-110 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                aria-label={`Select skin tone ${color}`}
                title={`Select skin tone ${color}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Ocular Chroma</label>
          <div className="grid grid-cols-5 gap-3">
            {raceDef.eye_colors.map(color => (
              <button 
                key={color}
                onClick={() => setEyeColor(color)}
                style={{ backgroundColor: color }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${eyeColor === color ? 'border-sky-400 scale-110 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                aria-label={`Select eye color ${color}`}
                title={`Select eye color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Follicle Projection</label>
        {raceDef.hair_colors && (
          <div className="flex flex-wrap gap-3 mb-6">
            {raceDef.hair_colors.map(color => (
              <button 
                key={color}
                onClick={() => setHairColor(color)}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-sm border-2 transition-all ${hairColor === color ? 'border-sky-400 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                aria-label={`Select hair color ${color}`}
                title={`Select hair color ${color}`}
              />
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {['short', 'shaggy', 'long'].map(len => (
            <button
              key={len}
              onClick={() => setHairLength(len)}
              className={`py-3 border transition-all rounded-sm text-[9px] tracking-[0.3em] uppercase font-black ${hairLength === len ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-white/5 bg-white/[0.01] text-white/30 hover:border-white/10'}`}
            >
              {len}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttributes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 p-4 aaa-panel bg-sky-500/[0.02] border-sky-500/20">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/60 font-black">Neural Flux Reserve</label>
        <div className="px-4 py-2 bg-sky-500/20 border border-sky-500/40 rounded-sm text-[11px] text-sky-300 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(14,165,233,0.2)]">
          {attrPoints} POTENTIALS REMAINING
        </div>
      </div>
      <div className="space-y-3 pr-2 overflow-y-auto max-h-[400px] scrollbar-hide">
        {Object.entries(attributes).map(([attr, val]) => (
          <div key={attr} className="p-5 bg-white/[0.01] border border-white/5 rounded-sm flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex-1">
              <div className="text-xs font-serif tracking-[0.2em] uppercase text-white/80 group-hover:text-sky-300 transition-colors">{attr}</div>
              <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] mt-1 font-bold">
                {attr === 'strength' && 'Kinetic Force & Capacity'}
                {attr === 'perception' && 'Ocular Fidelity & Discovery'}
                {attr === 'endurance' && 'Biological Resilience'}
                {attr === 'charisma' && 'Social Signal Projection'}
                {attr === 'intelligence' && 'Computational Depth'}
                {attr === 'agility' && 'Motor Reflex Fidelity'}
                {attr === 'luck' && 'Probability Manipulation'}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button 
                aria-label={`Decrease ${attr}`}
                onClick={() => { if(val > 1) { setAttributes({...attributes, [attr]: val - 1}); setAttrPoints(p => p + 1); }}}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/40 transition-all text-xl"
              >-</button>
              <span className="text-2xl font-mono text-sky-400 w-8 text-center font-black">{val}</span>
              <button 
                aria-label={`Increase ${attr}`}
                onClick={() => { if(attrPoints > 0 && val < 10) { setAttributes({...attributes, [attr]: val + 1}); setAttrPoints(p => p - 1); }}}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/40 transition-all text-xl"
              >+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBackground = () => (
    <div className="space-y-8 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide">
      <div className="space-y-4">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Socioeconomic Vector</label>
        <div className="grid grid-cols-3 gap-3">
          {['destitute', 'peasant', 'merchant', 'noble', 'outcast'].map((s) => (
            <button
              key={s}
              onClick={() => setSocioeconomic(s)}
              className={`p-4 border transition-all rounded-sm text-[9px] tracking-[0.3em] uppercase font-black ${socioeconomic === s ? 'border-sky-500 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'border-white/5 bg-white/[0.01] text-white/30 hover:border-white/10'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Developmental Stage</label>
        <div className="grid grid-cols-4 gap-3">
          {['young', 'adult', 'middle_aged', 'elder'].map((a) => (
            <button
              key={a}
              onClick={() => setAgeCategory(a)}
              className={`p-4 border transition-all rounded-sm text-[9px] tracking-[0.3em] uppercase font-black ${ageCategory === a ? 'border-sky-500 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'border-white/5 bg-white/[0.01] text-white/30 hover:border-white/10'}`}
            >
              {a.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-black">Anomalous Parameters</label>
        <div className="space-y-3">
          {[
            { id: 'standard', name: 'Baseline Iteration', desc: 'A typical emergence within the Rift state.', icon: <Activity className="w-4 h-4" /> },
            { id: 'experiment', name: 'Synthetic Emergence', desc: 'Synthesized within a pocket-realm laboratory.', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'possessed_locket', name: 'Mantle Inheritance', desc: 'A legacy consciousness overriding the physical vessel.', icon: <Shield className="w-4 h-4" /> }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setStartCondition(c.id)}
              className={`w-full p-6 border transition-all duration-500 rounded-sm text-left flex items-start gap-5 ${startCondition === c.id ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'border-white/5 bg-white/[0.01] hover:border-white/10 group'}`}
            >
              <div className={`mt-1 ${startCondition === c.id ? 'text-purple-400' : 'text-white/10 group-hover:text-white/30'}`}>{c.icon}</div>
              <div>
                <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-1">{c.name}</div>
                <p className="text-[9px] text-white/30 italic uppercase tracking-wider">{c.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDestiny = () => (
    <div className="space-y-8">
      <div className="p-8 aaa-panel bg-sky-500/[0.02] border-sky-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 scale-150"><Sparkles className="w-12 h-12" /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-6 h-6 text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
            <h4 className="text-sm font-black tracking-[0.4em] uppercase text-sky-200">Cosmic Imprint: {birthsign}</h4>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed italic font-serif">
            "The Thief is the sign of those who take what they want. They are not always criminals, but they are always driven. Their path is paved with probability and shadows."
          </p>
        </div>
      </div>
      <div className="space-y-4 text-center py-8 border-y border-white/5">
        <p className="text-[10px] tracking-[0.6em] uppercase text-white/20 mb-2 font-black">Vector Conclusion</p>
        <h2 className="text-4xl font-serif text-white/90 tracking-tighter uppercase">{name}</h2>
        <p className="text-xs text-sky-400/80 tracking-[0.5em] uppercase font-bold">{gender} {race} · {birthsign}</p>
      </div>
      <div className="text-center space-y-2 opacity-40">
        <p className="text-[9px] text-white tracking-[0.3em] uppercase leading-loose">
          Deployment Zone: Riften State Orphanage<br />
          Initialization Sequence Ready.
        </p>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-12 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-20%] -left-[10%] w-[60%] h-[60%] bg-sky-500/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ scale: 0.98, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-[#030303] border border-white/10 rounded-sm w-full max-w-6xl flex flex-col lg:flex-row relative shadow-[0_0_150px_rgba(0,0,0,1)] z-10 overflow-hidden min-h-[750px]"
      >
        <div className="lg:w-[40%] bg-black/60 border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-hidden group/vessel">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent)] opacity-60 group-hover/vessel:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full aspect-[2/3] flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <CharacterSprite2D state={previewState} />
          </div>
          <div className="mt-12 text-center relative z-10">
            <h3 className="text-[10px] tracking-[0.6em] uppercase text-white/30 font-black mb-3">Vessel Stabilization</h3>
            <div className="w-16 h-[2px] bg-sky-500/40 mx-auto rounded-full" />
          </div>
        </div>

        <div className="lg:w-[60%] flex flex-col p-10 lg:p-16 bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.01),transparent)]">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-serif text-white/95 tracking-[0.1em] uppercase">Vessel Synthesis</h2>
              <span className="text-[10px] text-sky-400/80 tracking-[0.5em] uppercase block mt-3 font-black">Step 0{step + 1} // {STEP_TITLES[step]}</span>
            </div>
            <button aria-label="Cancel Character Creation" onClick={onCancel} className="w-12 h-12 flex items-center justify-center rounded-sm bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all border border-white/5"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {step === 0 && renderIdentity()}
                {step === 1 && renderHeritage()}
                {step === 2 && renderVisuals()}
                {step === 3 && renderAttributes()}
                {step === 4 && renderBackground()}
                {step === 5 && renderDestiny()}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-10 h-1.5 transition-all duration-700 rounded-full ${step >= i ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-white/5'}`} />
              ))}
            </div>
            <div className="flex gap-5">
              {step > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(s => s - 1)}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/40 text-[10px] tracking-[0.4em] uppercase transition-all rounded-sm flex items-center gap-3 font-black border border-white/5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05, x: 5, backgroundColor: "rgba(14, 165, 233, 0.25)" }} whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (step < 5) setStep(s => s + 1);
                  else onComplete({ 
                    name, race, gender, birthsign, attributes,
                    origin_config: { socioeconomic, start_condition: startCondition, starting_age_category: ageCategory },
                    cosmetics: { skin_tone: skinTone, hair_color: hairColor, hair_length: hairLength, eye_color: eyeColor } 
                  });
                }}
                className="px-12 py-4 bg-sky-900/60 border border-sky-500/40 text-sky-200 text-[10px] tracking-[0.4em] uppercase transition-all rounded-sm flex items-center gap-4 font-black shadow-[0_0_30px_rgba(14,165,233,0.2)]"
              >
                {step < 5 ? "Iterate Synthesis" : "Initialize Vessel"} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
