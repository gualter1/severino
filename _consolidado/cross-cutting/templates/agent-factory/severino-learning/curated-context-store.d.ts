import { CuratedContext } from "./curated-context.js";
/**
 * Store simples baseado em arquivos JSON (um por contexto).
 * Fácil de inspecionar, versionar (git), migrar para DB depois.
 */
export declare class CuratedContextStore {
    private ensureDir;
    private filePath;
    /**
     * Carrega contexto curado ou retorna null se não existe.
     */
    get(domain: string, taskSignature: string): Promise<CuratedContext | null>;
    /**
     * Salva contexto curado (cria ou atualiza).
     */
    set(context: CuratedContext): Promise<void>;
    /**
     * Lista todos os contextos curados.
     */
    list(): Promise<CuratedContext[]>;
    /**
     * Deleta um contexto (para limpeza/testes).
     */
    delete(domain: string, taskSignature: string): Promise<void>;
}
/**
 * Instância singleton para uso direto.
 */
export declare const curatedContextStore: CuratedContextStore;
/**
 * Constrói o contexto de injeção para um robô baseado no objetivo da tarefa.
 * Busca contexto exato + contextos relacionados no mesmo domínio.
 */
export declare function buildInjectionContext(domain: string, objective: string, maxRelated?: number): Promise<{
    primary: CuratedContext | null;
    related: CuratedContext[];
    taskSignature: string;
}>;
/**
 * Formata o contexto curado para injeção no prompt do robô (markdown legível).
 */
export declare function formatContextForPrompt(injection: Awaited<ReturnType<typeof buildInjectionContext>>): string;
//# sourceMappingURL=curated-context-store.d.ts.map