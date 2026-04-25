/**
 * Vampire Hunter Encounter Module
 * 
 * Ported from DOL: special-kylar / stalk
 * Difficulty: hard
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

export const vampire_hunterEncounter: EncounterData = {
  id: "vampire_hunter",
  name: "Vampire Hunter",
  description: "A vigilant vampire hunter has mistaken you for one of the undead.",
  enemyType: "vigilant",
  locationTypes: ["any"],
  difficulty: "hard",
  outcomes: [
    {
      type: "persuade",
      description: "Prove you are human",
    },
    {
      type: "flee",
      description: "Escape the accusation",
    },
    {
      type: "vampire",
      description: "Reveal your true nature",
      requirements: ["vampire"],
      risks: ["combat"],
    },
  ],
};

export default vampire_hunterEncounter;