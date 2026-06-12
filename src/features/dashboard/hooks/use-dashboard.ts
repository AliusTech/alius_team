import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/data/api-client/dashboard-api';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardAPI.getSummary(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Auto refresh every minute
  });
}

export function useRecentAgentEvents(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'events', limit],
    queryFn: () => dashboardAPI.getRecentAgentEvents(limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useRecentErrorLogs(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'errors', limit],
    queryFn: () => dashboardAPI.getRecentErrorLogs(limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}