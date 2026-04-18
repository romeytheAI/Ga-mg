import { describe, it, expect } from 'vitest';
import {
  isSlotActive,
  getActiveSlot,
  getNpcCurrentLocation,
  getAvailableNpcsAtLocation,
  getAllNpcCurrentLocations,
  computeDailyStatDeltas,
  advanceWeekDay,
} from './scheduleEngine';
import { NpcSchedule, NpcScheduleSlot, NpcRelationship } from '../types';
import { initialState } from '../state/initialState';
import { GameState } from '../types';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const noRel = undefined;
const noFlags: Record<string, boolean | number> = {};

const friendRel: NpcRelationship = {
  npc_id: 'test_npc',
  trust: 60,
  love: 20,
  fear: 0,
  dom: 0,
  sub: 0,
  milestone: 'friend',
  met_on_day: 1,
  scene_flags: {},
  last_interaction_day: 0,
  interaction_count: 0,
};

const simpleSlot = (from: number, to: number): NpcScheduleSlot => ({
  label: 'test slot',
  location_id: 'test_loc',
  time: { from, to },
});

const simpleSchedule: NpcSchedule = {
  npc_id: 'test_npc',
  slots: [
    { label: 'Morning', location_id: 'morning_loc', time: { from: 6, to: 12 } },
    { label: 'Afternoon', location_id: 'afternoon_loc', time: { from: 12, to: 18 } },
    { label: 'Night', location_id: 'night_loc', time: { from: 22, to: 6 } },   // midnight wrap
  ],
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('scheduleEngine – isSlotActive', () => {
  it('identifies active slots normally', () => {
    const slot = simpleSlot(9, 17);
    expect(isSlotActive(slot, 12, 0, noRel, noFlags)).toBe(true);
    expect(isSlotActive(slot, 8, 0, noRel, noFlags)).toBe(false);
    expect(isSlotActive(slot, 18, 0, noRel, noFlags)).toBe(false);
  });

  it('handles midnight wrap (e.g. 22 to 6)', () => {
    const slot = simpleSlot(22, 6);
    expect(isSlotActive(slot, 23, 0, noRel, noFlags)).toBe(true);
    expect(isSlotActive(slot, 1, 0, noRel, noFlags)).toBe(true);
    expect(isSlotActive(slot, 7, 0, noRel, noFlags)).toBe(false);
  });
});

describe('scheduleEngine – getActiveSlot', () => {
  it('returns the first matching slot', () => {
    const slot = getActiveSlot(simpleSchedule, 14, 0, noRel, noFlags);
    expect(slot?.location_id).toBe('afternoon_loc');
  });

  it('returns undefined if no slot matches', () => {
    const slot = getActiveSlot(simpleSchedule, 20, 0, noRel, noFlags);
    expect(slot).toBeUndefined();
  });
});

describe('scheduleEngine – getNpcCurrentLocation', () => {
  it('returns the location from the active slot', () => {
    const schedules = { test_npc: simpleSchedule };
    const loc = getNpcCurrentLocation('test_npc', 10, 0, noRel, noFlags, schedules);
    expect(loc).toBe('morning_loc');
  });

  it('returns undefined if no slot is active', () => {
    const schedules = { test_npc: simpleSchedule };
    const loc = getNpcCurrentLocation('test_npc', 20, 0, noRel, noFlags, schedules);
    expect(loc).toBeUndefined();
  });
});

describe('scheduleEngine – getAvailableNpcsAtLocation', () => {
  const schedules = {
    test_npc: simpleSchedule,
    other_npc: {
      npc_id: 'other_npc',
      slots: [{ label: 'All day', location_id: 'morning_loc', time: { from: 0, to: 24 } }],
    },
  };

  it('lists NPCs at the requested location', () => {
    const state = {
      ...initialState,
      world: { ...initialState.world, hour: 10, week_day: 0 }
    };
    const npcs = getAvailableNpcsAtLocation('morning_loc', state, schedules);
    expect(npcs).toContain('test_npc');
    expect(npcs).toContain('other_npc');
  });

  it('excludes NPCs not at the requested location', () => {
    const state = {
      ...initialState,
      world: { ...initialState.world, hour: 14, week_day: 0 }
    };
    const npcs = getAvailableNpcsAtLocation('morning_loc', state, schedules);
    expect(npcs).not.toContain('test_npc');
    expect(npcs).toContain('other_npc');
  });
});

describe('scheduleEngine – getAllNpcCurrentLocations', () => {
  const schedules = { test_npc: simpleSchedule };
  it('returns a map of NPC IDs to locations', () => {
    const state = {
      ...initialState,
      world: { ...initialState.world, hour: 10, week_day: 0 }
    };
    const map = getAllNpcCurrentLocations(state, schedules);
    expect(map.test_npc).toBe('morning_loc');
  });
});

describe('scheduleEngine – computeDailyStatDeltas', () => {
  it('applies passive stat changes (stress -2, lust -1)', () => {
    const deltas = computeDailyStatDeltas(initialState, 1);
    expect(deltas.stats.stress).toBe(-2);
    expect(deltas.stats.lust).toBe(-1);
  });

  it('scales with daysElapsed', () => {
    const one = computeDailyStatDeltas(initialState, 1);
    const two = computeDailyStatDeltas(initialState, 2);
    expect(two.stats.stress!).toBe((one.stats.stress!) * 2);
  });

  it('decays trust for known NPCs with trust > 10', () => {
    const state: GameState = {
      ...initialState,
      world: {
        ...initialState.world,
        npc_relationships: {
          constance_michel: { npc_id: 'constance_michel', trust: 50, love: 0, fear: 0, dom: 0, sub: 0, milestone: 'friend', met_on_day: 1, scene_flags: {}, last_interaction_day: 0, interaction_count: 0 },
        },
      },
    };
    const deltas = computeDailyStatDeltas(state, 1);
    expect(deltas.npc_trust_deltas['constance_michel']).toBe(-1);
  });

  it('does not decay trust for NPCs with trust <= 10', () => {
    const state: GameState = {
      ...initialState,
      world: {
        ...initialState.world,
        npc_relationships: {
          constance_michel: { npc_id: 'constance_michel', trust: 10, love: 0, fear: 0, dom: 0, sub: 0, milestone: 'acquaintance', met_on_day: 1, scene_flags: {}, last_interaction_day: 0, interaction_count: 0 },
        },
      },
    };
    const deltas = computeDailyStatDeltas(state, 1);
    expect(deltas.npc_trust_deltas['constance_michel']).toBeUndefined();
  });

  it('gold_earned is 0 when no active jobs', () => {
    const deltas = computeDailyStatDeltas(initialState, 1);
    expect(deltas.gold_earned).toBe(0);
  });
});

// ── advanceWeekDay ────────────────────────────────────────────────────────────

describe('advanceWeekDay', () => {
  it('advances without wrapping within the week', () => {
    expect(advanceWeekDay(0, 3)).toBe(3);
  });

  it('wraps around to the beginning of the week (modulo 7)', () => {
    expect(advanceWeekDay(6, 1)).toBe(0);
    expect(advanceWeekDay(5, 4)).toBe(2);
  });
});
