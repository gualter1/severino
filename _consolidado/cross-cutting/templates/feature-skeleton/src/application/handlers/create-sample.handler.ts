import { SampleEntity } from '../../domain/entities/sample.entity';
import { SampleEntityCreatedEvent } from '../../domain/events';
import { CreateSampleCommand } from '../commands';

export interface SampleRepository {
  save(entity: SampleEntity): Promise<void>;
  findById(id: string): Promise<SampleEntity | null>;
}

export interface EventBus {
  publish(event: { eventName: string; aggregateId: string }): Promise<void>;
}

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface CreateSampleHandlerDeps {
  repository: SampleRepository;
  eventBus: EventBus;
  logger: Logger;
  generateId: () => string;
}

/**
 * Canonical command handler pattern.
 * - Validates input at boundary (defense in depth, ADR-007)
 * - Delegates business rules to domain service/entity
 * - Emits domain events via injected EventBus
 */
export class CreateSampleHandler {
  constructor(private readonly deps: CreateSampleHandlerDeps) {}

  async execute(command: CreateSampleCommand): Promise<string> {
    const name = command.payload.name?.trim();

    if (!name || name.length < 3 || name.length > 128) {
      throw new Error('CreateSampleCommand: name must be 3–128 chars');
    }

    const entity = SampleEntity.create({
      id: this.deps.generateId(),
      name,
      status: 'INACTIVE',
      metadata: command.payload.metadata ?? {},
    });

    await this.deps.repository.save(entity);

    await this.deps.eventBus.publish(
      new SampleEntityCreatedEvent(
        entity.id,
        { entityId: entity.id, name: entity.name },
        command.correlationId
      )
    );

    this.deps.logger.info('feature.sample.created', {
      entityId: entity.id,
      correlationId: command.correlationId,
    });

    return entity.id;
  }
}