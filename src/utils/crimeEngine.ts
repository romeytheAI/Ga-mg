/**
 * crimeEngine.ts — game-layer bridge for the crime / justice system.
 *
 * Sits between CrimeSystem (pure sim) and the game reducers. All functions
 * are pure (injectable RNG) and fully testable without DOM or React.
 *
 * Elder Scrolls flavor: Hold guards, jarls, bounties in septims, Thieves Guild
 * contacts, authentic guard dialogue.
 *
 * @see src/sim/CrimeSystem.ts — underlying bounty / guard engine
 * @see src/reducers/gameReducer.ts — COMMIT_CRIME, GUARD_ENCOUNTER, SERVE_JAIL
 */

import { GameState, StatKey } from '../types';
import {
  CrimeType,
  FactionId,
  GuardAlertLevel,
  CriminalRecord,
} from '../sim/types';
import {
  commitCrime,
  defaultCriminalRecord,
  defaultGuardState,
  escalateGuardAlert,
  escapeChance,
  calculateSentence,
  payBounty,
  serveSentence,
  guardStandDown,
  tickGuardPursuit,
  wantedLabel,
} from '../sim/CrimeSystem';

// ── Side effects ───────────────────────────────────────────────────────────────

export type CrimeSideEffect =
  | { type: 'GUARD_ALERTED'; payload: { faction_id: FactionId; level: GuardAlertLevel } }
  | { type: 'BOUNTY_ADDED'; payload: { faction_id: FactionId; amount: number } }
  | { type: 'BOUNTY_CLEARED'; payload: { faction_id: FactionId } }
  | { type: 'JAIL_STARTED'; payload: { days: number; faction_id: FactionId } }
  | { type: 'ESCAPED_PURSUIT' }
  | { type: 'THIEVES_GUILD_NOTIFIED'; payload: { crime_type: CrimeType } }
  | { type: 'WANTED_POSTER'; payload: { faction_id: FactionId } }
  | { type: 'NOTORIETY_INCREASE'; payload: { amount: number } };

// ── Resolution types ───────────────────────────────────────────────────────────

export interface CrimeResolution {
  narrative: string;
  stat_deltas: Partial<Record<StatKey, number>>;
  side_effects: CrimeSideEffect[];
  crimeUpdates: Record<string, unknown>;
}

// ── Guard encounter action ─────────────────────────────────────────────────────

/** The player's chosen response when stopped by a guard. */
export type GuardEncounterAction = 'pay_fine' | 'resist_arrest' | 'flee' | 'bribe';

// ── Escape method ──────────────────────────────────────────────────────────────

/** Method used to escape jail or break out of pursuit. */
export type EscapeMethod = 'lockpick' | 'force' | 'stealth' | 'magic';

// ── Bounty status ──────────────────────────────────────────────────────────────

