import {
  Outlet,
  Link,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/AppLayout';

/**
 * Type-safe routing — TanStack Router (ADR-005).
 * Rotas lazy por padrão para code-splitting.
 */

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  notFoundComponent: () => (
    <main className="container py-16 text-center">
      <h1 className="text-heading text-3xl">Página não encontrada</h1>
      <p className="mt-2 text-muted">A rota solicitada não existe.</p>
      <Link to="/" className="btn-primary btn mt-6">
        Voltar ao início
      </Link>
    </main>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('@/features/home/HomePage'), 'HomePage'),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: lazyRouteComponent(() => import('@/features/home/AboutPage'), 'AboutPage'),
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});
