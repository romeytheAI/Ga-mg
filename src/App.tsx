import React, { useState, useEffect, useRef, useReducer, createContext, useCallback, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Wind, Moon, Settings, X, BookOpen, User, Map as MapIcon, 
  Shield, Sword, Zap, Droplets, AlertTriangle, Ghost, Sparkles, 
  Layers, ShoppingBag, Eye, EyeOff, Thermometer, Clock, Calendar, RefreshCw, Book,
  Cloud, Sun, Snowflake, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Flame
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { CharacterModel } from './components/CharacterModel';
import { SaveLoadModal } from './components/SaveLoadModal';
import { XRayView } from './components/XRayView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NarrativePanel } from './components/NarrativePanel';
import { JournalModal } from './components/modals/JournalModal';
import { MapModal } from './components/modals/MapModal';
import { XRayModal } from './components/modals/XRayModal';
import { StatsModal } from './components/modals/StatsModal';
import { StatusModal } from './components/modals/StatusModal';
import { MemoriesModal } from './components/modals/MemoriesModal';
import { InventoryModal } from './components/modals/InventoryModal';
import { DeveloperModeModal } from './components/modals/DeveloperModeModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SemanticText } from './components/TextComponents';
import { GameState, Item, StatKey, ActiveEncounter } from './types';
import { LOCATIONS } from './data/locations';
import { NPCS } from './data/npcs';
import { BASIC_ITEMS } from './data/items';
import { ENCOUNTERS } from './data/encounters';
import { initialState } from './state/initialState';
import { gameReducer } from './reducers/gameReducer';
import { PREDEFINED_ANATOMIES, STABLE_API, DEFAULT_API_KEY, AGE_APPEARANCE } from './constants';
import { ELDER_SCROLLS_LORE, getRelevantLore } from './lore';
import { generateText, generateImage, generateLegendaryStats } from './services/api';
import { buildTextPromptAsync, buildImagePrompt, getVisualEffectClasses, imageWorker } from './utils/workers';
import { getSynergies, getAgeTag, getFallbackResponse, getHealthSemantic, getStaminaSemantic, getTraumaSemantic } from './utils/gameLogic';
import { useEncounterBuffer } from './hooks/useEncounterBuffer';

// --- Main Component ---
import { ImmersiveStartMenu } from './components/ImmersiveStartMenu';
import { EncounterUI } from './components/EncounterUI';
import { NarrativeLog } from './components/NarrativeLog';
import { saveGame } from './utils/saveManager';
import { FloatingDeltas } from './components/TextComponents';
import { DoLStatsSidebar } from './components/DoLStatsSidebar';

const SettingsContext = createContext<any>(null);
const HordeNetworkContext = createContext<any>(null);
const GameStateContext = createContext<any>(null);
const SensoryUIContext = createContext<any>(null);

export default function AppWrapper() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <ErrorBoundary>
      <SettingsContext.Provider value={{}}>
        <HordeNetworkContext.Provider value={{}}>
          <GameStateContext.Provider value={{ state, dispatch }}>
            <SensoryUIContext.Provider value={{}}>
              <App state={state} dispatch={dispatch} />
            </SensoryUIContext.Provider>
          </GameStateContext.Provider>
        </HordeNetworkContext.Provider>
      </SettingsContext.Provider>
    </ErrorBoundary>
  );
}

