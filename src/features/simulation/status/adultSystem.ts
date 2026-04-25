import { GameState, StatKey } from '../core/types';

export type SexWorkType = 'prostitute''| 'escort''| 'brothel_worker''| 'streetwalker';

export interface SexWorkRecord {
  type: SexWorkType;
  started_at: number;
  total_clients: number;
  income_earned: number;
  health_risks_taken: number;
  reputation: number;
  fired: boolean;
}

export interface ClientEncounter {
  client_richness: 'poor''| 'average''| 'wealthy''| 'noble';
  client_behavior: 'normal''| 'rough''| 'violent''| 'kinky';
  payment: number;
  health_risk: number;
  reputation_impact: number;
}

export const SEX_WORK_BASE_PAY: Record<SexWorkType, { min: number; max: number }> = {
  prostitute: { min: 5, max: 20 },
  escort: { min: 20, max: 50 },
  brothel_worker: { min: 10, max: 30 },
  streetwalker: { min: 2, max: 15 }
};

export const CLIENT_WEALTH_MODIFIERS: Record<string, number> = {
  poor: 0.5,
  average: 1.0,
  wealthy: 2.0,
  noble: 4.0
};

export const BEHAVIOR_RISK_MODIFIERS: Record<string, number> = {
  normal: 0,
  rough: 0.2,
  violent: 0.5,
  kinky: 0.1
};

function getSexWork(state: GameState): SexWorkRecord[] {
  return (state as any).player?.sex_work || [];
}

export function startSexWork(
  state: GameState,
  type: SexWorkType
): GameState {
  const currentTime = state.world?.hour || 0;
  const newRecord: SexWorkRecord = {
    type,
    started_at: currentTime,
    total_clients: 0,
    income_earned: 0,
    health_risks_taken: 0,
    reputation: 50,
    fired: false
  };

  return {
    ...state,
    player: {
      ...state.player,
      sex_work: [...getSexWork(state), newRecord]
    }
  } as GameState;
}

export function endSexWork(state: GameState, index: number): GameState {
  const records = getSexWork(state);
  if (index >= records.length) return state;
  
  const updated = [...records];
  updated[index] = { ...updated[index], fired: true };
  
  return {
    ...state,
    player: { ...state.player, sex_work: updated }
  } as GameState;
}

export function calculateClientEncounter(
  clientType: string,
  behavior: string,
  workType: SexWorkType
): ClientEncounter {
  const basePay = SEX_WORK_BASE_PAY[workType];
  const wealthMod = CLIENT_WEALTH_MODIFIERS[clientType] || 1;
  const behaviorRisk = BEHAVIOR_RISK_MODIFIERS[behavior] || 0;
  
  const basePayment = (basePay.min + Math.random() * (basePay.max - basePay.min)) * wealthMod;
  const healthRisk = 5 + (behaviorRisk * 30);
  const reputationImpact = behavior === 'violent''? -10 : behavior === 'kinky''? 5 : 0;
  
  return {
    client_richness: clientType as ClientEncounter['client_richness'],
    client_behavior: behavior as ClientEncounter['client_behavior'],
    payment: Math.floor(basePayment),
    health_risk: Math.floor(healthRisk),
    reputation_impact: reputationImpact
  };
}

export function serveClient(
  state: GameState,
  workIndex: number,
  client: ClientEncounter
): GameState {
  const records = getSexWork(state);
  if (workIndex >= records.length) return state;
  
  const record = records[workIndex];
  if (record.fired) return state;
  
  const newRecord: SexWorkRecord = {
    ...record,
    total_clients: record.total_clients + 1,
    income_earned: record.income_earned + client.payment,
    health_risks_taken: record.health_risks_taken + (Math.random() < client.health_risk / 100 ? 1 : 0),
    reputation: Math.max(0, Math.min(100, record.reputation + client.reputation_impact))
  };
  
  const updated = [...records];
  updated[workIndex] = newRecord;
  
  const healthDelta = Math.floor(client.health_risk * 0.3);
  const corruptionDelta = 2;
  
  return {
    ...state,
    player: {
      ...state.player,
      sex_work: updated,
      gold: (state.player.gold || 0) + client.payment,
      stats: {
        ...state.player.stats,
        corruption: (state.player.stats.corruption || 0) + corruptionDelta,
        health: Math.max(1, (state.player.stats.health || 100) - healthDelta)
      }
    }
  } as GameState;
}

export function getSexWorkReputation(state: GameState, index: number): number {
  const records = getSexWork(state);
  if (index >= records.length) return 0;
  return records[index].reputation;
}

export function isSexWorkerFired(state: GameState, index: number): boolean {
  const records = getSexWork(state);
  if (index >= records.length) return true;
  return records[index].fired;
}

