/**
 * DOL Image Asset Mapping for SVG Models
 * 
 * Maps Degrees of Lewdity image assets to SVG and GIF model equivalents
 * for use in Ga-mg character rendering system.
 */

// Base URL for DOL image assets (can be hosted locally or referenced)
export const DOL_ASSET_BASE_URL = 'https://gitgud.io/Vrelnir/degrees-of-lewdity/-/raw/master/img';

// Local asset path (for self-hosted assets)
export const LOCAL_ASSET_PATH = '/assets/dol';

// Asset type definitions
export type AssetType = 
  | 'body_base'
  | 'body_breasts'
  | 'body_penis'
  | 'body_pregnant'
  | 'hair_back' | 'hair_fringe' | 'hair_sides'
  | 'face_base' | 'face_eyes' | 'face_mouth' | 'face_blush'
  | 'clothes_upper' | 'clothes_lower' | 'clothes_under_upper' | 'clothes_under_lower'
  | 'clothes_legs' | 'clothes_feet' | 'clothes_hands' | 'clothes_head'
  | 'clothes_neck' | 'clothes_face' | 'clothes_back'
  | 'transform_ears' | 'transform_tail' | 'transform_wings' | 'transform_horns'
  | 'fluid_cum' | 'fluid_tears' | 'fluid_sweat' | 'fluid_saliva'
  | 'bodywriting';

// Image format options
export type ImageFormat = 'svg' | 'png' | 'gif';

// Asset layer definition
export interface AssetLayer {
  id: string;
  type: AssetType;
  name: string;
  zIndex: number;
  variants: string[];
  hasAnimation: boolean;
  svgPath?: string;
  pngPath: string;
  gifPath?: string;
}

