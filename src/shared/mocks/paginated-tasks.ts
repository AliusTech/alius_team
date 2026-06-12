import { tasks, type TaskItem } from './tasks-data';
import type { PaginatedResponse } from '@/shared/types/pagination';

interface FetchTasksParams {
  offset: number;
  limit: number;
  status?: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchTasks({ offset, limit, status }: FetchTasksParams): Promise<PaginatedResponse<TaskItem>> {
  await delay(300);

  let filtered = tasks;
  if (status && status !== 'all') {
    filtered = tasks.filter((t) => t.status === status);
  }

  const items = filtered.slice(offset, offset + limit);
  return {
    items,
    total: filtered.length,
    limit,
    offset,
    hasMore: offset + limit < filtered.length,
  };
}
