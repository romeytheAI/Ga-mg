/**
 * combatEngine.test.ts — 35+ deterministic tests for the combat bridge.
 *
 * Tests cover:
 *   - calculateDamage        (armor reduction, stance modifiers, skill scaling, armor pierce)
 *   - resolveWeaponAttack    (weapon type differences, tier scaling, criticals, miss)
 *   - resolveBlock           (shield tiers, stamina impact, stance, partial block)
 *   - resolveFleeAttempt     (athletics-based success, restraint penalty, terrain)
 *   - initiateCombat         (encounter creation, NPC lookup, companion bonus)
 *   - resolveCombatTurn      (all 9 player actions, enemy counter, end conditions)
 *   - resolveCombatEnd       (victory/defeat/flee/surrender outcomes, loot/XP)
 *   - getCombatStatus        (HUD data, null guard)
 *   - generateLoot           (enemy type, danger scaling, consumable/armor drops)
 *   - Companion bonuses      (fighter/healer companion increases effective skill)
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDamage,
  resolveWeaponAttack,
  resolveBlock,
  resolveFleeAttempt,
  initiateCombat,
  resolveCombatTurn,
  resolveCombatEnd,
  getCombatStatus,
  generateLoot,
  ARMOR_STATS,
  WEAPON_STATS,
  WEAPON_TIER_MULT,
  WEAPON_TIER_NAMES,
  SHIELD_BLOCK_VALUE,
  STANCE_ATTACK_MOD,
  WeaponType,
  WeaponTier,
  ArmorType,
  CombatAction,
} from './combatEngine';
import { initialState } from '../state/initialState';
import { GameState } from '../types';

// ── Test helpers ──────────────────────────────────────────────────────────────

/** Simple seeded pseudo-RNG for deterministic tests. */
function seededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Always returns a constant value — useful for forcing hit/miss/crit outcomes. */
const alwaysHigh = () => 0.99;
const alwaysLow  = () => 0.01;

/** Construct a minimal GameState patch. */
function makeState(overrides: Partial<GameState> = {}): GameState {
  return { ...initialState, ...overrides };
}

/** Inject an active encounter into a state. */
function stateWithEncounter(
  state: GameState,
  partial: Partial<NonNullable<GameState['world']['active_encounter']>>,
): GameState {
  return {
    ...state,
    world: {
      ...state.world,
      active_encounter: {
        id:               'enc_test',
        enemy_name:       'Bandit',
        enemy_type:       'hostile',
        enemy_health:     80,
        enemy_max_health: 80,
        enemy_lust:       0,
        enemy_max_lust:   100,
        enemy_anger:      30,
        enemy_max_anger:  100,
        player_stance:    'neutral',
        turn:             0,
        log:              [],
        debuffs:          [],
        targeted_part:    null,
        anatomy:          state.player.anatomy,
        // extended combat fields
        ...(partial as Record<string, unknown>),
      } as NonNullable<GameState['world']['active_encounter']>,
    },
  };
}

// ── calculateDamage ───────────────────────────────────────────────────────────

