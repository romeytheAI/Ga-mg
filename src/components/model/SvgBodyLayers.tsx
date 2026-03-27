import React from 'react';
import { useGameStore, ClothingItem, PlayableRace, PlayerState } from '../../store/gameStore';
import { raceColors, clothingColors } from './colors';

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

  // Eyes (Lids and Shape)
  let eyeShape = "M 62 62 Q 74 52 86 62 Q 74 70 62 62";
  let eyeShapeR = "M 138 62 Q 126 52 114 62 Q 126 70 138 62";
  let pupilSize = 4;

  if (stats.stress > stats.maxStress * 0.7) {
    eyeShape = "M 62 64 Q 74 58 86 64 Q 74 68 62 64";
    eyeShapeR = "M 138 64 Q 126 58 114 64 Q 126 68 138 64";
    pupilSize = 3;
  } else if (stats.trauma > stats.maxTrauma * 0.7 || stats.arousal > stats.maxArousal * 0.8) {
    eyeShape = "M 62 62 Q 74 48 86 62 Q 74 74 62 62";
    eyeShapeR = "M 138 62 Q 126 48 114 62 Q 126 74 138 62";
    pupilSize = 5;
  }
  if (isCorrupted) pupilSize = 6;

  // Mouth
  let mouthPath = "M 88 96 Q 100 100 112 96";
  if (stats.health < stats.maxHealth * 0.3) mouthPath = "M 88 96 Q 100 88 112 96";
  else if (stats.arousal > stats.maxArousal * 0.8) mouthPath = "M 92 96 Q 100 108 108 96";
  else if (stats.stress > stats.maxStress * 0.7) mouthPath = "M 84 96 Q 100 98 116 96";




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

          <radialGradient id="xray-bg" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
             <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* --- HIGH FIDELITY GRADIENTS --- */}

          {/* Torso Cylinder/Sphere Mapping */}
          <radialGradient id="torso-f" cx="50%" cy="40%" r="70%" fx="50%" fy="30%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="30%" stopColor={colors.base} />
            <stop offset="70%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          <radialGradient id="torso-m" cx="50%" cy="30%" r="80%" fx="50%" fy="20%">
            <stop offset="0%" stopColor={colors.midHighlight} />
            <stop offset="40%" stopColor={colors.base} />
            <stop offset="80%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          {/* Breast Sphere Mapping (Extremely 3D) */}
          <radialGradient id="breast-l" cx="45%" cy="40%" r="60%" fx="35%" fy="35%">
            <stop offset="0%" stopColor={colors.highLight} />
            <stop offset="15%" stopColor={colors.midHighlight} />
            <stop offset="45%" stopColor={colors.base} />
            <stop offset="85%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>
          <radialGradient id="breast-r" cx="55%" cy="40%" r="60%" fx="65%" fy="35%">
            <stop offset="0%" stopColor={colors.highLight} />
            <stop offset="15%" stopColor={colors.midHighlight} />
            <stop offset="45%" stopColor={colors.base} />
            <stop offset="85%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </radialGradient>

          {/* Limb Cylinders */}
          <linearGradient id="arm-l" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.base} />
            <stop offset="30%" stopColor={colors.midHighlight} />
            <stop offset="70%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          <linearGradient id="arm-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.base} />
            <stop offset="30%" stopColor={colors.midHighlight} />
            <stop offset="70%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          <linearGradient id="leg-l" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.shadow} />
            <stop offset="20%" stopColor={colors.base} />
            <stop offset="60%" stopColor={colors.midHighlight} />
            <stop offset="90%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          <linearGradient id="leg-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.shadow} />
            <stop offset="20%" stopColor={colors.base} />
            <stop offset="60%" stopColor={colors.midHighlight} />
            <stop offset="90%" stopColor={colors.shadow} />
            <stop offset="100%" stopColor={colors.deepShadow} />
          </linearGradient>

          {/* Neck Cylinder with chin shadow */}
          <linearGradient id="neck" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="20%" stopColor={colors.shadow} />
            <stop offset="70%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.midHighlight} />
          </linearGradient>

          <linearGradient id="neck-curve" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.deepShadow} />
            <stop offset="20%" stopColor={colors.base} />
            <stop offset="80%" stopColor={colors.base} />
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

        </defs>

        <g id="model" className="animate-breathe origin-bottom">

           {/* --- ARMS --- */}
           {/* Left Arm */}
           <g id="arm-l">
              {/* Shoulder/Deltoid */}
              <path d="M 64 110 C 30 110, 30 150, 40 220 L 45 220 C 40 160, 50 140, 72 135 Z" fill="url(#arm-l)" />
              <circle cx="56" cy="130" r="12" fill={colors.highLight} opacity="0.3" filter="url(#blur-md)" />
           </g>

           {/* Right Arm */}
           <g id="arm-r">
              <path d="M 136 110 C 170 110, 170 150, 160 220 L 155 220 C 160 160, 150 140, 128 135 Z" fill="url(#arm-r)" />
              <circle cx="144" cy="130" r="12" fill={colors.highLight} opacity="0.3" filter="url(#blur-md)" />
           </g>

           {/* --- HEAD & NECK --- */}
           <g id="head" className="origin-[100px_100px]">
              {/* Neck Cylinder */}
              <rect x="88" y="80" width="24" height="40" fill="url(#neck)" />
              {/* Sternocleidomastoid muscles */}
              <path d="M 88 80 Q 94 100 96 120" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />
              <path d="M 112 80 Q 106 100 104 120" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />
              {/* Chin Drop Shadow on Neck */}
              <path d="M 88 80 Q 100 100 112 80 Z" fill={colors.deepShadow} opacity="0.6" filter="url(#blur-sm)" />

              {/* Jaw & Cheeks */}
              <path d="M 64 50 Q 64 80 84 96 Q 100 104 116 96 Q 136 80 136 50 Z" fill={colors.base} />
              {/* Jawline shadow */}
              <path d="M 64 50 Q 64 80 84 96 Q 100 104 116 96 Q 136 80 136 50" stroke={colors.shadow} strokeWidth="6" fill="none" opacity="0.5" filter="url(#blur-md)" />
              {/* Cheekbone Highlights */}
              <ellipse cx="76" cy="65" rx="8" ry="4" fill={colors.highLight} opacity="0.4" filter="url(#blur-sm)" transform="rotate(-15 76 65)" />
              <ellipse cx="124" cy="65" rx="8" ry="4" fill={colors.highLight} opacity="0.4" filter="url(#blur-sm)" transform="rotate(15 124 65)" />

              {/* Forehead & Cranium */}
              <path d="M 64 50 C 64 -10, 136 -10, 136 50 Z" fill="url(#head-grad)" />
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

              {/* Lips Base */}
              <path d={mouthPath} fill="#D96666" stroke="#5A1A1A" strokeWidth="1" strokeLinecap="round" />
              {/* Upper Lip Shadow */}
              <path d={mouthPath} fill="#8C3333" opacity="0.5" filter="url(#blur-sm)" />
              {/* Lower Lip Highlight for Volume */}
              <path d="M 90 90 Q 100 96 110 90" stroke={colors.highLight} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#blur-sm)" />

              {/* High-Fidelity Eyes */}
              <g className={isCrying ? 'opacity-70' : 'opacity-100'}>
                 {/* Sclera Base (Not pure white, shaded at corners) */}
                 <path d={eyeShape} fill="#E8E8E8" />
                 <path d={eyeShapeR} fill="#E8E8E8" />

                 {/* Sclera Shadow (Top lid occlusion) */}
                 <path d="M 62 55 Q 74 45 86 55" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />
                 <path d="M 138 55 Q 126 45 114 55" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                 {/* Tear Ducts */}
                 <circle cx="85" cy="55" r="1.5" fill="#D98888" opacity="0.8" />
                 <circle cx="115" cy="55" r="1.5" fill="#D98888" opacity="0.8" />

                 {/* Irises with complex radial gradients (Using solid colors for now but deeply layered) */}
                 <g clipPath="url(#left-eye-clip)">
                    <clipPath id="left-eye-clip"><path d={eyeShape} /></clipPath>
                    {/* Base Iris */}
                    <circle cx="74" cy="55" r="6" fill={colors.eyeBase} />
                    {/* Outer Iris Ring */}
                    <circle cx="74" cy="55" r="6" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
                    {/* Inner Iris Highlight */}
                    <circle cx="74" cy="55" r="3" fill={colors.highLight} opacity="0.3" filter="url(#blur-sm)" />
                    {/* Pupil */}
                    <circle cx="74" cy="55" r={pupilSize * 2} fill="#000" />
                    {/* Hard Catchlight (Reflection) */}
                    <circle cx="72" cy="53" r="1.5" fill="#FFF" opacity="0.9" />
                    <circle cx="76" cy="57" r="0.5" fill="#FFF" opacity="0.6" />
                 </g>

                 <g clipPath="url(#right-eye-clip)">
                    <clipPath id="right-eye-clip"><path d={eyeShapeR} /></clipPath>
                    <circle cx="126" cy="55" r="6" fill={colors.eyeBase} />
                    <circle cx="126" cy="55" r="6" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
                    <circle cx="126" cy="55" r="3" fill={colors.highLight} opacity="0.3" filter="url(#blur-sm)" />
                    <circle cx="126" cy="55" r={pupilSize * 2} fill="#000" />
                    <circle cx="124" cy="53" r="1.5" fill="#FFF" opacity="0.9" />
                    <circle cx="128" cy="57" r="0.5" fill="#FFF" opacity="0.6" />
                 </g>

                 {/* Upper Eyelid & Eyelashes */}
                 <path d="M 60 55 Q 74 42 88 55" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                 {/* Lashes Left */}
                 <path d="M 62 52 L 58 48 M 66 48 L 64 43 M 72 46 L 72 40" stroke="#000" strokeWidth="1" fill="none" />

                 <path d="M 140 55 Q 126 42 112 55" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                 {/* Lashes Right */}
                 <path d="M 138 52 L 142 48 M 134 48 L 136 43 M 128 46 L 128 40" stroke="#000" strokeWidth="1" fill="none" />

                 {/* Eye Bags / Lower Lid Shadow */}
                 <path d="M 64 58 Q 74 64 84 58" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                 <path d="M 136 58 Q 126 64 116 58" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
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

           </g>


           {/* --- LEGS --- */}
           {isFemale ? (
             <g id="legs-f">
                {/* Left Leg: Thigh -> Knee -> Calf */}
                <path d="M 94 280 C 80 320, 80 370, 85 410 C 85 440, 80 470, 78 480 C 76 490, 85 495, 90 495 C 96 495, 98 485, 96 470 C 100 440, 102 380, 100 280 Z" fill="url(#leg-l)" />
                {/* Right Leg */}
                <path d="M 106 280 C 120 320, 120 370, 115 410 C 115 440, 120 470, 122 480 C 124 490, 115 495, 110 495 C 104 495, 102 485, 104 470 C 100 440, 98 380, 100 280 Z" fill="url(#leg-r)" />

                {/* Anatomical Overlays (Knees, Calves) */}
                <ellipse cx="86" cy="395" rx="6" ry="8" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                <path d="M 83 400 Q 86 405 90 400" stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                <ellipse cx="114" cy="395" rx="6" ry="8" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                <path d="M 110 400 Q 114 405 117 400" stroke={colors.deepShadow} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                {/* Thigh gaps / Inner thigh shading */}
                <path d="M 97 280 L 100 320 L 103 280 Z" fill={colors.deepShadow} opacity="0.6" filter="url(#blur-md)" />
             </g>
           ) : (
             <g id="legs-m">
                {/* Thicker, straighter legs */}
                <path d="M 94 280 C 85 330, 85 380, 88 420 C 88 450, 85 470, 83 480 C 80 490, 88 495, 93 495 C 99 495, 100 485, 98 470 C 102 440, 103 380, 100 280 Z" fill="url(#leg-l)" />
                <path d="M 106 280 C 115 330, 115 380, 112 420 C 112 450, 115 470, 117 480 C 120 490, 112 495, 107 495 C 101 495, 100 485, 102 470 C 98 440, 97 380, 100 280 Z" fill="url(#leg-r)" />

                {/* Musculature (Quads, Calves) */}
                <path d="M 90 310 Q 94 340 88 370" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 110 310 Q 106 340 112 370" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                {/* Knees */}
                <ellipse cx="88" cy="405" rx="5" ry="6" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                <path d="M 85 410 Q 88 415 92 410" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <ellipse cx="112" cy="405" rx="5" ry="6" fill={colors.highLight} filter="url(#blur-sm)" opacity="0.3" />
                <path d="M 108 410 Q 112 415 115 410" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
             </g>
           )}

           {/* --- TORSO --- */}
           {isFemale ? (
             <g id="torso-f">
                {/* Main Trunk */}
                <path d="M 72 110 C 72 110, 55 180, 65 250 C 75 280, 85 290, 100 290 C 115 290, 125 280, 135 250 C 145 180, 128 110, 128 110 Z" fill="url(#torso-f)" />

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
                <circle cx="100" cy="250" r="2.5" fill={colors.deepShadow} opacity="0.5" filter="url(#blur-sm)" />

                {/* Navel Highlight */}
                <path d="M 98 252 Q 100 254 102 252" stroke={colors.highLight} strokeWidth="1" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                {/* Pelvic V / Iliac Crest */}
                <path d="M 72 260 Q 85 275 96 270" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                <path d="M 128 260 Q 115 275 104 270" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />

                {/* High-Fidelity Breasts */}
                {/* Left Breast */}
                <g>
                  <circle cx="82" cy="160" r="18" fill="url(#breast-l)" />
                  {/* Underboob ambient occlusion */}
                  <path d="M 64 160 C 64 185, 95 185, 100 160" stroke={colors.deepShadow} strokeWidth="4" fill="none" opacity="0.5" filter="url(#blur-md)" />
                  {/* Areola & Nipple (Only if naked, but keeping anatomical for DoL logic) */}
                  <circle cx="80" cy="163" r="4" fill={colors.deepShadow} opacity="0.4" filter="url(#blur-sm)" />
                  <circle cx="80" cy="163" r="1" fill={colors.deepShadow} opacity="0.6" />
                  <circle cx="79" cy="162" r="0.5" fill={colors.highLight} opacity="0.5" />
                </g>

                {/* Right Breast */}
                <g>
                  <circle cx="118" cy="160" r="18" fill="url(#breast-r)" />
                  <path d="M 100 160 C 105 185, 136 185, 136 160" stroke={colors.deepShadow} strokeWidth="4" fill="none" opacity="0.5" filter="url(#blur-md)" />
                  <circle cx="120" cy="163" r="4" fill={colors.deepShadow} opacity="0.4" filter="url(#blur-sm)" />
                  <circle cx="120" cy="163" r="1" fill={colors.deepShadow} opacity="0.6" />
                  <circle cx="119" cy="162" r="0.5" fill={colors.highLight} opacity="0.5" />
                </g>

                {/* Cleavage drop shadow */}
                <path d="M 100 150 Q 100 170 100 180" stroke={colors.deepShadow} strokeWidth="5" fill="none" opacity="0.4" filter="url(#blur-md)" />

             </g>
           ) : (
             <g id="torso-m">
                {/* Main Trunk (V-Taper) */}
                <path d="M 64 110 C 64 110, 68 180, 75 250 C 80 280, 85 290, 100 290 C 115 290, 120 280, 125 250 C 132 180, 136 110, 136 110 Z" fill="url(#torso-m)" />

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
             <g id="xray" className="pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                {/* Dark circular vignette/window to simulate the X-ray view focusing on the pelvis */}
                <ellipse cx="100" cy="270" rx="35" ry="30" fill="url(#xray-bg)" />
                <ellipse cx="100" cy="270" rx="35" ry="30" stroke="#ff00ff" strokeWidth="0.5" fill="none" opacity="0.3" filter="url(#neon-glow)" />

                {isFemale ? (
                  <g transform="translate(0, 20)">
                    {/* Womb/Uterus */}
                    <path d="M 85 240 Q 100 230 115 240 C 120 260, 110 270, 105 270 L 102 280 L 98 280 L 95 270 C 90 270, 80 260, 85 240 Z"
                          fill="none" stroke="#ff2a85" strokeWidth="2" filter="url(#neon-glow)" className="animate-pulse" />

                    {/* Cervix/Vaginal Canal */}
                    <path d="M 100 280 Q 95 295 100 310" stroke="#ff2a85" strokeWidth="2" fill="none" filter="url(#neon-glow)" />
                    <path d="M 100 280 Q 105 295 100 310" stroke="#ff2a85" strokeWidth="2" fill="none" filter="url(#neon-glow)" />

                    {/* Ovaries/Fallopian Tubes */}
                    <path d="M 85 245 Q 70 240 65 245 M 115 245 Q 130 240 135 245" stroke="#f472b6" strokeWidth="1.5" fill="none" filter="url(#neon-glow)" />
                    <circle cx="65" cy="245" r="3" fill="#f472b6" filter="url(#neon-glow)" />
                    <circle cx="135" cy="245" r="3" fill="#f472b6" filter="url(#neon-glow)" />

                    {/* Fluids / Arousal visualizer */}
                    {stats.arousal > stats.maxArousal * 0.5 && (
                      <circle cx="100" cy="295" r="2" fill="#fff" filter="url(#neon-glow)" className="animate-[tearFall_2s_infinite]" />
                    )}
                  </g>
                ) : (
                  <g transform="translate(0, 20)">
                    {/* Prostate/Internal structures */}
                    <ellipse cx="100" cy="265" rx="8" ry="6" fill="none" stroke="#0ea5e9" strokeWidth="2" filter="url(#neon-glow)" className="animate-pulse" />

                    {/* Urethra/Canal */}
                    <path d="M 100 271 Q 97 290 100 320" stroke="#0ea5e9" strokeWidth="2" fill="none" filter="url(#neon-glow)" />
                    <path d="M 100 271 Q 103 290 100 320" stroke="#0ea5e9" strokeWidth="2" fill="none" filter="url(#neon-glow)" />

                    {/* Testes (Internal) */}
                    <circle cx="92" cy="315" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#neon-glow)" />
                    <circle cx="108" cy="315" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#neon-glow)" />

                    {/* Seminal Vesicles */}
                    <path d="M 92 311 Q 90 280 98 265 M 108 311 Q 110 280 102 265" stroke="#7dd3fc" strokeWidth="1" fill="none" filter="url(#neon-glow)" />

                    {/* Fluids / Arousal visualizer */}
                    {stats.arousal > stats.maxArousal * 0.5 && (
                      <circle cx="100" cy="285" r="1.5" fill="#fff" filter="url(#neon-glow)" className="animate-[tearFall_1s_infinite]" />
                    )}
                  </g>
                )}
             </g>
           )}
        </g>
      </svg>
    </div>
  );
};
