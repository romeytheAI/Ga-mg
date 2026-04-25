export const ES_NPCS_EXPANDED: Record<string, any> = {
  npc_es_brynda: {
    id: 'npc_es_brynda',
    name: 'Brynda Silver-Tongue',
    race: 'Nord',
    gender: 'female',
    description: 'The owner of the Bee and Barb tavern in Riften. A stout woman with laugh lines around her grey eyes and a voice that carries across any room. She knows everyone\'s business but never repeats what she hears — for a price.',
    personality: 'Warm but shrewd, gossip-hungry but discrete, motherly to regulars but ruthless to cheats.',
    age: 45,
    location: 'the_bee_and_barb',
    relationship: 0,
    is_romanceable: false,
    tags: ['merchant','gossip','info'],
    schedule: [
      { time: 'dawn', location: 'the_bee_and_barb', action: 'Opening the tavern, lighting fires''},
      { time: 'morning', location: 'the_bee_and_barb', action: 'Serving breakfast, checking inventory''},
      { time: 'noon', location: 'the_bee_and_barb', action: 'Gossiping with regulars, overhearing news''},
      { time: 'afternoon', location: 'the_bee_and_barb', action: 'Managing staff, negotiating with suppliers''},
      { time: 'dusk', location: 'the_bee_and_barb', action: 'Welcoming evening crowd, reading patrons''},
      { time: 'night', location: 'the_bee_and_barb', action: 'Collecting rumors, closing up''}
    ],
    dialogue_tree: {
      greeting: {
        text: "Ah, welcome to the Bee and Barb! Drink up, warm yourself by the fire. Nothing cures what ails you like a hot meal and good company. What's your pleasure?",
        choices: [
          { label: "What's the latest gossip?", next: 'brynda_gossip', effects: { relationship: 2 } },
          { label: "Looking for work.", next: 'brynda_work', effects: {} },
          { label: "Just here to drink.", next: 'brynda_drink', effects: {} }
        ]
      },
      brynda_gossip: {
        text: "You're in luck. Did you hear Maven Black-Briar's son was seen at the Ragged Flagon? That family has fingers in every pie — especially the ones that aren't theirs. And word is, the Thieves Guild is getting bold again.",
        choices: [
          { label: "Tell me more about Maven.", next: 'brynda_maven', effects: { relationship: 3 } },
          { label: "Thieves Guild? I thought they were gone.", next: 'brynda_thieves', effects: { corruption: 1 } },
          { label: "Thanks for the info.", next: 'brynda_thanks', effects: {} }
        ]
      },
      brynda_maven: {
        text: "Maven controls Riften — make no mistake. She owns the mead, the honey, the guards''pay. Cross her and you'll find yourself in the canal with stones in your pockets. But she's fair if you're useful to her.",
        choices: [
          { label: "How do I get on her good side?", next: 'brynda_advice', effects: { corruption: 2 } },
          { label: "Sounds like a tyrant.", next: 'brynda_tyrant', effects: { willpower: 3 } }
        ]
      },
      brynda_thieves: {
        text: "Gone? No, my dear. Just deeper. The Guild's still here, running things from below. They take what they want, but they keep the peace — mostly. Better than the alternatives.",
        choices: [
          { label: "Where can I find them?", next: 'brynda_flagon', effects: { corruption: 3 } },
          { label: "I'd rather not get involved.", next: 'brynda_safe', effects: { willpower: 2 } }
        ]
      },
      brynda_work: {
        text: "There's always work if you know where to look. Ghorza at the smithy needs help with ore. The Jarl's steward is hiring. Or if you're... ambitious, there's coin to be made in the Ratway.",
        choices: [
          { label: "I'll check the blacksmith.", next: 'brynda_ghorza', effects: { relationship: 2 } },
          { label: "What's the Ratway?", next: 'brynda_thieves', effects: { corruption: 2 } }
        ]
      },
      brynda_drink: {
        text: "Then you've come to the right place. Cyrodiilic brandy, Nordic mead, or if you're daring — Talen-Jei's special Khajiit blend. Careful with that last one.",
        choices: [
          { label: "Give me the mead.", next: 'brynda_mead', effects: { stress: -5 } },
          { label: "What about the blend?", next: 'brynda_blend', effects: { corruption: 2 } }
        ]
      },
      brynda_mead: {
        text: "Good choice. Nord tradition, passed down from the old kings. Drink up — the first one's on the house for newcomers. Stay long enough and you'll learn Riften's secrets.",
        choices: [
          { label: "I might stay a while.", next: 'brynda_welcome', effects: { relationship: 5 } }
        ]
      },
      brynda_blend: {
        text: "Ah, the adventurous type. Just don't say I didn't warn you — it hits different than regular drink. Some find... inspiration. Others find trouble. Usually both.",
        choices: [
          { label: "I'll take my chances.", next: 'brynda_adventure', effects: { corruption: 3 } }
        ]
      },
      brynda_welcome: {
        text: "Always room for another regular. Just don't cause trouble — I've got enough of that with Maven's people. And if you need anything, you come to Brynda first.",
        choices: [
          { label: "You seem like someone I can trust.", next: 'brynda_trust', effects: { relationship: 10 } }
        ]
      },
      brynda_advice: {
        text: "Honey. Bees. Beekeepers. Maven's family made their fortune on honey, so bring her something sweet — literally or otherwise. And don't be a snitch. She hates snitches.",
        choices: [
          { label: "Noted. Thanks.", next: 'brynda_thanks', effects: {} }
        ]
      },
      brynda_tyrant: {
        text: "Perhaps. But she's OUR tyrant, and she's kept Riften running while the rest of Skyrim burns. Can't say the same for the Jarl.",
        choices: [
          { label: "Fair enough.", next: 'brynda_thanks', effects: { relationship: 2 } }
        ]
      },
      brynda_flagon: {
        text: "The Ragged Flagon's beneath Riften — enter through the canal or the bar in the basement. But be careful. They don't take kindly to strangers.",
        choices: [
          { label: "I'm not afraid.", next: 'brynda_brave', effects: { corruption: 2 } }
        ]
      },
      brynda_safe: {
        text: "Smart choice. Some doors, once opened, don't close again. Stay safe, friend.",
        choices: [
          { label: "I will.", next: 'brynda_thanks', effects: { willpower: 2 } }
        ]
      },
      brynda_ghorza: {
        text: "Ghorza is up at the Smelter. Tough as iron, knows every forge in Skyrim. If you can carry a hammer, she'll put you to work.",
        choices: [
          { label: "I'll head there now.", next: 'brynda_thanks', effects: { relationship: 2 } }
        ]
      },
      brynda_adventure: {
        text: "Then drink up and see where the night takes you! Just watch your purse — and your back.",
        choices: [
          { label: "Cheers!", next: 'brynda_thanks', effects: { stress: -3, corruption: 2 } }
        ]
      },
      brynda_trust: {
        text: "In this city? That's rare. I'll remember this. Now drink up, enjoy yourself, and remember — Brynda knows things.",
        choices: []
      },
      brynda_thanks: {
        text: "Anytime. That's what the tavern's for.",
        choices: []
      }
    },
    adult_dialogue: {
      age_gating: {
        child: { redirect_to: 'brynda_greeting', warning: "You feel uncomfortable with this interaction." },
        young: { redirect_to: 'brynda_flirt_young', allow_romance: true },
        adult: { allow_full: true },
        elderly: { allow_full: true }
      },
      greeting: {
        text: "Well, hello there, handsome. Looking for more than just a drink?",
        choices: [
          { label: "What do you mean?", next: 'brynda_adult_explain', effects: {} },
          { label: "Maybe I am.", next: 'brynda_proposition', effects: { corruption: 2 } },
          { label: "Just a drink.", next: 'brynda_drink', effects: {} }
        ]
      },
      brynda_adult_explain: {
        text: "Oh, sweetie, this is Riften. Everything's for sale if you know the right price. And I know all the prices.",
        choices: [
          { label: "I'm interested.", next: 'brynda_proposition', effects: { corruption: 3 } },
          { label: "Maybe later.", next: 'brynda_drink', effects: {} }
        ]
      },
      brynda_proposition: {
        text: "I knew you were the adventurous type. 100 gold and I'll show you a night you won't forget. Private room, no interruptions. What do you say?",
        choices: [
          { label: "Done.", next: 'brynda_accept', effects: { corruption: 5, relationship: 10 } },
          { label: "That's too much.", next: 'brynda_decline', effects: {} },
          { label: "What do I get exactly?", next: 'brynda_details', effects: {} }
        ]
      },
      brynda_details: {
        text: "Full service, sugar. Bed, wine, my famous touch. I'm the best in Riften — ask around. Worth every coin, I guarantee.",
        choices: [
          { label: "I'll take it.", next: 'brynda_accept', effects: { corruption: 5, relationship: 10 } },
          { label: "I'll think about it.", next: 'brynda_decline', effects: {} }
        ]
      },
      brynda_accept: {
        text: "Smart choice. Follow me upstairs — second door on the left. Make yourself comfortable, I'll be right there.",
        choices: [
          { label: "I'll be waiting.", next: 'brynda_adult_end', effects: { corruption: 10 } }
        ]
      },
      brynda_decline: {
        text: "No problem, honey. The offer stands if you change your mind. The night is young.",
        choices: [
          { label: "Thanks.", next: 'brynda_drink', effects: {} }
        ]
      },
      brynda_adult_end: {
        text: "[You've paid Brynda for the evening. The night passes in warmth and pleasure.]",
        choices: []
      }
    }
  },
  npc_es_ghorza: {
    id: 'npc_es_ghorza',
    name: 'Ghorza gra-Bagol',
    race: 'Orc',
    gender: 'female',
    description: 'A muscular Orc blacksmith with a face scarred from decades at the forge. Her arms are thick as tree trunks, and she works the hammer with the rhythm of a drum. Despite her fearsome appearance, she has a soft spot for struggling workers.',
    personality: 'Tough love, proud, traditional, mentors through criticism.',
    age: 42,
    location: 'the_scorched_hammer',
    relationship: 0,
    is_romanceable: false,
    tags: ['smith','trainer','work'],
    schedule: [
      { time: 'dawn', location: 'the_scorched_hammer', action: 'Stoking the forge, preparing materials''},
      { time: 'morning', location: 'the_scorched_hammer', action: 'Forging weapons, supervising apprentices''},
      { time: 'noon', location: 'the_scorched_hammer', action: 'Selling weapons, haggling with customers''},
      { time: 'afternoon', location: 'the_scorched_hammer', action: 'Teaching smithing, repairing armor''},
      { time: 'dusk', location: 'the_scorched_hammer', action: 'Finishing last orders, cleaning workshop''},
      { time: 'night', location: 'the_scorched_hammer', action: 'Resting, sharpening tools''}
    ],
    dialogue_tree: {
      greeting: {
        text: "You stand before my forge. You want weapons? You want to learn? Or are you just gawking? Speak up!",
        choices: [
          { label: "I need a weapon.", next: 'ghorza_buy', effects: {} },
          { label: "I want to learn smithing.", next: 'ghorza_teach', effects: { relationship: 3 } },
          { label: "Just looking.", next: 'ghorza_look', effects: {} }
        ]
      },
      ghorza_buy: {
        text: "I make the best weapons in Riften. Iron for beginners, steel for fighters, Orcish for warriors. What do you need?",
        choices: [
          { label: "A sword.", next: 'ghorza_sword', effects: {} },
          { label: "Armor.", next: 'ghorza_armor', effects: {} },
          { label: "What do you recommend?", next: 'ghorza_recommend', effects: { relationship: 2 } }
        ]
      },
      ghorza_sword: {
        text: "A sword. Everyone wants a sword. Here — Iron sword, 50 gold. Cheap for good steel. Take it or leave it.",
        choices: [
          { label: "I'll take it.", next: 'ghorza_trade', effects: { skills: { weapons: 1 } } },
          { label: "Too expensive.", next: 'ghorza_cheap', effects: {} }
        ]
      },
      ghorza_armor: {
        text: "Armor! The only thing between you and a bleeding corpse. I've got leather, chain, plate — take your pick.",
        choices: [
          { label: "Show me the best.", next: 'ghorza_plate', effects: {} },
          { label: "What's affordable?", next: 'ghorza_leather', effects: {} }
        ]
      },
      ghorza_recommend: {
        text: "Recommend? For you? Hm. You look like you can swing a hammer, so — steel sword, heavy armor. Learn to take a hit before you give one.",
        choices: [
          { label: "You're right. I'll take both.", next: 'ghorza_trade', effects: { relationship: 3, skills: { weapons: 2 } } }
        ]
      },
      ghorza_teach: {
        text: "Learn smithing! Good. The forge teaches humility — it burns the pride out of you. I'll teach you, but it won't be easy. Sweat, blisters, and failure before success.",
        choices: [
          { label: "I'm ready.", next: 'ghorza_train_start', effects: { skills: { crafting: 5 } } },
          { label: "What do I get out of it?", next: 'ghorza_apprentice', effects: {} }
        ]
      },
      ghorza_train_start: {
        text: "Good. Start with the bellows — heat is everything. Then the hammer. Then, maybe, you'll make something worth keeping.",
        choices: [
          { label: "Thank you, Ghorza.", next: 'ghorza_respect', effects: { relationship: 10 } }
        ]
      },
      ghorza_apprentice: {
        text: "You get skills. A trade. Something that fills your belly and keeps you warm. In Skyrim, a smith is never hungry. That's what you get.",
        choices: [
          { label: "Fair enough. Let's start.", next: 'ghorza_train_start', effects: { relationship: 5, skills: { crafting: 3 } } }
        ]
      },
      ghorza_look: {
        text: "Just looking! Everyone looks. Few buy. That's the way of things. But don't touch without asking — some things are too hot for beginners.",
        choices: [
          { label: "What are those?", next: 'ghorza_show', effects: { relationship: 1 } }
        ]
      },
      ghorza_show: {
        text: "This? Orcish warhammer, made it myself. 200 gold. Worth every coin — it'll crush bone and bone won't stop it. You want it?",
        choices: [
          { label: "Impressive.", next: 'ghorza_impressed', effects: { relationship: 2 } },
          { label: "Maybe later.", next: 'ghorza_look', effects: {} }
        ]
      },
      ghorza_trade: {
        text: "Good steel for good gold. That's the deal. Don't come back crying when it's dull — keep it sharp.",
        choices: []
      },
      ghorza_cheap: {
        text: "Too expensive! Too expensive! Then go to the traders on the street — they'll sell you garbage that breaks on the first swing. Come back when you're serious.",
        choices: []
      },
      ghorza_plate: {
        text: "Plate. Heavy. Strong. You'll move slow, but nothing gets through. Best I have — 400 gold. Worth more.",
        choices: [
          { label: "I'll take it.", next: 'ghorza_trade', effects: { defense: 10 } }
        ]
      },
      ghorza_leather: {
        text: "Leather. Cheap. Light. Keeps off rain and knife, but forget it against arrows. Best for quick work.",
        choices: [
          { label: "That sounds right.", next: 'ghorza_trade', effects: { defense: 3 } }
        ]
      },
      ghorza_impressed: {
        text: "You know steel. Good. Someone who appreciates the craft — I'll give you a deal next time.",
        choices: [
          { label: "I appreciate quality.", next: 'ghorza_respect', effects: { relationship: 5 } }
        ]
      },
      ghorza_respect: {
        text: "You. I like you. Come back anytime — there's always work at the forge.",
        choices: []
      }
    },
    adult_dialogue: {
      age_gating: {
        child: { redirect_to: 'ghorza_greeting', warning: "You feel uncomfortable with this interaction." },
        young: { allow_full: true },
        adult: { allow_full: true },
        elderly: { allow_full: true, note: "Can engage in romance but may prefer conversation." }
      },
      greeting: {
        text: "You again. You look at me different than other customers. Like you see something... more.",
        choices: [
          { label: "I admire your strength.", next: 'ghorza_flirt', effects: { relationship: 3 } },
          { label: "Just here for weapons.", next: 'ghorza_work', effects: {} },
          { label: "You interest me.", next: 'ghorza_interest', effects: { corruption: 2 } }
        ]
      },
      ghorza_work: {
        text: " weapons! Always weapons. Fine, look — Iron 50, Steel 100, Orcish 200. Take it or leave it.",
        choices: [
          { label: "Actually, I wanted to talk.", next: 'ghorza_flirt', effects: { relationship: 2 } }
        ]
      },
      ghorza_flirt: {
        text: "Admire! Good. Most just see an Orc and think 'monster'. You see muscle, skill, power. I like that.",
        choices: [
          { label: "You're impressive.", next: 'ghorza_complement', effects: { relationship: 5 } },
          { label: "Want to grab a drink?", next: 'ghorza_date', effects: { corruption: 3 } }
        ]
      },
      ghorza_interest: {
        text: "Interest! Hah! Interest in what — my hammer or something else? Be clear, human. Orc don't play games.",
        choices: [
          { label: "Both.", next: 'ghorza_direct', effects: { corruption: 5 } },
          { label: "Your company.", next: 'ghorza_date', effects: { relationship: 5 } }
        ]
      },
      ghorza_complement: {
        text: "Impressive! Yes. I have put many warriors in the ground, broken many shields. But... I get lonely. The forge is warm, but it doesn't hold me at night.",
        choices: [
          { label: "I could hold you.", next: 'ghorza_proposition', effects: { corruption: 5 } },
          { label: "I'm here for you.", next: 'ghorza_romance', effects: { relationship: 10 } }
        ]
      },
      ghorza_date: {
        text: "Drink! Yes. There's a tavern — Bee and Barb. Good mead, warm fire. After shift, I go there. You could... join me.",
        choices: [
          { label: "I'd like that.", next: 'ghorza_date_accept', effects: { relationship: 10 } },
          { label: "Maybe somewhere more private?", next: 'ghorza_private', effects: { corruption: 5 } }
        ]
      },
      ghorza_direct: {
        text: "Both! Good answer. Strong, honest. I like that. Come to my place after dark — I live above the forge. No one disturbs us.",
        choices: [
          { label: "I'll be there.", next: 'ghorza_accept', effects: { corruption: 10 } }
        ]
      },
      ghorza_proposition: {
        text: "Hold me! Gods, it's been so long. My arms are strong enough to crush bone, but I want them around someone who doesn't fear me.",
        choices: [
          { label: "I don't fear you.", next: 'ghorza_accept', effects: { corruption: 8, relationship: 15 } }
        ]
      },
      ghorza_romance: {
        text: "Here for me! You... you might be worth keeping around. Not many say that. We start slow — drink, talk, see if the spark catches.",
        choices: [
          { label: "I want to try.", next: 'ghorza_date_accept', effects: { romance: 5 } }
        ]
      },
      ghorza_private: {
        text: "Private! Hah! You want to skip the pleasantries. Good. I don't bother with flirting — prefer action. My bed is big enough for two.",
        choices: [
          { label: "Tonight?", next: 'ghorza_accept', effects: { corruption: 10 } }
        ]
      },
      ghorza_date_accept: {
        text: "Then it's a date. I'll finish these orders, meet you at the tavern. Wear something warm — I run hot, but the nights are cold.",
        choices: []
      },
      ghorza_accept: {
        text: "Good. Come after sunset — door's unlocked. I'll have wine, maybe some Skooma if you're feeling adventurous. We'll see where the night takes us.",
        choices: []
      }
    }
  },
  npc_es_risaad: {
    id: 'npc_es_risaad',
    name: "Ri'saad",
    race: 'Khajiit',
    gender: 'male',
    description: 'A lean Khajiit with amber eyes that seem to calculate every transaction. His fur is grey-streaked with age, but his movements remain fluid and precise. He speaks in the third person, as is Khajiit custom.',
    personality: 'Calculating, trade-savvy, secretive, values honor among thieves.',
    age: 45,
    location: 'khajiit_caravan',
    relationship: 0,
    is_romanceable: false,
    tags: ['merchant','trader','rare_goods'],
    schedule: [
      { time: 'dawn', location: 'khajiit_caravan', action: 'Setting up camp, displaying wares''},
      { time: 'morning', location: 'khajiit_caravan', action: 'Bargaining with customers, trading goods''},
      { time: 'noon', location: 'khajiit_caravan', action: 'Resting, eating, tending to caravans''},
      { time: 'afternoon', location: 'khajiit_caravan', action: 'Negotiating deals, acquiring new stock''},
      { time: 'dusk', location: 'khajiit_caravan', action: 'Preparing food, sharing stories''},
      { time: 'night', location: 'khajiit_caravan', action: 'Guarding the caravan, sleeping lightly''}
    ],
    dialogue_tree: {
      greeting: {
        text: "Ah, a customer. Ri'saad welcomes you. The caravan has many goods — weapons, potions, artifacts of distant lands. What does the cat offer you today?",
        choices: [
          { label: "What do you have for sale?", next: 'risaad_goods', effects: {} },
          { label: "I'm looking for something... special.", next: 'risaad_special', effects: { relationship: 3 } },
          { label: "Just browsing.", next: 'risaad_browse', effects: {} }
        ]
      },
      risaad_goods: {
        text: "The caravan carries: potions of healing and strength, enchanted rings, rare ingredients from Elsweyr, skooma — but that one is for serious buyers only. What interests you?",
        choices: [
          { label: "Potions.", next: 'risaad_potions', effects: {} },
          { label: "Enchanted items.", next: 'risaad_magic', effects: {} },
          { label: "Skooma.", next: 'risaad_skooma', effects: { corruption: 5 } }
        ]
      },
      risaad_special: {
        text: "Special? Ri'saad knows special. The caravan has items that cannot be bought in shops — knowledge, contacts, things that certain people want. But the price... the price is high.",
        choices: [
          { label: "I'm prepared to pay.", next: 'risaad_pay', effects: { corruption: 3 } },
          { label: "What kind of things?", next: 'risaad_info', effects: {} }
        ]
      },
      risaad_potions: {
        text: "Potions! Yes, the cat has many. Healing for 20 gold, strength for 40, speed for 30. Potions from Dunmer recipes, passed down through generations.",
        choices: [
          { label: "Healing, please.", next: 'risaad_trade', effects: {} },
          { label: "What else can you offer?", next: 'risaad_goods', effects: {} }
        ]
      },
      risaad_magic: {
        text: "Magic! Enchanted rings, amulets of power, scrolls of ancient spells. Ri'saad trades with mages and thieves alike. The enchanted do not ask where goods came from.",
        choices: [
          { label: "Show me the magic.", next: 'risaad_show_magic', effects: { skills: { magic: 2 } } },
          { label: "Too risky for me.", next: 'risaad_safe', effects: { willpower: 2 } }
        ]
      },
      risaad_skooma: {
        text: "Skooma! The forbidden sugar of the desert. It opens the mind, makes the world glow. But the law forbids it, yes? Ri'saad sells only to those who know the risks.",
        choices: [
          { label: "I know the risks.", next: 'risaad_skooma_sell', effects: { corruption: 10, addiction: 3 } },
          { label: "Maybe another time.", next: 'risaad_safe', effects: { willpower: 3 } }
        ]
      },
      risaad_pay: {
        text: "Good. Ri'saad knows traders who need things done — quiet things, private things. You have gold? You have... talents? Ri'saad can connect you.",
        choices: [
          { label: "I have gold.", next: 'risaad_connection', effects: { corruption: 5 } },
          { label: "What talents do you mean?", next: 'risaad_skills', effects: {} }
        ]
      },
      risaad_info: {
        text: "Ri'saad knows many things — who owes debts to Maven, where the Thieves Guild meets, which Jarls are planning what. Information has price, like all things.",
        choices: [
          { label: "What do you know about Maven?", next: 'risaad_maven_info', effects: { relationship: 5, corruption: 2 } },
          { label: "Never mind.", next: 'risaad_safe', effects: { willpower: 2 } }
        ]
      },
      risaad_maven_info: {
        text: "Maven Black-Briar! She owns this city, from the bee-hives to the guards. Her son is in the Guild, her honey feeds the Jarl's table. Cross her and you will not last long.",
        choices: [
          { label: "How do I get on her good side?", next: 'risaad_advice', effects: { corruption: 3 } },
          { label: "She sounds dangerous.", next: 'risaad_danger', effects: { willpower: 2 } }
        ]
      },
      risaad_connection: {
        text: "Gold! Always gold. Ri'saad will remember you. Return tomorrow — Ri'saad will have a name, a place, a job. Good gold, easy work, no questions.",
        choices: [
          { label: "I'll be back.", next: 'risaad_farewell', effects: { relationship: 10 } }
        ]
      },
      risaad_skills: {
        text: "Theft. Deception. Violence. The cat does not judge — only prices. If you have skill with lockpicks, with blades, with silence — Ri'saad has work.",
        choices: [
          { label: "I'm skilled.", next: 'risaad_connection', effects: { corruption: 3 } },
          { label: "That's not for me.", next: 'risaad_safe', effects: { willpower: 3 } }
        ]
      },
      risaad_advice: {
        text: "Bring her honey, bring her secrets, bring her gold. She values those who are useful. And never, ever steal from her. She knows everything.",
        choices: [
          { label: "Thank you.", next: 'risaad_farewell', effects: {} }
        ]
      },
      risaad_danger: {
        text: "All powerful are dangerous. But the cat survives by knowing when to hiss and when to purr. Choose your battles, customer.",
        choices: [
          { label: "Good advice.", next: 'risaad_farewell', effects: { relationship: 2 } }
        ]
      },
      risaad_show_magic: {
        text: "Here — this ring gives strength. This amulet heals wounds. This scroll summons fire from nothing. Dangerous, yes? But powerful.",
        choices: [
          { label: "I'll take the ring.", next: 'risaad_trade', effects: { skills: { magic: 2 } } },
          { label: "Too dangerous.", next: 'risaad_safe', effects: {} }
        ]
      },
      risaad_skooma_sell: {
        text: "Good, good. Here — skooma, pure from the deserts. One dose, 30 gold. Enjoy... the journey.",
        choices: []
      },
      risaad_browse: {
        text: "Browse, yes. The caravan does not rush. Look at everything, touch nothing without asking. The Khajiit are patient.",
        choices: []
      },
      risaad_safe: {
        text: "The cat understands. Some paths are not for all walkers. Perhaps other goods?",
        choices: [
          { label: "Show me potions.", next: 'risaad_potions', effects: {} }
        ]
      },
      risaad_trade: {
        text: "A fair trade. Ri'saad is pleased. Come back — the caravan always returns.",
        choices: []
      },
      risaad_farewell: {
        text: "Safe travels, customer. The cat remembers those who are kind.",
        choices: []
      }
    },
    adult_dialogue: {
      age_gating: {
        child: { redirect_to: 'risaad_greeting', warning: "You feel uncomfortable with this interaction." },
        young: { allow_full: true, note: "Can access intimacy services." },
        adult: { allow_full: true },
        elderly: { allow_full: true }
      },
      greeting: {
        text: "Ah, the one who returns. Ri'saad has noticed your eyes — they linger on the caravan workers. You seek the warm embrace?",
        choices: [
          { label: "I'm curious.", next: 'risaad_curious', effects: { corruption: 2 } },
          { label: "Just browsing.", next: 'risaad_browse', effects: {} },
          { label: "What do you offer?", next: 'risaad_offer', effects: { corruption: 3 } }
        ]
      },
      risaad_curious: {
        text: "Curious! Yes. The Khajiit are open in ways that shame other races. Our caravans travel long roads — companionship is natural. No shame in seeking warmth.",
        choices: [
          { label: "Tell me more.", next: 'risaad_explain', effects: { relationship: 3 } },
          { label: "I prefer human ways.", next: 'risaad_human', effects: { willpower: 2 } }
        ]
      },
      risaad_offer: {
        text: "The caravan has... companions. Maeva is skilled — she knows the old ways, the touching that brings joy. 50 gold for an hour, 150 for the night.",
        choices: [
          { label: "I'll take an hour.", next: 'risaad_hour', effects: { corruption: 5 } },
          { label: "The full night.", next: 'risaad_night', effects: { corruption: 10 } },
          { label: "That's not for me.", next: 'risaad_decline', effects: { willpower: 3 } }
        ]
      },
      risaad_explain: {
        text: "In Elsweyr, sex is not the taboo it is here. Bodies are natural, pleasure is gift from Alkosh. Our workers are trained — they bring joy, not just release. Is that what you seek?",
        choices: [
          { label: "That sounds wonderful.", next: 'risaad_offer', effects: { corruption: 5 } },
          { label: "It's still strange.", next: 'risaad_human', effects: { willpower: 2 } }
        ]
      },
      risaad_human: {
        text: "Human ways! Cold, ashamed, hiding what is natural. The cat does not judge — but Ri'saad wonders what you miss.",
        choices: [
          { label: "Maybe I'll try.", next: 'risaad_offer', effects: { corruption: 3 } },
          { label: "I'm fine as I am.", next: 'risaad_decline', effects: {} }
        ]
      },
      risaad_hour: {
        text: "Good. Maeva will meet you behind the wagons at dusk. She is gentle, patient — will guide you if this is new. Enjoy, customer.",
        choices: [
          { label: "Thank you.", next: 'risaad_adult_end', effects: { corruption: 5 } }
        ]
      },
      risaad_night: {
        text: "The full night! You are bold. Maeva will be pleased — she loves to please. I will tell her to prepare. 150 gold, and she is yours until dawn.",
        choices: [
          { label: "Done.", next: 'risaad_adult_end', effects: { corruption: 10 } }
        ]
      },
      risaad_decline: {
        text: "As you say. The caravan will be here for days — the offer stands if you change your mind.",
        choices: []
      },
      risaad_adult_end: {
        text: "[You spend time with Maeva. The Khajiit ways are gentle and warm — you find yourself relaxing in ways you didn't expect.]",
        choices: []
      }
    }
  },
  npc_es_farengar: {
    id: 'npc_es_farengar',
    name: 'Farengar Secret-Fire',
    race: 'Breton',
    gender: 'male',
    description: 'A thin Breton mage with a pointed beard and calculating eyes. He wears blue robes trimmed with silver and carries himself with scholarly arrogance. His title comes from his specialty in fire magic.',
    personality: 'Aloof, scholarly, dangerous knowledge seeker, values power.',
    age: 52,
    location: 'mistveil_keep',
    relationship: 0,
    is_romanceable: false,
    tags: ['mage','scholar','court_wizard'],
    schedule: [
      { time: 'dawn', location: 'mistveil_keep', action: 'Studying ancient tomes, practicing spells''},
      { time: 'morning', location: 'mistveil_keep', action: 'Consulting with the Jarl, advising on magical matters''},
      { time: 'noon', location: 'mistveil_keep', action: 'Experimenting with potions, transmutations''},
      { time: 'afternoon', location: 'mistveil_keep', action: 'Teaching apprentice, researching''},
      { time: 'dusk', location: 'mistveil_keep', action: 'Reviewing notes, recording discoveries''},
      { time: 'night', location: 'mistveil_keep', action: 'Private rituals, forbidden research''}
    ],
    dialogue_tree: {
      greeting: {
        text: "I am Farengar Secret-Fire, Court Wizard to the Jarl of Riften. I trust you have a reason to disturb my studies?",
        choices: [
          { label: "I seek magical knowledge.", next: 'farengar_knowledge', effects: { skills: { magic: 2 } } },
          { label: "The Jarl sent me.", next: 'farengar_jarl', effects: {} },
          { label: "Just passing through.", next: 'farengar_dismiss', effects: {} }
        ]
      },
      farengar_knowledge: {
        text: "Knowledge! Yes, I have accumulated much in my years. Spells of flame, of frost, of binding. But knowledge has price — my time, your gold, perhaps something... more.",
        choices: [
          { label: "What can you teach me?", next: 'farengar_teach', effects: { relationship: 3 } },
          { label: "What do you mean by something more?", next: 'farengar_more', effects: { corruption: 3 } }
        ]
      },
      farengar_jarl: {
        text: "The Jarl! Yes, he often sends... lessers... to fetch things. What does he require this time? A wards for the keep? Analysis of some trinket?",
        choices: [
          { label: "Something about a dragon.", next: 'farengar_dragon', effects: { skills: { magic: 3 } } },
          { label: "He's checking on you.", next: 'farengar_suspicion', effects: {} }
        ]
      },
      farengar_dragon: {
        text: "Dragons! Yes, yes — I have been researching the Thu'um, the Dragon Language. There are texts, you see, that speak of their power. Fire and word, both. Perhaps you could assist me?",
        choices: [
          { label: "How can I help?", next: 'farengar_research', effects: { corruption: 2 } },
          { label: "Sounds dangerous.", next: 'farengar_caution', effects: { willpower: 2 } }
        ]
      },
      farengar_teach: {
        text: "I can teach you basic wards, flame sparks, perhaps something more if you prove capable. But first — what can you offer me? Rare ingredients? Ancient artifacts?",
        choices: [
          { label: "I have gold.", next: 'farengar_pay', effects: {} },
          { label: "What artifacts do you need?", next: 'farengar_artifacts', effects: { relationship: 3 } }
        ]
      },
      farengar_more: {
        text: "The... more. Blood. Soul. Ingredients that cannot be bought in markets. The magical arts require sacrifice, and I do not speak of gold.",
        choices: [
          { label: "I'm not interested in that.", next: 'farengar_dismiss', effects: { willpower: 5 } },
          { label: "What kind of sacrifice?", next: 'farengar_sacrifice', effects: { corruption: 8 } }
        ]
      },
      farengar_research: {
        text: "You could bring me texts — from Dwemer ruins, from dragon temples, from the old crypts. Knowledge is power, and power is what I seek.",
        choices: [
          { label: "I'll bring you what I find.", next: 'farengar_deal', effects: { relationship: 10 } }
        ]
      },
      farengar_caution: {
        text: "Dangerous? All worthwhile things are dangerous. But I understand — some are not meant for the heights of magic. Perhaps simpler pursuits?",
        choices: [
          { label: "Maybe later.", next: 'farengar_dismiss', effects: {} }
        ]
      },
      farengar_pay: {
        text: "Gold. Always gold. Very well — I will teach you flame at dawn, but only if you bring me 100 gold for materials.",
        choices: [
          { label: "Done.", next: 'farengar_teach_success', effects: { skills: { magic: 5 } } }
        ]
      },
      farengar_artifacts: {
        text: "Dwemer cog, Falmer ear, Black Soul Gem — these interest me greatly. Bring such things and I will teach you knowledge no school can offer.",
        choices: [
          { label: "I'll keep an eye out.", next: 'farengar_deal', effects: { relationship: 5 } }
        ]
      },
      farengar_sacrifice: {
        text: "Blood of enemies, soul of the dying, essence of daedra — these are the currencies of true magic. I do not ask you to do this now, but remember: power has a price.",
        choices: [
          { label: "I understand.", next: 'farengar_deal', effects: { corruption: 10 } }
        ]
      },
      farengar_deal: {
        text: "Excellent. We have an arrangement. Bring me knowledge and I will share my own. This is the way of scholars.",
        choices: []
      },
      farengar_teach_success: {
        text: "Very well. Tomorrow at dawn, find me in my study. We begin with the basics — but you may find yourself surprised at what you can achieve.",
        choices: []
      },
      farengar_dismiss: {
        text: "Then do not waste my time. I have experiments to conduct, knowledge to uncover. Be gone.",
        choices: []
      },
      farengar_suspicion: {
        text: "Checking on me! As if I am some servant! I am the Court Wizard — my work is beyond their understanding. Tell him I am... efficient.",
        choices: []
      }
    },
    adult_dialogue: {
      age_gating: {
        child: { redirect_to: 'farengar_greeting', warning: "This interaction feels wrong." },
        young: { allow_full: true },
        adult: { allow_full: true },
        elderly: { allow_full: true, note: "May discuss magical theory instead." }
      },
      greeting: {
        text: "You again. Your presence has become... notable. I have been conducting research that requires certain... intimacies. Perhaps you could assist?",
        choices: [
          { label: "What kind of research?", next: 'farengar_research_adult', effects: { corruption: 3 } },
          { label: "I'm busy.", next: 'farengar_dismiss', effects: {} },
          { label: "Maybe I can help.", next: 'farengar_assist', effects: { relationship: 3 } }
        ]
      },
      farengar_research_adult: {
        text: "Magical bonding — the connection between bodies that amplifies magical output. I believe certain... acts... can enhance spellcasting. I need subjects to test this theory.",
        choices: [
          { label: "That sounds dangerous.", next: 'farengar_dangerous', effects: { willpower: 3 } },
          { label: "I'm interested.", next: 'farengar_test', effects: { corruption: 8 } },
          { label: "How does it work?", next: 'farengar_explain', effects: {} }
        ]
      },
      farengar_assist: {
        text: "Good. Your aura shows promise — you have latent magical potential. My chambers are warded, private. I can teach you things that no college would dare teach.",
        choices: [
          { label: "Show me.", next: 'farengar_accept', effects: { corruption: 10 } },
          { label: "What exactly do you do?", next: 'farengar_explain', effects: {} }
        ]
      },
      farengar_explain: {
        text: "The body is a vessel for magicka. When vessels connect intimately, energy flows between them. I have scrolls from Hermaeus Mora — forbidden knowledge. With the right partner, spells become more powerful.",
        choices: [
          { label: "Let's try it.", next: 'farengar_accept', effects: { corruption: 10, skills: { magic: 5 } } },
          { label: "This feels wrong.", next: 'farengar_moral', effects: { willpower: 5 } }
        ]
      },
      farengar_test: {
        text: "I need someone willing. You will lie on the altar, I will channel energy through my hands. The sensation is... intense. Some find it overwhelming. 200 gold and you help advance magical science.",
        choices: [
          { label: "I'll do it.", next: 'farengar_accept', effects: { corruption: 10, skills: { magic: 10 } } },
          { label: "Too strange.", next: 'farengar_decline', effects: {} }
        ]
      },
      farengar_dangerous: {
        text: "Dangerous! All magic is dangerous. But this — this is the path to true power. The college would burn these texts. Do you want to be safe, or powerful?",
        choices: [
          { label: "I want power.", next: 'farengar_accept', effects: { corruption: 8 } },
          { label: "I'll pass.", next: 'farengar_decline', effects: {} }
        ]
      },
      farengar_accept: {
        text: "Excellent. Tonight, when the moon is dark, come to my study. Remove your clothes, lie on the altar. I will begin the ritual. Do exactly as I say, and you will feel magicka like never before.",
        choices: [
          { label: "I'll be there.", next: 'farengar_adult_end', effects: { corruption: 15 } }
        ]
      },
      farengar_moral: {
        text: "Wrong! This is how the ignorant think. The body is merely matter — magic is truth. You are too bound by fear to understand. Be gone.",
        choices: []
      },
      farengar_decline: {
        text: "Very well. The offer stands when you change your mind. Many come back — they cannot resist the pull of power.",
        choices: []
      },
      farengar_adult_end: {
        text: "[Farengar's ritual is intense — you feel magicka flood through your body in ways that blur the line between pain and pleasure. You emerge changed.]",
        choices: []
      }
    }
  },
  npc_es_mjoll: {
    id: 'npc_es_mjoll',
    name: 'Mjoll the Lioness',
    race: 'Nord',
    gender: 'female',
    description: 'A powerful Nord woman with golden hair pulled back in warrior braids and arms thick with muscle. Her face bears scars from battles won and lost. She carries a warhammer and moves with the confidence of a seasoned fighter.',
    personality: 'Idealistic, strong, hates thieves and cruelty, protective.',
    age: 35,
    location: 'riften_streets',
    relationship: 0,
    is_romanceable: true,
    tags: ['adventurer','warrior','hero'],
    schedule: [
      { time: 'dawn', location: 'riften_streets', action: 'Morning patrol, looking for trouble''},
      { time: 'morning', location: 'the_bee_and_barb', action: 'Eating, gathering information''},
      { time: 'noon', location: 'riften_streets', action: 'Fighting bandits, helping citizens''},
      { time: 'afternoon', location: 'riften_market', action: 'Buying supplies, selling loot''},
      { time: 'dusk', location: 'riften_outskirts', action: 'Searching for evil, tracking threats''},
      { time: 'night', location: 'the_bee_and_barb', action: 'Drinking, telling stories''}
    ],
    dialogue_tree: {
      greeting: {
        text: "You there! You look like someone who can handle a weapon. You looking for trouble, or looking to stop it?",
        choices: [
          { label: "Looking to help.", next: 'mjoll_help', effects: { relationship: 5 } },
          { label: "Just passing through.", next: 'mjoll_pass', effects: {} },
          { label: "What's happening in Riften?", next: 'mjoll_news', effects: {} }
        ]
      },
      mjoll_help: {
        text: "Help! Yes! There's always need for those willing to fight. Bandits in the hills, Thieves in the shadows — I could use someone with a strong arm.",
        choices: [
          { label: "I'm strong.", next: 'mjoll_strength', effects: { relationship: 3 } },
          { label: "What kind of enemies?", next: 'mjoll_enemies', effects: {} }
        ]
      },
      mjoll_pass: {
        text: "Passing through! The lazy way to live. No purpose, no honor. But I won't stop you — not everyone is meant for the fight.",
        choices: [
          { label: "Maybe I'll stay a while.", next: 'mjoll_stay', effects: { relationship: 2 } },
          { label: "I've got my own path.", next: 'mjoll_path', effects: {} }
        ]
      },
      mjoll_news: {
        text: "News! Too much. The Thieves Guild grows bold, Maven Black-Briar pulls strings, and the Jarl sits in his hall doing nothing. Someone needs to clean this city.",
        choices: [
          { label: "Sounds like a mess.", next: 'mjoll_mess', effects: {} },
          { label: "I'll help if I can.", next: 'mjoll_help', effects: { relationship: 5 } }
        ]
      },
      mjoll_strength: {
        text: "Good! A warrior needs strength, but more than that — heart. You fight for something, not just against. What drives you?",
        choices: [
          { label: "Justice.", next: 'mjoll_justice', effects: { relationship: 10, willpower: 5 } },
          { label: "Gold.", next: 'mjoll_gold', effects: { corruption: 2 } }
        ]
      },
      mjoll_enemies: {
        text: "The worst kind. Bandits who murder travelers, thieves who ruin lives, those who prey on the weak. And worse — there's a vampire nest in the hills, I've heard.",
        choices: [
          { label: "Vampires! That's serious.", next: 'mjoll_vampire', effects: { relationship: 5 } },
          { label: "Sounds like too much for me.", next: 'mjoll_coward', effects: { relationship: -5 } }
        ]
      },
      mjoll_justice: {
        text: "Justice! Now THAT is what I want to hear. Too few in this city care about honor. If you fight for what's right, I'll fight beside you any day.",
        choices: [
          { label: "Let's work together.", next: 'mjoll_partner', effects: { relationship: 15, is_romanceable: true } }
        ]
      },
      mjoll_gold: {
        text: "Gold. Well, that's honest at least. Some pretend to be heroes while chasing coin. At least you know what you want. Just don't cross the line.",
        choices: [
          { label: "I'll keep that in mind.", next: 'mjoll_caution', effects: { relationship: 2 } }
        ]
      },
      mjoll_vampire: {
        text: "Serious? It's monstrous! They're killing and turning people in the night. Someone needs to burn them out. I would do it myself, but I could use backup.",
        choices: [
          { label: "I'll help you.", next: 'mjoll_vampire_quest', effects: { relationship: 10 } }
        ]
      },
      mjoll_stay: {
        text: "Stay? Good! Riften needs more people willing to do what's right. Come find me when you want to fight — I'll have work.",
        choices: [
          { label: "I'll find you.", next: 'mjoll_farewell', effects: { relationship: 5 } }
        ]
      },
      mjoll_path: {
        text: "Your path is yours to choose. Just make sure it's not stepping on others to get where you're going.",
        choices: []
      },
      mjoll_mess: {
        text: "It IS a mess! The Thieves Guild runs half the city, Maven runs the other half, and the Jarl is blind to it all. Someone needs to make a change.",
        choices: [
          { label: "I could make a difference.", next: 'mjoll_help', effects: { relationship: 5 } }
        ]
      },
      mjoll_coward: {
        text: "Too much? Perhaps. But the weak suffer while the strong hide. That's not how a warrior thinks.",
        choices: []
      },
      mjoll_partner: {
        text: "Together! With you fighting for what's right, we could actually clean up this city. I... I could use someone I can trust. Come with me?",
        choices: [
          { label: "Lead the way.", next: 'mjoll_romance', effects: { romance: 10 } }
        ]
      },
      mjoll_romance: {
        text: "You... you're different. Most just want coin or power. You actually care. I don't meet many like you. Let's see where this goes.",
        choices: []
      },
      mjoll_vampire_quest: {
        text: "Thank you. I knew there was something about you. Meet me outside the city at dusk — I'll show you where they've been hiding.",
        choices: []
      },
      mjoll_caution: {
        text: "That line? Murder, theft, preying on the innocent — those cross the line. Stay on the right side and we'll get along fine.",
        choices: []
      },
      mjoll_farewell: {
        text: "Stay safe out there. And if you see wrongdoing — don't walk away.",
        choices: []
      }
    },
    adult_dialogue: {
      age_gating: {
        child: { redirect_to: 'mjoll_greeting', warning: "You feel uncomfortable with this interaction." },
        young: { allow_full: true, allow_romance: true },
        adult: { allow_full: true },
        elderly: { allow_full: true, note: "Can pursue romantic relationship." }
      },
      greeting: {
        text: "You. I've noticed the way you look at me when I'm fighting. You like what you see, don't you?",
        choices: [
          { label: "You're impressive.", next: 'mjoll_flirt', effects: { relationship: 5 } },
          { label: "I respect your skill.", next: 'mjoll_respect', effects: { relationship: 3 } },
          { label: "What are you talking about?", next: 'mjoll_confuse', effects: {} }
        ]
      },
      mjoll_flirt: {
        text: "Impressive! Good to hear. Most just stare like I'm a freak. You see a warrior. That's rare.",
        choices: [
          { label: "I see more than that.", next: 'mjoll_romance_adult', effects: { relationship: 10, corruption: 3 } },
          { label: "You are impressive in battle.", next: 'mjoll_respect', effects: { relationship: 5 } }
        ]
      },
      mjoll_respect: {
        text: "Skill! Yes, I've earned every scar. But there's more to life than fighting. After the battles, the nights get cold.",
        choices: [
          { label: "I could warm you.", next: 'mjoll_proposition', effects: { corruption: 5 } },
          { label: "We should grab a drink.", next: 'mjoll_date', effects: { relationship: 10 } }
        ]
      },
      mjoll_confuse: {
        text: "Don't play coy. I've seen warriors''eyes before — you want me. Not that I blame you.",
        choices: [
          { label: "You caught me.", next: 'mjoll_admit', effects: { corruption: 3 } },
          { label: "That's not it.", next: 'mjoll_respect', effects: {} }
        ]
      },
      mjoll_admit: {
        text: "Good. At least you're honest. I respect that more than the ones who pretend. You want me in your bed?",
        choices: [
          { label: "More than anything.", next: 'mjoll_proposition', effects: { corruption: 8 } },
          { label: "I want to know you first.", next: 'mjoll_date', effects: { relationship: 5 } }
        ]
      },
      mjoll_romance_adult: {
        text: "More! You see a woman, not just a warrior. That's... that's what I've wanted. After a fight, I want someone who sees me, not just Mjoll the Lioness.",
        choices: [
          { label: "I see you.", next: 'mjoll_accept', effects: { romance: 15 } }
        ]
      },
      mjoll_proposition: {
        text: "Warm me! Gods, it's been so long. The inn has rooms. I know you want it — I want it too. Tonight?",
        choices: [
          { label: "Tonight.", next: 'mjoll_accept', effects: { corruption: 10 } },
          { label: "Let's take it slow.", next: 'mjoll_date', effects: { relationship: 5 } }
        ]
      },
      mjoll_date: {
        text: "Drink! Yes. Let's start there. After my shift, I'll meet you at the Bee and Barb. We talk, we drink, we see where things go. No pressure.",
        choices: [
          { label: "I'll be there.", next: 'mjoll_date_accept', effects: { romance: 10 } }
        ]
      },
      mjoll_accept: {
        text: "Good. I'll meet you in the back room after dark. No words needed — just two warriors satisfying needs.",
        choices: []
      },
      mjoll_date_accept: {
        text: "Good. I'll finish my patrol, clean up, then find you. Wear something nice — it's a date now, aren't it?",
        choices: []
      }
    }
  },
  npc_es_riften_prostitute: {
    id: 'npc_es_riften_prostitute',
    name: 'Inga',
    race: 'Nord',
    gender: 'female',
    description: 'A young woman with bleached hair and painted cheeks standing on the corner near the Ragged Flagon. Her dress is too thin for the cold but shows everything she has to offer.',
    personality: 'Pragmatic, tired but professional, sees clients as survival.',
    age: 24,
    location: 'riften_streets',
    relationship: 0,
    is_romanceable: false,
    tags: ['prostitute','adult'],
    schedule: [
      { time: 'dusk', location: 'riften_streets', action: 'Working the corner''},
      { time: 'night', location: 'riften_streets', action: 'Finding clients''},
      { time: 'midnight', location: 'riften_tavern', action: 'Resting, drinking''}
    ],
    dialogue_tree: {
      greeting: {
        text: "Looking for company, handsome? 20 gold for a quick time, 50 for the full night. I'm clean — got checked last week.",
        choices: [
          { label: "20 gold.", next: 'inga_quick', effects: { corruption: 3 } },
          { label: "50 gold.", next: 'inga_full', effects: { corruption: 5 } },
          { label: "Just talking.", next: 'inga_talk', effects: {} },
          { label: "Not interested.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_quick: {
        text: "Quick! Alright, there's an alley behind the Tanner's. Quick and dirty. 20 gold, no kissing. Let's go.",
        choices: [
          { label: "Here.", next: 'inga_accept', effects: { corruption: 5 } },
          { label: "Actually, I changed my mind.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_full: {
        text: "Full night! You must have coin. There's a room above the Fishmonger's — quiet, warm, no one bothers us. 50 gold and I make it worth your while.",
        choices: [
          { label: "Done.", next: 'inga_accept', effects: { corruption: 8 } },
          { label: "That's too much.", next: 'inga_cheap', effects: {} }
        ]
      },
      inga_talk: {
        text: "Talking! Ha! Most don't want to talk — they want to use me and leave. But I guess some like the company first.",
        choices: [
          { label: "What's your story?", next: 'inga_story', effects: { relationship: 2 } },
          { label: "Never mind.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_bye: {
        text: "Suit yourself. Other customers will come.",
        choices: []
      },
      inga_story: {
        text: "Story! You want my story? I was a farm girl — got kicked out when my father found out I wasn't a virgin. Riften was the only place that would take me. This pays better than scrubbing pots.",
        choices: [
          { label: "That's rough.", next: 'inga_pity', effects: { relationship: 3 } },
          { label: "At least you're surviving.", next: 'inga_survive', effects: { relationship: 2 } }
        ]
      },
      inga_pity: {
        text: "Rough! This is life. Not everyone gets to be a hero. But I make coin, I eat, I'm not dead. That's something.",
        choices: [
          { label: "Want to get out of this?", next: 'inga_escape', effects: { relationship: 5 } },
          { label: "Keep doing what works.", next: 'inga_accept', effects: { corruption: 3 } }
        ]
      },
      inga_survive: {
        text: "Surviving! Yes. That's all any of us do. But maybe one day I'll have enough to leave. Buy a farm somewhere, raise goats. Dream big, right?",
        choices: [
          { label: "Dreams can come true.", next: 'inga_dreams', effects: { relationship: 3 } },
          { label: "Here's to survival.", next: 'inga_accept', effects: { corruption: 3 } }
        ]
      },
      inga_escape: {
        text: "Get out! Ha! You got 500 gold? That's what it takes to leave Skyrim, buy a new life. I make 30 a night if I'm lucky. Not enough to save.",
        choices: [
          { label: "I'll help you.", next: 'inga_help', effects: { relationship: 10 } },
          { label: "That's a lot.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_help: {
        text: "Help! You'd do that? You're the first customer who offered more than my body. Maybe... maybe you're different. I'll remember this.",
        choices: [
          { label: "We all deserve a chance.", next: 'inga_farewell', effects: { relationship: 15 } }
        ]
      },
      inga_dreams: {
        text: "Dreams! Maybe. Or maybe I die in this gutter. But I can hope, can't I? Thanks for the chat, stranger. Now — business or leave?",
        choices: [
          { label: "Let's do business.", next: 'inga_accept', effects: { corruption: 3 } },
          { label: "Goodbye.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_cheap: {
        text: "Too much! Then find someone cheaper — there's a Khajiit caravan south of here. Same price, different... skills.",
        choices: [
          { label: "Maybe later.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_accept: {
        text: "Follow me. Try to keep up.",
        choices: []
      },
      inga_farewell: {
        text: "Thank you. For the first time in years, I feel like someone sees me as a person. Safe travels, stranger.",
        choices: []
      }
    },
    adult_dialogue: {
      age_gating: {
        child: { redirect_to: 'inga_greeting', warning: "This interaction is not appropriate." },
        young: { allow_full: true, note: "Legal adult in this setting." },
        adult: { allow_full: true },
        elderly: { allow_full: true }
      },
      greeting: {
        text: "Back again? You must've enjoyed yourself. Or maybe you want something... more.",
        choices: [
          { label: "Same as before.", next: 'inga_adult_quick', effects: { corruption: 3 } },
          { label: "I want the full service.", next: 'inga_adult_full', effects: { corruption: 5 } },
          { label: "Just missed you.", next: 'inga_adult_romance', effects: { relationship: 5 } },
          { label: "Goodbye.", next: 'inga_bye', effects: {} }
        ]
      },
      inga_adult_quick: {
        text: "Quick! Same alley, same price. 20 gold and I'll make it quick. You're a regular now — I'll make it good.",
        choices: [
          { label: "Done.", next: 'inga_adult_accept', effects: { corruption: 5 } }
        ]
      },
      inga_adult_full: {
        text: "Full service! You know what you want. 50 gold, I do everything — oral, vaginal, whatever you like. I take it all.",
        choices: [
          { label: "Here's the gold.", next: 'inga_adult_accept', effects: { corruption: 8 } },
          { label: "What else do you offer?", next: 'inga_extras', effects: {} }
        ]
      },
      inga_adult_romance: {
        text: "Missed me! That's... that's not something they usually say. You actually care? Maybe you're the one who helps me get out.",
        choices: [
          { label: "I do care.", next: 'inga_romance_accept', effects: { romance: 10 } },
          { label: "Let's just have fun.", next: 'inga_adult_quick', effects: { corruption: 3 } }
        ]
      },
      inga_extras: {
        text: "Extras! For more gold, I do anal — 30 more. threesome with my friend — she's 30 gold. Or I can roleplay — maid, noble, whatever you want. Your fantasy, my coin.",
        choices: [
          { label: "I'll take everything.", next: 'inga_adult_accept', effects: { corruption: 15 } },
          { label: "Just the regular.", next: 'inga_adult_quick', effects: { corruption: 3 } }
        ]
      },
      inga_romance_accept: {
        text: "You actually care! I... I don't know what to say. Maybe we can start something — date, get to know each other. I haven't felt this in years.",
        choices: [
          { label: "Let's try.", next: 'inga_romance_date', effects: { romance: 15 } }
        ]
      },
      inga_adult_accept: {
        text: "Right this way. Try to be quiet — the guards don't like us, but they look the other way for coin.",
        choices: []
      },
      inga_romance_date: {
        text: "Tomorrow, at the Bee and Barb. No business — just two people. I'll wear a real dress. No more tricks, no more customers. Just us.",
        choices: []
      }
    }
  },
  npc_es_khajiit_intimacy_worker: {
    id: 'npc_es_khajiit_intimacy_worker',
    name: 'Maeva',
    race: 'Khajiit',
    gender: 'female',
    description: 'A sleek Khajiit with cream-colored fur and amber eyes. She moves with fluid grace and wears a revealing silk outfit typical of caravan intimacy workers.',
    personality: 'Playful, sensual, unbothered by shame, professional.',
    age: 26,
    location: 'khajiit_caravan',
    relationship: 0,
    is_romanceable: false,
    tags: ['intimacy_worker','khajiit','adult'],
    schedule: [
      { time: 'dusk', location: 'khajiit_caravan', action: 'Preparing for evening clients''},
      { time: 'night', location: 'khajiit_caravan', action: 'Serving customers''},
      { time: 'dawn', location: 'khajiit_caravan', action: 'Resting''}
    ],
    dialogue_tree: {
      greeting: {
        text: "Mm, a new customer. Ri'saad said you might visit. You want the warm company? 50 gold for an hour, 150 for the night. Maeva is very good.",
        choices: [
          { label: "One hour.", next: 'maeva_hour', effects: { corruption: 5 } },
          { label: "All night.", next: 'maeva_night', effects: { corruption: 10 } },
          { label: "What do you do?", next: 'maeva_explain', effects: {} },
          { label: "Not today.", next: 'maeva_bye', effects: {} }
        ]
      },
      maeva_hour: {
        text: "One hour! Good choice. Behind the wagons, where no one sees. I use my mouth, my paws, my tail — all the Khajiit tricks. 50 gold, pleasure guaranteed.",
        choices: [
          { label: "Here's the gold.", next: 'maeva_accept', effects: { corruption: 5 } },
          { label: "That's a lot.", next: 'maeva_cheap', effects: {} }
        ]
      },
      maeva_night: {
        text: "All night! You are generous. I will make it memorable — multiple rounds, different positions, maybe some toys from home. 150 gold, you won't want to leave.",
        choices: [
          { label: "Done.", next: 'maeva_accept', effects: { corruption: 10 } },
          { label: "Maybe just the hour.", next: 'maeva_hour', effects: { corruption: 5 } }
        ]
      },
      maeva_explain: {
        text: "What do I do! You must be new to Khajiit caravans. We provide intimacy — sex, but also touch, company, release. We are trained to bring pleasure like no other. Would you like a demonstration?",
        choices: [
          { label: "Show me.", next: 'maeva_demo', effects: { corruption: 8 } },
          { label: "Maybe later.", next: 'maeva_bye', effects: {} }
        ]
      },
      maeva_bye: {
        text: "As you wish. The caravan stays three days — return when you want warmth.",
        choices: []
      },
      maeva_cheap: {
        text: "A lot! This is cheap for quality. In other cities, they'd charge double. But we are fair — all are welcome.",
        choices: [
          { label: "Fine, here's 50.", next: 'maeva_accept', effects: { corruption: 5 } },
          { label: "I'll pass.", next: 'maeva_bye', effects: {} }
        ]
      },
      maeva_accept: {
        text: "Follow me, customer. The wagons are private. Relax — I take care of everything.",
        choices: []
      },
      maeva_demo: {
        text: "Demo! Yes. Come closer. I will touch your face, your neck — slow, gentle. The body responds before the mind knows why. Feel?",
        choices: [
          { label: "I feel it.", next: 'maeva_arouse', effects: { corruption: 10 } },
          { label: "That's enough.", next: 'maeva_bye', effects: { willpower: 3 } }
        ]
      },
      maeva_arouse: {
        text: "Good! Your skin tells the truth even when your mouth lies. You want me now. 50 gold and I'll make you forget your name.",
        choices: [
          { label: "Take me.", next: 'maeva_accept', effects: { corruption: 10 } }
        ]
      }
    },
    adult_dialogue: {
      greeting: {
        text: "You returned! Maeva hoped you would. The others were nice, but you — you have a certain hunger. Let me satisfy it.",
        choices: [
          { label: "You know me well.", next: 'maeva_adult_well', effects: { corruption: 5 } },
          { label: "I want something new.", next: 'maeva_adult_new', effects: { corruption: 8 } },
          { label: "Let's just talk.", next: 'maeva_talk', effects: { relationship: 3 } },
          { label: "Not now.", next: 'maeva_bye', effects: {} }
        ]
      },
      maeva_adult_well: {
        text: "Know you! Your eyes tell me everything — how long since you last felt this, how much you want it. I can give you what others can't.",
        choices: [
          { label: "What can you give?", next: 'maeva_skills', effects: { corruption: 8 } },
          { label: "I want you now.", next: 'maeva_accept', effects: { corruption: 5 } }
        ]
      },
      maeva_adult_new: {
        text: "New! You want to try things. I have skills from all over Tamriel — Dunmer tantric, Breton toys, Argonian... surprises. 30 gold more and I'll show you something you've never felt.",
        choices: [
          { label: "Show me everything.", next: 'maeva_full', effects: { corruption: 15 } },
          { label: "Just the basics.", next: 'maeva_accept', effects: { corruption: 5 } }
        ]
      },
      maeva_skills: {
        text: "Everything. Kissing, touching, oral, vaginal, anal — I do all. But my specialty is using my tail, my paws. The sensitivity of Khajiit — I can make you feel things you didn't know existed.",
        choices: [
          { label: "Let's try everything.", next: 'maeva_full', effects: { corruption: 10 } },
          { label: "I'll start with oral.", next: 'maeva_accept', effects: { corruption: 5 } }
        ]
      },
      maeva_full: {
        text: "Everything! Good. Tonight I will use my mouth, my paws, my tail. I'll ride you until you can't move, then go slower. By dawn, you'll understand why customers return.",
        choices: [
          { label: "Worth every coin.", next: 'maeva_accept', effects: { corruption: 15 } }
        ]
      },
      maeva_talk: {
        text: "Talk! Most don't want to talk. But I am more than my body — I have stories, dreams. In Elsweyr, I was a dancer. Here, I am this. But I still dream of the stage.",
        choices: [
          { label: "Tell me about Elsweyr.", next: 'maeva_story', effects: { relationship: 5 } },
          { label: "Maybe one day you can return.", next: 'maeva_hope', effects: { relationship: 3 } }
        ]
      },
      maeva_story: {
        text: "Elsweyr! The warm sun, the sand between toes, the moon-sugar plantations. I danced for the moon and ate sweet fruits. Then the war came, and I fled. Now this.",
        choices: [
          { label: "I'm sorry.", next: 'maeva_sad', effects: { relationship: 3 } },
          { label: "You're strong to survive.", next: 'maeva_strong', effects: { relationship: 5 } }
        ]
      },
      maeva_sad: {
        text: "Sorry! Don't be. I survived when many didn't. And I give pleasure — that is not shameful. It helps people forget their pain, even if just for an hour.",
        choices: [
          { label: "You help people.", next: 'maeva_accept', effects: { relationship: 3, corruption: 3 } }
        ]
      },
      maeva_strong: {
        text: "Strong! Yes. Surviving is strength. And maybe one day I go back, become dancer again. Until then — I make the most of what I have. And I enjoy it, when I can.",
        choices: [
          { label: "You're amazing.", next: 'maeva_admire', effects: { relationship: 8 } },
          { label: "Let's enjoy now.", next: 'maeva_accept', effects: { corruption: 5 } }
        ]
      },
      maeva_hope: {
        text: "Return! Maybe. The moons shine everywhere, even here. And I have you — customers who see me as more. That helps. It helps a lot.",
        choices: [
          { label: "I see you.", next: 'maeva_admire', effects: { relationship: 5 } }
        ]
      },
      maeva_admire: {
        text: "See me! You are kind. For that, I give you a discount — 40 gold instead of 50. A gift from one who understands.",
        choices: [
          { label: "Thank you.", next: 'maeva_accept', effects: { relationship: 5, corruption: 3 } }
        ]
      }
    }
  },
  npc_es_windhelm_slave: {
    id: 'npnc_es_windhelm_slave',
    name: 'Verala',
    race: 'Dunmer',
    gender: 'female',
    description: 'A Dunmer woman with dark skin marked by the brand of bondage on her cheek. Her eyes are hollow but still hold a spark of defiance. She works in the Gray Quarter, serving in the argonian assembly house.',
    personality: 'Defiant, broken but not defeated, guarded, hopes for freedom.',
    age: 28,
    location: 'windhelm_gray_quarter',
    relationship: 0,
    is_romanceable: false,
    tags: ['slave','dunmer','adult'],
    schedule: [
      { time: 'morning', location: 'windhelm_gray_quarter', action: 'Working in the Argonian Assembly''},
      { time: 'afternoon', location: 'windhelm_gray_quarter', action: 'Serving customers''},
      { time: 'night', location: 'windhelm_slave_quarters', action: 'Resting''}
    ],
    dialogue_tree: {
      greeting: {
        text: "You look at me. You see the brand? I am a slave — owned by the Argonian Assembly. You want something?",
        choices: [
          { label: "I want to buy something.", next: 'verala_buy', effects: {} },
          { label: "You're a slave?", next: 'verala_explain', effects: { relationship: 2 } },
          { label: "I'm sorry.", next: 'verala_sorry', effects: {} },
          { label: "Leave her alone.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_buy: {
        text: "Buy! The Argonian Assembly owns me. You want me, you pay them. 100 gold for an hour, 200 for the night. They take most, I get nothing. But that's how it is.",
        choices: [
          { label: "That's awful.", next: 'verala_awful', effects: { relationship: 3 } },
          { label: "100 gold, one hour.", next: 'verala_accept', effects: { corruption: 5 } },
          { label: "That's too much.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_explain: {
        text: "Yes. I was born in House Indoril in Morrowind. When the Red Year came, I fled to Skyrim. But here — they captured me, sold me. The brand marks me as property. I cannot leave.",
        choices: [
          { label: "Is there no way out?", next: 'verala_escape', effects: { relationship: 5 } },
          { label: "That's terrible.", next: 'verala_sorry', effects: { relationship: 2 } }
        ]
      },
      verala_sorry: {
        text: "Sorry! Everyone says sorry. No one does anything. The Nords watch us suffer and call us 'dark elves''like it's an insult. I just want to be free.",
        choices: [
          { label: "I want to help.", next: 'verala_help', effects: { relationship: 5 } },
          { label: "I can't change this.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_bye: {
        text: "Go then. I have work to do.",
        choices: []
      },
      verala_awful: {
        text: "Awful! Yes. The Argonians own Dunmer now — karma, they say. I serve them, they make coin. But I am still alive, still hope.",
        choices: [
          { label: "I'll pay for your time.", next: 'verala_accept', effects: { corruption: 5, relationship: 3 } },
          { label: "Is there any joy?", next: 'verala_joy', effects: { relationship: 3 } }
        ]
      },
      verala_accept: {
        text: "You will pay? For me? They take most, but... I get to lie with someone who sees me as human. That's worth something. Come, behind the building.",
        choices: []
      },
      verala_escape: {
        text: "Escape! I have tried — once. They caught me, beat me. The brand tracks me. But maybe... if someone with power helped. Maybe.",
        choices: [
          { label: "I'll try to help.", next: 'verala_help', effects: { relationship: 10 } },
          { label: "That's dangerous.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_help: {
        text: "Help! You would help a slave? Many say it, but... if you mean it, I have heard there is a smuggler who can remove brands. It costs 500 gold. I have nothing, but maybe you...",
        choices: [
          { label: "I'll find the money.", next: 'verala_freedom', effects: { relationship: 20 } },
          { label: "That's too much.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_joy: {
        text: "Joy! Sometimes. When I dance — they make me dance for customers. I was trained in the old ways, graceful. In those moments, I am not a slave. I am Verala.",
        choices: [
          { label: "Dance for me.", next: 'verala_dance', effects: { relationship: 5 } },
          { label: "You have spirit.", next: 'verala_spirit', effects: { relationship: 5 } }
        ]
      },
      verala_dance: {
        text: "Dance! Yes. Music plays, I move. Watch — this is what they paid for. My body, my grace. But in the dance, I am free.",
        choices: [
          { label: "Beautiful.", next: 'verala_dance_response', effects: { relationship: 5 } }
        ]
      },
      verala_dance_response: {
        text: "Beautiful! You see beauty, not just body. That is rare. Maybe... maybe you are different. Maybe you could help me.",
        choices: [
          { label: "Tell me what you need.", next: 'verala_help', effects: { relationship: 10 } }
        ]
      },
      verala_spirit: {
        text: "Spirit! They try to break it, but it remains. The Dunmer are ancient — we survived the eruption, the Argonian invasion. We will survive this too. Maybe.",
        choices: [
          { label: "I admire your strength.", next: 'verala_accept', effects: { relationship: 5 } }
        ]
      },
      verala_freedom: {
        text: "Find the money! You would do this? I... I don't know what to say. I will wait. I will hope. If you do this, I will be yours — not as slave, as... whatever you want.",
        choices: [
          { label: "Just be free.", next: 'verala_farewell', effects: { relationship: 25 } }
        ]
      },
      verala_farewell: {
        text: "Free! I will never forget this. Go to the smuggler in the docks — ask for gary. Tell him Verala sent you. And thank you — whatever happens, thank you.",
        choices: []
      }
    },
    adult_dialogue: {
      greeting: {
        text: "You came back. To buy me again, or to help me? I... I don't know which I want more.",
        choices: [
          { label: "I want to help you escape.", next: 'verala_adult_escape', effects: { relationship: 10 } },
          { label: "I want to be with you.", next: 'verala_adult_romance', effects: { relationship: 8 } },
          { label: "Just business.", next: 'verala_adult_business', effects: { corruption: 5 } },
          { label: "I'll come back later.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_adult_escape: {
        text: "Escape! You would free me? I've dreamed of it, but... it's so much gold. Are you serious? I will do anything — anything — if you free me.",
        choices: [
          { label: "I'll find the money.", next: 'verala_adult_freedom', effects: { relationship: 25 } },
          { label: "I need time.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_adult_romance: {
        text: "Be with me! You see me as a person, not just a body. That's... that's more than any customer has done. I could love you, if you freed me. If you gave me a choice.",
        choices: [
          { label: "I'll give you a choice.", next: 'verala_adult_freedom', effects: { romance: 20 } },
          { label: "Let's just be together now.", next: 'verala_adult_now', effects: { relationship: 10 } }
        ]
      },
      verala_adult_business: {
        text: "Business! Yes. The Argonians take 150 of your 200. But I get 50 — I save it, hidden. One day it will be enough to buy my freedom. Or not. But I try.",
        choices: [
          { label: "Here's 200.", next: 'verala_accept', effects: { corruption: 5 } },
          { label: "That's not enough for me.", next: 'verala_bye', effects: {} }
        ]
      },
      verala_adult_freedom: {
        text: "Free! I will be free! I don't know how to thank you — I have nothing. But my body, my time, my heart — all yours. Whatever you want. Whatever you need.",
        choices: [
          { label: "I want you to be free.", next: 'verala_farewell', effects: { relationship: 30, romance: 20 } },
          { label: "Stay with me.", next: 'verala_stay', effects: { romance: 15 } }
        ]
      },
      verala_adult_now: {
        text: "Now! Yes. Behind the building. I will give you everything — my body, my passion. In the moment, I am not a slave. I am a woman who chooses.",
        choices: [
          { label: "I choose you.", next: 'verala_accept', effects: { corruption: 5, relationship: 5 } }
        ]
      },
      verala_stay: {
        text: "Stay! You want me to stay with you? Not as slave, but... companion? I would like that. More than anything. Let's leave Windhelm, go somewhere I can be free.",
        choices: [
          { label: "Let's go.", next: 'verala_farewell', effects: { romance: 20 } }
        ]
      }
    }
  },
  npc_es_argonian_priestess: {
    id: 'npc_es_argonian_priestess',
    name: 'Sister Kixaxi',
    race: 'Argonian',
    gender: 'female',
    description: 'An elderly Argonian with elaborate tribal tattoos and ceremonial piercings. She wears robes covered in fertility symbols and carries a staff topped with a glowing egg.',
    personality: 'Wise, spiritual, sensual in a sacred way, ancient knowledge.',
    age: 65,
    location: 'marsh_cave',
    relationship: 0,
    is_romanceable: false,
    tags: ['priestess','argonian','fertility','adult'],
    schedule: [
      { time: 'dawn', location: 'marsh_cave', action: 'Morning rituals''},
      { time: 'noon', location: 'marsh_cave', action: 'Conducting fertility rites''},
      { time: 'dusk', location: 'marsh_cave', action: 'Teaching initiates''}
    ],
    dialogue_tree: {
      greeting: {
        text: "Greetings, traveler. You have entered the sacred pools of the Hist. I am Kixaxi, keeper of the fertility rites. Do you seek blessing, knowledge, or something else?",
        choices: [
          { label: "I seek blessing.", next: 'kixaxi_blessing', effects: { relationship: 3 } },
          { label: "What are fertility rites?", next: 'kixaxi_explain', effects: { relationship: 2 } },
          { label: "I need information.", next: 'kixaxi_info', effects: {} },
          { label: "I'll leave you be.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_blessing: {
        text: "Blessing! The Hist provides. But blessings require... offerings. To receive fertility, you must give. The rites are intimate, sacred. Would you participate?",
        choices: [
          { label: "Yes.", next: 'kixaxi_rites', effects: { corruption: 5 } },
          { label: "What do I give?", next: 'kixaxi_offering', effects: {} },
          { label: "Maybe later.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_explain: {
        text: "Fertility rites! In our tongue, they are 'sekol enima''— sacred joining. The Argonian body is made for reproduction, for the continuation of the swamp people. Through intimate acts, we honor the Hist and receive its blessing.",
        choices: [
          { label: "Tell me more.", next: 'kixaxi_details', effects: { relationship: 3 } },
          { label: "That sounds like sex.", next: 'kixaxi_sex', effects: { corruption: 2 } }
        ]
      },
      kixaxi_info: {
        text: "Information! I know many things — where the Hist roots flow, which pools heal, which creatures serve. But knowledge has price. What do you offer?",
        choices: [
          { label: "I have gold.", next: 'kixaxi_gold', effects: {} },
          { label: "I can help the swamp.", next: 'kixaxi_help', effects: { relationship: 5 } }
        ]
      },
      kixaxi_bye: {
        text: "Safe travels, outsider. The marsh keeps its secrets.",
        choices: []
      },
      kixaxi_offering: {
        text: "Offering! The body is the offering. Through union, we share life force. With me, with each other, with the Hist itself. Some find it strange, but it is our way.",
        choices: [
          { label: "I'll participate.", next: 'kixaxi_accept', effects: { corruption: 8 } },
          { label: "That's too much.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_rites: {
        text: "The rites! Yes. Follow me to the sacred pool. You will remove your clothes, enter the warm water. I will guide you through the ancient movements, and the Hist will bless you.",
        choices: [
          { label: "Let's begin.", next: 'kixaxi_accept', effects: { corruption: 10 } },
          { label: "I'm not sure.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_details: {
        text: "The rites combine prayer and pleasure. We use oil from the swamp lilies, sacred chants, intimate touch. The act of creation — in all its forms — connects us to the Hist's infinite power.",
        choices: [
          { label: "I want to try.", next: 'kixaxi_accept', effects: { corruption: 5 } },
          { label: "Interesting.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_sex: {
        text: "Sex! Yes, that is part of it. But it is more — it is communion. The feeling, the energy, the life flowing between bodies. In Skyrim, you call it sin. For us, it is worship.",
        choices: [
          { label: "I understand now.", next: 'kixaxi_accept', effects: { corruption: 3 } },
          { label: "We see it differently.", next: 'kixaxi_different', effects: { willpower: 2 } }
        ]
      },
      kixaxi_accept: {
        text: "Follow me, initiate. The waters are warm, the night is dark. Let the Hist guide us.",
        choices: []
      },
      kixaxi_gold: {
        text: "Gold! The outsiders always offer gold. Very well — 50 gold, I will tell you what you need to know. But the deeper secrets require... deeper offerings.",
        choices: [
          { label: "Here's 50.", next: 'kixaxi_tell', effects: {} },
          { label: "What deeper offerings?", next: 'kixaxi_deeper', effects: { corruption: 5 } }
        ]
      },
      kixaxi_help: {
        text: "Help the swamp! Yes, we need that. Clear theFetcher rot, kill the poachers, bring us moon sugar. Do this, and I will share everything I know.",
        choices: [
          { label: "I'll help.", next: 'kixaxi_task', effects: { relationship: 10 } },
          { label: "That's too much work.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_tell: {
        text: "The Hist speaks of a treasure beneath the Roots — golden eggs worth a fortune. But beware — the guardian is ancient and hungry.",
        choices: []
      },
      kixaxi_deeper: {
        text: "Deeper offerings! The body, the soul, the future children. Some outsiders join our rites completely — become one with the swamp. It changes them, in beautiful ways.",
        choices: [
          { label: "I want that.", next: 'kixaxi_accept', effects: { corruption: 10 } },
          { label: "Maybe not.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_task: {
        text: "Go, helper. Clean theFetcher rot first — it festers near the northern pools. Return when done, and I will speak of deeper things.",
        choices: []
      },
      kixaxi_different: {
        text: "Different! Yes. You see shame where we see sacred. That is your way, not ours. But the Hist accepts all — even those who do not understand.",
        choices: [
          { label: "Perhaps I could learn.", next: 'kixaxi_accept', effects: { corruption: 3 } },
          { label: "I'll respect from afar.", next: 'kixaxi_bye', effects: {} }
        ]
      }
    },
    adult_dialogue: {
      greeting: {
        text: "The swamp recognizes you, traveler. You returned for the true rites — the ones that bring pleasure and power. Are you ready to become one with the Hist?",
        choices: [
          { label: "I'm ready.", next: 'kixaxi_adult_ready', effects: { corruption: 5 } },
          { label: "I want more power.", next: 'kixaxi_adult_power', effects: { corruption: 10 } },
          { label: "I want to learn.", next: 'kixaxi_adult_learn', effects: { relationship: 5 } },
          { label: "Not yet.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_adult_ready: {
        text: "Ready! Good. The initiation requires three things — oral, vaginal, and the joining of your life force with mine. I will take you to the highest point of pleasure, then beyond.",
        choices: [
          { label: "Do it.", next: 'kixaxi_adult_accept', effects: { corruption: 15 } },
          { label: "That's intense.", next: 'kixaxi_intense', effects: {} }
        ]
      },
      kixaxi_adult_power: {
        text: "Power! Yes, the rites grant power. Each act adds to your connection to the Hist — more stamina, more vitality, even the ability to breed strong children. The more you give, the more you receive.",
        choices: [
          { label: "I'll give everything.", next: 'kixaxi_adult_accept', effects: { corruption: 20 } },
          { label: "What's the limit?", next: 'kixaxi_limit', effects: {} }
        ]
      },
      kixaxi_adult_learn: {
        text: "Learn! Yes, knowledge before pleasure. I will teach you the sacred movements, the chanting, the ways to please. Then — when you are ready — we perform the rites together.",
        choices: [
          { label: "Teach me.", next: 'kixaxi_teach', effects: { skills: { magic: 5 }, corruption: 3 } },
          { label: "I learn faster by doing.", next: 'kixaxi_adult_accept', effects: { corruption: 8 } }
        ]
      },
      kixaxi_adult_accept: {
        text: "Follow me to the sacred pool. Remove your clothes — the Hist must feel your skin. I will prepare the oils, begin the chants. The night will be long, but you will not regret it.",
        choices: []
      },
      kixaxi_intense: {
        text: "Intense! Yes. But the Hist does not offer small gifts. You will feel things beyond your human understanding — ecstasy that merges with the divine. Are you ready?",
        choices: [
          { label: "Yes.", next: 'kixaxi_adult_accept', effects: { corruption: 15 } },
          { label: "I need time.", next: 'kixaxi_bye', effects: {} }
        ]
      },
      kixaxi_limit: {
        text: "Limit! There is no limit — until you are empty. Many have given everything to the Hist and become one with the swamp forever. Others pull back, satisfied with what they took. Your choice.",
        choices: [
          { label: "I want everything.", next: 'kixaxi_adult_accept', effects: { corruption: 25 } },
          { label: "I'll be careful.", next: 'kixaxi_adult_accept', effects: { corruption: 10 } }
        ]
      },
      kixaxi_teach: {
        text: "First — touch yourself. Show me how you bring yourself to release. Then I will correct you, guide you to do it better. The Argonian way is different from human way.",
        choices: [
          { label: "As you say.", next: 'kixaxi_teach_do', effects: { corruption: 10 } },
          { label: "That's too personal.", next: 'kixaxi_bye', effects: { willpower: 5 } }
        ]
      },
      kixaxi_teach_do: {
        text: "Good. Now — slower. Feel the energy, don't rush. The Hist teaches patience, always. When you are ready, I will guide you further. The pleasures will come.",
        choices: [
          { label: "I feel it.", next: 'kixaxi_adult_accept', effects: { corruption: 15, skills: { magic: 10 } } }
        ]
      }
    }
  }
};