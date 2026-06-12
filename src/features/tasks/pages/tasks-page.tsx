import { ListTodo, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/design-system/primitives/button';
import { Badge } from '@/design-system/primitives/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/design-system/primitives/tabs';
import { Card, CardContent } from '@/design-system/primitives/card';
import { PageHeader } from '@/design-system/components';
import { tasks } from '@/shared/mocks/tasks-data';

const statusVariant = {
  running: 'running' as const,
  completed: 'completed' as const,
  error: 'error' as const,
  pending: 'idle' as const,
};

const statusKey: Record<string, string> = {
  running: 'common:status.running',
  completed: 'common:status.completed',
  error: 'common:status.failed',
  pending: 'common:status.pending',
};

function TaskCard({ task }: { task: typeof tasks[number] }) {
  const { t } = useTranslation();
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xs font-medium text-foreground">{task.name}</h3>
          <Badge variant={statusVariant[task.status]}>
            {t(statusKey[task.status])}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>{task.agent}</span>
          <span>{task.lastRun}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskGrid({ filter }: { filter?: string }) {
  const filtered = filter
    ? tasks.filter(t => t.status === filter)
    : tasks;

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export function TasksPage() {
  const { t } = useTranslation('tasks');
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('page.title')}
        description={t('page.description')}
        icon={ListTodo}
        action={
          <Button size="sm">
            <Plus className="size-4 mr-1" />
            {t('common:actions.add')}
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          <TabsTrigger value="running">{t('tabs.running')}</TabsTrigger>
          <TabsTrigger value="completed">{t('tabs.completed')}</TabsTrigger>
          <TabsTrigger value="error">{t('tabs.error')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all"><TaskGrid /></TabsContent>
        <TabsContent value="running"><TaskGrid filter="running" /></TabsContent>
        <TabsContent value="completed"><TaskGrid filter="completed" /></TabsContent>
        <TabsContent value="error"><TaskGrid filter="error" /></TabsContent>
      </Tabs>
    </div>
  );
}
