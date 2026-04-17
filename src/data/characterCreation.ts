/**
 * Character Creation System
 * Ties together race, anatomy, gender, and dialogue for character creation/preview.
 */

import { ELDER_SCROLLS_RACES, resolveRace } from './races';
import { getGenderAnatomy, getBodyTypeModifiers, buildSpriteConfig, BodyTypeVariant } from './anatomy';
import { GENDER_VARIANTS } from './dialogue/genderVariants';
import { NPCS, NPC, resolveNPCDialogue } from './npcs';

export type Gender = 'male' | 'female';

export interface CharacterCreationState {
  race: string;
  gender: Gender;
  bodyType: BodyTypeVariant;
  faction?: string;
  name?: string;
}

/** Flat UI option for the race picker */
export interface RaceOption {
  id: string;
  name: string;
  description: string;
  skinSwatches: string[];
  eyeSwatches: string[];
  hasHair: boolean;
  specialFeatures: string[];
}

// ──────────────────────────────────────────────────────────────
//  Option arrays
// ──────────────────────────────────────────────────────────────

export const RACE_OPTIONS: RaceOption[] = Object.entries(ELDER_SCROLLS_RACES).map(([id, r]) => ({
  id,
  name: r.name,
  description: r.lore_tag,
  skinSwatches: r.skin_colors.slice(0, 4),
  eyeSwatches: r.eye_colors.slice(0, 4),
  hasHair: r.hair_colors !== null,
  specialFeatures: r.special_features,
}));

export const GENDER_OPTIONS: { id: Gender; label: string; description: string }[] = [
  { id: 'male', label: 'Male', description: 'Masculine frame with race-specific proportions' },
  { id: 'female', label: 'Female', description: 'Feminine frame with race-specific proportions' },
];

export const BODY_TYPE_OPTIONS: { id: BodyTypeVariant; label: string; description: string }[] = [
  { id: 'slim', label: 'Slim', description: 'Light, narrow frame with lean proportions' },
  { id: 'average', label: 'Average', description: 'Balanced, mid-range proportions' },
  { id: 'athletic', label: 'Athletic', description: 'Toned shoulders, defined musculature' },
  { id: 'stocky', label: 'Stocky', description: 'Broad, thick-set build' },
  { id: 'curvy', label: 'Curvy', description: 'Pronounced waist-hip ratio, fuller figure' },
  { id: 'muscular', label: 'Muscular', description: 'Heavily muscled, powerful frame' },
];

// ──────────────────────────────────────────────────────────────
//  Faction-to-race affinity mapping
// ──────────────────────────────────────────────────────────────

const FACTION_RACES: Record<string, string[]> = {
  imperial_legion: ['Nord', 'Imperial', 'Redguard', 'Breton'],
  stormcloaks: ['Nord'],
  thieves_guild: ['Khajiit', 'Argonian', 'Bosmer', 'Imperial'],
  dark_brotherhood: ['Dunmer', 'Breton', 'Redguard', 'Altmer'],
  college_winterhold: ['Altmer', 'Breton', 'Dunmer', 'Imperial'],
  companions: ['Nord', 'Redguard', 'Orsimer', 'Imperial'],
  mages_guild: ['Altmer', 'Breton', 'Dunmer', 'Imperial'],
  fighters_guild: ['Redguard', 'Nord', 'Orsimer', 'Imperial'],
  aldmeri_dominion: ['Altmer', 'Bosmer'],
};

// ──────────────────────────────────────────────────────────────
//  Public API functions
// ──────────────────────────────────────────────────────────────

/** Build a full character preview object for the UI. */
export function buildCharacterPreview(state: CharacterCreationState) {
  const raceDef = resolveRace(state.race);
  const anatomy = getGenderAnatomy(state.race, state.gender);
  const spriteCfg = buildSpriteConfig(state.race, state.gender, state.bodyType);
  const bodyMods = getBodyTypeModifiers(state.bodyType);

  return {
    race: raceDef.name,
    gender: state.gender,
    bodyType: state.bodyType,
    anatomy,
    spriteConfig: spriteCfg,
    bodyModifiers: bodyMods,
    colorPalette: {
      skin: raceDef.skin_colors,
      hair: raceDef.hair_colors ?? [],
      eyes: raceDef.eye_colors,
    },
    visualFeatures: {
      hasHair: raceDef.hair_colors !== null,
      specialFeatures: raceDef.special_features,
      skinType: raceDef.skin_type,
      earType: raceDef.ear_type,
      hasTail: raceDef.has_tail,
      hasTusks: raceDef.has_tusks,
      hasMuzzle: raceDef.has_muzzle,
      legType: raceDef.leg_type,
    },
  };
}

/**
 * Resolve a dialogue line for a given NPC, with the player character's
 * gender tags substituted into the NPC's gender-aware profile.
 */
export function resolveDialogueForCharacter(
  character: CharacterCreationState,
  npcId: string,
  intent: string,
): { text: string; delivery?: string } | null {
  const npc = NPCS[npcId] as NPC | undefined;
  if (!npc) return null;

  // Use the character's gender as the "player gender" the NPC addresses
  const line = resolveNPCDialogue(npc, intent, character.gender);
  if (!line) return null;

  return { text: line.text, delivery: line.delivery };
}

/**
 * Get the list of races that fit a given faction's cultural/lore theme.
 * Falls back to all races if the faction is unknown.
 */
export function getAvailableRacesForFaction(factionId: string): string[] {
  return FACTION_RACES[factionId] ?? Object.keys(ELDER_SCROLLS_RACES);
}
