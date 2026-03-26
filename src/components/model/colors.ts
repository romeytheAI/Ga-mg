export const raceColors: Record<string, { base: string; shadow: string; deepShadow: string; midHighlight: string; highLight: string; hairBase: string; hairShadow: string; eyeBase: string; horn?: string }> = {
  Altmer: {
    base: '#FAD26C', shadow: '#D0A13A', deepShadow: '#A2701F', midHighlight: '#FDF1B6', highLight: '#FFFFFF',
    hairBase: '#FFD700', hairShadow: '#CC9900', eyeBase: '#FFD700'
  },
  Argonian: {
    base: '#6B9D79', shadow: '#3E704E', deepShadow: '#22462E', midHighlight: '#90C09F', highLight: '#BCE8C9',
    hairBase: '#2F4F39', hairShadow: '#1A2F21', eyeBase: '#E6C200', horn: '#655340'
  },
  Bosmer: {
    base: '#CFA579', shadow: '#A17043', deepShadow: '#764620', midHighlight: '#EFD1A9', highLight: '#FFE9CF',
    hairBase: '#3E2112', hairShadow: '#1C0D05', eyeBase: '#351F11'
  },
  Breton: {
    base: '#F4D4C0', shadow: '#D4A385', deepShadow: '#A7704F', midHighlight: '#FEEFE6', highLight: '#FFFFFF',
    hairBase: '#4C2814', hairShadow: '#261106', eyeBase: '#2A527A'
  },
  Dunmer: {
    base: '#8797B2', shadow: '#566682', deepShadow: '#35425B', midHighlight: '#B1C2DB', highLight: '#DEE8F4',
    hairBase: '#151515', hairShadow: '#050505', eyeBase: '#D11C1C'
  },
  Imperial: {
    base: '#EFC19D', shadow: '#C28B5E', deepShadow: '#965D30', midHighlight: '#FFE4CB', highLight: '#FFF6EF',
    hairBase: '#382210', hairShadow: '#1A0E05', eyeBase: '#331B00'
  },
  Khajiit: {
    base: '#D1AF7B', shadow: '#A07E4A', deepShadow: '#705125', midHighlight: '#EFD3A9', highLight: '#FFECCB',
    hairBase: '#422F1B', hairShadow: '#1F140A', eyeBase: '#FFC800'
  },
  Nord: {
    base: '#FCE7DD', shadow: '#E2B8A4', deepShadow: '#BA8267', midHighlight: '#FFF8F4', highLight: '#FFFFFF',
    hairBase: '#E8B310', hairShadow: '#B58200', eyeBase: '#5283B2'
  },
  Orc: {
    base: '#7D9E46', shadow: '#4D6B21', deepShadow: '#2C400D', midHighlight: '#A8CB70', highLight: '#D3EF9F',
    hairBase: '#111111', hairShadow: '#000000', eyeBase: '#6B0000', horn: '#D3D3D3'
  },
  Redguard: {
    base: '#7C492B', shadow: '#4B2612', deepShadow: '#281005', midHighlight: '#A56D4A', highLight: '#D39D7A',
    hairBase: '#080808', hairShadow: '#000000', eyeBase: '#140D07'
  }
};

export const clothingColors: Record<string, { base: string; shadow: string; deepShadow: string; highlight: string; texture: string }> = {
  common_shirt: { base: '#EEDC9A', shadow: '#C9B167', deepShadow: '#9A803B', highlight: '#FFF4C8', texture: '#D1C288' },
  common_pants: { base: '#5D3D22', shadow: '#3E2511', deepShadow: '#241306', highlight: '#805937', texture: '#4C3019' },
  apprentice_robes: { base: '#1D3B76', shadow: '#0F2148', deepShadow: '#081126', highlight: '#34559C', texture: '#183265' },
  apprentice_pants: { base: '#2A2A2A', shadow: '#151515', deepShadow: '#090909', highlight: '#444444', texture: '#222222' },
  prison_pants: { base: '#9A8B7B', shadow: '#706151', deepShadow: '#4C4033', highlight: '#BCAC9A', texture: '#887968' },
  leather_tunic: { base: '#4F301B', shadow: '#311A0C', deepShadow: '#1C0D05', highlight: '#6B452A', texture: '#422715' },
  leather_pants: { base: '#311A0C', shadow: '#1E0E05', deepShadow: '#100500', highlight: '#4A2B17', texture: '#261208' },
  rags_top: { base: '#A8998A', shadow: '#7A6B5C', deepShadow: '#524538', highlight: '#C5B7A9', texture: '#948677' },
  rags_bottom: { base: '#A8998A', shadow: '#7A6B5C', deepShadow: '#524538', highlight: '#C5B7A9', texture: '#948677' }
};
