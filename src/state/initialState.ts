import { GameState, MagicSchool, Spell, ActiveEffect, Item, ClothingLayer } from '../types';
import { PREDEFINED_ANATOMIES } from '../constants';
import { computeClothingState } from '../utils/clothingState';
import { generateStartingWorld } from '../sim/ProceduralGen';
import { getDefaultGraphicsQuality } from '../utils/graphicsQuality';
import { LOCATIONS } from '../data/locations';

const starterTunic: Item = {
  id: 'orphan-rags', name: "Commoner's Tunic", type: 'clothing', slot: 'chest', rarity: 'common',
  description: "Simple coarse-woven tunic.", value: 1, weight: 0.5, integrity: 60, max_integrity: 100, is_equipped: true, buc_status: 'uncursed', identification: 'identified'
};

const healingPoultice: Item = {
  id: 'healing-poultice', name: "Healing Poultice", type: 'consumable', rarity: 'common',
  description: "A blend of herbs.", value: 5, weight: 0.2, is_equipped: false, buc_status: 'uncursed', identification: 'identified',
  stats: { health: 25 }, special_effect: "Restores 25 Health"
};

const goldCoin: Item = {
  id: 'test-gold-1', name: 'Gold Coin', type: 'misc', rarity: 'common', description: 'A single septim.', value: 1, weight: 0, is_equipped: false, buc_status: 'uncursed', identification: 'identified'
};

const starterClothing: ClothingLayer = { head: null, neck: null, shoulders: null, chest: starterTunic, underwear: null, legs: null, feet: null, hands: null, waist: null };
const starterClothingState = computeClothingState(starterClothing);

