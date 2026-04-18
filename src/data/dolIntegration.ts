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
} from './dialogue/dol_ported/index';

// Import all ported locations
import {
  temple_of_maraData,
  ratwayData,
  skyforgeData,
  dark_sanctuaryData,
  sleeping_giantData,
  khajiit_caravanData,
  jorrvaskrData,
  senchalData,
  rimmenData,
  orcrestData,
  duneData,
  elderscrollsLocations,
} from './locations/index';

// Import all ported encounters
import {
  bandit_ambushEncounter,
  wolf_packEncounter,
  spriggan_attackEncounter,
  draugr_tombEncounter,
  forsworn_raidEncounter,
  thieves_guild_shakedownEncounter,
  imperial_patrolEncounter,
  vampire_hunterEncounter,
  seduction_attemptEncounter,
  corrupt_guardEncounter,
  encountersByDifficulty,
  encountersByLocation,
} from './encounters/index';

// Re-export for public API
export {
  sigridDialogue,
  wulfgarDialogue,
  ralofDialogue,
  kharjoDialogue,
  eorlundDialogue,
  astridDialogue,
  delphineDialogue,
  portedNPCs,
  temple_of_maraData,
  ratwayData,
  skyforgeData,
  dark_sanctuaryData,
  sleeping_giantData,
  khajiit_caravanData,
  jorrvaskrData,
  senchalData,
  rimmenData,
  orcrestData,
  duneData,
  elderscrollsLocations,
  bandit_ambushEncounter,
  wolf_packEncounter,
  spriggan_attackEncounter,
  draugr_tombEncounter,
  forsworn_raidEncounter,
  thieves_guild_shakedownEncounter,
  imperial_patrolEncounter,
  vampire_hunterEncounter,
  seduction_attemptEncounter,
  corrupt_guardEncounter,
  encountersByDifficulty,
  encountersByLocation,
};

// Export types
export { type NPCDialogue, type DialogueLine } from './dialogue/dol_ported/index';
export type { LocationData, LocationEvent } from './locations/index';
export type { EncounterData, EncounterOutcome } from './encounters/index';

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
    const locationMap: Record<string, any> = {
      temple_of_mara: temple_of_maraData,
      ratway: ratwayData,
      skyforge: skyforgeData,
      dark_sanctuary: dark_sanctuaryData,
      sleeping_giant: sleeping_giantData,
      khajiit_caravan: khajiit_caravanData,
      jorrvaskr: jorrvaskrData,
      senchal: senchalData,
      rimmen: rimmenData,
      orcrest: orcrestData,
      dune: duneData,
    };
    return locationMap[locationId.toLowerCase()];
  }

  /**
   * Get encounter by ID
   */
  static getEncounter(encounterId: string) {
    const encounterMap: Record<string, any> = {
      bandit_ambush: bandit_ambushEncounter,
      wolf_pack: wolf_packEncounter,
      spriggan_attack: spriggan_attackEncounter,
      draugr_tomb: draugr_tombEncounter,
      forsworn_raid: forsworn_raidEncounter,
      thieves_guild_shakedown: thieves_guild_shakedownEncounter,
      imperial_patrol: imperial_patrolEncounter,
      vampire_hunter: vampire_hunterEncounter,
      seduction_attempt: seduction_attemptEncounter,
      corrupt_guard: corrupt_guardEncounter,
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
