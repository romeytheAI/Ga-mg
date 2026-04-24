/**
 * DOLImageSVGModel - SVG Model Renderer using DOL Image Assets
 * 
 * Renders character models using SVG with optional DOL image overlays.
 * Provides both static SVG and animated GIF equivalents.
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  DOL_ASSET_BASE_URL,
  AssetLayer,
  AssetType,
  ImageFormat,
  getAssetUrl,
  getLayerById,
  DEFAULT_LAYER_ORDER,
  DOL_ASSET_REGISTRY,
} from '../../data/dolAssetMapping';
import { RacialBodyFeatures } from '../../data/races';

// Model configuration
export interface SVGModelConfig {
  // Body
  skinTone: string;
  skinSurface: 'skin' | 'scales' | 'fur';
  bodyType: 'slender' | 'average' | 'muscular' | 'curvy';
  height: 'short' | 'average' | 'tall';

  // Gender features
  isMale: boolean;
  isFemale: boolean;
  breastSize: 'none' | 'small' | 'medium' | 'large' | 'huge';
  penisSize: 'none' | 'small' | 'medium' | 'large' | 'huge';

  // Pregnancy
  pregnancyStage: number; // 0-4

  // Hair
  hairStyle: string;
  hairColor: string;
  hairLength: 'short' | 'medium' | 'long';

  // Face
  eyeColor: string;
  eyeExpression: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'closed' | 'half_closed' | 'heart';
  mouthExpression: 'neutral' | 'smile' | 'frown' | 'open' | 'tongue' | 'kiss' | 'gasp';
  blushLevel: 'none' | 'light' | 'medium' | 'heavy';

  // Clothing
  upperClothing?: string;
  lowerClothing?: string;
  underwearUpper?: string;
  underwearLower?: string;
  legwear?: string;
  footwear?: string;
  headwear?: string;
  neckwear?: string;
  facewear?: string;

  // Transformations
  hasCatEars: boolean;
  hasCatTail: boolean;
  hasWolfEars: boolean;
  hasWolfTail: boolean;
  hasDemonHorns: boolean;
  hasDemonWings: boolean;
  hasDemonTail: boolean;
  hasAngelWings: boolean;
  hasBirdWings: boolean;

  // Effects
  hasTears: boolean;
  hasSweat: boolean;
  bodyWriting: string[];

  // Race
  race: RacialBodyFeatures;
}

// Default configuration
export const DEFAULT_MODEL_CONFIG: SVGModelConfig = {
  skinTone: '#e8c4b8',
  skinSurface: 'skin',
  bodyType: 'average',
  height: 'average',
  isMale: false,
  isFemale: true,
  breastSize: 'medium',
  penisSize: 'none',
  pregnancyStage: 0,
  hairStyle: 'straight',
  hairColor: '#4a3728',
  hairLength: 'medium',
  eyeColor: '#4a6fa5',
  eyeExpression: 'neutral',
  mouthExpression: 'neutral',
  blushLevel: 'none',
  hasCatEars: false,
  hasCatTail: false,
  hasWolfEars: false,
  hasWolfTail: false,
  hasDemonHorns: false,
  hasDemonWings: false,
  hasDemonTail: false,
  hasAngelWings: false,
  hasBirdWings: false,
  hasTears: false,
  hasSweat: false,
  bodyWriting: [],
  race: {} as RacialBodyFeatures,
};

// Props for the renderer
export interface ImageSVGModelProps {
  config: Partial<SVGModelConfig>;
  width?: number;
  height?: number;
  useImages?: boolean; // If true, uses DOL PNG images; if false, uses pure SVG
  imageFormat?: ImageFormat;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Layer renderer component
const ModelLayer: React.FC<{
  layer: AssetLayer;
  variant: string;
  useImage: boolean;
  imageFormat: ImageFormat;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}> = ({ layer, variant, useImage, imageFormat, x, y, scale = 1, opacity = 1 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const assetUrl = useMemo(() => {
    if (!useImage) return null;
    return getAssetUrl(layer, variant, imageFormat);
  }, [layer, variant, useImage, imageFormat]);

  // SVG fallback content for each layer type
  const renderSVGFallback = () => {
    switch (layer.type) {
      case 'body_base':
        return (
          <ellipse cx={x} cy={y} rx={60 * scale} ry={100 * scale} fill="#e8c4b8" />
        );
      case 'body_breasts':
        return (
          <>
            <ellipse cx={x - 25 * scale} cy={y - 20 * scale} rx={20 * scale} ry={18 * scale} fill="#e8c4b8" />
            <ellipse cx={x + 25 * scale} cy={y - 20 * scale} rx={20 * scale} ry={18 * scale} fill="#e8c4b8" />
          </>
        );
      case 'hair_back':
        return (
          <path
            d={`M ${x - 50 * scale},${y - 80 * scale} Q ${x},${y - 120 * scale} ${x + 50 * scale},${y - 80 * scale} L ${x + 60 * scale},${y + 50 * scale} Q ${x},${y + 80 * scale} ${x - 60 * scale},${y + 50 * scale} Z`}
            fill="#4a3728"
          />
        );
      case 'face_base':
        return (
          <ellipse cx={x} cy={y} rx={45 * scale} ry={55 * scale} fill="#e8c4b8" />
        );
      case 'face_eyes':
        return (
          <>
            <ellipse cx={x - 18 * scale} cy={y - 5 * scale} rx={10 * scale} ry={8 * scale} fill="#fff" />
            <ellipse cx={x + 18 * scale} cy={y - 5 * scale} rx={10 * scale} ry={8 * scale} fill="#fff" />
            <circle cx={x - 18 * scale} cy={y - 5 * scale} r={5 * scale} fill="#4a6fa5" />
            <circle cx={x + 18 * scale} cy={y - 5 * scale} r={5 * scale} fill="#4a6fa5" />
          </>
        );
      case 'face_mouth':
        return (
          <path
            d={`M ${x - 12 * scale},${y + 25 * scale} Q ${x},${y + 32 * scale} ${x + 12 * scale},${y + 25 * scale}`}
            fill="none"
            stroke="#c4958a"
            strokeWidth={2 * scale}
            strokeLinecap="round"
          />
        );
      case 'clothes_upper':
        return (
          <path
            d={`M ${x - 55 * scale},${y - 40 * scale} L ${x + 55 * scale},${y - 40 * scale} L ${x + 50 * scale},${y + 60 * scale} L ${x - 50 * scale},${y + 60 * scale} Z`}
            fill="#5a7a9a"
          />
        );
      case 'clothes_lower':
        return (
          <path
            d={`M ${x - 50 * scale},${y} L ${x + 50 * scale},${y} L ${x + 45 * scale},${y + 100 * scale} L ${x - 45 * scale},${y + 100 * scale} Z`}
            fill="#4a5a7a"
          />
        );
      case 'transform_ears':
        return (
          <>
            <ellipse cx={x - 40 * scale} cy={y - 70 * scale} rx={12 * scale} ry={18 * scale} fill="#4a3728" />
            <ellipse cx={x + 40 * scale} cy={y - 70 * scale} rx={12 * scale} ry={18 * scale} fill="#4a3728" />
          </>
        );
      case 'transform_tail':
        return (
          <path
            d={`M ${x},${y + 80 * scale} Q ${x + 30 * scale},${y + 100 * scale} ${x + 40 * scale},${y + 130 * scale}`}
            fill="none"
            stroke="#4a3728"
            strokeWidth={8 * scale}
            strokeLinecap="round"
          />
        );
      case 'transform_wings':
        return (
          <>
            <path
              d={`M ${x - 30 * scale},${y - 30 * scale} Q ${x - 80 * scale},${y - 60 * scale} ${x - 100 * scale},${y - 20 * scale} Q ${x - 70 * scale},${y} ${x - 30 * scale},${y + 10 * scale}`}
              fill="#2a1a3a"
              opacity={0.8}
            />
            <path
              d={`M ${x + 30 * scale},${y - 30 * scale} Q ${x + 80 * scale},${y - 60 * scale} ${x + 100 * scale},${y - 20 * scale} Q ${x + 70 * scale},${y} ${x + 30 * scale},${y + 10 * scale}`}
              fill="#2a1a3a"
              opacity={0.8}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (!useImage || imageError || !assetUrl) {
    return <g opacity={opacity}>{renderSVGFallback()}</g>;
  }

  return (
    <g opacity={opacity}>
      <image
        href={assetUrl}
        x={x - 75 * scale}
        y={y - 100 * scale}
        width={150 * scale}
        height={200 * scale}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && renderSVGFallback()}
    </g>
  );
};

// Main SVG Model Component
export const ImageSVGModel: React.FC<ImageSVGModelProps> = ({
  config,
  width = 300,
  height = 500,
  useImages = true,
  imageFormat = 'png',
  className,
  style,
  onLoad,
  onError,
}) => {
  const fullConfig = useMemo(() => ({ ...DEFAULT_MODEL_CONFIG, ...config }), [config]);
  const [loadedLayers, setLoadedLayers] = useState<Set<string>>(new Set());

  const centerX = width / 2;
  const centerY = height / 2;

  // Build layer list based on config
  const activeLayers = useMemo(() => {
    const layers: { layer: AssetLayer; variant: string; zIndex: number }[] = [];

    // Body base
    const bodyBase = getLayerById('body_base');
    if (bodyBase) {
      layers.push({ layer: bodyBase, variant: 'default', zIndex: bodyBase.zIndex });
    }

    // Hair back
    if (fullConfig.hairLength !== 'short') {
      const hairBack = getLayerById('hair_back');
      if (hairBack) {
        layers.push({ layer: hairBack, variant: fullConfig.hairLength, zIndex: hairBack.zIndex });
      }
    }

    // Breasts (if female)
    if (fullConfig.isFemale && fullConfig.breastSize !== 'none') {
      const breasts = getLayerById('body_breasts');
      if (breasts) {
        layers.push({ layer: breasts, variant: fullConfig.breastSize, zIndex: breasts.zIndex });
      }
    }

    // Penis (if male)
    if (fullConfig.isMale && fullConfig.penisSize !== 'none') {
      const penis = getLayerById('body_penis');
      if (penis) {
        layers.push({ layer: penis, variant: fullConfig.penisSize, zIndex: penis.zIndex });
      }
    }

    // Pregnancy
    if (fullConfig.pregnancyStage > 0) {
      const pregnant = getLayerById('body_pregnant');
      if (pregnant) {
        layers.push({ layer: pregnant, variant: `stage${fullConfig.pregnancyStage}`, zIndex: pregnant.zIndex });
      }
    }

    // Underwear lower
    if (fullConfig.underwearLower) {
      const underwear = getLayerById(fullConfig.underwearLower);
      if (underwear) {
        layers.push({ layer: underwear, variant: 'default', zIndex: underwear.zIndex });
      }
    }

    // Underwear upper
    if (fullConfig.underwearUpper) {
      const underwear = getLayerById(fullConfig.underwearUpper);
      if (underwear) {
        layers.push({ layer: underwear, variant: 'default', zIndex: underwear.zIndex });
      }
    }

    // Lower clothing
    if (fullConfig.lowerClothing) {
      const clothing = getLayerById(fullConfig.lowerClothing);
      if (clothing) {
        layers.push({ layer: clothing, variant: 'default', zIndex: clothing.zIndex });
      }
    }

    // Legwear
    if (fullConfig.legwear) {
      const legwear = getLayerById(fullConfig.legwear);
      if (legwear) {
        layers.push({ layer: legwear, variant: 'default', zIndex: legwear.zIndex });
      }
    }

    // Footwear
    if (fullConfig.footwear) {
      const footwear = getLayerById(fullConfig.footwear);
      if (footwear) {
        layers.push({ layer: footwear, variant: 'default', zIndex: footwear.zIndex });
      }
    }

    // Upper clothing
    if (fullConfig.upperClothing) {
      const clothing = getLayerById(fullConfig.upperClothing);
      if (clothing) {
        layers.push({ layer: clothing, variant: 'default', zIndex: clothing.zIndex });
      }
    }

    // Face base
    const faceBase = getLayerById('face_base');
    if (faceBase) {
      layers.push({ layer: faceBase, variant: 'default', zIndex: faceBase.zIndex });
    }

    // Blush
    if (fullConfig.blushLevel !== 'none') {
      const blush = getLayerById('face_blush');
      if (blush) {
        layers.push({ layer: blush, variant: fullConfig.blushLevel, zIndex: blush.zIndex });
      }
    }

    // Eyes
    const eyes = getLayerById('face_eyes');
    if (eyes) {
      layers.push({ layer: eyes, variant: fullConfig.eyeExpression, zIndex: eyes.zIndex });
    }

    // Mouth
    const mouth = getLayerById('face_mouth');
    if (mouth) {
      layers.push({ layer: mouth, variant: fullConfig.mouthExpression, zIndex: mouth.zIndex });
    }

    // Hair sides
    const hairSides = getLayerById('hair_sides');
    if (hairSides) {
      layers.push({ layer: hairSides, variant: fullConfig.hairLength, zIndex: hairSides.zIndex });
    }

    // Hair fringe
    const hairFringe = getLayerById('hair_fringe');
    if (hairFringe) {
      layers.push({ layer: hairFringe, variant: 'default', zIndex: hairFringe.zIndex });
    }

    // Transformations
    if (fullConfig.hasCatEars) {
      const ears = getLayerById('transform_cat_ears');
      if (ears) layers.push({ layer: ears, variant: 'default', zIndex: ears.zIndex });
    }
    if (fullConfig.hasCatTail) {
      const tail = getLayerById('transform_cat_tail');
      if (tail) layers.push({ layer: tail, variant: 'idle', zIndex: tail.zIndex });
    }
    if (fullConfig.hasWolfEars) {
      const ears = getLayerById('transform_wolf_ears');
      if (ears) layers.push({ layer: ears, variant: 'default', zIndex: ears.zIndex });
    }
    if (fullConfig.hasWolfTail) {
      const tail = getLayerById('transform_wolf_tail');
      if (tail) layers.push({ layer: tail, variant: 'idle', zIndex: tail.zIndex });
    }
    if (fullConfig.hasDemonHorns) {
      const horns = getLayerById('transform_demon_horns');
      if (horns) layers.push({ layer: horns, variant: 'default', zIndex: horns.zIndex });
    }
    if (fullConfig.hasDemonWings) {
      const wings = getLayerById('transform_demon_wings');
      if (wings) layers.push({ layer: wings, variant: 'idle', zIndex: wings.zIndex });
    }
    if (fullConfig.hasDemonTail) {
      const tail = getLayerById('transform_demon_tail');
      if (tail) layers.push({ layer: tail, variant: 'idle', zIndex: tail.zIndex });
    }
    if (fullConfig.hasAngelWings) {
      const wings = getLayerById('transform_angel_wings');
      if (wings) layers.push({ layer: wings, variant: 'idle', zIndex: wings.zIndex });
    }
    if (fullConfig.hasBirdWings) {
      const wings = getLayerById('transform_bird_wings');
      if (wings) layers.push({ layer: wings, variant: 'idle', zIndex: wings.zIndex });
    }

    // Headwear
    if (fullConfig.headwear) {
      const headwear = getLayerById(fullConfig.headwear);
      if (headwear) {
        layers.push({ layer: headwear, variant: 'default', zIndex: headwear.zIndex });
      }
    }

    // Neckwear
    if (fullConfig.neckwear) {
      const neckwear = getLayerById(fullConfig.neckwear);
      if (neckwear) {
        layers.push({ layer: neckwear, variant: 'default', zIndex: neckwear.zIndex });
      }
    }

    // Facewear
    if (fullConfig.facewear) {
      const facewear = getLayerById(fullConfig.facewear);
      if (facewear) {
        layers.push({ layer: facewear, variant: 'default', zIndex: facewear.zIndex });
      }
    }

    // Effects
    if (fullConfig.hasTears) {
      const tears = getLayerById('fluid_tears');
      if (tears) layers.push({ layer: tears, variant: 'light', zIndex: tears.zIndex });
    }
    if (fullConfig.hasSweat) {
      const sweat = getLayerById('fluid_sweat');
      if (sweat) layers.push({ layer: sweat, variant: 'light', zIndex: sweat.zIndex });
    }

    // Sort by zIndex
    return layers.sort((a, b) => a.zIndex - b.zIndex);
  }, [fullConfig]);

  // Track loading
  useEffect(() => {
    if (loadedLayers.size === activeLayers.length && onLoad) {
      onLoad();
    }
  }, [loadedLayers, activeLayers.length, onLoad]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width={width} height={height} fill="transparent" />

      {/* Render layers */}
      {activeLayers.map(({ layer, variant }, index) => (
        <ModelLayer
          key={`${layer.id}-${index}`}
          layer={layer}
          variant={variant}
          useImage={useImages}
          imageFormat={imageFormat}
          x={centerX}
          y={centerY}
          scale={1}
        />
      ))}
    </svg>
  );
};

export default ImageSVGModel;
