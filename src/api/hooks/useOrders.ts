import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../services/orders.ts';

type UpdateOrderStatusVariables = {
  orderId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  cancellationReason: string;
};

export const ORDERS_QUERY_KEY = ['orders'];

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => getOrders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status, cancellationReason }: UpdateOrderStatusVariables) =>
      updateOrderStatus(orderId, { status, cancellationReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    }
  });
}
