import { userApiClient } from '../client.ts';

export type UserProfile = {
  isDeleted: boolean;
  name: string;
  role: string;
  userId: string;
  isEmployee: boolean;
  createdAt: string;
  email: string;
  phoneNumber: string;
  lastActive: string;
  updatedBy: string;
  defaultAddressId: string;
  updatedAt: string;
};

export type UpdateUserProfilePayload = {
  name?: string;
  phoneNumber?: string;
};

export type DashboardCards = {
  revenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockCount: number;
};

export type DashboardPipelineItem = {
  status: string;
  count: number;
  percentage: number;
};

export type DashboardRecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
};

export type DashboardStockAlertItem = {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  status: string;
};

export type DashboardAnalytics = {
  cards: DashboardCards;
  orderPipeline: DashboardPipelineItem[];
  recentOrders: DashboardRecentOrder[];
  stockAlerts: {
    count: number;
    items: DashboardStockAlertItem[];
  };
};

type UserProfileResponse = {
  status: string;
  data: UserProfile;
};

type DashboardAnalyticsResponse = {
  status: string;
  data: DashboardAnalytics;
};

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data } = await userApiClient.get<UserProfileResponse>(`/api/v1/user/${userId}`);
  return data.data;
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateUserProfilePayload
): Promise<void> {
  await userApiClient.patch(`/api/v1/user/${userId}`, payload);
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const { data } = await userApiClient.get<DashboardAnalyticsResponse>('/api/v1/admin/dashboard');
  return data.data;
}
