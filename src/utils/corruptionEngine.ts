/**
 * corruptionEngine.ts — game-layer bridge for corruption, purity, and Daedric influence.
 *
 * Wraps CorruptionSystem (pure sim) and maps to GameState player stats.
 * Handles corruption gain, purification, milestone effects, Daedric visions,
 * submission events, and Elder Scrolls–flavored lore consequences.
 *
 * Corruption tiers:
 *   0–19   Pure      — Divines smile on you
 *   20–39  Tainted   — a seed of darkness planted
 *   40–59  Corrupted — darkness has taken root
 *   60–79  Fallen    — Daedra regard you with interest
 *   80–100 Abyssal   — you ARE the darkness
 *
 * @see src/sim/CorruptionSystem.ts — underlying corruption engine
 */

import { GameState } from '../types';
import { CorruptionState } from '../sim/types';
import {
  applyCorruption,
  applyStress,
  restoreWillpower,
  corruptionLabel,
} from '../sim/CorruptionSystem';

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function toCorruptionState(state: GameState): CorruptionState {
  return {
    corruption:  state.player.stats.corruption,
    purity:      state.player.stats.purity,
    willpower:   state.player.stats.willpower,
    stress:      state.player.stats.stress,
    trauma:      state.player.stats.trauma,
    control:     state.player.stats.control,
    submission:  state.player.psych_profile.submission_index,
  };
}

function applyCorruptionStateToGame(state: GameState, cs: CorruptionState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      stats: {
        ...state.player.stats,
        willpower:  cs.willpower,
        stress:     cs.stress,
        trauma:     cs.trauma,
        control:    cs.control,
        corruption: cs.corruption,
        purity:     cs.purity,
      },
      psych_profile: {
        ...state.player.psych_profile,
        submission_index: cs.submission,
      },
    },
  };
}

// ── Public Types ──────────────────────────────────────────────────────────────

export type CorruptionTier = 'pure' | 'tainted' | 'corrupted' | 'fallen' | 'abyssal';

export interface CorruptionGainResult {
  /** Net corruption points actually added (after purity resistance). */
  corruption_gained: number;
  /** New corruption tier after the gain. */
  new_tier: CorruptionTier;
  /** Whether the gain pushed the character into a new tier. */
  milestone_triggered: boolean;
  narrative: string;
  state: GameState;
}

export interface PurificationResult {
  /** Corruption points removed. */
  corruption_reduced: number;
  /** Whether the purification had meaningful effect (> 1 point). */
  success: boolean;
  narrative: string;
  state: GameState;
}

export interface CorruptionMilestoneResult {
  tier: CorruptionTier;
  /** Dark powers unlocked at this tier. */
  powers_unlocked: string[];
  /** Penalties imposed at this tier. */
  penalties: string[];
  narrative: string;
}

export interface CorruptionVisionResult {
  /** Daedric Prince appearing in the vision. */
  prince: string;
  /** Vision text to display to the player. */
  vision: string;
  /** Minor stat effects applied by the vision. */
  stat_effect: Partial<Record<string, number>>;
  state: GameState;
}

export interface CorruptionEffects {
  tier: CorruptionTier;
  appearance_changes: string[];
  npc_reactions: string[];
  dark_powers: string[];
  penalties: string[];
}

export interface SubmissionEventResult {
  /** Submission points gained. */
  submission_gained: number;
  narrative: string;
  state: GameState;
}

// ── Corruption Tier Helper ────────────────────────────────────────────────────

export function getCorruptionTier(corruption: number): CorruptionTier {
  if (corruption < 20) return 'pure';
  if (corruption < 40) return 'tainted';
  if (corruption < 60) return 'corrupted';
  if (corruption < 80) return 'fallen';
  return 'abyssal';
}

// ── Narrative Tables ──────────────────────────────────────────────────────────