// Complete asset registry
export const DOL_ASSET_REGISTRY: Record<string, AssetLayer[]> = {
  // Body parts
  body: [
    {
      id: 'body_base',
      type: 'body_base',
      name: 'Base Body',
      zIndex: 0,
      variants: ['default', 'tan', 'dark', 'pale', 'blue', 'green', 'red', 'purple'],
      hasAnimation: false,
      svgPath: '/svg/body/base.svg',
      pngPath: '/body/mannequin/base.png',
    },
    {
      id: 'body_breasts',
      type: 'body_breasts',
      name: 'Breasts',
      zIndex: 10,
      variants: ['small', 'medium', 'large', 'huge'],
      hasAnimation: true,
      svgPath: '/svg/body/breasts.svg',
      pngPath: '/body/breasts/default.png',
      gifPath: '/gif/body/breasts.gif',
    },
    {
      id: 'body_penis',
      type: 'body_penis',
      name: 'Penis',
      zIndex: 15,
      variants: ['small', 'medium', 'large', 'huge'],
      hasAnimation: true,
      svgPath: '/svg/body/penis.svg',
      pngPath: '/body/penis/default.png',
      gifPath: '/gif/body/penis.gif',
    },
    {
      id: 'body_pregnant',
      type: 'body_pregnant',
      name: 'Pregnant Belly',
      zIndex: 12,
      variants: ['stage1', 'stage2', 'stage3', 'stage4'],
      hasAnimation: false,
      svgPath: '/svg/body/preggyBelly.svg',
      pngPath: '/body/preggyBelly/default.png',
    },
  ],

  // Hair
  hair: [
    {
      id: 'hair_back',
      type: 'hair_back',
      name: 'Back Hair',
      zIndex: 5,
      variants: ['short', 'medium', 'long', 'buzz', 'bob', 'braid', 'ponytail', 'twintails'],
      hasAnimation: true,
      svgPath: '/svg/hair/back.svg',
      pngPath: '/hair/back/default.png',
      gifPath: '/gif/hair/back.gif',
    },
    {
      id: 'hair_fringe',
      type: 'hair_fringe',
      name: 'Fringe/Bangs',
      zIndex: 100,
      variants: ['straight', 'side', 'curtain', 'none'],
      hasAnimation: false,
      svgPath: '/svg/hair/fringe.svg',
      pngPath: '/hair/fringe/default.png',
    },
    {
      id: 'hair_sides',
      type: 'hair_sides',
      name: 'Side Hair',
      zIndex: 95,
      variants: ['default', 'short', 'long'],
      hasAnimation: false,
      svgPath: '/svg/hair/sides.svg',
      pngPath: '/hair/sides/default.png',
    },
  ],

  // Face
  face: [
    {
      id: 'face_base',
      type: 'face_base',
      name: 'Face Base',
      zIndex: 90,
      variants: ['default', 'blush', 'heavy_blush', 'aroused'],
      hasAnimation: false,
      svgPath: '/svg/face/base.svg',
      pngPath: '/face/default/base.png',
    },
    {
      id: 'face_eyes',
      type: 'face_eyes',
      name: 'Eyes',
      zIndex: 92,
      variants: ['neutral', 'happy', 'sad', 'angry', 'surprised', 'closed', 'half_closed', 'heart'],
      hasAnimation: true,
      svgPath: '/svg/face/eyes.svg',
      pngPath: '/face/default/eyes.png',
      gifPath: '/gif/face/eyes.gif',
    },
    {
      id: 'face_mouth',
      type: 'face_mouth',
      name: 'Mouth',
      zIndex: 93,
      variants: ['neutral', 'smile', 'frown', 'open', 'tongue', 'kiss', 'gasp'],
      hasAnimation: false,
      svgPath: '/svg/face/mouth.svg',
      pngPath: '/face/default/mouth.png',
    },
    {
      id: 'face_blush',
      type: 'face_blush',
      name: 'Blush',
      zIndex: 91,
      variants: ['light', 'medium', 'heavy'],
      hasAnimation: false,
      svgPath: '/svg/face/blush.svg',
      pngPath: '/face/default/blush.png',
    },
  ],

  // Upper body clothing
  clothes_upper: [
    {
      id: 'shirt_buttondown',
      type: 'clothes_upper',
      name: 'Button-down Shirt',
      zIndex: 50,
      variants: ['default', 'open', 'tucked', 'untucked'],
      hasAnimation: false,
      svgPath: '/svg/clothes/upper/buttondown.svg',
      pngPath: '/clothes/upper/buttondown/default.png',
    },
    {
      id: 'shirt_tshirt',
      type: 'clothes_upper',
      name: 'T-Shirt',
      zIndex: 50,
      variants: ['default', 'tight', 'loose', 'cropped'],
      hasAnimation: false,
      svgPath: '/svg/clothes/upper/tshirt.svg',
      pngPath: '/clothes/upper/band tee/default.png',
    },
    {
      id: 'dress_school',
      type: 'clothes_upper',
      name: 'School Uniform',
      zIndex: 50,
      variants: ['default', 'open', 'torn'],
      hasAnimation: false,
      svgPath: '/svg/clothes/upper/school.svg',
      pngPath: '/clothes/upper/baseball/default.png',
    },
    {
      id: 'top_tank',
      type: 'clothes_upper',
      name: 'Tank Top',
      zIndex: 50,
      variants: ['default', 'tight'],
      hasAnimation: false,
      svgPath: '/svg/clothes/upper/tank.svg',
      pngPath: '/clothes/upper/belly/default.png',
    },
    {
      id: 'sweater',
      type: 'clothes_upper',
      name: 'Sweater',
      zIndex: 52,
      variants: ['default', 'baggy'],
      hasAnimation: false,
      svgPath: '/svg/clothes/upper/sweater.svg',
      pngPath: '/clothes/upper/argyle/default.png',
    },
  ],

  // Lower body clothing
  clothes_lower: [
    {
      id: 'pants_jeans',
      type: 'clothes_lower',
      name: 'Jeans',
      zIndex: 40,
      variants: ['default', 'tight', 'loose', 'ripped'],
      hasAnimation: false,
      svgPath: '/svg/clothes/lower/jeans.svg',
      pngPath: '/clothes/lower/jeans/default.png',
    },
    {
      id: 'skirt_short',
      type: 'clothes_lower',
      name: 'Short Skirt',
      zIndex: 40,
      variants: ['default', 'lifted', 'blown'],
      hasAnimation: true,
      svgPath: '/svg/clothes/lower/skirt_short.svg',
      pngPath: '/clothes/lower/skirt/short.png',
      gifPath: '/gif/clothes/lower/skirt_short.gif',
    },
    {
      id: 'skirt_long',
      type: 'clothes_lower',
      name: 'Long Skirt',
      zIndex: 40,
      variants: ['default', 'lifted'],
      hasAnimation: false,
      svgPath: '/svg/clothes/lower/skirt_long.svg',
      pngPath: '/clothes/lower/skirt/long.png',
    },
    {
      id: 'shorts',
      type: 'clothes_lower',
      name: 'Shorts',
      zIndex: 40,
      variants: ['default', 'tight'],
      hasAnimation: false,
      svgPath: '/svg/clothes/lower/shorts.svg',
      pngPath: '/clothes/lower/shorts/default.png',
    },
  ],

  // Underwear
  underwear_upper: [
    {
      id: 'bra',
      type: 'clothes_under_upper',
      name: 'Bra',
      zIndex: 45,
      variants: ['default', 'lace', 'sports'],
      hasAnimation: false,
      svgPath: '/svg/clothes/under_upper/bra.svg',
      pngPath: '/clothes/under_upper/bra/default.png',
    },
  ],
  underwear_lower: [
    {
      id: 'panties',
      type: 'clothes_under_lower',
      name: 'Panties',
      zIndex: 35,
      variants: ['default', 'lace', 'thong', 'boyshorts'],
      hasAnimation: false,
      svgPath: '/svg/clothes/under_lower/panties.svg',
      pngPath: '/clothes/under_lower/panties/default.png',
    },
    {
      id: 'boxers',
      type: 'clothes_under_lower',
      name: 'Boxers',
      zIndex: 35,
      variants: ['default'],
      hasAnimation: false,
      svgPath: '/svg/clothes/under_lower/boxers.svg',
      pngPath: '/clothes/under_lower/boxers/default.png',
    },
  ],

  // Legwear
  legs: [
    {
      id: 'socks',
      type: 'clothes_legs',
      name: 'Socks',
      zIndex: 30,
      variants: ['ankle', 'knee', 'thigh'],
      hasAnimation: false,
      svgPath: '/svg/clothes/legs/socks.svg',
      pngPath: '/clothes/legs/socks/default.png',
    },
    {
      id: 'stockings',
      type: 'clothes_legs',
      name: 'Stockings',
      zIndex: 30,
      variants: ['default', 'fishnet', 'lace'],
      hasAnimation: false,
      svgPath: '/svg/clothes/legs/stockings.svg',
      pngPath: '/clothes/legs/stockings/default.png',
    },
    {
      id: 'tights',
      type: 'clothes_legs',
      name: 'Tights',
      zIndex: 30,
      variants: ['default', 'ripped'],
      hasAnimation: false,
      svgPath: '/svg/clothes/legs/tights.svg',
      pngPath: '/clothes/legs/tights/default.png',
    },
  ],

  // Footwear
  feet: [
    {
      id: 'shoes_sneakers',
      type: 'clothes_feet',
      name: 'Sneakers',
      zIndex: 25,
      variants: ['default'],
      hasAnimation: false,
      svgPath: '/svg/clothes/feet/sneakers.svg',
      pngPath: '/clothes/feet/sneakers/default.png',
    },
    {
      id: 'shoes_boots',
      type: 'clothes_feet',
      name: 'Boots',
      zIndex: 25,
      variants: ['default', 'thigh_high'],
      hasAnimation: false,
      svgPath: '/svg/clothes/feet/boots.svg',
      pngPath: '/clothes/feet/boots/default.png',
    },
    {
      id: 'shoes_heels',
      type: 'clothes_feet',
      name: 'High Heels',
      zIndex: 25,
      variants: ['default', 'platform'],
      hasAnimation: false,
      svgPath: '/svg/clothes/feet/heels.svg',
      pngPath: '/clothes/feet/heels/default.png',
    },
  ],

  // Transformations
  transformations: [
    {
      id: 'transform_cat_ears',
      type: 'transform_ears',
      name: 'Cat Ears',
      zIndex: 110,
      variants: ['default'],
      hasAnimation: true,
      svgPath: '/svg/transform/cat/ears.svg',
      pngPath: '/transformations/cat/ears/default.png',
      gifPath: '/gif/transform/cat/ears.gif',
    },
    {
      id: 'transform_cat_tail',
      type: 'transform_tail',
      name: 'Cat Tail',
      zIndex: 8,
      variants: ['idle', 'flaunt', 'cover'],
      hasAnimation: true,
      svgPath: '/svg/transform/cat/tail.svg',
      pngPath: '/transformations/cat/tail-idle/default.png',
      gifPath: '/gif/transform/cat/tail.gif',
    },
    {
      id: 'transform_wolf_ears',
      type: 'transform_ears',
      name: 'Wolf Ears',
      zIndex: 110,
      variants: ['default'],
      hasAnimation: false,
      svgPath: '/svg/transform/wolf/ears.svg',
      pngPath: '/transformations/wolf/ears/default.png',
    },
    {
      id: 'transform_wolf_tail',
      type: 'transform_tail',
      name: 'Wolf Tail',
      zIndex: 8,
      variants: ['idle', 'flaunt'],
      hasAnimation: true,
      svgPath: '/svg/transform/wolf/tail.svg',
      pngPath: '/transformations/wolf/tail-idle/default.png',
      gifPath: '/gif/transform/wolf/tail.gif',
    },
    {
      id: 'transform_demon_horns',
      type: 'transform_horns',
      name: 'Demon Horns',
      zIndex: 115,
      variants: ['default'],
      hasAnimation: false,
      svgPath: '/svg/transform/demon/horns.svg',
      pngPath: '/transformations/demon/horns/default.png',
    },
    {
      id: 'transform_demon_wings',
      type: 'transform_wings',
      name: 'Demon Wings',
      zIndex: 3,
      variants: ['idle', 'flaunt', 'cover'],
      hasAnimation: true,
      svgPath: '/svg/transform/demon/wings.svg',
      pngPath: '/transformations/demon/wings-idle/default.png',
      gifPath: '/gif/transform/demon/wings.gif',
    },
    {
      id: 'transform_demon_tail',
      type: 'transform_tail',
      name: 'Demon Tail',
      zIndex: 8,
      variants: ['idle', 'flaunt'],
      hasAnimation: true,
      svgPath: '/svg/transform/demon/tail.svg',
      pngPath: '/transformations/demon/tail-idle/default.png',
      gifPath: '/gif/transform/demon/tail.gif',
    },
    {
      id: 'transform_angel_wings',
      type: 'transform_wings',
      name: 'Angel Wings',
      zIndex: 3,
      variants: ['idle', 'flaunt'],
      hasAnimation: true,
      svgPath: '/svg/transform/angel/wings.svg',
      pngPath: '/transformations/angel/wings-idle/default.png',
      gifPath: '/gif/transform/angel/wings.gif',
    },
    {
      id: 'transform_bird_wings',
      type: 'transform_wings',
      name: 'Bird Wings',
      zIndex: 3,
      variants: ['idle', 'flaunt', 'cover'],
      hasAnimation: true,
      svgPath: '/svg/transform/bird/wings.svg',
      pngPath: '/transformations/bird/wings-idle/default.png',
      gifPath: '/gif/transform/bird/wings.gif',
    },
  ],

  // Fluids/Effects
  fluids: [
    {
      id: 'fluid_cum',
      type: 'fluid_cum',
      name: 'Cum',
      zIndex: 120,
      variants: ['face', 'chest', 'stomach', 'genitals'],
      hasAnimation: false,
      svgPath: '/svg/body/cum.svg',
      pngPath: '/body/cum/default.png',
    },
    {
      id: 'fluid_tears',
      type: 'fluid_tears',
      name: 'Tears',
      zIndex: 94,
      variants: ['light', 'heavy'],
      hasAnimation: true,
      svgPath: '/svg/face/tears.svg',
      pngPath: '/face/default/tears.png',
      gifPath: '/gif/face/tears.gif',
    },
    {
      id: 'fluid_sweat',
      type: 'fluid_sweat',
      name: 'Sweat',
      zIndex: 89,
      variants: ['light', 'heavy'],
      hasAnimation: true,
      svgPath: '/svg/body/sweat.svg',
      pngPath: '/body/sweat/default.png',
      gifPath: '/gif/body/sweat.gif',
    },
  ],

  // Body writing
  bodywriting: [
    {
      id: 'writing_heart',
      type: 'bodywriting',
      name: 'Heart',
      zIndex: 88,
      variants: ['chest', 'stomach', 'thigh'],
      hasAnimation: false,
      svgPath: '/svg/bodywriting/heart.svg',
      pngPath: '/bodywriting/heart/default.png',
    },
    {
      id: 'writing_text',
      type: 'bodywriting',
      name: 'Text',
      zIndex: 88,
      variants: ['slut', 'whore', 'property', 'custom'],
      hasAnimation: false,
      svgPath: '/svg/bodywriting/text.svg',
      pngPath: '/bodywriting/text/default.png',
    },
    {
      id: 'writing_arrow',
      type: 'bodywriting',
      name: 'Arrow',
      zIndex: 88,
      variants: ['down', 'up'],
      hasAnimation: false,
      svgPath: '/svg/bodywriting/arrow.svg',
      pngPath: '/bodywriting/text/arrow.png',
    },
  ],
};

