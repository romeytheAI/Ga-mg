import { LOCATIONS } from './src/data/locations.js';

let missing = [];
for (const [id, loc] of Object.entries(LOCATIONS)) {
  if (loc.actions) {
    for (const act of loc.actions) {
      if (!act.intent) missing.push(`${id}: ${act.id}`);
    }
  }
}
console.log(missing.length + " actions missing intent:", missing);
