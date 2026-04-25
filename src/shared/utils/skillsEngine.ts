/**
 * skillsEngine.ts — game-layer bridge for the skills / perk system.
 *
 * Wraps SkillsSystem (pure sim) and extends it with:
 *   - TES-style extended skill list (lockpicking, alchemy, smithing, enchanting, …)
 *   - TES skill tiers: Novice / Apprentice / Journeyman / Expert / Master
 *   - Simplified perk trees: 3 perks per skill at levels 25 / 50 / 75
 *   - Training methods: practice / trainer / book / quest
 *   - Skill decay for hardcore mode
 *   - Trainer discovery via sim_world NPC jobs
 *
 * @see src/sim/SkillsSystem.ts  — underlying gain/check engine
 * @see src/sim/types.ts         — NpcSkills, SkillKey
 */

import {
  improveSkill,
  skillCheck,
  skillLevelLabel,
  defaultSkills,
  overallCompetence,
} from '../sim/SkillsSystem';
import { NpcSkills, SkillKey } from '../../features/simulation/systems/types';
import { GameState } from '../../core/types';
import { StatKey } from '../../core/types';

// ── Extended skill keys ───────────────────────────────────────────────────────

/** Skills present in NpcSkills (sim layer). */
export type NpcSkillKey = SkillKey;

/** TES-style extended skills added at the engine layer. */
export type ExtendedSkillKey =
  | 'lockpicking'
  | 'alchemy'
  | 'smithing'
  | 'enchanting'
  | 'speech'
  | 'stealth'
  | 'archery'
  | 'one_handed'
  | 'two_handed'
  | 'block'
  | 'heavy_armor'
  | 'light_armor'
  | 'restoration'
  | 'destruction'
  | 'conjuration'
  | 'illusion'
  | 'alteration';

/** Union of all skill keys (NPC base + TES extended). */
export type AllSkillKey = NpcSkillKey | ExtendedSkillKey;

/** Full skill bag for a player or extended NPC. */
export type SkillBag = Record<AllSkillKey, number>;

/** Create a zeroed SkillBag with all fields. */
export function defaultSkillBag(): SkillBag {
  return {
    // NPC base skills
    ...defaultSkills(),
    // TES extended skills
    lockpicking: 0,
    alchemy: 0,
    smithing: 0,
    enchanting: 0,
    speech: 0,
    stealth: 0,
    archery: 0,
    one_handed: 0,
    two_handed: 0,
    block: 0,
    heavy_armor: 0,
    light_armor: 0,
    restoration: 0,
    destruction: 0,
    conjuration: 0,
    illusion: 0,
    alteration: 0,
  };
}

// ── Skill tiers ───────────────────────────────────────────────────────────────

export type SkillTier = 'Novice''| 'Apprentice''| 'Journeyman''| 'Expert''| 'Master';

const TIER_THRESHOLDS: { tier: SkillTier; min: number }[] = [
  { tier: 'Master',      min: 80 },
  { tier: 'Expert',      min: 60 },
  { tier: 'Journeyman',  min: 40 },
  { tier: 'Apprentice',  min: 20 },
  { tier: 'Novice',      min: 0 },
];

// ── Perk trees ────────────────────────────────────────────────────────────────

export interface PerkDefinition {
  id: string;
  skill: AllSkillKey;
  name: string;
  level_required: number;     / 25, 50, or 75
  description: string;
  stat_bonus?: Partial<Record<StatKey, number>>;
  skill_bonus?: Partial<Record<AllSkillKey, number>>;
}

/** Generates three perk definitions for a skill at levels 25 / 50 / 75. */
function makePerks(
  skill: AllSkillKey,
  names: [string, string, string],
  descs: [string, string, string],
  bonuses?: [
    Partial<Record<StatKey, number>>,
    Partial<Record<StatKey, number>>,
    Partial<Record<StatKey, number>>,
  ],
): PerkDefinition[] {
  return [25, 50, 75].map((lvl, i) => ({
    id: `perk_${skill}_${lvl}`,
    skill,
    name: names[i],
    level_required: lvl,
    description: descs[i],
    stat_bonus: bonuses?.[i],
  }));
}

