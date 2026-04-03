/**
 * Relationship Engine (Phase 5)
 *
 * Pure, injectable helpers for stateful NPC relationship mechanics:
 *   • Per-intent stat deltas scaled by current milestone tier
 *   • Milestone derivation and change detection
 *   • Interaction cooldown / repetition diminishing returns
 *   • Recurring-scene gate (can a specific scene fire?)
 *   • Contextual narrative line selection
 *
 * All functions take plain data and return plain data — no side effects.
 */

import { NpcRelationship } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RelationshipStat = 'trust' | 'love' | 'fear' | 'dom' | 'sub';

/** Raw stat deltas returned by an intent */
export type RelationshipDeltas = Partial<Record<RelationshipStat, number>>;

/** A named scene that can be unlocked at a specific milestone */
export interface RecurringScene {
  /** Unique scene identifier */
  id: string;
  /** Minimum milestone to trigger */
  min_milestone: NpcRelationship['milestone'];
  /** Minimum interaction count before the scene is available */
  min_interactions: number;
  /** scene_flag key to set when the scene has been seen at least once */
  seen_flag: string;
  /** Whether the scene can be replayed after it has been seen */
  repeatable: boolean;
}

/** Full result of resolving one NPC interaction */
export interface RelationshipInteractionResult {
  /** Updated relationship object (not yet written to state — caller dispatches) */
  updated_relationship: NpcRelationship;
  /** True if the milestone changed as a result of this interaction */
  milestone_changed: boolean;
  /** New milestone value if it changed, else undefined */
  new_milestone?: NpcRelationship['milestone'];
  /** Scene id that should fire after this interaction, if any */
  triggered_scene?: string;
  /** Narrative line reflecting this specific interaction and relationship context */
  narrative: string;
  /** Short summary of the stat changes for UI display */
  stat_summary: RelationshipDeltas;
}

// ── Constants ────────────────────────────────────────────────────────────────

export const MILESTONE_ORDER: ReadonlyArray<NpcRelationship['milestone']> = [
  'stranger', 'acquaintance', 'friend', 'close', 'lover', 'bonded',
];

/** Thresholds (trust + love) for each milestone tier */
const MILESTONE_THRESHOLDS: Record<NpcRelationship['milestone'], number> = {
  stranger:     0,
  acquaintance: 20,
  friend:       60,
  close:        100,
  lover:        140,
  bonded:       180,
};

/**
 * Base stat deltas per dialogue intent.
 * These are applied at the "stranger" baseline; milestone multipliers scale
 * positive values further up and throttle them back down at max tiers to
 * prevent runaway stats from spam.
 */
const BASE_INTENT_DELTAS: Record<string, RelationshipDeltas> = {
  social:      { trust: 2 },
  work:        { trust: 3 },
  flirt:       { love: 3, trust: 1 },
  threaten:    { fear: 5, trust: -3 },
  gift:        { love: 4, trust: 2 },
  tease:       { love: 2, trust: 1 },
  comfort:     { trust: 4, love: 2 },
  confide:     { trust: 5 },
  beg:         { sub: 3, trust: -1 },
  praise:      { love: 2, trust: 2 },
  kiss:        { love: 6, trust: 2 },
  hold_hands:  { love: 3, trust: 3 },
  cuddle:      { love: 5, trust: 3 },
  confess:     { love: 8, trust: 3 },
  date:        { love: 6, trust: 4 },
  dom:         { dom: 4, fear: 1 },
  submit:      { sub: 4 },
};

/**
 * Diminishing returns multiplier based on how many times the player
 * has interacted with this NPC on the same game day.
 */
const SAME_DAY_MULTIPLIERS = [1.0, 0.7, 0.4, 0.2, 0.1];

/**
 * Recurring scenes available for any NPC.
 * Individual NPCs may define additional custom scenes via their scene_flags.
 */
