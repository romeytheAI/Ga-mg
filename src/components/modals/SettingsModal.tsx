import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Database, Sliders, Eye, Monitor } from 'lucide-react';
import { GameState } from '../../types';
import { saveGame } from '../../utils/saveManager';

interface SettingsModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  onClose: () => void;
  availableTextModels: { name: string; count: number }[];
  availableImageModels: { name: string; count: number }[];
  isLoadingModels: boolean;
  setShowDeveloperMode: (show: boolean) => void;
  toggleFullscreen: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  state,
  dispatch,
  onClose,
  availableTextModels,
  availableImageModels,
  isLoadingModels,
  setShowDeveloperMode,
  toggleFullscreen,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#080808] border border-white/10 rounded-sm w-full max-w-4xl max-h-[80vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-serif tracking-widest uppercase text-white/90">System Configuration</h2>
          </div>
          <button aria-label="Close Settings" onClick={onClose} className="p-2 hover:bg-white/5 rounded-sm transition-colors text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 scrollbar-hide">
          <div className="space-y-8">
            <Section title="Interface & Display" icon={<Monitor className="w-4 h-4" />}>
               <Toggle label="Fullscreen Mode" active={state.ui.fullscreen} onClick={toggleFullscreen} />
               <Slider label="UI Scale" value={state.ui.ui_scale * 100} onChange={(v) => dispatch({ type: 'SET_UI_SETTING', payload: { key: 'ui_scale', value: v/100 } })} />
            </Section>

            <Section title="Simulation Parameters" icon={<Sliders className="w-4 h-4" />}>
               <Slider label="Encounter Rate" value={state.ui.settings.encounter_rate * 100} onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { key: 'encounter_rate', value: v/100 } })} />
               <Toggle label="Enable Parasites" active={state.ui.settings.enable_parasites} onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { key: 'enable_parasites', value: !state.ui.settings.enable_parasites } })} />
            </Section>
          </div>

          <div className="space-y-8">
            <Section title="Cognitive Nodes (AI)" icon={<Database className="w-4 h-4" />}>
               <div className="space-y-2">
                 <label className="text-[10px] tracking-widest uppercase text-white/30 block">Text Synthesis API Key</label>
                 <input 
                   type="password" value={state.ui.apiKey} 
                   onChange={(e) => dispatch({ type: 'SET_UI_SETTING', payload: { key: 'apiKey', value: e.target.value } })}
                   className="w-full bg-white/5 border border-white/10 p-2 rounded-sm text-xs font-mono text-white/60 focus:border-sky-500/40 outline-none"
                 />
               </div>
            </Section>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end gap-4">
           <button onClick={() => saveGame('manual', state)} className="px-8 py-3 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-sky-500/20 transition-all rounded-sm">
             Commit State to Disk
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
      {icon}
      <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-bold">{title}</span>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Toggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <div className="flex items-center justify-between group">
    <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">{label}</span>
    <button role="switch" aria-checked={active} aria-label={label} onClick={onClick} className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-sky-500' : 'bg-white/10'}`}>
      <motion.div animate={{ x: active ? 22 : 2 }} className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-lg" />
    </button>
  </div>
);

const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] uppercase tracking-widest">
      <span className="text-white/30">{label}</span>
      <span className="text-sky-400 font-mono">{Math.round(value)}%</span>
    </div>
    <input 
      type="range" min="0" max="100" value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-white/10 rounded-sm appearance-none cursor-pointer accent-sky-500"
    />
  </div>
);
