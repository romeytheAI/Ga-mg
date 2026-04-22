import { describe, it, expect } from 'vitest';
import { tickPolitics, promoteNpc } from './PoliticsSystem';
import { SimWorld, FactionHierarchy, FactionId } from './types';

describe('PoliticsSystem', () => {
  describe('tickPolitics', () => {
    it('promotes a lieutenant if the leader is missing', () => {
      const world = {
        factions: [
          { id: 'nobility', name: 'Nobility', description: '', power: 50, relations: {} }
        ],
        faction_hierarchies: {
          'nobility': {
            leader_id: null,
            lieutenants: ['npc1', 'npc2'],
            members: ['npc3'],
            territories: [],
            ranks: {}
          }
        }
      } as unknown as SimWorld;

      const nextWorld = tickPolitics(world);
      const h = nextWorld.faction_hierarchies['nobility'];
      
      expect(h.leader_id).toBe('npc1');
      expect(h.lieutenants).toEqual(['npc2']);
    });

    it('does not promote if there is already a leader', () => {
      const world = {
        factions: [
          { id: 'nobility', name: 'Nobility', description: '', power: 50, relations: {} }
        ],
        faction_hierarchies: {
          'nobility': {
            leader_id: 'leader_npc',
            lieutenants: ['npc1', 'npc2'],
            members: ['npc3'],
            territories: [],
            ranks: {}
          }
        }
      } as unknown as SimWorld;

      const nextWorld = tickPolitics(world);
      const h = nextWorld.faction_hierarchies['nobility'];
      
      expect(h.leader_id).toBe('leader_npc');
      expect(h.lieutenants).toEqual(['npc1', 'npc2']);
    });

    it('does nothing for power projection if random is not met', () => {
      const originalMathRandom = Math.random;
      Math.random = () => 0.99; // Never triggers power projection
      
      try {
        const world = {
          factions: [
            { id: 'nobility', name: 'Nobility', description: '', power: 100, relations: {} } // Power > 90
          ],
          faction_hierarchies: {
            'nobility': {
              leader_id: 'leader_npc',
              lieutenants: [],
              members: [],
              territories: ['loc1'],
              ranks: {}
            }
          }
        } as unknown as SimWorld;

        const nextWorld = tickPolitics(world);
        expect(nextWorld.faction_hierarchies['nobility'].territories).toEqual(['loc1']);
      } finally {
        Math.random = originalMathRandom;
      }
    });

    it('processes power projection if random is met', () => {
      const originalMathRandom = Math.random;
      Math.random = () => 0.01; // Always triggers
      
      try {
        const world = {
          factions: [
            { id: 'nobility', name: 'Nobility', description: '', power: 100, relations: {} } // Power > 90
          ],
          faction_hierarchies: {
            'nobility': {
              leader_id: 'leader_npc',
              lieutenants: [],
              members: [],
              territories: ['loc1'],
              ranks: {}
            }
          }
        } as unknown as SimWorld;

        const nextWorld = tickPolitics(world);
        // Current implementation is a stub: "// Logic for claiming adjacent location would go here"
        // so territories don't change yet, but the code path is covered
        expect(nextWorld.faction_hierarchies['nobility'].territories).toEqual(['loc1']);
      } finally {
        Math.random = originalMathRandom;
      }
    });
  });

  describe('promoteNpc', () => {
    it('moves a member to lieutenant and updates their rank', () => {
      const world = {
        faction_hierarchies: {
          'town_guard': {
            leader_id: 'leader_npc',
            lieutenants: ['npc1'],
            members: ['npc2', 'npc3'],
            territories: [],
            ranks: {
              'npc2': 'Guard'
            }
          }
        }
      } as unknown as SimWorld;

      const nextHierarchy = promoteNpc(world, 'town_guard', 'npc2');
      
      expect(nextHierarchy.members).not.toContain('npc2');
      expect(nextHierarchy.members).toContain('npc3');
      expect(nextHierarchy.lieutenants).toContain('npc1');
      expect(nextHierarchy.lieutenants).toContain('npc2');
      expect(nextHierarchy.ranks['npc2']).toBe('Lieutenant');
    });

    it('does nothing if the NPC is not a member', () => {
      const world = {
        faction_hierarchies: {
          'town_guard': {
            leader_id: 'leader_npc',
            lieutenants: ['npc1'],
            members: ['npc3'],
            territories: [],
            ranks: {}
          }
        }
      } as unknown as SimWorld;

      const nextHierarchy = promoteNpc(world, 'town_guard', 'npc2');
      
      expect(nextHierarchy.lieutenants).not.toContain('npc2');
    });

    it('does nothing if the NPC is already a lieutenant', () => {
      const world = {
        faction_hierarchies: {
          'town_guard': {
            leader_id: 'leader_npc',
            lieutenants: ['npc1', 'npc2'],
            members: ['npc2', 'npc3'], // Intentionally invalid state to test condition
            territories: [],
            ranks: {}
          }
        }
      } as unknown as SimWorld;

      const nextHierarchy = promoteNpc(world, 'town_guard', 'npc2');
      
      expect(nextHierarchy.members).toContain('npc2'); // Was not removed
    });
  });
});
