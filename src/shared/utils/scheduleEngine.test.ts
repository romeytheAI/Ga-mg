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
import { NpcSchedule, NpcScheduleSlot, NpcRelationship } from '../../core/types';
import { initialState } from '../../core/state/initialState';
import { GameState } from '../../core/types';

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
};

const acquaintanceRel: NpcRelationship = {
  ...friendRel,
  milestone: 'acquaintance',
  trust: 30,
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
    { label: 'Night', location_id: 'night_loc', time: { from: 22, to: 6 } },   / midnight wrap
  ],
};

const stateAtHour = (hour: number, week_day = 0): GameState => ({
  ...initialState,
  world: { ...initialState.world, hour, week_day },
});

// ── isSlotActive ─────────────────────────────────────────────────────────────

describe('isSlotActive – time window', () => {
  it('returns true when hour is inside window', () => {
    expect(isSlotActive(simpleSlot(8, 16), 10, 0, noRel, noFlags)).toBe(true);
  });

  it('returns false when hour is before window', () => {
    expect(isSlotActive(simpleSlot(8, 16), 7, 0, noRel, noFlags)).toBe(false);
  });

  it('returns false when hour is at or past end of window', () => {
    expect(isSlotActive(simpleSlot(8, 16), 16, 0, noRel, noFlags)).toBe(false);
  });

  it('handles midnight wrap (from > to) — active after from', () => {
    expect(isSlotActive(simpleSlot(22, 6), 23, 0, noRel, noFlags)).toBe(true);
  });

  it('handles midnight wrap (from > to) — active before to', () => {
    expect(isSlotActive(simpleSlot(22, 6), 3, 0, noRel, noFlags)).toBe(true);
  });

  it('handles midnight wrap — inactive in the middle of day', () => {
    expect(isSlotActive(simpleSlot(22, 6), 12, 0, noRel, noFlags)).toBe(false);
  });
});

describe('isSlotActive – day-of-week condition', () => {
  const weekdayOnlySlot: NpcScheduleSlot = {
    ...simpleSlot(8, 16),
    conditions: { days_of_week: [0, 1, 2, 3, 4] },
  };

  it('returns true on a matching weekday', () => {
    expect(isSlotActive(weekdayOnlySlot, 10, 2, noRel, noFlags)).toBe(true);
  });

  it('returns false on a weekend day', () => {
    expect(isSlotActive(weekdayOnlySlot, 10, 5, noRel, noFlags)).toBe(false);
    expect(isSlotActive(weekdayOnlySlot, 10, 6, noRel, noFlags)).toBe(false);
  });
});

