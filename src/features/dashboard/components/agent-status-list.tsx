import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system/primitives/card';
import { agentStatusData, type AgentStatus } from '@/shared/mocks/dashboard-data';

const statusDotColor: Record<AgentStatus['status'], string> = {
  active: '#2d6ff2',
  idle: '#64748b',
  error: '#dc2626',
};

/** List showing current status of all agents with online/offline indicators. */
export function AgentStatusList() {
  const { t } = useTranslation('dashboard');

  return (
    <Card variant="flush">
      <CardHeader bordered className="px-3.5 pt-3 pb-3">
        <CardTitle>{t('agentStatus.title')}</CardTitle>
      </CardHeader>

      <CardContent>
        {agentStatusData.map((agent, index) => {
          const isLast = index === agentStatusData.length - 1;
          const Icon = agent.icon;

          return (
            <div
              key={agent.id}
              className={`flex items-center gap-2 px-3 py-2 ${
                !isLast ? 'border-b border-border' : ''
              }`}
            >
              <div
                className="flex size-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: agent.avatarBg }}
              >
                <Icon className="size-3.5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">
                  {agent.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('agentStatus.todayTasks', { count: agent.taskCount })}
                </p>
              </div>

              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: statusDotColor[agent.status] }}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
