/**
 * ProceduralGen — generates NPCs, world locations, and events procedurally.
 * Pure functions; deterministic seeding supported; no side effects.
 */
import { SimNpc, SimLocation, NpcTrait, JobType, DailySchedule } from './types';
import { buildDefaultSchedule } from './TimeSystem';
import { initEconomy } from './EconomySystem';
import { defaultSkills } from './SkillsSystem';
import { defaultCorruptionState } from './CorruptionSystem';
import { defaultFame } from './FameSystem';
import { defaultClothingLoadout } from './ClothingSystem';
import { defaultTransformationState } from './TransformationSystem';
import { defaultAddictionState } from './AddictionSystem';
import { defaultDiseaseState } from './DiseaseSystem';
import { defaultArcaneState } from './ArcaneSystem';
import { defaultParasiteState } from './ParasiteSystem';
import { defaultCompanionState } from './CompanionSystem';
import { defaultAllureState } from './AllureSystem';
import { defaultRestraintState } from './RestraintSystem';
import { defaultFactions } from './FactionSystem';

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

  // Generate starting skills based on job (some baseline competence)
  const skills = { ...defaultSkills() };
  const JOB_STARTING_SKILLS: Record<string, Partial<typeof skills>> = {
    guard: { combat: 20 + Math.floor(rand() * 20), athletics: 15 + Math.floor(rand() * 15) },
    thief: { skulduggery: 25 + Math.floor(rand() * 20), athletics: 10 + Math.floor(rand() * 15) },
    innkeeper: { housekeeping: 20 + Math.floor(rand() * 15), seduction: 5 + Math.floor(rand() * 10) },
    merchant: { seduction: 10 + Math.floor(rand() * 15) },
    healer: { housekeeping: 15 + Math.floor(rand() * 10) },
    farmer: { athletics: 15 + Math.floor(rand() * 15), housekeeping: 10 + Math.floor(rand() * 10) },
    laborer: { athletics: 20 + Math.floor(rand() * 15) },
    scholar: { housekeeping: 5 + Math.floor(rand() * 5) },
    none: {},
  };
  Object.assign(skills, JOB_STARTING_SKILLS[job] ?? {});

  // Generate starting corruption state
  const corruption_state = { ...defaultCorruptionState() };
  corruption_state.willpower = 50 + Math.floor(rand() * 40);
  corruption_state.stress = Math.floor(rand() * 20);

  // Generate starting fame based on job
  const fame = { ...defaultFame() };
  if (job === 'guard') fame.combat_fame = 5 + Math.floor(rand() * 10);
  if (job === 'thief') fame.crime = 5 + Math.floor(rand() * 15);
  if (job === 'merchant') fame.wealth_fame = 5 + Math.floor(rand() * 10);
  if (job === 'innkeeper') fame.social = 10 + Math.floor(rand() * 10);

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
    skills,
    corruption_state,
    fame,
    clothing: defaultClothingLoadout(),
    memory: [],
    relationships: [],
    current_state: 'idle',
    location_id: locationId,
    target_location_id: null,
    stats: {
      health: 80 + Math.floor(rand() * 20),
      stamina: 70 + Math.floor(rand() * 30),
      gold: 5 + Math.floor(rand() * 50),
    },
    schedule,
    dialogue_cache: {},
    transformation: defaultTransformationState(),
    addiction_state: defaultAddictionState(),
    disease_state: defaultDiseaseState(),
    arcane_state: defaultArcaneState(),
    parasite_state: defaultParasiteState(),
    companion_state: defaultCompanionState(),
    allure_state: defaultAllureState(),
    restraint_state: defaultRestraintState(),
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
  school:    ['The Academy','Hall of Learning','The Scriptorium'],
  temple:    ['Temple of the Divines','The Sacred Grove','Chapel of Light'],
  docks:     ['The Harbour','Fisherman\'s Wharf','The Pier'],
  alleyway:  ['The Backstreets','Shadow Lane','Rats\' Alley'],
  brothel:   ['The Velvet Room','The Red Lantern','The Gilded Lily'],
  park:      ['Town Park','The Commons','The Green'],
  hospital:  ['Nightingale Hospital','The Infirmary','The Clinic'],
  prison:    ['Town Gaol','The Stockade','The Dungeon'],
  strip_club:['The Red Room','The Velvet Stage','The Cabaret'],
  dance_studio:['The Dance Hall','The Ballet Room','The Studio'],
  arcade:    ['The Gambling Den','The Card House','The Dice Room'],
  shopping:  ['The High Street','The Boutique Row','The Market Hall'],
  moor:      ['The Windswept Moor','The Heather Fields','The Boglands'],
  cave:      ['The Wolf Den','The Deep Cave','The Grotto'],
  cabin:     ['The Forest Cabin','The Hunter\'s Lodge','The Hermitage'],
  ocean:     ['The Open Sea','The Deep Waters','The Shallows'],
  sewers:    ['The Undercity','The Drains','The Tunnels'],
  museum:    ['The Museum','The Gallery','The Archive'],
  cafe:      ['The Cosy Corner','The Tea Room','The Bakehouse'],
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
    danger: locationDanger(type, rand),
    prosperity: type === 'town' || type === 'market' ? 0.5 + rand() * 0.5 : rand() * 0.5,
    npcs_present: [],
  };
}

