# Reference Index System - Technical Specification

## Overview

This specification defines the Reference Index System for the Ga-mg project, designed to accelerate AI development by providing fast, type-safe access to character references, relationships, and cross-references across the codebase.

## Goals

1. **Performance**: Reduce character reference lookup from O(n) to O(1)
2. **AI-Friendly**: Provide rich context for AI agents in easily consumable format
3. **Type Safety**: Prevent broken references at compile and runtime
4. **Maintainability**: Clear patterns for keeping index synchronized with data
5. **Scalability**: Handle 3x growth in entities without performance degradation

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (Game Code, AI Agents, Tools)                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Reference Index API                         │
│  • Query Functions (getNpcLocations, getQuestDeps, etc.)    │
│  • Validation Functions (validateRefs, checkIntegrity)       │
│  • Statistics Functions (countNpcs, getMetadata)            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Index Data Layer                           │
│  • Inverse Indexes (Maps)                                   │
│  • Metadata Caches                                           │
│  • Relationship Graphs                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Source Data Files                          │
│  src/data/npcs.ts, locations.ts, quests.ts, items.ts       │
└─────────────────────────────────────────────────────────────┘
```

## Data Structures

### Core Types

```typescript
// src/data/referenceIndex.types.ts

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
```

## API Specification

### Index Builder

```typescript
// src/data/referenceIndex.ts

/**
 * Build the complete reference index from source data.
 * This should be called once at application startup.
 *
 * @returns Complete reference index with all lookups and metadata
 */
export function buildReferenceIndex(): ReferenceIndex;

/**
 * Validate all references in the data and return broken references.
 *
 * @returns Validation result with broken references
 */
export function validateReferences(): {
  valid: boolean;
  errors: BrokenReference[];
};
```

### Query Functions (Inverse Lookups)

```typescript
/**
 * Get all locations where an NPC appears.
 *
 * @param npcId - The NPC identifier
 * @returns Array of location IDs, empty if NPC not found
 *
 * @example
 * getNpcLocations('robin')
 * // => ['orphanage', 'school', 'town_square']
 */
export function getNpcLocations(npcId: string): LocationId[];

/**
 * Get all NPCs present at a location.
 *
 * @param locationId - The location identifier
 * @returns Array of NPC IDs, empty if location not found
 */
export function getLocationNpcs(locationId: string): NpcId[];

/**
 * Get all prerequisite quests for a quest.
 *
 * @param questId - The quest identifier
 * @returns Array of prerequisite quest IDs
 */
export function getQuestPrerequisites(questId: string): QuestId[];

/**
 * Get all quests that depend on a given quest.
 *
 * @param questId - The quest identifier
 * @returns Array of dependent quest IDs
 */
export function getQuestDependents(questId: string): QuestId[];

/**
 * Get all quests that reward a specific item.
 *
 * @param itemId - The item identifier
 * @returns Array of quest IDs
 */
export function getQuestsRewardingItem(itemId: string): QuestId[];

/**
 * Get all locations directly connected to a location.
 *
 * @param locationId - The location identifier
 * @returns Array of connected location IDs
 */
export function getConnectedLocations(locationId: string): LocationId[];
```

### Query Functions (Categorical)

```typescript
/**
 * Get all NPCs marked as love interests.
 *
 * @returns Array of love interest NPC IDs
 */
export function getLoveInterests(): NpcId[];

/**
 * Get all NPCs marked as antagonists.
 *
 * @returns Array of antagonist NPC IDs
 */
export function getAntagonists(): NpcId[];

/**
 * Get all NPCs of a specific race.
 *
 * @param race - Race name (e.g., 'Human', 'Elf')
 * @returns Array of NPC IDs
 */
export function getNpcsByRace(race: string): NpcId[];

/**
 * Get all locations within a danger range.
 *
 * @param minDanger - Minimum danger level (0-100)
 * @param maxDanger - Maximum danger level (0-100)
 * @returns Array of location IDs
 */
export function getLocationsByDangerRange(minDanger: number, maxDanger: number): LocationId[];

/**
 * Get all quests of a specific type.
 *
 * @param type - Quest type
 * @returns Array of quest IDs
 */
export function getQuestsByType(type: QuestType): QuestId[];

/**
 * Get all main quests in a specific chapter.
 *
 * @param chapter - Chapter number
 * @returns Array of quest IDs
 */
export function getQuestsByChapter(chapter: number): QuestId[];
```

### Metadata Functions

```typescript
/**
 * Get rich metadata for an NPC.
 *
 * @param npcId - The NPC identifier
 * @returns NPC metadata or null if not found
 */
export function getNpcMetadata(npcId: string): NpcMetadata | null;

/**
 * Get rich metadata for a location.
 *
 * @param locationId - The location identifier
 * @returns Location metadata or null if not found
 */
export function getLocationMetadata(locationId: string): LocationMetadata | null;

/**
 * Get rich metadata for a quest.
 *
 * @param questId - The quest identifier
 * @returns Quest metadata or null if not found
 */
