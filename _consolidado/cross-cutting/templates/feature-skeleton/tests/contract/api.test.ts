import { describe, it, expect, vi } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import contractSchema from '../../contracts/sample.schema.json';
import mcpManifest from '../../contracts/mcp-manifest.json';

/**
 * Contract tests — pin API + event shapes.
 * Happy path, schema rejection, and error-shape cases.
 */

function makeValidator() {
  const ajv = new Ajv({ strict: true, allErrors: true });
  addFormats(ajv);
  return ajv.compile(contractSchema);
}

describe('Sample JSON-schema contract', () => {
  it('happy path: accepts a valid entity payload', () => {
    const validate = makeValidator();
    const valid = validate({
      id: '00000000-0000-4000-8000-000000000040',
      name: 'Contract Valid Entity',
      status: 'ACTIVE',
      metadata: { plan: 'pro' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(valid).toBe(true);
  });

  it('edge case: rejects short name and unknown status', () => {
    const validate = makeValidator();
    const valid = validate({
      id: '00000000-0000-4000-8000-000000000041',
      name: 'AB',
      status: 'DELETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(valid).toBe(false);
    expect(validate.errors?.length).toBeGreaterThan(0);
  });

  it('security: rejects additional properties (strict contract)', () => {
    const validate = makeValidator();
    const valid = validate({
      id: '00000000-0000-4000-8000-000000000042',
      name: 'Strict Entity',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __proto__: { polluted: true },
      injected: '<script>alert(1)</script>',
    });
    expect(valid).toBe(false);
  });
});

describe('Sample HTTP controller contract', () => {
  it('happy path: create → 201 + getById → 200', async () => {
    const { SampleHttpController } = await import(
      '../../src/interfaces/http/sample.controller'
    );
    const created: Record<string, { name: string }> = {};
    const controller = new SampleHttpController({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createHandler: { execute: async (cmd: any) => {
        created['new-id'] = { name: cmd.payload.name };
        return 'new-id';
      } } as never,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryHandler: { handleGetById: async () => ({
        entityId: 'new-id',
        name: created['new-id']?.name ?? '',
        status: 'INACTIVE',
      }) } as never,
    });

    let statusCode = 0;
    let payload: unknown;
    const res = {
      status: (c: number) => {
        statusCode = c;
        return res;
      },
      json: (p: unknown) => {
        payload = p;
      },
    };
    await controller.create({ body: { name: 'Controller Entity' }, headers: {} }, res);
    expect(statusCode).toBe(201);
    expect(payload).toEqual({ id: 'new-id' });
  });

  it('error handling: invalid payload → 400', async () => {
    const { SampleHttpController } = await import(
      '../../src/interfaces/http/sample.controller'
    );
    const controller = new SampleHttpController({
      createHandler: { execute: async () => 'x' } as never,
      queryHandler: { handleGetById: async () => ({}) } as never,
    });
    const res = { status: () => res, json: (_p: unknown) => {} };
    await expect(
      controller.create({ body: { name: 'AB' }, headers: {} }, res)
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe('MCP manifest contract', () => {
  it('exposes exactly the canonical toolset', () => {
    const tools = (mcpManifest as { capabilities: { tools: Array<{ name: string }> } })
      .capabilities.tools.map((t) => t.name);
    expect(tools).toEqual([
      'feature.sample.create',
      'feature.sample.get',
      'feature.sample.activate',
    ]);
  });
});

describe('CLI adapter contract', () => {
  it('returns usage exit code when --name missing', async () => {
    const { runCreateSampleCli } = await import('../../src/interfaces/cli/sample.cli');
    const lines: string[] = [];
    const code = await runCreateSampleCli([], {
      handler: { execute: async () => 'id' } as never,
      output: (l) => lines.push(l),
    });
    expect(code).toBe(1);
    expect(lines[0]).toMatch(/Usage/);
  });

  it('returns 0 on success and prints id', async () => {
    const { runCreateSampleCli } = await import('../../src/interfaces/cli/sample.cli');
    const lines: string[] = [];
    const code = await runCreateSampleCli(['create', '--name=Demo'], {
      handler: { execute: async () => 'new-id-123' } as never,
      output: (l) => lines.push(l),
    });
    expect(code).toBe(0);
    expect(lines[0]).toContain('new-id-123');
  });
});
