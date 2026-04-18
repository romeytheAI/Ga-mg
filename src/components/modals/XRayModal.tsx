import React from 'react';
import { motion } from 'motion/react';
import { X } from '../../components/Icons';
import { GameState } from '../../types';
import { XRayView } from '../XRayView';

interface XRayModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

export const XRayModal: React.FC<XRayModalProps> = ({ state, dispatch }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="max-w-2xl w-full relative"
      >
        <button aria-label="Close X-Ray" onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'show_xray', value: false } })} className="absolute top-6 right-6 text-white/40 hover:text-white z-10"><X className="w-6 h-6" /></button>
        <XRayView anatomy={state.player.anatomy} highlightedPart={state.ui.highlighted_part || undefined} />
      </motion.div>
    </motion.div>
  );
};
