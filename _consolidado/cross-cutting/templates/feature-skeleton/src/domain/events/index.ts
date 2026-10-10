/**
 * Domain events — plain data, no side effects.
 * Infrastructure (messaging) handles delivery; application handlers react.
 */

export interface DomainEvent<TPayload = unknown> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: TPayload;
  readonly correlationId?: string;
}

export interface SampleEntityCreatedPayload {
  entityId: string;
  name: string;
}

export class SampleEntityCreatedEvent implements DomainEvent<SampleEntityCreatedPayload> {
  public readonly eventName = 'feature.sample.created.v1';
  public readonly occurredAt = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly payload: SampleEntityCreatedPayload,
    public readonly correlationId?: string
  ) {}
}

export interface SampleEntityActivatedPayload {
  entityId: string;
  previousStatus: string;
}

export class SampleEntityActivatedEvent implements DomainEvent<SampleEntityActivatedPayload> {
  public readonly eventName = 'feature.sample.activated.v1';
  public readonly occurredAt = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly payload: SampleEntityActivatedPayload,
    public readonly correlationId?: string
  ) {}
}
