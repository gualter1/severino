import { TaskResponse } from "../types.js";
export declare class ReporterAgent {
    formatTaskCompletion(response: TaskResponse): string;
    formatTeamStatus(teamId: string, robots: any[]): string;
}
export declare const reporter: ReporterAgent;
//# sourceMappingURL=reporter.d.ts.map