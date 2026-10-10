import { loadConfig } from "../config.js";
import { learningEngine } from "./learning-engine.js";
import { modelRouter } from "../model-router.js";
import { promises as fs } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
export class GrillMeScheduler {
    config = loadConfig();
    sessions = new Map();
    intervalId = null;
    grillDir = join(this.config.roomsDir, "..", "grill-sessions");
    async initialize() {
        await fs.mkdir(this.grillDir, { recursive: true });
        await this.loadSessions();
        console.log("🔥 Grill Me Scheduler initialized");
    }
    async loadSessions() {
        try {
            const files = await fs.readdir(this.grillDir);
            for (const file of files) {
                if (file.endsWith(".json")) {
                    const content = await fs.readFile(join(this.grillDir, file), "utf-8");
                    const session = JSON.parse(content);
                    this.sessions.set(session.id, session);
                }
            }
        }
        catch {
            // Directory might not exist yet
        }
    }
    schedule(topic, cronExpression = "0 */6 * * *") {
        const session = {
            id: `grill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            topic,
            scheduledAt: new Date().toISOString(),
            status: "pending",
        };
        this.sessions.set(session.id, session);
        this.saveSession(session);
        console.log(`🔥 Grill Me scheduled: ${topic} (${cronExpression})`);
        return session;
    }
    async runGrillSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error(`Session not found: ${sessionId}`);
        session.status = "running";
        this.saveSession(session);
        try {
            // 1. Gather accumulated contexts
            const contexts = await learningEngine.listContexts();
            const recentContexts = contexts
                .filter(c => c.metrics.reportsAbsorbed > 0)
                .sort((a, b) => b.metrics.reportsAbsorbed - a.metrics.reportsAbsorbed)
                .slice(0, 20);
            // 2. Build prompt for model
            const contextSummary = recentContexts.map(c => `## ${c.domain}::${c.taskSignature} (v${c.version}, ${c.metrics.reportsAbsorbed} reports)
- Patterns: ${c.patterns.map(p => p.pattern).join("; ") || "none"}
- Traps: ${c.traps.map(t => t.description).join("; ") || "none"}
- Shortcuts: ${c.shortcuts.map(s => s.description).join("; ") || "none"}
- Speedup: ${c.metrics.avgTimeWithContextMs && c.metrics.avgTimeWithoutContextMs
                ? (c.metrics.avgTimeWithoutContextMs / c.metrics.avgTimeWithContextMs).toFixed(1) + "x"
                : "N/A"}`).join("\n\n");
            const prompt = `Você é o Severino Master, orchestrator de agentes de IA.

**Tópico da Sessão Grill Me:** ${session.topic}

**Contexto Acumulado (Últimas Execuções):**
${contextSummary || "Nenhum contexto acumulado ainda."}

**Sua Tarefa:**
Analise os padrões, armadilhas e atalhos aprendidos. Identifique:
1. **Insights principais** - O que funcionou bem? O que mudou?
2. **Riscos emergentes** - O que pode quebrar em escala?
3. **Action items** - O que devemos padronizar, documentar ou refatorar?
4. **Recomendações de arquitetura** - Mudanças no stack, padrões, convenções?

Responda em JSON com: { summary, insights[], risks[], actionItems[], recommendations[] }`;
            const response = await modelRouter.complete([
                { role: "system", content: "Você é um Tech Lead sênior analisando aprendizado organizacional. Responda APENAS em JSON válido com as chaves: summary, insights (array), risks (array), actionItems (array), recommendations (array). Seja conciso, acionável e direto." },
                { role: "user", content: prompt },
            ], { temperature: 0.3, maxTokens: 4096 });
            // Try to parse JSON from response
            let result = {};
            try {
                result = JSON.parse(response.content);
            }
            catch {
                // Fallback: extract JSON-like content if model returns text
                const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        result = JSON.parse(jsonMatch[0]);
                    }
                    catch {
                        result = { summary: response.content, insights: [], risks: [], actionItems: [], recommendations: [] };
                    }
                }
                else {
                    result = { summary: response.content, insights: [], risks: [], actionItems: [], recommendations: [] };
                }
            }
            session.status = "completed";
            session.completedAt = new Date().toISOString();
            session.summary = result.summary;
            session.insights = result.insights || [];
            session.actionItems = result.actionItems || [];
            this.saveSession(session);
            console.log(`✅ Grill Me completed: ${session.topic}`);
            return session;
        }
        catch (error) {
            session.status = "failed";
            session.completedAt = new Date().toISOString();
            this.saveSession(session);
            console.error(`❌ Grill Me failed:`, error.message);
            throw error;
        }
    }
    async runGrillNow(topic) {
        const session = this.schedule(topic, "manual");
        return this.runGrillSession(session.id);
    }
    startAutoGrill(cronExpression = "0 */6 * * *") {
        // Simple interval-based scheduler (6 hours default)
        const intervalMs = this.parseCronToMs(cronExpression);
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(async () => {
            try {
                await this.runGrillNow("Alinhamento periódico automático");
            }
            catch (e) {
                console.error("Auto Grill Me error:", e);
            }
        }, intervalMs);
        console.log(`🔥 Auto Grill Me started (every ${cronExpression})`);
    }
    stopAutoGrill() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("🔥 Auto Grill Me stopped");
        }
    }
    parseCronToMs(cron) {
        // Simplified: "0 */6 * * *" -> 6 hours
        const match = cron.match(/\*\/(\d+)/);
        if (match)
            return parseInt(match[1]) * 60 * 60 * 1000;
        return 6 * 60 * 60 * 1000; // default 6h
    }
    async saveSession(session) {
        await fs.writeFile(join(this.grillDir, `${session.id}.json`), JSON.stringify(session, null, 2));
    }
    listSessions() {
        return Array.from(this.sessions.values()).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
    }
    getSession(id) {
        return this.sessions.get(id);
    }
}
export const grillScheduler = new GrillMeScheduler();
//# sourceMappingURL=grill-scheduler.js.map