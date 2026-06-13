import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/design-system/primitives/button';
import { Input } from '@/design-system/primitives/input';
import { Badge } from '@/design-system/primitives/badge';
import { Card, CardContent } from '@/design-system/primitives/card';
import { PageHeader, DeleteConfirmDialog, UndoToast, InfiniteScroll, AnimatedEmptyState } from '@/design-system/components';
import type { AgentItem } from '@/shared/mocks/agents-data';
import { useAgentsQuery } from '../hooks/use-agents-query';
import { useDeletableList } from '@/shared/hooks/use-deletable-list';
import { usePullRefresh } from '@/shared/hooks/use-pull-refresh';
import { ListItemWrapper, BatchActionBar, KeyboardDeleteHandler } from '@/platform';
import { usePlatformInput } from '@/platform/use-platform-input';
import { deleteAgent, deleteAgentsBatch } from '@/data/db/commands';

const statusVariant = {
  running: 'running' as const,
  idle: 'idle' as const,
  error: 'error' as const,
};

function AgentSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-muted" />
            <div className="space-y-1">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-2 w-24 rounded bg-muted" />
            </div>
          </div>
          <div className="h-4 w-10 rounded-full bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted px-2 py-1 h-9" />
          <div className="rounded-lg bg-muted px-2 py-1 h-9" />
        </div>
        <div className="h-2 w-20 rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export function AgentsPage() {
  const { t } = useTranslation(['agents', 'common']);
  const { interactionMode } = usePlatformInput();
  const [search, setSearch] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useAgentsQuery(search);

  const allItems: AgentItem[] = data?.pages.flatMap((p) => p.items) ?? [];
  const isEmpty = !isLoading && allItems.length === 0;

  const [localItems, setLocalItems] = useState<AgentItem[]>(allItems);
  const displayItems = localItems.length > 0 ? localItems : allItems;

  const list = useDeletableList<AgentItem>({
    items: displayItems,
    deleteOne: async (id) => { await deleteAgent(id); },
    deleteBatch: async (ids) => { await deleteAgentsBatch(ids); },
    onItemsChange: setLocalItems,
  });

  const handleDeleteOne = useCallback((id: string) => { list.deleteOne(id); }, [list]);

  const { onTouchStart, onTouchMove, onTouchEnd } = usePullRefresh({ onRefresh: () => refetch() });

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

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t('agents:page.searchPlaceholder')}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={`size-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isLoading ? (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => <AgentSkeleton key={i} />)}
          </div>
        ) : isEmpty ? (
          <AnimatedEmptyState illustration="no-agents" title={t('agents:empty', '暂无智能体')} description={t('agents:emptyDesc', '点击右上角添加智能体')} />
        ) : (
          <InfiniteScroll
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          >
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {list.items.map((agent) => (
                <ListItemWrapper
                  key={agent.id}
                  id={agent.id}
                  isSelected={list.selectedIds.has(agent.id)}
                  isSelectMode={list.isSelectMode}
                  onSelect={list.toggleSelect}
                  onDelete={handleDeleteOne}
                  onEnterSelectMode={list.enterSelectMode}
                  isSwipeOpen={list.openSwipeId === agent.id}
                  onSwipeOpenChange={(open) => list.setOpenSwipeId(open ? agent.id : null)}
                >
                  <Card className="cursor-pointer hover:bg-accent transition-colors">
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
    </div>
  );
}
