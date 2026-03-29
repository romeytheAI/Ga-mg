import { GameState } from '../types';
import { PREDEFINED_ANATOMIES } from '../constants';

export const ENCOUNTERS = [
  {
    id: 'alley_mugger',
    condition: (state: GameState) => state.world.current_location.danger > 20 && state.world.current_location.id !== 'swamp',
    outcome: "A rough-looking thug blocks your path, eyeing you up and down with a predatory grin.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'tentacle_ambush',
    condition: (state: GameState) => state.world.current_location.id === 'swamp' || state.world.current_location.id === 'docks',
    outcome: "The dark water suddenly churns. Thick, slimy tentacles erupt from the depths, wrapping around your ankles and pulling you down!",
    anatomy: PREDEFINED_ANATOMIES.tentacle_creature,
    image_url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'creepy_noble',
    condition: (state: GameState) => state.world.current_location.id === 'town_square' || state.world.current_location.id === 'temple_gardens',
    outcome: "A finely dressed noble approaches you. They smell of expensive perfume and wine. 'You look lost, little one. Why don't you come with me?' they purr, reaching out to stroke your hair.",
    anatomy: PREDEFINED_ANATOMIES.noble,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'stray_dog',
    condition: (state: GameState) => state.world.current_location.id === 'alleyways' || state.world.current_location.id === 'town_square',
    outcome: "A mangy, feral dog growls at you from the shadows, its fur matted with filth. It bares yellowed teeth, eyes wild with hunger, and lunges with a desperate, snarling snap.",
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'drunken_sailor',
    condition: (state: GameState) => state.world.current_location.id === 'docks' || state.world.current_location.id === 'brothel',
    outcome: "A burly sailor stumbles out of a tavern, reeking of cheap ale and stale tobacco. He spots you, his eyes widening with drunken desire, and he lurches forward, his hands grasping clumsily at your clothes.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'corrupt_guard',
    condition: (state: GameState) => state.world.current_location.id === 'town_square' || state.world.current_location.id === 'alleyways',
    outcome: "A town guard stops you, his hand resting menacingly on his sword hilt. His armor is tarnished, and his eyes roam over you with predatory intent. 'You're out late, little one. Maybe we can come to an... arrangement,' he sneers, stepping closer.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'wild_boar',
    condition: (state: GameState) => state.world.current_location.id === 'forest' || state.world.current_location.id === 'farm',
    outcome: "A massive wild boar bursts from the underbrush, its tusks gleaming and coated in mud. It snorts angrily, kicking up dirt, and charges straight at you with primal, unstoppable force!",
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: "https://images.unsplash.com/photo-1516934824647-10023023f2f0?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'shadowy_cultist',
    condition: (state: GameState) => state.world.current_location.id === 'temple_gardens' || state.world.current_location.id === 'swamp',
    outcome: "A figure in dark, tattered robes steps out from the gloom, the air growing cold around them. They chant in a guttural, forgotten language, their eyes glowing with an unnatural, sickly fervor that makes your skin crawl.",
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'lake_lurker',
    condition: (state: GameState) => state.world.current_location.id === 'lake',
    outcome: "As you wade into the shallows, something cold and slimy wraps around your ankle beneath the water's surface. The lake's calm surface ripples violently as a pale, amphibian creature surges upward, its wide mouth full of needle-like teeth.",
    anatomy: PREDEFINED_ANATOMIES.tentacle_creature,
    image_url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'beach_scavenger',
    condition: (state: GameState) => state.world.current_location.id === 'beach',
    outcome: "A scarred, sun-weathered figure emerges from behind the rocks, blocking the path back. They carry a jagged piece of driftwood like a club and eye your belongings with naked greed. 'Empty your pockets, or I'll feed you to the crabs,' they snarl.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'school_bully',
    condition: (state: GameState) => state.world.current_location.id === 'school',
    outcome: "A group of older students corners you in an empty hallway. The largest of them cracks his knuckles, a cruel smile spreading across his face. 'Orphan scum. Let's see what you've got in those pockets.' The others fan out to block your escape.",
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'wolf_pack',
    condition: (state: GameState) => state.world.current_location.id === 'forest' && state.world.hour >= 18,
    outcome: "The forest goes silent. Then you hear it — the low, sustained growl of a wolf, joined by another, and another. Golden eyes appear in the darkness between the trees. A lean, grey alpha emerges from the shadows, lips peeled back over yellowed fangs.",
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'barn_stalker',
    condition: (state: GameState) => state.world.current_location.id === 'farm' && state.world.hour >= 20,
    outcome: "You hear heavy footsteps behind you in the dark barn. A large figure blocks the doorway, silhouetted against the moonlight. 'Thought you could sleep in my barn for free?' the farmhand growls, stepping closer. His breath reeks of grain alcohol.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  // ── New DoL-parity encounters ──────────────────────────────────────────
  {
    id: 'park_stalker',
    condition: (state: GameState) => state.world.current_location.id === 'park' && state.world.hour >= 19,
    outcome: "The park is empty and dark. You hear footsteps behind you — always the same distance, matching your pace. When you turn, a shadowy figure ducks behind a tree. Your heart hammers as you realize you're being followed.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'sewer_slime',
    condition: (state: GameState) => state.world.current_location.id === 'sewers',
    outcome: "The darkness shifts and something wet and heavy drops from the ceiling onto your shoulders. A formless, translucent slime engulfs your upper body, its acidic touch burning through your clothes. It pulses with a grotesque, hungry intelligence.",
    anatomy: PREDEFINED_ANATOMIES.tentacle_creature,
    image_url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'strip_club_patron',
    condition: (state: GameState) => state.world.current_location.id === 'strip_club',
    outcome: "A drunk, aggressive patron corners you near the back exit. 'Hey, where d'you think you're going? I paid for a private dance and I'm gonna get one.' They grab your wrist with bruising force, eyes glazed with alcohol and desire.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'moor_hawk',
    condition: (state: GameState) => state.world.current_location.id === 'moor',
    outcome: "A piercing shriek splits the sky! The Great Hawk descends from its tower, enormous talons extended. The shadow of its massive wingspan engulfs you as it swoops down with terrifying speed!",
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'ocean_creature',
    condition: (state: GameState) => state.world.current_location.id === 'ocean',
    outcome: "Something massive moves beneath you in the dark water. Before you can react, thick, smooth tentacles coil around your legs and torso, dragging you beneath the waves. The creature's grip is impossibly strong, and the salt water burns your eyes as you're pulled deeper.",
    anatomy: PREDEFINED_ANATOMIES.tentacle_creature,
    image_url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'prison_inmate',
    condition: (state: GameState) => state.world.current_location.id === 'prison',
    outcome: "In the exercise yard, a group of inmates blocks your path. The largest steps forward, cracking their knuckles. 'Fresh meat. The new ones always need to learn how things work around here.' The guards conveniently look the other way.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'wolf_pack_cave',
    condition: (state: GameState) => state.world.current_location.id === 'wolf_cave',
    outcome: "The pack wolves snarl as you venture too deep into the cave without the alpha's approval. Several wolves surround you, hackles raised, teeth bared. The alpha watches from the shadows — this is a test.",
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'shopping_pickpocket',
    condition: (state: GameState) => state.world.current_location.id === 'shopping_centre',
    outcome: "A nimble figure bumps into you, their hands quick and practised. Before you can react, they've lifted your purse and are disappearing into the crowd. You give chase through the busy streets!",
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'blood_moon_horror',
    condition: (state: GameState) => state.world.day % 30 === 0 && state.world.hour >= 20,
    outcome: "The moon rises red and swollen over the town. The air crackles with malevolent energy. From the shadows, twisted forms emerge — creatures that should not exist, driven mad by the blood moon's influence. The night belongs to them now.",
    anatomy: PREDEFINED_ANATOMIES.tentacle_creature,
    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'swarm_insects',
    condition: (state: GameState) => (state.world.current_location.id === 'swamp' || state.world.current_location.id === 'forest') && state.world.weather === 'Humid',
    outcome: "A buzzing cloud descends upon you — thousands of stinging insects driven into a frenzy by the humid air. They crawl into your clothes, your hair, your ears. You flail desperately, but there are too many!",
    anatomy: PREDEFINED_ANATOMIES.tentacle_creature,
    image_url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  // ── Tamriel expansion encounters ──────────────────────────────────────
  {
    id: 'tavern_brawl',
    condition: (state: GameState) => state.world.current_location.id === 'tavern',
    outcome: "A tankard shatters against the wall inches from your head! A massive, drunken Nord has started a bar fight, and the chaos sweeps towards you. Chairs fly, fists connect with jaws, and Hulda screams for order from behind the bar. You're caught in the middle of a full-blown Bannered Mare brawl.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'noble_kidnapper',
    condition: (state: GameState) => state.world.current_location.id === 'noble_district' || state.world.current_location.id === 'shopping_centre',
    outcome: "A gilded carriage stops beside you. The door swings open and a gloved hand beckons. 'You look like you could use a warm meal and a soft bed,' purrs a voice from the shadows within. The coachman's dead eyes and the carriage's blacked-out windows tell you this is not an act of charity.",
    anatomy: PREDEFINED_ANATOMIES.noble,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'graveyard_draugr',
    condition: (state: GameState) => state.world.current_location.id === 'graveyard' && state.world.hour >= 20,
    outcome: "A sarcophagus lid grinds open with a sound that turns your blood to ice. A Draugr pulls itself from its ancient resting place, its desiccated flesh stretched tight over Nordic bones. Blue light blazes in its empty eye sockets as it turns towards you, raising a rusted ancient Nord sword with terrible purpose.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'ruins_guardian',
    condition: (state: GameState) => state.world.current_location.id === 'ruins',
    outcome: "The air crackles with ancient magicka. A Dwemer Sphere Guardian unfolds from what you mistook for a pile of rubble — bronze plates sliding into place, gyroscopic joints whirring to life. Its single lens-eye fixes on you with mechanical precision, and a blade extends from its arm with a hiss of pneumatic pressure.",
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'smuggler_ambush',
    condition: (state: GameState) => state.world.current_location.id === 'underground_market' || state.world.current_location.id === 'crossroads',
    outcome: "Three figures step from the shadows, blocking your path. 'You've seen too much, street rat,' the leader hisses, drawing a curved Hammerfell blade. 'Nothing personal — just business. Can't have loose tongues wagging about our operation.' The other two close in from the sides.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'desperate_beggar',
    condition: (state: GameState) => (state.world.current_location.id === 'town_square' || state.world.current_location.id === 'alleyways') && state.player.stats.purity > 30,
    outcome: "A skeletal figure lurches from an alley, their hollow eyes wild with hunger and skooma withdrawal. 'Please... just a few septims... I'll do anything...' Their trembling hand grabs your sleeve with surprising strength. When you look into their eyes, you see what your own future might hold if things go wrong.",
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'wandering_merchant',
    condition: (state: GameState) => state.world.current_location.id === 'crossroads' || state.world.current_location.id === 'forest',
    outcome: "A Khajiit merchant appears on the road, pulling a cart loaded with jingling wares. 'Khajiit has wares, if you have coin,' they purr, golden eyes glinting. But as you approach, you notice the cart's contents shift unnaturally, and the merchant's smile reveals far too many teeth. This is no ordinary trader.",
    anatomy: PREDEFINED_ANATOMIES.noble,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'bathhouse_creep',
    condition: (state: GameState) => state.world.current_location.id === 'bathhouse',
    outcome: "Through the steam, you catch a glimpse of movement — someone watching from behind a marble column, their eyes tracking your every move. When you turn to confront them, they step forward with a predatory smile. 'Don't be shy. We're all friends here in the warm water.' Their hands reach towards you beneath the surface.",
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'escaped_prisoner',
    condition: (state: GameState) => state.world.current_location.id === 'alleyways' || state.world.current_location.id === 'sewers',
    outcome: "A massive figure in torn prison rags rounds the corner, chains still dangling from bloody wrists. Their eyes are wild and desperate — an escaped convict from Riften Jail with nothing left to lose. 'Give me your clothes and your coin,' they snarl, 'or I'll take them from your corpse.' Blood drips from a fresh wound on their temple.",
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: 'feral_skeever_pack',
    condition: (state: GameState) => (state.world.current_location.id === 'sewers' || state.world.current_location.id === 'alleyways') && state.world.hour >= 21,
    outcome: "A chorus of high-pitched squealing erupts from the darkness. Dozens of glowing red eyes appear at ankle height — a massive pack of skeevers, their disease-ridden teeth bared, driven to frenzy by hunger. They pour towards you in a chittering, furry wave, too many to count.",
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800"
  }
];
