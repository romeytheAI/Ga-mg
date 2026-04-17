import fs from 'fs';

const file = 'src/data/esLocations.ts';
let content = fs.readFileSync(file, 'utf8');

// There are a few remaining missing intents in `esLocations.ts`, particularly actions that have a different structure.
// This time, let's just make sure *every* object in the `actions` array has an `intent: 'explore'` if it lacks `intent:`
content = content.replace(/\{ id: '[^']+',(?!.*intent:)[^}]+\}/g, (match) => {
    return match.replace("label: '", "intent: 'explore', label: '");
});

// Since the regex above might be too strict or too loose:
// Look for any action `{ id: ... }` that doesn't have `intent: '` between `{` and `label: '`.
// Instead of complex regex, let's parse the file specifically at `{ id:`
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{ id:') && lines[i].includes('label:') && !lines[i].includes('intent:')) {
    // Determine intent from skill if possible
    let intent = 'explore';
    if (lines[i].includes("skill: 'social'")) intent = 'social';
    else if (lines[i].includes("skill: 'athletics'") || lines[i].includes("skill: 'foraging'")) intent = 'work';
    else if (lines[i].includes("skill: 'skulduggery'")) intent = 'crime';
    else if (lines[i].includes("skill: 'willpower'") || lines[i].includes("skill: 'magic'")) intent = 'study';

    lines[i] = lines[i].replace("label: '", `intent: '${intent}', label: '`);
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
