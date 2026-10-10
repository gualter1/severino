import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associa label ao input', () => {
    render(<Input label="Nome" placeholder="Digite" />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('expõe erro via role=alert e aria-invalid', () => {
    render(<Input label="Email" error="Email inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email inválido');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('mostra hint quando sem erro', () => {
    render(<Input label="Senha" hint="Mínimo 8 caracteres" />);
    expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument();
  });
});
