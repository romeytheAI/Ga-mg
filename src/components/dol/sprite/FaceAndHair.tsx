import React from 'react';
import { BodyGeom, SpriteState } from './utils';
import { RacialBodyFeatures } from '../../../data/races';
import { Cosmetics } from '../../../types';

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
}

export const FaceAndHair: React.FC<FaceAndHairProps> = ({ geom, s, skin, eyeClr, hairClr, accentClr, raceDef, isMale, isFemale, cosmetics }) => {
  const makeup = cosmetics?.makeup;
  const lipColor = makeup?.lipstick || (isFemale ? '#c06868' : undefined);
  const hasEyeliner = !!makeup?.eyeliner;
  const eyeshadowClr = makeup?.eyeshadow;

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

      {/* ── EYES (with blink animation) ── */}
      {raceDef.eye_shape === 'reptilian' ? (
        <g className="sprite-blink" style={{ transformOrigin: `${s.cx}px ${s.headCY}px` }}>
          <ellipse cx={s.cx - 5} cy={s.headCY} rx="3.8" ry="3" fill="white" />
          <ellipse cx={s.cx + 5} cy={s.headCY} rx="3.8" ry="3" fill="white" />
          <ellipse cx={s.cx - 5} cy={s.headCY} rx="1.1" ry="2.5" fill={eyeClr} />
          <ellipse cx={s.cx + 5} cy={s.headCY} rx="1.1" ry="2.5" fill={eyeClr} />
        </g>
      ) : raceDef.eye_shape === 'slit_pupil' ? (
        <g className="sprite-blink" style={{ transformOrigin: `${s.cx}px ${s.headCY}px` }}>
          <ellipse cx={s.cx - 5} cy={s.headCY} rx="3.8" ry="3" fill="white" />
          <ellipse cx={s.cx + 5} cy={s.headCY} rx="3.8" ry="3" fill="white" />
          <ellipse cx={s.cx - 5} cy={s.headCY} rx="2.5" ry="2.8" fill={eyeClr} />
          <ellipse cx={s.cx + 5} cy={s.headCY} rx="2.5" ry="2.8" fill={eyeClr} />
          <ellipse cx={s.cx - 5} cy={s.headCY} rx="0.7" ry="2.2" fill="#111" />
          <ellipse cx={s.cx + 5} cy={s.headCY} rx="0.7" ry="2.2" fill="#111" />
        </g>
      ) : (
        <g className="sprite-blink" style={{ transformOrigin: `${s.cx}px ${s.headCY}px` }}>
          <ellipse cx={s.cx - 4.5} cy={s.headCY} rx="3.5" ry={geom.headRY * 0.22} fill="white" />
          <ellipse cx={s.cx + 4.5} cy={s.headCY} rx="3.5" ry={geom.headRY * 0.22} fill="white" />
          <circle cx={s.cx - 4.5} cy={s.headCY} r="2" fill={eyeClr} />
          <circle cx={s.cx + 4.5} cy={s.headCY} r="2" fill={eyeClr} />
          <circle cx={s.cx - 3.8} cy={s.headCY - 0.5} r="0.55" fill="white" />
          <circle cx={s.cx + 5.2} cy={s.headCY - 0.5} r="0.55" fill="white" />
        </g>
      )}

      {/* ── EYEBROWS ── */}
      {!raceDef.has_heavy_brow && (
        <>
          <path d={`M ${s.cx - 7.5},${s.headCY - 4.8} Q ${s.cx - 4.5},${s.headCY - 6.5} ${s.cx - 1.5},${s.headCY - 5.2}`}
            fill="none" stroke={hairClr === 'transparent' ? accentClr : hairClr}
            strokeWidth={isMale ? '1.3' : '0.9'} strokeLinecap="round" opacity="0.75" />
          <path d={`M ${s.cx + 7.5},${s.headCY - 4.8} Q ${s.cx + 4.5},${s.headCY - 6.5} ${s.cx + 1.5},${s.headCY - 5.2}`}
            fill="none" stroke={hairClr === 'transparent' ? accentClr : hairClr}
            strokeWidth={isMale ? '1.3' : '0.9'} strokeLinecap="round" opacity="0.75" />
        </>
      )}

      {/* ── EYELASHES (female / non-binary) ── */}
      {!isMale && !raceDef.has_muzzle && (
        <>
          <line x1={s.cx - 7.8} y1={s.headCY - 1} x2={s.cx - 8.8} y2={s.headCY - 2.5}
            stroke="#222" strokeWidth="0.6" strokeLinecap="round" />
          <line x1={s.cx - 6.5} y1={s.headCY - 2} x2={s.cx - 7.2} y2={s.headCY - 3.5}
            stroke="#222" strokeWidth="0.5" strokeLinecap="round" />
          <line x1={s.cx + 7.8} y1={s.headCY - 1} x2={s.cx + 8.8} y2={s.headCY - 2.5}
            stroke="#222" strokeWidth="0.6" strokeLinecap="round" />
          <line x1={s.cx + 6.5} y1={s.headCY - 2} x2={s.cx + 7.2} y2={s.headCY - 3.5}
            stroke="#222" strokeWidth="0.5" strokeLinecap="round" />
        </>
      )}

      {/* ── EYELINER ── */}
      {hasEyeliner && (
        <>
          <path d={`M ${s.cx - 8},${s.headCY} Q ${s.cx - 4.5},${s.headCY - 2.8} ${s.cx - 1},${s.headCY}`}
            fill="none" stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round" />
          <path d={`M ${s.cx + 8},${s.headCY} Q ${s.cx + 4.5},${s.headCY - 2.8} ${s.cx + 1},${s.headCY}`}
            fill="none" stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round" />
        </>
      )}

      {/* ── EYESHADOW ── */}
      {eyeshadowClr && (
        <>
          <ellipse cx={s.cx - 4.5} cy={s.headCY - 2} rx="4" ry="1.8"
            fill={eyeshadowClr} opacity="0.22" />
          <ellipse cx={s.cx + 4.5} cy={s.headCY - 2} rx="4" ry="1.8"
            fill={eyeshadowClr} opacity="0.22" />
        </>
      )}

      {/* ── NOSE ── */}
      {!raceDef.has_muzzle && (
        <path d={`M ${s.cx},${s.headCY + 1.5} L ${s.cx - 1.5},${s.headCY + 4.5} Q ${s.cx},${s.headCY + 5.2} ${s.cx + 1.5},${s.headCY + 4.5} Z`}
          fill={`${skin}cc`} stroke={`${skin}88`} strokeWidth="0.4" />
      )}

      {/* ── MOUTH / LIPS ── */}
      {!raceDef.has_muzzle ? (
        <>
          {/* Upper lip */}
          <path d={`M ${s.cx - 3.5},${s.headCY + 7.2} Q ${s.cx - 1},${s.headCY + 6} ${s.cx},${s.headCY + 6.5} Q ${s.cx + 1},${s.headCY + 6} ${s.cx + 3.5},${s.headCY + 7.2}`}
            fill="none" stroke={lipColor || `${skin}cc`}
            strokeWidth={isFemale ? '1.1' : '0.8'} strokeLinecap="round" />
          {/* Lower lip */}
          <path d={`M ${s.cx - 3.2},${s.headCY + 7.4} Q ${s.cx},${s.headCY + 9.2} ${s.cx + 3.2},${s.headCY + 7.4}`}
            fill={lipColor || `${skin}dd`} stroke="none" opacity={isFemale ? '0.50' : '0.30'} />
        </>
      ) : raceDef.special_features.includes('muzzle_cat') ? (
        <>
          {/* Cat mouth – small W-shape */}
          <path d={`M ${s.cx - 2},${s.headCY + 8.5} L ${s.cx},${s.headCY + 9.5} L ${s.cx + 2},${s.headCY + 8.5}`}
            fill="none" stroke={`${skin}99`} strokeWidth="0.6" strokeLinecap="round" />
          <circle cx={s.cx} cy={s.headCY + 7} r="1.2" fill={`${skin}aa`} />
        </>
      ) : (
        <>
          {/* Lizard mouth – horizontal slit */}
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
      {raceDef.ear_type === 'round' && (
        <>
          <ellipse cx={s.cx - geom.headRX + 1} cy={s.headCY - 1} rx="3.5" ry="4.5" fill={skin} />
          <ellipse cx={s.cx + geom.headRX - 1} cy={s.headCY - 1} rx="3.5" ry="4.5" fill={skin} />
        </>
      )}
      {raceDef.ear_type === 'pointed_long' && (
        <>
          <g className="sprite-ear-twitch-l" style={{ transformOrigin: `${s.cx - geom.headRX + 2}px ${s.headCY - 4}px` }}>
            <path d={`M ${s.cx - geom.headRX + 1},${s.headCY + 2} L ${s.cx - geom.headRX - 10},${s.headCY - 12} L ${s.cx - geom.headRX + 2},${s.headCY - 4} Z`} fill={skin} />
          </g>
          <g className="sprite-ear-twitch-r" style={{ transformOrigin: `${s.cx + geom.headRX - 2}px ${s.headCY - 4}px` }}>
            <path d={`M ${s.cx + geom.headRX - 1},${s.headCY + 2} L ${s.cx + geom.headRX + 10},${s.headCY - 12} L ${s.cx + geom.headRX - 2},${s.headCY - 4} Z`} fill={skin} />
          </g>
        </>
      )}
      {raceDef.ear_type === 'pointed_short' && (
        <>
          <path d={`M ${s.cx - geom.headRX + 1},${s.headCY + 1} L ${s.cx - geom.headRX - 6},${s.headCY - 7} L ${s.cx - geom.headRX + 2},${s.headCY - 2} Z`} fill={skin} />
          <path d={`M ${s.cx + geom.headRX - 1},${s.headCY + 1} L ${s.cx + geom.headRX + 6},${s.headCY - 7} L ${s.cx + geom.headRX - 2},${s.headCY - 2} Z`} fill={skin} />
        </>
      )}
      {raceDef.ear_type === 'cat' && (
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

      {/* ── HAIR (with sway animation) ── */}
      {raceDef.hair_colors !== null && (
        <g className="sprite-hair-sway" style={{ transformOrigin: `${s.cx}px ${s.headCY - geom.headRY}px` }}>
          <ellipse cx={s.cx} cy={s.headCY - geom.headRY * 0.2} rx={geom.headRX + 0.5} ry={geom.headRY * 0.72} fill={hairClr} />
          {(cosmetics?.hair_length === 'long') && (
            <>
              <rect x={s.cx - geom.headRX - 1} y={s.headCY - 3} width="5.5" height="38" rx="3" fill={hairClr} />
              <rect x={s.cx + geom.headRX - 4} y={s.headCY - 3} width="5.5" height="38" rx="3" fill={hairClr} />
            </>
          )}
          {(cosmetics?.hair_length === 'medium' || cosmetics?.hair_length === 'shaggy') && (
            <>
              <rect x={s.cx - geom.headRX - 1} y={s.headCY - 3} width="5" height="18" rx="3" fill={hairClr} />
              <rect x={s.cx + geom.headRX - 4} y={s.headCY - 3} width="5" height="18" rx="3" fill={hairClr} />
            </>
          )}
        </g>
      )}

      {/* Khajiit fur whiskers (with twitch animation) */}
      {raceDef.ear_type === 'cat' && (
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
    </>
  );
};
