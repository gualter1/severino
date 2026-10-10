import type { Command } from './command-bus';

export interface IQueryHandler<TQuery = any, TResult = any> {
  queryType: string;
  handle(query: TQuery): Promise<TResult>;
}

export class QueryBus {
  private handlers = new Map<string, IQueryHandler>();

  register<TQuery, TResult>(handler: IQueryHandler<TQuery, TResult>): void {
    if (this.handlers.has(handler.queryType)) {
      throw new Error(`Query handler already registered for ${handler.queryType}`);
    }
    this.handlers.set(handler.queryType, handler);
  }

  async execute<TQuery, TResult>(queryType: string, query: TQuery): Promise<TResult> {
    const handler = this.handlers.get(queryType);
    if (!handler) {
      throw new Error(`No handler for query ${queryType}`);
    }
    return handler.handle(query) as Promise<TResult>;
  }
}

export class BaseQueryHandler<TQuery = any, TResult = any> implements IQueryHandler<TQuery, TResult> {
  abstract queryType: string;
  abstract handle(query: TQuery): Promise<TResult>;
}

export interface QueryContext {
  userId?: string;
  roles?: string[];
  [key: string]: any;
}

export function createQueryContext(command: Command): QueryContext {
  return {
    userId: command.metadata?.userId,
    roles: command.metadata?.roles,
    correlationId: command.metadata?.correlationId,
  };
}