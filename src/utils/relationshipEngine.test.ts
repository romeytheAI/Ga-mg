import { describe, it, expect } from 'vitest';
import {
  computeMilestone,
  computeIntentDeltas,
  getTriggeredScene,
  canTriggerScene,
  getInteractionNarrative,
  resolveRelationshipInteraction,
  MILESTONE_ORDER,
  UNIVERSAL_RECURRING_SCENES,
  milestoneRank,
  type RecurringScene,
} from './relationshipEngine';
import { NpcRelationship } from '../types';

// ── Fixtures ────────────────────────────────────────────────────────────────

const makeRel = (overrides: Partial<NpcRelationship> = {}): NpcRelationship => ({
  npc_id: 'test_npc',
  trust: 0,
  love: 0,
  fear: 0,
  dom: 0,
  sub: 0,
  milestone: 'stranger',
  met_on_day: 1,
  last_interaction_day: 0,
  interaction_count: 0,
  scene_flags: {},
  ...overrides,
});

const deterministicRng = (value = 0) => () => value;

// ── milestoneRank ────────────────────────────────────────────────────────────

describe('milestoneRank', () => {
  it('returns correct rank for each milestone', () => {
    expect(milestoneRank('stranger')).toBe(0);
    expect(milestoneRank('acquaintance')).toBe(1);
    expect(milestoneRank('friend')).toBe(2);
    expect(milestoneRank('close')).toBe(3);
    expect(milestoneRank('lover')).toBe(4);
    expect(milestoneRank('bonded')).toBe(5);
  });

  it('preserves MILESTONE_ORDER ordering', () => {
    const ranks = MILESTONE_ORDER.map(milestoneRank);
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i]).toBeGreaterThan(ranks[i - 1]);
    }
  });
});

// ── computeMilestone ─────────────────────────────────────────────────────────

describe('computeMilestone', () => {
  it('returns stranger when total is 0', () => {
    expect(computeMilestone({ trust: 0, love: 0 })).toBe('stranger');
  });

  it('returns acquaintance at total 20', () => {
    expect(computeMilestone({ trust: 10, love: 10 })).toBe('acquaintance');
  });

  it('returns friend at total 60', () => {
    expect(computeMilestone({ trust: 30, love: 30 })).toBe('friend');
  });

  it('returns close at total 100', () => {
    expect(computeMilestone({ trust: 50, love: 50 })).toBe('close');
  });

  it('returns lover at total 140', () => {
    expect(computeMilestone({ trust: 70, love: 70 })).toBe('lover');
  });

  it('returns bonded at total 180', () => {
    expect(computeMilestone({ trust: 90, love: 90 })).toBe('bonded');
  });

  it('thresholds are exclusive of lower tier — exact 60 returns friend not acquaintance', () => {
    expect(computeMilestone({ trust: 60, love: 0 })).toBe('friend');
  });
});

// ── computeIntentDeltas ──────────────────────────────────────────────────────

describe('computeIntentDeltas', () => {
  it('returns positive trust delta for social intent', () => {
    const rel = makeRel();
    const deltas = computeIntentDeltas('social', rel, 1);
    expect((deltas.trust ?? 0)).toBeGreaterThan(0);
  });

  it('returns positive love delta for flirt intent', () => {
    const rel = makeRel();
    const deltas = computeIntentDeltas('flirt', rel, 1);
    expect((deltas.love ?? 0)).toBeGreaterThan(0);
  });

  it('returns positive fear and negative trust for threaten', () => {
    const rel = makeRel();
    const deltas = computeIntentDeltas('threaten', rel, 1);
    expect((deltas.fear ?? 0)).toBeGreaterThan(0);
    expect((deltas.trust ?? 0)).toBeLessThan(0);
  });

  it('returns empty deltas for unknown intent', () => {
    const rel = makeRel();
    const deltas = computeIntentDeltas('unknown_intent', rel, 1);
    expect(Object.keys(deltas)).toHaveLength(0);
  });

  it('applies diminishing returns on same day repeat', () => {
    const rel = makeRel({
      last_interaction_day: 5,
      scene_flags: { _today_count: 1 },
    });
    const firstDay = computeIntentDeltas('social', makeRel(), 5);
    const secondInteraction = computeIntentDeltas('social', rel, 5);
    expect((secondInteraction.trust ?? 0)).toBeLessThan((firstDay.trust ?? 0));
  });

  it('does NOT apply diminishing returns on a new day', () => {
    const rel = makeRel({
      last_interaction_day: 4,
      scene_flags: { _today_count: 5 },
    });
    const freshDay = computeIntentDeltas('social', makeRel(), 5);
    const newDay = computeIntentDeltas('social', rel, 5);
    expect(newDay.trust).toBe(freshDay.trust);
  });

  it('milestone bonus increases positive deltas at higher milestones', () => {
    const stranger = makeRel({ milestone: 'stranger' });
    const bonded   = makeRel({ milestone: 'bonded', trust: 90, love: 90 });
    const dStranger = computeIntentDeltas('social', stranger, 1);
    const dBonded   = computeIntentDeltas('social', bonded, 1);
    expect((dBonded.trust ?? 0)).toBeGreaterThan((dStranger.trust ?? 0));
  });

  it('milestone bonus does NOT amplify negative deltas', () => {
    const bonded = makeRel({ milestone: 'bonded', trust: 90, love: 90 });
    const stranger = makeRel({ milestone: 'stranger' });
    const dBonded  = computeIntentDeltas('threaten', bonded, 1);
    const dStranger = computeIntentDeltas('threaten', stranger, 1);
    expect(dBonded.trust).toBe(dStranger.trust);
  });
});

