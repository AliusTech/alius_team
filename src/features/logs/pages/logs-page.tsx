import { useState, useCallback } from 'react';
import { FileText, AlertTriangle, Info, Bug, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/design-system/primitives/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/design-system/primitives/tabs';
import { Card, CardContent } from '@/design-system/primitives/card';
import { PageHeader, DeleteConfirmDialog, UndoToast } from '@/design-system/components';
import { logs as initialLogs, type LogEntry } from '@/shared/mocks/logs-data';
import { useDeletableList } from '@/shared/hooks/use-deletable-list';
import { ListItemWrapper, BatchActionBar, KeyboardDeleteHandler } from '@/platform';
import { usePlatformInput } from '@/platform/use-platform-input';

const levelConfig = {
  info: { icon: Info, variant: 'default' as const, label: 'INFO', color: '#2d6ff2' },
  warn: { icon: AlertTriangle, variant: 'warning' as const, label: 'WARN', color: '#d97706' },
  error: { icon: AlertCircle, variant: 'error' as const, label: 'ERROR', color: '#dc2626' },
  debug: { icon: Bug, variant: 'secondary' as const, label: 'DEBUG', color: '#64748b' },
};

function LogRow({ log }: { log: LogEntry }) {
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

function LogList({ items, list }: { items: LogEntry[]; list: ReturnType<typeof useDeletableList<LogEntry>> }) {
  const handleDeleteOne = useCallback(
    (id: string) => {
      list.deleteOne(id);
    },
    [list],
  );

  return (
    <div className="flex flex-col gap-3">
      {items.map((log) => (
        <ListItemWrapper
          key={log.id}
          id={log.id}
          isSelected={list.selectedIds.has(log.id)}
          isSelectMode={list.isSelectMode}
          onSelect={list.toggleSelect}
          onDelete={handleDeleteOne}
          onEnterSelectMode={list.enterSelectMode}
        >
          <LogRow log={log} />
        </ListItemWrapper>
      ))}
    </div>
  );
}

/** Logs page displaying system log entries filterable by severity level with platform-adaptive deletion. */
export function LogsPage() {
  const { t } = useTranslation('logs');
  const { interactionMode } = usePlatformInput();
  const [items, setItems] = useState<LogEntry[]>(initialLogs);

  const list = useDeletableList<LogEntry>({
    items,
    deleteOne: async () => {},
    deleteBatch: async () => {},
    onItemsChange: setItems,
  });

  const filteredAll = items;
  const filteredInfo = items.filter((l) => l.level === 'info');
  const filteredWarn = items.filter((l) => l.level === 'warn');
  const filteredError = items.filter((l) => l.level === 'error');

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

        <TabsContent value="all"><LogList items={filteredAll} list={list} /></TabsContent>
        <TabsContent value="info"><LogList items={filteredInfo} list={list} /></TabsContent>
        <TabsContent value="warn"><LogList items={filteredWarn} list={list} /></TabsContent>
        <TabsContent value="error"><LogList items={filteredError} list={list} /></TabsContent>
      </Tabs>

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
          onDelete={(id) => list.deleteOne(id)}
          onExitSelectMode={list.exitSelectMode}
          onSelectAll={list.selectAll}
        />
      )}
    </div>
  );
}
