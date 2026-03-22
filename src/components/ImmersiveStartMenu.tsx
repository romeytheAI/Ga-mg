import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Save, Settings, Trash2, Cloud, Upload, Download, 
  Shield, Zap, Skull, Globe, Activity, Terminal, Image as ImageIcon,
  BookOpen, Trophy, BarChart2, MessageSquare, AlertTriangle, Check
} from 'lucide-react';
import { getAllSaves, loadGame, deleteSave, SaveSlot } from '../utils/saveManager';
import { CharacterCreation } from './CharacterCreation';

interface ImmersiveStartMenuProps {
  onStartGame: (config: any) => void;
  onLoadGame: (saveData: any) => void;
}

export const ImmersiveStartMenu: React.FC<ImmersiveStartMenuProps> = ({ onStartGame, onLoadGame }) => {
  const [hordeStatus, setHordeStatus] = useState({ text: 'checking', image: 'checking', queue: 0 });
  const [activeView, setActiveView] = useState('main'); // main, load, scenarios, extras, settings, diagnostics
  const [showWarning, setShowWarning] = useState(true);
  const [showCinematic, setShowCinematic] = useState(false);
  
  // Mouse parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Saves state
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [seedString, setSeedString] = useState('');
  
  // Game Modes state
  const [ironmanMode, setIronmanMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [streamerMode, setStreamerMode] = useState(false);
  const [hardcoreEconomy, setHardcoreEconomy] = useState(false);
  const [offlineFallback, setOfflineFallback] = useState(false);
  const [useWebSockets, setUseWebSockets] = useState(false);
  const [crtScanlines, setCrtScanlines] = useState(false);

  // Diagnostics state
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxResponse, setSandboxResponse] = useState('');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [pendingStartConfig, setPendingStartConfig] = useState<any>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Feature 16-18: Horde Diagnostics Check
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

  // Feature 4: Quick Load Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9' && !showWarning && !showCinematic && activeView === 'main') {
        const latestSave = saves.sort((a, b) => b.timestamp - a.timestamp)[0];
        if (latestSave) {
          handleLoadSave(latestSave.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWarning, showCinematic, activeView, saves]);

  // Load saves from IndexedDB on mount
  useEffect(() => {
    getAllSaves().then(loadedSaves => {
      setSaves(loadedSaves as SaveSlot[]);
    }).catch(e => console.error("Failed to load saves", e));
  }, []);

  // Feature 26: Procedural Ambient Boot Audio & Feature 29: Hover Audio Stings
  const initAudio = () => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      
      // Ambient drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 5);
      
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(5, ctx.currentTime);
      
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
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleStartGame = (mode: string, scenario?: string) => {
    const config = {
      mode,
      scenario,
      seed: seedString || Date.now().toString(),
      ironman: ironmanMode,
      sandbox: sandboxMode,
      streamer: streamerMode,
      hardcore: hardcoreEconomy,
      offline: offlineFallback,
      websockets: useWebSockets
    };
    setPendingStartConfig(config);
    setShowCharacterCreation(true);
  };

  const finalizeStartGame = (characterData: any) => {
    onStartGame({
      ...pendingStartConfig,
      player: characterData
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

  const testApiKey = async () => {
    if (!apiKey) return;
    try {
      const res = await fetch('https://horde.koboldai.net/api/v2/find_user', {
        headers: { 'apikey': apiKey }
      });
      if (res.ok) {
        setApiKeyValid(true);
      } else {
        setApiKeyValid(false);
      }
    } catch (e) {
      setApiKeyValid(false);
    }
  };

  const testSandboxPrompt = async () => {
    if (!sandboxPrompt) return;
    setIsTestingPrompt(true);
    try {
      // Mocking a quick response for the sandbox tester
      setTimeout(() => {
        setSandboxResponse("The shadows lengthen as your words echo in the void...");
        setIsTestingPrompt(false);
      }, 1500);
    } catch (e) {
      setSandboxResponse("Error reaching the Weaver.");
      setIsTestingPrompt(false);
    }
  };

  // Feature 30: Boot Sequence Warning Screen
  if (showWarning) {
    return (
      <div 
        className="flex flex-col items-center justify-center w-screen h-screen bg-black text-gray-300 font-serif cursor-pointer select-none" 
        onClick={() => {
          setShowWarning(false);
          setShowCinematic(true);
          initAudio();
        }}
      >
        <AlertTriangle className="w-16 h-16 text-red-800 mb-6 animate-pulse" />
        <h1 className="text-3xl text-red-800 mb-6 tracking-widest uppercase">Content Warning</h1>
        <p className="max-w-xl text-center leading-relaxed text-white/60">
          This simulation contains dark fantasy themes, psychological trauma, and explicit text generation powered by AI. Discretion is advised.
        </p>
        <p className="max-w-xl text-center leading-relaxed text-white/40 mt-4 text-sm">
          Photosensitivity Warning: This experience contains flashing lights and visual patterns that may trigger seizures for people with photosensitive epilepsy.
        </p>
        <span className="mt-12 animate-pulse text-sm text-white/30 tracking-[0.2em] uppercase">Press anywhere to awaken...</span>
      </div>
    );
  }

  // Feature 31: "Press Any Key" Cinematic Intro
  if (showCinematic) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center w-screen h-screen bg-black text-gray-300 font-serif cursor-pointer select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowCinematic(false)}
      >
        <motion.h1 
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-600 mb-4 tracking-[0.3em] uppercase"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          Project Aetherius
        </motion.h1>
        <motion.p 
          className="text-sm text-white/40 tracking-[0.5em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 2 }}
        >
          Chronicles of Vulnerability
        </motion.p>
        <motion.span 
          className="absolute bottom-20 animate-pulse text-xs text-white/20 tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 1 }}
        >
          Press any key
        </motion.span>
      </motion.div>
    );
  }

  if (showCharacterCreation) {
    return (
      <CharacterCreation 
        onComplete={(data) => {
          finalizeStartGame(data);
        }}
        onCancel={() => {
          setShowCharacterCreation(false);
          setPendingStartConfig(null);
        }}
      />
    );
  }
  const latestSaveTrauma = saves.length > 0 ? Math.max(...saves.map(s => s.trauma || 0)) : 0;
  const isTitleDecayed = latestSaveTrauma > 80;

  return (
    <div 
      className={`relative w-screen h-screen bg-black overflow-hidden font-serif select-none ${crtScanlines ? 'crt-scanlines' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Feature 24, 27: Parallax Background & Particles */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-110"
        style={{ 
          backgroundImage: "url('https://picsum.photos/seed/darkfantasy/1920/1080?blur=2')",
          x: mousePos.x * -1,
          y: mousePos.y * -1
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
      
      {/* Rain/Ember CSS Overlays (Simplified representation) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-white/50 rounded-full animate-rain"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `-${Math.random() * 20}%`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Feature 28: Glassmorphism Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl mx-auto p-8">
        
        {/* Feature 25: Dynamic Title Logo Decay */}
        <div className="mb-16 text-center relative">
          <h1 className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 tracking-[0.2em] uppercase ${isTitleDecayed ? 'animate-glitch' : ''}`}>
            Project Aetherius
          </h1>
          <p className="text-sm text-white/60 tracking-[0.4em] uppercase">Chronicles of Vulnerability</p>
          {isTitleDecayed && (
            <div className="absolute inset-0 text-6xl font-bold text-red-500/30 tracking-[0.2em] uppercase animate-glitch-2 mix-blend-screen pointer-events-none">
              Project Aetherius
            </div>
          )}
        </div>

        <div className="flex w-full gap-8 h-[400px]">
          {/* Left Menu Column */}
          <div className="w-64 flex flex-col gap-3">
            <MenuButton 
              icon={<Play className="w-4 h-4" />} 
              label="Awaken" 
              active={activeView === 'main'} 
              onClick={() => setActiveView('main')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Save className="w-4 h-4" />} 
              label="Chronicles" 
              active={activeView === 'load'} 
              onClick={() => setActiveView('load')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Globe className="w-4 h-4" />} 
              label="Fates" 
              active={activeView === 'scenarios'} 
              onClick={() => setActiveView('scenarios')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Activity className="w-4 h-4" />} 
              label="Diagnostics" 
              active={activeView === 'diagnostics'} 
              onClick={() => setActiveView('diagnostics')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Settings className="w-4 h-4" />} 
              label="Settings" 
              active={activeView === 'settings'} 
              onClick={() => setActiveView('settings')} 
              onMouseEnter={playHoverSting}
            />
            <MenuButton 
              icon={<Trophy className="w-4 h-4" />} 
              label="Extras" 
              active={activeView === 'extras'} 
              onClick={() => setActiveView('extras')} 
              onMouseEnter={playHoverSting}
            />
          </div>

          {/* Right Content Area (Glassmorphism) */}
          <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm p-8 overflow-y-auto scrollbar-hide relative">
            <AnimatePresence mode="wait">
              
              {/* MAIN VIEW */}
              {activeView === 'main' && (
                <motion.div 
                  key="main"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-xl tracking-widest uppercase text-white/80 border-b border-white/10 pb-4">The Awakening</h2>
                  
                  {saves.length > 0 && (
                    <button 
                      onClick={() => handleLoadSave(saves.sort((a, b) => b.timestamp - a.timestamp)[0].id)}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between group transition-all"
                    >
                      <span className="tracking-widest uppercase text-sm text-white/80 group-hover:text-white">Continue Journey</span>
                      <span className="text-xs text-white/40">Load latest save</span>
                    </button>
                  )}

                  <button 
                    onClick={() => handleStartGame('standard')}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between group transition-all"
                  >
                    <span className="tracking-widest uppercase text-sm text-white/80 group-hover:text-white">New Journey</span>
                    <span className="text-xs text-white/40">Standard Mode</span>
                  </button>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-xs tracking-widest uppercase text-white/40">Modifiers</h3>
                    <Toggle label="Ironman Mode" description="Permadeath. Save deletes on death." checked={ironmanMode} onChange={setIronmanMode} />
                    <Toggle label="Sandbox Mode" description="God mode. No stat drains." checked={sandboxMode} onChange={setSandboxMode} />
                    <Toggle label="Hardcore Economy" description="Double prices, half starting wealth." checked={hardcoreEconomy} onChange={setHardcoreEconomy} />
                  </div>

                  <div className="mt-4">
                    <label className="text-xs tracking-widest uppercase text-white/40 block mb-2">World Seed (Optional)</label>
                    <input 
                      type="text" 
                      value={seedString}
                      onChange={(e) => setSeedString(e.target.value)}
                      placeholder="Leave blank for random..."
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white/80 focus:outline-none focus:border-white/30 font-sans"
                    />
                  </div>
                </motion.div>
              )}

              {/* LOAD VIEW */}
              {activeView === 'load' && (
                <motion.div 
                  key="load"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl tracking-widest uppercase text-white/80">Chronicles</h2>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors" title="Cloud Sync">
                        <Cloud className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors" title="Import Base64">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {saves.length === 0 ? (
                    <div className="text-center py-12 text-white/40 tracking-widest uppercase text-sm">
                      No chronicles found in the void.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {saves.sort((a, b) => b.timestamp - a.timestamp).map(save => (
                        <div key={save.id} className="p-4 bg-white/5 border border-white/10 flex items-center justify-between group">
                          <div className="flex-1 cursor-pointer" onClick={() => handleLoadSave(save.id)}>
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-white/80 tracking-widest uppercase text-sm">{save.name}</span>
                              <span className="text-white/40 text-xs">Level {save.level}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                              <span>{save.location}</span>
                              <span>Day {save.day}</span>
                              <span className={save.trauma > 70 ? 'text-red-400/80' : ''}>Trauma: {save.trauma}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Export Base64">
                              <Upload className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 hover:bg-red-900/50 text-white/40 hover:text-red-400 transition-colors" 
                              title="Delete Save (Hold)"
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

              {/* SCENARIOS VIEW */}
              {activeView === 'scenarios' && (
                <motion.div 
                  key="scenarios"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-xl tracking-widest uppercase text-white/80 border-b border-white/10 pb-4">Fates & Scenarios</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <ScenarioCard 
                      title="The Escaped Slave" 
                      desc="Start with nothing but rags and high trauma. Hunted by the Inquisition."
                      onClick={() => handleStartGame('scenario', 'escaped_slave')}
                    />
                    <ScenarioCard 
                      title="The Noble's Fall" 
                      desc="Start with immense wealth but a bounty on your head and zero survival skills."
                      onClick={() => handleStartGame('scenario', 'nobles_fall')}
                    />
                    <ScenarioCard 
                      title="Daily Challenge Run" 
                      desc="A fixed seed that resets every 24 hours. Compete globally."
                      onClick={() => handleStartGame('daily')}
                      highlight
                    />
                  </div>
                </motion.div>
              )}

              {/* DIAGNOSTICS VIEW */}
              {activeView === 'diagnostics' && (
                <motion.div 
                  key="diagnostics"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-xl tracking-widest uppercase text-white/80 border-b border-white/10 pb-4">Horde Diagnostics</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 border border-white/10">
                      <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">API Configuration</h3>
                      <div className="flex gap-2 mb-2">
                        <input 
                          type="password" 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="KoboldAI / Horde API Key"
                          className="flex-1 bg-black/50 border border-white/10 p-2 text-sm text-white/80 focus:outline-none focus:border-white/30 font-sans"
                        />
                        <button 
                          onClick={testApiKey}
                          className="px-4 bg-white/10 hover:bg-white/20 text-sm tracking-widest uppercase transition-colors"
                        >
                          Validate
                        </button>
                      </div>
                      {apiKeyValid === true && <p className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Key Valid & Unbanned</p>}
                      {apiKeyValid === false && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Invalid or Banned Key</p>}
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10">
                      <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Model Sandbox Tester</h3>
                      <textarea 
                        value={sandboxPrompt}
                        onChange={(e) => setSandboxPrompt(e.target.value)}
                        placeholder="Enter a test prompt..."
                        className="w-full h-20 bg-black/50 border border-white/10 p-2 text-sm text-white/80 focus:outline-none focus:border-white/30 font-sans mb-2 resize-none"
                      />
                      <button 
                        onClick={testSandboxPrompt}
                        disabled={isTestingPrompt || !sandboxPrompt}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
                      >
                        {isTestingPrompt ? 'Testing...' : 'Test Prompt'}
                      </button>
                      {sandboxResponse && (
                        <div className="mt-4 p-3 bg-black/50 border border-white/5 text-sm text-white/60 italic">
                          {sandboxResponse}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Toggle label="Offline Fallback" description="Bypass Horde, use local arrays." checked={offlineFallback} onChange={setOfflineFallback} />
                      <Toggle label="WebSocket Mode" description="Use WS instead of polling for Horde." checked={useWebSockets} onChange={setUseWebSockets} />
                    </div>

                    <a href="https://stablehorde.net/" target="_blank" rel="noreferrer" className="block w-full p-3 border border-primary-gold/30 text-primary-gold/80 hover:bg-primary-gold/10 text-center text-xs tracking-widest uppercase transition-colors mt-4">
                      Run a Worker. Earn Kudos.
                    </a>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS VIEW */}
              {activeView === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-xl tracking-widest uppercase text-white/80 border-b border-white/10 pb-4">Neural Link Settings</h2>
                  
                  <div className="space-y-4">
                    <Toggle label="Streamer Mode" description="Masks sensitive images and forces fade-to-black." checked={streamerMode} onChange={setStreamerMode} />
                    <Toggle label="CRT Scanlines" description="Retro visual filter for the main menu and game." checked={crtScanlines} onChange={setCrtScanlines} />
                    <Toggle label="Developer Console" description="Enables an in-game ~ terminal for debugging state." checked={false} onChange={() => {}} />
                  </div>
                </motion.div>
              )}

              {/* EXTRAS VIEW */}
              {activeView === 'extras' && (
                <motion.div 
                  key="extras"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-xl tracking-widest uppercase text-white/80 border-b border-white/10 pb-4">Meta-Progression</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-3 transition-colors group">
                      <ImageIcon className="w-8 h-8 text-white/40 group-hover:text-white/80 transition-colors" />
                      <span className="text-xs tracking-widest uppercase text-white/60">Gallery</span>
                    </button>
                    <button className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-3 transition-colors group">
                      <BookOpen className="w-8 h-8 text-white/40 group-hover:text-white/80 transition-colors" />
                      <span className="text-xs tracking-widest uppercase text-white/60">Compendium</span>
                    </button>
                    <button className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-3 transition-colors group">
                      <Trophy className="w-8 h-8 text-white/40 group-hover:text-white/80 transition-colors" />
                      <span className="text-xs tracking-widest uppercase text-white/60">Achievements</span>
                    </button>
                    <button className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-3 transition-colors group">
                      <BarChart2 className="w-8 h-8 text-white/40 group-hover:text-white/80 transition-colors" />
                      <span className="text-xs tracking-widest uppercase text-white/60">Statistics</span>
                    </button>
                  </div>

                  <div className="mt-4 p-4 border border-white/10 bg-black/50">
                    <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4 flex items-center gap-2"><Terminal className="w-4 h-4"/> Mod Manager</h3>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs tracking-widest uppercase text-white/60 transition-colors">
                      Inject Custom JSON
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Feature 16: Live Status Indicator Footer */}
        <div className="absolute bottom-8 left-8 flex items-center gap-4 text-xs text-white/40 font-sans tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${hordeStatus.text === 'online' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`}></span>
            Horde Network: {hordeStatus.text}
          </div>
          <span className="opacity-50">|</span>
          <div>Queue: {hordeStatus.queue}</div>
        </div>

        {/* Feature 39: Discord/Community Links */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <a href="#" className="text-white/40 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
        </div>

      </div>
    </div>
  );
};

// Sub-components
const MenuButton = ({ icon, label, active, onClick, onMouseEnter }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, onMouseEnter: () => void }) => (
  <button 
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`flex items-center gap-3 px-6 py-4 border transition-all duration-300 tracking-widest uppercase text-sm
      ${active 
        ? 'border-white/40 bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]' 
        : 'border-white/5 bg-black/60 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5'
      }`}
  >
    {icon}
    {label}
  </button>
);

const Toggle = ({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => onChange(!checked)}>
    <div>
      <div className="text-sm text-white/80 tracking-widest uppercase">{label}</div>
      <div className="text-xs text-white/40 mt-1">{description}</div>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-white/40' : 'bg-black/60 border border-white/20'}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

const ScenarioCard = ({ title, desc, onClick, highlight = false }: { title: string, desc: string, onClick: () => void, highlight?: boolean }) => (
  <button 
    onClick={onClick}
    className={`p-4 border text-left transition-all group
      ${highlight 
        ? 'border-primary-gold/30 bg-primary-gold/5 hover:bg-primary-gold/10' 
        : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
  >
    <div className={`text-sm tracking-widest uppercase mb-2 ${highlight ? 'text-primary-gold' : 'text-white/80 group-hover:text-white'}`}>
      {title}
    </div>
    <div className="text-xs text-white/40 leading-relaxed">
      {desc}
    </div>
  </button>
);
