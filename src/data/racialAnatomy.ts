export interface RacialAnatomy {
  race: string;
  body_description: string;
  skin_type: 'skin' | 'scales' | 'fur' | 'chitin';
  has_tail: boolean;
  ear_type: 'pointed' | 'tapered' | 'rounded' | 'none';
  sensitive_zones: string[];
  endurance_multiplier: number;
  fertility_rate: 'low' | 'normal' | 'high' | 'very_high';
  pregnancy_duration_modifier: number;
  has_breeding_season: boolean;
  anatomy_tags: string[];
  PleasureZones: string[];
}

export const RACIAL_ANATOMY: Record<string, RacialAnatomy> = {
  khajiit: {
    race: 'Khajiit',
    body_description: 'Furred feline body with retractable claws, long tail, and digitigrade legs. Covered in soft fur ranging from white to orange to dark stripes.',
    skin_type: 'fur',
    has_tail: true,
    ear_type: 'pointed',
    sensitive_zones: ['base of tail', 'ears', 'belly', 'throat', 'paws'],
    endurance_multiplier: 1.2,
    fertility_rate: 'high',
    pregnancy_duration_modifier: 0.9,
    has_breeding_season: true,
    anatomy_tags: ['fur', 'claws', 'tail', 'feline', 'flexible'],
    PleasureZones: ['tail_base', 'ears', 'belly_rub', 'chin', 'spine']
  },
  argonian: {
    race: 'Argonian',
    body_description: 'Reptilian with scales, cold-blooded metabolism, and a long powerful tail. Scaled skin ranges from green to blue to gray. Grows new scales when injured.',
    skin_type: 'scales',
    has_tail: true,
    ear_type: 'pointed',
    sensitive_zones: ['tail', 'throat_scales', 'spine ridges', 'belly', 'crest'],
    endurance_multiplier: 1.1,
    fertility_rate: 'very_high',
    pregnancy_duration_modifier: 0.7,
    has_breeding_season: true,
    anatomy_tags: ['scales', 'tail', 'cold_blooded', 'aquatic', 'regeneration'],
    PleasureZones: ['neck_scales', 'tail', 'belly_scales', 'spine', 'crest']
  },
  dunmer: {
    race: 'Dunmer',
    body_description: 'Dark grey skin, almost black, with red or orange eyes. Gray-blue Autra marks appear at maturity. Generally slender but muscular.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'pointed',
    sensitive_zones: ['neck', 'inner_wrist', 'back', 'ankles', 'temple'],
    endurance_multiplier: 1.0,
    fertility_rate: 'normal',
    pregnancy_duration_modifier: 1.0,
    has_breeding_season: false,
    anatomy_tags: ['dark_skin', 'autra_marks', 'red_eyes', 'resistant_to_fire'],
    PleasureZones: ['neck', 'wrist', 'back', 'shoulder_blade', 'ear_tips']
  },
  altmer: {
    race: 'Altmer',
    body_description: 'Tall, golden-hued skin, elongated pointed ears, and angular features. Physically elegant but fragile-looking. Almost immortal lifespan.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'pointed',
    sensitive_zones: ['ear_tips', 'spine', 'knees', 'hands', 'temple'],
    endurance_multiplier: 0.8,
    fertility_rate: 'low',
    pregnancy_duration_modifier: 1.3,
    has_breeding_season: false,
    anatomy_tags: ['golden_skin', 'tall', 'elegant', 'long_lived', 'magical'],
    PleasureZones: ['ears', 'spine', 'hands', 'lips', 'between_shoulder_blades']
  },
  bosmer: {
    race: 'Bosmer',
    body_description: 'Shorter and more agile than other mer. Green-brown skin tones that shift with mood. Known for incredible flexibility and bound leap ability.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'pointed',
    sensitive_zones: ['shoulders', 'back', 'feet', 'knees', 'neck'],
    endurance_multiplier: 1.3,
    fertility_rate: 'normal',
    pregnancy_duration_modifier: 1.0,
    has_breeding_season: false,
    anatomy_tags: ['flexible', 'agile', 'green_skin', 'animal_bond', 'woodland'],
    PleasureZones: ['shoulders', 'back', 'feet', 'neck', 'hips']
  },
  nord: {
    race: 'Nord',
    body_description: 'Tall, pale skin, often with blonde or red hair. Muscular build with broad shoulders. Built for cold climates.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'rounded',
    sensitive_zones: ['back', 'shoulders', 'neck', 'chest', 'hands'],
    endurance_multiplier: 1.2,
    fertility_rate: 'normal',
    pregnancy_duration_modifier: 1.0,
    has_breeding_season: false,
    anatomy_tags: ['pale', 'tall', 'muscular', 'cold_resistant', 'beard_growth'],
    PleasureZones: ['back', 'shoulders', 'chest', 'neck', 'hair']
  },
  redguard: {
    race: 'Redguard',
    body_description: 'Dark copper to black skin, extremely athletic and muscular. Born warriors with incredible reflexes and endurance.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'rounded',
    sensitive_zones: ['neck', 'back', 'shoulders', 'feet', 'hands'],
    endurance_multiplier: 1.4,
    fertility_rate: 'normal',
    pregnancy_duration_modifier: 1.0,
    has_breeding_season: false,
    anatomy_tags: ['dark_skin', 'athletic', 'warrior', 'desert_nomad', 'resistant_to_poison'],
    PleasureZones: ['neck', 'back', 'shoulders', 'hands', 'feet']
  },
  orc: {
    race: 'Orc',
    body_description: 'Massive green-tinted skin, prominent tusks, and heavily muscled. Intimidating presence with incredible physical strength.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'tapered',
    sensitive_zones: ['back', 'neck', 'tusks', 'shoulders', 'arms'],
    endurance_multiplier: 1.5,
    fertility_rate: 'high',
    pregnancy_duration_modifier: 0.9,
    has_breeding_season: false,
    anatomy_tags: ['green_skin', 'tusks', 'massive', 'strong', 'warrior_culture'],
    PleasureZones: ['back', 'shoulders', 'neck', 'arms', 'scalp']
  },
  Breton: {
    race: 'Breton',
    body_description: 'Average height with somewhat pale skin. Known for prominent noses and magical affinity. Mix of Altmer and human features.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'rounded',
    sensitive_zones: ['wrist', 'forehead', 'neck', 'knees', 'hands'],
    endurance_multiplier: 0.9,
    fertility_rate: 'normal',
    pregnancy_duration_modifier: 1.0,
    has_breeding_season: false,
    anatomy_tags: ['pale_skin', 'magical_aptitude', 'average_build', 'prominent_nose', 'resistant_to_magic'],
    PleasureZones: ['wrist', 'neck', 'forehead', 'hands', 'back']
  },
  imperial: {
    race: 'Imperial',
    body_description: 'Various skin tones due to mixed heritage. Generally balanced features, diplomatic presence, and versatile physical capabilities.',
    skin_type: 'skin',
    has_tail: false,
    ear_type: 'rounded',
    sensitive_zones: ['shoulders', 'neck', 'hands', 'back', 'chest'],
    endurance_multiplier: 1.0,
    fertility_rate: 'normal',
    pregnancy_duration_modifier: 1.0,
    has_breeding_season: false,
    anatomy_tags: ['mixed_heritage', 'diplomatic', 'versatile', 'commanding_presence', 'well_rounded'],
    PleasureZones: ['shoulders', 'hands', 'neck', 'back', 'lips']
  }
};

export function getRaceAnatomy(race: string): RacialAnatomy | null {
  return RACIAL_ANATOMY[race.toLowerCase()] || null;
}

export function getPleasureZoneForRace(race: string, intensity: 'soft' | 'medium' | 'hard'): string {
  const anatomy = getRaceAnatomy(race);
  if (!anatomy) return 'body';
  
  const zones = anatomy.PleasureZones;
  const index = Math.floor(Math.random() * zones.length);
  return zones[index];
}

export function getEnduranceForRace(race: string): number {
  const anatomy = getRaceAnatomy(race);
  return anatomy?.endurance_multiplier || 1.0;
}

export function getFertilityRate(race: string): number {
  const anatomy = getRaceAnatomy(race);
  if (!anatomy) return 1.0;
  
  switch (anatomy.fertility_rate) {
    case 'very_high': return 2.0;
    case 'high': return 1.5;
    case 'normal': return 1.0;
    case 'low': return 0.5;
    default: return 1.0;
  }
}