/**
 * Commands — intent to change state.
 * Validated at boundary (interfaces), processed by handlers.
 */

export interface Command<TResult = void> {
  readonly commandName: string;
  readonly payload: unknown;
  readonly correlationId?: string;
}

export interface CreateSampleCommandPayload {
  name: string;
  metadata?: Record<string, unknown>;
}

export class CreateSampleCommand implements Command<string> {
  public readonly commandName = 'feature.sample.create';

  constructor(
    public readonly payload: CreateSampleCommandPayload,
    public readonly correlationId?: string
  ) {}
}

export interface ActivateSampleCommandPayload {
  entityId: string;
}

export class ActivateSampleCommand implements Command<void> {
  public readonly commandName = 'feature.sample.activate';

  constructor(
    public readonly payload: ActivateSampleCommandPayload,
    public readonly correlationId?: string
  ) {}
}