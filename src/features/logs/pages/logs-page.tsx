import { FileText, AlertTriangle, Info, Bug, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/design-system/primitives/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/design-system/primitives/tabs';
import { Card, CardContent } from '@/design-system/primitives/card';
import { PageHeader } from '@/design-system/components';
import { logs } from '@/shared/mocks/logs-data';

const levelConfig = {
  info: { icon: Info, variant: 'default' as const, label: 'INFO', color: '#2d6ff2' },
  warn: { icon: AlertTriangle, variant: 'warning' as const, label: 'WARN', color: '#d97706' },
  error: { icon: AlertCircle, variant: 'error' as const, label: 'ERROR', color: '#dc2626' },
  debug: { icon: Bug, variant: 'secondary' as const, label: 'DEBUG', color: '#64748b' },
};

function LogRow({ log }: { log: typeof logs[number] }) {
  const config = levelConfig[log.level];
  const Icon = config.icon;

  return (
    <Card className="transition-colors hover:bg-accent">
      <CardContent className="flex items-start gap-3">
        <Icon
          className="size-5 shrink-0 mt-0.5"
          style={{ color: config.color }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={config.variant}>
              {config.label}
            </Badge>
            <span className="text-xs font-medium text-foreground">{log.source}</span>
            <span className="text-xs text-muted-foreground ml-auto shrink-0">{log.timestamp}</span>
          </div>
          <p className="text-xs text-foreground truncate">{log.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LogList({ filter }: { filter?: string }) {
  const filtered = filter
    ? logs.filter(l => l.level === filter)
    : logs;

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((log) => (
        <LogRow key={log.id} log={log} />
      ))}
    </div>
  );
}

export function LogsPage() {
  const { t } = useTranslation('logs');
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('page.title')}
        description={t('page.description')}
        icon={FileText}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          <TabsTrigger value="info">{t('tabs.info')}</TabsTrigger>
          <TabsTrigger value="warn">{t('tabs.warn')}</TabsTrigger>
          <TabsTrigger value="error">{t('tabs.error')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all"><LogList /></TabsContent>
        <TabsContent value="info"><LogList filter="info" /></TabsContent>
        <TabsContent value="warn"><LogList filter="warn" /></TabsContent>
        <TabsContent value="error"><LogList filter="error" /></TabsContent>
      </Tabs>
    </div>
  );
}