function App({ state, dispatch }: { state: GameState, dispatch: React.Dispatch<any> }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [availableTextModels, setAvailableTextModels] = useState<{name: string, count: number}[]>([]);
  const [availableImageModels, setAvailableImageModels] = useState<{name: string, count: number}[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const visualEffectClasses = getVisualEffectClasses(state);

  const generatePlayerAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const ai = new GoogleGenAI({ apiKey: state.ui.apiKey });
      const prompt = `A highly detailed, dark fantasy portrait of a ${getAgeTag(state.player.age_days, state.player.identity.race)} ${state.player.identity.race} ${state.player.identity.gender}. ${AGE_APPEARANCE[Math.floor(state.player.age_days / 365)] || ''} ${state.player.cosmetics.hair_length} ${state.player.cosmetics.eye_color} eyes. Dark, gritty, atmospheric lighting.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          dispatch({ type: 'SET_PLAYER_AVATAR', payload: imageUrl });
        }
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  useEffect(() => {
    if (showSettings && availableTextModels.length === 0) {
      setIsLoadingModels(true);
      Promise.all([
        fetch(`${STABLE_API}/status/models?type=text`).then(r => r.json()),
        fetch(`${STABLE_API}/status/models?type=image`).then(r => r.json())
      ]).then(([textModels, imageModels]) => {
        setAvailableTextModels(textModels.sort((a: any, b: any) => b.count - a.count));
        setAvailableImageModels(imageModels.sort((a: any, b: any) => b.count - a.count));
      }).catch(err => {
        console.error("Failed to fetch models", err);
      }).finally(() => {
        setIsLoadingModels(false);
      });
    }
  }, [showSettings]);

  const [showDeveloperMode, setShowDeveloperMode] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showCompanions, setShowCompanions] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const logRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const encounterBuffer = useEncounterBuffer(state);

  const handleStartGame = (config: any) => {
    dispatch({ type: 'START_NEW_GAME', payload: config });
    setHasStarted(true);
  };

  const handleLoadGame = (saveData: any) => {
    dispatch({ type: 'LOAD_GAME', payload: saveData });
    setHasStarted(true);
  };

  useEffect(() => {
    const pollHordeStatus = async () => {
      try {
        const res = await fetch(`${STABLE_API}/status/performance`);
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: 'SET_HORDE_STATUS', payload: { status: 'Online', queue: data.queued_requests || 0, wait: data.queued_megapixels || 0 } });
        }
      } catch (e) {
        dispatch({ type: 'SET_HORDE_STATUS', payload: { status: 'Offline', queue: 0, wait: 0 } });
      }
    };
    const interval = setInterval(pollHordeStatus, 30000);
    pollHordeStatus();
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.ui.currentLog]);

  useEffect(() => {
    if (!hasStarted) return;
    const timeoutId = setTimeout(() => {
      saveGame('autosave', state).catch(e => console.error("Autosave failed:", e));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [state, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      dispatch({ type: 'INITIAL_IMAGE_START' });
      generateImage(buildImagePrompt(state), state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedImageModel, dispatch)
        .then(img => dispatch({ type: 'RESOLVE_IMAGE', payload: img }))
        .catch(() => dispatch({ type: 'RESOLVE_IMAGE_FAILED' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted]);

  // Heartbeat Audio Simulation
  useEffect(() => {
    if (state.player.stats.stamina < 10) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playHeartbeat = () => {
        if (audioCtx.state === 'closed') return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      };

      const interval = setInterval(() => {
        playHeartbeat();
        setTimeout(playHeartbeat, 200); // Double beat
      }, 1000); // 60 BPM
      
      return () => {
        clearInterval(interval);
        if (audioCtx.state !== 'closed') {
          audioCtx.close();
        }
      };
    }
  }, [state.player.stats.stamina]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    });
  }, []);

  useEffect(() => {
    if (state.ui.ambient_audio) {
      // Placeholder for Web Audio API ambient loops based on weather
      console.log(`Playing ambient audio for weather: ${state.world.weather}`);
    }
  }, [state.world.weather, state.ui.ambient_audio]);

  useEffect(() => {
    if (state.ui.last_stat_deltas && state.ui.haptics_enabled && state.ui.last_stat_deltas.health < 0) {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [state.ui.last_stat_deltas, state.ui.haptics_enabled]);

  useEffect(() => {
    const summarizeMemory = async () => {
      if (state.memory_graph.length > 15 && !state.ui.isPollingText) {
        const oldestTurns = state.memory_graph.slice(0, 10).join("\\n");
        const prompt = `Summarize the following events into a single concise paragraph representing a distant memory:\n\n${oldestTurns}\n\nOutput ONLY the summary text, no JSON.`;
        try {
          const summaryText = await generateText(prompt, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedTextModel, dispatch, true);
          let summary = summaryText.trim();
          try {
            const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              summary = parsed.narrative_text || summaryText;
            }
          } catch (e) {
            // Ignore JSON parse error, use raw text
          }
          dispatch({ type: 'SUMMARIZE_MEMORY', payload: { summary: `[Distant Memory]: ${summary}`, count: 10 } });
        } catch (e) {
          console.error("Memory summarization failed", e);
        }
      }
    };
    summarizeMemory();
  }, [state.memory_graph.length, state.ui.isPollingText, state.ui.apiKey, dispatch]);

  const generateAvatar = async () => {
    if (state.ui.isGeneratingAvatar) return;
    dispatch({ type: 'START_AVATAR_GENERATION' });
    try {
      const ai = new GoogleGenAI({ apiKey: state.ui.apiKey });
      const prompt = `A highly detailed, dark fantasy portrait of a ${getAgeTag(state.player.age_days, state.player.identity.race)} ${state.player.identity.race} ${state.player.identity.gender}. ${AGE_APPEARANCE[Math.floor(state.player.age_days / 365)] || ''} ${state.player.cosmetics.hair_length} ${state.player.cosmetics.eye_color} eyes. Dark, gritty, atmospheric lighting.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      });
      
      let imageUrl = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }
      if (imageUrl) {
        dispatch({ type: 'RESOLVE_AVATAR', payload: imageUrl });
      } else {
        throw new Error("No image generated");
      }
    } catch (e) {
      console.error("Avatar generation failed", e);
      dispatch({ type: 'RESOLVE_AVATAR_FAILED' });
    }
  };

  const handleAction = async (actionText: string, intent?: string, targetedPart?: string, actionId?: string) => {
    if (state.ui.isPollingText) return;
    
    const triggerCombatFeedback = (animation: string, showXRay: boolean = false, highlightedPart: string | null = null) => {
      dispatch({ type: 'SET_COMBAT_ANIMATION', payload: animation });
      setTimeout(() => dispatch({ type: 'SET_COMBAT_ANIMATION', payload: null }), 1000);
      if (showXRay) {
        dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_xray', value: true } });
        dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'highlighted_part', value: highlightedPart } });
        setTimeout(() => {
          dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_xray', value: false } });
          dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'highlighted_part', value: null } });
        }, 2000);
      }
    };

    dispatch({ type: 'START_TURN', payload: { actionText, intent } });

    if (state.world.active_encounter) {
      // Handle encounter logic
      const encounter = state.world.active_encounter;
      let narrative = "";
      let stat_deltas: any = {};
      let skill_deltas: any = {};
      let encounterUpdates: any = { turn: encounter.turn + 1 };
      let endEncounter = false;

      // Simple combat/struggle logic
      const synergies = getSynergies(state.player.skills);
      const hasAcrobaticLover = synergies.some(s => s.name === "Acrobatic Lover");
      const hasShadowWalker = synergies.some(s => s.name === "Shadow Walker");
      const hasAquaticPredator = synergies.some(s => s.name === "Aquatic Predator");

      if (intent === 'aggressive') {
        const athletics = state.player.skills?.athletics || 0;
        const damage = Math.floor(Math.random() * 20) + 10 + Math.floor(athletics / 10) + (hasAquaticPredator && state.world.current_location.name.includes('Water') ? 10 : 0);
        
        triggerCombatFeedback(damage > 25 ? 'special_attack' : 'attack', damage > 20, damage > 25 ? 'heart' : 'ribs');

        encounterUpdates.enemy_health = Math.max(0, encounter.enemy_health - damage);
        encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 15);
        
        if (targetedPart) {
          if (targetedPart === 'legs') {
            encounterUpdates.debuffs = [...(encounter.debuffs || []), { type: 'slowed', duration: 2 }];
            narrative = `You hit their legs, slowing them down! Dealing ${damage} damage!`;
          } else if (targetedPart === 'arms') {
            encounterUpdates.debuffs = [...(encounter.debuffs || []), { type: 'weakened', duration: 2 }];
            narrative = `You hit their arms, weakening their attacks! Dealing ${damage} damage!`;
          } else {
            narrative = `You struggle fiercely, dealing ${damage} damage!`;
          }
        } else {
          narrative = `You struggle fiercely, dealing ${damage} damage!`;
        }

        stat_deltas.stamina = -10;
        skill_deltas.athletics = 1;
        if (encounterUpdates.enemy_health <= 0) {
          narrative += " The enemy is defeated!";
          endEncounter = true;
        } else {
          narrative += " The enemy retaliates!";
          stat_deltas.health = -15 + Math.floor(athletics / 20);
          stat_deltas.pain = 10;
          encounterUpdates.encounter_action = 'grabbed';
        }
      } else if (intent === 'submissive') {
        triggerCombatFeedback('lust_action', false, null);
        encounterUpdates.enemy_lust = Math.min(100, encounter.enemy_lust + 20);
        encounterUpdates.enemy_anger = Math.max(0, encounter.enemy_anger - 10);
        stat_deltas.stress = 15;
        stat_deltas.lust = 10;
        stat_deltas.purity = -5;
        narrative = "You submit to their advances. They take advantage of your compliance.";
        encounterUpdates.encounter_action = 'groped';
        if (encounterUpdates.enemy_lust >= 100) {
          narrative += " They are satisfied and leave you alone.";
          endEncounter = true;
        }
      } else if (intent === 'social') {
        triggerCombatFeedback('spellcast', false, null);
        const seduction = state.player.skills?.seduction || 0;
        const seduceChance = ((state.player.stats.allure || 10) + seduction + (hasAcrobaticLover ? 20 : 0)) / 200;
        if (Math.random() < seduceChance) {
          encounterUpdates.enemy_lust = Math.min(100, encounter.enemy_lust + 30 + Math.floor(seduction / 5));
          narrative = "You successfully seduce them, increasing their lust.";
          skill_deltas.seduction = 2;
          encounterUpdates.encounter_action = 'caressed';
          if (encounterUpdates.enemy_lust >= 100) {
            narrative += " They are completely enamored and let you go.";
            endEncounter = true;
          }
        } else {
          encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 10);
          narrative = "Your seduction attempt fails. They are annoyed.";
          stat_deltas.health = -5;
          skill_deltas.seduction = 1;
          encounterUpdates.encounter_action = 'grabbed';
        }
        stat_deltas.lust = 5;
      } else if (intent === 'flee') {
        triggerCombatFeedback('dodge', false, null);
        const athletics = state.player.skills?.athletics || 0;
        const fleeChance = ((state.player.stats.stamina || 50) + athletics + (hasShadowWalker ? 30 : 0)) / 200;
        if (Math.random() < fleeChance) {
          narrative = "You manage to escape!";
          skill_deltas.athletics = 2;
          endEncounter = true;
        } else {
          narrative = "You try to run, but they catch you!";
          stat_deltas.stamina = -15 + (hasAcrobaticLover ? 5 : 0);
          stat_deltas.stress = 10;
          skill_deltas.athletics = 1;
          encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 10);
        }
      } else if (intent === 'resist') {
        triggerCombatFeedback('block', true, 'ribs');
        const willpower = state.player.stats.willpower || 50;
        const resistStrength = willpower + (state.player.skills?.athletics || 0) * 0.5;
        const resistChance = resistStrength / 200;
        if (Math.random() < resistChance) {
          encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 20);
          encounterUpdates.enemy_lust = Math.max(0, encounter.enemy_lust - 10);
          narrative = "You resist with all your strength! They are forced back, frustrated and angry.";
          encounterUpdates.encounter_action = 'resist_break';
          if (encounter.enemy_anger >= 90) {
            narrative += " Enraged beyond reason, they give up and storm off!";
            endEncounter = true;
          }
        } else {
          narrative = "You try to resist, but they overpower you! Your body aches from the effort.";
          stat_deltas.stamina = -20;
          stat_deltas.pain = 15;
          stat_deltas.stress = 10;
          encounterUpdates.encounter_action = 'arms_pinned';
        }
        stat_deltas.willpower = -5;
        skill_deltas.athletics = 1;
      } else if (intent === 'endure') {
        triggerCombatFeedback('defend', false, null);
        const control = state.player.stats.control || 50;
        const enduranceBonus = Math.floor(control / 20);
        encounterUpdates.enemy_lust = Math.min(100, encounter.enemy_lust + 10);
        encounterUpdates.enemy_anger = Math.max(0, encounter.enemy_anger - 5);
        stat_deltas.stress = 10 - enduranceBonus;
        stat_deltas.trauma = 3;
        stat_deltas.pain = 5;
        stat_deltas.stamina = 5; // resting / conserving energy
        narrative = "You grit your teeth and endure, waiting for an opening. The ordeal takes its toll on your mind.";
        encounterUpdates.encounter_action = 'grabbed';
        // After enough enduring, enemy tires out
        if (encounter.turn >= 8) {
          const tiredChance = (encounter.turn - 7) * 0.15;
          if (Math.random() < tiredChance) {
            narrative += " They grow bored and wander off, leaving you shaken but alive.";
            endEncounter = true;
          }
        }
      } else if (intent === 'cry_out') {
        triggerCombatFeedback('special', false, null);
        const socialSkill = state.player.skills?.seduction || 0;
        const rescueChance = 0.15 + (socialSkill * 0.003) + (state.world.current_location.danger < 30 ? 0.15 : 0);
        if (Math.random() < rescueChance) {
          narrative = "Your desperate cry echoes through the area! Someone hears you and rushes to help. Your attacker flees!";
          endEncounter = true;
        } else {
          encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 25);
          narrative = "You cry out for help, but no one comes. Your attacker is furious at the noise!";
          stat_deltas.health = -10;
          stat_deltas.pain = 10;
          stat_deltas.stress = 15;
          encounterUpdates.encounter_action = 'grabbed';
        }
      }

      // Tick debuff durations — decrement by 1 per turn, remove expired
      if (encounterUpdates.debuffs || encounter.debuffs?.length) {
        const currentDebuffs = encounterUpdates.debuffs || encounter.debuffs || [];
        encounterUpdates.debuffs = currentDebuffs
          .map((d: { type: string; duration: number }) => ({ ...d, duration: d.duration - 1 }))
          .filter((d: { type: string; duration: number }) => d.duration > 0);
      }

      encounterUpdates.log = [...(encounter.log || []), narrative];

      if (endEncounter) {
        dispatch({ type: 'SET_ACTIVE_ENCOUNTER', payload: null });
        dispatch({ type: 'INITIAL_IMAGE_START' });
        generateImage(buildImagePrompt(state), state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedImageModel, dispatch)
          .then(img => dispatch({ type: 'RESOLVE_IMAGE', payload: img }))
          .catch(() => dispatch({ type: 'RESOLVE_IMAGE_FAILED' }));
      } else {
        dispatch({ type: 'UPDATE_ACTIVE_ENCOUNTER', payload: encounterUpdates });
      }

      const prompt = `The player is in a dark fantasy encounter with ${encounter.enemy_name}. The player chooses to ${actionText} (${intent}). The enemy's health is ${encounterUpdates.enemy_health}, lust is ${encounterUpdates.enemy_lust}, anger is ${encounterUpdates.enemy_anger}. Describe what happens next in 2-3 sentences. Return ONLY valid JSON with a 'narrative_text' field. Example: {"narrative_text": "You struggle fiercely, but the enemy retaliates."}`;
      
      let aiNarrative = narrative;
      try {
        const textResult = await generateText(prompt, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedTextModel, dispatch);
        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.narrative_text) {
            aiNarrative = parsed.narrative_text;
          }
        }
      } catch (e) {
        console.warn("Encounter narrative generation failed, using fallback", e);
      }

      dispatch({ type: 'RESOLVE_TEXT', payload: { 
        parsedText: {
          narrative_text: aiNarrative,
          stat_deltas,
          skill_deltas,
          follow_up_choices: []
        }, 
        actionText 
      } });
      return;
    }

    // 1. Check for Hardcoded Responses
    const currentLocation = state.world.current_location;
    let hardcodedAction = currentLocation.actions?.find((a: any) => a.id === actionId);
    
    // Default 50 encounter_rate = 15% chance
    const encounterChance = (state.ui.settings?.encounter_rate ?? 50) / 100 * 0.30;
    
    if (Math.random() < encounterChance) {
      const validEncounters = ENCOUNTERS.filter(e => e.condition(state));
      if (validEncounters.length > 0) {
        const encounter = validEncounters[Math.floor(Math.random() * validEncounters.length)];
        
        const activeEncounter: ActiveEncounter = {
          id: encounter.id,
          enemy_name: encounter.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          enemy_type: encounter.id,
          enemy_health: 100,
          enemy_max_health: 100,
          enemy_lust: 0,
          enemy_max_lust: 100,
          enemy_anger: 0,
          enemy_max_anger: 100,
          player_stance: 'neutral',
          turn: 1,
          log: [],
          debuffs: [],
          targeted_part: null,
          anatomy: encounter.anatomy || PREDEFINED_ANATOMIES.average
        };

        dispatch({ type: 'SET_ACTIVE_ENCOUNTER', payload: activeEncounter });
        
        dispatch({ type: 'RESOLVE_TEXT', payload: { 
          parsedText: {
            narrative_text: `[ENCOUNTER] ${encounter.outcome}`,
            follow_up_choices: []
          }, 
          actionText 
        } });

        dispatch({ type: 'INITIAL_IMAGE_START' });
        const encounterImagePrompt = `A dark fantasy RPG encounter with ${activeEncounter.enemy_name}. ${encounter.outcome}. Atmospheric, gritty, detailed, cinematic lighting.`;
        generateImage(encounterImagePrompt, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedImageModel, dispatch)
          .then(img => dispatch({ type: 'RESOLVE_IMAGE', payload: img }))
          .catch(() => dispatch({ type: 'RESOLVE_IMAGE_FAILED' }));

        return;
      }
    }

    if (intent === 'travel') {
      const targetLoc = Object.values(LOCATIONS).find((l: any) => actionText.includes(l.name));
      if (targetLoc) {
        dispatch({ type: 'RESOLVE_TEXT', payload: { 
          parsedText: {
            narrative_text: `You travel to ${targetLoc.name}. ${targetLoc.description}`,
            new_location: targetLoc.id,
            hours_passed: 1
          }, 
          actionText 
        } });
        return;
      }
    }

    if (actionText === "Rest and recover") {
      dispatch({ type: 'RESOLVE_TEXT', payload: { 
        parsedText: {
          narrative_text: "You find a relatively safe spot and rest for a few hours. Your stamina and health slowly recover, but the cold and grime seep into your bones.",
          stat_deltas: { stamina: 30, health: 10, stress: -10, hygiene: -10, lust: 5 },
          hours_passed: 4
        }, 
        actionText 
      } });
      return;
    }

    if (actionText === "Scavenge the area for supplies") {
      const foundItem = Math.random() > 0.5;
      const item = foundItem ? { name: "Lost Coin", type: "misc", rarity: "common", description: "A tarnished septim dropped in the mud." } : null;
      dispatch({ type: 'RESOLVE_TEXT', payload: { 
        parsedText: {
          narrative_text: foundItem ? "You spend an hour digging through the grime and find something." : "You search the area but find nothing but filth.",
          stat_deltas: { stamina: -10, hygiene: -15, stress: 5 },
          new_items: item ? [item] : [],
          hours_passed: 1
        }, 
        actionText 
      } });
      return;
    }



    if (hardcodedAction) {
      // Calculate success chance if there's a skill check
      let isSuccess = true;
      let outcomeText = hardcodedAction.outcome;
      let statDeltas = hardcodedAction.stat_deltas;
      let skillDeltas = hardcodedAction.skill_deltas;
      let newItems = hardcodedAction.new_items;

      if (hardcodedAction.skill_check) {
        const statValue = (state.player.stats as any)[hardcodedAction.skill_check.stat] || (state.player.skills as any)[hardcodedAction.skill_check.stat] || 0;
        const difficulty = hardcodedAction.skill_check.difficulty;
        // Simple chance calculation: base 25% + (stat / difficulty) * 50%
        const chance = Math.min(100, Math.max(5, (statValue / difficulty) * 50 + 25));
        
        const roll = Math.random() * 100;
        isSuccess = roll <= chance;

        if (!isSuccess && hardcodedAction.fail_outcome) {
          outcomeText = hardcodedAction.fail_outcome;
          statDeltas = hardcodedAction.fail_stat_deltas || {};
          skillDeltas = hardcodedAction.fail_skill_deltas || {};
          newItems = []; // No items on failure
        }
      }

      // Map choices to include success chance for UI
      const nextLocation = hardcodedAction.new_location ? LOCATIONS[hardcodedAction.new_location] : currentLocation;
      const followUpChoices = (nextLocation.actions || []).map((a: any) => {
        if (a.skill_check) {
          const statValue = (state.player.stats as any)[a.skill_check.stat] || 0;
          const chance = Math.min(100, Math.max(5, (statValue / a.skill_check.difficulty) * 50 + 25));
          return { ...a, successChance: Math.round(chance) };
        }
        return a;
      });

      if (hardcodedAction.npc) {
        const npc = NPCS[hardcodedAction.npc];
        const response = npc.responses[hardcodedAction.intent || 'social'];
        if (response) {
          dispatch({ type: 'RESOLVE_TEXT', payload: { parsedText: { ...response, follow_up_choices: followUpChoices, new_location: hardcodedAction.new_location }, actionText } });
          return;
        }
      } else if (outcomeText) {
        dispatch({ type: 'RESOLVE_TEXT', payload: { 
          parsedText: {
            narrative_text: outcomeText, 
            stat_deltas: statDeltas,
            skill_deltas: skillDeltas,
            new_items: newItems,
            follow_up_choices: followUpChoices,
            new_location: hardcodedAction.new_location
          }, 
          actionText 
        } });
        return;
      }
    }

    // 2. AI Fallback
    try {
      const prompt = await buildTextPromptAsync(state, actionText);
      let textResult = "";
      try {
        textResult = await generateText(prompt, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedTextModel, dispatch);
      } catch (e) {
        console.warn("generateText threw an error, using fallback", e);
      }
      
      let parsedText;
      try {
        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedText = JSON.parse(jsonMatch[0]);
          
          // Legendary Item Logic
          if (parsedText.new_items) {
            for (let item of parsedText.new_items) {
              if (item.rarity === 'legendary' || item.rarity === 'mythic') {
                const stats = await generateLegendaryStats(item.name, item.description, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedTextModel, dispatch);
                item.stats = { ...item.stats, ...stats };
              }
            }
          }
        } else {
          parsedText = getFallbackResponse();
        }
      } catch (e) {
        parsedText = getFallbackResponse();
      }

      // Map choices to include success chance for UI
      if (parsedText.follow_up_choices) {
        parsedText.follow_up_choices = parsedText.follow_up_choices.map((a: any) => {
          if (a.skill_check) {
            const statValue = (state.player.stats as any)[a.skill_check.stat] || 0;
            const chance = Math.min(100, Math.max(5, (statValue / a.skill_check.difficulty) * 50 + 25));
            return { ...a, successChance: Math.round(chance) };
          }
          return a;
        });
      }
      
      dispatch({ type: 'RESOLVE_TEXT', payload: { parsedText, actionText } });

      // 3. Conditional Image Generation
      const shouldRegenImage = parsedText.new_items?.length > 0 || state.world.turn_count % 10 === 0;
      if (shouldRegenImage) {
        dispatch({ type: 'INITIAL_IMAGE_START' });
        generateImage(buildImagePrompt(state), state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedImageModel, dispatch)
          .then(img => dispatch({ type: 'RESOLVE_IMAGE', payload: img }))
          .catch(() => dispatch({ type: 'RESOLVE_IMAGE_FAILED' }));
      }
    } catch (e) {
      console.error("Turn generation failed", e);
      dispatch({ type: 'RESOLVE_TEXT_FAILED' });
      dispatch({ type: 'RESOLVE_IMAGE_FAILED' });
    }
  };

  async function generateLegendaryStats(name: string, description: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) {
    const prompt = `Generate RPG stats for a legendary item in the Elder Scrolls universe.
Item Name: ${name}
Description: ${description}

Output ONLY a JSON object with stat keys (health, stamina, willpower, lust, trauma, hygiene, corruption, allure, arousal, pain, control, stress, hallucination, purity) and numeric values.
Example: { "health": 50, "allure": 20 }`;

    try {
      const result = await generateText(prompt, apiKey, hordeApiKey, model, dispatch);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      return { health: 25, willpower: 25 };
    }
    return {};
  }

  const containerClasses = [
    "min-h-screen bg-[#050505] text-white/80 font-sans flex flex-col selection:bg-white/20 transition-colors duration-1000",
    state.world.weather === 'Rain' ? "weather-rain" : "",
    state.world.weather === 'Fog' ? "weather-fog" : "",
    state.world.current_location.atmosphere.includes('dark') ? "pitch-black" : "",
    state.player.stats.health < 20 ? "heartbeat-vignette" : "",
    state.player.stats.trauma > 80 ? "apathy-desaturation" : "",
    state.player.stats.trauma > 50 ? "chromatic-aberration" : ""
  ].filter(Boolean).join(" ");

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'fullscreen', value: true } });
    } else {
      document.exitFullscreen();
      dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'fullscreen', value: false } });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const baseWidth = 1920; 
      const scale = width / baseWidth;
      const clampedScale = Math.max(0.7, Math.min(1.2, scale));
      dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'ui_scale', value: clampedScale } });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasStarted) {
    return <ImmersiveStartMenu onStartGame={handleStartGame} onLoadGame={handleLoadGame} />;
  }

  return (
    <div 
      className={containerClasses}
      style={{ fontSize: `${state.ui.ui_scale}rem` }}
    >
      {/* Header Bar */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 relative z-30">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xs tracking-[0.4em] uppercase text-white/40 font-light">Aetherius</h1>
            <span className="text-[10px] text-white/20 uppercase tracking-widest">Elder Scrolls Simulation</span>
          </div>
          
          <nav className="flex items-center gap-4 ml-8">
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_stats', value: true } })}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <User className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">Essence</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_inventory', value: true } })}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <ShoppingBag className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">Possessions</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_xray', value: true } })}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <Eye className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">X-Ray</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_map', value: true } })}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <MapIcon className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">Cartography</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_quests', value: true } })}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <Book className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">Journal</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_save_load', value: true } })}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <RefreshCw className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">Save/Load</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompanions(true)}
              className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-all rounded-sm"
            >
              <Ghost className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/90">Roster</span>
            </motion.button>
          </nav>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex items-center gap-8 text-[10px] tracking-[0.2em] uppercase">
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-white/40" />
              <span className={state.player.stats.health < 30 ? 'text-red-500 animate-pulse' : 'text-white/60'}>
                {getHealthSemantic(state.player.stats.health)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-3 h-3 text-white/40" />
              <span className={state.player.stats.stamina < 30 ? 'text-blue-400 animate-pulse' : 'text-white/60'}>
                {getStaminaSemantic(state.player.stats.stamina)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-3 h-3 text-white/40" />
              <span className={state.player.stats.trauma > 70 ? 'text-purple-400 animate-pulse' : 'text-white/60'}>
                {getTraumaSemantic(state.player.stats.trauma)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-white/40" />
              <span className="text-white/60">
                {Math.floor(state.player.age_days / 365)} Cycles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {state.ui.horde_status && (
              <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className={`w-1.5 h-1.5 rounded-full ${state.ui.horde_status.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'} animate-pulse`} />
                <div className="flex flex-col">
                  <span className="text-[9px] tracking-widest uppercase text-white/30">Horde Status</span>
                  <span className="text-[10px] text-white/60 font-mono">Q: {state.ui.horde_status.queue} | W: {state.ui.horde_status.wait}mp</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors group"
            >
              <Settings className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:rotate-45 transition-all duration-500" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {state.ui.last_stat_deltas && (
          <FloatingDeltas 
            deltas={state.ui.last_stat_deltas} 
            onComplete={() => dispatch({ type: 'CLEAR_STAT_DELTAS' })} 
          />
        )}
      </AnimatePresence>
      {state.ui.show_save_load && (
        <SaveLoadModal 
          onClose={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_save_load', value: false } })}
          onLoad={(state: GameState) => dispatch({ type: 'LOAD_GAME', payload: state })}
          currentState={state}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* DoL Stats Sidebar - always visible */}
        <DoLStatsSidebar
          state={state}
          dispatch={dispatch}
          onOpenStats={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_stats', value: true } })}
          onOpenInventory={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_inventory', value: true } })}
        />

        {/* Left: Visuals */}
        <div className="flex-1 relative flex items-center justify-center p-12" onMouseMove={handleMouseMove}>
          {/* Background ambient image */}
          {state.ui.currentImage && (
            <motion.img 
              key={state.ui.currentImage + "-bg"}
              src={state.ui.currentImage} 
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen blur-3xl will-change-transform will-change-opacity"
              style={{ transform: 'translateZ(0)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 3 }}
            />
          )}

          {/* Weather Ambient Overlay */}
          {(() => {
            const w = state.world.weather;
            const isRain = w === 'Rainy' || w === 'Cold Rain' || w === 'Drizzle' || w === 'Thunderstorm';
            const isSnow = w === 'Blizzard' || w === 'Light Snow';
            const isFog = w === 'Foggy';
            const isWindy = w === 'Windy';
            if (!isRain && !isSnow && !isFog && !isWindy) return null;
            const count = isRain ? 40 : isSnow ? 25 : isFog ? 8 : 12;
            return (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
                {[...Array(count)].map((_, i) => (
                  <motion.div
                    key={`wx-${i}`}
                    className={
                      isRain ? 'absolute w-[1px] h-3 bg-blue-300/30 rounded-full' :
                      isSnow ? 'absolute w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px]' :
                      isFog ? 'absolute w-32 h-16 bg-white/[0.04] rounded-full blur-xl' :
                      'absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]'
                    }
                    initial={{
                      left: `${Math.random() * 100}%`,
                      y: -20 - Math.random() * 100,
                      opacity: isRain ? 0.3 : isSnow ? 0.5 : isFog ? 0.06 : 0.2,
                    }}
                    animate={{
                      y: [null, 600 + Math.random() * 200],
                      x: isSnow ? [null, Math.random() * 100 - 50] : isWindy ? [null, Math.random() * 200] : undefined,
                      opacity: isFog ? [0.03, 0.08, 0.03] : undefined,
                    }}
                    transition={{
                      duration: isRain ? 0.8 + Math.random() * 0.5 : isSnow ? 4 + Math.random() * 3 : isFog ? 8 + Math.random() * 5 : 2 + Math.random() * 2,
                      repeat: Infinity,
                      ease: isRain ? 'linear' : 'easeInOut',
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>
            );
          })()}

          {/* Ambient Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: Math.random() * 0.5 + 0.1
                }}
                animate={{ 
                  y: [null, Math.random() * -200 - 100],
                  x: [null, Math.random() * 100 - 50],
                  opacity: [null, 0]
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 10
                }}
              />
            ))}
          </div>
          
          {/* Hero Image Container */}
          <div className={`relative w-full max-w-2xl aspect-[4/3] rounded-sm overflow-hidden border border-white/10 shadow-2xl shadow-black/80 z-10 bg-[#0a0a0a] ${visualEffectClasses}`}>
            {state.ui.currentImage ? (
              <motion.img 
                key={state.ui.currentImage}
                src={state.ui.currentImage} 
                className="w-[110%] h-[110%] -left-[5%] -top-[5%] absolute object-cover will-change-transform"
                style={{ transform: 'translateZ(0)' }}
                animate={{ x: mousePos.x, y: mousePos.y }}
                transition={{ type: 'spring', stiffness: 40, damping: 30 }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            )}
            
            {/* Image Polling Overlay */}
            <AnimatePresence>
              {state.ui.isPollingImage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border border-white/10 border-t-white/60 rounded-full animate-spin mb-4" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Synthesizing Vision</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Location Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-2xl text-white/90">{state.world.current_location.name}</h2>
                  <p className="text-xs tracking-widest uppercase text-white/50 mt-2">{state.world.current_location.atmosphere}</p>
                  {/* Danger indicator */}
                  {state.world.current_location.danger > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className={`h-1.5 rounded-full ${state.world.current_location.danger > 60 ? 'bg-red-500 animate-pulse' : state.world.current_location.danger > 30 ? 'bg-amber-500' : 'bg-emerald-500/60'}`} style={{ width: `${Math.min(80, state.world.current_location.danger)}px` }} />
                      <span className={`text-[9px] uppercase tracking-widest ${state.world.current_location.danger > 60 ? 'text-red-400/80' : state.world.current_location.danger > 30 ? 'text-amber-400/60' : 'text-emerald-400/50'}`}>
                        {state.world.current_location.danger > 60 ? 'Dangerous' : state.world.current_location.danger > 30 ? 'Risky' : 'Safe'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase text-white/50">Day {state.world.day}</p>
                  <p className="font-serif text-xl text-white/80 mt-1">{state.world.hour}:00</p>
                  {/* Weather & Season Widget */}
                  <div className="flex items-center justify-end gap-2 mt-2">
                    {(() => {
                      const w = state.world.weather;
                      const iconClass = "w-3.5 h-3.5";
                      if (w === 'Blizzard' || w === 'Light Snow' || w === 'Freezing') return <Snowflake className={`${iconClass} text-cyan-300/80`} />;
                      if (w === 'Thunderstorm') return <CloudLightning className={`${iconClass} text-yellow-300/80`} />;
                      if (w === 'Rainy' || w === 'Cold Rain') return <CloudRain className={`${iconClass} text-blue-300/80`} />;
                      if (w === 'Drizzle') return <CloudDrizzle className={`${iconClass} text-blue-200/60`} />;
                      if (w === 'Foggy') return <CloudFog className={`${iconClass} text-gray-300/60`} />;
                      if (w === 'Scorching' || w === 'Hot') return <Flame className={`${iconClass} text-orange-400/80`} />;
                      if (w === 'Clear' || w === 'Sunny') return <Sun className={`${iconClass} text-yellow-300/80`} />;
                      if (w === 'Overcast' || w === 'Partly Cloudy') return <Cloud className={`${iconClass} text-gray-400/60`} />;
                      return <Cloud className={`${iconClass} text-white/40`} />;
                    })()}
                    <span className="text-[9px] text-white/50">{state.world.weather}</span>
                    {state.sim_world && (
                      <span className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                        state.sim_world.season === 'spring' ? 'text-green-400/70 border-green-900/40 bg-green-950/20' :
                        state.sim_world.season === 'summer' ? 'text-amber-400/70 border-amber-900/40 bg-amber-950/20' :
                        state.sim_world.season === 'autumn' ? 'text-orange-400/70 border-orange-900/40 bg-orange-950/20' :
                        'text-cyan-400/70 border-cyan-900/40 bg-cyan-950/20'
                      }`}>
                        {state.sim_world.season}
                      </span>
                    )}
                  </div>
                  {/* Low needs warnings */}
                  {(state.player.life_sim.needs.hunger <= 20 || state.player.life_sim.needs.thirst <= 15 || state.player.life_sim.needs.energy <= 20) && (
                    <div className="flex flex-col items-end gap-0.5 mt-2">
                      {state.player.life_sim.needs.hunger <= 20 && (
                        <span className="text-[8px] uppercase tracking-widest text-amber-400/90 animate-pulse">⚠ Starving</span>
                      )}
                      {state.player.life_sim.needs.thirst <= 15 && (
                        <span className="text-[8px] uppercase tracking-widest text-cyan-400/90 animate-pulse">⚠ Dehydrated</span>
                      )}
                      {state.player.life_sim.needs.energy <= 20 && (
                        <span className="text-[8px] uppercase tracking-widest text-yellow-400/90 animate-pulse">⚠ Exhausted</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative Panel */}
        <NarrativePanel
          state={state}
          handleAction={handleAction}
          customAction={customAction}
          setCustomAction={setCustomAction}
          NarrativeLog={NarrativeLog}
        />
      </main>

      {/* Horde Monitor UI */}
      <div className="h-8 border-t border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 z-30 font-mono text-[10px] text-white/50 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${state.ui.horde_monitor.active ? 'bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse' : 'bg-white/20'}`} />
            <span>Horde API: {state.ui.horde_monitor.active ? 'Active' : 'Idle'}</span>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
            <span>Text Req: <span className="text-white/80">{state.ui.horde_monitor.text_requests}</span></span>
            <div className="flex items-center gap-2">
              <span>ETA: <span className="text-white/80">{state.ui.horde_monitor.text_eta}s</span></span>
              {state.ui.horde_monitor.text_requests > 0 && state.ui.horde_monitor.text_initial_eta > 0 && (
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, 100 - (state.ui.horde_monitor.text_eta / state.ui.horde_monitor.text_initial_eta) * 100))}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
            <span>Img Req: <span className="text-white/80">{state.ui.horde_monitor.image_requests}</span></span>
            <div className="flex items-center gap-2">
              <span>ETA: <span className="text-white/80">{state.ui.horde_monitor.image_eta}s</span></span>
              {state.ui.horde_monitor.image_requests > 0 && state.ui.horde_monitor.image_initial_eta > 0 && (
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-pink-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, 100 - (state.ui.horde_monitor.image_eta / state.ui.horde_monitor.image_initial_eta) * 100))}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          <span>Gen Chance (Text): <span className="text-indigo-400">{state.ui.horde_monitor.text_generation_chance}%</span></span>
          <span>Gen Chance (Img): <span className="text-pink-400">{state.ui.horde_monitor.image_generation_chance}%</span></span>
        </div>
      </div>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatus && <StatusModal state={state} onClose={() => setShowStatus(false)} />}
      </AnimatePresence>

      {/* Memory Graph Modal */}
      <AnimatePresence>
        {showMemories && <MemoriesModal state={state} onClose={() => setShowMemories(false)} />}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && <MapModal state={state} onClose={() => setShowMap(false)} />}
      </AnimatePresence>

      {/* Developer Mode Modal */}
      <AnimatePresence>
        {showDeveloperMode && <DeveloperModeModal state={state} dispatch={dispatch} onClose={() => setShowDeveloperMode(false)} />}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {state.ui.show_quests && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-500 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{ 
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [null, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_quests', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Journal</h2>
              
              <div className="space-y-6">
                {(!state.player.quests || state.player.quests.length === 0) ? (
                  <p className="text-white/40 italic text-sm text-center py-8">Your journal is empty.</p>
                ) : (
                  state.player.quests.map((quest: any, index: number) => (
                    <motion.div 
                      key={quest.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-white/5 bg-white/[0.02] p-4 rounded-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif text-white/90">{quest.title}</h3>
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm border ${quest.status === 'active' ? 'text-yellow-400 border-yellow-900/50 bg-yellow-900/20' : quest.status === 'completed' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-900/20' : 'text-red-400 border-red-900/50 bg-red-900/20'}`}>
                          {quest.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{quest.description}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {state.ui.show_map && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-500 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{ 
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [null, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-4xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_map', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Cartography of Tamriel</h2>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 aspect-video bg-white/[0.02] border border-white/10 rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/map/1000/600')] bg-cover grayscale" />
                  
                  {/* Render Locations */}
                  {Object.values(LOCATIONS).map((loc: any) => {
                    const isCurrent = state.world.current_location.id === loc.id;
                    return (
                      <motion.button 
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        key={loc.id}
                        onClick={() => {
                          if (!isCurrent) {
                            handleAction(`Travel to ${loc.name}`, "travel");
                            dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_map', value: false } });
                          }
                        }}
                        className={`absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2 z-10 group ${!isCurrent ? 'cursor-pointer' : 'cursor-default'}`}
                        style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                      >
                        <div className={`w-3 h-3 rounded-full border border-black ${isCurrent ? 'bg-red-500 animate-pulse' : 'bg-white/60 group-hover:bg-white transition-colors'}`} />
                        <span className={`text-[10px] tracking-widest uppercase whitespace-nowrap bg-black/80 px-2 py-1 rounded-sm border ${isCurrent ? 'text-red-400 border-red-900/50' : 'text-white/60 border-white/10 group-hover:text-white group-hover:border-white/30'} transition-all`}>
                          {loc.name}
                        </span>
                      </motion.button>
                    );
                  })}

                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-white/[0.03]" />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">World State</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="text-[10px] uppercase text-white/30 block mb-1">Weather</span>
                      <span className="text-sm text-white/80 font-serif">{state.world.weather}</span>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="text-[10px] uppercase text-white/30 block mb-1">Local Tension</span>
                      <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          className="h-full bg-orange-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${state.world.local_tension * 100}%` }} 
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="text-[10px] uppercase text-white/30 block mb-1">Active Events</span>
                      <div className="flex flex-col gap-2 mt-2">
                        {state.world.active_world_events.length > 0 ? state.world.active_world_events.map(e => (
                          <span key={e} className="text-[10px] text-white/60 border-l border-white/20 pl-2">{e}</span>
                        )) : <span className="text-[10px] text-white/20 italic">No significant events</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combat Animation Overlay */}
      <AnimatePresence>
        {state.ui.combat_animation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1.5, rotate: 0 }}
            exit={{ opacity: 0, scale: 2, rotate: 20 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              {state.ui.combat_animation === 'attack' && (
                <div className="w-96 h-4 bg-gradient-to-r from-transparent via-red-500 to-transparent blur-md rotate-45" />
              )}
              {state.ui.combat_animation === 'special_attack' && (
                <div className="w-96 h-8 bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-xl rotate-45 animate-pulse" />
              )}
              {state.ui.combat_animation === 'dodge' && (
                <div className="w-64 h-64 border-4 border-white/30 rounded-full animate-ping" />
              )}
              {state.ui.combat_animation === 'spellcast' && (
                <div className="w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
              )}
              {state.ui.combat_animation === 'lust_action' && (
                <div className="w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
              )}
              {state.ui.combat_animation === 'parry' && (
                <div className="w-32 h-32 border-8 border-yellow-500 rounded-full animate-ping" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* X-Ray Modal */}
      <AnimatePresence>
        {state.ui.show_xray && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full relative"
            >
              <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_xray', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white z-10"><X className="w-6 h-6" /></button>
              <XRayView anatomy={state.player.anatomy} highlightedPart={state.ui.highlighted_part || undefined} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
            {/* Stats Modal */}
      <AnimatePresence>
        {state.ui.show_stats && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-indigo-500 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{ 
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [null, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_stats', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Character Essence</h2>
              
              <div className="grid grid-cols-2 gap-8">
                <CharacterModel anatomy={state.player.anatomy} isPlayer={true} />
                <div className="space-y-6">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Vitals</h3>
                  {['health', 'stamina', 'willpower', 'purity'].map((key) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-[10px] tracking-widest uppercase">
                        <span className="text-white/60">{key}</span>
                        <span className="text-white/90">{Math.round(state.player.stats[key as StatKey])}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${(state.player.stats[key as StatKey] / (state.player.stats[`max_${key}` as StatKey] || 100)) * 100}%` }}
                          className={`h-full ${key === 'health' ? 'bg-red-500' : key === 'stamina' ? 'bg-green-500' : key === 'willpower' ? 'bg-blue-500' : 'bg-white'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-2">Corruption & Desire</h3>
                  {['lust', 'arousal', 'corruption', 'trauma', 'stress', 'pain'].map((key) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-[10px] tracking-widest uppercase">
                        <span className="text-white/60">{key}</span>
                        <span className="text-white/90">{Math.round(state.player.stats[key as StatKey])}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${state.player.stats[key as StatKey]}%` }}
                          className={`h-full ${key === 'lust' || key === 'arousal' ? 'bg-pink-500' : key === 'corruption' ? 'bg-purple-600' : 'bg-orange-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Skills</h3>
                  <div className="space-y-4">
                    {Object.entries(state.player.skills).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50 capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-white/90">{value as number}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${Math.min(100, value as number)}%` }}
                            className="h-full bg-indigo-500/50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Psychological Profile</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Submission</span>
                        <span className="text-white/90">{state.player.psych_profile.submission_index}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${state.player.psych_profile.submission_index}%` }} className="h-full bg-purple-500/50" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Cruelty</span>
                        <span className="text-white/90">{state.player.psych_profile.cruelty_index}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${state.player.psych_profile.cruelty_index}%` }} className="h-full bg-red-500/50" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Exhibitionism</span>
                        <span className="text-white/90">{state.player.psych_profile.exhibitionism}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${state.player.psych_profile.exhibitionism}%` }} className="h-full bg-pink-500/50" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Afflictions</h3>
                  <div className="flex flex-wrap gap-2">
                    {state.player.afflictions.length > 0 ? state.player.afflictions.map(a => (
                      <span key={a} className="px-2 py-1 bg-red-900/20 border border-red-500/30 text-[10px] text-red-400 uppercase tracking-tighter">{a}</span>
                    )) : <span className="text-xs text-white/30 italic">None</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Active Synergies</h3>
                  <div className="flex flex-col gap-2">
                    {getSynergies(state.player.skills).length > 0 ? getSynergies(state.player.skills).map(s => (
                      <div key={s.name} className="p-2 bg-emerald-900/10 border border-emerald-500/20 rounded">
                        <div className="text-[10px] text-emerald-400 uppercase tracking-tighter font-bold">{s.name}</div>
                        <div className="text-[10px] text-white/50">{s.description}</div>
                      </div>
                    )) : <span className="text-xs text-white/30 italic">None</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Biology & Condition</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-white/50">Cycle Day</span>
                      <span className="text-white/90">{state.player.biology.cycle_day}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-white/50">Heat/Rut Active</span>
                      <span className={state.player.biology.heat_rut_active ? "text-pink-400" : "text-white/90"}>{state.player.biology.heat_rut_active ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-white/50">Sterility</span>
                      <span className={state.player.biology.sterility ? "text-red-400" : "text-white/90"}>{state.player.biology.sterility ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-white/50">Exhaustion Multiplier</span>
                      <span className="text-white/90">{state.player.biology.exhaustion_multiplier.toFixed(2)}x</span>
                    </div>
                    {state.player.biology.post_partum_debuff > 0 && (
                      <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                        <span className="text-white/50">Post-Partum Debuff</span>
                        <span className="text-red-400">{state.player.biology.post_partum_debuff} days</span>
                      </div>
                    )}
                    {state.player.biology.parasites.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase text-white/40 block mb-1">Parasites</span>
                        <div className="flex flex-wrap gap-1">
                          {state.player.biology.parasites.map((p, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-sm">{p.type}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {state.player.biology.incubations.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase text-white/40 block mb-1">Incubations</span>
                        <div className="flex flex-wrap gap-1">
                          {state.player.biology.incubations.map((inc, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-purple-900/20 border border-purple-500/30 text-purple-400 rounded-sm">{inc.type} ({inc.progress}%)</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Modal */}
      <AnimatePresence>
        {state.ui.show_inventory && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-500 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{ 
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [null, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-4xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_inventory', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-serif text-white/90 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">Possessions</h2>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Backpack</h3>
                  <div className="flex flex-col gap-2">
                    {state.player.inventory.map((item, index) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedItem(item)}
                        className={`p-3 border ${item.is_equipped ? 'border-white/40 bg-white/5' : 'border-white/10 bg-black'} rounded-sm transition-all hover:border-white/30 group relative flex flex-col cursor-pointer`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-serif text-white/90">{item.name}</span>
                            <span className={`text-[8px] px-1 border uppercase rounded-sm ${item.rarity === 'common' ? 'border-white/20 text-white/40' : item.rarity === 'mythic' ? 'border-red-500 text-red-500' : 'border-purple-500 text-purple-500'}`}>{item.rarity}</span>
                          </div>
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">{item.type} {item.slot ? `(${item.slot})` : ''}</span>
                        </div>
                        <p className="text-[10px] text-white/40 mb-2 line-clamp-1 group-hover:line-clamp-none transition-all">{item.description}</p>
                        
                        <div className="flex justify-between items-end mt-auto pt-2">
                          <div className="flex flex-wrap gap-1">
                            {item.stats && Object.entries(item.stats).map(([stat, val]) => (
                              <span key={stat} className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 border rounded-sm ${(val as number) > 0 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' : 'text-red-400 border-red-900/50 bg-red-950/30'}`}>
                                {stat}: {(val as number) > 0 ? '+' : ''}{val as number}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.integrity !== undefined && (
                              <div className="flex items-center gap-1 mr-2">
                                <span className="text-[8px] text-white/30 uppercase">INT</span>
                                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-white/40" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.integrity}%` }} 
                                  />
                                </div>
                              </div>
                            )}
                            {item.type === 'consumable' ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'USE_ITEM', payload: { itemId: item.id } }); }}
                                className="text-[10px] border border-emerald-500/30 bg-emerald-900/20 px-3 py-1 hover:bg-emerald-900/40 uppercase tracking-widest text-emerald-400 transition-colors"
                              >
                                Consume
                              </motion.button>
                            ) : ['weapon', 'armor', 'clothing'].includes(item.type) ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: item.is_equipped ? 'UNEQUIP_ITEM' : 'EQUIP_ITEM', payload: { itemId: item.id, slot: item.slot } }); }}
                                className={`text-[10px] border px-3 py-1 uppercase tracking-widest transition-colors ${item.is_equipped ? 'border-white/40 bg-white/10 hover:bg-white/20 text-white' : 'border-white/20 hover:bg-white/10 text-white/60'}`}
                              >
                                {item.is_equipped ? 'Unequip' : 'Equip'}
                              </motion.button>
                            ) : item.special_effect ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'INTERACT_ITEM', payload: { itemId: item.id } }); }}
                                className="text-[10px] border border-purple-500/30 bg-purple-900/20 px-3 py-1 hover:bg-purple-900/40 uppercase tracking-widest text-purple-400 transition-colors"
                              >
                                Interact
                              </motion.button>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Equipped Layers</h3>
                  <div className="space-y-2">
                    {['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'].map(slot => {
                      const equipped = state.player.inventory.find(i => i.slot === slot && i.is_equipped);
                      return (
                        <div 
                          key={slot} 
                          onClick={() => equipped && setSelectedItem(equipped)}
                          className={`flex justify-between items-center p-3 border border-white/5 bg-white/[0.02] rounded-sm transition-colors ${equipped ? 'cursor-pointer hover:bg-white/5' : ''}`}
                        >
                          <span className="text-[10px] uppercase text-white/30 tracking-tighter">{slot}</span>
                          <span className="text-xs text-white/70 font-serif">{equipped ? equipped.name : <span className="text-white/20 italic">Empty</span>}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-500 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{ 
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [null, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-amber-900/30 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
              
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-serif text-amber-500/90 tracking-widest uppercase">{selectedItem.name}</h2>
                <span className={`text-[10px] px-2 py-1 border uppercase rounded-sm ${selectedItem.rarity === 'common' ? 'border-white/20 text-white/40' : selectedItem.rarity === 'mythic' ? 'border-red-500 text-red-500' : 'border-purple-500 text-purple-500'}`}>{selectedItem.rarity}</span>
              </div>
              
              <div className="space-y-6">
                <div className="text-sm text-white/60 italic border-l-2 border-white/10 pl-4 py-2">
                  {selectedItem.description}
                </div>
                
                {selectedItem.lore && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-white/80 font-serif leading-relaxed text-lg">
                      {selectedItem.lore}
                    </p>
                  </div>
                )}

                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedItem.stats).map(([stat, val]) => (
                      <span key={stat} className={`text-xs uppercase tracking-widest px-2 py-1 border rounded-sm ${(val as number) > 0 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' : 'text-red-400 border-red-900/50 bg-red-950/30'}`}>
                        {stat}: {(val as number) > 0 ? '+' : ''}{val as number}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Type: {selectedItem.type}</span>
                  {selectedItem.slot && <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Slot: {selectedItem.slot}</span>}
                  <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Weight: {selectedItem.weight}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">Value: {selectedItem.value}</span>
                </div>

                <div className="flex gap-3 pt-6 border-t border-white/10">
                  {selectedItem.type === 'consumable' && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        dispatch({ type: 'USE_ITEM', payload: { itemId: selectedItem.id } });
                        setSelectedItem(null);
                      }}
                      className="flex-1 border border-emerald-900/50 bg-emerald-950/10 text-emerald-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                    >
                      Use
                    </motion.button>
                  )}

                  {selectedItem.type !== 'consumable' && selectedItem.special_effect && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(167, 139, 250, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        dispatch({ type: 'INTERACT_ITEM', payload: { itemId: selectedItem.id } });
                        setSelectedItem(null);
                      }}
                      className="flex-1 border border-purple-900/50 bg-purple-950/10 text-purple-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                    >
                      Interact
                    </motion.button>
                  )}
                  
                  {['weapon', 'armor', 'clothing'].includes(selectedItem.type) && selectedItem.slot && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (selectedItem.is_equipped) {
                          dispatch({ type: 'UNEQUIP_ITEM', payload: { itemId: selectedItem.id } });
                        } else {
                          dispatch({ type: 'EQUIP_ITEM', payload: { itemId: selectedItem.id, slot: selectedItem.slot } });
                        }
                        setSelectedItem(null);
                      }}
                      className="flex-1 border border-blue-900/50 bg-blue-950/10 text-blue-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                    >
                      {selectedItem.is_equipped ? 'Unequip' : 'Equip'}
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      dispatch({ type: 'DROP_ITEM', payload: { itemId: selectedItem.id } });
                      setSelectedItem(null);
                    }}
                    className="flex-1 border border-red-900/50 bg-red-950/10 text-red-400 p-3 rounded-sm tracking-widest uppercase text-xs transition-colors"
                  >
                    Drop
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            state={state}
            dispatch={dispatch}
            onClose={() => setShowSettings(false)}
            availableTextModels={availableTextModels}
            availableImageModels={availableImageModels}
            isLoadingModels={isLoadingModels}
            setShowDeveloperMode={setShowDeveloperMode}
            toggleFullscreen={toggleFullscreen}
          />
        )}
      </AnimatePresence>

      {/* Companion Roster Modal */}
      <AnimatePresence>
        {showCompanions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-500 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{ 
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [null, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[80vh] z-10"
            >
              <button 
                onClick={() => setShowCompanions(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
                Companion Roster
              </h2>
              
              {state.player.companions.active_party.length === 0 && state.player.companions.roster.length === 0 ? (
                <p className="text-white/50 italic">You travel alone. No souls share your burden.</p>
              ) : (
                <div className="space-y-6">
                  {state.player.companions.active_party.length > 0 && (
                    <div>
                      <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4 border-b border-white/10 pb-2">Active Party</h3>
                      {state.player.companions.active_party.map(c => (
                        <div key={c.id} className="bg-white/5 p-4 rounded-sm border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-serif">{c.name}</span>
                            <span className="text-xs text-white/50 uppercase tracking-widest">{c.type}</span>
                          </div>
                          <div className="flex gap-4 text-xs">
                            <div className="flex-1">
                              <span className="text-white/40 block mb-1">Affection</span>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-pink-500/50" 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${c.affection}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="text-white/40 block mb-1">Fear</span>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-purple-500/50" 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${c.fear}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}
