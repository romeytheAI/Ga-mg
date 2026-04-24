/**
 * DOLImageGIFModel - GIF Animated Model Renderer using DOL Assets
 * 
 * Renders animated character models using GIF images from DOL assets.
 * Falls back to animated SVG when GIFs are not available.
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  getAssetUrl,
  getLayerById,
  getAnimatedLayers,
  AssetLayer,
  ImageFormat,
} from '../../data/dolAssetMapping';
import { SVGModelConfig, DEFAULT_MODEL_CONFIG } from './ImageSVGModel';

// GIF Model props
export interface ImageGIFModelProps {
  config: Partial<SVGModelConfig>;
  width?: number;
  height?: number;
  animationSpeed?: number; // ms per frame
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Animation state for a layer
type AnimationState = 'idle' | 'breathing' | 'blinking' | 'tail_wag' | 'wing_flap';

interface AnimatedLayerState {
  layer: AssetLayer;
  currentFrame: number;
  totalFrames: number;
  state: AnimationState;
  lastUpdate: number;
}

// GIF Layer component
const GIFLayer: React.FC<{
  layer: AssetLayer;
  variant: string;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  isAnimating?: boolean;
  animationState?: AnimationState;
}> = ({ layer, variant, x, y, scale = 1, opacity = 1, isAnimating = true, animationState = 'idle' }) => {
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>(0);

  // Get GIF URL
  const gifUrl = useMemo(() => {
    if (!layer.gifPath) return null;
    return getAssetUrl(layer, variant, 'gif');
  }, [layer, variant]);

  // Animation loop for SVG fallback
  useEffect(() => {
    if (gifLoaded || !isAnimating) return;

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Different animation speeds for different states
      const frameDelay = animationState === 'breathing' ? 60 :
                        animationState === 'blinking' ? 100 :
                        animationState === 'tail_wag' ? 80 :
                        animationState === 'wing_flap' ? 50 : 120;

      if (frameCount % Math.floor(frameDelay / 16) === 0) {
        setCurrentFrame(prev => (prev + 1) % 8);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gifLoaded, isAnimating, animationState]);

  // Render animated SVG fallback
  const renderAnimatedSVGFallback = () => {
    const breathOffset = animationState === 'breathing' ? Math.sin(currentFrame * 0.5) * 2 : 0;
    const blinkScale = animationState === 'blinking' && currentFrame < 2 ? 0.1 : 1;
    const tailWag = animationState === 'tail_wag' ? Math.sin(currentFrame * 0.8) * 15 : 0;
    const wingFlap = animationState === 'wing_flap' ? Math.sin(currentFrame * 1.2) * 20 : 0;

    switch (layer.type) {
      case 'body_breasts':
        return (
          <g transform={`translate(0, ${breathOffset})`}>
            <ellipse cx={x - 25 * scale} cy={y - 20 * scale} rx={20 * scale} ry={18 * scale} fill="#e8c4b8" />
            <ellipse cx={x + 25 * scale} cy={y - 20 * scale} rx={20 * scale} ry={18 * scale} fill="#e8c4b8" />
          </g>
        );

      case 'face_eyes':
        return (
          <>
            <ellipse 
              cx={x - 18 * scale} 
              cy={y - 5 * scale} 
              rx={10 * scale} 
              ry={8 * scale * blinkScale} 
              fill="#fff" 
            />
            <ellipse 
              cx={x + 18 * scale} 
              cy={y - 5 * scale} 
              rx={10 * scale} 
              ry={8 * scale * blinkScale} 
              fill="#fff" 
            />
            <circle cx={x - 18 * scale} cy={y - 5 * scale} r={5 * scale} fill="#4a6fa5" />
            <circle cx={x + 18 * scale} cy={y - 5 * scale} r={5 * scale} fill="#4a6fa5" />
          </>
        );

      case 'transform_tail':
        return (
          <g transform={`rotate(${tailWag}, ${x}, ${y + 80 * scale})`}>
            <path
              d={`M ${x},${y + 80 * scale} Q ${x + 30 * scale},${y + 100 * scale} ${x + 40 * scale},${y + 130 * scale}`}
              fill="none"
              stroke="#4a3728"
              strokeWidth={8 * scale}
              strokeLinecap="round"
            />
          </g>
        );

      case 'transform_wings':
        return (
          <g transform={`rotate(${wingFlap}, ${x}, ${y - 30 * scale})`}>
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
          </g>
        );

      case 'hair_back':
        return (
          <g transform={`translate(0, ${breathOffset * 0.5})`}>
            <path
              d={`M ${x - 50 * scale},${y - 80 * scale} Q ${x},${y - 120 * scale} ${x + 50 * scale},${y - 80 * scale} L ${x + 60 * scale},${y + 50 * scale} Q ${x},${y + 80 * scale} ${x - 60 * scale},${y + 50 * scale} Z`}
              fill="#4a3728"
            />
          </g>
        );

      case 'fluid_tears':
        return (
          <>
            <ellipse 
              cx={x - 18 * scale} 
              cy={y + 5 * scale + (currentFrame * 3)} 
              rx={2 * scale} 
              ry={3 * scale} 
              fill="#8ecae6"
              opacity={currentFrame < 6 ? 1 : 0}
            />
            <ellipse 
              cx={x + 18 * scale} 
              cy={y + 5 * scale + (currentFrame * 3)} 
              rx={2 * scale} 
              ry={3 * scale} 
              fill="#8ecae6"
              opacity={currentFrame < 6 ? 1 : 0}
            />
          </>
        );

      default:
        // Static fallback for non-animated layers
        return null;
    }
  };

  if (!gifUrl || gifError) {
    return (
      <g opacity={opacity}>
        {renderAnimatedSVGFallback()}
      </g>
    );
  }

  return (
    <g opacity={opacity}>
      <image
        href={gifUrl}
        x={x - 75 * scale}
        y={y - 100 * scale}
        width={150 * scale}
        height={200 * scale}
        onLoad={() => setGifLoaded(true)}
        onError={() => setGifError(true)}
      />
    </g>
  );
};

// Main GIF Model Component
export const ImageGIFModel: React.FC<ImageGIFModelProps> = ({
  config,
  width = 300,
  height = 500,
  animationSpeed = 100,
  className,
  style,
  onLoad,
  onError,
}) => {
  const fullConfig = useMemo(() => ({ ...DEFAULT_MODEL_CONFIG, ...config }), [config]);
  const [globalFrame, setGlobalFrame] = useState(0);
  const [loadedGifs, setLoadedGifs] = useState<Set<string>>(new Set());
  const animationRef = useRef<number>(0);

  const centerX = width / 2;
  const centerY = height / 2;

  // Global animation loop
  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > animationSpeed) {
        setGlobalFrame(prev => (prev + 1) % 60);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationSpeed]);

  // Build animated layer list
  const animatedLayers = useMemo(() => {
    const layers: { 
      layer: AssetLayer; 
      variant: string; 
      zIndex: number;
      animationState: AnimationState;
    }[] = [];

    // Breathing animation for body parts
    const bodyBase = getLayerById('body_base');
    if (bodyBase) {
      layers.push({ 
        layer: bodyBase, 
        variant: 'default', 
        zIndex: bodyBase.zIndex,
        animationState: 'breathing'
      });
    }

    // Animated hair
    const hairBack = getLayerById('hair_back');
    if (hairBack && fullConfig.hairLength !== 'short') {
      layers.push({ 
        layer: hairBack, 
        variant: fullConfig.hairLength, 
        zIndex: hairBack.zIndex,
        animationState: 'breathing'
      });
    }

    // Animated breasts (breathing)
    if (fullConfig.isFemale && fullConfig.breastSize !== 'none') {
      const breasts = getLayerById('body_breasts');
      if (breasts) {
        layers.push({ 
          layer: breasts, 
          variant: fullConfig.breastSize, 
          zIndex: breasts.zIndex,
          animationState: 'breathing'
        });
      }
    }

    // Blinking eyes
    const eyes = getLayerById('face_eyes');
    if (eyes) {
      layers.push({ 
        layer: eyes, 
        variant: fullConfig.eyeExpression, 
        zIndex: eyes.zIndex,
        animationState: 'blinking'
      });
    }

    // Animated tails
    if (fullConfig.hasCatTail) {
      const tail = getLayerById('transform_cat_tail');
      if (tail) {
        layers.push({ 
          layer: tail, 
          variant: 'idle', 
          zIndex: tail.zIndex,
          animationState: 'tail_wag'
        });
      }
    }
    if (fullConfig.hasWolfTail) {
      const tail = getLayerById('transform_wolf_tail');
      if (tail) {
        layers.push({ 
          layer: tail, 
          variant: 'idle', 
          zIndex: tail.zIndex,
          animationState: 'tail_wag'
        });
      }
    }
    if (fullConfig.hasDemonTail) {
      const tail = getLayerById('transform_demon_tail');
      if (tail) {
        layers.push({ 
          layer: tail, 
          variant: 'idle', 
          zIndex: tail.zIndex,
          animationState: 'tail_wag'
        });
      }
    }

    // Animated wings
    if (fullConfig.hasDemonWings) {
      const wings = getLayerById('transform_demon_wings');
      if (wings) {
        layers.push({ 
          layer: wings, 
          variant: 'idle', 
          zIndex: wings.zIndex,
          animationState: 'wing_flap'
        });
      }
    }
    if (fullConfig.hasAngelWings) {
      const wings = getLayerById('transform_angel_wings');
      if (wings) {
        layers.push({ 
          layer: wings, 
          variant: 'idle', 
          zIndex: wings.zIndex,
          animationState: 'wing_flap'
        });
      }
    }
    if (fullConfig.hasBirdWings) {
      const wings = getLayerById('transform_bird_wings');
      if (wings) {
        layers.push({ 
          layer: wings, 
          variant: 'idle', 
          zIndex: wings.zIndex,
          animationState: 'wing_flap'
        });
      }
    }

    // Animated tears
    if (fullConfig.hasTears) {
      const tears = getLayerById('fluid_tears');
      if (tears) {
        layers.push({ 
          layer: tears, 
          variant: 'light', 
          zIndex: tears.zIndex,
          animationState: 'idle'
        });
      }
    }

    // Sort by zIndex
    return layers.sort((a, b) => a.zIndex - b.zIndex);
  }, [fullConfig]);

  // Static layers (non-animated)
  const staticLayers = useMemo(() => {
    const layers: { layer: AssetLayer; variant: string; zIndex: number }[] = [];

    // Add all non-animated layers from config
    // (This would include clothing, accessories, etc.)

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

    // Mouth
    const mouth = getLayerById('face_mouth');
    if (mouth) {
      layers.push({ layer: mouth, variant: fullConfig.mouthExpression, zIndex: mouth.zIndex });
    }

    // Sort by zIndex
    return layers.sort((a, b) => a.zIndex - b.zIndex);
  }, [fullConfig]);

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

      {/* Render static layers first */}
      {staticLayers.map(({ layer, variant }, index) => (
        <GIFLayer
          key={`static-${layer.id}-${index}`}
          layer={layer}
          variant={variant}
          x={centerX}
          y={centerY}
          scale={1}
          isAnimating={false}
        />
      ))}

      {/* Render animated layers */}
      {animatedLayers.map(({ layer, variant, animationState }, index) => (
        <GIFLayer
          key={`animated-${layer.id}-${index}`}
          layer={layer}
          variant={variant}
          x={centerX}
          y={centerY}
          scale={1}
          isAnimating={true}
          animationState={animationState}
        />
      ))}
    </svg>
  );
};

export default ImageGIFModel;
