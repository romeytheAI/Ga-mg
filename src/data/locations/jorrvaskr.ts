/**
 * Jorrvaskr Location Module
 * 
 * Ported from DOL: loc-home / special-robin
 * Region: Whiterun
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

export const jorrvaskrData: LocationData = {
  id: "jorrvaskr",
  name: "Jorrvaskr",
  region: "Whiterun",
  description: "The legendary mead hall of the Companions, built from the timbers of a great ship. Here, warriors gather to drink, fight, and seek glory.",
  activities: ["Join the Companions", "Train in martial combat", "Take on mercenary contracts", "Drink and feast with warriors"],
  npcs: ["ralof", "aela", "kodlak"],
  events: [
    {
      name: "Trial of Honor",
      description: "Prove yourself worthy of the Companions",
      requirements: ["combat_skill > 30"],
      rewards: ["companionship", "skyforge_access"],
    },
    {
      name: "Mead Hall Brawl",
      description: "Friendly combat with fellow warriors",
      rewards: ["combat_exp", "reputation"],
    },
  ],
};

export default jorrvaskrData;