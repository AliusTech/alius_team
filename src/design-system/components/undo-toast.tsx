import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Undo2, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';

interface UndoToastProps {
  visible: boolean;
  count: number;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ visible, count, onUndo, onDismiss }: UndoToastProps) {
  const { t } = useTranslation('common');
  const { isPhone } = useBreakpoint();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed z-50 flex items-center gap-3 rounded-[14px] bg-card border border-border shadow-lg px-4 py-2.5',
        isPhone ? 'bottom-[calc(var(--bottom-nav-height,0px)+16px)] left-4 right-4' : 'bottom-6 left-1/2 -translate-x-1/2',
      )}
    >
      <p className="text-sm text-foreground flex-1">{t('deletion.deleted', { count })}</p>
      <button
        type="button"
        onClick={onUndo}
        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
      >
        <Undo2 className="size-3.5" />
        {t('deletion.undo')}
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="size-6 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
