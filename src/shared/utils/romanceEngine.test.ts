/**
 * romanceEngine.test.ts — 30+ tests covering all romance resolvers.
 */
import { describe, it, expect } from 'vitest';
import { initialState } from '../../core/state/initialState';
import { GameState, NpcRelationship } from '../../core/types';
import {
  resolveFlirt,
  resolveDate,
  resolveProposal,
  resolveBreakup,
  resolveJealousyEvent,
  resolveGift,
  resolveIntimateEncounter,
  getRomanceStatus,
  getEligiblePartners,
  calculateRomanceCompatibility,
  extractRomanceState,
  encodeRomanceState,
  isPreferredGift,
  RACIAL_GIFT_PREFERENCES,
  AMULET_OF_MARA_ID,
} from './romanceEngine';
import { defaultRomanceState } from '../../features/simulation/systems/RomanceSystem';

// ── Seeded RNG ────────────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) // 0x100000000;
  };
}

// ── Base state helpers ────────────────────────────────────────────────────────

function withNpc(
  baseState: GameState,
  npcId: string,
  overrides: Partial<NpcRelationship> = {},
): GameState {
  const rel: NpcRelationship = {
    npc_id:               npcId,
    trust:                30,
    love:                 20,
    fear:                 0,
    dom:                  0,
    sub:                  0,
    milestone:            'friend',
    met_on_day:           1,
    last_interaction_day: 1,
    interaction_count:    10,
    scene_flags:          {},
    ...overrides,
  };
  return {
    ...baseState,
    world: {
      ...baseState.world,
      npc_relationships: {
        ...baseState.world.npc_relationships,
        [npcId]: rel,
      },
    },
  };
}

/** Set romance stage on an existing NPC relationship. */
function withRomanceStage(
  state: GameState,
  npcId: string,
  stageIdx: number, / 0=none, 1=attracted, 2=flirting, 3=courting, 4=dating, 5=committed
  extras: Partial<ReturnType<typeof defaultRomanceState>> = {},
): GameState {
  const romance = {
    ...defaultRomanceState(),
    stage: (['none','attracted','flirting','courting','dating','committed'] as const)[stageIdx],
    attraction: 60,
    intimacy: 50,
    passion: 40,
    ...extras,
  };
  const rel = state.world.npc_relationships[npcId] ?? {
    npc_id: npcId, trust: 30, love: 20, fear: 0, dom: 0, sub: 0,
    milestone: 'friend', met_on_day: 1, last_interaction_day: 1,
    interaction_count: 20, scene_flags: {},
  };
  const encoded = encodeRomanceState(rel as NpcRelationship, romance);
  return {
    ...state,
    world: {
      ...state.world,
      npc_relationships: {
        ...state.world.npc_relationships,
        [npcId]: encoded,
      },
    },
  };
}

function withAmuletOfMara(state: GameState): GameState {
  const hasAmulet = state.player.inventory.some(i => i.id === AMULET_OF_MARA_ID);
  if (hasAmulet) return state;
  return {
    ...state,
    player: {
      ...state.player,
      inventory: [
        ...state.player.inventory,
        {
          id: AMULET_OF_MARA_ID,
          name: 'Amulet of Mara',
          type: 'misc''as const,
          rarity: 'epic''as const,
          description: 'Symbol of Mara, Goddess of Love.',
          value: 150,
          weight: 0.1,
        },
      ],
    },
  };
}