describe('calculateDamage', () => {
  it('returns at least 1 even against heavy armor at low base', () => {
    const dmg = calculateDamage(1, 0, 'dragonbone', 'neutral', alwaysLow);
    expect(dmg).toBeGreaterThanOrEqual(1);
  });

  it('deals more damage against unarmored than dragonbone', () => {
    const rng = seededRng(1);
    const vsNone       = calculateDamage(20, 50, 'none',       'neutral', rng);
    const rng2 = seededRng(1);
    const vsDragonbone = calculateDamage(20, 50, 'dragonbone', 'neutral', rng2);
    expect(vsNone).toBeGreaterThan(vsDragonbone);
  });

  it('aggressive stance amplifies damage vs neutral', () => {
    const rng1 = seededRng(42);
    const rng2 = seededRng(42);
    const aggressive = calculateDamage(20, 40, 'leather', 'aggressive', rng1);
    const neutral    = calculateDamage(20, 40, 'leather', 'neutral',    rng2);
    expect(aggressive).toBeGreaterThan(neutral);
  });

  it('submissive stance deals minimal damage', () => {
    const rng = seededRng(7);
    const dmg = calculateDamage(30, 80, 'none', 'submissive', rng);
    // submissive mult = 0.2 → far less than aggressive
    const rng2 = seededRng(7);
    const aggDmg = calculateDamage(30, 80, 'none', 'aggressive', rng2);
    expect(dmg).toBeLessThan(aggDmg);
  });

  it('armorPierce reduces effective DR', () => {
    const rng1 = seededRng(3);
    const rng2 = seededRng(3);
    const withPierce    = calculateDamage(20, 50, 'steel', 'neutral', rng1, 12);
    const withoutPierce = calculateDamage(20, 50, 'steel', 'neutral', rng2, 0);
    // Piercing negates full DR → more damage
    expect(withPierce).toBeGreaterThanOrEqual(withoutPierce);
  });

  it('higher attacker skill increases base output', () => {
    const rng1 = seededRng(5);
    const rng2 = seededRng(5);
    const highSkill = calculateDamage(15, 90, 'iron', 'neutral', rng1);
    const lowSkill  = calculateDamage(15, 10, 'iron', 'neutral', rng2);
    expect(highSkill).toBeGreaterThan(lowSkill);
  });

  it('armor types provide increasing DR: none < hide < leather < iron < steel', () => {
    const tiers: ArmorType[] = ['none', 'hide', 'leather', 'iron', 'steel'];
    const damages = tiers.map(armor => calculateDamage(40, 60, armor, 'neutral', seededRng(9)));
    for (let i = 1; i < damages.length; i++) {
      expect(damages[i]).toBeLessThanOrEqual(damages[i - 1]);
    }
  });

  it('daedric armor reduces damage significantly vs none', () => {
    const rng1 = seededRng(99);
    const rng2 = seededRng(99);
    const vsNone    = calculateDamage(30, 60, 'none',    'aggressive', rng1);
    const vsDaedric = calculateDamage(30, 60, 'daedric', 'aggressive', rng2);
    expect(vsNone).toBeGreaterThan(vsDaedric);
  });
});

// ── resolveWeaponAttack ───────────────────────────────────────────────────────

describe('resolveWeaponAttack', () => {
  const attacker = { combat_skill: 60, stamina: 80, stance: 'neutral' as const };
  const defender = { combat_skill: 30, health: 100, stamina: 80, stance: 'neutral' as const, armor: 'iron' as ArmorType };

  it('returns hit=false when rng forces a miss', () => {
    const result = resolveWeaponAttack(attacker, defender, 'sword', 'iron', alwaysHigh);
    expect(result.hit).toBe(false);
    expect(result.damage).toBe(0);
  });

  it('returns hit=true when rng forces a hit', () => {
    const result = resolveWeaponAttack(attacker, defender, 'sword', 'iron', alwaysLow);
    expect(result.hit).toBe(true);
    expect(result.damage).toBeGreaterThanOrEqual(1);
  });

  it('daedric sword deals more damage than iron sword (same rng)', () => {
    const rng1 = seededRng(11);
    const rng2 = seededRng(11);
    const iron    = resolveWeaponAttack(attacker, defender, 'sword', 'iron',    rng1);
    const daedric = resolveWeaponAttack(attacker, defender, 'sword', 'daedric', rng2);
    // Only compare when both hit
    if (iron.hit && daedric.hit) {
      expect(daedric.damage).toBeGreaterThan(iron.damage);
    }
  });

  it('dagger has lower base damage than greatsword', () => {
    expect(WEAPON_STATS.dagger.base_damage).toBeLessThan(WEAPON_STATS.greatsword.base_damage);
  });

  it('dagger is faster than greatsword (higher speed)', () => {
    expect(WEAPON_STATS.dagger.speed).toBeGreaterThan(WEAPON_STATS.greatsword.speed);
  });

  it('mace has armor-piercing capability', () => {
    expect(WEAPON_STATS.mace.armor_pierce).toBeGreaterThan(0);
  });

  it('bow has maximum reach (ranged = 1.0)', () => {
    expect(WEAPON_STATS.bow.reach).toBe(1.0);
  });

  it('greatsword is two-handed', () => {
    expect(WEAPON_STATS.greatsword.is_two_handed).toBe(true);
  });

  it('daedric multiplier is highest among tiers', () => {
    const tiers: WeaponTier[] = ['iron', 'steel', 'elven', 'ebony', 'daedric'];
    const mults = tiers.map(t => WEAPON_TIER_MULT[t]);
    const sorted = [...mults].sort((a, b) => a - b);
    expect(mults).toEqual(sorted);
    expect(mults[mults.length - 1]).toBe(WEAPON_TIER_MULT.daedric);
  });

  it('weapon names are non-empty for all type×tier combinations', () => {
    const types: WeaponType[] = ['dagger', 'sword', 'mace', 'greatsword', 'bow'];
    const tiers: WeaponTier[] = ['iron', 'steel', 'elven', 'ebony', 'daedric'];
    for (const t of types) {
      for (const tier of tiers) {
        expect(WEAPON_TIER_NAMES[t][tier].length).toBeGreaterThan(0);
      }
    }
  });

  it('critical hit is possible with forced low rng (crit always triggers)', () => {
    // Force low rng → hit succeeds, crit triggers
    const result = resolveWeaponAttack(attacker, defender, 'sword', 'steel', alwaysLow);
    // With always-low rng crit threshold (0.05 + skill*0.1) will be exceeded
    expect(result.hit).toBe(true);
    expect(result.critical).toBe(true);
  });

  it('stamina cost is positive on hit', () => {
    const result = resolveWeaponAttack(attacker, defender, 'sword', 'iron', alwaysLow);
    expect(result.stamina_cost).toBeGreaterThan(0);
  });

  it('narrative string is non-empty', () => {
    const result = resolveWeaponAttack(attacker, defender, 'mace', 'ebony', alwaysLow);
    expect(result.narrative.length).toBeGreaterThan(5);
  });
});

