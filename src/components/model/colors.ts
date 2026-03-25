export const raceColors: Record<string, { skin: string; darkSkin: string; hair: string; eye: string; horn?: string }> = {
  Altmer: { skin: '#FDE08B', darkSkin: '#D4B859', hair: '#FFC83D', eye: '#D9B300' },
  Argonian: { skin: '#5B8B67', darkSkin: '#3A5F44', hair: '#2D4A35', eye: '#E6C200', horn: '#8B7355' },
  Bosmer: { skin: '#D2A679', darkSkin: '#A67C52', hair: '#4A2511', eye: '#402010' },
  Breton: { skin: '#FCE4D6', darkSkin: '#E3C2B0', hair: '#663300', eye: '#336699' },
  Dunmer: { skin: '#78869E', darkSkin: '#505B6F', hair: '#1A1A1A', eye: '#CC0000' },
  Imperial: { skin: '#F5D0B5', darkSkin: '#D9A986', hair: '#4D3319', eye: '#4D2600' },
  Khajiit: { skin: '#C6A67A', darkSkin: '#9E825A', hair: '#5C4329', eye: '#FFD700' }, // Fur colors essentially
  Nord: { skin: '#FFEBE0', darkSkin: '#E6C6B8', hair: '#E6B800', eye: '#6699CC' },
  Orc: { skin: '#6B8E23', darkSkin: '#4A6318', hair: '#1A1A1A', eye: '#8B0000', horn: '#E0E0E0' }, // Tusks act as horns color
  Redguard: { skin: '#8C5A3C', darkSkin: '#5C3822', hair: '#000000', eye: '#261A10' }
};

export const clothingColors: Record<string, string> = {
  common_shirt: '#EEDC9A', // Unbleached linen
  common_pants: '#654321', // Brown cloth
  apprentice_robes: '#224488', // Blue mage robes
  apprentice_pants: '#333333',
  prison_pants: '#A09080', // Sackcloth
  leather_tunic: '#5C3A21',
  leather_pants: '#3A2010',
  rags_top: '#B0A090',
  rags_bottom: '#B0A090'
};
