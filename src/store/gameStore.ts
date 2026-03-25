import { create } from 'zustand';

// --- Types ---

export type GameTime = {
  day: number;
  hour: number;
  minute: number;
};

export type PlayableRace = 'Altmer' | 'Argonian' | 'Bosmer' | 'Breton' | 'Dunmer' | 'Imperial' | 'Khajiit' | 'Nord' | 'Orc' | 'Redguard';
export type Background = 'Prisoner' | 'Orphan' | 'Mage Apprentice' | 'Street Thief';
export type GamePhase = 'creation' | 'playing' | 'gameover';

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

export type PlayerState = {
  phase: GamePhase;
  stats: PlayerStats;
  clothing: Record<ClothingLayer, ClothingItem | null>;
  locationId: string;
  time: GameTime;
  isLateGame: boolean;
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
  equipClothing: (item: ClothingItem) => void;
  damageClothing: (layer: ClothingLayer, amount: number) => void;
  removeClothing: (layer: ClothingLayer) => void;
  setLocation: (locationId: string) => void;
  checkLateGame: () => void;
};

// --- Initial State ---

const INITIAL_TIME: GameTime = {
  day: 1,
  hour: 8,
  minute: 0,
};

const INITIAL_STATS: PlayerStats = {
  race: 'Imperial', // Default before selection
  background: 'Prisoner', // Default before selection

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
  locationId: '',
  time: { ...INITIAL_TIME },
  isLateGame: false,

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
      }
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
    get().checkLateGame();
  },

  modifyStat: (stat, amount) => {
    set((state) => {
      // @ts-ignore - We ensure stat is a number key via Omit, but TS is finicky with dynamic index
      const currentValue = state.stats[stat] as number;
      let newValue = currentValue + amount;

      // Generic bounding based on max properties if they exist
      const maxProp = `max${stat.charAt(0).toUpperCase() + stat.slice(1)}` as keyof PlayerStats;
      const maxValue = state.stats[maxProp];

      if (typeof maxValue === 'number') {
         newValue = Math.max(0, Math.min(newValue, maxValue));
      } else {
         // Stats without explicit max bounds but shouldn't go below 0 (like septims usually)
         newValue = Math.max(0, newValue);
      }

      return {
        stats: {
          ...state.stats,
          [stat]: newValue
        }
      };
    });
    get().checkLateGame();
  },

  setStat: (stat, value) => {
    set((state) => ({
      stats: {
        ...state.stats,
        [stat]: value
      }
    }));
    get().checkLateGame();
  },

  equipClothing: (item) => {
    set((state) => ({
      clothing: {
        ...state.clothing,
        [item.layer]: item
      }
    }));
  },

  damageClothing: (layer, amount) => {
    set((state) => {
      const item = state.clothing[layer];
      if (!item) return state;

      const newIntegrity = Math.max(0, item.integrity - amount);

      // If destroyed
      if (newIntegrity === 0) {
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
    set((state) => ({
      clothing: {
        ...state.clothing,
        [layer]: null
      }
    }));
  },

  setLocation: (locationId) => {
    set({ locationId });
  },

  checkLateGame: () => {
    const state = get();
    if (!state.isLateGame) {
      if (state.time.day >= LATE_GAME_DAY_THRESHOLD || state.stats.corruption >= LATE_GAME_CORRUPTION_THRESHOLD) {
        set({ isLateGame: true });
      }
    }
  }
}));
