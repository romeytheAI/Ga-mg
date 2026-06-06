import fs from 'fs';

const file = 'src/data/esLocations.ts';
let content = fs.readFileSync(file, 'utf8');

// Clean up duplicate 'danger'
content = content.replace(/danger: \d+,\n\s*danger: /g, 'danger: ');

// Find where brackets are missing and fix them properly.
// The error is `Expected "]" but found ":"` in `loc_es_vivec_city: {` because the previous `loc_es_cloudrest` actions array was not closed.

content = content.replace(
  /reward: \{ gold: 35, items: \['cloudrest_crystal'\], xp: 40 \} \},\n\n  loc_es_vivec_city: \{/g,
  "reward: { gold: 35, items: ['cloudrest_crystal'], xp: 40 } },\n    ],\n  },\n\n  loc_es_vivec_city: {"
);

content = content.replace(
  /reward: \{ xp: 150, items: \['daedric_crescent'\] \} \},\n\n  loc_es_wayrest: \{/g,
  "reward: { xp: 150, items: ['daedric_crescent'] } },\n    ],\n  },\n\n  loc_es_wayrest: {"
);

// loc_es_camlorn missing closing bracket? Let's check Sentinel
content = content.replace(
  /reward: \{ xp: 30 \} \},\n  loc_es_sentinel: \{/g,
  "reward: { xp: 30 } },\n    ],\n  },\n\n  loc_es_sentinel: {"
);

// We still have duplicate loc_es_sentinel, loc_es_sunforge, loc_es_rihad, loc_es_stros_m_kai from the original file
// Let's remove everything after the first `loc_es_sentinel` definition up to the next export or end of file if they are duplicates.
// The easiest is just finding where the duplicate starts.
