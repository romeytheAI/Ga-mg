
export interface Anatomy {
  height: string;
  build: string;
  metabolism: string;
  healer: string;
  sleep: string;
  gut: string;
  bones: string;
  flexibility: string;
  blood: string;
  vision: string;
  skin: string;
  pheromones: string;
  visage: string;
  temp_pref: string;
  injuries: {
    description: string;
    stamina_penalty: number;
    health_penalty: number;
  }[];
  organs: {
    heart: number;
    lungs: number;
    stomach: number;
    liver: number;
    kidneys: number;
  };
  bones_integrity: {
    skull: number;
    spine: number;
    ribs: number;
    arms: number;
    legs: number;
  };
}

export interface LifeSim {
  needs: {
    hunger: number;
    thirst: number;
    energy: number;
    hygiene: number;
    social: number;
  };
  schedule: {
    work: string | null;
    leisure: string | null;
    sleep: string | null;
  };
}

export type StatKey = 'health' | 'stamina' | 'willpower' | 'lust' | 'trauma' | 'hygiene' | 'corruption' | 'allure' | 'arousal' | 'pain' | 'control' | 'stress' | 'hallucination' | 'purity';

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc' | 'clothing';
  slot?: 'head' | 'neck' | 'shoulders' | 'chest' | 'underwear' | 'legs' | 'feet' | 'hands' | 'waist';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  stats?: Partial<Record<StatKey, number>>;
  description: string;
  value: number;
  weight: number;
  integrity?: number;
  max_integrity?: number;
  is_equipped?: boolean;
  lore?: string;
  special_effect?: string;
}

export interface ClothingLayer {
  head: Item | null;
  neck: Item | null;
  shoulders: Item | null;
  chest: Item | null;
  underwear: Item | null;
  legs: Item | null;
  feet: Item | null;
  hands: Item | null;
  waist: Item | null;
}

export interface Companion {
  id: string;
  name: string;
  type: 'npc' | 'pet' | 'thrall' | 'familiar';
  affection: number;
  fear: number;
  equipment: Item[];
  tags: string[];
  is_guarding: boolean;
  stats: { health: number };
}

export interface Parasite {
  type: string;
  days_left: number;
  symbiosis: boolean;
  health_drain: number;
  stamina_drain: number;
  corruption_buff: number;
  subservience_toxin: boolean;
}

export interface ActiveEncounter {
  id: string;
  enemy_name: string;
  enemy_type: string;
  enemy_health: number;
  enemy_max_health: number;
  enemy_lust: number;
  enemy_max_lust: number;
  enemy_anger: number;
  enemy_max_anger: number;
  player_stance: 'neutral' | 'defensive' | 'aggressive' | 'submissive';
  turn: number;
  log: string[];
  image_url?: string;
  debuffs: { type: string, duration: number }[];
  targeted_part: string | null;
  anatomy: Anatomy;
}

export interface GameState {
  player: {
    identity: { name: string, race: string, birthsign: string, origin: string, gender: string },
    stats: Record<StatKey, number> & { max_health: number, max_willpower: number, max_stamina: number },
    skills: { seduction: number, athletics: number, skulduggery: number, swimming: number, dancing: number, housekeeping: number, school_grades: number },
    psych_profile: { submission_index: number, cruelty_index: number, exhibitionism: number, promiscuity: number },
    afflictions: string[],
    clothing: ClothingLayer,
    inventory: Item[],
    anatomy: Anatomy,
    psychology: any,
    perks_flaws: any,
    social: any,
    cosmetics: any,
    arcane: any,
    justice: any,
    companions: { active_party: Companion[], roster: Companion[], max_encumbrance_bonus: number },
    base: any,
    subconscious: any,
    biology: { cycle_day: number, heat_rut_active: boolean, parasites: Parasite[], incubations: any[], cravings: string[], exhaustion_multiplier: number, post_partum_debuff: number, sterility: boolean },
    life_sim: LifeSim,
    age_days: number,
    avatar_url?: string | null,
    quests: { id: string, title: string, description: string, status: 'active' | 'completed' | 'failed' }[]
  },
  world: {
    day: number, hour: number, weather: string,
    current_location: { id?: string, name: string, danger: number, atmosphere: string, npcs: any[], actions?: any[] },
    macro_events: string[],
    local_tension: number,
    aggression_counter: number,
    active_world_events: string[],
    turn_count: number,
    last_intent: string | null,
    economy: any,
    ecology: any,
    factions: any,
    npc_state: any,
    meta_events: any,
    settlement: any,
    ambient: any,
    arcane: any,
    justice: any,
    dreamscape: any,
    ascension_state: 'none' | 'pure_soul' | 'void_lord' | 'broodmother' | 'asylum',
    director_cut: boolean,
    active_encounter: ActiveEncounter | null
  },
  memory_graph: string[],
  ui: {
    isPollingText: boolean,
    isPollingImage: boolean,
    isGeneratingAvatar: boolean,
    currentLog: { text: string, type: 'narrative' | 'action' | 'system' }[],
    currentImage: string | null,
    choices: { id: string, label: string, intent: string, successChance?: number }[],
    apiKey: string,
    hordeApiKey: string,
    ui_scale: number,
    fullscreen: boolean,
    ambient_audio: boolean,
    haptics_enabled: boolean,
    accessibility_mode: boolean,
    last_stat_deltas: Partial<Record<StatKey, number>> | null,
    show_stats: boolean,
    show_inventory: boolean,
    show_map: boolean,
    show_quests: boolean,
    show_save_load: boolean,
    show_xray: boolean,
    highlighted_part: string | null,
    targeted_part: string | null,
    combat_animation: string | null,
    horde_status: { status: string, queue: number, wait: number } | null,
    horde_monitor: {
      active: boolean,
      text_requests: number,
      image_requests: number,
      text_eta: number,
      image_eta: number,
      text_initial_eta: number,
      image_initial_eta: number,
      text_generation_chance: number,
      image_generation_chance: number
    },
    selectedTextModel: string,
    selectedImageModel: string,
    settings: {
      encounter_rate: number,
      stat_drain_multiplier: number,
      enable_parasites: boolean,
      enable_pregnancy: boolean,
      enable_extreme_content: boolean
    }
  }
}
