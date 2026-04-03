import { LOCATIONS } from '../data/locations';
import { initialState } from '../state/initialState';
import { GameState, GraphicsQuality, GraphicsQualityPreset, Item } from '../types';

export interface SaveSlot {
  id: string;
  name: string;
  level: number;
  location: string;
  day: number;
  trauma: number;
  timestamp: number;
  schemaVersion: number;
  state: GameState;
}

const DB_NAME = 'AetheriusSaveDB';
const STORE_NAME = 'saves';
const DB_VERSION = 1;
export const SAVE_SCHEMA_VERSION = 2;

type PartialGameState = Partial<GameState> & {
  player?: Partial<GameState['player']>;
  world?: Partial<GameState['world']>;
  ui?: Partial<GameState['ui']>;
};

function mergeGraphicsQuality(graphicsQuality?: Partial<GraphicsQuality>): GraphicsQuality {
  return {
    ...initialState.ui.graphics_quality,
    ...graphicsQuality,
    sprite_quality: {
      ...initialState.ui.graphics_quality.sprite_quality,
      ...(graphicsQuality?.sprite_quality || {}),
    },
    renderer_3d: {
      ...initialState.ui.graphics_quality.renderer_3d,
      ...(graphicsQuality?.renderer_3d || {}),
    },
    animation: {
      ...initialState.ui.graphics_quality.animation,
      ...(graphicsQuality?.animation || {}),
    },
    performance: {
      ...initialState.ui.graphics_quality.performance,
      ...(graphicsQuality?.performance || {}),
    },
  };
}

function normalizeInventory(inventory: Item[] | undefined, clothing: GameState['player']['clothing']): Item[] {
  if (!Array.isArray(inventory)) return [...initialState.player.inventory];

  return inventory.map(item => {
    if (!item?.slot || item.type !== 'clothing') return item;
    const equippedFromSlot = clothing[item.slot];
    return {
      ...item,
      is_equipped: equippedFromSlot?.id === item.id ? true : item.is_equipped,
    };
  });
}

function resolveCurrentLocation(world: Partial<GameState['world']> | undefined): GameState['world']['current_location'] {
  const locationRef = world?.current_location;
  if (typeof locationRef === 'string' && LOCATIONS[locationRef]) return LOCATIONS[locationRef];
  if (locationRef?.id && LOCATIONS[locationRef.id]) return LOCATIONS[locationRef.id];
  return initialState.world.current_location;
}

