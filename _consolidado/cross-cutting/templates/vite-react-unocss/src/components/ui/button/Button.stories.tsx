import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: 'Salvar' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancelar' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Detalhes' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Excluir' } };
export const Loading: Story = { args: { loading: true, children: 'Salvando…' } };
export const Disabled: Story = { args: { disabled: true, children: 'Bloqueado' } };