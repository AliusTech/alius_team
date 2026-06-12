import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';
import { useNotificationStore } from '@/stores/notification-store';
import { useI18nStore } from '@/i18n/i18n-store';
import type { PushNotification } from '@/data/realtime/types';
import { NotificationItem } from './notification-item';

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDialog({ open, onClose }: NotificationsDialogProps) {
  const { t } = useTranslation('common');
  const { isPhone } = useBreakpoint();
  const locale = useI18nStore((s) => s.locale);

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isLoading = useNotificationStore((s) => s.isLoading);
  const loadNotifications = useNotificationStore((s) => s.loadNotifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const remove = useNotificationStore((s) => s.remove);
  const clearAll = useNotificationStore((s) => s.clearAll);

  useEffect(() => {
    if (open) loadNotifications();
  }, [open, loadNotifications]);

  if (!open) return null;

  const hasItems = notifications.length > 0;

  const handleOpen = async (n: PushNotification) => {
    if (!n.is_read) await markRead(n.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={cn(
          'relative bg-card border border-border rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden',
          isPhone ? 'inset-0 rounded-none' : 'w-[520px] max-h-[85vh]'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-muted-foreground" />
            <div>
              <h1 className="text-base font-semibold text-foreground">{t('notifications.title')}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount > 0 ? t('notifications.unread', { count: unreadCount }) : t('notifications.emptyHint')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
            aria-label={t('actions.cancel')}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {hasItems ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  locale={locale}
                  onOpen={handleOpen}
                  onDelete={remove}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-border bg-muted/30">
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCheck className="size-3.5" />
                {t('notifications.markAllRead')}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="size-3.5" />
                {t('notifications.clearAll')}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 min-h-[300px]">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
              <Bell className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isLoading ? t('app.loading') : t('notifications.empty')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
