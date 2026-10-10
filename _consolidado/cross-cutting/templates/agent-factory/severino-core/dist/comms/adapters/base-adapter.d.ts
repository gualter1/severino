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
export declare abstract class BaseAdapter {
    protected config: AdapterConfig;
    protected messageHandler?: (message: Message) => Promise<void>;
    status: 'stopped' | 'starting' | 'running' | 'error';
    error?: Error;
    constructor(config: AdapterConfig);
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract sendMessage(chatId: string, text: string, options?: SendOptions): Promise<void>;
    onMessage(handler: (message: Message) => Promise<void>): void;
    protected emitMessage(message: Message): void;
    getStatus(): {
        status: string;
        error?: string;
    };
    getName(): string;
    isEnabled(): boolean;
}
export declare class AdapterRegistry {
    private adapters;
    private defaultMessageHandler?;
    register(adapter: BaseAdapter): void;
    unregister(name: string): boolean;
    get(name: string): BaseAdapter | undefined;
    list(): BaseAdapter[];
    startAll(): Promise<void>;
    stopAll(): Promise<void>;
    setDefaultMessageHandler(handler: (message: Message, adapterName: string) => Promise<void>): void;
    broadcast(text: string, options?: SendOptions): Promise<void>;
}
export declare const adapterRegistry: AdapterRegistry;
//# sourceMappingURL=base-adapter.d.ts.map