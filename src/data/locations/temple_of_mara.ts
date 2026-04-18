/**
 * Temple of Mara Location Module
 * 
 * Ported from DOL: loc-temple
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

export const temple_of_maraData: LocationData = {
  id: "temple_of_mara",
  name: "Temple of Mara",
  region: "Riften",
  description: "A sacred sanctuary dedicated to the Divine Mara, Goddess of Love and Compassion. The temple offers healing, blessings, and spiritual guidance to all who enter.",
  activities: ["Receive blessings from priestesses", "Purchase healing potions", "Meditate for spiritual restoration", "Assist with temple duties for gold", "Confess sins to reduce guilt/trauma"],
  npcs: ["sigrid"],
  events: [
    {
      name: "Mara's Embrace",
      description: "Receive a powerful blessing that increases charisma and reduces trauma",
      requirements: ["purity > 50", "donation > 100 gold"],
    },
    {
      name: "Temple Service",
      description: "Help clean the temple and assist worshippers",
      rewards: ["gold", "temple_favor", "purity_increase"],
    },
  ],
};

export default temple_of_maraData;