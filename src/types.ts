
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
/**
 * Weekly payment obligation to Bailey (orphanage matron) - core DoL mechanic.
 *
 * Failing to pay on time triggers punishment escalation and debt accumulation.
 * This is the primary money pressure that drives player behavior.
 *
 * @see ADVANCE_TIME reducer for weekly payment checks
 */
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
    happiness: number;
  };
  schedule: {
    /** Active job type — null means unemployed */
    work: JobType | null;
    leisure: string | null;
    sleep: string | null;
    current_activity: 'idle' | 'working' | 'sleeping' | 'eating' | 'socializing' | 'bathing' | 'travelling';
    activity_remaining_hours: number;
  };
  daily_stats: {
    calories_burned: number;
    steps_taken: number;
    interactions_count: number;
    last_meal_time: number;
    last_sleep_time: number;
    consecutive_awake_hours: number;
  };
}

// ── Milestone 9: Job / Economy types ─────────────────────────────────────
/**
 * Player job types — mirrors EconomySystem's JobType from sim/types.ts but
 * re-exported at the game-layer so reducers don't need to import from sim/.
 */
export type JobType = 'laborer' | 'merchant' | 'guard' | 'healer' | 'scholar' | 'thief' | 'farmer' | 'innkeeper' | 'none';

// ── Milestone 9: Addiction / Substance types ──────────────────────────────
export type SubstanceType = 'alcohol' | 'moonsugar' | 'skooma' | 'bloodwine' | 'sleeping_tree_sap' | 'void_salts';

export interface AddictionEntry {
  substance: SubstanceType;
  dependency: number;    // 0–100
  tolerance: number;     // 0–100
  withdrawal: number;    // 0–100
  last_use_turn: number;
  total_uses: number;
}

export interface PlayerAddictionState {
  addictions: AddictionEntry[];
  overall_dependency: number; // 0–100 mean of all active substances
}

// ── Milestone 10: Transformation / Ascension types ──────────────────────────
export type AscensionPath = 'none' | 'divine_spark' | 'daedric_champion' | 'hist_devoted' | 'hircine_chosen' | 'arcane_conduit';

export interface PlayerBodyChange {
  id: string;
  type: 'cosmetic' | 'structural' | 'supernatural';
  description: string;
  turn_acquired: number;
  permanent: boolean;
  stat_effects: Partial<Record<'health' | 'stamina' | 'willpower' | 'allure' | 'corruption', number>>;
}

export interface PlayerTransformation {
  ascension: AscensionPath;
  ascension_progress: number;   // 0–100
  body_changes: PlayerBodyChange[];
  mutation_resistance: number;  // 0–100
}

// ── Milestone 10: Disease types ──────────────────────────────────────────────
export type DiseaseType = 'ataxia' | 'rattles' | 'brain_rot' | 'sanguinare_vampiris' | 'blight' | 'bone_break_fever';

export interface PlayerDiseaseEntry {
  disease: DiseaseType;
  severity: number;        // 0–100
  duration_turns: number;
  treated: boolean;
  immunity: number;        // 0–100
}

export interface PlayerDiseaseState {
  active_diseases: PlayerDiseaseEntry[];
  immunities: Partial<Record<DiseaseType, number>>;
  overall_health_penalty: number;
}

// ── Milestone 10: Parasite types ─────────────────────────────────────────────
export type ParasiteSpecies = 'kwama_larva' | 'cinder_tick' | 'chaurus_larva' | 'ancestor_moth' | 'bone_grub';

export interface PlayerParasiteEntry {
  species: ParasiteSpecies;
  maturity: number;        // 0–100
  symbiosis: number;       // 0–100
  health_drain: number;
  stamina_drain: number;
  corruption_buff: number;
  turn_acquired: number;
}

export interface PlayerParasiteState {
  parasites: PlayerParasiteEntry[];
  infestation_level: number;   // 0–100
  symbiotic_benefits: number;  // 0–100
}

// ── Milestone 10: Companion types ────────────────────────────────────────────
export type CompanionRole = 'fighter' | 'healer' | 'scout' | 'pack_mule' | 'familiar';

export interface PlayerCompanionEntry {
  id: string;
  name: string;
  role: CompanionRole;
  loyalty: number;       // 0–100
  morale: number;        // 0–100
  health: number;        // 0–100
  stamina: number;       // 0–100
  combat_skill: number;  // 0–100
  bond: number;          // 0–100
  turns_together: number;
}

