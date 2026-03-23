import { Anatomy } from './types';

export const STABLE_API = "https://stablehorde.net/api/v2";
export const DEFAULT_API_KEY = "0000000000";

export const AGE_APPEARANCE: Record<number, string> = {
  18: "Young, fresh-faced",
  20: "Youthful",
  25: "Mature",
  30: "Experienced",
  40: "Weathered",
  50: "Aged",
  60: "Elderly"
};

export const PREDEFINED_ANATOMIES: Record<string, Anatomy> = {
  average: {
    height: 'average',
    build: 'average',
    metabolism: 'average',
    healer: 'average',
    sleep: 'average',
    gut: 'average',
    bones: 'average',
    flexibility: 'average',
    blood: 'average',
    vision: 'average',
    skin: 'fair',
    pheromones: 'neutral',
    visage: 'average',
    temp_pref: 'average',
    injuries: [],
    organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 },
    bones_integrity: { skull: 100, spine: 100, ribs: 100, arms: 100, legs: 100 }
  },
  thug: {
    height: 'tall',
    build: 'muscular',
    metabolism: 'fast',
    healer: 'fast',
    sleep: 'average',
    gut: 'average',
    bones: 'dense',
    flexibility: 'average',
    blood: 'average',
    vision: 'average',
    skin: 'tanned',
    pheromones: 'musky',
    visage: 'rough',
    temp_pref: 'average',
    injuries: [],
    organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 },
    bones_integrity: { skull: 100, spine: 100, ribs: 100, arms: 100, legs: 100 }
  },
  tentacle_creature: {
    height: 'short',
    build: 'slimy',
    metabolism: 'slow',
    healer: 'very fast',
    sleep: 'none',
    gut: 'acidic',
    bones: 'none',
    flexibility: 'extreme',
    blood: 'viscous',
    vision: 'poor',
    skin: 'slimy',
    pheromones: 'pungent',
    visage: 'alien',
    temp_pref: 'cold',
    injuries: [],
    organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 },
    bones_integrity: { skull: 0, spine: 0, ribs: 0, arms: 0, legs: 0 }
  },
  noble: {
    height: 'average',
    build: 'slender',
    metabolism: 'average',
    healer: 'average',
    sleep: 'average',
    gut: 'sensitive',
    bones: 'fragile',
    flexibility: 'average',
    blood: 'noble',
    vision: 'average',
    skin: 'pale',
    pheromones: 'sweet',
    visage: 'refined',
    temp_pref: 'warm',
    injuries: [],
    organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 },
    bones_integrity: { skull: 100, spine: 100, ribs: 100, arms: 100, legs: 100 }
  },
  feral_dog: {
    height: 'short',
    build: 'lean',
    metabolism: 'fast',
    healer: 'fast',
    sleep: 'light',
    gut: 'robust',
    bones: 'sturdy',
    flexibility: 'high',
    blood: 'average',
    vision: 'sharp',
    skin: 'furry',
    pheromones: 'animalistic',
    visage: 'canine',
    temp_pref: 'cold',
    injuries: [],
    organs: { heart: 100, lungs: 100, stomach: 100, liver: 100, kidneys: 100 },
    bones_integrity: { skull: 100, spine: 100, ribs: 100, arms: 100, legs: 100 }
  }
};
