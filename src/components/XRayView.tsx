import React from 'react';
import { motion } from 'motion/react';
import { Anatomy } from '../types';

interface XRayViewProps {
  anatomy: Anatomy;
  highlightedPart?: string;
}

export const XRayView: React.FC<XRayViewProps> = ({ anatomy, highlightedPart }) => {
  const isHighlighted = (part: string) => part === highlightedPart;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/90 p-6 rounded-2xl border border-white/10 text-white font-mono"
    >
      <h2 className="text-xl font-bold mb-4 text-cyan-400 uppercase tracking-widest">X-Ray Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-2">Organs</h3>
          {Object.entries(anatomy.organs).map(([organ, health]: [string, number]) => (
            <div key={organ} className={`flex justify-between text-sm p-1 rounded ${isHighlighted(organ) ? 'bg-cyan-900/50 ring-1 ring-cyan-400' : ''}`}>
              <span className="capitalize">{organ}</span>
              <span className={health < 50 ? 'text-red-500' : 'text-green-500'}>{health}%</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm text-gray-400 mb-2">Bone Integrity</h3>
          {Object.entries(anatomy.bones_integrity).map(([bone, integrity]: [string, number]) => (
            <div key={bone} className={`flex justify-between text-sm p-1 rounded ${isHighlighted(bone) ? 'bg-cyan-900/50 ring-1 ring-cyan-400' : ''}`}>
              <span className="capitalize">{bone}</span>
              <span className={integrity < 50 ? 'text-red-500' : 'text-green-500'}>{integrity}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm text-gray-400 mb-2">Injuries</h3>
        {anatomy.injuries.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-red-300">
            {anatomy.injuries.map((injury, index) => <li key={index}>{injury.description}</li>)}
          </ul>
        ) : (
          <p className="text-sm text-green-500">No major injuries detected.</p>
        )}
      </div>
    </motion.div>
  );
};
