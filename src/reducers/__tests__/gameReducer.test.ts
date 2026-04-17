import { describe, it, expect } from 'vitest';
import { gameReducer } from '../gameReducer';
import { initialState } from '../../state/initialState';
import { GameState } from '../../types';
import { LOCATIONS } from '../../data/locations';
import { ENCOUNTERS } from '../../data/encounters';

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
            narrative_text: 'You found a potion.',
            new_items: [{ name: 'Healing Potion', type: 'consumable', rarity: 'common', description: 'Restores health.' }],
          },
          actionText: 'Scavenge',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.inventory.length).toBe(initialState.player.inventory.length + 1);
      const added = next.player.inventory[next.player.inventory.length - 1];
      expect(added.name).toBe('Healing Potion');
      expect(added.id).toBeTruthy();
    });

    it('should convert Gold Coin items to gold currency', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: {
            narrative_text: 'You found some coins.',
            new_items: [
              { name: 'Gold Coin', type: 'misc', rarity: 'common', description: 'Shiny.', value: 1 },
              { name: 'Gold Coin', type: 'misc', rarity: 'common', description: 'Shiny.', value: 1 },
            ],
          },
          actionText: 'Scavenge',
        },
      };
      const next = gameReducer(initialState, action);
      // Gold coins should not appear in inventory
      expect(next.player.inventory.filter(i => i.name === 'Gold Coin').length).toBe(0);
      // Gold should increase
      expect(next.player.gold).toBe(initialState.player.gold + 2);
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
      expect(next.world.current_location.name).toBe('Riften Marketplace');
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

  // ── NEEDS DECAY ────────────────────────────────────────────────────────

  describe('Player needs decay in RESOLVE_TEXT', () => {
    it('should drain hunger/thirst/energy/hygiene/social per turn', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Time passes.', hours_passed: 2 },
          actionText: 'Wait around',
        },
      };
      const next = gameReducer(initialState, action);
      // Passive drain: hunger -3/hr, thirst -4/hr, energy -2/hr, hygiene -1.5/hr, social -1/hr
      expect(next.player.life_sim.needs.hunger).toBeLessThan(initialState.player.life_sim.needs.hunger);
      expect(next.player.life_sim.needs.thirst).toBeLessThan(initialState.player.life_sim.needs.thirst);
      expect(next.player.life_sim.needs.energy).toBeLessThan(initialState.player.life_sim.needs.energy);
      expect(next.player.life_sim.needs.hygiene).toBeLessThan(initialState.player.life_sim.needs.hygiene);
      expect(next.player.life_sim.needs.social).toBeLessThan(initialState.player.life_sim.needs.social);
    });

    it('should drain faster during work intent', () => {
      const baseState: GameState = {
        ...initialState,
        world: { ...initialState.world, last_intent: 'work' },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You work hard.', hours_passed: 1 },
          actionText: 'Work at stall',
        },
      };
      const next = gameReducer(baseState, action);
      // Work adds extra drain: hunger -5/hr, energy -5/hr, hygiene -3/hr (on top of base)
      const hungDrop = initialState.player.life_sim.needs.hunger - next.player.life_sim.needs.hunger;
      expect(hungDrop).toBeGreaterThanOrEqual(8); // 3 base + 5 work
    });

    it('should restore energy on sleep action', () => {
      const lowEnergy: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          life_sim: {
            ...initialState.player.life_sim,
            needs: { ...initialState.player.life_sim.needs, energy: 30 },
          },
        },
        world: { ...initialState.world, last_intent: 'neutral' },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You sleep.', hours_passed: 1 },
          actionText: 'Sleep in your cot',
        },
      };
      const next = gameReducer(lowEnergy, action);
      // Sleep restores +30/hr, minus 2/hr passive drain = net +28
      expect(next.player.life_sim.needs.energy).toBeGreaterThan(lowEnergy.player.life_sim.needs.energy);
    });

    it('should restore hygiene on wash/bath action', () => {
      const dirtyState: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          life_sim: {
            ...initialState.player.life_sim,
            needs: { ...initialState.player.life_sim.needs, hygiene: 20 },
          },
        },
        world: { ...initialState.world, last_intent: 'neutral' },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You wash.', hours_passed: 1 },
          actionText: 'Wash yourself at the water pump',
        },
      };
      const next = gameReducer(dirtyState, action);
      expect(next.player.life_sim.needs.hygiene).toBeGreaterThan(dirtyState.player.life_sim.needs.hygiene);
    });

    it('should apply stat penalties when hunger critically low', () => {
      const starvingState: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          life_sim: {
            ...initialState.player.life_sim,
            needs: { ...initialState.player.life_sim.needs, hunger: 10, thirst: 100, energy: 100, hygiene: 100, social: 100 },
          },
        },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Hunger gnaws.', hours_passed: 1 },
          actionText: 'Wait',
        },
      };
      const next = gameReducer(starvingState, action);
      // Low hunger → health -2, stamina -3
      expect(next.player.stats.health).toBeLessThan(starvingState.player.stats.health);
      expect(next.player.stats.stamina).toBeLessThan(starvingState.player.stats.stamina);
    });

    it('should apply stat penalties when thirst critically low', () => {
      const dehydrated: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          life_sim: {
            ...initialState.player.life_sim,
            needs: { ...initialState.player.life_sim.needs, thirst: 5, hunger: 100, energy: 100, hygiene: 100, social: 100 },
          },
        },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'You feel faint.', hours_passed: 1 },
          actionText: 'Wait',
        },
      };
      const next = gameReducer(dehydrated, action);
      expect(next.player.stats.health).toBeLessThan(dehydrated.player.stats.health);
    });

    it('should not let needs go below 0', () => {
      const emptyNeeds: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          life_sim: {
            ...initialState.player.life_sim,
            needs: { hunger: 1, thirst: 1, energy: 1, hygiene: 1, social: 1 },
          },
        },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Hours pass.', hours_passed: 10 },
          actionText: 'Wait a long time',
        },
      };
      const next = gameReducer(emptyNeeds, action);
      expect(next.player.life_sim.needs.hunger).toBeGreaterThanOrEqual(0);
      expect(next.player.life_sim.needs.thirst).toBeGreaterThanOrEqual(0);
      expect(next.player.life_sim.needs.energy).toBeGreaterThanOrEqual(0);
      expect(next.player.life_sim.needs.hygiene).toBeGreaterThanOrEqual(0);
      expect(next.player.life_sim.needs.social).toBeGreaterThanOrEqual(0);
    });
  });

  // ── WEATHER EFFECTS ──────────────────────────────────────────────────

  describe('Weather effects in RESOLVE_TEXT', () => {
    function stateWithWeather(weather: string): GameState {
      return {
        ...initialState,
        world: { ...initialState.world, weather },
      };
    }

    it('should drain stamina in blizzard weather', () => {
      const s = stateWithWeather('Blizzard');
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'The cold bites.', hours_passed: 2 },
          actionText: 'Endure the cold',
        },
      };
      const next = gameReducer(s, action);
      // Blizzard: stamina -5/hr, health -2/hr (on top of normal drain)
      expect(next.player.stats.stamina).toBeLessThan(s.player.stats.stamina);
    });

    it('should increase stress in scorching weather', () => {
      const s = stateWithWeather('Scorching');
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'The heat is oppressive.', hours_passed: 2 },
          actionText: 'Swelter',
        },
      };
      const next = gameReducer(s, action);
      expect(next.player.stats.stress).toBeGreaterThan(s.player.stats.stress);
    });

    it('should increase stress in thunderstorm', () => {
      const s = stateWithWeather('Thunderstorm');
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Lightning flashes.', hours_passed: 1 },
          actionText: 'Shelter',
        },
      };
      const next = gameReducer(s, action);
      expect(next.player.stats.stress).toBeGreaterThan(s.player.stats.stress);
    });

    it('should not apply weather effects for mild weather', () => {
      const s = stateWithWeather('Mild');
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'A calm day.', hours_passed: 1 },
          actionText: 'Walk',
        },
      };
      const next = gameReducer(s, action);
      // Mild weather has no additional drain beyond needs
      // stamina should only decrease from needs effects (if any)
      const staminaDrop = s.player.stats.stamina - next.player.stats.stamina;
      expect(staminaDrop).toBeLessThanOrEqual(5); // Only needs-based, no weather
    });
  });

  // ── LOCATIONS & ENCOUNTERS ──────────────────────────────────────────

  describe('Locations and encounters data integrity', () => {
    it('all locations should have valid actions with required fields', () => {
      for (const [id, loc] of Object.entries(LOCATIONS) as [string, any][]) {
        expect(loc.id).toBe(id);
        expect(loc.name).toBeTruthy();
        expect(loc.actions).toBeInstanceOf(Array);
        expect(loc.actions.length).toBeGreaterThan(0);
        for (const action of loc.actions) {
          expect(action.id).toBeTruthy();
          expect(action.label).toBeTruthy();
          // expect(action.intent).toBeTruthy();
        }
      }
    });

    it('all location travel actions should reference valid locations', () => {
      const locationIds = new Set(Object.keys(LOCATIONS));
      for (const [, loc] of Object.entries(LOCATIONS) as [string, any][]) {
        for (const action of loc.actions) {
          if (action.new_location) {
            expect(locationIds.has(action.new_location)).toBe(true);
          }
        }
      }
    });

    it('new locations lake and beach should exist with actions', () => {
      expect(LOCATIONS.lake).toBeDefined();
      expect(LOCATIONS.lake.actions.length).toBeGreaterThanOrEqual(4);
      expect(LOCATIONS.beach).toBeDefined();
      expect(LOCATIONS.beach.actions.length).toBeGreaterThanOrEqual(4);
    });

    it('all encounters should have required fields', () => {
      for (const enc of ENCOUNTERS) {
        expect(enc.id).toBeTruthy();
        expect(typeof enc.condition).toBe('function');
        expect(enc.outcome).toBeTruthy();
        expect(enc.anatomy).toBeDefined();
      }
    });

    it('lake and beach encounters should exist', () => {
      const ids = ENCOUNTERS.map((e: any) => e.id);
      expect(ids).toContain('lake_lurker');
      expect(ids).toContain('beach_scavenger');
    });

    it('school and wolf encounters should exist', () => {
      const ids = ENCOUNTERS.map((e: any) => e.id);
      expect(ids).toContain('school_bully');
      expect(ids).toContain('wolf_pack');
    });

    it('home safehouse location should exist with actions', () => {
      expect(LOCATIONS.home).toBeDefined();
      expect(LOCATIONS.home.name).toBe('Honeyside Hideout');
      expect(LOCATIONS.home.danger).toBe(0);
      expect(LOCATIONS.home.actions.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe('Commerce and economy', () => {
    it('should handle BUY_ITEM when player has enough gold', () => {
      const richState: GameState = {
        ...initialState,
        player: { ...initialState.player, gold: 100 },
      };
      const item = { id: 'test-item', name: 'Potion', type: 'consumable', rarity: 'common', description: 'A potion.', value: 10, weight: 0.1 };
      const action = { type: 'BUY_ITEM', payload: { item, cost: 15 } };
      const next = gameReducer(richState, action);
      expect(next.player.gold).toBe(85);
      expect(next.player.inventory.length).toBe(richState.player.inventory.length + 1);
    });

    it('should reject BUY_ITEM when player cannot afford', () => {
      const poorState: GameState = {
        ...initialState,
        player: { ...initialState.player, gold: 5 },
      };
      const item = { id: 'expensive', name: 'Sword', type: 'weapon', rarity: 'rare', description: 'Expensive.', value: 100, weight: 3 };
      const action = { type: 'BUY_ITEM', payload: { item, cost: 50 } };
      const next = gameReducer(poorState, action);
      expect(next.player.gold).toBe(5);
      expect(next.player.inventory.length).toBe(poorState.player.inventory.length);
    });

    it('should handle SELL_ITEM and add gold', () => {
      const stateWithItem: GameState = {
        ...initialState,
        player: { ...initialState.player, gold: 10 },
      };
      const sellableId = stateWithItem.player.inventory.find(i => !i.is_equipped)?.id;
      if (!sellableId) return; // no sellable item
      const action = { type: 'SELL_ITEM', payload: { itemId: sellableId, price: 25 } };
      const next = gameReducer(stateWithItem, action);
      expect(next.player.gold).toBe(35);
      expect(next.player.inventory.find(i => i.id === sellableId)).toBeUndefined();
    });

    it('should not sell equipped items', () => {
      const equippedId = initialState.player.inventory.find(i => i.is_equipped)?.id;
      if (!equippedId) return;
      const action = { type: 'SELL_ITEM', payload: { itemId: equippedId, price: 10 } };
      const next = gameReducer(initialState, action);
      expect(next.player.inventory.find(i => i.id === equippedId)).toBeDefined();
    });

    it('should handle REPAIR_ITEM', () => {
      const damagedState: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          gold: 50,
          inventory: initialState.player.inventory.map(i =>
            i.id === 'orphan-rags' ? { ...i, integrity: 30, max_integrity: 100 } : i
          ),
        },
      };
      const action = { type: 'REPAIR_ITEM', payload: { itemId: 'orphan-rags', cost: 7 } };
      const next = gameReducer(damagedState, action);
      expect(next.player.gold).toBe(43);
      expect(next.player.inventory.find(i => i.id === 'orphan-rags')?.integrity).toBe(100);
    });

    it('should handle ADD_GOLD', () => {
      const action = { type: 'ADD_GOLD', payload: 25 };
      const next = gameReducer(initialState, action);
      expect(next.player.gold).toBe(initialState.player.gold + 25);
    });

    it('should handle ADD_FAME', () => {
      const action = { type: 'ADD_FAME', payload: { fame: 10, notoriety: 5 } };
      const next = gameReducer(initialState, action);
      expect(next.player.fame).toBe(initialState.player.fame + 10);
      expect(next.player.notoriety).toBe(initialState.player.notoriety + 5);
    });

    it('should clamp fame and notoriety to 0-100', () => {
      const maxState: GameState = {
        ...initialState,
        player: { ...initialState.player, fame: 95, notoriety: 98 },
      };
      const action = { type: 'ADD_FAME', payload: { fame: 20, notoriety: 10 } };
      const next = gameReducer(maxState, action);
      expect(next.player.fame).toBe(100);
      expect(next.player.notoriety).toBe(100);
    });
  });

  // ── DoL-PARITY: NEW SYSTEMS ──────────────────────────────────────────

  describe('DoL-parity: Attitudes system', () => {
    it('should handle SET_ATTITUDE', () => {
      const action = { type: 'SET_ATTITUDE', payload: { type: 'sexual', value: 'defiant' } };
      const next = gameReducer(initialState, action);
      expect(next.player.attitudes.sexual).toBe('defiant');
      // Other attitudes unchanged
      expect(next.player.attitudes.crime).toBe('neutral');
      expect(next.player.attitudes.labour).toBe('neutral');
    });

    it('should handle setting multiple attitudes', () => {
      let state = gameReducer(initialState, { type: 'SET_ATTITUDE', payload: { type: 'crime', value: 'submissive' } });
      state = gameReducer(state, { type: 'SET_ATTITUDE', payload: { type: 'labour', value: 'defiant' } });
      expect(state.player.attitudes.crime).toBe('submissive');
      expect(state.player.attitudes.labour).toBe('defiant');
    });

    it('should handle UPDATE_ATTITUDES', () => {
      const action = { type: 'UPDATE_ATTITUDES', payload: { sexual: 'submissive', crime: 'defiant' } };
      const next = gameReducer(initialState, action);
      expect(next.player.attitudes.sexual).toBe('submissive');
      expect(next.player.attitudes.crime).toBe('defiant');
      expect(next.player.attitudes.labour).toBe('neutral');
    });
  });

  describe('DoL-parity: Feats system', () => {
    it('should handle UNLOCK_FEAT', () => {
      const action = { type: 'UNLOCK_FEAT', payload: 'feat_first_steps' };
      const next = gameReducer(initialState, action);
      const feat = next.player.feats.find(f => f.id === 'feat_first_steps');
      expect(feat?.unlocked).toBe(true);
      expect(feat?.unlocked_on_day).toBe(initialState.world.day);
    });

    it('should not re-unlock already unlocked feat', () => {
      const action = { type: 'UNLOCK_FEAT', payload: 'feat_first_steps' };
      const withFeat = gameReducer(initialState, action);
      // Change day to verify it doesn't update unlocked_on_day
      const laterState: GameState = { ...withFeat, world: { ...withFeat.world, day: 50 } };
      const next = gameReducer(laterState, action);
      const feat = next.player.feats.find(f => f.id === 'feat_first_steps');
      expect(feat?.unlocked_on_day).toBe(initialState.world.day); // unchanged
    });

    it('initial state should have feats defined but not unlocked', () => {
      expect(initialState.player.feats.length).toBeGreaterThan(0);
      expect(initialState.player.feats.every(f => !f.unlocked)).toBe(true);
    });
  });

  describe('DoL-parity: Traits system', () => {
    it('should handle ADD_TRAIT', () => {
      const trait = { id: 'trait_nimble', name: 'Nimble', description: 'Quick on your feet.', effects: { stamina: 5 } };
      const action = { type: 'ADD_TRAIT', payload: trait };
      const next = gameReducer(initialState, action);
      expect(next.player.traits).toHaveLength(1);
      expect(next.player.traits[0].id).toBe('trait_nimble');
    });

    it('should not add duplicate trait', () => {
      const trait = { id: 'trait_nimble', name: 'Nimble', description: 'Quick on your feet.', effects: { stamina: 5 } };
      let state = gameReducer(initialState, { type: 'ADD_TRAIT', payload: trait });
      state = gameReducer(state, { type: 'ADD_TRAIT', payload: trait });
      expect(state.player.traits).toHaveLength(1);
    });

    it('should handle REMOVE_TRAIT', () => {
      const trait = { id: 'trait_nimble', name: 'Nimble', description: 'Quick on your feet.', effects: { stamina: 5 } };
      let state = gameReducer(initialState, { type: 'ADD_TRAIT', payload: trait });
      state = gameReducer(state, { type: 'REMOVE_TRAIT', payload: 'trait_nimble' });
      expect(state.player.traits).toHaveLength(0);
    });
  });

  describe('DoL-parity: Virginities system', () => {
    it('should handle LOSE_VIRGINITY', () => {
      const action = { type: 'LOSE_VIRGINITY', payload: { type: 'kiss', description: 'Day 3: A stolen kiss in the park.' } };
      const next = gameReducer(initialState, action);
      expect(next.player.virginities.kiss).toBe('Day 3: A stolen kiss in the park.');
    });

    it('should not overwrite already-lost virginity', () => {
      const action1 = { type: 'LOSE_VIRGINITY', payload: { type: 'kiss', description: 'First kiss.' } };
      const action2 = { type: 'LOSE_VIRGINITY', payload: { type: 'kiss', description: 'Second attempt.' } };
      let state = gameReducer(initialState, action1);
      state = gameReducer(state, action2);
      expect(state.player.virginities.kiss).toBe('First kiss.');
    });

    it('initial virginities should all be null (intact)', () => {
      for (const val of Object.values(initialState.player.virginities)) {
        expect(val).toBeNull();
      }
    });
  });

  describe('DoL-parity: Bailey payment system', () => {
    it('should handle PAY_BAILEY', () => {
      const indebted: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          gold: 200,
          bailey_payment: { ...initialState.player.bailey_payment, debt: 100, missed_payments: 1, punishment_level: 1 },
        },
      };
      const action = { type: 'PAY_BAILEY', payload: 100 };
      const next = gameReducer(indebted, action);
      expect(next.player.gold).toBe(100);
      expect(next.player.bailey_payment.debt).toBe(0);
      expect(next.player.bailey_payment.missed_payments).toBe(0);
      expect(next.player.bailey_payment.punishment_level).toBe(0);
    });

    it('should not pay Bailey if not enough gold', () => {
      const poorState: GameState = {
        ...initialState,
        player: {
          ...initialState.player,
          gold: 10,
          bailey_payment: { ...initialState.player.bailey_payment, debt: 100 },
        },
      };
      const action = { type: 'PAY_BAILEY', payload: 100 };
      const next = gameReducer(poorState, action);
      expect(next.player.gold).toBe(10); // unchanged
      expect(next.player.bailey_payment.debt).toBe(100); // unchanged
    });

    it('initial bailey payment state should be valid', () => {
      expect(initialState.player.bailey_payment.weekly_amount).toBe(100);
      expect(initialState.player.bailey_payment.debt).toBe(0);
      expect(initialState.player.bailey_payment.missed_payments).toBe(0);
    });
  });

  describe('DoL-parity: Sexual skills system', () => {
    it('should handle UPDATE_SEXUAL_SKILL', () => {
      const action = { type: 'UPDATE_SEXUAL_SKILL', payload: { skill: 'oral', amount: 15 } };
      const next = gameReducer(initialState, action);
      expect(next.player.sexual_skills.oral).toBe(15);
    });

    it('should clamp sexual skills to 0-100', () => {
      const action = { type: 'UPDATE_SEXUAL_SKILL', payload: { skill: 'hand', amount: 150 } };
      const next = gameReducer(initialState, action);
      expect(next.player.sexual_skills.hand).toBe(100);
    });
  });

  describe('DoL-parity: Insecurity system', () => {
    it('should handle UPDATE_INSECURITY', () => {
      const action = { type: 'UPDATE_INSECURITY', payload: { part: 'face', amount: 20 } };
      const next = gameReducer(initialState, action);
      expect(next.player.insecurity.face).toBe(initialState.player.insecurity.face + 20);
    });

    it('should clamp insecurity to 0-100', () => {
      const action = { type: 'UPDATE_INSECURITY', payload: { part: 'chest', amount: -200 } };
      const next = gameReducer(initialState, action);
      expect(next.player.insecurity.chest).toBe(0);
    });
  });

  describe('DoL-parity: Direct stat update actions', () => {
    it('should handle UPDATE_LEWDITY_STATS', () => {
      const action = { type: 'UPDATE_LEWDITY_STATS', payload: { exhibitionism: 15, deviancy: 10 } };
      const next = gameReducer(initialState, action);
      expect(next.player.lewdity_stats.exhibitionism).toBe(15);
      expect(next.player.lewdity_stats.deviancy).toBe(10);
      expect(next.player.lewdity_stats.promiscuity).toBe(0);
    });

    it('should clamp UPDATE_LEWDITY_STATS to 0-100', () => {
      const action = { type: 'UPDATE_LEWDITY_STATS', payload: { masochism: -50, promiscuity: 150 } };
      const next = gameReducer(initialState, action);
      expect(next.player.lewdity_stats.masochism).toBe(0);
      expect(next.player.lewdity_stats.promiscuity).toBe(100);
    });

    it('should handle UPDATE_SENSITIVITY', () => {
      const action = { type: 'UPDATE_SENSITIVITY', payload: { mouth: 12, genitals: -15 } };
      const next = gameReducer(initialState, action);
      expect(next.player.sensitivity.mouth).toBe(initialState.player.sensitivity.mouth + 12);
      expect(next.player.sensitivity.genitals).toBe(initialState.player.sensitivity.genitals - 15);
    });

    it('should clamp UPDATE_SENSITIVITY to 0-100', () => {
      const action = { type: 'UPDATE_SENSITIVITY', payload: { feet: -50, chest: 200 } };
      const next = gameReducer(initialState, action);
      expect(next.player.sensitivity.feet).toBe(0);
      expect(next.player.sensitivity.chest).toBe(100);
    });

    it('should handle UPDATE_TEMPERATURE', () => {
      const action = { type: 'UPDATE_TEMPERATURE', payload: { ambient_temp: -8, clothing_warmth: 55, body_temp: 'cold' } };
      const next = gameReducer(initialState, action);
      expect(next.player.temperature.ambient_temp).toBe(-8);
      expect(next.player.temperature.clothing_warmth).toBe(55);
      expect(next.player.temperature.body_temp).toBe('cold');
    });

    it('should clamp UPDATE_TEMPERATURE numeric values', () => {
      const action = { type: 'UPDATE_TEMPERATURE', payload: { ambient_temp: 999, clothing_warmth: -25 } };
      const next = gameReducer(initialState, action);
      expect(next.player.temperature.ambient_temp).toBe(50);
      expect(next.player.temperature.clothing_warmth).toBe(0);
    });
  });

  describe('DoL-parity: Temperature system', () => {
    it('should compute temperature from weather in RESOLVE_TEXT', () => {
      const coldState: GameState = {
        ...initialState,
        world: { ...initialState.world, weather: 'Blizzard' },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Freezing.', hours_passed: 1 },
          actionText: 'Endure',
        },
      };
      const next = gameReducer(coldState, action);
      expect(next.player.temperature.ambient_temp).toBe(-15);
      expect(['freezing', 'cold']).toContain(next.player.temperature.body_temp);
    });

    it('should compute warm temperature from hot weather', () => {
      const hotState: GameState = {
        ...initialState,
        world: { ...initialState.world, weather: 'Scorching' },
      };
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Burning.', hours_passed: 1 },
          actionText: 'Swelter',
        },
      };
      const next = gameReducer(hotState, action);
      expect(next.player.temperature.ambient_temp).toBe(38);
      expect(['hot', 'overheating', 'warm']).toContain(next.player.temperature.body_temp);
    });

    it('initial temperature state should be valid', () => {
      expect(initialState.player.temperature.body_temp).toBe('chilly');
      expect(initialState.player.temperature.clothing_warmth).toBe(15);
    });
  });

  describe('DoL-parity: Lewdity stats in RESOLVE_TEXT', () => {
    it('should increase exhibitionism when purity drops', () => {
      const action = {
        type: 'RESOLVE_TEXT',
        payload: {
          parsedText: { narrative_text: 'Exposed.', stat_deltas: { purity: -20 } },
          actionText: 'Undress',
        },
      };
      const next = gameReducer(initialState, action);
      expect(next.player.lewdity_stats.exhibitionism).toBeGreaterThan(0);
    });

    it('initial lewdity stats should be zero', () => {
      expect(initialState.player.lewdity_stats.exhibitionism).toBe(0);
      expect(initialState.player.lewdity_stats.promiscuity).toBe(0);
      expect(initialState.player.lewdity_stats.deviancy).toBe(0);
      expect(initialState.player.lewdity_stats.masochism).toBe(0);
    });
  });

  describe('DoL-parity: New locations data integrity', () => {
    const newLocationIds = [
      'park', 'hospital', 'prison', 'strip_club', 'dance_studio',
      'arcade', 'shopping_centre', 'moor', 'wolf_cave', 'eden_cabin',
      'ocean', 'sewers', 'museum', 'cafe'
    ];

    for (const locId of newLocationIds) {
      it(`should have location: ${locId}`, () => {
        expect(LOCATIONS[locId]).toBeDefined();
        expect(LOCATIONS[locId].id).toBe(locId);
        expect(LOCATIONS[locId].name).toBeTruthy();
        expect(LOCATIONS[locId].actions.length).toBeGreaterThan(0);
      });
    }
  });

  describe('DoL-parity: New encounters data integrity', () => {
    const newEncounterIds = [
      'park_stalker', 'sewer_slime', 'strip_club_patron', 'moor_hawk',
      'ocean_creature', 'prison_inmate', 'wolf_pack_cave', 'shopping_pickpocket',
      'blood_moon_horror', 'swarm_insects'
    ];

    for (const encId of newEncounterIds) {
      it(`should have encounter: ${encId}`, () => {
        const enc = ENCOUNTERS.find((e: any) => e.id === encId);
        expect(enc).toBeDefined();
        expect(typeof enc!.condition).toBe('function');
        expect(enc!.outcome).toBeTruthy();
        expect(enc!.anatomy).toBeDefined();
      });
    }
  });

  describe('DoL-parity: Initial state completeness', () => {
    it('should have all DoL-parity player subsystems', () => {
      expect(initialState.player.attitudes).toBeDefined();
      expect(initialState.player.sensitivity).toBeDefined();
      expect(initialState.player.sexual_skills).toBeDefined();
      expect(initialState.player.virginities).toBeDefined();
      expect(initialState.player.body_fluids).toBeDefined();
      expect(initialState.player.insecurity).toBeDefined();
      expect(initialState.player.lewdity_stats).toBeDefined();
      expect(initialState.player.traits).toBeDefined();
      expect(initialState.player.feats).toBeDefined();
      expect(initialState.player.temperature).toBeDefined();
      expect(initialState.player.bailey_payment).toBeDefined();
    });

    it('attitudes should default to neutral', () => {
      expect(initialState.player.attitudes.sexual).toBe('neutral');
      expect(initialState.player.attitudes.crime).toBe('neutral');
      expect(initialState.player.attitudes.labour).toBe('neutral');
    });

    it('sensitivity should have all body parts with valid ranges', () => {
      for (const val of Object.values(initialState.player.sensitivity)) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }
    });

    it('sexual skills should all start at 0', () => {
      for (const val of Object.values(initialState.player.sexual_skills)) {
        expect(val).toBe(0);
      }
    });
  });
});

