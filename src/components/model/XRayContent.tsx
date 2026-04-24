/**
 * XRayContent – pure SVG group rendering the full-body x-ray anatomy.
 *
 * Renders in the coordinate space of the main model SVG (viewBox "0 0 200 500").
 * Intended to be embedded either:
 *   (a) directly inside SvgBodyLayers as a screen-blend overlay, or
 *   (b) inside a PiP SVG element whose viewBox is cropped to a specific zone.
 *
 * All colours are neon-cyan for bone, neon-pink/red for organs.
 * Glow effect relies on the #neon-glow filter being defined in the outer <defs>.
 */

import React from 'react';
import { PlayerStats } from '../../store/gameStore';

// ─── Zone configuration ────────────────────────────────────────────────────

export type XRayFocusZone = 'head' | 'torso' | 'pelvis' | 'full';

export interface ZoneConfig {
  label: string;
  subLabel: string;
  viewBox: string;
  color: string;
}

export const ZONE_CONFIGS: Record<XRayFocusZone, ZoneConfig> = {
  head: {
    label: 'CRANIAL SCAN',
    subLabel: 'Neural Activity',
    viewBox: '56 -18 88 128',
    color: '#AA44FF',
  },
  torso: {
    label: 'THORACIC SCAN',
    subLabel: 'Cardiopulmonary',
    viewBox: '52 105 96 210',
    color: '#FF4488',
  },
  pelvis: {
    label: 'PELVIC SCAN',
    subLabel: 'Reproductive System',
    viewBox: '52 244 96 140',
    color: '#FF2A85',
  },
  full: {
    label: 'FULL-BODY SCAN',
    subLabel: 'Skeletal Overview',
    viewBox: '0 -20 200 540',
    color: '#7FFFEA',
  },
};

// Thresholds used to select the automatic focus zone
const STRESS_ZONE_THRESHOLD = 0.7;   // stress fraction above which HEAD zone activates
const AROUSAL_ZONE_THRESHOLD = 0.4;  // arousal fraction above which PELVIS zone activates
const HEALTH_ZONE_THRESHOLD = 0.4;   // health fraction below which TORSO zone activates
const FATIGUE_ZONE_THRESHOLD = 0.3;  // fatigue fraction below which TORSO zone activates

/** Derive the PiP focus zone from the current game state. */
export function deriveFocusZone(stats: PlayerStats, hasEncounter: boolean): XRayFocusZone {
  if (stats.stress > stats.maxStress * STRESS_ZONE_THRESHOLD) return 'head';
  if (stats.arousal > stats.maxArousal * AROUSAL_ZONE_THRESHOLD) return 'pelvis';
  if (stats.health < stats.maxHealth * HEALTH_ZONE_THRESHOLD || hasEncounter) return 'torso';
  if (stats.fatigue < stats.maxFatigue * FATIGUE_ZONE_THRESHOLD) return 'torso';
  return 'full';
}

// ─── XRayContent ──────────────────────────────────────────────────────────

interface XRayContentProps {
  stats: PlayerStats;
  isFemale: boolean;
  /** Bone colour override – defaults to '#7FFFEA' */
  boneColor?: string;
  /** Opacity multiplier for the entire layer (0–1) */
  opacity?: number;
}