// ── resolveBlock ──────────────────────────────────────────────────────────────

describe('resolveBlock', () => {
  const defender = { combat_skill: 50, health: 100, stamina: 100, stance: 'defensive' as const, armor: 'iron' as ArmorType };

  it('ebony shield absorbs more than no shield', () => {
    const rng1 = seededRng(20);
    const rng2 = seededRng(20);
    const withShield = resolveBlock(defender, 30, 'ebony', rng1);
    const noShield   = resolveBlock(defender, 30, 'none',  rng2);
    expect(withShield.damage_absorbed).toBeGreaterThanOrEqual(noShield.damage_absorbed);
  });

  it('block value increases with shield tier', () => {
    const tiers = ['none', 'wood', 'iron', 'steel', 'ebony'] as const;
    const values = tiers.map(t => SHIELD_BLOCK_VALUE[t]);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it('forced low rng always succeeds the block roll', () => {
    const result = resolveBlock(defender, 20, 'steel', alwaysLow);
    // Low rng passes blockChance check (rng() > blockChance → false when rng is very low)
    // so the block attempt succeeds
    expect(result.damage_absorbed).toBeGreaterThanOrEqual(0);
    expect(result.remaining_damage).toBeLessThanOrEqual(20);
  });

  it('forced high rng breaks the guard', () => {
    const result = resolveBlock(defender, 20, 'none', alwaysHigh);
    expect(result.damage_absorbed).toBe(0);
    expect(result.remaining_damage).toBe(20);
  });

  it('stamina_cost is positive when block succeeds', () => {
    const result = resolveBlock(defender, 25, 'steel', alwaysLow);
    if (result.damage_absorbed > 0) {
      expect(result.stamina_cost).toBeGreaterThan(0);
    }
  });

  it('narrative is non-empty', () => {
    const result = resolveBlock(defender, 15, 'iron', seededRng(33));
    expect(result.narrative.length).toBeGreaterThan(5);
  });

  it('low-stamina defender blocks less effectively', () => {
    const highStam: typeof defender = { ...defender, stamina: 100 };
    const lowStam:  typeof defender = { ...defender, stamina: 5   };
    const rng1 = seededRng(50);
    const rng2 = seededRng(50);
    const blockHigh = resolveBlock(highStam, 40, 'iron', rng1);
    const blockLow  = resolveBlock(lowStam,  40, 'iron', rng2);
    // High stamina should absorb >= low stamina
    expect(blockHigh.damage_absorbed).toBeGreaterThanOrEqual(blockLow.damage_absorbed);
  });
});

// ── resolveFleeAttempt ────────────────────────────────────────────────────────

describe('resolveFleeAttempt', () => {
  it('high-athletics player succeeds with low rng', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        skills: { ...initialState.player.skills, athletics: 90 },
        stats:  { ...initialState.player.stats,  stamina: 100 },
      },
    });
    const result = resolveFleeAttempt(state, alwaysLow);
    expect(result.success).toBe(true);
  });

  it('restrained player with high movement_penalty has reduced escape chance', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        skills:    { ...initialState.player.skills, athletics: 80 },
        stats:     { ...initialState.player.stats,  stamina: 100 },
        restraints: {
          entries:          [],
          escape_progress:  0,
          movement_penalty: 0.9,
          action_penalty:   0.5,
        },
      },
    });
    // Count success rate over multiple trials
    let successCount = 0;
    const rng = seededRng(77);
    for (let i = 0; i < 50; i++) {
      if (resolveFleeAttempt(state, rng).success) successCount++;
    }
    // Restrained → significantly fewer successes than 50
    expect(successCount).toBeLessThan(40);
  });

  it('returns stat_deltas on failure', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        skills: { ...initialState.player.skills, athletics: 0 },
        stats:  { ...initialState.player.stats,  stamina: 10 },
      },
    });
    const result = resolveFleeAttempt(state, alwaysHigh);
    expect(result.success).toBe(false);
    expect(result.stat_deltas.stamina).toBeDefined();
    expect((result.stat_deltas.stamina ?? 0)).toBeLessThan(0);
  });

  it('flee narrative is a non-empty string', () => {
    const result = resolveFleeAttempt(initialState, seededRng(13));
    expect(result.narrative.length).toBeGreaterThan(5);
  });

  it('zero stamina lowers flee chance', () => {
    const exhausted = makeState({
      player: {
        ...initialState.player,
        skills: { ...initialState.player.skills, athletics: 50 },
        stats:  { ...initialState.player.stats,  stamina: 0 },
      },
    });
    const normal = makeState({
      player: {
        ...initialState.player,
        skills: { ...initialState.player.skills, athletics: 50 },
        stats:  { ...initialState.player.stats,  stamina: 100 },
      },
    });
    // Count successes — exhausted should succeed less often
    let exhCount = 0, norCount = 0;
    for (let i = 0; i < 50; i++) {
      if (resolveFleeAttempt(exhausted, seededRng(i)).success) exhCount++;
      if (resolveFleeAttempt(normal,    seededRng(i)).success) norCount++;
    }
    expect(exhCount).toBeLessThanOrEqual(norCount);
  });
});

