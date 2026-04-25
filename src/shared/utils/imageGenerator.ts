import { Race, Gender, BodyState, Pose } from '../components/sprites/CharacterSVG';
import { getRaceAnatomy } from './racialAnatomy';

export type ImageStyle = 'realistic''| 'anime''| 'pixel''| 'sketch''| 'painting';
export type ImageQuality = 'thumbnail''| 'preview''| 'full''| 'hd';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: ImageStyle;
  quality: ImageQuality;
  created_at: number;
  seed: number;
}

export interface ImageGenerationRequest {
  character?: {
    race: Race;
    gender: Gender;
    pose: Pose;
    bodyState: BodyState;
    ageGroup?: 'child''| 'young''| 'adult''| 'elderly';
    description?: string;
    outfit?: string;
  };
  scene?: {
    location: string;
    timeOfDay: string;
    weather: string;
    mood: string;
  };
  style: ImageStyle;
  quality: ImageQuality;
  seed?: number;
}

const RACE_VISUAL_PROMPTS: Record<Race, string> = {
  nord: "Nord warrior, pale skin, blonde or red hair, blue eyes, muscular build, Viking-inspired clothing, medieval fantasy",
  imperial: "Imperial noble, olive skin, dark hair, brown eyes, refined features, Roman-inspired armor, elegant bearing",
  breton: "Breton mage, fair skin, auburn hair, pointy ears, magical aura, mystical robes, Arcane symbols",
  redguard: "Redguard warrior, dark brown skin, black hair, amber eyes, desert warrior, scimitar, exotic spices",
  dunmer: "Dunmer (Dark Elf), grey skin, dark grey hair, red eyes, ancient markings, Morrowind robes, mysterious",
  altmer: "Altmer (High Elf), golden skin, blonde hair, elongated ears, tall and slender, elegant robes, divine presence",
  bosmer: "Bosmer (Wood Elf), tan skin, brown hair, green eyes, animal features, forest clothes, agile stance",
  orsimer: "Orc (Orsimer), green-tinted skin, dark hair, tusks, massive muscular build, heavy armor, war paint",
  khajiit: "Khajiit cat-person, fur-covered body, tail, feline features, whiskers, comfortable adventuring clothes, ringleader appearance",
  argonian: "Argonian lizard-person, green or blue scales, tail, reptile eyes, natural armor, swamp survival gear"
};

const POSE_PROMPTS: Record<Pose, string> = {
  standing: "confident stance, full body visible, arms relaxed, facing viewer",
  sitting: "seated position, relaxed posture, three-quarter view",
  walking: "mid-stride, dynamic pose, forward movement",
  sleeping: "lying down, peaceful expression, covers visible",
  working: "active pose, hands engaged, focused expression",
  combat: "action stance, weapon ready, battle-ready expression"
};

const CLOTHING_PROMPTS: Record<string, string> = {
  none: "nude, bare skin visible",
  underwear: "basic undergarments, minimal coverage",
  casual: "commoner clothes, simple tunic and pants, practical",
  merchant: "trader attire, traveling clothes, merchant guild symbols",
  noble: "fine aristocratic clothing, expensive fabrics, jewelry, fur trim",
  mage: "magical robes, arcane symbols, enchanted accessories, hood",
  warrior: "armor, plate or chainmail, weapon visible, battle-ready",
  thief: "dark clothing, hood, concealed weapons, stealthy appearance",
  priest: "religious vestments, sacred symbols, holy aura",
  slave: "minimal clothing, chains, collar, submissive posture"
};

const LOCATION_BACKGROUNDS: Record<string, string> = {
  the_bee_and_barb: "tavern interior, warm fireplace, wooden tables, ale barrels, torchlight, cozy atmosphere",
  the_scorched_hammer: "blacksmith forge, glowing embers, metal tools, anvil, sparks flying, hot and smoky",
  riften_market: "marketplace, merchant stalls, crowd, goods displayed, bustling activity, Riften architecture",
  mistveil_keep: "throne room, Jarl's palace, noble decorations, banners, guards, regal atmosphere",
  the_ragged_flagon: "underground cavern, thieves hideout, torchlight, shadows, secret passages",
  riften_docks: "canal district, boats, docks, water, warehouses, mist, foggy morning",
  shrine_of_azura: "mountain shrine, statue of Azura, star above, mystical light, ancient stones",
  hot_springs: "natural hot springs, steam, rocks, nature, relaxation, warm water, peaceful",
  wilderness: "forest or wilderness, trees, nature, path, adventure atmosphere, skyrim landscape",
  dungeon: "dungeon interior, dark, stone walls, danger, mysterious, ancient ruins",
  bedroom: "private bedroom, bed, personal items, intimate setting, warm lighting",
  default: "generic Skyrim location, atmospheric, fantasy setting"
};

