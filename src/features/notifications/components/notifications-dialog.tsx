import { useTranslation } from 'react-i18next';
import { Bell, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDialog({ open, onClose }: NotificationsDialogProps) {
  const { t } = useTranslation('common');
  const { isPhone } = useBreakpoint();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={cn(
          'relative bg-card border border-border rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden',
          isPhone ? 'inset-0 rounded-none' : 'w-[900px] max-h-[85vh]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-muted-foreground" />
            <div>
              <h1 className="text-base font-semibold text-foreground">{t('floatingControls.notifications')}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{t('notifications.emptyHint', '暂无新通知')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 min-h-[300px]">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <Bell className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t('notifications.empty', '暂无通知')}</p>
        </div>
      </div>
    </div>
  );
}
