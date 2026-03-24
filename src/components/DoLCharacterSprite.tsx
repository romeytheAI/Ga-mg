import React from 'react';
import { motion } from 'motion/react';
import { GameState, ClothingLayer, Item } from '../types';

interface DoLCharacterSpriteProps {
  state: GameState;
  compact?: boolean;
}

// Color per clothing slot for DoL-style layered visualization
const SLOT_COLORS: Record<string, { fill: string; stroke: string }> = {
  head:       { fill: '#8b5e3c', stroke: '#a3714a' },
  neck:       { fill: '#4a7a8a', stroke: '#5a8e9e' },
  shoulders:  { fill: '#3d5a80', stroke: '#4d6e98' },
  chest:      { fill: '#2d4a6e', stroke: '#3d5a82' },
  underwear:  { fill: '#7a3a6e', stroke: '#9a4a8e' },
  legs:       { fill: '#3a5a3a', stroke: '#4a7a4a' },
  feet:       { fill: '#5a4a2a', stroke: '#7a6a3a' },
  hands:      { fill: '#3a3a5a', stroke: '#5a5a7a' },
  waist:      { fill: '#5a3a3a', stroke: '#7a4a4a' },
};

// Map integrity to opacity and visual damage class
function getIntegrityStyle(item: Item | null): { opacity: number; torn: boolean; exposed: boolean } {
  if (!item) return { opacity: 0, torn: false, exposed: true };
  const integ = item.integrity ?? 100;
  if (integ > 70) return { opacity: 0.85, torn: false, exposed: false };
  if (integ > 40) return { opacity: 0.6, torn: true, exposed: false };
  if (integ > 10) return { opacity: 0.35, torn: true, exposed: true };
  return { opacity: 0, torn: true, exposed: true };
}

// Get skin tone color from cosmetics
function getSkinColor(state: GameState): string {
  const tone = state.player.cosmetics?.skin_tone || 'fair';
  const map: Record<string, string> = {
    fair: '#f4d5b0',
    pale: '#f0e8d8',
    tan: '#c8956a',
    dark: '#6b3d2e',
    ebony: '#3d1e12',
    olive: '#b8a060',
  };
  return map[tone] || '#f4d5b0';
}

