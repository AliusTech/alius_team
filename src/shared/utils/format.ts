import type { SupportedLocale } from '@/i18n/i18n-store';

export function formatDate(date: Date | string | number, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatNumber(num: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCompactNumber(num: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(num);
}

export function formatCurrency(amount: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
