/**
 * PredictiveCache — Ahead-of-Time (AOT) generation pipeline.
 *
 * Decouples AI generation from the main render thread by pre-compiling
 * narrative and image assets asynchronously based on gamestate heuristics.
 *
 * Architecture:
 *   1. AOT (Ahead-of-Time): Background daemon pre-generates assets keyed by
 *      predictive gamestate vectors. Runs out-of-band of the player horizon.
 *   2. JIT (Just-In-Time): Synchronous blocking generation reserved exclusively
 *      for forced player-triggered state interrupts where no cache hit exists.
 *
 * Invariants:
 *   - All generative node creation MUST go through the AOT cache pipeline.
 *   - Synchronous LLM API blocking is strictly restricted to JIT interrupt events.
 *   - The cache daemon never blocks the main thread.
 */

import { GameState } from '../types';

// ── Types ──────────────────────────────────────────────────────────────────

export type CacheCategory = 'narrative' | 'encounter_narrative' | 'memory_summary' | 'legendary_stats' | 'image' | 'encounter_image';

export interface CacheEntry<T = unknown> {
  key: string;
  category: CacheCategory;
  payload: T;
  createdAt: number;
  expiresAt: number;
  heuristics: PredictiveHeuristics;
}

export interface PredictiveHeuristics {
  locationId: string;
  locationName: string;
  tension: number;
  corruption: number;
  trauma: number;
  health: number;
  stamina: number;
  day: number;
  hour: number;
  weather: string;
  activeWorldEvents: string[];
  encounterRate: number;
}

export interface AOTRequest {
  category: CacheCategory;
  key: string;
  heuristics: PredictiveHeuristics;
  generator: () => Promise<unknown>;
  ttlMs: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  evictions: number;
  aotGenerations: number;
  jitGenerations: number;
  hitRate: number;
}

// ── Heuristic Vectoring ────────────────────────────────────────────────────

/**
 * Compute a predictive gamestate vector from the current state.
 * This vector determines which assets to pre-generate.
 */
export function computeHeuristics(state: GameState): PredictiveHeuristics {
  return {
    locationId: state.world.current_location.id ?? state.world.current_location.name,
    locationName: state.world.current_location.name,
    tension: state.world.local_tension,
    corruption: state.player.stats.corruption,
    trauma: state.player.stats.trauma,
    health: state.player.stats.health,
    stamina: state.player.stats.stamina,
    day: state.world.day,
    hour: state.world.hour,
    weather: state.world.weather,
    activeWorldEvents: state.world.active_world_events,
    encounterRate: state.ui.settings?.encounter_rate ?? 50,
  };
}

/**
 * Build a cache key from a category and heuristics.
 * Keys are coarsely-grained so that small state changes still hit the cache.
 */
export function buildCacheKey(category: CacheCategory, heuristics: PredictiveHeuristics): string {
  const quantize = (v: number, step: number) => Math.floor(v / step) * step;

  const location = heuristics.locationName;
  const tensionBucket = quantize(heuristics.tension, 0.1).toFixed(1);
  const corruptionBucket = quantize(heuristics.corruption, 10);
  const traumaBucket = quantize(heuristics.trauma, 10);
  const healthBucket = quantize(heuristics.health, 20);
  const hourBucket = quantize(heuristics.hour, 3);
  const day = heuristics.day;
  const eventsHash = heuristics.activeWorldEvents.length > 0
    ? heuristics.activeWorldEvents.join(',')
    : 'none';

  return `${category}:${location}:t${tensionBucket}:c${corruptionBucket}:tr${traumaBucket}:h${healthBucket}:d${day}:h${hourBucket}:e[${eventsHash}]`;
}

/**
 * Determine if two heuristic sets are "close enough" for a cache hit.
 * Allows fuzzy matching so that minor state changes don't invalidate
 * the entire cache.
 */
export function heuristicsMatch(
  cached: PredictiveHeuristics,
  current: PredictiveHeuristics,
  category: CacheCategory,
): boolean {
  if (cached.locationName !== current.locationName) return false;

  const tolerance: Record<CacheCategory, { tension: number; corruption: number; trauma: number; health: number; hour: number }> = {
    narrative:          { tension: 0.2, corruption: 20, trauma: 20, health: 30, hour: 4 },
    encounter_narrative:{ tension: 0.2, corruption: 20, trauma: 20, health: 30, hour: 4 },
    memory_summary:     { tension: 1.0, corruption: 100, trauma: 100, health: 100, hour: 24 },
    legendary_stats:    { tension: 1.0, corruption: 100, trauma: 100, health: 100, hour: 24 },
    image:              { tension: 0.3, corruption: 30, trauma: 30, health: 40, hour: 3 },
    encounter_image:    { tension: 0.3, corruption: 30, trauma: 30, health: 40, hour: 3 },
  };

  const tol = tolerance[category];
  return (
    Math.abs(cached.tension - current.tension) <= tol.tension &&
    Math.abs(cached.corruption - current.corruption) <= tol.corruption &&
    Math.abs(cached.trauma - current.trauma) <= tol.trauma &&
    Math.abs(cached.health - current.health) <= tol.health &&
    Math.abs(cached.hour - current.hour) <= tol.hour
  );
}