export const PERK_TREES: Record<AllSkillKey, PerkDefinition[]> = {
  // ── NPC base skills ──────────────────────────────────────────────────────
  athletics: makePerks('athletics',
    ['Fleet-Footed','Runner\'s High','Tireless'],
    ['Move 10% faster when lightly encumbered.','Stamina costs for running reduced.','Ignore exhaustion penalties during extended exertion.'],
    [{ stamina: 5 }, { stamina: 10 }, { stamina: 15 }],
  ),
  swimming: makePerks('swimming',
    ['Buoyant','Strong Swimmer','Waterbreathing Affinity'],
    ['No stamina cost for basic swimming.','Swim at full speed while armored.','Can hold breath for twice as long.'],
  ),
  dancing: makePerks('dancing',
    ['Graceful Step','Captivating Rhythm','Stage Presence'],
    ['Allure +5 while performing.','Audience charm checks automatically succeed.','Performance earns double income.'],
    [{ allure: 5 }, { allure: 10 }, { allure: 15 }],
  ),
  skulduggery: makePerks('skulduggery',
    ['Light Fingers','Guild Contacts','Shadow Tongue'],
    ['Pickpocket detection reduced.','Access to fence networks.','Persuasion auto-succeeds with criminals.'],
  ),
  seduction: makePerks('seduction',
    ['Disarming Smile','Honeyed Words','Irresistible'],
    ['First impression checks always pass.','Persuasion of attracted targets is easier.','Can seduce characters regardless of inclination.'],
    [{ allure: 3 }, { allure: 6 }, { allure: 10 }],
  ),
  housekeeping: makePerks('housekeeping',
    ['Neat Hand','Efficient','Immaculate'],
    ['Hygiene bonuses last longer.','Work tasks complete in half the time.','Living quarters grant stress recovery bonus.'],
    [{ hygiene: 3 }, { hygiene: 6 }, { stress: -5 }],
  ),
  combat: makePerks('combat',
    ['Warrior\'s Instinct','Battle Hardened','Killing Blow'],
    ['Initiative bonus in combat.','Reduced damage taken when below 50% health.','Attacks below 25% enemy health deal double damage.'],
    [{ health: 5 }, { health: 10 }, { health: 15 }],
  ),
  // ── TES extended skills ──────────────────────────────────────────────────
  lockpicking: makePerks('lockpicking',
    ['Nimble Fingers','Lock Sense','Skeleton Key Mind'],
    ['Apprentice locks open with fewer picks.','Can detect lock quality before engaging.','Master locks no longer break picks.'],
  ),
  alchemy: makePerks('alchemy',
    ['Herbalist','Potent Mixtures','Poisoner'],
    ['Harvest double ingredients.','Potions last 25% longer.','Poisons bypass target resistances.'],
    [undefined, { health: 5 }, undefined],
  ),
  smithing: makePerks('smithing',
    ['Journeyman Smith','Arcane Blacksmith','Master Artisan'],
    ['Can temper weapons to Fine quality.','Can improve enchanted items.','Items degrade at half the normal rate.'],
  ),
  enchanting: makePerks('enchanting',
    ['Soul Siphon','Insightful Enchanter','Corpus Enchanter'],
    ['Kills recharge equipped enchantments.','Skill enchantments are 25% more effective.','Body enchantments last indefinitely.'],
    [{ willpower: 3 }, { willpower: 6 }, { willpower: 10 }],
  ),
  speech: makePerks('speech',
    ['Persuasive','Merchant Friend','Master Orator'],
    ['Prices 10% better when trading.','Bribes always accepted.','Can incite riots or calm hostilities.'],
  ),
  stealth: makePerks('stealth',
    ['Muffled Movement','Shadow Warrior','Silence'],
    ['Moving in armor does not incur noise.','Entering combat from sneak deals +30% damage.','Can sneak at run speed without penalty.'],
  ),
  archery: makePerks('archery',
    ['Eagle Eye','Power Shot','Ranger'],
    ['Hold breath for better aim.','Stagger chance on power attacks.','Can move at full speed while firing.'],
  ),
  one_handed: makePerks('one_handed',
    ['Armsman','Bladesman','Fighting Stance'],
    ['One-handed weapons do 20% more damage.','Extra bleeding damage.','Power attacks cost 25% less stamina.'],
    [undefined, undefined, { stamina: 5 }],
  ),
  two_handed: makePerks('two_handed',
    ['Barbarian','Champion\'s Stance','Great Critical Charge'],
    ['Two-handed weapons do 20% more damage.','Power attacks cost 25% less stamina.','Power attack while sprinting knocks targets down.'],
  ),
  block: makePerks('block',
    ['Shield Wall','Power Bash','Deflect Arrows'],
    ['Blocking effectiveness increased.','Bash deals twice as much damage.','Arrows are deflected when blocking.'],
    [{ health: 3 }, undefined, undefined],
  ),
  heavy_armor: makePerks('heavy_armor',
    ['Juggernaut','Well Fitted','Tower of Strength'],
    ['Armor rating improved.','No movement penalty in heavy armor.','Reduce incoming stagger chance.'],
    [{ health: 5 }, { health: 8 }, { health: 12 }],
  ),
  light_armor: makePerks('light_armor',
    ['Agile Defender','Custom Fit','Wind Walker'],
    ['Light armor rating improved.','Full set bonus: stamina regen improved.','Stamina regenerates even in combat.'],
    [undefined, { stamina: 5 }, { stamina: 10 }],
  ),
  restoration: makePerks('restoration',
    ['Novice Restoration','Respite','Recovery'],
    ['Healing spells cost 25% less.','Healing spells also restore stamina.','Magicka regenerates 25% faster.'],
    [{ health: 5 }, { health: 8, stamina: 5 }, { willpower: 5 }],
  ),
  destruction: makePerks('destruction',
    ['Novice Destruction','Augmented Flames','Disintegrate'],
    ['Destruction spells cost 25% less.','Fire spells do 25% more damage.','Enemies below 15% health disintegrate.'],
    [undefined, undefined, undefined],
  ),
  conjuration: makePerks('conjuration',
    ['Novice Conjuration','Extended Binding','Summoner'],
    ['Conjuration spells cost 25% less.','Bound weapons last 2× as long.','Can summon two atronachs simultaneously.'],
  ),
  illusion: makePerks('illusion',
    ['Novice Illusion','Animage','Kindred Mage'],
    ['Illusion spells cost 25% less.','Illusions work on animals.','Illusions work on higher-level targets.'],
    [{ willpower: 3 }, { willpower: 5 }, { willpower: 8 }],
  ),
  alteration: makePerks('alteration',
    ['Novice Alteration','Magic Resistance','Mage Armor'],
    ['Alteration spells cost 25% less.','+10% magic resistance.','Flesh spells provide better protection.'],
    [undefined, { willpower: 5 }, { willpower: 10 }],
  ),
};

