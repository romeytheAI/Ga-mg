// Simulation system types — independent from UI layer

// ── Needs ────────────────────────────────────────────────────────────────────
export interface NpcNeeds {
  hunger: number;     // 0-100, 100 = full
  energy: number;     // 0-100, 100 = rested
  social: number;     // 0-100, 100 = satisfied
  happiness: number;  // 0-100
  wealth: number;     // abstract units
}

// ── Memory ────────────────────────────────────────────────────────────────────
export interface MemoryEntry {
  turn: number;
  event: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  subject_id: string | null; // entity that caused the event
  weight: number;            // 0-1 decay weight
}

// ── Relationship ──────────────────────────────────────────────────────────────
export interface Relationship {
  target_id: string;
  affection: number;    // -100 to 100
  trust: number;        // -100 to 100
  fear: number;         // 0-100
  familiarity: number;  // 0-100, increases with interactions
  last_interaction: number; // turn number
  romance: RomanceState | null; // null = no romantic interest
}

// ── Romance (DoL core loop) ─────────────────────────────────────────────────
export type RomanceStage = 'none' | 'attracted' | 'flirting' | 'courting' | 'dating' | 'committed' | 'rejected' | 'broken_up';

export interface RomanceState {
  stage: RomanceStage;
  attraction: number;     // 0-100, physical/emotional draw
  intimacy: number;       // 0-100, closeness / emotional bond
  passion: number;        // 0-100, romantic intensity
  jealousy: number;       // 0-100, possessiveness
  compatibility: number;  // 0-100, how well they match (based on traits)
  dates_count: number;    // number of "date" interactions
  rejection_count: number; // times rejected advances
  last_date_turn: number; // turn of last romantic interaction
}

// ── Economy ──────────────────────────────────────────────────────────────────
export type JobType = 'laborer' | 'merchant' | 'guard' | 'healer' | 'scholar' | 'thief' | 'farmer' | 'innkeeper' | 'none';

export interface EconomyEntry {
  resource: string;
  base_price: number;
  current_price: number;
  supply: number;
  demand: number;
}

// ── Skills (DoL core loop) ───────────────────────────────────────────────────
export interface NpcSkills {
  athletics: number;     // 0-100
  swimming: number;      // 0-100
  dancing: number;       // 0-100
  skulduggery: number;   // 0-100
  seduction: number;     // 0-100
  housekeeping: number;  // 0-100
  combat: number;        // 0-100
}

export type SkillKey = keyof NpcSkills;

// ── Corruption / Purity (DoL core loop) ──────────────────────────────────────
export interface CorruptionState {
  corruption: number;    // 0-100, 0 = pure
  purity: number;        // 0-100, starts high, eroded by corruption
  willpower: number;     // 0-100, mental resilience
  stress: number;        // 0-100, psychological pressure
  trauma: number;        // 0-100, lasting psychological damage
  control: number;       // 0-100, self-control
  submission: number;    // 0-100, tendency toward submission
}

// ── Fame (DoL core loop) ─────────────────────────────────────────────────────
export interface FameRecord {
  social: number;        // 0-100, general renown
  crime: number;         // 0-100, criminal notoriety
  wealth_fame: number;   // 0-100, known for riches
  combat_fame: number;   // 0-100, known fighter
  infamy: number;        // 0-100, general negative reputation
}

export type FameType = keyof FameRecord;

// ── Clothing (DoL core loop) ────────────────────────────────────────────────
export interface ClothingItem {
  id: string;
  name: string;
  slot: ClothingSlot;
  integrity: number;     // 0-100, 0 = destroyed
  warmth: number;        // 0-1 warmth factor
  concealment: number;   // 0-1 how much it covers
  allure: number;        // 0-1 attractiveness modifier
}

export type ClothingSlot = 'head' | 'chest' | 'legs' | 'feet' | 'hands' | 'underwear';