export const DoLCharacterSprite: React.FC<DoLCharacterSpriteProps> = ({ state, compact = false }) => {
  const clothing = state.player.clothing;
  const skinColor = getSkinColor(state);
  const isExposed = !clothing.chest && !clothing.underwear;
  const hasArousal = state.player.stats.arousal > 40;
  const hasCorruption = state.player.stats.corruption > 50;

  const size = compact ? 120 : 200;
  const scale = compact ? 0.6 : 1;

  return (
    <div
      className={`flex flex-col items-center gap-1 ${compact ? '' : 'mt-2'}`}
      style={{ width: size }}
    >
      <motion.svg
        viewBox="0 0 100 180"
        width={size}
        height={size * 1.8}
        style={{ filter: hasCorruption ? 'hue-rotate(280deg) saturate(1.3)' : hasArousal ? 'hue-rotate(-15deg) saturate(1.2)' : undefined }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Body outline / skin */}
        {/* Head */}
        <ellipse cx="50" cy="18" rx="14" ry="16" fill={skinColor} stroke="#00000040" strokeWidth="0.5" />
        {/* Neck */}
        <rect x="44" y="32" width="12" height="10" fill={skinColor} />
        {/* Torso */}
        <rect x="30" y="42" width="40" height="50" rx="4" fill={skinColor} />
        {/* Arms */}
        <rect x="14" y="44" width="14" height="44" rx="5" fill={skinColor} />
        <rect x="72" y="44" width="14" height="44" rx="5" fill={skinColor} />
        {/* Hands */}
        <ellipse cx="21" cy="92" rx="8" ry="7" fill={skinColor} />
        <ellipse cx="79" cy="92" rx="8" ry="7" fill={skinColor} />
        {/* Legs */}
        <rect x="31" y="92" width="16" height="60" rx="5" fill={skinColor} />
        <rect x="53" y="92" width="16" height="60" rx="5" fill={skinColor} />
        {/* Feet */}
        <ellipse cx="39" cy="155" rx="10" ry="6" fill={skinColor} />
        <ellipse cx="61" cy="155" rx="10" ry="6" fill={skinColor} />

        {/* Hair */}
        {(() => {
          const hairColor = state.player.cosmetics?.hair_color || 'brown';
          const hairMap: Record<string, string> = {
            brown: '#5a3a1a', black: '#1a1a1a', blonde: '#d4a843', red: '#8b2a0a',
            white: '#e8e8e8', silver: '#b0b0c0', blue: '#1a4a8b', purple: '#6a2a8b',
          };
          const hc = hairMap[hairColor] || '#5a3a1a';
          const hairLen = state.player.cosmetics?.hair_length || 'medium';
          return (
            <>
              <ellipse cx="50" cy="13" rx="16" ry="12" fill={hc} />
              {hairLen === 'long' && (
                <>
                  <rect x="33" y="13" width="5" height="30" rx="3" fill={hc} />
                  <rect x="62" y="13" width="5" height="30" rx="3" fill={hc} />
                </>
              )}
              {(hairLen === 'medium' || hairLen === 'shaggy') && (
                <>
                  <rect x="33" y="13" width="5" height="16" rx="3" fill={hc} />
                  <rect x="62" y="13" width="5" height="16" rx="3" fill={hc} />
                </>
              )}
            </>
          );
        })()}

        {/* Eyes */}
        {(() => {
          const eyeColor = state.player.cosmetics?.eye_color || 'blue';
          const eyeMap: Record<string, string> = {
            blue: '#4a7ab8', green: '#3a8a4a', brown: '#6a4a2a', hazel: '#7a6a3a',
            grey: '#7a7a8a', violet: '#8a4a9a', silver: '#9a9aaa', gold: '#c8a030',
          };
          const ec = eyeMap[eyeColor] || '#4a7ab8';
          return (
            <>
              <ellipse cx="44" cy="18" rx="3.5" ry="3" fill="white" />
              <ellipse cx="56" cy="18" rx="3.5" ry="3" fill="white" />
              <circle cx="44" cy="18" r="2" fill={ec} />
              <circle cx="56" cy="18" r="2" fill={ec} />
              <circle cx="44.8" cy="17.3" r="0.6" fill="white" />
              <circle cx="56.8" cy="17.3" r="0.6" fill="white" />
            </>
          );
        })()}

        {/* --- Clothing Layers --- */}

        {/* HEAD item */}
        {(() => {
          const item = clothing.head;
          const { opacity, torn } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.head;
          return (
            <g opacity={opacity}>
              <ellipse cx="50" cy="11" rx="16" ry="10" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "3 2" : undefined} />
            </g>
          );
        })()}

        {/* NECK item */}
        {(() => {
          const item = clothing.neck;
          const { opacity } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.neck;
          return (
            <g opacity={opacity}>
              <rect x="42" y="32" width="16" height="9" rx="2" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
            </g>
          );
        })()}

        {/* SHOULDERS item */}
        {(() => {
          const item = clothing.shoulders;
          const { opacity, torn } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.shoulders;
          return (
            <g opacity={opacity}>
              <rect x="13" y="42" width="18" height="16" rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "2 2" : undefined} />
              <rect x="69" y="42" width="18" height="16" rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "2 2" : undefined} />
            </g>
          );
        })()}

        {/* CHEST item */}
        {(() => {
          const item = clothing.chest;
          const { opacity, torn } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.chest;
          return (
            <g opacity={opacity}>
              <rect x="30" y="42" width="40" height="45" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "3 2" : undefined} />
              {torn && <line x1="35" y1="50" x2="45" y2="70" stroke={c.stroke} strokeWidth="1" opacity="0.5" />}
            </g>
          );
        })()}

        {/* UNDERWEAR item */}
        {(() => {
          const item = clothing.underwear;
          const { opacity, torn } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.underwear;
          return (
            <g opacity={opacity}>
              <rect x="30" y="87" width="40" height="14" rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "2 2" : undefined} />
            </g>
          );
        })()}

        {/* WAIST item */}
        {(() => {
          const item = clothing.waist;
          const { opacity } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.waist;
          return (
            <g opacity={opacity}>
              <rect x="28" y="88" width="44" height="8" rx="2" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
            </g>
          );
        })()}

        {/* LEGS item */}
        {(() => {
          const item = clothing.legs;
          const { opacity, torn } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.legs;
          return (
            <g opacity={opacity}>
              <rect x="30" y="97" width="16" height="56" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "3 2" : undefined} />
              <rect x="54" y="97" width="16" height="56" rx="4" fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                strokeDasharray={torn ? "3 2" : undefined} />
            </g>
          );
        })()}

        {/* FEET item */}
        {(() => {
          const item = clothing.feet;
          const { opacity } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.feet;
          return (
            <g opacity={opacity}>
              <ellipse cx="39" cy="155" rx="11" ry="7" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
              <ellipse cx="61" cy="155" rx="11" ry="7" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
            </g>
          );
        })()}

        {/* HANDS item */}
        {(() => {
          const item = clothing.hands;
          const { opacity } = getIntegrityStyle(item);
          if (!item || opacity === 0) return null;
          const c = SLOT_COLORS.hands;
          return (
            <g opacity={opacity}>
              <ellipse cx="21" cy="92" rx="9" ry="8" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
              <ellipse cx="79" cy="92" rx="9" ry="8" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" />
            </g>
          );
        })()}

        {/* Exposure blush overlay */}
        {isExposed && (
          <ellipse cx="50" cy="67" rx="20" ry="25" fill="rgba(255,80,80,0.08)" />
        )}

        {/* Arousal flush on face */}
        {(state.player.stats.arousal > 30 || state.player.stats.lust > 40) && (
          <>
            <ellipse cx="42" cy="22" rx="4" ry="2.5" fill="rgba(255,100,100,0.3)" />
            <ellipse cx="58" cy="22" rx="4" ry="2.5" fill="rgba(255,100,100,0.3)" />
          </>
        )}

        {/* Corruption aura */}
        {state.player.stats.corruption > 60 && (
          <ellipse cx="50" cy="90" rx="48" ry="88" fill="none" stroke="rgba(150,0,200,0.2)" strokeWidth="3" />
        )}

        {/* Low health wound indicators */}
        {state.player.stats.health < 40 && (
          <g>
            <circle cx="38" cy="55" r="3" fill="rgba(200,0,0,0.4)" />
            <circle cx="62" cy="75" r="2.5" fill="rgba(200,0,0,0.35)" />
          </g>
        )}
      </motion.svg>

      {/* Exposure warning */}
      {isExposed && !compact && (
        <div className="text-[9px] tracking-widest uppercase text-red-400/80 animate-pulse text-center px-1">
          Exposed
        </div>
      )}
    </div>
  );
};
