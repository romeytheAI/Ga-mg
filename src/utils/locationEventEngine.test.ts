import { describe, it, expect } from 'vitest';
import { resolveLocationAction, annotateActionsWithChance } from './locationEventEngine';
import { initialState } from '../state/initialState';
import { GameState } from '../types';
import { DIALOGUE_TREES, DialogueTree } from '../data/dialogueTrees';
import { LOCATIONS } from '../data/locations';
import { NPCS } from '../data/npcs';

// Thin stub NPC registry for isolated tests
const STUB_NPCS: Record<string, { responses: Record<string, any> }> = {
  stub_npc: {
    responses: {
      social: { narrative_text: 'Hello stranger.' },
      flirt:  { narrative_text: 'You look nice today.' },
    },
  },
};

// Minimal stub location registry
const STUB_LOCATIONS: Record<string, any> = {
  orphanage: LOCATIONS.orphanage,
  town_square: LOCATIONS.town_square,
};

const alwaysSucceed = () => 0;
const alwaysFail    = () => 0.99;

describe('locationEventEngine – plain action', () => {
  it('returns narrative result for a plain action with outcome', () => {
    const action = {
      id: 'test_action',
      label: 'Test',
      outcome: 'You do the thing.',
      stat_deltas: { stamina: -5 },
    };
    const result = resolveLocationAction(initialState, action, STUB_LOCATIONS, STUB_NPCS as any, DIALOGUE_TREES, alwaysSucceed);
    expect(result.kind).toBe('narrative');
    if (result.kind === 'narrative') {
      expect(result.parsedText.narrative_text).toBe('You do the thing.');
      expect(result.parsedText.stat_deltas?.stamina).toBe(-5);
    }
  });

  it('returns none for an action with no outcome and no npc', () => {
    const result = resolveLocationAction(initialState, { id: 'empty' }, STUB_LOCATIONS, STUB_NPCS as any, DIALOGUE_TREES, alwaysSucceed);
    expect(result.kind).toBe('none');
  });

  it('returns none for null action', () => {
    const result = resolveLocationAction(initialState, null, STUB_LOCATIONS, STUB_NPCS as any, DIALOGUE_TREES, alwaysSucceed);
    expect(result.kind).toBe('none');
  });
});

describe('locationEventEngine – skill checks', () => {
  it('uses success outcome when skill check passes', () => {
    const action = {
      id: 'check_action',
      outcome: 'You succeed!',
      fail_outcome: 'You fail.',
      skill_check: { stat: 'skulduggery', difficulty: 50 },
    };
    const result = resolveLocationAction(initialState, action, STUB_LOCATIONS, STUB_NPCS as any, DIALOGUE_TREES, alwaysSucceed);
    expect(result.kind).toBe('narrative');
    if (result.kind === 'narrative') {
      expect(result.parsedText.narrative_text).toBe('You succeed!');
    }
  });

  it('uses fail_outcome when skill check fails', () => {
    const action = {
      id: 'check_action',
      outcome: 'You succeed!',
      fail_outcome: 'You fail.',
      fail_stat_deltas: { stress: 5 },
      skill_check: { stat: 'skulduggery', difficulty: 50 },
    };
    const result = resolveLocationAction(initialState, action, STUB_LOCATIONS, STUB_NPCS as any, DIALOGUE_TREES, alwaysFail);
    expect(result.kind).toBe('narrative');
    if (result.kind === 'narrative') {
      expect(result.parsedText.narrative_text).toBe('You fail.');
      expect(result.parsedText.stat_deltas?.stress).toBe(5);
      expect(result.parsedText.new_items).toEqual([]);
    }
  });
});

