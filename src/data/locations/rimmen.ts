/**
 * Rimmen Location Module
 *
 * Region: Elsweyr (Anequina)
 *
 * Elder Scrolls location data for Rimmen.
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

export const rimmenData: LocationData = {
  id: "rimmen",
  name: "Rimmen",
  region: "Elsweyr (Anequina)",
  description: "An independent city-state in northern Elsweyr, heavily influenced by Imperial culture and architecture, built around ancient Akaviri structures.",
  activities: ["Marvel at the Baandari Trading Post", "Explore Akaviri ruins", "Trade with Imperial merchants", "Consult the Moon-Bishops"],
  npcs: [],
  events: [
    {
      name: "Baandari Market",
      description: "Browse the lively Baandari market for rare goods.",
      rewards: ["exotic_goods", "gold"],
    },
    {
      name: "Akaviri Remnants",
      description: "Discover an ancient Akaviri artifact hidden in the city.",
      rewards: ["lore_mastery_increase"],
    },
  ],
};

export default rimmenData;
