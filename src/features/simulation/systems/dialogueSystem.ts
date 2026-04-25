import { getSpeechPattern } from './racialDialogue';
import { getAgeGreeting, AGE_DIALOGUE } from './ageDialogue';

export type DialogueNodeID = string;
export type Intent = 'greeting''| 'question''| 'answer''| 'offer''| 'request''| 'threaten''| 'flirt''| 'comfort''| 'trade''| 'combat''| 'farewell''| 'special';

export interface DialogueChoice {
  id: string;
  label: string;
  next_node: DialogueNodeID | null;
  requirements?: {
    stats?: Record<string, number>;
    items?: string[];
    relationship?: number;
    corruption?: number;
  };
  effects: {
    relationship?: number;
    corruption?: number;
    willpower?: number;
    gold?: number;
    skills?: Record<string, number>;
    items?: string[];
    quest_start?: string;
    quest_complete?: string;
    location_change?: string;
  };
}

export interface DialogueNode {
  id: DialogueNodeID;
  speaker: string;
  text: string;
  narrative_text?: string;
  choices: DialogueChoice[];
  animations?: string[];
  background_change?: string;
  stat_checks?: {
    stat: string;
    difficulty: number;
    success_node?: DialogueNodeID;
    fail_node?: DialogueNodeID;
  };
}

export interface DialogueTree {
  id: string;
  npc_id: string;
  nodes: Record<DialogueNodeID, DialogueNode>;
  start_node: DialogueNodeID;
}

const CORE_GREETINGS: Record<string, string[]> = {
  greeting: [
    "Greetings, traveler. What brings you to these parts?",
    "Well met! What do you seek?",
    "Hello there. Looking for something?",
    "Ah, a visitor. How can I help you?",
    "Good day. What business do you have?",
    "Hail, friend. What brings you my way?",
    "Welcome. What do you want?",
    "Greetings. State your business."
  ],
  morning: [
    "Good morning! Early riser, I see.",
    "Morning! The day is young, as are we.",
    "Bright and early! What can I do for you?"
  ],
  afternoon: [
    "Good afternoon. The sun is high.",
    "Afternoon. A good time for business.",
    "Good to see you. What brings you here?"
  ],
  evening: [
    "Good evening. The day grows long.",
    "Evening. What brings you out at this hour?",
    "Night falls. What do you seek?"
  ],
  night: [
    "A good evening to you. Late hours, I see.",
    "Night time, but we're still open.",
    "The stars are out. What brings you?"
  ]
};

const REACTION_TEXT: Record<string, Record<string, string[]>> = {
  positive: {
    small: ["That's kind of you.", "I appreciate that.", "Thank you."],
    medium: ["You honor me with your kindness.", "I won't forget this.", "You have my gratitude."],
    large: ["I am deeply grateful!", "You have saved me!", "I can never repay this!"]
  },
  negative: {
    small: ["That's... concerning.", "I see. Noted.", "Hmm. Interesting."],
    medium: ["That troubles me.", "I'm disappointed.", "That's not what I hoped for."],
    large: ["How dare you!", "I will not forget this!", "You've made an enemy today."]
  },
  neutral: {
    small: ["I see.", "Very well.", "As you say."],
    medium: ["I'll consider it.", "That is your choice.", "We shall see."],
    large: ["This changes nothing.", "Your words mean little.", "I understand your position."]
  }
};

export function generateGreeting(npcRace: string, timeOfDay: string, relationship: number): string {
  const racialPattern = getSpeechPattern(npcRace);
  
  let baseGreeting: string;
  if (relationship > 50) {
    baseGreeting = CORE_GREETINGS[timeOfDay]?.[0] || CORE_GREETINGS.greeting[0];
    if (racialPattern) {
      return racialPattern.unique_phrases.greeting + " Welcome back, friend!";
    }
  } else if (relationship > 0) {
    baseGreeting = CORE_GREETINGS.greeting[Math.floor(Math.random() * 4)];
  } else if (relationship < -20) {
    return "What do you want? Make it quick.";
  } else {
    baseGreeting = CORE_GREETINGS.greeting[Math.floor(Math.random() * CORE_GREETINGS.greeting.length)];
  }
  
  return baseGreeting;
}

