import { SampleEntity } from '../entities/sample.entity';

/**
 * Domain service: cross-entity business logic.
 * Pure — no I/O, no framework imports.
 */
export class SampleDomainService {
  public canTransition(from: SampleEntity['status'], to: SampleEntity['status']): boolean {
    const allowed: Record<string, string[]> = {
      INACTIVE: ['ACTIVE'],
      ACTIVE: ['INACTIVE', 'ARCHIVED'],
      ARCHIVED: [],
    };
    return allowed[from]?.includes(to) ?? false;
  }

  public validateForActivation(entity: SampleEntity): void {
    if (!this.canTransition(entity.status, 'ACTIVE')) {
      throw new Error(
        `Cannot transition SampleEntity(${entity.id}) from ${entity.status} to ACTIVE`
      );
    }
    if (!entity.name || entity.name.trim().length < 3) {
      throw new Error('Entity name must be at least 3 characters for activation');
    }
  }
}
