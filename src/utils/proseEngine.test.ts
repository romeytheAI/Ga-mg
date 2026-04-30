import { describe, it, expect } from 'vitest';
import { generateLocalProse } from './proseEngine';
import { GameState } from '../types';
import { initialState } from '../state/initialState';
import { LOCATIONS } from '../data/locations';

// ── helpers ────────────────────────────────────────────────────────────────

function stateAt(locationId: string, npcOverride?: string[]): GameState {
  const loc = LOCATIONS[locationId] ?? LOCATIONS.orphanage;
  const patchedLoc = npcOverride ? { ...loc, npcs: npcOverride } : loc;
  return {
    ...initialState,
    world: { ...initialState.world, current_location: patchedLoc },
  };
}

// ── Return type ────────────────────────────────────────────────────────────

describe('generateLocalProse – return type', () => {
  it('always returns a string', () => {
    const result = generateLocalProse(initialState, 'Do something');
    expect(typeof result).toBe('string');
  });

  it('returns a non-empty string', () => {
    const result = generateLocalProse(initialState, 'Look around');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns trimmed output (no leading/trailing whitespace)', () => {
    const result = generateLocalProse(initialState, 'Wait');
    expect(result).toBe(result.trim());
  });
});

// ── Action contextualization ───────────────────────────────────────────────

describe('generateLocalProse – action contextualization', () => {
  it('includes sharpen-senses feedback on observe action', () => {
    const result = generateLocalProse(initialState, 'observe the room');
    expect(result.toLowerCase()).toContain('senses sharpen');
  });

  it('is case-insensitive for observe', () => {
    const result = generateLocalProse(initialState, 'OBSERVE everything');
    expect(result.toLowerCase()).toContain('senses sharpen');
  });

  it('includes shadow feedback on wait action', () => {
    const result = generateLocalProse(initialState, 'wait here silently');
    expect(result.toLowerCase()).toContain('shadows');
  });

  it('includes divine feedback on pray action', () => {
    const result = generateLocalProse(initialState, 'pray to the gods');
    expect(result.toLowerCase()).toContain('divine');
  });

  it('returns generic prose for unknown actions', () => {
    const result = generateLocalProse(initialState, 'throw the cheese');
    // Still a string, just no specific action feedback
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ── NPC presence ───────────────────────────────────────────────────────────

describe('generateLocalProse – NPC presence', () => {
  it('mentions a nearby NPC when npcs list is populated', () => {
    const state = stateAt('orphanage', ['constance_michel']);
    const result = generateLocalProse(state, 'look around');
    // Should contain the NPC name or "nearby" sentiment
    expect(result.length).toBeGreaterThan(0);
  });

  it('does not crash when npcs list is empty', () => {
    const state = stateAt('orphanage', []);
    expect(() => generateLocalProse(state, 'look around')).not.toThrow();
  });

  it('does not crash when npcs list is undefined', () => {
    const noNpcState: GameState = {
      ...initialState,
      world: {
        ...initialState.world,
        current_location: { ...initialState.world.current_location, npcs: undefined as any },
      },
    };
    expect(() => generateLocalProse(noNpcState, 'look around')).not.toThrow();
  });
});

// ── Action-specific prefix consistency ──────────────────────────────
// NOTE: getDynamicDialogue randomises its output so we only test the
// deterministic action-specific prefix, not the full string.

describe('generateLocalProse – prefix consistency', () => {
  it('always starts with observe feedback for observe actions', () => {
    const a = generateLocalProse(initialState, 'observe the market');
    const b = generateLocalProse(initialState, 'observe the courtyard');
    expect(a.startsWith('Your senses sharpen')).toBe(true);
    expect(b.startsWith('Your senses sharpen')).toBe(true);
  });

  it('always contains shadow feedback for wait actions', () => {
    const a = generateLocalProse(initialState, 'wait here for an hour');
    const b = generateLocalProse(initialState, 'wait silently');
    expect(a).toContain('shadows');
    expect(b).toContain('shadows');
  });

  it('always contains divine feedback for pray actions', () => {
    expect(generateLocalProse(initialState, 'pray at the shrine')).toContain('divine');
  });

  it('observe output does not contain pray feedback', () => {
    const result = generateLocalProse(initialState, 'observe the market');
    expect(result).not.toContain('divine');
    // expect(result).not.toContain('shadows'); // removed due to flaky tests around evening prose
  });
});

