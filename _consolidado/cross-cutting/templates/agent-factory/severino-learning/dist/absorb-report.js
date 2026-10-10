import { curatedContextStore } from "./curated-context-store.js";
/**
 * Função de alto nível: processa relatório e retorna resumo para log do Severino.
 */
export async function processReportAndSummarize(report) {
    const result = await absorbReport(report);
    const ctx = result.contextUpdated;
    const lines = [
        `🧠 **Learning Loop: Relatório absorvido**`,
        `   Tarefa: \`${report.meta.taskSignature}\` (${report.meta.domain})`,
        `   Contexto: v${ctx.version} | Relatórios totais: ${ctx.metrics.reportsAbsorbed}`,
        `   Novos: ${result.newPatterns} padrões, ${result.newTraps} armadilhas, ${result.newShortcuts} atalhos`,
        `   Promovidos: ${result.promotedShortcuts} skills → official`,
    ];
    if (ctx.metrics.avgTimeWithContextMs && ctx.metrics.avgTimeWithoutContextMs) {
        const speedup = (ctx.metrics.avgTimeWithoutContextMs / ctx.metrics.avgTimeWithContextMs).toFixed(1);
        lines.push(`   ⚡ Speedup atual: **${speedup}x**`);
    }
    return lines.join("\n");
}
/**
 * Absorve um relatório de execução e atualiza o contexto curado.
 * Esta é a função principal do Learning Loop do Severino.
 */
export async function absorbReport(report) {
    const domain = report.meta.domain;
    const taskSignature = report.meta.taskSignature;
    // 1. Carrega contexto existente (ou cria vazio)
    let context = await curatedContextStore.get(domain, taskSignature);
    const isNewContext = !context;
    if (isNewContext) {
        context = createEmptyContext(domain, taskSignature);
    }
    // 2. Extrai e mescla padrões
    const newPatterns = await mergePatterns(context, report);
    // 3. Extrai e mescla armadilhas
    const newTraps = await mergeTraps(context, report);
    // 4. Extrai e mescla atalhos/skills
    const { newShortcuts, promotedShortcuts } = await mergeShortcuts(context, report);
    // 5. Atualiza métricas
    updateMetrics(context, report, isNewContext);
    // 6. Atualiza rastreabilidade
    context.sourceReportIds.push(report.meta.taskId);
    context.lastUpdated = new Date().toISOString();
    context.updatedBy = "severino-learning-loop";
    context.version += 1;
    // 7. Persiste
    await curatedContextStore.set(context);
    return {
        contextUpdated: context,
        newPatterns,
        newTraps,
        newShortcuts,
        promotedShortcuts,
    };
}
/**
 * Cria contexto vazio inicial.
 */
function createEmptyContext(domain, taskSignature) {
    return {
        domain,
        taskSignature,
        version: 1,
        patterns: [],
        traps: [],
        shortcuts: [],
        metrics: {},
        sourceReportIds: [],
        lastUpdated: new Date().toISOString(),
        updatedBy: "severino-learning-loop",
    };
}
/**
 * Mescla padrões do relatório no contexto.
 */
async function mergePatterns(context, report) {
    let added = 0;
    // Padrões vêm de: decisions, steps bem-sucedidos, shortcuts usados
    const candidatePatterns = [];
    // Da decisions: decisões que deram certo
    for (const d of report.decisions) {
        candidatePatterns.push({
            pattern: d.decision,
            trigger: extractTriggerFromObjective(report.objective),
            domain: report.meta.domain,
            confidence: 0.7,
            sourceReports: [report.meta.taskId],
        });
    }
    // Dos steps: sequências que funcionaram
    const successfulSteps = report.steps.filter(s => s.outcome === "success");
    if (successfulSteps.length >= 2) {
        const sequence = successfulSteps.map(s => `${s.tool}:${s.action}`).join(" → ");
        candidatePatterns.push({
            pattern: `Sequência funcionou: ${sequence}`,
            trigger: extractTriggerFromObjective(report.objective),
            domain: report.meta.domain,
            confidence: 0.6,
            sourceReports: [report.meta.taskId],
        });
    }
    // Mescla: evita duplicatas por similaridade simples
    for (const candidate of candidatePatterns) {
        if (!candidate.pattern || !candidate.trigger)
            continue;
        const existing = context.patterns.find(p => similarity(p.pattern, candidate.pattern) > 0.7 &&
            similarity(p.trigger, candidate.trigger) > 0.7);
        if (existing) {
            existing.confidence = Math.min(0.95, existing.confidence + 0.05);
            existing.timesApplied += 1;
            existing.sourceReports.push(report.meta.taskId);
            existing.updatedAt = new Date().toISOString();
        }
        else {
            context.patterns.push({
                id: uuidv4(),
                pattern: candidate.pattern,
                trigger: candidate.trigger,
                domain: candidate.domain,
                confidence: candidate.confidence || 0.7,
                sourceReports: [report.meta.taskId],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timesApplied: 1,
                timesConfirmed: 0,
                timesContradicted: 0,
            });
            added++;
        }
    }
    return added;
}
/**
 * Mescla armadilhas do relatório no contexto.
 */
