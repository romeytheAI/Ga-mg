/**
 * Dragontide Location Module
 * 
 * Region: Solitude
 * 
 * A network of caves beneath the Solitude cliffs, used by pirates and smugglers.
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

export const dragontideData: LocationData = {
  id: "dragontide",
  name: "Dragontide",
  region: "Solitude",
  description: "A hidden network of sea caves beneath Solitude's cliffs, accessible only at low tide. Pirates and smugglers use Dragontide as a base—illegal goods are unloaded here, divided among crews, and sold through black market contacts. The smell of salt and secrets hangs heavy in the air.",
  activities: [
    "Contact pirate crew",
    "Purchase contraband",
    "Smuggle goods into Solitude",
    "Seek sea passage",
    "Hire pirate ship",
    "Buy stolen merchandise",
    "Hide from authorities",
    "Join pirate crew"
  ],
  npcs: ["toothgnaw", "giant", "cooler"],
  events: [
    {
      name: "Pirate Contact",
      description: "Make contact with local pirate crews",
      requirements: ["theft > 20"],
      rewards: ["pirate_connection", "contraband_access"],
      dialogue: [
        {
          option: "Offer your services",
          response: "You be useful. We need strong backs. Half share, like.",
          stat_deltas: { gold: 50 }
        },
        {
          option: "Ask about work",
          response: "There's a ship coming in tonight. Need people with quick hands.",
          stat_deltas: { intelligence: 2 }
        },
        {
          option: "Threaten to inform",
          response: "You wouldn't. The guards wouldn't believe you anyway.",
          stat_deltas: { combat: 2 }
        }
      ],
      outcomes: ["Pirates trust you", "Rejected - not suitable", "Threat worked - coerced alliance"]
    },
    {
      name: "Contraband Purchase",
      description: "Purchase illegal goods from pirates",
      requirements: ["gold > 100"],
      rewards: ["contraband_item"],
      risks: ["arrest", "scammed"],
      dialogue: [
        {
          option: "Purchase flin",
          response: "Good stuff. Kept dry all the way from Skyrim.",
          stat_deltas: { gold: 100 }
        },
        {
          option: "Buy stolen scrolls",
          response: "Acquired合法 from a Colovian noble's warehouse. Don't ask.",
          stat_deltas: { gold: 150 }
        },
        {
          option: "Request Dwemer artifacts",
          response: "Careful, friend. Those artifacts have curse markers. Double price.",
          stat_deltas: { gold: 300 }
        }
      ],
      outcomes: ["Successful purchase", "Counterfeit - scammed", "Seller fled with gold"]
    },
    {
      name: "Smuggling Operation",
      description: "Smuggle goods into Solitude through hidden routes",
      requirements: ["theft > 25", "gold > 50"],
      rewards: ["gold", "reputation"],
      risks: ["arrest", "injury", "theft_skill_gain"],
      dialogue: [
        {
          option: "Use secret tunnel",
          response: "The old drainage tunnel. Goes right under the palace walls.",
          stat_deltas: { gold: 75, theft: 5 }
        },
        {
          option: "Bribe dock guard",
          response: "Ser Aldric? He'll look the other way for twenty gold.",
          stat_deltas: { gold: -20 }
        },
        {
          option: "Fake manifest",
          response: "Good thinking. Present as 'provisions' and it's all good.",
          stat_deltas: { gold: 100, intelligence: 3 }
        }
      ],
      outcomes: ["Delivered successfully", "Caught - arrested", "Discovered contraband - bribed"]
    },
    {
      name: "Sea Passage",
      description: "Seek passage on a pirate ship to other ports",
      requirements: ["gold > 25"],
      rewards: ["travel"],
      dialogue: [
        {
          option: "Request passage to Windhelm",
          response: "The north? Dangerous waters. Fifty gold, non-refundable.",
          stat_deltas: { gold: 50 }
        },
        {
          option: "Ask for Dawnstar",
          response: "Quiet harbor. Thirty gold.",
          stat_deltas: { gold: 30 }
        },
        {
          option: "Request unknown destination",
          response: "We go where the money is. Name your price.",
          stat_deltas: { gold: 100 }
        }
      ],
      outcomes: ["Passage secured", "Ship full - next voyage", "Captain refuses destination"]
    },
    {
      name: "Pirate Ship Hiring",
      description: "Hire a pirate vessel for transport or raiding",
      requirements: ["gold > 200"],
      rewards: ["ship_access", "loot"],
      dialogue: [
        {
          option: "Hire for transport",
          response: "A fast ship, experienced crew. You'll arrive safe or your gold back.",
          stat_deltas: { gold: 200 }
        },
        {
          option: "Propose joint raiding",
          response: "Now you're talking! We'll hit the supply convoy together.",
          stat_deltas: { gold: 500 }
        },
        {
          option: "Request crew backup",
          response: "Need muscle? We provide two warriors. Additional fee.",
          stat_deltas: { gold: 100 }
        }
      ],
      outcomes: ["Ship secured", "Too expensive", "Crew unavailable"]
    },
    {
      name: "Stolen Merchandise",
      description: "Buy stolen goods at fraction of value",
      requirements: ["gold > 50"],
      rewards: ["discounted_items"],
      risks: ["arrest", "fraud"],
      dialogue: [
        {
          option: "Nobility goods",
          response: "Fine silks, jewelry. The Jarl's cousin was... careless.",
          stat_deltas: { gold: 75 }
        },
        {
          option: "Military supplies",
          response: "Stolen from a Legion convoy. Sword-grade steel.",
          stat_deltas: { gold: 100 }
        },
        {
          option: " magical items",
          response: "Don't know where these came from. Don't care to ask.",
          stat_deltas: { gold: 200 }
        }
      ],
      outcomes: ["Genuine article", "Fake - wasted gold", "Stolen goods traced - bounty placed"]
    },
    {
      name: "Hiding",
      description: "Hide from authorities in the caves",
      requirements: [],
      rewards: ["safety"],
      risks: ["discovery", "betrayal"],
      effects: [],
      dialogue: [
        {
          option: "Deep caves",
          response: "Even the pirates don't go that far. Old tales say something lives there.",
          stat_deltas: { fear: 5 }
        },
        {
          option: "Hidden alcove",
          response: "This spot is known to only three people. You're one of them now.",
          stat_deltas: {}
        },
        {
          option: "False tunnel exit",
          response: "Leads to the sea. Good escape but cold swim.",
          stat_deltas: { health: -10 }
        }
      ],
      outcomes: ["Hid successfully", "Found by patrols", "Betrayed by informant"]
    },
    {
      name: "Pirate Recruitment",
      description: "Join a pirate crew permanently",
      requirements: ["combat > 20", "theft > 15", "reputation < 0"],
      rewards: ["pirate_member_status", "steady_income", "ship_access"],
      dialogue: [
        {
          option: "Swear allegiance",
          response: "You speak true pirate. Welcome to the crew!",
          stat_deltas: { combat: 5, reputation: -10 }
        },
        {
          option: "Request trial period",
          response: "Smart. First voyage proves your worth.",
          stat_deltas: { combat: 2 }
        },
        {
          option: "Ask about code",
          response: "The code is simple: loyalty to crew, share fairly, no Imperial informants.",
          stat_deltas: { intelligence: 2 }
        }
      ],
      outcomes: ["Accepted to crew", "Rejected - reputation too clean", "Need more experience"]
    }
  ],
};

export default dragontideData;