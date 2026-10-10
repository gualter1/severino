import type { DomainEvent } from '../events/event-store';

export type SubscriptionCallback = (event: DomainEvent) => void | Promise<void>;

export class SubscriptionManager {
  private subscribers = new Map<string, Set<SubscriptionCallback>>();

  subscribe(eventType: string, callback: SubscriptionCallback): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    const subs = this.subscribers.get(eventType)!;
    subs.add(callback);

    // Return unsubscribe function
    return () => {
      subs.delete(callback);
      if (subs.size === 0) {
        this.subscribers.delete(eventType);
      }
    };
  }

  async publish(event: DomainEvent): Promise<void> {
    const subs = this.subscribers.get(event.eventType);
    const wildcardSubs = this.subscribers.get('*');

    const promises: Promise<void>[] = [];

    if (subs) {
      for (const cb of subs) {
        promises.push(Promise.resolve(cb(event)));
      }
    }

    if (wildcardSubs) {
      for (const cb of wildcardSubs) {
        promises.push(Promise.resolve(cb(event)));
      }
    }

    await Promise.allSettled(promises);
  }
}
