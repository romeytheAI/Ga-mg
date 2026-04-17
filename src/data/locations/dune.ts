/**
 * Dune Location Module
 *
 * Region: Elsweyr (Reaper's March border)
 *
 * Elder Scrolls location data for Dune.
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

export const duneData: LocationData = {
  id: "dune",
  name: "Dune",
  region: "Elsweyr",
  description: "A prominent city in western Elsweyr, known as a holy site and a crucial stopping point for travelers venturing between Valenwood, Cyrodiil, and Elsweyr.",
  activities: ["Visit the Two Moons Path temple", "Trade with passing caravans", "Seek spiritual guidance", "Explore the borderlands"],
  npcs: [],
  events: [
    {
      name: "Moon-Bishop's Sermon",
      description: "Listen to a sermon about the intricate lunar phases.",
      rewards: ["willpower_increase", "lore_mastery_increase"],
    },
    {
      name: "Border Skirmish",
      description: "Witness or get involved in a minor conflict at the regional border.",
      risks: ["combat", "health_decrease"],
      rewards: ["combat_experience"],
    },
  ],
};

export default duneData;
