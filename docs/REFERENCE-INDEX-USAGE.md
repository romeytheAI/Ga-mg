# Reference Index Usage Examples

This document provides practical examples of using the AI Reference Index System.

## Quick Start

```typescript
import {
  getNpcLocations,
  getLocationNpcs,
  getNpcMetadata,
  getLoveInterests,
  validateReferences,
} from '@/data/referenceIndex';

// Find where Robin appears
const robinLocations = getNpcLocations('robin');
console.log('Robin appears at:', robinLocations);
// => ['orphanage', 'school', 'town_square']

// Find all NPCs at the orphanage
const orphanageNpcs = getLocationNpcs('orphanage');
console.log('NPCs at orphanage:', orphanageNpcs);
// => ['robin', 'bailey', 'constance_michel', 'grelod_the_kind']

// Get rich metadata for Robin
const robinData = getNpcMetadata('robin');
console.log('Robin is a love interest:', robinData?.isLoveInterest);
// => true
```

## Common Use Cases

### 1. Character Discovery

```typescript
import { getLoveInterests, getAntagonists, getNpcsByRace } from '@/data/referenceIndex';

// Find all romance options
const romanceOptions = getLoveInterests();
console.log('Available romances:', romanceOptions);
// => ['robin', 'whitney', 'eden', 'kylar', 'avery', 'sydney', 'alex']

// Find all hostile NPCs
const enemies = getAntagonists();
console.log('Antagonists:', enemies);
// => ['grelod_the_kind', 'bailey', ...]

// Find all elf characters
const elves = getNpcsByRace('Elf');
console.log('Elf NPCs:', elves);
```

### 2. Location Exploration

```typescript
import {
  getLocationMetadata,
  getLocationNpcs,
  getConnectedLocations,
  getLocationsByDangerRange,
} from '@/data/referenceIndex';

// Explore a location
const orphanage = getLocationMetadata('orphanage');
console.log(`${orphanage?.name} - Danger: ${orphanage?.danger}/100`);
console.log(`NPCs present: ${orphanage?.npcCount}`);

// Find nearby locations
const connections = getConnectedLocations('orphanage');
console.log('Can travel to:', connections);
// => ['town_square', 'school']

// Find safe locations
const safeLocations = getLocationsByDangerRange(0, 20);
console.log('Safe locations:', safeLocations);
```

### 3. Quest Planning

```typescript
import {
  getQuestsByType,
  getQuestsByChapter,
  getQuestPrerequisites,
  getQuestDependents,
  getQuestMetadata,
} from '@/data/referenceIndex';

// Find all romance quests
const romanceQuests = getQuestsByType('romance');
console.log('Romance quests:', romanceQuests);

// Find Chapter 1 quests
const chapter1 = getQuestsByChapter(1);
console.log('Chapter 1 quests:', chapter1);

// Check quest dependencies
const questId = 'q_ch1_orphans_cage';
const prereqs = getQuestPrerequisites(questId);
const unlocks = getQuestDependents(questId);

console.log('Must complete first:', prereqs);
console.log('Unlocks:', unlocks);

// Get full quest details
const questData = getQuestMetadata(questId);
console.log(`${questData?.title} (${questData?.type})`);
```

### 4. Item and Reward Tracking

```typescript
import { getQuestsRewardingItem, getQuestMetadata } from '@/data/referenceIndex';

// Find which quests reward a specific item
const questsWithSword = getQuestsRewardingItem('rusty_iron_dagger');
console.log('Quests that reward sword:', questsWithSword);

// Get details about each quest
for (const questId of questsWithSword) {
  const quest = getQuestMetadata(questId);
  console.log(`- ${quest?.title}`);
}
```

### 5. Validation and Debugging

```typescript
import { validateReferences, getIndexStats } from '@/data/referenceIndex';

// Check for broken references
const validation = validateReferences();
if (!validation.valid) {
  console.error('Found broken references:');
  for (const error of validation.errors) {
    console.error(`  ${error.message}`);
  }
} else {
  console.log('✓ All references valid');
}

// Get performance statistics
const stats = getIndexStats();
console.log(`Index built in ${stats.indexBuildTime}ms`);
console.log(`Total NPCs: ${stats.totalNpcs}`);
console.log(`Total locations: ${stats.totalLocations}`);
console.log(`Total quests: ${stats.totalQuests}`);
```

### 6. Complex Queries

```typescript
import {
  getNpcMetadata,
  getNpcLocations,
  getLocationMetadata,
  getConnectedLocations,
} from '@/data/referenceIndex';

// Find all locations where love interests can be found
const loveInterests = getLoveInterests();
const loveInterestLocations = new Set<string>();

for (const npcId of loveInterests) {
  const locations = getNpcLocations(npcId);
  locations.forEach(loc => loveInterestLocations.add(loc));
}

console.log('Visit these locations to meet love interests:');
for (const locId of loveInterestLocations) {
  const loc = getLocationMetadata(locId);
  console.log(`- ${loc?.name}`);
}
```

### 7. Character Analysis

```typescript
import { getNpcMetadata, getNpcLocations } from '@/data/referenceIndex';

// Analyze a character
function analyzeCharacter(npcId: string) {
  const metadata = getNpcMetadata(npcId);

  if (!metadata) {
    console.log('Character not found');
    return;
  }

  console.log(`\n=== ${metadata.name} ===`);
  console.log(`Race: ${metadata.race}`);
  console.log(`Love Interest: ${metadata.isLoveInterest ? 'Yes' : 'No'}`);
  console.log(`Antagonist: ${metadata.isAntagonist ? 'Yes' : 'No'}`);
  console.log(`Locations: ${metadata.allLocations.join(', ')}`);
  console.log(`Primary Location: ${metadata.primaryLocation}`);
  console.log(`Response Types: ${metadata.responseTypes.length}`);
  console.log(`Related Quests: ${metadata.relatedQuests.length}`);
}

analyzeCharacter('robin');
```

