/**
 * arcaneEngine.ts — game-layer bridge for the magic/arcane system.
 *
 * Sits between ArcaneSystem (pure sim) and the game reducers. All functions
 * are pure (injectable RNG) and fully testable without DOM or React.
 *
 * Covers: spell casting, learning, enchanting, disenchanting, meditation,
 * arcane corruption ticks, and stat queries.
 *
 * @see src/sim/ArcaneSystem.ts — underlying mana / enchantment / corruption engine
 * @see src/sim/types.ts        — ArcaneState, SpellSchool, Enchantment types
 */

import { ArcaneState, Enchantment, SpellSchool, EnchantmentType } from '../../features/simulation/systems/types';
import { StatKey } from '../../core/types';
import {
  spendMana,
  improveAffinity,
  getAffinity,
  addEnchantment,
  removeEnchantment,
  enchantmentStatEffects,
  tickArcane,
} from '../sim/ArcaneSystem';

// ── Spell Catalog ─────────────────────────────────────────────────────────────

export interface SpellData {
  id: string;
  name: string;
  school: SpellSchool;
  mana_cost: number;
  base_power: number;
  /** Minimum school affinity needed to cast. */
  affinity_requirement: number;
  description: string;
  /** Stat deltas applied to the caster on a successful cast. */
  stat_effects: Partial<Record<StatKey, number>>;
  /** 0–1 corruption added (as fraction of mana cost × this). */
  corruption_risk: number;
}