export interface PlayerCompanionState {
  companions: PlayerCompanionEntry[];
  max_party_size: number;
  party_synergy: number; // 0–100
}

// ── Milestone 11: Fame & Allure types ───────────────────────────────────────

/** Detailed breakdown of player fame across social, criminal, and combat categories */
export interface PlayerFameRecord {
  /** Positive social standing — from good deeds, performance, commerce */
  social: number;       // 0–100
  /** Criminal notoriety — from crimes, theft, bounties */
  crime: number;        // 0–100
  /** Merchant/wealth reputation */
  wealth_fame: number;  // 0–100
  /** Combat renown — from fights, guard service, duels */
  combat_fame: number;  // 0–100
  /** General infamy — from scandal, betrayal, hostile acts */
  infamy: number;       // 0–100
}

/** Computed allure and presence state for the player */
export interface PlayerAllureState {
  /** Base attractiveness (from character creation/traits) */
  base_allure: number;  // 0–100
  /** Effective allure after clothing/fame/corruption modifiers */
  effective_allure: number; // 0–100
  /** How noticeable the player is (draws more NPC attention) */
  noticeability: number; // 0–100
  /** How intimidating the player appears (reduces hostile encounter chance) */
  intimidation: number;  // 0–100
}


export interface NpcTimeWindow {
  /** Start hour (0–23) */
  from: number;
  /** End hour (1–24, exclusive) */
  to: number;
}

/** Flags controlling when a schedule slot is active */
export interface NpcScheduleConditions {
  /** Restrict to specific days of week (0=Monday … 6=Sunday). Omit for every day. */
  days_of_week?: number[];
  /** Minimum relationship milestone required */
  min_milestone?: NpcRelationship['milestone'];
  /** event_flag that must be truthy */
  requires_event_flag?: string;
  /** event_flag that must be falsy/absent */
  blocks_event_flag?: string;
}

/** A single timed activity block for an NPC */
export interface NpcScheduleSlot {
  /** Human-readable label (e.g. "At school") */
  label: string;
  /** Location id where the NPC can be found */
  location_id: string;
  /** Time window when active */
  time: NpcTimeWindow;
  /** Optional conditions that restrict availability */
  conditions?: NpcScheduleConditions;
}

/** Full weekly schedule for one NPC */
export interface NpcSchedule {
  /** NPC id (matches NPCS key) */
  npc_id: string;
  /** Ordered list of schedule slots checked top-to-bottom; first match wins */
  slots: NpcScheduleSlot[];
}

// ── DoL-parity: NPC Relationship State ───────────────────────────────────
/**
 * NPC relationship tracking (Phase 2, extended Phase 5).
 *
 * Tracks player's relationship with a single NPC across multiple dimensions.
 * Used for content gating, dialogue choices, and romance progression.
 *
 * @see src/utils/relationshipEngine.ts for interaction resolution logic
 * @example
 * const robin = gameState.world.npc_relationships['robin'];
 * if (robin.milestone === 'lover') {
 *   // Unlock romantic scenes
 * }
 */
export interface NpcRelationship {
  /** NPC id (same key as used in npcs.ts) */
  npc_id: string;
  /** 0–100: how much the NPC trusts the player */
  trust: number;
  /** 0–100: romantic attachment */
  love: number;
  /** 0–100: how afraid the NPC is of the player */
  fear: number;
  /** 0–100: player's dominance over this NPC */
  dom: number;
  /** 0–100: player's submission to this NPC */
  sub: number;
  /** Highest relationship milestone reached */
  milestone: 'stranger' | 'acquaintance' | 'friend' | 'close' | 'lover' | 'bonded';
  /** Game day this NPC was first met */
  met_on_day: number;
  /** Last game day the player interacted with this NPC */
  last_interaction_day: number;
  /** Total number of meaningful interactions with this NPC */
  interaction_count: number;
  /** Encounter/scene flags specific to this NPC */
  scene_flags: Record<string, boolean | number>;
}

// ── DoL-parity: Player Justice ────────────────────────────────────────────
export interface PlayerJustice {
  suspicion: number;
  bounty: number;
  evidence_left: number;
  jail_sentence: number;
  contraband_slots: number;
  fence_reputation: number;
  black_book_debt: number;
  banishment: boolean;
  extortion_targets: string[];
}

