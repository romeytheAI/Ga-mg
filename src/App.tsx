import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Wind, Moon, Settings, X, BookOpen, User, Map as MapIcon, 
  Shield, Sword, Zap, Droplets, AlertTriangle, Ghost, Sparkles, 
  Layers, ShoppingBag, Eye, EyeOff, Thermometer, Clock, Calendar, RefreshCw, Book,
  Cloud, Sun, Snowflake, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Flame,
  Coins, Shirt, Users, Star, Activity, Castle, Award
} from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SemanticText } from './components/TextComponents';
import { GameState, Item, StatKey, ActiveEncounter } from './types';
import { LOCATIONS } from './data/locations';
import { useEncounterBuffer } from './hooks/useEncounterBuffer';
import { useAutosave, triggerAutosave } from './hooks/useAutosave';
import { getVisualEffectClasses } from './utils/visualEffects';
import { PREDEFINED_ANATOMIES } from './constants';
import { getTamrielDate } from './utils/scheduleEngine';
import { generateLocalProse } from './utils/proseEngine';
import { resolveLocationAction } from './utils/locationEventEngine';
import { resolveStoryEventStep, startStoryEvent } from './utils/storyEventEngine';

// ── AAA Lazy-loaded heavy components ────────────────────────────────────────
const CharacterModel = React.lazy(() => import('./components/CharacterModel').then(m => ({ default: m.CharacterModel })));
const GltfViewer3D = React.lazy(() => import('./components/GltfViewer3D').then(m => ({ default: m.GltfViewer3D })));
const NarrativePanel = React.lazy(() => import('./components/NarrativePanel').then(m => ({ default: m.NarrativePanel })));
const NarrativeLog = React.lazy(() => import('./components/NarrativeLog').then(m => ({ default: m.NarrativeLog })));
const StatsSidebar = React.lazy(() => import('./components/StatsSidebar').then(m => ({ default: m.StatsSidebar })));
const ImmersiveStartMenu = React.lazy(() => import('./components/ImmersiveStartMenu').then(m => ({ default: m.ImmersiveStartMenu })));

// ── Modals ──
const SettingsModal = React.lazy(() => import('./components/modals/SettingsModal').then(m => ({ default: m.SettingsModal })));
const StatsModal = React.lazy(() => import('./components/modals/StatsModal').then(m => ({ default: m.StatsModal })));
const InventoryModal = React.lazy(() => import('./components/modals/InventoryModal').then(m => ({ default: m.InventoryModal })));
const JournalModal = React.lazy(() => import('./components/modals/JournalModal').then(m => ({ default: m.JournalModal })));
const MapModal = React.lazy(() => import('./components/modals/MapModal').then(m => ({ default: m.MapModal })));
const FeatsModal = React.lazy(() => import('./components/modals/FeatsModal').then(m => ({ default: m.FeatsModal })));
const TraitsModal = React.lazy(() => import('./components/modals/TraitsModal').then(m => ({ default: m.TraitsModal })));
const DaySummaryModal = React.lazy(() => import('./components/modals/DaySummaryModal').then(m => ({ default: m.DaySummaryModal })));
const LifeSimDashboardModal = React.lazy(() => import('./components/modals/LifeSimDashboardModal').then(m => ({ default: m.LifeSimDashboardModal })));
const CharacterCreationModal = React.lazy(() => import('./components/modals/CharacterCreationModal').then(m => ({ default: m.CharacterCreationModal })));
const SuccessionModal = React.lazy(() => import('./components/modals/SuccessionModal').then(m => ({ default: m.SuccessionModal })));