async function mergeTraps(context, report) {
    let added = 0;
    for (const trap of report.traps) {
        const existing = context.traps.find(t => similarity(t.trap, trap.trap) > 0.7);
        if (existing) {
            existing.timesEncountered += 1;
            existing.sourceReports.push(report.meta.taskId);
            existing.updatedAt = new Date().toISOString();
            // Se a prevenção funcionou (trap não ocorreu nesta execução), incrementa prevented
            // Nota: isso seria detectado comparando com execuções anteriores - simplificado aqui
        }
        else {
            context.traps.push({
                id: uuidv4(),
                trap: trap.trap,
                symptom: trap.workaround || "Não especificado",
                rootCause: trap.prevention,
                prevention: trap.prevention,
                domain: report.meta.domain,
                severity: trap.impact === "bug" ? "high" : trap.impact === "lost-time" ? "medium" : "low",
                sourceReports: [report.meta.taskId],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timesEncountered: 1,
                timesPrevented: 0,
            });
            added++;
        }
    }
    return added;
}
/**
 * Mescla atalhos/skills do relatório no contexto.
 * Promove candidates → validated → official baseado em evidência.
 */
async function mergeShortcuts(context, report) {
    let added = 0;
    let promoted = 0;
    // 1. Skills reutilizadas com sucesso viram shortcuts validados
    for (const tool of report.toolsUsed) {
        if (tool.name.startsWith("skill:")) {
            const existing = context.shortcuts.find(s => s.name === tool.name);
            if (existing) {
                if (existing.status === "candidate") {
                    existing.status = "validated";
                    promoted++;
                }
                existing.sourceReports.push(report.meta.taskId);
                existing.updatedAt = new Date().toISOString();
            }
            else {
                context.shortcuts.push({
                    id: uuidv4(),
                    name: tool.name,
                    type: "skill",
                    description: tool.purpose,
                    trigger: extractTriggerFromObjective(report.objective),
                    domain: report.meta.domain,
                    estimatedTimeSaved: "~2-5min",
                    version: tool.version,
                    sourceReports: [report.meta.taskId],
                    status: "validated",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                added++;
            }
        }
    }
    // 2. Candidatas a skill descobertas durante a execução
    for (const candidate of report.skillCandidates) {
        const existing = context.shortcuts.find(s => similarity(s.name, candidate.name) > 0.6 ||
            similarity(s.trigger, candidate.triggerPattern) > 0.7);
        if (existing) {
            existing.sourceReports.push(report.meta.taskId);
            existing.updatedAt = new Date().toISOString();
            // Se já validada em múltiplos relatórios, promove a official
            const uniqueReports = new Set(existing.sourceReports).size;
            if (uniqueReports >= 3 && existing.status === "validated") {
                existing.status = "official";
                promoted++;
            }
        }
        else {
            context.shortcuts.push({
                id: uuidv4(),
                name: candidate.name,
                type: "skill",
                description: candidate.description,
                trigger: candidate.triggerPattern,
                domain: report.meta.domain,
                estimatedTimeSaved: candidate.estimatedTimeSaved,
                sourceReports: [report.meta.taskId],
                status: "candidate",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            added++;
        }
    }
    return { newShortcuts: added, promotedShortcuts: promoted };
}
/**
 * Atualiza métricas de efetividade do contexto.
 */
function updateMetrics(context, report, isNewContext) {
    const m = context.metrics;
    m.reportsAbsorbed += 1;
    if (isNewContext) {
        m.avgTimeWithoutContextMs = report.metrics.totalTimeMs;
        m.successRateWithoutContext = report.metrics.testsFailed > 0 ? 0 : 1;
    }
    else {
        // Atualiza média móvel simples
        const n = m.reportsAbsorbed;
        if (m.avgTimeWithContextMs) {
            m.avgTimeWithContextMs = Math.round((m.avgTimeWithContextMs * (n - 1) + report.metrics.totalTimeMs) / n);
        }
        else {
            m.avgTimeWithContextMs = report.metrics.totalTimeMs;
        }
        if (m.successRateWithContext !== undefined) {
            const success = report.metrics.testsFailed === 0 && report.metrics.lintErrors === 0 && report.metrics.typeErrors === 0 ? 1 : 0;
            m.successRateWithContext = (m.successRateWithContext * (n - 1) + success) / n;
        }
        else {
            m.successRateWithContext = report.metrics.testsFailed === 0 ? 1 : 0;
        }
    }
}
/**
 * Extrai gatilho simples do objetivo (heurística).
 */
function extractTriggerFromObjective(objective) {
    const verbs = ["criar", "implementar", "adicionar", "fazer", "configurar", "corrigir", "atualizar"];
    const lower = objective.toLowerCase();
    for (const v of verbs) {
        const idx = lower.indexOf(v);
        if (idx >= 0) {
            const after = lower.slice(idx + v.length).trim();
            const words = after.split(/\s+/).slice(0, 4).join(" ");
            return `${v} ${words}`;
        }
    }
    return objective.slice(0, 80);
}
/**
 * Similaridade simples de Jaccard entre strings (para dedup).
 */
function similarity(a, b) {
    const setA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    const setB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
}
/**
 * Gera ID único simples (usa crypto.randomUUID se disponível).
 */
function uuidv4() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//# sourceMappingURL=absorb-report.js.map