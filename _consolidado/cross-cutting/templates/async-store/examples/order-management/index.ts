/**
 * order-management — Exemplo completo de AsyncStore (ADR-002).
 *
 * Domínio: Order aggregate com comandos CreateOrder / PayOrder / ShipOrder,
 * projection order-summary, snapshots a cada N eventos, outbox + subscriptions.
 */
import { createAsyncStore } from '../../src/store';
import { BaseCommandHandler, buildEvent, type Command } from '../../src/commands/command-handler';
import { Projection } from '../../src/events/projection';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderSummary {
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  itemCount: number;
  total: number;
}

class CreateOrderHandler extends BaseCommandHandler {
  commandType = 'CreateOrder';
  validate(cmd: Command): void {
    const items = cmd.payload.items as OrderItem[] | undefined;
    if (!cmd.payload.customerId || !items?.length) {
      throw new Error('Validation: customerId and non-empty items required');
    }
  }
  authorize(cmd: Command): void {
    if (!cmd.metadata?.userId) throw new Error('Authorization: requires userId');
  }
  async handle(cmd: Command) {
    return [buildEvent(cmd, 'OrderCreated', {
      customerId: cmd.payload.customerId,
      items: cmd.payload.items,
    })];
  }
}

class PayOrderHandler extends BaseCommandHandler {
  commandType = 'PayOrder';
  validate(cmd: Command): void {
    if (!cmd.payload.paymentId) throw new Error('Validation: paymentId required');
  }
  authorize(cmd: Command): void {
    if (!cmd.metadata?.userId) throw new Error('Authorization: requires userId');
  }
  async handle(cmd: Command) {
    return [buildEvent(cmd, 'OrderPaid', {
      paymentId: cmd.payload.paymentId,
      amount: cmd.payload.amount,
    })];
  }
}

class ShipOrderHandler extends BaseCommandHandler {
  commandType = 'ShipOrder';
  validate(cmd: Command): void {
    if (!cmd.payload.trackingCode) throw new Error('Validation: trackingCode required');
  }
  authorize(cmd: Command): void {
    const roles = cmd.metadata?.roles ?? [];
    if (!roles.includes('fulfillment') && !roles.includes('admin')) {
      throw new Error('Authorization: requires fulfillment role');
    }
  }
  async handle(cmd: Command) {
    return [buildEvent(cmd, 'OrderShipped', {
      trackingCode: cmd.payload.trackingCode,
      carrier: cmd.payload.carrier ?? 'default',
    })];
  }
}

export async function runOrderExample(): Promise<OrderSummary> {
  const store = createAsyncStore({ snapshotInterval: 2 });
  store.commandBus.register(new CreateOrderHandler());
  store.commandBus.register(new PayOrderHandler());
  store.commandBus.register(new ShipOrderHandler());

  const summary = new Projection<OrderSummary>(
    'order-summary',
    { status: 'pending', itemCount: 0, total: 0 },
    {
      OrderCreated: (s, e) => {
        const items = e.payload.items as OrderItem[];
        return {
          status: 'pending' as const,
          itemCount: items.reduce((n, i) => n + i.quantity, 0),
          total: items.reduce((n, i) => n + i.quantity * i.unitPrice, 0),
        };
      },
      OrderPaid: (s) => ({ ...s, status: 'paid' as const }),
      OrderShipped: (s) => ({ ...s, status: 'shipped' as const }),
      OrderCancelled: (s) => ({ ...s, status: 'cancelled' as const }),
    },
    store.eventStore,
    store.checkpointStore,
  );
  store.registerProjection(summary);

  // Real-time: notifica fulfillment quando pago
  store.subscriptions.subscribe('OrderPaid', (e) => {
    void e; // ADR-014: logger estruturado + outbox para fila de fulfillment
  });

  const orderId = 'order-001';
  const meta = { userId: 'u-customer-1', correlationId: 'corr-order-1' };

  const steps: Array<{ type: string; payload: Record<string, unknown>; key: string; extraMeta?: Record<string, unknown> }> = [
    {
      type: 'CreateOrder',
      payload: {
        customerId: 'cust-1',
        items: [{ productId: 'p-1', quantity: 2, unitPrice: 50 }],
      },
      key: 'order-create-1',
    },
    { type: 'PayOrder', payload: { paymentId: 'pay-1', amount: 100 }, key: 'order-pay-1' },
    {
      type: 'ShipOrder',
      payload: { trackingCode: 'TRK-123', carrier: 'fast-ship' },
      key: 'order-ship-1',
      extraMeta: { roles: ['fulfillment'] },
    },
  ];

  for (const [i, step] of steps.entries()) {
    const res = await store.commandBus.dispatch(
      {
        commandId: `cmd-${i + 1}`,
        commandType: step.type,
        aggregateId: orderId,
        aggregateType: 'Order',
        payload: step.payload,
        idempotencyKey: step.key,
        metadata: { ...meta, ...(step.extraMeta ?? {}) },
      },
      i === 0 ? 0 : -1,
    );
    if (!res.success || !res.events) throw new Error(`Step ${step.type} failed: ${res.error}`);
    for (const e of res.events) {
      await store.outboxStore.add(e);
      await store.subscriptions.publish(e);
    }
  }
  await store.outboxProcessor.drain();

  const finalState = await summary.rebuild();

  // Snapshot após fluxo completo (demonstra SnapshotManager)
  await store.snapshotManager.createSnapshot(orderId, 'Order', finalState, 3);

  return finalState;
}
