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
      { id: 'approach_npc', label: 'Approach a patron', intent: 'social', outcome: 'You spot a figure in the corner - an adventurer? A thief? They notice your gaze.', stat_deltas: {}, hours_passed: 1 },
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
      { id: 'request_quest', label: 'Ask for a quest', intent: 'work', outcome: '"We have many concerns - dragons, bandits, the war. Perhaps you could help."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
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
      { id: 'shop_market', label: 'Browse the market', intent: 'work', outcome: 'Merchants hawk their wares - vegetables, cloth, tools, and more.', stat_deltas: { gold: -50 }, hours_passed: 2 },
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
      { id: 'negotiate', label: 'Negotiate price', intent: 'work', outcome: '"You drive a hard bargain. Fine - this once."', stat_deltas: { skills: { speech: 3 }, gold: -10 }, hours_passed: 1 },
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
      { id: 'trade_guild', label: 'Visit the Tradehouse', intent: 'work', outcome: 'Dunmer merchants offer exotic goods - Telvanni artifacts, kwama cuttle, scrib jelly.', stat_deltas: { gold: -100 }, hours_passed: 2 },
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

  gnisis: {
    id: 'gnisis',
    name: 'Gnisis',
    type: 'village',
    region: 'morrowind',
    description: "An ancient village in the West Gash region, famous for its Madach temple and the Egg Mine. The Dunmer here are traditional and proud, tracing lineage to the House of Gnisis that once held power in the area.",
    atmosphere: 'Ancient, traditional, proud, agricultural',
    actions: [
      { id: 'visit_madach', label: 'Visit the Madach Temple', intent: 'social', outcome: 'The temple honors the ancestor-god. Priests maintain ancient traditions.', stat_deltas: { willpower: 5 }, hours_passed: 1 },
      { id: 'mine_eggs', label: 'Harvest kwama eggs', intent: 'work', outcome: 'The mine yields precious eggs. Careful extraction is required.', stat_deltas: { health: -10, gold: 30, strength: 2 }, hours_passed: 4 },
      { id: 'ancient_history', label: 'Learn of ancient Gnisis', intent: 'social', outcome: '"Our ancestors served the great houses. We remember."', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'tribunal_faith', label: 'Discuss Tribunal faith', intent: 'willpower', outcome: 'The old ways still hold meaning here despite the temples\' fall.', stat_deltas: { willpower: 5 }, hours_passed: 1 },
      { id: 'dwemer_artifacts', label: 'Seek Dwemer artifacts', intent: 'work', outcome: 'Ruins nearby hold remnants of the vanished engineers.', stat_deltas: { skills: { engineering: 3 }, gold: 40 }, hours_passed: 3 },
      { id: 'refugee_aid', label: 'Aid refugees from Vvardenfell', intent: 'willpower', outcome: 'Displaced Dunmer need help. The village takes them in.', stat_deltas: { willpower: 10, gold: -20 }, hours_passed: 2 },
      { id: 'farm_labor', label: 'Work the ash-lands farms', intent: 'work', outcome: 'The hardy crops grow in volcanic soil. Hard but honest work.', stat_deltas: { health: -5, gold: 25, strength: 3 }, hours_passed: 4 },
      { id: 'legend_tablet', label: 'Find the ancient law tablet', intent: 'work', outcome: 'The old laws are carved in stone. Knowledge of the ancestors.', stat_deltas: { skills: { history: 5 }, corruption: 2 }, hours_passed: 3 }
    ]
  },

  // TELVANNI QUARTERS
  telvanni_quarters: {
    id: 'telvanni_quarters',
    name: 'Telvanni Quarters',
    type: 'wizard_tower',
    region: 'morrowind',
    description: "A mushroom tower belonging to the Telvanni wizard-lords. The spongy structure rises impossibly high, its cap forming a platform for arcane experiments. Wizards here pursue knowledge with single-minded obsession, caring little for politics or ethics.",
    atmosphere: 'Arcane, eccentric, dangerous, isolated',
    actions: [
      { id: 'seek_patron', label: 'Seek a Telvanni patron', intent: 'work', outcome: '"You wish to serve? Prove your usefulness first."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'browse_artifacts', label: 'Browse magical artifacts', intent: 'work', outcome: 'Strange items from across Tamriel gather dust here.', stat_deltas: { gold: -150 }, hours_passed: 2 },
      { id: 'mushroom_climb', label: 'Climb the mushroom tower', intent: 'work', outcome: 'The stairs spiral endlessly upward. Each level holds wonders.', stat_deltas: { health: -10, skills: { athletics: 3 } }, hours_passed: 3 },
      { id: 'arcane_experiment', label: 'Assist arcane experiment', intent: 'work', outcome: 'The wizard needs test subjects. The results may vary.', stat_deltas: { health: -15, skills: { magic: 8 }, corruption: 5 }, hours_passed: 4 },
      { id: 'teach_spell', label: 'Request spell teaching', intent: 'work', outcome: '"I shall share this knowledge. For a price."', stat_deltas: { skills: { magic: 6 }, gold: -50 }, hours_passed: 2 },
      { id: 'kwama_breeding', label: 'Study kwama breeding', intent: 'work', outcome: 'The wizards keep kwama for some unfathomable purpose.', stat_deltas: { skills: { survival: 4, alchemy: 3 }, corruption: 3 }, hours_passed: 3 },
      { id: 'dwemer_scholar', label: 'Debate Dwemer philosophy', intent: 'social', outcome: '"The Dwemer sought to master mortality. A noble goal..."', stat_deltas: { skills: { history: 4, magic: 2 } }, hours_passed: 2 },
      { id: 'forbidden_research', label: 'Seek forbidden research', intent: 'stealth', outcome: 'The deepest archives hold secrets Telvanni hide even from each other.', stat_deltas: { corruption: 15, skills: { magic: 10 } }, hours_passed: 3 }
    ]
  },

  // VEYLEEN HARBOR
  veyleen_harbor: {
    id: 'veyleen_harbor',
    name: 'Veyleen Harbor',
    type: 'port',
    region: 'morrowind',
    description: "The trading port of Veyleen serves as the gateway for goods flowing between the Azura's Coast and the interior. Ships from across Tamriel dock here - Imperial vessels, Dunmer cargo haulers, and Khajiit caravans. The smell of salt and spices fills the air.",
    atmosphere: 'Bustling, mercantile, multicultural, maritime',
    actions: [
      { id: 'cargo_work', label: 'Work the docks', intent: 'work', outcome: 'Heavy crates and fragrant crates await. The work is hard.', stat_deltas: { health: -15, gold: 35, strength: 3 }, hours_passed: 6 },
      { id: 'negotiate_trade', label: 'Negotiate trade deals', intent: 'work', outcome: 'Merchants from across Tamriel wheel and deal.', stat_deltas: { skills: { speech: 5 }, gold: -20 }, hours_passed: 2 },
      { id: 'ship_passage', label: 'Book ship passage', intent: 'work', outcome: 'Vessels depart for distant ports - to the mainland or Solthaus.', stat_deltas: { gold: -60 }, hours_passed: 1 },
      { id: 'smuggler_meet', label: 'Meet smuggler contacts', intent: 'stealth', outcome: 'The harbor has dark corners for those who know where to look.', stat_deltas: { corruption: 8, gold: 50 }, hours_passed: 2 },
      { id: 'slaver_trade', label: 'Encounter the slaver docks', intent: 'stealth', outcome: 'The institution persists despite official prohibition.', stat_deltas: { corruption: 10, willpower: -5 }, hours_passed: 2 },
      { id: 'foreign_goods', label: 'Browse foreign goods', intent: 'work', outcome: 'Imported items from Summerset, Black Marsh, and Hammerfell.', stat_deltas: { gold: -100 }, hours_passed: 2 },
      { id: 'tribune_help', label: 'Seek House Hlaalu contacts', intent: 'work', outcome: 'The merchant house controls much of the harbor traffic.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'coastal_legend', label: 'Hear coastal legends', intent: 'social', outcome: 'Sailors speak of Daedra that haunt the seas, and the ministry above.', stat_deltas: { skills: { history: 3 }, corruption: 2 }, hours_passed: 2 }
    ]
  },

  // BALMORA SOUTH
  balmora_south: {
    id: 'balmora_south',
    name: 'Balmora South Market',
    type: 'market',
    region: 'morrowind',
    description: "The southern market district of Balmora bustles with merchants, craftspeople, and travelers. This is where the Hlaalu merchant house conducts much of its business, and the atmosphere is one of cosmopolitan commerce. Exotic goods from across the continent change hands here.",
    atmosphere: 'Cosmopolitan, commercial, lively, diverse',
    actions: [
      { id: 'trade_goods', label: 'Trade exotic goods', intent: 'work', outcome: 'Telvanni mushrooms, Kwama eggs, Dunmer pottery - many items change hands.', stat_deltas: { gold: -80 }, hours_passed: 2 },
      { id: 'hlaalu_contact', label: 'Contact House Hlaalu', intent: 'work', outcome: 'The merchant house welcomes ambitious traders.', stat_deltas: { relationship: 4, gold: -30 }, hours_passed: 1 },
      { id: 'guild_recruitment', label: 'Join the Fighters Guild', intent: 'work', outcome: 'The guild has an outpost here, handling contracts.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'mage_merchant', label: 'Buy from mage merchants', intent: 'work', outcome: 'Scrolls, potions, and rare ingredients are sold here.', stat_deltas: { skills: { alchemy: 2 }, gold: -70 }, hours_passed: 2 },
      { id: 'imperial_courier', label: 'Meet the Imperial courier', intent: 'work', outcome: 'The Empire maintains a presence here for official communications.', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'kwama_food', label: 'Sample kwama cuisine', intent: 'neutral', outcome: 'The local specialty - eggs cooked various ways - fills you up.', stat_deltas: { health: 10, gold: -8 }, hours_passed: 1 },
      { id: 'information_broker', label: 'Seek information broker', intent: 'work', outcome: 'Someone always knows something about jobs, politics, or secrets.', stat_deltas: { gold: -25, corruption: 3 }, hours_passed: 1 },
      { id: 'caravan_leave', label: 'Join a departing caravan', intent: 'work', outcome: 'Caravans head to Vvardenfell, Sadrith Mora, and beyond.', stat_deltas: { gold: -40, relationship: 3 }, hours_passed: 2 }
    ]
  },

  khuul: {
    id: 'khuul',
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

  // ELSWEYR (core region - Khajiit homeland)
  senchal: {
    id: 'senchal',
    name: 'Senchal',
    type: 'city',
    region: 'elsweyr',
    description: "The greatest port in Elsweyr, Senchal bustles with traders from across Tamriel. Moon sugar piles high on the docks, and the smell of the sea mingles with the sweet scent of the sacred commodity. The city is ruled by the Clan Mothers, who keep careful watch over the trade.",
    atmosphere: 'Busy, exotic, sweet-smelling, politically complex',
    actions: [
      { id: 'moon_sugar_trade', label: 'Trade moon sugar', intent: 'work', outcome: '"Best sugar in Tamriel, this one guarantees! Masser and Secunda bless our wares."', stat_deltas: { gold: -100, skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'dock_work', label: 'Work the docks', intent: 'work', outcome: 'The work is hard but pays well. Khajiit foremen bark orders in their native tongue.', stat_deltas: { health: -10, gold: 35, strength: 2 }, hours_passed: 4 },
      { id: 'clan_mother', label: 'Meet a Clan Mother', intent: 'work', outcome: 'The elderly Khajiit regards you with ancient yellow eyes. "You seek trade? The Mothers decide all."', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'senche_riders', label: 'Hire Senche riders', intent: 'combat', outcome: 'The massive tiger-warriors demand high pay but are unstoppable in battle.', stat_deltas: { gold: -80, skills: { combat: 3 }, relationship: 2 }, hours_passed: 1 },
      { id: 'shipyard', label: 'Visit the shipyard', intent: 'work', outcome: 'Ships are built Khajiit-style, designed for the treacherous river mouths.', stat_deltas: { skills: { survival: 2 } }, hours_passed: 2 },
      { id: 'contraband', label: 'Arrange contraband', intent: 'stealth', outcome: 'A hooded figure offers to move "special goods" past the imperial inspectors.', stat_deltas: { gold: 100, corruption: 8 }, hours_passed: 2 },
      { id: 'cathay_merchant', label: 'Bargain with Cathay', intent: 'social', outcome: 'The tiger-like merchants are proud but fair. "You know good value, yes?"', stat_deltas: { skills: { speech: 4 }, relationship: 3 }, hours_passed: 2 },
      { id: 'port_gossip', label: 'Hear port gossip', intent: 'social', outcome: 'Sailors whisper of dragon sightings to the north and trouble in the Mane\'s temple.', stat_deltas: { corruption: 2, relationship: 2 }, hours_passed: 1 }
    ]
  },
  rimgan: {
    id: 'rimgan',
    name: 'Rimgan',
    type: 'village',
    region: 'elsweyr',
    description: "A traditional Khajiit village known for its master crafters. The residents here are predominantly of the Ohmes and Ohmes-Raht furstocks, known for their artistic sensibilities. The village produces the finest carved bone and moonstone jewelry in Elsweyr.",
    atmosphere: 'Artistic, traditional, peaceful, feline',
    actions: [
      { id: 'bone_craft', label: 'Learn bone crafting', intent: 'work', outcome: 'An aged Khajiit teaches the sacred art. "Bone holds memory, yes? We make it speak."', stat_deltas: { skills: { crafting: 5 }, gold: -20 }, hours_passed: 3 },
      { id: 'moonstone_jewelry', label: 'Buy moonstone jewelry', intent: 'work', outcome: 'The gems glow faintly in moonlight. "Sacred to Masser, this one is."', stat_deltas: { gold: -75, willpower: 3 }, hours_passed: 1 },
      { id: 'ohmes_tales', label: 'Hear Ohmes tales', intent: 'social', outcome: 'The villagers share stories of the Moon-Light Dance and the first Mane.', stat_deltas: { skills: { history: 3 }, relationship: 2 }, hours_passed: 2 },
      { id: 'furstock_chat', label: 'Discuss furstocks', intent: 'social', outcome: '"Each furstock has its own way, yes? The Senche are warriors, the Alfiq are scholars."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'ring_inquire', label: 'Ask about the Ring', intent: 'stealth', outcome: 'A whisper tells you the Ring of Namira was seen near the desert oasis...', stat_deltas: { corruption: 5 }, hours_passed: 1 },
      { id: 'night_prowl', label: 'Prowl at night', intent: 'stealth', outcome: 'The Khajiit way allows freedom at night. You explore the village unseen.', stat_deltas: { skills: { stealth: 3 } }, hours_passed: 2 },
      { id: 'craft_commission', label: 'Commission a piece', intent: 'work', outcome: 'The artisan promises a masterwork. "Give time, give coin, receive glory."', stat_deltas: { gold: -150 }, hours_passed: 1 },
      { id: 'village_elder', label: 'Speak to the elder', intent: 'social', outcome: '"The moons govern all, two children of Ahnurr and Azurah. Know this, outsider."', stat_deltas: { relationship: 4, willpower: 2 }, hours_passed: 1 }
    ]
  },
  orcrest: {
    id: 'orcrest',
    name: 'Orcrest',
    type: 'oasis',
    region: 'elsweyr',
    description: "A lush oasis in the Elsweyr desert, Orcrest is a sacred place where the Khajiit first learned to harvest moon sugar. Palm trees surround a crystal-clear pool, and the air is thick with the sweet perfume of the harvest. Pilgrims come from across the land to pray at the ancient shrine.",
    atmosphere: 'Sacred, serene, sweet-smelling, spiritual',
    actions: [
      { id: 'moon_sugar_harvest', label: 'Harvest moon sugar', intent: 'work', outcome: 'The delicate crystals must be gathered at night under the full moons.', stat_deltas: { skills: { alchemy: 4, survival: 2 }, gold: 50 }, hours_passed: 4 },
      { id: 'sacred_pool', label: 'Bathe in the pool', intent: 'willpower', outcome: 'The water is cool and pure. You feel cleansed in body and spirit.', stat_deltas: { health: 20, willpower: 10 }, hours_passed: 2 },
      { id: 'pilgrim_prayer', label: 'Join pilgrims in prayer', intent: 'willpower', outcome: 'Khajiit chant to Masser and Secunda. The moons shine brighter...', stat_deltas: { willpower: 8 }, hours_passed: 2 },
      { id: 'oasis_guard', label: 'Guard the oasis', intent: 'combat', outcome: 'Bandits often attempt to seize this sacred place. You repel their attack.', stat_deltas: { health: -15, skills: { combat: 5 }, relationship: 5 }, hours_passed: 3 },
      { id: 'ancient_shrine', label: 'Visit the ancient shrine', intent: 'willpower', outcome: 'The first harvest was made here. The stone bears claw-marks of ages past.', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'sugar_addiction', label: 'Sample the sugar', intent: 'neutral', outcome: 'The sweet rush is intense. You understand why the Khajiit prize it so.', stat_deltas: { corruption: 5, stress: -15 }, hours_passed: 1 },
      { id: 'desert_survival', label: 'Learn desert magic', intent: 'work', outcome: 'A hermit teaches water-weaving, a spell to summon moisture from air.', stat_deltas: { skills: { magic: 5 } }, hours_passed: 3 },
      { id: 'nomad_encounter', label: 'Meet desert nomads', intent: 'social', outcome: 'The itinerant Khajiit trade stories and supplies. "The sands remember all, yes?"', stat_deltas: { relationship: 3, gold: -10 }, hours_passed: 2 }
    ]
  },
  dunes_elsweyr: {
    id: 'dunes_elsweyr',
    name: 'The Elsweyr Dunes',
    type: 'plains',
    region: 'elsweyr',
    description: "The vast grasslands of southern Elsweyr stretch to the horizon, dotted with small settlements and wandering herds. The Senche-raht herds their massive tigers across these plains, and the grass grows tall enough to hide a man. Dragon sightings have become common here.",
    atmosphere: 'Open, wild, dangerous, pastoral',
    actions: [
      { id: 'senche_herd', label: 'Observe Senche herd', intent: 'work', outcome: 'The massive tiger-cattle graze peacefully. Their handlers are proud warriors.', stat_deltas: { skills: { survival: 2 }, relationship: 2 }, hours_passed: 2 },
      { id: 'dragon_attack', label: 'Fight dragon', intent: 'combat', outcome: 'The beast descends! You rally the herders to drive it off.', stat_deltas: { health: -25, skills: { combat: 10 }, gold: 100 }, hours_passed: 4 },
      { id: 'grassland_hunt', label: 'Hunt on the plains', intent: 'work', outcome: 'Giant grass-striders make challenging prey. Their meat feeds villages.', stat_deltas: { health: -10, skills: { marksman: 4 }, gold: 40 }, hours_passed: 4 },
      { id: 'herders_camp', label: 'Stay with herders', intent: 'neutral', outcome: 'The nomads welcome you warmly. Their tents are woven from grass.', stat_deltas: { health: 10, exhaustion: -20, relationship: 3 }, hours_passed: 8 },
      { id: 'mane_temple', label: 'Visit Mane\'s temple', intent: 'willpower', outcome: 'The holy site is guarded by fierce bodyguards. "Only the worthy enter."', stat_deltas: { willpower: 8, relationship: 2 }, hours_passed: 2 },
      { id: 'bodyguard_offer', label: 'Offer bodyguard services', intent: 'work', outcome: 'The temple needs protectors. The pay is modest but the honor is immense.', stat_deltas: { gold: 50, relationship: 8, skills: { combat: 3 } }, hours_passed: 4 },
      { id: 'furstock_warrior', label: 'Train with different furstock', intent: 'combat', outcome: 'A Dagi-raht warrior teaches their unique fighting style, all claws and speed.', stat_deltas: { skills: { combat: 5, stealth: 3 } }, hours_passed: 3 },
      { id: 'plains_story', label: 'Hear plains stories', intent: 'social', outcome: '"The dragons came from the north, yes? The sky-burners remember their ancient home."', stat_deltas: { skills: { history: 3 }, corruption: 2 }, hours_passed: 1 }
    ]
  },

  // ELSWEYR CITIES
  rimmen: {
    id: 'rimmen',
    name: 'Rimmen',
    type: 'city',
    region: 'elsweyr',
    description: "The trading jewel of southern Elsweyr, Rimmen blends Imperial and Khajiit cultures seamlessly. Moon sugar flows through its gates, and the city serves as the primary gateway for goods entering from Hammerfell. The Imperial presence is strong here.",
    atmosphere: 'Cosmopolitan, busy, regulated, trade-focused',
    actions: [
      { id: 'imperial_customs', label: 'Clear customs', intent: 'work', outcome: 'Imperial officers inspect your goods with practiced efficiency. "Next!"', stat_deltas: { gold: -25 }, hours_passed: 2 },
      { id: 'caravan_arrival', label: 'Meet arriving caravan', intent: 'social', outcome: 'A Khajiit caravan arrives from the desert, bearing exotic wares.', stat_deltas: { relationship: 3, gold: -50 }, hours_passed: 2 },
      { id: 'moon_sugar_broker', label: 'Visit sugar broker', intent: 'work', outcome: '"The trade is regulated, yes? But for the right gold, I know people..."', stat_deltas: { corruption: 5, gold: 50 }, hours_passed: 2 },
      { id: 'imperial_guard', label: 'Join Imperial watch', intent: 'work', outcome: '"Extra guards needed. The moonsugar trade attracts trouble."', stat_deltas: { gold: 40, skills: { combat: 2 }, relationship: 2 }, hours_passed: 4 },
      { id: 'redguard_trade', label: 'Trade with Redguards', intent: 'work', outcome: 'The warriors from Hammerfell have goods from the western deserts.', stat_deltas: { gold: -60, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'warehouse_district', label: 'Explore warehouse district', intent: 'stealth', outcome: 'The back alleys hold secret deals. Smugglers operate in shadow.', stat_deltas: { corruption: 5, skills: { stealth: 2 }, gold: 30 }, hours_passed: 2 },
      { id: 'city_wall_walk', label: 'Walk the walls', intent: 'neutral', outcome: 'The walls offer views of the desert and sea. Guards patrol ceaselessly.', stat_deltas: { skills: { survival: 1 } }, hours_passed: 2 },
      { id: 'rimmen_history', label: 'Ask about city history', intent: 'social', outcome: '"Rimmen was independent once. Now? The Empire protects us, yes?"', stat_deltas: { skills: { history: 2 }, relationship: 2 }, hours_passed: 1 }
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
      { id: 'ask_gossip', label: 'Ask about rumors', intent: 'social', outcome: "Brynda leans in. \"Word is, Maven's boy was seen at the Ragged Flagon again. And the Thieves Guild is getting bold...\"", stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'listen', label: 'Listen to conversations', intent: 'social', outcome: 'You overhear two Nords discussing a vampire sighting in the hills. A Khajiit whispers about a job...', stat_deltas: { corruption: 1 }, hours_passed: 2 },
      { id: 'sleep', label: 'Rent a room', intent: 'neutral', outcome: 'The room is small but clean. The bed is soft after days on the road.', stat_deltas: { health: 20, exhaustion: -30, gold: -15 }, hours_passed: 8 },
      { id: 'brawl', label: 'Start a fight', intent: 'combat', outcome: "Your fist connects with a drunk merchant's face. The tavern erupts into chaos.", stat_deltas: { health: -10, relationship: -5, corruption: 5 }, hours_passed: 1 },
      { id: 'approach_npc', label: 'Approach a patron', intent: 'social', outcome: 'You spot a figure in the corner - an adventurer? A thief? They notice your gaze.', stat_deltas: {}, hours_passed: 1 },
      { id: 'drink_special', label: 'Try Talen-Jei\'s special', intent: 'flirt', outcome: "The Khajiit blend burns going down, then brings warmth to your chest. The world seems brighter...", stat_deltas: { corruption: 5, stress: -10, gold: -8 }, hours_passed: 1 }
    ]
  },
  riften_docks: {
    id: 'riften_docks',
    name: 'Riften Docks',
    type: 'work',
    description: 'The canal district where Argonians unload catch and traders bring goods by boat. The smell of fish and water is overwhelming. Hushed deals happen in the shadows of the warehouses.',
    atmosphere: 'Fishy, damp, shady, busy with hidden commerce',
    actions: [
      { id: 'fish', label: 'Fish in the canal', intent: 'work', outcome: 'You cast a line and wait. A few small fish bite - enough for a meal, not for sale.', stat_deltas: { health: -5, skills: { survival: 1 } }, hours_passed: 2 },
      { id: 'unload', label: 'Help unload goods', intent: 'work', outcome: 'Sweat-soaked hours earn you a few silver. The foreman nods at your work.', stat_deltas: { health: -10, gold: 15, strength: 2 }, hours_passed: 4 },
      { id: 'sketchy_deal', label: 'Ask about "special" cargo', intent: 'stealth', outcome: 'An Argonian eyes you. "Skooma? Moon sugar? We have... connections."', stat_deltas: { corruption: 5 }, hours_passed: 2 },
      { id: 'talk_argonian', label: 'Talk to workers', intent: 'social', outcome: "One of the dock workers tells you about the Thieves Guild's presence. 'They watch everything from below.'", stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'swim', label: 'Search the water', intent: 'stealth', outcome: 'Diving into the canal, you find old coins and a rusted dagger. Not much, but something.', stat_deltas: { health: -5, gold: 5 }, hours_passed: 2 },
      { id: 'guard', label: 'Watch for trouble', intent: 'work', outcome: 'You spot a pickpocket trying to relieve a merchant. Do you intervene?', stat_deltas: { willpower: 3 }, hours_passed: 2 },
      { id: 'wujeeta', label: 'Find Wujeeta', intent: 'social', outcome: 'You locate the Argonian dock worker. Her eyes are glazed - she clearly has a skooma problem.', stat_deltas: { relationship: 2 }, hours_passed: 1 },
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
      { id: 'buy_weapon', label: 'Browse weapons', intent: 'work', outcome: 'Ghorza gestures to her wares. "Steel, iron, Orcish - take your pick. Good steel, fair price."', stat_deltas: { gold: -50 }, hours_passed: 1 },
      { id: 'buy_armor', label: 'Browse armor', intent: 'work', outcome: "This leather's the best around. Plate if you can afford it. Protection is what you need.", stat_deltas: { gold: -100 }, hours_passed: 1 },
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
    region: 'the_reach',
    description: "The alchemy shop smells of strange herbs and stranger chemicals. Vials of every color line the shelves. Elgrim himself is a portly Breton who seems more interested in the effect of his potions than the coin they earn.",
    atmosphere: 'Mysterious, herb-scented, slightly chaotic, intriguing',
    actions: [
      { id: 'buy_potions', label: 'Buy potions', intent: 'work', outcome: 'Elgrim shuffles through bottles. "Healing, strength, stamina - what do you need?"', stat_deltas: { gold: -30 }, hours_passed: 1 },
      { id: 'buy_ingredients', label: 'Buy ingredients', intent: 'work', outcome: '"Chanterelles, Glow Dust, Wisp Wrappings - take your pick."', stat_deltas: { gold: -20, skills: { alchemy: 1 } }, hours_passed: 1 },
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
      { id: 'interrogate', label: 'Interrogate a prisoner', intent: 'work', outcome: '"I didn\\'t do it! Please - I know things. I can tell you about Maven..."', stat_deltas: { corruption: 3 }, hours_passed: 2 },
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
      { id: 'research', label: 'Research Azura', intent: 'work', outcome: 'Old texts speak of the Daedric Prince - keeper of dusk and dawn, truth and prophecy.', stat_deltas: { skills: { magic: 3 } }, hours_passed: 3 },
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
      { id: 'talk_beekeeper', label: 'Talk to the beekeeper', intent: 'social', outcome: '"Please - I just work here. Don\\'t hurt me. I have a family..."', stat_deltas: { relationship: -2, willpower: 3 }, hours_passed: 1 },
      { id: 'escape', label: 'Escape with loot', intent: 'stealth', outcome: 'You run through the woods, guards shouting behind. The gold is heavy but worth it.', stat_deltas: { health: -10, corruption: 5 }, hours_passed: 2 },
      { id: 'return_stolen', label: 'Return stolen goods', intent: 'willpower', outcome: 'You climb the wall and return everything. The guards are confused.', stat_deltas: { willpower: 15, corruption: -10 }, hours_passed: 3 }
    ]
  },

  // FALKREATH HOLD
  falkreath_city: {
    id: 'falkreath_city',
    name: 'Falkreath',
    type: 'city',
    region: 'falkreath_hold',
    description: "The small logging town of Falkreath sits in a valley surrounded by dense forests. The Jarl rules from a modest longhouse, and the local inn serves as the heart of community life. Lumber is the primary trade.",
    atmosphere: 'Woody, peaceful, humble, forest',
    actions: [
      { id: 'visit_jarl', label: 'Visit the Jarl', intent: 'work', outcome: 'The Jarl welcomes visitors in his longhouse. "Welcome to Falkreath."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'lumber_trade', label: 'Trade lumber', intent: 'work', outcome: "The town's wealth comes from timber. You can buy or sell wood.", stat_deltas: { gold: 40 }, hours_passed: 2 },
      { id: 'inn_rest', label: 'Rest at the inn', intent: 'neutral', outcome: 'The inn is warm and welcoming after days in the forest.', stat_deltas: { health: 15, exhaustion: -25, gold: -10 }, hours_passed: 8 },
      { id: 'forest_hunt', label: 'Hunt in the forest', intent: 'work', outcome: 'Deer and elk are plentiful in the surrounding woods.', stat_deltas: { health: -10, gold: 30, skills: { marksman: 3 } }, hours_passed: 4 },
      { id: 'ask_deaths', label: 'Ask about Deaths', intent: 'social', outcome: '"The cemetery is ancient. Many have found their rest here."', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'lumberjack_work', label: 'Work as lumberjack', intent: 'work', outcome: 'The forests need clearing. Hard work but honest pay.', stat_deltas: { health: -15, gold: 35, strength: 3 }, hours_passed: 6 },
      { id: 'dark_wood', label: 'Explore the Dark Wood', intent: 'stealth', outcome: 'The deep forest holds secrets and shadows.', stat_deltas: { corruption: 5 }, hours_passed: 2 },
      { id: 'graveyard_secret', label: 'Investigate the cemetery', intent: 'stealth', outcome: 'Old graves hold old secrets... and older restless spirits.', stat_deltas: { corruption: 5, skills: { magic: 2 } }, hours_passed: 2 }
    ]
  },
  haemars_shame: {
    id: 'haemars_shame',
    name: "Haemar's Shame",
    type: 'dungeon',
    region: 'falkreath_hold',
    description: "A cavern complex hidden in the mountains, Haemar's Shame is where a vampire clan has made their lair. The cave is filled with the remnants of victims and the heavy scent of death.",
    atmosphere: 'Dark, bloody, ancient, horrifying',
    actions: [
      { id: 'vampire_fight', label: 'Fight the vampires', intent: 'combat', outcome: 'The bloodsuckers attack! You battle through the cavern.', stat_deltas: { health: -25, skills: { combat: 8, one_handed: 3 }, corruption: 3 }, hours_passed: 3 },
      { id: 'explore_cavern', label: 'Explore the cavern', intent: 'work', outcome: 'Skeletons and remnants of victims line the walls.', stat_deltas: { gold: 60, corruption: 5 }, hours_passed: 2 },
      { id: 'find_clan_leader', label: 'Find the clan leader', intent: 'combat', outcome: 'The master vampire awaits in the deepest chamber.', stat_deltas: { health: -30, skills: { combat: 10 } }, hours_passed: 2 },
      { id: 'negotiate_vampire', label: 'Negotiate with vampires', intent: 'social', outcome: '"You dare speak to us? Perhaps we can make a deal..."', stat_deltas: { corruption: 10, relationship: 5 }, hours_passed: 1 },
      { id: 'blood_potion', label: 'Take a blood potion', intent: 'stealth', outcome: 'The vampires offer their dark brews. Power awaits.', stat_deltas: { corruption: 15, skills: { magic: 5 } }, hours_passed: 1 },
      { id: 'sanctuary_request', label: 'Ask for sanctuary', intent: 'willpower', outcome: 'You could join them... but at what cost?', stat_deltas: { corruption: 20 }, hours_passed: 1 },
      { id: 'escape_attempt', label: 'Attempt escape', intent: 'stealth', outcome: 'You fight your way out, the vampires close behind.', stat_deltas: { health: -15, skills: { stealth: 5 } }, hours_passed: 2 },
      { id: 'holy_water', label: 'Bring holy water', intent: 'work', outcome: 'The water burns them! They recoil from your attack.', stat_deltas: { health: -10, skills: { combat: 5 }, gold: -20 }, hours_passed: 2 }
    ]
  },
  lakeview: {
    id: 'lakeview',
    name: 'Lakeview Manor',
    type: 'player_house',
    region: 'falkreath_hold',
    description: "A piece of land by the lake perfect for building a home. The peaceful setting offers fishing, hunting, and a quiet life away from the troubles of Skyrim.",
    atmosphere: 'Peaceful, scenic, private, homey',
    actions: [
      { id: 'build_house', label: 'Build a house', intent: 'work', outcome: 'You begin construction on your new home.', stat_deltas: { gold: -500, strength: 5 }, hours_passed: 8 },
      { id: 'fish_lake', label: 'Fish in the lake', intent: 'work', outcome: 'The waters are rich with salmon and trout.', stat_deltas: { health: 5, gold: 25, skills: { survival: 2 } }, hours_passed: 3 },
      { id: 'hunt_deer', label: 'Hunt deer', intent: 'work', outcome: 'The forests around the manor are full of game.', stat_deltas: { health: -5, gold: 35, skills: { marksman: 3 } }, hours_passed: 4 },
      { id: 'garden_plot', label: 'Tend the garden', intent: 'work', outcome: 'You grow vegetables and herbs for sustenance.', stat_deltas: { health: 10, gold: 15, skills: { survival: 2 } }, hours_passed: 3 },
      { id: 'peaceful_meditation', label: 'Meditate peacefully', intent: 'willpower', outcome: 'The quiet helps you find inner peace.', stat_deltas: { willpower: 10, exhaustion: -15 }, hours_passed: 2 },
      { id: 'defend_home', label: 'Defend the property', intent: 'combat', outcome: 'Bandits sometimes attack! You drive them off.', stat_deltas: { health: -15, skills: { combat: 5 }, relationship: 3 }, hours_passed: 2 },
      { id: 'invite_guests', label: 'Invite guests', intent: 'social', outcome: 'You host friends at your home. A true gathering.', stat_deltas: { relationship: 10, gold: -30 }, hours_passed: 4 },
      { id: 'watch_sunset', label: 'Watch the sunset', intent: 'willpower', outcome: 'The view over the lake is breathtaking. You feel alive.', stat_deltas: { willpower: 5, stress: -10 }, hours_passed: 1 }
    ]
  },

  // THE REACH
  trolhetta: {
    id: 'trolhetta',
    name: 'Trolhetta',
    type: 'dungeon',
    region: 'the_reach',
    description: "The ancient Nordic crypt of Trolhetta holds the remains of King Olaf and his warriors. The burial ground is guarded by ghosts and frost atronachs, and the deep tombs hold terrible secrets.",
    atmosphere: 'Ancient, cold, royal, haunted',
    actions: [
      { id: 'explore_tomb', label: 'Explore the tomb', intent: 'work', outcome: 'The ancient burial chamber is frozen in time.', stat_deltas: { skills: { history: 4 }, gold: 50 }, hours_passed: 3 },
      { id: 'fight_ghost', label: 'Fight the ghosts', intent: 'combat', outcome: "Olaf's spirit guards his rest. You battle the undead.", stat_deltas: { health: -20, skills: { combat: 6, one_handed: 3 } }, hours_passed: 2 },
      { id: 'read_stone', label: 'Read the stone tablets', intent: 'work', outcome: "The dragon language tells of Olaf's rule.", stat_deltas: { skills: { history: 5 } }, hours_passed: 2 },
      { id: 'frost_trap', label: 'Disarm frost traps', intent: 'work', outcome: 'The ancient wards still function. Careful navigation required.', stat_deltas: { skills: { lockpicking: 4 } }, hours_passed: 2 },
      { id: 'king_olf_deal', label: 'Make deal with Olaf', intent: 'willpower', outcome: 'The ghost will share knowledge for proper respect.', stat_deltas: { skills: { magic: 5, history: 3 }, corruption: 3 }, hours_passed: 1 },
      { id: 'deep_tomb', label: 'Find the deep tomb', intent: 'stealth', outcome: 'Deeper down, even darker secrets wait.', stat_deltas: { corruption: 8, skills: { lockpicking: 3 } }, hours_passed: 3 },
      { id: 'ancient_sword', label: 'Find the ancient sword', intent: 'work', outcome: "Olaf's blade still hangs above his grave. Powerful.", stat_deltas: { gold: 150 }, hours_passed: 2 },
      { id: 'escape_tomb', label: 'Escape the collapsing tomb', intent: 'stealth', outcome: 'The tomb begins to crumble! You race for the exit.', stat_deltas: { health: -15, skills: { athletics: 5 } }, hours_passed: 2 }
    ]
  },
  shroud_hearth_barrow: {
    id: 'shroud_hearth_barrow',
    name: 'Shroud Hearth Barrow',
    type: 'dungeon',
    region: 'falkreath_hold',
    description: "An ancient Nordic burial mound near Falkreath, Shroud Hearth Barrow is home to a powerful draugr and the resting place of an ancient king. The whispers of the dead fill the darkness.",
    atmosphere: 'Ancient, spiritual, dangerous, mysterious',
    actions: [
      { id: 'explore_barrow', label: 'Explore the barrow', intent: 'work', outcome: 'The ancient tomb is filled with puzzles and dangers.', stat_deltas: { skills: { lockpicking: 4 }, gold: 40 }, hours_passed: 3 },
      { id: 'draugr_battle', label: 'Battle the draugr', intent: 'combat', outcome: 'The dead rise to guard their king! You fight through.', stat_deltas: { health: -20, skills: { combat: 6, one_handed: 3 } }, hours_passed: 2 },
      { id: 'king_discovered', label: 'Discover the king', intent: 'work', outcome: 'An ancient ruler waits in slumber. Do you wake him?', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'solve_puzzle', label: 'Solve the puzzle', intent: 'work', outcome: 'Ancient locks protect the deepest chambers.', stat_deltas: { skills: { lockpicking: 6 } }, hours_passed: 2 },
      { id: 'speak_dead', label: 'Speak with the dead', intent: 'willpower', outcome: 'The spirits have messages for the living.', stat_deltas: { skills: { magic: 4 }, corruption: 3 }, hours_passed: 1 },
      { id: 'take_treasure', label: 'Take the treasure', intent: 'stealth', outcome: 'Gold and artifacts line the burial chamber.', stat_deltas: { gold: 100, corruption: 5 }, hours_passed: 2 },
      { id: 'escape_draugr', label: 'Escape the awakened', intent: 'stealth', outcome: 'The entire barrow wakes! You run for the exit.', stat_deltas: { health: -15, skills: { stealth: 5 } }, hours_passed: 2 },
      { id: 'satisfy_spirit', label: 'Satisfy the spirit', intent: 'willpower', outcome: 'You give proper respect. The king accepts your tribute.', stat_deltas: { willpower: 10, relationship: 5 }, hours_passed: 1 }
    ]
  },
  soul_cairn_entrance: {
    id: 'soul_cairn_entrance',
    name: 'Soul Cairn Entrance',
    type: 'portal',
    region: 'soul_cairn',
    description: "A mysterious portal to the Soul Cairn, the realm of the Ideal Masters. The air around the entrance crackles with necromantic energy, and those who enter may not return unchanged.",
    atmosphere: 'Otherworldly, necromantic, unsettling, powerful',
    actions: [
      { id: 'enter_cairn', label: 'Enter the Soul Cairn', intent: 'work', outcome: 'You step through the portal into the void between worlds.', stat_deltas: { corruption: 10, skills: { magic: 5 } }, hours_passed: 2 },
      { id: 'summon_master', label: 'Summon an Ideal Master', intent: 'work', outcome: 'The ancient beings answer your call... for a price.', stat_deltas: { corruption: 15, skills: { magic: 8 } }, hours_passed: 2 },
      { id: 'soul_gem_hunt', label: 'Hunt for soul gems', intent: 'work', outcome: 'The Cairn is filled with trapped souls.', stat_deltas: { gold: 80, skills: { alchemy: 3 }, corruption: 5 }, hours_passed: 3 },
      { id: 'negotiate_giants', label: 'Negotiate with the giants', intent: 'social', outcome: 'The Soul Cairn giants guard the perimeter. They listen...', stat_deltas: { relationship: 5, corruption: 5 }, hours_passed: 1 },
      { id: 'dark_bargain', label: 'Make a dark bargain', intent: 'stealth', outcome: 'Power awaits those willing to trade their soul.', stat_deltas: { corruption: 25, skills: { magic: 10 } }, hours_passed: 2 },
      { id: 'escape_cairn', label: 'Escape the Cairn', intent: 'stealth', outcome: 'Finding the exit is difficult. The void shifts around you.', stat_deltas: { health: -20, skills: { magic: 4 } }, hours_passed: 3 },
      { id: 'perfect_soul', label: 'Capture a perfect soul', intent: 'work', outcome: 'You find a soul gem filled with pure essence.', stat_deltas: { gold: 200, corruption: 8 }, hours_passed: 2 },
      { id: 'resist_temptation', label: 'Resist temptation', intent: 'willpower', outcome: 'The Cairn offers power. You refuse its whispers.', stat_deltas: { willpower: 15, corruption: -10 }, hours_passed: 1 }
    ]
  },
  forelhost: {
    id: 'forelhost',
    name: 'Forelhost',
    type: 'dungeon',
    region: 'the_reach',
    description: "The ancient fortress of the Reachmen holds dark secrets. The last survivors of a defeated clan committed mass suicide here rather than surrender. Their spirits still guard the walls.",
    atmosphere: 'Haunted, tragic, fortified, dark',
    actions: [
      { id: 'explore_fortress', label: 'Explore the fortress', intent: 'work', outcome: 'The old walls still stand, though the defenders are long dead.', stat_deltas: { skills: { history: 3 }, gold: 40 }, hours_passed: 2 },
      { id: 'fight_spectral', label: 'Fight spectral defenders', intent: 'combat', outcome: 'The ghosts of the Reachmen attack! They defend their home.', stat_deltas: { health: -20, skills: { combat: 6 } }, hours_passed: 2 },
      { id: 'read_kingdom', label: 'Read kingdom records', intent: 'work', outcome: "The scroll speaks of the last king's desperate choice.", stat_deltas: { skills: { history: 5 } }, hours_passed: 2 },
      { id: 'find_refuge', label: 'Find the secret refuge', intent: 'stealth', outcome: 'A hidden area holds the clan\'s remaining treasure.', stat_deltas: { gold: 80, skills: { lockpicking: 3 } }, hours_passed: 2 },
      { id: 'respect_dead', label: 'Show respect to the dead', intent: 'willpower', outcome: 'You honor their memory. The ghosts calm.', stat_deltas: { willpower: 8, relationship: 3 }, hours_passed: 1 },
      { id: 'death_altar', label: 'Investigate the death altar', intent: 'stealth', outcome: 'They chose death over surrender. Their resolve is still here.', stat_deltas: { corruption: 8, skills: { magic: 4 } }, hours_passed: 2 },
      { id: 'reachmen_peace', label: 'Seek peace with Reachmen', intent: 'social', outcome: 'The spirits may be reasoned with, after a fashion.', stat_deltas: { relationship: 5, corruption: 3 }, hours_passed: 1 },
      { id: 'escape_curse', label: 'Escape the curse', intent: 'willpower', outcome: 'The fortress tries to claim you. You break free.', stat_deltas: { willpower: 10, health: -10 }, hours_passed: 2 }
    ]
  },

  // WHITERUN HOLD / NORDIC WILDERNESS
  yngvild: {
    id: 'yngvild',
    name: 'Yngvild',
    type: 'dungeon',
    region: 'whiterun_hold',
    description: "An ancient Nord burial ship that crashed in the mountains. The frozen warrior within still guards her treasures, and the ice has preserved her for ages. A unique frozen grave.",
    atmosphere: 'Frozen, ancient, royal, isolated',
    actions: [
      { id: 'explore_ship', label: 'Explore the ship', intent: 'work', outcome: 'The dragon claw unlocks the ancient vessel.', stat_deltas: { skills: { lockpicking: 4 }, gold: 50 }, hours_passed: 2 },
      { id: 'fight_ice', label: 'Fight the frozen warrior', intent: 'combat', outcome: 'Yngvild wakes! She fights with frozen fury.', stat_deltas: { health: -25, skills: { combat: 8, one_handed: 4 } }, hours_passed: 2 },
      { id: 'ice_crypt', label: 'Explore the ice crypt', intent: 'work', outcome: 'The cold preserves all within. It is eerie and beautiful.', stat_deltas: { skills: { history: 4 } }, hours_passed: 2 },
      { id: 'take_crown', label: 'Take the crown', intent: 'stealth', outcome: "The queen's crown lies waiting. Worth a fortune.", stat_deltas: { gold: 150 }, hours_passed: 1 },
      { id: 'speak_ice', label: 'Speak with the ice spirit', intent: 'willpower', outcome: 'Yngvild speaks of her ancient queen. The words are cold.', stat_deltas: { skills: { magic: 3 } }, hours_passed: 1 },
      { id: 'ice_throne', label: 'Sit on the ice throne', intent: 'willpower', outcome: 'The cold does not bite. It welcomes you.', stat_deltas: { willpower: 8, corruption: 3 }, hours_passed: 1 },
      { id: 'frozen_treasure', label: 'Find frozen treasure', intent: 'work', outcome: 'Weapons and gold lie in the ice, preserved.', stat_deltas: { gold: 100 }, hours_passed: 2 },
      { id: 'escape_cold', label: 'Escape the cold', intent: 'stealth', outcome: 'The mountain is treacherous. You navigate carefully.', stat_deltas: { health: -10, skills: { survival: 4 } }, hours_passed: 3 }
    ]
  },
  labyrinthian: {
    id: 'labyrinthian',
    name: 'Labyrinthian',
    type: 'dungeon',
    region: 'hjaalmarch',
    description: "The ancient ruined city was once the seat of the Arch-Mage of Skyrim. Now it holds frost trolls, draugr, and the powerful staff of Magnus. The magic here is still strong.",
    atmosphere: 'Arcane, ruined, dangerous, powerful',
    actions: [
      { id: 'explore_ruins', label: 'Explore the ruins', intent: 'work', outcome: 'The ancient college is a maze of collapsed halls.', stat_deltas: { skills: { magic: 4, history: 3 }, gold: 50 }, hours_passed: 3 },
      { id: 'frost_troll', label: 'Fight the frost troll', intent: 'combat', outcome: 'A massive troll guards the inner chambers!', stat_deltas: { health: -30, skills: { combat: 10, two_handed: 4 } }, hours_passed: 2 },
      { id: 'staff_magnus', label: 'Find the Staff of Magnus', intent: 'work', outcome: 'The legendary staff is here. Its power is immense.', stat_deltas: { skills: { magic: 10 }, gold: 200 }, hours_passed: 2 },
      { id: 'maze_wrong', label: 'Navigate the maze', intent: 'work', outcome: 'The ruins are disorienting. You find your way.', stat_deltas: { skills: { survival: 4 } }, hours_passed: 3 },
      { id: 'ghost_archmage', label: 'Meet the ghost Arch-Mage', intent: 'willpower', outcome: 'The spectral mage has much to teach.', stat_deltas: { skills: { magic: 8 }, corruption: 5 }, hours_passed: 2 },
      { id: 'forbidden_library', label: 'Visit the forbidden library', intent: 'stealth', outcome: 'Books of forbidden magic line the shelves.', stat_deltas: { corruption: 10, skills: { magic: 6 } }, hours_passed: 2 },
      { id: 'dragon_claw_puzzle', label: 'Solve the dragon claw puzzle', intent: 'work', outcome: 'The ancient puzzle protects the deepest secrets.', stat_deltas: { skills: { lockpicking: 6 } }, hours_passed: 2 },
      { id: 'escape_labyrinth', label: 'Escape the labyrinth', intent: 'stealth', outcome: 'The ruins try to trap you. You find the exit.', stat_deltas: { health: -15, skills: { stealth: 5 } }, hours_passed: 3 }
    ]
  },

  // HJAALMARCH & SOLITUDE AREA
  katla_farm: {
    id: 'katla_farm',
    name: 'Katla Farm',
    type: 'village',
    region: 'hjaalmarch',
    description: "A large farm near Solitude, Katla Farm grows grain and raises horses. The farmers are tough, and the area has seen battles during the civil war. The nearby standing stones add mystery.",
    atmosphere: 'Rural, hard-working, strategic, ancient',
    actions: [
      { id: 'harvest_grain', label: 'Help harvest grain', intent: 'work', outcome: 'The harvest is hard work but rewarding.', stat_deltas: { health: -10, gold: 30, strength: 3 }, hours_passed: 6 },
      { id: 'horse_trade', label: 'Trade horses', intent: 'work', outcome: 'The farm breeds fine horses for war and travel.', stat_deltas: { gold: -100 }, hours_passed: 1 },
      { id: 'standing_stone', label: 'Visit the standing stones', intent: 'willpower', outcome: 'The ancient markers hold power over destiny.', stat_deltas: { willpower: 8, skills: { magic: 2 } }, hours_passed: 1 },
      { id: 'farm_defense', label: 'Defend the farm', intent: 'combat', outcome: 'Stormcloaks or bandits may attack. You hold the line.', stat_deltas: { health: -15, skills: { combat: 5 }, relationship: 5 }, hours_passed: 2 },
      { id: 'local_gossip', label: 'Hear local gossip', intent: 'social', outcome: '"The war touches everything. Even here."', stat_deltas: { relationship: 2 }, hours_passed: 1 },
      { id: 'cook_meal', label: 'Help cook a meal', intent: 'neutral', outcome: 'Fresh bread and stew after a hard day.', stat_deltas: { health: 10, stress: -5 }, hours_passed: 2 },
      { id: 'war_talk', label: 'Discuss the war', intent: 'social', outcome: 'The farmers have opinions on Stormcloaks and Imperials.', stat_deltas: { skills: { speech: 2 }, relationship: 2 }, hours_passed: 2 },
      { id: 'secret_passage', label: 'Find the secret passage', intent: 'stealth', outcome: 'Old tunnels lead from the farm to hidden places.', stat_deltas: { corruption: 3, skills: { stealth: 3 } }, hours_passed: 2 }
    ]
  },
  solitude_sawmill: {
    id: 'solitude_sawmill',
    name: 'Solitude Sawmill',
    type: 'village',
    region: 'haafingar',
    description: "The sawmill provides lumber for the capital city. The workers are busy, the blades are loud, and the logs float down the river. The Blue Palace looms above.",
    atmosphere: 'Industrial, loud, useful, supervised',
    actions: [
      { id: 'saw_logs', label: 'Work the sawmill', intent: 'work', outcome: 'The work is loud but pays well.', stat_deltas: { health: -15, gold: 40, strength: 4 }, hours_passed: 6 },
      { id: 'timber_trade', label: 'Trade timber', intent: 'work', outcome: 'The lumber is sold directly to Solitude.', stat_deltas: { gold: 60 }, hours_passed: 2 },
      { id: 'river_work', label: 'Work the river', intent: 'work', outcome: 'Floats logs downstream. Dangerous but essential.', stat_deltas: { health: -10, skills: { survival: 3 }, gold: 35 }, hours_passed: 4 },
      { id: 'capital_view', label: 'View the capital', intent: 'willpower', outcome: 'Solitude is beautiful from here. The palace gleams.', stat_deltas: { willpower: 3 }, hours_passed: 1 },
      { id: 'soldier_chat', label: 'Chat with soldiers', intent: 'social', outcome: 'Imperial soldiers pass through on their way to duty.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'log_camp', label: 'Rest at logging camp', intent: 'neutral', outcome: 'The camp is rough but the workers are friendly.', stat_deltas: { health: 10, exhaustion: -20, gold: -5 }, hours_passed: 8 },
      { id: 'log_barge', label: 'Load the barge', intent: 'work', outcome: 'Heavy work loading timber onto barges for transport.', stat_deltas: { health: -10, strength: 3, gold: 25 }, hours_passed: 4 },
      { id: 'imperial_delivery', label: 'Make imperial delivery', intent: 'work', outcome: 'The Legion needs lumber. You help with the order.', stat_deltas: { gold: 50, relationship: 5 }, hours_passed: 3 }
    ]
  },

  // FALKREATH HOLD
  falkreath_city: {
    id: 'falkreath_city',
    name: 'Falkreath',
    type: 'city',
    region: 'falkreath_hold',
    description: 'The gateway to the west, Falkreath is a small but strategic city. The Jarl rules from Dead Man's Drink, and the forest surrounds the settlement on all sides. The dead are buried in the great cemetery.',
    atmosphere: 'Forested, peaceful, haunted, strategic',
    actions: [
      { id: 'jarl_meeting', label: 'Meet the Jarl', intent: 'work', outcome: 'The Jarl of Falkreath has problems with bandits.', stat_deltas: { relationship: 3 }, hours_passed: 1 },
      { id: 'dead_drink', label: 'Visit Dead Man\'s Drink', intent: 'social', outcome: 'The tavern serves the living and remembers the dead.', stat_deltas: { stress: -5, gold: -5 }, hours_passed: 1 },
      { id: 'cemetery_walk', label: 'Walk the cemetery', intent: 'willpower', outcome: 'The old stones remember many Nordic warriors.', stat_deltas: { willpower: 3, skills: { history: 2 } }, hours_passed: 2 },
      { id: 'forest_hunt', label: 'Hunt in the forest', intent: 'work', outcome: 'The woods are full of game and danger.', stat_deltas: { skills: { marksman: 4 }, gold: 30, health: -5 }, hours_passed: 4 },
      { id: 'lumber_mill', label: 'Work at the lumber mill', intent: 'work', outcome: 'The mill provides timber for the region.', stat_deltas: { health: -10, gold: 30, strength: 2 }, hours_passed: 4 },
      { id: 'bandit_problem', label: 'Address bandit problem', intent: 'combat', outcome: 'Bandits plague the roads. You help clear them.', stat_deltas: { skills: { combat: 5 }, relationship: 5 }, hours_passed: 3 },
      { id: 'local_story', label: 'Hear local stories', intent: 'social', outcome: 'The old-timers know tales of the forest.', stat_deltas: { skills: { history: 2 } }, hours_passed: 1 },
      { id: 'jail_visit', label: 'Visit the jail', intent: 'social', outcome: 'The small prison holds local troublemakers.', stat_deltas: { relationship: 1 }, hours_passed: 1 }
    ]
  },
  haemar_shame: {
    id: 'haemar_shame',
    name: 'Haemar\'s Shame',
    type: 'dungeon',
    region: 'falkreath_hold',
    description: 'A hidden cave behind a waterfall, home to a vampire clan. The cave is dark, damp, and filled with the smell of old blood. The vampires have lived here for centuries.',
    atmosphere: 'Dark, bloody, ancient, dangerous',
    actions: [
      { id: 'vampire_cave', label: 'Enter the cave', intent: 'stealth', outcome: 'The darkness hides many dangers.', stat_deltas: { corruption: 3, skills: { stealth: 2 } }, hours_passed: 1 },
      { id: 'vampire_encounter', label: 'Meet the vampires', intent: 'combat', outcome: 'The bloodsuckers do not take kindly to intruders!', stat_deltas: { health: -20, skills: { combat: 5 }, corruption: 8 }, hours_passed: 2 },
      { id: 'blood_offering', label: 'Offer blood', intent: 'willpower', outcome: 'The vampires offer power in exchange for blood.', stat_deltas: { health: -15, corruption: 10, skills: { magic: 3 } }, hours_passed: 1 },
      { id: 'hidden_treasure', label: 'Find hidden treasure', intent: 'work', outcome: 'Ancient treasures lie in the deep caves.', stat_deltas: { gold: 80, corruption: 5 }, hours_passed: 3 },
      { id: 'vampire_lore', label: 'Learn vampire lore', intent: 'work', outcome: 'The clan has knowledge of the old blood.', stat_deltas: { skills: { history: 3 }, corruption: 5 }, hours_passed: 2 },
      { id: 'waterfall_meditate', label: 'Meditate at waterfall', intent: 'willpower', outcome: 'The sound of water clears the mind.', stat_deltas: { willpower: 5, exhaustion: -10 }, hours_passed: 2 },
      { id: 'escape_pursuit', label: 'Escape vampire pursuit', intent: 'stealth', outcome: 'You flee as the clan awakens to chase you.', stat_deltas: { health: -10, skills: { stealth: 6 } }, hours_passed: 2 },
      { id: 'join_clan', label: 'Request to join', intent: 'willpower', outcome: 'The vampires consider your offer...', stat_deltas: { corruption: 15, relationship: 10 }, hours_passed: 1 }
    ]
  },
  lakeview_manor: {
    id: 'lakeview_manor',
    name: 'Lakeview Manor',
    type: 'player_home',
    region: 'falkreath_hold',
    description: 'A plot of land near Lake Ilinalta, available for purchase and development. The foundation is laid, and a home can be built. The view of the lake is spectacular.',
    atmosphere: 'Peaceful, developable, scenic, yours',
    actions: [
      { id: 'build_house', label: 'Begin construction', intent: 'work', outcome: 'You lay the foundation of your home.', stat_deltas: { gold: -200, relationship: 5 }, hours_passed: 8 },
      { id: 'farm_land', label: 'Start a farm', intent: 'work', outcome: 'The land is fertile. Crops grow well.', stat_deltas: { gold: 30, skills: { survival: 2 } }, hours_passed: 4 },
      { id: 'lake_view', label: 'Enjoy the view', intent: 'willpower', outcome: 'The lake reflects the mountains beautifully.', stat_deltas: { willpower: 5, stress: -10 }, hours_passed: 1 },
      { id: 'fishing', label: 'Fish the lake', intent: 'work', outcome: 'The lake is full of fish.', stat_deltas: { gold: 20, skills: { survival: 2 } }, hours_passed: 2 },
      { id: 'defense_work', label: 'Build defenses', intent: 'work', outcome: 'Walls and towers keep bandits away.', stat_deltas: { gold: -100, skills: { crafting: 3 } }, hours_passed: 6 },
      { id: 'garden_plant', label: 'Plant a garden', intent: 'work', outcome: 'Herbs and vegetables grow in the plot.', stat_deltas: { skills: { alchemy: 2 }, gold: 15 }, hours_passed: 3 },
      { id: 'stables_build', label: 'Build stables', intent: 'work', outcome: 'A place for horses and other mounts.', stat_deltas: { gold: -80, relationship: 3 }, hours_passed: 4 },
      { id: 'home_safe', label: 'Feel at home', intent: 'willpower', outcome: 'This is yours. A true place to belong.', stat_deltas: { willpower: 15 }, hours_passed: 1 }
    ]
  },

  // THE RIFT ADDITIONS
  trolhetta: {
    id: 'trolhetta',
    name: 'Riften Ratway',
    type: 'dungeon',
    region: 'the_rift',
    description: 'The tunnels beneath Riften are a maze of passages and danger. The ratway connects to the Ragged Flagon and serves as a hiding place for the desperate and criminal.',
    atmosphere: 'Dark, cramped, dangerous, connecting',
    actions: [
      { id: 'navigate_tunnels', label: 'Navigate the tunnels', intent: 'stealth', outcome: 'The passages twist and turn. Getting lost is easy.', stat_deltas: { skills: { stealth: 4 } }, hours_passed: 2 },
      { id: 'rat_fight', label: 'Fight the rats', intent: 'combat', outcome: 'The tunnels are full of aggressive vermin.', stat_deltas: { health: -10, skills: { combat: 3 } }, hours_passed: 1 },
      { id: 'hidden_passage', label: 'Find hidden passages', intent: 'stealth', outcome: 'Secret ways connect to hidden places.', stat_deltas: { corruption: 3, skills: { lockpicking: 2 } }, hours_passed: 2 },
      { id: 'thieves_meet', label: 'Meet thieves', intent: 'social', outcome: 'The underground has its own society.', stat_deltas: { corruption: 5, relationship: 3 }, hours_passed: 1 },
      { id: 'ancient_cache', label: 'Find ancient cache', intent: 'work', outcome: 'Old smugglers left goods in the deep tunnels.', stat_deltas: { gold: 50, corruption: 3 }, hours_passed: 3 },
      { id: 'escape_pursuer', label: 'Escape a pursuer', intent: 'stealth', outcome: 'Someone is hunting you in the dark.', stat_deltas: { skills: { stealth: 5 }, health: -5 }, hours_passed: 1 },
      { id: 'ratway_trade', label: 'Trade in darkness', intent: 'work', outcome: 'Illegal goods change hands in the dark.', stat_deltas: { gold: 60, corruption: 8 }, hours_passed: 2 },
      { id: 'secret_exit', label: 'Find secret exit', intent: 'stealth', outcome: 'An exit leads to unexpected places.', stat_deltas: { skills: { stealth: 3 } }, hours_passed: 1 }
    ]
  },
  shroud_hearth_barrow: {
    id: 'shroud_hearth_barrow',
    name: 'Shroud Hearth Barrow',
    type: 'dungeon',
    region: 'the_rift',
    description: 'An ancient Nordic barrow where the dead are said to rise. The locals avoid it, but treasure hunters and adventurers cannot resist its call. Something stirs in the darkness.',
    atmosphere: 'Ancient, undead, treasure-filled, dangerous',
    actions: [
      { id: 'enter_barrow', label: 'Enter the barrow', intent: 'work', outcome: 'The ancient door creaks open...', stat_deltas: { corruption: 2 }, hours_passed: 1 },
      { id: 'skeleton_fight', label: 'Fight skeletons', intent: 'combat', outcome: 'The ancient dead do not rest easily.', stat_deltas: { health: -15, skills: { combat: 4 } }, hours_passed: 2 },
      { id: 'ancient_treasure', label: 'Find ancient treasure', intent: 'work', outcome: 'Weapons and gold from the Dragon War.', stat_deltas: { gold: 80, corruption: 3 }, hours_passed: 3 },
      { id: 'word_of_power', label: 'Find Word of Power', intent: 'work', outcome: 'A dragon shout is etched on the walls.', stat_deltas: { skills: { shouts: 5 }, corruption: 2 }, hours_passed: 2 },
      { id: 'corpse_examine', label: 'Examine the dead', intent: 'work', outcome: 'The dead have stories to tell.', stat_deltas: { skills: { history: 3 } }, hours_passed: 1 },
      { id: 'draugr_escape', label: 'Escape a Draugr', intent: 'combat', outcome: 'The ancient guardian is formidable!', stat_deltas: { health: -20, skills: { combat: 6 } }, hours_passed: 2 },
      { id: 'crypt_explore', label: 'Explore the crypt', intent: 'work', outcome: 'Deeper areas hold greater dangers.', stat_deltas: { corruption: 5, gold: 40 }, hours_passed: 3 },
      { id: 'death_peace', label: 'Find death\'s peace', intent: 'willpower', outcome: 'The barrow has a strange calm about it.', stat_deltas: { willpower: 5 }, hours_passed: 1 }
    ]
  },

  // THE PALE ADDITIONS
  soul_cairn_entrance: {
    id: 'soul_cairn_entrance',
    name: 'Soul Cairn Portal',
    type: 'dungeon',
    region: 'the_pale',
    description: 'A portal to the Soul Cairn, a plane of existence where the souls of the dead are trapped. The portal is guarded by ancient magic and those who seek the power of death itself.',
    atmosphere: 'Ethereal, deathly, magical, forbidden',
    actions: [
      { id: 'enter_portal', label: 'Enter the portal', intent: 'work', outcome: 'You step into the realm of death.', stat_deltas: { corruption: 10, skills: { magic: 3 } }, hours_passed: 1 },
      { id: 'soul_hunt', label: 'Hunt for souls', intent: 'work', outcome: 'The trapped souls can be harvested.', stat_deltas: { corruption: 15, skills: { conjuration: 5 }, gold: 50 }, hours_passed: 4 },
      { id: 'bone_collector', label: 'Collect bones', intent: 'work', outcome: 'The dead leave their remains behind.', stat_deltas: { gold: 40, corruption: 5 }, hours_passed: 2 },
      { id: 'spirit_talk', label: 'Talk to a spirit', intent: 'social', outcome: 'The souls remember their lives...', stat_deltas: { skills: { history: 3 }, corruption: 3 }, hours_passed: 2 },
      { id: 'dremora_bargain', label: 'Make a Dremora bargain', intent: 'stealth', outcome: 'The Daedra offer power for souls.', stat_deltas: { corruption: 20, skills: { magic: 8 } }, hours_passed: 2 },
      { id: 'guardian_battle', label: 'Battle the guardian', intent: 'combat', outcome: 'A powerful entity guards this place.', stat_deltas: { health: -25, skills: { combat: 8 } }, hours_passed: 3 },
      { id: 'escape_cairn', label: 'Escape the Cairn', intent: 'stealth', outcome: 'Getting out is harder than getting in.', stat_deltas: { skills: { stealth: 6 }, corruption: -5 }, hours_passed: 2 },
      { id: 'become_lord', label: 'Become a Soul Lord', intent: 'willpower', outcome: 'Power over death itself is possible...', stat_deltas: { corruption: 25, willpower: 10 }, hours_passed: 1 }
    ]
  },
  forelhost: {
    id: 'forelhost',
    name: 'Forelhost',
    type: 'dungeon',
    region: 'the_pale',
    description: 'A forgotten fort where the last Stormcloak soldiers made their last stand. The dead still guard the walls, and the treasure of King Logrolf awaits those brave enough to claim it.',
    atmosphere: 'Historic, tragic, defended, rewarding',
    actions: [
      { id: 'explore_fort', label: 'Explore the fort', intent: 'work', outcome: 'The old walls still stand strong.', stat_deltas: { skills: { history: 2 } }, hours_passed: 2 },
      { id: 'stormcloak_dead', label: 'Face the dead', intent: 'combat', outcome: 'The ghostly soldiers fight still!', stat_deltas: { health: -15, skills: { combat: 5 } }, hours_passed: 2 },
      { id: 'king_tomb', label: 'Find the King\'s tomb', intent: 'work', outcome: 'The legendary treasure is here.', stat_deltas: { gold: 100, corruption: 5 }, hours_passed: 3 },
      { id: 'sword_claim', label: 'Claim the sword', intent: 'work', outcome: 'A blade of ancient make awaits.', stat_deltas: { gold: 80, corruption: 3 }, hours_passed: 1 },
      { id: 'read_inscription', label: 'Read the inscription', intent: 'work', outcome: 'The old words speak of loyalty unto death.', stat_deltas: { skills: { history: 4 } }, hours_passed: 1 },
      { id: 'refuge_tragedy', label: 'Hear the tragedy', intent: 'social', outcome: 'The tale of the last stand moves you.', stat_deltas: { willpower: 5 }, hours_passed: 1 },
      { id: 'crypt_key', label: 'Find the crypt key', intent: 'work', outcome: 'The key is hidden in the guard room.', stat_deltas: { skills: { lockpicking: 3 } }, hours_passed: 2 },
      { id: 'swear_oath', label: 'Swear an oath', intent: 'willpower', outcome: 'You honor the fallen with your word.', stat_deltas: { willpower: 10, relationship: 5 }, hours_passed: 1 }
    ]
  },

  // WINTERHOLD ADDITIONS
  yngvild: {
    id: 'yngvild',
    name: 'Yngvild',
    type: 'dungeon',
    region: 'winterhold',
    description: 'An ancient crypt of a Nordic queen, now overrun by ice wraiths. The queen\'s spirit still guards her treasure, and the cold preserves everything in eternal winter.',
    atmosphere: 'Frozen, royal, haunted, dangerous',
    actions: [
      { id: 'enter_crypt', label: 'Enter the crypt', intent: 'work', outcome: 'The frozen door refuses most intruders.', stat_deltas: { corruption: 2 }, hours_passed: 1 },
      { id: 'ice_wraith_fight', label: 'Fight ice wraiths', intent: 'combat', outcome: 'The spirits are deadly cold and sharp.', stat_deltas: { health: -20, skills: { destruction: 4 } }, hours_passed: 2 },
      { id: 'queen_spirit', label: 'Meet the Queen', intent: 'social', outcome: 'The spirit still demands respect.', stat_deltas: { skills: { history: 3 }, corruption: 3 }, hours_passed: 1 },
      { id: 'frozen_treasure', label: 'Find frozen treasure', intent: 'work', outcome: 'Gold and gems are preserved in ice.', stat_deltas: { gold: 70, corruption: 3 }, hours_passed: 3 },
      { id: 'queen_offering', label: 'Make an offering', intent: 'willpower', outcome: 'The Queen accepts tribute...', stat_deltas: { corruption: 8, relationship: 5 }, hours_passed: 1 },
      { id: 'ice_palace_explore', label: 'Explore ice palace', intent: 'work', outcome: 'The structure is made of pure ice.', stat_deltas: { skills: { survival: 3 }, corruption: 2 }, hours_passed: 3 },
      { id: 'escape_wraith', label: 'Escape the wraith', intent: 'stealth', outcome: 'The Queen does not like thieves.', stat_deltas: { health: -10, skills: { stealth: 5 } }, hours_passed: 2 },
      { id: 'become_thane', label: 'Become Thane', intent: 'willpower', outcome: 'The Queen grants you a noble title.', stat_deltas: { willpower: 15, relationship: 10 }, hours_passed: 1 }
    ]
  },
  labyrinthian: {
    id: 'labyrinthian',
    name: 'Labyrinthian',
    type: 'dungeon',
    region: 'winterhold',
    description: 'A vast maze of ancient ruins, once a city and university. Dragons once taught magic here. Now it is a labyrinth of traps, undead, and lost knowledge.',
    atmosphere: 'Arcane, maze-like, dangerous, rewarding',
    actions: [
      { id: 'enter_maze', label: 'Enter the maze', intent: 'work', outcome: 'The entrance leads to confusion.', stat_deltas: { skills: { survival: 2 } }, hours_passed: 1 },
      { id: 'solve_puzzle', label: 'Solve the puzzle', intent: 'work', outcome: 'Ancient mechanisms block the way.', stat_deltas: { skills: { lockpicking: 4 } }, hours_passed: 2 },
      { id: 'dragon_priests', label: 'Face Dragon Priests', intent: 'combat', outcome: 'The undead mages are powerful!', stat_deltas: { health: -25, skills: { combat: 6 }, corruption: 5 }, hours_passed: 3 },
      { id: 'lost_knowledge', label: 'Find lost knowledge', intent: 'work', outcome: 'Spells and secrets from the Dragon War.', stat_deltas: { skills: { magic: 8 }, corruption: 3 }, hours_passed: 4 },
      { id: 'shout_learn', label: 'Learn a shout', intent: 'work', outcome: 'The walls teach the Way of the Voice.', stat_deltas: { skills: { shouts: 6 } }, hours_passed: 3 },
      { id: 'maze_beast', label: 'Fight the beast', intent: 'combat', outcome: 'Something lurks in the center...', stat_deltas: { health: -30, skills: { combat: 10 } }, hours_passed: 3 },
      { id: 'archmage_tomb', label: 'Find Arch-Mage tomb', intent: 'work', outcome: 'The greatest mages are buried here.', stat_deltas: { gold: 100, skills: { magic: 5 } }, hours_passed: 3 },
      { id: 'maze_master', label: 'Master the maze', intent: 'willpower', outcome: 'You find your way through all the twists.', stat_deltas: { willpower: 15, skills: { survival: 5 } }, hours_passed: 4 }
    ]
  },

  // ADULT LOCATIONS
  riften_brothel: {
    id: 'riften_brothel',
    name: 'The Pink Lantern',
    type: 'brothel',
    region: 'the_rift',
    description: "Hidden in Riften's shadows, this discreet establishment caters to those with coin and discretion. The madam, a weathered Breton with eyes that miss nothing, runs operations with an iron fist wrapped in velvet gloves. Behind silk curtains, rooms await those seeking temporary companionship.",
    atmosphere: 'Secretive, opulent, dangerous, illicit',
    actions: [
      { id: 'visit_prostitute', label: 'Visit a prostitute', intent: 'corruption', outcome: 'The madam gestures to a curtained alcove. "Choose someone to your taste."', stat_deltas: { corruption: 15, stress: -25, gold: -50 }, hours_passed: 2 },
      { id: 'work_as_prostitute', label: 'Work as a prostitute', intent: 'work', outcome: 'You earn coin using your body. The work is degrading but pays well.', stat_deltas: { gold: 75, corruption: 10, willpower: -5 }, hours_passed: 4 },
      { id: 'organize_escort', label: 'Organize an escort job', intent: 'work', outcome: 'You arrange private companionship for a wealthy client. The negotiations are delicate.', stat_deltas: { gold: 100, skills: { speech: 3 }, corruption: 5 }, hours_passed: 3 },
      { id: 'police_bribe', label: 'Bribe the city guard', intent: 'corruption', outcome: 'A few gold coins ensures the guards look elsewhere. The corruption spreads.', stat_deltas: { gold: -25, corruption: 10, relationship: 3 }, hours_passed: 1 },
      { id: 'std_risk', label: 'Risk an encounter without protection', intent: 'corruption', outcome: 'Pleasure without caution carries its own price. You hope you\'ll be alright.', stat_deltas: { health: -15, corruption: 20 }, hours_passed: 2 },
      { id: 'client_encounter', label: 'Meet a mysterious client', intent: 'social', outcome: 'A hooded figure offers gold for services. Their identity remains hidden.', stat_deltas: { gold: 100, corruption: 10 }, hours_passed: 2 },
      { id: 'madam_negotiate', label: 'Negotiate with the madam', intent: 'social', outcome: '"I run a business, dear. You want a cut, you earn it. Or I have other options..."', stat_deltas: { skills: { speech: 5 }, relationship: 5 }, hours_passed: 1 },
      { id: 'private_room', label: 'Rent a private room', intent: 'neutral', outcome: 'The room is decorated with silk and incense. Privacy is guaranteed.', stat_deltas: { stress: -30, gold: -75 }, hours_passed: 4 }
    ]
  },

  windhelm_bathhouse: {
    id: 'windhelm_bathhouse',
    name: 'The Steam Hall',
    type: 'bathhouse',
    region: 'eastmarch',
    description: "Against the cold winds of Windhelm, this public bathhouse offers warmth and relaxation. Steam rises from heated pools, and bathers of all walks soak away their cares. The atmosphere is surprisingly social for such an otherwise grim city.",
    atmosphere: 'Warm, steamy, social, revealing',
    actions: [
      { id: 'steam_room', label: 'Use the steam room', intent: 'neutral', outcome: 'The heat opens your pores and loosens your muscles. Pure relaxation.', stat_deltas: { health: 10, exhaustion: -15 }, hours_passed: 2 },
      { id: 'naked_swim', label: 'Swim in the buff', intent: 'neutral', answer: 'You strip and swim in the main pool. Freedom and warmth combined.', stat_deltas: { stress: -10, exhaustion: -10 }, hours_passed: 1 },
      { id: 'massage', label: 'Get a massage', intent: 'neutral', outcome: 'A attendant works the knots from your back. Their hands are skilled.', stat_deltas: { health: 15, gold: -15 }, hours_passed: 1 },
      { id: 'mixed_bathing', label: 'Enjoy mixed bathing', intent: 'social', outcome: 'Men and women soak together in the warm waters. Conversation flows freely.', stat_deltas: { stress: -15, relationship: 5 }, hours_passed: 2 },
      { id: 'encounter_stranger', label: 'Encounter a stranger', intent: 'social', outcome: 'A fellow bather strikes up conversation. They have interesting stories.', stat_deltas: { relationship: 3, corruption: 2 }, hours_passed: 1 },
      { id: 'heal_steam', label: 'Heal in the steam', intent: 'willpower', outcome: 'The heat and minerals rejuvenate you. Small wounds seem to mend faster.', stat_deltas: { health: 20, exhaustion: -20 }, hours_passed: 3 },
      { id: 'observe_bathers', label: 'Observe the bathers', intent: 'social', outcome: 'You watch the diverse patrons. Everyone is equal in the steam.', stat_deltas: { corruption: 3, skills: { speech: 1 } }, hours_passed: 2 },
      { id: 'join_party', label: 'Join a bathing party', intent: 'social', outcome: 'A group invites you to share their pool. The conversation turns intimate.', stat_deltas: { stress: -20, relationship: 8, corruption: 5 }, hours_passed: 3 }
    ]
  },

  balmora_pleasure_house: {
    id: 'balmora_pleasure_house',
    name: 'House of Bliss',
    type: 'pleasure_house',
    region: 'morrowind',
    description: "A traditional Dunmer establishment where pleasure is elevated to sacred art. The House of Bliss serves wealthy clients seeking companionship in the ancient Dunmer tradition. Servants are trained in the arts of conversation, music, and more intimate pursuits. Mystery surrounds every interaction.",
    atmosphere: 'Exotic, refined, mysterious, sensual',
    actions: [
      { id: 'temple_bliss', label: 'Enter the House of Bliss', intent: 'corruption', outcome: 'The establishment smells of incense and sandalwood. You are greeted with ceremony.', stat_deltas: { corruption: 10, stress: -20 }, hours_passed: 1 },
      { id: 'sacred_intimacy', label: 'Experience sacred intimacy', intent: 'corruption', outcome: 'The Dunmer view pleasure as sacred. You understand their philosophy intimately.', stat_deltas: { corruption: 20, stress: -30, gold: -100 }, hours_passed: 3 },
      { id: 'house_servants', label: 'Speak with house servants', intent: 'social', outcome: 'The servants are educated in many subjects. Conversation alone is worth the coin.', stat_deltas: { skills: { speech: 3 }, relationship: 5, gold: -25 }, hours_passed: 2 },
      { id: 'mysterious_client', label: 'Meet a mysterious client', intent: 'social', outcome: 'Another patron, hooded and silent, nods in recognition. They have deep pockets.', stat_deltas: { gold: 50, corruption: 5, relationship: 3 }, hours_passed: 2 },
      { id: 'dunmer_art', label: 'Learn Dunmer arts of pleasure', intent: 'work', outcome: 'The house teaches ancient techniques. Your skills improve dramatically.', stat_deltas: { corruption: 15, skills: { speech: 5 } }, hours_passed: 4 },
      { id: 'private_dance', label: 'Request a private dance', intent: 'corruption', outcome: 'A skilled dancer moves before you. The performance is mesmerizing.', stat_deltas: { corruption: 10, stress: -15, gold: -40 }, hours_passed: 2 },
      { id: ' VIP_room', label: 'Request VIP chamber', intent: 'corruption', outcome: 'The finest the house offers awaits. Privacy and pleasure combined.', stat_deltas: { corruption: 25, stress: -35, gold: -150 }, hours_passed: 4 },
      { id: 'house_secrets', label: 'Discover house secrets', intent: 'stealth', outcome: 'Late at night, you notice hidden passages. What else lies hidden here?', stat_deltas: { corruption: 10, skills: { stealth: 3 } }, hours_passed: 3 }
    ]
  },

  black_marsh_spawning_pool: {
    id: 'black_marsh_spawning_pool',
    name: 'The Spawning Pools',
    type: 'sacred_site',
    region: 'black_marsh',
    description: "Deep in the swamps of Black Marsh, far from mortal eyes, lie the sacred spawning pools of the Argonians. Here, the Hist commune with their chosen, and Argonians come to participate in ancient rituals of reproduction and renewal. The air is thick with pollen and magic.",
    atmosphere: 'Primeval, mystical, orgiastic, ancient',
    actions: [
      { id: 'ritual_mating', label: 'Participate in ritual mating', intent: 'corruption', outcome: 'You join the ancient dance of life. The Hist witness and bless the union.', stat_deltas: { corruption: 25, stress: -40, willpower: 10 }, hours_passed: 4 },
      { id: 'fertility_rite', label: 'Perform fertility rite', intent: 'willpower', outcome: 'The priests invoke the Hist\'s blessing. Life springs from the ritual.', stat_deltas: { willpower: 15, health: 10 }, hours_passed: 3 },
      { id: 'egg_breeding', label: 'Experience egg breeding', intent: 'corruption', outcome: 'The Argonian way is strange to outsiders. You participate in their cycle.', stat_deltas: { corruption: 30, health: 5 }, hours_passed: 4 },
      { id: 'hist_bliss', label: 'Commune with the Hist', intent: 'willpower', outcome: 'The ancient trees share their wisdom. Your mind expands beyond mortal bounds.', stat_deltas: { willpower: 20, skills: { magic: 5 }, corruption: 10 }, hours_passed: 5 },
      { id: 'spawning_ceremony', label: 'Attend spawning ceremony', intent: 'social', outcome: 'You witness new life emerging from the pools. The sight is both holy and primal.', stat_deltas: { corruption: 15, willpower: 10 }, hours_passed: 3 },
      { id: '加入_pool', label: 'Join the waters', intent: 'neutral', outcome: 'The warm swamp waters envelop you. You feel connected to something vast.', stat_deltas: { health: 15, exhaustion: -20 }, hours_passed: 2 },
      { id: 'strange_intimacy', label: 'Share intimacy with an Argonian', intent: 'corruption', outcome: 'The encounter is unlike anything else. Their culture, their way, embraces you.', stat_deltas: { corruption: 35, stress: -30 }, hours_passed: 3 },
      { id: 'hist_offering', label: 'Make offering to the Hist', intent: 'willpower', outcome: 'You leave a gift at the sacred tree. The roots seem to pulse with gratitude.', stat_deltas: { willpower: 10, gold: -20 }, hours_passed: 2 }
    ]
  },

  // MARKARTH - CIDNA MINE
  cidna_mine: {
    id: 'cidna_mine',
    name: 'CIDNA Mine',
    type: 'dungeon',
    region: 'the_reach',
    description: "The infamous silver mine beneath Markarth is a prison labor camp where criminals are sent to mine until they die. The guards are brutal, the work is grueling, and the mine runs deeper than anyone knows. Strange things lurk in the darkness below.",
    atmosphere: 'Oppressive, dangerous, dark, brutal',
    actions: [
      { id: 'prison_labor', label: 'Work the mines', intent: 'work', outcome: 'You swing the pickaxe until your hands bleed. The silver must flow.', stat_deltas: { health: -20, strength: 5, gold: 5 }, hours_passed: 6 },
      { id: 'escape_attempt', label: 'Attempt escape', intent: 'stealth', outcome: 'You dig at the walls when the guards look away. One day you will break free.', stat_deltas: { skills: { lockpicking: 4 }, corruption: 3 }, hours_passed: 4 },
      { id: 'mine_beast', label: 'Face the mine beast', intent: 'combat', outcome: 'Something lurks in the deep tunnels. You fight for your life.', stat_deltas: { health: -25, skills: { combat: 8 }, corruption: 5 }, hours_passed: 2 },
      { id: 'guard_bribe', label: 'Bribe a guard', intent: 'corruption', outcome: 'Some guards can be bought. The price is high but the relief is worth it.', stat_deltas: { gold: -50, health: 10, corruption: 5 }, hours_passed: 1 },
      { id: 'work_crew', label: 'Join work crew', intent: 'work', outcome: 'You labor alongside murderers and thieves. Survival requires solidarity.', stat_deltas: { relationship: 5, strength: 3 }, hours_passed: 6 },
      { id: 'deep_tunnel', label: 'Explore deep tunnels', intent: 'stealth', outcome: 'You venture where no prisoner should go. The darkness hides ancient secrets.', stat_deltas: { corruption: 8, skills: { alchemy: 3 }, gold: 30 }, hours_passed: 3 },
      { id: 'prison_riot', label: 'Join prison riot', intent: 'combat', outcome: 'The prisoners rise up! The guards scramble as chaos erupts.', stat_deltas: { health: -15, corruption: 10, skills: { combat: 5 }, relationship: 5 }, hours_passed: 2 },
      { id: 'secret_passage', label: 'Discover secret passage', intent: 'stealth', outcome: 'Behind a loose stone, you find a way out. Freedom is close.', stat_deltas: { skills: { lockpicking: 8 }, corruption: 5 }, hours_passed: 2 }
    ]
  },

  // RIFTEN - THIEVES GUILD
  ragged_flagon: {
    id: 'ragged_flagon',
    name: 'The Ragged Flagon',
    type: 'guild',
    region: 'the_rift',
    description: "The hidden headquarters of the Thieves Guild lies beneath Riften's canals. Through a hidden grate in the cistern, you enter a network of tunnels and chambers where thieves train, fence goods, and plot heists. The Cistern serves as the hub of operations.",
    atmosphere: 'Hidden, mysterious, lucrative, dangerous',
    actions: [
      { id: 'lockpicking_train', label: 'Train lockpicking', intent: 'work', outcome: 'The guild masters teach you the art of picking locks. Practice makes perfect.', stat_deltas: { skills: { lockpicking: 8 }, gold: -20 }, hours_passed: 3 },
      { id: 'pickpocket_train', label: 'Practice pickpocketing', intent: 'work', outcome: 'You practice lifting wallets in the market. The guild watches your progress.', stat_deltas: { skills: { stealth: 6, speech: 3 }, gold: 30 }, hours_passed: 3 },
      { id: 'fence_goods', label: 'Sell to the fence', intent: 'work', outcome: 'You fence stolen goods. Maven pays well for quality merchandise.', stat_deltas: { gold: 100, relationship: 5 }, hours_passed: 1 },
      { id: 'guild_mission', label: 'Take a guild mission', intent: 'work', outcome: '"We have work. A noble's house, a caravan, a mark with deep pockets."', stat_deltas: { relationship: 8, gold: 80 }, hours_passed: 4 },
      { id: 'brynjolf_deal', label: 'Speak with Brynjolf', intent: 'social', outcome: '"You want to rise in the guild? Prove you're worth the risk."', stat_deltas: { relationship: 10 }, hours_passed: 1 },
      { id: 'nightingales', label: 'Learn about Nightingales', intent: 'stealth', outcome: 'The Nightingales are the guild's elite. Their power comes from Nocturnal.', stat_deltas: { corruption: 8, skills: { stealth: 5 } }, hours_passed: 2 },
      { id: 'heist_planning', label: 'Plan a heist', intent: 'work', outcome: 'You study blueprints and plan the perfect crime. Timing is everything.', stat_deltas: { skills: { lockpicking: 5, speech: 3 } }, hours_passed: 3 },
      { id: 'guild_trial', label: 'Complete guild trial', intent: 'combat', outcome: 'The guild tests your skills. Pass and earn your place among the thieves.', stat_deltas: { skills: { combat: 6, stealth: 6 }, relationship: 15 }, hours_passed: 4 }
    ]
  },

  // SOLITUDE - THE EMPIRE'S SECRET
  empires_secret: {
    id: 'empires_secret',
    name: "The Empire's Secret",
    type: 'military',
    region: 'haafingar',
    description: "Beneath Solitude's streets lies a hidden network of Imperial spies and informants. The breastplate of the Imperial Emperor is displayed in a secure vault here, but the real secret is the intelligence operation running from these halls. The Empire's eyes and ears are everywhere.",
    atmosphere: 'Secretive, political, dangerous, powerful',
    actions: [
      { id: 'imperial_breastplate', label: 'View the Emperor\'s breastplate', intent: 'work', outcome: 'The legendary armor glows with ancient power. A symbol of Imperial might.', stat_deltas: { skills: { history: 5 }, relationship: 3 }, hours_passed: 1 },
      { id: 'spy_training', label: 'Join spy network', intent: 'work', outcome: 'The Empire needs agents. You learn to gather intelligence and stay hidden.', stat_deltas: { skills: { stealth: 8, speech: 4 }, corruption: 5 }, hours_passed: 4 },
      { id: 'informant_network', label: 'Build informant network', intent: 'work', outcome: 'You cultivate sources across Skyrim. Information is power.', stat_deltas: { relationship: 10, gold: -30 }, hours_passed: 3 },
      { id: 'assassination', label: 'Accept assassination contract', intent: 'combat', outcome: 'The Empire eliminates threats. You become the weapon.', stat_deltas: { health: -10, corruption: 15, gold: 100 }, hours_passed: 2 },
      { id: 'diplomatic_espionage', label: 'Engage diplomatic espionage', intent: 'stealth', outcome: 'You infiltrate foreign delegations. The Thalmor watch their words around you.', stat_deltas: { skills: { speech: 6, stealth: 5 }, corruption: 8 }, hours_passed: 4 },
      { id: 'cipher_training', label: 'Learn Imperial ciphers', intent: 'work', outcome: 'Secret codes protect Imperial communications. You master the system.', stat_deltas: { skills: { speech: 4 } }, hours_passed: 3 },
      { id: 'underground_chambers', label: 'Explore underground chambers', intent: 'stealth', outcome: 'The tunnels run beneath all of Solitude. Many secrets hide in the dark.', stat_deltas: { corruption: 5, skills: { lockpicking: 4 } }, hours_passed: 2 },
      { id: 'imperial_command', label: 'Receive Imperial command', intent: 'work', outcome: '"You have proven loyal. The Empire has a mission for you."', stat_deltas: { relationship: 15, gold: 150 }, hours_passed: 1 }
    ]
  },

  // WINTERHOLD - COLLEGE
  college_of_winterhold: {
    id: 'college_of_winterhold',
    name: 'The College of Winterhold',
    type: 'guild',
    region: 'winterhold',
    description: "The greatCollege of Winterhold stands as a beacon of arcane learning, its towers rising from the frozen cliffs. Students study destruction, restoration, conjuration, and the forbidden arts. The Arch-Mage commands respect, and secrets lurk in the frozen library.",
    atmosphere: 'Arcane, cold, scholarly, mysterious',
    actions: [
      { id: 'arcane_training', label: 'Study arcane arts', intent: 'work', outcome: 'Masters teach you the intricacies of magic. Power flows through you.', stat_deltas: { skills: { magic: 10 }, gold: -50 }, hours_passed: 4 },
      { id: 'forbidden_knowledge', label: 'Seek forbidden knowledge', intent: 'stealth', outcome: 'In the restricted section, you find texts that should not exist.', stat_deltas: { corruption: 15, skills: { magic: 8 } }, hours_passed: 3 },
      { id: 'teleportation', label: 'Learn teleportation', intent: 'work', outcome: 'The Masters teach you to walk between places. Reality bends.', stat_deltas: { skills: { magic: 12 }, gold: -30 }, hours_passed: 4 },
      { id: 'archmage_duel', label: 'Challenge the Arch-Mage', intent: 'combat', outcome: 'You demonstrate your power. The Arch-Mage watches with interest.', stat_deltas: { skills: { magic: 8, combat: 4 }, health: -15 }, hours_passed: 2 },
      { id: 'restoration_study', label: 'Study restoration magic', intent: 'work', outcome: 'Healing arts require focus and compassion. You learn to mend.', stat_deltas: { skills: { magic: 6, willpower: 4 } }, hours_passed: 3 },
      { id: 'dweomer_research', label: 'Research Dweomer', intent: 'work', outcome: 'Ancient Dwemer magic interests scholars. You dig through texts.', stat_deltas: { skills: { magic: 8, history: 3 }, corruption: 5 }, hours_passed: 4 },
      { id: 'summoning_ritual', label: 'Perform summoning ritual', intent: 'work', outcome: 'Daedra answer your call. Some bargains end poorly.', stat_deltas: { health: -20, corruption: 10, skills: { magic: 10 } }, hours_passed: 4 },
      { id: 'frozen_library', label: 'Explore the frozen library', intent: 'stealth', outcome: 'The library holds secrets in frozen shelves. Some books still read.', stat_deltas: { corruption: 8, skills: { magic: 6 } }, hours_passed: 3 }
    ]
  },

  // BLACK MARSH - DEEP SWAMP
  black_marsh_deep: {
    id: 'black_marsh_deep',
    name: 'Deep Black Marsh',
    type: 'wilderness',
    region: 'black_marsh',
    description: "Far from civilization, the deep swamp is a primordial wilderness where the Hist reign supreme. The water turns black with ancient magic, and the trees grow so thick they block out the sun. Argonians perform sacred rituals here, and outsiders are rarely welcome.",
    atmosphere: 'Primeval, mystical, sacred, dangerous',
    actions: [
      { id: 'hist_ritual', label: 'Participate in Hist ritual', intent: 'willpower', outcome: 'The ancient trees demand sacrifice. You join the sacred rite.', stat_deltas: { willpower: 20, corruption: 10 }, hours_passed: 4 },
      { id: 'argonian_mating', label: 'Join Argonian mating ritual', intent: 'corruption', outcome: 'The Argonians welcome you into their sacred dance of life.', stat_deltas: { corruption: 30, stress: -40 }, hours_passed: 4 },
      { id: 'swamp_spirit', label: ' Commune with swamp spirits', intent: 'willpower', outcome: 'The spirits of the deep swamp speak through the Hist. You listen.', stat_deltas: { willpower: 15, skills: { magic: 8 } }, hours_passed: 3 },
      { id: 'deep_swamp_hunt', label: 'Hunt in deep swamp', intent: 'work', outcome: 'The creatures here are ancient and dangerous. The hunt tests your skills.', stat_deltas: { health: -20, skills: { marksman: 8, survival: 5 }, gold: 60 }, hours_passed: 6 },
      { id: 'hist_grove', label: 'Enter the Hist grove', intent: 'willpower', outcome: 'The central grove connects all Argonian minds. You feel the collective.', stat_deltas: { willpower: 25, skills: { magic: 10 }, corruption: 10 }, hours_passed: 3 },
      { id: 'tribal_worship', label: 'Join tribal worship', intent: 'willpower', outcome: 'The tribe celebrates their gods. You are accepted as one of them.', stat_deltas: { relationship: 20, willpower: 10 }, hours_passed: 4 },
      { id: 'deep_secret', label: 'Discover deep secrets', intent: 'stealth', outcome: 'The Hist know things older than Tamriel. They share their wisdom.', stat_deltas: { corruption: 15, skills: { magic: 12 } }, hours_passed: 3 },
      { id: 'swamp_blessing', label: 'Receive swamp blessing', intent: 'willpower', outcome: 'The Hist grant you their blessing. The swamp becomes your ally.', stat_deltas: { health: 30, willpower: 20, relationship: 15 }, hours_passed: 2 }
    ]
  },

  // CYRODIIL BORDER REGION
  fort_kinrith: {
    id: 'fort_kinrith',
    name: 'Fort Kinrith',
    type: 'military',
    region: 'cyrodiil_border',
    description: "A weathered Imperial fort perched on the northern border, where the Colovian hills meet the wilderness. The stone walls have stood for centuries, and the soldiers stationed here are battle-hardened veterans. The fort commands the pass into the northern provinces.",
    atmosphere: 'Military, disciplined, remote, strategic',
    actions: [
      { id: 'report_duty', label: 'Report for guard duty', intent: 'work', outcome: 'The centurion assigns you to the night watch. "Eyes open - bandits hit this pass often."', stat_deltas: { gold: 25, skills: { marksman: 3 } }, hours_passed: 4 },
      { id: 'train_legion', label: 'Train with the Legion', intent: 'combat', outcome: 'Imperial discipline forges strong soldiers. You drill with sword and shield.', stat_deltas: { skills: { combat: 5, blocking: 4 }, health: -10 }, hours_passed: 3 },
      { id: 'border_patrol', label: 'Patrol the border', intent: 'work', outcome: 'The mountain pass is treacherous. You watch for smugglers and raiders.', stat_deltas: { skills: { survival: 4, athletics: 3 }, gold: 30 }, hours_passed: 6 },
      { id: 'talk_centurion', label: 'Talk to the Centurion', intent: 'social', outcome: '"The Empire holds this pass by blood and steel. Every soldier matters."', stat_deltas: { relationship: 5, skills: { leadership: 2 } }, hours_passed: 1 },
      { id: 'intercept_bandits', label: 'Intercept bandit raid', intent: 'combat', outcome: 'Raiders attempt to breach the gate. You help repel the assault.', stat_deltas: { health: -15, skills: { combat: 6 }, gold: 40 }, hours_passed: 2 },
      { id: 'inspect_supplies', label: 'Inspect supply shipments', intent: 'work', outcome: 'Wagons from the south bring provisions. You verify the manifests.', stat_deltas: { skills: { speech: 2 }, gold: 15 }, hours_passed: 2 },
      { id: 'imperial_gossip', label: 'Share Imperial gossip', intent: 'social', outcome: 'Soldiers talk of the war in Cyrodiil and the Aldmeri Dominion\'s moves.', stat_deltas: { corruption: 2, skills: { history: 2 } }, hours_passed: 2 },
      { id: 'desertion_plot', label: 'Discover desertion plot', intent: 'stealth', outcome: 'Some soldiers plan to flee. You must decide what to do with this knowledge.', stat_deltas: { corruption: 5, relationship: -5 }, hours_passed: 2 }
    ]
  },

  pass_of_camoran: {
    id: 'pass_of_camoran',
    name: 'Pass of Camoran',
    type: 'wilderness',
    region: 'cyrodiil_border',
    description: "The ancient pass connecting Cyrodiil to the northern lands has been traversed by armies and merchants for millennia. Carved stone walls frame the winding road, and watchtowers dot the cliffs. The air is thin and cold, but the view from the summit shows both empires.",
    atmosphere: 'Ancient, windswept, strategic, historic',
    actions: [
      { id: 'climb_pass', label: 'Climb the mountain path', intent: 'work', outcome: 'The steep trail tests your endurance. The altitude leaves you breathless.', stat_deltas: { health: -15, skills: { athletics: 5 } }, hours_passed: 4 },
      { id: 'trade_caravan', label: 'Trade with a caravan', intent: 'work', outcome: 'Merchants from Cyrodiil offer spices, silks, and exotic goods.', stat_deltas: { gold: -60, skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'ancient_ruins_explore', label: 'Explore ancient ruins', intent: 'work', outcome: 'Crumbling towers from the First Era dot the pass. Some still hold treasure.', stat_deltas: { gold: 45, skills: { lockpicking: 3 }, corruption: 3 }, hours_passed: 3 },
      { id: 'watchtower_ascend', label: 'Ascend the watchtower', intent: 'work', outcome: 'From the top, you see the entire valley. The view is worth the climb.', stat_deltas: { skills: { marksman: 4 }, exhaustion: -10 }, hours_passed: 2 },
      { id: 'bandit_ambush_survive', label: 'Survive bandit ambush', intent: 'combat', outcome: 'Highland bandits emerge from the rocks! You fight your way through.', stat_deltas: { health: -20, skills: { combat: 8 }, gold: 35 }, hours_passed: 2 },
      { id: 'merchant_protection', label: 'Offer merchant protection', intent: 'work', outcome: 'A wealthy trader needs an escort through the dangerous pass.', stat_deltas: { gold: 75, relationship: 5 }, hours_passed: 4 },
      { id: 'ancient_inscriptions', label: 'Read ancient inscriptions', intent: 'willpower', outcome: 'The stone bears writing from the Camoran dynasty. History speaks to you.', stat_deltas: { skills: { history: 6, magic: 2 } }, hours_passed: 2 },
      { id: 'pass_secret_cave', label: 'Discover secret cave', intent: 'stealth', outcome: 'A hidden cavern behind a waterfall holds smuggler goods.', stat_deltas: { gold: 50, corruption: 5 }, hours_passed: 2 }
    ]
  },

  estate_olava: {
    id: 'estate_olava',
    name: 'Estate Olava',
    type: 'noble',
    region: 'cyrodiil_border',
    description: "A grand Colovian estate nestled in the foothills, where the wealthy aristocracy retreats from the political turmoil of the Imperial City. Vineyards stretch across the hills, and the manor house boasts gardens imported from Cyrodiil. The estate is famous for its wine and its discretely profitable smuggler connections.",
    atmosphere: 'Elegant, refined, wealthy, slightly corrupt',
    actions: [
      { id: 'taste_wine', label: 'Taste the famous vintage', intent: 'neutral', outcome: 'The sommelier pours a vintage older than you. The flavor is exquisite.', stat_deltas: { stress: -15, gold: -20 }, hours_passed: 2 },
      { id: 'meet_landlord', label: 'Meet Lord Olava', intent: 'social', outcome: 'The aged noble welcomes you personally. "Any friend of good wine is welcome."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: ' vineyard_work', label: 'Work in the vineyard', intent: 'work', outcome: 'The harvest is backbreaking but the pay is good. You learn winemaking.', stat_deltas: { health: -10, gold: 35, skills: { crafting: 3 } }, hours_passed: 6 },
      { id: 'garden_walk', label: 'Walk the gardens', intent: 'willpower', outcome: 'The peaceful gardens calm your mind. Rare flowers bloom in perfection.', stat_deltas: { willpower: 8, exhaustion: -15 }, hours_passed: 2 },
      { id: 'hidden_deal', label: 'Witness a hidden deal', intent: 'stealth', outcome: 'Smugglers meet in the wine cellar. They offer you a cut to stay quiet.', stat_deltas: { corruption: 10, gold: 50 }, hours_passed: 2 },
      { id: 'servants_gossip', label: 'Gossip with servants', intent: 'social', outcome: '"The master has enemies. The Thalmor visit sometimes - late at night..."', stat_deltas: { skills: { speech: 3 }, relationship: 3 }, hours_passed: 1 },
      { id: 'estate_auction', label: 'Attend estate auction', intent: 'work', outcome: 'Rare artifacts from across Tamriel are sold to the highest bidder.', stat_deltas: { gold: -100 }, hours_passed: 3 },
      { id: 'escape_pursuers', label: 'Help escape pursuers', intent: 'combat', outcome: 'Assassins from a rival house attack! You defend the estate.', stat_deltas: { health: -15, skills: { combat: 6 }, relationship: 10 }, hours_passed: 2 }
    ]
  },

  fort_auridon: {
    id: 'fort_auridon',
    name: 'Fort Auridon',
    type: 'military',
    region: 'cyrodiil_border',
    description: "A smaller border fort that guards the western approach to Cyrodiil. The soldiers here are fewer but more specialized - scouts and skirmishers who know the terrain intimately. The fort is built into the mountainside, making it nearly impregnable from the west.",
    atmosphere: 'Rugged, tactical, isolated, vigilant',
    actions: [
      { id: 'scout_patrol', label: 'Join scouting patrol', intent: 'work', outcome: 'You patrol the wilderness, mapping changes and spotting threats.', stat_deltas: { skills: { survival: 5, marksman: 4 }, gold: 30 }, hours_passed: 6 },
      { id: 'mountain_climb', label: 'Practice mountain climbing', intent: 'work', outcome: 'The cliffs around the fort are perfect for climbing practice.', stat_deltas: { skills: { athletics: 6 }, health: -10 }, hours_passed: 3 },
      { id: 'talk_scout', label: 'Talk to the scout commander', intent: 'social', outcome: '"I\'ve watched this border for twenty years. Nothing gets past me."', stat_deltas: { skills: { survival: 3 }, relationship: 4 }, hours_passed: 1 },
      { id: 'trap_illegals', label: 'Trap border crossers', intent: 'work', outcome: 'Smugglers try to slip through. You help catch them in the act.', stat_deltas: { gold: 40, skills: { stealth: 4 } }, hours_passed: 4 },
      { id: 'fort_defense', label: 'Defend against attack', intent: 'combat', outcome: 'A war band from the north attacks! You hold the wall.', stat_deltas: { health: -25, skills: { combat: 10 }, relationship: 8 }, hours_passed: 3 },
      { id: 'read_border_maps', label: 'Study border maps', intent: 'work', outcome: 'Detailed maps show every pass, cave, and hidden path through the mountains.', stat_deltas: { skills: { survival: 4 } }, hours_passed: 2 },
      { id: 'secret_passage', label: 'Discover secret passage', intent: 'stealth', outcome: 'An old tunnel leads into Cyrodiil. Few know it exists.', stat_deltas: { corruption: 5, skills: { lockpicking: 5 } }, hours_passed: 2 },
      { id: 'eagle_nest_visit', label: 'Visit the eagle nest', intent: 'willpower', outcome: 'The high peak offers a view of both empires. You feel small but free.', stat_deltas: { willpower: 10 }, hours_passed: 3 }
    ]
  },

  border_outpost_colovian: {
    id: 'border_outpost_colovian',
    name: 'Colovian Border Outpost',
    type: 'military',
    region: 'cyrodiil_border',
    description: "A humble trading post on the Colovian side of the border, where local farmers and merchants gather to trade goods across the provincial divide. The Imperial Legion maintains a light presence, mostly for customs and keeping the peace. It\'s a place of quiet commerce rather than military might.",
    atmosphere: 'Commercial, peaceful, rustic, multicultural',
    actions: [
      { id: 'trade_goods', label: 'Trade goods at the market', intent: 'work', outcome: 'Merchants from both sides of the border hawk their wares.', stat_deltas: { gold: -40, skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'pay_tariff', label: 'Pay tariff to cross', intent: 'work', outcome: 'The border guard checks your goods and collects the Imperial tax.', stat_deltas: { gold: -15 }, hours_passed: 1 },
      { id: 'talk_farmers', label: 'Talk to local farmers', intent: 'social', outcome: '"The war hasn\'t touched us here. Yet. The grain still grows."', stat_deltas: { relationship: 3, skills: { survival: 2 } }, hours_passed: 1 },
      { id: 'smuggle_goods', label: 'Smuggle restricted goods', intent: 'stealth', outcome: 'You slip some goods past the customs booth. The profit is good.', stat_deltas: { gold: 60, corruption: 8 }, hours_passed: 2 },
      { id: ' hear_tales', label: 'Hear traveler tales', intent: 'social', outcome: 'Merchants from far lands share stories of distant wars and wonders.', stat_deltas: { skills: { history: 3 } }, hours_passed: 2 },
      { id: 'work_farm', label: 'Help with the harvest', intent: 'work', outcome: 'A farmer needs extra hands. The work is honest and the food is good.', stat_deltas: { health: -5, gold: 20, strength: 2 }, hours_passed: 4 },
      { id: 'imperial_relations', label: 'Improve Imperial relations', intent: 'work', outcome: 'You help the Legion with community relations. They appreciate the help.', stat_deltas: { relationship: 8, gold: 15 }, hours_passed: 3 },
      { id: 'border_dispute', label: 'Settle a border dispute', intent: 'work', outcome: 'Two merchants argue over a trade. You help mediate fairly.', stat_deltas: { skills: { speech: 5 }, relationship: 5 }, hours_passed: 2 }
    ]
  },

  fort_sedra: {
    id: 'fort_sedra',
    name: 'Fort Sedra',
    type: 'military',
    region: 'cyrodiil_border',
    description: "A strategic fort controlling the river crossing on the eastern border approaches. The stone bridge here is the only safe way across for wagons and caravans. The fort has changed hands several times in history, and its walls bear the scars of many sieges. Currently held by the Empire, it serves as the primary customs checkpoint.",
    atmosphere: 'Historic, fortified, busy, bureaucratic',
    actions: [
      { id: 'cross_bridge', label: 'Cross under guard', intent: 'work', outcome: 'The guards check your papers and allow you passage. The bridge is well-maintained.', stat_deltas: { gold: -5 }, hours_passed: 1 },
      { id: 'inspect_cargo', label: 'Inspect cargo wagons', intent: 'work', outcome: 'You help search incoming goods for contraband. A tedious but necessary job.', stat_deltas: { gold: 20, skills: { lockpicking: 2 } }, hours_passed: 3 },
      { id: 'bridge_repair', label: 'Help repair the bridge', intent: 'work', outcome: 'The ancient bridge needs constant maintenance. You lend your strength.', stat_deltas: { health: -10, gold: 25, strength: 3 }, hours_passed: 4 },
      { id: 'catch_smurgglers', label: 'Catch smugglers', intent: 'work', outcome: 'You discover a hidden compartment full of illegal Cyrodiilic brandy.', stat_deltas: { gold: 45, relationship: 5 }, hours_passed: 2 },
      { id: 'siege_defense', label: 'Defend against siege', intent: 'combat', outcome: 'Rebels attack the fort! You help hold the bridge against the assault.', stat_deltas: { health: -30, skills: { combat: 12 }, relationship: 10 }, hours_passed: 4 },
      { id: 'river_swim', label: 'Swim the river', intent: 'work', outcome: 'The cold water is dangerous but faster than waiting for the bridge.', stat_deltas: { health: -10, skills: { athletics: 4 } }, hours_passed: 2 },
      { id: 'ghost_stories', label: 'Hear ghost stories', intent: 'social', outcome: 'Soldiers whisper of those who died defending the bridge. Some say they still walk...', stat_deltas: { corruption: 2, skills: { history: 2 } }, hours_passed: 1 },
      { id: 'underwater_secret', label: 'Find underwater secret', intent: 'stealth', outcome: 'Something glitters in the river. A lost noble\'s ring from an old siege.', stat_deltas: { gold: 80, corruption: 3 }, hours_passed: 2 }
    ]
  },

  colovian_estate_hearthfire: {
    id: 'colovian_estate_hearthfire',
    name: 'Estate Hearthfire',
    type: 'noble',
    region: 'cyrodiil_border',
    description: "A cozy Colovian manor known for its exceptional hospitality and its equally exceptional secrets. The family has maintained ties to the Empire for generations, but rumors persist of hidden vaults beneath the estate where treasures from the Great War are stored. The grounds feature hot springs that attract visitors from across the region.",
    atmosphere: 'Warm, wealthy, mysterious, welcoming',
    actions: [
      { id: 'hot_springs_bath', label: 'Bathe in hot springs', intent: 'neutral', outcome: 'The mineral-rich waters relax your muscles. You feel renewed.', stat_deltas: { health: 25, exhaustion: -30 }, hours_passed: 2 },
      { id: 'dinner_invitation', label: 'Accept dinner invitation', intent: 'social', outcome: 'The family hosts an elegant dinner. The conversation is witty and political.', stat_deltas: { skills: { speech: 4 }, gold: -30 }, hours_passed: 3 },
      { id: 'explore_estate', label: 'Explore the estate grounds', intent: 'work', outcome: 'The gardens and orchards are beautifully maintained. Rare plants grow here.', stat_deltas: { skills: { alchemy: 3 }, gold: 20 }, hours_passed: 2 },
      { id: 'discover_vault', label: 'Discover hidden vault', intent: 'stealth', outcome: 'A loose stone reveals a passage to a vault full of war treasures.', stat_deltas: { gold: 150, corruption: 10 }, hours_passed: 2 },
      { id: 'meet_matriarch', label: 'Meet the matriarch', intent: 'social', outcome: 'The elderly lady knows many secrets. She shares some - for a price.', stat_deltas: { skills: { history: 5 }, gold: -20 }, hours_passed: 1 },
      { id: 'hunting_trip', label: 'Join a hunting trip', intent: 'work', outcome: 'The estate hosts a hunt in the surrounding forest. The game is plentiful.', stat_deltas: { skills: { marksman: 5, survival: 3 }, gold: 35, health: -10 }, hours_passed: 4 },
      { id: 'horse_trade', label: 'Trade for horses', intent: 'work', outcome: 'The estate breeds fine Cyrodiilic horses. Prices are high but quality is superb.', stat_deltas: { gold: -200 }, hours_passed: 2 },
      { id: 'family_secret', label: 'Learn family secret', intent: 'stealth', outcome: 'The family has a dark secret - ties to the Thalmor during the Great War.', stat_deltas: { corruption: 8, skills: { speech: 3 } }, hours_passed: 2 }
    ]
  },

  // HAMMERFELL REGION
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    type: 'city',
    region: 'hammerfell',
    description: "The capital of the Crowned Kingdom of Hammerfell stands as a jewel of the western deserts. Its white stone towers gleam in the sun, and the harbor bustles with ships from across the Abecean Sea. The Redguard monarchy rules from the castle, maintaining ancient traditions of honor and warfare.",
    atmosphere: 'Regal, maritime, traditional, sun-scorched',
    actions: [
      { id: 'visit_palace', label: 'Visit the Royal Palace', intent: 'work', outcome: 'The King holds court in the great hall. Advisors whisper in ears, and merchants seek audience.', stat_deltas: { relationship: 5 }, hours_passed: 2 },
      { id: 'harbor_walk', label: 'Walk the harbor', intent: 'social', outcome: 'Ships from Wayrest, Anvil, and even far Summerset unload their cargo. The salt air is thick with commerce.', stat_deltas: { gold: -10, relationship: 2 }, hours_passed: 2 },
      { id: 'market_trade', label: 'Trade in the bazaar', intent: 'work', outcome: 'Merchants offer spices, silks, and exotic goods from across the sea.', stat_deltas: { gold: -60 }, hours_passed: 2 },
      { id: 'guard_training', label: 'Join the city guard', intent: 'work', outcome: '"The King needs able swords. Patrol the walls and earn your keep."', stat_deltas: { gold: 35, skills: { combat: 4 }, relationship: 3 }, hours_passed: 4 },
      { id: 'redguard_honor', label: 'Discuss Redguard honor', intent: 'social', outcome: '"Our ancestors drove the Ra Gada here. We do not forget the sword."', stat_deltas: { skills: { history: 3 }, relationship: 3 }, hours_passed: 1 },
      { id: 'temple_district', label: 'Visit the Temple of Satakala', intent: 'willpower', outcome: 'The priests of the Many-Headed Talos offer blessings to warriors.', stat_deltas: { willpower: 6 }, hours_passed: 1 },
      { id: 'desert_relations', label: 'Meet Crown and Forebear leaders', intent: 'social', outcome: 'The political tension between Crown traditionalists and Forebear reformers is palpable.', stat_deltas: { corruption: 3, skills: { speech: 2 } }, hours_passed: 2 },
      { id: 'assassination_plot', label: 'Uncover assassination plot', intent: 'stealth', outcome: 'Whispers in the shadows reveal a plot against the King. Will you warn him or profit?', stat_deltas: { corruption: 10, gold: 50 }, hours_passed: 2 }
    ]
  },
  sunforge: {
    id: 'sunforge',
    name: 'Sunforge',
    type: 'guild',
    region: 'hammerfell',
    description: "High in the Ilaya Mountains, the fortress of the Order of the Sun serves as both monastery and military headquarters. The crusader knights train here, their blades blessed by the ancient order. The forge itself is said to be blessed by Stendarr, producing weapons of exceptional quality.",
    atmosphere: 'Sacred, martial, disciplined, elevated',
    actions: [
      { id: 'join_order', label: 'Request to join the Order', intent: 'work', outcome: '"Prove your worth in combat and faith. The Sunforge accepts those who embody mercy and might."', stat_deltas: { relationship: 5, willpower: 3 }, hours_passed: 1 },
      { id: 'blessed_forge', label: 'Use the blessed forge', intent: 'work', outcome: 'The holy flames of Sunforge make metal sing. Your weapons emerge stronger.', stat_deltas: { gold: -80, skills: { crafting: 5 } }, hours_passed: 3 },
      { id: 'crusader_training', label: 'Train with the knights', intent: 'combat', outcome: 'The holy warriors drill with sword and shield. Their technique is precise and devastating.', stat_deltas: { skills: { combat: 6, blocking: 4 }, health: -15 }, hours_passed: 4 },
      { id: 'temple_prayer', label: 'Pray at the shrine', intent: 'willpower', outcome: 'The light of Stendarr fills you with righteous purpose.', stat_deltas: { willpower: 10 }, hours_passed: 2 },
      { id: 'holy_war', label: 'Discuss the holy war', intent: 'social', outcome: '"The Thalmor desecrated our lands. The order grows in strength, preparing for the next crusade."', stat_deltas: { corruption: 5, relationship: 3 }, hours_passed: 1 },
      { id: 'sanctuary_defend', label: 'Defend the sanctuary', intent: 'combat', outcome: 'Raiders attack the holy site! You help repel the invaders.', stat_deltas: { health: -20, skills: { combat: 8 }, relationship: 10 }, hours_passed: 3 },
      { id: 'forbidden_tome', label: 'Search for forbidden knowledge', intent: 'stealth', outcome: 'Ancient texts in the archives hold secrets the order keeps hidden.', stat_deltas: { corruption: 8, skills: { magic: 4 } }, hours_passed: 2 },
      { id: 'pilgrim_heal', label: 'Heal the wounded', intent: 'work', outcome: 'You tend to the injured knights. Their gratitude is heartfelt.', stat_deltas: { relationship: 8, willpower: 4 }, hours_passed: 3 }
    ]
  },
  rihad: {
    id: 'rihad',
    name: 'Rihad',
    type: 'tavern',
    region: 'hammerfell',
    description: "A dusty trading post on the eastern edge of the desert, Rihad serves as a waystation for merchants traveling between Hammerfell and Cyrodiil. The Red Desert Inn offers cold beverages and warm gossip. The town has changed hands between kingdoms many times, and its people have learned to serve whoever holds power.",
    atmosphere: 'Dusty, trading, transitional, weathered',
    actions: [
      { id: 'caravan_arrival', label: 'Greet arriving caravan', intent: 'work', outcome: 'Merchants from Cyrodiil bring news and goods from beyond the border.', stat_deltas: { gold: 30, relationship: 3 }, hours_passed: 2 },
      { id: 'border_crossing', label: 'Discuss border crossing', intent: 'social', outcome: '"The pass is safe now, but last season raiders ambushed a whole trade convoy."', stat_deltas: { skills: { survival: 2 }, gold: -5 }, hours_passed: 1 },
      { id: 'desert_supplies', label: 'Buy desert supplies', intent: 'work', outcome: 'The shopkeeper offers water skins, sun-resistant cloaks, and maps to the wasteland.', stat_deltas: { gold: -40 }, hours_passed: 1 },
      { id: 'drink_local', label: 'Drink with locals', intent: 'social', outcome: 'The bitter ale is a local specialty. The stories are free.', stat_deltas: { stress: -10, relationship: 5 }, hours_passed: 2 },
      { id: 'smuggler_contact', label: 'Contact smugglers', intent: 'stealth', outcome: 'Those who avoid the official border offer faster - and illegal - passage.', stat_deltas: { corruption: 10, gold: 50 }, hours_passed: 1 },
      { id: 'caravan_guard', label: 'Offer guard services', intent: 'work', outcome: 'A merchant needs protection through the dangerous eastern passes.', stat_deltas: { gold: 60, skills: { combat: 4 } }, hours_passed: 4 },
      { id: 'desert_town_history', label: 'Learn town history', intent: 'social', outcome: '"We\'ve been Redguard, Breton, Imperial, and back. The desert doesn\'t care who rules."', stat_deltas: { skills: { history: 3 } }, hours_passed: 1 },
      { id: 'oasis_rest', label: 'Rest at the oasis', intent: 'neutral', outcome: 'The cool waters of the hidden oasis restore your strength.', stat_deltas: { health: 20, exhaustion: -25 }, hours_passed: 3 }
    ]
  },

  // HIGH ROCK REGION
  wayrest: {
    id: 'wayrest',
    name: 'Wayrest',
    type: 'city',
    region: 'high_rock',
    description: "The greatest port city in High Rock, Wayrest sprawls across the mouth of the River Karth. Breton merchants trade with sailors from across the Abecean Sea, and the city's wealth attracts knights, mages, and thieves alike. The Kingdom of Wayrest rules from the ancient castle, though merchant princes hold considerable power.",
    atmosphere: 'Wealthy, maritime, cosmopolitan, politically complex',
    actions: [
      { id: 'port_trade', label: 'Trade at the harbor', intent: 'work', outcome: 'Ships from Hammerfell, Summerset, and beyond dock here. The profits are immense.', stat_deltas: { gold: -80, skills: { speech: 3 } }, hours_passed: 2 },
      { id: 'knight_training', label: 'Train with Breton knights', intent: 'combat', outcome: 'The Order of the Dragon maintains a chapter here. Their heavy cavalry is legendary.', stat_deltas: { skills: { combat: 6, blocking: 4 }, gold: -25 }, hours_passed: 3 },
      { id: 'direnni_tower_visit', label: 'Visit Direnni Tower', intent: 'work', outcome: 'The ancient tower still stands, home to the last Direnni mages. Their knowledge is vast.', stat_deltas: { skills: { magic: 5 }, relationship: 3 }, hours_passed: 2 },
      { id: 'mercenary_guild', label: 'Join the Mercenary Guild', intent: 'work', outcome: '"The Thorn is hiring. Good coin, dangerous work. Sign up and prove yourself."', stat_deltas: { gold: 40, relationship: 5 }, hours_passed: 1 },
      { id: 'merchant_prince', label: 'Meet a merchant prince', intent: 'social', outcome: 'The wealthy traders control the city\'s economy. Their favor is valuable.', stat_deltas: { relationship: 8, gold: -30 }, hours_passed: 1 },
      { id: 'river_expedition', label: 'Organize a river expedition', intent: 'work', outcome: 'Expeditions up the Karth seek lost ruins and forgotten treasures.', stat_deltas: { gold: 50, skills: { survival: 3 } }, hours_passed: 4 },
      { id: 'mage_guild_branch', label: 'Visit the Mages Guild', intent: 'work', outcome: 'The local guildhall trains Bretons in the arcane arts. The curriculum is rigorous.', stat_deltas: { skills: { magic: 4 }, gold: -20 }, hours_passed: 2 },
      { id: 'pirate_negotiation', label: 'Negotiate with pirates', intent: 'stealth', outcome: 'The harbor has connections to the Pyandonean corsairs. Blood money flows.', stat_deltas: { corruption: 10, gold: 60 }, hours_passed: 1 }
    ]
  },
  daggerfall: {
    id: 'daggerfall',
    name: 'Daggerfall',
    type: 'city',
    region: 'high_rock',
    description: "The capital of the Daggerfall Covenant stands as a monument to Breton power. The massive castle dominates the city, and knights in shining armor patrol the streets. The Bretons here are proud of their ancestry and their kingdom's influence over the Iliac Bay region.",
    atmosphere: 'Regal, martial, traditional, proud',
    actions: [
      { id: 'royal_audience', label: 'Seek audience with the King', intent: 'work', outcome: 'The King of Daggerfall holds court. He has work for those with skill and loyalty.', stat_deltas: { relationship: 10 }, hours_passed: 2 },
      { id: 'covenant_council', label: 'Attend covenant council', intent: 'social', outcome: 'The leaders of the Daggerfall Covenant debate strategy against the Empire.', stat_deltas: { skills: { leadership: 4 }, relationship: 5 }, hours_passed: 2 },
      { id: 'cavalry_training', label: 'Train in the cavalry', intent: 'combat', outcome: 'Breton heavy cavalry is the finest in Tamriel. You learn to fight from the saddle.', stat_deltas: { skills: { combat: 8, marksman: 4 }, health: -15 }, hours_passed: 4 },
      { id: 'direnni_library', label: 'Research at the Direnni Library', intent: 'work', outcome: 'The ancient texts hold secrets of the First Era and the battles against the Ayleids.', stat_deltas: { skills: { history: 6, magic: 3 } }, hours_passed: 3 },
      { id: 'kingdom_guard', label: 'Join the Kingdom Guard', intent: 'work', outcome: '"Serve the crown with honor. The kingdom needs swords it can trust."', stat_deltas: { gold: 50, skills: { combat: 4 }, relationship: 10 }, hours_passed: 4 },
      { id: 'high_rock_nobles', label: 'Network with nobles', intent: 'social', outcome: 'The Breton aristocracy values lineage and influence. Navigate carefully.', stat_deltas: { skills: { speech: 5 }, relationship: 8 }, hours_passed: 2 },
      { id: 'artifact_search', label: 'Search for ancient artifacts', intent: 'work', outcome: 'Ruins around the city hold treasures from the Direnni Hegemony.', stat_deltas: { gold: 80, skills: { history: 3 }, corruption: 3 }, hours_passed: 3 },
      { id: 'spy_network', label: 'Join the intelligence network', intent: 'stealth', outcome: 'The kingdom spies on its neighbors. Your skills could serve the crown.', stat_deltas: { corruption: 8, skills: { stealth: 5 } }, hours_passed: 2 }
    ]
  },
  orsinium: {
    id: 'orsinium',
    name: 'Orsinium',
    type: 'city',
    region: 'high_rock',
    description: "The Orcish capital rises in the mountains of western High Rock, a fortress-city built by and for the Orcs. Despite Breton attempts to destroy it throughout history, Orsinium endures. The city trades in strong weapons, heavy armor, and the famous Orcish smiths command high prices across Tamriel.",
    atmosphere: 'Rugged, fortress-like, proud, martial',
    actions: [
      { id: 'orcish_forge', label: 'Learn Orcish smithing', intent: 'work', outcome: 'The master smiths teach their secret techniques. Orcish steel is legendary.', stat_deltas: { skills: { crafting: 6 }, gold: -30 }, hours_passed: 3 },
      { id: 'thunderhammer_training', label: 'Train with thunderhammers', intent: 'combat', outcome: 'The great two-handed hammers are the Orcish specialty. Devastating power.', stat_deltas: { skills: { combat: 8, two_handed: 5 }, health: -15 }, hours_passed: 4 },
      { id: 'orcish_chief', label: 'Meet the Tribal Chief', intent: 'social', outcome: 'The leader of all Orcs in Tamriel rules from the great hall. Show respect.', stat_deltas: { relationship: 10 }, hours_passed: 1 },
      { id: 'buy_armor', label: 'Buy Orcish armor', intent: 'work', outcome: 'The heavy armor is worth every gold piece. Protection that lasts.', stat_deltas: { gold: -120, skills: { crafting: 2 } }, hours_passed: 1 },
      { id: 'prove_strength', label: 'Prove your strength', intent: 'combat', outcome: 'To earn Orcish respect, you must show your might in combat. Fight well.', stat_deltas: { health: -20, skills: { combat: 6 }, relationship: 15 }, hours_passed: 2 },
      { id: 'mercenary_contract', label: 'Sign a mercenary contract', intent: 'work', outcome: 'Orcish warriors are prized across Tamriel. The coin is good, the work bloody.', stat_deltas: { gold: 80, skills: { combat: 5 } }, hours_passed: 4 },
      { id: 'giant_slayer_legend', label: 'Hear the Giant-Slayer legend', intent: 'social', outcome: '"Gortwog carved his name in history. We continue his legacy."', stat_deltas: { skills: { history: 3 }, relationship: 3 }, hours_passed: 1 },
      { id: 'stronghold_defense', label: 'Defend the stronghold', intent: 'combat', outcome: 'Breton raiders attack! You help hold the walls against the siege.', stat_deltas: { health: -25, skills: { combat: 10 }, relationship: 20 }, hours_passed: 3 }
    ]
  },
  camlorn: {
    id: 'camlorn',
    name: 'Camlorn',
    type: 'fortress',
    region: 'high_rock',
    description: "The ancient fortress of Camlorn stands as a reminder of the Direnni Hegemony's power. Breton mages once ruled from this castle, and though the Direnni have fallen, their descendants still maintain the fortress. The surrounding lands are hunted by giants, and the fortress serves as a base for those who dare venture into the wilds.",
    atmosphere: 'Ancient, magical, fortified, mysterious',
    actions: [
      { id: 'explore_fortress', label: 'Explore the ancient fortress', intent: 'work', outcome: 'The stone walls date to the First Era. Secrets hide in every corner.', stat_deltas: { skills: { history: 5 } }, hours_passed: 3 },
      { id: 'direnni_heir', label: 'Seek the Direnni heir', intent: 'work', outcome: '"The last of the Direnni bloodline lives here, hiding from the world."', stat_deltas: { relationship: 10, skills: { magic: 3 } }, hours_passed: 2 },
      { id: 'mage_tower_study', label: 'Study in the mage tower', intent: 'work', outcome: 'The residual magic of the Direnni enhances your arcane abilities.', stat_deltas: { skills: { magic: 8 }, gold: -20 }, hours_passed: 4 },
      { id: 'giant_hunt', label: 'Hunt the valley giants', intent: 'combat', outcome: 'The giants terrorize the countryside. Local lords pay for their heads.', stat_deltas: { health: -25, skills: { combat: 10 }, gold: 60 }, hours_passed: 4 },
      { id: 'ancient_vault', label: 'Open the ancient vault', intent: 'work', outcome: 'The locked chamber holds treasures from the height of Direnni power.', stat_deltas: { skills: { lockpicking: 6 }, gold: 100, corruption: 5 }, hours_passed: 3 },
      { id: 'knight_order_join', label: 'Join the Knights of the Glen', intent: 'work', outcome: 'The local order maintains the old ways. Their honor is legendary.', stat_deltas: { relationship: 8, skills: { combat: 4 } }, hours_passed: 1 },
      { id: 'ley_line_nexus', label: 'Find the ley line nexus', intent: 'work', outcome: 'Magic converges here powerfully. The site amplifies all spells.', stat_deltas: { skills: { magic: 10 }, corruption: 5 }, hours_passed: 2 },
      { id: 'fortress_defense', label: 'Defend against raiders', intent: 'combat', outcome: 'Bandits try to claim the abandoned sections. You drive them off.', stat_deltas: { health: -15, skills: { combat: 6 }, relationship: 5 }, hours_passed: 2 }
    ]
  }
};