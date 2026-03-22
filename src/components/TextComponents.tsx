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
