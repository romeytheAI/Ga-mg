/**
 * ProceduralGen — generates NPCs, world locations, and events procedurally.
 * Pure functions; deterministic seeding supported; no side effects.
 */
import { SimNpc, SimLocation, NpcTrait, JobType, DailySchedule } from './types';
import { buildDefaultSchedule } from './TimeSystem';
import { initEconomy } from './EconomySystem';

// ── Name tables ────────────────────────────────────────────────────────────
const FIRST_NAMES_MALE = [
  'Aldric','Bram','Cedric','Doran','Elric','Falk','Gavyn','Hadwin',
  'Idris','Jorun','Kael','Lewin','Marro','Nels','Orin','Pell',
  'Quill','Rand','Soren','Torn','Ulric','Vara','Wynn','Xan','Yvor','Zed',
];
const FIRST_NAMES_FEMALE = [
  'Aela','Bryn','Cara','Deva','Elda','Faye','Gwen','Hilde',
  'Ira','Joska','Kira','Lyra','Mira','Nea','Ora','Petra',
  'Quara','Reva','Syla','Tova','Una','Vera','Wren','Xia','Ysa','Zora',
];
const SURNAMES = [
  'Ashveil','Blackwood','Coldwater','Darkmoor','Evenglade','Fairwind',
  'Grimthorn','Halloway','Ironfield','Jademore','Knotwood','Lorne',
  'Mistfall','Nighthollow','Oakhurst','Pinecrest','Quarry','Ravenmore',
  'Stonehearth','Thorngate','Umberton','Valmore','Westmarch','Yewdale',
];

const RACES = ['Human', 'Elf', 'Orc', 'Halfling', 'Dwarf', 'Tiefling'];
const JOBS: JobType[] = ['laborer','merchant','guard','healer','scholar','thief','farmer','innkeeper','none'];
const ALL_TRAITS: NpcTrait[] = [
  'brave','cowardly','greedy','generous','aggressive','passive',
  'flirtatious','reserved','curious','paranoid','loyal','treacherous',
];

