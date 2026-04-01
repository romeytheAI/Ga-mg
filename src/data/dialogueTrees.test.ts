import { describe, expect, it } from 'vitest';
import { DIALOGUE_TREES } from './dialogueTrees';
import { LOCATIONS } from './locations';
import { ENCOUNTERS } from './encounters';

describe('dialogue tree integrity', () => {
  it('all dialogue trees should have valid start and next nodes', () => {
    for (const [treeId, tree] of Object.entries(DIALOGUE_TREES)) {
      expect(tree.start_node, `${treeId} missing start node`).toBeTruthy();
      expect(tree.nodes[tree.start_node], `${treeId} start node missing`).toBeDefined();

      for (const [nodeId, node] of Object.entries(tree.nodes)) {
        expect(node.id).toBe(nodeId);
        expect(node.narrative_text, `${treeId}:${nodeId} missing narrative`).toBeTruthy();
        expect(node.choices.length, `${treeId}:${nodeId} missing choices`).toBeGreaterThan(0);

        for (const choice of node.choices) {
          if (choice.next_node) {
            expect(tree.nodes[choice.next_node], `${treeId}:${nodeId} points to missing node ${choice.next_node}`).toBeDefined();
          } else {
            expect(choice.end_dialogue, `${treeId}:${nodeId} choice ${choice.id} should end or continue`).toBe(true);
          }
        }
      }
    }
  });

  it('every social NPC talk action should resolve to a dialogue tree', () => {
    for (const location of Object.values(LOCATIONS) as any[]) {
      for (const action of location.actions) {
        if (action.npc && action.intent === 'social') {
          const explicitTree = action.story_event ? DIALOGUE_TREES[action.story_event] : undefined;
          const implicitTree = DIALOGUE_TREES[`${action.npc}_social`];
          expect(Boolean(explicitTree || implicitTree), `${location.id}:${action.id} should map to a dialogue tree`).toBe(true);
        }
      }
    }
  });

  it('key random encounters should have multi-step story trees', () => {
    const encounterIds = [
      'alley_mugger',
      'creepy_noble',
      'school_bully',
      'beach_scavenger',
      'shopping_pickpocket',
      'tavern_brawl',
      'noble_kidnapper',
      'desperate_beggar',
      'wandering_merchant',
    ];

    for (const encounterId of encounterIds) {
      expect(ENCOUNTERS.find((enc: any) => enc.id === encounterId), `${encounterId} missing from encounter data`).toBeDefined();
      expect(DIALOGUE_TREES[`${encounterId}_story`], `${encounterId} missing multi-step story tree`).toBeDefined();
    }
  });
});
