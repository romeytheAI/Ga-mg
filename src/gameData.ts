import { GameState, Item, StatKey } from './types';

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
      { id: 'travel_docks', label: "Head to the Docks", intent: "travel", outcome: "You navigate the labyrinthine alleys towards the docks.", stat_deltas: { stamina: -10 }, new_location: 'docks' }
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
      { id: 'forage', label: "Forage for ingredients", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You gather some useful herbs and mushrooms.", fail_outcome: "You wander aimlessly, getting scratched by thorns.", stat_deltas: { stamina: -15 }, fail_stat_deltas: { stamina: -20, pain: 5, stress: 10 }, new_items: [{ name: "Blue Mountain Flower", type: "consumable", rarity: "common", description: "Useful for alchemy." }] },
      { id: 'travel_temple', label: "Return to the City", intent: "travel", outcome: "You head back towards the safety of the town's walls.", stat_deltas: { stamina: -10 }, new_location: 'temple_gardens' },
      { id: 'travel_farm', label: "Walk to the Farm", intent: "travel", outcome: "You follow a dirt path towards the nearby farm.", stat_deltas: { stamina: -15 }, new_location: 'farm' },
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
      { id: 'swim', label: "Swim in the lake", intent: "neutral", outcome: "The water is freezing, but it washes away the grime of the city.", stat_deltas: { stamina: -10, stress: -10, purity: 5 } },
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
  }
};

export const NPCS: Record<string, any> = {
  'constance_michel': {
    id: 'constance_michel',
    name: "Sister Constance",
    race: "Human",
    relationship: 20,
    description: "The assistant at the orphanage. She is a young woman, barely out of her teens, who tries her best to be kind. However, she is clearly exhausted, overworked, and terrified of Matron Grelod. She often sneaks extra food to the younger children when Grelod isn't looking.",
    responses: {
      'social': { narrative_text: "She smiles sadly at you, her eyes darting nervously towards the matron's office. 'Eat quickly, little one. Before she sees you have extra.'", stat_deltas: { stress: -5, willpower: 2 } },
      'work': { narrative_text: "'Thank you for the help. You're a good child. I'll try to sneak you an extra blanket tonight, it's going to be freezing.'", stat_deltas: { stress: -10, purity: 2 } }
    }
  },
  'grelod_the_kind': {
    id: 'grelod_the_kind',
    name: "Matron Grelod",
    race: "Human",
    relationship: -50,
    description: "The headmistress of the orphanage, ironically nicknamed 'The Kind'. A bitter, cruel, and aging woman who takes sadistic pleasure in the suffering of the children in her care. Rumors say she was once a beautiful noblewoman who lost everything, though her current state of perpetual rage makes that hard to believe. She wields a heavy leather belt and a wooden cane, both of which she uses frequently and without hesitation.",
    responses: {
      'social': { narrative_text: "She glares at you, her face a mask of pure hatred, spittle flying from her lips. 'Back to work, you lazy, worthless brat! Or it's the belt for you, and no supper!' She raises her cane threateningly.", stat_deltas: { stress: 20, pain: 5, trauma: 5 } },
      'work': { narrative_text: "She inspects your work with a sneer, running a bony finger over a perfectly clean surface. 'You missed a spot. Do it again, all of it, or you'll sleep in the cellar with the rats!'", stat_deltas: { stamina: -15, stress: 10 } }
    }
  },
  'brynjolf': {
    id: 'brynjolf',
    name: "Brynjolf",
    race: "Human",
    relationship: 0,
    description: "A smooth-talking, charismatic rogue who seems to know everyone's business in the town. He usually hangs around the market square, looking for easy marks or potential recruits for his 'organization'. He wears fine, if slightly worn, leather armor.",
    responses: {
      'social': { narrative_text: "He leans against a stall, tossing a coin in the air. 'Never done an honest day's work in your life for all that coin you're carrying, eh lass? You've got the look of a survivor.'", stat_deltas: { stress: 5, lust: 5 } },
      'work': { narrative_text: "He watches you work with an amused expression. 'Keep your hands quick and your eyes open. The alleys are no place for the slow, and neither is this market.'", stat_deltas: { willpower: 5 } }
    }
  },
  'brand_shei': {
    id: 'brand_shei',
    name: "Brand-Shei",
    race: "Elf",
    relationship: 10,
    description: "A Dark Elf merchant in the town square. Unlike many others, he seems genuinely kind and fair in his dealings. He sells a variety of exotic goods and often takes pity on the local orphans, occasionally offering them small tasks for decent pay.",
    responses: {
      'social': { narrative_text: "He offers a warm, genuine smile. 'Ah, a customer. Or just browsing? Either way, welcome to my humble stall. Stay out of trouble, young one.'", stat_deltas: { stress: -5 } },
      'work': { narrative_text: "He hands you a small broom. 'I could use a hand organizing these wares and sweeping up, if you're looking for a few honest coins.'", stat_deltas: { stamina: -10 } }
    }
  }
};

