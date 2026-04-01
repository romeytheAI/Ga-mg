// Reference Index System - Core Implementation
import { NPCS } from './npcs';
import { LOCATIONS } from './locations';
import { QUESTS } from './quests';
import { BASIC_ITEMS } from './items';
import type {
  ReferenceIndex,
  NpcId,
  LocationId,
  QuestId,
  ItemId,
  QuestType,
  ResponseType,
  BrokenReference,
  NpcMetadata,
  LocationMetadata,
  QuestMetadata,
} from './referenceIndex.types';
export { asNpcId, asLocationId, asQuestId, asItemId } from './referenceIndex.types';

// Singleton index instance
let cachedIndex: ReferenceIndex | null = null;

/**
 * Initialize an empty reference index with all maps and sets
 */
function initializeEmptyIndex(): ReferenceIndex {
  return {
    // Inverse lookups
    npcToLocations: new Map(),
    locationToNpcs: new Map(),
    questToPrerequisites: new Map(),
    questToDependents: new Map(),
    itemToQuests: new Map(),
    locationToConnections: new Map(),

    // Categorical indexes
    loveInterests: new Set(),
    antagonists: new Set(),
    npcsByRace: new Map(),
    locationsByDanger: new Map(),
    questsByType: new Map(),
    questsByChapter: new Map(),

    // Metadata caches
    npcMetadata: new Map(),
    locationMetadata: new Map(),
    questMetadata: new Map(),

    // Validation
    brokenReferences: [],
    isValid: true,

    // Statistics
    stats: {
      totalNpcs: 0,
      totalLocations: 0,
      totalQuests: 0,
      totalItems: 0,
      totalResponseTypes: 0,
      totalReferences: 0,
      indexBuildTime: 0,
      indexSizeBytes: 0,
    },
  };
}

/**
 * Check if an NPC is an antagonist based on negative relationship score
 */
function isAntagonist(npc: any): boolean {
  return npc.relationship < 0;
}

/**
 * Extract location connections from location actions
 */
function extractLocationConnections(location: any): LocationId[] {
  const connections: LocationId[] = [];
  if (location.actions) {
    for (const action of location.actions) {
      if (action.new_location) {
        connections.push(action.new_location as LocationId);
      }
    }
  }
  return [...new Set(connections)]; // Remove duplicates
}

/**
 * Build NPC metadata from NPC data
 */
function buildNpcMetadata(npcId: string, npc: any, index: ReferenceIndex): NpcMetadata {
  const allLocations = index.npcToLocations.get(npcId as NpcId) || [];

  // Extract response types
  const responseTypes: ResponseType[] = [];
  if (npc.responses) {
    for (const key of Object.keys(npc.responses)) {
      responseTypes.push(key as ResponseType);
    }
  }

  // Related quests: not yet supported — quest metadata does not currently track involved NPCs.
  // TODO: Implement involvedNpcs extraction in buildQuestMetadata (e.g., parse quest objectives).
  const relatedQuests: QuestId[] = [];

  return {
    id: npcId as NpcId,
    name: npc.name || npcId,
    race: npc.race || 'Unknown',
    isLoveInterest: npc.love_interest === true,
    isAntagonist: isAntagonist(npc),
    primaryLocation: (npc.location as LocationId) || (allLocations[0] || null),
    allLocations,
    responseTypes,
    relatedQuests,
    tags: [], // Can be expanded later
  };
}

/**
 * Build location metadata from location data
 */
function buildLocationMetadata(locationId: string, location: any): LocationMetadata {
  const npcs = (location.npcs || []) as NpcId[];
  const connections = extractLocationConnections(location);

  return {
    id: locationId as LocationId,
    name: location.name || locationId,
    danger: location.danger || 0,
    npcCount: npcs.length,
    npcs,
    actionCount: (location.actions || []).length,
    connectedLocations: connections,
  };
}

/**
 * Build quest metadata from quest data
 */
