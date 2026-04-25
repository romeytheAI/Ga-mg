export const TIME_OF_DAY_DESCRIPTIONS: Record<string, Record<string, string>> = {
  the_bee_and_barb: {
    dawn: "Morning light filters through grimy windows. Brynda stokes the fire as the first customers shuffle in for breakfast.",
    morning: "The tavern fills with merchants breaking their fast and locals gossiping over ale. The smell of bread and stew hangs in the air.",
    noon: "Lunch crowd fills the tables. A bard plays in the corner while traders count their coin.",
    afternoon: "The afternoon lull settles in. A few regulars nurse drinks, and Brynda polishes mugs behind the bar.",
    dusk: "Evening brings the biggest crowd. Torches flicker as workers pour in from the streets, voices rising in warmth.",
    night: "The tavern glows with firelight and laughter. Secrets are exchanged over drinks, and shadows pool in the corners.",
    midnight: "Only the hardest drinkers remain. Brynda counts the day's take as the fire burns low."
  },
  riften_docks: {
    dawn: "Argonians drag in their nets, the first catch of the day splashing in the canal. Mist rises from the water.",
    morning: "Dock workers shout as crates are unloaded. The smell of fish and salt fills the air.",
    noon: "The sun beats down on the planks. Merchants bargain aggressively, traders check their goods.",
    afternoon: "Activity slows in the heat. A few figures slip between warehouses, making hidden deals.",
    dusk: "Workers pack up their tools. Some head to the tavern, others disappear into the shadows.",
    night: "The docks empty except for the night watch. A boat arrives silently, its cargo covered in tarps.",
    midnight: "Only rats and smugglers move now. The canal reflects torchlight from distant windows."
  },
  mistveil_keep: {
    dawn: "The Jarl's palace wakes slowly. Servants sweep floors while guards take their positions.",
    morning: "Court is in session. Petitioners line up while the Jarl listens with barely concealed boredom.",
    noon: "The great hall buzzes with political gossip. Nobles scheme in corners, servants scurry about.",
    afternoon: "The Court Wizard's tower smokes faintly. Scholars hurry past with armloads of books.",
    dusk: "Torches are lit throughout the keep. Shadows lengthen in the corridors.",
    night: "The palace grows quiet. A few lights burn in the Jarl's chambers, and guards patrol with torches.",
    midnight: "Only the night watch moves through empty halls. The Jarl sleeps, but the palace never fully rests."
  },
  the_scorched_hammer: {
    dawn: "Ghorza works the bellows, stoking the forge for the day's work. Metal glows red in the darkness.",
    morning: "The smithy roars with activity. The clang of hammer on anvil echoes down the street.",
    noon: "Smoke and heat pour from the doorway. Customers browse weapons while Ghorza works.",
    afternoon: "A brief lull. Ghorza drinks water and sharpens tools, eyes always watching the street.",
    dusk: "The last customers of the day haggle over prices. The forge glows brighter as evening comes.",
    night: "The forge dies down. Ghorza cleans up, checking her wares for tomorrow's trade.",
    midnight: "The smithy is dark and quiet. Tools hang in等待, ready for another day."
  },
  the_ragged_flagon: {
    dawn: "The hidden entrance stirs as night workers return. The Flagon never truly sleeps.",
    morning: "A few thieves sleep in corners. Those awake count their night's take.",
    noon: "The Flagon fills with quieter business. Fences negotiate, contacts are made.",
    afternoon: "Jobs are planned. Maps are studied. Voices drop as plans are made.",
    dusk: "The guild stirs to life. Those who will work tonight prepare their tools.",
    night: "The Flagon fills. Job assignments are given, nerves are high.",
    midnight: "The地下hall pulses with energy. Success or failure returns with the dawn."
  },
  riften_market: {
    dawn: "Stalls are set up before dawn. Merchants arrange their wares hoping for good trade.",
    morning: "The market bustles. Argonians sell fish, Nords sell weapons, Khajiit sell mysteries.",
    noon: "Crowds peak. Hagglers shout, pickpockets work the masses, guards watch everything.",
    afternoon: "Business slows. Merchants count coin, some pack up, others settle in for the long haul.",
    dusk: "The last customers haggle over remaining goods. Shadows lengthen between stalls.",
    night: "The market empties. Only stray cats and guards patrol the empty square.",
    midnight: "Darkness and silence. But in the shadows, night market traders emerge."
  },
  default: {
    dawn: "Dawn breaks over Riften's wooden rooftops. Gulls cry overhead as the city stirs.",
    morning: "The morning rush fills the streets. Workers head to their trades, merchants open shops.",
    noon: "Riften hums with activity. The market is crowded, the taverns full, the guards alert.",
    afternoon: "The city continues its business. Shadows grow longer as the sun begins to set.",
    dusk: "Evening paints the sky in orange and purple. Lights flicker on in windows throughout the city.",
    night: "Night falls over Riften. Some areas go dark, others come alive with illegal trade.",
    midnight: "The city sleeps but never fully stops. Watchmen patrol, thieves work, secrets are kept."
  }
};

