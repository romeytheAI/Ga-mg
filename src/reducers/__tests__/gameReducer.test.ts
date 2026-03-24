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
});
