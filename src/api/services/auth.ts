import { authApiClient } from '../client.ts';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginTokens = {
  type: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
};

type LoginApiResponse = {
  status: string;
  data: LoginTokens;
};

export async function loginUser({ email, password }: LoginCredentials): Promise<LoginTokens> {
  const { data } = await authApiClient.post<LoginApiResponse>('/api/v1/auth/login', {
    email,
    password
  });
  return data.data;
}