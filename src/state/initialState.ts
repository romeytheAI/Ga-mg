import { GameState } from '../types';
import { LOCATIONS } from '../data/locations';
import { generateStartingWorld } from '../sim/ProceduralGen';
import { getDefaultGraphicsQuality } from '../utils/graphicsQuality';

export const initialState: GameState = {
  player: {
    identity: { name: "Vael", race: "Human", birthsign: "The Thief", origin: "Orphan", gender: "female" },
    stats: { 
      health: 80, max_health: 100, 
      willpower: 90, max_willpower: 100, 
      stamina: 70, max_stamina: 100, 
      lust: 0, trauma: 10, hygiene: 40, corruption: 0, allure: 5,
      arousal: 0, pain: 5, control: 80, stress: 20, hallucination: 0, purity: 100
    },
    skills: { seduction: 0, athletics: 5, skulduggery: 10, swimming: 0, dancing: 0, housekeeping: 15, school_grades: 50, tending: 0, cooking: 5, foraging: 0 },
    gold: 0,
    fame: 0,
    notoriety: 0,
    psych_profile: { submission_index: 20, cruelty_index: 0, exhibitionism: 0, promiscuity: 0 },
    attitudes: { sexual: 'neutral', crime: 'neutral', labour: 'neutral' },
    sensitivity: { mouth: 20, chest: 30, genitals: 50, bottom: 30, thighs: 20, feet: 10, hands: 10 },
    sexual_skills: { oral: 0, vaginal: 0, anal: 0, hand: 0, feet: 0, penile: 0 },
    virginities: { penile: null, vaginal: null, anal: null, oral: null, handholding: null, kiss: null, temple_marriage: null },
    body_fluids: { arousal_wetness: 0, semen_level: 0, saliva: 50, tears: 0, sweat: 10, milk: 0 },
    insecurity: { face: 30, chest: 40, genitals: 50, bottom: 30, body: 35 },
    lewdity_stats: { exhibitionism: 0, promiscuity: 0, deviancy: 0, masochism: 0 },
    traits: [],
    feats: [
      { id: 'feat_first_steps', name: 'First Steps', description: 'Leave the orphanage for the first time.', unlocked: false },
      { id: 'feat_survivor', name: 'Survivor', description: 'Survive for 30 days.', unlocked: false },
      { id: 'feat_first_job', name: 'Honest Work', description: 'Earn your first gold coin from work.', unlocked: false },
      { id: 'feat_school_star', name: 'Star Pupil', description: 'Reach A grade in school.', unlocked: false },
      { id: 'feat_skulduggery_master', name: 'Master Thief', description: 'Reach 100 skulduggery skill.', unlocked: false },
      { id: 'feat_first_love', name: 'First Love', description: 'Enter a romantic relationship.', unlocked: false },
      { id: 'feat_pure_soul', name: 'Pure Soul', description: 'Reach purity 100 while corruption remains 0.', unlocked: false },
      { id: 'feat_fallen', name: 'The Fallen', description: 'Reach corruption 100.', unlocked: false },
      { id: 'feat_wealthy', name: 'Wealthy', description: 'Accumulate 1000 gold.', unlocked: false },
      { id: 'feat_swimmer', name: 'Like a Fish', description: 'Reach 100 swimming skill.', unlocked: false },
      { id: 'feat_dancer', name: 'Graceful', description: 'Reach 100 dancing skill.', unlocked: false },
      { id: 'feat_escape_artist', name: 'Escape Artist', description: 'Escape 10 encounters by fleeing.', unlocked: false },
      { id: 'feat_blood_moon', name: 'Blood Moon', description: 'Survive a Blood Moon event.', unlocked: false },
      { id: 'first_victory', name: 'First Blood', description: 'Win your first combat encounter.', unlocked: false },
      { id: 'first_birth', name: 'New Life', description: 'Give birth for the first time.', unlocked: false },
    ],
    temperature: { ambient_temp: 12, clothing_warmth: 20, body_temp: 'chilly' },
    bailey_payment: { weekly_amount: 100, due_day: 0, missed_payments: 0, debt: 0, punishment_level: 0 },
    afflictions: [],
    clothing: {
      head: null, neck: null, shoulders: null, chest: null, underwear: null, legs: null, feet: null, hands: null, waist: null
    },
    inventory: [
      {
        id: 'orphan-rags',
        name: "Threadbare Tunic",
        type: 'clothing',
        slot: 'chest',
        rarity: 'common',
        description: "A coarse, itchy wool tunic that has been patched a dozen times with mismatched thread. It barely covers you, offering little protection from the cold or prying eyes. It smells faintly of lye, sweat, and the damp desperation of the orphanage. Wearing it marks you as one of the lowest in society.",
        lore: "Woven from the cheapest flax and wool scraps discarded by the city's tailors, these tunics are the standard issue for wards of the state. The matron of the orphanage claims they build character through discomfort. Many orphans believe the coarse fabric is intentionally chosen to make them easier to grab and harder to ignore. The mismatched patches tell a silent history of previous owners who either aged out, escaped, or succumbed to the harsh winters.",
        value: 1,
        weight: 0.5,
        integrity: 60,
        max_integrity: 100,
        is_equipped: true
      },
      {
        id: 'amulet-of-mara',
        name: "Amulet of Mara",
        type: 'misc',
        rarity: 'epic',
        description: "A golden amulet bearing the knotwork symbol of Mara, Goddess of Love. It feels warm to the touch.",
        lore: "In the ancient traditions, wearing an Amulet of Mara signals that you are open to courtship and marriage. It is said that the Goddess herself blesses unions formed under her symbol, granting the couple resilience against the harshness of the world.",
        value: 150,
        weight: 0.1,
        special_effect: "You feel a warm, comforting presence. Your heart opens to the possibility of love."
      },
      {
        id: 'healing-poultice',
        name: "Healing Poultice",
        type: 'consumable',
        rarity: 'common',
        description: "A foul-smelling paste made of crushed herbs and mud. It stings when applied but promotes rapid healing.",
        value: 15,
        weight: 0.2,
        stats: { health: 25 },
        special_effect: "The stinging sensation quickly fades into a soothing coolness."
      }
    ],
    anatomy: { 
      height: "small", build: "waifish", metabolism: "fast", healer: "normal", sleep: "light", gut: "sensitive", bones: "fragile", flexibility: "normal", blood: "normal", vision: "normal", skin: "pale", pheromones: "neutral", visage: "innocent", temp_pref: "warmth", injuries: [],
      organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 },
      bones_integrity: { skull: 100, spine: 100, ribs: 100, arms: 100, legs: 100 }
    },
    psychology: { outlook: "hopeful", innate: "submissive", paranoia: 0.1, empathy: 0.9, psychopathy: 0.0, phobias: ["darkness"], touch_starved: true, sexuality: "unknown", stoic: false, fragile_ego: true },
    perks_flaws: { hidden_pockets: false, silver_tongue: false, nimble_fingers: true, danger_sense: false, animal_whisperer: true, green_thumb: false, eidetic_memory: false, debt_ridden: false, hunted: false, cursed: false, addictive_personality: false, mute: false, blind_one_eye: false, frail: true, unlucky: false },
    social: { wanted_sibling: false, betrothed: false, exiled: false, guild_member: false, town_pariah: false },
    cosmetics: { hair_length: "shaggy", hair_color: "brown", eye_color: "blue", skin_tone: "fair", tattoos: [], piercings: [], posture: "cautious", scars: [], voice_pitch: "high", scent: "dust and lye", literacy: false, dominant_hand: "right", resting_hr: 75, blushing: true, body_mods: [], true_name: "Vael" },
    arcane: { spells: [], magicka_overcharge: false, blood_vials: 0, true_sight: false, telepathy_unlocked: false, toxicity: 0, withdrawal_timer: 0, soul_gems: 0, tattoos: [], corruption_taint: 0, astral_projection: false },
    justice: { suspicion: 0, bounty: 0, evidence_left: 0, jail_sentence: 0, contraband_slots: 0, fence_reputation: 0, black_book_debt: 0, banishment: false, extortion_targets: [] },
    companions: { active_party: [], roster: [], max_encumbrance_bonus: 0 },
    base: { owned: false, location: "none", furniture: [], bed_tier: 0, security_tier: 0, storage: [], alchemy_station: false, bathhouse: false, garden_plot: { planted: false, days_left: 0 }, captive_cell: [], secret_exit: false, property_taxes_due: 0, infestations: false, mannequins: [], library: false, shrine: false },
    subconscious: { rem_phase: 0, lucid_dreaming: false, sleep_paralysis: false, prophetic_dreams: [], trauma_demons_defeated: [], insomnia: 0, dreamless_potions: 0, coma_days: 0, dream_journal: [] },
    biology: { cycle_day: 1, heat_rut_active: false, parasites: [], incubations: [], cravings: [], exhaustion_multiplier: 1.0, post_partum_debuff: 0, sterility: false, fertility_cycle: 'Ovulation', fertility: 0.5, lactation_level: 0 },
    status_effects: [],
    life_sim: {
      needs: { hunger: 100, thirst: 100, energy: 100, hygiene: 100, social: 100 },
      schedule: { work: null, leisure: null, sleep: null }
    },
    age_days: 6570, // 18 years
    avatar_url: null,
    quests: [
      {
        id: 'q_ch1_orphans_cage',
        title: "The Orphan's Cage",
        type: 'main' as const,
        chapter: 1,
        status: 'active' as const,
        description: "Life under Matron Grelod is a waking nightmare. Find a way to escape the orphanage.",
        objectives: [
          { id: 'obj_leave_orphanage', description: "Escape the orphanage and reach the town square", completed: false },
        ],
        rewards: { feats: ['feat_first_steps'], xp: 50 },
        prerequisites: [],
      }
    ],
    known_recipes: ['recipe_foraged_salad', 'recipe_herb_tea'],
  },
  world: {
    day: 1, hour: 7, weather: "Foggy",
    current_location: LOCATIONS.orphanage,
    macro_events: [],
    local_tension: 0.1,
    aggression_counter: 0,
    active_world_events: [],
    turn_count: 0,
    last_intent: null,
    economy: { inflation: 1.0, shortages: [], caravans: false, taxation: 0, black_market: "active", currency_value: 1.0, smuggling: "open", bounties: 0, property_values: "low", resource_depletion: 0, businesses: [], staff: [], tavern_owned: false, brothel_owned: false, business_reputation: 0, advertising_days: 0, rival_businesses: false, vault_balance: 0 },
    ecology: { predator_pop: "low", flora: "urban", herb_regrowth: 0, animal_migration: "none", disease: "none", water: "stagnant", soil: "none", weather_spawns: "inactive", lunar: "waxing", eclipse: false },
    factions: { guild_wars: false, guard_patrols: "high", cult_uprisings: false, noble_feuds: false, peasant_rebellions: false, religious_schisms: false, bandit_expansion: false, smuggler_cartels: false, beggar_syndicates: true, assassin_contracts: false },
    npc_state: { waking: true, working: true, tavern: false, guard_shifts: "day", market: "open", church: false, secret_meetings: false, rivalries: "active", romance: "dormant", mortality: "enabled" },
    meta_events: { plague: false, royal_assassination: false, demonic_invasion: false, festival: false, conscription: false, witch_hunt: false, economic_crash: false, refugee_crisis: false, crusade: false, beast_sighting: false },
    settlement: { construction: "none", destruction: "none", sanitation: "poor", laws: ["curfew"], executions: false, elections: false, town_criers: "active", wanted_posters: "none", fame: 0, prophecies: "none" },
    ambient: { tide: "none", constellations: "The Thief", crop_yields: "none", temp_gradient: "chilly", wind_direction: "east", mud: "low", blood_washing: false, corpse_rot: "none", metal_rusting: false, structure_aging: "slow" },
    arcane: { leyline_nodes: [], demonic_pacts: [], wild_magic_chance: 0.01, void_shift_active: false, sacrificial_altars: [] },
    justice: { wanted_posters: false, jail_hub_active: false, pillory_event: false, undercover_guards: false, assassination_contracts: [], jailbreak_event: false, chain_gang: false, courtroom_trial: false, execution_sequence: false },
    dreamscape: { active: false, nightmare_cascade: false, shared_dreams: [], reality_blurring: false, dream_merchant_present: false },
    ascension_state: 'none',
    director_cut: false,
    active_encounter: null,
    active_story_event: null
  },
  memory_graph: ["You are an orphan in Honorhall Orphanage in Riften, Skyrim. Life under Matron Grelod is harsh, but you are learning to survive in Tamriel."],
  ui: {
    isPollingText: false,
    isPollingImage: false,
    isGeneratingAvatar: false,
    currentLog: [{ text: "The morning bell clangs, its harsh sound echoing through the cold stone halls of Honorhall Orphanage. You shiver in your thin clothes, the damp mist from Lake Honrich seeping through the cracks in the walls. The other children are already moving between the beds, whispering to wake up before the matron arrives.", type: 'narrative' }],
    currentImage: null,
    choices: LOCATIONS.orphanage.actions.map((a: any) => {
      if (a.skill_check) {
        const initialStats: any = { health: 80, willpower: 90, stamina: 70, lust: 0, trauma: 10, hygiene: 40, corruption: 0, allure: 5, arousal: 0, pain: 5, control: 80, stress: 20, hallucination: 0, purity: 100 };
        const val = initialStats[a.skill_check.stat] || 0;
        const chance = Math.min(100, Math.max(5, (val / a.skill_check.difficulty) * 50 + 25));
        return { ...a, successChance: Math.round(chance) };
      }
      return a;
    }),
    apiKey: "",
    hordeApiKey: "0000000000",
    ui_scale: 1,
    fullscreen: false,
    ambient_audio: true,
    haptics_enabled: true,
    accessibility_mode: false,
    last_stat_deltas: null,
    show_stats: false,
    show_inventory: false,
    show_map: false,
    show_quests: false,
    show_save_load: false,
    show_xray: false,
    show_shop: false,
    show_wardrobe: false,
    show_social: false,
    show_feats: false,
    show_traits: false,
    highlighted_part: null,
    targeted_part: null,
    combat_animation: null,
    horde_status: null,
    horde_monitor: {
      active: false,
      text_requests: 0,
      image_requests: 0,
      text_eta: 0,
      image_eta: 0,
      text_initial_eta: 0,
      image_initial_eta: 0,
      text_generation_chance: 10,
      image_generation_chance: 20
    },
    selectedTextModel: "aphrodite/TheBloke/MythoMax-L2-13B-AWQ",
    selectedImageModel: "AlbedoBase XL (SDXL)",
    settings: {
      encounter_rate: 50,
      stat_drain_multiplier: 1.0,
      enable_parasites: true,
      enable_pregnancy: true,
      enable_extreme_content: false
    },
    graphics_quality: getDefaultGraphicsQuality()
  },
  sim_world: (() => {
    const { locations, npcs, economy } = generateStartingWorld(42);
    return {
      turn: 0,
      day: 1,
      hour: 7,
      weather: 'Foggy',
      season: 'spring' as const,
      npcs,
      economy,
      global_events: [],
      locations,
      active_combats: [],
    };
  })(),
  horde_queue: [],
};