export const UNIVERSAL_RECURRING_SCENES: RecurringScene[] = [
  {
    id: 'first_meeting',
    min_milestone: 'stranger',
    min_interactions: 0,
    seen_flag: 'scene_first_meeting_seen',
    repeatable: false,
  },
  {
    id: 'share_a_secret',
    min_milestone: 'acquaintance',
    min_interactions: 3,
    seen_flag: 'scene_share_secret_seen',
    repeatable: false,
  },
  {
    id: 'first_real_talk',
    min_milestone: 'friend',
    min_interactions: 5,
    seen_flag: 'scene_real_talk_seen',
    repeatable: false,
  },
  {
    id: 'vulnerable_moment',
    min_milestone: 'close',
    min_interactions: 10,
    seen_flag: 'scene_vulnerable_seen',
    repeatable: false,
  },
  {
    id: 'confession_of_feelings',
    min_milestone: 'close',
    min_interactions: 15,
    seen_flag: 'scene_confession_seen',
    repeatable: false,
  },
  {
    id: 'first_kiss',
    min_milestone: 'lover',
    min_interactions: 20,
    seen_flag: 'scene_first_kiss_seen',
    repeatable: false,
  },
  {
    id: 'bonded_ritual',
    min_milestone: 'bonded',
    min_interactions: 30,
    seen_flag: 'scene_bonded_ritual_seen',
    repeatable: false,
  },
  {
    id: 'regular_date',
    min_milestone: 'lover',
    min_interactions: 20,
    seen_flag: 'scene_regular_date_seen',
    repeatable: true,
  },
];

// ── Milestone helpers ─────────────────────────────────────────────────────────

export function milestoneRank(m: NpcRelationship['milestone']): number {
  return MILESTONE_ORDER.indexOf(m);
}

/**
 * Derive the current milestone from relationship stats (pure).
 */
export function computeMilestone(rel: Pick<NpcRelationship, 'trust' | 'love'>): NpcRelationship['milestone'] {
  const total = rel.trust + rel.love;
  if (total >= MILESTONE_THRESHOLDS.bonded)       return 'bonded';
  if (total >= MILESTONE_THRESHOLDS.lover)        return 'lover';
  if (total >= MILESTONE_THRESHOLDS.close)        return 'close';
  if (total >= MILESTONE_THRESHOLDS.friend)       return 'friend';
  if (total >= MILESTONE_THRESHOLDS.acquaintance) return 'acquaintance';
  return 'stranger';
}

// ── Delta computation ─────────────────────────────────────────────────────────

/**
 * Compute the effective stat deltas for a given intent and relationship state.
 *
 * Rules:
 *  1. Fetch base deltas for the intent.
 *  2. Scale positive deltas by a milestone bonus (closer = bigger gains).
 *  3. Apply diminishing-returns multiplier if the player spammed interactions today.
 */
export function computeIntentDeltas(
  intent: string,
  rel: NpcRelationship,
  currentDay: number,
): RelationshipDeltas {
  const base = BASE_INTENT_DELTAS[intent] ?? {};
  if (Object.keys(base).length === 0) return {};

  // Diminishing returns for same-day spam
  const interactionsToday = rel.last_interaction_day === currentDay
    ? Math.min(Number(rel.scene_flags['_today_count'] ?? 0), SAME_DAY_MULTIPLIERS.length - 1)
    : 0;
  const drMult = SAME_DAY_MULTIPLIERS[interactionsToday];

  // Milestone bonus: further milestones give slightly larger positive gains
  const rank = milestoneRank(rel.milestone);
  const milestoneMult = 1 + rank * 0.1; // 1.0 at stranger, 1.5 at bonded

  const result: RelationshipDeltas = {};
  for (const [key, value] of Object.entries(base)) {
    const k = key as RelationshipStat;
    if (typeof value !== 'number') continue;
    if (value > 0) {
      result[k] = Math.round(value * drMult * milestoneMult * 10) / 10;
    } else {
      // Negative deltas (e.g. threatening) are not buffed by milestone
      result[k] = value;
    }
  }
  return result;
}

// ── Scene gate ────────────────────────────────────────────────────────────────

/**
 * Return the first recurring scene (from the provided list) that should
 * fire for this interaction, or undefined if none qualifies.
 *
 * A scene fires when:
 *   - The player's milestone meets the scene's min_milestone
 *   - The interaction_count meets min_interactions
 *   - The seen_flag is not set, OR the scene is repeatable
 */