// ── Phase 2 reducer tests ────────────────────────────────────────────────
describe('Phase 2: event flags', () => {
  it('SET_EVENT_FLAG sets a boolean flag', () => {
    const next = gameReducer(initialState, { type: 'SET_EVENT_FLAG', payload: { flag: 'bailey_intro_done' } });
    expect(next.world.event_flags.bailey_intro_done).toBe(true);
  });

  it('SET_EVENT_FLAG sets a numeric flag', () => {
    const next = gameReducer(initialState, { type: 'SET_EVENT_FLAG', payload: { flag: 'school_strikes', value: 3 } });
    expect(next.world.event_flags.school_strikes).toBe(3);
  });

  it('CLEAR_EVENT_FLAG removes a flag', () => {
    const withFlag = gameReducer(initialState, { type: 'SET_EVENT_FLAG', payload: { flag: 'temp_flag' } });
    const cleared = gameReducer(withFlag, { type: 'CLEAR_EVENT_FLAG', payload: { flag: 'temp_flag' } });
    expect(cleared.world.event_flags.temp_flag).toBeUndefined();
  });
});

describe('Phase 2: NPC relationships', () => {
  it('UPDATE_NPC_RELATIONSHIP creates a new relationship entry', () => {
    const next = gameReducer(initialState, {
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: { npc_id: 'robin', deltas: { trust: 20, love: 10 } },
    });
    expect(next.world.npc_relationships.robin).toBeDefined();
    expect(next.world.npc_relationships.robin.trust).toBe(20);
    expect(next.world.npc_relationships.robin.love).toBe(10);
    expect(next.world.npc_relationships.robin.milestone).toBe('acquaintance');
  });

  it('UPDATE_NPC_RELATIONSHIP accumulates on existing entry', () => {
    const withRel = gameReducer(initialState, {
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: { npc_id: 'robin', deltas: { trust: 50, love: 50 } },
    });
    const next = gameReducer(withRel, {
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: { npc_id: 'robin', deltas: { trust: 40, love: 40 } },
    });
    expect(next.world.npc_relationships.robin.trust).toBe(90);
    expect(next.world.npc_relationships.robin.milestone).toBe('bonded');
  });

  it('UPDATE_NPC_RELATIONSHIP clamps values to 0-100', () => {
    const next = gameReducer(initialState, {
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: { npc_id: 'whitney', deltas: { fear: 999, dom: -50 } },
    });
    expect(next.world.npc_relationships.whitney.fear).toBe(100);
    expect(next.world.npc_relationships.whitney.dom).toBe(0);
  });

  it('SET_NPC_SCENE_FLAG marks a scene flag on an NPC', () => {
    const next = gameReducer(initialState, {
      type: 'SET_NPC_SCENE_FLAG',
      payload: { npc_id: 'eden', flag: 'first_meeting_done', value: true },
    });
    expect(next.world.npc_relationships.eden.scene_flags.first_meeting_done).toBe(true);
  });
});

