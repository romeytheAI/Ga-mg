import fs from 'fs';

const file = 'src/data/esLocations.ts';
let content = fs.readFileSync(file, 'utf8');

// A few more `intent` could be missing where action uses slightly different syntax, e.g., missing spaces.
// Let's parse JSON-like format roughly or use a broader regex.

const actionRegex = /({ id: '[^']+', label: '[^']+', skill: '[^']+', difficulty: \d+, reward: [^}]+? \})/g;

content = content.replace(actionRegex, (match) => {
    if (match.includes('intent:')) return match;

    // Extract skill to determine default intent
    const skillMatch = match.match(/skill: '([^']+)'/);
    const skill = skillMatch ? skillMatch[1] : '';

    let intent = 'explore'; // Default intent
    if (skill === 'social') intent = 'social';
    else if (skill === 'athletics' || skill === 'foraging') intent = 'work';
    else if (skill === 'skulduggery') intent = 'crime';
    else if (skill === 'willpower' || skill === 'magic') intent = 'study';

    return match.replace("label: '", `intent: '${intent}', label: '`);
});

// A fallback regex for actions matching other shapes
const actionFallbackRegex = /({ id: '[^']+', label: '[^']+', [^}]+})/g;
content = content.replace(actionFallbackRegex, (match) => {
    if (match.includes('intent:')) return match;

    const skillMatch = match.match(/skill: '([^']+)'/);
    const skill = skillMatch ? skillMatch[1] : '';

    let intent = 'explore'; // Default intent
    if (skill === 'social') intent = 'social';
    else if (skill === 'athletics' || skill === 'foraging') intent = 'work';
    else if (skill === 'skulduggery') intent = 'crime';
    else if (skill === 'willpower' || skill === 'magic') intent = 'study';

    return match.replace("label: '", `intent: '${intent}', label: '`);
});


fs.writeFileSync(file, content, 'utf8');
