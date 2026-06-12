import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'no', true && 'yes')).toBe('base yes');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('deduplicates conflicting text colors', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('filters out falsy values', () => {
    expect(cn('a', null, undefined, false, '', 0, 'b')).toBe('a b');
  });

  it('handles arrays and objects (clsx syntax)', () => {
    expect(cn(['x', { y: true, z: false }])).toBe('x y');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });
});
