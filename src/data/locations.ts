export const LOCATIONS: Record<string, any> = {
  'orphanage': {
    id: 'orphanage',
    name: "The Orphanage",
    atmosphere: "cold, damp, smelling of stale porridge, unwashed bodies, and the sharp tang of lye",
    danger: 5,
    x: 80, y: 70,
    npcs: ['constance_michel', 'grelod_the_kind'],
    description: "Your 'home'. A bleak, stone-walled building in the poorer district of town. The roof leaks during the frequent rains, and the drafty windows offer no protection from the biting winter winds. The children here are thin and fearful, their eyes darting to the shadows where the matron might be lurking. The air is thick with unspoken misery, the smell of stale cabbage soup, and the desperate hope of one day escaping the iron grip of Matron Grelod. Every creaking floorboard serves as a reminder of the punishments that await the disobedient.",
    actions: [
      { id: 'sleep', label: "Sleep in your cot", intent: "neutral", outcome: "You curl up on the thin, lumpy mattress, pulling the scratchy wool blanket tight. You try to ignore the cold and the muffled sobs of the younger children. You wake up feeling slightly more rested, though your muscles ache from the hard wooden slats.", stat_deltas: { stamina: 30, stress: -10, lust: -5 } },
      { id: 'clean_floors', label: "Scrub the stone floors", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You spend hours on your knees, your hands raw and bleeding from the harsh lye soap. The cold stone bites into your joints. For your grueling labor, you are tossed a small, moldy crust of bread.", fail_outcome: "Your arms give out and you collapse from exhaustion before finishing the grand hall. Grelod finds you and beats you mercilessly with her cane, leaving welts across your back.", stat_deltas: { stamina: -15, stress: 5, purity: 2 }, fail_stat_deltas: { stamina: -20, pain: 10, stress: 15, trauma: 5 }, new_items: [{ name: "Stale Bread Crust", type: "consumable", rarity: "common", description: "Hard as a rock and speckled with mold, but hunger makes it a feast." }] },
      { id: 'travel_market', label: "Sneak out to the Town Square", intent: "stealth", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You wait for Constance to turn her back, slipping past the heavy oak doors and into the relative freedom of the city streets.", fail_outcome: "Grelod catches you by the ear just as you reach the door! You manage to wriggle free and run, but not before taking a stinging blow to the side of your head.", stat_deltas: { stamina: -5 }, fail_stat_deltas: { pain: 10, health: -5, stress: 15 }, new_location: 'town_square' },
      { id: 'travel_academy', label: "Head to the School", intent: "travel", outcome: "You make the long, cold trek to the town school, clutching your meager belongings.", stat_deltas: { stamina: -10 }, new_location: 'school' }
    ]
  },
  'school': {
    id: 'school',
    name: "The Town School",
    atmosphere: "smelling of old parchment, chalk dust, and strict discipline",
    danger: 10,
    x: 60, y: 30,
    npcs: [],
    description: "A strict institution of learning funded by the local nobility. The halls echo with droning lectures and the sharp crack of the headmaster's ruler. The instructors are unforgiving, demanding perfection, while the older, wealthier students often prey on the weak and impoverished orphans. The scent of old parchment and chalk dust is suffocating, a constant reminder of the rigid expectations placed upon you.",
    actions: [
      { id: 'attend_class', label: "Attend classes", intent: "education", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "You focus intensely on the complex arcane theories and historical texts, feeling your mind expand despite the oppressive atmosphere.", fail_outcome: "Exhaustion overtakes you and you fall asleep at your desk. The instructor humiliates you in front of the entire class, making you wear the dunce cap.", stat_deltas: { willpower: 10, stress: 10, stamina: -10 }, fail_stat_deltas: { stress: 20, trauma: 5, stamina: -5 }, skill_deltas: { school_grades: 5 }, fail_skill_deltas: { school_grades: -2 } },
      { id: 'study_library', label: "Study in the Library", intent: "education", outcome: "You seek refuge in the dusty, silent library, spending hours poring over ancient tomes hidden in the back corners.", stat_deltas: { willpower: 5, stress: 5, stamina: -5 }, skill_deltas: { school_grades: 2 } },
      { id: 'travel_market', label: "Walk to the Town Square", intent: "travel", outcome: "You leave the stifling school grounds and head towards the bustling noise of the square.", stat_deltas: { stamina: -10 }, new_location: 'town_square' },
      { id: 'travel_orphanage', label: "Return to the Orphanage", intent: "travel", outcome: "With a heavy heart, you trudge back to the bleak walls of the orphanage.", stat_deltas: { stamina: -10 }, new_location: 'orphanage' }
    ]
  },
  'town_square': {
    id: 'town_square',
    name: "Town Square",
    atmosphere: "bustling, smelling of fresh bread, roasting meats, woodsmoke, and the damp mist from the alleys",
    danger: 20,
    x: 82, y: 68,
    npcs: ['brynjolf', 'brand_shei'],
    description: "The vibrant, chaotic heart of the town. Stalls line the cobblestone streets, selling everything from fresh produce to stolen trinkets. Wealthy merchants in fine silks brush past ragged beggars. Thieves and guards eye each other warily across the crowded plaza. It's a place of opportunity, but also immense danger for an unprotected youth. The cacophony of shouting vendors, clinking coins, and braying livestock is overwhelming.",
    actions: [
      { id: 'work_stall', label: "Work at a merchant stall", intent: "work", skill_check: { stat: "stamina", difficulty: 30 }, outcome: "You spend the day hauling heavy crates and shouting prices until your throat is raw. It's exhausting, backbreaking work, but the merchant tosses you a few coins at the end of the day.", fail_outcome: "Your tired arms give out and you drop a crate of fragile glass goods. The merchant screams at you and fires you without pay, threatening to call the guards.", stat_deltas: { stamina: -20, stress: 10 }, fail_stat_deltas: { stamina: -10, stress: 20, trauma: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm. Cold, hard, and necessary." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm. Cold, hard, and necessary." }] },
      { id: 'beg_gold', label: "Beg for coins", intent: "social", skill_check: { stat: "purity", difficulty: 20 }, outcome: "You put on your most pathetic expression. A wealthy merchant, perhaps feeling a twinge of guilt, tosses a single coin at your feet with a look of profound pity.", fail_outcome: "A passing town guard kicks dirt at you, calling you a nuisance and threatening to throw you in the dungeons if you don't move along.", stat_deltas: { purity: -5, stress: 5 }, fail_stat_deltas: { stress: 10, trauma: 5 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm. Cold, hard, and necessary." }] },
      { id: 'buy_food', label: "Scrounge a hot meal from a vendor", intent: "social", outcome: "You linger near a food stall looking hungry and pathetic until the vendor, sighing heavily, shoves a bowl of lukewarm stew at you. It's not much, but it fills the hollow ache in your belly.", stat_deltas: { stamina: 10, stress: -10 } },
      { id: 'travel_orphanage', label: "Return to the Orphanage", intent: "travel", outcome: "You trudge back to the orphanage, dreading the matron's inevitable wrath.", stat_deltas: { stamina: -5 }, new_location: 'orphanage' },
      { id: 'travel_alleyways', label: "Slip into the Alleyways", intent: "stealth", outcome: "You find a dark, narrow path leading away from the crowds and into the dangerous, shadowed alleyways.", stat_deltas: { stress: 10 }, new_location: 'alleyways' },
      { id: 'travel_docks', label: "Head to the Docks", intent: "travel", outcome: "You walk down the sloping streets towards the misty, salt-smelling docks.", stat_deltas: { stamina: -5 }, new_location: 'docks' },
      { id: 'travel_temple', label: "Seek refuge at the Temple", intent: "travel", outcome: "You walk towards the serene, quiet gardens of the Temple, seeking a moment of peace.", stat_deltas: { stamina: -5 }, new_location: 'temple_gardens' }
    ]
  },
  'temple_gardens': {
    id: 'temple_gardens',
    name: "Temple Gardens",
    atmosphere: "peaceful, smelling of blooming flowers and incense",
    danger: 5,
    x: 85, y: 65,
    npcs: [],
    description: "A rare place of tranquility in the town. Priests tend to the flora, and citizens come to pray for love and peace. The shadows under the large ancient trees offer seclusion, and the air is thick with the sweet, heady scent of blooming nightshade and burning incense. The gentle trickle of a stone fountain provides a soothing backdrop to the quiet murmurs of the devout.",
    actions: [
      { id: 'pray', label: "Pray at the altar", intent: "neutral", outcome: "You kneel before the altar. A sense of calm washes over you.", stat_deltas: { stress: -20, trauma: -5, purity: 5 } },
      { id: 'rest_bench', label: "Rest on a secluded bench", intent: "neutral", outcome: "You sit and watch the leaves fall. It's quiet here.", stat_deltas: { stamina: 15, stress: -10 } },
      { id: 'drink_fountain', label: "Drink from the temple fountain", intent: "neutral", outcome: "The fountain water is clean and cold. You drink deeply, feeling refreshed.", stat_deltas: { stamina: 5 } },
      { id: 'wash_fountain', label: "Wash in the fountain", intent: "neutral", outcome: "You cup the cool, clear water and wash your face and hands. The grime of the streets dissolves away, and you feel a little more presentable.", stat_deltas: { stress: -5, hygiene: 8, purity: 2 }, hours_passed: 1 },
      { id: 'tend_garden', label: "Help tend the gardens", intent: "work", outcome: "The priests welcome your help weeding and watering the flower beds. The honest labor in the sunshine feels good.", stat_deltas: { stamina: -15, stress: -10, purity: 3 }, skill_deltas: { housekeeping: 2, tending: 3 }, hours_passed: 2 },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You leave the peace of the gardens behind.", stat_deltas: { stamina: -5 }, new_location: 'town_square' },
      { id: 'travel_wilds', label: "Wander into the Forest", intent: "travel", outcome: "You slip out the city gates into the dense forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'alleyways': {
    id: 'alleyways',
    name: "The Alleyways",
    atmosphere: "dark, claustrophobic, reeking of sewage and decay",
    danger: 60,
    x: 82, y: 72,
    npcs: [],
    description: "The sprawling, dangerous paths between buildings. It is home to vagrants and criminals. Shadows seem to move on their own here, and the air is thick with danger and illicit desires. The cobblestones are slick with unknown grime, and the stench of sewage and decay is overpowering. Every footstep echoes ominously, and you constantly feel eyes watching you from the darkness.",
    actions: [
      { id: 'scavenge_trash', label: "Scavenge in the muck", intent: "work", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "You find a discarded iron dagger hidden in the filth.", fail_outcome: "A rat bites your hand before scurrying away!", stat_deltas: { purity: -5, stress: 10 }, fail_stat_deltas: { health: -10, pain: 15, stress: 20, trauma: 5 }, new_items: [{ name: "Rusty Iron Dagger", type: "weapon", rarity: "common", description: "A discarded, rusted blade found in the muck. The edge is dull, chipped, and stained with questionable brown spots. It's barely sharp enough to cut cheese, but gripping its worn, sweat-stained leather hilt gives you a slight sense of security in these dark alleys. It smells faintly of old blood, rust, and desperation." }] },
      { id: 'travel_market', label: "Climb back to the Town Square", intent: "travel", outcome: "You scramble back to the main streets.", stat_deltas: { stamina: -10 }, new_location: 'town_square' },
      { id: 'travel_brothel', label: "Sneak into the Brothel", intent: "stealth", outcome: "You follow the sweet, sickly smell deeper into the alleys.", stat_deltas: { stress: 15, lust: 10 }, new_location: 'brothel' },
      { id: 'travel_docks', label: "Head to the Docks", intent: "travel", outcome: "You navigate the labyrinthine alleys towards the docks.", stat_deltas: { stamina: -10 }, new_location: 'docks' },
      { id: 'travel_home', label: "Return to your Safehouse", intent: "travel", outcome: "You duck into the familiar alley and climb the creaking stairs to your room.", stat_deltas: { stamina: -3 }, new_location: 'home' }
    ]
  },
  'forest': {
    id: 'forest',
    name: "The Dark Forest",
    atmosphere: "dense, autumnal, filled with the sounds of unseen wildlife",
    danger: 40,
    x: 90, y: 60,
    npcs: [],
    description: "The deep forests outside the town. Beautiful but treacherous. Wild animals and bandits roam freely here. The canopy is so thick that it blocks out most of the sunlight, casting the forest floor in perpetual twilight. The air is cool and damp, filled with the rustling of unseen creatures and the distant, lonely howl of wolves.",
    actions: [
      { id: 'forage', label: "Forage for ingredients", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You gather some useful herbs and mushrooms.", fail_outcome: "You wander aimlessly, getting scratched by thorns.", stat_deltas: { stamina: -15 }, fail_stat_deltas: { stamina: -20, pain: 5, stress: 10 }, skill_deltas: { foraging: 3 }, new_items: [{ name: "Blue Mountain Flower", type: "consumable", rarity: "common", description: "Useful for alchemy." }] },
      { id: 'travel_temple', label: "Return to the City", intent: "travel", outcome: "You head back towards the safety of the town's walls.", stat_deltas: { stamina: -10 }, new_location: 'temple_gardens' },
      { id: 'travel_farm', label: "Walk to the Farm", intent: "travel", outcome: "You follow a dirt path towards the nearby farm.", stat_deltas: { stamina: -15 }, new_location: 'farm' },
      { id: 'travel_lake', label: "Head to the Lake", intent: "travel", outcome: "You follow the sound of running water through the trees to a shimmering lake.", stat_deltas: { stamina: -10 }, new_location: 'lake' },
      { id: 'travel_swamp', label: "Venture towards the Swamps", intent: "travel", outcome: "The trees thin out as the ground grows soggy and foul-smelling.", stat_deltas: { stamina: -20, stress: 10 }, new_location: 'swamp' }
    ]
  },
  'docks': {
    id: 'docks',
    name: "The Docks",
    atmosphere: "foggy, smelling of brine, dead fish, and cheap ale",
    danger: 30,
    x: 85, y: 70,
    npcs: [],
    description: "Wooden walkways stretch out over the dark, churning waters. Fishermen haul in their catches while workers toil under the harsh gaze of their overseers. It's a rough place, especially at night, when the fog rolls in thick and heavy, obscuring the unsavory deals and violent encounters that take place in the shadows. The smell of brine, dead fish, and cheap ale is inescapable.",
    actions: [
      { id: 'fish', label: "Work sorting fish", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You spend hours covered in fish guts, but you earn your pay.", fail_outcome: "You slip and fall into the freezing, filthy water!", stat_deltas: { stamina: -20, purity: -5 }, fail_stat_deltas: { health: -5, stress: 20, trauma: 5 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'swim', label: "Swim in the lake", intent: "neutral", outcome: "The water is freezing, but it washes away the grime of the city.", stat_deltas: { stamina: -10, stress: -10, purity: 5 }, skill_deltas: { swimming: 2 } },
      { id: 'bathe_docks', label: "Wash yourself at the water pump", intent: "neutral", outcome: "You strip to the waist and scrub yourself clean under the icy water pump near the fishmonger's stall. Dock workers whistle and jeer, but at least you're clean.", stat_deltas: { stress: -5, hygiene: 10, purity: 2 }, hours_passed: 1 },
      { id: 'travel_beach', label: "Follow the coast to the Beach", intent: "travel", outcome: "You walk along the rocky coastline away from the docks.", stat_deltas: { stamina: -10 }, new_location: 'beach' },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You walk back up the wooden stairs to the city.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'brothel': {
    id: 'brothel',
    name: "The Brothel",
    atmosphere: "hazy, sweet-smelling, filled with moans and heavy breathing",
    danger: 70,
    x: 80, y: 75,
    npcs: [],
    description: "A hidden den of iniquity deep within the alleys. Patrons lie on plush velvet cushions, lost in narcotic hazes or engaging in base desires. The air itself makes you feel lightheaded and flushed, thick with the scent of exotic perfumes, sweat, and spilled wine. The lighting is dim and red, casting long, suggestive shadows across the room.",
    actions: [
      { id: 'serve_drinks', label: "Serve drinks (and more)", intent: "work", skill_check: { stat: "lust", difficulty: 50 }, outcome: "You navigate the handsy patrons, earning a significant amount of coin, though you feel degraded.", fail_outcome: "A patron gets too aggressive. You manage to escape, but you are shaken and unpaid.", stat_deltas: { stamina: -15, stress: 20, lust: 15, purity: -10, trauma: 5 }, fail_stat_deltas: { pain: 10, stress: 30, trauma: 15, lust: 20 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'dance_stage', label: "Dance on the stage", intent: "work", skill_check: { stat: "stamina", difficulty: 45 }, outcome: "You climb onto the small, candlelit stage and move to the rhythm of the lute player in the corner. The crowd watches, enraptured. Coins are tossed at your feet.", fail_outcome: "You stumble and trip on the uneven boards. The crowd laughs cruelly. You slink off the stage in shame.", stat_deltas: { stamina: -20, stress: 15, lust: 10, allure: 3, purity: -5 }, fail_stat_deltas: { stress: 25, trauma: 5, stamina: -10 }, skill_deltas: { dancing: 4, seduction: 2 }, fail_skill_deltas: { dancing: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'travel_alleyways', label: "Flee back to the Alleyways", intent: "flee", outcome: "You stumble out of the hazy den, gasping for cleaner air.", stat_deltas: { stamina: -5, stress: -5 }, new_location: 'alleyways' }
    ]
  },
  'farm': {
    id: 'farm',
    name: "The Farm",
    atmosphere: "smelling of manure, hay, and fresh earth",
    danger: 15,
    x: 95, y: 65,
    npcs: [],
    description: "A large farm outside the city walls. Fields of wheat stretch out like a golden sea, and large, drafty barns house various livestock. The farmhands are gruff but generally leave you alone if you work hard. The smell of manure, hay, and fresh earth is strong, a stark contrast to the stench of the city alleys.",
    actions: [
      { id: 'farm_labor', label: "Do manual labor in the fields", intent: "work", skill_check: { stat: "stamina", difficulty: 50 }, outcome: "Backbreaking work under the sun. You are exhausted but paid.", fail_outcome: "You collapse from the heat. The farmer yells at you and kicks you off the property.", stat_deltas: { stamina: -30, stress: 5 }, fail_stat_deltas: { health: -10, stamina: -40, pain: 10, stress: 15 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'milk_cows', label: "Milk the cows", intent: "work", outcome: "You spend the morning milking the cows. The farmer's wife gives you a bowl of fresh milk and a heel of bread as payment.", stat_deltas: { stamina: -10, stress: -5 }, skill_deltas: { housekeeping: 2 }, hours_passed: 2 },
      { id: 'sleep_barn', label: "Sleep in the barn hay loft", intent: "neutral", outcome: "You burrow into the warm, sweet-smelling hay in the barn loft. The gentle sounds of the animals below are oddly comforting. You sleep deeply.", stat_deltas: { stamina: 35, stress: -15 }, hours_passed: 8 },
      { id: 'eat_garden', label: "Steal vegetables from the garden", intent: "stealth", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "You grab a handful of carrots and a turnip from the kitchen garden when no one is looking. Your stomach growls in anticipation.", fail_outcome: "The farmer's dog spots you and barks furiously! You drop the vegetables and run.", stat_deltas: { stress: 5 }, fail_stat_deltas: { stress: 15, stamina: -10 }, skill_deltas: { skulduggery: 1 } },
      { id: 'tend_crops', label: "Help tend the crops", intent: "work", outcome: "You spend the afternoon weeding, watering, and checking the wheat for blight. The farmer nods approvingly at your work.", stat_deltas: { stamina: -15, stress: -5, willpower: 3 }, skill_deltas: { tending: 4 }, hours_passed: 3 },
      { id: 'travel_wilds', label: "Head into the Forest", intent: "travel", outcome: "You leave the cultivated fields for the untamed forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'swamp': {
    id: 'swamp',
    name: "The Swamp",
    atmosphere: "thick, humid, smelling of rot and ancient magic",
    danger: 80,
    x: 95, y: 80,
    npcs: [],
    description: "The treacherous swamplands. The mud sucks at your boots with every step, and strange, tentacled flora pulse in the gloom. It feels like the land itself is watching you. The air is thick, humid, and smells of rot and ancient, stagnant magic. Unearthly croaks and splashes echo through the mist, warning of the horrors lurking beneath the murky water.",
    actions: [
      { id: 'gather_rare_herbs', label: "Search for rare swamp flora", intent: "work", skill_check: { stat: "willpower", difficulty: 70 }, outcome: "You find a glowing mushroom, carefully avoiding the toxic pools.", fail_outcome: "You step into a deep bog! Leeches attach to you before you can scramble out.", stat_deltas: { stamina: -20, stress: 15 }, fail_stat_deltas: { health: -20, pain: 20, stress: 30, trauma: 10, purity: -10 }, new_items: [{ name: "Glowing Mushroom", type: "consumable", rarity: "rare", description: "Pulses with strange energy." }] },
      { id: 'travel_wilds', label: "Flee back to the Forest", intent: "flee", outcome: "You scramble out of the muck, desperate for solid ground.", stat_deltas: { stamina: -15, stress: -5 }, new_location: 'forest' }
    ]
  },
  'lake': {
    id: 'lake',
    name: "The Lake",
    atmosphere: "serene, shimmering, smelling of fresh water and wildflowers",
    danger: 25,
    x: 92, y: 55,
    npcs: [],
    description: "A large, clear lake fed by mountain streams, hidden within the forest. Smooth grey stones line the shore, and tall reeds sway gently in the breeze. The water is crystal-clear in the shallows, darkening to an inky, unknowable depth at the center. Dragonflies hum over the surface. It is peaceful here, but the wilderness is never truly safe.",
    actions: [
      { id: 'swim_lake', label: "Swim in the lake", intent: "neutral", skill_check: { stat: "stamina", difficulty: 25 }, outcome: "You dive into the cool, refreshing water. The grime and tension of the city wash away as you float on your back, watching clouds drift by.", fail_outcome: "You wade in too deep and a sudden current pulls you under. You swallow water and barely drag yourself back to shore, coughing and shivering.", stat_deltas: { stamina: -10, stress: -15, purity: 5, hygiene: 10 }, fail_stat_deltas: { health: -10, stamina: -20, stress: 15, trauma: 5 }, skill_deltas: { swimming: 3 } },
      { id: 'bathe_lake', label: "Bathe and wash yourself", intent: "neutral", outcome: "You strip down and scrub yourself clean in the cold but refreshing water. The dirt and sweat of days of hardship dissolve away, leaving your skin tingling.", stat_deltas: { stress: -10, hygiene: 15, purity: 3 }, hours_passed: 1 },
      { id: 'fish_lake', label: "Fish from the shore", intent: "work", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "After patient waiting, you hook a fat silver trout. Fresh food at last!", fail_outcome: "You sit for hours without a single bite. The mosquitoes feast on you instead.", stat_deltas: { stamina: -10, stress: 5 }, fail_stat_deltas: { stamina: -15, stress: 10, pain: 3 }, new_items: [{ name: "Silver Trout", type: "consumable", rarity: "common", description: "A fresh-caught fish, its scales gleaming. Eating it would restore energy and hunger." }] },
      { id: 'travel_forest', label: "Return to the Forest", intent: "travel", outcome: "You follow the trail back through the trees.", stat_deltas: { stamina: -5 }, new_location: 'forest' },
      { id: 'travel_beach', label: "Follow the shore to the Beach", intent: "travel", outcome: "You walk along the lakeshore until the trees thin and sand replaces stone.", stat_deltas: { stamina: -10 }, new_location: 'beach' }
    ]
  },
  'beach': {
    id: 'beach',
    name: "The Beach",
    atmosphere: "windswept, salty, the crashing of waves on coarse sand",
    danger: 30,
    x: 97, y: 50,
    npcs: [],
    description: "A desolate stretch of grey-brown sand where the lake meets a rocky cove. Driftwood and seaweed litter the shore. The wind here is constant and biting, carrying the tang of salt and decay. Tide pools hold strange, colourful creatures, and the distant cliffs are riddled with dark caves. It's exposed and lonely, but the vastness of the water offers a strange sense of freedom.",
    actions: [
      { id: 'beachcomb', label: "Comb the beach for valuables", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "Between the pebbles you find a small, barnacle-encrusted chest wedged in the rocks. Inside is a handful of old coins.", fail_outcome: "You find nothing but damp sand and disappointment. A wave soaks you to the bone.", stat_deltas: { stamina: -10, stress: 5 }, fail_stat_deltas: { stamina: -15, stress: 10, hygiene: -5 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'swim_beach', label: "Swim in the surf", intent: "neutral", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You plunge into the cold waves, fighting the current. It's exhilarating! Your body feels strong and clean.", fail_outcome: "A rogue wave slams you into the rocks! You gasp for air and crawl back to shore, scraped and bruised.", stat_deltas: { stamina: -15, stress: -10, hygiene: 10 }, fail_stat_deltas: { health: -15, pain: 15, stamina: -25, stress: 10, trauma: 3 }, skill_deltas: { swimming: 4, athletics: 2 } },
      { id: 'sunbathe', label: "Rest in a sheltered cove", intent: "neutral", outcome: "You find a warm spot between the rocks, sheltered from the wind. The sun's warmth soaks into your aching muscles and you doze off to the sound of the waves.", stat_deltas: { stamina: 20, stress: -15, pain: -5 }, hours_passed: 2 },
      { id: 'exercise_beach', label: "Run along the sand", intent: "neutral", outcome: "You run barefoot along the hard-packed sand near the waterline. Your lungs burn with the salt air, but you feel faster and stronger.", stat_deltas: { stamina: -20, stress: -5, pain: 3 }, skill_deltas: { athletics: 3 }, hours_passed: 1 },
      { id: 'travel_lake', label: "Walk back to the Lake", intent: "travel", outcome: "You follow the shoreline back towards the treeline.", stat_deltas: { stamina: -10 }, new_location: 'lake' },
      { id: 'travel_docks', label: "Head to the Docks", intent: "travel", outcome: "You follow the coast towards the town docks.", stat_deltas: { stamina: -15 }, new_location: 'docks' }
    ]
  },
  'home': {
    id: 'home',
    name: "Your Safehouse",
    atmosphere: "quiet, dusty, but safe — the smell of old wood and dried herbs",
    danger: 0,
    x: 75, y: 75,
    npcs: [],
    description: "A tiny, cramped room above a disused shop in a forgotten alley. The roof leaks, the floor creaks, and the single window is cracked. But it's yours. A thin mattress on the floor, a battered chest for your belongings, and a small clay stove for heating water. It's not much, but it's the only place in the world where you can lock the door and feel something close to safety.",
    actions: [
      { id: 'sleep_home', label: "Sleep in your bed", intent: "neutral", outcome: "You collapse onto the thin mattress. The familiar sounds of the building settling around you are oddly comforting. You sleep deeply and without nightmares for once.", stat_deltas: { stamina: 40, stress: -20, pain: -5 }, hours_passed: 8 },
      { id: 'eat_rations', label: "Eat from your supplies", intent: "neutral", outcome: "You open the battered chest and eat what little food you have squirreled away. It's not a feast, but it fills the hollow ache in your belly.", stat_deltas: { stamina: 10, stress: -5 } },
      { id: 'wash_home', label: "Wash with the basin water", intent: "neutral", outcome: "You heat a small pot of water on the clay stove and scrub yourself clean with a rag. The warm water feels like a luxury.", stat_deltas: { stress: -10, hygiene: 20, pain: -3 }, hours_passed: 1 },
      { id: 'cook_home', label: "Cook a simple meal", intent: "work", skill_check: { stat: "willpower", difficulty: 25 }, outcome: "You prepare a simple but filling stew from odds and ends. The smell fills your tiny room with warmth. Your cooking skills improve.", fail_outcome: "You burn the food badly. The acrid smoke fills the room and you have to open the window, attracting attention from the alley below.", stat_deltas: { stamina: 15, stress: -5 }, fail_stat_deltas: { stress: 10, stamina: -5 }, skill_deltas: { cooking: 3 } },
      { id: 'tend_garden_home', label: "Tend the windowsill herbs", intent: "work", outcome: "You carefully water and trim the small pots of herbs on your windowsill. The mint is thriving, and the chamomile is about to bloom.", stat_deltas: { stress: -10, willpower: 3 }, skill_deltas: { tending: 3 }, hours_passed: 1 },
      { id: 'exercise_home', label: "Exercise in your room", intent: "neutral", outcome: "Push-ups, sit-ups, squats — the floor is hard and the space is cramped, but you push yourself. Your muscles burn pleasantly.", stat_deltas: { stamina: -15, pain: 3, stress: -5 }, skill_deltas: { athletics: 2 }, hours_passed: 1 },
      { id: 'study_home', label: "Study by candlelight", intent: "education", outcome: "You pour over a battered primer by the flickering light of a tallow candle. The words swim before your tired eyes, but knowledge seeps in.", stat_deltas: { stamina: -10, willpower: 5 }, skill_deltas: { school_grades: 2 }, hours_passed: 2 },
      { id: 'travel_alleyways', label: "Step out into the Alleyways", intent: "travel", outcome: "You lock the flimsy door behind you and descend the creaking stairs into the maze of alleys.", stat_deltas: { stamina: -3 }, new_location: 'alleyways' },
      { id: 'travel_market', label: "Head to the Town Square", intent: "travel", outcome: "You navigate the back alleys to the bustling main streets.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  }
};
