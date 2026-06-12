import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

async function setTauriTheme(isDark: boolean) {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().setTheme(isDark ? 'dark' : 'light');
  } catch {
    // Not running in Tauri (e.g. browser dev)
  }
}

/** Resolves a theme mode to a boolean indicating dark mode, respecting system preference. */
export function resolveIsDark(mode: 'light' | 'dark' | 'system'): boolean {
  return (
    mode === 'dark' ||
    (mode === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}

/** Applies the active theme to the document root and Tauri window, re-running on mode or system preference change. */
export function useThemeEffect() {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const applyTheme = () => {
      const isDark = resolveIsDark(mode);
      document.documentElement.classList.toggle('dark', isDark);
      setTauriTheme(isDark);
    };

    applyTheme();

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', applyTheme);
      return () => mq.removeEventListener('change', applyTheme);
    }
  }, [mode]);
}
