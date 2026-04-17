import fs from 'fs';

const file = 'src/data/esLocations.ts';
let content = fs.readFileSync(file, 'utf8');

// Use a simpler string replace since all actions start with `{ id:`
content = content.replace(/\{ id: '([^']+)', label: '([^']+)', skill/g, (match, id, label) => {
    // Determine a basic intent
    let intent = 'explore';
    if (id.includes('trade') || id.includes('haggle') || id.includes('buy')) intent = 'social';
    if (id.includes('work') || id.includes('assist')) intent = 'work';
    if (id.includes('hunt') || id.includes('spar')) intent = 'combat';
    if (id.includes('eavesdrop') || id.includes('steal') || id.includes('smuggle')) intent = 'crime';
    if (id.includes('study') || id.includes('read') || id.includes('learn')) intent = 'study';
    if (id.includes('drink') || id.includes('admire') || id.includes('listen')) intent = 'social';

    return `{ id: '${id}', intent: '${intent}', label: '${label}', skill`;
});

// Make sure we didn't duplicate `intent: '...'` if they already had it
content = content.replace(/intent: '[^']+', intent: '[^']+',/g, "intent: 'explore',");

fs.writeFileSync(file, content, 'utf8');
