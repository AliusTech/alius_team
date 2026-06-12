import { useState, useEffect } from 'react';
import { User, Shield, Monitor, Palette, Info, Globe, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/primitives/card';
import { Separator } from '@/design-system/primitives/separator';
import { Select } from '@/design-system/primitives/select';
import type { SelectOption } from '@/design-system/primitives/select';
import { useI18nStore, SUPPORTED_LOCALES, LOCALE_LABELS, type SupportedLocale } from '@/i18n/i18n-store';
import { useThemeStore, type ThemeMode } from '@/stores/theme-store';

type UpdateStatus = 'idle' | 'checking' | 'upToDate' | 'newVersion' | 'error';

interface SettingsItem {
  icon: React.ElementType;
  label: string;
  description: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

function SettingsSection({ title, items }: { title: string; items: SettingsItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {items.map((item, i) => (
          <div key={item.label}>
            <div
              className="flex items-center gap-3 py-3 cursor-pointer hover:bg-accent -mx-4 px-4 rounded-xl transition-colors"
              onClick={item.onClick}
            >
              <item.icon className="size-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              {item.trailing ?? <span className="text-muted-foreground text-sm">&#8250;</span>}
            </div>
            {i < items.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { t } = useTranslation('settings');
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const [version, setVersion] = useState('');
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { getVersion } = await import('@tauri-apps/api/app');
        setVersion(await getVersion());
      } catch {
        setVersion('0.1.0');
      }
    })();
  }, []);

  const checkForUpdate = async () => {
    setUpdateStatus('checking');
    try {
      const res = await fetch('https://api.github.com/repos/AliusTech/alius_team/releases/latest');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const remote = data.tag_name.replace(/^v/, '');
      setLatestVersion(remote);
      if (remote !== version) {
        setUpdateStatus('newVersion');
      } else {
        setUpdateStatus('upToDate');
      }
    } catch {
      setUpdateStatus('error');
    }
  };

  const updateMessage = (() => {
    switch (updateStatus) {
      case 'checking': return t('update.checking');
      case 'upToDate': return t('update.upToDate');
      case 'newVersion': return t('update.newVersion', { version: latestVersion });
      case 'error': return t('update.error');
      default: return null;
    }
  })();

  const themeOptions: SelectOption<ThemeMode>[] = [
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
    { value: 'system', label: t('theme.system') },
  ];

  const localeOptions: SelectOption<SupportedLocale>[] = SUPPORTED_LOCALES.map((loc) => ({
    value: loc,
    label: LOCALE_LABELS[loc],
  }));

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: t('sections.account'),
      items: [
        { icon: User, label: t('items.profile'), description: t('items.profileDesc') },
        { icon: Shield, label: t('items.security'), description: t('items.securityDesc') },
      ],
    },
    {
      title: t('sections.devices'),
      items: [
        { icon: Monitor, label: t('items.devices'), description: t('items.devicesDesc') },
        {
          icon: Palette,
          label: t('items.appearance'),
          description: t('items.appearanceDesc'),
          trailing: <Select value={mode} options={themeOptions} onChange={setMode} />,
        },
        {
          icon: Globe,
          label: t('language.title'),
          description: t('language.description'),
          trailing: <Select value={locale} options={localeOptions} onChange={setLocale} />,
        },
      ],
    },
    {
      title: t('sections.about'),
      items: [
        {
          icon: Info,
          label: t('items.about'),
          description: t('items.aboutDesc'),
          trailing: version ? <span className="text-xs text-muted-foreground">v{version}</span> : null,
        },
        {
          icon: RefreshCw,
          label: t('items.checkUpdate'),
          description: updateMessage ?? t('items.checkUpdateDesc'),
          onClick: checkForUpdate,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {settingsSections.map((section) => (
        <SettingsSection key={section.title} title={section.title} items={section.items} />
      ))}
    </div>
  );
}
