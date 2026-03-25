import { create } from 'zustand';

// --- Types ---

export type GameTime = {
  day: number;
  hour: number;
  minute: number;
};

export type PlayableRace = 'Altmer' | 'Argonian' | 'Bosmer' | 'Breton' | 'Dunmer' | 'Imperial' | 'Khajiit' | 'Nord' | 'Orc' | 'Redguard';
export type Background = 'Prisoner' | 'Orphan' | 'Mage Apprentice' | 'Street Thief';
export type GamePhase = 'creation' | 'playing' | 'encounter' | 'shop' | 'gameover';

export type PlayerStats = {
  // Bio
  race: PlayableRace;
  background: Background;

  // Elder Scrolls Core Stats
  health: number;
  maxHealth: number;
  magicka: number;
  maxMagicka: number;
  fatigue: number;
  maxFatigue: number;
  septims: number;

  // DoL Core Stats
  arousal: number;
  maxArousal: number;
  stress: number;
  maxStress: number;
  trauma: number;
  maxTrauma: number;
  corruption: number; // For blight/daedric influence
  hallucination: number; // Skooma/moon sugar trips
};

export type ClothingLayer = 'over' | 'upper' | 'lower' | 'under_upper' | 'under_lower';

export type ClothingItem = {
  id: string;
  name: string;
  layer: ClothingLayer;
  integrity: number;
  maxIntegrity: number;
  exposure: number; // How much it hides
  description: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'clothing';
  clothingData?: Omit<ClothingItem, 'integrity'>; // If it's clothing, the base stats
  effect?: (game: GameActionState) => void;
};

export type EncounterChoice = {
  label: string;
  description: string;
  statReq?: { stat: keyof Omit<PlayerStats, 'race' | 'background'>, min: number };
  onChoose: (game: GameActionState) => void; // Mutates state and potentially calls endEncounter
};

export type ActiveEncounter = {
  id: string;
  name: string;
  description: string;
  image?: string;
  choices: EncounterChoice[];
  turn: number;
  enemyHealth?: number;
  enemyLust?: number;
};

export type LogMessage = {
  id: string;
  text: string;
  type: 'neutral' | 'good' | 'bad' | 'combat' | 'lewd';
  timestamp: number;
};

export type PlayerState = {
  phase: GamePhase;
  stats: PlayerStats;
  clothing: Record<ClothingLayer, ClothingItem | null>;
  inventory: InventoryItem[];
  locationId: string;
  time: GameTime;
  isLateGame: boolean;
  activeEncounter: ActiveEncounter | null;
  activeShopId: string | null;
  log: LogMessage[];
};

export type GameActionState = PlayerState & {
  // Initialization
  startGame: (
    race: PlayableRace,
    background: Background,
    startingLocationId: string,
    statModifiers: Partial<PlayerStats>,
    startingClothing: Record<ClothingLayer, ClothingItem | null>
  ) => void;

  // Actions
  advanceTime: (minutes: number) => void;
  modifyStat: (stat: keyof Omit<PlayerStats, 'race' | 'background'>, amount: number) => void;
  setStat: (stat: keyof Omit<PlayerStats, 'race' | 'background'>, value: number) => void;

  // Inventory & Clothing
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  equipClothing: (item: ClothingItem) => void;
  damageClothing: (layer: ClothingLayer, amount: number) => void;
  removeClothing: (layer: ClothingLayer) => void;

  // Navigation & Events
  setLocation: (locationId: string) => void;
  checkLimits: () => void;
  checkLateGame: () => void;
  addLog: (text: string, type?: LogMessage['type']) => void;

  // Encounters
  startEncounter: (encounter: Omit<ActiveEncounter, 'turn'>) => void;
  updateEncounter: (updates: Partial<ActiveEncounter>) => void;
  endEncounter: (logMessage?: string) => void;

  // Shops
  openShop: (shopId: string) => void;
  closeShop: () => void;
};

// --- Initial State ---

const INITIAL_TIME: GameTime = {
  day: 1,
  hour: 8,
  minute: 0,
};

