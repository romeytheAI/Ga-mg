export const WINDHELM_LOCATIONS = {
  white_phial: {
    id: 'white_phial',
    name: 'The White Phial',
    type: 'shop',
    region: 'eastmarch',
    description: "Windhelm's premier alchemy shop is a cramped cave of dried herbs, bubbling vials, and exotic ingredients. The Dunmer proprietor Nurelion makes potent potions, though he can be particular. His apprentice queues orders with barely contained eagerness.",
    atmosphere: 'Alchemical, cluttered, pungent, secretive',
    actions: [
      { id: 'buy_potions', label: 'Buy potions', intent: 'work', outcome: '"Potent mixtures. Worth their weight in gold." Nurelion slides bottles across the counter.', stat_deltas: { gold: -75 }, hours_passed: 1 },
      { id: 'sell_ingredients', label: 'Sell ingredients', intent: 'work', outcome: 'Nurelion examines your ingredients. "Acceptable. Not excellent, but acceptable."', stat_deltas: { gold: 40 }, hours_passed: 1 },
      { id: 'learn_alchemy', label: 'Learn alchemy', intent: 'work', outcome: '"The complex art of potion-making requires precision." Nurelion teaches the basics.', stat_deltas: { skills: { alchemy: 5 }, gold: -25 }, hours_passed: 2 },
      { id: 'special_order', label: 'Request special order', intent: 'work', outcome: '"A custom mixture? Perhaps. Bring the rare ingredients."', stat_deltas: { gold: -150 }, hours_passed: 1 },
      { id: 'hear_gossip', label: 'Ask about rare ingredients', intent: 'social', outcome: '"The swamp near the Morrowind border yields unique flora. At a price."', stat_deltas: { relationship: 3, corruption: 2 }, hours_passed: 1 },
      { id: 'apprentice_work', label: 'Work as apprentice', intent: 'work', outcome: 'You sort ingredients, grind roots, and clean vials. The work is tedious but educational.', stat_deltas: { skills: { alchemy: 8 }, gold: 15 }, hours_passed: 4 },
      { id: 'experiment', label: 'Conduct experiments', intent: 'work', outcome: 'You mix ingredients freely, learning from both success and explosive failure.', stat_deltas: { skills: { alchemy: 10 }, health: -5 }, hours_passed: 3 },
      { id: 'vile_secret', label: 'Ask about vial secrets', intent: 'stealth', outcome: 'Nurelion lowers his voice. "There is a potion in the back... for certain inclinations."', stat_deltas: { corruption: 10, gold: -200 }, hours_passed: 1 }
    ]
  },

  candlehearth: {
    id: 'candlehearth',
    name: 'The Candlehearth',
    type: 'tavern',
    region: 'eastmarch',
    description: "Windhelm's oldest tavern glows with warmth against the cold of the frozen east. Fire pits burn in the center, and the smell of roasting meat fills the air. A place where Nords and Dunmer mix uneasily, sharing tales of the war and whispers of rebellion.",
    atmosphere: 'Warm, crowded, storied, tense',
    actions: [
      { id: 'order_ale', label: 'Order Nordic mead', intent: 'neutral', outcome: 'The mead burns going down, warming your chest. Old Nords nod approvingly.', stat_deltas: { stress: -5, gold: -5 }, hours_passed: 1 },
      { id: 'roast_meat', label: 'Order roast', intent: 'neutral', outcome: 'A massive portion of roasted horker appears. The fire pits cook it perfectly.', stat_deltas: { health: 15, gold: -12 }, hours_passed: 1 },
      { id: 'listen_stories', label: 'Listen to war stories', intent: 'social', outcome: 'An old veteran speaks of the Great War. "We held the gates against Daedra..."', stat_deltas: { skills: { history: 3 }, corruption: 2 }, hours_passed: 2 },
      { id: 'join_versus', label: 'Join the Versus club', intent: 'combat', outcome: '"Versus! Versus!" The crowd chants as fighters enter the pit.', stat_deltas: { skills: { combat: 8 }, health: -15, relationship: 5 }, hours_passed: 3 },
      { id: 'stormcloak_talk', label: 'Speak with Stormcloaks', intent: 'social', outcome: '"Skyrim is for the Nords! The Empire has forgotten our ways."', stat_deltas: { corruption: 5, relationship: 3 }, hours_passed: 1 },
      { id: 'rent_room', label: 'Rent a room', intent: 'neutral', outcome: 'The room is warm, the bed is soft. A luxury in the cold city.', stat_deltas: { health: 15, exhaustion: -25, gold: -15 }, hours_passed: 8 },
      { id: 'rumor_hunt', label: 'Hunt for rumors', intent: 'social', outcome: '"Word is, the Palace has secrets. And the Dunmer quarter burns..."', stat_deltas: { relationship: 2, corruption: 3 }, hours_passed: 2 },
      { id: 'brawl', label: 'Start a tavern brawl', intent: 'combat', outcome: 'Your fist connects and the whole tavern erupts! Benor laughs and joins in.', stat_deltas: { skills: { combat: 5 }, health: -20, corruption: 5 }, hours_passed: 1 }
    ]
  },

  palace_kings: {
    id: 'palace_kings',
    name: 'Palace of the Kings',
    type: 'noble',
    region: 'eastmarch',
    description: "The ancient palace of the Snow-Elves towers over Windhelm, now home to the Stormcloak rebellion. Massive stone walls bear the scars of battles, and the throne of the Kings of Skyrim awaits a true ruler. Ulfric Stormcloak holds court here.",
    atmosphere: 'Grand, cold, authoritative, rebellious',
    actions: [
      { id: 'audience_ulfric', label: 'Request audience with Ulfric', intent: 'work', outcome: 'The Jarl sits upon his throne. "You seek to serve the true Skyrim? Speak."', stat_deltas: { relationship: 10 }, hours_passed: 2 },
      { id: 'join_stormcloaks', label: 'Join the Stormcloak cause', intent: 'work', outcome: '"Then we welcome you to fight for Skyrims freedom! For the Nords!"', stat_deltas: { relationship: 20, corruption: 5 }, hours_passed: 1 },
      { id: 'guard_duty', label: 'Serve as palace guard', intent: 'work', outcome: 'You stand watch over the palace. The cold bites, but duty is honor.', stat_deltas: { skills: { combat: 5 }, gold: 30, relationship: 5 }, hours_passed: 4 },
      { id: 'diplomatic_talk', label: 'Discuss the war', intent: 'social', outcome: 'Advisors debate strategy. "The Empire betrays us! We stand alone!"', stat_deltas: { skills: { speech: 3 }, corruption: 3 }, hours_passed: 2 },
      { id: 'galmar_challenge', label: 'Speak with Galmar', intent: 'social', outcome: '"You want to prove yourself? Then go capture an Imperial scout!"', stat_deltas: { relationship: 15, skills: { combat: 3 } }, hours_passed: 1 },
      { id: 'treasure_hall', label: 'Explore the treasury', intent: 'stealth', outcome: 'Shadows hide valuable artifacts. The palace has ancient treasures.', stat_deltas: { corruption: 10, gold: 50 }, hours_passed: 2 },
      { id: 'war_council', label: 'Attend war council', intent: 'work', outcome: 'You sit in as commanders plan the next offensive. Intelligence flows.', stat_deltas: { skills: { history: 5 }, relationship: 8 }, hours_passed: 3 },
      { id: 'royal_battle', label: 'Prove yourself in battle', intent: 'combat', outcome: 'You demonstrate your valor in the training yard. Ulfric watches approvingly.', stat_deltas: { skills: { combat: 10 }, health: -10, relationship: 20 }, hours_passed: 3 }
    ]
  },

  windhelm_market: {
    id: 'windhelm_market',
    name: 'Windhelm Market',
    type: 'market',
    region: 'eastmarch',
    description: "The market district bustles with traders from across the frozen east. Fur, frost, and exotic goods change hands here, while the cold wind carries the smell of the docks. The Gray Quarter looms nearby, a reminder of tensions between races.",
    atmosphere: 'Bustling, cold, commercial, tense',
    actions: [
      { id: 'trade_furs', label: 'Buy furs and pelts', intent: 'work', outcome: 'Traders offer warm furs from the northern forests. Quality merchandise.', stat_deltas: { gold: -80 }, hours_passed: 2 },
      { id: 'sell_loot', label: 'Sell your goods', intent: 'work', outcome: 'Haggling fills the air. Your goods fetch fair prices.', stat_deltas: { gold: 60 }, hours_passed: 1 },
      { id: 'haggle', label: 'Practice haggling', intent: 'work', outcome: 'You drive a hard bargain. The merchant curses but accepts.', stat_deltas: { skills: { speech: 5 }, gold: 15 }, hours_passed: 2 },
      { id: 'stolen_goods', label: 'Ask about stolen goods', intent: 'stealth', outcome: '"Shh. I know a man. Everything has a price, nothing has a name."', stat_deltas: { corruption: 10, gold: 30 }, hours_passed: 1 },
      { id: 'dock_business', label: 'Visit the docks', intent: 'work', outcome: 'Ships unload exotic goods from the far north. Smugglers watch from the shadows.', stat_deltas: { gold: 40, corruption: 3 }, hours_passed: 2 },
      { id: 'nord_trader', label: 'Trade with Nordic sellers', intent: 'social', outcome: '"Outlander! You seek to learn our ways? Start with our furs."', stat_deltas: { relationship: 5 }, hours_passed: 1 },
      { id: 'pickpocket', label: 'Pick pockets', intent: 'stealth', outcome: 'Your fingers find a heavy purse. The crowd provides cover.', stat_deltas: { skills: { stealth: 5 }, gold: 35, corruption: 5 }, hours_passed: 2 },
      { id: 'guild_contact', label: 'Meet Thieves Guild contact', intent: 'stealth', outcome: 'A hooded figure passes you a message. "The guild has work for you."', stat_deltas: { relationship: 10, corruption: 8 }, hours_passed: 1 }
    ]
  },

  gray_quarter: {
    id: 'gray_quarter',
    name: 'The Gray Quarter',
    type: 'alleyway',
    region: 'eastmarch',
    description: "The Dunmer quarter of Windhelm, known as the Gray Quarter, is a depressing district of crumbling buildings and perpetual poverty. After the Red Year, refugees flood here seeking shelter, but cold Nords offer only suspicion. The atmosphere is thick with despair and resentment.",
    atmosphere: 'Depressing, cramped, poverty-stricken, tense',
    actions: [
      { id: 'help_refugees', label: 'Help Dunmer refugees', intent: 'willpower', outcome: 'You distribute food and coin. "You have a kind heart, for a Nord."', stat_deltas: { willpower: 10, gold: -30, relationship: 15 }, hours_passed: 2 },
      { id: 'hear_suffering', label: 'Listen to their stories', intent: 'social', outcome: '"The Red Year took everything. Vulkan burned our homes..."', stat_deltas: { corruption: 3, willpower: 5 }, hours_passed: 2 },
      { id: 'slum_lord', label: 'Speak with the Slum King', intent: 'social', outcome: '"I control who eats and who doesnt here. You want to help? Pay."', stat_deltas: { relationship: 5, corruption: 8 }, hours_passed: 1 },
      { id: 'anti_dunmer_gossip', label: 'Listen to anti-Dunmer sentiment', intent: 'social', outcome: '"Dirty Dunmer! Taking our jobs, our homes..." The hatred is palpable.', stat_deltas: { corruption: 5, relationship: -3 }, hours_passed: 1 },
      { id: 'fence_connections', label: 'Find fence connections', intent: 'stealth', outcome: 'Desperation makes people flexible. Goods move here no questions asked.', stat_deltas: { corruption: 10, gold: 50 }, hours_passed: 2 },
      { id: 'join_protest', label: 'Join the protests', intent: 'corruption', outcome: 'Dunmer and sympathetic Nords protest in the streets. Guards respond with force.', stat_deltas: { health: -15, relationship: 10, corruption: 5 }, hours_passed: 3 },
      { id: 'sponsor_family', label: 'Sponsor a family', intent: 'willpower', outcome: 'You pay for a familys passage to Morrowind. "May the ancestors remember you."', stat_deltas: { willpower: 20, gold: -100, relationship: 25 }, hours_passed: 2 },
      { id: 'dark_secret', label: 'Discover the Dark Brotherhood', intent: 'stealth', outcome: 'In the shadows, you hear the whisper: "We have seen your potential..."', stat_deltas: { corruption: 20, relationship: 10 }, hours_passed: 1 }
    ]
  },

  atherons_rise: {
    id: 'atherons_rise',
    name: 'Atherons Rise',
    type: 'noble',
    region: 'eastmarch',
    description: "The grand estate of House Atheron overlooks Windhelm from the cliffs. The Dunmer noble family built their mansion in defiance of the cold, and the house holds dark secrets. Beautiful Argonian servants maintain pristine gardens, but whispers speak of strange rites within.",
    atmosphere: 'Grand, eerie, wealthy, secretive',
    actions: [
      { id: 'social_call', label: 'Make a social call', intent: 'social', outcome: 'The butler shows you in. "The master will see you momentarily."', stat_deltas: { relationship: 5 }, hours_passed: 2 },
      { id: 'offer_service', label: 'Offer your services', intent: 'work', outcome: '"I have tasks that require discretion. Are you discrete?"', stat_deltas: { relationship: 10, corruption: 5 }, hours_passed: 1 },
      { id: 'explore_estate', label: 'Explore the estate', intent: 'stealth', outcome: 'You wander the grounds. Strange artifacts adorn the gardens... and the crypts.', stat_deltas: { corruption: 10, skills: { history: 3 } }, hours_passed: 3 },
      { id: 'servant_talk', label: 'Speak with the servants', intent: 'social', outcome: '"Master is seldom home. He visits the shrine in the basement often..."', stat_deltas: { corruption: 5, relationship: 5 }, hours_passed: 1 },
      { id: 'buy_artefact', label: 'Purchase ancient artefacts', intent: 'work', outcome: '"This Dwemer gear is genuine. Priced accordingly." The collection is impressive.', stat_deltas: { gold: -200, skills: { history: 5 } }, hours_passed: 2 },
      { id: 'dinner_party', label: 'Attend a dinner party', intent: 'social', outcome: 'The wealthy mix freely. Secrets trade like currency here.', stat_deltas: { relationship: 15, corruption: 10, gold: -50 }, hours_passed: 4 },
      { id: 'basement_secret', label: 'Investigate the basement', intent: 'stealth', outcome: 'Behind a hidden door, you find a Daedric shrine. The master is a worshiper.', stat_deltas: { corruption: 25, skills: { magic: 8 } }, hours_passed: 3 },
      { id: 'inheritance_offer', label: 'Receive an inheritance offer', intent: 'work', outcome: '"Serve House Atheron faithfully, and you shall be rewarded... handsomely."', stat_deltas: { relationship: 30, corruption: 15, gold: 100 }, hours_passed: 2 }
    ]
  }
};