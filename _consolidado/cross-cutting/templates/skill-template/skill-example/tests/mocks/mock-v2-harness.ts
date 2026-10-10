/**
 * mock-v2-harness.ts — Simula o ambiente OpenCode V2 (Promises & Async Nativas)
 */

export class MockV2Harness {
  private store: Map<string, any> = new Map();
  private tools: Map<string, Function> = new Map();
  private allowlist: Set<string> = new Set(['https://api.github.com', 'https://registry.npmjs.org']);

  version = 'opencode-v2.1.0';
  workspaceRoot = process.cwd();
  tempDir = '/tmp';

  constructor() {
    this.tools.set('read_file', async (input: { path: string }) => ({ content: `v2 file content for ${input.path}` }));
    this.tools.set('write_file', async (input: { path: string; content: string }) => ({ success: true, bytes: input.content.length }));
  }

  storage = {
    get: async <T>(key: string): Promise<T | null> => {
      return this.store.get(key) ?? null;
    },
    set: async <T>(key: string, value: T): Promise<void> => {
      this.store.set(key, value);
    },
    delete: async (key: string): Promise<void> => {
      this.store.delete(key);
    },
    keys: async (prefix?: string): Promise<string[]> => {
      const allKeys = Array.from(this.store.keys());
      return prefix ? allKeys.filter(k => k.startsWith(prefix)) : allKeys;
    }
  };

  toolsApi = {
    execute: async <TInput, TOutput>(name: string, input: TInput): Promise<TOutput> => {
      const toolFn = this.tools.get(name);
      if (!toolFn) {
        throw new Error(`Tool V2 não encontrada: ${name}`);
      }
      return toolFn(input) as Promise<TOutput>;
    },
    list: async (): Promise<string[]> => {
      return Array.from(this.tools.keys());
    }
  };

  network = {
    fetch: async (url: string, options?: RequestInit): Promise<Response> => {
      if (!this.network.isAllowed(url)) {
        throw new Error(`URL não permitida pela allowlist V2: ${url}`);
      }
      return new Response(JSON.stringify({ v2: true, url }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    },
    isAllowed: (url: string): boolean => {
      for (const allowed of this.allowlist) {
        if (url.startsWith(allowed)) return true;
      }
      return false;
    }
  };

  logger = {
    debug: (msg: string, meta?: any) => {},
    info: (msg: string, meta?: any) => {},
    warn: (msg: string, meta?: any) => {},
    error: (msg: string, meta?: any) => {},
  };

  install() {
    (globalThis as any).opencode = {
      v2: {
        version: this.version,
        workspaceRoot: this.workspaceRoot,
        tempDir: this.tempDir,
        storage: this.storage,
        tools: this.toolsApi,
        network: this.network,
        logger: this.logger,
      }
    };
  }

  uninstall() {
    delete (globalThis as any).opencode;
  }
}
