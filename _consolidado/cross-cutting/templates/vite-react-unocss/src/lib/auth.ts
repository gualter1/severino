export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  // Placeholder — substituir por implementação real (ex. better-auth, clerk, next-auth)
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
  } as const;
}

export function requireAuth(router: ReturnType<typeof import('@tanstack/react-router').useRouter>) {
  const auth = useAuth();
  if (!auth.isLoading && !auth.isAuthenticated) {
    throw router.navigate({ to: '/login' });
  }
  return auth;
}