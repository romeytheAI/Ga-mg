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
      { id: 'travel_temple', label: "Seek refuge at the Temple", intent: "travel", outcome: "You walk towards the serene, quiet gardens of the Temple, seeking a moment of peace.", stat_deltas: { stamina: -5 }, new_location: 'temple_gardens' },
      { id: 'travel_park', label: "Walk to the Park", intent: "travel", outcome: "You stroll along the cobblestones towards the open green of the town park.", stat_deltas: { stamina: -5 }, new_location: 'park' },
      { id: 'travel_hospital', label: "Go to the Hospital", intent: "travel", outcome: "You walk to the grey stone hospital on Nightingale Street.", stat_deltas: { stamina: -5 }, new_location: 'hospital' },
      { id: 'travel_shopping', label: "Visit the Shopping Centre", intent: "travel", outcome: "You head towards the well-kept commercial district.", stat_deltas: { stamina: -5 }, new_location: 'shopping_centre' },
      { id: 'travel_cafe', label: "Drop into the Café", intent: "travel", outcome: "You follow the scent of roasting coffee to the cosy café.", stat_deltas: { stamina: -3 }, new_location: 'cafe' },
      { id: 'travel_arcade', label: "Descend to the Arcade", intent: "travel", outcome: "You find the nondescript door and descend the stairs into the gambling den.", stat_deltas: { stamina: -3 }, new_location: 'arcade' },
      { id: 'travel_museum', label: "Visit the Museum", intent: "travel", outcome: "You walk up the steps into the grand museum building.", stat_deltas: { stamina: -5 }, new_location: 'museum' },
      { id: 'travel_dance_studio', label: "Go to the Dance Studio", intent: "travel", outcome: "You walk to the bright studio on Barb Street.", stat_deltas: { stamina: -5 }, new_location: 'dance_studio' }
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
      { id: 'travel_strip_club', label: "Find the Strip Club", intent: "stealth", outcome: "You follow the muffled music to a nondescript door with a red lantern.", stat_deltas: { stress: 10 }, new_location: 'strip_club' },
      { id: 'travel_sewers', label: "Descend into the Sewers", intent: "stealth", outcome: "You pry open a rusted grate and drop into the darkness below.", stat_deltas: { stamina: -10, stress: 15, hygiene: -5 }, new_location: 'sewers' },
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
      { id: 'travel_swamp', label: "Venture towards the Swamps", intent: "travel", outcome: "The trees thin out as the ground grows soggy and foul-smelling.", stat_deltas: { stamina: -20, stress: 10 }, new_location: 'swamp' },
      { id: 'travel_moor', label: "Cross the treeline to the Moor", intent: "travel", outcome: "The forest thins and the wind picks up as you step onto the vast, heather-covered moor.", stat_deltas: { stamina: -15, stress: 5 }, new_location: 'moor' },
      { id: 'travel_wolf_cave', label: "Seek the Wolf Cave", intent: "stealth", skill_check: { stat: "willpower", difficulty: 45 }, outcome: "You follow faint paw prints and scratched bark deep into the forest until you find the cave entrance.", fail_outcome: "You wander for hours but cannot find the cave. The forest feels hostile and watching.", stat_deltas: { stamina: -15, stress: 10 }, fail_stat_deltas: { stamina: -20, stress: 20 }, new_location: 'wolf_cave' },
      { id: 'travel_eden_cabin', label: "Search for Eden's cabin", intent: "stealth", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "Deep in the woods, you spot a thin column of smoke rising above the canopy. Following it, you find a sturdy log cabin.", fail_outcome: "You search but find nothing. The forest is too dense. You give up and turn back.", stat_deltas: { stamina: -15 }, fail_stat_deltas: { stamina: -20, stress: 10 }, new_location: 'eden_cabin' }
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
      { id: 'travel_docks', label: "Head to the Docks", intent: "travel", outcome: "You follow the coast towards the town docks.", stat_deltas: { stamina: -15 }, new_location: 'docks' },
      { id: 'travel_ocean', label: "Swim out to the Open Ocean", intent: "travel", skill_check: { stat: "stamina", difficulty: 50 }, outcome: "You wade into the surf and swim beyond the breakers. The vast ocean stretches before you.", fail_outcome: "The waves are too strong today. You're forced back to shore.", stat_deltas: { stamina: -15 }, fail_stat_deltas: { stamina: -20, stress: 10 }, new_location: 'ocean' }
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
  },
  'park': {
    id: 'park',
    name: "The Town Park",
    atmosphere: "open grassy fields, old oak trees, the distant laughter of children",
    danger: 15,
    x: 78, y: 60,
    npcs: [],
    description: "A wide-open park at the edge of town. Old oak trees provide shade over weathered wooden benches, and a crumbling stone fountain sits at the center, its water green with algae. During the day, families and couples stroll the winding paths. At night, the park empties and becomes the domain of the desperate and the predatory. A few stray dogs have made the underbrush their home.",
    actions: [
      { id: 'rest_park', label: "Rest on a park bench", intent: "neutral", outcome: "You sit on one of the wooden benches and watch the world go by. Squirrels chase each other through the branches above. For a brief moment, everything feels normal.", stat_deltas: { stamina: 15, stress: -15, pain: -3 }, hours_passed: 1 },
      { id: 'exercise_park', label: "Jog along the park paths", intent: "neutral", outcome: "You run along the gravel paths, your breath misting in the cool air. The steady rhythm of your feet calms your racing thoughts.", stat_deltas: { stamina: -20, stress: -10, pain: 3 }, skill_deltas: { athletics: 3 }, hours_passed: 1 },
      { id: 'forage_park', label: "Gather lichen and herbs", intent: "work", skill_check: { stat: "willpower", difficulty: 25 }, outcome: "You find useful mosses and herbs growing on the old stone walls and beneath the oak trees.", fail_outcome: "You search for an hour but find nothing useful. A park warden eyes you suspiciously.", stat_deltas: { stamina: -10 }, fail_stat_deltas: { stamina: -10, stress: 5 }, skill_deltas: { foraging: 2, tending: 1 }, hours_passed: 1 },
      { id: 'busk_park', label: "Perform for coin", intent: "social", skill_check: { stat: "allure", difficulty: 35 }, outcome: "You sing and dance for the park visitors. A few toss coins into your cap, smiling. You feel a warm glow of acceptance.", fail_outcome: "Your performance falls flat. People look away awkwardly, and a heckler shouts insults.", stat_deltas: { stamina: -15, stress: 5 }, fail_stat_deltas: { stress: 15, trauma: 3 }, skill_deltas: { dancing: 2, seduction: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'travel_market', label: "Walk to the Town Square", intent: "travel", outcome: "You follow the main path out of the park towards the square.", stat_deltas: { stamina: -5 }, new_location: 'town_square' },
      { id: 'travel_school', label: "Head to the School", intent: "travel", outcome: "You cut across the park towards the school grounds.", stat_deltas: { stamina: -5 }, new_location: 'school' },
      { id: 'travel_forest', label: "Enter the Forest", intent: "travel", outcome: "The park paths give way to wild undergrowth as you step into the forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'hospital': {
    id: 'hospital',
    name: "Nightingale Hospital",
    atmosphere: "clinical, smelling of carbolic acid, hushed whispers and groaning patients",
    danger: 5,
    x: 70, y: 55,
    npcs: ['harper'],
    description: "The town's sole medical institution, a large stone building with narrow windows and a perpetual air of suffering. Nuns in white habits move silently between the beds, administering salves and prayers in equal measure. The head physician, Harper, is brilliant but unsettling — their gaze lingers too long, and their treatments sometimes feel more like experiments. The pharmacy counter sells medicines at steep prices.",
    actions: [
      { id: 'see_doctor', label: "See the doctor", intent: "neutral", outcome: "Harper examines you with cold, clinical efficiency. They prescribe rest and a foul-tasting tonic. Your wounds feel somewhat better, though Harper's lingering gaze makes your skin crawl.", stat_deltas: { health: 20, pain: -15, stress: 10 }, hours_passed: 2 },
      { id: 'buy_medicine', label: "Buy medicine from the pharmacy", intent: "social", outcome: "You purchase a small vial of healing tonic from the pharmacy counter. It costs dearly.", stat_deltas: {}, new_items: [{ name: "Healing Tonic", type: "consumable", rarity: "uncommon", description: "A professionally prepared medicine. Bitter but effective." }] },
      { id: 'rest_ward', label: "Rest in the ward", intent: "neutral", outcome: "You lie down on a thin cot in the crowded ward. The groans of the other patients are disturbing, but the rest helps your body recover.", stat_deltas: { stamina: 25, health: 10, stress: 5, pain: -10 }, hours_passed: 6 },
      { id: 'volunteer', label: "Volunteer as a nurse's aide", intent: "work", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "You help change bandages and carry bedpans. It's grim work, but the nuns thank you warmly and slip you a few coins.", fail_outcome: "You faint at the sight of a particularly gruesome wound. A nun helps you to a bench and gives you a glass of water.", stat_deltas: { stamina: -15, stress: 10 }, fail_stat_deltas: { stamina: -10, stress: 15, trauma: 3 }, skill_deltas: { housekeeping: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You leave the hospital and walk back towards the square.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'prison': {
    id: 'prison',
    name: "The Town Prison",
    atmosphere: "dank, oppressive, the clang of iron and muffled screams",
    danger: 50,
    x: 65, y: 75,
    npcs: ['landry'],
    description: "A grim stone fortress at the edge of town where criminals are held. The guards are corrupt and the cells are filthy. The pillory in the courtyard is frequently occupied, and public punishments draw crowds. Those who cannot pay their fines are put to hard labour in the quarry. The warden, Landry, runs the prison with brutal efficiency.",
    actions: [
      { id: 'serve_sentence', label: "Serve your sentence", intent: "work", outcome: "You break rocks in the quarry under the blazing sun. The guards watch with casual cruelty, striking anyone who slows down.", stat_deltas: { stamina: -30, stress: 20, pain: 10, trauma: 5 }, skill_deltas: { athletics: 2 }, hours_passed: 8 },
      { id: 'plead_release', label: "Plead for release", intent: "social", skill_check: { stat: "willpower", difficulty: 60 }, outcome: "The warden considers your plea. After a long, uncomfortable silence, they wave you towards the gate. 'Don't let me see you again.'", fail_outcome: "The warden laughs in your face. 'You'll leave when I say you leave.' A guard shoves you back to your cell.", stat_deltas: { stress: 10 }, fail_stat_deltas: { stress: 20, trauma: 5, pain: 5 } },
      { id: 'escape_attempt', label: "Try to escape", intent: "stealth", skill_check: { stat: "willpower", difficulty: 75 }, outcome: "Under cover of darkness, you slip through a gap in the drainage grate. Freedom!", fail_outcome: "A guard spots you and sounds the alarm. The beating that follows is severe.", stat_deltas: { stamina: -20, stress: 15 }, fail_stat_deltas: { health: -20, pain: 25, stress: 30, trauma: 10 }, new_location: 'alleyways' },
      { id: 'travel_market', label: "Leave (if free)", intent: "travel", outcome: "You walk out through the iron gates, blinking in the daylight.", stat_deltas: { stress: -10, stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'strip_club': {
    id: 'strip_club',
    name: "The Strip Club",
    atmosphere: "smoky, dim red lighting, heavy bass music and clinking glasses",
    danger: 40,
    x: 77, y: 78,
    npcs: ['darryl'],
    description: "A dimly lit establishment on a seedy back street. Scantily-clad dancers move on a small stage while patrons drink and leer from shadowy booths. The owner, Darryl, watches from behind the bar with tired, haunted eyes. The air is thick with smoke, cheap perfume, and desperation. It pays well, but the work takes a heavy toll on the soul.",
    actions: [
      { id: 'dance_stage', label: "Dance on the stage", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You climb onto the stage and dance under the hot lights. The crowd watches, mesmerized. Coins rain down. You feel powerful and degraded in equal measure.", fail_outcome: "You stumble under the lights. The crowd jeers. Darryl waves you off the stage with a disappointed shake of their head.", stat_deltas: { stamina: -20, stress: 15, lust: 10, allure: 3, purity: -8 }, fail_stat_deltas: { stress: 20, trauma: 5 }, skill_deltas: { dancing: 4, seduction: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'bartend', label: "Work as a bartender", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You mix drinks and keep the glasses full. The patrons are handsy but you manage to keep them at arm's length. The tips are decent.", fail_outcome: "A drunk patron grabs you and won't let go. Darryl has to intervene. You get your pay but you're shaken.", stat_deltas: { stamina: -15, stress: 10 }, fail_stat_deltas: { stress: 20, trauma: 5, lust: 5 }, skill_deltas: { housekeeping: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'private_show', label: "Give a private show", intent: "work", skill_check: { stat: "allure", difficulty: 50 }, outcome: "A wealthy patron pays handsomely for a private dance. The money is good, but you feel hollow inside.", fail_outcome: "The patron is unsatisfied and refuses to pay. You leave the booth feeling used.", stat_deltas: { stamina: -15, lust: 15, purity: -15, stress: 10, trauma: 5 }, fail_stat_deltas: { stress: 25, trauma: 10, purity: -5 }, skill_deltas: { seduction: 5, dancing: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'travel_alleyways', label: "Leave through the back door", intent: "travel", outcome: "You slip out the back entrance into the dark alley.", stat_deltas: { stamina: -3 }, new_location: 'alleyways' }
    ]
  },
  'dance_studio': {
    id: 'dance_studio',
    name: "The Dance Studio",
    atmosphere: "polished wooden floors, wall-length mirrors, the scent of rosin and sweat",
    danger: 5,
    x: 72, y: 58,
    npcs: ['charlie'],
    description: "A bright, airy studio with large windows and polished hardwood floors. Wall-length mirrors reflect the dancers' movements. Charlie, the instructor, is demanding but fair, pushing students to perfection. The scent of rosin and fresh sweat fills the air. Dance lessons cost coin but provide excellent skill training and stress relief.",
    actions: [
      { id: 'take_lesson', label: "Take a dance lesson", intent: "education", skill_check: { stat: "stamina", difficulty: 35 }, outcome: "Charlie puts you through an intense practice session. Your muscles burn, but your movements are becoming more graceful and controlled.", fail_outcome: "You can't keep up with Charlie's pace and collapse in a heap. They sigh and send you to stretch on the side.", stat_deltas: { stamina: -20, stress: -10, allure: 2 }, fail_stat_deltas: { stamina: -15, stress: 5, pain: 5 }, skill_deltas: { dancing: 5, athletics: 2 }, fail_skill_deltas: { dancing: 1 }, hours_passed: 2 },
      { id: 'practice_alone', label: "Practice alone", intent: "neutral", outcome: "You practice basic moves in front of the mirror. Slowly, you're getting better.", stat_deltas: { stamina: -15, stress: -5 }, skill_deltas: { dancing: 2, athletics: 1 }, hours_passed: 1 },
      { id: 'watch_performance', label: "Watch an advanced performance", intent: "neutral", outcome: "You sit and watch the advanced dancers rehearse. Their grace is mesmerizing and inspiring.", stat_deltas: { stress: -10, willpower: 3 }, hours_passed: 1 },
      { id: 'travel_market', label: "Walk to the Town Square", intent: "travel", outcome: "You leave the studio feeling lighter on your feet.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'arcade': {
    id: 'arcade',
    name: "The Arcade",
    atmosphere: "flickering torchlight, the click of dice and shouts of gamblers",
    danger: 25,
    x: 75, y: 68,
    npcs: ['wren'],
    description: "A smoky, underground gambling den accessed through a nondescript door in the market district. Inside, tables are crowded with card players, dice throwers, and fortune seekers. Wren runs the high-stakes table in the back, their sharp eyes missing nothing. The house always wins, but the desperate keep coming back.",
    actions: [
      { id: 'play_cards', label: "Play blackjack", intent: "social", skill_check: { stat: "willpower", difficulty: 45 }, outcome: "Lady luck smiles on you! You walk away from the table with more coin than you sat down with. Wren watches you with new interest.", fail_outcome: "You lose your stake. Wren smirks as the dealer sweeps your coins away. 'Better luck next time, kid.'", stat_deltas: { stress: 15 }, fail_stat_deltas: { stress: 20, trauma: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'play_dice', label: "Roll dice", intent: "social", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "The dice tumble and land in your favour. You snatch up your winnings with a grin.", fail_outcome: "Snake eyes. You curse under your breath as you lose your coin.", stat_deltas: { stress: 10 }, fail_stat_deltas: { stress: 15 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'watch_games', label: "Watch and learn", intent: "neutral", outcome: "You lean against the wall and study the players, watching for tells and strategies.", stat_deltas: { stress: -5, willpower: 3 }, skill_deltas: { skulduggery: 2 }, hours_passed: 1 },
      { id: 'travel_market', label: "Leave the arcade", intent: "travel", outcome: "You climb the stairs back into the daylight of the market.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'shopping_centre': {
    id: 'shopping_centre',
    name: "The Shopping Centre",
    atmosphere: "bustling, bright, the rustle of fine fabrics and clink of coin",
    danger: 10,
    x: 80, y: 62,
    npcs: [],
    description: "The main commercial district where the better shops and boutiques line a wide, clean street. Clothing stores, cobblers, jewellers, and a tailor all compete for custom. The wealthier citizens of the town shop here, dressed in fine silks and furs. Orphans and beggars are watched suspiciously by the merchants' hired guards.",
    actions: [
      { id: 'browse_clothes', label: "Browse the clothing shops", intent: "social", outcome: "You wander the racks of fine clothes, touching fabrics you could never afford. The shopkeeper watches you like a hawk, ready to pounce if you linger too long.", stat_deltas: { stress: 5 }, hours_passed: 1 },
      { id: 'shoplift', label: "Try to shoplift", intent: "stealth", skill_check: { stat: "willpower", difficulty: 55 }, outcome: "Your nimble fingers slip a fine scarf into your tunic. No one notices. Your heart pounds as you walk calmly towards the exit.", fail_outcome: "The shopkeeper grabs your wrist! 'THIEF!' they shout. Guards descend on you within seconds.", stat_deltas: { stress: 20 }, fail_stat_deltas: { stress: 30, trauma: 5, pain: 10 }, skill_deltas: { skulduggery: 3 }, new_items: [{ name: "Fine Silk Scarf", type: "clothing", slot: "neck", rarity: "uncommon", description: "A beautiful silk scarf in deep crimson. Wearing it makes you look more refined.", integrity: 100, max_integrity: 100 }] },
      { id: 'buy_clothing', label: "Buy new clothes", intent: "social", outcome: "You spend some of your hard-earned coin on a simple but clean set of clothes. They're nothing fancy, but they don't mark you as a beggar.", stat_deltas: { allure: 3, stress: -5 } },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You walk back towards the market.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'moor': {
    id: 'moor',
    name: "The Moor",
    atmosphere: "windswept, desolate, the cry of hawks and rustle of heather",
    danger: 55,
    x: 98, y: 45,
    npcs: [],
    description: "A vast, windswept expanse of heather and bog beyond the forest. The ruins of an ancient castle — the Hawk's Tower — can be seen on a distant hilltop, home to a great and terrible bird of prey. The wind howls constantly, and the ground is treacherous with hidden bogs. Few venture here willingly.",
    actions: [
      { id: 'explore_ruins', label: "Explore the Hawk's Tower ruins", intent: "work", skill_check: { stat: "stamina", difficulty: 60 }, outcome: "You climb the crumbling stairs of the old tower. At the top, you find the enormous nest of the Great Hawk. Scattered among the sticks and feathers are glinting trinkets stolen from travellers.", fail_outcome: "A screech splits the air! The Great Hawk swoops down, its talons raking your back as you flee down the stairs.", stat_deltas: { stamina: -25, stress: 20 }, fail_stat_deltas: { health: -15, pain: 20, stress: 30, trauma: 10 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'gather_heather', label: "Gather heather and bog herbs", intent: "work", outcome: "You pick wild heather and find useful medicinal plants growing between the stones.", stat_deltas: { stamina: -15 }, skill_deltas: { foraging: 3, tending: 2 }, new_items: [{ name: "Wild Heather Bundle", type: "consumable", rarity: "common", description: "Fragrant purple heather. Can be dried for medicinal tea." }], hours_passed: 2 },
      { id: 'travel_forest', label: "Return to the Forest", intent: "travel", outcome: "You trudge back across the boggy moorland towards the treeline.", stat_deltas: { stamina: -15 }, new_location: 'forest' }
    ]
  },
  'wolf_cave': {
    id: 'wolf_cave',
    name: "The Wolf Cave",
    atmosphere: "dark, musky, the low growling of predators and smell of raw meat",
    danger: 75,
    x: 93, y: 48,
    npcs: [],
    description: "A deep cave in the forest, home to a pack of wolves led by a massive, intelligent Black Wolf. The entrance is littered with gnawed bones, and the air inside is thick with the musky scent of predators. Deeper in, the cave opens into a large chamber where the pack sleeps. The Black Wolf watches all who enter with unsettling intelligence.",
    actions: [
      { id: 'approach_alpha', label: "Approach the Black Wolf", intent: "social", skill_check: { stat: "willpower", difficulty: 70 }, outcome: "The Black Wolf regards you with intelligent golden eyes. It sniffs you carefully, then lowers its massive head, allowing you to pass unmolested. You have earned a measure of respect.", fail_outcome: "The Black Wolf snarls, baring enormous fangs. The pack closes in around you. You barely escape with your life.", stat_deltas: { stress: 25, willpower: 5 }, fail_stat_deltas: { health: -20, pain: 25, stress: 35, trauma: 15 }, hours_passed: 1 },
      { id: 'sleep_cave', label: "Sleep among the wolves", intent: "neutral", outcome: "You curl up against the warm flank of a sleeping wolf. Its fur is coarse but warm. You sleep surprisingly well, surrounded by the quiet breathing of the pack.", stat_deltas: { stamina: 30, stress: -10, pain: -5 }, hours_passed: 8 },
      { id: 'hunt_with_pack', label: "Join the pack's hunt", intent: "work", skill_check: { stat: "stamina", difficulty: 55 }, outcome: "You run with the wolves through the moonlit forest. Together you bring down a deer. The thrill of the hunt is primal and exhilarating.", fail_outcome: "You can't keep up with the pack. They disappear into the darkness, leaving you alone and lost.", stat_deltas: { stamina: -25, stress: -15 }, fail_stat_deltas: { stamina: -30, stress: 20 }, skill_deltas: { athletics: 4 }, hours_passed: 4 },
      { id: 'travel_forest', label: "Leave the cave", intent: "travel", outcome: "You slip out of the cave mouth into the forest.", stat_deltas: { stamina: -5 }, new_location: 'forest' }
    ]
  },
  'eden_cabin': {
    id: 'eden_cabin',
    name: "Eden's Cabin",
    atmosphere: "wood smoke, pine needles, animal pelts, and isolation",
    danger: 30,
    x: 96, y: 52,
    npcs: ['eden'],
    description: "A sturdy log cabin deep in the forest, far from any path. Smoke curls from the chimney, and animal pelts hang on a drying rack outside. Inside, the cabin is spartan but well-maintained: a large bed, a stone fireplace, a rough-hewn table, and shelves stacked with preserved food and hunting supplies. Eden lives here alone, self-sufficient and distrustful of the town.",
    actions: [
      { id: 'talk_eden', label: "Talk to Eden", intent: "social", outcome: "Eden sits by the fire, sharpening a hunting knife. They listen to you speak without interrupting, occasionally grunting in response. Being around them is strangely calming, despite their intensity.", stat_deltas: { stress: -15, willpower: 5 }, hours_passed: 1 },
      { id: 'help_chores', label: "Help with cabin chores", intent: "work", outcome: "You chop firewood, haul water from the stream, and mend a gap in the cabin wall. Eden nods approvingly at your work.", stat_deltas: { stamina: -20, stress: -10 }, skill_deltas: { housekeeping: 3, athletics: 2 }, hours_passed: 3 },
      { id: 'cook_eden', label: "Cook a meal together", intent: "work", outcome: "Eden shows you how to prepare venison stew with wild herbs. The smell is incredible. You eat together in companionable silence.", stat_deltas: { stamina: 15, stress: -15, pain: -5 }, skill_deltas: { cooking: 4 }, hours_passed: 2 },
      { id: 'sleep_cabin', label: "Sleep in the cabin", intent: "neutral", outcome: "You sleep in the warm cabin, the fire crackling gently. The thick log walls keep out the cold and the dangers of the forest.", stat_deltas: { stamina: 45, stress: -20, pain: -10 }, hours_passed: 8 },
      { id: 'hunt_eden', label: "Go hunting with Eden", intent: "work", skill_check: { stat: "stamina", difficulty: 45 }, outcome: "Eden leads you deep into the forest. You learn to track, set snares, and move silently through the undergrowth. You return with a brace of rabbits.", fail_outcome: "You make too much noise and scare off the game. Eden glares at you but says nothing.", stat_deltas: { stamina: -25, stress: -5 }, fail_stat_deltas: { stamina: -20, stress: 10 }, skill_deltas: { athletics: 3, foraging: 2, skulduggery: 1 }, hours_passed: 4 },
      { id: 'travel_forest', label: "Leave the cabin", intent: "travel", outcome: "You step out into the forest, the cabin disappearing behind the dense trees.", stat_deltas: { stamina: -5 }, new_location: 'forest' }
    ]
  },
  'ocean': {
    id: 'ocean',
    name: "The Open Ocean",
    atmosphere: "vast, salty, the endless crash of waves against the hull",
    danger: 65,
    x: 100, y: 50,
    npcs: [],
    description: "Beyond the beach and the docks lies the open ocean — vast, cold, and unforgiving. Small fishing boats bob in the grey swells, and on clear days you can see the distant smudge of foreign shores. The water teems with life, but also with danger: strong currents, sudden storms, and creatures in the deep that no fisherman can name.",
    actions: [
      { id: 'dive_ocean', label: "Dive beneath the waves", intent: "work", skill_check: { stat: "stamina", difficulty: 60 }, outcome: "You plunge into the cold, dark water. Below the surface, the world is silent and alien. You find a cluster of pearls clinging to a rock formation and prise them free before surfacing, gasping.", fail_outcome: "A powerful current seizes you and drags you under! You fight to the surface, barely making it back to shore.", stat_deltas: { stamina: -25, stress: 15 }, fail_stat_deltas: { health: -15, stamina: -30, stress: 25, trauma: 10, pain: 10 }, skill_deltas: { swimming: 5, athletics: 2 }, new_items: [{ name: "Ocean Pearl", type: "misc", rarity: "rare", description: "A lustrous pearl from the ocean floor. Valuable and beautiful." }], hours_passed: 2 },
      { id: 'fish_ocean', label: "Deep sea fishing", intent: "work", skill_check: { stat: "stamina", difficulty: 45 }, outcome: "You borrow a fisherman's boat and cast your line into the deep water. After hours of patient waiting, you land a massive catch.", fail_outcome: "The sea is rough today. You spend hours fighting nausea and catch nothing.", stat_deltas: { stamina: -20, stress: 5 }, fail_stat_deltas: { stamina: -25, health: -5, stress: 15 }, skill_deltas: { swimming: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 4 },
      { id: 'swim_ocean', label: "Swim in the open water", intent: "neutral", skill_check: { stat: "stamina", difficulty: 50 }, outcome: "You swim far out from shore, feeling the power of the ocean around you. You return exhausted but exhilarated.", fail_outcome: "A wave crashes over you and you struggle to keep your head above water. You barely make it back.", stat_deltas: { stamina: -20, stress: -10, hygiene: 10 }, fail_stat_deltas: { health: -10, stamina: -30, stress: 20, trauma: 5 }, skill_deltas: { swimming: 6, athletics: 3 }, hours_passed: 2 },
      { id: 'travel_beach', label: "Return to the Beach", intent: "travel", outcome: "You wade back to shore.", stat_deltas: { stamina: -10 }, new_location: 'beach' },
      { id: 'travel_docks', label: "Sail to the Docks", intent: "travel", outcome: "You catch a ride on a fishing boat back to the town docks.", stat_deltas: { stamina: -5 }, new_location: 'docks' }
    ]
  },
  'sewers': {
    id: 'sewers',
    name: "The Sewers",
    atmosphere: "pitch black, echoing drips, the stench of waste and decay",
    danger: 70,
    x: 80, y: 80,
    npcs: [],
    description: "The vast network of ancient tunnels beneath the town. Originally built by a long-forgotten civilization, the sewers are now home to rats, slimes, and worse. The air is thick with methane and the stench of waste. Dim bioluminescent fungi provide the only light. Criminals use the tunnels to move unseen, and darker things lurk in the deeper passages.",
    actions: [
      { id: 'explore_sewers', label: "Explore the tunnels", intent: "stealth", skill_check: { stat: "willpower", difficulty: 55 }, outcome: "You navigate the labyrinthine tunnels, finding a hidden cache of smuggled goods tucked into a wall niche.", fail_outcome: "You become hopelessly lost in the dark. Something slimy brushes against your leg, and you run blindly until you stumble into a familiar passage.", stat_deltas: { stamina: -20, stress: 20, hygiene: -10, purity: -5 }, fail_stat_deltas: { stamina: -25, stress: 30, trauma: 5, hygiene: -15 }, skill_deltas: { skulduggery: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 2 },
      { id: 'hunt_rats', label: "Hunt sewer rats", intent: "work", outcome: "You dispatch several large rats. Their pelts are worthless, but the exercise keeps you sharp.", stat_deltas: { stamina: -15, stress: 5, hygiene: -5 }, skill_deltas: { athletics: 2, skulduggery: 1 }, hours_passed: 1 },
      { id: 'hide_sewers', label: "Hide from pursuers", intent: "stealth", outcome: "You duck into a side passage and wait in the darkness. Whatever was chasing you passes by. You're safe — for now.", stat_deltas: { stress: -10, stamina: -5 }, hours_passed: 1 },
      { id: 'travel_alleyways', label: "Climb out to the Alleyways", intent: "travel", outcome: "You haul yourself up through a rusted grate into the alleyways above.", stat_deltas: { stamina: -10, hygiene: -5 }, new_location: 'alleyways' },
      { id: 'travel_docks', label: "Follow the outflow to the Docks", intent: "travel", outcome: "You follow the main drain tunnel towards the harbour outfall.", stat_deltas: { stamina: -10, hygiene: -10 }, new_location: 'docks' }
    ]
  },
  'museum': {
    id: 'museum',
    name: "The Museum",
    atmosphere: "hushed, scholarly, the scent of old parchment and polished wood",
    danger: 5,
    x: 73, y: 55,
    npcs: ['winter'],
    description: "A grand stone building housing the town's collection of antiquities and curiosities. Display cases contain ancient artefacts, fossils, and relics from distant lands. The curator, Winter, is always looking for new exhibits and pays handsomely for genuine antiques. The museum is quiet and scholarly, a haven from the chaos of the streets.",
    actions: [
      { id: 'browse_exhibits', label: "Browse the exhibits", intent: "education", outcome: "You wander through the hushed halls, studying the ancient artifacts. A display of pre-imperial weaponry catches your eye, and you spend an engrossing hour reading the plaques.", stat_deltas: { willpower: 5, stress: -10 }, skill_deltas: { school_grades: 2 }, hours_passed: 1 },
      { id: 'sell_antique', label: "Offer an antique to Winter", intent: "social", outcome: "Winter examines your offering with a magnifying glass, their eyes widening with scholarly excitement. 'A genuine piece! I'll give you a fair price.'", stat_deltas: { stress: -5 } },
      { id: 'volunteer_museum', label: "Volunteer as a guide", intent: "work", outcome: "You spend the afternoon giving tours to visitors. Winter teaches you about the exhibits between groups. It's surprisingly enjoyable.", stat_deltas: { stamina: -10, stress: -10, willpower: 5 }, skill_deltas: { school_grades: 3, housekeeping: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You step out of the quiet museum into the bustle of the streets.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'cafe': {
    id: 'cafe',
    name: "The Café",
    atmosphere: "warm, fragrant with roasted beans and baked pastries",
    danger: 5,
    x: 76, y: 63,
    npcs: ['sam'],
    description: "A cosy café tucked between the larger buildings of the market district. Mismatched wooden furniture fills the small space, and the air is rich with the scent of roasting coffee beans and fresh pastries. Sam, the cheerful owner, greets every customer with a warm smile. It's one of the few places in town where you feel genuinely welcome.",
    actions: [
      { id: 'buy_meal', label: "Buy a hot meal", intent: "social", outcome: "Sam places a steaming bowl of stew and a thick slice of bread in front of you. It's simple but delicious. For a few precious minutes, you feel warm and full.", stat_deltas: { stamina: 20, stress: -15, pain: -5 }, hours_passed: 1 },
      { id: 'work_cafe', label: "Work as a server", intent: "work", skill_check: { stat: "stamina", difficulty: 30 }, outcome: "You spend the afternoon taking orders and clearing tables. Sam pays you fairly and lets you eat the leftover pastries.", fail_outcome: "You drop a tray of cups. Sam winces but tells you not to worry. You help clean up but don't get paid.", stat_deltas: { stamina: -15, stress: -5 }, fail_stat_deltas: { stress: 10, stamina: -10 }, skill_deltas: { housekeeping: 2, cooking: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'study_cafe', label: "Study in the corner booth", intent: "education", outcome: "You tuck yourself into a quiet corner with a battered textbook. The warm atmosphere and background chatter help you focus.", stat_deltas: { stress: -5, willpower: 3 }, skill_deltas: { school_grades: 3 }, hours_passed: 2 },
      { id: 'travel_market', label: "Step outside", intent: "travel", outcome: "You reluctantly leave the warmth of the café.", stat_deltas: { stamina: -3 }, new_location: 'town_square' },
      { id: 'travel_shopping', label: "Walk to the Shopping Centre", intent: "travel", outcome: "You stroll down the clean streets towards the shops.", stat_deltas: { stamina: -3 }, new_location: 'shopping_centre' }
    ]
  }
};
