import { create } from 'zustand';

// --- Types ---

export type ActionParams = {
  label: string;
  description: string;
  onExecute: () => void;
  // Conditions for the action to be visible/enabled
  conditions?: () => boolean;
  timeCost: number; // minutes
};

export type LocationInfo = {
  id: string;
  name: string;
  description: string | (() => string);
  actions: ActionParams[];
  // Connections to other locations
  exits: { id: string; label: string; timeCost: number }[];
};

export type LocationStore = {
  locations: Record<string, LocationInfo>;
  getLocation: (id: string) => LocationInfo | undefined;
  addLocation: (location: LocationInfo) => void;
};

// --- Store ---

export const useLocationStore = create<LocationStore>((set, get) => ({
  locations: {},

  getLocation: (id: string) => {
    return get().locations[id];
  },

  addLocation: (location: LocationInfo) => {
    set((state) => ({
      locations: {
        ...state.locations,
        [location.id]: location
      }
    }));
  }
}));