// ── DoL-parity: Player Psychology ─────────────────────────────────────────
export interface PlayerPsychology {
  outlook: string;
  innate: string;
  paranoia: number;
  empathy: number;
  psychopathy: number;
  phobias: string[];
  touch_starved: boolean;
  sexuality: string;
  stoic: boolean;
  fragile_ego: boolean;
}

// ── DoL-parity: Player Perks / Flaws ──────────────────────────────────────
export interface PlayerPerksFlaws {
  hidden_pockets: boolean;
  silver_tongue: boolean;
  nimble_fingers: boolean;
  danger_sense: boolean;
  animal_whisperer: boolean;
  green_thumb: boolean;
  eidetic_memory: boolean;
  debt_ridden: boolean;
  hunted: boolean;
  cursed: boolean;
  addictive_personality: boolean;
  mute: boolean;
  blind_one_eye: boolean;
  frail: boolean;
  unlucky: boolean;
}

// ── DoL-parity: Player Social Flags ───────────────────────────────────────
export interface PlayerSocial {
  wanted_sibling: boolean;
  betrothed: boolean;
  exiled: boolean;
  guild_member: boolean;
  town_pariah: boolean;
}

export type MagicSchool = 'destruction' | 'restoration' | 'illusion' | 'conjuration' | 'alteration' | 'mysticism';
export type SpellTier = 'novice' | 'apprentice' | 'adept' | 'expert' | 'master';

export interface Spell {
  id: string;
  name: string;
  school: MagicSchool;
  tier: SpellTier;
  magicka_cost: number;
  effect_id: string;
  description: string;
}

export interface ActiveEffect {
  id: string;
  effect_id?: string; // used for logic checks like 'soul_trap'
  name: string;
  type: 'buff' | 'debuff' | 'curse' | 'boon';
  duration: number; // in hours
  magnitude: number;
  school?: MagicSchool;
}

// ── DoL-parity: Player Arcane ──────────────────────────────────────────────
export interface PlayerArcane {
  mana: number;
  max_mana: number;
  spells: Spell[];
  active_effects: ActiveEffect[];
  magicka_overcharge: boolean;
  blood_vials: number;
  true_sight: boolean;
  telepathy_unlocked: boolean;
  toxicity: number;
  withdrawal_timer: number;
  soul_gems: { id: string, size: 'petty'|'lesser'|'common'|'greater'|'grand'|'black', filled: boolean, soul_type?: string }[];
  tattoos: string[];
  runes_active: { id: string, type: string, power: number, location: string }[];
  active_rituals: { id: string, progress: number, components_added: string[] }[];
  corruption_taint: number;
  astral_projection: boolean;
}

// ── DoL-parity: Player Base / Property ────────────────────────────────────
export interface PlayerBase {
  owned: boolean;
  location: string;
  furniture: string[];
  bed_tier: number;
  security_tier: number;
  storage: string[];
  alchemy_station: boolean;
  bathhouse: boolean;
  garden_plot: { planted: boolean; days_left: number };
  captive_cell: string[];
  secret_exit: boolean;
  property_taxes_due: number;
  infestations: boolean;
  mannequins: string[];
  library: boolean;
  shrine: boolean;
}

// ── DoL-parity: Player Subconscious ──────────────────────────────────────
export interface PlayerSubconscious {
  rem_phase: number;
  lucid_dreaming: boolean;
  sleep_paralysis: boolean;
  prophetic_dreams: string[];
  trauma_demons_defeated: string[];
  insomnia: number;
  dreamless_potions: number;
  coma_days: number;
  dream_journal: string[];
}

export type StatKey = 'health' | 'stamina' | 'willpower' | 'lust' | 'trauma' | 'hygiene' | 'corruption' | 'allure' | 'arousal' | 'pain' | 'control' | 'stress' | 'hallucination' | 'purity' | 'devotion';

export type ClothingSlot =
  | 'head'
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'underwear'
  | 'legs'
  | 'feet'
  | 'hands'
  | 'waist';

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc' | 'clothing';
  slot?: ClothingSlot;
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
  buc_status?: 'blessed' | 'uncursed' | 'cursed';
  identification?: 'unidentified' | 'familiar' | 'identified';
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

export type ClothingDisplacement = 'secure' | 'shifted' | 'displaced' | 'removed';
export type ClothingExposure = 'covered' | 'partial' | 'bare';

export interface ClothingSlotState {
  slot: ClothingSlot;
  equipped_item_id: string | null;
  integrity: number;
  wetness: number;
  displacement: ClothingDisplacement;
  coverage: number;
  exposure: ClothingExposure;
}

