import { GameState } from '../../types';

export interface AgeDialogue {
  young?: {
    greeting?: string;
    topics?: string[];
    reactions?: Record<string, string>;
  };
  adult?: {
    greeting?: string;
    topics?: string[];
    reactions?: Record<string, string>;
  };
  elderly?: {
    greeting?: string;
    topics?: string[];
    reactions?: Record<string, string>;
  };
}

export const AGE_DIALOGUE: Record<string, AgeDialogue> = {
  child: {
    young: {
      greeting: "Wow! You're really tall! Are you a warrior?",
      topics: ["games", "parents", "school", "toys"],
      reactions: {
        kind: "Can you teach me to fight?",
        unkind: "Are you gonna hurt me?",
        gift: "For me? Thank you!"
      }
    },
    adult: {
      greeting: "Hello there, little one. Don't you have somewhere to be?",
      topics: ["family", "school", "play"],
      reactions: {
        kind: "You're nice. Are you a friend of my parents?",
        unkind: "I should get home...",
        gift: "My mom says don't take things from strangers."
      }
    }
  },
  young: {
    young: {
      greeting: "Hey there! Looking for trouble or just passing through?",
      topics: ["adventure", "rebellion", "love", "work"],
      reactions: {
        kind: "You're cool. Want to cause some trouble?",
        unkind: "Whatever, old man.",
        gift: "Hey, thanks! I owe you one."
      }
    },
    adult: {
      greeting: "Ah, another soul looking for purpose. I know that feeling.",
      topics: ["career", "relationships", "goals", "past"],
      reactions: {
        kind: "You've been helpful. Let's keep in touch.",
        unkind: "I've got nothing to say to you.",
        gift: "That's... actually really thoughtful."
      }
    },
    elderly: {
      greeting: "Young blood! Always rushing. Slow down and learn from those who came before.",
      topics: ["wisdom", "stories", "history", "regrets"],
      reactions: {
        kind: "You listen well. Reminds me of myself at your age.",
        unkind: "Youth these days... no respect.",
        gift: "For me? I haven't received a gift in years..."
      }
    }
  },
  adult: {
    young: {
      greeting: "Welcome, traveler. What brings you to these parts?",
      topics: ["business", "politics", "work", "news"],
      reactions: {
        kind: "You're honest. That's rare these days.",
        unkind: "I'm busy. Move along.",
        gift: "You didn't have to do that, but thank you."
      }
    },
    adult: {
      greeting: "Good to see you. Any news from the road?",
      topics: ["family", "work", "politics", "trade"],
      reactions: {
        kind: "We've built something good here.",
        unkind: "I've no time for your games.",
        gift: "A token of friendship. I accept."
      }
    },
    elderly: {
      greeting: "Ah, another generation walking the same paths. Tell me, what's the world like now?",
      topics: ["memories", "changes", "wisdom", "fears"],
      reactions: {
        kind: "You have a good heart. Don't lose it.",
        unkind: "I've seen your type before. Ambitious and hollow.",
        gift: "This brings back memories. Thank you."
      }
    }
  },
  elderly: {
    young: {
      greeting: "My bones ache just looking at you. Youth is wasted on the young.",
      topics: ["stories", "wisdom", "past", "family"],
      reactions: {
        kind: "You have patience. That's a virtue.",
        unkind: "Bah! Leave an old man in peace.",
        gift: "I haven't the strength to refuse. How kind."
      }
    },
    adult: {
      greeting: "Step carefully, friend. The ground isn't as steady as it once was.",
      topics: ["regrets", "accomplishments", "family", "death"],
      reactions: {
        kind: "You treat me with respect. Not many do.",
        unkind: "I've no time for your insolence.",
        gift: "I'll need help carrying this, but I'll treasure it."
      }
    },
    elderly: {
      greeting: "Well met, old friend. We understand each other now, don't we?",
      topics: ["time", "memory", "wisdom", "peace"],
      reactions: {
        kind: "We few who remain must stick together.",
        unkind: "Enough. Let us have peace.",
        gift: "Another relic for my collection. How nice."
      }
    }
  }
};

