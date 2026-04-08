/**
 * questEngine.ts — game-layer quest state machine.
 *
 * Manages the full quest lifecycle: starting, objective tracking, completion,
 * failure, abandonment, branching choices, and reward distribution.
 *
 * Quest types:
 *  - main_story  — core narrative arc
 *  - guild       — faction questlines (Companions, Thieves Guild, College, Brotherhood)
 *  - side        — standalone optional content
 *  - radiant     — procedurally generated repeatable tasks
 *  - daedric     — Daedric Prince questlines
 *
 * Elder Scrolls questlines wired in:
 *  - Companions initiation (Whiterun)
 *  - Thieves Guild intro (Riften — Brynjolf's shill job)
 *  - College of Winterhold enrollment
 *  - Dark Brotherhood contact (Abandoned Shack)
 *  - Civil War recruitment (Stormcloaks / Imperial Legion)
 *
 * Pure functions; all take state and return state — no side effects.
 *
 * @see src/data/quests.ts — quest definitions
 * @see src/types.ts       — Quest, QuestObjective
 */

import { GameState, Quest, QuestObjective } from '../types';
import { QUESTS } from '../data/quests';

// ── Extended quest types ──────────────────────────────────────────────────────

export type QuestType = 'main' | 'side' | 'daily' | 'romance' | 'guild' | 'radiant' | 'daedric';
export type QuestStatus = 'active' | 'completed' | 'failed' | 'locked' | 'abandoned';

export interface QuestChoice {
  id: string;
  label: string;
  description: string;
  consequences: QuestChoiceConsequences;
  /** Required stat/skill thresholds to unlock this choice */
  requirements?: Partial<{
    skill:  keyof GameState['player']['skills'];
    min_value: number;
    stat:  keyof GameState['player']['stats'];
    gold:  number;
  }>;
}

export interface QuestChoiceConsequences {
  complete_objective?: string;
  fail_quest?: boolean;
  unlock_quest?: string;
  stat_deltas?:  Partial<Record<string, number>>;
  skill_deltas?: Partial<Record<string, number>>;
  gold_delta?:   number;
  event_flags?:  Record<string, boolean | number>;
  narrative?:    string;
}

export interface QuestResolveResult {
  /** Updated game state. */
  state: GameState;
  /** Whether the action succeeded. */
  success: boolean;
  /** Human-readable narrative. */
  narrative: string;
  /** Rewards actually distributed (on completion). */
  rewards_given?: Quest['rewards'];
}

// ── Elder Scrolls guild questlines ────────────────────────────────────────────