export interface ExhibitionismRecord {
  location: string;
  timestamp: number;
  arousal_gain: number;
  caught: boolean;
  guard_response: 'ignored''| 'warned''| 'arrested''| 'bribed';
}

export const EXHIBITIONISM_LOCATIONS: Record<string, { base_arousal: number; guard_chance: number; arrested_chance: number }> = {
  marketplace: { base_arousal: 10, guard_chance: 0.3, arrested_chance: 0.1 },
  tavern: { base_arousal: 15, guard_chance: 0.2, arrested_chance: 0.05 },
  bathhouse: { base_arousal: 20, guard_chance: 0.1, arrested_chance: 0.02 },
  city_square: { base_arousal: 25, guard_chance: 0.5, arrested_chance: 0.3 },
  temple: { base_arousal: 30, guard_chance: 0.6, arrested_chance: 0.4 },
  forest: { base_arousal: 5, guard_chance: 0.05, arrested_chance: 0 },
  home: { base_arousal: 3, guard_chance: 0.02, arrested_chance: 0 }
};

function getExhibitionismHistory(state: GameState): ExhibitionismRecord[] {
  return (state as any).player?.exhibitionism_history || [];
}

export function attemptExhibitionism(
  state: GameState,
  location: string
): GameState {
  const locationData = EXHIBITIONISM_LOCATIONS[location];
  if (!locationData) return state;
  
  const roll = Math.random();
  const caught = roll < locationData.guard_chance;
  
  let guardResponse: ExhibitionismRecord['guard_response'] = 'ignored';
  let healthLoss = 0;
  let goldChange = 0;
  let stressChange = 0;
  let corruptionChange = locationData.base_arousal;
  let arousalChange = locationData.base_arousal;
  
  if (caught) {
    const arrestRoll = Math.random();
    if (arrestRoll < locationData.arrested_chance) {
      guardResponse = 'arrested';
      healthLoss = 20;
      corruptionChange -= 10;
    } else if (state.player.gold >= 20 && Math.random() < 0.5) {
      guardResponse = 'bribed';
      goldChange = -20;
      corruptionChange += 5;
    } else {
      guardResponse = 'warned';
      stressChange = 15;
      corruptionChange -= 5;
    }
    arousalChange = 0;
  } else {
    stressChange = -locationData.base_arousal;
  }
  
  const currentTime = state.world?.hour || 0;
  const record: ExhibitionismRecord = {
    location,
    timestamp: currentTime,
    arousal_gain: locationData.base_arousal,
    caught,
    guard_response: guardResponse
  };
  
  return {
    ...state,
    player: {
      ...state.player,
      exhibitionism_history: [...getExhibitionismHistory(state), record],
      stats: {
        ...state.player.stats,
        arousal: (state.player.stats.arousal || 0) + arousalChange,
        stress: (state.player.stats.stress || 0) + stressChange,
        corruption: (state.player.stats.corruption || 0) + corruptionChange,
        health: Math.max(1, (state.player.stats.health || 100) - healthLoss)
      },
      gold: Math.max(0, (state.player.gold || 0) + goldChange)
    }
  } as GameState;
}

export function getExhibitionismCaughtCount(state: GameState): number {
  const history = getExhibitionismHistory(state);
  return history.filter(r => r.caught).length;
}

export type FetishCategory = 
  | 'bondage''
  | 'dom_sub''
  | 'foot''
  | 'size''
  | 'organs''
  | 'monsters''
  | 'group''
  | 'pet''
  | 'pain''
  | 'cum''
  | 'breeding'
  | 'age_play'
  | 'feminization'
  | 'voyeurism'
  | 'exhibitionism';

export interface FetishEntry {
  category: FetishCategory;
  intensity: number;
  unlocked: boolean;
}

export const FETISH_CATEGORIES: FetishCategory[] = [
  'bondage','dom_sub','foot','size','organs','monsters',
  'group','pet','pain','cum','breeding','age_play',
  'feminization','voyeurism','exhibitionism'
];

export const DEFAULT_FETISHES: FetishEntry[] = FETISH_CATEGORIES.map(cat => ({
  category: cat,
  intensity: 0,
  unlocked: false
}));

function getFetishes(state: GameState): FetishEntry[] {
  return (state as any).player?.fetishes || [];
}

export function initializeFetishRegistry(state: GameState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      fetishes: getFetishes(state).length === 0 ? DEFAULT_FETISHES : getFetishes(state)
    }
  } as GameState;
}

