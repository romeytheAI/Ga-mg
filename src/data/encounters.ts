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
  }
];
