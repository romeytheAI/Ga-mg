/**
 * allureEngine.ts — game-layer bridge for the player allure / presence system.
 *
 * Bridges AllureSystem (pure sim) into GameState. Allure affects encounter
 * chance, social bonuses, and NPC reactions. Recomputed when clothing,
 * fame, or corruption changes.
 *
 * @see src/sim/AllureSystem.ts — underlying allure computation engine
 * @see src/reducers/gameReducer.ts — ADVANCE_TIME recomputes allure each tick
 */

import { GameState, PlayerAllureState, PlayerFameRecord } from '../../core/types';
import {
  computeAllure,
  allureEncounterModifier,
  intimidationDefense,
  socialAllureBonus,
  allureLabel,
  noticeabilityLabel,
  intimidationLabel,
} from '../sim/AllureSystem';
import { AllureState, ClothingLoadout, FameRecord, CorruptionState } from '../../features/simulation/systems/types';

// ── Adapters ─────────────────────────────────────────────────────────────────

function toSimFameRecord(fame: PlayerFameRecord): FameRecord {
  return { ...fame };
}

function toSimCorruptionState(state: GameState): CorruptionState {
  const stats = state.player.stats;
  return {
    corruption: stats.corruption,
    purity:     stats.purity,
    willpower:  stats.willpower,
    stress:     stats.stress,
    trauma:     stats.trauma,
    control:    stats.control,
    submission: state.player.psych_profile.submission_index,
  };
}

function toSimClothing(state: GameState): ClothingLoadout {
  const c = state.player.clothing;
  const clothingSlots = state.player.clothing_state?.slots as Record<string, any> | undefined;
  // Map game ClothingLayer to sim ClothingLoadout using clothing_state coverage
  const mapSlot = (item: any, stateSlotKey: string) => {
    if (!item) return undefined;
    const slotState = clothingSlots?.[stateSlotKey];
    return {
      name: item.name ?? ',
      slot: item.slot ?? ',
      integrity: item.integrity ?? 100,
      allure: item.allure ?? 0,
      concealment: slotState?.coverage ?? 0.5,
      warmth: item.warmth ?? 0,
    };
  };
  return {
    head:      mapSlot(c.head, 'head'),
    chest:     mapSlot(c.chest ?? (c as any).top, 'chest'),
    legs:      mapSlot(c.legs ?? (c as any).bottoms, 'legs'),
    feet:      mapSlot(c.feet ?? (c as any).shoes, 'feet'),
    hands:     mapSlot(c.hands ?? (c as any).gloves, 'hands'),
    underwear: mapSlot(c.underwear, 'underwear'),
  } as ClothingLoadout;
}

function fromSimAllureState(sim: AllureState): PlayerAllureState {
  return {
    base_allure:       clamp(sim.base_allure, 0, 100),
    effective_allure:  clamp(sim.effective_allure, 0, 100),
    noticeability:     clamp(sim.noticeability, 0, 100),
    intimidation:      clamp(sim.intimidation, 0, 100),
  };
}

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Recompute the player's allure state from current clothing, fame, and corruption.
 * Called whenever any of those change (on ADVANCE_TIME, equip/unequip, etc.).
 */
export function computePlayerAllure(state: GameState): PlayerAllureState {
  const baseAllure = state.player.stats.allure;
  const simClothing = toSimClothing(state);
  const simFame = toSimFameRecord(state.player.fame_record);
  const simCorruption = toSimCorruptionState(state);

  // Map player Trait array to NpcTrait names for AllureSystem
  const traitNames = state.player.traits.map(t => t.id) as any[];

  const simResult = computeAllure(baseAllure, simClothing, simFame, simCorruption, traitNames);
  return fromSimAllureState(simResult);
}

/**
 * Net encounter chance modifier from allure and intimidation.
 * Positive = more encounters (allure), negative = fewer (intimidation).
 * Range: approximately -0.2 to +0.3.
 */
export function getEncounterModifier(state: GameState): number {
  const sim = state.player.allure_state as AllureState;
  return allureEncounterModifier(sim) - intimidationDefense(sim);
}

/** Social interaction bonus from allure (-10 to +20). */
export function getSocialAllureBonus(state: GameState): number {
  return socialAllureBonus(state.player.allure_state as AllureState);
}

// ── Summary / UI helpers ─────────────────────────────────────────────────────

export interface AllureSummary {
  base_allure: number;
  effective_allure: number;
  noticeability: number;
  intimidation: number;
  allure_label: string;
  noticeability_label: string;
  intimidation_label: string;
  encounter_modifier: number;
  social_bonus: number;
}

/** Structured summary for StatsModal display. */
export function allureSummary(state: GameState): AllureSummary {
  const a = state.player.allure_state;
  return {
    base_allure:          a.base_allure,
    effective_allure:     a.effective_allure,
    noticeability:        a.noticeability,
    intimidation:         a.intimidation,
    allure_label:         allureLabel(a.effective_allure),
    noticeability_label:  noticeabilityLabel(a.noticeability),
    intimidation_label:   intimidationLabel(a.intimidation),
    encounter_modifier:   getEncounterModifier(state),
    social_bonus:         getSocialAllureBonus(state),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
