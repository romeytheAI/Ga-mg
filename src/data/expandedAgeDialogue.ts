import { getAgeGreeting, AGE_DIALOGUE, AGING_EFFECTS, AGE_TRIGGERED_ENCOUNTERS } from './ageDialogue';

export const EXPANDED_AGE_DIALOGUE = {
  child: {
    npc_responses: {
      greeting: [
        "Wow! You're really tall! Are you a warrior?",
        "Mommy said not to talk to strangers...",
        "Are you lost? My house is over there!",
        "I saw a dragon once! It was super big!",
        "Why do you look so serious?",
        "Can I help you find something?",
        "The guards are mean. They don't let kids play here.",
        "I found a cool rock earlier! Want to see?"
      ],
      questions: [
        { q: "What do you do for fun?", a: ["We play tag! And hide and seek!", "I like feeding the birds.", "Sometimes we sneak to the market."] },
        { q: "Where are your parents?", a: ["Mama's working at the tavern.", "Papa's in the mine.", "They're... away. I live with grandma."] },
        { q: "Do you know any secrets?", a: ["The rats in the cellar talk!", "There's a secret door in the church!", "The Khajiit have a hidden cave!"] }
      ],
      reactions: {
        gift: [
          "For me?! Thank you! Can I show my friends?",
          "Wow! I've never gotten a gift before!",
          "This is the best day EVER!",
          "I... I don't know what to say...",
          "Mama says don't take things from strangers, but... it's so pretty!"
        ],
        kind: [
          "You're nice! You can be my friend!",
          "You have a gentle face. Like my grandma.",
          "I trust you. I don't know why.",
          "Will you play with me? Please?",
          "You smell like safety."
        ],
        unkind: [
          "Are you gonna hurt me?",
          "I should run home...",
          "Mommy told me about people like you.",
          "You're scary! Leave me alone!",
          "I know how to kick and scream!"
        ],
        flirt: [
          "What are you doing? That's weird.",
          "I don't understand...",
          "My mommy does that with daddy.",
          "I'm not supposed to do that!",
          "I don't know what you mean!"
        ]
      }
    },
    dialogue_topics: [
      { topic: "games", responses: ["Tag's the best! Unless the big kids cheat.", "Hide and seek is fun but hard.", "We made up a new game about dragons!"] },
      { topic: "food", responses: ["Mama makes the best stew!", "The tavern gives us scraps sometimes.", "I found an apple in the gutter yesterday!"] },
      { topic: "family", responses: ["It's just me and mama now.", "Papa left to fight. He said he'd come back.", "I have three brothers but they're all working."] },
      { topic: "school", responses: ["The temple teaches us about the Divines.", "The master is strict but fair.", "I don't like sitting still!"] },
      { topic: "dreams", responses: ["I want to be a dragon when I grow up!", "I want to help people like you do!", "I want to find my papa."] },
      { topic: "fear", responses: ["The rats in the basement are huge!", "The guards yell at us.", "Sometimes I hear scary sounds at night."] },
      { topic: "secrets", responses: ["There's a hole in the wall where we listen.", "The merchants hide things.", "The Thieves Guild talks to the rats."] }
    ],
    available_activities: [
      "play", "explore", "help", "listen", "run_errands", "beg", "steal_small", "watch"
    ],
    vulnerability_triggers: [
      { condition: "night_time", effect: "Run home, it's dark!" },
      { condition: "stranger_approach", effect: "Cry for help" },
      { condition: "offer_strange", effect: "Refuse and hide" }
    ]
  },
  young: {
    npc_responses: {
      greeting: [
        "Hey there! Looking for trouble or just passing through?",
        "What's a hero like you doing in a place like this?",
        "The name's not important. What do you want?",
        "Another adventurer. Seen a hundred of you.",
        "You look like you've got stories. Spill 'em.",
        "I'm busy. Make it quick.",
        "Out of my way! I've got places to be!",
        "What're you staring at?"
      ],
      questions: [
        { q: "What's the best way to make gold?", a: ["Contracts. Bandits, vampires, whatever pays.", "The merchants always need muscle.", "The Thieves Guild pays, but you gotta earn it."] },
        { q: "Know any good spots?", a: ["The hot springs are nice at night.", "The Ragged Flagon's open if you know who to ask.", "Bandit camps have good loot. If you're strong enough."] },
        { q: "Looking for work?", a: ["Always. Pay's what matters.", "Depends on what's being offered.", "I don't work for free. What's the reward?"] }
      ],
      reactions: {
        gift: [
          "Hey, thanks! I owe you one.",
          "Not bad. You're alright.",
          "I don't need charity, but... thanks.",
          "What do you want from me?",
          "Got any more of those?"
        ],
        kind: [
          "You're cool. Not like the others.",
          "I could use a partner. You seem capable.",
          "We could make a good team.",
          "You've got my back? I'll have yours.",
          "Finally, someone I can trust."
        ],
        unkind: [
          "Whatever. Leave me alone.",
          "I've got nothing to say to you.",
          "Don't waste my time.",
          "You think I'm scared of you?",
          "You're just like the rest of them."
        ],
        flirt: [
          "Interesting. You got a name?",
          "You're not bad to look at.",
          "Maybe we could... hang out sometime?",
          "I know a private spot. Interested?",
          "You're bold. I like that."
        ]
      }
    },
    dialogue_topics: [
      { topic: "adventure", responses: ["There's a dungeon in the hills. Should explore.", "Heard there's a vampire nest nearby.", "The Companions are recruiting. If you're strong."] },
      { topic: "rebellion", responses: ["The Empire is corrupt. The Stormcloaks aren't better.", "I do what I want. No rules.", "Society's a cage. I escaped."] },
      { topic: "love", responses: ["Someone at the tavern catches my eye.", "Don't have time for romance. Too busy surviving.", "I had someone once. She's gone now."] },
      { topic: "work", responses: ["Mercenary work pays the bills.", "I'm building a reputation.", "One day I'll have my own hold."] },
      { topic: "ambition", responses: ["I'm going to be famous!", "Gold and glory. That's the dream.", "I'll show them all."] },
      { topic: "danger", responses: ["Fought a bear once. Lost, but survived.", "The wilds have things that shouldn't exist.", "Nothing scares me. Almost nothing."] }
    ],
    available_activities: [
      "work", "combat", "explore", "trade", "flirt", "steal", "train", "quest"
    ],
    mentorship_offers: [
      { type: "combat", dialogue: "Want me to teach you to fight?" },
      { type: "thievery", dialogue: "I know some tricks. Want to learn?" },
      { type: "magic", dialogue: "Found some scrolls. Could show you the basics." }
    ]
  },
  adult: {
    npc_responses: {
      greeting: [
        "Welcome, traveler. What brings you to these parts?",
        "Good to see you. Any news from the road?",
        "Business or pleasure? State your purpose.",
        "The city's busy today. Must be something important.",
        "Safe travels, friend. The roads are dangerous.",
        "Ah, another soul looking for their fortune.",
        "The world keeps turning. What news do you bring?",
        "A fine day for business, if you know where to look."
      ],
      questions: [
        { q: "How's business?", a: ["Slow but steady. Can't complain.", "The war's hurt trade, but we're surviving.", "Better than last year. Worse than before."] },
        { q: "What's happening in the city?", a: ["Maven's grip tightens. No one challenges her.", "The Thieves Guild is active again.", "Dragons have been spotted. The end is near."] },
        { q: "Looking for someone?", a: ["I've got contacts. Might know something.", "Depends who you're looking for.", "The underground knows everyone."] }
      ],
      reactions: {
        gift: [
          "That's generous of you. Thank you.",
          "I accept your gesture in the spirit it's given.",
          "You didn't have to do that. But I'm grateful.",
          "This will be useful. Thank you for thinking of me.",
          "A token of friendship. I'll treasure it."
        ],
        kind: [
          "You have a good heart. Don't lose it in this city.",
          "We need more people like you.",
          "You've proven yourself trustworthy.",
          "I'm glad to call you friend.",
          "Your kindness speaks to your character."
        ],
        unkind: [
          "I'm busy. Another time.",
          "I don't have time for games.",
          "Your reputation precedes you. Not favorably.",
          "I've no interest in what you're selling.",
          "You've made mistakes. I know what they are."
        ],
        flirt: [
          "You're charming. More than you know.",
          "Perhaps we could... discuss something privately.",
          "There's something about you I can't resist.",
          "I've been watching you. For professional reasons.",
          "A beautiful soul in a dangerous world."
        ]
      }
    },
    dialogue_topics: [
      { topic: "family", responses: ["My children work in the city. Hard workers.", "Family is everything. Without them, what's the point?", "I send gold home every month. Can't forget where I came from."] },
      { topic: "work", responses: ["The forge never sleeps. Neither do I.", "Trade is the lifeblood of civilization.", "I've built this business from nothing."] },
      { topic: "politics: " responses: ["The Jarl is weak. Maven is strong. That's reality.", "The war divides us, but gold unites.", "The Thalmor are watching. Always watching."] },
      { topic: "trade", responses: ["Prices fluctuate. Buy low, sell high.", "Smuggling pays better, but the risk...", "Quality goods command quality prices."] },
      { topic: "wisdom", responses: ["In this city, trust is currency. Spend it wisely.", "The strong survive. The smart thrive.", "Nothing is free. Everything has a price."] },
      { topic: "regrets", responses: ["I should've done more with my youth.", "My family deserves better than I could give.", "There's a person I should've saved."] }
    ],
    available_activities: [
      "work", "trade", "socialize", "quest", "mentor", "manage", "negotiate", "lead"
    ],
    quest_givers: [
      { type: "delivery", dialogue: "I need this delivered to the blacksmith. Pay's 50 gold." },
      { type: "protection", dialogue: "My caravan needs an escort. 200 gold, if you're strong enough." },
      { type: "investigation", dialogue: "Something's been stolen. Find it, and there's a reward." },
      { type: "elimination", dialogue: "There's a problem that needs... solving. Are you the solving type?" }
    ]
  },
  elderly: {
    npc_responses: {
      greeting: [
        "Ah, another generation walking the same paths. Tell me, what's the world like now?",
        "My bones ache just looking at you. Youth is wasted on the young.",
        "Well met, old friend. We understand each other now, don't we?",
        "The years pass like wind through wheat. You understand?",
        "I've seen your type before. Eager. Foolish. Hopeful.",
        "Time moves differently at my age. Minutes feel like hours.",
        "You carry the weight of the world in your eyes. I recognize that look.",
        "The fire is warm, but the world is cold. Sit with me a while."
      ],
      questions: [
        { q: "What's the best advice?", a: ["Trust no one completely. Not even yourself.", "Gold can buy anything except time.", "The Divines watch, but they don't help. You must help yourself.", "Love is a weakness, but it's the only strength worth having."] },
        { q: "Tell me about the old days.", a: ["When I was young, dragons still flew! Children don't believe me now.", "We had wars that made this one look like a skirmish.", "The Thieves Guild was noble once. Before the corruption.", "I remember when the Empire was strong."] },
        { q: "What do you regret?", a: ["I didn't spend enough time with those I loved.", "I chose gold over people. It seemed important then.", "I should've told them I loved them more.", "There's a person I should have killed when I had the chance."] }
      ],
      reactions: {
        gift: [
          "I haven't received a gift in years. How kind.",
          "This brings back memories. Thank you.",
          "I have nothing to give in return, but my gratitude.",
          "You honor an old soul. This is rare.",
          "I'll pass this on to someone who needs it more."
        ],
        kind: [
          "You have patience. That's a virtue rare in youth.",
          "Your respect for age is noted. Not many have it.",
          "You treat me with dignity. Thank you.",
          "I've watched generations pass. You seem different.",
          "You've got a good heart. Don't let this city kill it."
        ],
        unkind: [
          "Bah! Leave an old man in peace.",
          "I've no time for your insolence.",
          "Youth these days... no respect.",
          "I've seen better people die for less.",
          "You're wasting my final days. Go away."
        ],
        flirt: [
          "I had my time with romance. It's behind me now.",
          "My heart belongs to another. Has for decades.",
          "Flirting at my age? You're bold. I like that.",
          "I'm too old for games. Unless you're talking about chess.",
          "The young always think they're the first to feel."
        ]
      }
    },
    dialogue_topics: [
      { topic: "stories", responses: ["I could tell you tales that'll freeze your blood.", "My grandchildren don't want to hear them. You might.", "One story involves a Daedric Prince. Don't ask which."] },
      { topic: "wisdom", responses: ["Everything ends. Even empires. Even gods.", "The only certainty is change.", "Love, gold, power - all temporary. Only death is certain.", "What you do matters. What you become matters more."] },
      { topic: "memories", responses: ["I remember when this was all farmland.", "The city wasn't always corrupt. It became that way.", "I knew your grandfather. He was a good man."] },
      { topic: "regrets", responses: ["I should've spent more time with family.", "I let a love escape. Never found another.", "I made choices I can't undo. None of us can."] },
      { topic: "fears", responses: ["Dying alone. That's my fear.", "Being forgotten. Like I never existed.", "The darkness. Something waits in it for me."] },
      { topic: "death", responses: ["It's not the end. Just a door.", "I've made my peace. When it comes, I'm ready.", "The afterlife is uncertain. But something comes."] }
    ],
    available_activities: [
      "listen", "learn", "remember", "advise", "warn", "restore", "bless", "foretell"
    ],
    lore_givers: [
      { type: "history", dialogue: "Let me tell you of the Dragon War..." },
      { type: "magic", dialogue: "Magic flows through all things. Even you." },
      { type: "politics", dialogue: "The Jarls forget who they serve. I'll remind you." },
      { type: "religion", dialogue: "The Divines watch, but they are not kind." }
    ]
  }
};

