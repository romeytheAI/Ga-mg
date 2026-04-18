/**
 * Elder Scrolls Encounters - Ported from DOL
 * 
 * All encounters reskinned from Degrees of Lewdity to fit Elder Scrolls lore
 */

// Combat Encounters
export { bandit_ambushEncounter } from './bandit_ambush';
export { wolf_packEncounter } from './wolf_pack';
export { spriggan_attackEncounter } from './spriggan_attack';
export { draugr_tombEncounter } from './draugr_tomb';
export { forsworn_raidEncounter } from './forsworn_raid';

// Social Encounters
export { thieves_guild_shakedownEncounter } from './thieves_guild_shakedown';
export { imperial_patrolEncounter } from './imperial_patrol';
export { vampire_hunterEncounter } from './vampire_hunter';
export { seduction_attemptEncounter } from './seduction_attempt';
export { corrupt_guardEncounter } from './corrupt_guard';

export type { EncounterData, EncounterOutcome } from './bandit_ambush';

// Encounter registry by difficulty
export const encountersByDifficulty = {
  easy: ['wolf_pack'],
  medium: ['forsworn_raid', 'imperial_patrol'],
  hard: ['spriggan_attack', 'draugr_tomb', 'vampire_hunter'],
  scalable: ['bandit_ambush', 'thieves_guild_shakedown'],
  social: ['seduction_attempt', 'corrupt_guard'],
};

// Encounter registry by location
export const encountersByLocation = {
  road: ['bandit_ambush', 'imperial_patrol'],
  wilderness: ['bandit_ambush', 'wolf_pack', 'forsworn_raid'],
  forest: ['bandit_ambush', 'wolf_pack', 'spriggan_attack'],
  city: ['thieves_guild_shakedown', 'imperial_patrol'],
  crypt: ['draugr_tomb'],
  inn: ['seduction_attempt'],
  prison: ['corrupt_guard'],
  any: ['vampire_hunter'],
};

export default encountersByDifficulty;
