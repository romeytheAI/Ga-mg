/**
 * EconomySystem — jobs, resource production, trade, and dynamic pricing.
 * Pure functions; no side effects, no UI imports.
 */
import { EconomyEntry, JobType, SimNpc } from './types';

// ── Base prices & production rates ────────────────────────────────────────

const BASE_PRICES: Record<string, number> = {
  bread: 2,
  meat: 5,
  ale: 3,
  herbs: 8,
  iron: 12,
  cloth: 7,
  lumber: 6,
  grain: 3,
  fish: 4,
  leather: 9,
  gold_dust: 30,
  potion: 20,
};

const JOB_PRODUCES: Record<JobType, string | null> = {
  laborer: 'lumber',
  merchant: null,
  guard: null,
  healer: 'potion',
  scholar: null,
  thief: null,
  farmer: 'grain',
  innkeeper: 'ale',
  none: null,
};

const JOB_WAGE: Record<JobType, number> = {
  laborer: 8,
  merchant: 15,
  guard: 12,
  healer: 18,
  scholar: 10,
  thief: 20,   / risky income
  farmer: 6,
  innkeeper: 14,
  none: 0,
};

// ── Initialisation ─────────────────────────────────────────────────────────

/** Build a fresh economy table from base prices. */
export function initEconomy(): EconomyEntry[] {
  return Object.entries(BASE_PRICES).map(([resource, base_price]) => ({
    resource,
    base_price,
    current_price: base_price,
    supply: 50 + Math.floor(Math.random() * 30),
    demand: 40 + Math.floor(Math.random() * 30),
  }));
}

// ── Production ─────────────────────────────────────────────────────────────

/** NPC produces goods while working; returns updated economy. */
export function produceGoods(economy: EconomyEntry[], job: JobType): EconomyEntry[] {
  const resource = JOB_PRODUCES[job];
  if (!resource) return economy;

  return economy.map(e =>
    e.resource === resource
      ? { ...e, supply: Math.min(200, e.supply + 3) }
      : e
  );
}

/** Collect NPC wage; returns gold earned. */
export function collectWage(job: JobType): number {
  const base = JOB_WAGE[job];
  if (base === 0) return 0;
  return base + Math.floor(Math.random() * 5);
}

// ── Trade ──────────────────────────────────────────────────────────────────

/** Simulate a trade event between two NPCs; returns updated economy. */
export function conductTrade(
  economy: EconomyEntry[],
  resource: string,
  quantity: number
): EconomyEntry[] {
  return economy.map(e => {
    if (e.resource !== resource) return e;
    const newSupply = Math.max(0, e.supply - quantity);
    const newDemand = Math.min(200, e.demand + quantity * 0.5);
    return { ...e, supply: newSupply, demand: newDemand };
  });
}

// ── Dynamic pricing ────────────────────────────────────────────────────────

/**
 * Recalculate prices based on supply/demand ratio.
 * Price rises when demand > supply and falls when supply > demand.
 */
export function updatePrices(economy: EconomyEntry[]): EconomyEntry[] {
  return economy.map(e => {
    const ratio = e.demand / Math.max(1, e.supply);
    const multiplier = 0.5 + ratio;          / 0.5× to ~3× base price
    const newPrice = Math.round(e.base_price * clamp(multiplier, 0.3, 3.0));
    return { ...e, current_price: newPrice };
  });
}

/** Passive demand bleed: demand drifts toward supply over time. */
export function balanceDemand(economy: EconomyEntry[]): EconomyEntry[] {
  return economy.map(e => {
    const drift = (e.supply - e.demand) * 0.05;
    return { ...e, demand: clamp(e.demand + drift, 5, 200) };
  });
}

/** Get the current price for a resource (or base price if unknown). */
export function getPrice(economy: EconomyEntry[], resource: string): number {
  return economy.find(e => e.resource === resource)?.current_price
    ?? (BASE_PRICES[resource] ?? 10);
}

// ── NPC wealth helpers ────────────────────────────────────────────────────

/** Pay an NPC for working; mutates their gold in a new stats object. */
export function payNpc(npc: SimNpc, amount: number): SimNpc['stats'] {
  return { ...npc.stats, gold: npc.stats.gold + amount };
}

/** Charge an NPC for eating; returns false if they can't afford it. */
export function chargeNpc(
  npc: SimNpc,
  economy: EconomyEntry[]
): { canAfford: boolean; stats: SimNpc['stats'] } {
  const cost = getPrice(economy, 'bread');
  if (npc.stats.gold < cost) return { canAfford: false, stats: npc.stats };
  return { canAfford: true, stats: { ...npc.stats, gold: npc.stats.gold - cost } };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
