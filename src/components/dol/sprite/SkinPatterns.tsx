import React from 'react';
import { BodyGeom, SpriteState, MAX_BODY_WRITING_CHARS } from './utils';
import { RacialBodyFeatures } from '../../../data/races';
import { CosmeticScar, CosmeticTattoo, CosmeticPiercing } from '../../../types';

interface SkinPatternsProps {
  geom: BodyGeom;
  s: SpriteState;
  skin: string;
  accentClr: string;
  raceDef: RacialBodyFeatures;
  isFemale: boolean;
  isChestExposed: boolean;
  isGroinExposed: boolean;
  isLegsExposed: boolean;
  isArmsExposed: boolean;
  hasFreckles: boolean;
  hasTanLines: boolean;
  scars: CosmeticScar[];
  tattoos: CosmeticTattoo[];
  piercings: CosmeticPiercing[];
  bodyWriting: { text: string; location: 'chest' | 'abdomen' | 'thigh' | 'arm' | 'back' }[];
  hasCollar: boolean;
  bodyPartsIntegrity?: Record<string, number>;
}

export const SkinPatterns: React.FC<SkinPatternsProps> = ({ geom, s, skin, accentClr, raceDef, isFemale, isChestExposed, isGroinExposed, isLegsExposed, isArmsExposed, hasFreckles, hasTanLines, scars, tattoos, piercings, bodyWriting, hasCollar, bodyPartsIntegrity }) => {
  return (
    <>
      {/* ── FRECKLES (face + shoulders) ── */}
      {hasFreckles && raceDef.skin_type === 'skin' && (
        <g opacity="0.32">
          {/* Face freckles – scattered across nose-bridge and cheeks */}
          {[[-3, s.headCY + 2], [-1.5, s.headCY + 3.5], [0, s.headCY + 2.5],
            [1.5, s.headCY + 3], [3, s.headCY + 2],
            [-6, s.headCY + 2], [-5, s.headCY + 3.5], [5, s.headCY + 2.5], [6, s.headCY + 3]
          ].map(([dx, dy], i) => (
            <circle key={`fr-${i}`} cx={s.cx + dx} cy={dy} r="0.55" fill="#8a5a30" />
          ))}
          {/* Shoulder freckles (when shoulders exposed) */}
          {isArmsExposed && (
            <>
              {[[-2, 4], [0, 7], [2, 3], [4, 8], [-3, 9]].map(([dx, dy], i) => (
                <circle key={`frs-l-${i}`} cx={s.shLX + geom.upperArmW * 0.3 + dx} cy={s.shldY + dy} r="0.5" fill="#8a5a30" />
              ))}
              {[[2, 4], [0, 7], [-2, 3], [-4, 8], [3, 9]].map(([dx, dy], i) => (
                <circle key={`frs-r-${i}`} cx={s.shRX - geom.upperArmW * 0.3 + dx} cy={s.shldY + dy} r="0.5" fill="#8a5a30" />
              ))}
            </>
          )}
        </g>
      )}

      {/* ── TAN LINES (when exposed, show lighter areas where clothing was) ── */}
      {hasTanLines && isChestExposed && raceDef.skin_type === 'skin' && (
        <g>
          {/* Chest tan line outline – marks where a top would be */}
          <path d={`M ${s.cx - geom.shoulderHW * 0.35},${s.shldY + 4} Q ${s.cx},${s.shldY + 8} ${s.cx + geom.shoulderHW * 0.35},${s.shldY + 4}`}
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Lighter skin patch (where clothing shielded from sun) */}
          <path d={`M ${s.cx - geom.shoulderHW * 0.85},${s.shldY} C ${s.cx - geom.shoulderHW * 0.85},${s.shldY + 20} ${s.cx - geom.waistHW},${s.waistY - 12} ${s.cx - geom.waistHW},${s.waistY} L ${s.cx + geom.waistHW},${s.waistY} C ${s.cx + geom.waistHW},${s.waistY - 12} ${s.cx + geom.shoulderHW * 0.85},${s.shldY + 20} ${s.cx + geom.shoulderHW * 0.85},${s.shldY} Z`}
            fill="rgba(255,255,255,0.06)" />
        </g>
      )}
      {hasTanLines && isGroinExposed && raceDef.skin_type === 'skin' && (
        <rect x={s.cx - geom.hipHW * 0.8} y={s.hipTopY + 4} width={geom.hipHW * 1.6} height={s.crotchY - s.hipTopY - 2} rx="3"
          fill="rgba(255,255,255,0.06)" />
      )}

      {/* ── SURFACE PATTERNS ── */}
      {raceDef.surface_pattern === 'fur_spotted' && (
        <g opacity="0.20">
          {[[s.cx-8,s.shldY+8],[s.cx+6,s.shldY+18],[s.cx-4,s.waistY-10],[s.legLX+3,s.kneeY-20],[s.legRX-3,s.kneeY-35]].map(([sx,sy],i) => (
            <circle key={`sp-${i}`} cx={sx} cy={sy} r="3.5" fill={accentClr} />
          ))}
        </g>
      )}
      {raceDef.surface_pattern === 'fur_striped' && (
        <g opacity="0.15">
          <line x1={s.cx-10} y1={s.shldY+5}  x2={s.cx-6}  y2={s.waistY-5}  stroke={accentClr} strokeWidth="2.5" />
          <line x1={s.cx+10} y1={s.shldY+5}  x2={s.cx+6}  y2={s.waistY-5}  stroke={accentClr} strokeWidth="2.5" />
        </g>
      )}
      {raceDef.surface_pattern === 'scales_smooth' && (
        <g opacity="0.18">
          {[s.shldY+8, s.shldY+18, s.waistY-10].map((sy,i) => (
            <path key={`sc-${i}`} d={`M ${s.cx-12},${sy} Q ${s.cx},${sy-4} ${s.cx+12},${sy}`} fill="none" stroke={accentClr} strokeWidth="0.9" />
          ))}
        </g>
      )}
      {raceDef.surface_pattern === 'tattoo_warpaint' && (
        <g opacity="0.28">
          <line x1={s.cx-9} y1={s.headCY-3} x2={s.cx-4} y2={s.headCY+3} stroke={accentClr} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={s.cx+9} y1={s.headCY-3} x2={s.cx+4} y2={s.headCY+3} stroke={accentClr} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── SCAR VISUALIZATION ── */}
      {scars.length > 0 && (
        <g opacity="0.45">
          {scars.map((scar, i) => {
            const st = scar.type || 'slash';
            const scarColor = st === 'burn' ? 'rgba(180,80,80,0.5)' : 'rgba(220,180,180,0.6)';
            const scarW = st === 'burn' ? '2' : '1.2';
            switch (scar.location) {
              case 'face':
                return <line key={`scar-${i}`} x1={s.cx - 3 + i * 2} y1={s.headCY - 2} x2={s.cx + 1 + i * 2} y2={s.headCY + 5} stroke={scarColor} strokeWidth={scarW} strokeLinecap="round" />;
              case 'chest':
                return isChestExposed ? <line key={`scar-${i}`} x1={s.cx - 6 + i * 3} y1={s.shldY + 12} x2={s.cx + 2 + i * 3} y2={s.shldY + 26} stroke={scarColor} strokeWidth={scarW} strokeLinecap="round" /> : null;
              case 'abdomen':
                return isChestExposed ? <line key={`scar-${i}`} x1={s.cx - 4 + i * 2} y1={s.waistY - 8} x2={s.cx + 3 + i * 2} y2={s.waistY + 4} stroke={scarColor} strokeWidth={scarW} strokeLinecap="round" /> : null;
              case 'arms':
                return isArmsExposed ? <line key={`scar-${i}`} x1={s.shLX + 2} y1={s.shldY + 14 + i * 8} x2={s.shLX - 2} y2={s.shldY + 22 + i * 8} stroke={scarColor} strokeWidth={scarW} strokeLinecap="round" /> : null;
              case 'legs':
                return isLegsExposed ? <line key={`scar-${i}`} x1={s.legLX - 2} y1={s.crotchY + 12 + i * 12} x2={s.legLX + 3} y2={s.crotchY + 22 + i * 12} stroke={scarColor} strokeWidth={scarW} strokeLinecap="round" /> : null;
              case 'neck':
                return <line key={`scar-${i}`} x1={s.cx - 3} y1={s.neckTopY + 2} x2={s.cx + 2} y2={s.neckTopY + 6} stroke={scarColor} strokeWidth={scarW} strokeLinecap="round" />;
              default:
                return null;
            }
          })}
        </g>
      )}

      {/* ── TATTOO VISUALIZATION ── */}
      {tattoos.length > 0 && (
        <g>
          {tattoos.map((tat, i) => {
            const tClr = tat.color || '#2a4a6a';
            switch (tat.location) {
              case 'arms':
                return isArmsExposed ? (
                  <g key={`tat-${i}`} opacity="0.4">
                    <path d={`M ${s.shRX + 1},${s.shldY + 10 + i * 12} Q ${s.shRX + 4},${s.shldY + 16 + i * 12} ${s.shRX + 1},${s.shldY + 22 + i * 12}`}
                      fill="none" stroke={tClr} strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx={s.shRX + 2} cy={s.shldY + 16 + i * 12} r="2" fill="none" stroke={tClr} strokeWidth="0.6" />
                  </g>
                ) : null;
              case 'chest':
                return isChestExposed ? (
                  <g key={`tat-${i}`} opacity="0.35">
                    <path d={`M ${s.cx - 5 + i * 3},${s.shldY + 15} Q ${s.cx + i * 3},${s.shldY + 10} ${s.cx + 5 + i * 3},${s.shldY + 15}`}
                      fill="none" stroke={tClr} strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                ) : null;
              case 'shoulder':
                return isArmsExposed ? (
                  <g key={`tat-${i}`} opacity="0.4">
                    <circle cx={s.shRX - geom.upperArmW * 0.1} cy={s.shldY + 6} r="4" fill="none" stroke={tClr} strokeWidth="1" />
                    <circle cx={s.shRX - geom.upperArmW * 0.1} cy={s.shldY + 6} r="2" fill="none" stroke={tClr} strokeWidth="0.5" />
                  </g>
                ) : null;
              case 'abdomen':
                return isChestExposed ? (
                  <g key={`tat-${i}`} opacity="0.35">
                    <path d={`M ${s.cx - 4},${s.waistY - 6} L ${s.cx},${s.waistY - 10} L ${s.cx + 4},${s.waistY - 6}`}
                      fill="none" stroke={tClr} strokeWidth="0.9" strokeLinecap="round" />
                  </g>
                ) : null;
              case 'neck':
                return (
                  <g key={`tat-${i}`} opacity="0.35">
                    <circle cx={s.cx + 3} cy={s.neckTopY + 3} r="2.5" fill="none" stroke={tClr} strokeWidth="0.8" />
                  </g>
                );
              case 'legs':
                return isLegsExposed ? (
                  <g key={`tat-${i}`} opacity="0.35">
                    <path d={`M ${s.legRX - 3},${s.crotchY + 20 + i * 15} Q ${s.legRX},${s.crotchY + 14 + i * 15} ${s.legRX + 3},${s.crotchY + 20 + i * 15}`}
                      fill="none" stroke={tClr} strokeWidth="1" strokeLinecap="round" />
                  </g>
                ) : null;
              case 'face':
                return (
                  <g key={`tat-${i}`} opacity="0.35">
                    <line x1={s.cx - 7} y1={s.headCY + 1} x2={s.cx - 4} y2={s.headCY + 4} stroke={tClr} strokeWidth="1" strokeLinecap="round" />
                  </g>
                );
              default:
                return null;
            }
          })}
        </g>
      )}

      {/* ── PIERCING VISUALIZATION ── */}
      {piercings.length > 0 && (
        <g>
          {piercings.map((p, i) => {
            const pClr = '#c0c0c0';
            switch (p.location) {
              case 'ear_left':
                return <circle key={`pier-${i}`} cx={s.cx - geom.headRX + 0.5} cy={s.headCY + 1} r="1" fill={pClr} stroke="#888" strokeWidth="0.3" />;
              case 'ear_right':
                return <circle key={`pier-${i}`} cx={s.cx + geom.headRX - 0.5} cy={s.headCY + 1} r="1" fill={pClr} stroke="#888" strokeWidth="0.3" />;
              case 'nose':
                return <circle key={`pier-${i}`} cx={s.cx + 1.8} cy={s.headCY + 4.5} r="0.7" fill={pClr} stroke="#888" strokeWidth="0.3" />;
              case 'lip':
                return <circle key={`pier-${i}`} cx={s.cx - 2.5} cy={s.headCY + 8} r="0.7" fill={pClr} stroke="#888" strokeWidth="0.3" />;
              case 'eyebrow':
                return <circle key={`pier-${i}`} cx={s.cx - 7} cy={s.headCY - 4.5} r="0.7" fill={pClr} stroke="#888" strokeWidth="0.3" />;
              case 'navel':
                return isChestExposed ? <circle key={`pier-${i}`} cx={s.cx} cy={geom.navelY + 1.5} r="0.9" fill={pClr} stroke="#888" strokeWidth="0.3" /> : null;
              case 'nipple_left':
                return isChestExposed && isFemale ? <circle key={`pier-${i}`} cx={s.cx - geom.shoulderHW * 0.38} cy={geom.bustY} r="0.8" fill={pClr} stroke="#888" strokeWidth="0.4" /> : null;
              case 'nipple_right':
                return isChestExposed && isFemale ? <circle key={`pier-${i}`} cx={s.cx + geom.shoulderHW * 0.38} cy={geom.bustY} r="0.8" fill={pClr} stroke="#888" strokeWidth="0.4" /> : null;
              default:
                return null;
            }
          })}
        </g>
      )}

      {/* ── BODY WRITING (DoL feature) ── */}
      {bodyWriting.length > 0 && (
        <g>
          {bodyWriting.map((bw, i) => {
            const fontSize = 3.5;
            let wx = s.cx;
            let wy = s.waistY;
            switch (bw.location) {
              case 'chest':   wx = s.cx; wy = s.shldY + 20; break;
              case 'abdomen': wx = s.cx; wy = s.waistY - 4; break;
              case 'thigh':   wx = s.legRX; wy = s.crotchY + 20; break;
              case 'arm':     wx = s.shRX + 2; wy = s.shldY + 24; break;
              case 'back':    return null;
            }
            const visible = (bw.location === 'chest' || bw.location === 'abdomen') ? isChestExposed
              : bw.location === 'thigh' ? isLegsExposed
              : bw.location === 'arm' ? isArmsExposed
              : false;
            if (!visible) return null;
            return (
              <text key={`bw-${i}`} x={wx} y={wy}
                fill="rgba(80,20,20,0.55)" fontSize={fontSize}
                textAnchor="middle" fontFamily="serif" fontStyle="italic">
                {bw.text.slice(0, MAX_BODY_WRITING_CHARS)}
              </text>
            );
          })}
        </g>
      )}

      {/* ── COLLAR / CHOKER ACCESSORY ── */}
      {hasCollar && (
        <g>
          <rect x={s.cx - geom.headRX * 0.52} y={s.neckTopY + 1} width={geom.headRX * 1.04} height="3.5" rx="1.5"
            fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
          <circle cx={s.cx} cy={s.neckTopY + 3} r="1.2" fill="#888" stroke="#666" strokeWidth="0.3" />
        </g>
      )}

      {/* ── INJURY / WOUND VISUALIZATION (body_parts integrity) ── */}
      {bodyPartsIntegrity && (
        <g>
          {/* Show bruises/wounds on body parts with low integrity */}
          {(bodyPartsIntegrity.torso ?? 100) < 60 && isChestExposed && (
            <ellipse cx={s.cx + 5} cy={s.shldY + 20} rx="4" ry="3"
              fill={`rgba(100,0,120,${(60 - (bodyPartsIntegrity.torso ?? 100)) / 150})`} />
          )}
          {(bodyPartsIntegrity.abdomen ?? 100) < 60 && isChestExposed && (
            <ellipse cx={s.cx - 4} cy={s.waistY - 5} rx="3.5" ry="2.5"
              fill={`rgba(100,0,120,${(60 - (bodyPartsIntegrity.abdomen ?? 100)) / 150})`} />
          )}
          {(bodyPartsIntegrity.head ?? 100) < 60 && (
            <ellipse cx={s.cx + 6} cy={s.headCY - 3} rx="3" ry="2"
              fill={`rgba(100,0,120,${(60 - (bodyPartsIntegrity.head ?? 100)) / 150})`} />
          )}
          {(bodyPartsIntegrity.thigh_l ?? 100) < 60 && isLegsExposed && (
            <ellipse cx={s.legLX} cy={s.crotchY + 22} rx="3.5" ry="4"
              fill={`rgba(100,0,120,${(60 - (bodyPartsIntegrity.thigh_l ?? 100)) / 150})`} />
          )}
          {(bodyPartsIntegrity.thigh_r ?? 100) < 60 && isLegsExposed && (
            <ellipse cx={s.legRX} cy={s.crotchY + 22} rx="3.5" ry="4"
              fill={`rgba(100,0,120,${(60 - (bodyPartsIntegrity.thigh_r ?? 100)) / 150})`} />
          )}
        </g>
      )}
    </>
  );
};
