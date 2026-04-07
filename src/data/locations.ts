export const LOCATIONS: Record<string, any> = {
  'orphanage': {
    id: 'orphanage',
    name: "Honorhall Orphanage",
    atmosphere: "cold, damp, smelling of stale porridge, unwashed bodies, and the sharp tang of Nordic lye soap",
    danger: 5,
    x: 80, y: 70,
    npcs: ['constance_michel', 'grelod_the_kind', 'robin', 'bailey'],
    description: "Your 'home' in the Grey Quarter of Riften. A bleak, timber-and-stone longhouse with a sagging sod roof that leaks during Skyrim's frequent rains. The drafty windows offer no protection from the biting winds that sweep down from the Jerall Mountains. The children here are thin and fearful, their eyes darting to the shadows where Matron Grelod might be lurking. The air is thick with unspoken misery, the smell of stale cabbage soup, and the desperate hope of one day escaping into the streets of Riften. Every creaking floorboard serves as a reminder of the punishments that await the disobedient.",
    actions: [
      { id: 'sleep', label: "Sleep in your cot", intent: "neutral", outcome: "You curl up on the thin, lumpy mattress, pulling the scratchy wool blanket tight. You try to ignore the cold and the muffled sobs of the younger children. You wake up feeling slightly more rested, though your muscles ache from the hard wooden slats.", stat_deltas: { stamina: 30, stress: -10, lust: -5 } },
      { id: 'clean_floors', label: "Scrub the stone floors", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You spend hours on your knees, your hands raw and bleeding from the harsh lye soap. The cold stone bites into your joints. For your grueling labor, you are tossed a small, moldy crust of bread.", fail_outcome: "Your arms give out and you collapse from exhaustion before finishing the grand hall. Grelod finds you and beats you mercilessly with her cane, leaving welts across your back.", stat_deltas: { stamina: -15, stress: 5, purity: 2 }, fail_stat_deltas: { stamina: -20, pain: 10, stress: 15, trauma: 5 }, new_items: [{ name: "Stale Bread Crust", type: "consumable", rarity: "common", description: "Hard as a rock and speckled with mold, but hunger makes it a feast." }] },
      { id: 'talk_constance', label: "Talk to Sister Constance", intent: "social", story_event: 'constance_secret_bread', npc: "constance_michel", hours_passed: 1 },
      { id: 'flirt_constance', label: "Compliment Sister Constance", intent: "flirt", npc: "constance_michel", hours_passed: 1 },
      { id: 'work_constance', label: "Help Sister Constance with her duties", intent: "work", npc: "constance_michel", hours_passed: 1 },
      { id: 'threaten_constance', label: "Take out your frustration on Constance", intent: "threaten", npc: "constance_michel", hours_passed: 1 },
      { id: 'gift_constance', label: "Give a gift to Sister Constance", intent: "gift", npc: "constance_michel", hours_passed: 1 },
      { id: 'tease_constance', label: "Tease Sister Constance", intent: "tease", npc: "constance_michel", hours_passed: 1 },
      { id: 'comfort_constance', label: "Comfort Sister Constance", intent: "comfort", npc: "constance_michel", hours_passed: 1 },
      { id: 'confide_constance', label: "Confide in Sister Constance", intent: "confide", npc: "constance_michel", hours_passed: 1 },
      { id: 'beg_constance', label: "Beg Sister Constance for help", intent: "beg", npc: "constance_michel", hours_passed: 1 },
      { id: 'praise_constance', label: "Praise Sister Constance", intent: "praise", npc: "constance_michel", hours_passed: 1 },
      { id: 'kiss_constance', label: "Kiss Sister Constance", intent: "kiss", npc: "constance_michel", hours_passed: 1 },
      { id: 'hold_hands_constance', label: "Hold hands with Sister Constance", intent: "hold_hands", npc: "constance_michel", hours_passed: 1 },
      { id: 'cuddle_constance', label: "Cuddle with Sister Constance", intent: "cuddle", npc: "constance_michel", hours_passed: 1 },
      { id: 'confess_constance', label: "Confess your feelings to Sister Constance", intent: "confess", npc: "constance_michel", hours_passed: 1 },
      { id: 'date_constance', label: "Ask Sister Constance on a date", intent: "date", npc: "constance_michel", hours_passed: 1 },
      { id: 'talk_grelod', label: "Address Matron Grelod", intent: "social", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'work_grelod', label: "Report your work to Grelod", intent: "work", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'flirt_grelod', label: "Try to charm Matron Grelod", intent: "flirt", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'confront_grelod', label: "Confront Matron Grelod", intent: "threaten", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'bribe_grelod', label: "Offer Grelod a bribe", intent: "gift", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'tease_grelod', label: "Mock Matron Grelod", intent: "tease", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'comfort_grelod', label: "Try to comfort Grelod", intent: "comfort", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'confide_grelod', label: "Try to confide in Grelod", intent: "confide", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'beg_grelod', label: "Beg Grelod for mercy", intent: "beg", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'praise_grelod', label: "Praise Matron Grelod", intent: "praise", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'kiss_grelod', label: "Try to kiss Matron Grelod", intent: "kiss", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'hold_hands_grelod', label: "Try to hold Grelod's hand", intent: "hold_hands", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'cuddle_grelod', label: "Try to cuddle Matron Grelod", intent: "cuddle", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'confess_grelod', label: "Confess your feelings to Matron Grelod", intent: "confess", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'date_grelod', label: "Ask Matron Grelod on a date", intent: "date", npc: "grelod_the_kind", hours_passed: 1 },
      { id: 'talk_robin', label: "Spend time with Robin", intent: "social", npc: "robin", hours_passed: 1 },
      { id: 'flirt_robin', label: "Flirt with Robin", intent: "flirt", npc: "robin", hours_passed: 1 },
      { id: 'work_robin', label: "Work alongside Robin on chores", intent: "work", npc: "robin", hours_passed: 1 },
      { id: 'threaten_robin', label: "Lash out at Robin", intent: "threaten", npc: "robin", hours_passed: 1 },
      { id: 'gift_robin', label: "Give Robin a small gift", intent: "gift", npc: "robin", hours_passed: 1 },
      { id: 'tease_robin', label: "Tease Robin playfully", intent: "tease", npc: "robin", hours_passed: 1 },
      { id: 'comfort_robin', label: "Comfort Robin", intent: "comfort", npc: "robin", hours_passed: 1 },
      { id: 'confide_robin', label: "Confide in Robin", intent: "confide", npc: "robin", hours_passed: 1 },
      { id: 'beg_robin', label: "Beg Robin for help", intent: "beg", npc: "robin", hours_passed: 1 },
      { id: 'praise_robin', label: "Praise Robin", intent: "praise", npc: "robin", hours_passed: 1 },
      { id: 'kiss_robin', label: "Kiss Robin", intent: "kiss", npc: "robin", hours_passed: 1 },
      { id: 'hold_hands_robin', label: "Hold hands with Robin", intent: "hold_hands", npc: "robin", hours_passed: 1 },
      { id: 'cuddle_robin', label: "Cuddle with Robin", intent: "cuddle", npc: "robin", hours_passed: 1 },
      { id: 'confess_robin', label: "Confess your feelings to Robin", intent: "confess", npc: "robin", hours_passed: 1 },
      { id: 'date_robin', label: "Ask Robin on a date", intent: "date", npc: "robin", hours_passed: 1 },
      { id: 'talk_bailey', label: "Speak with Bailey", intent: "social", npc: "bailey", hours_passed: 1 },
      { id: 'work_bailey', label: "Negotiate with Bailey about chores", intent: "work", npc: "bailey", hours_passed: 1 },
      { id: 'flirt_bailey', label: "Flirt with Bailey", intent: "flirt", npc: "bailey", hours_passed: 1 },
      { id: 'threaten_bailey', label: "Defy Bailey's authority", intent: "threaten", npc: "bailey", hours_passed: 1 },
      { id: 'gift_bailey', label: "Give Bailey a gift", intent: "gift", npc: "bailey", hours_passed: 1 },
      { id: 'tease_bailey', label: "Tease Bailey", intent: "tease", npc: "bailey", hours_passed: 1 },
      { id: 'comfort_bailey', label: "Try to comfort Bailey", intent: "comfort", npc: "bailey", hours_passed: 1 },
      { id: 'confide_bailey', label: "Confide in Bailey", intent: "confide", npc: "bailey", hours_passed: 1 },
      { id: 'beg_bailey', label: "Beg Bailey for leniency", intent: "beg", npc: "bailey", hours_passed: 1 },
      { id: 'praise_bailey', label: "Praise Bailey", intent: "praise", npc: "bailey", hours_passed: 1 },
      { id: 'kiss_bailey', label: "Kiss Bailey", intent: "kiss", npc: "bailey", hours_passed: 1 },
      { id: 'hold_hands_bailey', label: "Hold hands with Bailey", intent: "hold_hands", npc: "bailey", hours_passed: 1 },
      { id: 'cuddle_bailey', label: "Cuddle with Bailey", intent: "cuddle", npc: "bailey", hours_passed: 1 },
      { id: 'confess_bailey', label: "Confess your feelings to Bailey", intent: "confess", npc: "bailey", hours_passed: 1 },
      { id: 'date_bailey', label: "Ask Bailey on a date", intent: "date", npc: "bailey", hours_passed: 1 },
      { id: 'travel_market', label: "Sneak out to the Town Square", intent: "stealth", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You wait for Constance to turn her back, slipping past the heavy oak doors and into the relative freedom of the city streets.", fail_outcome: "Grelod catches you by the ear just as you reach the door! You manage to wriggle free and run, but not before taking a stinging blow to the side of your head.", stat_deltas: { stamina: -5 }, fail_stat_deltas: { pain: 10, health: -5, stress: 15 }, new_location: 'town_square' },
      { id: 'travel_academy', label: "Head to the School", intent: "travel", outcome: "You make the long, cold trek to the town school, clutching your meager belongings.", stat_deltas: { stamina: -10 }, new_location: 'school' }
    ]
  },
  'school': {
    id: 'school',
    name: "The Bards College",
    atmosphere: "smelling of old parchment, lute rosin, and strict Nordic discipline",
    danger: 10,
    x: 60, y: 30,
    npcs: ['whitney', 'kylar', 'avery', 'sydney', 'leighton', 'river', 'doren', 'mason'],
    description: "A strict institution of learning in Solitude, funded by Jarl Elisif and the East Empire Company. The stone halls echo with droning lectures on Nordic history and the sharp crack of the headmaster's switch. The instructors are unforgiving Nords who demand perfection, while the older, wealthier students from prominent holds often prey on the weak and impoverished orphans. The scent of ancient scrolls and inkwells is suffocating, a constant reminder of Tamriel's rigid expectations.",
    actions: [
      { id: 'attend_class', label: "Attend classes", intent: "education", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "You focus intensely on the complex arcane theories and historical texts, feeling your mind expand despite the oppressive atmosphere.", fail_outcome: "Exhaustion overtakes you and you fall asleep at your desk. The instructor humiliates you in front of the entire class, making you wear the dunce cap.", stat_deltas: { willpower: 10, stress: 10, stamina: -10 }, fail_stat_deltas: { stress: 20, trauma: 5, stamina: -5 }, skill_deltas: { lore_mastery: 5 }, fail_skill_deltas: { lore_mastery: -2 } },
      { id: 'study_library', label: "Study in the Library", intent: "education", outcome: "You seek refuge in the dusty, silent library, spending hours poring over ancient tomes hidden in the back corners.", stat_deltas: { willpower: 5, stress: 5, stamina: -5 }, skill_deltas: { lore_mastery: 2 } },
      { id: 'talk_whitney', label: "Talk to Whitney", intent: "social", npc: "whitney", hours_passed: 1 },
      { id: 'flirt_whitney', label: "Flirt with Whitney", intent: "flirt", npc: "whitney", hours_passed: 1 },
      { id: 'work_whitney', label: "Collaborate with Whitney on a project", intent: "work", npc: "whitney", hours_passed: 1 },
      { id: 'confront_whitney', label: "Stand up to Whitney", intent: "threaten", npc: "whitney", hours_passed: 1 },
      { id: 'gift_whitney', label: "Give Whitney a gift", intent: "gift", npc: "whitney", hours_passed: 1 },
      { id: 'tease_whitney', label: "Tease Whitney", intent: "tease", npc: "whitney", hours_passed: 1 },
      { id: 'comfort_whitney', label: "Try to comfort Whitney", intent: "comfort", npc: "whitney", hours_passed: 1 },
      { id: 'confide_whitney', label: "Confide in Whitney", intent: "confide", npc: "whitney", hours_passed: 1 },
      { id: 'beg_whitney', label: "Beg Whitney to stop", intent: "beg", npc: "whitney", hours_passed: 1 },
      { id: 'praise_whitney', label: "Praise Whitney", intent: "praise", npc: "whitney", hours_passed: 1 },
      { id: 'kiss_whitney', label: "Kiss Whitney", intent: "kiss", npc: "whitney", hours_passed: 1 },
      { id: 'hold_hands_whitney', label: "Hold hands with Whitney", intent: "hold_hands", npc: "whitney", hours_passed: 1 },
      { id: 'cuddle_whitney', label: "Cuddle with Whitney", intent: "cuddle", npc: "whitney", hours_passed: 1 },
      { id: 'confess_whitney', label: "Confess your feelings to Whitney", intent: "confess", npc: "whitney", hours_passed: 1 },
      { id: 'date_whitney', label: "Ask Whitney on a date", intent: "date", npc: "whitney", hours_passed: 1 },
      { id: 'talk_kylar', label: "Approach Kylar", intent: "social", npc: "kylar", hours_passed: 1 },
      { id: 'flirt_kylar', label: "Flirt with Kylar", intent: "flirt", npc: "kylar", hours_passed: 1 },
      { id: 'work_kylar', label: "Study alongside Kylar", intent: "work", npc: "kylar", hours_passed: 1 },
      { id: 'threaten_kylar', label: "Try to shake off Kylar", intent: "threaten", npc: "kylar", hours_passed: 1 },
      { id: 'gift_kylar', label: "Give Kylar a gift", intent: "gift", npc: "kylar", hours_passed: 1 },
      { id: 'tease_kylar', label: "Tease Kylar", intent: "tease", npc: "kylar", hours_passed: 1 },
      { id: 'comfort_kylar', label: "Comfort Kylar", intent: "comfort", npc: "kylar", hours_passed: 1 },
      { id: 'confide_kylar', label: "Confide in Kylar", intent: "confide", npc: "kylar", hours_passed: 1 },
      { id: 'beg_kylar', label: "Beg Kylar to leave you alone", intent: "beg", npc: "kylar", hours_passed: 1 },
      { id: 'praise_kylar', label: "Praise Kylar", intent: "praise", npc: "kylar", hours_passed: 1 },
      { id: 'kiss_kylar', label: "Kiss Kylar", intent: "kiss", npc: "kylar", hours_passed: 1 },
      { id: 'hold_hands_kylar', label: "Hold hands with Kylar", intent: "hold_hands", npc: "kylar", hours_passed: 1 },
      { id: 'cuddle_kylar', label: "Cuddle with Kylar", intent: "cuddle", npc: "kylar", hours_passed: 1 },
      { id: 'confess_kylar', label: "Confess your feelings to Kylar", intent: "confess", npc: "kylar", hours_passed: 1 },
      { id: 'date_kylar', label: "Ask Kylar on a date", intent: "date", npc: "kylar", hours_passed: 1 },
      { id: 'talk_avery_school', label: "Chat with Avery", intent: "social", npc: "avery", hours_passed: 1 },
      { id: 'flirt_avery_school', label: "Flirt with Avery", intent: "flirt", npc: "avery", hours_passed: 1 },
      { id: 'work_avery_school', label: "Work on a project with Avery", intent: "work", npc: "avery", hours_passed: 1 },
      { id: 'threaten_avery_school', label: "Challenge Avery", intent: "threaten", npc: "avery", hours_passed: 1 },
      { id: 'gift_avery_school', label: "Give Avery a gift", intent: "gift", npc: "avery", hours_passed: 1 },
      { id: 'tease_avery_school', label: "Tease Avery", intent: "tease", npc: "avery", hours_passed: 1 },
      { id: 'comfort_avery_school', label: "Comfort Avery", intent: "comfort", npc: "avery", hours_passed: 1 },
      { id: 'confide_avery_school', label: "Confide in Avery", intent: "confide", npc: "avery", hours_passed: 1 },
      { id: 'beg_avery_school', label: "Beg Avery for help", intent: "beg", npc: "avery", hours_passed: 1 },
      { id: 'praise_avery_school', label: "Praise Avery", intent: "praise", npc: "avery", hours_passed: 1 },
      { id: 'kiss_avery_school', label: "Kiss Avery", intent: "kiss", npc: "avery", hours_passed: 1 },
      { id: 'hold_hands_avery_school', label: "Hold hands with Avery", intent: "hold_hands", npc: "avery", hours_passed: 1 },
      { id: 'cuddle_avery_school', label: "Cuddle with Avery", intent: "cuddle", npc: "avery", hours_passed: 1 },
      { id: 'confess_avery_school', label: "Confess your feelings to Avery", intent: "confess", npc: "avery", hours_passed: 1 },
      { id: 'date_avery_school', label: "Ask Avery on a date", intent: "date", npc: "avery", hours_passed: 1 },
      { id: 'talk_sydney', label: "Talk to Sydney", intent: "social", npc: "sydney", hours_passed: 1 },
      { id: 'flirt_sydney', label: "Flirt with Sydney", intent: "flirt", npc: "sydney", hours_passed: 1 },
      { id: 'work_sydney', label: "Study with Sydney", intent: "work", npc: "sydney", hours_passed: 1 },
      { id: 'threaten_sydney', label: "Challenge Sydney's beliefs", intent: "threaten", npc: "sydney", hours_passed: 1 },
      { id: 'gift_sydney', label: "Give Sydney a gift", intent: "gift", npc: "sydney", hours_passed: 1 },
      { id: 'tease_sydney', label: "Tease Sydney", intent: "tease", npc: "sydney", hours_passed: 1 },
      { id: 'comfort_sydney', label: "Comfort Sydney", intent: "comfort", npc: "sydney", hours_passed: 1 },
      { id: 'confide_sydney', label: "Confide in Sydney", intent: "confide", npc: "sydney", hours_passed: 1 },
      { id: 'beg_sydney', label: "Beg Sydney for guidance", intent: "beg", npc: "sydney", hours_passed: 1 },
      { id: 'praise_sydney', label: "Praise Sydney's faith", intent: "praise", npc: "sydney", hours_passed: 1 },
      { id: 'kiss_sydney', label: "Kiss Sydney", intent: "kiss", npc: "sydney", hours_passed: 1 },
      { id: 'hold_hands_sydney', label: "Hold hands with Sydney", intent: "hold_hands", npc: "sydney", hours_passed: 1 },
      { id: 'cuddle_sydney', label: "Cuddle with Sydney", intent: "cuddle", npc: "sydney", hours_passed: 1 },
      { id: 'confess_sydney', label: "Confess your feelings to Sydney", intent: "confess", npc: "sydney", hours_passed: 1 },
      { id: 'date_sydney', label: "Ask Sydney on a date", intent: "date", npc: "sydney", hours_passed: 1 },
      { id: 'talk_leighton', label: "Speak with Leighton", intent: "social", npc: "leighton", hours_passed: 1 },
      { id: 'flirt_leighton', label: "Flirt with Leighton", intent: "flirt", npc: "leighton", hours_passed: 1 },
      { id: 'work_leighton', label: "Work alongside Leighton", intent: "work", npc: "leighton", hours_passed: 1 },
      { id: 'threaten_leighton', label: "Confront Leighton", intent: "threaten", npc: "leighton", hours_passed: 1 },
      { id: 'gift_leighton', label: "Give Leighton a gift", intent: "gift", npc: "leighton", hours_passed: 1 },
      { id: 'tease_leighton', label: "Tease Leighton", intent: "tease", npc: "leighton", hours_passed: 1 },
      { id: 'comfort_leighton', label: "Try to comfort Leighton", intent: "comfort", npc: "leighton", hours_passed: 1 },
      { id: 'confide_leighton', label: "Confide in Leighton", intent: "confide", npc: "leighton", hours_passed: 1 },
      { id: 'beg_leighton', label: "Beg Leighton for leniency", intent: "beg", npc: "leighton", hours_passed: 1 },
      { id: 'praise_leighton', label: "Praise Leighton's teaching", intent: "praise", npc: "leighton", hours_passed: 1 },
      { id: 'kiss_leighton', label: "Kiss Leighton", intent: "kiss", npc: "leighton", hours_passed: 1 },
      { id: 'hold_hands_leighton', label: "Hold hands with Leighton", intent: "hold_hands", npc: "leighton", hours_passed: 1 },
      { id: 'cuddle_leighton', label: "Cuddle with Leighton", intent: "cuddle", npc: "leighton", hours_passed: 1 },
      { id: 'confess_leighton', label: "Confess your feelings to Leighton", intent: "confess", npc: "leighton", hours_passed: 1 },
      { id: 'date_leighton', label: "Ask Leighton on a date", intent: "date", npc: "leighton", hours_passed: 1 },
      { id: 'talk_river', label: "Chat with River", intent: "social", npc: "river", hours_passed: 1 },
      { id: 'flirt_river', label: "Flirt with River", intent: "flirt", npc: "river", hours_passed: 1 },
      { id: 'work_river', label: "Work on an assignment with River", intent: "work", npc: "river", hours_passed: 1 },
      { id: 'threaten_river', label: "Intimidate River", intent: "threaten", npc: "river", hours_passed: 1 },
      { id: 'gift_river', label: "Give River a gift", intent: "gift", npc: "river", hours_passed: 1 },
      { id: 'tease_river', label: "Tease River", intent: "tease", npc: "river", hours_passed: 1 },
      { id: 'comfort_river', label: "Comfort River", intent: "comfort", npc: "river", hours_passed: 1 },
      { id: 'confide_river', label: "Confide in River", intent: "confide", npc: "river", hours_passed: 1 },
      { id: 'beg_river', label: "Beg River for help", intent: "beg", npc: "river", hours_passed: 1 },
      { id: 'praise_river', label: "Praise River's teaching", intent: "praise", npc: "river", hours_passed: 1 },
      { id: 'kiss_river', label: "Kiss River", intent: "kiss", npc: "river", hours_passed: 1 },
      { id: 'hold_hands_river', label: "Hold hands with River", intent: "hold_hands", npc: "river", hours_passed: 1 },
      { id: 'cuddle_river', label: "Cuddle with River", intent: "cuddle", npc: "river", hours_passed: 1 },
      { id: 'confess_river', label: "Confess your feelings to River", intent: "confess", npc: "river", hours_passed: 1 },
      { id: 'date_river', label: "Ask River on a date", intent: "date", npc: "river", hours_passed: 1 },
      { id: 'talk_doren', label: "Talk to Doren", intent: "social", npc: "doren", hours_passed: 1 },
      { id: 'flirt_doren', label: "Flirt with Doren", intent: "flirt", npc: "doren", hours_passed: 1 },
      { id: 'work_doren', label: "Ask Doren for tutoring help", intent: "work", npc: "doren", hours_passed: 1 },
      { id: 'confront_doren', label: "Confront Doren", intent: "threaten", npc: "doren", hours_passed: 1 },
      { id: 'gift_doren', label: "Give Doren a gift", intent: "gift", npc: "doren", hours_passed: 1 },
      { id: 'tease_doren', label: "Tease Doren", intent: "tease", npc: "doren", hours_passed: 1 },
      { id: 'comfort_doren', label: "Comfort Doren", intent: "comfort", npc: "doren", hours_passed: 1 },
      { id: 'confide_doren', label: "Confide in Doren", intent: "confide", npc: "doren", hours_passed: 1 },
      { id: 'beg_doren', label: "Beg Doren for an extension", intent: "beg", npc: "doren", hours_passed: 1 },
      { id: 'praise_doren', label: "Praise Doren's class", intent: "praise", npc: "doren", hours_passed: 1 },
      { id: 'kiss_doren', label: "Kiss Doren", intent: "kiss", npc: "doren", hours_passed: 1 },
      { id: 'hold_hands_doren', label: "Hold hands with Doren", intent: "hold_hands", npc: "doren", hours_passed: 1 },
      { id: 'cuddle_doren', label: "Cuddle with Doren", intent: "cuddle", npc: "doren", hours_passed: 1 },
      { id: 'confess_doren', label: "Confess your feelings to Doren", intent: "confess", npc: "doren", hours_passed: 1 },
      { id: 'date_doren', label: "Ask Doren on a date", intent: "date", npc: "doren", hours_passed: 1 },
      { id: 'talk_mason', label: "Speak with Mason", intent: "social", npc: "mason", hours_passed: 1 },
      { id: 'flirt_mason', label: "Flirt with Mason", intent: "flirt", npc: "mason", hours_passed: 1 },
      { id: 'work_mason', label: "Work alongside Mason", intent: "work", npc: "mason", hours_passed: 1 },
      { id: 'threaten_mason', label: "Intimidate Mason", intent: "threaten", npc: "mason", hours_passed: 1 },
      { id: 'gift_mason', label: "Give Mason a gift", intent: "gift", npc: "mason", hours_passed: 1 },
      { id: 'tease_mason', label: "Tease Mason", intent: "tease", npc: "mason", hours_passed: 1 },
      { id: 'comfort_mason', label: "Comfort Mason", intent: "comfort", npc: "mason", hours_passed: 1 },
      { id: 'confide_mason', label: "Confide in Mason", intent: "confide", npc: "mason", hours_passed: 1 },
      { id: 'beg_mason', label: "Beg Mason for help", intent: "beg", npc: "mason", hours_passed: 1 },
      { id: 'praise_mason', label: "Praise Mason's training", intent: "praise", npc: "mason", hours_passed: 1 },
      { id: 'kiss_mason', label: "Kiss Mason", intent: "kiss", npc: "mason", hours_passed: 1 },
      { id: 'hold_hands_mason', label: "Hold hands with Mason", intent: "hold_hands", npc: "mason", hours_passed: 1 },
      { id: 'cuddle_mason', label: "Cuddle with Mason", intent: "cuddle", npc: "mason", hours_passed: 1 },
      { id: 'confess_mason', label: "Confess your feelings to Mason", intent: "confess", npc: "mason", hours_passed: 1 },
      { id: 'date_mason', label: "Ask Mason on a date", intent: "date", npc: "mason", hours_passed: 1 },
      { id: 'travel_market', label: "Walk to the Town Square", intent: "travel", outcome: "You leave the stifling school grounds and head towards the bustling noise of the square.", stat_deltas: { stamina: -10 }, new_location: 'town_square' },
      { id: 'travel_orphanage', label: "Return to the Orphanage", intent: "travel", outcome: "With a heavy heart, you trudge back to the bleak walls of the orphanage.", stat_deltas: { stamina: -10 }, new_location: 'orphanage' }
    ]
  },
  'town_square': {
    id: 'town_square',
    name: "Riften Marketplace",
    atmosphere: "bustling, smelling of fresh bread, roasting venison, woodsmoke, and the damp mist from Lake Honrich",
    danger: 20,
    x: 82, y: 68,
    npcs: ['brynjolf', 'brand_shei', 'avery'],
    description: "The vibrant, chaotic heart of Riften. Merchant stalls line the canal walkways, selling everything from Black-Briar mead to stolen Dwemer trinkets. Wealthy Nord merchants in fine furs brush past ragged Argonian beggars. Members of the Thieves Guild and Riften guards eye each other warily across the crowded plaza beneath the shadow of Mistveil Keep. It's a place of opportunity, but also immense danger for an unprotected youth. The cacophony of shouting vendors, clinking septims, and the splashing of canal water is overwhelming.",
    actions: [
      { id: 'work_stall', label: "Work at a merchant stall", intent: "work", skill_check: { stat: "stamina", difficulty: 30 }, outcome: "You spend the day hauling heavy crates and shouting prices until your throat is raw. It's exhausting, backbreaking work, but the merchant tosses you a few coins at the end of the day.", fail_outcome: "Your tired arms give out and you drop a crate of fragile glass goods. The merchant screams at you and fires you without pay, threatening to call the guards.", stat_deltas: { stamina: -20, stress: 10 }, fail_stat_deltas: { stamina: -10, stress: 20, trauma: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm. Cold, hard, and necessary." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm. Cold, hard, and necessary." }] },
      { id: 'beg_gold', label: "Beg for coins", intent: "social", skill_check: { stat: "purity", difficulty: 20 }, outcome: "You put on your most pathetic expression. A wealthy merchant, perhaps feeling a twinge of guilt, tosses a single coin at your feet with a look of profound pity.", fail_outcome: "A passing town guard kicks dirt at you, calling you a nuisance and threatening to throw you in the dungeons if you don't move along.", stat_deltas: { purity: -5, stress: 5 }, fail_stat_deltas: { stress: 10, trauma: 5 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm. Cold, hard, and necessary." }] },
      { id: 'buy_food', label: "Scrounge a hot meal from a vendor", intent: "social", outcome: "You linger near a food stall looking hungry and pathetic until the vendor, sighing heavily, shoves a bowl of lukewarm stew at you. It's not much, but it fills the hollow ache in your belly.", stat_deltas: { stamina: 10, stress: -10 } },
      { id: 'talk_brynjolf', label: "Talk to Brynjolf", intent: "social", npc: "brynjolf", hours_passed: 1 },
      { id: 'flirt_brynjolf', label: "Flirt with Brynjolf", intent: "flirt", npc: "brynjolf", hours_passed: 1 },
      { id: 'work_brynjolf', label: "Run an errand for Brynjolf", intent: "work", npc: "brynjolf", hours_passed: 1 },
      { id: 'confront_brynjolf', label: "Confront Brynjolf", intent: "threaten", npc: "brynjolf", hours_passed: 1 },
      { id: 'gift_brynjolf', label: "Give Brynjolf a gift", intent: "gift", npc: "brynjolf", hours_passed: 1 },
      { id: 'tease_brynjolf', label: "Tease Brynjolf", intent: "tease", npc: "brynjolf", hours_passed: 1 },
      { id: 'comfort_brynjolf', label: "Comfort Brynjolf", intent: "comfort", npc: "brynjolf", hours_passed: 1 },
      { id: 'confide_brynjolf', label: "Confide in Brynjolf", intent: "confide", npc: "brynjolf", hours_passed: 1 },
      { id: 'beg_brynjolf', label: "Beg Brynjolf for help", intent: "beg", npc: "brynjolf", hours_passed: 1 },
      { id: 'praise_brynjolf', label: "Praise Brynjolf", intent: "praise", npc: "brynjolf", hours_passed: 1 },
      { id: 'kiss_brynjolf', label: "Kiss Brynjolf", intent: "kiss", npc: "brynjolf", hours_passed: 1 },
      { id: 'hold_hands_brynjolf', label: "Hold hands with Brynjolf", intent: "hold_hands", npc: "brynjolf", hours_passed: 1 },
      { id: 'cuddle_brynjolf', label: "Cuddle with Brynjolf", intent: "cuddle", npc: "brynjolf", hours_passed: 1 },
      { id: 'confess_brynjolf', label: "Confess your feelings to Brynjolf", intent: "confess", npc: "brynjolf", hours_passed: 1 },
      { id: 'date_brynjolf', label: "Ask Brynjolf on a date", intent: "date", npc: "brynjolf", hours_passed: 1 },
      { id: 'talk_brand_shei', label: "Browse Brand-Shei's stall", intent: "social", npc: "brand_shei", hours_passed: 1 },
      { id: 'flirt_brand_shei', label: "Flirt with Brand-Shei", intent: "flirt", npc: "brand_shei", hours_passed: 1 },
      { id: 'work_brand_shei', label: "Help Brand-Shei at his stall", intent: "work", npc: "brand_shei", hours_passed: 1 },
      { id: 'threaten_brand_shei', label: "Intimidate Brand-Shei", intent: "threaten", npc: "brand_shei", hours_passed: 1 },
      { id: 'gift_brand_shei', label: "Trade gifts with Brand-Shei", intent: "gift", npc: "brand_shei", hours_passed: 1 },
      { id: 'tease_brand_shei', label: "Tease Brand-Shei", intent: "tease", npc: "brand_shei", hours_passed: 1 },
      { id: 'comfort_brand_shei', label: "Comfort Brand-Shei", intent: "comfort", npc: "brand_shei", hours_passed: 1 },
      { id: 'confide_brand_shei', label: "Confide in Brand-Shei", intent: "confide", npc: "brand_shei", hours_passed: 1 },
      { id: 'beg_brand_shei', label: "Beg Brand-Shei for help", intent: "beg", npc: "brand_shei", hours_passed: 1 },
      { id: 'praise_brand_shei', label: "Praise Brand-Shei's trade", intent: "praise", npc: "brand_shei", hours_passed: 1 },
      { id: 'kiss_brand_shei', label: "Kiss Brand-Shei", intent: "kiss", npc: "brand_shei", hours_passed: 1 },
      { id: 'hold_hands_brand_shei', label: "Hold hands with Brand-Shei", intent: "hold_hands", npc: "brand_shei", hours_passed: 1 },
      { id: 'cuddle_brand_shei', label: "Cuddle with Brand-Shei", intent: "cuddle", npc: "brand_shei", hours_passed: 1 },
      { id: 'confess_brand_shei', label: "Confess your feelings to Brand-Shei", intent: "confess", npc: "brand_shei", hours_passed: 1 },
      { id: 'date_brand_shei', label: "Ask Brand-Shei on a date", intent: "date", npc: "brand_shei", hours_passed: 1 },
      { id: 'talk_avery', label: "Talk to Avery", intent: "social", npc: "avery", hours_passed: 1 },
      { id: 'flirt_avery', label: "Flirt with Avery", intent: "flirt", npc: "avery", hours_passed: 1 },
      { id: 'work_avery', label: "Run an errand for Avery", intent: "work", npc: "avery", hours_passed: 1 },
      { id: 'threaten_avery', label: "Challenge Avery", intent: "threaten", npc: "avery", hours_passed: 1 },
      { id: 'gift_avery', label: "Give Avery a gift", intent: "gift", npc: "avery", hours_passed: 1 },
      { id: 'tease_avery', label: "Tease Avery", intent: "tease", npc: "avery", hours_passed: 1 },
      { id: 'comfort_avery', label: "Comfort Avery", intent: "comfort", npc: "avery", hours_passed: 1 },
      { id: 'confide_avery', label: "Confide in Avery", intent: "confide", npc: "avery", hours_passed: 1 },
      { id: 'beg_avery', label: "Beg Avery for help", intent: "beg", npc: "avery", hours_passed: 1 },
      { id: 'praise_avery', label: "Praise Avery", intent: "praise", npc: "avery", hours_passed: 1 },
      { id: 'kiss_avery', label: "Kiss Avery", intent: "kiss", npc: "avery", hours_passed: 1 },
      { id: 'hold_hands_avery', label: "Hold hands with Avery", intent: "hold_hands", npc: "avery", hours_passed: 1 },
      { id: 'cuddle_avery', label: "Cuddle with Avery", intent: "cuddle", npc: "avery", hours_passed: 1 },
      { id: 'confess_avery', label: "Confess your feelings to Avery", intent: "confess", npc: "avery", hours_passed: 1 },
      { id: 'date_avery', label: "Ask Avery on a date", intent: "date", npc: "avery", hours_passed: 1 },
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
    name: "Temple of Mara",
    atmosphere: "peaceful, smelling of blooming nightshade, mountain flowers, and Cyrodiilic incense",
    danger: 5,
    x: 85, y: 65,
    npcs: ['jordan'],
    description: "A rare place of tranquility in Riften, dedicated to the Divine Mara. Priests in amber robes tend the ancient gardens, and citizens come to pray for love and peace beneath the Gildergreen saplings. The shadows under the large, ancient Hist-like trees offer seclusion, and the air is thick with the sweet, heady scent of blooming nightshade and Cyrodiilic incense. The gentle trickle of a stone fountain carved with Mara's blessing provides a soothing backdrop to the quiet murmurs of the devout.",
    actions: [
      { id: 'pray', label: "Pray at the altar", intent: "neutral", outcome: "You kneel before the altar. A sense of calm washes over you.", stat_deltas: { stress: -20, trauma: -5, purity: 5 } },
      { id: 'rest_bench', label: "Rest on a secluded bench", intent: "neutral", outcome: "You sit and watch the leaves fall. It's quiet here.", stat_deltas: { stamina: 15, stress: -10 } },
      { id: 'drink_fountain', label: "Drink from the temple fountain", intent: "neutral", outcome: "The fountain water is clean and cold. You drink deeply, feeling refreshed.", stat_deltas: { stamina: 5 } },
      { id: 'wash_fountain', label: "Wash in the fountain", intent: "neutral", outcome: "You cup the cool, clear water and wash your face and hands. The grime of the streets dissolves away, and you feel a little more presentable.", stat_deltas: { stress: -5, hygiene: 8, purity: 2 }, hours_passed: 1 },
      { id: 'tend_garden', label: "Help tend the gardens", intent: "work", outcome: "The priests welcome your help weeding and watering the flower beds. The honest labor in the sunshine feels good.", stat_deltas: { stamina: -15, stress: -10, purity: 3 }, skill_deltas: { housekeeping: 2, tending: 3 }, hours_passed: 2 },
      { id: 'talk_jordan', label: "Speak with Jordan", intent: "social", npc: "jordan", hours_passed: 1 },
      { id: 'flirt_jordan', label: "Flirt with Jordan", intent: "flirt", npc: "jordan", hours_passed: 1 },
      { id: 'work_jordan', label: "Assist Jordan with temple duties", intent: "work", npc: "jordan", hours_passed: 1 },
      { id: 'gift_jordan', label: "Give Jordan a gift", intent: "gift", npc: "jordan", hours_passed: 1 },
      { id: 'confront_jordan', label: "Question Jordan's faith", intent: "threaten", npc: "jordan", hours_passed: 1 },
      { id: 'tease_jordan', label: "Tease Jordan", intent: "tease", npc: "jordan", hours_passed: 1 },
      { id: 'comfort_jordan', label: "Seek comfort from Jordan", intent: "comfort", npc: "jordan", hours_passed: 1 },
      { id: 'confide_jordan', label: "Confide in Jordan", intent: "confide", npc: "jordan", hours_passed: 1 },
      { id: 'beg_jordan', label: "Beg Jordan for help", intent: "beg", npc: "jordan", hours_passed: 1 },
      { id: 'praise_jordan', label: "Praise Jordan's devotion", intent: "praise", npc: "jordan", hours_passed: 1 },
      { id: 'kiss_jordan', label: "Kiss Jordan", intent: "kiss", npc: "jordan", hours_passed: 1 },
      { id: 'hold_hands_jordan', label: "Hold hands with Jordan", intent: "hold_hands", npc: "jordan", hours_passed: 1 },
      { id: 'cuddle_jordan', label: "Cuddle with Jordan", intent: "cuddle", npc: "jordan", hours_passed: 1 },
      { id: 'confess_jordan', label: "Confess your feelings to Jordan", intent: "confess", npc: "jordan", hours_passed: 1 },
      { id: 'date_jordan', label: "Ask Jordan on a date", intent: "date", npc: "jordan", hours_passed: 1 },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You leave the peace of the gardens behind.", stat_deltas: { stamina: -5 }, new_location: 'town_square' },
      { id: 'travel_wilds', label: "Wander into the Forest", intent: "travel", outcome: "You slip out the city gates into the dense forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'alleyways': {
    id: 'alleyways',
    name: "The Ratway Passages",
    atmosphere: "dark, claustrophobic, reeking of sewer water, skooma, and decay",
    danger: 60,
    x: 82, y: 72,
    npcs: [],
    description: "The sprawling, dangerous passages beneath and between Riften's timber buildings. It is home to skooma addicts, Thieves Guild footpads, and worse. Shadows seem to move on their own here, and the air is thick with danger and illicit desires. The planks are slick with unknown grime seeping up from the Ratway below, and the stench of sewer water and decay is overpowering. Every footstep echoes ominously through the narrow passages, and you constantly feel eyes watching you from the darkness.",
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
    name: "The Rift Forests",
    atmosphere: "dense, autumnal, filled with the sounds of elk and the distant howl of wolves",
    danger: 40,
    x: 90, y: 60,
    npcs: [],
    description: "The deep pine and birch forests of the Rift, stretching from Riften to the Jerall Mountains. Beautiful but treacherous — wolves, bears, and bandits roam freely beneath the golden-leafed canopy. The trees are so thick that they block out most of the pale Nordic sun, casting the forest floor in perpetual twilight. The air is cool and damp, scented with pine sap and fallen leaves, filled with the rustling of unseen creatures and the distant, lonely howl of a wolf pack.",
    actions: [
      { id: 'forage', label: "Forage for ingredients", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You gather some useful herbs and mushrooms.", fail_outcome: "You wander aimlessly, getting scratched by thorns.", stat_deltas: { stamina: -15 }, fail_stat_deltas: { stamina: -20, pain: 5, stress: 10 }, skill_deltas: { foraging: 3 }, new_items: [{ name: "Blue Mountain Flower", type: "consumable", rarity: "common", description: "Useful for alchemy." }] },
      { id: 'forage_mushrooms', label: "Gather wild mushrooms", intent: "work", skill_check: { stat: "willpower", difficulty: 20 }, outcome: "You spot clusters of earthy brown mushrooms growing at the base of fallen birch trees. You harvest a good handful.", fail_outcome: "You can't tell the edible ones from the poisonous. You leave empty-handed rather than risk it.", stat_deltas: { stamina: -10 }, fail_stat_deltas: { stamina: -10, stress: 5 }, skill_deltas: { foraging: 2 }, new_items: [{ id: 'wild_mushrooms', name: "Wild Mushrooms", type: "consumable", rarity: "common", description: "A handful of earthy forest mushrooms.", value: 3, weight: 0.2, stats: { health: 5, stamina: 8 } }], hours_passed: 1 },
      { id: 'forage_herbs', label: "Gather forest herbs", intent: "work", skill_check: { stat: "willpower", difficulty: 25 }, outcome: "Among the roots and loam you find clusters of wild thyme, rosemary, and sage — fragrant and fresh.", fail_outcome: "You trample through the undergrowth but find mostly nettles and thorns. Your hands sting.", stat_deltas: { stamina: -10 }, fail_stat_deltas: { stamina: -10, pain: 3 }, skill_deltas: { foraging: 2, tending: 1 }, new_items: [{ id: 'forest_herbs', name: "Forest Herbs", type: "consumable", rarity: "common", description: "A fragrant bundle of wild herbs.", value: 4, weight: 0.1, stats: { health: 3, stress: -3 } }], hours_passed: 1 },
      { id: 'forage_berries', label: "Pick wild berries", intent: "work", outcome: "Bilberry bushes line the forest path. You fill your hands with tart, dark berries, staining your fingers purple.", stat_deltas: { stamina: -8 }, skill_deltas: { foraging: 1 }, new_items: [{ id: 'wild_berries', name: "Wild Berries", type: "consumable", rarity: "common", description: "A mix of tart wild berries.", value: 2, weight: 0.2, stats: { health: 4, stamina: 6, stress: -2 } }], hours_passed: 1 },
      { id: 'chop_firewood', label: "Chop and gather firewood", intent: "work", outcome: "You find a fallen pine, dry and ready. An hour of splitting and stacking gives you a good bundle of firewood.", fail_outcome: "The wood is too green and wet to split cleanly. You exhaust yourself for poor results.", stat_deltas: { stamina: -20 }, fail_stat_deltas: { stamina: -25, pain: 5 }, skill_deltas: { athletics: 2 }, new_items: [{ id: 'firewood', name: "Firewood", type: "misc", rarity: "common", description: "A bundle of dry split pine.", value: 2, weight: 2.0 }], hours_passed: 1 },
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
    name: "Riften Docks",
    atmosphere: "foggy, smelling of Lake Honrich brine, dead fish, and cheap Black-Briar ale",
    danger: 30,
    x: 85, y: 70,
    npcs: [],
    description: "Wooden walkways stretch out over the dark, churning waters of Lake Honrich. Argonian fishermen haul in their catches while Nord workers toil under the harsh gaze of Maven Black-Briar's overseers. It's a rough place, especially at night, when the fog rolls in thick and heavy off the lake, obscuring the skooma deals and violent encounters that take place in the shadows beneath the boardwalk. The smell of lake brine, dead fish, and cheap ale is inescapable.",
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
    name: "The Haelga's Bunkhouse",
    atmosphere: "hazy, sweet-smelling, the scent of Dibella's oils and hushed indiscretions",
    danger: 70,
    x: 80, y: 75,
    npcs: ['briar'],
    description: "Hidden behind the respectable facade of a bunkhouse in Riften's lower district, Haelga runs a secret den devoted to Dibella's more carnal rites. Patrons lie on plush fur-draped beds, lost in skooma hazes or engaging in base desires. The air itself makes you feel lightheaded and flushed, thick with the scent of Nibenese perfumes, mead-sweat, and spilled Alto wine. Dibella's statues watch from every alcove, their stone eyes seemingly alive in the dim, suggestive candlelight.",
    actions: [
      { id: 'serve_drinks', label: "Serve drinks (and more)", intent: "work", skill_check: { stat: "lust", difficulty: 50 }, outcome: "You navigate the handsy patrons, earning a significant amount of coin, though you feel degraded.", fail_outcome: "A patron gets too aggressive. You manage to escape, but you are shaken and unpaid.", stat_deltas: { stamina: -15, stress: 20, lust: 15, purity: -10, trauma: 5 }, fail_stat_deltas: { pain: 10, stress: 30, trauma: 15, lust: 20 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'dance_stage', label: "Dance on the stage", intent: "work", skill_check: { stat: "stamina", difficulty: 45 }, outcome: "You climb onto the small, candlelit stage and move to the rhythm of the lute player in the corner. The crowd watches, enraptured. Coins are tossed at your feet.", fail_outcome: "You stumble and trip on the uneven boards. The crowd laughs cruelly. You slink off the stage in shame.", stat_deltas: { stamina: -20, stress: 15, lust: 10, allure: 3, purity: -5 }, fail_stat_deltas: { stress: 25, trauma: 5, stamina: -10 }, skill_deltas: { dancing: 4, seduction: 2 }, fail_skill_deltas: { dancing: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'buy_business_license_brothel', label: "Purchase business license (200 gold)", intent: "neutral", outcome: "You pay for an official (and extremely expensive) licence to operate an entertainment establishment. The paperwork bears Maven Black-Briar's seal. A dangerous but lucrative path.", fail_outcome: "You don't have enough gold or the required reputation for a business licence.", stat_deltas: {}, hours_passed: 2 },
      { id: 'hire_staff_brothel', label: "Hire a member of staff (25 gold/day)", intent: "social", skill_check: { stat: "allure", difficulty: 40 }, outcome: "You find a willing worker and negotiate terms. Having reliable staff will increase your daily earnings.", fail_outcome: "No one suitable is looking for work today. Try again another time.", stat_deltas: { stress: 5 }, fail_stat_deltas: { stress: 10, stamina: -5 }, hours_passed: 2 },
      { id: 'set_prices_brothel', label: "Review and adjust pricing", intent: "neutral", outcome: "You study the competition's rates and adjust your own prices thoughtfully. Better pricing means better income without alienating patrons.", stat_deltas: { stress: -3, willpower: 2 }, skill_deltas: { seduction: 1 }, hours_passed: 1 },
      { id: 'collect_earnings_brothel', label: "Collect the night's earnings", intent: "neutral", outcome: "You count the coins from the evening's takings. The business is paying off — slowly, painfully, but it's paying off.", stat_deltas: { stress: -5 }, hours_passed: 1 },
      { id: 'talk_briar', label: "Talk to Briar", intent: "social", npc: "briar", hours_passed: 1 },
      { id: 'flirt_briar', label: "Flirt with Briar", intent: "flirt", npc: "briar", hours_passed: 1 },
      { id: 'work_briar', label: "Work for Briar", intent: "work", npc: "briar", hours_passed: 1 },
      { id: 'threaten_briar', label: "Challenge Briar's authority", intent: "threaten", npc: "briar", hours_passed: 1 },
      { id: 'gift_briar', label: "Give Briar a gift", intent: "gift", npc: "briar", hours_passed: 1 },
      { id: 'tease_briar', label: "Tease Briar", intent: "tease", npc: "briar", hours_passed: 1 },
      { id: 'comfort_briar', label: "Comfort Briar", intent: "comfort", npc: "briar", hours_passed: 1 },
      { id: 'confide_briar', label: "Confide in Briar", intent: "confide", npc: "briar", hours_passed: 1 },
      { id: 'beg_briar', label: "Beg Briar for help", intent: "beg", npc: "briar", hours_passed: 1 },
      { id: 'praise_briar', label: "Praise Briar", intent: "praise", npc: "briar", hours_passed: 1 },
      { id: 'kiss_briar', label: "Kiss Briar", intent: "kiss", npc: "briar", hours_passed: 1 },
      { id: 'hold_hands_briar', label: "Hold hands with Briar", intent: "hold_hands", npc: "briar", hours_passed: 1 },
      { id: 'cuddle_briar', label: "Cuddle with Briar", intent: "cuddle", npc: "briar", hours_passed: 1 },
      { id: 'confess_briar', label: "Confess your feelings to Briar", intent: "confess", npc: "briar", hours_passed: 1 },
      { id: 'date_briar', label: "Ask Briar on a date", intent: "date", npc: "briar", hours_passed: 1 },
      { id: 'travel_alleyways', label: "Flee back to the Alleyways", intent: "flee", outcome: "You stumble out of the hazy den, gasping for cleaner air.", stat_deltas: { stamina: -5, stress: -5 }, new_location: 'alleyways' }
    ]
  },
  'farm': {
    id: 'farm',
    name: "Goldenglow Estate",
    atmosphere: "smelling of hay, honeycomb, and rich Rift soil",
    danger: 15,
    x: 95, y: 65,
    npcs: ['alex'],
    description: "A sprawling bee farm and wheat estate on the island in Lake Honrich, connected to the mainland by a narrow bridge. Fields of wheat stretch out like a golden sea under the amber-leafed trees of the Rift, and large Nordic barns house honeybee apiaries. The farmhands are gruff Nords who leave you alone if you work hard. The smell of honey, hay, and rich earth is strong, a stark contrast to the stench of Riften's alleys.",
    actions: [
      { id: 'farm_labor', label: "Do manual labor in the fields", intent: "work", skill_check: { stat: "stamina", difficulty: 50 }, outcome: "Backbreaking work under the sun. You are exhausted but paid.", fail_outcome: "You collapse from the heat. The farmer yells at you and kicks you off the property.", stat_deltas: { stamina: -30, stress: 5 }, fail_stat_deltas: { health: -10, stamina: -40, pain: 10, stress: 15 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'milk_cows', label: "Milk the cows", intent: "work", outcome: "You spend the morning milking the cows. The farmer's wife gives you a bowl of fresh milk and a heel of bread as payment.", stat_deltas: { stamina: -10, stress: -5 }, skill_deltas: { housekeeping: 2 }, hours_passed: 2 },
      { id: 'sleep_barn', label: "Sleep in the barn hay loft", intent: "neutral", outcome: "You burrow into the warm, sweet-smelling hay in the barn loft. The gentle sounds of the animals below are oddly comforting. You sleep deeply.", stat_deltas: { stamina: 35, stress: -15 }, hours_passed: 8 },
      { id: 'eat_garden', label: "Steal vegetables from the garden", intent: "stealth", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "You grab a handful of carrots and a turnip from the kitchen garden when no one is looking. Your stomach growls in anticipation.", fail_outcome: "The farmer's dog spots you and barks furiously! You drop the vegetables and run.", stat_deltas: { stress: 5 }, fail_stat_deltas: { stress: 15, stamina: -10 }, skill_deltas: { skulduggery: 1 } },
      { id: 'tend_crops', label: "Help tend the crops", intent: "work", outcome: "You spend the afternoon weeding, watering, and checking the wheat for blight. The farmer nods approvingly at your work.", stat_deltas: { stamina: -15, stress: -5, willpower: 3 }, skill_deltas: { tending: 4 }, hours_passed: 3 },
      { id: 'talk_alex', label: "Talk to Alex", intent: "social", npc: "alex", hours_passed: 1 },
      { id: 'flirt_alex', label: "Flirt with Alex", intent: "flirt", npc: "alex", hours_passed: 1 },
      { id: 'work_alex', label: "Work alongside Alex", intent: "work", npc: "alex", hours_passed: 1 },
      { id: 'threaten_alex', label: "Challenge Alex", intent: "threaten", npc: "alex", hours_passed: 1 },
      { id: 'gift_alex', label: "Give Alex a gift", intent: "gift", npc: "alex", hours_passed: 1 },
      { id: 'tease_alex', label: "Tease Alex", intent: "tease", npc: "alex", hours_passed: 1 },
      { id: 'comfort_alex', label: "Comfort Alex", intent: "comfort", npc: "alex", hours_passed: 1 },
      { id: 'confide_alex', label: "Confide in Alex", intent: "confide", npc: "alex", hours_passed: 1 },
      { id: 'beg_alex', label: "Beg Alex for help", intent: "beg", npc: "alex", hours_passed: 1 },
      { id: 'praise_alex', label: "Praise Alex's work", intent: "praise", npc: "alex", hours_passed: 1 },
      { id: 'kiss_alex', label: "Kiss Alex", intent: "kiss", npc: "alex", hours_passed: 1 },
      { id: 'hold_hands_alex', label: "Hold hands with Alex", intent: "hold_hands", npc: "alex", hours_passed: 1 },
      { id: 'cuddle_alex', label: "Cuddle with Alex", intent: "cuddle", npc: "alex", hours_passed: 1 },
      { id: 'confess_alex', label: "Confess your feelings to Alex", intent: "confess", npc: "alex", hours_passed: 1 },
      { id: 'date_alex', label: "Ask Alex on a date", intent: "date", npc: "alex", hours_passed: 1 },
      { id: 'travel_wilds', label: "Head into the Forest", intent: "travel", outcome: "You leave the cultivated fields for the untamed forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'swamp': {
    id: 'swamp',
    name: "Hjaalmarch Marshes",
    atmosphere: "thick, humid, smelling of deathbell and ancient Nordic sorcery",
    danger: 80,
    x: 95, y: 80,
    npcs: [],
    description: "The treacherous marshlands of Hjaalmarch, stretching from Morthal to the Sea of Ghosts. The peat bogs suck at your boots with every step, and strange, luminous wisps — the infamous Swamp Lights — pulse and dance through the fog. It feels like the land itself is watching you. The air is thick, humid, and smells of deathbell and ancient, stagnant magicka. Chaurus clicks and the splash of mudcrabs echo through the mist, warning of the horrors lurking beneath the murky water.",
    actions: [
      { id: 'gather_rare_herbs', label: "Search for rare swamp flora", intent: "work", skill_check: { stat: "willpower", difficulty: 70 }, outcome: "You find a glowing mushroom, carefully avoiding the toxic pools.", fail_outcome: "You step into a deep bog! Leeches attach to you before you can scramble out.", stat_deltas: { stamina: -20, stress: 15 }, fail_stat_deltas: { health: -20, pain: 20, stress: 30, trauma: 10, purity: -10 }, new_items: [{ name: "Glowing Mushroom", type: "consumable", rarity: "rare", description: "Pulses with strange energy." }] },
      { id: 'forage_swamp_root', label: "Dig for swamp root", intent: "work", skill_check: { stat: "willpower", difficulty: 55 }, outcome: "Wading through the shallows, you find the telltale rust-red stems of swamp root plants. You dig carefully and pull several thick roots free.", fail_outcome: "You wade into a deep section and sink to your thighs before you can pull back. You surface sodden and empty-handed.", stat_deltas: { stamina: -20, hygiene: -10 }, fail_stat_deltas: { health: -5, stamina: -25, hygiene: -20, stress: 15, trauma: 5 }, skill_deltas: { foraging: 3 }, new_items: [{ id: 'swamp_root', name: "Swamp Root", type: "consumable", rarity: "uncommon", description: "A twisted, bitter root from the bog. Potent in small doses.", value: 15, weight: 0.3, stats: { health: -5, stamina: -5 } }], hours_passed: 2 },
      { id: 'forage_rare_fungi_swamp', label: "Hunt for rare swamp fungi", intent: "work", skill_check: { stat: "willpower", difficulty: 65 }, outcome: "Deep in the mist, growing on a rotting log half-submerged in murky water, you find a cluster of pulsing bioluminescent fungi. The light they give off is unsettling but beautiful.", fail_outcome: "The thick mist hides too many dangers. Something bites your ankle — you scramble back to solid ground.", stat_deltas: { stamina: -25, stress: 20 }, fail_stat_deltas: { health: -10, pain: 15, stress: 25, trauma: 8 }, skill_deltas: { foraging: 4 }, new_items: [{ id: 'rare_fungi', name: "Rare Fungi", type: "consumable", rarity: "rare", description: "Bioluminescent fungi with arcane properties.", value: 20, weight: 0.2, stats: { health: -3, lust: 8, corruption: 3 } }], hours_passed: 3 },
      { id: 'travel_wilds', label: "Flee back to the Forest", intent: "flee", outcome: "You scramble out of the muck, desperate for solid ground.", stat_deltas: { stamina: -15, stress: -5 }, new_location: 'forest' }
    ]
  },
  'lake': {
    id: 'lake',
    name: "Lake Honrich Shore",
    atmosphere: "serene, shimmering, smelling of fresh snowmelt and mountain wildflowers",
    danger: 25,
    x: 92, y: 55,
    npcs: [],
    description: "The clear, cold shores of Lake Honrich, fed by mountain streams from the Jerall range. Smooth grey stones line the bank, and tall rushes sway gently in the Rift's warm breeze. The water is crystal-clear in the shallows, darkening to an inky, unknowable depth at the center where Goldenglow Estate's island sits. Dragonflies hum over the surface. It is peaceful here, but the Skyrim wilderness is never truly safe.",
    actions: [
      { id: 'swim_lake', label: "Swim in the lake", intent: "neutral", skill_check: { stat: "stamina", difficulty: 25 }, outcome: "You dive into the cool, refreshing water. The grime and tension of the city wash away as you float on your back, watching clouds drift by.", fail_outcome: "You wade in too deep and a sudden current pulls you under. You swallow water and barely drag yourself back to shore, coughing and shivering.", stat_deltas: { stamina: -10, stress: -15, purity: 5, hygiene: 10 }, fail_stat_deltas: { health: -10, stamina: -20, stress: 15, trauma: 5 }, skill_deltas: { swimming: 3 } },
      { id: 'bathe_lake', label: "Bathe and wash yourself", intent: "neutral", outcome: "You strip down and scrub yourself clean in the cold but refreshing water. The dirt and sweat of days of hardship dissolve away, leaving your skin tingling.", stat_deltas: { stress: -10, hygiene: 15, purity: 3 }, hours_passed: 1 },
      { id: 'fish_lake', label: "Fish from the shore", intent: "work", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "After patient waiting, you hook a fat silver trout. Fresh food at last!", fail_outcome: "You sit for hours without a single bite. The mosquitoes feast on you instead.", stat_deltas: { stamina: -10, stress: 5 }, fail_stat_deltas: { stamina: -15, stress: 10, pain: 3 }, new_items: [{ name: "Silver Trout", type: "consumable", rarity: "common", description: "A fresh-caught fish, its scales gleaming. Eating it would restore energy and hunger." }] },
      { id: 'forage_fish', label: "Catch fish by hand", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You wade into the shallows and tickle a sleepy trout from beneath a rock. An old trick, but it works.", fail_outcome: "The cold water numbs your hands before you can grab anything. You give up, shivering.", stat_deltas: { stamina: -15, hygiene: -5 }, fail_stat_deltas: { stamina: -20, hygiene: -10, stress: 5 }, skill_deltas: { foraging: 2, swimming: 1 }, new_items: [{ id: 'fish', name: "Fresh Fish", type: "consumable", rarity: "common", description: "A freshly caught river trout.", value: 5, weight: 0.5, stats: { health: 8, stamina: 12 } }], hours_passed: 1 },
      { id: 'gather_river_stones', label: "Collect river stones", intent: "work", outcome: "You wade into the shallows and gather a handful of smooth, flat river stones — good for skipping, throwing, or trade.", stat_deltas: { stamina: -5 }, skill_deltas: { foraging: 1 }, new_items: [{ id: 'river_stones', name: "River Stones", type: "misc", rarity: "common", description: "Smooth, palm-sized stones from the riverbed.", value: 1, weight: 0.8 }], hours_passed: 1 },
      { id: 'travel_forest', label: "Return to the Forest", intent: "travel", outcome: "You follow the trail back through the trees.", stat_deltas: { stamina: -5 }, new_location: 'forest' },
      { id: 'travel_beach', label: "Follow the shore to the Beach", intent: "travel", outcome: "You walk along the lakeshore until the trees thin and sand replaces stone.", stat_deltas: { stamina: -10 }, new_location: 'beach' }
    ]
  },
  'beach': {
    id: 'beach',
    name: "Sea of Ghosts Shoreline",
    atmosphere: "windswept, salty, the crashing of icy waves on grey volcanic sand",
    danger: 30,
    x: 97, y: 50,
    npcs: [],
    description: "A desolate stretch of grey-black volcanic sand where the northern coast meets the frigid Sea of Ghosts. Horker bones and seaweed litter the shore. The wind here is constant and biting, carrying the tang of salt and the distant rumble of ice floes. Tide pools hold strange, bioluminescent sea creatures, and the distant ice cliffs are riddled with dark sea caves. It's exposed and lonely, but the vastness of the northern ocean offers a strange sense of freedom from Tamriel's politics.",
    actions: [
      { id: 'beachcomb', label: "Comb the beach for valuables", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "Between the pebbles you find a small, barnacle-encrusted chest wedged in the rocks. Inside is a handful of old coins.", fail_outcome: "You find nothing but damp sand and disappointment. A wave soaks you to the bone.", stat_deltas: { stamina: -10, stress: 5 }, fail_stat_deltas: { stamina: -15, stress: 10, hygiene: -5 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'gather_driftwood', label: "Collect driftwood", intent: "work", outcome: "The tide line is thick with salt-bleached driftwood. You gather a good armful — useful as fuel or raw material.", stat_deltas: { stamina: -10 }, skill_deltas: { foraging: 1 }, new_items: [{ id: 'driftwood', name: "Driftwood", type: "misc", rarity: "common", description: "Salt-bleached wood worn smooth by waves.", value: 1, weight: 1.5 }], hours_passed: 1 },
      { id: 'gather_sea_glass', label: "Hunt for sea glass", intent: "work", skill_check: { stat: "willpower", difficulty: 20 }, outcome: "You sift through the pebbles along the tide line and find a dozen pieces of beautiful frosted sea glass in pale green and blue.", fail_outcome: "You pick through gravel for an age but find nothing but plain pebbles.", stat_deltas: { stamina: -8, stress: -8 }, fail_stat_deltas: { stamina: -10, stress: 3 }, skill_deltas: { foraging: 1 }, new_items: [{ id: 'sea_glass', name: "Sea Glass", type: "misc", rarity: "common", description: "Fragments of frosted bottle glass tumbled smooth by the sea.", value: 3, weight: 0.1 }], hours_passed: 1 },
      { id: 'forage_crabs', label: "Catch shore crabs", intent: "work", skill_check: { stat: "stamina", difficulty: 30 }, outcome: "You turn over rocks along the shoreline and grab quick shore crabs before they can pinch you. You catch enough for a meal.", fail_outcome: "The crabs are faster than they look. One clamps onto your finger and refuses to let go. Ow.", stat_deltas: { stamina: -12 }, fail_stat_deltas: { pain: 5, stamina: -15, stress: 5 }, skill_deltas: { foraging: 2 }, new_items: [{ id: 'shore_crabs', name: "Shore Crabs", type: "consumable", rarity: "common", description: "A handful of small, feisty shore crabs. Good eating once cooked.", value: 4, weight: 0.4, stats: { health: 8, stamina: 10 } }], hours_passed: 1 },
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
    name: "Honeyside Hideout",
    atmosphere: "quiet, dusty, but safe — the smell of old Nordic pine and dried mountain herbs",
    danger: 0,
    x: 75, y: 75,
    npcs: [],
    description: "A tiny, cramped room in a forgotten corner of Riften's canal district, above a disused fishmonger's stall. The thatched roof leaks during Skyrim's storms, the floor creaks, and the single window overlooks the dark canal waters. But it's yours. A thin straw mattress on a stone shelf, a battered Nord chest for your belongings, and a small clay brazier for heating water. It's not much, but it's the only place in all of Tamriel where you can bar the door and feel something close to safety.",
    actions: [
      { id: 'sleep_home', label: "Sleep in your bed", intent: "neutral", outcome: "You collapse onto the thin mattress. The familiar sounds of the building settling around you are oddly comforting. You sleep deeply and without nightmares for once.", stat_deltas: { stamina: 40, stress: -20, pain: -5 }, hours_passed: 8 },
      { id: 'eat_rations', label: "Eat from your supplies", intent: "neutral", outcome: "You open the battered chest and eat what little food you have squirreled away. It's not a feast, but it fills the hollow ache in your belly.", stat_deltas: { stamina: 10, stress: -5 } },
      { id: 'wash_home', label: "Wash with the basin water", intent: "neutral", outcome: "You heat a small pot of water on the clay stove and scrub yourself clean with a rag. The warm water feels like a luxury.", stat_deltas: { stress: -10, hygiene: 20, pain: -3 }, hours_passed: 1 },
      { id: 'cook_home', label: "Cook a simple meal", intent: "work", skill_check: { stat: "willpower", difficulty: 25 }, outcome: "You prepare a simple but filling stew from odds and ends. The smell fills your tiny room with warmth. Your cooking skills improve.", fail_outcome: "You burn the food badly. The acrid smoke fills the room and you have to open the window, attracting attention from the alley below.", stat_deltas: { stamina: 15, stress: -5 }, fail_stat_deltas: { stress: 10, stamina: -5 }, skill_deltas: { cooking: 3 } },
      { id: 'cook_recipe_home', label: "Cook from a known recipe", intent: "work", skill_check: { stat: "willpower", difficulty: 20 }, outcome: "Following a recipe you know well, you carefully prepare a proper meal from your gathered ingredients. The result is hearty and nourishing.", fail_outcome: "Something goes wrong with the proportions. The meal is edible but unpleasant.", stat_deltas: { stamina: 20, stress: -10 }, fail_stat_deltas: { stamina: 5, stress: 5 }, skill_deltas: { cooking: 4 }, hours_passed: 1 },
      { id: 'rest_recover_home', label: "Rest and recover deeply", intent: "neutral", outcome: "You spend the day resting properly — changing your bandages, eating small meals, and allowing your body to truly heal. You feel significantly better.", stat_deltas: { health: 20, stamina: 50, pain: -15, stress: -25, trauma: -5 }, hours_passed: 10 },
      { id: 'tend_garden_home', label: "Tend the windowsill herbs", intent: "work", outcome: "You carefully water and trim the small pots of herbs on your windowsill. The mint is thriving, and the chamomile is about to bloom.", stat_deltas: { stress: -10, willpower: 3 }, skill_deltas: { tending: 3 }, hours_passed: 1 },
      { id: 'harvest_garden_home', label: "Harvest garden herbs", intent: "work", outcome: "Your patient tending has paid off. You harvest a good crop of fresh herbs from the windowsill pots.", stat_deltas: { stress: -5 }, skill_deltas: { tending: 2, foraging: 1 }, new_items: [{ id: 'forest_herbs', name: "Garden Herbs", type: "consumable", rarity: "common", description: "Freshly harvested herbs from your windowsill garden.", value: 4, weight: 0.1, stats: { health: 3, stress: -3 } }], hours_passed: 1 },
      { id: 'study_desk_home', label: "Study at your desk", intent: "education", outcome: "You sit at your small writing table and work through a primer methodically. The knowledge accumulates steadily. Your mind feels sharper.", stat_deltas: { stamina: -15, willpower: 8, stress: -5 }, skill_deltas: { lore_mastery: 4 }, hours_passed: 2 },
      { id: 'upgrade_bed', label: "Buy a better mattress (20 gold)", intent: "neutral", outcome: "You purchase a proper wool-stuffed mattress from a second-hand merchant. Your sleep will be much better from now on.", fail_outcome: "You don't have enough gold for that.", stat_deltas: {}, hours_passed: 1 },
      { id: 'upgrade_storage', label: "Buy a lockbox for storage (15 gold)", intent: "neutral", outcome: "A sturdy iron lockbox now sits in the corner. Your belongings are safer and better organised.", fail_outcome: "You don't have enough gold for that.", stat_deltas: {}, hours_passed: 1 },
      { id: 'upgrade_security', label: "Reinforce your door lock (30 gold)", intent: "neutral", outcome: "A proper bolt and bar now secures your door. Your home feels significantly safer.", fail_outcome: "You don't have enough gold for that.", stat_deltas: {}, hours_passed: 2 },
      { id: 'upgrade_alchemy_station', label: "Set up an alchemy corner (50 gold)", intent: "neutral", outcome: "With a mortar, pestle, and a few glass vials arranged on a shelf, you now have a simple workspace for crafting salves and potions.", fail_outcome: "You don't have enough gold for that.", stat_deltas: {}, hours_passed: 3 },
      { id: 'exercise_home', label: "Exercise in your room", intent: "neutral", outcome: "Push-ups, sit-ups, squats — the floor is hard and the space is cramped, but you push yourself. Your muscles burn pleasantly.", stat_deltas: { stamina: -15, pain: 3, stress: -5 }, skill_deltas: { athletics: 2 }, hours_passed: 1 },
      { id: 'study_home', label: "Study by candlelight", intent: "education", outcome: "You pour over a battered primer by the flickering light of a tallow candle. The words swim before your tired eyes, but knowledge seeps in.", stat_deltas: { stamina: -10, willpower: 5 }, skill_deltas: { lore_mastery: 2 }, hours_passed: 2 },
      { id: 'travel_alleyways', label: "Step out into the Alleyways", intent: "travel", outcome: "You lock the flimsy door behind you and descend the creaking stairs into the maze of alleys.", stat_deltas: { stamina: -3 }, new_location: 'alleyways' },
      { id: 'travel_market', label: "Head to the Town Square", intent: "travel", outcome: "You navigate the back alleys to the bustling main streets.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'park': {
    id: 'park',
    name: "Dragonsreach Gardens",
    atmosphere: "open grassy terraces, ancient juniper trees, the distant sound of the Wind District bells",
    danger: 15,
    x: 78, y: 60,
    npcs: [],
    description: "A wide-open terraced garden on the outskirts of the Cloud District. Ancient juniper trees provide shade over weathered stone benches, and a crumbling fountain dedicated to Kynareth sits at the center, its water green with moss. During the day, nobles and bards stroll the winding paths beneath Dragonsreach's shadow. At night, the gardens empty and become the domain of the desperate and the predatory. A few stray dogs from the Plains District have made the underbrush their home.",
    actions: [
      { id: 'rest_park', label: "Rest on a park bench", intent: "neutral", outcome: "You sit on one of the wooden benches and watch the world go by. Squirrels chase each other through the branches above. For a brief moment, everything feels normal.", stat_deltas: { stamina: 15, stress: -15, pain: -3 }, hours_passed: 1 },
      { id: 'exercise_park', label: "Jog along the park paths", intent: "neutral", outcome: "You run along the gravel paths, your breath misting in the cool air. The steady rhythm of your feet calms your racing thoughts.", stat_deltas: { stamina: -20, stress: -10, pain: 3 }, skill_deltas: { athletics: 3 }, hours_passed: 1 },
      { id: 'forage_park', label: "Gather lichen and herbs", intent: "work", skill_check: { stat: "willpower", difficulty: 25 }, outcome: "You find useful mosses and herbs growing on the old stone walls and beneath the oak trees.", fail_outcome: "You search for an hour but find nothing useful. A park warden eyes you suspiciously.", stat_deltas: { stamina: -10 }, fail_stat_deltas: { stamina: -10, stress: 5 }, skill_deltas: { foraging: 2, tending: 1 }, hours_passed: 1 },
      { id: 'gather_flowers_park', label: "Pick wildflowers", intent: "work", outcome: "The gardens are full of wildflowers in season. You gather a cheerful bunch of daisies, lavender, and pansies. They could be used as a temple offering or brewed into a light tea.", stat_deltas: { stamina: -5, stress: -5 }, skill_deltas: { foraging: 1 }, new_items: [{ id: 'forest_herbs', name: "Wildflowers", type: "consumable", rarity: "common", description: "A fragrant mix of garden wildflowers — daisies, lavender, pansies.", value: 2, weight: 0.1, stats: { stress: -5, purity: 2 } }], hours_passed: 1 },
      { id: 'gather_seeds_park', label: "Collect seeds and seedlings", intent: "work", skill_check: { stat: "willpower", difficulty: 20 }, outcome: "You collect seeds from ornamental plants and carefully uproot a few small herb seedlings to transplant to your windowsill.", fail_outcome: "The seeds you collect turn out to be weeds — useless.", stat_deltas: { stamina: -8 }, fail_stat_deltas: { stamina: -8, stress: 3 }, skill_deltas: { foraging: 1, tending: 2 }, new_items: [{ id: 'forest_herbs', name: "Park Herbs", type: "consumable", rarity: "common", description: "Garden herbs gathered from the park.", value: 3, weight: 0.1, stats: { health: 3, stress: -3 } }], hours_passed: 1 },
      { id: 'gather_apples_park', label: "Pick apples from the old tree", intent: "work", outcome: "An old crab apple tree in the corner of the park is heavy with small, tart fruit. You fill your pockets.", stat_deltas: { stamina: -5 }, skill_deltas: { foraging: 1 }, new_items: [{ id: 'wild_berries', name: "Crab Apples", type: "consumable", rarity: "common", description: "Small, tart crab apples from the park tree.", value: 2, weight: 0.3, stats: { health: 5, stamina: 8 } }], hours_passed: 1 },
      { id: 'busk_park', label: "Perform for coin", intent: "social", skill_check: { stat: "allure", difficulty: 35 }, outcome: "You sing and dance for the park visitors. A few toss coins into your cap, smiling. You feel a warm glow of acceptance.", fail_outcome: "Your performance falls flat. People look away awkwardly, and a heckler shouts insults.", stat_deltas: { stamina: -15, stress: 5 }, fail_stat_deltas: { stress: 15, trauma: 3 }, skill_deltas: { dancing: 2, seduction: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'travel_market', label: "Walk to the Town Square", intent: "travel", outcome: "You follow the main path out of the park towards the square.", stat_deltas: { stamina: -5 }, new_location: 'town_square' },
      { id: 'travel_school', label: "Head to the School", intent: "travel", outcome: "You cut across the park towards the school grounds.", stat_deltas: { stamina: -5 }, new_location: 'school' },
      { id: 'travel_forest', label: "Enter the Forest", intent: "travel", outcome: "The park paths give way to wild undergrowth as you step into the forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'hospital': {
    id: 'hospital',
    name: "Temple of Kynareth",
    atmosphere: "serene, smelling of juniper salve and restoration magic, hushed prayers and groaning patients",
    danger: 5,
    x: 70, y: 55,
    npcs: ['harper'],
    description: "The temple of Kynareth in Whiterun's Wind District doubles as the town's sole healing house, a large stone building with narrow stained-glass windows and a perpetual aura of divine energy. Priestesses in green robes move silently between the beds, administering potions and casting restoration spells in equal measure. The head physician, Harper, is brilliant but unsettling — their gaze lingers too long, and their alchemical treatments sometimes feel more like Telvanni experiments. The pharmacy counter sells potions at steep septim prices.",
    actions: [
      { id: 'see_doctor', label: "See the doctor", intent: "neutral", outcome: "Harper examines you with cold, clinical efficiency. They prescribe rest and a foul-tasting tonic. Your wounds feel somewhat better, though Harper's lingering gaze makes your skin crawl.", stat_deltas: { health: 20, pain: -15, stress: 10 }, hours_passed: 2 },
      { id: 'buy_medicine', label: "Buy medicine from the pharmacy", intent: "social", outcome: "You purchase a small vial of healing tonic from the pharmacy counter. It costs dearly.", stat_deltas: {}, new_items: [{ name: "Healing Tonic", type: "consumable", rarity: "uncommon", description: "A professionally prepared medicine. Bitter but effective." }] },
      { id: 'rest_ward', label: "Rest in the ward", intent: "neutral", outcome: "You lie down on a thin cot in the crowded ward. The groans of the other patients are disturbing, but the rest helps your body recover.", stat_deltas: { stamina: 25, health: 10, stress: 5, pain: -10 }, hours_passed: 6 },
      { id: 'volunteer', label: "Volunteer as a nurse's aide", intent: "work", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "You help change bandages and carry bedpans. It's grim work, but the nuns thank you warmly and slip you a few coins.", fail_outcome: "You faint at the sight of a particularly gruesome wound. A nun helps you to a bench and gives you a glass of water.", stat_deltas: { stamina: -15, stress: 10 }, fail_stat_deltas: { stamina: -10, stress: 15, trauma: 3 }, skill_deltas: { housekeeping: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'talk_harper', label: "Talk to Harper", intent: "social", npc: "harper", hours_passed: 1 },
      { id: 'flirt_harper', label: "Flirt with Harper", intent: "flirt", npc: "harper", hours_passed: 1 },
      { id: 'work_harper', label: "Assist Harper with a patient", intent: "work", npc: "harper", hours_passed: 1 },
      { id: 'threaten_harper', label: "Demand better treatment from Harper", intent: "threaten", npc: "harper", hours_passed: 1 },
      { id: 'gift_harper', label: "Give Harper a gift", intent: "gift", npc: "harper", hours_passed: 1 },
      { id: 'tease_harper', label: "Tease Harper", intent: "tease", npc: "harper", hours_passed: 1 },
      { id: 'comfort_harper', label: "Try to comfort Harper", intent: "comfort", npc: "harper", hours_passed: 1 },
      { id: 'confide_harper', label: "Confide in Harper", intent: "confide", npc: "harper", hours_passed: 1 },
      { id: 'beg_harper', label: "Beg Harper for treatment", intent: "beg", npc: "harper", hours_passed: 1 },
      { id: 'praise_harper', label: "Praise Harper's skill", intent: "praise", npc: "harper", hours_passed: 1 },
      { id: 'kiss_harper', label: "Kiss Harper", intent: "kiss", npc: "harper", hours_passed: 1 },
      { id: 'hold_hands_harper', label: "Hold hands with Harper", intent: "hold_hands", npc: "harper", hours_passed: 1 },
      { id: 'cuddle_harper', label: "Cuddle with Harper", intent: "cuddle", npc: "harper", hours_passed: 1 },
      { id: 'confess_harper', label: "Confess your feelings to Harper", intent: "confess", npc: "harper", hours_passed: 1 },
      { id: 'date_harper', label: "Ask Harper on a date", intent: "date", npc: "harper", hours_passed: 1 },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You leave the hospital and walk back towards the square.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'prison': {
    id: 'prison',
    name: "Riften Jail",
    atmosphere: "dank, oppressive, the clang of iron shackles and muffled screams echoing from Mistveil Keep's dungeons",
    danger: 50,
    x: 65, y: 75,
    npcs: ['landry'],
    description: "The grim stone dungeons beneath Mistveil Keep where criminals rot at the Jarl's pleasure. The guards are corrupt — many in Maven Black-Briar's pocket — and the cells are filthy. The stocks in the courtyard are frequently occupied, and public lashings draw crowds. Those who cannot pay their bounty in septims are put to hard labour in the nearby mine. The warden, Landry, runs the prison with brutal Nordic efficiency.",
    actions: [
      { id: 'serve_sentence', label: "Serve your sentence", intent: "work", outcome: "You break rocks in the quarry under the blazing sun. The guards watch with casual cruelty, striking anyone who slows down.", stat_deltas: { stamina: -30, stress: 20, pain: 10, trauma: 5 }, skill_deltas: { athletics: 2 }, hours_passed: 8 },
      { id: 'plead_release', label: "Plead for release", intent: "social", skill_check: { stat: "willpower", difficulty: 60 }, outcome: "The warden considers your plea. After a long, uncomfortable silence, they wave you towards the gate. 'Don't let me see you again.'", fail_outcome: "The warden laughs in your face. 'You'll leave when I say you leave.' A guard shoves you back to your cell.", stat_deltas: { stress: 10 }, fail_stat_deltas: { stress: 20, trauma: 5, pain: 5 } },
      { id: 'escape_attempt', label: "Try to escape", intent: "stealth", skill_check: { stat: "willpower", difficulty: 75 }, outcome: "Under cover of darkness, you slip through a gap in the drainage grate. Freedom!", fail_outcome: "A guard spots you and sounds the alarm. The beating that follows is severe.", stat_deltas: { stamina: -20, stress: 15 }, fail_stat_deltas: { health: -20, pain: 25, stress: 30, trauma: 10 }, new_location: 'alleyways' },
      { id: 'talk_landry', label: "Talk to Landry", intent: "social", npc: "landry", hours_passed: 1 },
      { id: 'flirt_landry', label: "Flirt with Landry", intent: "flirt", npc: "landry", hours_passed: 1 },
      { id: 'work_landry', label: "Carry out Landry's orders", intent: "work", npc: "landry", hours_passed: 1 },
      { id: 'confront_landry', label: "Confront Landry about the conditions", intent: "threaten", npc: "landry", hours_passed: 1 },
      { id: 'bribe_landry', label: "Offer Landry a bribe", intent: "gift", npc: "landry", hours_passed: 1 },
      { id: 'tease_landry', label: "Tease Landry", intent: "tease", npc: "landry", hours_passed: 1 },
      { id: 'comfort_landry', label: "Try to comfort Landry", intent: "comfort", npc: "landry", hours_passed: 1 },
      { id: 'confide_landry', label: "Confide in Landry", intent: "confide", npc: "landry", hours_passed: 1 },
      { id: 'beg_landry', label: "Beg Landry for release", intent: "beg", npc: "landry", hours_passed: 1 },
      { id: 'praise_landry', label: "Praise Landry", intent: "praise", npc: "landry", hours_passed: 1 },
      { id: 'kiss_landry', label: "Kiss Landry", intent: "kiss", npc: "landry", hours_passed: 1 },
      { id: 'hold_hands_landry', label: "Hold hands with Landry", intent: "hold_hands", npc: "landry", hours_passed: 1 },
      { id: 'cuddle_landry', label: "Cuddle with Landry", intent: "cuddle", npc: "landry", hours_passed: 1 },
      { id: 'confess_landry', label: "Confess your feelings to Landry", intent: "confess", npc: "landry", hours_passed: 1 },
      { id: 'date_landry', label: "Ask Landry on a date", intent: "date", npc: "landry", hours_passed: 1 },
      { id: 'travel_market', label: "Leave (if free)", intent: "travel", outcome: "You walk out through the iron gates, blinking in the daylight.", stat_deltas: { stress: -10, stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'strip_club': {
    id: 'strip_club',
    name: "The Sanguine's Rose",
    atmosphere: "smoky, dim Daedric candlelight, heavy Nord drums and clinking mead horns",
    danger: 40,
    x: 77, y: 78,
    npcs: ['darryl'],
    description: "A dimly lit establishment hidden down a seedy back passage in Riften, secretly dedicated to the Daedric Prince Sanguine. Scantily-clad dancers in Daedric-styled costumes move on a small stage while patrons drink Black-Briar mead and leer from shadowy fur-draped booths. The owner, Darryl — rumoured to be one of Sanguine's mortal agents — watches from behind the bar with tired, knowing eyes. The air is thick with pipe smoke, Dibella's perfume, and desperation. The septims flow freely, but the work takes a heavy toll on the soul.",
    actions: [
      { id: 'dance_stage', label: "Dance on the stage", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You climb onto the stage and dance under the hot lights. The crowd watches, mesmerized. Coins rain down. You feel powerful and degraded in equal measure.", fail_outcome: "You stumble under the lights. The crowd jeers. Darryl waves you off the stage with a disappointed shake of their head.", stat_deltas: { stamina: -20, stress: 15, lust: 10, allure: 3, purity: -8 }, fail_stat_deltas: { stress: 20, trauma: 5 }, skill_deltas: { dancing: 4, seduction: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'bartend', label: "Work as a bartender", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "You mix drinks and keep the glasses full. The patrons are handsy but you manage to keep them at arm's length. The tips are decent.", fail_outcome: "A drunk patron grabs you and won't let go. Darryl has to intervene. You get your pay but you're shaken.", stat_deltas: { stamina: -15, stress: 10 }, fail_stat_deltas: { stress: 20, trauma: 5, lust: 5 }, skill_deltas: { housekeeping: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'private_show', label: "Give a private show", intent: "work", skill_check: { stat: "allure", difficulty: 50 }, outcome: "A wealthy patron pays handsomely for a private dance. The money is good, but you feel hollow inside.", fail_outcome: "The patron is unsatisfied and refuses to pay. You leave the booth feeling used.", stat_deltas: { stamina: -15, lust: 15, purity: -15, stress: 10, trauma: 5 }, fail_stat_deltas: { stress: 25, trauma: 10, purity: -5 }, skill_deltas: { seduction: 5, dancing: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'talk_darryl', label: "Talk to Darryl", intent: "social", npc: "darryl", hours_passed: 1 },
      { id: 'flirt_darryl', label: "Flirt with Darryl", intent: "flirt", npc: "darryl", hours_passed: 1 },
      { id: 'work_darryl', label: "Ask Darryl about more work", intent: "work", npc: "darryl", hours_passed: 1 },
      { id: 'threaten_darryl', label: "Confront Darryl about the establishment", intent: "threaten", npc: "darryl", hours_passed: 1 },
      { id: 'gift_darryl', label: "Give Darryl a gift", intent: "gift", npc: "darryl", hours_passed: 1 },
      { id: 'tease_darryl', label: "Tease Darryl", intent: "tease", npc: "darryl", hours_passed: 1 },
      { id: 'comfort_darryl', label: "Comfort Darryl", intent: "comfort", npc: "darryl", hours_passed: 1 },
      { id: 'confide_darryl', label: "Confide in Darryl", intent: "confide", npc: "darryl", hours_passed: 1 },
      { id: 'beg_darryl', label: "Beg Darryl for work", intent: "beg", npc: "darryl", hours_passed: 1 },
      { id: 'praise_darryl', label: "Praise Darryl", intent: "praise", npc: "darryl", hours_passed: 1 },
      { id: 'kiss_darryl', label: "Kiss Darryl", intent: "kiss", npc: "darryl", hours_passed: 1 },
      { id: 'hold_hands_darryl', label: "Hold hands with Darryl", intent: "hold_hands", npc: "darryl", hours_passed: 1 },
      { id: 'cuddle_darryl', label: "Cuddle with Darryl", intent: "cuddle", npc: "darryl", hours_passed: 1 },
      { id: 'confess_darryl', label: "Confess your feelings to Darryl", intent: "confess", npc: "darryl", hours_passed: 1 },
      { id: 'date_darryl', label: "Ask Darryl on a date", intent: "date", npc: "darryl", hours_passed: 1 },
      { id: 'travel_alleyways', label: "Leave through the back door", intent: "travel", outcome: "You slip out the back entrance into the dark alley.", stat_deltas: { stamina: -3 }, new_location: 'alleyways' }
    ]
  },
  'dance_studio': {
    id: 'dance_studio',
    name: "The Bard's Dance Hall",
    atmosphere: "polished Nordic hardwood floors, wall-length Dwemer mirrors, the scent of rosin and sweat",
    danger: 5,
    x: 72, y: 58,
    npcs: ['charlie'],
    description: "A bright, airy dance hall attached to the Bards College in Solitude, with large arched windows overlooking the harbour and polished hardwood floors. Wall-length Dwemer-glass mirrors reflect the dancers' movements. Charlie, the Breton instructor, is demanding but fair, pushing students to perfection with the precision of a Direnni mage. The scent of rosin and fresh sweat fills the air. Dance lessons cost septims but provide excellent training and stress relief.",
    actions: [
      { id: 'take_lesson', label: "Take a dance lesson", intent: "education", skill_check: { stat: "stamina", difficulty: 35 }, outcome: "Charlie puts you through an intense practice session. Your muscles burn, but your movements are becoming more graceful and controlled.", fail_outcome: "You can't keep up with Charlie's pace and collapse in a heap. They sigh and send you to stretch on the side.", stat_deltas: { stamina: -20, stress: -10, allure: 2 }, fail_stat_deltas: { stamina: -15, stress: 5, pain: 5 }, skill_deltas: { dancing: 5, athletics: 2 }, fail_skill_deltas: { dancing: 1 }, hours_passed: 2 },
      { id: 'practice_alone', label: "Practice alone", intent: "neutral", outcome: "You practice basic moves in front of the mirror. Slowly, you're getting better.", stat_deltas: { stamina: -15, stress: -5 }, skill_deltas: { dancing: 2, athletics: 1 }, hours_passed: 1 },
      { id: 'watch_performance', label: "Watch an advanced performance", intent: "neutral", outcome: "You sit and watch the advanced dancers rehearse. Their grace is mesmerizing and inspiring.", stat_deltas: { stress: -10, willpower: 3 }, hours_passed: 1 },
      { id: 'talk_charlie', label: "Talk to Charlie", intent: "social", npc: "charlie", hours_passed: 1 },
      { id: 'flirt_charlie', label: "Flirt with Charlie", intent: "flirt", npc: "charlie", hours_passed: 1 },
      { id: 'work_charlie', label: "Assist Charlie with a class", intent: "work", npc: "charlie", hours_passed: 1 },
      { id: 'threaten_charlie', label: "Challenge Charlie's teaching methods", intent: "threaten", npc: "charlie", hours_passed: 1 },
      { id: 'gift_charlie', label: "Give Charlie a gift", intent: "gift", npc: "charlie", hours_passed: 1 },
      { id: 'tease_charlie', label: "Tease Charlie", intent: "tease", npc: "charlie", hours_passed: 1 },
      { id: 'comfort_charlie', label: "Comfort Charlie", intent: "comfort", npc: "charlie", hours_passed: 1 },
      { id: 'confide_charlie', label: "Confide in Charlie", intent: "confide", npc: "charlie", hours_passed: 1 },
      { id: 'beg_charlie', label: "Beg Charlie for extra lessons", intent: "beg", npc: "charlie", hours_passed: 1 },
      { id: 'praise_charlie', label: "Praise Charlie's teaching", intent: "praise", npc: "charlie", hours_passed: 1 },
      { id: 'kiss_charlie', label: "Kiss Charlie", intent: "kiss", npc: "charlie", hours_passed: 1 },
      { id: 'hold_hands_charlie', label: "Hold hands with Charlie", intent: "hold_hands", npc: "charlie", hours_passed: 1 },
      { id: 'cuddle_charlie', label: "Cuddle with Charlie", intent: "cuddle", npc: "charlie", hours_passed: 1 },
      { id: 'confess_charlie', label: "Confess your feelings to Charlie", intent: "confess", npc: "charlie", hours_passed: 1 },
      { id: 'date_charlie', label: "Ask Charlie on a date", intent: "date", npc: "charlie", hours_passed: 1 },
      { id: 'travel_market', label: "Walk to the Town Square", intent: "travel", outcome: "You leave the studio feeling lighter on your feet.", stat_deltas: { stamina: -5 }, new_location: 'town_square' }
    ]
  },
  'arcade': {
    id: 'arcade',
    name: "The Ragged Flagon Cistern",
    atmosphere: "flickering torchlight, the click of dice and shouts of Thieves Guild gamblers",
    danger: 25,
    x: 75, y: 68,
    npcs: ['wren'],
    description: "A smoky, underground gambling den carved from the ancient Ratway cisterns beneath Riften, accessed through a nondescript door in the marketplace district. Inside, tables are crowded with card players, dice throwers, and septim-hungry fortune seekers. Wren runs the high-stakes table in the back, their sharp Bosmer eyes missing nothing. The house always wins, but the desperate keep coming back, hoping the Nine Divines will smile on them.",
    actions: [
      { id: 'play_cards', label: "Play blackjack", intent: "social", skill_check: { stat: "willpower", difficulty: 45 }, outcome: "Lady luck smiles on you! You walk away from the table with more coin than you sat down with. Wren watches you with new interest.", fail_outcome: "You lose your stake. Wren smirks as the dealer sweeps your coins away. 'Better luck next time, kid.'", stat_deltas: { stress: 15 }, fail_stat_deltas: { stress: 20, trauma: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'play_dice', label: "Roll dice", intent: "social", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "The dice tumble and land in your favour. You snatch up your winnings with a grin.", fail_outcome: "Snake eyes. You curse under your breath as you lose your coin.", stat_deltas: { stress: 10 }, fail_stat_deltas: { stress: 15 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'watch_games', label: "Watch and learn", intent: "neutral", outcome: "You lean against the wall and study the players, watching for tells and strategies.", stat_deltas: { stress: -5, willpower: 3 }, skill_deltas: { skulduggery: 2 }, hours_passed: 1 },
      { id: 'talk_wren', label: "Talk to Wren", intent: "social", npc: "wren", hours_passed: 1 },
      { id: 'flirt_wren', label: "Flirt with Wren", intent: "flirt", npc: "wren", hours_passed: 1 },
      { id: 'work_wren', label: "Run a job for Wren", intent: "work", npc: "wren", hours_passed: 1 },
      { id: 'confront_wren', label: "Confront Wren about rigged games", intent: "threaten", npc: "wren", hours_passed: 1 },
      { id: 'gift_wren', label: "Give Wren a gift", intent: "gift", npc: "wren", hours_passed: 1 },
      { id: 'tease_wren', label: "Tease Wren", intent: "tease", npc: "wren", hours_passed: 1 },
      { id: 'comfort_wren', label: "Comfort Wren", intent: "comfort", npc: "wren", hours_passed: 1 },
      { id: 'confide_wren', label: "Confide in Wren", intent: "confide", npc: "wren", hours_passed: 1 },
      { id: 'beg_wren', label: "Beg Wren for a stake", intent: "beg", npc: "wren", hours_passed: 1 },
      { id: 'praise_wren', label: "Praise Wren's skill", intent: "praise", npc: "wren", hours_passed: 1 },
      { id: 'kiss_wren', label: "Kiss Wren", intent: "kiss", npc: "wren", hours_passed: 1 },
      { id: 'hold_hands_wren', label: "Hold hands with Wren", intent: "hold_hands", npc: "wren", hours_passed: 1 },
      { id: 'cuddle_wren', label: "Cuddle with Wren", intent: "cuddle", npc: "wren", hours_passed: 1 },
      { id: 'confess_wren', label: "Confess your feelings to Wren", intent: "confess", npc: "wren", hours_passed: 1 },
      { id: 'date_wren', label: "Ask Wren on a date", intent: "date", npc: "wren", hours_passed: 1 },
      { id: 'travel_market', label: "Leave the arcade", intent: "travel", outcome: "You climb the stairs back into the daylight of the market.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'shopping_centre': {
    id: 'shopping_centre',
    name: "The Solitude Market District",
    atmosphere: "bustling, bright, the rustle of Imperial silks and clink of septims",
    danger: 10,
    x: 80, y: 62,
    npcs: [],
    description: "The main commercial avenue of Solitude, where the finest shops and boutiques line a wide, clean street beneath the towering Blue Palace. Radiant Raiment clothing store, Bits and Pieces general goods, and a jeweller from Hammerfell all compete for custom. The wealthier citizens of Tamriel shop here, dressed in fine Imperial silks and noble furs. Orphans and beggars are watched suspiciously by the Solitude guard and the merchants' hired muscle.",
    actions: [
      { id: 'browse_clothes', label: "Browse the clothing shops", intent: "social", outcome: "You wander the racks of fine clothes, touching fabrics you could never afford. The shopkeeper watches you like a hawk, ready to pounce if you linger too long.", stat_deltas: { stress: 5 }, hours_passed: 1 },
      { id: 'shoplift', label: "Try to shoplift", intent: "stealth", skill_check: { stat: "willpower", difficulty: 55 }, outcome: "Your nimble fingers slip a fine scarf into your tunic. No one notices. Your heart pounds as you walk calmly towards the exit.", fail_outcome: "The shopkeeper grabs your wrist! 'THIEF!' they shout. Guards descend on you within seconds.", stat_deltas: { stress: 20 }, fail_stat_deltas: { stress: 30, trauma: 5, pain: 10 }, skill_deltas: { skulduggery: 3 }, new_items: [{ name: "Fine Silk Scarf", type: "clothing", slot: "neck", rarity: "uncommon", description: "A beautiful silk scarf in deep crimson. Wearing it makes you look more refined.", integrity: 100, max_integrity: 100 }] },
      { id: 'buy_clothing', label: "Buy new clothes", intent: "social", outcome: "You spend some of your hard-earned coin on a simple but clean set of clothes. They're nothing fancy, but they don't mark you as a beggar.", stat_deltas: { allure: 3, stress: -5 } },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You walk back towards the market.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'moor': {
    id: 'moor',
    name: "The Reach Highlands",
    atmosphere: "windswept, desolate, the cry of hawks and rustle of juniper over ancient Dwemer stonework",
    danger: 55,
    x: 98, y: 45,
    npcs: [],
    description: "A vast, windswept expanse of heather, juniper scrub, and ancient Dwemer ruins beyond the Rift forests, stretching into the Reach. The ruins of a Forsworn redoubt — the Hawk's Nest — can be seen on a distant crag, home to a great and terrible bird of prey and hostile Reachmen. The wind howls constantly across the barren terrain, and the ground is treacherous with hidden sinkholes and Dwemer vents. Few venture here willingly — the Forsworn consider this their territory.",
    actions: [
      { id: 'explore_ruins', label: "Explore the Hawk's Tower ruins", intent: "work", skill_check: { stat: "stamina", difficulty: 60 }, outcome: "You climb the crumbling stairs of the old tower. At the top, you find the enormous nest of the Great Hawk. Scattered among the sticks and feathers are glinting trinkets stolen from travellers.", fail_outcome: "A screech splits the air! The Great Hawk swoops down, its talons raking your back as you flee down the stairs.", stat_deltas: { stamina: -25, stress: 20 }, fail_stat_deltas: { health: -15, pain: 20, stress: 30, trauma: 10 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'gather_heather', label: "Gather heather and bog herbs", intent: "work", outcome: "You pick wild heather and find useful medicinal plants growing between the stones.", stat_deltas: { stamina: -15 }, skill_deltas: { foraging: 3, tending: 2 }, new_items: [{ name: "Wild Heather Bundle", type: "consumable", rarity: "common", description: "Fragrant purple heather. Can be dried for medicinal tea." }], hours_passed: 2 },
      { id: 'forage_heather', label: "Harvest heather bundles", intent: "work", outcome: "The moor is carpeted in heather. You cut and bundle a good supply — useful for tea and tinder.", stat_deltas: { stamina: -12 }, skill_deltas: { foraging: 2 }, new_items: [{ id: 'heather', name: "Heather Bundle", type: "consumable", rarity: "common", description: "Fragrant purple heather.", value: 3, weight: 0.15, stats: { stress: -5, pain: -3 } }], hours_passed: 1 },
      { id: 'dig_bog_iron', label: "Dig for bog iron", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You dig into the peat bogs and pry loose dark, heavy chunks of bog iron ore. Heavy work, but the ore is valuable.", fail_outcome: "The bog is too waterlogged here. Every hole you dig fills with black water instantly.", stat_deltas: { stamina: -25, pain: 5 }, fail_stat_deltas: { stamina: -20, pain: 3 }, skill_deltas: { athletics: 2 }, new_items: [{ id: 'bog_iron', name: "Bog Iron", type: "misc", rarity: "uncommon", description: "Dark iron ore from the peat bogs.", value: 12, weight: 1.5 }], hours_passed: 2 },
      { id: 'forage_rare_fungi_moor', label: "Search for rare moor fungi", intent: "work", skill_check: { stat: "willpower", difficulty: 55 }, outcome: "In a sheltered hollow you find a cluster of bioluminescent fungi unlike anything you have seen before. They pulse faintly, arcane energy contained in their caps.", fail_outcome: "You search the moor for hours in the biting wind. Nothing unusual grows here today.", stat_deltas: { stamina: -20, stress: 15 }, fail_stat_deltas: { stamina: -25, stress: 20, pain: 3 }, skill_deltas: { foraging: 4 }, new_items: [{ id: 'rare_fungi', name: "Rare Fungi", type: "consumable", rarity: "rare", description: "Bioluminescent fungi pulsing with arcane energy.", value: 20, weight: 0.2, stats: { health: -3, lust: 8, corruption: 3 } }], hours_passed: 3 },
      { id: 'travel_forest', label: "Return to the Forest", intent: "travel", outcome: "You trudge back across the boggy moorland towards the treeline.", stat_deltas: { stamina: -15 }, new_location: 'forest' }
    ]
  },
  'wolf_cave': {
    id: 'wolf_cave',
    name: "Bloated Man's Grotto",
    atmosphere: "dark, musky, the low growling of Skyrim wolves and smell of raw elk meat",
    danger: 75,
    x: 93, y: 48,
    npcs: [],
    description: "A deep natural cave in the Rift forests, sacred to Hircine and home to a pack of unnaturally intelligent wolves led by a massive Black Wolf whose golden eyes gleam with Daedric intelligence. The entrance is littered with gnawed elk bones, and the air inside is thick with the musky scent of apex predators. Deeper in, the cave opens into a large chamber where Hircine's blessing pools in silvery moonlight. The Black Wolf watches all who enter with unsettling awareness — some say it is a werewolf, forever trapped between forms.",
    actions: [
      { id: 'approach_alpha', label: "Approach the Black Wolf", intent: "social", skill_check: { stat: "willpower", difficulty: 70 }, outcome: "The Black Wolf regards you with intelligent golden eyes. It sniffs you carefully, then lowers its massive head, allowing you to pass unmolested. You have earned a measure of respect.", fail_outcome: "The Black Wolf snarls, baring enormous fangs. The pack closes in around you. You barely escape with your life.", stat_deltas: { stress: 25, willpower: 5 }, fail_stat_deltas: { health: -20, pain: 25, stress: 35, trauma: 15 }, hours_passed: 1 },
      { id: 'sleep_cave', label: "Sleep among the wolves", intent: "neutral", outcome: "You curl up against the warm flank of a sleeping wolf. Its fur is coarse but warm. You sleep surprisingly well, surrounded by the quiet breathing of the pack.", stat_deltas: { stamina: 30, stress: -10, pain: -5 }, hours_passed: 8 },
      { id: 'hunt_with_pack', label: "Join the pack's hunt", intent: "work", skill_check: { stat: "stamina", difficulty: 55 }, outcome: "You run with the wolves through the moonlit forest. Together you bring down a deer. The thrill of the hunt is primal and exhilarating.", fail_outcome: "You can't keep up with the pack. They disappear into the darkness, leaving you alone and lost.", stat_deltas: { stamina: -25, stress: -15 }, fail_stat_deltas: { stamina: -30, stress: 20 }, skill_deltas: { athletics: 4 }, hours_passed: 4 },
      { id: 'travel_forest', label: "Leave the cave", intent: "travel", outcome: "You slip out of the cave mouth into the forest.", stat_deltas: { stamina: -5 }, new_location: 'forest' }
    ]
  },
  'eden_cabin': {
    id: 'eden_cabin',
    name: "Hunter's Lodge",
    atmosphere: "wood smoke, pine needles, wolf pelts, and the isolation of the Skyrim wilderness",
    danger: 30,
    x: 96, y: 52,
    npcs: ['eden'],
    description: "A sturdy Nordic log cabin deep in the Rift forests, far from any hold road or Imperial patrol. Smoke curls from the stone chimney, and animal pelts — wolf, bear, sabre cat — hang on a drying rack outside. Inside, the cabin is spartan but well-maintained in the Nord tradition: a large fur-draped bed, a stone fireplace, a rough-hewn pine table, and shelves stacked with preserved venison and Skyrim hunting supplies. Eden lives here alone, self-sufficient and distrustful of the holds and their politics.",
    actions: [
      { id: 'talk_eden', label: "Talk to Eden", intent: "social", npc: "eden", hours_passed: 1 },
      { id: 'flirt_eden', label: "Flirt with Eden", intent: "flirt", npc: "eden", hours_passed: 1 },
      { id: 'work_eden', label: "Work alongside Eden", intent: "work", npc: "eden", hours_passed: 1 },
      { id: 'threaten_eden', label: "Provoke Eden", intent: "threaten", npc: "eden", hours_passed: 1 },
      { id: 'gift_eden', label: "Give Eden a gift", intent: "gift", npc: "eden", hours_passed: 1 },
      { id: 'tease_eden', label: "Tease Eden", intent: "tease", npc: "eden", hours_passed: 1 },
      { id: 'comfort_eden', label: "Comfort Eden", intent: "comfort", npc: "eden", hours_passed: 1 },
      { id: 'confide_eden', label: "Confide in Eden", intent: "confide", npc: "eden", hours_passed: 1 },
      { id: 'beg_eden', label: "Beg Eden for supplies", intent: "beg", npc: "eden", hours_passed: 1 },
      { id: 'praise_eden', label: "Praise Eden's skills", intent: "praise", npc: "eden", hours_passed: 1 },
      { id: 'kiss_eden', label: "Kiss Eden", intent: "kiss", npc: "eden", hours_passed: 1 },
      { id: 'hold_hands_eden', label: "Hold hands with Eden", intent: "hold_hands", npc: "eden", hours_passed: 1 },
      { id: 'cuddle_eden', label: "Cuddle with Eden", intent: "cuddle", npc: "eden", hours_passed: 1 },
      { id: 'confess_eden', label: "Confess your feelings to Eden", intent: "confess", npc: "eden", hours_passed: 1 },
      { id: 'date_eden', label: "Ask Eden on a date", intent: "date", npc: "eden", hours_passed: 1 },
      { id: 'help_chores', label: "Help with cabin chores", intent: "work", outcome: "You chop firewood, haul water from the stream, and mend a gap in the cabin wall. Eden nods approvingly at your work.", stat_deltas: { stamina: -20, stress: -10 }, skill_deltas: { housekeeping: 3, athletics: 2 }, hours_passed: 3 },
      { id: 'cook_eden', label: "Cook a meal together", intent: "work", outcome: "Eden shows you how to prepare venison stew with wild herbs. The smell is incredible. You eat together in companionable silence.", stat_deltas: { stamina: 15, stress: -15, pain: -5 }, skill_deltas: { cooking: 4 }, hours_passed: 2 },
      { id: 'sleep_cabin', label: "Sleep in the cabin", intent: "neutral", outcome: "You sleep in the warm cabin, the fire crackling gently. The thick log walls keep out the cold and the dangers of the forest.", stat_deltas: { stamina: 45, stress: -20, pain: -10 }, hours_passed: 8 },
      { id: 'hunt_eden', label: "Go hunting with Eden", intent: "work", skill_check: { stat: "stamina", difficulty: 45 }, outcome: "Eden leads you deep into the forest. You learn to track, set snares, and move silently through the undergrowth. You return with a brace of rabbits.", fail_outcome: "You make too much noise and scare off the game. Eden glares at you but says nothing.", stat_deltas: { stamina: -25, stress: -5 }, fail_stat_deltas: { stamina: -20, stress: 10 }, skill_deltas: { athletics: 3, foraging: 2, skulduggery: 1 }, hours_passed: 4 },
      { id: 'travel_forest', label: "Leave the cabin", intent: "travel", outcome: "You step out into the forest, the cabin disappearing behind the dense trees.", stat_deltas: { stamina: -5 }, new_location: 'forest' }
    ]
  },
  'ocean': {
    id: 'ocean',
    name: "The Sea of Ghosts",
    atmosphere: "vast, salt-stung, the endless crash of icy waves against the northern coast",
    danger: 65,
    x: 100, y: 50,
    npcs: [],
    description: "Beyond the docks and the northern coastline lies the Sea of Ghosts — Tamriel's vast, cold, and unforgiving northern ocean. Small fishing boats bob in the grey swells, and on clear days you can see the distant ice of Atmora's ruins. The water teems with horkers and slaughterfish, but also with danger: sudden Nord storms, treacherous currents, and Dwemer automatons in the deep wrecks that no fisherman dares explore.",
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
    name: "The Ratway",
    atmosphere: "pitch black, echoing drips, the stench of skeever droppings and ancient Nord stonework",
    danger: 70,
    x: 80, y: 80,
    npcs: [],
    description: "The vast network of ancient tunnels beneath Riften, originally constructed during the First Era. The Ratway is now home to skeevers, Thieves Guild outcasts, and worse. The air is thick with dampness and the stench of decay. Dim bioluminescent fungi — the only light source — cast an eerie blue-green glow on the dripping walls. Thieves Guild members use the tunnels as highways, and in the deepest passages, things best left undisturbed lurk in the Ratway Warrens.",
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
    name: "Calcelmo's Museum",
    atmosphere: "hushed, scholarly, the scent of ancient Dwemer oil and polished Falmer tomes",
    danger: 5,
    x: 73, y: 55,
    npcs: ['winter'],
    description: "A grand stone wing of Understone Keep in Markarth, housing a vast collection of Dwemer antiquities and Reach curiosities. Display cases contain Dwemer gears, Falmer artifacts, and relics from the Merethic Era. The curator, Winter, is always looking for new exhibits and pays handsomely in septims for genuine Dwemer antiques. The museum is quiet and scholarly, a haven from the blood and stone of Markarth's streets.",
    actions: [
      { id: 'browse_exhibits', label: "Browse the exhibits", intent: "education", outcome: "You wander through the hushed halls, studying the ancient artifacts. A display of pre-imperial weaponry catches your eye, and you spend an engrossing hour reading the plaques.", stat_deltas: { willpower: 5, stress: -10 }, skill_deltas: { lore_mastery: 2 }, hours_passed: 1 },
      { id: 'sell_antique', label: "Offer an antique to Winter", intent: "social", outcome: "Winter examines your offering with a magnifying glass, their eyes widening with scholarly excitement. 'A genuine piece! I'll give you a fair price.'", stat_deltas: { stress: -5 } },
      { id: 'volunteer_museum', label: "Volunteer as a guide", intent: "work", outcome: "You spend the afternoon giving tours to visitors. Winter teaches you about the exhibits between groups. It's surprisingly enjoyable.", stat_deltas: { stamina: -10, stress: -10, willpower: 5 }, skill_deltas: { lore_mastery: 3, housekeeping: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'talk_winter', label: "Talk to Winter", intent: "social", npc: "winter", hours_passed: 1 },
      { id: 'flirt_winter', label: "Flirt with Winter", intent: "flirt", npc: "winter", hours_passed: 1 },
      { id: 'work_winter', label: "Help Winter with research", intent: "work", npc: "winter", hours_passed: 1 },
      { id: 'threaten_winter', label: "Pressure Winter about an exhibit", intent: "threaten", npc: "winter", hours_passed: 1 },
      { id: 'gift_winter', label: "Give Winter a gift", intent: "gift", npc: "winter", hours_passed: 1 },
      { id: 'tease_winter', label: "Tease Winter", intent: "tease", npc: "winter", hours_passed: 1 },
      { id: 'comfort_winter', label: "Comfort Winter", intent: "comfort", npc: "winter", hours_passed: 1 },
      { id: 'confide_winter', label: "Confide in Winter", intent: "confide", npc: "winter", hours_passed: 1 },
      { id: 'beg_winter', label: "Beg Winter for help", intent: "beg", npc: "winter", hours_passed: 1 },
      { id: 'praise_winter', label: "Praise Winter's expertise", intent: "praise", npc: "winter", hours_passed: 1 },
      { id: 'kiss_winter', label: "Kiss Winter", intent: "kiss", npc: "winter", hours_passed: 1 },
      { id: 'hold_hands_winter', label: "Hold hands with Winter", intent: "hold_hands", npc: "winter", hours_passed: 1 },
      { id: 'cuddle_winter', label: "Cuddle with Winter", intent: "cuddle", npc: "winter", hours_passed: 1 },
      { id: 'confess_winter', label: "Confess your feelings to Winter", intent: "confess", npc: "winter", hours_passed: 1 },
      { id: 'date_winter', label: "Ask Winter on a date", intent: "date", npc: "winter", hours_passed: 1 },
      { id: 'travel_market', label: "Return to the Town Square", intent: "travel", outcome: "You step out of the quiet museum into the bustle of the streets.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'cafe': {
    id: 'cafe',
    name: "The Bee and Barb",
    atmosphere: "warm, fragrant with roasting juniper tea, fresh sweetrolls, and bubbling mead",
    danger: 5,
    x: 76, y: 63,
    npcs: ['sam'],
    description: "A cosy tavern and inn at the heart of Riften, run by the Argonian couple Keerava and Talen-Jei. Mismatched Nordic furniture fills the warm space, and the air is rich with the scent of roasting game and fresh-baked sweetrolls. Sam, the cheerful Breton barkeep, greets every customer with a warm smile and a tale. It's one of the few places in all the Rift where you feel genuinely welcome — as long as you can pay your tab.",
    actions: [
      { id: 'buy_meal', label: "Buy a hot meal", intent: "social", outcome: "Sam places a steaming bowl of stew and a thick slice of bread in front of you. It's simple but delicious. For a few precious minutes, you feel warm and full.", stat_deltas: { stamina: 20, stress: -15, pain: -5 }, hours_passed: 1 },
      { id: 'work_cafe', label: "Work as a server", intent: "work", skill_check: { stat: "stamina", difficulty: 30 }, outcome: "You spend the afternoon taking orders and clearing tables. Sam pays you fairly and lets you eat the leftover pastries.", fail_outcome: "You drop a tray of cups. Sam winces but tells you not to worry. You help clean up but don't get paid.", stat_deltas: { stamina: -15, stress: -5 }, fail_stat_deltas: { stress: 10, stamina: -10 }, skill_deltas: { housekeeping: 2, cooking: 1 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'study_cafe', label: "Study in the corner booth", intent: "education", outcome: "You tuck yourself into a quiet corner with a battered textbook. The warm atmosphere and background chatter help you focus.", stat_deltas: { stress: -5, willpower: 3 }, skill_deltas: { lore_mastery: 3 }, hours_passed: 2 },
      { id: 'talk_sam', label: "Talk to Sam", intent: "social", npc: "sam", hours_passed: 1 },
      { id: 'flirt_sam', label: "Flirt with Sam", intent: "flirt", npc: "sam", hours_passed: 1 },
      { id: 'work_sam', label: "Help Sam behind the bar", intent: "work", npc: "sam", hours_passed: 1 },
      { id: 'threaten_sam', label: "Complain loudly to Sam", intent: "threaten", npc: "sam", hours_passed: 1 },
      { id: 'gift_sam', label: "Give Sam a gift", intent: "gift", npc: "sam", hours_passed: 1 },
      { id: 'tease_sam', label: "Tease Sam", intent: "tease", npc: "sam", hours_passed: 1 },
      { id: 'comfort_sam', label: "Comfort Sam", intent: "comfort", npc: "sam", hours_passed: 1 },
      { id: 'confide_sam', label: "Confide in Sam", intent: "confide", npc: "sam", hours_passed: 1 },
      { id: 'beg_sam', label: "Beg Sam for a meal", intent: "beg", npc: "sam", hours_passed: 1 },
      { id: 'praise_sam', label: "Praise Sam's café", intent: "praise", npc: "sam", hours_passed: 1 },
      { id: 'kiss_sam', label: "Kiss Sam", intent: "kiss", npc: "sam", hours_passed: 1 },
      { id: 'hold_hands_sam', label: "Hold hands with Sam", intent: "hold_hands", npc: "sam", hours_passed: 1 },
      { id: 'cuddle_sam', label: "Cuddle with Sam", intent: "cuddle", npc: "sam", hours_passed: 1 },
      { id: 'confess_sam', label: "Confess your feelings to Sam", intent: "confess", npc: "sam", hours_passed: 1 },
      { id: 'date_sam', label: "Ask Sam on a date", intent: "date", npc: "sam", hours_passed: 1 },
      { id: 'travel_market', label: "Step outside", intent: "travel", outcome: "You reluctantly leave the warmth of the café.", stat_deltas: { stamina: -3 }, new_location: 'town_square' },
      { id: 'travel_shopping', label: "Walk to the Shopping Centre", intent: "travel", outcome: "You stroll down the clean streets towards the shops.", stat_deltas: { stamina: -3 }, new_location: 'shopping_centre' }
    ]
  },
  'tavern': {
    id: 'tavern',
    name: "The Bannered Mare",
    atmosphere: "loud, smoky, ale-stained oak, a bard singing Ragnar the Red off-key",
    danger: 25,
    x: 74, y: 65,
    npcs: [],
    description: "The main tavern in Whiterun's Plains District, always packed with Companions, off-duty guards, and travelling merchants. The great central hearth roars with fire, and the air is thick with woodsmoke, spilled mead, and roasting venison. Hulda, the ancient Nord innkeep, keeps order with a sharp tongue and a hidden dagger. It's warm, rowdy, and surprisingly safe — as long as you don't start trouble.",
    actions: [
      { id: 'order_drink', label: "Order a mead", intent: "social", outcome: "Hulda slides a foaming tankard of Honningbrew across the bar. The mead is strong, sweet, and warm. It dulls the edges of your pain and worry.", stat_deltas: { stamina: 10, stress: -15, willpower: -3 }, hours_passed: 1 },
      { id: 'play_cards', label: "Join a card game", intent: "social", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "You sit down at a table of off-duty guards and win a few rounds.", fail_outcome: "The guards clean you out. One laughs and offers to buy you a consolation drink.", stat_deltas: { stress: 10 }, fail_stat_deltas: { stress: 15 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'listen_rumors', label: "Listen to rumours", intent: "social", outcome: "You nurse your drink and eavesdrop. Dragon sightings, Stormcloak movements, and darker whispers about disappearances near the old barrow.", stat_deltas: { willpower: 3, stress: -5 }, hours_passed: 1 },
      { id: 'work_barmaid', label: "Work as a server", intent: "work", skill_check: { stat: "stamina", difficulty: 35 }, outcome: "You spend the evening hauling trays. Hulda pays fairly and lets you eat leftover venison stew.", fail_outcome: "A drunk Nord grabs you as you pass. You spill mead all over a Companion. The evening goes downhill.", stat_deltas: { stamina: -15, stress: 5 }, fail_stat_deltas: { stress: 20, pain: 5, trauma: 3 }, skill_deltas: { housekeeping: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 4 },
      { id: 'cook_tavern', label: "Help cook in the kitchen", intent: "work", skill_check: { stat: "willpower", difficulty: 30 }, outcome: "The tavern cook lets you help prepare the evening meal. You learn by doing — stirring pots, chopping root vegetables, seasoning broth. Hulda is pleased.", fail_outcome: "You oversalt the stew. The cook glares at you and sends you to wash dishes instead.", stat_deltas: { stamina: -15, stress: -5 }, fail_stat_deltas: { stamina: -10, stress: 10 }, skill_deltas: { cooking: 4, housekeeping: 2 }, hours_passed: 3 },
      { id: 'buy_business_license_tavern', label: "Enquire about purchasing a tavern licence (300 gold)", intent: "social", outcome: "You speak with Hulda's business partner about the possibility of acquiring an official tavern licence. The paperwork is complex, the coin is steep — but the opportunity is real.", fail_outcome: "They don't take you seriously enough to discuss business. Build more reputation first.", stat_deltas: { stress: 5 }, fail_stat_deltas: { stress: 10 }, hours_passed: 1 },
      { id: 'hire_staff_tavern', label: "Post a hiring notice (cost: 10 gold)", intent: "social", outcome: "You pin a hiring notice to the board near the door. By next morning, two promising applicants are waiting. Having good staff will keep the regulars coming back.", fail_outcome: "You don't have enough coin to run a proper hiring notice today.", stat_deltas: { stress: -5 }, fail_stat_deltas: { stress: 5 }, hours_passed: 1 },
      { id: 'set_menu_prices', label: "Review and adjust the menu pricing", intent: "neutral", outcome: "You study what the competition charges and what regulars are willing to pay. A careful adjustment of prices should improve margins without driving patrons away.", stat_deltas: { stress: -3, willpower: 2 }, skill_deltas: { housekeeping: 1 }, hours_passed: 1 },
      { id: 'collect_earnings_tavern', label: "Count and collect the day's takings", intent: "neutral", outcome: "You tally up the day's receipts with careful fingers. It is modest but honest income — and it is growing.", stat_deltas: { stress: -5, willpower: 3 }, hours_passed: 1 },
      { id: 'rent_room', label: "Rent a room for the night", intent: "neutral", outcome: "You pay Hulda for a small room upstairs. The bed is lumpy but warm, and the door has a sturdy lock.", stat_deltas: { stamina: 40, stress: -20, pain: -5 }, hours_passed: 8 },
      { id: 'travel_market', label: "Step outside to the Market", intent: "travel", outcome: "You push open the heavy oak doors and step into the cold Whiterun air.", stat_deltas: { stamina: -3 }, new_location: 'town_square' },
      { id: 'travel_docks', label: "Head to the Docks", intent: "travel", outcome: "You weave through the streets towards the waterfront.", stat_deltas: { stamina: -5 }, new_location: 'docks' }
    ]
  },
  'ruins': {
    id: 'ruins',
    name: "Bleak Falls Barrow",
    atmosphere: "ancient, frigid, the whisper of Draugr and creak of ancient Nordic stone traps",
    danger: 55,
    x: 88, y: 40,
    npcs: [],
    description: "A sprawling Nordic ruin on the mountainside above Riverwood, built in the Merethic Era to house the honoured dead but now infested with Draugr, bandits, and giant frostbite spiders. Crumbling stone walls are overgrown with frost-resistant ivy, and the Dragon Claw door deeper inside hides untold secrets. Wind whistles through the broken archways, carrying whispers in the Dragon Language that make your blood run cold.",
    actions: [
      { id: 'explore_ruins', label: "Explore the outer halls", intent: "stealth", skill_check: { stat: "willpower", difficulty: 50 }, outcome: "You creep through crumbling corridors, avoiding pressure plates and traps. In a forgotten alcove, you find an ancient Nord chest.", fail_outcome: "A Draugr awakens from its burial slab with glowing blue eyes! You barely escape with your life.", stat_deltas: { stamina: -20, stress: 20 }, fail_stat_deltas: { health: -15, pain: 20, stress: 30, trauma: 10 }, skill_deltas: { skulduggery: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 3 },
      { id: 'decipher_walls', label: "Study the Word Wall inscriptions", intent: "education", skill_check: { stat: "willpower", difficulty: 45 }, outcome: "You trace your fingers over Dragon Language glyphs. A strange resonance fills your mind — ancient knowledge seeps into you.", fail_outcome: "The inscriptions swim before your eyes. You leave with a pounding headache.", stat_deltas: { willpower: 8, stress: 10 }, fail_stat_deltas: { stress: 15, pain: 5 }, skill_deltas: { lore_mastery: 4 }, hours_passed: 2 },
      { id: 'camp_ruins', label: "Camp in the sheltered entrance", intent: "neutral", outcome: "You build a small fire in the barrow entrance. The ancient stones hold warmth well, and nothing disturbs your rest — tonight.", stat_deltas: { stamina: 25, stress: -5 }, hours_passed: 6 },
      { id: 'search_artifacts', label: "Search for Dwemer artifacts", intent: "work", skill_check: { stat: "willpower", difficulty: 55 }, outcome: "Beneath a collapsed wall, you find a small Dwemer gear mechanism, perfectly preserved.", fail_outcome: "You dig through rubble for hours but find nothing but dust.", stat_deltas: { stamina: -20, stress: 10 }, fail_stat_deltas: { stamina: -25, stress: 15 }, new_items: [{ name: "Dwemer Gear", type: "misc", rarity: "rare", description: "A perfectly machined golden gear of Dwemer make. Valuable to the right collector." }], hours_passed: 3 },
      { id: 'travel_forest', label: "Descend to the Forest", intent: "travel", outcome: "You pick your way down the rocky path back to the treeline.", stat_deltas: { stamina: -10 }, new_location: 'forest' },
      { id: 'travel_moor', label: "Cross the ridge to the Reach", intent: "travel", outcome: "You follow the mountain ridge westward towards the barren Reach.", stat_deltas: { stamina: -15, stress: 5 }, new_location: 'moor' }
    ]
  },
  'bathhouse': {
    id: 'bathhouse',
    name: "The Steamcrag Bathhouse",
    atmosphere: "steamy, warm, the scent of juniper oil, lavender, and mineral-rich hot springs",
    danger: 10,
    x: 78, y: 58,
    npcs: [],
    description: "A public bathhouse built over a natural hot spring in Eastmarch. The Nords have bathed here since the Second Era. Steam rises from the mineral-rich pools, filling vaulted stone chambers with soothing mist. The marble-tiled floors are slippery but warm, and small private alcoves offer seclusion. Citizens come to soak, gossip, and wash away the grime of Skyrim's harsh climate.",
    actions: [
      { id: 'bathe', label: "Soak in the hot springs", intent: "neutral", outcome: "You lower yourself into the steaming mineral water. The heat seeps into your aching muscles, dissolving tension and pain.", stat_deltas: { stamina: 15, stress: -20, pain: -10, hygiene: 20 }, hours_passed: 1 },
      { id: 'groom', label: "Groom yourself properly", intent: "neutral", outcome: "You wash, comb, and groom yourself properly. You look more presentable than you have in weeks.", stat_deltas: { allure: 3, stress: -10, hygiene: 25 }, hours_passed: 1 },
      { id: 'socialize', label: "Socialize in the steam rooms", intent: "social", outcome: "A travelling merchant shares tales of distant Hammerfell. A guard gossips about the Jarl's court. You feel less alone.", stat_deltas: { stress: -10, willpower: 3 }, hours_passed: 1 },
      { id: 'travel_market', label: "Return to the Marketplace", intent: "travel", outcome: "You step out of the steam into the crisp Skyrim air, feeling refreshed.", stat_deltas: { stamina: -3 }, new_location: 'town_square' }
    ]
  },
  'graveyard': {
    id: 'graveyard',
    name: "The Hall of the Dead",
    atmosphere: "fog-shrouded, the creak of ancient coffins, deathbell growing between the crypts",
    danger: 40,
    x: 68, y: 72,
    npcs: [],
    description: "The ancient Nordic cemetery and crypts beneath the city's temple. Fog-shrouded headstones carved with Dragon Language blessings line winding paths between yew trees. The main crypt descends underground, where the honoured dead rest in stone sarcophagi. At night, the boundary between Mundus and Oblivion feels thin here.",
    actions: [
      { id: 'visit_graves', label: "Visit the old graves", intent: "neutral", outcome: "You wander between ancient headstones, reading faded inscriptions. The quiet solemnity is strangely calming.", stat_deltas: { stress: -10, willpower: 3, trauma: -3 }, hours_passed: 1 },
      { id: 'search_trinkets', label: "Search for trinkets among the stones", intent: "stealth", skill_check: { stat: "willpower", difficulty: 40 }, outcome: "Between yew roots, you find a tarnished silver amulet — an offering no one will miss.", fail_outcome: "A priest of Arkay catches you disturbing the graves and chases you off.", stat_deltas: { stress: 10, purity: -5 }, fail_stat_deltas: { stress: 20, trauma: 3 }, skill_deltas: { skulduggery: 2 }, new_items: [{ name: "Tarnished Silver Amulet", type: "misc", rarity: "uncommon", description: "A small silver amulet of Arkay, tarnished with age." }] },
      { id: 'pray_dead', label: "Pray to Arkay for the departed", intent: "neutral", outcome: "You kneel before a weathered altar to Arkay. A warmth spreads through you, as if the god acknowledges your reverence.", stat_deltas: { stress: -15, purity: 5, trauma: -5 } },
      { id: 'explore_catacombs', label: "Explore the deep catacombs", intent: "stealth", skill_check: { stat: "willpower", difficulty: 60 }, outcome: "In a sealed chamber, you find offerings left for the dead — including coin.", fail_outcome: "Something moves in the darkness. Blue light flickers from empty eye sockets. You run.", stat_deltas: { stamina: -20, stress: 25 }, fail_stat_deltas: { health: -10, stress: 35, trauma: 15, pain: 10 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 2 },
      { id: 'travel_temple', label: "Return to the Temple", intent: "travel", outcome: "You hurry back through the fog to the warmth of the temple.", stat_deltas: { stamina: -5 }, new_location: 'temple_gardens' }
    ]
  },
  'noble_district': {
    id: 'noble_district',
    name: "The Cloud District",
    atmosphere: "perfumed, pristine, fine boots on clean stone, distant music from Dragonsreach",
    danger: 15,
    x: 70, y: 50,
    npcs: [],
    description: "The wealthy upper quarter of Whiterun. Grand stone houses with gardens and private wells. Guards patrol constantly; beggars are swiftly removed. The air carries Elven perfume and roasting pheasant, and the shadow of Dragonsreach looms protectively. You don't get to the Cloud District very often.",
    actions: [
      { id: 'window_shop', label: "Window-shop the fine goods", intent: "neutral", outcome: "You press your face against a jeweller's window. Gold circlets and moonstone glitter within. Beautiful things, impossibly far from your reach.", stat_deltas: { stress: 5, willpower: 3 }, hours_passed: 1 },
      { id: 'pickpocket_noble', label: "Pickpocket a distracted noble", intent: "stealth", skill_check: { stat: "willpower", difficulty: 60 }, outcome: "A merchant is distracted haggling. Your fingers close around a coin purse at their belt. You melt into the crowd.", fail_outcome: "The noble screams for the guard! You barely escape down a side alley.", stat_deltas: { stress: 20 }, fail_stat_deltas: { stress: 30, trauma: 5, pain: 10 }, skill_deltas: { skulduggery: 4 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'seek_employment', label: "Seek employment as a servant", intent: "work", skill_check: { stat: "allure", difficulty: 35 }, outcome: "A thane hires you for the day to polish silverware and sweep floors. Demeaning, but the pay is fair.", fail_outcome: "No one will hire a scruffy orphan. A guard tells you to move along.", stat_deltas: { stamina: -15, stress: 5 }, fail_stat_deltas: { stress: 15, trauma: 3 }, skill_deltas: { housekeeping: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 4 },
      { id: 'travel_market', label: "Return to the Marketplace", intent: "travel", outcome: "You descend the stone steps back to the lower city.", stat_deltas: { stamina: -3 }, new_location: 'town_square' },
      { id: 'travel_shopping', label: "Visit the shops", intent: "travel", outcome: "You follow the clean streets towards the commercial quarter.", stat_deltas: { stamina: -3 }, new_location: 'shopping_centre' }
    ]
  },
  'underground_market': {
    id: 'underground_market',
    name: "The Ragged Flagon",
    atmosphere: "damp, echoing, the clink of stolen septims and whispered deals",
    danger: 45,
    x: 81, y: 78,
    npcs: [],
    description: "The Thieves Guild's secret marketplace deep in the Ratway beneath Riften. A vast underground cavern where anything can be bought or sold — skooma, stolen goods, forged documents, poisons, and information. Hooded figures haggle over tables lit by guttering candles. The only law here is the Guild's own code.",
    actions: [
      { id: 'browse_contraband', label: "Browse the forbidden goods", intent: "stealth", outcome: "A Khajiit sells skooma pipes. A Dunmer offers enchanted daggers. A hooded Breton whispers about untraceable poisons.", stat_deltas: { stress: 10, willpower: 3 }, hours_passed: 1 },
      { id: 'fence_goods', label: "Fence stolen items", intent: "stealth", skill_check: { stat: "willpower", difficulty: 35 }, outcome: "Tonilia examines your goods and offers a fair price. No questions asked.", fail_outcome: "Tonilia waves you away. 'This is worthless.'", stat_deltas: { stress: 5 }, fail_stat_deltas: { stress: 10 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'eavesdrop', label: "Eavesdrop on deals", intent: "stealth", skill_check: { stat: "willpower", difficulty: 45 }, outcome: "You overhear plans for a heist on the Blue Palace treasury. The information might be worth something.", fail_outcome: "A Guild enforcer spots you. 'Mind your own business, rat.'", stat_deltas: { willpower: 5, stress: 10 }, fail_stat_deltas: { pain: 10, stress: 20, trauma: 5 }, skill_deltas: { skulduggery: 3 }, hours_passed: 1 },
      { id: 'travel_alleyways', label: "Leave through the Ratway", intent: "travel", outcome: "You navigate the damp tunnels back to the surface.", stat_deltas: { stamina: -10, hygiene: -5 }, new_location: 'alleyways' },
      { id: 'travel_sewers', label: "Go deeper into the Ratway", intent: "travel", outcome: "You descend further into the dark tunnels.", stat_deltas: { stamina: -5, stress: 5 }, new_location: 'sewers' }
    ]
  },
  'watchtower': {
    id: 'watchtower',
    name: "The Western Watchtower",
    atmosphere: "windswept, exposed, the creak of old timber and panoramic views of Whiterun Hold",
    danger: 35,
    x: 85, y: 42,
    npcs: [],
    description: "An abandoned Imperial watchtower on a hilltop overlooking Whiterun Hold, half-destroyed during a dragon attack and never repaired. The stone stairs are crumbling, but the view from the top — across the tundra to the Throat of the World — is breathtaking. Birds of prey nest in the ruined upper floors.",
    actions: [
      { id: 'climb_top', label: "Climb to the observation deck", intent: "work", skill_check: { stat: "stamina", difficulty: 40 }, outcome: "You scale the crumbling stairs. The wind nearly knocks you off your feet, but the view is staggering — all of Skyrim stretches before you.", fail_outcome: "A stone step gives way! You catch yourself on a timber beam and retreat.", stat_deltas: { stamina: -15, stress: -10, willpower: 5 }, fail_stat_deltas: { stamina: -10, pain: 10, stress: 15 }, skill_deltas: { athletics: 3 }, hours_passed: 1 },
      { id: 'survey_land', label: "Survey the surrounding holds", intent: "neutral", outcome: "From this height, you see caravans, distant farmsteads, and the dark smudge of the Rift forests. A rare sense of perspective and calm.", stat_deltas: { stress: -15, willpower: 5 }, hours_passed: 1 },
      { id: 'shelter_tower', label: "Shelter from the weather", intent: "neutral", outcome: "You find a sheltered corner out of the wind. The stone walls hold some warmth. You rest, watching clouds pass through arrow slits.", stat_deltas: { stamina: 20, stress: -10 }, hours_passed: 4 },
      { id: 'search_cache', label: "Search for a hidden cache", intent: "stealth", skill_check: { stat: "willpower", difficulty: 50 }, outcome: "Behind a loose stone, you find a leather pouch left by a smuggler — septims and a small jewel.", fail_outcome: "The tower has been picked clean by bandits.", stat_deltas: { stamina: -10, stress: 10 }, fail_stat_deltas: { stamina: -15, stress: 15 }, skill_deltas: { skulduggery: 2 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }, { name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }], hours_passed: 1 },
      { id: 'travel_moor', label: "Cross the tundra to the Reach", intent: "travel", outcome: "You set off across the wind-blasted highland.", stat_deltas: { stamina: -15, stress: 5 }, new_location: 'moor' },
      { id: 'travel_forest', label: "Head downhill to the Forest", intent: "travel", outcome: "You follow the hill down towards the treeline.", stat_deltas: { stamina: -10 }, new_location: 'forest' }
    ]
  },
  'crossroads': {
    id: 'crossroads',
    name: "Valtheim Crossroads",
    atmosphere: "exposed, the creak of a gibbet, the rumble of distant carts on the stone road",
    danger: 30,
    x: 86, y: 55,
    npcs: [],
    description: "The main crossroads where four Imperial roads meet beneath Valtheim Towers. A gallows creaks in the wind — the Jarl's justice on display. Travellers, Khajiit caravans, and Imperial wagons pass constantly. A notice board advertises bounties and mercenary work. The road east leads to Riften, south to the farms, north to the wilderness.",
    actions: [
      { id: 'setup_camp', label: "Set up camp by the road", intent: "neutral", outcome: "You build a small fire by the signpost. Road traffic keeps predators away, and you sleep lightly beneath the stars.", stat_deltas: { stamina: 20, stress: -5 }, hours_passed: 6 },
      { id: 'beg_travelers', label: "Beg from passing travellers", intent: "social", skill_check: { stat: "purity", difficulty: 25 }, outcome: "A kindly Khajiit trader gives you septims and dried moon sugar candy. 'May your road lead you to warm sands.'", fail_outcome: "Travellers avoid you. An Imperial soldier tells you to clear off.", stat_deltas: { purity: -3, stress: 5 }, fail_stat_deltas: { stress: 10, trauma: 3 }, new_items: [{ name: "Gold Coin", type: "misc", rarity: "common", description: "The currency of the realm." }] },
      { id: 'check_bounties', label: "Check the notice board", intent: "neutral", outcome: "You scan the bounties. Most are beyond you, but one catches your eye: a reward for gathering blue mountain flowers.", stat_deltas: { willpower: 3 } },
      { id: 'travel_market', label: "Take the road to the City", intent: "travel", outcome: "You follow the main road towards the city gates.", stat_deltas: { stamina: -10 }, new_location: 'town_square' },
      { id: 'travel_forest', label: "Head into the Wilderness", intent: "travel", outcome: "You leave the road into the dense forest.", stat_deltas: { stamina: -10 }, new_location: 'forest' },
      { id: 'travel_farm', label: "Walk to the Farmstead", intent: "travel", outcome: "You follow a dirt track towards the farmstead.", stat_deltas: { stamina: -10 }, new_location: 'farm' },
      { id: 'travel_ruins', label: "Climb to the Barrow", intent: "travel", outcome: "You take the steep mountain path towards the barrow.", stat_deltas: { stamina: -15, stress: 5 }, new_location: 'ruins' }
    ]
  }
};

export const STORY_EVENTS: Record<string, any> = {
  'orphanage_escape': {
    id: 'orphanage_escape',
    title: "Escape from Honorhall",
    description: "Plan and execute your escape from Honorhall Orphanage and the tyranny of Matron Grelod.",
    stages: [
      {
        stage: 1,
        condition: "Player is at orphanage and has visited town_square at least once",
        narrative: "Grelod's cruelty has reached a breaking point. She locked the youngest child in the cellar overnight, and even Constance couldn't stop her. As you scrub the floors, you notice the heavy oak door has a loose hinge — the nails are rusting through. If you could find a tool, you might pry it open after dark. But Grelod watches everything, and the punishment for failure doesn't bear thinking about.",
        choices: [
          { label: "Search the kitchens for a tool", intent: "stealth", outcome: "You find a bent iron ladle that could work as a pry bar.", stat_deltas: { stress: 15, willpower: 5 }, next_stage: 2 },
          { label: "Ask Constance for help", intent: "social", outcome: "Constance looks terrified but slips you the key to the side door at dawn.", stat_deltas: { stress: 10 }, next_stage: 2 },
          { label: "Endure it — not worth the risk", intent: "neutral", outcome: "You bow your head and continue scrubbing. Maybe tomorrow.", stat_deltas: { stress: 5, trauma: 3 } }
        ]
      },
      {
        stage: 2,
        condition: "Completed stage 1 with escape tool or key",
        narrative: "Night falls. Grelod has retired after her evening wine. The orphanage is silent. Robin catches your eye from across the dormitory — they know what you're planning. Their face is a mixture of fear and desperate hope. The door stands before you, the only barrier between captivity and freedom.",
        choices: [
          { label: "Escape alone into the night", intent: "stealth", outcome: "You slip through the door into the cold Riften streets. Free — but utterly alone.", stat_deltas: { stress: -20, stamina: -10 }, next_stage: 3 },
          { label: "Take Robin with you", intent: "social", outcome: "You grab Robin's hand and flee together. Having a companion makes the terrifying streets feel slightly less hostile.", stat_deltas: { stress: -15 }, next_stage: 3 },
          { label: "Wait for a better moment", intent: "neutral", outcome: "Your courage fails. You crawl back into your cot, clutching the tool beneath your blanket.", stat_deltas: { stress: 10, trauma: 5 } }
        ]
      },
      {
        stage: 3,
        condition: "Successfully escaped the orphanage",
        narrative: "You stand in the cold streets of Riften, the orphanage behind you. The night air bites at your skin, but it tastes like freedom. You have nothing — no money, no food, no shelter — but you have yourself. The Ratway yawns darkly to your left. The shuttered marketplace stretches ahead. Somewhere, a new life waits.",
        choices: [
          { label: "Find shelter in the Ratway", intent: "stealth", outcome: "You descend into the dark passages. Dangerous, but warm and hidden.", stat_deltas: { stress: 10 }, completes_quest: true },
          { label: "Sleep under the market stalls", intent: "neutral", outcome: "You curl up beneath a stall with discarded sacking. Cold, but it's a start.", stat_deltas: { stamina: 15, stress: -5 }, completes_quest: true }
        ]
      }
    ]
  },
  'baileys_ultimatum': {
    id: 'baileys_ultimatum',
    title: "Bailey's Racket",
    description: "Bailey runs a protection racket in Riften's lower wards. Pay up — or face the consequences.",
    stages: [
      {
        stage: 1,
        condition: "Day >= 7 and player has a safehouse",
        narrative: "A heavy knock. Bailey stands in the corridor, flanked by thugs. 'Nice little place. Shame if something happened to it. Fifty septims a week for my protection — nobody bothers you. Miss a payment...' They crack their knuckles. 'Let's hope it doesn't come to that.'",
        choices: [
          { label: "Pay the fifty septims", intent: "social", outcome: "You hand over the coins. Bailey smiles. 'Smart kid. See you next week.'", stat_deltas: { stress: 10 }, next_stage: 2 },
          { label: "Refuse to pay", intent: "aggressive", outcome: "Bailey's smile vanishes. The thugs trash your room. 'Next time, it won't be furniture.'", stat_deltas: { stress: 25, trauma: 10, pain: 10 }, next_stage: 2 },
          { label: "Plead for more time", intent: "social", outcome: "Bailey sighs. 'One week. Then the price doubles.'", stat_deltas: { stress: 20 }, next_stage: 2 }
        ]
      },
      {
        stage: 2,
        condition: "Day >= 14 after stage 1",
        narrative: "Bailey returns. Their thugs look bigger, and one carries a heavy club. 'Payment time.' No pretense of friendliness. This is business.",
        choices: [
          { label: "Pay the money", intent: "social", outcome: "You pay. Temporary relief — they'll be back.", stat_deltas: { stress: 5 }, next_stage: 3 },
          { label: "Negotiate a lower rate", intent: "social", outcome: "Bailey laughs. 'Fine — thirty septims. But you owe me a favour.'", stat_deltas: { stress: 10, willpower: 5 }, next_stage: 3 },
          { label: "Fight back", intent: "aggressive", outcome: "You swing first. It doesn't go well.", stat_deltas: { health: -20, pain: 25, stress: 30, trauma: 10 }, next_stage: 3 }
        ]
      },
      {
        stage: 3,
        condition: "Day >= 21 after stage 2",
        narrative: "Bailey's grip tightens. Rumours say they answer to Maven Black-Briar — so the guards won't help. You need another way. Perhaps the Thieves Guild? After all, Bailey is competition. Or perhaps you need leverage of your own.",
        choices: [
          { label: "Seek help from the Thieves Guild", intent: "social", outcome: "Brynjolf listens with interest. 'Bailey's been stepping on our turf too long. Let us handle it.' Within a week, Bailey's thugs vanish.", stat_deltas: { stress: -20 }, completes_quest: true },
          { label: "Gather evidence of Bailey's crimes", intent: "stealth", outcome: "You follow Bailey, documenting their dealings. Useful evidence for someone with authority — or leverage.", stat_deltas: { stress: 15, willpower: 5 }, skill_deltas: { skulduggery: 3 }, completes_quest: true },
          { label: "Keep paying and stay quiet", intent: "neutral", outcome: "You keep your head down. It eats into savings, but your room still stands.", stat_deltas: { stress: 10 } }
        ]
      }
    ]
  },
  'robin_rescue': {
    id: 'robin_rescue',
    title: "Robin in Danger",
    description: "Robin has gone missing from the orphanage. Find them before it's too late.",
    stages: [
      {
        stage: 1,
        condition: "Robin relationship >= 20 and day >= 10",
        narrative: "Constance finds you, face ashen. 'Robin is missing! They went out for bread and never came back. Grelod says good riddance, but I'm terrified — the Ratway has gotten more dangerous with the skooma trade. Please, find them!' She presses septims into your hands.",
        choices: [
          { label: "Search the Ratway immediately", intent: "aggressive", outcome: "You plunge into the dark passages, calling Robin's name.", stat_deltas: { stamina: -15, stress: 20 }, next_stage: 2 },
          { label: "Ask around the marketplace first", intent: "social", outcome: "A fish-seller remembers seeing Robin near the docks, talking to a stranger in a dark cloak.", stat_deltas: { stress: 15, willpower: 5 }, next_stage: 2 },
          { label: "Refuse — too dangerous", intent: "neutral", outcome: "You shake your head. Constance turns away without a word. The guilt is crushing.", stat_deltas: { stress: 5, trauma: 5, purity: -10 } }
        ]
      },
      {
        stage: 2,
        condition: "Accepted the search in stage 1",
        narrative: "Deep in the Ratway, you find Robin — alive but bound and gagged. A skooma dealer guards them, planning to sell them to a Morrowind slaver. The dealer draws a jagged knife. 'Walk away, street rat. This one's already bought and paid for.'",
        choices: [
          { label: "Fight the dealer", intent: "aggressive", outcome: "You launch yourself at the dealer. It's brutal, but you knock them down and free Robin.", stat_deltas: { health: -10, pain: 15, stamina: -20, willpower: 10 }, next_stage: 3 },
          { label: "Create a distraction and grab Robin", intent: "stealth", outcome: "You knock over skooma bottles. While the dealer scrambles, you cut Robin's bonds and run.", stat_deltas: { stamina: -15, stress: 15 }, skill_deltas: { skulduggery: 4 }, next_stage: 3 },
          { label: "Offer to buy Robin's freedom", intent: "social", outcome: "You offer Constance's septims. The dealer snatches the pouch and cuts Robin loose. 'Take the runt.'", stat_deltas: { stress: 10 }, next_stage: 3 }
        ]
      },
      {
        stage: 3,
        condition: "Robin freed in stage 2",
        narrative: "Robin clings to you as you emerge into the grey Riften light. 'Thank you,' they whisper. 'I thought no one would come.' Constance runs to embrace you both. For once, something went right. Robin looks at you with gratitude and something deeper — a bond forged in rescue.",
        choices: [
          { label: "Stay with Robin until they recover", intent: "social", outcome: "You sit through the night, holding their hand as the terror fades. A deep bond is forged.", stat_deltas: { stress: -20, purity: 10, willpower: 5 }, completes_quest: true },
          { label: "Report the slavers to the guard", intent: "neutral", outcome: "You find an honest guard and report the slavers. A raid follows. Justice is served.", stat_deltas: { stress: -10, purity: 5, willpower: 10 }, completes_quest: true }
        ]
      }
    ]
  },
  'temple_mystery': {
    id: 'temple_mystery',
    title: "The Weeping Shrine",
    description: "Strange occurrences at the Temple of Mara suggest Daedric influence.",
    stages: [
      {
        stage: 1,
        condition: "Player has visited temple_gardens 3+ times",
        narrative: "The priests are troubled. The statue of Mara has been weeping — actual tears of liquid silver. The temple dogs refuse to enter the gardens after dark, and strange flowers bloom where no seeds were planted. An elderly priestess confides: 'Something reaches through from the other side. Something that wears the mask of love but reeks of obsession.'",
        choices: [
          { label: "Investigate the statue at midnight", intent: "stealth", outcome: "At midnight, the statue glows faintly. You hear whispered words in a language older than Tamriel.", stat_deltas: { stress: 20, willpower: 8 }, next_stage: 2 },
          { label: "Research Daedric interference in the library", intent: "education", outcome: "Hours of reading reveal symptoms matching a Vaermina infiltration.", stat_deltas: { willpower: 10, stress: 5 }, skill_deltas: { lore_mastery: 3 }, next_stage: 2 },
          { label: "Leave it to the priests", intent: "neutral", outcome: "You walk away. But the whispers follow in your dreams.", stat_deltas: { stress: 5, trauma: 3 } }
        ]
      },
      {
        stage: 2,
        condition: "Investigated in stage 1",
        narrative: "Your investigation reveals a hidden chamber beneath the altar. Inside: a Daedric shrine to Vaermina, Prince of nightmares. Someone has been performing rituals, feeding on devotion and twisting it into dream-energy. The shrine pulses with sickly purple light.",
        choices: [
          { label: "Destroy the shrine", intent: "aggressive", outcome: "You smash the shrine. The purple light screams and dies. The weeping stops. You've made an enemy of a Daedric Prince.", stat_deltas: { purity: 10, willpower: 10, stress: -15, trauma: -5 }, completes_quest: true },
          { label: "Study the shrine's magic", intent: "education", outcome: "You memorize the rune patterns. Dark, dangerous knowledge — but power comes in many forms.", stat_deltas: { willpower: 15, corruption: 5, purity: -5 }, completes_quest: true },
          { label: "Report to the priests", intent: "social", outcome: "The priests are horrified but grateful. They seal the chamber with Mara's blessings.", stat_deltas: { purity: 5, stress: -10 }, completes_quest: true }
        ]
      }
    ]
  },
  'blood_moon_prophecy': {
    id: 'blood_moon_prophecy',
    title: "The Blood Moon Prophecy",
    description: "The recurring blood moons grow stronger. An ancient evil stirs in the barrow.",
    stages: [
      {
        stage: 1,
        condition: "Day >= 30 and player has survived a blood_moon_horror encounter",
        narrative: "After the last blood moon, you find a note nailed to a tree: 'WHEN SECUNDA BLEEDS RED, THE HUNT BEGINS. THE HOUNDS OF HIRCINE RIDE AGAIN.' An old Dunmer wanderer recognizes the script — a Daedric invocation to Hircine. 'The blood moons are getting closer together. Something feeds them. Something in the old barrow.'",
        choices: [
          { label: "Investigate the barrow by daylight", intent: "stealth", outcome: "You approach the ruins. Strange claw marks score the stones, and the air smells of wet fur and iron.", stat_deltas: { stress: 15, willpower: 5 }, next_stage: 2 },
          { label: "Consult the temple priests about Hircine", intent: "education", outcome: "The priests share what they know. 'If someone performs his rituals, the entire hold is in danger.'", stat_deltas: { willpower: 8 }, skill_deltas: { lore_mastery: 3 }, next_stage: 2 },
          { label: "Ignore it", intent: "neutral", outcome: "You try to forget. But your dreams fill with howling wolves and a red Secunda.", stat_deltas: { stress: 10, trauma: 5 } }
        ]
      },
      {
        stage: 2,
        condition: "Investigated in stage 1",
        narrative: "Deep in the barrow: a Hircine shrine, recently activated, surrounded by wolf pelts and bloody offerings. A journal reveals the cultist's plan — become a werewolf through the Bloodmoon Ritual, using stolen life-force. The next blood moon is in three days.",
        choices: [
          { label: "Destroy the shrine before the next blood moon", intent: "aggressive", outcome: "You tear it down. The shrine screams with bestial fury. The next blood moon passes without incident — but Hircine's gaze is upon you.", stat_deltas: { willpower: 10, stress: -10, purity: 5 }, completes_quest: true },
          { label: "Set a trap for the cultist", intent: "stealth", outcome: "You hide and wait. At midnight, a figure approaches — and transforms. The sight of a werewolf is burned into your memory.", stat_deltas: { stress: 25, trauma: 10, willpower: 5 }, skill_deltas: { skulduggery: 5 }, completes_quest: true },
          { label: "Take the shrine's power for yourself", intent: "aggressive", outcome: "You drink from the offering bowl. Hircine's blood burns through you. Something changes — primal and irreversible.", stat_deltas: { corruption: 15, willpower: 15, purity: -15, stamina: 20 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── School Story Arc ──────────────────────────────────────────────────────

  'school_whitney_confrontation': {
    id: 'school_whitney_confrontation',
    title: "The Bully's Ultimatum",
    description: "Whitney's bullying has escalated. It's time to face them — one way or another.",
    stages: [
      {
        stage: 1,
        condition: "Player attends school 5+ times and Whitney relationship < 0",
        narrative: "Whitney catches you alone in the hallway after the last bell. Their gang blocks both exits. 'You've been avoiding me, orphan. That ends today.' They crack their knuckles. 'Here's the deal — you're mine now. You carry my bag, you do my homework, and you pay me every week. Or...' They let the threat hang in the air like a blade.",
        choices: [
          { label: "Refuse and stand your ground", intent: "aggressive", outcome: "You square your shoulders. 'No.' Whitney's eyes widen — nobody says no to Whitney. 'You're gonna regret that.' They shove you hard against the lockers. But you don't fall. For the first time, Whitney looks uncertain.", stat_deltas: { stress: 20, willpower: 10, pain: 5 }, next_stage: 2 },
          { label: "Agree to keep the peace", intent: "neutral", outcome: "You nod, stomach churning with shame. Whitney grins. 'Smart kid. See? Things are easier when you cooperate.' They walk away laughing. The weight of submission settles on your shoulders like a yoke.", stat_deltas: { stress: 15, trauma: 8, purity: -3 }, next_stage: 3 },
          { label: "Try to talk them down", intent: "social", outcome: "You speak calmly, meeting their eyes. 'Why are you doing this? What happened to you?' Whitney flinches — barely perceptible — then the mask slams back down. 'Shut up. You don't know anything about me.' But they let you walk away. This time.", stat_deltas: { stress: 10, willpower: 5 }, next_stage: 2 }
        ]
      },
      {
        stage: 2,
        condition: "Defied or reasoned with Whitney in stage 1",
        narrative: "Days later, you find Whitney sitting alone behind the gym, knees drawn up. They don't hear you approach. When they look up, their eyes are red-rimmed. A bruise that isn't from a fight darkens their jaw. For a moment, the bully is gone — what's left is just a kid, hurting.",
        choices: [
          { label: "Sit with them in silence", intent: "social", outcome: "You sit down beside them without speaking. After a long moment, Whitney's rigid posture softens. 'My old man,' they mutter. 'He drinks.' That's all they say. It's enough.", stat_deltas: { stress: -10, willpower: 5, purity: 5 }, completes_quest: true },
          { label: "Offer them food from your pack", intent: "social", outcome: "You pull out a bread roll and offer it. Whitney stares at you, then at the bread. 'Why are you being nice to me? I've been horrible to you.' They take the bread. 'Thanks.' The word seems to cost them everything.", stat_deltas: { stress: -15, purity: 8 }, completes_quest: true },
          { label: "Walk away — they don't deserve your sympathy", intent: "neutral", outcome: "You turn and leave. Whitney watches you go. The next day at school, they avoid your eyes. The bullying stops — but so does any chance of understanding.", stat_deltas: { stress: -5, willpower: 3 }, completes_quest: true }
        ]
      },
      {
        stage: 3,
        condition: "Submitted to Whitney in stage 1",
        narrative: "Weeks of servitude wear you down. Whitney's demands grow bolder — more homework, more money, more degrading tasks. But you also notice things: Whitney steals food from the cafeteria because they never bring lunch. Their uniform sleeves always stay rolled down, hiding something. One day, carrying their bag, a photograph falls out — Whitney as a small child, smiling, held by a woman who isn't there anymore.",
        choices: [
          { label: "Confront Whitney about the photograph", intent: "social", outcome: "'Where did you get that!' Whitney snatches it back, face cycling through fury, fear, and grief. Then, very quietly: 'She left. Two years ago. Just walked out and didn't come back.' The confession cracks something open between you.", stat_deltas: { stress: 5, willpower: 8, trauma: -5 }, completes_quest: true },
          { label: "Pretend you didn't see it", intent: "neutral", outcome: "You hand the bag back without comment. But something changes in how you see Whitney. They're not a monster — they're a mirror. Hurt begets hurt. You understand that now.", stat_deltas: { willpower: 5, purity: 3 }, completes_quest: true },
          { label: "Use the photo as leverage to break free", intent: "stealth", outcome: "'Let me go, or everyone sees this.' Whitney goes white. 'You wouldn't.' You would. The power dynamic shatters. Whitney never bothers you again — but the look in their eyes haunts you.", stat_deltas: { stress: -10, purity: -8, willpower: 5 }, skill_deltas: { skulduggery: 3 }, completes_quest: true }
        ]
      }
    ]
  },

  'school_leighton_secret': {
    id: 'school_leighton_secret',
    title: "After Hours",
    description: "Headmaster Leighton's after-hours activities raise disturbing questions.",
    stages: [
      {
        stage: 1,
        condition: "Player has lore_mastery >= 30 and has attended school 10+ times",
        narrative: "Detention. Again. But this time, Leighton locks the classroom door behind them with a heavy click. 'You've been a persistent rule-breaker,' they say, circling behind you. 'I think ordinary punishment isn't working. We need... a different approach.' Their voice drops to something soft and terrible. Something is very wrong.",
        choices: [
          { label: "Demand they unlock the door", intent: "aggressive", outcome: "You stand up. 'Open the door. Now.' Your voice doesn't waver. Leighton pauses, studies you, then unlocks the door with a thin smile. 'Perhaps another time.' The door swings open. You run. But you know what you almost walked into.", stat_deltas: { stress: 25, willpower: 10, trauma: 5 }, next_stage: 2 },
          { label: "Play dumb and look for an exit", intent: "stealth", outcome: "You pretend not to understand, eyes scanning the room. The window latch is rusted but functional. 'I need the bathroom,' you say. Leighton gestures impatiently. You slip to the window and climb out before they can react.", stat_deltas: { stress: 20, willpower: 8 }, skill_deltas: { skulduggery: 3 }, next_stage: 2 },
          { label: "Freeze in terror", intent: "neutral", outcome: "Your body locks up. Leighton steps closer. Then a knock at the door — River, looking for a textbook. Leighton's mask snaps back into place. 'We're finished here. You may go.' River gives you a concerned look as you flee.", stat_deltas: { stress: 30, trauma: 10, willpower: -3 }, next_stage: 2 }
        ]
      },
      {
        stage: 2,
        condition: "Escaped Leighton in stage 1",
        narrative: "You can't stop thinking about what almost happened. And you notice things now — other students leaving Leighton's office looking pale and shaken. One student, a quiet girl named Fern, flinches every time Leighton speaks. You're not the only target. Something must be done.",
        choices: [
          { label: "Tell River what happened", intent: "social", outcome: "River's face goes white, then red with fury. 'How long has this been going on?' They listen to everything, take notes, and promise action. 'I'll make sure this reaches the Jarl's office. You're incredibly brave for telling me.' Within a week, Leighton is removed.", stat_deltas: { stress: -20, willpower: 15, purity: 10, trauma: -5 }, completes_quest: true },
          { label: "Gather evidence from Leighton's office", intent: "stealth", outcome: "You sneak into the office at night. The desk drawer is locked, but not well. Inside: a journal of disturbing records. You take it to the guards yourself. The arrest happens at dawn. Fern finds you later and hugs you without a word.", stat_deltas: { stress: -15, willpower: 12, purity: 8 }, skill_deltas: { skulduggery: 5 }, completes_quest: true },
          { label: "Warn the other students and avoid Leighton", intent: "social", outcome: "You pull Fern and others aside. 'Don't go to detention alone. Never be alone with Leighton.' It's not a solution, but it's protection. The students start watching out for each other. Strength in numbers.", stat_deltas: { stress: -10, willpower: 8, purity: 5 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Docks Story Arc ───────────────────────────────────────────────────────

  'docks_smuggler_ring': {
    id: 'docks_smuggler_ring',
    title: "The Argonian Dockworkers",
    description: "The Argonian labourers at the docks are being exploited. Getting involved could be dangerous — or rewarding.",
    stages: [
      {
        stage: 1,
        condition: "Player has visited docks 3+ times",
        narrative: "You notice the Argonian dockworkers are paid a fraction of what the Nord labourers earn — and beaten if they complain. An elderly Argonian named Neetrenaza pulls you aside. 'You seem different from the others, warm-blood. We need help. The dock foreman is skimming wages and selling our hours to a smuggling operation. If you could get proof...'",
        choices: [
          { label: "Agree to help investigate", intent: "social", outcome: "Neetrenaza's reptilian eyes soften with gratitude. 'Be careful. The foreman has allies among the guards.' They slip you a key to the warehouse office.", stat_deltas: { willpower: 5, stress: 10 }, next_stage: 2 },
          { label: "Offer to confront the foreman directly", intent: "aggressive", outcome: "You march up to the foreman's shack. He's a massive Nord with a scarred face. 'Beat it, runt. This is none of your concern.' He shoves you. Hard. But the Argonians see you tried. It matters.", stat_deltas: { pain: 10, stress: 15, willpower: 8 }, next_stage: 2 },
          { label: "Stay out of it — too risky", intent: "neutral", outcome: "You shake your head. Neetrenaza nods wearily. 'I understand. Self-preservation is not a crime.' But their disappointment hangs in the salt air as they shuffle back to the loading docks.", stat_deltas: { stress: 5, purity: -3 } }
        ]
      },
      {
        stage: 2,
        condition: "Agreed to help in stage 1",
        narrative: "You find the warehouse office unlocked at midnight. Inside: ledgers showing the real wage payments versus what the Argonians actually receive. The difference is being funnelled to a skooma operation run through the East Empire Company's shipping routes. This goes deeper than a crooked foreman.",
        choices: [
          { label: "Take the ledgers to the guards", intent: "social", outcome: "You deliver the evidence to a guard captain. Arrests follow — the foreman, two smugglers, and an East Empire Company clerk. Neetrenaza embraces you with rough, scaled arms. 'You've given us back our dignity, friend.'", stat_deltas: { stress: -15, purity: 10, willpower: 10 }, completes_quest: true },
          { label: "Give the evidence to Brynjolf instead", intent: "stealth", outcome: "Brynjolf examines the ledgers with professional interest. 'This is leverage, not justice. But I'll make sure these people are dealt with — our way.' Within a week, the foreman is found floating in the canal. The Argonians get a new, fairer boss.", stat_deltas: { stress: -10, willpower: 5, corruption: 3 }, skill_deltas: { skulduggery: 5 }, completes_quest: true },
          { label: "Blackmail the foreman for a cut", intent: "stealth", outcome: "You show the foreman his own ledger. His face drains of colour. 'What do you want?' You name a price. It's not justice, but it's profit. The Argonians' situation doesn't change, but yours does.", stat_deltas: { stress: 10, corruption: 8, purity: -10 }, skill_deltas: { skulduggery: 4 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Farm Story Arc ────────────────────────────────────────────────────────

  'farm_alex_struggle': {
    id: 'farm_alex_struggle',
    title: "Harvest Moon",
    description: "Alex's farm faces ruin. The harvest must come in, or everything they've built will be lost.",
    stages: [
      {
        stage: 1,
        condition: "Alex relationship >= 15 and day >= 14",
        narrative: "You arrive at the farm to find Alex slumped against the barn wall, head in their hands. 'It's over,' they whisper. 'The blight took the south field. Half the harvest is gone. The tax collector comes in ten days, and I don't have enough to pay. They'll take the farm — Ma and Pa's farm.' Their voice breaks. 'I can't lose this place.'",
        choices: [
          { label: "Pledge to help save the harvest", intent: "social", outcome: "You kneel beside Alex and take their dirt-roughened hands. 'I'll help you. We'll save it together.' Alex looks at you with desperate hope. 'You mean that?' For the first time in weeks, they manage a small, fragile smile.", stat_deltas: { stress: 10, willpower: 10, purity: 5 }, next_stage: 2 },
          { label: "Lend them gold to cover the tax", intent: "social", outcome: "You count out your savings. It's almost enough. Alex stares at the coins, then at you. 'I can't take your money.' But you press it into their hands. 'Pay me back in potatoes,' you say. They laugh — a wet, grateful sound.", stat_deltas: { stress: -5, willpower: 5, purity: 8 }, next_stage: 3 },
          { label: "You can't help — you have your own problems", intent: "neutral", outcome: "You shake your head. Alex nods, jaw tight. 'I understand. Everyone has their own burdens.' They stand and walk back to the field alone. The guilt tastes like ashes.", stat_deltas: { stress: 5, purity: -5, trauma: 3 } }
        ]
      },
      {
        stage: 2,
        condition: "Pledged to help in stage 1",
        narrative: "Five gruelling days of dawn-to-dusk labour. Your hands blister, your back aches, but the remaining harvest comes in bushel by precious bushel. Alex works beside you, teaching you the rhythm of the scythe, the way to read the soil. In the exhausting, honest work, something grows between you — respect, trust, and perhaps something more.",
        choices: [
          { label: "Push through the final night together", intent: "work", outcome: "The last sheaves come in under starlight. You collapse in the hay, Alex beside you, both of you laughing from sheer exhaustion. 'We did it,' Alex breathes. Their hand finds yours in the dark. 'I couldn't have done this without you.'", stat_deltas: { stamina: -20, stress: -25, willpower: 15, purity: 5 }, skill_deltas: { tending: 8, athletics: 3 }, completes_quest: true },
          { label: "Ask the town for help with a harvest fair", intent: "social", outcome: "You rally the café, the market, and even a few reluctant guards to help. Sam brings food, Brand-Shei brings tools, and the harvest becomes a community effort. Alex watches in disbelief as neighbours they'd never spoken to pitch in. 'I thought nobody cared,' they whisper.", stat_deltas: { stress: -20, willpower: 10, purity: 10 }, skill_deltas: { tending: 5 }, completes_quest: true }
        ]
      },
      {
        stage: 3,
        condition: "Lent gold in stage 1",
        narrative: "The tax collector leaves satisfied. Alex leans against the farmhouse door, tears of relief streaming down their face. 'You saved my home. My family's home.' They look at you with an intensity that has nothing to do with gratitude and everything to do with something deeper. 'Stay for dinner? I want to cook for you. A real meal. You've earned that and more.'",
        choices: [
          { label: "Stay for dinner", intent: "social", outcome: "The kitchen smells of roasting venison and fresh herbs. Alex cooks with surprising skill, talking about their parents, the farm, their dreams. The evening stretches into night, warm and quiet and safe. 'Thank you,' Alex says at the door. 'For believing in me when I couldn't.'", stat_deltas: { stress: -25, purity: 8, willpower: 5 }, completes_quest: true },
          { label: "Promise to visit again soon", intent: "neutral", outcome: "You promise, and you mean it. Alex watches you walk down the farm road, silhouetted against the setting sun. When you glance back, they're still standing there, one hand raised in farewell. The farm will survive. And so will whatever this is becoming.", stat_deltas: { stress: -15, willpower: 5, purity: 5 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Brothel Story Arc ─────────────────────────────────────────────────────

  'brothel_briars_offer': {
    id: 'brothel_briars_offer',
    title: "Briar's Proposition",
    description: "The madam of the brothel sees potential in you. Her offer comes with golden chains attached.",
    stages: [
      {
        stage: 1,
        condition: "Player has visited brothel 2+ times and allure >= 5",
        narrative: "Briar summons you to the private office behind the velvet curtain. The room smells of expensive incense and old money. 'I've been watching you,' they say, pouring two glasses of Colovian brandy. 'You have something my other workers don't — that raw, untouched quality. Clients pay a premium for that.' They slide a contract across the desk. 'Work for me. Properly. I'll give you a room, protection, and more gold than you'll see in a year of honest labour.'",
        choices: [
          { label: "Refuse firmly", intent: "aggressive", outcome: "You push the contract back. 'I'm not for sale.' Briar's smile doesn't waver. 'Everyone is for sale, darling. They just haven't found their price yet.' You leave, but the door remains open.", stat_deltas: { stress: 10, willpower: 10, purity: 5 }, next_stage: 2 },
          { label: "Ask about the conditions", intent: "social", outcome: "You read the contract carefully. Room and board, 60/40 split in Briar's favour, and a clause about 'exclusive services'. Briar watches you read with predatory patience. 'Questions are good. It means you're smart.'", stat_deltas: { stress: 15, willpower: 3 }, next_stage: 2 },
          { label: "Accept the offer", intent: "neutral", outcome: "You sign. Briar's smile widens. 'Welcome to the family.' The room is comfortable, the gold flows freely, but the nights are long and the clients don't always ask permission. You wonder if you've sold something you can never buy back.", stat_deltas: { stress: 20, purity: -15, corruption: 10, lust: 10 }, next_stage: 3 }
        ]
      },
      {
        stage: 2,
        condition: "Refused or inquired in stage 1",
        narrative: "A week later, Briar's enforcer corners you in the alleyways. 'Briar doesn't like being told no. But they're reasonable. Counter-offer: one night's work. Just one. A specific client, very rich, very generous. You can walk away after with enough gold to live on for a month. No contract, no strings.' The enforcer's eyes suggest that 'no' is not the expected answer.",
        choices: [
          { label: "Refuse again — you won't be pressured", intent: "aggressive", outcome: "The enforcer shrugs. 'Your funeral, kid.' They disappear into the shadows. Briar doesn't bother you again — but you notice their workers watching you with a mixture of pity and respect. You held your ground against someone nobody says no to.", stat_deltas: { willpower: 15, stress: -10, purity: 8 }, completes_quest: true },
          { label: "Report the intimidation to the guards", intent: "social", outcome: "You find an honest guard — one of the few. They take your statement but warn you: 'Briar has friends in high places. Be careful.' The pressure stops, but you watch your back more carefully now.", stat_deltas: { willpower: 10, stress: 5, purity: 5 }, completes_quest: true },
          { label: "Negotiate better terms — your terms", intent: "stealth", outcome: "You name your price — and it's high. You demand a 70/30 split, the right to refuse any client, and no contract. The enforcer relays the terms. To your surprise, Briar accepts. 'I respect someone who knows their worth,' they say. It's not ideal, but it's power.", stat_deltas: { willpower: 8, stress: 10, corruption: 5 }, skill_deltas: { seduction: 3 }, completes_quest: true }
        ]
      },
      {
        stage: 3,
        condition: "Accepted Briar's offer in stage 1",
        narrative: "Months pass. The gold piles up, but so do the bruises and the hollow feeling. A new worker arrives — young, terrified, clearly forced. They remind you of yourself. Briar notices your concern. 'Don't get attached. They're a commodity, same as you.' But you're not a commodity. Not anymore.",
        choices: [
          { label: "Help the new worker escape", intent: "social", outcome: "You plan carefully. A distraction, a unlocked back door, a contact in the temple who provides sanctuary. The new worker disappears into the night. Briar is furious, but can't prove anything. You've found something worth more than gold — your conscience.", stat_deltas: { stress: -10, purity: 15, willpower: 10, corruption: -8 }, completes_quest: true },
          { label: "Take your savings and leave", intent: "neutral", outcome: "You collect your gold, pack your things, and walk out without looking back. Briar watches from the window. 'You'll be back,' they call. You don't answer. You won't be back.", stat_deltas: { stress: -20, purity: 5, willpower: 12, corruption: -5 }, completes_quest: true },
          { label: "Learn the business from the inside", intent: "stealth", outcome: "You study how Briar operates — the clients, the money, the connections. Knowledge is power. When you finally leave, you take enough secrets to ensure Briar never comes after you. Or anyone else.", stat_deltas: { willpower: 15, corruption: 5, purity: -3 }, skill_deltas: { skulduggery: 5, seduction: 5 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Forest Story Arc ──────────────────────────────────────────────────────

  'forest_eden_hunt': {
    id: 'forest_eden_hunt',
    title: "The First Hunt",
    description: "Eden offers to teach you to hunt. In the deep forest, bonds form faster than in civilization.",
    stages: [
      {
        stage: 1,
        condition: "Eden relationship >= 10 and player has visited eden_cabin 2+ times",
        narrative: "Eden is cleaning a hunting bow when you arrive. They study you for a long moment, then hold out the bow. 'You're scrawny, clumsy, and you walk like a city rat.' A pause. 'But you keep coming back. That counts for something.' They shoulder their own bow. 'Come. I'll teach you to hunt. If you can keep quiet for more than ten seconds.'",
        choices: [
          { label: "Accept eagerly", intent: "social", outcome: "You take the bow. It's heavier than it looks. Eden corrects your grip without comment, their calloused fingers briefly warm against yours. 'This way. Stay close.' You follow them into the pines. The forest swallows you both.", stat_deltas: { stress: -10, willpower: 5 }, next_stage: 2 },
          { label: "Admit you've never held a weapon before", intent: "social", outcome: "'I know.' Eden's voice is flat, but there's a ghost of amusement. 'That's why I'm teaching you. The forest doesn't care about your past.' They adjust the bowstring with practised hands. 'It only cares about what you can become.'", stat_deltas: { stress: -5, willpower: 8 }, next_stage: 2 },
          { label: "Suggest something else instead", intent: "neutral", outcome: "Eden's expression shutters. 'Suit yourself.' They turn back to the cabin. The offer won't come again easily — Eden doesn't extend themselves twice. You've lost ground.", stat_deltas: { stress: 5 } }
        ]
      },
      {
        stage: 2,
        condition: "Accepted the hunt in stage 1",
        narrative: "Deep in the ancient forest, Eden moves like a shadow. They teach you to read tracks in the mud, to identify the wind's direction by scattering leaf fragments, to walk on the sides of your feet to stay silent. Hours pass in concentrated stillness. Then Eden holds up a fist — stop. Through the undergrowth: a stag, magnificent, its antlers catching the filtered light. 'Your shot,' Eden breathes. 'Steady. Breathe out. Release.'",
        choices: [
          { label: "Take the shot", intent: "work", outcome: "The arrow flies true — not perfect, but good enough. The stag falls. Eden nods slowly, the highest praise they give. 'Clean kill. You did well.' Later, cleaning the catch by the stream, they're almost relaxed. 'You can come back,' they say quietly. 'If you want.'", stat_deltas: { willpower: 10, stress: -15, stamina: -10 }, skill_deltas: { athletics: 5, foraging: 3 }, completes_quest: true },
          { label: "Lower the bow — you can't kill it", intent: "social", outcome: "You can't. The stag is too beautiful, too alive. Eden looks at you, then at the stag as it bounds away. For a moment, anger crosses their face. Then, unexpectedly, something softens. 'Compassion,' they say. 'It'll get you killed out here. But...' They trail off. 'It's not the worst quality in a person.'", stat_deltas: { stress: -10, purity: 8, willpower: 5 }, completes_quest: true },
          { label: "Miss deliberately and pretend it was bad aim", intent: "stealth", outcome: "The arrow whistles past the stag's flank. Eden watches the animal flee, then looks at you. 'You missed on purpose.' It's not a question. 'I noticed your hands were steady.' A long pause. 'You're kinder than this forest deserves. That's either your greatest strength or your death sentence.'", stat_deltas: { stress: -5, willpower: 5, purity: 5 }, skill_deltas: { skulduggery: 2 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Sewers Story Arc ──────────────────────────────────────────────────────

  'sewers_lost_children': {
    id: 'sewers_lost_children',
    title: "The Ratway Children",
    description: "Orphans live in the sewers — children too afraid to return to Grelod's orphanage. They need a protector.",
    stages: [
      {
        stage: 1,
        condition: "Player has visited sewers 2+ times and escaped orphanage",
        narrative: "Deep in the Ratway, past the skooma dens and the dripping pipes, you hear something unexpected: children laughing. You round a corner and find a makeshift camp — salvaged blankets, guttering candles, and five wide-eyed children huddled together. They see you and scatter like startled mice. The oldest, a sharp-eyed girl named Miri, brandishes a rusty knife. 'We're not going back to Grelod. Don't try to make us.'",
        choices: [
          { label: "Reassure them — you're not here to hurt them", intent: "social", outcome: "You hold up empty hands. 'I ran away from Grelod too.' Miri's knife lowers an inch. 'Prove it.' You show the old scars on your wrist from Grelod's belt. Miri's eyes widen with recognition. She puts the knife down. 'You're one of us.'", stat_deltas: { stress: 10, willpower: 5, purity: 5 }, next_stage: 2 },
          { label: "Offer them food from your pack", intent: "social", outcome: "You set down bread and cheese. The youngest child breaks cover first, snatching the bread. The others follow. Miri watches, then slowly sheathes her knife. 'What do you want?' 'Nothing,' you say. 'I know what it's like.' She studies you for a long time. 'Come back tomorrow. Bring more food. Maybe we'll talk.'", stat_deltas: { stress: 5, purity: 8, willpower: 3 }, next_stage: 2 },
          { label: "Walk away — you can barely take care of yourself", intent: "neutral", outcome: "You back away. The children watch you go with haunted, hollow eyes. Miri's voice follows you: 'Coward.' The word echoes in the tunnels long after you've left.", stat_deltas: { stress: 10, trauma: 5, purity: -5 } }
        ]
      },
      {
        stage: 2,
        condition: "Gained Miri's trust in stage 1",
        narrative: "Over the following days, you visit the Ratway children regularly. Miri tells you their stories: orphans who fled Grelod, runaways from abusive homes, street children abandoned by the city. They survive on scraps and stolen goods. But winter is coming, and the sewers will become a death trap — freezing water, rising floods, and the skeevers grow desperate when the cold comes. 'We need a real shelter,' Miri says. 'Somewhere warm and safe.'",
        choices: [
          { label: "Help them find an abandoned building above ground", intent: "work", outcome: "You scout the alleys and find a derelict warehouse — the roof leaks but the walls are solid. Together, you and Miri's group patch the worst holes, build fires, and create a hidden home. It's not much, but it's warm, dry, and safe from the sewer floods. Miri looks at you with fierce respect. 'You're the first adult who actually helped.'", stat_deltas: { stress: -15, willpower: 12, purity: 10 }, skill_deltas: { housekeeping: 5 }, completes_quest: true },
          { label: "Petition the Temple of Mara for sanctuary", intent: "social", outcome: "Jordan at the temple listens with growing concern. 'Children in the Ratway? Mara's heart weeps.' They arrange beds, food, and protection within the temple walls. When Miri and the children see the warm beds and the food, the smallest one starts crying. Miri puts a hand on your shoulder. 'You're alright, you know that?'", stat_deltas: { stress: -20, purity: 15, willpower: 8 }, completes_quest: true },
          { label: "Teach them to survive better — they're stronger than they know", intent: "work", outcome: "You teach them what you've learned: where to find food, how to stay warm, which adults to trust and which to avoid. Miri absorbs everything like a sponge. Within weeks, the Ratway camp is fortified, organized, and safer. They've become a family — and you're part of it.", stat_deltas: { stress: -10, willpower: 10, purity: 8 }, skill_deltas: { skulduggery: 3, foraging: 3 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Prison Story Arc ──────────────────────────────────────────────────────

  'prison_wrongful_arrest': {
    id: 'prison_wrongful_arrest',
    title: "Behind Bars",
    description: "Accused of a crime you didn't commit, you must survive Riften Jail and prove your innocence.",
    stages: [
      {
        stage: 1,
        condition: "Player notoriety >= 30 or skulduggery >= 20",
        narrative: "Guards seize you in broad daylight. 'You're under arrest for theft of Imperial property!' the captain barks, slamming you against a wall. You've never seen the stolen goods they wave in your face. 'Save it for the trial.' They drag you to Riften Jail — a stone nightmare of damp cells and brutal inmates. Warden Landry watches you enter with a reptilian smile. 'Fresh meat.'",
        choices: [
          { label: "Demand a fair trial", intent: "social", outcome: "The guard laughs. 'Trials are for nobles. You'll be sentenced by Landry's morning count.' But a thin, quiet voice from the next cell whispers: 'I can help you. I know who really stole those goods. But you'll have to trust me.'", stat_deltas: { stress: 25, willpower: 5, trauma: 5 }, next_stage: 2 },
          { label: "Try to escape during the transfer", intent: "stealth", outcome: "You spot an opening near the bridge. A quick twist of the wrist, a stumble, and you nearly break free — but a guard catches your collar. The beating is brief but brutal. They throw you into solitary. In the darkness, you plan.", stat_deltas: { pain: 15, stress: 20, stamina: -15, trauma: 5 }, skill_deltas: { skulduggery: 3 }, next_stage: 2 },
          { label: "Go quietly and observe", intent: "neutral", outcome: "You don't resist. In jail, survival requires information more than strength. You watch, you listen, you learn the routines. Landry checks cells at dawn and dusk. The night guard drinks. The east wall has a drainage grate. Knowledge is a key.", stat_deltas: { stress: 15, willpower: 8 }, next_stage: 2 }
        ]
      },
      {
        stage: 2,
        condition: "Imprisoned in stage 1",
        narrative: "The prisoner in the next cell is Sibbi Black-Briar — a nobleman imprisoned by his own family. 'The goods they planted on you? Maven Black-Briar arranged it. She needed a scapegoat.' He presses a folded note through the bars. 'This letter proves it — evidence of Maven's smuggling. Get this to the Jarl's steward and you're free.' But escaping Riften Jail is another matter entirely.",
        choices: [
          { label: "Bribe the night guard to look the other way", intent: "stealth", outcome: "The guard's price is steep, but the door swings open. You creep through dark corridors, past sleeping inmates, and out through the drainage grate into the cold night air. Freedom. The Jarl's steward reads Maven's letter with grim satisfaction. By morning, the charges are dropped. Maven's glare at the hearing could curdle milk.", stat_deltas: { stress: -25, willpower: 10, purity: 5 }, skill_deltas: { skulduggery: 5 }, completes_quest: true },
          { label: "Start a distraction and escape in the chaos", intent: "aggressive", outcome: "You bang on the bars until other inmates join in. When Landry storms in to restore order, you slip through the unlocked service door. Running through Riften's dark streets, you head straight for the Jarl. The evidence speaks for itself. You're cleared — and Landry faces questions about his prison's security.", stat_deltas: { stress: -15, willpower: 12, stamina: -10 }, skill_deltas: { athletics: 3, skulduggery: 3 }, completes_quest: true },
          { label: "Serve your time and clear your name legally", intent: "neutral", outcome: "You endure three weeks in jail. It's brutal — the cold, the food, the inmates. But you survive. When you're released, you take Sibbi's letter to the steward anyway. Justice is slow, but it comes. You walk out of the Jarl's keep exonerated, with something the streets can never give you: legitimacy.", stat_deltas: { stress: -10, willpower: 15, purity: 10, trauma: 5 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Sydney Faith Arc ──────────────────────────────────────────────────────

  'sydney_crisis_of_faith': {
    id: 'sydney_crisis_of_faith',
    title: "The Wavering Light",
    description: "Sydney's unshakeable faith begins to crack. What you say next will shape who they become.",
    stages: [
      {
        stage: 1,
        condition: "Sydney relationship >= 25 and day >= 20",
        narrative: "You find Sydney behind the temple library, sitting in the rain, crying. Their prayer book lies open and sodden in a puddle. 'I asked Mara to protect them,' Sydney whispers. 'The family in Dragonsreach — the mother, the two little girls. I prayed every night. And Mara did nothing. They're dead. Bandits.' Sydney looks at you with red, swollen eyes. 'What kind of goddess lets children die?'",
        choices: [
          { label: "Sit with them and listen", intent: "social", outcome: "You sit in the rain. Sydney talks — about faith, about doubt, about the unbearable cruelty of a world where prayers go unanswered. You don't have answers. You just listen. Sometimes that's enough.", stat_deltas: { stress: -5, willpower: 5, purity: 5 }, next_stage: 2 },
          { label: "Challenge their faith honestly", intent: "social", outcome: "'Maybe the gods aren't what you think they are.' Sydney flinches. 'Maybe they're not parents watching over us. Maybe they're something else — older, stranger. Maybe prayer isn't a request. Maybe it's just... talking into the dark, hoping something listens.' Sydney stares at you. 'That's the most terrifying thing anyone's ever said to me.'", stat_deltas: { willpower: 8, purity: -3 }, next_stage: 2 },
          { label: "Tell them faith will return in time", intent: "neutral", outcome: "'Doubt is part of belief, Sydney. You can't have light without darkness.' Sydney wipes their eyes. 'You sound like the temple mother.' A pause. 'But when she says it, I don't believe her. When you say it...' They trail off, looking at you with a vulnerability that makes your chest ache.", stat_deltas: { stress: -10, purity: 8 }, next_stage: 2 }
        ]
      },
      {
        stage: 2,
        condition: "Comforted Sydney in stage 1",
        narrative: "Over the following week, Sydney changes. They still attend temple, but the certainty is gone. They question sermons, argue gently with Jordan, and spend more time with you than with their prayer books. 'You make me think,' they confess one evening, walking home from the library. 'About everything I've been taught. About what I actually believe versus what I was told to believe.' They stop and face you. 'Am I losing myself? Or finding myself?'",
        choices: [
          { label: "Encourage them to find their own path", intent: "social", outcome: "'The Sydney who questions is stronger than the Sydney who just obeyed.' Their eyes fill with tears again — but this time, not of despair. Of relief. 'Thank you. For seeing me. The real me.' They squeeze your hand. The gesture is small. The meaning is not.", stat_deltas: { stress: -15, purity: 10, willpower: 8 }, completes_quest: true },
          { label: "Remind them that doubt and faith can coexist", intent: "social", outcome: "'You can question and still believe, Sydney. Blind faith isn't faith — it's obedience. Real faith survives doubt.' Sydney considers this, rolling the words over like prayer beads. 'A tested faith,' they murmur. 'Not inherited. Chosen.' A new light enters their eyes — not the old naive brightness, but something steadier, harder, and more real.", stat_deltas: { stress: -10, purity: 12, willpower: 10 }, completes_quest: true },
          { label: "Kiss them", intent: "social", outcome: "The moment stretches. Sydney's eyes widen. The space between you closes. The kiss is gentle, uncertain, tasting of rain and salt tears. When you part, Sydney touches their lips with trembling fingers. 'I've never...' They don't finish. They don't need to. Whatever this is, it's more honest than any prayer.", stat_deltas: { stress: -20, lust: 8, purity: -5, willpower: 5 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Museum Story Arc ──────────────────────────────────────────────────────

  'museum_dwemer_puzzle': {
    id: 'museum_dwemer_puzzle',
    title: "The Clockwork Riddle",
    description: "Winter discovers a Dwemer puzzle box that may unlock ancient secrets — or ancient dangers.",
    stages: [
      {
        stage: 1,
        condition: "Player has visited museum 3+ times and Winter relationship >= 15",
        narrative: "Winter is vibrating with excitement. 'Look at this!' They hold up a brass cube covered in interlocking gears. 'A Dwemer puzzle box! Found in a collapsed section of Avanchnzel! The configuration suggests it's a lock — but what does it open?' They look at you with shining eyes. 'I need someone with clever hands to help me solve it. The mechanisms are too small for my clumsy fingers.'",
        choices: [
          { label: "Help solve the puzzle carefully", intent: "education", outcome: "Hours pass. Your fingers ache from manipulating tiny gears, but piece by piece, the box reveals its secrets — clicking, whirring, mechanisms falling into place with the satisfaction of a key turning in a lock. The final gear aligns with a musical chime.", stat_deltas: { willpower: 10, stress: 5 }, skill_deltas: { skulduggery: 3, lore_mastery: 5 }, next_stage: 2 },
          { label: "Try forcing it open", intent: "aggressive", outcome: "Winter winces. 'Please, be careful, it's irreplac—' CRACK. A spring flies out and pings off the wall. Winter's face falls. 'Well... that's one way to do it.' But inside the cracked shell, something glows faintly blue. 'Aetherial crystal!' Winter breathes, all forgiveness.", stat_deltas: { stress: 10, willpower: 3 }, next_stage: 2 },
          { label: "Suggest asking Brynjolf's contacts", intent: "stealth", outcome: "Winter looks uncomfortable. 'I'd rather not involve... that element. But...' They concede. The Thieves Guild lockpick master opens the box in seconds flat. 'Dwemer — overengineered as always.' The contents gleam in the lantern light.", stat_deltas: { stress: 5, willpower: 5 }, skill_deltas: { skulduggery: 2 }, next_stage: 2 }
        ]
      },
      {
        stage: 2,
        condition: "Opened the puzzle box in stage 1",
        narrative: "Inside the box: a map etched on Dwemer metal, showing a hidden chamber beneath the museum itself. 'By the Divines,' Winter gasps. 'The museum was built on top of a Dwemer ruin! This map shows an entrance — here, in the basement!' Their hands tremble with archaeological fervor. 'We have to look. We HAVE to.'",
        choices: [
          { label: "Explore the hidden chamber together", intent: "stealth", outcome: "The basement wall pivots to reveal a spiral staircase descending into amber light. The Dwemer chamber is breathtaking — brass and crystal, gears still turning after millennia. In the centre, a functioning Dwemer automaton stands dormant, waiting. Winter is speechless with wonder. You've made the discovery of a lifetime.", stat_deltas: { stress: -15, willpower: 15, purity: 5 }, skill_deltas: { lore_mastery: 8 }, completes_quest: true },
          { label: "Advise caution — Dwemer ruins are dangerous", intent: "social", outcome: "'We should bring supplies, light, and maybe a guard,' you say. Winter nods reluctantly. The careful approach pays off — the staircase is rigged with a poison dart trap that Winter nearly triggers. 'You saved my life,' they say quietly. 'And probably the museum.' The chamber below is worth the wait.", stat_deltas: { stress: -10, willpower: 10, purity: 3 }, skill_deltas: { lore_mastery: 5, skulduggery: 3 }, completes_quest: true },
          { label: "Keep the discovery secret — it could be dangerous", intent: "neutral", outcome: "'Not everything should be found, Winter.' They look crestfallen, but you explain the risk: Dwemer ruins attract thieves, scholars, and worse. Winter agrees to seal the entrance and study the map privately. 'You're right. But promise me — when we're ready, we explore it together.' You promise.", stat_deltas: { stress: -5, willpower: 8, purity: 5 }, completes_quest: true }
        ]
      }
    ]
  },

  // ── Café Story Arc ────────────────────────────────────────────────────────

  'cafe_sams_past': {
    id: 'cafe_sams_past',
    title: "The Baker's Secret",
    description: "Sam's café hides a history as complicated as the pastry recipes.",
    stages: [
      {
        stage: 1,
        condition: "Sam relationship >= 25 and day >= 15",
        narrative: "It's after closing. Sam is wiping tables with a faraway look. An untouched letter sits on the counter — the handwriting elegant, the seal broken. When they notice you, they quickly tuck it away, but not before you see the tremor in their hands. 'Just some old business,' Sam says with a forced smile. 'Nothing to worry about.' But their eyes are red, and the café smells of burned pastry — Sam never burns anything.",
        choices: [
          { label: "Ask if they want to talk about it", intent: "social", outcome: "Sam's composure cracks. 'I had a life before this café. A different name, a different city. Someone I loved.' They sit down heavily. 'That letter? It says they found me.' For the first time, you see fear in the kindest person you know.", stat_deltas: { stress: 5, willpower: 5 }, next_stage: 2 },
          { label: "Help clean up — give them space", intent: "neutral", outcome: "You pick up a cloth and start wiping tables. Sam watches you, then joins, and you work in companionable silence. After a while, Sam speaks. 'You're a good kid, you know that? You don't push. Not everyone has that grace.' They look at the tucked-away letter. 'Maybe someday I'll tell you about it.'", stat_deltas: { stress: -10, purity: 5 }, next_stage: 2 },
          { label: "Pretend you didn't see the letter", intent: "neutral", outcome: "You chat about the weather, the pastries, the new recipe Sam is trying. Normal things. Safe things. Sam's shoulders gradually uncoil. 'Thank you,' they say at the door. 'For just being... normal. Tonight, I needed normal.' They lock up behind you, and the shadow in their eyes eases — but doesn't disappear.", stat_deltas: { stress: -5, purity: 3 } }
        ]
      },
      {
        stage: 2,
        condition: "Connected with Sam in stage 1",
        narrative: "Sam trusts you with the truth: before the café, they were a talented alchemist in Windhelm, married to a member of the Stormcloak elite. When Sam discovered their spouse was funding a skooma trafficking ring, they stole the evidence and fled. The letter means their past has caught up. 'They're sending someone. I need to disappear again, or...' Sam looks at the café — their life's work. 'I can't lose this place. Not again.'",
        choices: [
          { label: "Help Sam prepare to defend themselves", intent: "aggressive", outcome: "You reinforce the café doors, set up signals with neighbouring shops, and convince a few trustworthy guards to increase patrols. When the Stormcloak enforcers arrive, they find Sam flanked by friends, not alone. The enforcers leave empty-handed. Sam's hands shake for hours afterward, but the café stands. 'I've been running for years,' Sam says. 'I think I'm done running.'", stat_deltas: { stress: -15, willpower: 12, purity: 8 }, completes_quest: true },
          { label: "Take the evidence to the Jarl's steward", intent: "social", outcome: "The evidence of skooma trafficking earns the steward's full attention. Within days, the Stormcloak connection is severed, warrants are issued, and Sam receives official protection. 'I never thought the system would help someone like me,' Sam says, crying freely. 'You believed it would, and that was enough.'", stat_deltas: { stress: -20, willpower: 10, purity: 12 }, completes_quest: true },
          { label: "Offer to create a new identity for them", intent: "stealth", outcome: "You know people. Brynjolf's contacts can forge documents that would pass any inspection. Sam becomes officially dead in Windhelm and reborn in Riften. The café's ownership transfers to the new name seamlessly. 'A new life, built on your kindness and a criminal's craft,' Sam laughs. 'I suppose that's Riften for you.'", stat_deltas: { stress: -10, willpower: 8, corruption: 3 }, skill_deltas: { skulduggery: 3 }, completes_quest: true }
        ]
      }
    ]
  }
};
