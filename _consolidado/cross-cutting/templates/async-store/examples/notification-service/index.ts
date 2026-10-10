/**
 * notification-service — Exemplo simples de AsyncStore (ADR-002).
 *
 * Fluxo: SendNotification (command) → NotificationSent (event)
 *        → projection unread-count → outbox → subscription fan-out.
 */
import { createAsyncStore } from '../../src/store';
import { BaseCommandHandler, buildEvent, type Command } from '../../src/commands/command-handler';
import { Projection } from '../../src/events/projection';

interface NotificationState {
  unreadByUser: Record<string, number>;
}

class SendNotificationHandler extends BaseCommandHandler {
  commandType = 'SendNotification';

  validate(cmd: Command): void {
    if (!cmd.payload.userId || !cmd.payload.message) {
      throw new Error('Validation: userId and message required');
    }
  }

  authorize(cmd: Command): void {
    if (!cmd.metadata?.userId) throw new Error('Authorization: requires sender');
  }

  async handle(cmd: Command) {
    return [buildEvent(cmd, 'NotificationSent', {
      userId: cmd.payload.userId,
      message: cmd.payload.message,
      channel: cmd.payload.channel ?? 'in-app',
    })];
  }
}

export async function runNotificationExample(): Promise<NotificationState> {
  const store = createAsyncStore();
  store.commandBus.register(new SendNotificationHandler());

  const unread = new Projection<NotificationState>(
    'unread-count',
    { unreadByUser: {} },
    {
      NotificationSent: (s, e) => ({
        unreadByUser: {
          ...s.unreadByUser,
          [String(e.payload.userId)]: (s.unreadByUser[String(e.payload.userId)] ?? 0) + 1,
        },
      }),
    },
    store.eventStore,
    store.checkpointStore,
  );
  store.registerProjection(unread);

  // Real-time: subscriber reage a cada notificação (SSE/WS no prod)
  store.subscriptions.subscribe('NotificationSent', (e) => {
    // ADR-014: aqui entraria logger estruturado com correlationId
    void e;
  });

  const res = await store.commandBus.dispatch({
    commandId: 'cmd-1',
    commandType: 'SendNotification',
    aggregateId: 'notif-1',
    aggregateType: 'Notification',
    payload: { userId: 'u-123', message: 'Pedido enviado!' },
    idempotencyKey: 'notif-idem-1',
    metadata: { userId: 'system', correlationId: 'corr-1' },
  });

  if (!res.success || !res.events) throw new Error(res.error ?? 'dispatch failed');

  // Outbox: mesma transação lógica dos eventos (aqui manual p/ exemplo)
  for (const e of res.events) {
    await store.outboxStore.add(e);
    await store.subscriptions.publish(e);
  }
  await store.outboxProcessor.drain();

  return unread.rebuild();
}
