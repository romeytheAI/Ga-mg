import { describe, it, expect } from 'vitest';
import { gameReducer } from '../gameReducer';
import { initialState } from '../../state/initialState';
import { GameState } from '../../types';

describe('Narrative progression actions', () => {
  // ── ADVANCE_EPOCH ──────────────────────────────────────────────────────

  describe('ADVANCE_EPOCH', () => {
    it('should increment world_epoch by 1', () => {
      const action = { type: 'ADVANCE_EPOCH', payload: {} };
      const next = gameReducer(initialState, action);
      expect(next.world.world_epoch).toBe(1);
    });

    it('should increment from any existing epoch value', () => {
      const state: GameState = {
        ...initialState,
        world: { ...initialState.world, world_epoch: 3 },
      };
      const action = { type: 'ADVANCE_EPOCH', payload: {} };
      const next = gameReducer(state, action);
      expect(next.world.world_epoch).toBe(4);
    });

    it('should add milestone when provided', () => {
      const action = { type: 'ADVANCE_EPOCH', payload: { milestone: 'escaped_orphanage' } };
      const next = gameReducer(initialState, action);
      expect(next.world.world_epoch).toBe(1);
      expect(next.world.narrative_milestones).toContain('escaped_orphanage');
    });

    it('should not duplicate existing milestones', () => {
      const state: GameState = {
        ...initialState,
        world: { ...initialState.world, narrative_milestones: ['escaped_orphanage'] },
      };
      const action = { type: 'ADVANCE_EPOCH', payload: { milestone: 'escaped_orphanage' } };
      const next = gameReducer(state, action);
      expect(next.world.narrative_milestones.filter(m => m === 'escaped_orphanage')).toHaveLength(1);
    });

    it('should work without a milestone', () => {
      const action = { type: 'ADVANCE_EPOCH', payload: undefined };
      const next = gameReducer(initialState, action);
      expect(next.world.world_epoch).toBe(1);
      expect(next.world.narrative_milestones).toEqual([]);
    });
  });

  // ── COMPLETE_STORY_ARC ─────────────────────────────────────────────────

  describe('COMPLETE_STORY_ARC', () => {
    it('should add arc to completed_story_arcs', () => {
      const action = { type: 'COMPLETE_STORY_ARC', payload: { arcId: 'constance_michel_social' } };
      const next = gameReducer(initialState, action);
      expect(next.world.completed_story_arcs).toContain('constance_michel_social');
    });

    it('should not duplicate existing arcs', () => {
      const state: GameState = {
        ...initialState,
        world: { ...initialState.world, completed_story_arcs: ['constance_michel_social'] },
      };
      const action = { type: 'COMPLETE_STORY_ARC', payload: { arcId: 'constance_michel_social' } };
      const next = gameReducer(state, action);
      expect(next.world.completed_story_arcs).toHaveLength(1);
      // State reference should be unchanged (identity optimization)
      expect(next).toBe(state);
    });

    it('should allow multiple different arcs', () => {
      let state = initialState;
      state = gameReducer(state, { type: 'COMPLETE_STORY_ARC', payload: { arcId: 'arc_a' } });
      state = gameReducer(state, { type: 'COMPLETE_STORY_ARC', payload: { arcId: 'arc_b' } });
      state = gameReducer(state, { type: 'COMPLETE_STORY_ARC', payload: { arcId: 'arc_c' } });
      expect(state.world.completed_story_arcs).toEqual(['arc_a', 'arc_b', 'arc_c']);
    });
  });

  // ── ADD_NARRATIVE_MILESTONE ────────────────────────────────────────────

  describe('ADD_NARRATIVE_MILESTONE', () => {
    it('should add milestone to narrative_milestones', () => {
      const action = { type: 'ADD_NARRATIVE_MILESTONE', payload: { milestone: 'met_brynjolf' } };
      const next = gameReducer(initialState, action);
      expect(next.world.narrative_milestones).toContain('met_brynjolf');
    });

    it('should not duplicate existing milestones', () => {
      const state: GameState = {
        ...initialState,
        world: { ...initialState.world, narrative_milestones: ['met_brynjolf'] },
      };
      const action = { type: 'ADD_NARRATIVE_MILESTONE', payload: { milestone: 'met_brynjolf' } };
      const next = gameReducer(state, action);
      expect(next.world.narrative_milestones).toHaveLength(1);
      expect(next).toBe(state);
    });

    it('should accumulate milestones', () => {
      let state = initialState;
      state = gameReducer(state, { type: 'ADD_NARRATIVE_MILESTONE', payload: { milestone: 'met_brynjolf' } });
      state = gameReducer(state, { type: 'ADD_NARRATIVE_MILESTONE', payload: { milestone: 'joined_guild' } });
      state = gameReducer(state, { type: 'ADD_NARRATIVE_MILESTONE', payload: { milestone: 'first_heist' } });
      expect(state.world.narrative_milestones).toEqual(['met_brynjolf', 'joined_guild', 'first_heist']);
    });
  });

  // ── RESOLVE_TEXT story arc completion tracking ─────────────────────────

  describe('RESOLVE_TEXT auto-tracking story arcs', () => {
    it('should record completed arc when story event resolves to null', () => {
      const stateWithStory: GameState = {
        ...initialState,
        world: {
          ...initialState.world,
          active_story_event: { id: 'constance_michel_social', current_node: 'ask_kindness' },
        },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'The conversation ends.' },
          actionText: 'Leave',
          nextStoryEvent: null,
        },
      };
      const next = gameReducer(stateWithStory, action);
      expect(next.world.active_story_event).toBeNull();
      expect(next.world.completed_story_arcs).toContain('constance_michel_social');
    });

    it('should not duplicate arc when ending the same story again', () => {
      const stateWithStory: GameState = {
        ...initialState,
        world: {
          ...initialState.world,
          active_story_event: { id: 'constance_michel_social', current_node: 'ask_kindness' },
          completed_story_arcs: ['constance_michel_social'],
        },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'The conversation ends again.' },
          actionText: 'Leave again',
          nextStoryEvent: null,
        },
      };
      const next = gameReducer(stateWithStory, action);
      expect(next.world.completed_story_arcs.filter(a => a === 'constance_michel_social')).toHaveLength(1);
    });

    it('should not record arc when story event continues to next node', () => {
      const stateWithStory: GameState = {
        ...initialState,
        world: {
          ...initialState.world,
          active_story_event: { id: 'constance_michel_social', current_node: 'start' },
        },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'She responds warmly.' },
          actionText: 'Ask about kindness',
          nextStoryEvent: { id: 'constance_michel_social', current_node: 'ask_kindness' },
        },
      };
      const next = gameReducer(stateWithStory, action);
      expect(next.world.active_story_event).not.toBeNull();
      expect(next.world.completed_story_arcs).toHaveLength(0);
    });

    it('should not modify arcs when no story event is active', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'A calm day.' },
          actionText: 'Walk around',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.world.completed_story_arcs).toEqual([]);
    });
  });

  // ── Initial state defaults ─────────────────────────────────────────────

  describe('Initial state defaults', () => {
    it('should have world_epoch at 0', () => {
      expect(initialState.world.world_epoch).toBe(0);
    });

    it('should have empty completed_story_arcs', () => {
      expect(initialState.world.completed_story_arcs).toEqual([]);
    });

    it('should have empty narrative_milestones', () => {
      expect(initialState.world.narrative_milestones).toEqual([]);
    });
  });
});
