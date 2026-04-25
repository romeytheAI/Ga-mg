/**
 * Khajiit Caravan Location Module
 * 
 * Ported from DOL: special-kylar
 * Region: Travelling (Dawnstar, Riften, Whiterun)
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

export const khajiit_caravanData: LocationData = {
  id: "khajiit_caravan",
  name: "Khajiit Caravan",
  region: "Travelling (Dawnstar, Riften, Whiterun)",
  description: "A traveling caravan of Khajiit merchants, constantly on the move throughout Skyrim. They sell wares and news from distant lands.",
  activities: ["Trade for exotic goods", "Purchase moon sugar and skooma (illegal)", "Hear news from other provinces", "Hire caravan guards"],
  npcs: ["kharjo", "risaad"],
  events: [
    {
      name: "Moon Sugar Deal",
      description: "Purchase illegal substances",
      rewards: ["stress_relief", "illegal_goods"],
      risks: ["guard_detection", "addiction"],
    },
    {
      name: "Caravan Guard Duty",
      description: "Protect the caravan from bandits",
      rewards: ["gold", "caravan_favor", "exotic_goods"],
    },
  ],
};

export default khajiit_caravanData;