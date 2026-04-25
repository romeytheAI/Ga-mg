import React from 'react';
import { BodyGeom, SpriteState } from './utils';
import { RacialBodyFeatures } from '../../../data/races';
import { Cosmetics } from '../../../types';

export type ExpressionState = 'normal''| 'stress''| 'fear''| 'heavyArousal''| 'softArousal''| 'exhausted''| 'pain''| 'ecstasy';

interface FaceAndHairProps {
  geom: BodyGeom;
  s: SpriteState;
  skin: string;
  eyeClr: string;
  hairClr: string;
  accentClr: string;
  raceDef: RacialBodyFeatures;
  isMale: boolean;
  isFemale: boolean;
  cosmetics: Partial<Cosmetics>;
  expression?: ExpressionState;
}

const IRIS_FIBER_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** Derive expression from game stats */
export function deriveExpression(stats: { arousal: number; lust: number; stress: number; pain: number; health: number; stamina: number; corruption: number }): ExpressionState {
  if (stats.pain > 70) return 'pain';
  if (stats.arousal > 85 || stats.lust > 90) return 'ecstasy';
  if (stats.arousal > 60 || stats.lust > 70) return 'heavyArousal';
  if (stats.arousal > 35 || stats.lust > 45) return 'softArousal';
  if (stats.stress > 70 || stats.health < 25) return 'fear';
  if (stats.stress > 45) return 'stress';
  if (stats.stamina < 20 || stats.health < 40) return 'exhausted';
  return 'normal';
}

