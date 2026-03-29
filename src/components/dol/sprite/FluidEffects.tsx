import React from 'react';
import { BodyGeom, SpriteState } from './utils';

/**
 * Enhanced DoL-parity fluid rendering system.
 * Visualizes body_fluids with detailed coverage patterns, wetness effects, and dripping.
 */

interface FluidEffectsProps {
  geom: BodyGeom;
  s: SpriteState;
  body_fluids: {
    arousal_wetness: number;
    semen_level: number;
    saliva: number;
    tears: number;
    sweat: number;
  };
  isChestExposed: boolean;
  isGroinExposed: boolean;
  isLegsExposed: boolean;
  isFemale: boolean;
}

export const FluidEffects: React.FC<FluidEffectsProps> = ({
  geom, s, body_fluids, isChestExposed, isGroinExposed, isLegsExposed, isFemale
}) => {

  /**
   * Render semen coverage with realistic dripping and pooling patterns
   */
  const renderSemenCoverage = (): JSX.Element | null => {
    const level = body_fluids.semen_level;
    if (level < 5) return null;

    const opacity = Math.min(0.65, 0.15 + (level / 100) * 0.5);
    const semenColor = 'rgba(245,242,235,';

    const patterns: JSX.Element[] = [];

    // Groin/inner thigh coverage (primary zone)
    if (level > 5 && isGroinExposed) {
      patterns.push(
        <g key="semen-groin" opacity={opacity}>
          {/* Primary pooling at groin */}
          <ellipse cx={s.cx} cy={s.crotchY - 2} rx={geom.hipHW * 0.5} ry={8}
            fill={`${semenColor}${0.6})`} />
          {/* Drips down inner thighs */}
          <path d={`M ${s.cx - 2} ${s.crotchY + 5} Q ${s.legLX + 1} ${s.crotchY + 25} ${s.legLX + 3} ${s.kneeY - 15}`}
            stroke={`${semenColor}${0.4})`} strokeWidth="2.5" fill="none" />
          <path d={`M ${s.cx + 2} ${s.crotchY + 5} Q ${s.legRX - 1} ${s.crotchY + 25} ${s.legRX - 3} ${s.kneeY - 15}`}
            stroke={`${semenColor}${0.4})`} strokeWidth="2.5" fill="none" />
          {/* Droplets */}
          <ellipse cx={s.legLX + 2} cy={s.crotchY + 30} rx={1.5} ry={2.5}
            fill={`${semenColor}${0.5})`} />
          <ellipse cx={s.legRX - 2} cy={s.crotchY + 35} rx={1.5} ry={2.5}
            fill={`${semenColor}${0.5})`} />
        </g>
      );
    }

    // Chest coverage (if level > 30)
    if (level > 30 && isChestExposed) {
      patterns.push(
        <g key="semen-chest" opacity={opacity * 0.8}>
          {/* Chest pooling */}
          <ellipse cx={s.cx - 3} cy={s.shldY + 22} rx={geom.bustR + 3} ry={6}
            fill={`${semenColor}${0.45})`} />
          <ellipse cx={s.cx + 3} cy={s.shldY + 24} rx={geom.bustR + 2} ry={5}
            fill={`${semenColor}${0.45})`} />
          {/* Drip down torso */}
          <path d={`M ${s.cx - 2} ${s.shldY + 28} Q ${s.cx - 3} ${s.waistY - 10} ${s.cx - 4} ${s.waistY + 5}`}
            stroke={`${semenColor}${0.4})`} strokeWidth="2" fill="none" />
        </g>
      );
    }

    // Face coverage (if level > 50)
    if (level > 50) {
      patterns.push(
        <g key="semen-face" opacity={opacity * 0.7}>
          {/* Cheek/chin coverage */}
          <ellipse cx={s.cx - 4} cy={s.headCY + 5} rx={3.5} ry={5}
            fill={`${semenColor}${0.5})`} />
          <ellipse cx={s.cx + 4} cy={s.headCY + 6} rx={3} ry={4.5}
            fill={`${semenColor}${0.48})`} />
          {/* Drip from chin */}
          <path d={`M ${s.cx + 1} ${s.headCY + geom.headRY * 0.7} L ${s.cx + 1} ${s.neckTopY + 5}`}
            stroke={`${semenColor}${0.45})`} strokeWidth="1.8" fill="none" />
          <ellipse cx={s.cx + 1} cy={s.neckTopY + 6} rx={1} ry={2}
            fill={`${semenColor}${0.5})`} />
        </g>
      );
    }

    // Heavy coverage - legs (if level > 60)
    if (level > 60 && isLegsExposed) {
      patterns.push(
        <g key="semen-legs" opacity={opacity * 0.6}>
          {/* Splatter marks on thighs */}
          <ellipse cx={s.legLX - 4} cy={s.crotchY + 40} rx={4} ry={6}
            fill={`${semenColor}${0.35})`} />
          <ellipse cx={s.legRX + 4} cy={s.crotchY + 45} rx={3.5} ry={5}
            fill={`${semenColor}${0.35})`} />
        </g>
      );
    }

    return <>{patterns}</>;
  };

  /**
   * Render saliva trails and wetness from oral encounters
   */
  const renderSalivaCoverage = (): JSX.Element | null => {
    const level = body_fluids.saliva;
    if (level < 5) return null;

    const opacity = Math.min(0.55, 0.1 + (level / 100) * 0.45);
    const salivaColor = 'rgba(210,225,240,';

    const patterns: JSX.Element[] = [];

    // Mouth/chin wetness
    if (level > 5) {
      patterns.push(
        <g key="saliva-mouth" opacity={opacity}>
          {/* Wet lips/mouth */}
          <ellipse cx={s.cx} cy={s.headCY + geom.headRY * 0.42} rx={4} ry={2}
            fill={`${salivaColor}${0.4})`} />
          {/* Chin drool */}
          {level > 20 && (
            <>
              <path d={`M ${s.cx} ${s.headCY + geom.headRY * 0.65} Q ${s.cx - 1} ${s.neckTopY - 2} ${s.cx - 1.5} ${s.neckTopY + 3}`}
                stroke={`${salivaColor}${0.45})`} strokeWidth="1.5" fill="none" />
              <ellipse cx={s.cx - 1.5} cy={s.neckTopY + 4} rx={0.8} ry={1.5}
                fill={`${salivaColor}${0.5})`} />
            </>
          )}
        </g>
      );
    }

    // Neck/chest trails (high levels)
    if (level > 40) {
      patterns.push(
        <g key="saliva-neck" opacity={opacity * 0.8}>
          <path d={`M ${s.cx - 2} ${s.neckTopY + 8} Q ${s.cx - 3} ${s.shldY + 5} ${s.cx - 4} ${s.shldY + 15}`}
            stroke={`${salivaColor}${0.4})`} strokeWidth="2" fill="none" />
        </g>
      );
    }

    return <>{patterns}</>;
  };

  /**
   * Render tears with streaming and droplet effects
   */
  const renderTears = (): JSX.Element | null => {
    const level = body_fluids.tears;
    if (level < 10) return null;

    const opacity = Math.min(0.6, 0.15 + (level / 100) * 0.45);
    const tearColor = 'rgba(200,220,255,';

    return (
      <g key="tears" opacity={opacity}>
        {/* Tear streams from eyes */}
        <path d={`M ${s.cx - 6} ${s.headCY - 1} Q ${s.cx - 7} ${s.headCY + 4} ${s.cx - 6.5} ${s.headCY + 8}`}
          stroke={`${tearColor}${0.5})`} strokeWidth="1.2" fill="none" className="sprite-tear-fall" />
        <path d={`M ${s.cx + 6} ${s.headCY - 1} Q ${s.cx + 7} ${s.headCY + 4} ${s.cx + 6.5} ${s.headCY + 8}`}
          stroke={`${tearColor}${0.5})`} strokeWidth="1.2" fill="none" className="sprite-tear-fall" />
        {/* Droplets at jaw */}
        <ellipse cx={s.cx - 6.5} cy={s.headCY + 9} rx={0.7} ry={1.2}
          fill={`${tearColor}${0.55})`} className="sprite-tear-drop" />
        <ellipse cx={s.cx + 6.5} cy={s.headCY + 9} rx={0.7} ry={1.2}
          fill={`${tearColor}${0.55})`} className="sprite-tear-drop" />

        {/* Heavy crying - additional tears */}
        {level > 50 && (
          <>
            <path d={`M ${s.cx - 5} ${s.headCY + 1} L ${s.cx - 5.5} ${s.headCY + 6}`}
              stroke={`${tearColor}${0.4})`} strokeWidth="1" fill="none" />
            <path d={`M ${s.cx + 5} ${s.headCY + 1} L ${s.cx + 5.5} ${s.headCY + 6}`}
              stroke={`${tearColor}${0.4})`} strokeWidth="1" fill="none" />
          </>
        )}
      </g>
    );
  };

  /**
   * Render arousal wetness at groin with gradient intensity
   */
  const renderArousalWetness = (): JSX.Element | null => {
    const level = body_fluids.arousal_wetness;
    if (level < 15 || !isGroinExposed || !isFemale) return null;

    const opacity = Math.min(0.45, 0.08 + (level / 100) * 0.37);
    const wetnessColor = 'rgba(210,225,240,';

    return (
      <g key="arousal-wetness" opacity={opacity}>
        {/* Primary wetness at groin */}
        <ellipse cx={s.cx} cy={s.crotchY - 1} rx={geom.hipHW * 0.35} ry={6}
          fill={`${wetnessColor}${0.4})`} />
        {/* Light drip/trail down inner thigh */}
        {level > 40 && (
          <>
            <path d={`M ${s.cx - 1} ${s.crotchY + 3} L ${s.legLX + 2} ${s.crotchY + 20}`}
              stroke={`${wetnessColor}${0.35})`} strokeWidth="1.8" fill="none" />
            <ellipse cx={s.legLX + 2} cy={s.crotchY + 21} rx={0.9} ry={1.8}
              fill={`${wetnessColor}${0.4})`} />
          </>
        )}
        {/* Heavy wetness - additional trail */}
        {level > 70 && (
          <path d={`M ${s.cx + 1} ${s.crotchY + 3} L ${s.legRX - 2} ${s.crotchY + 18}`}
            stroke={`${wetnessColor}${0.35})`} strokeWidth="1.6" fill="none" />
        )}
      </g>
    );
  };

  return (
    <g>
      {renderSemenCoverage()}
      {renderSalivaCoverage()}
      {renderTears()}
      {renderArousalWetness()}
    </g>
  );
};
