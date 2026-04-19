/**
 * BiologySystem — handles fertility, pregnancy, lactation, and parasites.
 * Pure logic for the life simulation core.
 */
import { GameState, Parasite, Incubation } from '../types';

/**
 * Tick biology state for elapsed time.
 * Handles cycle progression, maturity, and growth.
 */
export function tickBiology(state: GameState, hours: number) {
  const bio = { ...state.player.biology };
  const dailyFactor = hours / 24;

  // 1. Fertility Cycle (28 day cycle)
  bio.cycle_day = (bio.cycle_day + dailyFactor) % 28;
  
  // Update cycle stage based on day
  if (bio.cycle_day < 5) bio.fertility_cycle = 'menstrual';
  else if (bio.cycle_day < 11) bio.fertility_cycle = 'follicular';
  else if (bio.cycle_day < 16) bio.fertility_cycle = 'ovulatory';
  else bio.fertility_cycle = 'luteal';

  // Update conception chance
  if (bio.fertility_cycle === 'ovulatory') bio.fertility = 0.4 + (Math.random() * 0.2);
  else if (bio.fertility_cycle === 'menstrual') bio.fertility = 0.01;
  else bio.fertility = 0.1;

  // 2. Incubations / Pregnancy
  bio.incubations = bio.incubations.map(inc => {
    const progressGain = (hours / (inc.days_remaining * 24)) * 100;
    return {
      ...inc,
      progress: Math.min(100, inc.progress + (hours / 24) * 5), // placeholder rate
      days_remaining: Math.max(0, inc.days_remaining - dailyFactor)
    };
  }).filter(inc => inc.days_remaining > 0 || inc.progress < 100);

  // 3. Lactation
  if (bio.lactation_level > 0) {
    // Natural fade if not stimulated/milked
    bio.lactation_level = Math.max(0, bio.lactation_level - 0.5 * dailyFactor);
  }

  // 4. Parasites
  bio.parasites = bio.parasites.map(p => ({
    ...p,
    days_left: Math.max(0, p.days_left - dailyFactor)
  })).filter(p => p.days_left > 0);

  return bio;
}

/**
 * Attempt conception.
 */
export function attemptConception(state: GameState, intensity: number): Incubation | null {
  const bio = state.player.biology;
  const chance = bio.fertility * intensity;
  
  if (Math.random() < chance) {
    return {
      type: 'Humanoid',
      progress: 0,
      days_remaining: 28 // 28 game days for pregnancy
    };
  }
  return null;
}
