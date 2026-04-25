/**
 * The Ratway Location Module
 * 
 * Ported from DOL: loc-alley / loc-sewers
 * Region: Riften
 * 
 * Elder Scrolls reskin of original DOL location
 */

export interface LocationEvent {
  name: string;
  description: string;
  requirements?: string[];
  rewards?: string[];
  risks?: string[];
  effects?: string[];
  outcomes?: string[];
}

export interface LocationData {
  id: string;
  name: string;
  region: string;
  description: string;
  activities: string[];
  npcs: string[];
  events: LocationEvent[];
}

export const ratwayData: LocationData = {
  id: "ratway",
  name: "The Ratway",
  region: "Riften",
  description: "The dark underbelly of Riften, a maze of tunnels and sewers where the Thieves Guild operates. Danger lurks in every shadow.",
  activities: ["Meet with Guild contacts", "Fence stolen goods", "Gamble in underground dens", "Hire... unsavory services", "Hide from the law"],
  npcs: ["wulfgar", "brynjolf"],
  events: [
    {
      name: "Shakedown",
      description: "Guild enforcers demand protection money",
      requirements: ["in_ratway"],
      outcomes: ["pay gold", "fight", "flee"],
    },
    {
      name: "Black Market",
      description: "Find rare and illegal items for sale",
      rewards: ["rare_items", "information"],
    },
  ],
};

export default ratwayData;