export interface GrillSession {
    id: string;
    topic: string;
    scheduledAt: string;
    completedAt?: string;
    status: "pending" | "running" | "completed" | "failed";
    summary?: string;
    insights?: string[];
    actionItems?: string[];
}
export declare class GrillMeScheduler {
    private config;
    private sessions;
    private intervalId;
    private readonly grillDir;
    initialize(): Promise<void>;
    private loadSessions;
    schedule(topic: string, cronExpression?: string): GrillSession;
    runGrillSession(sessionId: string): Promise<GrillSession>;
    runGrillNow(topic: string): Promise<GrillSession>;
    startAutoGrill(cronExpression?: string): void;
    stopAutoGrill(): void;
    private parseCronToMs;
    private saveSession;
    listSessions(): GrillSession[];
    getSession(id: string): GrillSession | undefined;
}
export declare const grillScheduler: GrillMeScheduler;
//# sourceMappingURL=grill-scheduler.d.ts.map