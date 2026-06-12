import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const NAMESPACES = ['common', 'dashboard', 'agents', 'tasks', 'logs', 'settings', 'auth'];

const zustandPersistDetector = {
  name: 'zustandPersist' as const,
  lookup(): string | undefined {
    try {
      const raw = localStorage.getItem('alius-i18n-storage');
      if (raw) {
        const data = JSON.parse(raw);
        const locale = data?.state?.locale;
        if (locale && ['zh', 'en', 'ja'].includes(locale)) return locale;
      }
    } catch { /* ignore */ }
    return undefined;
  },
  cacheUserLanguage() { /* Zustand handles persistence */ },
};

function mapDetectedLocale(detected: string): string {
  if (detected.startsWith('zh')) return 'zh';
  if (detected.startsWith('ja')) return 'ja';
  return 'zh';
}

/** i18next configuration with HTTP backend for lazy-loaded locale files. */
i18next
  .use(HttpBackend)
  .use({
    type: 'languageDetector' as const,
    async: false,
    init: () => {},
    detect: () => {
      const fromZustand = zustandPersistDetector.lookup();
      if (fromZustand) return fromZustand;
      const nav = navigator.language;
      return mapDetectedLocale(nav);
    },
    cacheUserLanguage: () => {},
  })
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en', 'ja'],
    ns: NAMESPACES,
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
