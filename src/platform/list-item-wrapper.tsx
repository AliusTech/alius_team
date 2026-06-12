import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { usePlatformInput } from '@/platform/use-platform-input';
import { SwipeAction } from '@/platform/swipe-action';
import { ListContextMenu } from '@/platform/context-menu';

interface ListItemWrapperProps {
  id: string;
  isSelected: boolean;
  isSelectMode: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEnterSelectMode?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ListItemWrapper({
  id,
  isSelected,
  isSelectMode,
  onSelect,
  onDelete,
  onEnterSelectMode,
  children,
  className,
}: ListItemWrapperProps) {
  const { t } = useTranslation('common');
  const { interactionMode } = usePlatformInput();

  if (interactionMode === 'touch') {
    const content = (
      <div className={cn('relative', isSelectMode && 'flex items-center gap-2', className)}>
        {isSelectMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
            className={cn(
              'shrink-0 size-11 rounded-full border-2 flex items-center justify-center transition-colors',
              isSelected
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-muted-foreground/30 bg-transparent',
            )}
            aria-label={isSelected ? t('deletion.deselectItem') : t('deletion.selectItem')}
          >
            {isSelected && (
              <svg className="size-5" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
        <div className={cn(isSelectMode && 'flex-1')}>{children}</div>
      </div>
    );

    if (isSelectMode) {
      return content;
    }

    return (
      <SwipeAction onDelete={() => onDelete(id)} className={className}>
        {children}
      </SwipeAction>
    );
  }

  // Mouse/desktop mode
  return (
    <ListContextMenu onDelete={() => onDelete(id)} onSelect={onEnterSelectMode}>
      <div className={cn('group relative', isSelectMode && 'flex items-center gap-2', className)}>
        {isSelectMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
            className={cn(
              'shrink-0 size-[18px] rounded-full border-2 flex items-center justify-center transition-colors',
              isSelected
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-muted-foreground/30 bg-transparent',
            )}
            aria-label={isSelected ? t('deletion.deselectItem') : t('deletion.selectItem')}
          >
            {isSelected && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
        <div className={cn(isSelectMode && 'flex-1')}>{children}</div>
        {!isSelectMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            aria-label={t('deletion.deleteOne')}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-md text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-destructive transition-all flex items-center justify-center"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
    </ListContextMenu>
  );
}
