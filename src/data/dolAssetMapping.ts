/**
 * DOL Image Asset Mapping for SVG Models
 * 
 * Maps Degrees of Lewdity image assets to SVG and GIF model equivalents
 * for use in Ga-mg character rendering system.
 */

// Base URL for DOL image assets (can be hosted locally or referenced)
export const DOL_ASSET_BASE_URL = 'https://gitgud.io/Vrelnir/degrees-of-lewdity/-/raw/master/img';

// Local SVG asset path
export const LOCAL_SVG_PATH = '/svg';

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

// Asset source preference
export type AssetSource = 'local_svg' | 'dol_png' | 'dol_gif';

// Asset layer definition
export interface AssetLayer {
  id: string;
  type: AssetType;
  name: string;
  zIndex: number;
  variants: string[];
  hasAnimation: boolean;
  localSvgPath?: string;
  dolPngPath?: string;
  dolGifPath?: string;
}

// Complete asset registry with local SVG and DOL paths
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
      localSvgPath: '/svg/body/base.svg',
      dolPngPath: '/body/mannequin/base.png',
    },
    {
      id: 'body_breasts',
      type: 'body_breasts',
      name: 'Breasts',
      zIndex: 10,
      variants: ['small', 'medium', 'large', 'huge'],
      hasAnimation: true,
      localSvgPath: '/svg/body/breasts.svg',
      dolPngPath: '/body/breasts/default.png',
    },
    {
      id: 'body_penis',
      type: 'body_penis',
      name: 'Penis',
      zIndex: 15,
      variants: ['small', 'medium', 'large', 'huge'],
      hasAnimation: false,
      dolPngPath: '/body/penis/default.png',
    },
    {
      id: 'body_pregnant',
      type: 'body_pregnant',
      name: 'Pregnant Belly',
      zIndex: 12,
      variants: ['stage1', 'stage2', 'stage3', 'stage4'],
      hasAnimation: false,
      dolPngPath: '/body/preggyBelly/default.png',
    },
    {
      id: 'fluid_tears',
      type: 'fluid_tears',
      name: 'Tears',
      zIndex: 94,
      variants: ['light', 'heavy'],
      hasAnimation: true,
      localSvgPath: '/svg/body/tears.svg',
      dolPngPath: '/face/default/tears.png',
    },
    {
      id: 'fluid_sweat',
      type: 'fluid_sweat',
      name: 'Sweat',
      zIndex: 89,
      variants: ['light', 'heavy'],
      hasAnimation: true,
      localSvgPath: '/svg/body/sweat.svg',
      dolPngPath: '/body/sweat/default.png',
    },
  ],

  // Hair
  hair: [
    {
      id: 'hair_back',
      type: 'hair_back',
      name: 'Back Hair',
      zIndex: 5,
      variants: ['short', 'medium', 'long'],
      hasAnimation: true,
      localSvgPath: '/svg/hair/back.svg',
      dolPngPath: '/hair/back/default.png',
    },
    {
      id: 'hair_fringe',
      type: 'hair_fringe',
      name: 'Fringe/Bangs',
      zIndex: 100,
      variants: ['straight', 'side', 'curtain', 'none'],
      hasAnimation: false,
      localSvgPath: '/svg/hair/fringe.svg',
      dolPngPath: '/hair/fringe/default.png',
    },
    {
      id: 'hair_sides',
      type: 'hair_sides',
      name: 'Side Hair',
      zIndex: 95,
      variants: ['default', 'short', 'long'],
      hasAnimation: false,
      dolPngPath: '/hair/sides/default.png',
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
      localSvgPath: '/svg/face/base.svg',
      dolPngPath: '/face/default/base.png',
    },
    {
      id: 'face_eyes',
      type: 'face_eyes',
      name: 'Eyes',
      zIndex: 92,
      variants: ['neutral', 'happy', 'sad', 'angry', 'surprised', 'closed', 'half_closed', 'heart'],
      hasAnimation: true,
      localSvgPath: '/svg/face/eyes.svg',
      dolPngPath: '/face/default/eyes.png',
    },
    {
      id: 'face_mouth',
      type: 'face_mouth',
      name: 'Mouth',
      zIndex: 93,
      variants: ['neutral', 'smile', 'frown', 'open', 'tongue', 'kiss', 'gasp'],
      hasAnimation: false,
      localSvgPath: '/svg/face/mouth.svg',
      dolPngPath: '/face/default/mouth.png',
    },
    {
      id: 'face_blush',
      type: 'face_blush',
      name: 'Blush',
      zIndex: 91,
      variants: ['light', 'medium', 'heavy'],
      hasAnimation: false,
      localSvgPath: '/svg/face/blush.svg',
      dolPngPath: '/face/default/blush.png',
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
      localSvgPath: '/svg/clothes/upper/buttondown.svg',
      dolPngPath: '/clothes/upper/buttondown/default.png',
    },
    {
      id: 'shirt_tshirt',
      type: 'clothes_upper',
      name: 'T-Shirt',
      zIndex: 50,
      variants: ['default', 'tight', 'loose', 'cropped'],
      hasAnimation: false,
      localSvgPath: '/svg/clothes/upper/tshirt.svg',
      dolPngPath: '/clothes/upper/band tee/default.png',
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
      localSvgPath: '/svg/clothes/lower/jeans.svg',
      dolPngPath: '/clothes/lower/jeans/default.png',
    },
    {
      id: 'skirt_short',
      type: 'clothes_lower',
      name: 'Short Skirt',
      zIndex: 40,
      variants: ['default', 'lifted', 'blown'],
      hasAnimation: true,
      localSvgPath: '/svg/clothes/lower/skirt_short.svg',
      dolPngPath: '/clothes/lower/skirt/short.png',
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
      localSvgPath: '/svg/clothes/under_upper/bra.svg',
      dolPngPath: '/clothes/under_upper/bra/default.png',
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
      localSvgPath: '/svg/clothes/under_lower/panties.svg',
      dolPngPath: '/clothes/under_lower/panties/default.png',
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
      localSvgPath: '/svg/transform/cat_ears.svg',
      dolPngPath: '/transformations/cat/ears/default.png',
    },
    {
      id: 'transform_cat_tail',
      type: 'transform_tail',
      name: 'Cat Tail',
      zIndex: 8,
      variants: ['idle', 'flaunt', 'cover'],
      hasAnimation: true,
      localSvgPath: '/svg/transform/cat_tail.svg',
      dolPngPath: '/transformations/cat/tail-idle/default.png',
    },
    {
      id: 'transform_wolf_ears',
      type: 'transform_ears',
      name: 'Wolf Ears',
      zIndex: 110,
      variants: ['default'],
      hasAnimation: false,
      localSvgPath: '/svg/transform/wolf_ears.svg',
      dolPngPath: '/transformations/wolf/ears/default.png',
    },
    {
      id: 'transform_wolf_tail',
      type: 'transform_tail',
      name: 'Wolf Tail',
      zIndex: 8,
      variants: ['idle', 'flaunt'],
      hasAnimation: true,
      localSvgPath: '/svg/transform/wolf_tail.svg',
      dolPngPath: '/transformations/wolf/tail-idle/default.png',
    },
    {
      id: 'transform_demon_horns',
      type: 'transform_horns',
      name: 'Demon Horns',
      zIndex: 115,
      variants: ['default'],
      hasAnimation: false,
      localSvgPath: '/svg/transform/demon_horns.svg',
      dolPngPath: '/transformations/demon/horns/default.png',
    },
    {
      id: 'transform_demon_wings',
      type: 'transform_wings',
      name: 'Demon Wings',
      zIndex: 3,
      variants: ['idle', 'flaunt', 'cover'],
      hasAnimation: true,
      localSvgPath: '/svg/transform/demon_wings.svg',
      dolPngPath: '/transformations/demon/wings-idle/default.png',
    },
    {
      id: 'transform_demon_tail',
      type: 'transform_tail',
      name: 'Demon Tail',
      zIndex: 8,
      variants: ['idle', 'flaunt'],
      hasAnimation: true,
      localSvgPath: '/svg/transform/demon_tail.svg',
      dolPngPath: '/transformations/demon/tail-idle/default.png',
    },
    {
      id: 'transform_angel_wings',
      type: 'transform_wings',
      name: 'Angel Wings',
      zIndex: 3,
      variants: ['idle', 'flaunt'],
      hasAnimation: true,
      localSvgPath: '/svg/transform/angel_wings.svg',
      dolPngPath: '/transformations/angel/wings-idle/default.png',
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
      localSvgPath: '/svg/bodywriting/heart.svg',
      dolPngPath: '/bodywriting/heart/default.png',
    },
  ],
};

// Helper functions
export function getAssetUrl(
  layer: AssetLayer, 
  variant: string, 
  source: AssetSource = 'local_svg'
): string | null {
  switch (source) {
    case 'local_svg':
      return layer.localSvgPath || null;
    case 'dol_png':
      if (!layer.dolPngPath) return null;
      return `${DOL_ASSET_BASE_URL}${layer.dolPngPath.replace('/default', `/${variant}`)}`;
    case 'dol_gif':
      if (!layer.dolGifPath) return null;
      return `${DOL_ASSET_BASE_URL}${layer.dolGifPath.replace('/default', `/${variant}`)}`;
    default:
      return null;
  }
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

export function getLayersWithLocalSVG(): AssetLayer[] {
  return Object.values(DOL_ASSET_REGISTRY).flat().filter(layer => layer.localSvgPath);
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
