import { useEffect, useRef } from 'react';
import { GameState } from '../types';
import { saveGame } from '../utils/saveManager';

const AUTOSAVE_SLOT = 'autosave';
const AUTOSAVE_INTERVAL_MS = 60_000; // 1 minute

/**
 * Periodically autosaves the game state to IndexedDB.
 *
 * - Saves to a dedicated 'autosave' slot separate from manual saves
 * - Only fires when the game has progressed (turn_count > 0)
 * - Debounced to avoid saving during rapid action sequences
 * - Silent failure — logs to console but never disrupts gameplay
 *
 * @param state Current game state (null before initialization)
 * @param intervalMs Override autosave interval for testing (default 60s)
 */
export function useAutosave(
  state: GameState | null,
  intervalMs: number = AUTOSAVE_INTERVAL_MS,
): void {
  const lastSavedTurn = useRef<number>(-1);

  useEffect(() => {
    if (!state || state.world.turn_count === 0) return;

    const timer = setInterval(() => {
      if (state.world.turn_count !== lastSavedTurn.current) {
        lastSavedTurn.current = state.world.turn_count;
        saveGame(AUTOSAVE_SLOT, state).catch((err) => {
          console.error('[Autosave] Failed:', err);
        });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [state, intervalMs]);
}

/**
 * Triggers an immediate autosave.
 *
 * Use this for critical moments:
 * - After completing a story arc
 * - Before entering a dangerous area
 * - When the player manually triggers quicksave
 */
export async function triggerAutosave(state: GameState): Promise<void> {
  try {
    await saveGame(AUTOSAVE_SLOT, state);
  } catch (err) {
    console.error('[Autosave] Immediate save failed:', err);
  }
}