export function migrateGameState(rawState: unknown): GameState {
  const candidate = (rawState && typeof rawState === 'object' ? rawState : {}) as PartialGameState;
  const player = candidate.player || {};
  const world = candidate.world || {};
  const ui = candidate.ui || {};
  const clothing = {
    ...initialState.player.clothing,
    ...(player.clothing || {}),
  };

  return {
    ...initialState,
    ...candidate,
    player: {
      ...initialState.player,
      ...player,
      identity: { ...initialState.player.identity, ...(player.identity || {}) },
      stats: { ...initialState.player.stats, ...(player.stats || {}) },
      skills: { ...initialState.player.skills, ...(player.skills || {}) },
      psych_profile: { ...initialState.player.psych_profile, ...(player.psych_profile || {}) },
      attitudes: { ...initialState.player.attitudes, ...(player.attitudes || {}) },
      sensitivity: { ...initialState.player.sensitivity, ...(player.sensitivity || {}) },
      sexual_skills: { ...initialState.player.sexual_skills, ...(player.sexual_skills || {}) },
      virginities: { ...initialState.player.virginities, ...(player.virginities || {}) },
      body_fluids: { ...initialState.player.body_fluids, ...(player.body_fluids || {}) },
      insecurity: { ...initialState.player.insecurity, ...(player.insecurity || {}) },
      lewdity_stats: { ...initialState.player.lewdity_stats, ...(player.lewdity_stats || {}) },
      temperature: { ...initialState.player.temperature, ...(player.temperature || {}) },
      bailey_payment: { ...initialState.player.bailey_payment, ...(player.bailey_payment || {}) },
      clothing,
      anatomy: { ...initialState.player.anatomy, ...(player.anatomy || {}) },
      psychology: { ...initialState.player.psychology, ...(player.psychology || {}) },
      perks_flaws: { ...initialState.player.perks_flaws, ...(player.perks_flaws || {}) },
      social: { ...initialState.player.social, ...(player.social || {}) },
      cosmetics: { ...initialState.player.cosmetics, ...(player.cosmetics || {}) },
      arcane: { ...initialState.player.arcane, ...(player.arcane || {}) },
      justice: { ...initialState.player.justice, ...(player.justice || {}) },
      companions: { ...initialState.player.companions, ...(player.companions || {}) },
      base: { ...initialState.player.base, ...(player.base || {}) },
      subconscious: { ...initialState.player.subconscious, ...(player.subconscious || {}) },
      biology: { ...initialState.player.biology, ...(player.biology || {}) },
      life_sim: {
        ...initialState.player.life_sim,
        ...(player.life_sim || {}),
        needs: {
          ...initialState.player.life_sim.needs,
          ...(player.life_sim?.needs || {}),
        },
        schedule: {
          ...initialState.player.life_sim.schedule,
          ...(player.life_sim?.schedule || {}),
        },
      },
      inventory: normalizeInventory(player.inventory, clothing),
      traits: player.traits || initialState.player.traits,
      feats: player.feats || initialState.player.feats,
      afflictions: player.afflictions || initialState.player.afflictions,
      quests: player.quests || initialState.player.quests,
      known_recipes: player.known_recipes || initialState.player.known_recipes,
      status_effects: player.status_effects || initialState.player.status_effects,
    },
    world: {
      ...initialState.world,
      ...world,
      current_location: resolveCurrentLocation(world),
      economy: { ...initialState.world.economy, ...(world.economy || {}) },
      ecology: { ...initialState.world.ecology, ...(world.ecology || {}) },
      factions: { ...initialState.world.factions, ...(world.factions || {}) },
      npc_state: { ...initialState.world.npc_state, ...(world.npc_state || {}) },
      meta_events: { ...initialState.world.meta_events, ...(world.meta_events || {}) },
      settlement: { ...initialState.world.settlement, ...(world.settlement || {}) },
      ambient: { ...initialState.world.ambient, ...(world.ambient || {}) },
      arcane: { ...initialState.world.arcane, ...(world.arcane || {}) },
      justice: { ...initialState.world.justice, ...(world.justice || {}) },
      dreamscape: { ...initialState.world.dreamscape, ...(world.dreamscape || {}) },
    },
    ui: {
      ...initialState.ui,
      ...ui,
      horde_monitor: { ...initialState.ui.horde_monitor, ...(ui.horde_monitor || {}) },
      settings: { ...initialState.ui.settings, ...(ui.settings || {}) },
      graphics_quality: mergeGraphicsQuality(ui.graphics_quality),
    },
    memory_graph: candidate.memory_graph || initialState.memory_graph,
    sim_world: candidate.sim_world || initialState.sim_world,
    horde_queue: candidate.horde_queue || initialState.horde_queue,
  };
}

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveGame(id: string, state: GameState): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const saveObj: SaveSlot = {
      id,
      name: state.player?.identity?.name || 'Unknown',
      level: state.player?.stats?.level || 1,
      location: state.world?.current_location?.name || 'Unknown',
      day: state.world?.day || 1,
      trauma: state.player?.stats?.trauma || 0,
      timestamp: Date.now(),
      schemaVersion: SAVE_SCHEMA_VERSION,
      state: migrateGameState(state),
    };
    
    const request = store.put(saveObj);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function loadGame(id: string): Promise<GameState> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => {
      if (request.result) resolve(migrateGameState(request.result.state));
      else reject(new Error('Save not found'));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSaves(): Promise<Omit<SaveSlot, 'state'>[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const saves = request.result.map(save => {
        const { state, ...metadata } = save;
        return metadata;
      });
      resolve(saves.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSave(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
