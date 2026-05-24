import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services/orders.ts';

const ORDERS_QUERY_KEY = ['orders'];

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => getOrders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });
}
