/**
 * Spriggan Attack Encounter Module
 * 
 * Ported from DOL: loc-forest / tentacle-world
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

export const spriggan_attackEncounter: EncounterData = {
  id: "spriggan_attack",
  name: "Spriggan Attack",
  description: "A nature spirit, corrupted or defending its grove, lashes out at you.",
  enemyType: "spriggan",
  locationTypes: ["forest", "grove"],
  difficulty: "hard",
  outcomes: [
    {
      type: "combat",
      description: "Battle the spirit",
    },
    {
      type: "appease",
      description: "Offer a peace tribute",
      requirements: ["nature_lore > 30"],
    },
    {
      type: "flee",
      description: "Run from the grove",
    },
  ],
};

export default spriggan_attackEncounter;