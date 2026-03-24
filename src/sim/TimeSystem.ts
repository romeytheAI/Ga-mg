/**
 * TimeSystem — day/night cycle, hour advancement, schedules, seasonal change.
 * Pure functions; no side effects, no UI imports.
 */
import { SimWorld, ScheduleSlot, DailySchedule, NpcState } from './types';

export const HOURS_PER_DAY = 24;
export const DAYS_PER_SEASON = 28;
export const SEASONS: SimWorld['season'][] = ['spring', 'summer', 'autumn', 'winter'];
const WEATHERS_BY_SEASON: Record<SimWorld['season'], string[]> = {
  spring: ['Mild', 'Rainy', 'Windy', 'Partly Cloudy', 'Sunny'],
  summer: ['Hot', 'Clear', 'Scorching', 'Humid', 'Thunderstorm'],
  autumn: ['Foggy', 'Drizzle', 'Overcast', 'Windy', 'Cold Rain'],
  winter: ['Blizzard', 'Freezing', 'Overcast', 'Light Snow', 'Clear and Cold'],
};

/** Advance the world clock by the given number of simulated hours. */
export function advanceTime(world: SimWorld, hours: number): SimWorld {
  let newHour = world.hour + hours;
  let newDay = world.day;

  while (newHour >= HOURS_PER_DAY) {
    newHour -= HOURS_PER_DAY;
    newDay += 1;
  }

  const seasonIndex = Math.floor(((newDay - 1) % (DAYS_PER_SEASON * 4)) / DAYS_PER_SEASON);
  const season = SEASONS[seasonIndex];

  // Weather changes once per day
  const weather = newDay !== world.day
    ? pickWeather(season)
    : world.weather;

  return { ...world, hour: Math.floor(newHour), day: newDay, season, weather };
}

/** Derive a human-readable time-of-day label. */
export function timeOfDayLabel(hour: number): string {
  if (hour >= 5 && hour < 8) return 'Dawn';
  if (hour >= 8 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 14) return 'Midday';
  if (hour >= 14 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 21) return 'Evening';
  if (hour >= 21 || hour < 1) return 'Night';
  return 'Late Night';
}

/** True when it is daytime (6-20). */
export function isDay(hour: number): boolean {
  return hour >= 6 && hour < 20;
}

/** Generate a default daily schedule for an NPC based on their job. */
export function buildDefaultSchedule(job: string): DailySchedule {
  const workSlot: ScheduleSlot = {
    hour_start: 8,
    hour_end: 17,
    activity: 'working',
    location_id: 'town_center',
  };
  const sleepSlot: ScheduleSlot = {
    hour_start: 22,
    hour_end: 6,
    activity: 'sleeping',
    location_id: 'home',
  };
  const socialSlot: ScheduleSlot = {
    hour_start: 17,
    hour_end: 22,
    activity: 'socializing',
    location_id: 'tavern',
  };
  const eatSlot: ScheduleSlot = {
    hour_start: 7,
    hour_end: 8,
    activity: 'eating',
    location_id: 'tavern',
  };

  const hasJob = job !== 'none';
  const slots = hasJob
    ? [sleepSlot, eatSlot, workSlot, socialSlot]
    : [sleepSlot, eatSlot, socialSlot];

  return { slots };
}

/** Look up the scheduled activity for a given hour. */
export function scheduledActivity(schedule: DailySchedule, hour: number): NpcState {
  for (const slot of schedule.slots) {
    if (slot.hour_start <= slot.hour_end) {
      if (hour >= slot.hour_start && hour < slot.hour_end) return slot.activity;
    } else {
      // Wraps midnight (e.g. 22-06)
      if (hour >= slot.hour_start || hour < slot.hour_end) return slot.activity;
    }
  }
  return 'idle';
}

/** Look up the scheduled location for a given hour. */
export function scheduledLocation(schedule: DailySchedule, hour: number): string {
  for (const slot of schedule.slots) {
    if (slot.hour_start <= slot.hour_end) {
      if (hour >= slot.hour_start && hour < slot.hour_end) return slot.location_id;
    } else {
      if (hour >= slot.hour_start || hour < slot.hour_end) return slot.location_id;
    }
  }
  return 'town_center';
}

// ── Helpers ────────────────────────────────────────────────────────────────
function pickWeather(season: SimWorld['season']): string {
  const options = WEATHERS_BY_SEASON[season];
  return options[Math.floor(Math.random() * options.length)];
}
