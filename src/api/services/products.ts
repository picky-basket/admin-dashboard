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
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type UploadContext = 'product_image' | 'category_image' | 'dish_image';
export type AllowedImageType = 'image/jpeg' | 'image/png';

export type UploadUrlResult = {
  signedUrl: string;
  imagePath: string;
  expiresIn?: number;
};

export type AddCategoryPayload = {
  name: string;
  imagePath: string;
};

export type UpdateCategoryPayload = {
  name?: string;
  imagePath?: string;
};

export type GetProductsParams = {
  category?: string;
  min_price?: number;
  max_price?: number;
  is_available?: boolean;
  search?: string;
  tags?: string;
  sort_by?: string;
  sort_order?: string;
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

export async function getUploadUrl(
  context: UploadContext,
  contentType: AllowedImageType
): Promise<UploadUrlResult> {
  const { data } = await productApiClient.get('/api/v1/upload/url', {
    params: {
      context,
      contentType
    }
  });

  const payload = data?.data ?? data;
  const signedUrl = payload?.signedUrl;
  const imagePath = payload?.imagePath || payload?.ImagePath;

  if (!signedUrl || !imagePath) {
    throw new Error('Upload URL response is missing signedUrl or imagePath');
  }

  return {
    signedUrl,
    imagePath,
    expiresIn: payload?.expiresIn
  };
}

export async function uploadFileToSignedUrl(
  signedUrl: string,
  file: File,
  contentType: AllowedImageType
): Promise<void> {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType
    },
    body: file
  });

  if (!response.ok) {
    throw new Error('Failed to upload image file');
  }
}

export async function addCategory(payload: AddCategoryPayload) {
  const body = new URLSearchParams();
  body.set('name', payload.name);
  body.set('imagePath', payload.imagePath);

  const { data } = await productApiClient.post('/api/v1/product/category/add', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return data;
}

export async function updateCategory(categoryId: string, payload: UpdateCategoryPayload) {
  const body = new URLSearchParams();

  if (payload.name) body.set('name', payload.name);
  if (payload.imagePath) body.set('imagePath', payload.imagePath);

  const { data } = await productApiClient.patch(
    `/api/v1/product/category/${categoryId}`,
    body,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return data;
}

export async function deleteCategory(categoryId: string) {
  const { data } = await productApiClient.delete(
    `/api/v1/product/category/${categoryId}`
  );

  return data;
}

export type AddProductPayload = {
  name: string;
  price: number;
  unit: string;
  categoryId: string;
  imagePath: string;
  description?: string;
  stockQuantity?: number;
  stockThreshold?: number;
};

export type UpdateProductPayload = {
  name?: string;
  price?: number;
  unit?: string;
  categoryId?: string;
  imagePath?: string;
  description?: string;
  stockQuantity?: number;
  stockThreshold?: number;
};

export async function addProduct(payload: AddProductPayload) {
  const body = new URLSearchParams();
  const stockQuantity = payload.stockQuantity;
  const stockThreshold = payload.stockThreshold ?? (stockQuantity !== undefined ? 0 : undefined);

  body.set('name', payload.name);
  body.set('price', String(payload.price));
  body.set('currency', 'GHS');
  body.set('unit', payload.unit);
  body.set('categoryId', payload.categoryId);
  body.set('imagePath', payload.imagePath);
  if (payload.description) body.set('description', payload.description);
  if (stockQuantity !== undefined) body.set('stockQuantity', String(stockQuantity));
  if (stockThreshold !== undefined) body.set('stockThreshold', String(stockThreshold));

  const { data } = await productApiClient.post('/api/v1/product/add', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return data;
}

export async function updateProduct(productId: string, payload: UpdateProductPayload) {
  const body = new URLSearchParams();
  const stockQuantity = payload.stockQuantity;
  const stockThreshold = payload.stockThreshold ?? (stockQuantity !== undefined ? 0 : undefined);

  if (payload.name !== undefined) body.set('name', payload.name);
  if (payload.price !== undefined) body.set('price', String(payload.price));
  if (payload.unit !== undefined) body.set('unit', payload.unit);
  if (payload.categoryId !== undefined) body.set('categoryId', payload.categoryId);
  if (payload.imagePath !== undefined) body.set('imagePath', payload.imagePath);
  if (payload.description !== undefined) body.set('description', payload.description);
  if (stockQuantity !== undefined) body.set('stockQuantity', String(stockQuantity));
  if (stockThreshold !== undefined) body.set('stockThreshold', String(stockThreshold));

  const { data } = await productApiClient.patch(
    `/api/v1/product/${productId}/update`,
    body,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return data;
}
