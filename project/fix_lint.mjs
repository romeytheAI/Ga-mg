import fs from 'fs';
const esEventsFile = 'src/data/esEvents.ts';
let eventsContent = fs.readFileSync(esEventsFile, 'utf8');

eventsContent = eventsContent.replace(/danger: \d+,\n\s*danger: /g, 'danger: ');
fs.writeFileSync(esEventsFile, eventsContent, 'utf8');
