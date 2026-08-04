import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCategory,
  addProduct,
  deleteCategory,
  getCategories,
  getProducts,
  updateCategory,
  updateProduct,
  type AddCategoryPayload,
  type AddProductPayload,
  type UpdateCategoryPayload,
  type UpdateProductPayload
} from '../services/products.ts';

const PRODUCTS_QUERY_KEY = ['products'];
const CATEGORIES_QUERY_KEY = ['categories'];

type ProductsQueryParams = {
  category?: string;
  pageSize?: number;
  search?: string;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: string;
};

export function useProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
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

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    }
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddProductPayload) => addProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: UpdateProductPayload }) =>
      updateProduct(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    }
  });
}