describe('Phase 2: ADVANCE_TIME', () => {
  it('advances hour correctly without crossing midnight', () => {
    const next = gameReducer(initialState, { type: 'ADVANCE_TIME', payload: { hours: 3 } });
    expect(next.world.hour).toBe(10); // starts at 7
    expect(next.world.day).toBe(initialState.world.day);
  });

  it('increments day and wraps hour on midnight crossing', () => {
    const next = gameReducer(initialState, { type: 'ADVANCE_TIME', payload: { hours: 20 } });
    expect(next.world.hour).toBe(3);   // 7 + 20 = 27 => 27 % 24 = 3
    expect(next.world.day).toBe(initialState.world.day + 1);
  });

  it('drains life sim needs', () => {
    const next = gameReducer(initialState, { type: 'ADVANCE_TIME', payload: { hours: 4 } });
    expect(next.player.life_sim.needs.hunger).toBeLessThan(initialState.player.life_sim.needs.hunger);
    expect(next.player.life_sim.needs.thirst).toBeLessThan(initialState.player.life_sim.needs.thirst);
  });

  it('adds bailey debt on payment due day crossing', () => {
    // Set due_day to 0 (Monday) and advance by 7 days
    const state7 = { ...initialState, world: { ...initialState.world, day: 1, hour: 0 } };
    const next = gameReducer(state7, { type: 'ADVANCE_TIME', payload: { hours: 24 * 7 } });
    expect(next.player.bailey_payment.debt).toBeGreaterThan(0);
  });

  it('recalculates body temperature', () => {
    // Cold environment, no clothing warmth
    const coldState = {
      ...initialState,
      player: {
        ...initialState.player,
        temperature: { ambient_temp: -5, clothing_warmth: 0, body_temp: 'comfortable' as const },
      },
    };
    const next = gameReducer(coldState, { type: 'ADVANCE_TIME', payload: { hours: 1 } });
    expect(['cold', 'chilly', 'freezing']).toContain(next.player.temperature.body_temp);
  });
});