export const initialState: GameState = {
  player: {
    identity: { name: "Vael", race: "Human", birthsign: "The Thief", origin: "Orphan", gender: "female" },
    avatar_url: null,
    stats: { 
      health: 80, max_health: 100, willpower: 90, max_willpower: 100, stamina: 70, max_stamina: 100, 
      lust: 0, trauma: 10, hygiene: 40, corruption: 0, allure: 5, arousal: 0, pain: 5, control: 80, 
      stress: 20, hallucination: 0, purity: 100, devotion: 0
    },
    skills: { seduction: 0, athletics: 5, skulduggery: 10, swimming: 0, dancing: 0, housekeeping: 15, lore_mastery: 50, tending: 0, cooking: 5, foraging: 0 },
    gold: 0, fame: 0, notoriety: 0,
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
      { id: 'feat_first_steps', name: 'First Steps', description: 'Begin your journey.', unlocked: false },
      { id: 'first_victory', name: 'First Victory', description: 'Defeat an enemy.', unlocked: false }
    ],
    temperature: { ambient_temp: 12, clothing_warmth: 15, body_temp: 'chilly' },
    bailey_payment: { weekly_amount: 100, due_day: 0, missed_payments: 0, debt: 0, punishment_level: 0 },
    afflictions: [],
    clothing: starterClothing, clothing_state: starterClothingState,
    inventory: [starterTunic, healingPoultice],
    anatomy: { ...PREDEFINED_ANATOMIES.average, injuries: [] },
    psychology: { outlook: "hopeful", innate: "submissive", paranoia: 0.1, empathy: 0.9, psychopathy: 0.0, phobias: ["darkness"], touch_starved: true, sexuality: "unknown", stoic: false, fragile_ego: true },
    perks_flaws: { hidden_pockets: false, silver_tongue: false, nimble_fingers: true, danger_sense: false, animal_whisperer: true, green_thumb: false, eidetic_memory: false, debt_ridden: false, hunted: false, cursed: false, addictive_personality: false, mute: false, blind_one_eye: false, frail: true, unlucky: false },
    social: { wanted_sibling: false, betrothed: false, exiled: false, guild_member: false, town_pariah: false },
    cosmetics: { hair_length: "shaggy", hair_color: "brown", eye_color: "blue", skin_tone: "fair", tattoos: [], piercings: [], posture: "cautious", scars: [], voice_pitch: "high", scent: "dust and lye", literacy: false, dominant_hand: "right", resting_hr: 75, blushing: true, body_mods: [], true_name: "Vael" },
    arcane: { mana: 100, max_mana: 100, spells: [], active_effects: [], magicka_overcharge: false, blood_vials: 0, true_sight: false, telepathy_unlocked: false, toxicity: 0, withdrawal_timer: 0, soul_gems: [], tattoos: [], runes_active: [], active_rituals: [], corruption_taint: 0, astral_projection: false },
    justice: { suspicion: 0, bounty: 0, evidence_left: 0, jail_sentence: 0, contraband_slots: 0, fence_reputation: 0, black_book_debt: 0, banishment: false, extortion_targets: [] },
    companions: { active_party: [], roster: [], max_encumbrance_bonus: 0 },
    base: { owned: false, location: "none", furniture: [], bed_tier: 0, security_tier: 0, storage: [], alchemy_station: false, bathhouse: false, garden_plot: { planted: false, days_left: 0 }, captive_cell: [], secret_exit: false, property_taxes_due: 0, infestations: false, mannequins: [], library: false, shrine: false },
    subconscious: { rem_phase: 0, lucid_dreaming: false, sleep_paralysis: false, prophetic_dreams: [], trauma_demons_defeated: [], insomnia: 0, dreamless_potions: 0, coma_days: 0, dream_journal: [] },
    biology: { cycle_day: 1, heat_rut_active: false, parasites: [], incubations: [], cravings: [], exhaustion_multiplier: 1.0, post_partum_debuff: 0, sterility: false, fertility_cycle: 'Ovulation', fertility: 0.5, lactation_level: 0 },
    restraints: null, status_effects: [],
    life_sim: {
      needs: { hunger: 100, thirst: 100, energy: 100, hygiene: 100, social: 100, happiness: 80 },
      schedule: { work: null, leisure: null, sleep: null, current_activity: 'idle', activity_remaining_hours: 0 },
      daily_stats: { calories_burned: 0, steps_taken: 0, interactions_count: 0, last_meal_time: 7, last_sleep_time: 0, consecutive_awake_hours: 1 }
    },
    player_job: 'none' as const, level: 1, attributes: { strength: 5, perception: 5, endurance: 5, charisma: 5, intelligence: 5, agility: 5, luck: 5 }, unlocked_perks: [], perk_points: 0, xp: 0, xp_to_next_level: 1000, addiction_state: { addictions: [], overall_dependency: 0 }, transformation: { ascension: 'none' as const, ascension_progress: 0, body_changes: [], mutation_resistance: 50 }, disease_state: { active_diseases: [], immunities: {}, overall_health_penalty: 0 }, parasite_state: { parasites: [], infestation_level: 0, symbiotic_benefits: 0 }, companion_state: { companions: [], max_party_size: 2, party_synergy: 0 }, fame_record: { social: 0, crime: 0, wealth_fame: 0, combat_fame: 0, infamy: 0 }, allure_state: { base_allure: 10, effective_allure: 10, noticeability: 5, intimidation: 0 }, mantling: null, clothing_damage: [], age_days: 18 * 365, quests: [], known_recipes: ['recipe_foraged_salad', 'recipe_herb_tea'],
    dynasty: { house_name: "Unnamed House", prestige: 0, lineage: [], succession_law: 'primogeniture', is_locket_possessed: false, generational_count: 1 }, academy: { enrolled: false, track: 'none', grades: { destruction: 50, restoration: 50, illusion: 50, conjuration: 50, alteration: 50 }, attendance_record: 0, suspension_timer: 0, is_archmage_candidate: false }, origin_config: { socioeconomic: 'peasant', start_condition: 'standard', starting_age_category: 'young' },
    knowledge: { discovered_locations: ['orphanage'], discovered_items: ['orphan-rags'], discovered_npcs: [], discovered_lore: [], discovered_taboos: [], unlocked_spells: [], unlocked_runes: [], active_rituals: [], sexual_awareness: 0, literacy_level: 'illiterate', enlightenment: 0, library_size: 0 }
  },
  world: {
    day: 1, hour: 7, week_day: 0, weather: "Foggy", current_location: LOCATIONS.orphanage,
    macro_events: [], local_tension: 0.1, aggression_counter: 0, active_world_events: [], turn_count: 0, last_intent: null, event_flags: {}, npc_relationships: {}, economy: { inflation: 1.0, shortages: [], caravans: false, taxation: 0, black_market: "active", currency_value: 1.0, businesses: [] }, ecology: { predator_pop: "low", flora: "urban", herb_regrowth: 0 }, factions: { guild_wars: false, guard_patrols: "high" }, npc_state: { waking: true, working: true }, meta_events: { plague: false, economic_crash: false }, settlement: { sanitation: "poor", laws: ["curfew"] }, ambient: { wind_direction: "east", mud: "low" }, arcane: { aetherial_pressure: 10, ley_line_stability: 90 }, justice: { bounty_multiplier: 1.0, patrol_intensity: 50 }, dreamscape: { stability: 100, rift_active: false }, ascension_state: 'none', director_cut: false, active_encounter: null, active_story_event: null, world_epoch: 0, completed_story_arcs: [], narrative_milestones: []
  },
  memory_graph: [],
  ui: {
    isPollingText: false, isPollingImage: false, isGeneratingAvatar: false, currentLog: [], currentImage: null, choices: [],
    apiKey: "", hordeApiKey: "", ui_scale: 1.0, fullscreen: false, ambient_audio: true, haptics_enabled: true, accessibility_mode: false, last_stat_deltas: null, show_stats: false, show_inventory: false, show_map: false, show_quests: false, show_save_load: false, show_xray: false, show_shop: false, show_wardrobe: false, show_social: false, show_feats: false, show_traits: false, show_day_summary: false, show_life_sim_dashboard: false, show_character_creation: false, show_succession: false, show_settings: false, highlighted_part: null, targeted_part: null, combat_animation: null, horde_status: null, horde_monitor: { active: false, text_requests: 0, image_requests: 0, text_eta: 0, image_eta: 0, text_initial_eta: 0, image_initial_eta: 0, text_generation_chance: 0, image_generation_chance: 0 },
    selectedTextModel: "mistralai/mistral-7b-instruct", selectedImageModel: "stable_diffusion",
    settings: { encounter_rate: 0.5, stat_drain_multiplier: 1.0, enable_parasites: true, enable_pregnancy: true, enable_extreme_content: false }, graphics_quality: getDefaultGraphicsQuality()
  },
  sim_world: null, horde_queue: []
};
