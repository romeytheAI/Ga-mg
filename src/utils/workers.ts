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
    enable_extreme_content: false,
    streamer_mode: false
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

/**
 * Determines if the player character is exposed (missing critical clothing).
 * Exposed = chest slot missing/destroyed OR both underwear AND legs missing/destroyed.
 */
export function isExposed(state: GameState): boolean {
  const equippedItems = state.player.inventory.filter(i => i.is_equipped);
  const chest = equippedItems.find(i => i.slot === 'chest');
  const underwear = equippedItems.find(i => i.slot === 'underwear');
  const legs = equippedItems.find(i => i.slot === 'legs');

  const chestMissing = !chest || (chest.integrity !== undefined && chest.integrity <= 0);
  const underwearMissing = !underwear || (underwear.integrity !== undefined && underwear.integrity <= 0);
  const legsMissing = !legs || (legs.integrity !== undefined && legs.integrity <= 0);

  return chestMissing || (underwearMissing && legsMissing);
}

/**
 * Calculates a beauty score (0-100) based on multiple factors.
 */
export function calculateBeauty(state: GameState): number {
  const allure = state.player.stats.allure || 0;
  const hygiene = state.player.stats.hygiene || 50;
  const corruption = state.player.stats.corruption || 0;
  const trauma = state.player.stats.trauma || 0;
  const purity = state.player.stats.purity || 50;

  const equippedItems = state.player.inventory.filter(i => i.is_equipped);
  const avgIntegrity = equippedItems.length > 0
    ? equippedItems.reduce((sum, i) => sum + (i.integrity ?? 100), 0) / equippedItems.length
    : 100;

  let beauty = allure * 2;
  beauty += hygiene * 0.3;
  beauty += avgIntegrity * 0.1;
  beauty += purity * 0.1;
  beauty -= corruption * 0.1;
  beauty -= trauma * 0.1;

  return Math.max(0, Math.min(100, Math.round(beauty)));
}

/**
 * Determines if image content should be censored (for streamer mode).
 */
export function shouldCensorImage(state: GameState): boolean {
  if (!state.ui.settings.streamer_mode) return false;

  if (isExposed(state)) return true;
  if ((state.player.stats.arousal || 0) >= 50 || (state.player.stats.lust || 0) >= 50) return true;
  if ((state.player.psych_profile.exhibitionism || 0) >= 40) return true;
  if (state.world.active_encounter) return true;

  return false;
}

/**
 * Comprehensive image prompt builder with 18 visual systems for DoL graphic parity.
 */
