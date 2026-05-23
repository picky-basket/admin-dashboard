import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { clearTokens, getTokens, setTokens } from './tokenStore.js';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  type?: string;
  userId?: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  status: string;
  data?: AuthTokens;
};

const AUTH_BASE_URL = 'https://auth-staging.pickybasket.com/';
const PRODUCT_BASE_URL = 'https://product-staging.pickybasket.com/';
const ORDER_BASE_URL = 'https://order-staging.pickybasket.com/';
const PAYMENT_BASE_URL = 'https://payment-staging.pickybasket.com/';
const USER_BASE_URL = 'https://user-staging.pickybasket.com/';

function createApiClient(baseURL: string): AxiosInstance {
  return axios.create({ baseURL, timeout: 12000 });
}

export const authApiClient = createApiClient(AUTH_BASE_URL);
export const productApiClient = createApiClient(PRODUCT_BASE_URL);
export const orderApiClient = createApiClient(ORDER_BASE_URL);
export const paymentApiClient = createApiClient(PAYMENT_BASE_URL);
export const userApiClient = createApiClient(USER_BASE_URL);

// Dedicated client for token refresh — no interceptors to avoid circular retries
const authRefreshClient = axios.create({ baseURL: AUTH_BASE_URL, timeout: 12000 });

function isAuthRoute(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes('/api/v1/auth/login') ||
    url.includes('/api/v1/auth/signup') ||
    url.includes('/api/v1/auth/refresh-token')
  );
}

function signOutAndRedirect(): void {
  clearTokens();
  window.location.replace('/login');
}

function attachInterceptors(client: AxiosInstance): void {
  // Attach access token to every request
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const tokens = getTokens() as AuthTokens | null;
    if (tokens?.accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  });

  // Handle 401 — attempt token refresh once, then sign out
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalConfig = (error.config ?? {}) as RetryableRequestConfig;

      if (
        error.response?.status !== 401 ||
        originalConfig._retry ||
        isAuthRoute(originalConfig.url)
      ) {
        return Promise.reject(error);
      }

      const tokens = getTokens() as AuthTokens | null;
      if (!tokens?.refreshToken) {
        signOutAndRedirect();
        return Promise.reject(error);
      }

      originalConfig._retry = true;

      try {
        const { data } = await authRefreshClient.get<RefreshResponse>(
          '/api/v1/auth/refresh-token',
          {
            params: { token: tokens.refreshToken }
          }
        );

        if (!data?.data) {
          throw new Error('Missing refresh token payload');
        }

        setTokens(data.data);
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return client(originalConfig);
      } catch {
        signOutAndRedirect();
        return Promise.reject(error);
      }
    }
  );
}

attachInterceptors(authApiClient);
attachInterceptors(productApiClient);
attachInterceptors(orderApiClient);
attachInterceptors(paymentApiClient);
attachInterceptors(userApiClient);