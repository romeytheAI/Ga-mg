/**
 * AcademySystem — handles Winterhold / College of Winterhold daily loop.
 * Elder Scrolls reskin of DoL School system.
 */
import { GameState } from '../types';

/**
 * Tick academy progress (grades decay if not attending, suspension timers).
 */
export function tickAcademy(state: GameState, hours: number): any {
  const acad = { ...state.player.academy };
  const dailyFactor = hours / 24;

  if (!acad.enrolled) return acad;

  // 1. Grade Decay
  // If not attending class, grades slowly drop
  Object.keys(acad.grades).forEach(track => {
    acad.grades[track] = Math.max(0, acad.grades[track] - 0.5 * dailyFactor);
  });

  // 2. Suspension Timer
  if (acad.suspension_timer > 0) {
    acad.suspension_timer = Math.max(0, acad.suspension_timer - dailyFactor);
  }

  return acad;
}

/**
 * Handle class attendance results.
 */
export function attendClass(state: GameState, track: string): { gold: number, grades_gain: number, stress_gain: number } {
  const currentGrade = state.player.academy.grades[track] || 50;
  
  // High stress reduces grade gain
  const performance = Math.max(0.2, (100 - state.player.stats.stress) / 100);
  const gain = 5 * performance;
  
  return {
    gold: 0,
    grades_gain: gain,
    stress_gain: 10
  };
}
