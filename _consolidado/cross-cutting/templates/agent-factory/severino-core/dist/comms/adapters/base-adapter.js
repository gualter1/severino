export class BaseAdapter {
    config;
    messageHandler;
    status = 'stopped';
    error;
    constructor(config) {
        this.config = config;
    }
    onMessage(handler) {
        this.messageHandler = handler;
    }
    emitMessage(message) {
        if (this.messageHandler) {
            this.messageHandler(message).catch(console.error);
        }
    }
    getStatus() {
        return { status: this.status, error: this.error?.message };
    }
    getName() {
        return this.config.name;
    }
    isEnabled() {
        return this.config.enabled;
    }
}
export class AdapterRegistry {
    adapters = new Map();
    defaultMessageHandler;
    register(adapter) {
        this.adapters.set(adapter.getName(), adapter);
        if (this.defaultMessageHandler) {
            adapter.onMessage((msg) => this.defaultMessageHandler(msg, adapter.getName()));
        }
    }
    unregister(name) {
        return this.adapters.delete(name);
    }
    get(name) {
        return this.adapters.get(name);
    }
    list() {
        return Array.from(this.adapters.values());
    }
    async startAll() {
        for (const adapter of this.adapters.values()) {
            if (adapter.isEnabled()) {
                try {
                    adapter.status = 'starting';
                    await adapter.start();
                    adapter.status = 'running';
                    console.log(`✅ Adapter ${adapter.getName()} started`);
                }
                catch (e) {
                    adapter.status = 'error';
                    adapter.error = e;
                    console.error(`❌ Adapter ${adapter.getName()} failed:`, e.message);
                }
            }
        }
    }
    async stopAll() {
        for (const adapter of this.adapters.values()) {
            try {
                await adapter.stop();
                adapter.status = 'stopped';
                console.log(`🛑 Adapter ${adapter.getName()} stopped`);
            }
            catch (e) {
                console.error(`❌ Error stopping ${adapter.getName()}:`, e.message);
            }
        }
    }
    setDefaultMessageHandler(handler) {
        this.defaultMessageHandler = handler;
        for (const adapter of this.adapters.values()) {
            adapter.onMessage((msg) => handler(msg, adapter.getName()));
        }
    }
    async broadcast(text, options) {
        for (const adapter of this.adapters.values()) {
            if (adapter.getStatus().status === 'running') {
                try {
                    // This is a simplified broadcast - in reality you'd need chat IDs
                    console.log(`📢 Broadcast to ${adapter.getName()}: ${text}`);
                }
                catch (e) {
                    console.error(`Broadcast error to ${adapter.getName()}:`, e);
                }
            }
        }
    }
}
export const adapterRegistry = new AdapterRegistry();
//# sourceMappingURL=base-adapter.js.map