export const XRayContent: React.FC<XRayContentProps> = ({
  stats,
  isFemale,
  boneColor = '#7FFFEA',
  opacity = 1,
}) => {
  const bc = boneColor; // bone colour shorthand
  const hp = stats.health / stats.maxHealth;

  return (
    <g opacity={opacity}>

      {/* ── BRAIN (purple, faint, visible through cranium) ── */}
      <ellipse cx="100" cy="22" rx="28" ry="33" fill="#AA44FF" opacity="0.18" filter="url(#neon-glow)" />
      <path d="M 76 18 Q 84 10 92 14 Q 100 8 108 14 Q 116 10 124 18"
        stroke="#BB55FF" strokeWidth="0.6" fill="none" opacity="0.25" filter="url(#neon-glow)" />
      <path d="M 78 26 Q 88 20 100 24 Q 112 20 122 26"
        stroke="#BB55FF" strokeWidth="0.5" fill="none" opacity="0.2" filter="url(#neon-glow)" />

      {/* ── SKULL ── */}
      {/* Cranium outline */}
      <path d="M 64 50 C 64 -10, 136 -10, 136 50 Z" fill="none" stroke={bc} strokeWidth="1.8" filter="url(#neon-glow)" />
      {/* Cranial sutures */}
      <path d="M 100 -10 L 100 5" stroke={bc} strokeWidth="0.6" fill="none" opacity="0.5" filter="url(#neon-glow)" />
      <path d="M 70 12 Q 100 22 130 12" stroke={bc} strokeWidth="0.6" fill="none" opacity="0.5" filter="url(#neon-glow)" />
      <path d="M 64 50 Q 68 35 72 25" stroke={bc} strokeWidth="0.6" fill="none" opacity="0.4" filter="url(#neon-glow)" />
      <path d="M 136 50 Q 132 35 128 25" stroke={bc} strokeWidth="0.6" fill="none" opacity="0.4" filter="url(#neon-glow)" />
      {/* Temporal bone boundary */}
      <path d="M 64 50 Q 62 60 64 72" stroke={bc} strokeWidth="1" fill="none" opacity="0.5" filter="url(#neon-glow)" />
      <path d="M 136 50 Q 138 60 136 72" stroke={bc} strokeWidth="1" fill="none" opacity="0.5" filter="url(#neon-glow)" />
      {/* Zygomatic arch (cheekbones) */}
      <path d="M 64 60 Q 68 66 72 64" stroke={bc} strokeWidth="1" fill="none" opacity="0.55" filter="url(#neon-glow)" />
      <path d="M 136 60 Q 132 66 128 64" stroke={bc} strokeWidth="1" fill="none" opacity="0.55" filter="url(#neon-glow)" />
      {/* Orbital sockets */}
      <ellipse cx="74" cy="52" rx="8" ry="6" fill="none" stroke={bc} strokeWidth="1.2" filter="url(#neon-glow)" />
      <ellipse cx="126" cy="52" rx="8" ry="6" fill="none" stroke={bc} strokeWidth="1.2" filter="url(#neon-glow)" />
      {/* Nasal bone + cavity */}
      <path d="M 96 60 L 96 74 M 104 60 L 104 74 M 94 74 Q 100 78 106 74"
        fill="none" stroke={bc} strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.7" />
      {/* Mandible */}
      <path d="M 66 74 Q 64 88 80 98 Q 100 105 120 98 Q 136 88 134 74"
        fill="none" stroke={bc} strokeWidth="1.5" filter="url(#neon-glow)" />
      {/* Chin symphysis */}
      <path d="M 97 103 Q 100 106 103 103" fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.6" />
      {/* Teeth */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={`tooth-${i}`}>
          <rect x={84 + i * 5.5} y={87} width={4} height={5} rx="0.8" fill={bc} opacity="0.55" />
          <rect x={85 + i * 5.3} y={96} width={3.5} height={4.5} rx="0.7" fill={bc} opacity="0.42" />
        </g>
      ))}

      {/* ── CERVICAL SPINE (C1–C7) ── */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={`cv-${i}`}>
          <ellipse cx="100" cy={82 + i * 6} rx={3.5 - i * 0.1} ry="2.2"
            fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.85" />
        </g>
      ))}

      {/* ── CLAVICLES ── */}
      {isFemale ? (
        <>
          <path d="M 97 128 Q 84 122 72 119" stroke={bc} strokeWidth="2.2" strokeLinecap="round" fill="none" filter="url(#neon-glow)" />
          <path d="M 103 128 Q 116 122 128 119" stroke={bc} strokeWidth="2.2" strokeLinecap="round" fill="none" filter="url(#neon-glow)" />
        </>
      ) : (
        <>
          <path d="M 96 125 Q 80 120 66 119" stroke={bc} strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#neon-glow)" />
          <path d="M 104 125 Q 120 120 134 119" stroke={bc} strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#neon-glow)" />
        </>
      )}

      {/* ── STERNUM ── */}
      {(() => {
        const sy = isFemale ? 128 : 125;
        const sh = isFemale ? 72 : 78;
        return (
          <>
            <rect x="97" y={sy} width="6" height={sh} rx="2.5" fill="none" stroke={bc} strokeWidth="1.6" filter="url(#neon-glow)" />
            <path d={`M 97 ${sy + 2} Q 100 ${sy + 6} 103 ${sy + 2}`} fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.6" />
            <path d={`M 97 ${sy + sh} Q 100 ${sy + sh + 8} 103 ${sy + sh}`} fill="none" stroke={bc} strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.7" />
          </>
        );
      })()}

      {/* ── RIBS (7 pairs) ── */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = (isFemale ? 133 : 130) + i * 11;
        const lx = isFemale ? 70 - i * 0.5 : 68 - i * 0.5;
        const rx = isFemale ? 130 + i * 0.5 : 132 + i * 0.5;
        const sw = Math.max(0.9, 1.6 - i * 0.1);
        return (
          <g key={`rib-${i}`} opacity={Math.max(0.55, 0.82 - i * 0.03)}>
            <path d={`M 97 ${y} Q ${84 - i} ${y - 4} ${lx} ${y + 5} Q ${lx - 5} ${y + 13} ${lx - 2} ${y + 20}`}
              fill="none" stroke={bc} strokeWidth={sw} strokeLinecap="round" filter="url(#neon-glow)" />
            <path d={`M 103 ${y} Q ${116 + i} ${y - 4} ${rx} ${y + 5} Q ${rx + 5} ${y + 13} ${rx + 2} ${y + 20}`}
              fill="none" stroke={bc} strokeWidth={sw} strokeLinecap="round" filter="url(#neon-glow)" />
          </g>
        );
      })}

      {/* ── THORACIC + LUMBAR SPINE (T1–L5) ── */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const vy = (isFemale ? 128 : 125) + i * 12;
        const vw = i < 7 ? 8 : 9;
        return (
          <g key={`tv-${i}`} opacity="0.82">
            <rect x={100 - vw / 2} y={vy} width={vw} height={9} rx="1"
              fill="none" stroke={bc} strokeWidth="0.85" filter="url(#neon-glow)" />
            <line x1={100 - vw / 2} y1={vy + 9} x2={100 + vw / 2} y2={vy + 9}
              stroke={bc} strokeWidth="0.5" opacity="0.4" />
          </g>
        );
      })}

      {/* ── SCAPULAE ── */}
      <path d="M 68 118 Q 56 130 60 155 Q 64 165 72 160 Q 78 150 74 130 Q 72 120 68 118 Z"
        fill="none" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.6" />
      <path d="M 132 118 Q 144 130 140 155 Q 136 165 128 160 Q 122 150 126 130 Q 128 120 132 118 Z"
        fill="none" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.6" />

      {/* ── PELVIS ── */}
      <path d="M 97 260 Q 78 256 68 268 Q 62 282 68 294 Q 75 302 86 300 Q 93 298 97 292"
        fill="none" stroke={bc} strokeWidth="1.5" strokeLinecap="round" filter="url(#neon-glow)" />
      <path d="M 103 260 Q 122 256 132 268 Q 138 282 132 294 Q 125 302 114 300 Q 107 298 103 292"
        fill="none" stroke={bc} strokeWidth="1.5" strokeLinecap="round" filter="url(#neon-glow)" />
      {/* Sacrum */}
      <path d="M 93 260 Q 100 260 107 260 L 105 282 Q 100 286 95 282 Z"
        fill="none" stroke={bc} strokeWidth="1.2" filter="url(#neon-glow)" opacity="0.75" />
      <line x1="94" y1="265" x2="106" y2="265" stroke={bc} strokeWidth="0.5" opacity="0.4" />
      <line x1="95" y1="271" x2="105" y2="271" stroke={bc} strokeWidth="0.5" opacity="0.4" />
      <line x1="96" y1="277" x2="104" y2="277" stroke={bc} strokeWidth="0.5" opacity="0.4" />
      {/* Pubic symphysis */}
      <ellipse cx="100" cy="298" rx="9" ry="5" fill="none" stroke={bc} strokeWidth="1.1" filter="url(#neon-glow)" opacity="0.7" />
      {/* Acetabula */}
      <circle cx="72" cy="294" r="5" fill="none" stroke={bc} strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.6" />
      <circle cx="128" cy="294" r="5" fill="none" stroke={bc} strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.6" />

      {/* ── HUMERUS ── */}
      <path d={isFemale ? "M 66 116 Q 52 145 44 178 Q 40 196 40 210" : "M 64 114 Q 50 143 42 176 Q 38 196 38 210"}
        stroke={bc} strokeWidth="2.8" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <ellipse cx={isFemale ? 55 : 53} cy={isFemale ? 145 : 143} rx="3.5" ry="5"
        fill="none" stroke={bc} strokeWidth="0.6" filter="url(#neon-glow)" opacity="0.5" />
      <path d={isFemale ? "M 134 116 Q 148 145 156 178 Q 160 196 160 210" : "M 136 114 Q 150 143 158 176 Q 162 196 162 210"}
        stroke={bc} strokeWidth="2.8" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <ellipse cx={isFemale ? 145 : 147} cy={isFemale ? 145 : 143} rx="3.5" ry="5"
        fill="none" stroke={bc} strokeWidth="0.6" filter="url(#neon-glow)" opacity="0.5" />

      {/* ── FOREARM (Radius + Ulna) ── */}
      {/* Left */}
      <path d={isFemale ? "M 38 210 Q 37 222 39 232" : "M 36 210 Q 35 222 37 232"}
        stroke={bc} strokeWidth="1.6" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <path d={isFemale ? "M 44 210 Q 43 222 44 232" : "M 42 210 Q 41 222 43 232"}
        stroke={bc} strokeWidth="1.6" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <ellipse cx={isFemale ? 40 : 38} cy="208" rx="4" ry="3"
        fill="none" stroke={bc} strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.7" />
      {/* Right */}
      <path d={isFemale ? "M 162 210 Q 163 222 161 232" : "M 164 210 Q 165 222 163 232"}
        stroke={bc} strokeWidth="1.6" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <path d={isFemale ? "M 156 210 Q 157 222 157 232" : "M 158 210 Q 159 222 158 232"}
        stroke={bc} strokeWidth="1.6" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <ellipse cx={isFemale ? 160 : 162} cy="208" rx="4" ry="3"
        fill="none" stroke={bc} strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.7" />

      {/* ── HAND BONES ── */}
      <g transform={isFemale ? "translate(35,228)" : "translate(33,228)"}>
        <rect x="0" y="-2" width="14" height="5" rx="1" fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.7" />
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={`lmc-${i}`}>
            <line x1={1.5 + i * 3.5} y1="3" x2={1.5 + i * 3.5} y2="14" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.75" />
            <line x1={1.5 + i * 3.5} y1="14" x2={1.5 + i * 3.5} y2="22" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.6" />
          </React.Fragment>
        ))}
        <line x1="15" y1="1" x2="18" y2="7" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.7" />
      </g>
      <g transform={isFemale ? "translate(153,228)" : "translate(155,228)"}>
        <rect x="-1" y="-2" width="14" height="5" rx="1" fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.7" />
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={`rmc-${i}`}>
            <line x1={0.5 + i * 3.5} y1="3" x2={0.5 + i * 3.5} y2="14" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.75" />
            <line x1={0.5 + i * 3.5} y1="14" x2={0.5 + i * 3.5} y2="22" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.6" />
          </React.Fragment>
        ))}
        <line x1="-2" y1="1" x2="-5" y2="7" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.7" />
      </g>

      {/* ── FEMUR ── */}
      <path d={isFemale ? "M 88 298 Q 86 340 84 380 Q 83 398 84 412" : "M 91 298 Q 89 342 87 382 Q 86 400 87 415"}
        stroke={bc} strokeWidth="3.2" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <circle cx={isFemale ? 88 : 90} cy="297" r="5" fill="none" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.6" />
      <path d={isFemale ? "M 112 298 Q 114 340 116 380 Q 117 398 116 412" : "M 109 298 Q 111 342 113 382 Q 114 400 113 415"}
        stroke={bc} strokeWidth="3.2" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <circle cx={isFemale ? 112 : 110} cy="297" r="5" fill="none" stroke={bc} strokeWidth="1" filter="url(#neon-glow)" opacity="0.6" />

      {/* ── PATELLA ── */}
      <circle cx={isFemale ? 84 : 86} cy={isFemale ? 414 : 418} r="4.5"
        fill="none" stroke={bc} strokeWidth="1.1" filter="url(#neon-glow)" opacity="0.75" />
      <circle cx={isFemale ? 116 : 114} cy={isFemale ? 414 : 418} r="4.5"
        fill="none" stroke={bc} strokeWidth="1.1" filter="url(#neon-glow)" opacity="0.75" />

      {/* ── TIBIA + FIBULA ── */}
      {/* Left tibia */}
      <path d={isFemale ? "M 83 420 Q 81 455 81 482" : "M 84 424 Q 82 458 82 482"}
        stroke={bc} strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <path d={isFemale ? "M 88 420 Q 89 455 89 482" : "M 89 424 Q 90 458 90 482"}
        stroke={bc} strokeWidth="1.4" fill="none" strokeLinecap="round" filter="url(#neon-glow)" opacity="0.8" />
      {/* Right tibia */}
      <path d={isFemale ? "M 117 420 Q 119 455 119 482" : "M 116 424 Q 118 458 118 482"}
        stroke={bc} strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
      <path d={isFemale ? "M 112 420 Q 111 455 111 482" : "M 111 424 Q 110 458 110 482"}
        stroke={bc} strokeWidth="1.4" fill="none" strokeLinecap="round" filter="url(#neon-glow)" opacity="0.8" />
      {/* Ankle malleoli */}
      <ellipse cx="78" cy="482" rx="2.5" ry="2" fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.65" />
      <ellipse cx="122" cy="482" rx="2.5" ry="2" fill="none" stroke={bc} strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.65" />

      {/* ── FOOT BONES ── */}
      {isFemale ? (
        <>
          <path d="M 80 484 Q 74 488 72 493 Q 68 498 66 498"
            stroke={bc} strokeWidth="1.4" fill="none" strokeLinecap="round" filter="url(#neon-glow)" opacity="0.7" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`lmt-f-${i}`} d={`M ${80 - i * 2} 484 L ${76 - i * 2} 498`}
              stroke={bc} strokeWidth="0.9" fill="none" filter="url(#neon-glow)" opacity="0.65" />
          ))}
          <path d="M 120 484 Q 126 488 128 493 Q 132 498 134 498"
            stroke={bc} strokeWidth="1.4" fill="none" strokeLinecap="round" filter="url(#neon-glow)" opacity="0.7" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`rmt-f-${i}`} d={`M ${120 + i * 2} 484 L ${124 + i * 2} 498`}
              stroke={bc} strokeWidth="0.9" fill="none" filter="url(#neon-glow)" opacity="0.65" />
          ))}
        </>
      ) : (
        <>
          <path d="M 80 484 Q 74 488 70 494 Q 66 498 62 498"
            stroke={bc} strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#neon-glow)" opacity="0.7" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`lmt-m-${i}`} d={`M ${80 - i * 2} 484 L ${74 - i * 2} 498`}
              stroke={bc} strokeWidth="1" fill="none" filter="url(#neon-glow)" opacity="0.65" />
          ))}
          <path d="M 120 484 Q 126 488 130 494 Q 134 498 138 498"
            stroke={bc} strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#neon-glow)" opacity="0.7" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`rmt-m-${i}`} d={`M ${120 + i * 2} 484 L ${126 + i * 2} 498`}
              stroke={bc} strokeWidth="1" fill="none" filter="url(#neon-glow)" opacity="0.65" />
          ))}
        </>
      )}

      {/* ══════════════════════════════════════════════════
          INTERNAL ORGANS
          ══════════════════════════════════════════════════ */}

      {/* ── LUNGS ── */}
      <path d="M 97 132 Q 82 138 80 160 Q 78 182 82 200 Q 88 208 95 204 Q 97 180 97 132 Z"
        fill="#FF5577" opacity="0.30" filter="url(#neon-glow)" />
      <path d="M 97 132 Q 82 138 80 160 Q 78 182 82 200 Q 88 208 95 204 Q 97 180 97 132 Z"
        fill="none" stroke="#FF5577" strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.5" />
      <path d="M 103 132 Q 118 138 120 160 Q 122 182 118 200 Q 112 208 105 204 Q 103 180 103 132 Z"
        fill="#FF5577" opacity="0.30" filter="url(#neon-glow)" />
      <path d="M 103 132 Q 118 138 120 160 Q 122 182 118 200 Q 112 208 105 204 Q 103 180 103 132 Z"
        fill="none" stroke="#FF5577" strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.5" />
      {/* Lobe fissures */}
      <path d="M 82 165 Q 88 168 95 165" stroke="#FF7799" strokeWidth="0.6" fill="none" opacity="0.4" filter="url(#neon-glow)" />
      <path d="M 118 165 Q 112 168 105 165" stroke="#FF7799" strokeWidth="0.6" fill="none" opacity="0.4" filter="url(#neon-glow)" />

      {/* ── HEART (animated pulse) ── */}
      <path d="M 100 142 Q 90 132 84 139 Q 78 148 100 166 Q 122 148 116 139 Q 110 132 100 142 Z"
        fill="#FF1A5E" opacity="0.65" filter="url(#neon-glow)" className="animate-pulse" />
      <path d="M 100 142 Q 90 132 84 139 Q 78 148 100 166 Q 122 148 116 139 Q 110 132 100 142 Z"
        fill="none" stroke="#FF4488" strokeWidth="1.2" filter="url(#neon-glow)" className="animate-pulse" />
      {/* Aorta */}
      <path d="M 100 142 Q 100 128 100 120" stroke="#FF4466" strokeWidth="2" fill="none" filter="url(#neon-glow)" opacity="0.6" />
      {/* Pulmonary arteries */}
      <path d="M 96 140 Q 88 136 84 138" stroke="#FF4466" strokeWidth="1.2" fill="none" filter="url(#neon-glow)" opacity="0.5" />
      <path d="M 104 140 Q 112 136 116 138" stroke="#FF4466" strokeWidth="1.2" fill="none" filter="url(#neon-glow)" opacity="0.5" />

      {/* ── STOMACH ── */}
      <path d="M 96 205 Q 84 208 80 222 Q 78 238 85 246 Q 92 252 100 250 Q 108 252 110 244 Q 116 232 110 216 Q 106 206 96 205 Z"
        fill="#FF8FAB" opacity="0.28" filter="url(#neon-glow)" />
      <path d="M 96 205 Q 84 208 80 222 Q 78 238 85 246 Q 92 252 100 250 Q 108 252 110 244 Q 116 232 110 216 Q 106 206 96 205 Z"
        fill="none" stroke="#FF8FAB" strokeWidth="1" filter="url(#neon-glow)" opacity="0.5" />

      {/* ── LIVER ── */}
      <path d="M 100 207 Q 116 204 124 212 Q 130 222 126 234 Q 120 244 110 242 Q 102 240 100 230 Z"
        fill="#CC3344" opacity="0.35" filter="url(#neon-glow)" />
      <path d="M 100 207 Q 116 204 124 212 Q 130 222 126 234 Q 120 244 110 242 Q 102 240 100 230 Z"
        fill="none" stroke="#CC3344" strokeWidth="0.9" filter="url(#neon-glow)" opacity="0.5" />

      {/* ── KIDNEYS ── */}
      <ellipse cx="86" cy="242" rx="5" ry="8" fill="#BB2244" opacity="0.45" filter="url(#neon-glow)" />
      <ellipse cx="86" cy="242" rx="5" ry="8" fill="none" stroke="#DD4466" strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.6" />
      <ellipse cx="114" cy="242" rx="5" ry="8" fill="#BB2244" opacity="0.45" filter="url(#neon-glow)" />
      <ellipse cx="114" cy="242" rx="5" ry="8" fill="none" stroke="#DD4466" strokeWidth="0.8" filter="url(#neon-glow)" opacity="0.6" />
      {/* Ureters */}
      <path d="M 86 250 Q 92 268 96 280" stroke="#CC3355" strokeWidth="0.8" fill="none" filter="url(#neon-glow)" opacity="0.5" />
      <path d="M 114 250 Q 108 268 104 280" stroke="#CC3355" strokeWidth="0.8" fill="none" filter="url(#neon-glow)" opacity="0.5" />

      {/* ── INTESTINES ── */}
      <path d="M 90 252 Q 82 260 82 272 Q 82 282 90 286 Q 98 288 100 285 Q 102 288 110 286 Q 118 282 118 272 Q 118 260 110 252 Q 100 248 90 252 Z"
        fill="none" stroke="#CC4466" strokeWidth="1.5" opacity="0.45" filter="url(#neon-glow)" />
      <path d="M 92 258 Q 86 264 86 274 Q 86 280 92 282 Q 100 284 108 282 Q 114 280 114 274 Q 114 264 108 258 Q 100 254 92 258 Z"
        fill="none" stroke="#BB3355" strokeWidth="1" opacity="0.35" filter="url(#neon-glow)" />
      <path d="M 94 262 Q 100 260 106 262" stroke="#AA2244" strokeWidth="0.8" fill="none" opacity="0.3" filter="url(#neon-glow)" />
      <path d="M 93 270 Q 100 268 107 270" stroke="#AA2244" strokeWidth="0.8" fill="none" opacity="0.3" filter="url(#neon-glow)" />
      <path d="M 94 278 Q 100 276 106 278" stroke="#AA2244" strokeWidth="0.8" fill="none" opacity="0.3" filter="url(#neon-glow)" />

      {/* ══════════════════════════════════════════════════
          GENDERED PELVIC ANATOMY
          ══════════════════════════════════════════════════ */}
      {isFemale ? (
        <g id="xray-female-anatomy">
          <path d="M 86 272 Q 100 262 114 272 C 120 290 112 302 107 302 L 103 310 L 97 310 L 93 302 C 88 302 80 290 86 272 Z"
            fill="none" stroke="#FF2A85" strokeWidth="2" filter="url(#neon-glow)" className="animate-pulse" />
          <path d="M 86 272 Q 100 262 114 272 C 120 290 112 302 107 302 L 103 310 L 97 310 L 93 302 C 88 302 80 290 86 272 Z"
            fill="#FF2A85" opacity="0.15" filter="url(#neon-glow)" />
          <path d="M 86 276 Q 72 270 66 276" stroke="#F472B6" strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
          <path d="M 114 276 Q 128 270 134 276" stroke="#F472B6" strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#neon-glow)" />
          <ellipse cx="65" cy="277" rx="4" ry="5" fill="#F472B6" opacity="0.55" filter="url(#neon-glow)" />
          <ellipse cx="135" cy="277" rx="4" ry="5" fill="#F472B6" opacity="0.55" filter="url(#neon-glow)" />
          <path d="M 100 310 Q 96 326 100 342" stroke="#FF2A85" strokeWidth="2" fill="none" filter="url(#neon-glow)" />
          <path d="M 100 310 Q 104 326 100 342" stroke="#FF2A85" strokeWidth="2" fill="none" filter="url(#neon-glow)" />
          {stats.arousal > stats.maxArousal * 0.5 && (
            <circle cx="100" cy="328" r="2" fill="#FFFFFF" filter="url(#neon-glow)" className="animate-[tearFall_2s_infinite]" />
          )}
          {stats.arousal > stats.maxArousal * 0.8 && (
            <circle cx="100" cy="338" r="1.5" fill="#FFFFFF" filter="url(#neon-glow)" className="animate-[tearFall_1.5s_0.8s_infinite]" />
          )}
        </g>
      ) : (
        <g id="xray-male-anatomy">
          <ellipse cx="100" cy="298" rx="9" ry="7" fill="none" stroke="#0EA5E9" strokeWidth="2" filter="url(#neon-glow)" className="animate-pulse" />
          <ellipse cx="100" cy="298" rx="9" ry="7" fill="#0EA5E9" opacity="0.15" filter="url(#neon-glow)" />
          <path d="M 100 305 Q 97 322 100 348" stroke="#0EA5E9" strokeWidth="1.8" fill="none" filter="url(#neon-glow)" />
          <path d="M 100 305 Q 103 322 100 348" stroke="#0EA5E9" strokeWidth="1.8" fill="none" filter="url(#neon-glow)" />
          <path d="M 91 293 Q 88 280 94 298 M 109 293 Q 112 280 106 298" stroke="#7DD3FC" strokeWidth="1.2" fill="none" filter="url(#neon-glow)" opacity="0.7" />
          <ellipse cx="92" cy="356" rx="6" ry="7" fill="none" stroke="#38BDF8" strokeWidth="1.5" filter="url(#neon-glow)" />
          <ellipse cx="92" cy="356" rx="6" ry="7" fill="#38BDF8" opacity="0.12" filter="url(#neon-glow)" />
          <ellipse cx="108" cy="356" rx="6" ry="7" fill="none" stroke="#38BDF8" strokeWidth="1.5" filter="url(#neon-glow)" />
          <ellipse cx="108" cy="356" rx="6" ry="7" fill="#38BDF8" opacity="0.12" filter="url(#neon-glow)" />
          <path d="M 98 350 Q 96 348 94 352" stroke="#7DD3FC" strokeWidth="0.9" fill="none" filter="url(#neon-glow)" opacity="0.6" />
          <path d="M 102 350 Q 104 348 106 352" stroke="#7DD3FC" strokeWidth="0.9" fill="none" filter="url(#neon-glow)" opacity="0.6" />
          {stats.arousal > stats.maxArousal * 0.5 && (
            <circle cx="100" cy="322" r="1.5" fill="#FFFFFF" filter="url(#neon-glow)" className="animate-[tearFall_1.2s_infinite]" />
          )}
        </g>
      )}

      {/* ══════════════════════════════════════════════════
          BONE DAMAGE CRACKS (health-based)
          ══════════════════════════════════════════════════ */}
      {hp < 0.5 && (
        <g stroke="#FF5500" fill="none" filter="url(#neon-glow)" opacity={hp < 0.25 ? 0.85 : 0.45}>
          <path d="M 100 -5 L 97 8 L 101 16 L 98 26" strokeWidth="0.9" />
          <path d="M 74 142 L 71 146 L 75 150" strokeWidth="0.75" />
          <path d="M 126 142 L 129 146 L 125 150" strokeWidth="0.75" />
        </g>
      )}
      {hp < 0.25 && (
        <g stroke="#FF2200" fill="none" filter="url(#neon-glow)" opacity="0.8">
          <path d="M 87 345 L 84 349 L 88 353" strokeWidth="0.8" />
          <path d="M 113 345 L 116 349 L 112 353" strokeWidth="0.8" />
          <path d="M 64 145 L 61 150 L 65 154" strokeWidth="0.7" />
          <path d="M 98 198 L 102 202" strokeWidth="0.8" />
        </g>
      )}

    </g>
  );
};