/** Built-in Elder Scrolls faction quest definitions not in quests.ts. */
export const ES_GUILD_QUESTS: Record<string, Quest> = {
  // ── Companions ─────────────────────────────────────────────────────────────
  'q_companions_initiation': {
    id:          'q_companions_initiation',
    title:       'Trial of the Companions',
    type:        'side',
    status:      'locked',
    description: 'Kodlak Whitemane of the Companions has set you a trial. Prove your worth by retrieving a fragment of Wuuthrad from a Silverhand camp.',
    objectives: [
      { id: 'obj_reach_whiterun',     description: 'Travel to Whiterun and find the Companions',    completed: false },
      { id: 'obj_speak_kodlak',       description: 'Speak with Kodlak Whitemane',                   completed: false },
      { id: 'obj_retrieve_fragment',  description: 'Retrieve the fragment from the Silverhand camp', completed: false },
    ],
    rewards: {
      gold:  0,
      feats: ['feat_companion'],
      xp:    300,
    },
    prerequisites: [],
  },

  // ── Thieves Guild intro ────────────────────────────────────────────────────
  'q_thieves_guild_intro': {
    id:          'q_thieves_guild_intro',
    title:       "A Chance Arrangement",
    type:        'side',
    status:      'locked',
    description: "Brynjolf has asked you to plant a ring on a market stall owner as a distraction. It's a test — and a chance to join Riften's most powerful criminal organisation.",
    objectives: [
      { id: 'obj_meet_brynjolf_market', description: 'Meet Brynjolf in the Riften marketplace',       completed: false },
      { id: 'obj_plant_ring',           description: 'Plant the ring on Madesi during Brynjolf\'s distraction', completed: false },
      { id: 'obj_collect_payment',      description: 'Collect payment from Brynjolf',                 completed: false },
    ],
    rewards: {
      gold:  100,
      feats: ['feat_light_fingers'],
      xp:    250,
    },
    prerequisites: ['q_ch4_thieves_guild'],
  },

  // ── College of Winterhold ──────────────────────────────────────────────────
  'q_college_enrollment': {
    id:          'q_college_enrollment',
    title:       'First Lessons',
    type:        'side',
    status:      'locked',
    description: 'Faralda at the bridge to the College of Winterhold will only grant entry to those who can demonstrate an aptitude for magic. Prove yourself and gain admission.',
    objectives: [
      { id: 'obj_travel_winterhold',  description: 'Travel to Winterhold',                               completed: false },
      { id: 'obj_demonstrate_magic',  description: 'Demonstrate a spell to Faralda at the bridge',       completed: false },
      { id: 'obj_meet_mirabelle',     description: 'Report to Mirabelle Ervine inside the College',      completed: false },
    ],
    rewards: {
      feats: ['feat_apprentice_mage'],
      xp:    200,
    },
    prerequisites: [],
  },

  // ── Dark Brotherhood ───────────────────────────────────────────────────────
  'q_dark_brotherhood_contact': {
    id:          'q_dark_brotherhood_contact',
    title:       'Innocence Lost',
    type:        'side',
    status:      'locked',
    description: "A small boy in Windhelm has performed the Black Sacrament, summoning the Dark Brotherhood. Someone has heard the call. Find the boy — and decide what to do with the knowledge.",
    objectives: [
      { id: 'obj_find_aventus',   description: 'Find Aventus Aretino in Windhelm',                    completed: false },
      { id: 'obj_hear_request',   description: 'Hear Aventus\'s request',                             completed: false },
      { id: 'obj_make_choice',    description: 'Decide: honour the contract, or refuse',              completed: false },
    ],
    rewards: {
      gold:  0,
      feats: ['feat_shadow_touched'],
      xp:    350,
    },
    prerequisites: ['q_ch5_hidden_depths'],
  },

  // ── Civil War: Stormcloaks ─────────────────────────────────────────────────
  'q_civil_war_stormcloaks': {
    id:          'q_civil_war_stormcloaks',
    title:       'Joining the Stormcloaks',
    type:        'side',
    status:      'locked',
    description: "Galmar Stone-Fist will only accept true Nords — or those willing to prove they are. Complete his test in Serpent's Bluff Redoubt and you may join Ulfric's cause.",
    objectives: [
      { id: 'obj_find_galmar',      description: 'Find Galmar Stone-Fist in the Palace of the Kings', completed: false },
      { id: 'obj_complete_test',    description: 'Complete the test at Serpent\'s Bluff',             completed: false },
      { id: 'obj_swear_oath',       description: 'Swear the oath to Ulfric Stormcloak',               completed: false },
    ],
    rewards: {
      gold:  50,
      feats: ['feat_stormcloak'],
      xp:    300,
    },
    prerequisites: [],
  },

  // ── Civil War: Imperial Legion ─────────────────────────────────────────────
  'q_civil_war_imperial': {
    id:          'q_civil_war_imperial',
    title:       'Joining the Legion',
    type:        'side',
    status:      'locked',
    description: "General Tullius will accept capable soldiers regardless of race. Report to Legate Rikke in Castle Dour and complete her field test to earn your Imperial uniform.",
    objectives: [
      { id: 'obj_find_rikke',       description: 'Find Legate Rikke in Castle Dour, Solitude',       completed: false },
      { id: 'obj_field_test',       description: 'Complete the field test',                           completed: false },
      { id: 'obj_receive_uniform',  description: 'Receive your Imperial uniform',                    completed: false },
    ],
    rewards: {
      gold:  50,
      feats: ['feat_imperial_soldier'],
      xp:    300,
    },
    prerequisites: [],
  },
};

