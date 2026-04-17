/**
 * ClothingSystem — DoL-style clothing integrity, damage, and exposure.
 * Clothing degrades through combat and environmental wear.
 * Exposure affects NPC psychology and fame.
 * Pure functions; no side effects, no UI imports.
 */
import { ClothingItem, ClothingLoadout, ClothingSlot, SimNpc, FameRecord } from './types';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Create a default clothing item. */
export function createClothingItem(
  id: string,
  name: string,
  slot: ClothingSlot,
  overrides: Partial<ClothingItem> = {}
): ClothingItem {
  return {
    id,
    name,
    slot,
    integrity: 100,
    warmth: 0.3,
    concealment: 0.5,
    allure: 0.2,
    ...overrides,
  };
}

/** Create a default clothing loadout (basic clothes). */
export function defaultClothingLoadout(): ClothingLoadout {
  return {
    head: null,
    chest: createClothingItem('basic_tunic', 'Threadbare Tunic', 'chest', {
      warmth: 0.3, concealment: 0.6, allure: 0.1,
    }),
    legs: createClothingItem('basic_trousers', 'Worn Trousers', 'legs', {
      warmth: 0.3, concealment: 0.7, allure: 0.1,
    }),
    feet: createClothingItem('basic_boots', 'Scuffed Boots', 'feet', {
      warmth: 0.2, concealment: 0.3, allure: 0.05,
    }),
    hands: null,
    underwear: createClothingItem('basic_underwear', 'Simple Undergarment', 'underwear', {
      warmth: 0.1, concealment: 0.4, allure: 0.1,
    }),
  };
}

/** Create an empty clothing loadout (no clothes). */
export function emptyClothingLoadout(): ClothingLoadout {
  return {
    head: null,
    chest: null,
    legs: null,
    feet: null,
    hands: null,
    underwear: null,
  };
}

// ── Damage & repair ────────────────────────────────────────────────────────

/** Damage a clothing item's integrity. Returns null if destroyed. */
export function damageClothing(item: ClothingItem, amount: number): ClothingItem | null {
  const newIntegrity = Math.max(0, item.integrity - amount);
  if (newIntegrity <= 0) return null; // destroyed
  return { ...item, integrity: newIntegrity };
}

/** Repair a clothing item. */
export function repairClothing(item: ClothingItem, amount: number): ClothingItem {
  return { ...item, integrity: Math.min(100, item.integrity + amount) };
}

/**
 * Apply wear from activity to all equipped clothing.
 * Different activities cause different wear rates.
 */
export function applyWear(loadout: ClothingLoadout, activity: string, hours: number): ClothingLoadout {
  const wearRate = getWearRate(activity) * hours;
  if (wearRate <= 0) return loadout;

  const result: ClothingLoadout = { ...loadout };
  for (const slot of SLOTS) {
    const item = result[slot];
    if (item) {
      result[slot] = damageClothing(item, wearRate);
    }
  }
  return result;
}

/** Get wear rate for an activity. */
function getWearRate(activity: string): number {
  switch (activity) {
    case 'hostile': return 5;        // combat heavily damages clothes
    case 'fleeing': return 3;         // running tears clothes
    case 'working': return 1;         // work slowly wears clothes
    case 'exercising': return 1.5;    // exercise wears clothes
    case 'travelling': return 0.5;    // travel slowly wears clothes
    case 'swimming': return 2;        // water damages clothes
    default: return 0.1;              // minimal wear
  }
}

/**
 * Apply combat damage to random clothing slots.
 * Returns updated loadout with damaged items.
 */
export function applyCombatDamage(loadout: ClothingLoadout, damageAmount: number): ClothingLoadout {
  const result: ClothingLoadout = { ...loadout };
  // Combat damages chest and legs primarily
  const targetSlots: ClothingSlot[] = ['chest', 'legs', 'underwear'];
  const slot = targetSlots[Math.floor(Math.random() * targetSlots.length)];

  const item = result[slot];
  if (item) {
    result[slot] = damageClothing(item, damageAmount);
  }

  return result;
}

// ── Exposure detection ──────────────────────────────────────────────────────

const SLOTS: ClothingSlot[] = ['head', 'chest', 'legs', 'feet', 'hands', 'underwear'];

/**
 * Calculate total concealment (0-1) from the loadout.
 * Low concealment = high exposure.
 */
export function totalConcealment(loadout: ClothingLoadout): number {
  let total = 0;
  let maxPossible = 0;

  for (const slot of SLOTS) {
    const item = loadout[slot];
    if (item && item.integrity > 0) {
      // Damaged items provide less concealment
      const effectiveConcealment = item.concealment * (item.integrity / 100);
      total += effectiveConcealment;
    }
    maxPossible += 1; // max 1 per slot
  }

  return maxPossible > 0 ? total / maxPossible : 0;
}

/**
 * Check if the NPC is considered exposed (low clothing integrity/missing items).
 * Returns true if concealment falls below the threshold.
 */
export function isExposed(loadout: ClothingLoadout): boolean {
  return totalConcealment(loadout) < 0.2;
}

/**
 * Calculate total warmth from clothing (0-1 scale).
 * Used for weather interaction.
 */
export function totalWarmth(loadout: ClothingLoadout): number {
  let total = 0;
  for (const slot of SLOTS) {
    const item = loadout[slot];
    if (item && item.integrity > 0) {
      total += item.warmth * (item.integrity / 100);
    }
  }
  return Math.min(1, total);
}

/**
 * Apply cold weather effects based on clothing warmth.
 * Returns stress increase from cold exposure.
 */
export function coldExposureStress(loadout: ClothingLoadout, weather: string): number {
  const warmth = totalWarmth(loadout);
  const coldWeathers = ['Blizzard', 'Freezing', 'Light Snow', 'Clear and Cold', 'Cold Rain'];
  if (!coldWeathers.includes(weather)) return 0;

  const severity = weather === 'Blizzard' ? 1.0 : weather === 'Freezing' ? 0.8 : 0.4;
  return Math.max(0, (1 - warmth) * severity * 5);
}

/** Get the number of equipped (non-null, non-destroyed) clothing items. */
export function equippedCount(loadout: ClothingLoadout): number {
  return SLOTS.filter(s => loadout[s] !== null && (loadout[s] as ClothingItem).integrity > 0).length;
}

/** Get a label for clothing state. */
export function clothingStateLabel(loadout: ClothingLoadout): string {
  const count = equippedCount(loadout);
  if (count === 0) return 'Naked';
  if (count <= 2) return 'Barely Clothed';
  if (count <= 4) return 'Partially Dressed';
  return 'Fully Dressed';
}
