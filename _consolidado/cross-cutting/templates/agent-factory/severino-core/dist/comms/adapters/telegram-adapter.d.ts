import { BaseAdapter, AdapterConfig, SendOptions } from "./base-adapter.js";
export declare class TelegramAdapter extends BaseAdapter {
    private bot;
    private polling;
    constructor(config: AdapterConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(chatId: string, text: string, options?: SendOptions): Promise<void>;
    getBot(): any;
}
export declare function createTelegramAdapter(config?: Partial<AdapterConfig>): Promise<TelegramAdapter>;
//# sourceMappingURL=telegram-adapter.d.ts.map