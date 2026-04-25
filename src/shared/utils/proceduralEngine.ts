/**
 * proceduralEngine.ts — game-layer bridge for the procedural generation system.
 *
 * Wraps ProceduralGen (pure sim) and extends it with:
 *   - Rich event generation with narrative hooks
 *   - NPC backstory templates for AI Horde expansion
 *   - Dungeon layout generation with Elder Scrolls themes
 *   - Tavern rumours that seed radiant quests
 *   - Atmospheric location descriptions
 *   - Loot table generation
 *   - Radiant quest generation
 *   - Weather narrative generation
 *
 * Templates produce structured output usable directly OR as AI Horde prompts.
 *
 * Elder Scrolls flavour:
 *   - Dwemer ruins, Nordic tombs, Ayleid ruins, Daedric shrines, Falmer warrens
 *   - Khajiit caravans, Dunmer ash wastes, Imperial roads
 *
 * @see src/sim/ProceduralGen.ts  — seeded NPC/location/event generator
 * @see src/sim/types.ts          — SimNpc, SimLocation, SimWorld
 */

import {
  generateNpc,
  generateLocation,
  generateRandomEvent as simRandomEvent,
} from '../sim/ProceduralGen';
import { GameState } from '../../core/types';

// ── RNG helper ────────────────────────────────────────────────────────────────

function seededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) // 0x100000000;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function intBetween(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type LocationType = 'town''| 'wilderness''| 'dungeon''| 'tavern''| 'market'
  | 'temple''| 'docks''| 'alleyway''| 'brothel''| 'cave''| 'home''| 'farm''| 'sewers';

export type TimeOfDay = 'dawn''| 'morning''| 'midday''| 'afternoon''| 'dusk''| 'evening''| 'night''| 'midnight';

export type DungeonTheme = 'dwemer''| 'nordic''| 'ayleid''| 'daedric''| 'falmer';

export type QuestType = 'bounty''| 'fetch''| 'escort''| 'investigate''| 'clear_dungeon';

export type WeatherType = 'clear''| 'cloudy''| 'rain''| 'storm''| 'snow''| 'fog''| 'ashstorm''| 'blizzard';

export type Season = 'spring''| 'summer''| 'autumn''| 'winter';

// ── generateRandomEvent ────────────────────────────────────────────────────────

export interface ProceduralEvent {
  title: string;
  description: string;
  narrative_hook: string;
  location_type: LocationType;
  time_of_day: TimeOfDay;
  urgency: 'low''| 'medium''| 'high''| 'critical';
  tags: string[];
  ai_prompt_hint: string;
}

