import { useState, useEffect } from 'react';
import { User, Shield, Monitor, Palette, Info, Globe, RefreshCw, Users, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { check } from '@tauri-apps/plugin-updater';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/primitives/card';
import { Separator } from '@/design-system/primitives/separator';
import { Select } from '@/design-system/primitives/select';
import type { SelectOption } from '@/design-system/primitives/select';
import { useI18nStore, SUPPORTED_LOCALES, LOCALE_LABELS, type SupportedLocale } from '@/i18n/i18n-store';
import { useThemeStore, type ThemeMode } from '@/stores/theme-store';
import { useTeamStore } from '@/stores/team-store';
import { useUpdateStore } from '@/stores/update-store';

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

/** Settings page with sections for account, devices, appearance, language, and updates. */
export function SettingsPage() {
  const { t } = useTranslation('settings');
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const teamName = useTeamStore((s) => s.teamName);
  const setTeamName = useTeamStore((s) => s.setTeamName);
  const adminName = useTeamStore((s) => s.adminName);
  const setAdminName = useTeamStore((s) => s.setAdminName);

  const [version, setVersion] = useState('');
  const updateStatus = useUpdateStore((s) => s.status);
  const updateInfo = useUpdateStore((s) => s.updateInfo);
  const { setChecking, setAvailable, setUpToDate, setError } = useUpdateStore();

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
    setChecking();
    try {
      const update = await check();
      if (update) {
        setAvailable({
          version: update.version,
          date: update.date?.toString(),
          body: update.body ?? undefined,
        });
      } else {
        setUpToDate();
      }
    } catch {
      setError(t('update.error'));
    }
  };

  const updateMessage = (() => {
    switch (updateStatus) {
      case 'checking': return t('update.checking');
      case 'upToDate': return t('update.upToDate');
      case 'available': return t('update.newVersion', { version: updateInfo?.version });
      case 'downloading': return t('update.downloading');
      case 'downloaded': return t('update.downloaded');
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
        {
          icon: Users,
          label: t('items.teamName'),
          description: t('items.teamNameDesc'),
          trailing: (
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={t('items.teamNamePlaceholder')}
              className="w-40 h-7 px-2 rounded-md bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-right"
            />
          ),
        },
        {
          icon: UserCheck,
          label: t('items.adminName'),
          description: t('items.adminNameDesc'),
          trailing: (
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder={t('items.adminNamePlaceholder')}
              className="w-40 h-7 px-2 rounded-md bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-right"
            />
          ),
        },
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
