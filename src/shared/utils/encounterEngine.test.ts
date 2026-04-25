import { describe, it, expect } from 'vitest';
import { resolveEncounterAction } from './encounterEngine';
import { initialState } from '../../core/state/initialState';
import { GameState } from '../../core/types';
import { PREDEFINED_ANATOMIES } from '../../core/constants';

const baseEncounter = {
  id: 'test_enemy',
  enemy_name: 'Test Enemy',
  enemy_type: 'thug',
  enemy_health: 100,
  enemy_max_health: 100,
  enemy_lust: 0,
  enemy_max_lust: 100,
  enemy_anger: 0,
  enemy_max_anger: 100,
  player_stance: 'neutral''as const,
  turn: 1,
  log: [],
  debuffs: [],
  targeted_part: null,
  anatomy: PREDEFINED_ANATOMIES.average,
};

const stateWithEncounter = (overrides: Partial<typeof baseEncounter> = {}): GameState => ({
  ...initialState,
  world: {
    ...initialState.world,
    active_encounter: { ...baseEncounter, ...overrides },
  },
});

// Deterministic RNG helpers
const alwaysSucceed = () => 0;   / always below any threshold
const alwaysFail    = () => 0.99; // always above any threshold

describe('encounterEngine – aggressive intent', () => {
  it('deals damage and lowers enemy health', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'aggressive', null, alwaysSucceed);
    expect((res.encounterUpdates.enemy_health as number)).toBeLessThan(100);
  });

  it('ends encounter when enemy health drops to 0', () => {
    const state = stateWithEncounter({ enemy_health: 5 });
    const res = resolveEncounterAction(state, 'aggressive', null, alwaysSucceed);
    expect((res.encounterUpdates.enemy_health as number)).toBe(0);
    expect(res.endEncounter).toBe(true);
  });

  it('unlocks first_victory feat on kill when not yet unlocked', () => {
    const state = stateWithEncounter({ enemy_health: 1 });
    const res = resolveEncounterAction(state, 'aggressive', null, alwaysSucceed);
    const featEffect = res.side_effects.find(e => e.type === 'UNLOCK_FEAT');
    expect(featEffect).toBeDefined();
    expect((featEffect as any).payload).toBe('first_victory');
  });

  it('does not unlock feat when already unlocked', () => {
    const state: GameState = {
      ...stateWithEncounter({ enemy_health: 1 }),
      player: {
        ...stateWithEncounter({ enemy_health: 1 }).player,
        feats: initialState.player.feats.map(f =>
          f.id === 'first_victory''? { ...f, unlocked: true } : f
        ),
      },
    };
    const res = resolveEncounterAction(state, 'aggressive', null, alwaysSucceed);
    expect(res.side_effects.find(e => e.type === 'UNLOCK_FEAT')).toBeUndefined();
  });

  it('adds slowed debuff when targeting legs', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'aggressive','legs', alwaysFail);
    const debuffs = res.encounterUpdates.debuffs as { type: string; duration: number }[];
    expect(debuffs.some(d => d.type === 'slowed')).toBe(true);
  });

  it('adds weakened debuff when targeting arms', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'aggressive','arms', alwaysFail);
    const debuffs = res.encounterUpdates.debuffs as { type: string; duration: number }[];
    expect(debuffs.some(d => d.type === 'weakened')).toBe(true);
  });

  it('sets combatFeedback animation to attack or special_attack', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'aggressive', null, alwaysSucceed);
    expect(res.combatFeedback).not.toBeNull();
    expect(['attack','special_attack']).toContain(res.combatFeedback?.animation);
  });

  it('drains stamina and gains athletics skill', () => {
    const state = stateWithEncounter({ enemy_health: 100 });
    const res = resolveEncounterAction(state, 'aggressive', null, alwaysFail);
    expect(res.stat_deltas.stamina).toBe(-10);
    expect(res.skill_deltas.athletics).toBe(1);
  });
});

describe('encounterEngine – flee intent', () => {
  it('ends encounter on success', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'flee', null, alwaysSucceed);
    expect(res.endEncounter).toBe(true);
    expect(res.skill_deltas.athletics).toBe(2);
  });

  it('does not end encounter on failure and drains stamina', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'flee', null, alwaysFail);
    expect(res.endEncounter).toBe(false);
    expect(res.stat_deltas.stamina).toBeDefined();
    expect((res.stat_deltas.stamina as number)).toBeLessThan(0);
  });
});

