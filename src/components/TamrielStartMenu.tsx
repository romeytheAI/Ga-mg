import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Save, Settings, Trash2, Cloud, Upload, Download, 
  Shield, Zap, Skull, Globe, Activity, Terminal, Image as ImageIcon,
  BookOpen, Trophy, BarChart2, MessageSquare, AlertTriangle, Check,
  ChevronRight, Sparkles, Moon, Sun, Star, Users, Sword, Heart
} from 'lucide-react';
import { getAllSaves, loadGame, deleteSave, SaveSlot } from '../utils/saveManager';
import { TAMRIEL_RACES, BIRTHSIGNS, generateTamrielCharacter, getTamrielRace } from '../data/tamriel';

interface TamrielStartMenuProps {
  onStartGame: (config: any) => void;
  onLoadGame: (saveData: any) => void;
}

type Step = 'warning' | 'cinematic' | 'main' | 'race' | 'birthsign' | 'origin' | 'gender' | 'load' | 'scenarios' | 'settings' | 'diagnostics';

export const TamrielStartMenu: React.FC<TamrielStartMenuProps> = ({ onStartGame, onLoadGame }) => {
  const [hordeStatus, setHordeStatus] = useState({ text: 'checking', image: 'checking', queue: 0 });
  const [currentStep, setCurrentStep] = useState<Step>('warning');
  
  // Character creation state
  const [selectedRace, setSelectedRace] = useState<string>('dunmer');
  const [selectedBirthsign, setSelectedBirthsign] = useState<string>('warrior');
  const [characterName, setCharacterName] = useState<string>('');
  const [characterGender, setCharacterGender] = useState<string>('female');
  
  // Saves state
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  
  // Game modes state
  const [ironmanMode, setIronmanMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [streamerMode, setStreamerMode] = useState(false);
  const [hardcoreEconomy, setHardcoreEconomy] = useState(false);
  const [crtScanlines, setCrtScanlines] = useState(false);
  
  // Diagnostics state
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Check Horde status
  useEffect(() => {
    const pingHorde = async () => {
      try {
        const res = await fetch('https://horde.koboldai.net/api/v2/status/performance');
        const data = await res.json();
        setHordeStatus({ text: 'online', image: 'online', queue: data.queued_requests || 0 });
      } catch (err) {
        setHordeStatus({ text: 'offline', image: 'offline', queue: 0 });
      }
    };
    pingHorde();
    const interval = setInterval(pingHorde, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load saves
  useEffect(() => {
    getAllSaves().then(loadedSaves => {
      setSaves(loadedSaves as SaveSlot[]);
    }).catch(e => console.error("Failed to load saves", e));
  }, []);

  // KeyboardShortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentStep === 'main' && e.key === 'F9') {
        const latestSave = saves.sort((a, b) => b.timestamp - a.timestamp)[0];
        if (latestSave) {
          handleLoadSave(latestSave.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, saves]);

  const initAudio = () => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
      
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(3, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      lfo.start();
    }
  };

  const playHoverSting = () => {
    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    setMousePos({ x, y });
  };

  const handleStartGame = () => {
    const race = getTamrielRace(selectedRace);
    const startingLocation = race.startingLocations[0];
    
    onStartGame({
      mode: 'standard',
      seed: Date.now().toString(),
      ironman: ironmanMode,
      sandbox: sandboxMode,
      streamer: streamerMode,
      hardcore: hardcoreEconomy,
      race: selectedRace,
      birthsign: selectedBirthsign,
      name: characterName || `Traveler`,
      gender: characterGender,
      startingLocation,
      offline: false,
      websockets: false
    });
  };

  const handleLoadSave = async (id: string) => {
    try {
      const state = await loadGame(id);
      onLoadGame(state);
    } catch (e) {
      console.error("Failed to load save:", e);
      alert("Save file is corrupted or missing.");
    }
  };

  const handleDeleteSave = async (id: string) => {
    try {
      await deleteSave(id);
      setSaves(saves.filter(s => s.id !== id));
    } catch (e) {
      console.error("Failed to delete save:", e);
    }
  };

  // Warning Screen
  if (currentStep === 'warning') {
    return (
      <div 
        className="flex flex-col items-center justify-center w-screen h-screen bg-black text-amber-100/80 font-serif cursor-pointer select-none"
        onClick={() => {
          setCurrentStep('cinematic');
          initAudio();
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,130,50,0.1)_0%,transparent_70%)] pointer-events-none" />
        <AlertTriangle className="w-16 h-16 text-amber-600 mb-6 animate-pulse" />
        <h1 className="text-3xl text-amber-600 mb-6 tracking-widest uppercase font-sans">Content Warning</h1>
        <p className="max-w-xl text-center leading-relaxed text-amber-100/60">
          This simulation contains dark fantasy themes, psychological trauma, and procedurally generated content within The Elder Scrolls universe. Set in Tamriel with NO playable human races. Discretion is advised.
        </p>
        <p className="max-w-xl text-center leading-relaxed text-amber-100/40 mt-4 text-sm">
          Photosensitivity Warning: This experience contains visual effects that may trigger seizures for those with photosensitive epilepsy.
        </p>
        <span className="mt-12 animate-pulse text-sm text-amber-100/30 tracking-[0.3em] uppercase font-sans">Press anywhere to awaken in Tamriel...</span>
      </div>
    );
  }

  // Cinematic Intro
  if (currentStep === 'cinematic') {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center w-screen h-screen bg-black text-amber-100/80 font-serif cursor-pointer select-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setCurrentStep('main')}
      >
        <motion.div 
          className="absolute inset-0 opacity-20"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8 }}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518709268485-52e1a8723d24?w=1920&q=80')",
            backgroundSize: 'cover',
            filter: 'sepia(0.5) hue-rotate(10deg)',
          }}
        />
        <motion.h1 
          className="relative z-10 text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 mb-4 tracking-[0.4em] uppercase font-sans"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          TAMRIEL
        </motion.h1>
        <motion.p 
          className="relative z-10 text-sm text-amber-400/60 tracking-[0.6em] uppercase font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
        >
          Chronicles of the Elder Scrolls
        </motion.p>
        <motion.p
          className="relative z-10 mt-8 text-xs text-amber-100/40 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 2 }}
        >
          No Human Races · Mer & Beast Folk Only
        </motion.p>
        <motion.span 
          className="absolute bottom-20 text-xs text-amber-100/20 tracking-[0.2em] uppercase font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 1 }}
        >
          Press anywhere to continue
        </motion.span>
      </motion.div>
    );
  }

  // Character Creation - Race Selection
  if (currentStep === 'race') {
    const races = Object.values(TAMRIEL_RACES);
    
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-amber-100/80 font-serif overflow-hidden" onMouseMove={handleMouseMove}>
        <div 
          className="absolute inset-0 opacity-10 scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500463959177-e083922511de?w=1920&q=80')",
            backgroundSize: 'cover',
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-70" />
        
        <div className="relative z-10 flex flex-col h-full max-w-6xl mx-auto p-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-amber-400 tracking-[0.2em] uppercase font-sans mb-2">Choose Your Race</h1>
            <p className="text-amber-100/50 text-sm tracking-widest font-sans">The peoples of Tamriel, neither Mannish nor Human</p>
          </motion.div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {races.map((race) => (
                <motion.button
                  key={race.id}
                  onClick={() => {
                    setSelectedRace(race.id);
                    playHoverSting();
                  }}
                  className={`p-4 border transition-all text-left ${
                    selectedRace === race.id 
                      ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                      : 'border-amber-100/10 bg-black/30 hover:border-amber-100/30 hover:bg-amber-500/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedRace === race.id ? 'bg-amber-400' : 'bg-amber-100/20'
                    }`} />
                    <span className="text-lg font-sans font-semibold text-amber-100">{race.displayName}</span>
                  </div>
                  <p className="text-xs text-amber-100/50 leading-relaxed mb-3">{race.description.substring(0, 120)}...</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(race.racialBonuses).slice(0, 3).map(([key, val]) => (
                      <span key={key} className="text-[10px] px-1.5 py-0.5 bg-emerald-950/50 border border-emerald-900/30 text-emerald-400 uppercase">
                        +{val} {key.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setCurrentStep('main')}
              className="flex-1 py-3 border border-amber-100/20 text-amber-100/60 hover:border-amber-100/40 hover:text-amber-100 transition-all tracking-widest uppercase text-sm font-sans"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep('birthsign')}
              className="flex-1 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-100 transition-all tracking-widest uppercase text-sm font-sans"
            >
              Continue — Birthsign
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Character Creation - Birthsign Selection
  if (currentStep === 'birthsign') {
    const signs = Object.values(BIRTHSIGNS);
    const constellations = ['warrior', 'mage', 'thief', 'serpent', 'lady', 'steed', 'lord', 'apprentice', 'atronach', 'shadow', 'tower', 'lover'];
    
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-amber-100/80 font-serif overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px, 150px 150px'
          }} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,50,0,0.1)_0%,transparent_60%)]" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col h-full max-w-5xl mx-auto p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-amber-400 tracking-[0.3em] uppercase font-sans mb-2">Your Birthsign</h1>
            <p className="text-amber-100/50 text-sm tracking-widest font-sans">The stars under which you were born shape your destiny</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {signs.map((sign) => (
                <motion.button
                  key={sign.id}
                  onClick={() => setSelectedBirthsign(sign.id)}
                  className={`p-4 border transition-all text-left ${
                    selectedBirthsign === sign.id 
                      ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'border-amber-100/10 bg-black/30 hover:border-amber-100/25'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className={`w-4 h-4 ${selectedBirthsign === sign.id ? 'text-amber-400' : 'text-amber-100/30'}`} />
                    <span className="font-sans font-semibold text-amber-100">The {sign.name}</span>
                  </div>
                  <p className="text-xs text-amber-100/50 mb-3">{sign.description.substring(0, 80)}...</p>
                  {sign.bonuses && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(sign.bonuses).map(([key, val]) => (
                        <span key={key} className="text-[10px] px-1.5 py-0.5 bg-blue-950/50 border border-blue-900/30 text-blue-400 uppercase">
                          +{val} {key}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setCurrentStep('gender')}
              className="flex-1 py-3 border border-amber-100/20 text-amber-100/60 hover:border-amber-100/40 hover:text-amber-100 transition-all tracking-widest uppercase text-sm font-sans"
            >
              Name
            </button>
            <button
              onClick={handleStartGame}
              className="flex-1 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-100 transition-all tracking-widest uppercase text-sm font-sans flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Begin in Tamriel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-screen h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden font-serif select-none ${crtScanlines ? 'crt-scanlines' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-15 scale-110"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500463959177-e083922511de?w=1920&q=80')",
          x: mousePos.x * -0.5,
          y: mousePos.y * -0.5,
          filter: 'sepia(0.3) hue-rotate(15deg)',
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
      
      {/* ember effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute w-0.5 h-0.5 bg-amber-400 rounded-full animate-rain"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `-${Math.random() * 20}%`,
              animationDuration: `${0.8 + Math.random() * 0.8}s`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl mx-auto p-8">
        
        {/* Title */}
        <div className="mb-12 text-center relative">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 mb-2 tracking-[0.25em] uppercase font-sans">
            TAMRIEL
          </h1>
          <p className="text-sm text-amber-100/50 tracking-[0.5em] uppercase font-sans">Chronicles of Vulnerability</p>
          <p className="text-xs text-amber-100/30 mt-2 tracking-widest font-sans">Elder Scrolls · Mer & Beast Folk Only</p>
        </div>

        <div className="flex w-full gap-6 h-[450px]">
          {/* Left Menu */}
          <div className="w-52 flex flex-col gap-2">
            <MenuButton 
              icon={<Play className="w-4 h-4" />} 
              label="Begin" 
              active={currentStep === 'main'} 
              onClick={() => setCurrentStep('main')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Users className="w-4 h-4" />} 
              label="Character" 
              active={(currentStep as string) === 'race'} 
              onClick={() => setCurrentStep('race')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Moon className="w-4 h-4" />} 
              label="Birthsign" 
              active={(currentStep as string) === 'birthsign'} 
              onClick={() => setCurrentStep('birthsign')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Save className="w-4 h-4" />} 
              label="Chronicles" 
              active={currentStep === 'load'} 
              onClick={() => setCurrentStep('load')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Globe className="w-4 h-4" />} 
              label="Fates" 
              active={currentStep === 'scenarios'} 
              onClick={() => setCurrentStep('scenarios')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Activity className="w-4 h-4" />} 
              label="Diagnostics" 
              active={currentStep === 'diagnostics'} 
              onClick={() => setCurrentStep('diagnostics')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Settings className="w-4 h-4" />} 
              label="Settings" 
              active={currentStep === 'settings'} 
              onClick={() => setCurrentStep('settings')} 
              onMouseEnter={playHoverSting}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-black/50 backdrop-blur-xl border border-amber-900/30 rounded-sm p-6 overflow-y-auto scrollbar-hide relative">
            <AnimatePresence mode="wait">
              
              {/* MAIN */}
              {currentStep === 'main' && (
                <motion.div 
                  key="main"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <h2 className="text-xl tracking-widest uppercase text-amber-100/80 border-b border-amber-900/30 pb-3 font-sans">Begin Your Journey</h2>
                  
                  {/* Quick Race Preview */}
                  <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-sans text-amber-100">{getTamrielRace(selectedRace).displayName}</span>
                      <span className="text-xs text-amber-100/40">of {getTamrielRace(selectedRace).startingLocations[0].replace(/_/g, ' ')}</span>
                    </div>
                    <p className="text-xs text-amber-100/50 leading-relaxed">
                      {getTamrielRace(selectedRace).description.substring(0, 150)}...
                    </p>
                  </div>

                  {saves.length > 0 && (
                    <button 
                      onClick={() => handleLoadSave(saves.sort((a, b) => b.timestamp - a.timestamp)[0].id)}
                      className="w-full p-3 bg-amber-900/10 hover:bg-amber-900/20 border border-amber-500/20 flex items-center justify-between group transition-all font-sans text-sm"
                    >
                      <span className="tracking-widest uppercase text-amber-100/80 group-hover:text-amber-100">Continue</span>
                      <span className="text-xs text-amber-100/40">Load Latest</span>
                    </button>
                  )}

                  <button 
                    onClick={handleStartGame}
                    className="w-full p-4 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 flex items-center justify-between group transition-all font-sans"
                  >
                    <span className="tracking-widest uppercase text-amber-100 group-hover:text-white">New Chronicle</span>
                    <ChevronRight className="w-4 h-4 text-amber-100/50 group-hover:text-amber-100" />
                  </button>

                  <div className="mt-6 space-y-3">
                    <h3 className="text-xs tracking-widest uppercase text-amber-100/40 font-sans">Modifiers</h3>
                    <Toggle label="Ironman Mode" description="Permadeath. Save deletes on death." checked={ironmanMode} onChange={setIronmanMode} />
                    <Toggle label="Sandbox Mode" description="God mode. No stat drains." checked={sandboxMode} onChange={setSandboxMode} />
                    <Toggle label="Hardcore Economy" description="Double prices, half starting wealth." checked={hardcoreEconomy} onChange={setHardcoreEconomy} />
                  </div>
                </motion.div>
              )}

              {/* LOAD */}
              {currentStep === 'load' && (
                <motion.div 
                  key="load"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
                    <h2 className="text-xl tracking-widest uppercase text-amber-100/80 font-sans">Chronicles</h2>
                    <div className="flex gap-2">
                      <button className="p-2 bg-amber-900/10 hover:bg-amber-900/20 border border-amber-500/20 text-amber-100/50 hover:text-amber-100 transition-colors" title="Import">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {saves.length === 0 ? (
                    <div className="text-center py-12 text-amber-100/40 tracking-widest uppercase text-sm font-sans">
                      No chronicles found in the void.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {saves.sort((a, b) => b.timestamp - a.timestamp).map(save => (
                        <div key={save.id} className="p-3 bg-amber-900/5 border border-amber-900/20 flex items-center justify-between group">
                          <div className="flex-1 cursor-pointer" onClick={() => handleLoadSave(save.id)}>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-amber-100 tracking-widest uppercase text-sm font-sans">{save.name}</span>
                              <span className="text-amber-100/40 text-xs font-sans">Day {save.day}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-amber-100/40">
                              <span>{save.location}</span>
                              <span className={save.trauma > 70 ? 'text-red-400/80' : ''}>Trauma: {save.trauma}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-2 hover:bg-red-900/30 text-amber-100/40 hover:text-red-400 transition-colors" 
                              title="Delete"
                              onMouseDown={(e) => {
                                const timer = setTimeout(() => handleDeleteSave(save.id), 2000);
                                e.currentTarget.onmouseup = () => clearTimeout(timer);
                                e.currentTarget.onmouseleave = () => clearTimeout(timer);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* SCENARIOS */}
              {currentStep === 'scenarios' && (
                <motion.div 
                  key="scenarios"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-xl tracking-widest uppercase text-amber-100/80 border-b border-amber-900/30 pb-3 font-sans">Fates & Scenarios</h2>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <ScenarioCard 
                      title="The Prisoner of Morrowind" 
                      desc="Begin as a prisoner arriving in Seyda Neen by ship. You have nothing but your release papers."
                      onClick={() => {
                        setSelectedRace('dunmer');
                        handleStartGame();
                      }}
                    />
                    <ScenarioCard 
                      title="The Ashlander Wanderer" 
                      desc="You are an outcast from Ashlander tribe, wandering the ash wastes of Vvardenfell."
                      onClick={() => {
                        setSelectedRace('dunmer');
                        handleStartGame();
                      }}
                    />
                    <ScenarioCard 
                      title="The Khajiit Caravan Guard" 
                      desc="Protect the Baandari caravans through Elsweyr. Moon sugar and danger await."
                      onClick={() => {
                        setSelectedRace('khajiit');
                        handleStartGame();
                      }}
                      highlight
                    />
                    <ScenarioCard 
                      title="The Argonian Escapee" 
                      desc="You have escaped from a Dunmer plantation in Morrowind. You are hunted."
                      onClick={() => {
                        setSelectedRace('argonian');
                        handleStartGame();
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* DIAGNOSTICS */}
              {currentStep === 'diagnostics' && (
                <motion.div 
                  key="diagnostics"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-xl tracking-widest uppercase text-amber-100/80 border-b border-amber-900/30 pb-3 font-sans">AI Horde Status</h2>
                  
                  <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-2 h-2 rounded-full ${hordeStatus.text === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400'} animate-pulse`} />
                      <span className="text-sm font-sans text-amber-100">Horde: {hordeStatus.text}</span>
                      <span className="text-xs text-amber-100/40">Queue: {hordeStatus.queue}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS */}
              {currentStep === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-xl tracking-widest uppercase text-amber-100/80 border-b border-amber-900/30 pb-3 font-sans">Settings</h2>
                  
                  <div className="space-y-3">
                    <Toggle label="CRT Scanlines" description="Retro display effect" checked={crtScanlines} onChange={setCrtScanlines} />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Menu Button Component
const MenuButton = ({ icon, label, active, onClick, onMouseEnter }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; onMouseEnter: () => void }) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`flex items-center gap-3 px-3 py-2.5 border transition-all font-sans tracking-widest uppercase text-xs ${
      active 
        ? 'border-amber-500/50 bg-amber-500/10 text-amber-100' 
        : 'border-transparent text-amber-100/40 hover:border-amber-100/20 hover:text-amber-100/80 hover:bg-amber-900/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Toggle Component
const Toggle = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (val: boolean) => void }) => (
  <div 
    className="flex items-center justify-between p-3 bg-amber-900/10 border border-amber-500/10 rounded-sm cursor-pointer hover:border-amber-500/20 transition-colors"
    onClick={() => onChange(!checked)}
  >
    <div>
      <div className="text-sm text-amber-100/80 font-sans">{label}</div>
      <div className="text-xs text-amber-100/40">{description}</div>
    </div>
    <div className={`w-8 h-4 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-amber-900/30'}`}>
      <div className={`w-4 h-4 rounded-full bg-amber-100 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </div>
);

// Scenario Card Component
const ScenarioCard = ({ title, desc, onClick, highlight }: { title: string; desc: string; onClick: () => void; highlight?: boolean }) => (
  <button
    onClick={onClick}
    className={`p-4 text-left border transition-all ${
      highlight 
        ? 'border-amber-500/40 bg-amber-600/10 hover:bg-amber-600/20' 
        : 'border-amber-900/20 bg-amber-900/5 hover:bg-amber-900/10'
    }`}
  >
    {highlight && (
      <div className="text-[10px] uppercase tracking-widest text-amber-400 mb-1 font-sans">Featured</div>
    )}
    <div className="text-sm font-sans text-amber-100 mb-1">{title}</div>
    <div className="text-xs text-amber-100/50">{desc}</div>
  </button>
);

export default TamrielStartMenu;