const DAEDRIC_VISIONS: Record<string, string[]> = {
  'Molag Bal': [
    "A cold, iron grip closes around your mind. The Lord of Domination does not ask — He takes. *Submit. You were always meant to be broken.*",
    "You hear His voice like chains dragging across stone. 'Your resistance amuses me. It makes the breaking sweeter.'",
    "Coldharbour bleeds into your vision — a grey sea of torment, beautiful in its awful totality.",
  ],
  'Sanguine': [
    "A joyful laugh fills your skull, rich with wine and wickedness. 'You worry too much, little one. Give in. Everything feels better when you stop fighting.'",
    "The Prince of Debauchery winks at you from behind a goblet. Pleasure and depravity swirl around him like perfume.",
    "You smell roses and blood and something fermented and wonderful. Sanguine is pleased with you.",
  ],
  'Nocturnal': [
    "Shadow bleeds into shadow. The Lady of Twilight whispers from everywhere and nowhere. 'Everything is mine, in the end. The dark always wins.'",
    "Your shadow stretches away from you and does not come back. It belongs to Nocturnal now.",
    "The Skeleton Key turns in a lock behind your eyes. Something fundamental shifts.",
  ],
  'Sheogorath': [
    "A man in a suit of cheese explains something terribly important. You nod. You do not understand. You nod again.",
    "The Mad God's laughter cracks reality. You see the seams. You will never unsee them.",
    "Cheese, he says. It is all about the cheese. You feel strangely comforted.",
  ],
  'Mephala': [
    "Threads of fate brush against your skin. The Webspinner smiles with too many eyes. 'Every connection is a leash. I hold them all.'",
    "You feel the threads that connect you to everyone you love — and the Spider who plucks them like strings.",
  ],
};

const CORRUPTION_GAIN_NARRATIVES: Record<string, string[]> = {
  daedric_contact: [
    "The Daedric touch leaves a stain on your soul that prayer cannot fully cleanse.",
    "You feel something dark take root within you — a seed of Oblivion's darkness.",
    "Their power is intoxicating. And corruption is always the price.",
  ],
  dark_ritual: [
    "Blood on stone. Words in the Elder tongue. The ritual leaves its mark.",
    "Dark magic has a cost. Your purity pays it.",
    "The rite is complete. You feel different — less yourself.",
  ],
  substance_abuse: [
    "The skooma dreams leave tar in your soul as well as your lungs.",
    "Moonsugar sweetens more than taste. It sweetens corruption too.",
    "The substance clouds your judgment and opens doors in your mind that should stay closed.",
  ],
  default: [
    "Something dark has touched you. You feel it under your skin.",
    "The corruption takes hold with surprising ease.",
    "You are less pure than you were before.",
  ],
};

const PURIFICATION_NARRATIVES: Record<string, string[]> = {
  temple: [
    "The priests' prayers wash over you like warm water. Not all the stains come clean, but many do.",
    "Candle-smoke and incense. The divine light finds the shadows in you and draws some of them out.",
  ],
  divine_blessing: [
    "The warmth of a divine blessing purges the darkness from your soul like sunlight on frost.",
    "The Nine hear your need. Their grace, briefly felt, burns away what corrupted you.",
  ],
  pilgrimage: [
    "Weeks of walking sacred roads wear the corruption thin. Purity is a muscle, and you have exercised it.",
    "The shrines of the Eight offer no comfort to darkness. By journey's end, you are cleaner.",
  ],
  willpower: [
    "By sheer force of character, you push back against the darkness within.",
    "You will not be this. Through gritted teeth and iron will, the corruption retreats.",
  ],
};

const SUBMISSION_NARRATIVES: string[] = [
  "You yield to them completely. Something in you softens — and stays soft.",
  "Submission is a habit. This encounter deepens it.",
  "You find, to your own unease, that yielding comes easier each time.",
  "The dominator's pleasure is palpable. Your submission feeds it.",
  "You did not fight. There was a part of you that did not want to.",
];

// ── Engine Functions ──────────────────────────────────────────────────────────

/**
 * Apply corruption gain from a corrupting source.
 * Purity naturally resists some corruption (halved at max purity).
 *
 * @param state  Full game state.
 * @param amount Raw corruption to apply (0–100).
 * @param source Narrative category: 'daedric_contact' | 'dark_ritual' | 'substance_abuse' | string.
 * @param rng    Injectable random source.
 */
