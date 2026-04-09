/**
 * Solitude Market Location Module
 * 
 * Region: Solitude
 * 
 * The bustling central market of Solitude, where goods from across Tamriel are bought and sold.
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

export const solitude_marketData: LocationData = {
  id: "solitude_market",
  name: "Solitude Market",
  region: "Solitude",
  description: "The grand market district of Solitude sprawls beneath the Blue Palace cliffs. Merchants from every corner of Tamriel hawk their wares—spices from Elsweyr, silks from Valenwood, Dwemer inventions from deeper in Skyrim. The smell of exotic foods mingles with the salt air of the bay.",
  activities: [
    "Browse goods for sale",
    "Haggle for better prices",
    "Sell unwanted items",
    "Steal from stalls (risk: guards)",
    "Eat at food vendors",
    "Hire craftsman",
    "Commission custom item",
    "Gather information"
  ],
  npcs: ["brunwolf", "hestla", "geraudini"],
  events: [
    {
      name: "Browsing",
      description: "Browse the various goods available",
      requirements: [],
      rewards: [],
      dialogue: [
        {
          option: "Check alchemy ingredients",
          response: "Fresh ingredients from the Summerset Isles. Very rare.",
          stat_deltas: { gold: 30 }
        },
        {
          option: "Examine weapons",
          response: "Imported from Hammerfell. Fine steel, excellent balance.",
          stat_deltas: { gold: 100 }
        },
        {
          option: "View jewelry",
          response: "Exquisite pieces. Imported directly from the Summerset.",
          stat_deltas: { gold: 200 }
        },
        {
          option: "Sample food",
          response: "Try the Rahteh! A Morrowind specialty. Spicy!",
          stat_deltas: { gold: 5 }
        }
      ],
      outcomes: ["Found excellent items", "Nothing of interest", "Seller dishonest"]
    },
    {
      name: "Haggling",
      description: "Negotiate for better prices",
      requirements: ["speech > 15"],
      rewards: ["gold_savings", "speech_experience"],
      dialogue: [
        {
          option: "Aggressive negotiation",
          response: "Fine! I'll meet you halfway. But never speak to me so again!",
          stat_deltas: { speech: 3, gold: 25 }
        },
        {
          option: "Friendly approach",
          response: "Ah, a reasonable customer. I'll give you the trader's discount.",
          stat_deltas: { speech: 2, gold: 15 }
        },
        {
          option: "Offer goods in trade",
          response: "Interesting. I'll take that off your hands, then.",
          stat_deltas: { gold: 20 }
        }
      ],
      outcomes: ["Got great deal", "Moderate savings", "Offended seller"]
    },
    {
      name: "Selling Items",
      description: "Sell unwanted items to merchants",
      requirements: [],
      rewards: ["gold"],
      dialogue: [
        {
          option: "Sell weapons",
          response: "Still sharp. I'll give you fifteen gold.",
          stat_deltas: { gold: 15 }
        },
        {
          option: "Sell armor",
          response: "Good condition. Twenty gold.",
          stat_deltas: { gold: 20 }
        },
        {
          option: "Sell magical items",
          response: "This has aura... Fifty gold. Don't ask questions.",
          stat_deltas: { gold: 50 }
        },
        {
          option: "Sell stolen goods",
          response: "Hmm. I see where this came from. Ten gold. Take it or leave it.",
          stat_deltas: { gold: 10, reputation: -5 }
        }
      ],
      outcomes: ["Fair price", "Undervalued", "Refused - too suspicious"]
    },
    {
      name: "Theft Attempt",
      description: "Attempt to steal from market stalls",
      requirements: [],
      risks: ["arrest", "fine", "trauma"],
      effects: ["theft_skill_gain"],
      dialogue: [
        {
          option: "Quick grab and run",
          response: "Stop thief! Guards!",
          stat_deltas: { gold: 50, theft: 5, reputation: -10 }
        },
        {
          option: "Distraction technique",
          response: "Your distraction worked, but merchant noticed...",
          stat_deltas: { gold: 25, theft: 3 }
        },
        {
          option: "Careful extraction",
          response: "Smooth work. No one saw a thing.",
          stat_deltas: { gold: 75, theft: 8 }
        }
      ],
      outcomes: ["Got away cleanly", "Caught - fined", "Escaped but dropped items"]
    },
    {
      name: "Food Vendor",
      description: "Eat at one of the market's food vendors",
      requirements: ["gold > 5"],
      rewards: ["energy", "mood_boost"],
      dialogue: [
        {
          option: "Sweetroll",
          response: "Fresh from the oven! Sugar and honey.",
          stat_deltas: { gold: 5, energy: 10 }
        },
        {
          option: "Meat broth",
          response: "Hearty game broth. Warms you from inside.",
          stat_deltas: { gold: 8, energy: 15 }
        },
        {
          option: "Exotic fruits",
          response: "Imported from Valenwood. A rare treat.",
          stat_deltas: { gold: 15, energy: 5, mood: 10 }
        }
      ],
      outcomes: ["Delicious!", "Adequate", "Food made ill"]
    },
    {
      name: "Craftsman Hiring",
      description: "Hire a craftsman for repairs or custom work",
      requirements: ["gold > 25"],
      rewards: ["restored_item", "custom_item"],
      dialogue: [
        {
          option: "Weapon repair",
          response: "I'll refurbish that edge. Should take a day.",
          stat_deltas: { gold: 25 }
        },
        {
          option: "Armor maintenance",
          response: "Dents and scratches, nothing serious. Like new.",
          stat_deltas: { gold: 40 }
        },
        {
          option: "Custom jewelry",
          response: "A unique piece? I'll need materials plus fifty gold.",
          stat_deltas: { gold: 75 }
        }
      ],
      outcomes: ["Excellent work", "Acceptable", "Craftsman fled with payment"]
    },
    {
      name: "Information Gathering",
      description: "Gossip and gather market information",
      requirements: [],
      rewards: ["intelligence", "rumor"],
      dialogue: [
        {
          option: "Ask about shortage",
          response: "The war's disrupted supply lines. Can't get flin anywhere.",
          stat_deltas: { intelligence: 2 }
        },
        {
          option: "Inquire about bandit trade",
          response: "Shh! They say the Forsworn supply through caves...",
          stat_deltas: { intelligence: 3 }
        },
        {
          option: "Ask about new goods",
          response: "A Khajiit caravan comes next week. Might find what you need.",
          stat_deltas: { intelligence: 1 }
        }
      ],
      outcomes: ["Useful intel", "Common knowledge", "Seller distrusts you"]
    }
  ],
};

export default solitude_marketData;