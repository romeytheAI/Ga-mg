/**
 * Race Anatomy Reference
 * Complete racial anatomy, proportions, facial features, secondary traits,
 * sprite parameters, cultural notes, voice notes, and mannerisms for all
 * 10 playable races in the Elder Scrolls universe.
 *
 * Heights and builds are consistent with races.ts RacialBodyFeatures.
 */

/* ── Types ───────────────────────────────────────────────────────────────── */

export type Gender = 'male''| 'female';
export type BodyType = 'slim''| 'average''| 'athletic''| 'stocky''| 'curvy''| 'muscular';

export interface FacialStructure {
  jaw: 'sharp''| 'angular''| 'soft''| 'square''| 'rounded''| 'narrow';
  cheekbones: 'prominent''| 'moderate''| 'soft''| 'high';
  brow: 'heavy''| 'moderate''| 'light''| 'pronounced';
  nose: 'straight''| 'aquiline''| 'button''| 'broad''| 'narrow''| 'upturned';
  chin: 'pointed''| 'square''| 'rounded''| 'cleft''| 'jutting';
}

export interface SecondaryTraits {
  breast_size: [number, number, number];   / 0-5 scale [min, avg, max], 0=flat males
  waist_hip_ratio: number;
  shoulder_waist_ratio: number;
  muscle_definition: number;               / 0-5
  body_hair: number;                       / 0-5
  facial_hair: number;                     / 0-5
  adam_apple: number;                      / 0-3
  pelvic_width: number;                    / 0-5
  glute_development: number;               / 0-5
}

export interface SpriteParams {
  body_path: string;
  css_width_mult: number;
  css_height_mult: number;
  torso_variant: string;
  leg_variant: string;
  head_variant: string;
}

export interface RacialGenderAnatomy {
  height: [number, number, number];        / [min, avg, max] in cm
  weight: [number, number, number];        / [min, avg, max] in kg
  build: BodyType;
  shoulder_width_ratio: number;            / 0-1 relative to height
  hip_width_ratio: number;                 / 0-1 relative to shoulders
  torso_ratio: number;
  leg_ratio: number;
  head_ratio: number;
  facial_structure: FacialStructure;
  secondary_traits: SecondaryTraits;
  sprite_params: SpriteParams;
  cultural_notes: string[];
  voice_notes: string;
  mannerisms: string[];
}

export interface RacialAnatomyData {
  race: string;
  male: RacialGenderAnatomy;
  female: RacialGenderAnatomy;
}

/* ── Race-by-race data ───────────────────────────────────────────────────── */

const NordAnatomy: RacialAnatomyData = {
  race: 'Nord',
  male: {
    height: [178, 192, 205],
    weight: [78, 95, 118],
    build: 'muscular',
    shoulder_width_ratio: 0.48,
    hip_width_ratio: 0.82,
    torso_ratio: 1.35,
    leg_ratio: 0.46,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'square',
      cheekbones: 'prominent',
      brow: 'moderate',
      nose: 'broad',
      chin: 'jutting',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.92,
      shoulder_waist_ratio: 1.30,
      muscle_definition: 4,
      body_hair: 4,
      facial_hair: 4,
      adam_apple: 3,
      pelvic_width: 2,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/nord_male',
      css_width_mult: 1.20,
      css_height_mult: 1.28,
      torso_variant: 'broad',
      leg_variant: 'thick',
      head_variant: 'broad',
    },
    cultural_notes: [
      'Nords are proud warriors from Skyrim who value physical strength and martial prowess.',
      'Beards are a symbol of honor — un-bearded Nords are often mocked in traditional circles.',
      'Scar tissue from duels is worn as a badge of experience, not shame.',
    ],
    voice_notes: 'Deep, booming baritone with a rolling R. Speaks loudly and directly, often with humor.',
    mannerisms: [
      'Slaps shoulders in greeting rather than a handshake',
      'Throws head back and laughs loudly',
      'Cracks knuckles before challenging someone',
    ],
  },
  female: {
    height: [170, 183, 195],
    weight: [65, 80, 98],
    build: 'athletic',
    shoulder_width_ratio: 0.44,
    hip_width_ratio: 0.85,
    torso_ratio: 1.25,
    leg_ratio: 0.47,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'prominent',
      brow: 'light',
      nose: 'straight',
      chin: 'jutting',
    },
    secondary_traits: {
      breast_size: [2, 3, 4],
      waist_hip_ratio: 0.78,
      shoulder_waist_ratio: 1.22,
      muscle_definition: 3,
      body_hair: 1,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/nord_female',
      css_width_mult: 1.15,
      css_height_mult: 1.22,
      torso_variant: 'athletic',
      leg_variant: 'thick',
      head_variant: 'broad',
    },
    cultural_notes: [
      'Shield-maidens are equally respected in Nord society — women fight alongside men.',
      'Nord women often wear their hair in long braids, sometimes braided into their armor.',
      'A Nord woman\'s reputation is earned through deeds, not deference.',
    ],
    voice_notes: 'Strong contralto, direct and warm. Speaks with the same force as men, unapologetic.',
    mannerisms: [
      'Clasps her arm over chest in greeting',
      'Stands with feet planted wide, ready for action',
      'Laughs loudly, unselfconscious',
    ],
  },
};