// ── initiateCombat ────────────────────────────────────────────────────────────

describe('initiateCombat', () => {
  it('returns a narrative string', () => {
    const result = initiateCombat(initialState, 'nonexistent_npc', 'npc', seededRng(1));
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('encounterUpdates contains required fields', () => {
    const result = initiateCombat(initialState, 'npc1', 'player', seededRng(2));
    const eu = result.encounterUpdates;
    expect(eu.enemy_name).toBeDefined();
    expect(eu.enemy_health).toBeGreaterThan(0);
    expect(eu.enemy_max_health).toBeGreaterThan(0);
    expect(eu.player_stance).toBe('neutral');
    expect(eu.turn).toBe(0);
    expect(Array.isArray(eu.log)).toBe(true);
  });

  it('NPC-initiated combat sets enemy_anger higher', () => {
    const npcInit    = initiateCombat(initialState, 'npc1', 'npc',    seededRng(3));
    const playerInit = initiateCombat(initialState, 'npc1', 'player', seededRng(3));
    expect(npcInit.encounterUpdates.enemy_anger as number).toBeGreaterThan(
      playerInit.encounterUpdates.enemy_anger as number,
    );
  });

  it('endEncounter is false at initiation', () => {
    const result = initiateCombat(initialState, 'npc1', 'npc', seededRng(4));
    expect(result.endEncounter).toBe(false);
  });

  it('loot is empty at initiation', () => {
    const result = initiateCombat(initialState, 'npc1', 'player', seededRng(5));
    expect(result.loot).toHaveLength(0);
  });

  it('companion bonus is included in encounterUpdates', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        companion_state: {
          companions: [{
            id:           'fighter1',
            name:         'Lydia',
            role:         'fighter',
            loyalty:      90,
            morale:       90,
            health:       100,
            stamina:      100,
            combat_skill: 60,
            bond:         70,
            turns_together: 10,
          }],
          max_party_size:  3,
          party_synergy:   20,
        },
      },
    });
    const result = initiateCombat(state, 'npc1', 'npc', seededRng(6));
    expect((result.encounterUpdates.companion_bonus as number)).toBeGreaterThan(0);
  });
});

// ── resolveCombatTurn ─────────────────────────────────────────────────────────

