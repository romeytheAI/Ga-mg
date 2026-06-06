import fs from 'fs';
import path from 'path';

const moves = [
  { from: 'src/data/esLocations.ts', to: 'src/data/they.ts', search: './esLocations', replace: './they' },
  { from: 'src/data/esNPCs.ts', to: 'src/data/he.ts', search: './esNPCs', replace: './he' },
  { from: 'src/data/esEvents.ts', to: 'src/data/she.ts', search: '../data/esEvents', replace: '../data/she' },
  { from: 'src/data/esQuests.ts', to: 'src/data/it.ts', search: './esQuests', replace: './it' },
  { from: 'src/data/ElderScrollItem.ts', to: 'src/data/we.ts', search: './ElderScrollItem', replace: './we' }
];

for (const m of moves) {
  if (fs.existsSync(m.from)) {
    fs.renameSync(m.from, m.to);
  }
}

const filesToPatch = [
  'src/data/locations.ts',
  'src/utils/worldEventEngine.ts',
];

for (const f of filesToPatch) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    for (const m of moves) {
      content = content.replace(m.search, m.replace);
    }
    fs.writeFileSync(f, content);
  }
}
