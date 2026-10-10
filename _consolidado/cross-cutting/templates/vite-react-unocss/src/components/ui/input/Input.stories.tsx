import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Nome', placeholder: 'Digite seu nome' } };
export const Required: Story = { args: { label: 'Email', required: true, type: 'email' } };
export const WithHint: Story = { args: { label: 'Senha', type: 'password', hint: 'Mínimo 8 caracteres' } };
export const WithError: Story = { args: { label: 'Email', error: 'Email inválido' } };
export const Disabled: Story = { args: { label: 'Nome', disabled: true, value: 'Bloqueado' } };