import fs from 'fs';
const file = 'src/data/esLocations.ts';
let code = fs.readFileSync(file, 'utf8');

const newLocations = `
  loc_es_whiterun: {
    id: 'loc_es_whiterun',
    name: 'Whiterun',
    description: 'The trade hub of Skyrim, divided into three distinct districts. Dragonsreach looms over the city on its rocky outcropping, home to the Jarl. The Companions train in the Wind District, while merchants peddle their wares in the Plains District. The air smells of woodsmoke, forging steel, and roasting meat.',
    danger: 15,
    atmosphere: 'hearty, bustling, nord tradition',
    exits: ['crossroads'],
    features: ['dragonsreach', 'jorrvaskr', 'bannered_mare', 'skyforge'],
    npcs: ['npc_es_aela', 'npc_es_farengar'],
    items: ['sweetroll', 'skyforge_steel_dagger'],
    actions: [
      { id: 'visit_bannered_mare', intent: 'social', label: 'Rest at The Bannered Mare', skill: 'social', difficulty: 20, reward: { xp: 15 } },
      { id: 'train_companions', intent: 'work', label: 'Train with the Companions', skill: 'athletics', difficulty: 50, reward: { xp: 50, skills: { athletics: 3 } } }
    ]
  },
  loc_es_college_winterhold: {
    id: 'loc_es_college_winterhold',
    name: 'College of Winterhold',
    description: 'A crumbling fortress of magic suspended over the Sea of Ghosts. Mages of all races come here to study the arcane arts far from the suspicious eyes of the Nords. The air crackles with latent magical energy and smells of old parchment and ozone.',
    danger: 30,
    atmosphere: 'scholarly, magical, freezing, isolated',
    exits: ['crossroads'],
    features: ['hall_of_elements', 'arcanaeum', 'midden'],
    npcs: ['npc_es_savos_aren', 'npc_es_faralda'],
    items: ['soul_gem', 'spell_tome_ward'],
    actions: [
      { id: 'study_arcanaeum', intent: 'study', label: 'Study in the Arcanaeum', skill: 'magic', difficulty: 40, reward: { xp: 40, skills: { magic: 3 } } },
      { id: 'explore_midden', intent: 'explore', label: 'Explore the Midden', skill: 'skulduggery', difficulty: 60, reward: { xp: 60, items: ['soul_gem'] } }
    ]
  },
  loc_es_blackreach: {
    id: 'loc_es_blackreach',
    name: 'Blackreach',
    description: 'An immense, glowing subterranean realm beneath Skyrim, dotted with Dwemer ruins and bioluminescent giant mushrooms. Falmer skulk in the shadows, and a strange, artificial sun hangs from the cavern roof.',
    danger: 80,
    atmosphere: 'alien, glowing, dangerous, silent',
    exits: ['crossroads'],
    features: ['silent_city', 'glowing_mushrooms', 'dwemer_sun', 'falmer_camps'],
    npcs: ['npc_es_falmer_skulker', 'npc_es_dwemer_centurion'],
    items: ['crimson_nirnroot', 'soul_gem'],
    actions: [
      { id: 'harvest_crimson_nirnroot', intent: 'work', label: 'Harvest Crimson Nirnroot', skill: 'foraging', difficulty: 70, reward: { items: ['crimson_nirnroot'], xp: 50 } },
      { id: 'sneak_falmer', intent: 'stealth', label: 'Sneak past Falmer camps', skill: 'skulduggery', difficulty: 75, reward: { xp: 60 } }
    ]
  },
  loc_es_imperial_city: {
    id: 'loc_es_imperial_city',
    name: 'The Imperial City',
    description: 'The capital of the Empire of Tamriel, located on City Isle in the heart of Cyrodiil. At its center stands the majestic White-Gold Tower, visible from across the province. A bustling metropolis of diverse cultures, politics, and trade.',
    danger: 20,
    atmosphere: 'cosmopolitan, grandiose, imperial',
    exits: ['crossroads'],
    features: ['white_gold_tower', 'market_district', 'arena_district', 'arcane_university'],
    npcs: ['npc_es_maiq'],
    items: ['welkynd_stone', 'sweetroll'],
    actions: [
      { id: 'trade_market', intent: 'social', label: 'Trade in the Market District', skill: 'persuasion', difficulty: 30, reward: { gold: 30, xp: 20 } },
      { id: 'visit_arena', intent: 'explore', label: 'Watch the Arena matches', skill: 'social', difficulty: 10, reward: { xp: 15 } }
    ]
  },
`;

code = code.replace(/};\s*$/, newLocations + '\n};\n');
fs.writeFileSync(file, code);