// ── Radiant quest pool ────────────────────────────────────────────────────────

const RADIANT_TEMPLATES: Array<{
  title_template:       string;
  description_template: string;
  obj_template:         string;
  rewards: Quest['rewards'];
  min_level: number;
}> = [
  {
    title_template:       'Bounty: {target}',
    description_template: 'A bounty has been posted for the elimination of {target} terrorising the hold.',
    obj_template:         'Eliminate the {target}',
    rewards:              { gold: 100, xp: 80 },
    min_level: 1,
  },
  {
    title_template:       'Fetch: {item}',
    description_template: 'A merchant in the market needs {item} retrieved from a nearby cave.',
    obj_template:         'Retrieve the {item} from the cave',
    rewards:              { gold: 50, xp: 50 },
    min_level: 1,
  },
  {
    title_template:       'Patrol: {location}',
    description_template: 'The hold guards need someone to patrol {location} and report on bandit activity.',
    obj_template:         'Complete the patrol of {location}',
    rewards:              { gold: 40, xp: 40, skills: { athletics: 2 } },
    min_level: 1,
  },
  {
    title_template:       'Gather: {resource}',
    description_template: 'An alchemist needs {resource} gathered from the wilderness.',
    obj_template:         'Gather 5 {resource}',
    rewards:              { gold: 30, xp: 30, skills: { foraging: 3 } },
    min_level: 1,
  },
];

const RADIANT_TARGETS = ['frost troll', 'bandit leader', 'mudcrab queen', 'giant'];
const RADIANT_ITEMS   = ['Crimson Nirnroot', 'Daedra Heart', 'Giant\'s Toe', 'Void Salt'];
const RADIANT_LOCS    = ['Bleak Falls Barrow', 'Embershard Mine', 'Brittleshin Pass', 'Halted Stream Camp'];
const RADIANT_RES     = ['mountain flower', 'tundra cotton', 'creep cluster', 'mora tapinella'];

function pickRadiantFill(template: string, rng: () => number): string {
  if (template.includes('{target}'))   return template.replace('{target}',   RADIANT_TARGETS[Math.floor(rng() * RADIANT_TARGETS.length)]);
  if (template.includes('{item}'))     return template.replace('{item}',     RADIANT_ITEMS[Math.floor(rng() * RADIANT_ITEMS.length)]);
  if (template.includes('{location}')) return template.replace('{location}', RADIANT_LOCS[Math.floor(rng() * RADIANT_LOCS.length)]);
  if (template.includes('{resource}')) return template.replace('{resource}', RADIANT_RES[Math.floor(rng() * RADIANT_RES.length)]);
  return template;
}

// ── Unified quest registry ────────────────────────────────────────────────────

function getQuestDef(questId: string): Quest | undefined {
  return QUESTS[questId] ?? ES_GUILD_QUESTS[questId];
}

// ── Prerequisite checking ─────────────────────────────────────────────────────

export interface PrerequisiteResult {
  met: boolean;
  missing: string[];
}

/**
 * Check whether the player meets all prerequisites for a quest.
 * Returns `met: true` plus a list of missing requirements (empty on success).
 */