export const SPELL_CATALOG: SpellData[] = [
  // ── Destruction ──────────────────────────────────────────────────────────
  {
    id: 'flames',
    name: 'Flames',
    school: 'destruction',
    mana_cost: 10,
    base_power: 20,
    affinity_requirement: 0,
    description: 'Shoots a stream of fire from your hands. Apprentice-level Destruction.',
    stat_effects: { stamina: -5, stress: 3 },
    corruption_risk: 0.05,
  },
  {
    id: 'frostbite',
    name: 'Frostbite',
    school: 'destruction',
    mana_cost: 15,
    base_power: 25,
    affinity_requirement: 10,
    description: 'Drains the heat from your target with biting cold. College of Winterhold initiate spell.',
    stat_effects: { stamina: -8, stress: 4, pain: 2 },
    corruption_risk: 0.07,
  },
  {
    id: 'lightning_bolt',
    name: 'Lightning Bolt',
    school: 'destruction',
    mana_cost: 22,
    base_power: 35,
    affinity_requirement: 30,
    description: 'A bolt of lightning deals heavy shock damage. Adept Destruction.',
    stat_effects: { stamina: -12, stress: 6, pain: 3 },
    corruption_risk: 0.10,
  },
  {
    id: 'fireball',
    name: 'Fireball',
    school: 'destruction',
    mana_cost: 35,
    base_power: 50,
    affinity_requirement: 50,
    description: 'A massive fireball that detonates on impact. Expert Destruction.',
    stat_effects: { stamina: -18, stress: 10, pain: 5 },
    corruption_risk: 0.15,
  },

  // ── Restoration ──────────────────────────────────────────────────────────
  {
    id: 'healing',
    name: 'Healing',
    school: 'restoration',
    mana_cost: 15,
    base_power: 20,
    affinity_requirement: 0,
    description: 'Slowly regenerates your health. First spell taught at the College of Winterhold.',
    stat_effects: { health: 20, stress: -5 },
    corruption_risk: 0.01,
  },
  {
    id: 'close_wounds',
    name: 'Close Wounds',
    school: 'restoration',
    mana_cost: 28,
    base_power: 40,
    affinity_requirement: 25,
    description: 'Instantly closes serious wounds. Adept Restoration, favoured by temple healers.',
    stat_effects: { health: 40, pain: -10, stress: -8 },
    corruption_risk: 0.02,
  },
  {
    id: 'repel_undead',
    name: 'Repel Undead',
    school: 'restoration',
    mana_cost: 20,
    base_power: 30,
    affinity_requirement: 15,
    description: 'Drives back nearby undead with holy light. Blessed by the Nine Divines.',
    stat_effects: { stress: -10, purity: 5 },
    corruption_risk: 0.02,
  },

  // ── Illusion ─────────────────────────────────────────────────────────────
  {
    id: 'calm',
    name: 'Calm',
    school: 'illusion',
    mana_cost: 15,
    base_power: 20,
    affinity_requirement: 10,
    description: 'Calms a nearby creature or person, soothing aggression. Subtle but powerful.',
    stat_effects: { stress: -15, trauma: -5, arousal: 3 },
    corruption_risk: 0.08,
  },
  {
    id: 'fury',
    name: 'Fury',
    school: 'illusion',
    mana_cost: 20,
    base_power: 25,
    affinity_requirement: 20,
    description: 'Fills the target — or yourself — with uncontrollable rage and desire.',
    stat_effects: { lust: 8, arousal: 10, control: -8, stress: 5 },
    corruption_risk: 0.12,
  },
  {
    id: 'muffle',
    name: 'Muffle',
    school: 'illusion',
    mana_cost: 10,
    base_power: 15,
    affinity_requirement: 5,
    description: 'Silences your footsteps. Novice Illusion; favoured by the Thieves Guild.',
    stat_effects: { stress: -5 },
    corruption_risk: 0.05,
  },
  {
    id: 'frenzy',
    name: 'Frenzy',
    school: 'illusion',
    mana_cost: 25,
    base_power: 30,
    affinity_requirement: 35,
    description: 'Drives targets into a killing frenzy. Often triggers unintended side effects.',
    stat_effects: { lust: 12, arousal: 15, control: -12, stress: 8 },
    corruption_risk: 0.15,
  },

  // ── Conjuration ──────────────────────────────────────────────────────────
  {
    id: 'conjure_familiar',
    name: 'Conjure Familiar',
    school: 'conjuration',
    mana_cost: 20,
    base_power: 25,
    affinity_requirement: 10,
    description: 'Summons a spirit wolf to fight by your side. Apprentice Conjuration.',
    stat_effects: { stress: -5, control: 5 },
    corruption_risk: 0.10,
  },
  {
    id: 'soul_trap',
    name: 'Soul Trap',
    school: 'conjuration',
    mana_cost: 20,
    base_power: 30,
    affinity_requirement: 25,
    description: 'Captures the soul of a dying creature in an empty soul gem.',
    stat_effects: { corruption: 3, stress: 5 },
    corruption_risk: 0.15,
  },
  {
    id: 'raise_zombie',
    name: 'Raise Zombie',
    school: 'conjuration',
    mana_cost: 25,
    base_power: 30,
    affinity_requirement: 20,
    description: 'Raises a corpse to serve you briefly. The soul remembers nothing.',
    stat_effects: { corruption: 5, stress: 8, trauma: 3 },
    corruption_risk: 0.18,
  },

  // ── Ward ─────────────────────────────────────────────────────────────────
  {
    id: 'ward',
    name: 'Ward',
    school: 'ward',
    mana_cost: 10,
    base_power: 15,
    affinity_requirement: 0,
    description: 'Raises a ward that absorbs incoming spells. Basic protection magic.',
    stat_effects: { control: 8, stress: -5 },
    corruption_risk: 0.02,
  },
  {
    id: 'oakflesh',
    name: 'Oakflesh',
    school: 'ward',
    mana_cost: 20,
    base_power: 25,
    affinity_requirement: 15,
    description: 'Hardens your skin like oak bark. Alteration magic common at the College.',
    stat_effects: { control: 12, pain: -5 },
    corruption_risk: 0.03,
  },
  {
    id: 'steadfast_ward',
    name: 'Steadfast Ward',
    school: 'ward',
    mana_cost: 28,
    base_power: 35,
    affinity_requirement: 30,
    description: 'A powerful ward against all magic. Taught only to advanced students at Winterhold.',
    stat_effects: { control: 20, stress: -12, purity: 5 },
    corruption_risk: 0.02,
  },

  // ── Hex ──────────────────────────────────────────────────────────────────
  {
    id: 'paralyze',
    name: 'Paralyze',
    school: 'hex',
    mana_cost: 30,
    base_power: 40,
    affinity_requirement: 25,
    description: 'Completely freezes a target in place. Illegal in most holds of Skyrim.',
    stat_effects: { stamina: -15, corruption: 5, stress: 8 },
    corruption_risk: 0.20,
  },
  {
    id: 'drain_vitality',
    name: 'Drain Vitality',
    school: 'hex',
    mana_cost: 22,
    base_power: 30,
    affinity_requirement: 20,
    description: 'Siphons health from a target to restore your own vitality.',
    stat_effects: { health: 15, corruption: 5, stress: 5 },
    corruption_risk: 0.18,
  },
  {
    id: 'hex_of_weakness',
    name: 'Hex of Weakness',
    school: 'hex',
    mana_cost: 18,
    base_power: 22,
    affinity_requirement: 15,
    description: 'Curses a target with magical weakness. Daedric whispers guide your hand.',
    stat_effects: { corruption: 3, stress: 6, control: -5 },
    corruption_risk: 0.15,
  },
];

