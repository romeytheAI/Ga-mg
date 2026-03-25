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

  return (
    <>
      {/* FEET */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.feet);
        if (!clothing.feet || op === 0) return null;
        const c = SLOT_COLORS.feet;
        return (
          <g opacity={op}>
            <ellipse cx={s.legLX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2 + 1} ry={geom.footH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            <ellipse cx={s.legRX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2 + 1} ry={geom.footH/2 + 1} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            {torn && tornMark(s.legLX, s.footBotY - 6, 'torn-f')}
          </g>
        );
      })()}

      {/* LEGS */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.legs);
        if (!clothing.legs || op === 0) return null;
        const c = SLOT_COLORS.legs;
        return (
          <g opacity={op}>
            <rect x={s.legLX - geom.thighW/2 - 1} y={s.crotchY} width={geom.thighW + 2} height={s.ankleY - s.crotchY} rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            <rect x={s.legRX - geom.thighW/2 - 1} y={s.crotchY} width={geom.thighW + 2} height={s.ankleY - s.crotchY} rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            {torn && tornMark(s.legLX - 2, s.kneeY - 10, 'torn-ll')}
            {torn && tornMark(s.legRX + 2, s.kneeY + 5, 'torn-rl')}
          </g>
        );
      })()}

      {/* UNDERWEAR */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.underwear);
        if (!clothing.underwear || op === 0) return null;
        const c = SLOT_COLORS.underwear;
        return (
          <g opacity={op}>
            <rect x={s.cx - geom.hipHW - 1} y={s.hipTopY + 4} width={(geom.hipHW + 1) * 2} height={s.crotchY - s.hipTopY - 2} rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            {torn && tornMark(s.cx - 5, s.hipTopY + 8, 'torn-uw')}
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
        return (
          <g opacity={op} className={torn ? 'sprite-cloth-flutter' : undefined}>
            <path d={`M ${s.cx - geom.shoulderHW - 1},${s.shldY} C ${s.cx - geom.shoulderHW - 2},${s.shldY + 22} ${s.cx - geom.waistHW - 1},${s.waistY - 14} ${s.cx - geom.waistHW - 1},${s.waistY + 1} L ${s.cx + geom.waistHW + 1},${s.waistY + 1} C ${s.cx + geom.waistHW + 1},${s.waistY - 14} ${s.cx + geom.shoulderHW + 2},${s.shldY + 22} ${s.cx + geom.shoulderHW + 1},${s.shldY} Z`} fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '3 2' : undefined} />
            {torn && tornMark(s.cx - 8, s.shldY + 18, 'torn-c1')}
            {torn && tornMark(s.cx + 6, s.waistY - 12, 'torn-c2')}
          </g>
        );
      })()}

      {/* SHOULDERS */}
      {(() => {
        const { op, torn } = integrityStyle(clothing.shoulders);
        if (!clothing.shoulders || op === 0) return null;
        const c = SLOT_COLORS.shoulders;
        return (
          <g opacity={op}>
            <rect x={s.shLX - geom.upperArmW} y={s.shldY - 2} width={geom.upperArmW * 2 + 2} height="16" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
            <rect x={s.shRX - geom.upperArmW} y={s.shldY - 2} width={geom.upperArmW * 2 + 2} height="16" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" strokeDasharray={torn ? '2 2' : undefined} />
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
