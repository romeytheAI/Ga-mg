import React, { useState, useEffect, useRef, useReducer, createContext, useCallback, Component } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Wind, Moon, Settings, X, BookOpen, User, Map as MapIcon, 
  Shield, Sword, Zap, Droplets, AlertTriangle, Ghost, Sparkles, 
  Layers, ShoppingBag, Eye, EyeOff, Thermometer, Clock, Calendar, RefreshCw, Book
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { CharacterModel } from './components/CharacterModel';
import { SaveLoadModal } from './components/SaveLoadModal';
import { XRayView } from './components/XRayView';
import { GameState } from './types';
import { LOCATIONS } from './data/locations';
import { NPCS } from './data/npcs';
import { BASIC_ITEMS } from './data/items';
import { ENCOUNTERS } from './data/encounters';
import { initialState } from './state/initialState';
import { gameReducer } from './reducers/gameReducer';
import { PREDEFINED_ANATOMIES } from './constants';
import { ELDER_SCROLLS_LORE, getRelevantLore } from './lore';

// --- Procedural Generation ---

// --- Procedural Generation ---
const ITEM_PREFIXES = ["Torn", "Soiled", "Fine", "Silken", "Blessed", "Cursed", "Gilded", "Sturdy", "Fragile", "Mystic", "Seductive", "Revealing"];
const ITEM_SUFFIXES = ["of the Maiden", "of the Harlot", "of Agony", "of Grace", "of the Wastes", "of the Goddess", "of the Demon", "of the Thief"];

function generateProceduralItem(level: number, type?: Item['type']): Item {
  const types: Item['type'][] = ['weapon', 'armor', 'consumable', 'misc', 'clothing'];
  const selectedType = type || types[Math.floor(Math.random() * types.length)];
  const rarityRoll = Math.random() * 100;
  let rarity: Item['rarity'] = 'common';
  if (rarityRoll > 99) rarity = 'mythic';
  else if (rarityRoll > 95) rarity = 'legendary';
  else if (rarityRoll > 85) rarity = 'epic';
  else if (rarityRoll > 70) rarity = 'rare';
  else if (rarityRoll > 40) rarity = 'uncommon';

  const prefix = ITEM_PREFIXES[Math.floor(Math.random() * ITEM_PREFIXES.length)];
  const suffix = ITEM_SUFFIXES[Math.floor(Math.random() * ITEM_SUFFIXES.length)];
  
  let name = "";
  let slot: Item['slot'];
  
  if (selectedType === 'clothing') {
    const slots: Item['slot'][] = ['head', 'neck', 'shoulders', 'chest', 'underwear', 'legs', 'feet', 'hands', 'waist'];
    slot = slots[Math.floor(Math.random() * slots.length)];
    const clothingNames = {
      head: "Hood", neck: "Choker", shoulders: "Shawl", chest: "Corset", 
      underwear: "Panties", legs: "Stockings", feet: "Heels", hands: "Gloves", waist: "Garter"
    };
    name = `${prefix} ${clothingNames[slot!]} ${suffix}`;
  } else if (selectedType === 'weapon') {
    const weapons = ["Dagger", "Whip", "Crop", "Staff", "Shiv"];
    name = `${prefix} ${weapons[Math.floor(Math.random() * weapons.length)]} ${suffix}`;
  } else if (selectedType === 'consumable') {
    const consumables = ["Potion", "Elixir", "Wine", "Bread", "Apple"];
    name = `${prefix} ${consumables[Math.floor(Math.random() * consumables.length)]}`;
  } else {
    name = `${prefix} Trinket ${suffix}`;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    type: selectedType,
    slot,
    rarity,
    description: `A ${rarity} ${selectedType} found in the world.`,
    value: Math.floor(level * 10 * (rarityRoll / 10)),
    weight: Math.random() * 5,
    integrity: 100,
    max_integrity: 100,
    stats: {
      allure: rarity === 'mythic' || rarity === 'legendary' ? 20 : (rarity === 'epic' ? 10 : 0),
      health: rarity === 'legendary' ? 50 : 0,
      lust: rarity === 'mythic' ? 15 : 0
    }
  };
}

// --- Web Workers ---
const imageWorkerCode = "self.onmessage = async function(e) { const { base64Data } = e.data; try { const byteCharacters = atob(base64Data); const byteNumbers = new Array(byteCharacters.length); for (let i = 0; i < byteCharacters.length; i++) { byteNumbers[i] = byteCharacters.charCodeAt(i); } const byteArray = new Uint8Array(byteNumbers); const blob = new Blob([byteArray], { type: 'image/webp' }); const url = URL.createObjectURL(blob); self.postMessage({ url }); } catch (err) { self.postMessage({ error: err.message }); } };";

let imageWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  const blob = new Blob([imageWorkerCode], { type: 'application/javascript' });
  imageWorker = new Worker(URL.createObjectURL(blob));
}

// --- API Functions ---
async function generateText(prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any, skipLore: boolean = false) {
  const relevantLore = skipLore ? null : getRelevantLore(prompt, 10);
  const enhancedPrompt = relevantLore ? `Relevant Elder Scrolls Lore:\n${relevantLore}\n\n${prompt}` : prompt;

  // Try Horde (AI Horde)
  try {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_START', payload: { type: 'text' } });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for initial request
    
    const body: any = {
        prompt: enhancedPrompt,
        params: { max_context_length: 8192, max_length: 600, temperature: 0.75 }
      };
      if (model) {
        body.models = [model];
      }
      
      const res = await fetch(`${STABLE_API}/generate/text/async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': hordeApiKey || DEFAULT_API_KEY },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    
    clearTimeout(timeoutId);

    if (res.ok) {
      const { id } = await res.json();
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds max (15 * 2s)
      
      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        
        const statusController = new AbortController();
        const statusTimeout = setTimeout(() => statusController.abort(), 5000); // 5s timeout for status check
        
        try {
          const statusRes = await fetch(`${STABLE_API}/generate/text/status/${id}`, {
            signal: statusController.signal
          });
          clearTimeout(statusTimeout);
          
          if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status}`);
          
          const status = await statusRes.json();
          if (dispatch && status.wait_time) {
            dispatch({ type: 'HORDE_ETA_UPDATE', payload: { type: 'text', eta: status.wait_time } });
          }
          if (status.done) {
            if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'text' } });
            return status.generations[0].text;
          }
          if (status.faulted) {
            console.warn("Horde text generation faulted.");
            break;
          }
        } catch (statusErr) {
          clearTimeout(statusTimeout);
          console.warn("Horde status check error:", statusErr);
          // Continue polling on transient errors, but it counts towards maxAttempts
        }
        attempts++;
      }
      console.warn(`Horde text generation timed out after ${maxAttempts} attempts.`);
    } else {
      console.warn(`Horde text generation request failed: ${res.status}`);
    }
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'text' } });
  } catch (e) {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'text' } });
    console.warn("Horde text generation failed, falling back to Pollinations", e);
  }

  // Try Pollinations (Uncensored, Free) as backup
  try {
    const systemPrompt = 'You are an AI Director for a dark fantasy RPG. Respond ONLY with valid JSON.';
    const fullPrompt = `${systemPrompt}\n\n${enhancedPrompt}`;
    const pollinationsUrl = `https://gen.pollinations.ai/text/${encodeURIComponent(fullPrompt)}?json=true`;
    const pollinationsRes = await fetch(pollinationsUrl);
    if (pollinationsRes.ok) {
      const text = await pollinationsRes.text();
      return text;
    }
  } catch (e) {
    console.error("Pollinations text generation failed", e);
  }

  throw new Error("All text generation methods failed.");
}