export function getAgeAppropriateDialogue(
  playerAge: number,
  npcAge: number,
  relationship: number,
  timeOfDay: string,
  context: string
): string {
  const playerAgeGroup = getPlayerAgeGroup(playerAge);
  const npcAgeGroup = getPlayerAgeGroup(npcAge);
  
  const ageData = EXPANDED_AGE_DIALOGUE[playerAgeGroup as keyof typeof EXPANDED_AGE_DIALOGUE];
  if (!ageData) return "Greetings.";
  
  if (context === 'greeting') {
    return ageData.npc_responses.greeting[Math.floor(Math.random() * ageData.npc_responses.greeting.length)];
  }
  
  if (context === 'farewell') {
    return ageData.dialogue_topics[0]?.responses[0] || "Until we meet again.";
  }
  
  const topic = ageData.dialogue_topics.find(t => t.topic === context);
  if (topic) {
    return topic.responses[Math.floor(Math.random() * topic.responses.length)];
  }
  
  return ageData.dialogue_topics[0]?.responses[0] || "I see.";
}

export function getPlayerAgeGroup(age: number): string {
  if (age < 16) return 'child';
  if (age < 25) return 'young';
  if (age >= 60) return 'elderly';
  return 'adult';
}

export function getAgeBasedSkillBonus(playerAge: number): Record<string, number> {
  const group = getPlayerAgeGroup(age);
  
  const bonuses: Record<string, Record<string, number>> = {
    child: { learning: 2.0, stamina: 0.8, strength: 0.5 },
    young: { learning: 1.5, stamina: 1.0, strength: 0.8 },
    adult: { learning: 1.0, stamina: 1.0, strength: 1.0 },
    elderly: { learning: 0.8, stamina: 0.7, strength: 0.9, wisdom: 2.0 }
  };
  
  return bonuses[group] || { learning: 1, stamina: 1, strength: 1 };
}

