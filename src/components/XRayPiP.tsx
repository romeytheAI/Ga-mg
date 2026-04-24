/**
 * XRayPiP – Tiered Picture-in-Picture x-ray window.
 *
 * Rendered as an absolute overlay inside AnimationWindow whenever xrayMode
 * is active.  Two stacked tiers:
 *
 *   Tier 1 – Zone Viewer  : A cropped SVG viewport that zooms the x-ray
 *             anatomy to the most relevant body region, with an animated
 *             scan-line and corner brackets.
 *
 *   Tier 2 – Status Panel : Neon readout bars (HP / Arousal / Stress) plus
 *             a zone-specific context metric (BPM, arousal %, etc.).
 *
 * The focus zone is derived automatically from the current stats:
 *   stress  > 70 %  → HEAD   (neural / cranial)
 *   arousal > 40 %  → PELVIS (reproductive)
 *   health  < 40 %  → TORSO  (cardiopulmonary / trauma)
 *   fatigue < 30 %  → TORSO  (cardiac strain)
 *   default         → FULL   (skeletal overview)
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats } from '../store/gameStore';
import { XRayContent, deriveFocusZone, ZONE_CONFIGS, XRayFocusZone } from './model/XRayContent';

// Heart-rate simulation: ranges from BASE_BPM (healthy) to BASE_BPM + BPM_RANGE (critical)
const BASE_BPM = 60;
const BPM_RANGE = 80;

// ─── Status bar ─────────────────────────────────────────────────────────────

const StatusBar: React.FC<{
  label: string;
  value: number;          // 0-1
  color: string;
  dangerBelow?: number;   // optional threshold → flicker red
}> = ({ label, value, color, dangerBelow }) => {
  const isDanger = dangerBelow !== undefined && value < dangerBelow;
  const barColor = isDanger ? '#FF3300' : color;
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <div className="flex items-center gap-1">
      <span className="w-3 text-right opacity-60 text-[6px]">{label}</span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.10)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="opacity-60 text-[6px] tabular-nums" style={{ minWidth: 18 }}>{pct}%</span>
    </div>
  );
};

// ─── Zone highlight overlay (thin rect shown on full-body tier) ──────────────

const zoneHighlightRects: Record<XRayFocusZone, React.ReactElement | null> = {
  head: <rect x="60" y="-18" width="80" height="128" rx="4" fill="none" stroke="#AA44FF" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />,
  torso: <rect x="52" y="105" width="96" height="210" rx="4" fill="none" stroke="#FF4488" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />,
  pelvis: <rect x="52" y="244" width="96" height="140" rx="4" fill="none" stroke="#FF2A85" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55" />,
  full: null,
};

// ─── Main PiP component ─────────────────────────────────────────────────────

interface XRayPiPProps {
  stats: PlayerStats;
  isFemale: boolean;
  hasEncounter: boolean;
}

export const XRayPiP: React.FC<XRayPiPProps> = ({ stats, isFemale, hasEncounter }) => {
  const focusZone = deriveFocusZone(stats, hasEncounter);
  const zone = ZONE_CONFIGS[focusZone];

  const hp = stats.health / stats.maxHealth;
  const ap = stats.arousal / stats.maxArousal;
  const sp = stats.stress / stats.maxStress;
  const fp = stats.fatigue / stats.maxFatigue;

  // Context metric text for Tier 2
  const contextMetric = React.useMemo(() => {
    switch (focusZone) {
      case 'torso': return `♥ ${Math.round(BASE_BPM + (1 - hp) * BPM_RANGE)} BPM`;
      case 'pelvis': return `⚡ ${Math.round(ap * 100)}% arousal`;
      case 'head': return `◈ ${Math.round(sp * 100)}% stress`;
      default: return `▸ ${Math.round(hp * 100)}% integrity`;
    }
  }, [focusZone, hp, ap, sp]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={focusZone}
        initial={{ opacity: 0, x: 14, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 14, scale: 0.92 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="absolute bottom-12 right-1 z-50 flex flex-col gap-1 pointer-events-none select-none"
        style={{ width: 114 }}
      >
        {/* ══════════════════════════════════
            TIER 1A – Thumbnail full-body with
            the active zone highlighted
            ══════════════════════════════════ */}
        {focusZone !== 'full' && (
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              border: `1px solid ${zone.color}55`,
              boxShadow: `0 0 5px ${zone.color}33`,
            }}
          >
            {/* Label */}
            <div
              className="flex items-center justify-between px-1.5 py-px font-mono text-[6px] font-bold tracking-widest"
              style={{ background: `${zone.color}18`, color: zone.color }}
            >
              <span>BODY</span>
              <span className="opacity-60">overview</span>
            </div>
            <div className="bg-black" style={{ height: 60 }}>
              <svg
                viewBox="0 -20 200 540"
                className="w-full h-full"
                style={{ filter: `drop-shadow(0 0 2px ${zone.color}66)` }}
              >
                <defs>
                  <filter id="ngov" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
                    <feMerge><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Faint skeleton at reduced opacity */}
                <g filter="url(#ngov)" opacity="0.55">
                  <XRayContent stats={stats} isFemale={isFemale} boneColor={zone.color} />
                </g>
                {/* Highlight rect for active zone */}
                {zoneHighlightRects[focusZone]}
              </svg>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            TIER 1B – Zoomed zone SVG viewport
            (main PiP viewer)
            ══════════════════════════════════ */}
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            border: `1px solid ${zone.color}`,
            boxShadow: `0 0 10px ${zone.color}44, inset 0 0 8px ${zone.color}18`,
          }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-widest"
            style={{ background: `${zone.color}22`, color: zone.color }}
          >
            <span>{zone.label}</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >◉</motion.span>
          </div>

          {/* SVG viewport */}
          <div className="relative bg-black overflow-hidden" style={{ height: 100 }}>

            {/* Scan-line sweep */}
            <motion.div
              className="absolute left-0 right-0 pointer-events-none z-20"
              style={{
                height: 2,
                background: `linear-gradient(to right, transparent 0%, ${zone.color}00 5%, ${zone.color}CC 50%, ${zone.color}00 95%, transparent 100%)`,
              }}
              animate={{ top: ['-2px', '102px', '-2px'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />

            {/* Static flicker overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10 opacity-0"
              style={{ background: `radial-gradient(ellipse at 50% 50%, ${zone.color}22 0%, transparent 70%)` }}
              animate={{ opacity: [0, 0.06, 0, 0.03, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.5, 0.7, 1] }}
            />

            {/* X-ray anatomy */}
            <svg
              viewBox={zone.viewBox}
              className="w-full h-full"
              style={{ filter: `drop-shadow(0 0 4px ${zone.color})` }}
            >
              <defs>
                <filter id="neon-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b2" />
                  <feMerge>
                    <feMergeNode in="b2" />
                    <feMergeNode in="b1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <XRayContent stats={stats} isFemale={isFemale} boneColor={zone.color} />
            </svg>

            {/* Corner brackets */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
              <div
                key={pos}
                className="absolute text-[9px] font-bold opacity-70"
                style={{
                  color: zone.color,
                  top: pos.startsWith('t') ? 2 : undefined,
                  bottom: pos.startsWith('b') ? 2 : undefined,
                  left: pos.endsWith('l') ? 2 : undefined,
                  right: pos.endsWith('r') ? 2 : undefined,
                }}
              >
                {pos === 'tl' ? '┌' : pos === 'tr' ? '┐' : pos === 'bl' ? '└' : '┘'}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            TIER 2 – Status / data readout
            ══════════════════════════════════ */}
        <div
          className="rounded-sm px-1.5 py-1 font-mono space-y-0.5 bg-black/80"
          style={{ border: `1px solid ${zone.color}44`, color: zone.color }}
        >
          <div className="text-[6px] font-bold tracking-widest opacity-75 text-center mb-0.5">
            {zone.subLabel}
          </div>
          <StatusBar label="HP" value={hp} color="#FF4488" dangerBelow={0.3} />
          <StatusBar label="AR" value={ap} color="#FF2A85" />
          <StatusBar label="ST" value={sp} color="#AA44FF" />
          <StatusBar label="FT" value={fp} color="#38BDF8" dangerBelow={0.2} />
          <motion.div
            className="text-[6px] opacity-60 text-center mt-0.5"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            {contextMetric}
          </motion.div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};