// ── getSkillLevel ──────────────────────────────────────────────────────────────

export interface SkillLevelResult {
  value: number;
  tier: SkillTier;
  label: string;        / e.g. "Combat (Journeyman — 45)"
  progress_to_next: number; // 0-1 progress within current tier
}

/**
 * Get the current level of a skill with TES tier label.
 */
export function getSkillLevel(bag: SkillBag, skill: AllSkillKey): SkillLevelResult {
  const value = Math.max(0, Math.min(100, bag[skill] ?? 0));

  const tier = TIER_THRESHOLDS.find(t => value >= t.min)?.tier ?? 'Novice';
  const tierMin = TIER_THRESHOLDS.find(t => t.tier === tier)!.min;
  const nextTierMin = tier === 'Master''? 100 : (TIER_THRESHOLDS[TIER_THRESHOLDS.findIndex(t => t.tier === tier) - 1]?.min ?? 100);

  const progress_to_next = tier === 'Master''? 1 : (value - tierMin) // (nextTierMin - tierMin);

  const label = `${skill.replace(/_/g, '')} (${tier} — ${Math.floor(value)})`;

  return { value, tier, label, progress_to_next };
}

// ── resolveSkillCheck ──────────────────────────────────────────────────────────

export type SkillCheckOutcome = 'critical_success''| 'success''| 'failure''| 'critical_failure';

export interface SkillCheckResult {
  outcome: SkillCheckOutcome;
  roll: number;
  effective_skill: number;
  narrative: string;
}

