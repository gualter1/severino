/**
 * command-handler.ts — helpers para implementar ICommandHandler (ADR-002).
 * Cross-ref ADR-014: handlers devem logar via contexto, nunca console.log.
 */
import { BaseCommandHandler, ValidationError, AuthorizationError, type Command } from './command-bus';
import type { DomainEvent } from '../events/event-store';

export { BaseCommandHandler, ValidationError, AuthorizationError };

export interface HandlerContext {
  userId?: string;
  roles?: string[];
  correlationId?: string;
}

export function contextFromCommand(cmd: Command): HandlerContext {
  return {
    userId: cmd.metadata?.userId,
    correlationId: cmd.metadata?.correlationId,
    roles: cmd.metadata?.roles,
  };
}

export function buildEvent<TPayload extends Record<string, any>>(
  command: Command,
  eventType: string,
  payload: TPayload,
): Omit<DomainEvent<TPayload>, 'eventId' | 'timestamp' | 'version'> {
  return {
    aggregateId: command.aggregateId,
    aggregateType: command.aggregateType,
    eventType,
    payload,
    metadata: {
      correlationId: command.metadata?.correlationId,
      causationId: command.commandId,
      userId: command.metadata?.userId,
    },
  };
}

export function requireRoles(ctx: HandlerContext, allowed: string[]): void {
  if (allowed.length === 0) return;
  const roles = ctx.roles ?? [];
  if (!allowed.some((r) => roles.includes(r))) {
    throw new AuthorizationError(`Requires one of roles: ${allowed.join(', ')}`);
  }
}
