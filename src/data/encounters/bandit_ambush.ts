/**
 * Bandit Ambush Encounter Module
 * 
 * Ported from DOL: base-combat / overworld-plains
 * Difficulty: scalable
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

export const bandit_ambushEncounter: EncounterData = {
  id: "bandit_ambush",
  name: "Bandit Ambush",
  description: "Highway bandits block the road, demanding your coin or your life.",
  enemyType: "bandit",
  locationTypes: ["road", "wilderness", "forest"],
  difficulty: "scalable",
  outcomes: [
    {
      type: "combat",
      description: "Fight your way through",
    },
    {
      type: "surrender",
      description: "Give them what they want",
    },
    {
      type: "flee",
      description: "Try to escape",
    },
    {
      type: "persuade",
      description: "Talk your way out",
      requirements: ["speechcraft > 40"],
    },
  ],
};

export default bandit_ambushEncounter;