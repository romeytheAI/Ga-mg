/**
 * Senchal Location Module
 *
 * Region: Elsweyr (Pellitine)
 *
 * Elder Scrolls location data for Senchal, the capital of Pellitine.
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

export const senchalData: LocationData = {
  id: "senchal",
  name: "Senchal",
  region: "Elsweyr (Pellitine)",
  description: "A sprawling coastal city in southern Elsweyr, known for its bustling ports, slums, and vibrant Black Keel tavern. It is the capital of Pellitine.",
  activities: ["Trade contraband", "Visit the Black Keel tavern", "Explore the slums", "Listen to Khajiit bards"],
  npcs: [],
  events: [
    {
      name: "Smuggler's Run",
      description: "Assist local smugglers with moving moon sugar.",
      rewards: ["gold", "exotic_goods"],
      risks: ["guard_detection"],
    },
    {
      name: "Tavern Brawl",
      description: "Get caught in a fight at the Black Keel tavern.",
      effects: ["stress_increase", "health_decrease"],
    },
  ],
};

export default senchalData;
