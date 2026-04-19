/**
 * PsychologySystem — handles trauma, willpower, submission, and addiction.
 * Pure logic for the life simulation core.
 */
import { GameState, PlayerAddictionState } from '../types';

/**
 * Update psychological state based on actions and needs.
 */
export function tickPsychology(state: GameState, hours: number) {
  const p = { ...state.player.psych_profile };
  const stats = { ...state.player.stats };
  const dailyFactor = hours / 24;

  // 1. Trauma & Stress passive recovery
  if (state.player.life_sim.needs.energy > 80 && state.player.life_sim.needs.happiness > 60) {
    stats.stress = Math.max(0, stats.stress - 2 * hours);
    stats.trauma = Math.max(0, stats.trauma - 0.5 * dailyFactor);
  }

  // 2. Submission/Domination drift
  // If player frequently uses submissive stances/intents
  if (state.world.last_intent === 'submissive') {
    p.submission_index = Math.min(100, p.submission_index + 1);
  } else if (state.world.last_intent === 'aggressive') {
    p.submission_index = Math.max(0, p.submission_index - 1);
  }

  return { psych_profile: p, stats };
}

/**
 * Handle substance use and addiction progression.
 */
export function handleSubstanceUse(state: GameState, substance: string): PlayerAddictionState {
  const addiction = { ...state.player.addiction_state };
  const turn = state.world.turn_count;

  // Find or create entry
  let entry = addiction.addictions.find(a => a.substance === substance);
  if (!entry) {
    entry = {
      substance: substance as any,
      dependency: 5,
      tolerance: 10,
      withdrawal: 0,
      last_use_turn: turn,
      total_uses: 1
    };
    addiction.addictions.push(entry);
  } else {
    entry.dependency = Math.min(100, entry.dependency + 10);
    entry.tolerance = Math.min(100, entry.tolerance + 5);
    entry.last_use_turn = turn;
    entry.total_uses += 1;
  }

  // Update overall dependency
  addiction.overall_dependency = addiction.addictions.reduce((sum, a) => sum + a.dependency, 0) / (addiction.addictions.length || 1);

  return addiction;
}
