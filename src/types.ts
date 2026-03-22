export interface Anatomy {
  height: string;
  build: string;
  metabolism: string;
  healer: string;
  sleep: string;
  gut: string;
  bones: string;
  flexibility: string;
  blood: string;
  vision: string;
  skin: string;
  pheromones: string;
  visage: string;
  temp_pref: string;
  injuries: {
    description: string;
    stamina_penalty: number;
    health_penalty: number;
  }[];
  organs: {
    heart: number;
    lungs: number;
    stomach: number;
    liver: number;
    kidneys: number;
  };
  bones_integrity: {
    skull: number;
    spine: number;
    ribs: number;
    arms: number;
    legs: number;
  };
}

export interface LifeSim {
  needs: {
    hunger: number;
    thirst: number;
    energy: number;
    hygiene: number;
    social: number;
  };
  schedule: {
    work: string | null;
    leisure: string | null;
    sleep: string | null;
  };
}
