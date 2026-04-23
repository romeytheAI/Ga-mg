import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gameReducer } from '../gameReducer';
import { initialState } from '../../state/initialState';
import { GameState } from '../../types';

// ── LOAD_GAME ──────────────────────────────────────────────────────────────

describe('gameReducer – LOAD_GAME', () => {
  it('replaces the entire state with the payload', () => {
    const savedState: GameState = {
      ...initialState,
      player: { ...initialState.player, gold: 999, level: 7 },
      world: { ...initialState.world, day: 42, world_epoch: 2 },
    };
    const action = { type: 'LOAD_GAME', payload: savedState };
    const next = gameReducer(initialState, action);
    expect(next.player.gold).toBe(999);
    expect(next.player.level).toBe(7);
    expect(next.world.day).toBe(42);
    expect(next.world.world_epoch).toBe(2);
  });

  it('preserves all player subsystems from payload', () => {
    const savedState: GameState = {
      ...initialState,
      player: {
        ...initialState.player,
        lewdity_stats: { exhibitionism: 30, promiscuity: 20, deviancy: 10, masochism: 5 },
        traits: [{ id: 'brave', name: 'Brave', description: 'test', effects: {} }],
        quests: [{ id: 'q1', type: 'side', title: 'Test Quest', description: 'test', status: 'active' }],
      },
      world: {
        ...initialState.world,
        narrative_milestones: ['escaped_orphanage'],
        event_flags: { bailey_intro_done: true },
      },
    };
    const next = gameReducer(initialState, { type: 'LOAD_GAME', payload: savedState });
    expect(next.player.lewdity_stats.exhibitionism).toBe(30);
    expect(next.player.traits).toHaveLength(1);
    expect(next.player.quests[0].id).toBe('q1');
    expect(next.world.narrative_milestones).toContain('escaped_orphanage');
    expect(next.world.event_flags.bailey_intro_done).toBe(true);
  });
});

// ── START_NEW_GAME edge cases ──────────────────────────────────────────────

describe('gameReducer – START_NEW_GAME', () => {
  it('resets narrative progression fields to defaults', () => {
    // Start with a state that has advanced epoch
    const advancedState: GameState = {
      ...initialState,
      world: {
        ...initialState.world,
        world_epoch: 5,
        narrative_milestones: ['milestone_1'],
      },
    };
    const next = gameReducer(advancedState, { type: 'START_NEW_GAME', payload: { directorCut: false } });
    expect(next.world.world_epoch).toBe(0);
    expect(next.world.narrative_milestones).toEqual([]);
  });

  it('sets director_cut when true', () => {
    const next = gameReducer(initialState, { type: 'START_NEW_GAME', payload: { directorCut: true } });
    expect(next.world.director_cut).toBe(true);
  });

  it('resets player gold to initial', () => {
    const richState: GameState = { ...initialState, player: { ...initialState.player, gold: 9999 } };
    const next = gameReducer(richState, { type: 'START_NEW_GAME', payload: {} });
    expect(next.player.gold).toBe(initialState.player.gold);
  });

  it('resets memory_graph to empty', () => {
    const withMem: GameState = { ...initialState, memory_graph: ['day 1', 'day 2', 'day 3'] };
    const next = gameReducer(withMem, { type: 'START_NEW_GAME', payload: {} });
    expect(next.memory_graph).toEqual([]);
  });

  it('resets active_story_event to null', () => {
    const withStory: GameState = {
      ...initialState,
      world: { ...initialState.world, active_story_event: { id: 'test_arc', current_node: 'start' } },
    };
    const next = gameReducer(withStory, { type: 'START_NEW_GAME', payload: {} });
    expect(next.world.active_story_event).toBeNull();
  });

  it('resets completed quests', () => {
    const withQuests: GameState = {
      ...initialState,
      player: {
        ...initialState.player,
        quests: [{ id: 'q1', type: 'side', title: 'Done Quest', description: 'done', status: 'completed' }],
      },
    };
    const next = gameReducer(withQuests, { type: 'START_NEW_GAME', payload: {} });
    expect(next.player.quests).toEqual(initialState.player.quests);
  });
});

// ── default case ───────────────────────────────────────────────────────────

describe('gameReducer – unknown action', () => {
  it('returns state unchanged for unknown action type', () => {
    const next = gameReducer(initialState, { type: 'TOTALLY_UNKNOWN_ACTION_XYZ', payload: {} });
    expect(next).toBe(initialState); // reference equality — no copy made
  });
});

// ── SET_PLAYER_AVATAR ──────────────────────────────────────────────────────