// Helper functions
export function getAssetUrl(layer: AssetLayer, variant: string, format: ImageFormat = 'png'): string {
  const base = format === 'svg' ? (layer.svgPath || layer.pngPath) : 
               format === 'gif' ? (layer.gifPath || layer.pngPath) : 
               layer.pngPath;

  return `${DOL_ASSET_BASE_URL}${base.replace('/default', `/${variant}`)}`;
}

export function getLayersByType(type: AssetType): AssetLayer[] {
  return Object.values(DOL_ASSET_REGISTRY).flat().filter(layer => layer.type === type);
}

export function getLayerById(id: string): AssetLayer | undefined {
  return Object.values(DOL_ASSET_REGISTRY).flat().find(layer => layer.id === id);
}

export function getAnimatedLayers(): AssetLayer[] {
  return Object.values(DOL_ASSET_REGISTRY).flat().filter(layer => layer.hasAnimation);
}

export function getLayersForGIF(): AssetLayer[] {
  return Object.values(DOL_ASSET_REGISTRY).flat().filter(layer => layer.gifPath);
}

// Default layer order for rendering (back to front)
export const DEFAULT_LAYER_ORDER: AssetType[] = [
  'transform_wings',
  'hair_back',
  'body_base',
  'transform_tail',
  'body_pregnant',
  'body_breasts',
  'body_penis',
  'clothes_under_lower',
  'clothes_under_upper',
  'clothes_lower',
  'clothes_legs',
  'clothes_feet',
  'clothes_upper',
  'clothes_hands',
  'hair_sides',
  'face_base',
  'face_blush',
  'face_eyes',
  'face_mouth',
  'hair_fringe',
  'transform_ears',
  'transform_horns',
  'clothes_head',
  'clothes_face',
  'clothes_neck',
  'fluid_cum',
  'fluid_tears',
  'fluid_sweat',
  'bodywriting',
];

export default DOL_ASSET_REGISTRY;
