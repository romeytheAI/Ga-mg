import { GameState, StatKey } from '../types';
import { LOCATIONS } from '../data/locations';
import { initialState } from '../state/initialState';

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
    case 'DAMAGE_CLOTHING': {
      const { slot: damageSlot, amount: damageAmount } = action.payload;
      const newInventory = state.player.inventory.map(i => {
        if (i.is_equipped && i.slot === damageSlot && i.integrity !== undefined) {
          const newIntegrity = Math.max(0, i.integrity - (damageAmount || 10));
          return { ...i, integrity: newIntegrity };
        }
        return i;
      });
      
      // Check if exposure state changed
      const damagedItem = newInventory.find(i => i.is_equipped && i.slot === damageSlot);
      const wasDestroyed = damagedItem && damagedItem.integrity !== undefined && damagedItem.integrity <= 0;
      
      let newStats = { ...state.player.stats };
      if (wasDestroyed) {
        // Exposure consequences - increase stress and exhibitionism awareness
        newStats.stress = Math.min(100, (newStats.stress || 0) + 10);
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
    case 'STRIP_CLOTHING': {
      const { slot: stripSlot } = action.payload;
      const strippedItem = state.player.inventory.find(i => i.is_equipped && i.slot === stripSlot);
      if (!strippedItem) return state;

      const newInventory = state.player.inventory.map(i =>
        i.id === strippedItem.id ? { ...i, is_equipped: false } : i
      );
      const newClothing = { ...state.player.clothing, [stripSlot]: null };
      
      // Exposure consequences
      let newStats = { ...state.player.stats };
      newStats.stress = Math.min(100, (newStats.stress || 0) + 15);
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: newInventory,
          clothing: newClothing,
          stats: newStats
        }
      };
    }
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
    default:
      return state;
  }
}
