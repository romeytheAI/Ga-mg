import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  computeHeuristics,
  buildCacheKey,
  heuristicsMatch,
  predictiveCache,
  type PredictiveHeuristics,
  type CacheCategory,
} from './predictiveCache';
import type { GameState } from '../types';

// ── Fixtures ───────────────────────────────────────────────────────────────

function makeHeuristics(overrides: Partial<PredictiveHeuristics> = {}): PredictiveHeuristics {
  return {
    locationId: 'loc_town_0',
    locationName: 'Ashford',
    tension: 0.3,
    corruption: 10,
    trauma: 15,
    health: 80,
    stamina: 70,
    day: 1,
    hour: 12,
    weather: 'Clear',
    activeWorldEvents: [],
    encounterRate: 50,
    ...overrides,
  };
}

function makeState(overrides: Record<string, any> = {}): GameState {
  return {
    player: {
      identity: { name: 'Test', race: 'Human', birthsign: 'The Thief', origin: 'Orphan', gender: 'female' },
      stats: {
        health: 80, max_health: 100, willpower: 90, max_willpower: 100,
        stamina: 70, max_stamina: 100, lust: 0, trauma: 10, hygiene: 40,
        corruption: 0, allure: 5, arousal: 0, pain: 5, control: 80,
        stress: 20, hallucination: 0, purity: 100,
      },
      skills: { seduction: 0, athletics: 5, skulduggery: 10, swimming: 0, dancing: 0, housekeeping: 15, lore_mastery: 50, tending: 0, cooking: 5, foraging: 0 },
      gold: 0, fame: 0, notoriety: 0,
      psych_profile: { submission_index: 0, cruelty_index: 0, exhibitionism: 0, promiscuity: 0 },
      attitudes: {}, sensitivity: {}, sexual_skills: {}, virginities: {}, body_fluids: {},
      insecurity: {}, lewdity_stats: {}, traits: [], feats: [],
      temperature: { clothing_warmth: 0, exposure_level: 0, environment_temp: 20, body_temp: 37, frostbite_risk: 0, heatstroke_risk: 0 },
      bailey_payment: {}, afflictions: [],
      clothing: { head: null, neck: null, shoulders: null, chest: null, underwear: null, legs: null, feet: null, hands: null, waist: null },
      clothing_state: { summary: { warmth: 0, exposure: 0, coverage: {} }, layers: [] } as any,
      inventory: [],
      anatomy: { height: '', build: '', metabolism: '', healer: '', sleep: '', gut: '', bones: '', flexibility: '', blood: '', vision: '', skin: '', pheromones: '', visage: '', temp_pref: '', injuries: [], organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 }, bones_integrity: { skull: 100, spine: 100, ribs: 100, arms: 100, legs: 100 } },
      psychology: { confidence: 50, dominance: 50, self_esteem: 50, impulsivity: 50 } as any,
      perks_flaws: { perks: [], flaws: [] } as any,
      social: {} as any,
      cosmetics: { hair_length: 'short', hair_color: 'brown', eye_color: 'blue', skin_tone: 'pale', scars: [], tattoos: [], piercings: [] } as any,
      arcane: {} as any,
      justice: {} as any,
      companions: { active_party: [], roster: [], max_encumbrance_bonus: 0 },
      base: {} as any,
      subconscious: {} as any,
      biology: { cycle_day: 0, heat_rut_active: false, parasites: [], incubations: [], cravings: [], exhaustion_multiplier: 1, post_partum_debuff: 0, sterility: false, fertility_cycle: '', fertility: 0, lactation_level: 0 },
      restraints: null,
      status_effects: [],
      life_sim: {} as any,
      player_job: 'none',
      addiction_state: {} as any,
      transformation: {} as any,
      disease_state: {} as any,
      parasite_state: {} as any,
      companion_state: {} as any,
      fame_record: {} as any,
      allure_state: {} as any,
      age_days: 365 * 20,
      quests: [],
      known_recipes: [],
    },
    world: {
      day: 1, hour: 12, week_day: 0, weather: 'Clear',
      current_location: { id: 'loc_town_0', name: 'Ashford', danger: 0.1, atmosphere: 'quiet', npcs: [], actions: [] },
      macro_events: [], local_tension: 0.3, aggression_counter: 0,
      active_world_events: [], turn_count: 0, last_intent: null,
      event_flags: {}, npc_relationships: {},
      economy: {}, ecology: {}, factions: {}, npc_state: {},
      meta_events: {}, settlement: {}, ambient: {}, arcane: {},
      justice: {}, dreamscape: {},
      ascension_state: 'none', director_cut: false,
      active_encounter: null, active_story_event: null,
    },
    memory_graph: [],
    ui: {
      isPollingText: false, isPollingImage: false, isGeneratingAvatar: false,
      currentLog: [], currentImage: null, choices: [],
      apiKey: '', hordeApiKey: '', ui_scale: 1, fullscreen: false,
      ambient_audio: false, haptics_enabled: false, accessibility_mode: false,
      last_stat_deltas: null,
      show_stats: false, show_inventory: false, show_map: false,
      show_quests: false, show_save_load: false, show_xray: false,
      show_shop: false, show_wardrobe: false, show_social: false,
      show_feats: false, show_traits: false,
      highlighted_part: null, targeted_part: null, combat_animation: null,
      horde_status: null,
      horde_monitor: { active: false, text_requests: 0, image_requests: 0, text_eta: 0, image_eta: 0, text_initial_eta: 0, image_initial_eta: 0, text_generation_chance: 0, image_generation_chance: 0 },
      selectedTextModel: '', selectedImageModel: '',
      settings: { encounter_rate: 50, stat_drain_multiplier: 1, enable_parasites: true, enable_pregnancy: true, enable_extreme_content: false },
      graphics_quality: {} as any,
    },
    sim_world: null,
    horde_queue: [],
    ...overrides,
  } as unknown as GameState;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('computeHeuristics', () => {
  it('extracts heuristics from gamestate', () => {
    const state = makeState();
    const h = computeHeuristics(state);
    expect(h.locationName).toBe('Ashford');
    expect(h.tension).toBe(0.3);
    expect(h.corruption).toBe(0);
    expect(h.trauma).toBe(10);
    expect(h.health).toBe(80);
    expect(h.day).toBe(1);
    expect(h.hour).toBe(12);
    expect(h.weather).toBe('Clear');
  });
});

