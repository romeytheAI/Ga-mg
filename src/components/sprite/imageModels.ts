/**
 * DOL Image Model Components Index
 * 
 * Exports SVG and GIF model renderers that utilize DOL image assets.
 */

export { 
  ImageSVGModel,
  DEFAULT_MODEL_CONFIG,
  type SVGModelConfig,
  type ImageSVGModelProps
} from './ImageSVGModel';

export { 
  ImageGIFModel,
  type ImageGIFModelProps
} from './ImageGIFModel';

// Re-export asset mapping
export {
  DOL_ASSET_BASE_URL,
  LOCAL_SVG_PATH,
  DOL_ASSET_REGISTRY,
  DEFAULT_LAYER_ORDER,
  getAssetUrl,
  getLayersByType,
  getLayerById,
  getAnimatedLayers,
  type AssetType,
  type AssetLayer,
  type ImageFormat,
} from '../../data/dolAssetMapping';