export function buildImagePrompt(state: GameState): string {
  // Streamer mode: generate a safe abstract prompt when censoring is needed
  if (shouldCensorImage(state)) {
    return `abstract dark fantasy landscape, silhouette of a figure, atmospheric fog, ${state.world.current_location.atmosphere}, ${state.world.weather}, cinematic lighting, safe for work`;
  }

  const timeOfDay = state.world.hour >= 6 && state.world.hour <= 18 ? "daytime" : "nighttime";
  const ageYears = Math.floor(state.player.age_days / 365);
  const ageAppearance = AGE_APPEARANCE[ageYears] || "A young person";
  const cosmetics = `${state.player.cosmetics.hair_length} hair, ${state.player.cosmetics.eye_color} eyes, ${state.player.cosmetics.skin_tone} skin`;

  const parts: string[] = [
    "masterpiece, high quality, dark fantasy, Elder Scrolls style",
    state.world.current_location.atmosphere,
    state.world.weather,
    timeOfDay,
    ageAppearance,
    cosmetics
  ];

  // --- 1. Clothing integrity visualization ---
  const equippedItems = state.player.inventory.filter(i => i.is_equipped);
  if (equippedItems.length === 0) {
    parts.push("completely naked, exposed, vulnerable");
  } else {
    const clothingDescriptions: string[] = [];
    for (const item of equippedItems) {
      const integrity = item.integrity ?? 100;
      if (integrity <= 0) continue; // destroyed
      if (integrity < 20) {
        clothingDescriptions.push(`${item.name} in shreds`);
      } else if (integrity < 50) {
        clothingDescriptions.push(`torn ${item.name}`);
      } else if (integrity < 80) {
        clothingDescriptions.push(`worn ${item.name}`);
      } else {
        clothingDescriptions.push(item.name);
      }
    }
    if (clothingDescriptions.length > 0) {
      parts.push(`wearing ${clothingDescriptions.join(", ")}`);
    } else {
      parts.push("completely naked, exposed");
    }

    if (isExposed(state)) {
      parts.push("exposed skin, missing clothing");
    }
  }

  // --- 2. Beauty/attractiveness ---
  const beauty = calculateBeauty(state);
  if (beauty >= 80) {
    parts.push("strikingly beautiful, radiant");
  } else if (beauty >= 60) {
    parts.push("attractive, pleasant features");
  } else if (beauty >= 40) {
    parts.push("plain appearance");
  } else if (beauty >= 20) {
    parts.push("disheveled, unkempt");
  } else {
    parts.push("unkempt, bedraggled appearance");
  }

  // --- 3. Hygiene effects ---
  const hygiene = state.player.stats.hygiene || 50;
  if (hygiene < 20) {
    parts.push("filthy, covered in grime, matted hair");
  } else if (hygiene < 40) {
    parts.push("dirty, unwashed, smudged skin");
  } else if (hygiene < 60) {
    parts.push("slightly disheveled");
  } else if (hygiene >= 80) {
    parts.push("clean and well-groomed");
  }

  // --- 4. Arousal/lust physical manifestations ---
  const arousal = state.player.stats.arousal || 0;
  const lust = state.player.stats.lust || 0;
  const maxArousalLust = Math.max(arousal, lust);
  if (maxArousalLust >= 80) {
    parts.push("flushed face, labored breathing, lustful expression, heavy-lidded eyes");
  } else if (maxArousalLust >= 50) {
    parts.push("flushed cheeks, slightly parted lips, quickened breathing");
  } else if (maxArousalLust >= 30) {
    parts.push("subtle flush on cheeks");
  }

  // --- 5. Corruption visual effects ---
  const corruption = state.player.stats.corruption || 0;
  if (corruption >= 90) {
    parts.push("dark veins visible on skin, eerie glow in eyes, corrupted aura, shadowy wisps");
  } else if (corruption >= 70) {
    parts.push("dark veins on skin, unnatural pallor, faint dark aura");
  } else if (corruption >= 50) {
    parts.push("darkened veins, unsettling aura");
  } else if (corruption >= 30) {
    parts.push("subtle darkness in eyes, faint unnatural shadow");
  }

  // --- 6. Trauma/stress psychological manifestations ---
  const trauma = state.player.stats.trauma || 0;
  const stress = state.player.stats.stress || 0;
  const maxTraumaStress = Math.max(trauma, stress);
  if (maxTraumaStress >= 80) {
    parts.push("haunted expression, thousand-yard stare, trembling, hollow eyes");
  } else if (maxTraumaStress >= 50) {
    parts.push("anxious expression, darting eyes, tense jaw");
  } else if (maxTraumaStress >= 30) {
    parts.push("tense posture, wary expression");
  }

  // --- 7. Purity descriptors ---
  const purity = state.player.stats.purity || 50;
  if (purity >= 90) {
    parts.push("innocent aura, soft glow, gentle demeanor");
  } else if (purity <= 20) {
    parts.push("jaded expression, worldly-wise, knowing eyes");
  }

  // --- 8. Submission/control body language ---
  const submission = state.player.psych_profile.submission_index || 0;
  const control = state.player.stats.control || 50;
  if (submission >= 70) {
    parts.push("submissive posture, lowered gaze, hunched shoulders");
  } else if (submission <= 20 && control >= 70) {
    parts.push("confident stance, commanding presence, raised chin");
  }

  // --- 9. Exhibitionism context awareness ---
  const exhibitionism = state.player.psych_profile.exhibitionism || 0;
  if (isExposed(state)) {
    if (exhibitionism >= 60) {
      parts.push("shameless display, confident despite exposure");
    } else if (exhibitionism >= 30) {
      parts.push("nervous but not hiding, conflicted expression");
    } else {
      parts.push("embarrassed, desperately trying to cover up, blushing deeply");
    }
  }

  // --- 10. Pain visualization ---
  const pain = state.player.stats.pain || 0;
  if (pain >= 80) {
    parts.push("grimacing in agony, tears of pain, body contorted, visible wounds");
  } else if (pain >= 50) {
    parts.push("wincing in pain, gritting teeth, strained expression");
  } else if (pain >= 30) {
    parts.push("slight grimace, guarded posture");
  }

  // --- 11. Injury/wound visualization ---
  const injuries = state.player.anatomy.injuries || [];
  if (injuries.length >= 3) {
    parts.push("covered in multiple wounds, bleeding heavily, battered body");
  } else if (injuries.length > 0) {
    const injuryDesc = injuries.slice(0, 2).map(inj => inj.description).join(", ");
    parts.push(`visible injuries: ${injuryDesc}`);
  }

  // --- 12. Scar/tattoo/piercing visualization ---
  const scars = state.player.cosmetics.scars || [];
  const tattoos = state.player.cosmetics.tattoos || [];
  const piercings = state.player.cosmetics.piercings || [];
  if (scars.length > 0) {
    parts.push(`${scars.length > 2 ? 'heavily scarred' : 'bearing scars'}`);
  }
  if (tattoos.length > 0) {
    parts.push(`tattooed with ${tattoos.slice(0, 2).join(" and ")}`);
  }
  if (piercings.length > 0) {
    parts.push(`${piercings.length > 2 ? 'multiple piercings' : 'pierced'}`);
  }

  // --- 13. Cruelty index visualization ---
  const cruelty = state.player.psych_profile.cruelty_index || 0;
  if (cruelty >= 70) {
    parts.push("cruel smirk, predatory gaze, menacing aura");
  } else if (cruelty >= 40) {
    parts.push("cold expression, calculating eyes");
  }

  // --- 14. Heat/rut biology state ---
  if (state.player.biology.heat_rut_active) {
    parts.push("feverish flush, dilated pupils, restless energy, pheromonal haze");
  }

  // --- 15. Ascension state transformations ---
  switch (state.world.ascension_state) {
    case 'pure_soul':
      parts.push("radiant holy aura, divine glow, ethereal beauty, golden light emanating");
      break;
    case 'void_lord':
      parts.push("shadowy tendrils, void energy crackling, dark power emanating, glowing eyes");
      break;
    case 'broodmother':
      parts.push("chitinous growths on skin, parasitic integration, inhuman transformation");
      break;
    case 'asylum':
      parts.push("broken mind visible in eyes, fractured reality around them, distorted space");
      break;
  }

  // --- 16. Enhanced biology visualization ---
  const parasites = state.player.biology.parasites || [];
  const incubations = state.player.biology.incubations || [];
  if (parasites.length >= 3) {
    parts.push("parasitic growths visible on skin, multiple swollen areas, inhuman distortions");
  } else if (parasites.length > 0) {
    parts.push("swollen abdomen, faint parasitic markings");
  }
  if (incubations.length > 0) {
    parts.push("visibly pregnant, swollen belly, maternal glow");
  }

  // --- 17. Environmental context ---
  if (state.world.dreamscape.active) {
    parts.push("surreal, dreamlike, ethereal, floating elements, impossible geometry");
  }

  if (state.player.companions.active_party.length > 0) {
    const companion = state.player.companions.active_party[0];
    parts.push(`accompanied by ${companion.name} (${companion.type})`);
  }

  const afflictions = state.player.afflictions;
  if (afflictions.length > 0) {
    parts.push(afflictions.slice(0, 3).join(", "));
  }

  // Hallucination effects
  if ((state.player.stats.hallucination || 0) > 50 || state.player.stats.stamina <= 0) {
    parts.push("distorted perception, visual artifacts, hallucinatory elements");
  }

  // --- 18. Posture from cosmetics ---
  const posture = state.player.cosmetics.posture;
  if (posture && posture !== 'normal') {
    parts.push(`${posture} posture`);
  }

  return parts.filter(Boolean).join(", ");
}

