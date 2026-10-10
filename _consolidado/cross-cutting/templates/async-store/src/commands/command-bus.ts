import type { DomainEvent, IEventStore } from '../events/event-store';

export interface Command<TPayload = Record<string, any>> {
  commandId: string;
  commandType: string;
  aggregateId: string;
  aggregateType: string;
  payload: TPayload;
  idempotencyKey?: string;
  metadata?: {
    userId?: string;
    roles?: string[];
    correlationId?: string;
    [key: string]: any;
  };
}

export interface CommandResult {
  success: boolean;
  events?: DomainEvent[];
  error?: string;
}

export interface ICommandHandler {
  commandType: string;
  validate(command: Command): Promise<void> | void;
  authorize(command: Command): Promise<void> | void;
  handle(command: Command): Promise<DomainEvent[]>;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export abstract class BaseCommandHandler implements ICommandHandler {
  abstract commandType: string;

  validate(_command: Command): void {
    // Override for domain-specific validation
  }

  authorize(_command: Command): void {
    // Override for domain-specific authorization
  }

  abstract handle(command: Command): Promise<DomainEvent[]>;
}

export class CommandBus {
  private handlers = new Map<string, ICommandHandler>();

  constructor(
    private readonly eventStore: IEventStore,
    private readonly idempotencyCheck?: (key: string) => Promise<CommandResult | null>,
    private readonly idempotencySave?: (key: string, result: CommandResult) => Promise<void>
  ) {}

  register(handler: ICommandHandler): void {
    if (this.handlers.has(handler.commandType)) {
      throw new Error(`Handler already registered for ${handler.commandType}`);
    }
    this.handlers.set(handler.commandType, handler);
  }

  async dispatch(command: Command, expectedVersion = -1): Promise<CommandResult> {
    // 1. Idempotency check (ADR-002 mandatory)
    if (command.idempotencyKey && this.idempotencyCheck) {
      const cached = await this.idempotencyCheck(command.idempotencyKey);
      if (cached) return cached;
    }

    const handler = this.handlers.get(command.commandType);
    if (!handler) {
      return { success: false, error: `No handler for ${command.commandType}` };
    }

    try {
      // 2. Validation
      await handler.validate(command);
      // 3. Authorization
      await handler.authorize(command);
      // 4. Business logic → events
      const pendingEvents = await handler.handle(command);
      // 5. Append to event store
      const persisted = await this.eventStore.append(command.aggregateId, expectedVersion, pendingEvents);

      const result: CommandResult = { success: true, events: persisted };

      if (command.idempotencyKey && this.idempotencySave) {
        await this.idempotencySave(command.idempotencyKey, result);
      }

      return result;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