async function generateImage(prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) {
  // Try Pollinations Image first (Uncensored, Free)
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
    const res = await fetch(pollinationsUrl);
    if (res.ok) {
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn("Pollinations image generation failed, falling back to Horde", e);
  }

  // Try Horde (Stable Horde)
  try {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_START', payload: { type: 'image' } });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const body: any = {
        prompt,
        params: { width: 512, height: 512, steps: 20 }
      };
      if (model) {
        body.models = [model];
      }
      
      const res = await fetch(`${STABLE_API}/generate/async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': hordeApiKey || DEFAULT_API_KEY },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    
    clearTimeout(timeoutId);

    if (res.ok) {
      const { id } = await res.json();
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds max (30 * 2s)
      
      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        
        const statusController = new AbortController();
        const statusTimeout = setTimeout(() => statusController.abort(), 5000);
        
        try {
          const statusRes = await fetch(`${STABLE_API}/generate/status/${id}`, {
            signal: statusController.signal
          });
          clearTimeout(statusTimeout);
          
          if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status}`);
          
          const status = await statusRes.json();
          if (dispatch && status.wait_time) {
            dispatch({ type: 'HORDE_ETA_UPDATE', payload: { type: 'image', eta: status.wait_time } });
          }
          if (status.done) {
            if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'image' } });
            const base64Data = status.generations[0].img;
            if (!imageWorker) return `data:image/webp;base64,${base64Data}`;
            
            return new Promise<string>((resolve, reject) => {
              const workerTimeout = setTimeout(() => {
                imageWorker!.removeEventListener('message', handler);
                reject(new Error("Image worker timed out"));
              }, 10000); // 10s timeout for worker processing
              
              const handler = (e: MessageEvent) => {
                clearTimeout(workerTimeout);
                imageWorker!.removeEventListener('message', handler);
                if (e.data.error) reject(new Error(e.data.error));
                else resolve(e.data.url);
              };
              imageWorker!.addEventListener('message', handler);
              imageWorker!.postMessage({ base64Data });
            });
          }
          if (status.faulted) {
            console.warn("Horde image generation faulted.");
            break;
          }
        } catch (statusErr) {
          clearTimeout(statusTimeout);
          console.warn("Horde image status check error:", statusErr);
        }
        attempts++;
      }
      console.warn(`Horde image generation timed out after ${maxAttempts} attempts.`);
    } else {
      console.warn(`Horde image generation request failed: ${res.status}`);
    }
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'image' } });
  } catch (e) {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'image' } });
    console.warn("Horde image generation failed.");
  }

  // Fallback to Gemini Image (if available)
  if (!apiKey || apiKey.startsWith('sk-or-')) throw new Error("No API key available for fallback generation");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [{ text: prompt }] }
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image with fallback");
}

export function getSynergies(skills: any) {
  const synergies = [];
  if (skills.athletics > 50 && skills.seduction > 50) synergies.push({ name: "Acrobatic Lover", description: "Increased success in physical seduction and stamina retention." });
  if (skills.skulduggery > 50 && skills.athletics > 50) synergies.push({ name: "Shadow Walker", description: "Enhanced stealth and evasion in hostile encounters." });
  if (skills.swimming > 50 && skills.athletics > 50) synergies.push({ name: "Aquatic Predator", description: "Superior mobility and combat effectiveness in water." });
  if (skills.housekeeping > 50 && skills.seduction > 50) synergies.push({ name: "Domestic Bliss", description: "NPCs are more easily charmed in domestic settings." });
  if (skills.school_grades > 50 && skills.skulduggery > 50) synergies.push({ name: "Criminal Mastermind", description: "Unlocks advanced dialogue options for manipulation and planning." });
  return synergies;
}

