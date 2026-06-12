import { useTranslation } from 'react-i18next';
import { Users, Search, Plus } from 'lucide-react';
import { Button } from '@/design-system/primitives/button';
import { Input } from '@/design-system/primitives/input';
import { Badge } from '@/design-system/primitives/badge';
import { Card, CardContent } from '@/design-system/primitives/card';
import { PageHeader } from '@/design-system/components';
import { agents } from '@/shared/mocks/agents-data';

const statusVariant = {
  running: 'running' as const,
  idle: 'idle' as const,
  error: 'error' as const,
};

export function AgentsPage() {
  const { t } = useTranslation(['agents', 'common']);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('agents:page.title')}
        description={t('agents:page.description')}
        icon={Users}
        action={
          <Button size="sm">
            <Plus className="size-4 mr-1" />
            {t('agents:page.addAgent')}
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder={t('agents:page.searchPlaceholder')} className="pl-9" />
      </div>

      {/* Agent cards grid */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <Badge variant={statusVariant[agent.status]}>
                  {t(`common:status.${agent.status}`)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted px-2 py-1">
                  <span className="text-xs text-muted-foreground">{t('agents:todayTasks')}</span>
                  <p className="text-xs font-medium text-foreground">{agent.todayTasks}</p>
                </div>
                <div className="rounded-lg bg-muted px-2 py-1">
                  <span className="text-xs text-muted-foreground">Token</span>
                  <p className="text-xs font-medium text-foreground">{agent.tokenUsage}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {t('agents:lastActive')}：{agent.lastActive}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
