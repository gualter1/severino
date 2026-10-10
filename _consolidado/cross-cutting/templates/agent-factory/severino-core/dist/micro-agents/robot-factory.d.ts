import { TaskRequest, TaskResponse } from "../types.js";
interface RobotInstance {
    robotId: string;
    role: string;
    teamId: string;
    roomDir: string;
    capabilities: string[];
    status: "idle" | "busy" | "error";
    currentTaskId?: string;
}
export declare class RobotFactoryAgent {
    private config;
    private robots;
    private teams;
    createTeam(request: {
        teamId: string;
        name: string;
        domain: string;
        roles: string[];
        initialSkills?: string[];
    }): Promise<{
        teamId: string;
        robots: RobotInstance[];
    }>;
    createRobot(params: {
        robotId: string;
        role: string;
        teamId: string;
        name: string;
    }): Promise<RobotInstance>;
    executeTask(robotId: string, task: TaskRequest): Promise<TaskResponse>;
    private buildRobotPrompt;
    private extractReportAndResult;
    getRobot(robotId: string): RobotInstance | undefined;
    getTeam(teamId: string): {
        teamId: string;
        name: string;
        domain: string;
        robotIds: string[];
        status: string;
        totalTasksCompleted: number;
    } | undefined;
    listRobots(): RobotInstance[];
    listTeams(): {
        teamId: string;
        name: string;
        domain: string;
        robotIds: string[];
        status: string;
        totalTasksCompleted: number;
    }[];
}
export declare const robotFactory: RobotFactoryAgent;
export {};
//# sourceMappingURL=robot-factory.d.ts.map