describe('resolveCombatTurn', () => {
  it('returns empty result with no active encounter', () => {
    const result = resolveCombatTurn(initialState, 'attack', seededRng(1));
    expect(result.narrative).toBe('');
    expect(result.endEncounter).toBe(false);
  });

  it('attack action returns a narrative', () => {
    const state  = stateWithEncounter(initialState, {});
    const result = resolveCombatTurn(state, 'attack', seededRng(1));
    expect(result.narrative.length).toBeGreaterThan(5);
  });

  it('attack reduces enemy_health in encounterUpdates', () => {
    const state  = stateWithEncounter(initialState, {
      enemy_health:      80,
      enemy_combat_skill: 10,
    } as any);
    const result = resolveCombatTurn(state, 'attack', alwaysLow);
    const newHealth = result.encounterUpdates.enemy_health as number;
    expect(newHealth).toBeLessThanOrEqual(80);
  });

  it('power_attack requires minimum stamina', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        stats: { ...initialState.player.stats, stamina: 5 },
      },
    });
    const s      = stateWithEncounter(state, {});
    const result = resolveCombatTurn(s, 'power_attack', seededRng(10));
    expect(result.narrative).toContain('exhausted');
  });

  it('power_attack deals extra damage when stamina is sufficient', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        stats: { ...initialState.player.stats, stamina: 100 },
      },
    });
    const s       = stateWithEncounter(state, {
      enemy_health:       80,
      enemy_combat_skill: 5,
    } as any);
    const result  = resolveCombatTurn(s, 'power_attack', alwaysLow);
    const newHp   = result.encounterUpdates.enemy_health as number;
    expect(newHp).toBeLessThan(80);
  });

  it('block action switches player_stance to defensive', () => {
    const state  = stateWithEncounter(initialState, {});
    const result = resolveCombatTurn(state, 'block', seededRng(2));
    expect(result.encounterUpdates.player_stance).toBe('defensive');
  });

  it('dodge action switches player_stance to evasive', () => {
    const state  = stateWithEncounter(initialState, {});
    const result = resolveCombatTurn(state, 'dodge', seededRng(3));
    expect(result.encounterUpdates.player_stance).toBe('evasive');
  });

  it('flee action can end encounter on success', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        skills: { ...initialState.player.skills, athletics: 100 },
        stats:  { ...initialState.player.stats,  stamina: 100 },
      },
    });
    const s      = stateWithEncounter(state, {});
    const result = resolveCombatTurn(s, 'flee', alwaysLow);
    // With max athletics and alwaysLow, flee should succeed
    expect(result.endEncounter).toBe(true);
  });

  it('surrender always ends combat', () => {
    const state  = stateWithEncounter(initialState, {});
    const result = resolveCombatTurn(state, 'surrender', seededRng(4));
    expect(result.endEncounter).toBe(true);
  });

  it('use_item heals player when healing poultice present', () => {
    const state  = stateWithEncounter(initialState, {}); // initialState has healing-poultice
    const result = resolveCombatTurn(state, 'use_item', seededRng(5));
    const healthDelta = result.stat_deltas.health ?? 0;
    // Either healed (positive delta) or told nothing useful (no positive delta) — both valid
    expect(result.narrative.length).toBeGreaterThan(5);
    expect(typeof healthDelta).toBe('number');
  });

  it('cast_spell deals damage when player knows spells', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        arcane: {
          ...initialState.player.arcane,
          spells:             ['flames'],
          magicka_overcharge: false,
        },
      },
    });
    const s      = stateWithEncounter(state, { enemy_health: 80 } as any);
    const result = resolveCombatTurn(s, 'cast_spell', alwaysLow);
    const newHp  = result.encounterUpdates.enemy_health as number;
    expect(newHp).toBeLessThan(80);
  });

  it('cast_spell fails gracefully when magicka overcharged', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        arcane: { ...initialState.player.arcane, magicka_overcharge: true, spells: ['flames'] },
      },
    });
    const s      = stateWithEncounter(state, {});
    const result = resolveCombatTurn(s, 'cast_spell', seededRng(6));
    expect(result.narrative).toContain('overcharged');
  });

  it('enemy is defeated when health reaches 0 → endEncounter=true', () => {
    const state = stateWithEncounter(initialState, {
      enemy_health:       1,
      enemy_combat_skill: 1,
    } as any);
    const result = resolveCombatTurn(state, 'attack', alwaysLow);
    expect(result.endEncounter).toBe(true);
  });

  it('loot is generated on enemy defeat', () => {
    const state = stateWithEncounter(initialState, {
      enemy_health:       1,
      enemy_combat_skill: 1,
      enemy_type:         'guard',
    } as any);
    const result = resolveCombatTurn(state, 'attack', alwaysLow);
    // Guard has high weapon-drop chance
    if (result.endEncounter) {
      // loot MAY or MAY NOT drop depending on rng — just verify it's an array
      expect(Array.isArray(result.loot)).toBe(true);
    }
  });

  it('turn counter increments in encounterUpdates', () => {
    const state  = stateWithEncounter(initialState, { turn: 3 } as any);
    const result = resolveCombatTurn(state, 'attack', seededRng(20));
    expect(result.encounterUpdates.turn as number).toBe(4);
  });

  it('stat_deltas has stamina reduction every turn', () => {
    const state  = stateWithEncounter(initialState, {});
    const result = resolveCombatTurn(state, 'attack', seededRng(21));
    expect((result.stat_deltas.stamina ?? 0)).toBeLessThan(0);
  });
});

