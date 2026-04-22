import { describe, it, expect } from 'vitest';
import { resolveStoryEventStep, startStoryEvent, StoryEventResolution } from '../storyEventEngine';
import { DialogueTree } from '../../data/dialogueTrees';

// Test-specific dialogue tree with multi-step branching
const testTree: DialogueTree = {
  id: 'test_quest',
  npc_id: 'test_npc',
  start_node: 'intro',
  nodes: {
    intro: {
      id: 'intro',
      narrative_text: 'A stranger approaches you in the market.',
      choices: [
        { id: 'greet', label: 'Greet them', intent: 'social', next_node: 'greeting' },
        { id: 'ignore', label: 'Ignore them', intent: 'neutral', next_node: 'ignored' },
        { id: 'threaten', label: 'Threaten them', intent: 'aggressive', next_node: 'threatened' },
      ],
    },
    greeting: {
      id: 'greeting',
      narrative_text: 'They smile and offer you a deal.',
      choices: [
        { id: 'accept_deal', label: 'Accept the deal', next_node: 'deal_accepted' },
        { id: 'reject_deal', label: 'Walk away', end_dialogue: true, stat_deltas: { stress: -5 } },
      ],
    },
    deal_accepted: {
      id: 'deal_accepted',
      narrative_text: 'You shake hands. A new chapter begins.',
      choices: [
        { id: 'end_deal', label: 'Conclude', end_dialogue: true, stat_deltas: { willpower: 5 }, skill_deltas: { skulduggery: 2 } },
      ],
    },
    ignored: {
      id: 'ignored',
      narrative_text: 'They shrug and disappear into the crowd.',
      choices: [
        { id: 'end_ignore', label: 'Continue', end_dialogue: true },
      ],
    },
    threatened: {
      id: 'threatened',
      narrative_text: 'They back away, fear in their eyes.',
      choices: [
        { id: 'end_threat', label: 'Walk away menacingly', end_dialogue: true, stat_deltas: { stress: 3, purity: -5 } },
      ],
    },
  },
};

const treeMap = { test_quest: testTree };

describe('storyEventEngine - multi-step progression', () => {
  it('starts a story event from the correct start node', () => {
    const result = startStoryEvent('test_quest', treeMap);
    expect(result).not.toBeNull();
    expect(result!.nextStoryEvent?.id).toBe('test_quest');
    expect(result!.nextStoryEvent?.current_node).toBe('intro');
    expect(result!.parsedText.narrative_text).toBe('A stranger approaches you in the market.');
    expect(result!.parsedText.follow_up_choices).toHaveLength(3);
  });

  it('returns null for nonexistent event', () => {
    const result = startStoryEvent('nonexistent', treeMap);
    expect(result).toBeNull();
  });

  it('advances to next node on choice with next_node', () => {
    const active = { id: 'test_quest', current_node: 'intro' };
    const result = resolveStoryEventStep(active, 'greet', treeMap);
    expect(result).not.toBeNull();
    expect(result!.nextStoryEvent?.current_node).toBe('greeting');
    expect(result!.parsedText.narrative_text).toBe('They smile and offer you a deal.');
    expect(result!.parsedText.follow_up_choices).toHaveLength(2);
  });

  it('handles 3-step progression (intro → greeting → deal_accepted)', () => {
    let active = { id: 'test_quest', current_node: 'intro' };

    // Step 1: greet
    const step1 = resolveStoryEventStep(active, 'greet', treeMap)!;
    expect(step1.nextStoryEvent?.current_node).toBe('greeting');

    // Step 2: accept deal
    const step2 = resolveStoryEventStep(step1.nextStoryEvent!, 'accept_deal', treeMap)!;
    expect(step2.nextStoryEvent?.current_node).toBe('deal_accepted');
    expect(step2.parsedText.narrative_text).toContain('shake hands');

    // Step 3: conclude (end_dialogue)
    const step3 = resolveStoryEventStep(step2.nextStoryEvent!, 'end_deal', treeMap)!;
    expect(step3.nextStoryEvent).toBeNull(); // story completed
    expect(step3.parsedText.stat_deltas).toEqual({ willpower: 5 });
    expect(step3.parsedText.skill_deltas).toEqual({ skulduggery: 2 });
  });

  it('ends dialogue with stat_deltas on reject_deal', () => {
    const active = { id: 'test_quest', current_node: 'greeting' };
    const result = resolveStoryEventStep(active, 'reject_deal', treeMap)!;
    expect(result.nextStoryEvent).toBeNull();
    expect(result.parsedText.stat_deltas).toEqual({ stress: -5 });
  });

  it('handles the threatened branch with negative purity', () => {
    const active = { id: 'test_quest', current_node: 'intro' };
    const step1 = resolveStoryEventStep(active, 'threaten', treeMap)!;
    expect(step1.nextStoryEvent?.current_node).toBe('threatened');

    const step2 = resolveStoryEventStep(step1.nextStoryEvent!, 'end_threat', treeMap)!;
    expect(step2.nextStoryEvent).toBeNull();
    expect(step2.parsedText.stat_deltas).toEqual({ stress: 3, purity: -5 });
  });

  it('stays on current node when no valid choice ID is provided', () => {
    const active = { id: 'test_quest', current_node: 'intro' };
    const result = resolveStoryEventStep(active, undefined, treeMap);
    expect(result).not.toBeNull();
    // Should return the current node's text without advancing
    expect(result!.nextStoryEvent?.current_node).toBe('intro');
    expect(result!.parsedText.narrative_text).toBe('A stranger approaches you in the market.');
  });

  it('stays on current node for invalid choice ID', () => {
    const active = { id: 'test_quest', current_node: 'intro' };
    const result = resolveStoryEventStep(active, 'nonexistent_choice', treeMap);
    expect(result).not.toBeNull();
    expect(result!.nextStoryEvent?.current_node).toBe('intro');
  });

  it('returns null for missing tree', () => {
    const active = { id: 'missing_tree', current_node: 'start' };
    const result = resolveStoryEventStep(active, 'anything', treeMap);
    expect(result).toBeNull();
  });

  it('returns null for invalid current_node', () => {
    const active = { id: 'test_quest', current_node: 'nonexistent_node' };
    const result = resolveStoryEventStep(active, 'greet', treeMap);
    expect(result).toBeNull();
  });
});