export function resolveCorruptionGain(
  state: GameState,
  amount: number,
  source: string,
  rng: () => number = Math.random,
): CorruptionGainResult {
  const cs = toCorruptionState(state);
  const prevTier = getCorruptionTier(cs.corruption);
  const updated = applyCorruption(cs, amount);
  const newTier = getCorruptionTier(updated.corruption);
  const milestoneTriggered = prevTier !== newTier;
  const corruption_gained = updated.corruption - cs.corruption;

  const pool = CORRUPTION_GAIN_NARRATIVES[source] ?? CORRUPTION_GAIN_NARRATIVES.default;
  const narrative = pool[Math.floor(rng() * pool.length)];

  return {
    corruption_gained,
    new_tier: newTier,
    milestone_triggered: milestoneTriggered,
    narrative,
    state: applyCorruptionStateToGame(state, updated),
  };
}

/**
 * Attempt to reduce corruption via a purification method.
 *
 * Method power:
 *   divine_blessing — strongest (25 points)
 *   pilgrimage      — powerful (20 points)
 *   temple          — moderate (15 points)
 *   willpower       — weakest (8 * willpower/100)
 *
 * Note: corruption > 60 resists purification (50% effectiveness).
 *
 * @param state  Full game state.
 * @param method Purification method.
 * @param rng    Injectable random source.
 */
export function resolvePurificationAttempt(
  state: GameState,
  method: 'temple' | 'divine_blessing' | 'pilgrimage' | 'willpower',
  rng: () => number = Math.random,
): PurificationResult {
  const cs = toCorruptionState(state);

  const METHOD_POWER: Record<typeof method, number> = {
    divine_blessing: 25,
    pilgrimage:      20,
    temple:          15,
    willpower:       8,
  };

  const basePower = METHOD_POWER[method];
  // Willpower method scales with actual willpower stat
  const modifier = method === 'willpower' ? (cs.willpower / 100) : 1;
  const rawReduction = basePower * modifier;
  // High corruption resists purification
  const resistanceFactor = cs.corruption > 60 ? 0.5 : 1;
  const actualReduction = rawReduction * resistanceFactor;

  const updated: CorruptionState = {
    ...cs,
    corruption: clamp(cs.corruption - actualReduction, 0, 100),
    purity:     clamp(cs.purity     + actualReduction * 0.5, 0, 100),
  };

  const success = actualReduction > 1;
  const pool = PURIFICATION_NARRATIVES[method] ?? ["The purification ritual is performed."];
  const narrative = success
    ? pool[Math.floor(rng() * pool.length)]
    : "The corruption resists. Some stains cannot be washed clean by this method.";

  return {
    corruption_reduced: actualReduction,
    success,
    narrative,
    state: applyCorruptionStateToGame(state, updated),
  };
}

/**
 * Check the current corruption tier and return milestone information:
 * dark powers unlocked, penalties imposed, and narrative flavour.
 *
 * Does not modify state — purely informational.
 *
 * @param state Full game state.
 */
