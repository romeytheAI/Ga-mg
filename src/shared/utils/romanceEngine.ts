/**
 * romanceEngine.ts — game-layer bridge for the romance / courtship system.
 *
 * Bridges the GameState (NpcRelationship, player inventory, player stats) with
 * sim/RomanceSystem.ts (pure sim functions).  All functions are pure and
 * injectable with a seeded RNG for deterministic testing.
 *
 * Elder Scrolls context:
 *  - Amulet of Mara worn by the player signals openness to marriage proposals.
 *  - The Temple of Mara in Riften is the canonical marriage venue.
 *  - Each race has preferred gift categories and innate attraction modifiers.
 *
 * @see src/sim/RomanceSystem.ts — pure romance mechanics
 * @see src/sim/types.ts         — RomanceState, RomanceStage, Relationship, NpcTrait
 */

import { GameState, NpcRelationship } from '../../core/types';
import {
  RomanceState,
  RomanceStage,
  Relationship,
} from '../sim/types';
import {
  defaultRomanceState,
  evaluateRomanceProgression,
  applyRomanticInteraction,
  calculateCompatibility,
  romanceStageLabel,
} from '../sim/RomanceSystem';

// ── Stage encoding ────────────────────────────────────────────────────────────

const STAGE_TO_IDX: Record<RomanceStage, number> = {
  none: 0, attracted: 1, flirting: 2, courting: 3,
  dating: 4, committed: 5, rejected: 6, broken_up: 7,
};

const IDX_TO_STAGE: RomanceStage[] = [
  'none','attracted','flirting','courting',
  'dating','committed','rejected','broken_up',
];

/** Extract a RomanceState from NpcRelationship scene_flags. */
export function extractRomanceState(rel: NpcRelationship): RomanceState {
  const f = rel.scene_flags;
  return {
    stage:           IDX_TO_STAGE[Number(f.r_stage ?? 0)] ?? 'none',
    attraction:      Number(f.r_attraction ?? 0),
    intimacy:        Number(f.r_intimacy   ?? 0),
    passion:         Number(f.r_passion    ?? 0),
    jealousy:        Number(f.r_jealousy   ?? 0),
    compatibility:   Number(f.r_compat     ?? 50),
    dates_count:     Number(f.r_dates      ?? 0),
    rejection_count: Number(f.r_rejections ?? 0),
    last_date_turn:  Number(f.r_last_date  ?? 0),
  };
}

/** Encode a RomanceState back into NpcRelationship scene_flags. */
export function encodeRomanceState(
  rel: NpcRelationship,
  romance: RomanceState,
): NpcRelationship {
  return {
    ...rel,
    scene_flags: {
      ...rel.scene_flags,
      r_stage:      STAGE_TO_IDX[romance.stage],
      r_attraction: romance.attraction,
      r_intimacy:   romance.intimacy,
      r_passion:    romance.passion,
      r_jealousy:   romance.jealousy,
      r_compat:     romance.compatibility,
      r_dates:      romance.dates_count,
      r_rejections: romance.rejection_count,
      r_last_date:  romance.last_date_turn,
    },
  };
}

/** Build a sim-layer Relationship from NpcRelationship + RomanceState. */
function makeSimRel(rel: NpcRelationship, romance: RomanceState): Relationship {
  return {
    target_id:         rel.npc_id,
    affection:         rel.love,
    trust:             rel.trust,
    fear:              rel.fear,
    familiarity:       Math.min(rel.interaction_count * 2, 100),
    last_interaction:  rel.last_interaction_day,
    romance,
  };
}

/** Clamp a number to [min, max]. */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ── Elder Scrolls: Racial data ────────────────────────────────────────────────

/** Items preferred as gifts per NPC race. */
export const RACIAL_GIFT_PREFERENCES: Record<string, string[]> = {
  Nord:     ['mead','iron_sword','fur_cloak','hunting_trophy','nordic_mead'],
  Imperial: ['fine_wine','gold_ring','book','silk_cloth','imperial_coin'],
  Breton:   ['potion','spell_tome','silver_amulet','perfume','lavender'],
  Redguard: ['curved_sword','desert_silk','spice','gemstone','scimitar'],
  Dunmer:   ['sujamma','moonstone','ash_statue','bittergreen','telvanni_dust'],
  Altmer:   ['rare_book','soul_gem','fine_wine','gold_amulet','daedric_relic'],
  Bosmer:   ['forest_herbs','bow','hunting_trophy','wood_carving','venison'],
  Khajiit:  ['moon_sugar','skooma','gemstone','silk_cloth','moon_amulet'],
  Argonian: ['hist_sap','scale_oil','lake_fish','reed_basket','water_herbs'],
  Orc:      ['iron_ingot','hunting_trophy','stronghold_mead','war_axe','ore'],
};

