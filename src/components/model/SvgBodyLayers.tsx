import React from 'react';
import { useGameStore, ClothingItem, PlayableRace, PlayerState } from '../../store/gameStore';
import { raceColors, clothingColors } from './colors';
import { XRayContent } from './XRayContent';

interface ModelProps {
  stats: PlayerState['stats'];
  clothing: PlayerState['clothing'];
  xrayMode?: boolean;
}

export const SvgPlayerModel: React.FC<ModelProps> = ({ stats, clothing, xrayMode = false }) => {
  const race = stats.race;
  const gender = stats.gender;
  const colors = raceColors[race] || raceColors['Imperial'];
  const isFemale = gender === 'Female';

  const isBlushing = stats.arousal > stats.maxArousal * 0.4;
  const heavyBlush = stats.arousal > stats.maxArousal * 0.8;
  const isCrying = stats.trauma > stats.maxTrauma * 0.5;
  const heavyTears = stats.trauma > stats.maxTrauma * 0.8;
  const isSweating = stats.fatigue < stats.maxFatigue * 0.4 || stats.stress > stats.maxStress * 0.6;
  const heavySweat = stats.fatigue < stats.maxFatigue * 0.1 || stats.stress > stats.maxStress * 0.9;
  const isBruised = stats.health < stats.maxHealth * 0.5;
  const isBleeding = stats.health < stats.maxHealth * 0.2;
  const isCorrupted = stats.corruption > 1000;

  // Race-specific features
  const isElf = race === 'Altmer' || race === 'Bosmer' || race === 'Dunmer';
  const isKhajiit = race === 'Khajiit';
  const isArgonian = race === 'Argonian';
  const isOrc = race === 'Orc';
  const hasPointedEars = isElf;
  const hasCatEars = isKhajiit;
  const hasFinEars = isArgonian;
  const hasHorns = isArgonian;
  const hasTusks = isOrc;
  const hasWhiskers = isKhajiit;
  const hasTail = isKhajiit || isArgonian;

  // Blush color derived from race
  const blushColor = isArgonian ? '#4AA87A' : isKhajiit ? '#E8A070' : isOrc ? '#88B854' : '#E88888';

  // Eye center coordinates (used for transform-origin on eyelid blink animation)
  const EYE_L_CX = 74, EYE_L_CY = 56;
  const EYE_R_CX = 126, EYE_R_CY = 56;

  // Eyebrows
  let leftBrow = "M 64 46 Q 72 42 84 48";
  let rightBrow = "M 136 46 Q 128 42 116 48";
  if (stats.stress > stats.maxStress * 0.6) {
    leftBrow = "M 64 40 Q 76 46 88 52";
    rightBrow = "M 136 40 Q 124 46 112 52";
  } else if (stats.trauma > stats.maxTrauma * 0.6) {
    leftBrow = "M 60 50 Q 72 42 84 44";
    rightBrow = "M 140 50 Q 128 42 116 44";
  }

  // Eyes (Lids and Shape) — DoL-parity expressive system
  // Base shape: slightly taller than before for bigger, more emotive look
  let eyeShape  = "M 62 63 Q 74 50 86 63 Q 74 72 62 63";
  let eyeShapeR = "M 138 63 Q 126 50 114 63 Q 126 72 138 63";
  let pupilSize = 4.2;
  // Half-lid overlay paths (skin-colored strip over upper iris for heavy-lid look)
  let lidOverlayL = "";
  let lidOverlayR = "";
  // Upper eyelid arc (drawn on top of the eye white)
  let lidArcL = "M 60 56 Q 74 42 88 56";
  let lidArcR = "M 140 56 Q 126 42 112 56";

  const isAroused     = stats.arousal > stats.maxArousal * 0.5;
  const heavyArousal  = stats.arousal > stats.maxArousal * 0.82;
  const isExhausted   = stats.fatigue < stats.maxFatigue * 0.18;
  const isScared      = stats.trauma > stats.maxTrauma * 0.65;

  if (stats.stress > stats.maxStress * 0.65) {
    // Furrowed squint
    eyeShape  = "M 63 64 Q 74 58 85 64 Q 74 69 63 64";
    eyeShapeR = "M 137 64 Q 126 58 115 64 Q 126 69 137 64";
    pupilSize = 3.2;
    lidArcL = "M 61 60 Q 74 46 87 60";
    lidArcR = "M 139 60 Q 126 46 113 60";
  } else if (isScared) {
    // Wide fearful eyes
    eyeShape  = "M 60 63 Q 74 47 88 63 Q 74 75 60 63";
    eyeShapeR = "M 140 63 Q 126 47 112 63 Q 126 75 140 63";
    pupilSize = 5.8;
    lidArcL = "M 58 55 Q 74 39 90 55";
    lidArcR = "M 142 55 Q 126 39 110 55";
  } else if (heavyArousal) {
    // Heavy-lidded intense arousal
    eyeShape  = "M 62 63 Q 74 52 86 63 Q 74 72 62 63";
    eyeShapeR = "M 138 63 Q 126 52 114 63 Q 126 72 138 63";
    pupilSize = 5.2;
    lidArcL = "M 60 59 Q 74 48 88 59";
    lidArcR = "M 140 59 Q 126 48 112 59";
    // Drooping lid overlays (skin-coloured crescent over upper iris)
    lidOverlayL = "M 62 63 Q 74 50 86 63 L 86 58 Q 74 48 62 58 Z";
    lidOverlayR = "M 138 63 Q 126 50 114 63 L 114 58 Q 126 48 138 58 Z";
  } else if (isAroused) {
    // Soft half-lid
    eyeShape  = "M 62 63 Q 74 51 86 63 Q 74 72 62 63";
    eyeShapeR = "M 138 63 Q 126 51 114 63 Q 126 72 138 63";
    pupilSize = 4.8;
    lidArcL = "M 60 57 Q 74 44 88 57";
    lidArcR = "M 140 57 Q 126 44 112 57";
    lidOverlayL = "M 62 63 Q 74 51 86 63 L 86 58 Q 74 46 62 58 Z";
    lidOverlayR = "M 138 63 Q 126 51 114 63 L 114 58 Q 126 46 138 58 Z";
  } else if (isExhausted) {
    // Droopy tired eyes
    eyeShape  = "M 62 64 Q 74 54 86 64 Q 74 71 62 64";
    eyeShapeR = "M 138 64 Q 126 54 114 64 Q 126 71 138 64";
    pupilSize = 3.8;
    lidArcL = "M 60 58 Q 74 46 88 58";
    lidArcR = "M 140 58 Q 126 46 112 58";
    lidOverlayL = "M 62 64 Q 74 54 86 64 L 86 59 Q 74 50 62 59 Z";
    lidOverlayR = "M 138 64 Q 126 54 114 64 L 114 59 Q 126 50 138 59 Z";
  }
  if (isCorrupted) pupilSize = 6.2;

  // Mouth — more nuanced state-based expressions
  let mouthPath = "M 88 96 Q 100 100 112 96";   // gentle resting smile
  if (stats.health < stats.maxHealth * 0.3)        mouthPath = "M 88 96 Q 100 88 112 96";   // pain grimace
  else if (heavyArousal)                            mouthPath = "M 90 97 Q 100 110 110 97";   // open-mouthed pant
  else if (isAroused)                               mouthPath = "M 90 96 Q 100 106 110 96";   // soft open
  else if (stats.stress > stats.maxStress * 0.7)   mouthPath = "M 84 97 Q 100 99 116 97";   // tight line
  else if (stats.trauma > stats.maxTrauma * 0.65)  mouthPath = "M 88 97 Q 100 93 112 97";   // downward
  else if (stats.corruption > 1000)                mouthPath = "M 86 96 Q 100 104 114 96";   // wide smirk




  // --- Clothing Renderer (Advanced High Fidelity) ---
  const renderClothing = (item: ClothingItem | null, type: 'upper' | 'lower') => {
    if (!item) return null;
    const clothColor = clothingColors[item.id] || clothingColors['common_shirt'];
    const integrityPct = item.integrity / item.maxIntegrity;

    // Tattered masks for holes and rips (High Fidelity)
    let maskId = undefined;
    if (integrityPct < 0.8) {
       maskId = integrityPct < 0.4 ? "url(#heavy-tear-mask)" : "url(#light-tear-mask)";
    }

    if (type === 'upper') {
       const tunicPath = isFemale
         ? "M 56 130 C 40 160, 40 240, 50 250 L 70 220 L 66 370 C 100 390, 134 370, 134 370 L 130 220 L 150 250 C 160 240, 160 160, 144 130 C 130 116, 120 124, 100 140 C 80 124, 70 116, 56 130 Z"
         : "M 50 130 C 36 160, 36 240, 46 250 L 70 220 L 70 370 C 100 380, 130 370, 130 370 L 130 220 L 154 250 C 164 240, 164 160, 150 130 C 136 116, 120 124, 100 140 C 80 124, 64 116, 50 130 Z";

       return (
          <g mask={maskId} style={{ opacity: integrityPct < 0.1 ? 0.8 : 1 }}>
             {/* Back collar / Inside */}
             <path d="M 76 120 Q 100 130, 124 120 L 130 130 Q 100 144, 70 130 Z" fill="#1a1a1a" opacity="0.6" />

             {/* Main Tunic Body with High-Fidelity Gradient */}
             <path d={tunicPath} fill={`url(#cloth-grad-${item.id})`} />

             {/* Texture Overlay */}
             <path d={tunicPath} fill="none" stroke={clothColor.texture} strokeWidth="1" strokeDasharray="2, 2" opacity="0.3" />

             {/* Deep Shadows / Folds */}
             <path d="M 70 220 C 90 260, 80 360, 80 360" stroke={clothColor.deepShadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />
             <path d="M 130 220 C 110 260, 120 360, 120 360" stroke={clothColor.deepShadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />

             {/* Female chest drape shadow */}
             {isFemale && <path d="M 70 210 Q 100 230, 130 210" stroke={clothColor.deepShadow} strokeWidth="4" fill="none" opacity="0.5" filter="url(#blur-md)" />}

             {/* Specular Highlights for leather/silk */}
             {item.id.includes('leather') && (
               <path d="M 76 180 C 80 200, 78 280, 78 280" stroke="#FFF" strokeWidth="1.5" fill="none" opacity="0.3" filter="url(#blur-sm)" />
             )}

             {/* Belt */}
             {(item.id.includes('tunic') || item.id.includes('robes')) && (
               <g>
                 <path d="M 68 300 Q 100 310, 132 300 L 132 310 Q 100 320, 68 310 Z" fill="#2d1a11" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))" />
                 <path d="M 68 302 Q 100 312, 132 302" stroke="#4a2b18" strokeWidth="1" fill="none" />
                 <rect x="94" y="298" width="12" height="16" fill="#d4af37" rx="2" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.5))" />
                 <rect x="96" y="300" width="8" height="12" fill="#2d1a11" />
                 <rect x="94" y="306" width="12" height="2" fill="#FFF" opacity="0.5" />
               </g>
             )}
          </g>
       );
    } else { // lower
       const pantsPath = isFemale
         ? "M 64 360 Q 100 370, 136 360 L 136 500 L 104 500 L 100 400 L 96 500 L 64 500 Z"
         : "M 68 360 Q 100 370, 132 360 L 134 500 L 104 500 L 100 400 L 96 500 L 66 500 Z";

       return (
          <g mask={maskId} style={{ opacity: integrityPct < 0.1 ? 0.8 : 1 }}>
             <path d={pantsPath} fill={`url(#cloth-grad-${item.id})`} />

             {/* Crotch/Inseam Shading */}
             <path d="M 100 400 L 104 500 L 96 500 Z" fill="#000" opacity="0.4" filter="url(#blur-sm)" />

             {/* Knee Folds */}
             <path d="M 68 440 Q 80 450, 92 440 M 108 440 Q 120 450, 132 440" stroke={clothColor.deepShadow} strokeWidth="3" fill="none" opacity="0.5" filter="url(#blur-sm)" />
             <path d="M 68 438 Q 80 448, 92 438 M 108 438 Q 120 448, 132 438" stroke={clothColor.highlight} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />
          </g>
       );
    }
  };

  // Insert before return (
  return (
    <div className="w-full h-full flex justify-center items-center overflow-visible">
      <svg viewBox="0 0 200 500" className="w-auto h-full max-h-[800px] overflow-visible drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]">
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* --- HEAD GRADIENT --- */}
          <radialGradient id="head-grad" cx="50%" cy="35%" r="65%" fx="50%" fy="25%">
            <stop offset="0%" stopColor={colors.highLight} />
            <stop offset="20%" stopColor={colors.midHighlight} />
            <stop offset="55%" stopColor={colors.base} />
            <stop offset="85%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          {/* --- HAND GRADIENT --- */}
          <radialGradient id="hand-grad" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="50%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.shadow} />
          </radialGradient>

          {/* --- FOOT GRADIENT --- */}
          <radialGradient id="foot-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="50%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.shadow} />
          </radialGradient>

          {/* --- EAR GRADIENT --- */}
          <radialGradient id="ear-inner" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="60%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.base} />
          </radialGradient>

          {/* --- HAIR GRADIENT --- */}
          <linearGradient id="hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.hairBase} />
            <stop offset="40%" stopColor={colors.hairBase} />
            <stop offset="100%" stopColor={colors.hairShadow} />
          </linearGradient>
          <radialGradient id="hair-shine" cx="45%" cy="25%" r="50%">
            <stop offset="0%" stopColor={colors.highLight} stopOpacity="0.35" />
            <stop offset="100%" stopColor={colors.highLight} stopOpacity="0" />
          </radialGradient>
          {/* Hair mid-tone (between base and shadow, used for strand layers) */}
          <linearGradient id="hair-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.hairBase} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.hairShadow} stopOpacity="0.9" />
          </linearGradient>

          {/* --- CLOTHING GRADIENTS (dynamic per item) --- */}
          {Object.entries(clothingColors).map(([id, c]) => (
            <linearGradient key={id} id={`cloth-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c.highlight} />
              <stop offset="25%" stopColor={c.base} />
              <stop offset="75%" stopColor={c.shadow} />
              <stop offset="100%" stopColor={c.deepShadow} />
            </linearGradient>
          ))}

          {/* --- TEAR / DAMAGE MASKS --- */}
          <mask id="light-tear-mask">
            <rect width="200" height="500" fill="white" />
            <ellipse cx="80" cy="200" rx="6" ry="10" fill="black" />
            <ellipse cx="130" cy="350" rx="8" ry="5" fill="black" />
            <ellipse cx="110" cy="180" rx="4" ry="7" fill="black" />
          </mask>
          <mask id="heavy-tear-mask">
            <rect width="200" height="500" fill="white" />
            <ellipse cx="75" cy="180" rx="10" ry="14" fill="black" />
            <ellipse cx="130" cy="220" rx="12" ry="8" fill="black" />
            <ellipse cx="90" cy="340" rx="8" ry="12" fill="black" />
            <ellipse cx="120" cy="380" rx="10" ry="6" fill="black" />
            <ellipse cx="105" cy="160" rx="6" ry="10" fill="black" />
            <path d="M 85 300 L 90 310 L 80 315 Z" fill="black" />
          </mask>

          {/* --- RIM LIGHT FILTER --- */}
          <filter id="rim-light" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feOffset in="blur" dx="-1" dy="0" result="offsetBlur" />
            <feFlood floodColor={colors.highLight} floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="offsetBlur" operator="in" result="rimGlow" />
            <feMerge>
              <feMergeNode in="rimGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* --- SUBSURFACE SCATTERING FILTER (warm light through skin) --- */}
          <filter id="sss-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="sssBlur" />
            <feFlood floodColor={isArgonian ? '#2a5030' : isKhajiit ? '#c08050' : '#ff6040'} floodOpacity="0.12" result="sssColor" />
            <feComposite in="sssColor" in2="sssBlur" operator="in" result="sssGlow" />
            <feMerge>
              <feMergeNode in="sssGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* --- SKIN TEXTURE PATTERN (subtle noise) --- */}
          <filter id="skin-texture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="3" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="bwNoise" />
            <feBlend in="SourceGraphic" in2="bwNoise" mode="overlay" />
          </filter>

          {/* --- SCALE PATTERN FOR ARGONIAN --- */}
          <pattern id="scale-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <path d="M 0 4 Q 4 0 8 4 Q 4 8 0 4 Z" fill="none" stroke={colors.shadow} strokeWidth="0.3" opacity="0.4" />
          </pattern>

          {/* --- FUR STRIPE PATTERN FOR KHAJIIT --- */}
          <pattern id="fur-stripe" x="0" y="0" width="12" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
            <path d="M 6 0 Q 4 8 6 16" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.15" />
          </pattern>

          {/* --- IRIS GRADIENT (layered detail) --- */}
          <radialGradient id="iris-l" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.eyeBase} stopOpacity="0.3" />
            <stop offset="30%" stopColor={colors.eyeBase} />
            <stop offset="70%" stopColor={colors.eyeBase} />
            <stop offset="85%" stopColor={colors.deepShadow} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id="iris-r" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.eyeBase} stopOpacity="0.3" />
            <stop offset="30%" stopColor={colors.eyeBase} />
            <stop offset="70%" stopColor={colors.eyeBase} />
            <stop offset="85%" stopColor={colors.deepShadow} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
          </radialGradient>

          {/* --- SCLERA GRADIENT (not pure white) --- */}
          <radialGradient id="sclera-l" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#F0F0F0" />
            <stop offset="60%" stopColor="#E8E4E0" />
            <stop offset="100%" stopColor="#D0C8C0" />
          </radialGradient>
          <radialGradient id="sclera-r" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#F0F0F0" />
            <stop offset="60%" stopColor="#E8E4E0" />
            <stop offset="100%" stopColor="#D0C8C0" />
          </radialGradient>

          {/* --- CORNEAL HIGHLIGHT --- */}
          <radialGradient id="corneal-shine" cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* --- LIP GRADIENT --- */}
          <radialGradient id="lip-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={isArgonian ? colors.midHighlight : '#E87878'} />
            <stop offset="50%" stopColor={isArgonian ? colors.base : '#D06060'} />
            <stop offset="100%" stopColor={isArgonian ? colors.shadow : '#8C3333'} />
          </radialGradient>

          {/* --- NAIL BED --- */}
          <linearGradient id="nail-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isArgonian ? colors.shadow : '#F0D0D0'} />
            <stop offset="50%" stopColor={isArgonian ? colors.deepShadow : '#E8C0C0'} />
            <stop offset="100%" stopColor={isArgonian ? colors.shadow : '#D8B0B0'} />
          </linearGradient>

          {/* --- HIGH FIDELITY GRADIENTS --- */}

          {/* Torso Cylinder/Sphere Mapping */}
          <radialGradient id="torso-f" cx="50%" cy="40%" r="70%" fx="50%" fy="30%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="20%" stopColor={colors.base} />
            <stop offset="50%" stopColor={colors.base} />
            <stop offset="75%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          <radialGradient id="torso-m" cx="50%" cy="30%" r="80%" fx="50%" fy="20%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="25%" stopColor={colors.base} />
            <stop offset="55%" stopColor={colors.base} />
            <stop offset="80%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          {/* Breast Sphere Mapping */}
          <radialGradient id="breast-l" cx="45%" cy="40%" r="60%" fx="35%" fy="35%">
            <stop offset="0%" stopColor={colors.highLight} />
            <stop offset="12%" stopColor={colors.midHighlight} />
            <stop offset="40%" stopColor={colors.base} />
            <stop offset="75%" stopColor={colors.shadow} />
            <stop offset="95%" stopColor={colors.deepShadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>
          <radialGradient id="breast-r" cx="55%" cy="40%" r="60%" fx="65%" fy="35%">
            <stop offset="0%" stopColor={colors.highLight} />
            <stop offset="12%" stopColor={colors.midHighlight} />
            <stop offset="40%" stopColor={colors.base} />
            <stop offset="75%" stopColor={colors.shadow} />
            <stop offset="95%" stopColor={colors.deepShadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          {/* Limb Cylinders (more gradient stops for 3D wrap) */}
          <linearGradient id="arm-l" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="15%" stopColor={colors.base} />
            <stop offset="40%" stopColor={colors.base} />
            <stop offset="65%" stopColor={colors.shadow} />
            <stop offset="85%" stopColor={colors.deepShadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          <linearGradient id="arm-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="15%" stopColor={colors.base} />
            <stop offset="40%" stopColor={colors.base} />
            <stop offset="65%" stopColor={colors.shadow} />
            <stop offset="85%" stopColor={colors.deepShadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          <linearGradient id="leg-l" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="10%" stopColor={colors.shadow} />
            <stop offset="30%" stopColor={colors.base} />
            <stop offset="55%" stopColor={colors.midHighlight} />
            <stop offset="80%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          <linearGradient id="leg-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="10%" stopColor={colors.shadow} />
            <stop offset="30%" stopColor={colors.base} />
            <stop offset="55%" stopColor={colors.midHighlight} />
            <stop offset="80%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          {/* Neck Cylinder with chin shadow */}
          <linearGradient id="neck" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="15%" stopColor={colors.shadow} />
            <stop offset="50%" stopColor={colors.base} />
            <stop offset="85%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.midHighlight} />
          </linearGradient>

          <linearGradient id="neck-curve" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="15%" stopColor={colors.shadow} />
            <stop offset="30%" stopColor={colors.base} />
            <stop offset="70%" stopColor={colors.base} />
            <stop offset="85%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          {/* Filters for soft shading */}
          <filter id="blur-sm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="blur-md" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="blur-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="blur-xs" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" />
          </filter>

          {/* Goosebump texture filter */}
          <filter id="goosebumps" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="1.8" numOctaves="2" seed="5" result="bumps" />
            <feColorMatrix in="bumps" type="saturate" values="0" result="bwBumps" />
            <feBlend in="SourceGraphic" in2="bwBumps" mode="soft-light" />
          </filter>

        </defs>

        <g id="model" className={[
          'animate-breathe origin-bottom',
          heavyArousal ? 'anim-arousal-shiver' : '',
          stats.health < stats.maxHealth * 0.15 ? 'anim-hurt-flinch' : '',
        ].filter(Boolean).join(' ')}>

           {/* --- TAIL (behind body for Khajiit/Argonian) --- */}
           {hasTail && (
             <g id="tail" opacity="0.9" className="anim-tail-wag" style={{ transformOrigin: '105px 290px' }}>
               {isKhajiit ? (
                 <path d={`M 105 290 Q 140 310 150 350 Q 155 380 145 400`}
                   fill="none" stroke={colors.base} strokeWidth="5" strokeLinecap="round" />
               ) : (
                 <path d={`M 105 290 Q 135 305 140 340 Q 142 365 135 385`}
                   fill="none" stroke={colors.base} strokeWidth="7" strokeLinecap="round" />
               )}
               {/* Tail shadow */}
               <path d={isKhajiit
                 ? `M 106 292 Q 142 312 152 352 Q 157 382 147 402`
                 : `M 106 292 Q 137 307 142 342 Q 144 367 137 387`}
                 fill="none" stroke={colors.deepShadow} strokeWidth="3" strokeLinecap="round" opacity="0.4" filter="url(#blur-sm)" />
             </g>
           )}

           {/* --- ARMS (with SSS and detailed anatomy) --- */}
           {/* Left Arm */}
           <g id="arm-l" filter="url(#sss-filter)">
              {/* Shoulder/Deltoid with muscle contour */}
              {/* Arm silhouette — gender-variant width and bicep shape */}
               <path d={
                 isFemale
                   ? "M 68 112 C 52 112, 30 148, 32 182 C 33 202, 36 216, 40 224 L 50 222 C 50 210, 52 196, 52 180 C 54 152, 62 124, 72 118 Z"
                   : "M 66 112 C 48 112, 26 148, 28 182 C 29 202, 32 218, 36 226 L 48 224 C 48 210, 50 196, 50 180 C 52 150, 60 122, 70 118 Z"
               } fill="url(#arm-l)" filter="url(#skin-texture)" />
              {/* Deltoid highlight (round muscle) */}
              <circle cx="56" cy="128" r="13" fill={colors.highLight} opacity="0.25" filter="url(#blur-md)" />
              {/* Deltoid separation line */}
              <path d="M 52 115 Q 48 130 42 148" stroke={colors.shadow} strokeWidth="1" fill="none" opacity="0.35" filter="url(#blur-xs)" />
              {/* Bicep highlight */}
              <ellipse cx="44" cy="165" rx="6" ry="14" fill={colors.highLight} opacity="0.15" filter="url(#blur-sm)" />
              {/* Tricep shadow */}
              <path d="M 36 145 Q 32 165 36 185" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.25" filter="url(#blur-sm)" />
              {/* Elbow crease */}
              <path d="M 37 175 Q 42 182 47 175" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.5" />
              {/* Elbow bone */}
              <ellipse cx="35" cy="178" rx="2" ry="3" fill={colors.highLight} opacity="0.25" />
              {/* Forearm tendon lines */}
              <path d="M 42 185 Q 41 200 42 215" stroke={colors.shadow} strokeWidth="0.8" fill="none" opacity="0.3" filter="url(#blur-xs)" />
              <path d="M 45 185 Q 44 200 44 215" stroke={colors.shadow} strokeWidth="0.5" fill="none" opacity="0.2" />
              {/* Wrist bones (ulna/radius) */}
              <ellipse cx="41" cy="217" rx="3" ry="2" fill={colors.highLight} opacity="0.35" />
              <ellipse cx="44" cy="218" rx="2" ry="1.5" fill={colors.highLight} opacity="0.25" />
              {/* Inner wrist vein hint */}
              <path d="M 43 210 Q 42 215 43 220" stroke="#6688AA" strokeWidth="0.5" fill="none" opacity="0.2" />
              {/* Left Hand - detailed */}
              <g id="hand-l" transform="translate(35, 218)">
                {/* Palm */}
                <ellipse cx="7" cy="5" rx="7" ry="6" fill="url(#hand-grad)" filter="url(#skin-texture)" />
                {/* Palm crease lines */}
                <path d="M 2 3 Q 7 6 12 4" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.3" />
                <path d="M 1 6 Q 5 8 10 6" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.25" />
                {/* Thumb with joints */}
                <path d="M 13 3 Q 17 0 18 4 Q 18 8 14 7" fill={colors.base} stroke={colors.shadow} strokeWidth="0.5" />
                <path d="M 15 2 Q 16 3 15 4" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.4" />
                <ellipse cx="17" cy="3" rx="1.5" ry="1" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Index finger */}
                <path d="M 3 10 Q 2 15 2 17 Q 2 19 3 19" stroke={colors.base} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 2.5 14 Q 3 14.5 3.5 14" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.5" />
                <ellipse cx="2.5" cy="18.5" rx="1.3" ry="0.8" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Middle finger */}
                <path d="M 6 10 Q 5 16 5 19 Q 5 21 6 21" stroke={colors.base} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 5.5 15 Q 6 15.5 6.5 15" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.5" />
                <ellipse cx="5.5" cy="20.5" rx="1.3" ry="0.8" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Ring finger */}
                <path d="M 9 10 Q 9 16 9 18 Q 9 20 10 20" stroke={colors.base} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 8.5 15 Q 9 15.5 9.5 15" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.5" />
                <ellipse cx="9.5" cy="19.5" rx="1.2" ry="0.7" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Pinky */}
                <path d="M 12 9 Q 13 14 13 16 Q 13 18 13 18" stroke={colors.base} strokeWidth="2" strokeLinecap="round" fill="none" />
                <ellipse cx="13" cy="17.5" rx="1" ry="0.6" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Knuckle highlights */}
                <circle cx="3" cy="10" r="1.2" fill={colors.highLight} opacity="0.35" />
                <circle cx="6" cy="10" r="1.2" fill={colors.highLight} opacity="0.35" />
                <circle cx="9" cy="10" r="1.2" fill={colors.highLight} opacity="0.35" />
                <circle cx="12" cy="9" r="1" fill={colors.highLight} opacity="0.3" />
                {/* Fingertip pads (subtle shadow) */}
                <circle cx="3" cy="18" r="1" fill={colors.shadow} opacity="0.15" />
                <circle cx="5.5" cy="20" r="1" fill={colors.shadow} opacity="0.15" />
                <circle cx="9.5" cy="19" r="1" fill={colors.shadow} opacity="0.15" />
              </g>
           </g>

           {/* Right Arm */}
           <g id="arm-r" filter="url(#sss-filter)">
              <path d={
                 isFemale
                   ? "M 132 112 C 148 112, 170 148, 168 182 C 167 202, 164 216, 160 224 L 150 222 C 150 210, 148 196, 148 180 C 146 152, 138 124, 128 118 Z"
                   : "M 134 112 C 152 112, 174 148, 172 182 C 171 202, 168 218, 164 226 L 152 224 C 152 210, 150 196, 150 180 C 148 150, 140 122, 130 118 Z"
               } fill="url(#arm-r)" filter="url(#skin-texture)" />
              {/* Deltoid highlight */}
              <circle cx="144" cy="128" r="13" fill={colors.highLight} opacity="0.25" filter="url(#blur-md)" />
              {/* Deltoid separation */}
              <path d="M 148 115 Q 152 130 158 148" stroke={colors.shadow} strokeWidth="1" fill="none" opacity="0.35" filter="url(#blur-xs)" />
              {/* Bicep highlight */}
              <ellipse cx="156" cy="165" rx="6" ry="14" fill={colors.highLight} opacity="0.15" filter="url(#blur-sm)" />
              {/* Tricep shadow */}
              <path d="M 164 145 Q 168 165 164 185" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.25" filter="url(#blur-sm)" />
              {/* Elbow crease */}
              <path d="M 153 175 Q 158 182 163 175" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.5" />
              {/* Elbow bone */}
              <ellipse cx="165" cy="178" rx="2" ry="3" fill={colors.highLight} opacity="0.25" />
              {/* Forearm tendon lines */}
              <path d="M 158 185 Q 159 200 158 215" stroke={colors.shadow} strokeWidth="0.8" fill="none" opacity="0.3" filter="url(#blur-xs)" />
              <path d="M 155 185 Q 156 200 156 215" stroke={colors.shadow} strokeWidth="0.5" fill="none" opacity="0.2" />
              {/* Wrist bones */}
              <ellipse cx="159" cy="217" rx="3" ry="2" fill={colors.highLight} opacity="0.35" />
              <ellipse cx="156" cy="218" rx="2" ry="1.5" fill={colors.highLight} opacity="0.25" />
              {/* Inner wrist vein */}
              <path d="M 157 210 Q 158 215 157 220" stroke="#6688AA" strokeWidth="0.5" fill="none" opacity="0.2" />
              {/* Right Hand - detailed */}
              <g id="hand-r" transform="translate(151, 218)">
                <ellipse cx="7" cy="5" rx="7" ry="6" fill="url(#hand-grad)" filter="url(#skin-texture)" />
                {/* Palm crease lines */}
                <path d="M 2 4 Q 7 6 12 3" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.3" />
                <path d="M 4 6 Q 8 8 12 6" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.25" />
                {/* Thumb */}
                <path d="M 1 3 Q -3 0 -4 4 Q -4 8 0 7" fill={colors.base} stroke={colors.shadow} strokeWidth="0.5" />
                <path d="M -1 2 Q -2 3 -1 4" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.4" />
                <ellipse cx="-3" cy="3" rx="1.5" ry="1" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Index */}
                <path d="M 2 10 Q 1 15 1 17 Q 1 19 2 19" stroke={colors.base} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 1.5 14 Q 2 14.5 2.5 14" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.5" />
                <ellipse cx="1.5" cy="18.5" rx="1.3" ry="0.8" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Middle */}
                <path d="M 5 10 Q 5 16 5 19 Q 5 21 6 21" stroke={colors.base} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 4.5 15 Q 5 15.5 5.5 15" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.5" />
                <ellipse cx="5.5" cy="20.5" rx="1.3" ry="0.8" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Ring */}
                <path d="M 8 10 Q 9 16 9 18 Q 9 20 9 20" stroke={colors.base} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 8 15 Q 8.5 15.5 9 15" stroke={colors.shadow} strokeWidth="0.3" fill="none" opacity="0.5" />
                <ellipse cx="9" cy="19.5" rx="1.2" ry="0.7" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Pinky */}
                <path d="M 11 9 Q 12 14 12 16 Q 12 18 12 18" stroke={colors.base} strokeWidth="2" strokeLinecap="round" fill="none" />
                <ellipse cx="12" cy="17.5" rx="1" ry="0.6" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.2" />
                {/* Knuckle highlights */}
                <circle cx="2" cy="10" r="1.2" fill={colors.highLight} opacity="0.35" />
                <circle cx="5" cy="10" r="1.2" fill={colors.highLight} opacity="0.35" />
                <circle cx="8" cy="10" r="1.2" fill={colors.highLight} opacity="0.35" />
                <circle cx="11" cy="9" r="1" fill={colors.highLight} opacity="0.3" />
                {/* Fingertip pads */}
                <circle cx="1.5" cy="18" r="1" fill={colors.shadow} opacity="0.15" />
                <circle cx="5.5" cy="20" r="1" fill={colors.shadow} opacity="0.15" />
                <circle cx="9" cy="19" r="1" fill={colors.shadow} opacity="0.15" />
              </g>
           </g>

           {/* --- HEAD & NECK --- */}
           <g id="head" className="origin-[100px_100px]" filter="url(#sss-filter)">
              {/* Neck Cylinder */}
              {/* Neck — tapered: slightly wider at chin, narrower at collar */}
              <path
                d={isFemale
                  ? "M 87 80 Q 88 100 89 120 L 111 120 Q 112 100 113 80 Z"
                  : "M 85 80 Q 86 100 87 120 L 113 120 Q 114 100 115 80 Z"}
                fill="url(#neck)" filter="url(#skin-texture)" />
              {/* Sternocleidomastoid muscles */}
              <path d="M 88 80 Q 94 100 96 120" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />
              <path d="M 112 80 Q 106 100 104 120" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />
              {/* Chin Drop Shadow on Neck */}
              <path d="M 88 80 Q 100 100 112 80 Z" fill={colors.deepShadow} opacity="0.6" filter="url(#blur-sm)" />

              {/* Jaw & Cheeks */}
              <path d="M 64 50 Q 64 80 84 96 Q 100 104 116 96 Q 136 80 136 50 Z" fill={colors.base} filter="url(#skin-texture)" />
              {/* Jawline shadow */}
              <path d="M 64 50 Q 64 80 84 96 Q 100 104 116 96 Q 136 80 136 50" stroke={colors.shadow} strokeWidth="6" fill="none" opacity="0.5" filter="url(#blur-md)" />
              {/* Cheekbone Highlights */}
              <ellipse cx="76" cy="65" rx="8" ry="4" fill={colors.highLight} opacity="0.4" filter="url(#blur-sm)" transform="rotate(-15 76 65)" />
              <ellipse cx="124" cy="65" rx="8" ry="4" fill={colors.highLight} opacity="0.4" filter="url(#blur-sm)" transform="rotate(15 124 65)" />

              {/* Forehead & Cranium */}
              <path d="M 64 50 C 64 -10, 136 -10, 136 50 Z" fill="url(#head-grad)" filter="url(#skin-texture)" />
              <ellipse cx="100" cy="20" rx="20" ry="10" fill={colors.highLight} opacity="0.3" filter="url(#blur-md)" />

              {/* High-Fidelity Nose */}
              {/* Bridge Shadow */}
              <path d="M 94 45 Q 96 65 92 75 M 106 45 Q 104 65 108 75" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />
              {/* Bridge Highlight */}
              <path d="M 100 45 L 100 70" stroke={colors.highLight} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#blur-sm)" />
              {/* Tip */}
              <circle cx="100" cy="74" r="4" fill={colors.midHighlight} opacity="0.8" filter="url(#blur-sm)" />
              {/* Nostrils */}
              <path d="M 92 75 Q 96 80 100 78 Q 104 80 108 75" stroke={colors.deepShadow} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
              <circle cx="94" cy="76" r="1.5" fill={colors.deepShadow} />
              <circle cx="106" cy="76" r="1.5" fill={colors.deepShadow} />

              {/* High-Fidelity Lips */}
              {/* Philtrum (groove above lip) */}
              <path d="M 98 80 Q 100 84 102 80" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />

              {/* ── HYPER-REALISTIC LIPS ── */}
              {/* Lip base with gradient */}
              <path d={mouthPath} fill="url(#lip-grad)" stroke="#3A1010" strokeWidth="0.8" strokeLinecap="round" />
              {/* Upper lip vermillion border */}
              <path d={mouthPath} stroke={colors.shadow} strokeWidth="0.5" fill="none" opacity="0.4" />
              {/* Cupid's bow highlight */}
              <path d="M 96 86 Q 100 84 104 86" stroke={colors.highLight} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
              {/* Lower lip volume highlight */}
              <path d="M 92 92 Q 100 97 108 92" stroke={colors.highLight} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#blur-xs)" />
              {/* Lip crease center */}
              <path d="M 96 88 Q 100 86 104 88" stroke={colors.deepShadow} strokeWidth="0.5" fill="none" opacity="0.3" />
              {/* Lip moisture shine */}
              <ellipse cx="100" cy="90" rx="4" ry="2" fill={colors.highLight} opacity="0.15" filter="url(#blur-xs)" />

              {/* ── HYPER-REALISTIC EYES ── */}
              <g className={`${isCrying ? 'opacity-70' : 'opacity-100'}`}>
                 {/* Sclera Base with natural gradient */}
                 <path d={eyeShape} fill="url(#sclera-l)" />
                 <path d={eyeShapeR} fill="url(#sclera-r)" />

                 {/* Sclera blood vessel hints */}
                 <g clipPath="url(#left-eye-clip)">
                    <clipPath id="left-eye-clip"><path d={eyeShape} /></clipPath>
                    <path d="M 63 54 Q 65 53 67 55" stroke="#CC8888" strokeWidth="0.3" fill="none" opacity="0.25" />
                    <path d="M 64 56 Q 66 55 68 56" stroke="#CC8888" strokeWidth="0.2" fill="none" opacity="0.2" />
                    {/* Lid shadow occlusion */}
                    <path d="M 62 54 Q 74 44 86 54" fill={colors.shadow} opacity="0.15" />
                    {/* Limbal Ring */}
                    <circle cx="74" cy="56" r="7.5" stroke="#1a1a1a" strokeWidth="0.8" fill="none" opacity="0.7" />
                    {/* Iris with radial gradient */}
                    <circle cx="74" cy="56" r="6.8" fill="url(#iris-l)" />
                    {/* Iris fiber detail */}
                    <g opacity="0.2">
                      <line x1="74" y1="49" x2="74" y2="54" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="71" y1="50" x2="72" y2="54" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="77" y1="50" x2="76" y2="54" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="69" y1="52" x2="71" y2="55" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="79" y1="52" x2="77" y2="55" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="69" y1="58" x2="71" y2="57" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="79" y1="58" x2="77" y2="57" stroke={colors.highLight} strokeWidth="0.3" />
                    </g>
                    {/* Pupil (slitted for Khajiit/Argonian) */}
                    {(isKhajiit || isArgonian) ? (
                      <ellipse cx="74" cy="56" rx={pupilSize * 0.55} ry={pupilSize * 2.1} fill="#000" />
                    ) : (
                      <circle cx="74" cy="56" r={pupilSize * 1.6} fill="#000" />
                    )}
                    {/* Hard Catchlight */}
                    <circle cx="72" cy="53.5" r="1.9" fill="#FFF" opacity="0.95" />
                    <circle cx="76" cy="58.5" r="0.8" fill="#FFF" opacity="0.6" />
                    <path d="M 71 52 Q 73 51 75 52" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.3" />
                    {/* Half-lid overlay for arousal / exhaustion */}
                    {lidOverlayL && (
                      <path d={lidOverlayL} fill={colors.base} opacity="0.78" />
                    )}
                 </g>

                 {/* Tear Duct (left) */}
                 <circle cx="85" cy="56.5" r="1.2" fill="#CC7777" opacity="0.7" />

                 <g clipPath="url(#right-eye-clip)">
                    <clipPath id="right-eye-clip"><path d={eyeShapeR} /></clipPath>
                    <path d="M 137 54 Q 135 53 133 55" stroke="#CC8888" strokeWidth="0.3" fill="none" opacity="0.25" />
                    <path d="M 138 54 Q 126 44 114 54" fill={colors.shadow} opacity="0.15" />
                    <circle cx="126" cy="56" r="7.5" stroke="#1a1a1a" strokeWidth="0.8" fill="none" opacity="0.7" />
                    <circle cx="126" cy="56" r="6.8" fill="url(#iris-r)" />
                    <g opacity="0.2">
                      <line x1="126" y1="49" x2="126" y2="54" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="123" y1="50" x2="124" y2="54" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="129" y1="50" x2="128" y2="54" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="121" y1="52" x2="123" y2="55" stroke={colors.highLight} strokeWidth="0.3" />
                      <line x1="131" y1="52" x2="129" y2="55" stroke={colors.highLight} strokeWidth="0.3" />
                    </g>
                    {(isKhajiit || isArgonian) ? (
                      <ellipse cx="126" cy="56" rx={pupilSize * 0.55} ry={pupilSize * 2.1} fill="#000" />
                    ) : (
                      <circle cx="126" cy="56" r={pupilSize * 1.6} fill="#000" />
                    )}
                    <circle cx="124" cy="53.5" r="1.9" fill="#FFF" opacity="0.95" />
                    <circle cx="128" cy="58.5" r="0.8" fill="#FFF" opacity="0.6" />
                    <path d="M 123 52 Q 125 51 127 52" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.3" />
                    {lidOverlayR && (
                      <path d={lidOverlayR} fill={colors.base} opacity="0.78" />
                    )}
                 </g>

                 {/* Tear Duct (right) */}
                 <circle cx="115" cy="56.5" r="1.2" fill="#CC7777" opacity="0.7" />

                 {/* Lid crease shadow */}
                 <path d="M 60 48 Q 74 38 88 48" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur-sm)" />
                 <path d="M 140 48 Q 126 38 112 48" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur-sm)" />
                 {/* Upper Eyelid line (dynamic per expression) */}
                 <path d={lidArcL} stroke="#1a0a0a" strokeWidth="2.5" strokeLinecap="round" fill="none" className="anim-eye-blink" style={{ transformOrigin: `${EYE_L_CX}px ${EYE_L_CY}px` }} />
                 <path d={lidArcR} stroke="#1a0a0a" strokeWidth="2.5" strokeLinecap="round" fill="none" className="anim-eye-blink" style={{ transformOrigin: `${EYE_R_CX}px ${EYE_R_CY}px`, animationDelay: '0.05s' }} />
                 {/* Eyelashes (varied lengths, now slightly longer) */}
                 <path d="M 62 53 L 58 46 M 65 50 L 62 43 M 68 48 L 66 41 M 72 47 L 72 39 M 76 48 L 77 41 M 80 50 L 82 44" stroke="#0a0505" strokeWidth="0.9" fill="none" />
                 <path d="M 138 53 L 142 46 M 135 50 L 138 43 M 132 48 L 134 41 M 128 47 L 128 39 M 124 48 L 123 41 M 120 50 L 118 44" stroke="#0a0505" strokeWidth="0.9" fill="none" />
                 {/* Lower lash line */}
                 <path d="M 64 60 Q 74 64 84 60" stroke="#2a1010" strokeWidth="0.8" fill="none" opacity="0.6" />
                 <path d="M 136 60 Q 126 64 116 60" stroke="#2a1010" strokeWidth="0.8" fill="none" opacity="0.6" />
                 {/* Eye bag shadow */}
                 <path d="M 63 61 Q 74 68 85 61" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.35" filter="url(#blur-sm)" />
                 <path d="M 137 61 Q 126 68 115 61" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.35" filter="url(#blur-sm)" />
                 {/* Lower lid water line */}
                 <path d="M 64 59.5 Q 74 63 84 59.5" stroke={colors.highLight} strokeWidth="0.5" fill="none" opacity="0.3" />
                 <path d="M 136 59.5 Q 126 63 116 59.5" stroke={colors.highLight} strokeWidth="0.5" fill="none" opacity="0.3" />
              </g>

              {/* Eyebrows (Dynamic & Detailed) */}
              {/* Shadow under brow */}
              <path d={leftBrow} stroke={colors.shadow} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#blur-sm)" transform="translate(0, 2)" />
              <path d={rightBrow} stroke={colors.shadow} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#blur-sm)" transform="translate(0, 2)" />

              {/* Actual Brow Hair (Thick stroke + thin strokes) */}
              <path d={leftBrow} stroke={colors.hairBase} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d={leftBrow} stroke={colors.hairShadow} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />

              <path d={rightBrow} stroke={colors.hairBase} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d={rightBrow} stroke={colors.hairShadow} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />

              {/* --- EARS (side of head, behind hair) --- */}
              {hasPointedEars ? (
                <>
                  {/* Elven pointed ears */}
                  <path d="M 60 50 Q 48 30 42 20 Q 50 35 60 45" fill={colors.base} stroke={colors.shadow} strokeWidth="1" />
                  <path d="M 48 30 Q 52 38 56 42" fill="url(#ear-inner)" opacity="0.6" />
                  <path d="M 140 50 Q 152 30 158 20 Q 150 35 140 45" fill={colors.base} stroke={colors.shadow} strokeWidth="1" />
                  <path d="M 152 30 Q 148 38 144 42" fill="url(#ear-inner)" opacity="0.6" />
                </>
              ) : hasFinEars ? (
                <>
                  {/* Argonian fin-ears */}
                  <path d="M 60 48 Q 42 38 38 30 Q 44 42 58 48" fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" />
                  <path d="M 56 44 Q 44 38 42 34" stroke={colors.midHighlight} strokeWidth="0.5" fill="none" opacity="0.5" />
                  <path d="M 140 48 Q 158 38 162 30 Q 156 42 142 48" fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" />
                  <path d="M 144 44 Q 156 38 158 34" stroke={colors.midHighlight} strokeWidth="0.5" fill="none" opacity="0.5" />
                </>
              ) : !hasCatEars ? (
                <>
                  {/* Human/Orc/Nord rounded ears */}
                  <ellipse cx="60" cy="55" rx="5" ry="10" fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" />
                  <ellipse cx="60" cy="55" rx="3" ry="7" fill="url(#ear-inner)" opacity="0.5" />
                  <ellipse cx="140" cy="55" rx="5" ry="10" fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" />
                  <ellipse cx="140" cy="55" rx="3" ry="7" fill="url(#ear-inner)" opacity="0.5" />
                </>
              ) : null}

              {/* --- TUSKS (Orc, rendered at face level) --- */}
              {hasTusks && (
                <>
                  <path d="M 88 96 Q 86 88 84 82" stroke="#D3D3D3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 88 96 Q 86 88 84 82" stroke={colors.highLight} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                  <path d="M 112 96 Q 114 88 116 82" stroke="#D3D3D3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 112 96 Q 114 88 116 82" stroke={colors.highLight} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                </>
              )}

              {/* --- WHISKER MARKINGS (Khajiit) --- */}
              {hasWhiskers && (
                <>
                  {/* Facial stripe markings – characteristic tabby pattern */}
                  <g opacity="0.22">
                    {/* Forehead stripes */}
                    <path d="M 94 28 Q 96 22 96 18" stroke={colors.hairBase} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <path d="M 100 24 Q 100 18 100 14" stroke={colors.hairBase} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <path d="M 106 28 Q 104 22 104 18" stroke={colors.hairBase} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    {/* Cheek dashes */}
                    <path d="M 70 60 Q 73 58 78 56" stroke={colors.hairBase} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M 72 65 Q 75 63 80 62" stroke={colors.hairBase} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M 130 60 Q 127 58 122 56" stroke={colors.hairBase} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M 128 65 Q 125 63 120 62" stroke={colors.hairBase} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  </g>
                  {/* Whiskers */}
                  <g opacity="0.6" className="anim-whisker-twitch" style={{ transformOrigin: '100px 76px' }}>
                    <line x1="70" y1="72" x2="46" y2="67" stroke={colors.hairBase} strokeWidth="0.9" />
                    <line x1="70" y1="76" x2="44" y2="76" stroke={colors.hairBase} strokeWidth="0.9" />
                    <line x1="70" y1="80" x2="46" y2="85" stroke={colors.hairBase} strokeWidth="0.9" />
                    <line x1="130" y1="72" x2="154" y2="67" stroke={colors.hairBase} strokeWidth="0.9" />
                    <line x1="130" y1="76" x2="156" y2="76" stroke={colors.hairBase} strokeWidth="0.9" />
                    <line x1="130" y1="80" x2="154" y2="85" stroke={colors.hairBase} strokeWidth="0.9" />
                  </g>
                </>
              )}

           </g>

           {/* --- HAIR (rendered on top of head, after head group closes) --- */}
           <g id="hair" className="anim-hair-sway" style={{ transformOrigin: '100px 0px' }}>
             {isFemale ? (
               <>
                 {/* ── BACK HAIR (drawn first, behind everything) ── */}
                 <path d="M 58 22 C 46 50, 42 100, 42 152 C 42 168, 46 175, 50 170 C 49 142, 50 90, 56 50 Q 58 32, 62 24 Z"
                   fill={colors.hairShadow} opacity="0.92" />
                 <path d="M 142 22 C 154 50, 158 100, 158 152 C 158 168, 154 175, 150 170 C 151 142, 150 90, 144 50 Q 142 32, 138 24 Z"
                   fill={colors.hairShadow} opacity="0.92" />
                 {/* Back hair inner layer */}
                 <path d="M 62 24 Q 52 60 52 110 Q 52 140 55 155 L 58 152 Q 55 128 56 90 Q 58 52 64 28 Z"
                   fill={colors.hairShadow} opacity="0.55" />
                 <path d="M 138 24 Q 148 60 148 110 Q 148 140 145 155 L 142 152 Q 145 128 144 90 Q 142 52 136 28 Z"
                   fill={colors.hairShadow} opacity="0.55" />

                 {/* ── MAIN HAIR CAP ── */}
                 <path d="M 62 24 C 58 -6, 76 -26, 100 -24 C 124 -26, 142 -6, 138 24 C 134 34, 128 30, 120 26 C 112 22, 108 20, 100 20 C 92 20, 88 22, 80 26 C 72 30, 66 34, 62 24 Z"
                   fill="url(#hair-grad)" />
                 {/* Shine strip along crown */}
                 <path d="M 78 -15 C 86 -24, 100 -27, 116 -21"
                   stroke={colors.highLight} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.28" filter="url(#blur-xs)" />

                 {/* ── LEFT FRAMING LOCK ── */}
                 <path d="M 62 24 C 56 36, 52 60, 54 86 Q 54 98, 58 94 C 57 80, 57 54, 62 36 Z"
                   fill="url(#hair-grad)" />
                 {/* Shadow strand on left lock */}
                 <path d="M 59 40 C 57 58, 56 76, 58 90 Q 59 96, 60 94 Q 59 76, 62 55 Z"
                   fill={colors.hairShadow} opacity="0.6" />
                 {/* Inner left strand */}
                 <path d="M 65 26 C 63 44, 65 66, 68 82 Q 69 88, 70 86 C 69 70, 68 46, 68 30 Z"
                   fill={colors.hairShadow} opacity="0.42" />

                 {/* ── RIGHT FRAMING LOCK ── */}
                 <path d="M 138 24 C 144 36, 148 60, 146 86 Q 146 98, 142 94 C 143 80, 143 54, 138 36 Z"
                   fill="url(#hair-grad)" />
                 {/* Shadow strand on right lock */}
                 <path d="M 141 40 C 143 58, 144 76, 142 90 Q 141 96, 140 94 Q 141 76, 138 55 Z"
                   fill={colors.hairShadow} opacity="0.6" />
                 {/* Inner right strand */}
                 <path d="M 135 26 C 137 44, 135 66, 132 82 Q 131 88, 130 86 C 131 70, 132 46, 132 30 Z"
                   fill={colors.hairShadow} opacity="0.42" />

                 {/* ── STRAND TEXTURE LINES ── */}
                 <path d="M 72 -12 Q 82 -22 94 -19"  stroke={colors.hairShadow} strokeWidth="1.3" fill="none" opacity="0.55" />
                 <path d="M 100 -23 Q 112 -25 122 -17" stroke={colors.hairShadow} strokeWidth="1.1" fill="none" opacity="0.48" />
                 <path d="M 86 -22 Q 95 -27 104 -24"  stroke={colors.hairShadow} strokeWidth="0.9" fill="none" opacity="0.4" />
                 <path d="M 118 -19 Q 126 -21 132 -13" stroke={colors.hairShadow} strokeWidth="0.8" fill="none" opacity="0.35" />
                 {/* Edge highlight on crown */}
                 <path d="M 67 10 Q 80 0 100 -2 Q 120 0 133 10"
                   stroke={colors.highLight} strokeWidth="1" fill="none" opacity="0.18" filter="url(#blur-xs)" />
               </>
             ) : (
               <>
                 {/* ── SHORT MASCULINE HAIR ── */}
                 {/* Back / undercut layer */}
                 <path d="M 62 26 C 58 12, 66 -4, 78 -8 Q 100 -12 122 -8 C 134 -4, 142 12, 138 26 L 136 30 Q 126 16, 100 14 Q 74 16, 64 30 Z"
                   fill={colors.hairShadow} opacity="0.85" />
                 {/* Main cap */}
                 <path d="M 62 26 C 58 0, 72 -20, 100 -19 C 128 -20, 142 0, 138 26 L 136 30 Q 126 14, 100 12 Q 74 14, 64 30 Z"
                   fill="url(#hair-grad)" />
                 {/* Hair shine */}
                 <path d="M 62 26 C 58 0, 72 -20, 100 -19 C 128 -20, 142 0, 138 26 L 136 30 Q 126 14, 100 12 Q 74 14, 64 30 Z"
                   fill="url(#hair-shine)" />
                 {/* Crown highlight arc */}
                 <path d="M 78 -8 C 86 -17, 100 -20, 116 -14"
                   stroke={colors.highLight} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.25" filter="url(#blur-xs)" />
                 {/* Direction / texture strokes */}
                 <path d="M 72 -4 Q 80 -14 92 -12"  stroke={colors.hairShadow} strokeWidth="1.3" fill="none" opacity="0.5" />
                 <path d="M 100 -17 Q 110 -19 120 -12" stroke={colors.hairShadow} strokeWidth="1.1" fill="none" opacity="0.45" />
                 <path d="M 88 -15 Q 96 -20 104 -17"  stroke={colors.hairShadow} strokeWidth="0.9" fill="none" opacity="0.38" />
                 {/* Temple fade lines */}
                 <path d="M 63 28 Q 66 22 70 18"  stroke={colors.hairShadow} strokeWidth="1" fill="none" opacity="0.4" />
                 <path d="M 137 28 Q 134 22 130 18" stroke={colors.hairShadow} strokeWidth="1" fill="none" opacity="0.4" />
               </>
             )}
             {/* ── KHAJIIT: chest-ruff mane (rendered alongside crown hair) ── */}
             {isKhajiit && (
               <>
                 {/* Mane ruff – left */}
                 <path d="M 54 28 C 48 42, 44 62, 46 82 Q 47 92, 50 88 C 50 68, 50 48, 56 34 Z"
                   fill={colors.hairBase} opacity="0.72" />
                 <path d="M 58 32 C 55 50, 54 70, 56 86 Q 57 90, 58 88 Q 57 70, 60 50 Z"
                   fill={colors.hairShadow} opacity="0.55" />
                 {/* Mane ruff – right */}
                 <path d="M 146 28 C 152 42, 156 62, 154 82 Q 153 92, 150 88 C 150 68, 150 48, 144 34 Z"
                   fill={colors.hairBase} opacity="0.72" />
                 <path d="M 142 32 C 145 50, 146 70, 144 86 Q 143 90, 142 88 Q 143 70, 140 50 Z"
                   fill={colors.hairShadow} opacity="0.55" />
                 {/* Individual fur strands on mane */}
                 {Array.from({ length: 4 }, (_, i) => (
                   <path key={`mane-l-${i}`}
                     d={`M ${52+i*2} ${36+i*8} Q ${48+i} ${44+i*8} ${50+i*2} ${52+i*8}`}
                     stroke={colors.hairShadow} strokeWidth="0.8" fill="none" opacity="0.5" />
                 ))}
                 {Array.from({ length: 4 }, (_, i) => (
                   <path key={`mane-r-${i}`}
                     d={`M ${148-i*2} ${36+i*8} Q ${152-i} ${44+i*8} ${150-i*2} ${52+i*8}`}
                     stroke={colors.hairShadow} strokeWidth="0.8" fill="none" opacity="0.5" />
                 ))}
               </>
             )}
             {/* ── ARGONIAN: multi-fin head crest ── */}
             {isArgonian && (
               <g id="argonian-crest">
                 {/* Crest spine 1 – tallest, central */}
                 <path d="M 100 -10 Q 96 -28 94 -38 Q 96 -26 100 -12 Q 104 -26 106 -38 Q 104 -28 100 -10"
                   fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" opacity="0.9" />
                 {/* Crest spine 2 – left */}
                 <path d="M 88 -8 Q 84 -22 83 -30 Q 85 -20 88 -10"
                   fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" opacity="0.85" />
                 {/* Crest spine 3 – right */}
                 <path d="M 112 -8 Q 116 -22 117 -30 Q 115 -20 112 -10"
                   fill={colors.base} stroke={colors.shadow} strokeWidth="0.8" opacity="0.85" />
                 {/* Small flanking spines */}
                 <path d="M 80 -4 Q 78 -14 78 -20 Q 80 -12 80 -6"
                   fill={colors.shadow} stroke={colors.deepShadow} strokeWidth="0.6" opacity="0.7" />
                 <path d="M 120 -4 Q 122 -14 122 -20 Q 120 -12 120 -6"
                   fill={colors.shadow} stroke={colors.deepShadow} strokeWidth="0.6" opacity="0.7" />
                 {/* Connecting web between crest spines */}
                 <path d="M 80 -4 Q 88 -10 94 -14 Q 100 -16 106 -14 Q 112 -10 120 -4"
                   fill={colors.shadow} opacity="0.3" stroke="none" />
                 {/* Highlight on central spine */}
                 <path d="M 100 -12 Q 101 -22 101 -30"
                   stroke={colors.midHighlight} strokeWidth="0.5" fill="none" opacity="0.4" />
               </g>
             )}
           </g>

           {/* --- RACE FEATURES ON TOP OF HAIR (cat ears, horns) --- */}
           {hasCatEars && (
             <g id="cat-ears">
               {/* Left cat ear */}
               <path d="M 72 10 L 62 -20 L 80 0 Z" fill={colors.base} stroke={colors.shadow} strokeWidth="1" />
               <path d="M 68 5 L 64 -12 L 76 2 Z" fill={colors.deepShadow} opacity="0.5" />
               <path d="M 70 6 L 64 -14 L 77 1 Z" fill="#C88A8A" opacity="0.4" />
               {/* Right cat ear */}
               <path d="M 128 10 L 138 -20 L 120 0 Z" fill={colors.base} stroke={colors.shadow} strokeWidth="1" />
               <path d="M 132 5 L 136 -12 L 124 2 Z" fill={colors.deepShadow} opacity="0.5" />
               <path d="M 130 6 L 136 -14 L 123 1 Z" fill="#C88A8A" opacity="0.4" />
             </g>
           )}
           {hasHorns && (
             <g id="horns">
               <path d="M 72 5 Q 60 -15 55 -25" stroke={colors.horn || '#655340'} strokeWidth="4" strokeLinecap="round" fill="none" />
               <path d="M 72 5 Q 60 -15 55 -25" stroke={colors.highLight} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
               <path d="M 128 5 Q 140 -15 145 -25" stroke={colors.horn || '#655340'} strokeWidth="4" strokeLinecap="round" fill="none" />
               <path d="M 128 5 Q 140 -15 145 -25" stroke={colors.highLight} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
             </g>
           )}

           {/* --- LEGS --- */}
           {isFemale ? (
             <g id="legs-f" filter="url(#sss-filter)">
                 {/* Left Leg — wide thigh (~22px), S-shaped silhouette */}
                 <path d={
                   "M 90 285 " +
                   "C 82 308, 70 335, 70 360 " +
                   "C 70 385, 74 404, 78 415 " +
                   "C 78 432, 76 450, 80 470 " +
                   "C 80 482, 82 490, 84 492 " +
                   "L 92 492 " +
                   "C 92 488, 92 480, 94 470 " +
                   "C 94 450, 92 432, 92 415 " +
                   "C 92 404, 92 385, 92 360 " +
                   "C 92 335, 90 308, 90 285 Z"
                 } fill="url(#leg-l)" filter="url(#skin-texture)" />

                 {/* Right Leg — mirror */}
                 <path d={
                   "M 110 285 " +
                   "C 118 308, 130 335, 130 360 " +
                   "C 130 385, 126 404, 122 415 " +
                   "C 122 432, 124 450, 120 470 " +
                   "C 120 482, 118 490, 116 492 " +
                   "L 108 492 " +
                   "C 108 488, 108 480, 106 470 " +
                   "C 106 450, 108 432, 108 415 " +
                   "C 108 404, 108 385, 108 360 " +
                   "C 108 335, 110 308, 110 285 Z"
                 } fill="url(#leg-r)" filter="url(#skin-texture)" />

                 {/* Outer thigh / hip highlights */}
                 <ellipse cx="72" cy="332" rx="5" ry="15" fill={colors.highLight} opacity="0.12" filter="url(#blur-md)" />
                 <ellipse cx="128" cy="332" rx="5" ry="15" fill={colors.highLight} opacity="0.12" filter="url(#blur-md)" />

                 {/* Knee highlights */}
                 <ellipse cx="80" cy="408" rx="6" ry="7" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                 <path d="M 77 413 Q 80 418 84 413" stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                 <ellipse cx="120" cy="408" rx="6" ry="7" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                 <path d="M 116 413 Q 120 418 124 413" stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                 {/* Inner thigh shadows (thigh gap) */}
                 <path d="M 90 292 C 90 318, 91 345, 92 375" stroke={colors.deepShadow} strokeWidth="3.5" fill="none" opacity="0.42" filter="url(#blur-md)" />
                 <path d="M 110 292 C 110 318, 109 345, 108 375" stroke={colors.deepShadow} strokeWidth="3.5" fill="none" opacity="0.42" filter="url(#blur-md)" />

                 {/* Ankle highlights */}
                 <ellipse cx="82" cy="480" rx="4" ry="2" fill={colors.highLight} opacity="0.32" />
                 <ellipse cx="118" cy="480" rx="4" ry="2" fill={colors.highLight} opacity="0.32" />

                 {/* Calf muscle highlight */}
                 <ellipse cx="78" cy="444" rx="4" ry="12" fill={colors.highLight} opacity="0.15" filter="url(#blur-sm)" />
                 <ellipse cx="122" cy="444" rx="4" ry="12" fill={colors.highLight} opacity="0.15" filter="url(#blur-sm)" />

                 {/* Outer hip/glute contour */}
                 <ellipse cx="68" cy="312" rx="5" ry="20" fill={colors.midHighlight} opacity="0.18" filter="url(#blur-md)" transform="rotate(-6 68 312)" />
                 <ellipse cx="132" cy="312" rx="5" ry="20" fill={colors.midHighlight} opacity="0.18" filter="url(#blur-md)" transform="rotate(6 132 312)" />
              </g>
           ) : (
             <g id="legs-m" filter="url(#sss-filter)">
                 {/* Male Left Leg — muscular, wider thighs, prominent calf bulge */}
                 <path d={
                   "M 92 285 " +
                   "C 84 308, 72 332, 72 358 " +
                   "C 72 384, 76 404, 80 415 " +
                   "C 80 432, 76 450, 78 468 " +
                   "C 78 480, 82 490, 84 492 " +
                   "L 94 492 " +
                   "C 96 490, 96 480, 96 468 " +
                   "C 94 450, 94 432, 94 415 " +
                   "C 94 404, 94 384, 94 360 " +
                   "C 94 335, 92 308, 92 285 Z"
                 } fill="url(#leg-l)" filter="url(#skin-texture)" />

                 {/* Male Right Leg — mirror */}
                 <path d={
                   "M 108 285 " +
                   "C 116 308, 128 332, 128 358 " +
                   "C 128 384, 124 404, 120 415 " +
                   "C 120 432, 124 450, 122 468 " +
                   "C 122 480, 118 490, 116 492 " +
                   "L 106 492 " +
                   "C 104 490, 104 480, 104 468 " +
                   "C 106 450, 106 432, 106 415 " +
                   "C 106 404, 106 384, 106 360 " +
                   "C 106 335, 108 308, 108 285 Z"
                 } fill="url(#leg-r)" filter="url(#skin-texture)" />

                 {/* Quad definition lines */}
                 <path d="M 88 310 Q 82 345, 84 375" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                 <path d="M 112 310 Q 118 345, 116 375" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                 {/* Knees */}
                 <ellipse cx="80" cy="410" rx="6" ry="7" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                 <path d="M 76 415 Q 80 420 84 415" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                 <ellipse cx="120" cy="410" rx="6" ry="7" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                 <path d="M 116 415 Q 120 420 124 415" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                 {/* Calf muscle highlight */}
                 <ellipse cx="77" cy="442" rx="4" ry="12" fill={colors.highLight} opacity="0.18" filter="url(#blur-sm)" />
                 <ellipse cx="123" cy="442" rx="4" ry="12" fill={colors.highLight} opacity="0.18" filter="url(#blur-sm)" />

                 {/* Ankle definition */}
                 <ellipse cx="82" cy="478" rx="4" ry="2" fill={colors.highLight} opacity="0.3" />
                 <ellipse cx="118" cy="478" rx="4" ry="2" fill={colors.highLight} opacity="0.3" />

                 {/* Inner thigh shadow */}
                 <path d="M 92 292 C 92 320, 93 348, 94 375" stroke={colors.deepShadow} strokeWidth="2.5" fill="none" opacity="0.38" filter="url(#blur-md)" />
                 <path d="M 108 292 C 108 320, 107 348, 106 375" stroke={colors.deepShadow} strokeWidth="2.5" fill="none" opacity="0.38" filter="url(#blur-md)" />
              </g>
           )}

           {/* --- FEET (anatomically detailed) --- */}
           <g id="feet" filter="url(#sss-filter)">
             {/* Left Foot */}
             <path d={isFemale
               ? "M 84 492 Q 82 498 78 500 L 94 500 Q 96 496 92 492 Z"
               : "M 80 492 Q 78 498 74 500 L 96 500 Q 98 496 95 492 Z"}
               fill="url(#foot-grad)" filter="url(#skin-texture)" />
             {/* Ankle bone (lateral malleolus) */}
             <ellipse cx={isFemale ? 84 : 82} cy={490} rx="2.5" ry="2" fill={colors.highLight} opacity="0.4" />
             <ellipse cx={isFemale ? 90 : 92} cy={491} rx="2" ry="1.5" fill={colors.highLight} opacity="0.25" />
             {/* Achilles tendon */}
             <path d={isFemale
               ? "M 88 484 Q 87 488 86 492"
               : "M 86 484 Q 85 488 84 492"}
               stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.3" />
             {/* Toe lines */}
             <path d={isFemale
               ? "M 80 499 L 80 500 M 83 499 L 83 500 M 86 499 L 86 500 M 89 499 L 89 500 M 91 499 L 91 500"
               : "M 76 499 L 76 500 M 80 499 L 80 500 M 84 499 L 84 500 M 88 499 L 88 500 M 92 499 L 92 500"}
               stroke={colors.deepShadow} strokeWidth="0.6" fill="none" opacity="0.4" />
             {/* Toenails */}
             {[0,1,2,3,4].map(i => (
               <ellipse key={`tnl-${i}`} cx={(isFemale ? 80 : 76) + i * (isFemale ? 3 : 4)} cy={498.5} rx={i === 0 ? 1.5 : 1} ry="0.6" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.15" opacity="0.7" />
             ))}
             {/* Arch shadow */}
             <path d={isFemale
               ? "M 84 498 Q 86 496 90 498"
               : "M 80 498 Q 84 496 90 498"}
               stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.25" filter="url(#blur-xs)" />

             {/* Right Foot */}
             <path d={isFemale
               ? "M 108 492 Q 106 498 106 500 L 120 500 Q 120 496 116 492 Z"
               : "M 105 492 Q 104 498 104 500 L 124 500 Q 122 496 118 492 Z"}
               fill="url(#foot-grad)" filter="url(#skin-texture)" />
             {/* Ankle bone */}
             <ellipse cx={isFemale ? 116 : 118} cy={490} rx="2.5" ry="2" fill={colors.highLight} opacity="0.4" />
             <ellipse cx={isFemale ? 110 : 108} cy={491} rx="2" ry="1.5" fill={colors.highLight} opacity="0.25" />
             {/* Achilles */}
             <path d={isFemale
               ? "M 112 484 Q 113 488 114 492"
               : "M 114 484 Q 115 488 116 492"}
               stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.3" />
             {/* Toe lines */}
             <path d={isFemale
               ? "M 108 499 L 108 500 M 111 499 L 111 500 M 114 499 L 114 500 M 117 499 L 117 500 M 119 499 L 119 500"
               : "M 106 499 L 106 500 M 110 499 L 110 500 M 114 499 L 114 500 M 118 499 L 118 500 M 122 499 L 122 500"}
               stroke={colors.deepShadow} strokeWidth="0.6" fill="none" opacity="0.4" />
             {/* Toenails */}
             {[0,1,2,3,4].map(i => (
               <ellipse key={`tnr-${i}`} cx={(isFemale ? 108 : 106) + i * (isFemale ? 3 : 4)} cy={498.5} rx={i === 0 ? 1.5 : 1} ry="0.6" fill="url(#nail-grad)" stroke={colors.shadow} strokeWidth="0.15" opacity="0.7" />
             ))}
             {/* Arch shadow */}
             <path d={isFemale
               ? "M 110 498 Q 114 496 118 498"
               : "M 108 498 Q 114 496 120 498"}
               stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.25" filter="url(#blur-xs)" />
           </g>

           {/* --- TORSO --- */}
           {isFemale ? (
             <g id="torso-f" filter="url(#sss-filter)">
                {/* Main Trunk */}
                {/* Female torso — hourglass S-curve */}
            <path d={
              "M 68 112 " +
              "C 68 138, 72 162, 74 186 " +
              "C 74 204, 76 218, 76 232 " +
              "C 74 252, 68 264, 66 274 " +
              "C 66 282, 74 290, 86 292 " +
              "L 114 292 " +
              "C 126 290, 134 282, 134 274 " +
              "C 132 264, 126 252, 124 232 " +
              "C 124 218, 126 204, 126 186 " +
              "C 128 162, 132 138, 132 112 Z"
            } fill="url(#torso-f)" filter="url(#skin-texture)" />

                {/* Clavicles */}
                <path d="M 74 125 Q 85 135 97 130" stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 74 123 Q 85 133 97 128" stroke={colors.highLight} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                <path d="M 126 125 Q 115 135 103 130" stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 126 123 Q 115 133 103 128" stroke={colors.highLight} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                {/* Sternal Notch */}
                <path d="M 97 128 Q 100 135 103 128" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                {/* Abs & Obliques (Soft) */}
                <path d="M 100 180 L 100 260" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur-sm)" />
                <path d="M 78 220 Q 88 230 96 225" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.2" filter="url(#blur-sm)" />
                <path d="M 122 220 Q 112 230 104 225" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.2" filter="url(#blur-sm)" />
                {/* Waist definition – hourglass shadow */}
                <path d="M 68 195 Q 72 215 74 235" stroke={colors.deepShadow} strokeWidth="3.5" fill="none" opacity="0.32" filter="url(#blur-md)" />
                <path d="M 132 195 Q 128 215 126 235" stroke={colors.deepShadow} strokeWidth="3.5" fill="none" opacity="0.32" filter="url(#blur-md)" />
                <ellipse cx="72" cy="260" rx="7" ry="14" fill={colors.midHighlight} opacity="0.2" filter="url(#blur-md)" transform="rotate(-10 72 260)" />
                <ellipse cx="128" cy="260" rx="7" ry="14" fill={colors.midHighlight} opacity="0.2" filter="url(#blur-md)" transform="rotate(10 128 260)" />
                <path d="M 68 198 Q 66 220 70 248" stroke={colors.highLight} strokeWidth="1.2" fill="none" opacity="0.22" filter="url(#blur-sm)" />
                <path d="M 132 198 Q 134 220 130 248" stroke={colors.highLight} strokeWidth="1.2" fill="none" opacity="0.22" filter="url(#blur-sm)" />
                <circle cx="100" cy="250" r="2.5" fill={colors.deepShadow} opacity="0.5" filter="url(#blur-sm)" />

                {/* Navel Highlight */}
                <path d="M 98 252 Q 100 254 102 252" stroke={colors.highLight} strokeWidth="1" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                {/* Pelvic V / Iliac Crest */}
                <path d="M 72 260 Q 85 275 96 270" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 128 260 Q 115 275 104 270" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                {/* High-Fidelity Breasts */}
                {/* Left Breast */}
                <g>
                  {/* Teardrop-oval breast — gravity-lowered center, slightly taller */}
                   <ellipse cx="82" cy="164" rx="19" ry="22" fill="url(#breast-l)" />
                  {/* Underboob ambient occlusion */}
                  <path d="M 63 162 C 63 192, 98 192, 101 162" stroke={colors.deepShadow} strokeWidth="4" fill="none" opacity="0.5" filter="url(#blur-md)" />
                  {/* Areola & Nipple (Only if naked, but keeping anatomical for DoL logic) */}
                  <circle cx="80" cy="163" r="4" fill={colors.deepShadow} opacity="0.4" filter="url(#blur-sm)" />
                  <circle cx="80" cy="163" r="1" fill={colors.deepShadow} opacity="0.6" />
                  <circle cx="79" cy="162" r="0.5" fill={colors.highLight} opacity="0.5" />
                </g>

                {/* Right Breast */}
                <g>
                  <ellipse cx="118" cy="164" rx="19" ry="22" fill="url(#breast-r)" />
                  <path d="M 99 162 C 102 192, 137 192, 137 162" stroke={colors.deepShadow} strokeWidth="4" fill="none" opacity="0.5" filter="url(#blur-md)" />
                  <circle cx="120" cy="163" r="4" fill={colors.deepShadow} opacity="0.4" filter="url(#blur-sm)" />
                  <circle cx="120" cy="163" r="1" fill={colors.deepShadow} opacity="0.6" />
                  <circle cx="119" cy="162" r="0.5" fill={colors.highLight} opacity="0.5" />
                </g>

                {/* Cleavage drop shadow */}
                <path d="M 100 150 Q 100 170 100 180" stroke={colors.deepShadow} strokeWidth="5" fill="none" opacity="0.4" filter="url(#blur-md)" />

             </g>
           ) : (
             <g id="torso-m" filter="url(#sss-filter)">
                {/* Main Trunk (V-Taper) */}
                {/* Male torso — V-taper */}
            <path d={
              "M 64 110 " +
              "C 64 138, 66 162, 72 186 " +
              "C 76 204, 78 218, 78 232 " +
              "C 78 250, 80 264, 80 276 " +
              "C 81 284, 86 290, 90 292 " +
              "L 110 292 " +
              "C 114 290, 119 284, 120 276 " +
              "C 120 264, 122 250, 122 232 " +
              "C 122 218, 124 204, 128 186 " +
              "C 134 162, 136 138, 136 110 Z"
            } fill="url(#torso-m)" filter="url(#skin-texture)" />

                {/* Clavicles (Sharper) */}
                <path d="M 66 122 Q 85 130 96 125" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />
                <path d="M 66 119 Q 85 127 96 122" stroke={colors.highLight} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                <path d="M 134 122 Q 115 130 104 125" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />
                <path d="M 134 119 Q 115 127 104 122" stroke={colors.highLight} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />
                <path d="M 96 125 Q 100 135 104 125" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />

                {/* Pectorals */}
                <path d="M 69 135 Q 85 160 98 155 L 98 140 Z" fill={colors.shadow} opacity="0.3" filter="url(#blur-md)" />
                <path d="M 131 135 Q 115 160 102 155 L 102 140 Z" fill={colors.shadow} opacity="0.3" filter="url(#blur-md)" />

                <path d="M 70 155 Q 85 165 98 158" stroke={colors.deepShadow} strokeWidth="3" fill="none" opacity="0.4" filter="url(#blur-md)" />
                <path d="M 130 155 Q 115 165 102 158" stroke={colors.deepShadow} strokeWidth="3" fill="none" opacity="0.4" filter="url(#blur-md)" />

                {/* Nipples */}
                <circle cx="82" cy="150" r="2.5" fill={colors.deepShadow} opacity="0.5" filter="url(#blur-sm)" />
                <circle cx="118" cy="150" r="2.5" fill={colors.deepShadow} opacity="0.5" filter="url(#blur-sm)" />

                {/* Abs (6-pack definition) */}
                <path d="M 100 155 L 100 260" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                {/* Horizontal Ab lines */}
                <path d="M 88 180 Q 100 185 112 180" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur-sm)" />
                <path d="M 86 205 Q 100 210 114 205" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur-sm)" />
                <path d="M 85 230 Q 100 235 115 230" stroke={colors.deepShadow} strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur-sm)" />

                {/* Serratus Anterior / Ribs */}
                <path d="M 72 165 L 80 170 M 74 185 L 82 190 M 76 205 L 84 210" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 128 165 L 120 170 M 126 185 L 118 190 M 124 205 L 116 210" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                <circle cx="100" cy="250" r="2.5" fill={colors.deepShadow} opacity="0.6" filter="url(#blur-sm)" />

                {/* Pelvic V / Adonis Belt */}
                <path d="M 76 250 L 96 275" stroke={colors.deepShadow} strokeWidth="3" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 124 250 L 104 275" stroke={colors.deepShadow} strokeWidth="3" fill="none" opacity="0.4" filter="url(#blur-sm)" />
             </g>
           )}


           {/* --- CLOTHING LAYERS (High Fidelity) --- */}
           {clothing.under_lower && (
              <g mask={clothing.under_lower.integrity / clothing.under_lower.maxIntegrity < 0.5 ? "url(#heavy-tear-mask)" : "none"}>
                 <path d={isFemale ? "M 72 300 Q 100 310, 128 300 L 120 340 Q 100 330, 80 340 Z" : "M 76 300 Q 100 310, 124 300 L 120 340 Q 100 330, 80 340 Z"} fill="#D1C288" />
                 <path d="M 100 306 L 100 330" stroke="#9A803B" strokeWidth="2" fill="none" opacity="0.5" />
                 {/* Shadows */}
                 <path d="M 74 300 Q 100 310, 126 300 L 126 310 Q 100 320, 74 310 Z" fill="#000" opacity="0.2" filter="url(#blur-sm)" />
              </g>
           )}

           {renderClothing(clothing.lower, 'lower')}
           {renderClothing(clothing.upper, 'upper')}

           {clothing.over && (
              <g mask={clothing.over.integrity / clothing.over.maxIntegrity < 0.5 ? "url(#heavy-tear-mask)" : "none"}>
                 <path d="M 30 100 Q 100 90, 170 100 L 180 400 Q 100 440, 20 400 Z" fill={`url(#cloth-grad-${clothing.over.id})`} opacity="0.95" />
                 <path d="M 50 100 Q 60 240, 40 390 M 150 100 Q 140 240, 160 390" stroke={clothingColors[clothing.over.id]?.deepShadow || '#000'} strokeWidth="4" fill="none" opacity="0.6" filter="url(#blur-sm)" />
                 <path d="M 48 100 Q 58 240, 38 390 M 148 100 Q 138 240, 158 390" stroke={clothingColors[clothing.over.id]?.highlight || '#FFF'} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />
              </g>
           )}

           {/* --- X-RAY OVERLAY --- */}
           {xrayMode && (
             <>
               {/* Dark x-ray film tint (multiply blend darkens skin/clothing) */}
               <rect x="0" y="-30" width="200" height="540" fill="#00050E" opacity="0.72"
                 style={{ mixBlendMode: 'multiply' as const }} />

               {/* Luminescent skeleton + organs (screen blend = neon glow on dark) */}
               <g id="xray" className="pointer-events-none" style={{ mixBlendMode: 'screen' as const }}>
                 <XRayContent stats={stats} isFemale={isFemale} />
               </g>
             </>
           )}

           {/* --- AMBIENT OCCLUSION SHADOWS --- */}
           <g id="ambient-occlusion" opacity="0.35">
             {/* Armpit shadows */}
             <ellipse cx="68" cy="140" rx="6" ry="10" fill={colors.deepShadow} filter="url(#blur-md)" />
             <ellipse cx="132" cy="140" rx="6" ry="10" fill={colors.deepShadow} filter="url(#blur-md)" />
             {/* Hip crease shadows */}
             <path d="M 80 275 Q 90 285 100 280" stroke={colors.deepShadow} strokeWidth="3" fill="none" filter="url(#blur-md)" />
             <path d="M 120 275 Q 110 285 100 280" stroke={colors.deepShadow} strokeWidth="3" fill="none" filter="url(#blur-md)" />
             {/* Neck-shoulder junction */}
             <path d="M 72 108 Q 80 115 88 110" stroke={colors.deepShadow} strokeWidth="4" fill="none" filter="url(#blur-md)" />
             <path d="M 128 108 Q 120 115 112 110" stroke={colors.deepShadow} strokeWidth="4" fill="none" filter="url(#blur-md)" />
           </g>

           {/* --- RACE-SPECIFIC BODY TEXTURE --- */}
           {isArgonian && (
             <g id="scale-overlay" opacity="0.2">
               {/* Scale pattern on torso */}
               <rect x="70" y="120" width="60" height="170" fill="url(#scale-pattern)" rx="10" />
               {/* Larger belly scales */}
               {[150, 170, 190, 210, 230, 250].map((sy, i) => (
                 <path key={`bs-${i}`} d={`M ${85 + (i % 2) * 5} ${sy} Q 100 ${sy + 4} ${115 - (i % 2) * 5} ${sy}`}
                   stroke={colors.midHighlight} strokeWidth="0.5" fill="none" opacity="0.3" />
               ))}
               {/* Scale pattern on limbs */}
               <rect x="30" y="130" width="20" height="90" fill="url(#scale-pattern)" />
               <rect x="150" y="130" width="20" height="90" fill="url(#scale-pattern)" />
               <rect x="75" y="290" width="20" height="180" fill="url(#scale-pattern)" />
               <rect x="105" y="290" width="20" height="180" fill="url(#scale-pattern)" />
             </g>
           )}
           {isKhajiit && (
             <g id="fur-overlay" opacity="0.15">
               {/* Fur stripe pattern on torso */}
               <rect x="70" y="120" width="60" height="170" fill="url(#fur-stripe)" rx="10" />
               {/* Fur stripe on limbs */}
               <rect x="30" y="130" width="20" height="90" fill="url(#fur-stripe)" />
               <rect x="150" y="130" width="20" height="90" fill="url(#fur-stripe)" />
               <rect x="75" y="290" width="20" height="180" fill="url(#fur-stripe)" />
               <rect x="105" y="290" width="20" height="180" fill="url(#fur-stripe)" />
               {/* Chest tuft/ruff */}
               <g opacity="0.3">
                 <path d="M 80 128 Q 90 135 85 145" stroke={colors.hairBase} strokeWidth="1.5" fill="none" />
                 <path d="M 120 128 Q 110 135 115 145" stroke={colors.hairBase} strokeWidth="1.5" fill="none" />
                 <path d="M 85 130 Q 95 138 90 148" stroke={colors.hairBase} strokeWidth="1" fill="none" />
                 <path d="M 115 130 Q 105 138 110 148" stroke={colors.hairBase} strokeWidth="1" fill="none" />
               </g>
             </g>
           )}

           {/* --- SKIN VEIN HINTS (visible on lighter skin/thin areas) --- */}
           {!isArgonian && !isKhajiit && (
             <g id="vein-hints" opacity="0.08">
               {/* Wrist veins */}
               <path d="M 40 205 Q 42 210 41 218" stroke="#6688AA" strokeWidth="0.5" fill="none" />
               <path d="M 160 205 Q 158 210 159 218" stroke="#6688AA" strokeWidth="0.5" fill="none" />
               {/* Inner elbow */}
               <path d="M 42 170 Q 40 175 43 180" stroke="#6688AA" strokeWidth="0.4" fill="none" />
               <path d="M 158 170 Q 160 175 157 180" stroke="#6688AA" strokeWidth="0.4" fill="none" />
               {/* Temple veins */}
               <path d="M 64 35 Q 62 40 63 48" stroke="#7799BB" strokeWidth="0.3" fill="none" />
               <path d="M 136 35 Q 138 40 137 48" stroke="#7799BB" strokeWidth="0.3" fill="none" />
             </g>
           )}

           {/* --- BODY RIM LIGHT (enhanced dual-edge) --- */}
           <g id="rim-body" opacity="0.25" style={{ mixBlendMode: 'screen' }}>
             {isFemale ? (
               <>
                 {/* Left rim (main light) */}
                 <path d="M 72 115 C 55 180, 65 250, 75 280 C 85 290, 90 290, 95 290"
                   stroke={colors.highLight} strokeWidth="2.5" fill="none" filter="url(#blur-sm)" />
                 {/* Right rim (fill light, dimmer) */}
                 <path d="M 128 115 C 145 180, 135 250, 125 280 C 115 290, 110 290, 105 290"
                   stroke={colors.highLight} strokeWidth="1" fill="none" filter="url(#blur-sm)" opacity="0.4" />
                 {/* Leg rim lights */}
                 <path d="M 80 300 Q 78 380 78 480" stroke={colors.highLight} strokeWidth="1.5" fill="none" filter="url(#blur-sm)" />
                 <path d="M 120 300 Q 122 380 122 480" stroke={colors.highLight} strokeWidth="1" fill="none" filter="url(#blur-sm)" opacity="0.4" />
               </>
             ) : (
               <>
                 <path d="M 64 115 C 68 180, 75 250, 80 280 C 85 290, 90 290, 95 290"
                   stroke={colors.highLight} strokeWidth="2.5" fill="none" filter="url(#blur-sm)" />
                 <path d="M 136 115 C 132 180, 125 250, 120 280 C 115 290, 110 290, 105 290"
                   stroke={colors.highLight} strokeWidth="1" fill="none" filter="url(#blur-sm)" opacity="0.4" />
                 <path d="M 84 300 Q 82 380 83 480" stroke={colors.highLight} strokeWidth="1.5" fill="none" filter="url(#blur-sm)" />
                 <path d="M 116 300 Q 118 380 117 480" stroke={colors.highLight} strokeWidth="1" fill="none" filter="url(#blur-sm)" opacity="0.4" />
               </>
             )}
           </g>

           {/* --- GOOSEBUMP OVERLAY (cold/stress/arousal) --- */}
           {(stats.stress > stats.maxStress * 0.8 || stats.arousal > stats.maxArousal * 0.6) && (
             <g id="goosebumps" opacity="0.06">
               {/* Scattered bumps on exposed skin */}
               {[...Array(20)].map((_, i) => {
                 const bx = 65 + (i * 17) % 70;
                 const by = 120 + (i * 23) % 360;
                 return <circle key={`gb-${i}`} cx={bx} cy={by} r="0.5" fill={colors.highLight} />;
               })}
             </g>
           )}

           {/* --- EMOTIONAL STATE OVERLAYS --- */}
           {/* ── BLUSH (4-zone: cheeks / ears / nose / chest) ── */}
           {isBlushing && (
             <g id="blush">
               {/* Cheek left */}
               <ellipse cx="72" cy="72" rx="11" ry="7" fill={blushColor} filter="url(#blur-md)" opacity={heavyBlush ? 0.65 : 0.38} />
               {/* Cheek right */}
               <ellipse cx="128" cy="72" rx="11" ry="7" fill={blushColor} filter="url(#blur-md)" opacity={heavyBlush ? 0.65 : 0.38} />
               {/* Nose blush */}
               <ellipse cx="100" cy="74" rx="5" ry="3.5" fill={blushColor} filter="url(#blur-md)" opacity={heavyBlush ? 0.55 : 0.28} />
               {/* Ear tips */}
               <ellipse cx="60" cy="52" rx="4" ry="3" fill={blushColor} filter="url(#blur-sm)" opacity={heavyBlush ? 0.45 : 0.22} />
               <ellipse cx="140" cy="52" rx="4" ry="3" fill={blushColor} filter="url(#blur-sm)" opacity={heavyBlush ? 0.45 : 0.22} />
               {/* Chest flush when very aroused */}
               {heavyBlush && isFemale && (
                 <ellipse cx="100" cy="152" rx="28" ry="18" fill={blushColor} filter="url(#blur-lg)" opacity="0.28" />
               )}
               {/* Forehead dot hint for Khajiit */}
               {isKhajiit && (
                 <ellipse cx="100" cy="34" rx="6" ry="3" fill={blushColor} filter="url(#blur-sm)" opacity={heavyBlush ? 0.35 : 0.16} />
               )}
             </g>
           )}

           {/* ── TEARS ── */}
           {isCrying && (
             <g id="tears">
               {/* Stream paths – slightly curved, natural */}
               <path d="M 73 65 Q 70 78 68 95" stroke="#88CCFF" strokeWidth="1.8" fill="none" opacity={heavyTears ? 0.75 : 0.45} strokeLinecap="round" />
               <path d="M 127 65 Q 130 78 132 95" stroke="#88CCFF" strokeWidth="1.8" fill="none" opacity={heavyTears ? 0.75 : 0.45} strokeLinecap="round" />
               {/* Teardrop bead on left cheek */}
               <ellipse cx="68" cy="86" rx="1.6" ry="2" fill="#88CCFF" opacity="0.7"
                 className="animate-[tearFall_2s_ease-in-out_infinite]" />
               {heavyTears && (
                 <>
                   {/* Second stream */}
                   <path d="M 76 67 Q 74 80 73 94" stroke="#88CCFF" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
                   <path d="M 124 67 Q 126 80 127 94" stroke="#88CCFF" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
                   {/* Falling drops */}
                   <ellipse cx="132" cy="82" rx="1.6" ry="2" fill="#88CCFF" opacity="0.7"
                     className="animate-[tearFall_2.5s_ease-in-out_infinite_0.5s]" />
                   {/* Reddened lower eyelid */}
                   <ellipse cx="74" cy="62" rx="8" ry="4" fill="#CC6666" opacity="0.3" filter="url(#blur-sm)" />
                   <ellipse cx="126" cy="62" rx="8" ry="4" fill="#CC6666" opacity="0.3" filter="url(#blur-sm)" />
                   {/* Tear sheen under eye */}
                   <path d="M 65 63 Q 74 68 83 63" stroke="#AADDFF" strokeWidth="1.2" fill="none" opacity="0.35" />
                   <path d="M 117 63 Q 126 68 135 63" stroke="#AADDFF" strokeWidth="1.2" fill="none" opacity="0.35" />
                 </>
               )}
             </g>
           )}

           {/* ── SWEAT ── */}
           {isSweating && (
             <g id="sweat" opacity={heavySweat ? 0.75 : 0.45}>
               {/* Forehead beads */}
               <circle cx="80" cy="24" r="1.1" fill="#88DDFF" className="anim-sweat-drip" />
               <circle cx="92" cy="19" r="0.9" fill="#88DDFF" className="anim-sweat-drip-delay" />
               <circle cx="108" cy="19" r="0.9" fill="#88DDFF" style={{ animationDelay: '1.2s' }} className="anim-sweat-drip" />
               {/* Temple drips */}
               <path d="M 66 42 Q 64 50 66 58" stroke="#88DDFF" strokeWidth="1.2" fill="none" />
               <path d="M 134 42 Q 136 50 134 58" stroke="#88DDFF" strokeWidth="1.2" fill="none" />
               {heavySweat && (
                 <>
                   {/* Chest sheen */}
                   <ellipse cx="100" cy="162" rx="22" ry="32" fill={colors.highLight} opacity="0.12" filter="url(#blur-md)" />
                   {/* Side-torso drips */}
                   <circle cx="74" cy="180" r="1" fill="#88DDFF" opacity="0.55" className="anim-sweat-drip" />
                   <circle cx="126" cy="200" r="0.9" fill="#88DDFF" opacity="0.5" className="anim-sweat-drip-delay" />
                   {/* Arm drip */}
                   <path d="M 42 200 Q 40 210 41 222" stroke="#88DDFF" strokeWidth="1" fill="none" opacity="0.5" />
                 </>
               )}
             </g>
           )}

           {/* Bruises */}
           {isBruised && (
             <g id="bruises" opacity={isBleeding ? 0.7 : 0.5}>
               <ellipse cx="78" cy="170" rx="8" ry="5" fill="#664488" filter="url(#blur-sm)" transform="rotate(-10 78 170)" />
               <ellipse cx="115" cy="230" rx="6" ry="8" fill="#554477" filter="url(#blur-sm)" transform="rotate(15 115 230)" />
               <ellipse cx="90" cy="350" rx="7" ry="5" fill="#553366" filter="url(#blur-sm)" />
               {isBleeding && (
                 <>
                   <path d="M 80 168 L 76 172" stroke="#880000" strokeWidth="1.5" strokeLinecap="round" />
                   <path d="M 117 228 L 113 232" stroke="#880000" strokeWidth="1.5" strokeLinecap="round" />
                   <path d="M 78 172 Q 77 180 78 186" stroke="#880000" strokeWidth="1" fill="none" opacity="0.6" />
                 </>
               )}
             </g>
           )}

           {/* Corruption veins */}
           {isCorrupted && (
             <g id="corruption-veins" className="anim-corruption-pulse">
               <path d="M 90 130 Q 85 160 88 190 Q 90 220 85 250" stroke="#6B21A8" strokeWidth="1" fill="none" />
               <path d="M 110 130 Q 115 160 112 190 Q 110 220 115 250" stroke="#6B21A8" strokeWidth="1" fill="none" />
               <path d="M 95 140 Q 92 150 96 160" stroke="#7C3AED" strokeWidth="0.8" fill="none" />
               <path d="M 105 140 Q 108 150 104 160" stroke="#7C3AED" strokeWidth="0.8" fill="none" />
             </g>
           )}
        </g>
      </svg>
    </div>
  );
};
