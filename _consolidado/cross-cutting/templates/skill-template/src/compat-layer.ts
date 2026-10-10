/**
 * compat-layer.ts — Bridge Pattern para Dual-Compat OpenCode V1/V2
 * 
 * Arquitetura decidida na Grill-Me Session 3 (ADR-022):
 * - Core do plugin agnóstico de versão
 * - Dois adapters: V1Adapter (callbacks) + V2Adapter (promises/async)
 * - Detecção runtime <1ms via feature detection
 * - Single build, single artifact, entrypoint único
 * 
 * Uso:
 *   import { createPluginCore } from './compat-layer';
 *   const plugin = createPluginCore();
 *   await plugin.run(input);
 */

// ============================================================
// INTERFACE COMUM (PluginAPI) — Contrato estável do core
// ============================================================

export interface PluginAPI {
  /** Logging estruturado */
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void;
  
  /** Armazenamento de estado (key-value) */
  storage: {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    keys(prefix?: string): Promise<string[]>;
  };
  
  /** Execução de comandos/ferramentas do host */
  exec: {
    /** Executa tool nativa do harness (ex: read_file, write_file, bash) */
    tool<TInput, TOutput>(name: string, input: TInput): Promise<TOutput>;
    /** Lista tools disponíveis */
    listTools(): Promise<string[]>;
  };
  
  /** Network egress controlado (allowlist) */
  network: {
    fetch(url: string, options?: RequestInit): Promise<Response>;
    /** Verifica se domínio está na allowlist */
    isAllowed(url: string): boolean;
  };
  
  /** Metadados do ambiente */
  env: {
    version: string;        // ex: "opencode-v1.2.3" ou "opencode-v2.0.0"
    workspaceRoot: string;  // path absoluto do workspace
    tempDir: string;        // diretório temporário isolado
    isV2: boolean;          // true se V2, false se V1
  };
}

// ============================================================
// TIPO DE SAÍDA DO CORE (PluginCore)
// ============================================================

export interface PluginCore {
  /** Inicializa o plugin (carrega config, valida deps) */
  initialize(config?: PluginConfig): Promise<void>;
  
  /** Executa a lógica principal do plugin */
  run(input: PluginInput): Promise<PluginOutput>;
  
  /** Cleanup (fecha conexões, limpa temp) */
  shutdown(): Promise<void>;
  
  /** Health check */
  healthCheck(): Promise<HealthStatus>;
}

export interface PluginConfig {
  /** Configuração customizada do plugin */
  [key: string]: unknown;
}

export interface PluginInput {
  /** Input principal (varia por plugin) */
  [key: string]: unknown;
}

export interface PluginOutput {
  /** Resultado da execução */
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface HealthStatus {
  healthy: boolean;
  version: string;
  uptime: number;
  checks: {
    storage: boolean;
    network: boolean;
    tools: boolean;
  };
}

// ============================================================
// ADAPTER V1 (OpenCode V1 — callbacks legacy)
// ============================================================

class V1Adapter implements PluginAPI {
  private legacyApi: any; // globalThis.opencode (V1)

  constructor() {
    this.legacyApi = (globalThis as any).opencode;
    if (!this.legacyApi) {
      throw new Error('V1Adapter: OpenCode V1 API não encontrada em globalThis.opencode');
    }
  }

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void {
    // V1 usa console global ou logger simples
    const prefix = `[V1:${level.toUpperCase()}]`;
    console[level === 'debug' ? 'log' : level](prefix, message, meta ?? '');
  }

  storage = {
    get: async <T>(key: string): Promise<T | null> => {
      return new Promise((resolve, reject) => {
        this.legacyApi.storage?.get(key, (err: any, value: any) => {
          if (err) reject(err);
          else resolve(value as T ?? null);
        });
      });
    },
    set: async <T>(key: string, value: T): Promise<void> => {
      return new Promise((resolve, reject) => {
        this.legacyApi.storage?.set(key, value, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    delete: async (key: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        this.legacyApi.storage?.delete(key, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    keys: async (prefix?: string): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        this.legacyApi.storage?.keys(prefix ?? '', (err: any, keys: string[]) => {
          if (err) reject(err);
          else resolve(keys);
        });
      });
    },
  };

  exec = {
    tool: async <TInput, TOutput>(name: string, input: TInput): Promise<TOutput> => {
      return new Promise((resolve, reject) => {
        this.legacyApi.execTool?.(name, input, (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result as TOutput);
        });
      });
    },
    listTools: async (): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        this.legacyApi.listTools?.((err: any, tools: string[]) => {
          if (err) reject(err);
          else resolve(tools);
        });
      });
    },
  };

