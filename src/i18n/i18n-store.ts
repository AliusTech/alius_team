import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18next from 'i18next';

/** Supported locale codes. */
export const SUPPORTED_LOCALES = ['zh', 'en', 'ja'] as const;
/** Supported locale type derived from SUPPORTED_LOCALES. */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Human-readable labels for each supported locale. */
export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
};

/** State shape for the i18n persistence store. */
export interface I18nState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

/** Zustand store for persisted locale preference. */
export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'zh',
      setLocale: (locale: SupportedLocale) => {
        i18next.changeLanguage(locale);
        set({ locale });
      },
    }),
    {
      name: 'alius-i18n-storage',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
