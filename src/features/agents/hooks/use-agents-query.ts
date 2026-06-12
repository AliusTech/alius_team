import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAgents } from '@/shared/mocks/paginated-agents';

export function useAgentsQuery(search: string = '') {
  return useInfiniteQuery({
    queryKey: ['agents', search],
    queryFn: ({ pageParam }) => fetchAgents({ offset: pageParam as number, limit: 20, search: search || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
  });
}
