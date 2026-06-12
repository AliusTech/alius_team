import { Bell, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLayoutStore } from '@/stores/layout-store';
import { useNotificationStore } from '@/stores/notification-store';
import { cn } from '@/shared/utils/cn';

/** Phone-sized top bar with app title, notification bell, and inspector toggle. */
export function Topbar() {
  const { t } = useTranslation('common');
  const { inspectorCollapsed, toggleInspector, setBottomSheetOpen, setNotificationsDialogOpen } = useLayoutStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <header
      data-tauri-drag-region
      className="border-b border-border bg-card flex items-center justify-between px-4"
      style={{ paddingTop: 'var(--safe-area-top)', height: 'calc(var(--header-height) + var(--safe-area-top))' }}
    >
      <h1 data-tauri-drag-region className="text-base font-semibold text-foreground">{t('app.name')}</h1>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setNotificationsDialogOpen(true)}
          className="relative flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-h-[44px] min-w-[44px]"
          aria-label={t('floatingControls.notifications')}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
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
