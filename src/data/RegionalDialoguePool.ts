/**
 * Regional Dialogue Pool - Expanded
 * 
 * Scaled to support 500+ unique permutations per location via procedural combination.
 */

export interface DialogueFragment {
  opening: string[];
  sensory: string[];
  atmospheric: string[];
  interaction: string[];
  closing: string[];
}

export const REGIONAL_POOLS: Record<string, DialogueFragment> = {
  Riften: {
    opening: [
      "The damp air of the Ratway clings to your skin.",
      "Mist rises from Lake Honrich, obscuring the mountains.",
      "The smell of autumn leaves and canal water is unmistakable.",
      "Shadows dance along the wooden walkways.",
      "A distant argument echoes through the fog-heavy streets.",
      "The Thieves Guild's influence is a palpable weight here.",
      "Autumn's bite is sharp in the air today.",
      "The docks are busy with the morning's first catch.",
      "Leaves scuttle across the cobblestones like nervous rodents.",
      "The city feels crowded and watchful this afternoon.",
    ],
    sensory: [
      "You hear the soft lapping of water against stone.",
      "A cool breeze carries the scent of honey and woodsmoke.",
      "The cobblestones are slick with a thin layer of grime.",
      "Low light filters through the dense yellow leaves.",
      "A crow caws mockingly from a nearby eave.",
      "The distant sound of a blacksmith's hammer rings out.",
      "The scent of cheap ale wafts from a nearby cellar.",
      "Small ripples disturb the dark surface of the canal.",
      "A stray dog watches you with hungry, intelligent eyes.",
      "The sound of heavy boots on wood vibrates through your feet.",
    ],
    atmospheric: [
      "The shadows here seem to have a life of their own.",
      "Conversations hush as you walk past, replaced by meaningful looks.",
      "There is a tension in the air, like a bowstring drawn too tight.",
      "The golden light of sunset turns the city into a copper-hued cage.",
      "Every corner seems to hold a different secret, mostly unpleasant.",
      "The architecture is a mix of grand history and rotting wood.",
      "A sense of urgency drives the crowd around you.",
      "The presence of the Black-Briar family is felt in every transaction.",
      "Hope is a rare commodity in these narrow streets.",
      "The city breathes with a rhythm of graft and survival.",
    ],
    interaction: [
      "A merchant offers you a 'once-in-a-lifetime' deal with a wink.",
      "A guard's hand lingers on his sword hilt as you pass.",
      "Children run through the streets, their laughter sounding forced.",
      "A beggar reaches out, his eyes seeing more than he lets on.",
      "Someone watches you from a second-story window, then draws the curtain.",
      "You catch a snippet of a whispered plot that sounds dangerous.",
      "A carriage rattles past, nearly splashing you with canal water.",
      "The smell of baking bread offers a momentary, cruel distraction.",
      "A priest of Mara offers a blessing you aren't sure you deserve.",
      "A hooded figure marks a door with a sign you don't recognise.",
    ],
    closing: [
      "The moment passes, leaving you slightly more grounded.",
      "You take a deep breath and prepare for the next challenge.",
      "The city's weight returns, but you feel ready to carry it.",
      "You slip further into the flow of the city, becoming another shadow.",
      "The day turns toward evening, and the shadows grow long.",
      "Riften never sleeps, and neither do its dangers.",
      "You move on, keeping your coin purse close and your eyes open.",
      "The brief respite is over; the game continues.",
      "Aetherius feels far away, but the ground beneath you is real.",
      "You find yourself looking over your shoulder, just in case.",
    ]
  },
  Whiterun: {
    opening: [
      "The winds of the Tundra howl across the plains.",
      "High Hrothgar looms over the city, eternal and silent.",
      "The smell of roasting meat and cold stone fills the air.",
      "Dragonsreach stands proud at the city's highest point.",
      "The Gildergreen's leaves rustle with ancient memory.",
      "Morning light hits the walls of Whiterun, turning stone to gold.",
      "The marketplace is already alive with chatter and trade.",
      "A chill wind brings the scent of pine from the southern forests.",
      "The city feels sturdy, built to weather any storm.",
      "Dust motes dance in the clear, mountain air.",
    ],
    sensory: [
      "The sound of the Skyforge's bellows echoes in the distance.",
      "Water rushes through the gutters, clear and cold.",
      "The smell of horse stable and dry grass is strong here.",
      "Your boots click rhythmically on the well-worn paving stones.",
      "The wind carries the distant roar of a mountain stream.",
      "A hawk circles high above the Cloud District.",
      "The texture of the stone walls is rough and ancient.",
      "Sunlight warms your face, even as the wind bites your skin.",
      "The taste of iron is faint on the breeze from the forge.",
      "Banners snap and pop in the brisk afternoon gale.",
    ],
    atmospheric: [
      "There is a sense of ancient honour in this place.",
      "The city feels like a hub, the beating heart of Skyrim.",
      "A quiet pride radiates from the people you pass.",
      "The shadows of the mountains grow long as the day wanes.",
      "History is written into every timber of Jorrvaskr.",
      "The air is thinner here, and every breath feels more vital.",
      "The divide between the districts is clear and strictly kept.",
      "War feels far away, yet every man carries a weapon.",
      "The Gildergreen's silence is more powerful than any sermon.",
      "The city watches the plains like an old lion.",
    ],
    interaction: [
      "A Companion returns from a hunt, blood and glory on their brow.",
      "Belethor calls out a greeting that sounds suspiciously like a threat.",
      "A guard reminds you that there's no lollygagging allowed.",
      "Nazeem asks if you've been to the Cloud District lately.",
      "A merchant from a caravan offers you spices from the south.",
      "You see a group of pilgrims heading toward the Great Lift.",
      "An old woman offers you a flower from her garden.",
      "The local children play at being heroes and dragons.",
      "A Battle-Born and a Gray-Mane exchange a heated look.",
      "The Jarl's steward watches the crowd with a weary eye.",
    ],
    closing: [
      "Whiterun's peace is hard-won and precious.",
      "You feel the strength of the mountains in your bones.",
      "The wind dies down, but the city's pulse remains steady.",
      "You find yourself standing a little taller here.",
      "The day concludes with the chime of the temple bells.",
      "Skyrim is vast, but here, you feel almost at home.",
      "You prepare for the road ahead, your resolve sharpened.",
      "The light fades from the peak of High Hrothgar.",
      "Whiterun stands firm, as it has for centuries.",
      "The tavern's warmth beckons as the first stars appear.",
    ]
  },
  Solitude: {
    opening: [
      "The imperial capital stands tall on its natural arch.",
      "The blue banners of the city snap in the sea breeze.",
      "Solitude's streets are wide and paved with meticulous care.",
      "The smell of salt spray and expensive perfume is everywhere.",
      "High walls of stone offer a sense of absolute security.",
      "The Bard's College echoes with the sound of practice.",
      "Morning fog rolls in from the Sea of Ghosts.",
      "Wealth and power are the true foundations of this city.",
      "The Blue Palace dominates the skyline with royal authority.",
      "The air is crisp and clean, high above the marshlands.",
    ],
    sensory: [
      "The cry of gulls is a constant background to city life.",
      "Marble surfaces gleam under the midday sun.",
      "The scent of exotic spices drifts from the East Empire docks.",
      "A harp's melody floats from an open window.",
      "The ground is solid stone, swept clean of any debris.",
      "Cold air carries the scent of pine and distant snow.",
      "The taste of salt is sharp on your tongue.",
      "Vibrant banners of silk add splashes of colour to the grey stone.",
      "The sound of a lute being tuned rings out from a nearby court.",
      "Smooth railings of polished wood offer a comfortable grip.",
    ],
    atmospheric: [
      "There is a refined, cosmopolitan feel to the capital.",
      "Politics and protocol are as important as steel here.",
      "The shadows of the arch fall deep over the lower docks.",
      "A sense of orderly tradition governs every interaction.",
      "The city feels ancient, yet sophisticated and reaching.",
      "Loyalty to the Empire is worn like a badge of honour.",
      "Art and culture are the true currencies of Solitude.",
      "Even the beggars here seem to have better manners.",
      "The history of the High Kings is felt in every plaza.",
      "The city is a lighthouse of civilization in the wild north.",
    ],
    interaction: [
      "A noble in fine silks ignores you with practiced ease.",
      "A student from the college recites an epic poem to the crowd.",
      "A Thalmor agent watches the marketplace with clinical distain.",
      "A merchant from the East Empire Company checks his ledgers.",
      "An Imperial guard stands at rigid attention, unmoving.",
      "A diplomat from Cyrodiil asks for directions to the Palace.",
      "The local executioner sharpens his blade in grim silence.",
      "A group of bards-in-training argue about a difficult rhyme.",
      "A flower girl offers you a bouquet of Snowberries.",
      "The court wizard walks past, lost in deep arcane thought.",
    ],
    closing: [
      "Solitude remains unmoved by the chaos of the world.",
      "You feel the weight of history and expectation here.",
      "The sea breeze carries your thoughts toward the horizon.",
      "You find yourself minding your manners in such company.",
      "The sun sets behind the Blue Palace, a final crown of light.",
      "In the capital, every choice feels like a statement.",
      "You move on, the city's grand architecture receding behind you.",
      "Solitude's lights begin to twinkle against the dark cliffside.",
      "The Arch stands firm, a monument to Nord ingenuity.",
      "You carry a piece of the capital's dignity with you.",
    ]
  },
  // Scale with 10 fragments in each category for multiple regions
  // 10*10*10*10*10 = 100,000 potential unique combinations per region.
};

/**
 * Procedurally generates a unique dialogue string.
 * This helper enables 500+ unique dialogues per location by combining fragments.
 */
export function getDynamicDialogue(region: string): string {
  const pool = REGIONAL_POOLS[region] || REGIONAL_POOLS['Riften'];
  
  const open = pool.opening[Math.floor(Math.random() * pool.opening.length)];
  const sense = pool.sensory[Math.floor(Math.random() * pool.sensory.length)];
  const atmos = pool.atmospheric[Math.floor(Math.random() * pool.atmospheric.length)];
  const inter = pool.interaction[Math.floor(Math.random() * pool.interaction.length)];
  const close = pool.closing[Math.floor(Math.random() * pool.closing.length)];
  
  return `${open} ${sense} ${atmos} ${inter} ${close}`;
}
