import { GameState } from '../types';
import { NPCS } from '../data/npcs';
import { getSynergies, getAgeTag } from './gameLogic';
import { AGE_APPEARANCE } from '../constants';

const imageWorkerCode = "self.onmessage = async function(e) { const { base64Data } = e.data; try { const byteCharacters = atob(base64Data); const byteNumbers = new Array(byteCharacters.length); for (let i = 0; i < byteCharacters.length; i++) { byteNumbers[i] = byteCharacters.charCodeAt(i); } const byteArray = new Uint8Array(byteNumbers); const blob = new Blob([byteArray], { type: 'image/webp' }); const url = URL.createObjectURL(blob); self.postMessage({ url }); } catch (err) { self.postMessage({ error: err.message }); } };";

export let imageWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  const blob = new Blob([imageWorkerCode], { type: 'application/javascript' });
  imageWorker = new Worker(URL.createObjectURL(blob));
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

export let compressionWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  const blob = new Blob([compressionWorkerCode], { type: 'application/javascript' });
  compressionWorker = new Worker(URL.createObjectURL(blob));
}

export function buildTextPromptAsync(state: GameState, actionText: string): Promise<string> {
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

export function buildImagePrompt(state: GameState) {
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
