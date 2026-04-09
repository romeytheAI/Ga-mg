import { GameState } from '../../types';
import { PREDEFINED_ANATOMIES } from '../../constants';

export interface EncounterVariant {
  id: string;
  outcome: string;
  stat_deltas: Record<string, number>;
  new_items?: string[];
  new_location?: string;
}

export interface EncounterCondition {
  (state: GameState): boolean;
}

export interface ESEncounterExpanded {
  id: string;
  title: string;
  description: string;
  condition: EncounterCondition;
  anatomy: string;
  image_url: string;
  story_event?: string;
  outcomes: EncounterVariant[];
}

export const ES_ENCOUNTER_VARIANTS: Record<string, EncounterVariant[]> = {
  es_encounter_thug: [
    { id: 'thug_fight', outcome: 'You fight off the thug, taking a few hits but emerging victorious.', stat_deltas: { health: -15, gold: 10, corruption: 2 } },
    { id: 'thug_bribe', outcome: 'You pay the thug to leave you alone. He laughs and walks away.', stat_deltas: { gold: -20, corruption: 1 } },
    { id: 'thug_flee', outcome: 'You run, your heart pounding. The thug shouts insults but doesn\'t follow.', stat_deltas: { stress: 10, willpower: 2 } },
    { id: 'thug_charm', outcome: 'Your words and charm convince him you\'re not worth the trouble.', stat_deltas: { relationship: 5, willpower: 3 } }
  ],
  es_encounter_noble: [
    { id: 'noble_bow', outcome: 'You bow respectfully. The noble nods, impressed by your manners.', stat_deltas: { relationship: 10 } },
    { id: 'noble_ignore', outcome: 'You walk past, avoiding eye contact. The noble sneers but moves on.', stat_deltas: { relationship: -2 } },
    { id: 'noble_flirt', outcome: 'You engage the noble in conversation. They seem intrigued by you.', stat_deltas: { romance: 5, corruption: 3 } },
    { id: 'noble_threat', outcome: 'You confront the noble. They call guards. You retreat quickly.', stat_deltas: { stress: 10, relationship: -10 } }
  ],
  es_encounter_craft: [
    { id: 'craft_success', outcome: 'Your skill produces excellent results. The craftsman is impressed.', stat_deltas: { skills: { crafting: 5 }, gold: 25 } },
    { id: 'craft_fail', outcome: 'Your attempt fails, wasting materials. The craftsman shakes his head.', stat_deltas: { gold: -10, skills: { crafting: 1 } } },
    { id: 'craft_learn', outcome: 'You watch and learn. The craftsman doesn\'t notice, but you do.', stat_deltas: { skills: { crafting: 3 } } }
  ],
  es_encounter_fisher: [
    { id: 'fish_success', outcome: 'You catch a fine fish. A good day on the water.', stat_deltas: { health: 5, gold: 15 } },
    { id: 'fish_nothing', outcome: 'The fish aren\'t biting. You spend hours for nothing.', stat_deltas: { stress: 5 } },
    { id: 'fish_rare', outcome: 'You pull up something strange — an old coin, a ring, a message in a bottle.', stat_deltas: { gold: 50, corruption: 2 } }
  ],
  es_encounter_daedra: [
    { id: 'daedra_fight', outcome: 'You battle the creature, barely surviving. It vanishes into shadow.', stat_deltas: { health: -30, corruption: 10, skills: { combat: 5 } } },
    { id: 'daedra_offer', outcome: 'You offer something in exchange for your life. The creature accepts and leaves.', stat_deltas: { corruption: 20, gold: -50 } },
    { id: 'daedra_pray', outcome: 'You pray to the Divines. Light drives the creature back. You survive.', stat_deltas: { willpower: 10, corruption: -5 } }
  ],
  es_encounter_dunmer_refugee: [
    { id: 'dunmer_help', outcome: 'You give the refugee food and coin. They thank you with tears.', stat_deltas: { gold: -15, relationship: 10, willpower: 5 } },
    { id: 'dunmer_ignore', outcome: 'You walk past. They are everywhere, after all. Can\'t help them all.', stat_deltas: { corruption: 2 } },
    { id: 'dunmer_rob', outcome: 'In their weakened state, they are easy pickings. You take what they have.', stat_deltas: { gold: 20, corruption: 15, relationship: -10 } }
  ],
  es_encounter_stormcloak: [
    { id: 'stormcloak_join', outcome: 'You express sympathy for their cause. They accept you as a friend.', stat_deltas: { relationship: 10, corruption: 5 } },
    { id: 'stormcloak_fight', outcome: 'You argue and it comes to blows. You defeat them but make enemies.', stat_deltas: { health: -10, relationship: -15 } },
    { id: 'stormcloak_report', outcome: 'You report the rebels to the Imperial garrison. They reward you.', stat_deltas: { gold: 30, relationship: 5, corruption: -5 } }
  ],
  es_encounter_imperial: [
    { id: 'imperial_bribe', outcome: 'You slip coins to the soldier. He looks the other way.', stat_deltas: { gold: -20, corruption: 5 } },
    { id: 'imperial_honest', outcome: 'You answer honestly. The soldier nods and lets you pass.', stat_deltas: { relationship: 5 } },
    { id: 'imperial_resist', outcome: 'You refuse to cooperate. They detain you for questioning.', stat_deltas: { stress: 15, corruption: 3 } }
  ],
  es_encounter_khajiit_trader: [
    { id: 'khajiit_trade', outcome: 'You buy exotic goods. The Khajiit smiles, closing the deal.', stat_deltas: { gold: -40, corruption: 3 } },
    { id: 'khajiit_info', outcome: 'You ask about news. The trader tells you of a shipment coming in.', stat_deltas: { relationship: 5, corruption: 2 } },
    { id: 'khajiit_illegal', outcome: 'You ask about skooma. The trader has some. You make a purchase.', stat_deltas: { corruption: 15, addiction: 3 } }
  ],
  es_encounter_bard: [
    { id: 'bard_listen', outcome: 'The music moves you. You drop a coin in the hat, feeling something.', stat_deltas: { stress: -10, willpower: 3 } },
    { id: 'bard_join', outcome: 'You sing along. The crowd loves it. You feel alive.', stat_deltas: { romance: 5, stress: -15 } },
    { id: 'bard_ignore', outcome: 'You walk past. The music is just noise to you.', stat_deltas: {} }
  ],
  es_encounter_wolf: [
    { id: 'wolf_fight', outcome: 'The wolf attacks. You kill it, but not before it wounds you.', stat_deltas: { health: -20, skills: { combat: 3 } } },
    { id: 'wolf_flee', outcome: 'You run. The wolf chases but you escape into a town.', stat_deltas: { stress: 10 } },
    { id: 'wolf_calm', outcome: 'You sing a song your mother taught you. The wolf stops, then runs away.', stat_deltas: { willpower: 5, skills: { animals: 3 } } }
  ],
  es_encounter_bandit_camp: [
    { id: 'bandit_raid', outcome: 'You attack, taking them by surprise. The camp is yours.', stat_deltas: { gold: 100, corruption: 10, skills: { combat: 5 } } },
    { id: 'bandit_join', outcome: 'You offer to join. They accept. You\'ve become a bandit.', stat_deltas: { corruption: 20, relationship: 10 } },
    { id: 'bandit_negotiate', outcome: 'You talk them into letting you pass safely. They agree.', stat_deltas: { relationship: 5, corruption: 3 } }
  ],
  es_encounter_witch: [
    { id: 'witch_fight', outcome: 'You attack the witch. Her magic is stronger than you expected.', stat_deltas: { health: -25, skills: { magic: 2 } } },
    { id: 'witch_bargain', outcome: 'You make a deal. She gives you a potion, takes something from you.', stat_deltas: { corruption: 15, gold: -30 } },
    { id: 'witch_flee', outcome: 'You run before she can cast her spells. Escaped, but afraid.', stat_deltas: { stress: 15, willpower: 3 } }
  ],
  es_encounter_lost_traveler: [
    { id: 'traveler_help', outcome: 'You guide them to town. They thank you warmly.', stat_deltas: { relationship: 10, gold: 10 } },
    { id: 'traveler_rob', outcome: 'They have supplies you need. You take them. They weep.', stat_deltas: { gold: 25, corruption: 10, relationship: -15 } },
    { id: 'traveler_ignore', outcome: 'You can\'t be bothered. You walk away.', stat_deltas: { corruption: 2 } }
  ]
};

