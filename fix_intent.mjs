import fs from 'fs';

const file = 'src/data/esLocations.ts';
let content = fs.readFileSync(file, 'utf8');

// The tests are failing because some actions in `src/data/esLocations.ts` are missing the `intent` property.
// Based on typical `intent` values in `src/data/locations.ts`, "social" can be 'social', "skulduggery" can be 'social' or 'work', "athletics" usually 'work' or 'combat'

const actionRegex = /({ id: '[^']+', label: '[^']+', skill: '([^']+)', difficulty: \d+, reward: \{[^}]*\} })/g;

content = content.replace(actionRegex, (match, fullMatch, skill) => {
    if (match.includes('intent:')) return match; // Already has it

    let intent = 'explore'; // Default intent
    if (skill === 'social') intent = 'social';
    else if (skill === 'athletics' || skill === 'foraging') intent = 'work';
    else if (skill === 'skulduggery') intent = 'crime';
    else if (skill === 'willpower' || skill === 'magic') intent = 'study';

    return fullMatch.replace("label: '", `intent: '${intent}', label: '`);
});


fs.writeFileSync(file, content, 'utf8');
