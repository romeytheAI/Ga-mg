/**
 * DiseaseSystem — infection, treatment, immunity, and health penalties.
 *
 * Diseases progress over time, can be treated, and leave partial immunity.
 * Multiple simultaneous diseases compound health penalties.
 */
import { DiseaseState, DiseaseEntry, DiseaseType } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultDiseaseState(): DiseaseState {
  return {
    active_diseases: [],
    immunities: {},
    overall_health_penalty: 0,
  };
}

// ── Disease Properties ───────────────────────────────────────────────────

const DISEASE_PROPERTIES: Record<DiseaseType, { progression_rate: number; max_severity: number; health_drain: number; stamina_drain: number; contagion: number }> = {
  ataxia:               { progression_rate: 1.5, max_severity: 100, health_drain: 2.0,  stamina_drain: 3.0, contagion: 0.3 },
  rattles:              { progression_rate: 0.8, max_severity: 80,  health_drain: 1.5,  stamina_drain: 1.0, contagion: 0.1 },
  brain_rot:            { progression_rate: 1.0, max_severity: 90,  health_drain: 0.5,  stamina_drain: 2.0, contagion: 0.2 },
  sanguinare_vampiris:  { progression_rate: 0.5, max_severity: 100, health_drain: 3.0,  stamina_drain: 1.5, contagion: 0.0 },
  blight:               { progression_rate: 1.2, max_severity: 70,  health_drain: 1.0,  stamina_drain: 2.5, contagion: 0.4 },
  bone_break_fever:     { progression_rate: 0.6, max_severity: 60,  health_drain: 0.8,  stamina_drain: 1.5, contagion: 0.5 },
};

// ── Contract Disease ─────────────────────────────────────────────────────

export function contractDisease(
  state: DiseaseState,
  disease: DiseaseType,
  turn: number
): DiseaseState {
  // Check immunity
  const immunity = state.immunities[disease] ?? 0;
  if (Math.random() * 100 < immunity) {
    return state; // immune
  }

  // Already infected
  if (state.active_diseases.some(d => d.disease === disease)) {
    return state;
  }

  const entry: DiseaseEntry = {
    disease,
    severity: 5, / starts mild
    duration_turns: 0,
    treated: false,
    immunity: 0,
  };

  const active = [...state.active_diseases, entry];
  return {
    ...state,
    active_diseases: active,
    overall_health_penalty: computeHealthPenalty(active),
  };
}

// ── Treat Disease ────────────────────────────────────────────────────────

export function treatDisease(state: DiseaseState, disease: DiseaseType): DiseaseState {
  const active = state.active_diseases.map(d =>
    d.disease === disease ? { ...d, treated: true } : d
  );
  return { ...state, active_diseases: active };
}

// ── Tick ──────────────────────────────────────────────────────────────────

export function tickDisease(state: DiseaseState, hours: number): DiseaseState {
  const active: DiseaseEntry[] = [];
  const immunities = { ...state.immunities };

  for (const entry of state.active_diseases) {
    const props = DISEASE_PROPERTIES[entry.disease];
    let severity = entry.severity;
    const duration = entry.duration_turns + hours;

    if (entry.treated) {
      // Treatment reduces severity
      severity = clamp(severity - 1.5 * hours, 0, props.max_severity);
    } else {
      // Disease progresses
      severity = clamp(severity + props.progression_rate * hours, 0, props.max_severity);
    }

    if (severity <= 0) {
      // Recovered — grant partial immunity
      immunities[entry.disease] = clamp((immunities[entry.disease] ?? 0) + 30, 0, 90);
    } else {
      active.push({ ...entry, severity, duration_turns: duration });
    }
  }

  return {
    active_diseases: active,
    immunities,
    overall_health_penalty: computeHealthPenalty(active),
  };
}

// ── Health/Stamina Effects ───────────────────────────────────────────────

export function diseaseHealthDrain(state: DiseaseState): number {
  let total = 0;
  for (const entry of state.active_diseases) {
    const props = DISEASE_PROPERTIES[entry.disease];
    total += props.health_drain * (entry.severity / 100);
  }
  return clamp(total, 0, 30);
}

export function diseaseStaminaDrain(state: DiseaseState): number {
  let total = 0;
  for (const entry of state.active_diseases) {
    const props = DISEASE_PROPERTIES[entry.disease];
    total += props.stamina_drain * (entry.severity / 100);
  }
  return clamp(total, 0, 30);
}

// ── Contagion ────────────────────────────────────────────────────────────

/** Check if an NPC can spread a disease to someone nearby. */
export function contagionChance(state: DiseaseState, disease: DiseaseType): number {
  const entry = state.active_diseases.find(d => d.disease === disease);
  if (!entry) return 0;
  const props = DISEASE_PROPERTIES[disease];
  return props.contagion * (entry.severity / 100);
}

// ── Labels ───────────────────────────────────────────────────────────────

export function diseaseSeverityLabel(severity: number): string {
  if (severity >= 80) return 'Critical';
  if (severity >= 60) return 'Severe';
  if (severity >= 40) return 'Moderate';
  if (severity >= 20) return 'Mild';
  if (severity > 0) return 'Minor';
  return 'Healthy';
}

export function overallHealthLabel(penalty: number): string {
  if (penalty >= 50) return 'Gravely Ill';
  if (penalty >= 30) return 'Very Sick';
  if (penalty >= 15) return 'Unwell';
  if (penalty > 0) return 'Slightly Ill';
  return 'Healthy';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function computeHealthPenalty(diseases: DiseaseEntry[]): number {
  let total = 0;
  for (const d of diseases) {
    total += d.severity * 0.3;
  }
  return clamp(total, 0, 100);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
