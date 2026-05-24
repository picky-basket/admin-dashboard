import { orderApiClient } from '../client.ts';

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  imageUrl?: string;
  categoryId?: string;
  categoryName?: string;
  currency?: string;
};

export type ShippingAddress = {
  recipientName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  ghanapostCode?: string;
  recipientPhoneNumber?: string;
};

export type DeliveryDetails = {
  estimatedDelivery?: string;
};

export type Order = {
  orderId: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  total: number;
  currency?: string;
  itemCount: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  deliveryDetails?: DeliveryDetails;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Local convenience fields
  id?: string;
  customer?: string;
  phone?: string;
  subtotal?: number;
  fee?: number;
  paid?: boolean;
  method?: string;
  address?: string;
  time?: string;
};

export type GetOrdersParams = {
  status?: string;
  payment_status?: string;
  from_date?: string;
  to_date?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  sort_by?: 'createdAt' | 'orderNumber';
  sort_order?: 'asc' | 'desc';
  pageSize?: number;
};

type GetOrdersResponse = {
  status: string;
  data: {
    orders: Order[];
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

export async function getOrders(params?: GetOrdersParams): Promise<Order[]> {
  const { data } = await orderApiClient.get<GetOrdersResponse>('/api/v1/order/all', {
    params
  });
  return data.data.orders;
}
