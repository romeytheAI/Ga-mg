/**
 * Skyforge Location Module
 * 
 * Ported from DOL: special-eden
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

export const skyforgeData: LocationData = {
  id: "skyforge",
  name: "Skyforge",
  region: "Whiterun",
  description: "An ancient forge older than the city itself, said to have been used by the Companions since the time of Ysgramor. The steel forged here is legendary.",
  activities: ["Commission custom weapons and armor", "Upgrade equipment", "Learn smithing techniques", "Join the Companions"],
  npcs: ["eorlund"],
  events: [
    {
      name: "Skyforge Secret",
      description: "Eorlund shares ancient forging techniques",
      requirements: ["companions_member", "high_reputation"],
    },
    {
      name: "Legendary Commission",
      description: "Request a weapon forged from rare materials",
      rewards: ["legendary_weapon"],
    },
  ],
};

export default skyforgeData;