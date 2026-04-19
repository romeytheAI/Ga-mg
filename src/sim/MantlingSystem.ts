/**
 * MantlingSystem — handles the metaphysical process of 'Becoming' a god.
 * Pure logic for the end-game simulation core.
 */
import { GameState } from '../types';
import { MantlingState } from './types';

/**
 * Tick mantling progress based on alignment with the target god's sphere.
 */
export function tickMantling(state: GameState, hours: number): MantlingState | null {
  const m = state.player.mantling;
  if (!m) return null;

  const nextM = { ...m };
  const dailyFactor = hours / 24;

  // 1. Synchronicity Check
  // Progress depends on performing actions that mirror the God's sphere
  const intent = state.world.last_intent;
  let syncGain = 0;

  switch (m.target_god) {
    case 'sheogorath':
      if (state.player.stats.hallucination > 50) syncGain += 2;
      if (intent === 'trickery') syncGain += 1;
      break;
    case 'molag_bal':
      if (intent === 'domination') syncGain += 2;
      if (state.player.lewdity_stats.masochism > 40) syncGain += 1;
      break;
    // Add other gods...
  }

  nextM.synchronicity = Math.min(100, nextM.synchronicity + syncGain * dailyFactor);

  // 2. Paradox Accumulation
  // Being 'yourself' while becoming 'another' creates paradox
  if (state.player.identity.name === 'Vael' && nextM.synchronicity > 50) {
    nextM.paradox_level = Math.min(100, nextM.paradox_level + 0.5 * dailyFactor);
  }

  // 3. Trait Manifestation
  if (nextM.synchronicity > 25 && !nextM.mantle_traits.includes('divine_echo')) {
    nextM.mantle_traits.push('divine_echo');
  }
  if (nextM.synchronicity > 75 && !nextM.mantle_traits.includes('reality_anchor_breaking')) {
    nextM.mantle_traits.push('reality_anchor_breaking');
  }

  return nextM;
}

/**
 * Initiate the mantling process.
 */
export function startMantling(state: GameState, godId: any): MantlingState {
  return {
    target_god: godId,
    synchronicity: 1,
    paradox_level: 0,
    mantle_traits: [],
    reality_anchors: ['mortal_name', 'mortal_attachments']
  };
}
