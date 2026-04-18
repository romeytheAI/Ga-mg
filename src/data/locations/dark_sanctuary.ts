/**
 * Dark Brotherhood Sanctuary Location Module
 * 
 * Ported from DOL: special-avery
 * Region: Dawnstar
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

export const dark_sanctuaryData: LocationData = {
  id: "dark_sanctuary",
  name: "Dark Brotherhood Sanctuary",
  region: "Dawnstar",
  description: "Hidden beneath an abandoned shack, this sanctuary houses the last remnants of the Dark Brotherhood in Skyrim. The air smells of death and incense.",
  activities: ["Accept assassination contracts", "Train in stealth and murder", "Perform the Black Sacrament", "Seek Sithis's blessing"],
  npcs: ["astrid"],
  events: [
    {
      name: "The Contract",
      description: "Receive a target for elimination",
      requirements: ["dark_brotherhood_member"],
      rewards: ["gold", "reputation"],
    },
    {
      name: "Void Embrace",
      description: "Commune with the Dread Father Sithis",
      effects: ["trauma_reduction", "corruption_increase"],
    },
  ],
};

export default dark_sanctuaryData;