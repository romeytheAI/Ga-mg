/**
 * Draugr Awakening Encounter Module
 * 
 * Ported from DOL: loc-cave / loc-underground
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

export const draugr_tombEncounter: EncounterData = {
  id: "draugr_tomb",
  name: "Draugr Awakening",
  description: "Ancient Nordic dead stir in their crypt, disturbed by your presence.",
  enemyType: "draugr",
  locationTypes: ["crypt", "cave", "ruin"],
  difficulty: "hard",
  outcomes: [
    {
      type: "combat",
      description: "Put them back to rest",
    },
    {
      type: "sneak",
      description: "Sneak past undetected",
      requirements: ["sneak > 50"],
    },
    {
      type: "turn_undead",
      description: "Use holy magic",
      requirements: ["restoration > 30"],
    },
  ],
};

export default draugr_tombEncounter;