export const WEATHER_DESCRIPTIONS: Record<string, string[]> = {
  Clear: [
    "The sky is a brilliant blue, no clouds to be seen. A perfect day for travel or work.",
    "Sunlight streams down, warm on your face. The air is fresh after last night's rain.",
    "Clear skies stretch infinite above. From the walls, you can see the mountains in the distance.",
    "A gentle breeze carries the smell of the canal. Perfect weather for a walk through the market."
  ],
  Cloudy: [
    "Grey clouds roll overhead, promising rain but not delivering. The mood is sombre.",
    "Fluffy clouds drift across the sun, casting moving shadows on the streets below.",
    "Overcast but dry. The air is cool and comfortable for exertion.",
    "Clouds mass in the west. A storm may be coming, but not yet."
  ],
  Raining: [
    "Rain falls in steady sheets, turning streets to mud and filling the canal. Everyone hurries to find shelter.",
    "A drizzle that's more annoying than soaking. Water drips from every eave and overhang.",
    "Heavy rain pounds the wooden roofs. The sound is deafening in the tavern.",
    "Cold rain cuts through clothing. The rivers swell and the gutters overflow."
  ],
  Snowing: [
    "Snow falls gently, coating everything in white. The city transforms into a winter wonderland.",
    "A blizzard rages. Snow piles in drifts against walls and doors. Only the desperate venture out.",
    "Light snow dusts the streets. Children play while adults worry about supplies.",
    "Snow crunches underfoot. The cold is biting, but the beauty is undeniable."
  ],
  Foggy: [
    "Thick fog rolls in from the canal, so thick you can't see more than a few feet. Shapes emerge and vanish.",
    "Mist clings to the streets, muffling sound and hiding dangers. Best to stay close to walls.",
    "A cold fog that seeps into bones. Torches barely cut through the grey.",
    "The fog thins and thickens unpredictably. Shadows move in the mist."
  ],
  Storming: [
    "Lightning cracks across the sky. Thunder shakes the buildings. A true storm has arrived.",
    "Wind howls through the streets, tearing at loose boards and shutters. A tempest is upon Riften.",
    "Rain comes sideways, driven by fierce wind. The canal surges over its banks.",
    "Thunder rolls continuously. Lightning illuminates the terrified faces of those caught outside."
  ],
  'Blood Red Sky': [
    "An eerie red light fills the sky. The stars are hidden, the moons seem to glow with menace.",
    "The sky burns crimson. The air tastes of copper and ash. Something is very wrong.",
    "Red light paints everything in the color of blood. The hairs on your neck stand up.",
    "Daedric influence. The sky itself seems wrong, twisted by powers beyond comprehension."
  ],
  Aurora: [
    "The northern lights dance across the sky in ribbons of green and purple. Beautiful and unnatural.",
    "Spirals of light twist overhead. The wise say it's an omen, though of what no one knows.",
    "Glowing curtains of color ripple across the darkness. For a moment, all of Tamriel seems magical.",
    "The aurora pulses with inner light. Some say it's the souls of the dead, traveling to Aetherius."
  ]
};

