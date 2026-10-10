import { describe, it, expect } from 'vitest';
import { SampleEntity } from '../../../src/domain/entities/sample.entity';
import { SampleDomainService } from '../../../src/domain/services/sample-domain.service';
import { FeatureIdentifier } from '../../../src/domain/value-objects/feature-identifier.vo';

describe('SampleEntity (unit)', () => {
  it('creates an entity with INACTIVE default status', () => {
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Acme Feature',
      status: 'INACTIVE',
      metadata: {},
    });
    expect(entity.id).toBe('00000000-0000-4000-8000-000000000001');
    expect(entity.status).toBe('INACTIVE');
    expect(entity.name).toBe('Acme Feature');
  });

  it('rejects empty name updates', () => {
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Valid Name',
      status: 'INACTIVE',
      metadata: {},
    });
    expect(() => entity.updateName('   ')).toThrow(/cannot be empty/i);
  });

  it('activates an INACTIVE entity', () => {
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000003',
      name: 'Activatable',
      status: 'INACTIVE',
      metadata: {},
    });
    entity.activate();
    expect(entity.status).toBe('ACTIVE');
  });
});

describe('SampleDomainService (unit)', () => {
  const service = new SampleDomainService();

  it('allows INACTIVE → ACTIVE transition', () => {
    expect(service.canTransition('INACTIVE', 'ACTIVE')).toBe(true);
  });

  it('blocks ARCHIVED → ACTIVE transition', () => {
    expect(service.canTransition('ARCHIVED', 'ACTIVE')).toBe(false);
  });

  it('validates activation requires >=3 char name', () => {
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000004',
      name: 'AB',
      status: 'INACTIVE',
      metadata: {},
    });
    expect(() => service.validateForActivation(entity)).toThrow(/at least 3 characters/i);
  });
});

describe('FeatureIdentifier (unit)', () => {
  it('accepts valid identifiers', () => {
    expect(FeatureIdentifier.create('my-feature-01').getValue()).toBe('my-feature-01');
  });

  it('rejects invalid identifiers', () => {
    expect(() => FeatureIdentifier.create('INVALID ID!')).toThrow(/Invalid FeatureIdentifier/);
    expect(() => FeatureIdentifier.create('ab')).toThrow(/Invalid FeatureIdentifier/);
  });
});
