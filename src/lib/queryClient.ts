import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  catalog: ['catalog'] as const,
  userOrders: (email: string) => ['orders', 'user', email] as const,
  allOrders: ['orders', 'all'] as const,
};
