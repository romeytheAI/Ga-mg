# AI Reference Index Solutions - Brainstorming Document

## Problem Analysis

### Current Pain Points
1. **Linear Search Performance**: Finding NPCs at a location requires iterating all locations
2. **No Reverse Lookups**: Can't efficiently query "which locations contain this NPC?"
3. **Missing Relationship Graphs**: No way to query NPC relationships or quest dependencies
4. **Reference Validation Gaps**: Broken string references discovered at runtime
5. **Data Duplication**: 142KB of NPC data with repeated response structures
6. **Poor AI Consumption**: AI agents must scan entire files to find character context
7. **No Type Safety**: All cross-references use raw strings without validation

### Current Data Structure Overview
- **25+ NPCs** in `src/data/npcs.ts` (142KB)
- **27+ Locations** in `src/data/locations.ts` (213KB)
- **30+ Quests** in `src/data/quests.ts` (26KB)
- **57+ Items** in `src/data/items.ts` (16KB)
- **14 Response Types** per NPC (social, work, flirt, etc.)

### Reference Relationships
```
Locations ──references──> NPCs (npcs array)
Locations ──references──> NPCs (action.npc field)
Locations ──references──> Locations (action.new_location)
Quests ────references──> Items (rewards.items)
Quests ────references──> Quests (prerequisites)
NPCs ──────references──> Locations (location field)
```

---

## Solution 1: Centralized Index Module (RECOMMENDED)

### Overview
Create a single `src/data/referenceIndex.ts` module that generates comprehensive lookup indexes at build time or runtime initialization.

### Architecture
```typescript
// src/data/referenceIndex.ts
export interface ReferenceIndex {
  // Inverse lookups
  npcToLocations: Map<NpcId, LocationId[]>;
  locationToNpcs: Map<LocationId, NpcId[]>;
  questToPrerequisites: Map<QuestId, QuestId[]>;
  questToDependents: Map<QuestId, QuestId[]>;
  itemToQuests: Map<ItemId, QuestId[]>;

  // Relationship graphs
  npcRelationships: Map<NpcId, { npc: NpcId; type: string }[]>;
  loveInterests: Set<NpcId>;
  antagonists: Set<NpcId>;

  // Metadata caches
  locationsByDanger: LocationId[][];
  questsByType: Map<QuestType, QuestId[]>;
  questsByChapter: Map<number, QuestId[]>;
  npcsByRace: Map<string, NpcId[]>;

  // Response patterns
  npcResponseTypes: Map<NpcId, ResponseType[]>;

  // Validation results
  brokenReferences: BrokenReference[];
  validationErrors: ValidationError[];
}
```

### Implementation Approach
1. **Build-time Generation**: Run script during `npm run build` to pre-compute index
2. **Export JSON**: Save index as `src/data/.generated/referenceIndex.json`
3. **Type-safe Access**: Provide helper functions with full TypeScript support
4. **Auto-validation**: Check all string references and report errors

### Pros
- ✅ Centralized, single source of truth
- ✅ Fast O(1) lookups instead of O(n) scans
- ✅ Type-safe with branded types
- ✅ Easy to extend with new indexes
- ✅ Can be version-controlled and diffed

### Cons
- ❌ Requires build step or initialization cost
- ❌ Index can become stale if data changes
- ❌ Memory overhead for large indexes

### Code Example
```typescript
// Usage
import { getIndex, getNpcLocations, getQuestDependencies } from '@/data/referenceIndex';

// Get all locations containing Robin
const robinLocations = getNpcLocations('robin');
// => ['orphanage', 'school', 'town_square']

// Get all quests that reward a specific item
const questsRewardingSword = getQuestsRewardingItem('rusty_iron_dagger');
// => ['q_ch1_orphans_cage']

// Validate all references
const validation = validateReferences();
if (!validation.valid) {
  console.error('Broken references:', validation.errors);
}
```

---

## Solution 2: Character Manifests (JSON-LD Schema)

### Overview
Create individual JSON-LD manifest files for each major character, following semantic web standards. Each manifest contains all references, metadata, and relationships for a single character.

### Architecture
```
src/data/manifests/
  ├── npcs/
  │   ├── robin.json
  │   ├── whitney.json
  │   ├── constance_michel.json
  │   └── ...
  ├── locations/
  │   ├── orphanage.json
  │   ├── school.json
  │   └── ...
  └── quests/
      ├── q_ch1_orphans_cage.json
      └── ...
```

