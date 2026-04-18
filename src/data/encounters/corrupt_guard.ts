/**
 * Corrupt Guard Encounter Module
 * 
 * Ported from DOL: loc-prison / loc-police
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

export const corrupt_guardEncounter: EncounterData = {
  id: "corrupt_guard",
  name: "Corrupt Guard",
  description: "A guard abuses their authority, demanding favors for your freedom.",
  enemyType: "guard",
  locationTypes: ["prison", "jail", "guardpost"],
  difficulty: "social",
  outcomes: [
    {
      type: "submit",
      description: "Endure their demands",
      effects: ["trauma", "freedom"],
    },
    {
      type: "refuse",
      description: "Refuse",
      effects: ["extended_sentence"],
    },
    {
      type: "report",
      description: "Report the abuse",
      requirements: ["evidence"],
      risks: ["ignored", "punished"],
    },
    {
      type: "bribe",
      description: "Offer gold instead",
      requirements: ["gold > 200"],
    },
  ],
};

export default corrupt_guardEncounter;