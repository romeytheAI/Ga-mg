/**
 * Blue Palace Location Module
 * 
 * Region: Solitude
 * 
 * The headquarters of the East Empire Company, a sprawling trade complex
 * overlooking the Bay. Home to the Imperial East Empire Trading Company.
 */

export interface LocationEvent {
  name: string;
  description: string;
  requirements?: string[];
  rewards?: string[];
  risks?: string[];
  effects?: string[];
  outcomes?: string[];
  dialogue?: {
    option: string;
    response: string;
    stat_deltas?: Record<string, number>;
  }[];
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

export const blue_palaceData: LocationData = {
  id: "blue_palace",
  name: "Blue Palace",
  region: "Solitude",
  description: "The magnificent headquarters of the East Empire Company dominates the southern cliffs of Solitude. Its blue-tinted stonework gleams in the sun, housing仓库 full of rare goods from across Tamriel. Merchants, merchants, and officials bustle through its halls.",
  activities: [
    "Apply for merchant position",
    "Purchase rare imported goods",
    "Bid on elite trade goods",
    "Report piracy for bounty",
    "Negotiate trade contracts",
    "Inquire about shipping routes",
    "Smuggle contraband (risk: guards)",
    "Bribe customs official"
  ],
  npcs: ["gerund", "facelia", "ingjard"],
  events: [
    {
      name: "Merchant Application",
      description: "Apply for a position with the East Empire Company",
      requirements: ["speech > 30", "gold > 500"],
      rewards: ["east_empire_trade_access", "merchant_position"],
      outcomes: ["Approved as apprentice merchant", "Rejected - try again later"]
    },
    {
      name: "Rare Goods Auction",
      description: "Bid on exotic goods imported from across Tamriel",
      requirements: ["gold > 1000"],
      rewards: ["rare_item", "imperial_favor"],
      outcomes: ["Won auction", "Outbid", "Item counterfeit - tricked"]
    },
    {
      name: "Piracy Report",
      description: "Report pirate activity to claim bounty",
      requirements: ["evidence > 1"],
      rewards: ["gold", "imperial_favor", "title"],
      risks: ["false_reporting_fine"],
      outcomes: ["Bounty claimed", "Investigation pending", "Denied - insufficient evidence"]
    },
    {
      name: "Contract Negotiation",
      description: "Negotiate favorable trade terms",
      dialogue: [
        {
          option: "Request exclusive rights",
          response: "That would require significant investment, but we're listening...",
          stat_deltas: { speech: 5, gold: -200 }
        },
        {
          option: "Propose bulk trade",
          response: "A sound business proposition. We appreciate reliability.",
          stat_deltas: { gold: 100 }
        },
        {
          option: "Ask about Khajiit routes",
          response: "The moonsuggers? Dangerous but profitable. Ask at the docks.",
          stat_deltas: { intelligence: 2 }
        }
      ],
      outcomes: ["Contract secured", "Terms rejected", "Counter-offer presented"]
    },
    {
      name: "Contraband Attempt",
      description: "Attempt to smuggle illegal goods past customs",
      requirements: [],
      risks: ["arrest", "fine", "imperial_favor_loss"],
      effects: ["theft_skill_gain"],
      outcomes: ["Smuggled successfully", "Caught and detained", "Bribed your way out"]
    }
  ],
};

export default blue_palaceData;