### Manifest Schema (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Character",
  "@id": "npc:robin",
  "identifier": "robin",
  "name": "Robin",
  "race": "Human",
  "isLoveInterest": true,
  "locations": [
    { "@id": "location:orphanage", "name": "Honorhall Orphanage" },
    { "@id": "location:school", "name": "The Bards College" }
  ],
  "quests": [
    { "@id": "quest:q_romance_robin", "type": "romance" }
  ],
  "responseTypes": [
    "social", "work", "flirt", "threaten", "gift",
    "tease", "comfort", "confide", "beg", "praise",
    "kiss", "hold_hands", "cuddle", "confess", "date"
  ],
  "relationships": [
    { "character": "npc:bailey", "type": "antagonist" }
  ],
  "tags": ["orphan", "love_interest", "gentle", "vulnerable"],
  "description": "Your childhood friend at the orphanage...",
  "references": {
    "code": "src/data/npcs.ts:99-250",
    "lore": "src/lore.ts:42-67",
    "sprites": "public/sprites/robin/*.png"
  }
}
```

### Implementation Approach
1. **Manual Curation**: Create manifests by extracting from existing data
2. **Schema Validation**: Use JSON Schema to validate structure
3. **Build-time Indexing**: Aggregate all manifests into searchable index
4. **AI-Friendly Format**: Semantic markup makes it easy for AI to parse

### Pros
- ✅ Human-readable and editable
- ✅ Follows web standards (JSON-LD)
- ✅ Each character fully documented in one place
- ✅ Easy to version control individual files
- ✅ Excellent for AI consumption (semantic markup)

### Cons
- ❌ Requires maintaining separate manifest files
- ❌ Risk of manifests becoming out of sync with code
- ❌ More storage overhead
- ❌ Need tooling to keep manifests updated

---

## Solution 3: TypeScript Branded Types + Compile-time Validation

### Overview
Use TypeScript's type system to create branded ID types that enforce reference validity at compile time, preventing broken references before runtime.

### Architecture
```typescript
// src/types/ids.ts
declare const NpcIdBrand: unique symbol;
declare const LocationIdBrand: unique symbol;
declare const QuestIdBrand: unique symbol;
declare const ItemIdBrand: unique symbol;

export type NpcId = string & { readonly [NpcIdBrand]: never };
export type LocationId = string & { readonly [LocationIdBrand]: never };
export type QuestId = string & { readonly [QuestIdBrand]: never };
export type ItemId = string & { readonly [ItemIdBrand]: never };

// Registry of valid IDs (type-level)
export type ValidNpcIds =
  | 'robin' | 'whitney' | 'constance_michel' | 'grelod_the_kind'
  | 'brynjolf' | 'brand_shei' | 'bailey' | 'kylar' | 'avery'
  | 'sydney' | 'alex' | 'eden' | 'jordan' | 'harper'
  | 'leighton' | 'landry' | 'charlie' | 'darryl' | 'wren'
  | 'winter' | 'sam' | 'river' | 'doren' | 'mason' | 'briar';

export type ValidLocationIds =
  | 'orphanage' | 'school' | 'town_square' | 'temple_gardens'
  | 'alleyways' | 'forest' | 'docks' | 'brothel' | 'farm'
  | 'swamp' | 'lake' | 'beach' | 'home' | 'park' | 'hospital'
  | 'prison' | 'strip_club' | 'dance_studio' | 'arcade'
  | 'shopping_centre' | 'moor' | 'wolf_cave' | 'eden_cabin'
  | 'ocean' | 'sewers' | 'museum' | 'cafe';

// Type-safe constructors
export function npcId(id: ValidNpcIds): NpcId {
  return id as NpcId;
}

export function locationId(id: ValidLocationIds): LocationId {
  return id as LocationId;
}
```

### Implementation Approach
1. **Refactor Existing Code**: Replace all `string` types with branded types
2. **Exhaustive Type Checks**: Use TypeScript unions for all valid IDs
3. **Compile-time Safety**: Invalid references cause TypeScript errors
4. **Runtime Validation**: Optional runtime checks for dynamic data

### Pros
- ✅ Catches errors at compile time
- ✅ No runtime overhead
- ✅ IDE autocomplete for all valid IDs
- ✅ Refactoring becomes safer
- ✅ Type-level documentation

### Cons
- ❌ Large refactoring effort
- ❌ Union types become very long
- ❌ Doesn't solve inverse lookup problem
- ❌ Dynamic IDs (from user input) still need validation

---

## Solution 4: Graph Database Approach

### Overview
Model the entire game world as a graph database (in-memory or using a lightweight embedded DB like SQL.js). Nodes represent entities (NPCs, locations, quests), edges represent relationships.

### Architecture
```typescript
// Graph structure
type Node = NpcNode | LocationNode | QuestNode | ItemNode;
type Edge = {
  from: string;
  to: string;
  type: 'located_at' | 'prerequisite_of' | 'rewards' | 'contains' | 'loves';
  metadata?: any;
};

