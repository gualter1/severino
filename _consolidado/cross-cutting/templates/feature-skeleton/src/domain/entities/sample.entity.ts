import { BaseEntity, EntityProps } from './base.entity';

export interface SampleEntityProps extends EntityProps {
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  metadata: Record<string, unknown>;
}

export class SampleEntity extends BaseEntity<SampleEntityProps> {
  private constructor(props: SampleEntityProps) {
    super(props);
  }

  public static create(props: Omit<SampleEntityProps, 'createdAt' | 'updatedAt'>): SampleEntity {
    const now = new Date();
    return new SampleEntity({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get status(): 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' {
    return this.props.status;
  }

  get metadata(): Record<string, unknown> {
    return { ...this.props.metadata };
  }

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('SampleEntity name cannot be empty');
    }
    (this as unknown as { props: SampleEntityProps }).props = {
      ...this.props,
      name: newName.trim(),
      updatedAt: new Date(),
    };
  }

  public activate(): void {
    (this as unknown as { props: SampleEntityProps }).props = {
      ...this.props,
      status: 'ACTIVE',
      updatedAt: new Date(),
    };
  }
}
