/**
 * Elder Scrolls Race Definitions
 * Complete racial anatomy, proportions, and visual characteristics
 * for all 10 playable races in the Elder Scrolls universe.
 */

export type EarType = 'round' | 'pointed_long' | 'pointed_short' | 'cat' | 'reptilian_none';
export type LegType = 'plantigrade' | 'digitigrade';
export type HandType = 'human' | 'clawed_light' | 'clawed_heavy' | 'pawed';
export type FootType = 'human' | 'clawed' | 'pawed_digitigrade';
export type EyeShape = 'round' | 'almond' | 'slit_pupil' | 'reptilian';
export type SkinType = 'skin' | 'scales' | 'fur';

/** All 10 playable Elder Scrolls race identifiers */
export type RaceId = 'nord' | 'imperial' | 'redguard' | 'breton' | 'dunmer' | 'altmer' | 'bosmer' | 'orsimer' | 'khajiit' | 'argonian';

export interface RacialBodyFeatures {
  /** Display name */
  name: string;
  /** Short lore descriptor */
  lore_tag: string;
  /** Average height in cm */
  height_cm: number;
  /** Body build descriptor */
  build: 'wiry' | 'slim' | 'average' | 'athletic' | 'stocky' | 'muscular' | 'heavy';
  /** Skin coverage type */
  skin_type: SkinType;
  /** Default skin/scale/fur color palette (hex) */
  skin_colors: string[];
  /** Hair colors (null if no hair, e.g. Argonian) */
  hair_colors: string[] | null;
  /** Default eye colors */
  eye_colors: string[];
  /** Eye shape */
  eye_shape: EyeShape;
  /** Ear type */
  ear_type: EarType;
  /** Has a tail */
  has_tail: boolean;
  /** Has tusks */
  has_tusks: boolean;
  /** Has bony brow ridge */
  has_heavy_brow: boolean;
  /** Has muzzle / elongated snout */
  has_muzzle: boolean;
  /** Has head frills/horns (Argonian) */
  has_head_protrusions: boolean;
  /** Leg type */
  leg_type: LegType;
  /** Hand type */
  hand_type: HandType;
  /** Foot type */
  foot_type: FootType;
  /** Body surface detail (scale pattern, fur pattern, skin markings) */
  surface_pattern: 'none' | 'scales_smooth' | 'scales_ridge' | 'fur_solid' | 'fur_spotted' | 'fur_striped' | 'tattoo_warpaint';
  /** Secondary accent color (scale ridges, fur belly, etc.) */
  accent_colors: string[];
  /** Special SVG features to render */
  special_features: Array<'tail_thin' | 'tail_thick' | 'tusks' | 'horns' | 'frills' | 'cat_ears' | 'pointed_ears_long' | 'pointed_ears_short' | 'claws_hands' | 'claws_feet' | 'muzzle_cat' | 'muzzle_lizard' | 'heavy_brow' | 'scales_overlay' | 'fur_overlay'>;
  /** Racial stat bonuses (modifier values) */
  racial_bonuses: Partial<Record<string, number>>;
  /** Racial abilities/resistances */
  racial_traits: string[];
}

