import { ExecutionReport } from "@severino-learning/report-schema.js";
export declare class LearningEngineAgent {
    buildContext(domain: string, objective: string): Promise<{
        injectionMarkdown: string;
        taskSignature: string;
        hasContext: boolean;
        contextVersion: number;
    }>;
    absorbReport(report: ExecutionReport): Promise<{
        summary: string;
        contextVersion: number;
        newLearnings: {
            patterns: number;
            traps: number;
            shortcuts: number;
            promoted: number;
        };
    }>;
    getContext(domain: string, taskSignature: string): Promise<{
        domain: string;
        taskSignature: string;
        version: number;
        patterns: {
            id: string;
            pattern: string;
            trigger: string;
            domain: string;
            confidence: number;
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesApplied: number;
            timesConfirmed: number;
            timesContradicted: number;
        }[];
        traps: {
            id: string;
            trap: string;
            symptom: string;
            rootCause: string;
            prevention: string;
            domain: string;
            severity: "critical" | "high" | "medium" | "low";
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesEncountered: number;
            timesPrevented: number;
        }[];
        shortcuts: {
            id: string;
            name: string;
            type: "tool" | "skill" | "mcp" | "template" | "snippet";
            description: string;
            trigger: string;
            domain: string;
            estimatedTimeSaved: string;
            sourceReports: string[];
            status: "candidate" | "validated" | "official" | "deprecated";
            createdAt: string;
            updatedAt: string;
            version?: string | undefined;
        }[];
        metrics: {
            reportsAbsorbed: number | null;
            avgTimeWithoutContextMs?: number | null | undefined;
            avgTimeWithContextMs?: number | null | undefined;
            successRateWithoutContext?: number | null | undefined;
            successRateWithContext?: number | null | undefined;
        };
        sourceReportIds: string[];
        lastUpdated: string;
        updatedBy: string;
    } | null>;
    listContexts(): Promise<{
        domain: string;
        taskSignature: string;
        version: number;
        patterns: {
            id: string;
            pattern: string;
            trigger: string;
            domain: string;
            confidence: number;
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesApplied: number;
            timesConfirmed: number;
            timesContradicted: number;
        }[];
        traps: {
            id: string;
            trap: string;
            symptom: string;
            rootCause: string;
            prevention: string;
            domain: string;
            severity: "critical" | "high" | "medium" | "low";
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesEncountered: number;
            timesPrevented: number;
        }[];
        shortcuts: {
            id: string;
            name: string;
            type: "tool" | "skill" | "mcp" | "template" | "snippet";
            description: string;
            trigger: string;
            domain: string;
            estimatedTimeSaved: string;
            sourceReports: string[];
            status: "candidate" | "validated" | "official" | "deprecated";
            createdAt: string;
            updatedAt: string;
            version?: string | undefined;
        }[];
        metrics: {
            reportsAbsorbed: number | null;
            avgTimeWithoutContextMs?: number | null | undefined;
            avgTimeWithContextMs?: number | null | undefined;
            successRateWithoutContext?: number | null | undefined;
            successRateWithContext?: number | null | undefined;
        };
        sourceReportIds: string[];
        lastUpdated: string;
        updatedBy: string;
    }[]>;
    runFullCycle(domain: string, objective: string, executeRobot: (prompt: string) => Promise<{
        result: any;
        report: ExecutionReport;
    }>): Promise<{
        result: any;
        learningSummary: string;
    }>;
    exportKnowledge(): Promise<string>;
}
export declare const learningEngine: LearningEngineAgent;
//# sourceMappingURL=learning-engine.d.ts.map