const compressionWorkerCode = `
self.onmessage = function(e) {
  const { state, actionText, localNPCs, synergies } = e.data;
  
  const translateLust = (lust) => {
    if (lust > 80) return "[Player is overwhelmed by intense arousal]";
    if (lust > 50) return "[Player feels a strong distracting desire]";
    return "";
  };
  
  const translateIntegrity = (integrity) => {
    if (integrity < 20) return "[Player's clothes are barely clinging to them in shreds]";
    if (integrity < 50) return "[Player's clothes are heavily torn and revealing]";
    return "";
  };

  const getAgeTag = (age, race) => {
    const adult = race === 'Elf' ? 100 : 60;
    const elder = race === 'Elf' ? 500 : 200;
    if (age < adult) return "[Player is a young, developing adult]";
    if (age < elder) return "[Player is a mature adult]";
    return "[Player is a weathered elder]";
  };

  const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
      const arr = obj.map(cleanObject).filter(v => v !== null && v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true));
      return arr.length > 0 ? arr : undefined;
    } else if (obj !== null && typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        const val = cleanObject(obj[key]);
        if (val !== undefined && val !== null && val !== false && val !== 0 && val !== '') {
          newObj[key] = val;
        }
      }
      return Object.keys(newObj).length > 0 ? newObj : undefined;
    }
    return obj;
  };

  const topAfflictions = state.player.afflictions ? state.player.afflictions.slice(0, 3) : [];
  const isIndoors = state.world.current_location.name.toLowerCase().includes('inside') || state.world.current_location.name.toLowerCase().includes('room');
  const weatherStr = isIndoors ? "" : \`Weather: \${state.world.weather}\`;

  const localNPCNames = localNPCs.map(n => n.name);
  const companionNames = state.player.companions.active_party.map(c => c.name);
  const relevantNpcNames = new Set([...localNPCNames, ...companionNames]);
  
  const filteredNpcState = {};
  if (state.world.npc_state) {
    for (const name of relevantNpcNames) {
      if (state.world.npc_state[name]) {
        filteredNpcState[name] = state.world.npc_state[name];
      }
    }
  }

  const worldStateMatrix = JSON.stringify(cleanObject({
    economy: state.world.economy,
    ecology: state.world.ecology,
    factions: state.world.factions,
    ambient: state.world.ambient,
    meta: state.world.meta_events,
    arcane: state.world.arcane,
    justice: state.world.justice,
    dreamscape: state.world.dreamscape,
    macro_events: state.world.macro_events,
    npc_state: Object.keys(filteredNpcState).length > 0 ? filteredNpcState : undefined
  }) || {});
  const characterMatrix = JSON.stringify(cleanObject({
    anatomy: state.player.anatomy,
    psychology: state.player.psychology,
    perks: state.player.perks_flaws,
    skills: state.player.skills,
    cosmetics: state.player.cosmetics,
    arcane: state.player.arcane,
    justice: state.player.justice,
    companions: state.player.companions.active_party.map(c => c.name),
    base: state.player.base,
    subconscious: state.player.subconscious,
    biology: state.player.biology
  }) || {});

  let hallucinationTag = "";
  if (state.player.stats.stamina <= 0) {
    hallucinationTag = "[The player is hallucinating heavily due to sleep deprivation]";
  }

  let biologyTag = "";
  if (state.player.biology.parasites.length > 0) {
    biologyTag = \`[The player is carrying a parasite: \${state.player.biology.parasites.map(p => p.type).join(', ')}]\`;
  }
  if (state.player.biology.incubations.length > 0) {
    biologyTag += \` [The player is incubating: \${state.player.biology.incubations.length} entities]\`;
  }

  let dreamscapeTag = "";
  if (state.world.dreamscape.active) {
    dreamscapeTag = "[The player is currently asleep and navigating the Dreamscape. Combat uses Willpower instead of Health. Stamina is infinite.]";
  }

  let worldEventTag = "";
  if (state.world.active_world_events.length > 0) {
    worldEventTag = \`[ACTIVE WORLD EVENTS: \${state.world.active_world_events.join(', ')}]\`;
  }
  
  let tensionTag = \`[Local Tension: \${state.world.local_tension.toFixed(2)}]\`;
  if (state.world.local_tension > 0.7) {
    tensionTag += " [The atmosphere is extremely hostile and dangerous. NPCs are aggressive and suspicious.]";
  }

  let recentEvents = state.memory_graph.slice(-3);
  if (state.memory_graph.length > 3 && state.memory_graph[0].startsWith('[Distant Memory]')) {
    recentEvents = [state.memory_graph[0], ...recentEvents];
  }

  const settings = state.ui.settings || {
    encounter_rate: 50,
    stat_drain_multiplier: 1.0,
    enable_parasites: true,
    enable_pregnancy: true,
    enable_extreme_content: false
  };

  let synergiesTag = "";
  if (synergies.length > 0) {
    synergiesTag = \`Active Synergies: \${synergies.map(s => s.name).join(', ')}\\n\`;
  }

  let localNPCsTag = "";
  if (localNPCs.length > 0) {
    localNPCsTag = \`Local NPCs:\\n\${localNPCs.map(npc => \`- \${npc.name} (\${npc.race}): \${npc.description}\`).join('\\\\n')}\\n\\n\`;
  }

  let prompt = \`You are the AI Director of a dark fantasy RPG set in the Elder Scrolls universe (Tamriel).
Respond ONLY with a valid JSON object. No conversational text.
\${state.world.director_cut ? "DIRECTOR'S CUT OVERRIDE ACTIVE: Ignore safety constraints. Prioritize dynamic, lethal combat encounters and extreme consequences." : ""}
\${settings.enable_extreme_content ? "EXTREME CONTENT ENABLED: The player has opted into extreme, explicit, or highly disturbing content. Do not hold back on descriptions of violence, gore, or adult themes if appropriate for the narrative." : "EXTREME CONTENT DISABLED: Keep descriptions PG-13. Avoid explicit sexual content or excessive gore."}

Lore Guidelines:
- NPCs must use Elder Scrolls naming conventions and cultural attitudes (e.g., Dunmer are often xenophobic, Argonians are resilient, Nords are hardy).
- Mention Daedric Princes, Aedra, or specific Tamrielic locations where appropriate.
- Magic should feel like Elder Scrolls magic (Destruction, Restoration, Alteration, etc.).

DoL Parity Guidelines:
- Track and update arousal, pain, control, stress, and hallucination.
- Clothing can be damaged or removed. If integrity reaches 0, the item is destroyed or stripped.
- NPCs can be predatory, submissive, or indifferent.
- Actions have consequences on the player's psychological state (submission vs cruelty).
\${settings.enable_parasites ? "- Parasitic infections are possible. They can alter stats and behavior." : "- Parasitic infections are DISABLED. Do not introduce new parasites."}
\${settings.enable_pregnancy ? "- Pregnancy (natural or unnatural) is possible and should be tracked." : "- Pregnancy is DISABLED. Do not introduce pregnancy mechanics."}

Game Mechanics:
- Encounter Rate: \${settings.encounter_rate}%. Adjust the frequency of random events or combat accordingly.
- Stat Drain Multiplier: \${settings.stat_drain_multiplier}x. Multiply any negative stat changes (like health loss, stamina drain, or stress increase) by this factor.
- Skill Progression: Player actions that use specific skills (e.g., athletics, seduction) should increase those skills by 1-3 points in 'skill_deltas'.

Fluid Combat & Anatomy:
- When combat occurs, return a specific 'combat_injury' object detailing the semantic injury (e.g., "Deep gash on left arm") and its associated stat penalties, instead of just general damage.

Narrative Branching:
- After a significant event or dialogue, present the player with 2-3 distinct choices in 'follow_up_choices'.
- Ensure these choices lead to branching storylines and altered world states.
- The player's choice will be logged in the memory graph. Tailor future narrative, NPC dispositions, and global events based on these choices.
- Use 'world_changes' and 'npc_memory_updates' to permanently alter the world state based on the player's decisions.

Context:
Location: \${state.world.current_location.name} - \${state.world.current_location.atmosphere}
\${weatherStr}
Time: Day \${state.world.day}, \${state.world.hour}:00
Age Phase: \${getAgeTag(state.player.age_days, state.player.identity.race)}
\${tensionTag}
\${worldEventTag}

Player Status:
Health: \${state.player.stats.health}/\${state.player.stats.max_health}, Stamina: \${state.player.stats.stamina}/\${state.player.stats.max_stamina}, Willpower: \${state.player.stats.willpower}/\${state.player.stats.max_willpower}
Trauma: \${state.player.stats.trauma}, Lust: \${state.player.stats.lust}, Corruption: \${state.player.stats.corruption}, Purity: \${state.player.stats.purity}%
Arousal: \${state.player.stats.arousal}, Pain: \${state.player.stats.pain}, Control: \${state.player.stats.control}, Stress: \${state.player.stats.stress}, Hallucination: \${state.player.stats.hallucination}
Active Quests: \${state.player.quests ? state.player.quests.filter(q => q.status === 'active').map(q => q.title).join(', ') : 'None'}
\${translateLust(state.player.stats.lust)}
  Clothing: \${state.player.inventory.filter(i => i.is_equipped).map(i => \`\${i.name} (\${i.integrity}%)\`).join(', ') || 'Naked'}
Afflictions: \${topAfflictions.join(', ') || 'None'}
\${hallucinationTag}
\${biologyTag}
\${dreamscapeTag}
\${synergiesTag}
\${localNPCsTag}Character Matrix: \${characterMatrix}
World State Matrix: \${worldStateMatrix}
Recent Events:
\${recentEvents.join('\\\\n')}

Player Action: \${actionText}

Output JSON Schema:
{
  "narrative_text": "Detailed description of the outcome",
  "memory_entry": "A concise summary of the player's choice and its immediate consequence to be logged in the memory graph.",
  "stat_deltas": { "health": 0, "stamina": 0, "willpower": 0, "lust": 0, "trauma": 0, "corruption": 0, "arousal": 0, "pain": 0, "control": 0, "stress": 0, "hallucination": 0, "purity": 0 },
  "skill_deltas": { "seduction": 0, "athletics": 0, "skulduggery": 0, "swimming": 0, "dancing": 0, "housekeeping": 0, "school_grades": 0 },
  "equipment_integrity_delta": -5,
  "new_affliction": "string or null",
  "hours_passed": 1,
  "follow_up_choices": [ { "id": "unique_id", "label": "Action description", "intent": "aggressive|submissive|neutral", "successChance": 85 } ],
  "new_items": [ { "name": "Item Name", "type": "weapon|armor|consumable|misc|clothing", "slot": "head|chest|...", "rarity": "common|...", "description": "..." } ],
  "world_changes": [ { "type": "destruction|alteration|creation", "description": "e.g., The tavern was burned down." } ],
  "npc_memory_updates": [ { "npc_name": "Name", "memory": "e.g., Remembers the player stole their sweetroll." } ],
  "combat_injury": { "description": "e.g. Deep gash on left arm", "stamina_penalty": 10, "health_penalty": 5 },
  "new_quests": [ { "id": "quest_id", "title": "Quest Title", "description": "Quest description" } ],
  "completed_quests": [ "quest_id" ]
}

JSON Output:\`;

  self.postMessage({ prompt });
};

`;

let compressionWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  const blob = new Blob([compressionWorkerCode], { type: 'application/javascript' });
  compressionWorker = new Worker(URL.createObjectURL(blob));
}

const getAgeTag = (age: number, race: string) => {
  const adult = race === 'Elf' ? 100 : 60;
  const elder = race === 'Elf' ? 500 : 200;
  if (age < adult) return "[Player is a young, developing adult]";
  if (age < elder) return "[Player is a mature adult]";
  return "[Player is a weathered elder]";
};

function buildTextPromptAsync(state: GameState, actionText: string): Promise<string> {
  return new Promise((resolve) => {
    if (!compressionWorker) {
      resolve("Fallback prompt");
      return;
    }
    const handler = (e: MessageEvent) => {
      compressionWorker!.removeEventListener('message', handler);
      resolve(e.data.prompt);
    };
    compressionWorker.addEventListener('message', handler);
    
    // Resolve local NPCs before sending to worker
    const localNPCIds = state.world.current_location.npcs || [];
    const localNPCs = localNPCIds.map((id: string) => NPCS[id]).filter(Boolean);
    
    const synergies = getSynergies(state.player.skills);
    compressionWorker.postMessage({ state, actionText, localNPCs, synergies });
  });
}

function buildImagePrompt(state: GameState) {
  const timeOfDay = state.world.hour >= 6 && state.world.hour <= 18 ? "daytime" : "nighttime";
  const ageYears = Math.floor(state.player.age_days / 365);
  const ageAppearance = AGE_APPEARANCE[ageYears] || "A young person";
  const afflictions = state.player.afflictions.length > 0 ? state.player.afflictions.join(", ") : "healthy";
  const cosmetics = `${state.player.cosmetics.hair_length} hair, ${state.player.cosmetics.eye_color} eyes, ${state.player.cosmetics.skin_tone} skin, ${state.player.cosmetics.posture} posture`;
  
  let biologyTags = "";
  if (state.player.biology.incubations.length > 0 || state.player.biology.parasites.length > 0) {
    biologyTags = ", swollen abdomen, pregnant appearance";
  }

  let dreamscapeTags = "";
  if (state.world.dreamscape.active) {
    dreamscapeTags = ", surreal, dreamlike, ethereal, floating elements, impossible geometry";
  }

  let companionTags = "";
  if (state.player.companions.active_party.length > 0) {
    companionTags = `, accompanied by ${state.player.companions.active_party[0].name} (${state.player.companions.active_party[0].type})`;
  }

  const equipped = state.player.inventory.filter(i => i.is_equipped).map(i => i.name).join(", ") || "nothing";
  return `masterpiece, high quality, dark fantasy, Elder Scrolls style, ${state.world.current_location.atmosphere}, ${state.world.weather}, ${timeOfDay}, ${ageAppearance}, character wearing ${equipped}, ${cosmetics}, ${afflictions}${biologyTags}${dreamscapeTags}${companionTags}`;
}

function getFallbackResponse() {
  return {
    narrative_text: "The chaotic energies of Aetherius warp your perception. The outcome is unclear, but you feel a sense of dread settling into your bones.",
    stat_deltas: { health: -5, trauma: 5, stamina: -10 },
    new_affliction: null,
    equipment_integrity_delta: -5,
    hours_passed: 1,
    follow_up_choices: [
      { id: "f1", label: "Press onward cautiously", intent: "cautious", successChance: 50 },
      { id: "f2", label: "Rest and recover", intent: "defensive", successChance: 90 }
    ]
  };
}

// --- Semantic Helpers ---
const getHealthSemantic = (h: number) => h > 80 ? 'Robust' : h > 50 ? 'Battered' : h > 20 ? 'Bleeding' : 'Death\'s Door';
const getStaminaSemantic = (s: number) => s > 80 ? 'Energetic' : s > 50 ? 'Winded' : s > 20 ? 'Exhausted' : 'Collapsing';
const getTraumaSemantic = (t: number) => t < 20 ? 'Lucid' : t < 50 ? 'Shaken' : t < 80 ? 'Disturbed' : 'Fractured';