function buildQuestMetadata(questId: string, quest: any, index: ReferenceIndex): QuestMetadata {
  const prerequisites = (quest.prerequisites || []) as QuestId[];
  const dependents = index.questToDependents.get(questId as QuestId) || [];
  const rewardItems = (quest.rewards?.items || []) as ItemId[];

  // Find involved NPCs by scanning quest objectives and descriptions
  const involvedNpcs: NpcId[] = [];
  // This could be expanded to parse quest text for NPC references

  return {
    id: questId as QuestId,
    title: quest.title || questId,
    type: quest.type as QuestType || 'side',
    chapter: quest.chapter,
    prerequisites,
    dependents,
    rewardItems,
    involvedNpcs,
  };
}

/**
 * Build the complete reference index from source data.
 * This should be called once at application startup.
 *
 * @returns Complete reference index with all lookups and metadata
 */
export function buildReferenceIndex(): ReferenceIndex {
  const startTime = performance.now();
  const index = initializeEmptyIndex();

  // Step 1: Build NPC indexes
  for (const [npcId, npc] of Object.entries(NPCS)) {
    // Categorize love interests
    if (npc.love_interest) {
      index.loveInterests.add(npcId as NpcId);
    }

    // Categorize antagonists
    if (isAntagonist(npc)) {
      index.antagonists.add(npcId as NpcId);
    }

    // Group by race
    const race = npc.race || 'Unknown';
    if (!index.npcsByRace.has(race)) {
      index.npcsByRace.set(race, []);
    }
    index.npcsByRace.get(race)!.push(npcId as NpcId);

    index.stats.totalNpcs++;
  }

  // Step 2: Build Location indexes
  for (const [locationId, location] of Object.entries(LOCATIONS)) {
    // Build NPC→Location inverse index
    for (const npcId of (location.npcs || [])) {
      if (!index.npcToLocations.has(npcId as NpcId)) {
        index.npcToLocations.set(npcId as NpcId, []);
      }
      index.npcToLocations.get(npcId as NpcId)!.push(locationId as LocationId);
    }

    // Build Location→NPC index
    index.locationToNpcs.set(
      locationId as LocationId,
      (location.npcs || []) as NpcId[]
    );

    // Extract connections
    const connections = extractLocationConnections(location);
    index.locationToConnections.set(locationId as LocationId, connections);

    // Build metadata
    const metadata = buildLocationMetadata(locationId, location);
    index.locationMetadata.set(locationId as LocationId, metadata);

    // Categorize by danger
    const dangerBucket = Math.floor(location.danger / 10) * 10;
    if (!index.locationsByDanger.has(dangerBucket)) {
      index.locationsByDanger.set(dangerBucket, []);
    }
    index.locationsByDanger.get(dangerBucket)!.push(locationId as LocationId);

    index.stats.totalLocations++;
  }

  // Step 3: Build Quest indexes
  for (const [questId, quest] of Object.entries(QUESTS)) {
    // Build prerequisite indexes
    if (quest.prerequisites) {
      index.questToPrerequisites.set(
        questId as QuestId,
        quest.prerequisites as QuestId[]
      );

      // Build reverse (dependent) index
      for (const prereqId of quest.prerequisites) {
        if (!index.questToDependents.has(prereqId as QuestId)) {
          index.questToDependents.set(prereqId as QuestId, []);
        }
        index.questToDependents.get(prereqId as QuestId)!.push(questId as QuestId);
      }
    }

    // Build item→quest index
    if (quest.rewards?.items) {
      for (const itemId of quest.rewards.items) {
        if (!index.itemToQuests.has(itemId as ItemId)) {
          index.itemToQuests.set(itemId as ItemId, []);
        }
        index.itemToQuests.get(itemId as ItemId)!.push(questId as QuestId);
      }
    }

    // Categorize by type
    const questType = quest.type as QuestType || 'side';
    if (!index.questsByType.has(questType)) {
      index.questsByType.set(questType, []);
    }
    index.questsByType.get(questType)!.push(questId as QuestId);

    // Categorize main quests by chapter
    if (quest.type === 'main' && quest.chapter !== undefined) {
      if (!index.questsByChapter.has(quest.chapter)) {
        index.questsByChapter.set(quest.chapter, []);
      }
      index.questsByChapter.get(quest.chapter)!.push(questId as QuestId);
    }

    // Build metadata (before NPC metadata so quests are ready)
    const metadata = buildQuestMetadata(questId, quest, index);
    index.questMetadata.set(questId as QuestId, metadata);

    index.stats.totalQuests++;
  }

  // Step 4: Build NPC metadata (after locations and quests are indexed)
  for (const [npcId, npc] of Object.entries(NPCS)) {
    const metadata = buildNpcMetadata(npcId, npc, index);
    index.npcMetadata.set(npcId as NpcId, metadata);
    index.stats.totalResponseTypes += metadata.responseTypes.length;
  }

  // Step 5: Count items
  index.stats.totalItems = Object.keys(BASIC_ITEMS).length;

  // Step 6: Validation
  const validation = validateAllReferences(index);
  index.brokenReferences = validation.errors;
  index.isValid = validation.valid;

  // Step 7: Statistics
  const endTime = performance.now();
  index.stats.indexBuildTime = endTime - startTime;

  // Count reference edges (total entries across all arrays), not just key counts
  const countEdges = <V>(map: Map<unknown, V[]>): number => {
    let n = 0;
    for (const v of map.values()) n += v.length;
    return n;
  };
  index.stats.totalReferences =
    countEdges(index.npcToLocations) +
    countEdges(index.locationToNpcs) +
    countEdges(index.questToPrerequisites) +
    countEdges(index.itemToQuests) +
    countEdges(index.locationToConnections);

  // Estimate size (rough approximation)
  index.stats.indexSizeBytes = JSON.stringify({
    npcToLocations: Array.from(index.npcToLocations.entries()),
    locationToNpcs: Array.from(index.locationToNpcs.entries()),
    questToPrerequisites: Array.from(index.questToPrerequisites.entries()),
  }).length;

  return index;
}