/** Quick lookup by spell ID. */
export const SPELL_BY_ID: Record<string, SpellData> = Object.fromEntries(
  SPELL_CATALOG.map(s => [s.id, s]),
);

// ── State ─────────────────────────────────────────────────────────────────────

/**
 * Game-layer arcane state. Extends sim-level ArcaneState with the player's
 * learned spells, crafting resources, and known enchantment patterns.
 */
export interface ArcaneEngineState {
  arcane: ArcaneState;
  /** Spell IDs the player has learned. */
  known_spells: string[];
  /** Empty soul gems available for enchanting / Soul Trap. */
  soul_gems: number;
  /** Enchantment pattern names unlocked via Disenchant. */
  known_enchantments: string[];
}

/** Construct a default ArcaneEngineState for a new character. */
export function defaultArcaneEngineState(): ArcaneEngineState {
  return {
    arcane: {
      mana: 50,
      mana_regen: 2,
      spell_affinity: {},
      enchantments: [],
      arcane_corruption: 0,
    },
    known_spells: [],
    soul_gems: 0,
    known_enchantments: [],
  };
}

// ── Side Effects ──────────────────────────────────────────────────────────────

export type ArcaneSideEffect =
  | { type: 'LEARN_SPELL'; spell_id: string }
  | { type: 'MISFIRE'; description: string; damage: number }
  | { type: 'DAEDRIC_WHISPER'; message: string }
  | { type: 'VISUAL_DISTORTION'; severity: number }
  | { type: 'ENCHANTMENT_LEARNED'; enchantment_name: string; school: SpellSchool }
  | { type: 'ENCHANTMENT_APPLIED'; enchantment_id: string; item_id: string }
  | { type: 'SOUL_GEM_CONSUMED'; count: number };

// ── Resolution ────────────────────────────────────────────────────────────────

export interface ArcaneResolution {
  narrative: string;
  stat_deltas: Partial<Record<StatKey, number>>;
  updated_state: ArcaneEngineState;
  side_effects: ArcaneSideEffect[];
  success: boolean;
}

// ── resolveCastSpell ──────────────────────────────────────────────────────────

/**
 * Attempt to cast a known spell. Drains mana, applies stat effects, and
 * accrues arcane corruption. At high corruption, spells may misfire or
 * attract Daedric attention.
 *
 * @param state   Current arcane engine state.
 * @param spellId Spell identifier (must be in SPELL_BY_ID).
 * @param target  Optional narrative target description.
 * @param rng     Injectable RNG (default Math.random).
 */