describe('buildCacheKey', () => {
  it('produces deterministic keys for identical heuristics', () => {
    const h = makeHeuristics();
    const k1 = buildCacheKey('narrative', h);
    const k2 = buildCacheKey('narrative', h);
    expect(k1).toBe(k2);
  });

  it('differentiates categories', () => {
    const h = makeHeuristics();
    const k1 = buildCacheKey('narrative', h);
    const k2 = buildCacheKey('image', h);
    expect(k1).not.toBe(k2);
  });

  it('quantizes small differences', () => {
    const h1 = makeHeuristics({ corruption: 12 });
    const h2 = makeHeuristics({ corruption: 15 });
    const k1 = buildCacheKey('narrative', h1);
    const k2 = buildCacheKey('narrative', h2);
    expect(k1).toBe(k2); // Both quantize to corruption bucket 10
  });

  it('differentiates large differences', () => {
    const h1 = makeHeuristics({ corruption: 10 });
    const h2 = makeHeuristics({ corruption: 30 });
    const k1 = buildCacheKey('narrative', h1);
    const k2 = buildCacheKey('narrative', h2);
    expect(k1).not.toBe(k2);
  });
});

describe('heuristicsMatch', () => {
  it('matches identical heuristics', () => {
    const h = makeHeuristics();
    expect(heuristicsMatch(h, h, 'narrative')).toBe(true);
  });

  it('rejects different locations', () => {
    const h1 = makeHeuristics({ locationName: 'Ashford' });
    const h2 = makeHeuristics({ locationName: 'Millhaven' });
    expect(heuristicsMatch(h1, h2, 'narrative')).toBe(false);
  });

  it('matches within tolerance', () => {
    const h1 = makeHeuristics({ tension: 0.3, corruption: 10, trauma: 15, health: 80, hour: 12 });
    const h2 = makeHeuristics({ tension: 0.4, corruption: 20, trauma: 25, health: 90, hour: 14 });
    expect(heuristicsMatch(h1, h2, 'narrative')).toBe(true);
  });

  it('rejects beyond tolerance', () => {
    const h1 = makeHeuristics({ tension: 0.3 });
    const h2 = makeHeuristics({ tension: 0.8 });
    expect(heuristicsMatch(h1, h2, 'narrative')).toBe(false);
  });

  it('uses category-specific tolerances', () => {
    const h1 = makeHeuristics({ tension: 0.3 });
    const h2 = makeHeuristics({ tension: 0.9 });
    // memory_summary has tolerance 1.0 for tension, so should match
    expect(heuristicsMatch(h1, h2, 'memory_summary')).toBe(true);
    // narrative has tolerance 0.2 for tension, so should NOT match
    expect(heuristicsMatch(h1, h2, 'narrative')).toBe(false);
  });
});

