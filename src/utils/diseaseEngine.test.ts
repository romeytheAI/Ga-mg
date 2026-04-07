import { describe, it, expect } from 'vitest';
import {
  defaultPlayerDiseaseState,
  resolveContractDisease,
  resolveTreatDisease,
  tickPlayerDiseases,
  getDiseaseEffects,
  diseaseSummary,
  diseaseSeverityLabel,
  overallHealthLabel,
} from './diseaseEngine';
import { initialState } from '../state/initialState';
import { DiseaseType, PlayerDiseaseState } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function withDisease(disease: DiseaseType, severity: number): PlayerDiseaseState {
  return {
    active_diseases: [{ disease, severity, duration_turns: 0, treated: false, immunity: 0 }],
    immunities: {},
    overall_health_penalty: severity * 0.3,
  };
}

function guaranteeRng() { return 0.0; }   // always passes immunity check
function immuneRng()    { return 1.0; }   // always triggers immunity block

// ── defaultPlayerDiseaseState ─────────────────────────────────────────────────

describe('defaultPlayerDiseaseState', () => {
  it('starts healthy', () => {
    const s = defaultPlayerDiseaseState();
    expect(s.active_diseases).toHaveLength(0);
    expect(s.overall_health_penalty).toBe(0);
  });
});

// ── resolveContractDisease ────────────────────────────────────────────────────

describe('resolveContractDisease', () => {
  it('contracts plague when rng passes immunity check', () => {
    const result = resolveContractDisease(initialState, 'plague', 1, guaranteeRng);
    expect(result.contracted).toBe(true);
    expect(result.disease_state.active_diseases).toHaveLength(1);
    expect(result.disease_state.active_diseases[0].disease).toBe('plague');
  });

  it('does not contract when fully immune', () => {
    const immuneState = {
      ...initialState,
      player: {
        ...initialState.player,
        disease_state: {
          active_diseases: [],
          immunities: { plague: 100 },
          overall_health_penalty: 0,
        },
      },
    };
    // rng=0.0 → Math.random()*100 = 0 < 100 → immune check fires
    const result = resolveContractDisease(immuneState, 'plague', 1, () => 0.0);
    expect(result.contracted).toBe(false);
  });

  it('does not double-infect an already active disease', () => {
    const sick = {
      ...initialState,
      player: { ...initialState.player, disease_state: withDisease('chill_pox', 30) },
    };
    const result = resolveContractDisease(sick, 'chill_pox', 10, guaranteeRng);
    expect(result.disease_state.active_diseases).toHaveLength(1);
  });

  it('returns a non-empty contract narrative', () => {
    const result = resolveContractDisease(initialState, 'rot', 1, guaranteeRng);
    expect(result.narrative.length).toBeGreaterThan(10);
  });

  it('returns immune narrative when not contracted', () => {
    // Fully immune state (immunities: plague=100) + rng=0.0 → blocked
    const immuneState = {
      ...initialState,
      player: {
        ...initialState.player,
        disease_state: {
          active_diseases: [],
          immunities: { plague: 100 as number },
          overall_health_penalty: 0,
        },
      },
    };
    const result = resolveContractDisease(immuneState, 'plague', 1, () => 0.0);
    expect(result.contracted).toBe(false);
    expect(result.narrative.length).toBeGreaterThan(5);
  });
});

// ── resolveTreatDisease ───────────────────────────────────────────────────────

describe('resolveTreatDisease', () => {
  it('marks a disease as treated', () => {
    const sick = {
      ...initialState,
      player: { ...initialState.player, disease_state: withDisease('rot', 40) },
    };
    const treated = resolveTreatDisease(sick, 'rot');
    expect(treated.active_diseases[0].treated).toBe(true);
  });

  it('is a no-op for a disease the player does not have', () => {
    const result = resolveTreatDisease(initialState, 'mind_fever');
    expect(result.active_diseases).toHaveLength(0);
  });
});

// ── tickPlayerDiseases ────────────────────────────────────────────────────────

describe('tickPlayerDiseases', () => {
  it('progresses untreated disease severity over time', () => {
    const state = withDisease('plague', 10);
    const after = tickPlayerDiseases(state, 24);
    const plague = after.active_diseases.find(d => d.disease === 'plague');
    expect(plague!.severity).toBeGreaterThan(10);
  });

  it('reduces treated disease severity over time', () => {
    const state: PlayerDiseaseState = {
      active_diseases: [{ disease: 'chill_pox', severity: 50, duration_turns: 0, treated: true, immunity: 0 }],
      immunities: {},
      overall_health_penalty: 15,
    };
    const after = tickPlayerDiseases(state, 24);
    const pox = after.active_diseases.find(d => d.disease === 'chill_pox');
    if (pox) {
      expect(pox.severity).toBeLessThan(50);
    } else {
      // Fully cured and removed is also valid
      expect(after.active_diseases).toHaveLength(0);
    }
  });

  it('grants immunity after recovery', () => {
    // Start with very low severity treated disease — one tick should cure it
    const state: PlayerDiseaseState = {
      active_diseases: [{ disease: 'chill_pox', severity: 1, duration_turns: 0, treated: true, immunity: 0 }],
      immunities: {},
      overall_health_penalty: 0,
    };
    const after = tickPlayerDiseases(state, 24);
    expect(after.active_diseases).toHaveLength(0);
    expect((after.immunities.chill_pox ?? 0)).toBeGreaterThan(0);
  });

  it('no-op for clean state', () => {
    const after = tickPlayerDiseases(defaultPlayerDiseaseState(), 24);
    expect(after.active_diseases).toHaveLength(0);
  });
});

// ── getDiseaseEffects ─────────────────────────────────────────────────────────

describe('getDiseaseEffects', () => {
  it('returns zero effects when healthy', () => {
    const effects = getDiseaseEffects(defaultPlayerDiseaseState());
    expect(effects.health_per_hour).toBe(0);
    expect(effects.stamina_per_hour).toBe(0);
    expect(effects.is_sick).toBe(false);
  });

  it('returns positive drain when sick', () => {
    const effects = getDiseaseEffects(withDisease('plague', 80));
    expect(effects.health_per_hour).toBeGreaterThan(0);
    expect(effects.is_sick).toBe(true);
  });
});

// ── diseaseSummary ────────────────────────────────────────────────────────────

describe('diseaseSummary', () => {
  it('healthy summary', () => {
    const summary = diseaseSummary(defaultPlayerDiseaseState());
    expect(summary.is_sick).toBe(false);
    expect(summary.active_count).toBe(0);
    expect(summary.overall_label).toBe('Healthy');
  });

  it('sick summary lists disease', () => {
    const summary = diseaseSummary(withDisease('rot', 50));
    expect(summary.is_sick).toBe(true);
    expect(summary.active_count).toBe(1);
    expect(summary.entries[0].disease).toBe('rot');
    expect(summary.entries[0].severity_label.length).toBeGreaterThan(0);
  });
});

// ── Labels ────────────────────────────────────────────────────────────────────

describe('diseaseSeverityLabel', () => {
  it('returns Critical at >= 80', () => expect(diseaseSeverityLabel(85)).toBe('Critical'));
  it('returns Healthy at 0', () => expect(diseaseSeverityLabel(0)).toBe('Healthy'));
});

describe('overallHealthLabel', () => {
  it('returns Gravely Ill at >= 50', () => expect(overallHealthLabel(55)).toBe('Gravely Ill'));
  it('returns Healthy at 0', () => expect(overallHealthLabel(0)).toBe('Healthy'));
});