// ── Predictive Cache Engine ────────────────────────────────────────────────

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 32;

class PredictiveCacheEngine {
  private cache = new Map<string, CacheEntry>();
  private pending = new Map<string, Promise<unknown>>();
  private stats = { hits: 0, misses: 0, evictions: 0, aotGenerations: 0, jitGenerations: 0 };

  /**
   * Look up a cached result. Returns `null` if no valid entry exists.
   */
  get<T = unknown>(category: CacheCategory, heuristics: PredictiveHeuristics): CacheEntry<T> | null {
    const exactKey = buildCacheKey(category, heuristics);
    const exact = this.cache.get(exactKey);
    if (exact && exact.expiresAt > Date.now()) {
      this.stats.hits++;
      return exact as CacheEntry<T>;
    }

    // Fuzzy lookup: scan for a heuristically-close entry
    for (const [, entry] of this.cache) {
      if (entry.category !== category) continue;
      if (entry.expiresAt <= Date.now()) continue;
      if (heuristicsMatch(entry.heuristics, heuristics, category)) {
        this.stats.hits++;
        return entry as CacheEntry<T>;
      }
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Store a result in the cache.
   */
  set<T = unknown>(category: CacheCategory, heuristics: PredictiveHeuristics, payload: T, ttlMs: number = DEFAULT_TTL_MS): void {
    const key = buildCacheKey(category, heuristics);

    // Evict expired entries
    this.evictExpired();

    // Enforce max size
    while (this.cache.size >= MAX_CACHE_SIZE) {
      const oldest = this.findOldestEntry();
      if (oldest) {
        this.cache.delete(oldest.key);
        this.stats.evictions++;
      } else break;
    }

    this.cache.set(key, {
      key,
      category,
      payload,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlMs,
      heuristics,
    });
  }

  /**
   * AOT generation: fire-and-forget background pre-generation.
   * Never blocks the caller. Results land in the cache asynchronously.
   */
  pregenerate(request: AOTRequest): void {
    const key = buildCacheKey(request.category, request.heuristics);

    // Skip if already cached or pending
    if (this.cache.has(key) && this.cache.get(key)!.expiresAt > Date.now()) return;
    if (this.pending.has(key)) return;

    this.stats.aotGenerations++;
    const promise = request.generator()
      .then(result => {
        this.set(request.category, request.heuristics, result, request.ttlMs);
        this.pending.delete(key);
      })
      .catch(err => {
        console.warn(`[AOT] Pre-generation failed for ${request.category}:${key}`, err);
        this.pending.delete(key);
      });

    this.pending.delete(key); // Clean any stale
    this.pending.set(key, promise);
  }

  /**
   * JIT generation: synchronous blocking path for forced player interrupts.
   * Returns the result directly (blocking) and also caches it.
   */
  async jitGenerate<T>(
    category: CacheCategory,
    heuristics: PredictiveHeuristics,
    generator: () => Promise<T>,
    ttlMs: number = DEFAULT_TTL_MS,
  ): Promise<T> {
    this.stats.jitGenerations++;

    // Check if a pending AOT generation is about to complete
    const key = buildCacheKey(category, heuristics);
    const pending = this.pending.get(key);
    if (pending) {
      try {
        await pending;
        const cached = this.get<T>(category, heuristics);
        if (cached) return cached.payload;
      } catch {
        // Pending failed, fall through to direct generation
      }
    }

    const result = await generator();
    this.set(category, heuristics, result, ttlMs);
    return result;
  }

  /**
   * Check if a valid cache entry exists for the given category/heuristics.
   */
  has(category: CacheCategory, heuristics: PredictiveHeuristics): boolean {
    return this.get(category, heuristics) !== null;
  }

  /**
   * Invalidate all entries for a given category.
   */
  invalidateCategory(category: CacheCategory): void {
    for (const [key, entry] of this.cache) {
      if (entry.category === category) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate entries whose heuristics no longer match the current state
   * within the tolerance for their category.
   */
  invalidateStale(currentHeuristics: PredictiveHeuristics): void {
    for (const [key, entry] of this.cache) {
      if (!heuristicsMatch(entry.heuristics, currentHeuristics, entry.category)) {
        this.cache.delete(key);
        this.stats.evictions++;
      }
    }
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.clear();
    this.pending.clear();
  }

  /**
   * Get cache statistics.
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      aotGenerations: this.stats.aotGenerations,
      jitGenerations: this.stats.jitGenerations,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        this.stats.evictions++;
      }
    }
  }

  private findOldestEntry(): CacheEntry | undefined {
    let oldest: CacheEntry | undefined;
    for (const entry of this.cache.values()) {
      if (!oldest || entry.createdAt < oldest.createdAt) {
        oldest = entry;
      }
    }
    return oldest;
  }
}

// Singleton instance
export const predictiveCache = new PredictiveCacheEngine();

// ── AOT Daemon ─────────────────────────────────────────────────────────────

const AOT_TICK_INTERVAL_MS = 8000; // 8-second background tick
let daemonTimer: ReturnType<typeof setInterval> | null = null;
let lastDaemonHeuristics: PredictiveHeuristics | null = null;

/**
 * Determine which assets to pre-generate based on the current gamestate.
 * This is the "predictive gamestate vectoring" engine.
 */
export function computeAOTRequests(
  state: GameState,
  buildTextPromptFn: (state: GameState, actionText: string) => Promise<string>,
  buildImagePromptFn: (state: GameState) => string,
  generateTextFn: (prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any, skipLore?: boolean) => Promise<string>,
  generateImageFn: (prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) => Promise<string>,
): AOTRequest[] {
  const heuristics = computeHeuristics(state);
  const requests: AOTRequest[] = [];

  // Pre-generate narrative for likely actions at this location
  const locationActions = state.world.current_location.actions ?? [];
  const topActions = locationActions.slice(0, 3);

  for (const action of topActions) {
    const actionLabel = typeof action === 'object' && action.label ? action.label : String(action);
    const actionHeuristics = { ...heuristics }; // Snapshot current heuristics

    requests.push({
      category: 'narrative',
      key: `narrative:${actionLabel}:${buildCacheKey('narrative', actionHeuristics)}`,
      heuristics: actionHeuristics,
      ttlMs: 3 * 60 * 1000, // 3 minutes
      generator: async () => {
        const prompt = await buildTextPromptFn(state, actionLabel);
        const text = await generateTextFn(
          prompt,
          state.ui.apiKey,
          state.ui.hordeApiKey,
          state.ui.selectedTextModel,
          undefined,
          true,
        );
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) return JSON.parse(jsonMatch[0]);
        } catch { /* fall through */ }
        return text;
      },
    });
  }

  // Pre-generate environment image
  if (!predictiveCache.has('image', heuristics)) {
    requests.push({
      category: 'image',
      key: `image:${buildCacheKey('image', heuristics)}`,
      heuristics,
      ttlMs: 5 * 60 * 1000,
      generator: async () => {
        const prompt = buildImagePromptFn(state);
        return generateImageFn(prompt, state.ui.apiKey, state.ui.hordeApiKey, state.ui.selectedImageModel);
      },
    });
  }

  // Pre-generate encounter narrative if tension is high
  if (heuristics.tension > 0.5) {
    const encounterHeuristics = { ...heuristics, tension: Math.min(1, heuristics.tension + 0.1) };
    requests.push({
      category: 'encounter_narrative',
      key: `encounter:${buildCacheKey('encounter_narrative', encounterHeuristics)}`,
      heuristics: encounterHeuristics,
      ttlMs: 2 * 60 * 1000, // 2 minutes (encounters are time-sensitive)
      generator: async () => {
        const prompt = `The player is in a dark fantasy encounter at ${heuristics.locationName}. Tension is high (${heuristics.tension.toFixed(2)}). Weather: ${heuristics.weather}. Describe a brief combat encounter in 2-3 sentences. Return ONLY valid JSON with a 'narrative_text' field.`;
        const text = await generateTextFn(
          prompt,
          state.ui.apiKey,
          state.ui.hordeApiKey,
          state.ui.selectedTextModel,
          undefined,
          true,
        );
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) return JSON.parse(jsonMatch[0]);
        } catch { /* fall through */ }
        return text;
      },
    });
  }

  return requests;
}

/**
 * Start the AOT background daemon.
 * Periodically examines gamestate and pre-generates assets.
 */
export function startAOTDaemon(
  getState: () => GameState,
  buildTextPromptFn: (state: GameState, actionText: string) => Promise<string>,
  buildImagePromptFn: (state: GameState) => string,
  generateTextFn: (prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any, skipLore?: boolean) => Promise<string>,
  generateImageFn: (prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) => Promise<string>,
): void {
  if (daemonTimer) return; // Already running

  daemonTimer = setInterval(() => {
    try {
      const state = getState();
      if (!state || state.ui.isPollingText) return; // Don't compete with active JIT generation

      const heuristics = computeHeuristics(state);

      // Invalidate stale entries when gamestate shifts significantly
      if (lastDaemonHeuristics && lastDaemonHeuristics.locationName !== heuristics.locationName) {
        predictiveCache.invalidateStale(heuristics);
      }
      lastDaemonHeuristics = heuristics;

      // Compute and dispatch AOT requests
      const requests = computeAOTRequests(
        state,
        buildTextPromptFn,
        buildImagePromptFn,
        generateTextFn,
        generateImageFn,
      );

      for (const request of requests) {
        predictiveCache.pregenerate(request);
      }
    } catch (err) {
      console.warn('[AOT] Daemon tick error:', err);
    }
  }, AOT_TICK_INTERVAL_MS);
}

/**
 * Stop the AOT background daemon.
 */
export function stopAOTDaemon(): void {
  if (daemonTimer) {
    clearInterval(daemonTimer);
    daemonTimer = null;
    lastDaemonHeuristics = null;
  }
}
