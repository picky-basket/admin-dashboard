import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteDish,
  getDishes,
  updateDish,
  type UpdateDishPayload
} from '../services/dishes.ts';

const DISHES_QUERY_KEY = ['dishes'];

export function useDishes() {
  return useQuery({
    queryKey: DISHES_QUERY_KEY,
    queryFn: getDishes,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dishId, payload }: { dishId: string; payload: UpdateDishPayload }) =>
      updateDish(dishId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISHES_QUERY_KEY });
    }
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dishId: string) => deleteDish(dishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISHES_QUERY_KEY });
    }
  });
}
