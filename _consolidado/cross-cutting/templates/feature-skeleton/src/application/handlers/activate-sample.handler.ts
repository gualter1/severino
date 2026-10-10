import { SampleEntity } from '../../domain/entities/sample.entity';
import { SampleDomainService } from '../../domain/services/sample-domain.service';
import { SampleEntityActivatedEvent } from '../../domain/events';
import { ActivateSampleCommand } from '../commands';

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

export interface ActivateSampleHandlerDeps {
  repository: SampleRepository;
  eventBus: EventBus;
  logger: Logger;
  domainService?: SampleDomainService;
}

export class ActivateSampleHandler {
  private readonly domainService: SampleDomainService;

  constructor(private readonly deps: ActivateSampleHandlerDeps) {
    this.domainService = deps.domainService ?? new SampleDomainService();
  }

  async execute(command: ActivateSampleCommand): Promise<void> {
    const entity = await this.deps.repository.findById(command.payload.entityId);

    if (!entity) {
      throw new Error(`SampleEntity(${command.payload.entityId}) not found`);
    }

    // Domain rule delegation — no business logic in handler (ADR-001)
    this.domainService.validateForActivation(entity);
    entity.activate();

    await this.deps.repository.save(entity);

    await this.deps.eventBus.publish(
      new SampleEntityActivatedEvent(
        entity.id,
        { entityId: entity.id, previousStatus: 'INACTIVE' },
        command.correlationId
      )
    );

    this.deps.logger.info('feature.sample.activated', {
      entityId: entity.id,
      correlationId: command.correlationId,
    });
  }
}
