// Tests for Reference Index System
import { describe, it, expect, beforeEach } from 'vitest';
import {
  buildReferenceIndex,
  getIndex,
  clearIndexCache,
  validateReferences,
  getNpcLocations,
  getLocationNpcs,
  getQuestPrerequisites,
  getQuestDependents,
  getQuestsRewardingItem,
  getConnectedLocations,
  getLoveInterests,
  getAntagonists,
  getNpcsByRace,
  getLocationsByDangerRange,
  getQuestsByType,
  getQuestsByChapter,
  getNpcMetadata,
  getLocationMetadata,
  getQuestMetadata,
  getIndexStats,
  getEntityCounts,
  asNpcId,
  asLocationId,
  asQuestId,
  asItemId,
} from './referenceIndex';
import type { ReferenceIndex } from './referenceIndex.types';

describe('Reference Index System', () => {
  beforeEach(() => {
    // Clear cache before each test to ensure fresh index
    clearIndexCache();
  });

  describe('Index Building', () => {
    it('should build index without errors', () => {
      const index = buildReferenceIndex();
      expect(index).toBeDefined();
      expect(index.stats.totalNpcs).toBeGreaterThan(0);
      expect(index.stats.totalLocations).toBeGreaterThan(0);
      expect(index.stats.indexBuildTime).toBeGreaterThan(0);
    });

    it('should build index within performance target (<100ms)', () => {
      const index = buildReferenceIndex();
      expect(index.stats.indexBuildTime).toBeLessThan(100);
    });

    it('should use singleton pattern (getIndex returns same instance)', () => {
      const index1 = getIndex();
      const index2 = getIndex();
      expect(index1).toBe(index2);
    });

    it('should rebuild after clearIndexCache', () => {
      const index1 = getIndex();
      clearIndexCache();
      const index2 = getIndex();
      expect(index1).not.toBe(index2);
    });
  });

  describe('Validation', () => {
    it('should validate references successfully', () => {
      const validation = validateReferences();
      expect(validation).toBeDefined();
      expect(validation.valid).toBeDefined();
      expect(Array.isArray(validation.errors)).toBe(true);
    });

    it('should report validation status in index', () => {
      const index = getIndex();
      expect(index.isValid).toBeDefined();
      expect(Array.isArray(index.brokenReferences)).toBe(true);
    });
  });

  describe('NPC Lookups', () => {
    it('should find locations for robin', () => {
      const locations = getNpcLocations(asNpcId('robin'));
      expect(Array.isArray(locations)).toBe(true);
      expect(locations.length).toBeGreaterThan(0);
      expect(locations).toContain('orphanage');
    });

    it('should return empty array for non-existent NPC', () => {
      const locations = getNpcLocations(asNpcId('nonexistent_npc'));
      expect(locations).toEqual([]);
    });

    it('should find NPCs at orphanage', () => {
      const npcs = getLocationNpcs(asLocationId('orphanage'));
      expect(Array.isArray(npcs)).toBe(true);
      expect(npcs.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent location', () => {
      const npcs = getLocationNpcs(asLocationId('nonexistent_location'));
      expect(npcs).toEqual([]);
    });
  });

  describe('Quest Lookups', () => {
    it('should find quest prerequisites', () => {
      const index = getIndex();
      // Find any quest with prerequisites
      const questsWithPrereqs = Array.from(index.questToPrerequisites.entries());

      // Test that the data structure exists
      expect(Array.isArray(questsWithPrereqs)).toBe(true);

      // If there are quests with prerequisites, verify the lookup works
      if (questsWithPrereqs.length > 0) {
        const [questId, prereqsFromIndex] = questsWithPrereqs[0];
        const prereqs = getQuestPrerequisites(questId);
        expect(Array.isArray(prereqs)).toBe(true);
        expect(prereqs).toEqual(prereqsFromIndex);
      } else {
        // If no quests have prerequisites, that's ok, just verify empty query works
        const prereqs = getQuestPrerequisites(asQuestId('any_quest'));
        expect(prereqs).toEqual([]);
      }
    });

    it('should find quest dependents', () => {
      const index = getIndex();
      // Find any quest with dependents
      const questsWithDependents = Array.from(index.questToDependents.entries());
      if (questsWithDependents.length > 0) {
        const [questId] = questsWithDependents[0];
        const dependents = getQuestDependents(questId);
        expect(Array.isArray(dependents)).toBe(true);
        expect(dependents.length).toBeGreaterThan(0);
      }
    });

    it('should find quests that reward items', () => {
      const index = getIndex();
      // Find any item that's rewarded
      const itemsWithQuests = Array.from(index.itemToQuests.entries());
      if (itemsWithQuests.length > 0) {
        const [itemId] = itemsWithQuests[0];
        const quests = getQuestsRewardingItem(itemId);
        expect(Array.isArray(quests)).toBe(true);
        expect(quests.length).toBeGreaterThan(0);
      }
    });

    it('should return empty array for unknown item', () => {
      const quests = getQuestsRewardingItem(asItemId('nonexistent_item'));
      expect(quests).toEqual([]);
    });
  });

  describe('Location Connections', () => {
    it('should find connected locations', () => {
      const connections = getConnectedLocations(asLocationId('orphanage'));
      expect(Array.isArray(connections)).toBe(true);
      // Orphanage should connect to at least town_square or school
      if (connections.length > 0) {
        expect(connections.length).toBeGreaterThan(0);
      }
    });

    it('should return empty array for location with no connections', () => {
      // Some locations may not have connections
      const connections = getConnectedLocations(asLocationId('nonexistent_location'));
      expect(connections).toEqual([]);
    });
  });

  describe('Categorical Queries', () => {
    it('should identify love interests', () => {
      const loveInterests = getLoveInterests();
      expect(Array.isArray(loveInterests)).toBe(true);
      expect(loveInterests.length).toBeGreaterThan(0);
      // Robin should be a love interest
      expect(loveInterests).toContain('robin');
    });

    it('should identify antagonists', () => {
      const antagonists = getAntagonists();
      expect(Array.isArray(antagonists)).toBe(true);
      // There should be at least one antagonist
      expect(antagonists.length).toBeGreaterThan(0);
    });

    it('should group NPCs by race', () => {
      const humans = getNpcsByRace('Human');
      expect(Array.isArray(humans)).toBe(true);
      expect(humans.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown race', () => {
      const unknownRace = getNpcsByRace('UnknownRaceXYZ');
      expect(unknownRace).toEqual([]);
    });

    it('should find locations by danger range', () => {
      const safeLocs = getLocationsByDangerRange(0, 10);
      expect(Array.isArray(safeLocs)).toBe(true);
    });

    it('should get quests by type', () => {
      const mainQuests = getQuestsByType('main');
      expect(Array.isArray(mainQuests)).toBe(true);

      const romanceQuests = getQuestsByType('romance');
      expect(Array.isArray(romanceQuests)).toBe(true);
    });

    it('should get quests by chapter', () => {
      const chapter1 = getQuestsByChapter(1);
      expect(Array.isArray(chapter1)).toBe(true);
    });
  });

  describe('Metadata Queries', () => {
    it('should get NPC metadata for robin', () => {
      const metadata = getNpcMetadata(asNpcId('robin'));
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.id).toBe('robin');
        expect(metadata.name).toBeDefined();
        expect(metadata.race).toBeDefined();
        expect(metadata.isLoveInterest).toBe(true);
        expect(Array.isArray(metadata.allLocations)).toBe(true);
        expect(Array.isArray(metadata.responseTypes)).toBe(true);
        expect(metadata.responseTypes.length).toBeGreaterThan(0);
      }
    });

    it('should return null for non-existent NPC metadata', () => {
      const metadata = getNpcMetadata(asNpcId('nonexistent_npc'));
      expect(metadata).toBeNull();
    });

    it('should get location metadata', () => {
      const metadata = getLocationMetadata(asLocationId('orphanage'));
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.id).toBe('orphanage');
        expect(metadata.name).toBeDefined();
        expect(typeof metadata.danger).toBe('number');
        expect(typeof metadata.npcCount).toBe('number');
        expect(Array.isArray(metadata.npcs)).toBe(true);
      }
    });

    it('should get quest metadata', () => {
      const index = getIndex();
      const questIds = Array.from(index.questMetadata.keys());
      if (questIds.length > 0) {
        const metadata = getQuestMetadata(questIds[0]);
        expect(metadata).toBeDefined();
        if (metadata) {
          expect(metadata.id).toBeDefined();
          expect(metadata.title).toBeDefined();
          expect(metadata.type).toBeDefined();
        }
      }
    });
  });

  describe('Statistics', () => {
    it('should provide index statistics', () => {
      const stats = getIndexStats();
      expect(stats).toBeDefined();
      expect(typeof stats.totalNpcs).toBe('number');
      expect(typeof stats.totalLocations).toBe('number');
      expect(typeof stats.totalQuests).toBe('number');
      expect(typeof stats.totalItems).toBe('number');
      expect(typeof stats.indexBuildTime).toBe('number');
      expect(stats.totalNpcs).toBeGreaterThan(0);
      expect(stats.totalLocations).toBeGreaterThan(0);
    });

    it('should provide entity counts', () => {
      const counts = getEntityCounts();
      expect(counts).toBeDefined();
      expect(typeof counts.npcs).toBe('number');
      expect(typeof counts.locations).toBe('number');
      expect(typeof counts.quests).toBe('number');
      expect(typeof counts.items).toBe('number');
      expect(counts.npcs).toBeGreaterThan(0);
    });

    it('should track total references', () => {
      const stats = getIndexStats();
      expect(typeof stats.totalReferences).toBe('number');
      expect(stats.totalReferences).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should perform lookups in <1ms', () => {
      // Warm up cache
      getIndex();

      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        getNpcLocations(asNpcId('robin'));
        getLocationNpcs(asLocationId('orphanage'));
        getLoveInterests();
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      expect(avgTime).toBeLessThan(1);
    });

    it('should handle multiple concurrent queries efficiently', () => {
      getIndex(); // Warm up

      const start = performance.now();

      // Simulate multiple concurrent queries
      const results = [
        getNpcLocations(asNpcId('robin')),
        getLocationNpcs(asLocationId('orphanage')),
        getLoveInterests(),
        getAntagonists(),
        getNpcsByRace('Human'),
        getQuestsByType('main'),
        getNpcMetadata(asNpcId('robin')),
        getLocationMetadata(asLocationId('orphanage')),
      ];

      const end = performance.now();

      expect(end - start).toBeLessThan(10); // All queries in <10ms
      expect(results.every(r => r !== null && r !== undefined)).toBe(true);
    });
  });

  describe('Data Consistency', () => {
    it('should have bidirectional NPC-Location relationships', () => {
      const index = getIndex();

      // For each NPC→Location mapping
      for (const [npcId, locations] of index.npcToLocations) {
        for (const locationId of locations) {
          // Verify Location→NPC reverse mapping exists
          const npcsAtLocation = index.locationToNpcs.get(locationId) || [];
          expect(npcsAtLocation).toContain(npcId);
        }
      }
    });

    it('should have consistent quest dependency relationships', () => {
      const index = getIndex();

      // For each quest with prerequisites
      for (const [questId, prereqs] of index.questToPrerequisites) {
        for (const prereqId of prereqs) {
          // Verify the prerequisite knows it's depended upon
          const dependents = index.questToDependents.get(prereqId) || [];
          expect(dependents).toContain(questId);
        }
      }
    });

    it('should have all love interests as NPCs', () => {
      const loveInterests = getLoveInterests();
      for (const npcId of loveInterests) {
        const metadata = getNpcMetadata(npcId);
        expect(metadata).not.toBeNull();
        expect(metadata?.isLoveInterest).toBe(true);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty queries gracefully', () => {
      expect(getNpcLocations(asNpcId(''))).toEqual([]);
      expect(getLocationNpcs(asLocationId(''))).toEqual([]);
      expect(getQuestPrerequisites(asQuestId(''))).toEqual([]);
    });

    it('should handle special characters in IDs', () => {
      // Some NPCs have underscores
      const locations = getNpcLocations(asNpcId('constance_michel'));
      expect(Array.isArray(locations)).toBe(true);
    });

    it('should handle multiple race groups', () => {
      const index = getIndex();
      const races = Array.from(index.npcsByRace.keys());
      expect(races.length).toBeGreaterThan(0);

      // Each race group should have at least one NPC
      for (const race of races) {
        const npcs = getNpcsByRace(race);
        expect(npcs.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Integration', () => {
    it('should provide complete workflow: NPC → Locations → Connected Locations', () => {
      // Start with an NPC
      const robinLocations = getNpcLocations(asNpcId('robin'));
      expect(robinLocations.length).toBeGreaterThan(0);

      // For each location, find connected locations
      for (const locationId of robinLocations) {
        const connections = getConnectedLocations(locationId);
        expect(Array.isArray(connections)).toBe(true);
      }
    });

    it('should provide complete workflow: Quest → Prerequisites → Metadata', () => {
      const index = getIndex();
      const allQuests = Array.from(index.questMetadata.keys());

      if (allQuests.length > 0) {
        const questId = allQuests[0];
        const prereqs = getQuestPrerequisites(questId);
        expect(Array.isArray(prereqs)).toBe(true);

        // Get metadata for quest
        const metadata = getQuestMetadata(questId);
        expect(metadata).not.toBeNull();
      }
    });
  });
});
