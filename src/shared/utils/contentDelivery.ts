import { GameState } from '../../core/types';
import { TIME_OF_DAY_DESCRIPTIONS, WEATHER_DESCRIPTIONS, TRAVEL_NARRATIVES, IDLE_FLAVOR_TEXT, STAT_REACTIVE_FLAVOR, DREAM_SEQUENCES, RUMOR_MILL, LOADING_SCREEN_TIPS } from '../../features/simulation/systems/ambientNarrative';
import { ES_ENCOUNTER_VARIANTS, ES_ENCOUNTERS_EXPANDED } from '../../features/simulation/systems/esEncountersExpanded';
import { NPC_REACTION_VARIANTS } from '../../features/simulation/systems/npcReactionVariants';
import { QUEST_NARRATIVES } from '../../features/simulation/systems/questNarratives';
import { ES_NPCS_EXPANDED } from '../../features/simulation/systems/esNPCsExpanded';
import { ES_LOCATIONS_EXPANDED } from '../../features/simulation/systems/esLocationsExpanded';

export interface ContentDeliveryState {
  seen_ambient: string[];
  seen_encounters: Record<string, number>;
  seen_reactions: Record<string, string[]>;
  seen_dreams: number[];
  seen_rumors: number[];
  cycle_count: number;
}

const defaultState: ContentDeliveryState = {
  seen_ambient: [],
  seen_encounters: {},
  seen_reactions: {},
  seen_dreams: [],
  seen_rumors: [],
  cycle_count: 0
};

export class ContentPool<T> {
  private items: T[];
  private seen: Set<number> = new Set();
  private rng: () => number;

  constructor(items: T[], rng: () => number = Math.random) {
    this.items = items;
    this.rng = rng;
  }

  get(randomized: boolean = true): T | null {
    if (this.seen.size >= this.items.length) {
      this.seen.clear();
    }
    
    if (randomized) {
      const available = this.items
        .map((_, i) => i)
        .filter(i => !this.seen.has(i));
      
      if (available.length === 0) return null;
      
      const index = available[Math.floor(this.rng() * available.length)];
      this.seen.add(index);
      return this.items[index];
    }
    
    const index = Math.floor(this.rng() * this.items.length);
    return this.items[index];
  }

  reset() {
    this.seen.clear();
  }
}

export function getAmbientNarrative(
  location: string,
  time: string,
  state: ContentDeliveryState = defaultState,
  rng: () => number = Math.random
): string {
  const locationDesc = TIME_OF_DAY_DESCRIPTIONS[location] || TIME_OF_DAY_DESCRIPTIONS['default'];
  const texts = locationDesc[time as keyof typeof locationDesc] || Object.values(locationDesc)[0];
  
  const textArray = Array.isArray(texts) ? texts : texts ? [texts] : [];
  if (textArray.length === 0) return "The time passes.";
  
  const index = Math.floor(rng() * textArray.length);
  return textArray[index];
}

export function getWeatherDescription(
  weather: string,
  rng: () => number = Math.random
): string {
  const descriptions = WEATHER_DESCRIPTIONS[weather] || WEATHER_DESCRIPTIONS['Clear'];
  const index = Math.floor(rng() * descriptions.length);
  return descriptions[index];
}

export function getTravelNarrative(
  from: string,
  to: string,
  rng: () => number = Math.random
): string {
  const key = 'generic_road';
  const narratives = TRAVEL_NARRATIVES[key] || [];
  if (narratives.length === 0) return "You travel the road.";
  
  const index = Math.floor(rng() * narratives.length);
  return narratives[index];
}

export function getIdleFlavor(
  rng: () => number = Math.random
): string {
  const index = Math.floor(rng() * IDLE_FLAVOR_TEXT.length);
  return IDLE_FLAVOR_TEXT[index];
}

