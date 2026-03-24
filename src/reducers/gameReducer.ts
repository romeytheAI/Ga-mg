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
      // ... (rest of the logic from App.tsx)
      return state; // Placeholder for now, I will need to copy the rest of the logic.
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

    default:
      return state;
  }
}