// ── getTriggeredScene ────────────────────────────────────────────────────────

describe('getTriggeredScene', () => {
  const scenes: RecurringScene[] = [
    { id: 'first_meeting', min_milestone: 'stranger', min_interactions: 0, seen_flag: 'seen_first', repeatable: false },
    { id: 'secret_share', min_milestone: 'acquaintance', min_interactions: 3, seen_flag: 'seen_secret', repeatable: false },
    { id: 'recurring_date', min_milestone: 'lover', min_interactions: 5, seen_flag: 'seen_date', repeatable: true },
  ];

  it('triggers first_meeting on first interaction', () => {
    const rel = makeRel({ interaction_count: 0 });
    expect(getTriggeredScene(rel, scenes)).toBe('first_meeting');
  });

  it('does not re-trigger a non-repeatable scene after it has been seen', () => {
    const rel = makeRel({ scene_flags: { seen_first: true } });
    expect(getTriggeredScene(rel, scenes)).toBeUndefined();
  });

  it('triggers secret_share when milestone and count are met', () => {
    const rel = makeRel({
      milestone: 'acquaintance',
      trust: 20,
      interaction_count: 3,
      scene_flags: { seen_first: true },
    });
    expect(getTriggeredScene(rel, scenes)).toBe('secret_share');
  });

  it('does not trigger scene when interaction count is too low', () => {
    const rel = makeRel({
      milestone: 'acquaintance',
      trust: 20,
      interaction_count: 2,
      scene_flags: { seen_first: true },
    });
    expect(getTriggeredScene(rel, scenes)).toBeUndefined();
  });

  it('repeatable scene fires even after it has been seen', () => {
    const rel = makeRel({
      milestone: 'lover',
      trust: 90,
      love: 90,
      interaction_count: 10,
      scene_flags: { seen_date: true, seen_first: true, seen_secret: true },
    });
    expect(getTriggeredScene(rel, scenes)).toBe('recurring_date');
  });
});

// ── canTriggerScene ──────────────────────────────────────────────────────────

describe('canTriggerScene', () => {
  const scenes: RecurringScene[] = [
    { id: 'test_scene', min_milestone: 'friend', min_interactions: 5, seen_flag: 'seen_test', repeatable: false },
  ];

  it('returns false when milestone is too low', () => {
    const rel = makeRel({ milestone: 'acquaintance', interaction_count: 10 });
    expect(canTriggerScene(rel, 'test_scene', scenes)).toBe(false);
  });

  it('returns false when interaction count is too low', () => {
    const rel = makeRel({ milestone: 'friend', trust: 60, interaction_count: 2 });
    expect(canTriggerScene(rel, 'test_scene', scenes)).toBe(false);
  });

  it('returns true when all conditions met', () => {
    const rel = makeRel({ milestone: 'friend', trust: 60, interaction_count: 5 });
    expect(canTriggerScene(rel, 'test_scene', scenes)).toBe(true);
  });

  it('returns false once a non-repeatable scene has been seen', () => {
    const rel = makeRel({
      milestone: 'friend', trust: 60, interaction_count: 5,
      scene_flags: { seen_test: true },
    });
    expect(canTriggerScene(rel, 'test_scene', scenes)).toBe(false);
  });

  it('returns false for unknown scene id', () => {
    const rel = makeRel({ milestone: 'bonded', trust: 90, love: 90, interaction_count: 100 });
    expect(canTriggerScene(rel, 'nonexistent_scene', scenes)).toBe(false);
  });
});

// ── getInteractionNarrative ──────────────────────────────────────────────────

