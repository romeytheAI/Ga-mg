import React from 'react';
import { BodyGeom, SpriteState } from './utils';
import { RacialBodyFeatures } from '../../../data/races';

interface StatusEffectsProps {
  geom: BodyGeom;
  s: SpriteState;
  raceDef: RacialBodyFeatures;
  isChestExposed: boolean;
  isLegsExposed: boolean;
  blushIntensity: number;
  isSweating: boolean;
  showHeartOverlay: boolean;
  showCorruptionFx: boolean;
  inEncounter: boolean;
  targetedPart: string | null;
  playerStance: string;
  combatAnim: string | null;
  compact: boolean;
  svgW: number;
  svgH: number;
  lowHealth: boolean;
  corruption: boolean;
  hallucination: number;
  parasites: any[];
}

export const StatusEffects: React.FC<StatusEffectsProps> = ({ geom, s, raceDef, isChestExposed, isLegsExposed, blushIntensity, isSweating, showHeartOverlay, showCorruptionFx, inEncounter, targetedPart, playerStance, combatAnim, compact, svgW, svgH, lowHealth, corruption, hallucination, parasites }) => {
  return (
    <>
      {/* ── MULTI-ZONE BLUSH/FLUSH (DoL parity) ── */}
      {blushIntensity > 0.15 && (
        <g>
          {/* Cheek blush – scales with intensity */}
          <ellipse cx={s.cx - 5.5} cy={s.headCY + 3} rx={3.5 + blushIntensity * 1.5} ry={2 + blushIntensity}
            fill={`rgba(255,90,90,${0.12 + blushIntensity * 0.28})`} />
          <ellipse cx={s.cx + 5.5} cy={s.headCY + 3} rx={3.5 + blushIntensity * 1.5} ry={2 + blushIntensity}
            fill={`rgba(255,90,90,${0.12 + blushIntensity * 0.28})`} />
          {/* Ear-tip blush */}
          {raceDef.ear_type === 'pointed_long' && (
            <>
              <circle cx={s.cx - geom.headRX - 8} cy={s.headCY - 10} r="2.5"
                fill={`rgba(255,70,80,${blushIntensity * 0.3})`} />
              <circle cx={s.cx + geom.headRX + 8} cy={s.headCY - 10} r="2.5"
                fill={`rgba(255,70,80,${blushIntensity * 0.3})`} />
            </>
          )}
          {raceDef.ear_type === 'pointed_short' && (
            <>
              <circle cx={s.cx - geom.headRX - 4} cy={s.headCY - 5} r="2"
                fill={`rgba(255,70,80,${blushIntensity * 0.25})`} />
              <circle cx={s.cx + geom.headRX + 4} cy={s.headCY - 5} r="2"
                fill={`rgba(255,70,80,${blushIntensity * 0.25})`} />
            </>
          )}
          {/* Chest flush (when exposed, high blush) */}
          {isChestExposed && blushIntensity > 0.4 && (
            <ellipse cx={s.cx} cy={s.shldY + 16} rx={geom.shoulderHW * 0.7} ry="8"
              fill={`rgba(255,80,90,${(blushIntensity - 0.4) * 0.2})`} />
          )}
          {/* Inner thigh flush (when legs exposed, high blush) */}
          {isLegsExposed && blushIntensity > 0.5 && (
            <>
              <ellipse cx={s.legLX + geom.thighW * 0.15} cy={s.crotchY + 18} rx="5" ry="12"
                fill={`rgba(255,80,100,${(blushIntensity - 0.5) * 0.15})`} />
              <ellipse cx={s.legRX - geom.thighW * 0.15} cy={s.crotchY + 18} rx="5" ry="12"
                fill={`rgba(255,80,100,${(blushIntensity - 0.5) * 0.15})`} />
            </>
          )}
        </g>
      )}

      {/* ── SWEAT / WETNESS MARKS (animated) ── */}
      {isSweating && (
        <g>
          {/* Forehead sweat drops (animated falling) */}
          <g className="sprite-sweat-fall">
            <ellipse cx={s.cx - 3} cy={s.headCY - geom.headRY * 0.65} rx="0.6" ry="1.2"
              fill="rgba(200,220,255,0.35)" />
          </g>
          <g className="sprite-sweat-fall-b">
            <ellipse cx={s.cx + 5} cy={s.headCY - geom.headRY * 0.55} rx="0.5" ry="1"
              fill="rgba(200,220,255,0.3)" />
          </g>
          {/* Neck sweat */}
          <g className="sprite-sweat-fall">
            <ellipse cx={s.cx + 2} cy={s.neckTopY + 5} rx="0.5" ry="1.3"
              fill="rgba(200,220,255,0.25)" />
          </g>
          {/* Chest sweat (when exposed) */}
          {isChestExposed && (
            <>
              <ellipse cx={s.cx} cy={s.shldY + 28} rx="0.5" ry="1.5"
                fill="rgba(200,220,255,0.22)" />
              <ellipse cx={s.cx + 4} cy={s.shldY + 22} rx="0.4" ry="1"
                fill="rgba(200,220,255,0.18)" />
            </>
          )}
          {/* Body sheen */}
          {isChestExposed && (
            <ellipse cx={s.cx} cy={s.shldY + 15} rx={geom.shoulderHW * 0.5} ry="14"
              fill="rgba(255,255,255,0.06)" />
          )}
        </g>
      )}

      {lowHealth && (
        <>
          <circle cx={s.cx - geom.shoulderHW * 0.6} cy={s.shldY + 18} r="2.5" fill="rgba(200,0,0,0.38)" />
          <circle cx={s.cx + geom.shoulderHW * 0.4} cy={s.waistY - 8} r="2" fill="rgba(200,0,0,0.32)" />
        </>
      )}
      {corruption && (
        <ellipse cx={s.cx} cy={(s.headCY + s.footBotY) / 2} rx="52" ry="110" fill="none" stroke="rgba(160,0,220,0.18)" strokeWidth="3.5" />
      )}

      {/* ── HALLUCINATION FX (DoL Parity) ── */}
      {hallucination > 20 && (
        <g opacity={(hallucination - 20) / 80}>
          <circle cx={s.cx - 20} cy={s.headCY - 15} r="2" fill="rgba(255,0,255,0.4)" className="animate-ping" />
          <circle cx={s.cx + 25} cy={s.waistY} r="3" fill="rgba(0,255,255,0.3)" className="animate-pulse" />
          <circle cx={s.cx - 15} cy={s.kneeY} r="1.5" fill="rgba(255,255,0,0.4)" className="animate-ping" />
        </g>
      )}

      {/* ── PARASITES (DoL Parity) ── */}
      {parasites && parasites.length > 0 && (
        <g>
          {parasites.map((p, i) => (
            <ellipse key={`parasite-${i}`} cx={s.cx + (i % 2 === 0 ? 8 : -8)} cy={s.waistY + 5 + i * 4} rx="1.5" ry="2.5" fill="rgba(200,50,50,0.7)" stroke="rgba(100,0,0,0.8)" strokeWidth="0.5" className="animate-pulse" />
          ))}
        </g>
      )}

      {/* ── HEART OVERLAY (high arousal / lust) ── */}
      {showHeartOverlay && !compact && (
        <g className="sprite-heart-pulse" style={{ transformOrigin: `${s.cx}px ${s.headCY - geom.headRY - 8}px` }}>
          <text x={s.cx} y={s.headCY - geom.headRY - 5} textAnchor="middle"
            fill="rgba(255,80,120,0.7)" fontSize="10" fontFamily="serif">♥</text>
        </g>
      )}

      {/* ── CORRUPTION TENDRILS (high corruption) ── */}
      {showCorruptionFx && !compact && (
        <g className="sprite-corruption-pulse">
          {/* Left tendril */}
          <path d={`M ${s.cx - geom.shoulderHW - 3},${s.waistY + 5} Q ${s.cx - geom.shoulderHW - 10},${s.waistY - 15} ${s.cx - geom.shoulderHW - 6},${s.waistY - 35}`}
            fill="none" stroke="rgba(140,0,200,0.25)" strokeWidth="2" strokeLinecap="round" />
          {/* Right tendril */}
          <path d={`M ${s.cx + geom.shoulderHW + 3},${s.waistY + 5} Q ${s.cx + geom.shoulderHW + 10},${s.waistY - 15} ${s.cx + geom.shoulderHW + 6},${s.waistY - 35}`}
            fill="none" stroke="rgba(140,0,200,0.25)" strokeWidth="2" strokeLinecap="round" />
          {/* Bottom tendril */}
          <path d={`M ${s.cx},${s.crotchY + 8} Q ${s.cx - 5},${s.crotchY + 18} ${s.cx + 2},${s.crotchY + 28}`}
            fill="none" stroke="rgba(140,0,200,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Corruption motes */}
          {[
            [s.cx - 15, s.shldY + 12], [s.cx + 12, s.waistY - 8],
            [s.cx - 8, s.crotchY + 15], [s.cx + 16, s.shldY + 25],
          ].map(([mx, my], i) => (
            <circle key={`cmt-${i}`} cx={mx} cy={my} r="1.2"
              fill="rgba(160,0,220,0.2)" />
          ))}
        </g>
      )}

      {/* ── ENCOUNTER: TARGETED BODY PART HIGHLIGHT ── */}
      {inEncounter && targetedPart && (
        <g className="sprite-target-pulse">
          {targetedPart === 'head' && (
            <ellipse cx={s.cx} cy={s.headCY} rx={geom.headRX + 3} ry={geom.headRY + 3}
              fill="none" stroke="rgba(255,60,60,0.5)" strokeWidth="1.5" strokeDasharray="3 2" />
          )}
          {targetedPart === 'torso' && (
            <rect x={s.cx - geom.shoulderHW - 2} y={s.shldY - 2} width={geom.shoulderHW * 2 + 4} height={s.waistY - s.shldY + 4} rx="4"
              fill="none" stroke="rgba(255,60,60,0.5)" strokeWidth="1.5" strokeDasharray="3 2" />
          )}
          {targetedPart === 'arms' && (
            <>
              <rect x={s.shLX - geom.upperArmW} y={s.shldY - 2} width={geom.upperArmW * 2} height={s.wrY - s.shldY + 10} rx="3"
                fill="none" stroke="rgba(255,60,60,0.5)" strokeWidth="1.2" strokeDasharray="3 2" />
              <rect x={s.shRX - geom.upperArmW} y={s.shldY - 2} width={geom.upperArmW * 2} height={s.wrY - s.shldY + 10} rx="3"
                fill="none" stroke="rgba(255,60,60,0.5)" strokeWidth="1.2" strokeDasharray="3 2" />
            </>
          )}
          {targetedPart === 'legs' && (
            <>
              <rect x={s.legLX - geom.thighW / 2 - 2} y={s.crotchY - 2} width={geom.thighW + 4} height={s.ankleY - s.crotchY + 4} rx="4"
                fill="none" stroke="rgba(255,60,60,0.5)" strokeWidth="1.2" strokeDasharray="3 2" />
              <rect x={s.legRX - geom.thighW / 2 - 2} y={s.crotchY - 2} width={geom.thighW + 4} height={s.ankleY - s.crotchY + 4} rx="4"
                fill="none" stroke="rgba(255,60,60,0.5)" strokeWidth="1.2" strokeDasharray="3 2" />
            </>
          )}
        </g>
      )}

      {/* ── ENCOUNTER: STANCE VISUAL INDICATORS ── */}
      {inEncounter && !compact && (
        <g>
          {/* Defensive stance shield icon */}
          {playerStance === 'defensive' && (
            <g opacity="0.35">
              <path d={`M ${s.cx - 20},${s.shldY + 15} L ${s.cx - 20},${s.shldY + 30} Q ${s.cx - 20},${s.shldY + 38} ${s.cx - 15},${s.shldY + 40} Q ${s.cx - 20},${s.shldY + 38} ${s.cx - 20},${s.shldY + 15} Z`}
                fill="rgba(100,150,255,0.3)" stroke="rgba(100,150,255,0.5)" strokeWidth="0.8" />
            </g>
          )}
          {/* Aggressive stance fire glow */}
          {playerStance === 'aggressive' && (
            <>
              <circle cx={s.wrRX + 3} cy={s.handCY} r="4" fill="rgba(255,80,30,0.2)" />
              <circle cx={s.wrRX + 3} cy={s.handCY} r="2" fill="rgba(255,120,40,0.3)" />
            </>
          )}
          {/* Submissive stance down arrows */}
          {playerStance === 'submissive' && (
            <g opacity="0.3">
              <text x={s.cx - 18} y={s.shldY + 20} fill="rgba(180,120,255,0.6)" fontSize="6">↓</text>
              <text x={s.cx + 16} y={s.shldY + 25} fill="rgba(180,120,255,0.5)" fontSize="5">↓</text>
            </g>
          )}
        </g>
      )}

      {/* ── ENCOUNTER: HIT FLASH EFFECT ── */}
      {combatAnim === 'parry' && (
        <rect x="0" y="0" width={svgW} height={svgH} fill="rgba(255,255,255,0.08)" />
      )}
    </>
  );
};
