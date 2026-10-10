import { RouterProvider } from '@tanstack/react-router';
import { Providers } from './providers';
import { router } from './routes';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}