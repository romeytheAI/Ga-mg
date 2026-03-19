import React, { useState, useEffect } from 'react';
import { saveGame, loadGame, getAllSaves, deleteSave } from '../utils/saveManager';
import { GameState } from '../App';

interface SaveLoadModalProps {
  onClose: () => void;
  onLoad: (state: GameState) => void;
  currentState: GameState;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ onClose, onLoad, currentState }) => {
  const [saves, setSaves] = useState<any[]>([]);

  useEffect(() => {
    refreshSaves();
  }, []);

  const refreshSaves = async () => {
    const allSaves = await getAllSaves();
    setSaves(allSaves);
  };

  const handleSave = async () => {
    const id = Date.now().toString();
    await saveGame(id, currentState);
    refreshSaves();
  };

  const handleLoad = async (id: string) => {
    const state = await loadGame(id);
    if (state) {
      onLoad(state);
      onClose();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSave(id);
    refreshSaves();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Save / Load</h2>
        <button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded mb-4">
          Save Game
        </button>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {saves.map(save => (
            <div key={save.id} className="flex justify-between items-center bg-zinc-800 p-2 rounded">
              <div>
                <p className="text-white font-bold">{save.player_name}</p>
                <p className="text-zinc-400 text-sm">{save.location} - Day {save.day}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleLoad(save.id)} className="text-blue-400 hover:text-blue-300">Load</button>
                <button onClick={() => handleDelete(save.id)} className="text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};
