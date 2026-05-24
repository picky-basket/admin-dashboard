import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../services/products.ts';

const PRODUCTS_QUERY_KEY = ['products'];
const CATEGORIES_QUERY_KEY = ['categories'];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  });
}