const INITIAL_STATS: PlayerStats = {
  race: 'Imperial',
  background: 'Prisoner',

  health: 100, maxHealth: 100,
  magicka: 50, maxMagicka: 50,
  fatigue: 100, maxFatigue: 100,
  septims: 0,

  arousal: 0, maxArousal: 10000,
  stress: 0, maxStress: 10000,
  trauma: 0, maxTrauma: 10000,
  corruption: 0,
  hallucination: 0,
};

const INITIAL_CLOTHING: Record<ClothingLayer, ClothingItem | null> = {
  over: null,
  upper: null,
  lower: null,
  under_upper: null,
  under_lower: null
};

const LATE_GAME_CORRUPTION_THRESHOLD = 5000;
const LATE_GAME_DAY_THRESHOLD = 30;

// --- Store ---

export const useGameStore = create<GameActionState>((set, get) => ({
  phase: 'creation',
  stats: { ...INITIAL_STATS },
  clothing: { ...INITIAL_CLOTHING },
  inventory: [],
  locationId: '',
  time: { ...INITIAL_TIME },
  isLateGame: false,
  activeEncounter: null,
  activeShopId: null,
  log: [],

  startGame: (race, background, startingLocationId, statModifiers, startingClothing) => {
    set((state) => ({
      phase: 'playing',
      locationId: startingLocationId,
      clothing: startingClothing,
      stats: {
        ...state.stats,
        race,
        background,
        ...statModifiers
      },
      log: [{ id: Date.now().toString(), text: "You awaken in a strange place.", type: 'neutral', timestamp: Date.now() }]
    }));
  },

  advanceTime: (minutes: number) => {
    set((state) => {
      let newMinute = state.time.minute + minutes;
      let newHour = state.time.hour;
      let newDay = state.time.day;

      while (newMinute >= 60) {
        newMinute -= 60;
        newHour += 1;
      }

      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }

      return {
        time: { day: newDay, hour: newHour, minute: newMinute }
      };
    });
    get().checkLimits();
    get().checkLateGame();
  },

  modifyStat: (stat, amount) => {
    set((state) => {
      const currentValue = state.stats[stat] as number;
      let newValue = currentValue + amount;

      const maxProp = `max${stat.charAt(0).toUpperCase() + stat.slice(1)}` as keyof PlayerStats;
      const maxValue = state.stats[maxProp];

      if (typeof maxValue === 'number') {
         newValue = Math.max(0, Math.min(newValue, maxValue));
      } else {
         newValue = Math.max(0, newValue);
      }

      return {
        stats: {
          ...state.stats,
          [stat]: newValue
        }
      };
    });
    get().checkLimits();
    get().checkLateGame();
  },

  setStat: (stat, value) => {
    set((state) => ({
      stats: {
        ...state.stats,
        [stat]: value
      }
    }));
    get().checkLimits();
    get().checkLateGame();
  },

  addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),

  removeItem: (itemId) => set((state) => ({
    inventory: state.inventory.filter(i => i.id !== itemId)
  })),

  useItem: (itemId) => {
    const state = get();
    const item = state.inventory.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === 'consumable' && item.effect) {
      item.effect(state);
      state.removeItem(itemId);
      state.addLog(`You used ${item.name}.`, 'good');
    } else if (item.type === 'clothing' && item.clothingData) {
      state.equipClothing({ ...item.clothingData, integrity: item.clothingData.maxIntegrity });
      state.removeItem(itemId);
      state.addLog(`You equipped ${item.name}.`, 'neutral');
    }
  },

  equipClothing: (item) => {
    set((state) => {
      // If we are replacing something, put the old thing in inventory
      const currentLayer = state.clothing[item.layer];
      const newInventory = [...state.inventory];

      if (currentLayer) {
        newInventory.push({
           id: currentLayer.id + '_' + Date.now(),
           name: currentLayer.name,
           description: currentLayer.description,
           type: 'clothing',
           clothingData: { ...currentLayer }
        });
      }

      return {
        clothing: {
          ...state.clothing,
          [item.layer]: item
        },
        inventory: newInventory
      };
    });
  },

  damageClothing: (layer, amount) => {
    set((state) => {
      const item = state.clothing[layer];
      if (!item) return state;

      const newIntegrity = Math.max(0, item.integrity - amount);

      if (newIntegrity === 0) {
        state.addLog(`Your ${item.name} was destroyed!`, 'bad');
        return {
          clothing: {
            ...state.clothing,
            [layer]: null
          }
        };
      }

      return {
        clothing: {
          ...state.clothing,
          [layer]: { ...item, integrity: newIntegrity }
        }
      };
    });
  },

  removeClothing: (layer) => {
    set((state) => {
      const item = state.clothing[layer];
      if (!item) return state;

      return {
        clothing: {
          ...state.clothing,
          [layer]: null
        },
        inventory: [...state.inventory, {
          id: item.id + '_' + Date.now(),
          name: item.name,
          description: item.description,
          type: 'clothing',
          clothingData: { ...item }
        }]
      };
    });
  },

  setLocation: (locationId) => {
    set({ locationId });
  },

  addLog: (text, type = 'neutral') => {
    set((state) => ({
      log: [{ id: Date.now().toString() + Math.random(), text, type, timestamp: Date.now() }, ...state.log].slice(0, 50)
    }));
  },

  startEncounter: (encounter) => {
    set({ phase: 'encounter', activeEncounter: { ...encounter, turn: 1 } });
    get().addLog(`Encounter started: ${encounter.name}`, 'combat');
  },

  updateEncounter: (updates) => {
    set((state) => ({
      activeEncounter: state.activeEncounter ? { ...state.activeEncounter, ...updates } : null
    }));
  },

  endEncounter: (logMessage) => {
    set({ phase: 'playing', activeEncounter: null });
    if (logMessage) {
       get().addLog(logMessage, 'neutral');
    }
  },

  openShop: (shopId) => {
    set({ phase: 'shop', activeShopId: shopId });
  },

  closeShop: () => {
    set({ phase: 'playing', activeShopId: null });
  },

  checkLimits: () => {
    const state = get();
    // DoL Core Limit Mechanics
    if (state.stats.stress >= state.stats.maxStress) {
       state.addLog("You have suffered a mental breakdown from too much stress.", 'bad');
       state.setStat('stress', 0);
       state.modifyStat('trauma', 1000);
       // In a full implementation, teleport to an Asylum/Temple
       state.advanceTime(1440); // Lose a whole day
       state.addLog("You wake up a day later, disoriented and traumatized.", 'bad');
    }

    if (state.stats.fatigue <= 0) {
       state.addLog("You pass out from exhaustion.", 'bad');
       state.setStat('fatigue', state.stats.maxFatigue);
       // Lose money (robbed while passed out)
       const lostMoney = Math.floor(state.stats.septims * 0.5);
       state.modifyStat('septims', -lostMoney);
       state.advanceTime(480); // Sleep 8 hours
       state.addLog(`You wake up 8 hours later. You were robbed of ${lostMoney} septims while unconscious.`, 'bad');
    }

    if (state.stats.health <= 0) {
       state.setStat('health', 1); // Survive with 1 HP for DoL mechanics (non-lethal usually, just very bad)
       state.addLog("You were beaten to a pulp. You barely survived.", 'bad');
       state.modifyStat('trauma', 2000);
       state.modifyStat('stress', 5000);
       state.damageClothing('upper', 100); // Clothes destroyed
       state.damageClothing('lower', 100);
       state.advanceTime(1440);
    }
  },

  checkLateGame: () => {
    const state = get();
    if (!state.isLateGame) {
      if (state.time.day >= LATE_GAME_DAY_THRESHOLD || state.stats.corruption >= LATE_GAME_CORRUPTION_THRESHOLD) {
        set({ isLateGame: true });
        state.addLog("The fabric of reality shifts. The late game has begun.", 'bad');
      }
    }
  }
}));
