import { useI18nStore, SUPPORTED_LOCALES, LOCALE_LABELS } from '@/i18n/i18n-store';
import { Globe, Check } from 'lucide-react';

/** Language selection list with a check mark on the active locale. */
export function LanguageSwitcher() {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  return (
    <div className="flex flex-col">
      {SUPPORTED_LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className="flex items-center gap-3 py-3 w-full -mx-4 px-4 rounded-xl transition-colors hover:bg-accent cursor-pointer"
        >
          <Globe className="size-5 text-muted-foreground shrink-0" />
          <span className="flex-1 text-left text-xs font-medium text-foreground">
            {LOCALE_LABELS[loc]}
          </span>
          {locale === loc && (
            <Check className="size-4 text-primary shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}
