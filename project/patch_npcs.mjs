import fs from 'fs';
const file = 'src/data/esNPCs.ts';
let code = fs.readFileSync(file, 'utf8');

const newNPCs = `
  npc_es_maven: {
    id: 'npc_es_maven',
    name: 'Maven Black-Briar',
    description: 'The matriarch of the Black-Briar family, effectively the true ruler of Riften. She is wealthy, ruthless, and has deep ties to both the Thieves Guild and the Dark Brotherhood.',
    danger: 75,
    affinity: 0,
    attraction: 0,
    state: 'neutral',
    visuals: { race: 'human', gender: 'female', age: 'mature', attire: 'fine clothes' },
    dialogue: {
      greeting: {
        text: 'My title is just a formality. Everyone knows who really runs Riften. What do you want?',
        options: [
          { label: 'I am looking for work.', next: 'maven_work' },
          { label: 'Nothing, just passing by.', next: 'maven_leave' }
        ]
      },
      maven_work: {
        text: 'I have friends in low places, and they don\\'t like to be disturbed unless it\\'s profitable. Prove your worth first.',
        options: []
      },
      maven_leave: {
        text: 'Then get out of my sight before I lose my temper.',
        options: []
      }
    },
    schedule: [{ time: 8, location: 'loc_es_riften', action: 'scheming' }]
  },
  npc_es_aela: {
    id: 'npc_es_aela',
    name: 'Aela the Huntress',
    description: 'A fierce Nord werewolf and a member of the Companions\\' inner circle. She worships Hircine and embodies the spirit of the hunt.',
    danger: 80,
    affinity: 0,
    attraction: 0,
    state: 'neutral',
    visuals: { race: 'human', gender: 'female', age: 'adult', attire: 'ancient nord armor' },
    dialogue: {
      greeting: {
        text: 'You have the look of a hunter about you. Or are you the prey?',
        options: [
          { label: 'I am a hunter.', next: 'aela_hunter' }
        ]
      },
      aela_hunter: {
        text: 'We shall see. The wilderness of Skyrim separates the strong from the dead.',
        options: []
      }
    },
    schedule: [{ time: 10, location: 'loc_es_whiterun', action: 'hunting' }]
  },
  npc_es_farengar: {
    id: 'npc_es_farengar',
    name: 'Farengar Secret-Fire',
    description: 'The court wizard of Dragonsreach. More interested in his research, particularly dragons, than in politics or pleasantries.',
    danger: 40,
    affinity: 0,
    attraction: 0,
    state: 'neutral',
    visuals: { race: 'human', gender: 'male', age: 'adult', attire: 'mage robes' },
    dialogue: {
      greeting: {
        text: 'Come to Dragonsreach to discuss the ongoing hostilities, like the rest of the great warriors? Or are you one of the few who has the aptitude for magic?',
        options: []
      }
    },
    schedule: [{ time: 12, location: 'loc_es_whiterun', action: 'researching' }]
  },
  npc_es_savos_aren: {
    id: 'npc_es_savos_aren',
    name: 'Savos Aren',
    description: 'The Arch-Mage of the College of Winterhold. He seems distant and aloof, carrying the weight of past regrets.',
    danger: 85,
    affinity: 0,
    attraction: 0,
    state: 'neutral',
    visuals: { race: 'dark_elf', gender: 'male', age: 'elder', attire: 'arch-mage robes' },
    dialogue: {
      greeting: {
        text: 'Please, please, I have important things to attend to. Speak with Mirabelle if you need something.',
        options: []
      }
    },
    schedule: [{ time: 10, location: 'loc_es_college_winterhold', action: 'wandering' }]
  },
  npc_es_faralda: {
    id: 'npc_es_faralda',
    name: 'Faralda',
    description: 'An Altmer destruction mage at the College of Winterhold. She guards the bridge and tests aspiring students.',
    danger: 75,
    affinity: 0,
    attraction: 0,
    state: 'neutral',
    visuals: { race: 'high_elf', gender: 'female', age: 'adult', attire: 'mage robes' },
    dialogue: {
      greeting: {
        text: 'Cross the bridge at your own peril! The way is dangerous, and the gate will not open for just anyone.',
        options: []
      }
    },
    schedule: [{ time: 8, location: 'loc_es_college_winterhold', action: 'guarding' }]
  },
  npc_es_maiq: {
    id: 'npc_es_maiq',
    name: 'M\\'aiq the Liar',
    description: 'A traveling Khajiit known for his cryptic and often meta-humorous remarks. No one knows how old he really is.',
    danger: 10,
    affinity: 0,
    attraction: 0,
    state: 'neutral',
    visuals: { race: 'khajiit', gender: 'male', age: 'adult', attire: 'hooded robes' },
    dialogue: {
      greeting: {
        text: 'M\\'aiq knows much, tells some. M\\'aiq knows many things others do not.',
        options: []
      }
    },
    schedule: [{ time: 12, location: 'loc_es_imperial_city', action: 'traveling' }]
  },
  npc_es_dwemer_centurion: {
    id: 'npc_es_dwemer_centurion',
    name: 'Dwemer Centurion',
    description: 'A massive, towering automaton of bronze and steam, left behind by the vanished Dwemer to guard their most precious secrets.',
    danger: 95,
    affinity: -50,
    attraction: 0,
    state: 'hostile',
    visuals: { race: 'construct', gender: 'none', age: 'ancient', attire: 'bronze armor' },
    dialogue: {
      greeting: { text: '*Hissing steam and grinding gears*', options: [] }
    },
    schedule: [{ time: 0, location: 'loc_es_blackreach', action: 'patrolling' }]
  },
`;

code = code.replace(/};\s*$/, newNPCs + '\n};\n');
fs.writeFileSync(file, code);