const ImperialAnatomy: RacialAnatomyData = {
  race: 'Imperial',
  male: {
    height: [165, 175, 185],
    weight: [65, 78, 95],
    build: 'average',
    shoulder_width_ratio: 0.44,
    hip_width_ratio: 0.88,
    torso_ratio: 1.25,
    leg_ratio: 0.46,
    head_ratio: 0.15,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'moderate',
      brow: 'moderate',
      nose: 'straight',
      chin: 'rounded',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.94,
      shoulder_waist_ratio: 1.20,
      muscle_definition: 2,
      body_hair: 3,
      facial_hair: 3,
      adam_apple: 2,
      pelvic_width: 2,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/imperial_male',
      css_width_mult: 1.05,
      css_height_mult: 1.17,
      torso_variant: 'average',
      leg_variant: 'average',
      head_variant: 'average',
    },
    cultural_notes: [
      'Natives of Cyrodiil, Imperials value civilization, diplomacy, and the rule of law.',
      'Well-groomed appearance is highly valued — neat hair, clean shave or trimmed beard.',
      'Imperial men favor measured gestures and polished manners over rough posturing.',
    ],
    voice_notes: 'Smooth, educated baritone. Speaks with measured cadence, often using Latin-derived phrasing.',
    mannerisms: [
      'Offers a formal bow or nod in greeting',
      'Gestures with open palms when speaking',
      'Maintains steady, confident eye contact',
    ],
  },
  female: {
    height: [157, 166, 176],
    weight: [52, 64, 80],
    build: 'average',
    shoulder_width_ratio: 0.40,
    hip_width_ratio: 0.90,
    torso_ratio: 1.20,
    leg_ratio: 0.46,
    head_ratio: 0.15,
    facial_structure: {
      jaw: 'soft',
      cheekbones: 'moderate',
      brow: 'light',
      nose: 'upturned',
      chin: 'rounded',
    },
    secondary_traits: {
      breast_size: [2, 3, 5],
      waist_hip_ratio: 0.74,
      shoulder_waist_ratio: 1.18,
      muscle_definition: 2,
      body_hair: 1,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 4,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/imperial_female',
      css_width_mult: 1.00,
      css_height_mult: 1.11,
      torso_variant: 'average',
      leg_variant: 'average',
      head_variant: 'soft',
    },
    cultural_notes: [
      'Imperial women in Cyrodiil range from peasant farmers to senators\''wives.',
      'Fashion-conscious — jewelry, cosmetics, and elaborate hairstyles are common.',
      'Known for diplomatic skill and social grace as much as men.',
    ],
    voice_notes: 'Warm mezzo-soprano, articulate and expressive. Often used in diplomacy and trade.',
    mannerisms: [
      'Curtsies slightly to superiors',
      'Uses subtle hand gestures when emphasizing points',
      'Sits with perfect posture in formal settings',
    ],
  },
};