export function resolveCastSpell(
  state: ArcaneEngineState,
  spellId: string,
  target?: string,
  rng: () => number = Math.random,
): ArcaneResolution {
  const spell = SPELL_BY_ID[spellId];
  if (!spell) {
    return failure(state, 'You attempt to cast an unknown incantation, but nothing stirs.');
  }

  if (!state.known_spells.includes(spellId)) {
    return failure(state, `You haven't learned ${spell.name} yet.`);
  }

  const affinity = getAffinity(state.arcane, spell.school);
  if (affinity < spell.affinity_requirement) {
    return failure(
      state,
      `Your ${spell.school} affinity (${Math.floor(affinity)}) is too weak for ${spell.name}. ` +
        `You need at least ${spell.affinity_requirement}.`,
    );
  }

  if (state.arcane.mana < spell.mana_cost) {
    return failure(
      state,
      `Your magicka runs dry. ${spell.name} costs ${spell.mana_cost} mana but you only have ` +
        `${Math.floor(state.arcane.mana)}.`,
    );
  }

  // Spend mana (also adds a small corruption increment in spendMana)
  const arcaneAfterMana = spendMana(state.arcane, spell.mana_cost)!;

  // Additional corruption from the school's inherent risk
  const addedCorruption = spell.corruption_risk * spell.mana_cost;
  const arcaneWithCorruption: ArcaneState = {
    ...arcaneAfterMana,
    arcane_corruption: clamp(arcaneAfterMana.arcane_corruption + addedCorruption, 0, 100),
  };

  // Small affinity improvement from practice
  const arcaneAfterAffinity = improveAffinity(arcaneWithCorruption, spell.school, 0.5);

  // Scale stat effects by affinity bonus
  const affinityBonus = 1 + affinity / 200; // 1.0 at 0, 1.5 at 100
  const stat_deltas: Partial<Record<StatKey, number>> = {};
  for (const [key, val] of Object.entries(spell.stat_effects) as [StatKey, number][]) {
    if (val !== undefined) {
      stat_deltas[key] = Math.round(val * affinityBonus);
    }
  }

  const side_effects: ArcaneSideEffect[] = [];

  // ── Corruption effects ────────────────────────────────────────────────────
  const finalCorruption = arcaneAfterAffinity.arcane_corruption;

  if (finalCorruption >= 80 && rng() < 0.30) {
    const misfireDamage = Math.floor(rng() * 15) + 5;
    side_effects.push({
      type: 'MISFIRE',
      description: 'The spell surges uncontrollably, lashing back at you!',
      damage: misfireDamage,
    });
    stat_deltas.health = (stat_deltas.health ?? 0) - misfireDamage;
    stat_deltas.pain = (stat_deltas.pain ?? 0) + 10;
  }

  if (finalCorruption >= 60 && rng() < 0.20) {
    side_effects.push({
      type: 'DAEDRIC_WHISPER',
      message: pickDaedricWhisper(rng),
    });
    stat_deltas.stress = (stat_deltas.stress ?? 0) + 5;
    stat_deltas.hallucination = (stat_deltas.hallucination ?? 0) + 3;
  }

  if (finalCorruption >= 40 && rng() < 0.15) {
    side_effects.push({ type: 'VISUAL_DISTORTION', severity: Math.ceil(finalCorruption / 20) });
    stat_deltas.hallucination = (stat_deltas.hallucination ?? 0) + 2;
  }

  const narrative = buildCastNarrative(spell, target, affinity, finalCorruption, rng);

  return {
    narrative,
    stat_deltas,
    updated_state: { ...state, arcane: arcaneAfterAffinity },
    side_effects,
    success: true,
  };
}

// ── resolveLearnSpell ─────────────────────────────────────────────────────────

/**
 * Attempt to learn a new spell. The chance of success depends on the source
 * and the caster's current school affinity.
 *
 * @param state   Current arcane engine state.
 * @param spellId Spell to learn.
 * @param source  'tome''| 'teacher''| 'practice'
 * @param rng     Injectable RNG.
 */
export function resolveLearnSpell(
  state: ArcaneEngineState,
  spellId: string,
  source: 'tome''| 'teacher''| 'practice',
  rng: () => number = Math.random,
): ArcaneResolution {
  const spell = SPELL_BY_ID[spellId];
  if (!spell) {
    return failure(state, 'This spell exists in no tome you have ever read.');
  }

  if (state.known_spells.includes(spellId)) {
    return failure(state, `You already know ${spell.name}.`);
  }

  const affinity = getAffinity(state.arcane, spell.school);

  // Minimum affinity required to even attempt (half of cast requirement for tome/practice)
  const minAffinity =
    source === 'teacher''? 0 : Math.floor(spell.affinity_requirement * 0.5);
  if (affinity < minAffinity) {
    return failure(
      state,
      `You lack the ${spell.school} foundation (need ${minAffinity}) to learn ${spell.name} from a ${source}.`,
    );
  }

  // Success probability
  const base: Record<typeof source, number> = {
    teacher:  0.60 + affinity / 200, / 60–110 % → capped
    tome:     0.40 + affinity / 200, / 40–90 %
    practice: 0.20 + affinity / 150, / 20–87 %
  };
  const successChance = clamp(base[source], 0, 0.95);

  // Win or lose, trying improves affinity
  const affinityGain = rng() < successChance ? 3 : 1;
  const arcaneAfterAffinity = improveAffinity(state.arcane, spell.school, affinityGain);

  const stat_deltas: Partial<Record<StatKey, number>> = { stamina: -5, stress: 3 };
  const side_effects: ArcaneSideEffect[] = [];

  if (rng() < successChance) {
    side_effects.push({ type: 'LEARN_SPELL', spell_id: spellId });
    const updatedState: ArcaneEngineState = {
      ...state,
      arcane: arcaneAfterAffinity,
      known_spells: [...state.known_spells, spellId],
    };
    return {
      narrative: buildLearnNarrative(spell, source, true),
      stat_deltas,
      updated_state: updatedState,
      side_effects,
      success: true,
    };
  }

  return {
    narrative: buildLearnNarrative(spell, source, false),
    stat_deltas,
    updated_state: { ...state, arcane: arcaneAfterAffinity },
    side_effects,
    success: false,
  };
}

