import React from 'react';
import { PlayerRestraints, RestraintEntry, RestraintSlot } from '../../../types';
import { BodyGeom, SpriteState } from './utils';

interface RestraintLayerProps {
  geom: BodyGeom;
  s: SpriteState;
  restraints: PlayerRestraints | null;
}

/** Colors for restraint types (rope, chain, leather, magic) */
const RESTRAINT_COLORS: Record<string, { fill: string; stroke: string }> = {
  rope:    { fill: '#c9a96e', stroke: '#8b6914''},
  chain:   { fill: '#b0b8c8', stroke: '#6a7a90''},
  leather: { fill: '#4a2c10', stroke: '#2c1a08''},
  magic:   { fill: '#8b4fd8', stroke: '#5c1ab0''},
  default: { fill: '#c9a96e', stroke: '#8b6914''},
};

function getRestraintColor(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('chain') || lower.includes('shackle') || lower.includes('manacle')) return RESTRAINT_COLORS.chain;
  if (lower.includes('leather') || lower.includes('strap') || lower.includes('cuff')) return RESTRAINT_COLORS.leather;
  if (lower.includes('magic') || lower.includes('arcane') || lower.includes('glow')) return RESTRAINT_COLORS.magic;
  return RESTRAINT_COLORS.rope;
}

/** Renders wrist bindings at both wrist positions */
function WristRestraint({ s, geom, entry }: { s: SpriteState; geom: BodyGeom; entry: RestraintEntry }) {
  const { fill, stroke } = getRestraintColor(entry.name);
  const w = geom.handW * 0.6;
  const h = 5;
  return (
    <g data-slot="wrists" opacity={0.92}>
      {/* Left wrist band */}
      <rect x={s.wrLX - w / 2} y={s.wrY - h / 2} width={w} height={h} rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" />
      <line x1={s.wrLX - w / 2} y1={s.wrY} x2={s.wrLX + w / 2} y2={s.wrY} stroke={stroke} strokeWidth="0.4" opacity="0.5" />
      {/* Right wrist band */}
      <rect x={s.wrRX - w / 2} y={s.wrY - h / 2} width={w} height={h} rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" />
      <line x1={s.wrRX - w / 2} y1={s.wrY} x2={s.wrRX + w / 2} y2={s.wrY} stroke={stroke} strokeWidth="0.4" opacity="0.5" />
      {/* Connecting rope/chain between wrists when both are bound */}
      <path
        d={`M ${s.wrLX + w / 2} ${s.wrY} Q ${s.cx} ${s.wrY + 8} ${s.wrRX - w / 2} ${s.wrY}`}
        stroke={stroke} strokeWidth="0.7" fill="none" strokeDasharray={entry.name.toLowerCase().includes('chain') ? '2 1'': undefined}
        opacity="0.7"
      />
    </g>
  );
}

/** Renders ankle bindings */
function AnkleRestraint({ s, geom, entry }: { s: SpriteState; geom: BodyGeom; entry: RestraintEntry }) {
  const { fill, stroke } = getRestraintColor(entry.name);
  const w = geom.footW * 0.85;
  const h = 4;
  const ankleY = s.isDigi ? s.digiAnkleY : s.ankleY;
  return (
    <g data-slot="ankles" opacity={0.92}>
      {/* Left ankle band */}
      <rect x={s.legLX - w / 2} y={ankleY - h / 2} width={w} height={h} rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" />
      {/* Right ankle band */}
      <rect x={s.legRX - w / 2} y={ankleY - h / 2} width={w} height={h} rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" />
      {/* Short connecting link */}
      <line
        x1={s.legLX + w / 2} y1={ankleY}
        x2={s.legRX - w / 2} y2={ankleY}
        stroke={stroke} strokeWidth="0.7"
        strokeDasharray={entry.name.toLowerCase().includes('chain') ? '2 1'': undefined}
        opacity="0.65"
      />
    </g>
  );
}

/** Renders neck collar / restraint */
function NeckRestraint({ s, geom, entry }: { s: SpriteState; geom: BodyGeom; entry: RestraintEntry }) {
  const { fill, stroke } = getRestraintColor(entry.name);
  const neckMidY = (s.neckTopY + s.neckBotY) // 2;
  const neckHW = geom.headRX * 0.52;
  return (
    <g data-slot="neck" opacity={0.92}>
      <rect x={s.cx - neckHW} y={neckMidY - 2.5} width={neckHW * 2} height={5} rx="2.5" fill={fill} stroke={stroke} strokeWidth="0.8" />
      {/* Metal ring accent */}
      <circle cx={s.cx} cy={neckMidY} r={2} fill="none" stroke={stroke} strokeWidth="0.9" opacity="0.8" />
    </g>
  );
}

/** Renders waist strap */
function WaistRestraint({ s, geom, entry }: { s: SpriteState; geom: BodyGeom; entry: RestraintEntry }) {
  const { fill, stroke } = getRestraintColor(entry.name);
  const hipHW = geom.hipHW + 3;
  return (
    <g data-slot="waist" opacity={0.92}>
      <rect x={s.cx - hipHW} y={s.hipTopY + 1} width={hipHW * 2} height={6} rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" />
      {/* Buckle mark */}
      <rect x={s.cx - 3} y={s.hipTopY + 2} width={6} height={4} rx="1" fill="none" stroke={stroke} strokeWidth="0.8" />
    </g>
  );
}

/** Renders mouth gag */
function MouthRestraint({ s, geom, entry }: { s: SpriteState; geom: BodyGeom; entry: RestraintEntry }) {
  const { fill, stroke } = getRestraintColor(entry.name);
  const mouthY = s.headCY + geom.headRY * 0.28;
  const mouthHW = geom.headRX * 0.32;
  return (
    <g data-slot="mouth" opacity={0.9}>
      {/* Ball-gag or strap */}
      {entry.name.toLowerCase().includes('ball') ? (
        <circle cx={s.cx} cy={mouthY} r={mouthHW * 0.7} fill={fill} stroke={stroke} strokeWidth="0.7" />
      ) : (
        <rect x={s.cx - mouthHW} y={mouthY - 2} width={mouthHW * 2} height={4} rx="2" fill={fill} stroke={stroke} strokeWidth="0.7" />
      )}
      {/* Strap lines around head */}
      <line x1={s.cx - mouthHW} y1={mouthY} x2={s.cx - geom.headRX - 1} y2={mouthY - 1} stroke={stroke} strokeWidth="0.6" opacity="0.7" />
      <line x1={s.cx + mouthHW} y1={mouthY} x2={s.cx + geom.headRX + 1} y2={mouthY - 1} stroke={stroke} strokeWidth="0.6" opacity="0.7" />
    </g>
  );
}

const SLOT_RENDERERS: Record<RestraintSlot, React.FC<{ s: SpriteState; geom: BodyGeom; entry: RestraintEntry }>> = {
  wrists: WristRestraint,
  ankles: AnkleRestraint,
  neck:   NeckRestraint,
  waist:  WaistRestraint,
  mouth:  MouthRestraint,
};

/**
 * RestraintLayer — renders visual rope/chain/leather bindings for all active restraint slots.
 * Sits above the clothing layer so restraints are always visible.
 */
export const RestraintLayer: React.FC<RestraintLayerProps> = ({ geom, s, restraints }) => {
  if (!restraints || restraints.entries.length === 0) return null;

  return (
    <g data-layer="restraints">
      {restraints.entries.map((entry) => {
        const Renderer = SLOT_RENDERERS[entry.slot];
        if (!Renderer) return null;
        return <Renderer key={entry.slot} s={s} geom={geom} entry={entry} />;
      })}
    </g>
  );
};
