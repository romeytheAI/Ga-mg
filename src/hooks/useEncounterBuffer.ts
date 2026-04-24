import { useState, useEffect } from 'react';
import { GameState } from '../types';

export function useEncounterBuffer(state: GameState | null) {
  const [buffer, setBuffer] = useState<any[]>([]);
  
  useEffect(() => {
    if (!state) return;
    // Pre-Cog Engine: Polls in the background to pre-generate encounters based on probable next locations
    if (buffer.length < 3 && state.ui && !state.ui.isPollingText) {
      const timer = setTimeout(() => {
        setBuffer(prev => [...prev, { pregenerated: true, location: state.world.current_location.name, timestamp: Date.now() }]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state, buffer]);

  return buffer;
}