export function getStatReactiveFlavor(
  statCondition: string,
  rng: () => number = Math.random
): string {
  const flavors = STAT_REACTIVE_FLAVOR[statCondition] || STAT_REACTIVE_FLAVOR['low_health'];
  const index = Math.floor(rng() * flavors.length);
  return flavors[index];
}

export function getDreamSequence(
  state: ContentDeliveryState,
  rng: () => number = Math.random
): string {
  const available = DREAM_SEQUENCES.filter((_, i) => !state.seen_dreams.includes(i));
  if (available.length === 0) {
    state.seen_dreams = [];
    return getDreamSequence(state, rng);
  }
  
  const index = Math.floor(rng() * available.length);
  const actualIndex = DREAM_SEQUENCES.indexOf(available[index]);
  state.seen_dreams.push(actualIndex);
  
  return available[index];
}

export function getRumor(
  state: ContentDeliveryState,
  rng: () => number = Math.random
): string {
  const available = RUMOR_MILL.filter((_, i) => !state.seen_rumors.includes(i));
  if (available.length === 0) {
    state.seen_rumors = [];
    return getRumor(state, rng);
  }
  
  const index = Math.floor(rng() * available.length);
  const actualIndex = RUMOR_MILL.indexOf(available[index]);
  state.seen_rumors.push(actualIndex);
  
  return available[index];
}

export function getEncounterVariant(
  encounterId: string,
  state: ContentDeliveryState,
  rng: () => number = Math.random
): { outcome: string; stat_deltas: Record<string, number> } | null {
  const variants = ES_ENCOUNTER_VARIANTS[encounterId];
  if (!variants) return null;
  
  const seen = state.seen_encounters[encounterId] || 0;
  if (seen >= variants.length) {
    state.seen_encounters[encounterId] = 0;
  }
  
  const index = state.seen_encounters[encounterId] || 0;
  state.seen_encounters[encounterId] = index + 1;
  
  return variants[index] || null;
}

export function getNPCReaction(
  npcId: string,
  intent: string,
  relationshipTier: string,
  state: ContentDeliveryState,
  rng: () => number = Math.random
): { narrative_text: string; stat_deltas: Record<string, number> } | null {
  const npcReactions = NPC_REACTION_VARIANTS[npcId];
  if (!npcReactions) return null;
  
  const intentReactions = npcReactions[intent];
  if (!intentReactions) return null;
  
  const tierReactions = intentReactions[relationshipTier];
  if (!tierReactions || tierReactions.length === 0) return null;
  
  const index = Math.floor(rng() * tierReactions.length);
  return tierReactions[index];
}

export function getQuestNarrative(
  questId: string,
  step: string,
  variant: 'success''| 'fail''| 'kill''| 'pact''= 'success',
  rng: () => number = Math.random
): string {
  const quest = QUEST_NARRATIVES[questId];
  if (!quest) return "The quest continues...";
  
  const questStep = quest.steps?.find((s: any) => s.step === step);
  if (!questStep) return "The quest continues...";
  
  const narrativeKey = variant === 'fail''? 'fail_narrative'': 
                       variant === 'kill''? 'kill_narrative'':
                       variant === 'pact''? 'pact_narrative'': 'success_narrative';
  
  return (questStep as any)[narrativeKey] || questStep.narrative;
}

export function getLoadingScreenTip(
  rng: () => number = Math.random
): string {
  const index = Math.floor(rng() * LOADING_SCREEN_TIPS.length);
  return LOADING_SCREEN_TIPS[index];
}

export function getExpandedNPC(npcId: string) {
  return ES_NPCS_EXPANDED[npcId] || null;
}

export function getExpandedLocation(locationId: string) {
  return ES_LOCATIONS_EXPANDED[locationId] || null;
}

export function createContentDeliveryState(): ContentDeliveryState {
  return { ...defaultState };
}

export function serializeContentState(state: ContentDeliveryState): string {
  return JSON.stringify(state);
}

export function deserializeContentState(data: string): ContentDeliveryState {
  try {
    return JSON.parse(data);
  } catch {
    return defaultState;
  }
}