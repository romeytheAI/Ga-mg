/**
 * Seduction Attempt Encounter Module
 * 
 * Ported from DOL: flavour-text-generators / special-masturbation
 * Difficulty: social
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

export const seduction_attemptEncounter: EncounterData = {
  id: "seduction_attempt",
  name: "Seduction Attempt",
  description: "An interested party makes advances, seeking intimate company.",
  enemyType: "npc",
  locationTypes: ["inn", "city", "temple"],
  difficulty: "social",
  outcomes: [
    {
      type: "accept",
      description: "Accept their advances",
      effects: ["lust_relief", "reputation_risk"],
    },
    {
      type: "decline_polite",
      description: "Politely refuse",
    },
    {
      type: "decline_harsh",
      description: "Reject harshly",
      effects: ["negative_reputation"],
    },
    {
      type: "tease",
      description: "Lead them on",
      effects: ["allure_increase"],
    },
  ],
};

export default seduction_attemptEncounter;