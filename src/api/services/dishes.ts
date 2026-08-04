import { productApiClient } from '../client.ts';

export type DishProduct = {
  productId: string;
  quantity: number;
  price?: number;
  unit?: string;
  productName?: string;
};

export type Dish = {
  id: string;
  dishId?: string;
  name: string;
  imageUrl?: string;
  products: DishProduct[];
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateDishPayload = {
  name?: string;
  imagePath?: string;
  products?: { productId: string; quantity: number }[];
};

export type AddDishPayload = {
  name: string;
  imagePath: string;
  products: { productId: string; quantity: number }[];
};

type GetDishesResponse = {
  status: string;
  data: Dish[];
};

type GetDishesParams = {
  search?: string;
  pageSize?: number;
};

export async function getDishes(params?: GetDishesParams): Promise<Dish[]> {
  const { data } = await productApiClient.get<GetDishesResponse>('/api/v1/dish/list', {
    params: { pageSize: 100, ...params }
  });
  return data.data;
}

export async function updateDish(dishId: string, payload: UpdateDishPayload) {
  const { data } = await productApiClient.patch(
    `/api/v1/dish/${dishId}/update`,
    payload
  );
  return data;
}

export async function deleteDish(dishId: string) {
  const { data } = await productApiClient.delete(
    `/api/v1/dish/${dishId}/delete`
  );
  return data;
}

export async function addDish(payload: AddDishPayload) {
  const { data } = await productApiClient.post('/api/v1/dish/add', payload);
  return data;
}