/**
 * Resolve a skill check with success/fail/critical outcomes.
 *
 * @param bag        - Current skill bag
 * @param skill      - Skill being checked
 * @param difficulty - 0-100 target number (higher = harder)
 * @param rng        - Injectable random function
 */
export function resolveSkillCheck(
  bag: SkillBag,
  skill: AllSkillKey,
  difficulty: number,
  rng: () => number = Math.random,
): SkillCheckResult {
  const effective_skill = bag[skill] ?? 0;
  const roll = Math.floor(rng() * 100) + 1; // 1-100

  const threshold = effective_skill - difficulty;
  const critRange = Math.max(3, Math.floor(effective_skill / 10));

  let outcome: SkillCheckOutcome;
  if (roll <= critRange && threshold > 0) {
    outcome = 'critical_success';
  } else if (roll <= 3) {
    outcome = 'critical_failure';
  } else if (roll < threshold) {
    outcome = 'success';
  } else {
    outcome = 'failure';
  }

  const narratives: Record<SkillCheckOutcome, string[]> = {
    critical_success: [
      `A flawless execution. Your ${skill.replace(/_/g, '')} exceeds all expectations.`,
      `Fortune smiles. The task is accomplished with exceptional skill.`,
    ],
    success: [
      `You succeed. Your training in ${skill.replace(/_/g, '')} carries you through.`,
      `The check passes. Not elegant, but effective.`,
    ],
    failure: [
      `You fall short. Your ${skill.replace(/_/g, '')} was not enough today.`,
      `The task defeats you — for now.`,
    ],
    critical_failure: [
      `A catastrophic failure. Things go badly wrong.`,
      `Your hand slips. Everything that could go wrong does.`,
    ],
  };

  const pool = narratives[outcome];
  const narrative = pool[Math.floor(rng() * pool.length)];

  return { outcome, roll, effective_skill, narrative };
}

// ── resolveSkillTraining ──────────────────────────────────────────────────────

export type TrainingMethod = 'practice''| 'trainer''| 'book''| 'quest';

export interface SkillTrainingResult {
  skill_bag: SkillBag;
  xp_gained: number;
  new_value: number;
  tier_up: boolean;
  new_tier: SkillTier | null;
  narrative: string;
}

// Base XP rates per hour by method
const TRAINING_XP_RATES: Record<TrainingMethod, number> = {
  practice: 0.5,
  trainer:  1.2,
  book:     0.8,
  quest:    2.0,
};

/**
 * Resolve skill training with diminishing returns.
 *
 * @param bag    - Current skill bag
 * @param skill  - Skill being trained
 * @param method - How the character is training
 * @param hours  - Time invested in training
 * @param rng    - Injectable random (adds ±20% variance)
 */
export function resolveSkillTraining(
  bag: SkillBag,
  skill: AllSkillKey,
  method: TrainingMethod,
  hours: number,
  rng: () => number = Math.random,
): SkillTrainingResult {
  const current = bag[skill] ?? 0;
  const oldTier = getSkillLevel(bag, skill).tier;

  const baseRate = TRAINING_XP_RATES[method];
  const variance = 0.8 + rng() * 0.4; // 80%-120% variance

  // Diminishing returns: logarithmic decay as skill increases
  const diminishing = 1 - current / 110;

  const xp_gained = Math.max(0.01, baseRate * hours * variance * diminishing);

  // Build updated NpcSkills if the skill exists in base NpcSkills, otherwise handle extended
  let updated_bag: SkillBag;
  const BASE_SKILLS: NpcSkillKey[] = ['athletics','swimming','dancing','skulduggery','seduction','housekeeping','combat'];

  if (BASE_SKILLS.includes(skill as NpcSkillKey)) {
    const npcSkills: NpcSkills = {
      athletics:    bag.athletics,
      swimming:     bag.swimming,
      dancing:      bag.dancing,
      skulduggery:  bag.skulduggery,
      seduction:    bag.seduction,
      housekeeping: bag.housekeeping,
      combat:       bag.combat,
    };
    const improved = improveSkill(npcSkills, skill as NpcSkillKey, xp_gained);
    updated_bag = { ...bag, ...improved };
  } else {
    const newVal = Math.min(100, Math.max(0, current + xp_gained));
    updated_bag = { ...bag, [skill]: newVal };
  }

  const newTierResult = getSkillLevel(updated_bag, skill);
  const tier_up = newTierResult.tier !== oldTier;

  const methodNarratives: Record<TrainingMethod, string[]> = {
    practice: [
      `Repetition carves new pathways. Your ${skill.replace(/_/g, '')} improves through effort.`,
      `Hours of practice yield slow but steady improvement.`,
    ],
    trainer: [
      `Your trainer pushes you hard. The lessons sting but stick.`,
      `Under expert guidance, your ${skill.replace(/_/g, '')} advances rapidly.`,
    ],
    book: [
      `Theory and practise merge. The text illuminates what muscle memory obscured.`,
      `The tome's secrets sink in. Your understanding deepens.`,
    ],
    quest: [
      `Trial by fire. The hardship has forged new capability.`,
      `Experience is the greatest teacher. The quest leaves its mark on your skills.`,
    ],
  };

  const pool = methodNarratives[method];
  const base_narrative = pool[Math.floor(rng() * pool.length)];
  const narrative = tier_up
    ? `${base_narrative} You have reached ${newTierResult.tier} rank!`
    : base_narrative;

  return {
    skill_bag: updated_bag,
    xp_gained,
    new_value: updated_bag[skill],
    tier_up,
    new_tier: tier_up ? newTierResult.tier : null,
    narrative,
  };
}

