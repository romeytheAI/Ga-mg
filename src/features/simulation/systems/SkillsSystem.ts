/**
 * SkillsSystem — DoL-style skill progression through practice.
 * Skills improve when NPCs perform relevant activities.
 * Pure functions; no side effects, no UI imports.
 */
import { NpcSkills, SkillKey, SimNpc, NpcState, NpcTrait } from './types';

// ── Skill gain rates per hour of practice ──────────────────────────────────
const SKILL_GAIN_PER_HOUR: Record<SkillKey, number> = {
  athletics: 0.6,
  swimming: 0.5,
  dancing: 0.4,
  skulduggery: 0.3,
  seduction: 0.35,
  housekeeping: 0.5,
  combat: 0.4,
};

// ── Activity-to-skill mapping ──────────────────────────────────────────────
const ACTIVITY_SKILL_MAP: Partial<Record<NpcState, SkillKey[]>> = {
  working: ['housekeeping'],
  exercising: ['athletics'],
  socializing: ['seduction'],
  trading: ['skulduggery'],
  fleeing: ['athletics'],
  hostile: ['combat'],
};

// ── Job-to-skill mapping (passive skill gain from job) ─────────────────────
const JOB_SKILL_MAP: Record<string, SkillKey[]> = {
  guard: ['combat','athletics'],
  thief: ['skulduggery','athletics'],
  innkeeper: ['housekeeping','seduction'],
  merchant: ['seduction'],
  healer: ['housekeeping'],
  farmer: ['athletics','housekeeping'],
  laborer: ['athletics'],
  scholar: ['housekeeping'],
  none: [],
};

// ── Trait modifiers for skill gain ─────────────────────────────────────────
const TRAIT_SKILL_MODIFIERS: Partial<Record<NpcTrait, Partial<Record<SkillKey, number>>>> = {
  brave: { combat: 1.3 },
  cowardly: { skulduggery: 1.2, combat: 0.7 },
  aggressive: { combat: 1.4, seduction: 0.8 },
  flirtatious: { seduction: 1.5, dancing: 1.2 },
  reserved: { seduction: 0.5, housekeeping: 1.2 },
  curious: { skulduggery: 1.3 },
  greedy: { skulduggery: 1.2 },
};

/** Create a default skill set for a new NPC. */
export function defaultSkills(): NpcSkills {
  return {
    athletics: 0,
    swimming: 0,
    dancing: 0,
    skulduggery: 0,
    seduction: 0,
    housekeeping: 0,
    combat: 0,
  };
}

/** Improve a single skill by a given amount (clamped 0-100). */
export function improveSkill(skills: NpcSkills, skill: SkillKey, amount: number): NpcSkills {
  return {
    ...skills,
    [skill]: Math.min(100, Math.max(0, skills[skill] + amount)),
  };
}

/**
 * Calculate skill gain for an NPC based on their current activity.
 * Returns updated skills. Gain is modified by traits and diminishing returns.
 */
export function trainSkillsFromActivity(
  npc: SimNpc,
  activity: NpcState,
  hours: number
): NpcSkills {
  let skills = { ...npc.skills };

  // Activity-based training
  const trainedSkills = ACTIVITY_SKILL_MAP[activity] ?? [];
  for (const skill of trainedSkills) {
    const gain = calculateGain(skill, skills[skill], npc.traits, hours);
    skills = improveSkill(skills, skill, gain);
  }

  // Job-based passive training (when working)
  if (activity === 'working') {
    const jobSkills = JOB_SKILL_MAP[npc.job] ?? [];
    for (const skill of jobSkills) {
      if (!trainedSkills.includes(skill)) {
        const gain = calculateGain(skill, skills[skill], npc.traits, hours) * 0.5;
        skills = improveSkill(skills, skill, gain);
      }
    }
  }

  return skills;
}

/**
 * Calculate actual skill gain with diminishing returns and trait modifiers.
 * Higher existing skill = slower gains (logarithmic decay).
 */
function calculateGain(
  skill: SkillKey,
  currentLevel: number,
  traits: NpcTrait[],
  hours: number
): number {
  const baseGain = SKILL_GAIN_PER_HOUR[skill] * hours;

  // Diminishing returns: gain decreases as skill increases
  const diminishingFactor = 1 - (currentLevel / 120); // at 100, factor = ~0.17

  // Trait modifiers
  let traitMultiplier = 1;
  for (const trait of traits) {
    const mod = TRAIT_SKILL_MODIFIERS[trait];
    if (mod && mod[skill] !== undefined) {
      traitMultiplier *= mod[skill]!;
    }
  }

  return Math.max(0, baseGain * diminishingFactor * traitMultiplier);
}

/** Get a human-readable skill level label. */
export function skillLevelLabel(value: number): string {
  if (value >= 90) return 'Master';
  if (value >= 70) return 'Expert';
  if (value >= 50) return 'Skilled';
  if (value >= 30) return 'Practiced';
  if (value >= 10) return 'Novice';
  return 'Untrained';
}

/** Check if an NPC passes a skill check (d100 roll under skill + difficulty). */
export function skillCheck(skillValue: number, difficulty: number): boolean {
  const roll = Math.random() * 100;
  return roll < (skillValue - difficulty);
}

/** Get the total "competence" rating for an NPC (average of all skills). */
export function overallCompetence(skills: NpcSkills): number {
  const values = Object.values(skills);
  return values.reduce((sum, v) => sum + v, 0) // values.length;
}
