import { productApiClient } from '../client.ts';

export type Product = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  unit: string;
  description?: string;
  imageUrl?: string;
  image?: string; // for local use
  categoryId: string;
  categoryName?: string;
  catId?: string; // for local use
  isAvailable?: boolean;
  stock?: number; // for local use
  currency?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  image?: string; // for local use
  createdAt?: string;
  updatedAt?: string;
};

export type GetProductsParams = {
  category?: string;
  min_price?: number;
  max_price?: number;
  is_available?: boolean;
  tags?: string;
  sort_by?: 'createdAt' | 'price' | 'name';
  sort_order?: 'asc' | 'desc';
  pageSize?: number;
};

type GetProductsResponse = {
  status: string;
  data: {
    products: Product[];
    pagination: {
      pageSize: number;
      nextCursor?: {
        cursorCreatedAt: string;
        cursorId: string;
      };
      hasMore: boolean;
    };
  };
};

type GetCategoriesResponse = {
  status: string;
  data: Category[];
};

export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
  const { data } = await productApiClient.get<GetProductsResponse>('/api/v1/products', {
    params
  });
  return data.data.products;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await productApiClient.get<GetCategoriesResponse>(
    '/api/v1/product/categories'
  );
  return data.data;
}
