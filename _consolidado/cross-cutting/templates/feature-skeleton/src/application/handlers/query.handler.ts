import { GetSampleByIdQuery, ListSamplesQuery } from '../../application/queries';

export interface SampleRepository {
  findById(id: string): Promise<import('../../domain/entities/sample.entity').SampleEntity | null>;
  save(entity: import('../../domain/entities/sample.entity').SampleEntity): Promise<void>;
}

export interface GetSampleRow {
  entityId: string;
  name: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
}

export interface QueryHandlerDeps {
  repository: SampleRepository;
  logger: Logger;
}

export class QueryHandler {
  constructor(private readonly deps: QueryHandlerDeps) {}

  async handleGetById(query: GetSampleByIdQuery): Promise<GetSampleRow> {
    const entity = await this.deps.repository.findById(query.params.entityId);

    if (!entity) {
      const error = new Error(`SampleEntity(${query.params.entityId}) not found`);
      (error as Error & { statusCode: number }).statusCode = 404;
      throw error;
    }

    this.deps.logger.debug('feature.sample.queried', {
      entityId: entity.id,
      correlationId: query.correlationId,
    });

    return {
      entityId: entity.id,
      name: entity.name,
      status: entity.status,
      metadata: entity.metadata,
    };
  }

  async handleList(query: ListSamplesQuery): Promise<{ items: GetSampleRow[] }> {
    // Real implementations use a tuned SELECT with LIMIT/OFFSET — never N+1
    this.deps.logger.debug('feature.sample.list-queried', {
      limit: query.params.limit,
      offset: query.params.offset,
      correlationId: query.correlationId,
    });
    return { items: [] };
  }
}
