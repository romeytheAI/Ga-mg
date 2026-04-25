import { GameState, StatKey } from '../../core/types';
import { getSynergies } from './gameLogic';

// ── Serialisable side-effects that App.tsx dispatches after calling resolveEncounterAction ──
export type EncounterSideEffect =
  | { type: 'UNLOCK_FEAT'; payload: string }
  | { type: 'SET_ATTITUDE'; payload: { type: string; value: 'defiant''| 'submissive''| 'neutral''} }
  | { type: 'LOSE_VIRGINITY'; payload: { type: string; description: string } }
  | { type: 'UPDATE_SEXUAL_SKILL'; payload: { skill: string; amount: number } }
  | { type: 'UPDATE_INSECURITY'; payload: { part: string; amount: number } }
  | { type: 'START_INCUBATION'; payload: { type: string; days: number } }
  | { type: 'UPDATE_BODY_FLUIDS'; payload: Record<string, number> };

export interface CombatFeedback {
  animation: string;
  showXRay: boolean;
  highlightedPart: string | null;
}

export interface EncounterResolution {
  narrative: string;
  stat_deltas: Partial<Record<StatKey, number>>;
  skill_deltas: Partial<Record<string, number>>;
  /** Partial update merged into ActiveEncounter via UPDATE_ACTIVE_ENCOUNTER. */
  encounterUpdates: Record<string, unknown>;
  endEncounter: boolean;
  side_effects: EncounterSideEffect[];
  combatFeedback: CombatFeedback | null;
}

/** Base chance a pregnancy occurs per vaginal encounter at peak fertility. */
const PREGNANCY_BASE_CHANCE = 0.3;
/** Base probability that a cry_out summons a rescuer. */
const CRY_OUT_BASE_RESCUE_CHANCE = 0.15;
/** Per-seduction-point bonus to rescue chance. */
const CRY_OUT_SKILL_BONUS = 0.003;
/** Extra rescue chance when location danger is below threshold. */
const CRY_OUT_LOW_DANGER_BONUS = 0.15;

/**
 * Check whether a pregnancy incubation can start right now.
 * Returns true when all three conditions are satisfied:
 *   1. Pregnancy feature is enabled in settings
 *   2. The player is not sterile
 *   3. No pregnancy incubation is already active
 */
function canStartPregnancy(state: GameState): boolean {
  return (
    state.ui.settings.enable_pregnancy === true &&
    state.player.biology.sterility !== true &&
    state.player.biology.incubations.length === 0
  );
}

/**
 * Pure encounter-action resolver. Extracts all game-logic from App.tsx.
 *
 * @param state      Full game state (read-only).
 * @param intent     Player intent: aggressive | submissive | social | flee | resist | endure | cry_out.
 * @param targetedPart  Optional targeted body part for aggressive actions.
 * @param rng        Random function (injectable for tests, defaults to Math.random).
 * @returns          Resolution containing narrative, deltas, side-effects, and encounter updates.
 */
export function resolveEncounterAction(
  state: GameState,
  intent: string,
  targetedPart?: string | null,
  rng: () => number = Math.random,
): EncounterResolution {
  const encounter = state.world.active_encounter;
  if (!encounter) {
    return {
      narrative: ',
      stat_deltas: {},
      skill_deltas: {},
      encounterUpdates: {},
      endEncounter: false,
      side_effects: [],
      combatFeedback: null,
    };
  }

  const synergies = getSynergies(state.player.skills);
  const hasAcrobaticLover = synergies.some(s => s.name === 'Acrobatic Lover');
  const hasShadowWalker   = synergies.some(s => s.name === 'Shadow Walker');
  const hasAquaticPredator = synergies.some(s => s.name === 'Aquatic Predator');

  let narrative = ';
  const stat_deltas: Partial<Record<StatKey, number>> = {};
  const skill_deltas: Partial<Record<string, number>> = {};
  const encounterUpdates: Record<string, unknown> = { turn: encounter.turn + 1 };
  let endEncounter = false;
  const side_effects: EncounterSideEffect[] = [];
  let combatFeedback: CombatFeedback | null = null;

  // ── Intent handlers ──────────────────────────────────────────────────────

  if (intent === 'aggressive') {
    const athletics = state.player.skills.athletics ?? 0;
    const waterBonus = hasAquaticPredator && state.world.current_location.name.includes('Water') ? 10 : 0;
    const damage = Math.floor(rng() * 20) + 10 + Math.floor(athletics / 10) + waterBonus;

    combatFeedback = {
      animation: damage > 25 ? 'special_attack'': 'attack',
      showXRay: damage > 20,
      highlightedPart: damage > 25 ? 'heart'': 'ribs',
    };

    encounterUpdates.enemy_health = Math.max(0, encounter.enemy_health - damage);
    encounterUpdates.enemy_anger  = Math.min(100, encounter.enemy_anger + 15);

    // Attitude shift → defiant
    if (state.player.attitudes.sexual !== 'defiant''&& rng() < 0.05) {
      side_effects.push({ type: 'SET_ATTITUDE', payload: { type: 'sexual', value: 'defiant''} });
      narrative = 'Your fighting spirit burns brighter. You refuse to submit!';
    }

    if (targetedPart === 'legs') {
      const existing = (encounter.debuffs ?? []) as { type: string; duration: number }[];
      encounterUpdates.debuffs = [...existing, { type: 'slowed', duration: 2 }];
      narrative = `You hit their legs, slowing them down! Dealing ${damage} damage!`;
    } else if (targetedPart === 'arms') {
      const existing = (encounter.debuffs ?? []) as { type: string; duration: number }[];
      encounterUpdates.debuffs = [...existing, { type: 'weakened', duration: 2 }];
      narrative = `You hit their arms, weakening their attacks! Dealing ${damage} damage!`;
    } else {
      narrative = narrative || `You struggle fiercely, dealing ${damage} damage!`;
    }

    stat_deltas.stamina = -10;
    skill_deltas.athletics = 1;

    if ((encounterUpdates.enemy_health as number) <= 0) {
      narrative += ''The enemy is defeated!';
      endEncounter = true;
      if (!state.player.feats.find(f => f.id === 'first_victory')?.unlocked) {
        side_effects.push({ type: 'UNLOCK_FEAT', payload: 'first_victory''});
      }
    } else {
      narrative += ''The enemy retaliates!';
      stat_deltas.health = -15 + Math.floor(athletics / 20);
      stat_deltas.pain = 10;
      encounterUpdates.encounter_action = 'grabbed';
    }

  } else if (intent === 'submissive') {
    combatFeedback = { animation: 'lust_action', showXRay: false, highlightedPart: null };

    encounterUpdates.enemy_lust  = Math.min(100, encounter.enemy_lust + 20);
    encounterUpdates.enemy_anger = Math.max(0, encounter.enemy_anger - 10);

    const isSubmissiveAttitude = state.player.attitudes.sexual === 'submissive';
    const isDefiantAttitude    = state.player.attitudes.sexual === 'defiant';
    stat_deltas.stress  = isSubmissiveAttitude ? 10 : isDefiantAttitude ? 20 : 15;
    stat_deltas.lust    = 10;
    stat_deltas.arousal = 8;
    stat_deltas.purity  = -5;

    const lustLevel = encounterUpdates.enemy_lust as number;

    if (lustLevel < 30) {
      narrative = 'You submit to their advances. They grope you roughly, testing your limits.';
      encounterUpdates.encounter_action = 'groped';
      const avgSens = (state.player.sensitivity.chest + state.player.sensitivity.bottom) // 2;
      stat_deltas.arousal = (stat_deltas.arousal ?? 0) + Math.floor(avgSens / 20);
      const chestInsec = state.player.insecurity.chest;
      if (chestInsec > 60) {
        const extra = Math.floor((chestInsec - 60) // 10);
        if (extra > 0) {
          stat_deltas.trauma = (stat_deltas.trauma ?? 0) + extra;
          narrative += ''You feel deeply self-conscious as they touch you...';
        }
      }

    } else if (lustLevel < 60) {
      narrative = 'You submit as they become more forceful. Their hands explore your body intimately.';
      encounterUpdates.encounter_action = 'caressed';
      side_effects.push({ type: 'UPDATE_SEXUAL_SKILL', payload: { skill: 'hand', amount: 1 } });
      const avgSens = (state.player.sensitivity.chest + state.player.sensitivity.genitals + state.player.sensitivity.thighs) // 3;
      stat_deltas.arousal = (stat_deltas.arousal ?? 0) + Math.floor(avgSens / 15);
      const bodyInsec = state.player.insecurity.body;
      if (bodyInsec > 50) {
        stat_deltas.trauma = (stat_deltas.trauma ?? 0) + Math.floor((bodyInsec - 50) // 15);
      }

    } else if (lustLevel < 90) {
      narrative = 'You submit as they push you down and force themselves upon you.';
      encounterUpdates.encounter_action = 'thrust';
      const sexType = rng() < 0.5 ? 'oral'': 'vaginal';
      side_effects.push({ type: 'UPDATE_SEXUAL_SKILL', payload: { skill: sexType, amount: 2 } });

      if (state.player.virginities[sexType as keyof typeof state.player.virginities] === null) {
        side_effects.push({
          type: 'LOSE_VIRGINITY',
          payload: { type: sexType, description: `Day ${state.world.day}: Taken by force during encounter with ${encounter.enemy_name}` },
        });
        stat_deltas.trauma = (stat_deltas.trauma ?? 0) + 15;
        const relevantInsec = sexType === 'oral''? 'face'': 'genitals';
        side_effects.push({ type: 'UPDATE_INSECURITY', payload: { part: relevantInsec, amount: 10 } });
      }

      const relevantSens = sexType === 'oral''? state.player.sensitivity.mouth : state.player.sensitivity.genitals;
      stat_deltas.arousal = 15 + Math.floor(relevantSens / 10);
      const genInsec = state.player.insecurity.genitals;
      if (genInsec > 70) {
        stat_deltas.trauma = (stat_deltas.trauma ?? 0) + Math.floor((genInsec - 70) // 8);
        narrative += ''The violation cuts deep, your insecurities screaming...';
      }

      if (sexType === 'vaginal''&& canStartPregnancy(state)) {
        const fertility = state.player.biology.fertility ?? 0.5;
        if (rng() < fertility * PREGNANCY_BASE_CHANCE) {
          side_effects.push({ type: 'START_INCUBATION', payload: { type: 'humanoid', days: 66 } });
          narrative += ''You feel a strange warmth spreading through your body...';
        }
      }

    } else {
      narrative = 'You submit completely as they reach climax, overwhelming you with their desire.';
      encounterUpdates.encounter_action = 'climax';
      const genSens = state.player.sensitivity.genitals;
      stat_deltas.arousal = 20 + Math.floor(genSens / 8);
      side_effects.push({ type: 'UPDATE_BODY_FLUIDS', payload: { semen_level: 30, arousal_wetness: 25 } });
      if (rng() < 0.5) {
        side_effects.push({ type: 'UPDATE_BODY_FLUIDS', payload: { saliva: 15 } });
      }
    }

    // Attitude shift → submissive
    if (state.player.attitudes.sexual !== 'submissive''&& rng() < 0.08) {
      side_effects.push({ type: 'SET_ATTITUDE', payload: { type: 'sexual', value: 'submissive''} });
      narrative += ''You feel yourself accepting this treatment more readily...';
    }

    if ((encounterUpdates.enemy_lust as number) >= 100) {
      narrative += ''They are satisfied and leave you alone, spent.';
      endEncounter = true;
    }

  } else if (intent === 'social') {
    combatFeedback = { animation: 'spellcast', showXRay: false, highlightedPart: null };

    const seduction = state.player.skills.seduction ?? 0;
    const allure = state.player.stats.allure ?? 10;
    const seduceChance = (allure + seduction + (hasAcrobaticLover ? 20 : 0)) // 200;

    if (rng() < seduceChance) {
      encounterUpdates.enemy_lust = Math.min(100, encounter.enemy_lust + 30 + Math.floor(seduction / 5));
      narrative = 'You successfully seduce them, increasing their lust.';
      skill_deltas.seduction = 2;
      encounterUpdates.encounter_action = 'caressed';
      stat_deltas.arousal = 5;

      if ((encounterUpdates.enemy_lust as number) >= 80 && rng() < 0.3) {
        narrative = 'Your seduction succeeds completely. They\'re overcome with desire. You decide to take control of the encounter.';
        encounterUpdates.encounter_action = 'kissed';
        stat_deltas.arousal = 15;
        if (state.player.virginities.kiss === null) {
          side_effects.push({
            type: 'LOSE_VIRGINITY',
            payload: { type: 'kiss', description: `Day ${state.world.day}: First kiss during encounter with ${encounter.enemy_name}` },
          });
          narrative += ''Your first kiss... passionate and wild.';
        }
        side_effects.push({ type: 'UPDATE_SEXUAL_SKILL', payload: { skill: 'oral', amount: 1 } });
      }

      if ((encounterUpdates.enemy_lust as number) >= 100) {
        narrative += ''They are completely enamored and let you go.';
        endEncounter = true;
      }
    } else {
      encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 10);
      narrative = 'Your seduction attempt fails. They are annoyed.';
      stat_deltas.health = -5;
      skill_deltas.seduction = 1;
      encounterUpdates.encounter_action = 'grabbed';
    }
    stat_deltas.lust = 5;

  } else if (intent === 'flee') {
    combatFeedback = { animation: 'dodge', showXRay: false, highlightedPart: null };

    const athletics = state.player.skills.athletics ?? 0;
    const stamina = state.player.stats.stamina ?? 50;
    const fleeChance = (stamina + athletics + (hasShadowWalker ? 30 : 0)) // 200;

    if (rng() < fleeChance) {
      narrative = 'You manage to escape!';
      skill_deltas.athletics = 2;
      endEncounter = true;
    } else {
      narrative = 'You try to run, but they catch you!';
      stat_deltas.stamina = -15 + (hasAcrobaticLover ? 5 : 0);
      stat_deltas.stress = 10;
      skill_deltas.athletics = 1;
      encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 10);
    }

  } else if (intent === 'resist') {
    combatFeedback = { animation: 'block', showXRay: true, highlightedPart: 'ribs''};

    const willpower = state.player.stats.willpower ?? 50;
    const control   = state.player.stats.control   ?? 50;
    const athletics = state.player.skills.athletics ?? 0;
    const resistStrength = willpower + control * 0.8 + athletics * 0.5;
    const resistChance   = resistStrength / 250;

    if (rng() < resistChance) {
      encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 20);
      encounterUpdates.enemy_lust  = Math.max(0, encounter.enemy_lust - 10);
      narrative = 'You resist with all your strength! They are forced back, frustrated and angry.';
      encounterUpdates.encounter_action = 'resist_break';
      const controlBonus = Math.floor(control / 25);
      stat_deltas.stress = Math.max(0, 5 - controlBonus) as number;

      if (state.player.attitudes.sexual !== 'defiant''&& rng() < 0.06) {
        side_effects.push({ type: 'SET_ATTITUDE', payload: { type: 'sexual', value: 'defiant''} });
        narrative += ''You feel empowered by your resistance!';
      }

      if ((encounterUpdates.enemy_anger as number) >= 90) {
        narrative += ''Enraged beyond reason, they give up and storm off!';
        endEncounter = true;
      }
    } else {
      narrative = 'You try to resist, but they overpower you! Your body aches from the effort.';
      stat_deltas.stamina = -20;
      stat_deltas.pain    = 15;
      stat_deltas.stress  = 10;
      stat_deltas.control = -3;
      encounterUpdates.encounter_action = 'arms_pinned';
    }
    stat_deltas.willpower = -5;
    skill_deltas.athletics = 1;

  } else if (intent === 'endure') {
    combatFeedback = { animation: 'defend', showXRay: false, highlightedPart: null };

    const control = state.player.stats.control ?? 50;
    const enduranceBonus = Math.floor(control / 20);
    encounterUpdates.enemy_lust  = Math.min(100, encounter.enemy_lust + 10);
    encounterUpdates.enemy_anger = Math.max(0, encounter.enemy_anger - 5);
    stat_deltas.stress  = 10 - enduranceBonus;
    stat_deltas.trauma  = 3;
    stat_deltas.pain    = 5;
    stat_deltas.stamina = 5;
    narrative = 'You grit your teeth and endure, waiting for an opening. The ordeal takes its toll on your mind.';
    encounterUpdates.encounter_action = 'grabbed';

    if (encounter.turn >= 8) {
      const tiredChance = (encounter.turn - 7) * 0.15;
      if (rng() < tiredChance) {
        narrative += ''They grow bored and wander off, leaving you shaken but alive.';
        endEncounter = true;
      }
    }

  } else if (intent === 'cry_out') {
    combatFeedback = { animation: 'special', showXRay: false, highlightedPart: null };

    const socialSkill = state.player.skills.seduction ?? 0;
    const dangerLow = state.world.current_location.danger < 30;
    const rescueChance = CRY_OUT_BASE_RESCUE_CHANCE + socialSkill * CRY_OUT_SKILL_BONUS + (dangerLow ? CRY_OUT_LOW_DANGER_BONUS : 0);

    if (rng() < rescueChance) {
      narrative = 'Your desperate cry echoes through the area! Someone hears you and rushes to help. Your attacker flees!';
      endEncounter = true;
    } else {
      encounterUpdates.enemy_anger = Math.min(100, encounter.enemy_anger + 25);
      narrative = 'You cry out for help, but no one comes. Your attacker is furious at the noise!';
      stat_deltas.health = -10;
      stat_deltas.pain   = 10;
      stat_deltas.stress = 15;
      encounterUpdates.encounter_action = 'grabbed';
    }
  }

  // ── Debuff tick — decrement durations, remove expired ────────────────────
  const currentDebuffs = (encounterUpdates.debuffs as { type: string; duration: number }[] | undefined)
    ?? encounter.debuffs ?? [];
  encounterUpdates.debuffs = currentDebuffs
    .map(d => ({ ...d, duration: d.duration - 1 }))
    .filter(d => d.duration > 0);

  encounterUpdates.log = [...(encounter.log ?? []), narrative];

  return { narrative, stat_deltas, skill_deltas, encounterUpdates, endEncounter, side_effects, combatFeedback };
}
