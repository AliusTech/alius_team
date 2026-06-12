import { httpClient } from './http-client';
import { API_ENDPOINTS } from './endpoints';
import type {
  DashboardSummary,
  RecentAgentEvent,
  RecentErrorLog,
} from '@/features/dashboard/types';

export const dashboardAPI = {
  getSummary: async (): Promise<DashboardSummary> => {
    return httpClient<DashboardSummary>(API_ENDPOINTS.DASHBOARD.SUMMARY);
  },

  getRecentAgentEvents: async (limit: number = 10): Promise<RecentAgentEvent[]> => {
    return httpClient<RecentAgentEvent[]>(
      `${API_ENDPOINTS.DASHBOARD.EVENTS}?limit=${limit}`
    );
  },

  getRecentErrorLogs: async (limit: number = 10): Promise<RecentErrorLog[]> => {
    return httpClient<RecentErrorLog[]>(
      `${API_ENDPOINTS.DASHBOARD.ERRORS}?limit=${limit}`
    );
  },
};