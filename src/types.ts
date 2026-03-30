
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

// ── DoL-parity: Attitudes ─────────────────────────────────────────────────
export type AttitudeType = 'defiant' | 'submissive' | 'neutral';

export interface Attitudes {
  /** How the player responds to sexual encounters */
  sexual: AttitudeType;
  /** How the player responds to crime/danger */
  crime: AttitudeType;
  /** How the player responds to labour/work */
  labour: AttitudeType;
}

// ── DoL-parity: Sensitivity ──────────────────────────────────────────────
export interface Sensitivity {
  mouth: number;      // 0-100
  chest: number;      // 0-100
  genitals: number;   // 0-100
  bottom: number;     // 0-100
  thighs: number;     // 0-100
  feet: number;       // 0-100
  hands: number;      // 0-100
}

// ── DoL-parity: Sexual Skills ────────────────────────────────────────────
export interface SexualSkills {
  oral: number;       // 0-100
  vaginal: number;    // 0-100
  anal: number;       // 0-100
  hand: number;       // 0-100
  feet: number;       // 0-100
  penile: number;     // 0-100
}

// ── DoL-parity: Virginities ──────────────────────────────────────────────
export interface Virginities {
  /** null = intact, string = day/event description of how it was lost */
  penile: string | null;
  vaginal: string | null;
  anal: string | null;
  oral: string | null;
  handholding: string | null;
  kiss: string | null;
  temple_marriage: string | null;
}

// ── DoL-parity: Body Fluids ──────────────────────────────────────────────
export interface BodyFluids {
  arousal_wetness: number; // 0-100
  semen_level: number;     // 0-100
  saliva: number;          // 0-100
  tears: number;           // 0-100
  sweat: number;           // 0-100
  milk: number;            // 0-100 (lactation)
}

// ── DoL-parity: Insecurity ───────────────────────────────────────────────
export interface Insecurity {
  /** 0 = confident, 100 = extremely insecure */
  face: number;
  chest: number;
  genitals: number;
  bottom: number;
  body: number;
}

// ── DoL-parity: Lewdity Stats ────────────────────────────────────────────
export interface LewdityStats {
  /** How exhibitionistic the player has become */
  exhibitionism: number;  // 0-100
  /** How promiscuous the player has become */
  promiscuity: number;    // 0-100
  /** Deviancy level */
  deviancy: number;       // 0-100
  /** Masochism level */
  masochism: number;      // 0-100
}

// ── DoL-parity: Traits ───────────────────────────────────────────────────
export interface Trait {
  id: string;
  name: string;
  description: string;
  /** Stat bonuses granted while trait is active */
  effects: Partial<Record<StatKey, number>>;
}

// ── DoL-parity: Feats / Achievements ────────────────────────────────────
export interface Feat {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  /** Day on which this feat was unlocked */
  unlocked_on_day?: number;
}

// ── DoL-parity: Temperature / Warmth ────────────────────────────────────
export interface TemperatureState {
  /** Current environmental temperature (Celsius-like abstract) */
  ambient_temp: number;      // -20 to 50
  /** Player's warmth rating from clothing */
  clothing_warmth: number;   // 0-100
  /** Player's effective body temperature state */
  body_temp: 'freezing' | 'cold' | 'chilly' | 'comfortable' | 'warm' | 'hot' | 'overheating';
}

// ── DoL-parity: Bailey Payment System ───────────────────────────────────
export interface BaileyPayment {
  /** Amount owed each week */
  weekly_amount: number;
  /** Day of the week payment is due (0-6, 0=Monday) */
  due_day: number;
  /** Number of consecutive missed payments */
  missed_payments: number;
  /** Total amount in arrears */
  debt: number;
  /** Punishment escalation level (0=none, 1=scolding, 2=beating, 3=sold) */
  punishment_level: number;
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

// ── Quest System ─────────────────────────────────────────────────────────
export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  count?: number;
  required_count?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'romance';
  status: 'active' | 'completed' | 'failed' | 'locked';
  objectives?: QuestObjective[];
  rewards?: {
    gold?: number;
    items?: string[];
    feats?: string[];
    skills?: Partial<Record<string, number>>;
    xp?: number;
  };
  prerequisites?: string[];
  chapter?: number;
}

// ── Recipe System ────────────────────────────────────────────────────────
export interface RecipeIngredient {
  item_id: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  result: { item_id: string; quantity: number };
  cooking_skill_required: number;
  time_hours: number;
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

/** DoL-parity encounter action — describes what is actively happening to the player sprite. */
export type EncounterAction =
  | 'none'
  | 'grabbed'         // enemy seizes player — arms pulled back
  | 'groped'          // enemy fondling — subtle body squeeze
  | 'thrust'          // rhythmic penetration motion
  | 'oral'            // head bob animation
  | 'kissed'          // face-to-face contact
  | 'climax'          // orgasm tremor — intense shudder
  | 'resist_break'    // resistance overwhelmed — slump
  | 'clothing_tear'   // garment ripped away — flash
  | 'leg_spread'      // legs forced apart
  | 'arms_pinned'     // arms held above head
  | 'prone'           // face-down position
  | 'bent_over'       // bent at waist
  | 'lifted'          // lifted off feet
  | 'caressed'        // gentle stroking — soft sway
  | 'bitten'          // bite — sharp flinch
  | 'spanked'         // impact — quick jolt
  | 'choked'          // neck constriction — gasp
  | 'hair_pulled'     // head yanked back by hair
  | 'scratched'       // claw rake across skin
  | 'licked'          // tongue contact — wet trail
  | 'restrained_tied' // bound with rope/vines — immobilised
  | 'mounted';        // pinned under weight — compressed

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
  /** Current DoL-parity encounter action affecting the player sprite. */
  encounter_action?: EncounterAction;
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
    skills: { seduction: number, athletics: number, skulduggery: number, swimming: number, dancing: number, housekeeping: number, school_grades: number, tending: number, cooking: number, foraging: number },
    gold: number,
    fame: number,
    notoriety: number,
    psych_profile: { submission_index: number, cruelty_index: number, exhibitionism: number, promiscuity: number },
    attitudes: Attitudes,
    sensitivity: Sensitivity,
    sexual_skills: SexualSkills,
    virginities: Virginities,
    body_fluids: BodyFluids,
    insecurity: Insecurity,
    lewdity_stats: LewdityStats,
    traits: Trait[],
    feats: Feat[],
    temperature: TemperatureState,
    bailey_payment: BaileyPayment,
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
    quests: Quest[],
    known_recipes: string[]
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
    show_shop: boolean,
    show_wardrobe: boolean,
    show_social: boolean,
    show_feats: boolean,
    show_traits: boolean,
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