const MOOD_MODIFIERS: Record<string, string> = {
  normal: "neutral expression, normal lighting",
  happy: "smiling, bright expression, warm lighting, positive atmosphere",
  sad: "downcast expression, tear tracks, melancholy, grey lighting",
  angry: "angry expression, aggressive posture, red tint, tense atmosphere",
  scared: "fearful expression, wide eyes, trembling, dark shadows",
  aroused: "seductive expression, bedroom eyes, intimate lighting, pink tint",
  corrupt: "dark aura, corrupted features, shadowy, ominous, twisted",
  injured: "wounded, bruises, blood, pained expression, damaged",
  undead: "pale, dead eyes, ghostly aura, ethereal, supernatural"
};

const TIME_OF_DAY_LIGHTING: Record<string, string> = {
  dawn: "golden hour light, soft pink and orange, morning mist",
  morning: "bright daylight, clear sky, fresh morning atmosphere",
  noon: "harsh sunlight, strong shadows, midday clarity",
  afternoon: "warm afternoon light, long shadows, lazy atmosphere",
  dusk: "orange and purple sunset, dramatic sky, evening atmosphere",
  night: "dark, moonlight, stars visible, torch or lamp light",
  midnight: "very dark, blue moonlight, shadows, quiet atmosphere"
};

const WEATHER_ATMOSPHERE: Record<string, string> = {
  Clear: "clear sky, no clouds, good visibility",
  Cloudy: "grey clouds, overcast, flat lighting",
  Raining: "rain, wet surfaces, reflection, grey atmosphere",
  Snowing: "snow, white covering, cold atmosphere, blue tint",
  Foggy: "fog, limited visibility, mysterious, layered",
  Storming: "storm, lightning, wind, dramatic atmosphere",
  'Blood Red Sky': "red sky, ominous, supernatural, dangerous",
  Aurora: "northern lights, green and purple, magical, ethereal"
};

function generateCharacterPrompt(request: ImageGenerationRequest): string {
  if (!request.character) return ';
  
  const { race, gender, pose, bodyState, ageGroup, description } = request.character;
  
  let prompt = `${RACE_VISUAL_PROMPTS[race]}, `;
  
  if (gender !== 'male') {
    prompt += gender === 'female''? "female figure, " : "androgynous figure, ";
  }
  
  prompt += `${POSE_PROMPTS[pose]}, `;
  
  if (bodyState === 'naked''|| bodyState === 'naked_aroused') {
    prompt += "nude, ";
  } else if (bodyState === 'torn') {
    prompt += "torn clothing, damaged, ";
  } else {
    prompt += "appropriately dressed, ";
  }
  
  if (ageGroup === 'child') {
    prompt = prompt.replace(/warrior|adult|figure/g, 'child');
    prompt += "young, innocent, ";
  } else if (ageGroup === 'elderly') {
    prompt += "elderly, aged, weathered, wise, ";
  }
  
  if (description) {
    prompt += description + ", ";
  }
  
  const anatomy = getRaceAnatomy(race);
  if (anatomy) {
    if (anatomy.skin_type === 'fur') prompt += "furred, ";
    if (anatomy.skin_type === 'scales') prompt += "scaly, ";
    if (anatomy.has_tail) prompt += "with tail, ";
  }
  
  return prompt;
}

function generateScenePrompt(request: ImageGenerationRequest): string {
  if (!request.scene) return LOCATION_BACKGROUNDS.default;
  
  let prompt = LOCATION_BACKGROUNDS[request.scene.location] || LOCATION_BACKGROUNDS.default;
  
  prompt += ", " + TIME_OF_DAY_LIGHTING[request.scene.timeOfDay] || "";
  
  prompt += ", " + WEATHER_ATMOSPHERE[request.scene.weather] || "";
  
  prompt += ", " + MOOD_MODIFIERS[request.scene.mood] || MOOD_MODIFIERS.normal;
  
  return prompt;
}

