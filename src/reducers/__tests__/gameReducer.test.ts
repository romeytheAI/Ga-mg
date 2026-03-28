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
          expect(action.intent).toBeTruthy();
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
  });
});
