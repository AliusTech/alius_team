import { ChevronRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system/primitives/card';
import { Badge } from '@/design-system/primitives/badge';
import { recentTasks, type RecentTask } from '@/shared/mocks/dashboard-data';

function StatusIcon({ status }: { status: RecentTask['status'] }) {
  switch (status) {
    case 'running':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="#2d6ff2" strokeWidth="1.5" fill="none" />
          <path d="M5.5 3v3l2 1.5" stroke="#2d6ff2" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'completed':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="#16a34a" strokeWidth="1" fill="none" />
          <path d="M3.5 5.5l1.5 1.5 3-3" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="#dc2626" strokeWidth="1" fill="none" />
          <path d="M4 4l3 3M7 4l-3 3" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="3" fill="#64748b" />
        </svg>
      );
  }
}

export function RecentTasksList() {
  const { t } = useTranslation(['dashboard', 'common']);

  const statusConfig: Record<RecentTask['status'], { labelKey: string; variant: 'running' | 'completed' | 'error' | 'idle' }> = {
    running: { labelKey: 'common:status.running', variant: 'running' },
    completed: { labelKey: 'common:status.completed', variant: 'completed' },
    error: { labelKey: 'common:status.error', variant: 'error' },
    idle: { labelKey: 'common:status.idle', variant: 'idle' },
  };

  return (
    <Card variant="flush">
      <CardHeader bordered className="px-3.5 py-3">
        <CardTitle>{t('recentTasks.title')}</CardTitle>
        <button className="flex items-center gap-0.5 text-primary">
          <span className="text-xs font-medium">{t('recentTasks.viewAll')}</span>
          <ChevronRight className="size-3" />
        </button>
      </CardHeader>

      <CardContent>
        {recentTasks.map((task, index) => {
          const isLast = index === recentTasks.length - 1;
          const config = statusConfig[task.status];

          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 px-3.5 py-3 ${
                !isLast ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {task.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="size-2.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {task.team} · {t('recentTasks.agentCount', { count: task.agentCount })}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {task.time}
                  </span>
                </div>
              </div>

              {task.status === 'running' && task.progress != null && (
                <div className="w-21 shrink-0 hidden sm:block">
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    <span className="text-xs text-muted-foreground">{task.eta}</span>
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <Badge variant={config.variant} className="shrink-0">
                <StatusIcon status={task.status} />
                {t(config.labelKey)}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