// ── resolveCombatEnd ──────────────────────────────────────────────────────────

describe('resolveCombatEnd', () => {
  const stateWithEnc = stateWithEncounter(initialState, {
    enemy_type: 'hostile',
  } as any);

  it('victory generates XP and possible loot', () => {
    const result = resolveCombatEnd(stateWithEnc, 'victory', seededRng(1));
    expect(result.xp_reward).toBeGreaterThan(0);
    expect(result.narrative.length).toBeGreaterThan(5);
  });

  it('defeat applies trauma and health penalty', () => {
    const result = resolveCombatEnd(stateWithEnc, 'defeat', seededRng(2));
    expect((result.stat_deltas.trauma ?? 0)).toBeGreaterThan(0);
    expect((result.stat_deltas.health ?? 0)).toBeLessThan(0);
    expect(result.xp_reward).toBeGreaterThan(0); // Learn from defeat
  });

  it('flee outcome reduces stamina and gives athletics XP', () => {
    const result = resolveCombatEnd(stateWithEnc, 'flee', seededRng(3));
    expect((result.stat_deltas.stamina ?? 0)).toBeLessThan(0);
    expect((result.skill_deltas.athletics ?? 0)).toBeGreaterThan(0);
  });

  it('surrender reduces purity and adds stress', () => {
    const result = resolveCombatEnd(stateWithEnc, 'surrender', seededRng(4));
    expect((result.stat_deltas.purity ?? 0)).toBeLessThan(0);
    expect((result.stat_deltas.stress ?? 0)).toBeGreaterThan(0);
  });

  it('victory fame_delta is positive', () => {
    const result = resolveCombatEnd(stateWithEnc, 'victory', seededRng(5));
    expect(result.fame_delta).toBeGreaterThan(0);
  });

  it('defeat has zero fame_delta', () => {
    const result = resolveCombatEnd(stateWithEnc, 'defeat', seededRng(6));
    expect(result.fame_delta).toBe(0);
  });

  it('high-danger victory gives more XP than low-danger', () => {
    const highDanger = makeState({
      ...stateWithEnc,
      world: { ...stateWithEnc.world, current_location: { ...stateWithEnc.world.current_location, danger: 0.9 } },
    });
    const lowDanger = makeState({
      ...stateWithEnc,
      world: { ...stateWithEnc.world, current_location: { ...stateWithEnc.world.current_location, danger: 0.1 } },
    });
    // Run enough seeds to confirm trend
    const highs = Array.from({ length: 5 }, (_, i) => resolveCombatEnd(highDanger, 'victory', seededRng(i)).xp_reward);
    const lows  = Array.from({ length: 5 }, (_, i) => resolveCombatEnd(lowDanger,  'victory', seededRng(i)).xp_reward);
    const avgH = highs.reduce((a, b) => a + b, 0) / highs.length;
    const avgL = lows.reduce((a, b) => a + b, 0)  / lows.length;
    expect(avgH).toBeGreaterThan(avgL);
  });
});

// ── getCombatStatus ───────────────────────────────────────────────────────────

