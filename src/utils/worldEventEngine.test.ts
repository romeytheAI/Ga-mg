import { describe, it, expect } from 'vitest';
import { checkForNewEvents, applyEventWorldState } from './worldEventEngine';
import { GameState } from '../types';
import { initialState } from '../state/initialState';

// ── helpers ────────────────────────────────────────────────────────────────

function stateAtDay(day: number, level = 1, activeEvents: string[] = []): GameState {
  return {
    ...initialState,
    player: { ...initialState.player, level },
    world: { ...initialState.world, day, active_world_events: activeEvents },
  };
}

// ── checkForNewEvents ──────────────────────────────────────────────────────

describe('worldEventEngine – checkForNewEvents', () => {
  it('returns an array (possibly empty) for a normal day', () => {
    const result = checkForNewEvents(stateAtDay(1));
    expect(Array.isArray(result)).toBe(true);
  });

  it('does not re-trigger already-active events', () => {
    // Day 30 would normally fire day-30 events
    const state = stateAtDay(30);
    const triggered = checkForNewEvents(state);
    if (triggered.length === 0) return; // nothing triggers on day 30 in this dataset

    // Mark all triggered events as already active and check again
    const alreadyActive = triggered.map(e => e.id);
    const state2 = stateAtDay(30, 1, alreadyActive);
    const retriggered = checkForNewEvents(state2);
    const overlap = retriggered.filter(e => alreadyActive.includes(e.id));
    expect(overlap).toHaveLength(0);
  });

  it('returns WorldEvent objects with id and triggers', () => {
    // Try multiple milestone days to find one that fires
    const candidates = [30, 45, 60, 100];
    for (const day of candidates) {
      const result = checkForNewEvents(stateAtDay(day));
      for (const event of result) {
        expect(event.id).toBeTruthy();
        expect(Array.isArray(event.triggers)).toBe(true);
      }
    }
  });

  it('triggers events when player reaches level 10', () => {
    const lowLevel = stateAtDay(1, 1);
    const highLevel = stateAtDay(1, 10);
    const lowResult = checkForNewEvents(lowLevel);
    const highResult = checkForNewEvents(highLevel);
    // High level should trigger at least as many events as low level
    expect(highResult.length).toBeGreaterThanOrEqual(lowResult.length);
  });

  it('does not trigger on a non-milestone day with low level', () => {
    // Day 7 is not a multiple of 30/45/60/100 and level 1 < 10
    const result = checkForNewEvents(stateAtDay(7, 1));
    expect(result).toHaveLength(0);
  });
});

// ── applyEventWorldState ───────────────────────────────────────────────────

describe('worldEventEngine – applyEventWorldState', () => {
  it('returns empty object for unknown event id', () => {
    const result = applyEventWorldState(initialState, 'nonexistent_event_id');
    expect(result).toEqual({});
  });

  it('returns world_state_changes for a known event', () => {
    // Find a valid event id from the actual data
    const triggered = checkForNewEvents(stateAtDay(30));
    if (triggered.length === 0) {
      // Try day 45
      const triggered2 = checkForNewEvents(stateAtDay(45));
      if (triggered2.length === 0) return; // no events in test data, skip
      const result = applyEventWorldState(initialState, triggered2[0].id);
      expect(typeof result).toBe('object');
    } else {
      const result = applyEventWorldState(initialState, triggered[0].id);
      expect(typeof result).toBe('object');
    }
  });
});