export function checkQuestPrerequisites(
  state: GameState,
  questId: string,
): PrerequisiteResult {
  const def = getQuestDef(questId);
  if (!def) return { met: false, missing: [`Quest "${questId}" not found`] };

  const missing: string[] = [];

  // Already completed / active / failed
  const existing = state.player.quests.find(q => q.id === questId);
  if (existing?.status === 'completed') {
    return { met: false, missing: [`Quest "${questId}" is already completed`] };
  }
  if (existing?.status === 'active') {
    return { met: false, missing: [`Quest "${questId}" is already active`] };
  }

  // Prerequisite quests must be completed
  for (const prereqId of (def.prerequisites ?? [])) {
    const prereq = state.player.quests.find(q => q.id === prereqId && q.status === 'completed');
    if (!prereq) {
      missing.push(`Required quest "${prereqId}" not completed`);
    }
  }

  // Faction-specific checks for guild quests
  if (questId === 'q_thieves_guild_intro') {
    const brynjolfMet = state.world.event_flags['brynjolf_met'];
    if (!brynjolfMet) missing.push('Must have met Brynjolf first');
  }

  if (questId === 'q_college_enrollment') {
    const anySpell = state.player.arcane.spells.length > 0
      || state.player.stats.willpower >= 40;
    if (!anySpell) missing.push('Requires at least one known spell or 40 Willpower');
  }

  if (questId === 'q_civil_war_stormcloaks' || questId === 'q_civil_war_imperial') {
    const bothActive = state.world.event_flags['civil_war_started'];
    if (!bothActive) missing.push('Civil War questline not yet triggered');
  }

  return { met: missing.length === 0, missing };
}

// ── startQuest ────────────────────────────────────────────────────────────────

/**
 * Activate a quest if prerequisites are met.
 * Deep-copies the quest definition from the registry.
 */
export function startQuest(
  state: GameState,
  questId: string,
): QuestResolveResult {
  const check = checkQuestPrerequisites(state, questId);
  if (!check.met) {
    return {
      state,
      success:   false,
      narrative: `Cannot start quest: ${check.missing.join('; ')}`,
    };
  }

  const def = getQuestDef(questId)!;
  const newQuest: Quest = {
    ...def,
    status:     'active',
    objectives: (def.objectives ?? []).map(o => ({ ...o, completed: false })),
  };

  // Remove any previous (locked/failed) version of this quest
  const filteredQuests = state.player.quests.filter(q => q.id !== questId);

  return {
    state: {
      ...state,
      player: {
        ...state.player,
        quests: [...filteredQuests, newQuest],
      },
    },
    success:   true,
    narrative: `Journal updated: "${def.title}" — ${def.description}`,
  };
}

// ── updateQuestObjective ──────────────────────────────────────────────────────

/**
 * Advance a quest objective's progress.
 * For count-based objectives, provide the new total count.
 * Non-count objectives complete when progress >= 1.
 */
export function updateQuestObjective(
  state: GameState,
  questId: string,
  objectiveId: string,
  progress: number,
): QuestResolveResult {
  const questIdx = state.player.quests.findIndex(q => q.id === questId && q.status === 'active');
  if (questIdx < 0) {
    return { state, success: false, narrative: `Quest "${questId}" is not active.` };
  }

  const quest = state.player.quests[questIdx];
  const objIdx = (quest.objectives ?? []).findIndex(o => o.id === objectiveId);
  if (objIdx < 0) {
    return { state, success: false, narrative: `Objective "${objectiveId}" not found in quest "${questId}".` };
  }

  const obj = quest.objectives![objIdx];
  let updatedObj: QuestObjective;

  if (obj.required_count !== undefined) {
    const newCount = Math.min((obj.count ?? 0) + progress, obj.required_count);
    updatedObj = {
      ...obj,
      count:     newCount,
      completed: newCount >= obj.required_count,
    };
  } else {
    updatedObj = { ...obj, completed: progress >= 1 };
  }

  const updatedObjectives = [...quest.objectives!];
  updatedObjectives[objIdx] = updatedObj;

  const updatedQuest: Quest = { ...quest, objectives: updatedObjectives };
  const updatedQuests = [...state.player.quests];
  updatedQuests[questIdx] = updatedQuest;

  const narrative = updatedObj.completed
    ? `Objective complete: "${obj.description}"`
    : `Progress updated: "${obj.description}" (${updatedObj.count ?? 1}/${obj.required_count ?? 1})`;

  return {
    state: { ...state, player: { ...state.player, quests: updatedQuests } },
    success:   true,
    narrative,
  };
}

