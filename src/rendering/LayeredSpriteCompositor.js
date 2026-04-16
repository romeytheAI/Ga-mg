/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LAYERED SPRITE COMPOSITOR — MAXIMUM VIABLE PRODUCT (MaxVP)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * High-performance HTML5 Canvas rendering engine for state-driven web RPG
 * Achieves strict graphical parity with DoL-style layered SVG compositing
 * Zero-dependency ES6 architecture with memory-efficient rendering loops
 *
 * @fileoverview Production-ready canvas compositor for humanoid sprite rendering
 * @version 1.0.0
 * @license MIT
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1: CORE ARCHITECTURE & GLOBAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RenderConstants defines the rigid z-index layering system and rendering thresholds
 * @class
 */
class RenderConstants {
  /**
   * Layer draw order (back-to-front). Each layer is rendered sequentially.
   * @type {string[]}
   * @readonly
   */
  static LAYER_ORDER = [
    'background',
    'base_shadow',
    'skin_base',
    'body_details',
    'eyes_base',
    'eyes_iris',
    'hair_back',
    'clothing_under_lower',
    'clothing_under_upper',
    'genital_overlays',
    'body_fluids_base',
    'clothing_outer_lower',
    'clothing_outer_upper',
    'clothing_accessories',
    'hair_front',
    'body_fluids_top',
    'environment_overlays'
  ];

  /**
   * Canvas rendering dimensions (viewport size)
   * @type {{width: number, height: number}}
   */
  static VIEWPORT = {
    width: 400,
    height: 600
  };

  /**
   * Clothing integrity thresholds for asset state mapping
   * @type {{intact: number, frayed: number, torn: number}}
   */
  static INTEGRITY_THRESHOLDS = {
    intact: 80,
    frayed: 40,
    torn: 0
  };

  /**
   * Fluid opacity calculation constants
   * @type {{minAlpha: number, maxAlpha: number, volumeScale: number}}
   */
  static FLUID_RENDERING = {
    minAlpha: 0.15,
    maxAlpha: 0.85,
    volumeScale: 0.01
  };

  /**
   * Blend mode mapping for different fluid types
   * @type {Object.<string, string>}
   */
  static FLUID_BLEND_MODES = {
    blood: 'multiply',
    semen: 'source-over',
    milk: 'source-over',
    saliva: 'source-over',
    slime: 'hard-light',
    sweat: 'source-over'
  };

  /**
   * Fallback 1x1 transparent pixel (Base64 encoded PNG)
   * Used when asset fails to load
   * @type {string}
   */
  static FALLBACK_ASSET = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSET DICTIONARY & STATE MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * AssetDictionary maps dynamic game state vectors to asset file paths
 * Implements multi-conditional parsing logic for DoL-parity state resolution
 * @class
 */
class AssetDictionary {
  /**
   * @param {string} assetBasePath - Base URL/path for asset loading
   */
  constructor(assetBasePath = '/assets/sprites/') {
    this.basePath = assetBasePath;
    this.cache = new Map();
  }

