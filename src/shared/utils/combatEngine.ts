/**
 * combatEngine.ts — Full turn-based combat bridge for the Elder Scrolls life sim.
 *
 * Game-layer bridge over CombatSystem (pure sim). Provides:
 *   - initiateCombat       — start a combat encounter
 *   - resolveCombatTurn    — process one full turn (9 player actions)
 *   - resolveWeaponAttack  — weapon damage with tier / type tables
 *   - resolveBlock         — shield / parry mechanics
 *   - resolveFleeAttempt   — athletics + encumbrance + terrain
 *   - resolveCombatEnd     — loot drops, XP, stat rewards
 *   - calculateDamage      — core damage formula with armor DR
 *   - getCombatStatus      — HP bars, stamina, stance, active effects
 *
 * All functions are pure (no side effects). RNG is injected for deterministic tests.
 *
 * @see src/sim/CombatSystem.ts — underlying stance / turn engine
 * @see src/utils/encounterEngine.ts — general encounter bridge
 */

import { GameState, StatKey } from '../../core/types';
import { CombatFeedback } from './encounterEngine';
import { CombatStance } from '../../features/simulation/systems/types';
import {
  selectAIStance,
  resolveCombatTurn as simResolveCombatTurn,
} from '../sim/CombatSystem';
import { partyCombatBonus } from '../../features/simulation/systems/CompanionSystem';
import { CompanionState } from '../../features/simulation/systems/types';

// ── Public types ──────────────────────────────────────────────────────────────

export type WeaponType = 'dagger''| 'sword''| 'mace''| 'greatsword''| 'bow';
export type WeaponTier = 'iron''| 'steel''| 'elven''| 'ebony''| 'daedric';
export type ArmorType =
  | 'none'
  | 'hide'
  | 'leather'
  | 'iron'
  | 'steel'
  | 'elven'
  | 'ebony'
  | 'daedric'
  | 'dragonbone';
export type ShieldTier = 'none''| 'wood''| 'iron''| 'steel''| 'ebony';
export type CombatAction =
  | 'attack'
  | 'power_attack'
  | 'block'
  | 'dodge'
  | 'flee'
  | 'cast_spell'
  | 'use_item'
  | 'intimidate'
  | 'surrender';
export type CombatOutcome = 'victory''| 'defeat''| 'flee''| 'surrender';

export interface LootItem {
  id: string;
  name: string;
  value: number;
  weight: number;
  type: 'weapon''| 'armor''| 'consumable''| 'misc';
}

export interface WeaponStats {
  base_damage: number;
  /** Attacks per turn (higher = faster / more hits) */
  speed: number;
  /** 0-1, 1 = fully ranged */
  reach: number;
  /** Flat DR that is ignored (mace speciality) */
  armor_pierce: number;
  is_two_handed: boolean;
}

export interface ArmorStats {
  damage_reduction: number;
  is_heavy: boolean;
  /** 0-1 fraction of movement effectiveness lost */
  movement_penalty: number;
}

export interface CombatStatus {
  player_health: number;
  player_max_health: number;
  player_stamina: number;
  player_max_stamina: number;
  player_stance: CombatStance;
  enemy_health: number;
  enemy_max_health: number;
  enemy_name: string;
  active_effects: string[];
  turn: number;
  companion_bonus: number;
}

/** Return value from all game-layer combat resolvers. */
export interface CombatResult {
  narrative: string;
  stat_deltas: Partial<Record<StatKey, number>>;
  skill_deltas: Partial<Record<string, number>>;
  /** Partial update merged into ActiveEncounter. */
  encounterUpdates: Record<string, unknown>;
  endEncounter: boolean;
  loot: LootItem[];
  combatFeedback: CombatFeedback;
}

export interface CombatEndResult {
  narrative: string;
  stat_deltas: Partial<Record<StatKey, number>>;
  skill_deltas: Partial<Record<string, number>>;
  loot: LootItem[];
  xp_reward: number;
  fame_delta: number;
}

export interface AttackerInfo {
  combat_skill: number;
  stamina: number;
  stance: CombatStance;
}

export interface DefenderInfo {
  combat_skill: number;
  health: number;
  stamina: number;
  stance: CombatStance;
  armor: ArmorType;
}

export interface WeaponAttackResult {
  damage: number;
  hit: boolean;
  critical: boolean;
  narrative: string;
  stamina_cost: number;
}

export interface BlockResult {
  damage_absorbed: number;
  remaining_damage: number;
  narrative: string;
  stamina_cost: number;
}

export interface FleeResult {
  success: boolean;
  narrative: string;
  stat_deltas: Partial<Record<StatKey, number>>;
}

// ── Weapon data tables ────────────────────────────────────────────────────────

/** Per-type base stats. Speed multiplies effective damage. */
export const WEAPON_STATS: Record<WeaponType, WeaponStats> = {
  dagger:     { base_damage: 5,  speed: 1.8, reach: 0.1, armor_pierce: 3,  is_two_handed: false },
  sword:      { base_damage: 12, speed: 1.0, reach: 0.2, armor_pierce: 0,  is_two_handed: false },
  mace:       { base_damage: 15, speed: 0.7, reach: 0.1, armor_pierce: 8,  is_two_handed: false },
  greatsword: { base_damage: 22, speed: 0.5, reach: 0.3, armor_pierce: 2,  is_two_handed: true  },
  bow:        { base_damage: 14, speed: 1.2, reach: 1.0, armor_pierce: 0,  is_two_handed: true  },
};