/**
 * Innate racial attraction modifier (npc race → player race → bonus).
 * Reflects cultural familiarity / historical ties.
 */
const RACIAL_ATTRACTION: Partial<Record<string, Partial<Record<string, number>>>> = {
  Nord:     { Nord: 5,  Imperial: 2, Redguard: 0, Dunmer: -2, Altmer: -2, Argonian: -5 },
  Imperial: { Nord: 2,  Imperial: 5, Breton: 5,  Redguard: 2, Altmer: 2 },
  Breton:   { Imperial: 5, Breton: 5, Altmer: 5, Bosmer: 2 },
  Khajiit:  { Khajiit: 5, Argonian: 2, Bosmer: 2, Redguard: 2 },
  Argonian: { Argonian: 5, Khajiit: 2 },
  Dunmer:   { Dunmer: 5, Altmer: 2 },
  Altmer:   { Altmer: 5, Breton: 3, Dunmer: 2 },
  Bosmer:   { Bosmer: 5, Khajiit: 2, Argonian: 2 },
  Orc:      { Orc: 5, Nord: 2 },
  Redguard: { Redguard: 5, Imperial: 2, Khajiit: 2 },
};

function racialAttractionBonus(npcRace: string, playerRace: string): number {
  return RACIAL_ATTRACTION[npcRace]?.[playerRace] ?? 0;
}

/** Returns true if the item is a preferred gift for the NPC's race. */
export function isPreferredGift(itemId: string, npcRace: string): boolean {
  return RACIAL_GIFT_PREFERENCES[npcRace]?.includes(itemId) ?? false;
}

// ── Mara / marriage constants ─────────────────────────────────────────────────

export const AMULET_OF_MARA_ID = 'amulet-of-mara';
export const TEMPLE_OF_MARA_LOCATION = 'temple_of_mara_riften';
const MARRIAGE_RING_IDS = new Set(['gold_ring','silver_ring','mara_ring','diamond_ring']);

function playerHasAmuletOfMara(state: GameState): boolean {
  return state.player.inventory.some(i => i.id === AMULET_OF_MARA_ID);
}

function playerHasRing(state: GameState): boolean {
  return state.player.inventory.some(i => MARRIAGE_RING_IDS.has(i.id));
}

function atTempleOfMara(state: GameState): boolean {
  return state.world.current_location.id === TEMPLE_OF_MARA_LOCATION;
}

// ── Helper: get or init NpcRelationship ───────────────────────────────────────

function getRelOrInit(state: GameState, npcId: string): NpcRelationship {
  return state.world.npc_relationships[npcId] ?? {
    npc_id:              npcId,
    trust:               0,
    love:                0,
    fear:                0,
    dom:                 0,
    sub:                 0,
    milestone:           'stranger',
    met_on_day:          state.world.day,
    last_interaction_day: state.world.day,
    interaction_count:   0,
    scene_flags:         {},
  };
}

function updateNpcRel(
  state: GameState,
  npcId: string,
  rel: NpcRelationship,
): GameState {
  return {
    ...state,
    world: {
      ...state.world,
      npc_relationships: {
        ...state.world.npc_relationships,
        [npcId]: {
          ...rel,
          last_interaction_day: state.world.day,
          interaction_count:    rel.interaction_count + 1,
        },
      },
    },
  };
}

// ── Result types ──────────────────────────────────────────────────────────────

export interface RomanceResult {
  /** Updated game state (pure — caller dispatches). */
  state: GameState;
  /** Outcome category. */
  outcome: 'positive''| 'neutral''| 'negative''| 'rejected''| 'success''| 'failure';
  /** Human-readable narrative line. */
  narrative: string;
  /** Romance stage after the interaction. */
  stage: RomanceStage;
  /** True if the romance stage advanced. */
  stage_advanced: boolean;
  /** Stat deltas applied (for UI feedback). */
  deltas: Partial<Record<'love''| 'trust''| 'fear''| 'attraction''| 'intimacy', number>>;
}

// ── Flirt approach config ─────────────────────────────────────────────────────

type FlirtApproach = 'charming''| 'bold''| 'subtle''| 'gifts';

interface FlirtConfig {
  base_chance:      number;  / 0-1 base success probability
  skill_key:        keyof GameState['player']['skills'];
  attraction_boost: number;
  intimacy_boost:   number;
  love_delta:       number;
  bold_rejection_risk: boolean;
}

