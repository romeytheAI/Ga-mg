import { Quest } from '../core/types';

export const ES_QUESTS: Record<string, Quest> = {
  // -- MAIN STORYLINES --

  'q_es2_bloodmoon_prophecy': {
    id: 'q_es2_bloodmoon_prophecy',
    title: 'The Bloodmoon Prophecy',
    type: 'main',
    chapter: 2,
    status: 'locked',
    description: "Vaermina's nightmare cult has taken root in the Rift. People sleep but never wake, their minds trapped in endless terror. The cult's influence spreads like a disease, and the only way to stop it is to confront the source of the nightmares at the goddess's own shrine.",
    objectives: [
      { id: 'obj_investigate_nightmares', description: 'Investigate the nightmare plague at the Temple of Kynareth', completed: false },
      { id: 'obj_infiltrate_cult', description: 'Infiltrate Vaermina\'s cult meeting at midnight', completed: false, count: 0, required_count: 1 },
      { id: 'obj_retrieve_dreamstone', description: 'Retrieve the Dreamstone of Vaermina from her shrine', completed: false },
      { id: 'obj_counter_ritual', description: 'Perform the counter-ritual to break the nightmare curse', completed: false },
    ],
    rewards: {
      xp: 300,
      items: ['dreamstone_amulet'],
      skills: { willpower: 10 },
    },
    prerequisites: ['q_ch1_orphans_cage'],
  },

  'q_es3_shadows_of_malacath': {
    id: 'q_es3_shadows_of_malacath',
    title: 'Shadows of Malacath',
    type: 'main',
    chapter: 3,
    status: 'locked',
    description: "An Orcish outcast tribe, devoted to Malacath, has been attacking caravans near Kynesgrove. Their chieftain believes the Empire has forgotten their people and seeks vengeance through blood. You must find their stronghold, recover stolen goods, and face the chieftain in trial by combat to end the raids.",
    objectives: [
      { id: 'obj_find_orc_chief', description: 'Find the Malacath-worshipping orc chieftain', completed: false },
      { id: 'obj_retrieve_artifacts', description: 'Retrieve stolen caravan artifacts from the stronghold', completed: false, count: 0, required_count: 3 },
      { id: 'obj_trial_by_combat', description: 'Face the chieftain in trial by combat', completed: false },
    ],
    rewards: {
      xp: 350,
      gold: 100,
      feats: ['malacaths_blessing'],
    },
    prerequisites: ['q_ch2_survive_streets'],
  },

  'q_es4_dwemer_echoes': {
    id: 'q_es4_dwemer_echoes',
    title: 'Dwemer Echoes',
    type: 'main',
    chapter: 4,
    status: 'locked',
    description: "Ancient Dwemer automata have begun awakening in the deep ruins near the entrance to Nchardak. Something is triggering the dormant machinery, and tonal echoes from thousands of years ago are bleeding back into the present. You must find the control rod, decipher the tonal lock, and decide the fate of this impossible technology.",
    objectives: [
      { id: 'obj_find_control_rod', description: 'Find the Dwemer control rod in the lower chambers', completed: false },
      { id: 'obj_decipher_tonal_lock', description: 'Decipher the tonal lock puzzle using Dwemer resonance', completed: false },
      { id: 'obj_activate_cogitorium', description: 'Activate the central cogitorium', completed: false },
      { id: 'obj_decide_dwemer_fate', description: 'Decide: salvage the tech or re-seal the ruins forever', completed: false },
    ],
    rewards: {
      xp: 400,
      items: ['dwemer_bronze_sword','dwemer_gyro_core'],
      feats: ['dwemer_scholar'],
    },
    prerequisites: ['q_ch3_first_honest_work'],
  },

  'q_es5_sanguine_carnival': {
    id: 'q_es5_sanguine_carnival',
    title: 'Sanguine\'s Carnival',
    type: 'main',
    chapter: 5,
    status: 'locked',
    description: "A mysterious carnival has appeared overnight on the edge of Riften. Its attractions are intoxicating, its performers impossibly captivating. At the center of it all stands Sanguine, Daedric Prince of Debauchery, offering you a choice: resist temptation and remain pure, or indulge and embrace the darker pleasures of the flesh.",
    objectives: [
      { id: 'obj_receive_invitation', description: 'Receive the mysterious carnival invitation', completed: false },
      { id: 'obj_survive_temptation', description: 'Survive the night of temptation at the carnival', completed: false },
      { id: 'obj_carnival_choice', description: 'Choose: accept Sanguine\'s gift or reject it', completed: false },
    ],
    rewards: {
      xp: 250,
      feats: ['sanguines_favor_or_pure_resistance'],
    },
    prerequisites: ['q_ch3_first_honest_work'],
  },

  'q_es6_blades_reborn': {
    id: 'q_es6_blades_reborn',
    title: 'The Blades Reborn',
    type: 'main',
    chapter: 6,
    status: 'locked',
    description: "A coded message arrives from a man calling himself Esbern, lorekeeper of the Blades. Dragons have returned to the skies, and he believes you may be the one prophesied to stop them. Delphine, Grandmaster of the Blades, wants to recruit you -- but first you must prove yourself worthy in dragon combat and swear the ancient oath at Sky Haven Temple.",
    objectives: [
      { id: 'obj_find_esbern', description: 'Find Esbern hiding in the Ratway', completed: false },
      { id: 'obj_prove_dragon_combat', description: 'Prove yourself in dragon combat', completed: false },
      { id: 'obj_swear_blades_oath', description: 'Swear the Blades oath at Sky Haven Temple', completed: false },
    ],
    rewards: {
      xp: 500,
      gold: 100,
      items: ['blades_uniform'],
      feats: ['dragonslayer'],
    },
    prerequisites: ['q_ch4_thieves_guild'],
  },

  'q_es7_heretiks_call': {
    id: 'q_es7_heretiks_call',
    title: 'The Heretic\'s Call',
    type: 'main',
    chapter: 7,
    status: 'locked',
    description: "Boethiah, Daedric Prince of Conspiracy and Deceit, has called for a champion. Cultists roam the roads, seeking worthy aspirants for the Pillar of Sacrifice. You have been chosen -- but so have others. Only one can stand before Boethiah and claim the Ebony Mail. The price: betrayal, blood, and the willingness to kill those who trust you.",
    objectives: [
      { id: 'obj_read_proving', description: 'Read Boethiah\'s Proving and accept the call', completed: false },
      { id: 'obj_defeat_aspirants', description: 'Defeat rival aspirants at the sacrificial pillar', completed: false, count: 0, required_count: 3 },
      { id: 'obj_boethiah_trial', description: 'Survive Boethiah\'s trial by combat', completed: false },
    ],
    rewards: {
      xp: 450,
      items: ['ebony_mail_or_goldbrand'],
      feats: ['boethiahs_champion'],
    },
    prerequisites: ['q_ch5_hidden_depths'],
  },

  'q_es8_miraaks_whispers': {
    id: 'q_es8_miraaks_whispers',
    title: 'Miraak\'s Whispers',
    type: 'main',
    chapter: 8,
    status: 'locked',
    description: "Whispers from Solstheim have begun bleeding into your dreams. Miraak, the first Dragon Priest and traitor to dragonkind, is reaching across the void. Black Books -- portals to Hermaeus Mora's realm of Apocrypha -- are appearing in ruins across Skyrim. Something ancient stirs, and only you can enter Apocrypha, solve Mora's riddles, and reject Miraak's bargain.",
    objectives: [
      { id: 'obj_investigate_whispers', description: 'Investigate the whispering ruins', completed: false },
      { id: 'obj_enter_apocrypha', description: 'Enter Apocrypha through a Black Book', completed: false },
      { id: 'obj_solve_mora_riddle', description: 'Solve Hermaeus Mora\'s impossible riddle', completed: false },
      { id: 'obj_reject_miraak', description: 'Reject Miraak\'s bargain and claim your own path', completed: false },
    ],
    rewards: {
      xp: 550,
      skills: { magic: 15 },
    },
    prerequisites: ['q_es6_blades_reborn'],
  },

  // -- SIDE QUESTS --

  'q_es_side_maigq': {
    id: 'q_es_side_maigq',
    title: "M'aiq's Truth",
    type: 'side',
    status: 'locked',
    description: "M'aiq the Liar has appeared near the crossroads, as he does every so often. But this time, his cryptic rambling seems to point toward an actual hidden treasure somewhere in Skyrim. Follow his trail of nonsense -- one piece at a time -- and see if truth lies beneath the madness.",
    objectives: [
      { id: 'obj_find_maigq', description: 'Find M\'aiq at the crossroads', completed: false },
      { id: 'obj_decode_clue_one', description: 'Decode M\'aiq\'s first clue', completed: false },
      { id: 'obj_decode_clue_two', description: 'Decode M\'aiq\'s second clue', completed: false },
      { id: 'obj_find_treasure', description: 'Find the hidden treasure', completed: false },
    ],
    rewards: { gold: 75, xp: 80 },
    prerequisites: [],
  },

  'q_es_side_broken_blade': {
    id: 'q_es_side_broken_blade',
    title: 'The Broken Blade',
    type: 'side',
    status: 'locked',
    description: "A wounded traveler lies in the road, begging for help. Their armor bears no house colors, their face hidden beneath a dented helm. If you heal them, their identity -- and their enemies -- may come looking.",
    objectives: [
      { id: 'obj_heal_traveler', description: 'Heal the wounded traveler', completed: false },
      { id: 'obj_reveal_identity', description: 'Learn the traveler\'s true identity', completed: false },
      { id: 'obj_defend_traveler', description: 'Defend the traveler from their pursuers', completed: false },
    ],
    rewards: { gold: 50, xp: 90 },
    prerequisites: [],
  },

  'q_es_side_argonian_alchemist': {
    id: 'q_es_side_argonian_alchemist',
    title: "Swamp-Sugar",
    type: 'side',
    status: 'locked',
    description: "An Argonian alchemist in the marketplace needs a rare variant of moon-sugar that only grows in the deepest reaches of the Hjaalmarch swamp. The pay is good, but the swamp has teeth -- and something worse than teeth.",
    objectives: [
      { id: 'obj_find_moonsugar', description: 'Find 3 wild moon-sugar plants in the swamp', completed: false, count: 0, required_count: 3 },
      { id: 'obj_deliver_to_alchemist', description: 'Deliver the moon-sugar to the alchemist', completed: false },
    ],
    rewards: { gold: 30, xp: 60, skills: { foraging: 5 } },
    prerequisites: [],
  },

  'q_es_side_skeever_swarm': {
    id: 'q_es_side_skeever_swarm',
    title: 'The Ratway Plague',
    type: 'side',
    status: 'locked',
    description: "Giant skeevers have overrun the Ratway's lower levels, threatening the Ragged Flagon itself. Vex is offering good coin to anyone brave enough -- or stupid enough -- to clear them out.",
    objectives: [
      { id: 'obj_kill_skeever_queen', description: 'Find and kill the skeever queen', completed: false },
      { id: 'obj_clear_nests', description: 'Destroy 3 skeever nests', completed: false, count: 0, required_count: 3 },
    ],
    rewards: { gold: 40, xp: 75 },
    prerequisites: ['q_ch4_thieves_guild'],
  },

  'q_es_side_bard_test': {
    id: 'q_es_side_bard_test',
    title: 'The Bards\''Test',
    type: 'side',
    status: 'locked',
    description: "The Bards College in Solitude needs someone to test a newly discovered lute of Dwemer make. It produces sounds no mortal instrument should. They promise a generous reward -- if you survive the experience.",
    objectives: [
      { id: 'obj_test_instrument', description: 'Play the Dwemer lute for one hour', completed: false },
      { id: 'obj_report_effects', description: 'Report the instrument\'s effects to the College', completed: false },
    ],
    rewards: { gold: 35, xp: 65, skills: { dancing: 5 } },
    prerequisites: [],
  },

  'q_es_side_sympathetic_mage': {
    id: 'q_es_side_sympathetic_mage',
    title: 'The Sympathetic Mage',
    type: 'side',
    status: 'locked',
    description: "A kind-eyed mage from the College of Winterhold offers to train you -- but their research requires rare ingredients found only in dangerous places. The more you gather, the more advanced the lessons become.",
    objectives: [
      { id: 'obj_gather_ingredients', description: 'Gather 5 rare magical ingredients', completed: false, count: 0, required_count: 5 },
      { id: 'obj_first_lesson', description: 'Complete your first magic lesson', completed: false },
      { id: 'obj_second_lesson', description: 'Complete your second magic lesson', completed: false },
    ],
    rewards: { xp: 100, skills: { magic: 10, foraging: 5 } },
    prerequisites: [],
  },

  'q_es_side_wise_woman': {
    id: 'q_es_side_wise_woman',
    title: 'The Hagraven\'s Price',
    type: 'side',
    status: 'locked',
    description: "A hagraven in the deep forest offers ancient wisdom -- but every vision demands a terrible price. Something precious. Something you cannot get back. The knowledge she offers could change your life forever.",
    objectives: [
      { id: 'obj_meet_hagraven', description: 'Travel to the hagraven\'s clearing', completed: false },
      { id: 'obj_choose_price', description: 'Choose what to sacrifice for her wisdom', completed: false },
      { id: 'obj_react_vision', description: 'Process the vision\'s revelation', completed: false },
    ],
    rewards: { xp: 130 },
    prerequisites: [],
  },

  'q_es_side_mercenary_contract': {
    id: 'q_es_side_mercenary_contract',
    title: 'Bait and Switch',
    type: 'side',
    status: 'locked',
    description: "A grizzled sellsword hires you to act as bait for a bandit ambush he's been tracking. He promises to swoop in and save the day -- and share the bounty. But can you trust a man who makes his living by the sword?",
    objectives: [
      { id: 'obj_accept_contract', description: 'Accept the mercenary\'s contract', completed: false },
      { id: 'obj_survive_ambush', description: 'Survive the bandit ambush', completed: false },
      { id: 'obj_split_bounty', description: 'Collect your share of the bounty', completed: false },
    ],
    rewards: { gold: 45, xp: 70 },
    prerequisites: [],
  },

  'q_es_side_carriage_mystery': {
    id: 'q_es_side_carriage_mystery',
    title: 'The Wrong Turn',
    type: 'side',
    status: 'locked',
    description: "A cheerful carriage driver offers you a free ride to Whiterun. The road, however, takes an unexpected turn -- one that leads to nowhere on any map. The driver smiles. \"Always wanted company for this trip,\" they say.",
    objectives: [
      { id: 'obj_ride_carriage', description: 'Accept the carriage driver\'s offer', completed: false },
      { id: 'obj_discover_destination', description: 'Discover where the road truly leads', completed: false },
      { id: 'obj_return_safely', description: 'Find your way back to civilization', completed: false },
    ],
    rewards: { gold: 20, xp: 60, items: ['mysterious_token'] },
    prerequisites: [],
  },

  'q_es_side_night_terror': {
    id: 'q_es_side_night_terror',
    title: 'Waking Nightmare',
    type: 'side',
    status: 'locked',
    description: "Vaermina's nightmare has followed you from dreams into the waking world. Shadows move on their own. Voices speak from empty rooms. Find her shrine and perform the ritual to banish the horror -- before it drives you mad.",
    objectives: [
      { id: 'obj_find_vaermina_shrine', description: 'Locate Vaermina\'s hidden shrine', completed: false },
      { id: 'obj_banish_nightmare', description: 'Perform the banishment ritual', completed: false },
    ],
    rewards: { xp: 90, skills: { willpower: 5 } },
    prerequisites: [],
  },

  'q_es_side_lost_caravan': {
    id: 'q_es_side_lost_caravan',
    title: 'Dust and Bone',
    type: 'side',
    status: 'locked',
    description: "A merchant caravan vanished on the road between Riften and Windhelm. The merchant's family is desperate for answers. Search the tundra -- you may find survivors, or you may find only bones.",
    objectives: [
      { id: 'obj_search_tundra', description: 'Search the tundra for the lost caravan', completed: false },
      { id: 'obj_find_survivors_or_bodies', description: 'Find survivors or recover the bodies', completed: false },
      { id: 'obj_report_findings', description: 'Report your findings to the merchant\'s family', completed: false },
    ],
    rewards: { gold: 50, xp: 85 },
    prerequisites: [],
  },
};
