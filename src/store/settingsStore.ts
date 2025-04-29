import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, Theme } from '../types';
import { DEFAULT_MODELS } from '../lib/openrouter';

interface SettingsState {
  settings: Settings;
  availableModels: typeof DEFAULT_MODELS;
  
  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  toggleTheme: () => void;
}

// Create a base store for settings that will be persisted
const useBaseStore = create<Omit<SettingsState, 'availableModels'>>()(
  persist(
    (set) => ({
      settings: {
        theme: 'dark',
        animations: true,
        fontSize: 'medium',
      },
      
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
        
      toggleTheme: () => 
        set((state) => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === 'light' ? 'dark' : 'light'
          }
        })),
    }),
    {
      name: 'ai-assistant-settings',
    }
  )
);

// Create the final store that combines persisted settings with latest models
export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...useBaseStore.getState(),
  availableModels: DEFAULT_MODELS,
  updateSettings: useBaseStore.getState().updateSettings,
  toggleTheme: useBaseStore.getState().toggleTheme,
}));