export function getAgeBasedActivityRestrictions(playerAge: number): string[] {
  const group = getPlayerAgeGroup(playerAge);
  
  const restrictions: Record<string, string[]> = {
    child: ['drink_alcohol', 'enter_brothel', 'join_thieves', 'join_combat', 'heavy_work'],
    young: ['enter_brothel'],
    adult: [],
    elderly: ['heavy_work', 'combat_intense']
  };
  
  return restrictions[group] || [];
}

export const AGE_RELEVANT_ENVIRONMENTS: Record<string, Record<string, string[]>> = {
  child: {
    safe: ['home', 'temple', 'school', 'market_day'],
    dangerous: ['night_streets', 'dungeon', 'thieves_hideout', 'combat_zone'],
    appropriate_jobs: ['run_errands', 'begging', 'playing', 'helping'],
    inappropriate_jobs: ['mercenary', 'thief', 'bouncer', 'soldier']
  },
  young: {
    safe: ['tavern', 'market', 'training_grounds'],
    dangerous: ['dungeon', 'bandit_camp', 'vampire_lair'],
    appropriate_jobs: ['apprentice', 'guard', 'adventurer', 'thief'],
    inappropriate_jobs: []
  },
  adult: {
    safe: ['any'],
    dangerous: ['any'],
    appropriate_jobs: ['any'],
    inappropriate_jobs: []
  },
  elderly: {
    safe: ['tavern', 'home', 'temple', 'market'],
    dangerous: ['dungeon', 'combat'],
    appropriate_jobs: ['advisor', 'trainer', 'merchant', 'quest_giver'],
    inappropriate_jobs: ['heavy_labor', 'frontline_combat', 'thief']
  }
};