// ── resolveEnchantItem ────────────────────────────────────────────────────────

/**
 * Enchant an item using a soul gem. Adds an enchantment to the arcane state
 * and consumes one soul gem. Requires minimum school affinity.
 *
 * @param state           Current arcane engine state.
 * @param itemId          Identifier of the item being enchanted (used for ID generation).
 * @param enchantmentType 'blessing''| 'curse'
 * @param school          Spell school of the enchantment.
 * @param rng             Injectable RNG.
 */
export function resolveEnchantItem(
  state: ArcaneEngineState,
  itemId: string,
  enchantmentType: EnchantmentType,
  school: SpellSchool,
  rng: () => number = Math.random,
): ArcaneResolution {
  if (state.soul_gems < 1) {
    return failure(state, 'You have no soul gems to power the enchantment.');
  }

  const affinity = getAffinity(state.arcane, school);
  if (affinity < 10) {
    return failure(
      state,
      `Your ${school} affinity is too weak to enchant with this school. You need at least 10.`,
    );
  }

  if (state.arcane.enchantments.length >= 8) {
    return failure(
      state,
      'The arcane weave is already overburdened. You cannot hold more than 8 active enchantments.',
    );
  }

  const potency = clamp(Math.floor(20 + affinity / 2 + rng() * 30), 10, 100);
  const enchantmentId = `enchant_${itemId}_${Math.floor(rng() * 100000)}`;

  const enchantment: Enchantment = {
    id: enchantmentId,
    name: enchantmentName(enchantmentType, school),
    type: enchantmentType,
    school,
    potency,
    duration_remaining: -1,
    stat_effects: enchantmentStatEffectsTable(school, potency),
  };

  const arcaneWithAffinity = improveAffinity(state.arcane, school, 2);
  const arcaneWithEnchantment = addEnchantment(arcaneWithAffinity, enchantment);
  const arcaneWithCorruption: ArcaneState = {
    ...arcaneWithEnchantment,
    arcane_corruption: clamp(arcaneWithEnchantment.arcane_corruption + 5, 0, 100),
  };

  const side_effects: ArcaneSideEffect[] = [
    { type: 'SOUL_GEM_CONSUMED', count: 1 },
    { type: 'ENCHANTMENT_APPLIED', enchantment_id: enchantmentId, item_id: itemId },
  ];

  return {
    narrative:
      `You channel the soul gem's energy into ${itemId}, weaving a ${enchantment.name} ` +
      `with potency ${potency}. The enchantment settles into the material with a faint glow.`,
    stat_deltas: { stamina: -10, stress: 5 },
    updated_state: {
      ...state,
      arcane: arcaneWithCorruption,
      soul_gems: state.soul_gems - 1,
    },
    side_effects,
    success: true,
  };
}

// ── resolveDisenchant ─────────────────────────────────────────────────────────

/**
 * Destroy an enchanted item to learn its enchantment pattern. Small chance
 * of arcane backlash.
 *
 * @param state  Current arcane engine state.
 * @param itemId The item (its enchantment ID must contain this string).
 * @param rng    Injectable RNG.
 */