  network = {
    fetch: async (url: string, options?: RequestInit): Promise<Response> => {
      // V1: delega pro host via tool nativa
      const result = await this.exec.tool<{ url: string; options?: RequestInit }, { status: number; body: string; headers: Record<string, string> }>(
        'http_fetch',
        { url, options }
      );
      return new Response(result.body, {
        status: result.status,
        headers: result.headers,
      });
    },
    isAllowed: (url: string): boolean => {
      // V1: allowlist check via host
      try {
        return this.legacyApi.network?.isAllowed?.(url) ?? false;
      } catch {
        return false;
      }
    },
  };

  env = {
    version: this.legacyApi.version ?? 'opencode-v1.unknown',
    workspaceRoot: this.legacyApi.workspaceRoot ?? process.cwd(),
    tempDir: this.legacyApi.tempDir ?? '/tmp',
    isV2: false,
  };
}

// ============================================================
// ADAPTER V2 (OpenCode V2 — promises/async nativo)
// ============================================================

class V2Adapter implements PluginAPI {
  private v2Api: any; // globalThis.opencode.v2

  constructor() {
    this.v2Api = (globalThis as any).opencode?.v2;
    if (!this.v2Api) {
      throw new Error('V2Adapter: OpenCode V2 API não encontrada em globalThis.opencode.v2');
    }
  }

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void {
    // V2 usa logger injetado estruturado
    this.v2Api.logger?.[level]?.(message, meta);
  }

  storage = {
    get: async <T>(key: string): Promise<T | null> => {
      return this.v2Api.storage?.get(key) ?? null;
    },
    set: async <T>(key: string, value: T): Promise<void> => {
      await this.v2Api.storage?.set(key, value);
    },
    delete: async (key: string): Promise<void> => {
      await this.v2Api.storage?.delete(key);
    },
    keys: async (prefix?: string): Promise<string[]> => {
      return this.v2Api.storage?.keys(prefix) ?? [];
    },
  };

  exec = {
    tool: async <TInput, TOutput>(name: string, input: TInput): Promise<TOutput> => {
      return this.v2Api.tools?.execute(name, input);
    },
    listTools: async (): Promise<string[]> => {
      return this.v2Api.tools?.list() ?? [];
    },
  };

  network = {
    fetch: async (url: string, options?: RequestInit): Promise<Response> => {
      // V2: fetch nativo com allowlist enforcement no host
      return this.v2Api.network?.fetch(url, options) ?? fetch(url, options);
    },
    isAllowed: (url: string): boolean => {
      return this.v2Api.network?.isAllowed?.(url) ?? false;
    },
  };

  env = {
    version: this.v2Api.version ?? 'opencode-v2.unknown',
    workspaceRoot: this.v2Api.workspaceRoot ?? process.cwd(),
    tempDir: this.v2Api.tempDir ?? '/tmp',
    isV2: true,
  };
}

// ============================================================
// DETECÇÃO DE VERSÃO (runtime <1ms)
// ============================================================

function detectVersion(): 'v1' | 'v2' {
  const g = globalThis as any;
  
  // Prioridade: V2 se disponível (mais moderno)
  if (g.opencode?.v2) {
    return 'v2';
  }
  
  // Fallback: V1 legacy
  if (g.opencode) {
    return 'v1';
  }
  
  // Ambiente de teste/dev sem host — mock para desenvolvimento
  if (process.env.NODE_ENV === 'test' || process.env.OPENCODE_MOCK === 'true') {
    return process.env.OPENCODE_VERSION === 'v1' ? 'v1' : 'v2';
  }
  
  throw new Error(
    'Nenhuma API OpenCode detectada. ' +
    'Certifique-se de rodar dentro do OpenCode (V1 ou V2) ' +
    'ou defina OPENCODE_MOCK=true para desenvolvimento.'
  );
}

// Cache do adapter detectado (singleton por processo)
let cachedAdapter: PluginAPI | null = null;

function getAdapter(): PluginAPI {
  if (!cachedAdapter) {
    const version = detectVersion();
    cachedAdapter = version === 'v2' ? new V2Adapter() : new V1Adapter();
    // Log único de inicialização
    cachedAdapter.log('info', `Compat-layer inicializado: OpenCode ${version.toUpperCase()}`, {
      version: cachedAdapter.env.version,
      workspaceRoot: cachedAdapter.env.workspaceRoot,
    });
  }
  return cachedAdapter;
}

// ============================================================
// FACTORY PRINCIPAL — Cria PluginCore com adapter correto
// ============================================================