export function getReactionText(attitude: 'positive''| 'negative''| 'neutral', intensity: 'small''| 'medium''| 'large'): string {
  const options = REACTION_TEXT[attitude][intensity];
  return options[Math.floor(Math.random() * options.length)];
}

export function buildDialogueChoice(
  id: string,
  label: string,
  nextNode: DialogueNodeID | null,
  effects: DialogueChoice['effects'] = {}
): DialogueChoice {
  return {
    id,
    label,
    next_node: nextNode,
    effects
  };
}

export function createDialogueNode(
  id: string,
  speaker: string,
  text: string,
  choices: DialogueChoice[] = [],
  options: Partial<DialogueNode> = {}
): DialogueNode {
  return {
    id,
    speaker,
    text,
    choices,
    ...options
  };
}

export const LOCATION_BASED_GREETINGS: Record<string, string[]> = {
  the_bee_and_barb: [
    "Welcome to the Bee and Barb! Drink up!",
    "Find a seat, make yourself comfortable.",
    "The fire's warm, the drink's cold. What more do you want?"
  ],
  the_scorched_hammer: [
    "You need weapons or armor?",
    "Step up to the forge!",
    "Looking to buy or looking to learn?"
  ],
  riften_market: [
    "Buy something or get out of the way!",
    "The market's busy. Don't waste my time.",
    "What are you selling? What are you buying?"
  ],
  mistveil_keep: [
    "You have business with the Jarl?",
    "The throne room is that way. But first — why are you here?",
    "State your name and business."
  ],
  the_ragged_flagon: [
    "Keep your voice down.",
    "You've been here before, haven't you?",
    "New faces are rare here. Why are you here?"
  ],
  riften_jail: [
    "Another prisoner? Or are you visiting?",
    "This isn't a tourist attraction.",
    "You have the look of someone in trouble."
  ],
  shrine_of_azura: [
    "The star shines upon you here.",
    "Peace be upon you, pilgrim.",
    "Azura welcomes those who seek truth."
  ],
  default: [
    "Riften is full of opportunity. And danger.",
    "The city watches. Always watching.",
    "What brings you to this place?"
  ]
};