describe('Phase 2: DAMAGE_CLOTHING', () => {
  it('reduces integrity of targeted item', () => {
    const next = gameReducer(initialState, {
      type: 'DAMAGE_CLOTHING',
      payload: { item_id: 'orphan-rags', amount: 15 },
    });
    const item = next.player.inventory.find(i => i.id === 'orphan-rags');
    expect(item?.integrity).toBe(45); // starts at 60
  });

  it('clamps integrity to 0 on heavy damage', () => {
    const next = gameReducer(initialState, {
      type: 'DAMAGE_CLOTHING',
      payload: { item_id: 'orphan-rags', amount: 500 },
    });
    const item = next.player.inventory.find(i => i.id === 'orphan-rags');
    expect(item?.integrity).toBe(0);
  });
});

describe('Phase 2: justice system', () => {
  it('ADD_JUSTICE_BOUNTY increases bounty', () => {
    const next = gameReducer(initialState, {
      type: 'ADD_JUSTICE_BOUNTY',
      payload: { amount: 50, suspicion: 20 },
    });
    expect(next.player.justice.bounty).toBe(50);
    expect(next.player.justice.suspicion).toBe(20);
  });

  it('CLEAR_JUSTICE_BOUNTY resets bounty, suspicion, and jail sentence', () => {
    const withBounty = gameReducer(initialState, {
      type: 'ADD_JUSTICE_BOUNTY',
      payload: { amount: 100, suspicion: 80 },
    });
    const cleared = gameReducer(withBounty, { type: 'CLEAR_JUSTICE_BOUNTY' });
    expect(cleared.player.justice.bounty).toBe(0);
    expect(cleared.player.justice.suspicion).toBe(0);
  });
});