const FLIRT_CONFIG: Record<FlirtApproach, FlirtConfig> = {
  charming: { base_chance: 0.55, skill_key: 'seduction', attraction_boost: 5, intimacy_boost: 3, love_delta: 4, bold_rejection_risk: false },
  bold:     { base_chance: 0.40, skill_key: 'seduction', attraction_boost: 8, intimacy_boost: 2, love_delta: 6, bold_rejection_risk: true  },
  subtle:   { base_chance: 0.65, skill_key: 'seduction', attraction_boost: 3, intimacy_boost: 5, love_delta: 3, bold_rejection_risk: false },
  gifts:    { base_chance: 0.70, skill_key: 'seduction', attraction_boost: 4, intimacy_boost: 4, love_delta: 5, bold_rejection_risk: false },
};

// ── resolveFlirt ─────────────────────────────────────────────────────────────

/**
 * Attempt flirtation with an NPC.
 * Success advances romance stage (if thresholds met); failure risks rejection.
 *
 * @param state     Full game state
 * @param npcId     Target NPC identifier
 * @param approach  Flirt style: charming | bold | subtle | gifts
 * @param rng       Injected RNG (defaults to Math.random)
 */
export function resolveFlirt(
  state: GameState,
  npcId: string,
  approach: FlirtApproach,
  rng: () => number = Math.random,
): RomanceResult {
  const cfg    = FLIRT_CONFIG[approach];
  let rel      = getRelOrInit(state, npcId);
  let romance  = extractRomanceState(rel);
  const prevStage = romance.stage;

  // Cannot flirt with rejected / broken_up / already committed partners
  if (romance.stage === 'rejected') {
    return {
      state, outcome: 'rejected', narrative: 'They turn away, the memory of past rejection still raw.',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  // Skill modifier: seduction skill scales from 0-100 → up to +0.25 bonus chance
  const skillMod = state.player.skills.seduction / 400;

  // Racial attraction modifier
  const npcRace = (state.world.npc_relationships[npcId] as any)?.race as string | undefined ?? ';
  const playerRace = state.player.identity.race;
  const racialMod = racialAttractionBonus(npcRace, playerRace) // 100;

  // Corruption lowers inhibitions (slight bonus), trauma lowers attractiveness
  const statMod = (state.player.stats.corruption * 0.001) - (state.player.stats.trauma * 0.002);

  const successChance = clamp(cfg.base_chance + skillMod + racialMod + statMod, 0.1, 0.95);
  const roll = rng();
  const success = roll < successChance;

  const simRel = makeSimRel(rel, romance);
  const { romance: updatedRomance, rel: updatedSimRel } = applyRomanticInteraction(
    romance, simRel, success ? 'positive'': 'negative', state.world.turn_count,
  );

  // Extra attraction on success
  if (success) {
    updatedRomance.attraction = clamp(updatedRomance.attraction + cfg.attraction_boost, 0, 100);
    updatedRomance.intimacy   = clamp(updatedRomance.intimacy   + cfg.intimacy_boost,  0, 100);
  }

  const loveDelta  = success ? cfg.love_delta : -2;
  const trustDelta = success ? 2 : (cfg.bold_rejection_risk ? -4 : -1);

  rel = encodeRomanceState({
    ...rel,
    love:  clamp(rel.love  + loveDelta,  0, 100),
    trust: clamp(rel.trust + trustDelta, 0, 100),
  }, updatedRomance);

  const newState = updateNpcRel(state, npcId, rel);
  const stage_advanced = updatedRomance.stage !== prevStage;

  const narratives: Record<FlirtApproach, [string, string]> = {
    charming: ['Your easy charm draws a genuine smile.','Your flirtatious comment falls flat.'],
    bold:     ['Your boldness takes their breath away.','Your forwardness makes them recoil.'],
    subtle:   ['A quiet, knowing glance passes between you.','The subtle hint goes unnoticed — or ignored.'],
    gifts:    ['The gift warms their heart and loosens their guard.','The gift feels like a bribe — and they sense it.'],
  };

  return {
    state: newState,
    outcome:       success ? 'positive'': 'negative',
    narrative:     narratives[approach][success ? 0 : 1],
    stage:         updatedRomance.stage,
    stage_advanced,
    deltas: { love: loveDelta, trust: trustDelta, attraction: success ? cfg.attraction_boost : 0 },
  };
}

// ── resolveDate ───────────────────────────────────────────────────────────────

type DateType = 'tavern''| 'walk''| 'market''| 'dungeon''| 'temple';

interface DateConfig {
  base_chance:     number;
  intimacy_gain:   number;
  passion_gain:    number;
  love_gain:       number;
  trust_gain:      number;
  description:     string;
}

const DATE_CONFIG: Record<DateType, DateConfig> = {
  tavern:  { base_chance: 0.65, intimacy_gain: 6, passion_gain: 5, love_gain: 5, trust_gain: 3, description: 'sharing drinks at the tavern''},
  walk:    { base_chance: 0.70, intimacy_gain: 5, passion_gain: 3, love_gain: 4, trust_gain: 5, description: 'a quiet walk through Riften''},
  market:  { base_chance: 0.60, intimacy_gain: 4, passion_gain: 2, love_gain: 3, trust_gain: 4, description: 'browsing the market together''},
  dungeon: { base_chance: 0.45, intimacy_gain: 8, passion_gain: 8, love_gain: 6, trust_gain: 7, description: 'delving a dungeon together''},
  temple:  { base_chance: 0.75, intimacy_gain: 6, passion_gain: 4, love_gain: 7, trust_gain: 6, description: 'visiting the Temple of Mara together''},
};

/**
 * Resolve a date with an NPC.
 * Different date types build different kinds of intimacy and passion.
 */
export function resolveDate(
  state: GameState,
  npcId: string,
  dateType: DateType,
  rng: () => number = Math.random,
): RomanceResult {
  const cfg   = DATE_CONFIG[dateType];
  let rel     = getRelOrInit(state, npcId);
  let romance = extractRomanceState(rel);
  const prevStage = romance.stage;

  // Must be at least attracted to go on a date
  if (romance.stage === 'none''|| romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return {
      state, outcome: 'rejected',
      narrative: `They don't seem interested in ${cfg.description} with you yet.`,
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  // Date cooldown: at least 3 turns between dates
  const turnsSinceLast = state.world.turn_count - romance.last_date_turn;
  const cooldownMod = turnsSinceLast < 3 ? -0.2 : 0;

  const skillMod  = state.player.skills.seduction / 500;
  const trustMod  = rel.trust / 500;
  const chance    = clamp(cfg.base_chance + skillMod + trustMod + cooldownMod, 0.15, 0.9);
  const roll      = rng();
  const success   = roll < chance;

  const simRel = makeSimRel(rel, romance);
  const { romance: updatedRomance } = applyRomanticInteraction(
    romance, simRel, success ? 'positive'': 'neutral', state.world.turn_count,
  );

  if (success) {
    updatedRomance.intimacy = clamp(updatedRomance.intimacy + cfg.intimacy_gain, 0, 100);
    updatedRomance.passion  = clamp(updatedRomance.passion  + cfg.passion_gain,  0, 100);
  }

  const loveDelta  = success ? cfg.love_gain  : 0;
  const trustDelta = success ? cfg.trust_gain : 1;

  rel = encodeRomanceState({
    ...rel,
    love:  clamp(rel.love  + loveDelta,  0, 100),
    trust: clamp(rel.trust + trustDelta, 0, 100),
  }, updatedRomance);

  const newState = updateNpcRel(state, npcId, rel);
  const stage_advanced = updatedRomance.stage !== prevStage;

  const successNarratives: Record<DateType, string> = {
    tavern:  'The evening passes warmly, cups refilled, laughter genuine.',
    walk:    'The canals of Riften feel almost beautiful with them beside you.',
    market:  'Browsing stalls together, you learn new things about each other.',
    dungeon: 'Facing danger together forges a bond few soft evenings could match.',
    temple:  `In the Temple of Mara's candlelight, something deepens between you.`,
  };
  const failNarratives: Record<DateType, string> = {
    tavern:  'The evening is pleasant enough, but nothing memorable ignites.',
    walk:    'The walk is pleasant but stilted — conversation never quite flows.',
    market:  'Crowds and noise make meaningful talk impossible today.',
    dungeon: 'The dungeon proves more harrowing than romantic.',
    temple:  'The temple visit is respectful, but the mood stays formal.',
  };

  return {
    state: newState,
    outcome:       success ? 'positive'': 'neutral',
    narrative:     success ? successNarratives[dateType] : failNarratives[dateType],
    stage:         updatedRomance.stage,
    stage_advanced,
    deltas: { love: loveDelta, trust: trustDelta, intimacy: success ? cfg.intimacy_gain : 0 },
  };
}

// ── resolveProposal ───────────────────────────────────────────────────────────

/**
 * Propose marriage (Mara's blessing in Riften).
 *
 * Requires:
 *  - Romance stage 'dating''or 'committed'
 *  - Player wears or carries an Amulet of Mara
 *  - Optional ring for bonus chance
 *  - Ideally at the Temple of Mara in Riften for blessing
 */
export function resolveProposal(
  state: GameState,
  npcId: string,
  ring: boolean | undefined,
  rng: () => number = Math.random,
): RomanceResult {
  let rel     = getRelOrInit(state, npcId);
  const romance = extractRomanceState(rel);

  // Prerequisites
  if (romance.stage !== 'dating''&& romance.stage !== 'committed') {
    return {
      state, outcome: 'failure',
      narrative: 'The time is not yet right. Your bond must deepen before such a pledge.',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  const hasAmulet = playerHasAmuletOfMara(state);
  if (!hasAmulet) {
    return {
      state, outcome: 'failure',
      narrative: 'Without an Amulet of Mara, such a proposal carries no weight in the eyes of the Goddess.',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  // Base chance from relationship stats
  let chance = 0.5
    + (rel.love    / 200)     / up to +0.5 from love
    + (rel.trust   / 400)     / up to +0.25 from trust
    - (rel.fear    / 500)     / fear reduces
    + (romance.intimacy / 400);

  // Ring bonus
  const hasRing = ring ?? playerHasRing(state);
  if (hasRing) chance += 0.10;

  // Temple of Mara blessing
  if (atTempleOfMara(state)) chance += 0.15;

  // High dates count shows commitment
  if (romance.dates_count >= 5) chance += 0.05;

  chance = clamp(chance, 0.10, 0.95);
  const success = rng() < chance;

  let updatedRomance = { ...romance };
  let loveDelta = 0;
  let trustDelta = 0;

  if (success) {
    updatedRomance.stage   = 'committed';
    updatedRomance.passion = clamp(updatedRomance.passion + 20, 0, 100);
    updatedRomance.intimacy = clamp(updatedRomance.intimacy + 15, 0, 100);
    loveDelta  = 15;
    trustDelta = 10;
  } else {
    updatedRomance.rejection_count += 1;
    loveDelta  = -5;
    trustDelta = -3;
  }

  rel = encodeRomanceState({
    ...rel,
    love:  clamp(rel.love  + loveDelta,  0, 100),
    trust: clamp(rel.trust + trustDelta, 0, 100),
  }, updatedRomance);

  const newState = updateNpcRel(state, npcId, rel);

  const templeText  = atTempleOfMara(state) ? ''Mara\'s priestess smiles in blessing.'': ';
  const ringText    = hasRing ? ''You present a ring.'': ';

  return {
    state: newState,
    outcome:       success ? 'success'': 'failure',
    narrative: success
      ? `They accept your proposal.${ringText}${templeText} Under the light of Mara, you are pledged.`
      : 'They hesitate — and finally shake their head. "I care for you… but I am not ready for this."',
    stage:         updatedRomance.stage,
    stage_advanced: success && romance.stage !== 'committed',
    deltas: { love: loveDelta, trust: trustDelta },
  };
}

// ── resolveBreakup ────────────────────────────────────────────────────────────

type BreakupReason = 'infidelity''| 'neglect''| 'cruelty''| 'mutual''| 'distance''| 'incompatibility';

/**
 * End a romantic relationship.
 * Trust and fear consequences vary by reason.
 */
export function resolveBreakup(
  state: GameState,
  npcId: string,
  reason: BreakupReason,
  rng: () => number = Math.random,
): RomanceResult {
  let rel     = getRelOrInit(state, npcId);
  let romance = extractRomanceState(rel);

  if (romance.stage === 'none''|| romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return {
      state, outcome: 'neutral',
      narrative: 'There is nothing left to break.',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  const prevStage = romance.stage;
  romance.stage   = 'broken_up';
  romance.passion = clamp(romance.passion - 30, 0, 100);
  romance.jealousy = clamp(romance.jealousy + 20, 0, 100);

  const breakupDeltas: Record<BreakupReason, { trust: number; fear: number; love: number }> = {
    infidelity:      { trust: -30, fear: 5,  love: -20 },
    neglect:         { trust: -10, fear: 0,  love: -15 },
    cruelty:         { trust: -25, fear: 20, love: -25 },
    mutual:          { trust: -5,  fear: 0,  love: -10 },
    distance:        { trust: -5,  fear: 0,  love: -8  },
    incompatibility: { trust: -8,  fear: 0,  love: -12 },
  };

  const d = breakupDeltas[reason];
  rel = encodeRomanceState({
    ...rel,
    trust: clamp(rel.trust + d.trust, 0, 100),
    fear:  clamp(rel.fear  + d.fear,  0, 100),
    love:  clamp(rel.love  + d.love,  0, 100),
  }, romance);

  const newState = updateNpcRel(state, npcId, rel);

  const narratives: Record<BreakupReason, string> = {
    infidelity:      'The betrayal is an open wound. Their trust in you is gone.',
    neglect:         'You drifted apart. The bond withered from disuse.',
    cruelty:         'Your cruelty broke something that cannot be unmended. They leave with trembling hands.',
    mutual:          'You part as gently as two people can who once meant something to each other.',
    distance:        'The road between you grew too long. Circumstances, not hearts, ended this.',
    incompatibility: 'You wanted different things. Some differences cannot be bridged.',
  };

  // Suppress unused variable warning
  void rng();

  return {
    state: newState,
    outcome:       reason === 'mutual''? 'neutral'': 'negative',
    narrative:     narratives[reason],
    stage:         'broken_up',
    stage_advanced: prevStage !== 'broken_up',
    deltas: { trust: d.trust, fear: d.fear, love: d.love },
  };
}

// ── resolveJealousyEvent ──────────────────────────────────────────────────────

/**
 * Handle a jealousy confrontation between the player's partner and a rival.
 * Outcome depends on romance stage, jealousy level, and who initiated.
 */
export function resolveJealousyEvent(
  state: GameState,
  npcId: string,
  rivalId: string,
  rng: () => number = Math.random,
): RomanceResult {
  let rel     = getRelOrInit(state, npcId);
  let romance = extractRomanceState(rel);

  if (romance.stage === 'none''|| romance.stage === 'rejected''|| romance.stage === 'broken_up') {
    return {
      state, outcome: 'neutral',
      narrative: 'They have no claim on you — and no jealousy either.',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  // High jealousy + rival relationship escalates
  const rivalRel = state.world.npc_relationships[rivalId];
  const rivalLove = rivalRel?.love ?? 0;
  const jealousyLevel = romance.jealousy + rivalLove * 0.3;

  const roll = rng();
  let outcome: 'positive''| 'negative''| 'neutral';
  let loveDelta  = 0;
  let trustDelta = 0;
  let narrative  = ';

  if (jealousyLevel > 70) {
    // Explosive jealousy — high risk of break-up
    if (roll < 0.4) {
      romance.stage = 'broken_up';
      romance.jealousy = 100;
      loveDelta  = -20;
      trustDelta = -15;
      narrative  = `${npcId} confronts you furiously about ${rivalId}. The argument ends in bitter silence.`;
      outcome    = 'negative';
    } else {
      romance.jealousy = clamp(romance.jealousy - 10, 0, 100);
      loveDelta  = -5;
      trustDelta = -5;
      narrative  = `${npcId} is barely holding back their anger. You managed to calm the situation — barely.`;
      outcome    = 'neutral';
    }
  } else if (jealousyLevel > 40) {
    // Moderate — reassurance possible
    if (roll < 0.6) {
      romance.jealousy = clamp(romance.jealousy - 15, 0, 100);
      loveDelta  = 3;
      trustDelta = 2;
      narrative  = 'You reassure them gently. The jealousy ebbs, replaced by quiet relief.';
      outcome    = 'positive';
    } else {
      romance.jealousy = clamp(romance.jealousy + 10, 0, 100);
      loveDelta  = -5;
      trustDelta = -3;
      narrative  = `They see through your reassurances. ${rivalId}'s shadow lingers between you.`;
      outcome    = 'negative';
    }
  } else {
    // Low jealousy — easily resolved
    romance.jealousy = clamp(romance.jealousy - 5, 0, 100);
    loveDelta  = 2;
    trustDelta = 3;
    narrative  = 'A brief reassurance is all it takes. They trust you.';
    outcome    = 'positive';
  }

  rel = encodeRomanceState({
    ...rel,
    love:  clamp(rel.love  + loveDelta,  0, 100),
    trust: clamp(rel.trust + trustDelta, 0, 100),
  }, romance);

  const newState = updateNpcRel(state, npcId, rel);

  return {
    state: newState,
    outcome,
    narrative,
    stage:         romance.stage,
    stage_advanced: false,
    deltas: { love: loveDelta, trust: trustDelta },
  };
}

// ── resolveGift ───────────────────────────────────────────────────────────────

/**
 * Give a gift to an NPC to improve attraction and intimacy.
 * Racial preferences give a bonus; inappropriate gifts may backfire.
 */
export function resolveGift(
  state: GameState,
  npcId: string,
  itemId: string,
  rng: () => number = Math.random,
): RomanceResult {
  let rel     = getRelOrInit(state, npcId);
  let romance = extractRomanceState(rel);

  // Find item in player inventory
  const item = state.player.inventory.find(i => i.id === itemId);
  if (!item) {
    return {
      state, outcome: 'failure',
      narrative: 'You reach for the gift but realise you no longer have it.',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  const npcRace = (state.world.npc_relationships[npcId] as any)?.race as string ?? ';
  const preferred = isPreferredGift(itemId, npcRace);
  const itemValue = item.value ?? 5;

  // Value-based bonus (capped at 30)
  const valueMod = Math.min(itemValue / 30, 1.0);

  // Base love/attraction gains
  const baseLoveDelta      = preferred ? 8 : 4;
  const baseAttractionGain = preferred ? 6 : 2;
  const baseIntimacyGain   = preferred ? 5 : 2;

  // Roll for special reaction (preferred gifts have higher chance)
  const specialRoll = rng();
  const special = preferred && specialRoll < 0.3;

  const loveDelta      = Math.round((baseLoveDelta      + valueMod * 4) * (special ? 1.5 : 1));
  const attractionGain = Math.round((baseAttractionGain + valueMod * 2) * (special ? 1.5 : 1));
  const intimacyGain   = Math.round((baseIntimacyGain   + valueMod * 2) * (special ? 1.5 : 1));

  romance.attraction = clamp(romance.attraction + attractionGain, 0, 100);
  romance.intimacy   = clamp(romance.intimacy   + intimacyGain,   0, 100);
  romance = evaluateRomanceProgression(romance, makeSimRel(rel, romance));
  const prevStage = extractRomanceState(rel).stage;

  rel = encodeRomanceState({
    ...rel,
    love:  clamp(rel.love + loveDelta, 0, 100),
    trust: clamp(rel.trust + 2,        0, 100),
  }, romance);

  // Remove item from inventory
  const newState = {
    ...updateNpcRel(state, npcId, rel),
    player: {
      ...state.player,
      inventory: state.player.inventory.filter(i => i.id !== itemId),
    },
  };

  const narrative = special
    ? `Their face lights up. "${item.name}"— you remembered. They treasure it deeply.`
    : preferred
      ? `They smile warmly at the ${item.name}. A thoughtful gift from someone who pays attention.`
      : `They accept the ${item.name} with polite thanks.`;

  return {
    state: newState,
    outcome: special ? 'success'': 'positive',
    narrative,
    stage:         romance.stage,
    stage_advanced: romance.stage !== prevStage,
    deltas: { love: loveDelta, trust: 2, attraction: attractionGain, intimacy: intimacyGain },
  };
}

// ── resolveIntimateEncounter ──────────────────────────────────────────────────

/**
 * Resolve an intimate encounter with an NPC.
 *
 * Consent is mandatory for positive outcomes. Non-consensual encounters
 * dramatically harm the relationship and increase fear/trauma.
 */
export function resolveIntimateEncounter(
  state: GameState,
  npcId: string,
  consent: boolean,
  rng: () => number = Math.random,
): RomanceResult {
  let rel     = getRelOrInit(state, npcId);
  let romance = extractRomanceState(rel);

  if (!consent) {
    // Non-consensual: destroys trust, escalates fear and trauma
    romance.stage   = romance.stage === 'committed''? 'broken_up'': romance.stage;
    romance.jealousy = clamp(romance.jealousy + 30, 0, 100);

    rel = encodeRomanceState({
      ...rel,
      trust: clamp(rel.trust - 40, 0, 100),
      fear:  clamp(rel.fear  + 40, 0, 100),
      love:  clamp(rel.love  - 30, 0, 100),
    }, romance);

    const traumaDelta = 20;
    const newState = {
      ...updateNpcRel(state, npcId, rel),
      player: {
        ...state.player,
        stats: {
          ...state.player.stats,
          trauma: clamp(state.player.stats.trauma + traumaDelta, 0, 100),
        },
      },
    };

    return {
      state: newState,
      outcome: 'negative',
      narrative: 'What followed was not tenderness. The relationship fractures under the weight of what was done.',
      stage:         romance.stage,
      stage_advanced: false,
      deltas: { trust: -40, fear: 40, love: -30 },
    };
  }

  // Consensual: must be at least courting
  if (romance.stage === 'none''|| romance.stage === 'attracted') {
    return {
      state, outcome: 'rejected',
      narrative: 'They pull back gently. "Not yet. I need more time."',
      stage: romance.stage, stage_advanced: false, deltas: {},
    };
  }

  const roll      = rng();
  const chance    = 0.5 + rel.love / 200 + romance.passion / 200;
  const success   = roll < clamp(chance, 0.3, 0.9);

  const prevStage = romance.stage;

  if (success) {
    romance.intimacy  = clamp(romance.intimacy  + 12, 0, 100);
    romance.passion   = clamp(romance.passion   + 10, 0, 100);
    romance.attraction = clamp(romance.attraction + 5, 0, 100);
    romance = evaluateRomanceProgression(romance, makeSimRel(rel, romance));

    const loveDelta  = 8;
    const trustDelta = 5;
    const lustDelta  = 15;

    rel = encodeRomanceState({
      ...rel,
      love:  clamp(rel.love  + loveDelta,  0, 100),
      trust: clamp(rel.trust + trustDelta, 0, 100),
    }, romance);

    const newState = {
      ...updateNpcRel(state, npcId, rel),
      player: {
        ...state.player,
        stats: {
          ...state.player.stats,
          lust:    clamp(state.player.stats.lust    + lustDelta, 0, 100),
          arousal: clamp(state.player.stats.arousal - 20,        0, 100),
        },
      },
    };

    return {
      state: newState,
      outcome: 'positive',
      narrative: 'In the warmth of the moment, the distance between you dissolves entirely.',
      stage:         romance.stage,
      stage_advanced: romance.stage !== prevStage,
      deltas: { love: loveDelta, trust: trustDelta },
    };
  }

  // Awkward / mistimed
  return {
    state, outcome: 'neutral',
    narrative: 'The mood shifts unexpectedly. You hold each other, but the deeper closeness eludes you tonight.',
    stage: romance.stage, stage_advanced: false, deltas: {},
  };
}

// ── getRomanceStatus ──────────────────────────────────────────────────────────

export interface RomanceStatus {
  stage:         RomanceStage;
  stage_label:   string;
  attraction:    number;
  intimacy:      number;
  passion:       number;
  jealousy:      number;
  compatibility: number;
  dates_count:   number;
  love:          number;
  trust:         number;
  can_propose:   boolean;
  narrative:     string;
}

/**
 * Return a rich status object for the romance with a given NPC.
 */
export function getRomanceStatus(state: GameState, npcId: string): RomanceStatus {
  const rel     = getRelOrInit(state, npcId);
  const romance = extractRomanceState(rel);
  const can_propose = (romance.stage === 'dating''|| romance.stage === 'committed')
    && playerHasAmuletOfMara(state);

  const stageNarratives: Record<RomanceStage, string> = {
    none:       'No romantic connection exists.',
    attracted:  'There is a spark of attraction — something worth pursuing.',
    flirting:   'The air between you carries a charge. Glances linger a moment too long.',
    courting:   'You are openly courting each other. The intention is clear.',
    dating:     'You are together, sharing evenings and secrets.',
    committed:  'A deep, pledged bond. You are one another\'s.',
    rejected:   'They have made their feelings plain. Move on.',
    broken_up:  'The love that was there is gone. Only silence remains.',
  };

  return {
    stage:         romance.stage,
    stage_label:   romanceStageLabel(romance.stage),
    attraction:    romance.attraction,
    intimacy:      romance.intimacy,
    passion:       romance.passion,
    jealousy:      romance.jealousy,
    compatibility: romance.compatibility,
    dates_count:   romance.dates_count,
    love:          rel.love,
    trust:         rel.trust,
    can_propose,
    narrative:     stageNarratives[romance.stage],
  };
}

// ── getEligiblePartners ───────────────────────────────────────────────────────

export interface EligiblePartner {
  npc_id:     string;
  stage:      RomanceStage;
  attraction: number;
  love:       number;
}

/**
 * Return NPCs who have romance potential (attraction > 0 and not rejected / broken up).
 * Sorted by attraction descending.
 */
export function getEligiblePartners(state: GameState): EligiblePartner[] {
  return Object.values(state.world.npc_relationships)
    .map(rel => {
      const romance = extractRomanceState(rel);
      return { npc_id: rel.npc_id, stage: romance.stage, attraction: romance.attraction, love: rel.love };
    })
    .filter(p => p.stage !== 'rejected''&& p.stage !== 'broken_up''&& (p.attraction > 0 || p.love > 0))
    .sort((a, b) => (b.attraction + b.love) - (a.attraction + a.love));
}

// ── calculateRomanceCompatibility (exposed helper) ────────────────────────────

/**
 * Calculate trait-based compatibility between player and NPC traits.
 * Convenience wrapper over sim/RomanceSystem.calculateCompatibility.
 */
export function calculateRomanceCompatibility(
  playerTraits: import('../sim/types').NpcTrait[],
  npcTraits:    import('../sim/types').NpcTrait[],
): number {
  return calculateCompatibility(playerTraits, npcTraits);
}
