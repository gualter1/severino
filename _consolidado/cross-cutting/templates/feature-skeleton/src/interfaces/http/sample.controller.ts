import { CreateSampleCommand } from '../../../application/commands';
import { CreateSampleHandler } from '../../../application/handlers/create-sample.handler';
import { GetSampleByIdQuery } from '../../../application/queries';
import { QueryHandler } from '../../../application/handlers/query.handler';

/**
 * HTTP adapter — validates, sanitizes, maps HTTP <-> application layer.
 * No business logic here. Auth enforced by middleware; validated payload only.
 */

export interface HttpRequest {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface HttpResponse {
  status(code: number): HttpResponse;
  json(payload: unknown): void;
}

export interface SampleHttpControllerDeps {
  createHandler: CreateSampleHandler;
  queryHandler: QueryHandler;
}

function getCorrelationId(headers?: Record<string, string>): string | undefined {
  return headers?.['x-correlation-id'] ?? headers?.['X-Correlation-Id'];
}

function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') throw Object.assign(new Error('name must be a string'), { statusCode: 400 });
  // Basic sanitization: trim + strip control chars (ADR-007). Prefer validator lib in prod.
  // eslint-disable-next-line no-control-regex
  return raw.trim().replace(/[\u0000-\u001F\u007F]/g, '');
}

export class SampleHttpController {
  constructor(private readonly deps: SampleHttpControllerDeps) {}

  async create(req: HttpRequest, res: HttpResponse): Promise<void> {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = sanitizeName(body['name']);
    const metadata =
      body['metadata'] && typeof body['metadata'] === 'object'
        ? (body['metadata'] as Record<string, unknown>)
        : {};

    if (name.length < 3 || name.length > 128) {
      throw Object.assign(new Error('name must be 3–128 chars'), { statusCode: 400 });
    }

    const id = await this.deps.createHandler.execute(
      new CreateSampleCommand({ name, metadata }, getCorrelationId(req.headers))
    );
    res.status(201).json({ id });
  }

  async getById(req: HttpRequest, res: HttpResponse): Promise<void> {
    const entityId = req.params?.['entityId'];
    if (!entityId) throw Object.assign(new Error('entityId is required'), { statusCode: 400 });
    const result = await this.deps.queryHandler.handleGetById(
      new GetSampleByIdQuery({ entityId }, getCorrelationId(req.headers))
    );
    res.status(200).json(result);
  }
}

/** Express-style router factory — framework-agnostic wiring. */
export function createSampleRouter(deps: SampleHttpControllerDeps): {
  post: (req: HttpRequest, res: HttpResponse) => Promise<void>;
  get: (req: HttpRequest, res: HttpResponse) => Promise<void>;
} {
  const controller = new SampleHttpController(deps);
  return {
    post: (req, res) => controller.create(req, res),
    get: (req, res) => controller.getById(req, res),
  };
}
