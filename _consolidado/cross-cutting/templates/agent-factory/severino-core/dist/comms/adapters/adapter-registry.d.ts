import { Message } from "./base-adapter.ts";
import { TelegramAdapter } from "./telegram-adapter.ts";
import { WhatsAppAdapter } from "./whatsapp-adapter.ts";
export declare class CommandProcessor {
    private prefix;
    process(message: Message, adapterName: string): Promise<string | null>;
    private processNaturalLanguage;
    private isGreeting;
    private getHelp;
    private getStatus;
    private listTeams;
    private getTeamInfo;
    private executeTask;
    private listRobots;
    private listSkills;
    private listContexts;
    private queryModel;
    private scheduleGrill;
}
export declare function initializeAdapters(): Promise<void>;
export { TelegramAdapter, WhatsAppAdapter };
//# sourceMappingURL=adapter-registry.d.ts.map