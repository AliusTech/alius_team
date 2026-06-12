import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});
