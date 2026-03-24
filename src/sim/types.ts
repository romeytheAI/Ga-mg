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

// ── NPC ──────────────────────────────────────────────────────────────────────
export type NpcTrait =
  | 'brave' | 'cowardly' | 'greedy' | 'generous' | 'aggressive' | 'passive'
  | 'flirtatious' | 'reserved' | 'curious' | 'paranoid' | 'loyal' | 'treacherous';

export type NpcState = 'idle' | 'working' | 'socializing' | 'eating' | 'sleeping' | 'fleeing' | 'hostile' | 'trading';

export interface SimNpc {
  id: string;
  name: string;
  race: string;
  gender: string;
  age: number;
  job: JobType;
  traits: NpcTrait[];
  needs: NpcNeeds;
  memory: MemoryEntry[];
  relationships: Relationship[];
  current_state: NpcState;
  location_id: string;
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
}

export interface SimLocation {
  id: string;
  name: string;
  type: 'town' | 'wilderness' | 'dungeon' | 'home' | 'market' | 'tavern' | 'farm';
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
