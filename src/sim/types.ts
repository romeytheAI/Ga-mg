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
}

export interface SimLocation {
  id: string;
  name: string;
  type: 'town' | 'wilderness' | 'dungeon' | 'home' | 'market' | 'tavern' | 'farm'
    | 'school' | 'temple' | 'docks' | 'alleyway' | 'brothel';
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
