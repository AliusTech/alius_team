import { useTranslation } from 'react-i18next';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/design-system/primitives/button';
import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';

interface BatchActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
  className?: string;
}

export function BatchActionBar({ selectedCount, onDelete, onClearSelection, className }: BatchActionBarProps) {
  const { t } = useTranslation('common');
  const { isPhone } = useBreakpoint();

  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 flex items-center justify-between px-4 py-3',
        'bg-card border-t border-border shadow-[0px_-4px_12px_-2px_rgba(0,0,0,0.1)]',
        isPhone ? 'bottom-[var(--bottom-nav-height,0px)]' : 'bottom-0',
        className,
      )}
    >
      <span className="text-sm text-muted-foreground">
        {t('deletion.selectedCount', { count: selectedCount })}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="size-4 mr-1" />
          {t('deletion.cancelAction')}
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="size-4 mr-1" />
          {t('deletion.deleteSelected', { count: selectedCount })}
        </Button>
      </div>
    </div>
  );
}