// ── Seeded random helper ────────────────────────────────────────────────────
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function pickFrom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickNFrom<T>(arr: T[], n: number, rand: () => number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

// ── NPC generation ─────────────────────────────────────────────────────────

/** Generate a single NPC from a numeric seed. */
export function generateNpc(seed: number, locationId: string): SimNpc {
  const rand = seededRand(seed);
  const gender = rand() > 0.5 ? 'male' : 'female';
  const firstName = gender === 'male'
    ? pickFrom(FIRST_NAMES_MALE, rand)
    : pickFrom(FIRST_NAMES_FEMALE, rand);
  const name = `${firstName} ${pickFrom(SURNAMES, rand)}`;
  const race = pickFrom(RACES, rand);
  const age = 18 + Math.floor(rand() * 45);
  const job = pickFrom(JOBS, rand);
  const traits = pickNFrom(ALL_TRAITS, 2 + Math.floor(rand() * 2), rand);

  const schedule = buildDefaultSchedule(job);

  return {
    id: `npc_${seed}`,
    name,
    race,
    gender,
    age,
    job,
    traits,
    needs: {
      hunger: 60 + Math.floor(rand() * 30),
      energy: 60 + Math.floor(rand() * 30),
      social: 50 + Math.floor(rand() * 40),
      happiness: 50 + Math.floor(rand() * 40),
      wealth: 20 + Math.floor(rand() * 60),
    },
    memory: [],
    relationships: [],
    current_state: 'idle',
    location_id: locationId,
    stats: {
      health: 80 + Math.floor(rand() * 20),
      stamina: 70 + Math.floor(rand() * 30),
      gold: 5 + Math.floor(rand() * 50),
    },
    schedule,
    dialogue_cache: {},
  };
}

/** Generate a set of NPCs for a given location. */
export function generateNpcsForLocation(
  locationId: string,
  count: number,
  baseSeed: number
): SimNpc[] {
  return Array.from({ length: count }, (_, i) =>
    generateNpc(baseSeed + i * 31337, locationId)
  );
}

// ── Location generation ────────────────────────────────────────────────────

const LOCATION_NAMES: Record<SimLocation['type'], string[]> = {
  town:      ['Ashford','Millhaven','Thornwick','Duskbridge','Ironmore'],
  wilderness:['Blackwood Forest','Misty Moors','Ashen Plains','Thornfield','Stone Ridge'],
  dungeon:   ['The Rotting Keep','Bleakstone Cavern','Dread Hollow','Serpent\'s Den'],
  home:      ['Your Dwelling','The Rented Room','The Safe House'],
  market:    ['Eastern Bazaar','Trade Square','The Black Market'],
  tavern:    ['The Crooked Flagon','The Weeping Widow','The Silver Stag'],
  farm:      ['Old Mill Farm','Harvest Acres','The Green Paddock'],
};

/** Generate a single location from a seed and type. */
export function generateLocation(
  seed: number,
  type: SimLocation['type'],
  index: number
): SimLocation {
  const rand = seededRand(seed + index * 7919);
  const names = LOCATION_NAMES[type];
  const name = names[Math.floor(rand() * names.length)];

  return {
    id: `loc_${type}_${index}`,
    name,
    type,
    x: Math.floor(rand() * 80) + 10, // 10-90%
    y: Math.floor(rand() * 80) + 10,
    danger: type === 'dungeon' ? 0.6 + rand() * 0.4 : rand() * 0.3,
    prosperity: type === 'town' || type === 'market' ? 0.5 + rand() * 0.5 : rand() * 0.5,
    npcs_present: [],
  };
}

// ── World generation ────────────────────────────────────────────────────────

/** Generate a starter set of world locations. */
export function generateWorldLocations(seed: number): SimLocation[] {
  const types: SimLocation['type'][] = [
    'town', 'town', 'market', 'tavern', 'tavern',
    'farm', 'farm', 'wilderness', 'dungeon',
  ];
  return types.map((t, i) => generateLocation(seed, t, i));
}

/** Procedurally generate a starting world with NPCs. */
export function generateStartingWorld(seed: number): {
  locations: SimLocation[];
  npcs: SimNpc[];
  economy: ReturnType<typeof initEconomy>;
} {
  const locations = generateWorldLocations(seed);

  const npcs: SimNpc[] = [];
  const npcDensity: Partial<Record<SimLocation['type'], number>> = {
    town: 6, market: 4, tavern: 5, farm: 3, wilderness: 1, dungeon: 2,
  };

  locations.forEach((loc, li) => {
    const count = npcDensity[loc.type] ?? 2;
    const locNpcs = generateNpcsForLocation(loc.id, count, seed + li * 999983);
    loc.npcs_present = locNpcs.map(n => n.id);
    npcs.push(...locNpcs);
  });

  return { locations, npcs, economy: initEconomy() };
}

// ── Event generation ───────────────────────────────────────────────────────

const EVENT_TEMPLATES = [
  'A merchant caravan arrives from the east, bringing rare goods.',
  'A plague of locusts threatens the harvest. Grain prices are rising.',
  'Bandits have been spotted on the northern road.',
  'The local healer has fallen ill. Medicine is in short supply.',
  'A festival is declared. Ale flows freely at the tavern.',
  'A traveling scholar arrives with news from the capital.',
  'The mine yields an unusual crystal. Rumours of magic spread.',
  'A noble\'s horse went missing. A reward is offered.',
  'Drought threatens the season\'s crops.',
  'A mysterious stranger moves into the old mill.',
];

/** Generate a random world event. */
export function generateRandomEvent(day: number): string {
  const idx = (day * 7 + Math.floor(Math.random() * EVENT_TEMPLATES.length)) % EVENT_TEMPLATES.length;
  return EVENT_TEMPLATES[idx];
}
