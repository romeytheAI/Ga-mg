export const NPCS: Record<string, any> = {
  'constance_michel': {
    id: 'constance_michel',
    name: "Sister Constance",
    race: "Human",
    relationship: 20,
    description: "The assistant at the orphanage. She is a young woman, barely out of her teens, who tries her best to be kind. However, she is clearly exhausted, overworked, and terrified of Matron Grelod. She often sneaks extra food to the younger children when Grelod isn't looking.",
    responses: {
      'social': { narrative_text: "She smiles sadly at you, her eyes darting nervously towards the matron's office. 'Eat quickly, little one. Before she sees you have extra.'", stat_deltas: { stress: -5, willpower: 2 } },
      'work': { narrative_text: "'Thank you for the help. You're a good child. I'll try to sneak you an extra blanket tonight, it's going to be freezing.'", stat_deltas: { stress: -10, purity: 2 } }
    }
  },
  'grelod_the_kind': {
    id: 'grelod_the_kind',
    name: "Matron Grelod",
    race: "Human",
    relationship: -50,
    description: "The headmistress of the orphanage, ironically nicknamed 'The Kind'. A bitter, cruel, and aging woman who takes sadistic pleasure in the suffering of the children in her care. Rumors say she was once a beautiful noblewoman who lost everything, though her current state of perpetual rage makes that hard to believe. She wields a heavy leather belt and a wooden cane, both of which she uses frequently and without hesitation.",
    responses: {
      'social': { narrative_text: "She glares at you, her face a mask of pure hatred, spittle flying from her lips. 'Back to work, you lazy, worthless brat! Or it's the belt for you, and no supper!' She raises her cane threateningly.", stat_deltas: { stress: 20, pain: 5, trauma: 5 } },
      'work': { narrative_text: "She inspects your work with a sneer, running a bony finger over a perfectly clean surface. 'You missed a spot. Do it again, all of it, or you'll sleep in the cellar with the rats!'", stat_deltas: { stamina: -15, stress: 10 } }
    }
  },
  'brynjolf': {
    id: 'brynjolf',
    name: "Brynjolf",
    race: "Human",
    relationship: 0,
    description: "A smooth-talking, charismatic rogue who seems to know everyone's business in the town. He usually hangs around the market square, looking for easy marks or potential recruits for his 'organization'. He wears fine, if slightly worn, leather armor.",
    responses: {
      'social': { narrative_text: "He leans against a stall, tossing a coin in the air. 'Never done an honest day's work in your life for all that coin you're carrying, eh lass? You've got the look of a survivor.'", stat_deltas: { stress: 5, lust: 5 } },
      'work': { narrative_text: "He watches you work with an amused expression. 'Keep your hands quick and your eyes open. The alleys are no place for the slow, and neither is this market.'", stat_deltas: { willpower: 5 } }
    }
  },
  'brand_shei': {
    id: 'brand_shei',
    name: "Brand-Shei",
    race: "Elf",
    relationship: 10,
    description: "A Dark Elf merchant in the town square. Unlike many others, he seems genuinely kind and fair in his dealings. He sells a variety of exotic goods and often takes pity on the local orphans, occasionally offering them small tasks for decent pay.",
    responses: {
      'social': { narrative_text: "He offers a warm, genuine smile. 'Ah, a customer. Or just browsing? Either way, welcome to my humble stall. Stay out of trouble, young one.'", stat_deltas: { stress: -5 } },
      'work': { narrative_text: "He hands you a small broom. 'I could use a hand organizing these wares and sweeping up, if you're looking for a few honest coins.'", stat_deltas: { stamina: -10 } }
    }
  }
};
