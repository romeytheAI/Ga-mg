/**
 * Encounter Action Escalation Engine
 *
 * Determines which encounter_action the enemy performs each turn based on:
 *   - Current turn number (escalation over time)
 *   - Enemy lust / anger / health state
 *   - Enemy type (humanoid, beast, tentacle, etc.)
 *   - Player stance (submissive players get different actions)
 *   - Previous encounter_action (no exact repeats, progression)
 *
 * Original system — all logic, progression tables, and action
 * selection algorithms are independently authored.
 */

import { EncounterAction, ActiveEncounter } from '../core/types';

// ── Enemy archetype classification ────────────────────────────────────────

type EnemyArchetype = 'humanoid''| 'beast''| 'tentacle''| 'refined';

function classifyEnemy(enemyType: string): EnemyArchetype {
  const t = enemyType.toLowerCase();
  if (t.includes('tentacle') || t.includes('lurk') || t.includes('slime')) return 'tentacle';
  if (t.includes('dog') || t.includes('wolf') || t.includes('boar') || t.includes('beast') || t.includes('feral')) return 'beast';
  if (t.includes('noble') || t.includes('cultist')) return 'refined';
  return 'humanoid';
}

// ── Action pools per archetype × escalation phase ─────────────────────────

/** Phase 1: Initial contact (turns 1–2) */
const PHASE1: Record<EnemyArchetype, EncounterAction[]> = {
  humanoid:  ['grabbed','arms_pinned','groped'],
  beast:     ['grabbed','bitten','scratched'],
  tentacle:  ['grabbed','restrained_tied','leg_spread'],
  refined:   ['caressed','kissed','grabbed'],
};

/** Phase 2: Escalation (turns 3–4) */
const PHASE2: Record<EnemyArchetype, EncounterAction[]> = {
  humanoid:  ['groped','clothing_tear','spanked','hair_pulled','arms_pinned'],
  beast:     ['prone','bitten','scratched','mounted','licked'],
  tentacle:  ['restrained_tied','leg_spread','groped','licked','lifted'],
  refined:   ['groped','kissed','caressed','clothing_tear','choked'],
};

/** Phase 3: Domination (turns 5–7) */
const PHASE3: Record<EnemyArchetype, EncounterAction[]> = {
  humanoid:  ['bent_over','prone','leg_spread','thrust','choked','mounted'],
  beast:     ['mounted','prone','bitten','thrust','licked'],
  tentacle:  ['lifted','thrust','oral','restrained_tied','prone'],
  refined:   ['bent_over','thrust','oral','choked','spanked'],
};

/** Phase 4: Climax proximity (turns 8+ or lust > 80) */
const PHASE4: Record<EnemyArchetype, EncounterAction[]> = {
  humanoid:  ['thrust','climax','prone','mounted'],
  beast:     ['thrust','climax','mounted','bitten'],
  tentacle:  ['thrust','climax','lifted','oral'],
  refined:   ['thrust','climax','oral','bent_over'],
};

// ── Anger-driven overrides ────────────────────────────────────────────────

/** When anger is high, enemy is more violent regardless of phase */
const ANGER_ACTIONS: Record<EnemyArchetype, EncounterAction[]> = {
  humanoid:  ['choked','hair_pulled','spanked','arms_pinned','prone'],
  beast:     ['bitten','scratched','mounted','prone'],
  tentacle:  ['restrained_tied','choked','lifted','leg_spread'],
  refined:   ['choked','spanked','hair_pulled','arms_pinned'],
};

// ── Player stance modifiers ───────────────────────────────────────────────

/** Submissive players get softer actions mixed in */
const SUBMISSIVE_BIAS: EncounterAction[] = ['caressed','kissed','groped','licked'];
/** Aggressive players get punished */
const AGGRESSIVE_RETALIATION: EncounterAction[] = ['choked','arms_pinned','spanked','hair_pulled','prone'];

// ── Core selection logic ──────────────────────────────────────────────────

function getPhasePool(arch: EnemyArchetype, turn: number, enemyLust: number): EncounterAction[] {
  if (turn >= 8 || enemyLust > 80) return PHASE4[arch];
  if (turn >= 5) return PHASE3[arch];
  if (turn >= 3) return PHASE2[arch];
  return PHASE1[arch];
}

function pickFromPool(
  pool: EncounterAction[],
  previousAction: EncounterAction | undefined,
  rng: number
): EncounterAction {
  // Filter out the previous action to avoid exact repeats
  const candidates = previousAction
    ? pool.filter(a => a !== previousAction)
    : pool;
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(rng * list.length)];
}