/** Tier damage multipliers — governs material quality. */
export const WEAPON_TIER_MULT: Record<WeaponTier, number> = {
  iron:    1.0,
  steel:   1.2,
  elven:   1.5,
  ebony:   1.8,
  daedric: 2.2,
};

/** Display names for every weapon type × tier combination. */
export const WEAPON_TIER_NAMES: Record<WeaponType, Record<WeaponTier, string>> = {
  dagger: {
    iron: 'Iron Dagger', steel: 'Steel Dagger', elven: 'Elven Dagger',
    ebony: 'Ebony Dagger', daedric: 'Daedric Dagger',
  },
  sword: {
    iron: 'Iron Sword', steel: 'Steel Sword', elven: 'Elven Sword',
    ebony: 'Ebony Sword', daedric: 'Daedric Sword',
  },
  mace: {
    iron: 'Iron Mace', steel: 'Steel Mace', elven: 'Elven Mace',
    ebony: 'Ebony Mace', daedric: 'Daedric Mace',
  },
  greatsword: {
    iron:    'Iron Greatsword',
    steel:   'Greatsword of the Covenant',
    elven:   'Elven Greatsword',
    ebony:   'Ebony Greatsword',
    daedric: 'Daedric Greatsword',
  },
  bow: {
    iron: 'Hunting Bow', steel: 'Steel Bow', elven: 'Elven Bow',
    ebony: 'Ebony Bow', daedric: 'Daedric Bow',
  },
};

// ── Armor data tables ─────────────────────────────────────────────────────────

/** Flat damage reduction and weight class per armor type. */
export const ARMOR_STATS: Record<ArmorType, ArmorStats> = {
  none:       { damage_reduction: 0,  is_heavy: false, movement_penalty: 0    },
  hide:       { damage_reduction: 3,  is_heavy: false, movement_penalty: 0    },
  leather:    { damage_reduction: 5,  is_heavy: false, movement_penalty: 0    },
  iron:       { damage_reduction: 8,  is_heavy: true,  movement_penalty: 0.10 },
  steel:      { damage_reduction: 12, is_heavy: true,  movement_penalty: 0.15 },
  elven:      { damage_reduction: 16, is_heavy: false, movement_penalty: 0.05 },
  ebony:      { damage_reduction: 20, is_heavy: true,  movement_penalty: 0.20 },
  daedric:    { damage_reduction: 25, is_heavy: true,  movement_penalty: 0.25 },
  dragonbone: { damage_reduction: 30, is_heavy: true,  movement_penalty: 0.30 },
};

/** Block value provided by shield tier. */
export const SHIELD_BLOCK_VALUE: Record<ShieldTier, number> = {
  none:  0,
  wood:  8,
  iron:  14,
  steel: 20,
  ebony: 28,
};

// ── Stance modifier tables (mirrors CombatSystem but exposed for callers) ─────

export const STANCE_ATTACK_MOD: Record<CombatStance, number> = {
  aggressive: 1.5,
  defensive:  0.6,
  evasive:    0.4,
  neutral:    1.0,
  submissive: 0.2,
};

export const STANCE_DEFENSE_MOD: Record<CombatStance, number> = {
  aggressive: 0.7,
  defensive:  1.5,
  evasive:    1.0,
  neutral:    1.0,
  submissive: 0.5,
};

// ── Elder Scrolls flavor text ─────────────────────────────────────────────────

const ENEMY_ATTACK_BARKS = [
  'Die, milk drinker!',
  'Talos guide my blade!',
  'For glory and septims!',
  'By Sithis, you will bleed!',
  "I'll gut you where you stand!",
  "Kyne's breath gives me strength!",
  'Your blood will buy my mead tonight!',
  'Halt — in the name of the Jarl!',
  'Face me, coward!',
];

const ENEMY_HURT_BARKS = [
  'You fight well… for a whelp.',
  "You'll pay for that!",
  "Stendarr's mercy — that stings!",
  'A lucky blow. It will not happen again.',
  "You've got teeth, I'll grant you that.",
  'Divines, you are stronger than you look!',
];

const PLAYER_HIT_NARRATIVES = [
  'Pain flares across your side.',
  'Their blade finds a gap in your guard.',
  'A crushing blow rattles your bones.',
  'The impact sends you staggering backward.',
  'You bite down on a cry of pain.',
  'Stars dance before your eyes.',
];

// ── Private helpers ───────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Derive a rough combat skill from player skills. */
function getPlayerCombatSkill(state: GameState): number {
  return clamp((state.player.skills.athletics ?? 0) * 0.5 + 20, 0, 100);
}

function getPlayerAthletics(state: GameState): number {
  return state.player.skills.athletics ?? 0;
}

function castCompanionState(s: GameState): CompanionState {
  return s.player.companion_state as unknown as CompanionState;
}

// ── calculateDamage ───────────────────────────────────────────────────────────

