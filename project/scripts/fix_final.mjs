import fs from 'fs';

const file = 'src/data/esLocations.ts';
let content = fs.readFileSync(file, 'utf8');

// There are multiple instances of missing closing brackets for actions array in esLocations.ts
content = content.replace(
  /(\} \},\n)(\s*)(loc_es_\w+: \{)/g,
  "$1    ],\n  },\n\n  $3"
);

// We still need to handle the last location if it's missing the bracket
content = content.replace(
  /(\} \},\n)(\};)/g,
  "$1    ],\n  },\n$2"
);

// Remove duplicate 'danger' keys
content = content.replace(/danger: \d+,\n\s*danger: /g, 'danger: ');

// Remove duplicated blocks (from loc_es_sentinel at line ~404 onwards)
const idx1 = content.indexOf('  loc_es_sentinel: {');
const idx2 = content.indexOf('  loc_es_sentinel: {', idx1 + 1);

if (idx2 > -1) {
  content = content.substring(0, idx2) + '};\n';
}

fs.writeFileSync(file, content, 'utf8');
