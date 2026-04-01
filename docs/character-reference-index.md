# Character reference index for AI development

## Why this exists

Character references were previously spread across `src/data/npcs.ts`, `src/data/locations.ts`, and `src/data/dialogueTrees.ts`. That made it harder for AI features and developers to answer simple questions like “where is this character defined?”, “which actions exist for this NPC?”, or “what terms should I use when looking for related assets?” without opening multiple files.

`src/data/characterReferenceIndex.ts` solves that by deriving one AI-friendly reference entry per NPC from the existing data sources.

## What the index contains

Each `CharacterReference` entry includes:

- canonical identity (`id`, `name`, `aliases`)
- relationship and romance metadata (`relationship`, `loveInterest`)
- location coverage (`primaryLocationId`, `locationIds`, `locationNames`)
- interaction coverage (`responseIntents`, `actionIds`, `storyEventIds`, `dialogueTreeIds`)
- source lookup fields (`referenceFiles`)
- asset discovery hints (`assetKeywords`)
- a compact `aiSummary` string for prompt injection into AI workflows

## How to use it

```ts
import {
  CHARACTER_REFERENCE_INDEX,
  getCharacterReference,
  getCharacterReferenceContext,
  searchCharacterReferences,
} from './src/data/characterReferenceIndex';

const constance = getCharacterReference('Sister Constance');
const schoolLoveInterests = searchCharacterReferences({ locationId: 'school', loveInterest: true });
const promptContext = getCharacterReferenceContext(['constance_michel', 'robin']);
```

Current AI prompt generation already consumes this index via `src/utils/workers.ts`, where local NPC prompt context now includes the structured character reference block before the freeform NPC descriptions.

## Maintenance guidelines

1. **Keep the index derived, not hand-maintained.** Update the source data in `npcs.ts`, `locations.ts`, or `dialogueTrees.ts`; the index should continue to build from those files automatically.
2. **Use stable NPC ids everywhere.** New locations, actions, story events, and dialogue trees should reference the same `npc` or `npc_id` so the index can link them together.
3. **Prefer searchable terms over prose for lookup helpers.** If a new character gets art, sprites, or other reference material, add stable keywords that match filenames or asset folders so `assetKeywords` remain useful.
4. **Cover new linking behavior with tests.** Add or update targeted Vitest coverage in `src/data/characterReferenceIndex.test.ts` whenever new reference sources are introduced.

## Suggested expansion points

- add explicit asset paths once character-specific assets are organized by NPC id
- add quest links if quests become character-addressable in a consistent way
- expose the index through developer tooling or debug views if manual browsing becomes necessary
