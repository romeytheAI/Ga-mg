/**
 * crimeEngine.test.ts — comprehensive tests for the crime / justice bridge.
 *
 * Tests each resolver with fixed RNG seeds covering:
 *   - Crime severity scaling
 *   - Guard alert escalation
 *   - Jail stat drain
 *   - Escape success / failure by method
 *   - Bounty accumulation
 *   - Witnessed vs unwitnessed crimes
 *   - Guard encounter outcomes (pay, resist, flee, bribe)
 */

import { describe, it, expect } from 'vitest';
import {
  resolveCrimeCommit,
  resolveGuardEncounter,
  resolveJailTime,
  resolveEscapeAttempt,
  resolveBountyPayment,
  getPlayerBountyStatus,
  getGuardAlertLevel,
  type CrimeSideEffect,
} from './crimeEngine';
import { initialState } from '../state/initialState';
import { defaultCriminalRecord } from '../sim/CrimeSystem';
import type { CriminalRecord, FactionId, GuardAlertLevel } from '../sim/types';
import type { GameState } from '../types';

// ── Test helpers ──────────────────────────────────────────────────────────────

/** Deterministic LCG — identical sequence every run. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

/** Always returns the given constant (for forcing success/failure). */
const alwaysLow  = () => 0.01; // triggers success paths
const alwaysHigh = () => 0.99; // triggers failure paths

/** Build a GameState with a specific criminal record injected into sim_world. */
function withRecord(record: CriminalRecord): GameState {
  return {
    ...initialState,
    sim_world: {
      ...(initialState.sim_world ?? {
        turn: 0,
        day: 1,
        hour: 7,
        weather: 'Clear',
        season: 'spring' as const,
        npcs: [],
        economy: [],
        global_events: [],
        locations: [],
        active_combats: [],
        factions: [],
        criminal_records: {},
      }),
      criminal_records: { player: record },
    },
  } as GameState;
}

/** Build a state with the given gold amount. */
function withGold(gold: number, record?: CriminalRecord): GameState {
  const base = record ? withRecord(record) : initialState;
  return { ...base, player: { ...base.player, gold } };
}

/** Build a state with the given athletics skill. */
function withAthletics(athletics: number): GameState {
  return { ...initialState, player: { ...initialState.player, skills: { ...initialState.player.skills, athletics } } };
}

/** Build a state with the given skulduggery skill. */
function withSkulduggery(skulduggery: number, record?: CriminalRecord): GameState {
  const base = record ? withRecord(record) : initialState;
  return { ...base, player: { ...base.player, skills: { ...base.player.skills, skulduggery } } };
}