export interface ClothingLoadout {
  head: ClothingItem | null;
  chest: ClothingItem | null;
  legs: ClothingItem | null;
  feet: ClothingItem | null;
  hands: ClothingItem | null;
  underwear: ClothingItem | null;
}

// ── Combat (DoL core loop) ──────────────────────────────────────────────────
export type CombatStance = 'neutral' | 'defensive' | 'aggressive' | 'submissive' | 'evasive';

export interface CombatParticipant {
  id: string;
  health: number;
  stamina: number;
  stance: CombatStance;
  combat_skill: number;
  athletics: number;
}

export interface CombatEncounter {
  attacker_id: string;
  defender_id: string;
  turn_count: number;
  resolved: boolean;
  outcome: 'attacker_wins' | 'defender_wins' | 'defender_escaped' | 'ongoing';
  log: string[];
}

// ── NPC ──────────────────────────────────────────────────────────────────────
export type NpcTrait =
  | 'brave' | 'cowardly' | 'greedy' | 'generous' | 'aggressive' | 'passive'
  | 'flirtatious' | 'reserved' | 'curious' | 'paranoid' | 'loyal' | 'treacherous';

export type NpcState = 'idle' | 'working' | 'socializing' | 'eating' | 'sleeping'
  | 'fleeing' | 'hostile' | 'trading' | 'travelling' | 'exercising' | 'studying';

export interface SimNpc {
  id: string;
  name: string;
  race: string;
  gender: string;
  age: number;
  job: JobType;
  traits: NpcTrait[];
  needs: NpcNeeds;
  skills: NpcSkills;
  corruption_state: CorruptionState;
  fame: FameRecord;
  clothing: ClothingLoadout;
  memory: MemoryEntry[];
  relationships: Relationship[];
  current_state: NpcState;
  location_id: string;
  target_location_id: string | null; // destination when travelling
  stats: {
    health: number;
    stamina: number;
    gold: number;
  };
  schedule: DailySchedule;
  backstory?: string;   // async filled by AI Horde
  dialogue_cache: Record<string, string>;
  transformation: TransformationState;
  addiction_state: AddictionState;
  disease_state: DiseaseState;
  arcane_state: ArcaneState;
  parasite_state: ParasiteState;
  companion_state: CompanionState;
  allure_state: AllureState;
  restraint_state: RestraintState;
}

// ── Schedule ─────────────────────────────────────────────────────────────────
export interface ScheduleSlot {
  hour_start: number;
  hour_end: number;
  activity: NpcState;
  location_id: string;
}

export interface DailySchedule {
  slots: ScheduleSlot[];
}

// ── World ────────────────────────────────────────────────────────────────────
export interface SimWorld {
  turn: number;
  day: number;
  hour: number;        // 0-23
  weather: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  npcs: SimNpc[];
  economy: EconomyEntry[];
  global_events: string[];
  locations: SimLocation[];
  active_combats: CombatEncounter[];
  factions: FactionEntry[];
  criminal_records: Record<string, CriminalRecord>; // keyed by entity id
}

export interface SimLocation {
  id: string;
  name: string;
  type: 'town' | 'wilderness' | 'dungeon' | 'home' | 'market' | 'tavern' | 'farm'
    | 'school' | 'temple' | 'docks' | 'alleyway' | 'brothel' | 'park' | 'hospital'
    | 'prison' | 'strip_club' | 'dance_studio' | 'arcade' | 'shopping' | 'moor'
    | 'cave' | 'cabin' | 'ocean' | 'sewers' | 'museum' | 'cafe';
  x: number;
  y: number;
  danger: number;       // 0-1
  prosperity: number;   // 0-1
  npcs_present: string[]; // npc ids
}

// ── Utility AI ───────────────────────────────────────────────────────────────
export interface UtilityAction {
  id: string;
  label: string;
  target_state: NpcState;
  need_satisfied: keyof NpcNeeds | null;
  need_gain: number;
  preconditions: Partial<NpcNeeds>; // minimum need values required
  energy_cost: number;
  social_target?: string; // npc id for social actions
  skill_trained?: SkillKey; // skill improved by this action
}

