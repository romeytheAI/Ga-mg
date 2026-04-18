import { LOCATIONS } from '../data/locations';
import { DIALOGUE_TREES, DialogueChoice, DialogueTree } from '../data/dialogueTrees';
import { ActiveStoryEvent } from '../types';

export interface StoryEventParsedText {
  narrative_text: string;
  follow_up_choices: DialogueChoice[];
  image_url?: string;
  stat_deltas?: Record<string, number>;
  skill_deltas?: Record<string, number>;
  new_location?: string;
}

export interface StoryEventResolution {
  nextStoryEvent: ActiveStoryEvent | null;
  parsedText: StoryEventParsedText;
}

export function startStoryEvent(eventId: string, treeMap: Record<string, DialogueTree> = DIALOGUE_TREES): StoryEventResolution | null {
  const tree = treeMap[eventId];
  if (!tree) return null;

  const startNode = tree.nodes[tree.start_node];
  if (!startNode) return null;

  return {
    nextStoryEvent: { id: eventId, current_node: tree.start_node },
    parsedText: {
      narrative_text: startNode.narrative_text,
      follow_up_choices: startNode.choices,
      image_url: startNode.image_url,
    },
  };
}

export function resolveStoryEventStep(
  activeStoryEvent: ActiveStoryEvent,
  actionId?: string,
  treeMap: Record<string, DialogueTree> = DIALOGUE_TREES,
): StoryEventResolution | null {
  const tree = treeMap[activeStoryEvent.id];
  if (!tree) return null;

  const currentNodeId = activeStoryEvent.current_node;
  const currentNode = tree.nodes[currentNodeId];
  if (!currentNode) return null;

  const choice = actionId
    ? currentNode.choices.find(c => c.id === actionId)
    : null;

  if (choice?.end_dialogue) {
    return {
      nextStoryEvent: null,
      parsedText: {
        narrative_text: currentNode.narrative_text || 'You step away.',
        follow_up_choices: choice.new_location ? (LOCATIONS[choice.new_location]?.actions || []).map((action: any) => ({ ...action })) : [],
        stat_deltas: choice.stat_deltas,
        skill_deltas: choice.skill_deltas,
        new_location: choice.new_location,
      },
    };
  }

  const nextNodeId = choice?.next_node || currentNodeId;
  const nextNode = tree.nodes[nextNodeId];
  if (!nextNode) return null;

  return {
    nextStoryEvent: { id: activeStoryEvent.id, current_node: nextNodeId },
    parsedText: {
      narrative_text: nextNode.narrative_text,
      follow_up_choices: nextNode.choices,
      image_url: nextNode.image_url,
    },
  };
}
