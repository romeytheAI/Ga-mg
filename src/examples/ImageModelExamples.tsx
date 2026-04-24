/**
 * DOL Image Model Usage Example
 * 
 * Shows how to use the SVG and GIF model components with DOL assets.
 */

import React, { useState } from 'react';
import { 
  ImageSVGModel,
  ImageGIFModel,
  SVGModelConfig 
} from '../components/sprite/imageModels';

// Example 1: Basic SVG Model with DOL images
export const ExampleSVGModel: React.FC = () => {
  const config: Partial<SVGModelConfig> = {
    skinTone: '#e8c4b8',
    isFemale: true,
    breastSize: 'medium',
    hairStyle: 'straight',
    hairColor: '#4a3728',
    hairLength: 'medium',
    eyeExpression: 'neutral',
    mouthExpression: 'smile',
    upperClothing: 'shirt_buttondown',
    lowerClothing: 'skirt_short',
  };

  return (
    <ImageSVGModel
      config={config}
      width={300}
      height={500}
      useImages={true}  // Use DOL PNG images
      imageFormat="png"
    />
  );
};

// Example 2: SVG Model with transformations
export const ExampleTransformedModel: React.FC = () => {
  const config: Partial<SVGModelConfig> = {
    skinTone: '#d4a5a5',
    isFemale: true,
    breastSize: 'large',
    hairStyle: 'wavy',
    hairColor: '#8b0000',
    hairLength: 'long',
    eyeExpression: 'half_closed',
    mouthExpression: 'tongue',
    blushLevel: 'medium',
    hasDemonHorns: true,
    hasDemonWings: true,
    hasDemonTail: true,
    upperClothing: 'top_tank',
    lowerClothing: 'shorts',
  };

  return (
    <ImageSVGModel
      config={config}
      width={300}
      height={500}
      useImages={true}
      imageFormat="png"
    />
  );
};

// Example 3: Animated GIF Model
export const ExampleGIFModel: React.FC = () => {
  const config: Partial<SVGModelConfig> = {
    skinTone: '#f5d5c5',
    isFemale: true,
    breastSize: 'medium',
    hairStyle: 'ponytail',
    hairColor: '#2d1b0e',
    hairLength: 'long',
    eyeExpression: 'happy',
    mouthExpression: 'smile',
    hasCatEars: true,
    hasCatTail: true,
    hasTears: false,
    upperClothing: 'sweater',
    lowerClothing: 'skirt_short',
  };

  return (
    <ImageGIFModel
      config={config}
      width={300}
      height={500}
      animationSpeed={100}
    />
  );
};

// Example 4: Pure SVG (no DOL images)
export const ExamplePureSVGModel: React.FC = () => {
  const config: Partial<SVGModelConfig> = {
    skinTone: '#c4a88c',
    isMale: true,
    penisSize: 'medium',
    hairStyle: 'short',
    hairColor: '#1a1a1a',
    hairLength: 'short',
    eyeExpression: 'angry',
    mouthExpression: 'frown',
    upperClothing: undefined,  // Shirtless
    lowerClothing: 'pants_jeans',
  };

  return (
    <ImageSVGModel
      config={config}
      width={300}
      height={500}
      useImages={false}  // Pure SVG, no DOL images
    />
  );
};

// Example 5: Model with pregnancy
export const ExamplePregnantModel: React.FC = () => {
  const config: Partial<SVGModelConfig> = {
    skinTone: '#e8c4b8',
    isFemale: true,
    breastSize: 'large',
    pregnancyStage: 3,
    hairStyle: 'braid',
    hairColor: '#6b4423',
    hairLength: 'long',
    eyeExpression: 'neutral',
    mouthExpression: 'neutral',
    blushLevel: 'light',
    upperClothing: 'dress_school',
    lowerClothing: undefined,  // Dress covers lower
  };

  return (
    <ImageSVGModel
      config={config}
      width={300}
      height={500}
      useImages={true}
    />
  );
};

// Example 6: Interactive model selector
export const ExampleInteractiveModel: React.FC = () => {
  const [useGIF, setUseGIF] = useState(false);
  const [hasWings, setHasWings] = useState(false);
  const [hasTail, setHasTail] = useState(false);

  const config: Partial<SVGModelConfig> = {
    skinTone: '#e8c4b8',
    isFemale: true,
    breastSize: 'medium',
    hairStyle: 'straight',
    hairColor: '#4a3728',
    hairLength: 'medium',
    eyeExpression: 'neutral',
    mouthExpression: 'smile',
    hasAngelWings: hasWings,
    hasCatTail: hasTail,
    upperClothing: 'shirt_tshirt',
    lowerClothing: 'pants_jeans',
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input 
            type="checkbox" 
            checked={useGIF} 
            onChange={(e) => setUseGIF(e.target.checked)} 
          />
          Use Animated GIF Model
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input 
            type="checkbox" 
            checked={hasWings} 
            onChange={(e) => setHasWings(e.target.checked)} 
          />
          Angel Wings
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input 
            type="checkbox" 
            checked={hasTail} 
            onChange={(e) => setHasTail(e.target.checked)} 
          />
          Cat Tail
        </label>
      </div>

      {useGIF ? (
        <ImageGIFModel config={config} width={300} height={500} />
      ) : (
        <ImageSVGModel config={config} width={300} height={500} useImages={true} />
      )}
    </div>
  );
};

export default ExampleSVGModel;
