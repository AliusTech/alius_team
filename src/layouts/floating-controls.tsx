import {
  Bell,
  Settings,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLayoutStore } from '@/stores/layout-store';
import { useNotificationStore } from '@/stores/notification-store';
import { cn } from '@/shared/utils/cn';

/** Floating control bar with notification, settings, and inspector toggle buttons. */
export function FloatingControls() {
  const { t } = useTranslation('common');
  const { inspectorCollapsed, toggleInspector, setSettingsDialogOpen, setNotificationsDialogOpen } = useLayoutStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{ top: 'calc(var(--safe-area-top) + var(--floating-controls-top))', right: 'var(--floating-controls-right)' }}
    >
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-xl border border-border bg-card/80 px-1.5 py-1 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => setNotificationsDialogOpen(true)}
          aria-label={t('floatingControls.notifications')}
          className="relative flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-h-[44px] min-w-[44px]"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-semibold flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSettingsDialogOpen(true)}
          aria-label={t('floatingControls.settings')}
          className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-h-[44px] min-w-[44px]"
        >
          <Settings className="size-4" />
        </button>

        <button
          onClick={toggleInspector}
          aria-label={
            inspectorCollapsed
              ? t('floatingControls.openInspector')
              : t('floatingControls.closeInspector')
          }
          className={cn(
            'flex items-center justify-center size-9 rounded-lg transition-colors min-h-[44px] min-w-[44px]',
            inspectorCollapsed
              ? 'text-muted-foreground hover:bg-accent'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          {inspectorCollapsed ? (
            <PanelRightOpen className="size-4" />
          ) : (
            <PanelRightClose className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