export function getAgeGreeting(ageGroup: string, speakerAgeGroup: string): string {
  const dialogue = AGE_DIALOGUE[speakerAgeGroup];
  if (!dialogue) return "Greetings.";
  
  const ageVariant = dialogue[speakerAgeGroup as keyof typeof dialogue];
  return ageVariant?.greeting || "Greetings.";
}

export function getAgeReaction(ageGroup: string, attitude: 'kind''| 'unkind''| 'gift'): string {
  const reactions = AGE_DIALOGUE[ageGroup]?.adult?.reactions;
  if (!reactions) return "...";
  return reactions[attitude] || "...";
}

export const AGING_EFFECTS = {
  child: {
    health_cap: 0.7,
    stamina_cap: 0.8,
    magicka_cap: 0.9,
    growth_rate: 0.1,
    vulnerability: 1.5,
    learning_bonus: 2.0
  },
  young: {
    health_cap: 1.0,
    stamina_cap: 1.0,
    magicka_cap: 1.0,
    growth_rate: 0.05,
    vulnerability: 1.0,
    learning_bonus: 1.5
  },
  adult: {
    health_cap: 1.0,
    stamina_cap: 1.0,
    magicka_cap: 1.0,
    growth_rate: 0,
    vulnerability: 1.0,
    learning_bonus: 1.0
  },
  elderly: {
    health_cap: 0.6,
    stamina_cap: 0.7,
    magicka_cap: 0.9,
    growth_rate: -0.05,
    vulnerability: 1.3,
    learning_bonus: 0.8,
    wisdom_bonus: 2.0
  }
};

export function applyAgingEffects(state: GameState): GameState {
  const age = state.player.age || 18;
  let ageGroup = 'adult';
  
  if (age < 16) ageGroup = 'child';
  else if (age < 25) ageGroup = 'young';
  else if (age > 60) ageGroup = 'elderly';
  
  const effects = AGING_EFFECTS[ageGroup as keyof typeof AGING_EFFECTS];
  if (!effects) return state;
  
  const newState = { ...state };
  
  newState.player.max_health = Math.floor((newState.player.max_health || 100) * effects.health_cap);
  newState.player.max_stamina = Math.floor((newState.player.max_stamina || 100) * effects.stamina_cap);
  newState.player.max_magicka = Math.floor((newState.player.max_magicka || 100) * effects.magicka_cap);
  
  return newState;
}

export const AGE_TRIGGERED_ENCOUNTERS = {
  child_protection: {
    condition: (state: GameState) => state.player.age && state.player.age < 16 && Math.random() < 0.1,
    description: "A child is in danger. Protect them or walk away.",
    outcomes: [
      { text: "You protect the child, fighting off the threat.", stat_deltas: { relationship: 20, willpower: 10, health: -10 } },
      { text: "You try to negotiate, offering yourself instead.", stat_deltas: { corruption: 15, relationship: 5 } },
      { text: "You walk away. The child's screams follow you.", stat_deltas: { corruption: 5, stress: 15 } }
    ]
  },
  young_mentorship: {
    condition: (state: GameState) => state.player.age && state.player.age >= 18 && state.player.age < 25,
    description: "A young NPC wants to learn from you. Teach them your ways?",
    outcomes: [
      { text: "You teach them your skills.", stat_deltas: { skills: 5, relationship: 15 } },
      { text: "You teach them about the darker arts.", stat_deltas: { corruption: 10, skills: 3 } },
      { text: "You refuse, sending them away.", stat_deltas: { stress: 5 } }
    ]
  },
  elderly_wisdom: {
    condition: (state: GameState) => state.player.age && state.player.age >= 60,
    description: "An elder offers to share their knowledge with you.",
    outcomes: [
      { text: "You listen to their stories and learn.", stat_deltas: { skills: 10, willpower: 5 } },
      { text: "You ask about their regrets.", stat_deltas: { relationship: 10, stress: -5 } },
      { text: "You have no time for old stories.", stat_deltas: { relationship: -5 } }
    ]
  }
};