/** Determine location danger based on type. */
function locationDanger(type: SimLocation['type'], rand: () => number): number {
  switch (type) {
    case 'dungeon': return 0.6 + rand() * 0.4;
    case 'alleyway': return 0.4 + rand() * 0.3;
    case 'wilderness': return 0.2 + rand() * 0.3;
    case 'brothel': return 0.3 + rand() * 0.3;
    case 'docks': return 0.15 + rand() * 0.25;
    case 'home': return rand() * 0.05;
    case 'temple': return rand() * 0.05;
    case 'school': return rand() * 0.1;
    default: return rand() * 0.3;
  }
}

// ── World generation ────────────────────────────────────────────────────────

/** Generate a starter set of world locations. */
export function generateWorldLocations(seed: number): SimLocation[] {
  const types: SimLocation['type'][] = [
    'town', 'town', 'market', 'tavern', 'tavern',
    'farm', 'farm', 'wilderness', 'dungeon',
    'school', 'temple', 'docks', 'alleyway', 'brothel', 'home',
  ];
  return types.map((t, i) => generateLocation(seed, t, i));
}

/** Procedurally generate a starting world with NPCs. */
export function generateStartingWorld(seed: number): {
  locations: SimLocation[];
  npcs: SimNpc[];
  economy: ReturnType<typeof initEconomy>;
  factions: ReturnType<typeof defaultFactions>;
  criminal_records: Record<string, import('./types').CriminalRecord>;
} {
  const locations = generateWorldLocations(seed);

  const npcs: SimNpc[] = [];
  const npcDensity: Partial<Record<SimLocation['type'], number>> = {
    town: 6, market: 4, tavern: 5, farm: 3, wilderness: 1, dungeon: 2,
    school: 4, temple: 3, docks: 4, alleyway: 2, brothel: 3, home: 0,
  };

  locations.forEach((loc, li) => {
    const count = npcDensity[loc.type] ?? 2;
    const locNpcs = generateNpcsForLocation(loc.id, count, seed + li * 999983);
    loc.npcs_present = locNpcs.map(n => n.id);
    npcs.push(...locNpcs);
  });

  return { locations, npcs, economy: initEconomy(), factions: defaultFactions(), criminal_records: {} };
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
  'A gang of pickpockets has been targeting the market square.',
  'The temple announces a day of prayer and reflection.',
  'A fire breaks out in the docks warehouse district.',
  'A famous bard arrives to perform at the tavern tonight.',
  'The guard captain issues a curfew after dark for the alleyways.',
  'A love triangle between prominent citizens becomes town gossip.',
  'Heavy rains flood the lower streets. Travel is difficult.',
  'A wealthy patron is seeking bodyguards for a dangerous journey.',
  'The school headmaster announces examinations next week.',
  'A stray animal has been seen lurking near the farms.',
  'A new law bans certain goods from the black market.',
  'A local couple announces their engagement at the tavern.',
  'Rumors of a haunted dwelling spread through the town.',
  'A traveling circus sets up camp on the outskirts.',
  'The dock workers threaten to strike over low wages.',
];

/** Generate a random world event. */
export function generateRandomEvent(day: number): string {
  const idx = (day * 7 + Math.floor(Math.random() * EVENT_TEMPLATES.length)) % EVENT_TEMPLATES.length;
  return EVENT_TEMPLATES[idx];
}
