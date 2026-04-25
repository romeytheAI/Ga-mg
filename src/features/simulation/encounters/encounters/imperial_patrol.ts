/**
 * Imperial Patrol Encounter Module
 * 
 * Ported from DOL: loc-police / loc-street
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

export const imperial_patrolEncounter: EncounterData = {
  id: "imperial_patrol",
  name: "Imperial Patrol",
  description: "Imperial Legionnaires stop you, questioning your business on the road.",
  enemyType: "imperial_soldier",
  locationTypes: ["road", "city", "checkpoint"],
  difficulty: "medium",
  outcomes: [
    {
      type: "comply",
      description: "Answer their questions",
    },
    {
      type: "bribe",
      description: "Offer a bribe",
      requirements: ["gold > 100"],
    },
    {
      type: "stormcloak",
      description: "Reveal Stormcloak allegiance",
      requirements: ["stormcloak_member"],
      risks: ["arrest"],
    },
    {
      type: "flee",
      description: "Run for it",
    },
  ],
};

export default imperial_patrolEncounter;