/** Build a record with a specific bounty for a faction. */
function recordWithBounty(factionId: FactionId, bounty: number): CriminalRecord {
  const rec = defaultCriminalRecord();
  return {
    ...rec,
    crimes: [{
      type:       'theft',
      turn:       1,
      severity:   30,
      faction_id: factionId,
      witnessed:  true,
      bounty_value: bounty,
      cleared:    false,
    }],
    total_bounty: bounty,
    wanted_by:   [factionId],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// resolveCrimeCommit
// ─────────────────────────────────────────────────────────────────────────────

describe('resolveCrimeCommit', () => {
  it('witnessed theft adds bounty to crimeUpdates', () => {
    const result = resolveCrimeCommit(initialState, 'theft', 'town_guard', true, seeded(1));
    expect(result.crimeUpdates.bounty_delta).toBeGreaterThan(0);
  });

  it('unwitnessed theft adds zero bounty', () => {
    const result = resolveCrimeCommit(initialState, 'theft', 'town_guard', false, seeded(1));
    expect(result.crimeUpdates.bounty_delta).toBe(0);
  });

  it('witnessed crime adds BOUNTY_ADDED side effect', () => {
    const result = resolveCrimeCommit(initialState, 'theft', 'town_guard', true, seeded(1));
    const hasBountyAdded = result.side_effects.some(e => e.type === 'BOUNTY_ADDED');
    expect(hasBountyAdded).toBe(true);
  });

  it('unwitnessed crime has no BOUNTY_ADDED side effect', () => {
    const result = resolveCrimeCommit(initialState, 'theft', 'town_guard', false, alwaysHigh);
    const hasBountyAdded = result.side_effects.some(e => e.type === 'BOUNTY_ADDED');
    expect(hasBountyAdded).toBe(false);
  });

  it('murder adds trauma and corruption deltas', () => {
    const result = resolveCrimeCommit(initialState, 'murder', 'town_guard', true, seeded(2));
    expect((result.stat_deltas.trauma ?? 0)).toBeGreaterThan(0);
    expect((result.stat_deltas.corruption ?? 0)).toBeGreaterThan(0);
  });

  it('murder crime has higher stress than theft', () => {
    const murderResult = resolveCrimeCommit(initialState, 'murder', 'town_guard', true, seeded(1));
    const theftResult  = resolveCrimeCommit(initialState, 'theft',  'town_guard', true, seeded(1));
    expect((murderResult.stat_deltas.stress ?? 0)).toBeGreaterThan((theftResult.stat_deltas.stress ?? 0));
  });

  it('witnessed crime escalates guard alert level', () => {
    const result = resolveCrimeCommit(initialState, 'assault', 'town_guard', true, seeded(3));
    const record = result.crimeUpdates.criminal_record as CriminalRecord;
    expect(record.guard_state?.alert_level).not.toBe('unaware');
  });

  it('severe crime (murder) escalates guard to arresting', () => {
    const result = resolveCrimeCommit(initialState, 'murder', 'town_guard', true, seeded(4));
    expect(result.crimeUpdates.guard_alert_level).toBe('arresting');
  });

  it('high cumulative bounty (≥150) adds WANTED_POSTER side effect', () => {
    const heavyRecord = recordWithBounty('town_guard', 200);
    const state = withRecord(heavyRecord);
    const result = resolveCrimeCommit(state, 'theft', 'town_guard', true, seeded(5));
    const hasPoster = result.side_effects.some(e => e.type === 'WANTED_POSTER');
    expect(hasPoster).toBe(true);
  });

  it('witnessed crime adds NOTORIETY_INCREASE side effect', () => {
    const result = resolveCrimeCommit(initialState, 'espionage', 'town_guard', true, seeded(6));
    const hasNotoriety = result.side_effects.some(e => e.type === 'NOTORIETY_INCREASE');
    expect(hasNotoriety).toBe(true);
  });

  it('espionage has higher notoriety gain than trespassing', () => {
    const espionageResult   = resolveCrimeCommit(initialState, 'espionage',   'town_guard', true, seeded(7));
    const trespassingResult = resolveCrimeCommit(initialState, 'trespassing', 'town_guard', true, seeded(7));
    const espNotoriety   = (espionageResult.side_effects.find(e => e.type === 'NOTORIETY_INCREASE') as Extract<CrimeSideEffect, { type: 'NOTORIETY_INCREASE' }>)?.payload.amount ?? 0;
    const tresNotoriety  = (trespassingResult.side_effects.find(e => e.type === 'NOTORIETY_INCREASE') as Extract<CrimeSideEffect, { type: 'NOTORIETY_INCREASE' }>)?.payload.amount ?? 0;
    expect(espNotoriety).toBeGreaterThan(tresNotoriety);
  });

  it('returns non-empty narrative string', () => {
    const result = resolveCrimeCommit(initialState, 'theft', 'town_guard', true, seeded(8));
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('theft by high-skulduggery player has lower stress than low-skulduggery', () => {
    const expertState = withSkulduggery(80);
    const noviceState = withSkulduggery(0);
    const expertResult = resolveCrimeCommit(expertState, 'theft', 'town_guard', false, seeded(9));
    const noviceResult = resolveCrimeCommit(noviceState, 'theft', 'town_guard', false, seeded(9));
    expect((expertResult.stat_deltas.stress ?? 0)).toBeLessThanOrEqual((noviceResult.stat_deltas.stress ?? 0));
  });

  it('criminal record in crimeUpdates contains new crime entry', () => {
    const result = resolveCrimeCommit(initialState, 'contraband', 'merchants_guild', true, seeded(10));
    const record = result.crimeUpdates.criminal_record as CriminalRecord;
    expect(record.crimes.length).toBe(1);
    expect(record.crimes[0].type).toBe('contraband');
  });

  it('theft/contraband can trigger THIEVES_GUILD_NOTIFIED (low rng)', () => {
    // Use alwaysLow to ensure the 0.15 check passes
    const result = resolveCrimeCommit(initialState, 'theft', 'town_guard', true, alwaysLow);
    const hasGuild = result.side_effects.some(e => e.type === 'THIEVES_GUILD_NOTIFIED');
    expect(hasGuild).toBe(true);
  });

  it('murder does NOT trigger THIEVES_GUILD_NOTIFIED', () => {
    const result = resolveCrimeCommit(initialState, 'murder', 'town_guard', true, alwaysLow);
    const hasGuild = result.side_effects.some(e => e.type === 'THIEVES_GUILD_NOTIFIED');
    expect(hasGuild).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// resolveGuardEncounter
// ─────────────────────────────────────────────────────────────────────────────

describe('resolveGuardEncounter — pay_fine', () => {
  it('player with enough gold clears bounty and loses gold', () => {
    const record = recordWithBounty('town_guard', 40);
    const state = withGold(100, record);
    const result = resolveGuardEncounter(state, 'guard_001', 'pay_fine', seeded(1));
    expect((result.crimeUpdates.gold_delta as number)).toBeLessThan(0);
    expect((result.crimeUpdates.bounty_delta as number)).toBeLessThan(0);
    const hasBountyCleared = result.side_effects.some(e => e.type === 'BOUNTY_CLEARED');
    expect(hasBountyCleared).toBe(true);
  });

  it('player without enough gold is jailed instead', () => {
    const record = recordWithBounty('town_guard', 200);
    const state = withGold(5, record);
    const result = resolveGuardEncounter(state, 'guard_001', 'pay_fine', seeded(1));
    const hasJail = result.side_effects.some(e => e.type === 'JAIL_STARTED');
    expect(hasJail).toBe(true);
    expect(result.crimeUpdates.gold_delta).toBe(0);
  });

  it('successful payment reduces stress', () => {
    const record = recordWithBounty('town_guard', 20);
    const state = withGold(500, record);
    const result = resolveGuardEncounter(state, 'guard_001', 'pay_fine', seeded(1));
    expect((result.stat_deltas.stress ?? 0)).toBeLessThanOrEqual(0);
  });
});

describe('resolveGuardEncounter — resist_arrest', () => {
  it('high-athletics player can successfully resist (low rng)', () => {
    const record = recordWithBounty('town_guard', 50);
    const state = withAthletics(80);
    const withRec = withRecord(record);
    const combined = { ...withAthletics(80), sim_world: withRec.sim_world };
    const result = resolveGuardEncounter(combined, 'guard_001', 'resist_arrest', alwaysLow);
    expect(result.crimeUpdates.escaped).toBe(true);
  });

  it('successful resistance adds assault bounty', () => {
    const record = recordWithBounty('town_guard', 50);
    const state = { ...withAthletics(80), sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'resist_arrest', alwaysLow);
    const hasBountyAdded = result.side_effects.some(e => e.type === 'BOUNTY_ADDED');
    expect(hasBountyAdded).toBe(true);
  });

  it('failed resistance leads to jail', () => {
    const record = recordWithBounty('town_guard', 50);
    const state = { ...initialState, sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'resist_arrest', alwaysHigh);
    const hasJail = result.side_effects.some(e => e.type === 'JAIL_STARTED');
    expect(hasJail).toBe(true);
  });

  it('failed resistance drains health and stamina', () => {
    const record = recordWithBounty('town_guard', 50);
    const state = { ...initialState, sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'resist_arrest', alwaysHigh);
    expect((result.stat_deltas.health ?? 0)).toBeLessThan(0);
    expect((result.stat_deltas.stamina ?? 0)).toBeLessThan(0);
  });
});

describe('resolveGuardEncounter — flee', () => {
  it('high-athletics player can flee (low rng)', () => {
    const record = recordWithBounty('town_guard', 50);
    const state  = { ...withAthletics(90), sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'flee', alwaysLow);
    expect(result.crimeUpdates.escaped).toBe(true);
    const hasEscaped = result.side_effects.some(e => e.type === 'ESCAPED_PURSUIT');
    expect(hasEscaped).toBe(true);
  });

  it('failed flee attempt leads to jail and stamina drain', () => {
    const record = recordWithBounty('town_guard', 50);
    const state  = { ...initialState, sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'flee', alwaysHigh);
    const hasJail = result.side_effects.some(e => e.type === 'JAIL_STARTED');
    expect(hasJail).toBe(true);
    expect((result.stat_deltas.stamina ?? 0)).toBeLessThan(0);
  });
});

describe('resolveGuardEncounter — bribe', () => {
  it('successful bribe clears bounty and spends gold', () => {
    const record = recordWithBounty('town_guard', 40);
    const state  = { ...withGold(500, record), sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'bribe', alwaysLow);
    expect((result.crimeUpdates.gold_delta as number)).toBeLessThan(0);
    const hasBountyCleared = result.side_effects.some(e => e.type === 'BOUNTY_CLEARED');
    expect(hasBountyCleared).toBe(true);
  });

  it('failed bribe still loses gold and leads to jail', () => {
    const record = recordWithBounty('town_guard', 40);
    const state  = { ...withGold(500, record), sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'bribe', alwaysHigh);
    expect((result.crimeUpdates.gold_delta as number)).toBeLessThan(0);
    const hasJail = result.side_effects.some(e => e.type === 'JAIL_STARTED');
    expect(hasJail).toBe(true);
  });

  it('bribe with no gold falls back to jail', () => {
    const record = recordWithBounty('town_guard', 200);
    const state  = { ...withGold(0, record), sim_world: withRecord(record).sim_world };
    const result = resolveGuardEncounter(state, 'guard_001', 'bribe', alwaysLow);
    const hasJail = result.side_effects.some(e => e.type === 'JAIL_STARTED');
    expect(hasJail).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// resolveJailTime
// ─────────────────────────────────────────────────────────────────────────────

describe('resolveJailTime', () => {
  it('serving 1 day drains willpower', () => {
    const result = resolveJailTime(initialState, 1, seeded(1));
    expect((result.stat_deltas.willpower ?? 0)).toBeLessThan(0);
  });

  it('serving 1 day increases stress', () => {
    const result = resolveJailTime(initialState, 1, seeded(1));
    expect((result.stat_deltas.stress ?? 0)).toBeGreaterThan(0);
  });

  it('drain scales with days served', () => {
    const short = resolveJailTime(initialState, 1, seeded(1));
    const long  = resolveJailTime(initialState, 7, seeded(1));
    expect((long.stat_deltas.willpower ?? 0)).toBeLessThan((short.stat_deltas.willpower ?? 0));
    expect((long.stat_deltas.stress ?? 0)).toBeGreaterThan((short.stat_deltas.stress ?? 0));
  });

  it('long sentence (≥5 days) adds trauma', () => {
    const result = resolveJailTime(initialState, 6, seeded(2));
    expect((result.stat_deltas.trauma ?? 0)).toBeGreaterThan(0);
  });

  it('clears all crimes and bounty in crimeUpdates', () => {
    const record = recordWithBounty('town_guard', 100);
    const state  = withRecord(record);
    const result = resolveJailTime(state, 3, seeded(3));
    const clearedRecord = result.crimeUpdates.criminal_record as CriminalRecord;
    expect(clearedRecord.total_bounty).toBe(0);
    expect(clearedRecord.wanted_by.length).toBe(0);
    expect(clearedRecord.crimes.every(c => c.cleared)).toBe(true);
  });

  it('returns non-empty narrative', () => {
    const result = resolveJailTime(initialState, 2, seeded(4));
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('hygiene drops while in jail', () => {
    const result = resolveJailTime(initialState, 3, seeded(5));
    expect((result.stat_deltas.hygiene ?? 0)).toBeLessThan(0);
  });

  it('records days_served in crimeUpdates', () => {
    const result = resolveJailTime(initialState, 4, seeded(6));
    expect(result.crimeUpdates.jail_days_served).toBe(4);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// resolveEscapeAttempt
// ─────────────────────────────────────────────────────────────────────────────

describe('resolveEscapeAttempt', () => {
  it('lockpick success with high skulduggery (low rng)', () => {
    const state  = withSkulduggery(90);
    const result = resolveEscapeAttempt(state, 'lockpick', alwaysLow);
    expect(result.crimeUpdates.escaped).toBe(true);
    const hasEscaped = result.side_effects.some(e => e.type === 'ESCAPED_PURSUIT');
    expect(hasEscaped).toBe(true);
  });

  it('lockpick failure (high rng) sets escaped=false', () => {
    const result = resolveEscapeAttempt(initialState, 'lockpick', alwaysHigh);
    expect(result.crimeUpdates.escaped).toBe(false);
  });

  it('force failure adds assault criminal record entry', () => {
    const result = resolveEscapeAttempt(initialState, 'force', alwaysHigh);
    const record = result.crimeUpdates.criminal_record as CriminalRecord;
    expect(record.crimes.some(c => c.type === 'assault')).toBe(true);
  });

  it('force success still costs health', () => {
    const state  = withAthletics(90);
    const result = resolveEscapeAttempt(state, 'force', alwaysLow);
    expect(result.crimeUpdates.escaped).toBe(true);
    expect((result.stat_deltas.health ?? 0)).toBeLessThan(0);
  });

  it('magic escape with spells has higher base chance than without', () => {
    const stateWithSpells = {
      ...initialState,
      player: { ...initialState.player, arcane: { ...initialState.player.arcane, spells: ['recall'] } },
    };
    // Both use same rng seed — with spells should have higher success rate, so we
    // check that with spells the computed escape succeeds at a boundary rng value
    // where without spells it would not. Use a value of 0.25 (> base 0.10, < 0.25+0.15=0.25)
    const boundary = () => 0.24;
    const withSpells    = resolveEscapeAttempt(stateWithSpells,  'magic', boundary);
    const withoutSpells = resolveEscapeAttempt(initialState,     'magic', boundary);
    expect(withSpells.crimeUpdates.escaped).toBe(true);
    expect(withoutSpells.crimeUpdates.escaped).toBe(false);
  });

  it('all escape methods return a narrative', () => {
    const methods: Array<'lockpick' | 'force' | 'stealth' | 'magic'> = ['lockpick', 'force', 'stealth', 'magic'];
    for (const method of methods) {
      const result = resolveEscapeAttempt(initialState, method, seeded(7));
      expect(typeof result.narrative).toBe('string');
      expect(result.narrative.length).toBeGreaterThan(10);
    }
  });

  it('failed escape adds extra jail time (additional_sentence)', () => {
    const result = resolveEscapeAttempt(initialState, 'lockpick', alwaysHigh);
    expect((result.crimeUpdates.additional_sentence as number)).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// resolveBountyPayment
// ─────────────────────────────────────────────────────────────────────────────

describe('resolveBountyPayment', () => {
  it('paying off a faction bounty clears that faction', () => {
    const record = recordWithBounty('town_guard', 60);
    const state  = withGold(500, record);
    const result = resolveBountyPayment(state, 'town_guard', seeded(1));
    const hasClear = result.side_effects.some(e => e.type === 'BOUNTY_CLEARED');
    expect(hasClear).toBe(true);
    expect((result.crimeUpdates.gold_delta as number)).toBeLessThan(0);
  });

  it('paying a zero-bounty faction changes no gold', () => {
    const result = resolveBountyPayment(initialState, 'church', seeded(1));
    expect(result.crimeUpdates.gold_delta).toBe(0);
  });

  it('cleared faction is removed from wanted_factions', () => {
    const record = recordWithBounty('nobility', 80);
    const state  = withGold(500, record);
    const result = resolveBountyPayment(state, 'nobility', seeded(2));
    const updatedRecord = result.crimeUpdates.criminal_record as CriminalRecord;
    expect(updatedRecord.wanted_by).not.toContain('nobility');
  });

  it('narrative mentions the septim amount paid', () => {
    const record = recordWithBounty('town_guard', 50);
    const state  = withGold(500, record);
    const result = resolveBountyPayment(state, 'town_guard', seeded(3));
    // The narrative should contain the gold amount (50)
    expect(result.narrative).toMatch(/50/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getPlayerBountyStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('getPlayerBountyStatus', () => {
  it('clean player has zero bounty and is_wanted=false', () => {
    const status = getPlayerBountyStatus(initialState);
    expect(status.total_bounty).toBe(0);
    expect(status.is_wanted).toBe(false);
    expect(status.wanted_label).toBe('Clean');
  });

  it('player with bounty has correct wanted_label', () => {
    const record = recordWithBounty('town_guard', 60);
    const state  = withRecord(record);
    const status = getPlayerBountyStatus(state);
    expect(status.total_bounty).toBe(60);
    expect(status.wanted_label).toBe('Wanted');
    expect(status.is_wanted).toBe(true);
  });

  it('faction_bounties only includes factions with non-zero bounty', () => {
    const record = recordWithBounty('merchants_guild', 35);
    const state  = withRecord(record);
    const status = getPlayerBountyStatus(state);
    expect(status.faction_bounties['merchants_guild']).toBe(35);
    expect(status.faction_bounties['town_guard']).toBeUndefined();
  });

  it('notorious criminal label at bounty >= 150', () => {
    const record = recordWithBounty('town_guard', 200);
    const state  = withRecord(record);
    const status = getPlayerBountyStatus(state);
    expect(status.wanted_label).toBe('Notorious Criminal');
  });

  it('most wanted label at bounty >= 300', () => {
    const record = recordWithBounty('town_guard', 350);
    const state  = withRecord(record);
    const status = getPlayerBountyStatus(state);
    expect(status.wanted_label).toBe('Most Wanted');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getGuardAlertLevel
// ─────────────────────────────────────────────────────────────────────────────

describe('getGuardAlertLevel', () => {
  it('clean player returns unaware at any location', () => {
    const level = getGuardAlertLevel(initialState, 'riften_market');
    expect(level).toBe('unaware');
  });

  it('small bounty returns suspicious', () => {
    const record = recordWithBounty('town_guard', 30);
    const state  = withRecord(record);
    const level  = getGuardAlertLevel(state, 'riften_market');
    expect(level).toBe('suspicious');
  });

  it('medium bounty returns alerted', () => {
    const record = recordWithBounty('town_guard', 100);
    const state  = withRecord(record);
    const level  = getGuardAlertLevel(state, 'riften_market');
    expect(level).toBe('alerted');
  });

  it('large bounty returns pursuing', () => {
    const record = recordWithBounty('town_guard', 200);
    const state  = withRecord(record);
    const level  = getGuardAlertLevel(state, 'riften_market');
    expect(level).toBe('pursuing');
  });

  it('massive bounty (≥300) returns arresting', () => {
    const record = recordWithBounty('town_guard', 350);
    const state  = withRecord(record);
    const level  = getGuardAlertLevel(state, 'riften_market');
    expect(level).toBe('arresting');
  });

  it('active guard pursuing the player overrides bounty-derived level', () => {
    const record: CriminalRecord = {
      ...recordWithBounty('town_guard', 30),
      guard_state: {
        alert_level:    'arresting',
        target_id:      'player',
        pursuit_stamina: 80,
        last_crime_seen: 'theft',
        faction_id:      'town_guard',
      },
    };
    const state = withRecord(record);
    const level = getGuardAlertLevel(state, 'riften_market');
    expect(level).toBe('arresting');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration: crime → guard encounter pipeline
// ─────────────────────────────────────────────────────────────────────────────

describe('crime → guard encounter integration', () => {
  it('committing a crime then paying fine results in clean record', () => {
    // Step 1: commit witnessed theft
    const crimeResult = resolveCrimeCommit(initialState, 'theft', 'town_guard', true, seeded(42));
    const postCrimeRecord = crimeResult.crimeUpdates.criminal_record as CriminalRecord;

    // Step 2: guard encounters the player; player pays fine
    const stateAfterCrime = {
      ...withGold(500),
      sim_world: { ...(initialState.sim_world ?? {} as any), criminal_records: { player: postCrimeRecord } },
    };
    const fineResult = resolveGuardEncounter(stateAfterCrime as GameState, 'guard_001', 'pay_fine', seeded(42));
    const finalRecord = fineResult.crimeUpdates.criminal_record as CriminalRecord;

    expect(finalRecord.total_bounty).toBe(0);
    expect(finalRecord.wanted_by.length).toBe(0);
  });

  it('bounty accumulates across multiple witnessed crimes', () => {
    let state: GameState = initialState;
    let runningRecord: CriminalRecord = defaultCriminalRecord();

    for (let i = 0; i < 3; i++) {
      const res = resolveCrimeCommit(
        { ...state, sim_world: { ...(state.sim_world ?? {} as any), criminal_records: { player: runningRecord } } } as GameState,
        'theft', 'town_guard', true, seeded(i),
      );
      runningRecord = res.crimeUpdates.criminal_record as CriminalRecord;
    }

    expect(runningRecord.total_bounty).toBeGreaterThan(0);
    expect(runningRecord.crimes.length).toBe(3);
  });
});