/**
 * Core damage formula with armor DR, stance modifier, skill bonus, and RNG variance.
 * Mace armor-piercing is conveyed via a non-zero `armorPierce` argument.
 *
 * @param baseDamage     Raw weapon + tier damage before modifiers.
 * @param attackerSkill  0-100 combat skill of the attacker.
 * @param defenderArmor  Armor type worn by the defender.
 * @param stance         Attacker's current combat stance.
 * @param rng            Injected RNG (0..1).
 * @param armorPierce    Flat DR that is bypassed (default 0).
 * @returns              Final damage (always ≥ 1).
 */
export function calculateDamage(
  baseDamage: number,
  attackerSkill: number,
  defenderArmor: ArmorType,
  stance: CombatStance,
  rng: () => number,
  armorPierce = 0,
): number {
  const skillBonus   = attackerSkill * 0.15;
  const stanceMult   = STANCE_ATTACK_MOD[stance];
  const effectiveDR  = Math.max(0, ARMOR_STATS[defenderArmor].damage_reduction - armorPierce);
  const variance     = 0.8 + rng() * 0.4; // ±20 % variance
  const raw          = (baseDamage + skillBonus) * stanceMult * variance;
  return Math.max(1, Math.round(raw - effectiveDR));
}

// ── resolveWeaponAttack ───────────────────────────────────────────────────────

/**
 * Resolve a single weapon attack.
 *
 * Hit chance depends on attacker skill vs defender skill and stance.
 * Critical hits (5–15 % chance) deal 2× damage.
 * All five weapon types and all five tiers are handled via lookup tables.
 */
export function resolveWeaponAttack(
  attacker: AttackerInfo,
  defender: DefenderInfo,
  weaponType: WeaponType,
  weaponTier: WeaponTier,
  rng: () => number,
): WeaponAttackResult {
  const weapon     = WEAPON_STATS[weaponType];
  const tierMult   = WEAPON_TIER_MULT[weaponTier];
  const weaponName = WEAPON_TIER_NAMES[weaponType][weaponTier];

  // Hit chance: attacker skill vs defender's evasion
  const hitChance = clamp(
    0.55
    + (attacker.combat_skill / 100) * 0.35
    - (defender.combat_skill  / 100) * 0.20
    + STANCE_ATTACK_MOD[attacker.stance] * 0.05
    - STANCE_DEFENSE_MOD[defender.stance] * 0.05,
    0.10,
    0.95,
  );

  if (rng() > hitChance) {
    return {
      damage: 0,
      hit: false,
      critical: false,
      narrative: `Your ${weaponName} swings wide — the blow glances aside.`,
      stamina_cost: Math.round(weapon.speed * 5),
    };
  }

  // Critical hit
  const critChance = 0.05 + (attacker.combat_skill / 100) * 0.10;
  const critical   = rng() < critChance;
  const critMult   = critical ? 2.0 : 1.0;

  const rawBase = weapon.base_damage * tierMult * weapon.speed * critMult;
  const damage  = calculateDamage(
    rawBase,
    attacker.combat_skill,
    defender.armor,
    attacker.stance,
    rng,
    weapon.armor_pierce,
  );

  const stamina_cost = Math.round(weapon.speed * (weapon.is_two_handed ? 12 : 8));

  let narrative: string;
  if (critical) {
    narrative = `Critical! Your ${weaponName} strikes true, dealing ${damage} damage!`;
  } else if (damage > 20) {
    narrative = `Your ${weaponName} connects solidly for ${damage} damage.`;
  } else {
    narrative = `Your ${weaponName} grazes your foe for ${damage} damage.`;
  }

  return { damage, hit: true, critical, narrative, stamina_cost };
}

// ── resolveBlock ──────────────────────────────────────────────────────────────

/**
 * Resolve a block / parry attempt.
 *
 * Block effectiveness scales with shield tier, combat skill, defensive stance,
 * and current stamina (low stamina = weaker guard).
 */