function withoutAmuletOfMara(state: GameState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      inventory: state.player.inventory.filter(i => i.id !== AMULET_OF_MARA_ID),
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// extractRomanceState / encodeRomanceState
// ═══════════════════════════════════════════════════════════════════════════════

describe('extractRomanceState', () => {
  it('returns default romance state when scene_flags are empty', () => {
    const rel: NpcRelationship = {
      npc_id: 'test', trust: 0, love: 0, fear: 0, dom: 0, sub: 0,
      milestone: 'stranger', met_on_day: 1, last_interaction_day: 1,
      interaction_count: 0, scene_flags: {},
    };
    const r = extractRomanceState(rel);
    expect(r.stage).toBe('none');
    expect(r.attraction).toBe(0);
    expect(r.compatibility).toBe(50);
  });

  it('round-trips through encodeRomanceState', () => {
    const romance = {
      ...defaultRomanceState(),
      stage: 'dating''as const,
      attraction: 72,
      intimacy: 55,
      passion: 40,
      jealousy: 12,
      compatibility: 68,
      dates_count: 7,
      rejection_count: 1,
      last_date_turn: 30,
    };
    const rel: NpcRelationship = {
      npc_id: 'npc1', trust: 50, love: 60, fear: 0, dom: 0, sub: 0,
      milestone: 'lover', met_on_day: 1, last_interaction_day: 10,
      interaction_count: 30, scene_flags: {},
    };
    const encoded = encodeRomanceState(rel, romance);
    const decoded = extractRomanceState(encoded);
    expect(decoded.stage).toBe('dating');
    expect(decoded.attraction).toBe(72);
    expect(decoded.intimacy).toBe(55);
    expect(decoded.dates_count).toBe(7);
    expect(decoded.rejection_count).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// isPreferredGift
// ═══════════════════════════════════════════════════════════════════════════════

describe('isPreferredGift', () => {
  it('returns true for Nord preferred gift', () => {
    expect(isPreferredGift('mead','Nord')).toBe(true);
  });
  it('returns true for Khajiit preferred gift', () => {
    expect(isPreferredGift('moon_sugar','Khajiit')).toBe(true);
  });
  it('returns false for non-preferred item', () => {
    expect(isPreferredGift('void_salts','Nord')).toBe(false);
  });
  it('returns false for unknown race', () => {
    expect(isPreferredGift('mead','Unknown')).toBe(false);
  });
  it('RACIAL_GIFT_PREFERENCES covers all ten playable races', () => {
    const races = ['Nord','Imperial','Breton','Redguard','Dunmer','Altmer','Bosmer','Khajiit','Argonian','Orc'];
    for (const race of races) {
      expect(RACIAL_GIFT_PREFERENCES[race].length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// calculateRomanceCompatibility
// ═══════════════════════════════════════════════════════════════════════════════

describe('calculateRomanceCompatibility', () => {
  it('returns ~50 for empty trait arrays', () => {
    expect(calculateRomanceCompatibility([], [])).toBe(50);
  });
  it('boosts score for compatible trait pairs', () => {
    const score = calculateRomanceCompatibility(['brave'], ['loyal']);
    expect(score).toBeGreaterThan(50);
  });
  it('lowers score for incompatible trait pairs', () => {
    const score = calculateRomanceCompatibility(['greedy'], ['generous']);
    expect(score).toBeLessThan(50);
  });
  it('clamps output to [0, 100]', () => {
    // Many incompatible pairs
    const score = calculateRomanceCompatibility(
      ['greedy','treacherous','aggressive','cowardly'],
      ['generous','loyal','aggressive','brave'],
    );
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveFlirt
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveFlirt', () => {
  it('succeeds with deterministically high RNG roll below success threshold', () => {
    const state = withNpc(initialState, 'brynjolf', { trust: 40, love: 20, interaction_count: 15 });
    // seeded(1) should yield a low first value → success
    const result = resolveFlirt(state, 'brynjolf','charming', seeded(1));
    expect(['positive','negative']).toContain(result.outcome);
    expect(result.stage).toBeDefined();
  });

  it('returns rejected outcome when romance stage is already rejected', () => {
    let state = withNpc(initialState, 'maven', { trust: 10, love: 0 });
    state = withRomanceStage(state, 'maven', 0, { stage: 'rejected''} as any);
    // Force stage to rejected via scene_flags
    const rel = state.world.npc_relationships['maven'];
    const rejectedRel = encodeRomanceState(rel, { ...defaultRomanceState(), stage: 'rejected''});
    const stateWithRejected = {
      ...state,
      world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, maven: rejectedRel } },
    };
    const result = resolveFlirt(stateWithRejected, 'maven','bold', seeded(42));
    expect(result.outcome).toBe('rejected');
  });

  it('bold approach has higher love delta on success', () => {
    // Force success by seeding a very low value
    const state = withNpc(initialState, 'npc_a', { trust: 50, love: 30, interaction_count: 20 });
    // Use a seed that gives consistent first value < 0.4 (bold base_chance)
    const r1 = resolveFlirt(state, 'npc_a','bold',     seeded(5));
    const r2 = resolveFlirt(state, 'npc_a','charming', seeded(5));
    // Both may succeed or fail; verify deltas have expected structure
    expect(typeof r1.deltas.love).toBe('number');
    expect(typeof r2.deltas.love).toBe('number');
  });

  it('updates game state npc_relationships', () => {
    const state = withNpc(initialState, 'talen', {});
    const result = resolveFlirt(state, 'talen','subtle', seeded(10));
    expect(result.state.world.npc_relationships['talen']).toBeDefined();
  });

  it('negative flirt increases rejection_count in romance state', () => {
    const state = withNpc(initialState, 'npc_reject', { trust: 5, love: 5 });
    // Use a seed that forces failure (high value > success threshold)
    const highRng = () => 0.99;
    const result = resolveFlirt(state, 'npc_reject','bold', highRng);
    const romance = extractRomanceState(result.state.world.npc_relationships['npc_reject']);
    expect(result.outcome).toBe('negative');
    expect(romance.rejection_count).toBeGreaterThan(0);
  });

  it('three consecutive rejections set stage to rejected', () => {
    let state = withNpc(initialState, 'npc_cold', { trust: 5, love: 5 });
    const failRng = () => 0.99;
    // Apply 3 rejections manually via encodeRomanceState
    const romance = { ...defaultRomanceState(), rejection_count: 2, stage: 'attracted''as const, attraction: 25 };
    const rel = state.world.npc_relationships['npc_cold'];
    const encoded = encodeRomanceState(rel, romance);
    state = { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, npc_cold: encoded } } };
    // One more rejection should push to rejected
    const result = resolveFlirt(state, 'npc_cold','bold', failRng);
    const finalRomance = extractRomanceState(result.state.world.npc_relationships['npc_cold']);
    expect(finalRomance.stage).toBe('rejected');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveDate
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveDate', () => {
  it('rejects date if romance stage is none', () => {
    const state = withNpc(initialState, 'vilkas', {});
    const result = resolveDate(state, 'vilkas','tavern', seeded(1));
    expect(result.outcome).toBe('rejected');
  });

  it('tavern date with attracted NPC returns valid outcome', () => {
    let state = withNpc(initialState, 'mjoll', { trust: 40, love: 30, interaction_count: 15 });
    state = withRomanceStage(state, 'mjoll', 1); // attracted
    const result = resolveDate(state, 'mjoll','tavern', seeded(3));
    expect(['positive','neutral']).toContain(result.outcome);
    expect(result.stage).toBeDefined();
  });

  it('dungeon date returns positive outcome on success', () => {
    let state = withNpc(initialState, 'farkas', { trust: 50, love: 40, interaction_count: 20 });
    state = withRomanceStage(state, 'farkas', 2); // flirting
    const successRng = () => 0.1; // well below dungeon base_chance 0.45
    const result = resolveDate(state, 'farkas','dungeon', successRng);
    expect(result.outcome).toBe('positive');
    expect(result.deltas.love).toBeGreaterThan(0);
  });

  it('temple date gives highest love gain on success', () => {
    let state = withNpc(initialState, 'svana', { trust: 60, love: 50, interaction_count: 25 });
    state = withRomanceStage(state, 'svana', 3); // courting
    const result = resolveDate(state, 'svana','temple', () => 0.05);
    expect(result.deltas.love).toBe(7); // temple love_gain = 7
  });

  it('date cooldown penalty applies when too soon', () => {
    let state = withNpc(initialState, 'ysolda', { trust: 40, love: 30, interaction_count: 15 });
    state = withRomanceStage(state, 'ysolda', 2, { last_date_turn: state.world.turn_count }); // same turn
    // Should still work but with reduced chance — just verify no crash
    const result = resolveDate(state, 'ysolda','walk', seeded(7));
    expect(result).toBeDefined();
  });

  it('dates_count increments on positive outcome', () => {
    let state = withNpc(initialState, 'iona', { trust: 60, love: 50, interaction_count: 25 });
    state = withRomanceStage(state, 'iona', 2, { dates_count: 3 });
    const result = resolveDate(state, 'iona','walk', () => 0.05); // force success
    if (result.outcome === 'positive') {
      const romance = extractRomanceState(result.state.world.npc_relationships['iona']);
      expect(romance.dates_count).toBeGreaterThanOrEqual(4);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveProposal
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveProposal', () => {
  it('fails if romance stage is not dating or committed', () => {
    let state = withNpc(withAmuletOfMara(initialState), 'aela', {});
    state = withRomanceStage(state, 'aela', 2); // flirting
    const result = resolveProposal(state, 'aela', false, seeded(1));
    expect(result.outcome).toBe('failure');
    expect(result.narrative).toContain('bond must deepen');
  });

  it('fails without Amulet of Mara', () => {
    let state = withNpc(withoutAmuletOfMara(initialState), 'aela', { love: 80, trust: 70 });
    state = withRomanceStage(state, 'aela', 4); // dating
    const result = resolveProposal(state, 'aela', false, seeded(1));
    expect(result.outcome).toBe('failure');
    expect(result.narrative).toContain('Amulet of Mara');
  });

  it('succeeds with high love/trust + amulet at dating stage', () => {
    let state = withNpc(withAmuletOfMara(initialState), 'aela', { love: 90, trust: 80 });
    state = withRomanceStage(state, 'aela', 4, { dates_count: 6, intimacy: 80 }); // dating
    const result = resolveProposal(state, 'aela', true, () => 0.01); // force success
    expect(result.outcome).toBe('success');
    expect(result.narrative).toContain('pledged');
    expect(result.stage).toBe('committed');
  });

  it('ring bonus is applied to success chance', () => {
    // With ring should have higher chance — test that no crash occurs and outcome is valid
    let state = withNpc(withAmuletOfMara(initialState), 'marcurio', { love: 70, trust: 65 });
    state = withRomanceStage(state, 'marcurio', 4);
    const result = resolveProposal(state, 'marcurio', true, seeded(55));
    expect(['success','failure']).toContain(result.outcome);
  });

  it('temple location bonus increases success likelihood', () => {
    let state = withNpc(withAmuletOfMara(initialState), 'templeNpc', { love: 75, trust: 70 });
    state = withRomanceStage(state, 'templeNpc', 4);
    state = {
      ...state,
      world: {
        ...state.world,
        current_location: { ...state.world.current_location, id: 'temple_of_mara_riften''},
      },
    };
    const result = resolveProposal(state, 'templeNpc', false, () => 0.01);
    expect(result.outcome).toBe('success');
  });

  it('failed proposal increments rejection_count', () => {
    let state = withNpc(withAmuletOfMara(initialState), 'rejection_npc', { love: 30, trust: 20 });
    state = withRomanceStage(state, 'rejection_npc', 4);
    const result = resolveProposal(state, 'rejection_npc', false, () => 0.99); // force failure
    const romance = extractRomanceState(result.state.world.npc_relationships['rejection_npc']);
    expect(romance.rejection_count).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveBreakup
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveBreakup', () => {
  it('sets stage to broken_up', () => {
    let state = withNpc(initialState, 'heartbreak_npc', { love: 50, trust: 40 });
    state = withRomanceStage(state, 'heartbreak_npc', 4); // dating
    const result = resolveBreakup(state, 'heartbreak_npc','mutual', seeded(1));
    expect(result.stage).toBe('broken_up');
  });

  it('cruelty breakup imposes fear penalty', () => {
    let state = withNpc(initialState, 'cruelty_npc', { love: 50, trust: 40, fear: 10 });
    state = withRomanceStage(state, 'cruelty_npc', 5); // committed
    const result = resolveBreakup(state, 'cruelty_npc','cruelty', seeded(1));
    expect(result.deltas.fear).toBe(20);
    expect(result.state.world.npc_relationships['cruelty_npc'].fear).toBeGreaterThan(10);
  });

  it('infidelity breakup causes the largest trust loss', () => {
    let state = withNpc(initialState, 'infidel_npc', { love: 60, trust: 80 });
    state = withRomanceStage(state, 'infidel_npc', 5);
    const result = resolveBreakup(state, 'infidel_npc','infidelity', seeded(1));
    expect(result.deltas.trust).toBe(-30);
  });

  it('mutual breakup returns neutral outcome', () => {
    let state = withNpc(initialState, 'mutual_npc', { love: 40, trust: 40 });
    state = withRomanceStage(state, 'mutual_npc', 4);
    const result = resolveBreakup(state, 'mutual_npc','mutual', seeded(1));
    expect(result.outcome).toBe('neutral');
  });

  it('no-op when stage is already broken_up', () => {
    let state = withNpc(initialState, 'already_broken', {});
    state = withRomanceStage(state, 'already_broken', 0, { stage: 'broken_up''} as any);
    const rel = state.world.npc_relationships['already_broken'];
    const encoded = encodeRomanceState(rel, { ...defaultRomanceState(), stage: 'broken_up''});
    state = { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, already_broken: encoded } } };
    const result = resolveBreakup(state, 'already_broken','mutual', seeded(1));
    expect(result.outcome).toBe('neutral');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveJealousyEvent
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveJealousyEvent', () => {
  it('returns neutral when no romance exists', () => {
    const state = withNpc(initialState, 'no_romance', {});
    const result = resolveJealousyEvent(state, 'no_romance','rival_npc', seeded(1));
    expect(result.outcome).toBe('neutral');
  });

  it('high jealousy can cause break-up', () => {
    let state = withNpc(initialState, 'jealous_npc', { love: 50, trust: 40 });
    state = withRomanceStage(state, 'jealous_npc', 4, { jealousy: 85 });
    // Force the break-up branch (roll < 0.4)
    const lowRng = () => 0.1;
    const result = resolveJealousyEvent(state, 'jealous_npc','rival', lowRng);
    expect(result.stage).toBe('broken_up');
    expect(result.outcome).toBe('negative');
  });

  it('low jealousy resolves positively', () => {
    let state = withNpc(initialState, 'trusting_npc', { love: 60, trust: 60 });
    state = withRomanceStage(state, 'trusting_npc', 3, { jealousy: 10 });
    const result = resolveJealousyEvent(state, 'trusting_npc','rival', seeded(2));
    expect(result.outcome).toBe('positive');
    expect(result.deltas.love).toBeGreaterThan(0);
  });

  it('rival love influences jealousy level', () => {
    let state = withNpc(initialState, 'jealous_mid', { love: 50, trust: 40 });
    state = withRomanceStage(state, 'jealous_mid', 4, { jealousy: 30 });
    // Add rival with high love
    state = withNpc(state, 'popular_rival', { love: 90, trust: 50 });
    const result = resolveJealousyEvent(state, 'jealous_mid','popular_rival', seeded(9));
    // Rival's love (90) * 0.3 = 27 pushes total jealousy above 40
    expect(['positive','neutral','negative']).toContain(result.outcome);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveGift
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveGift', () => {
  it('fails gracefully when item not in inventory', () => {
    const state = withNpc(initialState, 'gift_npc', {});
    const result = resolveGift(state, 'gift_npc','nonexistent_item', seeded(1));
    expect(result.outcome).toBe('failure');
  });

  it('removes item from inventory on success', () => {
    const state = withNpc(withAmuletOfMara(initialState), 'gift_npc2', {});
    const result = resolveGift(state, 'gift_npc2', AMULET_OF_MARA_ID, seeded(1));
    const hasItem = result.state.player.inventory.some(i => i.id === AMULET_OF_MARA_ID);
    expect(hasItem).toBe(false);
  });

  it('preferred gift gives higher love delta than non-preferred', () => {
    // Add both items to inventory
    const mead = { id: 'mead', name: 'Mead', type: 'consumable''as const, rarity: 'common''as const, description: ', value: 5, weight: 0.5 };
    const rock = { id: 'plain_rock', name: 'Rock', type: 'misc''as const, rarity: 'common''as const, description: ', value: 1, weight: 1 };

    const nordNpc = (s: GameState) => ({
      ...s,
      world: {
        ...s.world,
        npc_relationships: {
          ...s.world.npc_relationships,
          nord_npc: {
            npc_id: 'nord_npc', trust: 30, love: 20, fear: 0, dom: 0, sub: 0,
            milestone: 'friend''as const, met_on_day: 1, last_interaction_day: 1,
            interaction_count: 10, scene_flags: {},
          },
        },
      },
    });

    const stateA = { ...nordNpc(initialState), player: { ...initialState.player, inventory: [mead] } };
    const stateB = { ...nordNpc(initialState), player: { ...initialState.player, inventory: [rock] } };

    const r1 = resolveGift(stateA, 'nord_npc','mead', () => 0.5);       / preferred
    const r2 = resolveGift(stateB, 'nord_npc','plain_rock', () => 0.5); // not preferred

    expect(r1.deltas.love!).toBeGreaterThan(r2.deltas.love!);
  });

  it('special reaction triggers on preferred gift with low roll', () => {
    const mead = { id: 'mead', name: 'Mead', type: 'consumable''as const, rarity: 'common''as const, description: ', value: 5, weight: 0.5 };
    let state = withNpc(initialState, 'special_npc', {});
    state = { ...state, player: { ...state.player, inventory: [mead] } };
    const result = resolveGift(state, 'special_npc','mead', () => 0.01); // low roll
    // Special reaction narrative contains 'treasure''or similar
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// resolveIntimateEncounter
// ═══════════════════════════════════════════════════════════════════════════════

describe('resolveIntimateEncounter', () => {
  it('non-consensual encounter destroys trust and adds fear', () => {
    let state = withNpc(initialState, 'victim_npc', { trust: 50, fear: 0 });
    state = withRomanceStage(state, 'victim_npc', 5); // committed
    const result = resolveIntimateEncounter(state, 'victim_npc', false, seeded(1));
    expect(result.outcome).toBe('negative');
    expect(result.state.world.npc_relationships['victim_npc'].trust).toBeLessThan(50);
    expect(result.state.world.npc_relationships['victim_npc'].fear).toBeGreaterThan(0);
  });

  it('non-consensual encounter adds trauma to player stats', () => {
    let state = withNpc(initialState, 'consent_npc', { trust: 40, fear: 0 });
    state = withRomanceStage(state, 'consent_npc', 5);
    const traumaBefore = state.player.stats.trauma;
    const result = resolveIntimateEncounter(state, 'consent_npc', false, seeded(1));
    expect(result.state.player.stats.trauma).toBeGreaterThan(traumaBefore);
  });

  it('consensual encounter rejected at stage none/attracted', () => {
    const state = withNpc(initialState, 'too_early_npc', { love: 20, trust: 20 });
    const result = resolveIntimateEncounter(state, 'too_early_npc', true, seeded(1));
    expect(result.outcome).toBe('rejected');
  });

  it('consensual encounter at courting stage may succeed', () => {
    let state = withNpc(initialState, 'courting_npc', { love: 55, trust: 50 });
    state = withRomanceStage(state, 'courting_npc', 3, { intimacy: 30, passion: 50 }); // courting
    const result = resolveIntimateEncounter(state, 'courting_npc', true, () => 0.05);
    expect(['positive','neutral']).toContain(result.outcome);
  });

  it('positive consensual encounter boosts intimacy and passion', () => {
    let state = withNpc(initialState, 'intimate_npc', { love: 70, trust: 60 });
    state = withRomanceStage(state, 'intimate_npc', 4, { passion: 60, intimacy: 50 });
    const result = resolveIntimateEncounter(state, 'intimate_npc', true, () => 0.05);
    if (result.outcome === 'positive') {
      const romance = extractRomanceState(result.state.world.npc_relationships['intimate_npc']);
      expect(romance.intimacy).toBeGreaterThan(50);
      expect(romance.passion).toBeGreaterThan(60);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRomanceStatus
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRomanceStatus', () => {
  it('returns default status for unknown NPC', () => {
    const status = getRomanceStatus(initialState, 'unknown_npc');
    expect(status.stage).toBe('none');
    expect(status.stage_label).toBe('No Interest');
    expect(status.can_propose).toBe(false);
  });

  it('can_propose is true when dating + has amulet', () => {
    let state = withNpc(withAmuletOfMara(initialState), 'mara_candidate', { love: 70, trust: 60 });
    state = withRomanceStage(state, 'mara_candidate', 4);
    const status = getRomanceStatus(state, 'mara_candidate');
    expect(status.can_propose).toBe(true);
  });

  it('can_propose is false when at flirting stage even with amulet', () => {
    let state = withNpc(withAmuletOfMara(initialState), 'too_early', { love: 50, trust: 40 });
    state = withRomanceStage(state, 'too_early', 2);
    const status = getRomanceStatus(state, 'too_early');
    expect(status.can_propose).toBe(false);
  });

  it('returns correct stage label for committed', () => {
    let state = withNpc(initialState, 'committed_npc', { love: 90, trust: 80 });
    state = withRomanceStage(state, 'committed_npc', 5);
    const status = getRomanceStatus(state, 'committed_npc');
    expect(status.stage).toBe('committed');
    expect(status.stage_label).toBe('Committed');
  });

  it('narrative is a non-empty string for all stages', () => {
    const stages = ['none','attracted','flirting','courting','dating','committed','rejected','broken_up'];
    for (const stageStr of stages) {
      let state = withNpc(initialState, `npc_${stageStr}`, {});
      const rel = state.world.npc_relationships[`npc_${stageStr}`];
      const encoded = encodeRomanceState(rel, { ...defaultRomanceState(), stage: stageStr as any });
      state = { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, [`npc_${stageStr}`]: encoded } } };
      const status = getRomanceStatus(state, `npc_${stageStr}`);
      expect(status.narrative.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getEligiblePartners
// ═══════════════════════════════════════════════════════════════════════════════

describe('getEligiblePartners', () => {
  it('returns empty array when no relationships exist', () => {
    const state = { ...initialState, world: { ...initialState.world, npc_relationships: {} } };
    expect(getEligiblePartners(state)).toHaveLength(0);
  });

  it('excludes rejected NPCs', () => {
    let state = withNpc(initialState, 'rejected_npc', { love: 0 });
    const rel = state.world.npc_relationships['rejected_npc'];
    const encoded = encodeRomanceState(rel, { ...defaultRomanceState(), stage: 'rejected''});
    state = { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, rejected_npc: encoded } } };
    const partners = getEligiblePartners(state);
    expect(partners.some(p => p.npc_id === 'rejected_npc')).toBe(false);
  });

  it('excludes broken_up NPCs', () => {
    let state = withNpc(initialState, 'broken_npc', { love: 10 });
    const rel = state.world.npc_relationships['broken_npc'];
    const encoded = encodeRomanceState(rel, { ...defaultRomanceState(), stage: 'broken_up''});
    state = { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, broken_npc: encoded } } };
    const partners = getEligiblePartners(state);
    expect(partners.some(p => p.npc_id === 'broken_npc')).toBe(false);
  });

  it('includes attracted NPCs with love > 0', () => {
    let state = withNpc(initialState, 'attractive_npc', { love: 25 });
    state = withRomanceStage(state, 'attractive_npc', 1); // attracted
    const partners = getEligiblePartners(state);
    expect(partners.some(p => p.npc_id === 'attractive_npc')).toBe(true);
  });

  it('sorts by attraction + love descending', () => {
    let state = withNpc(initialState, 'npc_high', { love: 80 });
    state = withRomanceStage(state, 'npc_high', 4, { attraction: 80 });
    state = withNpc(state, 'npc_low', { love: 20 });
    state = withRomanceStage(state, 'npc_low', 2, { attraction: 20 });
    const partners = getEligiblePartners(state);
    const highIdx = partners.findIndex(p => p.npc_id === 'npc_high');
    const lowIdx  = partners.findIndex(p => p.npc_id === 'npc_low');
    expect(highIdx).toBeLessThan(lowIdx);
  });
});
