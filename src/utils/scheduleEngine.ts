/**
 * Schedule Engine (Phase 4)
 *
 * Pure query helpers for NPC schedules and daily stat ticks.
 * All functions are side-effect-free and injectable for testing.
 */

import { GameState, NpcRelationship, NpcSchedule, NpcScheduleSlot } from '../types';
import { NPC_SCHEDULES } from '../data/npcSchedules';

// ── Internal helpers ─────────────────────────────────────────────────────────

const MILESTONE_ORDER: NpcRelationship['milestone'][] = [
  'stranger', 'acquaintance', 'friend', 'close', 'lover', 'bonded',
];

function milestoneRank(m: NpcRelationship['milestone']): number {
  return MILESTONE_ORDER.indexOf(m);
}

/**
 * Return whether a schedule slot is active at the given hour/week_day/relationship
 * and world event_flags.
 */
export function isSlotActive(
  slot: NpcScheduleSlot,
  hour: number,
  week_day: number,
  relationship: NpcRelationship | undefined,
  event_flags: Record<string, boolean | number>,
): boolean {
  // Time window check (handles midnight wrap: from=22, to=6)
  const { from, to } = slot.time;
  const inWindow = from < to
    ? hour >= from && hour < to
    : hour >= from || hour < to;
  if (!inWindow) return false;

  const cond = slot.conditions;
  if (!cond) return true;

  // Day-of-week filter
  if (cond.days_of_week && !cond.days_of_week.includes(week_day)) return false;

  // Relationship milestone gate
  if (cond.min_milestone) {
    const rel = relationship;
    const required = milestoneRank(cond.min_milestone);
    const current  = rel ? milestoneRank(rel.milestone) : 0;
    if (current < required) return false;
  }

  // Event flag gates
  if (cond.requires_event_flag) {
    const val = event_flags[cond.requires_event_flag];
    if (!val) return false;
  }
  if (cond.blocks_event_flag) {
    const val = event_flags[cond.blocks_event_flag];
    if (val) return false;
  }

  return true;
}

/**
 * Find the currently active schedule slot for one NPC.
 *
 * @param schedule   NpcSchedule for the NPC
 * @param hour       Current game hour (0–23)
 * @param week_day   Current day of week (0=Monday … 6=Sunday)
 * @param rel        Current NpcRelationship state for this NPC (or undefined if never met)
 * @param flags      world.event_flags
 * @returns          The first matching slot, or undefined if none match
 */
export function getActiveSlot(
  schedule: NpcSchedule,
  hour: number,
  week_day: number,
  rel: NpcRelationship | undefined,
  flags: Record<string, boolean | number>,
): NpcScheduleSlot | undefined {
  return schedule.slots.find(slot => isSlotActive(slot, hour, week_day, rel, flags));
}

/**
 * Return the location_id where an NPC should currently be found,
 * or undefined if no slot is active.
 */
export function getNpcCurrentLocation(
  npcId: string,
  hour: number,
  week_day: number,
  rel: NpcRelationship | undefined,
  flags: Record<string, boolean | number>,
  schedules: Record<string, NpcSchedule> = NPC_SCHEDULES,
): string | undefined {
  const schedule = schedules[npcId];
  if (!schedule) return undefined;
  return getActiveSlot(schedule, hour, week_day, rel, flags)?.location_id;
}

/**
 * Return the list of NPC ids that are currently present at a given location.
 *
 * @param locationId  Location to query
 * @param state       Full game state (reads world.hour, world.week_day, npc_relationships, event_flags)
 * @param schedules   Injectable schedule registry (defaults to NPC_SCHEDULES)
 */
export function getAvailableNpcsAtLocation(
  locationId: string,
  state: GameState,
  schedules: Record<string, NpcSchedule> = NPC_SCHEDULES,
): string[] {
  const { hour, week_day } = state.world;
  const rel = state.world.npc_relationships;
  const flags = state.world.event_flags;

  return Object.entries(schedules)
    .filter(([npcId, schedule]) => {
      const slot = getActiveSlot(schedule, hour, week_day, rel[npcId], flags);
      return slot?.location_id === locationId;
    })
    .map(([npcId]) => npcId);
}

/**
 * Return the location id where each known NPC is currently found.
 * NPCs with no matching slot are omitted.
 *
 * @param state     Full game state
 * @param schedules Injectable schedule registry
 */
export function getAllNpcCurrentLocations(
  state: GameState,
  schedules: Record<string, NpcSchedule> = NPC_SCHEDULES,
): Record<string, string> {
  const { hour, week_day } = state.world;
  const rel = state.world.npc_relationships;
  const flags = state.world.event_flags;

  const result: Record<string, string> = {};
  for (const [npcId, schedule] of Object.entries(schedules)) {
    const loc = getActiveSlot(schedule, hour, week_day, rel[npcId], flags)?.location_id;
    if (loc) result[npcId] = loc;
  }
  return result;
}

// ── Daily stat tick ──────────────────────────────────────────────────────────

/**
 * Compute per-day stat and relationship deltas for the daily-life loop.
 * Called by the ADVANCE_TIME reducer when one or more full days elapse.
 *
 * Returns pure delta values — the caller (reducer) applies them to state.
 */
export interface DailyStatDeltas {
  /** Stat key → signed delta */
  stats: Partial<Record<string, number>>;
  /** NPC id → relationship trust/love delta (positive or negative) */
  npc_trust_deltas: Record<string, number>;
  /** Economy: gold earned from any active jobs (flat amount per day) */
  gold_earned: number;
}

/**
 * Compute one day's worth of passive stat decay, NPC relationship drift,
 * and economy ticks.
 *
 * @param state       Game state at the start of the day
 * @param daysElapsed Number of full days that have passed (usually 1)
 */
export function computeDailyStatDeltas(
  state: GameState,
  daysElapsed: number,
): DailyStatDeltas {
  const stats: Partial<Record<string, number>> = {};
  const npc_trust_deltas: Record<string, number> = {};

  // ── Passive stat decay (per day) ─────────────────────────────────────────
  const drain = state.ui.settings.stat_drain_multiplier ?? 1;
  stats.stress     = -(2 * daysElapsed * drain);   // slight stress recovery
  stats.corruption = state.player.stats.corruption > 0
    ? -(0.5 * daysElapsed * drain)
    : 0; // decay corruption only when it's positive
  stats.lust       = -(1 * daysElapsed * drain);   // lust fades if no action

  // ── NPC trust drift ──────────────────────────────────────────────────────
  // NPCs with no recent interaction slowly lose trust (max -1/day)
  for (const [npcId, rel] of Object.entries(state.world.npc_relationships)) {
    if (rel.trust > 10) {
      npc_trust_deltas[npcId] = -1 * daysElapsed;
    }
  }

  // ── Economy: passive gold income ─────────────────────────────────────────
  // Gold is earned for every day the player is employed in a basic job
  // (represented via economy.businesses having entries with staff)
  const jobs = (state.world.economy?.businesses as any[]) ?? [];
  const dailyWage = jobs.reduce((sum: number, b: any) => sum + (b.daily_wage ?? 0), 0);
  const gold_earned = dailyWage * daysElapsed;

  return { stats, npc_trust_deltas, gold_earned };
}

/**
 * Compute the week_day after advancing by a number of days.
 *
 * @param currentWeekDay  Current day of week (0=Monday … 6=Sunday)
 * @param daysElapsed     Days to advance
 */
export function advanceWeekDay(currentWeekDay: number, daysElapsed: number): number {
  return ((currentWeekDay + daysElapsed) % 7 + 7) % 7;
}
