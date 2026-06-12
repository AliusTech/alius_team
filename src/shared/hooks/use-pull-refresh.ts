import { useCallback, useRef } from 'react';

interface UsePullRefreshOptions {
  onRefresh: () => void;
  threshold?: number;
}

export function usePullRefresh({ onRefresh, threshold = 80 }: UsePullRefreshOptions) {
  const startY = useRef(0);
  const pulling = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff < 0) {
      pulling.current = false;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!pulling.current) return;
    const diff = e.changedTouches[0].clientY - startY.current;
    pulling.current = false;
    if (diff > threshold) {
      onRefresh();
    }
  }, [onRefresh, threshold]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
