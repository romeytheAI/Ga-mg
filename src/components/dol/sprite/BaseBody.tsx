import React from 'react';
import { BodyGeom, SpriteState } from './utils';
import { RacialBodyFeatures } from '../../../data/races';

interface BaseBodyProps {
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
}

export const BaseBody: React.FC<BaseBodyProps> = ({ geom, s, skin, accentClr, raceDef, isMale, isFemale, isChestExposed, pregnancyBump, clothing }) => {
  return (
    <>
      {/* ── TAIL (Khajiit / Argonian, drawn behind body) ── */}
      {raceDef.has_tail && raceDef.special_features.includes('tail_thick') && (
        <g className="sprite-tail-wag" style={{ transformOrigin: `${s.cx+4}px ${s.crotchY}px` }}>
          <path d={`M ${s.cx+4},${s.crotchY} Q ${s.cx+28},${s.crotchY+20} ${s.cx+38},${s.crotchY+55}`}
            fill="none" stroke={skin} strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
      {raceDef.has_tail && raceDef.special_features.includes('tail_thin') && (
        <g className="sprite-tail-wag" style={{ transformOrigin: `${s.cx+3}px ${s.crotchY+2}px` }}>
          <path d={`M ${s.cx+3},${s.crotchY+2} Q ${s.cx+32},${s.crotchY+8} ${s.cx+44},${s.crotchY+45} Q ${s.cx+50},${s.crotchY+65} ${s.cx+38},${s.crotchY+78}`}
            fill="none" stroke={skin} strokeWidth="4.5" strokeLinecap="round" />
          <path d={`M ${s.cx+3},${s.crotchY+2} Q ${s.cx+32},${s.crotchY+8} ${s.cx+44},${s.crotchY+45}`}
            fill="none" stroke={accentClr} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        </g>
      )}

      {/* ── LEGS ── */}
      {s.isDigi ? (
        <>
          {/* Khajiit digitigrade – left */}
          <rect x={s.legLX - geom.thighW/2} y={s.crotchY} width={geom.thighW} height={s.digiKneeY - s.crotchY} rx="4" fill={skin} />
          <line x1={s.legLX} y1={s.digiKneeY} x2={s.legLX - 7} y2={s.digiAnkleY} stroke={skin} strokeWidth={geom.calfW} strokeLinecap="round" />
          <line x1={s.legLX - 7} y1={s.digiAnkleY} x2={s.legLX - 4} y2={s.footBotY - 8} stroke={skin} strokeWidth={geom.calfW * 0.8} strokeLinecap="round" />
          <ellipse cx={s.legLX - 2} cy={s.footBotY - 5} rx={geom.footW * 0.55} ry={geom.footH * 0.75} fill={skin} />
          {/* Khajiit digitigrade – right */}
          <rect x={s.legRX - geom.thighW/2} y={s.crotchY} width={geom.thighW} height={s.digiKneeY - s.crotchY} rx="4" fill={skin} />
          <line x1={s.legRX} y1={s.digiKneeY} x2={s.legRX + 7} y2={s.digiAnkleY} stroke={skin} strokeWidth={geom.calfW} strokeLinecap="round" />
          <line x1={s.legRX + 7} y1={s.digiAnkleY} x2={s.legRX + 4} y2={s.footBotY - 8} stroke={skin} strokeWidth={geom.calfW * 0.8} strokeLinecap="round" />
          <ellipse cx={s.legRX + 2} cy={s.footBotY - 5} rx={geom.footW * 0.55} ry={geom.footH * 0.75} fill={skin} />
        </>
      ) : (
        <>
          {/* Standard plantigrade legs – left */}
          <rect x={s.legLX - geom.thighW/2} y={s.crotchY} width={geom.thighW} height={s.kneeY - s.crotchY} rx="5" fill={skin} />
          <ellipse cx={s.legLX} cy={s.kneeY} rx={geom.thighW * 0.52} ry="5" fill={skin} />
          <path d={`M ${s.legLX - geom.calfW/2},${s.kneeY} C ${s.legLX - geom.calfW/2 - 1},${s.kneeY+20} ${s.legLX - geom.calfW/2 - 1},${s.ankleY-10} ${s.legLX - geom.calfW/2 + 2},${s.ankleY} L ${s.legLX + geom.calfW/2 - 2},${s.ankleY} C ${s.legLX + geom.calfW/2 + 1},${s.ankleY-10} ${s.legLX + geom.calfW/2 + 1},${s.kneeY+20} ${s.legLX + geom.calfW/2},${s.kneeY} Z`} fill={skin} />
          <ellipse cx={s.legLX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2} ry={geom.footH/2} fill={skin} />
          {/* Right leg */}
          <rect x={s.legRX - geom.thighW/2} y={s.crotchY} width={geom.thighW} height={s.kneeY - s.crotchY} rx="5" fill={skin} />
          <ellipse cx={s.legRX} cy={s.kneeY} rx={geom.thighW * 0.52} ry="5" fill={skin} />
          <path d={`M ${s.legRX - geom.calfW/2},${s.kneeY} C ${s.legRX - geom.calfW/2 - 1},${s.kneeY+20} ${s.legRX - geom.calfW/2 - 1},${s.ankleY-10} ${s.legRX - geom.calfW/2 + 2},${s.ankleY} L ${s.legRX + geom.calfW/2 - 2},${s.ankleY} C ${s.legRX + geom.calfW/2 + 1},${s.ankleY-10} ${s.legRX + geom.calfW/2 + 1},${s.kneeY+20} ${s.legRX + geom.calfW/2},${s.kneeY} Z`} fill={skin} />
          <ellipse cx={s.legRX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2} ry={geom.footH/2} fill={skin} />
        </>
      )}

      {/* Foot claws */}
      {(raceDef.foot_type === 'clawed' || raceDef.foot_type === 'pawed_digitigrade') && (
        <g>
          {[-5, 0, 5].map((dx, i) => (
            <line key={`clf-${i}`} x1={s.legLX + dx} y1={s.footBotY - 2} x2={s.legLX + dx - 1.5} y2={s.footBotY + 5} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
          ))}
          {[-5, 0, 5].map((dx, i) => (
            <line key={`crf-${i}`} x1={s.legRX + dx} y1={s.footBotY - 2} x2={s.legRX + dx + 1.5} y2={s.footBotY + 5} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </g>
      )}

      {/* ── TORSO (shoulder → waist) ── */}
      <path d={`M ${s.cx - geom.shoulderHW},${s.shldY} C ${s.cx - geom.shoulderHW - 1},${s.shldY + 22} ${s.cx - geom.waistHW - 1},${s.waistY - 14} ${s.cx - geom.waistHW},${s.waistY} L ${s.cx + geom.waistHW},${s.waistY} C ${s.cx + geom.waistHW + 1},${s.waistY - 14} ${s.cx + geom.shoulderHW + 1},${s.shldY + 22} ${s.cx + geom.shoulderHW},${s.shldY} Z`} fill={skin} />
      {/* Abdomen (waist → hip) */}
      <path d={`M ${s.cx - geom.waistHW},${s.waistY} C ${s.cx - geom.waistHW - 1},${s.hipTopY - 5} ${s.cx - geom.hipHW - 1},${s.hipTopY + 2} ${s.cx - geom.hipHW},${s.hipTopY} L ${s.cx + geom.hipHW},${s.hipTopY} C ${s.cx + geom.hipHW + 1},${s.hipTopY + 2} ${s.cx + geom.waistHW + 1},${s.hipTopY - 5} ${s.cx + geom.waistHW},${s.waistY} Z`} fill={skin} />
      {/* Pelvis */}
      <path d={`M ${s.cx - geom.hipHW},${s.hipTopY} L ${s.cx + geom.hipHW},${s.hipTopY} C ${s.cx + geom.hipHW + 2},${s.crotchY - 4} ${s.legRX + geom.thighW/2},${s.crotchY} L ${s.legLX - geom.thighW/2},${s.crotchY} C ${s.cx - geom.hipHW - 2},${s.crotchY - 4} ${s.cx - geom.hipHW},${s.hipTopY} Z`} fill={skin} />

      {/* ── PREGNANCY BELLY OVERLAY ── */}
      {pregnancyBump > 0 && (
        <ellipse
          cx={s.cx} cy={s.waistY - 2 + pregnancyBump * 12}
          rx={geom.waistHW + pregnancyBump * 14}
          ry={pregnancyBump * 18}
          fill={skin}
        />
      )}

      {/* ── ARMS ── */}
      {/* Left upper arm */}
      <path d={`M ${s.shLX - geom.upperArmW/2},${s.shldY} L ${s.elLX - geom.upperArmW/2 - 1},${s.elY} L ${s.elLX + geom.upperArmW/2 - 1},${s.elY} L ${s.shLX + geom.upperArmW/2},${s.shldY} Z`} fill={skin} />
      <ellipse cx={s.elLX} cy={s.elY} rx={geom.upperArmW * 0.5} ry="4" fill={skin} />
      <path d={`M ${s.elLX - geom.forearmW/2 - 1},${s.elY} L ${s.wrLX - geom.forearmW/2},${s.wrY} L ${s.wrLX + geom.forearmW/2},${s.wrY} L ${s.elLX + geom.forearmW/2 - 1},${s.elY} Z`} fill={skin} />
      <ellipse cx={s.wrLX} cy={s.handCY} rx={geom.handW/2} ry={geom.handH/2} fill={skin} />
      {/* Right upper arm */}
      <path d={`M ${s.shRX - geom.upperArmW/2},${s.shldY} L ${s.elRX - geom.upperArmW/2 + 1},${s.elY} L ${s.elRX + geom.upperArmW/2 + 1},${s.elY} L ${s.shRX + geom.upperArmW/2},${s.shldY} Z`} fill={skin} />
      <ellipse cx={s.elRX} cy={s.elY} rx={geom.upperArmW * 0.5} ry="4" fill={skin} />
      <path d={`M ${s.elRX - geom.forearmW/2 + 1},${s.elY} L ${s.wrRX - geom.forearmW/2},${s.wrY} L ${s.wrRX + geom.forearmW/2},${s.wrY} L ${s.elRX + geom.forearmW/2 + 1},${s.elY} Z`} fill={skin} />
      <ellipse cx={s.wrRX} cy={s.handCY} rx={geom.handW/2} ry={geom.handH/2} fill={skin} />

      {/* Hand claws */}
      {(raceDef.hand_type !== 'human') && (
        <g>
          {[-4, -1.5, 1, 3.5].map((dx, i) => (
            <line key={`clhl-${i}`} x1={s.wrLX + dx} y1={s.handCY + geom.handH/2 - 1} x2={s.wrLX + dx - 1.5} y2={s.handCY + geom.handH/2 + 4} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
          ))}
          {[-3.5, -1, 1.5, 4].map((dx, i) => (
            <line key={`clhr-${i}`} x1={s.wrRX + dx} y1={s.handCY + geom.handH/2 - 1} x2={s.wrRX + dx + 1.5} y2={s.handCY + geom.handH/2 + 4} stroke={accentClr} strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </g>
      )}

      {/* ── MUSCLE DEFINITION (arms) ── */}
      {geom.showMuscleDef && !clothing.shoulders && (
        <g>
          {/* Left bicep curve */}
          <path d={`M ${s.shLX - geom.upperArmW * 0.25},${s.shldY + 8} Q ${s.shLX - geom.upperArmW * 0.55},${s.shldY + 22} ${s.shLX - geom.upperArmW * 0.25},${s.shldY + 34}`}
            fill="none" stroke={`${skin}48`} strokeWidth="0.85" strokeLinecap="round" />
          {/* Right bicep curve */}
          <path d={`M ${s.shRX + geom.upperArmW * 0.25},${s.shldY + 8} Q ${s.shRX + geom.upperArmW * 0.55},${s.shldY + 22} ${s.shRX + geom.upperArmW * 0.25},${s.shldY + 34}`}
            fill="none" stroke={`${skin}48`} strokeWidth="0.85" strokeLinecap="round" />
        </g>
      )}
      {/* Muscle definition (torso centre line) */}
      {geom.showMuscleDef && isChestExposed && (
        <path d={`M ${s.cx},${s.shldY + 6} L ${s.cx},${s.waistY - 4}`}
          fill="none" stroke={`${skin}38`} strokeWidth="0.7" />
      )}

      {/* ── NECK ── */}
      <rect x={s.cx - geom.headRX * 0.48} y={s.neckTopY} width={geom.headRX * 0.96} height={s.neckBotY - s.neckTopY + 1} fill={skin} />

      {/* Adam's apple (male) */}
      {geom.showAdamsApple && (
        <ellipse cx={s.cx} cy={s.neckTopY + 4} rx="2" ry="1.6" fill={`${skin}88`} />
      )}

      {/* ── HEAD ── */}
      <ellipse cx={s.cx} cy={s.headCY} rx={geom.headRX} ry={geom.headRY} fill={skin} />
      {/* Chin shape (squarer for male) */}
      <path d={`M ${s.cx - geom.headRX * 0.78},${s.headCY + geom.headRY * 0.45} Q ${s.cx - geom.headRX * 0.6 - geom.jawW},${s.headCY + geom.headRY + 1} ${s.cx},${s.headCY + geom.headRY + 1.5} Q ${s.cx + geom.headRX * 0.6 + geom.jawW},${s.headCY + geom.headRY + 1} ${s.cx + geom.headRX * 0.78},${s.headCY + geom.headRY * 0.45} Z`} fill={skin} />
    </>
  );
};