/**
 * Builds a contextual image prompt for encounter scenes, including
 * enemy visual description and player state.
 */
export function buildEncounterImagePrompt(state: GameState, enemyName: string, enemyType: string, outcome: string): string {
  if (shouldCensorImage(state)) {
    return `abstract dark fantasy landscape, two silhouettes in confrontation, atmospheric fog, ${state.world.current_location.atmosphere}, ${state.world.weather}, cinematic lighting, safe for work`;
  }

  const timeOfDay = state.world.hour >= 6 && state.world.hour <= 18 ? "daytime" : "nighttime";
  const playerAppearance = state.player.cosmetics.hair_length
    ? `${state.player.identity.race} ${state.player.identity.gender} with ${state.player.cosmetics.hair_length} hair`
    : `${state.player.identity.race} ${state.player.identity.gender}`;

  const equippedItems = state.player.inventory.filter(i => i.is_equipped);
  const clothingDesc = equippedItems.length > 0
    ? equippedItems.map(i => {
        const integrity = i.integrity ?? 100;
        if (integrity < 20) return `${i.name} in shreds`;
        if (integrity < 50) return `torn ${i.name}`;
        return i.name;
      }).join(", ")
    : "no clothing";

  const stanceDesc = state.player.stats.pain > 50
    ? "wounded and struggling"
    : state.player.stats.stress > 60
    ? "terrified"
    : "alert and wary";

  return [
    "masterpiece, high quality, dark fantasy, Elder Scrolls style, dramatic encounter scene",
    state.world.current_location.atmosphere,
    state.world.weather,
    timeOfDay,
    `${playerAppearance} wearing ${clothingDesc}`,
    `${stanceDesc}`,
    `confronting ${enemyName} (${enemyType})`,
    outcome,
    "atmospheric, gritty, detailed, cinematic lighting, action pose"
  ].filter(Boolean).join(", ");
}

