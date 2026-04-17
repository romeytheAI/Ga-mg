import React from 'react';
import { motion } from 'motion/react';
import { TypewriterText, SemanticText } from './TextComponents';

interface LogEntry {
  text: string;
  type: 'narrative' | 'action' | 'system';
}

interface NarrativeLogProps {
  logs: LogEntry[];
  trauma: number;
  accessibilityMode: boolean;
}

export const NarrativeLog = React.memo(({ logs, trauma, accessibilityMode }: NarrativeLogProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide">
      {logs.slice(-20).map((log, i) => {
        const isLast = i === Math.min(logs.length, 20) - 1;
        const isNarrative = log.type === 'narrative';
        const isAction = log.type === 'action';
        // Speed scales with trauma (higher trauma = faster/more erratic text)
        const typeSpeed = Math.max(5, 30 - (trauma / 4));
        
        return (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative ${isNarrative ? `text-white/80 ${accessibilityMode ? 'font-sans' : 'font-serif'} text-lg leading-relaxed` : isAction ? 'text-emerald-400/80 text-sm tracking-wide italic border-l-2 border-emerald-500/30 pl-4 py-1 bg-emerald-950/10' : 'text-blue-400/80 text-xs tracking-widest uppercase border border-blue-900/30 px-3 py-2 bg-blue-950/10 rounded-sm inline-block self-start'}`}
          >
            {isAction && <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500/50" />}
            {isLast && isNarrative ? (
              <TypewriterText text={log.text} speed={typeSpeed} />
            ) : (
              <SemanticText text={log.text} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
});