const BretonAnatomy: RacialAnatomyData = {
  race: 'Breton',
  male: {
    height: [155, 165, 175],
    weight: [52, 65, 80],
    build: 'slim',
    shoulder_width_ratio: 0.42,
    hip_width_ratio: 0.87,
    torso_ratio: 1.22,
    leg_ratio: 0.46,
    head_ratio: 0.15,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'high',
      brow: 'light',
      nose: 'aquiline',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.93,
      shoulder_waist_ratio: 1.18,
      muscle_definition: 2,
      body_hair: 2,
      facial_hair: 2,
      adam_apple: 1,
      pelvic_width: 2,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/breton_male',
      css_width_mult: 0.95,
      css_height_mult: 1.10,
      torso_variant: 'slender',
      leg_variant: 'slender',
      head_variant: 'narrow',
    },
    cultural_notes: [
      'Breton men of High Rock are steeped in magical tradition from childhood.',
      'Often described as elfin or refined in appearance due to elven ancestry.',
      'Scholars, mages, and courtiers — intellect is prized over raw strength.',
    ],
    voice_notes: 'High tenor with a melodic lilt. Polished and slightly theatrical.',
    mannerisms: [
      'Strokes chin thoughtfully when considering a question',
      'Speaks with measured, deliberate cadence',
      'Uses subtle conjuration hand gestures unconsciously',
    ],
  },
  female: {
    height: [148, 157, 167],
    weight: [44, 55, 68],
    build: 'slim',
    shoulder_width_ratio: 0.38,
    hip_width_ratio: 0.84,
    torso_ratio: 1.18,
    leg_ratio: 0.47,
    head_ratio: 0.15,
    facial_structure: {
      jaw: 'sharp',
      cheekbones: 'high',
      brow: 'light',
      nose: 'straight',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [1, 2, 3],
      waist_hip_ratio: 0.72,
      shoulder_waist_ratio: 1.14,
      muscle_definition: 1,
      body_hair: 1,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/breton_female',
      css_width_mult: 0.90,
      css_height_mult: 1.05,
      torso_variant: 'slender',
      leg_variant: 'slender',
      head_variant: 'narrow',
    },
    cultural_notes: [
      'Breton women are renowned across Tamriel for their beauty and magical ability.',
      'Many serve as court enchanters, healers, or advisors to nobility.',
      'Half-elf heritage gives them a delicate, luminous quality to their features.',
    ],
    voice_notes: 'Clear soprano, bright and musical. Naturally enchanting quality even in casual speech.',
    mannerisms: [
      'Touches face or hair when casting a charm spell',
      'Moves with deliberate grace, as if gliding',
      'Speaks softly but with absolute conviction',
    ],
  },
};

const RedguardAnatomy: RacialAnatomyData = {
  race: 'Redguard',
  male: {
    height: [168, 178, 190],
    weight: [64, 78, 95],
    build: 'athletic',
    shoulder_width_ratio: 0.46,
    hip_width_ratio: 0.84,
    torso_ratio: 1.30,
    leg_ratio: 0.47,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'prominent',
      brow: 'moderate',
      nose: 'straight',
      chin: 'square',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.92,
      shoulder_waist_ratio: 1.25,
      muscle_definition: 3,
      body_hair: 2,
      facial_hair: 3,
      adam_apple: 2,
      pelvic_width: 2,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/redguard_male',
      css_width_mult: 1.03,
      css_height_mult: 1.19,
      torso_variant: 'athletic',
      leg_variant: 'lean',
      head_variant: 'angular',
    },
    cultural_notes: [
      'Redguards are descended from the warriors of Yokuda, masters of the sword-singing tradition.',
      'Lean, wiry muscle rather than bulk — built for endurance in the Alik\'r desert.',
      'Warrior culture values precision, discipline, and the perfection of martial form.',
    ],
    voice_notes: 'Rich baritone with rhythmic cadence. Speaks like reciting measured verse.',
    mannerisms: [
      'Stands perfectly still, conserving energy',
      'Touches blade hilt habitually in conversation',
      'Moves with feline economy — no wasted motion',
    ],
  },
  female: {
    height: [160, 170, 180],
    weight: [54, 66, 82],
    build: 'athletic',
    shoulder_width_ratio: 0.42,
    hip_width_ratio: 0.86,
    torso_ratio: 1.24,
    leg_ratio: 0.47,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'sharp',
      cheekbones: 'prominent',
      brow: 'light',
      nose: 'straight',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [1, 2, 3],
      waist_hip_ratio: 0.72,
      shoulder_waist_ratio: 1.20,
      muscle_definition: 3,
      body_hair: 1,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/redguard_female',
      css_width_mult: 0.98,
      css_height_mult: 1.13,
      torso_variant: 'athletic',
      leg_variant: 'lean',
      head_variant: 'angular',
    },
    cultural_notes: [
      'Female Redguards are trained as warriors alongside males from youth.',
      'Adorn themselves with warrior tattoos and braided hair interwoven with metal.',
      'The Alik\'r Desert has forged a people who value speed and efficiency above all.',
    ],
    voice_notes: 'Clear, resonant mezzo. Speaks decisively and with unwavering conviction.',
    mannerisms: [
      'Moves with predatory grace',
      'Tests blade edge unconsciously when idle',
      'Holds gaze unflinchingly during negotiations',
    ],
  },
};

