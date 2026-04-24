/**
 * Milestone 7 — Sprite Renderer Parity Tests
 *
 * Validates that major gameplay states are correctly represented in the
 * SVG sprite layer components. Tests cover:
 *  - Restraint rendering (RestraintLayer)
 *  - Clothing displacement visualization (Clothing)
 *  - Expression system coverage (deriveExpression)
 *  - Pose transform matrix (applyPoseTransform)
 *  - Clothing displacement opacity/transform helpers
 *
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

import { RestraintLayer } from './RestraintLayer';
import { Clothing } from './Clothing';
import { deriveExpression } from './FaceAndHair';
import { applyPoseTransform, buildBodyGeom } from './utils';
import { PlayerRestraints, ClothingLayer, ClothingState } from '../../types';
import { resolveRace } from '../../data/races';

// ── Test helpers ──────────────────────────────────────────────────────────

function makeBodyGeom() {
  const raceDef = resolveRace('Human');
  return buildBodyGeom('female', raceDef);
}

function makeSpriteState() {
  const cx = 50;
  const headCY = 21;
  const neckTopY = 33.5;
  const neckBotY = 42.5;
  const shldY = 43.5;
  const waistY = 98;
  const hipTopY = 104;
  const crotchY = 120;
  const kneeY = 160;
  const ankleY = 196;
  const footBotY = 206;
  const shLX = 26, shRX = 74;
  const elLX = 24, elRX = 76;
  const elY = 83.5;
  const wrLX = 22, wrRX = 78;
  const wrY = 111.5;
  const handCY = 115;
  const legLX = 37.4, legRX = 62.6;
  return {
    cx, headCY, neckTopY, neckBotY, shldY, waistY, hipTopY, crotchY, kneeY, ankleY, footBotY,
    shLX, shRX, elLX, elRX, elY, wrLX, wrRX, wrY, handCY, legLX, legRX,
    isDigi: false, digiKneeY: 142, digiAnkleY: 184,
  };
}

function makeBasicClothing(): ClothingLayer {
  return {
    head: null, neck: null, shoulders: null,
    chest: {
      id: 'tunic', name: 'Tunic', type: 'clothing', slot: 'chest',
      rarity: 'common', description: 'A tunic', value: 1, weight: 0.5,
      integrity: 80, max_integrity: 100, is_equipped: true,
    },
    underwear: {
      id: 'underwear', name: 'Underwear', type: 'clothing', slot: 'underwear',
      rarity: 'common', description: 'Basic', value: 1, weight: 0.1,
      integrity: 90, max_integrity: 100, is_equipped: true,
    },
    legs: null, feet: null, hands: null, waist: null,
  };
}

// ── RestraintLayer Tests ──────────────────────────────────────────────────

describe('RestraintLayer', () => {
  it('renders nothing when restraints is null', () => {
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={null} /></svg>
    );
    expect(container.querySelector('[data-layer="restraints"]')).toBeNull();
  });

  it('renders nothing when restraints has no entries', () => {
    const restraints: PlayerRestraints = { entries: [], escape_progress: 0, movement_penalty: 0, action_penalty: 0 };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-layer="restraints"]')).toBeNull();
  });

  it('renders wrist restraints', () => {
    const restraints: PlayerRestraints = {
      entries: [{ slot: 'wrists', name: 'Hemp Rope', strength: 40, comfort: 30, turn_applied: 1 }],
      escape_progress: 0, movement_penalty: 0.25, action_penalty: 0.15,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-slot="wrists"]')).not.toBeNull();
    expect(container.querySelector('[data-layer="restraints"]')).not.toBeNull();
  });

  it('renders ankle restraints', () => {
    const restraints: PlayerRestraints = {
      entries: [{ slot: 'ankles', name: 'Iron Shackles', strength: 80, comfort: 10, turn_applied: 2 }],
      escape_progress: 0, movement_penalty: 0.5, action_penalty: 0.15,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-slot="ankles"]')).not.toBeNull();
  });

  it('renders neck restraint', () => {
    const restraints: PlayerRestraints = {
      entries: [{ slot: 'neck', name: 'Leather Collar', strength: 50, comfort: 50, turn_applied: 3 }],
      escape_progress: 0, movement_penalty: 0, action_penalty: 0.15,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-slot="neck"]')).not.toBeNull();
  });

  it('renders waist restraint', () => {
    const restraints: PlayerRestraints = {
      entries: [{ slot: 'waist', name: 'Leather Strap', strength: 45, comfort: 40, turn_applied: 1 }],
      escape_progress: 0, movement_penalty: 0, action_penalty: 0.15,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-slot="waist"]')).not.toBeNull();
  });

  it('renders mouth gag restraint', () => {
    const restraints: PlayerRestraints = {
      entries: [{ slot: 'mouth', name: 'Ball Gag', strength: 30, comfort: 20, turn_applied: 2 }],
      escape_progress: 0, movement_penalty: 0, action_penalty: 0.15,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-slot="mouth"]')).not.toBeNull();
  });

  it('renders multiple restraint slots simultaneously', () => {
    const restraints: PlayerRestraints = {
      entries: [
        { slot: 'wrists', name: 'Rope', strength: 40, comfort: 30, turn_applied: 1 },
        { slot: 'ankles', name: 'Rope', strength: 40, comfort: 30, turn_applied: 1 },
        { slot: 'mouth', name: 'Gag',  strength: 30, comfort: 20, turn_applied: 1 },
      ],
      escape_progress: 20, movement_penalty: 0.75, action_penalty: 0.45,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    expect(container.querySelector('[data-slot="wrists"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="ankles"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="mouth"]')).not.toBeNull();
  });

  it('uses chain dash pattern for chain restraints', () => {
    const restraints: PlayerRestraints = {
      entries: [{ slot: 'wrists', name: 'Iron Chain', strength: 90, comfort: 5, turn_applied: 1 }],
      escape_progress: 0, movement_penalty: 0.25, action_penalty: 0.15,
    };
    const geom = makeBodyGeom();
    const s = makeSpriteState();
    const { container } = render(
      <svg><RestraintLayer geom={geom} s={s} restraints={restraints} /></svg>
    );
    // Chain path should have a strokeDasharray
    const paths = container.querySelectorAll('[data-slot="wrists"] path');
    const hasDash = Array.from(paths).some(p => p.getAttribute('stroke-dasharray'));
    expect(hasDash).toBe(true);
  });
});

// ── Clothing Displacement Tests ──────────────────────────────────────────

describe('Clothing - displacement visualization', () => {
  const geom = makeBodyGeom();
  const s = makeSpriteState();
  const clothing = makeBasicClothing();

  it('renders chest clothing normally when secure', () => {
    const clothingState: ClothingState = {
      slots: {
        chest: { slot: 'chest', equipped_item_id: 'tunic', integrity: 80, wetness: 0, displacement: 'secure', coverage: 0.8, exposure: 'covered' },
        underwear: { slot: 'underwear', equipped_item_id: 'underwear', integrity: 90, wetness: 0, displacement: 'secure', coverage: 0.9, exposure: 'covered' },
        head: { slot: 'head', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        neck: { slot: 'neck', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        shoulders: { slot: 'shoulders', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        waist: { slot: 'waist', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        legs: { slot: 'legs', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        feet: { slot: 'feet', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        hands: { slot: 'hands', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
      },
      summary: { exposure_score: 0.2, indecent_slots: [], partial_slots: [], warmth: 0.4 },
    };
    const { container } = render(
      <svg><Clothing geom={geom} s={s} skin="#f4d5b0" clothing={clothing} clothingState={clothingState} /></svg>
    );
    // Chest should render - find the path within the clothing group
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('applies transform for shifted clothing', () => {
    const clothingState: ClothingState = {
      slots: {
        chest: { slot: 'chest', equipped_item_id: 'tunic', integrity: 80, wetness: 0, displacement: 'shifted', coverage: 0.5, exposure: 'partial' },
        underwear: { slot: 'underwear', equipped_item_id: 'underwear', integrity: 90, wetness: 0, displacement: 'secure', coverage: 0.9, exposure: 'covered' },
        head: { slot: 'head', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        neck: { slot: 'neck', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        shoulders: { slot: 'shoulders', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        waist: { slot: 'waist', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        legs: { slot: 'legs', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        feet: { slot: 'feet', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        hands: { slot: 'hands', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
      },
      summary: { exposure_score: 0.5, indecent_slots: ['chest'], partial_slots: [], warmth: 0.2 },
    };
    const { container } = render(
      <svg><Clothing geom={geom} s={s} skin="#f4d5b0" clothing={clothing} clothingState={clothingState} /></svg>
    );
    // Shifted chest group should have a translate transform
    const groups = container.querySelectorAll('g[transform]');
    const hasShiftTransform = Array.from(groups).some(g => {
      const t = g.getAttribute('transform') || '';
      return t.includes('translate');
    });
    expect(hasShiftTransform).toBe(true);
  });

  it('does not render clothing slot when displacement is removed', () => {
    const clothingState: ClothingState = {
      slots: {
        chest: { slot: 'chest', equipped_item_id: 'tunic', integrity: 80, wetness: 0, displacement: 'removed', coverage: 0, exposure: 'bare' },
        underwear: { slot: 'underwear', equipped_item_id: 'underwear', integrity: 90, wetness: 0, displacement: 'removed', coverage: 0, exposure: 'bare' },
        head: { slot: 'head', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        neck: { slot: 'neck', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        shoulders: { slot: 'shoulders', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        waist: { slot: 'waist', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        legs: { slot: 'legs', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        feet: { slot: 'feet', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        hands: { slot: 'hands', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
      },
      summary: { exposure_score: 1.0, indecent_slots: ['chest', 'underwear'], partial_slots: [], warmth: 0 },
    };
    const { container } = render(
      <svg><Clothing geom={geom} s={s} skin="#f4d5b0" clothing={clothing} clothingState={clothingState} /></svg>
    );
    // With removed displacement, chest and underwear should not render (dispOp = 0)
    expect(container.querySelectorAll('g').length).toBe(0);
  });

  it('reduces opacity for displaced clothing', () => {
    const clothingState: ClothingState = {
      slots: {
        underwear: { slot: 'underwear', equipped_item_id: 'underwear', integrity: 90, wetness: 0, displacement: 'displaced', coverage: 0.25, exposure: 'partial' },
        chest: { slot: 'chest', equipped_item_id: 'tunic', integrity: 80, wetness: 0, displacement: 'secure', coverage: 0.8, exposure: 'covered' },
        head: { slot: 'head', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        neck: { slot: 'neck', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        shoulders: { slot: 'shoulders', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        waist: { slot: 'waist', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        legs: { slot: 'legs', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        feet: { slot: 'feet', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
        hands: { slot: 'hands', equipped_item_id: null, integrity: 100, wetness: 0, displacement: 'secure', coverage: 0, exposure: 'bare' },
      },
      summary: { exposure_score: 0.8, indecent_slots: ['underwear'], partial_slots: [], warmth: 0.3 },
    };
    const { container } = render(
      <svg><Clothing geom={geom} s={s} skin="#f4d5b0" clothing={clothing} clothingState={clothingState} /></svg>
    );
    // Underwear group should exist with reduced opacity
    const groups = container.querySelectorAll('g[opacity]');
    const opacities = Array.from(groups).map(g => parseFloat(g.getAttribute('opacity') || '1'));
    // At least one group has opacity < 0.8 (the displaced underwear group)
    expect(opacities.some(op => op < 0.8)).toBe(true);
  });

  it('renders without clothingState (backward compatibility)', () => {
    const { container } = render(
      <svg><Clothing geom={geom} s={s} skin="#f4d5b0" clothing={clothing} /></svg>
    );
    // Should render without error
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });
});

// ── Expression System Tests ───────────────────────────────────────────────

describe('deriveExpression - 8-state coverage', () => {
  it('returns normal for balanced stats', () => {
    const stats = { health: 80, stamina: 70, stress: 20, pain: 10, arousal: 10, lust: 15 };
    expect(deriveExpression(stats as any)).toBe('normal');
  });

  it('returns pain for high pain', () => {
    const stats = { health: 80, stamina: 70, stress: 20, pain: 75, arousal: 10, lust: 10 };
    expect(deriveExpression(stats as any)).toBe('pain');
  });

  it('returns ecstasy for extreme arousal', () => {
    const stats = { health: 80, stamina: 70, stress: 20, pain: 10, arousal: 90, lust: 80 };
    expect(deriveExpression(stats as any)).toBe('ecstasy');
  });

  it('returns heavyArousal for elevated arousal', () => {
    const stats = { health: 80, stamina: 70, stress: 20, pain: 10, arousal: 65, lust: 75 };
    expect(deriveExpression(stats as any)).toBe('heavyArousal');
  });

  it('returns softArousal for mild arousal', () => {
    const stats = { health: 80, stamina: 70, stress: 20, pain: 10, arousal: 40, lust: 50 };
    expect(deriveExpression(stats as any)).toBe('softArousal');
  });

  it('returns fear for high stress + low health', () => {
    const stats = { health: 20, stamina: 70, stress: 75, pain: 10, arousal: 10, lust: 10 };
    expect(deriveExpression(stats as any)).toBe('fear');
  });

  it('returns stress for moderate stress', () => {
    const stats = { health: 80, stamina: 70, stress: 55, pain: 10, arousal: 10, lust: 10 };
    expect(deriveExpression(stats as any)).toBe('stress');
  });

  it('returns exhausted for low stamina', () => {
    const stats = { health: 80, stamina: 10, stress: 20, pain: 10, arousal: 10, lust: 10 };
    expect(deriveExpression(stats as any)).toBe('exhausted');
  });

  it('pain takes precedence over arousal', () => {
    const stats = { health: 50, stamina: 50, stress: 30, pain: 80, arousal: 90, lust: 90 };
    expect(deriveExpression(stats as any)).toBe('pain');
  });
});

// ── Pose Transform Matrix Tests ──────────────────────────────────────────

describe('applyPoseTransform - pose state matrix', () => {
  const geom = makeBodyGeom();

  function baseState() {
    const raceDef = resolveRace('Human');
    const g = buildBodyGeom('female', raceDef);
    const cx = 50;
    return {
      cx, headCY: 21, neckTopY: 33.5, neckBotY: 42.5, shldY: 43.5,
      waistY: 98, hipTopY: 104, crotchY: 120, kneeY: 160, ankleY: 196, footBotY: 206,
      shLX: cx - g.shoulderHW - g.shoulderOutset,
      shRX: cx + g.shoulderHW + g.shoulderOutset,
      elLX: cx - g.shoulderHW - g.elbowOutset,
      elRX: cx + g.shoulderHW + g.elbowOutset,
      elY: 43.5 + 40,
      wrLX: cx - g.shoulderHW - g.wristOutset,
      wrRX: cx + g.shoulderHW + g.wristOutset,
      wrY: 43.5 + 68, handCY: 43.5 + 71.5,
      legLX: cx - g.legSpread, legRX: cx + g.legSpread,
      isDigi: false, digiKneeY: 142, digiAnkleY: 184,
    };
  }

  it('returns unchanged state for neutral pose', () => {
    const s = baseState();
    const result = applyPoseTransform(s, 'none');
    expect(result.cx).toBe(s.cx);
    expect(result.headCY).toBe(s.headCY);
  });

  it('modifies leg spread for leg_spread action', () => {
    const s = baseState();
    const result = applyPoseTransform(s, 'leg_spread');
    expect(result.legLX).toBeLessThan(s.legLX);
    expect(result.legRX).toBeGreaterThan(s.legRX);
  });

  it('applies bent_over transform', () => {
    const s = baseState();
    const result = applyPoseTransform(s, 'bent_over');
    // Bent over should lower the head Y
    expect(result.headCY).toBeGreaterThan(s.headCY);
  });

  it('applies prone transform', () => {
    const s = baseState();
    const result = applyPoseTransform(s, 'prone');
    expect(result.headCY).toBeGreaterThan(s.headCY);
  });

  it('applies arms_pinned transform', () => {
    const s = baseState();
    const result = applyPoseTransform(s, 'arms_pinned');
    // Arms should be brought closer to body
    const origWidth = s.shRX - s.shLX;
    const newWidth  = result.shRX - result.shLX;
    expect(newWidth).toBeLessThanOrEqual(origWidth);
  });

  it('handles unknown action without error', () => {
    const s = baseState();
    expect(() => applyPoseTransform(s, 'unknown_action')).not.toThrow();
  });

  it('restrained_tied action does not crash', () => {
    const s = baseState();
    const result = applyPoseTransform(s, 'restrained_tied');
    expect(result.cx).toBe(s.cx);
  });
});