// ── Horde AI Queue ────────────────────────────────────────────────────────────
export interface HordeRequest {
  id: string;
  type: 'backstory' | 'dialogue' | 'event_narrative' | 'world_description';
  prompt: string;
  subject_id: string;
  status: 'queued' | 'pending' | 'done' | 'failed';
  retries: number;
  horde_job_id?: string;
  result?: string;
}

// ── Transformation ──────────────────────────────────────────────────────────
export type AscensionPath = 'none' | 'pure_soul' | 'void_lord' | 'broodmother' | 'beast_kin' | 'arcane_vessel';

export interface TransformationState {
  ascension: AscensionPath;
  ascension_progress: number; // 0-100
  body_changes: BodyChange[];
  mutation_resistance: number; // 0-100
}

export interface BodyChange {
  id: string;
  type: 'cosmetic' | 'structural' | 'supernatural';
  description: string;
  turn_acquired: number;
  permanent: boolean;
  stat_effects: Partial<Record<'health' | 'stamina' | 'willpower' | 'allure' | 'corruption', number>>;
}

// ── Addiction ────────────────────────────────────────────────────────────────
export type SubstanceType = 'alcohol' | 'moonsugar' | 'skooma' | 'bloodwine' | 'sleeping_tree_sap' | 'void_salts';

export interface AddictionEntry {
  substance: SubstanceType;
  dependency: number;   // 0-100, 0 = clean
  tolerance: number;    // 0-100, higher = needs more
  withdrawal: number;   // 0-100, active withdrawal severity
  last_use_turn: number;
  total_uses: number;
}

export interface AddictionState {
  addictions: AddictionEntry[];
  overall_dependency: number; // 0-100
}

// ── Disease ──────────────────────────────────────────────────────────────────
export type DiseaseType = 'ataxia' | 'rattles' | 'brain_rot' | 'sanguinare_vampiris' | 'blight' | 'bone_break_fever';

export interface DiseaseEntry {
  disease: DiseaseType;
  severity: number;       // 0-100
  duration_turns: number;  // how long infected
  treated: boolean;
  immunity: number;       // 0-100, resistance after recovery
}

export interface DiseaseState {
  active_diseases: DiseaseEntry[];
  immunities: Partial<Record<DiseaseType, number>>; // 0-100 per disease
  overall_health_penalty: number; // 0-100
}

// ── Arcane ───────────────────────────────────────────────────────────────────
export type SpellSchool = 'restoration' | 'destruction' | 'illusion' | 'conjuration' | 'ward' | 'hex';
export type EnchantmentType = 'blessing' | 'curse';

export interface Enchantment {
  id: string;
  name: string;
  type: EnchantmentType;
  school: SpellSchool;
  potency: number;     // 0-100
  duration_remaining: number; // turns, -1 = permanent
  stat_effects: Partial<Record<'health' | 'stamina' | 'willpower' | 'corruption' | 'stress' | 'luck', number>>;
}

export interface ArcaneState {
  mana: number;          // 0-100
  mana_regen: number;    // per tick
  spell_affinity: Partial<Record<SpellSchool, number>>; // 0-100 per school
  enchantments: Enchantment[];
  arcane_corruption: number; // 0-100, risk from overuse
}

// ── Parasite ─────────────────────────────────────────────────────────────────
export type ParasiteSpecies = 'brain_worm' | 'blood_leech' | 'void_tick' | 'dream_moth' | 'marrow_grub';

export interface ParasiteEntry {
  species: ParasiteSpecies;
  maturity: number;       // 0-100, growth stage
  symbiosis: number;      // 0-100, 0 = hostile, 100 = mutualistic
  health_drain: number;   // per tick
  stamina_drain: number;  // per tick
  corruption_buff: number; // corruption added per tick
  turn_acquired: number;
}

