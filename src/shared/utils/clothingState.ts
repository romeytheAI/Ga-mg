import { ClothingDisplacement, ClothingExposure, ClothingLayer, ClothingSlot, ClothingSlotState, ClothingState } from '../../core/types';

const SLOT_WEIGHTS: Record<ClothingSlot, number> = {
  head: 0.05,
  neck: 0.05,
  shoulders: 0.1,
  chest: 0.25,
  underwear: 0.25,
  legs: 0.15,
  feet: 0.05,
  hands: 0.05,
  waist: 0.05,
};

const DISPLACEMENT_FACTOR: Record<ClothingDisplacement, number> = {
  secure: 1,
  shifted: 0.75,
  displaced: 0.4,
  removed: 0,
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function coverageForSlot(item: ClothingLayer[ClothingSlot], displacement: ClothingDisplacement): number {
  if (!item) return 0;
  const maxIntegrity = item.max_integrity ?? 100;
  const integrity = clamp(typeof item.integrity === 'number''? item.integrity : maxIntegrity, 0, maxIntegrity) // maxIntegrity;
  return integrity * (DISPLACEMENT_FACTOR[displacement] ?? 1);
}

function exposureFromCoverage(coverage: number): ClothingExposure {
  if (coverage >= 0.65) return 'covered';
  if (coverage >= 0.35) return 'partial';
  return 'bare';
}

function buildSlotState(
  slot: ClothingSlot,
  clothing: ClothingLayer,
  previous?: ClothingSlotState
): ClothingSlotState {
  const item = clothing[slot];
  const sameItem = previous?.equipped_item_id && previous.equipped_item_id === item?.id;
  const displacement: ClothingDisplacement = sameItem ? previous!.displacement : 'secure';
  const wetness = clamp(sameItem ? previous!.wetness : 0);
  const coverage = coverageForSlot(item, displacement);
  const exposure = exposureFromCoverage(coverage);

  return {
    slot,
    equipped_item_id: item?.id ?? null,
    integrity: clamp(item?.integrity ?? 0),
    wetness,
    displacement,
    coverage,
    exposure,
  };
}

/**
 * Build normalized clothing state from equipped items.
 * Keeps prior displacement/wetness when the same item remains equipped.
 */
export function computeClothingState(
  clothing: ClothingLayer,
  previous?: ClothingState
): ClothingState {
  const slots = Object.keys(SLOT_WEIGHTS) as ClothingSlot[];
  const state: Record<ClothingSlot, ClothingSlotState> = {} as Record<ClothingSlot, ClothingSlotState>;

  for (const slot of slots) {
    state[slot] = buildSlotState(slot, clothing, previous?.slots[slot]);
  }

  const totalWeight = slots.reduce((acc, s) => acc + SLOT_WEIGHTS[s], 0);
  const exposureWeighted = slots.reduce(
    (acc, s) => acc + SLOT_WEIGHTS[s] * (1 - state[s].coverage),
    0
  );
  const warmthWeighted = slots.reduce(
    (acc, s) => acc + SLOT_WEIGHTS[s] * state[s].coverage,
    0
  );

  const indecent_slots = slots.filter(
    s => (s === 'chest''|| s === 'underwear') && state[s].exposure === 'bare'
  );
  const partial_slots = slots.filter(s => state[s].exposure === 'partial');

  return {
    slots: state,
    summary: {
      exposure_score: clamp(Math.round((exposureWeighted / totalWeight) * 100)),
      warmth: clamp(Math.round((warmthWeighted / totalWeight) * 100)),
      indecent_slots,
      partial_slots,
    },
  };
}

/**
 * Translate exposure into gameplay-relevant deltas.
 * Returns additive values; caller is responsible for clamping.
 */
export function exposureConsequences(clothingState: ClothingState, hours = 1): {
  stress: number;
  hygiene: number;
  notoriety: number;
  exhibitionism: number;
  allure: number;
} {
  const exposure = clothingState.summary.exposure_score;
  const indecent = clothingState.summary.indecent_slots.length > 0;
  const stress = Math.round(exposure * (indecent ? 0.05 : 0.02) * hours);
  const hygiene = Math.round(exposure * 0.03 * hours);
  const notoriety = Math.round(exposure * (indecent ? 0.04 : 0.015) * hours);
  const exhibitionism = Math.round(exposure * (indecent ? 0.04 : 0.02) * hours);
  const allure = Math.round(
    clothingState.summary.partial_slots.length * 1.5
    + clothingState.summary.indecent_slots.length * 2
  );

  return { stress, hygiene, notoriety, exhibitionism, allure };
}