export function resolveCorruptionMilestone(state: GameState): CorruptionMilestoneResult {
  const corruption = state.player.stats.corruption;
  const tier = getCorruptionTier(corruption);

  const MILESTONES: Record<CorruptionTier, Omit<CorruptionMilestoneResult, 'tier'>> = {
    pure: {
      powers_unlocked: [],
      penalties: [],
      narrative:
        "Your soul is clean. The Divines smile upon you — or at least do not turn away.",
    },
    tainted: {
      powers_unlocked: [
        'Minor illusion resistance',
        'Sense Daedric presence (passive)',
      ],
      penalties: [
        'Clerics sense your taint',
        'Minor fatigue from resisting inner darkness',
      ],
      narrative:
        "The darkness has found purchase in you. You are not corrupted — not yet — but the seed is planted.",
    },
    corrupted: {
      powers_unlocked: [
        'Shadow affinity (+10 skulduggery at night)',
        'Daedric minor bargaining',
        'Fear aura (weak)',
      ],
      penalties: [
        'Temple services cost more gold',
        'Animals distrust you',
        'Light spells are weakened',
      ],
      narrative:
        "Corruption has taken root. Some NPCs notice the change in your eyes. The Daedra notice too.",
    },
    fallen: {
      powers_unlocked: [
        'Dark sight (see in darkness)',
        'Daedric pact access',
        'Corruption aura (spreads passively)',
        'Enhanced strength at night',
      ],
      penalties: [
        'Turned away from most temples',
        'Guards are suspicious without cause',
        'Loved ones begin to fear you',
        'Constant dark whispers (+2 stress/day)',
      ],
      narrative:
        "You have fallen far from grace. The Daedric princes regard you with interest. Mortals regard you with fear.",
    },
    abyssal: {
      powers_unlocked: [
        'Void walking (brief phasing through walls)',
        'Daedric champion status (choose one Daedric prince)',
        'Corruption immunity (cannot gain more)',
        'Domination aura (weak-willed NPCs submit)',
        'Dark resurrection (survive fatal damage once per week)',
      ],
      penalties: [
        'Cannot enter any temple without pain',
        'Divine blessings have no effect',
        'Children and animals flee at your approach',
        'Constant hallucination pressure (+5 hallucination/day)',
        'Soul partially in Oblivion — dying may be permanent',
      ],
      narrative:
        "You have plunged into the Abyss. You are no longer simply a mortal touched by darkness — you *are* darkness, walking in mortal flesh.",
    },
  };

  return { tier, ...MILESTONES[tier] };
}

/**
 * Trigger a hallucinatory Daedric vision at high corruption.
 *
 * Prince selection is weighted by corruption level:
 *   < 40  — Sheogorath, Sanguine (lighter Daedra)
 *   40–59 — Sanguine, Nocturnal, Sheogorath, Mephala
 *   60–79 — Molag Bal, Sanguine, Nocturnal, Mephala
 *   ≥ 80  — Molag Bal, Mephala, Nocturnal (darkest)
 *
 * @param state Full game state.
 * @param rng   Injectable random source.
 */
export function resolveCorruptionVision(
  state: GameState,
  rng: () => number = Math.random,
): CorruptionVisionResult {
  const corruption = state.player.stats.corruption;

  let princes: string[];
  if (corruption >= 80) {
    princes = ['Molag Bal', 'Mephala', 'Nocturnal'];
  } else if (corruption >= 60) {
    princes = ['Molag Bal', 'Sanguine', 'Nocturnal', 'Mephala'];
  } else if (corruption >= 40) {
    princes = ['Sanguine', 'Nocturnal', 'Sheogorath', 'Mephala'];
  } else {
    princes = ['Sheogorath', 'Sanguine'];
  }

  const prince = princes[Math.floor(rng() * princes.length)];
  const visionPool = DAEDRIC_VISIONS[prince] ?? ["A faceless darkness whispers your name."];
  const vision = visionPool[Math.floor(rng() * visionPool.length)];

  const stat_effect: Partial<Record<string, number>> = {};
  if (corruption >= 60) {
    stat_effect['hallucination'] = 5;
    stat_effect['stress'] = 3;
  } else {
    stat_effect['stress'] = 2;
  }

  // Apply stress and hallucination effects
  const cs = toCorruptionState(state);
  const updatedCs = applyStress(cs, stat_effect['stress'] ?? 0);
  const afterCs = applyCorruptionStateToGame(state, updatedCs);
  const nextState: GameState = {
    ...afterCs,
    player: {
      ...afterCs.player,
      stats: {
        ...afterCs.player.stats,
        hallucination: clamp(
          state.player.stats.hallucination + (stat_effect['hallucination'] ?? 0),
          0,
          100,
        ),
      },
    },
  };

  return { prince, vision, stat_effect, state: nextState };
}

/**
 * Return the active corruption effects for the current tier.
 *
 * Does not modify state — purely informational.
 * Includes appearance changes, NPC reactions, dark powers, and penalties.
 *
 * @param state Full game state.
 */
