/**
 * DOL Ported Content - Elder Scrolls Reskin
 * 
 * This module contains all NPCs ported from Degrees of Lewdity (DOL)
 * and reskinned for Elder Scrolls lore.
 * 
 * Original DOL NPCs -> Elder Scrolls equivalents:
 * - Sydney -> Sigrid (Priestess of Mara)
 * - Whitney -> Wulfgar (Bandit Enforcer)
 * - Robin -> Ralof (Stormcloak Veteran)
 * - Kylar -> Kharjo (Khajiit Caravan Guard)
 * - Eden -> Eorlund Gray-Mane (Master Blacksmith)
 * - Avery -> Astrid (Dark Brotherhood Leader)
 * - Doren -> Delphine (Blade Agent)
 */

// NPC Dialogue Modules
export { sigridDialogue } from './sigrid';
export { wulfgarDialogue } from './wulfgar';
export { ralofDialogue } from './ralof';
export { kharjoDialogue } from './kharjo';
export { eorlundDialogue } from './eorlund';
export { astridDialogue } from './astrid';
export { delphineDialogue } from './delphine';

// Re-export types
export type { NPCDialogue, DialogueLine } from './sigrid';

// NPC Registry
export const portedNPCs = [
  { id: 'sigrid', name: 'Sigrid', race: 'Nord', role: 'Priestess of Mara', location: 'Temple of Mara (Riften)''},
  { id: 'wulfgar', name: 'Wulfgar', race: 'Nord', role: 'Bandit Enforcer', location: 'Riften Ratway''},
  { id: 'ralof', name: 'Ralof', race: 'Nord', role: 'Stormcloak Veteran', location: 'Riverwood''},
  { id: 'kharjo', name: 'Kharjo', race: 'Khajiit', role: 'Caravan Guard', location: 'Khajiit Caravan''},
  { id: 'eorlund', name: 'Eorlund Gray-Mane', race: 'Nord', role: 'Master Blacksmith', location: 'Skyforge (Whiterun)''},
  { id: 'astrid', name: 'Astrid', race: 'Nord', role: 'Dark Brotherhood Leader', location: 'Dawnstar Sanctuary''},
  { id: 'delphine', name: 'Delphine', race: 'Breton', role: 'Blade Agent', location: 'Sleeping Giant Inn''},
];

export default portedNPCs;