describe('locationEventEngine – NPC interactions', () => {
  it('returns story_event for an NPC social action with a matching dialogue tree', () => {
    // Use a real NPC + tree that exists
    const action = { id: 'talk', npc: 'constance_michel', intent: 'social' };
    const result = resolveLocationAction(initialState, action, LOCATIONS, NPCS, DIALOGUE_TREES, alwaysSucceed);
    // constance_michel_social tree exists
    expect(result.kind).toBe('story_event');
    if (result.kind === 'story_event') {
      expect(result.eventId).toBe('constance_michel_social');
    }
  });

  it('falls back to NPC response when no matching dialogue tree exists', () => {
    const action = { id: 'talk', npc: 'stub_npc', intent: 'flirt' };
    // No dialogue tree for stub_npc_social; no story_event in action
    const result = resolveLocationAction(
      initialState,
      action,
      STUB_LOCATIONS,
      STUB_NPCS as any,
      {}, // empty tree map so no story event exists
      alwaysSucceed,
    );
    expect(result.kind).toBe('narrative');
    if (result.kind === 'narrative') {
      expect(result.parsedText.narrative_text).toBe('You look nice today.');
    }
  });

  it('returns none when NPC and intent have no response and no story event', () => {
    const action = { id: 'talk', npc: 'stub_npc', intent: 'combat' };
    const result = resolveLocationAction(
      initialState,
      action,
      STUB_LOCATIONS,
      STUB_NPCS as any,
      {},
      alwaysSucceed,
    );
    expect(result.kind).toBe('none');
  });

  it('uses explicit story_event field on action when present', () => {
    const action = { id: 'talk', npc: 'constance_michel', intent: 'work', story_event: 'constance_michel_social' };
    const result = resolveLocationAction(initialState, action, LOCATIONS, NPCS, DIALOGUE_TREES, alwaysSucceed);
    expect(result.kind).toBe('story_event');
    if (result.kind === 'story_event') {
      expect(result.eventId).toBe('constance_michel_social');
    }
  });
});

describe('locationEventEngine – follow-up choices', () => {
  it('includes follow-up choices from the next location', () => {
    const action = { id: 'walk', outcome: 'You walk over.', new_location: 'town_square' };
    const result = resolveLocationAction(initialState, action, LOCATIONS, NPCS, DIALOGUE_TREES, alwaysSucceed);
    expect(result.kind).toBe('narrative');
    if (result.kind === 'narrative') {
      expect(Array.isArray(result.parsedText.follow_up_choices)).toBe(true);
      expect(result.parsedText.follow_up_choices.length).toBeGreaterThan(0);
      expect(result.parsedText.new_location).toBe('town_square');
    }
  });
});

describe('annotateActionsWithChance', () => {
  it('adds successChance to actions with skill_check', () => {
    const actions = [
      { id: 'a', label: 'Try', skill_check: { stat: 'athletics', difficulty: 50 } },
      { id: 'b', label: 'Skip' },
    ];
    const annotated = annotateActionsWithChance(actions, initialState);
    const a = annotated.find((x: any) => x.id === 'a') as any;
    const b = annotated.find((x: any) => x.id === 'b') as any;
    expect(typeof a.successChance).toBe('number');
    expect(b.successChance).toBeUndefined();
  });

  it('clamps successChance between 5 and 100', () => {
    const highAction = [{ id: 'h', skill_check: { stat: 'athletics', difficulty: 1 } }];
    const lowAction  = [{ id: 'l', skill_check: { stat: 'athletics', difficulty: 10000 } }];
    const hi = (annotateActionsWithChance(highAction, initialState)[0] as any).successChance;
    const lo = (annotateActionsWithChance(lowAction,  initialState)[0] as any).successChance;
    expect(hi).toBe(100);
    // initialState.player.skills.athletics is 5; 5/10000 * 50 + 25 = 25.025 → clamped to max(5, 25) = 25
    expect(lo).toBeGreaterThanOrEqual(5);
    expect(lo).toBeLessThanOrEqual(100);
  });

  it('returns empty array for non-array input', () => {
    expect(annotateActionsWithChance(null as any, initialState)).toEqual([]);
    expect(annotateActionsWithChance(undefined as any, initialState)).toEqual([]);
  });
});
