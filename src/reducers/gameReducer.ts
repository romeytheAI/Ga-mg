import { GameState, StatKey } from '../types';
import { SimWorld, HordeRequest } from '../sim/types';
import { LOCATIONS } from '../data/locations';
import { initialState } from '../state/initialState';
import { tickSimulation } from '../sim/SimulationEngine';

export function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {
    case 'SET_PLAYER_AVATAR':
      return {
        ...state,
        player: {
          ...state.player,
          avatar_url: action.payload
        }
      };
    case 'SET_ACTIVE_ENCOUNTER':
      return {
        ...state,
        world: {
          ...state.world,
          active_encounter: action.payload
        }
      };
    case 'UPDATE_ACTIVE_ENCOUNTER':
      return {
        ...state,
        world: {
          ...state.world,
          active_encounter: state.world.active_encounter ? {
            ...state.world.active_encounter,
            ...action.payload
          } : null
        }
      };
    case 'START_TURN':
      return {
        ...state,
        world: {
          ...state.world,
          last_intent: action.payload.intent || null
        },
        ui: {
          ...state.ui,
          isPollingText: true,
          currentLog: [...state.ui.currentLog, { text: `> ${action.payload.actionText}`, type: 'action' }]
        }
      };
    case 'RESOLVE_TEXT': {
      const { parsedText, actionText } = action.payload;
      if (!parsedText) return { ...state, ui: { ...state.ui, isPollingText: false } };

      // 1. Narrative log
      const narrativeText = parsedText.narrative_text || '';
      const newLog = narrativeText
        ? [...state.ui.currentLog, { text: narrativeText, type: 'narrative' as const }]
        : state.ui.currentLog;

      // 2. Apply stat deltas
      const newStats = { ...state.player.stats };
      const appliedDeltas: Partial<Record<StatKey, number>> = {};
      if (parsedText.stat_deltas) {
        for (const [key, value] of Object.entries(parsedText.stat_deltas)) {
          if (typeof value === 'number' && key in newStats) {
            const k = key as StatKey;
            const maxKey = `max_${k}` as keyof typeof newStats;
            const cap = typeof newStats[maxKey] === 'number' ? (newStats[maxKey] as number) : 100;
            newStats[k] = Math.max(0, Math.min(cap, newStats[k] + value));
            appliedDeltas[k] = value;
          }
        }
      }

      // 3. Apply skill deltas
      const newSkills = { ...state.player.skills };
      if (parsedText.skill_deltas) {
        for (const [key, value] of Object.entries(parsedText.skill_deltas)) {
          if (typeof value === 'number' && key in newSkills) {
            const k = key as keyof typeof newSkills;
            newSkills[k] = Math.max(0, Math.min(100, newSkills[k] + value));
          }
        }
      }

      // 4. Add new items to inventory
      let newInventory = [...state.player.inventory];
      if (parsedText.new_items && Array.isArray(parsedText.new_items)) {
        for (let i = 0; i < parsedText.new_items.length; i++) {
          const item = parsedText.new_items[i];
          newInventory.push({
            id: item.id || `item_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
            name: item.name || 'Unknown Item',
            type: item.type || 'misc',
            slot: item.slot || undefined,
            rarity: item.rarity || 'common',
            description: item.description || '',
            value: item.value ?? 1,
            weight: item.weight ?? 0.1,
            integrity: item.integrity ?? 100,
            max_integrity: item.max_integrity ?? 100,
            stats: item.stats || undefined,
            lore: item.lore || undefined,
            special_effect: item.special_effect || undefined,
          });
        }
      }

      // 5. Equipment integrity degradation
      if (typeof parsedText.equipment_integrity_delta === 'number' && parsedText.equipment_integrity_delta !== 0) {
        newInventory = newInventory.map(item => {
          if (item.is_equipped && item.integrity !== undefined) {
            const newIntegrity = Math.max(0, (item.integrity ?? 100) + parsedText.equipment_integrity_delta);
            return { ...item, integrity: newIntegrity };
          }
          return item;
        });
      }

      // 6. Combat injury
      let newAnatomy = state.player.anatomy;
      if (parsedText.combat_injury) {
        const injury = parsedText.combat_injury;
        newAnatomy = {
          ...newAnatomy,
          injuries: [...newAnatomy.injuries, {
            description: injury.description || 'Wound',
            stamina_penalty: injury.stamina_penalty || 0,
            health_penalty: injury.health_penalty || 0,
          }],
        };
        // Apply injury penalties to stats
        if (injury.stamina_penalty) {
          newStats.stamina = Math.max(0, newStats.stamina - injury.stamina_penalty);
          appliedDeltas.stamina = (appliedDeltas.stamina || 0) - injury.stamina_penalty;
        }
        if (injury.health_penalty) {
          newStats.health = Math.max(0, newStats.health - injury.health_penalty);
          appliedDeltas.health = (appliedDeltas.health || 0) - injury.health_penalty;
        }
      }

      // 7. Afflictions
      let newAfflictions = [...state.player.afflictions];
      if (parsedText.new_affliction && typeof parsedText.new_affliction === 'string') {
        if (!newAfflictions.includes(parsedText.new_affliction)) {
          newAfflictions.push(parsedText.new_affliction);
        }
      }

      // 8. Quests
      let newQuests = [...state.player.quests];
      if (parsedText.new_quests && Array.isArray(parsedText.new_quests)) {
        for (const q of parsedText.new_quests) {
          if (q.id && !newQuests.some(eq => eq.id === q.id)) {
            newQuests.push({
              id: q.id,
              title: q.title || 'Unknown Quest',
              description: q.description || '',
              status: 'active' as const,
            });
          }
        }
      }
      if (parsedText.completed_quests && Array.isArray(parsedText.completed_quests)) {
        newQuests = newQuests.map(q =>
          parsedText.completed_quests.includes(q.id) ? { ...q, status: 'completed' as const } : q
        );
      }

      // 9. Location change
      let newLocation = state.world.current_location;
      if (parsedText.new_location && LOCATIONS[parsedText.new_location]) {
        newLocation = LOCATIONS[parsedText.new_location];
      }

      // 10. Time advancement
      const hoursPassed = typeof parsedText.hours_passed === 'number' ? parsedText.hours_passed : 1;
      let newHour = state.world.hour + hoursPassed;
      let newDay = state.world.day;
      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }

      // 11. Follow-up choices
      let newChoices = parsedText.follow_up_choices && Array.isArray(parsedText.follow_up_choices)
        ? parsedText.follow_up_choices
        : (newLocation.actions || []);

      // 12. Memory graph
      let newMemoryGraph = [...state.memory_graph];
      const memoryEntry = parsedText.memory_entry
        || (narrativeText ? `Day ${newDay}: ${actionText}` : null);
      if (memoryEntry) {
        newMemoryGraph.push(memoryEntry);
      }

      // 13. Psych profile adjustments from stat changes
      const newPsych = { ...state.player.psych_profile };
      if (appliedDeltas.purity && appliedDeltas.purity < 0) {
        newPsych.promiscuity = Math.min(100, newPsych.promiscuity + Math.abs(appliedDeltas.purity) * 0.2);
      }
      if (appliedDeltas.corruption && appliedDeltas.corruption > 0) {
        newPsych.submission_index = Math.min(100, newPsych.submission_index + appliedDeltas.corruption * 0.1);
      }

      // 14. Player needs decay (DoL-parity life-sim loop)
      const newNeeds = { ...state.player.life_sim.needs };
      const intent = state.world.last_intent;
      const drainHours = hoursPassed;

      // Passive drain per hour
      newNeeds.hunger = Math.max(0, newNeeds.hunger - 3 * drainHours);
      newNeeds.thirst = Math.max(0, newNeeds.thirst - 4 * drainHours);
      newNeeds.energy = Math.max(0, newNeeds.energy - 2 * drainHours);
      newNeeds.hygiene = Math.max(0, newNeeds.hygiene - 1.5 * drainHours);
      newNeeds.social = Math.max(0, newNeeds.social - 1 * drainHours);

      // Activity-specific modifiers
      if (intent === 'work') {
        newNeeds.hunger = Math.max(0, newNeeds.hunger - 5 * drainHours);
        newNeeds.energy = Math.max(0, newNeeds.energy - 5 * drainHours);
        newNeeds.hygiene = Math.max(0, newNeeds.hygiene - 3 * drainHours);
      }
      if (intent === 'social') {
        newNeeds.social = Math.min(100, newNeeds.social + 15 * drainHours);
      }
      if (intent === 'neutral' && actionText?.toLowerCase().includes('sleep')) {
        newNeeds.energy = Math.min(100, newNeeds.energy + 30 * drainHours);
      }
      if (intent === 'neutral' && (actionText?.toLowerCase().includes('eat') || actionText?.toLowerCase().includes('food') || actionText?.toLowerCase().includes('bread'))) {
        newNeeds.hunger = Math.min(100, newNeeds.hunger + 25);
      }
      if (intent === 'neutral' && (actionText?.toLowerCase().includes('drink') || actionText?.toLowerCase().includes('water') || actionText?.toLowerCase().includes('ale') || actionText?.toLowerCase().includes('milk'))) {
        newNeeds.thirst = Math.min(100, newNeeds.thirst + 30);
      }
      if (intent === 'neutral' && (actionText?.toLowerCase().includes('swim') || actionText?.toLowerCase().includes('wash') || actionText?.toLowerCase().includes('bath'))) {
        newNeeds.hygiene = Math.min(100, newNeeds.hygiene + 40);
      }

      // Low needs → stat penalties (applied directly to newStats)
      if (newNeeds.hunger <= 20) {
        newStats.health = Math.max(0, newStats.health - 2);
        newStats.stamina = Math.max(0, newStats.stamina - 3);
      }
      if (newNeeds.energy <= 20) {
        newStats.willpower = Math.max(0, newStats.willpower - 3);
        newStats.stamina = Math.max(0, newStats.stamina - 2);
      }
      if (newNeeds.hygiene <= 20) {
        newStats.allure = Math.max(0, newStats.allure - 2);
        newStats.stress = Math.min(100, newStats.stress + 2);
      }
      if (newNeeds.social <= 15) {
        newStats.stress = Math.min(100, newStats.stress + 3);
        newStats.willpower = Math.max(0, newStats.willpower - 1);
      }
      if (newNeeds.thirst <= 15) {
        newStats.health = Math.max(0, newStats.health - 3);
        newStats.stamina = Math.max(0, newStats.stamina - 5);
      }

      const newLifeSim = {
        ...state.player.life_sim,
        needs: newNeeds,
      };

      // 15. Weather effects on player stats (DoL-parity)
      const weather = state.world.weather;
      if (weather === 'Blizzard' || weather === 'Freezing') {
        newStats.stamina = Math.max(0, newStats.stamina - 5 * drainHours);
        newStats.health = Math.max(0, newStats.health - 2 * drainHours);
      } else if (weather === 'Cold Rain' || weather === 'Light Snow' || weather === 'Clear and Cold') {
        newStats.stamina = Math.max(0, newStats.stamina - 2 * drainHours);
      }
      if (weather === 'Rainy' || weather === 'Cold Rain' || weather === 'Drizzle') {
        newNeeds.hygiene = Math.max(0, newNeeds.hygiene - 2 * drainHours);
      }
      if (weather === 'Scorching' || weather === 'Hot' || weather === 'Humid') {
        newStats.stress = Math.min(100, newStats.stress + 2 * drainHours);
        newNeeds.thirst = Math.max(0, newNeeds.thirst - 3 * drainHours);
      }
      if (weather === 'Thunderstorm') {
        newStats.stress = Math.min(100, newStats.stress + 4 * drainHours);
      }

      // 16. Tick simulation engine if available
      let nextSimWorld = state.sim_world;
      if (nextSimWorld) {
        nextSimWorld = tickSimulation(nextSimWorld);
      }

      return {
        ...state,
        player: {
          ...state.player,
          stats: newStats,
          skills: newSkills,
          inventory: newInventory,
          anatomy: newAnatomy,
          afflictions: newAfflictions,
          quests: newQuests,
          psych_profile: newPsych,
          life_sim: newLifeSim,
        },
        world: {
          ...state.world,
          day: newDay,
          hour: newHour,
          turn_count: state.world.turn_count + 1,
          current_location: newLocation,
        },
        memory_graph: newMemoryGraph,
        sim_world: nextSimWorld,
        ui: {
          ...state.ui,
          isPollingText: false,
          currentLog: newLog,
          choices: newChoices,
          last_stat_deltas: Object.keys(appliedDeltas).length > 0 ? appliedDeltas : null,
        },
      };
    }
    case 'RESOLVE_IMAGE':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingImage: false,
          currentImage: action.payload
        }
      };
    case 'RESOLVE_IMAGE_FAILED':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingImage: false
        }
      };
    case 'START_AVATAR_GENERATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          isGeneratingAvatar: true
        }
      };
    case 'RESOLVE_AVATAR':
      return {
        ...state,
        player: {
          ...state.player,
          avatar_url: action.payload
        },
        ui: {
          ...state.ui,
          isGeneratingAvatar: false
        }
      };
    case 'RESOLVE_AVATAR_FAILED':
      return {
        ...state,
        ui: {
          ...state.ui,
          isGeneratingAvatar: false
        }
      };
    case 'RESOLVE_TEXT_FAILED':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingText: false,
          currentLog: [...state.ui.currentLog, { text: "The connection to Aetherius was severed. The weave of fate tangles and snaps. Try again.", type: 'narrative' }]
        }
      };
    case 'SET_API_KEY':
      return {
        ...state,
        ui: { ...state.ui, apiKey: action.payload }
      };
    case 'SET_HORDE_API_KEY':
      return {
        ...state,
        ui: { ...state.ui, hordeApiKey: action.payload }
      };
    case 'SET_TEXT_MODEL':
      return {
        ...state,
        ui: { ...state.ui, selectedTextModel: action.payload }
      };
    case 'SET_IMAGE_MODEL':
      return {
        ...state,
        ui: { ...state.ui, selectedImageModel: action.payload }
      };
    case 'SET_HORDE_STATUS':
      return {
        ...state,
        ui: { ...state.ui, horde_status: action.payload }
      };
    case 'CLEAR_ACTIVE_ENCOUNTER':
      return {
        ...state,
        world: {
          ...state.world,
          active_encounter: null
        }
      };
    case 'EQUIP_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item || item.type !== 'clothing') return state;
      
      const newInventory = state.player.inventory.map(i => i.id === itemId ? { ...i, is_equipped: true } : (i.slot === item.slot ? { ...i, is_equipped: false } : i));
      const newClothing = { ...state.player.clothing, [item.slot!]: item };
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: newInventory,
          clothing: newClothing
        }
      };
    }
    case 'UNEQUIP_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item) return state;
      
      const newInventory = state.player.inventory.map(i => i.id === itemId ? { ...i, is_equipped: false } : i);
      const newClothing = { ...state.player.clothing, [item.slot!]: null };
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: newInventory,
          clothing: newClothing
        }
      };
    }
    case 'USE_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item || item.type !== 'consumable') return state;
      
      const newInventory = state.player.inventory.filter(i => i.id !== itemId);
      const newStats = { ...state.player.stats };
      if (item.stats) {
        for (const [key, value] of Object.entries(item.stats)) {
          if (typeof value === 'number' && key in newStats) {
            newStats[key as StatKey] = Math.max(0, Math.min(100, newStats[key as StatKey] + value));
          }
        }
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: newInventory,
          stats: newStats
        }
      };
    }
    case 'DROP_ITEM': {
      const { itemId } = action.payload;
      return {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.filter(i => i.id !== itemId)
        }
      };
    }
    case 'INTERACT_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item) return state;
      
      return {
        ...state,
        ui: {
          ...state.ui,
          currentLog: [...state.ui.currentLog, { text: `You examine the ${item.name}. ${item.description}`, type: 'narrative' }]
        }
      };
    }
    case 'INITIAL_IMAGE_START':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingImage: true
        }
      };
    case 'TOGGLE_UI_SETTING':
      return {
        ...state,
        ui: {
          ...state.ui,
          [action.payload]: !state.ui[action.payload as keyof typeof state.ui]
        }
      };
    case 'SET_COMBAT_ANIMATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          combat_animation: action.payload
        }
      };
    case 'SET_TARGETED_PART':
      return {
        ...state,
        ui: {
          ...state.ui,
          targeted_part: action.payload
        }
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        ui: {
          ...state.ui,
          settings: {
            ...state.ui.settings,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case 'TOGGLE_DIRECTOR_CUT':
      return {
        ...state,
        world: { ...state.world, director_cut: !state.world.director_cut }
      };
    case 'INJECT_DEVELOPER_JSON':
      try {
        const parsed = JSON.parse(action.payload);
        return { ...state, ...parsed };
      } catch (e) {
        console.error("Failed to inject JSON", e);
        return state;
      }
    case 'START_NEW_GAME':
      return {
        ...initialState,
        world: {
          ...initialState.world,
          director_cut: action.payload.directorCut || false
        }
      };
    case 'LOAD_GAME':
      return action.payload;
    case 'TOGGLE_MAGICKA_OVERCHARGE':
      return {
        ...state,
        player: {
          ...state.player,
          arcane: {
            ...state.player.arcane,
            magicka_overcharge: !state.player.arcane.magicka_overcharge
          }
        }
      };
    case 'CLEAR_STAT_DELTAS':
      return {
        ...state,
        ui: { ...state.ui, last_stat_deltas: null }
      };
    case 'HORDE_REQUEST_START':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            active: true,
            text_requests: action.payload.type === 'text' ? state.ui.horde_monitor.text_requests + 1 : state.ui.horde_monitor.text_requests,
            image_requests: action.payload.type === 'image' ? state.ui.horde_monitor.image_requests + 1 : state.ui.horde_monitor.image_requests
          }
        }
      };
    case 'HORDE_REQUEST_END':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            text_requests: action.payload.type === 'text' ? Math.max(0, state.ui.horde_monitor.text_requests - 1) : state.ui.horde_monitor.text_requests,
            image_requests: action.payload.type === 'image' ? Math.max(0, state.ui.horde_monitor.image_requests - 1) : state.ui.horde_monitor.image_requests,
            text_initial_eta: action.payload.type === 'text' && state.ui.horde_monitor.text_requests <= 1 ? 0 : state.ui.horde_monitor.text_initial_eta,
            image_initial_eta: action.payload.type === 'image' && state.ui.horde_monitor.image_requests <= 1 ? 0 : state.ui.horde_monitor.image_initial_eta,
            active: (state.ui.horde_monitor.text_requests + state.ui.horde_monitor.image_requests - 1) > 0
          }
        }
      };
    case 'HORDE_ETA_UPDATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            text_eta: action.payload.type === 'text' ? action.payload.eta : state.ui.horde_monitor.text_eta,
            image_eta: action.payload.type === 'image' ? action.payload.eta : state.ui.horde_monitor.image_eta,
            text_initial_eta: action.payload.type === 'text' && state.ui.horde_monitor.text_initial_eta === 0 ? action.payload.eta : state.ui.horde_monitor.text_initial_eta,
            image_initial_eta: action.payload.type === 'image' && state.ui.horde_monitor.image_initial_eta === 0 ? action.payload.eta : state.ui.horde_monitor.image_initial_eta
          }
        }
      };
    case 'UPDATE_GENERATION_CHANCE':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            text_generation_chance: action.payload.text !== undefined ? action.payload.text : state.ui.horde_monitor.text_generation_chance,
            image_generation_chance: action.payload.image !== undefined ? action.payload.image : state.ui.horde_monitor.image_generation_chance
          }
        }
      };

    // ── Simulation engine ────────────────────────────────────────────────
    case 'SIM_TICK': {
      if (!state.sim_world) return state;
      const nextSimWorld: SimWorld = tickSimulation(state.sim_world);
      return { ...state, sim_world: nextSimWorld };
    }

    case 'SIM_HORDE_ENQUEUE': {
      const req = action.payload as HordeRequest;
      // Avoid duplicate requests for the same subject
      const alreadyQueued = state.horde_queue.some(
        r => r.subject_id === req.subject_id && r.type === req.type && r.status !== 'done' && r.status !== 'failed'
      );
      if (alreadyQueued) return state;
      return { ...state, horde_queue: [...state.horde_queue, req] };
    }

    case 'SIM_HORDE_UPDATE': {
      const updated = action.payload as HordeRequest;
      const queue = state.horde_queue.map(r => r.id === updated.id ? updated : r);
      // If done, store result in the NPC's dialogue_cache / backstory
      if (updated.status === 'done' && updated.result && state.sim_world) {
        const npcs = state.sim_world.npcs.map(npc => {
          if (npc.id !== updated.subject_id) return npc;
          if (updated.type === 'backstory') return { ...npc, backstory: updated.result };
          if (updated.type === 'dialogue') {
            return { ...npc, dialogue_cache: { ...npc.dialogue_cache, [updated.id]: updated.result! } };
          }
          return npc;
        });
        return {
          ...state,
          horde_queue: queue,
          sim_world: { ...state.sim_world, npcs },
        };
      }
      return { ...state, horde_queue: queue };
    }

    case 'SIM_ADD_MEMORY': {
      const { npcId, event, sentiment, subjectId } = action.payload;
      if (!state.sim_world) return state;
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const { addMemory } = require('../sim/MemorySystem');
        return { ...npc, memory: addMemory(npc, event, sentiment, subjectId, state.sim_world!.turn) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_INTERACTION': {
      const { npcId, targetId, outcome } = action.payload;
      if (!state.sim_world) return state;
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const { getRelationship, upsertRelationship, applyInteraction } = require('../sim/RelationshipSystem');
        const rel = getRelationship(npc, targetId);
        const updated = applyInteraction(rel, outcome, state.sim_world!.turn);
        return { ...npc, relationships: upsertRelationship(npc.relationships, updated) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_CORRUPTION': {
      const { npcId, amount } = action.payload;
      if (!state.sim_world) return state;
      const { applyCorruption } = require('../sim/CorruptionSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, corruption_state: applyCorruption(npc.corruption_state, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_STRESS': {
      const { npcId, amount } = action.payload;
      if (!state.sim_world) return state;
      const { applyStress } = require('../sim/CorruptionSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, corruption_state: applyStress(npc.corruption_state, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_TRAUMA': {
      const { npcId, amount } = action.payload;
      if (!state.sim_world) return state;
      const { applyTrauma } = require('../sim/CorruptionSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, corruption_state: applyTrauma(npc.corruption_state, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_ADD_FAME': {
      const { npcId, fameType, amount } = action.payload;
      if (!state.sim_world) return state;
      const { addFame } = require('../sim/FameSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, fame: addFame(npc.fame, fameType, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_DAMAGE_CLOTHING': {
      const { npcId, slot, amount } = action.payload;
      if (!state.sim_world) return state;
      const { damageClothing } = require('../sim/ClothingSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const item = npc.clothing[slot as keyof typeof npc.clothing];
        if (!item) return npc;
        return { ...npc, clothing: { ...npc.clothing, [slot]: damageClothing(item, amount) } };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_ROMANTIC_INTERACTION': {
      const { npcId, targetId, outcome } = action.payload;
      if (!state.sim_world) return state;
      const { getRelationship, upsertRelationship } = require('../sim/RelationshipSystem');
      const { applyRomanticInteraction, defaultRomanceState } = require('../sim/RomanceSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const rel = getRelationship(npc, targetId);
        const romance = rel.romance ?? defaultRomanceState();
        const result = applyRomanticInteraction(romance, rel, outcome, state.sim_world!.turn);
        return { ...npc, relationships: upsertRelationship(npc.relationships, result.rel) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_START_COMBAT': {
      if (!state.sim_world) return state;
      const { attackerId, defenderId } = action.payload;
      const { createCombatEncounter } = require('../sim/CombatSystem');
      const combat = createCombatEncounter(attackerId, defenderId);
      return {
        ...state,
        sim_world: {
          ...state.sim_world,
          active_combats: [...(state.sim_world.active_combats ?? []), combat],
        },
      };
    }

    case 'SUMMARIZE_MEMORY': {
      const { summary, count } = action.payload;
      // Replace the oldest `count` entries with a single summary entry
      const trimmed = state.memory_graph.slice(count);
      return {
        ...state,
        memory_graph: [summary, ...trimmed],
      };
    }

    default:
      return state;
  }
}