export function isActivityAgeAppropriate(playerAge: number, activity: string): boolean {
  const group = getPlayerAgeGroup(playerAge);
  const restrictions = getAgeBasedActivityRestrictions(playerAge);
  return !restrictions.includes(activity);
}

export function getAgeAppropriateEncounter(context: string, playerAge: number): string | null {
  const group = getPlayerAgeGroup(playerAge);
  
  const encounters: Record<string, Record<string, string>> = {
    child: {
      found_treasure: "You find a lost coin purse! Can you return it?",
      lost_child: "A child is lost. Help them find their way?",
      kind_stranger: "A kind NPC offers you bread.",
      bully: "Older kids mock you. Stand up to them?"
    },
    young: {
      first_job: "A merchant needs help. First real work?",
      rival_encounter: "Another young adventurer challenges you.",
      love_interest: "Someone catches your eye at the tavern.",
      first_quest: "An old adventurer has a task for you."
    },
    adult: {
      business_opportunity: "A business venture needs capital.",
      family_matters: "News from family. Good or bad.",
      political_intrigue: "You've been noticed by important people.",
      midlife_crisis: "You question your path. What now?"
    },
    elderly: {
      passing_wisdom: "You see yourself in a young traveler. Offer advice?",
      final_lesson: "One last thing to teach before you rest.",
      legacy: "Who will remember you? What will you leave behind?",
      peaceful_end: "A chance for peace in your final years."
    }
  };
  
  const groupEncounters = encounters[group];
  if (!groupEncounters) return null;
  
  const keys = Object.keys(groupEncounters);
  return groupEncounters[keys[Math.floor(Math.random() * keys.length)]];
}