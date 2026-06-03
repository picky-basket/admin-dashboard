import { userApiClient } from '../client.ts';

export type Customer = {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phoneNumber: string;
  numberOfOrders: number;
  totalAmountSpent: number;
  createdAt: string;
  lastActive: string;
  isActive: boolean;
  updatedAt?: string;
};

export type GetCustomersParams = {
  search?: string;
  status?: string;
  sort_by?: 'name' | 'most_orders' | 'most_spent';
  sort_order?: 'asc' | 'desc';
  cursorId?: string;
  pageSize?: number;
};

type GetCustomersResponse = {
  status: string;
  data: {
    total: number;
    activeCustomers: number;
    inactiveCustomers: number;
    customers: Customer[];
    pagination: {
      pageSize: number;
      hasMore: boolean;
      cursorId?: string;
    };
  };
};

export async function getCustomers(params?: GetCustomersParams): Promise<Customer[]> {
  const { data } = await userApiClient.get<GetCustomersResponse>('/api/v1/admin/customers', {
    params
  });

  return data.data.customers;
}
