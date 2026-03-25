import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { CharacterCreation } from './components/CharacterCreation';
import { Play } from './components/Play';

function App() {
  const { phase } = useGameStore();

  if (phase === 'creation') {
    return <CharacterCreation />;
  }

  return <Play />;
}

export default App;
