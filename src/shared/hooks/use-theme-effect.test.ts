import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveIsDark } from './use-theme-effect';

describe('resolveIsDark', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false for light mode', () => {
    expect(resolveIsDark('light')).toBe(false);
  });

  it('returns true for dark mode', () => {
    expect(resolveIsDark('dark')).toBe(true);
  });

  it('follows matchMedia when mode is system (dark)', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    expect(resolveIsDark('system')).toBe(true);
  });

  it('follows matchMedia when mode is system (light)', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    expect(resolveIsDark('system')).toBe(false);
  });
});
