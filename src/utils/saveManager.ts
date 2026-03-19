export interface SaveSlot {
  id: string;
  name: string;
  level: number;
  location: string;
  day: number;
  trauma: number;
  timestamp: number;
  state: any;
}

const DB_NAME = 'AetheriusSaveDB';
const STORE_NAME = 'saves';
const DB_VERSION = 1;

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

export async function saveGame(id: string, state: any): Promise<void> {
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
      state
    };
    
    const request = store.put(saveObj);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function loadGame(id: string): Promise<any> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => {
      if (request.result) resolve(request.result.state);
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
