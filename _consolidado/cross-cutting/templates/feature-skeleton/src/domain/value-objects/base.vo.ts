/**
 * Value Object base — immutable by design.
 * Domain layer: zero external deps (ADR-001).
 */
export abstract class ValueObject<T> {
  protected constructor(protected readonly value: T) {}

  getValue(): T {
    return this.value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}