// Example graph
const graph = new GameGraph();

// Nodes
graph.addNode({ id: 'robin', type: 'npc', data: NPCS.robin });
graph.addNode({ id: 'orphanage', type: 'location', data: LOCATIONS.orphanage });

// Edges
graph.addEdge({ from: 'robin', to: 'orphanage', type: 'located_at' });
graph.addEdge({ from: 'orphanage', to: 'robin', type: 'contains' });

// Queries
const robinLocations = graph.query()
  .from('robin')
  .via('located_at')
  .to('location')
  .execute();
```

### Implementation Approach
1. **Use Graph Library**: Integrate `graphology` or `cytoscape.js`
2. **Build Graph on Init**: Construct from existing data structures
3. **Query Interface**: Provide fluent API for graph traversal
4. **Visualization**: Can export graph for visual debugging

### Pros
- ✅ Natural model for relationship queries
- ✅ Powerful traversal capabilities
- ✅ Can answer complex questions ("who knows who?")
- ✅ Visualization support
- ✅ Future-proof for complex systems

### Cons
- ❌ Adds significant complexity
- ❌ Library dependency
- ❌ Learning curve for developers
- ❌ May be overkill for current needs

---

## Solution 5: Code Generation + Static Analysis

### Overview
Use code generation to automatically create type-safe lookup functions and indexes from the existing data files. Parse the data at build time and generate optimized lookup code.

### Architecture
```typescript
// scripts/generateReferenceIndex.ts
// Parses npcs.ts, locations.ts, quests.ts, items.ts
// Generates:
//   - src/data/.generated/lookups.ts
//   - src/data/.generated/indexes.ts
//   - src/data/.generated/types.ts

// Generated output example:
export function getNpcLocations(npcId: NpcId): LocationId[] {
  switch (npcId) {
    case 'robin': return ['orphanage', 'school', 'town_square'];
    case 'whitney': return ['school', 'town_square'];
    // ... all cases generated
    default: return [];
  }
}
```

### Implementation Approach
1. **AST Parsing**: Use TypeScript compiler API to parse data files
2. **Extract Relationships**: Build index data structure in memory
3. **Code Generation**: Emit optimized TypeScript code
4. **Build Integration**: Add to package.json scripts

### Pros
- ✅ Zero runtime overhead (all computed at build time)
- ✅ Type-safe generated code
- ✅ Can optimize for specific queries
- ✅ No manual maintenance once set up

### Cons
- ❌ Complex build pipeline
- ❌ Generated code can be hard to debug
- ❌ Requires keeping generator up to date
- ❌ May not handle dynamic cases well

---

## Solution 6: AI-Specific Context Files

### Overview
Create dedicated markdown/JSON files specifically designed for AI consumption. These "context cards" provide rich metadata, cross-references, and narrative descriptions optimized for LLM understanding.

### Architecture
```
src/data/ai-context/
  ├── characters/
  │   ├── robin.md
  │   ├── whitney.md
  │   └── ...
  ├── locations/
  │   ├── orphanage.md
  │   └── ...
  └── relationships/
      ├── love-interests.md
      ├── antagonists.md
      └── ...
```

### Example Context Card
```markdown
# Character Context: Robin

## Identity
- **ID**: `robin`
- **Type**: NPC, Love Interest
- **Race**: Human
- **Starting Location**: Honorhall Orphanage
- **Primary Role**: Childhood friend, romantic option

## Locations
Robin can be found at:
1. **Honorhall Orphanage** (`orphanage`) - Primary location
2. **The Bards College** (`school`) - Secondary location
3. **Town Square** (`town_square`) - Social location

## Relationships
- **Bailey**: Antagonist, debt collector at orphanage
- **Constance**: Friendly, fellow resident
- **Player**: Childhood friend, potential romance

## Response Types
Robin responds to: social, work, flirt, threaten, gift, tease, comfort, confide, beg, praise, kiss, hold_hands, cuddle, confess, date

