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
    tags: ['merchant', 'gossip', 'info'],
    schedule: [
      { time: 'dawn', location: 'the_bee_and_barb', action: 'Opening the tavern, lighting fires' },
      { time: 'morning', location: 'the_bee_and_barb', action: 'Serving breakfast, checking inventory' },
      { time: 'noon', location: 'the_bee_and_barb', action: 'Gossiping with regulars, overhearing news' },
      { time: 'afternoon', location: 'the_bee_and_barb', action: 'Managing staff, negotiating with suppliers' },
      { time: 'dusk', location: 'the_bee_and_barb', action: 'Welcoming evening crowd, reading patrons' },
      { time: 'night', location: 'the_bee_and_barb', action: 'Collecting rumors, closing up' }
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
        text: "Maven controls Riften — make no mistake. She owns the mead, the honey, the guards' pay. Cross her and you'll find yourself in the canal with stones in your pockets. But she's fair if you're useful to her.",
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
    tags: ['smith', 'trainer', 'work'],
    schedule: [
      { time: 'dawn', location: 'the_scorched_hammer', action: 'Stoking the forge, preparing materials' },
      { time: 'morning', location: 'the_scorched_hammer', action: 'Forging weapons, supervising apprentices' },
      { time: 'noon', location: 'the_scorched_hammer', action: 'Selling weapons, haggling with customers' },
      { time: 'afternoon', location: 'the_scorched_hammer', action: 'Teaching smithing, repairing armor' },
      { time: 'dusk', location: 'the_scorched_hammer', action: 'Finishing last orders, cleaning workshop' },
      { time: 'night', location: 'the_scorched_hammer', action: 'Resting, sharpening tools' }
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
    tags: ['merchant', 'trader', 'rare_goods'],
    schedule: [
      { time: 'dawn', location: 'khajiit_caravan', action: 'Setting up camp, displaying wares' },
      { time: 'morning', location: 'khajiit_caravan', action: 'Bargaining with customers, trading goods' },
      { time: 'noon', location: 'khajiit_caravan', action: 'Resting, eating, tending to caravans' },
      { time: 'afternoon', location: 'khajiit_caravan', action: 'Negotiating deals, acquiring new stock' },
      { time: 'dusk', location: 'khajiit_caravan', action: 'Preparing food, sharing stories' },
      { time: 'night', location: 'khajiit_caravan', action: 'Guarding the caravan, sleeping lightly' }
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
    tags: ['mage', 'scholar', 'court_wizard'],
    schedule: [
      { time: 'dawn', location: 'mistveil_keep', action: 'Studying ancient tomes, practicing spells' },
      { time: 'morning', location: 'mistveil_keep', action: 'Consulting with the Jarl, advising on magical matters' },
      { time: 'noon', location: 'mistveil_keep', action: 'Experimenting with potions, transmutations' },
      { time: 'afternoon', location: 'mistveil_keep', action: 'Teaching apprentice, researching' },
      { time: 'dusk', location: 'mistveil_keep', action: 'Reviewing notes, recording discoveries' },
      { time: 'night', location: 'mistveil_keep', action: 'Private rituals, forbidden research' }
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
    tags: ['adventurer', 'warrior', 'hero'],
    schedule: [
      { time: 'dawn', location: 'riften_streets', action: 'Morning patrol, looking for trouble' },
      { time: 'morning', location: 'the_bee_and_barb', action: 'Eating, gathering information' },
      { time: 'noon', location: 'riften_streets', action: 'Fighting bandits, helping citizens' },
      { time: 'afternoon', location: 'riften_market', action: 'Buying supplies, selling loot' },
      { time: 'dusk', location: 'riften_outskirts', action: 'Searching for evil, tracking threats' },
      { time: 'night', location: 'the_bee_and_barb', action: 'Drinking, telling stories' }
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
    }
  }
};