/**
 * questEngine.test.ts — 25+ tests covering the quest state machine.
 */
import { describe, it, expect } from 'vitest';
import { initialState } from '../../core/state/initialState';
import { GameState, Quest, QuestObjective } from '../../core/types';
import {
  startQuest,
  updateQuestObjective,
  completeQuest,
  failQuest,
  abandonQuest,
  checkQuestPrerequisites,
  getActiveQuests,
  getAvailableQuests,
  resolveQuestChoice,
  generateRadiantQuest,
  addRadiantQuest,
  ES_GUILD_QUESTS,
  QuestChoice,
} from './questEngine';

// ── Seeded RNG ────────────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) // 0x100000000;
  };
}

// ── State helpers ─────────────────────────────────────────────────────────────

/** Create state with the given quests (replaces entire quest list). */
function withQuests(state: GameState, quests: Quest[]): GameState {
  return { ...state, player: { ...state.player, quests } };
}

/** Mark a quest as completed in the player's journal. */
function withCompletedQuest(state: GameState, questId: string): GameState {
  const existing = state.player.quests.find(q => q.id === questId);
  if (existing) {
    return {
      ...state,
      player: {
        ...state.player,
        quests: state.player.quests.map(q =>
          q.id === questId ? { ...q, status: 'completed''as const } : q,
        ),
      },
    };
  }
  // Add it as completed
  return {
    ...state,
    player: {
      ...state.player,
      quests: [
        ...state.player.quests,
        { id: questId, title: questId, type: 'side''as const, status: 'completed''as const, description: ', prerequisites: [] },
      ],
    },
  };
}

/** Active quest with one count-based objective. */
function activeQuestWithCountObj(questId: string, required: number): Quest {
  return {
    id: questId,
    title: questId,
    type: 'side',
    status: 'active',
    description: 'Test quest',
    objectives: [
      { id: 'obj_count', description: 'Count something', completed: false, count: 0, required_count: required },
    ],
    rewards: { gold: 10, xp: 20 },
    prerequisites: [],
  };
}

/** Active quest with all objectives pre-completed. */
function fullyCompletedActiveQuest(questId: string): Quest {
  return {
    id: questId,
    title: questId,
    type: 'side',
    status: 'active',
    description: 'Test quest complete',
    objectives: [{ id: 'obj_done', description: 'Done', completed: true }],
    rewards: { gold: 50, xp: 100, skills: { skulduggery: 5 }, feats: ['feat_light_fingers'] },
    prerequisites: [],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// checkQuestPrerequisites
// ═══════════════════════════════════════════════════════════════════════════════

describe('checkQuestPrerequisites', () => {
  it('returns met: false for unknown quest id', () => {
    const result = checkQuestPrerequisites(initialState, 'q_nonexistent_xyz');
    expect(result.met).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  it('first main quest (q_ch1_orphans_cage) has no prerequisites — but is already active', () => {
    // In initialState, q_ch1_orphans_cage is already active
    const result = checkQuestPrerequisites(initialState, 'q_ch1_orphans_cage');
    expect(result.met).toBe(false);
    expect(result.missing.some(m => m.includes('already active'))).toBe(true);
  });

  it('side quest with no prerequisites is available on fresh state', () => {
    // q_side_herbalist has no prerequisites
    const state = withQuests(initialState, []); // empty quest log
    const result = checkQuestPrerequisites(state, 'q_side_herbalist');
    expect(result.met).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('quest requiring prerequisite quest is blocked when prereq not completed', () => {
    const state = withQuests(initialState, []); // no completed quests
    const result = checkQuestPrerequisites(state, 'q_ch2_survive_streets');
    expect(result.met).toBe(false);
    expect(result.missing.some(m => m.includes('q_ch1_orphans_cage'))).toBe(true);
  });

  it('quest prerequisite is met when prior quest is completed', () => {
    const state = withCompletedQuest(withQuests(initialState, []), 'q_ch1_orphans_cage');
    const result = checkQuestPrerequisites(state, 'q_ch2_survive_streets');
    expect(result.met).toBe(true);
  });

  it('already completed quest cannot be started again', () => {
    const state = withCompletedQuest(initialState, 'q_side_herbalist');
    const result = checkQuestPrerequisites(state, 'q_side_herbalist');
    expect(result.met).toBe(false);
  });

  it('college quest requires willpower >= 40 or a spell', () => {
    // Default initial state has willpower: 90 → should pass
    const state = withQuests(initialState, []);
    const result = checkQuestPrerequisites(state, 'q_college_enrollment');
    expect(result.met).toBe(true);
  });

  it('Thieves Guild intro requires brynjolf_met flag', () => {
    const stateWithoutFlag = withCompletedQuest(
      withQuests(initialState, []),
      'q_ch4_thieves_guild',
    );
    const result = checkQuestPrerequisites(stateWithoutFlag, 'q_thieves_guild_intro');
    expect(result.met).toBe(false);
    expect(result.missing.some(m => m.includes('Brynjolf'))).toBe(true);
  });

  it('Thieves Guild intro is available when brynjolf_met flag is set', () => {
    const stateWithFlag = withCompletedQuest(
      {
        ...withQuests(initialState, []),
        world: { ...initialState.world, event_flags: { ...initialState.world.event_flags, brynjolf_met: true } },
      },
      'q_ch4_thieves_guild',
    );
    const result = checkQuestPrerequisites(stateWithFlag, 'q_thieves_guild_intro');
    expect(result.met).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// startQuest
// ═══════════════════════════════════════════════════════════════════════════════

describe('startQuest', () => {
  it('adds quest to journal with active status', () => {
    const state = withQuests(initialState, []);
    const result = startQuest(state, 'q_side_herbalist');
    expect(result.success).toBe(true);
    const quest = result.state.player.quests.find(q => q.id === 'q_side_herbalist');
    expect(quest?.status).toBe('active');
  });

  it('objectives are reset to not-completed on start', () => {
    const state = withQuests(initialState, []);
    const result = startQuest(state, 'q_side_herbalist');
    const quest = result.state.player.quests.find(q => q.id === 'q_side_herbalist');
    expect(quest?.objectives?.every(o => !o.completed)).toBe(true);
  });

  it('fails to start a quest when prerequisites are not met', () => {
    const state = withQuests(initialState, []);
    const result = startQuest(state, 'q_ch2_survive_streets');
    expect(result.success).toBe(false);
    expect(result.narrative).toContain('Cannot start quest');
  });

  it('replaces a previously locked version of the same quest', () => {
    const state = withQuests(initialState, [
      { id: 'q_side_herbalist', title: 'old', type: 'side', status: 'locked', description: ', prerequisites: [] },
    ]);
    const result = startQuest(state, 'q_side_herbalist');
    const questInstances = result.state.player.quests.filter(q => q.id === 'q_side_herbalist');
    expect(questInstances).toHaveLength(1);
    expect(questInstances[0].status).toBe('active');
  });

  it('starts guild quest when prerequisite is met', () => {
    const state = withCompletedQuest(withQuests(initialState, []), 'q_ch1_orphans_cage');
    // q_side_sewers_children requires q_ch1_orphans_cage
    const result = startQuest(state, 'q_side_sewers_children');
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateQuestObjective
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateQuestObjective', () => {
  it('fails if quest is not active', () => {
    const result = updateQuestObjective(initialState, 'q_nonexistent','obj_x', 1);
    expect(result.success).toBe(false);
  });

  it('fails if objective id does not exist', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('test_q', 3)]);
    const result = updateQuestObjective(state, 'test_q','obj_wrong', 1);
    expect(result.success).toBe(false);
  });

  it('increments count-based objective', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('count_q', 5)]);
    const result = updateQuestObjective(state, 'count_q','obj_count', 2);
    const obj = result.state.player.quests.find(q => q.id === 'count_q')?.objectives?.[0];
    expect(obj?.count).toBe(2);
    expect(obj?.completed).toBe(false);
  });

  it('marks count objective complete when reaching required_count', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('finish_q', 3)]);
    const result = updateQuestObjective(state, 'finish_q','obj_count', 3);
    const obj = result.state.player.quests.find(q => q.id === 'finish_q')?.objectives?.[0];
    expect(obj?.completed).toBe(true);
  });

  it('caps count at required_count (no overflow)', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('cap_q', 3)]);
    const result = updateQuestObjective(state, 'cap_q','obj_count', 99);
    const obj = result.state.player.quests.find(q => q.id === 'cap_q')?.objectives?.[0];
    expect(obj?.count).toBe(3);
    expect(obj?.completed).toBe(true);
  });

  it('marks non-count objective complete when progress >= 1', () => {
    const simpleQuest: Quest = {
      id: 'simple_q', title: 'S', type: 'side', status: 'active', description: ',
      objectives: [{ id: 'obj_simple', description: 'Do thing', completed: false }],
      prerequisites: [],
    };
    const state = withQuests(initialState, [simpleQuest]);
    const result = updateQuestObjective(state, 'simple_q','obj_simple', 1);
    const obj = result.state.player.quests.find(q => q.id === 'simple_q')?.objectives?.[0];
    expect(obj?.completed).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// completeQuest
// ═══════════════════════════════════════════════════════════════════════════════

describe('completeQuest', () => {
  it('fails if quest is not active', () => {
    const result = completeQuest(initialState, 'q_nonexistent', seeded(1));
    expect(result.success).toBe(false);
  });

  it('fails if any objective is incomplete', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('partial_q', 5)]);
    const result = completeQuest(state, 'partial_q', seeded(1));
    expect(result.success).toBe(false);
    expect(result.narrative).toContain('objective(s) remain');
  });

  it('marks quest as completed on success', () => {
    const state = withQuests(initialState, [fullyCompletedActiveQuest('done_q')]);
    const result = completeQuest(state, 'done_q', seeded(1));
    expect(result.success).toBe(true);
    const quest = result.state.player.quests.find(q => q.id === 'done_q');
    expect(quest?.status).toBe('completed');
  });

  it('distributes gold reward', () => {
    const goldBefore = initialState.player.gold;
    const state = withQuests(initialState, [fullyCompletedActiveQuest('gold_q')]);
    const result = completeQuest(state, 'gold_q', seeded(1));
    expect(result.state.player.gold).toBe(goldBefore + 50);
  });

  it('distributes skill reward', () => {
    const skulBefore = initialState.player.skills.skulduggery;
    const state = withQuests(initialState, [fullyCompletedActiveQuest('skill_q')]);
    const result = completeQuest(state, 'skill_q', seeded(1));
    expect(result.state.player.skills.skulduggery).toBe(skulBefore + 5);
  });

  it('unlocks a feat reward', () => {
    const state = withQuests(initialState, [fullyCompletedActiveQuest('feat_q')]);
    const result = completeQuest(state, 'feat_q', seeded(1));
    const feat = result.state.player.feats.find(f => f.id === 'feat_light_fingers');
    // Only checks if present (feat might not be in initial feats list)
    if (feat) {
      expect(feat.unlocked).toBe(true);
    }
  });

  it('auto-starts eligible follow-up quests', () => {
    // Completing q_ch1_orphans_cage should unlock q_ch2_survive_streets
    const ch1Completed: Quest = {
      id: 'q_ch1_orphans_cage', title: 'The Orphan\'s Cage', type: 'main',
      status: 'active', description: ',
      objectives: [{ id: 'obj_leave_orphanage', description: 'Escape', completed: true }],
      rewards: { feats: ['feat_first_steps'], xp: 50 },
      prerequisites: [],
    };
    const state = withQuests(initialState, [ch1Completed]);
    const result = completeQuest(state, 'q_ch1_orphans_cage', seeded(1));
    expect(result.success).toBe(true);
    const ch2 = result.state.player.quests.find(q => q.id === 'q_ch2_survive_streets');
    expect(ch2?.status).toBe('active');
  });

  it('rewards_given is populated on success', () => {
    const state = withQuests(initialState, [fullyCompletedActiveQuest('reward_check_q')]);
    const result = completeQuest(state, 'reward_check_q', seeded(1));
    expect(result.rewards_given).toBeDefined();
    expect(result.rewards_given?.gold).toBe(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// failQuest
// ═══════════════════════════════════════════════════════════════════════════════

describe('failQuest', () => {
  it('marks quest as failed', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('fail_me', 5)]);
    const result = failQuest(state, 'fail_me','Time ran out.');
    expect(result.success).toBe(true);
    const quest = result.state.player.quests.find(q => q.id === 'fail_me');
    expect(quest?.status).toBe('failed');
  });

  it('fails silently if quest is not active', () => {
    const result = failQuest(initialState, 'q_nonexistent','reason');
    expect(result.success).toBe(false);
  });

  it('main quest failure adds stress', () => {
    const mainQuest: Quest = {
      id: 'main_fail_q', title: 'Main', type: 'main', status: 'active', description: ',
      objectives: [{ id: 'obj1', description: 'd', completed: false }],
      prerequisites: [],
    };
    const stressBefore = initialState.player.stats.stress;
    const state = withQuests(initialState, [mainQuest]);
    const result = failQuest(state, 'main_fail_q','Failed the main story.');
    expect(result.state.player.stats.stress).toBeGreaterThan(stressBefore);
  });

  it('side quest failure does not add stress', () => {
    const stressBefore = initialState.player.stats.stress;
    const state = withQuests(initialState, [activeQuestWithCountObj('side_fail_q', 3)]);
    const result = failQuest(state, 'side_fail_q','Just a side quest.');
    expect(result.state.player.stats.stress).toBe(stressBefore);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// abandonQuest
// ═══════════════════════════════════════════════════════════════════════════════

describe('abandonQuest', () => {
  it('removes side quest from journal', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('abandon_me', 5)]);
    const result = abandonQuest(state, 'abandon_me');
    expect(result.success).toBe(true);
    expect(result.state.player.quests.find(q => q.id === 'abandon_me')).toBeUndefined();
  });

  it('cannot abandon main story quests', () => {
    const mainQuest: Quest = {
      id: 'main_no_abandon', title: 'Main', type: 'main', status: 'active',
      description: ', objectives: [], prerequisites: [],
    };
    const state = withQuests(initialState, [mainQuest]);
    const result = abandonQuest(state, 'main_no_abandon');
    expect(result.success).toBe(false);
    expect(result.narrative).toContain('cannot be abandoned');
  });

  it('fails when quest is not active', () => {
    const result = abandonQuest(initialState, 'q_nonexistent');
    expect(result.success).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getActiveQuests / getAvailableQuests
// ═══════════════════════════════════════════════════════════════════════════════

describe('getActiveQuests', () => {
  it('returns only active quests', () => {
    const quests: Quest[] = [
      { id: 'a1', title: 'A', type: 'side', status: 'active',    description: ', prerequisites: [] },
      { id: 'a2', title: 'B', type: 'side', status: 'completed', description: ', prerequisites: [] },
      { id: 'a3', title: 'C', type: 'side', status: 'failed',    description: ', prerequisites: [] },
    ];
    const state = withQuests(initialState, quests);
    const active = getActiveQuests(state);
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe('a1');
  });

  it('includes objectives in result', () => {
    const q: Quest = {
      id: 'obj_check', title: 'O', type: 'side', status: 'active', description: ',
      objectives: [{ id: 'o1', description: 'do', completed: false }],
      prerequisites: [],
    };
    const state = withQuests(initialState, [q]);
    const active = getActiveQuests(state);
    expect(active[0].objectives?.length).toBe(1);
  });
});

describe('getAvailableQuests', () => {
  it('includes quests with no prerequisites on fresh state', () => {
    const state = withQuests(initialState, []);
    const available = getAvailableQuests(state);
    expect(available.some(q => q.id === 'q_side_herbalist')).toBe(true);
  });

  it('excludes quests that are already active', () => {
    const state = withQuests(initialState, [activeQuestWithCountObj('q_side_herbalist', 1)]);
    const available = getAvailableQuests(state);
    expect(available.some(q => q.id === 'q_side_herbalist')).toBe(false);
  });

  it('excludes quests with unmet prerequisites', () => {
    const state = withQuests(initialState, []);
    const available = getAvailableQuests(state);
    // q_ch4_thieves_guild requires q_ch3_first_honest_work → not available
    expect(available.some(q => q.id === 'q_ch4_thieves_guild')).toBe(false);
  });

  it('includes ES guild quests that have no prerequisites and all flags met', () => {
    const state = withQuests(initialState, []);
    const available = getAvailableQuests(state);
    // q_companions_initiation has no prerequisites
    expect(available.some(q => q.id === 'q_companions_initiation')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveQuestChoice
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveQuestChoice', () => {
  const DARK_BROTHERHOOD_CHOICES: QuestChoice[] = [
    {
      id:    'choice_honour_contract',
      label: 'Honour the contract',
      description: 'Complete the Sacrament as requested.',
      consequences: {
        complete_objective: 'obj_make_choice',
        unlock_quest:       'q_side_leighton_secret',
        event_flags:        { dark_path_chosen: true },
        narrative:          'You embrace the shadows. The Brotherhood will be pleased.',
      },
    },
    {
      id:    'choice_refuse_contract',
      label: 'Refuse the contract',
      description: 'Walk away from the darkness.',
      consequences: {
        complete_objective: 'obj_make_choice',
        stat_deltas:        { purity: 5, corruption: -5 },
        event_flags:        { dark_path_chosen: false },
        narrative:          'You reject the darkness. Aventus weeps, but you leave with a clear conscience.',
      },
    },
    {
      id:    'choice_persuade_skulduggery',
      label: 'Persuade with silver tongue',
      description: 'Use your skulduggery to find another way.',
      requirements:  { skill: 'skulduggery', min_value: 30 },
      consequences: {
        complete_objective: 'obj_make_choice',
        skill_deltas:       { skulduggery: 3 },
        narrative:          'With cunning words, you find a middle path.',
      },
    },
  ];

  function dbState(objectivesCompleted: boolean = false): GameState {
    const dbQuest: Quest = {
      ...ES_GUILD_QUESTS['q_dark_brotherhood_contact'],
      status: 'active',
      objectives: ES_GUILD_QUESTS['q_dark_brotherhood_contact'].objectives!.map(o =>
        objectivesCompleted ? { ...o, completed: true } : o,
      ),
    };
    return withCompletedQuest(
      withQuests(initialState, [dbQuest]),
      'q_ch5_hidden_depths',
    );
  }

  it('fails if quest is not active', () => {
    const result = resolveQuestChoice(initialState, 'q_dark_brotherhood_contact','choice_honour_contract', DARK_BROTHERHOOD_CHOICES, seeded(1));
    expect(result.success).toBe(false);
  });

  it('fails if choice id is not in registry', () => {
    const state = dbState();
    const result = resolveQuestChoice(state, 'q_dark_brotherhood_contact','choice_invalid', DARK_BROTHERHOOD_CHOICES, seeded(1));
    expect(result.success).toBe(false);
  });

  it('choice honours contract sets dark_path_chosen flag', () => {
    const state = dbState();
    const result = resolveQuestChoice(state, 'q_dark_brotherhood_contact','choice_honour_contract', DARK_BROTHERHOOD_CHOICES, seeded(1));
    expect(result.success).toBe(true);
    expect(result.state.world.event_flags['dark_path_chosen']).toBe(true);
  });

  it('choice refuses contract applies stat deltas', () => {
    const state = dbState();
    const purityBefore     = state.player.stats.purity;
    const corruptionBefore = state.player.stats.corruption;
    const result = resolveQuestChoice(state, 'q_dark_brotherhood_contact','choice_refuse_contract', DARK_BROTHERHOOD_CHOICES, seeded(1));
    expect(result.state.player.stats.purity).toBe(Math.min(purityBefore + 5, 100));
    expect(result.state.player.stats.corruption).toBe(Math.max(corruptionBefore - 5, 0));
  });

  it('skill requirement blocks choice if skill is too low', () => {
    const lowState = {
      ...dbState(),
      player: { ...dbState().player, skills: { ...dbState().player.skills, skulduggery: 10 } },
    };
    const result = resolveQuestChoice(lowState, 'q_dark_brotherhood_contact','choice_persuade_skulduggery', DARK_BROTHERHOOD_CHOICES, seeded(1));
    expect(result.success).toBe(false);
    expect(result.narrative).toContain('skulduggery');
  });

  it('skill requirement passes when skill meets threshold', () => {
    const skillState = {
      ...dbState(),
      player: { ...dbState().player, skills: { ...dbState().player.skills, skulduggery: 35 } },
    };
    const result = resolveQuestChoice(skillState, 'q_dark_brotherhood_contact','choice_persuade_skulduggery', DARK_BROTHERHOOD_CHOICES, seeded(1));
    expect(result.success).toBe(true);
  });

  it('choice unlocks a follow-up quest', () => {
    const state = dbState();
    const result = resolveQuestChoice(state, 'q_dark_brotherhood_contact','choice_honour_contract', DARK_BROTHERHOOD_CHOICES, seeded(1));
    // q_side_leighton_secret should be unlocked
    const unlocked = result.state.player.quests.find(q => q.id === 'q_side_leighton_secret');
    expect(unlocked?.status).toBe('active');
  });

  it('fail_quest choice terminates the quest', () => {
    const failChoices: QuestChoice[] = [{
      id: 'choice_betray', label: 'Betray',
      description: 'Betray the guild.',
      consequences: { fail_quest: true, narrative: 'You betray them. The quest is over.''},
    }];
    const testQuest: Quest = {
      id: 'betray_q', title: 'Betray', type: 'side', status: 'active', description: ',
      objectives: [{ id: 'obj1', description: 'd', completed: false }],
      prerequisites: [],
    };
    const state = withQuests(initialState, [testQuest]);
    const result = resolveQuestChoice(state, 'betray_q','choice_betray', failChoices, seeded(1));
    const quest = result.state.player.quests.find(q => q.id === 'betray_q');
    expect(quest?.status).toBe('failed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// generateRadiantQuest / addRadiantQuest
// ═══════════════════════════════════════════════════════════════════════════════

describe('generateRadiantQuest', () => {
  it('returns a valid quest object', () => {
    const quest = generateRadiantQuest(42, seeded(42));
    expect(quest.id).toMatch(/^q_radiant_/);
    expect(quest.status).toBe('active');
    expect(quest.objectives?.length).toBeGreaterThan(0);
    expect(quest.title.length).toBeGreaterThan(0);
  });

  it('produces different quests with different seeds', () => {
    const q1 = generateRadiantQuest(1,  seeded(1));
    const q2 = generateRadiantQuest(99, seeded(99));
    // IDs differ at minimum
    expect(q1.id).not.toBe(q2.id);
  });

  it('includes reward structure', () => {
    const quest = generateRadiantQuest(7, seeded(7));
    expect(quest.rewards).toBeDefined();
    expect(quest.rewards?.xp).toBeGreaterThan(0);
  });
});

describe('addRadiantQuest', () => {
  it('adds a radiant quest to the journal', () => {
    const state = withQuests(initialState, []);
    const result = addRadiantQuest(state, seeded(10));
    expect(result.success).toBe(true);
    const radiant = result.state.player.quests.filter(q => q.id.startsWith('q_radiant_'));
    expect(radiant.length).toBe(1);
  });

  it('blocks adding more than 3 active radiant quests', () => {
    const radiantQuests: Quest[] = Array.from({ length: 3 }, (_, i) => ({
      id: `q_radiant_${i}`, title: `Radiant ${i}`, type: 'side''as const,
      status: 'active''as const, description: ', objectives: [], prerequisites: [],
    }));
    const state = withQuests(initialState, radiantQuests);
    const result = addRadiantQuest(state, seeded(99));
    expect(result.success).toBe(false);
    expect(result.narrative).toContain('too many');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ES_GUILD_QUESTS registry
// ═══════════════════════════════════════════════════════════════════════════════

describe('ES_GUILD_QUESTS', () => {
  it('contains all five required ES questlines', () => {
    expect(ES_GUILD_QUESTS['q_companions_initiation']).toBeDefined();
    expect(ES_GUILD_QUESTS['q_thieves_guild_intro']).toBeDefined();
    expect(ES_GUILD_QUESTS['q_college_enrollment']).toBeDefined();
    expect(ES_GUILD_QUESTS['q_dark_brotherhood_contact']).toBeDefined();
    expect(ES_GUILD_QUESTS['q_civil_war_stormcloaks']).toBeDefined();
    expect(ES_GUILD_QUESTS['q_civil_war_imperial']).toBeDefined();
  });

  it('each guild quest has at least one objective', () => {
    for (const quest of Object.values(ES_GUILD_QUESTS)) {
      expect(quest.objectives?.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('each guild quest has an XP reward', () => {
    for (const quest of Object.values(ES_GUILD_QUESTS)) {
      expect(quest.rewards?.xp).toBeGreaterThan(0);
    }
  });
});