function generateFullPrompt(request: ImageGenerationRequest): string {
  const charPrompt = generateCharacterPrompt(request);
  const scenePrompt = generateScenePrompt(request);
  
  return `${charPrompt}, ${scenePrompt}, high quality, detailed, ${request.style === 'realistic''? 'photorealistic'': request.style} style, fantasy art, 8k, masterwork`;
}

export function generateImageRequest(request: ImageGenerationRequest): string {
  const prompt = generateFullPrompt(request);
  const seed = request.seed || Math.floor(Math.random() * 1000000);
  
  const size = {
    thumbnail: "256x256",
    preview: "512x512",
    full: "1024x1024",
    hd: "2048x2048"
  }[request.quality];
  
  const stylePrefix = request.style === 'anime''? 'anime style, '': 
                      request.style === 'pixel''? 'pixel art style, '':
                      request.style === 'sketch''? 'sketch style, '':
                      request.style === 'painting''? 'oil painting style, '': ';
  
  return `https:/image.pollinations.ai/prompt/${encodeURIComponent(stylePrefix + prompt)}?width=${size.split('x')[0]}&height=${size.split('x')[1]}&seed=${seed}&nologo=true`;
}

export function createCharacterImage(character: ImageGenerationRequest['character'], quality: ImageQuality = 'full'): GeneratedImage {
  const request: ImageGenerationRequest = {
    character,
    style: 'realistic',
    quality
  };
  
  const prompt = generateFullPrompt(request);
  const seed = Math.floor(Math.random() * 1000000);
  const url = generateImageRequest(request);
  
  return {
    id: `img_${Date.now()}_${seed}`,
    url,
    prompt,
    style: 'realistic',
    quality,
    created_at: Date.now(),
    seed
  };
}

export function createSceneImage(scene: ImageGenerationRequest['scene'], style: ImageStyle = 'painting', quality: ImageQuality = 'full'): GeneratedImage {
  const request: ImageGenerationRequest = {
    scene,
    style,
    quality,
    seed: Math.floor(Math.random() * 1000000)
  };
  
  const prompt = generateFullPrompt(request);
  const seed = Math.floor(Math.random() * 1000000);
  const url = generateImageRequest(request);
  
  return {
    id: `img_${Date.now()}_${seed}`,
    url,
    prompt,
    style,
    quality,
    created_at: Date.now(),
    seed
  };
}

export function createEncounterImage(character: ImageGenerationRequest['character'], scene: ImageGenerationRequest['scene'], style: ImageStyle = 'painting'): GeneratedImage {
  const request: ImageGenerationRequest = {
    character,
    scene,
    style,
    quality: 'full',
    seed: Math.floor(Math.random() * 1000000)
  };
  
  const prompt = generateFullPrompt(request);
  const seed = Math.floor(Math.random() * 1000000);
  const url = generateImageRequest(request);
  
  return {
    id: `img_${Date.now()}_${seed}`,
    url,
    prompt,
    style,
    quality: 'full',
    created_at: Date.now(),
    seed
  };
}

export const IMAGE_CACHE: Map<string, GeneratedImage> = new Map();

export function getCachedImage(key: string): GeneratedImage | null {
  return IMAGE_CACHE.get(key) || null;
}

export function cacheImage(key: string, image: GeneratedImage): void {
  if (IMAGE_CACHE.size > 100) {
    const firstKey = IMAGE_CACHE.keys().next().value;
    IMAGE_CACHE.delete(firstKey);
  }
  IMAGE_CACHE.set(key, image);
}

export function generateCacheKey(request: ImageGenerationRequest): string {
  const charKey = request.character ? 
    `${request.character.race}-${request.character.gender}-${request.character.pose}-${request.character.bodyState}` : 'none';
  const sceneKey = request.scene ?
    `${request.scene.location}-${request.scene.timeOfDay}-${request.scene.weather}-${request.scene.mood}` : 'none';
  
  return `${charKey}-${sceneKey}-${request.style}-${request.quality}`;
}