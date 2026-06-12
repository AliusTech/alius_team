import { useRef, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

const SWIPE_THRESHOLD = 80;
const DELETE_ZONE_WIDTH = 72;

interface SwipeActionProps {
  onDelete: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SwipeAction({ onDelete, children, className }: SwipeActionProps) {
  const { t } = useTranslation('common');
  const [offset, setOffset] = useState(0);
  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentOffsetRef.current = offset;
  }, [offset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newOffset = Math.min(0, Math.max(-DELETE_ZONE_WIDTH, currentOffsetRef.current + deltaX));
    setOffset(newOffset);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (offset < -SWIPE_THRESHOLD) {
      setOffset(-DELETE_ZONE_WIDTH);
    } else {
      setOffset(0);
    }
  }, [offset]);

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
      <div className="absolute right-0 top-0 bottom-0 w-[72px] bg-destructive flex items-center justify-center">
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
        className="relative bg-card transition-transform"
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
