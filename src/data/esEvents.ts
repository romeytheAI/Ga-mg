export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  effects: any[];
  duration_days: number;
  world_state_changes: Record<string, any>;
}

export const ES_WORLD_EVENTS: WorldEvent[] = [
  {
    id: 'ev_bloodmoon',
    name: 'The Blood Moon Rises',
    description: 'The moon turns blood-red over Skyrim. Daedric energy floods the land. Danger increases everywhere as creatures of Oblivion manifest in the mortal realm. The night belongs to the Princes now.',
    triggers: ['world.day % 30 === 0', 'world.hour >= 20'],
    effects: [
      { type: 'danger_increase', multiplier: 1.5, scope: 'all_locations' },
      { type: 'spawn_daedra', frequency: 'every_location', duration: 'event' },
      { type: 'player_debuff', stat: 'willpower', amount: -10, reason: 'daedric_pressure' },
    ],
    duration_days: 3,
    world_state_changes: {
      danger_global_multiplier: 1.5,
      daedra_spawn_enabled: true,
      weather_override: 'Blood Red Sky',
      npc_behavior: 'fearful',
    },
  },
  {
    id: 'ev_dragon_return',
    name: 'Dragons Have Returned',
    description: 'Ancient dragons have returned to the skies of Skyrim. Their shadows darken the sun, and their roars echo across the tundra. Paarthurnax has descended from his mountain to guide those brave enough to face the winged horrors.',
    triggers: ['q_es6_blades_reborn.completed'],
    effects: [
      { type: 'spawn_dragons', frequency: 'outdoor_locations', chance: 0.15 },
      { type: 'unlock_npc', npc_id: 'npc_es_paarthurnax' },
      { type: 'unlock_location', location_id: 'loc_es_throat_of_world' },
    ],
    duration_days: -1,
    world_state_changes: {
      dragon_encounters_enabled: true,
      paarthurnax_accessible: true,
      outdoor_danger_increase: 20,
    },
  },
  {
    id: 'ev_dawnguard_schism',
    name: 'Dawnguard vs Vampire War',
    description: 'The ancient war between the Dawnguard and the vampires has spilled into the Rift. Forts change hands, caves become vampire lairs, and travelers must choose a side—or navigate a battlefield where neither side offers mercy.',
    triggers: ['player.level >= 10', 'world.turn_count > 200'],
    effects: [
      { type: 'faction_shift', faction: 'vampires', gain: 'caves', loss: 'none' },
      { type: 'faction_shift', faction: 'dawnguard', gain: 'forts', loss: 'none' },
      { type: 'route_danger', paths: ['crossroads', 'forest'], multiplier: 1.3 },
    ],
    duration_days: 15,
    world_state_changes: {
      vampire_cave_control: true,
      dawnguard_fort_control: true,
      crossroads_danger_increase: 15,
      faction_quest_available: true,
    },
  },
  {
    id: 'ev_daedric_convergence',
    name: 'The Daedric Convergence',
    description: 'Three Daedric shrines blaze with unnatural light simultaneously. Sanguine, Vaermina, and Molag Bal compete for mortal souls. Their power warps the landscape, and mortals caught between them must choose one Prince to serve—or resist all three at great cost.',
    triggers: ['world.day % 45 === 0'],
    effects: [
      { type: 'shrine_activation', shrines: ['sanguine', 'vaermina', 'molag_bal'] },
      { type: 'temptation_encounters', frequency: 3 },
      { type: 'player_choice', type: 'daedric_pact', princes: ['sanguine', 'vaermina', 'molag_bal'] },
    ],
    duration_days: 7,
    world_state_changes: {
      daedric_shrine_count: 3,
      corruption_rate_multiplier: 1.5,
      daedric_encounter_frequency: 'high',
      choice_required: true,
    },
  },
  {
    id: 'ev_dwemer_awakening',
    name: 'The Dwemer Awakening',
    description: 'Dwemer automatons activate across all dungeons and ruins. Something has triggered the tonal engines buried deep beneath Skyrim. Sphere Guardians, Spider workers, and Centurion warriors roam the deep places once more. Danger surges in every Dwemer location.',
    triggers: ['q_es4_dwemer_echoes.active'],
    effects: [
      { type: 'danger_increase', scope: 'dwemer_locations', multiplier: 1.4 },
      { type: 'spawn_automata', type: ['sphere', 'spider', 'centurion'], frequency: 'dwemer_dungeons' },
      { type: 'salvage_opportunity', type: 'dwemer_tech', value: 'high' },
    ],
    duration_days: 5,
    world_state_changes: {
      dwemer_danger_increase: 40,
      automaton_spawn_enabled: true,
      salvage_market_active: true,
      dwemer_tech_value_multiplier: 2.0,
    },
  },
  {
    id: 'ev_skooma_crisis',
    name: 'The Skooma Epidemic',
    description: 'Skooma floods the streets of Riften. Corruption spirals as addicts trade dignity for their next fix. Argonians suffer the worst—their physiology makes them hypersensitive to the drug. Crime spikes, and the Thieves Guild profits from the misery.',
    triggers: ['world.turn_count > 100', 'world.current_location.id === "riften"'],
    effects: [
      { type: 'corruption_increase', rate: 2.0, scope: 'riften' },
      { type: 'race_debuff', race: 'argonian', stat: 'stamina', amount: -15 },
      { type: 'crime_spike', crime_rate: 1.8, location: 'riften' },
    ],
    duration_days: 10,
    world_state_changes: {
      corruption_rate_riften: 2.0,
      argonian_stamina_debuff: true,
      crime_riften_multiplier: 1.8,
      thieve_guild_income_boost: true,
    },
  },
  {
    id: 'ev_skaal_blessing',
    name: 'The Skaal Blessing',
    description: 'The Skaal of Solstheim have opened their spirits to the All-Maker. A wave of divine energy washes over Skyrim, blessing all who are worthy with strength and wisdom. For a brief window, spirit magic flows freely and the heart of Tamriel beats with the rhythm of the old ways.',
    triggers: ['world.day % 60 === 0'],
    effects: [
      { type: 'stat_boost', all_stats: 5, duration: 3 },
      { type: 'unlock_magic', type: 'spirit_magic', duration: 3 },
      { type: 'npc_blessing', npc: 'Skaal Shaman', effect: 'healing' },
    ],
    duration_days: 3,
    world_state_changes: {
      player_stat_boost: 5,
      spirit_magic_enabled: true,
      npc_attitude_improvement: 10,
      healing_available: true,
    },
  },
  {
    id: 'ev_greymarch',
    name: 'The Greymarch',
    description: 'Sheogorath\'s transformation cycle begins. Jyggalag, Prince of Order, marches on the Shivering Isles. Madness seeps into reality itself. Item properties shift, NPC dialogue scrambles, weather becomes unpredictable, and the boundary between sanity and insanity blurs.',
    triggers: ['world.day % 100 === 0'],
    effects: [
      { type: 'random_item_effects', frequency: 'high' },
      { type: 'npc_dialogue_scramble', probability: 0.3 },
      { type: 'weather_unpredictable', range: 'all_weathers' },
      { type: 'player_confusion', probability: 0.15, reason: 'madness_bleed' },
    ],
    duration_days: 14,
    world_state_changes: {
      item_stability: 'unstable',
      npc_dialogue_randomized: true,
      weather_predictable: false,
      confusion_chance: 15,
      sheogorath_transformation: 'jyggalag',
    },
  },
  {
    id: 'ev_blades_hunt',
    name: 'Blades Hunt for Dragon Souls',
    description: 'The Blades have put out a call across Skyrim: dragon souls must be hunted and harvested. Delphine\'s agents patrol the roads, interrogating travelers and demanding proof of loyalty. Those not aligned with the Blades become targets of suspicion—or worse.',
    triggers: ['q_es6_blades_reborn.active'],
    effects: [
      { type: 'faction_hostility', faction: 'blades', non_members: 'suspicious' },
      { type: 'road_interrogations', frequency: 'medium' },
      { type: 'delphine_disposition', state: 'hostile_unless_recruited' },
    ],
    duration_days: -1,
    world_state_changes: {
      blades_faction_active: true,
      road_interrogation_frequency: 'medium',
      delphine_hostility: 'unless_recruited',
      dragon_soul_quest_available: true,
    },
  },
  {
    id: 'ev_miraaks_influence',
    name: 'Miraak\'s Whispering Influence',
    description: 'Miraak\'s whispers echo across Skyrim from his prison in Apocrypha. Black Books manifest in ruins. Travelers report hearing voices. The Dragonborn gains access to dragon shouts—but the power comes at a price. Every whisper erodes free will.',
    triggers: ['q_es8_miraaks_whispers.active'],
    effects: [
      { type: 'black_books_spawn', locations: 'ruins', quantity: 3 },
      { type: 'unlock_shouts', type: 'dragon_shout', count: 1 },
      { type: 'willpower_drain', rate: 0.5, reason: 'miraak_influence' },
      { type: 'unlock_location', location_id: 'loc_es_apocrypha' },
    ],
    duration_days: -1,
    world_state_changes: {
      black_books_in_ruins: true,
      dragon_shouts_unlocked: true,
      willpower_drain_active: 0.5,
      apocrypha_accessible: true,
      solstheim_path_open: true,
    },
  },
];