## Associated Quests
- `q_romance_robin`: Romance quest line
- `q_ch1_orphans_cage`: Chapter 1 main quest

## Narrative Themes
- Vulnerability and kindness
- Economic hardship
- Coming of age
- Trust and betrayal

## Code References
- NPC Definition: `src/data/npcs.ts:99-250`
- Location Actions: `src/data/locations.ts:43-57`
- Quest: `src/data/quests.ts:180-220`

## Development Notes
When working with Robin:
- Emphasize gentle, empathetic responses
- Balance vulnerability with inner strength
- Reflect economic desperation of orphanage setting
- Maintain consistent voice across all interactions
```

### Implementation Approach
1. **Manual Creation**: Write context cards for each major entity
2. **Template System**: Use templates for consistency
3. **Update Process**: Document when/how to update cards
4. **AI Integration**: Reference in prompts/instructions

### Pros
- ✅ Perfect for AI/LLM consumption
- ✅ Combines code refs with narrative context
- ✅ Human-readable documentation
- ✅ Flexible format (can include anything)
- ✅ No code changes required

### Cons
- ❌ Requires manual maintenance
- ❌ Can become out of sync with code
- ❌ Duplication of information
- ❌ Not machine-enforced

---

## Comparison Matrix

| Solution | Complexity | Performance | Maintenance | AI-Friendly | Type Safety | Implementation Time |
|----------|------------|-------------|-------------|-------------|-------------|---------------------|
| **1. Centralized Index** | Medium | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ | 2-3 days |
| **2. Character Manifests** | Low | ★★★☆☆ | ★★☆☆☆ | ★★★★★ | ★★★☆☆ | 3-5 days |
| **3. Branded Types** | High | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | 5-7 days |
| **4. Graph Database** | Very High | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | 7-10 days |
| **5. Code Generation** | Very High | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | 5-7 days |
| **6. AI Context Cards** | Low | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | ★☆☆☆☆ | 4-6 days |

---

## Recommended Hybrid Approach

**Combine Solutions 1 + 6**: Centralized Index Module + AI Context Cards

### Why This Combination?
1. **Centralized Index (Solution 1)** provides:
   - Fast runtime lookups for game code
   - Type-safe API
   - Validation and integrity checking
   - Inverse indexes for efficient queries

2. **AI Context Cards (Solution 6)** provides:
   - Rich narrative context for AI agents
   - Human-readable documentation
   - Development guidance
   - No coupling to code structure

### Implementation Plan
1. **Phase 1** (Week 1): Build centralized index module
   - Create `src/data/referenceIndex.ts`
   - Implement core indexes (NPC→Location, etc.)
   - Add validation functions
   - Write tests

2. **Phase 2** (Week 2): Create AI context system
   - Design context card template
   - Create cards for top 10 characters
   - Write maintenance guidelines
   - Integrate with existing docs

3. **Phase 3** (Week 3): Integration and refinement
   - Add helper functions for common queries
   - Create examples and tutorials
   - Performance optimization
   - Documentation

---

## Next Steps

1. **Get Stakeholder Feedback**: Review these solutions with team
2. **Choose Approach**: Select primary solution or hybrid
3. **Create Detailed Spec**: Design exact API and data structures
4. **Prototype**: Build minimal working version
5. **Iterate**: Refine based on real usage

---

## Additional Considerations

### Scalability
- Current: 25 NPCs, 27 locations, 30 quests
- Expected growth: 2-3x over next year
- Index should handle 100+ NPCs efficiently

### Performance Targets
- Index initialization: < 100ms
- Lookup operations: < 1ms
- Memory overhead: < 5MB
- Validation: < 500ms

### Maintenance Strategy
- Automated validation in CI/CD
- Pre-commit hooks for reference checks
- Documentation update reminders
- Quarterly index review

### AI Integration Points
1. **Character Reference**: Quick lookup of character context
2. **Location Context**: Understanding spatial relationships
3. **Quest Dependencies**: Tracking story progression
4. **Relationship Mapping**: Social graph queries
5. **Content Generation**: Templates and patterns

---

## Conclusion

The **Hybrid Approach (Solutions 1 + 6)** offers the best balance of:
- Developer experience (fast, type-safe lookups)
- AI consumption (rich context cards)
- Maintainability (clear separation of concerns)
- Implementation time (2-3 weeks)

This approach solves the immediate problem (slow character reference lookup) while providing a foundation for future enhancements (relationship queries, content generation, validation).
