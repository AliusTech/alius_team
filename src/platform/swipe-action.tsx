import { useRef, useState, useCallback, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

const DELETE_BUTTON_WIDTH = 88;                                          // 红色按钮宽度（108 × 0.8）
const CARD_CORNER_OVERLAP = 12;                                          // 与 rounded-xl 一致
const SWIPE_DISTANCE = DELETE_BUTTON_WIDTH - CARD_CORNER_OVERLAP;        // 卡片滑动距离 < 按钮宽度，让卡片右圆角压在红色背景上，消除间隙
const SWIPE_THRESHOLD = SWIPE_DISTANCE / 2;

interface SwipeActionProps {
  onDelete: () => void;
  children: React.ReactNode;
  className?: string;
  /** Controlled open state. When driven by parent, mutual exclusion is possible. */
  isOpen?: boolean;
  /** Fired on touch end with the resulting open state. */
  onOpenChange?: (open: boolean) => void;
}

export function SwipeAction({ onDelete, children, className, isOpen, onOpenChange }: SwipeActionProps) {
  const { t } = useTranslation('common');
  const [offset, setOffset] = useState(0);
  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);

  // When parent says "you are no longer the open one", collapse.
  useEffect(() => {
    if (isOpen === false) setOffset(0);
  }, [isOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentOffsetRef.current = offset;
  }, [offset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newOffset = Math.min(0, Math.max(-SWIPE_DISTANCE, currentOffsetRef.current + deltaX));
    setOffset(newOffset);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const opened = offset <= -SWIPE_THRESHOLD;
    setOffset(opened ? -SWIPE_DISTANCE : 0);
    onOpenChange?.(opened);
  }, [offset, onOpenChange]);

  const handleDeleteClick = useCallback(() => {
    setOffset(0);
    onDelete();
  }, [onDelete]);

  const handleContentClick = useCallback(() => {
    if (offset < 0) {
      setOffset(0);
    }
  }, [offset]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute right-0 top-0 bottom-0 bg-destructive rounded-r-xl flex items-center justify-center"
        style={{ width: `${DELETE_BUTTON_WIDTH}px` }}
      >
        <button
          type="button"
          onClick={handleDeleteClick}
          className="flex flex-col items-center justify-center gap-1 text-white"
          aria-label={t('deletion.deleteOne')}
        >
          <Trash2 className="size-4" />
          <span className="text-[10px]">{t('deletion.deleteOne')}</span>
        </button>
      </div>
      <div
        className="relative transition-transform"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
}
