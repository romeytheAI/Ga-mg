import { DIALOGUE_TREES } from './dialogueTrees';
import { LOCATIONS } from './locations';
import { NPCS } from './npcs';

type NpcResponse = {
  narrative_text?: string;
  stat_deltas?: Record<string, number>;
};

type NpcRecord = {
  id: string;
  name: string;
  race: string;
  relationship?: number;
  location?: string;
  love_interest?: boolean;
  description?: string;
  responses?: Record<string, NpcResponse>;
};

type LocationAction = {
  id: string;
  intent?: string;
  npc?: string;
  story_event?: string;
};

type LocationRecord = {
  id: string;
  name: string;
  npcs?: string[];
  actions?: LocationAction[];
};

type DialogueTreeRecord = {
  id: string;
  npc_id?: string;
};

export interface CharacterReference {
  id: string;
  name: string;
  aliases: string[];
  race: string;
  relationship: number;
  loveInterest: boolean;
  description: string;
  primaryLocationId?: string;
  primaryLocationName?: string;
  locationIds: string[];
  locationNames: string[];
  responseIntents: string[];
  actionIds: string[];
  storyEventIds: string[];
  dialogueTreeIds: string[];
  referenceFiles: string[];
  assetKeywords: string[];
  aiSummary: string;
}

export interface CharacterReferenceSearch {
  query?: string;
  race?: string;
  locationId?: string;
  intent?: string;
  loveInterest?: boolean;
}

const NPC_FILE = 'src/data/npcs.ts';
const LOCATION_FILE = 'src/data/locations.ts';
const DIALOGUE_FILE = 'src/data/dialogueTrees.ts';

function uniq(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())))];
}

function normalizeLookupValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function buildAiSummary(reference: Omit<CharacterReference, 'aiSummary'>): string {
  const locationSummary = reference.locationNames.length > 0 ? reference.locationNames.join('',') : 'unmapped';
  const storySummary = reference.storyEventIds.length > 0 ? reference.storyEventIds.join('',') : 'none';
  const dialogueSummary = reference.dialogueTreeIds.length > 0 ? reference.dialogueTreeIds.join('',') : 'none';

  return [
    `${reference.name} [${reference.id}]`,
    `race=${reference.race}`,
    `relationship=${reference.relationship}`,
    `love_interest=${reference.loveInterest ? 'yes'': 'no'}`,
    `locations=${locationSummary}`,
    `intents=${reference.responseIntents.join('',')}`,
    `story_events=${storySummary}`,
    `dialogue_trees=${dialogueSummary}`,
  ].join('')| ');
}

export function buildCharacterReferenceIndex(): CharacterReference[] {
  const locationEntries = Object.entries(LOCATIONS) as Array<[string, LocationRecord]>;
  const dialogueEntries = Object.values(DIALOGUE_TREES) as DialogueTreeRecord[];

  const actionIdsByNpc = new Map<string, Set<string>>();
  const intentsByNpc = new Map<string, Set<string>>();
  const locationIdsByNpc = new Map<string, Set<string>>();
  const storyEventIdsByNpc = new Map<string, Set<string>>();
  const dialogueTreeIdsByNpc = new Map<string, Set<string>>();

  for (const [locationId, location] of locationEntries) {
    for (const npcId of location.npcs ?? []) {
      if (!locationIdsByNpc.has(npcId)) {
        locationIdsByNpc.set(npcId, new Set<string>());
      }
      locationIdsByNpc.get(npcId)!.add(locationId);
    }

    for (const action of location.actions ?? []) {
      if (!action.npc) {
        continue;
      }

      if (!locationIdsByNpc.has(action.npc)) {
        locationIdsByNpc.set(action.npc, new Set<string>());
      }
      locationIdsByNpc.get(action.npc)!.add(locationId);

      if (!actionIdsByNpc.has(action.npc)) {
        actionIdsByNpc.set(action.npc, new Set<string>());
      }
      actionIdsByNpc.get(action.npc)!.add(action.id);

      if (action.intent) {
        if (!intentsByNpc.has(action.npc)) {
          intentsByNpc.set(action.npc, new Set<string>());
        }
        intentsByNpc.get(action.npc)!.add(action.intent);
      }

      if (action.story_event) {
        if (!storyEventIdsByNpc.has(action.npc)) {
          storyEventIdsByNpc.set(action.npc, new Set<string>());
        }
        storyEventIdsByNpc.get(action.npc)!.add(action.story_event);
      }
    }
  }

  for (const dialogueTree of dialogueEntries) {
    if (!dialogueTree.npc_id) {
      continue;
    }

    if (!dialogueTreeIdsByNpc.has(dialogueTree.npc_id)) {
      dialogueTreeIdsByNpc.set(dialogueTree.npc_id, new Set<string>());
    }
    dialogueTreeIdsByNpc.get(dialogueTree.npc_id)!.add(dialogueTree.id);
  }

  const npcEntries = Object.entries(NPCS) as Array<[string, NpcRecord]>;

  return npcEntries
    .map(([npcId, npc]) => {
      const locationIds = uniq([
        npc.location,
        ...(locationIdsByNpc.get(npcId) ? [...locationIdsByNpc.get(npcId)!] : []),
      ]).sort();

      const locationNames = locationIds
        .map((locationId) => LOCATIONS[locationId]?.name)
        .filter((locationName): locationName is string => Boolean(locationName));

      const primaryLocationId = npc.location && LOCATIONS[npc.location] ? npc.location : locationIds[0];
      const primaryLocationName = primaryLocationId ? LOCATIONS[primaryLocationId]?.name : undefined;

      const responseIntents = uniq([
        ...Object.keys(npc.responses ?? {}),
        ...(intentsByNpc.get(npcId) ? [...intentsByNpc.get(npcId)!] : []),
      ]).sort();

      const baseReference: Omit<CharacterReference, 'aiSummary'> = {
        id: npcId,
        name: npc.name,
        aliases: uniq([npcId, npc.name]),
        race: npc.race,
        relationship: npc.relationship ?? 0,
        loveInterest: Boolean(npc.love_interest),
        description: npc.description ?? ',
        primaryLocationId,
        primaryLocationName,
        locationIds,
        locationNames,
        responseIntents,
        actionIds: [...(actionIdsByNpc.get(npcId) ?? new Set<string>())].sort(),
        storyEventIds: [...(storyEventIdsByNpc.get(npcId) ?? new Set<string>())].sort(),
        dialogueTreeIds: [...(dialogueTreeIdsByNpc.get(npcId) ?? new Set<string>())].sort(),
        referenceFiles: uniq([
          NPC_FILE,
          locationIds.length > 0 || actionIdsByNpc.has(npcId) ? LOCATION_FILE : undefined,
          dialogueTreeIdsByNpc.has(npcId) ? DIALOGUE_FILE : undefined,
        ]),
        assetKeywords: uniq([
          npcId,
          npc.name,
          npc.race,
          primaryLocationId,
          primaryLocationName,
          ...locationNames,
        ]),
      };

      return {
        ...baseReference,
        aiSummary: buildAiSummary(baseReference),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

export const CHARACTER_REFERENCE_INDEX = buildCharacterReferenceIndex();

const CHARACTER_REFERENCE_LOOKUP = new Map<string, CharacterReference>();

for (const reference of CHARACTER_REFERENCE_INDEX) {
  const tokens = [
    reference.id,
    reference.name,
    ...reference.aliases,
    ...reference.locationIds,
    ...reference.locationNames,
    ...reference.assetKeywords,
  ];

  for (const token of tokens) {
    CHARACTER_REFERENCE_LOOKUP.set(normalizeLookupValue(token), reference);
  }
}

export function getCharacterReference(idOrAlias: string): CharacterReference | undefined {
  return CHARACTER_REFERENCE_LOOKUP.get(normalizeLookupValue(idOrAlias));
}

export function searchCharacterReferences(filters: CharacterReferenceSearch = {}): CharacterReference[] {
  const normalizedQuery = filters.query ? normalizeLookupValue(filters.query) : ';

  return CHARACTER_REFERENCE_INDEX.filter((reference) => {
    if (filters.race && reference.race !== filters.race) {
      return false;
    }

    if (filters.locationId && !reference.locationIds.includes(filters.locationId)) {
      return false;
    }

    if (filters.intent && !reference.responseIntents.includes(filters.intent)) {
      return false;
    }

    if (typeof filters.loveInterest === 'boolean''&& reference.loveInterest !== filters.loveInterest) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableFields = [
      reference.id,
      reference.name,
      reference.description,
      reference.race,
      ...reference.locationIds,
      ...reference.locationNames,
      ...reference.responseIntents,
      ...reference.storyEventIds,
      ...reference.dialogueTreeIds,
      ...reference.assetKeywords,
    ];

    return searchableFields.some((field) => normalizeLookupValue(field).includes(normalizedQuery));
  });
}

export function getCharacterReferenceContext(npcIds: string[]): string {
  const references: CharacterReference[] = [];

  for (const npcId of uniq(npcIds)) {
    const reference = getCharacterReference(npcId);
    if (reference) {
      references.push(reference);
    }
  }

  return references
    .map((reference) => {
      const sources = reference.referenceFiles.join('',');
      const assets = reference.assetKeywords.join('',');
      return `- ${reference.aiSummary} | references=${sources} | asset_keywords=${assets}`;
    })
    .join('\n');
}
