/**
 * AddictionSystem — substance dependency, tolerance, and withdrawal.
 *
 * Substances provide short-term benefits but create long-term dependency.
 * Withdrawal causes stress, stamina drain, and decision-making impairment.
 */
import { AddictionState, AddictionEntry, SubstanceType } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultAddictionState(): AddictionState {
  return {
    addictions: [],
    overall_dependency: 0,
  };
}

function defaultAddictionEntry(substance: SubstanceType, turn: number): AddictionEntry {
  return {
    substance,
    dependency: 0,
    tolerance: 0,
    withdrawal: 0,
    last_use_turn: turn,
    total_uses: 0,
  };
}

// ── Substance Effects ────────────────────────────────────────────────────

const SUBSTANCE_EFFECTS: Record<SubstanceType, { stress_relief: number; energy_boost: number; corruption_risk: number; dependency_rate: number }> = {
  alcohol:           { stress_relief: 15, energy_boost: -5,  corruption_risk: 2,  dependency_rate: 3  },
  moonsugar:         { stress_relief: 25, energy_boost: 10,  corruption_risk: 5,  dependency_rate: 6  },
  skooma:            { stress_relief: 35, energy_boost: 20,  corruption_risk: 10, dependency_rate: 10 },
  bloodwine:         { stress_relief: 20, energy_boost: 5,   corruption_risk: 8,  dependency_rate: 5  },
  sleeping_tree_sap: { stress_relief: 30, energy_boost: -10, corruption_risk: 3,  dependency_rate: 4  },
  void_salts:        { stress_relief: 40, energy_boost: 15,  corruption_risk: 20, dependency_rate: 15 },
};

// ── Use Substance ────────────────────────────────────────────────────────

export function useSubstance(
  state: AddictionState,
  substance: SubstanceType,
  turn: number
): { addiction_state: AddictionState; stress_relief: number; energy_boost: number; corruption_risk: number } {
  const effects = SUBSTANCE_EFFECTS[substance];
  let entry = state.addictions.find(a => a.substance === substance);
  if (!entry) {
    entry = defaultAddictionEntry(substance, turn);
  }

  // Tolerance reduces effectiveness
  const toleranceFactor = 1 - entry.tolerance / 150; // at 100 tolerance, only 33% effective
  const actualStressRelief = effects.stress_relief * Math.max(0.1, toleranceFactor);
  const actualEnergyBoost = effects.energy_boost * Math.max(0.1, toleranceFactor);

  const updated: AddictionEntry = {
    ...entry,
    dependency: clamp(entry.dependency + effects.dependency_rate, 0, 100),
    tolerance: clamp(entry.tolerance + 2, 0, 100),
    withdrawal: 0, / using resets withdrawal
    last_use_turn: turn,
    total_uses: entry.total_uses + 1,
  };

  const addictions = state.addictions.some(a => a.substance === substance)
    ? state.addictions.map(a => a.substance === substance ? updated : a)
    : [...state.addictions, updated];

  return {
    addiction_state: {
      addictions,
      overall_dependency: computeOverallDependency(addictions),
    },
    stress_relief: actualStressRelief,
    energy_boost: actualEnergyBoost,
    corruption_risk: effects.corruption_risk,
  };
}

// ── Tick (Withdrawal & Recovery) ─────────────────────────────────────────

export function tickAddiction(state: AddictionState, currentTurn: number, hours: number): AddictionState {
  const addictions = state.addictions.map(entry => {
    const turnsSinceUse = currentTurn - entry.last_use_turn;
    const withdrawalOnset = 24; // withdrawal starts after 24 turns (hours)

    let withdrawal = entry.withdrawal;
    let dependency = entry.dependency;
    let tolerance = entry.tolerance;

    if (turnsSinceUse > withdrawalOnset && dependency > 10) {
      // Withdrawal increases based on dependency
      withdrawal = clamp(withdrawal + (dependency / 100) * 2 * hours, 0, 100);
    }

    // Passive recovery (very slow)
    if (turnsSinceUse > withdrawalOnset * 3) {
      dependency = clamp(dependency - 0.1 * hours, 0, 100);
      tolerance = clamp(tolerance - 0.05 * hours, 0, 100);
    }

    // Withdrawal decreases as dependency drops
    if (dependency < 5) {
      withdrawal = clamp(withdrawal - 1 * hours, 0, 100);
    }

    return { ...entry, withdrawal, dependency, tolerance };
  }).filter(e => e.dependency > 0.5 || e.withdrawal > 0.5); // prune clean entries

  return {
    addictions,
    overall_dependency: computeOverallDependency(addictions),
  };
}

// ── Withdrawal Effects ───────────────────────────────────────────────────

export function withdrawalStress(state: AddictionState): number {
  let total = 0;
  for (const entry of state.addictions) {
    total += entry.withdrawal * 0.3; // 30% of withdrawal becomes stress
  }
  return clamp(total, 0, 50); // cap at 50 stress
}

export function withdrawalStaminaDrain(state: AddictionState): number {
  let total = 0;
  for (const entry of state.addictions) {
    total += entry.withdrawal * 0.1;
  }
  return clamp(total, 0, 20);
}

// ── Labels ───────────────────────────────────────────────────────────────

export function dependencyLabel(dependency: number): string {
  if (dependency >= 80) return 'Crippling';
  if (dependency >= 60) return 'Severe';
  if (dependency >= 40) return 'Moderate';
  if (dependency >= 20) return 'Mild';
  if (dependency > 0) return 'Slight';
  return 'Clean';
}

export function withdrawalLabel(withdrawal: number): string {
  if (withdrawal >= 80) return 'Agonizing';
  if (withdrawal >= 60) return 'Severe';
  if (withdrawal >= 40) return 'Painful';
  if (withdrawal >= 20) return 'Uncomfortable';
  if (withdrawal > 0) return 'Mild';
  return 'None';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function computeOverallDependency(addictions: AddictionEntry[]): number {
  if (addictions.length === 0) return 0;
  const total = addictions.reduce((sum, a) => sum + a.dependency, 0);
  return clamp(total / addictions.length, 0, 100);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