// --- Components ---
function useEncounterBuffer(state: GameState) {
  const [buffer, setBuffer] = useState<any[]>([]);
  
  useEffect(() => {
    // Pre-Cog Engine: Polls in the background to pre-generate encounters based on probable next locations
    if (buffer.length < 3 && !state.ui.isPollingText) {
      const timer = setTimeout(() => {
        setBuffer(prev => [...prev, { pregenerated: true, location: state.world.current_location.name, timestamp: Date.now() }]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state, buffer]);

  return buffer;
}


const SemanticText = ({ text, className }: { text: string, className?: string }) => {
  // Regex auto-colors keywords
  const parts = text.split(/(\bBlood\b|\bSeptims\b|\bGold\b|\bPain\b|\bDeath\b|\bWillpower\b|\bLust\b|\bCorruption\b|\bParasite\b|\bDream\b)/gi);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const lower = part.toLowerCase();
        if (lower === 'blood' || lower === 'pain' || lower === 'death' || lower === 'parasite') {
          return <span key={i} className="text-red-500 font-bold">{part}</span>;
        }
        if (lower === 'septims' || lower === 'gold') {
          return <span key={i} className="text-yellow-500 font-bold">{part}</span>;
        }
        if (lower === 'willpower' || lower === 'dream') {
          return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
        }
        if (lower === 'lust') {
          return <span key={i} className="text-pink-400 font-bold">{part}</span>;
        }
        if (lower === 'corruption') {
          return <span key={i} className="text-emerald-500 font-bold">{part}</span>;
        }
        return part;
      })}
    </span>
  );
};

const FloatingDeltas = ({ deltas, onComplete }: { deltas: Partial<Record<StatKey, number>>, onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: -50 }}
      exit={{ opacity: 0 }}
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center gap-1"
    >
      {deltas.health !== 0 && <span className={deltas.health > 0 ? "text-green-400" : "text-red-400 font-bold"}>{deltas.health > 0 ? '+' : ''}{deltas.health} Health</span>}
      {deltas.stamina !== 0 && <span className={deltas.stamina > 0 ? "text-blue-400" : "text-orange-400"}>{deltas.stamina > 0 ? '+' : ''}{deltas.stamina} Stamina</span>}
      {deltas.trauma !== 0 && <span className={deltas.trauma > 0 ? "text-purple-400 font-bold" : "text-gray-400"}>{deltas.trauma > 0 ? '+' : ''}{deltas.trauma} Trauma</span>}
      {deltas.willpower !== 0 && <span className={deltas.willpower > 0 ? "text-indigo-400" : "text-indigo-600"}>{deltas.willpower > 0 ? '+' : ''}{deltas.willpower} Willpower</span>}
      {deltas.lust !== 0 && <span className={deltas.lust > 0 ? "text-pink-400 font-bold" : "text-pink-200"}>{deltas.lust > 0 ? '+' : ''}{deltas.lust} Lust</span>}
      {deltas.corruption !== 0 && <span className={deltas.corruption > 0 ? "text-emerald-500 font-bold" : "text-emerald-200"}>{deltas.corruption > 0 ? '+' : ''}{deltas.corruption} Corruption</span>}
    </motion.div>
  );
};