const ChunkFallback = () => <div className="animate-pulse bg-white/5 w-full h-full rounded-sm" />;

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  // AAA UI State
  const [customAction, setCustomAction] = useState('');
  const [activeTab, setActiveTab] = useState('narrative');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [availableTextModels, setAvailableTextModels] = useState<{name: string, count: number}[]>([]);
  const [availableImageModels, setAvailableImageModels] = useState<{name: string, count: number}[]>([]);

  // ── Pre-Cog Synthesis Buffer (Zero-Latency) ──
  const synthesisBuffer = useEncounterBuffer(state!);

  // ── Periodic Autosave ──
  useAutosave(state);

  useEffect(() => {
    // Load initial state
    import('./state/initialState').then(m => setState(m.initialState));
  }, []);

  const dispatch = (action: any) => {
    import('./reducers/gameReducer').then(m => {
      setState(prevState => prevState ? m.gameReducer(prevState, action) : null);
    });
  };

  const handleAction = async (text: string, intent: string = 'neutral', id?: string) => {
    if (!state) return;

    let finalParsedText: any = null;
    let nextStoryEvent = state.world.active_story_event;

    // 1. Resolve Narrative Progression synchronously
    if (state.world.active_story_event) {
      const res = resolveStoryEventStep(state.world.active_story_event, id);
      if (res) {
        finalParsedText = res.parsedText;
        nextStoryEvent = res.nextStoryEvent;
      }
    } else {
      const actionDef = state.world.current_location.actions?.find((a: any) => a.id === id);
      if (actionDef) {
        const res = resolveLocationAction(state, actionDef);
        if (res.kind === 'story_event') {
          const startRes = startStoryEvent(res.eventId);
          if (startRes) {
            nextStoryEvent = startRes.nextStoryEvent;
            finalParsedText = startRes.parsedText;
          }
        } else if (res.kind === 'narrative') {
          finalParsedText = res.parsedText;
        }
      }
    }

    // 2. Fallback to Local Generation or Pre-Cog Buffer
    const bufferedResponse = synthesisBuffer.find(b => b.action === text);
    const localNarrative = generateLocalProse(state, text);

    if (!finalParsedText) {
      finalParsedText = {
        narrative_text: bufferedResponse?.text || localNarrative,
        hours_passed: intent === 'wait' ? 1 : 0
      };
    } else if (bufferedResponse?.text) {
      // Prioritize cinematic narrative over static location text if generated
      finalParsedText.narrative_text = bufferedResponse.text;
    }

    dispatch({ 
      type: 'RESOLVE_TEXT', 
      payload: { 
        actionText: text, 
        intent, 
        id,
        parsedText: finalParsedText,
        nextStoryEvent
      } 
    });

    // 2. Background Synthesis (Fill the buffer for NEXT turns)
    if (state && !state.ui.isPollingText) {
      // Predict likely next actions and send to background worker
      // This happens while the player is reading the current local text
      import('./services/api').then(api => {
         api.generateText(`Predict 3 likely actions and cinematic descriptions after: ${text}`, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedTextModel, dispatch, true, state);
      });
    }

    // 3. Epoch advancement on story arc completion
    const storyJustEnded = state.world.active_story_event && nextStoryEvent === null;
    if (storyJustEnded) {
      const completedCount = (state.world.completed_story_arcs.length || 0) + 1;
      // Every 5 completed arcs advances the world epoch
      if (completedCount % 5 === 0) {
        dispatch({ type: 'ADVANCE_EPOCH', payload: { milestone: `epoch_${Math.floor(completedCount / 5)}` } });
      }
      // Immediate autosave on arc completion
      triggerAutosave(state);
    }
  };

  if (!state) return <div className="bg-black w-screen h-screen flex items-center justify-center font-serif uppercase tracking-[0.5em] text-white/20">Loading Reality...</div>;

  if (!hasStarted) {
    return (
      <Suspense fallback={<div className="bg-black w-screen h-screen flex items-center justify-center text-white/10">Synchronizing...</div>}>
        <ImmersiveStartMenu 
          onStartGame={(config) => {
            dispatch({ type: 'START_NEW_GAME', payload: config });
            dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_character_creation', value: true } });
          }} 
          onLoadGame={(save) => {
            dispatch({ type: 'LOAD_GAME', payload: save });
            setHasStarted(true);
          }}
        />
        <AnimatePresence>
          {state.ui.show_character_creation && (
            <CharacterCreationModal 
              onComplete={(config) => {
                dispatch({ type: 'START_NEW_GAME', payload: config });
                dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_character_creation', value: false } });
                setHasStarted(true);
              }}
              onCancel={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_character_creation', value: false } })}
            />
          )}
        </AnimatePresence>
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`h-dvh bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-sky-500/30 ${getVisualEffectClasses(state)}`}>
        
        {/* AAA Ambient Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(14,165,233,0.1),transparent)]" />
          {state.world.active_world_events.includes('ev_bloodmoon') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className="absolute inset-0 bg-red-900/20" />
          )}
        </div>

        {/* ── Sidebars (High Fidelity Layout) ── */}
        <Suspense fallback={<div className="w-64 bg-black/50 border-r border-white/5" />}>
          <StatsSidebar
            state={state} 
            dispatch={dispatch} 
            onOpenStats={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_stats', value: true } })}
            onOpenInventory={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_inventory', value: true } })}
          />
        </Suspense>

        {/* ── Main Work Area ── */}
        <main className="flex-1 min-h-0 flex flex-col relative z-10">
          
          {/* Global Header / Dashboard Top Bar */}
          <header className="h-16 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl flex items-center justify-between px-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold">Aetherius Chronicle</span>
                <span className="text-xs text-sky-400/80 tracking-widest uppercase">Version 1.0.0-AAA</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <nav className="flex items-center gap-4">
                 {[
                   { id: 'narrative', label: 'Reality', icon: <Activity className="w-3.5 h-3.5" /> },
                   { id: 'map', label: 'Province', icon: <MapIcon className="w-3.5 h-3.5" />, action: 'show_map' },
                   { id: 'dynasty', label: 'Lineage', icon: <Castle className="w-3.5 h-3.5" />, action: 'show_life_sim_dashboard' },
                 ].map(item => (
                   <motion.button
                     key={item.id}
                     whileHover={{ y: -2, scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => item.action ? dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: item.action, value: true } }) : setActiveTab(item.id)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${activeTab === item.id ? 'border-sky-500/50 bg-sky-500/10 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.2)]' : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]'}`}
                   >
                     {item.icon}
                     <span className="text-[10px] tracking-widest uppercase font-bold">{item.label}</span>
                   </motion.button>
                 ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
               {/* Time & Calendar Display */}
               <div className="text-right flex flex-col">
                  {(() => {
                    const { dayName, monthName, dayOfMonth } = getTamrielDate(state.world.day, state.world.week_day);
                    return <span className="text-[10px] tracking-widest uppercase text-white/50">{dayName}, {dayOfMonth} {monthName}</span>;
                  })()}
                  <span className="font-serif text-sm text-white/80 tracking-widest">{state.world.hour}:00</span>
               </div>
               <motion.button
                 whileHover={{ rotate: 90, scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_settings', value: true } })}
                 className="p-2 hover:bg-white/5 rounded-full transition-colors"
               >
                 <Settings className="w-5 h-5 text-white/40" />
               </motion.button>
            </div>
          </header>

          {/* Main Content Split: Visuals + Narrative */}
          <div className="flex-1 min-h-0 flex overflow-hidden">
            
            {/* Left: Cinematic Visual Stage */}
            <section className="flex-1 relative bg-[#020202] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={state.world.current_location.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="absolute inset-0"
                >
                  <Suspense fallback={<ChunkFallback />}>
                    <GltfViewer3D 
                      state={state} 
                      height="100%" 
                      combatAnimation={state.ui.combat_animation}
                    />
                  </Suspense>
                </motion.div>
              </AnimatePresence>

              {/* AAA UI Overlays on Stage */}
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="bg-black/60 backdrop-blur-md border border-white/10 px-5 py-3 rounded-xl shadow-lg"
                >
                   <h1 className="text-xl font-serif tracking-widest uppercase text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{state.world.current_location.name}</h1>
                   <span className="text-[10px] tracking-[0.3em] uppercase text-sky-400/80 font-bold">{state.world.current_location.atmosphere}</span>
                </motion.div>
              </div>

              {/* ── Narrative HUD ── */}
              <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="bg-black/60 backdrop-blur-md border border-white/[0.08] px-4 py-2.5 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[7px] tracking-[0.3em] uppercase text-white/25 font-bold">World Epoch</span>
                      <span className="text-sm font-mono text-amber-400/90 tracking-widest">{state.world.world_epoch > 0 ? `ERA ${state.world.world_epoch}` : 'DAWN'}</span>
                    </div>
                    <div className="w-px h-6 bg-white/[0.08]" />
                    <div className="flex flex-col">
                      <span className="text-[7px] tracking-[0.3em] uppercase text-white/25 font-bold">Arcs</span>
                      <span className="text-sm font-mono text-sky-400/80 tracking-widest">{state.world.completed_story_arcs.length}</span>
                    </div>
                    {state.world.narrative_milestones.length > 0 && (
                      <>
                        <div className="w-px h-6 bg-white/[0.08]" />
                        <div className="flex flex-col max-w-[120px]">
                          <span className="text-[7px] tracking-[0.3em] uppercase text-white/25 font-bold">Milestone</span>
                          <span className="text-[9px] font-mono text-purple-400/70 tracking-wider truncate">{state.world.narrative_milestones[state.world.narrative_milestones.length - 1].replace(/_/g, ' ')}</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Location danger indicator */}
              {state.world.current_location.danger > 0 && (
                <div className="absolute top-6 right-6 z-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/60 backdrop-blur-md border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${state.world.current_location.danger > 5 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-amber-500/80'}`} />
                    <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 font-bold">
                      {state.world.current_location.danger > 5 ? 'HIGH THREAT' : 'CAUTION'}
                    </span>
                  </motion.div>
                </div>
              )}
            </section>

            {/* Right: Narrative Interaction Deck */}
            <aside className="w-full sm:w-[450px] shrink-0 border-l border-white/[0.06] bg-black/20 backdrop-blur-3xl flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.8)]">
               <Suspense fallback={<ChunkFallback />}>
                 <NarrativePanel 
                   state={state}
                   handleAction={handleAction}
                   customAction={customAction}
                   setCustomAction={setCustomAction}
                   NarrativeLog={NarrativeLog}
                 />
               </Suspense>
            </aside>
          </div>
        </main>

        {/* ── Global AAA Modals Layer ── */}
        <Suspense fallback={null}>
          <AnimatePresence>
            {state.ui.show_settings && (
              <SettingsModal 
                state={state} 
                dispatch={dispatch} 
                onClose={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_settings', value: false } })}
                availableTextModels={availableTextModels}
                availableImageModels={availableImageModels}
                isLoadingModels={isLoadingModels}
                setShowDeveloperMode={() => {}}
                toggleFullscreen={() => {}}
              />
            )}
            {state.ui.show_stats && <StatsModal state={state} dispatch={dispatch} />}
            {state.ui.show_inventory && (
               <InventoryModal 
                 state={state} 
                 dispatch={dispatch} 
                 selectedItem={selectedItem}
                 setSelectedItem={setSelectedItem}
               />
            )}
            {state.ui.show_map && <MapModal state={state} dispatch={dispatch} />}
            {state.ui.show_day_summary && <DaySummaryModal state={state} dispatch={dispatch} />}
            {state.ui.show_life_sim_dashboard && <LifeSimDashboardModal state={state} dispatch={dispatch} />}
            {state.ui.show_succession && <SuccessionModal state={state} onConfirm={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_succession', value: false } })} />}
          </AnimatePresence>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