export function getTriggeredScene(
  rel: NpcRelationship,
  scenes: RecurringScene[] = UNIVERSAL_RECURRING_SCENES,
): string | undefined {
  for (const scene of scenes) {
    const rankMet = milestoneRank(rel.milestone) >= milestoneRank(scene.min_milestone);
    const countMet = rel.interaction_count >= scene.min_interactions;
    const alreadySeen = !!rel.scene_flags[scene.seen_flag];
    if (rankMet && countMet && (!alreadySeen || scene.repeatable)) {
      return scene.id;
    }
  }
  return undefined;
}

/**
 * Check whether a specific recurring scene can trigger right now.
 */
export function canTriggerScene(
  rel: NpcRelationship,
  sceneId: string,
  scenes: RecurringScene[] = UNIVERSAL_RECURRING_SCENES,
): boolean {
  const scene = scenes.find(s => s.id === sceneId);
  if (!scene) return false;
  const rankMet = milestoneRank(rel.milestone) >= milestoneRank(scene.min_milestone);
  const countMet = rel.interaction_count >= scene.min_interactions;
  const alreadySeen = !!rel.scene_flags[scene.seen_flag];
  return rankMet && countMet && (!alreadySeen || scene.repeatable);
}

// ── Narrative ─────────────────────────────────────────────────────────────────

const NARRATIVE_LINES: Partial<Record<string, Partial<Record<NpcRelationship['milestone'], string[]>>>> = {
  social: {
    stranger:     ['They give you a polite nod.', 'A brief, guarded exchange.'],
    acquaintance: ['They seem pleased you talked to them.', 'A warm enough chat.'],
    friend:       ['You share a comfortable conversation.', 'They open up a little.'],
    close:        ['You talk easily, like you always have.', 'The conversation flows naturally.'],
    lover:        ['Their eyes light up when you speak.', 'Every word feels meaningful between you.'],
    bonded:       ['There is no distance between you — words barely even necessary.', 'A look is worth a thousand words.'],
  },
  flirt: {
    stranger:     ['They blush and look away.', 'Your attempt lands awkwardly.'],
    acquaintance: ['They smile, a little flustered.', 'They giggle, hiding their face.'],
    friend:       ['They lean in, cheeks pink.', '"Is that… flirting?" they ask, eyes bright.'],
    close:        ['They meet your gaze with a soft, knowing smile.', 'The air between you feels charged.'],
    lover:        ['They press close, voice low.', 'Their fingers find yours.'],
    bonded:       ['A single look carries everything.', 'They pull you into a wordless embrace.'],
  },
  threaten: {
    stranger:     ['Their face hardens. The warmth drains from the air.', 'They step back, wary.'],
    acquaintance: ['They flinch. Your words land harder than you expected.', 'The friendliness evaporates.'],
    friend:       ['Hurt and confusion war on their face.', '"I thought I knew you," they say quietly.'],
    close:        ['Their eyes fill with something broken.', 'The silence that follows is devastating.'],
    lover:        ['Something shatters between you.', 'They look at you like you are a stranger.'],
    bonded:       ['The wound goes deep. They don\'t even shout back.', 'They simply turn and walk away.'],
  },
  comfort: {
    stranger:     ['They are surprised by your kindness.', 'A tentative softening in their posture.'],
    acquaintance: ['Your words reach them.', 'They exhale, some tension leaving their shoulders.'],
    friend:       ['They lean into you briefly.', '"Thank you. I needed that."'],
    close:        ['They cling to you for a moment before pulling back.', '"You always know what to say."'],
    lover:        ['You hold each other for a long while.', 'No words needed — just presence.'],
    bonded:       ['There is a deep, wordless peace between you.', 'They fall asleep in your arms.'],
  },
  confide: {
    stranger:     ['They listen politely but hold something back.', 'A careful, measured response.'],
    acquaintance: ['They share a small secret in return.', '"I\'ve never told anyone this, but…"'],
    friend:       ['They open up further than you expected.', 'Something real passes between you.'],
    close:        ['You share things rarely spoken aloud.', 'The honesty is staggering.'],
    lover:        ['No masks remain between you.', 'You have shared the darkest corners of yourselves.'],
    bonded:       ['You are each other\'s keeper.', 'Every secret held, every scar witnessed.'],
  },
  kiss: {
    stranger:     ['They pull back, startled.', 'Too soon — they are not ready for this.'],
    acquaintance: ['A brief, uncertain moment.', 'They don\'t pull away, but they don\'t lean in either.'],
    friend:       ['Their breath catches.', 'The air changes between you.'],
    close:        ['Soft and deliberate.', 'The kiss says what words cannot.'],
    lover:        ['Warm and certain — a homecoming.', 'You lose track of time.'],
    bonded:       ['It feels like the first and thousandth time at once.', 'Complete.'],
  },
};

