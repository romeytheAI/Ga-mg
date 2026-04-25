/**
 * AllureSystem — attractiveness calculations and encounter modification.
 *
 * Allure affects NPC interactions, encounter frequency, and social outcomes.
 * Computed from clothing, fame, corruption, and inherent traits.
 */
import { AllureState, ClothingLoadout, FameRecord, CorruptionState, NpcTrait } from './types';

// ── Defaults ─────────────────────────────────────────────────────────────

export function defaultAllureState(): AllureState {
  return {
    base_allure: 50,
    effective_allure: 50,
    noticeability: 30,
    intimidation: 20,
  };
}

// ── Compute Effective Allure ─────────────────────────────────────────────

export function computeAllure(
  base: number,
  clothing: ClothingLoadout,
  fame: FameRecord,
  corruption: CorruptionState,
  traits: NpcTrait[]
): AllureState {
  let allure = base;
  let noticeability = 0;
  let intimidation = 0;

  // Clothing allure contribution
  const slots: (keyof ClothingLoadout)[] = ['head','chest','legs','feet','hands','underwear'];
  for (const slot of slots) {
    const item = clothing[slot];
    if (item && item.integrity > 0) {
      allure += item.allure * 5 * (item.integrity / 100);
    }
  }

  // Exposure increases allure but also noticeability
  const totalConcealment = computeConcealment(clothing);
  if (totalConcealment < 0.3) {
    allure += (0.3 - totalConcealment) * 20;
    noticeability += (0.3 - totalConcealment) * 40;
  }

  // Fame affects noticeability
  noticeability += fame.social * 0.3 + fame.infamy * 0.4;

  // Combat fame affects intimidation
  intimidation += fame.combat_fame * 0.5;

  // Trait modifiers
  if (traits.includes('flirtatious')) { allure += 10; noticeability += 5; }
  if (traits.includes('reserved')) { allure -= 5; noticeability -= 10; }
  if (traits.includes('aggressive')) { intimidation += 15; noticeability += 5; }
  if (traits.includes('brave')) { intimidation += 5; }
  if (traits.includes('cowardly')) { intimidation -= 10; }

  // Corruption subtly increases allure (dark charisma)
  if (corruption.corruption > 30) {
    allure += (corruption.corruption - 30) * 0.1;
  }

  // Submission reduces intimidation
  if (corruption.submission > 50) {
    intimidation -= (corruption.submission - 50) * 0.2;
  }

  return {
    base_allure: base,
    effective_allure: clamp(allure, 0, 100),
    noticeability: clamp(noticeability, 0, 100),
    intimidation: clamp(intimidation, 0, 100),
  };
}

// ── Encounter Modification ───────────────────────────────────────────────

/** How much allure modifies encounter chance (0-0.3 extra danger). */
export function allureEncounterModifier(state: AllureState): number {
  const allureFactor = state.effective_allure > 60
    ? (state.effective_allure - 60) * 0.005
    : 0;
  const noticeFactor = state.noticeability * 0.002;
  return clamp(allureFactor + noticeFactor, 0, 0.3);
}

/** How much intimidation reduces encounter chance (0-0.2 danger reduction). */
export function intimidationDefense(state: AllureState): number {
  return clamp(state.intimidation * 0.002, 0, 0.2);
}

/** Social interaction bonus from allure (-10 to +20). */
export function socialAllureBonus(state: AllureState): number {
  return clamp((state.effective_allure - 50) * 0.4, -10, 20);
}

// ── Labels ───────────────────────────────────────────────────────────────

export function allureLabel(allure: number): string {
  if (allure >= 80) return 'Captivating';
  if (allure >= 60) return 'Attractive';
  if (allure >= 40) return 'Average';
  if (allure >= 20) return 'Plain';
  return 'Unremarkable';
}

export function noticeabilityLabel(noticeability: number): string {
  if (noticeability >= 80) return 'Center of Attention';
  if (noticeability >= 60) return 'Highly Visible';
  if (noticeability >= 40) return 'Noticeable';
  if (noticeability >= 20) return 'Blends In';
  return 'Invisible';
}

export function intimidationLabel(intimidation: number): string {
  if (intimidation >= 80) return 'Terrifying';
  if (intimidation >= 60) return 'Imposing';
  if (intimidation >= 40) return 'Formidable';
  if (intimidation >= 20) return 'Somewhat Threatening';
  return 'Non-threatening';
}

// ── Helpers ──────────────────────────────────────────────────────────────

function computeConcealment(clothing: ClothingLoadout): number {
  const slots: (keyof ClothingLoadout)[] = ['head','chest','legs','feet','hands','underwear'];
  let total = 0;
  for (const slot of slots) {
    const item = clothing[slot];
    if (item && item.integrity > 0) {
      total += item.concealment * (item.integrity / 100);
    }
  }
  return total / slots.length;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
