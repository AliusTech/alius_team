import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/design-system/primitives/button';
import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';

interface DeleteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  count: number;
  itemName?: string;
}

export function DeleteConfirmDialog({ open, onConfirm, onCancel, count, itemName }: DeleteConfirmDialogProps) {
  const { t } = useTranslation('common');
  const { isPhone } = useBreakpoint();

  if (!open) return null;

  const message =
    count === 1 && itemName
      ? t('deletion.confirmMessageOne', { name: itemName })
      : t('deletion.confirmMessage', { count });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className={cn(
          'relative bg-card border border-border rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden',
          isPhone ? 'mx-4 w-full' : 'w-[380px]',
        )}
      >
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="size-4 text-destructive" />
            </div>
            <p className="text-sm font-semibold text-foreground">{t('deletion.confirmTitle')}</p>
          </div>
          <p className="text-sm text-muted-foreground pl-12">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {t('deletion.cancelAction')}
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            {t('deletion.confirmAction')}
          </Button>
        </div>
      </div>
    </div>
  );
}
