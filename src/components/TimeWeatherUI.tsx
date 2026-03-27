import React from 'react';
import { useGameStore } from '../store/gameStore';

export const TimeWeatherUI: React.FC = () => {
  const time = useGameStore((state) => state.time);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-4">
      <div className="text-lg font-bold">
        Day {time.day}
      </div>
      <div className="text-lg">
        {pad(time.hour)}:{pad(time.minute)}
      </div>
    </div>
  );
};