export interface BountyStatus {
  total_bounty: number;
  wanted_label: string;
  wanted_factions: FactionId[];
  faction_bounties: Partial<Record<FactionId, number>>;
  is_wanted: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** Stat drain per day while serving a jail sentence. */
const JAIL_DRAIN_PER_DAY: Partial<Record<StatKey, number>> = {
  willpower: -8,
  stress:    10,
  health:    -5,
  hygiene:   -15,
};

/** Escape method configuration: relevant skill, base chance, and costs. */
const ESCAPE_CONFIG: Record<EscapeMethod, {
  skill: keyof GameState['player']['skills'];
  base_chance: number;
  stress_cost: number;
  stamina_cost: number;
}> = {
  lockpick: { skill: 'skulduggery', base_chance: 0.25, stress_cost: 15, stamina_cost: 10 },
  stealth:  { skill: 'skulduggery', base_chance: 0.20, stress_cost: 10, stamina_cost: 15 },
  force:    { skill: 'athletics',   base_chance: 0.15, stress_cost: 20, stamina_cost: 30 },
  magic:    { skill: 'skulduggery', base_chance: 0.10, stress_cost: 5,  stamina_cost: 20 },
};

/** Base probability that a bribe attempt succeeds. */
const BASE_BRIBE_CHANCE = 0.30;

/** All known faction IDs in the world. */
const ALL_FACTIONS: FactionId[] = [
  'town_guard', 'thieves_guild', 'merchants_guild', 'church',
  'nobility', 'underground', 'academia', 'wilderness_folk',
];

// ── Internal helpers ──────────────────────────────────────────────────────────

function getPlayerRecord(state: GameState): CriminalRecord {
  return state.sim_world?.criminal_records?.['player'] ?? defaultCriminalRecord();
}

function getFactionBounty(record: CriminalRecord, factionId: FactionId): number {
  return record.crimes
    .filter(c => c.faction_id === factionId && c.witnessed && !c.cleared)
    .reduce((sum, c) => sum + c.bounty_value, 0);
}

function getHoldName(factionId: FactionId): string {
  const holdNames: Record<FactionId, string> = {
    town_guard:      'the Hold Guard',
    thieves_guild:   'the Guild',
    merchants_guild: "the Merchants' Quarter",
    church:          "the Divines' authority",
    nobility:        "the Jarl's court",
    underground:     'the Underground',
    academia:        'the Arcane Academy',
    wilderness_folk: 'the wilderness clans',
  };
  return holdNames[factionId];
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function locationToFaction(locationId: string, state: GameState): FactionId {
  const loc = state.sim_world?.locations?.find(l => l.id === locationId);
  if (!loc) return 'town_guard';
  const map: Partial<Record<string, FactionId>> = {
    town:        'town_guard',
    market:      'merchants_guild',
    temple:      'church',
    school:      'academia',
    alleyway:    'underground',
    sewers:      'underground',
    wilderness:  'wilderness_folk',
    moor:        'wilderness_folk',
  };
  return map[loc.type] ?? 'town_guard';
}

// ── Narrative pools ───────────────────────────────────────────────────────────

const CRIME_NARRATIVES_UNWITNESSED: Record<CrimeType, string[]> = {
  theft: [
    'Your fingers move like shadows. The mark never felt a thing.',
    'You slip the coin purse free and melt back into the crowd. No one saw.',
    'A clean lift. The merchandise is yours now, and no one is the wiser.',
  ],
  assault: [
    'You strike before they can react, leaving them reeling in the alley. No witnesses.',
    'A swift, brutal exchange. The street is empty.',
    'You leave them groaning in the dirt. The shadows kept your secret.',
  ],
  murder: [
    'The deed is done. You drag the body from sight and pray no one noticed.',
    'A perfect crime — or so you tell yourself, hands still trembling.',
    'The silence that follows feels heavier than you expected.',
  ],
  trespassing: [
    'You slip past the fence unseen, heart hammering.',
    "The guards pass within arm's reach and never notice.",
    'You explore the forbidden space alone, undiscovered.',
  ],
  contraband: [
    'The package changes hands with practiced ease. No guards in sight.',
    'You tuck the skooma vials into your pack. Clean.',
    'Black market goods, moved without incident.',
  ],
  vandalism: [
    'You leave your mark on the wall and slip away before anyone stirs.',
    'A broken window, a ruined statue — and not a soul awake to see it.',
    'The destruction is satisfying. The silence more so.',
  ],
  bribery: [
    "The coin disappears into the official's palm with barely a word exchanged.",
    'A discreet arrangement, sealed with gold and silence.',
    'Corruption, conducted quietly — the Tamrielic way.',
  ],
  espionage: [
    'You memorise the documents and slip away, unseen.',
    'The intelligence is yours. The target never suspected.',
    "A ghost in their records. They won't know until it's far too late.",
  ],
};

const CRIME_NARRATIVES_WITNESSED: Record<CrimeType, string[]> = {
  theft: [
    '"Thief!" The cry cuts through the market. The Hold Guard will have a bounty on you by nightfall.',
    "A merchant's scream follows you into the alley. You've been seen — and now you're wanted.",
    'Your cover is blown. Someone saw your hand in the wrong pocket.',
  ],
  assault: [
    '"Stop right there, criminal scum!" A guard rounds the corner as blood drips from your knuckles.',
    'The victim screams for the guard. You run, but the bounty is already earned.',
    'Witnesses scatter. Your face will be on every wanted board in the hold.',
  ],
  murder: [
    '"Murderer!" The word chases you through the streets like a curse. There is no taking this back.',
    "They found the body before you expected. The cry goes up — you're wanted.",
    'Someone saw. A scream, then running footsteps. The guards will hunt you to the ends of Tamriel.',
  ],
  trespassing: [
    '"You there — halt!" A guard spots your shadow where it should not be.',
    'You trip an alarm. The Hold Guard will want words with you.',
    'Spotted. You scramble over the wall as shouts echo behind you.',
  ],
  contraband: [
    '"Contraband in the hold — you\'re coming with me." An undercover agent seizes your arm.',
    "The guard's eyes drop to your pack, then back to your face. They know.",
    "You've been set up. Arrest is imminent.",
  ],
  vandalism: [
    '"What in Oblivion—" A guard rounds the corner as you finish your work. Caught.',
    'Your vandalism draws a crowd, then a guard. You run, but they\'ve seen your face.',
    'The owner catches you in the act and screams for the authorities.',
  ],
  bribery: [
    '"Trying to bribe an officer of the law? That\'s another charge, criminal."',
    'Someone witnessed the exchange and reported it. You\'re wanted now.',
    'The attempted bribery costs you dearly — the official is honest, or already paid.',
  ],
  espionage: [
    '"We\'ve been watching you." An agent steps from the shadows.',
    'Your cover is blown. The intelligence service knows your face.',
    'Caught with stolen documents. This is a grave offense in any hold.',
  ],
};

// ── resolveCrimeCommit ────────────────────────────────────────────────────────

/**
 * Commit a crime, generating bounty and guard escalation if witnessed.
 *
 * @param state     - Full game state (read-only)
 * @param crimeType - Type of crime committed
 * @param factionId - Faction whose law is being broken
 * @param witnessed - Whether the crime was observed by someone
 * @param rng       - Injectable RNG (deterministic testing)
 */
export function resolveCrimeCommit(
  state: GameState,
  crimeType: CrimeType,
  factionId: FactionId,
  witnessed: boolean,
  rng: () => number = Math.random,
): CrimeResolution {
  const record = getPlayerRecord(state);
  const turn = state.world.turn_count;

  const updatedRecord = commitCrime(record, crimeType, factionId, turn, witnessed);

  // The just-added crime is the last in the array
  const newCrime = updatedRecord.crimes[updatedRecord.crimes.length - 1];
  const bountyAdded = newCrime.bounty_value;
  const severity = newCrime.severity;

  // Escalate guard state when the crime was witnessed
  const prevGuard = record.guard_state ?? defaultGuardState(factionId);
  const currentFactionBounty = getFactionBounty(updatedRecord, factionId);
  const updatedGuard = witnessed
    ? escalateGuardAlert(prevGuard, currentFactionBounty, crimeType)
    : prevGuard;

  // Stat effects — fear, stress, moral weight
  const stat_deltas: Partial<Record<StatKey, number>> = {
    stress: witnessed ? 10 : 5,
  };

  if (crimeType === 'murder') {
    stat_deltas.trauma = 15;
    stat_deltas.corruption = 8;
    stat_deltas.stress = (stat_deltas.stress ?? 0) + 15;
    stat_deltas.willpower = -5;
  } else if (crimeType === 'assault') {
    stat_deltas.trauma = 5;
    stat_deltas.corruption = 3;
  } else if (crimeType === 'espionage') {
    stat_deltas.stress = (stat_deltas.stress ?? 0) + 5;
  }

  // Suppress minor stress for a practiced thief (skulduggery buffers stress)
  if (crimeType === 'theft' || crimeType === 'contraband') {
    const skuld = state.player.skills.skulduggery ?? 0;
    stat_deltas.stress = Math.max(1, (stat_deltas.stress ?? 0) - Math.floor(skuld / 20));
  }

  // Side effects
  const side_effects: CrimeSideEffect[] = [];

  if (witnessed && bountyAdded > 0) {
    side_effects.push({
      type: 'BOUNTY_ADDED',
      payload: { faction_id: factionId, amount: bountyAdded },
    });
    side_effects.push({
      type: 'GUARD_ALERTED',
      payload: { faction_id: factionId, level: updatedGuard.alert_level },
    });

    if (currentFactionBounty >= 150) {
      side_effects.push({ type: 'WANTED_POSTER', payload: { faction_id: factionId } });
    }

    const notorietyGain = Math.ceil(severity / 15);
    side_effects.push({ type: 'NOTORIETY_INCREASE', payload: { amount: notorietyGain } });
  }

  // Thieves Guild takes notice of theft/contraband
  if ((crimeType === 'theft' || crimeType === 'contraband') && rng() < 0.15) {
    side_effects.push({ type: 'THIEVES_GUILD_NOTIFIED', payload: { crime_type: crimeType } });
  }

  const narrative = witnessed
    ? pickRandom(CRIME_NARRATIVES_WITNESSED[crimeType], rng)
    : pickRandom(CRIME_NARRATIVES_UNWITNESSED[crimeType], rng);

  const finalRecord: CriminalRecord = { ...updatedRecord, guard_state: updatedGuard };

  const crimeUpdates: Record<string, unknown> = {
    criminal_record: finalRecord,
    bounty_delta: bountyAdded,
    wanted_factions: updatedRecord.wanted_by,
    guard_alert_level: updatedGuard.alert_level,
    notoriety_delta: witnessed ? Math.ceil(severity / 15) : 0,
  };

  return { narrative, stat_deltas, side_effects, crimeUpdates };
}

// ── resolveGuardEncounter ─────────────────────────────────────────────────────

/**
 * Resolve a guard confrontation. The player chooses to pay the fine,
 * resist arrest, flee, or attempt a bribe.
 *
 * @param state      - Full game state (read-only)
 * @param guardNpcId - ID of the guard NPC (used for faction lookup)
 * @param action     - Player's chosen response
 * @param rng        - Injectable RNG
 */
export function resolveGuardEncounter(
  state: GameState,
  guardNpcId: string,
  action: GuardEncounterAction,
  rng: () => number = Math.random,
): CrimeResolution {
  const record = getPlayerRecord(state);

  // Determine the guard's faction from the NPC record, defaulting to town_guard
  const guardNpc = state.sim_world?.npcs?.find(n => n.id === guardNpcId);
  const factionId: FactionId = (guardNpc?.job === 'guard' ? 'town_guard' : 'town_guard') as FactionId;

  const factionBounty = getFactionBounty(record, factionId);
  const sentence = calculateSentence(record, factionId);
  const holdName = getHoldName(factionId);

  const stat_deltas: Partial<Record<StatKey, number>> = {};
  const side_effects: CrimeSideEffect[] = [];
  let narrative = '';
  let crimeUpdates: Record<string, unknown> = {};

  switch (action) {
    // ── Pay Fine ────────────────────────────────────────────────────────────
    case 'pay_fine': {
      const fineAmount = factionBounty; // Fine equals the outstanding bounty
      if (state.player.gold < fineAmount) {
        narrative = pickRandom([
          `"Your coin purse is lighter than your crimes, thief. It's the dungeon for you." The guard reaches for your wrists.`,
          `"Not enough gold? Then you'll pay with your time." The shackles click shut.`,
          `You count your coins — ${state.player.gold} septims. The fine is ${fineAmount}. Not nearly enough.`,
        ], rng);
        const clearedRecord = serveSentence(record, factionId);
        crimeUpdates = {
          criminal_record: { ...clearedRecord, guard_state: null },
          gold_delta: 0,
          jail_sentence: sentence,
          wanted_factions: clearedRecord.wanted_by,
        };
        stat_deltas.stress = 20;
        side_effects.push({ type: 'JAIL_STARTED', payload: { days: sentence, faction_id: factionId } });
      } else {
        const { record: cleared } = payBounty(record, factionId);
        narrative = pickRandom([
          `"See that you walk a straighter path." The guard pockets your ${fineAmount} septims and waves you off.`,
          `"Fine paid. Don't let me see your face near the market again." ${fineAmount} septims lighter, you're free.`,
          `The guard counts your coins — ${fineAmount} septims — and stamps the release paper. "Next time it's the dungeon."`,
        ], rng);
        crimeUpdates = {
          criminal_record: { ...cleared, guard_state: null },
          gold_delta: fineAmount === 0 ? 0 : -fineAmount,
          bounty_delta: -factionBounty,
          wanted_factions: cleared.wanted_by,
        };
        stat_deltas.stress = -5;
        side_effects.push({ type: 'BOUNTY_CLEARED', payload: { faction_id: factionId } });
      }
      break;
    }

    // ── Resist Arrest ────────────────────────────────────────────────────────
    case 'resist_arrest': {
      const athletics = state.player.skills.athletics ?? 0;
      const resistChance = Math.max(0.05, Math.min(0.60, 0.10 + athletics * 0.004));

      if (rng() < resistChance) {
        // Escape — but assaulting a guard adds bounty
        const assaultRecord = commitCrime(record, 'assault', factionId, state.world.turn_count, true);
        const escapedGuard = guardStandDown(record.guard_state ?? defaultGuardState(factionId));
        const escalatedGuard = escalateGuardAlert(escapedGuard, factionBounty + 50, 'assault');
        narrative = pickRandom([
          '"You\'ll regret this, villain!" You break free from the guard\'s grip and sprint into the alley.',
          'You drive an elbow into the guard\'s gut and run for your life. The shout of alarm follows.',
          'A desperate struggle — you tear free and vanish into the crowd.',
        ], rng);
        crimeUpdates = {
          criminal_record: { ...assaultRecord, guard_state: escalatedGuard },
          bounty_delta: 50,
          wanted_factions: assaultRecord.wanted_by,
          guard_alert_level: escalatedGuard.alert_level,
          escaped: true,
        };
        stat_deltas.stamina = -20;
        stat_deltas.stress = 15;
        side_effects.push({ type: 'GUARD_ALERTED', payload: { faction_id: factionId, level: escalatedGuard.alert_level } });
        side_effects.push({ type: 'BOUNTY_ADDED', payload: { faction_id: factionId, amount: 50 } });
        side_effects.push({ type: 'NOTORIETY_INCREASE', payload: { amount: 5 } });
      } else {
        // Overpowered — arrested and jailed
        const clearedRecord = serveSentence(record, factionId);
        narrative = pickRandom([
          '"That\'s enough! Chain them!" The guards overpower you with practiced ease.',
          'You struggle, but there are too many. You\'re dragged toward the dungeon.',
          '"Resisting arrest, are we? That\'ll add time." The guard smiles coldly.',
        ], rng);
        crimeUpdates = {
          criminal_record: { ...clearedRecord, guard_state: null },
          jail_sentence: sentence,
          wanted_factions: clearedRecord.wanted_by,
        };
        stat_deltas.health = -15;
        stat_deltas.stamina = -20;
        stat_deltas.stress = 25;
        stat_deltas.pain = 10;
        side_effects.push({ type: 'JAIL_STARTED', payload: { days: sentence, faction_id: factionId } });
      }
      break;
    }

    // ── Flee ─────────────────────────────────────────────────────────────────
    case 'flee': {
      const athletics = state.player.skills.athletics ?? 0;
      const guardPursuit = record.guard_state?.pursuit_stamina ?? 100;
      const chance = escapeChance(athletics, guardPursuit);

      if (rng() < chance) {
        const stoodDown = guardStandDown(record.guard_state ?? defaultGuardState(factionId));
        narrative = pickRandom([
          'You duck into a narrow alleyway and press against the wall. Footsteps thunder past. Free — for now.',
          'Fleet-footed and desperate, you outpace the armoured guards and lose them in the market crowd.',
          'You vault a low wall and sprint through the back streets. The shouting fades. Escaped.',
        ], rng);
        crimeUpdates = {
          criminal_record: { ...record, guard_state: stoodDown },
          guard_alert_level: 'unaware',
          escaped: true,
        };
        stat_deltas.stamina = -20;
        stat_deltas.stress = 5;
        side_effects.push({ type: 'ESCAPED_PURSUIT' });
      } else {
        const ticcedGuard = tickGuardPursuit(record.guard_state ?? defaultGuardState(factionId), 'player');
        const clearedRecord = serveSentence(record, factionId);
        narrative = pickRandom([
          `"You can't outrun the law!" The guard tackles you to the ground.`,
          "Your legs burn, but it's not enough. The guards of " + holdName + " are relentless.",
          'A guard steps out of a side street directly into your path. Trapped.',
        ], rng);
        crimeUpdates = {
          criminal_record: { ...clearedRecord, guard_state: ticcedGuard },
          jail_sentence: sentence,
          wanted_factions: clearedRecord.wanted_by,
        };
        stat_deltas.stamina = -25;
        stat_deltas.health = -10;
        stat_deltas.stress = 20;
        side_effects.push({ type: 'JAIL_STARTED', payload: { days: sentence, faction_id: factionId } });
      }
      break;
    }

    // ── Bribe ─────────────────────────────────────────────────────────────────
    case 'bribe': {
      const skulduggery = state.player.skills.skulduggery ?? 0;
      const silverTongue = state.player.perks_flaws.silver_tongue;
      const bribeAmount = Math.max(10, Math.floor(factionBounty * 0.75));

      const bribeChance = Math.max(0.05, Math.min(0.85,
        BASE_BRIBE_CHANCE
        + skulduggery * 0.003
        + (silverTongue ? 0.10 : 0)
        - (factionBounty / 500),
      ));

      if (state.player.gold < bribeAmount) {
        narrative = pickRandom([
          '"That\'s an insult, not a bribe." The guard reaches for the shackles.',
          '"What is this? I\'ve seen beggars offer more."',
          `You can't afford a meaningful bribe — only ${state.player.gold} septims to your name.`,
        ], rng);
        crimeUpdates = {
          criminal_record: record,
          jail_sentence: sentence,
          wanted_factions: record.wanted_by,
        };
        stat_deltas.stress = 15;
        side_effects.push({ type: 'JAIL_STARTED', payload: { days: sentence, faction_id: factionId } });
      } else if (rng() < bribeChance) {
        const { record: cleared } = payBounty(record, factionId);
        narrative = pickRandom([
          `The guard pockets your ${bribeAmount} septims without meeting your eyes. "I didn't see anything."`,
          `"We'll call it a... handling fee." The guard counts the coins and steps aside.`,
          `"Best forgotten." The guard palms the gold and turns away.`,
        ], rng);
        crimeUpdates = {
          criminal_record: { ...cleared, guard_state: null },
          gold_delta: -bribeAmount,
          bounty_delta: -factionBounty,
          wanted_factions: cleared.wanted_by,
        };
        stat_deltas.stress = -5;
        side_effects.push({ type: 'BOUNTY_CLEARED', payload: { faction_id: factionId } });
      } else {
        // Bribe failed — caught trying to bribe, earns extra charge + loses the gold
        const briberyRecord = commitCrime(record, 'bribery', factionId, state.world.turn_count, true);
        const newSentence = calculateSentence(briberyRecord, factionId);
        narrative = pickRandom([
          '"Trying to bribe an officer of the law? That\'s another charge, criminal."',
          `The guard pockets your ${bribeAmount} septims — then arrests you anyway.`,
          '"I cannot be bought." The guard signals to their partner. "Add attempted bribery to the list."',
        ], rng);
        crimeUpdates = {
          criminal_record: briberyRecord,
          gold_delta: -bribeAmount, // Gold lost even on failed bribe
          jail_sentence: newSentence,
          wanted_factions: briberyRecord.wanted_by,
        };
        stat_deltas.stress = 20;
        side_effects.push({ type: 'JAIL_STARTED', payload: { days: newSentence, faction_id: factionId } });
        side_effects.push({ type: 'BOUNTY_ADDED', payload: { faction_id: factionId, amount: 35 } });
      }
      break;
    }
  }

  return { narrative, stat_deltas, side_effects, crimeUpdates };
}

// ── resolveJailTime ───────────────────────────────────────────────────────────

/**
 * Serve a jail sentence. Clears all outstanding crimes, applies stat penalties.
 *
 * @param state - Full game state
 * @param days  - Number of days to serve
 * @param rng   - Injectable RNG
 */
export function resolveJailTime(
  state: GameState,
  days: number,
  rng: () => number = Math.random,
): CrimeResolution {
  const record = getPlayerRecord(state);

  // Stat drain scaled by duration
  const stat_deltas: Partial<Record<StatKey, number>> = {
    willpower: (JAIL_DRAIN_PER_DAY.willpower ?? 0) * days,
    stress:    (JAIL_DRAIN_PER_DAY.stress ?? 0) * days,
    health:    (JAIL_DRAIN_PER_DAY.health ?? 0) * days,
    hygiene:   (JAIL_DRAIN_PER_DAY.hygiene ?? 0) * days,
  };

  // Longer sentences increase trauma and corruption
  if (days >= 5) {
    stat_deltas.trauma = Math.floor(days / 2);
    stat_deltas.corruption = Math.floor(days / 3);
  }

  const tier: 'short' | 'medium' | 'long' =
    days <= 2 ? 'short' : days <= 5 ? 'medium' : 'long';

  const narratives: Record<'short' | 'medium' | 'long', string[]> = {
    short: [
      `You spend ${days} miserable day${days === 1 ? '' : 's'} in the Riften dungeon. Cold bread, damp straw. When released, you squint at sunlight like a mole.`,
      `A short stay in the cells — humiliating but survivable. ${days} day${days === 1 ? '' : 's'} of grey stone and colder guards.`,
      `"Out." The guard tosses your confiscated items at your feet after ${days} day${days === 1 ? '' : 's'}. You stumble back into the sunlight.`,
    ],
    medium: [
      `${days} days in the dungeon. You lose track of time. Your willpower frays at the edges.`,
      `The guards rotate every dawn. You count them, not knowing what else to do. ${days} days gone.`,
      `Prison is a grinding thing — not dramatic, just slow and grey. You emerge from ${days} days of it diminished.`,
    ],
    long: [
      `${days} days. You thought you'd break. You almost did. You emerge pale, thinned, and harder for it.`,
      `The dungeon teaches patience at the cost of everything else. You spend ${days} days learning what you're made of.`,
      `A season behind bars changes a person. ${days} days later, you're not sure you're the same one who went in.`,
    ],
  };

  const narrative = pickRandom(narratives[tier], rng);

  // Serving clears all outstanding crimes (sentence served for all factions)
  const clearedRecord: CriminalRecord = {
    ...record,
    crimes:       record.crimes.map(c => ({ ...c, cleared: true })),
    total_bounty: 0,
    wanted_by:    [],
    guard_state:  null,
  };

  const crimeUpdates: Record<string, unknown> = {
    criminal_record:  clearedRecord,
    bounty_delta:     -record.total_bounty,
    wanted_factions:  [],
    jail_days_served: days,
  };

  return { narrative, stat_deltas, side_effects: [], crimeUpdates };
}

// ── resolveEscapeAttempt ──────────────────────────────────────────────────────

/**
 * Attempt to escape from jail or break free of active pursuit.
 *
 * @param state  - Full game state
 * @param method - Escape technique
 * @param rng    - Injectable RNG
 */
export function resolveEscapeAttempt(
  state: GameState,
  method: EscapeMethod,
  rng: () => number = Math.random,
): CrimeResolution {
  const record = getPlayerRecord(state);
  const config = ESCAPE_CONFIG[method];
  const skillValue = state.player.skills[config.skill] ?? 0;

  // Magic escape gets a bonus from having spells or soul gems
  const arcaneBonus = method === 'magic'
    ? (state.player.arcane.spells.length > 0 ? 0.15 : 0)
      + (state.player.arcane.soul_gems > 0 ? 0.10 : 0)
    : 0;

  const successChance = Math.max(0.05, Math.min(0.95,
    config.base_chance + skillValue * 0.005 + arcaneBonus,
  ));

  const stat_deltas: Partial<Record<StatKey, number>> = {
    stress:  config.stress_cost,
    stamina: -config.stamina_cost,
  };

  const narrativePools: Record<EscapeMethod, { success: string[]; failure: string[] }> = {
    lockpick: {
      success: [
        'Iron shavings and patience — you\'ve picked harder locks than this. Click. The cell yields.',
        'Four tumblers, four quiet clicks. The door swings inward. You step into the corridor, free.',
        'Your nimble fingers work the pick through the mechanism with practiced ease. The lock surrenders.',
      ],
      failure: [
        'The pick snaps. The guard rounds the corner and finds you on your knees, incriminating iron in hand.',
        "You're close — so close — when the lock jams and your hands won't stop trembling.",
        'A guard hears the scraping and comes to investigate. Your lockpick is confiscated.',
      ],
    },
    force: {
      success: [
        'You drive your shoulder into the weakened wall joint. It gives with a crack. You tumble through into the night.',
        'Brute force wins the day — the rusted bar tears free from the window frame.',
        'You overpower the guard during the shift change and sprint for the city walls.',
      ],
      failure: [
        "The wall doesn't move. You bruise your shoulder for nothing. Guards come to investigate the noise.",
        'Your attempted jailbreak earns you a thorough beating and a second lock on the cell door.',
        'You are strong, but not strong enough. The enchanted iron resists.',
      ],
    },
    stealth: {
      success: [
        'You melt into the shadow between two braziers and slip past the guard change unnoticed.',
        'Shadow-step — learned from watching a Nightblade once. It works. You drift through like smoke.',
        'They never see you. You move from shadow to shadow, each guard blind to your passing.',
      ],
      failure: [
        '"I see you." The guard\'s torch floods your hiding spot. There was never a shadow deep enough.',
        'Your footfall echoes at the worst moment. The alarm is raised.',
        'You freeze at the wrong time — a guard turns, torch in hand, and meets your eyes.',
      ],
    },
    magic: {
      success: [
        'A Recall spell activates — the familiar lurch of teleportation, and then fresh air.',
        'You draw the last of your magicka into an Invisibility ward and walk out of the dungeon unchallenged.',
        'Soul gem energy sparks between your fingers. The shackles fall open. You are free.',
      ],
      failure: [
        'Your magicka is too depleted for the spell to take. The attempt draws an alarmed guard.',
        'The dungeon is warded against teleportation — a lesson you learn too late.',
        'The spell fizzles. The effort exhausts you, and the guards hear the discharge.',
      ],
    },
  };

  const side_effects: CrimeSideEffect[] = [];
  let narrative = '';
  let crimeUpdates: Record<string, unknown> = {};

  if (rng() < successChance) {
    const stoodDown = guardStandDown(record.guard_state ?? defaultGuardState('town_guard'));
    narrative = pickRandom(narrativePools[method].success, rng);
    crimeUpdates = {
      criminal_record: { ...record, guard_state: stoodDown },
      escaped: true,
      guard_alert_level: 'unaware',
    };
    side_effects.push({ type: 'ESCAPED_PURSUIT' });

    // Force escape is physically costly even on success
    if (method === 'force') {
      stat_deltas.health = (stat_deltas.health ?? 0) - 10;
      stat_deltas.pain   = (stat_deltas.pain ?? 0) + 8;
    }
  } else {
    narrative = pickRandom(narrativePools[method].failure, rng);
    // Force failure earns an assault charge
    const penaltyRecord = method === 'force'
      ? commitCrime(record, 'assault', 'town_guard', state.world.turn_count, true)
      : record;

    const extraDays = method === 'force' ? 2 : 1;
    crimeUpdates = {
      criminal_record: penaltyRecord,
      escaped: false,
      additional_sentence: extraDays,
    };
    stat_deltas.health = (stat_deltas.health ?? 0) - (method === 'force' ? 15 : 5);
    stat_deltas.stress = (stat_deltas.stress ?? 0) + 10;
  }

  return { narrative, stat_deltas, side_effects, crimeUpdates };
}

// ── resolveBountyPayment ──────────────────────────────────────────────────────

/**
 * Pay off bounty voluntarily at a jarl's steward or guard post.
 *
 * @param state     - Full game state
 * @param factionId - Faction to pay
 * @param rng       - Injectable RNG
 */
export function resolveBountyPayment(
  state: GameState,
  factionId: FactionId,
  rng: () => number = Math.random,
): CrimeResolution {
  const record = getPlayerRecord(state);
  const { record: cleared, gold_paid } = payBounty(record, factionId);
  const holdName = getHoldName(factionId);

  const stat_deltas: Partial<Record<StatKey, number>> = {
    stress: gold_paid > 0 ? -8 : 0,
  };

  const side_effects: CrimeSideEffect[] = [];
  if (gold_paid > 0) {
    side_effects.push({ type: 'BOUNTY_CLEARED', payload: { faction_id: factionId } });
  }

  const narrative = gold_paid === 0
    ? pickRandom([
        `The steward of ${holdName} reviews your file. "All clear. You owe nothing to this hold."`,
        `"No outstanding bounties on record." The clerk stamps your papers without looking up.`,
        `Clean as fresh-forged steel — no bounty on file with ${holdName}.`,
      ], rng)
    : pickRandom([
        `You settle your debt with ${holdName}: ${gold_paid} septims, delivered with forced civility. "Your record is clear."`,
        `"${gold_paid} septims." The guard counts each coin slowly. "Don't make me regret this."`,
        `${gold_paid} septims poorer, you walk out of the steward's hall a free person. For now.`,
      ], rng);

  const crimeUpdates: Record<string, unknown> = {
    criminal_record: cleared,
    gold_delta:      gold_paid === 0 ? 0 : -gold_paid,
    bounty_delta:    -gold_paid,
    wanted_factions: cleared.wanted_by,
  };

  return { narrative, stat_deltas, side_effects, crimeUpdates };
}

// ── getPlayerBountyStatus ─────────────────────────────────────────────────────

/**
 * Return the player's current wanted status across all factions.
 * Pure read — no side effects.
 *
 * @param state - Full game state
 */
export function getPlayerBountyStatus(state: GameState): BountyStatus {
  const record = getPlayerRecord(state);

  const faction_bounties: Partial<Record<FactionId, number>> = {};
  for (const faction of ALL_FACTIONS) {
    const amount = getFactionBounty(record, faction);
    if (amount > 0) {
      faction_bounties[faction] = amount;
    }
  }

  return {
    total_bounty:    record.total_bounty,
    wanted_label:    wantedLabel(record),
    wanted_factions: record.wanted_by,
    faction_bounties,
    is_wanted:       record.wanted_by.length > 0,
  };
}

// ── getGuardAlertLevel ────────────────────────────────────────────────────────

/**
 * Return the current guard awareness level at a given location.
 * Derived from active guard states in sim_world and the player's bounty.
 *
 * @param state      - Full game state
 * @param locationId - Location to check
 */
export function getGuardAlertLevel(state: GameState, locationId: string): GuardAlertLevel {
  const record = getPlayerRecord(state);

  // If a guard is actively tracking the player, use their alert level
  if (record.guard_state && record.guard_state.target_id === 'player') {
    return record.guard_state.alert_level;
  }

  // Derive from location faction and current bounty
  const factionId = locationToFaction(locationId, state);
  const factionBounty = getFactionBounty(record, factionId);

  if (factionBounty === 0)   return 'unaware';
  if (factionBounty < 50)    return 'suspicious';
  if (factionBounty < 150)   return 'alerted';
  if (factionBounty < 300)   return 'pursuing';
  return 'arresting';
}