export const TRAVEL_NARRATIVES: Record<string, string[]> = {
  generic_road: [
    "You walk the well-worn road, keeping an eye out for bandits and other dangers.",
    "Dust rises around your feet. The road stretches ahead, promising new adventures.",
    "You pass other travelers, some heading to Riften, others leaving. Everyone has their own story.",
    "The road winds through countryside. Farmland gives way to forest, then back again.",
    "You make good time on the flat ground. The weather holds and the path is clear."
  ],
  generic_wilderness: [
    "You leave the road behind, pushing through undergrowth and navigating by sun and star.",
    "The wilderness is beautiful but dangerous. Strange sounds echo in the distance.",
    "You find a stream to drink from and rest beneath a tree. The forest provides if you know where to look.",
    "Creatures watch from the shadows. You are not alone out here, but neither are you welcome.",
    "The land becomes wild and untamed. Ancient stones mark places of power long forgotten."
  ],
  generic_urban: [
    "You navigate the crowded streets, weaving between merchants, guards, and citizens.",
    "The city's noise surrounds you — vendors shouting, children playing, smiths hammering.",
    "You pass through different districts, each with its own character and dangers.",
    "The smells of the city assault you — food, sewage, smoke, and a thousand other scents.",
    "People push past, wrapped in their own concerns. No one looks twice at another stranger."
  ],
  entering_tavern: [
    "Warmth and noise greet you as you push through the door. The fire crackles invitingly.",
    "The smell of food and drink draws you in. Voices fill the air, mixing and rising.",
    "You find a corner to observe. The tavern is a hive of information if you know how to listen.",
    "The tavern keeper nods as you approach. You've been here before, or at least, you look like you have.",
    "A seat by the fire is empty. You claim it, warming your hands and considering your next move."
  ],
  entering_dungeon: [
    "Darkness swallows you as you descend. The air grows cold and stale.",
    "Ancient stone closes around you. Whatever waits here has been waiting a very long time.",
    "Your torch illuminates glyphs in a language no one speaks anymore. The dead are not the only danger.",
    "You descend deeper. The architecture becomes stranger — Dwemer? Falmer? Something else?",
    "The first challenge awaits. Traps, guards, or puzzles — dungeons always demand something."
  ],
  entering_shop: [
    "Bells jingle as you enter. The shopkeeper looks up with practiced interest.",
    "Wares line the shelves — some legal, some questionable. You browse with care.",
    "The shop is tidy, organized. This merchant takes pride in their business.",
    "Behind the counter, eyes watch you carefully. This is a place for serious buyers.",
    "You find what you're looking for. Now comes the hard part — the negotiation."
  ],
  leaving_city: [
    "You pass through the gates, leaving the city's noise behind. The road calls.",
    "Riften's walls shrink behind you. The countryside spreads out, full of possibility.",
    "You take one last look at the city. It could be weeks or months before you return.",
    "The guard at the gate gives you a long look but waves you through. You're free.",
    "As the city fades, you feel the adventure beginning. Whatever comes next, you've chosen it."
  ],
  arriving_city: [
    "The walls of Riften rise before you. Finally, civilization — or something like it.",
    "You join the stream of travelers entering through the gates. Guards check imports.",
    "The city spreads before you, chaotic and alive. Somewhere in there is what you need.",
    "Noise and smell wash over you. The city overwhelms the senses after the quiet road.",
    "You pass beneath the walls. Whatever happened on the road, you're safe now. Mostly."
  ]
};

export const IDLE_FLAVOR_TEXT: string[] = [
  "A raven lands on a nearby fence post, regards you with unsettling intelligence, then flies away.",
  "A child runs past, chasing a cat that seems entirely unconcerned.",
  "Someone in the crowd drops a coin. By the time you look, it's been picked up by a quick hand.",
  "The distant sound of a forge echoes. Somewhere, metal is being shaped.",
  "A cart rumbles past, loaded with barrels. The driver doesn't look at you.",
  "Two guards exchange words and one laughs. They don't notice you.",
  "A cat stares at you from a rooftop. Its yellow eyes track your every movement.",
  "The wind shifts. For a moment, you smell something strange — skooma, perhaps.",
  "A fly buzzes around your head. You wave it away.",
  "A woman hurries past, head down, arms full of packages. She doesn't see you.",
  "A dog trots by, nose to the ground, following some scent only it knows.",
  "Overhead, a hawk circles. It's looking for something. Or someone.",
  "A merchant shouts his prices. No one stops to listen.",
  "You notice a symbol scratched into a wall — a triangle with an eye. You've seen it before.",
  "The sun moves across the sky. Time passes whether you move or not.",
  "A group of children run past playing some game. For a moment, you remember being young.",
  "Someone coughs violently nearby. They look sick. Very sick.",
  "A guard patrols past, armor gleaming. He doesn't give you a second look.",
  "You hear the clink of coin. Someone's making a deal, somewhere close.",
  "The shadows lengthen. The afternoon is growing old."
];

