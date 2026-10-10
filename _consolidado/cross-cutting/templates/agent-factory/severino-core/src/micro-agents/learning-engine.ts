import { severinoLearning, runLearningCycle } from "@severino-learning/index.js";
import { ExecutionReport } from "@severino-learning/report-schema.js";

export class LearningEngineAgent {
  async buildContext(domain: string, objective: string) {
    return severinoLearning.buildContextForRobot(domain, objective);
  }

  async absorbReport(report: ExecutionReport) {
    return severinoLearning.absorbRobotReport(report);
  }

  async getContext(domain: string, taskSignature: string) {
    return severinoLearning.getContext(domain, taskSignature);
  }

  async listContexts() {
    return severinoLearning.listContexts();
  }

  async runFullCycle(
    domain: string,
    objective: string,
    executeRobot: (prompt: string) => Promise<{ result: any; report: ExecutionReport }>
  ) {
    return runLearningCycle(domain, objective, executeRobot);
  }

  async exportKnowledge() {
    return severinoLearning.exportAll();
  }
}

export const learningEngine = new LearningEngineAgent();