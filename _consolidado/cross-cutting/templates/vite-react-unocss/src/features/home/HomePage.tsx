import { Button } from '@/components/ui/button/Button';

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold">Início</h1>
      <p className="text-muted">Template configurado com sucesso.</p>
      <div className="flex gap-4">
        <Button>Ação Primária</Button>
      </div>
    </div>
  );
}