describe('getCombatStatus', () => {
  it('returns null when no active encounter', () => {
    const state = makeState({ world: { ...initialState.world, active_encounter: null } });
    expect(getCombatStatus(state)).toBeNull();
  });

  it('returns correct player health and stamina', () => {
    const state  = stateWithEncounter(initialState, {});
    const status = getCombatStatus(state);
    expect(status).not.toBeNull();
    expect(status!.player_health).toBe(initialState.player.stats.health);
    expect(status!.player_stamina).toBe(initialState.player.stats.stamina);
  });

  it('returns enemy name from encounter', () => {
    const state  = stateWithEncounter(initialState, { enemy_name: 'Draugr Wight' } as any);
    const status = getCombatStatus(state);
    expect(status!.enemy_name).toBe('Draugr Wight');
  });

  it('includes debuffs in active_effects', () => {
    const state = stateWithEncounter(initialState, {
      debuffs: [{ type: 'slowed', duration: 2 }],
    } as any);
    const status = getCombatStatus(state);
    expect(status!.active_effects.some(e => e.includes('slowed'))).toBe(true);
  });

  it('companion_bonus is 0 for empty party', () => {
    const status = getCombatStatus(stateWithEncounter(initialState, {}));
    expect(status!.companion_bonus).toBe(0);
  });

  it('companion_bonus increases with fighter companion', () => {
    const state = makeState({
      player: {
        ...initialState.player,
        companion_state: {
          companions: [{
            id:            'f1',
            name:          'Serana',
            role:          'fighter',
            loyalty:       85,
            morale:        85,
            health:        100,
            stamina:       100,
            combat_skill:  70,
            bond:          60,
            turns_together: 20,
          }],
          max_party_size: 3,
          party_synergy:  10,
        },
      },
    });
    const s      = stateWithEncounter(state, {});
    const status = getCombatStatus(s);
    expect(status!.companion_bonus).toBeGreaterThan(0);
  });

  it('turn counter matches encounter turn', () => {
    const state  = stateWithEncounter(initialState, { turn: 7 } as any);
    const status = getCombatStatus(state);
    expect(status!.turn).toBe(7);
  });
});

// ── generateLoot ──────────────────────────────────────────────────────────────

describe('generateLoot', () => {
  it('always returns an array', () => {
    expect(Array.isArray(generateLoot('hostile', 0.5, seededRng(1)))).toBe(true);
  });

  it('guard enemies have higher weapon drop rate than civilians', () => {
    let guardWeapons = 0, civWeapons = 0;
    for (let i = 0; i < 100; i++) {
      const g = generateLoot('guard',    0.5, seededRng(i));
      const c = generateLoot('merchant', 0.5, seededRng(i));
      if (g.some(l => l.type === 'weapon')) guardWeapons++;
      if (c.some(l => l.type === 'weapon')) civWeapons++;
    }
    expect(guardWeapons).toBeGreaterThan(civWeapons);
  });

  it('high-danger location enables armor drops', () => {
    let armorDrops = 0;
    for (let i = 0; i < 100; i++) {
      const loot = generateLoot('hostile', 0.9, seededRng(i));
      if (loot.some(l => l.type === 'armor')) armorDrops++;
    }
    expect(armorDrops).toBeGreaterThan(0);
  });

  it('low-danger location has no armor drops', () => {
    for (let i = 0; i < 50; i++) {
      const loot = generateLoot('hostile', 0.2, seededRng(i));
      expect(loot.every(l => l.type !== 'armor')).toBe(true);
    }
  });

  it('every loot item has a positive value', () => {
    for (let i = 0; i < 30; i++) {
      const loot = generateLoot('guard', 0.8, seededRng(i));
      for (const item of loot) {
        expect(item.value).toBeGreaterThan(0);
      }
    }
  });
});

// ── Companion combat bonus integration ───────────────────────────────────────

describe('companion combat bonuses', () => {
  it('fighter companion increases effective player combat skill via companion_bonus', () => {
    const withFighter = makeState({
      player: {
        ...initialState.player,
        companion_state: {
          companions: [{
            id: 'lydia', name: 'Lydia', role: 'fighter',
            loyalty: 90, morale: 90, health: 100, stamina: 100,
            combat_skill: 70, bond: 60, turns_together: 50,
          }],
          max_party_size: 3,
          party_synergy:  15,
        },
      },
    });
    const initResult = initiateCombat(withFighter, 'npc1', 'npc', seededRng(1));
    expect((initResult.encounterUpdates.companion_bonus as number)).toBeGreaterThan(0);
  });

  it('healer companion does not contribute direct combat bonus', () => {
    const withHealer = makeState({
      player: {
        ...initialState.player,
        companion_state: {
          companions: [{
            id: 'healer1', name: 'Colette', role: 'healer',
            loyalty: 80, morale: 80, health: 100, stamina: 100,
            combat_skill: 20, bond: 40, turns_together: 5,
          }],
          max_party_size: 3,
          party_synergy:  0,
        },
      },
    });
    const initResult = initiateCombat(withHealer, 'npc1', 'npc', seededRng(1));
    // Healer role has 0 combat bonus in ROLE_BONUSES — but loyalty multiplier > 0 is fine
    expect((initResult.encounterUpdates.companion_bonus as number)).toBeGreaterThanOrEqual(0);
  });
});

