import { EventEmitter } from 'node:events';

/**
 * In-memory event bus — canonical testing seam.
 * Production implementation swaps to a queue-backed
 * implementation adhering to this exact interface.
 */
export class InMemoryEventBus extends EventEmitter {
  private events: Array<{ eventName: string; aggregateId: string }> = [];

  async publish(event: { eventName: string; aggregateId: string }): Promise<void> {
    this.events.push(event);
    // Propagate transactionally via domain layer
    this.emit(event.eventName, event);
  }

  getPublishedEvents(): Array<{ eventName: string; aggregateId: string }> {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}