export const ELDER_SCROLLS_RACES: Record<string, RacialBodyFeatures> = {

  Nord: {
    name: 'Nord',
    lore_tag: 'Sons and daughters of the frozen north, warriors born.',
    height_cm: 192,
    build: 'muscular',
    skin_type: 'skin',
    skin_colors: ['#f5d5b5', '#e8c4a0', '#ddb88a', '#f0e0cc'],
    hair_colors: ['#d4a843', '#a07830', '#e8d0a0', '#c0c0c0', '#8b4513', '#f5f0e8'],
    eye_colors: ['#5580cc', '#6699bb', '#4a7a60', '#8888aa'],
    eye_shape: 'round',
    ear_type: 'round',
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: [],
    special_features: [],
    racial_bonuses: { health: 10, stamina: 5, max_stamina: 10 },
    racial_traits: ['Frost Resistance (50%)', 'Battle Cry (Fear shout once/day)', 'Skilled with Two-Handed weapons'],
  },

  Imperial: {
    name: 'Imperial',
    lore_tag: 'Natives of Cyrodiil, masters of diplomacy and coin.',
    height_cm: 175,
    build: 'average',
    skin_type: 'skin',
    skin_colors: ['#d4a870', '#c89060', '#b87c50', '#e8c090'],
    hair_colors: ['#1a1a1a', '#3a2010', '#6a4020', '#8a6030', '#c0a060'],
    eye_colors: ['#6a4020', '#7a5530', '#5a6a30', '#888880'],
    eye_shape: 'round',
    ear_type: 'round',
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: [],
    special_features: [],
    racial_bonuses: { allure: 5, control: 5, stress: -10 },
    racial_traits: ['Voice of the Emperor (Calm humanoids)', 'Imperial Luck (extra gold)', 'Diplomat (+10 persuasion)'],
  },

  Breton: {
    name: 'Breton',
    lore_tag: 'Half-elven mage-blooded people of High Rock.',
    height_cm: 165,
    build: 'slim',
    skin_type: 'skin',
    skin_colors: ['#f2e4cc', '#eed8bb', '#e8cca8', '#f8f0e0'],
    hair_colors: ['#8b4513', '#5a3010', '#c0a060', '#2a1a08', '#888888'],
    eye_colors: ['#4a6a9a', '#6a8a6a', '#7a6a9a', '#5a7a5a'],
    eye_shape: 'almond',
    ear_type: 'round',  // Subtly pointed but effectively round
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: [],
    special_features: [],
    racial_bonuses: { willpower: 10, purity: 5, hallucination: -5 },
    racial_traits: ['Dragonskin (absorb 50% spell magicka once/day)', 'Magic Resistance (25%)', 'Conjuration Affinity'],
  },

  Redguard: {
    name: 'Redguard',
    lore_tag: 'Warrior-people of the Alik\'r, driven from Yokuda.',
    height_cm: 178,
    build: 'athletic',
    skin_type: 'skin',
    skin_colors: ['#6b3d2e', '#7a4535', '#8a5540', '#5a2e20', '#9a6550'],
    hair_colors: ['#1a0a00', '#2a1005', '#3a1a08', '#c8a030'],
    eye_colors: ['#3a2010', '#5a3a18', '#2a3a10', '#6a5030'],
    eye_shape: 'round',
    ear_type: 'round',
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'tattoo_warpaint',
    accent_colors: ['#c8601a', '#e08030'],
    special_features: [],
    racial_bonuses: { athletics: 10, stamina: 5, pain: -5 },
    racial_traits: ['Adrenaline Rush (stamina regen once/day)', 'Poison Resistance (50%)', 'Martial Training'],
  },

  Dunmer: {
    name: 'Dunmer',
    lore_tag: 'Dark Elves of Morrowind, ashen-skinned and red-eyed.',
    height_cm: 172,
    build: 'wiry',
    skin_type: 'skin',
    skin_colors: ['#8a9090', '#7a8888', '#6a7878', '#9a9898', '#b0a0a0'],
    hair_colors: ['#1a1a1a', '#3a1a1a', '#2a2a2a', '#5a1a1a', '#0a0a0a'],
    eye_colors: ['#cc2020', '#aa1818', '#dd3030', '#bb2828'],
    eye_shape: 'almond',
    ear_type: 'pointed_short',
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: ['#cc4040'],
    special_features: ['pointed_ears_short'],
    racial_bonuses: { skulduggery: 10, corruption: -10, trauma: -5 },
    racial_traits: ['Ancestor\'s Wrath (flame cloak once/day)', 'Fire Resistance (50%)', 'Dunmeri Telepathy'],
  },

  Altmer: {
    name: 'Altmer',
    lore_tag: 'High Elves of the Summerset Isles, tall and golden.',
    height_cm: 198,
    build: 'slim',
    skin_type: 'skin',
    skin_colors: ['#d4bc60', '#c8b050', '#bca040', '#dcc870', '#e8d880'],
    hair_colors: ['#d4c060', '#b0a040', '#e8d890', '#ffffff', '#806020'],
    eye_colors: ['#c8a020', '#d4b030', '#b09010', '#e0c040'],
    eye_shape: 'almond',
    ear_type: 'pointed_long',
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: ['#d4b030'],
    special_features: ['pointed_ears_long'],
    racial_bonuses: { willpower: 15, allure: 10, stress: 10 },
    racial_traits: ['Highborn (magicka regen once/day)', 'Spell Absorption (innate)', 'Altmeri Perception'],
  },

  Bosmer: {
    name: 'Bosmer',
    lore_tag: 'Wood Elves of Valenwood, swift hunters of the forest.',
    height_cm: 155,
    build: 'wiry',
    skin_type: 'skin',
    skin_colors: ['#b8a060', '#a08848', '#8a7038', '#c8b070', '#d0bc80'],
    hair_colors: ['#3a2810', '#5a4020', '#8a6840', '#2a1808', '#c0a040'],
    eye_colors: ['#7a8a30', '#5a7a28', '#8a9a38', '#9aaa50'],
    eye_shape: 'almond',
    ear_type: 'pointed_short',
    has_tail: false,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'human',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: ['#6a9030'],
    special_features: ['pointed_ears_short'],
    racial_bonuses: { athletics: 5, skulduggery: 5, swimming: 5 },
    racial_traits: ['Command Animal (once/day)', 'Y\'ffre\'s Endurance (resist disease/poison)', 'Archery Mastery'],
  },

  Orsimer: {
    name: 'Orsimer',
    lore_tag: 'Orcs, pariah-folk of the Wrothgarian Mountains.',
    height_cm: 188,
    build: 'heavy',
    skin_type: 'skin',
    skin_colors: ['#4a6a30', '#3a5a20', '#5a7a38', '#6a8040', '#2a4818'],
    hair_colors: ['#1a1a1a', '#2a1a08', '#0a0a0a', '#3a2a1a'],
    eye_colors: ['#c0a020', '#d0b030', '#a08010', '#b89020'],
    eye_shape: 'round',
    ear_type: 'round',
    has_tail: false,
    has_tusks: true,
    has_heavy_brow: true,
    has_muzzle: false,
    has_head_protrusions: false,
    leg_type: 'plantigrade',
    hand_type: 'clawed_light',
    foot_type: 'human',
    surface_pattern: 'none',
    accent_colors: ['#8a4020'],
    special_features: ['tusks', 'heavy_brow', 'claws_hands'],
    racial_bonuses: { health: 15, max_health: 20, pain: -10 },
    racial_traits: ['Berserker Rage (2x damage/resist once/day)', 'Hard Worker (50% more resources)', 'Orcish Forging'],
  },

  Khajiit: {
    name: 'Khajiit',
    lore_tag: 'Cat-folk of Elsweyr, lithe and silver-tongued.',
    height_cm: 168,
    build: 'athletic',
    skin_type: 'fur',
    skin_colors: ['#c8a878', '#b89868', '#d0b888', '#a07858', '#886040'],
    hair_colors: null,  // No separate hair - fur IS the hair
    eye_colors: ['#c8a020', '#e0c030', '#50b050', '#2090c8', '#c83030'],
    eye_shape: 'slit_pupil',
    ear_type: 'cat',
    has_tail: true,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: true,
    has_head_protrusions: false,
    leg_type: 'digitigrade',
    hand_type: 'pawed',
    foot_type: 'pawed_digitigrade',
    surface_pattern: 'fur_spotted',
    accent_colors: ['#6a4020', '#9a6030', '#e8d0a0'],
    special_features: ['cat_ears', 'tail_thin', 'claws_hands', 'claws_feet', 'muzzle_cat', 'fur_overlay'],
    racial_bonuses: { seduction: 10, skulduggery: 10, athletics: 5 },
    racial_traits: ['Night Eye (see in darkness)', 'Claws (natural weapon +15 damage)', 'Feline Agility (sprint boost once/day)'],
  },

  Argonian: {
    name: 'Argonian',
    lore_tag: 'Lizard-folk of Black Marsh, creatures of the Hist.',
    height_cm: 172,
    build: 'athletic',
    skin_type: 'scales',
    skin_colors: ['#3a6830', '#4a7838', '#5a5820', '#2a5828', '#486840'],
    hair_colors: null,  // No hair - has head frills/horns instead
    eye_colors: ['#e06020', '#c85018', '#d07030', '#f08040'],
    eye_shape: 'reptilian',
    ear_type: 'reptilian_none',
    has_tail: true,
    has_tusks: false,
    has_heavy_brow: false,
    has_muzzle: true,
    has_head_protrusions: true,
    leg_type: 'plantigrade',
    hand_type: 'clawed_heavy',
    foot_type: 'clawed',
    surface_pattern: 'scales_smooth',
    accent_colors: ['#8a5820', '#a07030', '#c0b840'],
    special_features: ['tail_thick', 'horns', 'frills', 'claws_hands', 'claws_feet', 'muzzle_lizard', 'scales_overlay'],
    racial_bonuses: { swimming: 20, health: 5, corruption: -5 },
    racial_traits: ['Histskin (restore health once/day)', 'Waterbreathing (innate)', 'Resist Disease (50%)', 'Amphibious'],
  },

};

