import { describe, it, expect } from 'vitest';
import { getVisualEffectClasses } from './visualEffects';
import { GameState } from '../types';
import { initialState } from '../state/initialState';

// ── helpers ────────────────────────────────────────────────────────────────

function stateWith(overrides: Partial<GameState['player']['stats']> & { last_intent?: string | null }): GameState {
  const { last_intent, ...statsOverrides } = overrides;
  return {
    ...initialState,
    player: {
      ...initialState.player,
      stats: { ...initialState.player.stats, ...statsOverrides },
    },
    world: {
      ...initialState.world,
      last_intent: last_intent !== undefined ? last_intent : initialState.world.last_intent,
    },
  };
}

// ── hallucination effects ──────────────────────────────────────────────────

describe('getVisualEffectClasses – hallucination', () => {
  it('returns empty string when hallucination is 0', () => {
    const classes = getVisualEffectClasses(stateWith({ hallucination: 0 }));
    expect(classes).not.toContain('animate-pulse-erratic');
    expect(classes).not.toContain('animate-wobble-light');
  });

  it('adds animate-wobble-light at hallucination 31', () => {
    const classes = getVisualEffectClasses(stateWith({ hallucination: 31 }));
    expect(classes).toContain('animate-wobble-light');
    expect(classes).not.toContain('animate-pulse-erratic');
  });

  it('adds animate-pulse-erratic at hallucination 71', () => {
    const classes = getVisualEffectClasses(stateWith({ hallucination: 71 }));
    expect(classes).toContain('animate-pulse-erratic');
  });

  it('exactly at threshold 30 does not add wobble', () => {
    const classes = getVisualEffectClasses(stateWith({ hallucination: 30 }));
    expect(classes).not.toContain('animate-wobble-light');
  });

  it('exactly at threshold 70 does not add erratic pulse', () => {
    const classes = getVisualEffectClasses(stateWith({ hallucination: 70 }));
    expect(classes).not.toContain('animate-pulse-erratic');
    expect(classes).toContain('animate-wobble-light');
  });
});

// ── health desperation ─────────────────────────────────────────────────────

describe('getVisualEffectClasses – health desperation', () => {
  it('adds desperation-vignette when health < 20', () => {
    const classes = getVisualEffectClasses(stateWith({ health: 15 }));
    expect(classes).toContain('desperation-vignette');
  });

  it('adds desperation-vignette when health is 1', () => {
    const classes = getVisualEffectClasses(stateWith({ health: 1 }));
    expect(classes).toContain('desperation-vignette');
  });

  it('does not add vignette at health 20', () => {
    const classes = getVisualEffectClasses(stateWith({ health: 20 }));
    expect(classes).not.toContain('desperation-vignette');
  });

  it('does not add vignette at full health', () => {
    const classes = getVisualEffectClasses(stateWith({ health: 100 }));
    expect(classes).not.toContain('desperation-vignette');
  });
});

// ── intent overlays ────────────────────────────────────────────────────────

describe('getVisualEffectClasses – intent overlays', () => {
  it('adds red border on aggressive intent', () => {
    const classes = getVisualEffectClasses(stateWith({ last_intent: 'aggressive' }));
    expect(classes).toContain('border-red-500/20');
  });

  it('does not add red border on neutral intent', () => {
    const classes = getVisualEffectClasses(stateWith({ last_intent: 'neutral' }));
    expect(classes).not.toContain('border-red-500/20');
  });

  it('does not add red border with null intent', () => {
    const classes = getVisualEffectClasses(stateWith({ last_intent: null }));
    expect(classes).not.toContain('border-red-500/20');
  });
});

// ── combination states ─────────────────────────────────────────────────────

describe('getVisualEffectClasses – combinations', () => {
  it('applies multiple classes simultaneously', () => {
    const state: GameState = {
      ...initialState,
      player: { ...initialState.player, stats: { ...initialState.player.stats, health: 10, hallucination: 80 } },
      world: { ...initialState.world, last_intent: 'aggressive' },
    };
    const classes = getVisualEffectClasses(state);
    expect(classes).toContain('animate-pulse-erratic');
    expect(classes).toContain('desperation-vignette');
    expect(classes).toContain('border-red-500/20');
  });

  it('returns trimmed string (no leading/trailing whitespace)', () => {
    const classes = getVisualEffectClasses(initialState);
    expect(classes).toBe(classes.trim());
  });

  it('returns a string type always', () => {
    const classes = getVisualEffectClasses(initialState);
    expect(typeof classes).toBe('string');
  });
});
