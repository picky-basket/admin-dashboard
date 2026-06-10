import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '../services/user.ts';

const DASHBOARD_QUERY_KEY = ['dashboard-analytics'];

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => getDashboardAnalytics(),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
    retry: 1
  });
}