const GENERIC_NARRATIVE: Record<NpcRelationship['milestone'], string> = {
  stranger:     'A brief interaction. Nothing more.',
  acquaintance: 'A small moment of connection.',
  friend:       'You feel the warmth of genuine friendship.',
  close:        'The bond between you deepens.',
  lover:        'There is an intimacy in even the smallest gesture.',
  bonded:       'Words feel almost unnecessary between you.',
};

/**
 * Return a narrative line for this interaction, matched to intent and milestone.
 * Optionally injectable RNG for deterministic testing.
 */
export function getInteractionNarrative(
  intent: string,
  milestone: NpcRelationship['milestone'],
  rng: () => number = Math.random,
): string {
  const lines = NARRATIVE_LINES[intent]?.[milestone];
  if (lines && lines.length > 0) {
    return lines[Math.floor(rng() * lines.length)];
  }
  return GENERIC_NARRATIVE[milestone];
}

// ── Master resolver ───────────────────────────────────────────────────────────

/**
 * Resolve a single NPC interaction, returning a full result object.
 *
 * This function is pure: it takes state slices and returns a new
 * `NpcRelationship` plus metadata.  The caller (reducer) is responsible
 * for writing the new relationship to `world.npc_relationships`.
 *
 * @param rel           Current relationship state for this NPC
 * @param intent        Dialogue intent string (e.g. 'flirt', 'threaten')
 * @param currentDay    Current game day (world.day) for diminishing-returns tracking
 * @param scenes        Scene registry (defaults to UNIVERSAL_RECURRING_SCENES)
 * @param rng           Injected RNG (defaults to Math.random)
 */
export function resolveRelationshipInteraction(
  rel: NpcRelationship,
  intent: string,
  currentDay: number,
  scenes: RecurringScene[] = UNIVERSAL_RECURRING_SCENES,
  rng: () => number = Math.random,
): RelationshipInteractionResult {
  const deltas = computeIntentDeltas(intent, rel, currentDay);

  // Apply deltas, clamped 0–100
  const updated: NpcRelationship = { ...rel };
  const statKeys: RelationshipStat[] = ['trust', 'love', 'fear', 'dom', 'sub'];
  for (const key of statKeys) {
    const delta = deltas[key];
    if (typeof delta === 'number') {
      updated[key] = Math.max(0, Math.min(100, rel[key] + delta));
    }
  }

  // Update interaction tracking
  const sameDayAsLast = rel.last_interaction_day === currentDay;
  updated.last_interaction_day = currentDay;
  updated.interaction_count = rel.interaction_count + 1;
  updated.scene_flags = {
    ...rel.scene_flags,
    _today_count: sameDayAsLast
      ? (Number(rel.scene_flags['_today_count'] ?? 0) + 1)
      : 1,
  };

  // Recompute milestone
  const prevMilestone = rel.milestone;
  const newMilestone = computeMilestone(updated);
  updated.milestone = newMilestone;
  const milestone_changed = newMilestone !== prevMilestone;

  // Check for triggered scenes using the POST-update relationship
  const triggered_scene = getTriggeredScene(updated, scenes);
  if (triggered_scene) {
    // Find the scene and mark its seen_flag
    const scene = scenes.find(s => s.id === triggered_scene);
    if (scene && !scene.repeatable) {
      updated.scene_flags = { ...updated.scene_flags, [scene.seen_flag]: true };
    }
  }

  const narrative = getInteractionNarrative(intent, updated.milestone, rng);

  return {
    updated_relationship: updated,
    milestone_changed,
    new_milestone: milestone_changed ? newMilestone : undefined,
    triggered_scene,
    narrative,
    stat_summary: deltas,
  };
}