const DunmerAnatomy: RacialAnatomyData = {
  race: 'Dunmer',
  male: {
    height: [162, 172, 183],
    weight: [58, 70, 85],
    build: 'slim',
    shoulder_width_ratio: 0.43,
    hip_width_ratio: 0.86,
    torso_ratio: 1.28,
    leg_ratio: 0.47,
    head_ratio: 0.15,
    facial_structure: {
      jaw: 'narrow',
      cheekbones: 'high',
      brow: 'moderate',
      nose: 'narrow',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.93,
      shoulder_waist_ratio: 1.19,
      muscle_definition: 2,
      body_hair: 1,
      facial_hair: 2,
      adam_apple: 2,
      pelvic_width: 2,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/dunmer_male',
      css_width_mult: 1.00,
      css_height_mult: 1.14,
      torso_variant: 'slender',
      leg_variant: 'lean',
      head_variant: 'elfish',
    },
    cultural_notes: [
      'Dark Elves of Morrowind have distinctive grey/ash skin and glowing red eyes.',
      'Their culture is shaped by ancestor worship and the harsh volcanic landscape.',
      'Subtle, cunning, and suspicious — Dunmer are natural survivors.',
    ],
    voice_notes: 'Smooth, guarded tenor with a dry edge. Speaks as if every word is measured for threat.',
    mannerisms: [
      'Narrows eyes almost imperceptibly when being lied to',
      'Speaks in carefully hedged phrases',
      'Touches the Dunmer amulet at the throat when anxious',
    ],
  },
  female: {
    height: [155, 164, 174],
    weight: [48, 58, 72],
    build: 'slim',
    shoulder_width_ratio: 0.39,
    hip_width_ratio: 0.88,
    torso_ratio: 1.22,
    leg_ratio: 0.46,
    head_ratio: 0.15,
    facial_structure: {
      jaw: 'narrow',
      cheekbones: 'high',
      brow: 'light',
      nose: 'narrow',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [1, 2, 3],
      waist_hip_ratio: 0.72,
      shoulder_waist_ratio: 1.15,
      muscle_definition: 2,
      body_hair: 0,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/dunmer_female',
      css_width_mult: 0.94,
      css_height_mult: 1.09,
      torso_variant: 'slender',
      leg_variant: 'lean',
      head_variant: 'elfish',
    },
    cultural_notes: [
      'Dunmer women in Morrowind serve as priests, warriors, and matriarchs of Great Houses.',
      'Known for a severe, angular beauty — the classic "dark elf" appearance.',
      'Tradition dictates that Dunmer women can inherit and rule — Matriarchs hold real power.',
    ],
    voice_notes: 'Cool, controlled contralto. Speaks with dry precision and occasional dark humor.',
    mannerisms: [
      'Raises one eyebrow as a greeting or challenge',
      'Crosses arms defensively when among strangers',
      'Speaks without preamble — gets straight to the point',
    ],
  },
};

