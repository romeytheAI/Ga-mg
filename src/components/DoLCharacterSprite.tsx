import React from 'react';
import { motion } from 'motion/react';
import { GameState, Item } from '../types';
import { resolveRace, RacialBodyFeatures } from '../data/races';

interface DoLCharacterSpriteProps {
  state: GameState;
  compact?: boolean;
}

const SLOT_COLORS: Record<string, { fill: string; stroke: string }> = {
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

function integrityStyle(item: Item | null): { op: number; torn: boolean } {
  if (!item) return { op: 0, torn: false };
  const v = item.integrity ?? 100;
  if (v > 70) return { op: 0.88, torn: false };
  if (v > 40) return { op: 0.65, torn: true };
  if (v > 10) return { op: 0.38, torn: true };
  return { op: 0, torn: true };
}

interface BodyGeom {
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
  // Extended anatomy
  bustSize: number;        // 0=none/male, 1=small, 2=medium, 3=large
  showAdamsApple: boolean;
  showBodyHair: boolean;   // male chest/leg hair
  showMuscleDef: boolean;  // visible muscle definition lines
  navelY: number;          // Y coordinate of navel
}

function buildBodyGeom(gender: string, raceDef: RacialBodyFeatures): BodyGeom {
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

function resolveSkinColor(raceDef: RacialBodyFeatures, cosmeticTone: string): string {
  const manual: Record<string, string> = {
    pale: '#f0e8d8', fair: '#f4d5b0', tan: '#c8956a',
    olive: '#b8a060', dark: '#6b3d2e', ebony: '#3d1e12',
    grey: '#8a9090', ash: '#9a9898', gold: '#d4bc60',
    green: '#4a6a30', blue: '#6090b0', brown: '#7a5030', spotted: '#c8a878',
  };
  if (manual[cosmeticTone]) return manual[cosmeticTone];
  return raceDef.skin_colors[0] || '#f4d5b0';
}

function resolveEyeColor(raceDef: RacialBodyFeatures, cosmeticEye: string): string {
  const manual: Record<string, string> = {
    blue: '#5580cc', green: '#3a8a4a', brown: '#6a4a2a', hazel: '#7a6a3a',
    grey: '#7a7a8a', violet: '#8a4a9a', silver: '#9a9aaa', gold: '#c8a030',
    red: '#cc2020', amber: '#c8a020', orange: '#d07030', cyan: '#20a0b0',
  };
  if (manual[cosmeticEye]) return manual[cosmeticEye];
  return raceDef.eye_colors[0] || '#5580cc';
}

function resolveHairColor(raceDef: RacialBodyFeatures, cosmeticHair: string): string {
  if (!raceDef.hair_colors) return 'transparent';
  const manual: Record<string, string> = {
    black: '#1a1a1a', brown: '#5a3a1a', blonde: '#d4a843', red: '#8b2a0a',
    white: '#e8e8e8', silver: '#b0b0c0', blue: '#1a4a8b', purple: '#6a2a8b',
    grey: '#888890', auburn: '#7a2a10', gold: '#c8a020',
  };
  return manual[cosmeticHair] || raceDef.hair_colors[0] || '#5a3a1a';
}

// Integrity threshold below which a clothing slot is considered "destroyed / not covering"
const EXPOSURE_INTEGRITY_THRESHOLD = 10;
function getNippleColor(skinHex: string, skinType: string): string {
  if (skinType === 'fur') return '#8a5828';   // muted for Khajiit
  if (skinType === 'scales') return '#5a6828'; // muted for Argonian
  const map: Record<string, string> = {
    '#f4d5b0': '#d4836a',
    '#f0e8d8': '#c87860',
    '#c8956a': '#a85840',
    '#b8a060': '#9a6840',
    '#d4bc60': '#b89048', // Altmer gold
    '#8a9090': '#808888', // Dunmer ash
    '#6b3d2e': '#8a4030',
    '#3d1e12': '#6a2820',
    '#4a6a30': '#3a5828', // Argonian green
    '#c8a878': '#a07858', // Khajiit tan
  };
  return map[skinHex] || '#c07868';
}

export const DoLCharacterSprite: React.FC<DoLCharacterSpriteProps> = ({ state, compact = false }) => {
  const { clothing, identity, cosmetics, stats, biology } = state.player;
  const raceDef   = resolveRace(identity.race);
  const gender    = identity.gender || 'female';
  const geom      = buildBodyGeom(gender, raceDef);
  const skin      = resolveSkinColor(raceDef, cosmetics?.skin_tone || '');
  const eyeClr    = resolveEyeColor(raceDef, cosmetics?.eye_color || '');
  const hairClr   = resolveHairColor(raceDef, cosmetics?.hair_color || '');
  const accentClr = raceDef.accent_colors[0] || skin;

  const hasExposure  = !clothing.chest && !clothing.underwear;
  const arousalHigh  = stats.arousal > 40 || stats.lust > 50;
  const corruption   = stats.corruption > 60;
  const lowHealth    = stats.health < 35;

  // Y-axis anchors (viewBox 0 0 100 225)
  const cx = 50;
  const headCY  = 21;
  const neckTopY = headCY + geom.headRY;
  const neckBotY = neckTopY + 9;
  const shldY    = neckBotY + 1;
  const waistY   = 98;
  const hipTopY  = 104;
  const crotchY  = 120;
  const kneeY    = 160;
  const ankleY   = 196;
  const footBotY = 206;

  // Arm X positions
  const shLX = cx - geom.shoulderHW - geom.shoulderOutset;
  const shRX = cx + geom.shoulderHW + geom.shoulderOutset;
  const elLX = cx - geom.shoulderHW - geom.elbowOutset;
  const elRX = cx + geom.shoulderHW + geom.elbowOutset;
  const elY  = shldY + 40;
  const wrLX = cx - geom.shoulderHW - geom.wristOutset;
  const wrRX = cx + geom.shoulderHW + geom.wristOutset;
  const wrY  = elY + 28;
  const handCY = wrY + geom.handH / 2;

  // Leg X positions
  const legLX = cx - geom.legSpread;
  const legRX = cx + geom.legSpread;

  // Digitigrade (Khajiit)
  const isDigi     = raceDef.leg_type === 'digitigrade';
  const digiKneeY  = kneeY - 18;
  const digiAnkleY = ankleY - 12;

  const bodyFilter = corruption ? 'hue-rotate(270deg) saturate(1.3)'
    : arousalHigh ? 'hue-rotate(-12deg) saturate(1.2)' : undefined;

  // ── Gender / anatomy state ───────────────────────────────────────────────
  const isMale   = gender === 'male';
  const isFemale = gender === 'female';
  // Chest exposed when slot is empty OR clothing integrity fully destroyed
  const isChestExposed   = !clothing.chest   || (clothing.chest.integrity   ?? 100) <= EXPOSURE_INTEGRITY_THRESHOLD;
  const isGroinExposed   = !clothing.underwear || (clothing.underwear.integrity ?? 100) <= EXPOSURE_INTEGRITY_THRESHOLD;
  const nippleClr        = getNippleColor(skin, raceDef.skin_type);
  const isLactating      = biology.lactation_level > 0;
  const isAroused        = stats.arousal > 50 || stats.lust > 60;
  // Pregnancy bump (0–1) derived from incubations tagged with "preg"
  const pregnancyBump    = biology.incubations
    .filter(i => i.type.toLowerCase().includes('preg'))
    .reduce((max, i) => Math.max(max, i.progress / 100), 0);

  const svgH = compact ? 144 : 225;
  const svgW = compact ? 80  : 100;

  // Torn clothing mark helper (inline)
  const tornMark = (x: number, y: number, key: string) => (
    <line key={key} x1={x} y1={y} x2={x + 4} y2={y + 8}
      stroke={skin} strokeWidth="1.2" opacity="0.45" />
  );

  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.svg
        viewBox="0 0 100 225"
        width={svgW} height={svgH}
        style={{ filter: bodyFilter, overflow: 'visible' }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* ── TAIL (Khajiit / Argonian, drawn behind body) ── */}
        {raceDef.has_tail && raceDef.special_features.includes('tail_thick') && (
          <path d={`M ${cx+4},${crotchY} Q ${cx+28},${crotchY+20} ${cx+38},${crotchY+55}`}
            fill="none" stroke={skin} strokeWidth="8" strokeLinecap="round" />
        )}
        {raceDef.has_tail && raceDef.special_features.includes('tail_thin') && (
          <>
            <path d={`M ${cx+3},${crotchY+2} Q ${cx+32},${crotchY+8} ${cx+44},${crotchY+45} Q ${cx+50},${crotchY+65} ${cx+38},${crotchY+78}`}
              fill="none" stroke={skin} strokeWidth="4.5" strokeLinecap="round" />
            <path d={`M ${cx+3},${crotchY+2} Q ${cx+32},${crotchY+8} ${cx+44},${crotchY+45}`}
              fill="none" stroke={accentClr} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          </>
        )}

        {/* ── LEGS ── */}
        {isDigi ? (
          <>
            {/* Khajiit digitigrade – left */}
            <rect x={legLX - geom.thighW/2} y={crotchY} width={geom.thighW} height={digiKneeY - crotchY} rx="4" fill={skin} />
            <line x1={legLX} y1={digiKneeY} x2={legLX - 7} y2={digiAnkleY} stroke={skin} strokeWidth={geom.calfW} strokeLinecap="round" />
            <line x1={legLX - 7} y1={digiAnkleY} x2={legLX - 4} y2={footBotY - 8} stroke={skin} strokeWidth={geom.calfW * 0.8} strokeLinecap="round" />
            <ellipse cx={legLX - 2} cy={footBotY - 5} rx={geom.footW * 0.55} ry={geom.footH * 0.75} fill={skin} />
            {/* Khajiit digitigrade – right */}
            <rect x={legRX - geom.thighW/2} y={crotchY} width={geom.thighW} height={digiKneeY - crotchY} rx="4" fill={skin} />
            <line x1={legRX} y1={digiKneeY} x2={legRX + 7} y2={digiAnkleY} stroke={skin} strokeWidth={geom.calfW} strokeLinecap="round" />
            <line x1={legRX + 7} y1={digiAnkleY} x2={legRX + 4} y2={footBotY - 8} stroke={skin} strokeWidth={geom.calfW * 0.8} strokeLinecap="round" />
            <ellipse cx={legRX + 2} cy={footBotY - 5} rx={geom.footW * 0.55} ry={geom.footH * 0.75} fill={skin} />
          </>
        ) : (
          <>
            {/* Standard plantigrade legs – left */}
            <rect x={legLX - geom.thighW/2} y={crotchY} width={geom.thighW} height={kneeY - crotchY} rx="5" fill={skin} />
            <ellipse cx={legLX} cy={kneeY} rx={geom.thighW * 0.52} ry="5" fill={skin} />
            <path d={`M ${legLX - geom.calfW/2},${kneeY} C ${legLX - geom.calfW/2 - 1},${kneeY+20} ${legLX - geom.calfW/2 - 1},${ankleY-10} ${legLX - geom.calfW/2 + 2},${ankleY} L ${legLX + geom.calfW/2 - 2},${ankleY} C ${legLX + geom.calfW/2 + 1},${ankleY-10} ${legLX + geom.calfW/2 + 1},${kneeY+20} ${legLX + geom.calfW/2},${kneeY} Z`} fill={skin} />
            <ellipse cx={legLX + geom.footW * 0.1} cy={footBotY - geom.footH/2} rx={geom.footW/2} ry={geom.footH/2} fill={skin} />
            {/* Right leg */}
            <rect x={legRX - geom.thighW/2} y={crotchY} width={geom.thighW} height={kneeY - crotchY} rx="5" fill={skin} />
            <ellipse cx={legRX} cy={kneeY} rx={geom.thighW * 0.52} ry="5" fill={skin} />
            <path d={`M ${legRX - geom.calfW/2},${kneeY} C ${legRX - geom.calfW/2 - 1},${kneeY+20} ${legRX - geom.calfW/2 - 1},${ankleY-10} ${legRX - geom.calfW/2 + 2},${ankleY} L ${legRX + geom.calfW/2 - 2},${ankleY} C ${legRX + geom.calfW/2 + 1},${ankleY-10} ${legRX + geom.calfW/2 + 1},${kneeY+20} ${legRX + geom.calfW/2},${kneeY} Z`} fill={skin} />
            <ellipse cx={legRX + geom.footW * 0.1} cy={footBotY - geom.footH/2} rx={geom.footW/2} ry={geom.footH/2} fill={skin} />
          </>
        )}

        {/* Foot claws */}
        {(raceDef.foot_type === 'clawed' || raceDef.foot_type === 'pawed_digitigrade') && (
          <g>
            {[-5, 0, 5].map((dx, i) => (
              <line key={`clf-${i}`} x1={legLX + dx} y1={footBotY - 2} x2={legLX + dx - 1.5} y2={footBotY + 5} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
            ))}
            {[-5, 0, 5].map((dx, i) => (
              <line key={`crf-${i}`} x1={legRX + dx} y1={footBotY - 2} x2={legRX + dx + 1.5} y2={footBotY + 5} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
            ))}
          </g>
        )}

        {/* ── TORSO (shoulder → waist) ── */}
        <path d={`M ${cx - geom.shoulderHW},${shldY} C ${cx - geom.shoulderHW - 1},${shldY + 22} ${cx - geom.waistHW - 1},${waistY - 14} ${cx - geom.waistHW},${waistY} L ${cx + geom.waistHW},${waistY} C ${cx + geom.waistHW + 1},${waistY - 14} ${cx + geom.shoulderHW + 1},${shldY + 22} ${cx + geom.shoulderHW},${shldY} Z`} fill={skin} />
        {/* Abdomen (waist → hip) */}
        <path d={`M ${cx - geom.waistHW},${waistY} C ${cx - geom.waistHW - 1},${hipTopY - 5} ${cx - geom.hipHW - 1},${hipTopY + 2} ${cx - geom.hipHW},${hipTopY} L ${cx + geom.hipHW},${hipTopY} C ${cx + geom.hipHW + 1},${hipTopY + 2} ${cx + geom.waistHW + 1},${hipTopY - 5} ${cx + geom.waistHW},${waistY} Z`} fill={skin} />
        {/* Pelvis */}
        <path d={`M ${cx - geom.hipHW},${hipTopY} L ${cx + geom.hipHW},${hipTopY} C ${cx + geom.hipHW + 2},${crotchY - 4} ${legRX + geom.thighW/2},${crotchY} L ${legLX - geom.thighW/2},${crotchY} C ${cx - geom.hipHW - 2},${crotchY - 4} ${cx - geom.hipHW},${hipTopY} Z`} fill={skin} />

        {/* ── PREGNANCY BELLY OVERLAY ── */}
        {pregnancyBump > 0 && (
          <ellipse
            cx={cx} cy={waistY - 2 + pregnancyBump * 12}
            rx={geom.waistHW + pregnancyBump * 14}
            ry={pregnancyBump * 18}
            fill={skin}
          />
        )}

        {/* ── NAVEL ── */}
        {isChestExposed && (
          <circle cx={cx} cy={geom.navelY} r="1.3" fill={`${skin}60`} />
        )}

        {/* Female bust */}
        {geom.bustR > 0 && isChestExposed && (
          <>
            <ellipse cx={cx - geom.shoulderHW * 0.38} cy={geom.bustY} rx={geom.bustR} ry={geom.bustR * 0.82} fill={skin} />
            <ellipse cx={cx + geom.shoulderHW * 0.38} cy={geom.bustY} rx={geom.bustR} ry={geom.bustR * 0.82} fill={skin} />
          </>
        )}
        {/* Male pec lines */}
        {geom.showPecs && isChestExposed && (
          <>
            <path d={`M ${cx-3},${shldY+12} Q ${cx - geom.shoulderHW * 0.65},${shldY+22} ${cx-3},${shldY+28}`} fill="none" stroke={`${skin}88`} strokeWidth="0.8" />
            <path d={`M ${cx+3},${shldY+12} Q ${cx + geom.shoulderHW * 0.65},${shldY+22} ${cx+3},${shldY+28}`} fill="none" stroke={`${skin}88`} strokeWidth="0.8" />
          </>
        )}

        {/* ── COLLARBONE (when chest exposed) ── */}
        {isChestExposed && (
          <>
            <path d={`M ${cx - 1},${shldY + 2} Q ${cx - geom.shoulderHW * 0.65},${shldY - 2} ${cx - geom.shoulderHW * 0.92},${shldY + 3}`}
              fill="none" stroke={`${skin}55`} strokeWidth={isMale ? '1.1' : '0.75'} strokeLinecap="round" />
            <path d={`M ${cx + 1},${shldY + 2} Q ${cx + geom.shoulderHW * 0.65},${shldY - 2} ${cx + geom.shoulderHW * 0.92},${shldY + 3}`}
              fill="none" stroke={`${skin}55`} strokeWidth={isMale ? '1.1' : '0.75'} strokeLinecap="round" />
          </>
        )}

        {/* ── FEMALE NIPPLES (when chest exposed) ── */}
        {isChestExposed && isFemale && geom.bustR > 0 && (
          <>
            {/* Left areola + nipple */}
            <circle cx={cx - geom.shoulderHW * 0.38} cy={geom.bustY}
              r={geom.bustR * 0.32} fill={`${skin}aa`} />
            <circle cx={cx - geom.shoulderHW * 0.38} cy={geom.bustY}
              r={isAroused ? geom.bustR * 0.18 : geom.bustR * 0.13}
              fill={nippleClr} />
            {/* Right areola + nipple */}
            <circle cx={cx + geom.shoulderHW * 0.38} cy={geom.bustY}
              r={geom.bustR * 0.32} fill={`${skin}aa`} />
            <circle cx={cx + geom.shoulderHW * 0.38} cy={geom.bustY}
              r={isAroused ? geom.bustR * 0.18 : geom.bustR * 0.13}
              fill={nippleClr} />
            {/* Lactation drip marks */}
            {isLactating && (
              <>
                <ellipse cx={cx - geom.shoulderHW * 0.38}
                  cy={geom.bustY + geom.bustR * 0.5} rx="0.7" ry="1.5"
                  fill="rgba(255,255,255,0.30)" />
                <ellipse cx={cx + geom.shoulderHW * 0.38}
                  cy={geom.bustY + geom.bustR * 0.5} rx="0.7" ry="1.5"
                  fill="rgba(255,255,255,0.30)" />
              </>
            )}
          </>
        )}

        {/* ── MALE NIPPLES (when chest exposed) ── */}
        {isChestExposed && isMale && (
          <>
            <circle cx={cx - geom.shoulderHW * 0.42} cy={shldY + 20} r="1.0" fill={nippleClr} />
            <circle cx={cx + geom.shoulderHW * 0.42} cy={shldY + 20} r="1.0" fill={nippleClr} />
          </>
        )}

        {/* ── MALE BODY HAIR (chest & torso, when exposed) ── */}
        {isChestExposed && geom.showBodyHair && raceDef.skin_type === 'skin' && (
          <g opacity="0.18">
            {/* Chest scatter */}
            {([-4, -2, 0, 2, 4] as const).map((dx, i) => (
              <circle key={`ch-${i}`}
                cx={cx + dx * 2.2} cy={shldY + 24 + (Math.abs(dx) % 2) * 4}
                r="0.75" fill={hairClr} />
            ))}
            <circle cx={cx} cy={shldY + 34} r="0.7" fill={hairClr} />
            {/* Happy trail */}
            {[0, 1, 2].map((dy, i) => (
              <circle key={`ht-${i}`} cx={cx} cy={waistY - 22 + dy * 6} r="0.55" fill={hairClr} />
            ))}
          </g>
        )}

        {/* ── ARMS ── */}
        {/* Left upper arm */}
        <path d={`M ${shLX - geom.upperArmW/2},${shldY} L ${elLX - geom.upperArmW/2 - 1},${elY} L ${elLX + geom.upperArmW/2 - 1},${elY} L ${shLX + geom.upperArmW/2},${shldY} Z`} fill={skin} />
        <ellipse cx={elLX} cy={elY} rx={geom.upperArmW * 0.5} ry="4" fill={skin} />
        <path d={`M ${elLX - geom.forearmW/2 - 1},${elY} L ${wrLX - geom.forearmW/2},${wrY} L ${wrLX + geom.forearmW/2},${wrY} L ${elLX + geom.forearmW/2 - 1},${elY} Z`} fill={skin} />
        <ellipse cx={wrLX} cy={handCY} rx={geom.handW/2} ry={geom.handH/2} fill={skin} />
        {/* Right upper arm */}
        <path d={`M ${shRX - geom.upperArmW/2},${shldY} L ${elRX - geom.upperArmW/2 + 1},${elY} L ${elRX + geom.upperArmW/2 + 1},${elY} L ${shRX + geom.upperArmW/2},${shldY} Z`} fill={skin} />
        <ellipse cx={elRX} cy={elY} rx={geom.upperArmW * 0.5} ry="4" fill={skin} />
        <path d={`M ${elRX - geom.forearmW/2 + 1},${elY} L ${wrRX - geom.forearmW/2},${wrY} L ${wrRX + geom.forearmW/2},${wrY} L ${elRX + geom.forearmW/2 + 1},${elY} Z`} fill={skin} />
        <ellipse cx={wrRX} cy={handCY} rx={geom.handW/2} ry={geom.handH/2} fill={skin} />

        {/* Hand claws */}
        {(raceDef.hand_type !== 'human') && (
          <g>
            {[-4, -1.5, 1, 3.5].map((dx, i) => (
              <line key={`clhl-${i}`} x1={wrLX + dx} y1={handCY + geom.handH/2 - 1} x2={wrLX + dx - 1.5} y2={handCY + geom.handH/2 + 4} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
            ))}
            {[-3.5, -1, 1.5, 4].map((dx, i) => (
              <line key={`clhr-${i}`} x1={wrRX + dx} y1={handCY + geom.handH/2 - 1} x2={wrRX + dx + 1.5} y2={handCY + geom.handH/2 + 4} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
            ))}
          </g>
        )}

        {/* ── MUSCLE DEFINITION (arms) ── */}
        {geom.showMuscleDef && !clothing.shoulders && (
          <g>
            {/* Left bicep curve */}
            <path d={`M ${shLX - geom.upperArmW * 0.25},${shldY + 8} Q ${shLX - geom.upperArmW * 0.55},${shldY + 22} ${shLX - geom.upperArmW * 0.25},${shldY + 34}`}
              fill="none" stroke={`${skin}48`} strokeWidth="0.85" strokeLinecap="round" />
            {/* Right bicep curve */}
            <path d={`M ${shRX + geom.upperArmW * 0.25},${shldY + 8} Q ${shRX + geom.upperArmW * 0.55},${shldY + 22} ${shRX + geom.upperArmW * 0.25},${shldY + 34}`}
              fill="none" stroke={`${skin}48`} strokeWidth="0.85" strokeLinecap="round" />
          </g>
        )}
        {/* Muscle definition (torso centre line) */}
        {geom.showMuscleDef && isChestExposed && (
          <path d={`M ${cx},${shldY + 6} L ${cx},${waistY - 4}`}
            fill="none" stroke={`${skin}38`} strokeWidth="0.7" />
        )}

        {/* ── NECK ── */}
        <rect x={cx - geom.headRX * 0.48} y={neckTopY} width={geom.headRX * 0.96} height={neckBotY - neckTopY + 1} fill={skin} />

        {/* Adam's apple (male) */}
        {geom.showAdamsApple && (
          <ellipse cx={cx} cy={neckTopY + 4} rx="2" ry="1.6" fill={`${skin}88`} />
        )}

        {/* ── HEAD ── */}
        <ellipse cx={cx} cy={headCY} rx={geom.headRX} ry={geom.headRY} fill={skin} />
        {/* Chin shape (squarer for male) */}
        <path d={`M ${cx - geom.headRX * 0.78},${headCY + geom.headRY * 0.45} Q ${cx - geom.headRX * 0.6 - geom.jawW},${headCY + geom.headRY + 1} ${cx},${headCY + geom.headRY + 1.5} Q ${cx + geom.headRX * 0.6 + geom.jawW},${headCY + geom.headRY + 1} ${cx + geom.headRX * 0.78},${headCY + geom.headRY * 0.45} Z`} fill={skin} />

        {/* Lizard snout (Argonian) */}
        {raceDef.has_muzzle && raceDef.special_features.includes('muzzle_lizard') && (
          <path d={`M ${cx-6},${headCY+2} Q ${cx},${headCY+10} ${cx},${headCY+14} Q ${cx},${headCY+10} ${cx+6},${headCY+2} Z`} fill={skin} stroke={accentClr} strokeWidth="0.5" />
        )}
        {/* Cat muzzle (Khajiit) */}
        {raceDef.has_muzzle && raceDef.special_features.includes('muzzle_cat') && (
          <ellipse cx={cx} cy={headCY + 6} rx="5.5" ry="4" fill={skin} />
        )}

        {/* ── EYES ── */}
        {raceDef.eye_shape === 'reptilian' ? (
          <>
            <ellipse cx={cx - 5} cy={headCY} rx="3.8" ry="3" fill="white" />
            <ellipse cx={cx + 5} cy={headCY} rx="3.8" ry="3" fill="white" />
            <ellipse cx={cx - 5} cy={headCY} rx="1.1" ry="2.5" fill={eyeClr} />
            <ellipse cx={cx + 5} cy={headCY} rx="1.1" ry="2.5" fill={eyeClr} />
          </>
        ) : raceDef.eye_shape === 'slit_pupil' ? (
          <>
            <ellipse cx={cx - 5} cy={headCY} rx="3.8" ry="3" fill="white" />
            <ellipse cx={cx + 5} cy={headCY} rx="3.8" ry="3" fill="white" />
            <ellipse cx={cx - 5} cy={headCY} rx="2.5" ry="2.8" fill={eyeClr} />
            <ellipse cx={cx + 5} cy={headCY} rx="2.5" ry="2.8" fill={eyeClr} />
            <ellipse cx={cx - 5} cy={headCY} rx="0.7" ry="2.2" fill="#111" />
            <ellipse cx={cx + 5} cy={headCY} rx="0.7" ry="2.2" fill="#111" />
          </>
        ) : (
          <>
            <ellipse cx={cx - 4.5} cy={headCY} rx="3.5" ry={geom.headRY * 0.22} fill="white" />
            <ellipse cx={cx + 4.5} cy={headCY} rx="3.5" ry={geom.headRY * 0.22} fill="white" />
            <circle cx={cx - 4.5} cy={headCY} r="2" fill={eyeClr} />
            <circle cx={cx + 4.5} cy={headCY} r="2" fill={eyeClr} />
            <circle cx={cx - 3.8} cy={headCY - 0.5} r="0.55" fill="white" />
            <circle cx={cx + 5.2} cy={headCY - 0.5} r="0.55" fill="white" />
          </>
        )}

        {/* Heavy brow (Orc) */}
        {raceDef.has_heavy_brow && (
          <path d={`M ${cx-9},${headCY-3.5} Q ${cx},${headCY-6} ${cx+9},${headCY-3.5}`} fill={skin} stroke={`${accentClr}80`} strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Tusks (Orc) */}
        {raceDef.has_tusks && (
          <>
            <path d={`M ${cx-4},${headCY + geom.headRY - 2} Q ${cx-6},${headCY + geom.headRY + 8} ${cx-3},${headCY + geom.headRY + 10}`} fill="none" stroke="#d4c080" strokeWidth="2.2" strokeLinecap="round" />
            <path d={`M ${cx+4},${headCY + geom.headRY - 2} Q ${cx+6},${headCY + geom.headRY + 8} ${cx+3},${headCY + geom.headRY + 10}`} fill="none" stroke="#d4c080" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {/* ── EARS ── */}
        {raceDef.ear_type === 'round' && (
          <>
            <ellipse cx={cx - geom.headRX + 1} cy={headCY - 1} rx="3.5" ry="4.5" fill={skin} />
            <ellipse cx={cx + geom.headRX - 1} cy={headCY - 1} rx="3.5" ry="4.5" fill={skin} />
          </>
        )}
        {raceDef.ear_type === 'pointed_long' && (
          <>
            <path d={`M ${cx - geom.headRX + 1},${headCY + 2} L ${cx - geom.headRX - 10},${headCY - 12} L ${cx - geom.headRX + 2},${headCY - 4} Z`} fill={skin} />
            <path d={`M ${cx + geom.headRX - 1},${headCY + 2} L ${cx + geom.headRX + 10},${headCY - 12} L ${cx + geom.headRX - 2},${headCY - 4} Z`} fill={skin} />
          </>
        )}
        {raceDef.ear_type === 'pointed_short' && (
          <>
            <path d={`M ${cx - geom.headRX + 1},${headCY + 1} L ${cx - geom.headRX - 6},${headCY - 7} L ${cx - geom.headRX + 2},${headCY - 2} Z`} fill={skin} />
            <path d={`M ${cx + geom.headRX - 1},${headCY + 1} L ${cx + geom.headRX + 6},${headCY - 7} L ${cx + geom.headRX - 2},${headCY - 2} Z`} fill={skin} />
          </>
        )}
        {raceDef.ear_type === 'cat' && (
          <>
            <path d={`M ${cx - geom.headRX * 0.55},${headCY - geom.headRY + 3} L ${cx - geom.headRX * 0.2},${headCY - geom.headRY - 10} L ${cx - geom.headRX * 0.1},${headCY - geom.headRY + 2} Z`} fill={skin} />
            <path d={`M ${cx + geom.headRX * 0.55},${headCY - geom.headRY + 3} L ${cx + geom.headRX * 0.2},${headCY - geom.headRY - 10} L ${cx + geom.headRX * 0.1},${headCY - geom.headRY + 2} Z`} fill={skin} />
            <path d={`M ${cx - geom.headRX * 0.48},${headCY - geom.headRY + 4} L ${cx - geom.headRX * 0.2},${headCY - geom.headRY - 7} L ${cx - geom.headRX * 0.12},${headCY - geom.headRY + 3} Z`} fill={accentClr} opacity="0.45" />
            <path d={`M ${cx + geom.headRX * 0.48},${headCY - geom.headRY + 4} L ${cx + geom.headRX * 0.2},${headCY - geom.headRY - 7} L ${cx + geom.headRX * 0.12},${headCY - geom.headRY + 3} Z`} fill={accentClr} opacity="0.45" />
          </>
        )}

        {/* Argonian horns + frills */}
        {raceDef.has_head_protrusions && (
          <>
            <path d={`M ${cx},${headCY - geom.headRY} Q ${cx+2},${headCY - geom.headRY - 12} ${cx+1},${headCY - geom.headRY - 18}`} fill="none" stroke={accentClr} strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${cx-7},${headCY - geom.headRY + 2} Q ${cx-12},${headCY - geom.headRY - 5} ${cx-10},${headCY - geom.headRY - 14}`} fill="none" stroke={accentClr} strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${cx+7},${headCY - geom.headRY + 2} Q ${cx+12},${headCY - geom.headRY - 5} ${cx+10},${headCY - geom.headRY - 14}`} fill="none" stroke={accentClr} strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${cx-11},${headCY - geom.headRY * 0.5} Q ${cx-18},${headCY - geom.headRY - 2} ${cx-14},${headCY - geom.headRY - 8}`} fill="none" stroke={accentClr} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
            <path d={`M ${cx+11},${headCY - geom.headRY * 0.5} Q ${cx+18},${headCY - geom.headRY - 2} ${cx+14},${headCY - geom.headRY - 8}`} fill="none" stroke={accentClr} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          </>
        )}

        {/* ── HAIR ── */}
        {raceDef.hair_colors !== null && (
          <>
            <ellipse cx={cx} cy={headCY - geom.headRY * 0.2} rx={geom.headRX + 0.5} ry={geom.headRY * 0.72} fill={hairClr} />
            {(cosmetics?.hair_length === 'long') && (
              <>
                <rect x={cx - geom.headRX - 1} y={headCY - 3} width="5.5" height="38" rx="3" fill={hairClr} />
                <rect x={cx + geom.headRX - 4} y={headCY - 3} width="5.5" height="38" rx="3" fill={hairClr} />
              </>
            )}
            {(cosmetics?.hair_length === 'medium' || cosmetics?.hair_length === 'shaggy') && (
              <>
                <rect x={cx - geom.headRX - 1} y={headCY - 3} width="5" height="18" rx="3" fill={hairClr} />
                <rect x={cx + geom.headRX - 4} y={headCY - 3} width="5" height="18" rx="3" fill={hairClr} />
              </>
            )}
          </>
        )}

        {/* Khajiit fur whiskers */}
        {raceDef.ear_type === 'cat' && (
          <>
            <line x1={cx - 5} y1={headCY + 6} x2={cx - 18} y2={headCY + 5} stroke={skin} strokeWidth="0.7" opacity="0.6" />
            <line x1={cx - 5} y1={headCY + 8} x2={cx - 17} y2={headCY + 9} stroke={skin} strokeWidth="0.7" opacity="0.5" />
            <line x1={cx + 5} y1={headCY + 6} x2={cx + 18} y2={headCY + 5} stroke={skin} strokeWidth="0.7" opacity="0.6" />
            <line x1={cx + 5} y1={headCY + 8} x2={cx + 17} y2={headCY + 9} stroke={skin} strokeWidth="0.7" opacity="0.5" />
          </>
        )}

        {/* ── SURFACE PATTERNS ── */}
        {raceDef.surface_pattern === 'fur_spotted' && (
          <g opacity="0.20">
            {[[cx-8,shldY+8],[cx+6,shldY+18],[cx-4,waistY-10],[legLX+3,kneeY-20],[legRX-3,kneeY-35]].map(([sx,sy],i) => (
              <circle key={`sp-${i}`} cx={sx} cy={sy} r="3.5" fill={accentClr} />
            ))}
          </g>
        )}
        {raceDef.surface_pattern === 'fur_striped' && (
          <g opacity="0.15">
            <line x1={cx-10} y1={shldY+5}  x2={cx-6}  y2={waistY-5}  stroke={accentClr} strokeWidth="2.5" />
            <line x1={cx+10} y1={shldY+5}  x2={cx+6}  y2={waistY-5}  stroke={accentClr} strokeWidth="2.5" />
          </g>
        )}
        {raceDef.surface_pattern === 'scales_smooth' && (
          <g opacity="0.18">
            {[shldY+8, shldY+18, waistY-10].map((sy,i) => (
              <path key={`sc-${i}`} d={`M ${cx-12},${sy} Q ${cx},${sy-4} ${cx+12},${sy}`} fill="none" stroke={accentClr} strokeWidth="0.9" />
            ))}
          </g>
        )}
        {raceDef.surface_pattern === 'tattoo_warpaint' && (
          <g opacity="0.28">
            <line x1={cx-9} y1={headCY-3} x2={cx-4} y2={headCY+3} stroke={accentClr} strokeWidth="1.5" strokeLinecap="round" />
            <line x1={cx+9} y1={headCY-3} x2={cx+4} y2={headCY+3} stroke={accentClr} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* ── INNER THIGH CONTOUR (when legs exposed) ── */}
        {!clothing.legs && (
          <g>
            {isFemale ? (
              // Female: smooth rounded inner thigh curves
              <>
                <path d={`M ${legLX + geom.thighW * 0.22},${crotchY + 4} Q ${legLX + geom.thighW * 0.08},${crotchY + 32} ${legLX + geom.thighW * 0.18},${kneeY - 8}`}
                  fill="none" stroke={`${skin}38`} strokeWidth="0.7" strokeLinecap="round" />
                <path d={`M ${legRX - geom.thighW * 0.22},${crotchY + 4} Q ${legRX - geom.thighW * 0.08},${crotchY + 32} ${legRX - geom.thighW * 0.18},${kneeY - 8}`}
                  fill="none" stroke={`${skin}38`} strokeWidth="0.7" strokeLinecap="round" />
              </>
            ) : (
              // Male: sharper quad-sweep outer line
              <>
                <path d={`M ${legLX - geom.thighW * 0.28},${crotchY + 6} Q ${legLX - geom.thighW * 0.38},${crotchY + 30} ${legLX - geom.thighW * 0.2},${kneeY - 10}`}
                  fill="none" stroke={`${skin}35`} strokeWidth="0.75" strokeLinecap="round" />
                <path d={`M ${legRX + geom.thighW * 0.28},${crotchY + 6} Q ${legRX + geom.thighW * 0.38},${crotchY + 30} ${legRX + geom.thighW * 0.2},${kneeY - 10}`}
                  fill="none" stroke={`${skin}35`} strokeWidth="0.75" strokeLinecap="round" />
              </>
            )}
          </g>
        )}
        {/* Quad/calf muscle definition for athletic builds */}
        {geom.showMuscleDef && !clothing.legs && (
          <g>
            <path d={`M ${legLX + geom.thighW * 0.3},${crotchY + 8} Q ${legLX + geom.thighW * 0.42},${crotchY + 28} ${legLX + geom.thighW * 0.22},${kneeY - 12}`}
              fill="none" stroke={`${skin}38`} strokeWidth="0.65" />
            <path d={`M ${legRX - geom.thighW * 0.3},${crotchY + 8} Q ${legRX - geom.thighW * 0.42},${crotchY + 28} ${legRX - geom.thighW * 0.22},${kneeY - 12}`}
              fill="none" stroke={`${skin}38`} strokeWidth="0.65" />
          </g>
        )}

        {/* ── GROIN ANATOMY (when underwear absent / destroyed) ── */}
        {isGroinExposed && isFemale && (
          <>
            {/* Mons pubis */}
            <ellipse cx={cx} cy={crotchY - 4} rx="4.5" ry="3.2" fill={skin} />
            {/* Labia major – two converging curves */}
            <path d={`M ${cx - 2.2},${crotchY - 2} Q ${cx - 2},${crotchY + 4} ${cx},${crotchY + 8}`}
              fill="none" stroke={`${skin}cc`} strokeWidth="1.3" strokeLinecap="round" />
            <path d={`M ${cx + 2.2},${crotchY - 2} Q ${cx + 2},${crotchY + 4} ${cx},${crotchY + 8}`}
              fill="none" stroke={`${skin}cc`} strokeWidth="1.3" strokeLinecap="round" />
            {/* Labia minor hint */}
            <path d={`M ${cx - 1},${crotchY - 1} Q ${cx - 0.8},${crotchY + 3} ${cx},${crotchY + 6}`}
              fill="none" stroke={`${nippleClr}88`} strokeWidth="0.7" strokeLinecap="round" />
            <path d={`M ${cx + 1},${crotchY - 1} Q ${cx + 0.8},${crotchY + 3} ${cx},${crotchY + 6}`}
              fill="none" stroke={`${nippleClr}88`} strokeWidth="0.7" strokeLinecap="round" />
            {/* Arousal flush */}
            {isAroused && (
              <ellipse cx={cx} cy={crotchY} rx="4" ry="5"
                fill="rgba(255,80,100,0.14)" />
            )}
            {/* Pubic hair (skin races only) */}
            {raceDef.skin_type === 'skin' && (
              <g opacity="0.22">
                {([-3, -1, 1, 3] as const).map((dx, i) => (
                  <ellipse key={`pfh-${i}`}
                    cx={cx + dx} cy={crotchY - 8 + (Math.abs(dx) % 2)}
                    rx="0.75" ry="1.3" fill={hairClr} />
                ))}
              </g>
            )}
          </>
        )}
        {isGroinExposed && isMale && (
          <>
            {/* Pubic hair */}
            {geom.showBodyHair && raceDef.skin_type === 'skin' && (
              <g opacity="0.22">
                {([-4, -2, 0, 2, 4] as const).map((dx, i) => (
                  <ellipse key={`mph-${i}`}
                    cx={cx + dx} cy={crotchY - 15 + (Math.abs(dx) % 2)}
                    rx="0.7" ry="1.5" fill={hairClr} />
                ))}
              </g>
            )}
            {/* Shaft – longer & angled up when aroused */}
            {isAroused ? (
              <>
                <rect x={cx - 2.5} y={crotchY - 16} width="5" height="14" rx="2.5" fill={skin} />
                <ellipse cx={cx} cy={crotchY - 17} rx="3" ry="2.5" fill={skin} />
              </>
            ) : (
              <>
                <rect x={cx - 2} y={crotchY - 8} width="4" height="8" rx="2" fill={skin} />
                <ellipse cx={cx} cy={crotchY - 9} rx="2.5" ry="2" fill={skin} />
              </>
            )}
            {/* Scrotum */}
            <ellipse cx={cx - 2.2} cy={crotchY + 5} rx="3" ry="2.5" fill={skin} />
            <ellipse cx={cx + 2.2} cy={crotchY + 5} rx="3" ry="2.5" fill={skin} />
            {/* Glans corona outline */}
            {isAroused && (
              <ellipse cx={cx} cy={crotchY - 17} rx="3.2" ry="2.7"
                fill="none" stroke={`${nippleClr}70`} strokeWidth="0.6" />
            )}
          </>
        )}
        {/* Non-binary / unknown – neutral mons (no detail) */}
        {isGroinExposed && !isMale && !isFemale && (
          <ellipse cx={cx} cy={crotchY - 2} rx="4" ry="2.8" fill={skin} />
        )}

        {/* ── STATUS OVERLAYS ── */}
        {arousalHigh && (
          <>
            <ellipse cx={cx - 5.5} cy={headCY + 3} rx="3.5" ry="2" fill="rgba(255,90,90,0.28)" />
            <ellipse cx={cx + 5.5} cy={headCY + 3} rx="3.5" ry="2" fill="rgba(255,90,90,0.28)" />
          </>
        )}
        {lowHealth && (
          <>
            <circle cx={cx - geom.shoulderHW * 0.6} cy={shldY + 18} r="2.5" fill="rgba(200,0,0,0.38)" />
            <circle cx={cx + geom.shoulderHW * 0.4} cy={waistY - 8} r="2" fill="rgba(200,0,0,0.32)" />
          </>
        )}
        {corruption && (
          <ellipse cx={cx} cy={(headCY + footBotY) / 2} rx="52" ry="110" fill="none" stroke="rgba(160,0,220,0.18)" strokeWidth="3.5" />
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* CLOTHING LAYERS                             */}
        {/* ═══════════════════════════════════════════ */}

        {/* FEET */}
        {(() => {
          const { op, torn } = integrityStyle(clothing.feet);
          if (!clothing.feet || op === 0) return null;
          const c = SLOT_COLORS.feet;
          return (
            <g opacity={op}>
              <ellipse cx={legLX + geom.footW * 0.1} cy={footBotY - geom.footH/2} rx={geom.footW/2 + 1} ry={geom.footH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
              <ellipse cx={legRX + geom.footW * 0.1} cy={footBotY - geom.footH/2} rx={geom.footW/2 + 1} ry={geom.footH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
              {torn && tornMark(legLX, footBotY - 6, 'torn-f')}
            </g>
          );
        })()}

        {/* LEGS */}
        {(() => {
          const { op, torn } = integrityStyle(clothing.legs);
          if (!clothing.legs || op === 0) return null;
          const c = SLOT_COLORS.legs;
          return (
            <g opacity={op}>
              <rect x={legLX - geom.thighW/2 - 1} y={crotchY} width={geom.thighW + 2} height={ankleY - crotchY} rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
              <rect x={legRX - geom.thighW/2 - 1} y={crotchY} width={geom.thighW + 2} height={ankleY - crotchY} rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
              {torn && tornMark(legLX - 2, kneeY - 10, 'torn-ll')}
              {torn && tornMark(legRX + 2, kneeY + 5, 'torn-rl')}
            </g>
          );
        })()}

        {/* UNDERWEAR */}
        {(() => {
          const { op, torn } = integrityStyle(clothing.underwear);
          if (!clothing.underwear || op === 0) return null;
          const c = SLOT_COLORS.underwear;
          return (
            <g opacity={op}>
              <rect x={cx - geom.hipHW - 1} y={hipTopY + 4} width={(geom.hipHW + 1) * 2} height={crotchY - hipTopY - 2} rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
              {torn && tornMark(cx - 5, hipTopY + 8, 'torn-uw')}
            </g>
          );
        })()}

        {/* WAIST */}
        {(() => {
          const { op } = integrityStyle(clothing.waist);
          if (!clothing.waist || op === 0) return null;
          const c = SLOT_COLORS.waist;
          return (
            <g opacity={op}>
              <rect x={cx - geom.hipHW - 2} y={hipTopY} width={(geom.hipHW + 2) * 2} height="9" rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
            </g>
          );
        })()}

        {/* CHEST */}
        {(() => {
          const { op, torn } = integrityStyle(clothing.chest);
          if (!clothing.chest || op === 0) return null;
          const c = SLOT_COLORS.chest;
          return (
            <g opacity={op}>
              <path d={`M ${cx - geom.shoulderHW - 1},${shldY} C ${cx - geom.shoulderHW - 2},${shldY + 22} ${cx - geom.waistHW - 1},${waistY - 14} ${cx - geom.waistHW - 1},${waistY + 1} L ${cx + geom.waistHW + 1},${waistY + 1} C ${cx + geom.waistHW + 1},${waistY - 14} ${cx + geom.shoulderHW + 2},${shldY + 22} ${cx + geom.shoulderHW + 1},${shldY} Z`} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
              {torn && tornMark(cx - 8, shldY + 18, 'torn-c1')}
              {torn && tornMark(cx + 6, waistY - 12, 'torn-c2')}
            </g>
          );
        })()}

        {/* SHOULDERS */}
        {(() => {
          const { op, torn } = integrityStyle(clothing.shoulders);
          if (!clothing.shoulders || op === 0) return null;
          const c = SLOT_COLORS.shoulders;
          return (
            <g opacity={op}>
              <rect x={shLX - geom.upperArmW} y={shldY - 2} width={geom.upperArmW * 2 + 2} height="16" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
              <rect x={shRX - geom.upperArmW} y={shldY - 2} width={geom.upperArmW * 2 + 2} height="16" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            </g>
          );
        })()}

        {/* HANDS / GLOVES */}
        {(() => {
          const { op } = integrityStyle(clothing.hands);
          if (!clothing.hands || op === 0) return null;
          const c = SLOT_COLORS.hands;
          return (
            <g opacity={op}>
              <ellipse cx={wrLX} cy={handCY} rx={geom.handW/2 + 1.5} ry={geom.handH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
              <ellipse cx={wrRX} cy={handCY} rx={geom.handW/2 + 1.5} ry={geom.handH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
            </g>
          );
        })()}

        {/* NECK clothing */}
        {(() => {
          const { op } = integrityStyle(clothing.neck);
          if (!clothing.neck || op === 0) return null;
          const c = SLOT_COLORS.neck;
          return (
            <g opacity={op}>
              <rect x={cx - geom.headRX * 0.56} y={neckTopY - 1} width={geom.headRX * 1.12} height={neckBotY - neckTopY + 3} rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
            </g>
          );
        })()}

        {/* HEAD clothing */}
        {(() => {
          const { op, torn } = integrityStyle(clothing.head);
          if (!clothing.head || op === 0) return null;
          const c = SLOT_COLORS.head;
          return (
            <g opacity={op}>
              <ellipse cx={cx} cy={headCY - geom.headRY * 0.3} rx={geom.headRX + 1.5} ry={geom.headRY * 0.75} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            </g>
          );
        })()}

      </motion.svg>

      {hasExposure && !compact && (
        <div className="text-[8px] tracking-widest uppercase text-red-400/70 animate-pulse text-center">⚠ Exposed</div>
      )}
      {biology.heat_rut_active && !compact && (
        <div className="text-[8px] tracking-widest uppercase text-pink-400/70 animate-pulse text-center">♥ Heat</div>
      )}
    </div>
  );
};
