import React from 'react';
import { BodyGeom, SpriteState } from './utils';

/**
 * Enhanced DoL-parity muscle definition rendering system.
 * Adds detailed muscle group visualization with 3 detail levels based on build type.
 */

interface MuscleDefinitionProps {
  geom: BodyGeom;
  s: SpriteState;
  skin: string;
  build: string;
  isChestExposed: boolean;
  shouldersExposed: boolean;
  legsExposed: boolean;
  /** Optional override for detail level from graphics quality settings (0-3) */
  detailLevel?: 0 | 1 | 2 | 3;
}

export const MuscleDefinition: React.FC<MuscleDefinitionProps> = ({
  geom, s, skin, build, isChestExposed, shouldersExposed, legsExposed, detailLevel: overrideDetailLevel
}) => {

  // Determine detail level based on build (if not overridden)
  const getDetailLevel = (): number => {
    if (build === 'muscular') return 3;
    if (build === 'athletic' || build === 'heavy') return 2;
    if (build === 'stocky') return 1;
    return 0;
  };

  // Use override from graphics quality if provided, otherwise use build-based level
  const detailLevel = overrideDetailLevel !== undefined
    ? Math.min(overrideDetailLevel, getDetailLevel()) // Cap at build's natural level
    : getDetailLevel();
  if (detailLevel === 0) return null;

  const opacity = (detailLevel / 3) * 0.4 + 0.15;

  return (
    <g opacity={opacity}>
      {/* ── ARM MUSCLES (biceps, triceps, forearms) ── */}
      {shouldersExposed && detailLevel >= 1 && (
        <g>
          {/* Left bicep definition */}
          <path d={`M ${s.shLX - geom.upperArmW * 0.3},${s.shldY + 10}
            Q ${s.shLX - geom.upperArmW * 0.6},${s.shldY + 24}
              ${s.shLX - geom.upperArmW * 0.28},${s.elY - 8}`}
            fill="none" stroke={`${skin}`} strokeWidth={detailLevel >= 2 ? "1.2" : "0.9"}
            strokeLinecap="round" />

          {/* Left tricep line (back of arm) */}
          {detailLevel >= 2 && (
            <path d={`M ${s.shLX + geom.upperArmW * 0.25},${s.shldY + 12}
              L ${s.elLX + geom.upperArmW * 0.2},${s.elY - 5}`}
              fill="none" stroke={`${skin}`} strokeWidth="0.8"
              strokeLinecap="round" />
          )}

          {/* Right bicep definition */}
          <path d={`M ${s.shRX + geom.upperArmW * 0.3},${s.shldY + 10}
            Q ${s.shRX + geom.upperArmW * 0.6},${s.shldY + 24}
              ${s.shRX + geom.upperArmW * 0.28},${s.elY - 8}`}
            fill="none" stroke={`${skin}`} strokeWidth={detailLevel >= 2 ? "1.2" : "0.9"}
            strokeLinecap="round" />

          {/* Right tricep line */}
          {detailLevel >= 2 && (
            <path d={`M ${s.shRX - geom.upperArmW * 0.25},${s.shldY + 12}
              L ${s.elRX - geom.upperArmW * 0.2},${s.elY - 5}`}
              fill="none" stroke={`${skin}`} strokeWidth="0.8"
              strokeLinecap="round" />
          )}

          {/* Forearm muscle definition (level 2+) */}
          {detailLevel >= 2 && (
            <>
              <path d={`M ${s.elLX - geom.forearmW * 0.3},${s.elY + 8}
                L ${s.wrLX - geom.forearmW * 0.25},${s.wrY - 6}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.7" />
              <path d={`M ${s.elRX + geom.forearmW * 0.3},${s.elY + 8}
                L ${s.wrRX + geom.forearmW * 0.25},${s.wrY - 6}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.7" />
            </>
          )}

          {/* Deltoid definition (shoulders) - level 3 */}
          {detailLevel >= 3 && (
            <>
              <ellipse cx={s.shLX} cy={s.shldY + 4} rx={geom.upperArmW * 0.6} ry={6}
                fill="none" stroke={`${skin}`} strokeWidth="0.8" />
              <ellipse cx={s.shRX} cy={s.shldY + 4} rx={geom.upperArmW * 0.6} ry={6}
                fill="none" stroke={`${skin}`} strokeWidth="0.8" />
            </>
          )}
        </g>
      )}

      {/* ── TORSO MUSCLES (pecs, abs, obliques) ── */}
      {isChestExposed && detailLevel >= 1 && (
        <g>
          {/* Central ab line */}
          <path d={`M ${s.cx},${s.shldY + 8} L ${s.cx},${s.waistY - 2}`}
            fill="none" stroke={`${skin}`} strokeWidth={detailLevel >= 2 ? "1" : "0.8"} />

          {/* Pec definition curves */}
          {detailLevel >= 2 && (
            <>
              <path d={`M ${s.cx - geom.shoulderHW * 0.5},${s.shldY + 12}
                Q ${s.cx - geom.shoulderHW * 0.3},${s.shldY + 22}
                  ${s.cx - geom.waistHW * 0.4},${s.shldY + 28}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.9"
                strokeLinecap="round" />
              <path d={`M ${s.cx + geom.shoulderHW * 0.5},${s.shldY + 12}
                Q ${s.cx + geom.shoulderHW * 0.3},${s.shldY + 22}
                  ${s.cx + geom.waistHW * 0.4},${s.shldY + 28}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.9"
                strokeLinecap="round" />
            </>
          )}

          {/* Ab segments (six-pack) - level 3 */}
          {detailLevel >= 3 && (
            <>
              {/* Upper abs */}
              <path d={`M ${s.cx - 5},${s.shldY + 32} Q ${s.cx},${s.shldY + 30} ${s.cx + 5},${s.shldY + 32}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.7" />
              <path d={`M ${s.cx - 6},${s.shldY + 42} Q ${s.cx},${s.shldY + 40} ${s.cx + 6},${s.shldY + 42}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.7" />
              {/* Mid abs */}
              <path d={`M ${s.cx - 6.5},${s.waistY - 18} Q ${s.cx},${s.waistY - 20} ${s.cx + 6.5},${s.waistY - 18}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.7" />
              <path d={`M ${s.cx - 7},${s.waistY - 8} Q ${s.cx},${s.waistY - 10} ${s.cx + 7},${s.waistY - 8}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.7" />

              {/* Oblique lines */}
              <path d={`M ${s.cx - geom.waistHW * 0.85},${s.waistY - 20}
                L ${s.cx - geom.waistHW * 0.6},${s.hipTopY - 5}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.65" />
              <path d={`M ${s.cx + geom.waistHW * 0.85},${s.waistY - 20}
                L ${s.cx + geom.waistHW * 0.6},${s.hipTopY - 5}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.65" />
            </>
          )}

          {/* Serratus (rib muscles) - level 3 */}
          {detailLevel >= 3 && (
            <>
              <path d={`M ${s.cx - geom.shoulderHW * 0.7},${s.shldY + 35}
                L ${s.cx - geom.waistHW * 0.9},${s.waistY - 25}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.6"
                strokeDasharray="3 2" />
              <path d={`M ${s.cx + geom.shoulderHW * 0.7},${s.shldY + 35}
                L ${s.cx + geom.waistHW * 0.9},${s.waistY - 25}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.6"
                strokeDasharray="3 2" />
            </>
          )}
        </g>
      )}

      {/* ── LEG MUSCLES (quads, hamstrings, calves) ── */}
      {legsExposed && detailLevel >= 2 && (
        <g>
          {/* Left quad definition */}
          <path d={`M ${s.legLX - geom.thighW * 0.3},${s.crotchY + 15}
            L ${s.legLX - geom.thighW * 0.25},${s.kneeY - 12}`}
            fill="none" stroke={`${skin}`} strokeWidth="0.85" />
          <path d={`M ${s.legLX + geom.thighW * 0.2},${s.crotchY + 15}
            L ${s.legLX + geom.thighW * 0.15},${s.kneeY - 12}`}
            fill="none" stroke={`${skin}`} strokeWidth="0.75" />

          {/* Right quad definition */}
          <path d={`M ${s.legRX + geom.thighW * 0.3},${s.crotchY + 15}
            L ${s.legRX + geom.thighW * 0.25},${s.kneeY - 12}`}
            fill="none" stroke={`${skin}`} strokeWidth="0.85" />
          <path d={`M ${s.legRX - geom.thighW * 0.2},${s.crotchY + 15}
            L ${s.legRX - geom.thighW * 0.15},${s.kneeY - 12}`}
            fill="none" stroke={`${skin}`} strokeWidth="0.75" />

          {/* Calf definition - level 3 */}
          {detailLevel >= 3 && (
            <>
              <path d={`M ${s.legLX},${s.kneeY + 10}
                Q ${s.legLX - geom.calfW * 0.4},${s.kneeY + 30}
                  ${s.legLX},${s.ankleY - 8}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.8" />
              <path d={`M ${s.legRX},${s.kneeY + 10}
                Q ${s.legRX + geom.calfW * 0.4},${s.kneeY + 30}
                  ${s.legRX},${s.ankleY - 8}`}
                fill="none" stroke={`${skin}`} strokeWidth="0.8" />
            </>
          )}
        </g>
      )}
    </g>
  );
};