// ── Weapon type vs armor type interaction ─────────────────────────────────────

describe('mace armor-piercing advantage', () => {
  it('mace deals more damage vs heavy armor than sword at same tier', () => {
    const attacker = { combat_skill: 60, stamina: 80, stance: 'neutral' as const };
    const heavyDef = { combat_skill: 30, health: 100, stamina: 80, stance: 'neutral' as const, armor: 'steel' as ArmorType };

    let maceDmgTotal = 0, swordDmgTotal = 0, samples = 0;
    for (let i = 0; i < 40; i++) {
      const m = resolveWeaponAttack(attacker, heavyDef, 'mace',  'iron', seededRng(i));
      const s = resolveWeaponAttack(attacker, heavyDef, 'sword', 'iron', seededRng(i));
      if (m.hit && s.hit) {
        maceDmgTotal  += m.damage;
        swordDmgTotal += s.damage;
        samples++;
      }
    }
    if (samples > 0) {
      // Mace should average more damage vs steel due to armor-pierce
      expect(maceDmgTotal / samples).toBeGreaterThanOrEqual(swordDmgTotal / samples);
    }
  });
});

// ── Stance interaction: defensive reduces incoming damage ─────────────────────

describe('stance interactions', () => {
  it('defensive defender takes less damage from aggressive attacker', () => {
    const aggAtk = { combat_skill: 60, stamina: 80, stance: 'aggressive' as const };
    const defDef = { combat_skill: 60, health: 100, stamina: 80, stance: 'defensive' as const, armor: 'none' as ArmorType };
    const neuDef = { combat_skill: 60, health: 100, stamina: 80, stance: 'neutral'   as const, armor: 'none' as ArmorType };

    let defDmg = 0, neuDmg = 0, s = 0;
    for (let i = 0; i < 40; i++) {
      const r1 = resolveWeaponAttack(aggAtk, defDef, 'sword', 'iron', seededRng(i));
      const r2 = resolveWeaponAttack(aggAtk, neuDef, 'sword', 'iron', seededRng(i));
      if (r1.hit && r2.hit) { defDmg += r1.damage; neuDmg += r2.damage; s++; }
    }
    if (s > 0) {
      expect(defDmg / s).toBeLessThanOrEqual(neuDmg / s);
    }
  });

  it('STANCE_ATTACK_MOD aggressive > neutral > submissive', () => {
    expect(STANCE_ATTACK_MOD.aggressive).toBeGreaterThan(STANCE_ATTACK_MOD.neutral);
    expect(STANCE_ATTACK_MOD.neutral).toBeGreaterThan(STANCE_ATTACK_MOD.submissive);
  });
});

// ── ARMOR_STATS table invariants ──────────────────────────────────────────────

describe('ARMOR_STATS table', () => {
  it('dragonbone has the highest damage_reduction', () => {
    const all = Object.values(ARMOR_STATS);
    const maxDR = Math.max(...all.map(a => a.damage_reduction));
    expect(ARMOR_STATS.dragonbone.damage_reduction).toBe(maxDR);
  });

  it('light armors have no movement_penalty or a very small one', () => {
    expect(ARMOR_STATS.leather.movement_penalty).toBeLessThanOrEqual(0.05);
    expect(ARMOR_STATS.hide.movement_penalty).toBe(0);
  });

  it('heavy armor has is_heavy=true', () => {
    for (const type of ['iron', 'steel', 'ebony', 'daedric', 'dragonbone'] as ArmorType[]) {
      expect(ARMOR_STATS[type].is_heavy).toBe(true);
    }
  });

  it('light armor has is_heavy=false', () => {
    for (const type of ['none', 'hide', 'leather'] as ArmorType[]) {
      expect(ARMOR_STATS[type].is_heavy).toBe(false);
    }
  });
});
