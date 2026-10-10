import { SampleEntity } from '../../../domain/entities/sample.entity';

export interface SampleRepository {
  save(entity: SampleEntity): Promise<void>;
  findById(id: string): Promise<SampleEntity | null>;
}

export class PostgreSQLSampleRepository implements SampleRepository {
  constructor(private readonly client: import('pg').Pool) {}

  async findById(id: string): Promise<SampleEntity | null> {
    const { rows } = await this.client.query(
      'SELECT id, name, status, metadata, created_at, updated_at FROM sample_entities WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return SampleEntity.create({
      id: row.id,
      name: row.name,
      status: row.status,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async save(entity: SampleEntity): Promise<void> {
    const payload = entity.toJSON();
    await this.client.query(
      `INSERT INTO sample_entities (id, name, status, metadata, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           status = EXCLUDED.status,
           metadata = EXCLUDED.metadata,
           updated_at = EXCLUDED.updated_at`,
      [payload.id, payload.name, payload.status, payload.metadata, payload.createdAt, payload.updatedAt]
    );
  }
}