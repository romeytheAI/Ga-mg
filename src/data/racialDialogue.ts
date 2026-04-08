export interface SpeechPattern {
  self_reference: string; // "I", "this one", etc
  formal_markers: string[];
  informal_markers: string[];
  unique_phrases: Record<string, string>;
  cultural_references: string[];
}

export const RACIAL_DIALOGUE: Record<string, SpeechPattern> = {
  khajiit: {
    self_reference: "this one",
    formal_markers: ["this one apologizes", "this one asks humbly", "if the master permits"],
    informal_markers: ["this one thinks", "this one knows", "this one sees"],
    unique_phrases: {
      greeting: "This one greets you, traveler.",
      farewell: "Safe travels, friend of the desert.",
      gratitude: "This one is grateful, yes?",
      apology: "This one apologizes for any offense.",
      agreement: "This one agrees, naturally.",
      disagreement: "This one... has different thoughts."
    },
    cultural_references: ["Moon Sugar", "Desert winds", "The Clan", "Warm sands", "Khajiit do not steal, this one borrows"]
  },
  argonian: {
    self_reference: "this one's",
    formal_markers: ["this one requests", "this one reports", "the Hist speaks through"],
    informal_markers: ["this one knows", "this one sees", "the swamp remembers"],
    unique_phrases: {
      greeting: "The water welcomes you, visitor.",
      farewell: "May the swamp keep you safe.",
      gratitude: "This one remembers your kindness.",
      apology: "This one asks forgiveness of the swamp.",
      agreement: "The Hist agrees with this wisdom.",
      disagreement: "The swamp knows different truths."
    },
    cultural_references: ["The Hist", "The Swamp", "Masser and Secunda", "Water scales", "Egg-laying", "Root and branch"]
  },
  dunmer: {
    self_reference: "I",
    formal_markers: ["As a member of House", "In the tradition of the ancestors", "One must note"],
    informal_markers: ["I think", "I know", "I've heard"],
    unique_phrases: {
      greeting: "Good evening. Mind the stairs.",
      farewell: "Safe travels through the ash.",
      gratitude: "Your kindness is noted. I won't forget it.",
      apology: "I... apologize. A moment of weakness.",
      agreement: "Indeed. That is the only logical conclusion.",
      disagreement: "That is... incorrect. Allow me to explain."
    },
    cultural_references: ["House Redoran", "House Hlaalu", "House Telvanni", "The Tribunal", "Vvardenfell", "The Ash", "Daedra"]
  },
  altmer: {
    self_reference: "I",
    formal_markers: ["One must observe", "It would be proper to note", "In proper context"],
    informal_markers: ["I find", "I believe", "I've concluded"],
    unique_phrases: {
      greeting: "Greetings, traveler. I am...",
      farewell: "Do take care. The world is full of... simpletons.",
      gratitude: "I am... grateful. Such sentiment is rare these days.",
      apology: "One apologizes for any... inadequacy in my behavior.",
      agreement: "Yes, yes. Not that I expected anything less from one of... proper breeding.",
      disagreement: "That is patently absurd. I could explain, but I doubt you'd understand."
    },
    cultural_references: ["The Summerset Isles", "Crystal Tower", "The Gold", "High Culture", "The Aldmeri Dominion", "Superior breeding"]
  },
  bosmer: {
    self_reference: "I",
    formal_markers: ["In the wild we say", "The forest teaches", "The Green Lady watches"],
    informal_markers: ["I guess", "I think", "Maybe"],
    unique_phrases: {
      greeting: "Hail, friend! Good to see friendly faces in these woods!",
      farewell: "Stay on the path, and watch for spiders!",
      gratitude: "You're alright! Come back anytime!",
      apology: "Oops! Just a little... adjustment needed.",
      agreement: "Sure thing! That makes sense!",
      disagreement: "Well... maybe, but have you tried just running really fast?"
    },
    cultural_references: ["The Wild Hunt", "Y'ffre", "The Green", "Valenwood", "Tree-singers", "No meat"]
  },
  nord: {
    self_reference: "I",
    formal_markers: ["By the old ways", "As Ysgramor taught", "In the old tongue"],
    informal_markers: ["I say", "I think", "Look here"],
    unique_phrases: {
      greeting: "Hail, friend! Drink up!",
      farewell: "Sky Above, Earth Below, Fire Within!",
      gratitude: "By the Divines! Thank you, my friend!",
      apology: "Ah, my bad. Let's just forget it, eh?",
      agreement: "Aye! That's the truth of it!",
      disagreement: "Nonsense! I say it's..."
    },
    cultural_references: ["Ysgramor", "The Companions", "Shor's Hall", "Mead", "Skyrim", "Tomb of the Gods", "Thu'um"]
  },
  redguard: {
    self_reference: "I",
    formal_markers: ["As the sword-singers taught", "In the way of the desert", "My ancestors watch"],
    informal_markers: ["I tell you", "Let me tell you", "Listen here"],
    unique_phrases: {
      greeting: "Well met, traveler. The desert is harsh.",
      farewell: "May your blade stay sharp, your water stay cold.",
      gratitude: "You have honor. I won't forget this debt.",
      apology: "I... misjudged the situation. Forgive me.",
      agreement: "A warrior's wisdom! I agree!",
      disagreement: "No. This one has seen different in the wars."
    },
    cultural_references: ["Yath", "The Ansei", "The赋", "Hammerfell", "Desert storms", "Forgotten heroes"]
  },
  orc: {
    self_reference: "I",
    formal_markers: ["In the way of the Strong", "The Code demands", "Malacath teaches"],
    informal_markers: ["I say", "Let me tell you", "You"],
    unique_phrases: {
      greeting: "HALT! Who approaches the stronghold?",
      farewell: "STRENGTH! Go with Malacath's blessing!",
      gratitude: "You are... not weak. I respect that.",
      apology: "This one... was wrong. Forgive the weakness.",
      agreement: "YES! That is the way of things!",
      disagreement: "WEAK! You know nothing of strength!"
    },
    cultural_references: ["Malacath", "The Strong", "Orcstrongholds", "Code of Malacath", "The Blood", "Brutal honesty"]
  },
  Breton: {
    self_reference: "I",
    formal_markers: ["One might observe", "It is said in the Colleges", "The Mystics teach"],
    informal_markers: ["I think", "I feel", "I've heard"],
    unique_phrases: {
      greeting: "Greetings, friend of magic. What brings you here?",
      farewell: "May the Mystics watch over you.",
      gratitude: "You're quite talented! I couldn't have done better myself.",
      apology: "My apologies. I was... distracted by magical thoughts.",
      agreement: "Oh, absolutely! The magical theory is sound!",
      disagreement: "Well, perhaps, but the arcane explanation is different..."
    },
    cultural_references: ["The Colleges", "Django", "High Rock", "Anti-magic", "Political intrigue", "Heritage of magic"]
  },
  imperial: {
    self_reference: "I",
    formal_markers: ["As the Emperor commands", "In the name of the Empire", "Imperial law states"],
    informal_markers: ["I think", "I know", "Let me handle"],
    unique_phrases: {
      greeting: "Greetings. How may the Empire... I mean, how may I assist you?",
      farewell: "May the Emperor watch over you. Safe travels.",
      gratitude: "The Empire thanks you for your... contribution.",
      apology: "I apologize for the... inconvenience. Let's resolve this.",
      agreement: "Indeed. That would be most efficient.",
      disagreement: "Perhaps there's a... more diplomatic solution."
    },
    cultural_references: ["The White-Gold Tower", "The Emperor", "Cyrodiil", "Imperial Legion", "Taxes", "Unity"]
  }
};