const EVENT_POOL: Record<LocationType, Array<{
  title: string;
  desc: string;
  hook: string;
  urgency: ProceduralEvent['urgency'];
  tags: string[];
}>> = {
  town: [
    { title: 'Curfew Declared', desc: 'The Jarl\'s guards announce a curfew after a string of murders in the market district.', hook: 'Do you obey, or move through the shadows?', urgency: 'high', tags: ['crime','politics','guard'] },
    { title: 'Merchant Caravan Arrives', desc: 'A caravan from Elsweyr arrives bearing Moon Sugar, exotic fabrics, and Khajiit traders with sharp eyes and sharper tongues.', hook: 'They have something rare — and so do you.', urgency: 'low', tags: ['trade','khajiit','opportunity'] },
    { title: 'Public Execution', desc: 'A Stormcloak prisoner is to be executed in the town square. The crowd is tense.', hook: 'A hooded figure catches your eye and nods toward an alley.', urgency: 'medium', tags: ['politics','war','intrigue'] },
    { title: 'Festival of Talos', desc: 'Despite Imperial law, the town secretly celebrates Talos. Altmer agents are watching.', hook: 'Someone offers you a carved Talos amulet.', urgency: 'medium', tags: ['religion','politics','risk'] },
  ],
  wilderness: [
    { title: 'Dragon Sighting', desc: 'A black dragon circles the eastern peaks. Farmers are abandoning their fields.', hook: 'The dragon lands briefly and seems to study you.', urgency: 'critical', tags: ['dragon','danger','supernatural'] },
    { title: 'Bandit Ambush', desc: 'Three bandits step out from behind rocks, weapons drawn. Their leader smiles without warmth.', hook: '"Empty your pockets and we\'ll let you keep your teeth."', urgency: 'high', tags: ['bandits','combat','robbery'] },
    { title: 'Shrine of Kynareth', desc: 'A mossy stone shrine stands undisturbed by a mountain spring. A pilgrim kneels weeping.', hook: 'The pilgrim looks up — they\'ve been waiting.', urgency: 'low', tags: ['religion','divine','mystery'] },
    { title: 'Dead Traveller', desc: 'A Nord body lies face-down on the road, pack rifled, journal nearby.', hook: 'The last entry mentions a hidden cave worth a fortune.', urgency: 'medium', tags: ['death','loot','mystery'] },
  ],
  dungeon: [
    { title: 'Awakened Draugr', desc: 'Scratching echoes from a sealed burial chamber. The seal is new.', hook: 'Someone recently opened this — and wasn\'t the last to leave.', urgency: 'high', tags: ['undead','nordic','danger'] },
    { title: 'Dwarven Mechanism', desc: 'A massive gear apparatus blocks the passage. It hasn\'t moved in centuries.', hook: 'A lever nearby still looks functional.', urgency: 'medium', tags: ['dwemer','puzzle','trap'] },
    { title: 'Treasure Cache', desc: 'Behind a false wall you find a buried chest. Septims, a soul gem, and a folded note.', hook: 'The note is addressed to you by name.', urgency: 'low', tags: ['loot','mystery','supernatural'] },
  ],
  tavern: [
    { title: 'Brawl Breaks Out', desc: 'Two Nords start throwing punches over a woman\'s honour. The barkeep ducks behind the counter.', hook: 'One of them grabs you for support.', urgency: 'medium', tags: ['violence','social','opportunity'] },
    { title: 'Mysterious Stranger', desc: 'A hooded figure in the corner has been watching you. They have an empty mug but haven\'t ordered again in hours.', hook: 'They slide a sealed letter across the table.', urgency: 'medium', tags: ['intrigue','quest_seed','mystery'] },
    { title: 'Bard\'s Performance', desc: 'A travelling bard performs "The Dragonborn Comes". The crowd goes quiet. Then uneasy.', hook: 'The bard\'s eyes find yours and they change the lyrics.', urgency: 'low', tags: ['performance','prophecy','social'] },
  ],
  market: [
    { title: 'Pickpocket Ring', desc: 'Three urchins are working the crowd. You spot the exchange.', hook: 'Do you intervene, or join in?', urgency: 'low', tags: ['crime','theft','skulduggery'] },
    { title: 'Rare Item for Sale', desc: 'A Redguard merchant has a soul gem that pulses with unusual purple light.', hook: '"Special price. Just for you. Don\'t ask where I got it."', urgency: 'low', tags: ['trade','arcane','mystery'] },
  ],
  temple: [
    { title: 'Cultist Disruption', desc: 'Worshippers of Mehrunes Dagon have defaced the altar of Mara. The priests are furious.', hook: 'The head priest asks you to investigate.', urgency: 'high', tags: ['daedric','religion','crime'] },
    { title: 'Miraculous Healing', desc: 'A dying child is brought in. The healers are exhausted and their potions depleted.', hook: 'Something stirs in you — an ability you didn\'t know you had.', urgency: 'critical', tags: ['healing','divine','restoration'] },
  ],
  docks: [
    { title: 'Smugglers\''Drop', desc: 'A crate stamped with East Empire Company marks is swapped for an identical unmarked one.', hook: 'A guard is looking the other way. Someone paid him.', urgency: 'medium', tags: ['crime','smuggling','intrigue'] },
  ],
  alleyway: [
    { title: 'Marked for Death', desc: 'You find a Black Hand note pinned to your door. The symbol is fresh.', hook: 'Someone paid to have you silenced.', urgency: 'critical', tags: ['dark_brotherhood','assassination','danger'] },
    { title: 'Skooma Den', desc: 'A low doorway leads to a candlelit room full of glassy-eyed souls. The air is sweet and poisonous.', hook: 'Someone you know is here. They haven\'t noticed you yet.', urgency: 'medium', tags: ['drugs','skooma','social'] },
  ],
  brothel: [
    { title: 'Blackmail Ledger', desc: 'A noble\'s private ledger was left in a room. Names, dates, amounts.', hook: 'This could ruin a lord — or make you very wealthy.', urgency: 'medium', tags: ['blackmail','politics','intrigue'] },
  ],
  cave: [
    { title: 'Moonstone Vein', desc: 'A moonstone vein glitters in the cave wall. It\'s been partially mined — recently.', hook: 'A pickaxe leans nearby. The miner isn\'t here.', urgency: 'low', tags: ['mining','resource','mystery'] },
  ],
  home: [
    { title: 'Break-In', desc: 'The lock has been forced. Inside, a drawer hangs open — your strongbox untouched.', hook: 'Whoever broke in was looking for something specific.', urgency: 'high', tags: ['crime','personal','intrigue'] },
  ],
  farm: [
    { title: 'Blight Infection', desc: 'Dark lesions appear on the wheat crop overnight. The farmer is pale with fear.', hook: 'This looks like Blight — which hasn\'t been seen this far west in decades.', urgency: 'high', tags: ['disease','blight','economy'] },
  ],
  sewers: [
    { title: 'Thieves Guild Cache', desc: 'A hollow stone conceals a guild stash: lockpicks, a note in cipher, a map fragment.', hook: 'The map shows a location you recognise.', urgency: 'medium', tags: ['thieves_guild','loot','intrigue'] },
  ],
};

/**
 * Generate a procedural world event with narrative hook.
 *
 * @param state       - Full GameState
 * @param locationType - Type of location the event occurs at
 * @param timeOfDay    - Time of day (affects atmosphere)
 * @param rng          - Injectable random function
 */
export function generateRandomEvent(
  state: GameState,
  locationType: LocationType,
  timeOfDay: TimeOfDay,
  rng: () => number = Math.random,
): ProceduralEvent {
  const pool = EVENT_POOL[locationType] ?? EVENT_POOL['town'];
  const template = pick(pool, rng);

  // Time-of-day atmosphere modifier
  const timeAtmosphere: Record<TimeOfDay, string> = {
    dawn:      'As the first light breaks over the horizon, ',
    morning:   'In the crisp morning air, ',
    midday:    'Under the full glare of the midday sun, ',
    afternoon: 'In the lazy afternoon warmth, ',
    dusk:      'As the sun dips low and shadows lengthen, ',
    evening:   'In the amber glow of evening, ',
    night:     'Under cover of night, ',
    midnight:  'In the dead of midnight, ',
  };

  const atmosphere = timeAtmosphere[timeOfDay];
  const description = `${atmosphere}${template.desc}`;

  const ai_prompt_hint = `Generate a detailed, atmospheric Elder Scrolls scene: ${template.title} at a ${locationType} during ${timeOfDay}. Tone: dark fantasy. Tags: ${template.tags.join('',')}. Hook: ${template.hook}`;

  return {
    title: template.title,
    description,
    narrative_hook: template.hook,
    location_type: locationType,
    time_of_day: timeOfDay,
    urgency: template.urgency,
    tags: template.tags,
    ai_prompt_hint,
  };
}

// ── generateNpcBackstory ───────────────────────────────────────────────────────

export interface NpcBackstoryTemplate {
  npc_id: string;
  summary: string;
  childhood: string;
  turning_point: string;
  current_motivation: string;
  secret: string;
  ai_expansion_prompt: string;
}

const CHILDHOOD_TEMPLATES: Record<string, string[]> = {
  Nord:     ['Grew up in a longhouse near Windhelm, learning to fight before they could read.','The child of a blacksmith, spent summers forging simple nails and dreaming of glory.'],
  Imperial: ['Born in Cyrodiil, raised on stories of the old Empire.','Grew up near the White-Gold Tower, watching soldiers march in formation.'],
  Dunmer:   ['Raised in a Great House on Morrowind, surrounded by ash and ancestral obligation.','A refugee from Red Mountain\'s eruption, carrying nothing but ash and grief.'],
  Khajiit:  ['Grew up on the roads between Elsweyr and Cyrodiil, the caravan as home.','The child of a Moon Sugar merchant, learning trade before walking.'],
  Argonian: ['Hatched in the Hist swamps, bonded to the great tree before first memory.','Escaped the slave pits of Morrowind, carrying scars that never healed.'],
  Bosmer:   ['Raised in the canopy of Valenwood, speaking to animals before humans.','The child of hunters, taught that every death must be consumed.'],
  Altmer:   ['Born to a minor Altmeri noble family, their name weighing heavier than their deeds.','Grew up in the Crystal Tower\'s shadow, measuring worth by magical aptitude.'],
  default:  ['Grew up in a small village, one of many children scraping for bread.','An orphan who learned early that survival requires compromise.'],
};

const TURNING_POINTS = [
  'The day the Companions offered them a place, changing everything.',
  'A chance encounter with a Daedric Prince that left them forever altered.',
  'The night they witnessed something terrible and said nothing.',
  'The theft that started a career they never intended.',
  'A plague that took everyone they loved, leaving only purpose.',
  'The shipwreck that stranded them in a foreign land.',
  'Discovering a Dwemer artefact that revealed dangerous truths.',
  'Being sold into servitude and escaping through cunning alone.',
  'A vision during the eclipse that no one else saw.',
  'The death of a mentor whose ghost refuses to let them rest.',
];

const MOTIVATIONS = [
  'To restore their family\'s honour before they die.',
  'To find the person who destroyed their home and make it right.',
  'To earn enough gold to disappear and start over somewhere warm.',
  'To prove to themselves that they are not what they fear.',
  'To understand the power they carry before it destroys them.',
  'To serve a Daedric Prince whose demands grow stranger each moon.',
  'To find a cure for the curse placed on their bloodline.',
  'Simply to survive one more day, and then the next.',
  'To gather forbidden knowledge that was promised would set them free.',
  'To complete the contract — no matter what it costs.',
];

const SECRETS = [
  'They witnessed a murder and let the killer walk free.',
  'They are secretly working for the Thalmor.',
  'Their identity is stolen — the real person is dead.',
  'They carry a sealed soul gem containing someone they loved.',
  'They have never actually killed anyone, despite the reputation.',
  'They owe a debt to Sanguine that they have been avoiding.',
  'They can hear the whispers from Apocrypha when it rains.',
  'They are the last of a bloodline that a Daedric Prince wants erased.',
  'They have a family they abandoned and pretend do not exist.',
  'They know who killed the Jarl\'s son. They saw everything.',
];

/**
 * Generate an NPC backstory template for AI Horde expansion.
 */
export function generateNpcBackstory(
  npcId: string,
  race: string,
  gender: string,
  job: string,
  traits: string[],
  rng: () => number = Math.random,
): NpcBackstoryTemplate {
  const childhoods = CHILDHOOD_TEMPLATES[race] ?? CHILDHOOD_TEMPLATES['default'];
  const childhood = pick(childhoods, rng);
  const turning_point = pick(TURNING_POINTS, rng);
  const current_motivation = pick(MOTIVATIONS, rng);
  const secret = pick(SECRETS, rng);

  const traitStr = traits.length > 0 ? traits.join('')and ') : 'unremarkable';

  const summary = `A ${gender} ${race} ${job}, ${traitStr} by nature. ${childhood}`;

  const ai_expansion_prompt = `Write a 2-3 paragraph dark fantasy backstory for an Elder Scrolls NPC:
Race: ${race}, Gender: ${gender}, Job: ${job}, Traits: ${traits.join('',')}.
Childhood: ${childhood}
Turning Point: ${turning_point}
Current Drive: ${current_motivation}
Secret: ${secret}
Tone: gritty, personal, Elder Scrolls lore-accurate. Avoid clichés. Include one specific sensory detail.`;

  return {
    npc_id: npcId,
    summary,
    childhood,
    turning_point,
    current_motivation,
    secret,
    ai_expansion_prompt,
  };
}

// ── generateDungeonLayout ──────────────────────────────────────────────────────

export type RoomType = 'entrance''| 'corridor''| 'chamber''| 'boss_chamber''| 'treasure_room''| 'puzzle_room''| 'trap_corridor''| 'safe_alcove';

export interface DungeonRoom {
  id: string;
  type: RoomType;
  name: string;
  description: string;
  encounter: string | null;
  loot_quality: 'none''| 'low''| 'medium''| 'high''| 'legendary';
  exit_count: number;
  trap: string | null;
}

export interface DungeonLayout {
  theme: DungeonTheme;
  difficulty: number;   / 1-10
  name: string;
  rooms: DungeonRoom[];
  boss_name: string;
  lore_note: string;
  ai_atmosphere_prompt: string;
}

const DUNGEON_DATA: Record<DungeonTheme, {
  names: string[];
  rooms: Array<{ type: RoomType; name: string; desc: string }>;
  encounters: string[];
  bosses: string[];
  lore: string[];
}> = {
  dwemer: {
    names: ['Nchuand-Zel Annex','Arkngthamz Depths','Bthalft Undercroft','Dwarven Mechanism Chamber'],
    rooms: [
      { type: 'entrance', name: 'Steam Vent Foyer', desc: 'Brass pipes hiss scalding steam. Centurion sentinels stand cold and inert — for now.''},
      { type: 'corridor', name: 'Automaton Assembly Line', desc: 'Rusted spider-like constructs line the walls, half-assembled for a war that never came.''},
      { type: 'puzzle_room', name: 'Resonator Hall', desc: 'Crystal resonators hum with contained lightning. The puzzle requires specific frequency tuning.''},
      { type: 'chamber', name: 'Boilery Chamber', desc: 'A cavernous space filled with Dwemer plumbing. The sound is deafening.''},
      { type: 'boss_chamber', name: 'Centurion Core Room', desc: 'The master Dwarven Centurion stands dormant at the chamber\'s heart, awaiting intrusion.''},
      { type: 'treasure_room', name: 'Animonculory Vault', desc: 'Racks of Dwarven metal, oiled gears, and soul gem caches line every wall.''},
    ],
    encounters: ['Dwarven Spider','Dwarven Sphere','Falmer','Frostbite Spider (large)'],
    bosses: ['Animonculory Master Centurion','Spectral Dwarven Overseer','Elder Dwarven Sphere Commander'],
    lore: ['A tattered journal theorises the Dwemer vanished during a botched attempt to harness the power of the Heart of Lorkhan.','Carved glyphs describe a "Brass God" being constructed beneath this very floor.'],
  },
  nordic: {
    names: ['Yngol Barrow','Ansilvund Catacombs','Forelhost Crypt','Valthume Underhall'],
    rooms: [
      { type: 'entrance', name: 'Stone Threshold', desc: 'Iron sconces hold torches that have somehow never gone out. Nordic script warns the living to turn back.''},
      { type: 'corridor', name: 'Burial Hall', desc: 'Stone sarcophagi line each wall. Some are already opened from the inside.''},
      { type: 'trap_corridor', name: 'Pressure Plate Run', desc: 'A pattern of wear suggests someone has passed here before. Their skeleton at the far end confirms they got it wrong.''},
      { type: 'chamber', name: 'Mead Hall of the Dead', desc: 'Ghostly feasting — transparent revellers drain phantom mead in a hall cold as a grave.''},
      { type: 'boss_chamber', name: 'Dragon Priest Sanctum', desc: 'A sealed stone door opens with a Word Wall\'s vibration. Within, a masked figure sits in perpetual vigil.''},
      { type: 'treasure_room', name: 'Burial Wealth Chamber', desc: 'Grave goods: shields, ancient coin, a weapon that still gleams after centuries.''},
    ],
    encounters: ['Draugr','Skeleton Warrior','Draugr Overlord','Restless Spirit'],
    bosses: ['Dragon Priest (Masked)','Warlord Draugr Deathlord','Revenant Jarl'],
    lore: ['The Word Wall teaches a fragment of an ancient Shout.','Carved inscriptions tell of a hero betrayed by a trusted shield-sibling.'],
  },
  ayleid: {
    names: ['Vindasel Undercroft','Hrotanda Vale Ruin','Anutwyll Inner Chamber','Vahtacen Depths'],
    rooms: [
      { type: 'entrance', name: 'White Gold Threshold', desc: 'Welkynd stones glow cold blue in the ceiling. Ayleid script lines every surface.''},
      { type: 'corridor', name: 'Magicka Conduit Hall', desc: 'A river of raw magicka flows suspended through air ducts carved with impossible precision.''},
      { type: 'puzzle_room', name: 'Varla Stone Chamber', desc: 'Empty Varla Stone cradles surround a central socket. Something is missing.''},
      { type: 'chamber', name: 'Statue Gallery', desc: 'Statues of Ayleid nobles, their expressions eternally contemptuous.''},
      { type: 'boss_chamber', name: 'Lich Throne Room', desc: 'An Ayleid Lich sits upon a throne of crystallised magicka, crown still gleaming after three millennia.''},
      { type: 'treasure_room', name: 'Welkynd Cache', desc: 'Crates of Welkynd Stones and scrolls in the old Ayleid tongue.''},
    ],
    encounters: ['Ayleid Lich','Skeleton Mage','Will-o-the-Wisp','Zombie'],
    bosses: ['Ayleid High Sorcerer Lich','Daedric Summoner','Corrupted Mage Revenant'],
    lore: ['The stones describe Elven supremacist ideology and the "divine right" to enslave Men.','A hidden chamber commemorates those enslaved here.'],
  },
  daedric: {
    names: ['Shrine of Mehrunes Dagon','Namira\'s Grotto','Sanguine\'s Pleasure Den','Molag Bal\'s Reaping Hall'],
    rooms: [
      { type: 'entrance', name: 'Oblivion Gate Remnant', desc: 'The air smells of sulphur and blood. Scattered red crystals mark where a gate once stood.''},
      { type: 'corridor', name: 'Daedra Bone Corridor', desc: 'The walls are tiled with Daedra bone, still warm. Things move in the walls.''},
      { type: 'chamber', name: 'Sacrificial Circle', desc: 'A summoning circle is fresh with blood. The ritual was interrupted mid-step.''},
      { type: 'trap_corridor', name: 'Chaos Spike Hall', desc: 'Black spikes emerge randomly from the floor. The pattern is not random — it\'s a test.''},
      { type: 'boss_chamber', name: 'Prince\'s Altar', desc: 'A massive altar pulses with Daedric energy. Something has been bound here and wants to be free.''},
      { type: 'treasure_room', name: 'Cultist Stores', desc: 'Daedric artefacts, black soul gems, and profane texts collected by devoted worshippers.''},
    ],
    encounters: ['Dremora','Flame Atronach','Daedra Cultist','Dark Seducer'],
    bosses: ['Dremora Lord Champion','Daedric High Priest','Manifestation of the Prince'],
    lore: ['A cultist\'s diary describes their first contract with the Prince and their slow, willing unravelling.','The altar inscription promises power to those who offer what they love most.'],
  },
  falmer: {
    names: ['Falmer Warren Depths','Chaurus Breeding Hive','Snow Elf Exile Tomb','Betrayal Cavern'],
    rooms: [
      { type: 'entrance', name: 'Bone-Strewn Passage', desc: 'Gnawed bones and Falmer nesting material choke the passage. The smell is overwhelming.''},
      { type: 'corridor', name: 'Chaurus Egg Corridor', desc: 'Clusters of eggs pulse rhythmically. The walls drip with something organic.''},
      { type: 'chamber', name: 'Falmer Shaman\'s Cave', desc: 'Crude idols and fetish objects hang from the ceiling. A Falmer Shaman chants over a cauldron.''},
      { type: 'trap_corridor', name: 'Sightless Hunter Run', desc: 'The Falmer are blind but their hearing is extraordinary. Every step is a gamble.''},
      { type: 'boss_chamber', name: 'Betrayed King\'s Chamber', desc: 'A massive Falmer Shaman-King sits enthroned on a pile of Dwemer refuse, surrounded by devoted servants.''},
      { type: 'treasure_room', name: 'Stolen Wealth Cache', desc: 'Salvage taken from Dwemer ruins and unlucky travellers: equipment, gems, ancient artefacts.''},
    ],
    encounters: ['Falmer','Chaurus','Falmer Shaman','Chaurus Reaper'],
    bosses: ['Falmer Shaman-King','Ancient Chaurus Queen','Knight-Paladin Gelebor (corrupted)'],
    lore: ['Scratched into the wall in archaic Aldmeri: "We were beautiful once."','A journal from a Snow Elf describes the moment they accepted blindness as the price of survival.'],
  },
};

/**
 * Generate a dungeon layout with rooms, encounters, and loot.
 */
export function generateDungeonLayout(
  difficulty: number,
  theme: DungeonTheme,
  rng: () => number = Math.random,
): DungeonLayout {
  const data = DUNGEON_DATA[theme];
  const name = pick(data.names, rng);

  // Room count scales with difficulty
  const roomCount = Math.max(4, Math.min(8, 3 + Math.floor(difficulty / 2)));
  const baseRooms = [...data.rooms];

  // Always include entrance and boss chamber
  const entrance = baseRooms.find(r => r.type === 'entrance')!;
  const boss = baseRooms.find(r => r.type === 'boss_chamber')!;
  const middle = baseRooms.filter(r => r.type !== 'entrance''&& r.type !== 'boss_chamber');
  const selected = [entrance, ...pickN(middle, roomCount - 2, rng), boss];

  const lootProgression: DungeonRoom['loot_quality'][] = ['none','low','medium','high','legendary'];

  const rooms: DungeonRoom[] = selected.map((r, i) => {
    const isBoss = r.type === 'boss_chamber';
    const isTreasure = r.type === 'treasure_room';
    const loot_idx = isBoss ? 3 : isTreasure ? 4 : Math.min(i, 2);
    const trap = r.type === 'trap_corridor'
      ? pick(['Pressure plate activates a spike trap.','Swinging blade trap triggered by tripwire.','Portcullis drops, releasing a sealed creature.'], rng)
      : null;

    return {
      id: `room_${i}`,
      type: r.type,
      name: r.name,
      description: r.desc,
      encounter: i > 0 ? pick([...data.encounters, null as any], rng) : null,
      loot_quality: lootProgression[loot_idx],
      exit_count: isBoss ? 1 : intBetween(1, 2, rng),
      trap,
    };
  });

  const boss_name = pick(data.bosses, rng);
  const lore_note = pick(data.lore, rng);

  const ai_atmosphere_prompt = `Describe the interior of a ${theme} dungeon called "${name}" in the style of Elder Scrolls dark fantasy. Difficulty ${difficulty}/10. Tone: oppressive, ancient, dangerous. The boss is "${boss_name}". Include sensory details: sound, smell, light.`;

  return { theme, difficulty, name, rooms, boss_name, lore_note, ai_atmosphere_prompt };
}

// ── generateTavernRumor ────────────────────────────────────────────────────────

export interface TavernRumor {
  text: string;
  reliability: 'false''| 'exaggerated''| 'true''| 'partial';
  quest_seed: QuestType | null;
  location_hint: string | null;
  ai_elaboration_prompt: string;
}

const RUMOR_TEMPLATES: Array<{
  text: string;
  reliability: TavernRumor['reliability'];
  quest_seed: QuestType | null;
  location_hint: string | null;
}> = [
  { text: 'They say a Draugr Deathlord has been spotted walking the roads south of the old barrow. No one who went to look came back.', reliability: 'true', quest_seed: 'clear_dungeon', location_hint: 'nordic dungeon south of town''},
  { text: 'The miller\'s wife has gone missing. The miller says she "just left", but his hands won\'t stop shaking.', reliability: 'partial', quest_seed: 'investigate', location_hint: 'mill outside town''},
  { text: 'I heard the East Empire Company has a shipment coming through the docks. No manifest, no guards. Someone is being paid to look away.', reliability: 'true', quest_seed: 'fetch', location_hint: 'docks warehouse district''},
  { text: 'A bounty\'s been posted in the Jarl\'s hall — someone wants the bandit chief at Broken Tower dead. Three hundred septims.', reliability: 'true', quest_seed: 'bounty', location_hint: 'Broken Tower''},
  { text: 'Saw a Khajiit caravan get off the road fast last night. Something in the woods spooked the camels.', reliability: 'partial', quest_seed: null, location_hint: 'north road through the woods''},
  { text: 'They say Nocturnal herself appeared at the crossroads under the new moon. Took something from a traveller and disappeared.', reliability: 'exaggerated', quest_seed: 'investigate', location_hint: 'crossroads north of town''},
  { text: 'Old Argis found a sealed Dwemer door deep in his mine. Been trying to open it for a month. He\'s going broke paying labourers.', reliability: 'true', quest_seed: 'fetch', location_hint: 'Argis mine in the hills''},
  { text: 'A Thalmor Justiciar has been asking questions in the market. About you, specifically.', reliability: 'partial', quest_seed: 'escort', location_hint: null },
  { text: 'There\'s treasure buried under the old chapel. I know a man who knows a man who dug up a corner of the floor and found Ayleid stonework.', reliability: 'exaggerated', quest_seed: 'fetch', location_hint: 'ruined chapel east of the mill''},
  { text: 'The Companions are recruiting. Pay\'s good, food\'s better, and they only ask one thing of you in return.', reliability: 'true', quest_seed: null, location_hint: 'Whiterun''},
  { text: 'Someone\'s been poisoning the wells to the south. Three farms down already. Guards think it\'s accidental. I don\'t.', reliability: 'true', quest_seed: 'investigate', location_hint: 'farms south of the road''},
  { text: 'The Daedric shrine deep in the moor has been active again. You can see the glow from the road on a dark night.', reliability: 'true', quest_seed: 'clear_dungeon', location_hint: 'shrine on the moor''},
];

/**
 * Generate a procedural tavern rumour with quest potential.
 */
export function generateTavernRumor(
  state: GameState,
  rng: () => number = Math.random,
): TavernRumor {
  const template = pick(RUMOR_TEMPLATES, rng);

  const source = pick(['a drunk sellsword','the barkeep (who overheard everything)','a nervous merchant','an old woman nursing her mead','a hooded traveller who left before you could ask more'], rng);

  const ai_prompt = `A character in a tavern shares this rumour: "${template.text}". Source: ${source}. Expand this into a 3-4 sentence overheard conversation that sounds natural and in-world. Include one detail that makes it feel personal to the teller. Set in Elder Scrolls.`;

  return {
    text: template.text,
    reliability: template.reliability,
    quest_seed: template.quest_seed,
    location_hint: template.location_hint,
    ai_elaboration_prompt: ai_prompt,
  };
}

// ── generateLocationDescription ───────────────────────────────────────────────

export interface LocationDescription {
  name: string;
  atmosphere: string;
  sensory_details: string[];
  npcs_present_hint: string;
  ai_scene_prompt: string;
}

const WEATHER_MODIFIERS: Record<WeatherType, string> = {
  clear:     'The sky is a pale grey-blue, Tamriel\'s version of clear.',
  cloudy:    'Heavy clouds muffle the light and press down on the rooftops.',
  rain:      'Cold rain slicks the cobblestones and drives most indoors.',
  storm:     'Thunder rolls across the hills. Lightning throws harsh shadows.',
  snow:      'Fresh snow muffles every sound and coats the world in brittle white.',
  fog:       'Thick fog erases edges and distances. Voices seem to come from everywhere.',
  ashstorm:  'A Dunmer ashstorm greys everything, settling into every fold and crease.',
  blizzard:  'A Skyrim blizzard strips vision to arm\'s length. The cold is immediate and merciless.',
};

const TIME_MODIFIERS: Record<TimeOfDay, string> = {
  dawn:      'The first grey light seeps under doors.',
  morning:   'Merchants are setting up stalls. Smoke rises from chimneys.',
  midday:    'The market is at full noise. Children dart between legs.',
  afternoon: 'The pace slows. Dogs sleep in doorways.',
  dusk:      'Oil lamps are being lit. Long shadows swallow the alleys.',
  evening:   'The smell of cooking drifts from windows. Laughter from the tavern.',
  night:     'Most are shuttered. The guards walk their rounds slowly.',
  midnight:  'The town is silent except for the wind and the occasional drunk.',
};

const LOCATION_SENSORY: Record<LocationType, string[]> = {
  town:       ['The clang of a smith\'s hammer from three streets over.','Bread from the bakehouse. Dung from the stables. Woodsmoke from everywhere.','Children chasing a dog past your feet.'],
  wilderness: ['Wind through dry grass. Nothing man-made in any direction.','A hawk circles once and is gone.','The ground is soft with old rain.'],
  dungeon:    ['The drip of water somewhere deep. Torchlight barely reaches the walls.','The smell of old stone, old death, and something older still.','Your own breathing sounds very loud.'],
  tavern:     ['Cheap tallow candles and spilled mead. Someone\'s laughing too hard.','A bard hits a wrong note and doesn\'t stop.','The fire is good. The company is questionable.'],
  market:     ['A hundred voices haggling.','The smell of fish, spice, and leather.','Someone is arguing very loudly about the price of salt.'],
  temple:     ['Incense and cold stone. The silence is deliberate.','A priestess hums something without words.','Candles ring the altar. Their flames do not move.'],
  docks:      ['Salt and fish and rope-tar.','A crane groans under load.','Gulls. Always the gulls.'],
  alleyway:   ['Muffled noise from the street. Here it is quiet in an unfriendly way.','Broken glass. A discarded empty vial.','Someone is watching from a doorway.'],
  brothel:    ['Perfume over something more complicated.','Low music from upstairs.','A bouncer who looks bored and capable.'],
  cave:       ['Dripping. Somewhere below, running water.','The cold is immediate and mineral.','Bat wings in the dark above.'],
  home:       ['Your own things. Your own smell. The strange comfort of that.','A fire, or the ashes of one.','Small sounds of settlement — the house breathing.'],
  farm:       ['Turned earth and animal warmth.','A rooster that has not accepted dawn is over.','The creak of the mill wheel.'],
  sewers:     ['The smell settles on you immediately.','Rats, if you\'re lucky. Other things, if you\'re not.','The echo makes footsteps into a crowd.'],
};

/**
 * Generate an atmospheric location description.
 */
export function generateLocationDescription(
  locationId: string,
  weather: WeatherType,
  timeOfDay: TimeOfDay,
  rng: () => number = Math.random,
): LocationDescription {
  // Derive location type from ID pattern or default to 'town'
  const typeMatch = locationId.match(/loc_(\w+)_/);
  const locType: LocationType = (typeMatch?.[1] as LocationType) ?? 'town';

  const weatherDesc = WEATHER_MODIFIERS[weather];
  const timeDesc = TIME_MODIFIERS[timeOfDay];
  const sensoryPool = LOCATION_SENSORY[locType] ?? LOCATION_SENSORY['town'];
  const sensory_details = pickN(sensoryPool, Math.min(2, sensoryPool.length), rng);

  const atmosphere = `${weatherDesc} ${timeDesc}`;

  const npc_hints = [
    'A few locals go about their business, ignoring strangers.',
    'The place is quiet — quieter than usual.',
    'Several familiar faces, and one you haven\'t seen before.',
    'Crowded for this time. Something is drawing people here.',
    'You are nearly alone.',
  ];
  const npcs_present_hint = pick(npc_hints, rng);

  const ai_scene_prompt = `Write an immersive, atmospheric arrival description for an Elder Scrolls player entering a ${locType} location in ${weather} weather at ${timeOfDay}. Location ID: ${locationId}. Sensory details to include: ${sensory_details.join('; ')}. First person, present tense, 2-3 sentences.`;

  return {
    name: locationId,
    atmosphere,
    sensory_details,
    npcs_present_hint,
    ai_scene_prompt,
  };
}

// ── generateLootTable ──────────────────────────────────────────────────────────

export interface LootItem {
  name: string;
  type: 'weapon''| 'armor''| 'consumable''| 'coin''| 'ingredient''| 'soul_gem''| 'misc''| 'book';
  value: number;
  quantity: number;
  rarity: 'common''| 'uncommon''| 'rare''| 'legendary';
}

export interface LootTable {
  enemy_type: string;
  difficulty: number;
  items: LootItem[];
  total_value: number;
}

const ENEMY_LOOT: Record<string, {
  base_coin: [number, number];
  weapons: string[];
  armor: string[];
  consumables: string[];
  misc: string[];
}> = {
  bandit:    { base_coin: [5, 40],   weapons: ['Iron Sword','Steel Dagger','Hunting Bow'], armor: ['Fur Armor','Leather Boots','Hide Shield'], consumables: ['Healing Potion','Mead','Lockpick'], misc: ['Lockpick','Stolen Ring','Note'] },
  draugr:    { base_coin: [0, 10],   weapons: ['Ancient Nord Sword','Draugr Battle Axe','Orcish Dagger'], armor: ['Ancient Nord Armor','Tattered Nordic Boots'], consumables: ['Restore Magicka Potion'], misc: ['Burial Urn','Burial Coin','Ancient Coin'] },
  falmer:    { base_coin: [0, 5],    weapons: ['Falmer Sword','Falmer Bow','Chaurus Chitin Dagger'], armor: ['Falmer Armor','Falmer Helmet'], consumables: ['Poison Extract','Raw Chaurus Egg'], misc: ['Chaurus Eggs','Falmer Ear'] },
  dwemer:    { base_coin: [0, 0],    weapons: ['Dwarven Sword','Dwarven Mace'], armor: ['Dwarven Armor','Dwarven Shield'], consumables: ['Dwarven Oil'], misc: ['Dwarven Metal Ingot','Centurion Dynamo Core','Bent Dwemer Scrap'] },
  mage:      { base_coin: [10, 60],  weapons: ['Staff of Fireballs','Dagger'], armor: ['Robes','Mage Boots'], consumables: ['Restore Magicka','Fortify Magicka Potion'], misc: ['Soul Gem (petty)','Scroll of Flames','Spell Tome'] },
  dremora:   { base_coin: [0, 0],    weapons: ['Daedric Sword','Daedric Mace','Daedric War Axe'], armor: ['Daedric Armor'], consumables: ['Black Soul Gem Fragment'], misc: ['Daedra Heart','Daedric Ore Scrap'] },
  vampire:   { base_coin: [15, 100], weapons: ['Vampire\'s Fang Dagger','Ebony Sword'], armor: ['Vampire Armor','Vampire Boots'], consumables: ['Bloodwine','Blood Potion'], misc: ['Vampire Dust','Amulet of Blood'] },
  wolf:      { base_coin: [0, 0],    weapons: [], armor: [], consumables: [], misc: ['Wolf Pelt','Wolf Tooth','Raw Meat'] },
};

/**
 * Generate a procedural loot table for an enemy type.
 */
export function generateLootTable(
  enemyType: string,
  difficulty: number,
  rng: () => number = Math.random,
): LootTable {
  const template = ENEMY_LOOT[enemyType] ?? ENEMY_LOOT['bandit'];
  const items: LootItem[] = [];

  // Coin drop
  const [minCoin, maxCoin] = template.base_coin;
  const coinAmount = intBetween(minCoin, maxCoin + difficulty * 5, rng);
  if (coinAmount > 0) {
    items.push({ name: 'Septims', type: 'coin', value: coinAmount, quantity: coinAmount, rarity: 'common''});
  }

  // Weapon drop (chance scales with difficulty)
  if (template.weapons.length > 0 && rng() < 0.3 + difficulty * 0.05) {
    const weapon = pick(template.weapons, rng);
    const isRare = rng() < 0.1 + difficulty * 0.03;
    items.push({ name: weapon, type: 'weapon', value: 20 + difficulty * 15, quantity: 1, rarity: isRare ? 'rare'': 'uncommon''});
  }

  // Armor drop
  if (template.armor.length > 0 && rng() < 0.2 + difficulty * 0.04) {
    const armor = pick(template.armor, rng);
    items.push({ name: armor, type: 'armor', value: 15 + difficulty * 10, quantity: 1, rarity: 'common''});
  }

  // Consumable drop
  if (template.consumables.length > 0 && rng() < 0.4) {
    const consumable = pick(template.consumables, rng);
    items.push({ name: consumable, type: 'consumable', value: 5 + difficulty * 3, quantity: intBetween(1, 2, rng), rarity: 'common''});
  }

  // Misc / special items
  if (template.misc.length > 0 && rng() < 0.5) {
    const misc = pick(template.misc, rng);
    items.push({ name: misc, type: 'misc', value: 3 + difficulty * 2, quantity: 1, rarity: 'common''});
  }

  // Legendary item chance at high difficulty
  if (difficulty >= 8 && rng() < 0.1) {
    items.push({ name: `Unique ${enemyType.charAt(0).toUpperCase() + enemyType.slice(1)} Artefact`, type: 'misc', value: 500 + difficulty * 100, quantity: 1, rarity: 'legendary''});
  }

  const total_value = items.reduce((sum, i) => sum + i.value * i.quantity, 0);
  return { enemy_type: enemyType, difficulty, items, total_value };
}

// ── generateRadiantQuest ──────────────────────────────────────────────────────

export interface RadiantQuest {
  id: string;
  type: QuestType;
  title: string;
  giver: string;
  description: string;
  objectives: string[];
  reward_gold: number;
  reward_items: string[];
  location_hint: string;
  difficulty: number;
  ai_narrative_prompt: string;
}

const QUEST_GIVERS: Record<QuestType, string[]> = {
  bounty:         ['The Jarl\'s steward','A frightened innkeeper','A distraught farmer','The town guard captain'],
  fetch:          ['A travelling merchant','A wizard who can\'t leave their tower','A grieving widow','A Companions hall steward'],
  escort:         ['A nervous scholar','A pregnant noblewoman','A young boy with a package','A Khajiit trader with no caravan'],
  investigate:    ['The guard captain (reluctantly)','A worried temple priest','An anonymous note','Your own suspicion'],
  clear_dungeon:  ['The Companions','A Jarl\'s bounty board','A desperate farmer\'s widow','The Thieves Guild fence'],
};

const QUEST_TITLES: Record<QuestType, string[]> = {
  bounty:         ['A Price on Their Head','Dead or Alive','The Jarl\'s Justice','Wanted: Dead'],
  fetch:          ['Lost in Transit','The Merchant\'s Errand','What Was Taken','Retrieve and Return'],
  escort:         ['Safe Passage','Through Hostile Roads','The Long Way Round','Bodyguard Work'],
  investigate:    ['Something Is Wrong','Follow the Thread','The Unexplained Deaths','A Quiet Mystery'],
  clear_dungeon:  ['Clear the Nest','Make It Safe','End the Threat','Delve and Return'],
};

const OBJECTIVES: Record<QuestType, string[][]> = {
  bounty:        [['Locate the target.','Eliminate or capture the target.','Collect proof and return to the questgiver.']],
  fetch:         [['Find the missing item.','Overcome whatever is guarding it.','Return it in one piece.']],
  escort:        [['Meet the client at the agreed location.','Protect them through the journey.','Deliver them safely to the destination.']],
  investigate:   [['Examine the scene.','Speak with witnesses.','Identify the culprit or cause.','Report your findings.']],
  clear_dungeon: [['Enter the location.','Eliminate all threats.','Confirm the area is safe.','Return for the reward.']],
};

/**
 * Generate a radiant quest with Elder Scrolls flavour.
 */
export function generateRadiantQuest(
  state: GameState,
  questType: QuestType,
  rng: () => number = Math.random,
): RadiantQuest {
  const id = `quest_${questType}_${Math.floor(rng() * 99999)}`;
  const giver = pick(QUEST_GIVERS[questType], rng);
  const title = pick(QUEST_TITLES[questType], rng);
  const objectives = pick(OBJECTIVES[questType], rng);

  const day = state.world.day;
  const baseDifficulty = Math.max(1, Math.min(10, Math.floor(day / 10) + 1));
  const difficulty = Math.min(10, baseDifficulty + intBetween(0, 2, rng));

  const reward_gold = 50 + difficulty * 25 + intBetween(0, 50, rng);

  const possible_rewards = [
    'Elixir of Healing','Key to a strongbox','Lockpick set (10)',
    'Map fragment','Enchanted ring','Skill tome','Rare ingredient',
  ];
  const reward_items = rng() < 0.4 ? [pick(possible_rewards, rng)] : [];

  const location_hints = [
    'an old watchtower near the south road',
    'the abandoned mill east of town',
    'deep in the forest — follow the old hunter\'s trail',
    'the cave system the locals call Blind Man\'s Den',
    'a Dwemer ruin three hours north on foot',
    'wherever the bandits have set up camp this season',
  ];
  const location_hint = pick(location_hints, rng);

  const description = `${giver} needs someone to handle a ${questType.replace(/_/g, '')} near ${location_hint}. The reward is ${reward_gold} septims${reward_items.length > 0 ? ` and ${reward_items.join('',')}` : ''}.`;

  const ai_narrative_prompt = `Write a quest briefing for an Elder Scrolls radiant quest. Type: ${questType.replace(/_/g, '')}. Giver: ${giver}. Location: ${location_hint}. Difficulty: ${difficulty}/10. Keep it concise — 3-4 sentences. Tone: urgent, personal, elder-scrolls appropriate. Do not use "Dragonborn".`;

  return {
    id, type: questType, title, giver, description, objectives,
    reward_gold, reward_items, location_hint, difficulty,
    ai_narrative_prompt,
  };
}

// ── generateWeatherNarrative ──────────────────────────────────────────────────

export interface WeatherNarrative {
  headline: string;
  description: string;
  gameplay_effect: string;
  ai_scene_prompt: string;
}

const WEATHER_NARRATIVES: Record<WeatherType, Record<Season, string[]>> = {
  clear: {
    spring: ['A crisp spring morning. The sky is pale blue, the air smells of wet earth.'],
    summer: ['Summer heat bakes the stone roads. Heat shimmer rises from the fields.'],
    autumn: ['Clear autumn light, cold at the edges. The trees are burning yellow and red.'],
    winter: ['A rare clear winter day. The snow sparkles cruelly. The cold is dry and complete.'],
  },
  cloudy: {
    spring: ['Thick cloud rolls in off the mountains. Rain is coming.'],
    summer: ['Overcast — the heat without the sun, somehow worse.'],
    autumn: ['Low grey clouds press down. Everything feels muted.'],
    winter: ['Heavy cloud, the colour of old iron. Snow is coming.'],
  },
  rain: {
    spring: ['Spring rain, cold and insistent. The world smells clean.'],
    summer: ['A summer downpour. The streets empty in minutes.'],
    autumn: ['Autumn rain hammers everything sideways.'],
    winter: ['Cold, miserable winter rain that can\'t decide to be snow.'],
  },
  storm: {
    spring: ['A spring storm, violent and fast. Thunder shakes the shutters.'],
    summer: ['A summer storm rolls in from the sea.'],
    autumn: ['Autumn storm. Trees bent sideways. The kind that brings down branches.'],
    winter: ['A winter storm. Roads become dangerous within an hour.'],
  },
  snow: {
    spring: ['Late snow — unwelcome, soft, covering last week\'s growth.'],
    summer: ['High mountain snow, impossible-looking from the valley.'],
    autumn: ['First snow of the season. The year turns serious.'],
    winter: ['Heavy snowfall. Everything quiet. Everything white.'],
  },
  fog: {
    spring: ['Spring fog clings to the low ground, chest-high and cold.'],
    summer: ['Sea fog rolls in unexpectedly. Sounds travel strangely.'],
    autumn: ['Autumn fog. You can hear the town but barely see it.'],
    winter: ['Freezing fog. Every surface glitters with hoarfrost.'],
  },
  ashstorm: {
    spring: ['Ash from Red Mountain reaches even here. The sun turns red.'],
    summer: ['A Dunmer ashstorm coats the world in grey. Eyes water.'],
    autumn: ['Ash on the wind. It settles on everything.'],
    winter: ['Ash mixing with snow. Grey and white. The world tastes of dust.'],
  },
  blizzard: {
    spring: ['A freak spring blizzard. Travel is impossible within the hour.'],
    summer: ['Mountain blizzard. The pass is closed. You are trapped here.'],
    autumn: ['Early blizzard. The season turned cruel without warning.'],
    winter: ['A full Skyrim blizzard. The kind that kills the unprepared.'],
  },
};

const WEATHER_EFFECTS: Record<WeatherType, string> = {
  clear:     'No travel penalties. NPCs are outdoors.',
  cloudy:    'Minor mood penalty. Some NPCs stay indoors.',
  rain:      'Stamina recovers slowly. NPCs seek shelter. Fire spells weakened.',
  storm:     'Archery accuracy reduced. Stamina drain increased. Most NPCs indoors.',
  snow:      'Movement slowed. Cold damage risk without warm clothing.',
  fog:       'Detection range halved. Sneak bonus. Navigation harder.',
  ashstorm:  'Stamina drain. Illness risk. Dunmer are unaffected.',
  blizzard:  'Severe movement penalty. Health drain without shelter. Very few NPCs out.',
};

/**
 * Generate a weather narrative description.
 */
export function generateWeatherNarrative(
  weather: WeatherType,
  season: Season,
  location: string,
  rng: () => number = Math.random,
): WeatherNarrative {
  const pool = WEATHER_NARRATIVES[weather][season];
  const description = `${pick(pool, rng)} You are at ${location}.`;
  const headline = `${weather.charAt(0).toUpperCase() + weather.slice(1)} — ${season}`;
  const gameplay_effect = WEATHER_EFFECTS[weather];

  const ai_scene_prompt = `Describe the weather in 1-2 vivid sentences: a ${weather} day in ${season} at ${location} in an Elder Scrolls-style fantasy world. Make it atmospheric and specific to the season. No exposition, just sensory experience.`;

  return { headline, description, gameplay_effect, ai_scene_prompt };
}
