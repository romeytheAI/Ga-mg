import { GameState } from '../types';
import { DIALOGUE_TREES, DialogueTree } from '../data/dialogueTrees';
import { NPCS } from '../data/npcs';
import { LOCATIONS } from '../data/locations';
import { startStoryEvent } from './storyEventEngine';

export interface ParsedActionResult {
  narrative_text: string;
  stat_deltas?: Record<string, number>;
  skill_deltas?: Record<string, number>;
  new_items?: unknown[];
  new_location?: string;
  follow_up_choices: unknown[];
  hours_passed?: number;
}

export type LocationActionResolution =
  | { kind: 'story_event'; eventId: string }
  | { kind: 'narrative'; parsedText: ParsedActionResult }
  | { kind: 'none' };

/** Build success-chance annotations for a list of location actions. */
export function annotateActionsWithChance(
  actions: unknown[],
  state: GameState,
): unknown[] {
  if (!Array.isArray(actions)) return [];
  return actions.map((item: unknown) => {
    const action = item as Record<string, unknown>;
    if (!action.skill_check) return action;
    const check = action.skill_check as { stat: string; difficulty: number };
    const statVal =
      (state.player.stats as any)[check.stat] ??
      (state.player.skills as any)[check.stat] ??
      0;
    const chance = Math.min(100, Math.max(5, (statVal / check.difficulty) * 50 + 25));
    return { ...action, successChance: Math.round(chance) };
  });
}

/**
 * Resolves a single location action (from location.actions) into a game result.
 *
 * Returns:
 *  - { kind: 'story_event', eventId } when the action has a dedicated dialogue tree
 *  - { kind: 'narrative', parsedText }  when the action produces a narrative directly
 *  - { kind: 'none' }                   when the action has no handler (caller should fall through)
 *
 * @param state         Current game state (read-only).
 * @param action        The raw location-action object from location.actions[].
 * @param locationsMap  Location registry (injectable for tests).
 * @param npcsMap       NPC registry (injectable for tests).
 * @param treeMap       Dialogue tree registry (injectable for tests).
 * @param rng           Random function (injectable for tests).
 */
export function resolveLocationAction(
  state: GameState,
  action: any,
  locationsMap: typeof LOCATIONS = LOCATIONS,
  npcsMap: typeof NPCS = NPCS,
  treeMap: Record<string, DialogueTree> = DIALOGUE_TREES,
  rng: () => number = Math.random,
): LocationActionResolution {
  if (!action) return { kind: 'none' };

  // ── Skill check ──────────────────────────────────────────────────────────
  let outcomeText: string | undefined = action.outcome;
  let statDeltas: Record<string, number> | undefined = action.stat_deltas;
  let skillDeltas: Record<string, number> | undefined = action.skill_deltas;
  let newItems: unknown[] | undefined = action.new_items;

  if (action.skill_check) {
    const statVal =
      (state.player.stats as any)[action.skill_check.stat] ??
      (state.player.skills as any)[action.skill_check.stat] ??
      0;
    const difficulty = action.skill_check.difficulty;
    const chance = Math.min(100, Math.max(5, (statVal / difficulty) * 50 + 25));
    const success = rng() * 100 <= chance;

    if (!success && action.fail_outcome) {
      outcomeText  = action.fail_outcome;
      statDeltas   = action.fail_stat_deltas ?? {};
      skillDeltas  = action.fail_skill_deltas ?? {};
      newItems     = [];
    }
  }

  // ── Derive follow-up choices from the next location ───────────────────────
  const nextLoc = action.new_location ? locationsMap[action.new_location] : state.world.current_location;
  const followUpChoices = annotateActionsWithChance(
    (nextLoc?.actions as unknown[]) ?? [],
    state,
  );

  // ── NPC interaction ──────────────────────────────────────────────────────
  if (action.npc) {
    const eventId: string | undefined =
      action.story_event ??
      (action.intent === 'social' ? `${action.npc}_social` : undefined);

    if (eventId) {
      const started = startStoryEvent(eventId, treeMap);
      if (started?.nextStoryEvent) {
        return { kind: 'story_event', eventId };
      }
    }

    const npc = npcsMap[action.npc];
    const response = npc?.responses?.[action.intent ?? 'social'];
    if (response) {
      return {
        kind: 'narrative',
        parsedText: {
          ...(response as Record<string, unknown>),
          follow_up_choices: followUpChoices,
          new_location: action.new_location,
        } as ParsedActionResult,
      };
    }

    return { kind: 'none' };
  }

  // ── Plain action with outcome text ───────────────────────────────────────
  if (outcomeText) {
    return {
      kind: 'narrative',
      parsedText: {
        narrative_text: outcomeText,
        stat_deltas: statDeltas,
        skill_deltas: skillDeltas,
        new_items: newItems,
        follow_up_choices: followUpChoices,
        new_location: action.new_location,
      },
    };
  }

  return { kind: 'none' };
}
