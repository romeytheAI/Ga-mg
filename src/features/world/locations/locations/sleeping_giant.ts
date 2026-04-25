/**
 * Sleeping Giant Inn Location Module
 * 
 * Ported from DOL: special-doren
 * Region: Riverwood
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

export const sleeping_giantData: LocationData = {
  id: "sleeping_giant",
  name: "Sleeping Giant Inn",
  region: "Riverwood",
  description: "A cozy inn in the village of Riverwood. The basement holds secrets that most patrons never suspect.",
  activities: ["Rent a room for the night", "Gather rumors and information", "Meet with secret contacts", "Enjoy home-cooked meals"],
  npcs: ["delphine", "ralof"],
  events: [
    {
      name: "Secret Meeting",
      description: "Delphine reveals information about dragons",
      requirements: ["main_quest_progress", "trusted_status"],
    },
    {
      name: "Blade Training",
      description: "Learn ancient Blades combat techniques",
      rewards: ["combat_skill_increase"],
    },
  ],
};

export default sleeping_giantData;