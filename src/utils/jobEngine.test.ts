import { describe, it, expect } from 'vitest';
import { resolveWorkShift, getAvailableJobs, jobRiskLevel, JOB_LABELS } from './jobEngine';
import { initialState } from '../state/initialState';
import { JobType } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function seeded(seed: number) {
  // Deterministic LCG — same sequence every test run
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function withSkills(overrides: Partial<typeof initialState.player.skills>) {
  return {
    ...initialState,
    player: {
      ...initialState.player,
      skills: { ...initialState.player.skills, ...overrides },
    },
  };
}

// ── JOB_LABELS ────────────────────────────────────────────────────────────────

describe('JOB_LABELS', () => {
  it('has an entry for every JobType', () => {
    const jobs: JobType[] = ['laborer', 'merchant', 'guard', 'healer', 'scholar', 'thief', 'farmer', 'innkeeper', 'none'];
    for (const job of jobs) {
      expect(JOB_LABELS[job]).toBeTruthy();
    }
  });
});

// ── jobRiskLevel ──────────────────────────────────────────────────────────────

describe('jobRiskLevel', () => {
  it('returns safe for laborer', () => expect(jobRiskLevel('laborer')).toBe('safe'));
  it('returns dangerous for thief', () => expect(jobRiskLevel('thief')).toBe('dangerous'));
  it('returns moderate for guard', () => expect(jobRiskLevel('guard')).toBe('moderate'));
  it('returns safe for farmer', () => expect(jobRiskLevel('farmer')).toBe('safe'));
  it('returns safe for none', () => expect(jobRiskLevel('none')).toBe('safe'));
});

// ── getAvailableJobs ──────────────────────────────────────────────────────────

describe('getAvailableJobs', () => {
  it('always includes none', () => {
    const jobs = getAvailableJobs(initialState);
    expect(jobs).toContain('none');
  });

  it('starter player qualifies for laborer and farmer but not guard or scholar', () => {
    const jobs = getAvailableJobs(initialState);
    expect(jobs).toContain('laborer');
    expect(jobs).toContain('farmer');
    // guard requires athletics >= 20; starter has 5
    expect(jobs).not.toContain('guard');
    // scholar requires lore_mastery >= 40; starter has 50 → should qualify
    expect(jobs).toContain('scholar');
  });

  it('qualifies for guard when athletics >= 20', () => {
    const state = withSkills({ athletics: 25 });
    expect(getAvailableJobs(state)).toContain('guard');
  });

  it('does not qualify for guard when athletics < 20', () => {
    const state = withSkills({ athletics: 15 });
    expect(getAvailableJobs(state)).not.toContain('guard');
  });

  it('qualifies for healer when tending >= 15', () => {
    const state = withSkills({ tending: 20 });
    expect(getAvailableJobs(state)).toContain('healer');
  });

  it('qualifies for thief when skulduggery >= 20', () => {
    const state = withSkills({ skulduggery: 25 });
    expect(getAvailableJobs(state)).toContain('thief');
  });
});

// ── resolveWorkShift ──────────────────────────────────────────────────────────

describe('resolveWorkShift', () => {
  it('returns positive gold for laborer', () => {
    const result = resolveWorkShift(initialState, 'laborer', seeded(1));
    expect(result.gold_earned).toBeGreaterThan(0);
  });

  it('gold for thief is higher than laborer on average', () => {
    // Thief base wage = 20, laborer = 8
    const thiefGold = resolveWorkShift(initialState, 'thief', seeded(42)).gold_earned;
    const laborGold = resolveWorkShift(initialState, 'laborer', seeded(42)).gold_earned;
    expect(thiefGold).toBeGreaterThan(laborGold);
  });

  it('laborer shift improves athletics', () => {
    const result = resolveWorkShift(initialState, 'laborer', seeded(7));
    expect((result.skill_deltas as any).athletics).toBeGreaterThan(0);
  });

  it('scholar shift improves lore_mastery', () => {
    const result = resolveWorkShift(initialState, 'scholar', seeded(3));
    expect((result.skill_deltas as any).lore_mastery).toBeGreaterThan(0);
  });

  it('laborer shift drains stamina', () => {
    const result = resolveWorkShift(initialState, 'laborer', seeded(5));
    expect((result.stat_deltas as any).stamina).toBeLessThan(0);
  });

  it('thief shift flags crime_committed', () => {
    const result = resolveWorkShift(initialState, 'thief', seeded(9));
    expect(result.crime_committed).toBe(true);
  });

  it('non-thief shift does not flag crime_committed', () => {
    const result = resolveWorkShift(initialState, 'healer', seeded(9));
    expect(result.crime_committed).toBeFalsy();
  });

  it('returns feat_id on first gold earned', () => {
    // initialState.player.gold = 0
    const result = resolveWorkShift(initialState, 'laborer', seeded(1));
    expect(result.feat_id).toBe('feat_first_job');
  });

  it('does not return feat_id when player already has gold', () => {
    const richState = { ...initialState, player: { ...initialState.player, gold: 100 } };
    const result = resolveWorkShift(richState, 'laborer', seeded(1));
    expect(result.feat_id).toBeUndefined();
  });

  it('returns non-empty narrative', () => {
    const result = resolveWorkShift(initialState, 'innkeeper', seeded(13));
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('job defaults to state.player.player_job', () => {
    const state = { ...initialState, player: { ...initialState.player, player_job: 'healer' as JobType } };
    const result = resolveWorkShift(state, undefined, seeded(1));
    expect((result.skill_deltas as any).tending).toBeGreaterThan(0);
  });

  it('skill bonus increases gold for high-skill player', () => {
    const expertState = withSkills({ athletics: 80 });
    const noviceResult = resolveWorkShift(initialState, 'laborer', seeded(1));
    const expertResult = resolveWorkShift(expertState, 'laborer', seeded(1));
    expect(expertResult.gold_earned).toBeGreaterThanOrEqual(noviceResult.gold_earned);
  });

  it('none job returns zero gold', () => {
    const result = resolveWorkShift(initialState, 'none', seeded(1));
    expect(result.gold_earned).toBe(0);
  });
});