// ── completeQuest ─────────────────────────────────────────────────────────────

/** Clamp helper */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Complete a quest, distribute rewards, and unlock follow-up quests.
 * All objectives must be completed first (unless forced via event).
 */
export function completeQuest(
  state: GameState,
  questId: string,
  rng: () => number = Math.random,
): QuestResolveResult {
  const questIdx = state.player.quests.findIndex(q => q.id === questId && q.status === 'active');
  if (questIdx < 0) {
    return { state, success: false, narrative: `Quest "${questId}" is not active.` };
  }

  const quest = state.player.quests[questIdx];

  // Check all objectives completed
  const incomplete = (quest.objectives ?? []).filter(o => !o.completed);
  if (incomplete.length > 0) {
    return {
      state,
      success:   false,
      narrative: `Cannot complete "${quest.title}" — ${incomplete.length} objective(s) remain.`,
    };
  }

  // Distribute rewards
  let newState = { ...state };
  const rewards = quest.rewards ?? {};

  // Gold
  if (rewards.gold) {
    newState = { ...newState, player: { ...newState.player, gold: newState.player.gold + rewards.gold } };
  }

  // Items — add to inventory (stub: create minimal item records)
  if (rewards.items && rewards.items.length > 0) {
    const rewardItems = rewards.items.map(itemId => ({
      id: itemId, name: itemId.replace(/_/g, ' '), type: 'misc' as const,
      rarity: 'common' as const, description: `Reward: ${itemId}`, value: 0, weight: 0,
    }));
    newState = {
      ...newState,
      player: { ...newState.player, inventory: [...newState.player.inventory, ...rewardItems] },
    };
  }

  // Skills
  if (rewards.skills) {
    const newSkills = { ...newState.player.skills };
    for (const [skill, gain] of Object.entries(rewards.skills)) {
      if (skill in newSkills) {
        (newSkills as any)[skill] = clamp((newSkills as any)[skill] + (gain as number), 0, 100);
      }
    }
    newState = { ...newState, player: { ...newState.player, skills: newSkills } };
  }

  // Feats
  if (rewards.feats && rewards.feats.length > 0) {
    const updatedFeats = newState.player.feats.map(f =>
      rewards.feats!.includes(f.id) ? { ...f, unlocked: true, unlocked_on_day: newState.world.day } : f,
    );
    newState = { ...newState, player: { ...newState.player, feats: updatedFeats } };
  }

  // Mark quest completed
  const updatedQuests = [...newState.player.quests];
  updatedQuests[questIdx] = { ...quest, status: 'completed' };
  newState = { ...newState, player: { ...newState.player, quests: updatedQuests } };

  // Unlock follow-up quests that list this quest as their only prerequisite
  const followUps = Object.values({ ...QUESTS, ...ES_GUILD_QUESTS }).filter(
    q => q.prerequisites?.length === 1 && q.prerequisites[0] === questId,
  );
  for (const followUp of followUps) {
    const alreadyPresent = newState.player.quests.some(q => q.id === followUp.id);
    if (!alreadyPresent) {
      newState = startQuest(newState, followUp.id).state;
    }
  }

  // Suppress unused rng (could be used for reward variance in a future version)
  void rng();

  return {
    state:     newState,
    success:   true,
    narrative: `Quest complete: "${quest.title}". ${rewards.gold ? `+${rewards.gold} gold. ` : ''}${rewards.xp ? `+${rewards.xp} XP.` : ''}`,
    rewards_given: rewards,
  };
}

// ── failQuest ─────────────────────────────────────────────────────────────────

/**
 * Mark a quest as failed.
 * Applies any negative consequences (stat loss, faction reputation loss).
 */
