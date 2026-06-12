import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/shared/mocks/paginated-tasks';

export function useTasksQuery(status: string = 'all') {
  return useInfiniteQuery({
    queryKey: ['tasks', status],
    queryFn: ({ pageParam }) => fetchTasks({ offset: pageParam as number, limit: 20, status }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
  });
}
