/**
 * DOL Encounter Porter & Reskinner
 * 
 * This module provides the logic to port original Degrees of Lewdity (DOL) 
 * encounter archetypes into the Ga-mg (Elder Scrolls) universe.
 */

import { EncounterData } from './bandit_ambush';

/**
 * DOL Category -> Elder Scrolls Location Mapping
 */
export const DOL_CATEGORY_MAP: Record<string, string[]> = {
  'street': ['riften_alley', 'solitude_docks', 'windhelm_greyquarter'],
  'forest': ['falkreath_woods', 'rift_autumn_forest'],
  'beast': ['wilderness', 'cave', 'farm'],
  'school': ['winterhold_college', 'bard_college'],
  'prison': ['cidna_mine', 'castle_dour_dungeon'],
  'ocean': ['sea_of_ghosts', 'solitude_coast'],
  'hospital': ['temple_of_kynareth'],
  'church': ['temple_of_mara', 'hall_of_the_dead'],
  'brothel': ['haelgas_bunkhouse', 'the_ratway'],
  'strip_club': ['silver_blood_inn_stage', 'winking_skeever_event'],
};

/**
 * Reskins a DOL enemy type into an Elder Scrolls equivalent.
 */
export function reskinEnemy(originalType: string): string {
  const skins: Record<string, string> = {
    'thug': 'bandit',
    'wolf': 'ice_wolf',
    'bear': 'cave_bear',
    'tentacle': 'hermaeus_mora_tentacle',
    'slime': 'dwemer_oil_leak',
    'guard': 'imperial_guard',
    'doctor': 'restoration_expert',
    'teacher': 'lore_master',
    'pimp': 'crime_boss',
    'customer': 'wealthy_merchant',
  };
  return skins[originalType] || originalType;
}

/**
 * High-Volume Encounter Registry
 * Scaled to mirror the massive variety of DOL.
 */
export const DOL_PORTED_ENCOUNTERS: EncounterData[] = [
  {
    id: "cidna_mine_shakedown",
    name: "Cidna Mine Shakedown",
    description: "A group of Forsworn prisoners corners you in the dark damp corridors of the mine.",
    enemyType: "forsworn",
    locationTypes: ["prison", "dungeon"],
    difficulty: "hard",
    outcomes: [
      { type: "struggle", description: "Resist their demands" },
      { type: "comply", description: "Bide your time and obey" },
      { type: "bribe", description: "Offer your silver ore", requirements: ["inventory.silver_ore > 0"] },
    ]
  },
  {
    id: "mara_blessing_test",
    name: "Trial of Mara",
    description: "A priestess offers a cleansing ritual, but the incense is heavy and the atmosphere turns stifling.",
    enemyType: "priestess",
    locationTypes: ["temple", "church"],
    difficulty: "medium",
    outcomes: [
      { type: "meditate", description: "Focus on the divine" },
      { type: "embrace", description: "Give in to the warmth" },
    ]
  },
  {
    id: "apocrypha_whispers",
    name: "Whispers of Apocrypha",
    description: "Tentacles emerge from the black ink pools as Hermaeus Mora seeks to claim his price for knowledge.",
    enemyType: "daedra",
    locationTypes: ["dungeon", "library"],
    difficulty: "extreme",
    outcomes: [
      { type: "submit", description: "Surrender your mind to the Prince" },
      { type: "arcane_blast", description: "Blast the ink away", requirements: ["mana > 50"] },
    ]
  },
  // This list would scale to 100+ to achieve true parity
];

/**
 * Selects a contextually appropriate ported encounter.
 */
export function getPortedEncounter(locationType: string, difficulty: string): EncounterData | undefined {
  return DOL_PORTED_ENCOUNTERS.find(e => 
    e.locationTypes.includes(locationType) && (e.difficulty === difficulty || e.difficulty === 'scalable')
  );
}