/**
 * Computes CSS post-processing classes based on the current game state.
 * These are applied to the main container for psychological/physical visual effects.
 */
export function getVisualEffectClasses(state: GameState): string[] {
  const classes: string[] = [];

  // Low health: red vignette heartbeat
  if (state.player.stats.health < 20) {
    classes.push("heartbeat-vignette");
  }

  // High trauma: desaturation
  if (state.player.stats.trauma > 80) {
    classes.push("apathy-desaturation");
  }

  // Medium trauma: chromatic aberration
  if (state.player.stats.trauma > 50) {
    classes.push("chromatic-aberration");
  }

  // High arousal/lust: warm pink tint
  const maxArousalLust = Math.max(state.player.stats.arousal || 0, state.player.stats.lust || 0);
  if (maxArousalLust >= 70) {
    classes.push("arousal-warmth");
  }

  // High corruption: dark vignette
  if ((state.player.stats.corruption || 0) >= 60) {
    classes.push("corruption-darkness");
  }

  // Low control: screen tremor
  if ((state.player.stats.control || 50) < 20) {
    classes.push("low-control-tremor");
  }

  // High pain: red flash
  if ((state.player.stats.pain || 0) >= 60) {
    classes.push("pain-flash");
  }

  // Active hallucinations: visual distortion
  if ((state.player.stats.hallucination || 0) > 60 || state.player.stats.stamina <= 5) {
    classes.push("hallucination-distortion");
  }

  // Weather effects
  if (state.world.weather === 'Rain') classes.push("weather-rain");
  if (state.world.weather === 'Fog') classes.push("weather-fog");

  // Dark atmosphere
  if (state.world.current_location.atmosphere.includes('dark')) {
    classes.push("pitch-black");
  }

  return classes;
}
