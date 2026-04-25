/**
 * skillsEngine.test.ts — unit tests for the skills engine game-layer bridge.
 * 25+ tests covering skill checks, training, decay, perks, and trainers.
 */
import { describe, it, expect } from 'vitest';
import {
  defaultSkillBag,
  getSkillLevel,
  resolveSkillCheck,
  resolveSkillTraining,
  resolveSkillDecay,
  resolveSkillUnlock,
  getUnlockablePerks,
  getAvailableTrainers,
  playerSkillBag,
  PERK_TREES,
  SkillBag,
  AllSkillKey,
} from './skillsEngine';
import { initialState } from '../../core/state/initialState';

// ── Helpers ───────────────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) // 0x100000000;
  };
}

function bagWith(skill: AllSkillKey, value: number): SkillBag {
  return { ...defaultSkillBag(), [skill]: value };
}

// ── defaultSkillBag ───────────────────────────────────────────────────────────

describe('defaultSkillBag', () => {
  it('initialises all NPC base skills at 0', () => {
    const bag = defaultSkillBag();
    expect(bag.athletics).toBe(0);
    expect(bag.swimming).toBe(0);
    expect(bag.dancing).toBe(0);
    expect(bag.skulduggery).toBe(0);
    expect(bag.seduction).toBe(0);
    expect(bag.housekeeping).toBe(0);
    expect(bag.combat).toBe(0);
  });

  it('initialises all TES extended skills at 0', () => {
    const bag = defaultSkillBag();
    expect(bag.lockpicking).toBe(0);
    expect(bag.alchemy).toBe(0);
    expect(bag.smithing).toBe(0);
    expect(bag.enchanting).toBe(0);
    expect(bag.speech).toBe(0);
    expect(bag.stealth).toBe(0);
    expect(bag.archery).toBe(0);
    expect(bag.one_handed).toBe(0);
    expect(bag.two_handed).toBe(0);
    expect(bag.block).toBe(0);
    expect(bag.heavy_armor).toBe(0);
    expect(bag.light_armor).toBe(0);
    expect(bag.restoration).toBe(0);
    expect(bag.destruction).toBe(0);
    expect(bag.conjuration).toBe(0);
    expect(bag.illusion).toBe(0);
    expect(bag.alteration).toBe(0);
  });
});

// ── getSkillLevel ──────────────────────────────────────────────────────────────

describe('getSkillLevel', () => {
  it('0 → Novice tier', () => {
    const result = getSkillLevel(defaultSkillBag(), 'combat');
    expect(result.tier).toBe('Novice');
  });

  it('25 → Apprentice tier', () => {
    const result = getSkillLevel(bagWith('combat', 25), 'combat');
    expect(result.tier).toBe('Apprentice');
  });

  it('40 → Journeyman tier', () => {
    const result = getSkillLevel(bagWith('combat', 40), 'combat');
    expect(result.tier).toBe('Journeyman');
  });

  it('60 → Expert tier', () => {
    const result = getSkillLevel(bagWith('combat', 60), 'combat');
    expect(result.tier).toBe('Expert');
  });

  it('80 → Master tier', () => {
    const result = getSkillLevel(bagWith('combat', 80), 'combat');
    expect(result.tier).toBe('Master');
  });

  it('label includes skill name and tier', () => {
    const result = getSkillLevel(bagWith('alchemy', 50), 'alchemy');
    expect(result.label).toContain('alchemy');
    expect(result.label).toContain('Journeyman');
  });

  it('progress_to_next is 0 at tier boundary', () => {
    const result = getSkillLevel(bagWith('lockpicking', 20), 'lockpicking');
    expect(result.progress_to_next).toBe(0);
  });

  it('progress_to_next is 1 at Master tier', () => {
    const result = getSkillLevel(bagWith('stealth', 90), 'stealth');
    expect(result.tier).toBe('Master');
    expect(result.progress_to_next).toBe(1);
  });
});