export function failQuest(
  state: GameState,
  questId: string,
  reason: string,
): QuestResolveResult {
  const questIdx = state.player.quests.findIndex(q => q.id === questId && q.status === 'active');
  if (questIdx < 0) {
    return { state, success: false, narrative: `Quest "${questId}" is not active.` };
  }

  const quest = state.player.quests[questIdx];
  const updatedQuests = [...state.player.quests];
  updatedQuests[questIdx] = { ...quest, status: 'failed' };

  // Main story failures add stress
  let newState: GameState = { ...state, player: { ...state.player, quests: updatedQuests } };
  if (quest.type === 'main') {
    newState = {
      ...newState,
      player: {
        ...newState.player,
        stats: { ...newState.player.stats, stress: clamp(newState.player.stats.stress + 15, 0, 100) },
      },
    };
  }

  return {
    state:     newState,
    success:   true,
    narrative: `Quest failed: "${quest.title}". ${reason}`,
  };
}

// ── abandonQuest ──────────────────────────────────────────────────────────────

/**
 * Remove an active quest from the journal without failure penalties.
 * Not allowed for main story quests.
 */
export function abandonQuest(
  state: GameState,
  questId: string,
): QuestResolveResult {
  const questIdx = state.player.quests.findIndex(q => q.id === questId && q.status === 'active');
  if (questIdx < 0) {
    return { state, success: false, narrative: `Quest "${questId}" is not active.` };
  }

  const quest = state.player.quests[questIdx];
  if (quest.type === 'main') {
    return {
      state,
      success:   false,
      narrative: `Main story quests cannot be abandoned.`,
    };
  }

  // Remove quest from journal entirely
  const updatedQuests = state.player.quests.filter((_, i) => i !== questIdx);
  return {
    state: { ...state, player: { ...state.player, quests: updatedQuests } },
    success:   true,
    narrative: `Quest abandoned: "${quest.title}".`,
  };
}

// ── getActiveQuests ───────────────────────────────────────────────────────────

/**
 * Return all currently active quests with their objectives.
 */
export function getActiveQuests(state: GameState): Quest[] {
  return state.player.quests.filter(q => q.status === 'active');
}

// ── getAvailableQuests ────────────────────────────────────────────────────────

/**
 * Return quests the player could start right now (prerequisites met, not active/done).
 */
export function getAvailableQuests(state: GameState): Quest[] {
  const allDefs = { ...QUESTS, ...ES_GUILD_QUESTS };
  return Object.values(allDefs).filter(def => {
    const existing = state.player.quests.find(q => q.id === def.id);
    if (existing?.status === 'active' || existing?.status === 'completed') return false;
    const { met } = checkQuestPrerequisites(state, def.id);
    return met;
  });
}

// ── resolveQuestChoice ────────────────────────────────────────────────────────

/**
 * Resolve a branching quest choice, applying consequences to game state.
 *
 * @param state     Current game state
 * @param questId   The quest containing the branch
 * @param choiceId  The id of the choice being made
 * @param choices   Registry of choices for this quest (injected by caller)
 * @param rng       Seeded RNG for any randomised consequences
 */
