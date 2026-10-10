import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { CuratedContextSchema, contextKey, deriveTaskSignature } from "./curated-context.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STORE_DIR = join(__dirname, "curated-contexts");
/**
 * Store simples baseado em arquivos JSON (um por contexto).
 * Fácil de inspecionar, versionar (git), migrar para DB depois.
 */
export class CuratedContextStore {
    ensureDir = async () => {
        await fs.mkdir(STORE_DIR, { recursive: true });
    };
    filePath(key) {
        return join(STORE_DIR, `${key.replace(/[^a-z0-9_-]/gi, "_")}.json`);
    }
    /**
     * Carrega contexto curado ou retorna null se não existe.
     */
    async get(domain, taskSignature) {
        await this.ensureDir();
        const key = contextKey(domain, taskSignature);
        const path = this.filePath(key);
        try {
            const content = await fs.readFile(path, "utf-8");
            return CuratedContextSchema.parse(JSON.parse(content));
        }
        catch (e) {
            if (e.code === "ENOENT")
                return null;
            throw e;
        }
    }
    /**
     * Salva contexto curado (cria ou atualiza).
     */
    async set(context) {
        await this.ensureDir();
        const key = contextKey(context.domain, context.taskSignature);
        const path = this.filePath(key);
        const content = JSON.stringify(context, null, 2);
        await fs.writeFile(path, content, "utf-8");
    }
    /**
     * Lista todos os contextos curados.
     */
    async list() {
        await this.ensureDir();
        const files = await fs.readdir(STORE_DIR);
        const contexts = [];
        for (const file of files) {
            if (!file.endsWith(".json"))
                continue;
            try {
                const content = await fs.readFile(join(STORE_DIR, file), "utf-8");
                const parsed = CuratedContextSchema.parse(JSON.parse(content));
                contexts.push(parsed);
            }
            catch {
                // ignora arquivos corrompidos
            }
        }
        return contexts.sort((a, b) => b.metrics.reportsAbsorbed - a.metrics.reportsAbsorbed);
    }
    /**
     * Deleta um contexto (para limpeza/testes).
     */
    async delete(domain, taskSignature) {
        const key = contextKey(domain, taskSignature);
        const path = this.filePath(key);
        try {
            await fs.unlink(path);
        }
        catch (e) {
            if (e.code !== "ENOENT")
                throw e;
        }
    }
}
/**
 * Instância singleton para uso direto.
 */
export const curatedContextStore = new CuratedContextStore();
/**
 * Constrói o contexto de injeção para um robô baseado no objetivo da tarefa.
 * Busca contexto exato + contextos relacionados no mesmo domínio.
 */
export async function buildInjectionContext(domain, objective, maxRelated = 3) {
    const taskSignature = deriveTaskSignature(objective);
    const primary = await curatedContextStore.get(domain, taskSignature);
    // Busca contextos relacionados no mesmo domínio (para cross-pollination)
    const all = await curatedContextStore.list();
    const related = all
        .filter(c => c.domain === domain && c.taskSignature !== taskSignature)
        .slice(0, maxRelated);
    return { primary, related, taskSignature };
}
/**
 * Formata o contexto curado para injeção no prompt do robô (markdown legível).
 */
export function formatContextForPrompt(injection) {
    const { primary, related, taskSignature } = injection;
    const lines = [];
    lines.push(`## 📥 CONTEXTO CURADO PARA: \`${taskSignature}\` (v${primary?.version || 0})`);
    lines.push("");
    if (primary) {
        lines.push("### 🎯 Padrões Validados");
        for (const p of primary.patterns) {
            lines.push(`- **${p.trigger}** → ${p.pattern} (confiança: ${Math.round(p.confidence * 100)}%, aplicado ${p.timesApplied}x)`);
        }
        lines.push("");
        lines.push("### ⚠️ Armadilhas Conhecidas");
        for (const t of primary.traps) {
            lines.push(`- **${t.trap}** — *Sintoma: ${t.symptom}*`);
            lines.push(`  ✅ Prevenção: ${t.prevention}`);
            if (t.timesPrevented > 0)
                lines.push(`  🛡️ Já preveniu ${t.timesPrevented}x`);
        }
        lines.push("");
        lines.push("### ⚡ Atalhos & Skills Recomendados");
        for (const s of primary.shortcuts) {
            const badge = s.status === "official" ? "✅ OFICIAL" : s.status === "validated" ? "✓ VALIDADO" : "🧪 CANDIDATA";
            lines.push(`- **${s.name}** (${badge}) — ${s.description}`);
            lines.push(`  Gatilho: "${s.trigger}" | Economia estimada: ${s.estimatedTimeSaved}`);
        }
        lines.push("");
        lines.push("### 📊 Métricas de Efetividade");
        lines.push(`- Relatórios absorvidos: ${primary.metrics.reportsAbsorbed}`);
        if (primary.metrics.avgTimeWithContextMs && primary.metrics.avgTimeWithoutContextMs) {
            const speedup = (primary.metrics.avgTimeWithoutContextMs / primary.metrics.avgTimeWithContextMs).toFixed(1);
            lines.push(`- Tempo médio SEM contexto: ${Math.round(primary.metrics.avgTimeWithoutContextMs / 1000)}s`);
            lines.push(`- Tempo médio COM contexto: ${Math.round(primary.metrics.avgTimeWithContextMs / 1000)}s`);
            lines.push(`- **Speedup: ${speedup}x**`);
        }
    }
    else {
        lines.push("*Nenhum contexto curado ainda para esta assinatura. Primeira execução — será lenta, mas gerará aprendizado.*");
        lines.push("");
    }
    if (related.length > 0) {
        lines.push("### 🔗 Contextos Relacionados (mesmo domínio)");
        for (const r of related) {
            lines.push(`- \`${r.taskSignature}\` (v${r.version}) — ${r.patterns.length} padrões, ${r.traps.length} armadilhas, ${r.shortcuts.length} atalhos`);
        }
    }
    return lines.join("\n");
}
//# sourceMappingURL=curated-context-store.js.map