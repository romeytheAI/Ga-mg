# Game State Schema Documentation

**Version:** 2.0
**Last Updated:** 2026-04-06
**Status:** Canonical reference for all durable game state

## Overview

This document describes the complete game state schema for Ga-mg (Aetherius), a DoL-inspired game with Elder Scrolls framing. The state is designed to be:

- **Comprehensive**: Covers all simulation needs for the MVP and beyond
- **Serializable**: Full save/load support with versioned migration
- **Extensible**: Supports DOL-scale events, content, and systems
- **Type-safe**: Strict TypeScript interfaces throughout

## Table of Contents

1. [Top-Level State Structure](#top-level-state-structure)
2. [Player State](#player-state)
3. [World State](#world-state)
4. [UI State](#ui-state)
5. [Simulation State](#simulation-state)
6. [Save/Load System](#saveload-system)
7. [Usage Examples](#usage-examples)
8. [Migration Guide](#migration-guide)

---

## Top-Level State Structure

The root `GameState` interface (defined in `src/types.ts:661-788`) contains four major domains:

```typescript
interface GameState {
  player: PlayerState;        // Player character data
  world: WorldState;          // World simulation state
  ui: UIState;                // UI/presentation layer
  sim_world: SimWorld | null; // Low-level simulation engine
  horde_queue: HordeRequest[]; // AI generation queue
  memory_graph: string[];     // Narrative memory
}
```

---

## Player State

The `player` object tracks all character-specific data including identity, stats, skills, inventory, and various subsystems.

### Core Identity & Stats

```typescript
player: {
  identity: {
    name: string;
    race: string;          // e.g., "Argonian", "Nord", "Human"
    birthsign: string;     // e.g., "The Thief", "The Warrior"
    origin: string;        // e.g., "Orphan", "Noble"
    gender: string;        // "male", "female", "intersex"
  },

  stats: Record<StatKey, number> & {
    max_health: number;
    max_willpower: number;
    max_stamina: number;
  },

  skills: {
    seduction: number;     // 0-100
    athletics: number;
    skulduggery: number;
    swimming: number;
    dancing: number;
    housekeeping: number;
    school_grades: number;
    tending: number;
    cooking: number;
    foraging: number;
  },

  gold: number;
  fame: number;
  notoriety: number;
}
```

**StatKey** includes: `health`, `stamina`, `willpower`, `lust`, `trauma`, `hygiene`, `corruption`, `allure`, `arousal`, `pain`, `control`, `stress`, `hallucination`, `purity`

### Psychology & Attitudes

```typescript
player: {
  psych_profile: {
    submission_index: number;  // 0-100
    cruelty_index: number;
    exhibitionism: number;
    promiscuity: number;
  },

  attitudes: {
    sexual: 'fearful' | 'neutral' | 'eager';
    crime: 'honest' | 'neutral' | 'opportunist';
    labour: 'lazy' | 'neutral' | 'hardworking';
  },

  psychology: PlayerPsychology,  // See detailed breakdown below
  perks_flaws: PlayerPerksFlaws,
  social: PlayerSocial,
}
```

### Anatomy & Cosmetics

```typescript
player: {
  anatomy: Anatomy,  // Detailed body structure (see src/types.ts:2-85)
  cosmetics: Cosmetics,
  sensitivity: {
    mouth: number;    // 0-100
    chest: number;
    genitals: number;
    bottom: number;
    thighs: number;
    feet: number;
    hands: number;
  },
}
```

### Sexual Systems (DoL Parity)

```typescript
player: {
  sexual_skills: {
    oral: number;      // 0-100
    vaginal: number;
    anal: number;
    hand: number;
    feet: number;
    penile: number;
  },

  virginities: {
    penile: string | null;     // NPC name who took it
    vaginal: string | null;
    anal: string | null;
    oral: string | null;
    handholding: string | null;
    kiss: string | null;
    temple_marriage: string | null;
  },

  body_fluids: {
    arousal_wetness: number;   // 0-100
    semen_level: number;
    saliva: number;
    tears: number;
    sweat: number;
    milk: number;
  },

  lewdity_stats: {
    exhibitionism: number;     // 0-100
    promiscuity: number;
    deviancy: number;
    masochism: number;
  },
}
```

### Inventory & Equipment

```typescript
player: {
  clothing: ClothingLayer,  // Equipped items by slot
  clothing_state: {
    slots: Record<ClothingSlot, {
      integrity: number;
      wetness: number;
      displacement: 'secure' | 'shifted' | 'displaced' | 'removed';
      exposure: 'covered' | 'partial' | 'bare';
      coverage: number; // 0-1 coverage fraction used for exposure math
    }>;
    summary: {
      exposure_score: number;      // 0-100, higher = more exposed
      indecent_slots: ClothingSlot[];
      partial_slots: ClothingSlot[];
      warmth: number;              // 0-100 derived clothing warmth
    };
  },
  inventory: Item[],

  // Clothing slots:
  // head, neck, shoulders, chest, underwear, legs, feet, hands, waist
}
```

### Traits, Feats & Progression

```typescript
player: {
  traits: Trait[],        // Active character traits
  feats: Feat[],          // Achievements/unlocks
  quests: Quest[],
  known_recipes: string[],
  status_effects: string[],
  afflictions: string[],
}
```

### Temperature & Bailey Payment (DoL Core Systems)

```typescript
player: {
  temperature: {
    ambient_temp: number;      // -20 to 50
    clothing_warmth: number;   // 0-100 (derived from clothing_state.summary.warmth)
    body_temp: 'freezing' | 'cold' | 'chilly' | 'comfortable' | 'warm' | 'hot' | 'overheating';
  },

  bailey_payment: {
    weekly_amount: number;
    due_day: number;           // 0-6 (0=Monday)
    missed_payments: number;
    debt: number;
    punishment_level: number;  // 0-3
  },
}
```

### Subsystems

```typescript
player: {
  justice: PlayerJustice,     // Crime, bounty, jail
  arcane: PlayerArcane,       // Magic, spells, corruption
  base: PlayerBase,           // Player housing/property
  subconscious: PlayerSubconscious,  // Dreams, trauma
  biology: {
    cycle_day: number;
    heat_rut_active: boolean;
    parasites: Parasite[];
    incubations: Incubation[];
    cravings: string[];
    exhaustion_multiplier: number;
    post_partum_debuff: number;
    sterility: boolean;
    fertility_cycle: string;
    fertility: number;
    lactation_level: number;
  },
  companions: {
    active_party: Companion[];
    roster: Companion[];
    max_encumbrance_bonus: number;
  },
  life_sim: LifeSim,
  age_days: number,
  avatar_url?: string | null,
}
```

---

## World State

The `world` object manages time, location, NPCs, events, and global systems.

### Time & Location

```typescript
world: {
  day: number;           // Current game day
  hour: number;          // 0-23
  week_day: number;      // 0-6 (0=Monday, 6=Sunday)
  weather: string;

  current_location: {
    id?: string;
    name: string;
    danger: number;      // 0-1
    atmosphere: string;
    npcs: any[];
    actions?: any[];
  },
}
```

### NPC Relationships (Phase 5)

```typescript
world: {
  npc_relationships: Record<string, NpcRelationship>,
  // NpcRelationship interface (src/types.ts:308-331):
  // {
  //   npc_id: string;
  //   trust: number;        // 0-100
  //   love: number;
  //   fear: number;
  //   dom: number;
  //   sub: number;
  //   milestone: 'stranger' | 'acquaintance' | 'friend' | 'close' | 'lover' | 'bonded';
  //   met_on_day: number;
  //   last_interaction_day: number;
  //   interaction_count: number;
  //   scene_flags: Record<string, boolean | number>;
  // }
}
```

### Event Flags & Story State (Phase 2-3)

```typescript
world: {
  event_flags: Record<string, boolean | number>,  // Content gates
  active_story_event: ActiveStoryEvent | null,
  // ActiveStoryEvent: { id: string; current_node: string; }
}
```

### Encounters & Combat

```typescript
world: {
  active_encounter: ActiveEncounter | null,
  // ActiveEncounter interface (src/types.ts:570-589):
  // - enemy stats (health, lust, anger)
  // - player_stance: 'neutral' | 'defensive' | 'aggressive' | 'submissive'
  // - encounter_action: EncounterAction (pose/animation state)
  // - turn, log, debuffs, targeted_part
}
```

### World Simulation & Systems

```typescript
world: {
  macro_events: string[];
  local_tension: number;
  aggression_counter: number;
  active_world_events: string[];
  turn_count: number;
  last_intent: string | null,

  ascension_state: 'none' | 'pure_soul' | 'void_lord' | 'broodmother' | 'asylum',
  director_cut: boolean,

  // Placeholder objects (to be fully implemented):
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
}
```

---

## UI State

The `ui` object manages presentation, polling states, and user settings.

### Display State

```typescript
ui: {
  isPollingText: boolean,
  isPollingImage: boolean,
  isGeneratingAvatar: boolean,

  currentLog: Array<{
    text: string;
    type: 'narrative' | 'action' | 'system';
  }>,

  currentImage: string | null,

  choices: Array<{
    id: string;
    label: string;
    intent: string;
    successChance?: number;
  }>,
}
```

### Panel Visibility

```typescript
ui: {
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
}
```

### Interaction State

```typescript
ui: {
  highlighted_part: string | null,
  targeted_part: string | null,
  combat_animation: string | null,
  last_stat_deltas: Partial<Record<StatKey, number>> | null,
}
```

### Settings & Preferences

```typescript
ui: {
  apiKey: string,
  hordeApiKey: string,
  ui_scale: number,
  fullscreen: boolean,
  ambient_audio: boolean,
  haptics_enabled: boolean,
  accessibility_mode: boolean,

  settings: {
    encounter_rate: number,
    stat_drain_multiplier: number,
    enable_parasites: boolean,
    enable_pregnancy: boolean,
    enable_extreme_content: boolean,
  },

  graphics_quality: GraphicsQuality,  // See Graphics Quality section
}
```

### AI Horde State

```typescript
ui: {
  horde_status: {
    status: string;
    queue: number;
    wait: number;
  } | null,

  horde_monitor: {
    active: boolean;
    text_requests: number;
    image_requests: number;
    text_eta: number;
    image_eta: number;
    text_initial_eta: number;
    image_initial_eta: number;
    text_generation_chance: number;
    image_generation_chance: number;
  },

  selectedTextModel: string,
  selectedImageModel: string,
}
```

### Graphics Quality System

The `GraphicsQuality` interface (src/types.ts:596-659) provides comprehensive control over rendering fidelity:

```typescript
graphics_quality: {
  preset: 'low' | 'medium' | 'high' | 'ultra',

  sprite_quality: {
    subsurface_scattering: boolean,
    gradient_shading: boolean,
    muscle_detail_level: 0 | 1 | 2 | 3,
    fluid_effects: boolean,
    cosmetic_details: boolean,
    xray_overlay: boolean,
  },

  renderer_3d: {
    enabled: boolean,
    polygon_multiplier: number,  // 0.5-2.0
    pbr_materials: boolean,
    normal_mapping: boolean,
    environment_mapping: boolean,
    shadow_quality: 0 | 1 | 2 | 3,
    antialiasing: 0 | 2 | 4 | 8,
    pixel_ratio: number,
  },

  animation: {
    smooth_interpolation: boolean,
    target_fps: 30 | 60,
    particle_effects: boolean,
    physics_simulation: boolean,
  },

  performance: {
    lod_enabled: boolean,
    cache_size_mb: 50 | 100 | 200 | 500,
    dynamic_resolution: boolean,
    min_resolution_scale: number,
  },
}
```

---

## Simulation State

The `sim_world` object (when present) contains low-level simulation data (defined in `src/sim/types.ts`).

### SimWorld Structure

```typescript
sim_world: {
  turn: number,
  day: number,
  hour: number,
  weather: string,
  season: 'spring' | 'summer' | 'autumn' | 'winter',

  npcs: SimNpc[],
  economy: EconomyEntry[],
  global_events: string[],
  locations: SimLocation[],
  active_combats: CombatEncounter[],

  // Phase 6: Faction & Crime System
  factions: FactionEntry[],
  criminal_records: Record<string, CriminalRecord>,
}
```

### SimNpc Structure (Simulation-Layer NPC)

```typescript
interface SimNpc {
  id: string;
  name: string;
  race: string;
  gender: string;
  age: number;
  job: JobType;
  traits: NpcTrait[];

  needs: NpcNeeds,        // hunger, energy, social, happiness, wealth
  skills: NpcSkills,      // athletics, swimming, dancing, skulduggery, seduction, housekeeping, combat
  corruption_state: CorruptionState,
  fame: FameRecord,
  clothing: ClothingLoadout,

  memory: MemoryEntry[],
  relationships: Relationship[],

  current_state: NpcState,
  location_id: string,
  target_location_id: string | null,

  stats: {
    health: number;
    stamina: number;
    gold: number;
  },

  schedule: DailySchedule,

  // Optional AI-filled content:
  backstory?: string,
  dialogue_cache: Record<string, string>,

  // Extended state systems:
  transformation: TransformationState,
  addiction_state: AddictionState,
  disease_state: DiseaseState,
  arcane_state: ArcaneState,
  parasite_state: ParasiteState,
  companion_state: CompanionState,
  allure_state: AllureState,
  restraint_state: RestraintState,
}
```

### Faction System (Phase 6)

```typescript
interface FactionEntry {
  id: FactionId;          // 'town_guard' | 'thieves_guild' | 'merchants_guild' | etc.
  name: string;
  reputation: number;     // -100 to 100
  power: number;          // 0-100
  is_active: boolean;
}

interface CriminalRecord {
  crimes: CrimeRecord[];
  total_bounty: number;
  wanted_by: FactionId[];
  guard_state: GuardState | null;
}
```

See `src/sim/types.ts` and `src/sim/FactionSystem.ts` for complete details.

---

## Save/Load System

The save/load system is implemented in `src/utils/saveManager.ts` with versioned migrations.

### Save Schema Version

```typescript
export const SAVE_SCHEMA_VERSION = 2;
```

**Version History:**
- **Version 1**: Initial implementation (Phases 1-2)
- **Version 2**: Added NPC relationship tracking, event flags, schedule system, faction/crime system (Phases 2-6)

### Save Slot Structure

```typescript
interface SaveSlot {
  id: string;
  name: string;
  level: number;
  location: string;
  day: number;
  trauma: number;
  timestamp: number;
  schemaVersion: number;
  state: GameState;
}
```

### Migration Function

The `migrateGameState(rawState)` function ensures backward compatibility:

```typescript
export function migrateGameState(rawState: unknown): GameState {
  // 1. Handles missing/partial state
  // 2. Merges with initialState for new fields
  // 3. Normalizes inventory (is_equipped flags)
  // 4. Resolves current_location from string or object
  // 5. Adds default values for Phase 2-6 additions:
  //    - event_flags, npc_relationships
  //    - week_day, schedule-related fields
  //    - factions, criminal_records
  // 6. Migrates legacy story IDs
  // 7. Returns fully hydrated GameState
}
```

### Usage

```typescript
import { saveGame, loadGame, getAllSaves, deleteSave } from './utils/saveManager';

// Save current state
await saveGame('save-slot-1', gameState);

// Load a save
const restoredState = await loadGame('save-slot-1');

// List all saves
const saves = await getAllSaves();

// Delete a save
await deleteSave('save-slot-1');
```

---

## Usage Examples

### Example 1: Advancing Time

```typescript
import { gameReducer } from './reducers/gameReducer';

const action = {
  type: 'ADVANCE_TIME',
  payload: {
    hours: 8,           // Advance 8 hours
    drainStats: true,   // Apply stat drains
  }
};

const nextState = gameReducer(currentState, action);

// Results in:
// - world.hour += 8 (with day rollover)
// - world.week_day updated if day changes
// - player.stats.hunger -= (hours * 5)
// - player.stats.energy -= (hours * 3)
// - Bailey debt check on Monday
// - Temperature effects applied
// - Incubation/parasite tick
```

### Example 2: NPC Relationship Update (Phase 5)

```typescript
const action = {
  type: 'RESOLVE_NPC_INTERACTION',
  payload: {
    npc_id: 'robin',
    deltas: {
      trust: 5,
      love: 3,
      fear: -2,
    },
    milestone: 'friend',  // Optional: force milestone upgrade
  }
};

const nextState = gameReducer(currentState, action);

// Updates world.npc_relationships['robin']
// Increments interaction_count
// Sets last_interaction_day
```

### Example 3: Committing a Crime (Phase 6)

```typescript
const action = {
  type: 'COMMIT_CRIME',
  payload: {
    crime_type: 'theft',
    severity: 50,
    faction_id: 'town_guard',
    witnessed: true,
  }
};

const nextState = gameReducer(currentState, action);

// Adds crime to sim_world.criminal_records[player_id]
// Calculates bounty based on severity
// Triggers guard alert if witnessed
// Updates faction reputation
```

### Example 4: Setting Event Flags

```typescript
// Set a boolean flag
dispatch({
  type: 'SET_EVENT_FLAG',
  payload: { key: 'met_robin', value: true }
});

// Set a numeric counter
dispatch({
  type: 'SET_EVENT_FLAG',
  payload: { key: 'times_visited_school', value: 5 }
});

// Clear a flag
dispatch({
  type: 'CLEAR_EVENT_FLAG',
  payload: 'temporary_buff'
});
```

### Example 5: Equipping Items

```typescript
const action = {
  type: 'EQUIP_ITEM',
  payload: 'iron-helmet'  // item.id from inventory
};

const nextState = gameReducer(currentState, action);

// Unequips current item in slot (if any)
// Moves item to player.clothing.head
// Sets item.is_equipped = true
// Removes old item from clothing slot
```

### Example 6: Faction Reputation Change (Phase 6)

```typescript
const action = {
  type: 'ADD_FACTION_REP',
  payload: {
    faction_id: 'thieves_guild',
    delta: 25,
  }
};

const nextState = gameReducer(currentState, action);

// Updates sim_world.factions[faction_id].reputation
// Applies rival spillover (e.g., town_guard reputation decreases)
// Recalculates faction standing ('friendly', 'hostile', etc.)
// Updates shop prices based on new standing
```

---

## Migration Guide

### Adding New Fields to GameState

When extending the state schema in a future version:

1. **Update `src/types.ts`** with the new field
2. **Update `src/state/initialState.ts`** to include a default value
3. **Update `src/utils/saveManager.ts` `migrateGameState()`** to merge the new field
4. **Increment `SAVE_SCHEMA_VERSION`** if the change is incompatible
5. **Add migration logic** if transforming existing data

**Example:** Adding a new player subsystem

```typescript
// 1. src/types.ts
export interface PlayerCrafting {
  known_blueprints: string[];
  crafting_xp: number;
}

export interface GameState {
  player: {
    // ... existing fields
    crafting: PlayerCrafting;
  }
}

// 2. src/state/initialState.ts
export const initialState: GameState = {
  player: {
    // ... existing fields
    crafting: {
      known_blueprints: [],
      crafting_xp: 0,
    },
  }
}

// 3. src/utils/saveManager.ts
export function migrateGameState(rawState: unknown): GameState {
  const player = candidate.player || {};

  return {
    player: {
      // ... existing merges
      crafting: {
        ...initialState.player.crafting,
        ...(player.crafting || {}),
      },
    }
  }
}
```

### Schema Version Guidelines

- **Patch changes** (adding optional fields with defaults): Keep same version
- **Breaking changes** (removing fields, changing types): Increment version
- **Data transformations** (migrating old format to new): Increment version + add transform logic

---

## Best Practices

### 1. Always Use Reducers for State Mutations

```typescript
// ❌ DON'T mutate state directly
gameState.player.gold += 100;

// ✅ DO dispatch actions
dispatch({ type: 'ADD_GOLD', payload: 100 });
```

### 2. Use Type Guards for Optional Fields

```typescript
// ❌ DON'T assume presence
const activeFaction = gameState.sim_world.factions[0].name;

// ✅ DO check existence
if (gameState.sim_world?.factions?.length > 0) {
  const activeFaction = gameState.sim_world.factions[0].name;
}
```

### 3. Leverage Event Flags for Content Gating

```typescript
// Check if player has met Robin
if (gameState.world.event_flags['met_robin']) {
  // Show Robin dialogue options
}

// Check numeric counters
if ((gameState.world.event_flags['school_detentions'] as number) >= 3) {
  // Trigger detention event
}
```

### 4. Use NPC Relationships for Dynamic Content

```typescript
const robin = gameState.world.npc_relationships['robin'];

if (robin?.milestone === 'lover') {
  // Show romantic scenes
}

if (robin?.fear > 50) {
  // Robin avoids player
}
```

### 5. Query Faction Standing

```typescript
import { getStanding } from './sim/FactionSystem';

const standing = getStanding(reputation);
// 'exalted' | 'honored' | 'friendly' | 'neutral' | 'unfriendly' | 'hostile' | 'nemesis'

if (standing === 'hostile') {
  // Guards attack on sight
}
```

---

## Related Documentation

- **DoL Parity Matrix**: `docs/DOL-PARITY-MATRIX.md` - Feature checklist
- **Graphics Quality System**: `docs/GRAPHICS-QUALITY-SYSTEM.md` - Rendering settings
- **Reference Index**: `docs/REFERENCE-INDEX-SPEC.md` - NPC/location metadata
- **Faction System**: `src/sim/FactionSystem.ts` - Reputation mechanics
- **Crime System**: `src/sim/CrimeSystem.ts` - Guard AI and bounties
- **Relationship Engine**: `src/utils/relationshipEngine.ts` - NPC relationship logic
- **Schedule Engine**: `src/utils/scheduleEngine.ts` - NPC daily schedules

---

## Appendix: Quick Reference

### Key Type Locations

| Type | File | Lines |
|------|------|-------|
| `GameState` | `src/types.ts` | 661-788 |
| `PlayerJustice` | `src/types.ts` | 334-344 |
| `PlayerPsychology` | `src/types.ts` | 346-358 |
| `NpcRelationship` | `src/types.ts` | 308-331 |
| `NpcSchedule` | `src/types.ts` | 299-305 |
| `BaileyPayment` | `src/types.ts` | 237-248 |
| `GraphicsQuality` | `src/types.ts` | 596-659 |
| `SimWorld` | `src/sim/types.ts` | 193-206 |
| `FactionEntry` | `src/sim/types.ts` | 413-419 |
| `CriminalRecord` | `src/sim/types.ts` | 454-459 |

### Reducer Action Types (Partial List)

| Action | Purpose | Payload |
|--------|---------|---------|
| `ADVANCE_TIME` | Tick simulation forward | `{ hours: number, drainStats?: boolean }` |
| `SET_EVENT_FLAG` | Gate content | `{ key: string, value: boolean \| number }` |
| `RESOLVE_NPC_INTERACTION` | Update relationship | `{ npc_id, deltas, milestone? }` |
| `COMMIT_CRIME` | Record criminal act | `{ crime_type, severity, faction_id, witnessed }` |
| `ADD_FACTION_REP` | Change faction standing | `{ faction_id, delta }` |
| `EQUIP_ITEM` | Wear clothing/armor | `item_id: string` |
| `DAMAGE_CLOTHING` | Degrade integrity | `{ slot, amount }` |
| `ADD_GOLD` | Currency gain | `amount: number` |
| `START_ENCOUNTER` | Begin combat/scene | `encounterData` |
| `START_STORY_EVENT` | Trigger story node | `{ storyId, nodeId }` |

---

**End of Documentation**
