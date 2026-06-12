import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, formatCompactNumber, formatCurrency } from './format';
import type { SupportedLocale } from '@/i18n/i18n-store';

describe('formatDate', () => {
  it('formats a Date object', () => {
    const date = new Date('2026-06-15T10:30:00Z');
    const result = formatDate(date, 'en');
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/15/);
  });

  it('formats an ISO string', () => {
    const iso = '2026-01-05T08:00:00Z';
    const result = formatDate(iso, 'en');
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/5/);
  });

  it('produces output for all supported locales', () => {
    const date = new Date('2026-06-15T10:30:00Z');
    const locales: SupportedLocale[] = ['zh', 'en', 'ja'];
    for (const loc of locales) {
      expect(formatDate(date, loc)).toBeTruthy();
    }
  });
});

describe('formatNumber', () => {
  it('adds thousand separators for en', () => {
    expect(formatNumber(1234567, 'en')).toBe('1,234,567');
  });

  it('handles zero', () => {
    expect(formatNumber(0, 'en')).toBe('0');
  });

  it('handles negative numbers', () => {
    expect(formatNumber(-1234, 'en')).toBe('-1,234');
  });

  it('handles decimals', () => {
    expect(formatNumber(1234.56, 'en')).toBe('1,234.56');
  });
});

describe('formatCompactNumber', () => {
  it('compacts large numbers', () => {
    expect(formatCompactNumber(1500000, 'en')).toMatch(/1\.5M|1\.5\s*M/);
  });

  it('compacts thousands', () => {
    expect(formatCompactNumber(15000, 'en')).toMatch(/15K|15\s*K/);
  });

  it('leaves small numbers as-is', () => {
    expect(formatCompactNumber(100, 'en')).toBe('100');
  });
});

describe('formatCurrency', () => {
  it('formats USD for en', () => {
    const result = formatCurrency(42.5, 'en');
    expect(result).toMatch(/42\.50/);
    expect(result).toMatch(/\$|US\$|USD/i);
  });

  it('always shows two decimal places', () => {
    const result = formatCurrency(100, 'en');
    expect(result).toMatch(/100\.00/);
  });

  it('handles negative amounts', () => {
    const result = formatCurrency(-9.99, 'en');
    expect(result).toMatch(/9\.99/);
  });
});
