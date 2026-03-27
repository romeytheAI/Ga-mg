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
  /* ── Pre-compute derived values ────────────────────────────────── */
  const tw = geom.thighW;
  const cw = geom.calfW;

  return (
    <g filter="url(#sss)">
      {/* ── TAIL (Khajiit / Argonian, drawn behind body) ── */}
      {raceDef.has_tail && raceDef.special_features.includes('tail_thick') && (
        <g className="sprite-tail-wag" style={{ transformOrigin: `${s.cx+4}px ${s.crotchY}px` }}>
          <path d={`M ${s.cx+4},${s.crotchY} Q ${s.cx+28},${s.crotchY+20} ${s.cx+38},${s.crotchY+55}`}
            fill="none" stroke={skin} strokeWidth="8" strokeLinecap="round" />
          <path d={`M ${s.cx+4},${s.crotchY} Q ${s.cx+28},${s.crotchY+20} ${s.cx+38},${s.crotchY+55}`}
            fill="none" stroke="url(#rim-light)" strokeWidth="8" strokeLinecap="round" />
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

      {/* ── LEGS (smooth bezier contours) ── */}
      {s.isDigi ? (
        <>
          {/* Khajiit digitigrade – left */}
          <path d={`M ${s.legLX - tw/2},${s.crotchY}
            C ${s.legLX - tw/2 - 1},${s.crotchY + 15} ${s.legLX - tw * 0.55},${s.digiKneeY - 8} ${s.legLX - 3},${s.digiKneeY}
            L ${s.legLX - 7},${s.digiAnkleY}
            L ${s.legLX - 4},${s.footBotY - 8}
            L ${s.legLX + 4},${s.footBotY - 8}
            L ${s.legLX + 3},${s.digiAnkleY}
            L ${s.legLX + 3},${s.digiKneeY}
            C ${s.legLX + tw * 0.55},${s.digiKneeY - 8} ${s.legLX + tw/2 + 1},${s.crotchY + 15} ${s.legLX + tw/2},${s.crotchY} Z`}
            fill="url(#skin-body)" />
          <ellipse cx={s.legLX - 2} cy={s.footBotY - 5} rx={geom.footW * 0.55} ry={geom.footH * 0.75} fill={skin} />
          {/* Khajiit digitigrade – right */}
          <path d={`M ${s.legRX - tw/2},${s.crotchY}
            C ${s.legRX - tw * 0.55},${s.crotchY + 15} ${s.legRX - 3},${s.digiKneeY - 8} ${s.legRX - 3},${s.digiKneeY}
            L ${s.legRX - 3},${s.digiAnkleY}
            L ${s.legRX - 4},${s.footBotY - 8}
            L ${s.legRX + 4},${s.footBotY - 8}
            L ${s.legRX + 7},${s.digiAnkleY}
            L ${s.legRX + 3},${s.digiKneeY}
            C ${s.legRX + tw * 0.55},${s.digiKneeY - 8} ${s.legRX + tw/2 + 1},${s.crotchY + 15} ${s.legRX + tw/2},${s.crotchY} Z`}
            fill="url(#skin-body)" />
          <ellipse cx={s.legRX + 2} cy={s.footBotY - 5} rx={geom.footW * 0.55} ry={geom.footH * 0.75} fill={skin} />
        </>
      ) : (
        <>
          {/* Left thigh – smooth taper with curves */}
          <path d={`M ${s.legLX - tw/2},${s.crotchY}
            C ${s.legLX - tw/2 - 0.5},${s.crotchY + 12} ${s.legLX - tw * 0.52},${s.kneeY - 18} ${s.legLX - tw * 0.42},${s.kneeY}
            L ${s.legLX + tw * 0.42},${s.kneeY}
            C ${s.legLX + tw * 0.52},${s.kneeY - 18} ${s.legLX + tw/2 + 0.5},${s.crotchY + 12} ${s.legLX + tw/2},${s.crotchY} Z`}
            fill="url(#skin-body)" />
          {/* Left knee cap highlight */}
          <ellipse cx={s.legLX} cy={s.kneeY} rx={tw * 0.35} ry="3.5" fill={skin} opacity="0.6" />
          {/* Left calf – curved taper */}
          <path d={`M ${s.legLX - cw/2},${s.kneeY}
            C ${s.legLX - cw/2 - 1.5},${s.kneeY + 14} ${s.legLX - cw * 0.55},${(s.kneeY + s.ankleY) * 0.5} ${s.legLX - cw * 0.35},${s.ankleY}
            L ${s.legLX + cw * 0.35},${s.ankleY}
            C ${s.legLX + cw * 0.55},${(s.kneeY + s.ankleY) * 0.5} ${s.legLX + cw/2 + 1.5},${s.kneeY + 14} ${s.legLX + cw/2},${s.kneeY} Z`}
            fill="url(#skin-body)" />
          {/* Left foot */}
          <ellipse cx={s.legLX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2} ry={geom.footH/2} fill={skin} />
          {/* Left leg shading overlay */}
          <path d={`M ${s.legLX - tw/2},${s.crotchY}
            C ${s.legLX - tw/2 - 0.5},${s.crotchY + 12} ${s.legLX - tw * 0.52},${s.kneeY - 18} ${s.legLX - tw * 0.42},${s.kneeY}
            L ${s.legLX + tw * 0.42},${s.kneeY}
            C ${s.legLX + tw * 0.52},${s.kneeY - 18} ${s.legLX + tw/2 + 0.5},${s.crotchY + 12} ${s.legLX + tw/2},${s.crotchY} Z`}
            fill="url(#limb-shade-l)" />

          {/* Right thigh */}
          <path d={`M ${s.legRX - tw/2},${s.crotchY}
            C ${s.legRX - tw/2 - 0.5},${s.crotchY + 12} ${s.legRX - tw * 0.52},${s.kneeY - 18} ${s.legRX - tw * 0.42},${s.kneeY}
            L ${s.legRX + tw * 0.42},${s.kneeY}
            C ${s.legRX + tw * 0.52},${s.kneeY - 18} ${s.legRX + tw/2 + 0.5},${s.crotchY + 12} ${s.legRX + tw/2},${s.crotchY} Z`}
            fill="url(#skin-body)" />
          <ellipse cx={s.legRX} cy={s.kneeY} rx={tw * 0.35} ry="3.5" fill={skin} opacity="0.6" />
          {/* Right calf */}
          <path d={`M ${s.legRX - cw/2},${s.kneeY}
            C ${s.legRX - cw/2 - 1.5},${s.kneeY + 14} ${s.legRX - cw * 0.55},${(s.kneeY + s.ankleY) * 0.5} ${s.legRX - cw * 0.35},${s.ankleY}
            L ${s.legRX + cw * 0.35},${s.ankleY}
            C ${s.legRX + cw * 0.55},${(s.kneeY + s.ankleY) * 0.5} ${s.legRX + cw/2 + 1.5},${s.kneeY + 14} ${s.legRX + cw/2},${s.kneeY} Z`}
            fill="url(#skin-body)" />
          <ellipse cx={s.legRX + geom.footW * 0.1} cy={s.footBotY - geom.footH/2} rx={geom.footW/2} ry={geom.footH/2} fill={skin} />
          {/* Right leg shading overlay */}
          <path d={`M ${s.legRX - tw/2},${s.crotchY}
            C ${s.legRX - tw/2 - 0.5},${s.crotchY + 12} ${s.legRX - tw * 0.52},${s.kneeY - 18} ${s.legRX - tw * 0.42},${s.kneeY}
            L ${s.legRX + tw * 0.42},${s.kneeY}
            C ${s.legRX + tw * 0.52},${s.kneeY - 18} ${s.legRX + tw/2 + 0.5},${s.crotchY + 12} ${s.legRX + tw/2},${s.crotchY} Z`}
            fill="url(#limb-shade-r)" />
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

      {/* ── TORSO (smooth single-path silhouette shoulder→waist→hip→crotch) ── */}
      <path d={`
        M ${s.cx - geom.shoulderHW},${s.shldY}
        C ${s.cx - geom.shoulderHW - 1},${s.shldY + 22}
          ${s.cx - geom.waistHW - 1},${s.waistY - 14}
          ${s.cx - geom.waistHW},${s.waistY}
        C ${s.cx - geom.waistHW - 1},${s.hipTopY - 5}
          ${s.cx - geom.hipHW - 1},${s.hipTopY + 2}
          ${s.cx - geom.hipHW},${s.hipTopY}
        C ${s.cx - geom.hipHW - 2},${s.crotchY - 4}
          ${s.legLX - tw/2},${s.crotchY}
          ${s.legLX - tw/2},${s.crotchY}
        L ${s.legRX + tw/2},${s.crotchY}
        C ${s.legRX + tw/2},${s.crotchY}
          ${s.cx + geom.hipHW + 2},${s.crotchY - 4}
          ${s.cx + geom.hipHW},${s.hipTopY}
        C ${s.cx + geom.hipHW + 1},${s.hipTopY + 2}
          ${s.cx + geom.waistHW + 1},${s.hipTopY - 5}
          ${s.cx + geom.waistHW},${s.waistY}
        C ${s.cx + geom.waistHW + 1},${s.waistY - 14}
          ${s.cx + geom.shoulderHW + 1},${s.shldY + 22}
          ${s.cx + geom.shoulderHW},${s.shldY}
        Z`}
        fill="url(#skin-body)" />
      {/* Torso shading overlay */}
      <path d={`
        M ${s.cx - geom.shoulderHW},${s.shldY}
        C ${s.cx - geom.shoulderHW - 1},${s.shldY + 22}
          ${s.cx - geom.waistHW - 1},${s.waistY - 14}
          ${s.cx - geom.waistHW},${s.waistY}
        C ${s.cx - geom.waistHW - 1},${s.hipTopY - 5}
          ${s.cx - geom.hipHW - 1},${s.hipTopY + 2}
          ${s.cx - geom.hipHW},${s.hipTopY}
        C ${s.cx - geom.hipHW - 2},${s.crotchY - 4}
          ${s.legLX - tw/2},${s.crotchY}
          ${s.legLX - tw/2},${s.crotchY}
        L ${s.legRX + tw/2},${s.crotchY}
        C ${s.legRX + tw/2},${s.crotchY}
          ${s.cx + geom.hipHW + 2},${s.crotchY - 4}
          ${s.cx + geom.hipHW},${s.hipTopY}
        C ${s.cx + geom.hipHW + 1},${s.hipTopY + 2}
          ${s.cx + geom.waistHW + 1},${s.hipTopY - 5}
          ${s.cx + geom.waistHW},${s.waistY}
        C ${s.cx + geom.waistHW + 1},${s.waistY - 14}
          ${s.cx + geom.shoulderHW + 1},${s.shldY + 22}
          ${s.cx + geom.shoulderHW},${s.shldY}
        Z`}
        fill="url(#torso-shade)" />
      {/* Rim light on right edge */}
      <path d={`
        M ${s.cx + geom.shoulderHW},${s.shldY}
        C ${s.cx + geom.shoulderHW + 1},${s.shldY + 22}
          ${s.cx + geom.waistHW + 1},${s.waistY - 14}
          ${s.cx + geom.waistHW},${s.waistY}
        C ${s.cx + geom.waistHW + 1},${s.hipTopY - 5}
          ${s.cx + geom.hipHW + 1},${s.hipTopY + 2}
          ${s.cx + geom.hipHW},${s.hipTopY}`}
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* ── PREGNANCY BELLY OVERLAY ── */}
      {pregnancyBump > 0 && (
        <ellipse
          cx={s.cx} cy={s.waistY - 2 + pregnancyBump * 12}
          rx={geom.waistHW + pregnancyBump * 14}
          ry={pregnancyBump * 18}
          fill={skin}
        />
      )}

      {/* ── ARMS (bezier-curved limbs with gradient shading) ── */}
      {/* Left upper arm */}
      <path d={`M ${s.shLX - geom.upperArmW/2},${s.shldY}
        C ${s.shLX - geom.upperArmW * 0.6},${s.shldY + 12} ${s.elLX - geom.upperArmW * 0.55},${s.elY - 8} ${s.elLX - geom.upperArmW/2 - 1},${s.elY}
        L ${s.elLX + geom.upperArmW/2 - 1},${s.elY}
        C ${s.elLX + geom.upperArmW * 0.45},${s.elY - 8} ${s.shLX + geom.upperArmW * 0.55},${s.shldY + 12} ${s.shLX + geom.upperArmW/2},${s.shldY} Z`}
        fill="url(#skin-body)" />
      <path d={`M ${s.shLX - geom.upperArmW/2},${s.shldY}
        C ${s.shLX - geom.upperArmW * 0.6},${s.shldY + 12} ${s.elLX - geom.upperArmW * 0.55},${s.elY - 8} ${s.elLX - geom.upperArmW/2 - 1},${s.elY}
        L ${s.elLX + geom.upperArmW/2 - 1},${s.elY}
        C ${s.elLX + geom.upperArmW * 0.45},${s.elY - 8} ${s.shLX + geom.upperArmW * 0.55},${s.shldY + 12} ${s.shLX + geom.upperArmW/2},${s.shldY} Z`}
        fill="url(#limb-shade-l)" />
      <ellipse cx={s.elLX} cy={s.elY} rx={geom.upperArmW * 0.5} ry="3.5" fill={skin} opacity="0.55" />
      {/* Left forearm */}
      <path d={`M ${s.elLX - geom.forearmW/2 - 1},${s.elY}
        C ${s.elLX - geom.forearmW * 0.55},${s.elY + 10} ${s.wrLX - geom.forearmW * 0.45},${s.wrY - 8} ${s.wrLX - geom.forearmW/2},${s.wrY}
        L ${s.wrLX + geom.forearmW/2},${s.wrY}
        C ${s.wrLX + geom.forearmW * 0.45},${s.wrY - 8} ${s.elLX + geom.forearmW * 0.45},${s.elY + 10} ${s.elLX + geom.forearmW/2 - 1},${s.elY} Z`}
        fill="url(#skin-body)" />
      <ellipse cx={s.wrLX} cy={s.handCY} rx={geom.handW/2} ry={geom.handH/2} fill={skin} />
      {/* Hand highlight */}
      <ellipse cx={s.wrLX - 1} cy={s.handCY - 1} rx={geom.handW * 0.3} ry={geom.handH * 0.3} fill="rgba(255,255,255,0.08)" />

      {/* Right upper arm */}
      <path d={`M ${s.shRX - geom.upperArmW/2},${s.shldY}
        C ${s.shRX - geom.upperArmW * 0.55},${s.shldY + 12} ${s.elRX - geom.upperArmW * 0.45},${s.elY - 8} ${s.elRX - geom.upperArmW/2 + 1},${s.elY}
        L ${s.elRX + geom.upperArmW/2 + 1},${s.elY}
        C ${s.elRX + geom.upperArmW * 0.6},${s.elY - 8} ${s.shRX + geom.upperArmW * 0.55},${s.shldY + 12} ${s.shRX + geom.upperArmW/2},${s.shldY} Z`}
        fill="url(#skin-body)" />
      <path d={`M ${s.shRX - geom.upperArmW/2},${s.shldY}
        C ${s.shRX - geom.upperArmW * 0.55},${s.shldY + 12} ${s.elRX - geom.upperArmW * 0.45},${s.elY - 8} ${s.elRX - geom.upperArmW/2 + 1},${s.elY}
        L ${s.elRX + geom.upperArmW/2 + 1},${s.elY}
        C ${s.elRX + geom.upperArmW * 0.6},${s.elY - 8} ${s.shRX + geom.upperArmW * 0.55},${s.shldY + 12} ${s.shRX + geom.upperArmW/2},${s.shldY} Z`}
        fill="url(#limb-shade-r)" />
      <ellipse cx={s.elRX} cy={s.elY} rx={geom.upperArmW * 0.5} ry="3.5" fill={skin} opacity="0.55" />
      {/* Right forearm */}
      <path d={`M ${s.elRX - geom.forearmW/2 + 1},${s.elY}
        C ${s.elRX - geom.forearmW * 0.45},${s.elY + 10} ${s.wrRX - geom.forearmW * 0.45},${s.wrY - 8} ${s.wrRX - geom.forearmW/2},${s.wrY}
        L ${s.wrRX + geom.forearmW/2},${s.wrY}
        C ${s.wrRX + geom.forearmW * 0.45},${s.wrY - 8} ${s.elRX + geom.forearmW * 0.55},${s.elY + 10} ${s.elRX + geom.forearmW/2 + 1},${s.elY} Z`}
        fill="url(#skin-body)" />
      <ellipse cx={s.wrRX} cy={s.handCY} rx={geom.handW/2} ry={geom.handH/2} fill={skin} />
      <ellipse cx={s.wrRX + 1} cy={s.handCY - 1} rx={geom.handW * 0.3} ry={geom.handH * 0.3} fill="rgba(255,255,255,0.08)" />

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
          <path d={`M ${s.shLX - geom.upperArmW * 0.25},${s.shldY + 8} Q ${s.shLX - geom.upperArmW * 0.55},${s.shldY + 22} ${s.shLX - geom.upperArmW * 0.25},${s.shldY + 34}`}
            fill="none" stroke={`${skin}48`} strokeWidth="0.85" strokeLinecap="round" />
          <path d={`M ${s.shRX + geom.upperArmW * 0.25},${s.shldY + 8} Q ${s.shRX + geom.upperArmW * 0.55},${s.shldY + 22} ${s.shRX + geom.upperArmW * 0.25},${s.shldY + 34}`}
            fill="none" stroke={`${skin}48`} strokeWidth="0.85" strokeLinecap="round" />
        </g>
      )}
      {geom.showMuscleDef && isChestExposed && (
        <path d={`M ${s.cx},${s.shldY + 6} L ${s.cx},${s.waistY - 4}`}
          fill="none" stroke={`${skin}38`} strokeWidth="0.7" />
      )}

      {/* ── NECK (tapered with shading) ── */}
      <path d={`M ${s.cx - geom.headRX * 0.42},${s.neckTopY}
        L ${s.cx - geom.headRX * 0.48},${s.neckBotY + 1}
        L ${s.cx + geom.headRX * 0.48},${s.neckBotY + 1}
        L ${s.cx + geom.headRX * 0.42},${s.neckTopY} Z`}
        fill="url(#skin-body)" />
      {/* Neck shadow from jaw */}
      <ellipse cx={s.cx} cy={s.neckTopY + 2} rx={geom.headRX * 0.45} ry="2.5"
        fill={`${skin}40`} />

      {/* Adam's apple (male) */}
      {geom.showAdamsApple && (
        <ellipse cx={s.cx} cy={s.neckTopY + 4} rx="2" ry="1.6" fill={`${skin}88`} />
      )}

      {/* ── HEAD (gradient-filled with chin) ── */}
      <ellipse cx={s.cx} cy={s.headCY} rx={geom.headRX} ry={geom.headRY} fill="url(#skin-face)" />
      {/* Chin shape (squarer for male) */}
      <path d={`M ${s.cx - geom.headRX * 0.78},${s.headCY + geom.headRY * 0.45}
        Q ${s.cx - geom.headRX * 0.6 - geom.jawW},${s.headCY + geom.headRY + 1}
          ${s.cx},${s.headCY + geom.headRY + 1.5}
        Q ${s.cx + geom.headRX * 0.6 + geom.jawW},${s.headCY + geom.headRY + 1}
          ${s.cx + geom.headRX * 0.78},${s.headCY + geom.headRY * 0.45} Z`}
        fill="url(#skin-face)" />
      {/* Head rim light */}
      <path d={`M ${s.cx + geom.headRX * 0.5},${s.headCY - geom.headRY * 0.85}
        A ${geom.headRX} ${geom.headRY} 0 0 1 ${s.cx + geom.headRX * 0.6},${s.headCY + geom.headRY * 0.4}`}
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
    </g>
  );
};
