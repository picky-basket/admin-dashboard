import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDish,
  deleteDish,
  getDishes,
  updateDish,
  type AddDishPayload,
  type UpdateDishPayload
} from '../services/dishes.ts';

const DISHES_QUERY_KEY = ['dishes'];

type DishesQueryParams = {
  search?: string;
  pageSize?: number;
};

export function useDishes(params?: DishesQueryParams) {
  return useQuery({
    queryKey: [...DISHES_QUERY_KEY, params],
    queryFn: () => getDishes(params),
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

export function useAddDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddDishPayload) => addDish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISHES_QUERY_KEY });
    }
  });
}
