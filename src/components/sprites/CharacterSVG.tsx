import React from 'react';

export type Race = 'nord' | 'imperial' | 'breton' | 'redguard' | 'dunmer' | 'altmer' | 'bosmer' | 'orsimer' | 'khajiit' | 'argonian';
export type Gender = 'male' | 'female' | 'herm' | 'npc';
export type BodyState = 'normal' | ' aroused' | 'naked' | 'torn' | 'naked_aroused';
export type Pose = 'standing' | 'sitting' | 'walking' | 'sleeping' | 'working' | 'combat';

export interface SpriteLayer {
  id: string;
  name: string;
  zIndex: number;
  color?: string;
  visible: boolean;
}

export interface CharacterSprite {
  race: Race;
  gender: Gender;
  pose: Pose;
  bodyState: BodyState;
  head: string;
  hair?: string;
  eyes?: string;
  body: string;
  arms?: string;
  legs?: string;
  tail?: string;
  accessories?: string[];
}

const RACE_COLORS: Record<Race, { skin: string; hair: string; eyes: string }> = {
  nord: { skin: '#e8d4b8', hair: '#c9a86c', eyes: '#6b8ccc' },
  imperial: { skin: '#d4a574', hair: '#4a3728', eyes: '#6b5a4a' },
  breton: { skin: '#e0d0c0', hair: '#8a7a6a', eyes: '#7a6a9a' },
  redguard: { skin: '#8b5a2b', hair: '#1a1008', eyes: '#6b4a2a' },
  dunmer: { skin: '#4a4a5a', hair: '#3a3a4a', eyes: '#cc4444' },
  altmer: { skin: '#e8d8a8', hair: '#c8b878', eyes: '#cccc44' },
  bosmer: { skin: '#c8b898', hair: '#6a5a4a', eyes: '#6a8a6a' },
  orsimer: { skin: '#7a9a6a', hair: '#3a4a3a', eyes: '#6a7a5a' },
  khajiit: { skin: '#d4c4a4', hair: '#b4a474', eyes: '#88cc66' },
  argonian: { skin: '#6a8a6a', hair: '#4a6a4a', eyes: '#cccc44' }
};

const GENDER_SHAPES: Record<Gender, { torso: string; hips: string; chest: string }> = {
  male: { torso: 'M180,200 L180,280 L220,280 L220,200 Z', hips: 'M175,280 L225,280 L220,320 L180,320 Z', chest: 'M170,200 Q200,220 230,200' },
  female: { torso: 'M180,200 L175,280 L225,280 L220,200 Z', hips: 'M165,280 L235,280 L240,330 L160,330 Z', chest: 'M165,210 Q200,280 235,210' },
  herm: { torso: 'M180,200 L175,280 L225,280 L220,200 Z', hips: 'M165,280 L235,280 L230,330 L170,330 Z', chest: 'M165,210 Q200,260 235,210' },
  npc: { torso: 'M180,200 L180,280 L220,280 L220,200 Z', hips: 'M175,280 L225,280 L220,320 L180,320 Z', chest: 'M180,200 L220,200' }
};

const RACE_FEATURES: Record<Race, { ears: string; tail?: string; horns?: string; faceShape: string }> = {
  nord: { ears: 'normal', faceShape: 'broad' },
  imperial: { ears: 'normal', faceShape: 'refined' },
  breton: { ears: 'normal', faceShape: 'soft' },
  redguard: { ears: 'normal', faceShape: 'strong' },
  dunmer: { ears: 'pointed', faceShape: 'angular' },
  altmer: { ears: 'long-pointed', faceShape: 'elegant' },
  bosmer: { ears: 'pointed', faceShape: 'wild' },
  orsimer: { ears: 'pointed', faceShape: 'rugged', horns: 'small' },
  khajiit: { ears: 'cat', tail: 'long', faceShape: 'feline' },
  argonian: { ears: 'reptile', tail: 'long', faceShape: 'reptile' }
};

