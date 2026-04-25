import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const TypewriterText = ({ text, speed, className }: { text: string, speed: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => text.substring(0, prev.length + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-4 ml-1 bg-white/50 align-middle" />}
    </span>
  );
};

export const SemanticText = ({ text, className }: { text: string, className?: string }) => {
  // Regex auto-colors keywords
  const parts = text.split(/(\bBlood\b|\bSeptims\b|\bGold\b|\bPain\b|\bDeath\b|\bWillpower\b|\bLust\b|\bCorruption\b|\bParasite\b|\bDream\b)/gi);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.match(/(\bBlood\b|\bSeptims\b|\bGold\b|\bPain\b|\bDeath\b|\bWillpower\b|\bLust\b|\bCorruption\b|\bParasite\b|\bDream\b)/gi)) {
          return <span key={i} className="text-rose-400 font-bold">{part}</span>;
        }
        return part;
      })}
    </span>
  );
};

export const FloatingDeltas = ({ deltas, onComplete }: { deltas: Partial<Record<import('../types').StatKey, number>>, onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: -50 }}
      exit={{ opacity: 0 }}
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center gap-1"
    >
      {deltas.health !== 0 && <span className={deltas.health! > 0 ? "text-green-400" : "text-red-400 font-bold"}>{deltas.health! > 0 ? '+'': ''}{deltas.health} Health</span>}
      {deltas.stamina !== 0 && <span className={deltas.stamina! > 0 ? "text-blue-400" : "text-orange-400"}>{deltas.stamina! > 0 ? '+'': ''}{deltas.stamina} Stamina</span>}
      {deltas.trauma !== 0 && <span className={deltas.trauma! > 0 ? "text-purple-400 font-bold" : "text-gray-400"}>{deltas.trauma! > 0 ? '+'': ''}{deltas.trauma} Trauma</span>}
      {deltas.willpower !== 0 && <span className={deltas.willpower! > 0 ? "text-indigo-400" : "text-indigo-600"}>{deltas.willpower! > 0 ? '+'': ''}{deltas.willpower} Willpower</span>}
      {deltas.lust !== 0 && <span className={deltas.lust! > 0 ? "text-pink-400 font-bold" : "text-pink-200"}>{deltas.lust! > 0 ? '+'': ''}{deltas.lust} Lust</span>}
      {deltas.corruption !== 0 && <span className={deltas.corruption! > 0 ? "text-emerald-500 font-bold" : "text-emerald-200"}>{deltas.corruption! > 0 ? '+'': ''}{deltas.corruption} Corruption</span>}
    </motion.div>
  );
};
