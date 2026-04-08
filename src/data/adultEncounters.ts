import { GameState } from '../../types';

export interface AdultEncounter {
  id: string;
  title: string;
  description: string;
  min_corruption?: number;
  max_corruption?: number;
  requires_attribute?: string;
  location_requirements?: string[];
  outcomes: AdultOutcome[];
}

export interface AdultOutcome {
  id: string;
  text: string;
  stat_deltas: Record<string, number>;
  relationship_change?: number;
  romance_change?: number;
  corruption_change?: number;
}

export const ADULT_ENCOUNTERS: AdultEncounter[] = [
  {
    id: 'adult_kiss_first',
    title: 'First Kiss',
    description: 'The moment finally comes. Your first kiss with your beloved.',
    min_corruption: 0,
    outcomes: [
      { id: 'kiss_gentle', text: 'Soft, tender, perfect. Time stops as your lips meet.', stat_deltas: { romance: 15, stress: -10 }, romance_change: 10 },
      { id: 'kiss_passionate', text: 'Passion takes over. You pull them close and lose yourselves in each other.', stat_deltas: { romance: 20, corruption: 5 }, romance_change: 15 },
      { id: 'kiss_awkward', text: 'Your teeth knock together awkwardly. You both laugh, easing the tension.', stat_deltas: { romance: 5, stress: 5 } }
    ]
  },
  {
    id: 'adult_intimacy',
    title: 'Intimate Night',
    description: 'You spend the night together. The closest two people can be.',
    min_corruption: 10,
    outcomes: [
      { id: 'intimacy_love', text: 'Making love with someone you love is beyond words. Hearts beat as one.', stat_deltas: { romance: 30, corruption: 5, health: -10 }, romance_change: 25 },
      { id: 'intimacy_pleasure', text: 'Bodies entwine in pleasures of the flesh. Nothing else matters in this moment.', stat_deltas: { corruption: 15, stress: -20 }, romance_change: 5 },
      { id: 'intimacy_experimentation', text: 'You try things you\'ve only imagined. Some work, some don\'t. The exploration is fun.', stat_deltas: { corruption: 20, skills: 5 }, romance_change: 5 }
    ]
  },
  {
    id: 'adult_temptation',
    title: 'Temptation',
    description: 'Someone offers themselves to you. Do you accept?',
    min_corruption: 20,
    outcomes: [
      { id: 'temptation_accept', text: 'You accept. One night of pleasure, no strings attached.', stat_deltas: { corruption: 25, stress: -15 }, romance_change: -5 },
      { id: 'temptation_resist', text: 'You resist the temptation. Your will is stronger than your desires.', stat_deltas: { willpower: 15, corruption: -5 },
      { id: 'temptation_negotiate', text: 'You make them an offer - perhaps something else could satisfy them...', stat_deltas: { corruption: 10, gold: -20 } }
    ]
  },
  {
    id: 'adult_capture',
    title: 'Captured',
    description: 'You\'ve been captured. Your captor has... intentions.',
    min_corruption: 0,
    outcomes: [
      { id: 'capture_escape', text: 'You fight your way free, escaping before anything happens.', stat_deltas: { health: -20, corruption: -5, willpower: 10 } },
      { id: 'capture_resist', text: 'You resist fiercely, but they\'re stronger. Still, you won\'t break easily.', stat_deltas: { health: -30, corruption: 10, willpower: 15 } },
      { id: 'capture_submit', text: 'Exhausted and broken, you submit. This is your life now.', stat_deltas: { corruption: 50, romance: -20, willpower: -20 } }
    ]
  },
  {
    id: 'adult_corruption_ritual',
    title: 'Dark Ritual',
    description: 'You\'ve found followers of a dark power. They offer transformation.',
    min_corruption: 30,
    outcomes: [
      { id: 'ritual_accept', text: 'You submit to the ritual. Something old and powerful fills you.', stat_deltas: { corruption: 40, skills: { magic: 20 } }, relationship_change: -10 },
      { id: 'ritual_participate', text: 'You participate, giving only enough to gain power without full commitment.', stat_deltas: { corruption: 20, skills: { magic: 10 } } },
      { id: 'ritual_interrupt', text: 'You destroy the ritual, scattering the cultists.', stat_deltas: { corruption: -10, willpower: 20 } }
    ]
  },
  {
    id: 'adult_pleasure_debt',
    title: 'Pleasure Debt',
    description: 'You owe someone a... personal favor. They want payment.',
    min_corruption: 15,
    outcomes: [
      { id: 'debt_pay', text: 'You pay with your body. It\'s just sex, nothing more.', stat_deltas: { corruption: 15, gold: 50, stress: -5 } },
      { id: 'debt_refuse', text: 'You refuse. Some debts aren\'t worth paying.', stat_deltas: { willpower: 10, relationship: -15 } },
      { id: 'debt_negotiate', text: 'You negotiate an alternative payment.', stat_deltas: { corruption: 5, gold: 30 } }
    ]
  },
  {
    id: 'adult_hidden_desire',
    title: 'Hidden Desires Revealed',
    description: 'Someone confesses their secret desires to you.',
    min_corruption: 0,
    outcomes: {
      'desire_explore': { text: 'Their confession excites you. Perhaps you could explore together?', stat_deltas: { romance: 10, corruption: 10 } },
      'desire_reject': { text: 'You reject their confession, but keep their secret.', stat_deltas: { relationship: -5 } },
      'desire_judge': { text: 'You judge them for their desires. They flee in shame.', stat_deltas: { corruption: -5, relationship: -20 } }
    }
  },
  {
    id: 'adult_group_encounter',
    title: 'Group Situation',
    description: 'You find yourself in a group situation. The attention is... overwhelming.',
    min_corruption: 40,
    outcomes: [
      { id: 'group_join', text: 'You join in. There\'s safety in numbers, and pleasure in the crowd.', stat_deltas: { corruption: 35, stress: -25 } },
      { id: 'group_watch', text: 'You watch. The display is instructive, and arousing.', stat_deltas: { corruption: 15, skills: { seduction: 5 } } },
      { id: 'group_leave', text: 'You leave before things go further. Some experiences aren\'t for you.', stat_deltas: { willpower: 5 } }
    ]
  },
  {
    id: 'adult_bestiality_encounter',
    title: 'Beast Encounter',
    description: 'A creature approaches with... non-human intentions.',
    min_corruption: 50,
    location_requirements: ['riften_outskirts'],
    outcomes: [
      { id: 'beast_submit', text: 'You submit to the creature\'s desires. It\'s primal, raw, animalistic.', stat_deltas: { corruption: 60, health: -20, transformation: 1 } },
      { id: 'beast_fight', text: 'You fight the beast off! Your will is your own!', stat_deltas: { health: -25, corruption: -10, willpower: 20 } },
      { id: 'beast_escape', text: 'You run, barely escaping. The encounter leaves you shaken.', stat_deltas: { stress: 20, corruption: 5 } }
    ]
  },
  {
    id: 'adult_bondage',
    title: 'Bound',
    description: 'You find yourself bound. Your captor wants to play.',
    min_corruption: 20,
    outcomes: [
      { id: 'bondage_struggle', text: 'You struggle against the bonds. They hold fast.', stat_deltas: { health: -10, willpower: 15 } },
      { id: 'bondage_surrender', text: 'You stop fighting. Whatever happens, happens.', stat_deltas: { corruption: 25, stress: -10 } },
      { id: 'bondage_manipulate', text: 'You use your chains as weapons, breaking free.', stat_deltas: { health: -5, willpower: 20, corruption: -5 } }
    ]
  },
  {
    id: 'adult_whore_encounter',
    title: 'Visiting a Professional',
    description: 'You visit a house of pleasure. They specialize in... fulfilling needs.',
    min_corruption: 10,
    outcomes: [
      { id: 'whore_basic', text: 'Basic services. It takes the edge off.', stat_deltas: { gold: -30, stress: -15 } },
      { id: 'whore_extended', text: 'You spend hours. They\'re very... talented.', stat_deltas: { gold: -80, corruption: 10, stress: -25 } },
      { id: 'whore_fetish', text: 'You ask for something specific. They accommodate.', stat_deltas: { gold: -50, corruption: 15 } }
    ]
  },
  {
    id: 'adult_exhibition',
    title: 'Exhibition',
    description: 'You\'re caught in a compromising position. People are watching.',
    min_corruption: 15,
    outcomes: [
      { id: 'exhibit_continue', text: 'You continue, giving them a show.', stat_deltas: { corruption: 20, relationship: -5, stress: -5 } },
      { id: 'exhibit_stop', text: 'You stop, embarrassed. But the damage is done.', stat_deltas: { stress: 15, relationship: -10 } },
      { id: 'exhibit_lean', text: 'You lean into it. Let them watch!', stat_deltas: { corruption: 25, romance: 5 } }
    ]
  },
  {
    id: 'adult_vampire_bite',
    title: 'Vampiric Intimacy',
    description: 'A vampire offers... intimacy of a deadly kind.',
    min_corruption: 30,
    location_requirements: ['riften_outskirts'],
    outcomes: [
      { id: 'vampire_bite_accept', text: 'They bite as they make love. Pain and pleasure merge.', stat_deltas: { corruption: 35, health: -20, disease: 'vampirism', romance: 10 } },
      { id: 'vampire_bite_pleasure', text: 'The venom numbs you. It feels incredible.', stat_deltas: { corruption: 25, health: -15 } },
      { id: 'vampire_bite_resist', text: 'You pull away before they can feed.', stat_deltas: { willpower: 15, corruption: -5 } }
    ]
  },
  {
    id: 'adult_daedra_gift',
    title: 'Daedric Gift',
    description: 'A Daedric Prince offers you a gift of the flesh.',
    min_corruption: 40,
    outcomes: [
      { id: 'daedra_accept', text: 'You accept. The Prince\'s gift is... overwhelming.', stat_deltas: { corruption: 50, skills: { magic: 25 }, health: -20 } },
      { id: 'daedra_barter', text: 'You negotiate. Perhaps another gift would do?', stat_deltas: { corruption: 15, skills: { magic: 10 } },
      { id: 'daedra_refuse', text: 'You refuse. Some prices are too high.', stat_deltas: { willpower: 25, corruption: -10 } }
    ]
  },
  {
    id: 'adult_gangbang',
    title: '群交 Encounter',
    description: 'Multiple partners want you. At once.',
    min_corruption: 45,
    outcomes: [
      { id: 'orgy_join', text: 'You join. The pleasures are overwhelming, endless.', stat_deltas: { corruption: 40, stress: -30, health: -15 } },
      { id: 'orgy_watch', text: 'You watch, learning techniques for later.', stat_deltas: { corruption: 15, skills: { seduction: 10 } },
      { id: 'orgy_leave', text: 'Too much. You leave before joining.', stat_deltas: { willpower: 5, corruption: 5 } }
    ]
  },
  {
    id: 'adult_public',
    title: 'Public Display',
    description: 'You have sex in a public place. The risk adds excitement.',
    min_corruption: 25,
    location_requirements: ['the_bee_and_barb', 'riften_market'],
    outcomes: [
      { id: 'public_success', text: 'No one catches you. The thrill is half the fun.', stat_deltas: { corruption: 15, romance: 5 } },
      { id: 'public_caught', text: 'People see you! Some are shocked, others... interested.', stat_deltas: { corruption: 20, relationship: -10, stress: 10 } },
      { id: 'public_arrested', text: 'The guards catch you. Public indecency!', stat_deltas: { gold: -100, corruption: -5, relationship: -15 } }
    ]
  },
  {
    id: 'adult_breeding',
    title: 'Breeding',
    description: 'Someone wants to breed with you. For progeny, power, or pleasure.',
    min_corruption: 20,
    outcomes: [
      { id: 'breed_agree', text: 'You agree. The act is intense, primal.', stat_deltas: { romance: 10, corruption: 10 } },
      { id: 'breed_pregnancy', text: 'You conceive. Your life changes forever.', stat_deltas: { corruption: 15, pregnancy: 1 } },
      { id: 'breed_refuse', text: 'You refuse. Not now, not with them.', stat_deltas: { willpower: 10, relationship: -10 } }
    ]
  },
  {
    id: 'adult_oral',
    title: 'Oral Favor',
    description: 'Someone offers to please you with their mouth.',
    min_corruption: 5,
    outcomes: [
      { id: 'oral_accept', text: 'You accept. Their skills are remarkable.', stat_deltas: { corruption: 10, stress: -20, romance: 5 } },
      { id: 'oral_give', text: 'You return the favor. Equality in pleasure.', stat_deltas: { corruption: 10, romance: 10 } },
      { id: 'oral_decline', text: 'Not tonight. Some other time.', stat_deltas: { relationship: -2 } }
    ]
  },
  {
    id: 'adult_anatomy_race',
    title: 'Racial Intimacy',
    description: 'Being intimate with someone of a different race brings unique experiences.',
    min_corruption: 10,
    outcomes: [
      { id: 'race_khajiit_fur', text: 'Their fur is so soft, their purring adds vibration to every touch.', stat_deltas: { corruption: 10, romance: 5 } },
      { id: 'race_argonian_scales', text: 'Their scales are warm to the touch, their tail adds new possibilities.', stat_deltas: { corruption: 10, romance: 5 } },
      { id: 'race_dunmer_dark', text: 'Their dark skin contrasts beautifully with yours, their movements are ancient and graceful.', stat_deltas: { corruption: 10, romance: 5 } },
      { id: 'race_altmer_long', text: 'Their elongated form moves with otherworldly elegance.', stat_deltas: { corruption: 10, skills: { magic: 3 } } }
    ]
  }
];

export function getAdultEncounter(state: GameState): AdultEncounter | null {
  const possibleEncounters = ADULT_ENCOUNTERS.filter(encounter => {
    if (encounter.min_corruption !== undefined && state.player.corruption < encounter.min_corruption) return false;
    if (encounter.max_corruption !== undefined && state.player.corruption > encounter.max_corruption) return false;
    if (encounter.location_requirements && !encounter.location_requirements.includes(state.location)) return false;
    return true;
  });
  
  if (possibleEncounters.length === 0) return null;
  
  const index = Math.floor(Math.random() * possibleEncounters.length);
  return possibleEncounters[index];
}

export function resolveAdultEncounter(encounterId: string, outcomeId: string): { text: string; stat_deltas: Record<string, number> } | null {
  const encounter = ADULT_ENCOUNTERS.find(e => e.id === encounterId);
  if (!encounter) return null;
  
  const outcome = encounter.outcomes.find(o => o.id === outcomeId);
  if (!outcome) return null;
  
  return { text: outcome.text, stat_deltas: outcome.stat_deltas };
}