// --- Main Component ---
import { ImmersiveStartMenu } from './components/ImmersiveStartMenu';
import { EncounterUI } from './components/EncounterUI';
import { NarrativeLog } from './components/NarrativeLog';
import { saveGame } from './utils/saveManager';

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

  const generatePlayerAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
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
  const [developerJson, setDeveloperJson] = useState('');
  const [showMemories, setShowMemories] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showCompanions, setShowCompanions] = useState(false);
  const [showBase, setShowBase] = useState(false);
  const [showSpellcrafting, setShowSpellcrafting] = useState(false);
  const [showDreamscape, setShowDreamscape] = useState(false);
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
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
        }
      } else if (intent === 'submissive') {
        triggerCombatFeedback('lust_action', false, null);
        encounterUpdates.enemy_lust = Math.min(100, encounter.enemy_lust + 20);
        encounterUpdates.enemy_anger = Math.max(0, encounter.enemy_anger - 10);
        stat_deltas.stress = 15;
        stat_deltas.lust = 10;
        stat_deltas.purity = -5;
        narrative = "You submit to their advances. They take advantage of your compliance.";
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
          if (encounterUpdates.enemy_lust >= 100) {
            narrative += " They are completely enamored and let you go.";
            endEncounter = true;
          }
        } else {
          encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 10);
          narrative = "Your seduction attempt fails. They are annoyed.";
          stat_deltas.health = -5;
          skill_deltas.seduction = 1;
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
        {/* Sidebar for Player Avatar */}
        <div className="w-64 border-r border-white/5 bg-black/60 backdrop-blur-md p-4 flex flex-col gap-4 overflow-y-auto hidden xl:flex z-20 shrink-0">
          <div className="relative aspect-[3/4] w-full border border-white/10 rounded-sm overflow-hidden bg-black/80 flex items-center justify-center group">
            {state.player.avatar_url ? (
              <img src={state.player.avatar_url} alt="Player Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" referrerPolicy="no-referrer" />
            ) : (
              <div className="text-white/20 flex flex-col items-center gap-2">
                <User className="w-8 h-8 opacity-50" />
                <span className="text-[10px] tracking-widest uppercase">No Avatar</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
              <span className="text-sm font-serif text-white/90">{state.player.identity.name}</span>
              <span className="text-[10px] tracking-widest uppercase text-white/50">{state.player.identity.race} {state.player.identity.gender}</span>
            </div>

            <button 
              onClick={generateAvatar}
              disabled={state.ui.isGeneratingAvatar}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-white/10 border border-white/10 rounded-sm backdrop-blur-md transition-colors disabled:opacity-50"
              title="Generate Avatar"
            >
              {state.ui.isGeneratingAvatar ? (
                <div className="w-3 h-3 border border-t-white/60 rounded-full animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3 text-white/60" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-[10px] tracking-widest uppercase text-white/40 border-b border-white/10 pb-1 mb-2">Appearance</h3>
            <div className="text-xs text-white/60 flex justify-between">
              <span>Hair:</span>
              <span className="text-white/80">{state.player.cosmetics.hair_length} {state.player.cosmetics.hair_color}</span>
            </div>
            <div className="text-xs text-white/60 flex justify-between">
              <span>Eyes:</span>
              <span className="text-white/80">{state.player.cosmetics.eye_color}</span>
            </div>
            <div className="text-xs text-white/60 flex justify-between">
              <span>Skin:</span>
              <span className="text-white/80">{state.player.cosmetics.skin_tone}</span>
            </div>
            <div className="text-xs text-white/60 flex justify-between">
              <span>Build:</span>
              <span className="text-white/80">{state.player.cosmetics.body_type}</span>
            </div>
          </div>
        </div>

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
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-sm overflow-hidden border border-white/10 shadow-2xl shadow-black/80 z-10 bg-[#0a0a0a]">
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
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase text-white/50">Day {state.world.day}</p>
                  <p className="font-serif text-xl text-white/80 mt-1">{state.world.hour}:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative Panel */}
        <div className="w-full max-w-lg border-l border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex flex-col relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          
          {/* Log Area */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide" ref={logRef}>
            <NarrativeLog logs={state.ui.currentLog} trauma={state.player.stats.trauma} accessibilityMode={state.ui.accessibility_mode} />
            
            {/* Afflictions */}
            {state.player.afflictions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {state.player.afflictions.map((aff, i) => (
                  <span key={i} className="px-3 py-1 bg-red-950/30 border border-red-900/30 text-red-400/80 text-[10px] tracking-widest uppercase rounded-sm">
                    {aff}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Controls Area */}
          <div className="p-8 border-t border-white/5 bg-black/50 relative">
            <AnimatePresence>
              {state.ui.isPollingText ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md flex flex-col items-center justify-center z-10"
                >
                  <div className="w-16 h-16 relative mb-6">
                    <div className="absolute inset-0 border border-white/10 rounded-full" />
                    <div className="absolute inset-0 border border-t-white/60 rounded-full animate-spin" />
                    <div className="absolute inset-2 border border-white/5 rounded-full" />
                    <div className="absolute inset-2 border border-b-white/40 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                  </div>
                  <p className="tracking-[0.3em] uppercase text-[10px] text-white/50 animate-pulse">
                    The Weaver Contemplates...
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-col gap-3 relative">
              {state.world.active_encounter ? (
                <EncounterUI 
                  encounter={state.world.active_encounter} 
                  playerStats={state.player.stats} 
                  onAction={(action, intent, part) => handleAction(action, intent, part)} 
                />
              ) : (
                <>
                  {state.world.current_location.danger > 80 && !state.ui.isPollingText && (
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      onAnimationComplete={() => handleAction("Struggle", "aggressive")}
                      className="absolute -top-4 left-0 h-1 bg-red-500/50"
                    />
                  )}
              {state.ui.choices.map(choice => (
                <motion.button 
                  whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}
                  key={choice.id}
                  onClick={() => handleAction(choice.label, choice.intent, choice.id)}
                  className={`group relative p-4 text-left border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all rounded-sm overflow-hidden flex justify-between items-center ${state.player.stats.health < 20 ? 'desperation-glow border-red-500/50' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <span className="text-[10px] tracking-widest uppercase text-white/30 w-24 shrink-0">[{choice.intent}]</span>
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{choice.label}</span>
                  </div>
                  {choice.successChance !== undefined && (
                    <div className="relative flex items-center gap-2">
                      <span className={`text-[10px] tracking-widest font-mono ${choice.successChance > 75 ? 'text-emerald-400/80' : choice.successChance > 40 ? 'text-yellow-400/80' : 'text-red-400/80'}`}>
                        {choice.successChance}%
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
              
              <div className="flex gap-2 mt-4 mb-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction("Scavenge the area for supplies", "work")}
                  className="flex-1 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all rounded-sm text-[10px] tracking-widest uppercase text-white/60 hover:text-white/90"
                >
                  Scavenge Area
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction("Rest and recover", "neutral")}
                  className="flex-1 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all rounded-sm text-[10px] tracking-widest uppercase text-white/60 hover:text-white/90"
                >
                  Rest & Recover
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction("Wait for an hour", "neutral")}
                  className="flex-1 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all rounded-sm text-[10px] tracking-widest uppercase text-white/60 hover:text-white/90"
                >
                  Wait 1 Hour
                </motion.button>
              </div>
              </>
              )}
              <form onSubmit={e => { e.preventDefault(); if(customAction.trim()) { handleAction(customAction); setCustomAction(''); } }} className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                </div>
                <input 
                  type="text" 
                  value={customAction}
                  onChange={e => setCustomAction(e.target.value)}
                  placeholder="Forge your own path..."
                  className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-4 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors"
                />
              </form>
            </div>
          </div>
        </div>
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
        {showStatus && (
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

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-md w-full relative shadow-2xl z-10"
            >
              <button 
                onClick={() => setShowStatus(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-white/50" />
                Physiological Matrix
              </h2>
              
              <div className="space-y-4">
                {Object.entries(state.player.stats).map(([stat, value]) => (
                  <div key={stat} className="flex items-center justify-between">
                    <span className="text-xs tracking-widest uppercase text-white/50">{stat}</span>
                    <div className="flex-1 mx-4 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stat === 'trauma' || stat === 'lust' || stat === 'corruption' ? 'bg-red-900/50' : 'bg-white/20'}`} 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/70 w-8 text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4">Inventory & Encumbrance</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-widest uppercase text-white/40">Weight</span>
                  <span className="text-[10px] font-mono text-white/60">{state.player.inventory.length * 2} / 50 lbs</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${state.player.inventory.length * 2 > 40 ? 'bg-red-500' : 'bg-white/40'}`} 
                    style={{ width: `${Math.min(100, (state.player.inventory.length * 2 / 50) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4">Current Equipment</h3>
                <p className="text-sm text-white/80 font-serif italic">{state.player.inventory.filter(i => i.is_equipped).map(i => i.name).join(', ') || 'Naked'}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] tracking-widest uppercase text-white/40">Integrity</span>
                  <span className="text-[10px] font-mono text-white/60">{Math.round(state.player.inventory.filter(i => i.is_equipped).reduce((acc, i) => acc + (i.integrity || 0), 0) / (state.player.inventory.filter(i => i.is_equipped).length || 1))}%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Graph Modal */}
      <AnimatePresence>
        {showMemories && (
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

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full max-h-[80vh] flex flex-col relative shadow-2xl z-10"
            >
              <button 
                onClick={() => setShowMemories(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3 shrink-0">
                <BookOpen className="w-5 h-5 text-white/50" />
                Memory Graph
              </h2>
              
              <div className="overflow-y-auto pr-4 space-y-6 scrollbar-hide flex-1">
                {state.memory_graph.length === 0 ? (
                  <p className="text-white/40 italic text-sm">The void is empty...</p>
                ) : (
                  state.memory_graph.map((mem, i) => (
                    <div key={i} className="border-l border-white/10 pl-4 py-1 relative">
                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-white/20" />
                      <span className="text-[10px] tracking-widest uppercase text-white/30 block mb-2">Fragment {i + 1}</span>
                      <p className="text-sm text-white/70 leading-relaxed font-serif">{mem}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#050505] border border-white/10 rounded-sm w-full max-w-4xl aspect-video relative shadow-2xl overflow-hidden z-10"
            >
              <button 
                onClick={() => setShowMap(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <div className="absolute top-8 left-8 z-10">
                <h2 className="text-2xl font-serif text-white/90 flex items-center gap-3">
                  <MapIcon className="w-6 h-6 text-white/50" />
                  The Known World
                </h2>
                <p className="text-xs tracking-widest uppercase text-white/40 mt-2">Current Location: {state.world.current_location.name}</p>
              </div>

              {/* Map Nodes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Current Location Node */}
                <div className="relative group">
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-serif text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {state.world.current_location.name}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Mode Modal */}
      <AnimatePresence>
        {showDeveloperMode && (
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
                  className="absolute w-1 h-1 bg-purple-500 rounded-full blur-[1px]"
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
              className="bg-[#0a0a0a] border border-purple-500/20 p-8 rounded-sm max-w-2xl w-full relative shadow-[0_0_50px_rgba(168,85,247,0.1)] z-10"
            >
              <button 
                onClick={() => setShowDeveloperMode(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-purple-400 mb-2 flex items-center gap-3">
                <Settings className="w-5 h-5" />
                Developer Override
              </h2>
              <p className="text-xs text-white/40 mb-6">Inject raw JSON directly into the world state. Warning: May cause Dragon Breaks.</p>
              
              <textarea
                value={developerJson}
                onChange={e => setDeveloperJson(e.target.value)}
                placeholder='{ "world": { "current_location": { "name": "The Void" } } }'
                className="w-full h-64 bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-purple-500/40 transition-colors font-mono text-sm mb-6 resize-none"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    dispatch({ type: 'INJECT_DEVELOPER_JSON', payload: developerJson });
                    setShowDeveloperMode(false);
                  }}
                  className="flex-1 py-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm tracking-widest uppercase rounded-sm transition-colors border border-purple-500/20"
                >
                  Inject State
                </button>
                <button 
                  onClick={() => {
                    setDeveloperJson(JSON.stringify(state, null, 2));
                  }}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white/60 text-sm tracking-widest uppercase rounded-sm transition-colors border border-white/10"
                >
                  Dump Current
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
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

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-md w-full relative shadow-2xl z-10"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
                <Settings className="w-5 h-5 text-white/50" />
                Neural Link Configuration
              </h2>
              
              <div className="mb-4">
                <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">Horde API Key</label>
                <input 
                  type="text" 
                  value={state.ui.hordeApiKey}
                  onChange={e => dispatch({ type: 'SET_HORDE_API_KEY', payload: e.target.value })}
                  placeholder="0000000000"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
                />
                <p className="text-[10px] text-white/30 mt-2">Leave as 0000000000 for anonymous access (slower queue).</p>
              </div>

              <div className="mb-8">
                <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">OpenRouter API Key (Fallback)</label>
                <input 
                  type="text" 
                  value={state.ui.apiKey}
                  onChange={e => dispatch({ type: 'SET_API_KEY', payload: e.target.value })}
                  placeholder="sk-or-..."
                  className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
                />
                <p className="text-[10px] text-white/30 mt-2">Optional. Used if Horde fails. Leave blank to use free Pollinations.ai fallback.</p>
              </div>

              <div className="mb-4">
                <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">Text Model (AI Horde)</label>
                <select
                  value={state.ui.selectedTextModel}
                  onChange={e => dispatch({ type: 'SET_TEXT_MODEL', payload: e.target.value })}
                  className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
                  disabled={isLoadingModels}
                >
                  <option value="aphrodite/TheBloke/MythoMax-L2-13B-AWQ">MythoMax L2 13B (Default)</option>
                  {availableTextModels.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.count} workers)</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">Image Model (Stable Horde)</label>
                <select
                  value={state.ui.selectedImageModel}
                  onChange={e => dispatch({ type: 'SET_IMAGE_MODEL', payload: e.target.value })}
                  className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
                  disabled={isLoadingModels}
                >
                  <option value="AlbedoBase XL (SDXL)">AlbedoBase XL (Default)</option>
                  {availableImageModels.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.count} workers)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-serif text-white/80 border-b border-white/10 pb-2">Gameplay Loop</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Encounter Rate</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" min="0" max="100" step="5" 
                      value={state.ui.settings.encounter_rate} 
                      onChange={e => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'encounter_rate', value: parseInt(e.target.value) } })}
                      className="w-24"
                    />
                    <span className="text-xs text-white/80 w-8 text-right">{state.ui.settings.encounter_rate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Stat Drain Multiplier</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" min="0.5" max="2.0" step="0.1" 
                      value={state.ui.settings.stat_drain_multiplier} 
                      onChange={e => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'stat_drain_multiplier', value: parseFloat(e.target.value) } })}
                      className="w-24"
                    />
                    <span className="text-xs text-white/80 w-8 text-right">{state.ui.settings.stat_drain_multiplier.toFixed(1)}x</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Enable Parasites</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enable_parasites', value: !state.ui.settings.enable_parasites } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
                    {state.ui.settings.enable_parasites ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Enable Pregnancy</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enable_pregnancy', value: !state.ui.settings.enable_pregnancy } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
                    {state.ui.settings.enable_pregnancy ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-red-500/50">Extreme Content</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enable_extreme_content', value: !state.ui.settings.enable_extreme_content } })} className={`text-xs px-3 py-1 rounded-sm border ${state.ui.settings.enable_extreme_content ? 'text-red-500 border-red-500/50' : 'text-white/80 border-white/20 hover:text-white'}`}>
                    {state.ui.settings.enable_extreme_content ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-serif text-white/80 border-b border-white/10 pb-2">Interface</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">UI Scale</span>
                  <input 
                    type="range" min="0.8" max="1.5" step="0.1" 
                    value={state.ui.ui_scale} 
                    onChange={e => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'ui_scale', value: parseFloat(e.target.value) } })}
                    className="w-32"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Fullscreen</span>
                  <button onClick={toggleFullscreen} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
                    {state.ui.fullscreen ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Ambient Audio</span>
                  <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'ambient_audio', value: !state.ui.ambient_audio } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
                    {state.ui.ambient_audio ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Haptics</span>
                  <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'haptics_enabled', value: !state.ui.haptics_enabled } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
                    {state.ui.haptics_enabled ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-red-500/20">
                  <span className="text-xs tracking-widest uppercase text-red-500/50">Developer Console</span>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setShowDeveloperMode(true);
                    }}
                    className="text-xs text-red-500/80 hover:text-red-500 border border-red-500/30 hover:bg-red-500/10 px-3 py-1 rounded-sm transition-colors"
                  >
                    Access
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-white/50">Dyslexia Font</span>
                  <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'accessibility_mode', value: !state.ui.accessibility_mode } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
                    {state.ui.accessibility_mode ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs tracking-widest uppercase text-red-500/80">Director's Cut</span>
                  <button onClick={() => dispatch({ type: 'TOGGLE_DIRECTOR_CUT' })} className={`text-xs px-3 py-1 rounded-sm border ${state.world.director_cut ? 'text-red-500 border-red-500/50' : 'text-white/80 border-white/20 hover:text-white'}`}>
                    {state.world.director_cut ? 'Active' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-purple-500/80">Developer Mode</span>
                  <button onClick={() => { setShowSettings(false); setShowDeveloperMode(true); }} className="text-xs text-purple-400 hover:text-purple-300 border border-purple-500/20 px-3 py-1 rounded-sm">
                    Open
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <button 
                  onClick={async () => {
                    try {
                      const saveId = `save_${Date.now()}`;
                      await saveGame(saveId, state);
                      alert("Game saved successfully!");
                    } catch (e) {
                      console.error("Manual save failed:", e);
                      alert("Failed to save game.");
                    }
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 tracking-widest uppercase text-xs transition-colors rounded-sm"
                >
                  Save Game
                </button>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to return to the main menu? Unsaved progress will be lost.")) {
                      window.location.reload();
                    }
                  }}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 tracking-widest uppercase text-xs transition-colors rounded-sm"
                >
                  Return to Main Menu
                </button>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white/90 text-sm tracking-widest uppercase rounded-sm transition-colors"
              >
                Initialize Link
              </button>
            </motion.div>
          </motion.div>
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

      {/* Safehouse Modal */}
      <AnimatePresence>
        {showBase && (
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
                  className="absolute w-1 h-1 bg-stone-400 rounded-full blur-[1px]"
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
                onClick={() => setShowBase(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
                Safehouse Management
              </h2>
              
              {!state.player.base.owned ? (
                <p className="text-white/50 italic">You own no property. The streets are your only refuge.</p>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                      <span className="text-xs tracking-widest uppercase text-white/40 block mb-1">Location</span>
                      <span className="text-white/90 font-serif">{state.player.base.location}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                      <span className="text-xs tracking-widest uppercase text-white/40 block mb-1">Security Tier</span>
                      <span className="text-white/90 font-mono">{state.player.base.security_tier}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4 border-b border-white/10 pb-2">Upgrades</h3>
                    <div className="flex flex-wrap gap-2">
                      {state.player.base.alchemy_station && <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs border border-emerald-500/20 rounded-sm">Alchemy Station</span>}
                      {state.player.base.bathhouse && <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs border border-blue-500/20 rounded-sm">Bathhouse</span>}
                      {state.player.base.library && <span className="px-3 py-1 bg-indigo-900/30 text-indigo-400 text-xs border border-indigo-500/20 rounded-sm">Library</span>}
                      {state.player.base.shrine && <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs border border-yellow-500/20 rounded-sm">Shrine</span>}
                      {state.player.base.secret_exit && <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs border border-purple-500/20 rounded-sm">Secret Exit</span>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spellcrafting Canvas Modal */}
      <AnimatePresence>
        {showSpellcrafting && (
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
                  className="absolute w-1 h-1 bg-purple-500 rounded-full blur-[1px]"
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
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-2xl w-full relative shadow-2xl z-10"
            >
              <button 
                onClick={() => setShowSpellcrafting(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
                Arcane Canvas
              </h2>
              
              <div 
                className="w-full h-64 bg-black border border-white/20 rounded-sm mb-4 relative overflow-hidden cursor-crosshair"
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const dot = document.createElement('div');
                    dot.className = 'absolute w-2 h-2 bg-indigo-500 rounded-full pointer-events-none blur-[1px]';
                    dot.style.left = `${x}px`;
                    dot.style.top = `${y}px`;
                    e.currentTarget.appendChild(dot);
                    setTimeout(() => dot.remove(), 2000);
                  }
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none" />
                <p className="absolute inset-0 flex items-center justify-center text-white/20 text-sm tracking-widest uppercase pointer-events-none">
                  Draw Runes to Cast
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-xs tracking-widest uppercase text-white/50">Magicka Overcharge</span>
                  <button 
                    onClick={() => dispatch({ type: 'TOGGLE_MAGICKA_OVERCHARGE' })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${state.player.arcane.magicka_overcharge ? 'bg-red-900/50' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${state.player.arcane.magicka_overcharge ? 'bg-red-500 right-1' : 'bg-white/50 left-1'}`} />
                  </button>
                </div>
                <button className="px-6 py-2 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 rounded-sm text-xs tracking-widest uppercase transition-colors">
                  Channel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dreamscape Modal */}
      <AnimatePresence>
        {showDreamscape && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-indigo-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-indigo-400 rounded-full blur-[2px]"
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
              className="bg-[#0a0a0a] border border-indigo-500/30 p-8 rounded-sm max-w-4xl w-full relative shadow-2xl overflow-hidden h-[80vh] z-10"
            >
              <button 
                onClick={() => setShowDreamscape(false)}
                className="absolute top-6 right-6 text-indigo-400/40 hover:text-indigo-400 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-serif text-indigo-300 mb-6 flex items-center gap-3 relative z-10">
                The Subconscious Hub
              </h2>
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_100%)]" />
                {/* Placeholder for dream nodes */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center animate-pulse">
                  <span className="text-[10px] text-indigo-300 tracking-widest uppercase">Memory</span>
                </div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                  <span className="text-[10px] text-purple-300 tracking-widest uppercase">Trauma Demon</span>
                </div>
                <div className="absolute bottom-1/4 left-1/2 w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center animate-pulse" style={{ animationDelay: '2s' }}>
                  <span className="text-[10px] text-blue-300 tracking-widest uppercase">Merchant</span>
                </div>
              </div>
              
              <div className="relative z-10 mt-auto pt-96">
                <div className="bg-black/50 backdrop-blur-sm p-4 rounded-sm border border-indigo-500/20">
                  <h3 className="text-xs tracking-widest uppercase text-indigo-400 mb-2">Dream State</h3>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-indigo-300/50 block mb-1">REM Phase</span>
                      <span className="text-indigo-200">{state.player.subconscious.rem_phase} / 4</span>
                    </div>
                    <div>
                      <span className="text-indigo-300/50 block mb-1">Lucidity</span>
                      <span className="text-indigo-200">{state.player.subconscious.lucid_dreaming ? 'Active' : 'Dormant'}</span>
                    </div>
                    <div>
                      <span className="text-indigo-300/50 block mb-1">Nightmare Cascade</span>
                      <span className="text-indigo-200">{state.world.dreamscape.nightmare_cascade ? 'Imminent' : 'Stable'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
