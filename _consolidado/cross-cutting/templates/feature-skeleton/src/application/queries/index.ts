/**
 * Queries — intent to read state (read-side projection / CQRS).
 */

export interface Query<TResult = unknown> {
  readonly queryName: string;
  readonly params: Record<string, unknown>;
  readonly correlationId?: string;
}

export class GetSampleByIdQuery implements Query {
  public readonly queryName = 'feature.sample.getById';

  constructor(
    public readonly params: { entityId: string },
    public readonly correlationId?: string
  ) {}
}

export class ListSamplesQuery implements Query {
  public readonly queryName = 'feature.sample.list';

  constructor(
    public readonly params: { limit?: number; offset?: number; status?: string },
    public readonly correlationId?: string
  ) {}
}