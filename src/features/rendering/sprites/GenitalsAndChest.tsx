import React from 'react';
import { BodyGeom, SpriteState } from './utils';
import { RacialBodyFeatures } from '../../../data/races';

interface GenitalsAndChestProps {
  geom: BodyGeom;
  s: SpriteState;
  skin: string;
  hairClr: string;
  raceDef: RacialBodyFeatures;
  isMale: boolean;
  isFemale: boolean;
  isChestExposed: boolean;
  isGroinExposed: boolean;
  isLegsExposed: boolean;
  isAroused: boolean;
  isLactating: boolean;
  nippleClr: string;
}

export const GenitalsAndChest: React.FC<GenitalsAndChestProps> = ({ geom, s, skin, hairClr, raceDef, isMale, isFemale, isChestExposed, isGroinExposed, isLegsExposed, isAroused, isLactating, nippleClr }) => {
  return (
    <>
      {/* ── NAVEL ── */}
      {isChestExposed && (
        <circle cx={s.cx} cy={geom.navelY} r="1.3" fill={`${skin}60`} />
      )}

      {/* Female bust (with bounce animation, Hikari-quality shading) */}
      {geom.bustR > 0 && isChestExposed && (
        <g className="sprite-bust-bounce" style={{ transformOrigin: `${s.cx}px ${geom.bustY - geom.bustR}px` }}>
          {/* Base bust shapes with radial gradients */}
          <ellipse cx={s.cx - geom.shoulderHW * 0.38} cy={geom.bustY} rx={geom.bustR} ry={geom.bustR * 0.82} fill="url(#bust-shade-l)" />
          <ellipse cx={s.cx + geom.shoulderHW * 0.38} cy={geom.bustY} rx={geom.bustR} ry={geom.bustR * 0.82} fill="url(#bust-shade-r)" />
          {/* Top-side highlight (specular) */}
          <ellipse cx={s.cx - geom.shoulderHW * 0.38 - geom.bustR * 0.15} cy={geom.bustY - geom.bustR * 0.25}
            rx={geom.bustR * 0.3} ry={geom.bustR * 0.2} fill="rgba(255,255,255,0.12)" />
          <ellipse cx={s.cx + geom.shoulderHW * 0.38 - geom.bustR * 0.1} cy={geom.bustY - geom.bustR * 0.25}
            rx={geom.bustR * 0.3} ry={geom.bustR * 0.2} fill="rgba(255,255,255,0.12)" />
        </g>
      )}
      {/* Male pec lines */}
      {geom.showPecs && isChestExposed && (
        <>
          <path d={`M ${s.cx-3},${s.shldY+12} Q ${s.cx - geom.shoulderHW * 0.65},${s.shldY+22} ${s.cx-3},${s.shldY+28}`} fill="none" stroke={`${skin}88`} strokeWidth="0.8" />
          <path d={`M ${s.cx+3},${s.shldY+12} Q ${s.cx + geom.shoulderHW * 0.65},${s.shldY+22} ${s.cx+3},${s.shldY+28}`} fill="none" stroke={`${skin}88`} strokeWidth="0.8" />
        </>
      )}

      {/* ── COLLARBONE (when chest exposed) ── */}
      {isChestExposed && (
        <>
          <path d={`M ${s.cx - 1},${s.shldY + 2} Q ${s.cx - geom.shoulderHW * 0.65},${s.shldY - 2} ${s.cx - geom.shoulderHW * 0.92},${s.shldY + 3}`}
            fill="none" stroke={`${skin}55`} strokeWidth={isMale ? '1.1'': '0.75'} strokeLinecap="round" />
          <path d={`M ${s.cx + 1},${s.shldY + 2} Q ${s.cx + geom.shoulderHW * 0.65},${s.shldY - 2} ${s.cx + geom.shoulderHW * 0.92},${s.shldY + 3}`}
            fill="none" stroke={`${skin}55`} strokeWidth={isMale ? '1.1'': '0.75'} strokeLinecap="round" />
        </>
      )}

      {/* ── FEMALE NIPPLES (when chest exposed) ── */}
      {isChestExposed && isFemale && geom.bustR > 0 && (
        <>
          {/* Left areola + nipple */}
          <circle cx={s.cx - geom.shoulderHW * 0.38} cy={geom.bustY}
            r={geom.bustR * 0.32} fill={`${skin}aa`} />
          <circle cx={s.cx - geom.shoulderHW * 0.38} cy={geom.bustY}
            r={isAroused ? geom.bustR * 0.18 : geom.bustR * 0.13}
            fill={nippleClr} />
          {/* Right areola + nipple */}
          <circle cx={s.cx + geom.shoulderHW * 0.38} cy={geom.bustY}
            r={geom.bustR * 0.32} fill={`${skin}aa`} />
          <circle cx={s.cx + geom.shoulderHW * 0.38} cy={geom.bustY}
            r={isAroused ? geom.bustR * 0.18 : geom.bustR * 0.13}
            fill={nippleClr} />
          {/* Lactation drip marks (animated) */}
          {isLactating && (
            <>
              <g className="sprite-drip">
                <ellipse cx={s.cx - geom.shoulderHW * 0.38}
                  cy={geom.bustY + geom.bustR * 0.5} rx="0.7" ry="1.5"
                  fill="rgba(255,255,255,0.30)" />
              </g>
              <g className="sprite-drip-delay">
                <ellipse cx={s.cx + geom.shoulderHW * 0.38}
                  cy={geom.bustY + geom.bustR * 0.5} rx="0.7" ry="1.5"
                  fill="rgba(255,255,255,0.30)" />
              </g>
            </>
          )}
        </>
      )}

      {/* ── MALE NIPPLES (when chest exposed) ── */}
      {isChestExposed && isMale && (
        <>
          <circle cx={s.cx - geom.shoulderHW * 0.42} cy={s.shldY + 20} r="1.0" fill={nippleClr} />
          <circle cx={s.cx + geom.shoulderHW * 0.42} cy={s.shldY + 20} r="1.0" fill={nippleClr} />
        </>
      )}

      {/* ── MALE BODY HAIR (chest & torso, when exposed) ── */}
      {isChestExposed && geom.showBodyHair && raceDef.skin_type === 'skin''&& (
        <g opacity="0.18">
          {/* Chest scatter */}
          {([-4, -2, 0, 2, 4] as const).map((dx, i) => (
            <circle key={`ch-${i}`}
              cx={s.cx + dx * 2.2} cy={s.shldY + 24 + (Math.abs(dx) % 2) * 4}
              r="0.75" fill={hairClr} />
          ))}
          <circle cx={s.cx} cy={s.shldY + 34} r="0.7" fill={hairClr} />
          {/* Happy trail */}
          {[0, 1, 2].map((dy, i) => (
            <circle key={`ht-${i}`} cx={s.cx} cy={s.waistY - 22 + dy * 6} r="0.55" fill={hairClr} />
          ))}
        </g>
      )}

      {/* ── INNER THIGH CONTOUR (when legs exposed) ── */}
      {isLegsExposed && (
        <g>
          {isFemale ? (
            // Female: smooth rounded inner thigh curves
            <>
              <path d={`M ${s.legLX + geom.thighW * 0.22},${s.crotchY + 4} Q ${s.legLX + geom.thighW * 0.08},${s.crotchY + 32} ${s.legLX + geom.thighW * 0.18},${s.kneeY - 8}`}
                fill="none" stroke={`${skin}38`} strokeWidth="0.7" strokeLinecap="round" />
              <path d={`M ${s.legRX - geom.thighW * 0.22},${s.crotchY + 4} Q ${s.legRX - geom.thighW * 0.08},${s.crotchY + 32} ${s.legRX - geom.thighW * 0.18},${s.kneeY - 8}`}
                fill="none" stroke={`${skin}38`} strokeWidth="0.7" strokeLinecap="round" />
            </>
          ) : (
            // Male: sharper quad-sweep outer line
            <>
              <path d={`M ${s.legLX - geom.thighW * 0.28},${s.crotchY + 6} Q ${s.legLX - geom.thighW * 0.38},${s.crotchY + 30} ${s.legLX - geom.thighW * 0.2},${s.kneeY - 10}`}
                fill="none" stroke={`${skin}35`} strokeWidth="0.75" strokeLinecap="round" />
              <path d={`M ${s.legRX + geom.thighW * 0.28},${s.crotchY + 6} Q ${s.legRX + geom.thighW * 0.38},${s.crotchY + 30} ${s.legRX + geom.thighW * 0.2},${s.kneeY - 10}`}
                fill="none" stroke={`${skin}35`} strokeWidth="0.75" strokeLinecap="round" />
            </>
          )}
        </g>
      )}
      {/* Quad/calf muscle definition for athletic builds */}
      {geom.showMuscleDef && isLegsExposed && (
        <g>
          <path d={`M ${s.legLX + geom.thighW * 0.3},${s.crotchY + 8} Q ${s.legLX + geom.thighW * 0.42},${s.crotchY + 28} ${s.legLX + geom.thighW * 0.22},${s.kneeY - 12}`}
            fill="none" stroke={`${skin}38`} strokeWidth="0.65" />
          <path d={`M ${s.legRX - geom.thighW * 0.3},${s.crotchY + 8} Q ${s.legRX - geom.thighW * 0.42},${s.crotchY + 28} ${s.legRX - geom.thighW * 0.22},${s.kneeY - 12}`}
            fill="none" stroke={`${skin}38`} strokeWidth="0.65" />
        </g>
      )}

      {/* ── GROIN ANATOMY (when underwear absent / destroyed) ── */}
      {isGroinExposed && isFemale && (
        <>
          {/* Mons pubis */}
          <ellipse cx={s.cx} cy={s.crotchY - 4} rx="4.5" ry="3.2" fill={skin} />
          {/* Labia major – two converging curves */}
          <path d={`M ${s.cx - 2.2},${s.crotchY - 2} Q ${s.cx - 2},${s.crotchY + 4} ${s.cx},${s.crotchY + 8}`}
            fill="none" stroke={`${skin}cc`} strokeWidth="1.3" strokeLinecap="round" />
          <path d={`M ${s.cx + 2.2},${s.crotchY - 2} Q ${s.cx + 2},${s.crotchY + 4} ${s.cx},${s.crotchY + 8}`}
            fill="none" stroke={`${skin}cc`} strokeWidth="1.3" strokeLinecap="round" />
          {/* Labia minor hint */}
          <path d={`M ${s.cx - 1},${s.crotchY - 1} Q ${s.cx - 0.8},${s.crotchY + 3} ${s.cx},${s.crotchY + 6}`}
            fill="none" stroke={`${nippleClr}88`} strokeWidth="0.7" strokeLinecap="round" />
          <path d={`M ${s.cx + 1},${s.crotchY - 1} Q ${s.cx + 0.8},${s.crotchY + 3} ${s.cx},${s.crotchY + 6}`}
            fill="none" stroke={`${nippleClr}88`} strokeWidth="0.7" strokeLinecap="round" />
          {/* Arousal flush */}
          {isAroused && (
            <ellipse cx={s.cx} cy={s.crotchY} rx="4" ry="5"
              fill="rgba(255,80,100,0.14)" />
          )}
          {/* Pubic hair (skin races only) */}
          {raceDef.skin_type === 'skin''&& (
            <g opacity="0.22">
              {([-3, -1, 1, 3] as const).map((dx, i) => (
                <ellipse key={`pfh-${i}`}
                  cx={s.cx + dx} cy={s.crotchY - 8 + (Math.abs(dx) % 2)}
                  rx="0.75" ry="1.3" fill={hairClr} />
              ))}
            </g>
          )}
        </>
      )}
      {isGroinExposed && isMale && (
        <>
          {/* Pubic hair */}
          {geom.showBodyHair && raceDef.skin_type === 'skin''&& (
            <g opacity="0.22">
              {([-4, -2, 0, 2, 4] as const).map((dx, i) => (
                <ellipse key={`mph-${i}`}
                  cx={s.cx + dx} cy={s.crotchY - 15 + (Math.abs(dx) % 2)}
                  rx="0.7" ry="1.5" fill={hairClr} />
              ))}
            </g>
          )}
          {/* Shaft – longer & angled up when aroused */}
          {isAroused ? (
            <>
              <rect x={s.cx - 2.5} y={s.crotchY - 16} width="5" height="14" rx="2.5" fill={skin} />
              <ellipse cx={s.cx} cy={s.crotchY - 17} rx="3" ry="2.5" fill={skin} />
            </>
          ) : (
            <>
              <rect x={s.cx - 2} y={s.crotchY - 8} width="4" height="8" rx="2" fill={skin} />
              <ellipse cx={s.cx} cy={s.crotchY - 9} rx="2.5" ry="2" fill={skin} />
            </>
          )}
          {/* Scrotum */}
          <ellipse cx={s.cx - 2.2} cy={s.crotchY + 5} rx="3" ry="2.5" fill={skin} />
          <ellipse cx={s.cx + 2.2} cy={s.crotchY + 5} rx="3" ry="2.5" fill={skin} />
          {/* Glans corona outline */}
          {isAroused && (
            <ellipse cx={s.cx} cy={s.crotchY - 17} rx="3.2" ry="2.7"
              fill="none" stroke={`${nippleClr}70`} strokeWidth="0.6" />
          )}
        </>
      )}
      {/* Non-binary / unknown – neutral mons (no detail) */}
      {isGroinExposed && !isMale && !isFemale && (
        <ellipse cx={s.cx} cy={s.crotchY - 2} rx="4" ry="2.8" fill={skin} />
      )}

      {/* ── UNDER-BUST / RIBCAGE LINES ── */}
      {isChestExposed && isFemale && geom.bustR > 0 && (
        <>
          {/* Under-bust crease lines */}
          <path d={`M ${s.cx - geom.shoulderHW * 0.55},${geom.bustY + geom.bustR * 0.65} Q ${s.cx - geom.shoulderHW * 0.35},${geom.bustY + geom.bustR * 0.85} ${s.cx - geom.shoulderHW * 0.1},${geom.bustY + geom.bustR * 0.7}`}
            fill="none" stroke={`${skin}40`} strokeWidth="0.6" strokeLinecap="round" />
          <path d={`M ${s.cx + geom.shoulderHW * 0.55},${geom.bustY + geom.bustR * 0.65} Q ${s.cx + geom.shoulderHW * 0.35},${geom.bustY + geom.bustR * 0.85} ${s.cx + geom.shoulderHW * 0.1},${geom.bustY + geom.bustR * 0.7}`}
            fill="none" stroke={`${skin}40`} strokeWidth="0.6" strokeLinecap="round" />
        </>
      )}
      {/* Ribcage hint (slim/wiry builds when chest exposed) */}
      {isChestExposed && ['wiry','slim'].includes(raceDef.build) && (
        <g opacity="0.12">
          {[0, 5, 10].map((dy, i) => (
            <React.Fragment key={`rib-${i}`}>
              <path d={`M ${s.cx - 2},${s.shldY + 26 + dy} Q ${s.cx - geom.shoulderHW * 0.5},${s.shldY + 28 + dy} ${s.cx - geom.shoulderHW * 0.35},${s.shldY + 26 + dy}`}
                fill="none" stroke={skin} strokeWidth="0.5" />
              <path d={`M ${s.cx + 2},${s.shldY + 26 + dy} Q ${s.cx + geom.shoulderHW * 0.5},${s.shldY + 28 + dy} ${s.cx + geom.shoulderHW * 0.35},${s.shldY + 26 + dy}`}
                fill="none" stroke={skin} strokeWidth="0.5" />
            </React.Fragment>
          ))}
        </g>
      )}

      {/* ── LINEA ALBA (midline belly definition) ── */}
      {isChestExposed && raceDef.skin_type === 'skin''&& (
        <path d={`M ${s.cx},${s.shldY + 30} L ${s.cx},${s.hipTopY - 2}`}
          fill="none" stroke={`${skin}22`} strokeWidth="0.5" />
      )}

      {/* ── HIP BONE DEFINITION (slim/wiry when groin area exposed) ── */}
      {(isGroinExposed || isLegsExposed) && ['wiry','slim'].includes(raceDef.build) && (
        <>
          <path d={`M ${s.cx - geom.waistHW * 0.3},${s.waistY + 2} Q ${s.cx - geom.hipHW * 0.65},${s.hipTopY + 2} ${s.cx - geom.hipHW * 0.45},${s.hipTopY + 6}`}
            fill="none" stroke={`${skin}30`} strokeWidth="0.6" strokeLinecap="round" />
          <path d={`M ${s.cx + geom.waistHW * 0.3},${s.waistY + 2} Q ${s.cx + geom.hipHW * 0.65},${s.hipTopY + 2} ${s.cx + geom.hipHW * 0.45},${s.hipTopY + 6}`}
            fill="none" stroke={`${skin}30`} strokeWidth="0.6" strokeLinecap="round" />
        </>
      )}

    </>
  );
};
