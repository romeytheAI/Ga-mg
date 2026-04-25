/**
 * NPC Schedule Definitions
 *
 * Each NPC has an ordered list of schedule slots.  The schedule engine
 * checks them top-to-bottom and returns the first slot whose time window
 * and conditions match the current game state.
 *
 * Time is 24h (0–23).  Days of week: 0=Monday … 6=Sunday.
 * Weekdays = [0,1,2,3,4].  Weekend = [5,6].
 */

import { NpcSchedule } from '../core/types';

const WEEKDAYS = [0, 1, 2, 3, 4];
const WEEKEND  = [5, 6];

export const NPC_SCHEDULES: Record<string, NpcSchedule> = {
  // ── Orphanage NPCs ──────────────────────────────────────────────────────
  constance_michel: {
    npc_id: 'constance_michel',
    slots: [
      { label: 'Early morning duties',   location_id: 'orphanage', time: { from: 5,  to: 8  } },
      { label: 'Teaching the children',  location_id: 'orphanage', time: { from: 8,  to: 13 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Market errands',         location_id: 'town_square', time: { from: 10, to: 12 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Orphanage chores',       location_id: 'orphanage', time: { from: 13, to: 18 } },
      { label: 'Evening prayers',        location_id: 'temple_gardens', time: { from: 18, to: 20 } },
      { label: 'Sleeping',               location_id: 'orphanage', time: { from: 21, to: 24 } },
      { label: 'Sleeping',               location_id: 'orphanage', time: { from: 0,  to: 5  } },
    ],
  },

  grelod_the_kind: {
    npc_id: 'grelod_the_kind',
    slots: [
      { label: 'Morning inspection',    location_id: 'orphanage', time: { from: 6,  to: 9  } },
      { label: 'Office hours',          location_id: 'orphanage', time: { from: 9,  to: 17 } },
      { label: 'Evening wine',          location_id: 'orphanage', time: { from: 17, to: 21 } },
      { label: 'Sleeping',              location_id: 'orphanage', time: { from: 21, to: 24 } },
      { label: 'Sleeping',              location_id: 'orphanage', time: { from: 0,  to: 6  } },
    ],
  },

  robin: {
    npc_id: 'robin',
    slots: [
      { label: 'Morning chores',        location_id: 'orphanage',   time: { from: 6,  to: 8  } },
      { label: 'At the College',        location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Wandering the park',    location_id: 'park',        time: { from: 15, to: 18 } },
      { label: 'Orphanage dinner',      location_id: 'orphanage',   time: { from: 18, to: 20 } },
      { label: 'Sleeping',              location_id: 'orphanage',   time: { from: 21, to: 24 } },
      { label: 'Sleeping',              location_id: 'orphanage',   time: { from: 0,  to: 6  } },
    ],
  },

  bailey: {
    npc_id: 'bailey',
    slots: [
      { label: 'Collecting rent',       location_id: 'town_square', time: { from: 9,  to: 12 } },
      { label: 'Orphanage oversight',   location_id: 'orphanage',   time: { from: 12, to: 15 } },
      { label: 'At the docks',          location_id: 'docks',       time: { from: 15, to: 18 } },
      { label: 'Evening intimidation',  location_id: 'alleyways',   time: { from: 18, to: 21 } },
      { label: 'Sleeping',              location_id: 'brothel',     time: { from: 22, to: 24 } },
      { label: 'Sleeping',              location_id: 'brothel',     time: { from: 0,  to: 8  } },
    ],
  },

  // ── Bards College NPCs ───────────────────────────────────────────────────
  whitney: {
    npc_id: 'whitney',
    slots: [
      { label: 'Morning warm-up',       location_id: 'school',      time: { from: 7,  to: 8  }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Ratway skulking',       location_id: 'alleyways',   time: { from: 15, to: 17 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Weekend market',        location_id: 'town_square', time: { from: 10, to: 16 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Evening gardens',       location_id: 'park',        time: { from: 17, to: 20 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 22, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 7  } },
    ],
  },

  kylar: {
    npc_id: 'kylar',
    slots: [
      { label: 'Early archive study',   location_id: 'school',      time: { from: 6,  to: 8  } },
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Watching the player',   location_id: 'park',        time: { from: 15, to: 18 } },
      { label: 'Ratway patrol',         location_id: 'alleyways',   time: { from: 19, to: 22 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 22, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 6  } },
    ],
  },

  avery: {
    npc_id: 'avery',
    slots: [
      { label: 'Morning meal',          location_id: 'school',      time: { from: 7,  to: 8  }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Sparring practice',     location_id: 'school',      time: { from: 15, to: 17 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Marketplace socialising', location_id: 'town_square', time: { from: 17, to: 20 } },
      { label: 'Weekend market',        location_id: 'town_square', time: { from: 9,  to: 18 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 21, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 7  } },
    ],
  },

  sydney: {
    npc_id: 'sydney',
    slots: [
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Practise & study',      location_id: 'school',      time: { from: 15, to: 17 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Temple of Mara visit',  location_id: 'temple_gardens', time: { from: 17, to: 19 } },
      { label: 'Evening walk',          location_id: 'park',        time: { from: 19, to: 21 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 21, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 8  } },
    ],
  },

  leighton: {
    npc_id: 'leighton',
    slots: [
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Detention supervision', location_id: 'school',      time: { from: 15, to: 17 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Faculty chambers',      location_id: 'school',      time: { from: 17, to: 19 } },
      { label: 'Solitude Market errand',location_id: 'shopping_centre', time: { from: 10, to: 14 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 21, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 8  } },
    ],
  },

  river: {
    npc_id: 'river',
    slots: [
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Outdoor study',         location_id: 'park',        time: { from: 15, to: 18 } },
      { label: 'Lake Honrich visit',    location_id: 'lake',        time: { from: 14, to: 17 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Rift Forest walk',      location_id: 'forest',      time: { from: 18, to: 20 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 22, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 8  } },
    ],
  },

  doren: {
    npc_id: 'doren',
    slots: [
      { label: 'Teaching',              location_id: 'school',      time: { from: 8,  to: 16 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Marking scrolls',       location_id: 'school',      time: { from: 16, to: 18 } },
      { label: 'Marketplace errands',   location_id: 'town_square', time: { from: 10, to: 13 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 21, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 8  } },
    ],
  },

  mason: {
    npc_id: 'mason',
    slots: [
      { label: 'Lectures',              location_id: 'school',      time: { from: 8,  to: 15 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Ragged Flagon deals',   location_id: 'underground_market', time: { from: 16, to: 20 } },
      { label: 'Weekend fence work',    location_id: 'underground_market', time: { from: 10, to: 18 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Ratway operations',     location_id: 'alleyways',   time: { from: 20, to: 23 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 23, to: 24 } },
      { label: 'Sleeping',              location_id: 'school',      time: { from: 0,  to: 8  } },
    ],
  },

  // ── Town NPCs ────────────────────────────────────────────────────────────
  brynjolf: {
    npc_id: 'brynjolf',
    slots: [
      { label: 'Market stall',         location_id: 'town_square', time: { from: 9,  to: 17 }, conditions: { days_of_week: WEEKDAYS } },
      { label: 'Weekend market',       location_id: 'town_square', time: { from: 9,  to: 14 }, conditions: { days_of_week: WEEKEND } },
      { label: 'Ragged Flagon',        location_id: 'brothel',     time: { from: 17, to: 23 } },
      { label: 'Sleeping',             location_id: 'brothel',     time: { from: 23, to: 24 } },
      { label: 'Sleeping',             location_id: 'brothel',     time: { from: 0,  to: 9  } },
    ],
  },

  brand_shei: {
    npc_id: 'brand_shei',
    slots: [
      { label: 'Market stall setup',   location_id: 'town_square', time: { from: 8,  to: 9  } },
      { label: 'Market stall',         location_id: 'town_square', time: { from: 9,  to: 18 } },
      { label: 'Evening meal',         location_id: 'brothel',     time: { from: 18, to: 20 } },
      { label: 'Sleeping',             location_id: 'town_square', time: { from: 21, to: 24 } },
      { label: 'Sleeping',             location_id: 'town_square', time: { from: 0,  to: 8  } },
    ],
  },

  jordan: {
    npc_id: 'jordan',
    slots: [
      { label: 'Morning prayer',       location_id: 'temple_gardens', time: { from: 6,  to: 8  } },
      { label: 'Temple service',       location_id: 'temple_gardens', time: { from: 8,  to: 17 } },
      { label: 'Alms distribution',    location_id: 'town_square',    time: { from: 12, to: 14 } },
      { label: 'Evening prayers',      location_id: 'temple_gardens', time: { from: 18, to: 20 } },
      { label: 'Sleeping',             location_id: 'temple_gardens', time: { from: 21, to: 24 } },
      { label: 'Sleeping',             location_id: 'temple_gardens', time: { from: 0,  to: 6  } },
    ],
  },

  harper: {
    npc_id: 'harper',
    slots: [
      { label: 'Morning patrol',       location_id: 'town_square', time: { from: 6,  to: 10 } },
      { label: 'Market watch',         location_id: 'town_square', time: { from: 10, to: 16 } },
      { label: 'Docks inspection',     location_id: 'docks',       time: { from: 16, to: 19 } },
      { label: 'Tavern rest',          location_id: 'brothel',     time: { from: 19, to: 22 } },
      { label: 'Sleeping',             location_id: 'town_square', time: { from: 22, to: 24 } },
      { label: 'Sleeping',             location_id: 'town_square', time: { from: 0,  to: 6  } },
    ],
  },

  // ── Wilderness / Outskirts ────────────────────────────────────────────────
  eden: {
    npc_id: 'eden',
    slots: [
      { label: 'Forest gathering',     location_id: 'forest',      time: { from: 6,  to: 10 } },
      { label: 'Cabin rest',           location_id: 'eden_cabin',  time: { from: 10, to: 14 } },
      { label: 'Ritual preparation',   location_id: 'eden_cabin',  time: { from: 14, to: 18 } },
      { label: 'Dusk ritual',          location_id: 'forest',      time: { from: 18, to: 21 } },
      { label: 'Sleeping',             location_id: 'eden_cabin',  time: { from: 21, to: 24 } },
      { label: 'Sleeping',             location_id: 'eden_cabin',  time: { from: 0,  to: 6  } },
    ],
  },

  alex: {
    npc_id: 'alex',
    slots: [
      { label: 'Morning farm work',    location_id: 'farm',        time: { from: 5,  to: 10 } },
      { label: 'Mid-day chores',       location_id: 'farm',        time: { from: 10, to: 14 } },
      { label: 'Market supplies',      location_id: 'town_square', time: { from: 14, to: 16 }, conditions: { days_of_week: [2, 5] } },
      { label: 'Evening farm',         location_id: 'farm',        time: { from: 16, to: 20 } },
      { label: 'Sleeping',             location_id: 'farm',        time: { from: 21, to: 24 } },
      { label: 'Sleeping',             location_id: 'farm',        time: { from: 0,  to: 5  } },
    ],
  },

  // ── Brothel / Underground ─────────────────────────────────────────────────
  briar: {
    npc_id: 'briar',
    slots: [
      { label: 'Sleeping',             location_id: 'brothel',     time: { from: 0,  to: 12 } },
      { label: 'Prep',                 location_id: 'brothel',     time: { from: 12, to: 16 } },
      { label: 'Working the brothel',  location_id: 'brothel',     time: { from: 16, to: 24 } },
    ],
  },

  landry: {
    npc_id: 'landry',
    slots: [
      { label: 'Sleeping',             location_id: 'brothel',     time: { from: 0,  to: 10 } },
      { label: 'Inventory check',      location_id: 'underground_market', time: { from: 10, to: 13 } },
      { label: 'Underground market',   location_id: 'underground_market', time: { from: 13, to: 22 } },
      { label: 'Sleeping',             location_id: 'brothel',     time: { from: 22, to: 24 } },
    ],
  },

  charlie: {
    npc_id: 'charlie',
    slots: [
      { label: 'Morning docks',        location_id: 'docks',       time: { from: 5,  to: 10 } },
      { label: 'Beach rest',           location_id: 'beach',       time: { from: 10, to: 14 } },
      { label: 'Town work',            location_id: 'town_square', time: { from: 14, to: 18 } },
      { label: 'Evening tavern',       location_id: 'brothel',     time: { from: 18, to: 22 } },
      { label: 'Sleeping',             location_id: 'docks',       time: { from: 22, to: 24 } },
      { label: 'Sleeping',             location_id: 'docks',       time: { from: 0,  to: 5  } },
    ],
  },

  darryl: {
    npc_id: 'darryl',
    slots: [
      { label: 'Prison yard',          location_id: 'prison',      time: { from: 8,  to: 18 } },
      { label: 'Prison common room',   location_id: 'prison',      time: { from: 18, to: 21 } },
      { label: 'Sleeping',             location_id: 'prison',      time: { from: 21, to: 24 } },
      { label: 'Sleeping',             location_id: 'prison',      time: { from: 0,  to: 8  } },
    ],
  },

  wren: {
    npc_id: 'wren',
    slots: [
      { label: 'Shopping',             location_id: 'shopping_centre', time: { from: 9,  to: 14 } },
      { label: 'Park stroll',          location_id: 'park',            time: { from: 14, to: 17 } },
      { label: 'Town square gossip',   location_id: 'town_square',     time: { from: 17, to: 20 } },
      { label: 'Sleeping',             location_id: 'shopping_centre', time: { from: 22, to: 24 } },
      { label: 'Sleeping',             location_id: 'shopping_centre', time: { from: 0,  to: 9  } },
    ],
  },

  winter: {
    npc_id: 'winter',
    slots: [
      { label: 'Arcane research',      location_id: 'ruins',           time: { from: 0,  to: 6  } },
      { label: 'Sleeping',             location_id: 'ruins',           time: { from: 6,  to: 12 } },
      { label: 'Town observations',    location_id: 'town_square',     time: { from: 12, to: 15 } },
      { label: 'Arcane study',         location_id: 'ruins',           time: { from: 15, to: 24 } },
    ],
  },

  sam: {
    npc_id: 'sam',
    slots: [
      { label: 'Beach walks',          location_id: 'beach',           time: { from: 7,  to: 10 } },
      { label: 'Ocean fishing',        location_id: 'ocean',           time: { from: 10, to: 14 } },
      { label: 'Dock work',            location_id: 'docks',           time: { from: 14, to: 18 } },
      { label: 'Evening town',         location_id: 'town_square',     time: { from: 18, to: 21 } },
      { label: 'Sleeping',             location_id: 'docks',           time: { from: 21, to: 24 } },
      { label: 'Sleeping',             location_id: 'docks',           time: { from: 0,  to: 7  } },
    ],
  },
};

/** Convenience array of all schedule objects */
export const ALL_NPC_SCHEDULES: NpcSchedule[] = Object.values(NPC_SCHEDULES);
