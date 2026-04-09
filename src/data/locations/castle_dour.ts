/**
 * Castle Dour Location Module
 * 
 * Region: Solitude
 * 
 * The fortress guarding Solitude's eastern approach, home to the Imperial Legion.
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

export const castle_dourData: LocationData = {
  id: "castle_dour",
  name: "Castle Dour",
  region: "Solitude",
  description: "The imposing fortress of Castle Dour commands the eastern approach to Solitude. Iron guards patrol its walls, and the Imperial Legion maintains a strong presence here. Supply wagons come and go constantly—the fortress is the backbone of Imperial defense in Skyrim.",
  activities: [
    "Enlist in the Legion",
    "Join the city guard",
    "Purchase military supplies",
    "Report enemy activity",
    "Request military escort",
    "Train with soldiers",
    "Deliver official message",
    "Inquire about war status"
  ],
  npcs: ["general_tullius", "captain_avalon", "legate_faus"],
  events: [
    {
      name: "Legion Enlistment",
      description: "Join the Imperial Legion and fight for the Empire",
      requirements: ["combat > 20", "health > 50"],
      rewards: ["legion_member_status", "military_supplies", "combat_training"],
      dialogue: [
        {
          option: "Swear oath to the Empire",
          response: "Welcome, soldier. The Legion has use for those who can fight.",
          stat_deltas: { combat: 5 }
        },
        {
          option: "Confirm loyalty to Skyrim",
          response: "Skyrim IS the Empire. Remember that.",
          stat_deltas: { combat: 3 }
        },
        {
          option: "Ask about assignments",
          response: "We have fronts in both the north and south. Choose wisely.",
          stat_deltas: { intelligence: 2 }
        }
      ],
      outcomes: ["Enlisted successfully", "Deferred - train more first", "Rejected - not suitable"]
    },
    {
      name: "City Guard Application",
      description: "Apply to join Solitude's city guard",
      requirements: ["combat > 15", "reputation > 0"],
      rewards: ["guard_position", "steady_income"],
      outcomes: ["Accepted to guard", "Waitlist", "Rejected"]
    },
    {
      name: "Military Supply Purchase",
      description: "Purchase weapons, armor, and supplies from Legion stores",
      requirements: ["gold > 50"],
      rewards: ["military_gear"],
      dialogue: [
        {
          option: "Steel weapons",
          response: "Standard issue. Reliable and deadly.",
          stat_deltas: { gold: 75 }
        },
        {
          option: "Imperial armor",
          response: "Fine craftsmanship. Will serve you well.",
          stat_deltas: { gold: 150 }
        },
        {
          option: "Potions and scroll",
          response: "Essential supplies for the battlefield.",
          stat_deltas: { gold: 50 }
        }
      ],
      outcomes: ["Satisfactory equipment", "Sold out of stock", "Overpriced - refused"]
    },
    {
      name: "Enemy Activity Report",
      description: "Report Stormcloak or bandit activity in the region",
      requirements: ["intelligence > 15"],
      rewards: ["imperial_favor", "gold", "promotion"],
      risks: ["ambush_risk"],
      dialogue: [
        {
          option: "Report Stormcloak movements",
          response: "Valuable intel. We'll dispatch a patrol.",
          stat_deltas: { imperial_favor: 20, gold: 50 }
        },
        {
          option: "Report bandit stronghold",
          response: "Which den? We'll route them out.",
          stat_deltas: { imperial_favor: 15, gold: 30 }
        },
        {
          option: "Request bounty hunting",
          response: "We don't officially sanction that. But we won't stop you.",
          stat_deltas: { imperial_favor: 5 }
        }
      ],
      outcomes: ["Information valued", "Already known", "Disregarded as rumor"]
    },
    {
      name: "Military Escort Request",
      description: "Request a military escort for dangerous journeys",
      requirements: ["gold > 25", "imperial_favor > 10"],
      rewards: ["safe_travel"],
      dialogue: [
        {
          option: "Escort to Whiterun",
          response: "We'll accompany you to the gates.",
          stat_deltas: { gold: 25 }
        },
        {
          option: "Escort through Pale",
          response: "The road is dangerous. We'll provide two soldiers.",
          stat_deltas: { gold: 50 }
        },
        {
          option: "Request full squad",
          response: "That crossing? You'll need more than guards.",
          stat_deltas: { gold: 100 }
        }
      ],
      outcomes: ["Escort secured", "No available troops", "Refused - too dangerous"]
    },
    {
      name: "Combat Training",
      description: "Train with veteran Legion soldiers",
      requirements: ["gold > 10"],
      rewards: ["combat_skill", "tactics"],
      dialogue: [
        {
          option: "Sword technique",
          response: "Strike true. The Legion way is efficient.",
          stat_deltas: { gold: 15, combat: 10 }
        },
        {
          option: "Shield wall formation",
          response: "A soldier alone is weak. Together, we're unbroken.",
          stat_deltas: { gold: 15, combat: 8, intelligence: 2 }
        },
        {
          option: "Archery practice",
          response: "Aim for the heart. Or the throat from afar.",
          stat_deltas: { gold: 15, combat: 10 }
        }
      ],
      outcomes: ["Improved significantly", "Adequate training", "Instructor unavailable"]
    },
    {
      name: "War Status Inquiry",
      description: "Ask about the current state of the war",
      requirements: [],
      rewards: ["intelligence", "strategy"],
      dialogue: [
        {
          option: "How goes the campaign?",
          response: "Slow progress. The rebels dug in at Whiterun. Siege is difficult.",
          stat_deltas: { intelligence: 3 }
        },
        {
          option: "What of the Thalmor?",
          response: "They're watching. Always watching. Don't speak of them here.",
          stat_deltas: { intelligence: 2 }
        },
        {
          option: "Any battle reports?",
          response: "We've won at Fort Augustin. Lost at Darkwater. War is uncertain.",
          stat_deltas: { intelligence: 4 }
        }
      ],
      outcomes: ["Informed about war", "Redirected - no comment", "Espionage suspicion"]
    }
  ],
};

export default castle_dourData;