// ── resolveSkillDecay ──────────────────────────────────────────────────────────

export interface SkillDecayResult {
  skill_bag: SkillBag;
  decayed_skills: Array<{ skill: AllSkillKey; lost: number }>;
  narrative: string | null;
}

/**
 * Hardcore mode: unused skills slowly decay over time.
 * Skills below 20 are immune to decay (prevents complete loss of novice training).
 *
 * @param bag               - Current skill bag
 * @param days_since_use    - Map of skill → days since last practiced
 * @param decay_per_day     - Base decay rate (default 0.05 per day)
 */
export function resolveSkillDecay(
  bag: SkillBag,
  days_since_use: Partial<Record<AllSkillKey, number>>,
  decay_per_day: number = 0.05,
): SkillDecayResult {
  const decayed_skills: Array<{ skill: AllSkillKey; lost: number }> = [];
  let updated_bag = { ...bag };

  for (const [s, days] of Object.entries(days_since_use) as [AllSkillKey, number][]) {
    const current = bag[s] ?? 0;
    if (current <= 20) continue; // floor: novice training never decays fully

    const threshold = 14; // decay starts after 2 weeks of disuse
    if (days <= threshold) continue;

    const lost = Math.min(current - 20, decay_per_day * (days - threshold));
    if (lost > 0) {
      updated_bag = { ...updated_bag, [s]: current - lost };
      decayed_skills.push({ skill: s, lost });
    }
  }

  const narrative =
    decayed_skills.length > 0
      ? `Skills rust without practice: ${decayed_skills.map(d => d.skill.replace(/_/g, '')).join('',')}.`
      : null;

  return { skill_bag: updated_bag, decayed_skills, narrative };
}

// ── resolveSkillUnlock ────────────────────────────────────────────────────────

export interface SkillUnlockResult {
  unlocked: boolean;
  perk: PerkDefinition | null;
  narrative: string;
}

/**
 * Check if a specific perk can be unlocked at the current skill level.
 *
 * @param bag    - Current skill bag
 * @param skill  - Skill tree to check
 * @param perkId - Specific perk ID to attempt unlocking
 */
export function resolveSkillUnlock(
  bag: SkillBag,
  skill: AllSkillKey,
  perkId: string,
): SkillUnlockResult {
  const perks = PERK_TREES[skill] ?? [];
  const perk = perks.find(p => p.id === perkId);

  if (!perk) {
    return { unlocked: false, perk: null, narrative: `No perk found with ID "${perkId}".` };
  }

  const currentValue = bag[skill] ?? 0;
  if (currentValue < perk.level_required) {
    return {
      unlocked: false,
      perk,
      narrative: `${perk.name} requires ${skill.replace(/_/g, '')} level ${perk.level_required}. You are at ${Math.floor(currentValue)}.`,
    };
  }

  return {
    unlocked: true,
    perk,
    narrative: `${perk.name} unlocked: ${perk.description}`,
  };
}

