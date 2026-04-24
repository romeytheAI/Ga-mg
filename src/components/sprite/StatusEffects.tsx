import React from 'react';
import { BodyGeom, SpriteState } from './utils';
import { RacialBodyFeatures } from '../../data/races';
import { EncounterAction } from '../../types';

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
  /** Active DoL encounter action affecting the player sprite. */
  encounterAction: EncounterAction | string;
  compact: boolean;
  svgW: number;
  svgH: number;
  lowHealth: boolean;
  corruption: boolean;
  hallucination: number;
  parasites: any[];
}

export const StatusEffects: React.FC<StatusEffectsProps> = ({ geom, s, raceDef, isChestExposed, isLegsExposed, blushIntensity, isSweating, showHeartOverlay, showCorruptionFx, inEncounter, targetedPart, playerStance, combatAnim, encounterAction, compact, svgW, svgH, lowHealth, corruption, hallucination, parasites }) => {
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

      {/* ═══════════════════════════════════════════════════════════════════
           DoL-parity encounter ACTION overlays — high-fidelity contact
           indicators, enemy hand silhouettes, fluid FX, impact rings
         ═══════════════════════════════════════════════════════════════════ */}
      {inEncounter && encounterAction !== 'none' && !compact && (
        <g>
          {/* ── GRABBED: enemy hand silhouettes on arms ── */}
          {encounterAction === 'grabbed' && (
            <g className="sprite-enc-hand-pulse">
              {/* Left wrist grip */}
              <ellipse cx={s.shLX} cy={s.wrY - 4} rx={geom.upperArmW + 1} ry="3.5"
                fill="none" stroke="rgba(80,0,0,0.35)" strokeWidth="1.2" />
              <ellipse cx={s.shLX} cy={s.wrY - 4} rx={geom.upperArmW - 0.5} ry="2.5"
                fill="rgba(80,0,0,0.12)" />
              {/* Right wrist grip */}
              <ellipse cx={s.shRX} cy={s.wrY - 4} rx={geom.upperArmW + 1} ry="3.5"
                fill="none" stroke="rgba(80,0,0,0.35)" strokeWidth="1.2" />
              <ellipse cx={s.shRX} cy={s.wrY - 4} rx={geom.upperArmW - 0.5} ry="2.5"
                fill="rgba(80,0,0,0.12)" />
              {/* Finger impression marks */}
              {[0, 1, 2, 3].map(i => (
                <circle key={`grip-l-${i}`} cx={s.shLX - geom.upperArmW + i * 2} cy={s.wrY - 4 - 1.5}
                  r="0.8" fill="rgba(100,0,0,0.2)" />
              ))}
              {[0, 1, 2, 3].map(i => (
                <circle key={`grip-r-${i}`} cx={s.shRX - geom.upperArmW + i * 2} cy={s.wrY - 4 - 1.5}
                  r="0.8" fill="rgba(100,0,0,0.2)" />
              ))}
            </g>
          )}

          {/* ── GROPED: pressure zones on torso/chest ── */}
          {encounterAction === 'groped' && (
            <g className="sprite-enc-hand-pulse">
              {/* Hand shape on torso side */}
              <ellipse cx={s.cx + geom.shoulderHW * 0.6} cy={s.waistY - 6} rx="4.5" ry="6"
                fill="rgba(180,40,60,0.12)" stroke="rgba(180,40,60,0.2)" strokeWidth="0.6" />
              {/* Finger tips */}
              {[0, 1, 2, 3, 4].map(i => (
                <circle key={`grope-f-${i}`}
                  cx={s.cx + geom.shoulderHW * 0.6 - 3 + i * 1.5}
                  cy={s.waistY - 11}
                  r="0.6" fill="rgba(180,40,60,0.25)" />
              ))}
              {/* Opposite side subtle touch */}
              <ellipse cx={s.cx - geom.shoulderHW * 0.5} cy={s.shldY + 18} rx="3.5" ry="5"
                fill="rgba(180,40,60,0.08)" />
            </g>
          )}

          {/* ── THRUST: rhythmic impact indicators at pelvis ── */}
          {encounterAction === 'thrust' && (
            <g>
              {/* Impact zone glow */}
              <ellipse cx={s.cx} cy={s.crotchY} rx="8" ry="5"
                fill="rgba(255,80,120,0.15)" className="sprite-enc-hand-pulse" />
              {/* Motion lines */}
              <line x1={s.cx - 12} y1={s.crotchY + 2} x2={s.cx - 8} y2={s.crotchY}
                stroke="rgba(255,100,100,0.2)" strokeWidth="0.5" strokeLinecap="round" />
              <line x1={s.cx + 8} y1={s.crotchY} x2={s.cx + 12} y2={s.crotchY + 2}
                stroke="rgba(255,100,100,0.2)" strokeWidth="0.5" strokeLinecap="round" />
              {/* Contact pressure indicator */}
              <ellipse cx={s.cx + 2} cy={s.crotchY - 3} rx="3" ry="2"
                fill="rgba(255,60,100,0.1)" className="sprite-enc-hand-pulse" />
            </g>
          )}

          {/* ── ORAL: hand on head + pressure zone ── */}
          {encounterAction === 'oral' && (
            <g className="sprite-enc-hand-pulse">
              {/* Hand gripping head */}
              <ellipse cx={s.cx + geom.headRX * 0.7} cy={s.headCY - 2} rx="4" ry="5.5"
                fill="rgba(80,0,0,0.1)" stroke="rgba(80,0,0,0.2)" strokeWidth="0.6" />
              {/* Jaw pressure */}
              <ellipse cx={s.cx} cy={s.headCY + geom.headRY * 0.7} rx="4" ry="2.5"
                fill="rgba(255,80,80,0.1)" />
            </g>
          )}

          {/* ── KISSED: lip contact marks ── */}
          {encounterAction === 'kissed' && (
            <g>
              <ellipse cx={s.cx + 1} cy={s.headCY + geom.headRY * 0.45} rx="2.5" ry="1.5"
                fill="rgba(255,80,120,0.25)" className="sprite-enc-hand-pulse" />
              {/* Breath wisps */}
              <ellipse cx={s.cx + 6} cy={s.headCY + geom.headRY * 0.3} rx="2" ry="1"
                fill="rgba(255,200,200,0.1)" />
            </g>
          )}

          {/* ── CLIMAX: full-body flush + fluid effects ── */}
          {encounterAction === 'climax' && (
            <g>
              {/* Full-body flush */}
              <ellipse cx={s.cx} cy={s.waistY} rx={geom.shoulderHW + 5} ry="40"
                fill="rgba(255,60,100,0.08)" />
              {/* Fluid drip effects */}
              <g className="sprite-enc-fluid-drip">
                <ellipse cx={s.cx - 3} cy={s.crotchY + 5} rx="0.8" ry="2"
                  fill="rgba(255,220,230,0.35)" />
              </g>
              <g className="sprite-enc-fluid-drip-b">
                <ellipse cx={s.cx + 2} cy={s.crotchY + 8} rx="0.6" ry="1.5"
                  fill="rgba(255,220,230,0.3)" />
              </g>
              {/* Ecstasy stars */}
              {[[-8, -18], [10, -15], [-5, -22], [7, -20]].map(([ox, oy], i) => (
                <text key={`star-${i}`} x={s.cx + ox} y={s.headCY + oy}
                  fill={`rgba(255,200,220,${0.3 + i * 0.1})`} fontSize="4"
                  className="animate-ping" style={{ animationDelay: `${i * 0.2}s` }}>✦</text>
              ))}
            </g>
          )}

          {/* ── RESIST BREAK: cracks + broken shield ── */}
          {encounterAction === 'resist_break' && (
            <g>
              {/* Shatter lines radiating from center */}
              {[[-15, -8], [12, -5], [-8, 10], [14, 8], [0, -12]].map(([ox, oy], i) => (
                <line key={`crack-${i}`}
                  x1={s.cx} y1={s.waistY}
                  x2={s.cx + ox} y2={s.waistY + oy}
                  stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" strokeLinecap="round" />
              ))}
              {/* Impact ring */}
              <circle cx={s.cx} cy={s.waistY} r="12"
                fill="none" stroke="rgba(255,200,100,0.3)" strokeWidth="0.8"
                className="sprite-enc-impact-ring" />
            </g>
          )}

          {/* ── CLOTHING TEAR: rip lines + fabric shards ── */}
          {encounterAction === 'clothing_tear' && (
            <g>
              {/* Tear lines across torso */}
              <line x1={s.cx - geom.shoulderHW * 0.3} y1={s.shldY + 10}
                    x2={s.cx + geom.shoulderHW * 0.5} y2={s.waistY - 5}
                stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" strokeDasharray="2 1.5" />
              <line x1={s.cx + geom.shoulderHW * 0.2} y1={s.shldY + 8}
                    x2={s.cx - geom.shoulderHW * 0.4} y2={s.waistY}
                stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="1.5 2" />
              {/* Fabric shards flying */}
              {[[5, -6, 2], [-7, -4, 1.5], [8, -2, 1.8], [-4, -8, 1.2]].map(([ox, oy, sz], i) => (
                <rect key={`shard-${i}`}
                  x={s.cx + ox} y={s.waistY + oy} width={sz} height={sz * 0.6}
                  fill="rgba(200,180,160,0.35)" transform={`rotate(${45 + i * 30} ${s.cx + ox} ${s.waistY + oy})`}
                  className="animate-ping" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </g>
          )}

          {/* ── LEG SPREAD: inner thigh highlights ── */}
          {encounterAction === 'leg_spread' && (
            <g className="sprite-enc-hand-pulse">
              {/* Inner thigh pressure zones */}
              <ellipse cx={s.legLX + geom.thighW * 0.3} cy={s.crotchY + 12} rx="4" ry="8"
                fill="rgba(255,80,100,0.1)" stroke="rgba(255,80,100,0.15)" strokeWidth="0.5" />
              <ellipse cx={s.legRX - geom.thighW * 0.3} cy={s.crotchY + 12} rx="4" ry="8"
                fill="rgba(255,80,100,0.1)" stroke="rgba(255,80,100,0.15)" strokeWidth="0.5" />
              {/* Hands on knees */}
              <ellipse cx={s.legLX - 1} cy={s.kneeY - 3} rx="3.5" ry="4"
                fill="rgba(80,0,0,0.1)" stroke="rgba(80,0,0,0.15)" strokeWidth="0.5" />
              <ellipse cx={s.legRX + 1} cy={s.kneeY - 3} rx="3.5" ry="4"
                fill="rgba(80,0,0,0.1)" stroke="rgba(80,0,0,0.15)" strokeWidth="0.5" />
            </g>
          )}

          {/* ── ARMS PINNED: wrist binding marks ── */}
          {encounterAction === 'arms_pinned' && (
            <g className="sprite-enc-hand-pulse">
              {/* Wrist bindings above head */}
              <ellipse cx={s.cx} cy={s.headCY - geom.headRY - 6} rx="8" ry="3"
                fill="rgba(80,0,0,0.15)" stroke="rgba(80,0,0,0.3)" strokeWidth="0.8" />
              {/* Rope/binding lines */}
              <line x1={s.shLX + 2} y1={s.shldY - 2} x2={s.cx - 3} y2={s.headCY - geom.headRY - 6}
                stroke="rgba(120,80,40,0.25)" strokeWidth="0.8" strokeLinecap="round" />
              <line x1={s.shRX - 2} y1={s.shldY - 2} x2={s.cx + 3} y2={s.headCY - geom.headRY - 6}
                stroke="rgba(120,80,40,0.25)" strokeWidth="0.8" strokeLinecap="round" />
              {/* Strain marks at shoulders */}
              <circle cx={s.shLX + 1} cy={s.shldY} r="1.5" fill="rgba(255,80,80,0.15)" />
              <circle cx={s.shRX - 1} cy={s.shldY} r="1.5" fill="rgba(255,80,80,0.15)" />
            </g>
          )}

          {/* ── PRONE: ground shadow + weight ── */}
          {encounterAction === 'prone' && (
            <g>
              {/* Ground shadow */}
              <ellipse cx={s.cx} cy={s.footBotY + 3} rx="30" ry="3"
                fill="rgba(0,0,0,0.15)" />
              {/* Weight on back */}
              <ellipse cx={s.cx + 2} cy={s.waistY - 5} rx="12" ry="8"
                fill="rgba(80,0,0,0.08)" className="sprite-enc-hand-pulse" />
            </g>
          )}

          {/* ── BENT OVER: hand on back ── */}
          {encounterAction === 'bent_over' && (
            <g className="sprite-enc-hand-pulse">
              {/* Hand pressing on lower back */}
              <ellipse cx={s.cx + 3} cy={s.waistY + 2} rx="5" ry="4"
                fill="rgba(80,0,0,0.12)" stroke="rgba(80,0,0,0.2)" strokeWidth="0.5" />
              {/* Hip grip */}
              <ellipse cx={s.cx - geom.hipHW * 0.6} cy={s.hipTopY + 3} rx="3.5" ry="4.5"
                fill="rgba(80,0,0,0.1)" />
              <ellipse cx={s.cx + geom.hipHW * 0.6} cy={s.hipTopY + 3} rx="3.5" ry="4.5"
                fill="rgba(80,0,0,0.1)" />
            </g>
          )}

          {/* ── LIFTED: no-ground indicator + grip ── */}
          {encounterAction === 'lifted' && (
            <g>
              {/* Ground gone - gap indicator */}
              <line x1={s.cx - 15} y1={s.footBotY + 8} x2={s.cx + 15} y2={s.footBotY + 8}
                stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2 3" />
              {/* Supporting grips on thighs */}
              <ellipse cx={s.legLX} cy={s.crotchY + 15} rx="5" ry="3.5"
                fill="rgba(80,0,0,0.12)" className="sprite-enc-hand-pulse" />
              <ellipse cx={s.legRX} cy={s.crotchY + 15} rx="5" ry="3.5"
                fill="rgba(80,0,0,0.12)" className="sprite-enc-hand-pulse" />
            </g>
          )}

          {/* ── CARESSED: gentle touch indicators ── */}
          {encounterAction === 'caressed' && (
            <g className="sprite-enc-hand-pulse" opacity="0.7">
              {/* Gentle finger trails */}
              <path d={`M ${s.cx + geom.shoulderHW * 0.8},${s.shldY + 5} Q ${s.cx + geom.shoulderHW * 0.4},${s.shldY + 15} ${s.cx + geom.shoulderHW * 0.6},${s.waistY - 8}`}
                fill="none" stroke="rgba(255,180,200,0.2)" strokeWidth="0.6" strokeLinecap="round" />
              {/* Touch warmth zones */}
              <ellipse cx={s.cx + geom.shoulderHW * 0.5} cy={s.shldY + 12} rx="3" ry="4"
                fill="rgba(255,180,200,0.08)" />
              {isChestExposed && (
                <ellipse cx={s.cx - 4} cy={s.shldY + 20} rx="3.5" ry="3"
                  fill="rgba(255,180,200,0.06)" />
              )}
            </g>
          )}

          {/* ── BITTEN: bite mark ── */}
          {encounterAction === 'bitten' && (
            <g>
              {/* Bite mark on neck/shoulder */}
              <ellipse cx={s.cx + geom.shoulderHW * 0.3} cy={s.neckBotY + 2} rx="2.5" ry="1.8"
                fill="rgba(200,0,0,0.2)" stroke="rgba(200,0,0,0.35)" strokeWidth="0.5" />
              {/* Tooth marks */}
              {[-1.5, -0.5, 0.5, 1.5].map((dx, i) => (
                <circle key={`bite-${i}`}
                  cx={s.cx + geom.shoulderHW * 0.3 + dx} cy={s.neckBotY + 2 - 1.2}
                  r="0.3" fill="rgba(200,0,0,0.35)" />
              ))}
              {[-1, 0, 1].map((dx, i) => (
                <circle key={`bite-b-${i}`}
                  cx={s.cx + geom.shoulderHW * 0.3 + dx} cy={s.neckBotY + 2 + 1.2}
                  r="0.25" fill="rgba(200,0,0,0.3)" />
              ))}
              {/* Pain reaction flash */}
              <circle cx={s.cx + geom.shoulderHW * 0.3} cy={s.neckBotY + 2} r="5"
                fill="none" stroke="rgba(255,100,100,0.2)" strokeWidth="0.5"
                className="sprite-enc-impact-ring" />
            </g>
          )}

          {/* ── SPANKED: impact mark on rear ── */}
          {encounterAction === 'spanked' && (
            <g>
              {/* Impact zone */}
              <ellipse cx={s.cx + 4} cy={s.hipTopY + 8} rx="5" ry="4"
                fill="rgba(255,60,60,0.2)" />
              {/* Impact ring */}
              <circle cx={s.cx + 4} cy={s.hipTopY + 8} r="6"
                fill="none" stroke="rgba(255,100,100,0.25)" strokeWidth="0.6"
                className="sprite-enc-impact-ring" />
              {/* Motion lines */}
              <line x1={s.cx + 14} y1={s.hipTopY + 4} x2={s.cx + 8} y2={s.hipTopY + 7}
                stroke="rgba(255,100,100,0.25)" strokeWidth="0.5" strokeLinecap="round" />
              <line x1={s.cx + 15} y1={s.hipTopY + 9} x2={s.cx + 9} y2={s.hipTopY + 10}
                stroke="rgba(255,100,100,0.2)" strokeWidth="0.4" strokeLinecap="round" />
            </g>
          )}

          {/* ── CHOKED: hand on throat + constriction rings ── */}
          {encounterAction === 'choked' && (
            <g className="sprite-enc-hand-pulse">
              {/* Throat grip */}
              <ellipse cx={s.cx} cy={s.neckTopY + 5} rx="5" ry="3.5"
                fill="rgba(80,0,0,0.15)" stroke="rgba(80,0,0,0.35)" strokeWidth="0.8" />
              {/* Finger pressure marks */}
              {[-3, -1.5, 1.5, 3].map((dx, i) => (
                <circle key={`choke-${i}`} cx={s.cx + dx} cy={s.neckTopY + 5 - 2}
                  r="0.7" fill="rgba(120,0,0,0.25)" />
              ))}
              {/* Gasp indicator lines */}
              <line x1={s.cx - 2} y1={s.headCY + geom.headRY * 0.6}
                    x2={s.cx - 4} y2={s.headCY + geom.headRY * 0.6 - 3}
                stroke="rgba(200,200,255,0.15)" strokeWidth="0.4" strokeLinecap="round" />
              <line x1={s.cx + 2} y1={s.headCY + geom.headRY * 0.6}
                    x2={s.cx + 4} y2={s.headCY + geom.headRY * 0.6 - 3}
                stroke="rgba(200,200,255,0.15)" strokeWidth="0.4" strokeLinecap="round" />
            </g>
          )}

          {/* ── HAIR PULLED: grip on hair + tension line ── */}
          {encounterAction === 'hair_pulled' && (
            <g>
              {/* Hand in hair */}
              <ellipse cx={s.cx + 2} cy={s.headCY - geom.headRY * 0.5} rx="4" ry="3.5"
                fill="rgba(80,0,0,0.15)" stroke="rgba(80,0,0,0.25)" strokeWidth="0.6"
                className="sprite-enc-hand-pulse" />
              {/* Tension lines from hair */}
              <line x1={s.cx + 2} y1={s.headCY - geom.headRY * 0.5}
                    x2={s.cx + 10} y2={s.headCY - geom.headRY - 5}
                stroke="rgba(120,80,40,0.2)" strokeWidth="0.6" strokeLinecap="round" />
              <line x1={s.cx - 1} y1={s.headCY - geom.headRY * 0.4}
                    x2={s.cx + 8} y2={s.headCY - geom.headRY - 3}
                stroke="rgba(120,80,40,0.15)" strokeWidth="0.4" strokeLinecap="round" />
              {/* Pain stars */}
              <text x={s.cx - 8} y={s.headCY - geom.headRY - 2}
                fill="rgba(255,200,100,0.35)" fontSize="3">✦</text>
            </g>
          )}

          {/* ── SCRATCHED: claw rake marks ── */}
          {encounterAction === 'scratched' && (
            <g>
              {/* Three parallel scratch lines across torso */}
              {[0, 1, 2].map(i => (
                <line key={`scratch-${i}`}
                  x1={s.cx - geom.shoulderHW * 0.4 + i * 3}
                  y1={s.shldY + 10 + i * 2}
                  x2={s.cx + geom.shoulderHW * 0.2 + i * 2}
                  y2={s.waistY - 5 + i * 3}
                  stroke="rgba(200,0,0,0.3)" strokeWidth="0.6" strokeLinecap="round" />
              ))}
              {/* Blood droplets */}
              {[[4, 18], [-2, 25], [6, 22]].map(([ox, oy], i) => (
                <circle key={`blood-${i}`}
                  cx={s.cx + ox} cy={s.shldY + oy}
                  r="0.6" fill="rgba(200,0,0,0.35)" />
              ))}
              {/* Impact flash */}
              <circle cx={s.cx} cy={s.waistY - 10} r="8"
                fill="none" stroke="rgba(255,100,100,0.15)" strokeWidth="0.5"
                className="sprite-enc-impact-ring" />
            </g>
          )}

          {/* ── LICKED: wet trail + saliva droplets ── */}
          {encounterAction === 'licked' && (
            <g className="sprite-enc-hand-pulse" opacity="0.7">
              {/* Wet trail along neck/shoulder */}
              <path d={`M ${s.cx + geom.shoulderHW * 0.2},${s.neckBotY}
                Q ${s.cx + geom.shoulderHW * 0.4},${s.shldY + 8}
                  ${s.cx + geom.shoulderHW * 0.3},${s.shldY + 18}`}
                fill="none" stroke="rgba(180,200,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
              {/* Saliva sheen */}
              <ellipse cx={s.cx + geom.shoulderHW * 0.3} cy={s.shldY + 12} rx="3" ry="5"
                fill="rgba(180,200,255,0.06)" />
              {/* Drip */}
              <g className="sprite-enc-fluid-drip">
                <ellipse cx={s.cx + geom.shoulderHW * 0.3} cy={s.shldY + 18} rx="0.5" ry="1.5"
                  fill="rgba(180,200,255,0.25)" />
              </g>
            </g>
          )}

          {/* ── RESTRAINED TIED: rope/vine binding marks ── */}
          {encounterAction === 'restrained_tied' && (
            <g className="sprite-enc-hand-pulse">
              {/* Wrist bindings */}
              <ellipse cx={s.wrLX} cy={s.wrY} rx={geom.upperArmW + 0.5} ry="2"
                fill="none" stroke="rgba(120,80,30,0.4)" strokeWidth="1" />
              <ellipse cx={s.wrRX} cy={s.wrY} rx={geom.upperArmW + 0.5} ry="2"
                fill="none" stroke="rgba(120,80,30,0.4)" strokeWidth="1" />
              {/* Connecting rope between wrists */}
              <path d={`M ${s.wrLX},${s.wrY}
                Q ${s.cx},${s.wrY - 8} ${s.wrRX},${s.wrY}`}
                fill="none" stroke="rgba(120,80,30,0.25)" strokeWidth="0.8"
                strokeDasharray="2 1.5" />
              {/* Ankle bindings */}
              <ellipse cx={s.legLX} cy={s.ankleY} rx="3" ry="1.8"
                fill="none" stroke="rgba(120,80,30,0.35)" strokeWidth="0.8" />
              <ellipse cx={s.legRX} cy={s.ankleY} rx="3" ry="1.8"
                fill="none" stroke="rgba(120,80,30,0.35)" strokeWidth="0.8" />
              {/* Strain marks */}
              <circle cx={s.wrLX} cy={s.wrY} r="1" fill="rgba(255,80,80,0.15)" />
              <circle cx={s.wrRX} cy={s.wrY} r="1" fill="rgba(255,80,80,0.15)" />
            </g>
          )}

          {/* ── MOUNTED: weight shadow + compression indicators ── */}
          {encounterAction === 'mounted' && (
            <g>
              {/* Heavy weight pressing down on torso */}
              <ellipse cx={s.cx} cy={s.waistY - 8} rx={geom.shoulderHW * 0.8} ry="12"
                fill="rgba(60,0,0,0.08)" className="sprite-enc-hand-pulse" />
              {/* Grip hands on shoulders */}
              <ellipse cx={s.shLX + 3} cy={s.shldY + 2} rx="4" ry="3"
                fill="rgba(80,0,0,0.12)" stroke="rgba(80,0,0,0.2)" strokeWidth="0.5" />
              <ellipse cx={s.shRX - 3} cy={s.shldY + 2} rx="4" ry="3"
                fill="rgba(80,0,0,0.12)" stroke="rgba(80,0,0,0.2)" strokeWidth="0.5" />
              {/* Ground shadow (pinned to floor) */}
              <ellipse cx={s.cx} cy={s.footBotY + 4} rx="28" ry="3.5"
                fill="rgba(0,0,0,0.12)" />
              {/* Compression pressure lines */}
              <line x1={s.cx - 10} y1={s.shldY - 2} x2={s.cx + 10} y2={s.shldY - 2}
                stroke="rgba(255,60,60,0.1)" strokeWidth="0.4" />
              <line x1={s.cx - 8} y1={s.shldY - 4} x2={s.cx + 8} y2={s.shldY - 4}
                stroke="rgba(255,60,60,0.07)" strokeWidth="0.3" />
            </g>
          )}
        </g>
      )}
    </>
  );
};
