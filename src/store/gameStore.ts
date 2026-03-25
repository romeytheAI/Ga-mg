import { create } from 'zustand';

// --- Types ---

export type GameTime = {
  day: number;
  hour: number;
  minute: number;
};

export type PlayerStats = {
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
  stats: PlayerStats;
  clothing: Record<ClothingLayer, ClothingItem | null>;
  locationId: string;
  time: GameTime;
  isLateGame: boolean;
};

export type GameActionState = PlayerState & {
  // Actions
  advanceTime: (minutes: number) => void;
  modifyStat: (stat: keyof PlayerStats, amount: number) => void;
  setStat: (stat: keyof PlayerStats, value: number) => void;
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
  health: 100, maxHealth: 100,
  magicka: 50, maxMagicka: 50,
  fatigue: 100, maxFatigue: 100,
  septims: 15, // Starting out poor in Seyda Neen

  arousal: 0, maxArousal: 10000,
  stress: 0, maxStress: 10000,
  trauma: 0, maxTrauma: 10000,
  corruption: 0,
  hallucination: 0,
};

const INITIAL_CLOTHING: Record<ClothingLayer, ClothingItem | null> = {
  over: null,
  upper: {
    id: 'common_shirt',
    name: 'Common Shirt',
    layer: 'upper',
    integrity: 100,
    maxIntegrity: 100,
    exposure: 20,
    description: 'A simple, rough-spun shirt common among the peasantry of Morrowind.',
  },
  lower: {
    id: 'common_pants',
    name: 'Common Pants',
    layer: 'lower',
    integrity: 100,
    maxIntegrity: 100,
    exposure: 20,
    description: 'Sturdy, rough-spun pants.',
  },
  under_upper: null,
  under_lower: {
    id: 'linen_undergarment',
    name: 'Linen Undergarment',
    layer: 'under_lower',
    integrity: 50,
    maxIntegrity: 50,
    exposure: 10,
    description: 'Basic linen undergarments.',
  }
};

const LATE_GAME_CORRUPTION_THRESHOLD = 5000;
const LATE_GAME_DAY_THRESHOLD = 30;

// --- Store ---

export const useGameStore = create<GameActionState>((set, get) => ({
  stats: { ...INITIAL_STATS },
  clothing: { ...INITIAL_CLOTHING },
  locationId: 'seyda_neen_docks',
  time: { ...INITIAL_TIME },
  isLateGame: false,

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
      let newValue = state.stats[stat] + amount;

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
