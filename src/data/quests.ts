import { Quest } from '../types';

export const QUESTS: Record<string, Quest> = {
  // ── MAIN STORY ──────────────────────────────────────────────────────────

  'q_ch1_orphans_cage': {
    id: 'q_ch1_orphans_cage',
    title: "The Orphan's Cage",
    type: 'main',
    chapter: 1,
    status: 'active',
    description: "Life under Matron Grelod is a waking nightmare. The orphanage doors are locked, the windows barred, and hope feels like a luxury you cannot afford. Find a way out.",
    objectives: [
      { id: 'obj_leave_orphanage', description: "Escape the orphanage and reach the town square", completed: false },
    ],
    rewards: {
      feats: ['feat_first_steps'],
      xp: 50,
    },
    prerequisites: [],
  },

  'q_ch2_survive_streets': {
    id: 'q_ch2_survive_streets',
    title: "Survive the Streets",
    type: 'main',
    chapter: 2,
    status: 'locked',
    description: "You are free from the orphanage, but freedom means nothing if you starve in a gutter. Survive Riften's cruel streets for a week and earn enough coin to stay alive.",
    objectives: [
      { id: 'obj_survive_7_days', description: "Survive for 7 days", completed: false, count: 0, required_count: 7 },
      { id: 'obj_earn_100_gold', description: "Accumulate 100 gold", completed: false },
    ],
    rewards: {
      gold: 20,
      xp: 100,
    },
    prerequisites: ['q_ch1_orphans_cage'],
  },

  'q_ch3_first_honest_work': {
    id: 'q_ch3_first_honest_work',
    title: "First Honest Work",
    type: 'main',
    chapter: 3,
    status: 'locked',
    description: "Begging and scrounging can only take you so far. Find real employment and prove you can earn your place in the world through honest labour.",
    objectives: [
      { id: 'obj_complete_5_work', description: "Complete 5 work actions", completed: false, count: 0, required_count: 5 },
      { id: 'obj_skill_25', description: "Raise any skill to 25", completed: false },
    ],
    rewards: {
      feats: ['feat_first_job'],
      xp: 150,
    },
    prerequisites: ['q_ch2_survive_streets'],
  },

  'q_ch4_thieves_guild': {
    id: 'q_ch4_thieves_guild',
    title: "The Thieves Guild",
    type: 'main',
    chapter: 4,
    status: 'locked',
    description: "Word has reached you of a guild that operates in the shadows of Riften — the Thieves Guild. They say a man named Brynjolf is always looking for new talent. Perhaps there is a different path to independence.",
    objectives: [
      { id: 'obj_meet_brynjolf', description: "Find and speak with Brynjolf in the market", completed: false },
      { id: 'obj_small_theft', description: "Complete a small theft as a test", completed: false },
    ],
    rewards: {
      gold: 50,
      xp: 200,
    },
    prerequisites: ['q_ch3_first_honest_work'],
  },

  'q_ch5_hidden_depths': {
    id: 'q_ch5_hidden_depths',
    title: "Hidden Depths",
    type: 'main',
    chapter: 5,
    status: 'locked',
    description: "Thirty days of survival have sharpened your mind. Fragments of memory and a nagging feeling point toward the orphanage's dusty records room. Who were you before the orphanage? The truth might change everything.",
    objectives: [
      { id: 'obj_find_records', description: "Discover your personal history in the orphanage records", completed: false },
      { id: 'obj_origin_reveal', description: "Uncover the truth of your origins", completed: false },
    ],
    rewards: {
      xp: 300,
    },
    prerequisites: ['q_ch2_survive_streets'],
  },

  'q_ch6_independence': {
    id: 'q_ch6_independence',
    title: "Independence",
    type: 'main',
    chapter: 6,
    status: 'locked',
    description: "Bailey still holds your debt over your head like an axe. If you can secure your own housing and pay off what you owe, you will finally be free — truly free.",
    objectives: [
      { id: 'obj_secure_housing', description: "Secure permanent housing", completed: false },
      { id: 'obj_pay_bailey', description: "Pay off Bailey's debt completely", completed: false },
    ],
    rewards: {
      xp: 400,
    },
    prerequisites: ['q_ch3_first_honest_work'],
  },

  'q_ch7_new_life': {
    id: 'q_ch7_new_life',
    title: "A New Life",
    type: 'main',
    chapter: 7,
    status: 'locked',
    description: "The choices you have made echo through every street of Riften. Alliances forged, enemies made, a soul shaped by hardship and decision. Now comes the reckoning — and the beginning.",
    objectives: [
      { id: 'obj_final_choice', description: "Make your final choice about your path", completed: false },
    ],
    rewards: {
      xp: 1000,
    },
    prerequisites: ['q_ch6_independence'],
  },

  // ── SIDE QUESTS ─────────────────────────────────────────────────────────

  'q_side_herbalist': {
    id: 'q_side_herbalist',
    title: "The Herbalist's Request",
    type: 'side',
    status: 'locked',
    description: "The apothecary in the market needs rare ingredients that only grow in dangerous places. She's offering good coin for anyone brave enough to gather them.",
    objectives: [
      { id: 'obj_gather_swamp_root', description: "Gather 3 swamp roots from Hjaalmarch", completed: false, count: 0, required_count: 3 },
      { id: 'obj_gather_rare_fungi', description: "Gather 2 rare fungi", completed: false, count: 0, required_count: 2 },
      { id: 'obj_deliver_herbs', description: "Deliver the ingredients to the apothecary", completed: false },
    ],
    rewards: {
      gold: 40,
      items: ['healing_potion'],
      skills: { foraging: 5, tending: 3 },
      xp: 80,
    },
    prerequisites: [],
  },

  'q_side_tavern_trouble': {
    id: 'q_side_tavern_trouble',
    title: "Tavern Troubles",
    type: 'side',
    status: 'locked',
    description: "Hulda at the Bannered Mare is having trouble with a persistent rowdy patron who is driving away customers. She needs someone discreet to deal with it.",
    objectives: [
      { id: 'obj_resolve_patron', description: "Resolve the problem with the troublesome patron", completed: false },
    ],
    rewards: {
      gold: 25,
      xp: 60,
    },
    prerequisites: [],
  },

  'q_side_lost_ring': {
    id: 'q_side_lost_ring',
    title: "A Mother's Ring",
    type: 'side',
    status: 'locked',
    description: "An old woman in the market square is weeping. She lost her late mother's ring somewhere in the alleyways. She has nothing left to offer but her gratitude — and a few coins she can barely spare.",
    objectives: [
      { id: 'obj_find_ring', description: "Search the alleyways for the lost ring", completed: false },
      { id: 'obj_return_ring', description: "Return the ring to the old woman", completed: false },
    ],
    rewards: {
      gold: 10,
      xp: 40,
    },
    prerequisites: [],
  },

  'q_side_moonlight_swim': {
    id: 'q_side_moonlight_swim',
    title: "The Swimmer's Challenge",
    type: 'side',
    status: 'locked',
    description: "A dockworker bets you can't swim across the full width of Lake Honrich and back before moonset. It's a fool's wager — but the coin is real.",
    objectives: [
      { id: 'obj_swim_challenge', description: "Complete the swimming challenge", completed: false },
    ],
    rewards: {
      gold: 30,
      skills: { swimming: 10, athletics: 5 },
      feats: ['feat_swimmer'],
      xp: 70,
    },
    prerequisites: [],
  },

  'q_side_farm_crisis': {
    id: 'q_side_farm_crisis',
    title: "Blight in the Fields",
    type: 'side',
    status: 'locked',
    description: "The Goldenglow Estate is being hit by a mysterious blight that threatens the wheat harvest. If the crop fails, the whole town feels the hunger. The farmer needs help identifying and stopping it.",
    objectives: [
      { id: 'obj_identify_blight', description: "Investigate and identify the blight's source", completed: false },
      { id: 'obj_treat_crops', description: "Tend the crops and apply a treatment", completed: false, count: 0, required_count: 3 },
    ],
    rewards: {
      gold: 35,
      items: ['forest_herbs', 'wild_berries'],
      skills: { tending: 8, foraging: 3 },
      xp: 90,
    },
    prerequisites: [],
  },

  'q_side_temple_offering': {
    id: 'q_side_temple_offering',
    title: "Temple Offering",
    type: 'side',
    status: 'locked',
    description: "A priestess at the Temple of Kynareth asks you to gather specific wild offerings for an upcoming ritual. She believes the goddess will bless those who help.",
    objectives: [
      { id: 'obj_gather_flowers', description: "Gather wildflowers from the park", completed: false },
      { id: 'obj_gather_herbs', description: "Gather healing herbs from the forest", completed: false },
      { id: 'obj_deliver_offering', description: "Bring the offering to the temple", completed: false },
    ],
    rewards: {
      xp: 60,
      skills: { foraging: 4 },
    },
    prerequisites: [],
  },

  // ── DAILY QUESTS ────────────────────────────────────────────────────────

  'q_daily_morning_forage': {
    id: 'q_daily_morning_forage',
    title: "Morning Forage",
    type: 'daily',
    status: 'locked',
    description: "Start the day right — gather what the wild land offers before the rest of the town is stirring.",
    objectives: [
      { id: 'obj_forage_once', description: "Complete one foraging action", completed: false },
    ],
    rewards: {
      gold: 2,
      xp: 15,
    },
    prerequisites: [],
  },

  'q_daily_cook_meal': {
    id: 'q_daily_cook_meal',
    title: "Cook a Meal",
    type: 'daily',
    status: 'locked',
    description: "Eating properly makes everything harder to break. Cook yourself at least one real meal today.",
    objectives: [
      { id: 'obj_cook_once', description: "Cook one recipe", completed: false },
    ],
    rewards: {
      xp: 10,
      skills: { cooking: 2 },
    },
    prerequisites: [],
  },

  // ── ROMANCE QUESTS ───────────────────────────────────────────────────────

  'q_romance_eden': {
    id: 'q_romance_eden',
    title: "Something in the Pines",
    type: 'romance',
    status: 'locked',
    description: "Eden is hard to read and harder to reach. But the quiet moments in that log cabin have started to feel like something more. Follow wherever that leads.",
    objectives: [
      { id: 'obj_visit_eden_3', description: "Visit Eden's cabin 3 times", completed: false, count: 0, required_count: 3 },
      { id: 'obj_cook_together', description: "Cook a meal together with Eden", completed: false },
      { id: 'obj_hunt_together', description: "Hunt with Eden successfully", completed: false },
    ],
    rewards: {
      xp: 120,
      feats: ['feat_first_love'],
    },
    prerequisites: [],
  },

  'q_romance_robin': {
    id: 'q_romance_robin',
    title: "Fragile Hearts",
    type: 'romance',
    status: 'locked',
    description: "Robin has always been there — a quiet, unwavering presence in the storm of your life. Perhaps it's time to acknowledge what's been growing between you.",
    objectives: [
      { id: 'obj_rescue_robin', description: "Complete Robin's rescue event", completed: false },
      { id: 'obj_robin_relation_40', description: "Reach 40 relationship with Robin", completed: false },
      { id: 'obj_robin_gift', description: "Give Robin a meaningful gift", completed: false },
    ],
    rewards: {
      xp: 100,
      feats: ['feat_first_love'],
    },
    prerequisites: [],
  },

  'q_romance_whitney': {
    id: 'q_romance_whitney',
    title: "Beneath the Armour",
    type: 'romance',
    status: 'locked',
    description: "Whitney's cruelty masks deep wounds. Breaking through requires patience, courage, and the willingness to see the person behind the bully.",
    objectives: [
      { id: 'obj_whitney_confront', description: "Survive Whitney's confrontation", completed: false },
      { id: 'obj_whitney_vulnerable', description: "See Whitney's vulnerable side", completed: false },
      { id: 'obj_whitney_relation_20', description: "Shift Whitney's relationship above 20", completed: false },
    ],
    rewards: {
      xp: 140,
      feats: ['feat_first_love'],
    },
    prerequisites: [],
  },

  'q_romance_sydney': {
    id: 'q_romance_sydney',
    title: "Faith and Doubt",
    type: 'romance',
    status: 'locked',
    description: "Sydney's faith is shaking. In the trembling space between belief and doubt, something personal is growing — something that requires as much courage as any prayer.",
    objectives: [
      { id: 'obj_sydney_crisis', description: "Be there for Sydney's crisis of faith", completed: false },
      { id: 'obj_sydney_relation_30', description: "Reach 30 relationship with Sydney", completed: false },
      { id: 'obj_sydney_walk', description: "Walk home with Sydney from the library", completed: false },
    ],
    rewards: {
      xp: 110,
      feats: ['feat_first_love'],
    },
    prerequisites: [],
  },

  'q_romance_alex': {
    id: 'q_romance_alex',
    title: "Roots and Rain",
    type: 'romance',
    status: 'locked',
    description: "Alex pours everything into the farm — there's no room left for love. But working side by side, sharing meals and silence, the soil between you grows fertile.",
    objectives: [
      { id: 'obj_alex_harvest', description: "Help Alex save the harvest", completed: false },
      { id: 'obj_alex_relation_25', description: "Reach 25 relationship with Alex", completed: false },
      { id: 'obj_alex_dinner', description: "Share a meal with Alex at the farm", completed: false },
    ],
    rewards: {
      xp: 130,
      feats: ['feat_first_love'],
    },
    prerequisites: [],
  },

  // ── LOCATION STORY QUESTS ──────────────────────────────────────────────

  'q_side_whitney_bully': {
    id: 'q_side_whitney_bully',
    title: "The Bully's Ultimatum",
    type: 'side',
    status: 'locked',
    description: "Whitney's bullying has escalated beyond the usual torment. Something has to give — but will it be them, or you?",
    objectives: [
      { id: 'obj_face_whitney', description: "Face Whitney's ultimatum at school", completed: false },
      { id: 'obj_resolve_whitney', description: "Resolve the confrontation", completed: false },
    ],
    rewards: {
      xp: 80,
      skills: { athletics: 3 },
    },
    prerequisites: [],
  },

  'q_side_leighton_secret': {
    id: 'q_side_leighton_secret',
    title: "After Hours",
    type: 'side',
    status: 'locked',
    description: "Something is deeply wrong with Headmaster Leighton. The after-hours detentions hide a darkness that must be exposed.",
    objectives: [
      { id: 'obj_survive_leighton', description: "Escape Leighton's after-hours detention", completed: false },
      { id: 'obj_expose_leighton', description: "Take action against Leighton", completed: false },
    ],
    rewards: {
      xp: 120,
      skills: { school_grades: 5 },
    },
    prerequisites: [],
  },

  'q_side_docks_workers': {
    id: 'q_side_docks_workers',
    title: "The Argonian Dockworkers",
    type: 'side',
    status: 'locked',
    description: "The Argonian labourers at the docks are being exploited. Uncover the corruption and decide what to do with the evidence.",
    objectives: [
      { id: 'obj_discover_exploitation', description: "Discover the dockworker exploitation", completed: false },
      { id: 'obj_find_evidence', description: "Find evidence in the warehouse office", completed: false },
      { id: 'obj_resolve_docks', description: "Resolve the situation", completed: false },
    ],
    rewards: {
      gold: 30,
      xp: 100,
      skills: { skulduggery: 3 },
    },
    prerequisites: [],
  },

  'q_side_farm_harvest': {
    id: 'q_side_farm_harvest',
    title: "Harvest Moon",
    type: 'side',
    status: 'locked',
    description: "Alex's farm teeters on the brink of ruin. The harvest must come in before the tax collector, or everything their parents built will be lost.",
    objectives: [
      { id: 'obj_learn_crisis', description: "Learn about the farm's crisis", completed: false },
      { id: 'obj_help_harvest', description: "Help save the harvest", completed: false },
    ],
    rewards: {
      gold: 25,
      xp: 100,
      skills: { tending: 5, athletics: 3 },
    },
    prerequisites: [],
  },

  'q_side_brothel_briar': {
    id: 'q_side_brothel_briar',
    title: "Briar's Proposition",
    type: 'side',
    status: 'locked',
    description: "The madam of the brothel has made you an offer with golden chains attached. Navigate the underworld of Riften's flesh trade.",
    objectives: [
      { id: 'obj_receive_offer', description: "Receive Briar's proposition", completed: false },
      { id: 'obj_decide_offer', description: "Make your decision", completed: false },
    ],
    rewards: {
      xp: 90,
    },
    prerequisites: [],
  },

  'q_side_forest_hunt': {
    id: 'q_side_forest_hunt',
    title: "The First Hunt",
    type: 'side',
    status: 'locked',
    description: "Eden has offered to teach you to hunt in the deep forest. It's a chance to learn survival — and perhaps to understand the recluse who calls the wilderness home.",
    objectives: [
      { id: 'obj_accept_hunt', description: "Accept Eden's hunting invitation", completed: false },
      { id: 'obj_track_stag', description: "Track and face the stag", completed: false },
    ],
    rewards: {
      xp: 80,
      skills: { athletics: 3, foraging: 3 },
    },
    prerequisites: [],
  },

  'q_side_sewers_children': {
    id: 'q_side_sewers_children',
    title: "The Ratway Children",
    type: 'side',
    status: 'locked',
    description: "Lost children huddle in the sewers, too afraid to return to Grelod's orphanage. They need someone who understands — someone who's been where they are.",
    objectives: [
      { id: 'obj_find_children', description: "Discover the Ratway children", completed: false },
      { id: 'obj_gain_trust', description: "Gain Miri's trust", completed: false },
      { id: 'obj_help_children', description: "Help the children find safety", completed: false },
    ],
    rewards: {
      xp: 110,
      skills: { housekeeping: 3, foraging: 3 },
    },
    prerequisites: ['q_ch1_orphans_cage'],
  },

  'q_side_prison_innocent': {
    id: 'q_side_prison_innocent',
    title: "Behind Bars",
    type: 'side',
    status: 'locked',
    description: "Wrongly accused, you must survive Riften Jail and find a way to prove your innocence — or escape.",
    objectives: [
      { id: 'obj_survive_jail', description: "Survive imprisonment in Riften Jail", completed: false },
      { id: 'obj_clear_name', description: "Clear your name or escape", completed: false },
    ],
    rewards: {
      xp: 120,
      skills: { skulduggery: 5, athletics: 3 },
    },
    prerequisites: [],
  },

  'q_side_sydney_faith': {
    id: 'q_side_sydney_faith',
    title: "The Wavering Light",
    type: 'side',
    status: 'locked',
    description: "Sydney's unshakeable faith has begun to crack. What role will you play as they question everything they once believed?",
    objectives: [
      { id: 'obj_witness_crisis', description: "Witness Sydney's crisis of faith", completed: false },
      { id: 'obj_guide_sydney', description: "Guide Sydney through their doubt", completed: false },
    ],
    rewards: {
      xp: 90,
    },
    prerequisites: [],
  },

  'q_side_museum_puzzle': {
    id: 'q_side_museum_puzzle',
    title: "The Clockwork Riddle",
    type: 'side',
    status: 'locked',
    description: "Winter's Dwemer puzzle box may unlock secrets buried beneath the museum for millennia. Help unravel the mystery.",
    objectives: [
      { id: 'obj_solve_puzzle', description: "Help solve the Dwemer puzzle box", completed: false },
      { id: 'obj_explore_chamber', description: "Decide the fate of the hidden chamber", completed: false },
    ],
    rewards: {
      gold: 20,
      xp: 100,
      skills: { school_grades: 5 },
    },
    prerequisites: [],
  },

  'q_side_cafe_secret': {
    id: 'q_side_cafe_secret',
    title: "The Baker's Secret",
    type: 'side',
    status: 'locked',
    description: "Sam's warm smiles hide a dangerous past. When it catches up, will you help the kindest person in Riften?",
    objectives: [
      { id: 'obj_discover_past', description: "Learn about Sam's hidden past", completed: false },
      { id: 'obj_protect_sam', description: "Help Sam face their past", completed: false },
    ],
    rewards: {
      gold: 15,
      xp: 90,
    },
    prerequisites: [],
  },
};

export const STARTING_QUESTS: Quest[] = [
  QUESTS['q_ch1_orphans_cage'],
];