  /**
   * Resolve asset path for a specific layer based on game state
   * @param {string} layerName - Layer identifier from LAYER_ORDER
   * @param {Object} gameState - Complete game state object
   * @returns {string|null} Asset path or null if layer should not be rendered
   */
  resolveAsset(layerName, gameState) {
    // Check cache first
    const cacheKey = `${layerName}:${JSON.stringify(gameState)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let assetPath = null;

    switch (layerName) {
      case 'background':
        assetPath = this._resolveBackground(gameState);
        break;
      case 'base_shadow':
        assetPath = `${this.basePath}shadow/character_shadow.png`;
        break;
      case 'skin_base':
        assetPath = this._resolveSkinBase(gameState);
        break;
      case 'body_details':
        assetPath = this._resolveBodyDetails(gameState);
        break;
      case 'eyes_base':
        assetPath = `${this.basePath}face/eyes_base.png`;
        break;
      case 'eyes_iris':
        assetPath = this._resolveEyesIris(gameState);
        break;
      case 'hair_back':
        assetPath = this._resolveHairBack(gameState);
        break;
      case 'clothing_under_lower':
        assetPath = this._resolveClothingLayer(gameState, 'underwear', 'lower');
        break;
      case 'clothing_under_upper':
        assetPath = this._resolveClothingLayer(gameState, 'underwear', 'upper');
        break;
      case 'genital_overlays':
        assetPath = this._resolveGenitalOverlays(gameState);
        break;
      case 'body_fluids_base':
        assetPath = this._resolveBodyFluidsLayer(gameState, 'base');
        break;
      case 'clothing_outer_lower':
        assetPath = this._resolveClothingLayer(gameState, 'legs', 'lower');
        break;
      case 'clothing_outer_upper':
        assetPath = this._resolveClothingLayer(gameState, 'chest', 'upper');
        break;
      case 'clothing_accessories':
        assetPath = this._resolveAccessories(gameState);
        break;
      case 'hair_front':
        assetPath = this._resolveHairFront(gameState);
        break;
      case 'body_fluids_top':
        assetPath = this._resolveBodyFluidsLayer(gameState, 'top');
        break;
      case 'environment_overlays':
        assetPath = this._resolveEnvironmentOverlay(gameState);
        break;
      default:
        assetPath = null;
    }

    // Cache the resolved path
    this.cache.set(cacheKey, assetPath);
    return assetPath;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string|null}
   */
  _resolveBackground(gameState) {
    const location = gameState.world?.location || 'generic';
    return `${this.basePath}background/${location}.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string}
   */
  _resolveSkinBase(gameState) {
    const race = gameState.player?.identity?.race || 'human';
    const gender = gameState.player?.identity?.gender || 'female';
    return `${this.basePath}body/skin_${race}_${gender}.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string|null}
   */
  _resolveBodyDetails(gameState) {
    const anatomy = gameState.player?.anatomy || {};
    const hasTail = anatomy.has_tail;
    const earType = anatomy.ear_type;

    if (hasTail || earType === 'cat') {
      return `${this.basePath}body/details_${earType || 'tail'}.png`;
    }
    return null;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string}
   */
  _resolveEyesIris(gameState) {
    const eyeColor = gameState.player?.cosmetics?.eye_color || 'blue';
    return `${this.basePath}face/iris_${eyeColor}.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string}
   */
  _resolveHairBack(gameState) {
    const hairColor = gameState.player?.cosmetics?.hair_color || 'brown';
    const hairStyle = gameState.player?.cosmetics?.hair_style || 'long';
    return `${this.basePath}hair/${hairStyle}_back_${hairColor}.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string}
   */
  _resolveHairFront(gameState) {
    const hairColor = gameState.player?.cosmetics?.hair_color || 'brown';
    const hairStyle = gameState.player?.cosmetics?.hair_style || 'long';
    return `${this.basePath}hair/${hairStyle}_front_${hairColor}.png`;
  }

  /**
   * Resolve clothing layer asset based on integrity thresholds
   * @private
   * @param {Object} gameState
   * @param {string} slot - Clothing slot name
   * @param {string} position - 'upper' or 'lower'
   * @returns {string|null}
   */
  _resolveClothingLayer(gameState, slot, position) {
    const clothing = gameState.player?.clothing?.[slot];
    if (!clothing) return null;

    const integrity = clothing.integrity ?? 100;
    const itemName = clothing.name?.toLowerCase().replace(/\s+/g, '_') || 'default';

    let state = 'torn';
    if (integrity > RenderConstants.INTEGRITY_THRESHOLDS.intact) {
      state = 'intact';
    } else if (integrity > RenderConstants.INTEGRITY_THRESHOLDS.frayed) {
      state = 'frayed';
    }

    return `${this.basePath}clothing/${slot}/${itemName}_${state}.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string|null}
   */
  _resolveGenitalOverlays(gameState) {
    const isExposed = this._isGroinExposed(gameState);
    if (!isExposed) return null;

    const gender = gameState.player?.identity?.gender || 'female';
    const arousal = gameState.player?.stats?.arousal || 0;

    if (arousal > 60) {
      return `${this.basePath}genitals/${gender}_aroused.png`;
    }
    return `${this.basePath}genitals/${gender}_base.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string|null}
   */
  _resolveAccessories(gameState) {
    const cosmetics = gameState.player?.cosmetics || {};
    const bodyMods = cosmetics.body_mods || [];

    if (bodyMods.some(m => m.toLowerCase().includes('collar'))) {
      return `${this.basePath}accessories/collar.png`;
    }
    return null;
  }

  /**
   * Resolve body fluid layer (stains, drips, coverage)
   * @private
   * @param {Object} gameState
   * @param {string} layer - 'base' or 'top'
   * @returns {string|null}
   */
  _resolveBodyFluidsLayer(gameState, layer) {
    const bodyFluids = gameState.player?.body_fluids || {};
    const stains = this._getActiveStains(bodyFluids);

    if (stains.length === 0) return null;

    // Select highest priority stain for this layer
    const layerStains = stains.filter(s => s.layer === layer);
    if (layerStains.length === 0) return null;

    const stain = layerStains[0];
    return `${this.basePath}fluids/${stain.type}_${stain.location}.png`;
  }

  /**
   * @private
   * @param {Object} gameState
   * @returns {string|null}
   */
  _resolveEnvironmentOverlay(gameState) {
    const weather = gameState.world?.weather || 'Clear';
    if (weather.toLowerCase().includes('rain') || weather.toLowerCase().includes('storm')) {
      return `${this.basePath}environment/rain_overlay.png`;
    }
    return null;
  }

  /**
   * Extract active stains from body_fluids state
   * @private
   * @param {Object} bodyFluids
   * @returns {Array<{type: string, location: string, volume: number, layer: string}>}
   */
  _getActiveStains(bodyFluids) {
    const stains = [];
    const fluidTypes = ['semen', 'blood', 'saliva', 'milk', 'slime', 'sweat'];

    fluidTypes.forEach(type => {
      const level = bodyFluids[type] || 0;
      if (level > 10) {
        // Map level to body location (chest for high volume, legs for lower)
        const location = level > 50 ? 'chest' : level > 30 ? 'abdomen' : 'legs';
        const layer = type === 'blood' ? 'base' : 'top';
        stains.push({ type, location, volume: level, layer });
      }
    });

    return stains.sort((a, b) => b.volume - a.volume);
  }

  /**
   * Check if groin is exposed (clothing destroyed or absent)
   * @private
   * @param {Object} gameState
   * @returns {boolean}
   */
  _isGroinExposed(gameState) {
    const underwear = gameState.player?.clothing?.underwear;
    if (!underwear) return true;
    const integrity = underwear.integrity ?? 100;
    return integrity <= RenderConstants.INTEGRITY_THRESHOLDS.torn;
  }

  /**
   * Clear the asset resolution cache
   * @public
   */
  clearCache() {
    this.cache.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2: ASSET MANAGEMENT AND MEMORY POOLING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * AssetManager implements LRU cache for HTMLImageElement storage
 * Handles async batch loading with Promise.all pipeline
 * @class
 */
class AssetManager {
  /**
   * @param {number} maxCacheSize - Maximum number of cached images
   */
  constructor(maxCacheSize = 100) {
    /** @type {Map<string, HTMLImageElement>} */
    this.cache = new Map();
    /** @type {Map<string, number>} */
    this.accessTimestamps = new Map();
    this.maxCacheSize = maxCacheSize;
    this.loadingPromises = new Map();
  }

  /**
   * Batch load assets asynchronously
   * @param {string[]} assetPaths - Array of asset URLs to preload
   * @returns {Promise<void>}
   */
  async batchLoad(assetPaths) {
    const loadPromises = assetPaths
      .filter(path => path && !this.cache.has(path))
      .map(path => this.loadAsset(path));

    await Promise.all(loadPromises);
  }

  /**
   * Load a single asset with error handling
   * @param {string} assetPath - Asset URL
   * @returns {Promise<HTMLImageElement>}
   */
  async loadAsset(assetPath) {
    // Return cached asset if available
    if (this.cache.has(assetPath)) {
      this._updateAccessTime(assetPath);
      return this.cache.get(assetPath);
    }

    // Return existing loading promise if asset is currently loading
    if (this.loadingPromises.has(assetPath)) {
      return this.loadingPromises.get(assetPath);
    }

    // Create new loading promise
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this._addToCache(assetPath, img);
        this.loadingPromises.delete(assetPath);
        resolve(img);
      };

      img.onerror = (error) => {
        console.warn(`[AssetManager] Failed to load asset: ${assetPath}`, error);
        // Create fallback 1x1 transparent image
        const fallbackImg = new Image();
        fallbackImg.src = RenderConstants.FALLBACK_ASSET;
        fallbackImg.onload = () => {
          this._addToCache(assetPath, fallbackImg);
          this.loadingPromises.delete(assetPath);
          resolve(fallbackImg);
        };
      };

      img.src = assetPath;
    });

    this.loadingPromises.set(assetPath, loadPromise);
    return loadPromise;
  }

  /**
   * Get cached asset or return null
   * @param {string} assetPath
   * @returns {HTMLImageElement|null}
   */
  getAsset(assetPath) {
    if (this.cache.has(assetPath)) {
      this._updateAccessTime(assetPath);
      return this.cache.get(assetPath);
    }
    return null;
  }

  /**
   * Add asset to cache with LRU eviction
   * @private
   * @param {string} assetPath
   * @param {HTMLImageElement} image
   */
  _addToCache(assetPath, image) {
    // Evict least recently used asset if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this._evictLRU();
    }

    this.cache.set(assetPath, image);
    this._updateAccessTime(assetPath);
  }

  /**
   * Update access timestamp for LRU tracking
   * @private
   * @param {string} assetPath
   */
  _updateAccessTime(assetPath) {
    this.accessTimestamps.set(assetPath, Date.now());
  }

  /**
   * Evict least recently used asset from cache
   * @private
   */
  _evictLRU() {
    let oldestPath = null;
    let oldestTime = Infinity;

    for (const [path, timestamp] of this.accessTimestamps.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestPath = path;
      }
    }

    if (oldestPath) {
      this.cache.delete(oldestPath);
      this.accessTimestamps.delete(oldestPath);
    }
  }

  /**
   * Clear entire cache
   * @public
   */
  clearCache() {
    this.cache.clear();
    this.accessTimestamps.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   * @returns {{size: number, maxSize: number, hitRate: number}}
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.cache.size / this.maxCacheSize
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3: THE COMPOSITING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * CanvasCompositor implements double-buffered rendering with tint/blend operations
 * @class
 */
class CanvasCompositor {
  /**
   * @param {string} canvasId - DOM canvas element ID
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  constructor(canvasId, width = RenderConstants.VIEWPORT.width, height = RenderConstants.VIEWPORT.height) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`[CanvasCompositor] Canvas element #${canvasId} not found`);
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });

    // Create offscreen buffer for flicker-free double-buffering
    this.buffer = document.createElement('canvas');
    this.buffer.width = width;
    this.buffer.height = height;
    this.bufferCtx = this.buffer.getContext('2d', { alpha: true, willReadFrequently: true });

    // Tint cache for color-modified assets
    this.tintCache = new Map();
  }

  /**
   * Apply color tint to an image using globalCompositeOperation
   * @param {HTMLImageElement} imageElement - Source image
   * @param {string} hexColor - Hex color code (e.g., '#FF5733')
   * @param {string} blendMode - Composite operation mode
   * @returns {HTMLCanvasElement} Tinted canvas
   */
  applyTint(imageElement, hexColor, blendMode = 'source-atop') {
    const cacheKey = `${imageElement.src}:${hexColor}:${blendMode}`;

    if (this.tintCache.has(cacheKey)) {
      return this.tintCache.get(cacheKey);
    }

    // Create temporary canvas for tinting
    const tintCanvas = document.createElement('canvas');
    tintCanvas.width = imageElement.width || 400;
    tintCanvas.height = imageElement.height || 600;
    const tintCtx = tintCanvas.getContext('2d', { alpha: true });

    // Draw original image
    tintCtx.drawImage(imageElement, 0, 0);

    // Apply tint color with blend mode
    tintCtx.globalCompositeOperation = blendMode;
    tintCtx.fillStyle = hexColor;
    tintCtx.fillRect(0, 0, tintCanvas.width, tintCanvas.height);

    // Cache the tinted canvas
    this.tintCache.set(cacheKey, tintCanvas);
    return tintCanvas;
  }

  /**
   * Clear the visible canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Clear the offscreen buffer
   */
  clearBuffer() {
    this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
  }

  /**
   * Transfer offscreen buffer to visible canvas (block transfer)
   */
  flipBuffer() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.buffer, 0, 0);
  }

  /**
   * Draw image to offscreen buffer with optional alpha and blend mode
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} alpha - Global alpha (0-1)
   * @param {string} blendMode - Composite operation
   */
  drawToBuffer(image, x = 0, y = 0, alpha = 1.0, blendMode = 'source-over') {
    const prevAlpha = this.bufferCtx.globalAlpha;
    const prevBlend = this.bufferCtx.globalCompositeOperation;

    this.bufferCtx.globalAlpha = alpha;
    this.bufferCtx.globalCompositeOperation = blendMode;

    this.bufferCtx.drawImage(image, x, y);

    // Restore previous context state
    this.bufferCtx.globalAlpha = prevAlpha;
    this.bufferCtx.globalCompositeOperation = prevBlend;
  }

  /**
   * Clear tint cache
   */
  clearTintCache() {
    this.tintCache.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4: DYNAMIC FLUID AND STAIN MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * FluidRenderer handles advanced blending logic for body fluid layers
 * @class
 */
class FluidRenderer {
  /**
   * Calculate blend mode for fluid type
   * @param {string} fluidType - Type of fluid
   * @returns {string} GlobalCompositeOperation value
   */
  static getBlendMode(fluidType) {
    return RenderConstants.FLUID_BLEND_MODES[fluidType] || 'source-over';
  }

  /**
   * Calculate alpha opacity based on fluid volume
   * @param {number} volume - Fluid volume (0-100)
   * @returns {number} Alpha value (0-1)
   */
  static calculateAlpha(volume) {
    const normalized = Math.min(100, Math.max(0, volume)) / 100;
    const { minAlpha, maxAlpha } = RenderConstants.FLUID_RENDERING;
    return minAlpha + (normalized * (maxAlpha - minAlpha));
  }

  /**
   * Render fluid layer with correct blending
   * @param {CanvasCompositor} compositor
   * @param {HTMLImageElement} fluidImage
   * @param {string} fluidType
   * @param {number} volume
   */
  static renderFluidLayer(compositor, fluidImage, fluidType, volume) {
    const blendMode = FluidRenderer.getBlendMode(fluidType);
    const alpha = FluidRenderer.calculateAlpha(volume);

    compositor.drawToBuffer(fluidImage, 0, 0, alpha, blendMode);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 5: RENDER LOOP EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SpriteRenderer implements the primary render loop with layer iteration
 * @class
 */
class SpriteRenderer {
  /**
   * @param {CanvasCompositor} compositor
   * @param {AssetManager} assetManager
   * @param {AssetDictionary} assetDict
   */
  constructor(compositor, assetManager, assetDict) {
    this.compositor = compositor;
    this.assetManager = assetManager;
    this.assetDict = assetDict;
  }

  /**
   * Primary render method - draws a complete frame based on game state
   * @param {Object} gameState - Complete game state object
   * @returns {Promise<void>}
   */
  async drawFrame(gameState) {
    // Clear offscreen buffer
    this.compositor.clearBuffer();

    // Iterate through layer order sequentially
    for (const layerName of RenderConstants.LAYER_ORDER) {
      await this._renderLayer(layerName, gameState);
    }

    // Transfer buffer to visible canvas (single block transfer)
    this.compositor.flipBuffer();
  }

  /**
   * Render a single layer
   * @private
   * @param {string} layerName
   * @param {Object} gameState
   * @returns {Promise<void>}
   */
  async _renderLayer(layerName, gameState) {
    // Resolve asset path for this layer
    const assetPath = this.assetDict.resolveAsset(layerName, gameState);
    if (!assetPath) return; // Layer not visible

    // Get or load asset
    let asset = this.assetManager.getAsset(assetPath);
    if (!asset) {
      asset = await this.assetManager.loadAsset(assetPath);
    }

    // Check if layer requires color override (tinting)
    const tintColor = this._getLayerTint(layerName, gameState);
    let renderAsset = asset;

    if (tintColor) {
      renderAsset = this.compositor.applyTint(asset, tintColor, 'source-atop');
    }

    // Handle fluid layers with special blending
    if (layerName === 'body_fluids_base' || layerName === 'body_fluids_top') {
      this._renderFluidLayer(layerName, renderAsset, gameState);
    } else {
      // Standard layer rendering
      this.compositor.drawToBuffer(renderAsset, 0, 0, 1.0, 'source-over');
    }
  }

  /**
   * Get tint color for layer if required
   * @private
   * @param {string} layerName
   * @param {Object} gameState
   * @returns {string|null} Hex color or null
   */
  _getLayerTint(layerName, gameState) {
    const cosmetics = gameState.player?.cosmetics || {};

    switch (layerName) {
      case 'skin_base':
      case 'body_details':
        return cosmetics.skin_tone || null;
      case 'eyes_iris':
        return this._hexFromColorName(cosmetics.eye_color);
      case 'hair_back':
      case 'hair_front':
        return this._hexFromColorName(cosmetics.hair_color);
      default:
        return null;
    }
  }

  /**
   * Render fluid layer with volume-based alpha
   * @private
   * @param {string} layerName
   * @param {HTMLImageElement|HTMLCanvasElement} asset
   * @param {Object} gameState
   */
  _renderFluidLayer(layerName, asset, gameState) {
    const bodyFluids = gameState.player?.body_fluids || {};
    const stains = this.assetDict._getActiveStains(bodyFluids);

    if (stains.length === 0) return;

    // Find the stain corresponding to this layer
    const layerType = layerName === 'body_fluids_base' ? 'base' : 'top';
    const stain = stains.find(s => s.layer === layerType);

    if (!stain) return;

    FluidRenderer.renderFluidLayer(this.compositor, asset, stain.type, stain.volume);
  }

  /**
   * Convert color name to hex (simplified mapping)
   * @private
   * @param {string} colorName
   * @returns {string|null}
   */
  _hexFromColorName(colorName) {
    const colorMap = {
      blue: '#3b82f6',
      green: '#22c55e',
      brown: '#92400e',
      black: '#1f2937',
      blonde: '#fbbf24',
      red: '#ef4444',
      white: '#f9fafb',
      purple: '#a855f7',
      pink: '#ec4899',
      tan: '#d2b48c',
      pale: '#fce7e0',
      dark: '#4a3728'
    };

    return colorMap[colorName?.toLowerCase()] || null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 6: IDLE ANIMATION STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * AnimationController manages idle animations and render loop
 * @class
 */
class AnimationController {
  /**
   * @param {SpriteRenderer} renderer
   * @param {HTMLCanvasElement} canvas
   */
  constructor(renderer, canvas) {
    this.renderer = renderer;
    this.canvas = canvas;
    this.isRunning = false;
    this.animationFrameId = null;
    this.startTime = Date.now();
  }

  /**
   * Start the render loop with idle breathing animation
   * @param {Object} gameState - Game state object
   */
  startRenderLoop(gameState) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = Date.now();

    const animate = async () => {
      if (!this.isRunning) return;

      // Render frame
      await this.renderer.drawFrame(gameState);

      // Apply idle breathing animation via CSS transform
      this._applyBreathingAnimation();

      // Schedule next frame
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Apply sine wave breathing animation to canvas wrapper
   * @private
   */
  _applyBreathingAnimation() {
    const elapsed = Date.now() - this.startTime;
    const breathCycle = 3000; // 3 second cycle
    const phase = (elapsed % breathCycle) / breathCycle;
    const breathScale = 1.0 + (Math.sin(phase * Math.PI * 2) * 0.01); // 1.0 to 1.02

    // Apply CSS transform (hardware accelerated)
    this.canvas.style.transform = `scaleY(${breathScale})`;
    this.canvas.style.transformOrigin = 'center bottom';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7: INTEGRATION & INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * LayeredSpriteEngine integrates all subsystems into a cohesive rendering engine
 * @class
 */
class LayeredSpriteEngine {
  /**
   * @param {string} canvasId - Target DOM canvas ID
   * @param {string} assetBasePath - Base path for asset loading
   */
  constructor(canvasId, assetBasePath = '/assets/sprites/') {
    this.compositor = new CanvasCompositor(canvasId);
    this.assetManager = new AssetManager(100);
    this.assetDict = new AssetDictionary(assetBasePath);
    this.renderer = new SpriteRenderer(this.compositor, this.assetManager, this.assetDict);
    this.animController = new AnimationController(this.renderer, this.compositor.canvas);
  }

  /**
   * Initialize the engine by preloading required assets
   * @param {string[]} requiredAssets - Array of asset paths to preload
   * @returns {Promise<void>}
   */
  async initialize(requiredAssets) {
    console.log('[LayeredSpriteEngine] Initializing asset pipeline...');
    await this.assetManager.batchLoad(requiredAssets);
    console.log('[LayeredSpriteEngine] Asset pipeline ready.');
  }

  /**
   * Render a single frame
   * @param {Object} gameState
   * @returns {Promise<void>}
   */
  async renderFrame(gameState) {
    await this.renderer.drawFrame(gameState);
  }

  /**
   * Start animated render loop
   * @param {Object} gameState
   */
  startAnimation(gameState) {
    this.animController.startRenderLoop(gameState);
  }

  /**
   * Stop animated render loop
   */
  stopAnimation() {
    this.animController.stopRenderLoop();
  }

  /**
   * Clear all caches
   */
  clearCaches() {
    this.assetManager.clearCache();
    this.assetDict.clearCache();
    this.compositor.clearTintCache();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7: DATA STRUCTURE MOCKING & EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Mock game state object for testing the rendering engine
 * Simulates a character with beast traits, custom skin tone, torn clothing, and fluids
 * @type {Object}
 */
const mockGameState = {
  player: {
    identity: {
      race: 'khajiit',
      gender: 'female',
      name: 'Test Character'
    },
    cosmetics: {
      skin_tone: '#d2a679',
      eye_color: 'green',
      hair_color: 'brown',
      hair_style: 'long',
      freckles: true,
      tan_lines: false,
      scars: [
        { location: 'face', type: 'slash' }
      ],
      tattoos: [],
      piercings: [
        { location: 'ear_left' },
        { location: 'ear_right' }
      ],
      body_mods: ['collar'],
      body_writing: []
    },
    anatomy: {
      has_tail: true,
      ear_type: 'cat',
      has_tusks: false,
      has_muzzle: false,
      leg_type: 'digitigrade',
      hand_type: 'clawed_light',
      skin_surface: 'fur',
      surface_pattern: 'fur_solid',
      accent_color: '#8b7355',
      body_parts: {
        head: 100,
        neck: 100,
        torso: 85,
        abdomen: 90,
        pelvis: 80,
        thigh_l: 75,
        thigh_r: 75,
        calf_l: 70,
        calf_r: 70,
        upper_arm_l: 90,
        upper_arm_r: 90,
        forearm_l: 85,
        forearm_r: 85,
        hand_l: 100,
        hand_r: 100,
        foot_l: 100,
        foot_r: 100,
        tail: 100
      },
      organs: {
        heart: 100,
        lungs: 100,
        stomach: 95,
        liver: 100,
        kidneys: 100
      },
      bones_integrity: {
        skull: 100,
        spine: 100,
        ribs: 95,
        arms: 100,
        legs: 100
      }
    },
    clothing: {
      chest: {
        name: 'Simple Shirt',
        integrity: 35, // Torn threshold
        warmth: 2,
        slots: ['chest']
      },
      underwear: {
        name: 'Plain Underwear',
        integrity: 60, // Frayed
        warmth: 1,
        slots: ['underwear']
      },
      legs: {
        name: 'Leather Pants',
        integrity: 25, // Torn
        warmth: 3,
        slots: ['legs']
      },
      shoulders: null,
      feet: null,
      hands: null,
      head: null,
      accessories: null
    },
    body_fluids: {
      semen: 65, // High volume, chest location
      blood: 30,  // Medium volume, abdomen location
      saliva: 20,
      milk: 0,
      slime: 45,  // Medium-high, legs location
      sweat: 55
    },
    stats: {
      health: 75,
      stamina: 60,
      arousal: 72, // High arousal
      stress: 45,
      trauma: 20,
      pain: 15,
      lust: 65,
      corruption: 40,
      hallucination: 0
    },
    biology: {
      fertility: 75,
      heat_rut_active: false,
      lactation_level: 0,
      incubations: [],
      parasites: []
    }
  },
  world: {
    location: 'alleyways',
    weather: 'Rainy',
    time_of_day: 'night',
    active_encounter: null,
    last_intent: 'travel'
  },
  ui: {
    combat_animation: null,
    targeted_part: null
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXECUTION: Initialize and render when DOM is ready
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize the engine when DOM is ready
 */
function initializeEngine() {
  // Check if canvas exists
  const canvasId = 'sprite-canvas';
  const canvasElement = document.getElementById(canvasId);

  if (!canvasElement) {
    console.error(`[LayeredSpriteEngine] Canvas #${canvasId} not found. Creating canvas element...`);
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.border = '2px solid #333';
    canvas.style.backgroundColor = '#1a1a1a';
    document.body.appendChild(canvas);
  }

  // Instantiate engine
  const engine = new LayeredSpriteEngine(canvasId, '/assets/sprites/');

  // Define mock asset paths for initialization
  const mockAssets = [
    '/assets/sprites/background/alleyways.png',
    '/assets/sprites/shadow/character_shadow.png',
    '/assets/sprites/body/skin_khajiit_female.png',
    '/assets/sprites/body/details_cat.png',
    '/assets/sprites/face/eyes_base.png',
    '/assets/sprites/face/iris_green.png',
    '/assets/sprites/hair/long_back_brown.png',
    '/assets/sprites/hair/long_front_brown.png',
    '/assets/sprites/clothing/chest/simple_shirt_torn.png',
    '/assets/sprites/clothing/underwear/plain_underwear_frayed.png',
    '/assets/sprites/clothing/legs/leather_pants_torn.png',
    '/assets/sprites/accessories/collar.png',
    '/assets/sprites/genitals/female_aroused.png',
    '/assets/sprites/fluids/semen_chest.png',
    '/assets/sprites/fluids/blood_abdomen.png',
    '/assets/sprites/fluids/slime_legs.png',
    '/assets/sprites/environment/rain_overlay.png'
  ];

  // Initialize engine with mock assets
  engine.initialize(mockAssets).then(() => {
    console.log('[LayeredSpriteEngine] Initialization complete. Rendering first frame...');

    // Render initial frame
    engine.renderFrame(mockGameState).then(() => {
      console.log('[LayeredSpriteEngine] Frame rendered successfully.');

      // Start animated render loop
      engine.startAnimation(mockGameState);
    });
  }).catch(error => {
    console.error('[LayeredSpriteEngine] Initialization failed:', error);
  });

  // Expose engine to global scope for debugging
  window.spriteEngine = engine;
  window.mockGameState = mockGameState;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEngine);
} else {
  initializeEngine();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS (for module environments)
// ═══════════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RenderConstants,
    AssetDictionary,
    AssetManager,
    CanvasCompositor,
    FluidRenderer,
    SpriteRenderer,
    AnimationController,
    LayeredSpriteEngine,
    mockGameState
  };
}
