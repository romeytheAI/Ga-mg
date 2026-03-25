import { Item, CosmeticScar, CosmeticTattoo, CosmeticPiercing } from '../../../types';
import { RacialBodyFeatures } from '../../../data/races';

export const SLOT_COLORS: Record<string, { fill: string; stroke: string }> = {
  head:      { fill: '#7a5030', stroke: '#9a6840' },
  neck:      { fill: '#3a6878', stroke: '#4a7c8c' },
  shoulders: { fill: '#2d4870', stroke: '#3d5888' },
  chest:     { fill: '#1e3860', stroke: '#2e4878' },
  underwear: { fill: '#6a2860', stroke: '#8a3878' },
  legs:      { fill: '#2a4a2a', stroke: '#3a6a3a' },
  feet:      { fill: '#4a3818', stroke: '#6a5828' },
  hands:     { fill: '#282848', stroke: '#383860' },
  waist:     { fill: '#4a2828', stroke: '#6a3838' },
};

export function integrityStyle(item: Item | null): { op: number; torn: boolean } {
  if (!item) return { op: 0, torn: false };
  const v = item.integrity ?? 100;
  if (v > 70) return { op: 0.88, torn: false };
  if (v > 40) return { op: 0.65, torn: true };
  if (v > 10) return { op: 0.38, torn: true };
  return { op: 0, torn: true };
}

export interface BodyGeom {
  heightScale: number;
  headRX: number;
  headRY: number;
  shoulderHW: number;
  waistHW: number;
  hipHW: number;
  bustR: number;
  bustY: number;
  upperArmW: number;
  forearmW: number;
  handW: number;
  handH: number;
  shoulderOutset: number;
  elbowOutset: number;
  wristOutset: number;
  thighW: number;
  calfW: number;
  footW: number;
  footH: number;
  legSpread: number;
  showPecs: boolean;
  jawW: number;
  bustSize: number;
  showAdamsApple: boolean;
  showBodyHair: boolean;
  showMuscleDef: boolean;
  navelY: number;
}

export function buildBodyGeom(gender: string, raceDef: RacialBodyFeatures): BodyGeom {
  const isFemale = gender === 'female';
  const isMale   = gender === 'male';

  const bm: Record<string, [number, number]> = {
    wiry:     [0.80, 0.80],
    slim:     [0.88, 0.88],
    average:  [1.00, 1.00],
    athletic: [1.08, 1.06],
    stocky:   [1.14, 1.12],
    muscular: [1.22, 1.10],
    heavy:    [1.32, 1.20],
  };
  const [wm, lm] = bm[raceDef.build] || [1, 1];

  const shoulderHW = (isMale ? 23 : isFemale ? 17 : 20) * wm;
  const waistHW    = (isMale ? 15 : isFemale ? 11 : 13) * wm;
  const hipHW      = (isMale ? 17 : isFemale ? 21 : 19) * wm;
  const bustR      = isFemale ? (5 + (raceDef.build === 'heavy' ? 2 : 0)) * wm : 0;

  const headRX = (isMale ? 11.5 : 10.5) * wm;
  const headRY = isMale ? 13 : 12.5;

  const upperArmW      = (isMale ? 6.5 : isFemale ? 4.5 : 5.5) * lm;
  const forearmW       = (isMale ? 5.5 : isFemale ? 4.0 : 4.8) * lm;
  const handW          = (isMale ? 9 : isFemale ? 7.5 : 8) * lm;
  const handH          = (isMale ? 8 : isFemale ? 7 : 7.5) * lm;
  const shoulderOutset = isMale ? 2 : isFemale ? 1 : 1.5;
  const elbowOutset    = isMale ? 5 : isFemale ? 3 : 4;
  const wristOutset    = isMale ? 7 : isFemale ? 5 : 6;

  const thighW  = (isMale ? 10 : isFemale ? 11 : 10.5) * lm;
  const calfW   = 8 * lm;
  const footW   = (isMale ? 13 : isFemale ? 11 : 12) * lm;
  const footH   = isMale ? 7 : 6.5;
  const legSpread = hipHW * 0.60;

  const hScaleMap: Record<string, number> = {
    Altmer: 1.12, Nord: 1.08, Orsimer: 1.06,
    Redguard: 1.02, Imperial: 1.00, Argonian: 0.98, Dunmer: 0.97,
    Khajiit: 0.95, Breton: 0.92, Bosmer: 0.88,
  };
  const heightScale = hScaleMap[raceDef.name] || 1.0;

  const bustSize = isFemale
    ? (['wiry', 'slim'].includes(raceDef.build) ? 1
      : ['heavy', 'stocky'].includes(raceDef.build) ? 3
      : 2)
    : 0;

  return {
    heightScale, headRX, headRY,
    shoulderHW, waistHW, hipHW,
    bustR, bustY: 67,
    upperArmW, forearmW, handW, handH,
    shoulderOutset, elbowOutset, wristOutset,
    thighW, calfW, footW, footH, legSpread,
    showPecs: isMale && raceDef.build !== 'slim' && raceDef.build !== 'wiry',
    jawW: isMale ? 2.5 : isFemale ? 0 : 1,
    bustSize,
    showAdamsApple: isMale,
    showBodyHair: isMale && ['muscular', 'heavy', 'athletic', 'stocky'].includes(raceDef.build),
    showMuscleDef: ['muscular', 'athletic', 'heavy', 'stocky'].includes(raceDef.build),
    navelY: 88,
  };
}