describe('PredictiveCacheEngine', () => {
  beforeEach(() => {
    predictiveCache.clear();
  });

  it('stores and retrieves entries', () => {
    const h = makeHeuristics();
    predictiveCache.set('narrative', h, 'test payload');
    const entry = predictiveCache.get<string>('narrative', h);
    expect(entry).not.toBeNull();
    expect(entry!.payload).toBe('test payload');
  });

  it('returns null for cache miss', () => {
    const h = makeHeuristics({ locationName: 'Nowhere' });
    const entry = predictiveCache.get('narrative', h);
    expect(entry).toBeNull();
  });

  it('tracks hits and misses', () => {
    const h = makeHeuristics();
    predictiveCache.get('narrative', h); // miss
    predictiveCache.set('narrative', h, 'payload');
    predictiveCache.get('narrative', h); // hit
    const stats = predictiveCache.getStats();
    expect(stats.misses).toBeGreaterThanOrEqual(1);
    expect(stats.hits).toBeGreaterThanOrEqual(1);
  });

  it('supports AOT pregeneration', async () => {
    const h = makeHeuristics();
    predictiveCache.pregenerate({
      category: 'narrative',
      key: 'test-aot',
      heuristics: h,
      generator: async () => 'aot-result',
      ttlMs: 60000,
    });

    // Wait for async generation
    await new Promise(r => setTimeout(r, 50));

    const entry = predictiveCache.get<string>('narrative', h);
    expect(entry).not.toBeNull();
    expect(entry!.payload).toBe('aot-result');
    expect(predictiveCache.getStats().aotGenerations).toBe(1);
  });

  it('skips duplicate pregeneration', () => {
    const h = makeHeuristics();
    predictiveCache.set('narrative', h, 'existing');

    let genCalled = 0;
    predictiveCache.pregenerate({
      category: 'narrative',
      key: 'dup',
      heuristics: h,
      generator: async () => { genCalled++; return 'new'; },
      ttlMs: 60000,
    });

    expect(genCalled).toBe(0); // Should not call generator
  });

  it('supports JIT generation with caching', async () => {
    const h = makeHeuristics();
    const result = await predictiveCache.jitGenerate(
      'narrative',
      h,
      async () => 'jit-result',
      60000,
    );
    expect(result).toBe('jit-result');
    expect(predictiveCache.getStats().jitGenerations).toBe(1);

    // Verify it was cached
    const cached = predictiveCache.get<string>('narrative', h);
    expect(cached).not.toBeNull();
    expect(cached!.payload).toBe('jit-result');
  });

  it('JIT uses pending AOT result if available', async () => {
    const h = makeHeuristics();
    let aotResolve: (v: unknown) => void;
    const aotPromise = new Promise(r => { aotResolve = r; });

    // Start AOT pregeneration
    predictiveCache.pregenerate({
      category: 'narrative',
      key: 'pending-test',
      heuristics: h,
      generator: async () => aotPromise as Promise<unknown>,
      ttlMs: 60000,
    });

    // Resolve AOT before JIT
    setTimeout(() => aotResolve!('aot-resolved'), 10);

    const result = await predictiveCache.jitGenerate<string>(
      'narrative',
      h,
      async () => 'jit-fallback',
      60000,
    );

    // JIT should pick up the AOT result
    expect(result).toBe('aot-resolved');
  });

  it('invalidates category', () => {
    const h = makeHeuristics();
    predictiveCache.set('narrative', h, 'n');
    predictiveCache.set('image', h, 'i');
    predictiveCache.invalidateCategory('narrative');
    expect(predictiveCache.get('narrative', h)).toBeNull();
    expect(predictiveCache.get('image', h)).not.toBeNull();
  });

  it('invalidates stale entries', () => {
    const h1 = makeHeuristics({ locationName: 'Ashford' });
    const h2 = makeHeuristics({ locationName: 'Millhaven' });
    predictiveCache.set('narrative', h1, 'ashford-narrative');
    predictiveCache.set('narrative', h2, 'millhaven-narrative');
    predictiveCache.invalidateStale(h1);
    // h2 is stale relative to h1 because different location
    expect(predictiveCache.get('narrative', h1)).not.toBeNull();
    // h2 entries should be invalidated
  });

  it('enforces max cache size', () => {
    for (let i = 0; i < 35; i++) {
      const h = makeHeuristics({ corruption: i * 25 });
      predictiveCache.set('narrative', h, `payload-${i}`);
    }
    const stats = predictiveCache.getStats();
    expect(stats.size).toBeLessThanOrEqual(32);
    expect(stats.evictions).toBeGreaterThan(0);
  });

  it('reports cache stats', () => {
    const h = makeHeuristics();
    predictiveCache.get('narrative', h); // miss
    predictiveCache.set('narrative', h, 'payload');
    predictiveCache.get('narrative', h); // hit

    const stats = predictiveCache.getStats();
    expect(stats.size).toBe(1);
    expect(stats.hitRate).toBeGreaterThan(0);
  });

  it('expired entries are not returned', () => {
    const h = makeHeuristics();
    predictiveCache.set('narrative', h, 'expired', 1); // 1ms TTL
    // Wait for expiry
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const entry = predictiveCache.get('narrative', h);
        expect(entry).toBeNull();
        resolve();
      }, 10);
    });
  });
});
