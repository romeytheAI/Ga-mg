/**
 * Orcrest Location Module
 *
 * Region: Elsweyr (Anequina)
 *
 * Elder Scrolls location data for Orcrest.
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

export const orcrestData: LocationData = {
  id: "orcrest",
  name: "Orcrest",
  region: "Elsweyr (Anequina)",
  description: "A major city situated in the harsh deserts of northern Elsweyr. Historically known as a center of Khajiit culture, though repeatedly devastated by the Knahaten Flu.",
  activities: ["Explore the quarantined districts", "Scavenge for forgotten relics", "Avoid flu remnants", "Visit the martial arenas"],
  npcs: [],
  events: [
    {
      name: "Flu Remnants",
      description: "Encounter an area still marked by the Knahaten Flu.",
      risks: ["disease", "stress_increase"],
    },
    {
      name: "Arena Fight",
      description: "Watch or participate in a martial contest in the dry sands.",
      rewards: ["gold", "combat_experience"],
    },
  ],
};

export default orcrestData;
