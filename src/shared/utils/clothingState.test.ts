import { describe, expect, it } from 'vitest';
import { computeClothingState, exposureConsequences } from './clothingState';
import { ClothingLayer } from '../../core/types';

const makeClothingLayer = (integrity = 100): ClothingLayer => ({
  head: null,
  neck: null,
  shoulders: null,
  chest: {
    id: 'shirt',
    name: 'Simple Shirt',
    type: 'clothing',
    slot: 'chest',
    rarity: 'common',
    description: 'Basic coverage',
    value: 1,
    weight: 0.1,
    integrity,
    max_integrity: 100,
  },
  underwear: {
    id: 'underwear',
    name: 'Basic Underwear',
    type: 'clothing',
    slot: 'underwear',
    rarity: 'common',
    description: 'Basic coverage',
    value: 1,
    weight: 0.1,
    integrity,
    max_integrity: 100,
  },
  legs: null,
  feet: null,
  hands: null,
  waist: null,
});

describe('clothingState', () => {
  it('computes lower exposure when clothed', () => {
    const clothed = computeClothingState(makeClothingLayer(100));
    const nakedLayer: ClothingLayer = {
      head: null, neck: null, shoulders: null, chest: null, underwear: null, legs: null, feet: null, hands: null, waist: null,
    };
    const naked = computeClothingState(nakedLayer);

    expect(clothed.summary.exposure_score).toBeLessThan(naked.summary.exposure_score);
    expect(clothed.summary.indecent_slots.length).toBe(0);
    expect(naked.summary.indecent_slots).toContain('chest');
  });

  it('reduces warmth when integrity drops', () => {
    const intact = computeClothingState(makeClothingLayer(100));
    const damaged = computeClothingState(makeClothingLayer(20));

    expect(damaged.summary.warmth).toBeLessThan(intact.summary.warmth);
  });

  it('applies exposure consequences for indecent state', () => {
    const nakedLayer: ClothingLayer = {
      head: null, neck: null, shoulders: null, chest: null, underwear: null, legs: null, feet: null, hands: null, waist: null,
    };
    const nakedState = computeClothingState(nakedLayer);
    const impact = exposureConsequences(nakedState, 1);

    expect(impact.stress).toBeGreaterThan(0);
    expect(impact.notoriety).toBeGreaterThan(0);
    expect(impact.exhibitionism).toBeGreaterThan(0);
  });
});
