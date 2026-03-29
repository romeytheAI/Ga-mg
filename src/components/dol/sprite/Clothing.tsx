import React from 'react';
import { BodyGeom, SpriteState, integrityStyle, SLOT_COLORS } from './utils';
import { ClothingLayer } from '../../../types';

interface ClothingProps {
  geom: BodyGeom;
  s: SpriteState;
  skin: string;
  clothing: ClothingLayer;
}

export const Clothing: React.FC<ClothingProps> = ({ geom, s, skin, clothing }) => {

  const tornMark = (x: number, y: number, key: string) => (
    <line key={key} x1={x} y1={y} x2={x + 4} y2={y + 8}
      stroke={skin} strokeWidth="1.2" opacity="0.45" />
  );

  /**
   * Enhanced DoL-parity clothing damage visualization.
   * Creates more detailed damage patterns based on integrity level.
   */
  const getDamagePatterns = (integrity: number, x: number, y: number, width: number, height: number, key: string): React.ReactElement[] => {
    const patterns: React.ReactElement[] = [];

    if (integrity <= 10) {
      // Critical damage: multiple large tears and holes
      patterns.push(
        <g key={`${key}-critical`} opacity={0.4}>
          <path d={`M ${x} ${y} Q ${x + 8} ${y + 6} ${x + 4} ${y + 14}`} stroke={skin} strokeWidth="2" fill="none" />
          <path d={`M ${x + width * 0.7} ${y + height * 0.3} Q ${x + width * 0.6} ${y + height * 0.5} ${x + width * 0.75} ${y + height * 0.6}`} stroke={skin} strokeWidth="2.5" fill="none" />
          <ellipse cx={x + width * 0.5} cy={y + height * 0.7} rx={6} ry={8} fill={skin} opacity={0.3} />
        </g>
      );
    } else if (integrity <= 40) {
      // Major damage: several tears and fraying
      patterns.push(
        <g key={`${key}-major`} opacity={0.35}>
          <path d={`M ${x + 2} ${y + height * 0.4} L ${x + 8} ${y + height * 0.5}`} stroke={skin} strokeWidth="1.8" />
          <path d={`M ${x + width * 0.8} ${y + height * 0.2} L ${x + width * 0.7} ${y + height * 0.35}`} stroke={skin} strokeWidth="1.5" />
          <line x1={x + width * 0.5} y1={y + height * 0.6} x2={x + width * 0.45} y2={y + height * 0.75} stroke={skin} strokeWidth="1.6" />
        </g>
      );
    } else if (integrity <= 70) {
      // Moderate damage: small tears and stress marks
      patterns.push(
        <g key={`${key}-moderate`} opacity={0.3}>
          <line x1={x + width * 0.3} y1={y + height * 0.3} x2={x + width * 0.35} y2={y + height * 0.4} stroke={skin} strokeWidth="1.2" />
          <line x1={x + width * 0.7} y1={y + height * 0.5} x2={x + width * 0.72} y2={y + height * 0.58} stroke={skin} strokeWidth="1" />
        </g>
      );
    }

    return patterns;
  };

  return (
    <>
      {/* FEET */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.feet);
        if (!clothing.feet || op === 0) return null;
        const c = SLOT_COLORS.feet;
        const integrity = clothing.feet.integrity ?? 100;
        return (
          <g opacity={op}>
            <ellipse cx={s.legLX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2 + 1} ry={geom.footH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            <ellipse cx={s.legRX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2 + 1} ry={geom.footH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            {torn && tornMark(s.legLX, s.footBotY - 6, 'torn-f')}
            {getDamagePatterns(integrity, s.legLX - geom.footW/2, s.footBotY - geom.footH, geom.footW, geom.footH, 'feet-dmg')}
          </g>
        );
      })()}

      {/* LEGS */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.legs);
        if (!clothing.legs || op === 0) return null;
        const c = SLOT_COLORS.legs;
        const integrity = clothing.legs.integrity ?? 100;
        return (
          <g opacity={op}>
            <rect x={s.legLX - geom.thighW/2 - 1} y={s.crotchY} width={geom.thighW + 2} height={s.ankleY - s.crotchY} rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            <rect x={s.legRX - geom.thighW/2 - 1} y={s.crotchY} width={geom.thighW + 2} height={s.ankleY - s.crotchY} rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            {torn && tornMark(s.legLX - 2, s.kneeY - 10, 'torn-ll')}
            {torn && tornMark(s.legRX + 2, s.kneeY + 5, 'torn-rl')}
            {getDamagePatterns(integrity, s.legLX - geom.thighW/2, s.crotchY, geom.thighW, s.ankleY - s.crotchY, 'legs-dmg')}
          </g>
        );
      })()}

      {/* UNDERWEAR */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.underwear);
        if (!clothing.underwear || op === 0) return null;
        const c = SLOT_COLORS.underwear;
        const integrity = clothing.underwear.integrity ?? 100;
        return (
          <g opacity={op}>
            <rect x={s.cx - geom.hipHW - 1} y={s.hipTopY + 4} width={(geom.hipHW + 1) * 2} height={s.crotchY - s.hipTopY - 2} rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            {torn && tornMark(s.cx - 5, s.hipTopY + 8, 'torn-uw')}
            {getDamagePatterns(integrity, s.cx - geom.hipHW, s.hipTopY, geom.hipHW * 2, s.crotchY - s.hipTopY, 'uw-dmg')}
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
            <rect x={s.cx - geom.hipHW - 2} y={s.hipTopY} width={(geom.hipHW + 2) * 2} height="9" rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
          </g>
        );
      })()}

      {/* CHEST */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.chest);
        if (!clothing.chest || op === 0) return null;
        const c = SLOT_COLORS.chest;
        const integrity = clothing.chest.integrity ?? 100;
        return (
          <g opacity={op} className={torn ? 'sprite-cloth-flutter' : undefined}>
            <path d={`M ${s.cx - geom.shoulderHW - 1},${s.shldY} C ${s.cx - geom.shoulderHW - 2},${s.shldY + 22} ${s.cx - geom.waistHW - 1},${s.waistY - 14} ${s.cx - geom.waistHW - 1},${s.waistY + 1} L ${s.cx + geom.waistHW + 1},${s.waistY + 1} C ${s.cx + geom.waistHW + 1},${s.waistY - 14} ${s.cx + geom.shoulderHW + 2},${s.shldY + 22} ${s.cx + geom.shoulderHW + 1},${s.shldY} Z`} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            {torn && tornMark(s.cx - 8, s.shldY + 18, 'torn-c1')}
            {torn && tornMark(s.cx + 6, s.waistY - 12, 'torn-c2')}
            {getDamagePatterns(integrity, s.cx - geom.shoulderHW, s.shldY, geom.shoulderHW * 2, s.waistY - s.shldY, 'chest-dmg')}
          </g>
        );
      })()}

      {/* SHOULDERS */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.shoulders);
        if (!clothing.shoulders || op === 0) return null;
        const c = SLOT_COLORS.shoulders;
        const integrity = clothing.shoulders.integrity ?? 100;
        return (
          <g opacity={op}>
            <rect x={s.shLX - geom.upperArmW} y={s.shldY - 2} width={geom.upperArmW * 2 + 2} height="16" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            <rect x={s.shRX - geom.upperArmW} y={s.shldY - 2} width={geom.upperArmW * 2 + 2} height="16" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            {getDamagePatterns(integrity, s.shLX - geom.upperArmW, s.shldY, geom.upperArmW * 2, 16, 'shoulders-dmg')}
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
            <ellipse cx={s.wrLX} cy={s.handCY} rx={geom.handW/2 + 1.5} ry={geom.handH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
            <ellipse cx={s.wrRX} cy={s.handCY} rx={geom.handW/2 + 1.5} ry={geom.handH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
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
            <rect x={s.cx - geom.headRX * 0.56} y={s.neckTopY - 1} width={geom.headRX * 1.12} height={s.neckBotY - s.neckTopY + 3} rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" />
          </g>
        );
      })()}

      {/* HEAD clothing */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.head);
        if (!clothing.head || op === 0) return null;
        const c = SLOT_COLORS.head;
        return (
          <g opacity={op} className={torn ? 'sprite-cloth-flutter' : undefined}>
            <ellipse cx={s.cx} cy={s.headCY - geom.headRY * 0.3} rx={geom.headRX + 1.5} ry={geom.headRY * 0.75} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
          </g>
        );
      })()}
    </>
  );
};
