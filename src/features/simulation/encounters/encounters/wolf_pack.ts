/**
 * Wolf Pack Encounter Module
 * 
 * Ported from DOL: loc-wolfpack
 * Difficulty: easy
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

export const wolf_packEncounter: EncounterData = {
  id: "wolf_pack",
  name: "Wolf Pack",
  description: "A pack of hungry wolves emerges from the trees, circling you.",
  enemyType: "wolf",
  locationTypes: ["forest", "plains", "snow"],
  difficulty: "easy",
  outcomes: [
    {
      type: "combat",
      description: "Defend yourself",
    },
    {
      type: "climb",
      description: "Climb a tree",
      requirements: ["agility > 30"],
    },
    {
      type: "intimidate",
      description: "Show dominance",
      requirements: ["strength > 40"],
    },
  ],
};

export default wolf_packEncounter;