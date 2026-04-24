import { describe, it, expect } from 'vitest';
import { migrateGameState, SAVE_SCHEMA_VERSION } from '../saveManager';

describe('saveManager v8 narrative migration', () => {
  it('should be at schema version 8', () => {
    expect(SAVE_SCHEMA_VERSION).toBe(8);
  });

  it('should hydrate missing world_epoch to 0', () => {
    const migrated = migrateGameState({
      world: { day: 5 },
    });
    expect(migrated.world.world_epoch).toBe(0);
  });

  it('should preserve existing world_epoch', () => {
    const migrated = migrateGameState({
      world: { world_epoch: 3 },
    });
    expect(migrated.world.world_epoch).toBe(3);
  });

  it('should hydrate missing completed_story_arcs to empty array', () => {
    const migrated = migrateGameState({});
    expect(migrated.world.completed_story_arcs).toEqual([]);
  });

  it('should preserve existing completed_story_arcs', () => {
    const migrated = migrateGameState({
      world: { completed_story_arcs: ['arc_a', 'arc_b'] },
    });
    expect(migrated.world.completed_story_arcs).toEqual(['arc_a', 'arc_b']);
  });

  it('should hydrate missing narrative_milestones to empty array', () => {
    const migrated = migrateGameState({});
    expect(migrated.world.narrative_milestones).toEqual([]);
  });

  it('should preserve existing narrative_milestones', () => {
    const migrated = migrateGameState({
      world: { narrative_milestones: ['escaped_orphanage', 'met_brynjolf'] },
    });
    expect(migrated.world.narrative_milestones).toEqual(['escaped_orphanage', 'met_brynjolf']);
  });

  it('should handle v7 saves without narrative fields gracefully', () => {
    const v7Save = {
      player: { identity: { name: 'OldSave' }, stats: { health: 50 } },
      world: {
        day: 30,
        active_story_event: null,
        event_flags: { bailey_intro_done: true },
      },
    };
    const migrated = migrateGameState(v7Save);
    expect(migrated.world.world_epoch).toBe(0);
    expect(migrated.world.completed_story_arcs).toEqual([]);
    expect(migrated.world.narrative_milestones).toEqual([]);
    expect(migrated.world.event_flags.bailey_intro_done).toBe(true);
    expect(migrated.player.identity.name).toBe('OldSave');
  });
});