export function unlockFetish(state: GameState, category: FetishCategory): GameState {
  const fetishes = getFetishes(state).length === 0 ? DEFAULT_FETISHES : getFetishes(state);
  
  const updated = fetishes.map(f => 
    f.category === category ? { ...f, unlocked: true, intensity: Math.max(f.intensity, 10) } : f
  );
  
  return {
    ...state,
    player: { ...state.player, fetishes: updated }
  } as GameState;
}

export function increaseFetishIntensity(
  state: GameState,
  category: FetishCategory,
  amount: number
): GameState {
  const fetishes = getFetishes(state);
  if (fetishes.length === 0) return initializeFetishRegistry(state);
  
  const updated = fetishes.map(f => 
    f.category === category 
      ? { ...f, intensity: Math.min(100, f.intensity + amount), unlocked: true }
      : f
  );
  
  return {
    ...state,
    player: { ...state.player, fetishes: updated }
  } as GameState;
}

export function decreaseFetishIntensity(
  state: GameState,
  category: FetishCategory,
  amount: number
): GameState {
  const fetishes = getFetishes(state);
  if (fetishes.length === 0) return state;
  
  const updated = fetishes.map(f => 
    f.category === category 
      ? { ...f, intensity: Math.max(0, f.intensity - amount) }
      : f
  );
  
  return {
    ...state,
    player: { ...state.player, fetishes: updated }
  } as GameState;
}

export function getFetishIntensity(state: GameState, category: FetishCategory): number {
  const fetishes = getFetishes(state);
  if (fetishes.length === 0) return 0;
  const fetish = fetishes.find(f => f.category === category);
  return fetish?.intensity || 0;
}

export function isFetishUnlocked(state: GameState, category: FetishCategory): boolean {
  const fetishes = getFetishes(state);
  if (fetishes.length === 0) return false;
  const fetish = fetishes.find(f => f.category === category);
  return fetish?.unlocked || false;
}

export function getActiveFetishes(state: GameState): FetishEntry[] {
  const fetishes = getFetishes(state);
  if (fetishes.length === 0) return [];
  return fetishes.filter(f => f.unlocked && f.intensity > 20);
}

export function getFetishEncounterWeight(state: GameState, category: FetishCategory): number {
  const intensity = getFetishIntensity(state, category);
  return intensity > 30 ? (intensity - 20) // 80 : 0;
}

export type STDType = 
  | 'chlamydia''
  | 'gonorrhea''
  | 'syphilis''
  | 'herpes''
  | 'hpv''
  | 'chancroid'
  | 'trichomoniasis'
  | 'hep_c';

export interface STDRecord {
  type: STDType;
  contracted_at: number;
  treated: boolean;
  treatment_start?: number;
  symptoms: boolean;
  symptom_severity: number;
  times_infected: number;
}

export const STD_DATA: Record<STDType, { 
  name: string; 
  transmission_rate: number; 
  symptom_delay: number; 
  base_severity: number;
  treatment_time: number;
  curable: boolean;
  cost: number;
}> = {
  chlamydia: { name: 'Chlamydia', transmission_rate: 0.4, symptom_delay: 168, base_severity: 10, treatment_time: 72, curable: true, cost: 50 },
  gonorrhea: { name: 'Gonorrhea', transmission_rate: 0.5, symptom_delay: 120, base_severity: 15, treatment_time: 48, curable: true, cost: 75 },
  syphilis: { name: 'Syphilis', transmission_rate: 0.3, symptom_delay: 720, base_severity: 30, treatment_time: 336, curable: true, cost: 200 },
  herpes: { name: 'Herpes', transmission_rate: 0.6, symptom_delay: 168, base_severity: 20, treatment_time: 0, curable: false, cost: 100 },
  hpv: { name: 'HPV', transmission_rate: 0.7, symptom_delay: 720, base_severity: 10, treatment_time: 0, curable: false, cost: 150 },
  chancroid: { name: 'Chancroid', transmission_rate: 0.4, symptom_delay: 72, base_severity: 15, treatment_time: 72, curable: true, cost: 60 },
  trichomoniasis: { name: 'Trichomoniasis', transmission_rate: 0.5, symptom_delay: 72, base_severity: 10, treatment_time: 48, curable: true, cost: 40 },
  hep_c: { name: 'Hepatitis C', transmission_rate: 0.2, symptom_delay: 1440, base_severity: 40, treatment_time: 720, curable: false, cost: 500 }
};

export const ALL_STDS: STDType[] = Object.keys(STD_DATA) as STDType[];

function getSTDs(state: GameState): STDRecord[] {
  return (state as any).player?.stds || [];
}

