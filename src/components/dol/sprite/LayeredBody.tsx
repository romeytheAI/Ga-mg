import React from 'react';
import { BodyGeom, SpriteState, getLayerOrder } from './utils';
import { RacialBodyFeatures } from '../../../data/races';
import { BaseBody } from './BaseBody';

/**
 * Enhanced DoL-parity layered body rendering system.
 * Adds depth perception through dynamic shadow/highlight overlays based on pose.
 *
 * For poses where certain body parts are occluded or behind others, this adds
 * subtle darkening/lightening to simulate depth and improve visual clarity.
 */

interface LayeredBodyProps {
  geom: BodyGeom;
  s: SpriteState;
  skin: string;
  accentClr: string;
  raceDef: RacialBodyFeatures;
  isMale: boolean;
  isFemale: boolean;
  isChestExposed: boolean;
  pregnancyBump: number;
  clothing: any;
  encounterAction: string;
}

export const LayeredBody: React.FC<LayeredBodyProps> = (props) => {
  const { s, encounterAction, skin } = props;
  const layerOrder = getLayerOrder(encounterAction);

  // Determine which body regions need depth shading based on pose
  const getDepthShading = (): React.ReactElement | null => {
    switch (encounterAction) {
      case 'bent_over':
      case 'spanked':
        // Back (torso/hips) is forward, add highlight to back
        return (
          <g opacity={0.15}>
            <ellipse cx={s.cx} cy={s.waistY} rx={props.geom.waistHW + 5} ry={35} fill="white" />
            <ellipse cx={s.cx} cy={s.hipTopY} rx={props.geom.hipHW + 3} ry={25} fill="white" />
          </g>
        );

      case 'prone':
        // Lying flat, entire back is visible, add broad highlight
        return (
          <g opacity={0.12}>
            <rect
              x={s.cx - props.geom.shoulderHW - 5}
              y={s.shldY - 5}
              width={(props.geom.shoulderHW + 5) * 2}
              height={s.crotchY - s.shldY + 20}
              rx={12}
              fill="white"
            />
          </g>
        );

      case 'restrained_tied':
      case 'arms_pinned':
        // Arms behind back, add shadow to back arms
        return (
          <g opacity={0.18}>
            {/* Shadow on arms behind body */}
            <ellipse cx={s.elLX + 5} cy={s.elY} rx={props.geom.upperArmW + 2} ry={20} fill="black" />
            <ellipse cx={s.elRX - 5} cy={s.elY} rx={props.geom.upperArmW + 2} ry={20} fill="black" />
          </g>
        );

      case 'oral':
        // Kneeling forward, add shadow to lower body
        return (
          <g opacity={0.14}>
            <ellipse cx={s.cx} cy={s.crotchY + 15} rx={props.geom.hipHW + 8} ry={30} fill="black" />
          </g>
        );

      case 'lifted':
        // Elevated, add shadow beneath
        return (
          <g opacity={0.2}>
            <ellipse cx={s.cx} cy={s.footBotY + 20} rx={props.geom.shoulderHW + 10} ry={8} fill="black" />
          </g>
        );

      case 'mounted':
        // Straddling, add shadow to inner thighs
        return (
          <g opacity={0.16}>
            <ellipse cx={s.legLX + 3} cy={s.crotchY + 12} rx={props.geom.thighW * 0.6} ry={25} fill="black" />
            <ellipse cx={s.legRX - 3} cy={s.crotchY + 12} rx={props.geom.thighW * 0.6} ry={25} fill="black" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <g>
      {/* Base body rendering */}
      <BaseBody {...props} />

      {/* Depth shading overlay */}
      {getDepthShading()}
    </g>
  );
};
