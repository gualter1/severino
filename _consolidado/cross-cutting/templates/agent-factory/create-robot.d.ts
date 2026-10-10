#!/usr/bin/env node
/**
 * 🏭 Fábrica de Robôs — Severino Agent Factory
 *
 * Uso:
 *   npx tsx create-robot.ts --role backend --id robot-backend-003 --name "API Specialist"
 *   npx tsx create-robot.ts --from-template backend --id robot-backend-004
 */
interface RobotConfig {
    id: string;
    role: string;
    name: string;
    description?: string;
    model?: string;
    capabilities?: string[];
    allowedDomains?: string[];
    skillKits?: string[];
    primaryLanguage?: string;
    framework?: string;
}
/**
 * Cria a estrutura completa do quarto do robô.
 */
export declare function createRobot(config: RobotConfig): Promise<string>;
/**
 * Lista robôs existentes.
 */
export declare function listRobots(): Promise<string[]>;
/**
 * Deleta um robô (cuidado!).
 */
export declare function deleteRobot(robotId: string): Promise<void>;
export {};
//# sourceMappingURL=create-robot.d.ts.map