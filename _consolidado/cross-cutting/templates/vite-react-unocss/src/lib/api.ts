import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000, // 10 min (era cacheTime)
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false;
        if (error instanceof Response && error.status >= 400 && error.status < 500) return false;
        return true;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: false,
    },
  },
});

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL ?? '';
  const res = await fetch(`${baseUrl}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = new Error('API Error') as Error & { response: Response };
    error.response = res;
    throw error;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}