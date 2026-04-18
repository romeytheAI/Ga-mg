import { describe, expect, it } from 'vitest';

import { DIALOGUE_TREES } from '../data/dialogueTrees';
import { initialState } from '../state/initialState';
import { migrateGameState, SAVE_SCHEMA_VERSION } from './saveManager';
import { resolveStoryEventStep, startStoryEvent } from './storyEventEngine';

describe('storyEventEngine', () => {
  it('starts story events from the tree start node', () => {
    const started = startStoryEvent('constance_secret_bread');
    expect(started).not.toBeNull();
    expect(started?.nextStoryEvent?.current_node).toBe(DIALOGUE_TREES.constance_secret_bread.start_node);
    expect(started?.parsedText.follow_up_choices.length).toBeGreaterThan(0);
  });

  it('resolves end-dialogue choices with location follow-up actions', () => {
    const started = startStoryEvent('constance_secret_bread');
    expect(started).not.toBeNull();

    const resolved = resolveStoryEventStep(started!.nextStoryEvent!, 'take_it');
    expect(resolved?.nextStoryEvent?.current_node).toBe('take_roll');

    const ended = resolveStoryEventStep(resolved!.nextStoryEvent!, 'end');
    expect(ended?.nextStoryEvent).toBeNull();
    expect(ended?.parsedText.stat_deltas?.stamina).toBe(10);
  });
});

describe('saveManager migrations', () => {
  it('hydrates an empty object to a valid initial-state shaped save', () => {
    const migrated = migrateGameState({});

    expect(migrated.player.identity.name).toBe(initialState.player.identity.name);
    expect(migrated.world.current_location.id).toBe(initialState.world.current_location.id);
    expect(migrated.ui.settings.enable_pregnancy).toBe(initialState.ui.settings.enable_pregnancy);
  });

  it('hydrates missing parity systems from the initial state', () => {
    const migrated = migrateGameState({
      player: {
        identity: { name: 'Test' },
        stats: { health: 50 },
      },
      world: {
        current_location: 'school',
      },
      ui: {
        graphics_quality: {
          preset: 'high',
        },
      },
    });

    expect(migrated.player.attitudes.sexual).toBe('neutral');
    expect(migrated.player.lewdity_stats.exhibitionism).toBe(0);
    expect(migrated.world.current_location.id).toBe('school');
    expect(migrated.ui.graphics_quality.preset).toBe('high');
    expect(migrated.ui.graphics_quality.renderer_3d.antialiasing).toBe(initialState.ui.graphics_quality.renderer_3d.antialiasing);
  });

  it('preserves equipped clothing based on slot assignments', () => {
    const migrated = migrateGameState({
      player: {
        clothing: {
          chest: {
            id: 'test-top',
            name: 'Test Top',
            type: 'clothing',
            slot: 'chest',
            rarity: 'common',
            description: 'test',
            value: 1,
            weight: 1,
          },
        },
        inventory: [
          {
            id: 'test-top',
            name: 'Test Top',
            type: 'clothing',
            slot: 'chest',
            rarity: 'common',
            description: 'test',
            value: 1,
            weight: 1,
          },
        ],
      },
    });

    expect(migrated.player.inventory[0].is_equipped).toBe(true);
  });

  it('preserves unequipped items when no clothing slot match exists', () => {
    const migrated = migrateGameState({
      player: {
        inventory: [
          {
            id: 'loose-boots',
            name: 'Loose Boots',
            type: 'clothing',
            slot: 'feet',
            rarity: 'common',
            description: 'test',
            value: 1,
            weight: 1,
            is_equipped: false,
          },
        ],
      },
    });

    expect(migrated.player.inventory[0].is_equipped).toBe(false);
  });

  it('resolves legacy string location ids during migration', () => {
    const migrated = migrateGameState({
      world: {
        current_location: 'school',
      },
    });

    expect(migrated.world.current_location.id).toBe('school');
  });

  it('migrates legacy academy bully story ids', () => {
    const migrated = migrateGameState({
      world: {
        active_story_event: {
          id: 'academy_bully_story',
          current_node: 'start',
        },
      },
    });

    expect(migrated.world.active_story_event?.id).toBe('school_bully_story');
  });

  it('exports the active save schema version', () => {
    expect(SAVE_SCHEMA_VERSION).toBeGreaterThan(0);
  });
});
