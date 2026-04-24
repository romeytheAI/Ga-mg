import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  tickSimulation,
  createBackstoryRequest,
  createDialogueRequest,
  createEventNarrativeRequest,
  processHordeRequest
} from './SimulationEngine';
import { SimWorld, SimNpc, HordeRequest } from './types';

// We mock some of the complex sub-systems to make the test simpler
vi.mock('./ProceduralGen', () => ({ generateRandomEvent: () => 'A random event happened.' }));
vi.mock('./TimeSystem', () => ({
  advanceTime: (w: any) => ({ ...w, day: w.day + 1, turn: w.turn + 1, hour: (w.hour + 1) % 24 }),
  scheduledActivity: () => 'idle',
  scheduledLocation: () => 'village'
}));

describe('SimulationEngine', () => {
  function createTestWorld(): SimWorld {
    const npc = {
      id: 'npc1',
      name: 'Bob',
      age: 30,
      race: 'Human',
      gender: 'male',
      job: 'laborer',
      traits: ['aggressive'],
      location_id: 'village',
      target_location_id: null,
      current_state: 'idle',
      schedule: { slots: [] },
      memory: [],
      relationships: [],
      skills: {} as any,
      stats: { health: 100, stamina: 100, gold: 10 },
      corruption_state: { corruption: 0, willpower: 50, stress: 0, trauma: 0, submission: 0, purity: 100, control: 100 },
      fame: { social: 0, crime: 0, wealth_fame: 0, combat_fame: 0, infamy: 0 },
      clothing: { head: null, chest: null, legs: null, feet: null } as any,
      transformation: { ascension: 'none', ascension_progress: 0, body_changes: [], mutation_resistance: 0 },
      addiction_state: { addictions: [], overall_dependency: 0 },
      disease_state: { active_diseases: [], immunities: {}, overall_health_penalty: 0 },
      arcane_state: { mana: 100, mana_regen: 1, spell_affinity: {}, enchantments: [], arcane_corruption: 0 },
      parasite_state: { parasites: [], infestation_level: 0, symbiotic_benefits: 0 },
      companion_state: { companions: [], max_party_size: 1, party_synergy: 0 },
      allure_state: { base_allure: 10, effective_allure: 10, noticeability: 0, intimidation: 0 },
      restraint_state: { restraints: [], escape_progress: 0, movement_penalty: 0, action_penalty: 0 },
    } as any;

    return {
      day: 1,
      hour: 8,
      turn: 1,
      global_events: [],
      weather: 'clear',
      locations: [{ id: 'village', name: 'Village', type: 'town', x: 0, y: 0, danger: 1.0, prosperity: 1.0, npcs_present: [] }],
      npcs: [npc],
      economy: [],
      civilization: {
        governments: [],
        supply_chains: { nodes: [], routes: [] },
        knowledge: { individual_knowledge: {}, faction_knowledge: {}, state_knowledge: {} } as any,
        daedric_influence: {} as any,
        realms: [],
        active_deceptions: []
      } as any,
      active_combats: [],
      factions: [],
      criminal_records: {}
    } as any;
  }

  describe('tickSimulation', () => {
    it('advances time and ticks NPCs without crashing', () => {
      const world = createTestWorld();
      const nextWorld = tickSimulation(world);

      expect(nextWorld.turn).toBeGreaterThan(world.turn);
      expect(nextWorld.npcs.length).toBe(1);
    });

    it('creates combat encounters if hostile NPCs are in the same location', () => {
      const originalMathRandom = Math.random;
      Math.random = () => 0.05; // Force encounter to trigger (danger is 1.0)

      try {
        const world = createTestWorld();
        const npc2 = { ...world.npcs[0], id: 'npc2', target_location_id: null };
        world.npcs.push(npc2);

        const nextWorld = tickSimulation(world);

        // The combat logic should spawn a combat between npc1 and npc2
        // because they are in the same location and one has 'aggressive' trait
        expect(nextWorld.active_combats.length).toBeGreaterThan(0);
      } finally {
        Math.random = originalMathRandom;
      }
    });
  });

  describe('Horde Queue Builders', () => {
    const npc = createTestWorld().npcs[0];

    it('creates backstory request', () => {
      const req = createBackstoryRequest(npc);
      expect(req.type).toBe('backstory');
      expect(req.prompt).toContain(npc.name);
      expect(req.status).toBe('queued');
    });

    it('creates dialogue request', () => {
      const req = createDialogueRequest(npc, 'Hello there');
      expect(req.type).toBe('dialogue');
      expect(req.prompt).toContain('Hello there');
      expect(req.status).toBe('queued');
    });

    it('creates event narrative request', () => {
      const req = createEventNarrativeRequest('The sky fell.', createTestWorld());
      expect(req.type).toBe('event_narrative');
      expect(req.prompt).toContain('The sky fell.');
      expect(req.status).toBe('queued');
    });
  });

  describe('processHordeRequest', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('skips processing if status is done or failed', async () => {
      const req: HordeRequest = { id: 'r1', type: 'backstory', prompt: 'a', subject_id: 'n1', status: 'done', retries: 0 };
      const onResult = vi.fn();
      await processHordeRequest(req, 'api-key', onResult);
      expect(onResult).not.toHaveBeenCalled();
    });

    it('fails after MAX_RETRIES', async () => {
      const req: HordeRequest = { id: 'r1', type: 'backstory', prompt: 'a', subject_id: 'n1', status: 'queued', retries: 3 };
      const onResult = vi.fn();
      await processHordeRequest(req, 'api-key', onResult);
      expect(onResult).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed' }));
    });

    it('submits a queued request and changes status to pending', async () => {
      const req: HordeRequest = { id: 'r1', type: 'backstory', prompt: 'a', subject_id: 'n1', status: 'queued', retries: 0 };
      const onResult = vi.fn();

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'job_123' })
      });

      await processHordeRequest(req, 'api-key', onResult);
      expect(onResult).toHaveBeenCalledWith(expect.objectContaining({
        status: 'pending',
        horde_job_id: 'job_123',
        retries: 1
      }));
    });

    it('polls a pending request and updates to done when finished', async () => {
      const req: HordeRequest = { id: 'r1', type: 'backstory', prompt: 'a', subject_id: 'n1', status: 'pending', horde_job_id: 'job_123', retries: 0 };
      const onResult = vi.fn();

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ done: true, generations: [{ text: 'It was a dark night.' }] })
      });

      await processHordeRequest(req, 'api-key', onResult);
      expect(onResult).toHaveBeenCalledWith(expect.objectContaining({
        status: 'done',
        result: 'It was a dark night.'
      }));
    });

    it('increments retries if fetch fails', async () => {
      const req: HordeRequest = { id: 'r1', type: 'backstory', prompt: 'a', subject_id: 'n1', status: 'queued', retries: 0 };
      const onResult = vi.fn();

      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await processHordeRequest(req, 'api-key', onResult);
      expect(onResult).toHaveBeenCalledWith(expect.objectContaining({
        retries: 1
      }));
    });
  });
});
