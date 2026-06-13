import { useTranslation } from 'react-i18next';
import { Bot, Bell, CheckCircle2 } from 'lucide-react';
import type { PushNotification, NotificationCategory } from '@/data/realtime/types';
import type { SupportedLocale } from '@/i18n/i18n-store';
import { formatDate } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';
import { ListItemWrapper } from '@/platform';

interface NotificationItemProps {
  notification: PushNotification;
  locale: SupportedLocale;
  onOpen: (n: PushNotification) => void;
  onDelete: (id: string) => void;
  isSwipeOpen?: boolean;
  onSwipeOpenChange?: (open: boolean) => void;
}

function categoryIcon(category: NotificationCategory) {
  if (category === 'agent') return Bot;
  if (category === 'task') return CheckCircle2;
  return Bell;
}

/** Renders a single notification with icon, title, body, and platform-adaptive delete action. */
export function NotificationItem({
  notification,
  locale,
  onOpen,
  onDelete,
  isSwipeOpen,
  onSwipeOpenChange,
}: NotificationItemProps) {
  const { t } = useTranslation('common');
  const Icon = categoryIcon(notification.category);
  const isHigh = notification.priority === 'high';

  return (
    <ListItemWrapper
      id={notification.id}
      isSelected={false}
      isSelectMode={false}
      onSelect={() => {}}
      onDelete={onDelete}
      isSwipeOpen={isSwipeOpen}
      onSwipeOpenChange={onSwipeOpenChange}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(notification)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(notification);
          }
        }}
        className={cn(
          'flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 border-b border-border last:border-b-0',
          !notification.is_read && 'bg-primary/[0.04]',
        )}
      >
        <div
          className={cn(
            'mt-0.5 size-8 shrink-0 rounded-full flex items-center justify-center',
            isHigh ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn('text-sm font-medium text-foreground truncate', !notification.is_read && 'font-semibold')}>
              {notification.title}
            </p>
            {!notification.is_read && (
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.body}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
              {t(`notifications.category.${notification.category}`)}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              {formatDate(notification.created_at, locale)}
            </span>
          </div>
        </div>
      </div>
    </ListItemWrapper>
  );
}
