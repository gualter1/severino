import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">Pular para conteúdo</a>
      
      <header className="sticky top-0 z-sticky border-b border-line bg-surface/80 backdrop-blur">
        <nav className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-ink">App</Link>
          <div className="flex gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary-600">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary-600">Sobre</Link>
          </div>
        </nav>
      </header>

      <main id="main" className="container flex-1 py-8">
        {children}
      </main>
      
      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        © 2026 Template Canônico ADR-005
      </footer>
    </div>
  );
}
