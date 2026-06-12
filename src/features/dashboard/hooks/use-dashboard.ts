import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/data/api-client/dashboard-api';

/** Fetches the aggregated dashboard summary (agents, tasks, token usage). */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardAPI.getSummary(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Auto refresh every minute
  });
}

/** Fetches recent agent lifecycle events (connected, task started, etc.). */
export function useRecentAgentEvents(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'events', limit],
    queryFn: () => dashboardAPI.getRecentAgentEvents(limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

/** Fetches recent error and critical log entries. */
export function useRecentErrorLogs(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'errors', limit],
    queryFn: () => dashboardAPI.getRecentErrorLogs(limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}