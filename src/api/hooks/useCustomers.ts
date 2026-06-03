import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../services/customers.ts';

const CUSTOMERS_QUERY_KEY = ['customers'];

export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: () => getCustomers(),
    staleTime: 2 * 60 * 1000,
    retry: 1
  });
}
