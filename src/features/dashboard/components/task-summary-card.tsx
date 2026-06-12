import { ListTodo, Play, Pause, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/primitives/card';
import type { TaskSummary } from '../types';

/** Props for the TaskSummaryCard component. */
interface TaskSummaryCardProps {
  data: TaskSummary | undefined;
  isLoading: boolean;
}

/** Card displaying task status counts (running, waiting, completed, failed). */
export function TaskSummaryCard({ data, isLoading }: TaskSummaryCardProps) {
  const { t } = useTranslation('dashboard');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="w-5 h-5" />
            {t('taskSummary.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="w-5 h-5" />
          {t('taskSummary.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main stat */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{data?.running || 0}</p>
            <p className="text-sm text-muted-foreground">{t('taskSummary.runningTasks')}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-md bg-orange-50 dark:bg-orange-950 border-2 border-orange-200 dark:border-orange-800">
            <Pause className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm font-medium">{data?.waitingApproval || 0}</p>
              <p className="text-xs text-muted-foreground">{t('taskSummary.waitingApproval')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 dark:bg-green-950">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">{data?.completed || 0}</p>
              <p className="text-xs text-muted-foreground">{t('taskSummary.completed')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 dark:bg-red-950">
            <XCircle className="w-4 h-4 text-red-600" />
            <div>
              <p className="text-sm font-medium">{data?.failed || 0}</p>
              <p className="text-xs text-muted-foreground">{t('taskSummary.failed')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}