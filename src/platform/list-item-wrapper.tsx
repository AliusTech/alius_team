import { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { usePlatformInput } from '@/platform/use-platform-input';
import { SwipeAction } from '@/platform/swipe-action';
import { ListContextMenu } from '@/platform/context-menu';

const HOVER_DELAY_MS = 1000;
const LEAVE_DELAY_MS = 200;
const REVEAL_WIDTH_PX = 48;

interface ListItemWrapperProps {
  id: string;
  isSelected: boolean;
  isSelectMode: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEnterSelectMode?: () => void;
  /** Controlled swipe-open state for touch mode mutual exclusion. */
  isSwipeOpen?: boolean;
  /** Fired when this card's swipe-open state changes (touch mode only). */
  onSwipeOpenChange?: (open: boolean) => void;
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
  isSwipeOpen,
  onSwipeOpenChange,
  children,
  className,
}: ListItemWrapperProps) {
  const { t } = useTranslation('common');
  const { interactionMode } = usePlatformInput();

  const [isRevealed, setIsRevealed] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isSelectMode) return;
    clearLeaveTimer();
    hoverTimerRef.current = window.setTimeout(() => setIsRevealed(true), HOVER_DELAY_MS);
  }, [isSelectMode, clearLeaveTimer]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimer();
    leaveTimerRef.current = window.setTimeout(() => setIsRevealed(false), LEAVE_DELAY_MS);
  }, [clearHoverTimer]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current !== null) clearTimeout(hoverTimerRef.current);
      if (leaveTimerRef.current !== null) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSelectMode) {
      clearHoverTimer();
      clearLeaveTimer();
      setIsRevealed(false);
    }
  }, [isSelectMode, clearHoverTimer, clearLeaveTimer]);

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
      <SwipeAction
        onDelete={() => onDelete(id)}
        className={className}
        isOpen={isSwipeOpen}
        onOpenChange={onSwipeOpenChange}
      >
        {children}
      </SwipeAction>
    );
  }

  // Mouse/desktop mode: hover 1s → card slides left → reveal delete button;
  // right-click still offers "enter multi-select" entry.
  return (
    <ListContextMenu onSelect={onEnterSelectMode}>
      <div
        className={cn('group relative', isSelectMode && 'flex items-center gap-2', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
      {isSelectMode ? (
        <div className="flex-1">{children}</div>
      ) : (
        <div className="relative">
          {/* Delete zone: DOM-first so the card's opaque bg-card covers it;
              revealed as the card's right edge shrinks left via margin-right. */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-destructive flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearHoverTimer();
                clearLeaveTimer();
                setIsRevealed(false);
                onDelete(id);
              }}
              aria-label={t('deletion.deleteOne')}
              className="flex flex-col items-center justify-center gap-1 text-white"
            >
              <Trash2 className="size-4" />
              <span className="text-[10px]">{t('deletion.deleteOne')}</span>
            </button>
          </div>
          {/* Card body: right edge shrinks left on hover; left edge and text stay put. */}
          <div
            className="relative bg-card transition-[margin-right] duration-200"
            style={{ marginRight: isRevealed ? `${REVEAL_WIDTH_PX}px` : '0px' }}
          >
            {children}
          </div>
        </div>
      )}
      </div>
    </ListContextMenu>
  );
}