export const AGE_APPEARANCE: Record<number, string> = {
  8: "A small, waifish child with wide eyes and a perpetually soot-stained face.",
  9: "Slightly taller, but still thin. Your features are beginning to lose their infant softness.",
  10: "Your limbs are growing long and gangly. You move with a nervous, bird-like energy.",
  11: "The first hints of adolescence appear. Your voice cracks occasionally.",
  12: "You are starting to fill out, though the orphanage diet keeps you lean.",
  13: "A growth spurt has left you clumsy. Your face is becoming more defined.",
  14: "You carry yourself with more confidence. Your eyes have seen too much for your age.",
  15: "Nearly adult height. Your muscles are wiry from years of chores.",
  16: "A young adult. You have the hard look of someone who has survived the streets of the town.",
  17: "You are coming into your own, your body maturing despite the harsh conditions.",
  18: "Fully grown, bearing the scars and beauty of your experiences."
};

export const BASIC_ITEMS: Record<string, any> = {
  'bread_crust': { id: 'bread_crust', name: "Stale Bread Crust", type: 'consumable', rarity: 'common', description: "Hard as a rock and speckled with mold, but hunger makes it a feast. It's the standard ration at the orphanage, barely enough to keep a child alive.", value: 1, weight: 0.1, stats: { health: 2, stamina: 5 } },
  'coin': { id: 'coin', name: "Gold Coin", type: 'misc', rarity: 'common', description: "The currency of the realm. Cold, hard, and necessary. It bears the faded profile of a long-dead emperor, a reminder of the empire's waning influence.", value: 1, weight: 0.01 },
  'wooden_sword': { id: 'wooden_sword', name: "Wooden Sword", type: 'weapon', rarity: 'common', description: "A child's toy, splintered and worn from countless imaginary battles. It offers little protection, but holding it brings a fleeting sense of courage.", value: 2, weight: 1, stats: { willpower: 5 } },
  'blue_mountain_flower': { id: 'blue_mountain_flower', name: "Blue Mountain Flower", type: 'consumable', rarity: 'common', description: "A common flower with minor restorative properties. Its petals are a vibrant, unnatural blue, hinting at the latent magic that permeates the land.", value: 2, weight: 0.1, stats: { health: 5, purity: 1 } },
  'glowing_mushroom': { id: 'glowing_mushroom', name: "Glowing Mushroom", type: 'consumable', rarity: 'uncommon', description: "A strange, bioluminescent mushroom found in damp caves and cellars. It hums with faint, unsettling magic that makes your skin prickle when you hold it.", value: 5, weight: 0.2, stats: { health: -5, lust: 10, corruption: 2 } },
  'rusty_iron_dagger': { id: 'rusty_iron_dagger', name: "Rusty Iron Dagger", type: 'weapon', rarity: 'common', description: "A discarded, rusted blade found in the muck. The edge is dull, chipped, and stained with questionable brown spots. It's barely sharp enough to cut cheese, but gripping its worn, sweat-stained leather hilt gives you a slight sense of security in these dark alleys. It smells faintly of old blood, rust, and desperation.", value: 5, weight: 2, stats: { willpower: 10 } },
  'threadbare_tunic': { id: 'threadbare_tunic', name: "Threadbare Tunic", type: 'clothing', rarity: 'common', description: "A simple, coarse wool tunic. It's thin, itchy, and offers almost no protection from the cold or anything else. It smells faintly of sweat and the desperate, cramped conditions of the orphanage. Wearing it immediately marks you as someone of low social standing.", value: 1, weight: 0.5 },
  'strange_amulet': { id: 'strange_amulet', name: "Strange Amulet", type: 'misc', rarity: 'rare', description: "A heavy, cold metal amulet depicting an eye surrounded by tentacles. It whispers to you in the dark when you try to sleep.", value: 50, weight: 0.5, stats: { willpower: -5, corruption: 5 } },
  'healing_poultice': { id: 'healing_poultice', name: "Healing Poultice", type: 'consumable', rarity: 'uncommon', description: "A foul-smelling paste made of crushed herbs and mud. It burns when applied, but it closes wounds quickly.", value: 10, weight: 0.5, stats: { health: 20, pain: -10 } }
};