export function getSpeechPattern(race: string): SpeechPattern | null {
  return RACIAL_DIALOGUE[race.toLowerCase()] || null;
}

export function formatDialogueByRace(race: string, text: string): string {
  const pattern = getSpeechPattern(race);
  if (!pattern) return text;
  
  const formattedText = text
    .replace(/this one/g, pattern.self_reference)
    .replace(/I am/g, "I am");
  
  return formattedText;
}

export function getRaceGreeting(race: string, timeOfDay: string): string {
  const pattern = getSpeechPattern(race);
  if (!pattern) return "Greetings, traveler.";
  
  const timeGreetings: Record<string, string> = {
    dawn: pattern.unique_phrases.greeting + " The sun rises on a new day.",
    morning: pattern.unique_phrases.greeting + " Good morning.",
    noon: pattern.unique_phrases.greeting + " The sun is high.",
    afternoon: pattern.unique_phrases.greeting + " The day grows long.",
    dusk: pattern.unique_phrases.greeting + " The stars appear.",
    night: pattern.unique_phrases.greeting + " The moons watch over us.",
    midnight: pattern.unique_phrases.greeting + " The deepest dark."
  };
  
  return timeGreetings[timeOfDay] || pattern.unique_phrases.greeting;
}

export function getRaceSpecificResponse(race: string, topic: string): string {
  const pattern = getSpeechPattern(race);
  if (!pattern) return "I see.";
  
  const responses: Record<string, Record<string, string>> = {
    khajiit: {
      moon_sugar: "Moon Sugar... the desert brings us sweetness, yes?",
      thievery: "This one does not steal. This one... acquires.",
      cats: "The kitten is confused. We are Khajiit!",
      desert: "The sands remember all who walk them."
    },
    argonian: {
      hist: "The Hist speaks in dreams. The swamp knows all.",
      water: "Water is life. Water is memory. Water is all.",
      swamp: "The swamp is home. The swamp is mother.",
      eggs: "This one's mother came from the warm swamp, yes?"
    },
    dunmer: {
      house: "I am of House... matters not. The dead don't care about politics.",
      tribunal: "The Tribunal are gone. But their memory remains.",
      ash: "The ash will take us all eventually. Nothing escapes Vvardenfell.",
      daedra: "Some princes are useful. Others are... problems."
    },
    nord: {
      skyrim: "Skyrim is the land of our ancestors! Blood and glory!",
      Companions: "The Companions are the truest warriors!",
      drinking: "A toast! To Shor! To the Nords! To the mead!",
      thu'um: "The Voice is the gift of the gods!"
    }
  };
  
  return responses[race.toLowerCase()]?.[topic] || "I see.";
}