export function resolveQuestChoice(
  state: GameState,
  questId: string,
  choiceId: string,
  choices: QuestChoice[],
  rng: () => number = Math.random,
): QuestResolveResult {
  const quest = state.player.quests.find(q => q.id === questId && q.status === 'active');
  if (!quest) {
    return { state, success: false, narrative: `Quest "${questId}" is not active.` };
  }

  const choice = choices.find(c => c.id === choiceId);
  if (!choice) {
    return { state, success: false, narrative: `Choice "${choiceId}" not found.` };
  }

  // Check requirements
  if (choice.requirements) {
    const req = choice.requirements;
    if (req.skill && req.min_value !== undefined) {
      const playerSkill = (state.player.skills as any)[req.skill] as number ?? 0;
      if (playerSkill < req.min_value) {
        return {
          state,
          success:   false,
          narrative: `You lack the required ${req.skill} skill (need ${req.min_value}, have ${playerSkill}).`,
        };
      }
    }
    if (req.gold !== undefined && state.player.gold < req.gold) {
      return {
        state,
        success:   false,
        narrative: `You need ${req.gold} gold for this option (have ${state.player.gold}).`,
      };
    }
  }

  let newState = { ...state };
  const cons = choice.consequences;

  // Apply stat deltas
  if (cons.stat_deltas) {
    const newStats = { ...newState.player.stats };
    for (const [key, delta] of Object.entries(cons.stat_deltas)) {
      if (key in newStats) {
        (newStats as any)[key] = clamp((newStats as any)[key] + (delta as number), 0, 100);
      }
    }
    newState = { ...newState, player: { ...newState.player, stats: newStats } };
  }

  // Apply skill deltas
  if (cons.skill_deltas) {
    const newSkills = { ...newState.player.skills };
    for (const [skill, delta] of Object.entries(cons.skill_deltas)) {
      if (skill in newSkills) {
        (newSkills as any)[skill] = clamp((newSkills as any)[skill] + (delta as number), 0, 100);
      }
    }
    newState = { ...newState, player: { ...newState.player, skills: newSkills } };
  }

  // Gold delta
  if (cons.gold_delta) {
    newState = { ...newState, player: { ...newState.player, gold: newState.player.gold + cons.gold_delta } };
  }

  // Event flags
  if (cons.event_flags) {
    newState = {
      ...newState,
      world: {
        ...newState.world,
        event_flags: { ...newState.world.event_flags, ...cons.event_flags },
      },
    };
  }

  // Complete objective
  if (cons.complete_objective) {
    const result = updateQuestObjective(newState, questId, cons.complete_objective, 1);
    if (result.success) newState = result.state;
  }

  // Fail quest
  if (cons.fail_quest) {
    return failQuest(newState, questId, choice.label);
  }

  // Unlock new quest
  if (cons.unlock_quest) {
    const unlockResult = startQuest(newState, cons.unlock_quest);
    if (unlockResult.success) newState = unlockResult.state;
  }

  // Suppress rng (used for randomised dialogue variations in the future)
  void rng();

  return {
    state:     newState,
    success:   true,
    narrative: cons.narrative ?? `You chose: "${choice.label}".`,
  };
}

// ── generateRadiantQuest ──────────────────────────────────────────────────────

/**
 * Generate a procedural radiant quest from templates.
 * Returns a new Quest object (not yet added to state).
 */
export function generateRadiantQuest(
  seed: number,
  rng: () => number,
): Quest {
  const template = RADIANT_TEMPLATES[Math.floor(rng() * RADIANT_TEMPLATES.length)];
  const title       = pickRadiantFill(template.title_template,       rng);
  const description = pickRadiantFill(template.description_template, rng);
  const objLabel    = pickRadiantFill(template.obj_template,         rng);

  return {
    id:          `q_radiant_${seed}`,
    title,
    type:        'side',
    status:      'active',
    description,
    objectives: [
      { id: `obj_radiant_${seed}_0`, description: objLabel, completed: false },
    ],
    rewards:      { ...template.rewards },
    prerequisites: [],
  };
}

/**
 * Add a generated radiant quest to the player's quest journal.
 */
export function addRadiantQuest(
  state: GameState,
  rng: () => number = Math.random,
): QuestResolveResult {
  const seed  = state.world.turn_count;
  const quest = generateRadiantQuest(seed, rng);

  // Limit to 3 active radiant quests at a time
  const activeRadiant = state.player.quests.filter(q => q.id.startsWith('q_radiant_') && q.status === 'active');
  if (activeRadiant.length >= 3) {
    return {
      state,
      success:   false,
      narrative: 'You already have too many open contracts. Complete one first.',
    };
  }

  return {
    state: { ...state, player: { ...state.player, quests: [...state.player.quests, quest] } },
    success:   true,
    narrative: `New contract posted: "${quest.title}". ${quest.description}`,
  };
}