/**
 * Determine the enemy's encounter action for the current turn.
 * Called after the player's intent has been resolved, to set the
 * encounter_action for the next render frame.
 *
 * @param encounter  Current encounter state (post-intent resolution)
 * @param playerIntent  The intent the player just used
 * @returns The EncounterAction to assign to encounter.encounter_action
 */
export function resolveEnemyAction(
  encounter: ActiveEncounter,
  playerIntent: string,
): EncounterAction {
  const arch = classifyEnemy(encounter.enemy_type);
  const turn = encounter.turn;
  const lust = encounter.enemy_lust;
  const anger = encounter.enemy_anger;
  const prev = encounter.encounter_action;
  const stance = encounter.player_stance;
  const rng = Math.random();

  // ── Special-case: flee attempt failed → enemy grabs/pins ──
  if (playerIntent === 'flee') {
    return pickFromPool(['grabbed','arms_pinned','hair_pulled'], prev, rng);
  }

  // ── Special-case: cry_out failed → enemy punishes ──
  if (playerIntent === 'cry_out') {
    return pickFromPool(['choked','grabbed','hair_pulled','arms_pinned'], prev, rng);
  }

  // ── Special-case: resist succeeded → resist_break ──
  if (playerIntent === 'resist') {
    // The actual resist_break is set by the caller on success;
    // on failure, enemy retaliates
    return pickFromPool(AGGRESSIVE_RETALIATION, prev, rng);
  }

  // ── High anger override (> 70): enemy is violent ──
  if (anger > 70) {
    return pickFromPool(ANGER_ACTIONS[arch], prev, rng);
  }

  // ── Stance modifier blend ──
  let pool = getPhasePool(arch, turn, lust);

  if (stance === 'submissive''&& rng < 0.4) {
    // 40% chance to use softer actions when player is submissive
    pool = SUBMISSIVE_BIAS;
  } else if (stance === 'aggressive''&& rng < 0.3) {
    // 30% chance to punish aggressive stance
    pool = AGGRESSIVE_RETALIATION;
  }

  // ── Near-climax: force climax action ──
  if (lust >= 95) {
    return 'climax';
  }

  return pickFromPool(pool, prev, rng);
}

/**
 * Determine debuffs to apply based on the encounter action.
 * Returns new debuffs to merge into the encounter.
 */
export function actionDebuffs(action: EncounterAction): { type: string; duration: number }[] {
  switch (action) {
    case 'choked':
      return [{ type: 'stunned', duration: 1 }];
    case 'restrained_tied':
      return [{ type: 'slowed', duration: 3 }];
    case 'scratched':
    case 'bitten':
      return [{ type: 'bleeding', duration: 2 }];
    case 'mounted':
    case 'prone':
      return [{ type: 'slowed', duration: 1 }];
    default:
      return [];
  }
}

/**
 * Get the stat deltas the enemy's action inflicts on the player.
 */
export function actionStatDelta(action: EncounterAction): Record<string, number> {
  switch (action) {
    case 'grabbed':       return { pain: 3, stress: 5 };
    case 'groped':        return { lust: 5, stress: 3, arousal: 5 };
    case 'thrust':        return { lust: 10, arousal: 12, pain: 5, purity: -3 };
    case 'oral':          return { lust: 8, arousal: 10, stress: 5, purity: -2 };
    case 'kissed':        return { lust: 4, arousal: 3 };
    case 'climax':        return { lust: 15, arousal: 20, stress: 8, purity: -5 };
    case 'clothing_tear': return { stress: 8 };
    case 'leg_spread':    return { stress: 6, arousal: 4, lust: 3 };
    case 'arms_pinned':   return { stress: 5, pain: 3 };
    case 'prone':         return { pain: 5, stress: 7, stamina: -5 };
    case 'bent_over':     return { stress: 6, arousal: 4, pain: 3 };
    case 'lifted':        return { stress: 8, pain: 4 };
    case 'caressed':      return { lust: 6, arousal: 8 };
    case 'bitten':        return { pain: 10, health: -5, stress: 6 };
    case 'spanked':       return { pain: 6, stress: 4 };
    case 'choked':        return { pain: 8, health: -3, stress: 10, stamina: -8 };
    case 'hair_pulled':   return { pain: 6, stress: 7 };
    case 'scratched':     return { pain: 8, health: -4, stress: 5 };
    case 'licked':        return { lust: 5, arousal: 7, hygiene: -3 };
    case 'restrained_tied': return { stress: 8, stamina: -3 };
    case 'mounted':       return { pain: 5, lust: 6, arousal: 8, stress: 8, stamina: -5 };
    case 'resist_break':  return { stress: 12, pain: 5 };
    default:              return {};
  }
}
