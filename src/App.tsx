import React, { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Narrative } from './components/game/Narrative';
import { ActionMenu } from './components/game/ActionMenu';
import { initStartingLocations } from './data/locations';
import { useLocationStore } from './store/locationStore';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const { locations } = useLocationStore();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Initialize deterministic game data on mount
    if (Object.keys(locations).length === 0) {
      initStartingLocations();
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, [locations]);

  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-amber-500 text-xl font-serif animate-pulse">Initializing Nirn...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-slate-200 selection:bg-amber-500/30">
      <MainLayout>
        <Narrative />
        <ActionMenu />
      </MainLayout>
    </div>
  );
}

export default App;