export function getQuestMetadata(questId: string): QuestMetadata | null;
```

### Statistics Functions

```typescript
/**
 * Get index statistics.
 *
 * @returns Statistics object
 */
export function getIndexStats(): ReferenceIndex['stats'];

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
};
```

## Implementation Details

### Index Building Algorithm

```typescript
function buildReferenceIndex(): ReferenceIndex {
  const startTime = performance.now();
  const index: ReferenceIndex = initializeEmptyIndex();

  // Step 1: Build NPC indexes
  for (const [npcId, npc] of Object.entries(NPCS)) {
    // Extract metadata
    const metadata = buildNpcMetadata(npcId, npc);
    index.npcMetadata.set(npcId as NpcId, metadata);

    // Categorize
    if (npc.love_interest) {
      index.loveInterests.add(npcId as NpcId);
    }
    if (isAntagonist(npc)) {
      index.antagonists.add(npcId as NpcId);
    }

    // Group by race
    if (!index.npcsByRace.has(npc.race)) {
      index.npcsByRace.set(npc.race, []);
    }
    index.npcsByRace.get(npc.race)!.push(npcId as NpcId);
  }

  // Step 2: Build Location indexes
  for (const [locationId, location] of Object.entries(LOCATIONS)) {
    // Build NPC→Location inverse index
    for (const npcId of location.npcs || []) {
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
    if (!index.questsByType.has(quest.type)) {
      index.questsByType.set(quest.type, []);
    }
    index.questsByType.get(quest.type)!.push(questId as QuestId);

    // Categorize main quests by chapter
    if (quest.type === 'main' && quest.chapter !== undefined) {
      if (!index.questsByChapter.has(quest.chapter)) {
        index.questsByChapter.set(quest.chapter, []);
      }
      index.questsByChapter.get(quest.chapter)!.push(questId as QuestId);
    }

    // Build metadata
    const metadata = buildQuestMetadata(questId, quest);
    index.questMetadata.set(questId as QuestId, metadata);
  }

  // Step 4: Validation
  const validation = validateAllReferences(index);
  index.brokenReferences = validation.errors;
  index.isValid = validation.valid;

  // Step 5: Statistics
  index.stats = calculateStats(index, startTime);

  return index;
}
```

### Validation Algorithm

```typescript
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
          message: `NPC "${npcId}" references non-existent location "${locationId}"`
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
          message: `Location "${locationId}" references non-existent NPC "${npcId}"`
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
          message: `Quest "${questId}" requires non-existent quest "${prereqId}"`
        });
      }
    }
  }

  // Validate Quest→Item rewards
  for (const [itemId, questIds] of index.itemToQuests) {
    if (!BASIC_ITEMS[itemId]) {
      errors.push({
        sourceType: 'quest',
        sourceId: questIds[0],
        field: 'rewards.items',
        targetType: 'item',
        targetId: itemId,
        message: `Quest rewards non-existent item "${itemId}"`
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

## Usage Examples

### Example 1: Finding Robin's Locations

```typescript
import { getNpcLocations, getNpcMetadata } from '@/data/referenceIndex';

// Get all locations where Robin appears
const locations = getNpcLocations('robin');
console.log(locations); // ['orphanage', 'school', 'town_square']

// Get rich metadata
const metadata = getNpcMetadata('robin');
console.log(metadata?.primaryLocation); // 'orphanage'
console.log(metadata?.isLoveInterest); // true
console.log(metadata?.responseTypes); // ['social', 'work', 'flirt', ...]
```

### Example 2: Quest Dependency Checking

```typescript
import { getQuestPrerequisites, getQuestDependents } from '@/data/referenceIndex';

// Check if player can start a quest
function canStartQuest(questId: string, completedQuests: Set<string>): boolean {
  const prerequisites = getQuestPrerequisites(questId);
  return prerequisites.every(prereq => completedQuests.has(prereq));
}

// Find what quests unlock after completing a quest
function getUnlockedQuests(questId: string): string[] {
  return getQuestDependents(questId);
}
```

### Example 3: Location Exploration

```typescript
import {
  getLocationNpcs,
  getLocationMetadata,
  getConnectedLocations
} from '@/data/referenceIndex';

function exploreLocation(locationId: string) {
  const metadata = getLocationMetadata(locationId);
  const npcs = getLocationNpcs(locationId);
  const connections = getConnectedLocations(locationId);

  console.log(`Location: ${metadata?.name}`);
  console.log(`Danger Level: ${metadata?.danger}`);
  console.log(`NPCs Present: ${npcs.join(', ')}`);
  console.log(`Connected To: ${connections.join(', ')}`);
}
```

### Example 4: Character Discovery

```typescript
import { getLoveInterests, getNpcsByRace, getNpcMetadata } from '@/data/referenceIndex';

// Find all romance options
const romanceOptions = getLoveInterests();

// Find all elf characters
const elves = getNpcsByRace('Elf');

// Get detailed info about each
for (const npcId of romanceOptions) {
  const metadata = getNpcMetadata(npcId);
  console.log(`${metadata?.name} (${metadata?.race}) at ${metadata?.primaryLocation}`);
}
```

## Performance Characteristics

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Build Index | O(N + E) | N = entities, E = edges/references |
| getNpcLocations() | O(1) | Map lookup |
| getLocationNpcs() | O(1) | Map lookup |
| getQuestPrerequisites() | O(1) | Map lookup |
| validateReferences() | O(E) | Must check all edges |

### Space Complexity

| Component | Size | Example |
|-----------|------|---------|
| Base Data | ~400KB | Current NPCs, Locations, Quests |
| Index Maps | ~50-100KB | All inverse lookups |
| Metadata Cache | ~100-150KB | Rich metadata objects |
| **Total** | **~550-650KB** | Full in-memory index |

### Performance Targets

- Index build time: < 100ms (cold start)
- Query response: < 1ms (single lookup)
- Memory overhead: < 5MB (includes all maps)
- Validation time: < 500ms (full check)

## Maintenance Guidelines

### When to Update Index

The index must be rebuilt when:
1. **Adding new NPCs**: Update `npcs.ts`, rebuild index
2. **Adding new locations**: Update `locations.ts`, rebuild index
3. **Adding new quests**: Update `quests.ts`, rebuild index
4. **Changing relationships**: Any field that references another entity

### Automated Validation

```typescript
// In CI/CD pipeline or pre-commit hook
import { validateReferences } from '@/data/referenceIndex';

const validation = validateReferences();
if (!validation.valid) {
  console.error('Reference validation failed:');
  for (const error of validation.errors) {
    console.error(`  - ${error.message}`);
  }
  process.exit(1);
}
```

### Testing Strategy

```typescript
// tests/referenceIndex.test.ts
describe('Reference Index', () => {
  it('should build without errors', () => {
    const index = buildReferenceIndex();
    expect(index.isValid).toBe(true);
    expect(index.brokenReferences).toHaveLength(0);
  });

  it('should find all Robin locations', () => {
    const locations = getNpcLocations('robin');
    expect(locations).toContain('orphanage');
    expect(locations).toContain('school');
  });

  it('should identify all love interests', () => {
    const loveInterests = getLoveInterests();
    expect(loveInterests).toContain('robin');
    expect(loveInterests).toContain('whitney');
  });

  it('should detect broken references', () => {
    // Temporarily break a reference
    const original = LOCATIONS.orphanage.npcs;
    LOCATIONS.orphanage.npcs = ['fake_npc_id'];

    const validation = validateReferences();
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);

    // Restore
    LOCATIONS.orphanage.npcs = original;
  });
});
```

## Future Enhancements

### Phase 2 Features
1. **Relationship Strength**: Track relationship scores in index
2. **Historical Data**: Track changes over time (NPC moved locations)
3. **Computed Properties**: Derive additional metadata on demand
4. **Query Builder**: Fluent API for complex queries

### Phase 3 Features
1. **Persistence**: Save/load index to reduce rebuild cost
2. **Incremental Updates**: Update only changed portions
3. **Event System**: Notify on reference changes
4. **Visual Graph**: Export as DOT/GraphViz format

## Appendix A: File Structure

```
src/data/
  ├── referenceIndex.ts           # Main index builder and API
  ├── referenceIndex.types.ts     # Type definitions
  ├── referenceIndex.test.ts      # Unit tests
  └── .generated/                 # Generated/cached files
      └── index.json              # (Optional) Pre-built index

docs/
  ├── REFERENCE-INDEX-SPEC.md     # This document
  └── AI-REFERENCE-INDEX-SOLUTIONS.md  # Solution brainstorming
```

## Appendix B: Migration Plan

### Step 1: Create Types (Week 1)
- Define all interfaces in `referenceIndex.types.ts`
- No breaking changes to existing code

### Step 2: Implement Core Index (Week 1)
- Build index builder in `referenceIndex.ts`
- Add basic query functions
- Write unit tests

### Step 3: Add Validation (Week 2)
- Implement reference validation
- Add to CI/CD pipeline
- Fix any broken references found

### Step 4: Integration (Week 2)
- Update game code to use index where beneficial
- Document usage patterns
- Performance optimization

### Step 5: AI Context Cards (Week 3)
- Create template for context cards
- Generate cards for top 10 characters
- Write maintenance guidelines

## Appendix C: Decision Log

### Why Maps Instead of Objects?
- Maps provide O(1) lookup like objects
- Maps support any key type (easier for branded types)
- Maps have built-in size property
- Maps are more ergonomic for iteration

### Why In-Memory Instead of Database?
- Game data is small (< 1MB)
- No persistence requirements during gameplay
- Simpler architecture
- Faster performance (no I/O)
- Can still export to JSON for tools

### Why Hybrid Approach (Index + Context Cards)?
- Index solves technical performance problem
- Context cards solve AI comprehension problem
- Separation of concerns
- Each optimized for its use case
