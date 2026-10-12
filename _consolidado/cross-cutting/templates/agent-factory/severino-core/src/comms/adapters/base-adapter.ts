export type AdapterConfig = {
  name: string;
  enabled: boolean;
  config: Record<string, any>;
};

export type Message = {
  id: string;
  chatId: string;
  userId: string;
  username?: string;
  text: string;
  timestamp: Date;
  raw?: any;
};

export type SendOptions = {
  parseMode?: 'markdown' | 'html' | 'plain';
  replyToMessageId?: string;
};

export abstract class BaseAdapter {
  protected config: AdapterConfig;
  protected messageHandler?: (message: Message) => Promise<void>;
  public status: 'stopped' | 'starting' | 'running' | 'error' = 'stopped';
  public error?: Error;

  constructor(config: AdapterConfig) {
    this.config = config;
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract sendMessage(chatId: string, text: string, options?: SendOptions): Promise<void>;

  onMessage(handler: (message: Message) => Promise<void>): void {
    this.messageHandler = handler;
  }

  protected emitMessage(message: Message): void {
    if (this.messageHandler) {
      this.messageHandler(message).catch(console.error);
    }
  }

  getStatus(): { status: string; error?: string } {
    return { status: this.status, error: this.error?.message };
  }

  getName(): string {
    return this.config.name;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

export class AdapterRegistry {
  private adapters = new Map<string, BaseAdapter>();
  private defaultMessageHandler?: (message: Message, adapterName: string) => Promise<void>;

  register(adapter: BaseAdapter): void {
    this.adapters.set(adapter.getName(), adapter);
    if (this.defaultMessageHandler) {
      adapter.onMessage((msg) => this.defaultMessageHandler!(msg, adapter.getName()));
    }
  }

  unregister(name: string): boolean {
    return this.adapters.delete(name);
  }

  get(name: string): BaseAdapter | undefined {
    return this.adapters.get(name);
  }

  list(): BaseAdapter[] {
    return Array.from(this.adapters.values());
  }

  async startAll(): Promise<void> {
    // Start adapters concurrently so one slow adapter never blocks the others.
    await Promise.allSettled(
      Array.from(this.adapters.values())
        .filter((adapter) => adapter.isEnabled())
        .map(async (adapter) => {
          try {
            adapter.status = 'starting';
            await adapter.start();
            adapter.status = 'running';
            console.log(`✅ Adapter ${adapter.getName()} started`);
          } catch (e: any) {
            adapter.status = 'error';
            adapter.error = e;
            console.error(`❌ Adapter ${adapter.getName()} failed:`, e.message);
          }
        })
    );
  }

  async stopAll(): Promise<void> {
    for (const adapter of this.adapters.values()) {
      try {
        await adapter.stop();
        adapter.status = 'stopped';
        console.log(`🛑 Adapter ${adapter.getName()} stopped`);
      } catch (e: any) {
        console.error(`❌ Error stopping ${adapter.getName()}:`, e.message);
      }
    }
  }

  setDefaultMessageHandler(handler: (message: Message, adapterName: string) => Promise<void>): void {
    this.defaultMessageHandler = handler;
    for (const adapter of this.adapters.values()) {
      adapter.onMessage((msg) => handler(msg, adapter.getName()));
    }
  }

  async broadcast(text: string, options?: SendOptions): Promise<void> {
    for (const adapter of this.adapters.values()) {
      if (adapter.getStatus().status === 'running') {
        try {
          // This is a simplified broadcast - in reality you'd need chat IDs
          console.log(`📢 Broadcast to ${adapter.getName()}: ${text}`);
        } catch (e) {
          console.error(`Broadcast error to ${adapter.getName()}:`, e);
        }
      }
    }
  }
}

export const adapterRegistry = new AdapterRegistry();