export function getCorruptionEffects(state: GameState): CorruptionEffects {
  const corruption = state.player.stats.corruption;
  const tier = getCorruptionTier(corruption);

  const EFFECTS: Record<CorruptionTier, Omit<CorruptionEffects, 'tier'>> = {
    pure: {
      appearance_changes: [],
      npc_reactions: [
        'Divines-worshippers are instinctively friendly',
        'Children trust you',
      ],
      dark_powers: [],
      penalties:   [],
    },
    tainted: {
      appearance_changes: ['A faint shadow occasionally crosses your eyes'],
      npc_reactions: [
        'Seers may sense something wrong',
        'Daedra cultists are intrigued by you',
      ],
      dark_powers: ['Sense Daedric presence (passive)'],
      penalties:   ['Slightly reduced effectiveness of healing spells'],
    },
    corrupted: {
      appearance_changes: [
        'Eyes have a faint reddish tinge in low light',
        'Your shadow moves a half-second late',
      ],
      npc_reactions: [
        'Temple priests are cool toward you',
        'Criminals find you trustworthy',
        'Animals are nervous around you',
      ],
      dark_powers: ['Night affinity', 'Daedric minor pacts', 'Fear aura (very weak)'],
      penalties:   ['Temple blessings halved', 'Discomfort near Aedric shrines'],
    },
    fallen: {
      appearance_changes: [
        'Eyes glow faintly red in darkness',
        'Your shadow never falls in the right direction',
        'Plants wilt visibly near you',
      ],
      npc_reactions: [
        'Most commoners are instinctively afraid',
        'Guards are suspicious without cause',
        'Daedra cultists treat you as a peer',
        'Loved ones feel uneasy in your presence',
      ],
      dark_powers: ['Dark sight', 'Corruption aura', 'Daedric bargaining (major)'],
      penalties: [
        'Cannot enter temples',
        'Divine blessing has no effect',
        'Constant dark whispers (stress drain)',
      ],
    },
    abyssal: {
      appearance_changes: [
        'Eyes are entirely black — no whites, no iris',
        'Skin has an undertone of ash',
        'Flies gather near you at all times',
        'Mirrors show something else in your reflection',
      ],
      npc_reactions: [
        'Most mortals flee or cower',
        'Only Daedra worshippers treat you as an equal',
        'Children cry at your approach',
        'Animals cannot tolerate your presence',
      ],
      dark_powers: [
        'Void walking',
        'Daedric champion status',
        'Domination aura',
        'Dark resurrection (once per week)',
        'Soul is partially in Oblivion',
      ],
      penalties: [
        'Cannot enter any holy location',
        'Death may be permanent (soul claimed by Oblivion)',
        'Constant hallucinatory pressure',
        'All Aedric-aligned NPC relationships permanently hostile',
      ],
    },
  };

  return { tier, ...EFFECTS[tier] };
}

/**
 * A submission event. The character yields to a dominator.
 * Submission gain is scaled by encounter intensity and inversely by willpower.
 *
 * @param state     Full game state.
 * @param dominator Name or identifier of the dominating character.
 * @param intensity 0–100 intensity of the submission encounter.
 * @param rng       Injectable random source.
 */
export function resolveSubmissionEvent(
  state: GameState,
  dominator: string,
  intensity: number,
  rng: () => number = Math.random,
): SubmissionEventResult {
  const cs = toCorruptionState(state);

  // Willpower resistance: max willpower halves submission gain
  const willResistance = cs.willpower / 100;
  const rawGain = intensity * (1 - willResistance * 0.5);
  const clampedGain = clamp(rawGain, 0, 30);

  const updated: CorruptionState = {
    ...cs,
    submission: clamp(cs.submission + clampedGain, 0, 100),
    control:    clamp(cs.control    - clampedGain * 0.3, 0, 100),
  };

  const raw = SUBMISSION_NARRATIVES[Math.floor(rng() * SUBMISSION_NARRATIVES.length)];
  // Inject dominator name where possible
  const narrative = raw.replace('them', dominator);

  return {
    submission_gained: clampedGain,
    narrative,
    state: applyCorruptionStateToGame(state, updated),
  };
}

// Re-export corruptionLabel for UI convenience
export { corruptionLabel };
