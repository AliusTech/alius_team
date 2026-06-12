import { useLocation } from 'react-router-dom';
import { Bot, ListTodo, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLayoutStore } from '@/stores/layout-store';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';
import { Separator } from '@/design-system/primitives/separator';

/** Context-aware detail panel content that switches based on the current route. */
function InspectorContent() {
  const { t } = useTranslation('common');
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('/agents')) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{t('inspector.agentDetails')}</span>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">
          {t('inspector.selectAgent')}
        </p>
      </div>
    );
  }

  if (path.includes('/tasks')) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ListTodo className="size-5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{t('inspector.taskDetails')}</span>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">
          {t('inspector.selectTask')}
        </p>
      </div>
    );
  }

  return (
    <p className="text-xs text-muted-foreground">
      {t('inspector.selectHint')}
    </p>
  );
}

/** Right-side detail panel — full-height on desktop, overlay on tablet. */
export function Inspector() {
  const { setInspectorCollapsed } = useLayoutStore();
  const { isTablet } = useBreakpoint();

  if (isTablet) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setInspectorCollapsed(true)}
        />
        <aside
          className="fixed right-0 z-40 bg-card border-l border-border shadow-xl flex flex-col"
          style={{
            top: 'var(--safe-area-top)',
            bottom: 0,
            width: 'min(var(--inspector-width), 85vw)',
          }}
        >
          <div style={{ height: 'var(--inspector-header-height)' }} className="border-b border-border flex items-center justify-between px-3.5 shrink-0">
            <span className="text-xs font-medium text-foreground">Details</span>
            <button
              onClick={() => setInspectorCollapsed(true)}
              className="flex items-center justify-center size-7 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px]"
              aria-label="Close inspector"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <InspectorContent />
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside style={{ width: 'var(--inspector-width)' }} className="h-full border-l border-border bg-card flex flex-col shrink-0">
      <div style={{ height: 'var(--inspector-header-height)' }} className="border-b border-border flex items-center justify-between px-3.5 shrink-0">
        <span className="text-xs font-medium text-foreground">Details</span>
        <button
          onClick={() => setInspectorCollapsed(true)}
          className="flex items-center justify-center size-7 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px]"
          aria-label="Close inspector"
        >
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <InspectorContent />
      </div>
    </aside>
  );
}
