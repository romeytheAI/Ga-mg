import React from 'react';
import { useGameStore, ClothingItem, PlayableRace, PlayerState } from '../../store/gameStore';
import { raceColors, clothingColors } from './colors';

interface ModelProps {
  stats: PlayerState['stats'];
  clothing: PlayerState['clothing'];
}

export const SvgPlayerModel: React.FC<ModelProps> = ({ stats, clothing }) => {
  const race = stats.race;
  const colors = raceColors[race] || raceColors['Imperial'];

  // --- Core State Toggles ---
  const isBlushing = stats.arousal > stats.maxArousal * 0.4;
  const heavyBlush = stats.arousal > stats.maxArousal * 0.8;
  const isCrying = stats.trauma > stats.maxTrauma * 0.5;
  const heavyTears = stats.trauma > stats.maxTrauma * 0.8;
  const isSweating = stats.fatigue < stats.maxFatigue * 0.4 || stats.stress > stats.maxStress * 0.6;
  const heavySweat = stats.fatigue < stats.maxFatigue * 0.1 || stats.stress > stats.maxStress * 0.9;
  const isBruised = stats.health < stats.maxHealth * 0.5;
  const isBleeding = stats.health < stats.maxHealth * 0.2;
  const isCorrupted = stats.corruption > 1000;

  // --- Dynamic Facial Expressions ---
  // Eyebrows
  let leftBrow = "M 32 23 Q 36 21 42 24";
  let rightBrow = "M 68 23 Q 64 21 58 24";
  if (stats.stress > stats.maxStress * 0.6) { // Furrowed / Stressed
    leftBrow = "M 32 20 Q 38 23 44 26";
    rightBrow = "M 68 20 Q 62 23 56 26";
  } else if (stats.trauma > stats.maxTrauma * 0.6) { // Sad / Scared
    leftBrow = "M 30 25 Q 36 21 42 22";
    rightBrow = "M 70 25 Q 64 21 58 22";
  }

  // Eyes (Lids and Shape)
  let eyeShape = "M 31 31 Q 37 26 43 31 Q 37 35 31 31"; // Default Almond
  let eyeShapeR = "M 69 31 Q 63 26 57 31 Q 63 35 69 31";
  let pupilSize = 2;

  if (stats.stress > stats.maxStress * 0.7) { // Squint
    eyeShape = "M 31 32 Q 37 29 43 32 Q 37 34 31 32";
    eyeShapeR = "M 69 32 Q 63 29 57 32 Q 63 34 69 32";
    pupilSize = 1.5;
  } else if (stats.trauma > stats.maxTrauma * 0.7 || stats.arousal > stats.maxArousal * 0.8) { // Wide
    eyeShape = "M 31 31 Q 37 24 43 31 Q 37 37 31 31";
    eyeShapeR = "M 69 31 Q 63 24 57 31 Q 63 37 69 31";
    pupilSize = 2.5;
  }
  if (isCorrupted) pupilSize = 3;

  // Mouth
  let mouthPath = "M 44 48 Q 50 50 56 48"; // Neutral / Slight smile
  if (stats.health < stats.maxHealth * 0.3) mouthPath = "M 44 48 Q 50 44 56 48"; // Pain frown
  else if (stats.arousal > stats.maxArousal * 0.8) mouthPath = "M 46 48 Q 50 54 54 48"; // Aroused open
  else if (stats.stress > stats.maxStress * 0.7) mouthPath = "M 42 48 Q 50 49 58 48"; // Stressed grimace

  // --- Clothing Renderer (Advanced) ---
  const renderClothing = (item: ClothingItem | null, type: 'upper' | 'lower') => {
    if (!item) return null;
    const color = clothingColors[item.id] || '#ccc';
    const integrityPct = item.integrity / item.maxIntegrity;

    // Tattered masks for actual holes and rips (2.5D look)
    let maskId = undefined;
    if (integrityPct < 0.8) {
       maskId = integrityPct < 0.4 ? "url(#heavy-tear-mask)" : "url(#light-tear-mask)";
    }

    // 2.5D Clothing Shapes with folds and shading
    if (type === 'upper') {
       return (
          <g mask={maskId} style={{ opacity: integrityPct < 0.1 ? 0.8 : 1 }}>
             {/* Back collar / Inside */}
             <path d="M 38 60 Q 50 65 62 60 L 65 65 Q 50 72 35 65 Z" fill="#1a1a1a" opacity="0.4" />

             {/* Main Tunic Body */}
             <path d="M 28 65 Q 20 80 20 120 L 25 125 L 35 110 L 35 185 Q 50 190 65 185 L 65 110 L 75 125 L 80 120 Q 80 80 72 65 Q 65 58 60 62 Q 50 70 40 62 Q 35 58 28 65 Z" fill={`url(#cloth-grad-${item.id})`} />

             {/* Wrinkles / Folds (Shadows) */}
             <path d="M 35 110 Q 45 130 40 180" stroke="#000" strokeWidth="1" fill="none" opacity="0.15" />
             <path d="M 65 110 Q 55 130 60 180" stroke="#000" strokeWidth="1" fill="none" opacity="0.15" />
             <path d="M 45 140 Q 50 160 48 185" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.1" />

             {/* Belt if applicable (e.g. robes or tunic) */}
             {(item.id.includes('tunic') || item.id.includes('robes')) && (
               <g>
                 <path d="M 34 150 Q 50 155 66 150 L 66 155 Q 50 160 34 155 Z" fill="#2d1a11" />
                 <rect x="47" y="149" width="6" height="8" fill="#d4af37" rx="1" />
                 <rect x="48" y="150" width="4" height="6" fill="#2d1a11" />
               </g>
             )}
          </g>
       );
    } else { // lower
       return (
          <g mask={maskId} style={{ opacity: integrityPct < 0.1 ? 0.8 : 1 }}>
             {/* Pants Base */}
             <path d="M 35 180 Q 50 185 65 180 L 68 250 L 52 250 L 50 200 L 48 250 L 32 250 Z" fill={`url(#cloth-grad-${item.id})`} />

             {/* Crotch/Inseam Shading */}
             <path d="M 50 200 L 52 250 L 48 250 Z" fill="#000" opacity="0.2" />

             {/* Knee Folds */}
             <path d="M 34 220 Q 40 225 46 220" stroke="#000" strokeWidth="1" fill="none" opacity="0.15" />
             <path d="M 54 220 Q 60 225 66 220" stroke="#000" strokeWidth="1" fill="none" opacity="0.15" />
          </g>
       );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg viewBox="0 0 100 280" className="w-auto h-full max-h-[600px] overflow-visible drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
        <defs>
          {/* --- 2.5D Shading Gradients --- */}
          {/* Base Skin Gradient - Gives cylindrical depth to limbs and torso */}
          <linearGradient id="skin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.darkSkin} />
            <stop offset="20%" stopColor={colors.skin} />
            <stop offset="70%" stopColor={colors.highlight} />
            <stop offset="100%" stopColor={colors.darkSkin} />
          </linearGradient>

          {/* Leg Shading Gradient */}
          <linearGradient id="leg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.darkSkin} />
            <stop offset="40%" stopColor={colors.skin} />
            <stop offset="80%" stopColor={colors.highlight} />
            <stop offset="100%" stopColor={colors.darkSkin} />
          </linearGradient>

          {/* Spherical Head Gradient */}
          <radialGradient id="head-grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor={colors.highlight} />
            <stop offset="60%" stopColor={colors.skin} />
            <stop offset="100%" stopColor={colors.darkSkin} />
          </radialGradient>

          {/* Blush Gradient */}
          <radialGradient id="blush-grad" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#ff4b82" stopOpacity="0.8" />
             <stop offset="100%" stopColor="#ff4b82" stopOpacity="0" />
          </radialGradient>

          {/* Hair Gradient */}
          <linearGradient id="hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor={colors.highlight} stopOpacity="0.3" />
             <stop offset="100%" stopColor={colors.hair} />
          </linearGradient>

          {/* Clothing Dynamic Gradients */}
          {Object.keys(clothingColors).map(key => (
            <linearGradient key={`cloth-grad-${key}`} id={`cloth-grad-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
              <stop offset="15%" stopColor={clothingColors[key]} />
              <stop offset="85%" stopColor={clothingColors[key]} />
              <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
            </linearGradient>
          ))}

          {/* Tearing Masks for Clothing Integrity */}
          <mask id="light-tear-mask">
             <rect x="0" y="0" width="100" height="280" fill="white" />
             {/* Random looking jagged holes */}
             <path d="M 28 100 l 5 2 l -2 5 l -4 -2 Z" fill="black" />
             <path d="M 65 140 l 4 -3 l 2 4 l -5 1 Z" fill="black" />
             <path d="M 40 210 l 6 0 l 2 8 l -7 -2 Z" fill="black" />
          </mask>

          <mask id="heavy-tear-mask">
             <rect x="0" y="0" width="100" height="280" fill="white" />
             {/* Huge slashes and missing sections */}
             <path d="M 20 90 l 15 5 l -5 15 l -12 -5 Z" fill="black" />
             <path d="M 60 130 l 18 -5 l 2 20 l -15 2 Z" fill="black" />
             <path d="M 45 160 l 15 0 l -5 15 l -12 -2 Z" fill="black" />
             <path d="M 35 200 l 10 5 l -2 25 l -12 -5 Z" fill="black" />
             <path d="M 55 220 l 15 -5 l 5 15 l -18 8 Z" fill="black" />
          </mask>
        </defs>

        {/* --- BASE ANATOMY (2.5D) --- */}
        <g id="body" className="animate-breathe origin-bottom">

           {/* Back Hair (if applicable) */}
           {['Breton', 'Imperial', 'Nord', 'Altmer', 'Bosmer'].includes(race) && (
             <path d="M 35 35 Q 20 60 30 90 Q 50 100 70 90 Q 80 60 65 35 Z" fill="url(#hair-grad)" opacity="0.8" />
           )}

           {/* Race Specific Tails (Behind legs) */}
           {race === 'Argonian' && (
              <g>
                <path d="M 50 160 Q 60 210 40 270 Q 45 275 52 265 Q 68 210 58 160 Z" fill="url(#leg-grad)" />
                {/* Tail Ridges */}
                <path d="M 56 180 l 4 2 l -3 4 M 54 200 l 3 2 l -2 3 M 50 230 l 3 1 l -2 2" stroke={colors.horn} strokeWidth="1" fill="none" />
              </g>
           )}
           {race === 'Khajiit' && (
              <path d="M 50 160 Q 70 200 80 250 Q 82 255 78 255 Q 65 210 56 160 Z" fill="url(#hair-grad)" />
           )}

           {/* Legs */}
           {/* Left Leg */}
           <path d="M 46 160 L 48 250 Q 48 255 42 255 Q 36 255 36 250 L 32 160 Z" fill="url(#leg-grad)" />
           {/* Left Knee Indent */}
           <path d="M 37 210 Q 40 215 43 210" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />

           {/* Right Leg */}
           <path d="M 54 160 L 52 250 Q 52 255 58 255 Q 64 255 64 250 L 68 160 Z" fill="url(#leg-grad)" />
           {/* Right Knee Indent */}
           <path d="M 57 210 Q 60 215 63 210" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />

           {/* Torso */}
           {/* Main Trunk */}
           <path d="M 33 60 C 33 60, 26 100, 32 160 Q 50 170 68 160 C 74 100, 67 60, 67 60 Z" fill="url(#skin-grad)" />

           {/* Anatomical Details (Collarbones, Chest, Abs) */}
           {/* Collarbones */}
           <path d="M 35 68 Q 42 72 48 70 M 65 68 Q 58 72 52 70" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />
           {/* Pectorals / Chest curve */}
           <path d="M 34 85 Q 42 95 49 90 M 66 85 Q 58 95 51 90" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.2" />
           {/* Center ab line */}
           <path d="M 50 90 L 50 145" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.15" />
           {/* Belly button */}
           <circle cx="50" cy="140" r="1" fill="#000" opacity="0.3" />
           {/* Pelvic V */}
           <path d="M 40 145 L 50 155 L 60 145" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.2" />

           {/* Arms */}
           {/* Left Arm (Behind) */}
           <path d="M 33 65 Q 20 100 24 140 Q 25 145 28 143 Q 29 130 35 90 Z" fill="url(#leg-grad)" />
           {/* Right Arm (Front) */}
           <path d="M 67 65 Q 80 100 76 140 Q 75 145 72 143 Q 71 130 65 90 Z" fill="url(#skin-grad)" />
           {/* Right Arm Shading */}
           <path d="M 67 65 Q 80 100 76 140" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.1" />

           {/* --- HEAD & NECK --- */}
           <g id="head" className="origin-[50px_60px]">
              {/* Neck with shadow from chin */}
              <g>
                 <rect x="43" y="50" width="14" height="15" fill={colors.darkSkin} />
                 <path d="M 43 50 Q 50 60 57 50 Z" fill="#000" opacity="0.3" />
              </g>

              {/* Face Base */}
              <circle cx="50" cy="35" r="18" fill="url(#head-grad)" />
              {/* Cheekbone highlights */}
              <path d="M 35 38 Q 38 42 42 38" stroke={colors.highlight} strokeWidth="1.5" fill="none" opacity="0.5" />
              <path d="M 65 38 Q 62 42 58 38" stroke={colors.highlight} strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Nose */}
              <path d="M 50 30 L 48 38 L 51 39" stroke={colors.darkSkin} strokeWidth="1" fill="none" opacity="0.8" />

              {/* Race Specific Additions (Head Level) */}
              {race === 'Argonian' && (
                 <>
                   {/* Horns with 3D gradient */}
                   <path d="M 34 25 Q 20 10 25 5 Q 30 15 38 20 Z" fill={colors.horn} />
                   <path d="M 66 25 Q 80 10 75 5 Q 70 15 62 20 Z" fill={colors.horn} />
                   {/* Scales texture on forehead */}
                   <path d="M 45 20 l 2 2 l -2 2 M 55 20 l -2 2 l 2 2 M 50 15 l 2 2 l -2 2" stroke={colors.darkSkin} strokeWidth="0.5" fill="none" opacity="0.6" />
                 </>
              )}
              {race === 'Khajiit' && (
                 <>
                   {/* Fluffy Ears */}
                   <path d="M 35 22 Q 20 5 25 10 L 30 18 Z" fill="url(#hair-grad)" />
                   <path d="M 27 12 Q 32 15 35 22" stroke={colors.highlight} strokeWidth="1" fill="none" />
                   <path d="M 65 22 Q 80 5 75 10 L 70 18 Z" fill="url(#hair-grad)" />
                   <path d="M 73 12 Q 68 15 65 22" stroke={colors.highlight} strokeWidth="1" fill="none" />
                   {/* Whiskers */}
                   <path d="M 42 40 L 30 38 M 42 42 L 30 42 M 42 44 L 32 46" stroke={colors.highlight} strokeWidth="0.5" fill="none" />
                   <path d="M 58 40 L 70 38 M 58 42 L 70 42 M 58 44 L 68 46" stroke={colors.highlight} strokeWidth="0.5" fill="none" />
                 </>
              )}
              {race === 'Orc' && (
                 <>
                   {/* Tusks casting a small shadow */}
                   <path d="M 45 48 Q 43 40 44 38 Q 46 42 47 48 Z" fill={colors.horn} />
                   <path d="M 55 48 Q 57 40 56 38 Q 54 42 53 48 Z" fill={colors.horn} />
                 </>
              )}
              {['Altmer', 'Bosmer', 'Dunmer'].includes(race) && (
                 <>
                   {/* Sharp Elf Ears with inner shadow line */}
                   <path d="M 32 35 Q 15 20 20 28 Q 25 35 32 38 Z" fill="url(#skin-grad)" />
                   <path d="M 28 32 L 22 28" stroke={colors.darkSkin} strokeWidth="0.5" fill="none" />
                   <path d="M 68 35 Q 85 20 80 28 Q 75 35 68 38 Z" fill="url(#skin-grad)" />
                   <path d="M 72 32 L 78 28" stroke={colors.darkSkin} strokeWidth="0.5" fill="none" />
                 </>
              )}

              {/* Eyes 2.5D */}
              <g className={isCrying ? 'opacity-70' : 'opacity-100'}>
                 {/* Sclera (White of eye) */}
                 <path d={eyeShape} fill="#fff" />
                 <path d={eyeShapeR} fill="#fff" />

                 {/* Iris & Pupil */}
                 {/* Left Eye */}
                 <g clipPath="url(#left-eye-clip)">
                    <clipPath id="left-eye-clip"><path d={eyeShape} /></clipPath>
                    <circle cx="37" cy="31" r="3" fill={isCorrupted ? '#a855f7' : colors.eye} className={isCorrupted ? "animate-pulse" : ""} />
                    <circle cx="37" cy="31" r={pupilSize} fill="#000" />
                    {/* Eye highlight */}
                    <circle cx="36" cy="30" r="1" fill="#fff" opacity="0.8" />
                 </g>
                 {/* Right Eye */}
                 <g clipPath="url(#right-eye-clip)">
                    <clipPath id="right-eye-clip"><path d={eyeShapeR} /></clipPath>
                    <circle cx="63" cy="31" r="3" fill={isCorrupted ? '#a855f7' : colors.eye} className={isCorrupted ? "animate-pulse" : ""} />
                    <circle cx="63" cy="31" r={pupilSize} fill="#000" />
                    <circle cx="62" cy="30" r="1" fill="#fff" opacity="0.8" />
                 </g>

                 {/* Eyelids / Lashes */}
                 <path d="M 30 31 Q 37 26 44 31" stroke="#000" strokeWidth="1.5" fill="none" />
                 <path d="M 70 31 Q 63 26 56 31" stroke="#000" strokeWidth="1.5" fill="none" />
              </g>

              {/* Eyebrows */}
              <path d={leftBrow} stroke={colors.hair} strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d={rightBrow} stroke={colors.hair} strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Mouth with lips */}
              <path d={mouthPath} fill="#cc6666" stroke="#4a0404" strokeWidth="0.5" />
              {/* Lower lip highlight */}
              <path d="M 46 49 Q 50 51 54 49" stroke={colors.highlight} strokeWidth="0.5" fill="none" opacity="0.6" />

              {/* Front Hair Bangs */}
              {['Breton', 'Imperial', 'Nord', 'Altmer', 'Bosmer'].includes(race) && (
                 <path d="M 30 25 Q 40 15 50 18 Q 60 15 70 25 Q 65 15 50 12 Q 35 15 30 25 Z" fill="url(#hair-grad)" />
              )}

              {/* --- DYNAMIC FACIAL OVERLAYS --- */}
              {isBlushing && (
                 <g className={heavyBlush ? "animate-pulse" : ""}>
                    <circle cx="36" cy="40" r={heavyBlush ? 8 : 5} fill="url(#blush-grad)" style={{ mixBlendMode: 'multiply' }} />
                    <circle cx="64" cy="40" r={heavyBlush ? 8 : 5} fill="url(#blush-grad)" style={{ mixBlendMode: 'multiply' }} />
                    {/* Tiny highlight on blush */}
                    {heavyBlush && (
                       <>
                         <line x1="34" y1="39" x2="38" y2="37" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
                         <line x1="62" y1="39" x2="66" y2="37" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
                       </>
                    )}
                 </g>
              )}

              {isCrying && (
                 <g className="animate-[tearFall_2s_infinite]">
                    {/* 3D tear drop */}
                    <path d="M 37 38 C 37 38, 35 42, 37 43 C 39 42, 37 38, 37 38 Z" fill="#60a5fa" opacity="0.9" />
                    <circle cx="36.5" cy="42" r="0.5" fill="#fff" />

                    <path d="M 63 38 C 63 38, 61 42, 63 43 C 65 42, 63 38, 63 38 Z" fill="#60a5fa" opacity="0.9" />
                    <circle cx="62.5" cy="42" r="0.5" fill="#fff" />
                 </g>
              )}

              {heavyTears && (
                 <g className="animate-[tearFall_1.5s_infinite_0.5s]">
                    <path d="M 38 35 Q 38 45 36 50" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <path d="M 62 35 Q 62 45 64 50" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.7" />
                 </g>
              )}

              {isSweating && (
                 <g>
                   <circle cx="33" cy="22" r="1.5" fill="#bae6fd" opacity="0.9" />
                   <path d="M 32 21 L 34 21 L 33 19 Z" fill="#bae6fd" opacity="0.9" />
                 </g>
              )}
           </g>

           {/* --- DYNAMIC BODY OVERLAYS --- */}
           {heavySweat && (
              <g>
                 <path d="M 40 80 Q 40 100 42 120" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.7" />
                 <path d="M 60 70 Q 60 90 58 110" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.7" />
                 <circle cx="42" cy="120" r="1.5" fill="#bae6fd" opacity="0.7" />
                 <circle cx="58" cy="110" r="1.5" fill="#bae6fd" opacity="0.7" />
              </g>
           )}

           {isBruised && (
              <g opacity="0.6" fill="#4c1d95" style={{ mixBlendMode: 'multiply' }}>
                 <circle cx="42" cy="95" r="12" filter="blur(3px)" />
                 <circle cx="58" cy="135" r="10" filter="blur(2px)" />
                 <circle cx="28" cy="115" r="6" filter="blur(1px)" />
                 {/* Darker center to bruise */}
                 <circle cx="42" cy="95" r="4" fill="#1e1b4b" filter="blur(1px)" />
              </g>
           )}

           {isBleeding && (
              <g opacity="0.9" fill="#991b1b">
                 {/* Deep cut */}
                 <path d="M 38 88 L 46 92 L 44 93 L 37 89 Z" fill="#450a0a" />
                 {/* Blood trickling */}
                 <path d="M 40 92 Q 40 110 37 125" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />
                 <path d="M 44 93 Q 45 105 46 115" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                 <path d="M 55 130 Q 55 150 53 165" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />
                 <circle cx="37" cy="126" r="1.5" />
                 <circle cx="53" cy="166" r="1.5" />
              </g>
           )}

           {/* --- CLOTHING LAYERS (Under to Over) --- */}
           {clothing.under_lower && (
              <g mask={clothing.under_lower.integrity / clothing.under_lower.maxIntegrity < 0.5 ? "url(#heavy-tear-mask)" : "none"}>
                 <path d="M 38 150 Q 50 155 62 150 L 60 170 Q 50 165 40 170 Z" fill="#e5e5e5" />
                 <path d="M 50 153 L 50 165" stroke="#d4d4d4" strokeWidth="1" fill="none" />
              </g>
           )}

           {renderClothing(clothing.lower, 'lower')}
           {renderClothing(clothing.upper, 'upper')}

           {clothing.over && (
              <g mask={clothing.over.integrity / clothing.over.maxIntegrity < 0.5 ? "url(#heavy-tear-mask)" : "none"}>
                 {/* Thick cloak/over-layer */}
                 <path d="M 15 50 Q 50 45 85 50 L 90 200 Q 50 220 10 200 Z" fill={`url(#cloth-grad-${clothing.over.id})`} opacity="0.95" />
                 {/* Cloak folds */}
                 <path d="M 25 50 Q 30 120 20 195 M 75 50 Q 70 120 80 195" stroke="#000" strokeWidth="2" fill="none" opacity="0.2" />
              </g>
           )}

        </g>
      </svg>
    </div>
  );
};