export const STAT_REACTIVE_FLAVOR: Record<string, string[]> = {
  low_health: [
    "Your vision swims. Each step takes more effort than it should. You need healing soon.",
    "Blood drips from a wound. The world seems far away, distant and unreal.",
    "Your body screams for rest. Every movement sends pain racing through your nerves.",
    "You're not going to last much longer like this. The thought of a bed, any bed, is almost overwhelming.",
    "A wave of dizziness passes over you. The world tilts. You grab a wall to steady yourself."
  ],
  low_stamina: [
    "Your legs ache. Your arms feel heavy. Rest would be welcome right now.",
    "Breath comes in ragged gasps. You've pushed yourself too far, too fast.",
    "Your muscles tremble with exhaustion. One more step, then another. That's all.",
    "The world blurs with fatigue. You could sleep right here, where you stand.",
    "Each footfall hits like a hammer. You need to stop, to rest, to recover."
  ],
  high_corruption: [
    "The corruption whispers from the edges of your mind. Sweet promises, dark temptations.",
    "Your shadow seems to move wrong. Something looks back at you from the darkness.",
    "You hunger for things you shouldn't want. The corruption grows, feeding on your weakness.",
    "The world has different colors now. Deeper, darker, more interesting. More dangerous.",
    "You can feel it in your veins. Power, terrible power, waiting to be used."
  ],
  high_stress: [
    "Your heart races for no reason. The walls seem to close in. You're losing control.",
    "Tremors run through your hands. Your mind won't quiet, won't stop racing.",
    "Every sound makes you flinch. Every shadow hides a threat. You need peace.",
    "The pressure builds behind your eyes. Something has to give. Soon.",
    "You snap at a stranger for no reason. The anger comes so easily now. So does the guilt."
  ],
  high_willpower: [
    "Your resolve is iron. Temptation breaks against your will like waves on stone.",
    "You feel at peace, centered. The chaos of the world cannot touch your inner calm.",
    "Strength flows through you. Not physical, but something deeper. Something unbreakable.",
    "The corruption cannot touch you. Your will is your own, and it is strong.",
    "You face the darkness within and do not flinch. You are master of yourself."
  ],
  high_trauma: [
    "Flashbacks tear through your mind. The past won't stay buried.",
    "You flinch at sudden sounds. Wariness has become paranoia.",
    "Nightmares haunt your sleep. When you wake, you don't know where you are.",
    "The past is always with you. Every corner holds a memory, every shadow a fear.",
    "You've seen too much. Too much death, too much pain. It changes a person."
  ],
  starving: [
    "Your stomach cramps painfully. Food. You need food. Any food.",
    "The world spins. Your body is eating itself for energy.",
    "You'd kill for a meal right now. Literally kill. The hunger is that bad.",
    "Weakness drags at your limbs. Your thoughts turn only to food.",
    "When did you last eat? You can't remember. But you remember the hunger."
  ],
  exhausted: [
    "Your eyes won't stay open. Sleep. Just a few hours. That's all you need.",
    "Every part of you wants to stop, to rest, to sleep for a week.",
    "Your body moves on automatic. You don't have the energy to think.",
    "The bed calls to you. A warm fire, a soft pillow. Is that too much to ask?",
    "Consciousness fades at the edges. You're running on fumes and stubbornness."
  ],
  drunk: [
    "The room spins pleasantly. Everything is funny. The world is great!",
    "Your words come out slurred. Your balance is questionable at best.",
    "Warmth spreads through you. The world is soft at the edges.",
    "You laugh at something no one said. The drink has made everything hilarious.",
    "Blackouts loom at the edges of your memory. Best to stop soon. Probably."
  ]
};

export const DREAM_SEQUENCES: string[] = [
  "You dream of flying over a burning city. Dragons spiral in the smoke-filled sky. Someone calls your name, but you cannot turn.",
  "You walk through endless corridors of a castle that has no doors. Windows show scenes you don't understand.",
  "You stand before a throne of bones. A figure sits upon it, wearing a mask that shifts between faces.",
  "The ocean stretches infinite. You float on your back, watching stars wheel overhead. The water is warm.",
  "You are in a room full of mirrors. Every reflection shows someone else. They all speak at once.",
  "Wind whips through a forest of silver trees. You run, but the forest never ends.",
  "You sit at a table with figures in shadow. They discuss your future as if you aren't there.",
  "Snow falls endlessly. You walk through drifts that reach your waist. Something moves in the white.",
  "You are falling, have been falling forever. The void rushes past. You will never land.",
  "A woman with no face speaks to you. Her voice is music and poison. You cannot remember what she said.",
  "You hold a sword that glows with inner fire. Armies charge at you and you laugh.",
  "The stars go out one by one. Darkness rushes in. In the blackness, something vast breathes.",
  "You are old, so old, and the world has forgotten your name. But you remember what you did.",
  "A child runs through a field of flowers. You know the child. You know what happens to the child.",
  "Fire and ice swirl around you. You are not burned, not frozen. You are both.",
  "The dead walk. They do not attack. They simply stare. They are waiting for something.",
  "You speak a word of power. The world cracks. Reality bleeds at the edges.",
  "A door opens in the sky. Light pours through, blinding and beautiful. Something descends.",
  "You cannot move, cannot speak. Something watches you from the darkness.",
  "The wheel of time turns. You see every age, every era, every ending and beginning. It is too much."
];