export const CharacterSVG: React.FC<{
  sprite: CharacterSprite;
  size?: number;
  className?: string;
}> = ({ sprite, size = 200, className = '' }) => {
  const colors = RACE_COLORS[sprite.race];
  const features = RACE_FEATURES[sprite.race];
  const shapes = GENDER_SHAPES[sprite.gender];
  
  const isNaked = sprite.bodyState === 'naked' || sprite.bodyState === 'naked_aroused';
  const isAroused = sprite.bodyState === 'aroused' || sprite.bodyState === 'naked_aroused';
  
  const getEars = () => {
    switch (features.ears) {
      case 'long-pointed':
        return (
          <g fill={colors.skin}>
            <ellipse cx="145" cy="95" rx="20" ry="35" transform="rotate(-30 145 95)" />
            <ellipse cx="255" cy="95" rx="20" ry="35" transform="rotate(30 255 95)" />
          </g>
        );
      case 'pointed':
        return (
          <g fill={colors.skin}>
            <path d="M150,80 L130,50 L160,70 Z" />
            <path d="M250,80 L270,50 L240,70 Z" />
          </g>
        );
      case 'cat':
        return (
          <g fill={colors.skin}>
            <path d="M140,70 Q120,30 150,50 L155,75 Z" fill={colors.skin} />
            <path d="M260,70 Q280,30 250,50 L245,75 Z" fill={colors.skin} />
            <path d="M145,75 L145,95 L155,85 Z" fill="#fcc" />
            <path d="M255,75 L255,95 L245,85 Z" fill="#fcc" />
          </g>
        );
      case 'reptile':
        return (
          <g fill={colors.skin}>
            <ellipse cx="140" cy="90" rx="15" ry="20" />
            <ellipse cx="260" cy="90" rx="15" ry="20" />
          </g>
        );
      default:
        return (
          <g fill={colors.skin}>
            <ellipse cx="145" cy="90" rx="12" ry="18" />
            <ellipse cx="255" cy="90" rx="12" ry="18" />
          </g>
        );
    }
  };

  const getFace = () => (
    <g>
      <ellipse cx="200" cy="100" rx="50" ry="60" fill={colors.skin} />
      <ellipse cx="175" cy="95" rx="8" ry="6" fill={colors.eyes} />
      <ellipse cx="225" cy="95" rx="8" ry="6" fill={colors.eyes} />
      <circle cx="175" cy="95" r="3" fill="#222" />
      <circle cx="225" cy="95" r="3" fill="#222" />
      {isAroused && (
        <>
          <path d="M185,90 Q200,85 215,90" stroke="#c88" strokeWidth="2" fill="none" />
          <path d="M170,110 Q180,120 175,130" stroke="#c88" strokeWidth="2" fill="none" />
          <path d="M230,110 Q220,120 225,130" stroke="#c88" strokeWidth="2" fill="none" />
        </>
      )}
      <path d="M190,130 Q200,145 210,130" stroke="#a88" strokeWidth="3" fill="none" />
      {sprite.race === 'orsimer' && (
        <path d="M185,150 L175,170 L190,165 Z" fill="#eea" />
        <path d="M215,150 L225,170 L210,165 Z" fill="#eea" />
      )}
    </g>
  );

  const getHair = () => {
    if (!sprite.hair) return null;
    return (
      <g fill={colors.hair}>
        <path d="M150,60 Q200,30 250,60 Q270,100 250,130 Q200,110 150,130 Q130,100 150,60" />
        {sprite.gender === 'female' && (
          <>
            <path d="M140,80 Q130,150 150,200" stroke={colors.hair} strokeWidth="20" fill="none" />
            <path d="M260,80 Q270,150 250,200" stroke={colors.hair} strokeWidth="20" fill="none" />
          </>
        )}
      </g>
    );
  };

  const getBody = () => (
    <g>
      <path d={shapes.torso} fill={colors.skin} stroke="#aaa" strokeWidth="1" />
      <path d={shapes.chest} fill={isNaked ? colors.skin : '#eee'} stroke="#aaa" strokeWidth="1" />
      {isNaked && sprite.gender !== 'male' && (
        <g>
          <ellipse cx="175" cy="240" rx="20" ry="25" fill={colors.skin} />
          <ellipse cx="225" cy="240" rx="20" ry="25" fill={colors.skin} />
          {isAroused && (
            <ellipse cx="175" cy="235" rx="15" ry="20" fill="#c88" opacity="0.5" />
          )}
        </g>
      )}
      <path d={shapes.hips} fill={isNaked ? colors.skin : '#444'} stroke="#aaa" strokeWidth="1" />
    </g>
  );

  const getArms = () => (
    <g fill={colors.skin}>
      <path d="M140,200 Q120,250 130,300" stroke={colors.skin} strokeWidth="15" fill="none" />
      <path d="M260,200 Q280,250 270,300" stroke={colors.skin} strokeWidth="15" fill="none" />
    </g>
  );

  const getLegs = () => (
    <g fill={colors.skin}>
      <path d="M175,320 L170,400" stroke={colors.skin} strokeWidth="20" />
      <path d="M225,320 L230,400" stroke={colors.skin} strokeWidth="20" />
    </g>
  );

  const getTail = () => {
    if (!features.tail || sprite.race !== 'khajiit' && sprite.race !== 'argonian') return null;
    return (
      <path 
        d="M180,300 Q150,350 180,400 Q200,450 220,420" 
        fill="none" 
        stroke={colors.skin} 
        strokeWidth="10"
        strokeLinecap="round"
      />
    );
  };

  const getClothing = () => {
    if (isNaked) return null;
    return (
      <g fill="#444">
        <path d="M160,200 L240,200 L230,300 L170,300 Z" fill="#3a3a5a" />
        <path d="M160,200 L180,280 L220,280 L240,200" fill="#2a2a4a" />
        <rect x="170" y="280" width="60" height="40" fill="#444" />
      </g>
    );
  };

  const getPoseTransform = () => {
    switch (sprite.pose) {
      case 'walking':
        return 'translate(10, 0) rotate(2)';
      case 'sitting':
        return 'translate(0, 20) scale(0.9, 0.85)';
      case 'sleeping':
        return 'translate(0, 30) rotate(90)';
      case 'working':
        return 'translate(-5, 0) rotate(-5)';
      case 'combat':
        return 'translate(5, -5)';
      default:
        return '';
    }
  };

  return (
    <svg 
      width={size} 
      height={size * 1.2} 
      viewBox="0 0 400 500" 
      className={`character-sprite ${className}`}
      style={{ transform: getPoseTransform() }}
    >
      <defs>
        <linearGradient id={`skin-${sprite.race}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.skin} />
          <stop offset="100%" stopColor={colors.skin} stopOpacity="0.8" />
        </linearGradient>
        {isAroused && (
          <filter id="aroused-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#ff6666" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
          </filter>
        )}
      </defs>
      
      {sprite.pose !== 'sleeping' && <g>{getEars()}</g>}
      {getFace()}
      {getHair()}
      {getBody()}
      {getClothing()}
      {getArms()}
      {getLegs()}
      {getTail()}
      
      {isAroused && (
        <g filter="url(#aroused-glow)">
          <ellipse cx="200" cy="250" rx="60" ry="80" fill="none" stroke="#f88" strokeWidth="2" opacity="0.5" />
        </g>
      )}
    </svg>
  );
};

export default CharacterSVG;