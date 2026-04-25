/**
 * CombatSystem — DoL-style turn-based combat resolution.
 * Includes stance mechanics, escape attempts, and stat-based outcomes.
 * Pure functions; no side effects, no UI imports.
 */
import { CombatEncounter, CombatParticipant, CombatStance, SimNpc } from './types';

// ── Stance modifiers ──────────────────────────────────────────────────────

interface StanceModifiers {
  attack: number;
  defense: number;
  escape: number;
  stamina_cost: number;
}

const STANCE_MODS: Record<CombatStance, StanceModifiers> = {
  aggressive: { attack: 1.5, defense: 0.7, escape: 0.5, stamina_cost: 15 },
  defensive: { attack: 0.6, defense: 1.5, escape: 0.8, stamina_cost: 8 },
  evasive: { attack: 0.4, defense: 1.0, escape: 1.8, stamina_cost: 12 },
  neutral: { attack: 1.0, defense: 1.0, escape: 1.0, stamina_cost: 10 },
  submissive: { attack: 0.2, defense: 0.5, escape: 0.3, stamina_cost: 5 },
};

// ── Create combat participants from NPCs ──────────────────────────────────

/** Create a combat participant from a SimNpc. */
export function npcToParticipant(npc: SimNpc): CombatParticipant {
  return {
    id: npc.id,
    health: npc.stats.health,
    stamina: npc.stats.stamina,
    stance: 'neutral',
    combat_skill: npc.skills.combat,
    athletics: npc.skills.athletics,
  };
}

/** Create a new combat encounter between two participants. */
export function createCombatEncounter(
  attackerId: string,
  defenderId: string
): CombatEncounter {
  return {
    attacker_id: attackerId,
    defender_id: defenderId,
    turn_count: 0,
    resolved: false,
    outcome: 'ongoing',
    log: [`Combat begins.`],
  };
}

// ── Combat resolution ────────────────────────────────────────────────────

/**
 * Resolve one turn of combat between attacker and defender.
 * Returns updated participants and encounter state.
 */
export function resolveCombatTurn(
  attacker: CombatParticipant,
  defender: CombatParticipant,
  encounter: CombatEncounter
): {
  attacker: CombatParticipant;
  defender: CombatParticipant;
  encounter: CombatEncounter;
} {
  if (encounter.resolved) {
    return { attacker, defender, encounter };
  }

  const log: string[] = [];
  let atk = { ...attacker };
  let def = { ...defender };
  const turnCount = encounter.turn_count + 1;

  const atkMods = STANCE_MODS[atk.stance];
  const defMods = STANCE_MODS[def.stance];

  // ── Attacker strikes ──
  const atkPower = (10 + atk.combat_skill * 0.3) * atkMods.attack;
  const defBlock = (5 + def.combat_skill * 0.2) * defMods.defense;
  const atkRoll = Math.random() * atkPower;
  const defRoll = Math.random() * defBlock;

  if (atkRoll > defRoll) {
    const damage = Math.round(Math.max(1, atkRoll - defRoll));
    def.health = Math.max(0, def.health - damage);
    log.push(`Attacker strikes for ${damage} damage. Defender health: ${def.health}.`);
  } else {
    log.push(`Attacker's strike is blocked.`);
  }

  // Stamina cost for attacker
  atk.stamina = Math.max(0, atk.stamina - atkMods.stamina_cost);

  // ── Defender counter-attacks (if not submissive) ──
  if (def.stance !== 'submissive''&& def.stamina > 0) {
    const counterPower = (8 + def.combat_skill * 0.25) * defMods.attack;
    const counterBlock = (5 + atk.combat_skill * 0.2) * atkMods.defense;
    const counterRoll = Math.random() * counterPower;
    const blockRoll = Math.random() * counterBlock;

    if (counterRoll > blockRoll) {
      const damage = Math.round(Math.max(1, counterRoll - blockRoll));
      atk.health = Math.max(0, atk.health - damage);
      log.push(`Defender counters for ${damage} damage. Attacker health: ${atk.health}.`);
    } else {
      log.push(`Defender's counter is blocked.`);
    }
    def.stamina = Math.max(0, def.stamina - defMods.stamina_cost);
  }

  // ── Check for escape attempt (evasive stance) ──
  let escaped = false;
  if (def.stance === 'evasive''&& def.stamina > 10) {
    const escapeChance = (def.athletics * 0.5 + 20) * defMods.escape;
    const catchChance = (atk.athletics * 0.3 + 15) * atkMods.attack;
    if (Math.random() * escapeChance > Math.random() * catchChance) {
      escaped = true;
      log.push(`Defender successfully escapes!`);
    } else {
      log.push(`Defender's escape attempt fails.`);
      def.stamina = Math.max(0, def.stamina - 10);
    }
  }

  // ── Determine outcome ──
  let outcome = encounter.outcome;
  let resolved = false;

  if (escaped) {
    outcome = 'defender_escaped';
    resolved = true;
  } else if (def.health <= 0) {
    outcome = 'attacker_wins';
    resolved = true;
    log.push(`Defender is defeated!`);
  } else if (atk.health <= 0) {
    outcome = 'defender_wins';
    resolved = true;
    log.push(`Attacker is defeated!`);
  } else if (atk.stamina <= 0 && def.stamina <= 0) {
    // Both exhausted — attacker retreats
    outcome = 'defender_wins';
    resolved = true;
    log.push(`Both combatants are exhausted. Attacker retreats.`);
  }

  return {
    attacker: atk,
    defender: def,
    encounter: {
      ...encounter,
      turn_count: turnCount,
      resolved,
      outcome,
      log: [...encounter.log, ...log],
    },
  };
}

/**
 * Simulate an entire combat encounter to completion (max turns).
 * Returns the final state of the encounter.
 */
export function simulateFullCombat(
  attacker: CombatParticipant,
  defender: CombatParticipant,
  maxTurns: number = 20
): {
  attacker: CombatParticipant;
  defender: CombatParticipant;
  encounter: CombatEncounter;
} {
  let encounter = createCombatEncounter(attacker.id, defender.id);
  let atk = { ...attacker };
  let def = { ...defender };

  for (let i = 0; i < maxTurns && !encounter.resolved; i++) {
    const result = resolveCombatTurn(atk, def, encounter);
    atk = result.attacker;
    def = result.defender;
    encounter = result.encounter;
  }

  // If max turns reached without resolution, defender wins (attacker gives up)
  if (!encounter.resolved) {
    encounter = {
      ...encounter,
      resolved: true,
      outcome: 'defender_wins',
      log: [...encounter.log, 'Combat reaches stalemate. Attacker withdraws.'],
    };
  }

  return { attacker: atk, defender: def, encounter };
}

/** Change a participant's stance. */
export function changeStance(
  participant: CombatParticipant,
  newStance: CombatStance
): CombatParticipant {
  return { ...participant, stance: newStance };
}

/** Determine AI stance selection based on health and stamina. */
export function selectAIStance(participant: CombatParticipant): CombatStance {
  if (participant.health < 20) return 'evasive';
  if (participant.stamina < 15) return 'defensive';
  if (participant.health > 60 && participant.stamina > 50) return 'aggressive';
  return 'neutral';
}