export interface ParasiteState {
  parasites: ParasiteEntry[];
  infestation_level: number; // 0-100
  symbiotic_benefits: number; // 0-100
}

// ── Companion ────────────────────────────────────────────────────────────────
export type CompanionRole = 'fighter' | 'healer' | 'scout' | 'pack_mule' | 'familiar';

export interface CompanionEntry {
  id: string;
  name: string;
  role: CompanionRole;
  loyalty: number;       // 0-100
  morale: number;        // 0-100
  health: number;        // 0-100
  stamina: number;       // 0-100
  combat_skill: number;  // 0-100
  bond: number;          // 0-100, emotional connection
  turns_together: number;
}

export interface CompanionState {
  companions: CompanionEntry[];
  max_party_size: number;
  party_synergy: number; // 0-100
}

// ── Allure ───────────────────────────────────────────────────────────────────
export interface AllureState {
  base_allure: number;      // 0-100
  effective_allure: number; // computed from base + modifiers
  noticeability: number;    // 0-100, how much attention drawn
  intimidation: number;     // 0-100, physical threat level
}

// ── Restraint ────────────────────────────────────────────────────────────────
export type RestraintSlot = 'wrists' | 'ankles' | 'neck' | 'waist' | 'mouth';

export interface RestraintEntry {
  slot: RestraintSlot;
  name: string;
  strength: number;     // 0-100, difficulty to escape
  comfort: number;      // 0-100, 0 = painful
  turn_applied: number;
}

export interface RestraintState {
  restraints: RestraintEntry[];
  escape_progress: number; // 0-100
  movement_penalty: number; // 0-1, fraction of movement lost
  action_penalty: number;   // 0-1, fraction of action effectiveness lost
}

// ── Faction System ─────────────────────────────────────────────────────────

/** All faction identifiers in the world. */
export type FactionId =
  | 'town_guard'
  | 'thieves_guild'
  | 'merchants_guild'
  | 'church'
  | 'nobility'
  | 'underground'
  | 'academia'
  | 'wilderness_folk';

/** Standing tier derived from reputation score. */
export type FactionStanding =
  | 'exalted'    // 80–100
  | 'honored'    // 50–79
  | 'friendly'   // 20–49
  | 'neutral'    // -19–19
  | 'unfriendly' // -20–-49
  | 'hostile'    // -50–-79
  | 'nemesis';   // -80–-100

/** One faction's current state in the world. */
export interface FactionEntry {
  id: FactionId;
  name: string;
  reputation: number;     // -100 to 100, player standing
  power: number;          // 0-100, faction influence
  is_active: boolean;     // false = faction destroyed/dissolved
}

/** A crime committed by an entity. */
export type CrimeType =
  | 'theft'
  | 'assault'
  | 'murder'
  | 'trespassing'
  | 'contraband'
  | 'vandalism'
  | 'bribery'
  | 'espionage';

export interface CrimeRecord {
  type: CrimeType;
  turn: number;
  severity: number;       // 0-100
  faction_id: FactionId;  // which faction's law was broken
  witnessed: boolean;
  bounty_value: number;   // gold reward for capture
  cleared: boolean;
}

/** Guard NPC reaction state. */
export type GuardAlertLevel = 'unaware' | 'suspicious' | 'alerted' | 'pursuing' | 'arresting';

export interface GuardState {
  alert_level: GuardAlertLevel;
  target_id: string | null;   // entity being tracked
  pursuit_stamina: number;    // 0-100, decreases during pursuit
  last_crime_seen: CrimeType | null;
  faction_id: FactionId;
}

/** Crime + faction tracking bundled into the NPC. */
export interface CriminalRecord {
  crimes: CrimeRecord[];
  total_bounty: number;
  wanted_by: FactionId[];
  guard_state: GuardState | null; // only populated if NPC is a guard
}
