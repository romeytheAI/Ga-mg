/**
 * Elder Scrolls Encounters - Ported from DOL
 * 
 * All encounters reskinned from Degrees of Lewdity to fit Elder Scrolls lore
 */

// Combat Encounters
export { banditAmbushEncounter } from './bandit_ambush';
export { wolfPackEncounter } from './wolf_pack';
export { sprigganAttackEncounter } from './spriggan_attack';
export { draugrTombEncounter } from './draugr_tomb';
export { forswornRaidEncounter } from './forsworn_raid';

// Social Encounters
export { thievesGuildShakedownEncounter } from './thieves_guild_shakedown';
export { imperialPatrolEncounter } from './imperial_patrol';
export { vampireHunterEncounter } from './vampire_hunter';
export { seductionAttemptEncounter } from './seduction_attempt';
export { corruptGuardEncounter } from './corrupt_guard';

export type { EncounterData, EncounterOutcome } from './bandit_ambush';

// Encounter registry by difficulty
export const encountersByDifficulty = {
  easy: ['wolf_pack'],
  medium: ['forsworn_raid','imperial_patrol'],
  hard: ['spriggan_attack','draugr_tomb','vampire_hunter'],
  scalable: ['bandit_ambush','thieves_guild_shakedown'],
  social: ['seduction_attempt','corrupt_guard'],
};

// Encounter registry by location
export const encountersByLocation = {
  road: ['bandit_ambush','imperial_patrol'],
  wilderness: ['bandit_ambush','wolf_pack','forsworn_raid'],
  forest: ['bandit_ambush','wolf_pack','spriggan_attack'],
  city: ['thieves_guild_shakedown','imperial_patrol'],
  crypt: ['draugr_tomb'],
  inn: ['seduction_attempt'],
  prison: ['corrupt_guard'],
  any: ['vampire_hunter'],
};

export default encountersByDifficulty;
