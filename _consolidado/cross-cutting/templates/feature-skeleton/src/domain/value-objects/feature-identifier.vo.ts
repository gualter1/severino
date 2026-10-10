import { ValueObject } from './base.vo';

export class FeatureIdentifier extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(id: string): FeatureIdentifier {
    if (!id || !/^[a-z0-9-_]{3,64}$/.test(id)) {
      throw new Error(`Invalid FeatureIdentifier: "${id}". Must match /^[a-z0-9-_]{3,64}$/`);
    }
    return new FeatureIdentifier(id);
  }
}