export function createPluginCore(customAdapter?: PluginAPI): PluginCore {
  const adapter = customAdapter ?? getAdapter();
  let initialized = false;
  let config: PluginConfig = {};
  const startTime = Date.now();

  return {
    async initialize(customConfig?: PluginConfig) {
      if (initialized) {
        adapter.log('warn', 'PluginCore já inicializado — ignorando chamada duplicada');
        return;
      }
      
      config = customConfig ?? {};
      adapter.log('info', 'Inicializando PluginCore', { configKeys: Object.keys(config) });
      
      // Validações de ambiente
      const health = await this.healthCheck();
      if (!health.healthy) {
        throw new Error(`Health check falhou: ${JSON.stringify(health.checks)}`);
      }
      
      initialized = true;
      adapter.log('info', 'PluginCore inicializado com sucesso');
    },

    async run(input: PluginInput): Promise<PluginOutput> {
      if (!initialized) {
        await this.initialize();
      }
      
      const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      adapter.log('info', 'Executando plugin', { runId, inputKeys: Object.keys(input) });
      
      try {
        // ============================================================
        // LÓGICA DO PLUGIN AQUI (substitua pela implementação real)
        // ============================================================
        // Exemplo: processa input usando adapter.storage, adapter.exec, etc.
        const result = await this.executePluginLogic(input, adapter);
        
        adapter.log('info', 'Plugin executado com sucesso', { runId });
        return { success: true, data: result, metadata: { runId } };
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        adapter.log('error', 'Erro na execução do plugin', { runId, error: err.message });
        return { success: false, error: err.message, metadata: { runId } };
      }
    },

    async shutdown(): Promise<void> {
      adapter.log('info', 'Desligando PluginCore');
      // Cleanup: fecha conexões, limpa temp, etc.
      initialized = false;
    },

    async healthCheck(): Promise<HealthStatus> {
      const checks = {
        storage: false,
        network: false,
        tools: false,
      };
      
      try {
        // Testa storage
        await adapter.storage.set('__health_check__', 'ok');
        const val = await adapter.storage.get('__health_check__');
        checks.storage = val === 'ok';
        await adapter.storage.delete('__health_check__');
      } catch {
        checks.storage = false;
      }
      
      try {
        // Testa network (allowlist check)
        checks.network = adapter.network.isAllowed('https://api.github.com');
      } catch {
        checks.network = false;
      }
      
      try {
        // Testa tools
        const tools = await adapter.exec.listTools();
        checks.tools = Array.isArray(tools) && tools.length > 0;
      } catch {
        checks.tools = false;
      }
      
      const healthy = checks.storage && checks.network && checks.tools;
      
      return {
        healthy,
        version: adapter.env.version,
        uptime: Date.now() - startTime,
        checks,
      };
    },

    // Lógica real do plugin (substitua esta implementação)
    async executePluginLogic(input: PluginInput, api: PluginAPI): Promise<unknown> {
      // Placeholder — desenvolvedor implementa aqui
      api.log('info', 'executePluginLogic chamado — implemente a lógica do seu plugin', { input });
      
      // Exemplo de uso dos adapters:
      // const config = await api.storage.get('my-plugin:config');
      // const result = await api.exec.tool('read_file', { path: input.filePath });
      // await api.storage.set('my-plugin:last-run', Date.now());
      
      return { message: 'Plugin executado (placeholder)', received: input };
    },
  };
}

// ============================================================
// HELPERS PARA TESTES (permite injetar mock adapter)
// ============================================================

export function createMockAdapter(overrides: Partial<PluginAPI> = {}): PluginAPI {
  const mockStorage: Record<string, unknown> = {};
  
  return {
    log: overrides.log ?? (() => {}),
    storage: {
      get: async <T>(key: string) => (mockStorage[key] as T) ?? null,
      set: async <T>(key: string, value: T) => { mockStorage[key] = value; },
      delete: async (key: string) => { delete mockStorage[key]; },
      keys: async (prefix?: string) => Object.keys(mockStorage).filter(k => !prefix || k.startsWith(prefix)),
      ...overrides.storage,
    },
    exec: {
      tool: async <TInput, TOutput>(name: string, input: TInput) => {
        if (overrides.exec?.tool) return overrides.exec.tool(name, input);
        return { success: true, mock: true, tool: name, input } as TOutput;
      },
      listTools: async () => ['read_file', 'write_file', 'bash', 'http_fetch'],
      ...overrides.exec,
    },
    network: {
      fetch: async (url: string) => new Response(JSON.stringify({ mock: true, url }), { status: 200 }),
      isAllowed: (url: string) => true,
      ...overrides.network,
    },
    env: {
      version: 'opencode-mock-v2.0.0',
      workspaceRoot: process.cwd(),
      tempDir: '/tmp',
      isV2: true,
      ...overrides.env,
    },
  };
}

// ============================================================
// EXPORTS PRINCIPAIS
// ============================================================

export { detectVersion, getAdapter, V1Adapter, V2Adapter };

// Export default para conveniência
export default {
  createPluginCore,
  createMockAdapter,
  detectVersion,
  PluginAPI,
  PluginCore,
  PluginConfig,
  PluginInput,
  PluginOutput,
  HealthStatus,
};