export const ENCOUNTERS = [
  {
    id: 'alley_mugger',
    condition: (state: GameState) => state.world.current_location.danger > 20 && state.world.current_location.id !== 'swamp',
    outcome: "A rough-looking thug blocks your path, eyeing you up and down with a predatory grin."
  },
  {
    id: 'tentacle_ambush',
    condition: (state: GameState) => state.world.current_location.id === 'swamp' || state.world.current_location.id === 'docks',
    outcome: "The dark water suddenly churns. Thick, slimy tentacles erupt from the depths, wrapping around your ankles and pulling you down!"
  },
  {
    id: 'creepy_noble',
    condition: (state: GameState) => state.world.current_location.id === 'town_square' || state.world.current_location.id === 'temple_gardens',
    outcome: "A finely dressed noble approaches you. They smell of expensive perfume and wine. 'You look lost, little one. Why don't you come with me?' they purr, reaching out to stroke your hair."
  },
  {
    id: 'stray_dog',
    condition: (state: GameState) => state.world.current_location.id === 'alleyways' || state.world.current_location.id === 'town_square',
    outcome: "A mangy, feral dog growls at you from the shadows, baring its yellowed teeth. It looks starved and desperate."
  },
  {
    id: 'drunken_sailor',
    condition: (state: GameState) => state.world.current_location.id === 'docks' || state.world.current_location.id === 'brothel',
    outcome: "A burly sailor stumbles out of a tavern, reeking of cheap ale. He spots you and lurches forward, his hands grasping clumsily."
  },
  {
    id: 'corrupt_guard',
    condition: (state: GameState) => state.world.current_location.id === 'town_square' || state.world.current_location.id === 'alleyways',
    outcome: "A town guard stops you, his hand resting menacingly on his sword hilt. 'You're out late. Maybe we can come to an... arrangement,' he sneers."
  },
  {
    id: 'wild_boar',
    condition: (state: GameState) => state.world.current_location.id === 'forest' || state.world.current_location.id === 'farm',
    outcome: "A massive wild boar bursts from the underbrush, its tusks gleaming. It snorts angrily and charges straight at you!"
  },
  {
    id: 'shadowy_cultist',
    condition: (state: GameState) => state.world.current_location.id === 'temple_gardens' || state.world.current_location.id === 'swamp',
    outcome: "A figure in dark, tattered robes steps out from the gloom. They chant in a guttural, forgotten language, their eyes glowing with unnatural fervor."
  }
];

export const ITEM_PREFIXES = ["Torn", "Soiled", "Fine", "Silken", "Blessed", "Cursed", "Gilded", "Sturdy", "Fragile", "Mystic", "Seductive", "Revealing"];
export const ITEM_SUFFIXES = ["of the Maiden", "of the Harlot", "of Agony", "of Grace", "of the Wastes", "of the Goddess", "of the Demon", "of the Thief"];
