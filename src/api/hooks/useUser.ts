import { useQuery } from '@tanstack/react-query';
import { getTokens } from '../tokenStore.js';
import { getUserProfile } from '../services/user.ts';

export function useUser() {
  const userId = (getTokens() as { userId?: string } | null)?.userId ?? null;

  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    retry: 1
  });
}
