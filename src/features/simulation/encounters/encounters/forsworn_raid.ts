/**
 * Forsworn Raid Encounter Module
 * 
 * Ported from DOL: loc-moor / base-combat
 * Difficulty: medium
 * 
 * Elder Scrolls reskin of original DOL encounter
 */

export interface EncounterOutcome {
  type: string;
  description: string;
  requirements?: string[];
  risks?: string[];
  effects?: string[];
}

export interface EncounterData {
  id: string;
  name: string;
  description: string;
  enemyType: string;
  locationTypes: string[];
  difficulty: string;
  outcomes: EncounterOutcome[];
}

export const forsworn_raidEncounter: EncounterData = {
  id: "forsworn_raid",
  name: "Forsworn Raid",
  description: "Reachmen warriors, painted and wild, descend upon you with primal fury.",
  enemyType: "forsworn",
  locationTypes: ["reach", "wilderness"],
  difficulty: "medium",
  outcomes: [
    {
      type: "combat",
      description: "Fight the Reachmen",
    },
    {
      type: "surrender",
      description: "Submit to their customs",
    },
    {
      type: "negotiate",
      description: "Speak of shared enemies",
      requirements: ["reach_knowledge > 20"],
    },
  ],
};

export default forsworn_raidEncounter;