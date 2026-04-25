import { useState, useEffect } from 'react';
import { GameState } from '../../core/types';

export function useEncounterBuffer(state: GameState) {
  const [buffer, setBuffer] = useState<any[]>([]);
  
  useEffect(() => {
    // Pre-Cog Engine: Polls in the background to pre-generate encounters based on probable next locations
    if (buffer.length < 3 && !state.ui.isPollingText) {
      const timer = setTimeout(() => {
        setBuffer(prev => [...prev, { pregenerated: true, location: state.world.current_location.name, timestamp: Date.now() }]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state, buffer]);

  return buffer;
}
