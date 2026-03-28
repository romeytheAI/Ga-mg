import { describe, it, expect } from 'vitest';
import { gameReducer } from '../gameReducer';
import { initialState } from '../../state/initialState';
import { GameState } from '../../types';

describe('gameReducer', () => {
  it('should handle SET_PLAYER_AVATAR', () => {
    const action = { type: 'SET_PLAYER_AVATAR', payload: 'https://example.com/avatar.png' };
    const nextState = gameReducer(initialState, action);
    expect(nextState.player.avatar_url).toBe('https://example.com/avatar.png');
  });

  it('should handle START_TURN', () => {
    const action = { type: 'START_TURN', payload: { intent: 'attack', actionText: 'You swing your sword' } };
    const nextState = gameReducer(initialState, action);

    expect(nextState.world.last_intent).toBe('attack');
    expect(nextState.ui.isPollingText).toBe(true);
    expect(nextState.ui.currentLog).toHaveLength(initialState.ui.currentLog.length + 1);
    expect(nextState.ui.currentLog[nextState.ui.currentLog.length - 1]).toEqual({
      text: '> You swing your sword',
      type: 'action'
    });
  });

  it('should handle START_TURN without intent', () => {
    const action = { type: 'START_TURN', payload: { actionText: 'You look around' } };
    const nextState = gameReducer(initialState, action);

    expect(nextState.world.last_intent).toBeNull();
  });

  it('should handle EQUIP_ITEM', () => {
    // Add an unequiped clothing item to inventory for testing
    const testItem = {
      id: 'test-helmet',
      name: 'Iron Helmet',
      type: 'clothing' as const,
      slot: 'head',
      is_equipped: false
    };

    const stateWithItem: GameState = {
      ...initialState,
      player: {
        ...initialState.player,
        inventory: [...initialState.player.inventory, testItem as any]
      }
    };

    const action = { type: 'EQUIP_ITEM', payload: { itemId: 'test-helmet' } };
    const nextState = gameReducer(stateWithItem, action);

    // Verify it is equipped in inventory
    const updatedItem = nextState.player.inventory.find(i => i.id === 'test-helmet');
    expect(updatedItem?.is_equipped).toBe(true);

    // Verify it is equipped in clothing slots
    // The original item is placed in the slot, not the updated one with is_equipped: true
    expect(nextState.player.clothing.head).toEqual(testItem);
  });

  it('should not equip non-clothing items', () => {
     // Amulet of Mara is 'misc'
    const action = { type: 'EQUIP_ITEM', payload: { itemId: 'amulet-of-mara' } };
    const nextState = gameReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('should handle USE_ITEM', () => {
    const action = { type: 'USE_ITEM', payload: { itemId: 'healing-poultice' } };

    // Initial health is 80, the poultice adds 25
    const nextState = gameReducer(initialState, action);

    // Should remove item from inventory
    expect(nextState.player.inventory.find(i => i.id === 'healing-poultice')).toBeUndefined();

    // Should update health and constrain to 100 max
    expect(nextState.player.stats.health).toBe(100);
  });

  it('should handle HORDE_REQUEST_START for text', () => {
    const action = { type: 'HORDE_REQUEST_START', payload: { type: 'text' } };
    const nextState = gameReducer(initialState, action);

    expect(nextState.ui.horde_monitor.active).toBe(true);
    expect(nextState.ui.horde_monitor.text_requests).toBe(initialState.ui.horde_monitor.text_requests + 1);
    expect(nextState.ui.horde_monitor.image_requests).toBe(initialState.ui.horde_monitor.image_requests);
  });

  it('should handle HORDE_REQUEST_START for image', () => {
    const action = { type: 'HORDE_REQUEST_START', payload: { type: 'image' } };
    const nextState = gameReducer(initialState, action);

    expect(nextState.ui.horde_monitor.active).toBe(true);
    expect(nextState.ui.horde_monitor.image_requests).toBe(initialState.ui.horde_monitor.image_requests + 1);
    expect(nextState.ui.horde_monitor.text_requests).toBe(initialState.ui.horde_monitor.text_requests);
  });

  it('should handle START_NEW_GAME', () => {
    const action = { type: 'START_NEW_GAME', payload: { directorCut: true } };

    // Change state slightly first to ensure it actually resets
    const modifiedState = { ...initialState, player: { ...initialState.player, avatar_url: 'modified' } };
    const nextState = gameReducer(modifiedState, action);

    // Should reset to initialState but with director_cut set
    expect(nextState.player.avatar_url).toBeNull();
    expect(nextState.world.director_cut).toBe(true);
  });

  // ── RESOLVE_TEXT ────────────────────────────────────────────────────────

  describe('RESOLVE_TEXT', () => {
    it('should append narrative text to log and stop polling', () => {
      const pollingState: GameState = { ...initialState, ui: { ...initialState.ui, isPollingText: true } };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You see a dark cave ahead.' },
          actionText: 'Look around',
        },
      };
      const next = gameReducer(pollingState, action);
      expect(next.ui.isPollingText).toBe(false);
      expect(next.ui.currentLog[next.ui.currentLog.length - 1]).toEqual({
        text: 'You see a dark cave ahead.',
        type: 'narrative',
      });
    });

    it('should apply stat deltas clamped 0-100', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'Ouch.',
            stat_deltas: { health: -200, stamina: 999 },
          },
          actionText: 'Test',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.stats.health).toBe(0);
      // stamina is capped at max_stamina (100)
      expect(next.player.stats.stamina).toBe(100);
    });

    it('should apply skill deltas clamped 0-100', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'You learn.',
            skill_deltas: { athletics: 5, seduction: -100 },
          },
          actionText: 'Train',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.skills.athletics).toBe(initialState.player.skills.athletics + 5);
      expect(next.player.skills.seduction).toBe(0);
    });

    it('should add new items to inventory', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'You found a coin.',
            new_items: [{ name: 'Gold Coin', type: 'misc', rarity: 'common', description: 'Shiny.' }],
          },
          actionText: 'Scavenge',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.inventory.length).toBe(initialState.player.inventory.length + 1);
      const added = next.player.inventory[next.player.inventory.length - 1];
      expect(added.name).toBe('Gold Coin');
      expect(added.id).toBeTruthy();
    });

    it('should change location when new_location is provided', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'You travel to the market.',
            new_location: 'town_square',
          },
          actionText: 'Go to town',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.world.current_location.id).toBe('town_square');
      expect(next.world.current_location.name).toBe('Town Square');
    });

    it('should advance time and day correctly', () => {
      // Start at hour 22, pass 5 hours → should wrap to hour 3, day + 1
      const lateState: GameState = {
        ...initialState,
        world: { ...initialState.world, hour: 22, day: 3 },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Time passes.', hours_passed: 5 },
          actionText: 'Wait',
        },
      };
      const next = gameReducer(lateState, action);
      expect(next.world.hour).toBe(3);
      expect(next.world.day).toBe(4);
    });

    it('should increment turn_count', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'A turn passes.' },
          actionText: 'Do something',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.world.turn_count).toBe(initialState.world.turn_count + 1);
    });

    it('should update follow_up_choices when provided', () => {
      const choices = [
        { id: 'a1', label: 'Attack', intent: 'aggressive', successChance: 60 },
        { id: 'a2', label: 'Run', intent: 'flee', successChance: 80 },
      ];
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Choose wisely.', follow_up_choices: choices },
          actionText: 'Test',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.ui.choices).toEqual(choices);
    });

    it('should add memory_entry to memory_graph', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Something happened.', memory_entry: 'The player explored the cave.' },
          actionText: 'Explore',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.memory_graph).toContain('The player explored the cave.');
    });

    it('should auto-generate memory entry from actionText when memory_entry missing', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You rested.' },
          actionText: 'Rest',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.memory_graph.length).toBeGreaterThan(initialState.memory_graph.length);
    });

    it('should add afflictions without duplicates', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You feel cursed.', new_affliction: 'Curse of Weakness' },
          actionText: 'Touch the altar',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.afflictions).toContain('Curse of Weakness');

      // Applying same affliction again should not duplicate
      const next2 = gameReducer(next, action);
      expect(next2.player.afflictions.filter(a => a === 'Curse of Weakness')).toHaveLength(1);
    });

    it('should add and complete quests', () => {
      const addAction = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'A quest begins.',
            new_quests: [{ id: 'q1', title: 'Find the Key', description: 'Search for the ancient key.' }],
          },
          actionText: 'Accept quest',
        },
      };
      const withQuest = gameReducer(initialState, addAction);
      expect(withQuest.player.quests.some(q => q.id === 'q1' && q.status === 'active')).toBe(true);

      const completeAction = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Quest complete!', completed_quests: ['q1'] },
          actionText: 'Complete quest',
        },
      };
      const completed = gameReducer(withQuest, completeAction);
      expect(completed.player.quests.find(q => q.id === 'q1')?.status).toBe('completed');
    });

    it('should degrade equipped item integrity', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Your gear wears down.', equipment_integrity_delta: -10 },
          actionText: 'Fight',
        },
      };
      const next = gameReducer(initialState, action);
      const rags = next.player.inventory.find(i => i.id === 'orphan-rags');
      expect(rags?.integrity).toBe(50); // 60 - 10
    });

    it('should handle combat injuries', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'You are wounded.',
            combat_injury: { description: 'Deep cut on left arm', stamina_penalty: 5, health_penalty: 10 },
          },
          actionText: 'Get hit',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.anatomy.injuries).toHaveLength(1);
      expect(next.player.anatomy.injuries[0].description).toBe('Deep cut on left arm');
      expect(next.player.stats.health).toBe(initialState.player.stats.health - 10);
      expect(next.player.stats.stamina).toBe(initialState.player.stats.stamina - 5);
    });

    it('should store stat deltas for floating UI', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Pain.', stat_deltas: { health: -5, trauma: 3 } },
          actionText: 'Suffer',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.ui.last_stat_deltas).toEqual({ health: -5, trauma: 3 });
    });

    it('should return stopped polling when parsedText is null', () => {
      const pollingState: GameState = { ...initialState, ui: { ...initialState.ui, isPollingText: true } };
      const action = { type: 'RESOLVE_TEXT', payload: { parsedText: null, actionText: 'Test' } };
      const next = gameReducer(pollingState, action);
      expect(next.ui.isPollingText).toBe(false);
      // State should be otherwise unchanged
      expect(next.player).toEqual(pollingState.player);
    });
  });

  // ── SUMMARIZE_MEMORY ───────────────────────────────────────────────────

  describe('SUMMARIZE_MEMORY', () => {
    it('should replace oldest entries with a single summary', () => {
      const stateWithMemories: GameState = {
        ...initialState,
        memory_graph: ['event1', 'event2', 'event3', 'event4', 'event5', 'event6', 'event7', 'event8', 'event9', 'event10', 'event11'],
      };
      const action = {
        type: 'SUMMARIZE_MEMORY',
        payload: { summary: '[Distant Memory]: A lot happened.', count: 10 },
      };
      const next = gameReducer(stateWithMemories, action);
      // 11 - 10 = 1 remaining + 1 summary = 2
      expect(next.memory_graph).toHaveLength(2);
      expect(next.memory_graph[0]).toBe('[Distant Memory]: A lot happened.');
      expect(next.memory_graph[1]).toBe('event11');
    });

    it('should handle summarizing all entries', () => {
      const stateWithMemories: GameState = {
        ...initialState,
        memory_graph: ['a', 'b', 'c'],
      };
      const action = {
        type: 'SUMMARIZE_MEMORY',
        payload: { summary: '[Summary]', count: 3 },
      };
      const next = gameReducer(stateWithMemories, action);
      expect(next.memory_graph).toEqual(['[Summary]']);
    });
  });

  // ── UPDATE_ACTIVE_ENCOUNTER ────────────────────────────────────────────

  describe('UPDATE_ACTIVE_ENCOUNTER', () => {
    const baseEncounter = {
      id: 'test_enc',
      enemy_name: 'Bandit',
      enemy_type: 'bandit',
      enemy_health: 80,
      enemy_max_health: 100,
      enemy_lust: 20,
      enemy_max_lust: 100,
      enemy_anger: 30,
      enemy_max_anger: 100,
      player_stance: 'neutral' as const,
      turn: 1,
      log: ['The encounter begins.'],
      debuffs: [{ type: 'slowed', duration: 2 }],
      targeted_part: null,
      anatomy: initialState.player.anatomy,
    };

    function stateWithEncounter(enc = baseEncounter): GameState {
      return {
        ...initialState,
        world: { ...initialState.world, active_encounter: enc },
      };
    }

    it('should update encounter_action on active encounter', () => {
      const s = stateWithEncounter();
      const action = { type: 'UPDATE_ACTIVE_ENCOUNTER', payload: { encounter_action: 'grabbed' } };
      const next = gameReducer(s, action);
      expect(next.world.active_encounter?.encounter_action).toBe('grabbed');
    });

    it('should merge encounter fields via spread', () => {
      const s = stateWithEncounter();
      const action = {
        type: 'UPDATE_ACTIVE_ENCOUNTER',
        payload: { enemy_health: 50, enemy_anger: 60, log: [...baseEncounter.log, 'You strike!'] },
      };
      const next = gameReducer(s, action);
      expect(next.world.active_encounter?.enemy_health).toBe(50);
      expect(next.world.active_encounter?.enemy_anger).toBe(60);
      expect(next.world.active_encounter?.log).toHaveLength(2);
      // Fields not in payload remain unchanged
      expect(next.world.active_encounter?.enemy_lust).toBe(20);
    });

    it('should update debuffs list when provided', () => {
      const s = stateWithEncounter();
      const action = {
        type: 'UPDATE_ACTIVE_ENCOUNTER',
        payload: { debuffs: [{ type: 'weakened', duration: 3 }] },
      };
      const next = gameReducer(s, action);
      expect(next.world.active_encounter?.debuffs).toEqual([{ type: 'weakened', duration: 3 }]);
    });

    it('should return state unchanged if no active encounter', () => {
      const action = { type: 'UPDATE_ACTIVE_ENCOUNTER', payload: { enemy_health: 50 } };
      const next = gameReducer(initialState, action);
      expect(next.world.active_encounter).toBeNull();
    });
  });
});