// ── resolveSkillCheck ──────────────────────────────────────────────────────────

describe('resolveSkillCheck', () => {
  it('always returns a valid outcome', () => {
    const bag = bagWith('combat', 50);
    const valid = ['critical_success','success','failure','critical_failure'];
    for (let i = 0; i < 20; i++) {
      const result = resolveSkillCheck(bag, 'combat', 20, seeded(i));
      expect(valid).toContain(result.outcome);
    }
  });

  it('roll is between 1 and 100', () => {
    const bag = bagWith('stealth', 40);
    const result = resolveSkillCheck(bag, 'stealth', 10, seeded(1));
    expect(result.roll).toBeGreaterThanOrEqual(1);
    expect(result.roll).toBeLessThanOrEqual(100);
  });

  it('very easy check (difficulty 0, skill 100) mostly succeeds', () => {
    const bag = bagWith('athletics', 100);
    let successes = 0;
    for (let i = 0; i < 50; i++) {
      const r = resolveSkillCheck(bag, 'athletics', 0, seeded(i));
      if (r.outcome === 'success''|| r.outcome === 'critical_success') successes++;
    }
    expect(successes).toBeGreaterThan(30);
  });

  it('impossible check (skill 0, difficulty 100) mostly fails', () => {
    const bag = defaultSkillBag();
    let failures = 0;
    for (let i = 0; i < 50; i++) {
      const r = resolveSkillCheck(bag, 'lockpicking', 100, seeded(i));
      if (r.outcome === 'failure''|| r.outcome === 'critical_failure') failures++;
    }
    expect(failures).toBeGreaterThan(30);
  });

  it('effective_skill reflects the bag value', () => {
    const bag = bagWith('alchemy', 67);
    const result = resolveSkillCheck(bag, 'alchemy', 20, seeded(1));
    expect(result.effective_skill).toBe(67);
  });

  it('returns a non-empty narrative', () => {
    const bag = bagWith('speech', 45);
    const result = resolveSkillCheck(bag, 'speech', 30, seeded(2));
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── resolveSkillTraining ──────────────────────────────────────────────────────

describe('resolveSkillTraining', () => {
  it('increases the target skill', () => {
    const bag = bagWith('alchemy', 20);
    const result = resolveSkillTraining(bag, 'alchemy','practice', 2, seeded(1));
    expect(result.new_value).toBeGreaterThan(20);
  });

  it('quest method yields more XP than practice', () => {
    const bag = bagWith('combat', 10);
    const practice = resolveSkillTraining(bag, 'combat','practice', 1, () => 0.5);
    const quest    = resolveSkillTraining(bag, 'combat','quest',    1, () => 0.5);
    expect(quest.xp_gained).toBeGreaterThan(practice.xp_gained);
  });

  it('trainer method yields more XP than practice', () => {
    const bag = bagWith('speech', 30);
    const practice = resolveSkillTraining(bag, 'speech','practice', 1, () => 0.5);
    const trainer  = resolveSkillTraining(bag, 'speech','trainer',  1, () => 0.5);
    expect(trainer.xp_gained).toBeGreaterThan(practice.xp_gained);
  });

  it('diminishing returns: lower gain at higher skill', () => {
    const low  = bagWith('stealth', 5);
    const high = bagWith('stealth', 90);
    const gainLow  = resolveSkillTraining(low,  'stealth','practice', 1, () => 0.5);
    const gainHigh = resolveSkillTraining(high, 'stealth','practice', 1, () => 0.5);
    expect(gainLow.xp_gained).toBeGreaterThan(gainHigh.xp_gained);
  });

  it('tier_up is true when crossing a tier threshold', () => {
    // Start just below Apprentice (20)
    const bag = bagWith('lockpicking', 19);
    // Need enough XP to push past 20
    const result = resolveSkillTraining(bag, 'lockpicking','quest', 5, () => 0.5);
    expect(result.tier_up).toBe(true);
    expect(result.new_tier).toBe('Apprentice');
  });

  it('tier_up is false when staying in same tier', () => {
    const bag = bagWith('alchemy', 21);
    const result = resolveSkillTraining(bag, 'alchemy','practice', 0.1, () => 0.5);
    expect(result.tier_up).toBe(false);
  });

  it('does not exceed 100', () => {
    const bag = bagWith('combat', 99.9);
    const result = resolveSkillTraining(bag, 'combat','quest', 100, () => 0.5);
    expect(result.new_value).toBeLessThanOrEqual(100);
  });

  it('works for extended TES skills', () => {
    const bag = bagWith('enchanting', 0);
    const result = resolveSkillTraining(bag, 'enchanting','book', 2, seeded(3));
    expect(result.new_value).toBeGreaterThan(0);
  });

  it('returns a non-empty narrative', () => {
    const bag = bagWith('archery', 30);
    const result = resolveSkillTraining(bag, 'archery','practice', 1, seeded(4));
    expect(result.narrative.length).toBeGreaterThan(0);
  });
});

// ── resolveSkillDecay ──────────────────────────────────────────────────────────

describe('resolveSkillDecay', () => {
  it('no decay for skills below the floor (≤20)', () => {
    const bag = bagWith('combat', 15);
    const result = resolveSkillDecay(bag, { combat: 30 });
    expect(result.skill_bag.combat).toBe(15);
    expect(result.decayed_skills).toHaveLength(0);
  });

  it('no decay within grace period (≤14 days)', () => {
    const bag = bagWith('alchemy', 50);
    const result = resolveSkillDecay(bag, { alchemy: 10 });
    expect(result.skill_bag.alchemy).toBe(50);
  });

  it('decay occurs after grace period', () => {
    const bag = bagWith('stealth', 60);
    const result = resolveSkillDecay(bag, { stealth: 30 });
    expect(result.skill_bag.stealth).toBeLessThan(60);
    expect(result.decayed_skills).toHaveLength(1);
  });

  it('skill does not decay below 20 (floor)', () => {
    const bag = bagWith('archery', 21);
    const result = resolveSkillDecay(bag, { archery: 10000 }, 1.0); // extreme decay rate
    expect(result.skill_bag.archery).toBeGreaterThanOrEqual(20);
  });

  it('narrative lists decayed skills', () => {
    const bag = bagWith('smithing', 50);
    const result = resolveSkillDecay(bag, { smithing: 60 });
    if (result.decayed_skills.length > 0) {
      expect(result.narrative).toContain('smithing');
    }
  });

  it('multiple skills can decay simultaneously', () => {
    const bag = { ...defaultSkillBag(), combat: 60, alchemy: 55 };
    const result = resolveSkillDecay(bag, { combat: 30, alchemy: 30 });
    expect(result.decayed_skills.length).toBe(2);
  });
});

// ── resolveSkillUnlock ────────────────────────────────────────────────────────

describe('resolveSkillUnlock', () => {
  it('unlocks a perk when skill level is met', () => {
    const bag = bagWith('combat', 25);
    const result = resolveSkillUnlock(bag, 'combat','perk_combat_25');
    expect(result.unlocked).toBe(true);
    expect(result.perk).not.toBeNull();
  });

  it('does not unlock when skill is below threshold', () => {
    const bag = bagWith('combat', 24);
    const result = resolveSkillUnlock(bag, 'combat','perk_combat_25');
    expect(result.unlocked).toBe(false);
  });

  it('returns an explanatory narrative on failure', () => {
    const bag = bagWith('alchemy', 10);
    const result = resolveSkillUnlock(bag, 'alchemy','perk_alchemy_50');
    expect(result.narrative).toContain('50');
  });

  it('returns an unlocked narrative on success', () => {
    const bag = bagWith('lockpicking', 75);
    const result = resolveSkillUnlock(bag, 'lockpicking','perk_lockpicking_75');
    expect(result.narrative).toContain('unlocked');
  });

  it('returns unlocked=false for unknown perk ID', () => {
    const bag = bagWith('stealth', 100);
    const result = resolveSkillUnlock(bag, 'stealth','perk_doesnt_exist');
    expect(result.unlocked).toBe(false);
  });
});

// ── getUnlockablePerks ────────────────────────────────────────────────────────

describe('getUnlockablePerks', () => {
  it('returns no perks at level 0', () => {
    const bag = defaultSkillBag();
    expect(getUnlockablePerks(bag, 'destruction')).toHaveLength(0);
  });

  it('returns 1 perk at level 25', () => {
    const bag = bagWith('destruction', 25);
    expect(getUnlockablePerks(bag, 'destruction')).toHaveLength(1);
  });

  it('returns 2 perks at level 50', () => {
    const bag = bagWith('destruction', 50);
    expect(getUnlockablePerks(bag, 'destruction')).toHaveLength(2);
  });

  it('returns 3 perks at level 75+', () => {
    const bag = bagWith('illusion', 75);
    expect(getUnlockablePerks(bag, 'illusion')).toHaveLength(3);
  });
});

// ── PERK_TREES ─────────────────────────────────────────────────────────────────

describe('PERK_TREES', () => {
  it('every skill has exactly 3 perks', () => {
    const skills = Object.keys(defaultSkillBag()) as AllSkillKey[];
    for (const skill of skills) {
      expect(PERK_TREES[skill]).toHaveLength(3);
    }
  });

  it('perk levels are 25, 50, 75 in order', () => {
    const skills = Object.keys(defaultSkillBag()) as AllSkillKey[];
    for (const skill of skills) {
      const perks = PERK_TREES[skill];
      expect(perks[0].level_required).toBe(25);
      expect(perks[1].level_required).toBe(50);
      expect(perks[2].level_required).toBe(75);
    }
  });

  it('each perk has a non-empty name and description', () => {
    const skills = Object.keys(defaultSkillBag()) as AllSkillKey[];
    for (const skill of skills) {
      for (const perk of PERK_TREES[skill]) {
        expect(perk.name.length).toBeGreaterThan(0);
        expect(perk.description.length).toBeGreaterThan(0);
      }
    }
  });
});

// ── getAvailableTrainers ──────────────────────────────────────────────────────

describe('getAvailableTrainers', () => {
  it('returns empty array when sim_world is null', () => {
    const state = { ...initialState, sim_world: null };
    const result = getAvailableTrainers(state, 'combat');
    expect(result).toHaveLength(0);
  });

  it('returns TrainerInfo with expected shape when trainers exist', () => {
    const result = getAvailableTrainers(initialState, 'combat');
    // Guards should be able to train combat; check if any are at the location
    for (const trainer of result) {
      expect(trainer).toHaveProperty('npc_id');
      expect(trainer).toHaveProperty('npc_name');
      expect(trainer).toHaveProperty('skill','combat');
      expect(trainer).toHaveProperty('max_level');
      expect(trainer).toHaveProperty('cost_per_session');
      expect(trainer.cost_per_session).toBeGreaterThan(0);
    }
  });
});

// ── playerSkillBag ────────────────────────────────────────────────────────────

describe('playerSkillBag', () => {
  it('maps player skills from GameState', () => {
    const bag = playerSkillBag(initialState);
    expect(bag.skulduggery).toBe(initialState.player.skills.skulduggery);
    expect(bag.athletics).toBe(initialState.player.skills.athletics);
    expect(bag.housekeeping).toBe(initialState.player.skills.housekeeping);
  });

  it('extended skills default to 0', () => {
    const bag = playerSkillBag(initialState);
    expect(bag.lockpicking).toBe(0);
    expect(bag.enchanting).toBe(0);
    expect(bag.destruction).toBe(0);
  });
});
