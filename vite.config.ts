import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-three': ['three'],
            'vendor-genai': ['@google/genai'],
            'vendor-motion': ['motion', 'motion/react'],
            'vendor-lucide': ['lucide-react'],
            'sim-engine': [
              './src/sim/SimulationEngine.ts',
              './src/sim/types.ts',
              './src/sim/CombatSystem.ts',
              './src/sim/NeedsSystem.ts',
              './src/sim/UtilityAI.ts',
              './src/sim/MemorySystem.ts',
              './src/sim/RelationshipSystem.ts',
              './src/sim/EconomySystem.ts',
              './src/sim/TimeSystem.ts',
              './src/sim/ProceduralGen.ts',
              './src/sim/SkillsSystem.ts',
              './src/sim/CorruptionSystem.ts',
              './src/sim/FameSystem.ts',
              './src/sim/ClothingSystem.ts',
              './src/sim/WillpowerSystem.ts',
              './src/sim/LocationSystem.ts',
              './src/sim/RomanceSystem.ts',
              './src/sim/TransformationSystem.ts',
              './src/sim/AddictionSystem.ts',
              './src/sim/DiseaseSystem.ts',
              './src/sim/ArcaneSystem.ts',
              './src/sim/ParasiteSystem.ts',
              './src/sim/CompanionSystem.ts',
              './src/sim/AllureSystem.ts',
              './src/sim/RestraintSystem.ts',
            ],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