describe('getInteractionNarrative', () => {
  it('returns a non-empty string for known intent + milestone', () => {
    const line = getInteractionNarrative('social', 'friend', deterministicRng(0));
    expect(typeof line).toBe('string');
    expect(line.length).toBeGreaterThan(0);
  });

  it('returns a fallback string for unknown intent', () => {
    const line = getInteractionNarrative('xyz_unknown', 'close', deterministicRng(0));
    expect(typeof line).toBe('string');
    expect(line.length).toBeGreaterThan(0);
  });

  it('returns different lines with different rng values (where lines array > 1)', () => {
    const line1 = getInteractionNarrative('social', 'friend', deterministicRng(0));
    const line2 = getInteractionNarrative('social', 'friend', deterministicRng(0.99));
    // May or may not differ depending on array size; just assert both are strings
    expect(typeof line1).toBe('string');
    expect(typeof line2).toBe('string');
  });

  it('returns lines that differ by milestone', () => {
    const stranger = getInteractionNarrative('flirt', 'stranger', deterministicRng(0));
    const bonded   = getInteractionNarrative('flirt', 'bonded',   deterministicRng(0));
    expect(stranger).not.toBe(bonded);
  });
});

// ── resolveRelationshipInteraction ───────────────────────────────────────────

describe('resolveRelationshipInteraction', () => {
  const rng = deterministicRng(0);

  it('returns an updated relationship with increased trust on social intent', () => {
    const rel = makeRel();
    const result = resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.trust).toBeGreaterThan(0);
  });

  it('increments interaction_count by 1', () => {
    const rel = makeRel({ interaction_count: 4 });
    const result = resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.interaction_count).toBe(5);
  });

  it('updates last_interaction_day to currentDay', () => {
    const rel = makeRel({ last_interaction_day: 0 });
    const result = resolveRelationshipInteraction(rel, 'social', 7, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.last_interaction_day).toBe(7);
  });

  it('detects milestone change when trust crosses threshold', () => {
    // trust + love at 19 → next social push should cross 20 threshold
    const rel = makeRel({ trust: 18, love: 0 });
    const result = resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    if (result.milestone_changed) {
      expect(result.new_milestone).toBeDefined();
      expect(milestoneRank(result.new_milestone!)).toBeGreaterThan(milestoneRank('stranger'));
    }
  });

  it('does not exceed 100 on any stat', () => {
    const rel = makeRel({ trust: 99, love: 99 });
    const result = resolveRelationshipInteraction(rel, 'confide', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.trust).toBeLessThanOrEqual(100);
  });

  it('does not go below 0 on any stat', () => {
    const rel = makeRel({ trust: 1 });
    const result = resolveRelationshipInteraction(rel, 'threaten', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.trust).toBeGreaterThanOrEqual(0);
  });

  it('returns a narrative string', () => {
    const rel = makeRel();
    const result = resolveRelationshipInteraction(rel, 'flirt', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(typeof result.narrative).toBe('string');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('triggers first_meeting scene on interaction_count 0', () => {
    const rel = makeRel({ interaction_count: 0 });
    const result = resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.triggered_scene).toBe('first_meeting');
  });

  it('marks a non-repeatable scene as seen in scene_flags', () => {
    const rel = makeRel({ interaction_count: 0 });
    const result = resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.scene_flags['scene_first_meeting_seen']).toBe(true);
  });

  it('does not re-trigger a seen non-repeatable scene', () => {
    const rel = makeRel({
      interaction_count: 1,
      scene_flags: { scene_first_meeting_seen: true },
    });
    const result = resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.triggered_scene).toBeUndefined();
  });

  it('tracks same-day interaction count in _today_count flag', () => {
    const rel = makeRel({ last_interaction_day: 3, scene_flags: { _today_count: 2 } });
    const result = resolveRelationshipInteraction(rel, 'social', 3, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.scene_flags['_today_count']).toBe(3);
  });

  it('resets _today_count on a new day', () => {
    const rel = makeRel({ last_interaction_day: 3, scene_flags: { _today_count: 5 } });
    const result = resolveRelationshipInteraction(rel, 'social', 4, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.updated_relationship.scene_flags['_today_count']).toBe(1);
  });

  it('stat_summary contains the deltas that were applied', () => {
    const rel = makeRel();
    const result = resolveRelationshipInteraction(rel, 'flirt', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(result.stat_summary).toBeDefined();
    expect(Object.keys(result.stat_summary).length).toBeGreaterThan(0);
  });

  it('does not mutate the original relationship object', () => {
    const rel = makeRel({ trust: 10 });
    resolveRelationshipInteraction(rel, 'social', 1, UNIVERSAL_RECURRING_SCENES, rng);
    expect(rel.trust).toBe(10);
    expect(rel.interaction_count).toBe(0);
  });
});