describe('encounterEngine – resist intent', () => {
  it('ends encounter when enemy anger reaches 90 after success', () => {
    const state = stateWithEncounter({ enemy_anger: 75 });
    const res = resolveEncounterAction(state, 'resist', null, alwaysSucceed);
    expect((res.encounterUpdates.enemy_anger as number)).toBeGreaterThanOrEqual(90);
    expect(res.endEncounter).toBe(true);
  });

  it('increases willpower cost on any outcome', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'resist', null, alwaysFail);
    expect(res.stat_deltas.willpower).toBe(-5);
  });

  it('reduces control on failed resist', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'resist', null, alwaysFail);
    expect(res.stat_deltas.control).toBe(-3);
  });
});

describe('encounterEngine – endure intent', () => {
  it('increases stamina and triggers tired-out on high turn count', () => {
    const state = stateWithEncounter({ turn: 10 });
    const res = resolveEncounterAction(state, 'endure', null, alwaysSucceed);
    expect(res.endEncounter).toBe(true);
  });

  it('does not end encounter on early turn', () => {
    const state = stateWithEncounter({ turn: 2 });
    const res = resolveEncounterAction(state, 'endure', null, alwaysSucceed);
    expect(res.endEncounter).toBe(false);
    expect(res.stat_deltas.stamina).toBe(5);
  });
});

describe('encounterEngine – cry_out intent', () => {
  it('ends encounter when rescue succeeds', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'cry_out', null, alwaysSucceed);
    expect(res.endEncounter).toBe(true);
  });

  it('damages player when no one comes', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'cry_out', null, alwaysFail);
    expect(res.endEncounter).toBe(false);
    expect(res.stat_deltas.health).toBe(-10);
  });
});

describe('encounterEngine – submissive intent', () => {
  it('increases enemy lust', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'submissive', null, alwaysFail);
    expect((res.encounterUpdates.enemy_lust as number)).toBeGreaterThan(0);
  });

  it('ends encounter when enemy lust >= 100', () => {
    const state = stateWithEncounter({ enemy_lust: 85 });
    const res = resolveEncounterAction(state, 'submissive', null, alwaysFail);
    expect((res.encounterUpdates.enemy_lust as number)).toBeGreaterThanOrEqual(100);
    expect(res.endEncounter).toBe(true);
  });
});

describe('encounterEngine – social intent', () => {
  it('ends encounter when seduction maxes enemy lust', () => {
    const highSeductionState: GameState = {
      ...stateWithEncounter({ enemy_lust: 75 }),
      player: {
        ...stateWithEncounter({ enemy_lust: 75 }).player,
        skills: { ...initialState.player.skills, seduction: 100 },
        stats: { ...initialState.player.stats, allure: 100 },
      },
    };
    const res = resolveEncounterAction(highSeductionState, 'social', null, alwaysSucceed);
    expect(res.endEncounter).toBe(true);
  });

  it('gains lust delta regardless of success', () => {
    const state = stateWithEncounter();
    const res = resolveEncounterAction(state, 'social', null, alwaysFail);
    expect(res.stat_deltas.lust).toBe(5);
  });
});

describe('encounterEngine – debuff tick', () => {
  it('decrements existing debuff durations and removes expired ones', () => {
    const state = stateWithEncounter({
      debuffs: [
        { type: 'slowed', duration: 2 },
        { type: 'weakened', duration: 1 },
      ],
    });
    const res = resolveEncounterAction(state, 'endure', null, alwaysFail);
    const debuffs = res.encounterUpdates.debuffs as { type: string; duration: number }[];
    expect(debuffs).toHaveLength(1);
    expect(debuffs[0].type).toBe('slowed');
    expect(debuffs[0].duration).toBe(1);
  });
});

describe('encounterEngine – no active encounter', () => {
  it('returns empty resolution when no encounter is active', () => {
    const res = resolveEncounterAction(initialState, 'aggressive', null, alwaysSucceed);
    expect(res.endEncounter).toBe(false);
    expect(res.narrative).toBe('');
  });
});