### 8. NPC Encounter System

```typescript
import { getLocationNpcs, getNpcMetadata } from '@/data/referenceIndex';

// Simulate entering a location
function enterLocation(locationId: string) {
  const npcs = getLocationNpcs(locationId);

  console.log(`You enter the location.`);
  console.log(`NPCs present:`);

  for (const npcId of npcs) {
    const npc = getNpcMetadata(npcId);
    if (npc) {
      const attitude = npc.isAntagonist ? '(hostile)' : npc.isLoveInterest ? '(friendly)' : '';
      console.log(`  - ${npc.name} ${attitude}`);
    }
  }
}

enterLocation('orphanage');
```

### 9. Quest Chain Visualization

```typescript
import { getQuestMetadata, getQuestPrerequisites, getQuestDependents } from '@/data/referenceIndex';

// Show quest chain
function showQuestChain(questId: string, depth = 0) {
  const quest = getQuestMetadata(questId);
  if (!quest) return;

  const indent = '  '.repeat(depth);
  console.log(`${indent}${quest.title} (${questId})`);

  const dependents = getQuestDependents(questId);
  if (dependents.length > 0) {
    console.log(`${indent}  Unlocks:`);
    for (const depId of dependents) {
      showQuestChain(depId, depth + 2);
    }
  }
}

// Start with a quest that has dependents
showQuestChain('q_ch1_orphans_cage');
```

### 10. Performance Benchmarking

```typescript
import { getNpcLocations, getLocationNpcs, getIndex } from '@/data/referenceIndex';

// Benchmark query performance
function benchmarkQueries(iterations = 1000) {
  // Warm up cache
  getIndex();

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    getNpcLocations('robin');
    getLocationNpcs('orphanage');
  }

  const end = performance.now();
  const avgTime = (end - start) / iterations;

  console.log(`Average query time: ${avgTime.toFixed(3)}ms`);
  console.log(`Queries per second: ${(1000 / avgTime).toFixed(0)}`);
}

benchmarkQueries();
// Expected: <0.1ms per query, >10,000 queries/second
```

## Integration with AI Agents

### AI Context Retrieval

```typescript
import { getNpcMetadata, getNpcLocations } from '@/data/referenceIndex';

// AI agent function to get character context
function getCharacterContextForAI(npcId: string) {
  const metadata = getNpcMetadata(npcId);
  if (!metadata) return null;

  return {
    name: metadata.name,
    race: metadata.race,
    personality: metadata.isLoveInterest ? 'friendly, romantic' : metadata.isAntagonist ? 'hostile, antagonistic' : 'neutral',
    locations: metadata.allLocations,
    availableInteractions: metadata.responseTypes,
    // AI can use this to generate contextually appropriate dialogue
  };
}

const context = getCharacterContextForAI('robin');
console.log('AI Context:', context);
```

### Dynamic Dialogue Generation

```typescript
import { getNpcMetadata, getLocationNpcs } from '@/data/referenceIndex';

// Generate contextual dialogue options based on location
function generateDialogueOptions(locationId: string) {
  const npcs = getLocationNpcs(locationId);

  const options = [];
  for (const npcId of npcs) {
    const npc = getNpcMetadata(npcId);
    if (npc) {
      // Show available interaction types for each NPC
      for (const interactionType of npc.responseTypes) {
        options.push({
          npc: npc.name,
          action: interactionType,
          label: `${interactionType} ${npc.name}`,
        });
      }
    }
  }

  return options;
}

const dialogue = generateDialogueOptions('orphanage');
console.log('Available interactions:', dialogue.slice(0, 5));
```

## Best Practices

### 1. Cache the Index Reference

```typescript
// Good - cache the index if making multiple queries
import { getIndex } from '@/data/referenceIndex';

const index = getIndex();
const npcs = Array.from(index.npcMetadata.keys());
for (const npcId of npcs) {
  const metadata = index.npcMetadata.get(npcId);
  // Process...
}
```

### 2. Use Type Guards

```typescript
import { getNpcMetadata } from '@/data/referenceIndex';

const metadata = getNpcMetadata('robin');
if (metadata) {
  // TypeScript knows metadata is not null here
  console.log(metadata.name);
}
```

### 3. Validate Before Production

```typescript
import { validateReferences } from '@/data/referenceIndex';

// In development or CI/CD
if (process.env.NODE_ENV === 'development') {
  const validation = validateReferences();
  if (!validation.valid) {
    console.error('Reference validation failed!');
    console.error(validation.errors);
  }
}
```

## Performance Characteristics

- **Index Build**: ~20-40ms (one-time cost at startup)
- **Query Time**: <0.1ms per query
- **Memory Usage**: ~500KB-1MB for full index
- **Throughput**: >10,000 queries/second

## See Also

- [Technical Specification](../docs/REFERENCE-INDEX-SPEC.md)
- [Maintenance Guide](../docs/AI-REFERENCE-INDEX-MAINTENANCE.md)
- [AI Context Cards](../docs/ai-context/README.md)
- [Type Definitions](./referenceIndex.types.ts)
