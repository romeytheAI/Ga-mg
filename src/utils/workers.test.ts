import { describe, expect, it } from 'vitest';
import { buildImagePrompt, getVisualEffectClasses } from './workers';
import { initialState } from '../state/initialState';

describe('buildImagePrompt', () => {
  it('includes DoL-style visual descriptors from player state', () => {
    const state = structuredClone(initialState);
    state.player.inventory = [{
      id: 'torn-dress',
      name: 'Torn Dress',
      type: 'clothing',
      slot: 'chest',
      rarity: 'common',
      description: 'A ruined dress',
      value: 0,
      weight: 0,
      integrity: 10,
      max_integrity: 100,
      is_equipped: true
    } as any];
    state.player.stats.hygiene = 10;
    state.player.stats.allure = 80;
    state.player.stats.lust = 90;
    state.player.stats.arousal = 90;
    state.player.stats.corruption = 90;
    state.player.stats.trauma = 80;
    state.player.stats.pain = 80;
    state.player.psych_profile.exhibitionism = 80;
    state.player.biology.heat_rut_active = true;
    state.player.afflictions = ['exhaustion'];

    const prompt = buildImagePrompt(state);

    expect(prompt).toContain('shredded');
    expect(prompt).toContain('filthy');
    expect(prompt).toContain('visibly aroused');
    expect(prompt).toContain('void-tainted');
    expect(prompt).toContain('haunted eyes');
    expect(prompt).toContain('in heat');
    expect(prompt).toContain('afflicted by');
  });
});

describe('getVisualEffectClasses', () => {
  it('returns appropriate visual overlays for critical states', () => {
    const state = structuredClone(initialState);
    state.player.stats.health = 10;
    state.player.stats.trauma = 80;
    state.player.stats.lust = 80;
    state.player.stats.arousal = 80;
    state.player.stats.corruption = 80;
    state.player.stats.control = 10;
    state.player.stats.pain = 90;
    state.player.stats.hallucination = 5;

    const classes = getVisualEffectClasses(state).split(' ');

    expect(classes).toContain('heartbeat-vignette');
    expect(classes).toContain('apathy-desaturation');
    expect(classes).toContain('arousal-warmth');
    expect(classes).toContain('corruption-darkness');
    expect(classes).toContain('low-control-tremor');
    expect(classes).toContain('pain-flash');
    expect(classes).toContain('hallucination-distortion');
  });
});
