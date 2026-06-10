import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCategory,
  getCategories,
  getProducts,
  updateCategory,
  type AddCategoryPayload,
  type UpdateCategoryPayload
} from '../services/products.ts';

const PRODUCTS_QUERY_KEY = ['products'];
const CATEGORIES_QUERY_KEY = ['categories'];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => getProducts(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => getCategories(),
    placeholderData: (previousData) => previousData,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCategoryPayload) => addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: UpdateCategoryPayload }) =>
      updateCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    }
  });
}