const AltmerAnatomy: RacialAnatomyData = {
  race: 'Altmer',
  male: {
    height: [185, 198, 210],
    weight: [68, 82, 100],
    build: 'slim',
    shoulder_width_ratio: 0.42,
    hip_width_ratio: 0.84,
    torso_ratio: 1.30,
    leg_ratio: 0.48,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'high',
      brow: 'light',
      nose: 'aquiline',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.93,
      shoulder_waist_ratio: 1.20,
      muscle_definition: 1,
      body_hair: 1,
      facial_hair: 1,
      adam_apple: 2,
      pelvic_width: 2,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/altmer_male',
      css_width_mult: 1.07,
      css_height_mult: 1.32,
      torso_variant: 'elongated',
      leg_variant: 'long',
      head_variant: 'elfish',
    },
    cultural_notes: [
      'High Elves are the tallest race in Tamriel, with golden-tinged skin and long pointed ears.',
      'They consider themselves the most civilized and magically gifted of all peoples.',
      'Altmer society is rigidly structured — status is paramount and always displayed.',
    ],
    voice_notes: 'Cultured, resonant voice with impeccable diction. Speaks as if reading from a scroll.',
    mannerisms: [
      'Looks down slightly when addressing shorter races',
      'Gestures with long, elegant fingers',
      'Maintains rigid posture at all times',
    ],
  },
  female: {
    height: [178, 190, 202],
    weight: [58, 70, 85],
    build: 'slim',
    shoulder_width_ratio: 0.39,
    hip_width_ratio: 0.83,
    torso_ratio: 1.26,
    leg_ratio: 0.48,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'sharp',
      cheekbones: 'high',
      brow: 'light',
      nose: 'straight',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [1, 2, 3],
      waist_hip_ratio: 0.70,
      shoulder_waist_ratio: 1.14,
      muscle_definition: 1,
      body_hair: 0,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 2,
    },
    sprite_params: {
      body_path: 'sprites/bodies/altmer_female',
      css_width_mult: 1.02,
      css_height_mult: 1.27,
      torso_variant: 'elongated',
      leg_variant: 'long',
      head_variant: 'elfish',
    },
    cultural_notes: [
      'Altmer women are considered paragons of elven beauty — tall, golden, and ethereal.',
      'Many serve in the Crystal Tower as mages, scholars, and diplomats.',
      'Altmer women are expected to project unflappable composure and grace.',
    ],
    voice_notes: 'Clear, crystalline soprano. Perfect diction — sounds like a singing bell.',
    mannerisms: [
      'Tilts chin up slightly in any conversation',
      'Moves with measured, unhurried grace',
      'Uses magical light gestures to emphasize points',
    ],
  },
};

const BosmerAnatomy: RacialAnatomyData = {
  race: 'Bosmer',
  male: {
    height: [146, 155, 165],
    weight: [44, 54, 66],
    build: 'slim',
    shoulder_width_ratio: 0.41,
    hip_width_ratio: 0.85,
    torso_ratio: 1.24,
    leg_ratio: 0.48,
    head_ratio: 0.16,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'high',
      brow: 'light',
      nose: 'button',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.93,
      shoulder_waist_ratio: 1.16,
      muscle_definition: 3,
      body_hair: 2,
      facial_hair: 2,
      adam_apple: 1,
      pelvic_width: 2,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/bosmer_male',
      css_width_mult: 0.92,
      css_height_mult: 1.03,
      torso_variant: 'compact',
      leg_variant: 'lean',
      head_variant: 'elfish',
    },
    cultural_notes: [
      'Wood Elves of Valenwood are the shortest humanoids of Tamriel but incredibly agile.',
      'Bound by the Green Pact — forbidden to harm or consume any plant matter.',
      'Master archers and trackers who move through forests with supernatural silence.',
    ],
    voice_notes: 'Quick, light tenor. Speaks rapidly with a lilting, almost singing quality.',
    mannerisms: [
      'Never sits still — taps, bounces, fidgets constantly',
      'Crouches even while standing, knees slightly bent',
      'Scans surroundings continuously, eyes constantly moving',
    ],
  },
  female: {
    height: [140, 148, 158],
    weight: [38, 45, 56],
    build: 'slim',
    shoulder_width_ratio: 0.37,
    hip_width_ratio: 0.88,
    torso_ratio: 1.20,
    leg_ratio: 0.48,
    head_ratio: 0.16,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'high',
      brow: 'light',
      nose: 'upturned',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [1, 2, 3],
      waist_hip_ratio: 0.72,
      shoulder_waist_ratio: 1.12,
      muscle_definition: 2,
      body_hair: 1,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/bosmer_female',
      css_width_mult: 0.87,
      css_height_mult: 0.99,
      torso_variant: 'compact',
      leg_variant: 'lean',
      head_variant: 'elfish',
    },
    cultural_notes: [
      'Bosmer women are renowned hunters and archers, equal to men in martial skill.',
      'Known for mischievous humor and a love of practical jokes and tricks.',
      'Valenwood culture encourages women to express themselves through wild fashion and body art.',
    ],
    voice_notes: 'Bright, quick mezzo with playful undertones. Speaks like a running stream.',
    mannerisms: [
      'Tilts head at an angle when curious',
      'Laughs at unexpected moments',
      'Touches leaves or bark absentmindedly',
    ],
  },
};

