export const ES_LOCATIONS_EXPANDED: Record<string, any> = {
  the_bee_and_barb: {
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