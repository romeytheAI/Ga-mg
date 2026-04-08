export interface NPCReaction {
  narrative_text: string;
  stat_deltas: Record<string, number>;
}

export type RelationshipTier = 'hostile' | 'cold' | 'neutral' | 'warm' | 'intimate';
export type Intent = 'social' | 'flirt' | 'work' | 'threaten' | 'gift' | 'tease' | 'comfort' | 'confide' | 'beg' | 'praise' | 'kiss' | 'hold_hands' | 'cuddle' | 'confess' | 'date';

export const NPC_REACTION_VARIANTS: Record<string, Record<string, Record<RelationshipTier, NPCReaction[]>>> = {
  npc_es_brynda: {
    social: {
      hostile: [
        { narrative_text: "Brynda's eyes narrow. 'I've got nothing to say to the likes of you.'", stat_deltas: { relationship: -2 } }
      ],
      cold: [
        { narrative_text: "'What do you want?' Brynda asks, wiping a glass slowly.", stat_deltas: { relationship: 0 } }
      ],
      neutral: [
        { narrative_text: "Brynda smiles. 'Welcome to the Bee and Barb. Drink up.'", stat_deltas: { relationship: 2 } }
      ],
      warm: [
        { narrative_text: "'There you are! I saved your usual seat by the fire.'", stat_deltas: { relationship: 5 } }
      ],
      intimate: [
        { narrative_text: "Brynda leans close. 'You've become like family to me.'", stat_deltas: { relationship: 10 } }
      ]
    },
    flirt: {
      hostile: [
        { narrative_text: "'Keep your eyes to yourself,' Brynda snarls.", stat_deltas: { relationship: -5 } }
      ],
      cold: [
        { narrative_text: "Brynda raises an eyebrow. 'That's not appropriate.'", stat_deltas: { relationship: -1 } }
      ],
      neutral: [
        { narrative_text: "'You're charming, I'll give you that,' Brynda laughs.", stat_deltas: { romance: 3, relationship: 3 } }
      ],
      warm: [
        { narrative_text: "'Perhaps we could talk more... after closing,' Brynda whispers.", stat_deltas: { romance: 10, relationship: 5 } }
      ],
      intimate: [
        { narrative_text: "Brynda takes your hand. 'I've been waiting for you to notice.'", stat_deltas: { romance: 15, relationship: 10 } }
      ]
    },
    work: {
      hostile: [
        { narrative_text: "'I don't need your help,' Brynda says coldly.", stat_deltas: { relationship: -2 } }
      ],
      cold: [
        { narrative_text: "'You can help with the dishes. Don't break anything.'", stat_deltas: { gold: 10 } }
      ],
      neutral: [
        { narrative_text: "'Good help is hard to find. Welcome to the team.'", stat_deltas: { gold: 25, relationship: 3 } }
      ],
      warm: [
        { narrative_text: "'I knew I could count on you. You've got a good heart.'", stat_deltas: { gold: 30, relationship: 5 } }
      ],
      intimate: [
        { narrative_text: "'Working beside you... it's like a dream,' Brynda smiles.", stat_deltas: { gold: 35, relationship: 10, romance: 5 } }
      ]
    },
    comfort: {
      hostile: [
        { narrative_text: "'I don't need sympathy from strangers,' Brynda turns away.", stat_deltas: { relationship: -1 } }
      ],
      cold: [
        { narrative_text: "'...Thanks. Just do your job.'", stat_deltas: { relationship: 2 } }
      ],
      neutral: [
        { narrative_text: "'That's kind of you. Times have been hard.'", stat_deltas: { relationship: 5, stress: -5 } }
      ],
      warm: [
        { narrative_text: "'You always know what to say. I'm glad you're here.'", stat_deltas: { relationship: 10, stress: -10 } }
      ],
      intimate: [
        { narrative_text: "Brynda leans into your embrace. 'Stay with me a while?'", stat_deltas: { relationship: 15, stress: -15, romance: 5 } }
      ]
    }
  },
  npc_es_mjoll: {
    social: {
      hostile: [
        { narrative_text: "Mjoll glares. 'I know your type. Trouble.'", stat_deltas: { relationship: -5 } }
      ],
      cold: [
        { narrative_text: "'You there. Don't cause problems.'", stat_deltas: { relationship: 0 } }
      ],
      neutral: [
        { narrative_text: "'Greetings, traveler. Looking for work?'", stat_deltas: { relationship: 2 } }
      ],
      warm: [
        { narrative_text: "'Ah, it's you! Good to see a friendly face in this city.'", stat_deltas: { relationship: 8 } }
      ],
      intimate: [
        { narrative_text: "Mjoll smiles softly. 'I was hoping I'd see you today.'", stat_deltas: { relationship: 15 } }
      ]
    },
    flirt: {
      hostile: [
        { narrative_text: "'Not interested,' Mjoll walks away.", stat_deltas: { relationship: -5 } }
      ],
      cold: [
        { narrative_text: "'Focus on the mission,' Mjoll says, not meeting your eyes.", stat_deltas: { romance: 1 } }
      ],
      neutral: [
        { narrative_text: "'You're not bad in a fight. I respect that.'", stat_deltas: { romance: 5 } }
      ],
      warm: [
        { narrative_text: "'When this is over... maybe we could celebrate together?'", stat_deltas: { romance: 10 } }
      ],
      intimate: [
        { narrative_text: "'I've been waiting to tell you... I love you,' Mjoll whispers.", stat_deltas: { romance: 20, relationship: 10 } }
      ]
    },
    work: {
      hostile: [
        { narrative_text: "'I don't need a partner. Especially not you.'", stat_deltas: { relationship: -5 } }
      ],
      cold: [
        { narrative_text: "'You can carry supplies. Don't slow me down.'", stat_deltas: { relationship: 1 } }
      ],
      neutral: [
        { narrative_text: "'Good, you can help with these bandits. Follow my lead.'", stat_deltas: { gold: 20, relationship: 3 } }
      ],
      warm: [
        { narrative_text: "'With you at my side, we can really make a difference.'", stat_deltas: { gold: 30, relationship: 10 } }
      ],
      intimate: [
        { narrative_text: "'Fighting together... it's how I knew I loved you.'", stat_deltas: { gold: 40, relationship: 15, romance: 10 } }
      ]
    },
    comfort: {
      hostile: [
        { narrative_text: "'I don't need comfort. I'm a warrior.'", stat_deltas: { relationship: -2 } }
      ],
      cold: [
        { narrative_text: "'...Thanks. I suppose.'", stat_deltas: { relationship: 2 } }
      ],
      neutral: [
        { narrative_text: "'The city is cruel, but we endure.'", stat_deltas: { stress: -5, relationship: 3 } }
      ],
      warm: [
        { narrative_text: "'Having you here... it means everything to me.'", stat_deltas: { stress: -10, relationship: 10 } }
      ],
      intimate: [
        { narrative_text: "'Hold me. Just for a moment,' Mjoll sighs, resting her head on your shoulder.", stat_deltas: { stress: -20, relationship: 15, romance: 5 } }
      ]
    }
  }
};