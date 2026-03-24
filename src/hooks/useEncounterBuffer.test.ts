import { renderHook, act } from '@testing-library/react';
import { useEncounterBuffer } from './useEncounterBuffer';
import { GameState } from '../types';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useEncounterBuffer', () => {
  let mockState: GameState;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    mockState = {
      world: {
        current_location: { name: 'Test Forest' }
      },
      ui: {
        isPollingText: false
      }
    } as unknown as GameState;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with an empty buffer', () => {
    const { result } = renderHook(() => useEncounterBuffer(mockState));
    expect(result.current).toEqual([]);
  });

  it('should generate an encounter after 5000ms', () => {
    const { result } = renderHook(() => useEncounterBuffer(mockState));

    expect(result.current).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual({
      pregenerated: true,
      location: 'Test Forest',
      timestamp: Date.now()
    });
  });

  it('should continue generating encounters up to 3', () => {
    const { result } = renderHook(() => useEncounterBuffer(mockState));

    act(() => {
      vi.advanceTimersByTime(5000); // 1st
    });
    expect(result.current).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000); // 2nd
    });
    expect(result.current).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(5000); // 3rd
    });
    expect(result.current).toHaveLength(3);

    act(() => {
      vi.advanceTimersByTime(5000); // 4th, should not add
    });
    expect(result.current).toHaveLength(3);
  });

  it('should not generate an encounter if isPollingText is true', () => {
    mockState.ui.isPollingText = true;
    const { result } = renderHook(() => useEncounterBuffer(mockState));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toEqual([]);
  });

  it('should clean up the timer on unmount', () => {
    const { unmount } = renderHook(() => useEncounterBuffer(mockState));

    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // If timer wasn't cleaned up, advancing timers might cause a state update after unmount
    // However, since we can't easily assert on `result.current` after unmount cleanly,
    // getting no act warnings / errors is usually enough, but we can verify timers are clear
    expect(vi.getTimerCount()).toBe(0);
  });
});
