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
};

export const STARTING_QUESTS: Quest[] = [
  QUESTS['q_ch1_orphans_cage'],
];
