/**
 * 📡 Channel — contrato mínimo de um canal de entrada.
 * Sem telemetria, sem vendor lock. Só texto entra, texto sai.
 */

export interface InboundMessage {
  channel: string;
  from: string;
  text: string;
  hints?: {
    domain?: string;
    teamId?: string;
    room?: string;
  };
}

export interface ChannelMeta {
  id: string;
  label: string;
}

export interface Channel {
  meta: ChannelMeta;
  isConfigured(): boolean;
  start(dispatch: (msg: InboundMessage) => Promise<string>): Promise<void>;
  stop(): Promise<void>;
  send(to: string, text: string): Promise<void>;
}

/** Registro simples em memória: guarda canais e roteia mensagens inbound. */
export class ChannelRegistry {
  private channels = new Map<string, Channel>();

  register(channel: Channel): void {
    this.channels.set(channel.meta.id, channel);
    console.log(`📡 Canal registrado: ${channel.meta.id} (${channel.meta.label})`);
  }

  list(): Channel[] {
    return [...this.channels.values()];
  }

  get(id: string): Channel | undefined {
    return this.channels.get(id);
  }

  async dispatchInbound(msg: InboundMessage, handler: (msg: InboundMessage) => Promise<string>): Promise<string> {
    const ch = this.channels.get(msg.channel);
    if (!ch) throw new Error(`Canal desconhecido: ${msg.channel}`);
    return handler(msg);
  }
}
