/**
 * mock-v1-harness.ts — Simula o ambiente OpenCode V1 (Callbacks)
 */

export class MockV1Harness {
  private store: Map<string, any> = new Map();
  private tools: Map<string, Function> = new Map();
  private allowlist: Set<string> = new Set(['https://api.github.com', 'https://registry.npmjs.org']);

  version = 'opencode-v1.8.0';
  workspaceRoot = process.cwd();
  tempDir = '/tmp';

  constructor() {
    this.tools.set('read_file', (input: { path: string }) => ({ content: `v1 file content for ${input.path}` }));
    this.tools.set('write_file', (input: { path: string; content: string }) => ({ success: true, bytes: input.content.length }));
    this.tools.set('http_fetch', (input: { url: string; options?: RequestInit }) => {
      if (!this.network.isAllowed(input.url)) {
        throw new Error(`URL não permitida pela allowlist V1: ${input.url}`);
      }
      return { status: 200, body: JSON.stringify({ v1: true, url: input.url }), headers: { 'content-type': 'application/json' } };
    });
  }

  storage = {
    get: (key: string, callback: (err: any, value: any) => void) => {
      try {
        const val = this.store.get(key) ?? null;
        callback(null, val);
      } catch (err) {
        callback(err, null);
      }
    },
    set: (key: string, value: any, callback: (err: any) => void) => {
      try {
        this.store.set(key, value);
        callback(null);
      } catch (err) {
        callback(err);
      }
    },
    delete: (key: string, callback: (err: any) => void) => {
      try {
        this.store.delete(key);
        callback(null);
      } catch (err) {
        callback(err);
      }
    },
    keys: (prefix: string, callback: (err: any, keys: string[]) => void) => {
      try {
        const allKeys = Array.from(this.store.keys());
        const filtered = prefix ? allKeys.filter(k => k.startsWith(prefix)) : allKeys;
        callback(null, filtered);
      } catch (err) {
        callback(err, []);
      }
    }
  };

  execTool = (name: string, input: any, callback: (err: any, result: any) => void) => {
    try {
      const toolFn = this.tools.get(name);
      if (!toolFn) {
        throw new Error(`Tool V1 não encontrada: ${name}`);
      }
      const result = toolFn(input);
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  };

  listTools = (callback: (err: any, tools: string[]) => void) => {
    try {
      callback(null, Array.from(this.tools.keys()));
    } catch (err) {
      callback(err, []);
    }
  };

  network = {
    isAllowed: (url: string): boolean => {
      for (const allowed of this.allowlist) {
        if (url.startsWith(allowed)) return true;
      }
      return false;
    }
  };

  install() {
    (globalThis as any).opencode = {
      version: this.version,
      workspaceRoot: this.workspaceRoot,
      tempDir: this.tempDir,
      storage: this.storage,
      execTool: this.execTool,
      listTools: this.listTools,
      network: this.network,
    };
    if ((globalThis as any).opencode) {
      delete (globalThis as any).opencode.v2;
    }
  }

  uninstall() {
    delete (globalThis as any).opencode;
  }
}
