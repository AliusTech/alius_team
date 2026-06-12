import {
  Bell,
  Settings,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLayoutStore } from '@/stores/layout-store';
import { cn } from '@/shared/utils/cn';

export function FloatingControls() {
  const { t } = useTranslation('common');
  const { inspectorCollapsed, toggleInspector, setSettingsDialogOpen, setNotificationsDialogOpen } = useLayoutStore();

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{ top: 'calc(var(--safe-area-top, 0px) + 16px)', right: '24px' }}
    >
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-xl border border-border bg-card/80 px-1.5 py-1 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => setNotificationsDialogOpen(true)}
          aria-label={t('floatingControls.notifications')}
          className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-h-[44px] min-w-[44px]"
        >
          <Bell className="size-4" />
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