export function resolveDisenchant(
  state: ArcaneEngineState,
  itemId: string,
  rng: () => number = Math.random,
): ArcaneResolution {
  const enchantment = state.arcane.enchantments.find(e => e.id.includes(itemId));
  if (!enchantment) {
    return failure(state, `No enchantment found on "${itemId}" to disenchant.`);
  }

  const school = enchantment.school;
  const arcaneAfterRemove = removeEnchantment(
    improveAffinity(state.arcane, school, 3),
    enchantment.id,
  );

  const side_effects: ArcaneSideEffect[] = [
    { type: 'ENCHANTMENT_LEARNED', enchantment_name: enchantment.name, school },
  ];

  // 15 % chance of backlash
  const stat_deltas: Partial<Record<StatKey, number>> = { stamina: -5 };
  let narrative: string;

  if (rng() < 0.15) {
    const backlashDamage = Math.floor(rng() * 10) + 5;
    stat_deltas.health = -backlashDamage;
    stat_deltas.pain = 8;
    narrative =
      `You tear the enchantment apart — the released energy scorches your hands. You learn ` +
      `the ${enchantment.name} pattern, though it costs you.`;
  } else {
    narrative =
      `You carefully unravel the ${enchantment.name} from the item, absorbing its pattern. ` +
      `Your understanding of ${school} magic deepens.`;
  }

  const newKnownEnchantments = state.known_enchantments.includes(enchantment.name)
    ? state.known_enchantments
    : [...state.known_enchantments, enchantment.name];

  return {
    narrative,
    stat_deltas,
    updated_state: {
      ...state,
      arcane: arcaneAfterRemove,
      known_enchantments: newKnownEnchantments,
    },
    side_effects,
    success: true,
  };
}

// ── resolveMeditateArcane ─────────────────────────────────────────────────────

/**
 * Meditate to recover mana, reduce arcane corruption, and optionally train a
 * spell school affinity. At high corruption, Daedric presences may intrude.
 *
 * @param state  Current arcane engine state.
 * @param hours  Hours spent meditating (1–8 recommended).
 * @param school Optional school to focus on.
 * @param rng    Injectable RNG.
 */
export function resolveMeditateArcane(
  state: ArcaneEngineState,
  hours: number,
  school?: SpellSchool,
  rng: () => number = Math.random,
): ArcaneResolution {
  const safehours = Math.max(0, hours);

  // Normal tick handles base regen and corruption decay
  const arcaneAfterTick = tickArcane(state.arcane, safehours);

  // Meditation bonus: extra mana and extra corruption purge
  const bonusMana = safehours * 3;
  const bonusDecay = safehours * 0.5;
  const arcaneAfterMeditation: ArcaneState = {
    ...arcaneAfterTick,
    mana: clamp(arcaneAfterTick.mana + bonusMana, 0, 100),
    arcane_corruption: clamp(arcaneAfterTick.arcane_corruption - bonusDecay, 0, 100),
  };

  // Focused school training
  let finalArcane = arcaneAfterMeditation;
  if (school) {
    finalArcane = improveAffinity(arcaneAfterMeditation, school, safehours * 0.5);
  }

  const stat_deltas: Partial<Record<StatKey, number>> = {
    stress:    -Math.floor(safehours * 5),
    stamina:   -Math.floor(safehours * 3),
    willpower:  Math.floor(safehours * 2),
  };

  const side_effects: ArcaneSideEffect[] = [];

  if (finalArcane.arcane_corruption >= 60 && rng() < 0.25) {
    side_effects.push({ type: 'DAEDRIC_WHISPER', message: pickDaedricWhisper(rng) });
    stat_deltas.stress = (stat_deltas.stress ?? 0) + 10;
    stat_deltas.hallucination = 5;
    stat_deltas.corruption = 3;
  }

  if (finalArcane.arcane_corruption >= 40 && rng() < 0.15) {
    side_effects.push({ type: 'VISUAL_DISTORTION', severity: Math.ceil(finalArcane.arcane_corruption / 20) });
    stat_deltas.hallucination = (stat_deltas.hallucination ?? 0) + 3;
  }

  const schoolLabel = school ? ` focusing on ${school}` : ';
  const narrative =
    `You meditate for ${safehours} hour${safehours !== 1 ? 's'': ''}${schoolLabel}. ` +
    `Your magicka flows more freely, and the weight of arcane corruption eases.`;

  return {
    narrative,
    stat_deltas,
    updated_state: { ...state, arcane: finalArcane },
    side_effects,
    success: true,
  };
}

// ── resolveArcaneCorruptionTick ───────────────────────────────────────────────

/**
 * Passive per-turn corruption effects. Should be called once per game tick.
 * Returns an empty resolution when corruption is below threshold.
 */