export function resolveSkinColor(raceDef: RacialBodyFeatures, cosmeticTone: string): string {
  const manual: Record<string, string> = {
    pale: '#f0e8d8', fair: '#f4d5b0', tan: '#c8956a',
    olive: '#b8a060', dark: '#6b3d2e', ebony: '#3d1e12',
    grey: '#8a9090', ash: '#9a9898', gold: '#d4bc60',
    green: '#4a6a30', blue: '#6090b0', brown: '#7a5030', spotted: '#c8a878',
  };
  if (manual[cosmeticTone]) return manual[cosmeticTone];
  return raceDef.skin_colors[0] || '#f4d5b0';
}

export function resolveEyeColor(raceDef: RacialBodyFeatures, cosmeticEye: string): string {
  const manual: Record<string, string> = {
    blue: '#5580cc', green: '#3a8a4a', brown: '#6a4a2a', hazel: '#7a6a3a',
    grey: '#7a7a8a', violet: '#8a4a9a', silver: '#9a9aaa', gold: '#c8a030',
    red: '#cc2020', amber: '#c8a020', orange: '#d07030', cyan: '#20a0b0',
  };
  if (manual[cosmeticEye]) return manual[cosmeticEye];
  return raceDef.eye_colors[0] || '#5580cc';
}

export function resolveHairColor(raceDef: RacialBodyFeatures, cosmeticHair: string): string {
  if (!raceDef.hair_colors) return 'transparent';
  const manual: Record<string, string> = {
    black: '#1a1a1a', brown: '#5a3a1a', blonde: '#d4a843', red: '#8b2a0a',
    white: '#e8e8e8', silver: '#b0b0c0', blue: '#1a4a8b', purple: '#6a2a8b',
    grey: '#888890', auburn: '#7a2a10', gold: '#c8a020',
  };
  return manual[cosmeticHair] || raceDef.hair_colors[0] || '#5a3a1a';
}

export const EXPOSURE_INTEGRITY_THRESHOLD = 10;
export const AROUSAL_BLUSH_WEIGHT  = 0.6;
export const STRESS_BLUSH_WEIGHT   = 0.15;
export const MAX_BODY_WRITING_CHARS = 12;

export function normalizeScar(s: string | CosmeticScar): CosmeticScar {
  return typeof s === 'string' ? { location: 'chest', type: 'slash' } : s;
}
export function normalizeTattoo(t: string | CosmeticTattoo): CosmeticTattoo {
  if (typeof t === 'string') return { location: 'arms', design: t };
  return { location: t.location || 'arms', ...t };
}
export function normalizePiercing(p: string | CosmeticPiercing): CosmeticPiercing {
  return typeof p === 'string' ? { location: 'ear_left' } : p;
}

export function getNippleColor(skinHex: string, skinType: string): string {
  if (skinType === 'fur') return '#8a5828';
  if (skinType === 'scales') return '#5a6828';
  const map: Record<string, string> = {
    '#f4d5b0': '#d4836a',
    '#f0e8d8': '#c87860',
    '#c8956a': '#a85840',
    '#b8a060': '#9a6840',
    '#d4bc60': '#b89048',
    '#8a9090': '#808888',
    '#6b3d2e': '#8a4030',
    '#3d1e12': '#6a2820',
    '#4a6a30': '#3a5828',
    '#c8a878': '#a07858',
  };
  return map[skinHex] || '#c07868';
}

export interface SpriteState {
  cx: number;
  headCY: number;
  neckTopY: number;
  neckBotY: number;
  shldY: number;
  waistY: number;
  hipTopY: number;
  crotchY: number;
  kneeY: number;
  ankleY: number;
  footBotY: number;
  shLX: number;
  shRX: number;
  elLX: number;
  elRX: number;
  elY: number;
  wrLX: number;
  wrRX: number;
  wrY: number;
  handCY: number;
  legLX: number;
  legRX: number;
  isDigi: boolean;
  digiKneeY: number;
  digiAnkleY: number;
}
