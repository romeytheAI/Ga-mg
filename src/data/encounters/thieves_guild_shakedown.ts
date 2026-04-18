/**
 * Guild Shakedown Encounter Module
 * 
 * Ported from DOL: loc-alley / special-briar
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

export const thieves_guild_shakedownEncounter: EncounterData = {
  id: "thieves_guild_shakedown",
  name: "Guild Shakedown",
  description: "Thieves Guild members corner you, demanding tribute for operating in their territory.",
  enemyType: "thief",
  locationTypes: ["city", "ratway"],
  difficulty: "scalable",
  outcomes: [
    {
      type: "pay",
      description: "Pay the protection money",
    },
    {
      type: "refuse",
      description: "Refuse and fight",
    },
    {
      type: "guild_member",
      description: "Claim Guild affiliation",
      requirements: ["thieves_guild_member"],
    },
    {
      type: "intimidate",
      description: "Show you are not a victim",
      requirements: ["reputation > 50"],
    },
  ],
};

export default thieves_guild_shakedownEncounter;