export function resolveArcaneCorruptionTick(
  state: ArcaneEngineState,
  rng: () => number = Math.random,
): ArcaneResolution {
  const corruption = state.arcane.arcane_corruption;

  if (corruption < 20) {
    return { narrative: ', stat_deltas: {}, updated_state: state, side_effects: [], success: true };
  }

  const stat_deltas: Partial<Record<StatKey, number>> = {};
  const side_effects: ArcaneSideEffect[] = [];
  let narrative = ';

  if (corruption >= 80) {
    // Dangerously Unstable
    stat_deltas.stress = 10;
    stat_deltas.hallucination = 8;
    stat_deltas.control = -5;

    if (rng() < 0.40) {
      const misfireDamage = Math.floor(rng() * 20) + 10;
      side_effects.push({
        type: 'MISFIRE',
        description: 'Unstable arcane energy discharges randomly from your fingertips!',
        damage: misfireDamage,
      });
      stat_deltas.health = -misfireDamage;
      stat_deltas.pain = 15;
      narrative = 'Wild magic crackles across your skin — the arcane corruption is consuming you.';
    }

    if (rng() < 0.50) {
      side_effects.push({ type: 'DAEDRIC_WHISPER', message: pickDaedricWhisper(rng) });
      stat_deltas.corruption = 5;
      narrative = narrative || 'Daedric presences crowd the edges of your vision.';
    }

    side_effects.push({ type: 'VISUAL_DISTORTION', severity: 5 });
    stat_deltas.hallucination = (stat_deltas.hallucination ?? 0) + 5;

  } else if (corruption >= 60) {
    // Volatile
    stat_deltas.stress = 6;
    stat_deltas.hallucination = 4;

    if (rng() < 0.25) {
      side_effects.push({ type: 'DAEDRIC_WHISPER', message: pickDaedricWhisper(rng) });
      stat_deltas.corruption = 2;
    }

    if (rng() < 0.20) {
      side_effects.push({ type: 'VISUAL_DISTORTION', severity: 3 });
    }

    narrative = 'The arcane corruption flickers through your senses, distorting reality at the edges.';

  } else if (corruption >= 40) {
    // Flickering
    stat_deltas.stress = 3;
    stat_deltas.hallucination = 2;

    if (rng() < 0.10) {
      side_effects.push({ type: 'VISUAL_DISTORTION', severity: 1 });
    }

    narrative = 'A faint arcane shimmer distorts your vision momentarily.';

  } else {
    // Slight Distortion (20–39)
    stat_deltas.stress = 1;
    narrative = 'You feel a slight magical unease lingering at the back of your mind.';
  }

  return { narrative, stat_deltas, updated_state: state, side_effects, success: true };
}

// ── getAvailableSpells ────────────────────────────────────────────────────────

/**
 * Return all spells the player can currently cast:
 * known + sufficient mana + minimum affinity met.
 */
export function getAvailableSpells(state: ArcaneEngineState): SpellData[] {
  return SPELL_CATALOG.filter(spell => {
    if (!state.known_spells.includes(spell.id)) return false;
    if (state.arcane.mana < spell.mana_cost) return false;
    if (getAffinity(state.arcane, spell.school) < spell.affinity_requirement) return false;
    return true;
  });
}

// ── getEnchantmentEffects ─────────────────────────────────────────────────────

/**
 * Compute net stat bonuses/penalties from all active enchantments.
 * Delegates to sim-layer `enchantmentStatEffects`.
 */
export function getEnchantmentEffects(state: ArcaneEngineState): Record<string, number> {
  return enchantmentStatEffects(state.arcane);
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function failure(state: ArcaneEngineState, narrative: string): ArcaneResolution {
  return { narrative, stat_deltas: {}, updated_state: state, side_effects: [], success: false };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

const DAEDRIC_WHISPERS = [
  'A voice whispers promises of power if you abandon your restraint...',
  "The Daedric Princes take notice of your arcane hunger.",
  "Molag Bal's laughter echoes in the depths of your mind.",
  "Sheogorath giggles at the fringes of your sanity.",
  'You hear the distant chanting of Oblivion.',
  'Mehrunes Dagon whispers of destruction through your corrupted mind.',
  "You hear Molag Bal's chains rattling in your dreams.",
  'A Daedric voice promises release from pain — at a price.',
  'The boundaries between you and Oblivion grow dangerously thin.',
  'Hermaeus Mora shows you a glimpse of forbidden tomes during your trance.',
];

function pickDaedricWhisper(rng: () => number): string {
  return DAEDRIC_WHISPERS[Math.floor(rng() * DAEDRIC_WHISPERS.length)];
}

function buildCastNarrative(
  spell: SpellData,
  target: string | undefined,
  affinity: number,
  corruption: number,
  rng: () => number,
): string {
  const onto = target ? ` at ${target}` : ';
  const skill = affinity >= 80 ? 'masterfully'': affinity >= 40 ? 'confidently'': affinity >= 20 ? 'steadily'': 'straining';

  const lines: Record<SpellSchool, string[]> = {
    destruction: [
      `You ${skill} hurl ${spell.name}${onto}, raw destructive energy searing your palm as it leaves.`,
      `Magicka ignites in your hand and you unleash ${spell.name}${onto} with a crackling roar.`,
    ],
    restoration: [
      `You channel the healing arts, weaving ${spell.name} through your body with golden light.`,
      `A warm radiance flows from your palms as ${spell.name} takes hold.`,
    ],
    illusion: [
      `Your mind reaches out and shapes perception — ${spell.name}${onto} bends reality subtly.`,
      `The veil between will and world thins as you cast ${spell.name}${onto}.`,
    ],
    conjuration: [
      `You speak words from Shalidor's Insights and tear the veil — ${spell.name} answers the call.`,
      `The Oblivion plane shivers as ${spell.name} tears a rift in space.`,
    ],
    ward: [
      `You ${skill} raise your ${spell.name}, a pale blue shell of compressed magicka crackling to life.`,
      `${spell.name} solidifies around you like hardened will.`,
    ],
    hex: [
      `Forbidden syllables pass your lips as you work ${spell.name}${onto}. Daedric influence is unmistakable.`,
      `You weave ${spell.name}${onto} with fingers that tingle of dark magic.`,
    ],
  };

  const pick = lines[spell.school];
  let narrative = pick[Math.floor(rng() * pick.length)];

  if (corruption >= 70) {
    narrative += ''The corruption seeps through the weave, making the spell feel wrong — too easy.';
  }

  return narrative;
}

function buildLearnNarrative(spell: SpellData, source: string, success: boolean): string {
  if (success) {
    const learned: Record<string, string> = {
      tome:
        `After hours with the tome, the sigils of ${spell.name} finally resolve in your mind. You have learned ${spell.name}.`,
      teacher:
        `Your instructor guides your hands through the motions. The pattern of ${spell.name} settles into memory.`,
      practice:
        `Through stubborn repetition and singed eyebrows, you have grasped ${spell.name} through sheer practice.`,
    };
    return learned[source] ?? `You have learned ${spell.name}.`;
  }
  const failed: Record<string, string> = {
    tome:
      `The sigils of ${spell.name} remain frustratingly unclear. You need a stronger ${spell.school} foundation.`,
    teacher:
      `Your instructor demonstrates ${spell.name} again, but the pattern eludes you for now.`,
    practice:
      `Your attempt to self-teach ${spell.name} fizzles. But you feel a fraction closer to understanding.`,
  };
  return failed[source] ?? `You fail to learn ${spell.name} this time.`;
}

function enchantmentName(type: EnchantmentType, school: SpellSchool): string {
  const table: Record<SpellSchool, Record<EnchantmentType, string>> = {
    restoration: { blessing: 'Blessing of Mara',       curse: 'Affliction of Weakness'' },
    destruction: { blessing: 'Spark of Destruction',   curse: 'Curse of Flame''         },
    illusion:    { blessing: 'Shroud of Calm',          curse: 'Hex of Madness''         },
    conjuration: { blessing: 'Daedric Ward',            curse: 'Soul Hunger''            },
    ward:        { blessing: 'Aura of Protection',      curse: 'Curse of Fragility''     },
    hex:         { blessing: 'Daedric Empowerment',     curse: 'Daedric Blight''         },
  };
  return table[school][type];
}

function enchantmentStatEffectsTable(
  school: SpellSchool,
  potency: number,
): Partial<Record<'health''| 'stamina''| 'willpower''| 'corruption''| 'stress''| 'luck', number>> {
  const base = Math.max(1, Math.floor(potency / 10));
  const table: Record<
    SpellSchool,
    Partial<Record<'health''| 'stamina''| 'willpower''| 'corruption''| 'stress''| 'luck', number>>
  > = {
    restoration: { health: base * 3, stamina: base },
    destruction: { stamina: base * 2, willpower: base },
    illusion:    { stress: base * 2, willpower: base },
    conjuration: { willpower: base, corruption: base },
    ward:        { health: base, stamina: base, willpower: base },
    hex:         { corruption: base * 2, stress: base },
  };
  return table[school];
}
