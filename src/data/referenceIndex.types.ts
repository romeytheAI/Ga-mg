// Type definitions for the Reference Index System

/** Branded type for NPC IDs to prevent string confusion */
declare const NpcIdBrand: unique symbol;
export type NpcId = string & { readonly [NpcIdBrand]: never };

/** Branded type for Location IDs */
declare const LocationIdBrand: unique symbol;
export type LocationId = string & { readonly [LocationIdBrand]: never };

/** Branded type for Quest IDs */
declare const QuestIdBrand: unique symbol;
export type QuestId = string & { readonly [QuestIdBrand]: never };

/** Branded type for Item IDs */
declare const ItemIdBrand: unique symbol;
export type ItemId = string & { readonly [ItemIdBrand]: never };

/** Response/interaction types for NPCs */
export type ResponseType =
  | 'social' | 'work' | 'flirt' | 'threaten' | 'gift'
  | 'tease' | 'comfort' | 'confide' | 'beg' | 'praise'
  | 'kiss' | 'hold_hands' | 'cuddle' | 'confess' | 'date';

/** Quest types */
export type QuestType = 'main' | 'side' | 'daily' | 'romance';

/** Broken reference error */
export interface BrokenReference {
  sourceType: 'npc' | 'location' | 'quest' | 'item';
  sourceId: string;
  field: string;
  targetType: 'npc' | 'location' | 'quest' | 'item';
  targetId: string;
  message: string;
}

/** NPC metadata */
export interface NpcMetadata {
  id: NpcId;
  name: string;
  race: string;
  isLoveInterest: boolean;
  isAntagonist: boolean;
  primaryLocation: LocationId | null;
  allLocations: LocationId[];
  responseTypes: ResponseType[];
  relatedQuests: QuestId[];
  tags: string[];
}

/** Location metadata */
export interface LocationMetadata {
  id: LocationId;
  name: string;
  danger: number;
  npcCount: number;
  npcs: NpcId[];
  actionCount: number;
  connectedLocations: LocationId[];
}

/** Quest metadata */
export interface QuestMetadata {
  id: QuestId;
  title: string;
  type: QuestType;
  chapter?: number;
  prerequisites: QuestId[];
  dependents: QuestId[];
  rewardItems: ItemId[];
  involvedNpcs: NpcId[];
}

/** Main index structure */
export interface ReferenceIndex {
  // ── Inverse Lookups ──────────────────────────────────────────────
  /** Map NPC ID to all locations where they appear */
  npcToLocations: Map<NpcId, LocationId[]>;

  /** Map Location ID to all NPCs present */
  locationToNpcs: Map<LocationId, NpcId[]>;

  /** Map Quest ID to its prerequisite quests */
  questToPrerequisites: Map<QuestId, QuestId[]>;

  /** Map Quest ID to quests that depend on it */
  questToDependents: Map<QuestId, QuestId[]>;

  /** Map Item ID to quests that reward it */
  itemToQuests: Map<ItemId, QuestId[]>;

  /** Map Location ID to connected locations (via travel actions) */
  locationToConnections: Map<LocationId, LocationId[]>;

  // ── Categorical Indexes ──────────────────────────────────────────
  /** All NPCs marked as love interests */
  loveInterests: Set<NpcId>;

  /** All NPCs marked as antagonists */
  antagonists: Set<NpcId>;

  /** NPCs grouped by race */
  npcsByRace: Map<string, NpcId[]>;

  /** Locations sorted by danger level (0-10 = index, 11-20 = index, etc.) */
  locationsByDanger: Map<number, LocationId[]>;

  /** Quests grouped by type */
  questsByType: Map<QuestType, QuestId[]>;

  /** Main story quests grouped by chapter */
  questsByChapter: Map<number, QuestId[]>;

  // ── Metadata Caches ──────────────────────────────────────────────
  /** Rich metadata for each NPC */
  npcMetadata: Map<NpcId, NpcMetadata>;

  /** Rich metadata for each location */
  locationMetadata: Map<LocationId, LocationMetadata>;

  /** Rich metadata for each quest */
  questMetadata: Map<QuestId, QuestMetadata>;

  // ── Validation Results ───────────────────────────────────────────
  /** List of broken or invalid references */
  brokenReferences: BrokenReference[];

  /** Overall validation status */
  isValid: boolean;

  // ── Statistics ───────────────────────────────────────────────────
  stats: {
    totalNpcs: number;
    totalLocations: number;
    totalQuests: number;
    totalItems: number;
    totalResponseTypes: number;
    totalReferences: number;
    indexBuildTime: number; // milliseconds
    indexSizeBytes: number;
  };
}
