/**
 * Winking Skeever Location Module
 * 
 * Region: Solitude
 * 
 * A high-class tavern and inn in Solitude, popular with nobles and merchants.
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

export const winking_skeeverData: LocationData = {
  id: "winking_skeever",
  name: "The Winking Skeever",
  region: "Solitude",
  description: "An elegant tavern and inn in the heart of Solitude's market district. The Winking Skeever caters to a wealthy clientele—merchants closing deals, nobles gossiping, and adventurers sharing tales of the road. Fine ales and even finer company await.",
  activities: [
    "Order food and drink",
    "Rent a room for the night",
    "Listen for rumors",
    "Play a game of cards",
    "Hire entertainer for private show",
    "Gamble at dice",
    "Network with merchants",
    " overhear political discussions"
  ],
  npcs: ["valente_marco", "bull", "mutemet"],
  events: [
    {
      name: "Fine Dining",
      description: "Enjoy a gourmet meal from the tavern's kitchen",
      requirements: [],
      rewards: ["restoration", "energy"],
      dialogue: [
        {
          option: "Order the roast pheasant",
          response: "Excellent choice. Our chef trained in the Blue Palace kitchens.",
          stat_deltas: { gold: 25, energy: 20 }
        },
        {
          option: "Request Solitude stew",
          response: "Hearty and filling. Perfect for the cold bay winds.",
          stat_deltas: { gold: 15, energy: 15 }
        },
        {
          option: "Ask forspiced wine",
          response: "Imported from Firsthold. A rare treat.",
          stat_deltas: { gold: 10, energy: 5 }
        }
      ],
      outcomes: ["Satisfied hunger", "Food was excellent", "Overcharged - complained"]
    },
    {
      name: "Room Rental",
      description: "Rent a comfortable room for the night",
      requirements: [],
      rewards: ["rest", "privacy"],
      dialogue: [
        {
          option: "Standard room",
          response: "Ten gold for the night. Clean sheets, warm fire.",
          stat_deltas: { gold: 10 }
        },
        {
          option: "Luxury suite",
          response: "Thirty gold. Fresh fruit, silk sheets, attached bath.",
          stat_deltas: { gold: 30 }
        },
        {
          option: "Request no disturbances",
          response: "Consider it done. No one will disturb you.",
          stat_deltas: { gold: 5 }
        }
      ],
      outcomes: ["Slept well", "Interrupted by noise", "Room was not as advertised"]
    },
    {
      name: "Rumor Hearing",
      description: "Listen to patrons discussing recent events",
      rewards: ["intelligence", "rumor"],
      dialogue: [
        {
          option: "Eavesdrop on nobles",
          response: "The Jarl's council is meeting about the Stormcloak situation...",
          stat_deltas: { intelligence: 3 }
        },
        {
          option: "Overhear merchants",
          response: "There's a shortage of flin. Price is going up...",
          stat_deltas: { intelligence: 2 }
        },
        {
          option: "Listen to adventurers",
          response: "The Draugr in crypts are getting more aggressive lately...",
          stat_deltas: { intelligence: 2 }
        }
      ],
      outcomes: ["Interesting intel gathered", "Nothing useful heard", "Noticed eavesdropping"]
    },
    {
      name: "Card Game",
      description: "Challenge another patron to a friendly card game",
      requirements: [],
      rewards: ["gold"],
      risks: ["gold_loss"],
      dialogue: [
        {
          option: "High stakes game",
          response: "You're confident. Let's see those coins change hands.",
          stat_deltas: { gold: 50, intelligence: 2 }
        },
        {
          option: "Friendly wager",
          response: "A modest game. I'll match your bet.",
          stat_deltas: { gold: 20 }
        },
        {
          option: "Watch first",
          response: "Smart. Learn their tells before playing.",
          stat_deltas: { intelligence: 1 }
        }
      ],
      outcomes: ["Won big", "Lost but learned", "Tied - no harm done", "Accused of cheating"]
    },
    {
      name: "Gambling",
      description: "Try your luck at the dice table",
      requirements: [],
      rewards: ["gold"],
      risks: ["gold_loss", "addiction"],
      dialogue: [
        {
          option: "Place big bet",
          response: "The dice are hot tonight. Let's see...",
          stat_deltas: { gold: 100, luck: 1 }
        },
        {
          option: "Conservative play",
          response: "Slow and steady? I'll allow it.",
          stat_deltas: { gold: 25 }
        },
        {
          option: "Walk away",
          response: "Wise choice. The house always wins eventually.",
          stat_deltas: { willpower: 2 }
        }
      ],
      outcomes: ["Won fortune", "Lost heavily", "Broke even", "Barred for winning too much"]
    },
    {
      name: "Private Entertainment",
      description: "Hire an entertainer for private company",
      requirements: ["gold > 50"],
      rewards: ["mood_boost", "relationship"],
      risks: ["reputation_loss", "theft"],
      dialogue: [
        {
          option: "Request bard performance",
          response: "A talented minstrel. They can make your night.",
          stat_deltas: { gold: 50, mood: 20 }
        },
        {
          option: "Invite dancer for company",
          response: "They'll provide... entertainment. But keep it discreet.",
          stat_deltas: { gold: 75, mood: 30 }
        },
        {
          option: "More intimate services",
          response: "I know people. But you'll pay for discretion.",
          stat_deltas: { gold: 150, mood: 50 }
        }
      ],
      outcomes: ["Exceeded expectations", "adequate", "Complained to management"]
    }
  ],
};

export default winking_skeeverData;