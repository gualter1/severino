import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { defaultLogger } from './infrastructure/logging/logger';
import { CreateSampleHandler } from './application/handlers/create-sample.handler';
import { QueryHandler } from './application/handlers/query.handler';
import { InMemoryEventBus } from './infrastructure/messaging/in-memory-event-bus';
import { SampleHttpController } from './interfaces/http/sample.controller';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const logger = defaultLogger.withContext({ component: 'bootstrap' });

// In-memory wiring for bootstrap template demonstration
const store = new Map<string, import('./domain/entities/sample.entity').SampleEntity>();
const eventBus = new InMemoryEventBus();

const createHandler = new CreateSampleHandler({
  repository: {
    save: async (e) => { store.set(e.id, e); },
    findById: async (id) => store.get(id) ?? null,
  },
  eventBus,
  logger: defaultLogger.withContext({ handler: 'CreateSampleHandler' }),
  generateId: () => crypto.randomUUID(),
});

const queryHandler = new QueryHandler({
  repository: {
    save: async (e) => { store.set(e.id, e); },
    findById: async (id) => store.get(id) ?? null,
  },
  logger: defaultLogger.withContext({ handler: 'QueryHandler' }),
});

const controller = new SampleHttpController({ createHandler, queryHandler });

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const correlationId = req.headers['x-correlation-id'] ?? crypto.randomUUID();
  res.setHeader('X-Correlation-Id', correlationId as string);

  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      return;
    }

    if (url.pathname === '/sample/entities' && req.method === 'POST') {
      let bodyData = '';
      for await (const chunk of req) bodyData += chunk;
      const body = bodyData ? JSON.parse(bodyData) : {};

      let responseCode = 200;
      let responseBody: unknown;

      const mockRes = {
        status: (code: number) => { responseCode = code; return mockRes; },
        json: (payload: unknown) => { responseBody = payload; },
      };

      await controller.create({ body, headers: req.headers as Record<string, string> }, mockRes);
      res.writeHead(responseCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseBody));
      return;
    }

    if (url.pathname.startsWith('/sample/entities/') && req.method === 'GET') {
      const entityId = url.pathname.split('/')[3];
      let responseCode = 200;
      let responseBody: unknown;

      const mockRes = {
        status: (code: number) => { responseCode = code; return mockRes; },
        json: (payload: unknown) => { responseBody = payload; },
      };

      await controller.getById({ params: { entityId: entityId! }, headers: req.headers as Record<string, string> }, mockRes);
      res.writeHead(responseCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseBody));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode ?? 500;
    logger.error('Request failed', { error: err.message, stack: err.stack, statusCode });
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(port, () => {
  logger.info(`Feature skeleton server running on port ${port}`);
});
