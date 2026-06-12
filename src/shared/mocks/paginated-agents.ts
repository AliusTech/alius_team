import { agents, type AgentItem } from './agents-data';
import type { PaginatedResponse } from '@/shared/types/pagination';

interface FetchAgentsParams {
  offset: number;
  limit: number;
  search?: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchAgents({ offset, limit, search }: FetchAgentsParams): Promise<PaginatedResponse<AgentItem>> {
  await delay(300);

  let filtered = agents;
  if (search) {
    const q = search.toLowerCase();
    filtered = agents.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
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