export const RUMOR_MILL: string[] = [
  "A merchant whispers to his companion: 'Maven Black-Briar has eyes everywhere. Even the rats in the Ratway report to her.'",
  "An old woman mutters: 'They say the Jarl's wizard is experiments with things that should stay buried.'",
  "Two dock workers argue: 'I saw it! A dragon, flying over the mountains! It was real!'",
  "A drunk slurs: 'The Thieves Guild is back, I tell you. The Flagon is open again. I seen it.'",
  "A priest speaks to no one in particular: 'Azura's star has been bright lately. Something stirs in Oblivion.'",
  "A guard tells his partner: 'There's a vampire nest in the hills. We're not to go near it. Orders from on high.'",
  "A child runs past shouting: 'Dragon! Dragon at the western watchtower!'",
  "A woman in the market says quietly: 'The Companions are werewolves. Everyone knows. No one says.'",
  "A bard sings: '...and the Night Mother speaks to Mercer in the dark... whispers of power...'",
  "An Argonian hisses to another: 'The Hist speaks to us. Soon, the Khajiit will learn what that means.'",
  "A noble's servant drops something: 'The Jarl is planning something big. Maven is furious. I heard names.'",
  "A hunter arrives in town: 'Bandits are moving in force. They're organized. Someone's funding them.'",
  "A woman whispers: 'Ingun Black-Briar. She experiments with poisons. Her father knows. He doesn't stop her.'",
  "A traveling trader says: 'I come from the east. War is coming. The Empire is weakened. Stormcloaks grow bold.'",
  "An old soldier mutters: 'Remember the Red Year. Remember what the Dunmer did. They're not to be trusted.'",
  "A beggar calls out: 'Spare coin for the poor? The Thalmor are watching. They always watch.'",
  "A drunk talks to the wall: 'Daedra in the shrine. I seen it. Golden light and terrible screams.'",
  "A guard comments: 'That new adventurer. They say they're Dragonborn. They have the eyes of it.'",
  "A young man boasts: 'I'm going to join the Companions. Become a legendary warrior! Die gloriously!'",
  "A Nord woman says: 'My grandmother remembered when there were dragons. Real dragons. She says they're back.'"
];

export const LOADING_SCREEN_TIPS: string[] = [
  "In Skyrim, every action has consequences. Choose carefully.",
  "The Companions accept all who prove themselves worthy.",
  "Maven Black-Briar controls Riften. Her reach is longer than you know.",
  "Magic is dangerous but powerful. Use it wisely.",
  "The Thieves Guild operates in the shadows. Their eyes are everywhere.",
  "Daedric Princes offer power at a price. Some prices are worth paying. Others aren't.",
  "Your race determines your starting abilities. Choose what fits your playstyle.",
  "The Companions have a secret. Not all of them are what they seem.",
  "The dark brotherhood sends assassins. They always find their target.",
  "Alchemy is a valuable skill. Learn to make your own potions.",
  "The Stormcloaks want to break from the Empire. The Imperials want to preserve it.",
  "Daedric artifacts are powerful but sometimes cursed. Use with caution.",
  "The College of Winterhold accepts all mages. They don't ask questions.",
  "The Greybeards know the Voice. They teach those who are worthy.",
  "The Blades are returning. They will need a leader.",
  "The Dragonborn has the power of the Voice. You may be the one.",
  "Vampires are real. So are werewolves. Choose your monster carefully.",
  "The Thalmor want to eliminate Talos worship. Not everyone agrees.",
  "The dark between the stars holds many secrets. Some should stay hidden.",
  "When in doubt, trust your companions. They might just save your life."
];