const OrsimerAnatomy: RacialAnatomyData = {
  race: 'Orsimer',
  male: {
    height: [176, 188, 200],
    weight: [85, 105, 130],
    build: 'stocky',
    shoulder_width_ratio: 0.52,
    hip_width_ratio: 0.80,
    torso_ratio: 1.40,
    leg_ratio: 0.44,
    head_ratio: 0.13,
    facial_structure: {
      jaw: 'square',
      cheekbones: 'prominent',
      brow: 'heavy',
      nose: 'broad',
      chin: 'jutting',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.96,
      shoulder_waist_ratio: 1.45,
      muscle_definition: 5,
      body_hair: 5,
      facial_hair: 5,
      adam_apple: 3,
      pelvic_width: 2,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/orsimer_male',
      css_width_mult: 1.30,
      css_height_mult: 1.25,
      torso_variant: 'barrel',
      leg_variant: 'thick',
      head_variant: 'broad',
    },
    cultural_notes: [
      'Orcs are among the most physically powerful races, with green skin and prominent tusks.',
      'Orcish society values combat prowess above all — the strong lead the weak.',
      'Pariah-folk status has made them defensive but deeply loyal to their strongholds.',
    ],
    voice_notes: 'Guttural, thunderous bass. Speaks in short, forceful declarations without ornament.',
    mannerisms: [
      'Crosses massive arms over chest when listening',
      'Snaps or flexes hands before a fight',
      'Speaks in a monotone growl that can shift to a roar',
    ],
  },
  female: {
    height: [170, 180, 192],
    weight: [72, 88, 108],
    build: 'stocky',
    shoulder_width_ratio: 0.47,
    hip_width_ratio: 0.82,
    torso_ratio: 1.34,
    leg_ratio: 0.45,
    head_ratio: 0.13,
    facial_structure: {
      jaw: 'square',
      cheekbones: 'prominent',
      brow: 'pronounced',
      nose: 'broad',
      chin: 'jutting',
    },
    secondary_traits: {
      breast_size: [1, 2, 3],
      waist_hip_ratio: 0.82,
      shoulder_waist_ratio: 1.34,
      muscle_definition: 4,
      body_hair: 3,
      facial_hair: 1,
      adam_apple: 1,
      pelvic_width: 3,
      glute_development: 4,
    },
    sprite_params: {
      body_path: 'sprites/bodies/orsimer_female',
      css_width_mult: 1.22,
      css_height_mult: 1.20,
      torso_variant: 'barrel',
      leg_variant: 'thick',
      head_variant: 'broad',
    },
    cultural_notes: [
      'Orsimer women are fierce warriors and master blacksmiths — equally formidable.',
      'Orcish culture values strength equally — female Orcs are not seen as inferior.',
      'Female Orcs in strongholds are often the chief smiths (Forge-Mothers).',
    ],
    voice_notes: 'Deep, commanding alto. Speaks with the authority of a forge-mother.',
    mannerisms: [
      'Stands with a blacksmith\'s posture — planted and immovable',
      'Flexes fingers unconsciously, as if gripping a hammer',
      'Snorts or scoffs before responding',
    ],
  },
};

