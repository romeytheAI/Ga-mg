import { GameState } from '../types';
import { PREDEFINED_ANATOMIES } from '../constants';

export interface EncounterDefinition {
  id: string;
  condition: (state: GameState) => boolean;
  outcome: string;
  anatomy: any;
  image_url?: string;
  story_event?: string;
}

export const ES_ENCOUNTERS: EncounterDefinition[] = [
  {
    id: 'ebony_warrior',
    condition: (state: GameState) => {
      const skills = state.player.skills;
      const avg = Object.values(skills).reduce((sum, v) => sum + (v || 0), 0) / Object.keys(skills).length;
      return avg > 50;
    },
    outcome: 'A towering figure in black ebony armor blocks your path, a massive greatsword resting on their shoulder. "I have slain every foe Skyrim could offer. Are you worthy enough to be my final challenge?" Eyes burn with quiet, deadly confidence beneath the helm.',
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'maiq_the_liar',
    condition: (state: GameState) => state.world.current_location.id === 'crossroads',
    outcome: 'A Khajiit sits cross-legged on the roadside, tail swishing lazily. "M\'aiq is tired of liars. But you--you are honest enough. Here is a truth: the Daedra do not care what you wear, only what you do." He winks and vanishes in a cloud of dust.',
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'sanguine_banquet',
    condition: (state: GameState) => state.world.current_location.id === 'tavern' && state.player.stats.corruption > 40,
    outcome: '"You look like someone who appreciates... company," purrs a well-dressed stranger with a crimson rose pinned to their lapel. Their eyes flash gold as they beckon you to a private table where strange, intoxicating drinks are already poured. The air smells of sweet wine and dangerous promises.',
    anatomy: PREDEFINED_ANATOMIES.noble,
    image_url: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'dark_brotherhood_whisper',
    condition: (state: GameState) => state.world.active_story_event !== null && state.world.current_location.danger > 30,
    outcome: 'A voice whispers through your dreams: "We hear you. We see you. Sleep is not safe, little one, for someone wishes you silent." You awaken to find a single black rose on your pillow. The Dark Brotherhood has marked you.',
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'clavicus_vile_crossroads',
    condition: (state: GameState) => state.player.gold < 50 && state.world.current_location.id === 'crossroads',
    outcome: 'A fox trots onto the road and transforms mid-step into a pleasant-looking man with an easy smile. "I can give you everything you want," Clavicus Vile purrs. "All I need is a small favor in return. Nothing that would hurt, I promise." His Barbas the hound sits patiently behind him.',
    anatomy: PREDEFINED_ANATOMIES.noble,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'hircines_hunt',
    condition: (state: GameState) => state.world.current_location.id === 'forest' && state.player.skills.athletics > 30,
    outcome: 'A majestic stag appears at the forest edge. Its antlers form a crown of living wood and bone. When you step closer, it speaks in a voice that is unmistakably Hircine\'s: "The Hunt calls to you. Will you run with the pack, or flee like prey?" Golden eyes gleam with ancient intelligence.',
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'molag_bal_whisper',
    condition: (state: GameState) => state.player.stats.corruption > 60 && state.world.current_location.danger > 50,
    outcome: 'Cold seeps into your marrow. A voice like grinding stone fills your skull: "You are MINE now, little slave. The chains of Coldharbour bind you. Your suffering feeds me." The air around you darkens, and you feel the weight of the King of Rape\'s attention like iron chains on your soul.',
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'draugr_procession',
    condition: (state: GameState) => state.world.current_location.id === 'graveyard' && state.world.hour >= 0 && state.world.hour < 3,
    outcome: 'The ancient Nordic dead march solemnly from their barrows, their desiccated bodies draped in ancient burial shrouds. They do not notice you--yet. Blue light blazes in their hollow eyes as they raise rusted swords to honor some forgotten king of the Dragon Cult. The air is thick with the scent of old bones and older magic.',
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'spriggan_curse',
    condition: (state: GameState) => state.world.current_location.id === 'forest' && state.world.turn_count % 50 === 0,
    outcome: 'The earth itself screams. Roots erupt from the ground as a towering Spriggan manifests from the ancient wood, bark cracking, branches forming clawed hands. "You have desecrated the elder grove," the creature speaks in a voice of creaking wood. "The forest will not forget. The trees remember all."',
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'flying_wizard',
    condition: (state: GameState) => state.world.current_location.id === 'moor',
    outcome: 'A wild-eyed wizard stands on a hilltop, arms raised. "I HAVE MASTERED FLIGHT!" he declares, and casts a levitation spell. He rises ten feet into the air, pauses triumphantly--and plummets back to earth with a spectacular crash. Groaning from the crater, he mutters: "Minor adjustment needed. Just... minor."',
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'headless_horseman',
    condition: (state: GameState) => state.world.current_location.id === 'graveyard' && state.world.hour >= 23 && state.world.weather === 'Snowing',
    outcome: 'A spectral rider on a pale horse gallops through the fog, clutching a flaming jack-o\'-lantern where his head should be. The green light from the pumpkin illuminates a face of rotting Nordic flesh. He is searching for his lost head--and his hollow, burning gaze has fallen upon you.',
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'namira_feast',
    condition: (state: GameState) => state.world.current_location.id === 'alleyways' && state.player.stats.corruption > 30,
    outcome: 'A ragged figure beckons from a dark alley. Their eyes are hollow, their grin too wide. They gesture toward a fresh corpse. "Eat," they whisper. "Namira provides. The dead waste nothing. Taste the flesh and feel the Ancient Darkness fill you." Their own teeth are sharpened points.',
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'daedric_shrine_manifest',
    condition: (state: GameState) => state.world.current_location.danger > 60 && state.player.stats.lust > 50,
    outcome: 'A Daedric shrine pulses with unholy light in the darkness. The stone itself seems to breathe. The Prince\'s voice thunders from within: "I HEAR YOU, MORTAL. KNEEL AND PLEDGE, OR FLEE AND BE FORSAKEN." The ground trembles with each word. Runes burn orange across the altar.',
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'dragon_overhead',
    condition: (state: GameState) => ['forest', 'tundra', 'moor', 'crossroads'].includes(state.world.current_location.id || '') && state.world.turn_count % 100 === 0,
    outcome: 'A shadow blots out the sun. The ground trembles as a massive dragon wheels in lazy circles above you. Its scales gleam like polished bronze, and its eyes--ancient, golden, intelligent--lock onto you. Wings fold. It dives. You have seconds to move!',
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'sheogorath_conversation',
    condition: (state: GameState) => state.player.stats.corruption > 30,
    outcome: 'A man in fine purple clothes appears out of thin air, casually eating a sweet roll. "Have you ever noticed the color purple tastes like Tuesday?" Sheogorath grins, eyes swirling like a mad whirlpool. "I need someone who doesn\'t make SENSE. That\'s a rare quality! Care to chat, little mortal?" He offers you a sweet roll. It\'s slightly suspicious.',
    anatomy: PREDEFINED_ANATOMIES.noble,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'ordinator_patrol',
    condition: (state: GameState) => state.world.current_location.id === 'loc_es_vivec_city',
    outcome: 'An Ordinator in golden Indoril armor blocks your path. His mask is frozen in a stern expression. "We\'re watching you, scum," he growls, hand resting on his ebony mace. "Let\'s keep it official." His gaze follows you until you are out of sight.',
    anatomy: PREDEFINED_ANATOMIES.thug,
    image_url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'cliff_racer_attack',
    condition: (state: GameState) => ['loc_es_balmora', 'loc_es_sadrith_mora'].includes(state.world.current_location.id || '') && state.world.turn_count % 30 === 0,
    outcome: 'A piercing shriek echoes from above. You look up to see a leathery shape diving out of the sky. A Cliff Racer! Its terrifying screech announces its intent to peck your eyes out. The local guards don\'t even look up; they are used to this nuisance.',
    anatomy: PREDEFINED_ANATOMIES.feral_dog,
    image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1200&h=800',
  },
  {
    id: 'ashlander_scout',
    condition: (state: GameState) => state.world.current_location.id === 'loc_es_kogoruhn',
    outcome: 'An Ashlander scout emerges from the blowing ash, face wrapped in chitin and cloth. He points a spear at your chest. "Outlander. You walk where the tribes do not. The blight is strong here. Turn back, or become part of the ash." He vanishes back into the storm before you can reply.',
    anatomy: PREDEFINED_ANATOMIES.average,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200&h=800',
  },
];
