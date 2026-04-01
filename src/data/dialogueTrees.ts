export interface DialogueChoice {
  id: string;
  label: string;
  intent?: string;
  next_node?: string;
  end_dialogue?: boolean;
  stat_deltas?: any;
  skill_deltas?: any;
  new_items?: any[];
  new_location?: string;
  skill_check?: { stat: string; difficulty: number };
}

export interface DialogueNode {
  id: string;
  narrative_text: string;
  choices: DialogueChoice[];
  image_url?: string;
}

export interface DialogueTree {
  id: string;
  npc_id?: string;
  start_node: string;
  nodes: Record<string, DialogueNode>;
}

export const DIALOGUE_TREES: Record<string, DialogueTree> = {
  'constance_secret_bread': {
    id: 'constance_secret_bread',
    npc_id: 'constance_michel',
    start_node: 'start',
    nodes: {
      'start': {
        id: 'start',
        narrative_text: "Sister Constance glances nervously around the hallway. 'You look so thin. I shouldn't be doing this, but Matron is distracted in her office.' She pulls a slightly crushed sweetroll from her apron pocket.",
        choices: [
          { id: 'take_it', label: "Take the sweetroll", intent: "social", next_node: 'take_roll' },
          { id: 'refuse', label: "Refuse it. She could get in trouble.", intent: "cautious", next_node: 'refuse_roll' },
          { id: 'demand_more', label: "Demand more food.", intent: "aggressive", next_node: 'demand' }
        ]
      },
      'take_roll': {
        id: 'take_roll',
        narrative_text: "You quickly hide the sweetroll. She smiles, visibly relieved. 'Eat it quickly, before she comes back out.'",
        choices: [
          { id: 'end', label: "Thank her and leave", end_dialogue: true, stat_deltas: { stamina: 10, stress: -5 } }
        ]
      },
      'refuse_roll': {
        id: 'refuse_roll',
        narrative_text: "She looks heartbroken but nods. 'I understand. The risk is too great. But please, be careful.'",
        choices: [
          { id: 'end', label: "Leave", end_dialogue: true, stat_deltas: { willpower: 5, purity: 5 } }
        ]
      },
      'demand': {
        id: 'demand',
        narrative_text: "She shrinks back, clutching the roll. 'I... I don't have any more! Please, keep your voice down!' You've frightened her.",
        choices: [
          { id: 'end', label: "Snatch it and run", end_dialogue: true, stat_deltas: { stamina: 10, trauma: 5, purity: -10 } }
        ]
      }
    }
  },
  'alley_mugger_multi': {
    id: 'alley_mugger_multi',
    start_node: 'start',
    nodes: {
      'start': {
        id: 'start',
        narrative_text: "A thug steps out of the shadows, twirling a rusted dagger. 'Hand over the coin, little bird, and maybe I won't clip your wings.'",
        choices: [
          { id: 'pay', label: "Hand over 10 gold", intent: "submissive", next_node: 'paid' },
          { id: 'fight', label: "Fight back", intent: "aggressive", next_node: 'combat_start' },
          { id: 'run', label: "Try to run past", intent: "stealth", skill_check: { stat: "athletics", difficulty: 30 }, next_node: 'run_attempt' }
        ]
      },
      'paid': {
        id: 'paid',
        narrative_text: "You drop the coins. He snatches them up with a greedy grin. 'Smart bird. Now fly away.'",
        choices: [
          { id: 'end', label: "Leave quickly", end_dialogue: true, stat_deltas: { stress: 10, gold: -10 } }
        ]
      },
      'combat_start': {
        id: 'combat_start',
        narrative_text: "You raise your fists. He laughs, 'Oh, we got a fighter!'",
        choices: [
          { id: 'end', label: "Enter combat", end_dialogue: true, intent: "aggressive" } // This would transition to the normal combat loop
        ]
      },
      'run_attempt': {
        id: 'run_attempt',
        narrative_text: "You dash past him, narrowly dodging his grasping hand!",
        choices: [
          { id: 'end', label: "Escape into the market", end_dialogue: true, new_location: 'town_square', stat_deltas: { stamina: -10 } }
        ]
      }
    }
  }
};