const KhajiitAnatomy: RacialAnatomyData = {
  race: 'Khajiit',
  male: {
    height: [158, 168, 178],
    weight: [55, 68, 82],
    build: 'athletic',
    shoulder_width_ratio: 0.42,
    hip_width_ratio: 0.85,
    torso_ratio: 1.32,
    leg_ratio: 0.49,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'narrow',
      cheekbones: 'prominent',
      brow: 'light',
      nose: 'broad',
      chin: 'rounded',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.93,
      shoulder_waist_ratio: 1.20,
      muscle_definition: 3,
      body_hair: 5,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 2,
      glute_development: 4,
    },
    sprite_params: {
      body_path: 'sprites/bodies/khajiit_male',
      css_width_mult: 0.96,
      css_height_mult: 1.12,
      torso_variant: 'feline',
      leg_variant: 'digitigrade',
      head_variant: 'cat',
    },
    cultural_notes: [
      'Cat-folk of Elsweyr with digitigrade legs, tails, and fur-covered bodies.',
      'Khajiit fur patterns vary by birth phase and lineage — spotted, solid, or striped.',
      'Natural thieves and merchants known for their silver tongues and quick hands.',
    ],
    voice_notes: 'Sibilant, purring voice with elongated vowels. Frequently uses "this one" self-reference.',
    mannerisms: [
      'Tail twitches when agitated, curls when content',
      'Crouches low and moves silently',
      'Grooms fur compulsively when idle',
    ],
  },
  female: {
    height: [150, 160, 170],
    weight: [46, 57, 70],
    build: 'curvy',
    shoulder_width_ratio: 0.38,
    hip_width_ratio: 0.90,
    torso_ratio: 1.26,
    leg_ratio: 0.49,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'narrow',
      cheekbones: 'prominent',
      brow: 'light',
      nose: 'button',
      chin: 'rounded',
    },
    secondary_traits: {
      breast_size: [2, 3, 4],
      waist_hip_ratio: 0.70,
      shoulder_waist_ratio: 1.14,
      muscle_definition: 2,
      body_hair: 5,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 4,
      glute_development: 4,
    },
    sprite_params: {
      body_path: 'sprites/bodies/khajiit_female',
      css_width_mult: 0.90,
      css_height_mult: 1.07,
      torso_variant: 'feline',
      leg_variant: 'digitigrade',
      head_variant: 'cat',
    },
    cultural_notes: [
      'Female Khajiit are highly valued for their agility in combat and skill as traders.',
      'The Khajiiti concept of beauty blends feline grace with human proportions.',
      'Female Khajiit often serve as diplomats and traders due to their social fluency.',
    ],
    voice_notes: 'Warm, purring contralto with a melodic lilt. Speaks with calculated charm.',
    mannerisms: [
      'Ear flicks to signal mood shifts',
      'Purrs softly when pleased',
      'Moves with liquid, feline economy',
    ],
  },
};

const ArgonianAnatomy: RacialAnatomyData = {
  race: 'Argonian',
  male: {
    height: [162, 172, 183],
    weight: [60, 74, 90],
    build: 'athletic',
    shoulder_width_ratio: 0.44,
    hip_width_ratio: 0.86,
    torso_ratio: 1.32,
    leg_ratio: 0.48,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'angular',
      cheekbones: 'high',
      brow: 'light',
      nose: 'narrow',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [0, 0, 0],
      waist_hip_ratio: 0.93,
      shoulder_waist_ratio: 1.22,
      muscle_definition: 3,
      body_hair: 0,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 2,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/argonian_male',
      css_width_mult: 1.05,
      css_height_mult: 1.15,
      torso_variant: 'scaled',
      leg_variant: 'scaled',
      head_variant: 'lizard',
    },
    cultural_notes: [
      'Lizard-folk of Black Marsh, with scaled bodies, tails, and reptilian snouts.',
      'Connected to the Hist trees — their consciousness is partially shared through the Hist.',
      'Argonians are amphibious — equally comfortable on land or underwater.',
    ],
    voice_notes: 'Hissing, sibilant voice with clicks and trills. Speaks in slow, deliberate rhythms.',
    mannerisms: [
      'Head tilts side-to-side like a bird studying prey',
      'Tail flicks unconsciously when thinking',
      'Blinks slowly — the nictitating membrane is visible',
    ],
  },
  female: {
    height: [155, 164, 175],
    weight: [52, 62, 78],
    build: 'athletic',
    shoulder_width_ratio: 0.41,
    hip_width_ratio: 0.88,
    torso_ratio: 1.28,
    leg_ratio: 0.48,
    head_ratio: 0.14,
    facial_structure: {
      jaw: 'narrow',
      cheekbones: 'high',
      brow: 'light',
      nose: 'narrow',
      chin: 'pointed',
    },
    secondary_traits: {
      breast_size: [1, 1, 2],
      waist_hip_ratio: 0.78,
      shoulder_waist_ratio: 1.18,
      muscle_definition: 3,
      body_hair: 0,
      facial_hair: 0,
      adam_apple: 0,
      pelvic_width: 3,
      glute_development: 3,
    },
    sprite_params: {
      body_path: 'sprites/bodies/argonian_female',
      css_width_mult: 0.98,
      css_height_mult: 1.09,
      torso_variant: 'scaled',
      leg_variant: 'scaled',
      head_variant: 'lizard',
    },
    cultural_notes: [
      'Female Argonians are indistinguishable from males to outsiders, save for proportions.',
      'Argonian society is matriarchal — females are the primary egg-layers and clan leaders.',
      'Their connection to the Hist means female Argonians often serve as Hist-speakers.',
    ],
    voice_notes: 'Deeper sibilant register than males, with a rhythmic trill quality.',
    mannerisms: [
      'Stands perfectly still for long periods, conserving energy',
      'Speaks with ritualistic formality in formal settings',
      'Touches snout or crest when in contemplation',
    ],
  },
};

