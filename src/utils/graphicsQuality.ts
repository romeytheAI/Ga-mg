/**
 * Graphics Quality Utilities
 *
 * Provides preset configurations and utilities for managing graphics quality
 * settings across the DoL-fidelity rendering pipeline.
 */

import { GraphicsQuality, GraphicsQualityPreset } from '../types';

// Re-export GraphicsQuality type for convenience
export type { GraphicsQuality } from '../types';

/**
 * Get graphics quality preset configuration
 */
export function getQualityPreset(preset: GraphicsQualityPreset): GraphicsQuality {
  const presets: Record<GraphicsQualityPreset, GraphicsQuality> = {
    low: {
      preset: 'low',
      sprite_quality: {
        subsurface_scattering: false,
        gradient_shading: true,
        muscle_detail_level: 0,
        fluid_effects: true,
        cosmetic_details: false,
        xray_overlay: false,
      },
      renderer_3d: {
        enabled: false,
        polygon_multiplier: 0.5,
        pbr_materials: false,
        normal_mapping: false,
        environment_mapping: false,
        shadow_quality: 0,
        antialiasing: 0,
        pixel_ratio: 0.75,
      },
      animation: {
        smooth_interpolation: false,
        target_fps: 30,
        particle_effects: false,
        physics_simulation: false,
      },
      performance: {
        lod_enabled: true,
        cache_size_mb: 50,
        dynamic_resolution: true,
        min_resolution_scale: 0.5,
      },
    },
    medium: {
      preset: 'medium',
      sprite_quality: {
        subsurface_scattering: true,
        gradient_shading: true,
        muscle_detail_level: 1,
        fluid_effects: true,
        cosmetic_details: true,
        xray_overlay: true,
      },
      renderer_3d: {
        enabled: true,
        polygon_multiplier: 1.0,
        pbr_materials: true,
        normal_mapping: false,
        environment_mapping: false,
        shadow_quality: 1,
        antialiasing: 2,
        pixel_ratio: 1.0,
      },
      animation: {
        smooth_interpolation: true,
        target_fps: 60,
        particle_effects: true,
        physics_simulation: false,
      },
      performance: {
        lod_enabled: true,
        cache_size_mb: 100,
        dynamic_resolution: true,
        min_resolution_scale: 0.75,
      },
    },
    high: {
      preset: 'high',
      sprite_quality: {
        subsurface_scattering: true,
        gradient_shading: true,
        muscle_detail_level: 2,
        fluid_effects: true,
        cosmetic_details: true,
        xray_overlay: true,
      },
      renderer_3d: {
        enabled: true,
        polygon_multiplier: 1.5,
        pbr_materials: true,
        normal_mapping: true,
        environment_mapping: true,
        shadow_quality: 2,
        antialiasing: 4,
        pixel_ratio: 1.0,
      },
      animation: {
        smooth_interpolation: true,
        target_fps: 60,
        particle_effects: true,
        physics_simulation: true,
      },
      performance: {
        lod_enabled: false,
        cache_size_mb: 200,
        dynamic_resolution: false,
        min_resolution_scale: 1.0,
      },
    },
    ultra: {
      preset: 'ultra',
      sprite_quality: {
        subsurface_scattering: true,
        gradient_shading: true,
        muscle_detail_level: 3,
        fluid_effects: true,
        cosmetic_details: true,
        xray_overlay: true,
      },
      renderer_3d: {
        enabled: true,
        polygon_multiplier: 2.0,
        pbr_materials: true,
        normal_mapping: true,
        environment_mapping: true,
        shadow_quality: 3,
        antialiasing: 8,
        pixel_ratio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1.0,
      },
      animation: {
        smooth_interpolation: true,
        target_fps: 60,
        particle_effects: true,
        physics_simulation: true,
      },
      performance: {
        lod_enabled: false,
        cache_size_mb: 500,
        dynamic_resolution: false,
        min_resolution_scale: 1.0,
      },
    },
  };

  return presets[preset];
}

/**
 * Get default graphics quality based on device capabilities
 */
export function getDefaultGraphicsQuality(): GraphicsQuality {
  // Handle SSR/test environments where window/navigator might not exist
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return getQualityPreset('medium');
  }

  // Auto-detect optimal preset based on device
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const hasHighDPI = window.devicePixelRatio > 1.5;

  if (isMobile || isLowEnd) {
    return getQualityPreset('low');
  } else if (hasHighDPI) {
    return getQualityPreset('high');
  } else {
    return getQualityPreset('medium');
  }
}

/**
 * Apply graphics quality settings to sprite rendering
 */