export function getLocationGreeting(location: string): string {
  const greetings = LOCATION_BASED_GREETINGS[location] || LOCATION_BASED_GREETINGS.default;
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export const CORRUPTION_RESPONSES: Record<string, string[]> = {
  low: [
    "There's something pure about you. It's... refreshing.",
    "You have a good heart. Don't let this world corrupt it.",
    "Your innocence is a rare gift."
  ],
  medium: [
    "I've seen the darkness in your eyes. It's growing.",
    "You're changing. I can see it.",
    "Something's different about you. What have you been through?"
  ],
  high: [
    "Your aura... it's changed. Darker.",
    "I can feel the corruption radiating from you.",
    "What have you become?",
    "I've seen what happens to those who embrace the darkness."
  ],
  very_high: [
    "Stay back! The corruption around you is... overwhelming.",
    "You're lost. Completely lost.",
    "The darkness has taken hold. There's no going back now."
  ]
};

export function getCorruptionResponse(corruptionLevel: number): string {
  if (corruptionLevel < 20) {
    return CORRUPTION_RESPONSES.low[Math.floor(Math.random() * CORRUPTION_RESPONSES.low.length)];
  } else if (corruptionLevel < 50) {
    return CORRUPTION_RESPONSES.medium[Math.floor(Math.random() * CORRUPTION_RESPONSES.medium.length)];
  } else if (corruptionLevel < 80) {
    return CORRUPTION_RESPONSES.high[Math.floor(Math.random() * CORRUPTION_RESPONSES.high.length)];
  } else {
    return CORRUPTION_RESPONSES.very_high[Math.floor(Math.random() * CORRUPTION_RESPONSES.very_high.length)];
  }
}

export const TIME_BASED_DIALOGUE: Record<string, Record<string, string[]>> = {
  dawn: {
    greeting: ["The sun rises. A new day begins.", "Early to rise, I see.", "Morning light brings new possibilities."],
    idle: ["The city wakes around us.", "Birds sing as the sun rises.", "Dawn breaks over the mountains."],
    departure: ["Safe travels in the morning light.", "The day awaits you.", "Go with the dawn."]
  },
  morning: {
    greeting: ["Good morning. The market is opening.", "The day is young and full of promise.", "Morning brings business."],
    idle: ["The streets fill with workers.", "Merchants set up their stalls.", "The city comes alive."],
    departure: ["Until we meet again.", "Come back when the sun is high.", "Good luck with your day."]
  },
  noon: {
    greeting: ["The sun is high. A good time to talk.", "Midday brings a lull in the crowds.", "Hot day, isn't it?"],
    idle: ["The heat weighs on everyone.", "Locals seek shade.", "The marketplace is busy at this hour."],
    departure: ["Stay cool out there.", "Avoid the midday sun.", "Return when it cools."]
  },
  afternoon: {
    greeting: ["Afternoon. The shadows grow long.", "The day progresses. What do you need?", "A good time to make deals."],
    idle: ["The afternoon crowd gathers.", "Business picks up again.", "The city flows like blood through veins."],
    departure: ["Be careful in the evening.", "Watch yourself as night falls.", "Don't be out after dark."]
  },
  dusk: {
    greeting: ["Evening falls. The day ends.", "The stars begin to appear.", "The city transforms at dusk."],
    idle: ["Lanterns are lit.", "The nightlife emerges.", "Those who prowl by night show themselves."],
    departure: ["Night approaches. Be safe.", "Don't wander the streets after dark.", "The shadows have eyes."]
  },
  night: {
    greeting: ["Night falls. The dangerous hours begin.", "The moons rise. What do you want?", "Night brings secrets."],
    idle: ["The night creatures emerge.", "Nothing good happens after midnight.", "The city's true face shows at night."],
    departure: ["Stay out of trouble.", "The night watch is vigilant.", "May the moons watch over you."]
  },
  midnight: {
    greeting: ["The deepest dark. Why are you awake?", "Few honest folk are out now.", "Midnight. The witching hour."],
    idle: ["Only the desperate or dangerous are abroad.", "The darkness is complete.", "Something stirs in the night."],
    departure: ["Go home. Sleep. This isn't a safe hour.", "The night has teeth.", "I'm going to bed. You should too."]
  }
};

export function getTimeBasedDialogue(time: string, type: 'greeting''| 'idle''| 'departure'): string {
  const dialogueSet = TIME_BASED_DIALOGUE[time] || TIME_BASED_DIALOGUE.morning;
  const options = dialogueSet[type] || dialogueSet.greeting;
  return options[Math.floor(Math.random() * options.length)];
}

export const WEATHER_BASED_DIALOGUE: Record<string, string[]> = {
  Clear: ["A beautiful day.", "The sky is clear. Good for travel.", "Perfect weather for adventuring."],
  Cloudy: ["Grey skies today.", "Cloudy, but dry at least.", "Looks like rain coming."],
  Raining: ["Weather's miserable today.", "Rain, rain, go away.", "Seek shelter or you'll get soaked."],
  Snowing: ["Winter has come.", "Snow covers everything. Beautiful.", "Bitter cold out there."],
  Foggy: ["Can't see a thing in this fog.", "The mist hides many dangers.", "Fog rolls in from the canal."],
  Storming: ["Stay indoors! Storm's dangerous.", "The thunder shakes the walls!", "A storm approaches. Find shelter!"],
  'Blood Red Sky': ["The sky... it's wrong.", "Something's coming. I can feel it.", "The Daedra are restless tonight."],
  Aurora: ["The northern lights dance! Beautiful.", "An omen in the sky.", "The ancestors are watching tonight."]
};

export function getWeatherDialogue(weather: string): string {
  const options = WEATHER_BASED_DIALOGUE[weather] || WEATHER_BASED_DIALOGUE.Clear;
  return options[Math.floor(Math.random() * options.length)];
}

export const QUEST_OFFER_PHRASES: string[] = [
  "I have a job for you, if you're interested.",
  "There's something that needs doing...",
  "I know of a way to make some gold...",
  "A problem needs solving. Can you help?",
  "I could use someone with your skills.",
  "There's a reward for the right person...",
  "This is dangerous, but the pay is good.",
  "I need someone I can trust. Are you trustworthy?",
  "It's not pretty work, but it's necessary.",
  "The Jarl needs this done. No questions asked."
];

export function getQuestOfferPhrase(): string {
  return QUEST_OFFER_PHRASES[Math.floor(Math.random() * QUEST_OFFER_PHRASES.length)];
}

export const ROMANTIC_DIALOGUE: Record<string, string[]> = {
  first_meet: [
    "You... you're different from the others.",
    "I've been watching you.",
    "There's something about you I can't explain.",
    "Your face stays with me long after you leave."
  ],
  flirting: [
    "Have you been thinking about me?",
    "I can't stop wondering what it'd be like...",
    "You're charming. More than you know.",
    "Perhaps we could... talk more privately?"
  ],
  confession: [
    "I've fallen for you. Completely.",
    "My heart belongs to you now.",
    "I didn't believe in love until I met you.",
    "You're everything to me."
  ],
  intimacy: [
    "Finally alone...",
    "I've been waiting for this.",
    "Let me show you how I feel...",
    "Together, tonight..."
  ],
  breakup: [
    "It's over. We can't continue.",
    "I can't do this anymore.",
    "You've broken my heart.",
    "We were never meant to be."
  ]
};

export function getRomanticDialogue(type: string): string {
  const options = ROMANTIC_DIALOGUE[type] || ROMANTIC_DIALOGUE.first_meet;
  return options[Math.floor(Math.random() * options.length)];
}

export const COMBAT_DIALOGUE: Record<string, string[]> = {
  challenge: [
    "You want to fight? Let's go!",
    "I've been looking for a challenge.",
    "You won't win this one.",
    "Prepare yourself!"
  ],
  victory: [
    "Too easy.", "Is that all you've got?", "Pathetic.", "You didn't stand a chance."],
  defeat: [
    "No... this can't be...", "You win this time...", "I yield! I yield!", "Have mercy!"],
  retreat: [
    "This isn't over!", "I'll be back!", "You won't see the last of me!", "Run while you can!"]
};

export function getCombatDialogue(type: string): string {
  const options = COMBAT_DIALOGUE[type] || COMBAT_DIALOGUE.challenge;
  return options[Math.floor(Math.random() * options.length)];
}

export const FAREWELL_PHRASES: string[] = [
  "Until next time.",
  "Safe travels.",
  "May the Divines watch over you.",
  "Don't do anything stupid.",
  "Remember: survival is the only law that matters here.",
  "Watch your back in this city.",
  "I'll be here if you need me.",
  "Don't forget: gold opens more doors than swords.",
  "The city never sleeps. Neither should your caution.",
  "And don't trust anyone completely."
];

export function getFarewellPhrase(): string {
  return FAREWELL_PHRASES[Math.floor(Math.random() * FAREWELL_PHRASES.length)];
}

export const RUMOR_TOPICS: Record<string, string[]> = {
  maven: [
    "Maven Black-Briar is tightening her grip. Even the Jarl answers to her.",
    "Her son is in the Thieves Guild. Maven knows everything.",
    "The Black-Briar family made their fortune on honey, but they have blood on their hands."
  ],
  thieves_guild: [
    "The Guild is back in power. They're everywhere.",
    "The Ragged Flagon has opened again. I saw the entrance.",
    "Vex runs the Guild now. She's harder than Mercer ever was."
  ],
  dragons: [
    "Dragons have been seen in the mountains!",
    "The Dragonborn has returned. They're stopping the attacks.",
    "Thuum! The ancient Thu'um. I've heard it in the distance."
  ],
  war: [
    "Stormcloaks or Imperials - either way, Skyrim suffers.",
    "The war is spreading. Soon it'll be at our doorsteps.",
    "The Empire is weak. The Stormcloaks are fools. We're caught in the middle."
  ],
  daedra: [
    "Daedric artifacts are appearing. Something's happening.",
    "The barriers are weakening. Daedra slip through more often.",
    "Pacts with Daedra always end badly. Don't make their mistakes."
  ]
};

export function getRumorTopic(topic: string): string {
  const options = RUMOR_TOPICS[topic] || ["I wouldn't know about that.", "I have too many secrets to share.", "Some things are better left unspoken."];
  return options[Math.floor(Math.random() * options.length)];
}