/**
 * Normalize a race string from game state to a {@link RacialBodyFeatures} object.
 * Matches by exact key, display name, or a set of common aliases.
 * Falls back to Imperial when no match is found.
 */
export function resolveRace(raceName: string): RacialBodyFeatures {
  const normalized = raceName.trim().toLowerCase();
  for (const [key, def] of Object.entries(ELDER_SCROLLS_RACES)) {
    if (key.toLowerCase() === normalized) return def;
    if (def.name.toLowerCase() === normalized) return def;
  }
  // Aliases / common alternate spellings
  const aliases: Record<string, string> = {
    human: 'Imperial',
    highelf: 'Altmer',
    'high elf': 'Altmer',
    darkelf: 'Dunmer',
    'dark elf': 'Dunmer',
    woodelf: 'Bosmer',
    'wood elf': 'Bosmer',
    orc: 'Orsimer',
    khajiiti: 'Khajiit',
    cat: 'Khajiit',
    lizard: 'Argonian',
    reptile: 'Argonian',
  };
  const alias = aliases[normalized];
  if (alias) return ELDER_SCROLLS_RACES[alias];
  // Default to Imperial
  return ELDER_SCROLLS_RACES.Imperial;
}

/** Build a descriptive anatomy string for AI prompting */
export function buildRaceAnatomyDescription(race: RacialBodyFeatures): string {
  const parts: string[] = [
    `${race.name} (${race.height_cm}cm, ${race.build} build)`,
    `${race.skin_type === 'scales' ? 'scaled' : race.skin_type === 'fur' ? 'furred' : 'skin'} surface`,
  ];
  if (race.has_tail) parts.push('tail');
  if (race.has_tusks) parts.push('tusks');
  if (race.has_muzzle) parts.push('muzzle/snout');
  if (race.has_head_protrusions) parts.push('head horns/frills');
  if (race.ear_type !== 'round' && race.ear_type !== 'reptilian_none') {
    parts.push(`${race.ear_type.replace('_', ' ')} ears`);
  }
  if (race.leg_type === 'digitigrade') parts.push('digitigrade hindlegs');
  return parts.join(', ');
}
