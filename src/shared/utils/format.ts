import type { SupportedLocale } from '@/i18n/i18n-store';

/** Formats a date as a short locale-aware string with month, day, hour, and minute. */
export function formatDate(date: Date | string | number, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/** Formats a number using locale-aware digit grouping. */
export function formatNumber(num: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale).format(num);
}

/** Formats a number in compact notation (e.g. 1.2K, 3.4M). */
export function formatCompactNumber(num: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(num);
}

/** Formats a number as USD currency with two decimal places. */
export function formatCurrency(amount: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