export function applyGraphicsQualityToSprite(quality: GraphicsQuality, spriteProps: any): any {
  return {
    ...spriteProps,
    enableSSS: quality.sprite_quality.subsurface_scattering,
    enableGradients: quality.sprite_quality.gradient_shading,
    muscleDetailLevel: quality.sprite_quality.muscle_detail_level,
    enableFluids: quality.sprite_quality.fluid_effects,
    enableCosmetics: quality.sprite_quality.cosmetic_details,
  };
}

/**
 * Get polygon count multiplier for 3D meshes based on quality
 */
export function getPolygonMultiplier(quality: GraphicsQuality): number {
  return quality.renderer_3d.polygon_multiplier;
}

/**
 * Get texture resolution multiplier based on quality
 */
export function getTextureResolutionMultiplier(quality: GraphicsQuality): number {
  return quality.renderer_3d.pixel_ratio;
}

/**
 * Check if feature is enabled based on quality settings
 */
export function isFeatureEnabled(quality: GraphicsQuality, feature: string): boolean {
  switch (feature) {
    case 'subsurface_scattering':
      return quality.sprite_quality.subsurface_scattering;
    case 'pbr_materials':
      return quality.renderer_3d.pbr_materials;
    case 'normal_mapping':
      return quality.renderer_3d.normal_mapping;
    case 'environment_mapping':
      return quality.renderer_3d.environment_mapping;
    case 'particle_effects':
      return quality.animation.particle_effects;
    case 'physics_simulation':
      return quality.animation.physics_simulation;
    case 'lod':
      return quality.performance.lod_enabled;
    case 'dynamic_resolution':
      return quality.performance.dynamic_resolution;
    case '3d_rendering':
      return quality.renderer_3d.enabled;
    default:
      return false;
  }
}

/**
 * Get optimal cache size in bytes
 */
export function getCacheSizeBytes(quality: GraphicsQuality): number {
  return quality.performance.cache_size_mb * 1024 * 1024;
}

/**
 * Get shadow map size based on quality
 */
export function getShadowMapSize(quality: GraphicsQuality): number {
  const sizes = [0, 512, 1024, 2048];
  return sizes[quality.renderer_3d.shadow_quality];
}

/**
 * Get mesh segment counts based on quality (for svgToGltf)
 */
export function getMeshSegmentCounts(quality: GraphicsQuality): {
  high: number;
  medium: number;
  low: number;
  ringHigh: number;
  ringMed: number;
} {
  const multiplier = quality.renderer_3d.polygon_multiplier;
  return {
    high: Math.round(32 * multiplier),
    medium: Math.round(24 * multiplier),
    low: Math.round(16 * multiplier),
    ringHigh: Math.round(24 * multiplier),
    ringMed: Math.round(12 * multiplier),
  };
}

/**
 * Performance monitoring: detect if graphics quality should be reduced
 */
export class PerformanceMonitor {
  private frameTimes: number[] = [];
  private lastFrameTime: number = performance.now();
  private readonly SAMPLE_SIZE = 60;
  private readonly TARGET_FPS = 60;
  private readonly MIN_FPS_THRESHOLD = 30;

  recordFrame(): void {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameTimes.push(delta);
    if (this.frameTimes.length > this.SAMPLE_SIZE) {
      this.frameTimes.shift();
    }
  }

  getAverageFPS(): number {
    if (this.frameTimes.length === 0) return this.TARGET_FPS;
    const avgDelta = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return 1000 / avgDelta;
  }

  shouldReduceQuality(): boolean {
    return this.getAverageFPS() < this.MIN_FPS_THRESHOLD;
  }

  shouldIncreaseQuality(): boolean {
    return this.getAverageFPS() > this.TARGET_FPS * 0.95;
  }

  reset(): void {
    this.frameTimes = [];
    this.lastFrameTime = performance.now();
  }
}

/**
 * Auto-adjust graphics quality based on performance
 */
export function autoAdjustQuality(
  current: GraphicsQuality,
  monitor: PerformanceMonitor
): GraphicsQuality | null {
  if (!current.performance.dynamic_resolution) {
    return null;
  }

  if (monitor.shouldReduceQuality()) {
    // Reduce quality step by step
    if (current.renderer_3d.pixel_ratio > current.performance.min_resolution_scale) {
      return {
        ...current,
        renderer_3d: {
          ...current.renderer_3d,
          pixel_ratio: Math.max(
            current.performance.min_resolution_scale,
            current.renderer_3d.pixel_ratio * 0.9
          ),
        },
      };
    }
  } else if (monitor.shouldIncreaseQuality()) {
    // Increase quality gradually
    const maxPixelRatio = current.preset === 'ultra' ? 2.0 : 1.0;
    if (current.renderer_3d.pixel_ratio < maxPixelRatio) {
      return {
        ...current,
        renderer_3d: {
          ...current.renderer_3d,
          pixel_ratio: Math.min(
            maxPixelRatio,
            current.renderer_3d.pixel_ratio * 1.05
          ),
        },
      };
    }
  }

  return null;
}
