/**
 * Base entity with identity and audit fields.
 * Domain layer MUST have zero external dependencies (ADR-001).
 */
export interface EntityProps {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export abstract class BaseEntity<TProps extends EntityProps> {
  protected constructor(protected readonly props: TProps) {}

  get id(): string {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): TProps {
    return { ...this.props };
  }
}
