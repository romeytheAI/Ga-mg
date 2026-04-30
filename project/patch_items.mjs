import fs from 'fs';
const file = 'src/data/items.ts';
let code = fs.readFileSync(file, 'utf8');

const newItems = `
  sweetroll: {
    id: 'sweetroll',
    name: 'Sweetroll',
    description: 'A delicious pastry with sweet white icing. A favorite across Tamriel.',
    value: 5,
    type: 'consumable',
    stats: { health: 10, stress: -5 }
  },
  soul_gem: {
    id: 'soul_gem',
    name: 'Filled Soul Gem',
    description: 'A crystalline stone pulsating with the trapped energy of a living soul. Essential for enchanting.',
    value: 150,
    type: 'material',
    stats: { willpower: 5 }
  },
  welkynd_stone: {
    id: 'welkynd_stone',
    name: 'Welkynd Stone',
    description: 'A glowing meteoric glass stone created by the Ayleids. It hums with latent magicka.',
    value: 200,
    type: 'consumable',
    stats: { willpower: 25, stress: -10 }
  },
  skooma: {
    id: 'skooma',
    name: 'Skooma',
    description: 'An illegal, highly addictive narcotic refined from Moon Sugar. Grants a burst of energy followed by lethargy.',
    value: 50,
    type: 'consumable',
    stats: { stress: -20, health: -10, corruption: 5 }
  },
`;

code = code.replace(/};\s*$/, newItems + '\n};\n');
fs.writeFileSync(file, code);
