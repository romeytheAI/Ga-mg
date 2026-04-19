/**
 * NeedsSystem — handles decay and scoring for NPC needs.
 * Pure functions; no side effects, no UI imports.
 */
import { NpcNeeds, SimNpc, NpcTrait } from './types';

// Decay rates per simulated hour (percentage points lost)
const NEEDS_DECAY_PER_HOUR: NpcNeeds = {
  hunger:    3.0,
  energy:    2.5,
  social:    1.5,
  happiness: 0.8,
  wealth:    0.0, // wealth does not decay naturally
};

// Trait modifiers applied to decay rates (multipliers)
const TRAIT_DECAY_MODIFIERS: Record<NpcTrait, Partial<NpcNeeds>> = {
  brave:        {},
  cowardly:     { energy: 1.2 },
  greedy:       { happiness: 1.3 },
  generous:     { happiness: 0.8, wealth: 0 },
  aggressive:   { social: 1.4 },
  passive:      { social: 0.8 },
  flirtatious:  { social: 0.6 },
  reserved:     { social: 1.2 },
  curious:      { energy: 1.1 },
  paranoid:     { happiness: 1.4, energy: 1.2 },
  loyal:        { happiness: 0.9 },
  treacherous:  { happiness: 1.1, social: 1.2 },
};

/** Apply need decay for the given number of simulated hours. */
export function decayNeeds(npc: SimNpc, hours: number): NpcNeeds {
  const needs = { ...npc.needs };

  for (const key of Object.keys(NEEDS_DECAY_PER_HOUR) as (keyof NpcNeeds)[]) {
    let rate = NEEDS_DECAY_PER_HOUR[key] * hours;

    // Apply trait modifiers
    for (const trait of npc.traits) {
      const mod = TRAIT_DECAY_MODIFIERS[trait];
      if (mod[key] !== undefined) {
        rate *= mod[key] as number;
      }
    }

    needs[key] = Math.max(0, Math.min(100, needs[key] - rate));
  }

  return needs;
}

/** Compute a 0-1 urgency score for a given need (higher = more urgent). */
export function needUrgency(value: number): number {
  // Urgency rises sharply as the need drops below 30
  return Math.pow((100 - value) / 100, 2);
}

/** Return the most urgent need for an NPC (excluding wealth). */
export function mostUrgentNeed(needs: NpcNeeds): keyof NpcNeeds {
  const scoreable: (keyof NpcNeeds)[] = ['hunger', 'energy', 'social', 'happiness'];
  let best: keyof NpcNeeds = 'hunger';
  let bestScore = -1;
  for (const k of scoreable) {
    const s = needUrgency(needs[k]);
    if (s > bestScore) { bestScore = s; best = k; }
  }
  return best;
}

/** True when any critical need (hunger/energy) is below the danger threshold. */
export function hasNeedCrisis(needs: NpcNeeds): boolean {
  return needs.hunger < 15 || needs.energy < 10;
}

/** Compute a happiness delta based on current needs (for passive happiness change). */
export function computeHappinessDelta(needs: NpcNeeds): number {
  const avgCore = (needs.hunger + needs.energy + needs.social) / 3;
  // Positive delta when core needs are high, negative when low
  return (avgCore - 50) * 0.04; // -2 to +2 per tick
}

/** Apply an activity's restorative effect to a needs object. */
export function applyActivityEffect(
  needs: NpcNeeds,
  activity: 'eating' | 'sleeping' | 'socializing' | 'working' | 'trading' | 'idle',
  hours: number
): NpcNeeds {
  const n = { ...needs };
  const h = hours;
  switch (activity) {
    case 'eating':
      n.hunger = Math.min(100, n.hunger + 30 * h);
      n.happiness = Math.min(100, n.happiness + 5 * h);
      break;
    case 'sleeping':
      n.energy = Math.min(100, n.energy + 35 * h);
      n.happiness = Math.min(100, n.happiness + 3 * h);
      break;
    case 'socializing':
      n.social = Math.min(100, n.social + 25 * h);
      n.happiness = Math.min(100, n.happiness + 8 * h);
      break;
    case 'working':
      n.energy = Math.max(0, n.energy - 10 * h);
      n.wealth = Math.min(100, n.wealth + 15 * h);
      break;
    case 'trading':
      n.wealth = Math.min(100, n.wealth + 8 * h);
      n.social = Math.min(100, n.social + 5 * h);
      break;
    case 'idle':
      n.energy = Math.min(100, n.energy + 5 * h);
      break;
  }
  return n;
}

/**
 * Player-specific: Calculate needs decay and activity modifiers for the GameState.
 */
export function tickPlayerNeeds(state: any, hours: number): any {
  const n = { ...state.player.life_sim.needs };
  const currentActivity = state.player.life_sim.schedule.current_activity;
  const lastIntent = state.world.last_intent;

  // Passive hourly drain
  let hungerDrain = 3.0;
  let thirstDrain = 4.0;
  let energyDrain = 2.5;
  let hygieneDrain = 1.5;
  let socialDrain = 1.0;
  let happinessDrain = 0.5;

  // Activity modifiers
  switch (currentActivity) {
    case 'working':
      hungerDrain += 2.0;
      energyDrain += 2.5;
      hygieneDrain += 1.5;
      break;
    case 'sleeping':
      energyDrain = -35.0; // restorative
      hungerDrain *= 0.5;
      thirstDrain *= 0.5;
      happinessDrain = -2.0;
      break;
    case 'eating':
      hungerDrain = -60.0;
      happinessDrain = -5.0;
      break;
    case 'bathing':
      hygieneDrain = -50.0;
      happinessDrain = -3.0;
      break;
    case 'socializing':
      socialDrain = -20.0;
      happinessDrain = -10.0;
      break;
    case 'travelling':
      hungerDrain += 1.0;
      thirstDrain += 1.5;
      energyDrain += 2.0;
      break;
  }

  // Intent modifiers (if not in a specific scheduled activity)
  if (currentActivity === 'idle') {
    if (lastIntent === 'work') {
      hungerDrain += 1.5;
      energyDrain += 2.0;
    } else if (lastIntent === 'social') {
      socialDrain -= 10.0;
    }
  }

  n.hunger = Math.max(0, Math.min(100, n.hunger - hungerDrain * hours));
  n.thirst = Math.max(0, Math.min(100, n.thirst - thirstDrain * hours));
  n.energy = Math.max(0, Math.min(100, n.energy - energyDrain * hours));
  n.hygiene = Math.max(0, Math.min(100, n.hygiene - hygieneDrain * hours));
  n.social = Math.max(0, Math.min(100, n.social - socialDrain * hours));
  n.happiness = Math.max(0, Math.min(100, n.happiness - happinessDrain * hours));

  return n;
}