/**
 * Validate all references in the data and return broken references.
 */
function validateAllReferences(index: ReferenceIndex): {
  valid: boolean;
  errors: BrokenReference[];
} {
  const errors: BrokenReference[] = [];

  // Validate NPC→Location references
  for (const [npcId, locationIds] of index.npcToLocations) {
    for (const locationId of locationIds) {
      if (!LOCATIONS[locationId]) {
        errors.push({
          sourceType: 'npc',
          sourceId: npcId,
          field: 'location',
          targetType: 'location',
          targetId: locationId,
          message: `NPC "${npcId}" references non-existent location "${locationId}"`,
        });
      }
    }
  }

  // Validate Location→NPC references
  for (const [locationId, npcIds] of index.locationToNpcs) {
    for (const npcId of npcIds) {
      if (!NPCS[npcId]) {
        errors.push({
          sourceType: 'location',
          sourceId: locationId,
          field: 'npcs',
          targetType: 'npc',
          targetId: npcId,
          message: `Location "${locationId}" references non-existent NPC "${npcId}"`,
        });
      }
    }
  }

  // Validate Quest→Quest prerequisites
  for (const [questId, prereqIds] of index.questToPrerequisites) {
    for (const prereqId of prereqIds) {
      if (!QUESTS[prereqId]) {
        errors.push({
          sourceType: 'quest',
          sourceId: questId,
          field: 'prerequisites',
          targetType: 'quest',
          targetId: prereqId,
          message: `Quest "${questId}" requires non-existent quest "${prereqId}"`,
        });
      }
    }
  }

  // Validate Quest→Item rewards
  for (const [itemId, questIds] of index.itemToQuests) {
    if (!BASIC_ITEMS[itemId]) {
      errors.push({
        sourceType: 'quest',
        sourceId: questIds[0] || 'unknown',
        field: 'rewards.items',
        targetType: 'item',
        targetId: itemId,
        message: `Quest rewards non-existent item "${itemId}"`,
      });
    }
  }

  // Validate Location→Connection targets (new_location action targets)
  for (const [locationId, connectedIds] of index.locationToConnections) {
    for (const targetId of connectedIds) {
      if (!LOCATIONS[targetId]) {
        errors.push({
          sourceType: 'location',
          sourceId: locationId,
          field: 'actions.new_location',
          targetType: 'location',
          targetId,
          message: `Location "${locationId}" action targets non-existent location "${targetId}"`,
        });
      }
    }
  }

  // Validate Location→NPC references via action.npc fields
  interface ActionWithNpc { npc?: string; }
  for (const [locationId, location] of Object.entries(LOCATIONS)) {
    if (location.actions) {
      for (const action of location.actions) {
        const npcRef = (action as ActionWithNpc).npc;
        if (npcRef && !NPCS[npcRef]) {
          errors.push({
            sourceType: 'location',
            sourceId: locationId,
            field: 'actions.npc',
            targetType: 'npc',
            targetId: npcRef,
            message: `Location "${locationId}" action references non-existent NPC "${npcRef}"`,
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get or build the reference index (singleton pattern)
 */
export function getIndex(): ReferenceIndex {
  if (!cachedIndex) {
    cachedIndex = buildReferenceIndex();
  }
  return cachedIndex;
}

/**
 * Clear the cached index (useful for testing or hot reload)
 */
export function clearIndexCache(): void {
  cachedIndex = null;
}

/**
 * Validate all references and return result
 */
export function validateReferences(): {
  valid: boolean;
  errors: BrokenReference[];
} {
  const index = getIndex();
  return {
    valid: index.isValid,
    errors: index.brokenReferences,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Query Functions - Inverse Lookups
// ═══════════════════════════════════════════════════════════════════

/**
 * Get all locations where an NPC appears.
 *
 * @param npcId - The NPC identifier (use `asNpcId('robin')` to convert a plain string)
 * @returns Array of location IDs, empty if NPC not found
 */
export function getNpcLocations(npcId: NpcId): LocationId[] {
  const index = getIndex();
  return index.npcToLocations.get(npcId) || [];
}

/**
 * Get all NPCs present at a location.
 *
 * @param locationId - The location identifier (use `asLocationId(...)` to convert a plain string)
 * @returns Array of NPC IDs, empty if location not found
 */
export function getLocationNpcs(locationId: LocationId): NpcId[] {
  const index = getIndex();
  return index.locationToNpcs.get(locationId) || [];
}

/**
 * Get all prerequisite quests for a quest.
 *
 * @param questId - The quest identifier (use `asQuestId(...)` to convert a plain string)
 * @returns Array of prerequisite quest IDs
 */
export function getQuestPrerequisites(questId: QuestId): QuestId[] {
  const index = getIndex();
  return index.questToPrerequisites.get(questId) || [];
}

/**
 * Get all quests that depend on a given quest.
 *
 * @param questId - The quest identifier (use `asQuestId(...)` to convert a plain string)
 * @returns Array of dependent quest IDs
 */
export function getQuestDependents(questId: QuestId): QuestId[] {
  const index = getIndex();
  return index.questToDependents.get(questId) || [];
}

/**
 * Get all quests that reward a specific item.
 *
 * @param itemId - The item identifier (use `asItemId(...)` to convert a plain string)
 * @returns Array of quest IDs
 */
export function getQuestsRewardingItem(itemId: ItemId): QuestId[] {
  const index = getIndex();
  return index.itemToQuests.get(itemId) || [];
}

/**
 * Get all locations directly connected to a location.
 *
 * @param locationId - The location identifier (use `asLocationId(...)` to convert a plain string)
 * @returns Array of connected location IDs
 */
export function getConnectedLocations(locationId: LocationId): LocationId[] {
  const index = getIndex();
  return index.locationToConnections.get(locationId) || [];
}

// ═══════════════════════════════════════════════════════════════════
// Query Functions - Categorical
// ═══════════════════════════════════════════════════════════════════

/**
 * Get all NPCs marked as love interests.
 *
 * @returns Array of love interest NPC IDs
 */
export function getLoveInterests(): NpcId[] {
  const index = getIndex();
  return Array.from(index.loveInterests);
}

/**
 * Get all NPCs marked as antagonists.
 *
 * @returns Array of antagonist NPC IDs
 */
export function getAntagonists(): NpcId[] {
  const index = getIndex();
  return Array.from(index.antagonists);
}

/**
 * Get all NPCs of a specific race.
 *
 * @param race - Race name (e.g., 'Human', 'Elf')
 * @returns Array of NPC IDs
 */
export function getNpcsByRace(race: string): NpcId[] {
  const index = getIndex();
  return index.npcsByRace.get(race) || [];
}

/**
 * Get all locations within a danger range.
 *
 * @param minDanger - Minimum danger level (0-100)
 * @param maxDanger - Maximum danger level (0-100)
 * @returns Array of location IDs
 */
export function getLocationsByDangerRange(minDanger: number, maxDanger: number): LocationId[] {
  const index = getIndex();
  const results: LocationId[] = [];

  for (let bucket = Math.floor(minDanger / 10) * 10; bucket <= maxDanger; bucket += 10) {
    const locations = index.locationsByDanger.get(bucket) || [];
    results.push(...locations);
  }

  return results;
}

/**
 * Get all quests of a specific type.
 *
 * @param type - Quest type
 * @returns Array of quest IDs
 */
export function getQuestsByType(type: QuestType): QuestId[] {
  const index = getIndex();
  return index.questsByType.get(type) || [];
}

/**
 * Get all main quests in a specific chapter.
 *
 * @param chapter - Chapter number
 * @returns Array of quest IDs
 */
export function getQuestsByChapter(chapter: number): QuestId[] {
  const index = getIndex();
  return index.questsByChapter.get(chapter) || [];
}

// ═══════════════════════════════════════════════════════════════════
// Metadata Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Get rich metadata for an NPC.
 *
 * @param npcId - The NPC identifier (use `asNpcId(...)` to convert a plain string)
 * @returns NPC metadata or null if not found
 */
export function getNpcMetadata(npcId: NpcId): NpcMetadata | null {
  const index = getIndex();
  return index.npcMetadata.get(npcId) || null;
}

/**
 * Get rich metadata for a location.
 *
 * @param locationId - The location identifier (use `asLocationId(...)` to convert a plain string)
 * @returns Location metadata or null if not found
 */
export function getLocationMetadata(locationId: LocationId): LocationMetadata | null {
  const index = getIndex();
  return index.locationMetadata.get(locationId) || null;
}

/**
 * Get rich metadata for a quest.
 *
 * @param questId - The quest identifier (use `asQuestId(...)` to convert a plain string)
 * @returns Quest metadata or null if not found
 */
export function getQuestMetadata(questId: QuestId): QuestMetadata | null {
  const index = getIndex();
  return index.questMetadata.get(questId) || null;
}

// ═══════════════════════════════════════════════════════════════════
// Statistics Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Get index statistics.
 *
 * @returns Statistics object
 */
export function getIndexStats(): ReferenceIndex['stats'] {
  const index = getIndex();
  return index.stats;
}

/**
 * Get count of all entities by type.
 *
 * @returns Object with counts
 */
export function getEntityCounts(): {
  npcs: number;
  locations: number;
  quests: number;
  items: number;
} {
  const index = getIndex();
  return {
    npcs: index.stats.totalNpcs,
    locations: index.stats.totalLocations,
    quests: index.stats.totalQuests,
    items: index.stats.totalItems,
  };
}
