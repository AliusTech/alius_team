import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Supported theme modes: light, dark, or system preference. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Theme preference state with system/light/dark modes. Persists to localStorage. */
export interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

/** Zustand store hook for reading and updating the theme preference (persisted). */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: 'alius-theme-storage',
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
