import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  children: React.ReactNode;
}

export function InfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage, children }: InfiniteScrollProps) {
  const { t } = useTranslation('common');
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="flex items-center justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-xs">{t('loadingMore', '加载中…')}</span>
          </div>
        )}
        {!hasNextPage && !isFetchingNextPage && children && (
          <span className="text-xs text-muted-foreground">{t('noMore', '没有更多数据')}</span>
        )}
      </div>
    </>
  );
}
