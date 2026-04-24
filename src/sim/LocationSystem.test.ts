import { describe, it, expect } from 'vitest';
import { 
  shouldTravel, 
  startTravel, 
  completeTravel, 
  encounterChance, 
  checkForEncounter, 
  getNpcsAtLocation, 
  findNearestLocation, 
  travelTime, 
  dangerLabel 
} from './LocationSystem';
import { SimWorld, SimNpc, SimLocation } from './types';

describe('LocationSystem', () => {
  const createNpc = (overrides: Partial<SimNpc>): SimNpc => ({
    id: 'npc1',
    name: 'Alice',
    location_id: 'home',
    target_location_id: null,
    current_state: 'idle',
    schedule: { slots: [{ hour_start: 0, hour_end: 23, activity: 'idle', location_id: 'home' }] },
    fame: { social: 0, crime: 0, wealth_fame: 0, combat_fame: 0, infamy: 0 },
    ...overrides
  } as any);

  const createLocation = (overrides: Partial<SimLocation>): SimLocation => ({
    id: 'home',
    name: 'Home',
    type: 'home',
    x: 0,
    y: 0,
    danger: 0,
    prosperity: 1.0,
    npcs_present: [],
    ...overrides
  } as any);

  describe('shouldTravel', () => {
    it('returns null if already travelling', () => {
      const npc = createNpc({ current_state: 'travelling' });
      expect(shouldTravel(npc, {} as any)).toBeNull();
    });

    it('returns target location if scheduled elsewhere and location exists', () => {
      const npc = createNpc({ location_id: 'home', schedule: { slots: [{ hour_start: 0, hour_end: 23, activity: 'working', location_id: 'work' }] } });
      const world: SimWorld = {
        hour: 12,
        locations: [createLocation({ id: 'work', type: 'town' })]
      } as any;
      expect(shouldTravel(npc, world)).toBe('work');
    });

    it('returns null if scheduled elsewhere but location does not exist', () => {
      const npc = createNpc({ location_id: 'home', schedule: { slots: [{ hour_start: 0, hour_end: 23, activity: 'working', location_id: 'work' }] } });
      const world: SimWorld = { hour: 12, locations: [] } as any;
      expect(shouldTravel(npc, world)).toBeNull();
    });

    it('returns null if scheduled location is same as current', () => {
      const npc = createNpc({ location_id: 'home', schedule: { slots: [{ hour_start: 0, hour_end: 23, activity: 'idle', location_id: 'home' }] } });
      const world: SimWorld = { hour: 12, locations: [createLocation({ id: 'home' })] } as any;
      expect(shouldTravel(npc, world)).toBeNull();
    });
  });

  describe('startTravel', () => {
    it('sets state to travelling and target location', () => {
      const npc = createNpc({ location_id: 'home', current_state: 'idle' });
      const travelingNpc = startTravel(npc, 'work');
      expect(travelingNpc.current_state).toBe('travelling');
      expect(travelingNpc.target_location_id).toBe('work');
    });
  });

  describe('completeTravel', () => {
    it('does nothing if target_location_id is null', () => {
      const npc = createNpc({ location_id: 'home', target_location_id: null });
      const world = { locations: [] } as any;
      const res = completeTravel(npc, world);
      expect(res.npc).toBe(npc);
    });

    it('moves NPC to new location and updates world lists', () => {
      const npc = createNpc({ location_id: 'home', target_location_id: 'work', current_state: 'travelling' });
      const world = {
        locations: [
          createLocation({ id: 'home', npcs_present: ['npc1', 'npc2'] }),
          createLocation({ id: 'work', npcs_present: [] })
        ]
      } as any;

      const res = completeTravel(npc, world);
      expect(res.npc.location_id).toBe('work');
      expect(res.npc.target_location_id).toBeNull();
      expect(res.npc.current_state).toBe('idle');
      expect(res.world.locations.find((l: any) => l.id === 'home')!.npcs_present).toEqual(['npc2']);
      expect(res.world.locations.find((l: any) => l.id === 'work')!.npcs_present).toEqual(['npc1']);
    });
  });

  describe('encounterChance', () => {
    it('calculates base danger chance', () => {
      expect(encounterChance(createLocation({ danger: 0.2 }), 12, 0)).toBeCloseTo(0.2);
    });

    it('applies night multiplier', () => {
      expect(encounterChance(createLocation({ danger: 0.2 }), 22, 0)).toBeCloseTo(0.3); // 0.2 * 1.5
    });

    it('adds fame/infamy modifier', () => {
      expect(encounterChance(createLocation({ danger: 0.2 }), 12, 50)).toBeCloseTo(0.275); // 0.2 + (50/100)*0.15
    });

    it('clamps chance between 0 and 1', () => {
      expect(encounterChance(createLocation({ danger: 1.0 }), 23, 100)).toBe(1);
    });
  });

  describe('checkForEncounter', () => {
    it('returns false if location is missing', () => {
      const npc = createNpc({ location_id: 'void' });
      expect(checkForEncounter(npc, { locations: [] } as any)).toBe(false);
    });

    it('returns false if sleeping', () => {
      const npc = createNpc({ location_id: 'home', current_state: 'sleeping' });
      expect(checkForEncounter(npc, { hour: 12, locations: [createLocation({ id: 'home', type: 'town' })] } as any)).toBe(false);
    });

    it('returns false if at home type location', () => {
      const npc = createNpc({ location_id: 'home', current_state: 'idle' });
      expect(checkForEncounter(npc, { hour: 12, locations: [createLocation({ id: 'home', type: 'home' })] } as any)).toBe(false);
    });

    it('returns true or false based on chance', () => {
      const originalRandom = Math.random;
      try {
        const npc = createNpc({ location_id: 'town', current_state: 'idle', fame: { infamy: 100 } as any });
        const world = { hour: 23, locations: [createLocation({ id: 'town', type: 'town', danger: 1.0 })] } as any;

        // Force chance to 1 => chance * 0.1 => 0.1
        Math.random = () => 0.05; // 0.05 < 0.1
        expect(checkForEncounter(npc, world)).toBe(true);

        Math.random = () => 0.2; // 0.2 > 0.1
        expect(checkForEncounter(npc, world)).toBe(false);
      } finally {
        Math.random = originalRandom;
      }
    });
  });

  describe('getNpcsAtLocation', () => {
    it('filters NPCs by location', () => {
      const world = {
        npcs: [
          createNpc({ id: 'npc1', location_id: 'work' }),
          createNpc({ id: 'npc2', location_id: 'home' }),
          createNpc({ id: 'npc3', location_id: 'work' })
        ]
      } as any;
      expect(getNpcsAtLocation(world, 'work').map(n => n.id)).toEqual(['npc1', 'npc3']);
    });
  });

  describe('findNearestLocation', () => {
    it('returns null if from location not found', () => {
      expect(findNearestLocation({ locations: [] } as any, 'void', 'town')).toBeNull();
    });

    it('returns nearest location of target type', () => {
      const locations = [
        createLocation({ id: 'home', type: 'home', x: 0, y: 0 }),
        createLocation({ id: 't1', type: 'town', x: 10, y: 0 }),
        createLocation({ id: 't2', type: 'town', x: 3, y: 4 }) // dist 5
      ];
      expect(findNearestLocation({ locations } as any, 'home', 'town')?.id).toBe('t2');
    });

    it('returns null if no locations of type exist', () => {
      const locations = [
        createLocation({ id: 'home', type: 'home', x: 0, y: 0 })
      ];
      expect(findNearestLocation({ locations } as any, 'home', 'town')).toBeNull();
    });
  });

  describe('travelTime', () => {
    it('calculates travel time based on distance', () => {
      const from = createLocation({ x: 0, y: 0 });
      const to = createLocation({ x: 70, y: 0 });
      expect(travelTime(from, to)).toBe(2); // 70 / 35
    });

    it('enforces minimum travel time of BASE_TRAVEL_HOURS', () => {
      const from = createLocation({ x: 0, y: 0 });
      const to = createLocation({ x: 10, y: 0 });
      expect(travelTime(from, to)).toBe(1); // 10 / 35 is ~0, but min is 1
    });
  });

  describe('dangerLabel', () => {
    it('returns correct labels for thresholds', () => {
      expect(dangerLabel(0.9)).toBe('Extremely Dangerous');
      expect(dangerLabel(0.7)).toBe('Dangerous');
      expect(dangerLabel(0.5)).toBe('Risky');
      expect(dangerLabel(0.3)).toBe('Somewhat Safe');
      expect(dangerLabel(0.1)).toBe('Safe');
    });
  });
});
