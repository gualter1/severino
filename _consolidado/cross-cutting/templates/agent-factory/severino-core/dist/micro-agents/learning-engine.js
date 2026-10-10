import { severinoLearning, runLearningCycle } from "@severino-learning/index.js";
export class LearningEngineAgent {
    async buildContext(domain, objective) {
        return severinoLearning.buildContextForRobot(domain, objective);
    }
    async absorbReport(report) {
        return severinoLearning.absorbRobotReport(report);
    }
    async getContext(domain, taskSignature) {
        return severinoLearning.getContext(domain, taskSignature);
    }
    async listContexts() {
        return severinoLearning.listContexts();
    }
    async runFullCycle(domain, objective, executeRobot) {
        return runLearningCycle(domain, objective, executeRobot);
    }
    async exportKnowledge() {
        return severinoLearning.exportAll();
    }
}
export const learningEngine = new LearningEngineAgent();
//# sourceMappingURL=learning-engine.js.map