import { useState, useCallback } from 'react';
import { ListTodo, Plus, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/design-system/primitives/button';
import { Badge } from '@/design-system/primitives/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/design-system/primitives/tabs';
import { Card, CardContent } from '@/design-system/primitives/card';
import { PageHeader, DeleteConfirmDialog, UndoToast, InfiniteScroll, AnimatedEmptyState } from '@/design-system/components';
import type { TaskItem } from '@/shared/mocks/tasks-data';
import { useTasksQuery } from '../hooks/use-tasks-query';
import { useDeletableList } from '@/shared/hooks/use-deletable-list';
import { usePullRefresh } from '@/shared/hooks/use-pull-refresh';
import { ListItemWrapper, BatchActionBar, KeyboardDeleteHandler } from '@/platform';
import { usePlatformInput } from '@/platform/use-platform-input';

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

function TaskSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-4 w-10 rounded-full bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-muted" />
          <div className="h-2 w-3/4 rounded bg-muted" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-2 w-12 rounded bg-muted" />
          <div className="h-2 w-16 rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

function TaskCard({ task }: { task: TaskItem }) {
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

function TabContent({ status }: { status: string }) {
  const { t } = useTranslation(['tasks', 'common']);
  const { interactionMode } = usePlatformInput();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useTasksQuery(status);

  const allItems: TaskItem[] = data?.pages.flatMap((p) => p.items) ?? [];
  const isEmpty = !isLoading && allItems.length === 0;

  const [localItems, setLocalItems] = useState<TaskItem[]>(allItems);
  const displayItems = localItems.length > 0 ? localItems : allItems;

  const list = useDeletableList<TaskItem>({
    items: displayItems,
    deleteOne: async () => {},
    deleteBatch: async () => {},
    onItemsChange: setLocalItems,
  });

  const handleDeleteOne = useCallback((id: string) => { list.deleteOne(id); }, [list]);

  const { onTouchStart, onTouchMove, onTouchEnd } = usePullRefresh({ onRefresh: () => refetch() });

  return (
    <>
      <div
        className="flex-1 overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center justify-end mb-2">
          <Button variant="ghost" size="icon" className="size-7" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`size-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <TaskSkeleton key={i} />)}
          </div>
        ) : isEmpty ? (
          <AnimatedEmptyState illustration="no-tasks" title={t('tasks:empty', '暂无任务')} description={t('tasks:emptyDesc', '点击右上角添加任务')} />
        ) : (
          <InfiniteScroll
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          >
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {list.items.map((task) => (
                <ListItemWrapper
                  key={task.id}
                  id={task.id}
                  isSelected={list.selectedIds.has(task.id)}
                  isSelectMode={list.isSelectMode}
                  onSelect={list.toggleSelect}
                  onDelete={handleDeleteOne}
                  onEnterSelectMode={list.enterSelectMode}
                >
                  <TaskCard task={task} />
                </ListItemWrapper>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>

      {list.isSelectMode && (
        <BatchActionBar
          selectedCount={list.selectedIds.size}
          onDelete={list.deleteSelected}
          onClearSelection={list.exitSelectMode}
        />
      )}

      <DeleteConfirmDialog
        open={list.isConfirmOpen}
        onConfirm={list.confirmDelete}
        onCancel={list.cancelDelete}
        count={list.pendingDeleteIds.length}
        itemName={list.pendingDeleteName}
      />

      <UndoToast
        visible={list.undoAvailable}
        count={list.pendingDeleteIds.length}
        onUndo={list.undoDelete}
        onDismiss={() => {}}
      />

      {interactionMode === 'mouse' && (
        <KeyboardDeleteHandler
          focusedId={list.focusedId}
          onDelete={handleDeleteOne}
          onExitSelectMode={list.exitSelectMode}
          onSelectAll={list.selectAll}
        />
      )}
    </>
  );
}

export function TasksPage() {
  const { t } = useTranslation('tasks');
  const [activeTab, setActiveTab] = useState('all');

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          <TabsTrigger value="running">{t('tabs.running')}</TabsTrigger>
          <TabsTrigger value="completed">{t('tabs.completed')}</TabsTrigger>
          <TabsTrigger value="error">{t('tabs.error')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all"><TabContent status="all" /></TabsContent>
        <TabsContent value="running"><TabContent status="running" /></TabsContent>
        <TabsContent value="completed"><TabContent status="completed" /></TabsContent>
        <TabsContent value="error"><TabContent status="error" /></TabsContent>
      </Tabs>
    </div>
  );
}