export function resolveBlock(
  defender: DefenderInfo,
  incomingDamage: number,
  shieldTier: ShieldTier,
  rng: () => number,
): BlockResult {
  const baseBlock      = SHIELD_BLOCK_VALUE[shieldTier];
  const skillBonus     = defender.combat_skill * 0.2;
  const stanceMult     = STANCE_DEFENSE_MOD[defender.stance];
  const staminaMult    = clamp(defender.stamina / 100, 0.3, 1.0);
  const effectiveBlock = (baseBlock + skillBonus) * stanceMult * staminaMult;

  // Flat block chance (higher with shield)
  const blockChance = clamp(
    0.40
    + (defender.combat_skill / 100) * 0.40
    + (shieldTier !== 'none''? 0.20 : 0),
    0.05,
    0.95,
  );

  if (rng() > blockChance) {
    return {
      damage_absorbed: 0,
      remaining_damage: incomingDamage,
      narrative: 'Your guard is broken — the blow lands hard!',
      stamina_cost: 5,
    };
  }

  const absorbed        = Math.round(Math.min(incomingDamage, effectiveBlock * (0.7 + rng() * 0.6)));
  const remaining_damage = Math.max(0, incomingDamage - absorbed);
  const stamina_cost    = Math.round(absorbed * 0.3 + 3);

  let narrative: string;
  if (remaining_damage === 0) {
    narrative = shieldTier !== 'none'
      ? 'You raise your shield and deflect the blow completely!'
      : 'You parry with precision — the attack is turned aside!';
  } else {
    narrative = `You partially block the attack, absorbing ${absorbed} of ${incomingDamage} damage.`;
  }

  return { damage_absorbed: absorbed, remaining_damage, narrative, stamina_cost };
}

// ── resolveFleeAttempt ────────────────────────────────────────────────────────

/**
 * Resolve an attempt to escape combat.
 *
 * Probability factors:
 *   - Player athletics (primary driver)
 *   - Current stamina  (exhausted = slower)
 *   - Location danger  (high danger = hard terrain to flee through)
 *   - Encumbrance      (heavy inventory slows escape)
 *   - Active restraints (movement_penalty)
 */
export function resolveFleeAttempt(
  state: GameState,
  rng: () => number,
): FleeResult {
  const athletics        = getPlayerAthletics(state);
  const stamina          = state.player.stats.stamina;
  const restraintPenalty = state.player.restraints?.movement_penalty ?? 0;
  const terrainDanger    = state.world.current_location.danger ?? 0.5;

  // Total carried weight vs a soft cap of 100
  const totalWeight       = state.player.inventory.reduce((s, i) => s + (i.weight ?? 0), 0);
  const encumbrancePenalty = clamp(totalWeight / 100, 0, 0.5);

  const staminaMod = clamp(stamina / 100, 0.2, 1.0);
  const baseChance = (athletics / 100) * 0.50 + 0.25;
  const finalChance = clamp(
    baseChance
    * (1 - terrainDanger * 0.4)
    * staminaMod
    * (1 - restraintPenalty)
    - encumbrancePenalty,
    0.05,
    0.90,
  );

  if (rng() < finalChance) {
    return {
      success: true,
      narrative: athletics > 50
        ? 'With practiced agility you break away and vanish into the shadows!'
        : 'Lungs burning, you put enough distance between yourself and your attacker!',
      stat_deltas: { stamina: -20, stress: 5 },
    };
  }

  return {
    success: false,
    narrative: restraintPenalty > 0.5
      ? 'Your restraints make escape impossible — you are yanked back!'
      : 'You stumble in your attempt to flee — they are right behind you!',
    stat_deltas: {
      stamina: terrainDanger > 0.6 ? -25 : -15,
      stress:  10,
      pain:    5,
    },
  };
}

// ── initiateCombat ────────────────────────────────────────────────────────────

/**
 * Start a combat encounter with an enemy NPC.
 *
 * Looks up the NPC in `state.sim_world.npcs`; falls back to defaults
 * if not found. Sets initial stances, companion bonus, and combat log.
 */
export function initiateCombat(
  state: GameState,
  enemyNpcId: string,
  initiatedBy: 'player''| 'npc',
  rng: () => number,
): CombatResult {
  const enemy      = state.sim_world?.npcs.find(n => n.id === enemyNpcId);
  const enemyName  = enemy?.name ?? 'Hostile Stranger';
  const enemyHealth = enemy?.stats.health ?? 80;
  const enemyStance: CombatStance = initiatedBy === 'npc''? 'aggressive'': 'neutral';

  const companionBonus = partyCombatBonus(castCompanionState(state));

  const narrative = initiatedBy === 'npc'
    ? `${enemyName} lunges forward with murderous intent! "${pick(ENEMY_ATTACK_BARKS, rng)}"\nSteel yourself — combat has begun!`
    : `You draw your weapon and face ${enemyName}. They settle into a ${enemyStance} stance and raise their blade.`;

  // Minimal anatomy for the enemy (used if sprite renders)
  const defaultAnatomy = state.player.anatomy;

  return {
    narrative,
    stat_deltas: {},
    skill_deltas: {},
    encounterUpdates: {
      id:               `combat_${Date.now()}`,
      enemy_name:       enemyName,
      enemy_type:       enemy?.job ?? 'hostile',
      enemy_health:     enemyHealth,
      enemy_max_health: enemyHealth,
      enemy_lust:       0,
      enemy_max_lust:   100,
      enemy_anger:      initiatedBy === 'npc''? 60 : 30,
      enemy_max_anger:  100,
      player_stance:    'neutral''as const,
      turn:             0,
      log:              [narrative],
      debuffs:          [],
      targeted_part:    null,
      anatomy:          defaultAnatomy,
      // Extended combat fields
      enemy_stamina:      enemy?.stats.stamina ?? 80,
      enemy_combat_skill: enemy?.skills.combat  ?? 30,
      enemy_athletics:    enemy?.skills.athletics ?? 20,
      enemy_stance:       enemyStance,
      companion_bonus:    companionBonus,
      combat_initiated_by: initiatedBy,
    },
    endEncounter: false,
    loot: [],
    combatFeedback: {
      animation:       initiatedBy === 'npc''? 'attack'': 'block',
      showXRay:        false,
      highlightedPart: null,
    },
  };
}

// ── resolveCombatTurn ─────────────────────────────────────────────────────────

/**
 * Resolve one full combat turn given the player's chosen action.
 *
 * Actions:
 *   attack        — standard weapon strike
 *   power_attack  — high-cost, high-damage strike (costs 25 stamina)
 *   block         — raise guard (switches to defensive stance)
 *   dodge         — evasive footwork (switches to evasive stance)
 *   flee          — attempt to escape via resolveFleeAttempt
 *   cast_spell    — destruction spell if not overcharged
 *   use_item      — consume first healing item found in inventory
 *   intimidate    — attempt to rattle the enemy
 *   surrender     — end combat with surrender outcome
 *
 * Enemy always counter-attacks (AI stance via selectAIStance).
 * Companions contribute a flat combat bonus to player skill.
 */
export function resolveCombatTurn(
  state: GameState,
  playerAction: CombatAction,
  rng: () => number,
): CombatResult {
  const encounter = state.world.active_encounter;
  if (!encounter) return _emptyCombatResult();

  // ── Read current state values ──
  const playerCombatSkill = getPlayerCombatSkill(state);
  const playerStance      = (encounter.player_stance ?? 'neutral') as CombatStance;
  const playerHealth      = state.player.stats.health;
  const playerStamina     = state.player.stats.stamina;

  // Enemy extended fields (written by initiateCombat / previous turns)
  const ext                  = encounter as unknown as Record<string, unknown>;
  const enemyHealth          = encounter.enemy_health;
  const enemyStamina         = (ext.enemy_stamina         as number) ?? 60;
  const enemyCombatSkill     = (ext.enemy_combat_skill    as number) ?? 30;
  const enemyAthletics       = (ext.enemy_athletics       as number) ?? 20;
  const enemyStance          = (ext.enemy_stance          as CombatStance) ?? 'neutral';
  const companionBonus       = (ext.companion_bonus       as number) ?? 0;
  const effectivePlayerSkill = Math.min(100, playerCombatSkill + companionBonus * 0.5);

  const stat_deltas: Partial<Record<StatKey, number>> = {};
  const skill_deltas: Partial<Record<string, number>> = {};
  const encounterUpdates: Record<string, unknown>     = { turn: encounter.turn + 1 };
  const narrativeParts: string[] = [];
  let endEncounter = false;
  const loot: LootItem[] = [];
  let combatFeedback: CombatFeedback = { animation: 'attack', showXRay: false, highlightedPart: null };

  let newEnemyHealth  = enemyHealth;
  let newPlayerHealth = playerHealth;
  let newPlayerStamina = playerStamina;
  let newEnemyStamina  = enemyStamina;
  let newPlayerStance  = playerStance;

  // ── Default player weapon (iron sword unless inventory has better) ──
  const weaponItem = state.player.inventory.find(i => i.type === 'weapon''&& i.is_equipped);
  const playerWeaponType: WeaponType = 'sword';
  const playerWeaponTier: WeaponTier = 'iron';

  // ── Process player action ─────────────────────────────────────────────────

  if (playerAction === 'attack') {
    combatFeedback = { animation: 'attack', showXRay: false, highlightedPart: null };
    const atk = resolveWeaponAttack(
      { combat_skill: effectivePlayerSkill, stamina: playerStamina, stance: playerStance },
      { combat_skill: enemyCombatSkill, health: enemyHealth, stamina: enemyStamina, stance: enemyStance, armor: 'iron''},
      playerWeaponType,
      playerWeaponTier,
      rng,
    );
    newEnemyHealth    = Math.max(0, enemyHealth - atk.damage);
    newPlayerStamina  = Math.max(0, playerStamina - atk.stamina_cost);
    skill_deltas.athletics = 1;
    narrativeParts.push(atk.narrative);
    if (atk.critical) {
      combatFeedback = { animation: 'special_attack', showXRay: true, highlightedPart: 'ribs''};
    }
    if (!atk.hit && atk.damage === 0 && !atk.critical) {
      encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 5);
    }

  } else if (playerAction === 'power_attack') {
    combatFeedback = { animation: 'special_attack', showXRay: true, highlightedPart: 'ribs''};
    if (playerStamina < 25) {
      narrativeParts.push("You're too exhausted to launch a power attack!");
    } else {
      const atk = resolveWeaponAttack(
        { combat_skill: effectivePlayerSkill, stamina: playerStamina, stance: 'aggressive''},
        { combat_skill: enemyCombatSkill, health: enemyHealth, stamina: enemyStamina, stance: enemyStance, armor: 'iron''},
        playerWeaponType,
        playerWeaponTier,
        rng,
      );
      const powerDamage   = Math.round(atk.damage * 1.5);
      newEnemyHealth      = Math.max(0, enemyHealth - powerDamage);
      newPlayerStamina    = Math.max(0, playerStamina - 25);
      stat_deltas.stamina = -5;
      skill_deltas.athletics = 2;
      narrativeParts.push(
        `You pour every ounce of strength into a brutal power attack — ${powerDamage} damage!`,
      );
    }

  } else if (playerAction === 'block') {
    combatFeedback = { animation: 'block', showXRay: false, highlightedPart: null };
    newPlayerStance  = 'defensive';
    newPlayerStamina = Math.max(0, playerStamina - 5);
    narrativeParts.push('You plant your feet and raise your guard, bracing for the assault.');

  } else if (playerAction === 'dodge') {
    combatFeedback = { animation: 'dodge', showXRay: false, highlightedPart: null };
    newPlayerStance  = 'evasive';
    newPlayerStamina = Math.max(0, playerStamina - 10);
    narrativeParts.push('You shift your weight and begin moving with quick, evasive footwork.');

  } else if (playerAction === 'flee') {
    combatFeedback = { animation: 'dodge', showXRay: false, highlightedPart: null };
    const flee = resolveFleeAttempt(state, rng);
    narrativeParts.push(flee.narrative);
    for (const [k, v] of Object.entries(flee.stat_deltas)) {
      (stat_deltas as Record<string, number>)[k] = ((stat_deltas as Record<string, number>)[k] ?? 0) + v;
    }
    skill_deltas.athletics = 2;
    if (flee.success) endEncounter = true;

  } else if (playerAction === 'cast_spell') {
    combatFeedback = { animation: 'spellcast', showXRay: false, highlightedPart: null };
    if (state.player.arcane.magicka_overcharge) {
      narrativeParts.push("Your magicka reserves are overcharged — casting now would be dangerous!");
    } else if (state.player.arcane.spells.length === 0) {
      narrativeParts.push('You reach for a spell but your mind is blank — you know no combat spells!');
    } else {
      const spellDamage = Math.round(15 + rng() * 25 + state.player.skills.lore_mastery * 0.2);
      newEnemyHealth = Math.max(0, enemyHealth - spellDamage);
      narrativeParts.push(
        `Destruction magic surges from your hands, blasting your foe for ${spellDamage} damage!`,
      );
      stat_deltas.stamina = -5;
      skill_deltas.lore_mastery = 1;
    }

  } else if (playerAction === 'use_item') {
    combatFeedback = { animation: 'defend', showXRay: false, highlightedPart: null };
    const healItem = state.player.inventory.find(
      i => i.type === 'consumable''&& (i.stats?.health ?? 0) > 0,
    );
    if (healItem && healItem.stats?.health) {
      const heal = healItem.stats.health;
      stat_deltas.health = (stat_deltas.health ?? 0) + heal;
      newPlayerHealth    = Math.min(state.player.stats.max_health, playerHealth + heal);
      narrativeParts.push(`You quickly apply a ${healItem.name}, restoring ${heal} health!`);
    } else {
      narrativeParts.push('You fumble in your pack but find nothing useful!');
    }

  } else if (playerAction === 'intimidate') {
    combatFeedback = { animation: 'special', showXRay: false, highlightedPart: null };
    const intimidation   = state.player.allure_state.intimidation;
    const intimidateChance = clamp(intimidation / 100 + 0.2, 0.10, 0.80);
    if (rng() < intimidateChance) {
      const newAnger = Math.min(100, encounter.enemy_anger + 25);
      encounterUpdates.enemy_anger = newAnger;
      narrativeParts.push('Your fierce display rattles your opponent — they hesitate in fear!');
      if (newAnger >= 90) {
        narrativeParts.push('Overwhelmed, they break and flee the fight!');
        endEncounter = true;
      }
    } else {
      narrativeParts.push('Your intimidation attempt falls flat. They sneer and press forward.');
      stat_deltas.stamina = -5;
    }

  } else if (playerAction === 'surrender') {
    combatFeedback = { animation: 'lust_action', showXRay: false, highlightedPart: null };
    newPlayerStance = 'submissive';
    narrativeParts.push('You lower your weapon and raise your hands in surrender.');
    endEncounter = true;
  }

  // ── Enemy counter-action (only if combat continues and enemy alive) ────────

  if (!endEncounter && newEnemyHealth > 0) {
    const newEnemyStance = selectAIStance({
      id:            'enemy',
      health:        newEnemyHealth,
      stamina:       newEnemyStamina,
      stance:        enemyStance,
      combat_skill:  enemyCombatSkill,
      athletics:     enemyAthletics,
    });
    encounterUpdates.enemy_stance = newEnemyStance;

    if (playerAction === 'block') {
      // Player is blocking — resolve block against enemy strike
      const incomingEstimate = Math.round(8 + rng() * 15);
      const block = resolveBlock(
        {
          combat_skill: playerCombatSkill,
          health:       newPlayerHealth,
          stamina:      newPlayerStamina,
          stance:       'defensive',
          armor:        'none',
        },
        incomingEstimate,
        'none',
        rng,
      );
      const blocked = block.remaining_damage;
      newPlayerHealth = Math.max(0, newPlayerHealth - blocked);
      stat_deltas.health  = (stat_deltas.health  ?? 0) - blocked;
      stat_deltas.stamina = (stat_deltas.stamina ?? 0) - block.stamina_cost;
      narrativeParts.push(block.narrative);

    } else if (playerAction === 'dodge') {
      // Player is dodging — chance to avoid
      const dodgeChance = clamp(0.40 + (getPlayerAthletics(state) // 100) * 0.40, 0.15, 0.85);
      if (rng() < dodgeChance) {
        narrativeParts.push('You sidestep their counter-attack with fluid grace!');
        skill_deltas.athletics = (skill_deltas.athletics ?? 0) + 1;
      } else {
        const glance = Math.round(5 + rng() * 10);
        newPlayerHealth = Math.max(0, newPlayerHealth - glance);
        stat_deltas.health = (stat_deltas.health ?? 0) - glance;
        narrativeParts.push(`The attack partially connects for ${glance} damage despite your dodge.`);
      }

    } else {
      // Standard enemy attack
      const enemyAtk = resolveWeaponAttack(
        { combat_skill: enemyCombatSkill, stamina: newEnemyStamina, stance: newEnemyStance },
        {
          combat_skill: playerCombatSkill,
          health:       newPlayerHealth,
          stamina:      newPlayerStamina,
          stance:       newPlayerStance,
          armor:        'none',
        },
        'sword',
        'iron',
        rng,
      );

      if (enemyAtk.hit) {
        newPlayerHealth = Math.max(0, newPlayerHealth - enemyAtk.damage);
        stat_deltas.health = (stat_deltas.health ?? 0) - enemyAtk.damage;
        stat_deltas.pain   = (stat_deltas.pain   ?? 0) + Math.round(enemyAtk.damage * 0.5);
        narrativeParts.push(pick(PLAYER_HIT_NARRATIVES, rng));
        if (enemyAtk.damage > 15) {
          narrativeParts.push(`"${pick(ENEMY_HURT_BARKS, rng)}"  — they gloat.`);
          combatFeedback = {
            animation:       'defend',
            showXRay:        enemyAtk.damage > 25,
            highlightedPart: enemyAtk.damage > 25 ? 'ribs'': null,
          };
        }
      } else {
        narrativeParts.push('Their counter-attack whiffs past you.');
      }
      newEnemyStamina = Math.max(0, newEnemyStamina - 10);
    }
  }

  // ── Stamina drain from combat ─────────────────────────────────────────────
  stat_deltas.stamina = (stat_deltas.stamina ?? 0) - 5;

  // ── Check end conditions ──────────────────────────────────────────────────

  if (newPlayerHealth <= 0) {
    narrativeParts.push('You collapse, consciousness slipping away into darkness...');
    endEncounter = true;
  } else if (newEnemyHealth <= 0) {
    narrativeParts.push(
      `${encounter.enemy_name} staggers and falls. The fight is over — victory!`,
    );
    if (rng() < 0.8) {
      narrativeParts.push(`"${pick(ENEMY_HURT_BARKS, rng)}" they rasp with their last breath.`);
    }
    loot.push(...generateLoot(encounter.enemy_type, state.world.current_location.danger ?? 0.3, rng));
    skill_deltas.athletics = (skill_deltas.athletics ?? 0) + 2;
    stat_deltas.stress     = (stat_deltas.stress     ?? 0) - 5;
    endEncounter = true;
  } else if (newEnemyStamina <= 0) {
    narrativeParts.push(
      `${encounter.enemy_name} staggers, completely spent — the fight ends in your favour!`,
    );
    endEncounter = true;
  }

  encounterUpdates.enemy_health  = newEnemyHealth;
  encounterUpdates.enemy_stamina = newEnemyStamina;
  encounterUpdates.player_stance = newPlayerStance;
  encounterUpdates.log           = [...(encounter.log ?? []), ...narrativeParts];

  return {
    narrative:        narrativeParts.join(''),
    stat_deltas,
    skill_deltas,
    encounterUpdates,
    endEncounter,
    loot,
    combatFeedback,
  };
}

// ── resolveCombatEnd ──────────────────────────────────────────────────────────

/**
 * Finalize combat: compute loot drops, XP, stat changes, and narrative.
 *
 * Call this after `resolveCombatTurn` signals `endEncounter = true` to
 * distribute the full rewards / penalties for the completed encounter.
 */
export function resolveCombatEnd(
  state: GameState,
  outcome: CombatOutcome,
  rng: () => number,
): CombatEndResult {
  const encounter  = state.world.active_encounter;
  const enemyType  = encounter?.enemy_type ?? 'hostile';
  const danger     = state.world.current_location.danger ?? 0.5;

  const stat_deltas: Partial<Record<StatKey, number>> = {};
  const skill_deltas: Partial<Record<string, number>> = {};
  let finalLoot: LootItem[] = [];
  let xp_reward  = 0;
  let fame_delta = 0;
  let narrative  = ';

  if (outcome === 'victory') {
    finalLoot  = generateLoot(enemyType, danger, rng);
    xp_reward  = Math.round(50 + danger * 100 + rng() * 50);
    fame_delta = Math.round(5  + danger * 20);
    stat_deltas.stress = -10;
    if (rng() < 0.2) stat_deltas.trauma = 3;
    skill_deltas.athletics = 3;
    narrative = finalLoot.length > 0
      ? `Victory! You search the body and find: ${finalLoot.map(l => l.name).join('',')}.`
      : 'Victory! Your fallen foe carried little of value.';

  } else if (outcome === 'defeat') {
    xp_reward       = Math.round(10 + danger * 30);
    stat_deltas.trauma  = 8;
    stat_deltas.stress  = 15;
    stat_deltas.health  = -Math.round(10 + rng() * 20);
    stat_deltas.pain    = 20;
    narrative = 'You are defeated. You wake later, battered and humiliated — but alive.';

  } else if (outcome === 'flee') {
    xp_reward       = Math.round(5 + danger * 15);
    stat_deltas.stamina = -20;
    stat_deltas.stress  = 5;
    skill_deltas.athletics = 2;
    narrative = 'You escape with your life. The ordeal leaves you shaken but free.';

  } else if (outcome === 'surrender') {
    stat_deltas.trauma = 5;
    stat_deltas.stress = 10;
    stat_deltas.purity = -3;
    const goldLost = state.player.gold > 0
      ? Math.round(state.player.gold * (0.3 + rng() * 0.4))
      : 0;
    narrative = goldLost > 0
      ? `You surrender. They strip ${goldLost} septims from your belt and let you crawl away.`
      : 'You surrender. Mercifully, they spare your life and leave you in the dirt.';
  }

  return { narrative, stat_deltas, skill_deltas, loot: finalLoot, xp_reward, fame_delta };
}

// ── getCombatStatus ───────────────────────────────────────────────────────────

/**
 * Snapshot of current combat state for HUD display.
 * Returns null when no active encounter is present.
 */
export function getCombatStatus(state: GameState): CombatStatus | null {
  const encounter = state.world.active_encounter;
  if (!encounter) return null;

  const ext          = encounter as unknown as Record<string, unknown>;
  const companionBonus = partyCombatBonus(castCompanionState(state));

  const activeEffects: string[] = [];
  for (const d of (encounter.debuffs ?? [])) {
    activeEffects.push(`${d.type} (${d.duration} turns remaining)`);
  }
  for (const e of state.player.status_effects) {
    activeEffects.push(e);
  }

  return {
    player_health:     state.player.stats.health,
    player_max_health: state.player.stats.max_health,
    player_stamina:    state.player.stats.stamina,
    player_max_stamina: state.player.stats.max_stamina,
    player_stance:     (encounter.player_stance ?? 'neutral') as CombatStance,
    enemy_health:      encounter.enemy_health,
    enemy_max_health:  encounter.enemy_max_health,
    enemy_name:        encounter.enemy_name,
    active_effects:    activeEffects,
    turn:              encounter.turn,
    companion_bonus:   companionBonus,
  };
}

// ── generateLoot (exported for tests) ────────────────────────────────────────

/**
 * Generate a loot table based on enemy archetype, location danger level,
 * and a seeded RNG.
 *
 * Always has a chance to drop gold.
 * Enemy type modifies weapon-drop probability.
 * High-danger locations improve loot tier.
 */
export function generateLoot(
  enemyType: string,
  danger: number,
  rng: () => number,
): LootItem[] {
  const loot: LootItem[] = [];

  // Gold — always possible
  if (rng() < 0.70) {
    const amount = Math.round((5 + danger * 50) * (0.5 + rng()));
    loot.push({
      id:     `gold_${Math.floor(rng() * 1e6)}`,
      name:   `${amount} Septims`,
      value:  amount,
      weight: amount * 0.01,
      type:   'misc',
    });
  }

  // Weapon
  const weaponChance = enemyType === 'guard''  ? 0.60
                     : enemyType === 'hostile'' ? 0.40
                     : 0.20;
  if (rng() < weaponChance) {
    const tier = _lootWeaponTier(danger, rng);
    const type = pick(['sword','dagger','mace'] as WeaponType[], rng);
    loot.push({
      id:     `weapon_${Math.floor(rng() * 1e6)}`,
      name:   WEAPON_TIER_NAMES[type][tier],
      value:  _weaponValue(tier),
      weight: type === 'mace''? 5 : 3,
      type:   'weapon',
    });
  }

  // Consumable
  if (rng() < 0.30) {
    loot.push(pick([
      { id: 'healing-potion',       name: 'Healing Potion',          value: 25, weight: 0.3, type: 'consumable''as const },
      { id: 'stamina-draught',      name: 'Stamina Draught',         value: 20, weight: 0.2, type: 'consumable''as const },
      { id: 'resist-fire-potion',   name: 'Potion of Resist Fire',   value: 30, weight: 0.3, type: 'consumable''as const },
      { id: 'fortify-strength',     name: 'Fortify Strength Potion', value: 35, weight: 0.3, type: 'consumable''as const },
    ], rng));
  }

  // Armor (rare, danger-gated)
  if (danger > 0.5 && rng() < 0.20) {
    const isSteel = danger > 0.75;
    loot.push({
      id:     `armor_${Math.floor(rng() * 1e6)}`,
      name:   isSteel ? 'Steel Cuirass'': 'Iron Cuirass',
      value:  isSteel ? 150 : 80,
      weight: isSteel ? 20  : 15,
      type:   'armor',
    });
  }

  return loot;
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _lootWeaponTier(danger: number, rng: () => number): WeaponTier {
  const roll = rng() + danger * 0.3;
  if (roll > 1.8) return 'daedric';
  if (roll > 1.4) return 'ebony';
  if (roll > 1.0) return 'elven';
  if (roll > 0.6) return 'steel';
  return 'iron';
}

function _weaponValue(tier: WeaponTier): number {
  return ({ iron: 30, steel: 75, elven: 180, ebony: 400, daedric: 800 } as Record<WeaponTier, number>)[tier];
}

function _emptyCombatResult(): CombatResult {
  return {
    narrative:        ',
    stat_deltas:      {},
    skill_deltas:     {},
    encounterUpdates: {},
    endEncounter:     false,
    loot:             [],
    combatFeedback:   { animation: 'attack', showXRay: false, highlightedPart: null },
  };
}
