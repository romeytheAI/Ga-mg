
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

  // ── Racial body-part fields ──────────────────────────────────────────────
  /** Approximate height in centimetres (derived from race if not overridden) */
  height_cm?: number;
  /** Ear morphology */
  ear_type?: 'round' | 'pointed_long' | 'pointed_short' | 'cat' | 'reptilian_none';
  /** Whether character has a visible tail */
  has_tail?: boolean;
  /** Whether character has tusks (lower jaw) */
  has_tusks?: boolean;
  /** Heavy bony brow ridge */
  has_heavy_brow?: boolean;
  /** Elongated snout / muzzle */
  has_muzzle?: boolean;
  /** Head protrusions: horns, frills (Argonian) */
  has_head_protrusions?: boolean;
  /** Leg skeletal structure */
  leg_type?: 'plantigrade' | 'digitigrade';
  /** Hand/claw morphology */
  hand_type?: 'human' | 'clawed_light' | 'clawed_heavy' | 'pawed';
  /** Foot morphology */
  foot_type?: 'human' | 'clawed' | 'pawed_digitigrade';
  /** Surface covering type */
  skin_surface?: 'skin' | 'scales' | 'fur';
  /** Surface pattern for scales/fur */
  surface_pattern?: 'none' | 'scales_smooth' | 'scales_ridge' | 'fur_solid' | 'fur_spotted' | 'fur_striped' | 'tattoo_warpaint';
  /** Secondary / accent color for racial markings */
  accent_color?: string;
  // ── Per body-part integrity (0–100) ──────────────────────────────────────
  body_parts?: {
    head: number;
    neck: number;
    upper_arm_l: number;
    upper_arm_r: number;
    forearm_l: number;
    forearm_r: number;
    hand_l: number;
    hand_r: number;
    torso: number;
    abdomen: number;
    pelvis: number;
    thigh_l: number;
    thigh_r: number;
    calf_l: number;
    calf_r: number;
    foot_l: number;
    foot_r: number;
    tail?: number;
  };
}

export interface CosmeticScar {
  location: 'face' | 'chest' | 'abdomen' | 'back' | 'arms' | 'legs' | 'neck';
  type?: 'slash' | 'burn' | 'puncture' | 'brand';
}

export interface CosmeticTattoo {
  location: 'face' | 'chest' | 'abdomen' | 'back' | 'arms' | 'legs' | 'neck' | 'shoulder';
  design?: string;
  color?: string;
}

export interface CosmeticPiercing {
  location: 'ear_left' | 'ear_right' | 'nose' | 'lip' | 'navel' | 'nipple_left' | 'nipple_right' | 'eyebrow' | 'tongue';
}

export interface Cosmetics {
  hair_length: string;
  hair_color: string;
  eye_color: string;
  skin_tone: string;
  tattoos: (string | CosmeticTattoo)[];
  piercings: (string | CosmeticPiercing)[];
  posture: string;
  scars: (string | CosmeticScar)[];
  voice_pitch: string;
  scent: string;
  literacy: boolean;
  dominant_hand: string;
  resting_hr: number;
  blushing: boolean;
  body_mods: string[];
  true_name: string;
  freckles?: boolean;
  tan_lines?: boolean;
  makeup?: {
    lipstick?: string;
    eyeliner?: boolean;
    blush_cosmetic?: boolean;
    eyeshadow?: string;
  };
  body_writing?: { text: string; location: 'chest' | 'abdomen' | 'thigh' | 'arm' | 'back' }[];
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

export interface Incubation {
  type: string;
  progress: number;
  days_remaining: number;
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
    cosmetics: Cosmetics,
    arcane: any,
    justice: any,
    companions: { active_party: Companion[], roster: Companion[], max_encumbrance_bonus: number },
    base: any,
    subconscious: any,
    biology: { cycle_day: number, heat_rut_active: boolean, parasites: Parasite[], incubations: Incubation[], cravings: string[], exhaustion_multiplier: number, post_partum_debuff: number, sterility: boolean, fertility_cycle: string, fertility: number, lactation_level: number },
    status_effects: string[],
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
  },
  sim_world: import('./sim/types').SimWorld | null,
  horde_queue: import('./sim/types').HordeRequest[],
}