describe('isSlotActive – milestone condition', () => {
  const friendOnlySlot: NpcScheduleSlot = {
    ...simpleSlot(10, 18),
    conditions: { min_milestone: 'friend''},
  };

  it('passes when player meets min milestone', () => {
    expect(isSlotActive(friendOnlySlot, 12, 0, friendRel, noFlags)).toBe(true);
  });

  it('fails when player is below min milestone', () => {
    expect(isSlotActive(friendOnlySlot, 12, 0, acquaintanceRel, noFlags)).toBe(false);
  });

  it('fails when no relationship exists yet', () => {
    expect(isSlotActive(friendOnlySlot, 12, 0, noRel, noFlags)).toBe(false);
  });
});

describe('isSlotActive – event flag conditions', () => {
  const requiresFlagSlot: NpcScheduleSlot = {
    ...simpleSlot(10, 18),
    conditions: { requires_event_flag: 'quest_active''},
  };

  const blocksFlagSlot: NpcScheduleSlot = {
    ...simpleSlot(10, 18),
    conditions: { blocks_event_flag: 'quest_done''},
  };

  it('requires_event_flag: passes when flag is set', () => {
    expect(isSlotActive(requiresFlagSlot, 12, 0, noRel, { quest_active: true })).toBe(true);
  });

  it('requires_event_flag: fails when flag is absent', () => {
    expect(isSlotActive(requiresFlagSlot, 12, 0, noRel, noFlags)).toBe(false);
  });

  it('blocks_event_flag: passes when flag is absent', () => {
    expect(isSlotActive(blocksFlagSlot, 12, 0, noRel, noFlags)).toBe(true);
  });

  it('blocks_event_flag: fails when flag is set', () => {
    expect(isSlotActive(blocksFlagSlot, 12, 0, noRel, { quest_done: true })).toBe(false);
  });
});

// ── getActiveSlot ─────────────────────────────────────────────────────────────

describe('getActiveSlot', () => {
  it('returns first matching slot', () => {
    const slot = getActiveSlot(simpleSchedule, 9, 0, noRel, noFlags);
    expect(slot?.location_id).toBe('morning_loc');
  });

  it('returns correct slot at afternoon hour', () => {
    const slot = getActiveSlot(simpleSchedule, 14, 0, noRel, noFlags);
    expect(slot?.location_id).toBe('afternoon_loc');
  });

  it('returns midnight-wrap slot at late-night hour', () => {
    const slot = getActiveSlot(simpleSchedule, 23, 0, noRel, noFlags);
    expect(slot?.location_id).toBe('night_loc');
  });

  it('returns undefined when no slot matches', () => {
    // hour 20 falls outside all slots in simpleSchedule (18 ends afternoon, 22 starts night)
    const slot = getActiveSlot(simpleSchedule, 20, 0, noRel, noFlags);
    expect(slot).toBeUndefined();
  });
});

// ── getNpcCurrentLocation ─────────────────────────────────────────────────────

describe('getNpcCurrentLocation', () => {
  const stubSchedules: Record<string, NpcSchedule> = { test_npc: simpleSchedule };

  it('returns location_id for active slot', () => {
    const loc = getNpcCurrentLocation('test_npc', 9, 0, noRel, noFlags, stubSchedules);
    expect(loc).toBe('morning_loc');
  });

  it('returns undefined for unknown NPC', () => {
    const loc = getNpcCurrentLocation('ghost_npc', 9, 0, noRel, noFlags, stubSchedules);
    expect(loc).toBeUndefined();
  });
});

// ── getAvailableNpcsAtLocation ────────────────────────────────────────────────

describe('getAvailableNpcsAtLocation', () => {
  const npc1: NpcSchedule = {
    npc_id: 'npc1',
    slots: [{ label: 'Here', location_id: 'town', time: { from: 9, to: 17 } }],
  };
  const npc2: NpcSchedule = {
    npc_id: 'npc2',
    slots: [{ label: 'Here too', location_id: 'town', time: { from: 12, to: 20 } }],
  };
  const npc3: NpcSchedule = {
    npc_id: 'npc3',
    slots: [{ label: 'Elsewhere', location_id: 'forest', time: { from: 9, to: 17 } }],
  };
  const stubSched = { npc1, npc2, npc3 };

  it('returns npcs present at location at given hour', () => {
    const state = stateAtHour(14);
    const npcs = getAvailableNpcsAtLocation('town', state, stubSched);
    expect(npcs.sort()).toEqual(['npc1','npc2']);
  });

  it('excludes npcs not yet in window', () => {
    const state = stateAtHour(10);
    const npcs = getAvailableNpcsAtLocation('town', state, stubSched);
    expect(npcs).toEqual(['npc1']);
  });

  it('returns empty list when location is empty', () => {
    const state = stateAtHour(14);
    const npcs = getAvailableNpcsAtLocation('docks', state, stubSched);
    expect(npcs).toEqual([]);
  });
});

// ── getAllNpcCurrentLocations ──────────────────────────────────────────────────

describe('getAllNpcCurrentLocations', () => {
  const npc1: NpcSchedule = {
    npc_id: 'npc1',
    slots: [{ label: 'At town', location_id: 'town', time: { from: 9, to: 17 } }],
  };
  const npc2: NpcSchedule = {
    npc_id: 'npc2',
    slots: [{ label: 'At forest', location_id: 'forest', time: { from: 9, to: 17 } }],
  };

  it('returns a mapping of every active npc to its location', () => {
    const state = stateAtHour(12);
    const result = getAllNpcCurrentLocations(state, { npc1, npc2 });
    expect(result).toEqual({ npc1: 'town', npc2: 'forest''});
  });

  it('omits npcs with no active slot', () => {
    const state = stateAtHour(20);
    const result = getAllNpcCurrentLocations(state, { npc1, npc2 });
    expect(result).toEqual({});
  });
});

// ── computeDailyStatDeltas ────────────────────────────────────────────────────

describe('computeDailyStatDeltas', () => {
  it('stress delta is negative (recovery)', () => {
    const deltas = computeDailyStatDeltas(initialState, 1);
    expect((deltas.stats.stress ?? 0)).toBeLessThan(0);
  });

  it('lust delta is negative (natural fade)', () => {
    const deltas = computeDailyStatDeltas(initialState, 1);
    expect((deltas.stats.lust ?? 0)).toBeLessThan(0);
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
          constance_michel: { npc_id: 'constance_michel', trust: 50, love: 0, fear: 0, dom: 0, sub: 0, milestone: 'friend', met_on_day: 1, scene_flags: {} },
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
          constance_michel: { npc_id: 'constance_michel', trust: 10, love: 0, fear: 0, dom: 0, sub: 0, milestone: 'acquaintance', met_on_day: 1, scene_flags: {} },
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

  it('wraps around at end of week', () => {
    expect(advanceWeekDay(5, 3)).toBe(1);
  });

  it('advances zero days unchanged', () => {
    expect(advanceWeekDay(4, 0)).toBe(4);
  });

  it('handles multi-week advance', () => {
    expect(advanceWeekDay(0, 14)).toBe(0);
    expect(advanceWeekDay(0, 15)).toBe(1);
  });
});
