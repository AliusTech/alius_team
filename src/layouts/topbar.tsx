import { Bell, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLayoutStore } from '@/stores/layout-store';
import { cn } from '@/shared/utils/cn';

export function Topbar() {
  const { t } = useTranslation('common');
  const { inspectorCollapsed, toggleInspector, setBottomSheetOpen, setNotificationsDialogOpen } = useLayoutStore();

  return (
    <header
      className="border-b border-border bg-card flex items-center justify-between px-4"
      style={{ paddingTop: 'var(--safe-area-top)', height: 'calc(3.5rem + var(--safe-area-top))' }}
    >
      <h1 className="text-base font-semibold text-foreground">Alius Team</h1>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setNotificationsDialogOpen(true)}
          className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-h-[44px] min-w-[44px]"
          aria-label={t('floatingControls.notifications')}
        >
          <Bell className="size-5" />
        </button>
        <button
          onClick={inspectorCollapsed ? () => setBottomSheetOpen(true) : toggleInspector}
          aria-label={
            inspectorCollapsed
              ? t('floatingControls.openInspector')
              : t('floatingControls.closeInspector')
          }
          className={cn(
            'flex items-center justify-center size-9 rounded-lg transition-colors min-h-[44px] min-w-[44px]',
            inspectorCollapsed
              ? 'text-muted-foreground hover:bg-accent'
              : 'bg-primary/10 text-primary hover:bg-primary/15'
          )}
        >
          {inspectorCollapsed ? (
            <PanelRightOpen className="size-5" />
          ) : (
            <PanelRightClose className="size-5" />
          )}
        </button>
      </div>
    </header>
  );
}
