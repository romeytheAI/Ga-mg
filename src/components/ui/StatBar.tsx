import React from 'react';
import { motion } from 'motion/react';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string; // Tailwind color class e.g., 'bg-red-500'
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, max, color }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
        <span className="uppercase tracking-wider">{label}</span>
        <span>{Math.floor(value)} / {max}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
