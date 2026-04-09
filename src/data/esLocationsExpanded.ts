export const ES_LOCATIONS_EXPANDED: Record<string, any> = {
  // RIFTEN AREA (existing)
  the_bee_and_barb: {
    id: 'the_bee_and_barb',
    name: 'The Bee and Barb',
    type: 'tavern',
    region: 'the_rift',
    description: "Riften's premier tavern, named for the famous Black-Briar honey. Warm fires burn in hearths, the smell of roasting meat fills the air, and patrons of all walks gather to drink, gossip, and forget their troubles.",
    atmosphere: 'Warm, noisy, slightly smoky, welcoming despite the shadows in the corners',
    actions: [
      { id: 'order_drink', label: 'Order a drink', intent: 'neutral', outcome: 'Brynda slides a tankard across the bar. "Fresh from the cellars. Drink up."', stat_deltas: { stress: -5, gold: -5 }, hours_passed: 1 },
      { id: 'order_meal', label: 'Order food', intent: 'neutral', outcome: 'A hearty stew and bread appear before you. "Made it myself," Brynda says with pride.', stat_deltas: { health: 10, gold: -10 }, hours_passed: 1 },
      { id: 'ask_gossip', label: 'Ask about rumors', intent: 'social', outcome: 'Brynda leans in. "Word is, Maven\'s boy was seen at the Ragged Flagon again. And the Thieves Guild is getting bold..."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'listen', label: 'Listen to conversations', intent: 'social', outcome: 'You overhear two Nords discussing a vampire sighting in the hills. A Khajiit whispers about a job...', stat_deltas: { corruption: 1 }, hours_passed: 2 },
      { id: 'sleep', label: 'Rent a room', intent: 'neutral', outcome: 'The room is small but clean. The bed is soft after days on the road.', stat_deltas: { health: 20, exhaustion: -30, gold: -15 }, hours_passed: 8 },
      { id: 'brawl', label: 'Start a fight', intent: 'combat', outcome: 'Your fist connects with a drunk merchant\'s face. The tavern erupts into chaos.', stat_deltas: { health: -10, relationship: -5, corruption: 5 }, hours_passed: 1 },
      { id: 'approach_npc', label: 'Approach a patron', intent: 'social', outcome: 'You spot a figure in the corner — an adventurer? A thief? They notice your gaze.', stat_deltas: {}, hours_passed: 1 },
      { id: 'drink_special', label: 'Try Talen-Jei\'s special', intent: 'flirt', outcome: 'The Khajiit blend burns going down, then brings warmth to your chest. The world seems brighter...', stat_deltas: { corruption: 5, stress: -10, gold: -8 }, hours_passed: 1 }
    ]
  },

  // WHITERUN
  dragonsreach: {
    id: 'dragonsreach',
    name: 'Dragonsreach',
    type: 'noble',
    region: 'whiterun_hold',
    description: "The great mead hall of Whiterun's Jarl dominates the city from atop the hill. Massive wooden beams support a roof that has weathered centuries of snow and storm. The throne of the Kings of Skyrim stands empty, waiting for the true High King.",
    atmosphere: 'Grand, cold, prestigious, historical',
    actions: [
      { id: 'audience', label: 'Request audience with Jarl', intent: 'work', outcome: 'The steward announces you to the Jarl. He sits upon his throne, surrounded by advisors and guards.', stat_deltas: { relationship: 2 }, hours_passed: 2 },
      { id: 'visit_paradox', label: 'Visit the Paragon Registry', intent: 'work', outcome: 'The ancient weapon hangs in the great hall. Scholars argue about its origins still.', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'meet_guild', label: 'Approach the Companions', intent: 'work', outcome: 'The shield brothers look you over. "You want to join? Show us your steel."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'explore_hall', label: 'Explore the great hall', intent: 'social', outcome: 'Banners of ancient kings hang from the walls. The fire crackles ceaselessly.', stat_deltas: { skills: { history: 1 } }, hours_passed: 2 },
      { id: 'guard_duty', label: 'Offer guard services', intent: 'work', outcome: '"The Jarl could use more able-bodied guards. Day and night, the watch continues."', stat_deltas: { gold: 25, relationship: 2 }, hours_passed: 4 },
      { id: 'diplomacy', label: 'Practice diplomacy', intent: 'social', outcome: 'You speak with the Jarl\'s advisors about the civil war. They weigh your words carefully.', stat_deltas: { skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'request_quest', label: 'Ask for a quest', intent: 'work', outcome: '"We have many concerns — dragons, bandits, the war. Perhaps you could help."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'listen_council', label: 'Listen to the council', intent: 'social', outcome: 'The advisors debate strategy. Stormcloaks and Imperials both press their causes.', stat_deltas: { corruption: 2 }, hours_passed: 2 }
    ]
  },
  the_bannered_mare: {
    id: 'the_bannered_mare',
    name: 'The Bannered Mare',
    type: 'tavern',
    region: 'whiterun_hold',
    description: "Whiterun's oldest inn is warm and welcoming, with a roaring fire and the smell of stew filling the air. Nords gather here to share stories of dragon encounters and distant battles. The innkeeper, Ysolda, is known for her business acumen and adventurous spirit.",
    atmosphere: 'Warm, rustic, friendly, storytelling',
    actions: [
      { id: 'order_mead', label: 'Order mead', intent: 'neutral', outcome: 'Ysolda slides a horn across the bar. "Best mead in Skyrim. Or at least in Whiterun."', stat_deltas: { stress: -5, gold: -5 }, hours_passed: 1 },
      { id: 'trade_tips', label: 'Trade with Ysolda', intent: 'work', outcome: '"I\'ve got goods from all over Skyrim. What are you looking for?"', stat_deltas: { gold: -30 }, hours_passed: 1 },
      { id: 'hear_stories', label: 'Hear stories', intent: 'social', outcome: 'An old warrior tells of the last dragon attack. "It came from the mountains, breathing fire..."', stat_deltas: { corruption: 1 }, hours_passed: 2 },
      { id: 'sleep_inn', label: 'Rent a room', intent: 'neutral', outcome: 'The room is modest but clean. The feather bed is a luxury after camping.', stat_deltas: { health: 15, exhaustion: -25, gold: -10 }, hours_passed: 8 },
      { id: 'ask_dragon', label: 'Ask about dragons', intent: 'social', outcome: '"Dragons have been returning. Ancient ones. Alduin wasn\'t the only one."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'brawl', label: 'Start a brawl', intent: 'combat', outcome: 'Your challenge is accepted. Fists fly as the tavern erupts in chaos.', stat_deltas: { health: -10, skills: { combat: 3 } }, hours_passed: 1 },
      { id: 'join_festival', label: 'Join a celebration', intent: 'social', outcome: 'The tavern fills with song and drink. A festival is in full swing!', stat_deltas: { stress: -15, relationship: 5 }, hours_passed: 3 },
      { id: 'waitress', label: 'Work as waitress', intent: 'work', outcome: 'You help serve tables. The tips are modest but the work is steady.', stat_deltas: { gold: 15, skills: { speech: 2 } }, hours_passed: 4 }
    ]
  },
  jorrvaskr: {
    id: 'jorrvaskr',
    name: 'Jorrvaskr',
    type: 'guild',
    region: 'whiterun_hold',
    description: "The ancient longship of the legendary Ysgramor serves as the headquarters for The Companions, Whiterun's prestigious group of warriors. The mead hall is filled with shields and weapons, and the walls echo with the songs of heroes.",
    atmosphere: 'Honorable, martial, heroic, traditional',
    actions: [
      { id: 'join_companions', label: 'Request membership', intent: 'work', outcome: '"You wish to join the Circle? Prove yourself in battle first."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'fight_training', label: 'Fight in the training ring', intent: 'combat', outcome: 'You spar with the shields. Bruises form, but your skill grows.', stat_deltas: { skills: { combat: 5, blocking: 3 }, health: -10 }, hours_passed: 2 },
      { id: 'talk_kodlak', label: 'Talk to Kodlak', intent: 'social', outcome: 'The old Harbinger listens to your questions. "Many secrets we keep... and some we wish we didn\'t."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'ask_lydia', label: 'Ask about Shield-Sisters', intent: 'social', outcome: '"The Shield-Sisters are the heart of Jorrvaskr. We fight as one."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'share_tales', label: 'Share battle tales', intent: 'social', outcome: 'You recount your adventures. The warriors listen with growing respect.', stat_deltas: { relationship: 5, skills: { speech: 2 } }, hours_passed: 2 },
      { id: ' retrieve_potion', label: 'Retrieve a potion', intent: 'work', outcome: 'Farkas gives you a list of ingredients. "The Alchemist in the market has what we need."', stat_deltas: { relationship: 3 }, hours_passed: 2 },
      { id: 'mysterious_rite', label: 'Investigate secret rites', intent: 'stealth', outcome: 'Late at night, you notice figures moving in the undercroft...', stat_deltas: { corruption: 3 }, hours_passed: 2 },
      { id: 'honor_duel', label: 'Challenge to an honor duel', intent: 'combat', outcome: '"You dare challenge me? Very well. Let\'s see your steel."', stat_deltas: { skills: { combat: 8 }, health: -15 }, hours_passed: 2 }
    ]
  },
  warmaidens: {
    id: 'warmaidens',
    name: 'Warmaidens',
    type: 'shop',
    region: 'whiterun_hold',
    description: "The armor shop run by the formidable北欧女 warrior showcases her own craftsmanship. Weapons and armor line the walls, many still bearing the blood of their previous owners. The shopkeeper has a scar on her eye and a sword at her hip.",
    atmosphere: 'Martial, practical, lethal, no-nonsense',
    actions: [
      { id: 'buy_weapons', label: 'Browse weapons', intent: 'work', outcome: '"Good steel costs good gold. Take your time deciding."', stat_deltas: { gold: -75 }, hours_passed: 1 },
      { id: 'buy_armor', label: 'Browse armor', intent: 'work', outcome: '"This armor has saved lives. Will it save yours?"', stat_deltas: { gold: -100 }, hours_passed: 1 },
      { id: 'train_combat', label: 'Train in combat', intent: 'work', outcome: '"You fight like a dairy farmer. Again!" The lesson is brutal but effective.', stat_deltas: { skills: { combat: 5, one_handed: 3 }, gold: -25 }, hours_passed: 2 },
      { id: 'talk_frigga', label: 'Talk to Friga', intent: 'social', outcome: '"You want to learn? Good. A warrior must be ready for anything."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'ask_battles', label: 'Ask about past battles', intent: 'social', outcome: '"I\'ve fought in the great war. The memories never fade."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'custom_order', label: 'Request custom gear', intent: 'work', outcome: '"Custom work takes time and rare materials. Bring me ebony and I\'ll make you a masterwork."', stat_deltas: { gold: -200 }, hours_passed: 1 },
      { id: 'prove_strength', label: 'Prove your strength', intent: 'combat', outcome: 'You lift the heavy training boulder. Friga nods approvingly.', stat_deltas: { strength: 3 }, hours_passed: 1 },
      { id: 'spar', label: 'Challenge to a sparring match', intent: 'combat', outcome: '"Finally! Someone who wants a real fight!" The bout is intense.', stat_deltas: { skills: { combat: 8 }, health: -20 }, hours_passed: 2 }
    ]
  },
  plains_district: {
    id: 'plains_district',
    name: 'Whiterun Plains District',
    type: 'market',
    region: 'whiterun_hold',
    description: "The lower district of Whiterun bustles with merchants and farmers. The smell of bread from the bakery mingles with the odor of livestock. Colorful banners flutter in the wind, and the Gildergreen tree provides a peaceful center.",
    atmosphere: 'Bustling, earthy, commercial, lively',
    actions: [
      { id: 'visit_temple', label: 'Visit the Temple of Kynareth', intent: 'social', outcome: 'The priestess greets you warmly. "Kynareth blesses all who walk in her name."', stat_deltas: { willpower: 3 }, hours_passed: 1 },
      { id: 'shop_market', label: 'Browse the market', intent: 'work', outcome: 'Merchants hawk their wares — vegetables, cloth, tools, and more.', stat_deltas: { gold: -50 }, hours_passed: 2 },
      { id: 'gildergreen', label: 'Pray at the Gildergreen', intent: 'willpower', outcome: 'The sacred tree\'s leaves shimmer. You feel a profound peace settle over you.', stat_deltas: { willpower: 5, exhaustion: -10 }, hours_passed: 1 },
      { id: 'belethor_shop', label: 'Visit Belethor\'s shop', intent: 'work', outcome: '"What are you selling? Everything has a price." The Bosmer greets you with a grin.', stat_deltas: { gold: 30 }, hours_passed: 1 },
      { id: 'guard_wall', label: 'Walk the walls', intent: 'work', outcome: 'From the wall, you see the whole city. Guards patrol ceaselessly.', stat_deltas: { skills: { archery: 2 } }, hours_passed: 2 },
      { id: 'farm_work', label: 'Offer farm work', intent: 'work', outcome: 'A farmer needs help with the harvest. The work is hard but honest.', stat_deltas: { health: -10, gold: 20, strength: 2 }, hours_passed: 4 },
      { id: 'pickpocket', label: 'Pick pocket in crowd', intent: 'stealth', outcome: 'Your fingers find a coin purse. The crowd provides good cover.', stat_deltas: { gold: 25, corruption: 5, skills: { stealth: 3 } }, hours_passed: 2 },
      { id: 'city_gossip', label: 'Listen to city gossip', intent: 'social', outcome: '"Did you hear? The Jarl\'s son was seen at the Companion\'s hall..."', stat_deltas: { relationship: 2 }, hours_passed: 1 }
    ]
  },
  belethors_shop: {
    id: 'belethors_shop',
    name: 'Belethor\'s General Goods',
    type: 'shop',
    region: 'whiterun_hold',
    description: "The grimy general goods shop smells of old cheese and worse. Belethor, a Bosmer with a perpetually scheming expression, deals in everything from dungeon loot to stolen goods. He always has something for sale, no questions asked.",
    atmosphere: 'Shady, cluttered, opportunistic, smell',
    actions: [
      { id: 'browse_goods', label: 'Browse goods', intent: 'work', outcome: '"Take a look. Everything must go... eventually."', stat_deltas: { gold: -40 }, hours_passed: 1 },
      { id: 'sell_items', label: 'Sell items', intent: 'work', outcome: 'Belethor examines your goods. "I\'ll give you half value. Take it or leave it."', stat_deltas: { gold: 50 }, hours_passed: 1 },
      { id: 'ask_supplies', label: 'Ask about special supplies', intent: 'social', outcome: '"Special? Maybe. What are you looking for? I hear things..."', stat_deltas: { corruption: 2 }, hours_passed: 1 },
      { id: 'trade_info', label: 'Trade information', intent: 'work', outcome: '"That\'s worth something. Let\'s say... thirty gold?"', stat_deltas: { gold: 30, relationship: 2 }, hours_passed: 1 },
      { id: 'mysterious_package', label: 'Ask about mysterious packages', intent: 'stealth', outcome: 'Belethor lowers his voice. "I have things. Things from places you don\'t want to know about."', stat_deltas: { corruption: 5 }, hours_passed: 1 },
      { id: 'negotiate', label: 'Negotiate price', intent: 'work', outcome: '"You drive a hard bargain. Fine — this once."', stat_deltas: { skills: { speech: 3 }, gold: -10 }, hours_passed: 1 },
      { id: 'dark_deal', label: 'Make a dark deal', intent: 'stealth', outcome: 'The transaction is shadowed. You receive goods that should not exist.', stat_deltas: { corruption: 10, gold: -100 }, hours_passed: 1 },
      { id: 'report_thief', label: 'Report a thief', intent: 'willpower', outcome: '"A thief? I don\'t know anything about that." But his eyes dart away.', stat_deltas: { willpower: 3, relationship: -2 }, hours_passed: 1 }
    ]
  },

  // MORROWIND REGION
  mournhold: {
    id: 'mournhold',
    name: 'Mournhold',
    type: 'city',
    region: 'morrowind',
    description: "The capital of the Tribunal Temple and seat of the King of Morrowind. The city blends ancient Dunmer architecture with grand merchant houses. The smell of Incense and the sound of prayer fill the air. Once destroyed by Daedra, now rebuilt but haunted by the past.",
    atmosphere: 'Sacred, ancient, politically complex, incense-filled',
    actions: [
      { id: 'visit_temple', label: 'Visit the Temple', intent: 'social', outcome: 'The priests of the Tribunal welcome pilgrims. "May the ancestors guide your path."', stat_deltas: { willpower: 5 }, hours_passed: 2 },
      { id: 'explore_palace', label: 'Explore the Royal Palace', intent: 'work', outcome: 'The throne room is grand but shadows linger from the old king\'s death.', stat_deltas: { relationship: 2 }, hours_passed: 2 },
      { id: 'trade_guild', label: 'Visit the Tradehouse', intent: 'work', outcome: 'Dunmer merchants offer exotic goods — Telvanni artifacts, kwama cuttle, scrib jelly.', stat_deltas: { gold: -100 }, hours_passed: 2 },
      { id: 'ask_dunmer', label: 'Talk to Dunmer locals', intent: 'social', outcome: '"You are from Skyrim? The empire grows weak. We remember our greatness."', stat_deltas: { corruption: 1 }, hours_passed: 1 },
      { id: 'visit_bazaar', label: 'Browse the Great Bazaar', intent: 'work', outcome: 'Stalls sell strange goods: curated mushrooms, ash salts, ancestor moths.', stat_deltas: { gold: -50 }, hours_passed: 2 },
      { id: 'slave_trade', label: 'Encounter the Slave Market', intent: 'stealth', outcome: 'Chained Dunmer wait for buyers. The institution is legal here... for now.', stat_deltas: { corruption: 5, willpower: -3 }, hours_passed: 2 },
      { id: 'house_indoril', label: 'Seek House Indoril', intent: 'work', outcome: '"House Indoril serves the Temple. We have... work for the faithful."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'ancient_ruins', label: 'Explore ancient ruins', intent: 'work', outcome: 'Below the city, Dwemer ruins hold secrets and dangers.', stat_deltas: { skills: { lockpicking: 3, alchemy: 2 }, corruption: 3 }, hours_passed: 4 }
    ]
  },
  vivec_city: {
    id: 'vivec_city',
    name: 'Vivec City',
    type: 'city',
    region: 'morrowind',
    description: "The sacred city of the Warrior-Poet god Vivec rises from the waters of the Inner Sea. Cantons climb toward the heavens, each dedicated to a different aspect of life. The foreign district hosts Khajiit and Argonians, while the temple district hums with divine power.",
    atmosphere: 'Divine, massive, surreal, multi-layered',
    actions: [
      { id: 'canal_swim', label: 'Swim the canals', intent: 'stealth', outcome: 'The waters are cold but you move unseen through the city\'s veins.', stat_deltas: { health: -5, skills: { athletics: 3 } }, hours_passed: 2 },
      { id: 'visit_ministry', label: 'Visit the Ministry of Truth', intent: 'social', outcome: 'The floating rock overhead casts an ever-present shadow. Scholars study its magic.', stat_deltas: { skills: { magic: 3 } }, hours_passed: 2 },
      { id: 'foreign_quarter', label: 'Visit the Foreign Quarter', intent: 'social', outcome: 'Khajiit caravans, Argonian dockworkers, and Imperials mix uneasily.', stat_deltas: { relationship: 2 }, hours_passed: 2 },
      { id: 'worship_vivec', label: 'Pray at the Temple', intent: 'willpower', outcome: '"Vivec teaches that all is water. You are part of the great flow."', stat_deltas: { willpower: 8 }, hours_passed: 2 },
      { id: 'arena_combat', label: 'Fight in the Arena', intent: 'combat', outcome: 'The crowd roars as you enter the pit. Victory means glory and coin.', stat_deltas: { skills: { combat: 10 }, health: -20, gold: 50 }, hours_passed: 3 },
      { id: 'bazaar_haggling', label: 'Haggle in the Bazaar', intent: 'work', outcome: 'The merchant\'s prices drop as your speech skills rise.', stat_deltas: { skills: { speech: 4 }, gold: -30 }, hours_passed: 2 },
      { id: 'cantons_climb', label: 'Climb the Cantons', intent: 'work', outcome: 'Stairs lead up to the high temples. The view is breathtaking.', stat_deltas: { health: -10, skills: { athletics: 3 } }, hours_passed: 3 },
      { id: 'water_deal', label: 'Make water-sphere deal', intent: 'stealth', outcome: 'A cult offers forbidden knowledge from the Ministry. The price is high.', stat_deltas: { corruption: 10, skills: { magic: 5 } }, hours_passed: 2 }
    ]
  },
  balmora: {
    id: 'balmora',
    name: 'Balmora',
    type: 'city',
    region: 'morrowind',
    description: "A friendly trading hub on the River Strid, Balmora welcomes outsiders with open arms. The sunlit streets host Nords, Dunmer, and Imperials in equal measure. Hlaalu councilors rule from the local manor, and the local tavern is a nexus of information.",
    atmosphere: 'Friendly, sunny, cosmopolitan, bustling',
    actions: [
      { id: 'visit_southwall', label: 'Visit Southwall', intent: 'work', outcome: 'The Remnant of the imperial guild offers training and quests.', stat_deltas: { relationship: 3 }, hours_passed: 2 },
      { id: 'hlaalu_manor', label: 'Visit Hlaalu Manor', intent: 'work', outcome: 'The merchant house welcomes traders. "Business is business."', stat_deltas: { relationship: 2, gold: -20 }, hours_passed: 1 },
      { id: 'moon_and_star', label: 'Drink at the Moon and Star', intent: 'social', outcome: 'The innkeeper Caius knows everyone. "Looking for work? I know a guy."', stat_deltas: { stress: -10, relationship: 2 }, hours_passed: 2 },
      { id: 'mysterious_stranger', label: 'Talk to mysterious strangers', intent: 'social', outcome: 'A cloaked figure approaches. "Are you the Nerevarine?"', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'craftsmen_guild', label: 'Visit the Craftsmen\'s Guild', intent: 'work', outcome: 'Guild members offer training in crafts and alchemy.', stat_deltas: { skills: { alchemy: 3, crafting: 2 }, gold: -20 }, hours_passed: 2 },
      { id: 'bug_tribal', label: 'Seek the Bug Mortar', intent: 'work', outcome: 'A tribe offers protection in exchange for kwama eggs.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'guild_trouble', label: 'Investigate guild trouble', intent: 'work', outcome: 'The Mage\'s Guild has been acting strangely...', stat_deltas: { corruption: 2 }, hours_passed: 2 },
      { id: 'mysticism', label: 'Study mysticism', intent: 'work', outcome: 'The secrets of the mystic arts are taught here.', stat_deltas: { skills: { magic: 4 } }, hours_passed: 3 }
    ]
  },
  sadrith_mora: {
    id: 'sadrith_mora',
    name: 'Sadrith Mora',
    type: 'city',
    region: 'morrowind',
    description: "A realm of wizards and gateway to the Telvanni lands. The city smells of ozone and strange chemicals. Portal doors lead to distant towers, and wizards of all schools are common on the streets. The local inn is guarded by a very large Kwama.",
    atmosphere: 'Arcane, magical, dangerous, eccentric',
    actions: [
      { id: 'wizards_tower', label: 'Visit a Wizard\'s Tower', intent: 'work', outcome: 'The tower rises impossibly high. The wizard invites you in... or not.', stat_deltas: { skills: { magic: 3 } }, hours_passed: 2 },
      { id: 'telvanni_quest', label: 'Seek Telvanni patronage', intent: 'work', outcome: '"You wish to serve a Telvanni? Bold. Very bold."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'gateway_inn', label: 'Stay at the Gateway Inn', intent: 'neutral', outcome: 'The inn is comfortable. Kwama for protection watches the door.', stat_deltas: { health: 15, exhaustion: -20, gold: -15 }, hours_passed: 8 },
      { id: ' portal_magic', label: 'Learn portal magic', intent: 'work', outcome: 'A wizard teaches you the basics of teleportation.', stat_deltas: { skills: { magic: 6 } }, hours_passed: 4 },
      { id: 'mysterious_shop', label: 'Visit the pawn shop', intent: 'work', outcome: 'The shop sells strange artifacts from across Tamriel.', stat_deltas: { gold: -80 }, hours_passed: 1 },
      { id: 'ash_yam', label: 'Hunt Ash Yams', intent: 'work', outcome: 'The edible fungi are harvested from the ashlands.', stat_deltas: { skills: { survival: 3 }, gold: 20 }, hours_passed: 3 },
      { id: 'warp_experiments', label: 'Volunteer for warp experiments', intent: 'work', outcome: 'A mad wizard needs test subjects. You may come back... different.', stat_deltas: { health: -20, skills: { magic: 10 }, corruption: 15 }, hours_passed: 4 },
      { id: 'telvanni_secrets', label: 'Discover Telvanni secrets', intent: 'stealth', outcome: 'You find forbidden texts. The knowledge is dangerous but powerful.', stat_deltas: { corruption: 8, skills: { magic: 5 } }, hours_passed: 2 }
    ]
  },

  // BLACK MARSH
  black_marsh_wetlands: {
    id: 'black_marsh_wetlands',
    name: 'The Black Marsh Wetlands',
    type: 'wilderness',
    region: 'black_marsh',
    description: "The southern swamp lands are vast, humid, and teeming with life. The air is thick with the smell of decay and growth intertwined. Strange plants glow in the darkness, and distant calls echo through the mist.",
    atmosphere: 'Humid, primordial, dangerous, alive',
    actions: [
      { id: 'forage_swamp', label: 'Forage in the swamp', intent: 'work', outcome: 'You find edible plants and mushrooms. Some glow with strange light.', stat_deltas: { skills: { survival: 4, alchemy: 3 }, gold: 20 }, hours_passed: 3 },
      { id: 'hunt_saxhleel', label: 'Hunt for food', intent: 'work', outcome: 'Swamp creatures provide meat and hides. The hunt is challenging.', stat_deltas: { health: -10, skills: { marksman: 3 }, gold: 30 }, hours_passed: 4 },
      { id: 'avoid_trap', label: 'Avoid swamp traps', intent: 'stealth', outcome: 'The Saxhleel set traps for intruders. You avoid them carefully.', stat_deltas: { skills: { stealth: 3 } }, hours_passed: 2 },
      { id: 'find_clearing', label: 'Find a clearings', intent: 'work', outcome: 'A rare dry patch provides rest from the constant wet.', stat_deltas: { health: 10, exhaustion: -15 }, hours_passed: 2 },
      { id: 'collect_algae', label: 'Collect swamp algae', intent: 'work', outcome: 'The glowing algae has alchemical properties.', stat_deltas: { skills: { alchemy: 4 }, gold: 25 }, hours_passed: 2 },
      { id: 'meet_argonian', label: 'Meet marsh people', intent: 'social', outcome: 'A friendly Argonian emerges. "Welcome to the marsh. Stranger."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'disease_risk', label: 'Risk disease', intent: 'work', outcome: 'The swamp breeds sickness. Your constitution is tested.', stat_deltas: { health: -15, willpower: 3 }, hours_passed: 1 },
      { id: 'spirit_cult', label: 'Find a spirit cult', intent: 'stealth', outcome: 'Shadows worship the Hist. Their rituals are strange...', stat_deltas: { corruption: 8 }, hours_passed: 2 }
    ]
  },
  black_marsh_town: {
    id: 'black_marsh_town',
    name: 'Marsh Town',
    type: 'village',
    region: 'black_marsh',
    description: "A settlement built on stilts above the swamp waters, home to Argonians and the few humans brave enough to live in the marsh. The buildings are woven from marsh reeds and supported by ancient pilings. The air smells of fish and smoke.",
    atmosphere: 'Primitive, communal, damp, resilient',
    actions: [
      { id: 'trade_fish', label: 'Trade for fish', intent: 'work', outcome: 'Fresh-caught marsh fish are plentiful and cheap.', stat_deltas: { gold: -15, health: 5 }, hours_passed: 1 },
      { id: 'talk_elder', label: 'Talk to the village elder', intent: 'social', outcome: '"The Hist speaks through dreams. Sometimes we listen."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'help_construction', label: 'Help build structures', intent: 'work', outcome: 'The community builds together. Your strength helps the village.', stat_deltas: { health: -10, relationship: 5, strength: 2 }, hours_passed: 4 },
      { id: 'hist_tree', label: 'Visit the Hist Tree', intent: 'willpower', outcome: 'The ancient tree pulses with life. You feel connected to something vast.', stat_deltas: { willpower: 10, skills: { magic: 2 } }, hours_passed: 2 },
      { id: 'learn_language', label: 'Learn some Jel', intent: 'work', outcome: 'The clicks and hisses of Argonian tongue are complex but learnable.', stat_deltas: { skills: { speech: 3 } }, hours_passed: 3 },
      { id: 'night_ambush', label: 'Survive a night ambush', intent: 'combat', outcome: 'Predators hunt in the dark. You fight them off.', stat_deltas: { health: -15, skills: { combat: 5 } }, hours_passed: 2 },
      { id: 'herbal_healer', label: 'Visit the healer', intent: 'work', outcome: 'The swamp healer knows plants that cure disease.', stat_deltas: { health: 20, gold: -25 }, hours_passed: 2 },
      { id: 'dark_ritual', label: 'Participate in ritual', intent: 'willpower', outcome: 'The villagers include you in a Hist ceremony. Power flows through you.', stat_deltas: { corruption: 5, skills: { magic: 5 } }, hours_passed: 3 }
    ]
  },
  black_margesh: {
    id: 'black_margesh',
    name: 'Black Margesh',
    type: 'city',
    region: 'black_marsh',
    description: "The largest Argonian settlement in Black Marsh, built in and around the ruins of an ancient Dwemer city. The architecture is a strange mix of stone and organic growth. Thousands of Saxhleel live here, along with Imperial traders and Khajiit caravans.",
    atmosphere: 'Ancient, sprawling, diverse, mysterious',
    actions: [
      { id: 'explore_dwemer', label: 'Explore Dwemer ruins', intent: 'work', outcome: 'The underground sections still function with steam and gear.', stat_deltas: { skills: { engineering: 4, lockpicking: 3 }, corruption: 3 }, hours_passed: 4 },
      { id: 'market_trade', label: 'Trade in the market', intent: 'work', outcome: 'Exotic goods from across Tamriel flow through here.', stat_deltas: { gold: -80 }, hours_passed: 2 },
      { id: 'hist_grove', label: 'Visit the Hist Grove', intent: 'willpower', outcome: 'The central grove connects all Argonians. You feel the collective.', stat_deltas: { willpower: 15 }, hours_passed: 2 },
      { id: 'shrine_to_lorkhan', label: 'Visit the Lorkhan Shrine', intent: 'social', outcome: 'The Tribunal may be gone, but some still worship the Scrambler.', stat_deltas: { corruption: 5 }, hours_passed: 1 },
      { id: 'slaver_holes', label: 'Investigate slaver holes', intent: 'stealth', outcome: 'Illegal trade continues despite prohibition. The city has dark corners.', stat_deltas: { corruption: 10, relationship: -5 }, hours_passed: 2 },
      { id: 'argumentonian_guild', label: 'Join the Root-Branches Guild', intent: 'work', outcome: 'The Argonian thieves guild operates openly here. "You want in?"', stat_deltas: { corruption: 8, skills: { stealth: 4 } }, hours_passed: 1 },
      { id: 'learn_poison', label: 'Learn poison craft', intent: 'work', outcome: 'Marsh toxins are highly potent. The alchemists teach their secrets.', stat_deltas: { skills: { alchemy: 6 }, corruption: 3 }, hours_passed: 3 },
      { id: 'escape_pursuit', label: 'Escape imperial pursuit', intent: 'stealth', outcome: 'The empire\'s agents hunt you through the twisting streets.', stat_deltas: { skills: { stealth: 8 }, health: -10 }, hours_passed: 2 }
    ]
  },
  argonian_camp: {
    id: 'argonian_camp',
    name: 'Argonian Nomad Camp',
    type: 'village',
    region: 'black_marsh',
    description: "A seasonal camp of marsh people following the migrations of the giant marsh lizards. The camp moves with the waters, and the people adapt. They are hospitable to strangers but fiercely protective of their ways.",
    atmosphere: 'Nomadic, adaptable, welcoming, wild',
    actions: [
      { id: 'join_hunt', label: 'Join the lizard hunt', intent: 'work', outcome: 'Giant marsh lizards provide food and materials. The hunt is dangerous.', stat_deltas: { health: -15, skills: { marksman: 5, survival: 3 }, gold: 40 }, hours_passed: 6 },
      { id: 'learn_tracking', label: 'Learn swamp tracking', intent: 'work', outcome: 'The Argonians teach their ancient tracking techniques.', stat_deltas: { skills: { survival: 5 } }, hours_passed: 3 },
      { id: 'camp_fire', label: 'Share camp fire stories', intent: 'social', outcome: 'The fire illuminates faces as tales of the old days are told.', stat_deltas: { relationship: 5, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'travel_guide', label: 'Hire a guide', intent: 'work', outcome: 'A local agrees to guide you through the deep marsh.', stat_deltas: { gold: -40, relationship: 5 }, hours_passed: 1 },
      { id: 'healing_waters', label: 'Bathe in healing waters', intent: 'work', outcome: 'The hot springs have restorative properties.', stat_deltas: { health: 25, exhaustion: -20 }, hours_passed: 2 },
      { id: 'hist_dream', label: 'Experience Hist dreams', intent: 'willpower', outcome: 'The collective dreams of the tribe flood your mind.', stat_deltas: { willpower: 8, skills: { magic: 3 }, corruption: 5 }, hours_passed: 2 },
      { id: 'leave_camp', label: 'Leave with blessing', intent: 'social', outcome: 'The tribe blesses your journey. "May the waters guide you."', stat_deltas: { relationship: 10 }, hours_passed: 1 },
      { id: 'tribal_challenge', label: 'Complete tribal challenge', intent: 'combat', outcome: 'To earn respect, you must face the trial of the swamp.', stat_deltas: { health: -20, relationship: 15, skills: { combat: 8 } }, hours_passed: 4 }
    ]
  },

  // ADDITIONAL MORROWIND
  gnisis: {
    id: 'gnisis',
    name: 'Gnisis',
    type: 'village',
    region: 'morrowind',
    description: "A small Dunmer village known for its egg mine and the ancient Madach temple. The locals are traditional and suspicious of outsiders, but the village is stable and self-sufficient.",
    atmosphere: 'Traditional, modest, insular, stable',
    actions: [
      { id: 'visit_madach', label: 'Visit the Madach Temple', intent: 'social', outcome: 'The temple honors the ancestor-god. The priests are solemn.', stat_deltas: { willpower: 3 }, hours_passed: 1 },
      { id: 'mine_work', label: 'Work in the egg mine', intent: 'work', outcome: 'The kwama eggs are harvested carefully. The work is dirty.', stat_deltas: { health: -10, gold: 25, strength: 2 }, hours_passed: 4 },
      { id: 'local_gossip', label: 'Ask local gossip', intent: 'social', outcome: '"The mine has been producing less lately. Something\'s wrong."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'ask_vivec', label: 'Ask about Vivec', intent: 'social', outcome: '"The Warrior-Poet walked among us once. His wisdom still guides us."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'buy_local', label: 'Buy local crafts', intent: 'work', outcome: 'Pottery and weaving are the village specialties.', stat_deltas: { gold: -20 }, hours_passed: 1 },
      { id: 'refugee_help', label: 'Help refugees', intent: 'willpower', outcome: 'Displaced Dunmer from Vvardenfell need assistance.', stat_deltas: { willpower: 10, gold: -15 }, hours_passed: 2 },
      { id: 'ancient_tablet', label: 'Seek ancient tablet', intent: 'work', outcome: 'A tablet of old laws might be in the temple archives.', stat_deltas: { skills: { history: 3 } }, hours_passed: 2 },
      { id: 'vvardenfell_story', label: 'Hear of Vvardenfell', intent: 'social', outcome: '"The mountain exploded. We lost everything. Now we rebuild."', stat_deltas: { relationship: 3 }, hours_passed: 1 }
    ]
  },
  khuul: {
    id: 'khuul',
    name: 'Khuul',
    type: 'village',
    region: 'morrowind',
    description: "A quiet fishing village on the coast of the Inner Sea. The simple life here revolves around the catch of the day. The villagers are friendly to traders but isolated from the larger politics of Morrowind.",
    atmosphere: 'Peaceful, simple, coastal, fishing',
    actions: [
      { id: 'fish_boat', label: 'Join a fishing boat', intent: 'work', outcome: 'The nets bring in silver fish and netches. Hard work.', stat_deltas: { health: -10, gold: 30, skills: { survival: 3 } }, hours_passed: 4 },
      { id: 'sell_catch', label: 'Sell the catch', intent: 'work', outcome: 'The fishmonger pays fair price for fresh catch.', stat_deltas: { gold: 35 }, hours_passed: 1 },
      { id: 'sea_stories', label: 'Hear sea stories', intent: 'social', outcome: 'Old sailors tell of seabirds predicting weather and sea serpents.', stat_deltas: { skills: { survival: 1 } }, hours_passed: 1 },
      { id: 'coast_walk', label: 'Walk the coastline', intent: 'work', outcome: 'The rocky coast holds caves and tide pools full of life.', stat_deltas: { skills: { alchemy: 2 }, gold: 15 }, hours_passed: 2 },
      { id: 'temple_prayer', label: 'Visit the small temple', intent: 'willpower', outcome: 'A humble shrine to St. Meris provides quiet reflection.', stat_deltas: { willpower: 4 }, hours_passed: 1 },
      { id: 'boat_repair', label: 'Help repair boats', intent: 'work', outcome: 'The boats need constant maintenance from salt and sea.', stat_deltas: { health: -5, skills: { crafting: 3 }, gold: 15 }, hours_passed: 3 },
      { id: 'merchant_caravan', label: 'Meet the merchant caravan', intent: 'work', outcome: 'Traders from the interior bring goods to trade.', stat_deltas: { gold: -40, relationship: 2 }, hours_passed: 2 },
      { id: 'storm_wait', label: 'Wait out a storm', intent: 'neutral', outcome: 'A great storm batters the village. You shelter safely.', stat_deltas: { health: 5 }, hours_passed: 8 }
    ]
  },

  // SOLITUDE & HAAFINGAR
  blue_palace: {
    id: 'blue_palace',
    name: 'The Blue Palace',
    type: 'noble',
    region: 'haafingar',
    description: "The seat of the High King of Skyrim, the Blue Palace in Solitude is the most grand structure in the province. Imperial banners hang from the walls, and the throne sits beneath a massive skylight. The Emperor's vizier maintains order here.",
    atmosphere: 'Imperial, grand, political, prestigious',
    actions: [
      { id: 'royal_audience', label: 'Request Royal Audience', intent: 'work', outcome: 'The Thalmor ambassador watches as you approach the throne.', stat_deltas: { relationship: 3 }, hours_passed: 2 },
      { id: 'thalmor_talk', label: 'Talk to Thalmor Ambassador', intent: 'social', outcome: '"The Empire weakens. The Aldmeri Dominion watches with interest."', stat_deltas: { corruption: 5 }, hours_passed: 1 },
      { id: 'castletrain', label: 'Train with the Royal Guard', intent: 'combat', outcome: 'The elite guards teach you their disciplined fighting style.', stat_deltas: { skills: { combat: 6, blocking: 4 }, gold: -30 }, hours_passed: 3 },
      { id: 'diplomatic_mission', label: 'Offer diplomatic services', intent: 'work', outcome: '"We have need of someone who can navigate... delicate situations."', stat_deltas: { relationship: 5, gold: 50 }, hours_passed: 2 },
      { id: 'library_research', label: 'Use the Royal Library', intent: 'work', outcome: 'Ancient texts of history and magic fill the shelves.', stat_deltas: { skills: { history: 4, magic: 2 } }, hours_passed: 3 },
      { id: 'noble_gossip', label: 'Gather noble gossip', intent: 'social', outcome: 'The aristocracy whispers of alliances and betrayals.', stat_deltas: { skills: { speech: 3 }, relationship: 2 }, hours_passed: 2 },
      { id: 'imperial_favor', label: 'Seek Imperial favor', intent: 'work', outcome: 'The Empire rewards loyalty handsomely.', stat_deltas: { relationship: 8, gold: 100 }, hours_passed: 2 },
      { id: 'crown_plot', label: 'Investigate crown plots', intent: 'stealth', outcome: 'There are those who would see the throne change hands...', stat_deltas: { corruption: 8 }, hours_passed: 2 }
    ]
  },
  the_winking_skeever: {
    id: 'the_winking_skeever',
    name: 'The Winking Skeever',
    type: 'tavern',
    region: 'haafingar',
    description: "Solitude's finest inn serves travelers, nobles, and soldiers alike. The owner is a former cutthroat turned respectable businessman. The rooms are expensive but comfortable, and the intelligence network is unmatched.",
    atmosphere: 'Upscale, connected, rowdy, expensive',
    actions: [
      { id: 'fine_dining', label: 'Order fine meal', intent: 'neutral', outcome: 'The chef prepares Nord-style dishes with an imperial twist.', stat_deltas: { health: 15, gold: -30 }, hours_passed: 2 },
      { id: 'imperial_info', label: 'Buy imperial information', intent: 'work', outcome: '"For the right price, I know things that could save your life."', stat_deltas: { gold: -50, skills: { speech: 2 } }, hours_passed: 1 },
      { id: 'soldiers_bar', label: 'Drinks with soldiers', intent: 'social', outcome: 'Imperial legionaries share tales of the war with the Stormcloaks.', stat_deltas: { relationship: 3, corruption: 1 }, hours_passed: 2 },
      { id: 'noble_meet', label: 'Meet a noble contact', intent: 'work', outcome: 'A masked figure passes you a sealed letter. "For your eyes only."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'luxury_sleep', label: 'Rent luxury room', intent: 'neutral', outcome: 'Silk sheets and a feather bed. The best sleep in Skyrim.', stat_deltas: { health: 25, exhaustion: -40, gold: -40 }, hours_passed: 8 },
      { id: 'business_deal', label: 'Make a business deal', intent: 'work', outcome: 'Merchants and nobles meet here to discuss ventures.', stat_deltas: { skills: { speech: 4 }, gold: 50 }, hours_passed: 2 },
      { id: 'assassin_encounter', label: 'Avoid assassin', intent: 'combat', outcome: 'A hooded figure makes their move. You defend yourself.', stat_deltas: { health: -10, skills: { combat: 5 }, corruption: 3 }, hours_passed: 1 },
      { id: 'cart_metadata', label: 'Ask about cart driver', intent: 'social', outcome: '"Carth? Nice enough fellow. Had a nice horse. Shame about..."', stat_deltas: { relationship: 2 }, hours_passed: 1 }
    ]
  },
  bard_college: {
    id: 'bard_college',
    name: 'The Bard\'s College',
    type: 'guild',
    region: 'haafingar',
    description: "The ancient college trains bards in music, poetry, and history. Students practice instruments in the courtyard, and the library holds songs from across Tamriel. The college is prestigious but funding is always short.",
    atmosphere: 'Artistic, scholarly, melodic, prestigious',
    actions: [
      { id: 'learn_song', label: 'Learn a new song', intent: 'work', outcome: 'A master teaches you an ancient Nord ballad.', stat_deltas: { skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'perform', label: 'Perform for coin', intent: 'work', outcome: 'Your performance earns applause and a few coins.', stat_deltas: { gold: 20, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'history_lesson', label: 'Attend history lesson', intent: 'work', outcome: 'The lorekeeper recounts tales of the ancient Nords.', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'instrument_training', label: 'Train instrument', intent: 'work', outcome: 'Practice makes perfect. Your lute skills improve.', stat_deltas: { skills: { speech: 3 } }, hours_passed: 3 },
      { id: 'poetry_contest', label: 'Enter poetry contest', intent: 'social', outcome: 'You recite your verse. The judges consider your work.', stat_deltas: { skills: { speech: 5 }, relationship: 3 }, hours_passed: 2 },
      { id: 'collect_legend', label: 'Collect a legend', intent: 'work', outcome: 'Old songs tell of hidden places and lost treasures.', stat_deltas: { skills: { history: 3 } }, hours_passed: 2 },
      { id: 'secret_ballad', label: 'Learn a forbidden ballad', intent: 'stealth', outcome: 'Some songs are banned for their dangerous content.', stat_deltas: { corruption: 5, skills: { speech: 3 } }, hours_passed: 1 },
      { id: 'collegepatron', label: 'Become a patron', intent: 'work', outcome: 'Your gold keeps the college running. They are grateful.', stat_deltas: { gold: -100, relationship: 10 }, hours_passed: 1 }
    ]
  },
  castle_dour: {
    id: 'castle_dour',
    name: 'Castle Dour',
    type: 'military',
    region: 'haafingar',
    description: "The Imperial fort in Solitude houses the Legion\'s commander and serves as the military headquarters for Skyrim. Soldiers train in the courtyard, and the armory is well-stocked. The fort commands the nearby port.",
    atmosphere: 'Military, disciplined, formidable, strategic',
    actions: [
      { id: 'legion_service', label: 'Offer legion service', intent: 'work', outcome: '"The Legion accepts all who can fight. Enlist today."', stat_deltas: { relationship: 5, skills: { combat: 3 } }, hours_passed: 1 },
      { id: 'armory_train', label: 'Train in the armory', intent: 'work', outcome: 'Imperial weapons and armor are of the highest quality.', stat_deltas: { skills: { one_handed: 4, heavy_armor: 3 }, gold: -20 }, hours_passed: 3 },
      { id: 'tactical_brief', label: 'Attend tactical briefing', intent: 'work', outcome: 'Officers discuss the war strategy against the Stormcloaks.', stat_deltas: { skills: { leadership: 3 } }, hours_passed: 2 },
      { id: 'border_patrol', label: 'Join border patrol', intent: 'work', outcome: 'You patrol the roads, keeping them safe from bandits.', stat_deltas: { gold: 30, skills: { marksman: 3 } }, hours_passed: 4 },
      { id: 'prison_interrogate', label: 'Interrogate prisoners', intent: 'work', outcome: 'Captured rebels are held here. They know things...', stat_deltas: { corruption: 5, skills: { intimidation: 3 } }, hours_passed: 2 },
      { id: 'fortress_defense', label: 'Defend the fort', intent: 'combat', outcome: 'Raiders attack! You help hold the line.', stat_deltas: { health: -15, skills: { combat: 5 } }, hours_passed: 2 },
      { id: 'imperial_courier', label: 'Become courier', intent: 'work', outcome: 'You carry important messages to other forts.', stat_deltas: { gold: 40, skills: { athletics: 3 } }, hours_passed: 4 },
      { id: 'secret_order', label: 'Discover secret order', intent: 'stealth', outcome: 'Some soldiers belong to a hidden group...', stat_deltas: { corruption: 8 }, hours_passed: 2 }
    ]
  },

  // WINDHELM & EASTMARCH
  white_phial: {
    id: 'white_phial',
    name: 'The White Phial',
    type: 'tavern',
    region: 'eastmarch',
    description: "A warm tavern in the cold city of Windhelm, frequented by Nords and Dunmer refugees alike. The innkeeper is a friendly Breton, and the hearth is always lit. The Dunmer in the corner have their own table.",
    atmosphere: 'Mixed, warm, slightly tense, welcoming',
    actions: [
      { id: 'nord_talk', label: 'Talk with Nords', intent: 'social', outcome: '"The Dunmer should go back where they came from."', stat_deltas: { corruption: 2, relationship: -2 }, hours_passed: 1 },
      { id: 'refugee_help', label: 'Help Dunmer refugees', intent: 'willpower', outcome: 'You bring food to the struggling Dunmer quarter.', stat_deltas: { willpower: 10, relationship: 5, gold: -10 }, hours_passed: 1 },
      { id: 'cold_drink', label: 'Order a cold drink', intent: 'neutral', outcome: 'The mulled mead warms you from the inside.', stat_deltas: { stress: -5, gold: -5 }, hours_passed: 1 },
      { id: 'inn_history', label: 'Hear inn history', intent: 'social', outcome: '"Windhelm\'s old. The founders built it in the First Era."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'stormcloak_recruit', label: 'Meet Stormcloak recruiter', intent: 'work', outcome: '"Join the rebellion! Skyrim for the Nords!"', stat_deltas: { corruption: 3 }, hours_passed: 1 },
      { id: 'guarded_words', label: 'Speak carefully', intent: 'social', outcome: 'Politics in Windhelm are dangerous. You watch your words.', stat_deltas: { skills: { speech: 2 } }, hours_passed: 1 },
      { id: 'refugee_story', label: 'Hear refugee story', intent: 'social', outcome: '"We fled Vvardenfell. The mountain exploded. Nothing left."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'dark_foreboding', label: 'Plan something dark', intent: 'stealth', outcome: 'You meet with those who wish to cause trouble...', stat_deltas: { corruption: 8 }, hours_passed: 1 }
    ]
  },
  palace_of_kings: {
    id: 'palace_of_kings',
    name: 'Palace of the Kings',
    type: 'noble',
    region: 'eastmarch',
    description: "The ancient palace serves as headquarters for the Stormcloak rebellion. Ulfric Stormcloak holds court here, and the walls are lined with ancient Nordic weapons. The atmosphere is martial and rebellious.",
    atmosphere: 'Rebellious, historical, militant, proud',
    actions: [
      { id: 'meet_ulfric', label: 'Meet Ulfric Stormcloak', intent: 'work', outcome: 'The rebel leader regards you with cold blue eyes.', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'swear_fealty', label: 'Swear fealty to the rebellion', intent: 'work', outcome: '"You would join our cause? Then take up arms for Skyrim!"', stat_deltas: { relationship: 10, corruption: 5 }, hours_passed: 1 },
      { id: 'war_council', label: 'Attend war council', intent: 'work', outcome: 'Generals discuss strategy against the Imperial Legion.', stat_deltas: { skills: { leadership: 4 } }, hours_passed: 2 },
      { id: 'ancient_weapons', label: 'Examine ancient weapons', intent: 'work', outcome: 'Weapons from the Dragon War hang on the walls.', stat_deltas: { skills: { history: 3 } }, hours_passed: 2 },
      { id: 'spy_network', label: 'Join the spy network', intent: 'stealth', outcome: '"We need eyes in Imperial territory. Can we trust you?"', stat_deltas: { corruption: 5, skills: { stealth: 3 } }, hours_passed: 2 },
      { id: 'battle_training', label: 'Train for battle', intent: 'combat', outcome: 'The rebels fight with fury and skill.', stat_deltas: { skills: { combat: 6, two_handed: 4 } }, hours_passed: 3 },
      { id: 'propaganda', label: 'Spread propaganda', intent: 'social', outcome: '"Skyrim belongs to the Nords!" You spread the message.', stat_deltas: { corruption: 3, relationship: 5 }, hours_passed: 2 },
      { id: 'royal_intrigue', label: 'Royal intrigue', intent: 'stealth', outcome: 'Who can you trust in the palace? Everyone has secrets.', stat_deltas: { corruption: 8, skills: { speech: 3 } }, hours_passed: 2 }
    ]
  },
  atherons_rise: {
    id: 'atherons_rise',
    name: 'Atheron\'s Rise',
    type: 'shrine',
    region: 'eastmarch',
    description: "A ruined shrine to the fallen hero Atheron, now a gathering place for those who remember the old ways. Pilgrims sometimes visit, and the solitude attracts those seeking meditation.",
    atmosphere: 'Ruined, sacred, melancholic, remote',
    actions: [
      { id: 'pay_respects', label: 'Pay respects to Atheron', intent: 'willpower', outcome: 'The hero died for honor. You feel the weight of that sacrifice.', stat_deltas: { willpower: 8 }, hours_passed: 1 },
      { id: 'meditate_hero', label: 'Meditate on heroism', intent: 'willpower', outcome: 'The quiet helps you find your center.', stat_deltas: { willpower: 10, exhaustion: -15 }, hours_passed: 2 },
      { id: 'search_ruins', label: 'Search the ruins', intent: 'work', outcome: 'Old offerings still remain in the rubble.', stat_deltas: { gold: 30, corruption: 2 }, hours_passed: 2 },
      { id: 'heroic_dreams', label: 'Dream of heroes', intent: 'willpower', outcome: 'You feel Atheron\'s spirit speak to you in dreams.', stat_deltas: { willpower: 12, skills: { magic: 2 } }, hours_passed: 4 },
      { id: 'solitude_seeker', label: 'Meet solitude seekers', intent: 'social', outcome: 'Others come here to escape the world\'s noise.', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'ancient_history', label: 'Research ancient history', intent: 'work', outcome: 'The stones tell of battles long past.', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'blood_sacrifice', label: 'Offer blood sacrifice', intent: 'willpower', outcome: 'The old ways demand blood. You give willingly.', stat_deltas: { health: -10, willpower: 15, corruption: 5 }, hours_passed: 1 },
      { id: 'hidden_cave', label: 'Discover hidden cave', intent: 'stealth', outcome: 'Behind the shrine, a passage leads to unknown depths.', stat_deltas: { corruption: 5 }, hours_passed: 2 }
    ]
  },
  dunmer_quarter: {
    id: 'dunmer_quarter',
    name: 'Windhelm Dunmer Quarter',
    type: 'district',
    region: 'eastmarch',
    description: "The Gray Quarter of Windhelm is home to Dunmer refugees. The district is poor, with crumbling buildings and struggling businesses. The Dunmer face discrimination from the local Nords.",
    atmosphere: 'Poor, tense, resilient, discriminated',
    actions: [
      { id: 'show_support', label: 'Show support for Dunmer', intent: 'willpower', outcome: '"You are kind. Most Nords treat us as trash."', stat_deltas: { willpower: 5, relationship: 10 }, hours_passed: 1 },
      { id: 'discrimination', label: 'Experience discrimination', intent: 'willpower', outcome: '"Get out of here, Dark Elf!" You face the hatred.', stat_deltas: { willpower: -3, relationship: -5 }, hours_passed: 1 },
      { id: 'argonian_assistance', label: 'Help Argonian servant', intent: 'willpower', outcome: 'The chained Argonian accepts your small kindness.', stat_deltas: { willpower: 8 }, hours_passed: 1 },
      { id: 'brine_prophecy', label: 'Hear Brine\'s prophecy', intent: 'social', outcome: '"The Hist speaks of change. A foreign hand will turn the tide."', stat_deltas: { skills: { magic: 2 } }, hours_passed: 1 },
      { id: 'necro_books', label: 'Find necromancy books', intent: 'stealth', outcome: 'Some Dunmer turn to forbidden arts to survive.', stat_deltas: { corruption: 10, skills: { magic: 3 } }, hours_passed: 2 },
      { id: 'curgemine', label: 'Work in the curated mine', intent: 'work', outcome: 'The mines are harsh but the pay is something.', stat_deltas: { health: -15, gold: 35, strength: 3 }, hours_passed: 6 },
      { id: 'fate_weaver', label: 'Visit the Fate Weaver', intent: 'social', outcome: 'A Dunmer claims to see the threads of destiny.', stat_deltas: { skills: { magic: 3 } }, hours_passed: 1 },
      { id: 'escape_plan', label: 'Plan an escape', intent: 'stealth', outcome: 'Some want to flee Windhelm. You could help.', stat_deltas: { corruption: 5 }, hours_passed: 2 }
    ]
  },

  // MARKARTH & THE REACH
  the_winking_skeevatan: {
    id: 'the_winking_skeevatan',
    name: 'The Winking Skeevatan',
    type: 'tavern',
    region: 'the_reach',
    description: "The notorious inn in Markarth is known for its questionable clientele. Forsworn, bandits, and shady merchants trade secrets here. The owner keeps things running with an iron fist.",
    atmosphere: 'Shady, dangerous, tense, profitable',
    actions: [
      { id: 'fornsv', label: 'Order Forsworn brew', intent: 'neutral', outcome: 'The mead tastes of heather and wild game.', stat_deltas: { stress: -10, gold: -8 }, hours_passed: 1 },
      { id: 'sell_info', label: 'Sell information', intent: 'work', outcome: '"That\'s worth something. Let\'s say... twenty gold."', stat_deltas: { gold: 20, corruption: 3 }, hours_passed: 1 },
      { id: 'forsworn_contact', label: 'Make Forsworn contact', intent: 'work', outcome: '"You seek the Madmen? I know a way."', stat_deltas: { relationship: 5, corruption: 5 }, hours_passed: 1 },
      { id: 'vendra_proposition', label: 'Hear Vendra\'s proposition', intent: 'work', outcome: '"I have a job. Dangerous. Good pay. Interested?"', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'understone_road', label: 'Take the Understone Road', intent: 'work', outcome: 'The ancient road leads to forgotten places.', stat_deltas: { skills: { survival: 2 } }, hours_passed: 3 },
      { id: 'cidhna_mine_info', label: 'Ask about the mines', intent: 'social', outcome: '"The mines run deep. Deeper than anyone knows."', stat_deltas: { corruption: 2 }, hours_passed: 1 },
      { id: 'bandit_alliance', label: 'Alliance with bandits', intent: 'stealth', outcome: 'The mountain clans have their own politics.', stat_deltas: { corruption: 10, skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'smuggle_goods', label: 'Smuggle goods', intent: 'stealth', outcome: 'The trade routes are watched, but alternatives exist.', stat_deltas: { gold: 60, corruption: 8 }, hours_passed: 3 }
    ]
  },
  throughbone: {
    id: 'throughbone',
    name: 'Throughbone',
    type: 'shop',
    region: 'the_reach',
    description: "The macabre shop deals in remains, skeletons, and the like. The owner, an eccentric Dunmer, has an unsettling interest in bones. The shop is popular with necromancers and researchers of the forbidden.",
    atmosphere: 'Morbid, academic, forbidden, fascinating',
    actions: [
      { id: 'buy_bones', label: 'Buy bones', intent: 'work', outcome: '"Skeleton or corpse? I have both, for the right price."', stat_deltas: { gold: -50, skills: { alchemy: 2 } }, hours_passed: 1 },
      { id: 'sell_corpses', label: 'Sell corpses', intent: 'work', outcome: '"Fresh? Even better. I pay well for recent deaths."', stat_deltas: { gold: 80, corruption: 8 }, hours_passed: 1 },
      { id: 'ask_necromancy', label: 'Ask about necromancy', intent: 'work', outcome: '"The dead have much to teach. Are you a student?"', stat_deltas: { skills: { magic: 4 }, corruption: 5 }, hours_passed: 1 },
      { id: 'bone_reading', label: 'Get a bone reading', intent: 'work', outcome: 'The Dunmer examines your bones. "I see... shadows."', stat_deltas: { skills: { magic: 3 } }, hours_passed: 1 },
      { id: 'secret_catalog', label: 'Request secret catalog', intent: 'stealth', outcome: 'The special items are kept in the back.', stat_deltas: { corruption: 10 }, hours_passed: 1 },
      { id: 'research_remains', label: 'Research with remains', intent: 'work', outcome: 'You study the anatomy of the dead.', stat_deltas: { skills: { alchemy: 4 }, gold: -20 }, hours_passed: 3 },
      { id: 'meet_similar', label: 'Meet fellow occultists', intent: 'social', outcome: 'Others who share your interests are here.', stat_deltas: { relationship: 3, corruption: 3 }, hours_passed: 2 },
      { id: 'forbidden_knowledge', label: 'Purchase forbidden knowledge', intent: 'stealth', outcome: 'Ancient texts explain things best left unknown.', stat_deltas: { corruption: 15, skills: { magic: 6 } }, hours_passed: 2 }
    ]
  },
  silver_blood_inn: {
    id: 'silver_blood_inn',
    name: 'Silver-Blood Inn',
    type: 'tavern',
    region: 'the_reach',
    description: "The Silver-Blood family runs this rough establishment. The inn serves miners, soldiers, and the occasional Forsworn convert. The smell of smoke and sweat fills the air.",
    atmosphere: 'Rough, loyal, tense, working-class',
    actions: [
      { id: 'silvers_blood', label: 'Order Silver-Blood mead', intent: 'neutral', outcome: 'The family\'s brew is strong and cheap.', stat_deltas: { stress: -10, gold: -5 }, hours_passed: 1 },
      { id: 'family_business', label: 'Offer services to family', intent: 'work', outcome: '"The Silver-Bloods have work. Digging, mostly."', stat_deltas: { gold: 30, relationship: 3 }, hours_passed: 3 },
      { id: 'cidhna_mine', label: 'Visit the mines', intent: 'work', outcome: 'The famous silver mines run deep under Markarth.', stat_deltas: { health: -15, gold: 50, strength: 3 }, hours_passed: 6 },
      { id: 'mysterious_cult', label: 'Investigate family secrets', intent: 'stealth', outcome: 'The Silver-Bloods have dark connections...', stat_deltas: { corruption: 8 }, hours_passed: 2 },
      { id: 'markarth_history', label: 'Learn Markarth history', intent: 'work', outcome: '"The city was taken by the Nords. We remember."', stat_deltas: { skills: { history: 3 }, relationship: -2 }, hours_passed: 1 },
      { id: 'braid_progress', label: 'Support Braig\'s progress', intent: 'work', outcome: 'The dwarf helps you with a plan. "I know some things."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'fight_pit', label: 'Enter the fight pit', intent: 'combat', outcome: 'Underground fighting is popular here.', stat_deltas: { skills: { combat: 8 }, health: -20, gold: 40 }, hours_passed: 2 },
      { id: 'escape_cult', label: 'Escape from cult', intent: 'willpower', outcome: 'A local cult demands your obedience. You refuse.', stat_deltas: { willpower: 15, corruption: -5 }, hours_passed: 1 }
    ]
  },
  markarth_outskirts: {
    id: 'markarth_outskirts',
    name: 'Markarth Outskirts',
    type: 'wilderness',
    region: 'the_reach',
    description: "The rough land around Markarth is filled with ancient ruins, Forsworn camps, and hidden paths. The Reach has been contested for centuries, and the land remembers every battle.",
    atmosphere: 'Rugged, historical, dangerous, ancient',
    actions: [
      { id: 'explore_ruins', label: 'Explore ancient ruins', intent: 'work', outcome: 'Nordic and Dwemer ruins hold secrets and treasures.', stat_deltas: { gold: 50, skills: { lockpicking: 3 }, corruption: 3 }, hours_passed: 4 },
      { id: 'forsworn_encounter', label: 'Encounter Forsworn', intent: 'combat', outcome: 'Briarhearts attack! They defend their land fiercely.', stat_deltas: { health: -20, skills: { combat: 5 }, corruption: 5 }, hours_passed: 2 },
      { id: 'negotiate_peace', label: 'Try to negotiate', intent: 'social', outcome: '"The Reach was ours first. Will you listen?"', stat_deltas: { skills: { speech: 4 }, relationship: 3 }, hours_passed: 2 },
      { id: 'ancient_standing_stones', label: 'Find standing stones', intent: 'work', outcome: 'The ancient markers still hold power.', stat_deltas: { skills: { magic: 4 } }, hours_passed: 2 },
      { id: 'hag_ravine', label: 'Visit the Hag\'s Ravine', intent: 'stealth', outcome: 'Witches gather here. Their power is old and dark.', stat_deltas: { corruption: 10, skills: { magic: 4 } }, hours_passed: 2 },
      { id: 'hunting_tiger', label: 'Hunt game', intent: 'work', outcome: 'The wild game is plentiful if you\'re skilled.', stat_deltas: { health: -5, gold: 30, skills: { marksman: 4 } }, hours_passed: 4 },
      { id: 'lost_caravan', label: 'Find lost caravan', intent: 'work', outcome: 'A merchant caravan disappeared. You find traces...', stat_deltas: { gold: 60, relationship: 5 }, hours_passed: 3 },
      { id: 'reach_magic', label: 'Learn Reach magic', intent: 'work', outcome: 'The Hagravens teach their nature magic.', stat_deltas: { corruption: 8, skills: { magic: 6 } }, hours_passed: 3 }
    ]
  },

  // WINTERHOLD
  college_of_winterhold: {
    id: 'college_of_winterhold',
    name: 'College of Winterhold',
    type: 'guild',
    region: 'winterhold',
    description: "The great bridge leads to the magnificent college, the premier institution of magic in Skyrim. Masters of all schools teach here, from destruction to restoration. The architecture mixes ancient and modern magical construction.",
    atmosphere: 'Arcane, scholarly, prestigious, cold',
    actions: [
      { id: 'join_college', label: 'Apply to join', intent: 'work', outcome: '"You show potential. Welcome to the College."', stat_deltas: { skills: { magic: 3 }, relationship: 5 }, hours_passed: 1 },
      { id: 'destruction_class', label: 'Take destruction class', intent: 'work', outcome: 'Fire, frost, and shock. The basics of destructive magic.', stat_deltas: { skills: { destruction: 5 }, gold: -20 }, hours_passed: 2 },
      { id: 'restoration_class', label: 'Take restoration class', intent: 'work', outcome: 'Healing magic requires precision and empathy.', stat_deltas: { skills: { restoration: 4 } }, hours_passed: 2 },
      { id: 'alchemy_practice', label: 'Practice alchemy', intent: 'work', outcome: 'The well-stocked lab allows experimentation.', stat_deltas: { skills: { alchemy: 4 }, gold: -15 }, hours_passed: 2 },
      { id: 'arch_mage_quest', label: 'Seek Arch-Mage\'s favor', intent: 'work', outcome: '"There are tasks that require... special talents."', stat_deltas: { relationship: 8 }, hours_passed: 1 },
      { id: 'dwarven_ruins', label: 'Explore Dwarven ruins', intent: 'work', outcome: 'The college sponsors expeditions to ancient sites.', stat_deltas: { skills: { engineering: 4 }, gold: 40 }, hours_passed: 4 },
      { id: 'forbidden_librar', label: 'Visit forbidden library', intent: 'stealth', outcome: 'Some knowledge is too dangerous for students.', stat_deltas: { corruption: 10, skills: { magic: 5 } }, hours_passed: 2 },
      { id: 'telvanni_staff', label: 'Meet Telvanni wizard', intent: 'social', outcome: '"The College is... adequate. But Telvanni knows more."', stat_deltas: { skills: { magic: 3 }, corruption: 3 }, hours_passed: 1 }
    ]
  },
  winterhold_ruins: {
    id: 'winterhold_ruins',
    name: 'Winterhold Ruins',
    type: 'wilderness',
    region: 'winterhold',
    description: "The great city of Winterhold was devastated by a magical cataclysm. Only the College remains, surrounded by frozen ruins. The rest is a frozen wasteland of ice and memories.",
    atmosphere: 'Frozen, melancholic, magical, dangerous',
    actions: [
      { id: 'explore_ruins', label: 'Explore frozen ruins', intent: 'work', outcome: 'Buildings frozen in time hold secrets and artifacts.', stat_deltas: { gold: 40, skills: { history: 3 } }, hours_passed: 3 },
      { id: 'ice_cave', label: 'Discover ice cave', intent: 'work', outcome: 'The glacier hides caverns of ice and ancient ice-wraiths.', stat_deltas: { skills: { combat: 4 }, corruption: 3 }, hours_passed: 2 },
      { id: 'ice_wraith_hunt', label: 'Hunt ice wraiths', intent: 'combat', outcome: 'The spirits are dangerous but their hearts are valuable.', stat_deltas: { health: -15, skills: { destruction: 4 }, gold: 50 }, hours_passed: 3 },
      { id: 'skychill_mines', label: 'Visit Skychill Mines', intent: 'work', outcome: 'Frost and iron are extracted from the old workings.', stat_deltas: { health: -10, gold: 35, strength: 2 }, hours_passed: 4 },
      { id: 'memorial', label: 'Visit memorial site', intent: 'willpower', outcome: 'The cataclysm is remembered with solemnity.', stat_deltas: { willpower: 5, skills: { history: 2 } }, hours_passed: 1 },
      { id: 'frost_giant_encounter', label: 'Encounter frost giant', intent: 'combat', outcome: 'The ancient beings still roam the frozen north.', stat_deltas: { health: -25, skills: { combat: 10 }, corruption: 3 }, hours_passed: 3 },
      { id: 'crypt_exploration', label: 'Explore burial crypts', intent: 'stealth', outcome: 'The frozen dead are buried with their treasures.', stat_deltas: { gold: 60, corruption: 5 }, hours_passed: 3 },
      { id: 'ancient_summit', label: 'Climb the ancient summit', intent: 'work', outcome: 'The mountain peak offers a view of all Tamriel.', stat_deltas: { skills: { survival: 4 }, exhaustion: -10 }, hours_passed: 4 }
    ]
  },

  // THE PALE
  dawnstar: {
    id: 'dawnstar',
    name: 'Dawnstar',
    type: 'city',
    region: 'the_pale',
    description: "The northernmost city in Skyrim sits on the edge of the frozen sea. The Jarl rules from the high hall, and the priests of the Dark Brotherhood once made their home here. Strange dreams plague the locals.",
    atmosphere: 'Cold, remote, haunted, vigilant',
    actions: [
      { id: 'jarl_meeting', label: 'Meet the Jarl', intent: 'work', outcome: '"The Thalmor watch everything. Even here."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'iron_breach', label: 'Visit the Iron Breach', intent: 'work', outcome: 'The mines produce the best iron in Skyrim.', stat_deltas: { health: -10, gold: 40, strength: 2 }, hours_passed: 4 },
      { id: 'bone_cleric', label: 'Talk to the Bone Cleric', intent: 'social', outcome: '"The dreams are warnings. Something stirs in the dark."', stat_deltas: { skills: { magic: 2 }, corruption: 2 }, hours_passed: 1 },
      { id: 'night_night', label: 'Experience Night Mother', intent: 'willpower', outcome: 'The murdered dead whisper for justice... or vengeance.', stat_deltas: { willpower: -5, corruption: 8 }, hours_passed: 1 },
      { id: 'quillotine', label: 'Visit the Quieting', intent: 'willpower', outcome: 'The dead should rest in peace. But they do not.', stat_deltas: { willpower: 5 }, hours_passed: 1 },
      { id: 'unusual_mining', label: 'Work unusual mining', intent: 'work', outcome: 'Something glows in the deep...', stat_deltas: { corruption: 5, gold: 50 }, hours_passed: 4 },
      { id: 'frost_cradle', label: 'Visit the Frost Cradle', intent: 'work', outcome: 'An ancient winter monument stands frozen in time.', stat_deltas: { skills: { history: 3 } }, hours_passed: 2 },
      { id: 'chill_death', label: 'Find the Chill', intent: 'stealth', outcome: 'Something in Dawnstar is not right. People disappear.', stat_deltas: { corruption: 10 }, hours_passed: 2 }
    ]
  },
  frozen_coast: {
    id: 'frozen_coast',
    name: 'The Frozen Coast',
    type: 'wilderness',
    region: 'the_pale',
    description: "The northern coastline is a frozen wasteland of ice and sea. Whales breach in the cold waters, and ships rarely visit. Yeti are known to roam the hills, and ancient ruins hide in the ice.",
    atmosphere: 'Barren, cold, beautiful, dangerous',
    actions: [
      { id: 'whale_watch', label: 'Watch the whales', intent: 'work', outcome: 'The majestic creatures are fascinating to observe.', stat_deltas: { skills: { survival: 2 } }, hours_passed: 2 },
      { id: 'ice_fishing', label: 'Fish through ice', intent: 'work', outcome: 'The fish are plentiful and cold-hardy.', stat_deltas: { gold: 25, skills: { survival: 3 } }, hours_passed: 3 },
      { id: 'yeti_encounter', label: 'Encounter yeti', intent: 'combat', outcome: 'The creature roars and charges! You fight for your life.', stat_deltas: { health: -20, skills: { combat: 6 } }, hours_passed: 2 },
      { id: 'ice_ruins', label: 'Explore ice-locked ruins', intent: 'work', outcome: 'Buildings encased in ice hold ancient secrets.', stat_deltas: { gold: 50, skills: { history: 3 } }, hours_passed: 3 },
      { id: 'coast_camp', label: 'Find a hunter camp', intent: 'social', outcome: 'Nords who live here are tough and self-sufficient.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'shipwreck_search', label: 'Search for shipwrecks', intent: 'work', outcome: 'Old ships might hold valuable cargo.', stat_deltas: { gold: 40, corruption: 2 }, hours_passed: 3 },
      { id: 'aurora_watch', label: 'Watch the aurora', intent: 'willpower', outcome: 'The lights dance in colors you didn\'t know existed.', stat_deltas: { willpower: 10, exhaustion: -15 }, hours_passed: 2 },
      { id: 'frost_marsh', label: 'Cross the frost marsh', intent: 'work', outcome: 'The unstable ice is dangerous but shortens the path.', stat_deltas: { health: -10, skills: { survival: 4 } }, hours_passed: 3 }
    ]
  },

  // Hjaalmarch (Marsh)
  morthal: {
    id: 'morthal',
    name: 'Morthal',
    type: 'city',
    region: 'hjaalmarch',
    description: "The strange town in the mist is known for its haunted bog and the mysterious burning of the Jarl\'s daughter. The locals are superstitious and wary of strangers. The bog is said to be bottomless.",
    atmosphere: 'Misty, eerie, superstitious, isolated',
    actions: [
      { id: 'jarl_investigation', label: 'Investigate the Jarl\'s death', intent: 'work', outcome: '"The house burned. But did it burn alone?"', stat_deltas: { relationship: 3, skills: { investigation: 3 } }, hours_passed: 2 },
      { id: 'bog_mist', label: 'Walk into the bog', intent: 'work', outcome: 'The mist obscures everything. You could get lost.', stat_deltas: { skills: { survival: 3 }, corruption: 2 }, hours_passed: 2 },
      { id: 'dwarven_automaton', label: 'Find Dwarven ruin', intent: 'work', outcome: 'The Dwarves built here once. Their creations remain.', stat_deltas: { skills: { engineering: 4 }, gold: 40 }, hours_passed: 3 },
      { id: 'falk_mystery', label: 'Solve Falk\'s mystery', intent: 'work', outcome: 'The burned bones tell a story of dark magic.', stat_deltas: { corruption: 5, skills: { magic: 3 } }, hours_passed: 2 },
      { id: 'local_hist', label: 'Talk to locals about history', intent: 'social', outcome: '"We don\'t go in the bog at night. Not since..."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'moors_witch', label: 'Find the moors witch', intent: 'social', outcome: 'A woman in the bog knows the old magic.', stat_deltas: { corruption: 5, skills: { alchemy: 3 } }, hours_passed: 2 },
      { id: 'bog_troll', label: 'Hunt the bog troll', intent: 'combat', outcome: 'The creature is enormous and covered in moss.', stat_deltas: { health: -20, skills: { combat: 6 }, gold: 30 }, hours_passed: 3 },
      { id: 'deep_ones', label: 'Discover deep bog secrets', intent: 'stealth', outcome: 'Things live in the depths that shouldn\'t exist.', stat_deltas: { corruption: 12 }, hours_passed: 2 }
    ]
  },

  // CYRODIIL BORDER
  imperial_fort_viri: {
    id: 'imperial_fort_viri',
    name: 'Fort Viri',
    type: 'military',
    region: 'cyrodiil_border',
    description: "An Imperial Legion fort on the border with Cyrodiil. The soldiers are well-trained and the fortifications are strong. The fort serves as a gateway between the provinces.",
    atmosphere: 'Military, organized, imperial, strategic',
    actions: [
      { id: 'legion_enlist', label: 'Enlist in the Legion', intent: 'work', outcome: '"The Empire protects. Join us and serve."', stat_deltas: { relationship: 5, skills: { combat: 3 } }, hours_passed: 1 },
      { id: 'border_patrol', label: 'Patrol the border', intent: 'work', outcome: 'You watch for smugglers and invaders.', stat_deltas: { gold: 30, skills: { marksman: 3 } }, hours_passed: 4 },
      { id: 'cyrodiil_trade', label: 'Trade with Cyrodiil', intent: 'work', outcome: 'Merchants cross from the south with exotic goods.', stat_deltas: { gold: -60, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'imperial_history', label: 'Learn imperial history', intent: 'work', outcome: 'The fort is old, built in the Reman Dynasty.', stat_deltas: { skills: { history: 3 } }, hours_passed: 2 },
      { id: 'cyrodiil_fight', label: 'Fight in the arena', intent: 'combat', outcome: 'Soldiers test their skills in friendly combat.', stat_deltas: { skills: { combat: 5 }, health: -10 }, hours_passed: 2 },
      { id: 'border_incident', label: 'Respond to border incident', intent: 'combat', outcome: 'Raiders attack the border! You help defend.', stat_deltas: { skills: { combat: 6 }, relationship: 5 }, hours_passed: 2 },
      { id: 'imperial_favor', label: 'Earn Imperial favor', intent: 'work', outcome: 'Good service brings rewards and promotion.', stat_deltas: { gold: 50, relationship: 8 }, hours_passed: 2 },
      { id: 'secret_passage', label: 'Find secret passage', intent: 'stealth', outcome: 'Smugglers use hidden paths. Maybe you can too.', stat_deltas: { corruption: 5, skills: { stealth: 4 } }, hours_passed: 2 }
    ]
  },
  colovian_estate: {
    id: 'colovian_estate',
    name: 'Colovian Estate',
    type: 'noble',
    region: 'cyrodiil_border',
    description: "A wealthy estate in the Colovian Highlands, owned by an Imperial noble family. The grounds are well-maintained, and the family is involved in trade with both Skyrim and Cyrodiil.",
    atmosphere: 'Wealthy, refined, connected, political',
    actions: [
      { id: 'noble_social', label: 'Attend noble gathering', intent: 'social', outcome: 'The elite discuss trade and politics.', stat_deltas: { skills: { speech: 4 }, relationship: 3 }, hours_passed: 3 },
      { id: 'estate_work', label: 'Work on the estate', intent: 'work', outcome: 'The estate needs hands for various tasks.', stat_deltas: { gold: 25, relationship: 2 }, hours_passed: 4 },
      { id: 'trade_advice', label: 'Get trade advice', intent: 'work', outcome: '"The Colovians know commerce. Let me teach you."', stat_deltas: { skills: { speech: 4 }, gold: -20 }, hours_passed: 2 },
      { id: 'imperial_wine', label: 'Taste imperial wines', intent: 'neutral', outcome: 'The vineyards here produce fine vintages.', stat_deltas: { stress: -15, gold: -25 }, hours_passed: 2 },
      { id: 'hunt_estate', label: 'Hunt on the grounds', intent: 'work', outcome: 'The grounds are stocked with game.', stat_deltas: { skills: { marksman: 4 }, gold: 30 }, hours_passed: 4 },
      { id: 'family_secret', label: 'Discover family secrets', intent: 'stealth', outcome: 'Every family has skeletons in the closet.', stat_deltas: { corruption: 8, relationship: -3 }, hours_passed: 2 },
      { id: 'business_proposal', label: 'Make business proposal', intent: 'work', outcome: 'The nobles are always looking for investments.', stat_deltas: { gold: 100, skills: { speech: 5 } }, hours_passed: 2 },
      { id: 'political_intrigue', label: 'Join political intrigue', intent: 'stealth', outcome: 'The noble houses scheme against each other.', stat_deltas: { corruption: 10, skills: { speech: 3 } }, hours_passed: 2 }
    ]
  },

  // HAMMERFELL BORDER
  kudingram: {
    id: 'kudingram',
    name: 'Kudingram',
    type: 'village',
    region: 'hammerfell_border',
    description: "A Redguard village on the border between Hammerfell and Skyrim. The people are proud warriors who have defended their land against both nations. The village is well-fortified and self-sufficient.",
    atmosphere: 'Proud, defensive, warrior, traditional',
    actions: [
      { id: 'redguard_training', label: 'Train with Redguards', intent: 'work', outcome: 'They teach their distinctive sword style.', stat_deltas: { skills: { one_handed: 5, blocking: 3 } }, hours_passed: 3 },
      { id: 'border_fort', label: 'Visit border fortress', intent: 'work', outcome: 'The fortress commands the pass between nations.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'hammerfell_talk', label: 'Learn about Hammerfell', intent: 'social', outcome: '"The Crowns and Forebears fight still, but we are all Redguard."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'desert_raid_survivor', label: 'Help raid survivor', intent: 'willpower', outcome: 'A warrior recovered from a Border Raid.', stat_deltas: { willpower: 5, relationship: 5 }, hours_passed: 1 },
      { id: 'trade_caravan', label: 'Trade with caravan', intent: 'work', outcome: 'Caravans bring goods from the south.', stat_deltas: { gold: -50, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'mountain_pass', label: 'Explore mountain pass', intent: 'work', outcome: 'The path is treacherous but shortens travel.', stat_deltas: { skills: { survival: 4 } }, hours_passed: 3 },
      { id: 'ancient_ruins', label: 'Find ancient ruins', intent: 'work', outcome: 'Pre-Morrowind ruins dot the landscape.', stat_deltas: { gold: 40, skills: { history: 3 } }, hours_passed: 3 },
      { id: 'join_resistance', label: 'Join the resistance', intent: 'work', outcome: 'Some resist both empires. Will you help?', stat_deltas: { corruption: 8, relationship: 5 }, hours_passed: 2 }
    ]
  },
  cradle_stave: {
    id: 'cradle_stave',
    name: 'Cradle Stave',
    type: 'shrine',
    region: 'hammerfell_border',
    description: "An ancient Nordic shrine dedicated to the old gods, located on the border. Pilgrims come to pray for safe passage, and the site has been contested by both Nords and Redguards over the centuries.",
    atmosphere: 'Sacred, contested, ancient, peaceful',
    actions: [
      { id: 'pilgrimage', label: 'Make pilgrimage', intent: 'willpower', outcome: 'You walk the sacred path to the shrine.', stat_deltas: { willpower: 8, exhaustion: -10 }, hours_passed: 3 },
      { id: 'prayer_blessing', label: 'Receive blessing', intent: 'willpower', outcome: 'The priest blesses your journey.', stat_deltas: { willpower: 5, relationship: 3 }, hours_passed: 1 },
      { id: 'old_gods_teach', label: 'Learn of the Old Gods', intent: 'work', outcome: 'The pre-Nordic gods are remembered here.', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'border_guard', label: 'Guard the shrine', intent: 'work', outcome: 'The sacred site needs protection from raiders.', stat_deltas: { gold: 25, relationship: 3 }, hours_passed: 4 },
      { id: 'redguard_visit', label: 'Meet Redguard pilgrims', intent: 'social', outcome: '"The old ways transcend borders."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'ancient_offering', label: 'Find ancient offerings', intent: 'work', outcome: 'Old treasures still lie at the altar.', stat_deltas: { gold: 50, corruption: 3 }, hours_passed: 2 },
      { id: 'sacred_tree', label: 'Visit the sacred tree', intent: 'willpower', outcome: 'The tree is older than the shrine itself.', stat_deltas: { willpower: 10, skills: { magic: 2 } }, hours_passed: 2 },
      { id: 'battle_ground', label: 'Explore old battleground', intent: 'work', outcome: 'Weapons from old conflicts still litter the ground.', stat_deltas: { gold: 30, skills: { history: 3 } }, hours_passed: 2 }
    ]
  },

  // HIGH ROCK BORDER (Breton lands)
  direncrest: {
    id: 'direncrest',
    name: 'Direncrest',
    type: 'village',
    region: 'high_rock_border',
    description: "A Breton village near the border with High Rock. The architecture is distinctly Breton, with round towers and flowing lines. The locals are skilled in the arcane and trade in magical goods.",
    atmosphere: 'Arcane, refined, trade-focused, enchanted',
    actions: [
      { id: 'breton_magic', label: 'Learn Breton magic', intent: 'work', outcome: 'The Bretons have their own magical traditions.', stat_deltas: { skills: { restoration: 4, alteration: 3 } }, hours_passed: 3 },
      { id: 'enchanted_goods', label: 'Buy enchanted goods', intent: 'work', outcome: 'Breton enchantments are highly prized.', stat_deltas: { gold: -100, skills: { enchanting: 2 } }, hours_passed: 1 },
      { id: 'mannimarco_legend', label: 'Hear of Mannimarco', intent: 'social', outcome: '"The King of Worms was Breton. His tomb is near..."', stat_deltas: { skills: { history: 4 }, corruption: 3 }, hours_passed: 1 },
      { id: 'trade_north', label: 'Trade with the north', intent: 'work', outcome: 'You facilitate trade between the provinces.', stat_deltas: { gold: 60, skills: { speech: 3 } }, hours_passed: 3 },
      { id: 'mage_tower', label: 'Visit the mage tower', intent: 'work', outcome: 'The tower teaches Bretons and outsiders alike.', stat_deltas: { skills: { magic: 4 }, gold: -30 }, hours_passed: 2 },
      { id: 'ley_line', label: 'Find ley line convergence', intent: 'work', outcome: 'Magic is strong where the lines meet.', stat_deltas: { skills: { magic: 6 } }, hours_passed: 3 },
      { id: 'secret_guild', label: 'Discover secret guild', intent: 'stealth', outcome: 'The Direneal works in the shadows.', stat_deltas: { corruption: 10, skills: { stealth: 4 } }, hours_passed: 2 },
      { id: 'breton_politics', label: 'Navigate Breton politics', intent: 'social', outcome: 'Noble houses compete for influence.', stat_deltas: { skills: { speech: 5 }, relationship: 3 }, hours_passed: 2 }
    ]
  },
  ilinaltas_depths: {
    id: 'ilinaltas_depths',
    name: 'Ilinalta\'s Depths',
    type: 'dungeon',
    region: 'high_rock_border',
    description: "An ancient ruin on the shores of Lake Ilinalta, said to be a temple to an old god. The waters are deep and dark, and something lives in the depths. Adventurers explore but few return unchanged.",
    atmosphere: 'Ancient, dangerous, aquatic, mysterious',
    actions: [
      { id: 'lake_dive', label: 'Dive into the lake', intent: 'work', outcome: 'The water is cold and dark. You see shapes below.', stat_deltas: { health: -10, skills: { survival: 3 } }, hours_passed: 2 },
      { id: 'underwater_ruins', label: 'Explore underwater ruins', intent: 'work', outcome: 'Temples lie beneath the waves, preserved.', stat_deltas: { gold: 60, skills: { lockpicking: 3 }, corruption: 3 }, hours_passed: 4 },
      { id: 'ancient_statuette', label: 'Find ancient artifact', intent: 'work', outcome: 'A golden statue of an old god lies in the silt.', stat_deltas: { gold: 100, corruption: 5 }, hours_passed: 2 },
      { id: 'lake_monster', label: 'Face the lake monster', intent: 'combat', outcome: 'A beast lurks in the deep. You fight or flee.', stat_deltas: { health: -25, skills: { combat: 8 }, corruption: 3 }, hours_passed: 3 },
      { id: 'shrine_pray', label: 'Pray at the shrine', intent: 'willpower', outcome: 'The old gods listen, even now.', stat_deltas: { willpower: 10 }, hours_passed: 1 },
      { id: 'hidden_cave', label: 'Find hidden cave', intent: 'work', outcome: 'Behind the waterfall, a passage leads inside.', stat_deltas: { skills: { survival: 3 } }, hours_passed: 2 },
      { id: 'drowned_dead', label: 'Fight drowned dead', intent: 'combat', outcome: 'The restless dead rise from the waters.', stat_deltas: { skills: { combat: 5 }, corruption: 3 }, hours_passed: 2 },
      { id: 'secret_passage', label: 'Find the secret cove', intent: 'stealth', outcome: 'Smugglers use this place. It hides much.', stat_deltas: { gold: 50, corruption: 8 }, hours_passed: 2 }
    ]
  },

  // ELSWEYR (border region - Khajiit lands)
  rimmen_border: {
    id: 'rimmen_border',
    name: 'Rimmen Border',
    type: 'border',
    region: 'elsweyr_border',
    description: "The border region between Hammerfell and Elsweyr, where Khajiit traders bring their goods. The desert gives way to scrubland, and the culture is a blend of Redguard and Khajiit.",
    atmosphere: 'Desert, multicultural, trade-focused, exotic',
    actions: [
      { id: 'khajiit_trade', label: 'Trade with Khajiit', intent: 'work', outcome: '"This one has fine goods. Best prices, yes?"', stat_deltas: { gold: -50, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'moonsugar_smuggle', label: 'Moonsugar deal', intent: 'stealth', outcome: 'The illicit trade is lucrative but dangerous.', stat_deltas: { gold: 80, corruption: 10 }, hours_passed: 2 },
      { id: 'desert_survival', label: 'Learn desert survival', intent: 'work', outcome: 'The Khajiit teach their water-finding ways.', stat_deltas: { skills: { survival: 5 } }, hours_passed: 3 },
      { id: 'caravan_加入', label: 'Join a caravan', intent: 'work', outcome: 'The traders welcome an extra hand.', stat_deltas: { gold: 40, relationship: 3 }, hours_passed: 4 },
      { id: 'moon_temple', label: 'Visit the Moon Temple', intent: 'social', outcome: 'The Khajiit worship the moons as gods.', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'cath_cult', label: 'Meet the Cathay', intent: 'social', outcome: 'The tiger-like Khajiit are noble and proud.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'desert_raid', label: 'Survive a desert raid', intent: 'combat', outcome: 'Raiders attack the trade route!', stat_deltas: { health: -15, skills: { combat: 5 } }, hours_passed: 2 },
      { id: 'ancient_kur', label: 'Find ancient Kur', intent: 'work', outcome: 'The old Khajiit capital lies in ruins nearby.', stat_deltas: { gold: 50, skills: { history: 4 } }, hours_passed: 3 }
    ]
  },

  // VALENWOOD BORDER
 绿色_wood: {
    id: 'green_wood',
    name: 'The Green',
    type: 'wilderness',
    region: 'valenwood_border',
    description: "The border between Hammerfell and Valenwood, where the forests begin. The Bosmer guard their borders jealously, and the trees grow thick and wild. Something lives in the deep woods.",
    atmosphere: 'Wild, forested, ancient, dangerous',
    actions: [
      { id: 'bosmer_meet', label: 'Meet Bosmer guards', intent: 'social', outcome: '"The Green is not for outsiders. Turn back."', stat_deltas: { relationship: -2 }, hours_passed: 1 },
      { id: 'forest_walk', label: 'Walk the forest path', intent: 'work', outcome: 'The woods are beautiful but you feel watched.', stat_deltas: { skills: { survival: 3 }, corruption: 2 }, hours_passed: 2 },
      { id: 'green_enter', label: 'Enter the Green', intent: 'stealth', outcome: 'You sneak past the guards into Bosmer lands.', stat_deltas: { skills: { stealth: 5 }, corruption: 3 }, hours_passed: 3 },
      { id: 'meat_tree', label: 'Experience the Onya Tree', intent: 'willpower', outcome: 'The sentient tree allows you to pass - or not.', stat_deltas: { willpower: 5 }, hours_passed: 1 },
      { id: 'wood_elven_trade', label: 'Trade with Wood Elves', intent: 'work', outcome: 'They have goods found nowhere else.', stat_deltas: { gold: -80, skills: { alchemy: 3 }, corruption: 3 }, hours_passed: 2 },
      { id: 'wild_beast', label: 'Hunt wild beasts', intent: 'combat', outcome: 'Creatures in the border are large and dangerous.', stat_deltas: { skills: { marksman: 5 }, gold: 40 }, hours_passed: 4 },
      { id: 'treethane_meet', label: 'Meet a Treethane', intent: 'social', outcome: 'The forest guardian judges your worth.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'eat_green', label: 'Partake of the Green', intent: 'willpower', outcome: 'The Bosmer have their own rituals...', stat_deltas: { corruption: 12, skills: { survival: 4 } }, hours_passed: 2 }
    ]
  },

  // EXISTING RIFTEN LOCATIONS (from original file)
  riften_docks: {
    id: 'the_bee_and_barb',
    name: 'The Bee and Barb',
    type: 'tavern',
    description: "Riften's premier tavern, named for the famous Black-Briar honey. Warm fires burn in hearths, the smell of roasting meat fills the air, and patrons of all walks gather to drink, gossip, and forget their troubles.",
    atmosphere: 'Warm, noisy, slightly smoky, welcoming despite the shadows in the corners',
    actions: [
      { id: 'order_drink', label: 'Order a drink', intent: 'neutral', outcome: 'Brynda slides a tankard across the bar. "Fresh from the cellars. Drink up."', stat_deltas: { stress: -5, gold: -5 }, hours_passed: 1 },
      { id: 'order_meal', label: 'Order food', intent: 'neutral', outcome: 'A hearty stew and bread appear before you. "Made it myself," Brynda says with pride.', stat_deltas: { health: 10, gold: -10 }, hours_passed: 1 },
      { id: 'ask_gossip', label: 'Ask about rumors', intent: 'social', outcome: 'Brynda leans in. "Word is, Maven's boy was seen at the Ragged Flagon again. And the Thieves Guild is getting bold..."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'listen', label: 'Listen to conversations', intent: 'social', outcome: 'You overhear two Nords discussing a vampire sighting in the hills. A Khajiit whispers about a job...', stat_deltas: { corruption: 1 }, hours_passed: 2 },
      { id: 'sleep', label: 'Rent a room', intent: 'neutral', outcome: 'The room is small but clean. The bed is soft after days on the road.', stat_deltas: { health: 20, exhaustion: -30, gold: -15 }, hours_passed: 8 },
      { id: 'brawl', label: 'Start a fight', intent: 'combat', outcome: 'Your fist connects with a drunk merchant\\'s face. The tavern erupts into chaos.', stat_deltas: { health: -10, relationship: -5, corruption: 5 }, hours_passed: 1 },
      { id: 'approach_npc', label: 'Approach a patron', intent: 'social', outcome: 'You spot a figure in the corner — an adventurer? A thief? They notice your gaze.', stat_deltas: {}, hours_passed: 1 },
      { id: 'drink_special', label: 'Try Talen-Jei\\'s special', intent: 'flirt', outcome: 'The Khajiit blend burns going down, then brings warmth to your chest. The world seems brighter...', stat_deltas: { corruption: 5, stress: -10, gold: -8 }, hours_passed: 1 }
    ]
  },
  riften_docks: {
    id: 'riften_docks',
    name: 'Riften Docks',
    type: 'work',
    description: 'The canal district where Argonians unload catch and traders bring goods by boat. The smell of fish and water is overwhelming. Hushed deals happen in the shadows of the warehouses.',
    atmosphere: 'Fishy, damp, shady, busy with hidden commerce',
    actions: [
      { id: 'fish', label: 'Fish in the canal', intent: 'work', outcome: 'You cast a line and wait. A few small fish bite — enough for a meal, not for sale.', stat_deltas: { health: -5, skills: { survival: 1 } }, hours_passed: 2 },
      { id: 'unload', label: 'Help unload goods', intent: 'work', outcome: 'Sweat-soaked hours earn you a few silver. The foreman nods at your work.', stat_deltas: { health: -10, gold: 15, strength: 2 }, hours_passed: 4 },
      { id: 'sketchy_deal', label: 'Ask about \"special\" cargo', intent: 'stealth', outcome: 'An Argonian eyes you. "Skooma? Moon sugar? We have... connections."', stat_deltas: { corruption: 5 }, hours_passed: 2 },
      { id: 'talk_argonian', label: 'Talk to workers', intent: 'social', outcome: 'One of the dock workers tells you about the Thieves Guild\\'s presence. "They watch everything from below."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'swim', label: 'Search the water', intent: 'stealth', outcome: 'Diving into the canal, you find old coins and a rusted dagger. Not much, but something.', stat_deltas: { health: -5, gold: 5 }, hours_passed: 2 },
      { id: 'guard', label: 'Watch for trouble', intent: 'work', outcome: 'You spot a pickpocket trying to relieve a merchant. Do you intervene?', stat_deltas: { willpower: 3 }, hours_passed: 2 },
      { id: 'wujeeta', label: 'Find Wujeeta', intent: 'social', outcome: 'You locate the Argonian dock worker. Her eyes are glazed — she clearly has a skooma problem.', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'hide', label: 'Hide and observe', intent: 'stealth', outcome: 'You slip into the shadows. A group of hooded figures exchange coin and packages...', stat_deltas: { corruption: 3 }, hours_passed: 2 }
    ]
  },
  the_scorched_hammer: {
    id: 'the_scorched_hammer',
    name: 'The Scorched Hammer',
    type: 'shop',
    description: "Ghorza's forge roars with heat even on the coldest days. Weapons and armor line the walls, most still warm from the forge. The clang of hammer on anvil provides a constant rhythm.",
    atmosphere: 'Hot, smoky, loud, filled with the smell of hot metal',
    actions: [
      { id: 'buy_weapon', label: 'Browse weapons', intent: 'work', outcome: 'Ghorza gestures to her wares. "Steel, iron, Orcish — take your pick. Good steel, fair price."', stat_deltas: { gold: -50 }, hours_passed: 1 },
      { id: 'buy_armor', label: 'Browse armor', intent: 'work', outcome: '"This leather\\'s the best around. Plate if you can afford it. Protection is what you need."', stat_deltas: { gold: -100 }, hours_passed: 1 },
      { id: 'learn_smithing', label: 'Learn smithing', intent: 'work', outcome: 'Ghorza grunts. "You want to learn? Heat the metal, hit it right. Then maybe you make something."', stat_deltas: { skills: { crafting: 5 }, gold: -20 }, hours_passed: 4 },
      { id: 'repair', label: 'Have items repaired', intent: 'work', outcome: '"That\\'ll take time and coin. Gold first, then I work."', stat_deltas: { gold: -25 }, hours_passed: 2 },
      { id: 'talk_ghorza', label: 'Talk to Ghorza', intent: 'social', outcome: '"You\\'re not bad. For a beginner. Keep that up and you might make a real smith someday."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'test_weapon', label: 'Test a weapon', intent: 'combat', outcome: 'You swing a practice sword. Ghorza watches. "Weak. Again! Harder!"', stat_deltas: { skills: { weapons: 3 } }, hours_passed: 2 },
      { id: 'help_forge', label: 'Help at the forge', intent: 'work', outcome: 'You work the bellows for hours. Your arms burn but you earn some coin.', stat_deltas: { health: -10, gold: 20, strength: 2 }, hours_passed: 4 },
      { id: 'special_order', label: 'Ask for custom work', intent: 'work', outcome: '"Custom? That takes time and rare materials. Bring me what I need and I\\'ll make what you want."', stat_deltas: {}, hours_passed: 1 }
    ]
  },
  elgrims_elixirs: {
    id: 'elgrims_elixirs',
    name: "Elgrim's Elixirs",
    type: 'shop',
    description: "The alchemy shop smells of strange herbs and stranger chemicals. Vials of every color line the shelves. Elgrim himself is a portly Breton who seems more interested in the effect of his potions than the coin they earn.",
    atmosphere: 'Mysterious, herb-scented, slightly chaotic, intriguing',
    actions: [
      { id: 'buy_potions', label: 'Buy potions', intent: 'work', outcome: 'Elgrim shuffles through bottles. "Healing, strength, stamina — what do you need?"', stat_deltas: { gold: -30 }, hours_passed: 1 },
      { id: 'buy_ingredients', label: 'Buy ingredients', intent: 'work', outcome: '"Chanterelles, Glow Dust, Wisp Wrappings — take your pick."', stat_deltas: { gold: -20, skills: { alchemy: 1 } }, hours_passed: 1 },
      { id: 'learn_alchemy', label: 'Learn alchemy', intent: 'work', outcome: '"Ah, an aspiring alchemist! Let me show you the basics of mixing..."', stat_deltas: { skills: { alchemy: 5 }, gold: -15 }, hours_passed: 3 },
      { id: 'sell_ingredients', label: 'Sell ingredients', intent: 'work', outcome: 'Elgrim examines your finds. "Hmm. I\\'ll give you fair coin for these."', stat_deltas: { gold: 25 }, hours_passed: 1 },
      { id: 'ask_secret', label: 'Ask about special potions', intent: 'social', outcome: 'Elgrim lowers his voice. "I have... things that aren\\'t for public display. Interested?"', stat_deltas: { corruption: 3 }, hours_passed: 1 },
      { id: 'experiment', label: 'Experiment in the lab', intent: 'work', outcome: 'You mix ingredients at random. Some explode. Some do... interesting things.', stat_deltas: { skills: { alchemy: 3 }, health: -5 }, hours_passed: 3 },
      { id: 'examine_tomes', label: 'Examine old tomes', intent: 'work', outcome: 'Dusty books contain recipes for potions you\\'ve never heard of.', stat_deltas: { skills: { alchemy: 2 } }, hours_passed: 2 },
      { id: 'gunther', label: 'Ask about Ingun', intent: 'social', outcome: '"Ingun? My daughter... she\\'s strange. Brilliant, but strange. She knows more about poisons than I do."', stat_deltas: { relationship: 2 }, hours_passed: 1 }
    ]
  },
  mistveil_keep: {
    id: 'mistveil_keep',
    name: 'Mistveil Keep',
    type: 'noble',
    description: "The Jarl's palace dominates Riften's center. Guards in blue patrol the halls, servents hurry about their duties, and the Court Wizard Farengar keeps to his tower. Political intrigue simmers beneath the formal courtesy.",
    atmosphere: 'Formal, cold, political, grand',
    actions: [
      { id: 'audience', label: 'Request audience with Jarl', intent: 'work', outcome: 'The steward admits you to the great hall. The Jarl sits upon his throne, looking bored.', stat_deltas: { relationship: 2 }, hours_passed: 2 },
      { id: 'talk_steward', label: 'Talk to the steward', intent: 'social', outcome: '"The Jarl has many concerns. Bandits, the war, Maven\\'s influence... he listens to those who bring solutions."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'visit_farengar', label: 'Visit the Court Wizard', intent: 'work', outcome: 'Farengar peers at you over his spectacles. "Another seeker of arcane knowledge? What do you want?"', stat_deltas: { skills: { magic: 2 } }, hours_passed: 2 },
      { id: 'guard_duty', label: 'Offer services to guards', intent: 'work', outcome: '"We can always use another sword. Patrolling the walls, keeping the peace..."', stat_deltas: { gold: 20, relationship: 3 }, hours_passed: 4 },
      { id: 'explore', label: 'Explore the keep', intent: 'stealth', outcome: 'You wander the halls, noting the layout. The treasury is locked, the cells hold prisoners...', stat_deltas: { corruption: 2 }, hours_passed: 3 },
      { id: 'bribe', label: 'Try to bribe a guard', intent: 'stealth', outcome: 'The guard\\'s eyes dart around. "Perhaps... perhaps we can work something out."', stat_deltas: { gold: -30, corruption: 5 }, hours_passed: 1 },
      { id: 'listen_noble', label: 'Listen to nobles', intent: 'social', outcome: '"...Maven will not be pleased about the new trade routes..."', stat_deltas: { corruption: 1 }, hours_passed: 2 },
      { id: 'request_job', label: 'Ask for work', intent: 'work', outcome: '"The Jarl needs someone to handle a problem. Quietly. Are you interested?"', stat_deltas: { relationship: 5 }, hours_passed: 1 }
    ]
  },
  the_ragged_flagon: {
    id: 'the_ragged_flagon',
    name: 'The Ragged Flagon',
    type: 'criminal',
    description: "Hidden beneath Riften, the Thieves Guild's headquarters is accessed through the canal or a hidden door in the Bee and Barb. Once a tavern, now it serves as a gathering place for those who live by taking from others.",
    atmosphere: 'Hidden, secretive, slightly grim, connected',
    actions: [
      { id: 'meet_guild', label: 'Approach the Guild', intent: 'stealth', outcome: '"You want to join? Talk to Vex. She decides who\\'s worthy."', stat_deltas: { corruption: 5 }, hours_passed: 1 },
      { id: 'talk_vex', label: 'Talk to Vex', intent: 'social', outcome: '"You want to work? Prove yourself first. Bring me something worth taking."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'fence_items', label: 'Fence stolen goods', intent: 'work', outcome: 'The fence examines your items. "I\\'ll give you half their value. Take it or leave it."', stat_deltas: { gold: 50 }, hours_passed: 1 },
      { id: 'pickpocket', label: 'Practice pickpocketing', intent: 'stealth', outcome: 'Your fingers find a coin purse. The victim doesn\\'t notice.', stat_deltas: { gold: 25, corruption: 5, skills: { stealth: 3 } }, hours_passed: 2 },
      { id: 'join_heist', label: 'Join a job', intent: 'stealth', outcome: '"We\\'re hitting Goldenglow Estate. Plenty of coin for everyone who pulls their weight."', stat_deltas: { corruption: 10 }, hours_passed: 6 },
      { id: 'train_lockpick', label: 'Practice lockpicking', intent: 'work', outcome: 'The training locks click open one by one. Your skill improves.', stat_deltas: { skills: { lockpicking: 5 } }, hours_passed: 3 },
      { id: 'mercer', label: 'Ask about the Guild leader', intent: 'social', outcome: '"Mercer? He\\'s watching. Always watching. You don\\'t want his attention unless you\\'re ready."', stat_deltas: { corruption: 2 }, hours_passed: 1 },
      { id: 'cleanse', label: 'Change your ways', intent: 'willpower', outcome: 'You leave the Flagon, climbing back into the light. The corruption doesn\\'t fade so easily...', stat_deltas: { willpower: 10, corruption: -5 }, hours_passed: 1 }
    ]
  },
  riften_jail: {
    id: 'riften_jail',
    name: 'Riften Jail',
    type: 'dangerous',
    description: "The small prison beneath the city holds those who crossed the wrong people. Cells are damp, guards are bribable, and some prisoners never leave.",
    atmosphere: 'Dark, damp, dangerous, corrupt',
    actions: [
      { id: 'visit', label: 'Visit a prisoner', intent: 'social', outcome: '"You\\'ve got five minutes. Don\\'t make it weird."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'bribe', label: 'Bribe the guard', intent: 'stealth', outcome: '"You\\'re lucky I\\'m hungry. But this never happened."', stat_deltas: { gold: -50, corruption: 5 }, hours_passed: 1 },
      { id: 'break_in', label: 'Attempt to break in', intent: 'stealth', outcome: 'The lock resists your tools. Guards patrol the corridor...', stat_deltas: { corruption: 3, skills: { lockpicking: 2 } }, hours_passed: 2 },
      { id: 'escape', label: 'Help a prisoner escape', intent: 'social', outcome: '"You\\'re saving my life. I won\\'t forget this."', stat_deltas: { relationship: 10, corruption: -3, willpower: 5 }, hours_passed: 3 },
      { id: 'arrest', label: 'Get arrested', intent: 'combat', outcome: '"You\\'re coming with us." The cell door slams shut.', stat_deltas: { health: -10, corruption: -2 }, hours_passed: 1 },
      { id: 'wait', label: 'Wait out your sentence', intent: 'neutral', outcome: 'Days blur in the dark. The food is terrible but you survive.', stat_deltas: { health: -20, willpower: 5 }, hours_passed: 48 },
      { id: 'interrogate', label: 'Interrogate a prisoner', intent: 'work', outcome: '"I didn\\'t do it! Please — I know things. I can tell you about Maven..."', stat_deltas: { corruption: 3 }, hours_passed: 2 },
      { id: 'pay_fine', label: 'Pay your fine', intent: 'work', outcome: 'The guard counts your gold. "You\\'re free to go. Don\\'t come back."', stat_deltas: { gold: -100, corruption: -2 }, hours_passed: 1 }
    ]
  },
  shrine_of_azura: {
    id: 'shrine_of_azura',
    name: 'Shrine of Azura',
    type: 'religious',
    description: 'High on the mountain above Riften, the shrine of the Daedric Prince Azura awaits pilgrims. The star of Azura shines above, and those who pray here sometimes receive visions.',
    atmosphere: 'Sacred, cold, distant, mystical',
    actions: [
      { id: 'pray', label: 'Pray to Azura', intent: 'social', outcome: 'You kneel before the statue. A cold wind rises, and for a moment, you see... visions.', stat_deltas: { willpower: 5, skills: { magic: 2 } }, hours_passed: 2 },
      { id: 'ask_vision', label: 'Ask for a vision', intent: 'work', outcome: '"Those who seek truth must be willing to see. Ask, and Azura may answer."', stat_deltas: { corruption: 2 }, hours_passed: 3 },
      { id: 'offering', label: 'Leave an offering', intent: 'neutral', outcome: 'You leave gold and gems at the altar. The star above seems brighter.', stat_deltas: { gold: -30, willpower: 3 }, hours_passed: 1 },
      { id: 'meditate', label: 'Meditate', intent: 'willpower', outcome: 'The cold strengthens your resolve. You feel... clearer.', stat_deltas: { willpower: 5, exhaustion: -10 }, hours_passed: 2 },
      { id: 'search', label: 'Search for artifacts', intent: 'stealth', outcome: 'You look for anything valuable left by pilgrims. You find some coins.', stat_deltas: { gold: 15, corruption: 3 }, hours_passed: 2 },
      { id: 'talk_pilgrim', label: 'Talk to pilgrims', intent: 'social', outcome: '"I came seeking answers. Azura showed me truth."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'research', label: 'Research Azura', intent: 'work', outcome: 'Old texts speak of the Daedric Prince — keeper of dusk and dawn, truth and prophecy.', stat_deltas: { skills: { magic: 3 } }, hours_passed: 3 },
      { id: 'dedicate', label: 'Dedicate yourself', intent: 'willpower', outcome: '"You would serve Azura? Then take this star and carry her light into the world."', stat_deltas: { willpower: 10, relationship: 10 }, hours_passed: 1 }
    ]
  },
  goldenglow_estate: {
    id: 'goldenglow_estate',
    name: 'Goldenglow Estate',
    type: 'dungeon',
    description: "The Black-Briar family's bee farm is a wealthy target. The main house is locked tight, but the outbuildings hold honey, gold, and secrets.",
    atmosphere: 'Wealthy, dangerous, guarded, sweet-smelling',
    actions: [
      { id: 'sneak_in', label: 'Sneak in', intent: 'stealth', outcome: 'You slip past the guards into the estate. Bees buzz in the apiary.', stat_deltas: { corruption: 5, skills: { stealth: 5 } }, hours_passed: 2 },
      { id: 'steal_honey', label: 'Steal honey', intent: 'stealth', outcome: 'Jars of Black-Briar honey fetch good coin from collectors.', stat_deltas: { gold: 50, corruption: 5 }, hours_passed: 2 },
      { id: 'search_house', label: 'Search the house', intent: 'stealth', outcome: 'Locked doors and heavy chests... you find gold and documents.', stat_deltas: { gold: 100, corruption: 10 }, hours_passed: 4 },
      { id: 'fight_guards', label: 'Fight the guards', intent: 'combat', outcome: 'Steel meets steel. They don\\'t expect a fight... but they recover.', stat_deltas: { health: -20, corruption: 5, skills: { combat: 5 } }, hours_passed: 3 },
      { id: 'find_secret', label: 'Find the secret entrance', intent: 'work', outcome: 'A hidden passage leads into the wine cellar. Unguarded.', stat_deltas: { skills: { lockpicking: 3 } }, hours_passed: 2 },
      { id: 'talk_beekeeper', label: 'Talk to the beekeeper', intent: 'social', outcome: '"Please — I just work here. Don\\'t hurt me. I have a family..."', stat_deltas: { relationship: -2, willpower: 3 }, hours_passed: 1 },
      { id: 'escape', label: 'Escape with loot', intent: 'stealth', outcome: 'You run through the woods, guards shouting behind. The gold is heavy but worth it.', stat_deltas: { health: -10, corruption: 5 }, hours_passed: 2 },
      { id: 'return_stolen', label: 'Return stolen goods', intent: 'willpower', outcome: 'You climb the wall and return everything. The guards are confused.', stat_deltas: { willpower: 15, corruption: -10 }, hours_passed: 3 }
    ]
  }
};