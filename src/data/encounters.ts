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
  }
];
