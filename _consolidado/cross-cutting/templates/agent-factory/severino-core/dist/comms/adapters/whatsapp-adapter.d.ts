import { BaseAdapter, AdapterConfig, SendOptions } from "./base-adapter.js";
export declare class WhatsAppAdapter extends BaseAdapter {
    private client;
    private ready;
    constructor(config: AdapterConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(chatId: string, text: string, options?: SendOptions): Promise<void>;
    isReady(): boolean;
    getClient(): any;
}
export declare function createWhatsAppAdapter(config?: Partial<AdapterConfig>): Promise<WhatsAppAdapter>;
//# sourceMappingURL=whatsapp-adapter.d.ts.map