export interface ClothingSummary {
  exposure_score: number;
  indecent_slots: ClothingSlot[];
  partial_slots: ClothingSlot[];
  warmth: number;
}

export interface ClothingState {
  slots: Record<ClothingSlot, ClothingSlotState>;
  summary: ClothingSummary;
}

// ── Restraint System ──────────────────────────────────────────────────────
export type RestraintSlot = 'wrists' | 'ankles' | 'neck' | 'waist' | 'mouth';

export interface RestraintEntry {
  slot: RestraintSlot;
  name: string;
  strength: number;    // 0-100, difficulty to escape
  comfort: number;     // 0-100, 0 = painful
  turn_applied: number;
}

export interface PlayerRestraints {
  entries: RestraintEntry[];
  escape_progress: number;  // 0-100
  movement_penalty: number; // 0-1, fraction of movement lost
  action_penalty: number;   // 0-1, fraction of action effectiveness lost
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

export interface ActiveStoryEvent {
  id: string;
  current_node: string;
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

// ── Graphics Quality Settings ────────────────────────────────────────────
/** Quality preset levels for graphics rendering */
export type GraphicsQualityPreset = 'low' | 'medium' | 'high' | 'ultra';

/**
 * Comprehensive graphics quality configuration for DoL-fidelity rendering.
 *
 * Controls 2D sprite quality, 3D rendering, animation fidelity, and performance.
 * Presets auto-configure all settings based on device capabilities.
 *
 * @see src/utils/graphicsQuality.ts for presets and auto-detection
 * @see docs/GRAPHICS-QUALITY-SYSTEM.md for full documentation
 */
export interface GraphicsQuality {
  /** Overall quality preset (overrides individual settings when changed) */
  preset: GraphicsQualityPreset;

  /** Sprite rendering quality */
  sprite_quality: {
    /** Enable subsurface scattering filters on skin */
    subsurface_scattering: boolean;
    /** Enable gradient shading (vs flat colors) */
    gradient_shading: boolean;
    /** Muscle definition detail level (0=none, 1=basic, 2=detailed, 3=full) */
    muscle_detail_level: 0 | 1 | 2 | 3;
    /** Enable fluid effects rendering */
    fluid_effects: boolean;
    /** Enable cosmetic details (freckles, tan lines, etc.) */
    cosmetic_details: boolean;
    /** Enable X-ray overlay rendering */
    xray_overlay: boolean;
  };

  /** 3D rendering quality */
  renderer_3d: {
    /** Enable 3D rendering (if false, use 2D only) */
    enabled: boolean;
    /** Polygon count multiplier (0.5=low, 1.0=medium, 1.5=high, 2.0=ultra) */
    polygon_multiplier: number;
    /** Enable PBR materials (physically-based rendering) */
    pbr_materials: boolean;
    /** Enable normal mapping for surface detail */
    normal_mapping: boolean;
    /** Enable environment mapping for reflections */
    environment_mapping: boolean;
    /** Shadow quality (0=off, 1=low, 2=medium, 3=high) */
    shadow_quality: 0 | 1 | 2 | 3;
    /** Anti-aliasing samples (0=off, 2=FXAA, 4=MSAA4x, 8=MSAA8x) */
    antialiasing: 0 | 2 | 4 | 8;
    /** Pixel ratio multiplier (0.5=540p, 1.0=1080p, 1.5=1620p, 2.0=4K) */
    pixel_ratio: number;
  };

  /** Animation quality */
  animation: {
    /** Enable smooth animation interpolation */
    smooth_interpolation: boolean;
    /** Animation frame rate limit (30 or 60) */
    target_fps: 30 | 60;
    /** Enable particle effects (sweat drops, blood splatter, etc.) */
    particle_effects: boolean;
    /** Enable physics-based animations (hair, clothing) */
    physics_simulation: boolean;
  };