/** Get all unlockable perks for a skill given current level. */
export function getUnlockablePerks(bag: SkillBag, skill: AllSkillKey): PerkDefinition[] {
  const perks = PERK_TREES[skill] ?? [];
  const currentValue = bag[skill] ?? 0;
  return perks.filter(p => currentValue >= p.level_required);
}

// ── getAvailableTrainers ──────────────────────────────────────────────────────

export interface TrainerInfo {
  npc_id: string;
  npc_name: string;
  skill: AllSkillKey;
  max_level: number;    / trainer can only teach up to this level
  cost_per_session: number;
  location_id: string;
}

/** Job → skills that NPC can train, plus trainer tier */
const JOB_TRAINER_MAP: Record<string, Array<{ skill: AllSkillKey; max_level: number }>> = {
  guard:      [{ skill: 'combat', max_level: 70 }, { skill: 'block', max_level: 60 }, { skill: 'heavy_armor', max_level: 60 }],
  thief:      [{ skill: 'skulduggery', max_level: 75 }, { skill: 'stealth', max_level: 70 }, { skill: 'lockpicking', max_level: 65 }],
  innkeeper:  [{ skill: 'speech', max_level: 60 }, { skill: 'seduction', max_level: 55 }],
  merchant:   [{ skill: 'speech', max_level: 70 }, { skill: 'alchemy', max_level: 50 }],
  healer:     [{ skill: 'restoration', max_level: 75 }, { skill: 'alchemy', max_level: 65 }],
  farmer:     [{ skill: 'athletics', max_level: 50 }, { skill: 'housekeeping', max_level: 45 }],
  laborer:    [{ skill: 'athletics', max_level: 55 }, { skill: 'smithing', max_level: 40 }],
  scholar:    [{ skill: 'enchanting', max_level: 75 }, { skill: 'alteration', max_level: 70 }, { skill: 'destruction', max_level: 65 }],
  none:       [],
};

/**
 * Find NPCs at the player's current location who can train the given skill.
 *
 * @param state - Full GameState (reads sim_world.npcs and world.current_location)
 * @param skill - Skill to find a trainer for
 */
export function getAvailableTrainers(state: GameState, skill: AllSkillKey): TrainerInfo[] {
  if (!state.sim_world) return [];

  const currentLocation = state.world.current_location;
  const locationId = currentLocation?.id ?? 'unknown';

  // Get NPCs present at the current location
  const localNpcs = state.sim_world.npcs.filter(
    npc => npc.location_id === locationId,
  );

  const trainers: TrainerInfo[] = [];

  for (const npc of localNpcs) {
    const trainerSkills = JOB_TRAINER_MAP[npc.job] ?? [];
    const match = trainerSkills.find(t => t.skill === skill);
    if (!match) continue;

    // Cost scales with trainer tier and session (base 10-100 gold)
    const cost_per_session = Math.floor(10 + (match.max_level / 100) * 90);

    trainers.push({
      npc_id: npc.id,
      npc_name: npc.name,
      skill,
      max_level: match.max_level,
      cost_per_session,
      location_id: locationId,
    });
  }

  return trainers;
}

// ── Convenience: extract player SkillBag from GameState ──────────────────────

/**
 * Build a full SkillBag from the player's skills in GameState.
 * Maps the player's native skill keys to SkillBag, zeroing extended skills.
 */
export function playerSkillBag(state: GameState): SkillBag {
  const p = state.player.skills;
  return {
    // Map GameState player skills to SkillBag
    athletics:    p.athletics,
    swimming:     p.swimming,
    dancing:      p.dancing,
    skulduggery:  p.skulduggery,
    seduction:    p.seduction,
    housekeeping: p.housekeeping,
    combat:       0,
    // Extended skills — zeroed unless stored elsewhere
    lockpicking:  0,
    alchemy:      0,
    smithing:     0,
    enchanting:   0,
    speech:       0,
    stealth:      0,
    archery:      0,
    one_handed:   0,
    two_handed:   0,
    block:        0,
    heavy_armor:  0,
    light_armor:  0,
    restoration:  0,
    destruction:  0,
    conjuration:  0,
    illusion:     0,
    alteration:   0,
  };
}