export const FaceAndHair: React.FC<FaceAndHairProps> = ({ geom, s, skin, eyeClr, hairClr, accentClr, raceDef, isMale, isFemale, cosmetics, expression = 'normal''}) => {
  const makeup = cosmetics?.makeup;
  const lipColor = makeup?.lipstick || (isFemale ? '#c06868'': undefined);
  const hasEyeliner = !!makeup?.eyeliner;
  const eyeshadowClr = makeup?.eyeshadow;

  /* ── Eye geometry ───────────────────────────────────────────────── */
  const eyeL = s.cx - 5;
  const eyeR = s.cx + 5;
  const eyeY = s.headCY - 0.5;
  const eyeRX = 4.2;
  const eyeRY = geom.headRY * 0.24;
  const irisR = 2.4;
  const pupilR = isMale ? 1.0 : 0.9;

  return (
    <>
      {/* Lizard snout (Argonian) */}
      {raceDef.has_muzzle && raceDef.special_features.includes('muzzle_lizard') && (
        <path d={`M ${s.cx-6},${s.headCY+2} Q ${s.cx},${s.headCY+10} ${s.cx},${s.headCY+14} Q ${s.cx},${s.headCY+10} ${s.cx+6},${s.headCY+2} Z`} fill={skin} stroke={accentClr} strokeWidth="0.5" />
      )}
      {/* Cat muzzle (Khajiit) */}
      {raceDef.has_muzzle && raceDef.special_features.includes('muzzle_cat') && (
        <ellipse cx={s.cx} cy={s.headCY + 6} rx="5.5" ry="4" fill={skin} />
      )}

      {/* ── EYES (Hikari-level detail with iris gradients, limbal ring, catchlights) ── */}
      <g className="sprite-blink" style={{ transformOrigin: `${s.cx}px ${eyeY}px` }}>
        {/* Lid shadow (soft crease above eye) */}
        <path d={`M ${eyeL - eyeRX + 0.5},${eyeY} Q ${eyeL},${eyeY - eyeRY - 2.5} ${eyeL + eyeRX - 0.5},${eyeY}`}
          fill="none" stroke={`${skin}60`} strokeWidth="1.2" />
        <path d={`M ${eyeR - eyeRX + 0.5},${eyeY} Q ${eyeR},${eyeY - eyeRY - 2.5} ${eyeR + eyeRX - 0.5},${eyeY}`}
          fill="none" stroke={`${skin}60`} strokeWidth="1.2" />

        {raceDef.eye_shape === 'reptilian''? (
          /* Reptilian slit eyes */
          <>
            <ellipse cx={eyeL} cy={eyeY} rx={eyeRX} ry={eyeRY} fill="url(#sclera)" />
            <ellipse cx={eyeR} cy={eyeY} rx={eyeRX} ry={eyeRY} fill="url(#sclera)" />
            <ellipse cx={eyeL} cy={eyeY} rx={irisR} ry={irisR + 0.5} fill="url(#iris-l)" />
            <ellipse cx={eyeR} cy={eyeY} rx={irisR} ry={irisR + 0.5} fill="url(#iris-r)" />
            {/* Limbal ring */}
            <ellipse cx={eyeL} cy={eyeY} rx={irisR + 0.3} ry={irisR + 0.8} fill="none" stroke="#222" strokeWidth="0.4" opacity="0.5" />
            <ellipse cx={eyeR} cy={eyeY} rx={irisR + 0.3} ry={irisR + 0.8} fill="none" stroke="#222" strokeWidth="0.4" opacity="0.5" />
            {/* Vertical slit pupil */}
            <ellipse cx={eyeL} cy={eyeY} rx="0.6" ry={irisR} fill="#111" />
            <ellipse cx={eyeR} cy={eyeY} rx="0.6" ry={irisR} fill="#111" />
          </>
        ) : raceDef.eye_shape === 'slit_pupil''? (
          /* Feline slit-pupil eyes */
          <>
            <ellipse cx={eyeL} cy={eyeY} rx={eyeRX} ry={eyeRY} fill="url(#sclera)" />
            <ellipse cx={eyeR} cy={eyeY} rx={eyeRX} ry={eyeRY} fill="url(#sclera)" />
            <circle cx={eyeL} cy={eyeY} r={irisR + 0.3} fill="url(#iris-l)" />
            <circle cx={eyeR} cy={eyeY} r={irisR + 0.3} fill="url(#iris-r)" />
            {/* Limbal ring */}
            <circle cx={eyeL} cy={eyeY} r={irisR + 0.5} fill="none" stroke="#222" strokeWidth="0.35" opacity="0.5" />
            <circle cx={eyeR} cy={eyeY} r={irisR + 0.5} fill="none" stroke="#222" strokeWidth="0.35" opacity="0.5" />
            {/* Slit pupil */}
            <ellipse cx={eyeL} cy={eyeY} rx="0.5" ry={irisR - 0.2} fill="#111" />
            <ellipse cx={eyeR} cy={eyeY} rx="0.5" ry={irisR - 0.2} fill="#111" />
          </>
        ) : (
          /* Standard humanoid eyes – full Hikari-quality */
          <>
            {/* Sclera with gradient */}
            <ellipse cx={eyeL} cy={eyeY} rx={eyeRX} ry={eyeRY} fill="url(#sclera)" />
            <ellipse cx={eyeR} cy={eyeY} rx={eyeRX} ry={eyeRY} fill="url(#sclera)" />
            {/* Upper eyelid shadow (inner) */}
            <path d={`M ${eyeL - eyeRX},${eyeY} Q ${eyeL},${eyeY - eyeRY} ${eyeL + eyeRX},${eyeY}`}
              fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
            <path d={`M ${eyeR - eyeRX},${eyeY} Q ${eyeR},${eyeY - eyeRY} ${eyeR + eyeRX},${eyeY}`}
              fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
            {/* Iris with gradient fill + fiber detail */}
            <circle cx={eyeL} cy={eyeY} r={irisR} fill="url(#iris-l)" />
            <circle cx={eyeR} cy={eyeY} r={irisR} fill="url(#iris-r)" />
            {/* Iris fiber lines (radial detail) */}
            {IRIS_FIBER_ANGLES.map(angle => {
              const rad = (angle * Math.PI) // 180;
              const innerR = 0.6;
              const outerR = irisR - 0.3;
              return (
                <React.Fragment key={`fiber-${angle}`}>
                  <line
                    x1={eyeL + Math.cos(rad) * innerR} y1={eyeY + Math.sin(rad) * innerR}
                    x2={eyeL + Math.cos(rad) * outerR} y2={eyeY + Math.sin(rad) * outerR}
                    stroke={eyeClr} strokeWidth="0.2" opacity="0.35" />
                  <line
                    x1={eyeR + Math.cos(rad) * innerR} y1={eyeY + Math.sin(rad) * innerR}
                    x2={eyeR + Math.cos(rad) * outerR} y2={eyeY + Math.sin(rad) * outerR}
                    stroke={eyeClr} strokeWidth="0.2" opacity="0.35" />
                </React.Fragment>
              );
            })}
            {/* Limbal ring (dark border around iris) */}
            <circle cx={eyeL} cy={eyeY} r={irisR + 0.15} fill="none" stroke="#1a1a2a" strokeWidth="0.4" opacity="0.55" />
            <circle cx={eyeR} cy={eyeY} r={irisR + 0.15} fill="none" stroke="#1a1a2a" strokeWidth="0.4" opacity="0.55" />
            {/* Pupil */}
            <circle cx={eyeL} cy={eyeY} r={pupilR} fill="#0a0a0a" />
            <circle cx={eyeR} cy={eyeY} r={pupilR} fill="#0a0a0a" />
            {/* Primary catchlight (large, upper-left) */}
            <circle cx={eyeL - 0.8} cy={eyeY - 0.8} r="0.7" fill="white" opacity="0.9" />
            <circle cx={eyeR + 0.8} cy={eyeY - 0.8} r="0.7" fill="white" opacity="0.9" />
            {/* Secondary catchlight (small, lower-right) */}
            <circle cx={eyeL + 0.6} cy={eyeY + 0.5} r="0.35" fill="white" opacity="0.55" />
            <circle cx={eyeR - 0.6} cy={eyeY + 0.5} r="0.35" fill="white" opacity="0.55" />
            {/* Corneal reflection arc */}
            <path d={`M ${eyeL - 1.2},${eyeY - 0.3} Q ${eyeL + 0.5},${eyeY - 1.5} ${eyeL + 1.5},${eyeY - 0.8}`}
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
            <path d={`M ${eyeR - 1.5},${eyeY - 0.8} Q ${eyeR - 0.5},${eyeY - 1.5} ${eyeR + 1.2},${eyeY - 0.3}`}
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
          </>
        )}

        {/* Lower waterline (subtle) */}
        <path d={`M ${eyeL - eyeRX + 0.8},${eyeY + 0.3} Q ${eyeL},${eyeY + eyeRY - 0.2} ${eyeL + eyeRX - 0.8},${eyeY + 0.3}`}
          fill="none" stroke="rgba(200,160,160,0.2)" strokeWidth="0.3" />
        <path d={`M ${eyeR - eyeRX + 0.8},${eyeY + 0.3} Q ${eyeR},${eyeY + eyeRY - 0.2} ${eyeR + eyeRX - 0.8},${eyeY + 0.3}`}
          fill="none" stroke="rgba(200,160,160,0.2)" strokeWidth="0.3" />
      </g>

      {/* ── EYEBROWS (soft tapered arches) ── */}
      {!raceDef.has_heavy_brow && (
        <>
          <path d={`M ${s.cx - 8.5},${s.headCY - 5.5}
            Q ${s.cx - 5},${s.headCY - 7.8} ${s.cx - 1},${s.headCY - 6}`}
            fill="none" stroke={hairClr === 'transparent''? accentClr : hairClr}
            strokeWidth={isMale ? '1.4'': '1.0'} strokeLinecap="round" opacity="0.7" />
          <path d={`M ${s.cx + 8.5},${s.headCY - 5.5}
            Q ${s.cx + 5},${s.headCY - 7.8} ${s.cx + 1},${s.headCY - 6}`}
            fill="none" stroke={hairClr === 'transparent''? accentClr : hairClr}
            strokeWidth={isMale ? '1.4'': '1.0'} strokeLinecap="round" opacity="0.7" />
        </>
      )}

      {/* ── EYELASHES (varied lengths, Hikari style) ── */}
      {!isMale && !raceDef.has_muzzle && (
        <>
          {/* Left eye – upper lashes (outer to inner, decreasing length) */}
          <line x1={eyeL - eyeRX + 0.2} y1={eyeY - 0.5} x2={eyeL - eyeRX - 1.2} y2={eyeY - 2.5} stroke="#1a1a1a" strokeWidth="0.55" strokeLinecap="round" />
          <line x1={eyeL - eyeRX + 1.5} y1={eyeY - 1.2} x2={eyeL - eyeRX + 0.3} y2={eyeY - 3.2} stroke="#1a1a1a" strokeWidth="0.5" strokeLinecap="round" />
          <line x1={eyeL - eyeRX + 2.8} y1={eyeY - 1.6} x2={eyeL - eyeRX + 2.2} y2={eyeY - 3.0} stroke="#1a1a1a" strokeWidth="0.45" strokeLinecap="round" />
          {/* Lower lashes (subtle) */}
          <line x1={eyeL - 1.5} y1={eyeY + eyeRY - 0.3} x2={eyeL - 2} y2={eyeY + eyeRY + 0.8} stroke="#222" strokeWidth="0.3" strokeLinecap="round" />
          <line x1={eyeL + 0.5} y1={eyeY + eyeRY - 0.1} x2={eyeL + 0.3} y2={eyeY + eyeRY + 0.7} stroke="#222" strokeWidth="0.25" strokeLinecap="round" />

          {/* Right eye – upper lashes */}
          <line x1={eyeR + eyeRX - 0.2} y1={eyeY - 0.5} x2={eyeR + eyeRX + 1.2} y2={eyeY - 2.5} stroke="#1a1a1a" strokeWidth="0.55" strokeLinecap="round" />
          <line x1={eyeR + eyeRX - 1.5} y1={eyeY - 1.2} x2={eyeR + eyeRX - 0.3} y2={eyeY - 3.2} stroke="#1a1a1a" strokeWidth="0.5" strokeLinecap="round" />
          <line x1={eyeR + eyeRX - 2.8} y1={eyeY - 1.6} x2={eyeR + eyeRX - 2.2} y2={eyeY - 3.0} stroke="#1a1a1a" strokeWidth="0.45" strokeLinecap="round" />
          {/* Lower lashes */}
          <line x1={eyeR + 1.5} y1={eyeY + eyeRY - 0.3} x2={eyeR + 2} y2={eyeY + eyeRY + 0.8} stroke="#222" strokeWidth="0.3" strokeLinecap="round" />
          <line x1={eyeR - 0.5} y1={eyeY + eyeRY - 0.1} x2={eyeR - 0.3} y2={eyeY + eyeRY + 0.7} stroke="#222" strokeWidth="0.25" strokeLinecap="round" />
        </>
      )}

      {/* ── EYELINER ── */}
      {hasEyeliner && (
        <>
          <path d={`M ${eyeL - eyeRX},${eyeY} Q ${eyeL},${eyeY - eyeRY - 0.5} ${eyeL + eyeRX},${eyeY}`}
            fill="none" stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round" />
          <path d={`M ${eyeR - eyeRX},${eyeY} Q ${eyeR},${eyeY - eyeRY - 0.5} ${eyeR + eyeRX},${eyeY}`}
            fill="none" stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round" />
          {/* Wing flick */}
          <line x1={eyeL - eyeRX} y1={eyeY} x2={eyeL - eyeRX - 1} y2={eyeY - 1.2} stroke="#1a1a1a" strokeWidth="0.5" strokeLinecap="round" />
          <line x1={eyeR + eyeRX} y1={eyeY} x2={eyeR + eyeRX + 1} y2={eyeY - 1.2} stroke="#1a1a1a" strokeWidth="0.5" strokeLinecap="round" />
        </>
      )}

      {/* ── EYESHADOW ── */}
      {eyeshadowClr && (
        <>
          <ellipse cx={eyeL} cy={eyeY - 2} rx={eyeRX + 0.5} ry="2"
            fill={eyeshadowClr} opacity="0.22" />
          <ellipse cx={eyeR} cy={eyeY - 2} rx={eyeRX + 0.5} ry="2"
            fill={eyeshadowClr} opacity="0.22" />
        </>
      )}

      {/* ── NOSE (delicate, anime-style) ── */}
      {!raceDef.has_muzzle && (
        <>
          {/* Nose bridge highlight */}
          <line x1={s.cx} y1={s.headCY + 1} x2={s.cx} y2={s.headCY + 3.8}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeLinecap="round" />
          {/* Nose tip */}
          <path d={`M ${s.cx},${s.headCY + 2}
            L ${s.cx - 1.8},${s.headCY + 4.8}
            Q ${s.cx},${s.headCY + 5.5} ${s.cx + 1.8},${s.headCY + 4.8} Z`}
            fill={`${skin}dd`} stroke={`${skin}88`} strokeWidth="0.3" />
          {/* Nostril shadows */}
          <circle cx={s.cx - 1.2} cy={s.headCY + 4.8} r="0.45" fill={`${skin}60`} />
          <circle cx={s.cx + 1.2} cy={s.headCY + 4.8} r="0.45" fill={`${skin}60`} />
        </>
      )}

      {/* ── MOUTH / LIPS (Hikari-level with shine and cupid's bow) ── */}
      {!raceDef.has_muzzle ? (
        <>
          {/* Upper lip with cupid's bow */}
          <path d={`M ${s.cx - 3.8},${s.headCY + 7.2}
            Q ${s.cx - 2},${s.headCY + 6.2} ${s.cx - 0.5},${s.headCY + 6.8}
            L ${s.cx},${s.headCY + 6.5}
            L ${s.cx + 0.5},${s.headCY + 6.8}
            Q ${s.cx + 2},${s.headCY + 6.2} ${s.cx + 3.8},${s.headCY + 7.2}`}
            fill="none" stroke={lipColor || `${skin}cc`}
            strokeWidth={isFemale ? '1.1'': '0.8'} strokeLinecap="round" />
          {/* Lower lip (filled with gradient) */}
          <path d={`M ${s.cx - 3.5},${s.headCY + 7.4}
            Q ${s.cx},${s.headCY + 9.5} ${s.cx + 3.5},${s.headCY + 7.4}`}
            fill={lipColor || `${skin}dd`} stroke="none"
            opacity={isFemale ? '0.50'': '0.25'} />
          {/* Lip moisture highlight */}
          <path d={`M ${s.cx - 1.5},${s.headCY + 8}
            Q ${s.cx},${s.headCY + 8.8} ${s.cx + 1.5},${s.headCY + 8}`}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" strokeLinecap="round" />
          {/* Mouth crease shadow */}
          <line x1={s.cx - 3.5} y1={s.headCY + 7.3} x2={s.cx + 3.5} y2={s.headCY + 7.3}
            stroke={`${skin}40`} strokeWidth="0.3" />
        </>
      ) : raceDef.special_features.includes('muzzle_cat') ? (
        <>
          <path d={`M ${s.cx - 2},${s.headCY + 8.5} L ${s.cx},${s.headCY + 9.5} L ${s.cx + 2},${s.headCY + 8.5}`}
            fill="none" stroke={`${skin}99`} strokeWidth="0.6" strokeLinecap="round" />
          <circle cx={s.cx} cy={s.headCY + 7} r="1.2" fill={`${skin}aa`} />
        </>
      ) : (
        <>
          <line x1={s.cx - 4} y1={s.headCY + 10} x2={s.cx + 4} y2={s.headCY + 10}
            stroke={`${skin}88`} strokeWidth="0.8" strokeLinecap="round" />
        </>
      )}
      {raceDef.has_heavy_brow && (
        <path d={`M ${s.cx-9},${s.headCY-3.5} Q ${s.cx},${s.headCY-6} ${s.cx+9},${s.headCY-3.5}`} fill={skin} stroke={`${accentClr}80`} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* Tusks (Orc) */}
      {raceDef.has_tusks && (
        <>
          <path d={`M ${s.cx-4},${s.headCY + geom.headRY - 2} Q ${s.cx-6},${s.headCY + geom.headRY + 8} ${s.cx-3},${s.headCY + geom.headRY + 10}`} fill="none" stroke="#d4c080" strokeWidth="2.2" strokeLinecap="round" />
          <path d={`M ${s.cx+4},${s.headCY + geom.headRY - 2} Q ${s.cx+6},${s.headCY + geom.headRY + 8} ${s.cx+3},${s.headCY + geom.headRY + 10}`} fill="none" stroke="#d4c080" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {/* ── EARS ── */}
      {raceDef.ear_type === 'round''&& (
        <>
          <ellipse cx={s.cx - geom.headRX + 1} cy={s.headCY - 1} rx="3.5" ry="4.5" fill={skin} />
          <ellipse cx={s.cx - geom.headRX + 1.5} cy={s.headCY - 1} rx="2" ry="3" fill={`${skin}80`} />
          <ellipse cx={s.cx + geom.headRX - 1} cy={s.headCY - 1} rx="3.5" ry="4.5" fill={skin} />
          <ellipse cx={s.cx + geom.headRX - 1.5} cy={s.headCY - 1} rx="2" ry="3" fill={`${skin}80`} />
        </>
      )}
      {raceDef.ear_type === 'pointed_long''&& (
        <>
          <g className="sprite-ear-twitch-l" style={{ transformOrigin: `${s.cx - geom.headRX + 2}px ${s.headCY - 4}px` }}>
            <path d={`M ${s.cx - geom.headRX + 1},${s.headCY + 2} L ${s.cx - geom.headRX - 10},${s.headCY - 12} L ${s.cx - geom.headRX + 2},${s.headCY - 4} Z`} fill={skin} />
            <path d={`M ${s.cx - geom.headRX + 1},${s.headCY + 1} L ${s.cx - geom.headRX - 7},${s.headCY - 10} L ${s.cx - geom.headRX + 2},${s.headCY - 3} Z`} fill={`${skin}80`} />
          </g>
          <g className="sprite-ear-twitch-r" style={{ transformOrigin: `${s.cx + geom.headRX - 2}px ${s.headCY - 4}px` }}>
            <path d={`M ${s.cx + geom.headRX - 1},${s.headCY + 2} L ${s.cx + geom.headRX + 10},${s.headCY - 12} L ${s.cx + geom.headRX - 2},${s.headCY - 4} Z`} fill={skin} />
            <path d={`M ${s.cx + geom.headRX - 1},${s.headCY + 1} L ${s.cx + geom.headRX + 7},${s.headCY - 10} L ${s.cx + geom.headRX - 2},${s.headCY - 3} Z`} fill={`${skin}80`} />
          </g>
        </>
      )}
      {raceDef.ear_type === 'pointed_short''&& (
        <>
          <path d={`M ${s.cx - geom.headRX + 1},${s.headCY + 1} L ${s.cx - geom.headRX - 6},${s.headCY - 7} L ${s.cx - geom.headRX + 2},${s.headCY - 2} Z`} fill={skin} />
          <path d={`M ${s.cx + geom.headRX - 1},${s.headCY + 1} L ${s.cx + geom.headRX + 6},${s.headCY - 7} L ${s.cx + geom.headRX - 2},${s.headCY - 2} Z`} fill={skin} />
        </>
      )}
      {raceDef.ear_type === 'cat''&& (
        <>
          <g className="sprite-ear-twitch-l" style={{ transformOrigin: `${s.cx - geom.headRX * 0.1}px ${s.headCY - geom.headRY + 2}px` }}>
            <path d={`M ${s.cx - geom.headRX * 0.55},${s.headCY - geom.headRY + 3} L ${s.cx - geom.headRX * 0.2},${s.headCY - geom.headRY - 10} L ${s.cx - geom.headRX * 0.1},${s.headCY - geom.headRY + 2} Z`} fill={skin} />
            <path d={`M ${s.cx - geom.headRX * 0.48},${s.headCY - geom.headRY + 4} L ${s.cx - geom.headRX * 0.2},${s.headCY - geom.headRY - 7} L ${s.cx - geom.headRX * 0.12},${s.headCY - geom.headRY + 3} Z`} fill={accentClr} opacity="0.45" />
          </g>
          <g className="sprite-ear-twitch-r" style={{ transformOrigin: `${s.cx + geom.headRX * 0.1}px ${s.headCY - geom.headRY + 2}px` }}>
            <path d={`M ${s.cx + geom.headRX * 0.55},${s.headCY - geom.headRY + 3} L ${s.cx + geom.headRX * 0.2},${s.headCY - geom.headRY - 10} L ${s.cx + geom.headRX * 0.1},${s.headCY - geom.headRY + 2} Z`} fill={skin} />
            <path d={`M ${s.cx + geom.headRX * 0.48},${s.headCY - geom.headRY + 4} L ${s.cx + geom.headRX * 0.2},${s.headCY - geom.headRY - 7} L ${s.cx + geom.headRX * 0.12},${s.headCY - geom.headRY + 3} Z`} fill={accentClr} opacity="0.45" />
          </g>
        </>
      )}

      {/* Argonian horns + frills */}
      {raceDef.has_head_protrusions && (
        <>
          <path d={`M ${s.cx},${s.headCY - geom.headRY} Q ${s.cx+2},${s.headCY - geom.headRY - 12} ${s.cx+1},${s.headCY - geom.headRY - 18}`} fill="none" stroke={accentClr} strokeWidth="3" strokeLinecap="round" />
          <path d={`M ${s.cx-7},${s.headCY - geom.headRY + 2} Q ${s.cx-12},${s.headCY - geom.headRY - 5} ${s.cx-10},${s.headCY - geom.headRY - 14}`} fill="none" stroke={accentClr} strokeWidth="2" strokeLinecap="round" />
          <path d={`M ${s.cx+7},${s.headCY - geom.headRY + 2} Q ${s.cx+12},${s.headCY - geom.headRY - 5} ${s.cx+10},${s.headCY - geom.headRY - 14}`} fill="none" stroke={accentClr} strokeWidth="2" strokeLinecap="round" />
          <path d={`M ${s.cx-11},${s.headCY - geom.headRY * 0.5} Q ${s.cx-18},${s.headCY - geom.headRY - 2} ${s.cx-14},${s.headCY - geom.headRY - 8}`} fill="none" stroke={accentClr} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <path d={`M ${s.cx+11},${s.headCY - geom.headRY * 0.5} Q ${s.cx+18},${s.headCY - geom.headRY - 2} ${s.cx+14},${s.headCY - geom.headRY - 8}`} fill="none" stroke={accentClr} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        </>
      )}

      {/* ── HAIR (multi-layered with shine bands, Hikari-quality) ── */}
      {raceDef.hair_colors !== null && (
        <g className="sprite-hair-sway" style={{ transformOrigin: `${s.cx}px ${s.headCY - geom.headRY}px` }}>
          {/* Hair cap / volume */}
          <ellipse cx={s.cx} cy={s.headCY - geom.headRY * 0.2}
            rx={geom.headRX + 1.5} ry={geom.headRY * 0.78}
            fill="url(#hair-main)" />
          {/* Shine band across top */}
          <ellipse cx={s.cx - 1} cy={s.headCY - geom.headRY * 0.55}
            rx={geom.headRX * 0.65} ry={geom.headRY * 0.22}
            fill="url(#hair-shine)" />

          {/* Side strands (long) */}
          {(cosmetics?.hair_length === 'long') && (
            <>
              <path d={`M ${s.cx - geom.headRX},${s.headCY - 2}
                C ${s.cx - geom.headRX - 2},${s.headCY + 12}
                  ${s.cx - geom.headRX - 1},${s.headCY + 28}
                  ${s.cx - geom.headRX + 1},${s.headCY + 38}`}
                fill="none" stroke={hairClr} strokeWidth="5" strokeLinecap="round" />
              <path d={`M ${s.cx - geom.headRX},${s.headCY - 2}
                C ${s.cx - geom.headRX - 2},${s.headCY + 12}
                  ${s.cx - geom.headRX - 1},${s.headCY + 28}
                  ${s.cx - geom.headRX + 1},${s.headCY + 38}`}
                fill="none" stroke="url(#hair-shine)" strokeWidth="5" strokeLinecap="round" />
              <path d={`M ${s.cx + geom.headRX},${s.headCY - 2}
                C ${s.cx + geom.headRX + 2},${s.headCY + 12}
                  ${s.cx + geom.headRX + 1},${s.headCY + 28}
                  ${s.cx + geom.headRX - 1},${s.headCY + 38}`}
                fill="none" stroke={hairClr} strokeWidth="5" strokeLinecap="round" />
              <path d={`M ${s.cx + geom.headRX},${s.headCY - 2}
                C ${s.cx + geom.headRX + 2},${s.headCY + 12}
                  ${s.cx + geom.headRX + 1},${s.headCY + 28}
                  ${s.cx + geom.headRX - 1},${s.headCY + 38}`}
                fill="none" stroke="url(#hair-shine)" strokeWidth="5" strokeLinecap="round" />
              {/* Back hair mass */}
              <rect x={s.cx - geom.headRX + 2} y={s.headCY + 5}
                width={(geom.headRX - 2) * 2} height="30" rx="4"
                fill={hairClr} opacity="0.35" />
            </>
          )}
          {(cosmetics?.hair_length === 'medium''|| cosmetics?.hair_length === 'shaggy') && (
            <>
              <path d={`M ${s.cx - geom.headRX},${s.headCY - 2}
                C ${s.cx - geom.headRX - 1.5},${s.headCY + 6}
                  ${s.cx - geom.headRX},${s.headCY + 14}
                  ${s.cx - geom.headRX + 1},${s.headCY + 18}`}
                fill="none" stroke={hairClr} strokeWidth="4.5" strokeLinecap="round" />
              <path d={`M ${s.cx + geom.headRX},${s.headCY - 2}
                C ${s.cx + geom.headRX + 1.5},${s.headCY + 6}
                  ${s.cx + geom.headRX},${s.headCY + 14}
                  ${s.cx + geom.headRX - 1},${s.headCY + 18}`}
                fill="none" stroke={hairClr} strokeWidth="4.5" strokeLinecap="round" />
            </>
          )}

          {/* Front bangs fringe */}
          <path d={`M ${s.cx - geom.headRX * 0.7},${s.headCY - geom.headRY * 0.65}
            Q ${s.cx - geom.headRX * 0.35},${s.headCY - geom.headRY * 0.15}
              ${s.cx - geom.headRX * 0.05},${s.headCY - geom.headRY * 0.55}
            Q ${s.cx + geom.headRX * 0.2},${s.headCY - geom.headRY * 0.1}
              ${s.cx + geom.headRX * 0.6},${s.headCY - geom.headRY * 0.55}`}
            fill="none" stroke={hairClr} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </g>
      )}

      {/* Khajiit fur whiskers (with twitch animation) */}
      {raceDef.ear_type === 'cat''&& (
        <>
          <g className="sprite-whisker-twitch-l" style={{ transformOrigin: `${s.cx - 5}px ${s.headCY + 7}px` }}>
            <line x1={s.cx - 5} y1={s.headCY + 6} x2={s.cx - 18} y2={s.headCY + 5} stroke={skin} strokeWidth="0.7" opacity="0.6" />
            <line x1={s.cx - 5} y1={s.headCY + 8} x2={s.cx - 17} y2={s.headCY + 9} stroke={skin} strokeWidth="0.7" opacity="0.5" />
          </g>
          <g className="sprite-whisker-twitch-r" style={{ transformOrigin: `${s.cx + 5}px ${s.headCY + 7}px` }}>
            <line x1={s.cx + 5} y1={s.headCY + 6} x2={s.cx + 18} y2={s.headCY + 5} stroke={skin} strokeWidth="0.7" opacity="0.6" />
            <line x1={s.cx + 5} y1={s.headCY + 8} x2={s.cx + 17} y2={s.headCY + 9} stroke={skin} strokeWidth="0.7" opacity="0.5" />
          </g>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EXPRESSION OVERLAYS (DoL-parity 6-state expression system)
         ══════════════════════════════════════════════════════════════ */}

      {/* Half-lid overlay for arousal + exhaustion */}
      {(expression === 'heavyArousal''|| expression === 'softArousal''|| expression === 'exhausted''|| expression === 'ecstasy') && (
        <g>
          {/* Left eye half-lid */}
          <path d={`M ${eyeL - eyeRX - 0.3},${eyeY - eyeRY * 0.2}
            Q ${eyeL},${eyeY - eyeRY * (expression === 'ecstasy''? 0.1 : expression === 'heavyArousal''? 0.3 : 0.5)}
              ${eyeL + eyeRX + 0.3},${eyeY - eyeRY * 0.2}
            L ${eyeL + eyeRX + 0.3},${eyeY - eyeRY - 1}
            L ${eyeL - eyeRX - 0.3},${eyeY - eyeRY - 1} Z`}
            fill={skin} />
          {/* Right eye half-lid */}
          <path d={`M ${eyeR - eyeRX - 0.3},${eyeY - eyeRY * 0.2}
            Q ${eyeR},${eyeY - eyeRY * (expression === 'ecstasy''? 0.1 : expression === 'heavyArousal''? 0.3 : 0.5)}
              ${eyeR + eyeRX + 0.3},${eyeY - eyeRY * 0.2}
            L ${eyeR + eyeRX + 0.3},${eyeY - eyeRY - 1}
            L ${eyeR - eyeRX - 0.3},${eyeY - eyeRY - 1} Z`}
            fill={skin} />
        </g>
      )}

      {/* Wide-open eyes for fear */}
      {expression === 'fear''&& (
        <g>
          {/* Enlarged white sclera reveal above iris */}
          <ellipse cx={eyeL} cy={eyeY - 0.8} rx={eyeRX + 0.5} ry={eyeRY + 1}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <ellipse cx={eyeR} cy={eyeY - 0.8} rx={eyeRX + 0.5} ry={eyeRY + 1}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          {/* Contracted pupils (tiny) */}
          <circle cx={eyeL} cy={eyeY} r="0.5" fill="#000" />
          <circle cx={eyeR} cy={eyeY} r="0.5" fill="#000" />
        </g>
      )}

      {/* Stress eyebrow furrow */}
      {(expression === 'stress''|| expression === 'pain') && (
        <g>
          {/* Furrowed brow lines */}
          <line x1={s.cx - 2} y1={s.headCY - 8} x2={s.cx - 1} y2={s.headCY - 7}
            stroke={`${skin}80`} strokeWidth="0.5" />
          <line x1={s.cx + 2} y1={s.headCY - 8} x2={s.cx + 1} y2={s.headCY - 7}
            stroke={`${skin}80`} strokeWidth="0.5" />
        </g>
      )}

      {/* Pain expression: squinted eyes + grimace */}
      {expression === 'pain''&& (
        <g>
          {/* Squint overlay – covers bottom part of eyes */}
          <path d={`M ${eyeL - eyeRX - 0.3},${eyeY + eyeRY * 0.3}
            Q ${eyeL},${eyeY + eyeRY * 0.1} ${eyeL + eyeRX + 0.3},${eyeY + eyeRY * 0.3}
            L ${eyeL + eyeRX + 0.3},${eyeY + eyeRY + 1}
            L ${eyeL - eyeRX - 0.3},${eyeY + eyeRY + 1} Z`}
            fill={skin} />
          <path d={`M ${eyeR - eyeRX - 0.3},${eyeY + eyeRY * 0.3}
            Q ${eyeR},${eyeY + eyeRY * 0.1} ${eyeR + eyeRX + 0.3},${eyeY + eyeRY * 0.3}
            L ${eyeR + eyeRX + 0.3},${eyeY + eyeRY + 1}
            L ${eyeR - eyeRX - 0.3},${eyeY + eyeRY + 1} Z`}
            fill={skin} />
          {/* Top squint too */}
          <path d={`M ${eyeL - eyeRX - 0.3},${eyeY - eyeRY * 0.1}
            Q ${eyeL},${eyeY - eyeRY * 0.4} ${eyeL + eyeRX + 0.3},${eyeY - eyeRY * 0.1}
            L ${eyeL + eyeRX + 0.3},${eyeY - eyeRY - 1}
            L ${eyeL - eyeRX - 0.3},${eyeY - eyeRY - 1} Z`}
            fill={skin} />
          <path d={`M ${eyeR - eyeRX - 0.3},${eyeY - eyeRY * 0.1}
            Q ${eyeR},${eyeY - eyeRY * 0.4} ${eyeR + eyeRX + 0.3},${eyeY - eyeRY * 0.1}
            L ${eyeR + eyeRX + 0.3},${eyeY - eyeRY - 1}
            L ${eyeR - eyeRX - 0.3},${eyeY - eyeRY - 1} Z`}
            fill={skin} />
        </g>
      )}

      {/* Ecstasy: mouth open, tongue hint */}
      {expression === 'ecstasy''&& !raceDef.has_muzzle && (
        <g>
          {/* Open mouth */}
          <ellipse cx={s.cx} cy={s.headCY + 8} rx="3" ry="2.2"
            fill="rgba(40,0,0,0.6)" />
          {/* Tongue */}
          <ellipse cx={s.cx} cy={s.headCY + 9} rx="1.8" ry="1"
            fill="rgba(200,80,80,0.5)" />
        </g>
      )}

      {/* Tears (fear / pain / ecstasy) */}
      {(expression === 'fear''|| expression === 'pain''|| expression === 'ecstasy') && (
        <g className="sprite-drip">
          <ellipse cx={eyeL - eyeRX + 0.5} cy={eyeY + eyeRY + 2} rx="0.5" ry="1.2"
            fill="rgba(150,200,255,0.45)" />
          {expression === 'pain''&& (
            <ellipse cx={eyeR + eyeRX - 0.5} cy={eyeY + eyeRY + 3} rx="0.4" ry="1"
              fill="rgba(150,200,255,0.35)" />
          )}
        </g>
      )}
    </>
  );
};
