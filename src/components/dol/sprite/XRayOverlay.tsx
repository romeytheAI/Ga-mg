import React from 'react';
import { BodyGeom, SpriteState } from './utils';

interface XRayOverlayProps {
  geom: BodyGeom;
  s: SpriteState;
  isFemale: boolean;
  organs: { heart: number; lungs: number; stomach: number; liver: number; kidneys: number };
  bones_integrity: { skull: number; spine: number; ribs: number; arms: number; legs: number };
}

/** Color ramp: 100→green, 50→yellow, 0→red */
function healthColor(v: number): string {
  if (v >= 80) return 'rgba(0,255,120,0.55)';
  if (v >= 50) return 'rgba(255,220,40,0.55)';
  return 'rgba(255,50,30,0.65)';
}
function boneColor(v: number): string {
  if (v >= 80) return 'rgba(200,220,255,0.65)';
  if (v >= 50) return 'rgba(255,200,100,0.55)';
  return 'rgba(255,80,50,0.65)';
}

/**
 * X-ray overlay that draws directly on top of the DoL sprite.
 * Uses the same viewBox "0 0 100 225" coordinate system.
 * Renders a fully-animated translucent skeleton + organ system with
 * DoL-parity internal organ animations: heartbeat, lung breathing,
 * stomach churning, intestinal peristalsis, kidney filtration,
 * brain neural activity, bladder pulsing, uterine contractions,
 * circulatory blood flow pulses, and nerve impulses along the spine.
 */
