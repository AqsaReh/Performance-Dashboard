// hooks/use-infinite-scroll.ts
import { useState, useEffect, useCallback } from 'react';

export interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  threshold = 100,
  onLoadMore,
}: UseInfiniteScrollProps) => {
  const [observerRef, setObserverRef] = useState<Element | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    if (!observerRef) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observer.observe(observerRef);

    return () => {
      observer.disconnect();
    };
  }, [observerRef, handleObserver, threshold]);

  return { setObserverRef };
};