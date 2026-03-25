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

  // Base state calculations
  const isBlushing = stats.arousal > stats.maxArousal * 0.4;
  const heavyBlush = stats.arousal > stats.maxArousal * 0.8;
  const isCrying = stats.trauma > stats.maxTrauma * 0.5;
  const heavyTears = stats.trauma > stats.maxTrauma * 0.8;
  const isSweating = stats.fatigue < stats.maxFatigue * 0.4 || stats.stress > stats.maxStress * 0.6;
  const heavySweat = stats.fatigue < stats.maxFatigue * 0.1 || stats.stress > stats.maxStress * 0.9;
  const isBruised = stats.health < stats.maxHealth * 0.5;
  const isBleeding = stats.health < stats.maxHealth * 0.2;
  const isCorrupted = stats.corruption > 1000;

  // Expression based on stats
  let mouthPath = "M 45 45 Q 50 48 55 45"; // Default Neutral
  if (stats.health < stats.maxHealth * 0.3) mouthPath = "M 45 45 Q 50 40 55 45"; // Pain (frown)
  else if (stats.arousal > stats.maxArousal * 0.8) mouthPath = "M 45 45 Q 50 50 55 45"; // Aroused (open)
  else if (stats.stress > stats.maxStress * 0.7) mouthPath = "M 42 45 Q 50 46 58 45"; // Stressed (grimace)

  let eyeMute = isCrying ? 'opacity-70' : 'opacity-100';
  let eyeShape = "M 35 32 Q 40 28 45 32"; // Default
  if (stats.stress > stats.maxStress * 0.6) eyeShape = "M 35 30 L 45 34"; // Squint

  // Function to render clothing
  const renderClothing = (item: ClothingItem | null, type: 'upper' | 'lower') => {
    if (!item) return null;
    const color = clothingColors[item.id] || '#ccc';
    const integrityPct = item.integrity / item.maxIntegrity;

    // Tattered look logic based on integrity
    let clipPathId = undefined;
    if (integrityPct < 0.8) {
       // Using simple opacity drops or path cuts for MVP. Real clipping paths could be complex.
       clipPathId = integrityPct < 0.4 ? "url(#tattered-heavy)" : "url(#tattered-light)";
    }

    if (type === 'upper') {
       return (
          <path
             d="M 25 60 L 75 60 L 80 120 L 65 120 L 65 190 L 35 190 L 35 120 L 20 120 Z"
             fill={color}
             stroke="#1a1a1a"
             clipPath={clipPathId}
             style={{ opacity: integrityPct < 0.2 ? 0.7 : 1 }}
          />
       );
    } else { // lower (pants)
       return (
          <path
             d="M 35 150 L 65 150 L 65 250 L 52 250 L 50 180 L 48 250 L 35 250 Z"
             fill={color}
             stroke="#1a1a1a"
             clipPath={clipPathId}
             style={{ opacity: integrityPct < 0.2 ? 0.7 : 1 }}
          />
       );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg viewBox="0 0 100 280" className="w-auto h-full max-h-[600px] overflow-visible drop-shadow-lg">
        <defs>
          <clipPath id="tattered-light">
             <rect x="0" y="0" width="100" height="280" />
             <circle cx="30" cy="100" r="5" fill="black" />
             <circle cx="70" cy="140" r="8" fill="black" />
          </clipPath>
          <clipPath id="tattered-heavy">
             <rect x="0" y="0" width="100" height="280" />
             <circle cx="30" cy="100" r="15" fill="black" />
             <circle cx="70" cy="140" r="18" fill="black" />
             <circle cx="50" cy="180" r="20" fill="black" />
          </clipPath>

          <radialGradient id="blush-grad" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#ff4b82" stopOpacity="0.8" />
             <stop offset="100%" stopColor="#ff4b82" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- BASE BODY --- */}
        <g id="body" className="animate-breathe origin-bottom">
           {/* Legs */}
           <path d="M 40 160 L 40 250 L 48 250 L 50 170 Z" fill={colors.darkSkin} />
           <path d="M 60 160 L 60 250 L 52 250 L 50 170 Z" fill={colors.darkSkin} />

           {/* Torso */}
           <path d="M 35 60 C 35 60, 25 100, 35 160 L 65 160 C 75 100, 65 60, 65 60 Z" fill={colors.skin} />

           {/* Arms */}
           <path d="M 35 60 L 20 140 L 25 145 L 35 100 Z" fill={colors.darkSkin} />
           <path d="M 65 60 L 80 140 L 75 145 L 65 100 Z" fill={colors.darkSkin} />

           {/* Race Specific Additions (Body Level) */}
           {race === 'Argonian' && (
              <path d="M 50 160 Q 55 200 45 260 L 48 260 Q 60 200 55 160 Z" fill={colors.darkSkin} /> // Tail
           )}
           {race === 'Khajiit' && (
              <path d="M 50 160 Q 60 220 70 240 L 68 245 Q 55 220 52 160 Z" fill={colors.hair} /> // Tail
           )}

           {/* --- HEAD --- */}
           <g id="head" className="origin-[50px_60px]">
              {/* Neck */}
              <rect x="44" y="55" width="12" height="10" fill={colors.darkSkin} />

              {/* Face Base */}
              <circle cx="50" cy="35" r="18" fill={colors.skin} />

              {/* Race Specific Additions (Head Level) */}
              {race === 'Argonian' && (
                 <>
                   <path d="M 34 25 Q 25 15 30 10 Q 32 18 36 20 Z" fill={colors.horn} /> {/* Horn L */}
                   <path d="M 66 25 Q 75 15 70 10 Q 68 18 64 20 Z" fill={colors.horn} /> {/* Horn R */}
                 </>
              )}
              {race === 'Khajiit' && (
                 <>
                   <path d="M 35 20 L 25 10 L 40 18 Z" fill={colors.hair} /> {/* Ear L */}
                   <path d="M 65 20 L 75 10 L 60 18 Z" fill={colors.hair} /> {/* Ear R */}
                 </>
              )}
              {race === 'Orc' && (
                 <>
                   <path d="M 45 45 Q 43 40 44 38 Q 46 42 47 45 Z" fill={colors.horn} /> {/* Tusk L */}
                   <path d="M 55 45 Q 57 40 56 38 Q 54 42 53 45 Z" fill={colors.horn} /> {/* Tusk R */}
                 </>
              )}
              {['Altmer', 'Bosmer', 'Dunmer'].includes(race) && (
                 <>
                   <path d="M 32 35 Q 20 25 25 30 Z" fill={colors.skin} /> {/* Elf Ear L */}
                   <path d="M 68 35 Q 80 25 75 30 Z" fill={colors.skin} /> {/* Elf Ear R */}
                 </>
              )}

              {/* Eyes */}
              <g className={eyeMute}>
                 <path d={eyeShape} stroke={colors.eye} strokeWidth="1.5" fill="none" />
                 <path d={`M 55 32 Q 60 28 65 32`} stroke={colors.eye} strokeWidth="1.5" fill="none" />
                 <circle cx="40" cy="32" r="1" fill={isCorrupted ? '#a855f7' : colors.eye} className={isCorrupted ? "animate-pulse" : ""} />
                 <circle cx="60" cy="32" r="1" fill={isCorrupted ? '#a855f7' : colors.eye} className={isCorrupted ? "animate-pulse" : ""} />
              </g>

              {/* Mouth */}
              <path d={mouthPath} stroke="#4a0404" strokeWidth="1" fill="none" />

              {/* Dynamic Facial Overlays (Blush, Tears, Sweat) */}
              {isBlushing && (
                 <g className={heavyBlush ? "animate-pulse" : ""}>
                    <circle cx="38" cy="40" r={heavyBlush ? 6 : 4} fill="url(#blush-grad)" />
                    <circle cx="62" cy="40" r={heavyBlush ? 6 : 4} fill="url(#blush-grad)" />
                 </g>
              )}

              {isCrying && (
                 <g className="animate-[tearFall_2s_infinite]">
                    <circle cx="40" cy="38" r="1.5" fill="#60a5fa" opacity="0.8" />
                    <circle cx="60" cy="38" r="1.5" fill="#60a5fa" opacity="0.8" />
                 </g>
              )}

              {heavyTears && (
                 <g className="animate-[tearFall_1.5s_infinite_0.5s]">
                    <path d="M 38 35 Q 38 45 36 50" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6" />
                    <path d="M 62 35 Q 62 45 64 50" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6" />
                 </g>
              )}

              {isSweating && (
                 <circle cx="35" cy="25" r="1.5" fill="#bae6fd" opacity="0.8" />
              )}
           </g>

           {/* Dynamic Body Overlays (Sweat, Bruises, Bleeding) */}
           {heavySweat && (
              <g>
                 <path d="M 40 80 Q 40 100 42 120" stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.6" />
                 <path d="M 60 70 Q 60 90 58 110" stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.6" />
              </g>
           )}

           {isBruised && (
              <g opacity="0.5" fill="#4c1d95" style={{ mixBlendMode: 'multiply' }}>
                 <circle cx="40" cy="90" r="10" filter="blur(2px)" />
                 <circle cx="55" cy="130" r="8" filter="blur(2px)" />
                 <circle cx="28" cy="110" r="4" filter="blur(1px)" />
              </g>
           )}

           {isBleeding && (
              <g opacity="0.8" fill="#991b1b">
                 <path d="M 40 90 Q 40 105 38 115" stroke="#991b1b" strokeWidth="1.5" fill="none" />
                 <path d="M 55 130 Q 55 150 53 160" stroke="#991b1b" strokeWidth="1.5" fill="none" />
                 <circle cx="45" cy="80" r="2" />
              </g>
           )}

           {/* --- CLOTHING LAYERS (Under to Over) --- */}
           {/* In a fully fleshed out system, we render under_lower, under_upper, lower, upper, over in order */}
           {clothing.under_lower && (
              <path d="M 40 150 L 60 150 L 58 170 L 42 170 Z" fill="#e5e5e5" opacity={clothing.under_lower.integrity / clothing.under_lower.maxIntegrity} />
           )}

           {renderClothing(clothing.lower, 'lower')}
           {renderClothing(clothing.upper, 'upper')}

           {clothing.over && (
              <path d="M 20 55 L 80 55 L 85 200 L 15 200 Z" fill={clothingColors[clothing.over.id] || '#444'} opacity="0.9" />
           )}

        </g>
      </svg>
    </div>
  );
};