export function contractSTD(state: GameState, type: STDType): GameState {
  const currentTime = state.world?.hour || 0;
  
  const newRecord: STDRecord = {
    type,
    contracted_at: currentTime,
    treated: false,
    symptoms: false,
    symptom_severity: 0,
    times_infected: 1
  };
  
  let updatedSTDs = [...getSTDs(state)];
  const existingIndex = updatedSTDs.findIndex(s => s.type === type);
  
  if (existingIndex >= 0) {
    updatedSTDs[existingIndex] = {
      ...updatedSTDs[existingIndex],
      contracted_at: currentTime,
      treated: false,
      symptoms: false,
      times_infected: updatedSTDs[existingIndex].times_infected + 1
    };
  } else {
    updatedSTDs.push(newRecord);
  }
  
  return {
    ...state,
    player: {
      ...state.player,
      stds: updatedSTDs
    }
  } as GameState;
}

export function attemptSTDSpread(
  state: GameState,
  targetSTDList: STDRecord[],
  type: STDType
): STDRecord[] {
  const stdData = STD_DATA[type];
  const roll = Math.random();
  
  if (roll < stdData.transmission_rate) {
    const currentTime = state.world?.hour || 0;
    const newRecord: STDRecord = {
      type,
      contracted_at: currentTime,
      treated: false,
      symptoms: false,
      symptom_severity: 0,
      times_infected: 1
    };
    
    let updated = [...targetSTDList];
    const existingIndex = updated.findIndex(s => s.type === type);
    
    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        contracted_at: currentTime,
        treated: false,
        times_infected: updated[existingIndex].times_infected + 1
      };
    } else {
      updated.push(newRecord);
    }
    
    return updated;
  }
  
  return targetSTDList;
}

export function checkForSymptoms(state: GameState): GameState {
  const currentTime = state.world?.hour || 0;
  const stds = getSTDs(state);
  
  const updated = stds.map(std => {
    const stdData = STD_DATA[std.type];
    const timeSince = currentTime - std.contracted_at;
    
    if (std.treated || std.symptoms) return std;
    
    if (timeSince >= stdData.symptom_delay) {
      return {
        ...std,
        symptoms: true,
        symptom_severity: stdData.base_severity
      };
    }
    
    return std;
  });
  
  return {
    ...state,
    player: { ...state.player, stds: updated }
  } as GameState;
}

export function updateSymptomSeverity(state: GameState): GameState {
  const stds = getSTDs(state);
  
  const updated = stds.map(std => {
    if (!std.symptoms || std.treated) return std;
    
    const progress = std.symptom_severity + (Math.random() * 5);
    
    return {
      ...std,
      symptom_severity: Math.min(100, progress)
    };
  });
  
  return {
    ...state,
    player: { ...state.player, stds: updated }
  } as GameState;
}

export function startSTDTreatment(state: GameState, type: STDType): GameState {
  const currentTime = state.world?.hour || 0;
  const stdData = STD_DATA[type];
  const stds = getSTDs(state);
  
  if (state.player.gold < stdData.cost) return state;
  
  const updated = stds.map(std => 
    std.type === type 
      ? { ...std, treatment_start: currentTime, treated: true }
      : std
  );
  
  return {
    ...state,
    player: {
      ...state.player,
      stds: updated,
      gold: state.player.gold - stdData.cost
    }
  } as GameState;
}

export function completeSTDTreatment(state: GameState): GameState {
  const currentTime = state.world?.hour || 0;
  const stds = getSTDs(state);
  
  const filtered = stds.filter(std => {
    if (!std.treated || !std.treatment_start) return true;
    if (STD_DATA[std.type].curable) {
      const timeSince = currentTime - std.treatment_start;
      return timeSince < STD_DATA[std.type].treatment_time;
    }
    return true;
  });
  
  const updated = filtered.map(std => {
    if (!std.treated || !std.treatment_start) return std;
    const timeSince = currentTime - std.treatment_start;
    if (timeSince >= STD_DATA[std.type].treatment_time) {
      if (STD_DATA[std.type].curable) {
        return null;
      }
      return { ...std, treated: false };
    }
    return std;
  }).filter(Boolean) as STDRecord[];
  
  return {
    ...state,
    player: { ...state.player, stds: updated }
  } as GameState;
}

export function getActiveSTDs(state: GameState): STDRecord[] {
  return getSTDs(state).filter(std => !std.treated);
}

export function hasSTD(state: GameState, type: STDType): boolean {
  return getSTDs(state).some(std => std.type === type && !std.treated);
}

export function getSTDSymptomPenalty(state: GameState): number {
  const active = getActiveSTDs(state);
  return active.reduce((total, std) => total + std.symptom_severity * 0.5, 0);
}

export function getTotalSTDCount(state: GameState): number {
  return getSTDs(state).filter(std => !std.treated).length;
}