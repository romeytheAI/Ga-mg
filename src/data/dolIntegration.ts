/**
 * DOL to Elder Scrolls Integration Module
 * 
 * This module integrates all content ported from Degrees of Lewdity (DOL)
 * and reskinned for Elder Scrolls lore into the Ga-mg project.
 * 
 * Ported Content:
 * - 7 NPCs with full dialogue trees
 * - 7 Locations with events and activities
 * - 10 Encounter types with multiple outcomes
 * 
 * Original DOL Content Sources:
 * - special-sydney -> Sigrid (Temple Priestess)
 * - special-whitney -> Wulfgar (Bandit)
 * - special-robin -> Ralof (Companion)
 * - special-kylar -> Kharjo (Caravan Guard)
 * - special-eden -> Eorlund (Blacksmith)
 * - special-avery -> Astrid (Dark Brotherhood)
 * - special-doren -> Delphine (Blade Agent)
 * 
 * - loc-temple -> Temple of Mara
 * - loc-alley/sewers -> The Ratway
 * - loc-wolfpack -> Wolf Pack encounters
 * - loc-forest -> Spriggan encounters
 * - loc-cave -> Draugr encounters
 * - base-combat -> Bandit/Forsworn encounters
 * - loc-prison -> Corrupt Guard encounters
 * - flavour-text-generators -> Social encounters
 */

// Import all ported NPCs
import {
  sigridDialogue,
  wulfgarDialogue,
  ralofDialogue,
  kharjoDialogue,
  eorlundDialogue,
  astridDialogue,
  delphineDialogue,
  portedNPCs,
} from './dialogue/dol_ported';

// Import all ported encounters from the encounters subdirectory
import {
  banditAmbushEncounter,
  wolfPackEncounter,
  sprigganAttackEncounter,
  draugrTombEncounter,
  forswornRaidEncounter,
  thievesGuildShakedownEncounter,
  imperialPatrolEncounter,
  vampireHunterEncounter,
  seductionAttemptEncounter,
  corruptGuardEncounter,
  encountersByDifficulty,
  encountersByLocation,
} from './encounters/index';

// Import all ported locations from the locations subdirectory
import {
  templeOfMaraData,
  ratwayData,
  skyforgeData,
  darkSanctuaryData,
  sleepingGiantData,
  khajiitCaravanData,
  jorrvaskrData,
  elderscrollsLocations,
} from './locations/index';

// Re-export for external use
export {
  sigridDialogue,
  wulfgarDialogue,
  ralofDialogue,
  kharjoDialogue,
  eorlundDialogue,
  astridDialogue,
  delphineDialogue,
  portedNPCs,
  banditAmbushEncounter,
  wolfPackEncounter,
  sprigganAttackEncounter,
  draugrTombEncounter,
  forswornRaidEncounter,
  thievesGuildShakedownEncounter,
  imperialPatrolEncounter,
  vampireHunterEncounter,
  seductionAttemptEncounter,
  corruptGuardEncounter,
  encountersByDifficulty,
  encountersByLocation,
  templeOfMaraData,
  ratwayData,
  skyforgeData,
  darkSanctuaryData,
  sleepingGiantData,
  khajiitCaravanData,
  jorrvaskrData,
  elderscrollsLocations,
};

// Export types
export type { NPCDialogue, DialogueLine } from './dialogue/dol_ported';
export type { EncounterData, EncounterOutcome } from './encounters/index';
export type { LocationData, LocationEvent } from './locations/index';

// Integration helper functions
export class DOLElderScrollsIntegration {
  /**
   * Get all ported NPCs as an array
   */
  static getAllNPCs() {
    return portedNPCs;
  }

  /**
   * Get NPC dialogue by ID
   */
  static getNPCDialogue(npcId: string) {
    const npcMap: Record<string, any> = {
      sigrid: sigridDialogue,
      wulfgar: wulfgarDialogue,
      ralof: ralofDialogue,
      kharjo: kharjoDialogue,
      eorlund: eorlundDialogue,
      astrid: astridDialogue,
      delphine: delphineDialogue,
    };
    return npcMap[npcId.toLowerCase()];
  }

  /**
   * Get location data by ID
   */
  static getLocation(locationId: string) {
    // Placeholder: Elder Scrolls location data not yet implemented
    const locationMap: Record<string, any> = {
      temple_of_mara: templeOfMaraData,
      ratway: ratwayData,
      skyforge: skyforgeData,
      dark_sanctuary: darkSanctuaryData,
      sleeping_giant: sleepingGiantData,
      khajiit_caravan: khajiitCaravanData,
      jorrvaskr: jorrvaskrData,
    };
    return locationMap[locationId.toLowerCase()] || null;
  }

  /**
   * Get encounter by ID
   */
  static getEncounter(encounterId: string) {
    const encounterMap: Record<string, any> = {
      bandit_ambush: banditAmbushEncounter,
      wolf_pack: wolfPackEncounter,
      spriggan_attack: sprigganAttackEncounter,
      draugr_tomb: draugrTombEncounter,
      forsworn_raid: forswornRaidEncounter,
      thieves_guild_shakedown: thievesGuildShakedownEncounter,
      imperial_patrol: imperialPatrolEncounter,
      vampire_hunter: vampireHunterEncounter,
      seduction_attempt: seductionAttemptEncounter,
      corrupt_guard: corruptGuardEncounter,
    };
    return encounterMap[encounterId.toLowerCase()];
  }

  /**
   * Get encounters suitable for a location type
   */
  static getEncountersForLocation(locationType: string) {
    return encountersByLocation[locationType as keyof typeof encountersByLocation] || [];
  }

  /**
   * Get random dialogue line for an NPC
   */
  static getRandomDialogue(npcId: string, category: string): string | null {
    const npc = this.getNPCDialogue(npcId);
    if (!npc || !npc.variants) return null;

    const lines = npc.variants[category as keyof typeof npc.variants];
    if (!lines || lines.length === 0) return null;

    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    return randomLine.text;
  }
}

export default DOLElderScrollsIntegration;