describe('gameReducer – SET_PLAYER_AVATAR', () => {
  it('sets avatar url', () => {
    const next = gameReducer(initialState, { type: 'SET_PLAYER_AVATAR', payload: 'https://test.com/img.png' });
    expect(next.player.avatar_url).toBe('https://test.com/img.png');
  });

  it('can clear avatar with null', () => {
    const withAvatar: GameState = { ...initialState, player: { ...initialState.player, avatar_url: 'https://test.com/img.png' } };
    const next = gameReducer(withAvatar, { type: 'SET_PLAYER_AVATAR', payload: null });
    expect(next.player.avatar_url).toBeNull();
  });
});

// ── BUY_ITEM edge cases ────────────────────────────────────────────────────

describe('gameReducer – BUY_ITEM edge cases', () => {
  const testItem = {
    id: 'test-sword',
    name: 'Steel Sword',
    type: 'weapon' as const,
    rarity: 'uncommon' as const,
    description: 'A fine blade.',
    value: 50,
    weight: 2,
    is_equipped: false,
    buc_status: 'uncursed' as const,
    identification: 'identified' as const,
  };

  it('does not buy when gold equals cost minus 1 (boundary)', () => {
    const state: GameState = { ...initialState, player: { ...initialState.player, gold: 49 } };
    const next = gameReducer(state, { type: 'BUY_ITEM', payload: { item: testItem, cost: 50 } });
    expect(next.player.gold).toBe(49);
    expect(next.player.inventory).toHaveLength(initialState.player.inventory.length);
  });

  it('buys when gold exactly equals cost (boundary)', () => {
    const state: GameState = { ...initialState, player: { ...initialState.player, gold: 50 } };
    const next = gameReducer(state, { type: 'BUY_ITEM', payload: { item: testItem, cost: 50 } });
    expect(next.player.gold).toBe(0);
    expect(next.player.inventory).toHaveLength(initialState.player.inventory.length + 1);
  });

  it('preserves all existing inventory items after purchase', () => {
    const state: GameState = { ...initialState, player: { ...initialState.player, gold: 100 } };
    const next = gameReducer(state, { type: 'BUY_ITEM', payload: { item: testItem, cost: 50 } });
    // Original items are still present
    expect(next.player.inventory.find(i => i.id === 'orphan-rags')).toBeDefined();
    expect(next.player.inventory.find(i => i.id === 'healing-poultice')).toBeDefined();
  });
});

// ── TOGGLE_UI_SETTING ──────────────────────────────────────────────────────

describe('gameReducer – TOGGLE_UI_SETTING', () => {
  it('sets a boolean UI flag to true', () => {
    const next = gameReducer(initialState, {
      type: 'TOGGLE_UI_SETTING',
      payload: { key: 'show_map', value: true },
    });
    expect(next.ui.show_map).toBe(true);
  });

  it('sets a boolean UI flag to false', () => {
    const withMap: GameState = { ...initialState, ui: { ...initialState.ui, show_map: true } };
    const next = gameReducer(withMap, {
      type: 'TOGGLE_UI_SETTING',
      payload: { key: 'show_map', value: false },
    });
    expect(next.ui.show_map).toBe(false);
  });

  it('can set a numeric UI setting', () => {
    const next = gameReducer(initialState, {
      type: 'TOGGLE_UI_SETTING',
      payload: { key: 'ui_scale', value: 1.5 },
    });
    expect(next.ui.ui_scale).toBe(1.5);
  });

  it('does not mutate other UI settings', () => {
    const next = gameReducer(initialState, {
      type: 'TOGGLE_UI_SETTING',
      payload: { key: 'show_stats', value: true },
    });
    expect(next.ui.show_map).toBe(initialState.ui.show_map);
    expect(next.ui.show_inventory).toBe(initialState.ui.show_inventory);
  });
});

// ── SUMMARIZE_MEMORY edge cases ────────────────────────────────────────────

describe('gameReducer – SUMMARIZE_MEMORY edge cases', () => {
  it('handles array payload', () => {
    const state: GameState = { ...initialState, memory_graph: ['a', 'b', 'c', 'd'] };
    const next = gameReducer(state, {
      type: 'SUMMARIZE_MEMORY',
      payload: ['[Distant Memory]: Things happened.', 'd'],
    });
    expect(next.memory_graph[0]).toBe('[Distant Memory]: Things happened.');
  });

  it('replaces summary when payload is [Summary] sentinel', () => {
    const state: GameState = { ...initialState, memory_graph: ['event1', 'event2'] };
    const next = gameReducer(state, {
      type: 'SUMMARIZE_MEMORY',
      payload: { summary: '[Summary]' },
    });
    expect(next.memory_graph).toEqual(['[Summary]']);
  });

  it('falls back to default summary when payload has no summary key', () => {
    const state: GameState = { ...initialState, memory_graph: ['event1', 'event2'] };
    const next = gameReducer(state, {
      type: 'SUMMARIZE_MEMORY',
      payload: {},
    });
    expect(next.memory_graph[0]).toBe('[Distant Memory]: A lot happened.');
  });
});
