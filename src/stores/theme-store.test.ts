import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore, type ThemeMode } from './theme-store';

beforeEach(() => {
  useThemeStore.setState({ mode: 'system' });
});

describe('useThemeStore', () => {
  it('defaults to system mode', () => {
    expect(useThemeStore.getState().mode).toBe('system');
  });

  it('setMode changes the mode', () => {
    useThemeStore.getState().setMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('setMode accepts all ThemeMode values', () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    for (const m of modes) {
      useThemeStore.getState().setMode(m);
      expect(useThemeStore.getState().mode).toBe(m);
    }
  });
});