  /** Performance optimizations */
  performance: {
    /** Enable LOD (Level of Detail) system */
    lod_enabled: boolean;
    /** Asset cache size in MB (50, 100, 200, 500) */
    cache_size_mb: 50 | 100 | 200 | 500;
    /** Enable dynamic resolution scaling based on performance */
    dynamic_resolution: boolean;
    /** Minimum resolution scale when dynamic (0.5 to 1.0) */
    min_resolution_scale: number;
  };
}

/**
 * Root game state interface - canonical schema for all durable game data.
 *
 * This is the complete state tree for Ga-mg (Aetherius), designed for:
 * - Full save/load serialization (via saveManager.ts)
 * - DoL-parity gameplay systems (stats, relationships, crime, factions)
 * - React state management via gameReducer
 *
 * @see docs/STATE-SCHEMA.md for complete documentation and usage examples
 * @version 3.0 (SAVE_SCHEMA_VERSION in saveManager.ts)
 */
export interface GameState {
  /** Player character state - identity, stats, inventory, subsystems */
  player: {
    /** Core character identity - immutable after character creation */
    identity: { name: string, race: string, birthsign: string, origin: string, gender: string },
    /** Core stats - all StatKeys (health, stamina, willpower, lust, trauma, etc.) + max values */
    stats: Record<StatKey, number> & { max_health: number, max_willpower: number, max_stamina: number },
    /** Player skills - all 0-100 scale, trainable through gameplay */
    skills: { seduction: number, athletics: number, skulduggery: number, swimming: number, dancing: number, housekeeping: number, lore_mastery: number, tending: number, cooking: number, foraging: number },
    /** Currency - earned through jobs, theft, rewards */
    gold: number,
    /** Positive reputation - increases from heroic acts, performance */
    fame: number,
    /** Negative reputation - increases from crime, scandal */
    notoriety: number,
    /** Behavioral tendencies (0-100 scale) - affects NPC reactions and content gating */
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
    clothing_state: ClothingState,
    inventory: Item[],
    anatomy: Anatomy,
    psychology: PlayerPsychology,
    perks_flaws: PlayerPerksFlaws,
    social: PlayerSocial,
    cosmetics: Cosmetics,
    arcane: PlayerArcane,
    justice: PlayerJustice,
    companions: { active_party: Companion[], roster: Companion[], max_encumbrance_bonus: number },
    base: PlayerBase,
    subconscious: PlayerSubconscious,
    biology: { cycle_day: number, heat_rut_active: boolean, parasites: Parasite[], incubations: Incubation[], cravings: string[], exhaustion_multiplier: number, post_partum_debuff: number, sterility: boolean, fertility_cycle: string, fertility: number, lactation_level: number },
    restraints: PlayerRestraints | null,
    status_effects: string[],
    life_sim: LifeSim,
    /** Active job type — 'none' when unemployed (Milestone 9) */
    player_job: JobType,
    level: number,
    /** S.P.E.C.I.A.L. Attribute System (Fallout/CDDA-style) */
    attributes: {
      strength: number;     // STR: Carry weight, physical damage
      perception: number;   // PER: Discovery chance, accuracy
      endurance: number;    // END: Max health, stamina regen, resistance
      charisma: number;     // CHA: Seduction, trading, NPC trust
      intelligence: number; // INT: Lore mastery, xp gain, literacy speed
      agility: number;      // AGI: Stealth, fleeing, movement
      luck: number;         // LCK: Random event quality, crit chance
    },
    /** Permanent traits and unlocked abilities (NV Perk Style) */
    unlocked_perks: {
      id: string;
      name: string;
      tier: number;
      rank: number;
    }[],
    perk_points: number,
    xp: number,
    xp_to_next_level: number,
    /** Substance addiction state — tracks dependency, tolerance, withdrawal (Milestone 9) */
    addiction_state: PlayerAddictionState,
    /** Body transformation and ascension path (Milestone 10) */
    transformation: PlayerTransformation,
    /** Active diseases and immunities (Milestone 10) */
    disease_state: PlayerDiseaseState,
    /** Parasite infestation state (Milestone 10) */
    parasite_state: PlayerParasiteState,
    /** Party companion roster (Milestone 10) */
    companion_state: PlayerCompanionState,
    /** Fame breakdown across social/crime/wealth/combat/infamy categories (Milestone 11) */
    fame_record: PlayerFameRecord,
    /** Computed allure and presence state (Milestone 11) */
    allure_state: PlayerAllureState,
    mantling: import('./sim/types').MantlingState | null,
    clothing_damage: import('./sim/types').ClothingDamage[],
    age_days: number,
    avatar_url?: string | null,
    quests: Quest[],
    known_recipes: string[],
    /** Dynasty and multi-generational lineage tracking (CK3-style) */
    dynasty: {
      house_name: string;
      prestige: number;
      lineage: { id: string, name: string, relationship: 'parent'|'child'|'sibling'|'spouse', status: 'alive'|'dead', traits: string[] }[];
      succession_law: 'primogeniture' | 'ultimogeniture' | 'seniority' | 'elective';
      is_locket_possessed: boolean;
      generational_count: number;
    },
    /** Winterhold / Academy system (DoL-parity School) */
    academy: {
      enrolled: boolean;
      track: 'destruction' | 'restoration' | 'illusion' | 'conjuration' | 'alteration' | 'none';
      grades: Record<string, number>; // track -> 0-100
      attendance_record: number; // consecutive days
      suspension_timer: number;
      is_archmage_candidate: boolean;
    },
    /** Special starting modifiers and socioeconomic status */
    origin_config: {
      socioeconomic: 'destitute' | 'peasant' | 'merchant' | 'noble' | 'outcast';
      start_condition: 'standard' | 'experiment' | 'refugee' | 'possessed_locket';
      starting_age_category: 'young' | 'adult' | 'middle_aged' | 'elder';
    },
    /** Player's discovered knowledge - items, locations, NPCs, lore (Phase 6) */
    knowledge: {
      discovered_locations: string[], // ids
      discovered_items: string[],      // ids
      discovered_npcs: string[],       // ids
      discovered_lore: string[],       // ids
      discovered_taboos: string[],     // cultural boundaries known
      unlocked_spells: string[],
      unlocked_runes: string[],
      active_rituals: string[],
      sexual_awareness: number,        // 0-100 (DoL-parity Awareness)
      literacy_level: 'illiterate' | 'basic' | 'fluent' | 'scholar' | 'sage';
      enlightenment: number;           // 0-100, grants metaphysical insight
      library_size: number;
    }
  },
  /** World simulation state - time, location, events, NPCs, factions */
  world: {
    /** Current game day (increments at midnight) */
    day: number,
    /** Current hour (0-23) */
    hour: number,
    /** Day of week: 0 = Monday … 6 = Sunday (Phase 4: NPC schedules) */
    week_day: number,
    /** Weather descriptor - affects travel, encounters, NPC schedules */
    weather: string,
    /** Player's current location - resolved from LOCATIONS registry */
    current_location: { id?: string, name: string, danger: number, atmosphere: string, npcs: any[], actions?: any[] },
    /** World-level event tags (wars, plagues, festivals) */
    macro_events: string[],
    /** Local danger level (0-1 scale) - affects encounter rate */
    local_tension: number,
    aggression_counter: number,
    active_world_events: string[],
    turn_count: number,
    last_intent: string | null,
    /** Persistent event/scene/content-gate flags (Phase 2) - boolean gates or numeric counters */
    event_flags: Record<string, boolean | number>,
    /** Per-NPC relationship state, keyed by npc_id (Phase 2, extended Phase 5) */
    npc_relationships: Record<string, NpcRelationship>,
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
    ascension_state: 'none' | 'divine_spark' | 'daedric_champion' | 'hist_devoted' | 'sheogorath_touched',
    director_cut: boolean,
    active_encounter: ActiveEncounter | null,
    active_story_event: ActiveStoryEvent | null,
    /** Major narrative epoch counter — increments when milestone arcs complete */
    world_epoch: number,
    /** IDs of completed story arcs (dialogue trees seen to completion) */
    completed_story_arcs: string[],
    /** Named narrative milestones for gating content (e.g. 'escaped_orphanage') */
    narrative_milestones: string[]
  },
  memory_graph: string[],
  /** UI/presentation layer state - polling, display, settings (not persisted in saves) */
  ui: {
    /** AI Horde text generation in progress */
    isPollingText: boolean,
    /** AI Horde image generation in progress */
    isPollingImage: boolean,
    /** Avatar generation in progress */
    isGeneratingAvatar: boolean,
    /** Story/action log displayed in main panel */
    currentLog: { text: string, type: 'narrative' | 'action' | 'system' }[],
    /** Current generated image URL */
    currentImage: string | null,
    /** Available player actions - presented as buttons/choices */
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
    show_day_summary: boolean,
    show_life_sim_dashboard: boolean,
    show_character_creation: boolean,
    show_succession: boolean,
    show_settings: boolean,
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
    },
    graphics_quality: GraphicsQuality
  },
  /** Low-level simulation engine state (NPCs, economy, factions, crime) - see src/sim/types.ts */
  sim_world: import('./sim/types').SimWorld | null,
  /** AI Horde request queue for async narrative generation */
  horde_queue: import('./sim/types').HordeRequest[],
}