export const ES_ENCOUNTERS_EXPANDED: ESEncounterExpanded[] = [
  {
    id: 'es_enc_werewolf',
    title: 'Werewolf Attack',
    description: 'A massive wolf-like creature emerges from the shadows. Its eyes glow yellow and its jaws drip saliva.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.1,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'were_fight', outcome: 'The creature lunges! You fight with desperate strength, barely surviving its assault.', stat_deltas: { health: -30, corruption: 10, skills: { combat: 10 } } },
      { id: 'were_transform', outcome: 'Something in you responds to the beast. You feel your body... changing.', stat_deltas: { corruption: 30, transformation: 1 } },
      { id: 'were_flee', outcome: 'You run! The creature gives chase but you manage to lose it in the trees.', stat_deltas: { stress: 20 } },
      { id: 'were_aid', outcome: 'You sing to the beast, calming it. It whimpers and runs into the darkness.', stat_deltas: { willpower: 10 } }
    ]
  },
  {
    id: 'es_enc_vampire',
    title: 'Vampire Ambush',
    description: 'A pale figure with red eyes and sharp fangs emerges from the dark. "Your blood smells... delicious."',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night',
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'vamp_fight', outcome: 'You fight the vampire! Sunlight and steel burn it, but not before it strikes.', stat_deltas: { health: -20, corruption: 15 } },
      { id: 'vamp_bite', outcome: 'The vampire strikes! Pain flares as its fangs pierce your neck. Cold spreads.', stat_deltas: { corruption: 50, disease: 'vampirism', health: -30 } },
      { id: 'vamp_bargain', outcome: 'You offer something in exchange. The vampire laughs but accepts.', stat_deltas: { corruption: 25, gold: -50 } },
      { id: 'vamp_holy', outcome: 'You invoke the Divines! Light burns the creature away. You survive.', stat_deltas: { willpower: 15, corruption: -10 } }
    ]
  },
  {
    id: 'es_enc_thalmor',
    title: 'Thalmor Patrol',
    description: 'Two high elves in golden armor patrol the road. Their eyes scan for contraband — or heretics.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'day',
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
    outcomes: [
      { id: 'thalmor_pass', outcome: 'You bow and show your papers. They wave you through with disdain.', stat_deltas: { stress: 5 } },
      { id: 'thalmor_interrogate', outcome: 'They question you for hours. About Talos, about your beliefs, your family.', stat_deltas: { stress: 20, relationship: -5 } },
      { id: 'thalmor_bribe', outcome: 'You slip gold into their palm. They pretend to not see you.', stat_deltas: { gold: -30, corruption: 10 } },
      { id: 'thalmor_fight', outcome: 'You attack! Their magic is strong but you fight with fury.', stat_deltas: { health: -25, corruption: 15, skills: { combat: 5 } } }
    ]
  },
  {
    id: 'es_enc_imperial',
    title: 'Imperial Checkpoint',
    description: 'Imperial soldiers have set up a checkpoint. They search everyone for contraband and Stormcloak sympathizers.',
    condition: (state) => state.location === 'riften_outskirts',
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800',
    outcomes: [
      { id: 'imp_cooperate', outcome: 'You cooperate fully. They find nothing and let you pass.', stat_deltas: {} },
      { id: 'imp_bribe', outcome: 'You quietly offer gold. The soldier looks the other way.', stat_deltas: { gold: -20, corruption: 5 } },
      { id: 'imp_fight', outcome: 'You attack! The Imperials call for backup. You have to run.', stat_deltas: { health: -15, corruption: 10 } },
      { id: 'imp_lie', outcome: 'You lie about your allegiances. They believe you... for now.', stat_deltas: { corruption: 3 } }
    ]
  },
  {
    id: 'es_enc_daedric_artifact',
    title: 'Daedric Artifact Discovery',
    description: 'You find an ancient artifact glowing with dark power. Its presence hums in your mind.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.05,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=800',
    outcomes: [
      { id: 'daed_take', outcome: 'You take the artifact. Power surges through you — overwhelming, addictive.', stat_deltas: { corruption: 25, skills: { magic: 10 } } },
      { id: 'daed_destroy', outcome: 'You smash the artifact! Light explodes and fades. The evil is gone.', stat_deltas: { willpower: 15 } },
      { id: 'daed_research', outcome: 'You study it carefully, documenting everything. Knowledge is power.', stat_deltas: { skills: { magic: 5 } } },
      { id: 'daed_ignore', outcome: 'You leave it where it lies. Some things should stay hidden.', stat_deltas: { willpower: 5 } }
    ]
  },
  {
    id: 'es_enc_necromancer',
    title: 'Necromancer Ritual',
    description: 'A robed figure raises their hands over a corpse. Skeletal fingers begin to twitch.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.08,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800',
    outcomes: [
      { id: 'necro_interrupt', outcome: 'You attack! The ritual fails, the corpse collapses. The necromancer flees.', stat_deltas: { skills: { magic: 5, combat: 3 }, corruption: 5 } },
      { id: 'necro_watch', outcome: 'You watch from hiding. A skeleton rises... then another. The army grows.', stat_deltas: { stress: 20, corruption: 10 } },
      { id: 'necro_join', outcome: 'You approach. The necromancer smiles. "Another initiate?"', stat_deltas: { corruption: 20, skills: { magic: 5 } } },
      { id: 'necro_report', outcome: 'You run to find the Companions. They deal with this evil properly.', stat_deltas: { relationship: 10, willpower: 5 } }
    ]
  },
  {
    id: 'es_enc_ghost',
    title: 'Ghost Encounter',
    description: 'A spectral figure floats before you, translucent and weeping. It seems to want something.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'midnight',
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'ghost_listen', outcome: 'The ghost speaks of a buried secret. It wants justice.', stat_deltas: { relationship: 5, skills: { magic: 3 } } },
      { id: 'ghost_comfort', outcome: 'You offer kind words. The ghost fades peacefully.', stat_deltas: { willpower: 10 } },
      { id: 'ghost_attack', outcome: 'You strike at the spirit! It shrieks and attacks in fury.', stat_deltas: { health: -15, corruption: 5 } },
      { id: 'ghost_flee', outcome: 'You run. The ghost\'s wails follow you for miles.', stat_deltas: { stress: 15 } }
    ]
  },
  {
    id: 'es_enc_frost_troll',
    title: 'Frost Troll',
    description: 'A massive creature of ice and fury blocks the path. It roars, shaking the trees.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.07,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'troll_fight', outcome: 'The battle is brutal. The troll is strong but you are stronger.', stat_deltas: { health: -35, skills: { combat: 15 } } },
      { id: 'troll_flee', outcome: 'No shame in surviving. You run while you can.', stat_deltas: { stress: 10 } },
      { id: 'troll_fire', outcome: 'Fire! The creature hates it! You burn your way to safety.', stat_deltas: { skills: { magic: 5 }, corruption: 3 } },
      { id: 'troll_offer', outcome: 'You offer food. The troll takes it and settles. Pass granted.', stat_deltas: { gold: -20, relationship: 5 } }
    ]
  },
  {
    id: 'es_enc_giant',
    title: 'Giant Camp',
    description: 'A giant tendu walks among mammoths. It notices you. Does it see prey or visitor?',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.06,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'giant_fight', outcome: 'You fight the giant! It throws a boulder, you strike where you can.', stat_deltas: { health: -30, skills: { combat: 10 } } },
      { id: 'giant_peace', outcome: 'You approach slowly, hands open. The giant grunts, allows you to pass.', stat_deltas: { relationship: 10, willpower: 5 } },
      { id: 'giant_stealth', outcome: 'You sneak past, barely avoiding detection. The mammoths are huge.', stat_deltas: { skills: { stealth: 5 }, corruption: 2 } },
      { id: 'giant_offer', outcome: 'You offer a gift. The giant grunts, tosses you something in return.', stat_deltas: { gold: 50, relationship: 5 } }
    ]
  },
  {
    id: 'es_enc_mammoth',
    title: 'Mammoth Herd',
    description: 'A herd of mammoths crosses the road. They are massive, dangerous, and in your way.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.08,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'mammoth_wait', outcome: 'You wait for them to pass. Takes hours but it\'s safe.', stat_deltas: { stress: 5 } },
      { id: 'mammoth_navigate', outcome: 'You carefully navigate between the beasts. Close calls!', stat_deltas: { skills: { survival: 3 }, stress: 10 } },
      { id: 'mammoth_chase', outcome: 'You run through, making them run. They\'re faster than you think.', stat_deltas: { health: -10, corruption: 5 } }
    ]
  },
  {
    id: 'es_enc_sabrecat',
    title: 'Sabrecat Hunt',
    description: 'A sabrecat stalks you through the underbrush. Its eyes glow in the darkness.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'dusk',
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'sabrecat_fight', outcome: 'You turn and fight! The beast is fast but you are faster.', stat_deltas: { health: -20, skills: { combat: 8 } } },
      { id: 'sabrecat_tame', outcome: 'You sing to the beast. It stops, curious... then follows you.', stat_deltas: { companion: 'sabrecat', skills: { animals: 10 } } },
      { id: 'sabrecat_flee', outcome: 'You climb a tree as the cat lunges. It circles for hours before leaving.', stat_deltas: { stress: 15 } }
    ]
  },
  {
    id: 'es_enc_spriggan',
    title: 'Spriggan Grove',
    description: 'You stumble into a grove of twisted trees. Vines move like snakes. Something watches.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.05,
    anatomy: 'tentacle_creature',
    image_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    outcomes: [
      { id: 'spriggan_attack', outcome: 'The grove attacks! Vines wrap around you, thorns pierce skin.', stat_deltas: { health: -20, corruption: 10 } },
      { id: 'spriggan_nature', outcome: 'You apologize to the forest. The grove accepts your respect.', stat_deltas: { relationship: 10, willpower: 5 } },
      { id: 'spriggan_flee', outcome: 'You run from the terrible place. The trees seem to laugh.', stat_deltas: { stress: 15 } },
      { id: 'spriggan_offer', outcome: 'You leave an offering. The grove parts, allowing passage.', stat_deltas: { gold: -10, corruption: 3 } }
    ]
  },
  {
    id: 'es_enc_wisp_mother',
    title: 'Wisp Mother',
    description: 'A figure of light floats before you. Wisps swirl around her like devoted followers.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.04,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'wisp_follow', outcome: 'You follow the light. It leads to a hidden cache of treasures.', stat_deltas: { gold: 50, skills: { magic: 5 } } },
      { id: 'wisp_attack', outcome: 'You attack! Light burns against your skin but you strike true.', stat_deltas: { health: -15, skills: { magic: 8 } } },
      { id: 'wisp_bless', outcome: 'The Wisp Mother touches your forehead. Warmth fills you.', stat_deltas: { health: 20, willpower: 10 } }
    ]
  },
  {
    id: 'es_enc_falmer',
    title: 'Falmer Tunnel',
    description: 'You find an underground passage. Strange sounds echo. Then — eyes in the dark.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.06,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    outcomes: [
      { id: 'falmer_fight', outcome: 'The Falmer swarm! You fight through, barely escaping.', stat_deltas: { health: -25, corruption: 10, skills: { combat: 5 } } },
      { id: 'falmer_flee', outcome: 'You run back the way you came. Better to live than explore.', stat_deltas: { stress: 10 } },
      { id: 'falmer_stealth', outcome: 'You sneak past. They don\'t notice. The tunnel continues.', stat_deltas: { skills: { stealth: 5 }, corruption: 3 } },
      { id: 'falmer_negotiate', outcome: 'You try to communicate. They listen... then attack anyway.', stat_deltas: { health: -15 } }
    ]
  },
  {
    id: 'es_enc_chaurus',
    title: 'Chaurus Nest',
    description: 'A wet, organic chamber fills with the skittering of chaurus. You\'ve found a nest.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.05,
    anatomy: 'tentacle_creature',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'chaurus_fight', outcome: 'You carve through the insects! Their chitin splinters under your blades.', stat_deltas: { health: -20, skills: { combat: 8 }, gold: 30 } },
      { id: 'chaurus_flee', outcome: 'No time to think — just run! The creatures chase but you escape.', stat_deltas: { stress: 15 } },
      { id: 'chaurus_escape', outcome: 'You find another exit. Sneaking past while they eat.', stat_deltas: { skills: { stealth: 5 } } }
    ]
  },
  {
    id: 'es_enc_riekling',
    title: 'Riekling Raid',
    description: 'Small, green-skinned creatures on wolves charge from the hills. Riekling raiders!',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.06,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'riekling_fight', outcome: 'They\'re small but fierce! You defeat them but take hits.', stat_deltas: { health: -15, skills: { combat: 5 }, gold: 20 } },
      { id: 'riekling_capture', outcome: 'You capture one! It struggles but can be tamed... maybe.', stat_deltas: { companion: 'riekling', skills: { animals: 5 } } },
      { id: 'riekling_flee', outcome: 'They\'re too fast on their wolves. You barely escape.', stat_deltas: { stress: 10 } },
      { id: 'riekling_bribe', outcome: 'You toss them food. They take it and flee. Smart enough.', stat_deltas: { gold: -15 } }
    ]
  },
  {
    id: 'es_enc_ash_spawn',
    title: 'Ash Spawn',
    description: 'Creatures of volcanic ash and hate rise from the ground. They serve no master but destruction.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.04,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800',
    outcomes: [
      { id: 'ash_fight', outcome: 'Ash and fire! You fight the creatures until they crumble.', stat_deltas: { health: -20, skills: { combat: 5 }, corruption: 5 } },
      { id: 'ash_flee', outcome: 'They\'re slow. You outrun them, lungs burning from ash.', stat_deltas: { stress: 10 } },
      { id: 'ash_fire', outcome: 'Fire magic works well. They dissolve into nothing.', stat_deltas: { skills: { magic: 8 } } }
    ]
  },
  {
    id: 'es_enc_soul_gem_merchant',
    title: 'Soul Gem Merchant',
    description: 'A shady figure offers glowing gems. "Soul gems. Fill them yourself or buy them filled. Your choice."',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.03,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=800',
    outcomes: [
      { id: 'soul_buy', outcome: 'You purchase a soul gem. It hums with captured life.', stat_deltas: { gold: -50, skills: { magic: 5 }, corruption: 5 } },
      { id: 'soul_study', outcome: 'You ask about the magic. The merchant shares dark knowledge.', stat_deltas: { skills: { magic: 10 }, corruption: 10 } },
      { id: 'soul_report', outcome: 'You report the merchant to the College. They\'ll be dealt with.', stat_deltas: { relationship: 10, willpower: 5 } },
      { id: 'soul_ignore', outcome: 'You walk away. Some trades are too dark to touch.', stat_deltas: { willpower: 3 } }
    ]
  },
  {
    id: 'es_enc_dragon_priest',
    title: 'Dragon Priest',
    description: 'A robed figure with a monstrous mask stands before an altar. Its voice resonates with power.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.02,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
    outcomes: [
      { id: 'priest_fight', outcome: 'You fight the ancient warrior! Its Thu\'um shatters your resolve.', stat_deltas: { health: -40, skills: { combat: 15 }, corruption: 10 } },
      { id: 'priest_negotiate', outcome: 'You speak respectfully. The priest considers you... "You may pass."', stat_deltas: { relationship: 10 } },
      { id: 'priest_flee', outcome: 'You run from the ancient power. It doesn\'t follow. Pride is spared.', stat_deltas: { stress: 15 } },
      { id: 'priest_pray', outcome: 'You pray to the Divines. The priest recoils, granting you escape.', stat_deltas: { willpower: 10, corruption: -5 } }
    ]
  },
  {
    id: 'es_enc_bandit_ambush',
    title: 'Bandit Ambush',
    description: 'The road ahead is blocked by bandits. They grin with predatory hunger. "Your coin or your life... or maybe both."',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.15,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'bandit_fight', outcome: 'You fight! Steel rings against steel. They fall one by one.', stat_deltas: { health: -20, gold: 50, corruption: 5, skills: { combat: 10 } } },
      { id: 'bandit_surrender', outcome: 'You surrender. They take your coin but... spare more than coin.', stat_deltas: { gold: -30, corruption: 25, romance: 10 } },
      { id: 'bandit_bribe', outcome: 'You offer gold to leave. They take it and laugh. "Come back anytime."', stat_deltas: { gold: -40, corruption: 10 } },
      { id: 'bandit_charm', outcome: 'Your words cut deeper than steel. They let you pass, impressed.', stat_deltas: { relationship: 15, willpower: 10 } },
      { id: 'bandit_flee', outcome: 'You run through the woods. Arrows fly but you escape.', stat_deltas: { stress: 15 } }
    ]
  },
  {
    id: 'es_enc_vampire_feeding',
    title: 'Vampire Feeding',
    description: 'A vampire cornered you in the darkness. Its pale face leans close. "Don\'t struggle. It\'ll feel so much better."',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.08,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'vampfeed_resist', outcome: 'You fight! The vampire bites but you break free, leaving it hungry.', stat_deltas: { health: -25, corruption: 15, willpower: 10 } },
      { id: 'vampfeed_accept', outcome: 'You yield. The bite is... electric. You feel it spreading through you.', stat_deltas: { corruption: 40, health: -20, romance: 15 } },
      { id: 'vampfeed_trance', outcome: 'The vampire\'s gaze hypnotizes. You can\'t move. Everything fades to red.', stat_deltas: { corruption: 30, health: -35, stress: 10 } },
      { id: 'vampfeed_offer', outcome: '"Take what you need." It hesitates, then feeds gently. You share a moment.', stat_deltas: { corruption: 20, romance: 20, health: -15 } }
    ]
  },
  {
    id: 'es_enc_werewolf_intimate',
    title: 'Werewolf Transformation',
    description: 'You\'re with someone special when the change takes you. Fur erupts, bones crack, and something primal surges.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.05,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'were_intimate_fight', outcome: 'You fight the beast within! You hurt your companion but control returns.', stat_deltas: { health: -30, relationship: -20, willpower: 15 } },
      { id: 'were_intimate_embrace', outcome: 'You surrender to the beast. The night becomes a blur of hunting and passion.', stat_deltas: { corruption: 35, romance: 25, transformation: 1 } },
      { id: 'were_intimate_flee', outcome: 'You run into the night, leaving them behind. The beast howls in triumph.', stat_deltas: { stress: 25, corruption: 20 } },
      { id: 'were_intimate_calm', outcome: 'You focus on your loved one. The beast recedes. Love conquers the beast.', stat_deltas: { romance: 15, willpower: 20, transformation: -1 } }
    ]
  },
  {
    id: 'es_enc_daedric_prince',
    title: 'Daedric Prince Temptation',
    description: 'Reality tears asunder. A presence beyond mortal comprehension manifests. "Mort... You interest me. Kneel and receive my gift."',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.03,
    anatomy: 'tentacle_creature',
    image_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=800',
    outcomes: [
      { id: 'prince_kneel', outcome: 'You kneel. The Prince\'s blessing burns into your soul. Power floods you.', stat_deltas: { corruption: 40, skills: { magic: 20 }, arcane: 15 } },
      { id: 'prince_refuse', outcome: '"No!" You stand tall. The Prince laughs but respects your defiance.', stat_deltas: { willpower: 25, corruption: -5 } },
      { id: 'prince_negotiate', outcome: 'You bargain. The Prince finds your audacity entertaining. A small gift.', stat_deltas: { corruption: 15, gold: 100 } },
      { id: 'prince_flee', outcome: 'You run from the manifestation. It doesn\'t follow. The world feels smaller.', stat_deltas: { stress: 30, willpower: 5 } }
    ]
  },
  {
    id: 'es_enc_draugr',
    title: 'Draugr Awakening',
    description: 'You explore an ancient crypt. The dead are supposed to stay dead. Then skeletal hands reach from their tombs.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.08,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800',
    outcomes: [
      { id: 'draugr_fight', outcome: 'The dead rise! You fight through the awakened warriors, blade ringing.', stat_deltas: { health: -25, corruption: 10, skills: { combat: 10 } } },
      { id: 'draugr_run', outcome: 'You flee the tomb! The draugr don\'t follow... but their screams echo.', stat_deltas: { stress: 20 } },
      { id: 'draugr_sneak', outcome: 'You move silently. The dead don\'t notice. You find ancient treasure.', stat_deltas: { gold: 75, skills: { stealth: 5 } } },
      { id: 'draugr_command', outcome: 'You find the word of power. The draugr bow to your will!', stat_deltas: { corruption: 20, skills: { magic: 15 }, companion: 'draugr' } }
    ]
  },
  {
    id: 'es_enc_giant_attack',
    title: 'Giant Attack',
    description: 'A giant storms toward you, club raised high. Its war cry shakes the earth. There\'s no time to think.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.07,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'giantattack_fight', outcome: 'You dodge and strike! The giant falls, but not after nearly crushing you.', stat_deltas: { health: -35, skills: { combat: 15 }, gold: 25 } },
      { id: 'giantattack_flee', outcome: 'You run for your life! The giant\'s club crashes behind you, missing by inches.', stat_deltas: { stress: 20 } },
      { id: 'giantattack_climb', outcome: 'You scramble up a tree! The giant kicks the trunk but can\'t reach you.', stat_deltas: { stress: 10, willpower: 5 } },
      { id: 'giantattack_offer', outcome: 'You throw food! The giant stops, confused, then eats. Safe passage.', stat_deltas: { gold: -15, relationship: 10 } }
    ]
  },
  {
    id: 'es_enc_vampire_clan',
    title: 'Vampire Clan Initiation',
    description: 'You\'ve been brought before the clan. Their leader circles you. "To join us, you must prove your devotion. Feed."',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.04,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'vampclan_feed', outcome: 'You feed on the offering. Power rushes through you. You\'re one of them now.', stat_deltas: { corruption: 50, disease: 'vampirism', skills: { magic: 10 } } },
      { id: 'vampclan_refuse', outcome: 'You refuse. The clan\'s gaze turns hostile. You fight your way out.', stat_deltas: { health: -30, corruption: 15, skills: { combat: 10 } } },
      { id: 'vampclan_bargain', outcome: 'You negotiate. They allow a lesser tribute. You keep your soul... for now.', stat_deltas: { corruption: 25, gold: -50 } },
      { id: 'vampclan_flee', outcome: 'You run! The vampires laugh but don\'t pursue. They\'ll find you later.', stat_deltas: { stress: 25, corruption: 5 } }
    ]
  },
  {
    id: 'es_enc_thrall',
    title: 'Becoming a Thrall',
    description: 'A vampire\'s gaze locks onto yours. Your mind goes fuzzy. "Sleep now. Wake when I command."',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.05,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'thrall_accept', outcome: 'You surrender your will. The vampire smiles. You are its faithful servant.', stat_deltas: { corruption: 60, willpower: -30, companion: 'vampire_master' } },
      { id: 'thrall_resist', outcome: 'You fight the mental compulsion! It hurts, but you break free.', stat_deltas: { health: -15, willpower: 25, corruption: 5 } },
      { id: 'thrall_trick', outcome: 'You pretend compliance. The vampire releases you. Time to escape.', stat_deltas: { corruption: 10, skills: { stealth: 10 } } },
      { id: 'thrall_attack', outcome: 'You attack through the haze! The vampire is surprised but recovers.', stat_deltas: { health: -25, corruption: 20, skills: { combat: 5 } } }
    ]
  },
  {
    id: 'es_enc_rift_hunt',
    title: 'Hunting in the Rift',
    description: 'The Rift\'s forests are rich with prey. You track a deer when something tracks you back.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.1,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'rifthunt_success', outcome: 'You bring down game! A fine kill to feed yourself or sell.', stat_deltas: { gold: 35, skills: { survival: 10 } } },
      { id: 'rifthunt_ambush', outcome: 'You\'re ambushed by predators! A brutal fight for survival.', stat_deltas: { health: -20, skills: { combat: 8 }, corruption: 5 } },
      { id: 'rifthunt_spirit', outcome: 'A spriggan guides you to better hunting grounds. The forest provides.', stat_deltas: { gold: 50, relationship: 10, skills: { survival: 5 } } },
      { id: 'rifthunt_lost', outcome: 'You lose yourself in the woods. Night falls. You survive but shaken.', stat_deltas: { stress: 15 } }
    ]
  },
  {
    id: 'es_enc_labyrinthian',
    title: 'Lost in Labyrinthian',
    description: 'The ancient ruins maze endlessly. Fog obscures the path. Something moves in the mist. Labyrinthian claims the unwary.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.04,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    outcomes: [
      { id: 'labyrinthian_fight', outcome: 'Wisps attack! You battle through the spectral maze, finding the exit.', stat_deltas: { health: -30, corruption: 15, skills: { magic: 10 } } },
      { id: 'labyrinthian_find', outcome: 'You find the hidden path! Ancient knowledge awaits in the depths.', stat_deltas: { skills: { magic: 15 }, gold: 100 } },
      { id: 'labyrinthian_flee', outcome: 'You run blindly! Miraculously, you burst out of the fog. Lucky.', stat_deltas: { stress: 20, willpower: 5 } },
      { id: 'labyrinthian_wait', outcome: 'You wait for dawn. The mist fades. You walk out, untouched but wiser.', stat_deltas: { willpower: 10 } }
    ]
  },
  {
    id: 'es_enc_dibella_shrine',
    title: 'Shrine of Dibella',
    description: 'A beautiful shrine hidden in the woods. The air is thick with perfume. A priestess emerges. "Welcome to Dibella\'s embrace."',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.06,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    outcomes: [
      { id: 'dibella_pray', outcome: 'You pray to the Goddess of Beauty. Blessings wash over you.', stat_deltas: { romance: 20, willpower: 10 } },
      { id: 'dibella_serve', outcome: 'You offer service to the shrine. The priestess teaches you sacred arts.', stat_deltas: { romance: 15, skills: { magic: 10 }, corruption: -5 } },
      { id: 'dibella_tempt', outcome: 'You give in to the goddess\'s pleasures. It\'s everything and more.', stat_deltas: { corruption: 25, romance: 30, stress: -20 } },
      { id: 'dibella_ignore', outcome: 'You ignore the shrine. Beauty is wasted on the unworthy.', stat_deltas: { relationship: -5 } }
    ]
  },
  {
    id: 'es_enc_hircine_hunt',
    title: 'Hircine\'s Hunt',
    description: 'The hunt begins! Hircine\'s horn echoes. Beasts run before you. But who hunts who?',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.04,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1615803421322-1e7333d4b1b0?w=800',
    outcomes: [
      { id: 'hircine_hunt_lead', outcome: 'You lead the hunt! Great beasts fall before you. Hircine smiles.', stat_deltas: { corruption: 20, skills: { combat: 15 }, gold: 75 } },
      { id: 'hircine_hunt_prey', outcome: 'You become the prey! The hunt is terrifying and exhilarating.', stat_deltas: { stress: 30, corruption: 15, romance: 10 } },
      { id: 'hircine_hunt_join', outcome: 'You join the werewolves. The hunt becomes part of you.', stat_deltas: { corruption: 35, transformation: 1, companion: 'werewolf_pack' } },
      { id: 'hircine_hunt_flee', outcome: 'You escape the hunt. Hircine\'s laugh follows. You survived... this time.', stat_deltas: { stress: 25, willpower: 10 } }
    ]
  },
  {
    id: 'es_enc_witches_coven',
    title: 'Witches Coven',
    description: 'You stumble upon a moonlit gathering. Witches dance around a cauldron. They notice you.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.05,
    anatomy: 'tentacle_creature',
    image_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    outcomes: [
      { id: 'coven_join', outcome: 'You join the dance! The magic is intoxicating. A new coven sister.', stat_deltas: { corruption: 30, skills: { magic: 15 }, companion: 'witch_coven' } },
      { id: 'coven_bargain', outcome: 'You bargain for knowledge. They share dark secrets for a price.', stat_deltas: { corruption: 15, skills: { magic: 20 }, gold: -50 } },
      { id: 'coven_fight', outcome: 'You attack! Magic crashes against magic. The coven disperses.', stat_deltas: { health: -25, skills: { magic: 10 }, corruption: 10 } },
      { id: 'coven_flee', outcome: 'You run from the hexes! Behind you, laughter echoes through the night.', stat_deltas: { stress: 20 } }
    ]
  },
  {
    id: 'es_enc_falmer_hive',
    title: 'Falmer Hive',
    description: 'Deep underground, you find a Falmer hive. They cultivate something in the darkness. They haven\'t noticed you yet.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.05,
    anatomy: 'average',
    image_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    outcomes: [
      { id: 'falmerhive_raid', outcome: 'You raid the hive! Treasure and chaurus eggs. But they swarm!', stat_deltas: { gold: 100, corruption: 10, skills: { combat: 10 } } },
      { id: 'falmerhive_stealth', outcome: 'You sneak past, taking nothing. Survival over greed.', stat_deltas: { skills: { stealth: 10 } } },
      { id: 'falmerhive_negotiate', outcome: 'You try to communicate. Some listen. A rare truce forms.', stat_deltas: { relationship: 15, corruption: 5 } },
      { id: 'falmerhive_escape', outcome: 'They spot you! You run for your life through the tunnels.', stat_deltas: { health: -15, stress: 20 } }
    ]
  },
  {
    id: 'es_enc_chaurus_breeding',
    title: 'Chaurus Breeding Chamber',
    description: 'A massive chamber filled with chaurus in various stages of breeding. The smell is overwhelming. Something watches from above.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.04,
    anatomy: 'tentacle_creature',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'chaurusbreed_fight', outcome: 'The chaurus swarm! You fight through the breeding ground, disgusting but necessary.', stat_deltas: { health: -25, skills: { combat: 8 }, corruption: 10 } },
      { id: 'chaurusbreed_collect', outcome: 'You collect rare eggs. This will sell for a fortune.', stat_deltas: { gold: 150, corruption: 15 } },
      { id: 'chaurusbreed_study', outcome: 'You study the breeding. Dark knowledge reveals itself.', stat_deltas: { skills: { magic: 15 }, corruption: 10 } },
      { id: 'chaurusbreed_flee', outcome: 'You flee the nightmare! The chaurus screech but don\'t follow.', stat_deltas: { stress: 25 } }
    ]
  },
  {
    id: 'es_enc_spriggan_mother',
    title: 'Spriggan Mother',
    description: 'A massive spriggan towers before you, surrounded by lesser spirits. It speaks in roots and vines. "You enter our sacred place."',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.04,
    anatomy: 'tentacle_creature',
    image_url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    outcomes: [
      { id: 'sprigganmother_fight', outcome: 'The grove attacks! Vines wrap around you. A brutal escape.', stat_deltas: { health: -30, corruption: 15, skills: { combat: 5 } } },
      { id: 'sprigganmother_worship', outcome: 'You bow to the forest. The mother accepts you as its champion.', stat_deltas: { corruption: 20, companion: 'spriggan', skills: { magic: 10 } } },
      { id: 'sprigganmother_bargain', outcome: 'You offer gold for safe passage. The mother considers... then accepts.', stat_deltas: { gold: -50, relationship: 10 } },
      { id: 'sprigganmother_flee', outcome: 'You run from the ancient spirit! Trees block your path but you escape.', stat_deltas: { stress: 20 } }
    ]
  },
  {
    id: 'es_enc_automaton_malfunction',
    title: 'Automaton Malfunction',
    description: 'A Dwemer machine sparks and whirs, its eyes glowing red. "INTRUDER DETECTED. TERMINATING."',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.06,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'auto_malfunction_fight', outcome: 'You fight the machine! Metal screeches against steel. It falls.', stat_deltas: { health: -20, skills: { combat: 10 }, gold: 25 } },
      { id: 'auto_malfunction_repair', outcome: 'You repair the malfunction! It becomes your faithful machine.', stat_deltas: { skills: { crafting: 15 }, companion: 'dwemer_automaton' } },
      { id: 'auto_malfunction_hack', outcome: 'You hack the controls! The machine now serves you.', stat_deltas: { skills: { magic: 10 }, corruption: 10, companion: 'dwemer_automaton' } },
      { id: 'auto_malfunction_flee', outcome: 'You run from the killing machine! It doesn\'t follow. Lucky.', stat_deltas: { stress: 15 } }
    ]
  },
  {
    id: 'es_enc_dwemer_sphere',
    title: 'Dwemer Sphere Attack',
    description: 'A Dwemer sphere rolls toward you, weapons deploying. The ancient metal glows with fury. It doesn\'t speak, only kills.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.07,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'sphere_fight', outcome: 'You battle the sphere! Its weapons are deadly but you\'re faster.', stat_deltas: { health: -25, skills: { combat: 12 }, corruption: 5 } },
      { id: 'sphere_destroy', outcome: 'You destroy it completely! Scrap metal everywhere. Treasure!', stat_deltas: { gold: 75, skills: { combat: 5 }, corruption: 3 } },
      { id: 'sphere_stealth', outcome: 'You sneak past. It rolls on, not noticing you. Ancient tech passes by.', stat_deltas: { skills: { stealth: 8 } } },
      { id: 'sphere_override', outcome: 'You find the control mechanism! The sphere stands down, awaiting orders.', stat_deltas: { skills: { magic: 10 }, companion: 'dwemer_sphere' } }
    ]
  },
  {
    id: 'es_enc_nightcaller',
    title: 'Nightcaller Temple',
    description: 'The temple of Nightcaller looms in the darkness. The veil between worlds grows thin. Something awakens within.',
    condition: (state) => state.location === 'riften_outskirts' && state.time === 'night' && Math.random() < 0.03,
    anatomy: 'thug',
    image_url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800',
    outcomes: [
      { id: 'nightcaller_explore', outcome: 'You explore the temple! Dark secrets and darker powers await.', stat_deltas: { skills: { magic: 20 }, corruption: 15 } },
      { id: 'nightcaller_wake', outcome: 'Something wakes! You fight the risen darkness and barely survive.', stat_deltas: { health: -35, corruption: 20, skills: { combat: 10 } } },
      { id: 'nightcaller_seal', outcome: 'You seal the awakening. The darkness retreats. Another day saved.', stat_deltas: { willpower: 20, corruption: -10, relationship: 10 } },
      { id: 'nightcaller_flee', outcome: 'You flee the temple! Behind you, something screams in rage.', stat_deltas: { stress: 25, corruption: 5 } }
    ]
  },
  {
    id: 'es_enc_end_of_days',
    title: 'End of Days',
    description: 'The sky turns red. Dragons circle above. The prophecy unfolds. This is the apocalypse... or opportunity.',
    condition: (state) => state.location === 'riften_outskirts' && Math.random() < 0.02,
    anatomy: 'feral_dog',
    image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800',
    outcomes: [
      { id: 'end_fight', outcome: 'You fight the darkness! Dragons fall, daedra scatter. A legend is born.', stat_deltas: { corruption: 20, skills: { combat: 25 }, gold: 200 } },
      { id: 'end_join', outcome: 'You join the apocalypse! Power flows to those who embrace the end.', stat_deltas: { corruption: 50, skills: { magic: 20 }, arcane: 20 } },
      { id: 'end_survive', outcome: 'You hide and survive. The world burns but you endure.', stat_deltas: { willpower: 30, stress: 15 } },
      { id: 'end_profit', outcome: 'While worlds end, you loot. Crazier things have happened.', stat_deltas: { gold: 500, corruption: 25 } }
    ]
  }
];