export const XRayOverlay: React.FC<XRayOverlayProps> = ({ geom, s, isFemale, organs, bones_integrity }) => {
  const cx = s.cx; // 50

  // ── Spine vertebrae ─────────────────────────────────────────────
  const spineTop = s.neckTopY + 2;
  const spineBot = s.crotchY - 2;
  const spineLen = spineBot - spineTop;
  const vertebrae: number[] = [];
  for (let i = 0; i <= 12; i++) {
    vertebrae.push(spineTop + (spineLen * i) / 12);
  }

  // Damage thresholds for organ animation variants
  const heartDamaged = organs.heart < 50;
  const lungsDamaged = organs.lungs < 50;
  const stomachDamaged = organs.stomach < 50;
  const liverDamaged = organs.liver < 50;

  return (
    <g>
      {/* ── Dark semi-transparent skin overlay to make internals visible ── */}
      <rect x="0" y="0" width="100" height="225" fill="rgba(0,0,0,0.45)" />

      {/* ══════════════════════════════════════════════════════════════
          SKELETON
         ══════════════════════════════════════════════════════════════ */}

      {/* ── Skull ── */}
      <ellipse cx={cx} cy={s.headCY} rx={geom.headRX * 0.75} ry={geom.headRY * 0.8}
        fill="none" stroke={boneColor(bones_integrity.skull)} strokeWidth="1.2" />
      {/* Eye sockets */}
      <ellipse cx={cx - 4} cy={s.headCY - 1} rx="3" ry="2.5"
        fill="rgba(0,0,0,0.5)" stroke={boneColor(bones_integrity.skull)} strokeWidth="0.6" />
      <ellipse cx={cx + 4} cy={s.headCY - 1} rx="3" ry="2.5"
        fill="rgba(0,0,0,0.5)" stroke={boneColor(bones_integrity.skull)} strokeWidth="0.6" />
      {/* Nasal cavity */}
      <path d={`M ${cx - 1.5},${s.headCY + 3} L ${cx},${s.headCY + 5.5} L ${cx + 1.5},${s.headCY + 3}`}
        fill="none" stroke={boneColor(bones_integrity.skull)} strokeWidth="0.5" />
      {/* Jaw */}
      <path d={`M ${cx - geom.headRX * 0.55},${s.headCY + 2}
        Q ${cx - geom.headRX * 0.45},${s.headCY + geom.headRY * 0.85}
          ${cx},${s.headCY + geom.headRY * 0.75}
        Q ${cx + geom.headRX * 0.45},${s.headCY + geom.headRY * 0.85}
          ${cx + geom.headRX * 0.55},${s.headCY + 2}`}
        fill="none" stroke={boneColor(bones_integrity.skull)} strokeWidth="0.8" />
      {/* Teeth row */}
      <line x1={cx - 4} y1={s.headCY + 6.5} x2={cx + 4} y2={s.headCY + 6.5}
        stroke={boneColor(bones_integrity.skull)} strokeWidth="0.5" strokeDasharray="1 0.8" />

      {/* ── Spine ── */}
      <line x1={cx} y1={spineTop} x2={cx} y2={spineBot}
        stroke={boneColor(bones_integrity.spine)} strokeWidth="1.5" />
      {/* Vertebrae */}
      {vertebrae.map((vy, i) => (
        <line key={`vert-${i}`}
          x1={cx - 3.5} y1={vy} x2={cx + 3.5} y2={vy}
          stroke={boneColor(bones_integrity.spine)} strokeWidth="0.8" />
      ))}
      {/* Nerve impulses along spine */}
      <line x1={cx - 1} y1={spineTop} x2={cx - 1} y2={spineBot}
        stroke="rgba(120,200,255,0.6)" strokeWidth="0.4" className="xray-nerve-impulse" />
      <line x1={cx + 1} y1={spineTop} x2={cx + 1} y2={spineBot}
        stroke="rgba(120,200,255,0.5)" strokeWidth="0.3" className="xray-nerve-impulse-b" />
      {/* Coccyx / sacrum */}
      <path d={`M ${cx},${spineBot} L ${cx},${s.crotchY + 4}`}
        stroke={boneColor(bones_integrity.spine)} strokeWidth="1" />

      {/* ── Ribs ── */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const ribY = s.shldY + 8 + i * 7;
        const ribW = (geom.shoulderHW - 2) * (1 - i * 0.06);
        return (
          <React.Fragment key={`rib-${i}`}>
            <path d={`M ${cx - 2},${ribY}
              Q ${cx - ribW * 0.7},${ribY - 3}
                ${cx - ribW},${ribY + 2}
              Q ${cx - ribW - 1},${ribY + 5}
                ${cx - ribW * 0.6},${ribY + 5}`}
              fill="none" stroke={boneColor(bones_integrity.ribs)} strokeWidth="0.7" />
            <path d={`M ${cx + 2},${ribY}
              Q ${cx + ribW * 0.7},${ribY - 3}
                ${cx + ribW},${ribY + 2}
              Q ${cx + ribW + 1},${ribY + 5}
                ${cx + ribW * 0.6},${ribY + 5}`}
              fill="none" stroke={boneColor(bones_integrity.ribs)} strokeWidth="0.7" />
          </React.Fragment>
        );
      })}
      {/* Sternum */}
      <line x1={cx} y1={s.shldY + 5} x2={cx} y2={s.shldY + 48}
        stroke={boneColor(bones_integrity.ribs)} strokeWidth="1.2" />

      {/* ── Clavicles ── */}
      <line x1={cx - 1} y1={s.shldY + 2} x2={cx - geom.shoulderHW + 2} y2={s.shldY + 4}
        stroke={boneColor(bones_integrity.ribs)} strokeWidth="0.9" />
      <line x1={cx + 1} y1={s.shldY + 2} x2={cx + geom.shoulderHW - 2} y2={s.shldY + 4}
        stroke={boneColor(bones_integrity.ribs)} strokeWidth="0.9" />

      {/* ── Scapulae (shoulder blades – subtle) ── */}
      <path d={`M ${cx - geom.shoulderHW + 4},${s.shldY + 4}
        Q ${cx - geom.shoulderHW + 1},${s.shldY + 18}
          ${cx - geom.shoulderHW + 5},${s.shldY + 28}`}
        fill="none" stroke={boneColor(bones_integrity.ribs)} strokeWidth="0.6" opacity="0.5" />
      <path d={`M ${cx + geom.shoulderHW - 4},${s.shldY + 4}
        Q ${cx + geom.shoulderHW - 1},${s.shldY + 18}
          ${cx + geom.shoulderHW - 5},${s.shldY + 28}`}
        fill="none" stroke={boneColor(bones_integrity.ribs)} strokeWidth="0.6" opacity="0.5" />

      {/* ── Pelvis ── */}
      <path d={`M ${cx},${s.hipTopY - 4}
        Q ${cx - geom.hipHW * 0.4},${s.hipTopY - 2}
          ${cx - geom.hipHW + 2},${s.hipTopY + 4}
        Q ${cx - geom.hipHW + 1},${s.crotchY - 6}
          ${cx - 4},${s.crotchY}
        L ${cx + 4},${s.crotchY}
        Q ${cx + geom.hipHW - 1},${s.crotchY - 6}
          ${cx + geom.hipHW - 2},${s.hipTopY + 4}
        Q ${cx + geom.hipHW * 0.4},${s.hipTopY - 2}
          ${cx},${s.hipTopY - 4} Z`}
        fill="none" stroke={boneColor(bones_integrity.legs)} strokeWidth="0.9" />

      {/* ── Arm bones ── */}
      {/* Left humerus */}
      <line x1={s.shLX} y1={s.shldY + 3} x2={s.elLX} y2={s.elY}
        stroke={boneColor(bones_integrity.arms)} strokeWidth="1.4" />
      {/* Left radius/ulna */}
      <line x1={s.elLX - 1} y1={s.elY} x2={s.wrLX - 1} y2={s.wrY}
        stroke={boneColor(bones_integrity.arms)} strokeWidth="0.9" />
      <line x1={s.elLX + 1} y1={s.elY} x2={s.wrLX + 1} y2={s.wrY}
        stroke={boneColor(bones_integrity.arms)} strokeWidth="0.9" />
      {/* Right humerus */}
      <line x1={s.shRX} y1={s.shldY + 3} x2={s.elRX} y2={s.elY}
        stroke={boneColor(bones_integrity.arms)} strokeWidth="1.4" />
      {/* Right radius/ulna */}
      <line x1={s.elRX - 1} y1={s.elY} x2={s.wrRX - 1} y2={s.wrY}
        stroke={boneColor(bones_integrity.arms)} strokeWidth="0.9" />
      <line x1={s.elRX + 1} y1={s.elY} x2={s.wrRX + 1} y2={s.wrY}
        stroke={boneColor(bones_integrity.arms)} strokeWidth="0.9" />
      {/* Elbow joints */}
      <circle cx={s.elLX} cy={s.elY} r="2.5" fill="none" stroke={boneColor(bones_integrity.arms)} strokeWidth="0.6" />
      <circle cx={s.elRX} cy={s.elY} r="2.5" fill="none" stroke={boneColor(bones_integrity.arms)} strokeWidth="0.6" />
      {/* Shoulder joints */}
      <circle cx={s.shLX} cy={s.shldY + 3} r="2.5" fill="none" stroke={boneColor(bones_integrity.arms)} strokeWidth="0.6" />
      <circle cx={s.shRX} cy={s.shldY + 3} r="2.5" fill="none" stroke={boneColor(bones_integrity.arms)} strokeWidth="0.6" />
      {/* Hand metacarpals (simplified) */}
      {[-2, 0, 2].map((dx, i) => (
        <React.Fragment key={`hand-l-${i}`}>
          <line x1={s.wrLX + dx} y1={s.wrY} x2={s.wrLX + dx - 0.5} y2={s.handCY + 2}
            stroke={boneColor(bones_integrity.arms)} strokeWidth="0.5" />
        </React.Fragment>
      ))}
      {[-2, 0, 2].map((dx, i) => (
        <React.Fragment key={`hand-r-${i}`}>
          <line x1={s.wrRX + dx} y1={s.wrY} x2={s.wrRX + dx + 0.5} y2={s.handCY + 2}
            stroke={boneColor(bones_integrity.arms)} strokeWidth="0.5" />
        </React.Fragment>
      ))}

      {/* ── Leg bones ── */}
      {/* Left femur */}
      <line x1={cx - 5} y1={s.crotchY - 2} x2={s.legLX} y2={s.kneeY}
        stroke={boneColor(bones_integrity.legs)} strokeWidth="1.6" />
      {/* Left tibia/fibula */}
      <line x1={s.legLX - 1} y1={s.kneeY} x2={s.legLX - 0.5} y2={s.ankleY}
        stroke={boneColor(bones_integrity.legs)} strokeWidth="1.0" />
      <line x1={s.legLX + 1} y1={s.kneeY} x2={s.legLX + 0.5} y2={s.ankleY}
        stroke={boneColor(bones_integrity.legs)} strokeWidth="1.0" />
      {/* Right femur */}
      <line x1={cx + 5} y1={s.crotchY - 2} x2={s.legRX} y2={s.kneeY}
        stroke={boneColor(bones_integrity.legs)} strokeWidth="1.6" />
      {/* Right tibia/fibula */}
      <line x1={s.legRX - 1} y1={s.kneeY} x2={s.legRX - 0.5} y2={s.ankleY}
        stroke={boneColor(bones_integrity.legs)} strokeWidth="1.0" />
      <line x1={s.legRX + 1} y1={s.kneeY} x2={s.legRX + 0.5} y2={s.ankleY}
        stroke={boneColor(bones_integrity.legs)} strokeWidth="1.0" />
      {/* Kneecaps */}
      <ellipse cx={s.legLX} cy={s.kneeY} rx="3" ry="2.5"
        fill="none" stroke={boneColor(bones_integrity.legs)} strokeWidth="0.6" />
      <ellipse cx={s.legRX} cy={s.kneeY} rx="3" ry="2.5"
        fill="none" stroke={boneColor(bones_integrity.legs)} strokeWidth="0.6" />
      {/* Ankle joints */}
      <circle cx={s.legLX} cy={s.ankleY} r="2" fill="none" stroke={boneColor(bones_integrity.legs)} strokeWidth="0.5" />
      <circle cx={s.legRX} cy={s.ankleY} r="2" fill="none" stroke={boneColor(bones_integrity.legs)} strokeWidth="0.5" />
      {/* Foot metatarsals */}
      {[-2, 0, 2].map((dx, i) => (
        <React.Fragment key={`foot-l-${i}`}>
          <line x1={s.legLX + dx} y1={s.ankleY + 1} x2={s.legLX + dx + geom.footW * 0.08} y2={s.footBotY - 3}
            stroke={boneColor(bones_integrity.legs)} strokeWidth="0.5" />
        </React.Fragment>
      ))}
      {[-2, 0, 2].map((dx, i) => (
        <React.Fragment key={`foot-r-${i}`}>
          <line x1={s.legRX + dx} y1={s.ankleY + 1} x2={s.legRX + dx + geom.footW * 0.08} y2={s.footBotY - 3}
            stroke={boneColor(bones_integrity.legs)} strokeWidth="0.5" />
        </React.Fragment>
      ))}

      {/* ══════════════════════════════════════════════════════════════
          ORGANS (fully animated — DoL X-ray parity)
         ══════════════════════════════════════════════════════════════ */}

      {/* ── Brain — neural activity shimmer + synaptic sparks ── */}
      {(() => {
        const organValues = Object.values(organs);
        const brainHealth = Math.round(organValues.reduce((sum, v) => sum + v, 0) / organValues.length);
        return (
          <>
            <ellipse cx={cx} cy={s.headCY - 2} rx={geom.headRX * 0.5} ry={geom.headRY * 0.45}
              fill={healthColor(brainHealth)} className="xray-brain" />
            {/* Brain folds */}
            <path d={`M ${cx - 3},${s.headCY - 6} Q ${cx},${s.headCY - 8} ${cx + 3},${s.headCY - 6}`}
              fill="none" stroke={healthColor(brainHealth)} strokeWidth="0.4" opacity="0.5" className="xray-brain" />
            <path d={`M ${cx - 4},${s.headCY - 4} Q ${cx},${s.headCY - 6.5} ${cx + 4},${s.headCY - 4}`}
              fill="none" stroke={healthColor(brainHealth)} strokeWidth="0.4" opacity="0.5" className="xray-brain" />
            {/* Synaptic spark flashes */}
            <circle cx={cx - 3} cy={s.headCY - 4} r="0.8"
              fill="rgba(160,220,255,0.8)" className="xray-brain-spark" />
            <circle cx={cx + 2} cy={s.headCY - 6} r="0.6"
              fill="rgba(160,220,255,0.7)" className="xray-brain-spark-b" />
          </>
        );
      })()}

      {/* ── Heart — systole/diastole beating ── */}
      <g className={heartDamaged ? 'xray-heart-damaged' : 'xray-heart'}>
        <path d={`M ${cx - 3},${s.shldY + 20}
          C ${cx - 8},${s.shldY + 14} ${cx - 8},${s.shldY + 10} ${cx - 3},${s.shldY + 14}
          C ${cx + 2},${s.shldY + 10} ${cx + 2},${s.shldY + 14} ${cx - 3},${s.shldY + 20} Z`}
          fill={healthColor(organs.heart)} opacity="0.7" />
        {/* Aortic root */}
        <line x1={cx - 2} y1={s.shldY + 12} x2={cx - 1} y2={s.shldY + 8}
          stroke={healthColor(organs.heart)} strokeWidth="0.6" opacity="0.5" />
      </g>

      {/* ── Lungs — breathing expansion/contraction ── */}
      {/* Left lung */}
      <g className={lungsDamaged ? 'xray-lung-l-damaged' : 'xray-lung-l'}>
        <path d={`M ${cx - 4},${s.shldY + 10}
          Q ${cx - geom.shoulderHW * 0.65},${s.shldY + 12}
            ${cx - geom.shoulderHW * 0.6},${s.shldY + 28}
          Q ${cx - geom.shoulderHW * 0.55},${s.shldY + 42}
            ${cx - 4},${s.shldY + 42} Z`}
          fill={healthColor(organs.lungs)} opacity="0.35" />
      </g>
      {/* Right lung */}
      <g className={lungsDamaged ? 'xray-lung-r-damaged' : 'xray-lung-r'}>
        <path d={`M ${cx + 4},${s.shldY + 10}
          Q ${cx + geom.shoulderHW * 0.65},${s.shldY + 12}
            ${cx + geom.shoulderHW * 0.6},${s.shldY + 28}
          Q ${cx + geom.shoulderHW * 0.55},${s.shldY + 42}
            ${cx + 4},${s.shldY + 42} Z`}
          fill={healthColor(organs.lungs)} opacity="0.35" />
      </g>
      {/* Bronchial tree */}
      <path d={`M ${cx},${s.shldY + 10} L ${cx - 5},${s.shldY + 18}`}
        stroke={healthColor(organs.lungs)} strokeWidth="0.5" opacity="0.5" />
      <path d={`M ${cx},${s.shldY + 10} L ${cx + 5},${s.shldY + 18}`}
        stroke={healthColor(organs.lungs)} strokeWidth="0.5" opacity="0.5" />
      <path d={`M ${cx - 5},${s.shldY + 18} L ${cx - 8},${s.shldY + 25}`}
        stroke={healthColor(organs.lungs)} strokeWidth="0.4" opacity="0.4" />
      <path d={`M ${cx + 5},${s.shldY + 18} L ${cx + 8},${s.shldY + 25}`}
        stroke={healthColor(organs.lungs)} strokeWidth="0.4" opacity="0.4" />

      {/* ── Stomach — digestion churning + acid bubbles ── */}
      <g className={stomachDamaged ? 'xray-stomach-damaged' : 'xray-stomach'}>
        <path d={`M ${cx - 4},${s.shldY + 44}
          Q ${cx - 10},${s.shldY + 50} ${cx - 6},${s.shldY + 56}
          Q ${cx - 2},${s.shldY + 58} ${cx + 2},${s.shldY + 54}
          L ${cx + 2},${s.shldY + 48}
          Q ${cx},${s.shldY + 44} ${cx - 4},${s.shldY + 44} Z`}
          fill={healthColor(organs.stomach)} opacity="0.4" />
        {/* Acid bubbles inside stomach */}
        <circle cx={cx - 3} cy={s.shldY + 52} r="0.8"
          fill="rgba(180,255,60,0.35)" className="xray-stomach-bubble" />
        <circle cx={cx - 1} cy={s.shldY + 50} r="0.6"
          fill="rgba(180,255,60,0.3)" className="xray-stomach-bubble-b" />
        <circle cx={cx + 1} cy={s.shldY + 53} r="0.5"
          fill="rgba(180,255,60,0.25)" className="xray-stomach-bubble-c" />
      </g>

      {/* ── Liver — filtration pulse ── */}
      <g className={liverDamaged ? 'xray-liver-damaged' : 'xray-liver'}>
        <path d={`M ${cx + 3},${s.shldY + 44}
          Q ${cx + geom.shoulderHW * 0.45},${s.shldY + 42}
            ${cx + geom.shoulderHW * 0.5},${s.shldY + 50}
          Q ${cx + geom.shoulderHW * 0.4},${s.shldY + 56}
            ${cx + 3},${s.shldY + 54} Z`}
          fill={healthColor(organs.liver)} />
      </g>

      {/* ── Kidneys — filtration pulsation (staggered L/R) ── */}
      <ellipse cx={cx - 7} cy={s.waistY - 4} rx="3.5" ry="5"
        fill={healthColor(organs.kidneys)} className="xray-kidney-l" />
      <ellipse cx={cx + 7} cy={s.waistY - 4} rx="3.5" ry="5"
        fill={healthColor(organs.kidneys)} className="xray-kidney-r" />

      {/* ── Intestines — peristaltic wave motion ── */}
      <path d={`M ${cx - 6},${s.waistY + 4}
        Q ${cx - 8},${s.waistY + 8} ${cx - 4},${s.waistY + 10}
        Q ${cx + 2},${s.waistY + 12} ${cx + 6},${s.waistY + 8}
        Q ${cx + 8},${s.waistY + 4} ${cx + 4},${s.waistY + 2}
        Q ${cx},${s.waistY} ${cx - 4},${s.waistY + 2}`}
        fill="none" stroke={healthColor(organs.stomach)} strokeWidth="1.2" opacity="0.3"
        strokeDasharray="2 1.5" className="xray-intestine" />
      <path d={`M ${cx - 5},${s.hipTopY}
        Q ${cx},${s.hipTopY + 4} ${cx + 5},${s.hipTopY}
        Q ${cx + 8},${s.hipTopY + 6} ${cx + 3},${s.hipTopY + 8}
        Q ${cx - 2},${s.hipTopY + 10} ${cx - 5},${s.hipTopY + 6}`}
        fill="none" stroke={healthColor(organs.stomach)} strokeWidth="0.8" opacity="0.25"
        strokeDasharray="1.5 1" className="xray-intestine-b" />

      {/* ── Bladder — fill-level pulsing ── */}
      <ellipse cx={cx} cy={s.crotchY - 8} rx="4" ry="3.5"
        fill="rgba(100,180,255,0.3)" stroke="rgba(100,180,255,0.4)" strokeWidth="0.5"
        className="xray-bladder" />

      {/* ── Reproductive organs (female: uterus with contractions) ── */}
      {isFemale && (
        <g>
          {/* Uterus — subtle contraction cycle */}
          <g className="xray-uterus">
            <path d={`M ${cx - 5},${s.crotchY - 12}
              Q ${cx - 6},${s.crotchY - 6} ${cx},${s.crotchY - 3}
              Q ${cx + 6},${s.crotchY - 6} ${cx + 5},${s.crotchY - 12} Z`}
              fill="rgba(255,130,160,0.35)" stroke="rgba(255,130,160,0.45)" strokeWidth="0.5" />
          </g>
          {/* Fallopian tubes */}
          <path d={`M ${cx - 5},${s.crotchY - 12}
            Q ${cx - 10},${s.crotchY - 16} ${cx - 12},${s.crotchY - 14}`}
            fill="none" stroke="rgba(255,130,160,0.4)" strokeWidth="0.6" />
          <path d={`M ${cx + 5},${s.crotchY - 12}
            Q ${cx + 10},${s.crotchY - 16} ${cx + 12},${s.crotchY - 14}`}
            fill="none" stroke="rgba(255,130,160,0.4)" strokeWidth="0.6" />
          {/* Ovaries — follicle pulse (staggered L/R) */}
          <ellipse cx={cx - 12} cy={s.crotchY - 14} rx="2" ry="1.5"
            fill="rgba(255,130,160,0.4)" className="xray-ovary-l" />
          <ellipse cx={cx + 12} cy={s.crotchY - 14} rx="2" ry="1.5"
            fill="rgba(255,130,160,0.4)" className="xray-ovary-r" />
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CIRCULATORY SYSTEM — animated blood flow pulses
         ══════════════════════════════════════════════════════════════ */}
      <g>
        {/* Aortic arch — pulsing with heartbeat */}
        <path d={`M ${cx - 3},${s.shldY + 16}
          Q ${cx - 2},${s.shldY + 10} ${cx + 2},${s.shldY + 8}
          Q ${cx + 6},${s.shldY + 10} ${cx + 4},${s.shldY + 16}`}
          fill="none" stroke="rgba(255,40,40,0.6)" strokeWidth="1" className="xray-artery" />
        {/* Descending aorta */}
        <line x1={cx} y1={s.shldY + 16} x2={cx} y2={s.hipTopY}
          stroke="rgba(255,40,40,0.5)" strokeWidth="0.8" className="xray-artery-delay" />
        {/* Iliac arteries — delayed pulse wave */}
        <line x1={cx} y1={s.hipTopY} x2={cx - 6} y2={s.crotchY - 2}
          stroke="rgba(255,40,40,0.4)" strokeWidth="0.6" className="xray-artery-delay-b" />
        <line x1={cx} y1={s.hipTopY} x2={cx + 6} y2={s.crotchY - 2}
          stroke="rgba(255,40,40,0.4)" strokeWidth="0.6" className="xray-artery-delay-b" />
        {/* Carotid arteries */}
        <line x1={cx - 2} y1={s.shldY + 8} x2={cx - 2} y2={s.neckTopY}
          stroke="rgba(255,40,40,0.4)" strokeWidth="0.5" className="xray-artery" />
        <line x1={cx + 2} y1={s.shldY + 8} x2={cx + 2} y2={s.neckTopY}
          stroke="rgba(255,40,40,0.4)" strokeWidth="0.5" className="xray-artery" />
        {/* Arm arteries */}
        <line x1={s.shLX + 1} y1={s.shldY + 5} x2={s.elLX + 1} y2={s.elY}
          stroke="rgba(255,40,40,0.3)" strokeWidth="0.4" className="xray-artery-delay" />
        <line x1={s.shRX - 1} y1={s.shldY + 5} x2={s.elRX - 1} y2={s.elY}
          stroke="rgba(255,40,40,0.3)" strokeWidth="0.4" className="xray-artery-delay" />
        {/* Veins (blue — slower return pulse) */}
        <line x1={cx - 1} y1={s.shldY + 16} x2={cx - 1} y2={s.hipTopY}
          stroke="rgba(60,60,255,0.4)" strokeWidth="0.6" className="xray-vein" />
        <line x1={s.elLX - 1} y1={s.elY} x2={s.shLX - 1} y2={s.shldY + 5}
          stroke="rgba(60,60,255,0.3)" strokeWidth="0.3" className="xray-vein" />
        <line x1={s.elRX + 1} y1={s.elY} x2={s.shRX + 1} y2={s.shldY + 5}
          stroke="rgba(60,60,255,0.3)" strokeWidth="0.3" className="xray-vein" />
      </g>

      {/* ══════════════════════════════════════════════════════════════
          X-RAY SCAN EFFECTS (aesthetic animated scan lines)
         ══════════════════════════════════════════════════════════════ */}
      <g opacity="0.15">
        {/* Primary scan line */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="cyan" strokeWidth="0.3">
          <animate attributeName="y1" values="0;225;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0;225;0" dur="4s" repeatCount="indefinite" />
        </line>
        {/* Secondary glow trail */}
        <rect x="0" y="0" width="100" height="8" fill="url(#xray-scan-grad)" className="xray-scan-glow">
          <animate attributeName="y" values="0;225;0" dur="4s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Scan gradient definition */}
      <defs>
        <linearGradient id="xray-scan-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="cyan" stopOpacity="0.3" />
          <stop offset="100%" stopColor="cyan" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── ORGAN LABELS (tiny, at edges) ── */}
      <g opacity="0.7">
        <text x="4" y={s.shldY + 20} fill="cyan" fontSize="3.5" fontFamily="monospace">❤ {organs.heart}%</text>
        <text x="4" y={s.shldY + 30} fill="cyan" fontSize="3.5" fontFamily="monospace">🫁 {organs.lungs}%</text>
        <text x="4" y={s.shldY + 52} fill="cyan" fontSize="3.5" fontFamily="monospace">🟢 {organs.stomach}%</text>
        <text x={100 - 28} y={s.shldY + 50} fill="cyan" fontSize="3.5" fontFamily="monospace">🟤 {organs.liver}%</text>
        <text x={100 - 28} y={s.waistY} fill="cyan" fontSize="3.5" fontFamily="monospace">🫘 {organs.kidneys}%</text>
      </g>
    </g>
  );
};
