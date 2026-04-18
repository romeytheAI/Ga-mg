import React from 'react';
import { motion } from 'motion/react';
import { X, Settings } from '../../components/Icons';
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              x: [null, Math.random() * 100 - 50],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm max-w-md w-full relative shadow-2xl z-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-serif text-white/90 mb-6 flex items-center gap-3">
          <Settings className="w-5 h-5 text-white/50" />
          Neural Link Configuration
        </h2>
        
        <div className="mb-4">
          <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">Horde API Key</label>
          <input 
            type="text" 
            value={state.ui.hordeApiKey}
            onChange={e => dispatch({ type: 'SET_HORDE_API_KEY', payload: e.target.value })}
            placeholder="0000000000"
            className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
          />
          <p className="text-[10px] text-white/30 mt-2">Leave as 0000000000 for anonymous access (slower queue).</p>
        </div>

        <div className="mb-8">
          <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">OpenRouter API Key (Fallback)</label>
          <input 
            type="text" 
            value={state.ui.apiKey}
            onChange={e => dispatch({ type: 'SET_API_KEY', payload: e.target.value })}
            placeholder="sk-or-..."
            className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
          />
          <p className="text-[10px] text-white/30 mt-2">Optional. Used if Horde fails. Leave blank to use free Pollinations.ai fallback.</p>
        </div>

        <div className="mb-4">
          <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">Text Model (AI Horde)</label>
          <select
            value={state.ui.selectedTextModel}
            onChange={e => dispatch({ type: 'SET_TEXT_MODEL', payload: e.target.value })}
            className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
            disabled={isLoadingModels}
          >
            <option value="aphrodite/TheBloke/MythoMax-L2-13B-AWQ">MythoMax L2 13B (Default)</option>
            {availableTextModels.map(m => (
              <option key={m.name} value={m.name}>{m.name} ({m.count} workers)</option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-xs tracking-widest uppercase text-white/50 mb-3">Image Model (Stable Horde)</label>
          <select
            value={state.ui.selectedImageModel}
            onChange={e => dispatch({ type: 'SET_IMAGE_MODEL', payload: e.target.value })}
            className="w-full bg-black border border-white/10 p-4 rounded-sm text-white/90 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm"
            disabled={isLoadingModels}
          >
            <option value="AlbedoBase XL (SDXL)">AlbedoBase XL (Default)</option>
            {availableImageModels.map(m => (
              <option key={m.name} value={m.name}>{m.name} ({m.count} workers)</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-serif text-white/80 border-b border-white/10 pb-2">Gameplay Loop</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Encounter Rate</span>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="0" max="100" step="5" 
                value={state.ui.settings.encounter_rate} 
                onChange={e => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'encounter_rate', value: parseInt(e.target.value) } })}
                className="w-24"
              />
              <span className="text-xs text-white/80 w-8 text-right">{state.ui.settings.encounter_rate}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Stat Drain Multiplier</span>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="0.5" max="2.0" step="0.1" 
                value={state.ui.settings.stat_drain_multiplier} 
                onChange={e => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'stat_drain_multiplier', value: parseFloat(e.target.value) } })}
                className="w-24"
              />
              <span className="text-xs text-white/80 w-8 text-right">{state.ui.settings.stat_drain_multiplier.toFixed(1)}x</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Enable Parasites</span>
            <button onClick={() => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enable_parasites', value: !state.ui.settings.enable_parasites } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
              {state.ui.settings.enable_parasites ? 'On' : 'Off'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Enable Pregnancy</span>
            <button onClick={() => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enable_pregnancy', value: !state.ui.settings.enable_pregnancy } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
              {state.ui.settings.enable_pregnancy ? 'On' : 'Off'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-red-500/50">Extreme Content</span>
            <button onClick={() => dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enable_extreme_content', value: !state.ui.settings.enable_extreme_content } })} className={`text-xs px-3 py-1 rounded-sm border ${state.ui.settings.enable_extreme_content ? 'text-red-500 border-red-500/50' : 'text-white/80 border-white/20 hover:text-white'}`}>
              {state.ui.settings.enable_extreme_content ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-serif text-white/80 border-b border-white/10 pb-2">Interface</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">UI Scale</span>
            <input 
              type="range" min="0.8" max="1.5" step="0.1" 
              value={state.ui.ui_scale} 
              onChange={e => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'ui_scale', value: parseFloat(e.target.value) } })}
              className="w-32"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Fullscreen</span>
            <button onClick={toggleFullscreen} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
              {state.ui.fullscreen ? 'Disable' : 'Enable'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Ambient Audio</span>
            <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'ambient_audio', value: !state.ui.ambient_audio } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
              {state.ui.ambient_audio ? 'On' : 'Off'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Haptics</span>
            <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'haptics_enabled', value: !state.ui.haptics_enabled } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
              {state.ui.haptics_enabled ? 'On' : 'Off'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-red-500/20">
            <span className="text-xs tracking-widest uppercase text-red-500/50">Developer Console</span>
            <button 
              onClick={() => {
                onClose();
                setShowDeveloperMode(true);
              }}
              className="text-xs text-red-500/80 hover:text-red-500 border border-red-500/30 hover:bg-red-500/10 px-3 py-1 rounded-sm transition-colors"
            >
              Access
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/50">Dyslexia Font</span>
            <button onClick={() => dispatch({ type: 'TOGGLE_UI_SETTING', payload: { key: 'accessibility_mode', value: !state.ui.accessibility_mode } })} className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-sm">
              {state.ui.accessibility_mode ? 'On' : 'Off'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-xs tracking-widest uppercase text-red-500/80">Director's Cut</span>
            <button onClick={() => dispatch({ type: 'TOGGLE_DIRECTOR_CUT' })} className={`text-xs px-3 py-1 rounded-sm border ${state.world.director_cut ? 'text-red-500 border-red-500/50' : 'text-white/80 border-white/20 hover:text-white'}`}>
              {state.world.director_cut ? 'Active' : 'Disabled'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-purple-500/80">Developer Mode</span>
            <button onClick={() => { onClose(); setShowDeveloperMode(true); }} className="text-xs text-purple-400 hover:text-purple-300 border border-purple-500/20 px-3 py-1 rounded-sm">
              Open
            </button>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <button 
            onClick={async () => {
              try {
                const saveId = `save_${Date.now()}`;
                await saveGame(saveId, state);
                alert("Game saved successfully!");
              } catch (e) {
                console.error("Manual save failed:", e);
                alert("Failed to save game.");
              }
            }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 tracking-widest uppercase text-xs transition-colors rounded-sm"
          >
            Save Game
          </button>
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to return to the main menu? Unsaved progress will be lost.")) {
                window.location.reload();
              }
            }}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 tracking-widest uppercase text-xs transition-colors rounded-sm"
          >
            Return to Main Menu
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white/10 hover:bg-white/20 text-white/90 text-sm tracking-widest uppercase rounded-sm transition-colors"
        >
          Initialize Link
        </button>
      </motion.div>
    </motion.div>
  );
};