/* ── Master data map ─────────────────────────────────────────────────────── */

export const ALL_RACIAL_ANATOMY: Record<string, RacialAnatomyData> = {
  Nord: NordAnatomy,
  Imperial: ImperialAnatomy,
  Breton: BretonAnatomy,
  Redguard: RedguardAnatomy,
  Dunmer: DunmerAnatomy,
  Altmer: AltmerAnatomy,
  Bosmer: BosmerAnatomy,
  Orsimer: OrsimerAnatomy,
  Khajiit: KhajiitAnatomy,
  Argonian: ArgonianAnatomy,
};

/* ── Helper functions ────────────────────────────────────────────────────── */

/** Get full anatomy data for a race and gender. Returns undefined for invalid race. */
export function getAnatomyForRace(
  race: string,
  gender: Gender,
): RacialGenderAnatomy | undefined {
  const entry = ALL_RACIAL_ANATOMY[race];
  if (!entry) return undefined;
  return entry[gender];
}

/** Get sprite parameters for a race and gender. Returns null for invalid race. */
export function getSpriteParamsForRace(
  race: string,
  gender: Gender,
): SpriteParams | null {
  const anatomy = getAnatomyForRace(race, gender);
  return anatomy?.sprite_params ?? null;
}

/** Build a descriptive anatomy string for AI prompting or tooltips. */
export function buildAnatomyDescription(
  race: string,
  gender: Gender,
): string | null {
  const anatomy = getAnatomyForRace(race, gender);
  if (!anatomy) return null;
  const fs = anatomy.facial_structure;
  return `${race} ${gender} — ${anatomy.height[1]}cm avg, ${anatomy.build} build. ` +
    `Facial structure: ${fs.jaw} jaw, ${fs.cheekbones} cheekbones, ${fs.brow} brow, ` +
    `${fs.nose} nose, ${fs.chin} chin.`;
}

/** Alias map for race names to match npcs.ts conventions. */
const RACE_ALIASES: Record<string, string> = {
  human: 'Imperial',
  nord: 'Nord',
  nordic: 'Nord',
  imperial: 'Imperial',
  cyrodilic: 'Imperial',
  breton: 'Breton',
  high_rock: 'Breton',
  redguard: 'Redguard',
  redguard_an: 'Redguard',
  dunmer: 'Dunmer',
  dark_elf: 'Dunmer',
  darkelf: 'Dunmer',
  altmer: 'Altmer',
  high_elf: 'Altmer',
  highelf: 'Altmer',
  bosmer: 'Bosmer',
  wood_elf: 'Bosmer',
  woodelf: 'Bosmer',
  orsimer: 'Orsimer',
  orc: 'Orsimer',
  khajiit: 'Khajiit',
  cat: 'Khajiit',
  argonian: 'Argonian',
  argon: 'Argonian',
  lizard: 'Argonian',
};

/** Resolve a raw NPC race string to a canonical anatomy entry. */
export function resolveAnatomyRace(rawRace: string): string {
  const normalized = rawRace.trim().toLowerCase().replace(/[-\s_]+/g, '_');
  return RACE_ALIASES[normalized] || RACE_ALIASES[normalized.replace(/_/g, '')] || 'Imperial';
}
